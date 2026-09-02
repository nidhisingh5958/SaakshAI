import React from 'react';

export interface EditorialHeadingProps {
  level?: 'display' | 'page' | 'section' | 'subsection';
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const EditorialHeading: React.FC<EditorialHeadingProps> = ({
  level = 'page',
  children,
  className = '',
  as,
}) => {
  const Component = as || (level === 'display' || level === 'page' ? 'h1' : level === 'section' ? 'h2' : 'h3');

  const levelStyles = {
    display: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.1]",
    page: "text-2xl sm:text-3xl font-bold tracking-tight text-[#171717] leading-snug",
    section: "text-lg sm:text-xl font-bold tracking-tight text-[#171717] leading-snug",
    subsection: "text-base font-semibold text-[#171717] leading-snug",
  };

  return (
    <Component className={`${levelStyles[level]} ${className}`}>
      {children}
    </Component>
  );
};
