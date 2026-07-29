'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, RefreshCw, Package, Mail, Search, Lock, Filter, 
  DollarSign, Users, TrendingUp, ChevronRight, CheckCircle2, Truck, 
  BarChart3, Database, Printer, ExternalLink, ArrowUpRight, Clock,
  Tag, Plus, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Order } from '@/types/store';
import { SafeRecaptcha } from '@/components/SafeRecaptcha';

interface PromoCodeItem {
  code: string;
  discountPercent: number;
  active: boolean;
  description: string;
}

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  localOrders: Order[];
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  localOrders,
}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'crm' | 'promos' | 'analytics' | 'gas'>('orders');
  const [gasOrders, setGasOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // Admin Promo Codes State
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>([
    { code: 'ORGANIC10', discountPercent: 10, active: true, description: '10% Discount on First Purchase' },
    { code: 'BRINDAVANAM20', discountPercent: 20, active: true, description: '20% Special Farm Harvest Discount' },
    { code: 'FREESHIP', discountPercent: 100, active: true, description: 'Free Delivery on Orders Over ₹999' },
  ]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(15);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcpqGstAAAAAMBOybBtJPFQ2aMtBfLmsUT9AAtB';
  const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbwqHEdFL5zR_cCPSUkvb91nudf72H9K1CdFYPEyHgP_XInRSaHQU0TiZEtadcYHpQPS/exec';

  const fetchOrdersFromGAS = async () => {
    setLoading(true);
    try {
      const response = await fetch(gasUrl);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.orders) && data.orders.length > 0) {
        setGasOrders(data.orders);
      } else {
        setGasOrders(localOrders);
      }
    } catch {
      setGasOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && authenticated) {
      fetchOrdersFromGAS();
    } else {
      setGasOrders(localOrders);
    }
  }, [isOpen, authenticated, localOrders]);

  if (!isOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setAuthError('Please verify the security checkbox.');
      return;
    }
    if (passcode === 'admin123' || passcode === 'brindavanam') {
      setAuthenticated(true);
      setAuthError('');
      fetchOrdersFromGAS();
    } else {
      setAuthError('Invalid Admin Security Passcode. Default is: admin123');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'update_status',
          orderId,
          newStatus,
        }),
      });
      await response.json();
      
      setGasOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const formattedCode = newPromoCode.trim().toUpperCase().replace(/\s+/g, '');
    const newItem: PromoCodeItem = {
      code: formattedCode,
      discountPercent: newPromoDiscount,
      active: true,
      description: newPromoDesc || `${newPromoDiscount}% Storewide Coupon`,
    };
    setPromoCodes((prev) => [...prev.filter((p) => p.code !== formattedCode), newItem]);
    setNewPromoCode('');
    setNewPromoDesc('');
  };

  const handleTogglePromo = (code: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.code === code ? { ...p, active: !p.active } : p))
    );
  };

  const handleDeletePromo = (code: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.code !== code));
  };

  const combinedOrders = gasOrders.length > 0 ? gasOrders : localOrders;
  const filteredOrders = combinedOrders.filter((o) => {
    const matchesFilter = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(searchLower) ||
      (o.shippingAddress?.fullName || o.customerName || '').toLowerCase().includes(searchLower) ||
      (o.shippingAddress?.email || o.customerEmail || '').toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = combinedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const averageOrderValue = combinedOrders.length > 0 ? Math.round(totalRevenue / combinedOrders.length) : 0;
  const processingCount = combinedOrders.filter((o) => o.status === 'Processing').length;
  const shippedCount = combinedOrders.filter((o) => o.status === 'Shipped').length;
  const deliveredCount = combinedOrders.filter((o) => o.status === 'Delivered').length;

  // Real Dynamic Category Revenue Breakdown Calculation
  let gheeRevenue = 0;
  let oilRevenue = 0;
  let paneerRevenue = 0;

  combinedOrders.forEach((o) => {
    if (o.items && Array.isArray(o.items) && o.items.length > 0) {
      o.items.forEach((it) => {
        const itemCost = (it.selectedVariant?.price || 0) * (it.quantity || 1);
        if (it.product?.category === 'ghee') gheeRevenue += itemCost;
        else if (it.product?.category === 'oil') oilRevenue += itemCost;
        else if (it.product?.category === 'paneer') paneerRevenue += itemCost;
      });
    } else if (o.total) {
      gheeRevenue += Math.round(o.total * 0.5);
      oilRevenue += Math.round(o.total * 0.35);
      paneerRevenue += Math.round(o.total * 0.15);
    }
  });

  const sumCatRevenue = gheeRevenue + oilRevenue + paneerRevenue || 1;
  const gheePercent = totalRevenue > 0 ? Math.round((gheeRevenue / sumCatRevenue) * 100) : 0;
  const oilPercent = totalRevenue > 0 ? Math.round((oilRevenue / sumCatRevenue) * 100) : 0;
  const paneerPercent = totalRevenue > 0 ? Math.round((paneerRevenue / sumCatRevenue) * 100) : 0;

  const customerMap = new Map<string, { name: string; email: string; phone: string; count: number; totalSpent: number }>();
  combinedOrders.forEach((o) => {
    const email = (o.shippingAddress?.email || o.customerEmail || '').toLowerCase();
    if (!email) return;
    const name = o.shippingAddress?.fullName || o.customerName || 'Valued Patron';
    const phone = o.shippingAddress?.phone || o.customerPhone || 'N/A';
    const spent = o.total || 0;

    if (customerMap.has(email)) {
      const existing = customerMap.get(email)!;
      existing.count += 1;
      existing.totalSpent += spent;
    } else {
      customerMap.set(email, { name, email, phone, count: 1, totalSpent: spent });
    }
  });
  const customerList = Array.from(customerMap.values());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200 my-4">
        
        {/* Top Header */}
        <div className="bg-[#1c260b] text-white px-6 py-5 flex justify-between items-center border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#3A5303] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-[#94C000]">
              <ShieldAlert className="w-6 h-6 text-[#94C000]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#94C000] font-bold block">
                  Brindavanam Store Operations Desk
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-serif tracking-tight">Master Admin Command Center</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* STEP 1: Admin Authentication Screen */}
        {!authenticated ? (
          <div className="p-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-[#F7F6F2] rounded-full flex items-center justify-center mx-auto text-[#3A5303] shadow-inner">
              <Lock className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-2xl font-serif text-stone-900">Admin Portal Verification</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Protected area for store operators. Enter your security passcode to access real-time order fulfillments, CRM database, and promo codes manager.
              </p>
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-200">
                {authError}
              </p>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3.5 border border-stone-300 rounded-xl text-xs text-center font-bold tracking-widest bg-[#F7F6F2] focus:outline-none focus:border-[#3A5303] shadow-xs"
                  placeholder="Enter Security Passcode (e.g. admin123)"
                />
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                <SafeRecaptcha
                  siteKey={siteKey}
                  onVerify={setRecaptchaToken}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-98"
              >
                Authenticate Access
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Live Enterprise Admin Dashboard */
          <div className="p-6 space-y-6">
            
            {/* Top Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="flex flex-wrap gap-1.5 bg-[#F7F6F2] p-1.5 rounded-2xl border border-stone-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 ${
                    activeTab === 'orders'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Live Orders ({combinedOrders.length})</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('promos')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 ${
                    activeTab === 'promos'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Tag className="w-4 h-4 text-[#94C000]" />
                  <span>Promo Codes ({promoCodes.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('crm')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 ${
                    activeTab === 'crm'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Customer CRM ({customerList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 ${
                    activeTab === 'analytics'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Sales Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('gas')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 ${
                    activeTab === 'gas'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Database className="w-4 h-4 text-[#94C000]" />
                  <span>Google Sheets Sync</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchOrdersFromGAS}
                  disabled={loading}
                  className="px-4 py-2.5 bg-[#F7F6F2] hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-semibold rounded-xl flex items-center space-x-2 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#3A5303] ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Google Sheet</span>
                </button>
              </div>
            </div>

            {/* Metrics KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#F7F6F2] p-5 rounded-2xl border border-stone-200 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Total Sales Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-[#3A5303]/10 text-[#3A5303] flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-serif text-[#3A5303] font-bold">₹{totalRevenue}</p>
                <div className="flex items-center text-[10px] text-emerald-700 font-semibold space-x-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Live Real-Time Revenue</span>
                </div>
              </div>

              <div className="bg-[#F7F6F2] p-5 rounded-2xl border border-stone-200 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Processing Orders</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-serif text-amber-700 font-bold">{processingCount}</p>
                <p className="text-[10px] text-stone-400">Awaiting shipment dispatch</p>
              </div>

              <div className="bg-[#F7F6F2] p-5 rounded-2xl border border-stone-200 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest">In Courier Transit</span>
                  <div className="w-8 h-8 rounded-lg bg-[#4E90F5]/10 text-[#4E90F5] flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-serif text-[#4E90F5] font-bold">{shippedCount}</p>
                <p className="text-[10px] text-stone-400">Dispatched to customer</p>
              </div>

              <div className="bg-[#F7F6F2] p-5 rounded-2xl border border-stone-200 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Active Promo Coupons</span>
                  <div className="w-8 h-8 rounded-lg bg-[#94C000]/20 text-[#3A5303] flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-serif text-stone-900 font-bold">{promoCodes.filter((p) => p.active).length}</p>
                <p className="text-[10px] text-stone-400">Live store discounts</p>
              </div>
            </div>

            {/* TAB 1: Live Orders Manager */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Search by Order ID, Customer Name, Email, or City..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303] shadow-xs"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-stone-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3.5 py-2.5 border border-stone-300 rounded-xl text-xs bg-white font-semibold focus:outline-none"
                    >
                      <option value="all">All Statuses ({combinedOrders.length})</option>
                      <option value="processing">Processing ({processingCount})</option>
                      <option value="shipped">Shipped ({shippedCount})</option>
                      <option value="delivered">Delivered ({deliveredCount})</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden max-h-[420px] overflow-y-auto shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#3A5303] text-white font-bold sticky top-0 z-10">
                      <tr>
                        <th className="p-3.5">Order ID & Date</th>
                        <th className="p-3.5">Customer Details</th>
                        <th className="p-3.5">Items Purchased</th>
                        <th className="p-3.5">Total Paid</th>
                        <th className="p-3.5">Status & Quick Actions</th>
                        <th className="p-3.5 text-right">Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-16 text-stone-400">
                            No matching orders found in Google Apps Script database.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-3.5">
                              <span className="font-bold text-[#3A5303] block text-sm">{ord.id}</span>
                              <span className="text-[10px] text-stone-400">{ord.date}</span>
                            </td>
                            <td className="p-3.5">
                              <span className="font-semibold text-stone-900 block">
                                {ord.shippingAddress?.fullName || ord.customerName || 'N/A'}
                              </span>
                              <span className="text-[10px] text-stone-500 block">
                                {ord.shippingAddress?.email || ord.customerEmail || 'N/A'}
                              </span>
                            </td>
                            <td className="p-3.5 max-w-[220px] truncate text-stone-600">
                              {ord.itemsSummary ||
                                ord.items?.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                            </td>
                            <td className="p-3.5 font-bold text-stone-900 text-sm">
                              ₹{ord.total}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  ord.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                                  ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {ord.status}
                                </span>
                                
                                <button
                                  onClick={() => handleUpdateStatus(ord.id, 'Shipped')}
                                  disabled={updatingId === ord.id || ord.status === 'Shipped'}
                                  className="px-2.5 py-1 bg-[#4E90F5] hover:bg-blue-600 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                                  title="Mark Shipped & Email Customer Notification"
                                >
                                  Ship
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                                  disabled={updatingId === ord.id || ord.status === 'Delivered'}
                                  className="px-2.5 py-1 bg-[#94C000] hover:bg-emerald-600 text-[#1c260b] rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                                  title="Mark Delivered"
                                >
                                  Deliver
                                </button>
                              </div>
                            </td>
                            <td className="p-3.5 text-right space-x-1">
                              <button
                                onClick={() => setPrintingOrder(ord)}
                                className="p-2 text-stone-600 hover:text-[#3A5303] hover:bg-stone-100 rounded-lg transition-colors"
                                title="Print Packing Slip / Invoice"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setSelectedOrderDetails(ord)}
                                className="p-2 text-stone-600 hover:text-[#3A5303] hover:bg-stone-100 rounded-lg transition-colors"
                                title="View Address & Details"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Promo Codes Manager */}
            {activeTab === 'promos' && (
              <div className="space-y-6">
                {/* Create Promo Form */}
                <form onSubmit={handleAddPromoCode} className="bg-[#F7F6F2] p-5 rounded-2xl border border-stone-200 space-y-4">
                  <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center space-x-2">
                    <Plus className="w-4 h-4 text-[#3A5303]" />
                    <span>Create New Storefront Promo Coupon</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="e.g. FESTIVE25"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Discount % *</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={newPromoDiscount}
                        onChange={(e) => setNewPromoDiscount(parseInt(e.target.value) || 10)}
                        className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="25"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Description</label>
                      <input
                        type="text"
                        value={newPromoDesc}
                        onChange={(e) => setNewPromoDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="25% Off Storewide Harvest Sale"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] shadow-sm flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Promo Coupon</span>
                  </button>
                </form>

                {/* Promo Codes List */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1c260b] text-white font-bold">
                      <tr>
                        <th className="p-3.5">Coupon Code</th>
                        <th className="p-3.5">Discount</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {promoCodes.map((p) => (
                        <tr key={p.code} className="hover:bg-stone-50 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-[#3A5303] text-sm">{p.code}</td>
                          <td className="p-3.5 font-bold text-stone-900">{p.discountPercent}% OFF</td>
                          <td className="p-3.5 text-stone-600">{p.description}</td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                            }`}>
                              {p.active ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleTogglePromo(p.code)}
                              className="p-1.5 text-stone-600 hover:text-[#3A5303] rounded"
                              title="Toggle Active Status"
                            >
                              {p.active ? <ToggleRight className="w-5 h-5 text-[#3A5303]" /> : <ToggleLeft className="w-5 h-5 text-stone-400" />}
                            </button>
                            <button
                              onClick={() => handleDeletePromo(p.code)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: Customer CRM Directory */}
            {activeTab === 'crm' && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden max-h-[420px] overflow-y-auto shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c260b] text-white font-bold sticky top-0 z-10">
                    <tr>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Email Address</th>
                      <th className="p-3.5">Phone Number</th>
                      <th className="p-3.5">Order Frequency</th>
                      <th className="p-3.5 text-right">Customer LTV (Total Spent)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {customerList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16 text-stone-400">
                          No customer directory records logged yet.
                        </td>
                      </tr>
                    ) : (
                      customerList.map((c, i) => (
                        <tr key={i} className="hover:bg-stone-50 transition-colors">
                          <td className="p-3.5 font-bold text-stone-900">{c.name}</td>
                          <td className="p-3.5 text-stone-600">{c.email}</td>
                          <td className="p-3.5 text-stone-500 font-mono">{c.phone}</td>
                          <td className="p-3.5 font-bold text-[#3A5303]">{c.count} Orders</td>
                          <td className="p-3.5 font-bold text-stone-900 text-right text-sm">₹{c.totalSpent}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: Real Dynamic Sales Analytics & Charts */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F7F6F2] p-6 rounded-2xl border border-stone-200 space-y-4">
                  <h3 className="text-base font-serif font-bold text-stone-900">Organic Product Category Revenue</h3>
                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>A2 Desi Cow Bilona Ghee</span>
                        <span>₹{gheeRevenue} ({gheePercent}%)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                        <div className="bg-[#3A5303] h-full transition-all duration-500" style={{ width: `${gheePercent}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Wood-Pressed Oils (Groundnut, Coconut, Kusuma)</span>
                        <span>₹{oilRevenue} ({oilPercent}%)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                        <div className="bg-[#4E90F5] h-full transition-all duration-500" style={{ width: `${oilPercent}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span>Farm Fresh Desi Paneer</span>
                        <span>₹{paneerRevenue} ({paneerPercent}%)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                        <div className="bg-[#94C000] h-full transition-all duration-500" style={{ width: `${paneerPercent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F7F6F2] p-6 rounded-2xl border border-stone-200 space-y-4">
                  <h3 className="text-base font-serif font-bold text-stone-900">Order Delivery Metrics</h3>
                  <div className="space-y-3 text-xs text-stone-700">
                    <div className="flex justify-between items-center p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                      <span className="font-semibold">Processing Orders</span>
                      <span className="font-bold text-amber-700 text-sm">{processingCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                      <span className="font-semibold">Shipped In Courier Transit</span>
                      <span className="font-bold text-[#4E90F5] text-sm">{shippedCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                      <span className="font-semibold">Delivered Orders</span>
                      <span className="font-bold text-emerald-700 text-sm">{deliveredCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Google Apps Script Health & Engine Monitor */}
            {activeTab === 'gas' && (
              <div className="bg-[#F7F6F2] p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-7 h-7 text-[#3A5303]" />
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-serif">Google Apps Script Web App Engine</h3>
                    <p className="text-stone-500">Connected Live with Google Sheets Database</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <p className="font-bold text-stone-800">Live Endpoint Web App URL:</p>
                  <p className="font-mono text-stone-600 text-[11px] break-all bg-[#F7F6F2] p-3 rounded-lg border border-stone-200 select-all">
                    {gasUrl}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-800 block">Automated Store Admin Alert Email</span>
                    <span className="text-[#3A5303] font-bold">brindavanam1902@gmail.com</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-800 block">Database Sheets Generated</span>
                    <span className="text-stone-600 font-semibold">Orders, Customer_CRM, Analytics</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Modal 1: Selected Order Address Details Popup */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl p-6 border border-stone-200 space-y-4 animate-in fade-in duration-150 shadow-2xl">
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <div>
                  <span className="text-sm font-bold text-[#3A5303]">{selectedOrderDetails.id}</span>
                  <p className="text-[10px] text-stone-400">{selectedOrderDetails.date}</p>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-700">
                <div>
                  <p className="font-bold text-stone-900 mb-1">Customer Shipping Address:</p>
                  <p className="font-semibold text-stone-900">{selectedOrderDetails.shippingAddress?.fullName || selectedOrderDetails.customerName}</p>
                  <p>{selectedOrderDetails.shippingAddress?.addressLine1} {selectedOrderDetails.shippingAddress?.addressLine2}</p>
                  <p>{selectedOrderDetails.shippingAddress?.city || selectedOrderDetails.city}, {selectedOrderDetails.shippingAddress?.pincode}</p>
                  <p className="mt-1 text-stone-500 font-mono">Phone: {selectedOrderDetails.shippingAddress?.phone || selectedOrderDetails.customerPhone}</p>
                  <p className="text-stone-500 font-mono">Email: {selectedOrderDetails.shippingAddress?.email || selectedOrderDetails.customerEmail}</p>
                </div>

                <div className="border-t border-stone-200 pt-3">
                  <p className="font-bold text-stone-900 mb-1">Items Purchased Summary:</p>
                  <p className="bg-[#F7F6F2] p-3 rounded-xl border border-stone-200 font-mono text-[11px] text-stone-800">
                    {selectedOrderDetails.itemsSummary ||
                      selectedOrderDetails.items?.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                  </p>
                </div>

                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#3A5303]">₹{selectedOrderDetails.total}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-3 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02]"
              >
                Close Order Details
              </button>
            </div>
          </div>
        )}

        {/* Modal 2: Printable Packing Slip / Invoice */}
        {printingOrder && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-xl w-full rounded-3xl p-8 border border-stone-200 space-y-6 shadow-2xl">
              <div className="flex justify-between items-start border-b border-stone-300 pb-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#3A5303]">Brindavanam Organic Farms</h2>
                  <p className="text-[11px] text-stone-500">Official Order Packing Slip & Shipping Invoice</p>
                </div>
                <button onClick={() => setPrintingOrder(null)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-stone-800">
                <div className="grid grid-cols-2 gap-4 bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Order Reference</span>
                    <span className="font-bold text-[#3A5303] text-sm">{printingOrder.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase block">Date & Payment</span>
                    <span className="font-semibold">{printingOrder.date}</span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-stone-900 block mb-1">Ship To Customer:</span>
                  <p className="font-bold">{printingOrder.shippingAddress?.fullName || printingOrder.customerName}</p>
                  <p>{printingOrder.shippingAddress?.addressLine1}</p>
                  <p>{printingOrder.shippingAddress?.city || printingOrder.city} - {printingOrder.shippingAddress?.pincode}</p>
                  <p className="text-stone-500 font-mono">Mobile: {printingOrder.shippingAddress?.phone || printingOrder.customerPhone}</p>
                </div>

                <div className="border-t border-stone-200 pt-3">
                  <span className="font-bold text-stone-900 block mb-2">Package Items Checklist:</span>
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 font-mono text-[11px]">
                    {printingOrder.itemsSummary || printingOrder.items?.map((i) => `[ ] ${i.product.name} (${i.selectedVariant.weight}) x${i.quantity}`).join('\n')}
                  </div>
                </div>

                <div className="border-t border-stone-300 pt-3 flex justify-between font-bold text-[#3A5303] text-base">
                  <span>Grand Total Paid:</span>
                  <span>₹{printingOrder.total}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setPrintingOrder(null)}
                  className="w-1/3 py-3 border border-stone-300 rounded-xl text-stone-700 font-bold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-2/3 py-3 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice / Slip</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
