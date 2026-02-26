import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '../utils/helpers';

interface RepoInputProps {
  onAnalyze: (url: string, branch?: string) => void;
  isLoading: boolean;
}

const EXAMPLE_REPOS = [
  'https://github.com/vercel/next.js',
  'https://github.com/facebook/react',
  'https://github.com/microsoft/vscode',
  'https://github.com/expressjs/express',
];

export function RepoInput({ onAnalyze, isLoading }: RepoInputProps) {
  const [url, setUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onAnalyze(url.trim(), branch.trim() || undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main input */}
        <div
          className={cn(
            'relative flex items-center rounded-xl border transition-all duration-200',
            'bg-bg-surface overflow-hidden',
            isFocused
              ? 'border-accent-cyan/60 shadow-lg shadow-accent-cyan/10'
              : 'border-bg-border hover:border-gray-600'
          )}
        >
          <div className="pl-5 pr-3 text-gray-500 flex-shrink-0">
            <Github size={20} />
          </div>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="https://github.com/owner/repository"
            className="flex-1 bg-transparent py-4 pr-3 text-white font-mono text-base placeholder:text-gray-600 outline-none"
            disabled={isLoading}
            required
          />

          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className={cn(
              'flex items-center gap-2 px-6 py-4 font-display font-600 text-sm transition-all duration-200',
              'bg-accent-cyan text-bg-base rounded-r-xl',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'hover:bg-cyan-300 active:scale-95',
              !url.trim() || isLoading ? '' : 'cursor-pointer'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Analyze</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Advanced options */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-gray-500 text-sm font-body hover:text-gray-300 transition-colors ml-1"
          >
            <ChevronDown
              size={14}
              className={cn('transition-transform', showAdvanced && 'rotate-180')}
            />
            Advanced options
          </button>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pl-1"
            >
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="Branch name (optional, defaults to main/master)"
                className="w-full bg-bg-surface border border-bg-border rounded-lg px-4 py-2.5 text-white font-mono text-sm placeholder:text-gray-600 outline-none focus:border-accent-cyan/50 transition-colors"
              />
            </motion.div>
          )}
        </div>

        {/* Example repos */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-gray-600 text-xs font-body">Try:</span>
          {EXAMPLE_REPOS.map((repo) => {
            const name = repo.split('/').slice(-2).join('/');
            return (
              <button
                key={repo}
                type="button"
                onClick={() => setUrl(repo)}
                className="text-xs font-mono text-gray-500 hover:text-accent-cyan transition-colors px-2 py-0.5 rounded border border-bg-border hover:border-accent-cyan/30 bg-bg-elevated"
              >
                {name}
              </button>
            );
          })}
        </div>
      </form>
    </motion.div>
  );
}
