import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/admin/ImageUploader';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

function SecurityCard() {
  const { t, isRTL } = useLanguage();
  const qc = useQueryClient();
  const { data: cfg, isFetching } = useQuery({
    queryKey: ['authConfig-admin'],
    queryFn: () => api.auth.getAuthConfig(),
  });
  const [otp, setOtp] = useState(false);
  const [helpAr, setHelpAr] = useState('');
  const [helpEn, setHelpEn] = useState('');
  useEffect(() => {
    if (!cfg) return;
    setOtp(!!cfg.otp_recovery_enabled);
    setHelpAr(cfg.forgot_email_help_ar || '');
    setHelpEn(cfg.forgot_email_help_en || '');
  }, [cfg]);
  const saveMut = useMutation({
    mutationFn: () =>
      api.auth.updateAuthConfig({
        otp_recovery_enabled: otp,
        forgot_email_help_ar: helpAr,
        forgot_email_help_en: helpEn,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['authConfig-admin'] });
      qc.invalidateQueries({ queryKey: ['authConfig-public'] });
      toast.success(t('save'));
    },
    onError: () => toast.error(isRTL ? 'فشل الحفظ' : 'Save failed'),
  });
  return (
    <Card>
      <CardHeader><CardTitle className={isRTL ? 'font-arabic' : 'font-english'}>{t('securityAuth')}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label className="text-base">{t('otpRecoveryLabel')}</Label>
            <p className={`mt-1 text-xs text-muted-foreground ${isRTL ? 'font-arabic text-right sm:text-start' : 'font-english'}`}>{t('otpRecoveryHint')}</p>
          </div>
          <Switch checked={otp} onCheckedChange={setOtp} aria-label={t('otpRecoveryLabel')} />
        </div>
        <div>
          <Label className="font-arabic">{t('forgotEmailHelpAr')}</Label>
          <Textarea dir="rtl" rows={4} value={helpAr} onChange={(e) => setHelpAr(e.target.value)} className="mt-1 font-arabic" placeholder="تواصل معنا على…" />
        </div>
        <div>
          <Label className="font-english">{t('forgotEmailHelpEn')}</Label>
          <Textarea dir="ltr" rows={4} value={helpEn} onChange={(e) => setHelpEn(e.target.value)} className="mt-1 font-english" placeholder="Contact us at…" />
        </div>
        <Button type="button" onClick={() => saveMut.mutate()} disabled={saveMut.isPending || isFetching} className="gap-2 bg-accent">
          <Save className="h-4 w-4" />
          {isRTL ? 'حفظ الأمان' : 'Save security'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AdminSettings() {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();

  const { data: settingsList } = useQuery({
    queryKey: ['storeSettings'],
    queryFn: () => api.entities.StoreSettings.list(),
    initialData: [],
  });

  const existingSettings = settingsList?.[0];
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (existingSettings && !form) {
      setForm({ ...existingSettings });
    } else if (!existingSettings && !form) {
      setForm({
        store_name_ar: 'متجري',
        store_name_en: 'Cloud Elara',
        hero_title_ar: 'منتجات مميزة بأسعار تناسبك',
        hero_title_en: 'Featured picks at fair prices',
        hero_subtitle_ar: '',
        hero_subtitle_en: '',
        hero_image: '',
        logo_url: '',
        currency: 'SAR',
        show_featured: true,
        products_per_row: 3,
        layout_style: 'grid',
      });
    }
  }, [existingSettings, form]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const cleanData = { ...data };
      delete cleanData.id;
      delete cleanData.created_date;
      delete cleanData.updated_date;
      delete cleanData.created_by;
      if (existingSettings?.id) {
        return api.entities.StoreSettings.update(existingSettings.id, cleanData);
      }
      return api.entities.StoreSettings.create(cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success(t('save'));
    },
  });

  if (!form) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-2xl md:text-3xl font-bold ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {t('storeSettings')}
        </h1>
        <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl gap-2">
          <Save className="w-4 h-4" />
          {t('save')}
        </Button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Store Name */}
        <Card>
          <CardHeader><CardTitle className={isRTL ? 'font-arabic' : 'font-english'}>{t('storeName')}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-arabic">{t('storeName')} (عربي)</Label>
              <Input value={form.store_name_ar || ''} onChange={(e) => setForm({ ...form, store_name_ar: e.target.value })} className="font-arabic mt-1" dir="rtl" />
            </div>
            <div>
              <Label className="font-english">{t('storeName')} (English)</Label>
              <Input value={form.store_name_en || ''} onChange={(e) => setForm({ ...form, store_name_en: e.target.value })} className="font-english mt-1" dir="ltr" />
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardHeader><CardTitle className={isRTL ? 'font-arabic' : 'font-english'}>{t('heroTitle')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-arabic">{t('heroTitle')} (عربي)</Label>
                <Input value={form.hero_title_ar || ''} onChange={(e) => setForm({ ...form, hero_title_ar: e.target.value })} className="font-arabic mt-1" dir="rtl" />
              </div>
              <div>
                <Label className="font-english">{t('heroTitle')} (English)</Label>
                <Input value={form.hero_title_en || ''} onChange={(e) => setForm({ ...form, hero_title_en: e.target.value })} className="font-english mt-1" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-arabic">{t('heroSubtitle')} (عربي)</Label>
                <Input value={form.hero_subtitle_ar || ''} onChange={(e) => setForm({ ...form, hero_subtitle_ar: e.target.value })} className="font-arabic mt-1" dir="rtl" />
              </div>
              <div>
                <Label className="font-english">{t('heroSubtitle')} (English)</Label>
                <Input value={form.hero_subtitle_en || ''} onChange={(e) => setForm({ ...form, hero_subtitle_en: e.target.value })} className="font-english mt-1" dir="ltr" />
              </div>
            </div>
            <div>
              <Label className="mb-2 block">{t('image')}</Label>
              <ImageUploader images={form.hero_image ? [form.hero_image] : []} onChange={(imgs) => setForm({ ...form, hero_image: imgs[0] || '' })} />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader><CardTitle className={isRTL ? 'font-arabic' : 'font-english'}>{t('layoutStyle')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('productsPerRow')}</Label>
                <Select value={String(form.products_per_row || 3)} onValueChange={(v) => setForm({ ...form, products_per_row: Number(v) })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t('layoutStyle')}</Label>
                <Select value={form.layout_style || 'grid'} onValueChange={(v) => setForm({ ...form, layout_style: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">{t('grid')}</SelectItem>
                    <SelectItem value="masonry">{t('masonry')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.show_featured} onCheckedChange={(v) => setForm({ ...form, show_featured: v })} />
              <Label>{t('showFeatured')}</Label>
            </div>
          </CardContent>
        </Card>

        {/* Security / Auth (OTP, forgot-email copy) */}
        <SecurityCard />
      </div>
    </div>
  );
}