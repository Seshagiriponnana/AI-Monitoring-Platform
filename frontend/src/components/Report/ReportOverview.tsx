import { motion } from 'framer-motion';
import { Star, GitFork, AlertCircle, Calendar, Tag, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import type { AnalysisReport } from '../../types';
import { ScoreGauge } from '../ScoreGauge';
import { formatNumber, getScoreStroke, timeAgo } from '../../utils/helpers';

interface OverviewProps {
  report: AnalysisReport;
}

const ScoreBar = ({ label, score, delay }: { label: string; score: number; delay: number }) => {
  const color = getScoreStroke(score);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="font-body text-gray-400 text-xs">{label}</span>
        <span className="font-mono text-xs" style={{ color }}>{score}</span>
      </div>
      <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export function ReportOverview({ report }: OverviewProps) {
  const { repoMetadata: meta, scores } = report;

  const badges = [
    { label: 'README', ok: meta.hasReadme },
    { label: 'Tests', ok: meta.hasTests },
    { label: 'CI/CD', ok: meta.hasCI },
    { label: 'License', ok: !!meta.license },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
    >
      {/* Repo info */}
      <div className="lg:col-span-2 bg-bg-surface border border-bg-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-2xl font-700 text-white">{meta.name}</h2>
              {meta.language && (
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                  {meta.language}
                </span>
              )}
            </div>
            <p className="font-body text-gray-500 text-sm">{meta.fullName}</p>
            {meta.description && (
              <p className="font-body text-gray-300 text-sm mt-2 leading-relaxed">{meta.description}</p>
            )}
          </div>
          <a
            href={`https://github.com/${meta.fullName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-accent-cyan transition-colors flex-shrink-0 ml-4"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-gray-400 text-sm font-body">
            <Star size={14} className="text-amber-400" />
            {formatNumber(meta.stars)}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm font-body">
            <GitFork size={14} />
            {formatNumber(meta.forks)}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm font-body">
            <AlertCircle size={14} className="text-red-400" />
            {meta.openIssues} issues
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm font-body">
            <Calendar size={14} />
            Updated {timeAgo(meta.updatedAt)}
          </div>
          {meta.license && (
            <div className="flex items-center gap-1.5 text-gray-400 text-sm font-body">
              <Tag size={14} />
              {meta.license}
            </div>
          )}
        </div>

        {/* Quality badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map(({ label, ok }) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-body border ${
                ok
                  ? 'bg-green-400/5 border-green-400/20 text-green-400'
                  : 'bg-gray-800/50 border-bg-border text-gray-600'
              }`}
            >
              {ok ? <CheckCircle size={11} /> : <XCircle size={11} />}
              {label}
            </div>
          ))}
        </div>

        {/* Summary */}
        <p className="font-body text-gray-300 text-sm leading-relaxed bg-bg-elevated rounded-lg p-4 border border-bg-border">
          {report.summary}
        </p>

        {/* Score bars */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">
          <ScoreBar label="Code Quality" score={scores.codeQuality} delay={0.1} />
          <ScoreBar label="Security" score={scores.security} delay={0.2} />
          <ScoreBar label="Industry Standards" score={scores.industryStandards} delay={0.3} />
          <ScoreBar label="Maintainability" score={scores.maintainability} delay={0.4} />
          <ScoreBar label="Documentation" score={scores.documentation} delay={0.5} />
          <ScoreBar label="Testing" score={scores.testing} delay={0.6} />
        </div>
      </div>

      {/* Overall score */}
      <div className="bg-bg-surface border border-bg-border rounded-xl p-6 flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <p className="font-display text-gray-400 text-sm uppercase tracking-widest mb-4">Overall Score</p>
          <ScoreGauge score={report.overallScore} grade={report.grade} size="lg" />
        </div>

        {/* Strengths */}
        <div className="w-full space-y-2">
          <p className="font-display text-xs uppercase tracking-wider text-gray-500">Strengths</p>
          {report.strengths.slice(0, 3).map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-body text-gray-300">
              <CheckCircle size={11} className="text-accent-green flex-shrink-0 mt-0.5" />
              {s}
            </div>
          ))}
        </div>

        {/* Critical issues */}
        {report.criticalIssues.length > 0 && (
          <div className="w-full space-y-2">
            <p className="font-display text-xs uppercase tracking-wider text-gray-500">Critical Issues</p>
            {report.criticalIssues.slice(0, 2).map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-xs font-body text-red-400">
                <XCircle size={11} className="flex-shrink-0 mt-0.5" />
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
