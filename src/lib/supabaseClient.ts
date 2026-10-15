import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string;
  keyMasked: string;
  source: 'build_time_env' | 'browser_storage' | 'none';
  error?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: 'build_time_env' | 'browser_storage';
}

const STORAGE_KEY = 'velquarath_stoneworks_supabase_settings';

/**
 * Sanitizes and normalizes the public Supabase URL.
 * Automatically cleans leading/trailing whitespace, quotes, trailing slashes,
 * and fixes duplicate copy-pastes (e.g., https://xxx.supabase.cohttps://xxx.supabase.co).
 */
export function sanitizeSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim().replace(/^["']|["']$/g, '').trim();
  const match = trimmed.match(/(https:\/\/[a-z0-9-]+\.supabase\.co)/i);
  if (match) return match[1];
  return trimmed.replace(/\/+$/, '');
}

/**
 * Validates whether a given key has the standard structure of a Supabase key.
 */
export function validateSupabaseKey(key?: string): { valid: boolean; error?: string } {
  if (!key) return { valid: false, error: 'Key is empty' };
  const trimmed = key.trim().replace(/^["']|["']$/g, '').trim();

  if (isServiceRoleKey(trimmed)) {
    return {
      valid: false,
      error: 'CRITICAL SECURITY WARNING: You have entered a Supabase service_role or secret key. NEVER expose service_role keys in browser code. Please use the public "anon" / publishable key from your Supabase Dashboard API settings.',
    };
  }

  // Supabase anon keys are JWTs (3 dot-separated base64 segments) or modern sb_publishable keys
  if (trimmed.startsWith('sb_publishable_') || trimmed.length >= 20) {
    return { valid: true };
  }

  return { valid: false, error: 'Invalid Supabase anon key format' };
}

/**
 * Deep security inspection: checks whether a key is a service-role or secret key.
 * Inspects both prefix and decoded JWT claims to prevent exposing secret credentials.
 */
export function isServiceRoleKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim().replace(/^["']|["']$/g, '').trim();
  if (trimmed.includes('service_role') || trimmed.startsWith('sb_secret_')) return true;

  const parts = trimmed.split('.');
  if (parts.length === 3) {
    try {
      let decodedStr = '';
      if (typeof atob === 'function') {
        decodedStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      }
      if (decodedStr) {
        const payload = JSON.parse(decodedStr);
        if (payload.role === 'service_role' || payload.role === 'supabase_admin') {
          return true;
        }
      }
    } catch {
      // ignore parsing errors
    }
  }
  return false;
}

/**
 * Retrieves the active Supabase configuration.
 * Resolution hierarchy:
 * 1. Build-time injected environment variables (import.meta.env.VITE_SUPABASE_*).
 * 2. Browser-level configuration in localStorage (allows runtime setup in admin portal).
 */
export const getSupabaseConfig = (): SupabaseConfig | null => {
  // 1. Check build-time environment variables
  const envUrl = sanitizeSupabaseUrl(
    typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_URL as string | undefined) : undefined
  );
  const envKey = (
    typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '' : ''
  ).trim();

  const envKeyCheck = validateSupabaseKey(envKey);
  if (envUrl && envKey && envKeyCheck.valid && !envUrl.includes('your-project') && !envUrl.includes('placeholder')) {
    return { url: envUrl, anonKey: envKey, source: 'build_time_env' };
  }

  // 2. Check browser-level override stored in localStorage
  if (typeof window !== 'undefined') {
    try {
      const customConfig = localStorage.getItem(STORAGE_KEY);
      if (customConfig) {
        const parsed = JSON.parse(customConfig);
        const storedUrl = sanitizeSupabaseUrl(parsed.url);
        const storedKey = (parsed.key || parsed.anonKey || '').trim();
        const storedKeyCheck = validateSupabaseKey(storedKey);
        if (storedUrl && storedKey && storedKeyCheck.valid && !storedUrl.includes('your-project') && !storedUrl.includes('placeholder')) {
          return { url: storedUrl, anonKey: storedKey, source: 'browser_storage' };
        }
      }
    } catch {
      // ignore localStorage read errors
    }
  }

  return null;
};

/**
 * Checks whether Supabase credentials are valid and ready for use.
 */
export const isSupabaseConfigured = (): boolean => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg && cfg.url && cfg.anonKey);
};

/**
 * Returns comprehensive configuration diagnostics for the admin dashboard and health checks.
 */
export const getSupabaseConfigStatus = (): SupabaseConfigStatus => {
  const envUrl = sanitizeSupabaseUrl(
    typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_URL as string | undefined) : undefined
  );
  const envKey = (
    typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || '' : ''
  ).trim();

  // Check build environment
  if (envUrl && envKey && !envUrl.includes('your-project') && !envUrl.includes('placeholder')) {
    const keyCheck = validateSupabaseKey(envKey);
    if (keyCheck.valid) {
      return {
        isConfigured: true,
        url: envUrl,
        keyMasked: `${envKey.slice(0, 10)}...${envKey.slice(-4)}`,
        source: 'build_time_env',
      };
    }
    return {
      isConfigured: false,
      url: envUrl,
      keyMasked: '',
      source: 'build_time_env',
      error: keyCheck.error,
    };
  }

  // Check browser-level storage
  if (typeof window !== 'undefined') {
    try {
      const customConfig = localStorage.getItem(STORAGE_KEY);
      if (customConfig) {
        const parsed = JSON.parse(customConfig);
        const storedUrl = sanitizeSupabaseUrl(parsed.url);
        const storedKey = (parsed.key || parsed.anonKey || '').trim();
        const keyCheck = validateSupabaseKey(storedKey);
        if (storedUrl && storedKey && keyCheck.valid && !storedUrl.includes('your-project') && !storedUrl.includes('placeholder')) {
          return {
            isConfigured: true,
            url: storedUrl,
            keyMasked: `${storedKey.slice(0, 10)}...${storedKey.slice(-4)}`,
            source: 'browser_storage',
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return {
    isConfigured: false,
    url: '',
    keyMasked: '',
    source: 'none',
    error:
      'Supabase credentials are not configured. To connect your live database, define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting environment variables, or configure them securely in the private admin area.',
  };
};

/**
 * Saves Supabase credentials to the browser's localStorage.
 * Enables live connection in admin portal even without redeploying.
 */
export const saveSupabaseBrowserConfig = (
  rawUrl: string,
  rawKey: string
): { success: boolean; error?: string } => {
  const url = sanitizeSupabaseUrl(rawUrl);
  const key = rawKey.trim();

  if (!url || !url.startsWith('https://')) {
    return { success: false, error: 'Please enter a valid Supabase project URL (must start with https://)' };
  }

  const keyCheck = validateSupabaseKey(key);
  if (!keyCheck.valid) {
    return { success: false, error: keyCheck.error || 'Invalid Supabase key' };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ url, key }));
    resetSupabaseClient();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save configuration to browser storage' };
  }
};

/**
 * Clears any browser-level Supabase override.
 */
export const clearSupabaseBrowserConfig = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    resetSupabaseClient();
  } catch {
    // ignore
  }
};

