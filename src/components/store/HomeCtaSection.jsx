import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeCtaSection({ brandName = '' }) {
  const { t, isRTL } = useLanguage();
  const mark = (brandName || '').trim();

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface relative overflow-hidden rounded-3xl px-8 py-16 text-center"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--gold)/0.14) 0%, transparent 60%)' }}
          />
          <div className="relative">
            {mark ? (
              <div className="mb-6 inline-flex items-center gap-2">
                <div className="h-px w-5 bg-gold/40" />
                <span className="font-display text-xs uppercase tracking-widest text-gold/70">{mark}</span>
                <div className="h-px w-5 bg-gold/40" />
              </div>
            ) : null}
            <h2 className={`mb-4 text-2xl font-bold text-foreground/90 md:text-3xl ${isRTL ? 'font-arabic' : 'font-display'}`}>
              {t('ctaTitle')}
            </h2>
            <p className={`mx-auto mb-10 max-w-md text-sm leading-relaxed text-foreground/45 ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {t('ctaSubtitle')}
            </p>
            <Link
              to="/products"
              className={`inline-flex items-center gap-2 rounded-xl btn-primary px-8 py-3.5 text-sm font-bold ${isRTL ? 'font-arabic' : 'font-english'}`}
            >
              <span>{t('ctaBtn')}</span>
              {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
