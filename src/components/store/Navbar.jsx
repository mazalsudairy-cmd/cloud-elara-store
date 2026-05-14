import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useCart } from '@/lib/cartStore';
import LanguageToggle from './LanguageToggle';
import { ShoppingBag, Menu, X, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/client';

export default function Navbar({ storeName }) {
  const { t, isRTL } = useLanguage();
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/products', label: t('products') },
    { path: '/categories', label: t('categories') },
  ];

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex min-w-0 items-center gap-3 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-navy-mid/90 p-0.5 shadow-inner shadow-black/40 ring-1 ring-gold/15 transition-all group-hover:border-gold/35 group-hover:ring-gold/25">
              <img
                src="/branding/elara-brand-art.png"
                alt=""
                className="h-full w-full object-contain object-center opacity-[0.98]"
              />
            </span>
            <span className="truncate text-sm font-display font-semibold tracking-[0.12em] text-foreground/95 sm:tracking-[0.16em]">
              {(storeName || (isRTL ? 'كلاود إلارا' : 'Cloud Elara')).toString()}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative pb-0.5 ${
                  location.pathname === link.path ? 'text-gold' : 'text-foreground/50 hover:text-foreground/90'
                } ${isRTL ? 'font-arabic' : 'font-english'}`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div layoutId="navline" className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold/60" />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageToggle />

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden md:flex items-center rounded-lg p-2.5 text-foreground/40 transition-colors hover:bg-gold/5 hover:text-gold"
                title={t('dashboard')}
              >
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            )}

            {user ? (
              <button
                type="button"
                onClick={() => api.auth.logout('/')}
                className="hidden md:flex items-center gap-1.5 rounded-lg p-2.5 text-foreground/45 transition-colors hover:bg-gold/5 hover:text-foreground/90"
                title={user.email}
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => api.auth.redirectToLogin(window.location.href)}
                className={`hidden md:inline-flex items-center gap-2 rounded-lg border border-gold/25 bg-gold/[0.06] px-3.5 py-2 text-xs font-medium text-gold/85 transition-colors hover:border-gold/45 hover:bg-gold/[0.1] hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}
              >
                <LogIn className="h-3.5 w-3.5 shrink-0" />
                <span>{isRTL ? 'دخول' : 'Login'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative rounded-lg p-2.5 text-foreground/45 transition-colors hover:bg-gold/5 hover:text-foreground/90"
              aria-label={t('cart')}
            >
              <ShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-gold text-navy text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-english"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2.5 text-foreground/45 transition-colors hover:bg-gold/5 hover:text-foreground/90"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? (isRTL ? 'إغلاق القائمة' : 'Close menu') : (isRTL ? 'فتح القائمة' : 'Open menu')}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-gold/10 bg-navy/95 backdrop-blur-md"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'bg-gold/10 text-gold' : 'text-foreground/55 hover:bg-gold/[0.06] hover:text-foreground/90'
                  } ${isRTL ? 'font-arabic' : 'font-english'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm text-foreground/35 hover:bg-gold/[0.06] hover:text-foreground/70 ${isRTL ? 'font-arabic' : 'font-english'}`}
              >
                {t('dashboard')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}