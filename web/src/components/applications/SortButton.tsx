import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { IApplication } from '../../interfaces/types';

interface SortButtonProps {
    column: keyof IApplication;
    sortConfig: { key: keyof IApplication; direction: 'asc' | 'desc' } | null;
    onSort: (column: keyof IApplication) => void;
    children: React.ReactNode;
}

const SortButton: React.FC<SortButtonProps> = ({ column, sortConfig, onSort, children }) => {
    const isActive = sortConfig?.key === column;
    const direction = sortConfig?.direction;

    return (
        <button
            onClick={() => onSort(column)}
            className="flex items-center space-x-1 hover:text-fuchsia-600 transition-colors"
        >
            <span>{children}</span>
            {isActive ? (
                direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            ) : (
                <ChevronDown className="w-4 h-4 opacity-30" />
            )}
        </button>
    );
};

export default SortButton;
