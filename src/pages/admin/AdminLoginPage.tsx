import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, AlertCircle, Shield, CheckCircle2, Settings, Sparkles } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { adminLogin, enterPreviewSandbox, getCurrentAdminUser, isPreviewEnvironment } from '../../services/authService';
import { SEOHead } from '../../components/common/SEOHead';
import { ConfigureCredentialsModal } from '../../components/common/ConfigureCredentialsModal';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);

  const configured = isSupabaseConfigured();
  const isPreview = isPreviewEnvironment();

  // If already authenticated and has admin rights, redirect to dashboard
  useEffect(() => {
    async function checkExistingSession() {
      const active = await getCurrentAdminUser();
      if (active) {
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
        'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not yet connected. Click "Configure Database Credentials" below to connect, or use the Sandbox Preview Mode for testing.'
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your administrator email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminLogin(email.trim(), password);
      if (!result.success) {
        setErrorMsg(result.error || 'Invalid administrator credentials. Please verify your email and password.');
        setIsLoading(false);
        return;
      }

      setInfoMsg('Authentication verified. Loading stonework control dashboard...');
      setTimeout(() => {
        navigate('/admin');
      }, 700);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication request failed.');
      setIsLoading(false);
    }
  };

  const handleSandboxEnter = () => {
    setErrorMsg('');
    setInfoMsg('Entering Preview Sandbox Mode...');
    const res = enterPreviewSandbox(email.trim() || 'velquarath@gmail.com');
    if (res.success) {
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } else {
      setErrorMsg(res.error || 'Could not enter sandbox mode.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121415] text-[#F5F1E8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOHead
        title="Admin Portal Login | Velquarath Stoneworks"
        description="Authorized administrator access for Velquarath Stoneworks content management."
        canonicalPath="/admin/login"
      />

      {/* Background radial warmth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#B79A68]/5 blur-3xl pointer-events-none" />

      {/* Return to public site */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B9B5AC] hover:text-[#B79A68] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Monogram */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full border border-[#B79A68]/40 bg-[#1D2023] flex items-center justify-center shadow-xl shadow-black/50">
            <div className="w-8 h-8 border border-[#B79A68]/80 rotate-45 flex items-center justify-center">
              <span className="font-serif font-bold text-sm text-[#B79A68] -rotate-45">V</span>
            </div>
          </div>
        </div>

        <h2 className="text-center font-serif text-3xl font-bold tracking-tight text-[#F5F1E8]">
          Administrator Access
        </h2>
        <p className="mt-2 text-center text-xs text-[#8E8B82]">
          Secure Content &amp; Product Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-[#1D2023] py-8 px-6 sm:px-10 shadow-2xl border border-[#2D3237] rounded-xl space-y-6">
          {errorMsg && (
            <div
              role="alert"
              className="bg-red-950/40 border border-red-500/40 text-red-200 text-xs p-3.5 rounded flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Authentication Notice</span>
                <p className="text-[11px] leading-relaxed text-red-300/90">{errorMsg}</p>
              </div>
            </div>
          )}

          {infoMsg && (
            <div
              role="status"
              className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs p-3.5 rounded flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-medium text-[#DFD9CB] uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#8E8B82]" />
                </div>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="velquarath@gmail.com"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#17191B] border border-[#3E4348] rounded text-[#F5F1E8] placeholder-[#5A5F65] focus:outline-none focus:border-[#B79A68] text-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-[#DFD9CB] uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#8E8B82]" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 bg-[#17191B] border border-[#3E4348] rounded text-[#F5F1E8] placeholder-[#5A5F65] focus:outline-none focus:border-[#B79A68] text-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded shadow-sm text-xs font-bold uppercase tracking-widest text-[#17191B] bg-[#B79A68] hover:bg-[#CBB17F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B79A68] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In with Supabase'}
              </button>
            </div>
          </form>

          {/* Preview Sandbox Mode Option (Developer / AI Studio Preview) */}
          {isPreview && (
            <div className="pt-4 border-t border-[#2D3237] space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B79A68]" />
                <span className="text-[11px] font-semibold text-[#DFD9CB] uppercase tracking-wider">
                  Developer / Preview Mode
                </span>
              </div>
              <p className="text-[11px] text-[#8E8B82] leading-relaxed">
                Running in preview environment. You can test full admin capabilities locally via the Sandbox Admin session.
              </p>
              <button
                type="button"
                onClick={handleSandboxEnter}
                className="w-full py-2 px-3 bg-[#17191B] hover:bg-[#252A2E] text-[#B79A68] hover:text-[#CBB17F] border border-[#B79A68]/30 hover:border-[#B79A68] rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Enter Preview Sandbox Mode
              </button>
            </div>
          )}

          {/* Database Setup & Credentials Drawer Trigger (Admin-only) */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#8E8B82] hover:text-[#B79A68] transition-colors cursor-pointer"
            >
              <Settings className="w-3 h-3 text-[#B79A68]" />
              <span>Configure Database Credentials</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#2D3237] flex items-center justify-center gap-2 text-[#8E8B82] text-[10px]">
            <Shield className="w-3 h-3 text-[#B79A68]" />
            <span>Encrypted Session · Row Level Security Protected</span>
          </div>
        </div>
      </div>

      <ConfigureCredentialsModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
}
