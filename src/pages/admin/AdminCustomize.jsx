import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from '@/components/admin/ImageUploader';
import { toast } from 'sonner';
import { Save, Palette } from 'lucide-react';

function defaultCustomizeForm() {
  return {
    currency: 'SAR',
    show_featured: true,
    products_per_row: 3,
    layout_style: 'grid',
    store_name_ar: '',
    store_name_en: 'Cloud Elara',
    hero_title_ar: 'منتجات مميزة بأسعار تناسبك',
    hero_title_en: 'Featured picks at fair prices',
    hero_subtitle_ar: '',
    hero_subtitle_en: '',
    hero_overlay_opacity: '0.12',
    hero_image: '',
    logo_url: '',
    footer_about_ar:
      'متجر إلكتروني للمنتجات والخدمات الرقمية بتجربة واضحة وأسعار مرنة.',
    footer_about_en:
      'A digital storefront for products and services with a clear checkout and flexible pricing.',
    ui_nav_labels_json:
      '{\n  "home": {"ar":"","en":""},\n  "products": {"ar":"","en":""},\n  "categories": {"ar":"","en":""},\n  "shopNow": {"ar":"","en":""},\n  "exploreServices": {"ar":"","en":""}\n}',
    custom_site_css: '',
    theme_background: '',
    theme_navy: '',
    theme_navy_mid: '',
    theme_navy_light: '',
    theme_gold: '',
    theme_gold_light: '',
    theme_foreground: '',
    theme_card: '',
    theme_card_foreground: '',
    theme_muted: '',
    theme_muted_foreground: '',
    theme_border: '',
    theme_input: '',
    theme_accent: '',
    theme_primary: '',
    theme_ring: '',
    theme_sidebar_bg: '',
  };
}

