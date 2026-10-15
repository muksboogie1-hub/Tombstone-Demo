-- ============================================================================
-- VELQUARATH STONEWORKS: PRODUCTION HARDENED SUPABASE MIGRATION
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
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- 2. Create Table: admin_users (Allows pre-seeding owners before they register in auth)
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

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);
CREATE INDEX IF NOT EXISTS idx_website_content_section ON public.website_content(section);

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

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

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
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Public can view website content" ON public.website_content;
CREATE POLICY "Public can view website content" ON public.website_content FOR SELECT USING (is_published = true OR public.is_admin());

-- 10. Admin Write Policies
DROP POLICY IF EXISTS "Admin full access to products" ON public.products;
CREATE POLICY "Admin full access to products" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access to website content" ON public.website_content;
CREATE POLICY "Admin full access to website content" ON public.website_content FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin view own or all admin_users" ON public.admin_users;
CREATE POLICY "Admin view own or all admin_users" ON public.admin_users FOR SELECT USING (public.is_admin() OR user_id = auth.uid() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Admin modify admin_users" ON public.admin_users;
CREATE POLICY "Admin modify admin_users" ON public.admin_users FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 11. Storage Policies for website-assets
DROP POLICY IF EXISTS "Public read website assets" ON storage.objects;
CREATE POLICY "Public read website assets" ON storage.objects FOR SELECT USING (bucket_id = 'website-assets');

DROP POLICY IF EXISTS "Admin upload website assets" ON storage.objects;
CREATE POLICY "Admin upload website assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update website assets" ON storage.objects;
CREATE POLICY "Admin update website assets" ON storage.objects FOR UPDATE USING (bucket_id = 'website-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete website assets" ON storage.objects;
CREATE POLICY "Admin delete website assets" ON storage.objects FOR DELETE USING (bucket_id = 'website-assets' AND public.is_admin());

-- 12. Pre-seed Owner Emails into Allowlist
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
