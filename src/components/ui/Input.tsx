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
          className="block text-xs font-medium text-[#625E55]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="absolute left-3.5 text-[#8C877C] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#FFFDF8] border border-[#D8D1C4] rounded px-4 py-2.5 text-sm text-[#11110F] placeholder-[#8C877C] focus:outline-none focus:border-[#2E7D50] focus:ring-1 focus:ring-[#2E7D50] transition-colors disabled:opacity-50 disabled:bg-[#EFE8DA] ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-[#A83F3F]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-[#A83F3F] mt-1">{error}</p>
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
          className="block text-xs font-medium text-[#625E55]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full bg-[#FFFDF8] border border-[#D8D1C4] rounded-lg p-4 text-sm text-[#11110F] placeholder-[#8C877C] focus:outline-none focus:border-[#2E7D50] focus:ring-1 focus:ring-[#2E7D50] transition-colors disabled:opacity-50 disabled:bg-[#EFE8DA] resize-y ${
          error ? 'border-[#A83F3F]' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-[#A83F3F] mt-1">{error}</p>
      )}
    </div>
  );
};
