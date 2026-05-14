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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6"
          >
            {isRTL ? (
              <p
                dir="rtl"
                className="font-brandArabic inline-block max-w-[100%] text-5xl sm:text-6xl md:text-[4.75rem] leading-[1.05] tracking-wide text-[#f2e8c8]"
                style={{
                  textShadow: '0 2px 40px rgba(201,168,76,0.35), 0 1px 0 rgba(255,248,225,0.12)',
                  fontWeight: 400,
                }}
              >
                كلاود إلارا
              </p>
            ) : (
              <p className="font-display text-4xl sm:text-5xl md:text-[3.5rem] tracking-[0.28em] font-bold uppercase text-[#f0e4c0] drop-shadow-[0_2px_28px_rgba(201,168,76,0.2)]">
                Cloud Elara
              </p>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`mb-12 text-[1.35rem] sm:text-2xl md:text-3xl font-semibold leading-snug text-foreground/88 ${isRTL ? 'font-arabic' : 'font-display tracking-wide text-foreground/80'}`}
          >
            {isRTL ? 'منتجات مميزة بأسعار تناسبك' : 'Featured products at prices that work for you'}
          </motion.h1>

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
