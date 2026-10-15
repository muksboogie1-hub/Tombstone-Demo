import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { WebsiteContent } from '../types/content';
import { DEFAULT_WEBSITE_CONTENT } from '../data/defaultContent';

export interface ContentFetchResult {
  data: WebsiteContent;
  error: Error | null;
  isMissingTable: boolean;
  isEmptyTable: boolean;
  isOffline: boolean;
}

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
 * Fetches all website content sections from Supabase.
 * Merges with default content to ensure every field is always populated.
 */
export async function fetchWebsiteContent(): Promise<ContentFetchResult> {
  if (!isSupabaseConfigured()) {
    return {
      data: DEFAULT_WEBSITE_CONTENT,
      error: new Error('Supabase credentials not configured in environment'),
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: true,
    };
  }

  try {
    const { data, error } = await supabase
      .from('website_content')
      .select('*');

    if (error) {
      const isMissing =
        error.code === '42P01' ||
        Boolean(error.message && error.message.toLowerCase().includes('does not exist'));

      return {
        data: DEFAULT_WEBSITE_CONTENT,
        error: new Error(error.message),
        isMissingTable: isMissing,
        isEmptyTable: false,
        isOffline: !isMissing,
      };
    }

    if (!data || data.length === 0) {
      return {
        data: DEFAULT_WEBSITE_CONTENT,
        error: null,
        isMissingTable: false,
        isEmptyTable: true,
        isOffline: false,
      };
    }

    // Merge database values on top of default baseline
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

    return {
      data: merged,
      error: null,
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: false,
    };
  } catch (err: any) {
    return {
      data: DEFAULT_WEBSITE_CONTENT,
      error: err instanceof Error ? err : new Error(String(err)),
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: true,
    };
  }
}

/**
 * Admin: Save a specific website content section to Supabase
 */
export async function saveContentSection(
  sectionKey: keyof WebsiteContent,
  value: any,
  currentUserId?: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const payload = {
      key: sectionKey,
      section: sectionKey,
      value,
      is_published: true,
      updated_by: currentUserId || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('website_content')
      .upsert(payload, { onConflict: 'key' });

    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin: Reset a content section back to default
 */
export async function resetContentSection(
  sectionKey: keyof WebsiteContent,
  currentUserId?: string
): Promise<{ success: boolean; error: Error | null }> {
  const defaultValue = DEFAULT_WEBSITE_CONTENT[sectionKey];
  return saveContentSection(sectionKey, defaultValue, currentUserId);
}

/**
 * Admin: Seed initial website content records to Supabase
 */
export async function seedContentToSupabase(): Promise<{ count: number; error: Error | null }> {
  try {
    const rows = SECTION_KEYS.map((key) => ({
      key,
      section: key,
      value: DEFAULT_WEBSITE_CONTENT[key],
      is_published: true,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('website_content')
      .upsert(rows, { onConflict: 'key', ignoreDuplicates: true })
      .select();

    if (error) throw error;
    return { count: data?.length || 0, error: null };
  } catch (err: any) {
    return { count: 0, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
