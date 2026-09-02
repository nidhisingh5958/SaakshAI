import React from 'react';

export interface EditorialHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  variant?: 'display' | 'page' | 'section' | 'subsection';
  children: React.ReactNode;
  className?: string;
}

export const EditorialHeading: React.FC<EditorialHeadingProps> = ({
  as = 'h2',
  variant = 'section',
  children,
  className = '',
}) => {
  const Component = as;

  const variantStyles = {
    display: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F5F8] leading-[1.08]",
    page: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F4F5F8] leading-[1.15]",
    section: "text-xl sm:text-2xl font-semibold text-[#F4F5F8] leading-[1.25]",
    subsection: "text-base sm:text-lg font-semibold text-[#F4F5F8] leading-[1.35]",
  };

  return (
    <Component className={`${variantStyles[variant]} ${className}`}>
      {children}
    </Component>
  );
};
