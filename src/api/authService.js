/**
 * SPA auth backed by localEntityStore — replace with HTTPS API later.
 */
import { createEntityApi } from '@/api/localEntityStore';
import { hashPassword, verifyPassword, randomDigits } from '@/lib/cryptoAuth';

const UserApi = () => createEntityApi('User');
const AuthConfigApi = () => createEntityApi('AuthConfig');
const ResetApi = () => createEntityApi('PasswordResetToken');

const SESSION_KEY = 'elara_user';

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function readSessionPayload() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSession(publicUser) {
  if (!publicUser) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      id: publicUser.id,
      email: publicUser.email,
      name: publicUser.name,
      phone: publicUser.phone,
      role: publicUser.role,
    }),
  );
}

function sanitizeUser(row) {
  if (!row) return null;
  const { password_hash_b64: _ph, password_salt_b64: _ps, ...rest } = row;
  return rest;
}

async function webhookNotify(payload) {
  const webhook = import.meta.env.VITE_ORDER_NOTIFY_WEBHOOK;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'elara-auth', ...payload }),
    });
  } catch {
    /* ignore */
  }
}

async function getActiveUserFromSession() {
  const payload = readSessionPayload();
  if (!payload?.id) return null;
  const rows = await UserApi().filter({ id: payload.id }, null, 1);
  const row = rows[0];
  if (!row || row.status !== 'active') return null;
  return sanitizeUser(row);
}

async function authenticateEmailPassword(emailNorm, plainPassword) {
  const rows = await UserApi().filter({ email: emailNorm }, null, 500);
  const row = rows[0];
  if (!row || row.status !== 'active') throw new Error('invalid_credentials');
  const ok = await verifyPassword(plainPassword, row.password_salt_b64, row.password_hash_b64);
  if (!ok) throw new Error('invalid_credentials');
  return sanitizeUser(row);
}

async function pruneExpiredTokens() {
  const all = await ResetApi().list();
  const now = Date.now();
  for (const t of all) {
    if (!t.used && t.expires_at && new Date(t.expires_at).getTime() < now) {
      try {
        await ResetApi().delete(t.id);
      } catch {
        /* ignore */
      }
    }
  }
}

