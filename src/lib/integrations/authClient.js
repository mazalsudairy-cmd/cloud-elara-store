/**
 * Pluggable authentication adapter.
 *
 * Reads the active provider from the AuthSettings entity and lazily loads the
 * matching SDK from a CDN (via dynamic import) so nothing is bundled until a
 * provider is actually enabled. Every adapter exposes the same interface:
 *
 *   signUp({ email, password, name })  -> { user }
 *   signIn({ email, password })        -> { user }
 *   signInWithRedirect()               -> redirects (hosted login)
 *   signOut()                          -> void
 *   getCurrentUser()                   -> user | null
 *   sendEmailVerification()            -> void
 *
 * Public/client-safe keys only. Secret keys never belong on the client.
 *
 * NOTE: Wiring these adapters into AuthContext / the login pages is the final
 * "activation" step. Until then the app keeps using the built-in local auth,
 * but the admin can validate connectivity with testAuthProvider().
 */
import { api } from '@/api/client';

const CDN = {
  supabase: 'https://esm.sh/@supabase/supabase-js@2',
  firebaseApp: 'https://esm.sh/firebase@10/app',
  firebaseAuth: 'https://esm.sh/firebase@10/auth',
  appwrite: 'https://esm.sh/appwrite@16',
  auth0: 'https://esm.sh/@auth0/auth0-spa-js@2',
  clerk: 'https://esm.sh/@clerk/clerk-js@5',
};

function cdnImport(url) {
  // @vite-ignore keeps Vite/Rollup from trying to resolve/bundle the CDN module.
  return import(/* @vite-ignore */ url);
}

export function normalizeAuthSettings(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  return {
    auth_enabled: !!s.auth_enabled,
    auth_provider: s.auth_provider || 'local',
    require_email_verification: s.require_email_verification !== false,
    firebase_api_key: (s.firebase_api_key || '').trim(),
    firebase_auth_domain: (s.firebase_auth_domain || '').trim(),
    firebase_project_id: (s.firebase_project_id || '').trim(),
    firebase_app_id: (s.firebase_app_id || '').trim(),
    firebase_messaging_sender_id: (s.firebase_messaging_sender_id || '').trim(),
    supabase_url: (s.supabase_url || '').trim(),
    supabase_anon_key: (s.supabase_anon_key || '').trim(),
    clerk_publishable_key: (s.clerk_publishable_key || '').trim(),
    auth0_domain: (s.auth0_domain || '').trim(),
    auth0_client_id: (s.auth0_client_id || '').trim(),
    auth0_audience: (s.auth0_audience || '').trim(),
    appwrite_endpoint: (s.appwrite_endpoint || '').trim(),
    appwrite_project_id: (s.appwrite_project_id || '').trim(),
  };
}

export async function getAuthSettings() {
  const list = await api.entities.AuthSettings.list('-updated_date', 1);
  return normalizeAuthSettings(list?.[0] || {});
}

/** Which fields each provider needs to be considered "configured". */
const REQUIRED_FIELDS = {
  firebase: ['firebase_api_key', 'firebase_auth_domain', 'firebase_project_id', 'firebase_app_id'],
  supabase: ['supabase_url', 'supabase_anon_key'],
  clerk: ['clerk_publishable_key'],
  auth0: ['auth0_domain', 'auth0_client_id'],
  appwrite: ['appwrite_endpoint', 'appwrite_project_id'],
  local: [],
};

export function isProviderConfigured(settings) {
  const s = normalizeAuthSettings(settings);
  const req = REQUIRED_FIELDS[s.auth_provider] || [];
  return req.every((f) => !!s[f]);
}

export function missingFields(settings) {
  const s = normalizeAuthSettings(settings);
  const req = REQUIRED_FIELDS[s.auth_provider] || [];
  return req.filter((f) => !s[f]);
}

/* ------------------------------------------------------------------ */
/* Per-provider adapters                                              */
/* ------------------------------------------------------------------ */

async function createSupabaseAdapter(s) {
  const { createClient } = await cdnImport(CDN.supabase);
  const client = createClient(s.supabase_url, s.supabase_anon_key);
  return {
    provider: 'supabase',
    raw: client,
    async signUp({ email, password, name }) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { name: name || '' } },
      });
      if (error) throw error;
      return { user: data.user };
    },
    async signIn({ email, password }) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { user: data.user };
    },
    async signOut() {
      await client.auth.signOut();
    },
    async getCurrentUser() {
      const { data } = await client.auth.getUser();
      return data?.user || null;
    },
    async sendEmailVerification() {
      // Supabase sends a confirmation email automatically on sign-up.
    },
  };
}

async function createFirebaseAdapter(s) {
  const { initializeApp, getApps } = await cdnImport(CDN.firebaseApp);
  const authMod = await cdnImport(CDN.firebaseAuth);
  const config = {
    apiKey: s.firebase_api_key,
    authDomain: s.firebase_auth_domain,
    projectId: s.firebase_project_id,
    appId: s.firebase_app_id,
    messagingSenderId: s.firebase_messaging_sender_id || undefined,
  };
  const app = getApps().length ? getApps()[0] : initializeApp(config);
  const auth = authMod.getAuth(app);
  return {
    provider: 'firebase',
    raw: { app, auth },
    async signUp({ email, password, name }) {
      const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
      if (name && authMod.updateProfile) {
        await authMod.updateProfile(cred.user, { displayName: name }).catch(() => {});
      }
      await authMod.sendEmailVerification(cred.user).catch(() => {});
      return { user: cred.user };
    },
    async signIn({ email, password }) {
      const cred = await authMod.signInWithEmailAndPassword(auth, email, password);
      return { user: cred.user };
    },
    async signOut() {
      await authMod.signOut(auth);
    },
    async getCurrentUser() {
      return auth.currentUser || null;
    },
    async sendEmailVerification() {
      if (auth.currentUser) await authMod.sendEmailVerification(auth.currentUser);
    },
  };
}

