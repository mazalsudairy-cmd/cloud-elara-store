import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Sparkles } from 'lucide-react';

export default function TopBar({ settings = {} }) {
  const { isRTL } = useLanguage();
  if (settings?.promo_bar_enabled === false) return null;

  const text = (isRTL ? settings?.promo_bar_text_ar : settings?.promo_bar_text_en)
    || settings?.promo_bar_text_ar
    || settings?.promo_bar_text_en
    || '';
  if (!text.trim()) return null;

  // Two identical groups → translateX(-50%) loops seamlessly.
  const Group = () => (
    <div className="flex shrink-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={`mx-6 inline-flex items-center gap-2 text-xs font-medium text-foreground/80 ${isRTL ? 'font-arabic' : 'font-english'}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-b border-gold/15 bg-gradient-to-r from-[hsl(var(--gold)/0.18)] via-[hsl(var(--gold)/0.08)] to-[hsl(var(--gold)/0.18)]">
      <div className="marquee py-2">
        <Group />
        <Group />
      </div>
    </div>
  );
}
