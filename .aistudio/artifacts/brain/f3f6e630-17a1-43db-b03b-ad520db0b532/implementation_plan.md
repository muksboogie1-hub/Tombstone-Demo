# Secure Supabase Architecture & Website Content Management System (Final Approval Blueprint)

A production-grade, database-enforced content and product management system for Velquarath Stoneworks utilizing Supabase PostgreSQL, non-recursive Row Level Security (RLS), Supabase Auth, and Supabase Storage. This document provides the final, reconciled security architecture and execution plan.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Reconciled Resolutions for Approval:
> 1. **Zero RLS Recursion on `admin_users`**: The self-referencing subquery has been eliminated. Role checks are encapsulated in two dedicated `SECURITY DEFINER` functions: `public.is_admin()` and `public.is_super_admin()`, with explicit `search_path = public` and revoking public execute privileges.
> 2. **Product Catalog Reconciled (Exactly 12 Products)**: Verified against `src/data/products.ts`. The catalog contains exactly **12 verified products** across 3 categories (5 Tombstones, 4 Countertops & Tables, 3 Window Sills). Zero hallucinated or missing products.
> 3. **Dual-Resource Loading Gate & Bounded Timeout**: Initial load resolves both `website_content` and `products` concurrently with a 3000ms bounded timeout. Handles 4 distinct states: (a) Nominal live data, (b) Empty tables (0 rows), (c) Missing tables (PostgreSQL `42P01`), and (d) Network failure/offline. Admin login (`/admin/login`) is strictly bypassed and never blocked by public loading states.
> 4. **Structured Dual-Mode Pricing Schema**: `public.products` supports both formal numeric pricing (`price_amount`, `price_currency`) and quotation guidance (`price_display_mode`, `price_note`), supporting USD and ZiG currencies.
> 5. **Preservation Guarantee**: All existing footer links ("Client Assurance & Standards"), "View Design" buttons and modals, product filters, WhatsApp inquiry channels, and the Express `/api/inquiries` route remain 100% intact.

---

## 1. Security-Definer Functions & Non-Recursive RLS Review

### The Recursion Problem & Resolution
In the previous draft, the policy on `public.admin_users` evaluated:
```sql
-- ❌ INSECURE / CAUSES INFINITE RECURSION
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() ...))
```
When PostgreSQL evaluates a policy on `admin_users` that queries `admin_users`, it triggers recursive policy evaluation. 

### Secure Resolution
We define two non-recursive `SECURITY DEFINER` helper functions with explicit execution permissions and safe search paths:

```sql
-- ============================================================================
-- SECURITY DEFINER HELPER FUNCTIONS (Zero RLS Recursion)
-- ============================================================================

-- Function 1: Verifies active administrator status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = auth.uid() 
      AND is_active = true
  );
END;
$$;

-- Function 2: Verifies active super administrator status
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = auth.uid() 
      AND role = 'super_admin'
      AND is_active = true
  );
END;
$$;

-- Security Hardening: Revoke default PUBLIC execution; grant explicitly
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
```

### Complete Non-Recursive Policy Set on `public.admin_users`:
```sql
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 1. Admins can view the roster (uses SECURITY DEFINER function -> no recursion)
CREATE POLICY "Admins can view admin roster"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 2. Super admins can manage roster (uses SECURITY DEFINER function -> no recursion)
CREATE POLICY "Super admins can manage admin roster"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());
```

---

## 2. Reconciled Product Audit (Exact 12 Products)

Verification of `src/data/products.ts` confirms exactly **12 items**. The initial SQL migration seed will populate these exact records:

