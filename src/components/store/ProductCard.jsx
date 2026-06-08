import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useCart } from '@/lib/cartStore';
import { ShoppingBag, Star, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ProductPrice from '@/components/store/ProductPrice';
import { isMonthlyProduct } from '@/lib/productPricing';

export default function ProductCard({ product }) {
  const { t, isRTL, localized } = useLanguage();
  const { addItem } = useCart();
  const monthly = isMonthlyProduct(product);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(isRTL ? 'تمت الإضافة للسلة ✨' : 'Added to cart ✨');
  };

  const name = localized(product, 'name');
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.compare_price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="surface card-gold-hover relative flex h-full flex-col overflow-hidden rounded-2xl">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-light to-navy">
                <ShoppingBag className="h-12 w-12 text-gold/20" />
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Desktop quick add */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-3 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-xl btn-primary py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className={isRTL ? 'font-arabic' : 'font-english'}>{t('addToCart')}</span>
              </motion.button>
            </div>

            {/* Badges */}
            {hasDiscount && (
              <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                <span className="rounded-full bg-destructive px-2 py-1 text-xs font-bold text-white shadow-lg">-{discountPct}%</span>
              </div>
            )}
            {product.featured && (
              <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy shadow-lg">
                  <Star className="h-3.5 w-3.5 fill-navy" />
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className={`line-clamp-2 min-h-[2.5rem] text-sm font-medium text-foreground/85 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {name}
              </h3>
              {monthly && (
                <span className={`flex shrink-0 items-center gap-1 rounded-full bg-gold/12 px-2 py-0.5 text-[10px] font-bold text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  <RefreshCw className="h-2.5 w-2.5" />
                  {t('pricePeriodMonth')}
                </span>
              )}
            </div>
            <div className="mt-auto flex items-center gap-2">
              <ProductPrice product={product} className="text-lg" />
              {hasDiscount && (
                <span className="font-english text-xs text-muted-foreground line-through">{product.compare_price}</span>
              )}
            </div>
            {product.stock === 0 && (
              <span className={`mt-1 block text-xs text-destructive/70 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {t('outOfStock')}
              </span>
            )}

            {/* Mobile add */}
            <div className="mt-3 md:hidden">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={product.stock === 0}
                className={`flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl btn-primary py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40 ${isRTL ? 'font-arabic' : 'font-english'}`}
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                {t('addToCart')}
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
