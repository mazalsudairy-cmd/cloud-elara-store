import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useCart } from '@/lib/cartStore';
import { ShoppingBag, Zap, Bot, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const categoryIcons = {
  default: ShoppingBag,
  tweak: Monitor,
  bot: Bot,
  discord: Bot,
};

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
      whileHover={{ y: -4 }}
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAdd}
                className="px-5 py-2.5 bg-gold text-navy rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-gold/30"
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
              <span className="text-lg font-bold text-gold font-english">
                {product.price} <span className={`text-sm text-gold/60 ${isRTL ? 'font-arabic' : ''}`}>{t('sar')}</span>
              </span>
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
