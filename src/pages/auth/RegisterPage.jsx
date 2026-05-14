import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { ensureAuthBootstrap } from '@/api/bootstrapAuth';

export default function RegisterPage() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [params] = useSearchParams();
  const ret = params.get('return');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
    if (password.length < 8) {
      toast.error(isRTL ? 'كلمة المرور 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }
    setBusy(true);
    try {
      await ensureAuthBootstrap();
      await api.auth.registerCustomer({
        email: email.trim(),
        password,
        name: name.trim(),
        phone: phone.trim(),
      });
      await checkUserAuth();
      toast.success(isRTL ? 'تم إنشاء الحساب' : 'Account created');
      navigate(safeRet(), { replace: true });
    } catch (err) {
      toast.error(err?.message === 'email_taken'
        ? (isRTL ? 'البريد مستخدم' : 'Email already registered')
        : (isRTL ? 'تعذّر الإنشاء' : 'Could not register'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-navy stars-bg px-4 py-12">
      <div className="mx-auto mb-8 text-center font-display text-[10px] tracking-[0.35em] text-gold/50">
        <Link to="/" className="hover:text-gold">Cloud Elara</Link>
      </div>
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gold/15 bg-navy-mid p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="rounded-full bg-gold/10 p-3 text-gold">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className={`text-xl font-semibold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {isRTL ? 'تسجيل جديد' : 'Create account'}
          </h1>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'الاسم' : 'Name'}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className={`mt-1 border-white/10 bg-white/5 ${isRTL ? 'font-arabic' : 'font-english'}`} />
          </div>
          <div>
            <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'البريد' : 'Email'}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" className="mt-1 border-white/10 bg-white/5 font-english" required />
          </div>
          <div>
            <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'الجوال' : 'Phone'}</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="mt-1 border-white/10 bg-white/5 font-english" placeholder="+966…" />
          </div>
          <div>
            <Label className={isRTL ? 'font-arabic' : ''}>{isRTL ? 'كلمة المرور (8+)' : 'Password (8+ chars)'}</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" className="mt-1 border-white/10 bg-white/5 font-english" required minLength={8} />
          </div>
          <Button disabled={busy} type="submit" className="w-full bg-gold font-bold text-navy hover:bg-gold-light">
            {busy ? '…' : isRTL ? 'تسجيل' : 'Register'}
          </Button>
        </form>
        <p className={`mt-6 text-center text-xs text-foreground/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
          <Link className="text-gold hover:underline" to={`/login${ret ? `?return=${encodeURIComponent(ret)}` : ''}`}>
            {isRTL ? 'لدي حساب' : 'I have an account'}
          </Link>
        </p>
      </div>
    </div>
  );
}
