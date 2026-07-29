'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, X, LogOut, Package, Leaf } from 'lucide-react';
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
    { id: 'all', label: 'All Produce' },
    { id: 'ghee', label: 'A2 Bilona Ghee' },
    { id: 'oil', label: 'Wood-Pressed Oils' },
    { id: 'paneer', label: 'Fresh Paneer' },
  ];

  return (
    <>
      {/* Dynamic Floating Header Wrapper - NO BACKGROUND BOX BEHIND IT */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
        
        {/* Top Announcement Bar */}
        {!isScrolled && (
          <div className="w-full bg-[#3A5303] text-stone-100 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase py-2 px-4 pointer-events-auto shadow-xs">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-2 truncate">
                <span className="w-2 h-2 rounded-full bg-[#94C000] animate-pulse shrink-0" />
                <span className="truncate">Traditional Wood-Pressed & A2 Certified</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="bg-[#94C000] text-[#1c260b] px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider">
                  ORGANIC10
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Dynamic Island Bar - Freely floating over content */}
        <div className="w-full flex justify-center px-3 sm:px-6 pointer-events-none">
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto transition-all duration-300 flex items-center justify-between gap-2 sm:gap-3 select-none w-full overflow-hidden ${
              isScrolled
                ? 'mt-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border border-stone-300/80 bg-white/95 backdrop-blur-xl shadow-2xl max-w-5xl'
                : 'mt-2.5 px-4 sm:px-7 py-2.5 sm:py-3 rounded-2xl border border-stone-200/80 bg-white/95 backdrop-blur-md max-w-7xl shadow-lg'
            }`}
          >
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-stone-800 hover:text-[#3A5303] rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <Link href="/" className="flex items-center space-x-1.5 group shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#3A5303] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Leaf className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#94C000]" />
                </div>
                <span className="text-lg sm:text-2xl font-serif tracking-tight text-[#3A5303] italic font-normal truncate">
                  Brindavanam
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 bg-[#F7F6F2] px-2 py-1 rounded-full border border-stone-200/80 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap shrink">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full transition-all whitespace-nowrap shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#3A5303] text-white font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>

            {/* Right: Actions & Profile */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0 pr-1">
              
              {/* Mobile Search Button */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="sm:hidden p-1.5 text-stone-700 hover:text-[#3A5303] rounded-full hover:bg-stone-100"
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Desktop Search Input */}
              <div className="relative hidden sm:flex items-center">
                <input
                  type="text"
                  placeholder="Search produce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-24 lg:w-36 pl-7 pr-2 py-1 text-xs border-b border-stone-300 bg-transparent text-stone-800 focus:outline-none focus:border-[#3A5303] transition-all"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-1.5" />
              </div>

              {/* User Profile Avatar / Sign In */}
              <div className="relative shrink-0">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-1.5 text-xs font-semibold text-stone-800 p-1 rounded-full hover:bg-stone-100 transition-colors"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#3A5303] shadow-xs"
                        />
                      ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3A5303] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-[#94C000]">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="hidden xl:inline text-xs font-bold text-stone-800">
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
                            <div className="w-10 h-10 rounded-full bg-[#3A5303] text-[#1c260b] flex items-center justify-center font-bold text-sm">
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
                  <>
                    {/* Mobile Compact Icon Sign In */}
                    <button
                      onClick={onOpenAuth}
                      className="sm:hidden p-2 rounded-full border border-[#3A5303] text-[#3A5303] hover:bg-[#3A5303] hover:text-white transition-all active:scale-90 flex items-center justify-center"
                      title="Sign In"
                    >
                      <User className="w-4 h-4" />
                    </button>

                    {/* Desktop Text Sign In */}
                    <button
                      onClick={onOpenAuth}
                      className="hidden sm:flex px-3 py-1.5 rounded-full border border-[#3A5303] text-[#3A5303] hover:bg-[#3A5303] hover:text-white text-xs font-bold uppercase tracking-wider items-center space-x-1 transition-all whitespace-nowrap"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  </>
                )}
              </div>

              {/* Shopping Cart Button Trigger - OPENS SLIDE-OUT CART DRAWER DIRECTLY */}
              <button
                onClick={onOpenCart}
                className="relative p-2 sm:p-2.5 rounded-full bg-[#3A5303] hover:bg-[#2b3e02] text-white transition-transform active:scale-95 shadow-xs flex items-center justify-center shrink-0"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#4E90F5] text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>
          </motion.div>
        </div>

        {/* Mobile Search Overlay Bar */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full px-4 pb-3 sm:hidden pointer-events-auto"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search organic produce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-8 py-2.5 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303] shadow-lg"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3" />
                <button onClick={() => setMobileSearchOpen(false)} className="absolute right-3 text-stone-400 hover:text-stone-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full px-4 pb-4 md:hidden pointer-events-auto"
            >
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-xs font-serif font-bold text-[#3A5303] uppercase tracking-wider">Organic Lineup Categories</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-stone-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-center py-3 px-3 rounded-xl text-xs uppercase font-bold transition-all active:scale-95 ${
                        selectedCategory === cat.id ? 'bg-[#3A5303] text-white shadow-md' : 'bg-[#F7F6F2] text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {user && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenOrders();
                    }}
                    className="w-full py-3 bg-[#F7F6F2] text-[#3A5303] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 border border-stone-200"
                  >
                    <Package className="w-4 h-4" />
                    <span>My Customer Dashboard</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
