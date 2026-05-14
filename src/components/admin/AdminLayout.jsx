import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import LanguageToggle from '@/components/store/LanguageToggle';
import {
  LayoutDashboard, Package, FolderOpen, Settings, Store, Menu,
  ChevronLeft, ChevronRight, CreditCard, ShoppingCart
} from 'lucide-react';

const navItems = [
  { key: 'overview', path: '/admin', icon: LayoutDashboard },
  { key: 'orders', path: '/admin/orders', icon: ShoppingCart, labelAr: 'الطلبات', labelEn: 'Orders' },
  { key: 'manageProducts', path: '/admin/products', icon: Package },
  { key: 'manageCategories', path: '/admin/categories', icon: FolderOpen },
  { key: 'payment', path: '/admin/payment', icon: CreditCard, labelAr: 'الدفع', labelEn: 'Payment' },
  { key: 'storeSettings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getLabel = (item) => {
    if (item.labelAr && item.labelEn) return isRTL ? item.labelAr : item.labelEn;
    return t(item.key);
  };

  const Sidebar = ({ mobile = false } = {}) => (
    <div className={`flex flex-col h-full ${isRTL ? 'font-arabic' : 'font-english'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-gold/10 flex items-center justify-between">
        {(!collapsed || mobile) && (
          <Link to="/admin" className="text-xl font-display font-bold text-gold-gradient tracking-widest">
            ELARA
          </Link>
        )}
        {!mobile && (
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-foreground/40 hover:text-gold">
            {isRTL
              ? (collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
              : (collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'text-foreground/50 hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {(!collapsed || mobile) && <span>{getLabel(item)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gold/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/40 hover:text-gold hover:bg-secondary transition-all"
        >
          <Store className="w-5 h-5 shrink-0" />
          {(!collapsed || mobile) && <span>{t('viewStore')}</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex bg-background ${isRTL ? 'font-arabic' : 'font-english'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block border-e border-gold/10 bg-navy shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-64 bg-navy z-50 md:hidden shadow-xl`}>
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-gold/10 px-4 md:px-8 h-14 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 hover:bg-secondary rounded-lg text-foreground/60">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ms-auto">
            <LanguageToggle />
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
