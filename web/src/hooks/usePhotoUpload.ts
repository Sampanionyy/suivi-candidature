import { useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import apiClient from '../services/api-service';

const PHOTO_CONFIG = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: 'image/jpeg,image/jpg,image/png,image/webp'
} as const;

const ERROR_MESSAGES = {
    UNSUPPORTED_FORMAT: 'Format de fichier non supporté. Utilisez JPG, PNG ou WebP.',
    FILE_TOO_LARGE: 'Le fichier est trop volumineux (max 5MB).',
    UPLOAD_ERROR: 'Erreur lors de l\'upload de la photo',
    DELETE_ERROR: 'Erreur lors de la suppression'
} as const;

const SUCCESS_MESSAGES = {
    PHOTO_UPDATED: 'Photo de profil mise à jour !',
    PHOTO_DELETED: 'Photo de profil supprimée !'
} as const;

export const usePhotoUpload = (onPhotoUpdate?: (photoUrl: string) => void) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const validateFile = useCallback((file: File): string | null => {
        if (!PHOTO_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
            return ERROR_MESSAGES.UNSUPPORTED_FORMAT;
        }
        if (file.size > PHOTO_CONFIG.MAX_SIZE) {
            return ERROR_MESSAGES.FILE_TOO_LARGE;
        }
        return null;
    }, []);

    const createPreviewUrl = useCallback((file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }, []);

    const clearFileInput = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handlePhotoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            toast.error(validationError);
            clearFileInput();
            return;
        }

        try {
            const previewUrl = await createPreviewUrl(file);
            setPreviewImage(previewUrl);
            setUploadingPhoto(true);

            const formData = new FormData();
            formData.append('photo', file);

            const response = await apiClient.post('profile/photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            
            const photoUrl = response.data?.data?.photo_url;
            if (photoUrl) {
                onPhotoUpdate?.(photoUrl);
                toast.success(SUCCESS_MESSAGES.PHOTO_UPDATED);
            }
        } catch (error: any) {
            console.error('Erreur upload photo:', error);
            toast.error(error.response?.data?.message || ERROR_MESSAGES.UPLOAD_ERROR);
            setPreviewImage(null);
        } finally {
            setUploadingPhoto(false);
            clearFileInput();
        }
    }, [validateFile, createPreviewUrl, clearFileInput, onPhotoUpdate]);

    const handleRemovePhoto = useCallback(async () => {
        try {
            setUploadingPhoto(true);
            await apiClient.delete('profile/photo');
            
            onPhotoUpdate?.('');
            setPreviewImage(null);
            toast.success(SUCCESS_MESSAGES.PHOTO_DELETED);
        } catch (error: any) {
            console.error('Erreur suppression photo:', error);
            toast.error(error.response?.data?.message || ERROR_MESSAGES.DELETE_ERROR);
        } finally {
            setUploadingPhoto(false);
        }
    }, [onPhotoUpdate]);

    const triggerFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return {
        fileInputRef,
        uploadingPhoto,
        previewImage,
        handlePhotoUpload,
        handleRemovePhoto,
        triggerFileInput,
        config: PHOTO_CONFIG
    };
};