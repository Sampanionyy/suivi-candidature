import React from 'react';
import { X } from 'lucide-react';
import { getSkillById } from '../../../utils/preferences-helpers';

interface SelectedSkillsProps {
    selectedSkills: number[];
    profile: any;
    availableSkills: any;
    isEditingProfile: boolean;
    onRemoveSkill: (skillId: number) => void;
}

export const SelectedSkills: React.FC<SelectedSkillsProps> = ({
    selectedSkills,
    profile,
    availableSkills,
    isEditingProfile,
    onRemoveSkill
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
            {selectedSkills.length === 0 && !isEditingProfile && (
                <span className="text-gray-400 text-sm">Aucune compétence sélectionnée</span>
            )}
            {selectedSkills.map(skillId => {
                const skill = getSkillById(skillId, profile, availableSkills);
                if (!skill) return null;
                return (
                    <span
                        key={skillId}
                        className="inline-flex items-center gap-1 bg-fuchsia-100 text-fuchsia-700 px-3 py-1 rounded-full text-sm"
                    >
                        {skill.name}
                        {isEditingProfile && (
                            <button
                                type="button"
                                onClick={() => onRemoveSkill(skillId)}
                                className="hover:bg-fuchsia-200 rounded-full p-0.5 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </span>
                );
            })}
        </div>
    );
};
