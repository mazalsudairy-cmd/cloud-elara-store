import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { ensureAuthBootstrap } from '@/api/bootstrapAuth';

export default function CustomerLogin() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [params] = useSearchParams();
  const ret = params.get('return');

  const { data: authCfg } = useQuery({
    queryKey: ['authConfig-public'],
    queryFn: () => api.auth.getAuthConfig(),
    staleTime: 30_000,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const safeRet = () => {
    if (!ret) return '/';
    try {
      const u = new URL(ret, window.location.origin);
      if (u.origin === window.location.origin) return `${u.pathname}${u.search}${u.hash}` || '/';
    } catch {
      /* ignore */
    }
    return '/';
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await ensureAuthBootstrap();
      await api.auth.loginWithEmailPassword(email.trim(), password);
      const u = await api.auth.me();
      if (!u) throw new Error('no_user');
      if (u.role === 'admin') {
        toast.info(isRTL ? 'استخدم مسار الإدارة' : 'Please use admin sign-in route');
      }
      await checkUserAuth();
      toast.success(isRTL ? 'تم الدخول' : 'Welcome back');
      navigate(safeRet(), { replace: true });
    } catch {
      toast.error(isRTL ? 'بيانات غير صحيحة' : 'Invalid credentials');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-navy stars-bg px-4 py-12">
      <div className="mx-auto mb-8 text-center font-display text-[10px] tracking-[0.35em] text-gold/50">
        <Link to="/" className="hover:text-gold">
          Cloud Elara
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gold/15 bg-navy-mid p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="rounded-full bg-gold/10 p-3 text-gold">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className={`text-xl font-semibold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {isRTL ? 'تسجيل الدخول' : 'Sign in'}
          </h1>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'البريد' : 'Email'}</Label>
            <Input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
              className="mt-1 border-white/10 bg-white/5 font-english"
              required
            />
          </div>
          <div>
            <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'كلمة المرور' : 'Password'}</Label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="mt-1 border-white/10 bg-white/5 font-english"
              required
            />
          </div>
          {authCfg?.otp_recovery_enabled && (
            <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[11px] ${isRTL ? 'font-arabic justify-between' : 'font-english'}`}>
              <Link className="text-gold/60 hover:text-gold" to={`/forgot-password${ret ? `?return=${encodeURIComponent(ret)}` : ''}`}>
                {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </Link>
              <Link className="text-gold/50 hover:text-gold/80" to={`/account-help${ret ? `?return=${encodeURIComponent(ret)}` : ''}`}>
                {isRTL ? 'نسيت البريد؟' : 'Forgot email?'}
              </Link>
            </div>
          )}
          <Button disabled={busy} type="submit" className="w-full bg-gold font-bold text-navy hover:bg-gold-light">
            {busy ? '…' : isRTL ? 'دخول' : 'Sign in'}
          </Button>
        </form>
        <p className={`mt-6 text-center text-xs text-foreground/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {isRTL ? 'ليس لديك حساب؟ ' : 'No account? '}
          <Link className="text-gold hover:underline" to={`/register${ret ? `?return=${encodeURIComponent(ret)}` : ''}`}>
            {isRTL ? 'إنشاء حساب' : 'Register'}
          </Link>
        </p>
      </div>
    </div>
  );
}
