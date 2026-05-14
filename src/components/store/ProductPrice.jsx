import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { isMonthlyProduct } from '@/lib/productPricing';

/** Storefront unit price: amount + SAR + optional /mo · /شهر */
export default function ProductPrice({ product, className = '' }) {
  const { t, isRTL } = useLanguage();
  const monthly = isMonthlyProduct(product);
  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-1 font-english text-gold ${className}`}>
      <span className="font-bold">{product.price}</span>
      <span className={`font-bold text-gold/60 ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('sar')}</span>
      {monthly && (
        <span className={`text-gold/55 ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {t('perMonthSuffix')}
        </span>
      )}
    </span>
  );
}
