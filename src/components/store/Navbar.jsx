import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useCart } from '@/lib/cartStore';
import LanguageToggle from './LanguageToggle';
import { ShoppingBag, Menu, X, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { uiLabel } from '@/lib/storeTheme';

export default function Navbar({ brandName = 'Cloud Elara', navLabels = {} }) {
  const { t, isRTL } = useLanguage();
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const loginHref = `/login?return=${encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`;

  const navLinks = [
    { path: '/', key: 'home' },
    { path: '/products', key: 'products' },
    { path: '/categories', key: 'categories' },
  ].map((l) => ({ ...l, label: uiLabel(navLabels, isRTL, l.key, t) }));

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[3.75rem] py-1.5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 rounded-md">
            <span className="truncate leading-tight text-[13px] sm:text-sm md:text-[0.95rem] font-display font-bold tracking-[0.22em] uppercase text-[#eae1c9] md:tracking-[0.28em]">
              {(brandName || 'Cloud Elara').trim()}
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
                onClick={() => logout(true)}
                className="hidden md:flex items-center gap-1.5 p-2 text-foreground/30 hover:text-foreground/70 transition-colors rounded-lg text-xs"
                title={user.email}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                to={loginHref}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gold/20 text-gold/60 hover:border-gold/40 hover:text-gold rounded-lg transition-colors font-english`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isRTL ? 'دخول' : 'Login'}</span>
              </Link>
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
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 px-3 text-xs text-gold/50 ${isRTL ? 'font-arabic' : 'font-english'}`}
                >
                  {t('dashboard')}
                </Link>
              )}
              {!user && (
                <Link
                  to={loginHref}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2.5 px-3 text-xs text-foreground/50 ${isRTL ? 'font-arabic' : 'font-english'}`}
                >
                  {isRTL ? 'دخول' : 'Login'}
                </Link>
              )}
              {user && (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); logout(true); }}
                  className={`block w-full py-2.5 px-3 text-start text-xs text-foreground/40 ${isRTL ? 'font-arabic' : 'font-english'}`}
                >
                  {isRTL ? 'خروج' : 'Logout'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
