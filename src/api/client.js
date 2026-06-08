import { createEntityApi } from '@/api/localEntityStore';
import { authMethods } from '@/api/authService';
import { sendTransactionalEmail } from '@/lib/integrations/emailClient';

const entities = {
  Product: createEntityApi('Product'),
  Category: createEntityApi('Category'),
  Order: createEntityApi('Order'),
  StoreSettings: createEntityApi('StoreSettings'),
  PaymentSettings: createEntityApi('PaymentSettings'),
  User: createEntityApi('User'),
  AuthConfig: createEntityApi('AuthConfig'),
  PasswordResetToken: createEntityApi('PasswordResetToken'),
  AuthSettings: createEntityApi('AuthSettings'),
  EmailSettings: createEntityApi('EmailSettings'),
};

export const auth = {
  ...authMethods,
};

export const integrations = {
  Core: {
    async UploadFile({ file }) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ file_url: reader.result });
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    },

    async SendEmail(payload) {
      // Preferred path: transactional email via the /api/send-email serverless
      // function (Resend / SendGrid / Mailgun), configured under Admin → Integrations.
      try {
        const res = await sendTransactionalEmail({
          to: payload.to,
          subject: payload.subject,
          html: payload.body || payload.html,
          text: payload.text,
        });
        if (res?.ok) return res;
      } catch (err) {
        console.warn('[Elara] Email send via serverless failed, falling back:', err?.message || err);
      }

      // Legacy fallback: POST raw payload to a custom webhook if provided.
      const webhook = import.meta.env.VITE_ORDER_NOTIFY_WEBHOOK;
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
        return { ok: true, via: 'webhook' };
      }

      console.info('[Elara] Email not sent (enable Admin → Integrations → Email, or set VITE_ORDER_NOTIFY_WEBHOOK):', {
        to: payload.to,
        subject: payload.subject,
      });
      return { ok: true, localOnly: true };
    },
  },
};

export const api = {
  entities,
  auth,
  integrations,
};
