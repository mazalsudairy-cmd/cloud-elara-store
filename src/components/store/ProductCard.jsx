import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useCart } from '@/lib/cartStore';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import ProductPrice from '@/components/store/ProductPrice';

export default function ProductCard({ product }) {
  const { t, isRTL, localized } = useLanguage();
  const { addItem } = useCart();

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
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-navy-mid elara-border card-gold-hover transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-navy-mid">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy to-secondary">
                <ShoppingBag className="w-12 h-12 text-gold/20" />
              </div>
            )}

            {/* Desktop: quick add on hover (hidden on touch widths — mobile uses bar below) */}
            <div className="pointer-events-none absolute inset-0 hidden bg-navy/0 opacity-0 transition-colors duration-300 group-hover:bg-navy/35 group-hover:opacity-100 md:flex md:items-end md:justify-center md:pb-4 md:group-hover:pointer-events-auto">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="pointer-events-auto px-5 py-2.5 bg-gold text-navy rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-gold/30 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className={isRTL ? 'font-arabic' : 'font-english'}>{t('addToCart')}</span>
              </motion.button>
            </div>

            {/* Badges */}
            {hasDiscount && (
              <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                <span className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discountPct}%
                </span>
              </div>
            )}
            {product.featured && (
              <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                <span className="bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full">★</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 border-t border-gold/10">
            <h3 className={`font-medium text-sm text-foreground/80 truncate mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <ProductPrice product={product} className="text-lg" />
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through font-english">
                  {product.compare_price}
                </span>
              )}
            </div>
            {product.stock === 0 && (
              <span className={`text-xs text-destructive/70 mt-1 block ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {t('outOfStock')}
              </span>
            )}

            {/* Mobile / coarse pointer: always-visible add — hover overlay is unusable on touch */}
            <div className="mt-3 md:hidden">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                disabled={product.stock === 0}
                className={`flex w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-gold/95 py-3 text-sm font-bold text-navy shadow-md shadow-gold/20 transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40 ${isRTL ? 'font-arabic' : 'font-english'}`}
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
