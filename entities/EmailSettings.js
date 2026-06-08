export default {
  name: 'EmailSettings',
  type: 'object',
  description:
    'Transactional email configuration. SECRET API keys are NOT stored here — they must be '
    + 'set as server env vars (RESEND_API_KEY / SENDGRID_API_KEY / MAILGUN_API_KEY + MAILGUN_DOMAIN) '
    + 'and are read by the /api/send-email serverless function.',
  properties: {
    email_enabled: {
      type: 'boolean',
      default: false,
      description: 'Master switch for sending transactional emails via the serverless function.',
    },
    email_provider: {
      type: 'string',
      enum: ['resend', 'sendgrid', 'mailgun'],
      default: 'resend',
      description: 'Provider used by /api/send-email. Must match the secret key set in env vars.',
    },
    from_email: {
      type: 'string',
      description: 'Verified sender address, e.g. "no-reply@yourdomain.com".',
    },
    from_name: {
      type: 'string',
      description: 'Display name shown to recipients.',
    },
    reply_to: {
      type: 'string',
      description: 'Optional Reply-To address.',
    },
    order_notification_email: {
      type: 'string',
      description: 'Where new-order alerts are sent (store owner inbox).',
    },
    send_order_confirmation: {
      type: 'boolean',
      default: true,
      description: 'Also email the customer a confirmation after checkout.',
    },
  },
  required: [],
};
