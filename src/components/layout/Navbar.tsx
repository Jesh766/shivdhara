import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, Sparkles, ChevronRight, User as UserIcon, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { SHIV_DHARA_LOGO } from '../../lib/assets';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenConsultation,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { user, openAuthModal, logout, requireAuth } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Numerology', path: '/numerology' },
    { name: 'Vastu', path: '/vastu' },
    { name: 'Meditation', path: '/meditation' },
    { name: 'Workshops', path: '/workshops' },
    { name: 'Products', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  const headerInteractive = true;

  return (
    <>
      <header
        id="main-navbar"
        aria-hidden={!headerInteractive}
        style={{
          opacity: 1,
          transform: 'translateY(0px)',
          pointerEvents: headerInteractive ? 'auto' : 'none',
        }}
        className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,box-shadow,border-color,padding] duration-500 ${
          scrolled
            ? 'bg-[#FAF4EA]/96 backdrop-blur-xl shadow-md py-3 border-b border-[#E6D5B8] text-[#2B211E]'
            : 'bg-[#FAF4EA]/92 backdrop-blur-md py-4.5 border-b border-[#E6D5B8]/60 text-[#2B211E]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center text-left group cursor-pointer focus:outline-none shrink-0"
            aria-label="SHIV DHARA Homepage"
          >
            <div
              id="navbar-logo-target"
              className="relative h-12 sm:h-14 w-12 sm:w-14 flex items-center justify-center group-hover:scale-[1.04] transition-transform duration-300"
            >
              <img
                src={SHIV_DHARA_LOGO}
                alt="SHIV DHARA Logo"
                className="relative z-10 h-10 sm:h-12 w-10 sm:w-12 object-contain transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </button>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-7 px-4">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`type-label text-[11px] font-semibold transition-all relative py-1 hover:text-[#A85C3B] cursor-pointer ${
                    isActive
                      ? 'text-[#A85C3B]'
                      : 'text-[#2B211E]/85'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A85C3B]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* 1. Book Consultation CTA */}
            <button
              id="nav-book-consultation-btn"
              onClick={() => {
                requireAuth(() => onOpenConsultation());
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#A85C3B]/40 hover:border-[#A85C3B] text-[#A85C3B] hover:text-[#924C2F] text-xs font-semibold tracking-wider hover:shadow-sm transition-all duration-300 group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#A85C3B]" />
              <span>Book Consultation</span>
            </button>

            {/* 2. Sacred Bag / Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-[#2B211E] hover:bg-[#A85C3B]/10 transition-colors cursor-pointer"
              aria-label="Open sacred bag"
            >
              <ShoppingBag className="w-5 h-5 text-[#2B211E]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#A85C3B] text-[#FFFDF9] text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse font-sans">
                  {itemCount}
                </span>
              )}
            </button>

            {/* 3. HIGHLIGHTED CUSTOMER LOGIN / PROFILE BUTTON (PLACED LAST) */}
            {user ? (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border-2 border-[#A85C3B]/50 hover:border-[#A85C3B] shadow-sm text-xs font-bold text-[#2B211E] transition-all cursor-pointer ring-2 ring-[#E6B55A]/40 hover:ring-[#E6B55A]"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#163A36] to-[#245852] text-[#F7F1E6] flex items-center justify-center text-[10px] uppercase font-bold shadow-inner">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white border border-[#E6D5B8] shadow-xl p-2 hidden group-hover:block transition-all z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <span className="block text-xs font-bold text-[#163A36] truncate">{user.name}</span>
                    <span className="block text-[10px] text-gray-400 truncate">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                type="button"
                onClick={() => openAuthModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#A85C3B] to-[#C56A45] hover:from-[#924C2F] hover:to-[#B45D39] text-[#FFFDF9] text-xs font-bold tracking-wider shadow-md hover:shadow-lg hover:shadow-[#A85C3B]/30 ring-2 ring-[#E6B55A]/60 transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#FFFDF9]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-full lg:hidden cursor-pointer text-[#2B211E] hover:bg-[#A85C3B]/10 transition-colors"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-fullscreen"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-0 z-50 bg-[#FAF4EA] text-[#2B211E] flex flex-col justify-between p-6 sm:p-8 lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[#E6D5B8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white border border-[#A85C3B]/40 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#A85C3B]" />
                </div>
                <div>
                  <span className="text-lg font-serif tracking-[0.2em] uppercase block text-[#2B211E]">SHIV DHARA</span>
                  <span className="type-label text-[9px] text-[#A85C3B] block font-semibold">By Falgun Thakkr</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-[#2B211E] hover:bg-[#A85C3B]/10 cursor-pointer"
                aria-label="Close mobile navigation"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-8 space-y-4 overflow-y-auto">
              {navLinks.map((link, idx) => {
                const isActive = currentPath === link.path;
                return (
                  <motion.button
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleLinkClick(link.path)}
                    className={`w-full text-left py-2.5 text-2xl font-serif flex items-center justify-between border-b border-[#E6D5B8]/40 cursor-pointer ${
                      isActive ? 'text-[#A85C3B] font-normal italic' : 'text-[#2B211E] hover:text-[#A85C3B]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-5 h-5 text-[#A85C3B]/60" />
                  </motion.button>
                );
              })}
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E6D5B8]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full btn-primary-terracotta flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book a Consultation</span>
              </button>
              <div className="flex items-center justify-between text-xs text-[#2B211E]/60 pt-2 px-2">
                <span className="type-label text-[10px] text-[#A85C3B]">NUMEROLOGY • VASTU • MEDITATION</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};