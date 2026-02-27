import React from 'react'
import SortButton from './SortButton'
import type { IApplication } from '../../interfaces/types';

interface ThTitleProps {
    sortConfig: { key: keyof IApplication; direction: 'asc' | 'desc' } | null;
    onSort: (column: keyof IApplication) => void;
}

const ThTitle: React.FC<ThTitleProps> = ({ sortConfig, onSort }) => {
    return (
        <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="position" sortConfig={sortConfig} onSort={onSort}>
                        Poste
                    </SortButton>                
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="company" sortConfig={sortConfig} onSort={onSort}>
                        Entreprise
                    </SortButton>                
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="applied_date" sortConfig={sortConfig} onSort={onSort}>
                        Date candidature
                    </SortButton>                
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="status" sortConfig={sortConfig} onSort={onSort}>
                        Statut
                    </SortButton>                
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="interview_date" sortConfig={sortConfig} onSort={onSort}>
                        Entretien
                    </SortButton>                
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                </th>
            </tr>
        </thead>
    )
}

export default ThTitle