import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero } from './components/Hero';
import { RepoInput } from './components/RepoInput';
import { AnalyzingState } from './components/AnalyzingState';
import { ReportDashboard } from './components/Report/ReportDashboard';
import { analyzeRepository } from './api/client';
import type { AnalysisReport } from './types';

type AppState = 'idle' | 'analyzing' | 'report';

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [currentRepo, setCurrentRepo] = useState('');

  const handleAnalyze = async (url: string, branch?: string) => {
    setCurrentRepo(url);
    setState('analyzing');

    try {
      const result = await analyzeRepository(url, branch);
      setReport(result);
      setState('report');
      toast.success('Analysis complete!', { style: { background: '#0d1117', color: '#fff', border: '1px solid #21262d' } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Analysis failed';
      toast.error(message, {
        style: { background: '#0d1117', color: '#fff', border: '1px solid #ff4757' },
        duration: 6000,
      });
      setState('idle');
    }
  };

  const handleReset = () => {
    setState('idle');
    setReport(null);
    setCurrentRepo('');
  };

  return (
    <div className="min-h-screen bg-bg-base text-white font-body">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-base pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 border-b border-bg-border bg-bg-base/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-cyan flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M4 10h12M10 4v12M6 6l8 8M14 6l-8 8" stroke="#06080f" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-display font-700 text-white text-lg">CodeWatch</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-slow" />
            AI-Powered
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
              <RepoInput onAnalyze={handleAnalyze} isLoading={false} />
            </motion.div>
          )}

          {state === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnalyzingState repoUrl={currentRepo} />
            </motion.div>
          )}

          {state === 'report' && report && (
            <motion.div
              key="report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReportDashboard report={report} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {state === 'idle' && (
        <footer className="relative z-10 border-t border-bg-border mt-24 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-mono text-gray-600 text-xs">
              CodeWatch — AI Repository Analyzer powered by Claude
            </p>
          </div>
        </footer>
      )}

      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
