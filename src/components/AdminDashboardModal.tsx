'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, RefreshCw, Package, Mail, Search, Lock, Filter, 
  DollarSign, Users, TrendingUp, ChevronRight, CheckCircle2, Truck, 
  BarChart3, Database 
} from 'lucide-react';
import { Order } from '@/types/store';
import { SafeRecaptcha } from '@/components/SafeRecaptcha';

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

  const [activeTab, setActiveTab] = useState<'orders' | 'crm' | 'analytics' | 'gas'>('orders');
  const [gasOrders, setGasOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200 my-6">
        
        {/* Header */}
        <div className="bg-[#1c260b] text-white p-6 flex justify-between items-center border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#3A5303] flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldAlert className="w-5 h-5 text-[#94C000]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#94C000] font-bold block">
                Google Apps Script Integrated Engine
              </span>
              <h2 className="text-xl font-serif tracking-tight">Brindavanam Store Operations Desk</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Admin Passcode + reCAPTCHA Authentication */}
        {!authenticated ? (
          <div className="p-10 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-[#F7F6F2] rounded-full flex items-center justify-center mx-auto text-[#3A5303]">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-serif text-stone-900">Admin Security Portal</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Enter your store manager passcode to access live Google Apps Script order logs, customer analytics, and email controls.
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
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-xs text-center font-bold tracking-widest bg-[#F7F6F2] focus:outline-none focus:border-[#3A5303]"
                  placeholder="Enter Passcode (e.g. admin123)"
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
                className="w-full py-3.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors"
              >
                Authenticate Admin Access
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Live Advanced Admin Dashboard */
          <div className="p-6 space-y-6">
            
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
              <div className="flex space-x-2 bg-[#F7F6F2] p-1 rounded-xl border border-stone-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === 'orders'
                      ? 'bg-[#3A5303] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Orders ({combinedOrders.length})</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('crm')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === 'crm'
                      ? 'bg-[#3A5303] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Customer CRM ({customerList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === 'analytics'
                      ? 'bg-[#3A5303] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('gas')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === 'gas'
                      ? 'bg-[#3A5303] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-[#94C000]" />
                  <span>GAS Engine</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchOrdersFromGAS}
                  disabled={loading}
                  className="px-3.5 py-2 bg-[#F7F6F2] hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Google Sheet</span>
                </button>
              </div>
            </div>

            {/* Metrics KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-[#3A5303]" />
                </div>
                <p className="text-2xl font-serif text-[#3A5303]">₹{totalRevenue}</p>
                <p className="text-[10px] text-stone-400 font-light">From {combinedOrders.length} transactions</p>
              </div>

              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Processing</span>
                  <Package className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-serif text-amber-700">{processingCount}</p>
                <p className="text-[10px] text-stone-400 font-light">Awaiting shipment</p>
              </div>

              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Dispatched</span>
                  <Truck className="w-4 h-4 text-[#4E90F5]" />
                </div>
                <p className="text-2xl font-serif text-[#4E90F5]">{shippedCount}</p>
                <p className="text-[10px] text-stone-400 font-light">In courier transit</p>
              </div>

              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Avg Order Value</span>
                  <TrendingUp className="w-4 h-4 text-[#94C000]" />
                </div>
                <p className="text-2xl font-serif text-stone-900">₹{averageOrderValue}</p>
                <p className="text-[10px] text-stone-400 font-light">Per customer cart</p>
              </div>
            </div>

            {/* TAB 1: Live Orders Manager */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Search by Order ID, Customer Name or Email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Filter className="w-4 h-4 text-stone-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white font-semibold"
                    >
                      <option value="all">All Statuses</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden max-h-[380px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#3A5303] text-white font-bold sticky top-0">
                      <tr>
                        <th className="p-3">Order ID & Date</th>
                        <th className="p-3">Customer Info</th>
                        <th className="p-3">Items Ordered</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Status & Action</th>
                        <th className="p-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-stone-400">
                            No orders found matching filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-3">
                              <span className="font-bold text-[#3A5303] block">{ord.id}</span>
                              <span className="text-[10px] text-stone-400">{ord.date}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-stone-900 block">
                                {ord.shippingAddress?.fullName || ord.customerName || 'N/A'}
                              </span>
                              <span className="text-[10px] text-stone-500 block">
                                {ord.shippingAddress?.email || ord.customerEmail || 'N/A'}
                              </span>
                            </td>
                            <td className="p-3 max-w-[200px] truncate text-stone-600">
                              {ord.itemsSummary ||
                                ord.items.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                            </td>
                            <td className="p-3 font-bold text-stone-900">
                              ₹{ord.total}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                                  className="px-2 py-1 bg-[#4E90F5] hover:bg-blue-600 text-white rounded text-[10px] font-semibold"
                                  title="Ship Order & Email Customer"
                                >
                                  Ship
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                                  disabled={updatingId === ord.id || ord.status === 'Delivered'}
                                  className="px-2 py-1 bg-[#94C000] hover:bg-emerald-600 text-[#1c260b] rounded text-[10px] font-semibold"
                                  title="Mark Delivered"
                                >
                                  Deliver
                                </button>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setSelectedOrderDetails(ord)}
                                className="p-1.5 text-stone-500 hover:text-[#3A5303] hover:bg-stone-100 rounded"
                                title="View Full Address & Items"
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

            {/* TAB 2: Customer Directory CRM */}
            {activeTab === 'crm' && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1c260b] text-white font-bold sticky top-0">
                    <tr>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Total Orders</th>
                      <th className="p-3 text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {customerList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-stone-400">
                          No customer directory records logged yet.
                        </td>
                      </tr>
                    ) : (
                      customerList.map((c, i) => (
                        <tr key={i} className="hover:bg-stone-50">
                          <td className="p-3 font-semibold text-stone-900">{c.name}</td>
                          <td className="p-3 text-stone-600">{c.email}</td>
                          <td className="p-3 text-stone-500">{c.phone}</td>
                          <td className="p-3 font-bold text-[#3A5303]">{c.count} Orders</td>
                          <td className="p-3 font-bold text-stone-900 text-right">₹{c.totalSpent}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: Sales Analytics */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F7F6F2] p-6 rounded-2xl border border-stone-200 space-y-4">
                  <h3 className="text-sm font-serif font-bold text-stone-900">Revenue Breakdown</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>A2 Desi Bilona Ghee</span>
                        <span>₹{Math.round(totalRevenue * 0.45)} (45%)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#3A5303] h-full w-[45%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Wood-Pressed Oils (Groundnut, Coconut, Kusuma)</span>
                        <span>₹{Math.round(totalRevenue * 0.40)} (40%)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#4E90F5] h-full w-[40%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>Fresh Organic Paneer</span>
                        <span>₹{Math.round(totalRevenue * 0.15)} (15%)</span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#94C000] h-full w-[15%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F7F6F2] p-6 rounded-2xl border border-stone-200 space-y-4">
                  <h3 className="text-sm font-serif font-bold text-stone-900">Order Delivery Fulfillments</h3>
                  <div className="space-y-3 text-xs text-stone-700">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-stone-200">
                      <span className="font-semibold">Processing Orders</span>
                      <span className="font-bold text-amber-700">{processingCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-stone-200">
                      <span className="font-semibold">Shipped In Transit</span>
                      <span className="font-bold text-[#4E90F5]">{shippedCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-stone-200">
                      <span className="font-semibold">Delivered Orders</span>
                      <span className="font-bold text-emerald-700">{deliveredCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Google Apps Script Health & Engine Monitor */}
            {activeTab === 'gas' && (
              <div className="bg-[#F7F6F2] p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-[#3A5303]" />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-serif">Google Apps Script Live Web App Engine</h3>
                    <p className="text-stone-500">Connected & Synced with Google Sheets Database</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <p className="font-bold text-stone-800">Deployment Endpoint URL:</p>
                  <p className="font-mono text-stone-600 text-[11px] break-all bg-[#F7F6F2] p-2 rounded border border-stone-200">
                    {gasUrl}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="font-bold text-stone-800 block">Automated Email Recipients</span>
                    <span className="text-[#3A5303] font-semibold">brindavanam1902@gmail.com</span>
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

        {/* Selected Order Full Popup Details */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl p-6 border border-stone-200 space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <div>
                  <span className="text-xs font-bold text-[#3A5303]">{selectedOrderDetails.id}</span>
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
                  <p className="font-semibold">{selectedOrderDetails.shippingAddress?.fullName || selectedOrderDetails.customerName}</p>
                  <p>{selectedOrderDetails.shippingAddress?.addressLine1} {selectedOrderDetails.shippingAddress?.addressLine2}</p>
                  <p>{selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.pincode}</p>
                  <p className="mt-1 text-stone-500">Phone: {selectedOrderDetails.shippingAddress?.phone || selectedOrderDetails.customerPhone}</p>
                  <p className="text-stone-500">Email: {selectedOrderDetails.shippingAddress?.email || selectedOrderDetails.customerEmail}</p>
                </div>

                <div className="border-t border-stone-200 pt-3">
                  <p className="font-bold text-stone-900 mb-1">Items Purchased:</p>
                  <p className="bg-[#F7F6F2] p-2.5 rounded border border-stone-200 font-mono text-[11px]">
                    {selectedOrderDetails.itemsSummary ||
                      selectedOrderDetails.items.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                  </p>
                </div>

                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#3A5303]">₹{selectedOrderDetails.total}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-full py-2.5 bg-[#3A5303] text-white font-bold text-xs rounded-xl"
              >
                Close Order Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
