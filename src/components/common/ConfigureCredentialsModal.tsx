import React, { useState } from 'react';
import { Database, X, CheckCircle2, AlertCircle, RefreshCw, Key, Globe, Shield, ExternalLink } from 'lucide-react';
import {
  getSupabaseConfig,
  saveRuntimeCredentials,
  clearRuntimeCredentials,
  testSupabaseConnection,
} from '../../lib/supabaseClient';
import { useContent } from '../../context/ContentContext';

interface ConfigureCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigureCredentialsModal({ isOpen, onClose }: ConfigureCredentialsModalProps) {
  const { retryConnection } = useContent();
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig?.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig?.anonKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    error?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestResult(null);
    setIsTesting(true);

    try {
      const saveRes = saveRuntimeCredentials(url, anonKey);
      if (!saveRes.success) {
        setTestResult({
          ok: false,
          message: saveRes.error || 'Invalid credentials format.',
        });
        setIsTesting(false);
        return;
      }

      const res = await testSupabaseConnection();
      setTestResult(res);

      if (res.ok) {
        await retryConnection();
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: 'Unexpected error during connection test.',
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    clearRuntimeCredentials();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    retryConnection();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#1A1D20] border border-[#B79A68]/40 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141618] border-b border-[#2D3237]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#252A2E] border border-[#B79A68]/30 text-[#B79A68]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#F5F1E8]">
                Supabase Credentials & Diagnostics
              </h3>
              <p className="text-xs text-[#8E8B82]">
                Configure and test live connection to your Supabase project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8E8B82] hover:text-[#F5F1E8] hover:bg-[#252A2E] rounded transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#DFD9CB] text-xs">
          {/* Current Status banner */}
          <div className="p-3 rounded bg-[#202428] border border-[#2D3237] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-[#B79A68]">
                Current Configuration Status
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  currentConfig
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                }`}
              >
                {currentConfig ? `Configured (${currentConfig.source})` : 'Not Configured'}
              </span>
            </div>
            <p className="text-[#8E8B82] text-[11px] leading-relaxed">
              {currentConfig
                ? `Using ${currentConfig.source === 'build_time_env' ? 'Cloudflare build-time environment variables' : 'browser runtime credentials'}.`
                : 'Vite build environment variables were missing when this bundle was deployed.'}
            </p>
          </div>

          {/* Test connection result */}
          {testResult && (
            <div
              className={`p-3.5 rounded border text-xs flex items-start gap-3 ${
                testResult.ok
                  ? 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'
                  : 'bg-red-950/50 border-red-800/80 text-red-200'
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
                  <p className="text-[11px] opacity-80 font-mono break-all bg-black/30 p-1.5 rounded">
                    {testResult.error}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Runtime Credentials Form */}
          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#DFD9CB] mb-1.5">
                Supabase Project URL (VITE_SUPABASE_URL)
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-project-id.supabase.co"
                  className="w-full bg-[#121415] border border-[#2D3237] focus:border-[#B79A68] focus:outline-none text-[#F5F1E8] text-xs rounded px-3 py-2 pl-9 font-mono"
                />
                <Globe className="w-4 h-4 text-[#8E8B82] absolute left-3 top-2.5" />
              </div>
              <span className="text-[10px] text-[#8E8B82] mt-1 block">
                Found in your Supabase Dashboard under Project Settings &gt; API
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#DFD9CB] mb-1.5">
                Supabase Anon / Public Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-[#121415] border border-[#2D3237] focus:border-[#B79A68] focus:outline-none text-[#F5F1E8] text-xs rounded px-3 py-2 pl-9 font-mono"
                />
                <Key className="w-4 h-4 text-[#8E8B82] absolute left-3 top-2.5" />
              </div>
              <span className="text-[10px] text-[#8E8B82] mt-1 block">
                The public anon JWT token (safe for browser client-side use).
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={isTesting}
                className="inline-flex items-center gap-1.5 bg-[#B79A68] hover:bg-[#CBB17F] text-[#17191B] font-bold text-xs px-4 py-2 rounded transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Testing Connection...' : 'Test & Connect'}</span>
              </button>

              {currentConfig?.source === 'browser_storage' && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 border border-[#3E4348] text-[#8E8B82] hover:text-[#DFD9CB] rounded transition-colors text-xs cursor-pointer"
                >
                  Clear Saved Credentials
                </button>
              )}
            </div>
          </form>

          {/* Cloudflare Deployment Instructions */}
          <div className="p-4 rounded bg-[#141618] border border-[#B79A68]/30 space-y-2.5">
            <div className="flex items-center gap-2 text-[#B79A68] font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Permanent Cloudflare Configuration (All Visitors)</span>
            </div>
            <p className="text-[11px] text-[#8E8B82] leading-relaxed">
              Because Vite is a client-side bundler, it inlines <code>import.meta.env.VITE_*</code> into JavaScript static assets at <strong>build time</strong>. To ensure all site visitors connect to Supabase automatically:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#DFD9CB]">
              <li>
                Open the <strong className="text-[#F5F1E8]">Cloudflare Dashboard</strong> &gt; <strong className="text-[#F5F1E8]">Workers &amp; Pages</strong> &gt; <strong className="text-[#F5F1E8]">Tombstone-Demo</strong>.
              </li>
              <li>
                Navigate to <strong className="text-[#F5F1E8]">Settings</strong> &gt; <strong className="text-[#F5F1E8]">Variables and Secrets</strong> (or Environment Variables).
              </li>
              <li>
                Add <code className="bg-[#202428] px-1 py-0.5 rounded text-[#B79A68]">VITE_SUPABASE_URL</code> and <code className="bg-[#202428] px-1 py-0.5 rounded text-[#B79A68]">VITE_SUPABASE_ANON_KEY</code>.
              </li>
              <li>
                <strong className="text-amber-400">Important:</strong> Trigger a <strong className="text-amber-400">Rebuild &amp; Deploy</strong> from the Deployments tab so Vite bundles your keys into the production static assets.
              </li>
            </ol>
            <div className="pt-1">
              <a
                href="https://dash.cloudflare.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#B79A68] hover:underline"
              >
                <span>Open Cloudflare Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#141618] border-t border-[#2D3237] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#252A2E] hover:bg-[#2F353A] text-[#DFD9CB] rounded text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
