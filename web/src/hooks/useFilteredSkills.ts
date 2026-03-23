import { useState, useMemo } from 'react';
import type { ISkill } from '../interfaces/types';

interface UseFilteredSkillsProps {
    availableSkills: any;
    selectedSkills: number[];
}

export const useFilteredSkills = ({ availableSkills, selectedSkills }: UseFilteredSkillsProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const filteredSkills = useMemo(() => {
        const skills: ISkill[] = Object.values(availableSkills?.data ?? {});
        return skills.filter(skill => {
            const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === null || skill.category_id === selectedCategory;
            return matchesSearch && matchesCategory && !selectedSkills.includes(skill.id);
        });
    }, [availableSkills, selectedSkills, selectedCategory, searchTerm]);

    return {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        filteredSkills
    };
};
