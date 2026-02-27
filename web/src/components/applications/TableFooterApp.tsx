import React from 'react'

interface TableFooterAppProps {
    filteredAndSortedApplications: any[]; // Replace 'any' with the actual type if available
    applications: any[]; // Replace 'any' with the actual type if available
}

const TableFooterApp: React.FC<TableFooterAppProps> = ({ filteredAndSortedApplications, applications }) => {
    return (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{filteredAndSortedApplications.length} candidature(s) affichée(s)</span>
                <span>Total: {applications.length} candidature(s)</span>
            </div>
        </div>
    )
}

export default TableFooterApp