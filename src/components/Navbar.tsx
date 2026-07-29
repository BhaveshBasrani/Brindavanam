'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, X, ShieldAlert, LogOut, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenOrders,
  onOpenAdmin,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'ghee', label: 'A2 Bilona Ghee' },
    { id: 'oil', label: 'Wood-Pressed Oils' },
    { id: 'paneer', label: 'Fresh Paneer' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F6F2]/90 backdrop-blur-md border-b border-stone-200/70">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#3A5303] text-stone-100 text-[11px] font-medium tracking-wider uppercase py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-2">
          <div className="flex items-center space-x-6 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 text-stone-200">
            <span>Traditional Wood-Pressed & A2 Vedic Certified</span>
            <span className="hidden md:inline text-stone-400">•</span>
            <span className="hidden md:inline">Complimentary Express Shipping Over ₹999</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline text-stone-300 font-mono text-[10px]">CODE: ORGANIC10</span>
            <button
              onClick={onOpenAdmin}
              className="text-white hover:text-[#94C000] text-[10px] tracking-widest uppercase font-semibold flex items-center space-x-1 border-l border-white/20 pl-3 transition-colors"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-[#3A5303]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <Link href="/" className="flex items-baseline space-x-2">
              <span className="text-3xl font-serif tracking-tight text-[#3A5303] font-normal italic">
                Brindavanam
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-stone-400 hidden sm:inline">
                Organic Farms
              </span>
            </Link>
          </div>

          {/* Minimal Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-10 relative">
            <input
              type="text"
              placeholder="Search oils, ghee, paneer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border-b border-stone-300 bg-transparent text-stone-800 text-xs placeholder:text-stone-400 focus:outline-none focus:border-[#3A5303] transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 text-xs text-stone-800 hover:text-[#3A5303] font-medium"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#3A5303] text-white flex items-center justify-center font-semibold text-[11px]">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.displayName}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900">{user.displayName}</p>
                        <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenOrders();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-[#F7F6F2] flex items-center space-x-2"
                      >
                        <Package className="w-3.5 h-3.5 text-[#3A5303]" />
                        <span>My Orders</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-stone-500 hover:bg-stone-50 flex items-center space-x-2 border-t border-stone-100"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="text-xs font-semibold text-stone-800 hover:text-[#3A5303] flex items-center space-x-1.5 transition-colors"
                >
                  <User className="w-4 h-4 text-[#3A5303]" />
                  <span>Account</span>
                </button>
              )}
            </div>

            {/* Dedicated Cart Link */}
            <Link
              href="/cart"
              className="relative text-stone-800 hover:text-[#3A5303] transition-colors flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-5 h-5 text-[#3A5303]" />
              <span className="text-xs font-semibold hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-[#3A5303] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <div className="hidden lg:flex items-center justify-center space-x-10 py-2.5 border-t border-stone-200/60 text-xs tracking-wider uppercase font-semibold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`pb-1 transition-all ${
                selectedCategory === cat.id
                  ? 'text-[#3A5303] border-b border-[#3A5303]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-[#F7F6F2] px-4 py-4 space-y-3">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border-b border-stone-300 text-xs bg-transparent"
          />
          <div className="flex flex-col space-y-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-1.5 text-xs uppercase font-semibold ${
                  selectedCategory === cat.id ? 'text-[#3A5303] font-bold' : 'text-stone-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
