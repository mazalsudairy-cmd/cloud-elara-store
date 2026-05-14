import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';

export default function Footer({ storeName }) {
  const { t, isRTL } = useLanguage();
  const year = new Date().getFullYear();
  const brand =
    storeName?.trim() ||
    (isRTL ? 'كلاود إلارا' : 'Cloud Elara');

  return (
    <footer className="mt-0 border-t border-gold/10 bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <h3 className="mb-4 font-display text-2xl font-bold tracking-wide text-foreground/95">
              {brand}
            </h3>
            <p className={`max-w-sm text-sm leading-relaxed text-foreground/45 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {isRTL
                ? 'منتجات رقمية مميزة وحلول مخصصة مصممة بجودة وأناقة.'
                : 'Premium digital products and custom solutions designed with quality and elegance.'}
            </p>
          </div>

          {/* Shop */}
          <div className="md:col-span-3">
            <h4 className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/50">
              {isRTL ? 'التسوق' : 'Shop'}
            </h4>
            <div className="space-y-3">
              {[
                { to: '/products', label: t('allProducts') },
                { to: '/categories', label: t('categories') },
              ].map(l => (
                <Link key={l.to} to={l.to} className={`block text-sm text-foreground/45 transition-colors hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Manage */}
          <div className="md:col-span-4">
            <h4 className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/50">
              {t('dashboard')}
            </h4>
            <div className="space-y-3">
              {[
                { to: '/admin', label: t('overview') },
                { to: '/admin/products', label: t('manageProducts') },
                { to: '/admin/categories', label: t('manageCategories') },
                { to: '/admin/settings', label: t('storeSettings') },
              ].map(l => (
                <Link key={l.to} to={l.to} className={`block text-sm text-foreground/45 transition-colors hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gold/10 pt-10 md:flex-row">
          <p className={`text-center text-xs text-foreground/30 md:text-start ${isRTL ? 'font-arabic' : 'font-display tracking-wider'}`}>
            {isRTL ? `© ${year} ${brand} — جميع الحقوق محفوظة` : `© ${year} ${brand} — All rights reserved`}
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
