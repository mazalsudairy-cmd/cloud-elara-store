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
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3
              className={`mb-3 ${
                isRTL
                  ? 'font-brandArabic text-3xl md:text-[2.65rem] text-[#eae1c9]'
                  : 'font-display text-xl font-bold tracking-widest text-foreground/90'
              }`}
              style={isRTL ? { fontWeight: 400, textShadow: '0 2px 24px rgba(201,168,76,0.2)' } : undefined}
            >
              {brand}
            </h3>
            <p className={`max-w-md text-xs leading-relaxed text-foreground/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {isRTL
                ? 'منصة تجارة إلكترونية أنيقة ثنائية اللغة تمزج سرداً جمالياً راقياً مع محرك مرن لتجارة رقمية متميزة.'
                : 'An elegant, bilingual e-commerce platform that blends high-end aesthetic storytelling with a powerful, modular engine for artisanal commerce.'}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 font-display text-[11px] font-semibold uppercase tracking-widest text-foreground/30">
              {isRTL ? 'التسوق' : 'Shop'}
            </h4>
            <div className="space-y-2.5">
              {[
                { to: '/products', label: t('allProducts') },
                { to: '/categories', label: t('categories') },
              ].map(l => (
                <Link key={l.to} to={l.to} className={`block text-xs text-foreground/35 transition-colors hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Manage */}
          <div>
            <h4 className="mb-4 font-display text-[11px] font-semibold uppercase tracking-widest text-foreground/30">
              {t('dashboard')}
            </h4>
            <div className="space-y-2.5">
              {[
                { to: '/admin', label: t('overview') },
                { to: '/admin/products', label: t('manageProducts') },
                { to: '/admin/categories', label: t('manageCategories') },
                { to: '/admin/settings', label: t('storeSettings') },
              ].map(l => (
                <Link key={l.to} to={l.to} className={`block text-xs text-foreground/35 transition-colors hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gold/8 pt-8 md:flex-row">
          <p className={`text-center text-[11px] text-foreground/20 md:text-start ${isRTL ? 'font-arabic' : 'font-display tracking-wider uppercase'}`}>
            {isRTL ? `© ${year} ${brand} — جميع الحقوق محفوظة` : `© ${year} ${brand.toUpperCase()} — ALL RIGHTS RESERVED`}
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
