import React from 'react';
import { Sparkles, AlertTriangle, XCircle } from 'lucide-react';

interface BadgeScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const BadgeScore: React.FC<BadgeScoreProps> = ({ 
  score, 
  size = 'md',
  showLabel = true 
}) => {
  // Regra de cores: >=70% verde, 50-69% amarelo, <50% vermelho
  let colorStyles = '';
  let Icon = Sparkles;
  let classification = '';

  if (score >= 70) {
    colorStyles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-glow-emerald';
    Icon = Sparkles;
    classification = 'Alta Aderência';
  } else if (score >= 50) {
    colorStyles = 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-glow-amber';
    Icon = AlertTriangle;
    classification = 'Aderência Média';
  } else {
    colorStyles = 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-glow-rose';
    Icon = XCircle;
    classification = 'Baixa Aderência';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 15,
    lg: 18,
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border backdrop-blur-sm transition-all duration-200 ${colorStyles} ${sizeClasses}`}
      title={`Score de Aderência: ${score}% - ${classification}`}
    >
      <Icon size={iconSizes} className="shrink-0" />
      <span className="font-bold">{score}%</span>
      {showLabel && size !== 'sm' && (
        <span className="opacity-85 text-xs font-normal ml-0.5 hidden sm:inline">
          {classification}
        </span>
      )}
    </span>
  );
};
