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
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#5B8CFF]";

  const variantStyles = {
    primary: "bg-[#5B8CFF] hover:bg-[#4A7CEF] active:bg-[#396CDE] text-white shadow-sm hover:shadow border border-[#5B8CFF]/30",
    secondary: "bg-[#121827] hover:bg-[#182033] text-[#F4F5F8] border border-white/10 hover:border-white/20",
    ghost: "bg-transparent hover:bg-[#182033] text-[#8992A7] hover:text-[#F4F5F8] border border-transparent",
    danger: "bg-[#FF5F6D]/10 hover:bg-[#FF5F6D]/20 text-[#FF5F6D] border border-[#FF5F6D]/30",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 font-mono",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-semibold",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
