'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, User as UserIcon, Search, Menu, X, LogOut, Package, Leaf, Home as HomeIcon } from 'lucide-react';
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

  // ADAPTIVE FILLER: Multiply items if list/text is short to fill the top bar 100% edge-to-edge!
  const minItemsRequired = 8;
  const repeatMultiplier = Math.max(1, Math.ceil(minItemsRequired / rawItems.length));
  const marqueeItems = Array(repeatMultiplier).fill(rawItems).flat();

  return (
    <>
      {/* Dynamic Floating Header Wrapper */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        
        {/* Adaptive Seamless Infinite Sideways Marquee Ticker */}
        {!isScrolled && (
          <div className="w-full bg-[#1c260b] text-white text-[10px] sm:text-[11px] font-bold tracking-widest uppercase py-2.5 overflow-hidden pointer-events-auto border-b border-[#3A5303]/40 shadow-xs relative select-none">
            <div className="animate-marquee flex whitespace-nowrap">
              {/* Loop Track 1 */}
              <div className="flex items-center space-x-10 pr-10">
                {marqueeItems.map((item, idx) => (
                  <span key={`l1-${idx}`} className="flex items-center space-x-3 text-stone-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94C000] inline-block shrink-0" />
                    <span className="hover:text-[#94C000] transition-colors">{item}</span>
                  </span>
                ))}
              </div>

              {/* Loop Track 2 (Identical Duplicate for 100% Edge-to-Edge Continuous Transition) */}
              <div className="flex items-center space-x-10 pr-10">
                {marqueeItems.map((item, idx) => (
                  <span key={`l2-${idx}`} className="flex items-center space-x-3 text-stone-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#94C000] inline-block shrink-0" />
                    <span className="hover:text-[#94C000] transition-colors">{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Dynamic Island Bar */}
        <div className="w-full flex justify-center px-2 sm:px-4 lg:px-6 pointer-events-none">
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto transition-all duration-300 flex items-center justify-between gap-1.5 sm:gap-2 lg:gap-3 select-none w-full relative ${
              isScrolled
                ? 'mt-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-stone-300/80 bg-white/95 backdrop-blur-xl shadow-2xl max-w-7xl'
                : 'mt-2.5 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-stone-200/80 bg-white/95 backdrop-blur-md max-w-7xl shadow-lg'
            }`}
          >
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-1.5 text-stone-800 hover:text-[#3A5303] rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Link 
                href="/" 
                onClick={() => setSelectedCategory('all')}
                className="flex items-center space-x-1.5 group shrink-0"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#3A5303] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Leaf className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#94C000]" />
                </div>
                <span className="text-lg sm:text-2xl font-serif tracking-tight text-[#3A5303] italic font-normal truncate">
                  Brindavanam
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1 bg-[#F7F6F2] px-2 py-1 rounded-full border border-stone-200/80 text-[11px] font-semibold whitespace-nowrap shrink-0">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-full transition-all whitespace-nowrap shrink-0 flex items-center space-x-1 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#3A5303] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <HomeIcon className="w-3 h-3" />
                <span>Home</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#3A5303] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            {/* Search Input Bar */}
            <div className="hidden md:flex items-center relative flex-1 max-w-xs mx-2">
              <input
                type="text"
                placeholder="Search A2 Ghee, Oils, Paneer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F6F2] border border-stone-200 rounded-full focus:outline-none focus:border-[#3A5303] focus:bg-white transition-all text-stone-900 placeholder:text-stone-400 font-medium"
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

            {/* Right: Actions (Cart, Google Profile Pic Account, Orders) */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 text-stone-700 hover:text-[#3A5303] rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Patron Orders & Google Account Profile Picture Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1.5 px-2 py-1 bg-[#F7F6F2] hover:bg-stone-200 border border-stone-200 rounded-full text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Profile'}
                        className="w-5.5 h-5.5 rounded-full object-cover ring-1 ring-[#3A5303] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-5.5 h-5.5 rounded-full bg-[#3A5303] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'P'}
                      </div>
                    )}
                    <span className="hidden sm:inline-block max-w-[85px] truncate font-medium">
                      {user.displayName ? user.displayName.split(' ')[0] : 'Account'}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-2.5 border-b border-stone-100 flex items-center space-x-2.5">
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
                        className="w-full px-4 py-2 text-left text-xs font-medium text-stone-700 hover:bg-[#F7F6F2] flex items-center space-x-2 cursor-pointer"
                      >
                        <Package className="w-3.5 h-3.5 text-[#3A5303]" />
                        <span>Track My Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer"
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
                  className="px-3 py-1.5 text-stone-700 hover:text-[#3A5303] text-xs font-semibold rounded-full hover:bg-stone-100 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#3A5303]" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={onOpenCart}
                className="relative p-2 bg-[#3A5303] hover:bg-[#2b3e02] text-white rounded-full transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#94C000]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Mobile Search Overlay */}
        {mobileSearchOpen && (
          <div className="w-full px-4 mt-2 md:hidden pointer-events-auto max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Desi Cow Milk, A2 Ghee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-xs bg-white border border-stone-300 rounded-full shadow-lg focus:outline-none focus:border-[#3A5303] text-stone-900 font-medium"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs xl:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-xl bg-[#3A5303] text-white flex items-center justify-center font-bold shadow-xs">
                    <Leaf className="w-4 h-4 text-[#94C000]" />
                  </div>
                  <span className="text-xl font-serif text-[#3A5303] font-bold italic">Brindavanam</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Categories</p>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedCategory === cat.id ? 'bg-[#3A5303] text-white font-bold shadow-xs' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-200 pt-4 text-[10px] text-stone-400 text-center">
              © 2026 Brindavanam Nature Centre
            </div>
          </div>
        </div>
      )}
    </>
  );
};
