import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Save, ShieldCheck, Mail, KeyRound, Loader2, CheckCircle2, XCircle, Info, Send,
} from 'lucide-react';
import { testAuthProvider } from '@/lib/integrations/authClient';
import { sendTestEmail } from '@/lib/integrations/emailClient';

/* ------------------------------------------------------------------ */
/* Field metadata                                                     */
/* ------------------------------------------------------------------ */

const AUTH_PROVIDERS = [
  { value: 'local', labelAr: 'محلي مدمج (افتراضي)', labelEn: 'Built-in local (default)' },
  { value: 'supabase', labelAr: 'Supabase Auth', labelEn: 'Supabase Auth' },
  { value: 'firebase', labelAr: 'Firebase Authentication', labelEn: 'Firebase Authentication' },
  { value: 'clerk', labelAr: 'Clerk', labelEn: 'Clerk' },
  { value: 'auth0', labelAr: 'Auth0', labelEn: 'Auth0' },
  { value: 'appwrite', labelAr: 'Appwrite', labelEn: 'Appwrite' },
];

const AUTH_FIELDS = {
  firebase: [
    { key: 'firebase_api_key', label: 'API Key', placeholder: 'AIza...' },
    { key: 'firebase_auth_domain', label: 'Auth Domain', placeholder: 'your-app.firebaseapp.com' },
    { key: 'firebase_project_id', label: 'Project ID', placeholder: 'your-app' },
    { key: 'firebase_app_id', label: 'App ID', placeholder: '1:1234567890:web:abc...' },
    { key: 'firebase_messaging_sender_id', label: 'Messaging Sender ID', placeholder: '1234567890', optional: true },
  ],
  supabase: [
    { key: 'supabase_url', label: 'Project URL', placeholder: 'https://xxxx.supabase.co' },
    { key: 'supabase_anon_key', label: 'Anon (public) Key', placeholder: 'eyJhbGciOi...' },
  ],
  clerk: [
    { key: 'clerk_publishable_key', label: 'Publishable Key', placeholder: 'pk_live_... / pk_test_...' },
  ],
  auth0: [
    { key: 'auth0_domain', label: 'Domain', placeholder: 'your-tenant.us.auth0.com' },
    { key: 'auth0_client_id', label: 'Client ID (SPA)', placeholder: 'xxxxxxxxxxxxxxxx' },
    { key: 'auth0_audience', label: 'API Audience', placeholder: 'https://your-api', optional: true },
  ],
  appwrite: [
    { key: 'appwrite_endpoint', label: 'API Endpoint', placeholder: 'https://cloud.appwrite.io/v1' },
    { key: 'appwrite_project_id', label: 'Project ID', placeholder: 'your-project-id' },
  ],
};

const AUTH_HELP = {
  firebase: {
    ar: 'من Firebase Console ← إعدادات المشروع ← تطبيقات الويب ← firebaseConfig. كل القيم عامة وآمنة للعميل. فعّل طريقة «البريد/كلمة المرور» في Authentication.',
    en: 'Firebase Console → Project settings → Web app → firebaseConfig. All values are public/client-safe. Enable Email/Password in Authentication.',
  },
  supabase: {
    ar: 'من Supabase ← Project Settings ← API: انسخ Project URL ومفتاح anon public. التحقق بالبريد يُرسله Supabase تلقائياً.',
    en: 'Supabase → Project Settings → API: copy the Project URL and anon public key. Supabase sends verification emails automatically.',
  },
  clerk: {
    ar: 'من Clerk Dashboard ← API Keys: انسخ Publishable Key. واجهات التسجيل/الدخول والتحقق جاهزة داخل Clerk.',
    en: 'Clerk Dashboard → API Keys: copy the Publishable Key. Sign-up/in + verification UI is hosted by Clerk.',
  },
  auth0: {
    ar: 'من Auth0 ← Applications ← تطبيق SPA: انسخ Domain و Client ID. يستخدم Universal Login المستضاف. أضف origin الموقع في Allowed Callback/Logout/Web Origins.',
    en: 'Auth0 → Applications → SPA app: copy Domain and Client ID. Uses hosted Universal Login. Add your site origin to Allowed Callback/Logout/Web Origins.',
  },
  appwrite: {
    ar: 'من Appwrite Console ← Settings: انسخ API Endpoint و Project ID. أضف نطاق موقعك كـ Web Platform. التحقق عبر createVerification.',
    en: 'Appwrite Console → Settings: copy API Endpoint and Project ID. Add your site as a Web Platform. Verification via createVerification.',
  },
};

