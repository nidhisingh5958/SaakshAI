import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#2E7D50]";
  
  const variantStyles = {
    primary: "bg-[#2E7D50] hover:bg-[#1E4D37] text-white shadow-xs border border-[#2E7D50]",
    secondary: "bg-[#FFFDF8] hover:bg-[#EFE8DA] text-[#11110F] border border-[#D8D1C4] shadow-xs",
    ghost: "bg-transparent hover:bg-[#EFE8DA] text-[#625E55] hover:text-[#11110F]",
    danger: "bg-[#A83F3F] hover:bg-[#8B3131] text-white shadow-xs border border-[#A83F3F]",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-2.5 gap-2.5",
  };

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
