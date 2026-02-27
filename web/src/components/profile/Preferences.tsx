import React from 'react';
import { Award } from 'lucide-react';
import { SkillsSelector } from './skills/SkillsSelector';
import { WorkModeSelector } from './WorkModeSelector';
import { ContractTypeSelector } from './ContractTypeSelector';
import type { IProfile } from '../../interfaces/types';
import type { useFormik } from 'formik';
import { usePreferencesData } from '../../hooks/use-preferences-data';
import { usePreferencesSelection } from '../../hooks/use-preferences-selection';

interface PreferencesProps {
    isEditingProfile?: boolean;
    profile?: IProfile | null;
    formik?: ReturnType<typeof useFormik<any>>;
}

const Preferences: React.FC<PreferencesProps> = ({
    isEditingProfile = false,
    profile,
    formik
}) => {
    const {
        availableSkills,
        skillCategories,
        availableWorkModes,
        availableContractTypes,
        isLoading
    } = usePreferencesData();

    const {
        selectedSkills,
        setSelectedSkills,
        selectedWorkModes,
        setSelectedWorkModes,
        selectedContractTypes,
        setSelectedContractTypes
    } = usePreferencesSelection(profile, formik);

    const toggleSkill = (skillId: number) => {
        setSelectedSkills(prev =>
            prev.includes(skillId)
                ? prev.filter(id => id !== skillId)
                : [...prev, skillId]
        );
    };

    const removeSkill = (skillId: number) => {
        setSelectedSkills(prev => prev.filter(id => id !== skillId));
    };

    const toggleWorkMode = (modeId: number) => {
        setSelectedWorkModes(prev =>
            prev.includes(modeId)
                ? prev.filter(id => id !== modeId)
                : [...prev, modeId]
        );
    };

    const toggleContractType = (typeId: number) => {
        setSelectedContractTypes(prev =>
            prev.includes(typeId)
                ? prev.filter(id => id !== typeId)
                : [...prev, typeId]
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Award className="text-fuchsia-500" size={24} />
                Préférences professionnelles
            </h3>

            <SkillsSelector
                isEditingProfile={isEditingProfile}
                selectedSkills={selectedSkills}
                availableSkills={availableSkills}
                skillCategories={skillCategories}
                profile={profile}
                onToggleSkill={toggleSkill}
                onRemoveSkill={removeSkill}
            />

            <WorkModeSelector
                isEditingProfile={isEditingProfile}
                selectedWorkModes={selectedWorkModes}
                availableWorkModes={availableWorkModes}
                profile={profile}
                onToggleWorkMode={toggleWorkMode}
            />

            <ContractTypeSelector
                isEditingProfile={isEditingProfile}
                selectedContractTypes={selectedContractTypes}
                availableContractTypes={availableContractTypes}
                profile={profile}
                onToggleContractType={toggleContractType}
            />
        </div>
    );
};

export default Preferences;