| Product ID | Slug | Category | Exact Product Name | Specifications Summary |
| :--- | :--- | :--- | :--- | :--- |
| `ts-01` | `three-step-memorial-cross-head` | Tombstones | Three-Step Memorial with Cross Head | Polished face with honed kerb borders; Zimbabwe Black Granite |
| `ts-02` | `polished-granite-monument` | Tombstones | Polished Black Granite Memorial | Deep reflective polished stone; Zimbabwe Black Granite |
| `ts-03` | `open-book-desk-memorial` | Tombstones | Open Book Desk Memorial | Polished ledger stone open book; Zimbabwe Black, Impala Grey |
| `ts-04` | `serpentine-headstone-kerb-set` | Tombstones | Serpentine Headstone with Full Kerb Set | Polished serpentine crest with full ground ledger |
| `ts-05` | `double-companion-memorial` | Tombstones | Double Companion Family Monument | Wide companion double headstone; Dual inscription panels |
| `ct-01` | `honed-black-granite-island` | Countertops & Tables | Honed Black Granite Kitchen Island | Honed matte architectural finish; 30mm solid granite |
| `ct-02` | `leathered-granite-dining-table` | Countertops & Tables | Leathered Stone Outdoor Dining Table | Tactile leathered textured finish; Weatherproof outdoor |
| `ct-03` | `polished-waterfall-vanity` | Countertops & Tables | Polished Waterfall Vanity Slab | High-gloss diamond polished; Undermount basin cutouts |
| `ct-04` | `flamed-granite-braai-counter` | Countertops & Tables | Flamed Granite Braai & Patio Counter | Thermal flamed slip-resistant surface; Heat resistant |
| `ws-01` | `bullnose-exterior-granite-sill` | Window Sills | Bullnose Exterior Granite Window Sill | Polished top with eased bullnose edge; Water drip groove |
| `ws-02` | `honed-interior-threshold-sill` | Window Sills | Honed Interior Window Threshold | Honed satin architectural trim; Beveled reveals |
| `ws-03` | `chamfered-commercial-spandrel-sill` | Window Sills | Chamfered Architectural Spandrel Sill | Dual-chamfered edge profile; Structural masonry |

*Preservation Guarantee*: Not a single product will be omitted, renamed, or modified during database migration.

---

## 3. Pricing Architecture & Schema Clarification

To balance traditional memorial masonry (where prices depend on cemetery plot sizing and custom inscriptions) with architectural work that can feature transparent pricing:

### Proposed Schema Fields for `public.products`:
```sql
-- Pricing Columns in public.products
price_display_mode TEXT NOT NULL DEFAULT 'quotation_only' 
  CHECK (price_display_mode IN ('quotation_only', 'fixed_price', 'starting_from')),
price_amount NUMERIC(10, 2),
price_currency TEXT NOT NULL DEFAULT 'USD' 
  CHECK (price_currency IN ('USD', 'ZiG')),
price_note TEXT
```

### Visual Rendering Rules:
1. **`quotation_only` (Default)**: Renders *"Quotation Upon Stone Selection"* (ideal for bespoke memorials).
2. **`starting_from`**: Renders *"From $450.00 USD"* (or ZiG equivalent) accompanied by `price_note` (e.g. *"Single plot base plinth"*).
3. **`fixed_price`**: Renders *"$180.00 USD / linear metre"* accompanied by `price_note` (ideal for standardized window sills).

---

## 4. Dual-Resource Loading Gate & Error Handling

```
                               ┌─────────────────────────┐
                               │ Application Mounts      │
                               │ Is Route /admin/login?  │
                               └───────────┬─────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                 YES    │                                     │ NO
                        ▼                                     ▼
             ┌─────────────────────┐               ┌─────────────────────┐
             │ Immediate Mount     │               │ Show Branded Splash │
             │ Bypass Loading Gate │               │ Start 3000ms Timer  │
             └─────────────────────┘               └──────────┬──────────┘
                                                              │
                                     ┌────────────────────────┴────────────────────────┐
                                     │ Promise.allSettled([getContent, getProducts])   │
                                     └────────────────────────┬────────────────────────┘
                                                              │
                 ┌───────────────────────┬────────────────────┴──────────────────┬───────────────────────┐
                 ▼                       ▼                                       ▼                       ▼
       ┌───────────────────┐   ┌───────────────────┐                   ┌───────────────────┐   ┌───────────────────┐
       │ Both Resolve OK   │   │ Empty Tables      │                   │ PostgreSQL 42P01  │   │ Network Failure / │
       │ (Live Data)       │   │ (0 rows returned) │                   │ Table Not Found   │   │ Timeout (Offline) │
       ├───────────────────┤   ├───────────────────┤                   ├───────────────────┤   ├───────────────────┤
       │ Render Live Site  │   │ Render Empty      │                   │ Render Local Base │   │ Render Local Base │
       │ No Banners        │   │ Catalog Notice    │                   │ Banner: "Awaiting │   │ Banner: "OFFLINE  │
       │                   │   │ (Prompt Seeding)  │                   │ Migration"        │   │ NOTICE" + [Retry] │
       └───────────────────┘   └───────────────────┘                   └───────────────────┘   └───────────────────┘
```

