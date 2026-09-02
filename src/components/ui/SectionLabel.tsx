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
    <div className={`inline-flex items-center gap-2 text-xs font-mono font-medium tracking-wider text-[#8992A7] uppercase ${className}`}>
      {icon && <span className="text-[#5B8CFF] flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
