import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const STAGES = [
  { label: 'Connecting to GitHub API', duration: 1500 },
  { label: 'Fetching repository structure', duration: 2000 },
  { label: 'Reading code files', duration: 2500 },
  { label: 'Running security analysis', duration: 2000 },
  { label: 'Evaluating code quality', duration: 2000 },
  { label: 'Checking industry standards', duration: 1500 },
  { label: 'Generating AI insights', duration: 0 }, // stays until done
];

interface AnalyzingStateProps {
  repoUrl: string;
}

export function AnalyzingState({ repoUrl }: AnalyzingStateProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const repoName = repoUrl.split('/').slice(-2).join('/');

  useEffect(() => {
    let elapsed = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((stage, i) => {
      if (stage.duration > 0) {
        elapsed += stage.duration;
        const t = setTimeout(() => setCurrentStage(i + 1), elapsed);
        timeouts.push(t);
      }
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-xl mx-auto mt-16"
    >
      {/* Scanner animation */}
      <div className="relative h-32 rounded-xl bg-bg-surface border border-bg-border overflow-hidden mb-8">
        <div className="absolute inset-0 bg-grid-pattern bg-grid" />
        <motion.div
          animate={{ y: ['0%', '100%', '0%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent shadow-[0_0_8px_#00d9ff]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-mono text-accent-cyan text-sm mb-1">Analyzing</p>
            <p className="font-mono text-white text-lg font-500">{repoName}</p>
          </div>
        </div>
      </div>

      {/* Stage list */}
      <div className="space-y-3">
        {STAGES.map((stage, i) => (
          <motion.div
            key={stage.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {i < currentStage ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 rounded-full bg-accent-green flex items-center justify-center"
                >
                  <svg className="w-2.5 h-2.5 text-bg-base" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              ) : i === currentStage ? (
                <div className="w-4 h-4 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-bg-border" />
              )}
            </div>
            <span
              className={`font-body text-sm transition-colors ${
                i < currentStage
                  ? 'text-gray-500 line-through'
                  : i === currentStage
                  ? 'text-white'
                  : 'text-gray-600'
              }`}
            >
              {stage.label}
            </span>
            {i === currentStage && (
              <AnimatePresence>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-mono text-xs text-accent-cyan"
                >
                  processing...
                </motion.span>
              </AnimatePresence>
            )}
          </motion.div>
        ))}
      </div>

      <p className="text-center text-gray-600 font-body text-sm mt-8">
        This may take 30–90 seconds for large repositories
      </p>
    </motion.div>
  );
}