async function createAppwriteAdapter(s) {
  const mod = await cdnImport(CDN.appwrite);
  const client = new mod.Client().setEndpoint(s.appwrite_endpoint).setProject(s.appwrite_project_id);
  const account = new mod.Account(client);
  const uid = () => (mod.ID?.unique ? mod.ID.unique() : 'unique()');
  return {
    provider: 'appwrite',
    raw: { client, account },
    async signUp({ email, password, name }) {
      const user = await account.create(uid(), email, password, name || undefined);
      await account.createEmailPasswordSession(email, password);
      try {
        await account.createVerification(`${window.location.origin}/verify`);
      } catch {
        /* verification URL must be whitelisted in Appwrite console */
      }
      return { user };
    },
    async signIn({ email, password }) {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      return { user };
    },
    async signOut() {
      await account.deleteSession('current').catch(() => {});
    },
    async getCurrentUser() {
      try {
        return await account.get();
      } catch {
        return null;
      }
    },
    async sendEmailVerification() {
      await account.createVerification(`${window.location.origin}/verify`);
    },
  };
}

async function createAuth0Adapter(s) {
  const mod = await cdnImport(CDN.auth0);
  const client = await mod.createAuth0Client({
    domain: s.auth0_domain,
    clientId: s.auth0_client_id,
    authorizationParams: {
      redirect_uri: window.location.origin,
      ...(s.auth0_audience ? { audience: s.auth0_audience } : {}),
    },
  });
  return {
    provider: 'auth0',
    raw: client,
    async signUp() {
      // Auth0 uses Universal Login (hosted) for sign-up + verification.
      await client.loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
    },
    async signIn() {
      await client.loginWithRedirect();
    },
    async signInWithRedirect() {
      await client.loginWithRedirect();
    },
    async handleRedirectCallback() {
      return client.handleRedirectCallback();
    },
    async signOut() {
      await client.logout({ logoutParams: { returnTo: window.location.origin } });
    },
    async getCurrentUser() {
      const authed = await client.isAuthenticated();
      return authed ? client.getUser() : null;
    },
    async sendEmailVerification() {
      /* handled by Auth0 email flows */
    },
  };
}

async function createClerkAdapter(s) {
  const mod = await cdnImport(CDN.clerk);
  const Clerk = mod.Clerk || mod.default;
  const clerk = new Clerk(s.clerk_publishable_key);
  await clerk.load();
  return {
    provider: 'clerk',
    raw: clerk,
    async signUp() {
      clerk.openSignUp();
    },
    async signIn() {
      clerk.openSignIn();
    },
    async signInWithRedirect() {
      clerk.redirectToSignIn();
    },
    async signOut() {
      await clerk.signOut();
    },
    async getCurrentUser() {
      return clerk.user || null;
    },
    async sendEmailVerification() {
      /* Clerk handles verification inside its components */
    },
  };
}

const FACTORIES = {
  supabase: createSupabaseAdapter,
  firebase: createFirebaseAdapter,
  appwrite: createAppwriteAdapter,
  auth0: createAuth0Adapter,
  clerk: createClerkAdapter,
};

let cachedAdapter = null;
let cachedKey = '';

/**
 * Returns the active provider adapter, or null when auth is disabled / set to
 * the built-in local provider. Adapters are cached per provider+config.
 */
export async function loadActiveAuthProvider() {
  const s = await getAuthSettings();
  if (!s.auth_enabled || s.auth_provider === 'local') return null;
  if (!isProviderConfigured(s)) {
    throw new Error(`auth_not_configured: missing ${missingFields(s).join(', ')}`);
  }
  const factory = FACTORIES[s.auth_provider];
  if (!factory) throw new Error(`unknown_auth_provider: ${s.auth_provider}`);

  const key = JSON.stringify(s);
  if (cachedAdapter && cachedKey === key) return cachedAdapter;
  cachedAdapter = await factory(s);
  cachedKey = key;
  return cachedAdapter;
}

/**
 * Validates configuration and loads the SDK without performing a sign-in.
 * Used by the admin "Test connection" button to confirm a provider is wired up.
 */
export async function testAuthProvider(settings) {
  const s = normalizeAuthSettings(settings);
  if (s.auth_provider === 'local') {
    return { ok: true, provider: 'local', message: 'Built-in local authentication.' };
  }
  if (!isProviderConfigured(s)) {
    return { ok: false, provider: s.auth_provider, message: `Missing: ${missingFields(s).join(', ')}` };
  }
  const factory = FACTORIES[s.auth_provider];
  if (!factory) return { ok: false, provider: s.auth_provider, message: 'Unknown provider.' };
  try {
    const adapter = await factory(s);
    // Touch the SDK to make sure it initialized.
    if (typeof adapter.getCurrentUser === 'function') {
      await adapter.getCurrentUser().catch(() => null);
    }
    return { ok: true, provider: s.auth_provider, message: 'SDK loaded and initialized successfully.' };
  } catch (err) {
    return { ok: false, provider: s.auth_provider, message: err?.message || String(err) };
  }
}
