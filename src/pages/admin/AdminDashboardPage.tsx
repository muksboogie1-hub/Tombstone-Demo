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
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { useContent } from '../../context/ContentContext';
import { WebsiteContent, Product } from '../../types/content';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  seedProductsToSupabase,
} from '../../services/productService';
import { seedContentToSupabase } from '../../services/contentService';
import { SEOHead } from '../../components/common/SEOHead';

type Tab = 'content' | 'products' | 'media' | 'system';
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
    isOffline,
    isMissingTables,
  } = useContent();

  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [activeSection, setActiveSection] = useState<ContentSection>('hero');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('administrator');
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

  // Media tab states
  const [mediaUploadLoading, setMediaUploadLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Check auth session
  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        setAuthLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/admin/login');
        return;
      }

      setUserEmail(session.user.email || '');

      // Verify admin role in admin_users
      const { data: adminRecord } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('id', session.user.id)
        .maybeSingle();

      if (adminRecord) {
        if (!adminRecord.is_active) {
          await supabase.auth.signOut();
          navigate('/admin/login');
          return;
        }
        setUserRole(adminRecord.role);
      }

      setAuthLoading(false);
    }

    checkAuth();
  }, [navigate]);

  // Keep form data in sync with selected section
  useEffect(() => {
    setFormData(content[activeSection] || {});
    setStatusMessage(null);
  }, [activeSection, content]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleFieldChange = (field: string, value: any) => {
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
        setStatusMessage({ type: 'success', text: `Section "${String(activeSection).toUpperCase()}" saved successfully.` });
      } else {
        setStatusMessage({ type: 'error', text: `Failed to persist changes to Supabase. Check database permissions.` });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Save error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSection = async () => {
    if (!window.confirm(`Are you sure you want to reset "${String(activeSection).toUpperCase()}" to its original default values?`)) {
      return;
    }
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const success = await resetContentSection(activeSection);
      if (success) {
        setStatusMessage({ type: 'success', text: `Section "${String(activeSection).toUpperCase()}" reset to default.` });
      } else {
        setStatusMessage({ type: 'error', text: 'Reset failed' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Reset error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Product management actions
  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      slug: `custom-stonework-${Date.now()}`,
      name: '',
      category: 'Tombstones',
      shortDescription: '',
      longDescription: '',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
      imageAlt: '',
      specifications: {
        finish: 'Polished face with honed borders',
        materialOptions: 'Zimbabwe Black Granite',
        sizingNote: 'Standard or bespoke sizing available.',
      },
      featured: false,
      priceDisplayMode: 'quotation_only',
      priceAmount: null,
      priceCurrency: 'USD',
      priceNote: 'Quotation upon stone selection',
      isPublished: true,
      sortOrder: (products.length || 0) + 1,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    setIsSavingProduct(true);
    try {
      const isExisting = products.some((p) => p.id === editingProduct.id);
      if (isExisting) {
        await updateProduct(editingProduct.id!, editingProduct);
      } else {
        await createProduct(editingProduct);
      }
      await refreshProducts();
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteProduct(id);
      await refreshProducts();
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
      if (error) throw error;
      if (url && editingProduct) {
        setEditingProduct((prev) => ({
          ...prev,
          imageUrl: url,
          imageAlt: prev?.imageAlt || file.name.replace(/\.[^/.]+$/, ''),
        }));
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}. Make sure the 'website-assets' storage bucket exists in Supabase.`);
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
      if (error) throw error;
      setUploadedUrl(url);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setMediaUploadLoading(false);
    }
  };

  const handleOneClickSeed = async () => {
    if (!window.confirm('This will seed the database with the verified 12 products and default website content. Existing records will not be overwritten. Proceed?')) {
      return;
    }
    setIsSaving(true);
    try {
      const [contentSeed, productSeed] = await Promise.all([
        seedContentToSupabase(),
        seedProductsToSupabase(),
      ]);
      alert(`Database successfully seeded!\n- Products seeded/checked: ${productSeed.count}\n- Content sections seeded: ${contentSeed.count}`);
      await refreshContent();
      await refreshProducts();
    } catch (err: any) {
      alert(`Seeding error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#17191B] flex items-center justify-center text-[#DFD9CB]">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#B79A68] animate-spin" />
          <span>Verifying administrator permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#17191B] text-[#F5F1E8]">
      <SEOHead title="Admin Dashboard | Velquarath Stoneworks" description="Website Content and Product Management Portal" />

      {/* Top Admin Header Bar */}
      <header className="bg-[#1D2023] border-b border-[#2D3237] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#17191B] border border-[#B79A68]/40 flex items-center justify-center text-[#B79A68] font-serif font-bold">
            V
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-[#F5F1E8] leading-tight">
              Velquarath Admin Workspace
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-[#8E8B82]">
              <span>{userEmail || 'Administrator'}</span>
              <span>·</span>
              <span className="text-[#B79A68] font-semibold uppercase">{userRole}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#DFD9CB] hover:text-[#B79A68] bg-[#252A2E] hover:bg-[#2F353A] px-3 py-1.5 rounded transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#B79A68]" />
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 px-3 py-1.5 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Diagnostic Warning If Supabase Tables Missing */}
      {isMissingTables && (
        <div className="bg-amber-950/60 border-b border-amber-800 px-6 py-2.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Database tables (<code>website_content</code>, <code>products</code>) are not created yet. Run the SQL migration script in Supabase, or use the one-click seeder in the System tab.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('system')}
            className="underline font-semibold hover:text-white"
          >
            Open System Tab &rarr;
          </button>
        </div>
      )}

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 border-b border-[#2D3237] pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              activeTab === 'content'
                ? 'bg-[#B79A68] text-[#17191B]'
                : 'text-[#B9B5AC] hover:text-[#F5F1E8] hover:bg-[#252A2E]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Website Text Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              activeTab === 'products'
                ? 'bg-[#B79A68] text-[#17191B]'
                : 'text-[#B9B5AC] hover:text-[#F5F1E8] hover:bg-[#252A2E]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              activeTab === 'media'
                ? 'bg-[#B79A68] text-[#17191B]'
                : 'text-[#B9B5AC] hover:text-[#F5F1E8] hover:bg-[#252A2E]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Storage & Media</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
              activeTab === 'system'
                ? 'bg-[#B79A68] text-[#17191B]'
                : 'text-[#B9B5AC] hover:text-[#F5F1E8] hover:bg-[#252A2E]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database & Setup</span>
          </button>
        </nav>

        {/* ========================================================================= */}
        {/* TAB 1: WEBSITE CONTENT EDITOR */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Sections List */}
            <aside className="lg:col-span-1 space-y-1 bg-[#1D2023] border border-[#2D3237] p-3 rounded-lg self-start">
              <span className="block px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#8E8B82] font-semibold">
                Page Sections
              </span>
              {[
                { key: 'hero', label: 'Homepage Hero' },
                { key: 'announcement', label: 'Announcement Bar' },
                { key: 'about', label: 'About Us & Philosophy' },
                { key: 'categories', label: 'Categories & Disciplines' },
                { key: 'craftsmanship', label: 'Craftsmanship & Standards' },
                { key: 'gallery', label: 'Portfolio Gallery' },
                { key: 'contact', label: 'Contact & Business Info' },
                { key: 'footer', label: 'Footer & Assurance' },
              ].map((sec) => (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key as ContentSection)}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    activeSection === sec.key
                      ? 'bg-[#252A2E] text-[#B79A68] border-l-2 border-[#B79A68] font-bold'
                      : 'text-[#DFD9CB] hover:bg-[#252A2E]/50'
                  }`}
                >
                  <span>{sec.label}</span>
                </button>
              ))}
            </aside>

            {/* Active Section Form */}
            <main className="lg:col-span-3 bg-[#1D2023] border border-[#2D3237] p-6 sm:p-8 rounded-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D3237] pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold">
                    Live Content Editor
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#F5F1E8] capitalize">
                    {activeSection} Section Content
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleResetSection}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 text-xs text-[#8E8B82] hover:text-[#F5F1E8] py-2 px-3 rounded hover:bg-[#252A2E] transition-colors cursor-pointer disabled:opacity-50"
                    title="Reset this section back to factory default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Default</span>
                  </button>

                  <button
                    onClick={handleSaveSection}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-2 px-4 rounded transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving to Database...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              {statusMessage && (
                <div
                  className={`p-3 rounded text-xs flex items-center gap-2 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200'
                      : 'bg-red-950/40 border border-red-800 text-red-200'
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

              {/* Dynamic Field Form according to active section */}
              <div className="space-y-4">
                {Object.entries(formData).map(([key, val]) => {
                  if (typeof val === 'boolean') {
                    return (
                      <div key={key} className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id={key}
                          checked={val}
                          onChange={(e) => handleFieldChange(key, e.target.checked)}
                          className="w-4 h-4 accent-[#B79A68] rounded cursor-pointer"
                        />
                        <label htmlFor={key} className="text-xs uppercase tracking-wider font-semibold text-[#DFD9CB] cursor-pointer">
                          {key}
                        </label>
                      </div>
                    );
                  }

                  const isLong = String(val).length > 80 || key.includes('description') || key.includes('P1') || key.includes('P2') || key.includes('Intro') || key.includes('Statement') || key.includes('Point');

                  return (
                    <div key={key}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#B79A68] mb-1.5">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </label>
                      {isLong ? (
                        <textarea
                          rows={4}
                          value={String(val || '')}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] focus:outline-none text-[#F5F1E8] text-xs sm:text-sm rounded p-3 leading-relaxed"
                        />
                      ) : (
                        <input
                          type="text"
                          value={String(val || '')}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] focus:outline-none text-[#F5F1E8] text-xs sm:text-sm rounded px-3 py-2"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1D2023] border border-[#2D3237] p-5 rounded-lg">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold">
                  Catalog Inventory
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#F5F1E8]">
                  Product Catalog ({products.length} Items)
                </h2>
                <p className="text-xs text-[#8E8B82] mt-0.5">
                  Manage product specifications, pricing modes, and stone masonry imagery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={refreshProducts}
                  className="inline-flex items-center gap-1.5 text-xs text-[#DFD9CB] hover:text-white bg-[#252A2E] hover:bg-[#2F353A] py-2 px-3 rounded transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#B79A68]" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={handleOpenAddProduct}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-2 px-4 rounded transition-colors shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#1D2023] border border-[#2D3237] rounded-lg overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs text-[#DFD9CB]">
                <thead className="bg-[#17191B] border-b border-[#2D3237] uppercase tracking-wider text-[10px] text-[#8E8B82]">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">ID & Slug</th>
                    <th className="py-3 px-4">Name & Category</th>
                    <th className="py-3 px-4">Pricing Mode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252A2E]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#252A2E]/50 transition-colors">
                      <td className="py-3 px-4">
                        <img
                          src={prod.imageUrl}
                          alt={prod.imageAlt}
                          className="w-12 h-10 object-cover rounded border border-[#2D3237]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-[11px] text-[#B79A68] font-bold">{prod.id}</div>
                        <div className="text-[10px] text-[#8E8B82] truncate max-w-[140px]">{prod.slug}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-sm text-[#F5F1E8]">{prod.name}</div>
                        <div className="text-[11px] text-[#8E8B82]">{prod.category}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-[#17191B] border border-[#3D434A] px-2 py-0.5 rounded text-[10px] uppercase font-semibold text-[#B79A68]">
                          {prod.priceDisplayMode || 'quotation_only'}
                        </span>
                        {prod.priceAmount && (
                          <div className="text-[11px] text-[#DFD9CB] mt-0.5">
                            ${prod.priceAmount} {prod.priceCurrency}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {prod.isPublished !== false ? (
                          <span className="text-emerald-400 font-semibold">Published</span>
                        ) : (
                          <span className="text-amber-400 font-semibold">Draft</span>
                        )}
                        {prod.featured && (
                          <span className="block text-[10px] text-[#B79A68]">Featured</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-[#DFD9CB] hover:text-[#B79A68] bg-[#17191B] hover:bg-[#252A2E] rounded border border-[#2D3237] transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 text-red-400 hover:text-red-300 bg-[#17191B] hover:bg-red-950/40 rounded border border-[#2D3237] transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MEDIA & ASSET STORAGE */}
        {/* ========================================================================= */}
        {activeTab === 'media' && (
          <div className="bg-[#1D2023] border border-[#2D3237] p-8 rounded-lg space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold">
                Supabase Storage
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#F5F1E8]">
                Media & Photography Assets
              </h2>
              <p className="text-xs text-[#8E8B82] mt-1">
                Upload stone masonry photographs to the public <code>website-assets</code> bucket. Uploaded image URLs can be attached directly to products.
              </p>
            </div>

            <div className="border-2 border-dashed border-[#2D3237] hover:border-[#B79A68]/50 p-8 rounded-lg text-center space-y-4 bg-[#17191B]">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1D2023] text-[#B79A68]">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-[#F5F1E8] font-medium">Upload Product Photo</p>
                <p className="text-xs text-[#8E8B82]">JPG, PNG, WebP up to 10MB</p>
              </div>
              <div>
                <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-2.5 px-5 rounded cursor-pointer transition-colors">
                  <span>{mediaUploadLoading ? 'Uploading...' : 'Select Image File'}</span>
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
              <div className="p-4 bg-[#17191B] border border-[#B79A68]/40 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-emerald-400 block">
                  Image Uploaded Successfully!
                </span>
                <div className="flex items-center gap-4">
                  <img
                    src={uploadedUrl}
                    alt="Uploaded Asset"
                    className="w-24 h-20 object-cover rounded border border-[#2D3237]"
                  />
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-[#8E8B82] uppercase tracking-wider">Public Asset URL</label>
                    <input
                      type="text"
                      readOnly
                      value={uploadedUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="w-full bg-[#121415] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DATABASE & SYSTEM DIAGNOSTICS */}
        {/* ========================================================================= */}
        {activeTab === 'system' && (
          <div className="bg-[#1D2023] border border-[#2D3237] p-8 rounded-lg space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold">
                System Diagnostics
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#F5F1E8]">
                Supabase Database & Seed Control
              </h2>
              <p className="text-xs text-[#8E8B82] mt-1">
                Verify connectivity, table status, and perform deterministic initialization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#17191B] border border-[#2D3237] p-5 rounded space-y-2">
                <span className="text-xs font-semibold text-[#8E8B82] uppercase tracking-wider">Connection Status</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="text-sm font-bold text-[#F5F1E8]">
                    {isOffline ? 'Offline / Local Baseline Mode' : 'Connected to Supabase Live'}
                  </span>
                </div>
                <p className="text-xs text-[#8E8B82]">
                  {isOffline ? 'Using verified local baseline because Supabase is unreachable or unconfigured.' : 'Database queries are resolving live from PostgreSQL.'}
                </p>
              </div>

              <div className="bg-[#17191B] border border-[#2D3237] p-5 rounded space-y-2">
                <span className="text-xs font-semibold text-[#8E8B82] uppercase tracking-wider">Table Status</span>
                <div className="text-sm font-bold text-[#F5F1E8]">
                  {isMissingTables ? 'Tables Missing (42P01)' : 'Tables Initialized'}
                </div>
                <p className="text-xs text-[#8E8B82]">
                  Products in memory: {products.length} · Content sections: 8
                </p>
              </div>
            </div>

            {/* One-Click Seed Action */}
            <div className="bg-[#17191B] border border-[#B79A68]/30 p-6 rounded-lg space-y-4">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-[#B79A68] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-base font-bold text-[#F5F1E8]">
                    One-Click Database Seeding
                  </h3>
                  <p className="text-xs text-[#8E8B82] mt-1 leading-relaxed">
                    If your Supabase database is freshly created, clicking this button will safely seed all 12 verified products and default website copy into <code>public.products</code> and <code>public.website_content</code>. Existing records will be preserved (<code>ON CONFLICT DO NOTHING</code>).
                  </p>
                </div>
              </div>

              <button
                onClick={handleOneClickSeed}
                disabled={isSaving}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-2.5 px-5 rounded transition-colors shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Database className="w-4 h-4" />
                <span>{isSaving ? 'Seeding Database...' : 'Seed Initial Database Now'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#1D2023] border border-[#2D3237] max-w-2xl w-full p-6 sm:p-8 rounded-lg shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2D3237] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold">
                  Product Details
                </span>
                <h3 className="font-serif text-xl font-bold text-[#F5F1E8]">
                  {products.some((p) => p.id === editingProduct.id) ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#8E8B82] hover:text-[#F5F1E8] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#B79A68] uppercase font-semibold mb-1">Product ID</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.id || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, id: e.target.value })}
                    className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2.5 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[#B79A68] uppercase font-semibold mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2.5 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#B79A68] uppercase font-semibold mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2.5 rounded text-sm font-serif font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#B79A68] uppercase font-semibold mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'Tombstones'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2.5 rounded"
                  >
                    <option value="Tombstones">Tombstones</option>
                    <option value="Countertops & Tables">Countertops & Tables</option>
                    <option value="Window Sills">Window Sills</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#B79A68] uppercase font-semibold mb-1">Pricing Mode</label>
                  <select
                    value={editingProduct.priceDisplayMode || 'quotation_only'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceDisplayMode: e.target.value as any })}
                    className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2.5 rounded"
                  >
                    <option value="quotation_only">Quotation Only (Memorial Standard)</option>
                    <option value="starting_from">Starting From (e.g. From $450)</option>
                    <option value="fixed_price">Fixed Price (e.g. $180 / metre)</option>
                  </select>
                </div>
              </div>

              {editingProduct.priceDisplayMode !== 'quotation_only' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#17191B] p-3 rounded border border-[#2D3237]">
                  <div>
                    <label className="block text-[#8E8B82] uppercase font-semibold mb-1">Numeric Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.priceAmount ?? ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, priceAmount: parseFloat(e.target.value) || null })}
                      placeholder="450.00"
                      className="w-full bg-[#121415] border border-[#2D3237] text-[#F5F1E8] p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8E8B82] uppercase font-semibold mb-1">Currency</label>
                    <select
                      value={editingProduct.priceCurrency || 'USD'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, priceCurrency: e.target.value })}
                      className="w-full bg-[#121415] border border-[#2D3237] text-[#F5F1E8] p-2 rounded"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="ZiG">ZiG (Zimbabwe Gold)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#8E8B82] uppercase font-semibold mb-1">Pricing Note</label>
                    <input
                      type="text"
                      value={editingProduct.priceNote || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, priceNote: e.target.value })}
                      placeholder="e.g. single plinth base"
                      className="w-full bg-[#121415] border border-[#2D3237] text-[#F5F1E8] p-2 rounded"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#B79A68] uppercase font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-[#B79A68] uppercase font-semibold mb-1">Long Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.longDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, longDescription: e.target.value })}
                  className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2 rounded"
                />
              </div>

              {/* Photo Upload & URL */}
              <div className="space-y-2 bg-[#17191B] p-3 rounded border border-[#2D3237]">
                <label className="block text-[#B79A68] uppercase font-semibold">Product Photograph</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    value={editingProduct.imageUrl || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 bg-[#121415] border border-[#2D3237] text-[#F5F1E8] p-2 rounded"
                  />
                  <label className="inline-flex items-center gap-1.5 bg-[#252A2E] hover:bg-[#2F353A] text-[#DFD9CB] px-3 py-2 rounded text-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#B79A68]" />
                    <span>{imageUploadLoading ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={imageUploadLoading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8E8B82] uppercase font-semibold mb-1">Finish Specification</label>
                  <input
                    type="text"
                    value={editingProduct.specifications?.finish || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specifications: { ...editingProduct.specifications!, finish: e.target.value },
                      })
                    }
                    className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[#8E8B82] uppercase font-semibold mb-1">Material Options</label>
                  <input
                    type="text"
                    value={editingProduct.specifications?.materialOptions || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        specifications: { ...editingProduct.specifications!, materialOptions: e.target.value },
                      })
                    }
                    className="w-full bg-[#17191B] border border-[#2D3237] text-[#F5F1E8] p-2 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#B79A68] rounded"
                  />
                  <span className="text-xs uppercase font-semibold text-[#DFD9CB]">Featured on Homepage</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPublished !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                    className="w-4 h-4 accent-[#B79A68] rounded"
                  />
                  <span className="text-xs uppercase font-semibold text-[#DFD9CB]">Published</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2D3237]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="py-2 px-4 rounded bg-[#252A2E] hover:bg-[#2F353A] text-[#DFD9CB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="py-2 px-5 rounded bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  {isSavingProduct ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
