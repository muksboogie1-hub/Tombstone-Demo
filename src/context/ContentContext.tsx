import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { WebsiteContent, Product } from '../types/content';
import { DEFAULT_WEBSITE_CONTENT } from '../data/defaultContent';
import { PRODUCTS as BASELINE_PRODUCTS } from '../data/products';
import {
  fetchWebsiteContent,
  saveContentSection,
  resetContentSection as apiResetSection,
} from '../services/contentService';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import {
  isSupabaseConfigured,
  getSupabaseConfig,
  resetSupabaseClient,
} from '../lib/supabaseClient';
import { AdminUser, getCurrentAdminUser } from '../services/authService';

export interface ContentContextValue {
  content: WebsiteContent;
  products: Product[];
  currentUser: AdminUser | null;
  setCurrentUser: (user: AdminUser | null) => void;
  isLoading: boolean;
  isOffline: boolean;
  isMissingTables: boolean;
  isEmptyProductsTable: boolean;
  isConfigured: boolean;
  lastError: string | null;
  configSource?: 'build_time_env' | 'browser_storage';
  retryConnection: () => Promise<void>;
  refreshAll: () => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshContent: () => Promise<void>;
  updateContentSection: (section: keyof WebsiteContent, value: any) => Promise<boolean>;
  resetContentSection: (section: keyof WebsiteContent) => Promise<boolean>;
  addProduct: (product: Partial<Product>) => Promise<{ data: Product | null; error: Error | null }>;
  editProduct: (id: string, updates: Partial<Product>) => Promise<{ data: Product | null; error: Error | null }>;
  removeProduct: (id: string) => Promise<{ success: boolean; error: Error | null }>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

// Bounded timeout prevents degraded networks or paused databases from hanging the visitor experience
const BOUNDED_TIMEOUT_MS = 3500;

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<WebsiteContent>(DEFAULT_WEBSITE_CONTENT);
  const [products, setProducts] = useState<Product[]>(BASELINE_PRODUCTS);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const [isLoading, setIsLoading] = useState(!isAdminRoute);
  const [isOffline, setIsOffline] = useState(false);
  const [isMissingTables, setIsMissingTables] = useState(false);
  const [isEmptyProductsTable, setIsEmptyProductsTable] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(() => isSupabaseConfigured());
  const [configSource, setConfigSource] = useState<'build_time_env' | 'browser_storage' | undefined>(
    () => getSupabaseConfig()?.source
  );

