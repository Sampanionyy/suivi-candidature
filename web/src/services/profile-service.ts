import type { IJobContractType, ISkill, ISkillCategory, IWorkMode } from '../interfaces/types';
import apiClient from './api-service';

// ---- Types communs ----
interface BackendError {
    errors?: Record<string, string[]>;
    message?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}
// ---- Fonctions ----
export const getSkills = async (): Promise<ApiResponse<Record<string, ISkill>>> => {
    try {
        const res = await apiClient.get<Record<string, ISkill>>('/skills');
        return { success: true, data: res.data };
    } catch (err: any) {
        const data: BackendError = err?.response?.data;
        return {
            success: false,
            message: data?.message || 'Impossible de charger les compétences',
        };
    }
};

export const getSkillCategories = async (): Promise<ApiResponse<Record<string, ISkillCategory>>> => {
    try {
        const res = await apiClient.get<Record<string, ISkillCategory>>('/skill-categories');
        return { success: true, data: res.data };
    } catch (err: any) {
        const data: BackendError = err?.response?.data;
        return {
            success: false,
            message: data?.message || 'Impossible de charger les catégories de compétences',
        };
    }
};

export const getWorkModes = async (): Promise<ApiResponse<Record<string, IWorkMode>>> => {
    try {
        const res = await apiClient.get<Record<string, IWorkMode>>('/work-modes');
        return { success: true, data: res.data };
    } catch (err: any) {
        const data: BackendError = err?.response?.data;
        return {
            success: false,
            message: data?.message || 'Impossible de charger les modes de travail',
        };
    }
};

export const getJobContractTypes = async (): Promise<ApiResponse<Record<string, IJobContractType>>> => {
    try {
        const res = await apiClient.get<Record<string, IJobContractType>>('/job-contract-types');
        return { success: true, data: res.data };
    } catch (err: any) {
        const data: BackendError = err?.response?.data;
        return {
            success: false,
            message: data?.message || 'Impossible de charger les types de contrat',
        };
    }
};
