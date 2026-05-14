import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';

const DEFAULT_ABOUT = {
  ar: 'متجر إلكتروني للمنتجات والخدمات الرقمية بتجربة واضحة وأسعار مرنة.',
  en: 'A digital storefront for products and services with a clear checkout and flexible pricing.',
};

export default function Footer({ brandName, settings = {} }) {
  const { t, isRTL } = useLanguage();
  const year = new Date().getFullYear();
  const name = (brandName || 'Cloud Elara').trim();
  const ar = settings.footer_about_ar?.trim();
  const en = settings.footer_about_en?.trim();
  const paragraph = ar || en
    ? isRTL ? (ar || en) : (en || ar)
    : isRTL ? DEFAULT_ABOUT.ar : DEFAULT_ABOUT.en;

  return (
    <footer className="mt-0 border-t border-gold/10 bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-10">
          {/* Brand — English-only mark */}
          <div className="md:col-span-2">
            <h3 className="mb-3 font-display text-2xl font-bold tracking-[0.2em] text-[#eae1c9] uppercase sm:text-3xl md:text-[2.125rem]" style={{ textShadow: '0 2px 24px rgba(201,168,76,0.18)' }}>
              {name}
            </h3>
            <p className={`max-w-md text-xs leading-relaxed text-foreground/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {paragraph}
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
                { to: '/admin/customize', label: t('customizeSite') },
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
          <p className={`text-center text-[11px] text-foreground/20 md:text-start font-display tracking-wider uppercase ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL
              ? `© ${year} ${name} — جميع الحقوق محفوظة`
              : `© ${year} ${name.toUpperCase()} — ALL RIGHTS RESERVED`}
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
