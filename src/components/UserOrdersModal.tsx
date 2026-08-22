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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAF6F0] max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-[#D9CEBC]">
        
        {/* Modal Header */}
        <div className="bg-[#162010] text-[#F5EFE6] p-6 flex justify-between items-center border-b border-[#243315]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Package className="w-5 h-5 text-[#D49B28]" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold uppercase tracking-tight">Customer Order Portal</h2>
              <p className="text-xs text-[#D49B28] font-mono">
                {user ? user.displayName : 'Patron Account'} · Live Tracking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {combinedOrders.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-[#ECE4D5] rounded-full flex items-center justify-center mx-auto text-[#5C6352]">
                <Package className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-serif text-[#162010]">No Orders Logged Yet</h3>
                <p className="text-xs text-[#5C6352] max-w-sm mx-auto font-sans">
                  Your fresh wood-pressed oils and hand-churned A2 ghee orders will appear here automatically upon confirmation.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D9CEBC] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#162010] uppercase tracking-wider">
                  Order History ({combinedOrders.length})
                </h3>
                <button
                  onClick={fetchUserOrdersFromGAS}
                  disabled={loading}
                  className="text-xs text-[#C25E2E] hover:underline flex items-center space-x-1 font-mono font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh History</span>
                </button>
              </div>

              {combinedOrders.map((ord) => (
                <div key={ord.id} className="bg-[#ECE4D5]/70 rounded-2xl p-5 border border-[#D9CEBC] space-y-4">
                  {/* Top order bar */}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-[#D9CEBC] pb-3">
                    <div>
                      <span className="font-bold text-[#162010] font-mono text-sm block">{ord.id}</span>
                      <span className="text-[10px] text-[#5C6352] font-mono flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Placed on {ord.date}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider flex items-center space-x-1 ${
                        ord.status === 'Processing' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        ord.status === 'Shipped' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                        ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        'bg-red-100 text-red-900 border border-red-300'
                      }`}>
                        {ord.status === 'Processing' && <Clock className="w-3 h-3 mr-1" />}
                        {ord.status === 'Shipped' && <Truck className="w-3 h-3 mr-1" />}
                        {ord.status === 'Delivered' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        <span>{ord.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Items breakdown */}
                  <div className="space-y-2 text-xs text-[#162010]">
                    {ord.items && ord.items.length > 0 ? (
                      ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#FAF6F0] p-2.5 rounded-xl border border-[#D9CEBC]">
                          <div className="flex items-center space-x-3">
                            {it.product?.images?.[0] ? (
                              <img
                                src={it.product.images[0]}
                                alt={it.product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-[#D9CEBC]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#162010] text-[#D49B28] flex items-center justify-center font-bold text-xs">
                                <Leaf className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-[#162010] font-serif">{it.product?.name || 'Farm Harvest'}</p>
                              <p className="text-[10px] text-[#5C6352] font-mono">{it.selectedVariant?.weight || 'Standard'} x {it.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold font-mono text-[#162010]">₹{(it.selectedVariant?.price || 0) * it.quantity}</span>
                        </div>
                      ))
                    ) : (
                      <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#D9CEBC] font-mono text-[11px] text-[#162010]">
                        {ord.itemsSummary || 'Vedic Harvest Batch'}
                      </div>
                    )}
                  </div>

                  {/* Address, Payment Info & Leave Review Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-[#5C6352] bg-[#FAF6F0] p-3.5 rounded-xl border border-[#D9CEBC]">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#162010] flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-[#C25E2E]" /> Dispatch Destination:
                      </span>
                      <p className="font-medium text-[#162010]">{ord.shippingAddress?.fullName || ord.customerName || user?.displayName}</p>
                      <p>{ord.shippingAddress?.addressLine1 || ord.city || 'Standard Dispatch'}</p>
                      {ord.shippingAddress?.pincode && <p>{ord.shippingAddress?.state} - {ord.shippingAddress?.pincode}</p>}
                    </div>

                    <div className="space-y-1 sm:border-l border-[#D9CEBC] sm:pl-3 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-[#162010] flex items-center">
                          <CreditCard className="w-3 h-3 mr-1 text-[#33441B]" /> Payment Details:
                        </span>
                        <p className="font-semibold text-[#162010]">Method: {ord.paymentMethod || 'Online Gateway'}</p>
                        {ord.paymentId && <p className="font-mono text-[10px] text-[#5C6352]">Ref: {ord.paymentId}</p>}
                        <p className="font-bold text-sm text-[#162010] font-mono pt-0.5">Total Paid: ₹{ord.total}</p>
                      </div>

                      <button
                        onClick={handleReviewClick}
                        className="w-full py-2 bg-[#C25E2E] text-white font-mono font-bold text-[10px] uppercase rounded-lg shadow-sm hover:bg-[#9E451A] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Star className="w-3 h-3 fill-white" />
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
        <div className="bg-[#ECE4D5] p-4 border-t border-[#D9CEBC] flex justify-between items-center text-xs">
          <span className="text-[#5C6352] flex items-center font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#33441B] mr-1" />
            100% Encrypted Farm Order Tracking
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#162010] text-[#F5EFE6] font-mono font-bold text-xs uppercase rounded-xl hover:bg-[#C25E2E] cursor-pointer transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
