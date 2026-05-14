export default {
  name: 'PaymentSettings',
  type: 'object',
  properties: {
    paypal_enabled: {
      type: 'boolean',
      default: true,
    },
    paypal_email: {
      type: 'string',
    },
    paypal_client_id: {
      type: 'string',
      description: 'PayPal REST app Client ID for Smart Buttons',
    },
    paypal_button_html: {
      type: 'string',
      description: 'Hosted button / form HTML from PayPal (optional; strips script tags at render)',
    },
    applepay_enabled: {
      type: 'boolean',
      default: false,
    },
    checkout_notes_ar: {
      type: 'string',
    },
    checkout_notes_en: {
      type: 'string',
    },
    min_order_amount: {
      type: 'number',
      default: 0,
    },
    currency: {
      type: 'string',
      default: 'SAR',
    },
  },
  required: [],
};
