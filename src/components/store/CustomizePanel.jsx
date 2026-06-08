import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/AuthContext';
import { useCustomize } from '@/lib/customizeStore';
import {
  THEME_PRESET_LIST,
  THEME_PRESETS,
  DEFAULT_PRESET_KEY,
  normalizeHex,
  hslSpaceToHex,
  parseJsonArray,
  parseSectionVisibility,
} from '@/lib/storeTheme';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Wand2, Palette, Image as ImageIcon, Megaphone, LayoutList, Star,
  MessageCircle, PanelBottom, Save, RotateCcw, Plus, Trash2,
} from 'lucide-react';

const COLOR_FIELDS = [
  { field: 'theme_background', cssVar: '--background', ar: 'خلفية الصفحة', en: 'Page background' },
  { field: 'theme_navy_mid', cssVar: '--navy-mid', ar: 'البطاقات والأسطح', en: 'Cards & surfaces' },
  { field: 'theme_gold', cssVar: '--gold', ar: 'اللون المميّز', en: 'Accent color' },
  { field: 'theme_gold_light', cssVar: '--gold-light', ar: 'مميّز فاتح (تدرّج)', en: 'Accent light' },
  { field: 'theme_foreground', cssVar: '--foreground', ar: 'لون النص', en: 'Text color' },
  { field: 'theme_border', cssVar: '--border', ar: 'الحدود', en: 'Borders' },
];

const SECTION_TOGGLES = [
  { key: 'categories', ar: 'الأقسام', en: 'Categories' },
  { key: 'featured', ar: 'المنتجات المميزة', en: 'Featured products' },
  { key: 'bestSellers', ar: 'الأكثر مبيعاً', en: 'Best sellers' },
  { key: 'newArrivals', ar: 'وصل حديثاً', en: 'New arrivals' },
  { key: 'trust', ar: 'لماذا تختارنا', en: 'Why choose us' },
  { key: 'testimonials', ar: 'آراء العملاء', en: 'Testimonials' },
  { key: 'faq', ar: 'الأسئلة الشائعة', en: 'FAQ' },
  { key: 'cta', ar: 'دعوة لاتخاذ إجراء', en: 'Call to action' },
];

function currentHex(settings, field, cssVar) {
  const override = settings?.[field];
  const norm = normalizeHex(override);
  if (norm) return norm;
  const presetKey = settings?.theme_preset || DEFAULT_PRESET_KEY;
  const preset = THEME_PRESETS[presetKey] || THEME_PRESETS[DEFAULT_PRESET_KEY];
  return hslSpaceToHex(preset.vars[cssVar]) || '#000000';
}

const TABS = [
  { id: 'theme', icon: Palette, ar: 'الألوان', en: 'Colors' },
  { id: 'hero', icon: ImageIcon, ar: 'الهيرو', en: 'Hero' },
  { id: 'promo', icon: Megaphone, ar: 'العروض', en: 'Promo' },
  { id: 'sections', icon: LayoutList, ar: 'الأقسام', en: 'Sections' },
  { id: 'reviews', icon: Star, ar: 'الآراء', en: 'Reviews' },
  { id: 'contact', icon: MessageCircle, ar: 'التواصل', en: 'Contact' },
  { id: 'footer', icon: PanelBottom, ar: 'الفوتر', en: 'Footer' },
];

