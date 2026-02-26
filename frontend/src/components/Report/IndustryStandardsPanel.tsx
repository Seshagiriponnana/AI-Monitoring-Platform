import { motion } from 'framer-motion';
import type { AnalysisReport } from '../../types';

interface IndustryStandardsPanelProps {
  report: AnalysisReport;
}

export function IndustryStandardsPanel({ report }: IndustryStandardsPanelProps) {
  const { industryStandards } = report;

  const followed = industryStandards.standards.filter(s => s.status === 'followed').length;
  const partial = industryStandards.standards.filter(s => s.status === 'partial').length;
  const violated = industryStandards.standards.filter(s => s.status === 'violated').length;

  const getStatusStyle = (status: string) => {
    if (status === 'followed') return { border: 'border-green-400/20 bg-green-400/5', badge: 'text-green-400 border-green-400/30 bg-green-400/10', dot: 'bg-green-400' };
    if (status === 'partial') return { border: 'border-amber-400/20 bg-amber-400/5', badge: 'text-amber-400 border-amber-400/30 bg-amber-400/10', dot: 'bg-amber-400' };
    return { border: 'border-red-400/20 bg-red-400/5', badge: 'text-red-400 border-red-400/30 bg-red-400/10', dot: 'bg-red-400' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-bg-surface border border-bg-border rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
            <span className="text-accent-purple text-sm">📋</span>
          </div>
          <div>
            <h3 className="font-display text-white font-600 text-lg">Industry Standards</h3>
            <p className="text-gray-500 text-xs font-body">
              {industryStandards.standards.length} standards evaluated
            </p>
          </div>
        </div>
        <div className="font-mono text-2xl font-500 text-white">{industryStandards.score}</div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-bg-elevated rounded-lg border border-bg-border">
          <div className="font-display text-2xl font-700 text-accent-green">{followed}</div>
          <div className="font-body text-gray-500 text-xs mt-0.5">Followed</div>
        </div>
        <div className="text-center p-3 bg-bg-elevated rounded-lg border border-bg-border">
          <div className="font-display text-2xl font-700 text-accent-amber">{partial}</div>
          <div className="font-body text-gray-500 text-xs mt-0.5">Partial</div>
        </div>
        <div className="text-center p-3 bg-bg-elevated rounded-lg border border-bg-border">
          <div className="font-display text-2xl font-700 text-accent-red">{violated}</div>
          <div className="font-body text-gray-500 text-xs mt-0.5">Violated</div>
        </div>
      </div>

      {/* Standards list */}
      <div className="space-y-3 mb-6">
        {industryStandards.standards.map((standard, i) => {
          const style = getStatusStyle(standard.status);
          return (
            <div key={i} className={`p-4 rounded-lg border ${style.border}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`} />
                  <span className="font-display text-white text-sm font-600">
                    {standard.standard}
                  </span>
                </div>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono border capitalize ${style.badge}`}>
                  {standard.status}
                </span>
              </div>
              <p className="font-body text-gray-400 text-xs leading-relaxed mb-1">
                {standard.description}
              </p>
              <p className="font-body text-gray-500 text-xs">
                <span className="text-gray-400">Impact:</span> {standard.impact}
              </p>
            </div>
          );
        })}
      </div>

      {/* Frameworks & Patterns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {industryStandards.frameworks.length > 0 && (
          <div>
            <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider mb-2">
              Detected Frameworks
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {industryStandards.frameworks.map(f => (
                <span key={f} className="px-2.5 py-1 rounded-md bg-bg-elevated border border-bg-border text-gray-300 text-xs font-mono">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {industryStandards.patterns.length > 0 && (
          <div>
            <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider mb-2">
              Design Patterns
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {industryStandards.patterns.map(p => (
                <span key={p} className="px-2.5 py-1 rounded-md bg-accent-cyan/5 border border-accent-cyan/20 text-accent-cyan text-xs font-mono">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}