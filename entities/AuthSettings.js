export default {
  name: 'AuthSettings',
  type: 'object',
  description:
    'Authentication provider configuration. Only public/client-safe keys are stored here. '
    + 'Secret keys (if any) must live in server env vars, never in this entity.',
  properties: {
    // Master switch: when off, the built-in local (localStorage) auth is used.
    auth_enabled: {
      type: 'boolean',
      default: false,
    },
    auth_provider: {
      type: 'string',
      enum: ['local', 'firebase', 'supabase', 'clerk', 'auth0', 'appwrite'],
      default: 'local',
      description: 'Active authentication provider.',
    },
    require_email_verification: {
      type: 'boolean',
      default: true,
      description: 'Block sign-in until the user verifies their email (provider permitting).',
    },

    // Firebase Authentication (web app config — all public/client-safe)
    firebase_api_key: { type: 'string' },
    firebase_auth_domain: { type: 'string' },
    firebase_project_id: { type: 'string' },
    firebase_app_id: { type: 'string' },
    firebase_messaging_sender_id: { type: 'string' },

    // Supabase Auth (URL + anon key are public/client-safe)
    supabase_url: { type: 'string' },
    supabase_anon_key: { type: 'string' },

    // Clerk (publishable key is public/client-safe)
    clerk_publishable_key: { type: 'string' },

    // Auth0 (domain + SPA client id are public/client-safe)
    auth0_domain: { type: 'string' },
    auth0_client_id: { type: 'string' },
    auth0_audience: { type: 'string' },

    // Appwrite (endpoint + project id are public/client-safe)
    appwrite_endpoint: { type: 'string' },
    appwrite_project_id: { type: 'string' },
  },
  required: [],
};
