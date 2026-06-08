import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { useLanguage } from '@/lib/i18n';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { uiLabel, parseJsonArray } from '@/lib/storeTheme';

export default function HeroSection({ settings = {}, brandName = 'Cloud Elara', navLabels = {} }) {
  const { t, isRTL, localized } = useLanguage();

  // Build slides: configured banners, else a single fallback slide.
  let slides = parseJsonArray(settings?.banners_json);
  if (!slides.length) {
    slides = [{
      image: settings?.hero_image || '',
      title_ar: settings?.hero_title_ar,
      title_en: settings?.hero_title_en,
      subtitle_ar: settings?.hero_subtitle_ar,
      subtitle_en: settings?.hero_subtitle_en,
      cta_ar: '',
      cta_en: '',
      link: '/products',
    }];
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1, direction: isRTL ? 'rtl' : 'ltr', align: 'center' });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    if (slides.length <= 1) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [emblaApi, onSelect, slides.length]);

  // Re-init embla when direction changes.
  useEffect(() => {
    if (emblaApi) emblaApi.reInit({ loop: slides.length > 1, direction: isRTL ? 'rtl' : 'ltr', align: 'center' });
  }, [emblaApi, isRTL, slides.length]);

  const op = Number(settings?.hero_overlay_opacity);
  const imgOp = Number.isFinite(op) ? Math.min(1, Math.max(0.02, op)) : 0.45;
  const mark = (brandName || 'Cloud Elara').trim();

  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((b, i) => {
            const title = (isRTL ? b.title_ar : b.title_en) || b.title_ar || b.title_en || t('featured');
            const sub = (isRTL ? b.subtitle_ar : b.subtitle_en) || b.subtitle_ar || b.subtitle_en || '';
            const cta = (isRTL ? b.cta_ar : b.cta_en) || b.cta_ar || b.cta_en || uiLabel(navLabels, isRTL, 'shopNow', t);
            const link = b.link || '/products';
            return (
              <div key={i} className="relative min-w-0 flex-[0_0_100%]">
                <div className="relative flex min-h-[62vh] items-center overflow-hidden md:min-h-[78vh]">
                  {/* Background image */}
                  {b.image ? (
                    <div className="pointer-events-none absolute inset-0">
                      <img src={b.image} alt="" className="h-full w-full object-cover" style={{ opacity: imgOp }} />
                    </div>
                  ) : null}
                  {/* Gradient wash */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: isRTL
                        ? 'linear-gradient(270deg, hsl(var(--navy)/0.55) 0%, hsl(var(--navy)/0.85) 60%, hsl(var(--navy)) 100%)'
                        : 'linear-gradient(90deg, hsl(var(--navy)/0.55) 0%, hsl(var(--navy)/0.85) 60%, hsl(var(--navy)) 100%)',
                    }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
                  <div
                    className="pointer-events-none absolute top-1/4 h-[520px] w-[520px] rounded-full"
                    style={{ background: 'radial-gradient(circle, hsl(var(--gold)/0.14) 0%, transparent 65%)', [isRTL ? 'right' : 'left']: '8%' }}
                  />

                  {/* Content */}
                  <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                      <motion.span
                        key={`brand-${i}-${selected}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="section-eyebrow mb-5"
                      >
                        {mark}
                      </motion.span>

                      <motion.h1
                        key={`title-${i}-${selected}`}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.05 }}
                        className={`mb-5 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl ${isRTL ? 'font-arabic' : 'font-display'}`}
                      >
                        {title}
                      </motion.h1>

                      {sub ? (
                        <motion.p
                          key={`sub-${i}-${selected}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.15 }}
                          className={`mb-9 max-w-xl text-base leading-relaxed text-foreground/55 ${isRTL ? 'font-arabic' : 'font-english'}`}
                        >
                          {sub}
                        </motion.p>
                      ) : null}

                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="flex flex-wrap gap-3"
                      >
                        <Link
                          to={link}
                          className={`inline-flex items-center gap-2 rounded-xl btn-primary px-7 py-3.5 text-sm font-bold ${isRTL ? 'font-arabic' : 'font-english'}`}
                        >
                          <span>{cta}</span>
                          {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                        </Link>
                        <Link
                          to="/categories"
                          className={`inline-flex items-center gap-2 rounded-xl border border-gold/25 px-7 py-3.5 text-sm font-medium text-foreground/75 transition-colors hover:border-gold/50 hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}
                        >
                          {uiLabel(navLabels, isRTL, 'exploreServices', t)}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${selected === i ? 'w-6 bg-gold' : 'w-2 bg-foreground/30 hover:bg-foreground/50'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
