import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ensureAuthBootstrap } from '@/api/bootstrapAuth';

export default function ForgotPasswordPage() {
  const { isRTL } = useLanguage();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ret = params.get('return');

  const { data: authCfg } = useQuery({
    queryKey: ['authConfig-public'],
    queryFn: () => api.auth.getAuthConfig(),
    staleTime: 30_000,
  });

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    if (!authCfg?.otp_recovery_enabled) ensureAuthBootstrap();
  }, [authCfg?.otp_recovery_enabled]);

  const sendCode = async (e) => {
    e.preventDefault();
    if (!authCfg?.otp_recovery_enabled) {
      toast.error(isRTL ? 'استرداد OTP غير مفعّل' : 'Recovery is disabled');
      return;
    }
    setBusy(true);
    try {
      await ensureAuthBootstrap();
      await api.auth.requestPasswordRecovery(email.trim());
      toast.success(isRTL ? 'إذا وُجد الحساب، أُرسِل رمز تحقّق' : 'If the email exists, a code was queued');
      setStep(2);
    } catch {
      toast.error(isRTL ? 'تعذّر الإرسال' : 'Request failed');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (e) => {
    e.preventDefault();
    if (!authCfg?.otp_recovery_enabled) return;
    if (password.length < 8) {
      toast.error(isRTL ? 'كلمة المرور 8+' : 'Min 8 characters');
      return;
    }
    setBusy(true);
    try {
      await ensureAuthBootstrap();
      await api.auth.completePasswordRecovery(email.trim(), code.trim(), password);
      toast.success(isRTL ? 'تم تحديث كلمة المرور' : 'Password updated');
      if (ret) {
        try {
          const u = new URL(ret, window.location.origin);
          if (u.origin === window.location.origin) navigate(`${u.pathname}${u.search}${u.hash}`, { replace: true });
          else navigate('/', { replace: true });
        } catch {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    } catch {
      toast.error(isRTL ? 'رمز أو بيانات غير صحيحة' : 'Invalid code or data');
    } finally {
      setBusy(false);
    }
  };

  if (authCfg && !authCfg.otp_recovery_enabled) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-navy stars-bg px-4 py-20">
        <p className={`mb-6 text-center text-sm text-foreground/50 ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {isRTL ? 'مساعد استعادة OTP غير مفعّلة. راجع لوحة الإدارة → الإعدادات → الأمان.' : 'OTP recovery is off. Ask an admin to enable it in Settings → Security.'}
        </p>
        <Link className="text-gold hover:underline text-sm font-english" to="/login">← Login</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy stars-bg px-4 py-12">
      <div className="mx-auto mb-4">
        <Link to="/login" className={`inline-flex items-center gap-1 text-xs text-gold/60 hover:text-gold ${isRTL ? 'font-arabic flex-row-reverse' : ''}`}>
          {!isRTL && <ArrowLeft className="h-3 w-3" />}
          {isRTL ? 'عودة لتسجيل الدخول' : 'Back to sign in'}
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gold/15 bg-navy-mid p-8 shadow-xl">
        <h1 className={`mb-6 text-xl font-semibold ${isRTL ? 'font-arabic' : 'font-display'}`}>
          {step === 1 ? (isRTL ? 'استعادة بالبريد' : 'Recover with email') : (isRTL ? 'رمز وبيانات جديدة' : 'Code & new password')}
        </h1>

        {step === 1 && (
          <form className="space-y-4" onSubmit={sendCode}>
            <div>
              <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'البريد' : 'Email'}</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" dir="ltr" required className="mt-1 font-english bg-white/5 border-white/10" />
            </div>
            {(import.meta.env.DEV || !import.meta.env.VITE_ORDER_NOTIFY_WEBHOOK) && (
              <p className="text-[11px] text-foreground/40">{isRTL ? 'الرمز يُطبع بالكونسول في التطوير.' : 'Code is logged to the console in development.'}</p>
            )}
            <Button type="submit" disabled={busy} className="w-full bg-gold text-navy font-bold">{busy ? '…' : isRTL ? 'إرسال الرمز' : 'Send code'}</Button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={confirm}>
            <div>
              <Label className="font-english">Email</Label>
              <Input value={email} readOnly className="mt-1 font-english bg-white/[0.03] border-white/10" dir="ltr" />
            </div>
            <div>
              <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'الرمز' : 'OTP code'}</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" maxLength={8} required className="mt-1 font-english bg-white/5 border-white/10" placeholder="------" />
            </div>
            <div>
              <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'كلمة مرور جديدة' : 'New password'}</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" required minLength={8} className="mt-1 font-english bg-white/5 border-white/10" />
            </div>
            <Button type="submit" disabled={busy} className="w-full bg-gold text-navy font-bold">{busy ? '…' : isRTL ? 'تحديث' : 'Update'}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
