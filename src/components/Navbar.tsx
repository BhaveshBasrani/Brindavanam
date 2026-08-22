'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User as UserIcon, Search, Menu, X, LogOut, Package, Home as HomeIcon, Sparkles, MessageCircle, ArrowUpRight, ChevronRight, Phone } from 'lucide-react';
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
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchModalOpen]);

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
    { id: '', label: 'Home', shortLabel: 'Home', isHome: true },
    { id: 'all', label: 'All Products', shortLabel: 'All Products' },
    { id: 'milk', label: 'Pure Desi Cow Milk', shortLabel: 'Desi Milk' },
    { id: 'ghee', label: 'A2 Bilona Ghee', shortLabel: 'A2 Ghee' },
    { id: 'oil', label: 'Wood-Pressed Oils', shortLabel: 'Cold Oils' },
    { id: 'paneer', label: 'Pure Desi Cow Paneer', shortLabel: 'Fresh Paneer' },
    { id: 'eggs', label: 'Farm Fresh Eggs', shortLabel: 'Farm Eggs' },
  ];

  const defaultAnnouncements = [
    "FESTIVE HARVEST: FREE SHIPPING ON ALL ORDERS ABOVE ₹2000 PAN-INDIA",
    "100% PURE A2 DESI COW BILONA GHEE — SLOW-CHURNED IN CLAY POTS OVER WOOD FIRE",
    "AUTOMATIC 10% BULK FARM DISCOUNT ON ₹5000+ PURCHASES",
    "ZERO-HEAT WOOD-PRESSED OILS — SESAME, KUSUMA, MUSTARD & GROUNDNUT DIRECT FROM FARM"
  ];

  const rawItems = announcements && announcements.length > 0 ? announcements : defaultAnnouncements;
  const minItemsRequired = 8;
  const repeatMultiplier = Math.max(1, Math.ceil(minItemsRequired / rawItems.length));
  const marqueeItems = Array(repeatMultiplier).fill(rawItems).flat();

  const handleCategoryClick = (catId: string, isHome?: boolean) => {
    if (isHome) {
      setSelectedCategory('');
      if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return;
    }

    setSelectedCategory(catId);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== '/') {
        window.location.href = `/#catalog`;
        return;
      }
      
      const el = document.getElementById('catalog');
      if (el) {
        const yOffset = -90;
        const targetY = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset + yOffset);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Fixed Top Header (Sleek, No Overlap) */}
      <header className="fixed top-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none w-full">
        
        {/* Top Ticker Marquee */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-[#162010] text-[#F5EFE6] text-[8px] sm:text-[10px] font-mono uppercase tracking-[0.2em] py-1 overflow-hidden pointer-events-auto border-b border-[#243315] select-none shrink-0"
            >
              <div className="animate-marquee flex whitespace-nowrap">
                <div className="flex items-center space-x-6 pr-6">
                  {marqueeItems.map((item, idx) => (
                    <span key={`l1-${idx}`} className="flex items-center space-x-2 text-[#ECE4D5]/90">
                      <span className="w-1 h-1 rounded-full bg-[#C25E2E] inline-block shrink-0" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-6 pr-6">
                  {marqueeItems.map((item, idx) => (
                    <span key={`l2-${idx}`} className="flex items-center space-x-2 text-[#ECE4D5]/90">
                      <span className="w-1 h-1 rounded-full bg-[#C25E2E] inline-block shrink-0" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navbar Bar (Sleek Glassmorphic Bar) */}
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pointer-events-none mt-1 sm:mt-2">
          <div
            className="pointer-events-auto transition-all duration-300 flex items-center justify-between gap-2 select-none w-full px-3 sm:px-5 py-2 rounded-2xl border border-[#D9CEBC] bg-[#F5EFE6]/95 backdrop-blur-xl shadow-md"
          >
            {/* Left: Menu Button + Brand Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 text-[#162010] hover:text-[#C25E2E] rounded-xl hover:bg-[#ECE4D5] transition-colors cursor-pointer border border-[#D9CEBC] bg-[#FAF6F0]"
                aria-label="Open Menu"
              >
                <Menu className="w-4 h-4 text-[#162010]" />
              </button>
              
              <Link 
                href="/" 
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick('', true);
                }}
                className="flex items-center space-x-1 sm:space-x-1.5 group cursor-pointer"
              >
                <div className="flex flex-col text-left">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-base sm:text-2xl font-display font-bold tracking-tight text-[#162010] group-hover:text-[#C25E2E] transition-colors uppercase">
                      Brindavanam
                    </span>
                    <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.15em] text-[#C25E2E] font-mono px-1 py-0.5 bg-[#C25E2E]/10 rounded">
                      Farms
                    </span>
                  </div>
                  <span className="hidden sm:block text-[8px] uppercase tracking-[0.25em] text-[#5C6352] font-mono leading-none">
                    Hyd · Ancestral Agriculture
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Navigation Categories (Hidden on mobile/tablets) */}
            <nav className="hidden lg:flex items-center space-x-1 bg-[#ECE4D5]/80 p-1 rounded-xl border border-[#D9CEBC] text-xs font-semibold whitespace-nowrap overflow-hidden font-display shrink">
              {categories.map((cat) => {
                const isActive = cat.isHome
                  ? selectedCategory === ''
                  : selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id || 'home'}
                    onClick={() => handleCategoryClick(cat.id, cat.isHome)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer text-[11px] font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-[#162010] text-[#F5EFE6] shadow-sm'
                        : 'text-[#5C6352] hover:text-[#162010] hover:bg-[#D9CEBC]/60'
                    }`}
                  >
                    {cat.shortLabel}
                  </button>
                );
              })}
            </nav>

            {/* Right: Search + Account + Cart */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              
              {/* Search Trigger Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-1.5 sm:px-3 sm:py-1.5 text-[#162010] hover:text-[#C25E2E] rounded-xl hover:bg-[#ECE4D5] transition-colors cursor-pointer border border-[#D9CEBC] bg-[#FAF6F0] flex items-center space-x-1.5"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-[#5C6352]" />
                <span className="hidden sm:inline text-xs text-[#5C6352] font-sans">
                  {searchQuery ? `"${searchQuery}"` : 'Search...'}
                </span>
              </button>

              {/* User Account / Profile */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1 px-2 py-1.5 bg-[#ECE4D5]/80 hover:bg-[#D9CEBC] border border-[#D9CEBC] rounded-xl text-xs font-semibold text-[#162010] transition-colors cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-[#162010] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-[#162010] text-[#F5EFE6] flex items-center justify-center font-bold text-[9px] shrink-0">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:inline-block max-w-[70px] truncate font-semibold text-[#162010] text-xs">
                      {user.displayName ? user.displayName.split(' ')[0] : (user.email ? user.email.split('@')[0] : 'Account')}
                    </span>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-[#FAF6F0] rounded-2xl shadow-2xl border border-[#D9CEBC] py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-[#D9CEBC] bg-[#ECE4D5]/60">
                          <p className="text-xs font-bold text-[#162010] truncate">
                            {user.displayName || (user.email ? user.email.split('@')[0] : 'Patron')}
                          </p>
                          <p className="text-[10px] text-[#5C6352] truncate">
                            {user.email || 'Signed in'}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenOrders();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-[#162010] hover:bg-[#ECE4D5] flex items-center space-x-2 cursor-pointer transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#C25E2E]" />
                          <span>Track My Orders</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer transition-colors"
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
                  className="hidden sm:flex px-2.5 py-1.5 text-[#162010] hover:text-[#C25E2E] text-xs font-bold rounded-xl hover:bg-[#D9CEBC]/60 transition-colors items-center space-x-1 cursor-pointer border border-[#D9CEBC] bg-[#ECE4D5]/60 font-display"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#162010]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative px-2.5 sm:px-3 py-1.5 bg-[#162010] hover:bg-[#33441B] text-[#F5EFE6] rounded-xl transition-all active:scale-95 cursor-pointer flex items-center space-x-1 border border-[#162010] shadow-sm shrink-0"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#D49B28]" />
                <span className="text-xs font-bold font-display uppercase tracking-wider hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-[#C25E2E] text-white font-bold text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-mono animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* SEARCH MODAL OVERLAY */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 font-sans">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FAF6F0] max-w-lg w-full rounded-3xl p-5 shadow-2xl border border-[#D9CEBC] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#D9CEBC] pb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#C25E2E]">Search Harvest</span>
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="p-1 text-[#5C6352] hover:text-[#162010] cursor-pointer rounded-lg hover:bg-[#ECE4D5]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Desi Milk, A2 Ghee, Oils, Paneer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-3 text-sm bg-[#F5EFE6] border border-[#D9CEBC] rounded-2xl focus:outline-none focus:border-[#162010] text-[#162010] font-semibold"
                />
                <Search className="w-4 h-4 text-[#5C6352] absolute left-3.5 top-3.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-[#5C6352] hover:text-[#162010] cursor-pointer p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Harvest Shortcuts */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-[#5C6352] uppercase tracking-wider block">Popular Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => !c.isHome).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategoryClick(cat.id);
                        setSearchModalOpen(false);
                      }}
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-[#ECE4D5] hover:bg-[#162010] hover:text-[#F5EFE6] text-[#162010] rounded-xl border border-[#D9CEBC] transition-all cursor-pointer"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSearchModalOpen(false)}
                className="w-full py-2.5 bg-[#162010] hover:bg-[#C25E2E] text-[#F5EFE6] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                View Results ({searchQuery ? `"${searchQuery}"` : 'All Produce'})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE SLIDE-OUT DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm lg:hidden flex font-sans" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="w-[85vw] max-w-xs bg-[#F5EFE6] h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto border-r border-[#D9CEBC]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-5">
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-[#D9CEBC] pb-3.5">
                  <div className="flex flex-col">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-xl font-display font-bold tracking-tight text-[#162010] uppercase">
                        Brindavanam
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C25E2E] font-mono px-1 py-0.5 bg-[#C25E2E]/10 rounded">
                        Farms
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[#5C6352] uppercase tracking-widest">
                      Vedic Farm Estate · Hyderabad
                    </span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="p-1.5 text-[#5C6352] hover:text-[#162010] rounded-xl bg-[#ECE4D5] border border-[#D9CEBC] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories Navigation Links */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C25E2E] font-bold block mb-1">
                    Produce Collections
                  </span>
                  <div className="space-y-1">
                    {categories.map((cat) => {
                      const isActive = cat.isHome
                        ? selectedCategory === ''
                        : selectedCategory === cat.id;
                      return (
                        <button
                          key={`drawer-${cat.id || 'home'}`}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleCategoryClick(cat.id, cat.isHome);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#162010] text-[#F5EFE6]'
                              : 'text-[#162010] hover:bg-[#ECE4D5]'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <ChevronRight className="w-4 h-4 opacity-40" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Orders Portal Shortcut */}
                <div className="pt-2 border-t border-[#D9CEBC]">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenOrders();
                    }}
                    className="w-full py-2.5 px-3.5 bg-[#FAF6F0] border border-[#D9CEBC] rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-[#162010] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-[#C25E2E]" />
                      <span>Track My Orders</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Bottom Section inside Drawer */}
              <div className="pt-4 border-t border-[#D9CEBC] space-y-2.5 text-xs font-mono">
                {user ? (
                  <div className="bg-[#FAF6F0] p-2.5 rounded-xl border border-[#D9CEBC] flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#162010] truncate">
                        {user.displayName || user.email}
                      </p>
                      <p className="text-[10px] text-[#5C6352] truncate">Verified Patron</p>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
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
                    className="w-full py-2.5 bg-[#162010] text-[#F5EFE6] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-[#D49B28]" />
                    <span>Sign In / Register</span>
                  </button>
                )}

                <a
                  href="https://wa.me/917995436215"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold rounded-xl border border-[#25D366]/30 flex items-center justify-center space-x-2 transition-colors cursor-pointer text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Farm Support</span>
                </a>
                <p className="text-[10px] text-[#5C6352] text-center">
                  brundavanamteam@gmail.com
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLEEK PHONE BOTTOM DOCK (Clean, High-End) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-xl border-t border-[#D9CEBC] px-2 py-1.5 shadow-2xl flex items-center justify-around select-none">
        <button
          onClick={() => handleCategoryClick('', true)}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
            selectedCategory === '' ? 'text-[#C25E2E] font-bold' : 'text-[#5C6352] hover:text-[#162010]'
          }`}
        >
          <HomeIcon className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Home</span>
          {selectedCategory === '' && (
            <span className="w-1 h-1 rounded-full bg-[#C25E2E] absolute bottom-0" />
          )}
        </button>

        <button
          onClick={() => handleCategoryClick('all')}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
            selectedCategory !== '' ? 'text-[#C25E2E] font-bold' : 'text-[#5C6352] hover:text-[#162010]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D49B28]" />
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Harvest</span>
          {selectedCategory !== '' && (
            <span className="w-1 h-1 rounded-full bg-[#C25E2E] absolute bottom-0" />
          )}
        </button>

        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-[#5C6352] hover:text-[#162010] transition-all cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Search</span>
        </button>

        <button
          onClick={onOpenOrders}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-[#5C6352] hover:text-[#162010] transition-all cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Orders</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center py-1 px-3 text-[#162010] hover:text-[#C25E2E] transition-all cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-[#162010]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#C25E2E] text-white font-bold text-[8px] min-w-3.5 h-3.5 px-0.5 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono font-bold tracking-tight mt-0.5">Cart</span>
        </button>
      </nav>
    </>
  );
};




