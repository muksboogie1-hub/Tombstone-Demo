import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: 'build_env' | 'window_env' | 'local_storage';
}

const dummyUrl = 'https://placeholder-project.supabase.co';
const dummyAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-signature';

/**
 * Checks whether a given string is a valid Supabase project URL
 */
function isValidSupabaseUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim();
  if (
    clean === '' ||
    clean.includes('your-project-id') ||
    clean.includes('example.supabase.co') ||
    clean.includes('placeholder-project')
  ) {
    return false;
  }
  try {
    const parsed = new URL(clean);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Checks whether a given string is a valid Supabase anon key
 */
function isValidSupabaseKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim();
  return (
    clean.length > 20 &&
    !clean.includes('your-anon-key') &&
    !clean.includes('dummy-signature') &&
    !clean.includes('placeholder')
  );
}

/**
 * Resolves Supabase configuration from:
 * 1. Build-time Vite environment variables (import.meta.env.VITE_SUPABASE_*)
 * 2. Window runtime environment variables (window.__ENV__ or window.ENV)
 * 3. Browser localStorage (for testing credentials or runtime override)
 */
export function getSupabaseConfig(): SupabaseConfig | null {
  // 1. Build-time Vite variables
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_URL as string | undefined) : undefined;
  const envKey = typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) : undefined;

  if (envUrl && envKey && isValidSupabaseUrl(envUrl) && isValidSupabaseKey(envKey)) {
    return {
      url: envUrl.trim(),
      anonKey: envKey.trim(),
      source: 'build_env',
    };
  }

  // 2. Window runtime variables (e.g. from an injected server script or Cloudflare Worker)
  if (typeof window !== 'undefined') {
    const w = window as any;
    const winUrl = w.__ENV__?.VITE_SUPABASE_URL || w.ENV?.VITE_SUPABASE_URL || w.VITE_SUPABASE_URL;
    const winKey = w.__ENV__?.VITE_SUPABASE_ANON_KEY || w.ENV?.VITE_SUPABASE_ANON_KEY || w.VITE_SUPABASE_ANON_KEY;
    if (winUrl && winKey && isValidSupabaseUrl(winUrl) && isValidSupabaseKey(winKey)) {
      return {
        url: winUrl.trim(),
        anonKey: winKey.trim(),
        source: 'window_env',
      };
    }
  }

  // 3. LocalStorage runtime override
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
      const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');
      if (localUrl && localKey && isValidSupabaseUrl(localUrl) && isValidSupabaseKey(localKey)) {
        return {
          url: localUrl.trim(),
          anonKey: localKey.trim(),
          source: 'local_storage',
        };
      }
    } catch {
      // LocalStorage access may be restricted in some iframe contexts
    }
  }

  return null;
}

/**
 * Checks whether Supabase credentials have been properly configured.
 */
export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

/**
 * Saves runtime credentials in localStorage and reconfigures the active client.
 */
export function saveRuntimeCredentials(url: string, anonKey: string): { success: boolean; error?: string } {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (!isValidSupabaseUrl(cleanUrl)) {
    return { success: false, error: 'Invalid Supabase URL. Must be a valid URL like https://your-project.supabase.co' };
  }
  if (!isValidSupabaseKey(cleanKey)) {
    return { success: false, error: 'Invalid Supabase Anon Key. Must be a valid JWT API key.' };
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('VITE_SUPABASE_URL', cleanUrl);
      localStorage.setItem('VITE_SUPABASE_ANON_KEY', cleanKey);
    } catch (e: any) {
      return { success: false, error: 'Could not access browser localStorage: ' + (e?.message || String(e)) };
    }
  }

  reinitializeClient();
  return { success: true };
}

/**
 * Clears saved runtime credentials from localStorage and resets the client.
 */
export function clearRuntimeCredentials(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('VITE_SUPABASE_URL');
      localStorage.removeItem('VITE_SUPABASE_ANON_KEY');
    } catch {
      // Ignore
    }
  }
  reinitializeClient();
}

/**
 * Manages the active Supabase client instance dynamically
 */
let activeClient: SupabaseClient | null = null;

function createActiveClient(): SupabaseClient {
  const config = getSupabaseConfig();
  if (config) {
    return createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return createClient(dummyUrl, dummyAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export function getClient(): SupabaseClient {
  if (!activeClient) {
    activeClient = createActiveClient();
  }
  return activeClient;
}

export function reinitializeClient(): SupabaseClient {
  activeClient = createActiveClient();
  return activeClient;
}

/**
 * Transparent proxy for the active SupabaseClient.
 * Allows client code to continue using `import { supabase } from '...'`
 * while supporting dynamic runtime re-initialization when credentials are provided.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

/**
 * Actively tests the connection to Supabase and reports real diagnostics.
 */
export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  isConfigured: boolean;
  source?: 'build_env' | 'window_env' | 'local_storage';
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
    const client = getClient();
    // Test auth service availability
    const authPromise = client.auth.getSession();
    // Test database query to website_content table with timeout
    const timeoutPromise = new Promise<{ isTimeout: true }>((resolve) =>
      setTimeout(() => resolve({ isTimeout: true }), 4000)
    );

    const queryPromise = client.from('website_content').select('key').limit(1);

    const result = await Promise.race([queryPromise, timeoutPromise]);
    if ('isTimeout' in result) {
      return {
        ok: false,
        isConfigured: true,
        source: config.source,
        message: 'Connection timed out after 4000ms. Supabase project might be paused or unreachable.',
        error: 'Timeout waiting for Supabase response',
      };
    }

    const { error: queryError } = result;

    if (queryError) {
      const isMissingTable =
        queryError.code === '42P01' ||
        Boolean(queryError.message && queryError.message.toLowerCase().includes('does not exist'));

      if (isMissingTable) {
        return {
          ok: true,
          isConfigured: true,
          hasTables: false,
          source: config.source,
          message: 'Connected to Supabase, but "website_content" table does not exist yet. Run migrations.',
          error: queryError.message,
        };
      }

      return {
        ok: false,
        isConfigured: true,
        source: config.source,
        message: `Supabase error: ${queryError.message}`,
        error: queryError.message,
      };
    }

    // Await auth verification to ensure no hanging promise
    await authPromise.catch(() => {});

    return {
      ok: true,
      isConfigured: true,
      hasTables: true,
      source: config.source,
      message: 'Successfully connected to Supabase.',
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
