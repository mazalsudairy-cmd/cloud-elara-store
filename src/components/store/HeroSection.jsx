import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function StarParticle({ x, y, size, delay }) {
  return (
    <motion.div
      className="absolute rounded-full bg-gold"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ opacity: [0.15, 0.8, 0.15] }}
      transition={{ duration: 3 + Math.random() * 2, delay, repeat: Infinity }}
    />
  );
}

const stars = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 1.5 + 0.5,
  delay: Math.random() * 4,
}));

export default function HeroSection({ settings }) {
  const { t, isRTL } = useLanguage();

  const title = isRTL
    ? 'منتجات رقمية مميزة، مختارة بعناية'
    : 'Premium Digital Products, Curated with Precision';

  const subtitle = isRTL
    ? 'اكتشف منتجات رقمية وحلول مخصصة صُممت بجودة عالية وتجربة احترافية تجمع بين الأناقة والكفاءة.'
    : 'Discover refined digital products and custom-crafted solutions designed with quality, performance, and elegance in mind.';

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-navy">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map(s => <StarParticle key={s.id} {...s} />)}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <line x1="8%" y1="18%" x2="22%" y2="32%" stroke="#d4af5a" strokeWidth="0.5" />
          <line x1="22%" y1="32%" x2="38%" y2="22%" stroke="#d4af5a" strokeWidth="0.5" />
          <line x1="62%" y1="12%" x2="76%" y2="28%" stroke="#d4af5a" strokeWidth="0.5" />
          <line x1="76%" y1="28%" x2="88%" y2="18%" stroke="#d4af5a" strokeWidth="0.5" />
          <line x1="82%" y1="72%" x2="92%" y2="60%" stroke="#d4af5a" strokeWidth="0.5" />
        </svg>
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,90,0.05) 0%, transparent 65%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {settings?.hero_image && (
        <div className="absolute inset-0 opacity-[0.08]">
          <img src={settings.hero_image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        <div className={`max-w-2xl ${isRTL ? 'mr-0' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-px w-6 bg-gold/60" />
            <span className="text-gold/70 text-xs font-display tracking-[0.35em] uppercase">
              {isRTL ? 'كلاود إلارا' : 'Cloud Elara'}
            </span>
            <div className="h-px w-6 bg-gold/60" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={`text-4xl md:text-6xl font-bold leading-tight mb-6 ${isRTL ? 'font-arabic text-5xl md:text-7xl' : 'font-display'}`}
            style={{ color: '#f0e4c0' }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-base md:text-lg text-foreground/50 mb-10 leading-relaxed max-w-xl ${isRTL ? 'font-arabic' : 'font-english'}`}
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/products"
              className={`inline-flex items-center gap-2 bg-gold text-navy px-7 py-3.5 rounded-lg text-sm font-bold hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/15 ${isRTL ? 'font-arabic' : 'font-english'}`}
            >
              <span>{t('shopNow')}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
            <Link
              to="/categories"
              className={`inline-flex items-center gap-2 border border-gold/25 text-foreground/70 px-7 py-3.5 rounded-lg text-sm font-medium hover:border-gold/50 hover:text-gold transition-all duration-300 ${isRTL ? 'font-arabic' : 'font-english'}`}
            >
              {t('exploreServices')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
