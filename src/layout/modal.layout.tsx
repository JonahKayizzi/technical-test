import React from "react";

interface InputProps {
    id: string
    name: string
    type?: 'text' | 'email' | 'number' | 'textarea'
    placeholder?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    required?: boolean
    disabled?: boolean
    error?: string
    label?: string
    className?: string
    rows?: number
}

const Input: React.FC<InputProps> = ({
    id,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    error,
    label,
    className = '',
    rows = 3,
}) => {
    const baseClasses = 'appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 sm:text-sm'
    const borderClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

    const classes = `${baseClasses} ${borderClasses} ${disabledClasses} ${className}`

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            {type === 'textarea' ? (
                <textarea
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={classes}
                    rows={rows}
                />
            ) : (
                <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={classes}
            />

            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}

export default Input;