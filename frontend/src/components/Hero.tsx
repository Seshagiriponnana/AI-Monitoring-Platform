import { motion } from 'framer-motion';
import { Github, Zap, Shield, BarChart3 } from 'lucide-react';

const features = [
  { icon: BarChart3, label: 'Code Quality Analysis' },
  { icon: Shield, label: 'Security Scanning' },
  { icon: Zap, label: 'AI-Powered Insights' },
  { icon: Github, label: 'GitHub Integration' },
];

export function Hero() {
  return (
    <div className="relative text-center mb-16">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan text-sm font-mono mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse-slow" />
        AI-Powered Repository Intelligence
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-6xl md:text-7xl font-800 text-white mb-6 leading-[1.05] tracking-tight"
      >
        Analyze Any{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">
          GitHub Repo
        </span>
        <br />
        in Seconds
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-body text-gray-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
      >
        Get instant AI-generated reports on code quality, security vulnerabilities,
        industry standards compliance, and personalized learning recommendations.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated border border-bg-border text-gray-400 text-sm font-body"
          >
            <Icon size={14} className="text-accent-cyan" />
            {label}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
