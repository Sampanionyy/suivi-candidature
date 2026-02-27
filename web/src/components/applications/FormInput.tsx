import React from 'react';

interface FormInputProps {
    type?: 'text' | 'date' | 'url' | 'textarea';
    name: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    touched?: boolean;
    autoFocus?: boolean;
    className?: string;
    rows?: number;
    disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
    type = 'text',
    name,
    placeholder,
    value,
    onChange,
    error,
    touched,
    autoFocus = false,
    className = '',
    rows,
    disabled
}) => {
    const baseClasses = `w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 ${
        touched && error ? 'border-red-500' : 'border-gray-300'
    } ${className}`;

    const smallInputClasses = `w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-fuchsia-500 focus:border-fuchsia-500 ${className}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    if (type === 'textarea') {
        return (
            <div>
                <textarea
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    rows={rows || 2}
                    className={className.includes('text-xs') ? `${smallInputClasses} resize-none` : `${baseClasses} resize-none`}
                />
                {touched && error && (
                    <div className="text-red-500 text-xs mt-1">{error}</div>
                )}
            </div>
        );
    }

    return (
        <div>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                autoFocus={autoFocus}
                className={className.includes('text-xs') ? smallInputClasses : baseClasses}
                disabled={disabled ?? false}
            />
            {touched && error && (
                <div className="text-red-500 text-xs mt-1">{error}</div>
            )}
        </div>
    );
};