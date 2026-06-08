import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, CreditCard, Globe, Wallet } from 'lucide-react';

const PaymentMethodCard = ({ icon: IconComp, title, description, enabled, onToggle, children }) => (
  <Card className={`transition-all duration-300 ${enabled ? 'border-gold/40 shadow-lg shadow-gold/5' : 'border-border/50 opacity-60'}`}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${enabled ? 'bg-gold/20 text-gold' : 'bg-secondary text-muted-foreground'}`}>
            <IconComp className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-0.5 text-xs">{description}</CardDescription>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
    </CardHeader>
    {enabled && children && (
      <CardContent className="space-y-3 pt-0">
        <div className="border-t border-border/50 pt-4">{children}</div>
      </CardContent>
    )}
  </Card>
);

/** Redirect/link-based providers (no backend needed): admin pastes a hosted payment link. */
const LINK_PROVIDERS = {
  tap: { name: 'Tap Payments', help_ar: 'من لوحة Tap: أنشئ Payment Link والصق الرابط هنا.', help_en: 'In Tap: create a Payment Link and paste the URL here.' },
  hyperpay: { name: 'HyperPay', help_ar: 'من HyperPay: أنشئ صفحة/رابط دفع مستضاف والصقه هنا.', help_en: 'In HyperPay: create a hosted payment page/link and paste it here.' },
  paytabs: { name: 'PayTabs', help_ar: 'من PayTabs: أنشئ Payment Link والصق الرابط هنا.', help_en: 'In PayTabs: create a Payment Link and paste it here.' },
  checkout: { name: 'Checkout.com', help_ar: 'من Checkout.com: أنشئ Payment Link والصق الرابط هنا.', help_en: 'In Checkout.com: create a Payment Link and paste it here.' },
  stripe: { name: 'Stripe', help_ar: 'من Stripe: Payment Links → أنشئ رابطاً والصقه هنا (يدعم Apple Pay والبطاقات).', help_en: 'In Stripe: Payment Links → create a link and paste it here (supports Apple Pay & cards).' },
};

const ToggleLine = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
    <span className="text-xs text-foreground/80">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

function defaultPaymentForm() {
  return {
    paypal_enabled: true,
    paypal_email: '',
    paypal_client_id: '',
    paypal_button_html: '',
    applepay_enabled: false,
    gateway_enabled: false,
    gateway_provider: 'moyasar',
    gateway_publishable_key: '',
    gateway_payment_url: '',
    gateway_method_card: true,
    gateway_method_applepay: true,
    gateway_method_stcpay: false,
    gateway_embed_html: '',
    bank_transfer_enabled: false,
    bank_name: '',
    bank_iban: '',
    bank_account_name: '',
    stc_pay_enabled: false,
    stc_pay_number: '',
    checkout_notes_ar: '',
    checkout_notes_en: '',
    min_order_amount: 0,
    currency: 'SAR',
  };
}

function mergePaymentForm(existing) {
  return { ...defaultPaymentForm(), ...existing, bank_transfer_enabled: false, stc_pay_enabled: false };
}

export default function AdminPayment() {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();

  const { data: list } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: () => api.entities.PaymentSettings.list(),
    initialData: [],
  });

  const existing = list?.[0];
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (existing && !form) {
      setForm(mergePaymentForm(existing));
    } else if (!existing && !form) {
      setForm(defaultPaymentForm());
    }
  }, [existing, form]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const clean = { ...data };
      delete clean.id;
      delete clean.created_date;
      delete clean.updated_date;
      delete clean.created_by;
      clean.bank_transfer_enabled = false;
      clean.stc_pay_enabled = false;
      return existing?.id ? api.entities.PaymentSettings.update(existing.id, clean) : api.entities.PaymentSettings.create(clean);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-settings'] });
      toast.success(isRTL ? 'تم الحفظ بنجاح ✓' : 'Saved successfully ✓');
    },
  });

  if (!form) return null;
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold md:text-3xl ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {isRTL ? 'إعدادات الدفع' : 'Payment Settings'}
          </h1>
          <p className={`mt-1 text-sm text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {isRTL ? 'بوابة دفع (مدى/فيزا/Apple Pay/STC Pay) + PayPal' : 'Payment gateway (mada/Visa/Apple Pay/STC Pay) + PayPal'}
          </p>
        </div>
        <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="gap-2 rounded-xl bg-gold font-bold text-navy hover:bg-gold-light">
          <Save className="h-4 w-4" />
          {t('save')}
        </Button>
      </div>

      <div className="max-w-3xl space-y-4">
        <PaymentMethodCard
          icon={Wallet}
          title={isRTL ? 'بوابة دفع إلكترونية (وسيط)' : 'Payment gateway (aggregator)'}
          description={isRTL ? 'مدى · فيزا · ماستركارد · Apple Pay · STC Pay عبر وسيط واحد' : 'mada · Visa · Mastercard · Apple Pay · STC Pay via one aggregator'}
          enabled={form.gateway_enabled}
          onToggle={(v) => set('gateway_enabled', v)}
        >
          <div className="space-y-4">
            <div>
              <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>{isRTL ? 'مزوّد الخدمة' : 'Provider'}</Label>
              <Select value={form.gateway_provider || 'moyasar'} onValueChange={(v) => set('gateway_provider', v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="moyasar">Moyasar — ميسر ({isRTL ? 'نموذج مدمج' : 'embedded'})</SelectItem>
                  <SelectItem value="tap">Tap Payments</SelectItem>
                  <SelectItem value="hyperpay">HyperPay</SelectItem>
                  <SelectItem value="paytabs">PayTabs</SelectItem>
                  <SelectItem value="checkout">Checkout.com</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="custom">{isRTL ? 'وسيط مخصّص (كود HTML)' : 'Custom (HTML embed)'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.gateway_provider === 'moyasar' && (
              <>
                <div>
                  <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>{isRTL ? 'مفتاح النشر (Publishable key)' : 'Publishable key'}</Label>
                  <Input
                    value={form.gateway_publishable_key}
                    onChange={(e) => set('gateway_publishable_key', e.target.value)}
                    placeholder="pk_live_xxxxxxxxxxxxxxxxxxxx"
                    className="mt-1 font-english"
                    dir="ltr"
                    autoComplete="off"
                  />
                  <p className={`mt-1 text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {isRTL
                      ? 'من لوحة Moyasar ← الإعدادات ← مفاتيح API. استخدم مفتاح النشر فقط (pk_)، لا تضع المفتاح السري هنا.'
                      : 'From Moyasar dashboard → Settings → API keys. Use the publishable key (pk_) only — never the secret key.'}
                  </p>
                </div>
                <div>
                  <Label className={`mb-2 block text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>{isRTL ? 'طرق الدفع المعروضة' : 'Methods shown'}</Label>
                  <div className="space-y-2">
                    <ToggleLine label={isRTL ? 'بطاقات (مدى/فيزا/ماستركارد)' : 'Cards (mada/Visa/Mastercard)'} checked={form.gateway_method_card !== false} onChange={(v) => set('gateway_method_card', v)} />
                    <ToggleLine label="Apple Pay" checked={form.gateway_method_applepay !== false} onChange={(v) => set('gateway_method_applepay', v)} />
                    <ToggleLine label="STC Pay" checked={!!form.gateway_method_stcpay} onChange={(v) => set('gateway_method_stcpay', v)} />
                  </div>
                  <p className={`mt-2 text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {isRTL
                      ? 'Apple Pay يتطلب تفعيل النطاق في لوحة Moyasar وجهازاً متوافقاً (Safari/iOS).'
                      : 'Apple Pay requires domain activation in Moyasar and a compatible device (Safari/iOS).'}
                  </p>
                </div>
              </>
            )}

            {LINK_PROVIDERS[form.gateway_provider] && (
              <div>
                <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {isRTL ? `رابط الدفع المستضاف (${LINK_PROVIDERS[form.gateway_provider].name})` : `Hosted payment link (${LINK_PROVIDERS[form.gateway_provider].name})`}
                </Label>
                <Input
                  value={form.gateway_payment_url}
                  onChange={(e) => set('gateway_payment_url', e.target.value)}
                  placeholder="https://..."
                  className="mt-1 font-english"
                  dir="ltr"
                  autoComplete="off"
                />
                <p className={`mt-1 text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {isRTL ? LINK_PROVIDERS[form.gateway_provider].help_ar : LINK_PROVIDERS[form.gateway_provider].help_en}
                </p>
                <p className={`mt-1 text-[11px] text-amber-500/80 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {isRTL
                    ? 'ملاحظة: روابط الدفع غالباً بمبلغ ثابت. للمبالغ المتغيّرة حسب السلة يلزم باكند بسيط لإنشاء الجلسة.'
                    : 'Note: payment links are usually fixed-amount. Dynamic cart totals need a small backend to create the session.'}
                </p>
              </div>
            )}

            {form.gateway_provider === 'custom' && (
              <div>
                <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>{isRTL ? 'كود نموذج الدفع من الوسيط (HTML)' : 'Aggregator hosted form HTML'}</Label>
                <Textarea
                  value={form.gateway_embed_html}
                  onChange={(e) => set('gateway_embed_html', e.target.value)}
                  placeholder={'<!-- Paste the hosted checkout / payment button HTML from your provider -->'}
                  rows={8}
                  className="mt-1 min-h-[140px] font-mono text-xs leading-relaxed"
                  dir="ltr"
                  spellCheck={false}
                />
                <p className={`mt-1 text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {isRTL ? 'تُزال وسوم script تلقائياً للأمان؛ استخدم نماذج الدفع المستضافة (redirect/iframe).' : 'Script tags are stripped for safety; use hosted (redirect/iframe) forms.'}
                </p>
              </div>
            )}
          </div>
        </PaymentMethodCard>

        <PaymentMethodCard
          icon={Globe}
          title="PayPal"
          description={isRTL ? 'أزرار PayPal الذكية أو كود الأزرار من لوحة PayPal' : 'PayPal Smart Buttons or hosted button HTML from PayPal'}
          enabled={form.paypal_enabled}
          onToggle={(v) => set('paypal_enabled', v)}
        >
          <div className="space-y-4">
            <div>
              <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL ? 'معرّف العميل (Client ID) — لأزرار PayPal الذكية' : 'Client ID — for PayPal Smart Buttons'}
              </Label>
              <Input
                value={form.paypal_client_id}
                onChange={(e) => set('paypal_client_id', e.target.value)}
                placeholder="AXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="mt-1 font-english"
                dir="ltr"
                autoComplete="off"
              />
              <p className={`mt-1 text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL
                  ? 'من developer.paypal.com → تطبيقاتك → Client ID. يُستخدم إذا تركت حقل «كود الأزرار» فارغاً.'
                  : 'From developer.paypal.com → Apps & credentials. Used when the button HTML field below is empty.'}
              </p>
            </div>
            <div>
              <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL ? 'كود أزرار / نموذج الدفع من PayPal (HTML)' : 'PayPal button / checkout HTML'}
              </Label>
              <Textarea
                value={form.paypal_button_html}
                onChange={(e) => set('paypal_button_html', e.target.value)}
                placeholder={'<!-- Paste from PayPal: Buttons → Email / Website -->\n<form action="https://www.paypal.com/cgi-bin/webscr" method="post">...</form>'}
                rows={12}
                className="mt-1 min-h-[200px] font-mono text-xs leading-relaxed"
                dir="ltr"
                spellCheck={false}
              />
              <p className={`mt-1 text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL
                  ? 'يُنظَّف تلقائياً من وسوم script. إن وُجد هنا نص، يُعرض للعميل بدلاً من أزرار الـ SDK. نماذج الدفع المستضافة من PayPal تعمل عادةً بدون سكربت.'
                  : 'Script tags are stripped for safety. If this field has content, it is shown to customers instead of the SDK buttons. Hosted PayPal forms usually work without scripts.'}
              </p>
            </div>
            <div>
              <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>{isRTL ? 'بريد التاجر (اختياري)' : 'Merchant email (optional)'}</Label>
              <Input value={form.paypal_email} onChange={(e) => set('paypal_email', e.target.value)} placeholder="you@business.com" className="mt-1 font-english" dir="ltr" />
            </div>
          </div>
        </PaymentMethodCard>

        <PaymentMethodCard
          icon={CreditCard}
          title="Apple Pay"
          description={isRTL ? 'إظهار خيار Apple Pay في صفحة الدفع' : 'Show Apple Pay as a checkout option'}
          enabled={form.applepay_enabled}
          onToggle={(v) => set('applepay_enabled', v)}
        >
          <p className={`text-xs text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {isRTL
              ? 'يتطلب جهازاً ومتصفحاً يدعمان Apple Pay، وإعداد Merchant ID عند ربط بوابة دفع حقيقية.'
              : 'Requires a compatible device and browser, plus a Merchant ID when you connect a live payment gateway.'}
          </p>
        </PaymentMethodCard>

        <Card>
          <CardHeader>
            <CardTitle className={`text-base ${isRTL ? 'font-arabic' : 'font-english'}`}>
              {isRTL ? 'ملاحظات عند الدفع' : 'Checkout notes'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs font-arabic">ملاحظة عربية</Label>
              <Textarea value={form.checkout_notes_ar} onChange={(e) => set('checkout_notes_ar', e.target.value)} className="mt-1 font-arabic" dir="rtl" rows={3} />
            </div>
            <div>
              <Label className="font-english text-xs">English note</Label>
              <Textarea value={form.checkout_notes_en} onChange={(e) => set('checkout_notes_en', e.target.value)} className="mt-1 font-english" dir="ltr" rows={3} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
