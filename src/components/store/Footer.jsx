import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
  const { t, isRTL } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/8 bg-navy mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-display font-bold tracking-widest mb-3 text-foreground/90">
              {isRTL ? 'إلارا ستور' : 'ELARA STORE'}
            </h3>
            <p className={`text-xs text-foreground/35 leading-relaxed max-w-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {isRTL
                ? 'منتجات رقمية مميزة وحلول مخصصة مصممة بجودة وأناقة.'
                : 'Premium digital products and custom solutions designed with quality and elegance.'}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-display tracking-widest uppercase text-foreground/30 mb-4">
              {isRTL ? 'التسوق' : 'Shop'}
            </h4>
            <div className="space-y-2.5">
              {[
                { to: '/products', label: t('allProducts') },
                { to: '/categories', label: t('categories') },
              ].map(l => (
                <Link key={l.to} to={l.to} className={`block text-xs text-foreground/35 hover:text-gold transition-colors ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Manage */}
          <div>
            <h4 className="text-xs font-display tracking-widest uppercase text-foreground/30 mb-4">
              {t('dashboard')}
            </h4>
            <div className="space-y-2.5">
              {[
                { to: '/admin', label: t('overview') },
                { to: '/admin/products', label: t('manageProducts') },
                { to: '/admin/categories', label: t('manageCategories') },
                { to: '/admin/settings', label: t('storeSettings') },
              ].map(l => (
                <Link key={l.to} to={l.to} className={`block text-xs text-foreground/35 hover:text-gold transition-colors ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gold/8 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className={`text-xs text-foreground/20 ${isRTL ? 'font-arabic' : 'font-display tracking-wider'}`}>
            {isRTL ? `© ${year} إلارا ستور — جميع الحقوق محفوظة` : `© ${year} ELARA STORE — ALL RIGHTS RESERVED`}
          </p>
          <div className="flex items-center gap-1">
            <div className="h-px w-4 bg-gold/20" />
            <span className="text-gold/20 text-xs font-display">✦</span>
            <div className="h-px w-4 bg-gold/20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
