import { motion } from 'framer-motion';
import { Code2, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { AnalysisReport } from '../../types';
import { cn } from '../../utils/helpers';

interface CodeQualityPanelProps {
  report: AnalysisReport;
}

const TYPE_COLORS: Record<string, string> = {
  error: 'text-red-400 bg-red-400/10 border-red-400/30',
  warning: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  info: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  suggestion: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
};

const TYPE_ORDER = { error: 0, warning: 1, info: 2, suggestion: 3 };

export function CodeQualityPanel({ report }: CodeQualityPanelProps) {
  const { codeQuality } = report;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const sorted = [...codeQuality.issues].sort(
    (a, b) => (TYPE_ORDER[a.type] ?? 9) - (TYPE_ORDER[b.type] ?? 9)
  );

  const filtered = filter === 'all' ? sorted : sorted.filter(i => i.type === filter);
  const counts = sorted.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-bg-surface border border-bg-border rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
            <Code2 size={16} className="text-accent-cyan" />
          </div>
          <div>
            <h3 className="font-display text-white font-600 text-lg">Code Quality</h3>
            <p className="text-gray-500 text-xs font-body">{codeQuality.issues.length} issues found</p>
          </div>
        </div>
        <div className="font-mono text-2xl font-500 text-white">{codeQuality.score}</div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'error', 'warning', 'info', 'suggestion'].map(t => {
          const count = t === 'all' ? sorted.length : counts[t] || 0;
          if (t !== 'all' && !count) return null;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-mono border capitalize transition-all',
                filter === t
                  ? t === 'all'
                    ? 'bg-white/10 border-white/20 text-white'
                    : cn(TYPE_COLORS[t])
                  : 'bg-transparent border-bg-border text-gray-500 hover:text-gray-300'
              )}
            >
              {t} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Issues list */}
      <div className="space-y-2 mb-6">
        {filtered.map((issue, i) => (
          <div key={i} className="border border-bg-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-bg-elevated/50 transition-colors"
            >
              <span
                className={cn(
                  'flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono uppercase border',
                  TYPE_COLORS[issue.type] || TYPE_COLORS.info
                )}
              >
                {issue.type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-white text-sm font-500 truncate">{issue.title}</p>
                <p className="font-mono text-gray-500 text-xs">{issue.category}</p>
              </div>
              {expandedIdx === i
                ? <ChevronUp size={14} className="text-gray-500 flex-shrink-0" />
                : <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />
              }
            </button>

            {expandedIdx === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 pb-4 bg-bg-elevated/30 border-t border-bg-border"
              >
                {issue.file && (
                  <p className="font-mono text-accent-cyan text-xs mt-3 mb-2">{issue.file}</p>
                )}
                <p className="font-body text-gray-300 text-sm leading-relaxed">
                  {issue.description}
                </p>
                <div className="mt-3 p-3 rounded-lg bg-accent-purple/5 border border-purple-400/20">
                  <p className="font-display text-purple-400 text-xs uppercase tracking-wider mb-1">
                    Fix
                  </p>
                  <p className="font-body text-gray-300 text-sm">{issue.recommendation}</p>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Positives */}
      {codeQuality.positives.length > 0 && (
        <div>
          <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider mb-3">
            What's Done Well
          </h4>
          <div className="space-y-2">
            {codeQuality.positives.map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-sm font-body text-gray-300">
                <CheckCircle size={13} className="text-accent-green flex-shrink-0 mt-0.5" />
                {p}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
