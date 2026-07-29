'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, ShieldCheck, MapPin, CreditCard, RefreshCw } from 'lucide-react';
import { Order } from '@/types/store';
import { useAuth } from '@/context/AuthContext';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({ isOpen, onClose, orders: localOrders }) => {
  const { user } = useAuth();
  const [gasOrders, setGasOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbwqHEdFL5zR_cCPSUkvb91nudf72H9K1CdFYPEyHgP_XInRSaHQU0TiZEtadcYHpQPS/exec';

  const fetchUserOrdersFromGAS = async () => {
    if (!user || !user.email) return;
    setLoading(true);
    try {
      const response = await fetch(gasUrl);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.orders)) {
        // Filter orders placed by this logged-in customer email
        const userEmailLower = user.email.toLowerCase();
        const userMatchedOrders = data.orders.filter((o: Order) => {
          const email = (o.shippingAddress?.email || o.customerEmail || '').toLowerCase();
          return email === userEmailLower;
        });
        setGasOrders(userMatchedOrders);
      }
    } catch (err) {
      console.warn('Google Apps Script order fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user?.email) {
      fetchUserOrdersFromGAS();
    }
  }, [isOpen, user?.email]);

  if (!isOpen) return null;

  // Combine local state orders and Google Apps Script fetched orders without duplicates
  const orderMap = new Map<string, Order>();
  localOrders.forEach((o) => orderMap.set(o.id, o));
  gasOrders.forEach((o) => orderMap.set(o.id, o));
  const combinedOrders = Array.from(orderMap.values());

  const totalSpent = combinedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200 my-8">
        
        {/* Header with User Profile PFP */}
        <div className="bg-[#3A5303] text-white p-6 relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-[#94C000] shadow-md shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#1c260b] text-[#94C000] flex items-center justify-center font-serif text-2xl font-bold ring-4 ring-[#94C000] shadow-md shrink-0">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'P'}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-widest text-[#94C000] font-bold block">
                  Organic Patron Dashboard
                </span>
                {loading && <RefreshCw className="w-3 h-3 text-[#94C000] animate-spin" />}
              </div>
              <h2 className="text-2xl font-serif">{user?.displayName || 'Valued Customer'}</h2>
              <p className="text-xs text-stone-200 font-light">{user?.email || 'Patron Account'}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-left border border-white/20 sm:self-center">
            <span className="text-[10px] text-stone-300 uppercase font-semibold block">Total Organic Orders</span>
            <span className="text-xl font-serif text-[#94C000] font-bold">{combinedOrders.length} Orders (₹{totalSpent})</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {combinedOrders.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-[#F7F6F2] rounded-full flex items-center justify-center mx-auto text-stone-400">
                <Package className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif text-stone-800">No Orders Logged Yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Your fresh wood-pressed oils and hand-churned A2 ghee orders will appear here automatically as synced from Google Apps Script.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-serif">
                  Synced Order History ({combinedOrders.length})
                </h3>
                <button
                  onClick={fetchUserOrdersFromGAS}
                  disabled={loading}
                  className="text-xs text-[#3A5303] hover:underline flex items-center space-x-1 font-semibold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh History</span>
                </button>
              </div>

              {combinedOrders.map((ord) => (
                <div key={ord.id} className="bg-[#F7F6F2] rounded-2xl p-5 border border-stone-200 space-y-4">
                  {/* Top order bar */}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-stone-300/60 pb-3">
                    <div>
                      <span className="font-bold text-[#3A5303] text-sm block">{ord.id}</span>
                      <span className="text-[10px] text-stone-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Placed on {ord.date}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1 ${
                        ord.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ord.status === 'Processing' && <Clock className="w-3 h-3 mr-1" />}
                        {ord.status === 'Shipped' && <Truck className="w-3 h-3 mr-1" />}
                        {ord.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        <span>{ord.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Items breakdown */}
                  <div className="space-y-2 text-xs text-stone-700">
                    {ord.items && ord.items.length > 0 ? (
                      ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-stone-200/80">
                          <div className="flex items-center space-x-3">
                            {it.product?.images?.[0] ? (
                              <img
                                src={it.product.images[0]}
                                alt={it.product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#3A5303] text-white flex items-center justify-center font-bold text-xs">
                                🌿
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-stone-900">{it.product?.name || 'Organic Item'}</p>
                              <p className="text-[10px] text-stone-500">{it.selectedVariant?.weight || 'Standard'} x {it.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold text-stone-900">₹{(it.selectedVariant?.price || 0) * it.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white p-3 rounded-xl border border-stone-200 font-mono text-[11px] text-stone-800">
                        {ord.itemsSummary || 'Organic Produce Batch'}
                      </div>
                    )}
                  </div>

                  {/* Address & Payment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-stone-600 bg-white/60 p-3 rounded-xl border border-stone-200">
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-800 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-[#3A5303]" /> Shipping Destination:
                      </span>
                      <p className="font-medium text-stone-900">{ord.shippingAddress?.fullName || ord.customerName || user?.displayName}</p>
                      <p>{ord.shippingAddress?.addressLine1 || ord.city || 'Standard Shipping'}</p>
                      {ord.shippingAddress?.pincode && <p>{ord.shippingAddress?.state} - {ord.shippingAddress?.pincode}</p>}
                    </div>

                    <div className="space-y-0.5 sm:border-l border-stone-200 sm:pl-3">
                      <span className="font-bold text-stone-800 flex items-center">
                        <CreditCard className="w-3 h-3 mr-1 text-[#3A5303]" /> Payment Details:
                      </span>
                      <p className="font-semibold text-stone-900">Method: {ord.paymentMethod || 'Razorpay'}</p>
                      {ord.paymentId && <p className="font-mono text-[10px] text-stone-500">Ref: {ord.paymentId}</p>}
                      <p className="font-bold text-sm text-[#3A5303] pt-1">Total Paid: ₹{ord.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F7F6F2] p-4 border-t border-stone-200 flex justify-between items-center text-xs">
          <span className="text-stone-500 flex items-center">
            <ShieldCheck className="w-4 h-4 text-[#3A5303] mr-1" />
            Live Synced with Google Apps Script Engine
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02]"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
