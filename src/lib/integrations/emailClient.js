/**
 * Client helper for transactional email.
 *
 * Sends through the /api/send-email serverless function (Resend / SendGrid /
 * Mailgun). The SECRET provider key lives only in server env vars; this client
 * only forwards the message + non-secret sender preferences from EmailSettings.
 */
import { api } from '@/api/client';

const ENDPOINT = '/api/send-email';

export function normalizeEmailSettings(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  return {
    email_enabled: !!s.email_enabled,
    email_provider: s.email_provider || 'resend',
    from_email: (s.from_email || '').trim(),
    from_name: (s.from_name || 'Cloud Elara').trim(),
    reply_to: (s.reply_to || '').trim(),
    order_notification_email: (s.order_notification_email || '').trim(),
    send_order_confirmation: s.send_order_confirmation !== false,
  };
}

export async function getEmailSettings() {
  const list = await api.entities.EmailSettings.list('-updated_date', 1);
  return normalizeEmailSettings(list?.[0] || {});
}

/**
 * Sends an email via the serverless function. Returns { ok, ... }.
 * Throws on transport errors so callers can fall back.
 */
export async function sendTransactionalEmail({ to, subject, html, text, from, replyTo }) {
  const settings = await getEmailSettings();
  if (!settings.email_enabled) {
    return { ok: false, skipped: true, reason: 'email_disabled' };
  }
  if (!to) return { ok: false, skipped: true, reason: 'no_recipient' };

  const payload = {
    provider: settings.email_provider,
    to,
    subject: subject || '(no subject)',
    html: html || text || '',
    text: text || undefined,
    from: from || (settings.from_email
      ? `${settings.from_name} <${settings.from_email}>`
      : undefined),
    replyTo: replyTo || settings.reply_to || undefined,
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* ignore non-JSON */
  }
  if (!res.ok) {
    throw new Error(data?.error || `email_http_${res.status}`);
  }
  return { ok: true, ...data };
}

/** Sends a small test email; used by the admin "Send test email" button. */
export async function sendTestEmail(to) {
  return sendTransactionalEmail({
    to,
    subject: 'Cloud Elara — test email ✓',
    html: `
<div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
  <h2 style="color:#c9a84c;">Cloud Elara</h2>
  <p>This is a test email confirming your email integration works correctly.</p>
  <p style="color:#888; font-size:12px;">Sent from Admin → Integrations.</p>
</div>`,
  });
}
