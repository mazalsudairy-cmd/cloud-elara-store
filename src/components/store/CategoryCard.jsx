import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';

export default function CategoryCard({ category, index }) {
  const { isRTL, localized } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.06 }}
    >
      <Link to={`/products?category=${category.id}`} className="group block">
        <div className="surface card-gold-hover relative aspect-[4/3] overflow-hidden rounded-2xl">
          {category.image ? (
            <img
              src={category.image}
              alt={localized(category, 'name')}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/10 via-navy-light to-navy">
              <LayoutGrid className="h-10 w-10 text-gold/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <h3 className={`truncate text-sm font-bold text-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {localized(category, 'name')}
            </h3>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold opacity-0 transition-opacity group-hover:opacity-100">
              {isRTL ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