export default function AdminCustomize() {
  const { t, isRTL } = useLanguage();
  const qc = useQueryClient();
  const [form, setForm] = useState(null);

  const { data: list } = useQuery({
    queryKey: ['storeSettings'],
    queryFn: () => api.entities.StoreSettings.list(),
    initialData: [],
  });
  const existing = list?.[0];

  useEffect(() => {
    if (form !== null) return;
    if (existing) {
      const base = defaultCustomizeForm();
      const merged = { ...base, ...existing };
      if (merged.hero_overlay_opacity != null && typeof merged.hero_overlay_opacity === 'number') {
        merged.hero_overlay_opacity = String(merged.hero_overlay_opacity);
      }
      if (!String(merged.ui_nav_labels_json || '').trim()) merged.ui_nav_labels_json = base.ui_nav_labels_json;
      setForm(merged);
    } else {
      setForm(defaultCustomizeForm());
    }
  }, [existing, form]);

  const saveMut = useMutation({
    mutationFn: (data) => {
      if (existing?.id) return api.entities.StoreSettings.update(existing.id, data);
      return api.entities.StoreSettings.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success(t('save'));
    },
    onError: () => toast.error(isRTL ? 'فشل الحفظ' : 'Save failed'),
  });

  const save = () => {
    const data = { ...form };
    const n = Number(data.hero_overlay_opacity);
    data.hero_overlay_opacity = Number.isFinite(n) ? n : 0.12;
    [
      'theme_background',
      'theme_navy',
      'theme_navy_mid',
      'theme_navy_light',
      'theme_gold',
      'theme_gold_light',
      'theme_foreground',
      'theme_card',
      'theme_card_foreground',
      'theme_muted',
      'theme_muted_foreground',
      'theme_border',
      'theme_input',
      'theme_accent',
      'theme_primary',
      'theme_ring',
      'theme_sidebar_bg',
    ].forEach((k) => {
      if (typeof data[k] === 'string') data[k] = data[k].trim();
    });
    delete data.id;
    delete data.created_date;
    delete data.updated_date;
    delete data.created_by;
    saveMut.mutate(data);
  };

  if (!form) return null;

  const colorRows = [
    { k: 'theme_background', lbl: isRTL ? 'خلفية الصفحة' : 'Page background' },
    { k: 'theme_navy', lbl: isRTL ? 'Navy أساسي' : 'Base navy' },
    { k: 'theme_navy_mid', lbl: isRTL ? 'Navy سطح' : 'Surface navy' },
    { k: 'theme_navy_light', lbl: isRTL ? 'Navy فاتح' : 'Light navy' },
    { k: 'theme_gold', lbl: isRTL ? 'الذهبي' : 'Gold' },
    { k: 'theme_gold_light', lbl: isRTL ? 'ذهبي فاتح' : 'Light gold' },
    { k: 'theme_foreground', lbl: isRTL ? 'لون النص' : 'Main text' },
    { k: 'theme_card', lbl: isRTL ? 'خلفية بطاقة' : 'Card background' },
    { k: 'theme_card_foreground', lbl: isRTL ? 'نص البطاقة' : 'Card text' },
    { k: 'theme_muted', lbl: isRTL ? 'خلفية خامدة' : 'Muted surface' },
    { k: 'theme_muted_foreground', lbl: isRTL ? 'نص خامد' : 'Muted text' },
    { k: 'theme_border', lbl: isRTL ? 'حدود' : 'Borders' },
    { k: 'theme_input', lbl: isRTL ? 'مدخلات' : 'Inputs' },
    { k: 'theme_primary', lbl: 'Primary' },
    { k: 'theme_accent', lbl: 'Accent' },
    { k: 'theme_ring', lbl: isRTL ? 'حلقة التركيز' : 'Focus ring' },
    { k: 'theme_sidebar_bg', lbl: isRTL ? 'لوحة جانبية (إدارة)' : 'Admin sidebar' },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            <Palette className="h-6 w-6 text-gold" />
            {t('customizeSite')}
          </h1>
          <p className={`mt-1 text-xs text-muted-foreground max-w-xl ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('customizeIntro')}</p>
        </div>
        <Button onClick={save} disabled={saveMut.isPending} className="rounded-xl bg-gold font-bold text-navy hover:bg-gold-light">
          <Save className="h-4 w-4" />
          {t('save')}
        </Button>
      </div>

      <div className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className={isRTL ? 'font-arabic' : 'font-english'}>{t('brandEnglishOnly')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="font-english">{t('brandNameEn')} *</Label>
              <Input value={form.store_name_en} onChange={(e) => setForm({ ...form, store_name_en: e.target.value })} className="mt-1 font-english" dir="ltr" placeholder="Cloud Elara" />
            </div>
            <div>
              <Label>{t('storeNameArabicAssist')}</Label>
              <Input value={form.store_name_ar} onChange={(e) => setForm({ ...form, store_name_ar: e.target.value })} className="mt-1 font-arabic" dir="rtl" />
              <p className="mt-1 text-[11px] text-muted-foreground">{t('storeNameArabicHint')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={isRTL ? 'font-arabic' : 'font-english'}>{t('heroCustomize')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="font-arabic">{t('heroTitle')} (عربي)</Label>
                <Input value={form.hero_title_ar} onChange={(e) => setForm({ ...form, hero_title_ar: e.target.value })} className="mt-1 font-arabic" dir="rtl" />
              </div>
              <div>
                <Label className="font-english">{t('heroTitle')} (English)</Label>
                <Input value={form.hero_title_en} onChange={(e) => setForm({ ...form, hero_title_en: e.target.value })} className="mt-1 font-english" dir="ltr" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="font-arabic">{t('heroSubtitle')} (عربي)</Label>
                <Textarea rows={3} value={form.hero_subtitle_ar} onChange={(e) => setForm({ ...form, hero_subtitle_ar: e.target.value })} className="mt-1 font-arabic" dir="rtl" />
              </div>
              <div>
                <Label className="font-english">{t('heroSubtitle')} (English)</Label>
                <Textarea rows={3} value={form.hero_subtitle_en} onChange={(e) => setForm({ ...form, hero_subtitle_en: e.target.value })} className="mt-1 font-english" dir="ltr" />
              </div>
            </div>
            <div>
              <Label>{t('heroOpacity')}</Label>
              <Input type="number" step="0.01" min="0.02" max="1" value={form.hero_overlay_opacity} onChange={(e) => setForm({ ...form, hero_overlay_opacity: e.target.value })} className="mt-1 font-english max-w-[180px]" dir="ltr" />
            </div>
            <div>
              <Label>{t('image')}</Label>
              <ImageUploader images={form.hero_image ? [form.hero_image] : []} onChange={(imgs) => setForm({ ...form, hero_image: imgs[0] || '' })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={isRTL ? 'font-arabic' : 'font-english'}>{t('themeColorsSection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-[11px] text-muted-foreground">{t('themeHexHint')}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colorRows.map(({ k, lbl }) => (
                <div key={k}>
                  <Label className="text-[11px]">{lbl}</Label>
                  <Input value={form[k] || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1 font-english uppercase" dir="ltr" placeholder="#______" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={isRTL ? 'font-arabic' : 'font-english'}>{t('footerAbout')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="font-arabic">{t('description')} (عربي)</Label>
              <Textarea rows={4} value={form.footer_about_ar} onChange={(e) => setForm({ ...form, footer_about_ar: e.target.value })} className="mt-1 font-arabic" dir="rtl" />
            </div>
            <div>
              <Label className="font-english">{t('description')} (English)</Label>
              <Textarea rows={4} value={form.footer_about_en} onChange={(e) => setForm({ ...form, footer_about_en: e.target.value })} className="mt-1 font-english" dir="ltr" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('navLabelsJsonTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea rows={12} dir="ltr" value={form.ui_nav_labels_json} onChange={(e) => setForm({ ...form, ui_nav_labels_json: e.target.value })} className="font-mono text-[11px]" />
            <p className="mt-2 text-[11px] text-muted-foreground">{t('navLabelsJsonHint')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('customCssTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea rows={10} dir="ltr" value={form.custom_site_css} onChange={(e) => setForm({ ...form, custom_site_css: e.target.value })} className="font-mono text-[11px]" />
            <p className="mt-2 text-[11px] text-muted-foreground">{t('customCssHint')}</p>
          </CardContent>
        </Card>

        <div className={`flex pb-16 ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <Button onClick={save} disabled={saveMut.isPending} className="rounded-xl bg-accent">
            <Save className="h-4 w-4" />
            {t('save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
