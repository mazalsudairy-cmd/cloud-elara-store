/**
 * Vercel Serverless Function: POST /api/send-email
 *
 * Sends a transactional email via Resend, SendGrid, or Mailgun.
 * SECRET keys are read ONLY from environment variables (never from the client):
 *
 *   EMAIL_PROVIDER     resend | sendgrid | mailgun   (optional; body.provider used as fallback)
 *   EMAIL_FROM         "Store Name <no-reply@yourdomain.com>" (optional default sender)
 *
 *   RESEND_API_KEY
 *   SENDGRID_API_KEY
 *   MAILGUN_API_KEY  +  MAILGUN_DOMAIN  [+ MAILGUN_API_BASE]
 *
 * Request body (JSON): { to, subject, html, text?, from?, replyTo?, provider? }
 *
 * Runs on Node 20 (global fetch available) — no extra dependencies needed.
 */

function parseAddress(input) {
  // "Name <email@x.com>" -> { name, email }; "email@x.com" -> { name: '', email }
  if (!input) return { name: '', email: '' };
  const m = String(input).match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/);
  if (m) return { name: m[1].replace(/^"|"$/g, ''), email: m[2] };
  return { name: '', email: String(input).trim() };
}

async function sendResend({ apiKey, from, to, subject, html, text, replyTo }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || undefined,
      text: text || undefined,
      reply_to: replyTo || undefined,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `resend_${res.status}`);
  return { id: data?.id };
}

async function sendSendgrid({ apiKey, from, to, subject, html, text, replyTo }) {
  const sender = parseAddress(from);
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: Array.isArray(to) ? to[0] : to }] }],
      from: { email: sender.email, name: sender.name || undefined },
      reply_to: replyTo ? { email: parseAddress(replyTo).email } : undefined,
      subject,
      content: [
        html
          ? { type: 'text/html', value: html }
          : { type: 'text/plain', value: text || ' ' },
      ],
    }),
  });
  if (!res.ok) {
    const data = await res.text().catch(() => '');
    throw new Error(`sendgrid_${res.status}: ${data}`);
  }
  return { id: res.headers.get('x-message-id') || null };
}

async function sendMailgun({ apiKey, domain, apiBase, from, to, subject, html, text, replyTo }) {
  const base = apiBase || 'https://api.mailgun.net';
  const form = new URLSearchParams();
  form.set('from', from);
  form.set('to', Array.isArray(to) ? to.join(',') : to);
  form.set('subject', subject);
  if (html) form.set('html', html);
  if (text) form.set('text', text);
  if (replyTo) form.set('h:Reply-To', replyTo);

  const res = await fetch(`${base}/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `mailgun_${res.status}`);
  return { id: data?.id };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const provider = (process.env.EMAIL_PROVIDER || body.provider || 'resend').toLowerCase();
  const from = body.from || process.env.EMAIL_FROM;
  const { to, subject, html, text, replyTo } = body;

  if (!to || !subject || (!html && !text)) {
    return res.status(400).json({ error: 'missing_fields: to, subject, and html|text are required' });
  }
  if (!from) {
    return res.status(500).json({ error: 'missing_from: set EMAIL_FROM env var or pass "from"' });
  }

  try {
    let result;
    if (provider === 'resend') {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'missing_env: RESEND_API_KEY' });
      result = await sendResend({ apiKey, from, to, subject, html, text, replyTo });
    } else if (provider === 'sendgrid') {
      const apiKey = process.env.SENDGRID_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'missing_env: SENDGRID_API_KEY' });
      result = await sendSendgrid({ apiKey, from, to, subject, html, text, replyTo });
    } else if (provider === 'mailgun') {
      const apiKey = process.env.MAILGUN_API_KEY;
      const domain = process.env.MAILGUN_DOMAIN;
      if (!apiKey || !domain) {
        return res.status(500).json({ error: 'missing_env: MAILGUN_API_KEY and MAILGUN_DOMAIN' });
      }
      result = await sendMailgun({
        apiKey,
        domain,
        apiBase: process.env.MAILGUN_API_BASE,
        from,
        to,
        subject,
        html,
        text,
        replyTo,
      });
    } else {
      return res.status(400).json({ error: `unknown_provider: ${provider}` });
    }

    return res.status(200).json({ ok: true, provider, ...result });
  } catch (err) {
    return res.status(502).json({ error: err?.message || 'send_failed', provider });
  }
}
