import { getSupabaseClient, isSupabaseConfigured, formatSupabaseError } from '../lib/supabaseClient';
import { Product } from '../types/content';
import { PRODUCTS as BASELINE_PRODUCTS } from '../data/products';
import { getCurrentAdminUser } from './authService';

export interface ProductFetchResult {
  data: Product[];
  error: Error | null;
  isMissingTable: boolean;
  isEmptyTable: boolean;
  isOffline: boolean;
}

const LOCAL_PRODUCTS_CACHE_KEY = 'velquarath_stoneworks_products_cache';

/**
 * Maps database row (snake_case) to client Product interface (camelCase)
 */
export function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    category: row.category,
    shortDescription: row.short_description || '',
    longDescription: row.long_description || '',
    imageUrl: row.image_url || '',
    imageAlt: row.image_alt || row.name,
    imageAttribution: row.image_attribution || {
      photographer: 'Velquarath Stoneworks',
      source: 'Zimbabwe Masonry Archive',
      license: 'Proprietary',
      modifications: 'None',
    },
    specifications: row.specifications || {
      finish: 'Polished face with honed kerb borders',
      materialOptions: 'Zimbabwe Black Granite',
      sizingNote: 'Standard single or custom family plot dimensions',
    },
    featured: Boolean(row.featured),
    priceDisplayMode: row.price_display_mode || 'quotation_only',
    priceAmount: row.price_amount !== null && row.price_amount !== undefined ? Number(row.price_amount) : null,
    priceCurrency: row.price_currency || 'USD',
    priceNote: row.price_note || '',
    isPublished: row.is_published !== false,
    sortOrder: row.sort_order ?? 0,
  };
}

/**
 * Maps client Product object (camelCase) to database row (snake_case)
 */
export function mapProductToRow(product: Partial<Product>, currentUserId?: string): any {
  const row: any = {};
  if (product.id !== undefined) row.id = product.id;
  if (product.slug !== undefined) row.slug = product.slug;
  if (product.name !== undefined) row.name = product.name;
  if (product.category !== undefined) row.category = product.category;
  if (product.shortDescription !== undefined) row.short_description = product.shortDescription;
  if (product.longDescription !== undefined) row.long_description = product.longDescription;
  if (product.imageUrl !== undefined) row.image_url = product.imageUrl;
  if (product.imageAlt !== undefined) row.image_alt = product.imageAlt;
  if (product.imageAttribution !== undefined) row.image_attribution = product.imageAttribution;
  if (product.specifications !== undefined) row.specifications = product.specifications;
  if (product.featured !== undefined) row.featured = product.featured;
  if (product.priceDisplayMode !== undefined) row.price_display_mode = product.priceDisplayMode;
  if (product.priceAmount !== undefined) row.price_amount = product.priceAmount;
  if (product.priceCurrency !== undefined) row.price_currency = product.priceCurrency;
  if (product.priceNote !== undefined) row.price_note = product.priceNote;
  if (product.isPublished !== undefined) row.is_published = product.isPublished;
  if (product.sortOrder !== undefined) row.sort_order = product.sortOrder;
  if (currentUserId) row.updated_by = currentUserId;
  row.updated_at = new Date().toISOString();
  return row;
}

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
 * Fetch products with resilient local caching and bounded offline fallback.
 */
