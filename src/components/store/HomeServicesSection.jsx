import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { Bot, Code2, Package, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
  { icon: Bot, keyTitle: 'Discord Bots', keyTitleAr: 'بوتات ديسكورد', keyDesc: 'Custom-built Discord bots tailored to your server.', keyDescAr: 'بوتات ديسكورد مبنية خصيصاً لخادمك.' },
  { icon: Code2, keyTitle: 'Digital Solutions', keyTitleAr: 'حلول رقمية', keyDesc: 'Premium software and automation tools.', keyDescAr: 'برمجيات وأدوات أتمتة متقدمة.' },
  { icon: Package, keyTitle: 'Premium Tools', keyTitleAr: 'أدوات مميزة', keyDesc: 'Exclusive digital tools and productivity enhancers.', keyDescAr: 'أدوات رقمية حصرية لرفع الإنتاجية.' },
];

export default function HomeServicesSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <h2 className={`text-xl md:text-2xl font-semibold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
          {t('customServices')}
        </h2>
        <div className="h-px w-10 bg-gold/40 mt-2" />
        <p className={`text-sm text-foreground/40 mt-4 max-w-xl leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {t('discordBotsSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-navy-mid elara-border card-gold-hover group"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/8 flex items-center justify-center mb-5 group-hover:bg-gold/15 transition-colors">
                <Icon className="w-5 h-5 text-gold/70" />
              </div>
              <h3 className={`font-semibold text-sm text-foreground/90 mb-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL ? s.keyTitleAr : s.keyTitle}
              </h3>
              <p className={`text-xs text-foreground/40 leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL ? s.keyDescAr : s.keyDesc}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8">
        <Link
          to="/products"
          className={`inline-flex items-center gap-2 text-xs text-gold/60 hover:text-gold transition-colors ${isRTL ? 'font-arabic' : 'font-english'}`}
        >
          <span>{t('requestService')}</span>
          {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </Link>
      </div>
    </section>
  );
}
