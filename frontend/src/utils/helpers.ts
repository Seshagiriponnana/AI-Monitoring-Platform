import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-accent-green';
  if (score >= 60) return 'text-accent-amber';
  if (score >= 40) return 'text-orange-400';
  return 'text-accent-red';
}

export function getScoreStroke(score: number): string {
  if (score >= 80) return '#39d353';
  if (score >= 60) return '#f0a500';
  if (score >= 40) return '#fb923c';
  return '#ff4757';
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
    case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    case 'info': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'followed': return 'text-accent-green bg-green-400/10 border-green-400/30';
    case 'partial': return 'text-accent-amber bg-amber-400/10 border-amber-400/30';
    case 'violated': return 'text-accent-red bg-red-400/10 border-red-400/30';
    default: return 'text-gray-400';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'text-accent-red bg-red-400/10 border-red-400/30';
    case 'medium': return 'text-accent-amber bg-amber-400/10 border-amber-400/30';
    case 'low': return 'text-accent-cyan bg-cyan-400/10 border-cyan-400/30';
    default: return 'text-gray-400';
  }
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
