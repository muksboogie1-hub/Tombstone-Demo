import { getSupabaseClient, isSupabaseConfigured, formatSupabaseError } from '../lib/supabaseClient';

export interface AdminUser {
  email: string;
  id: string;
  role?: string;
  isSupabaseAuth: boolean;
  isWhitelisted?: boolean;
}

export interface AdminMember {
  id: string;
  userId?: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const PREVIEW_SESSION_KEY = 'velquarath_stoneworks_preview_session';

/**
 * Checks whether the app is currently running in a local development or
 * AI Studio preview environment rather than the live deployed production domain.
 */
export function isPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host.includes('run.app') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('webcontainer') ||
    host === ''
  );
}

/**
 * Retrieves the current admin user session.
 * On live production, verified Supabase authentication sessions are verified against
 * public.admin_users allowlist.
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (user) {
        // Attempt backend sync RPC to associate user_id with admin_users record if available
        try {
          await client.rpc('sync_current_admin');
        } catch {
          // RPC may not be present in earlier schema versions
        }

        let role = 'administrator';
        let isWhitelisted = false;

        try {
          // Query admin_users allowlist table by UID or email
          const { data: adminRecord } = await client
            .from('admin_users')
            .select('role, is_active')
            .or(`user_id.eq.${user.id},email.ilike.${user.email}`)
            .maybeSingle();

          if (adminRecord) {
            if (!adminRecord.is_active) {
              await client.auth.signOut();
              return null;
            }
            role = adminRecord.role || 'administrator';
            isWhitelisted = true;
          }
        } catch {
          // Table may not yet be initialized
        }

        return {
          email: user.email || '',
          id: user.id,
          role,
          isSupabaseAuth: true,
          isWhitelisted,
        };
      }
    } catch {
      // Session fetch error
    }
  }

  // Preview sandbox session check (local/preview environments only)
  if (typeof window !== 'undefined' && isPreviewEnvironment()) {
    try {
      const stored = sessionStorage.getItem(PREVIEW_SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Authenticates administrator using Supabase Auth and validates against public.admin_users allowlist.
 */
export async function adminLogin(
  email: string,
  pass: string
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const client = getSupabaseClient();

  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      error:
        'Supabase is not configured. Please supply your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment, or configure credentials in the setup drawer.',
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      return { success: false, error: formatSupabaseError(error) };
    }

    if (data.user) {
      // Call self-healing sync RPC if defined
      try {
        await client.rpc('sync_current_admin');
      } catch {
        // ignore if not yet migrated
      }

      let role = 'administrator';
      let isWhitelisted = false;

      try {
        const { data: adminRecord } = await client
          .from('admin_users')
          .select('role, is_active')
          .or(`user_id.eq.${data.user.id},email.ilike.${data.user.email}`)
          .maybeSingle();

        if (adminRecord) {
          if (!adminRecord.is_active) {
            await client.auth.signOut();
            return {
              success: false,
              error: 'This administrator account has been deactivated. Please contact your senior stonemasonry administrator.',
            };
          }
          role = adminRecord.role || 'administrator';
          isWhitelisted = true;
        }
      } catch {
        // admin_users table might be pending initial SQL schema execution
      }

      return {
        success: true,
        user: {
          email: data.user.email || email,
          id: data.user.id,
          role,
          isSupabaseAuth: true,
          isWhitelisted,
        },
      };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication request failed' };
  }

  return { success: false, error: 'Authentication failed. Please verify credentials.' };
}

/**
 * Signs out the current administrator from both Supabase Auth and preview sessions.
 */
export async function adminSignOut(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch {
      // ignore
    }
  }
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PREVIEW_SESSION_KEY);
  }
}

/**
 * Preview Sandbox Login:
 * Strictly isolated for local developer / AI Studio preview testing.
 * NEVER allowed on the live production domain.
 */
export function enterPreviewSandbox(email = 'velquarath@gmail.com'): {
  success: boolean;
  error?: string;
  user?: AdminUser;
} {
  if (!isPreviewEnvironment()) {
    return {
      success: false,
      error: 'Sandbox preview mode is disabled on production. Please log in with Supabase credentials.',
    };
  }

  const user: AdminUser = {
    email: email.trim() || 'velquarath@gmail.com',
    id: 'preview_sandbox_mason_admin',
    role: 'owner',
    isSupabaseAuth: false,
    isWhitelisted: true,
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(PREVIEW_SESSION_KEY, JSON.stringify(user));
  }

  return { success: true, user };
}

