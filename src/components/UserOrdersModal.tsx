'use client';

import React from 'react';
import { X, Package, Clock, CheckCircle2, Truck, AlertCircle, Calendar } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200 my-8">
        
        {/* Header */}
        <div className="bg-[#4B6B03] text-white p-6 flex justify-between items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#94C000] font-bold">
              Account Dashboard
            </span>
            <h2 className="text-xl font-bold font-serif">Your Order History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Details */}
        <div className="p-6 bg-[#F3F6F3] border-b border-stone-200 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#4B6B03] text-white flex items-center justify-center font-bold text-sm">
            {user?.displayName.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">{user?.displayName || 'Patron'}</h3>
            <p className="text-xs text-stone-500">{user?.email}</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h4 className="text-sm font-bold text-stone-700 font-serif">No Past Orders Found</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Once you place an order for A2 Ghee or Wood-Pressed Oils, your tracking status will appear here!
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 hover:border-[#94C000] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#4B6B03]">{ord.id}</span>
                    <div className="flex items-center space-x-1 text-[11px] text-stone-400 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{ord.date}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#4B6B03] flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{ord.status}</span>
                  </span>
                </div>

                {/* Items Purchased */}
                <div className="space-y-1 text-xs text-stone-700">
                  {ord.items.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span>
                        {it.product.name} ({it.selectedVariant.weight}) x{it.quantity}
                      </span>
                      <span className="font-semibold">₹{it.selectedVariant.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs font-bold">
                  <span className="text-stone-500">
                    Payment ({ord.paymentMethod}): <span className="font-mono text-stone-700">{ord.paymentId || 'N/A'}</span>
                  </span>
                  <span className="text-[#4B6B03] text-sm font-serif">Total: ₹{ord.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
