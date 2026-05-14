import React, { useState } from 'react';
import { useCart } from '@/lib/cartStore';
import { useLanguage } from '@/lib/i18n';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CheckoutModal from './CheckoutModal';
import ProductPrice from '@/components/store/ProductPrice';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, isOpen, setIsOpen } = useCart();
  const { t, isRTL, localized } = useLanguage();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-navy z-50 shadow-2xl flex flex-col border-s border-gold/10`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <h2 className={`text-lg font-bold text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {t('cart')}
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors text-foreground/50 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <ShoppingBag className="w-12 h-12 text-gold/15" />
                    <p className={`text-sm text-foreground/35 ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('emptyCart')}</p>
                    <p className={`text-xs text-foreground/20 ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('emptyCartSub')}</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: isRTL ? 100 : -100 }}
                        className="flex gap-4 p-3 bg-secondary/50 rounded-xl border border-gold/10"
                      >
                        {item.product.images?.[0] ? (
                          <img src={item.product.images[0]} alt={localized(item.product, 'name')} className="w-20 h-20 object-cover rounded-lg" />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-navy flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gold/20" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium text-sm truncate text-foreground/90 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                            {localized(item.product, 'name')}
                          </h3>
                          <div className="mt-1">
                            <ProductPrice product={item.product} className="text-sm" />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-md hover:bg-gold/10 text-gold/70 hover:text-gold transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center font-english">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-md hover:bg-gold/10 text-gold/70 hover:text-gold transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                            <button onClick={() => removeItem(item.product.id)} className="p-1 rounded-md hover:bg-destructive/10 text-destructive/50 hover:text-destructive transition-colors ms-auto">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gold/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-foreground/60 ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('subtotal')}</span>
                    <span className="text-xl font-bold text-gold font-english">{totalPrice.toFixed(0)} {t('sar')}</span>
                  </div>
                  <Button
                    onClick={() => { setIsOpen(false); setShowCheckout(true); }}
                    className="w-full bg-gold hover:bg-gold-light text-navy h-12 text-base font-bold rounded-xl"
                  >
                    <span className={isRTL ? 'font-arabic' : 'font-english'}>{t('checkout')}</span>
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal onClose={() => setShowCheckout(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
