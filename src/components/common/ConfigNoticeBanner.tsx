import React, { useState } from 'react';
import { Database, AlertCircle, X, ChevronRight, Copy, Check } from 'lucide-react';
import { isSupabaseConfigured } from '../../config/supabase';

export const ConfigNoticeBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isSupabaseConfigured || isDismissed) {
    return null;
  }

  const sampleEnv = `VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold">Supabase Pending:</span>
            <span className="hidden sm:inline text-amber-800">
              Database & auth are in public preview mode. Add Supabase keys to enable live real-time queries.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowModal(true)}
              className="font-semibold text-emerald-900 underline hover:text-emerald-950 flex items-center gap-1"
            >
              <span>Setup Guide & SQL</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-amber-700 hover:text-amber-950 p-0.5"
              title="Dismiss for this session"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-stone-900">
                <Database className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold">Supabase PostgreSQL Setup</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-2.5 leading-relaxed">
              <p>
                Shamba Link is engineered with direct PostgreSQL and Supabase Auth integration. Follow these quick steps to connect your live Supabase project:
              </p>

              <ol className="list-decimal pl-4 space-y-1.5 font-medium text-stone-800">
                <li>
                  Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-800 underline">supabase.com</a> and create a new project.
                </li>
                <li>
                  Open the <strong>SQL Editor</strong> tab in Supabase and run the schema file located at <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900 font-mono">/supabase/schema.sql</code>.
                </li>
                <li>
                  In Supabase <strong>Project Settings → API</strong>, copy the Project URL and Anon Key.
                </li>
                <li>
                  Add them to your <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-900 font-mono">.env</code> file:
                </li>
              </ol>

              <div className="relative mt-2">
                <pre className="bg-stone-900 text-stone-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                  {sampleEnv}
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-900 text-xs flex items-start gap-2 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  The marketplace, authentication routes, and inquiry calculations are already fully functional. You can test the interface immediately.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-stone-900 text-white font-semibold rounded-lg text-xs hover:bg-stone-800 transition-colors"
            >
              Close Setup Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
};
