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
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-mono font-medium text-[#8992A7] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-[#5F687C] pointer-events-none flex items-center justify-center">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#0E1320] border border-white/10 rounded-lg py-2.5 px-3.5 text-sm text-[#F4F5F8] placeholder-[#5F687C] focus:outline-none focus:border-[#5B8CFF]/60 focus:ring-1 focus:ring-[#5B8CFF]/60 transition-colors ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-[#FF5F6D]/50 focus:border-[#FF5F6D]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-[#FF5F6D] font-mono mt-0.5">{error}</span>}
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
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-mono font-medium text-[#8992A7] uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full bg-[#0E1320] border border-white/10 rounded-lg p-4 text-sm text-[#F4F5F8] placeholder-[#5F687C] focus:outline-none focus:border-[#5B8CFF]/60 focus:ring-1 focus:ring-[#5B8CFF]/60 transition-colors resize-none ${
          error ? 'border-[#FF5F6D]/50 focus:border-[#FF5F6D]' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[#FF5F6D] font-mono mt-0.5">{error}</span>}
    </div>
  );
};
