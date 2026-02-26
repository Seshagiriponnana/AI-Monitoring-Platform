import { motion } from 'framer-motion';
import { Download, RefreshCw, Clock } from 'lucide-react';
import type { AnalysisReport } from '../../types';
import { ReportOverview } from './ReportOverview';
import { CodeQualityPanel } from './CodeQualityPanel';
import { SecurityPanel } from './SecurityPanel';
import { IndustryStandardsPanel } from './IndustryStandardsPanel';
import { MetricsPanel } from './MetricsPanel';
import { LearningPanel } from './LearningPanel';

interface ReportDashboardProps {
  report: AnalysisReport;
  onReset: () => void;
}

export function ReportDashboard({ report, onReset }: ReportDashboardProps) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codewatch-${report.repoMetadata.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* Report header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-accent-cyan text-xs mb-1">
            Report generated {new Date(report.generatedAt).toLocaleString()}
          </p>
          <h2 className="font-display text-2xl font-700 text-white">
            Analysis Report
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-gray-500 text-xs font-mono">
            <Clock size={12} />
            v{report.analysisVersion}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-bg-border bg-bg-elevated text-gray-300 text-sm font-body hover:border-gray-500 hover:text-white transition-all"
          >
            <Download size={14} />
            Export JSON
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan text-sm font-body hover:bg-accent-cyan/10 transition-all"
          >
            <RefreshCw size={14} />
            New Analysis
          </button>
        </div>
      </div>

      {/* Overview section */}
      <ReportOverview report={report} />

      {/* Main panels grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CodeQualityPanel report={report} />
        <SecurityPanel report={report} />
        <IndustryStandardsPanel report={report} />
        <MetricsPanel report={report} />
      </div>

      {/* Learning panel - full width */}
      <LearningPanel report={report} />
    </motion.div>
  );
}
