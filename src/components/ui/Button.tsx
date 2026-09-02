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
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#2EA334]";
  
  const variantStyles = {
    primary: "bg-[#2EA334] hover:bg-[#25872A] text-white shadow-sm border border-[#2EA334]",
    secondary: "bg-[#FFFDF9] hover:bg-[#EED4AC]/30 text-[#0D0B09] border border-[#E3D5C0] shadow-xs",
    ghost: "bg-transparent hover:bg-[#EED4AC]/30 text-[#5A4434] hover:text-[#0D0B09]",
    danger: "bg-[#B94A48] hover:bg-[#A33E3C] text-white shadow-sm border border-[#B94A48]",
  };

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-sm px-4.5 py-2 gap-2",
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
