import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function CategoryCard({ category, index }) {
  const { isRTL, localized } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link to={`/products?category=${category.id}`} className="block group">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-navy-mid elara-border card-gold-hover">
          {category.image ? (
            <img
              src={category.image}
              alt={localized(category, 'name')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gold/8 via-navy-light to-navy" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
          <div className="absolute bottom-4 start-4 end-4 sm:bottom-5 sm:start-5 sm:end-5">
            <h3 className={`truncate text-sm font-semibold text-foreground/95 sm:text-base ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {localized(category, 'name')}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
