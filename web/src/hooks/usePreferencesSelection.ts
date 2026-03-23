import { useState, useEffect } from 'react';
import type { IProfile } from '../interfaces/types';

export const usePreferencesSelection = (profile?: IProfile | null, formik?: any) => {
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [selectedWorkModes, setSelectedWorkModes] = useState<number[]>([]);
    const [selectedContractTypes, setSelectedContractTypes] = useState<number[]>([]);

    // Initialisation depuis le profil
    useEffect(() => {
        let isMounted = true;

        if (profile && isMounted) {
            if (profile.skills && Array.isArray(profile.skills)) {
                setSelectedSkills(profile.skills.map((s: any) => s.id));
            }
            if (profile.work_modes && Array.isArray(profile.work_modes)) {
                setSelectedWorkModes(profile.work_modes.map((w: any) => w.id));
            }
            if (profile.job_contract_types && Array.isArray(profile.job_contract_types)) {
                setSelectedContractTypes(profile.job_contract_types.map((c: any) => c.id));
            }
        }

        return () => { isMounted = false; };
    }, [profile]);


    // Synchronisation avec formik
    useEffect(() => {
        if (!formik) return;

        // Only update Formik if value really changed
        if (formik.values.skills !== selectedSkills) {
            formik.setFieldValue('skills', selectedSkills);
        }
        if (formik.values.work_modes !== selectedWorkModes) {
            formik.setFieldValue('work_modes', selectedWorkModes);
        }
        if (formik.values.job_contract_types !== selectedContractTypes) {
            formik.setFieldValue('job_contract_types', selectedContractTypes);
        }
    }, [selectedSkills, selectedWorkModes, selectedContractTypes, formik]);


    return {
        selectedSkills,
        setSelectedSkills,
        selectedWorkModes,
        setSelectedWorkModes,
        selectedContractTypes,
        setSelectedContractTypes
    };
};
