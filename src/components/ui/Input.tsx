import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-xs font-medium text-[#5A4434]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="absolute left-3.5 text-[#B9A78D] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#FFFDF9] border border-[#E3D5C0] rounded-xl px-4 py-2.5 text-sm text-[#0D0B09] placeholder-[#B9A78D] focus:outline-none focus:border-[#2EA334] focus:ring-1 focus:ring-[#2EA334] transition-colors disabled:opacity-50 disabled:bg-[#EED4AC]/30 ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-[#B94A48]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[#B94A48] mt-1">{error}</p>
      )}
    </div>
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-xs font-medium text-[#5A4434]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl p-4 text-sm text-[#0D0B09] placeholder-[#B9A78D] focus:outline-none focus:border-[#2EA334] focus:ring-1 focus:ring-[#2EA334] transition-colors disabled:opacity-50 disabled:bg-[#EED4AC]/30 resize-y ${
          error ? 'border-[#B94A48]' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-[#B94A48] mt-1">{error}</p>
      )}
    </div>
  );
};
