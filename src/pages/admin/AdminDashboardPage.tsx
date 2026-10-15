import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  FileText,
  Package,
  Image as ImageIcon,
  Database,
  LogOut,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  RefreshCw,
  Upload,
  Copy,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Settings,
  Sparkles,
} from 'lucide-react';
import { isSupabaseConfigured, testSupabaseConnection, getSupabaseConfigStatus } from '../../lib/supabaseClient';
import { useContent } from '../../context/ContentContext';
import { WebsiteContent, Product } from '../../types/content';
import {
  uploadProductImage,
  seedProductsToSupabase,
} from '../../services/productService';
import { seedContentToSupabase } from '../../services/contentService';
import {
  adminSignOut,
  getCurrentAdminUser,
  fetchAdminTeam,
  createAdminMember,
  toggleAdminStatus,
  deleteAdminMember,
  AdminUser,
  AdminMember,
} from '../../services/authService';
import { SEOHead } from '../../components/common/SEOHead';
import { ConfigureCredentialsModal } from '../../components/common/ConfigureCredentialsModal';

type Tab = 'content' | 'products' | 'media' | 'team' | 'system';
type ContentSection = keyof WebsiteContent;

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const {
    content,
    products,
    updateContentSection,
    resetContentSection,
    refreshProducts,
    refreshContent,
    addProduct,
    editProduct,
    removeProduct,
    isOffline,
    isMissingTables,
    isConfigured,
  } = useContent();

  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [activeSection, setActiveSection] = useState<ContentSection>('hero');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form states for content editor
  const [formData, setFormData] = useState<any>(content[activeSection] || {});
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Product modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Media tab states
  const [mediaUploadLoading, setMediaUploadLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Team tab states
  const [teamMembers, setTeamMembers] = useState<AdminMember[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('administrator');
  const [teamLoading, setTeamLoading] = useState(false);

  // System & Credentials states
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentAdminUser();
        if (!user) {
          navigate('/admin/login');
          return;
        }
        setAdminUser(user);
      } catch {
        navigate('/admin/login');
      } finally {
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [navigate]);

  // Sync formData when activeSection changes or content loads
  useEffect(() => {
    if (content[activeSection]) {
      setFormData(content[activeSection]);
    }
  }, [activeSection, content]);

  // Load team members when team tab is selected
  useEffect(() => {
    if (activeTab === 'team') {
      loadTeam();
    }
  }, [activeTab]);

  const loadTeam = async () => {
    setTeamLoading(true);
    try {
      const list = await fetchAdminTeam();
      setTeamMembers(list);
    } catch (err: any) {
      console.error('Failed to load admin team:', err);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleSignOut = async () => {
    await adminSignOut();
    navigate('/admin/login');
  };

  // Content form changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSection = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const success = await updateContentSection(activeSection, formData);
      if (success) {
        setStatusMessage({
          type: 'success',
          text: `Section "${String(activeSection).toUpperCase()}" updated live and published to the website.`,
        });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({
          type: 'error',
          text: `Failed to save changes. Your work has been preserved locally. Check database connection in the System tab.`,
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error occurred while saving content section.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSection = async () => {
    if (!window.confirm(`Reset "${String(activeSection)}" to factory stonework default copy?`)) {
      return;
    }
    setIsSaving(true);
    try {
      const success = await resetContentSection(activeSection);
      if (success) {
        setStatusMessage({
          type: 'success',
          text: `Section "${String(activeSection)}" reset to verified baseline default.`,
        });
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Product management actions
  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: `ts-${Date.now().toString().slice(-4)}`,
      name: '',
      slug: '',
      category: 'Tombstones',
      shortDescription: '',
      longDescription: '',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
      imageAlt: '',
      featured: false,
      priceDisplayMode: 'quotation_only',
      priceAmount: null,
      priceCurrency: 'USD',
      priceNote: 'Quotation upon cemetery dimension verification',
      isPublished: true,
      sortOrder: products.length + 1,
      specifications: {
        finish: 'Polished face with honed kerb borders',
        materialOptions: 'Zimbabwe Black Granite',
        sizingNote: 'Standard single plot dimensions or custom family plot',
      },
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct || !editingProduct.name || !editingProduct.category) {
      alert('Please fill in product name and select a valid category.');
      return;
    }

    setIsSavingProduct(true);
    try {
      const isNew = !products.some((p) => p.id === editingProduct.id);
      if (isNew) {
        const { error } = await addProduct(editingProduct);
        if (error) throw error;
      } else {
        const { error } = await editProduct(editingProduct.id!, editingProduct);
        if (error) throw error;
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      await refreshProducts();
      setStatusMessage({
        type: 'success',
        text: `Product "${editingProduct.name}" saved successfully and published to catalogue!`,
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the live catalogue?`)) {
      return;
    }
    try {
      const { error } = await removeProduct(id);
      if (error) throw error;
      await refreshProducts();
      setStatusMessage({
        type: 'success',
        text: `Product "${name}" deleted from catalogue.`,
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    try {
      const { url, error } = await uploadProductImage(file);
      if (error) {
        console.warn('Storage upload error, using local preview:', error);
      }
      if (url) {
        setEditingProduct((prev) => (prev ? { ...prev, imageUrl: url } : prev));
      }
    } catch (err: any) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaUploadLoading(true);
    try {
      const { url, error } = await uploadProductImage(file);
      if (url) {
        setUploadedUrl(url);
        setStatusMessage({
          type: 'success',
          text: error
            ? 'Image uploaded for preview. Note: To persist globally, ensure Supabase Storage bucket "website-assets" is created.'
            : 'Image successfully uploaded to Supabase Storage bucket "website-assets"!',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Upload failed: ${err.message}` });
    } finally {
      setMediaUploadLoading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Team management
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setTeamLoading(true);
    try {
      const res = await createAdminMember(newAdminEmail.trim(), newAdminRole);
      if (res.success) {
        setNewAdminEmail('');
        await loadTeam();
        setStatusMessage({
          type: 'success',
          text: `Administrator ${newAdminEmail} added to approved admin allowlist!`,
        });
      } else {
        alert(res.error || 'Failed to add administrator');
      }
    } finally {
      setTeamLoading(false);
    }
  };

  const handleToggleAdminStatus = async (id: string, currentActive: boolean) => {
    try {
      const res = await toggleAdminStatus(id, !currentActive);
      if (res.success) {
        await loadTeam();
      } else {
        alert(res.error || 'Failed to update administrator status');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (!window.confirm(`Revoke administrator privileges for ${email}?`)) return;
    try {
      const res = await deleteAdminMember(id);
      if (res.success) {
        await loadTeam();
      } else {
        alert(res.error || 'Failed to revoke administrator');
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  // One-click seeding
  const handleOneClickSeed = async () => {
    if (!window.confirm('Run deterministic seed? This will insert all 12 baseline products and website copy into Supabase with ON CONFLICT DO NOTHING (safe).')) {
      return;
    }
    setIsSaving(true);
    try {
      const prodRes = await seedProductsToSupabase();
      const contRes = await seedContentToSupabase();
      if (prodRes.error || contRes.error) {
        alert(`Seed error: ${prodRes.error?.message || contRes.error?.message}`);
      } else {
        alert(`Success! Seeded ${prodRes.count} products and ${contRes.count} content sections into Supabase.`);
        await refreshProducts();
        await refreshContent();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestDatabase = async () => {
    setIsTestingConn(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
    } finally {
      setIsTestingConn(false);
    }
  };

  const handleCopySqlScript = () => {
    const sql = `-- ============================================================================
-- VELQUARATH STONEWORKS: COMPLETE PRODUCTION HARDENED SUPABASE MIGRATION
-- Paste this entire script into your Supabase Dashboard -> SQL Editor and click 'Run'.
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Public Storage Bucket for Website Assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-assets',
  'website-assets',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
) ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Create Table: admin_users (Allows pre-seeding owners before they register)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'administrator',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Table: website_content
CREATE TABLE IF NOT EXISTS public.website_content (
  key TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  value JSONB NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create Table: products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Tombstones', 'Countertops & Tables', 'Window Sills')),
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  image_attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  price_display_mode TEXT NOT NULL DEFAULT 'quotation_only' CHECK (price_display_mode IN ('quotation_only', 'fixed_price', 'starting_from')),
  price_amount NUMERIC(10, 2),
  price_currency TEXT NOT NULL DEFAULT 'USD' CHECK (price_currency IN ('USD', 'ZiG')),
  price_note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Security Definer Authorization Helper (Zero RLS Recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE (
            user_id = auth.uid()
            OR (
                (auth.jwt() ->> 'email') IS NOT NULL
                AND LOWER(email) = LOWER(auth.jwt() ->> 'email')
            )
        )
        AND is_active = TRUE
    );
END;
$$;

-- 6. Self-healing Sync RPC for Authenticated Clients
CREATE OR REPLACE FUNCTION public.sync_current_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_affected_rows integer;
BEGIN
    IF auth.uid() IS NULL OR (auth.jwt() ->> 'email') IS NULL THEN
        RETURN FALSE;
    END IF;
    UPDATE public.admin_users
    SET user_id = auth.uid(), updated_at = NOW()
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
      AND (user_id IS NULL OR user_id <> auth.uid())
      AND is_active = TRUE;
    GET DIAGNOSTICS v_affected_rows = ROW_COUNT;
    RETURN v_affected_rows > 0;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.sync_current_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.sync_current_admin() TO authenticated;

-- 7. Trigger: Automatically Link Registered Supabase Auth User ID to Whitelist
CREATE OR REPLACE FUNCTION public.handle_admin_auth_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE public.admin_users
    SET user_id = NEW.id, updated_at = NOW()
    WHERE LOWER(email) = LOWER(NEW.email)
      AND is_active = TRUE;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin_sync ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_sync
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_admin_auth_sync();

-- 8. Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 9. Public Read Policies
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view website content" ON public.website_content;
CREATE POLICY "Public can view website content" ON public.website_content FOR SELECT USING (true);

-- 10. Admin Write Policies
DROP POLICY IF EXISTS "Admin full access to products" ON public.products;
CREATE POLICY "Admin full access to products" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access to website content" ON public.website_content;
CREATE POLICY "Admin full access to website content" ON public.website_content FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin view own or all admin_users" ON public.admin_users;
CREATE POLICY "Admin view own or all admin_users" ON public.admin_users FOR SELECT USING (public.is_admin() OR user_id = auth.uid() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Admin modify admin_users" ON public.admin_users;
CREATE POLICY "Admin modify admin_users" ON public.admin_users FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 11. Storage Policies
DROP POLICY IF EXISTS "Public read website assets" ON storage.objects;
CREATE POLICY "Public read website assets" ON storage.objects FOR SELECT USING (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Admin upload website assets" ON storage.objects;
CREATE POLICY "Admin upload website assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update website assets" ON storage.objects;
CREATE POLICY "Admin update website assets" ON storage.objects FOR UPDATE USING (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete website assets" ON storage.objects;
CREATE POLICY "Admin delete website assets" ON storage.objects FOR DELETE USING (bucket_id = 'website-assets' AND public.is_admin());

-- 12. Pre-seed Owner Emails into Whitelist
INSERT INTO public.admin_users (email, role, is_active)
VALUES ('velquarath@gmail.com', 'owner', TRUE)
ON CONFLICT (email) DO UPDATE SET is_active = TRUE;

INSERT INTO public.admin_users (email, role, is_active)
VALUES ('codictobi@gmail.com', 'owner', TRUE)
ON CONFLICT (email) DO UPDATE SET is_active = TRUE;

-- Link any already-created auth users
UPDATE public.admin_users a
SET user_id = u.id, updated_at = NOW()
FROM auth.users u
WHERE LOWER(a.email) = LOWER(u.email)
  AND (a.user_id IS NULL OR a.user_id <> u.id)
  AND a.is_active = TRUE;
`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121415] text-[#F5F1E8] flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs text-[#B79A68]">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Validating Administrator Credentials...</span>
        </div>
      </div>
    );
  }

  const filteredProducts = productCategoryFilter === 'all'
    ? products
    : products.filter((p) => p.category === productCategoryFilter);

  const configStatus = getSupabaseConfigStatus();

  return (
    <div className="min-h-screen bg-[#121415] text-[#F5F1E8] flex flex-col">
      <SEOHead
        title="Admin Control Center | Velquarath Stoneworks"
        description="Executive dashboard for managing tombstones, memorials, countertops, and site content."
        canonicalPath="/admin"
      />

      {/* Top Header */}
      <header className="bg-[#17191B] border-b border-[#2D3237] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#B79A68]/60 bg-[#1D2023] flex items-center justify-center">
              <span className="font-serif font-bold text-xs text-[#B79A68]">V</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-base sm:text-lg font-bold text-[#F5F1E8]">
                  Velquarath Stoneworks
                </h1>
                <span className="bg-[#B79A68]/20 text-[#B79A68] border border-[#B79A68]/40 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded">
                  Admin Portal
                </span>
              </div>
              <p className="text-[10px] text-[#8E8B82]">
                Harare, Zimbabwe · Granite Masonry &amp; Memorial Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Active user status badge */}
            <div className="flex items-center gap-2 bg-[#121415] border border-[#2D3237] px-2.5 py-1 rounded text-[11px]">
              <Shield className="w-3.5 h-3.5 text-[#B79A68]" />
              <span className="text-[#DFD9CB] font-medium">
                {adminUser?.email || 'Administrator'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#252A2E] text-[#B79A68] px-1.5 py-0.5 rounded">
                {adminUser?.role || 'Admin'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  adminUser?.isSupabaseAuth ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                title={adminUser?.isSupabaseAuth ? 'Live Supabase Auth' : 'Preview Sandbox Mode'}
              />
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#B9B5AC] hover:text-[#F5F1E8] px-2.5 py-1 rounded bg-[#1D2023] hover:bg-[#252A2E] border border-[#2D3237] transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-[#B79A68]" />
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 px-2.5 py-1 rounded bg-[#1D2023] hover:bg-red-950/30 border border-red-900/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 border-t border-[#252A2E]">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'content'
                ? 'border-[#B79A68] text-[#B79A68] bg-[#1D2023]'
                : 'border-transparent text-[#8E8B82] hover:text-[#DFD9CB]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Content Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#B79A68] text-[#B79A68] bg-[#1D2023]'
                : 'border-transparent text-[#8E8B82] hover:text-[#DFD9CB]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products &amp; Memorials ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'media'
                ? 'border-[#B79A68] text-[#B79A68] bg-[#1D2023]'
                : 'border-transparent text-[#8E8B82] hover:text-[#DFD9CB]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Storage &amp; Media</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'team'
                ? 'border-[#B79A68] text-[#B79A68] bg-[#1D2023]'
                : 'border-transparent text-[#8E8B82] hover:text-[#DFD9CB]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Admin Team</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'system'
                ? 'border-[#B79A68] text-[#B79A68] bg-[#1D2023]'
                : 'border-transparent text-[#8E8B82] hover:text-[#DFD9CB]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database &amp; Diagnostics</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status Toast */}
        {statusMessage && (
          <div
            role="status"
            className={`p-3.5 rounded border text-xs flex items-center gap-2.5 shadow-lg ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/70 border-red-500/50 text-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: WEBSITE CONTENT EDITOR */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar list of sections */}
            <div className="lg:col-span-1 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#8E8B82] font-semibold px-2">
                Editable Sections
              </span>
              <div className="bg-[#1D2023] border border-[#2D3237] rounded-lg p-1.5 space-y-1">
                {[
                  { key: 'hero', label: 'Hero Header' },
                  { key: 'announcement', label: 'Announcement Bar' },
                  { key: 'about', label: 'About & Story' },
                  { key: 'craftsmanship', label: 'Granite Craftsmanship' },
                  { key: 'contact', label: 'Contact & WhatsApp' },
                  { key: 'footer', label: 'Footer & Inscriptions' },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveSection(s.key as ContentSection)}
                    className={`w-full text-left px-3 py-2.5 rounded text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      activeSection === s.key
                        ? 'bg-[#B79A68] text-[#17191B] font-bold shadow'
                        : 'text-[#DFD9CB] hover:bg-[#252A2E]'
                    }`}
                  >
                    <span>{s.label}</span>
                    <Eye className={`w-3.5 h-3.5 ${activeSection === s.key ? 'text-[#17191B]' : 'text-[#8E8B82]'}`} />
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-[#17191B] border border-[#2D3237] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B79A68] block">
                  Live Sync Guarantee
                </span>
                <p className="text-[11px] text-[#8E8B82] leading-relaxed">
                  Saving any section updates the Supabase record immediately. Public visitors receive the updated text dynamically on page refresh without rebuilding or committing code.
                </p>
              </div>
            </div>

            {/* Editor Workspace */}
            <div className="lg:col-span-3 bg-[#1D2023] border border-[#2D3237] p-6 rounded-lg space-y-6">
              <div className="flex items-center justify-between border-b border-[#2D3237] pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-bold">
                    Editing Section
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#F5F1E8] uppercase tracking-wide">
                    {String(activeSection)}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetSection}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 text-xs text-[#8E8B82] hover:text-[#DFD9CB] px-3 py-1.5 rounded border border-[#3E4348] hover:border-[#8E8B82] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Default</span>
                  </button>

                  <button
                    onClick={handleSaveSection}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17191B] bg-[#B79A68] hover:bg-[#CBB17F] px-4 py-1.5 rounded transition-colors shadow cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Publishing...' : 'Save & Publish Live'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Section Forms */}
              {activeSection === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                      Eyebrow / Badge Text
                    </label>
                    <input
                      type="text"
                      value={formData.eyebrow || ''}
                      onChange={(e) => handleInputChange('eyebrow', e.target.value)}
                      className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                      Main Headline
                    </label>
                    <input
                      type="text"
                      value={formData.headline || ''}
                      onChange={(e) => handleInputChange('headline', e.target.value)}
                      className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none font-serif text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                      Subheadline / Supporting Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={formData.subheadline || ''}
                      onChange={(e) => handleInputChange('subheadline', e.target.value)}
                      className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'announcement' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ann-enabled"
                      checked={formData.enabled !== false}
                      onChange={(e) => handleInputChange('enabled', e.target.checked)}
                      className="accent-[#B79A68]"
                    />
                    <label htmlFor="ann-enabled" className="text-xs text-[#DFD9CB] font-semibold cursor-pointer">
                      Display Announcement Bar on Public Website
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                      Announcement Banner Text
                    </label>
                    <input
                      type="text"
                      value={formData.text || ''}
                      onChange={(e) => handleInputChange('text', e.target.value)}
                      className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                        Call-to-Action Link Text
                      </label>
                      <input
                        type="text"
                        value={formData.linkText || ''}
                        onChange={(e) => handleInputChange('linkText', e.target.value)}
                        className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                        Target Link URL
                      </label>
                      <input
                        type="text"
                        value={formData.linkUrl || ''}
                        onChange={(e) => handleInputChange('linkUrl', e.target.value)}
                        className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                        Telephone Display
                      </label>
                      <input
                        type="text"
                        value={formData.phoneDisplay || ''}
                        onChange={(e) => handleInputChange('phoneDisplay', e.target.value)}
                        className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                        WhatsApp Digits (with Country Code)
                      </label>
                      <input
                        type="text"
                        value={formData.whatsappDigits || ''}
                        onChange={(e) => handleInputChange('whatsappDigits', e.target.value)}
                        placeholder="263786967793"
                        className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                      Physical Masonry Workshop Address
                    </label>
                    <input
                      type="text"
                      value={formData.physicalAddress || ''}
                      onChange={(e) => handleInputChange('physicalAddress', e.target.value)}
                      className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {activeSection !== 'hero' && activeSection !== 'announcement' && activeSection !== 'contact' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#8E8B82]">
                    Structured JSON properties for this section:
                  </p>
                  <textarea
                    rows={12}
                    value={JSON.stringify(formData, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFormData(parsed);
                      } catch {
                        // wait for valid JSON
                      }
                    }}
                    className="w-full font-mono text-xs bg-[#17191B] border border-[#2D3237] p-3 text-[#F5F1E8] rounded focus:border-[#B79A68] focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS & MEMORIAL CATALOGUE */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1D2023] border border-[#2D3237] p-4 rounded-lg">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#8E8B82] uppercase tracking-wider">
                  Filter Category:
                </span>
                {['all', 'Tombstones', 'Countertops & Tables', 'Window Sills'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                      productCategoryFilter === cat
                        ? 'bg-[#B79A68] text-[#17191B] font-bold'
                        : 'bg-[#17191B] text-[#DFD9CB] hover:bg-[#252A2E]'
                    }`}
                  >
                    {cat === 'all' ? 'All Products' : cat}
                  </button>
                ))}
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17191B] bg-[#B79A68] hover:bg-[#CBB17F] py-2 px-4 rounded transition-colors shadow cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#1D2023] border border-[#2D3237] rounded-lg overflow-hidden flex flex-col group hover:border-[#B79A68]/40 transition-all shadow-md"
                >
                  <div className="relative h-48 bg-[#17191B] overflow-hidden">
                    <img
                      src={p.imageUrl}
                      alt={p.imageAlt || p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <span className="bg-[#121415]/80 backdrop-blur-sm border border-[#3E4348] text-[#DFD9CB] text-[10px] font-semibold px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      {p.featured && (
                        <span className="bg-[#B79A68] text-[#17191B] text-[10px] font-bold px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    {!p.isPublished && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-900/80 text-white text-xs font-bold px-3 py-1 rounded">
                          Unpublished (Draft)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#F5F1E8]">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#8E8B82] line-clamp-2 mt-1">
                        {p.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#252A2E] pt-3 text-xs">
                      <span className="text-[#B79A68] font-semibold">
                        {p.priceDisplayMode === 'fixed_price' && p.priceAmount
                          ? `$${p.priceAmount} ${p.priceCurrency}`
                          : p.priceDisplayMode === 'starting_from' && p.priceAmount
                          ? `From $${p.priceAmount} ${p.priceCurrency}`
                          : 'Quotation Only'}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 rounded bg-[#252A2E] hover:bg-[#343A40] text-[#DFD9CB] transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#B79A68]" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded bg-[#252A2E] hover:bg-red-950/40 text-red-400 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MEDIA & STORAGE BUCKET */}
        {/* ========================================================================= */}
        {activeTab === 'media' && (
          <div className="bg-[#1D2023] border border-[#2D3237] p-6 rounded-lg space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-bold">
                Supabase Storage
              </span>
              <h2 className="font-serif text-xl font-bold text-[#F5F1E8]">
                Stonework Photograph &amp; Asset Management
              </h2>
              <p className="text-xs text-[#8E8B82] mt-1">
                Upload stone memorials, Zimbabwe black granite slabs, and texture photographs to bucket <code>website-assets</code>.
              </p>
            </div>

            <div className="border-2 border-dashed border-[#2D3237] hover:border-[#B79A68] rounded-xl p-8 text-center space-y-4 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#17191B] border border-[#B79A68]/40 mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#B79A68]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#F5F1E8]">
                  Select stone photography or slab asset to upload
                </p>
                <p className="text-xs text-[#8E8B82]">
                  JPEG, PNG, WebP up to 50MB. Uploads directly to Supabase Storage with instant public URL generation.
                </p>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded transition-colors cursor-pointer shadow">
                  <Upload className="w-4 h-4" />
                  <span>{mediaUploadLoading ? 'Uploading Asset...' : 'Choose File to Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaUpload}
                    disabled={mediaUploadLoading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {uploadedUrl && (
              <div className="bg-[#17191B] border border-[#2D3237] p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#B79A68] uppercase tracking-wider">
                    Uploaded Asset Ready
                  </span>
                  <button
                    onClick={() => handleCopyUrl(uploadedUrl)}
                    className="inline-flex items-center gap-1 text-xs text-[#DFD9CB] hover:text-white bg-[#252A2E] px-2.5 py-1 rounded transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#B79A68]" />
                    <span>{copiedUrl ? 'Copied!' : 'Copy Public URL'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={uploadedUrl}
                    alt="Uploaded preview"
                    className="w-20 h-20 object-cover rounded border border-[#2D3237]"
                  />
                  <input
                    type="text"
                    readOnly
                    value={uploadedUrl}
                    className="flex-1 bg-[#121415] border border-[#2D3237] text-xs text-[#8E8B82] p-2 rounded font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ADMIN TEAM & STAFF ACCESS */}
        {/* ========================================================================= */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="bg-[#1D2023] border border-[#2D3237] p-6 rounded-lg space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-bold">
                  Access Control
                </span>
                <h2 className="font-serif text-xl font-bold text-[#F5F1E8]">
                  Authorized Administrators &amp; Stonemason Roster
                </h2>
                <p className="text-xs text-[#8E8B82] mt-1">
                  Manage which accounts have Row Level Security write privileges in <code>public.admin_users</code>.
                </p>
              </div>

              {/* Add Admin Form */}
              <form onSubmit={handleAddTeamMember} className="bg-[#17191B] border border-[#2D3237] p-4 rounded-lg space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#DFD9CB] flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#B79A68]" />
                  <span>Authorize New Administrator</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="email"
                      required
                      placeholder="colleague@domain.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full bg-[#121415] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                    />
                  </div>
                  <div>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value)}
                      className="w-full bg-[#121415] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                    >
                      <option value="administrator">Administrator</option>
                      <option value="owner">Owner / Principal</option>
                      <option value="editor">Catalogue Editor</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={teamLoading}
                  className="inline-flex items-center gap-1.5 bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] font-bold text-xs uppercase tracking-wider py-2 px-4 rounded transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Allowlist</span>
                </button>
              </form>

              {/* Team list */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#8E8B82] uppercase tracking-wider">
                  Active Team Members ({teamMembers.length})
                </span>
                <div className="divide-y divide-[#252A2E] bg-[#17191B] border border-[#2D3237] rounded-lg overflow-hidden">
                  {teamMembers.map((m) => (
                    <div key={m.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#252A2E] flex items-center justify-center font-bold text-xs text-[#B79A68]">
                          {m.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#F5F1E8]">{m.email}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#202428] text-[#B79A68] px-1.5 py-0.5 rounded">
                              {m.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8E8B82]">
                            Status: {m.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleAdminStatus(m.id, m.isActive)}
                          className={`text-xs px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                            m.isActive
                              ? 'bg-[#252A2E] hover:bg-[#343A40] text-[#DFD9CB]'
                              : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                          }`}
                        >
                          {m.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(m.id, m.email)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
                          title="Revoke admin access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SYSTEM DIAGNOSTICS & CREDENTIALS */}
        {/* ========================================================================= */}
        {activeTab === 'system' && (
          <div className="bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-bold">
                Private Admin Diagnostics
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#F5F1E8]">
                Supabase Database &amp; System Health
              </h2>
              <p className="text-xs text-[#8E8B82] mt-1">
                Technical connection health, environment configuration, and database seeding. Kept strictly inside the private admin portal.
              </p>
            </div>

            {/* Diagnostic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#17191B] border border-[#2D3237] p-5 rounded space-y-2">
                <span className="text-xs font-semibold text-[#8E8B82] uppercase tracking-wider">
                  Database Connection
                </span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="text-sm font-bold text-[#F5F1E8]">
                    {isOffline ? 'Local Baseline / Degraded' : 'Connected to Supabase Live'}
                  </span>
                </div>
                <p className="text-[11px] text-[#8E8B82]">
                  {isOffline
                    ? 'Public site seamlessly serves verified masonry portfolio without customer disruption.'
                    : 'Real-time PostgreSQL read/write active with Row Level Security.'}
                </p>
              </div>

              <div className="bg-[#17191B] border border-[#2D3237] p-5 rounded space-y-2">
                <span className="text-xs font-semibold text-[#8E8B82] uppercase tracking-wider">
                  Credential Source
                </span>
                <div className="text-sm font-bold text-[#F5F1E8]">
                  {configStatus.isConfigured
                    ? configStatus.source === 'build_time_env'
                      ? 'Environment Variables'
                      : 'Browser Runtime Config'
                    : 'Not Configured'}
                </div>
                <p className="text-[11px] text-[#8E8B82] font-mono break-all">
                  {configStatus.url || 'No Supabase URL set'}
                </p>
              </div>

              <div className="bg-[#17191B] border border-[#2D3237] p-5 rounded space-y-2">
                <span className="text-xs font-semibold text-[#8E8B82] uppercase tracking-wider">
                  Table Status
                </span>
                <div className="text-sm font-bold text-[#F5F1E8]">
                  {isMissingTables ? 'Tables Pending (42P01)' : 'Tables Initialized'}
                </div>
                <p className="text-[11px] text-[#8E8B82]">
                  Products: {products.length} · Content Sections: 6
                </p>
              </div>
            </div>

            {/* Connection Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleTestDatabase}
                disabled={isTestingConn}
                className="inline-flex items-center gap-2 bg-[#252A2E] hover:bg-[#343A40] text-[#B79A68] hover:text-[#CBB17F] border border-[#B79A68]/40 px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingConn ? 'animate-spin' : ''}`} />
                <span>{isTestingConn ? 'Testing Live Connection...' : 'Test Database Connection'}</span>
              </button>

              <button
                onClick={() => setShowConfigModal(true)}
                className="inline-flex items-center gap-2 bg-[#252A2E] hover:bg-[#343A40] text-[#DFD9CB] border border-[#3E4348] px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#B79A68]" />
                <span>Configure Supabase Credentials</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded border text-xs flex items-start gap-3 ${
                  testResult.ok
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/40 border-red-500/40 text-red-200'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-semibold">{testResult.message}</p>
                  {testResult.error && (
                    <p className="text-[11px] font-mono opacity-80 break-all">{testResult.error}</p>
                  )}
                </div>
              </div>
            )}

            {/* One-Click Seeding Card */}
            <div className="bg-[#17191B] border border-[#B79A68]/30 p-6 rounded-lg space-y-4">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-[#B79A68] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-base font-bold text-[#F5F1E8]">
                    One-Click Database Seeding
                  </h3>
                  <p className="text-xs text-[#8E8B82] mt-1 leading-relaxed">
                    If your Supabase database is freshly created or missing initial products, clicking this button safely populates all 12 verified products and default website copy into <code>public.products</code> and <code>public.website_content</code>. Existing records are preserved (<code>ON CONFLICT DO NOTHING</code>).
                  </p>
                </div>
              </div>

              <button
                onClick={handleOneClickSeed}
                disabled={isSaving}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-2.5 px-5 rounded transition-colors shadow cursor-pointer disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isSaving ? 'Seeding Database...' : 'Seed Initial Database Now'}</span>
              </button>
            </div>

            {/* SQL Migration Script Box */}
            <div className="bg-[#17191B] border border-[#2D3237] p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#F5F1E8]">
                    Production SQL Schema &amp; Security Rules
                  </h3>
                  <p className="text-xs text-[#8E8B82] mt-0.5">
                    Copy and run in your Supabase Dashboard &gt; SQL Editor to configure all tables, RLS, and storage rules.
                  </p>
                </div>
                <button
                  onClick={handleCopySqlScript}
                  className="inline-flex items-center gap-1.5 bg-[#252A2E] hover:bg-[#343A40] text-[#B79A68] text-xs font-semibold py-2 px-3.5 rounded border border-[#B79A68]/30 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                </button>
              </div>

              <div className="bg-[#121415] border border-[#252A2E] p-4 rounded text-xs text-[#8E8B82] space-y-2">
                <p className="text-[#DFD9CB] font-semibold">
                  What this SQL script does automatically:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Creates public tables: <code>admin_users</code>, <code>products</code>, <code>website_content</code>.</li>
                  <li>Creates public storage bucket: <code>website-assets</code> for photographs and textures.</li>
                  <li>Configures <code>public.is_admin()</code> and <code>public.sync_current_admin()</code> with search_path security hardening.</li>
                  <li>Grants public read access so visitors can view products without logging in.</li>
                  <li>Restricts create, update, and delete actions exclusively to verified administrators.</li>
                  <li>Pre-authorizes <code>velquarath@gmail.com</code> and <code>codictobi@gmail.com</code> as Owners.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1D2023] border border-[#3E4348] rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#2D3237] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#F5F1E8]">
                {products.some((p) => p.id === editingProduct.id) ? 'Edit Stonework Product' : 'Add New Stonework Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#8E8B82] hover:text-[#F5F1E8] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded focus:border-[#B79A68] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || 'Tombstones'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded focus:border-[#B79A68] focus:outline-none"
                  >
                    <option value="Tombstones">Tombstones</option>
                    <option value="Countertops & Tables">Countertops &amp; Tables</option>
                    <option value="Window Sills">Window Sills</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded focus:border-[#B79A68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1">
                  Long Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.longDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, longDescription: e.target.value })}
                  className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded focus:border-[#B79A68] focus:outline-none"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div className="space-y-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold">
                  Product Photograph
                </label>
                <div className="flex items-center gap-4">
                  {editingProduct.imageUrl ? (
                    <img
                      src={editingProduct.imageUrl}
                      alt={editingProduct.name || 'Preview'}
                      className="w-20 h-20 object-cover rounded border border-[#2D3237]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded bg-[#17191B] border border-[#2D3237] flex items-center justify-center text-[#8E8B82]">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 bg-[#252A2E] hover:bg-[#343A40] text-[#B79A68] text-xs font-semibold py-1.5 px-3 rounded border border-[#B79A68]/30 transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imageUploadLoading ? 'Uploading...' : 'Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={imageUploadLoading}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Or paste direct image URL"
                      value={editingProduct.imageUrl || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#8E8B82] p-2 rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1">
                    Price Mode
                  </label>
                  <select
                    value={editingProduct.priceDisplayMode || 'quotation_only'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceDisplayMode: e.target.value as any })}
                    className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded"
                  >
                    <option value="quotation_only">Quotation Only</option>
                    <option value="starting_from">Starting From</option>
                    <option value="fixed_price">Fixed Price</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1">
                    Price Amount ($)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.priceAmount ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        priceAmount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="e.g. 850"
                    className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingProduct.sortOrder ?? 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        sortOrder: Number(e.target.value),
                      })
                    }
                    className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-[#B79A68]"
                  />
                  <span className="text-xs text-[#DFD9CB] font-semibold">Feature on Home Page</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPublished !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                    className="accent-[#B79A68]"
                  />
                  <span className="text-xs text-[#DFD9CB] font-semibold">Published (Visible to Visitors)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#2D3237] pt-4">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-4 py-2 rounded bg-[#252A2E] text-[#8E8B82] hover:text-[#F5F1E8] text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={isSavingProduct}
                className="px-5 py-2 rounded bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSavingProduct ? 'Saving Product...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Credentials Modal */}
      <ConfigureCredentialsModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
}
