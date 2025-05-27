// src/components/common/EmptyState.tsx
import React from 'react';
import { Button } from '../ui/Button'; // Assuming you have a Button component
import { Link } from 'react-router-dom';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: React.ReactNode; // Optional icon, e.g., an SVG or FontAwesome icon
    buttonText?: string;
    buttonLink?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    icon,
    buttonText,
    buttonLink,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-6xl text-gray-400 mb-6">
                {icon ? icon : '🍕'} {/* Default pizza slice icon */}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{title}</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">{message}</p>
            {buttonText && buttonLink && (
                <Link to={buttonLink}>
                    <Button variant="primary" size="lg">
                        {buttonText}
                    </Button>
                </Link>
            )}
        </div>
    );
};