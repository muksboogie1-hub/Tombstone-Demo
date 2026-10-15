import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Product } from '../types/content';
import { PRODUCTS as BASELINE_PRODUCTS } from '../data/products';

export interface ProductFetchResult {
  data: Product[];
  error: Error | null;
  isMissingTable: boolean;
  isEmptyTable: boolean;
  isOffline: boolean;
}

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
      source: 'Internal Masonry Archive',
      license: 'Proprietary',
      modifications: 'None',
    },
    specifications: row.specifications || {
      finish: 'Polished',
      materialOptions: 'Zimbabwe Black Granite',
      sizingNote: 'Custom sizing available',
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
 * Fetch products from Supabase with full diagnostics
 */
export async function fetchProducts(): Promise<ProductFetchResult> {
  if (!isSupabaseConfigured()) {
    return {
      data: BASELINE_PRODUCTS,
      error: new Error('Supabase credentials not configured in environment'),
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: true,
    };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      const isMissing =
        error.code === '42P01' ||
        Boolean(error.message && error.message.toLowerCase().includes('does not exist'));

      return {
        data: BASELINE_PRODUCTS,
        error: new Error(error.message),
        isMissingTable: isMissing,
        isEmptyTable: false,
        isOffline: !isMissing,
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
    return {
      data: mapped,
      error: null,
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: false,
    };
  } catch (err: any) {
    return {
      data: BASELINE_PRODUCTS,
      error: err instanceof Error ? err : new Error(String(err)),
      isMissingTable: false,
      isEmptyTable: false,
      isOffline: true,
    };
  }
}

/**
 * Admin: Create a new product
 */
export async function createProduct(product: Partial<Product>): Promise<{ data: Product | null; error: Error | null }> {
  try {
    const row = mapProductToRow(product);
    const { data, error } = await supabase.from('products').insert(row).select().single();
    if (error) throw error;
    return { data: mapRowToProduct(data), error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin: Update an existing product
 */
export async function updateProduct(id: string, updates: Partial<Product>): Promise<{ data: Product | null; error: Error | null }> {
  try {
    const row = mapProductToRow(updates);
    delete row.id; // Prevent changing primary key in updates
    const { data, error } = await supabase.from('products').update(row).eq('id', id).select().single();
    if (error) throw error;
    return { data: mapRowToProduct(data), error: null };
  } catch (err: any) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin: Delete a product
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin: Upload product photograph to Supabase Storage bucket 'website-assets'
 */
export async function uploadProductImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `products/${timestamp}-${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from('website-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('website-assets')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Admin utility: Seeds the exact 12 baseline products into Supabase
 * Uses ON CONFLICT DO NOTHING so existing records are never damaged.
 */
export async function seedProductsToSupabase(): Promise<{ count: number; error: Error | null }> {
  try {
    const rows = BASELINE_PRODUCTS.map((p, idx) => ({
      ...mapProductToRow(p),
      sort_order: idx + 1,
      is_published: true,
    }));

    const { data, error } = await supabase
      .from('products')
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: true })
      .select();

    if (error) throw error;
    return { count: data?.length || 0, error: null };
  } catch (err: any) {
    return { count: 0, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
