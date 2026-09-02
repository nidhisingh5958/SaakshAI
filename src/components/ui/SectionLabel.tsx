import React from 'react';

export interface SectionLabelProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  icon,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-mono text-[#62605B] ${className}`}>
      {icon && <span className="flex-shrink-0 text-[#315C4B]">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
