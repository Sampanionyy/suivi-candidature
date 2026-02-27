import React from 'react';
import { Plus } from 'lucide-react';
import type { ISkillCategory } from '../../../interfaces/types';
import { getCategoryById } from '../../../utils/preferences-helpers';

interface SkillsDropdownProps {
    showDropdown: boolean;
    setShowDropdown: (value: boolean) => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategory: number | null;
    setSelectedCategory: (value: number | null) => void;
    filteredSkills: any[];
    onToggleSkill: (skillId: number) => void;
    skillCategories: { data?: ISkillCategory[] };
}

export const SkillsDropdown: React.FC<SkillsDropdownProps> = ({
    showDropdown,
    setShowDropdown,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    onToggleSkill,
    skillCategories
}) => {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:border-fuchsia-400 transition-colors flex items-center justify-between"
            >
                <span className="text-gray-500">Ajouter une compétence</span>
                <Plus size={20} className="text-gray-400" />
            </button>

            {showDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 space-y-2">
                        <input
                            type="text"
                            placeholder="Rechercher une compétence..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                        />
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                        >
                            <option value="">Toutes les catégories</option>
                            {skillCategories.data?.map((cat: ISkillCategory) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredSkills.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                Aucune compétence trouvée
                            </div>
                        ) : (
                            filteredSkills.map(skill => {
                                const category = getCategoryById(skill.category_id || 0, skillCategories);
                                return (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => onToggleSkill(skill.id)}
                                        className="w-full text-left px-4 py-2 hover:bg-fuchsia-50 transition-colors"
                                    >
                                        <div className="font-medium text-gray-800">{skill.name}</div>
                                        {category && <div className="text-xs text-gray-500">{category.name}</div>}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
