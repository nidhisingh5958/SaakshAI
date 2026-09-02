import React from 'react';
import { SectionLabel } from './SectionLabel';
import { EditorialHeading } from './EditorialHeading';

export interface PageHeaderProps {
  label?: string;
  labelIcon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  label,
  labelIcon,
  title,
  subtitle,
  actions,
}) => {
  return (
    <div className="space-y-3 pb-6 border-b border-[#DDD9D0]">
      {label && (
        <SectionLabel icon={labelIcon}>
          {label}
        </SectionLabel>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <EditorialHeading level="display">
            {title}
          </EditorialHeading>
          {subtitle && (
            <p className="text-base text-[#62605B] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
