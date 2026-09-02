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
      dot: "bg-[#2EA334]",
      text: "text-[#2EA334]",
      badge: "bg-[#2EA334]/12 border-[#2EA334]/30 text-[#2EA334]",
      defaultLabel: "Verified / Low risk",
    },
    suspicious: {
      dot: "bg-[#B19C7A]",
      text: "text-[#5A4434]",
      badge: "bg-[#EED4AC]/50 border-[#B19C7A]/40 text-[#5A4434]",
      defaultLabel: "Watch / Moderate risk",
    },
    highRisk: {
      dot: "bg-[#B94A48]",
      text: "text-[#B94A48]",
      badge: "bg-[#B94A48]/12 border-[#B94A48]/30 text-[#B94A48]",
      defaultLabel: "High risk",
    },
    critical: {
      dot: "bg-[#B94A48]",
      text: "text-[#B94A48]",
      badge: "bg-[#B94A48]/18 border-[#B94A48]/40 text-[#B94A48] font-semibold",
      defaultLabel: "Critical risk",
    },
    neutral: {
      dot: "bg-[#B9A78D]",
      text: "text-[#5A4434]",
      badge: "bg-[#EED4AC]/30 border-[#E3D5C0] text-[#5A4434]",
      defaultLabel: "Neutral",
    },
  };

  const currentStyle = styles[level] || styles.neutral;
  const displayLabel = label || currentStyle.defaultLabel;

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1.5",
    md: "px-3 py-1 text-xs gap-2",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClasses[size]} ${currentStyle.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${currentStyle.dot}`} />
      <span>{displayLabel}</span>
    </span>
  );
};