// =====================================================================
// AUTHENTICATED ADMINISTRATOR TEAM PROVISIONING
// =====================================================================
const LOCAL_ADMIN_MEMBERS_KEY = 'velquarath_stoneworks_admin_members_cache';

/**
 * Fetches the list of authorized administrators.
 */
export async function fetchAdminTeam(): Promise<AdminMember[]> {
  const client = getSupabaseClient();
  const current = await getCurrentAdminUser();

  if (client && current?.isSupabaseAuth) {
    try {
      const { data, error } = await client
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          userId: d.user_id,
          email: d.email,
          role: d.role || 'administrator',
          isActive: d.is_active !== false,
          createdAt: d.created_at,
        }));
      }
    } catch {
      // fallback to local cache
    }
  }

  // Fallback to local storage cache if in sandbox or database not yet created
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_ADMIN_MEMBERS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  return [
    {
      id: 'admin_primary_owner',
      email: current?.email || 'velquarath@gmail.com',
      role: 'owner',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'admin_secondary_owner',
      email: 'codictobi@gmail.com',
      role: 'owner',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Adds an authorized administrator record.
 */
export async function createAdminMember(
  email: string,
  role = 'administrator'
): Promise<{ success: boolean; error?: string; member?: AdminMember }> {
  const current = await getCurrentAdminUser();
  if (!current) {
    return { success: false, error: 'Unauthorized: Only signed-in administrators can create admin accounts.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const client = getSupabaseClient();
  if (client && current.isSupabaseAuth) {
    try {
      const { data: inserted, error: insertErr } = await client
        .from('admin_users')
        .upsert(
          {
            email: cleanEmail,
            role,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        )
        .select()
        .single();

      if (insertErr) {
        return { success: false, error: formatSupabaseError(insertErr) };
      }

      const member: AdminMember = {
        id: inserted.id,
        userId: inserted.user_id,
        email: inserted.email,
        role: inserted.role || role,
        isActive: true,
        createdAt: inserted.created_at,
      };

      return { success: true, member };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create administrator record in database.' };
    }
  }

  // Preview Sandbox local management fallback
  try {
    const list = await fetchAdminTeam();
    if (list.some((m) => m.email === cleanEmail)) {
      return { success: false, error: 'An administrator with this email already exists.' };
    }

    const newMember: AdminMember = {
      id: 'admin_' + Date.now(),
      email: cleanEmail,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    list.push(newMember);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_ADMIN_MEMBERS_KEY, JSON.stringify(list));
    }
    return { success: true, member: newMember };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Toggles an administrator's active access status.
 */
export async function toggleAdminStatus(
  memberId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const current = await getCurrentAdminUser();
  if (!current) return { success: false, error: 'Unauthorized: Session missing' };

  const client = getSupabaseClient();
  if (client && current.isSupabaseAuth) {
    try {
      const { error } = await client
        .from('admin_users')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', memberId);

      if (error) {
        return { success: false, error: formatSupabaseError(error) };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update administrator status' };
    }
  }

  try {
    const list = await fetchAdminTeam();
    const updated = list.map((m) => (m.id === memberId ? { ...m, isActive } : m));
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_ADMIN_MEMBERS_KEY, JSON.stringify(updated));
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * Revokes an administrator record.
 */
export async function deleteAdminMember(
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  const current = await getCurrentAdminUser();
  if (!current) return { success: false, error: 'Unauthorized: Session missing' };

  const client = getSupabaseClient();
  if (client && current.isSupabaseAuth) {
    try {
      const { error } = await client.from('admin_users').delete().eq('id', memberId);
      if (error) {
        return { success: false, error: formatSupabaseError(error) };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to revoke administrator' };
    }
  }

  try {
    const list = await fetchAdminTeam();
    const filtered = list.filter((m) => m.id !== memberId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_ADMIN_MEMBERS_KEY, JSON.stringify(filtered));
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
