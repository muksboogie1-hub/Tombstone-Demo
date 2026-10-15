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

export function normalizeCategories(cat?: any): any {
  const base = DEFAULT_WEBSITE_CONTENT.categories;
  if (!cat || typeof cat !== 'object') return base;

  const rawCards = Array.isArray(cat.cards) ? cat.cards : [];
  const defaultCards = base.cards || [];

  const normalizedCards = defaultCards.map((defaultCard) => {
    const existing = rawCards.find((c: any) => c.id === defaultCard.id) || {};
    let imageUrl = existing.imageUrl || defaultCard.imageUrl;
    // Fix broken tombstone image if referencing dead 404 URL
    if (imageUrl && imageUrl.includes('photo-1596280459345-42cf6ee2a106')) {
      imageUrl = defaultCard.imageUrl;
    }

    return {
      id: defaultCard.id,
      categoryLabel: existing.categoryLabel || defaultCard.categoryLabel,
      title: existing.title || (defaultCard.id === 'tombstones' ? cat.tombstonesHeading : defaultCard.id === 'countertops' ? cat.countertopsHeading : cat.windowSillsHeading) || defaultCard.title,
      description: existing.description || (defaultCard.id === 'tombstones' ? cat.tombstonesDescription : defaultCard.id === 'countertops' ? cat.countertopsDescription : cat.windowSillsDescription) || defaultCard.description,
      imageUrl,
      imageAlt: existing.imageAlt || defaultCard.imageAlt,
      exploreButtonText: existing.exploreButtonText || defaultCard.exploreButtonText,
      exploreLink: existing.exploreLink || defaultCard.exploreLink,
      imageSettings: existing.imageSettings || defaultCard.imageSettings,
    };
  });

  return {
    ...base,
    ...cat,
    cards: normalizedCards,
  };
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
            const merged = { ...DEFAULT_WEBSITE_CONTENT, ...parsed };
            merged.categories = normalizeCategories(merged.categories);
            return merged;
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
        if (sectionKey === 'categories') {
          merged.categories = normalizeCategories(row.value);
        } else {
          merged[sectionKey] = {
            ...DEFAULT_WEBSITE_CONTENT[sectionKey],
            ...row.value,
          };
        }
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

/**
 * Admin: Upload hero background image to Supabase Storage bucket 'website-assets'
 * Provides instant Data URL preview fallback and handles missing bucket creation.
 */
export async function uploadHeroImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  // Validate MIME type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isAllowedExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

  if (!allowedTypes.includes(file.type.toLowerCase()) && !isAllowedExt) {
    return {
      url: null,
      error: new Error('Unsupported image format. Please select a JPG, JPEG, PNG, or WebP image.'),
    };
  }

  // Max 10 MB limit
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      url: null,
      error: new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`),
    };
  }

  const readDataUrl = (): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });

  const previewUrl = await readDataUrl();
  const hasLive = await isSupabaseSession();
  const client = getSupabaseClient();

  // If live authenticated Supabase session exists, try Supabase Storage first
  if (hasLive && client) {
    try {
      const fileExt = ext || 'jpg';
      const cleanExt = fileExt.replace(/[^a-z0-9]/g, '');
      const fileName = `hero-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
      const filePath = `hero/${fileName}`;

      const { data, error } = await client.storage
        .from('website-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = client.storage.from('website-assets').getPublicUrl(data.path);
        return { url: publicUrlData.publicUrl, error: null };
      }
    } catch {
      // Supabase upload failed, fallback to server upload
    }
  }

  // Next, upload to persistent server file endpoint /api/upload
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        dataUrl: previewUrl,
        folder: 'hero',
      }),
    });
    if (res.ok) {
      const resJson = await res.json();
      if (resJson.success && resJson.url) {
        return { url: resJson.url, error: null };
      }
    }
  } catch {
    // server upload failed
  }

  // Preview sandbox fallback
  return { url: previewUrl, error: null };
}

/**
 * Admin: Upload or replace a category card image.
 * Uses persistent storage:
 * 1. Supabase Storage bucket 'website-assets' (if live authenticated Supabase session exists)
 * 2. Dedicated server endpoint /api/upload (which writes permanently to public/uploads/categories/)
 * 3. Base64 data URL fallback if both server and Supabase are unreachable.
 */
export async function uploadCategoryCardImage(
  file: File,
  cardId: string
): Promise<{ url: string | null; error: Error | null }> {
  // Validate MIME type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isAllowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);

  if (!allowedTypes.includes(file.type.toLowerCase()) && !isAllowedExt) {
    return {
      url: null,
      error: new Error('Unsupported image format. Please select a JPG, JPEG, PNG, or WebP image.'),
    };
  }

  // Max 10 MB limit
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      url: null,
      error: new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`),
    };
  }

  const readDataUrl = (): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });

  const previewUrl = await readDataUrl();
  const hasLive = await isSupabaseSession();
  const client = getSupabaseClient();

  // 1. Try Supabase Storage if configured and active
  if (hasLive && client) {
    try {
      const fileExt = ext || 'jpg';
      const cleanExt = fileExt.replace(/[^a-z0-9]/g, '');
      const fileName = `${cardId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${cleanExt}`;
      const filePath = `categories/${fileName}`;

      const { data, error } = await client.storage
        .from('website-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data?.path) {
        const { data: publicUrlData } = client.storage.from('website-assets').getPublicUrl(data.path);
        return { url: publicUrlData.publicUrl, error: null };
      }
    } catch {
      // Supabase failed, continue to server upload fallback
    }
  }

  // 2. Upload to persistent server endpoint /api/upload
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        dataUrl: previewUrl,
        folder: 'categories',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.url) {
        return { url: result.url, error: null };
      }
    }
  } catch {
    // If backend /api/upload endpoint is not reached, fallback to previewUrl
  }

  // 3. Graceful fallback to data URL
  return { url: previewUrl, error: null };
}

