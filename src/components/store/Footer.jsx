import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/AuthContext';
import { ShieldCheck, Zap, BadgeCheck, CreditCard } from 'lucide-react';

const DEFAULT_ABOUT = {
  ar: 'متجر إلكتروني للمنتجات والخدمات الرقمية بتجربة واضحة وأسعار مرنة.',
  en: 'A digital storefront for products and services with a clear checkout and flexible pricing.',
};

export default function Footer({ brandName, settings = {} }) {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const year = new Date().getFullYear();
  const name = (brandName || 'Cloud Elara').trim();
  const ar = settings.footer_about_ar?.trim();
  const en = settings.footer_about_en?.trim();
  const paragraph = ar || en
    ? (isRTL ? (ar || en) : (en || ar))
    : (isRTL ? DEFAULT_ABOUT.ar : DEFAULT_ABOUT.en);

  const badges = [
    { icon: ShieldCheck, ar: 'دفع آمن', en: 'Secure payment' },
    { icon: Zap, ar: 'تسليم فوري', en: 'Instant delivery' },
    { icon: BadgeCheck, ar: 'متجر موثوق', en: 'Verified store' },
    { icon: CreditCard, ar: 'طرق دفع متعددة', en: 'Multiple methods' },
  ];

  return (
    <footer className="border-t border-gold/10 bg-navy">
      {/* Trust badges strip */}
      <div className="border-b border-gold/8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`text-sm font-medium text-foreground/75 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {isRTL ? b.ar : b.en}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg btn-primary text-base font-black">
                {name.charAt(0)}
              </span>
              <h3 className="font-display text-xl font-bold uppercase tracking-[0.18em] text-foreground/90">{name}</h3>
            </div>
            <p className={`max-w-md text-sm leading-relaxed text-foreground/45 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {paragraph}
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[11px] font-semibold uppercase tracking-widest text-foreground/35">
              {isRTL ? 'التسوق' : 'Shop'}
            </h4>
            <div className="space-y-2.5">
              {[
                { to: '/products', label: t('allProducts') },
                { to: '/categories', label: t('categories') },
              ].map((l) => (
                <Link key={l.to} to={l.to} className={`block text-sm text-foreground/45 transition-colors hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-[11px] font-semibold uppercase tracking-widest text-foreground/35">
              {isRTL ? 'روابط مهمة' : 'Important links'}
            </h4>
            <div className="space-y-2.5">
              {[
                { to: '/products', label: isRTL ? 'من نحن' : 'About us' },
                { to: '/products', label: isRTL ? 'سياسة الاستبدال' : 'Refund policy' },
                { to: '/products', label: isRTL ? 'سياسة الخصوصية' : 'Privacy policy' },
              ].map((l, i) => (
                <Link key={i} to={l.to} className={`block text-sm text-foreground/45 transition-colors hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {l.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link to="/admin" className={`block text-sm text-gold/60 transition-colors hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {t('dashboard')}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gold/8 pt-8 md:flex-row">
          <p className={`text-center text-[11px] text-foreground/30 md:text-start ${isRTL ? 'font-arabic' : 'font-display uppercase tracking-wider'}`}>
            {isRTL
              ? `© ${year} ${name} — جميع الحقوق محفوظة`
              : `© ${year} ${name.toUpperCase()} — ALL RIGHTS RESERVED`}
          </p>
          <div className="flex items-center gap-1">
            <div className="h-px w-4 bg-gold/20" />
            <span className="font-display text-xs text-gold/30">✦</span>
            <div className="h-px w-4 bg-gold/20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
