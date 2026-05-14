import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useCart } from '@/lib/cartStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/store/ProductCard';
import ProductPrice from '@/components/store/ProductPrice';
import { isMonthlyProduct } from '@/lib/productPricing';
import { ShoppingBag, Minus, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductDetail() {
  const id = window.location.pathname.split('/product/')[1];
  const { t, isRTL, localized } = useLanguage();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const list = await api.entities.Product.filter({ id });
      return list[0];
    },
    enabled: !!id,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.category_id],
    queryFn: () => api.entities.Product.filter({ status: 'active', category_id: product.category_id }, '-created_date', 4),
    enabled: !!product?.category_id,
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-8 h-8 border-4 border-navy-mid border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const name = localized(product, 'name');
  const description = localized(product, 'description');
  const images = product.images || [];
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.compare_price) * 100) : 0;
  const related = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);
  const monthly = isMonthlyProduct(product);

  const handleAdd = () => {
    addItem(product, qty);
    toast.success(isRTL ? 'تمت الإضافة ✨' : 'Added to cart ✨');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        to="/products"
        className={`inline-flex items-center gap-2 text-sm text-gold/50 hover:text-gold mb-8 transition-colors ${isRTL ? 'font-arabic' : 'font-english'}`}
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {t('backToStore')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="aspect-square rounded-3xl overflow-hidden bg-navy-mid elara-border mb-4">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-mid to-navy">
                <ShoppingBag className="w-20 h-20 text-gold/10" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-gold' : 'border-gold/10 hover:border-gold/30'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 text-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {name}
          </h1>
          <div className="gold-divider mb-6" />

          <div className="flex items-baseline gap-4 mb-6 flex-wrap">
            <ProductPrice product={product} className="text-3xl" />
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through font-english">
                  {product.compare_price}
                  <span className={`text-sm text-muted-foreground/80 ms-1 ${isRTL ? 'font-arabic' : ''}`}>{t('sar')}</span>
                  {monthly && (
                    <span className={`text-xs text-muted-foreground/80 ms-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {t('perMonthSuffix')}
                    </span>
                  )}
                </span>
                <span className="bg-destructive/15 text-destructive text-xs font-bold px-2 py-1 rounded-full">-{discountPct}%</span>
              </>
            )}
          </div>

          {description && (
            <div className={`text-foreground/50 leading-relaxed mb-8 whitespace-pre-wrap bg-navy-mid rounded-2xl p-4 elara-border text-sm ${isRTL ? 'font-arabic text-base' : 'font-english'}`}>
              {description}
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-400' : 'bg-destructive'}`} />
            <span className={`text-sm ${product.stock > 0 ? 'text-emerald-400' : 'text-destructive'} ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {product.stock > 0 ? `${t('inStock')} (${product.stock})` : t('outOfStock')}
            </span>
          </div>

          {/* Quantity & Add */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gold/20 rounded-xl overflow-hidden bg-navy-mid">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gold/10 text-gold/70 hover:text-gold transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 font-medium text-foreground font-english">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-gold/10 text-gold/70 hover:text-gold transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="w-full h-14 bg-gold hover:bg-gold-light text-navy rounded-xl text-base font-bold gap-2 shadow-lg shadow-gold/20 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className={isRTL ? 'font-arabic' : 'font-english'}>{t('addToCart')}</span>
          </Button>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className={`text-2xl font-bold mb-2 text-gold-gradient ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {t('relatedProducts')}
          </h2>
          <div className="gold-divider mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}