'use client';
import { useResponsive } from '@/hooks/useResponsive';
import { ReactNode } from 'react';

interface ResponsiveFormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  title?: string;
  description?: string;
}

export function ResponsiveForm({ 
  children, 
  onSubmit, 
  className = '',
  title,
  description
}: ResponsiveFormProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return (
    <form 
      onSubmit={onSubmit}
      className={`
        bg-[#1a1a1a] rounded-lg border border-[#333] shadow-lg
        ${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'}
        ${className}
      `}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className={`
              font-bold text-white mb-2
              ${isMobile ? 'text-lg' : 'text-xl'}
            `}>
              {title}
            </h2>
          )}
          {description && (
            <p className={`
              text-[#a0a0a0]
              ${isMobile ? 'text-sm' : 'text-base'}
            `}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={`
        space-y-6
        ${isMobile ? 'space-y-4' : ''}
      `}>
        {children}
      </div>
    </form>
  );
}

interface ResponsiveFormGroupProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ResponsiveFormGroup({ 
  children, 
  columns = 1,
  className = '' 
}: ResponsiveFormGroupProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Determinar columnas basado en el tamaño de pantalla
  const getGridCols = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) {
      switch (columns) {
        case 1: return 'grid-cols-1';
        case 2: return 'grid-cols-2';
        case 3: return 'grid-cols-2';
        case 4: return 'grid-cols-2';
        default: return 'grid-cols-1';
      }
    }
    // Desktop
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-1';
    }
  };

  return (
    <div className={`
      grid gap-6
      ${getGridCols()}
      ${isMobile ? 'gap-4' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

interface ResponsiveFormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
}

export function ResponsiveFormField({ 
  label, 
  children, 
  error, 
  required = false,
  className = '',
  helpText
}: ResponsiveFormFieldProps) {
  const { isMobile } = useResponsive();

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`
        block font-medium text-white
        ${isMobile ? 'text-sm' : 'text-base'}
        ${error ? 'text-red-400' : ''}
      `}>
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {children}
      </div>
      
      {helpText && !error && (
        <p className={`
          text-[#6a6a6a]
          ${isMobile ? 'text-xs' : 'text-sm'}
        `}>
          {helpText}
        </p>
      )}
      
      {error && (
        <p className={`
          text-red-400
          ${isMobile ? 'text-xs' : 'text-sm'}
        `}>
          {error}
        </p>
      )}
    </div>
  );
}

interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function ResponsiveInput({ 
  error = false, 
  className = '', 
  ...props 
}: ResponsiveInputProps) {
  const { isMobile } = useResponsive();

  return (
    <input
      className={`
        w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg text-white
        placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#ec4d58]
        transition-colors duration-200
        ${isMobile ? 'text-base py-3' : 'text-sm py-2'}
        ${error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-[#4a4a4a] focus:border-[#ec4d58]'
        }
        ${className}
      `}
      {...props}
    />
  );
}

interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function ResponsiveTextarea({ 
  error = false, 
  className = '', 
  ...props 
}: ResponsiveTextareaProps) {
  const { isMobile } = useResponsive();

  return (
    <textarea
      className={`
        w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg text-white
        placeholder-[#6a6a6a] focus:outline-none focus:ring-2 focus:ring-[#ec4d58]
        transition-colors duration-200 resize-vertical
        ${isMobile ? 'text-base py-3 min-h-[120px]' : 'text-sm py-2 min-h-[100px]'}
        ${error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-[#4a4a4a] focus:border-[#ec4d58]'
        }
        ${className}
      `}
      {...props}
    />
  );
}

interface ResponsiveSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
}

export function ResponsiveSelect({ 
  error = false, 
  className = '', 
  options,
  ...props 
}: ResponsiveSelectProps) {
  const { isMobile } = useResponsive();

  return (
    <select
      className={`
        w-full px-4 py-3 bg-[#2a2a2a] border rounded-lg text-white
        focus:outline-none focus:ring-2 focus:ring-[#ec4d58]
        transition-colors duration-200
        ${isMobile ? 'text-base py-3' : 'text-sm py-2'}
        ${error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-[#4a4a4a] focus:border-[#ec4d58]'
        }
        ${className}
      `}
      {...props}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className="bg-[#2a2a2a] text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export function ResponsiveButton({ 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  disabled,
  ...props 
}: ResponsiveButtonProps) {
  const { isMobile } = useResponsive();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#ec4d58] hover:bg-[#d43d4d] text-white';
      case 'secondary':
        return 'bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#4a4a4a]';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-[#ec4d58] hover:bg-[#d43d4d] text-white';
    }
  };

  const getSizeClasses = () => {
    if (isMobile) {
      switch (size) {
        case 'sm': return 'px-4 py-2 text-sm';
        case 'md': return 'px-6 py-3 text-base';
        case 'lg': return 'px-8 py-4 text-lg';
        default: return 'px-6 py-3 text-base';
      }
    }
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm';
      case 'md': return 'px-4 py-2 text-sm';
      case 'lg': return 'px-6 py-3 text-base';
      default: return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      className={`
        font-medium rounded-lg transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-[#ec4d58] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
