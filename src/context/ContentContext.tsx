import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { WebsiteContent, Product } from '../types/content';
import { DEFAULT_WEBSITE_CONTENT } from '../data/defaultContent';
import { PRODUCTS as BASELINE_PRODUCTS } from '../data/products';
import { fetchWebsiteContent, saveContentSection, resetContentSection as apiResetSection } from '../services/contentService';
import { fetchProducts } from '../services/productService';
import { isSupabaseConfigured, reinitializeClient, getSupabaseConfig } from '../lib/supabaseClient';

interface ContentContextValue {
  content: WebsiteContent;
  products: Product[];
  isLoading: boolean;
  isOffline: boolean;
  isMissingTables: boolean;
  isEmptyProductsTable: boolean;
  isConfigured: boolean;
  lastError: string | null;
  configSource?: 'build_env' | 'window_env' | 'local_storage';
  retryConnection: () => Promise<void>;
  updateContentSection: (section: keyof WebsiteContent, value: any) => Promise<boolean>;
  resetContentSection: (section: keyof WebsiteContent) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const BOUNDED_TIMEOUT_MS = 4000;

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<WebsiteContent>(DEFAULT_WEBSITE_CONTENT);
  const [products, setProducts] = useState<Product[]>(BASELINE_PRODUCTS);

  // Determine if current route is an admin route that should bypass public loading screen
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const [isLoading, setIsLoading] = useState(!isAdminRoute);
  const [isOffline, setIsOffline] = useState(false);
  const [isMissingTables, setIsMissingTables] = useState(false);
  const [isEmptyProductsTable, setIsEmptyProductsTable] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(() => isSupabaseConfigured());
  const [configSource, setConfigSource] = useState<'build_env' | 'window_env' | 'local_storage' | undefined>(
    () => getSupabaseConfig()?.source
  );