export const authMethods = {
  async me() {
    return getActiveUserFromSession();
  },

  logout(redirectUrl) {
    writeSession(null);
    localStorage.removeItem('token');
    localStorage.removeItem('elara_access_token');
    if (redirectUrl) window.location.assign(redirectUrl);
  },

  redirectToLogin(returnUrl) {
    const base = import.meta.env.VITE_LOGIN_PATH || '/login';
    const url = new URL(base, window.location.origin);
    if (returnUrl) url.searchParams.set('return', returnUrl);
    window.location.assign(url.pathname + url.search);
  },

  async loginWithEmailPassword(email, plainPassword) {
    const pub = await authenticateEmailPassword(normalizeEmail(email), plainPassword);
    writeSession(pub);
    return pub;
  },

  async registerCustomer({ email, password, name, phone }) {
    const mail = normalizeEmail(email);
    const existing = await UserApi().filter({ email: mail }, null, 10);
    if (existing.length) throw new Error('email_taken');

    const { salt_b64, hash_b64 } = await hashPassword(password);
    const row = await UserApi().create({
      email: mail,
      password_hash_b64: hash_b64,
      password_salt_b64: salt_b64,
      name: name || '',
      phone: phone || '',
      role: 'customer',
      status: 'active',
      email_verified: false,
    });
    const pub = sanitizeUser(row);
    writeSession(pub);
    return pub;
  },

  async getAuthConfig() {
    const list = await AuthConfigApi().list('-updated_date', 1);
    if (!list?.length)
      return { otp_recovery_enabled: false, forgot_email_help_ar: '', forgot_email_help_en: '' };
    const c = list[0];
    return {
      id: c.id,
      otp_recovery_enabled: !!c.otp_recovery_enabled,
      forgot_email_help_ar: c.forgot_email_help_ar || '',
      forgot_email_help_en: c.forgot_email_help_en || '',
      updated_date: c.updated_date,
    };
  },

  async updateAuthConfig(updates) {
    const me = await getActiveUserFromSession();
    if (!me || me.role !== 'admin') throw new Error('forbidden');
    const list = await AuthConfigApi().list();
    const patch = {};
    if (typeof updates.otp_recovery_enabled === 'boolean')
      patch.otp_recovery_enabled = updates.otp_recovery_enabled;
    if (updates.forgot_email_help_ar != null)
      patch.forgot_email_help_ar = String(updates.forgot_email_help_ar);
    if (updates.forgot_email_help_en != null)
      patch.forgot_email_help_en = String(updates.forgot_email_help_en);
    let row;
    if (list?.length) row = await AuthConfigApi().update(list[0].id, patch);
    else row = await AuthConfigApi().create(patch);
    return row;
  },

  async requestPasswordRecovery(emailRaw) {
    const cfg = await authMethods.getAuthConfig();
    if (!cfg.otp_recovery_enabled) throw new Error('recovery_disabled');

    await pruneExpiredTokens();
    const email = normalizeEmail(emailRaw);
    const users = await UserApi().filter({ email }, null, 1);
    const user = users[0];
    if (!user || user.status !== 'active') return { ok: true, silent: true };

    const prev = await ResetApi().filter({ user_id: user.id, used: false }, '-created_date', 20);
    for (const t of prev)
      await ResetApi().delete(t.id).catch(() => {});

    const code = randomDigits(6);
    const ttlMin = Number(import.meta.env.VITE_OTP_TTL_MIN || 15) || 15;
    const expires = new Date(Date.now() + ttlMin * 60_000).toISOString();

    await ResetApi().create({
      email,
      user_id: user.id,
      code_plain: code,
      expires_at: expires,
      used: false,
    });

    await webhookNotify({
      event: 'password_reset_otp',
      to: email,
      code,
      expires_at: expires,
      subject_ar: `رمز إعادة تعيين كلمة المرور: ${code}`,
      subject_en: `Your password reset code: ${code}`,
    });

    if (import.meta.env.DEV || !import.meta.env.VITE_ORDER_NOTIFY_WEBHOOK) {
      console.info('[Elara Auth][DEV] reset OTP:', email, code);
    }
    return { ok: true };
  },

  async completePasswordRecovery(emailRaw, code, newPassword) {
    const cfg = await authMethods.getAuthConfig();
    if (!cfg.otp_recovery_enabled) throw new Error('recovery_disabled');
    await pruneExpiredTokens();

    const email = normalizeEmail(emailRaw);
    const tokens = await ResetApi().filter({ email, used: false }, '-created_date', 20);
    const now = Date.now();
    const match = tokens.find(
      (t) =>
        String(t.code_plain) === String(code).trim()
        && t.expires_at
        && new Date(t.expires_at).getTime() > now,
    );
    if (!match) throw new Error('invalid_code');

    const rows = await UserApi().filter({ id: match.user_id }, null, 1);
    const u = rows[0];
    if (!u) throw new Error('invalid_user');

    const { salt_b64, hash_b64 } = await hashPassword(newPassword);
    await UserApi().update(u.id, {
      password_hash_b64: hash_b64,
      password_salt_b64: salt_b64,
    });

    await ResetApi().update(match.id, { used: true });
    authMethods.logout();
    await authMethods.loginWithEmailPassword(email, newPassword);
    const fresh = await UserApi().filter({ id: u.id }, null, 1);
    return sanitizeUser(fresh[0]);
  },

  async adminSetPassword(targetUserId, newPlainPassword) {
    const me = await getActiveUserFromSession();
    if (!me || me.role !== 'admin') throw new Error('forbidden');

    const { salt_b64, hash_b64 } = await hashPassword(newPlainPassword);
    return UserApi().update(targetUserId, {
      password_hash_b64: hash_b64,
      password_salt_b64: salt_b64,
    });
  },

  async listUsers() {
    const me = await getActiveUserFromSession();
    if (!me || me.role !== 'admin') throw new Error('forbidden');
    const rows = await UserApi().list('-created_date', 500);
    return rows.map(sanitizeUser);
  },

  async adminUpdateUser(targetId, patch) {
    const me = await getActiveUserFromSession();
    if (!me || me.role !== 'admin') throw new Error('forbidden');
    const clean = {};
    if (patch.name !== undefined) clean.name = patch.name;
    if (patch.phone !== undefined) clean.phone = patch.phone;
    if (patch.email !== undefined) clean.email = normalizeEmail(patch.email);
    if (patch.role === 'admin' || patch.role === 'customer') clean.role = patch.role;
    if (patch.status === 'active' || patch.status === 'blocked') clean.status = patch.status;
    if (typeof patch.email_verified === 'boolean') clean.email_verified = patch.email_verified;
    return UserApi().update(targetId, clean).then((r) => sanitizeUser(r));
  },

  async adminDeleteUser(targetId) {
    const me = await getActiveUserFromSession();
    if (!me || me.role !== 'admin') throw new Error('forbidden');
    if (me.id === targetId) throw new Error('cant_delete_self');

    const targetRows = await UserApi().filter({ id: targetId }, null, 1);
    const target = targetRows[0];
    if (target?.role === 'admin') {
      const admins = await UserApi().filter({ role: 'admin', status: 'active' }, null, 999);
      if (admins.length <= 1) throw new Error('cant_delete_last_admin');
    }

    await UserApi().delete(targetId);
    return { ok: true };
  },
};