export default function CustomizePanel() {
  const { isRTL } = useLanguage();
  const { user } = useAuth();
  const { settings, isOpen, open, close, setField, applyPreset, resetDraft, save, saving } = useCustomize();
  const [tab, setTab] = useState('theme');

  const isAdmin = user?.role === 'admin';
  if (!isAdmin) return null;

  const tx = (ar, en) => (isRTL ? ar : en);
  const banners = parseJsonArray(settings?.banners_json);
  const reviews = parseJsonArray(settings?.testimonials_json);
  const sections = parseSectionVisibility(settings?.section_visibility_json);
  const presetKey = settings?.theme_preset || DEFAULT_PRESET_KEY;

  const updateBanner = (i, patch) => {
    const next = banners.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    setField('banners_json', JSON.stringify(next));
  };
  const addBanner = () => {
    setField('banners_json', JSON.stringify([...banners, { image: '', title_ar: '', title_en: '', subtitle_ar: '', subtitle_en: '', cta_ar: '', cta_en: '', link: '/products' }]));
  };
  const removeBanner = (i) => setField('banners_json', JSON.stringify(banners.filter((_, idx) => idx !== i)));

  const updateReview = (i, patch) => {
    const next = reviews.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    setField('testimonials_json', JSON.stringify(next));
  };
  const addReview = () => setField('testimonials_json', JSON.stringify([...reviews, { name: '', text_ar: '', text_en: '', rating: 5 }]));
  const removeReview = (i) => setField('testimonials_json', JSON.stringify(reviews.filter((_, idx) => idx !== i)));

  const toggleSection = (key, val) => setField('section_visibility_json', JSON.stringify({ ...sections, [key]: val }));

  const handleSave = async () => {
    try {
      await save();
      toast.success(tx('تم حفظ التخصيص ✨', 'Customization saved ✨'));
    } catch {
      toast.error(tx('فشل الحفظ', 'Save failed'));
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={open}
        className={`fixed bottom-5 z-40 flex items-center gap-2 rounded-full btn-primary px-4 py-3 text-sm font-bold ${isRTL ? 'left-5' : 'right-5'}`}
        title={tx('تخصيص المتجر', 'Customize store')}
      >
        <Wand2 className="h-4 w-4" />
        <span className={isRTL ? 'font-arabic' : 'font-english'}>{tx('تخصيص', 'Customize')}</span>
      </button>

      <Sheet open={isOpen} onOpenChange={(o) => (o ? open() : close())}>
        <SheetContent
          side={isRTL ? 'right' : 'left'}
          className="flex w-full flex-col gap-0 border-border bg-navy p-0 sm:max-w-md"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border/60 px-5 py-4">
            <Wand2 className="h-5 w-5 text-gold" />
            <h2 className={`text-base font-bold ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {tx('محرر المتجر الحي', 'Live store editor')}
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-border/60 px-3 py-2">
            {TABS.map((tb) => {
              const Icon = tb.icon;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setTab(tb.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    tab === tb.id ? 'bg-gold/15 text-gold' : 'text-foreground/45 hover:text-foreground/80'
                  } ${isRTL ? 'font-arabic' : 'font-english'}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tx(tb.ar, tb.en)}
                </button>
              );
            })}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {tab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <SectionLabel isRTL={isRTL}>{tx('ثيمات جاهزة', 'Ready themes')}</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {THEME_PRESET_LIST.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => applyPreset(p.key)}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-start transition-colors ${
                          presetKey === p.key ? 'border-gold bg-gold/10' : 'border-border/60 hover:border-gold/40'
                        }`}
                      >
                        <span className="h-7 w-7 shrink-0 rounded-full" style={{ background: p.swatch, boxShadow: `0 0 14px ${p.swatch}66` }} />
                        <span className={`text-xs font-medium text-foreground/80 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                          {tx(p.label_ar, p.label_en)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionLabel isRTL={isRTL}>{tx('ألوان مخصّصة', 'Custom colors')}</SectionLabel>
                  <div className="space-y-2.5">
                    {COLOR_FIELDS.map((c) => {
                      const hex = currentHex(settings, c.field, c.cssVar);
                      return (
                        <div key={c.field} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2">
                          <span className={`text-xs text-foreground/70 ${isRTL ? 'font-arabic' : 'font-english'}`}>{tx(c.ar, c.en)}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-english text-[10px] uppercase text-foreground/40">{hex}</span>
                            <input
                              type="color"
                              value={hex}
                              onChange={(e) => setField(c.field, e.target.value.toUpperCase())}
                              className="h-8 w-10 cursor-pointer rounded-md border border-border/60 bg-transparent p-0.5"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {tab === 'hero' && (
              <div className="space-y-4">
                <SectionLabel isRTL={isRTL}>{tx('بانرات الهيرو (سلايدر)', 'Hero banners (slider)')}</SectionLabel>
                {banners.length === 0 && (
                  <p className={`text-xs text-foreground/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {tx('لا توجد بانرات بعد. أضف أول بانر.', 'No banners yet. Add the first one.')}
                  </p>
                )}
                {banners.map((b, i) => (
                  <div key={i} className="space-y-2 rounded-xl border border-border/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gold">#{i + 1}</span>
                      <button type="button" onClick={() => removeBanner(i)} className="rounded p-1 text-destructive/70 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Field label={tx('رابط الصورة', 'Image URL')} value={b.image} onChange={(v) => updateBanner(i, { image: v })} dir="ltr" />
                    <Field label={tx('العنوان (عربي)', 'Title (AR)')} value={b.title_ar} onChange={(v) => updateBanner(i, { title_ar: v })} dir="rtl" />
                    <Field label={tx('العنوان (إنجليزي)', 'Title (EN)')} value={b.title_en} onChange={(v) => updateBanner(i, { title_en: v })} dir="ltr" />
                    <Field label={tx('وصف (عربي)', 'Subtitle (AR)')} value={b.subtitle_ar} onChange={(v) => updateBanner(i, { subtitle_ar: v })} dir="rtl" />
                    <Field label={tx('وصف (إنجليزي)', 'Subtitle (EN)')} value={b.subtitle_en} onChange={(v) => updateBanner(i, { subtitle_en: v })} dir="ltr" />
                    <div className="grid grid-cols-2 gap-2">
                      <Field label={tx('زر (عربي)', 'CTA (AR)')} value={b.cta_ar} onChange={(v) => updateBanner(i, { cta_ar: v })} dir="rtl" />
                      <Field label={tx('الرابط', 'Link')} value={b.link} onChange={(v) => updateBanner(i, { link: v })} dir="ltr" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addBanner} className="w-full rounded-lg">
                  <Plus className="h-3.5 w-3.5" /> {tx('إضافة بانر', 'Add banner')}
                </Button>
              </div>
            )}

            {tab === 'promo' && (
              <div className="space-y-4">
                <ToggleRow
                  isRTL={isRTL}
                  label={tx('تفعيل شريط العروض العلوي', 'Enable promo top bar')}
                  checked={settings?.promo_bar_enabled !== false}
                  onChange={(v) => setField('promo_bar_enabled', v)}
                />
                <Field label={tx('نص العرض (عربي)', 'Promo text (AR)')} value={settings?.promo_bar_text_ar || ''} onChange={(v) => setField('promo_bar_text_ar', v)} dir="rtl" />
                <Field label={tx('نص العرض (إنجليزي)', 'Promo text (EN)')} value={settings?.promo_bar_text_en || ''} onChange={(v) => setField('promo_bar_text_en', v)} dir="ltr" />
              </div>
            )}

            {tab === 'sections' && (
              <div className="space-y-2.5">
                <SectionLabel isRTL={isRTL}>{tx('إظهار/إخفاء الأقسام', 'Show / hide sections')}</SectionLabel>
                {SECTION_TOGGLES.map((s) => (
                  <ToggleRow
                    key={s.key}
                    isRTL={isRTL}
                    label={tx(s.ar, s.en)}
                    checked={sections[s.key] !== false}
                    onChange={(v) => toggleSection(s.key, v)}
                  />
                ))}
              </div>
            )}

            {tab === 'reviews' && (
              <div className="space-y-4">
                <SectionLabel isRTL={isRTL}>{tx('آراء العملاء', 'Customer reviews')}</SectionLabel>
                {reviews.map((r, i) => (
                  <div key={i} className="space-y-2 rounded-xl border border-border/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gold">#{i + 1}</span>
                      <button type="button" onClick={() => removeReview(i)} className="rounded p-1 text-destructive/70 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Field label={tx('الاسم', 'Name')} value={r.name} onChange={(v) => updateReview(i, { name: v })} dir={isRTL ? 'rtl' : 'ltr'} />
                    <Field label={tx('النص (عربي)', 'Text (AR)')} value={r.text_ar} onChange={(v) => updateReview(i, { text_ar: v })} dir="rtl" textarea />
                    <Field label={tx('النص (إنجليزي)', 'Text (EN)')} value={r.text_en} onChange={(v) => updateReview(i, { text_en: v })} dir="ltr" textarea />
                    <div>
                      <label className={`mb-1 block text-[11px] text-foreground/50 ${isRTL ? 'font-arabic' : 'font-english'}`}>{tx('التقييم (1-5)', 'Rating (1-5)')}</label>
                      <Input type="number" min="1" max="5" value={r.rating ?? 5} onChange={(e) => updateReview(i, { rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)) })} className="h-9 font-english" dir="ltr" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addReview} className="w-full rounded-lg">
                  <Plus className="h-3.5 w-3.5" /> {tx('إضافة رأي', 'Add review')}
                </Button>
              </div>
            )}

            {tab === 'contact' && (
              <div className="space-y-4">
                <ToggleRow
                  isRTL={isRTL}
                  label={tx('زر واتساب عائم', 'Floating WhatsApp button')}
                  checked={!!settings?.whatsapp_enabled}
                  onChange={(v) => setField('whatsapp_enabled', v)}
                />
                <Field
                  label={tx('رقم واتساب (دولي بدون +)', 'WhatsApp number (intl, no +)')}
                  value={settings?.whatsapp_number || ''}
                  onChange={(v) => setField('whatsapp_number', v.replace(/[^\d]/g, ''))}
                  dir="ltr"
                  placeholder="9665XXXXXXXX"
                />
              </div>
            )}

            {tab === 'footer' && (
              <div className="space-y-4">
                <Field label={tx('نص من نحن (عربي)', 'About text (AR)')} value={settings?.footer_about_ar || ''} onChange={(v) => setField('footer_about_ar', v)} dir="rtl" textarea />
                <Field label={tx('نص من نحن (إنجليزي)', 'About text (EN)')} value={settings?.footer_about_en || ''} onChange={(v) => setField('footer_about_en', v)} dir="ltr" textarea />
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-2 border-t border-border/60 px-5 py-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-xl btn-primary font-bold">
              <Save className="h-4 w-4" /> {tx('حفظ', 'Save')}
            </Button>
            <Button onClick={resetDraft} variant="outline" className="rounded-xl" title={tx('تراجع عن التغييرات', 'Revert changes')}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function SectionLabel({ children, isRTL }) {
  return (
    <p className={`mb-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
      {children}
    </p>
  );
}

function Field({ label, value, onChange, dir = 'ltr', placeholder = '', textarea = false }) {
  return (
    <div>
      <label className="mb-1 block text-[11px] text-foreground/50">{label}</label>
      {textarea ? (
        <Textarea rows={2} value={value || ''} onChange={(e) => onChange(e.target.value)} dir={dir} placeholder={placeholder} className="text-xs" />
      ) : (
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} dir={dir} placeholder={placeholder} className="h-9 text-xs" />
      )}
    </div>
  );
}

function ToggleRow({ label, checked, onChange, isRTL }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5">
      <span className={`text-xs text-foreground/75 ${isRTL ? 'font-arabic' : 'font-english'}`}>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
