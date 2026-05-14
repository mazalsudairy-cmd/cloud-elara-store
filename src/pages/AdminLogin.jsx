import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';

const ADMIN_USER_KEY = 'elara_user';

export default function AdminLogin() {
  const { isRTL } = useLanguage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const expected = import.meta.env.VITE_ADMIN_PASSWORD;
  const devFallback = import.meta.env.DEV && !expected ? 'admin' : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = expected ? password === expected : devFallback != null && password === devFallback;
    if (!ok) {
      setError(isRTL ? 'كلمة المرور غير صحيحة' : 'Invalid password');
      return;
    }
    localStorage.setItem(
      ADMIN_USER_KEY,
      JSON.stringify({
        role: 'admin',
        email: 'admin@local',
        name: 'Admin',
      }),
    );
    navigate(safeReturn, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy stars-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gold/15 bg-navy-mid p-8 shadow-xl">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 rounded-full bg-gold/10 text-gold">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className={`text-lg font-semibold text-foreground/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {isRTL ? 'دخول الإدارة' : 'Admin sign-in'}
          </h1>
          <p className="text-xs text-foreground/40 text-center font-english">
            {import.meta.env.VITE_ADMIN_PASSWORD
              ? isRTL
                ? 'أدخل كلمة المرور المعرّفة في VITE_ADMIN_PASSWORD'
                : 'Enter the password from VITE_ADMIN_PASSWORD'
              : isRTL
                ? 'وضع التطوير: جرّب كلمة المرور admin أو عرّف VITE_ADMIN_PASSWORD'
                : 'Dev mode: try password admin, or set VITE_ADMIN_PASSWORD'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder={isRTL ? 'كلمة المرور' : 'Password'}
            className="bg-white/5 border-white/10 font-english"
            dir="ltr"
          />
          {error && <p className="text-xs text-red-400 font-arabic text-center">{error}</p>}
          <Button type="submit" className="w-full bg-gold hover:bg-gold-light text-navy font-bold">
            {isRTL ? 'دخول' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
