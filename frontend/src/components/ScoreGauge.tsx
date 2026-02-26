import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
import { getScoreStroke } from '../utils/helpers';

interface ScoreGaugeProps {
  score: number;
  grade: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreGauge({ score, grade, label, size = 'md' }: ScoreGaugeProps) {
  const sizeMap = { sm: 80, md: 120, lg: 160 };
  const dim = sizeMap[size];
  const color = getScoreStroke(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center gap-2"
    >
      <div style={{ width: dim, height: dim }} className="relative">
        <CircularProgressbar
          value={score}
          styles={buildStyles({
            pathColor: color,
            trailColor: '#21262d',
            strokeLinecap: 'round',
            pathTransitionDuration: 1.5,
          })}
          strokeWidth={8}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-800 text-white" style={{ fontSize: dim / 3.5 }}>
            {grade}
          </span>
          <span className="font-mono text-gray-400" style={{ fontSize: dim / 6.5 }}>
            {score}/100
          </span>
        </div>
      </div>
      {label && (
        <span className="font-body text-gray-400 text-xs text-center">{label}</span>
      )}
    </motion.div>
  );
}
