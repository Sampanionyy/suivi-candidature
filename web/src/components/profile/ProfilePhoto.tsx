import React, { useMemo } from 'react';
import { User, Camera, X } from 'lucide-react';
import type { IProfile } from '../../interfaces/types';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';

interface ProfilePhotoProps {
    profile?: IProfile | null;
    isEditingProfile: boolean;
    onPhotoUpdate?: (photoUrl: string) => void;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
    profile,
    isEditingProfile,
    onPhotoUpdate,
}) => {
    const {
        fileInputRef,
        uploadingPhoto,
        previewImage,
        handlePhotoUpload,
        handleRemovePhoto,
        triggerFileInput,
        config
    } = usePhotoUpload(onPhotoUpdate);

    const currentPhotoUrl = useMemo(
        () => previewImage || profile?.photo_url,
        [previewImage, profile?.photo_url]
    );

   

    return (
        <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-200 to-purple-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {currentPhotoUrl ? (
                    <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${profile?.photo_url}`}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User size={48} className="text-fuchsia-400" />
                )}
                
                {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                    </div>
                )}
            </div>

            {isEditingProfile && (
                <div className="absolute -bottom-2 -right-2 flex flex-col gap-1">
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={uploadingPhoto}
                        className="bg-fuchsia-300 hover:bg-fuchsia-400 disabled:bg-fuchsia-200 text-white p-2 rounded-full shadow-lg transition-colors"
                        title="Changer la photo"
                        aria-label="Changer la photo de profil"
                    >
                        <Camera size={16} />
                    </button>
                    
                    {currentPhotoUrl && (
                        <button
                            type="button"
                            onClick={handleRemovePhoto}
                            disabled={uploadingPhoto}
                            className="bg-red-400 hover:bg-red-500 disabled:bg-red-300 text-white p-2 rounded-full shadow-lg transition-colors"
                            title="Supprimer la photo"
                            aria-label="Supprimer la photo de profil"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={config.ALLOWED_EXTENSIONS}
                onChange={handlePhotoUpload}
                className="hidden"
                aria-label="Sélectionner une photo de profil"
            />
        </div>
    );
};