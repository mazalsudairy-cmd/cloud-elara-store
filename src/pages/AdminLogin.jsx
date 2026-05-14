import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { ensureAuthBootstrap } from '@/api/bootstrapAuth';
import { useAuth } from '@/lib/AuthContext';

export default function AdminLogin() {
  const { checkUserAuth } = useAuth();
  const { isRTL } = useLanguage();
  const [email, setEmail] = useState(() =>
    (import.meta.env.VITE_ADMIN_EMAIL || 'admin@elara.local').trim(),
  );
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const returnRaw = params.get('return');

  const safeReturn = (() => {
    if (!returnRaw) return '/admin';
    try {
      const u = new URL(returnRaw, window.location.origin);
      if (u.origin === window.location.origin) {
        return `${u.pathname}${u.search}${u.hash}` || '/admin';
      }
    } catch {
      /* ignore */
    }
    return '/admin';
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await ensureAuthBootstrap();
      await api.auth.loginWithEmailPassword(email.trim(), password);
      const session = await api.auth.me();
      if (!session || session.role !== 'admin') {
        api.auth.logout();
        toast.error(isRTL ? 'ليست حساب مدير' : 'Not an admin account');
        return;
      }
      await checkUserAuth();
      toast.success(isRTL ? 'تم الدخول' : 'Signed in');
      navigate(safeReturn, { replace: true });
    } catch {
      toast.error(isRTL ? 'البريد أو كلمة المرور غير صحيحة' : 'Invalid email or password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 stars-bg">
      <div className="w-full max-w-sm rounded-2xl border border-gold/15 bg-navy-mid p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="rounded-full bg-gold/10 p-3 text-gold">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className={`text-lg font-semibold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {isRTL ? 'دخول الإدارة' : 'Admin sign-in'}
          </h1>
          <p className={`text-center text-xs leading-relaxed text-foreground/45 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {isRTL
              ? 'عند أول تشغيل يُنشأ مدير من البريد الافتراضي وكلمة المرور من VITE_ADMIN_PASSWORD؛ إن لم تُضبط في Vercel تُستخدم كلمة الافتراضية المعرّفة في الكود. يمكن تغيير البريد وكلمة المرور لاحقاً من مستخدمي الإدارة.'
              : 'On first run an admin is created from the default email. Set VITE_ADMIN_PASSWORD in Vercel (Settings → Environment Variables) to override the built-in bootstrap password. Change email or password later under Admin → Users.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="admin-email" className={isRTL ? 'font-arabic' : ''}>
              {isRTL ? 'البريد الإلكتروني' : 'Email'}
            </Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 border-white/10 bg-white/5 font-english"
              dir="ltr"
              required
            />
          </div>
          <div>
            <Label htmlFor="admin-pass" className={isRTL ? 'font-arabic' : ''}>
              {isRTL ? 'كلمة المرور' : 'Password'}
            </Label>
            <Input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 border-white/10 bg-white/5 font-english"
              dir="ltr"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-gold font-bold text-navy hover:bg-gold-light"
          >
            {busy ? '…' : isRTL ? 'دخول' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
