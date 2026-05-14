import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';

export default function PageNotFound() {
  const location = useLocation();
  const { lang, t, isRTL } = useLanguage();
  const path = location.pathname;

  const title = lang === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found';
  const subtitle =
    lang === 'ar'
      ? `لم نعثر على المسار "${path}".`
      : `We could not find the page "${path}".`;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 bg-navy text-white ${isRTL ? 'font-arabic' : 'font-english'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <p className="text-7xl font-light tracking-tight text-gold/90">404</p>
          <div className="h-0.5 w-16 bg-gold/50 mx-auto rounded-full" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="text-sm leading-relaxed text-white/60">{subtitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20 hover:border-gold/60 transition-colors"
          >
            {t('home')}
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {t('products')}
          </Link>
        </div>
      </div>
    </div>
  );
}
