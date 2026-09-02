import React from 'react';

export type RiskLevel = 'verified' | 'suspicious' | 'highRisk' | 'low' | 'medium' | 'high' | 'critical' | 'neutral';

export interface RiskIndicatorProps {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  label,
  size = 'md',
  showDot = true,
}) => {
  const getLevelConfig = (l: RiskLevel) => {
    switch (l) {
      case 'verified':
      case 'low':
        return {
          bg: 'bg-[#35D49A]/10',
          border: 'border-[#35D49A]/20',
          text: 'text-[#35D49A]',
          dot: 'bg-[#35D49A]',
          defaultLabel: l === 'verified' ? 'Verified' : 'Low Threat',
        };
      case 'suspicious':
      case 'medium':
        return {
          bg: 'bg-[#FFB84D]/10',
          border: 'border-[#FFB84D]/20',
          text: 'text-[#FFB84D]',
          dot: 'bg-[#FFB84D]',
          defaultLabel: l === 'suspicious' ? 'Suspicious' : 'Medium Threat',
        };
      case 'highRisk':
      case 'high':
      case 'critical':
        return {
          bg: 'bg-[#FF5F6D]/10',
          border: 'border-[#FF5F6D]/20',
          text: 'text-[#FF5F6D]',
          dot: 'bg-[#FF5F6D]',
          defaultLabel: l === 'critical' ? 'Critical Threat' : l === 'high' ? 'High Threat' : 'High Risk',
        };
      default:
        return {
          bg: 'bg-white/5',
          border: 'border-white/10',
          text: 'text-[#8992A7]',
          dot: 'bg-[#8992A7]',
          defaultLabel: 'Neutral',
        };
    }
  };

  const config = getLevelConfig(level);
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-[11px] gap-1.5' 
    : 'px-2.5 py-1 text-xs gap-2';

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border ${config.bg} ${config.border} ${config.text} ${sizeClasses}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      <span>{displayLabel}</span>
    </span>
  );
};
