import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Checks whether Supabase credentials have been properly configured
 * in the client environment (not undefined, empty, or default placeholder).
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false;
  }
  const cleanUrl = supabaseUrl.trim();
  const cleanKey = supabaseAnonKey.trim();

  if (
    cleanUrl === '' ||
    cleanKey === '' ||
    cleanUrl.includes('your-project-id') ||
    cleanUrl.includes('example.supabase.co') ||
    cleanKey.includes('your-anon-key') ||
    cleanKey.includes('placeholder')
  ) {
    return false;
  }

  try {
    new URL(cleanUrl);
    return true;
  } catch {
    return false;
  }
}

// Fallback dummy client for when Supabase is not configured yet
// to prevent uncaught runtime errors during initial development
const dummyUrl = 'https://placeholder-project.supabase.co';
const dummyAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-signature';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl!.trim() : dummyUrl,
  isSupabaseConfigured() ? supabaseAnonKey!.trim() : dummyAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
