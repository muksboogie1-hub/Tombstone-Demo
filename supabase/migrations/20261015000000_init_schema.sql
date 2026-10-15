-- ============================================================================
-- VELQUARATH STONEWORKS: DATABASE SCHEMA & SECURITY DEFINER RLS MIGRATION
-- ============================================================================

-- Enable required UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Public Storage Bucket for Website Assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-assets',
  'website-assets',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Create Table: admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'administrator' CHECK (role IN ('super_admin', 'administrator', 'editor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Table: website_content
CREATE TABLE IF NOT EXISTS public.website_content (
  key TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  value JSONB NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES public.admin_users(id),
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
  updated_by UUID REFERENCES public.admin_users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);
CREATE INDEX IF NOT EXISTS idx_website_content_section ON public.website_content(section);

-- ============================================================================
-- SECURITY DEFINER HELPER FUNCTIONS (Zero RLS Recursion)
-- ============================================================================

-- Function 1: Check if calling user is active administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- Function 2: Check if calling user is active super administrator
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- Revoke default public execution privileges and grant explicitly to authenticated
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 1. Policies for admin_users
DROP POLICY IF EXISTS "Users can view own admin record" ON public.admin_users;
CREATE POLICY "Users can view own admin record"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can manage admin roster" ON public.admin_users;
CREATE POLICY "Super admins can manage admin roster"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- 2. Policies for website_content
DROP POLICY IF EXISTS "Public read published content" ON public.website_content;
CREATE POLICY "Public read published content"
  ON public.website_content FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert content" ON public.website_content;
CREATE POLICY "Admin insert content"
  ON public.website_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update content" ON public.website_content;
CREATE POLICY "Admin update content"
  ON public.website_content FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete content" ON public.website_content;
CREATE POLICY "Admin delete content"
  ON public.website_content FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 3. Policies for products
DROP POLICY IF EXISTS "Public read published products" ON public.products;
CREATE POLICY "Public read published products"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert products" ON public.products;
CREATE POLICY "Admin insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update products" ON public.products;
CREATE POLICY "Admin update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete products" ON public.products;
CREATE POLICY "Admin delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4. Policies for storage.objects
DROP POLICY IF EXISTS "Public read website assets" ON storage.objects;
CREATE POLICY "Public read website assets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Admin upload website assets" ON storage.objects;
CREATE POLICY "Admin upload website assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update website assets" ON storage.objects;
CREATE POLICY "Admin update website assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'website-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete website assets" ON storage.objects;
CREATE POLICY "Admin delete website assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'website-assets' AND public.is_admin());
