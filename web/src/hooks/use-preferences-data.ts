import { useState, useEffect } from 'react';
import { getJobContractTypes, getSkillCategories, getSkills, getWorkModes } from '../services/profile-service';

export const usePreferencesData = () => {
    const [availableSkills, setAvailableSkills] = useState<any>([]);
    const [skillCategories, setSkillCategories] = useState<any>([]);
    const [availableWorkModes, setAvailableWorkModes] = useState<any>([]);
    const [availableContractTypes, setAvailableContractTypes] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [skillsRes, categoriesRes, workModesRes, contractTypesRes] = await Promise.all([
                    getSkills(),
                    getSkillCategories(),
                    getWorkModes(),
                    getJobContractTypes()
                ]);

                if (!isMounted) return; 

                if (skillsRes.success && skillsRes.data) setAvailableSkills(skillsRes.data);
                if (categoriesRes.success && categoriesRes.data) setSkillCategories(categoriesRes.data);
                if (workModesRes.success && workModesRes.data) setAvailableWorkModes(workModesRes.data);
                if (contractTypesRes.success && contractTypesRes.data) setAvailableContractTypes(contractTypesRes.data);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // cleanup
        };
    }, []);


    return {
        availableSkills,
        skillCategories,
        availableWorkModes,
        availableContractTypes,
        isLoading
    };
};