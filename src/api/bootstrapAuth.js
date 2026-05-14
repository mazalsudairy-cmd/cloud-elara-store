/**
 * Seeds default AuthConfig + first admin user once.
 */
import { createEntityApi } from '@/api/localEntityStore';
import { hashPassword } from '@/lib/cryptoAuth';

const UserApi = () => createEntityApi('User');
const AuthConfigApi = () => createEntityApi('AuthConfig');

function normalizeBootstrapEmail(email) {
  return String(email || '').trim().toLowerCase();
}

let bootstrapPromise;

export function ensureAuthBootstrap() {
  bootstrapPromise ||= (async () => {
    const users = await UserApi().list();
    if (!users?.length) {
      const envPass = import.meta.env.VITE_ADMIN_PASSWORD?.trim();
      // When the user DB is empty: hash this unless VITE_ADMIN_PASSWORD is set (recommended on Vercel).
      const pass = envPass || 'Qpal.1122';
      const mail = normalizeBootstrapEmail(import.meta.env.VITE_ADMIN_EMAIL || 'admin@elara.local');
      const { salt_b64, hash_b64 } = await hashPassword(pass);
      await UserApi().create({
        email: mail,
        password_hash_b64: hash_b64,
        password_salt_b64: salt_b64,
        name: 'Administrator',
        phone: '',
        role: 'admin',
        status: 'active',
        email_verified: true,
      });
    }

    const cfg = await AuthConfigApi().list();
    if (!cfg?.length) {
      await AuthConfigApi().create({
        otp_recovery_enabled: false,
        forgot_email_help_ar:
          'إذا لم تتذكر البريد الذي سجّلت به، تواصل مع دعم المتجر أو مدير المنصّة.',
        forgot_email_help_en:
          'If you cannot remember which email you registered with, contact store support.',
      });
    }
  })();
  return bootstrapPromise;
}