const EMAIL_ENV_HELP = {
  resend: { keys: 'RESEND_API_KEY', dash: 'resend.com → API Keys' },
  sendgrid: { keys: 'SENDGRID_API_KEY', dash: 'app.sendgrid.com → Settings → API Keys' },
  mailgun: { keys: 'MAILGUN_API_KEY + MAILGUN_DOMAIN', dash: 'app.mailgun.com → Sending → Domain settings' },
};

/* ------------------------------------------------------------------ */
/* Defaults                                                           */
/* ------------------------------------------------------------------ */

function defaultAuthForm() {
  return {
    auth_enabled: false,
    auth_provider: 'local',
    require_email_verification: true,
    firebase_api_key: '', firebase_auth_domain: '', firebase_project_id: '',
    firebase_app_id: '', firebase_messaging_sender_id: '',
    supabase_url: '', supabase_anon_key: '',
    clerk_publishable_key: '',
    auth0_domain: '', auth0_client_id: '', auth0_audience: '',
    appwrite_endpoint: 'https://cloud.appwrite.io/v1', appwrite_project_id: '',
  };
}

function defaultEmailForm() {
  return {
    email_enabled: false,
    email_provider: 'resend',
    from_email: '',
    from_name: 'Cloud Elara',
    reply_to: '',
    order_notification_email: '',
    send_order_confirmation: true,
  };
}

function stripMeta(data) {
  const clean = { ...data };
  delete clean.id;
  delete clean.created_date;
  delete clean.updated_date;
  delete clean.created_by;
  return clean;
}

/* ------------------------------------------------------------------ */
/* Small UI helpers                                                   */
/* ------------------------------------------------------------------ */

