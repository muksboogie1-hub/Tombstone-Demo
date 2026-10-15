import { useState } from 'react';
import { WifiOff, Database, RefreshCw, X, AlertTriangle, Settings } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ConfigureCredentialsModal } from './ConfigureCredentialsModal';

export function PersistentOfflineNotice() {
  const { isOffline, isMissingTables, isConfigured, retryConnection, lastError } = useContent();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // If connected and no errors, do not render
  if ((!isOffline && !isMissingTables) || isDismissed) {
    return null;
  }

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryConnection();
    } finally {
      setIsRetrying(false);
    }
  };

  let title = 'Offline Baseline Mode';
  let message = 'Displaying verified local masonry portfolio baseline. Live database is currently unreachable.';
  let icon = <WifiOff className="w-4 h-4 text-[#B79A68] shrink-0" />;

  if (!isConfigured) {
    title = 'Database Notice';
    message = 'Displaying verified local masonry baseline. Supabase environment credentials are not yet configured.';
    icon = <Database className="w-4 h-4 text-[#B79A68] shrink-0" />;
  } else if (isMissingTables) {
    title = 'Database Migration Required';
    message = 'Supabase database tables are not initialized. Run the SQL schema script in the Supabase Dashboard SQL Editor.';
    icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
  }

  return (
    <>
      <div
        role="alert"
        className="bg-[#121415] border-b border-[#B79A68]/40 text-[#DFD9CB] text-xs py-2 px-4 shadow-lg sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-center sm:text-left flex-wrap">
            {icon}
            <div>
              <strong className="text-[#B79A68] uppercase tracking-wider text-[11px] mr-1.5 font-bold">
                [{title}]
              </strong>
              <span className="text-[#B9B5AC] text-[11px] leading-relaxed">
                {message}
              </span>
              {lastError && (
                <span className="block sm:inline text-[10px] text-amber-300/90 sm:ml-2 font-mono bg-black/40 px-1.5 py-0.5 rounded mt-1 sm:mt-0">
                  {lastError}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowConfigModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#1E2225] hover:bg-[#282D32] text-[#DFD9CB] hover:text-[#F5F1E8] border border-[#3E4348] text-[11px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
              title="Configure or test Supabase connection"
            >
              <Settings className="w-3 h-3 text-[#B79A68]" />
              <span>Configure Credentials</span>
            </button>

            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 bg-[#252A2E] hover:bg-[#2F353A] text-[#B79A68] hover:text-[#CBB17F] border border-[#B79A68]/40 text-[11px] font-semibold px-3 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Testing...' : 'Retry Connection'}</span>
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss offline notice"
              className="p-1 text-[#8E8B82] hover:text-[#F5F1E8] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <ConfigureCredentialsModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </>
  );
}
