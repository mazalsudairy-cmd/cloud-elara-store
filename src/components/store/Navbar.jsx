import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useCart } from '@/lib/cartStore';
import LanguageToggle from './LanguageToggle';
import { ShoppingBag, Menu, X, LayoutDashboard, LogIn, LogOut, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { uiLabel } from '@/lib/storeTheme';

export default function Navbar({ brandName = 'Cloud Elara', navLabels = {} }) {
  const { t, isRTL } = useLanguage();
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const loginHref = `/login?return=${encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`;

  const navLinks = [
    { path: '/', key: 'home' },
    { path: '/products', key: 'products' },
    { path: '/categories', key: 'categories' },
  ].map((l) => ({ ...l, label: uiLabel(navLabels, isRTL, l.key, t) }));

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[4rem] items-center justify-between gap-4 py-2">
          <Link to="/" className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg btn-primary text-sm font-black">
              {(brandName || 'C').trim().charAt(0)}
            </span>
            <span className="truncate font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground/90 md:text-base">
              {(brandName || 'Cloud Elara').trim()}
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative pb-0.5 text-sm font-medium transition-colors ${
                  location.pathname === link.path ? 'text-gold' : 'text-foreground/55 hover:text-foreground/90'
                } ${isRTL ? 'font-arabic' : 'font-english'}`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div layoutId="navline" className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gold" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop search */}
          <form onSubmit={submitSearch} className="hidden flex-1 max-w-xs lg:block">
            <div className="relative">
              <Search className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search')}
                className={`h-9 w-full rounded-xl border border-border/60 bg-navy-mid/60 text-sm text-foreground placeholder:text-foreground/35 focus:border-gold/40 focus:outline-none ${isRTL ? 'pr-9 pl-3 font-arabic' : 'pl-9 pr-3 font-english'}`}
              />
            </div>
          </form>

          <div className="flex items-center gap-1.5">
            <LanguageToggle />

            {user?.role === 'admin' && (
              <Link to="/admin" className="hidden items-center rounded-lg p-2 text-foreground/40 transition-colors hover:text-foreground/80 md:flex" title={t('dashboard')}>
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            )}

            {user ? (
              <button
                type="button"
                onClick={() => logout(true)}
                className="hidden items-center gap-1.5 rounded-lg p-2 text-foreground/40 transition-colors hover:text-foreground/80 md:flex"
                title={user.email}
              >
                <LogOut className="h-4 w-4" />
              </button>
            ) : (
              <Link
                to={loginHref}
                className="hidden items-center gap-1.5 rounded-lg border border-gold/25 px-3 py-1.5 text-xs text-gold/70 transition-colors hover:border-gold/50 hover:text-gold md:flex"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className={isRTL ? 'font-arabic' : 'font-english'}>{isRTL ? 'دخول' : 'Login'}</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative rounded-lg p-2 text-foreground/60 transition-colors hover:text-foreground"
              aria-label={t('cart')}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold font-english text-[9px] font-bold text-navy"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-foreground/60 transition-colors hover:text-foreground md:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? (isRTL ? 'إغلاق القائمة' : 'Close menu') : (isRTL ? 'فتح القائمة' : 'Open menu')}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="overflow-hidden border-t border-gold/10 bg-navy md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              <form onSubmit={submitSearch} className="mb-3">
                <div className="relative">
                  <Search className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35 ${isRTL ? 'right-3' : 'left-3'}`} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search')}
                    className={`h-10 w-full rounded-xl border border-border/60 bg-navy-mid/60 text-sm text-foreground placeholder:text-foreground/35 focus:border-gold/40 focus:outline-none ${isRTL ? 'pr-9 pl-3 font-arabic' : 'pl-9 pr-3 font-english'}`}
                  />
                </div>
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === link.path ? 'bg-gold/10 text-gold' : 'text-foreground/55'
                  } ${isRTL ? 'font-arabic' : 'font-english'}`}
                >
                  {link.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className={`block px-3 py-2.5 text-sm text-gold/60 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {t('dashboard')}
                </Link>
              )}
              {!user ? (
                <Link to={loginHref} onClick={() => setMobileOpen(false)} className={`block px-3 py-2.5 text-sm text-foreground/55 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {isRTL ? 'دخول' : 'Login'}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); logout(true); }}
                  className={`block w-full px-3 py-2.5 text-start text-sm text-foreground/45 ${isRTL ? 'font-arabic' : 'font-english'}`}
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
