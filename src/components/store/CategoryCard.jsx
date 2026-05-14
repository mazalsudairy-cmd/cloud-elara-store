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
          <div className="absolute bottom-3 start-3 end-3">
            <h3 className={`font-medium text-sm text-foreground/90 truncate ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {localized(category, 'name')}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
