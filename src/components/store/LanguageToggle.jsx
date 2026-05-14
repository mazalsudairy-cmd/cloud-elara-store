import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/25 text-gold/70 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-all text-xs font-medium"
    >
      <Globe className="w-3.5 h-3.5" />
      <span className={lang === 'ar' ? 'font-english' : 'font-arabic'}>
        {lang === 'ar' ? 'EN' : 'ع'}
      </span>
    </motion.button>
  );
}
