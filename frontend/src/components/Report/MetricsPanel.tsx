import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, FileCode, AlertTriangle, Layers } from 'lucide-react';
import type { AnalysisReport } from '../../types';
import { getScoreStroke, cn } from '../../utils/helpers';

interface MetricsPanelProps {
  report: AnalysisReport;
}

const RISK_COLORS = {
  low: 'text-accent-green bg-green-400/10 border-green-400/20',
  medium: 'text-accent-amber bg-amber-400/10 border-amber-400/20',
  high: 'text-accent-red bg-red-400/10 border-red-400/20',
};

const COVERAGE_COLORS = {
  excellent: 'text-accent-green',
  good: 'text-accent-cyan',
  fair: 'text-accent-amber',
  poor: 'text-orange-400',
  none: 'text-accent-red',
};

export function MetricsPanel({ report }: MetricsPanelProps) {
  const { metrics } = report;

  const langData = Object.entries(metrics.languageBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([lang, pct]) => ({ lang, pct }));

  const metricCards = [
    {
      label: 'Lines of Code',
      value: metrics.estimatedLinesOfCode.toLocaleString(),
      icon: FileCode,
      sub: `${metrics.fileCount} files`,
    },
    {
      label: 'Complexity',
      value: metrics.complexityScore,
      icon: BarChart3,
      sub: 'complexity score',
      isScore: true,
    },
    {
      label: 'Maintainability',
      value: metrics.maintainabilityIndex,
      icon: Layers,
      sub: 'maintainability index',
      isScore: true,
    },
    {
      label: 'Code Smells',
      value: metrics.codeSmells,
      icon: AlertTriangle,
      sub: 'detected issues',
      color: metrics.codeSmells > 10 ? 'text-red-400' : metrics.codeSmells > 5 ? 'text-amber-400' : 'text-accent-green',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-bg-surface border border-bg-border rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <BarChart3 size={16} className="text-accent-amber" />
        </div>
        <h3 className="font-display text-white font-600 text-lg">Code Metrics</h3>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {metricCards.map(({ label, value, icon: Icon, sub, isScore, color }) => (
          <div key={label} className="p-4 bg-bg-elevated rounded-lg border border-bg-border">
            <Icon size={14} className="text-gray-500 mb-2" />
            <div
              className={cn(
                'font-mono text-xl font-600 mb-0.5',
                isScore ? undefined : color || 'text-white'
              )}
              style={isScore ? { color: getScoreStroke(Number(value)) } : {}}
            >
              {value}
            </div>
            <div className="font-body text-gray-500 text-xs">{label}</div>
            <div className="font-body text-gray-600 text-xs">{sub}</div>
          </div>
        ))}
      </div>

      {/* Test coverage & duplicate risk */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 bg-bg-elevated rounded-lg border border-bg-border">
          <p className="font-body text-gray-500 text-xs mb-1">Test Coverage</p>
          <p className={cn('font-display font-600 capitalize', COVERAGE_COLORS[metrics.testCoverage])}>
            {metrics.testCoverage}
          </p>
        </div>
        <div className="p-4 bg-bg-elevated rounded-lg border border-bg-border">
          <p className="font-body text-gray-500 text-xs mb-1">Duplicate Code Risk</p>
          <p className={cn(
            'font-display font-600 capitalize px-2 py-0.5 rounded-md text-sm inline-block border',
            RISK_COLORS[metrics.duplicateCodeRisk]
          )}>
            {metrics.duplicateCodeRisk}
          </p>
        </div>
      </div>

      {/* Language breakdown chart */}
      {langData.length > 0 && (
        <div>
          <h4 className="font-display text-gray-400 text-xs uppercase tracking-wider mb-3">
            Language Breakdown
          </h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={langData} barSize={24}>
                <XAxis
                  dataKey="lang"
                  tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    background: '#0d1117',
                    border: '1px solid #21262d',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(v: number) => [`${v}%`, 'Usage']}
                />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                  {langData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={['#00d9ff', '#39d353', '#f0a500', '#bd93f9', '#ff4757', '#fb923c'][i % 6]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  );
}
