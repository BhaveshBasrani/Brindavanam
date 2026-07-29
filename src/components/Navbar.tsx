'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, X, ShieldAlert, LogOut, Package, Leaf } from 'lucide-react';
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
  onOpenAuth,
  onOpenOrders,
  onOpenAdmin,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'all', label: 'All Produce' },
    { id: 'ghee', label: 'A2 Bilona Ghee' },
    { id: 'oil', label: 'Wood-Pressed Oils' },
    { id: 'paneer', label: 'Fresh Paneer' },
  ];

  return (
    <>
      {/* Dynamic Header Wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        
        {/* Top Announcement Bar */}
        {!isScrolled && (
          <div className="w-full bg-[#3A5303] text-stone-100 text-[11px] font-medium tracking-wider uppercase py-2 px-4 pointer-events-auto transition-all duration-200 shadow-xs">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-2">
              <div className="flex items-center space-x-4 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 text-stone-200">
                <span>Traditional Wood-Pressed & A2 Certified</span>
                <span className="hidden md:inline text-stone-400">•</span>
                <span className="hidden md:inline">Complimentary Shipping Over ₹999</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline text-[#94C000] font-mono text-[10px] font-bold">CODE: ORGANIC10</span>
                <button
                  onClick={onOpenAdmin}
                  className="bg-[#1c260b] hover:bg-[#2b3e02] text-white hover:text-[#94C000] text-[10px] tracking-widest uppercase font-bold px-2.5 py-1 rounded-md flex items-center space-x-1 border border-white/20 transition-all active:scale-95 shadow-xs"
                >
                  <ShieldAlert className="w-3 h-3 text-[#94C000]" />
                  <span>Admin Desk</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Island Floating Header Bar */}
        <header className="w-full flex justify-center pointer-events-none">
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto transition-all duration-300 flex items-center justify-between gap-3 select-none ${
              isScrolled
                ? 'mt-3 px-4 py-2.5 rounded-full border border-stone-300/80 bg-white/95 backdrop-blur-xl shadow-xl w-[94%] sm:w-[88%] max-w-5xl'
                : 'px-6 py-3.5 rounded-none md:rounded-b-2xl border-b border-stone-200/80 bg-[#F7F6F2]/95 backdrop-blur-md w-full max-w-7xl'
            }`}
          >
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-stone-700 hover:text-[#3A5303]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-lg bg-[#3A5303] text-white flex items-center justify-center font-bold shadow-xs">
                  <Leaf className="w-4 h-4 text-[#94C000]" />
                </div>
                <span className="text-2xl font-serif tracking-tight text-[#3A5303] italic font-normal">
                  Brindavanam
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 bg-[#F7F6F2] px-3 py-1.5 rounded-full border border-stone-200/80 text-xs uppercase tracking-wider font-semibold">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#3A5303] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Minimal Search Input */}
              <div className="relative hidden sm:flex items-center">
                <input
                  type="text"
                  placeholder="Search produce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 lg:w-44 pl-8 pr-3 py-1.5 text-xs border-b border-stone-300 bg-transparent text-stone-800 focus:outline-none focus:border-[#3A5303] transition-all"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2" />
              </div>

              {/* Admin Desk Trigger inside Scrolled Dynamic Island */}
              {isScrolled && (
                <button
                  onClick={onOpenAdmin}
                  className="bg-[#1c260b] hover:bg-[#3A5303] text-white p-2 rounded-full shadow-xs transition-colors"
                  title="Store Admin Desk"
                >
                  <ShieldAlert className="w-4 h-4 text-[#94C000]" />
                </button>
              )}

              {/* User Profile PFP Avatar */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-2 text-xs font-semibold text-stone-800 hover:text-[#3A5303] p-1 rounded-full hover:bg-stone-100 transition-colors"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-[#3A5303] shadow-xs"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#3A5303] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-[#94C000]">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="hidden lg:inline text-xs font-bold text-stone-800">
                        {user.displayName.split(' ')[0]}
                      </span>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 z-50 animate-in fade-in duration-150">
                        <div className="px-4 py-2 border-b border-stone-100 flex items-center space-x-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#3A5303]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#3A5303] text-white flex items-center justify-center font-bold text-sm">
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-stone-900 truncate">{user.displayName}</p>
                            <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenOrders();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-stone-700 hover:bg-[#F7F6F2] font-semibold flex items-center space-x-2 transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#3A5303]" />
                          <span>Customer Dashboard & Orders</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-[#3A5303] hover:bg-[#F7F6F2] font-bold flex items-center space-x-2 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4 text-[#3A5303]" />
                          <span>Store Admin Operations Desk</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs text-stone-500 hover:bg-red-50 hover:text-red-700 font-semibold flex items-center space-x-2 border-t border-stone-100 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="px-3 py-1.5 rounded-full border border-[#3A5303] text-[#3A5303] hover:bg-[#3A5303] hover:text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

              {/* Cart Link */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-full bg-[#3A5303] text-white hover:bg-[#2b3e02] transition-transform active:scale-95 shadow-xs flex items-center justify-center"
                title="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#4E90F5] text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

            </div>
          </motion.div>
        </header>

      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-24 z-50 p-5 rounded-2xl bg-white border border-stone-200 shadow-2xl space-y-4 md:hidden"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs bg-[#F7F6F2]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-col space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Categories</span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-xl text-xs uppercase font-semibold transition-colors ${
                    selectedCategory === cat.id ? 'bg-[#3A5303] text-white font-bold' : 'bg-[#F7F6F2] text-stone-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-left py-2.5 px-3 rounded-xl text-xs uppercase font-bold bg-[#1c260b] text-[#94C000] flex items-center space-x-2 mt-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Open Admin Operations Desk</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
