'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User as UserIcon, Search, Menu, X, LogOut, Package, Leaf, Home as HomeIcon, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';

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
  const { announcements } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret shortcut for Store Owner: Ctrl + Shift + A opens Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        onOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdmin]);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'milk', label: 'Desi Cow Milk' },
    { id: 'ghee', label: 'A2 Bilona Ghee' },
    { id: 'oil', label: 'Wood-Pressed Oils' },
    { id: 'paneer', label: 'Desi Cow Paneer' },
    { id: 'eggs', label: 'Farm Fresh Eggs' },
  ];

  const defaultAnnouncements = [
    "FESTIVE HARVEST SALE: FREE SHIPPING ON ALL ORDERS ABOVE ₹2000 PAN-INDIA",
    "100% PURE A2 DESI COW BILONA GHEE — TRADITIONALLY HAND-CHURNED IN EARTHEN POTS",
    "AUTOMATIC 10% BULK FARM DISCOUNT APPLIED ON ₹5000+ PURCHASES",
    "WOOD-PRESSED COLD-EXTRACTED OILS — KUSUMA, SESAME & MUSTARD OILS DIRECT FROM FARM"
  ];

  const rawItems = announcements && announcements.length > 0 ? announcements : defaultAnnouncements;
  const minItemsRequired = 8;
  const repeatMultiplier = Math.max(1, Math.ceil(minItemsRequired / rawItems.length));
  const marqueeItems = Array(repeatMultiplier).fill(rawItems).flat();

  return (
    <>
      {/* Dynamic Floating Header Wrapper */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none transition-opacity duration-200 ${
        mobileMenuOpen ? 'opacity-0' : 'opacity-100'
      }`}>
        
        {/* Adaptive Seamless Infinite Sideways Marquee Ticker */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full bg-[#1c260b] text-white text-[10px] sm:text-[11px] font-bold tracking-widest uppercase py-2.5 overflow-hidden pointer-events-auto border-b border-[#3A5303]/40 shadow-xs relative select-none"
            >
              <div className="animate-marquee flex whitespace-nowrap">
                <div className="flex items-center space-x-10 pr-10">
                  {marqueeItems.map((item, idx) => (
                    <span key={`l1-${idx}`} className="flex items-center space-x-3 text-stone-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94C000] inline-block shrink-0 animate-pulse" />
                      <span className="hover:text-[#94C000] transition-colors">{item}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-10 pr-10">
                  {marqueeItems.map((item, idx) => (
                    <span key={`l2-${idx}`} className="flex items-center space-x-3 text-stone-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94C000] inline-block shrink-0 animate-pulse" />
                      <span className="hover:text-[#94C000] transition-colors">{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Dynamic Island Bar */}
        <div className="w-full flex justify-center px-2 sm:px-4 lg:px-6 pointer-events-none">
          <div
            className={`pointer-events-auto transition-all duration-300 flex items-center justify-between gap-2 lg:gap-4 select-none w-full relative ${
              isScrolled
                ? 'mt-3 px-3.5 sm:px-6 py-2 rounded-full border border-stone-200/90 bg-white/95 backdrop-blur-xl shadow-xl max-w-7xl ring-1 ring-stone-900/5'
                : 'mt-2.5 px-3.5 sm:px-6 py-2.5 rounded-2xl border border-stone-200/80 bg-white/95 backdrop-blur-md max-w-7xl shadow-lg'
            }`}
          >
            {/* Left: Mobile Menu Trigger & Logo */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="xl:hidden p-2 text-stone-800 hover:text-[#3A5303] rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Open Menu"
              >
                <Menu className="w-5 h-5 text-stone-900" />
              </button>
              
              <Link 
                href="/" 
                onClick={() => setSelectedCategory('all')}
                className="flex items-center space-x-2 group shrink-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#3A5303] to-[#253702] text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-[#94C000]/30 shrink-0 group-hover:scale-105 transition-transform">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#94C000]" />
                </div>
                <span className="text-xl sm:text-2xl font-serif tracking-tight text-[#3A5303] italic font-normal truncate group-hover:text-[#253702] transition-colors">
                  Brindavanam
                </span>
              </Link>
            </div>

            {/* Center: Desktop Rock-Solid Category Pill Nav */}
            <nav className="hidden xl:flex items-center space-x-1 bg-[#F7F6F2] p-1.5 rounded-full border border-stone-200/80 text-xs font-semibold whitespace-nowrap shrink-0">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (cat.id === 'all') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer font-bold ${
                      isActive
                        ? 'bg-[#3A5303] text-white shadow-md'
                        : 'text-stone-700 hover:text-[#3A5303] hover:bg-stone-200/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </nav>

            {/* Search Input Bar */}
            <div className="hidden md:flex items-center relative flex-1 max-w-xs mx-2">
              <input
                type="text"
                placeholder="Search A2 Ghee, Oils, Paneer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 text-xs bg-[#F7F6F2] border border-stone-200 rounded-full focus:outline-none focus:border-[#3A5303] focus:ring-2 focus:ring-[#3A5303]/20 focus:bg-white transition-all text-stone-900 placeholder:text-stone-400 font-medium shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Action Icons: Cart, Account */}
            <div className="flex items-center space-x-2 shrink-0">
              
              {/* Mobile Search Button */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 text-stone-700 hover:text-[#3A5303] rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#F7F6F2] hover:bg-stone-200/80 border border-stone-200 rounded-full text-xs font-semibold text-stone-800 transition-colors cursor-pointer shadow-2xs"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Profile'}
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-[#3A5303] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#3A5303] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'P'}
                      </div>
                    )}
                    <span className="hidden sm:inline-block max-w-[85px] truncate font-semibold text-stone-900">
                      {user.displayName ? user.displayName.split(' ')[0] : 'Account'}
                    </span>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-stone-100 flex items-center space-x-3 bg-[#F7F6F2]/50">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#3A5303] shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#3A5303] text-white flex items-center justify-center text-sm font-bold shrink-0">
                              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'P'}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-stone-900 truncate">{user.displayName || 'Valued Patron'}</p>
                            <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenOrders();
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-semibold text-stone-700 hover:bg-[#F7F6F2] hover:text-[#3A5303] flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#3A5303]" />
                          <span>Track My Orders</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 text-stone-800 hover:text-[#3A5303] text-xs font-bold rounded-full hover:bg-stone-100 transition-colors flex items-center space-x-1 cursor-pointer border border-stone-200 bg-white"
                >
                  <UserIcon className="w-4 h-4 text-[#3A5303]" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Cart Drawer Button */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 bg-gradient-to-r from-[#3A5303] to-[#253702] hover:from-[#2c3f02] hover:to-[#1c2901] text-white rounded-full transition-transform active:scale-95 shadow-md cursor-pointer flex items-center justify-center ring-2 ring-[#94C000]/20"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#94C000]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Expand */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full px-4 mt-2 md:hidden pointer-events-auto max-w-md"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Desi Cow Milk, A2 Ghee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 text-xs bg-white border border-stone-300 rounded-full shadow-2xl focus:outline-none focus:border-[#3A5303] text-stone-900 font-semibold"
                  autoFocus
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Clean Full-Screen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm xl:hidden flex" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="w-[85vw] max-w-xs bg-white h-full shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                
                {/* Header inside Mobile Drawer */}
                <div className="flex items-center justify-between border-b border-stone-200 pb-4 pt-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-[#3A5303] text-white flex items-center justify-center font-bold shadow-sm">
                      <Leaf className="w-4 h-4 text-[#94C000]" />
                    </div>
                    <span className="text-xl font-serif text-[#3A5303] font-bold italic">Brindavanam</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="p-2 text-stone-500 hover:text-stone-900 rounded-xl bg-stone-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Bar inside Drawer */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Produce..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#F7F6F2] border border-stone-200 rounded-xl focus:outline-none focus:border-[#3A5303] text-stone-900 font-medium"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Category Navigation inside Drawer */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1 mb-2">Produce Categories</p>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.id 
                          ? 'bg-[#3A5303] text-white shadow-sm' 
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.id && <span className="text-[#94C000]">●</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Account / Sign In at bottom of Drawer */}
              <div className="border-t border-stone-200 pt-4 space-y-3">
                {user ? (
                  <div className="bg-[#F7F6F2] p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#3A5303] shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#3A5303] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'P'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-stone-900 truncate">{user.displayName || 'Patron'}</p>
                        <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <UserIcon className="w-4 h-4 text-[#94C000]" />
                    <span>Sign In / Register</span>
                  </button>
                )}

                <div className="text-[10px] text-stone-400 text-center font-medium">
                  © 2026 Brindavanam Nature Centre
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


