# Velquarath Stoneworks — Premium Tombstones & Granite Works

A luxury, production-grade website and content management system for **Velquarath Stoneworks**, specializing in bespoke Zimbabwean black granite memorials, tombstones, kitchen countertops, and architectural window sills in Zimbabwe.

---

## 1. Architecture Overview

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons, React Router 7.
- **Backend / API:** Node.js Express server (`server.ts`) hosting static production assets and the `/api/inquiries` and `/api/health` endpoints.
- **Database & Storage:** Supabase PostgreSQL with strict Row Level Security (RLS), non-recursive `SECURITY DEFINER` functions, Supabase Auth, and Supabase Storage (`website-assets` bucket).
- **Offline / Degraded Network Resilience:**
  - Dual-resource concurrent loading gate resolving both `website_content` and `products` before rendering public views.
  - Bounded 3500ms timeout prevents visitors on degraded mobile networks from being blocked.
  - Branded luxury loading screen prevents flickering of outdated or hardcoded fallback data.
  - Persistent offline notice informs visitors when displaying verified local baseline data.
  - Admin portal routes (`/admin`, `/admin/login`) bypass public gates so administrators can always access settings and seed tables.

---

## 2. Local Development & Build Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript compilation checks
npm run lint

# Build production bundle to /dist
npm run build

# Start production Express server
npm run start
```

---

## 3. Supabase Setup & Activation

Follow these steps in your Supabase project to activate live content editing:

### Step 1: Run Schema Migration
1. Go to your **Supabase Dashboard** -> **SQL Editor**.
2. Run the script located in `supabase/migrations/20261015000000_init_schema.sql`.
3. This creates `admin_users`, `website_content`, `products`, the `website-assets` storage bucket, and non-recursive RLS policies.

### Step 2: Seed the Database
1. In the **SQL Editor**, run `supabase/seed.sql`.
2. This safely seeds the exact 12 products and default website copy using `ON CONFLICT DO NOTHING`.
3. *Alternatively*, log into the admin dashboard at `/admin` and click **"Seed Initial Database Now"** in the **Database & Setup** tab!

### Step 3: Create the First Administrator
1. In **Supabase Dashboard** -> **Authentication** -> **Users**, click **Add User** -> **Create User**.
2. Enter an email (e.g. `admin@velquarath.co.zw`) and password. Check **Auto Confirm User**.
3. Copy the generated User UID.
4. In the **SQL Editor**, run:
   ```sql
   INSERT INTO public.admin_users (id, email, role, is_active)
   VALUES ('PASTE-USER-UID-HERE', 'admin@velquarath.co.zw', 'super_admin', true)
   ON CONFLICT (id) DO UPDATE SET role = 'super_admin', is_active = true;
   ```

### Step 4: Configure Environment Variables
Set the following in `.env`:
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

---

## 4. Admin Portal Features (`/admin`)

- **Website Text Editor:** Edit Announcement Bar, Homepage Hero, About Us & Philosophy, Categories & Disciplines, Craftsmanship & Standards, Gallery captions, Contact & Business Hours, and Footer statements in real time with instant save and reset-to-default.
- **Product Catalog Manager:** Add, edit, or delete products; modify specifications, finish, material options, edge profiles, and pricing modes (`quotation_only`, `starting_from`, `fixed_price`); toggle featured on homepage or published status.
- **Media & Asset Storage:** Upload stone masonry photographs directly to Supabase Storage with instant public URLs.
- **Database & System Diagnostics:** Live connection status probe, table health indicators, and one-click database seeder.

---

## 5. Production Deployment

The project can be deployed to any Node.js hosting platform (e.g. Google Cloud Run, Render, Railway, Fly.io, or VPS) with:
- Build command: `npm run build`
- Start command: `npm run start` (runs `tsx server.ts` on port 3000)
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `WEB3FORMS_ACCESS_KEY`
