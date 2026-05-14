import { createEntityApi } from '@/api/localEntityStore';
import { authMethods } from '@/api/authService';

const entities = {
  Product: createEntityApi('Product'),
  Category: createEntityApi('Category'),
  Order: createEntityApi('Order'),
  StoreSettings: createEntityApi('StoreSettings'),
  PaymentSettings: createEntityApi('PaymentSettings'),
  User: createEntityApi('User'),
  AuthConfig: createEntityApi('AuthConfig'),
  PasswordResetToken: createEntityApi('PasswordResetToken'),
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
      const webhook = import.meta.env.VITE_ORDER_NOTIFY_WEBHOOK;
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {});
        return { ok: true };
      }
      console.info('[Elara] Email notification (set VITE_ORDER_NOTIFY_WEBHOOK to POST elsewhere):', {
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