### Key Technical Implementations:
1. **Concurrent Promise Resolution**:
   ```typescript
   const [contentRes, productsRes] = await Promise.allSettled([
     supabase.from('website_content').select('*'),
     supabase.from('products').select('*').order('sort_order', { ascending: true })
   ]);
   ```
2. **Bounded 3000ms Timeout**:
   Using `Promise.race([fetchPromise, timeoutPromise(3000)])` ensures visitors on degraded mobile connections are never locked behind a frozen splash screen.
3. **Admin Route Bypass**:
   `window.location.pathname.startsWith('/admin')` completely skips public loading requirements, ensuring administrators can authenticate and seed tables even if the database is unpopulated.
4. **Interactive Retry Callback**:
   The `[Retry Connection]` button resets the error state, initiates a new health probe, and seamlessly swaps to live content upon recovery without full page reloads.

---

## 5. Complete Reviewed Database Schema

*(Ready for execution upon approval)*

```sql
-- ============================================================================
-- VELQUARATH STONEWORKS: COMPLETE DATABASE SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Table: admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'administrator' CHECK (role IN ('super_admin', 'administrator', 'editor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: website_content
CREATE TABLE IF NOT EXISTS public.website_content (
  key TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  value JSONB NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES public.admin_users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table: products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Tombstones', 'Countertops & Tables', 'Window Sills')),
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  price_display_mode TEXT NOT NULL DEFAULT 'quotation_only' CHECK (price_display_mode IN ('quotation_only', 'fixed_price', 'starting_from')),
  price_amount NUMERIC(10, 2),
  price_currency TEXT NOT NULL DEFAULT 'USD' CHECK (price_currency IN ('USD', 'ZiG')),
  price_note TEXT,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  specifications JSONB NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES public.admin_users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 1. admin_users policies
CREATE POLICY "Admins can view admin roster"
  ON public.admin_users FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Super admins can manage admin roster"
  ON public.admin_users FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- 2. website_content policies
CREATE POLICY "Public read published content"
  ON public.website_content FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin insert content"
  ON public.website_content FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update content"
  ON public.website_content FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete content"
  ON public.website_content FOR DELETE TO authenticated
  USING (public.is_admin());

-- 3. products policies
CREATE POLICY "Public read published products"
  ON public.products FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.is_admin());

-- 4. storage.objects policies
CREATE POLICY "Public read website assets"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'website-assets');

CREATE POLICY "Admin upload website assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'website-assets' AND public.is_admin());

CREATE POLICY "Admin update website assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'website-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'website-assets' AND public.is_admin());

CREATE POLICY "Admin delete website assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'website-assets' AND public.is_admin());
```

---

## 6. Execution Steps (Ready to Proceed Upon Approval)

1. **Step 1**: Install `@supabase/supabase-js`.
2. **Step 2**: Configure environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in `.env` and `.env.example`.
3. **Step 3**: Create `src/lib/supabaseClient.ts` with error handling and fallback detection.
4. **Step 4**: Implement `BrandedSplashScreen.tsx`, `PersistentOfflineBanner.tsx`, and dual-resource `ContentContext.tsx`.
5. **Step 5**: Write SQL migration and seeding scripts (`src/db/seedData.ts`) containing the exact 12 products and site configuration.
6. **Step 6**: Build Admin Workspace (`/admin/login`, `/admin/dashboard`) with Email/Password auth, Content Editor, Product Manager, and Image Uploader.
7. **Step 7**: Connect public pages (`HomePage`, `AboutPage`, `ProductsPage`, etc.) to dynamic state while preserving all existing elements.
8. **Step 8**: Verify with `compile_applet`, mobile viewports, and test offline recovery.
