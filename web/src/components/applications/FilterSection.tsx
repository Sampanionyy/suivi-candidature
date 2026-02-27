import { Search } from 'lucide-react'
import React from 'react'

interface FilterSectionProps {
    filters: {
        search: string
        status: string
        company: string
        position: string
    }
    setFilters: React.Dispatch<React.SetStateAction<{
        search: string
        status: string
        company: string
        position: string
    }>>
}

const statusOptions = [
    { value: 'applied', label: 'Candidature envoyée' },
    { value: 'interview', label: 'Entretien' },
    { value: 'rejected', label: 'Rejetée' },
    { value: 'accepted', label: 'Acceptée' },
    { value: 'pending', label: 'En attente' },
]

const FilterSection: React.FC<FilterSectionProps> = ({ filters, setFilters }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
            </div>

            <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            >
                <option value="">Tous les statuts</option>
                {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Filtrer par entreprise..."
                value={filters.company}
                onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            />

            <input
                type="text"
                placeholder="Filtrer par poste..."
                value={filters.position}
                onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
            />
        </div>
    )
}

export default FilterSection