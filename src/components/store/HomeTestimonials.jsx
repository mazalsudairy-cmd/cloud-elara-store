import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeTestimonials({ testimonials = [] }) {
  const { t, isRTL } = useLanguage();
  if (!testimonials.length) return null;

  return (
    <section className="border-y border-gold/8 bg-navy-mid/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="section-eyebrow justify-center">{isRTL ? '★ موثوق' : '★ Trusted'}</span>
          <h2 className={`mt-3 text-2xl font-bold text-foreground/90 md:text-3xl ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {t('customerReviews')}
          </h2>
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible">
          {testimonials.map((rv, i) => {
            const text = (isRTL ? rv.text_ar : rv.text_en) || rv.text_ar || rv.text_en || '';
            const rating = Math.min(5, Math.max(1, Number(rv.rating) || 5));
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.08 }}
                className="surface relative min-w-[78%] shrink-0 snap-start rounded-2xl p-6 sm:min-w-[300px] md:min-w-0"
              >
                <Quote className={`absolute top-5 h-8 w-8 text-gold/15 ${isRTL ? 'left-5 scale-x-[-1]' : 'right-5'}`} />
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`h-3.5 w-3.5 ${s < rating ? 'fill-gold text-gold' : 'text-foreground/15'}`} />
                  ))}
                </div>
                <p className={`mb-5 text-sm leading-relaxed text-foreground/70 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {text}
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold">
                    {(rv.name || '?').trim().charAt(0)}
                  </div>
                  <span className={`text-sm font-semibold text-foreground/85 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {rv.name}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
