// src/components/ui/Input.tsx
import React, { type InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
    const defaultStyles = 'block w-full p-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent';
    return (
        <input
            className={twMerge(defaultStyles, className)}
            {...props}
        />
    );
};