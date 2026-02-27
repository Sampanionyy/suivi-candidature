import type { ISkill, IWorkMode, IJobContractType, IProfile } from '../interfaces/types';

export const getSkillById = (
    id: number,
    profile?: IProfile | null,
    availableSkills?: any
): ISkill | undefined => {
    if (profile?.skills) {
        const profileSkill = profile.skills.find((s: ISkill) => s.id === id);
        if (profileSkill) return profileSkill;
    }
    return availableSkills?.data?.find((s: ISkill) => s.id === id);
};

export const getWorkModeById = (
    id: number,
    profile?: IProfile | null,
    availableWorkModes?: any
): IWorkMode | undefined => {
    if (profile?.work_modes) {
        const profileMode = profile.work_modes.find((w: IWorkMode) => w.id === id);
        if (profileMode) return profileMode;
    }
    return availableWorkModes?.data?.find((w: IWorkMode) => w.id === id);
};

export const getContractTypeById = (
    id: number,
    profile?: IProfile | null,
    availableContractTypes?: any
): IJobContractType | undefined => {
    if (profile?.job_contract_types) {
        const profileType = profile.job_contract_types.find((c: IJobContractType) => c.id === id);
        if (profileType) return profileType;
    }
    return availableContractTypes?.data?.find((c: IJobContractType) => c.id === id);
};

export const getCategoryById = (id: number, skillCategories?: any) => {
    return skillCategories?.data?.find((c: any) => c.id === id);
};