export async function fetchProducts(): Promise<ProductFetchResult> {
  const getCachedOrBaseline = (): Product[] => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_PRODUCTS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return BASELINE_PRODUCTS;
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
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

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
        data: [],
        error: null,
        isMissingTable: false,
        isEmptyTable: true,
        isOffline: false,
      };
    }

    const mapped = data.map(mapRowToProduct);
    // Cache fresh products locally
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_PRODUCTS_CACHE_KEY, JSON.stringify(mapped));
      } catch {
        // ignore
      }
    }

    return {
      data: mapped,
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
 * Admin: Create a new product.
 * Supports both live Supabase persistence and preview sandbox local caching.
 */
export async function createProduct(
  product: Partial<Product>
): Promise<{ data: Product | null; error: Error | null }> {
  const hasLive = await isSupabaseSession();
  const client = getSupabaseClient();

  const completeProduct: Product = {
    id: product.id || `ts-${Date.now().toString().slice(-4)}`,
    slug: product.slug || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `item-${Date.now()}`),
    name: product.name || 'Custom Stonework',
    category: product.category || 'Tombstones',
    shortDescription: product.shortDescription || '',
    longDescription: product.longDescription || '',
    imageUrl: product.imageUrl || '',
    imageAlt: product.imageAlt || product.name || '',
    imageAttribution: product.imageAttribution || {
      photographer: 'Velquarath Stoneworks',
      source: 'Granite Portfolio',
      license: 'Proprietary',
      modifications: 'None',
    },
    specifications: product.specifications || {
      finish: 'Polished',
      materialOptions: 'Zimbabwe Black Granite',
      sizingNote: 'Custom sizing available',
    },
    featured: Boolean(product.featured),
    priceDisplayMode: product.priceDisplayMode || 'quotation_only',
    priceAmount: product.priceAmount ?? null,
    priceCurrency: product.priceCurrency || 'USD',
    priceNote: product.priceNote || '',
    isPublished: product.isPublished !== false,
    sortOrder: product.sortOrder ?? 0,
  };

  // Preview sandbox local fallback
  if (!hasLive || !client) {
    try {
      const currentRes = await fetchProducts();
      const updated = [completeProduct, ...currentRes.data];
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_PRODUCTS_CACHE_KEY, JSON.stringify(updated));
      }
      return { data: completeProduct, error: null };
    } catch (e: any) {
      return { data: null, error: new Error(e.message || 'Failed to save to local sandbox') };
    }
  }

  // Live Supabase database insert
  try {
    const user = await getCurrentAdminUser();
    const row = mapProductToRow(completeProduct, user?.id);
    const { data, error } = await client.from('products').insert(row).select().single();

    if (error) {
      // Preserve locally so user's draft is not lost
      const currentRes = await fetchProducts();
      const updated = [completeProduct, ...currentRes.data];
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_PRODUCTS_CACHE_KEY, JSON.stringify(updated));
      }
      throw new Error(formatSupabaseError(error));
    }

    const saved = mapRowToProduct(data);
    return { data: saved, error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin: Update an existing product.
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<{ data: Product | null; error: Error | null }> {
  const hasLive = await isSupabaseSession();
  const client = getSupabaseClient();

  // Preview sandbox local fallback
  if (!hasLive || !client) {
    try {
      const currentRes = await fetchProducts();
      const index = currentRes.data.findIndex((p) => p.id === id);
      let updatedList: Product[];
      let updatedItem: Product;
      if (index >= 0) {
        updatedItem = { ...currentRes.data[index], ...updates };
        updatedList = [...currentRes.data];
        updatedList[index] = updatedItem;
      } else {
        updatedItem = { ...(updates as Product), id };
        updatedList = [updatedItem, ...currentRes.data];
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_PRODUCTS_CACHE_KEY, JSON.stringify(updatedList));
      }
      return { data: updatedItem, error: null };
    } catch (e: any) {
      return { data: null, error: new Error(e.message || 'Failed to save to local sandbox') };
    }
  }

  // Live Supabase update
  try {
    const user = await getCurrentAdminUser();
    const row = mapProductToRow(updates, user?.id);
    delete row.id; // Prevent modifying primary key

    const { data, error } = await client.from('products').update(row).eq('id', id).select().single();

    if (error) {
      throw new Error(formatSupabaseError(error));
    }

    const saved = mapRowToProduct(data);
    return { data: saved, error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin: Delete a product.
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error: Error | null }> {
  const hasLive = await isSupabaseSession();
  const client = getSupabaseClient();

  if (!hasLive || !client) {
    try {
      const currentRes = await fetchProducts();
      const filtered = currentRes.data.filter((p) => p.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_PRODUCTS_CACHE_KEY, JSON.stringify(filtered));
      }
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: new Error(e.message) };
    }
  }

  try {
    const { error } = await client.from('products').delete().eq('id', id);
    if (error) throw new Error(formatSupabaseError(error));
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin: Upload product photograph to Supabase Storage bucket 'website-assets'
 * Provides instant Data URL preview fallback and handles missing bucket creation.
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error: Error | null }> {
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

  // If in Preview Sandbox or client missing, return preview URL
  if (!hasLive || !client) {
    return { url: previewUrl, error: null };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await client.storage
      .from('website-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      const isMissingBucket =
        error.message?.toLowerCase().includes('bucket not found') ||
        (error as any).statusCode === '404' ||
        (error as any).error?.toLowerCase?.().includes('bucket not found');

      if (isMissingBucket) {
        try {
          const { error: createErr } = await client.storage.createBucket('website-assets', {
            public: true,
          });
          if (!createErr) {
            const retry = await client.storage.from('website-assets').upload(filePath, file);
            if (!retry.error && retry.data) {
              const { data: retryPub } = client.storage.from('website-assets').getPublicUrl(retry.data.path);
              return { url: retryPub.publicUrl, error: null };
            }
          }
        } catch {
          // create failed
        }
      }

      // If storage upload fails due to RLS or permissions, provide data URL so user can continue editing
      return {
        url: previewUrl,
        error: new Error(formatSupabaseError(error)),
      };
    }

    const { data: publicUrlData } = client.storage.from('website-assets').getPublicUrl(data.path);
    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return {
      url: previewUrl,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/**
 * Admin utility: Deterministic seed of baseline products into Supabase.
 * Uses ON CONFLICT DO NOTHING so existing records are never damaged.
 */
export async function seedProductsToSupabase(): Promise<{ count: number; error: Error | null }> {
  const client = getSupabaseClient();
  if (!client) {
    return { count: 0, error: new Error('Supabase client is not configured') };
  }

  try {
    const rows = BASELINE_PRODUCTS.map((p, idx) => ({
      ...mapProductToRow(p),
      sort_order: idx + 1,
      is_published: true,
    }));

    const { data, error } = await client
      .from('products')
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: true })
      .select();

    if (error) throw new Error(formatSupabaseError(error));
    return { count: data?.length || rows.length, error: null };
  } catch (err: any) {
    return { count: 0, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
