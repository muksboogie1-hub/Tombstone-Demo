# Supabase Integration Guide: Velquarath Stoneworks

This directory contains the database schema, Row Level Security (RLS) policies, and seed data for Velquarath Stoneworks.

---

## 1. Create a Supabase Project

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project** and name it `Velquarath-Stoneworks` (or your preferred name).
3. Set a strong database password and select a region close to your target visitors (e.g. South Africa - Cape Town or London/Europe).
4. Wait for the project provisioning to complete (~1-2 minutes).

---

## 2. Run the Schema Migration

1. In your Supabase project dashboard, navigate to the **SQL Editor** (the terminal/code icon in the left sidebar).
2. Click **New Query**.
3. Copy the entire contents of `supabase/migrations/20261015000000_init_schema.sql` and paste it into the editor.
4. Click **Run** (or `Cmd+Enter` / `Ctrl+Enter`).
5. Verify the output says `Success. No rows returned`.

This will:
- Create the tables: `public.admin_users`, `public.website_content`, and `public.products`.
- Set up the public storage bucket: `website-assets`.
- Create non-recursive `SECURITY DEFINER` functions: `public.is_admin()` and `public.is_super_admin()`.
- Enable and enforce Row Level Security (RLS) on all tables and storage assets.

---

## 3. Seed Initial Website Content & Products

1. In the **SQL Editor**, click **New Query**.
2. Copy the entire contents of `supabase/seed.sql` and paste it into the editor.
3. Click **Run**.
4. Verify all 12 verified products and website content sections are inserted.

> **Note on Idempotence:** The seed script uses `ON CONFLICT (id) DO NOTHING` and `ON CONFLICT (key) DO NOTHING`. Running it repeatedly will never delete, alter, or overwrite existing records.

---

## 4. Create the First Administrator

Self-registration does **not** grant administrative privileges. To set up your first administrator securely:

1. In the Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your administrator email (e.g., `admin@velquarath.co.zw` or your email) and choose a secure password.
4. Check **Auto Confirm User** and click **Create User**.
5. Copy the generated **User UID** (a UUID string such as `a1b2c3d4-e5f6-...`).
6. Return to the **SQL Editor** and run:

```sql
INSERT INTO public.admin_users (id, email, role, is_active)
VALUES (
  'PASTE-YOUR-COPIED-USER-UID-HERE',
  'admin@velquarath.co.zw',
  'super_admin',
  true
)
ON CONFLICT (id) DO UPDATE SET role = 'super_admin', is_active = true;
```

You can now log in at `/admin/login` on the website!

---

## 5. Configure Frontend Environment Variables

1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Copy:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key (e.g. `eyJhbGciOi...`)
3. Set these in your environment (or `.env` file):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

*Security Note: Never expose the `service_role` key in frontend configuration. The website requires only the public `anon` key, as all authorization is enforced at the database level by PostgreSQL Row Level Security.*
