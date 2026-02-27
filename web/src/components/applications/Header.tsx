import { Briefcase, Plus } from 'lucide-react'
import React from 'react'
import FilterSection from './FilterSection'

interface HeaderProps {
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
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<HeaderProps> = ({ filters, setFilters, setIsAddingNew }) => {
    return (
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-fuchsia-50 to-pink-50">
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                        <Briefcase className="w-6 h-6 text-fuchsia-500" />
                        <span>Mes Candidatures</span>
                    </h2>
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nouvelle candidature</span>
                    </button>
                </div>

                <FilterSection filters={filters} setFilters={setFilters} />
            </div>
        </div>
    )
}

export default Header