import React from 'react';

export type RiskLevel = 'verified' | 'suspicious' | 'highRisk' | 'critical' | 'neutral';

export interface RiskIndicatorProps {
  level: RiskLevel;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  label,
  size = 'md',
}) => {
  const styles = {
    verified: {
      dot: "bg-[#2E7D50]",
      text: "text-[#2E7D50]",
      badge: "bg-[#2E7D50]/10 border-[#2E7D50]/30 text-[#2E7D50]",
      defaultLabel: "Verified / Low risk",
    },
    suspicious: {
      dot: "bg-[#B0783C]",
      text: "text-[#625E55]",
      badge: "bg-[#B0783C]/10 border-[#B0783C]/30 text-[#625E55]",
      defaultLabel: "Watch / Moderate risk",
    },
    highRisk: {
      dot: "bg-[#A83F3F]",
      text: "text-[#A83F3F]",
      badge: "bg-[#A83F3F]/10 border-[#A83F3F]/30 text-[#A83F3F]",
      defaultLabel: "High risk",
    },
    critical: {
      dot: "bg-[#A83F3F]",
      text: "text-[#A83F3F]",
      badge: "bg-[#A83F3F]/15 border-[#A83F3F]/35 text-[#A83F3F] font-semibold",
      defaultLabel: "Critical risk",
    },
    neutral: {
      dot: "bg-[#8C877C]",
      text: "text-[#625E55]",
      badge: "bg-[#EFE8DA] border-[#D8D1C4] text-[#625E55]",
      defaultLabel: "Neutral",
    },
  };

  const currentStyle = styles[level] || styles.neutral;
  const displayLabel = label || currentStyle.defaultLabel;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-2",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  return (
    <span className={`inline-flex items-center rounded border font-medium ${sizeClasses[size]} ${currentStyle.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentStyle.dot}`} />
      <span>{displayLabel}</span>
    </span>
  );
};
