import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface RegisterValues {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface BackendError {
    errors?: Record<string, string[]>;
    message?: string;
}

interface LoginValues {
    email: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    data?: any;
    fieldErrors?: Record<string, string>;
    message?: string;
}

export const loginUser = async (values: LoginValues): Promise<AuthResponse> => {
    try {
        const res = await axios.post(`${API_BASE}/auth/login`, values);
        const token = res.data.data.token;
        const user = res.data.data.user;
        
        return { 
            success: true, 
            data: { user, token } 
        };
    } 
    catch (err: any) {
        const data: BackendError = err?.response?.data;

        if (data) {
            if (data.errors && typeof data.errors === 'object') {
                const fieldErrors: Record<string, string> = {};
                Object.keys(data.errors).forEach((k) => {
                    const error = data.errors?.[k];
                    if (Array.isArray(error)) {
                        fieldErrors[k] = error[0];
                    } else if (error) {
                        fieldErrors[k] = String(error);
                    } else {
                        fieldErrors[k] = 'Erreur inconnue';
                    }
                });
                return { success: false, fieldErrors };
            } else if (data.message) {
                return { success: false, message: data.message };
            }
        }

        return { success: false, message: 'Impossible de contacter le serveur' };
    }
};

export const registerUser = async (values: RegisterValues): Promise<AuthResponse> => {
    try {
        const res = await axios.post(`${API_BASE}/auth/register`, values);
        
        return { success: true, data: res.data };
    } catch (err: any) {
        const data: BackendError = err?.response?.data;

        if (data) {
            if (data.errors && typeof data.errors === 'object') {
                const fieldErrors: Record<string, string> = {};

                Object.keys(data.errors).forEach((k) => {
                    const error = data.errors?.[k]; 
                    if (Array.isArray(error)) {
                        fieldErrors[k] = error[0];
                    } else if (error) {
                        fieldErrors[k] = String(error);
                    } else {
                        fieldErrors[k] = 'Erreur inconnue';
                    }
                });
                return { success: false, fieldErrors };
            } else if (data.message) {
                return { success: false, message: data.message };
            }
        }

        return { success: false, message: 'Impossible de contacter le serveur' };
    }
};