const Field = ({ label, optional, isRTL, children, help }) => (
  <div>
    <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>
      {label}
      {optional && <span className="ms-1 text-muted-foreground">({isRTL ? 'اختياري' : 'optional'})</span>}
    </Label>
    {children}
    {help && (
      <p className={`mt-1 text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>{help}</p>
    )}
  </div>
);

const ToggleLine = ({ label, hint, checked, onChange, isRTL }) => (
  <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2.5">
    <div className="pe-3">
      <p className={`text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>{label}</p>
      {hint && <p className={`text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>{hint}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const TestResult = ({ result, isRTL }) => {
  if (!result) return null;
  const ok = result.ok;
  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 text-xs ${ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-red-500/30 bg-red-500/10 text-red-200'}`}>
      {ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <XCircle className="h-4 w-4 shrink-0 text-red-400" />}
      <span className={isRTL ? 'font-arabic' : 'font-english'}>{result.message}</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminIntegrations() {
  const { isRTL } = useLanguage();
  const queryClient = useQueryClient();

  const { data: authList } = useQuery({
    queryKey: ['auth-settings'],
    queryFn: () => api.entities.AuthSettings.list(),
    initialData: [],
  });
  const { data: emailList } = useQuery({
    queryKey: ['email-settings'],
    queryFn: () => api.entities.EmailSettings.list(),
    initialData: [],
  });

  const existingAuth = authList?.[0];
  const existingEmail = emailList?.[0];

  const [authForm, setAuthForm] = useState(null);
  const [emailForm, setEmailForm] = useState(null);

  useEffect(() => {
    if (!authForm) setAuthForm(existingAuth ? { ...defaultAuthForm(), ...existingAuth } : defaultAuthForm());
  }, [existingAuth, authForm]);
  useEffect(() => {
    if (!emailForm) setEmailForm(existingEmail ? { ...defaultEmailForm(), ...existingEmail } : defaultEmailForm());
  }, [existingEmail, emailForm]);

  const saveAuth = useMutation({
    mutationFn: (data) => (existingAuth?.id
      ? api.entities.AuthSettings.update(existingAuth.id, stripMeta(data))
      : api.entities.AuthSettings.create(stripMeta(data))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-settings'] });
      toast.success(isRTL ? 'تم حفظ إعدادات المصادقة ✓' : 'Auth settings saved ✓');
    },
  });

  const saveEmail = useMutation({
    mutationFn: (data) => (existingEmail?.id
      ? api.entities.EmailSettings.update(existingEmail.id, stripMeta(data))
      : api.entities.EmailSettings.create(stripMeta(data))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-settings'] });
      toast.success(isRTL ? 'تم حفظ إعدادات البريد ✓' : 'Email settings saved ✓');
    },
  });

  const [authTest, setAuthTest] = useState(null);
  const [authTesting, setAuthTesting] = useState(false);
  const [emailTest, setEmailTest] = useState(null);
  const [emailTesting, setEmailTesting] = useState(false);
  const [testTo, setTestTo] = useState('');

  if (!authForm || !emailForm) return null;
  const setA = (k, v) => setAuthForm((f) => ({ ...f, [k]: v }));
  const setE = (k, v) => setEmailForm((f) => ({ ...f, [k]: v }));

  const runAuthTest = async () => {
    setAuthTesting(true);
    setAuthTest(null);
    try {
      const res = await testAuthProvider(authForm);
      setAuthTest(res);
    } catch (err) {
      setAuthTest({ ok: false, message: err?.message || String(err) });
    } finally {
      setAuthTesting(false);
    }
  };

  const runEmailTest = async () => {
    if (!testTo.trim()) {
      toast.error(isRTL ? 'أدخل بريداً للاختبار' : 'Enter a test recipient');
      return;
    }
    setEmailTesting(true);
    setEmailTest(null);
    try {
      // Save first so the serverless function reads the latest provider/sender.
      await saveEmail.mutateAsync(emailForm);
      const res = await sendTestEmail(testTo.trim());
      setEmailTest(
        res?.ok
          ? { ok: true, message: isRTL ? 'تم إرسال البريد التجريبي ✓' : 'Test email sent ✓' }
          : { ok: false, message: res?.reason === 'email_disabled' ? (isRTL ? 'فعّل البريد أولاً' : 'Enable email first') : (res?.reason || 'failed') },
      );
    } catch (err) {
      setEmailTest({ ok: false, message: err?.message || String(err) });
    } finally {
      setEmailTesting(false);
    }
  };

  const provider = authForm.auth_provider;
  const emailEnvHelp = EMAIL_ENV_HELP[emailForm.email_provider] || EMAIL_ENV_HELP.resend;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <h1 className={`text-2xl font-bold md:text-3xl ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {isRTL ? 'التكاملات' : 'Integrations'}
        </h1>
        <p className={`mt-1 text-sm text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {isRTL
            ? 'مزوّدات تسجيل الدخول والتحقق بالبريد + خدمات إرسال الإيميل'
            : 'Authentication providers + transactional email services'}
        </p>
      </div>

      <Tabs defaultValue="auth" className="max-w-3xl">
        <TabsList className="mb-4">
          <TabsTrigger value="auth" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            {isRTL ? 'المصادقة' : 'Authentication'}
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            {isRTL ? 'البريد' : 'Email'}
          </TabsTrigger>
        </TabsList>

        {/* ---------------- AUTH TAB ---------------- */}
        <TabsContent value="auth" className="space-y-4">
          <Card className={authForm.auth_enabled ? 'border-gold/40' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 ${authForm.auth_enabled ? 'bg-gold/20 text-gold' : 'bg-secondary text-muted-foreground'}`}>
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{isRTL ? 'مزوّد المصادقة' : 'Authentication provider'}</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {isRTL ? 'فعّل لاستخدام مزوّد خارجي بدل النظام المحلي' : 'Enable to use an external provider instead of the local system'}
                    </CardDescription>
                  </div>
                </div>
                <Switch checked={authForm.auth_enabled} onCheckedChange={(v) => setA('auth_enabled', v)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={isRTL ? 'المزوّد' : 'Provider'} isRTL={isRTL}>
                  <Select value={provider} onValueChange={(v) => { setA('auth_provider', v); setAuthTest(null); }}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AUTH_PROVIDERS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{isRTL ? p.labelAr : p.labelEn}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="flex items-end">
                  <ToggleLine
                    label={isRTL ? 'إلزام التحقق بالبريد' : 'Require email verification'}
                    checked={authForm.require_email_verification}
                    onChange={(v) => setA('require_email_verification', v)}
                    isRTL={isRTL}
                  />
                </div>
              </div>

              {provider === 'local' && (
                <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-secondary/40 p-3 text-xs">
                  <Info className="h-4 w-4 shrink-0 text-gold/70" />
                  <span className={isRTL ? 'font-arabic' : 'font-english'}>
                    {isRTL
                      ? 'النظام المحلي المدمج فعّال (تخزين بالمتصفح). اختر مزوّداً خارجياً لتفعيل التحقق الحقيقي بالبريد.'
                      : 'The built-in local system is active (browser storage). Pick an external provider for real email verification.'}
                  </span>
                </div>
              )}

              {AUTH_FIELDS[provider] && (
                <div className="space-y-3 rounded-xl border border-border/50 p-4">
                  <p className={`flex items-center gap-2 text-xs font-semibold text-foreground/70 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    <KeyRound className="h-3.5 w-3.5 text-gold/70" />
                    {isRTL ? 'مفاتيح المزوّد (عامة/آمنة للعميل)' : 'Provider keys (public/client-safe)'}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {AUTH_FIELDS[provider].map((f) => (
                      <Field key={f.key} label={f.label} optional={f.optional} isRTL={isRTL}>
                        <Input
                          value={authForm[f.key] || ''}
                          onChange={(e) => setA(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className="mt-1 font-english"
                          dir="ltr"
                          autoComplete="off"
                          spellCheck={false}
                        />
                      </Field>
                    ))}
                  </div>
                  {AUTH_HELP[provider] && (
                    <p className={`text-[11px] text-muted-foreground ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {isRTL ? AUTH_HELP[provider].ar : AUTH_HELP[provider].en}
                    </p>
                  )}
                  <TestResult result={authTest} isRTL={isRTL} />
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={runAuthTest} disabled={authTesting} className="gap-2">
                      {authTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      {isRTL ? 'اختبار الاتصال' : 'Test connection'}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-[11px] text-amber-100/90">
                <Info className="h-4 w-4 shrink-0 text-amber-400" />
                <span className={isRTL ? 'font-arabic' : 'font-english'}>
                  {isRTL
                    ? 'الإعدادات والمفاتيح تُحفظ هنا، وطبقة الربط (adapter) جاهزة. ربط شاشات الدخول/التسجيل بالمزوّد المختار هو خطوة التفعيل النهائية.'
                    : 'Settings and keys are saved here and the adapter layer is ready. Wiring the login/register screens to the selected provider is the final activation step.'}
                </span>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveAuth.mutate(authForm)} disabled={saveAuth.isPending} className="gap-2 rounded-xl bg-gold font-bold text-navy hover:bg-gold-light">
                  <Save className="h-4 w-4" />
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- EMAIL TAB ---------------- */}
        <TabsContent value="email" className="space-y-4">
          <Card className={emailForm.email_enabled ? 'border-gold/40' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 ${emailForm.email_enabled ? 'bg-gold/20 text-gold' : 'bg-secondary text-muted-foreground'}`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{isRTL ? 'إرسال الإيميلات' : 'Transactional email'}</CardTitle>
                    <CardDescription className="mt-0.5 text-xs">
                      {isRTL ? 'تفعيل · تأكيد الطلب · فواتير عبر دالة /api/send-email' : 'Activation · order confirmations · invoices via /api/send-email'}
                    </CardDescription>
                  </div>
                </div>
                <Switch checked={emailForm.email_enabled} onCheckedChange={(v) => setE('email_enabled', v)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={isRTL ? 'المزوّد' : 'Provider'} isRTL={isRTL}>
                  <Select value={emailForm.email_provider} onValueChange={(v) => setE('email_provider', v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label={isRTL ? 'اسم المُرسِل' : 'From name'} isRTL={isRTL}>
                  <Input value={emailForm.from_name} onChange={(e) => setE('from_name', e.target.value)} className="mt-1" />
                </Field>
                <Field label={isRTL ? 'بريد المُرسِل (موثّق)' : 'From email (verified)'} isRTL={isRTL}>
                  <Input value={emailForm.from_email} onChange={(e) => setE('from_email', e.target.value)} placeholder="no-reply@yourdomain.com" className="mt-1 font-english" dir="ltr" />
                </Field>
                <Field label={isRTL ? 'بريد الرد (Reply-To)' : 'Reply-To'} optional isRTL={isRTL}>
                  <Input value={emailForm.reply_to} onChange={(e) => setE('reply_to', e.target.value)} placeholder="support@yourdomain.com" className="mt-1 font-english" dir="ltr" />
                </Field>
                <Field label={isRTL ? 'بريد إشعار الطلبات الجديدة' : 'New-order notification inbox'} isRTL={isRTL}>
                  <Input value={emailForm.order_notification_email} onChange={(e) => setE('order_notification_email', e.target.value)} placeholder="owner@yourdomain.com" className="mt-1 font-english" dir="ltr" />
                </Field>
                <div className="flex items-end">
                  <ToggleLine
                    label={isRTL ? 'تأكيد للعميل' : 'Customer confirmation'}
                    hint={isRTL ? 'إرسال تأكيد للعميل بعد الطلب' : 'Email the customer after checkout'}
                    checked={emailForm.send_order_confirmation}
                    onChange={(v) => setE('send_order_confirmation', v)}
                    isRTL={isRTL}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-[11px] text-amber-100/90">
                <KeyRound className="h-4 w-4 shrink-0 text-amber-400" />
                <span className={isRTL ? 'font-arabic' : 'font-english'}>
                  {isRTL
                    ? `المفتاح السري لا يُحفظ هنا. أضِفه في متغيّرات بيئة Vercel: ${emailEnvHelp.keys} (و EMAIL_FROM اختياري). المصدر: ${emailEnvHelp.dash}.`
                    : `The secret key is NOT stored here. Add it to Vercel env vars: ${emailEnvHelp.keys} (and optional EMAIL_FROM). From: ${emailEnvHelp.dash}.`}
                </span>
              </div>

              <div className="space-y-2 rounded-xl border border-border/50 p-4">
                <Label className={`text-xs ${isRTL ? 'font-arabic' : 'font-english'}`}>{isRTL ? 'إرسال بريد تجريبي إلى' : 'Send a test email to'}</Label>
                <div className="flex flex-wrap gap-2">
                  <Input value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@example.com" className="flex-1 font-english" dir="ltr" />
                  <Button variant="outline" onClick={runEmailTest} disabled={emailTesting} className="gap-2">
                    {emailTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {isRTL ? 'إرسال اختبار' : 'Send test'}
                  </Button>
                </div>
                <TestResult result={emailTest} isRTL={isRTL} />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveEmail.mutate(emailForm)} disabled={saveEmail.isPending} className="gap-2 rounded-xl bg-gold font-bold text-navy hover:bg-gold-light">
                  <Save className="h-4 w-4" />
                  {isRTL ? 'حفظ' : 'Save'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