  /**
   * Dual-Resource Loader with Bounded Timeout & Genuine Error Reporting
   */
  const loadInitialData = useCallback(async () => {
    const config = getSupabaseConfig();
    const currentlyConfigured = config !== null;
    setIsConfigured(currentlyConfigured);
    setConfigSource(config?.source);

    if (!currentlyConfigured) {
      // Supabase credentials not present; use verified baseline
      setContent(DEFAULT_WEBSITE_CONTENT);
      setProducts(BASELINE_PRODUCTS);
      setIsOffline(true);
      setIsMissingTables(false);
      setLastError('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing from environment.');
      setIsLoading(false);
      return;
    }

    setLastError(null);

    // Timeout promise for bounding initial wait time
    const timeoutPromise = new Promise<{ isTimeout: true }>((resolve) =>
      setTimeout(() => resolve({ isTimeout: true }), BOUNDED_TIMEOUT_MS)
    );

    // Dual-resource concurrent fetch promise
    const fetchDualResources = async () => {
      const [contentResult, productsResult] = await Promise.allSettled([
        fetchWebsiteContent(),
        fetchProducts(),
      ]);
      return { isTimeout: false as const, contentResult, productsResult };
    };

    try {
      const raceResult = await Promise.race([fetchDualResources(), timeoutPromise]);

      if (raceResult.isTimeout) {
        // Degraded or slow mobile connection; render verified baseline with offline banner
        console.warn(`[Supabase] Dual load exceeded ${BOUNDED_TIMEOUT_MS}ms bounded timeout. Proceeding with baseline.`);
        setContent(DEFAULT_WEBSITE_CONTENT);
        setProducts(BASELINE_PRODUCTS);
        setIsOffline(true);
        setLastError(`Connection timed out after ${BOUNDED_TIMEOUT_MS}ms. Supabase project may be paused or unreachable.`);
        setIsLoading(false);
        return;
      }

      const { contentResult, productsResult } = raceResult;
      let detectedMissingTable = false;
      let detectedOffline = false;
      let extractedError: string | null = null;

      // 1. Process Content
      if (contentResult.status === 'fulfilled') {
        const c = contentResult.value;
        if (c.isMissingTable) {
          detectedMissingTable = true;
          if (c.error) extractedError = c.error.message;
        }
        if (c.isOffline) {
          detectedOffline = true;
          if (c.error) extractedError = c.error.message;
        }
        if (c.data && !c.isOffline) {
          setContent(c.data);
        }
      } else {
        detectedOffline = true;
        extractedError = contentResult.reason?.message || 'Failed to fetch content';
      }

      // 2. Process Products
      if (productsResult.status === 'fulfilled') {
        const p = productsResult.value;
        if (p.isMissingTable) {
          detectedMissingTable = true;
          if (p.error) extractedError = p.error.message;
        }
        if (p.isOffline) {
          detectedOffline = true;
          if (p.error) extractedError = p.error.message;
        }
        if (p.isEmptyTable) {
          setIsEmptyProductsTable(true);
          setProducts(BASELINE_PRODUCTS);
        } else if (p.data && p.data.length > 0 && !p.isOffline) {
          setIsEmptyProductsTable(false);
          setProducts(p.data);
        }
      } else {
        detectedOffline = true;
        if (!extractedError) {
          extractedError = productsResult.reason?.message || 'Failed to fetch products';
        }
      }

      setIsMissingTables(detectedMissingTable);
      setIsOffline(detectedOffline);

      if (detectedMissingTable) {
        setLastError(
          extractedError
            ? `Table migration needed: ${extractedError}`
            : 'Supabase database tables are not initialized. Run the SQL migration in your Supabase Dashboard.'
        );
      } else if (detectedOffline) {
        setLastError(
          extractedError
            ? `Supabase error: ${extractedError}`
            : 'Could not connect to Supabase. Check project status or network connection.'
        );
      } else {
        setLastError(null);
      }
    } catch (err: any) {
      console.error('[Supabase] Initial dual-load exception:', err);
      setContent(DEFAULT_WEBSITE_CONTENT);
      setProducts(BASELINE_PRODUCTS);
      setIsOffline(true);
      setLastError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /**
   * Genuine retry function callable by user or retry buttons
   */
  const retryConnection = useCallback(async () => {
    setIsLoading(true);
    setIsOffline(false);
    setIsMissingTables(false);
    // Reinitialize the Supabase client so any runtime credentials or environment changes take effect
    reinitializeClient();
    await loadInitialData();
  }, [loadInitialData]);

  /**
   * Refreshes only products from database
   */
  const refreshProducts = useCallback(async () => {
    const res = await fetchProducts();
    if (!res.error && res.data && res.data.length > 0) {
      setProducts(res.data);
      setIsEmptyProductsTable(false);
      setIsOffline(false);
    }
  }, []);

  /**
   * Refreshes only content from database
   */
  const refreshContent = useCallback(async () => {
    const res = await fetchWebsiteContent();
    if (!res.error && res.data) {
      setContent(res.data);
      setIsOffline(false);
    }
  }, []);

  /**
   * Updates a section both locally and in Supabase
   */
  const updateContentSection = useCallback(
    async (section: keyof WebsiteContent, value: any): Promise<boolean> => {
      // Optimistic update
      setContent((prev) => ({
        ...prev,
        [section]: value,
      }));

      const res = await saveContentSection(section, value);
      if (!res.success) {
        console.error(`[ContentContext] Failed to persist section "${section}":`, res.error);
        return false;
      }
      return true;
    },
    []
  );

  /**
   * Resets a section back to default
   */
  const resetContentSection = useCallback(
    async (section: keyof WebsiteContent): Promise<boolean> => {
      const defaultValue = DEFAULT_WEBSITE_CONTENT[section];
      setContent((prev) => ({
        ...prev,
        [section]: defaultValue,
      }));

      const res = await apiResetSection(section);
      return res.success;
    },
    []
  );

  return (
    <ContentContext.Provider
      value={{
        content,
        products,
        isLoading,
        isOffline,
        isMissingTables,
        isEmptyProductsTable,
        isConfigured,
        lastError,
        configSource,
        retryConnection,
        updateContentSection,
        resetContentSection,
        refreshProducts,
        refreshContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
