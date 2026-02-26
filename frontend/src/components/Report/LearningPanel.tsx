import { motion } from 'framer-motion';
import { GraduationCap, ExternalLink, Lightbulb, Tag } from 'lucide-react';
import type { AnalysisReport } from '../../types';
import { getPriorityColor, cn } from '../../utils/helpers';

interface LearningPanelProps {
  report: AnalysisReport;
}

export function LearningPanel({ report }: LearningPanelProps) {
  const { learningRecommendations, keyConcepts, architectureInsights, performanceNotes } = report;

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...learningRecommendations].sort(
    (a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-bg-surface border border-bg-border rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
          <GraduationCap size={16} className="text-accent-cyan" />
        </div>
        <h3 className="font-display text-white font-600 text-lg">Learning & Insights</h3>
      </div>

      {/* Key concepts */}
      {keyConcepts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Tag size={11} />
            Key Concepts in This Codebase
          </h4>
          <div className="flex flex-wrap gap-2">
            {keyConcepts.map(concept => (
              <span
                key={concept}
                className="px-3 py-1.5 rounded-lg bg-bg-elevated border border-bg-border text-gray-300 text-xs font-mono"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Architecture insights */}
      {architectureInsights && (
        <div className="mb-6 p-4 bg-accent-purple/5 border border-purple-400/20 rounded-lg">
          <h4 className="font-display text-accent-purple text-xs uppercase tracking-wider mb-2">
            Architecture Insights
          </h4>
          <p className="font-body text-gray-300 text-sm leading-relaxed">{architectureInsights}</p>
        </div>
      )}

      {/* Learning recommendations */}
      {sorted.length > 0 && (
        <div className="mb-6">
          <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Lightbulb size={11} />
            Recommended Learning
          </h4>
          <div className="space-y-3">
            {sorted.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="p-4 bg-bg-elevated border border-bg-border rounded-lg"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-display text-white text-sm font-600">{rec.topic}</span>
                  <span
                    className={cn(
                      'flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono capitalize border',
                      getPriorityColor(rec.priority)
                    )}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="font-body text-gray-400 text-xs leading-relaxed mb-3">
                  {rec.description}
                </p>
                {rec.resources.length > 0 && (
                  <div>
                    <p className="font-body text-gray-600 text-xs mb-1.5">Resources:</p>
                    <div className="flex flex-col gap-1">
                      {rec.resources.map((r, ri) => (
                        <div key={ri} className="flex items-center gap-1.5 text-xs font-mono text-accent-cyan">
                          <ExternalLink size={10} />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Performance notes */}
      {performanceNotes.length > 0 && (
        <div>
          <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider mb-3">
            Performance Notes
          </h4>
          <div className="space-y-2">
            {performanceNotes.map((note, i) => (
              <div key={i} className="flex items-start gap-2 text-sm font-body text-gray-300">
                <span className="text-accent-amber mt-0.5 flex-shrink-0">▸</span>
                {note}
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
