import React, { useState } from 'react';
import { SelectedSkills } from './SelectedSkills';
import { SkillsDropdown } from './SkillsDropdown';
import { useFilteredSkills } from '../../../hooks/useFilteredSkills';

interface SkillsSelectorProps {
    isEditingProfile: boolean;
    selectedSkills: number[];
    availableSkills: any;
    skillCategories: any;
    profile?: any;
    onToggleSkill: (skillId: number) => void;
    onRemoveSkill: (skillId: number) => void;
}

export const SkillsSelector: React.FC<SkillsSelectorProps> = ({
    isEditingProfile,
    selectedSkills,
    availableSkills,
    skillCategories,
    profile,
    onToggleSkill,
    onRemoveSkill
}) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        filteredSkills
    } = useFilteredSkills({ availableSkills, selectedSkills });

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compétences</label>
            <SelectedSkills
                selectedSkills={selectedSkills}
                profile={profile}
                availableSkills={availableSkills}
                isEditingProfile={isEditingProfile}
                onRemoveSkill={onRemoveSkill}
            />
            {isEditingProfile && (
                <SkillsDropdown
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    filteredSkills={filteredSkills}
                    onToggleSkill={onToggleSkill}
                    skillCategories={skillCategories}
                />
            )}
        </div>
    );
};
