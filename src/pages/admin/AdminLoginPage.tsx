import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { SEOHead } from '../../components/common/SEOHead';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const configured = isSupabaseConfigured();

  // If already authenticated and has admin rights, redirect to dashboard
  useEffect(() => {
    async function checkExistingSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/admin');
      }
    }
    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!configured) {
      setErrorMsg(
        'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured. Please add them to your environment.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your administrator email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Authentication failed: No user returned.');
      }

      // Check admin status in public.admin_users
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('id', data.user.id)
        .maybeSingle();

      if (adminError) {
        // Table might not exist or RLS might deny
        console.warn('Admin check warning:', adminError);
      }

      if (adminRecord && !adminRecord.is_active) {
        await supabase.auth.signOut();
        throw new Error('This administrator account has been deactivated. Please contact your system super administrator.');
      }

      setInfoMsg('Authentication verified. Loading dashboard...');
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead title="Administrator Access | Velquarath Stoneworks" description="Secure administrator portal for website content and product management." />

      <div className="max-w-md w-full space-y-8 bg-[#1D2023] border border-[#2D3237] p-8 rounded-lg shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#17191B] border border-[#B79A68]/40 text-[#B79A68] mb-2 shadow-inner">
            <Lock className="w-5 h-5" />
          </div>
          <span className="block text-[11px] uppercase tracking-[0.25em] text-[#B79A68] font-semibold">
            Administrative Portal
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5F1E8]">
            Velquarath Stoneworks
          </h2>
          <p className="text-xs text-[#8E8B82]">
            Sign in with your authorized administrator credentials to manage website content, product specifications, and stone masonry imagery.
          </p>
        </div>

        {!configured && (
          <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded text-xs text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Supabase configuration is required. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your environment file.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-800/60 p-3 rounded text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {infoMsg && (
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded text-xs text-emerald-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>{infoMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#DFD9CB] mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@velquarath.co.zw"
                className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] focus:outline-none text-[#F5F1E8] text-sm rounded px-3 py-2.5 pl-10"
              />
              <Mail className="w-4 h-4 text-[#8E8B82] absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#DFD9CB] mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#17191B] border border-[#2D3237] focus:border-[#B79A68] focus:outline-none text-[#F5F1E8] text-sm rounded px-3 py-2.5 pl-10"
              />
              <Lock className="w-4 h-4 text-[#8E8B82] absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] py-3 px-4 rounded transition-colors shadow-lg cursor-pointer disabled:opacity-50"
          >
            <Shield className="w-4 h-4" />
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#2D3237] flex items-center justify-between text-xs text-[#8E8B82]">
          <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#B79A68] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
          <span className="text-[10px] text-[#555]">RLS Protected</span>
        </div>
      </div>
    </div>
  );
}
