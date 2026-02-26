import { motion } from 'framer-motion';
import { Shield, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { AnalysisReport } from '../../types';
import { getSeverityColor, cn } from '../../utils/helpers';

interface SecurityPanelProps {
  report: AnalysisReport;
}

const RISK_COLORS = {
  critical: 'text-red-400 bg-red-400/10 border-red-400/30',
  high: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  low: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  minimal: 'text-green-400 bg-green-400/10 border-green-400/30',
};

export function SecurityPanel({ report }: SecurityPanelProps) {
  const { security } = report;
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  const sorted = [...security.vulnerabilities].sort(
    (a, b) => (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-bg-surface border border-bg-border rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center">
            <Shield size={16} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-display text-white font-600 text-lg">Security Analysis</h3>
            <p className="text-gray-500 text-xs font-body">
              {security.vulnerabilities.length} vulnerabilities detected
            </p>
          </div>
        </div>
        <div className="text-right">
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-body capitalize',
              RISK_COLORS[security.riskLevel]
            )}
          >
            <AlertTriangle size={12} />
            {security.riskLevel} Risk
          </div>
          <div className="font-mono text-2xl font-500 text-white mt-1">{security.score}</div>
        </div>
      </div>

      {/* Vulnerabilities */}
      {sorted.length > 0 ? (
        <div className="space-y-3 mb-6">
          <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider">Vulnerabilities</h4>
          {sorted.map((vuln, i) => (
            <div
              key={i}
              className="border border-bg-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-bg-elevated/50 transition-colors"
              >
                <span
                  className={cn(
                    'flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono uppercase border',
                    getSeverityColor(vuln.severity)
                  )}
                >
                  {vuln.severity}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-white text-sm font-500 truncate">{vuln.title}</p>
                  {vuln.file && (
                    <p className="font-mono text-gray-500 text-xs truncate">{vuln.file}</p>
                  )}
                </div>
                {vuln.cwe && (
                  <span className="font-mono text-xs text-gray-600 flex-shrink-0">{vuln.cwe}</span>
                )}
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
                  <p className="font-body text-gray-300 text-sm mt-3 leading-relaxed">
                    {vuln.description}
                  </p>
                  <div className="mt-3 p-3 rounded-lg bg-accent-green/5 border border-accent-green/20">
                    <p className="font-display text-accent-green text-xs uppercase tracking-wider mb-1">
                      Recommendation
                    </p>
                    <p className="font-body text-gray-300 text-sm">{vuln.recommendation}</p>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center mb-6">
          <ShieldCheck size={40} className="text-accent-green mb-3" />
          <p className="font-display text-white font-500">No vulnerabilities detected</p>
          <p className="font-body text-gray-500 text-sm">This codebase appears secure</p>
        </div>
      )}

      {/* Passed checks */}
      {security.passedChecks.length > 0 && (
        <div>
          <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider mb-3">
            Passed Security Checks
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {security.passedChecks.map((check, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs font-body text-gray-400 bg-bg-elevated rounded-lg px-3 py-2"
              >
                <ShieldCheck size={12} className="text-accent-green flex-shrink-0" />
                {check}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
