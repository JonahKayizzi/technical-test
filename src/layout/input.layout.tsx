'use client';

import React, { useState } from 'react';

interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  label?: string;
  className?: string;
  rows?: number;
  loading?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => string | null;
  };
  validateOnChange?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  placeholder,
  value = '',
  onChange,
  required = false,
  disabled = false,
  error,
  label,
  className = '',
  rows = 3,
  loading = false,
  maxLength,
  showCharacterCount = false,
  validation,
  validateOnChange = false,
}) => {
  const [internalError, setInternalError] = useState<string>('');

  const baseClasses =
    'appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 sm:text-sm';
  const borderClasses =
    error || internalError
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500';
  const disabledClasses =
    disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${borderClasses} ${disabledClasses} ${className}`;

  const characterCount = value.length;
  const isNearLimit = maxLength && characterCount > maxLength * 0.8;
  const isAtLimit = maxLength && characterCount >= maxLength;

  // validation
  const validateField = (value: string): string => {
    if (required && !value.trim()) {
      return 'This field is required';
    }

    if (validation) {
      if (validation.pattern && !validation.pattern.test(value)) {
        return 'Invalid format';
      }

      if (validation.minLength && value.length < validation.minLength) {
        return `Must be at least ${validation.minLength} characters`;
      }

      if (validation.custom) {
        const customError = validation.custom(value);
        if (customError) {
          return customError;
        }
      }
    }

    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email address';
      }
    }

    if (type === 'number' && value) {
      const num = Number(value);
      if (isNaN(num)) {
        return 'Must be a number';
      }
    }

    return '';
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    onChange?.(e);

    if (validateOnChange) {
      const validationError = validateField(newValue);
      setInternalError(validationError);
    }
  };

  const displayError = error || internalError;

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required={required}
            disabled={disabled || loading}
            className={classes}
            rows={rows}
            maxLength={maxLength}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required={required}
            disabled={disabled || loading}
            className={classes}
            maxLength={maxLength}
          />
        )}
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
      {(showCharacterCount || maxLength) && (
        <div className="flex justify-between items-center mt-1">
          {displayError && (
            <p className="text-sm text-red-600">{displayError}</p>
          )}
          {maxLength && (
            <p
              className={`text-xs ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'}`}
            >
              {characterCount}/{maxLength}
            </p>
          )}
        </div>
      )}
      {!showCharacterCount && !maxLength && displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
};

export default Input;
