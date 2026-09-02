import React from 'react';
import { SectionLabel } from './SectionLabel';
import { EditorialHeading } from './EditorialHeading';

export interface PageHeaderProps {
  label?: string;
  labelIcon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  label,
  labelIcon,
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 ${className}`}>
      <div className="space-y-2 max-w-3xl">
        {label && <SectionLabel icon={labelIcon}>{label}</SectionLabel>}
        <EditorialHeading variant="page" as="h1">
          {title}
        </EditorialHeading>
        {description && (
          <p className="text-sm md:text-base text-[#8992A7] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
