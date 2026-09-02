import React from 'react';

export interface SectionProps {
  children: React.ReactNode;
  variant?: 'canvas' | 'primary' | 'secondary';
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'primary',
  className = '',
  id,
}) => {
  const variantStyles = {
    canvas: "bg-[#080B14]",
    primary: "bg-[#0E1320] border border-white/5 rounded-xl p-6 sm:p-8",
    secondary: "bg-[#121827] border border-white/10 rounded-xl p-6 sm:p-8",
  };

  return (
    <section id={id} className={`${variantStyles[variant]} ${className}`}>
      {children}
    </section>
  );
};
