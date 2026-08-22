'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, RefreshCw, ShieldCheck, MapPin, CreditCard, Star, Leaf } from 'lucide-react';
import { Order } from '@/types/store';
import { useAuth } from '@/context/AuthContext';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const { user } = useAuth();
  const [gasOrders, setGasOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbxwcmwfICPKEBKgREmobTj69fhqenkej1qGagtfh9kXSoZSTP16gUw8mkMGYtDmE4Gwag/exec';

  const fetchUserOrdersFromGAS = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const response = await fetch(`${gasUrl}?action=get_user_orders&email=${encodeURIComponent(user.email)}`);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.orders)) {
        setGasOrders(data.orders);
      }
    } catch (err) {
      console.warn('Order fetch notice:', err);
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

  // Combine local state orders and remote fetched orders without duplicates
  const allOrdersMap = new Map<string, Order>();
  orders.forEach((o) => allOrdersMap.set(o.id, o));
  gasOrders.forEach((o) => allOrdersMap.set(o.id, o));

  const combinedOrders = Array.from(allOrdersMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleReviewClick = () => {
    onClose();
    const el = document.getElementById('reviews');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-[#3A5303] text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Package className="w-5 h-5 text-[#94C000]" />
            </div>
            <div>
              <h2 className="text-xl font-serif">Customer Order Portal</h2>
              <p className="text-xs text-[#94C000] font-light">
                {user ? user.displayName : 'Patron Account'} • Live Tracking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
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
                  Your fresh wood-pressed oils and hand-churned A2 ghee orders will appear here automatically upon confirmation.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-serif">
                  Order History ({combinedOrders.length})
                </h3>
                <button
                  onClick={fetchUserOrdersFromGAS}
                  disabled={loading}
                  className="text-xs text-[#3A5303] hover:underline flex items-center space-x-1 font-semibold cursor-pointer"
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
                                <Leaf className="w-5 h-5 text-[#94C000]" />
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

                  {/* Address, Payment Info & Leave Review Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-stone-600 bg-white/60 p-3 rounded-xl border border-stone-200">
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-800 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-[#3A5303]" /> Shipping Destination:
                      </span>
                      <p className="font-medium text-stone-900">{ord.shippingAddress?.fullName || ord.customerName || user?.displayName}</p>
                      <p>{ord.shippingAddress?.addressLine1 || ord.city || 'Standard Shipping'}</p>
                      {ord.shippingAddress?.pincode && <p>{ord.shippingAddress?.state} - {ord.shippingAddress?.pincode}</p>}
                    </div>

                    <div className="space-y-1 sm:border-l border-stone-200 sm:pl-3 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-stone-800 flex items-center">
                          <CreditCard className="w-3 h-3 mr-1 text-[#3A5303]" /> Payment Details:
                        </span>
                        <p className="font-semibold text-stone-900">Method: {ord.paymentMethod || 'Online Payment'}</p>
                        {ord.paymentId && <p className="font-mono text-[10px] text-stone-500">Ref: {ord.paymentId}</p>}
                        <p className="font-bold text-sm text-[#3A5303] pt-0.5">Total Paid: ₹{ord.total}</p>
                      </div>

                      <button
                        onClick={handleReviewClick}
                        className="w-full py-1.5 bg-[#94C000] text-[#1c260b] font-bold text-[10px] uppercase rounded-lg shadow-xs hover:bg-[#85ad00] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Star className="w-3 h-3 fill-[#1c260b]" />
                        <span>Leave Review For Order</span>
                      </button>
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
            100% Encrypted Farm Order Tracking
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
