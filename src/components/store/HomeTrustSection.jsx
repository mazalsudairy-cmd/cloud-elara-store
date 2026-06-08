import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { ShieldCheck, Zap, Star, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

const icons = [Star, ShieldCheck, Zap, Sliders];

export default function HomeTrustSection() {
  const { t, isRTL } = useLanguage();

  const items = [
    { icon: icons[0], title: t('trustQuality'), sub: t('trustQualitySub') },
    { icon: icons[1], title: t('trustSecure'), sub: t('trustSecureSub') },
    { icon: icons[2], title: t('trustFast'), sub: t('trustFastSub') },
    { icon: icons[3], title: t('trustTailored'), sub: t('trustTailoredSub') },
  ];

  return (
    <section className="border-y border-gold/8 bg-navy-mid/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="section-eyebrow justify-center">{isRTL ? 'مميزاتنا' : 'Our edge'}</span>
          <h2 className={`mt-3 text-2xl font-bold text-foreground/90 md:text-3xl ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {t('whyChooseUs')}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="surface rounded-2xl p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className={`mb-2 text-sm font-bold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed text-foreground/45 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {item.sub}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
