import React from 'react';
import { useFormik } from 'formik';
import type { IProfile, IProfileFormValues } from '../../interfaces/types';
import { ProfilePhoto } from './ProfilePhoto';
import { ProfileFormFields } from './ProfileFormFields';

interface GeneralInformationsProps {
    formik: ReturnType<typeof useFormik<IProfileFormValues>>;
    isEditingProfile: boolean;
    profile?: IProfile | null;
    onPhotoUpdate?: (photoUrl: string) => void;
}

const GeneralInformations: React.FC<GeneralInformationsProps> = ({
    formik,
    isEditingProfile,
    profile,
    onPhotoUpdate,
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <ProfilePhoto
                profile={profile}
                isEditingProfile={isEditingProfile}
                onPhotoUpdate={onPhotoUpdate}
            />
            <ProfileFormFields
                formik={formik}
                isEditingProfile={isEditingProfile}
            />
        </div>
    );
};

export default React.memo(GeneralInformations);