import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ArrowLeft } from 'lucide-react';
import { ensureAuthBootstrap } from '@/api/bootstrapAuth';

/** Shown when OTP recovery is on — storefront “forgot email” help from Settings → Security */
export default function AccountHelpPage() {
  const { isRTL } = useLanguage();
  const [params] = useSearchParams();
  const ret = params.get('return');

  const { data: authCfg } = useQuery({
    queryKey: ['authConfig-public'],
    queryFn: () => api.auth.getAuthConfig(),
    staleTime: 30_000,
  });

  React.useEffect(() => {
    if (!authCfg?.otp_recovery_enabled) ensureAuthBootstrap();
  }, [authCfg?.otp_recovery_enabled]);

  const loginHref =
    ret && ret.length ? `/login?return=${encodeURIComponent(ret)}` : '/login';

  const helpHtml = authCfg?.otp_recovery_enabled
    ? (isRTL ? (authCfg.forgot_email_help_ar || '').trim() : (authCfg.forgot_email_help_en || '').trim())
    : '';

  if (authCfg && !authCfg.otp_recovery_enabled) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-navy stars-bg px-4 py-20">
        <p className={`mb-6 max-w-md text-center text-sm text-foreground/50 ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {isRTL
            ? 'هذه الصفحة تظهر بعد تفعيل استرداد OTP من الإعدادات → الأمان.'
            : 'This page is shown after OTP recovery is enabled under Settings → Security.'}
        </p>
        <Link className="text-gold hover:underline text-sm" to={loginHref}>
          {isRTL ? 'تسجيل الدخول' : 'Sign in'}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy stars-bg px-4 py-12">
      <div className="mx-auto mb-4 w-full max-w-lg">
        <Link
          to={loginHref}
          className={`inline-flex items-center gap-1 text-xs text-gold/60 hover:text-gold ${isRTL ? 'font-arabic flex-row-reverse' : ''}`}
        >
          {!isRTL && <ArrowLeft className="h-3 w-3" />}
          {isRTL ? 'عودة لتسجيل الدخول' : 'Back to sign in'}
        </Link>
      </div>

      <div className="mx-auto w-full max-w-lg rounded-2xl border border-gold/15 bg-navy-mid p-8 shadow-xl">
        <h1 className={`mb-6 text-xl font-semibold ${isRTL ? 'font-arabic' : 'font-display'}`}>
          {isRTL ? 'مساعدة استعادة البريد' : 'Recover email — help'}
        </h1>
        {!helpHtml ? (
          <p className={`text-sm text-foreground/50 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {isRTL
              ? 'لم يتم ضبط نص المساعدة بعد. اطلب من المسؤول تحديثه من الإعدادات → الأمان.'
              : 'No help text configured yet. Ask an admin to set it under Settings → Security.'}
          </p>
        ) : (
          <div
            className={`whitespace-pre-wrap text-sm leading-relaxed text-foreground/80 ${isRTL ? 'font-arabic text-right' : 'font-english'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {helpHtml}
          </div>
        )}
      </div>
    </div>
  );
}
