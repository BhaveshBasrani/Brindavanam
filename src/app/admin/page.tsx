'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { CoolLoadingScreen } from '@/components/CoolLoadingScreen';
import Link from 'next/link';
import { Leaf, ArrowLeft } from 'lucide-react';

function AdminPageContent() {
  const { userOrders } = useStore();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#1c260b] text-white flex flex-col justify-center items-center p-4 relative">
      <CoolLoadingScreen />

      <div className="absolute top-6 left-6 flex items-center space-x-3">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-stone-300 hover:text-[#94C000] bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </div>

      <div className="text-center space-y-3 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#3A5303] flex items-center justify-center mx-auto ring-4 ring-[#94C000] shadow-2xl">
          <Leaf className="w-8 h-8 text-[#94C000]" />
        </div>
        <h1 className="text-3xl font-serif">Brindavanam Admin Command Desk</h1>
        <p className="text-xs text-stone-400 max-w-sm mx-auto">
          Private Portal for Store Operations, Customer CRM, Packing Slips & Order Fulfillments.
        </p>
      </div>

      <AdminDashboardModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        localOrders={userOrders}
      />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AdminPageContent />
      </StoreProvider>
    </AuthProvider>
  );
}
