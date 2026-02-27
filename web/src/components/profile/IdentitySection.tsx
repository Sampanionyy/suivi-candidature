import React from 'react'
import { useFormik } from 'formik'
import { User, Edit3, Save, X } from 'lucide-react'
import type { IProfile, IProfileFormValues } from '../../interfaces/types'
import GeneralInformations from './GeneralInformations';
import ContactLinks from './ContactLinks';
import { useUser } from '../../contexts/UserContext';
import Preferences from './Preferences';

interface IdentitySectionProps {
    formik: ReturnType<typeof useFormik<IProfileFormValues>>;
    isEditingProfile: boolean
    setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>
    profile?: IProfile | null;
    setProfile: React.Dispatch<React.SetStateAction<IProfile | null>>;
}

const IdentitySection: React.FC<IdentitySectionProps> = ({ 
    formik, 
    isEditingProfile, 
    setIsEditingProfile, 
    profile,
    setProfile
}) => {
    const { user } = useUser();

    const handlePhotoUpdate = (photoUrl: string) => {
        if (profile) {
            setProfile({
                ...profile,
                photo_url: photoUrl
            });
        } else {
            const newProfile: IProfile = {
                user_id: user ? user.id : 0,
                first_name: null,
                last_name: null,
                phone: null,
                address: null,
                photo_url: photoUrl,
                linkedin_url: null,
                github_url: null,
                portfolio_url: null,
                summary: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setProfile(newProfile);
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-fuchsia-100">
                <div className="bg-gradient-to-r from-fuchsia-300 to-purple-400 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <User size={24} />
                        Identité
                    </h2>
                    {!isEditingProfile ? (
                        <button
                            type="button"
                            onClick={() => setIsEditingProfile(true)}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Edit3 size={16} />
                            Modifier
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                type='submit'
                                disabled={formik.isSubmitting}
                                className="bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Save size={16} />
                                {formik.isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    formik.resetForm();
                                    setIsEditingProfile(false);
                                }}
                                disabled={formik.isSubmitting}
                                className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Annuler
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    <GeneralInformations
                        formik={formik}
                        isEditingProfile={isEditingProfile}
                        profile={profile}
                        onPhotoUpdate={handlePhotoUpdate}
                    />

                    <Preferences 
                        isEditingProfile={isEditingProfile}
                        profile={profile}
                        formik={formik}
                    />

                    <ContactLinks
                        formik={formik}
                        isEditingProfile={isEditingProfile}
                    />
                </div>
            </div>
        </form>
    )
}

export default IdentitySection