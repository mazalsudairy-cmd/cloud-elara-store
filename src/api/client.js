import { createEntityApi } from '@/api/localEntityStore';

const entities = {
  Product: createEntityApi('Product'),
  Category: createEntityApi('Category'),
  Order: createEntityApi('Order'),
  StoreSettings: createEntityApi('StoreSettings'),
  PaymentSettings: createEntityApi('PaymentSettings'),
};

const USER_KEY = 'elara_user';

async function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const auth = {
  async me() {
    return readUser();
  },

  logout(redirectUrl) {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('elara_access_token');
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    }
  },

  redirectToLogin(returnUrl) {
    const base = import.meta.env.VITE_LOGIN_PATH || '/admin/login';
    const url = new URL(base, window.location.origin);
    if (returnUrl) {
      url.searchParams.set('return', returnUrl);
    }
    window.location.assign(url.pathname + url.search);
  },
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
