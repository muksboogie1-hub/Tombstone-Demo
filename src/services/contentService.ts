import { getSupabaseClient, isSupabaseConfigured, formatSupabaseError } from '../lib/supabaseClient';
import { WebsiteContent } from '../types/content';
import { DEFAULT_WEBSITE_CONTENT } from '../data/defaultContent';
import { getCurrentAdminUser } from './authService';

export interface ContentFetchResult {
  data: WebsiteContent;
  error: Error | null;
  isMissingTable: boolean;
  isEmptyTable: boolean;
  isOffline: boolean;
}

const LOCAL_CONTENT_CACHE_KEY = 'velquarath_stoneworks_content_cache';

const SECTION_KEYS: (keyof WebsiteContent)[] = [
  'announcement',
  'hero',
  'about',
  'categories',
  'craftsmanship',
  'gallery',
  'contact',
  'footer',
];

/**
 * Checks whether the active user has a live authenticated Supabase session.
 */
async function isSupabaseSession(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const user = await getCurrentAdminUser();
    return Boolean(user && user.isSupabaseAuth);
  } catch {
    return false;
  }
}

/**
 * Fetches all website content sections with local caching and offline fallback.
 * Merges with default baseline so every section is always reliably populated.
 */
export async function fetchWebsiteContent(): Promise<ContentFetchResult> {
  const getCachedOrBaseline = (): WebsiteContent => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_CONTENT_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            return { ...DEFAULT_WEBSITE_CONTENT, ...parsed };
          }
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_WEBSITE_CONTENT;
  };

  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return {
      data: getCachedOrBaseline(),
      error: null,
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: true,
    };
  }

  try {
    const { data, error } = await client.from('website_content').select('*');

    if (error) {
      const isMissing =
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        Boolean(error.message && error.message.toLowerCase().includes('does not exist'));

      return {
        data: getCachedOrBaseline(),
        error: new Error(formatSupabaseError(error)),
        isMissingTable: isMissing,
        isEmptyTable: false,
        isOffline: true,
      };
    }

    if (!data || data.length === 0) {
      return {
        data: getCachedOrBaseline(),
        error: null,
        isMissingTable: false,
        isEmptyTable: true,
        isOffline: false,
      };
    }

    // Merge database values on top of baseline
    const merged: WebsiteContent = { ...DEFAULT_WEBSITE_CONTENT };
    for (const row of data) {
      const sectionKey = row.key as keyof WebsiteContent;
      if (SECTION_KEYS.includes(sectionKey) && row.value) {
        merged[sectionKey] = {
          ...DEFAULT_WEBSITE_CONTENT[sectionKey],
          ...row.value,
        };
      }
    }

    // Cache merged content in localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_CONTENT_CACHE_KEY, JSON.stringify(merged));
      } catch {
        // ignore
      }
    }

    return {
      data: merged,
      error: null,
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: false,
    };
  } catch (err: any) {
    return {
      data: getCachedOrBaseline(),
      error: err instanceof Error ? err : new Error(String(err)),
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: true,
    };
  }
}

/**
 * Admin: Save a specific website content section.
 * Supports live Supabase updates and preview sandbox local caching.
 */
export async function saveContentSection(
  sectionKey: keyof WebsiteContent,
  value: any,
  currentUserId?: string
): Promise<{ success: boolean; error: Error | null }> {
  const hasLive = await isSupabaseSession();
  const client = getSupabaseClient();

  // Always update local cache so changes appear immediately
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_CONTENT_CACHE_KEY);
      const current = cached ? JSON.parse(cached) : { ...DEFAULT_WEBSITE_CONTENT };
      current[sectionKey] = value;
      localStorage.setItem(LOCAL_CONTENT_CACHE_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }
  }

  // Preview sandbox mode
  if (!hasLive || !client) {
    return { success: true, error: null };
  }

  // Live Supabase update
  try {
    const user = await getCurrentAdminUser();
    const payload = {
      key: sectionKey,
      section: sectionKey,
      value,
      is_published: true,
      updated_by: currentUserId || user?.id || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client
      .from('website_content')
      .upsert(payload, { onConflict: 'key' });

    if (error) {
      throw new Error(formatSupabaseError(error));
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin: Reset a content section back to default baseline.
 */
export async function resetContentSection(
  sectionKey: keyof WebsiteContent,
  currentUserId?: string
): Promise<{ success: boolean; error: Error | null }> {
  const defaultValue = DEFAULT_WEBSITE_CONTENT[sectionKey];
  return saveContentSection(sectionKey, defaultValue, currentUserId);
}

/**
 * Admin: Seed default website content records into Supabase.
 */
export async function seedContentToSupabase(): Promise<{ count: number; error: Error | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { count: 0, error: new Error('Supabase client is not configured') };
  }

  try {
    const rows = SECTION_KEYS.map((key) => ({
      key,
      section: key,
      value: DEFAULT_WEBSITE_CONTENT[key],
      is_published: true,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await client
      .from('website_content')
      .upsert(rows, { onConflict: 'key', ignoreDuplicates: true })
      .select();

    if (error) throw new Error(formatSupabaseError(error));
    return { count: data?.length || rows.length, error: null };
  } catch (err: any) {
    return { count: 0, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
