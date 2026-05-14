import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeFaqSection() {
  const { t, isRTL } = useLanguage();
  const [open, setOpen] = useState(null);

  const faqs = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') },
  ];

  return (
    <section className="border-t border-gold/8 py-20 bg-navy-mid/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-xl md:text-2xl font-semibold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {t('faq')}
          </h2>
          <div className="h-px w-10 bg-gold/40 mt-2 mx-auto" />
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-navy-mid elara-border overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full flex items-center justify-between p-5 text-start hover:bg-gold/5 transition-colors ${isRTL ? 'font-arabic' : 'font-english'}`}
              >
                <span className="text-sm text-foreground/80 font-medium">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gold/40 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''} ${isRTL ? 'mr-4' : 'ml-4'}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className={`px-5 pb-5 text-sm text-foreground/45 leading-relaxed ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
