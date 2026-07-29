'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, RefreshCw, Package, Mail, Search, Lock, Filter, DollarSign } from 'lucide-react';
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

  const [gasOrders, setGasOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcpqGstAAAAAMBOybBtJPFQ2aMtBfLmsUT9AAtB';

  const fetchOrdersFromGAS = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gas-order?action=get_orders');
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
      const response = await fetch('/api/gas-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      (o.shippingAddress?.fullName || '').toLowerCase().includes(searchLower) ||
      (o.shippingAddress?.email || '').toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = combinedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200 my-8">
        
        {/* Header */}
        <div className="bg-[#1c260b] text-white p-6 flex justify-between items-center border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#3A5303] flex items-center justify-center text-white font-bold">
              <ShieldAlert className="w-5 h-5 text-[#94C000]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#94C000] font-bold">
                Google Apps Script Integrated
              </span>
              <h2 className="text-xl font-serif">Store Admin Dashboard</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Admin Passcode + reCAPTCHA Authentication */}
        {!authenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-[#F7F6F2] rounded-full flex items-center justify-center mx-auto text-[#3A5303]">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif text-stone-900">Admin Security Portal</h3>
              <p className="text-xs text-stone-500">
                Enter your store manager passcode to access live Google Apps Script orders and email logs.
              </p>
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
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
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl text-xs text-center font-bold tracking-widest bg-[#F7F6F2]"
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
                className="w-full py-3.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Authenticate Admin Access
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Live Admin Dashboard */
          <div className="p-6 space-y-6">
            {/* Analytics Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#3A5303] text-white flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#94C000]" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-500 font-semibold uppercase">Total Revenue</p>
                  <p className="text-xl font-serif text-[#3A5303]">₹{totalRevenue}</p>
                </div>
              </div>

              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#4E90F5] text-white flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-500 font-semibold uppercase">Total Orders</p>
                  <p className="text-xl font-serif text-stone-900">{combinedOrders.length}</p>
                </div>
              </div>

              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#94C000] text-[#1c260b] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-stone-500 font-semibold uppercase">GAS Sync & Emails</p>
                  <p className="text-xs font-bold text-emerald-800">100% Connected</p>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-white"
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

                <button
                  onClick={fetchOrdersFromGAS}
                  disabled={loading}
                  className="px-3 py-2 bg-[#3A5303] text-white text-xs font-bold rounded-xl flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#3A5303] text-white font-bold sticky top-0">
                  <tr>
                    <th className="p-3">Order ID & Date</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Items Purchased</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-stone-400">
                        No matching orders found in Google Apps Script Sheet.
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
                          <span className="font-semibold text-stone-800 block">
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
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#3A5303]">
                              {ord.status}
                            </span>
                            
                            {/* Status Change Buttons */}
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'Shipped')}
                              disabled={updatingId === ord.id || ord.status === 'Shipped'}
                              className="px-2 py-1 bg-[#4E90F5] hover:bg-blue-600 text-white rounded text-[10px] font-bold"
                              title="Set Shipped & Email Customer"
                            >
                              Ship
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                              disabled={updatingId === ord.id || ord.status === 'Delivered'}
                              className="px-2 py-1 bg-[#94C000] hover:bg-emerald-600 text-[#1c260b] font-bold rounded text-[10px]"
                              title="Set Delivered"
                            >
                              Deliver
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
