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
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 rounded-md">
            <span className="text-xs font-display font-bold tracking-[0.3em] uppercase text-foreground/80 truncate">
              {storeName || (isRTL ? 'كلاود إلارا' : 'CLOUD ELARA')}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-medium transition-colors relative pb-0.5 ${
                  location.pathname === link.path ? 'text-gold' : 'text-foreground/45 hover:text-foreground/80'
                } ${isRTL ? 'font-arabic' : 'font-english'}`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div layoutId="navline" className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold/60" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />

            {user?.role === 'admin' && (
              <Link to="/admin" className="hidden md:flex items-center p-2 text-foreground/30 hover:text-foreground/70 transition-colors rounded-lg" title={t('dashboard')}>
                <LayoutDashboard className="w-3.5 h-3.5" />
              </Link>
            )}

            {user ? (
              <button
                type="button"
                onClick={() => api.auth.logout('/')}
                className="hidden md:flex items-center gap-1.5 p-2 text-foreground/30 hover:text-foreground/70 transition-colors rounded-lg text-xs"
                title={user.email}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => api.auth.redirectToLogin(window.location.href)}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gold/20 text-gold/60 hover:border-gold/40 hover:text-gold rounded-lg transition-colors font-english`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isRTL ? 'دخول' : 'Login'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-foreground/40 hover:text-foreground/80 transition-colors rounded-lg"
              aria-label={t('cart')}
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -end-0.5 bg-gold text-navy text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-english"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground/40 hover:text-foreground/80 transition-colors"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? (isRTL ? 'إغلاق القائمة' : 'Close menu') : (isRTL ? 'فتح القائمة' : 'Open menu')}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-navy border-t border-gold/8"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                    location.pathname === link.path ? 'text-gold bg-gold/8' : 'text-foreground/45'
                  } ${isRTL ? 'font-arabic' : 'font-english'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={`block py-2.5 px-3 text-xs text-foreground/30 ${isRTL ? 'font-arabic' : 'font-english'}`}
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
