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

    // Payment gateway aggregator (NOT Stripe): mada / Visa / Mastercard / Apple Pay / STC Pay
    gateway_enabled: {
      type: 'boolean',
      default: false,
    },
    gateway_provider: {
      type: 'string',
      enum: ['moyasar', 'tap', 'hyperpay', 'paytabs', 'checkout', 'stripe', 'custom'],
      default: 'moyasar',
      description: 'moyasar = embedded form; tap/hyperpay/paytabs/checkout/stripe = hosted payment link redirect; custom = HTML embed',
    },
    gateway_publishable_key: {
      type: 'string',
      description: 'Moyasar publishable key (pk_live_... / pk_test_...)',
    },
    gateway_payment_url: {
      type: 'string',
      description: 'Hosted payment link / page URL for redirect-based providers (Tap, HyperPay, PayTabs, Checkout.com, Stripe Payment Link)',
    },
    gateway_method_card: {
      type: 'boolean',
      default: true,
    },
    gateway_method_applepay: {
      type: 'boolean',
      default: true,
    },
    gateway_method_stcpay: {
      type: 'boolean',
      default: false,
    },
    gateway_embed_html: {
      type: 'string',
      description: 'Custom provider hosted form/button HTML (script tags stripped at render)',
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
