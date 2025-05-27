// src/components/ui/Button.tsx
import React, { type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx'; // For combining class names elegantly
import { twMerge } from 'tailwind-merge'; // For merging Tailwind classes

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
        primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
        outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
        ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-400',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const mergedClasses = twMerge(
        clsx(baseStyles, variantStyles[variant], sizeStyles[size]),
        className
    );

    return (
        <button className={mergedClasses} {...props}>
            {children}
        </button>
    );
};