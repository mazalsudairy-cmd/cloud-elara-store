import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

function StarParticle({ x, y, size, delay }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.35)]"
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
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-navy md:min-h-[92vh]">
      {/* Brand artwork — soft watermark aligned with identity */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] z-0 hidden w-[min(88vw,480px)] -translate-x-1/2 -translate-y-1/2 select-none sm:block md:w-[min(72vw,520px)]"
        aria-hidden
      >
        <img
          src="/branding/elara-brand-art.png"
          alt=""
          className="w-full opacity-[0.11] contrast-[1.05] saturate-[0.85]"
        />
      </div>

      {/* Starfield */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {stars.map(s => <StarParticle key={s.id} {...s} />)}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,175,90,0.05) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {settings?.hero_image && (
        <div className="absolute inset-0 z-[1] opacity-[0.08]">
          <img src={settings.hero_image} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        <div className={`max-w-2xl ${isRTL ? 'mr-0' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-px w-6 bg-gold/60" />
            <span className={`text-[11px] uppercase tracking-[0.38em] text-white/90 ${isRTL ? 'font-arabic' : 'font-wordmark'}`}>
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
            className={`text-base leading-relaxed text-foreground/55 md:text-lg md:text-foreground/50 mb-10 max-w-xl ${isRTL ? 'font-arabic' : 'font-english'}`}
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
              className={`inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-navy shadow-lg shadow-gold/15 transition-all duration-300 hover:bg-gold-light ${isRTL ? 'font-arabic' : 'font-english'}`}
            >
              <span>{t('shopNow')}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
            <Link
              to="/categories"
              className={`inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-navy-mid/40 px-7 py-3.5 text-sm font-medium text-foreground/80 backdrop-blur-sm transition-all duration-300 hover:border-gold/55 hover:bg-gold/[0.08] hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}
            >
              {t('exploreServices')}
            </Link>
          </motion.div>
        </div>
      </div>

      <a
        href="#browse"
        className={`absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-foreground/35 transition-colors hover:text-gold/80 ${isRTL ? 'font-arabic' : 'font-english'}`}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold/40">{t('scrollHint')}</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/15 bg-navy-mid/60 text-gold/55 backdrop-blur-sm"
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </a>
    </section>
  );
}