  /**
   * Resilient Data Loader with Bounded Timeout:
   * Fetches live database content when available, or seamlessly serves
   * previously cached or verified baseline data.
   */
  const loadInitialData = useCallback(async () => {
    const config = getSupabaseConfig();
    const currentlyConfigured = config !== null;
    setIsConfigured(currentlyConfigured);
    setConfigSource(config?.source);

    // Also check current user session if on or navigating to admin
    try {
      const activeAdmin = await getCurrentAdminUser();
      setCurrentUser(activeAdmin);
    } catch {
      // ignore
    }

    if (!currentlyConfigured) {
      // Supabase credentials not set; seamlessly use cached or verified baseline
      const contentRes = await fetchWebsiteContent();
      const productRes = await fetchProducts();
      setContent(contentRes.data || DEFAULT_WEBSITE_CONTENT);
      setProducts(productRes.data && productRes.data.length > 0 ? productRes.data : BASELINE_PRODUCTS);
      setIsOffline(true);
      setIsMissingTables(false);
      setIsLoading(false);
      return;
    }

    setLastError(null);

    const timeoutPromise = new Promise<{ isTimeout: true }>((resolve) =>
      setTimeout(() => resolve({ isTimeout: true }), BOUNDED_TIMEOUT_MS)
    );

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
        // Degraded or slow mobile connection: seamlessly use cached or baseline data
        console.warn(`[Supabase] Load exceeded ${BOUNDED_TIMEOUT_MS}ms bounded timeout. Serving baseline.`);
        const contentRes = await fetchWebsiteContent();
        const productRes = await fetchProducts();
        setContent(contentRes.data || DEFAULT_WEBSITE_CONTENT);
        setProducts(productRes.data && productRes.data.length > 0 ? productRes.data : BASELINE_PRODUCTS);
        setIsOffline(true);
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
        if (c.isMissingTable) detectedMissingTable = true;
        if (c.isOffline) detectedOffline = true;
        if (c.error) extractedError = c.error.message;
        if (c.data) setContent(c.data);
      } else {
        detectedOffline = true;
        extractedError = contentResult.reason?.message || 'Failed to fetch content';
      }

      // 2. Process Products
      if (productsResult.status === 'fulfilled') {
        const p = productsResult.value;
        if (p.isMissingTable) detectedMissingTable = true;
        if (p.isOffline) detectedOffline = true;
        if (p.isEmptyTable) {
          setIsEmptyProductsTable(true);
          setProducts(BASELINE_PRODUCTS);
        } else if (p.data && p.data.length > 0) {
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
      setLastError(extractedError);
    } catch (err: any) {
      console.warn('[Supabase] Initial load exception, serving baseline:', err);
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

  const retryConnection = useCallback(async () => {
    setIsLoading(true);
    setIsOffline(false);
    setIsMissingTables(false);
    resetSupabaseClient();
    await loadInitialData();
  }, [loadInitialData]);

  const refreshAll = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  const refreshProducts = useCallback(async () => {
    const res = await fetchProducts();
    if (res.data && res.data.length > 0) {
      setProducts(res.data);
      setIsEmptyProductsTable(false);
      setIsOffline(false);
    }
  }, []);

  const refreshContent = useCallback(async () => {
    const res = await fetchWebsiteContent();
    if (res.data) {
      setContent(res.data);
      setIsOffline(false);
    }
  }, []);

  const handleUpdateContentSection = useCallback(
    async (section: keyof WebsiteContent, value: any): Promise<boolean> => {
      setContent((prev) => ({
        ...prev,
        [section]: value,
      }));
      const res = await saveContentSection(section, value, currentUser?.id);
      if (!res.success) {
        console.error(`[ContentContext] Failed to save section "${section}":`, res.error);
        return false;
      }
      return true;
    },
    [currentUser]
  );

  const handleResetContentSection = useCallback(
    async (section: keyof WebsiteContent): Promise<boolean> => {
      const defaultValue = DEFAULT_WEBSITE_CONTENT[section];
      setContent((prev) => ({
        ...prev,
        [section]: defaultValue,
      }));
      const res = await apiResetSection(section, currentUser?.id);
      return res.success;
    },
    [currentUser]
  );

  const handleAddProduct = useCallback(
    async (product: Partial<Product>) => {
      const res = await createProduct(product);
      if (res.data) {
        setProducts((prev) => [res.data!, ...prev.filter((p) => p.id !== res.data!.id)]);
        setIsEmptyProductsTable(false);
      }
      return res;
    },
    []
  );

  const handleEditProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const res = await updateProduct(id, updates);
      if (res.data) {
        setProducts((prev) => prev.map((p) => (p.id === id ? res.data! : p)));
      }
      return res;
    },
    []
  );

  const handleRemoveProduct = useCallback(
    async (id: string) => {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
      return res;
    },
    []
  );

  return (
    <ContentContext.Provider
      value={{
        content,
        products,
        currentUser,
        setCurrentUser,
        isLoading,
        isOffline,
        isMissingTables,
        isEmptyProductsTable,
        isConfigured,
        lastError,
        configSource,
        retryConnection,
        refreshAll,
        refreshProducts,
        refreshContent,
        updateContentSection: handleUpdateContentSection,
        resetContentSection: handleResetContentSection,
        addProduct: handleAddProduct,
        editProduct: handleEditProduct,
        removeProduct: handleRemoveProduct,
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
