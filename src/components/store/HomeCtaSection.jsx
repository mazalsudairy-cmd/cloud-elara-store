import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeCtaSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-navy-mid elara-border text-center px-8 py-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,90,0.06) 0%, transparent 60%)' }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-5 bg-gold/40" />
              <span className="text-gold/50 text-xs font-display tracking-widest uppercase">Elara Store</span>
              <div className="h-px w-5 bg-gold/40" />
            </div>
            <h2 className={`text-2xl md:text-3xl font-bold text-foreground/90 mb-4 ${isRTL ? 'font-arabic' : 'font-display'}`}>
              {t('ctaTitle')}
            </h2>
            <p className={`text-sm text-foreground/40 mb-10 max-w-md mx-auto leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {t('ctaSubtitle')}
            </p>
            <Link
              to="/products"
              className={`inline-flex items-center gap-2 bg-gold text-navy px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/15 ${isRTL ? 'font-arabic' : 'font-english'}`}
            >
              <span>{t('ctaBtn')}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
