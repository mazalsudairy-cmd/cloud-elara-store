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
    <section className="border-y border-gold/8 py-20 bg-navy-mid/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-xl md:text-2xl font-semibold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {t('whyChooseUs')}
          </h2>
          <div className="h-px w-10 bg-gold/40 mt-2 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-6 rounded-xl bg-navy-mid elara-border"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className={`font-semibold text-sm text-foreground/90 mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs text-foreground/40 leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
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