// Aliases for backwards compatibility with earlier components
export const saveRuntimeCredentials = (url: string, key: string) => saveSupabaseBrowserConfig(url, key);
export const clearRuntimeCredentials = clearSupabaseBrowserConfig;

// =====================================================================
// SINGLETON CLIENT PATTERN:
// Reuses a single shared client instance throughout the application
// lifecycle, eliminating "Multiple GoTrueClient instances detected" warnings.
// =====================================================================
let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

const fallbackDummyUrl = 'https://placeholder.supabase.co';
const fallbackDummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-signature';

export const getSupabaseClient = (): SupabaseClient | null => {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.url || !cfg.anonKey) {
    return null;
  }

  if (cachedClient && cachedUrl === cfg.url && cachedKey === cfg.anonKey) {
    return cachedClient;
  }

  cachedUrl = cfg.url;
  cachedKey = cfg.anonKey;
  cachedClient = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'velquarath_stoneworks_auth_token',
    },
  });

  return cachedClient;
};

export const resetSupabaseClient = () => {
  cachedClient = null;
  cachedUrl = '';
  cachedKey = '';
};

export const reinitializeClient = resetSupabaseClient;

// Internal client used for proxy fallback when not configured
let dummyClient: SupabaseClient | null = null;
function getDummyClient(): SupabaseClient {
  if (!dummyClient) {
    dummyClient = createClient(fallbackDummyUrl, fallbackDummyKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return dummyClient;
}

/**
 * Transparent proxy for SupabaseClient.
 * Allows components to use `import { supabase } from '../lib/supabaseClient'`
 * while dynamically resolving to the active configured client.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient() || getDummyClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

/**
 * Formats Supabase PostgrestError or generic error objects into actionable diagnostic messages
 * preserving the exact error code, message, and hint without leaking secrets, tokens, or passwords.
 */
export function formatSupabaseError(error: any): string {
  if (!error) return 'Unknown error occurred.';
  if (typeof error === 'string') return error;

  const sanitize = (val: any): string => {
    if (!val) return '';
    return String(val)
      .replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[REDACTED_JWT]')
      .replace(/sb_secret_[a-zA-Z0-9_-]+/g, '[REDACTED_KEY]')
      .replace(/sb_publishable_[a-zA-Z0-9_-]+/g, '[REDACTED_KEY]')
      .replace(/(password|passwd|token|secret)[:=]\s*["']?[^"'\s,;]+/gi, '$1=[REDACTED]');
  };

  const code = error.code ? `[${error.code}] ` : '';
  const rawMessage = error.message || error.error_description || 'Database request failed';
  const cleanMessage = sanitize(rawMessage);
  const rawDetails = error.details && error.details !== error.message ? ` — Details: ${sanitize(error.details)}` : '';
  const rawHint = error.hint ? ` (Hint: ${sanitize(error.hint)})` : '';

  if (
    error.code === '42501' ||
    cleanMessage.toLowerCase().includes('row-level security') ||
    cleanMessage.toLowerCase().includes('permission denied')
  ) {
    return `${code}${cleanMessage}${rawDetails}${rawHint} — Cause: Your authenticated user is not linked or recognized as an active administrator in public.admin_users. Please execute supabase-schema.sql in your Supabase SQL Editor.`;
  }

  if (error.code === 'PGRST205' || error.code === '42P01' || cleanMessage.includes('Could not find the table') || cleanMessage.includes('does not exist')) {
    return `${code}${cleanMessage}${rawDetails}${rawHint} — Cause: Required database table does not exist. Please run supabase-schema.sql in your Supabase SQL Editor.`;
  }

  if (error.code === '23505') {
    return `${code}${cleanMessage}${rawDetails}${rawHint} (A record with this identifier already exists).`;
  }

  return `${code}${cleanMessage}${rawDetails}${rawHint}`;
}

/**
 * Actively tests the connection to Supabase and reports real diagnostics.
 * Designed exclusively for the private admin dashboard.
 */
export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  isConfigured: boolean;
  source?: 'build_time_env' | 'browser_storage';
  message: string;
  error?: string;
  hasTables?: boolean;
}> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      isConfigured: false,
      message: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured.',
    };
  }

  try {
    const client = getSupabaseClient();
    if (!client) {
      return {
        ok: false,
        isConfigured: true,
        source: config.source,
        message: 'Could not instantiate Supabase client with given credentials.',
      };
    }

    const timeoutPromise = new Promise<{ isTimeout: true }>((resolve) =>
      setTimeout(() => resolve({ isTimeout: true }), 4500)
    );

    const queryPromise = client.from('products').select('id').limit(1);
    const result = await Promise.race([queryPromise, timeoutPromise]);

    if ('isTimeout' in result) {
      return {
        ok: false,
        isConfigured: true,
        source: config.source,
        message: 'Connection timed out after 4500ms. Supabase project might be paused or unreachable.',
        error: 'Timeout waiting for Supabase response',
      };
    }

    const { error: queryError } = result;
    if (queryError) {
      const isMissingTable =
        queryError.code === '42P01' ||
        queryError.code === 'PGRST205' ||
        Boolean(queryError.message && queryError.message.toLowerCase().includes('does not exist'));

      if (isMissingTable) {
        return {
          ok: true,
          isConfigured: true,
          hasTables: false,
          source: config.source,
          message: 'Connected to Supabase successfully, but database tables (products / website_content) are not initialized yet.',
          error: queryError.message,
        };
      }

      return {
        ok: false,
        isConfigured: true,
        source: config.source,
        message: `Supabase error: ${formatSupabaseError(queryError)}`,
        error: queryError.message,
      };
    }

    return {
      ok: true,
      isConfigured: true,
      hasTables: true,
      source: config.source,
      message: 'Successfully connected to live Supabase database.',
    };
  } catch (err: any) {
    return {
      ok: false,
      isConfigured: true,
      source: config.source,
      message: `Connection failed: ${err instanceof Error ? err.message : String(err)}`,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
