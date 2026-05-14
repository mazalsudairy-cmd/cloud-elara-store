import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { motion } from 'framer-motion';

export default function Categories() {
  const { t, isRTL, localized } = useLanguage();

  const { data: categories } = useQuery({
    queryKey: ['categories-page'],
    queryFn: () => api.entities.Category.filter({ status: 'active' }, 'sort_order'),
    initialData: [],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <h1 className={`text-2xl md:text-3xl font-semibold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
          {t('categories')}
        </h1>
        <div className="h-px w-10 bg-gold/40 mt-2" />
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={`/products?category=${cat.id}`} className="block group">
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-navy-mid elara-border card-gold-hover">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={localized(cat, 'name')}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/8 via-navy-light to-navy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className={`font-semibold text-base text-foreground/90 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {localized(cat, 'name')}
                    </h3>
                    {localized(cat, 'description') && (
                      <p className={`text-xs text-foreground/45 mt-1 line-clamp-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                        {localized(cat, 'description')}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className={`text-foreground/25 text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {t('noProducts')}
          </p>
        </div>
      )}
    </div>
  );
}