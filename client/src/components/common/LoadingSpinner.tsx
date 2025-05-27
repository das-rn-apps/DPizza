// src/components/common/LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-full my-10">
            {/* Tailwind CSS spinner animation */}
            <div
                className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-red-500 rounded-full"
                role="status"
                aria-label="loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};