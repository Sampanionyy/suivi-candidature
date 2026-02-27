import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '../services/api-service';
import type { IDocument, IProfile, IProfileFormValues } from '../interfaces/types';
import IdentitySection from '../components/profile/IdentitySection';
import DocumentsSection from '../components/profile/DocumentsSection';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingFile, setUploadingFile] = useState(false);

    // Récupération du profil et documents
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const profileResponse = await apiClient.get('profile');
                const profileData = profileResponse.data?.data;

                const documentsResponse = await apiClient.get('documents');
                const documentsData = documentsResponse.data?.data;

                setProfile(profileData);
                setDocuments(documentsData);
            } catch (error) {
                console.error('Erreur fetch data:', error);
                toast.error("Erreur lors de la récupération des données !");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Formik pour le profil
    const formik = useFormik<IProfileFormValues>({
        enableReinitialize: true,
        initialValues: {
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
            linkedin_url: profile?.linkedin_url || '',
            github_url: profile?.github_url || '',
            portfolio_url: profile?.portfolio_url || '',
            summary: profile?.summary || '',

        },
        validationSchema: Yup.object({
            first_name: Yup.string()
                .min(2, 'Le prénom doit contenir au moins 2 caractères')
                .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
                .required('Le prénom est requis'),
            last_name: Yup.string()
                .min(2, 'Le nom doit contenir au moins 2 caractères')
                .max(50, 'Le nom ne peut pas dépasser 50 caractères')
                .required('Le nom est requis'),
            phone: Yup.string()
                .matches(/^[+]?[\d\s\-\(\)]+$/, 'Format de téléphone invalide')
                .optional(),
            address: Yup.string()
                .max(200, 'L\'adresse ne peut pas dépasser 200 caractères')
                .optional(),
            linkedin_url: Yup.string()
                .url('URL LinkedIn invalide')
                .optional(),
            github_url: Yup.string()
                .url('URL GitHub invalide')
                .optional(),
            portfolio_url: Yup.string()
                .url('URL Portfolio invalide')
                .optional(),
            summary: Yup.string()
                .max(500, 'Le résumé ne peut pas dépasser 500 caractères')
                .optional(),
        }),
        onSubmit: async (values) => {
            try {
                if(!profile) {
                    toast.error("Veuillez ajouter une photo de profil avant de sauvegarder.");
                    return;
                }
                const response = await apiClient.put('profile', values);
                setProfile(response.data.data);
                setIsEditingProfile(false);
                toast.success("Profil mis à jour avec succès !");
            } catch (error: any) {
                console.error('Erreur sauvegarde profil:', error);
                toast.error(
                    error.response?.data?.message || 
                    "Erreur lors de la sauvegarde du profil !"
                );
            }
        },
    });

    const handleDeleteDocument = async (id: number) => {
        try {
            await apiClient.delete(`documents/${id}`);
            setDocuments(documents.filter(doc => doc.id !== id));
            toast.success('Document supprimé !');
        } catch (error: any) {
            console.error('Erreur suppression document:', error);
            toast.error(
                error.response?.data?.message ||
                "Erreur lors de la suppression du document !"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fuchsia-300 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <User className="text-fuchsia-300" size={32} />
                        Mon Profil
                    </h1>
                    <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos documents</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Section Identité */}
                    <div className="xl:col-span-2">
                        <IdentitySection
                            isEditingProfile={isEditingProfile}
                            setIsEditingProfile={setIsEditingProfile}
                            formik={formik}
                            profile={profile}
                            setProfile={setProfile}
                        />
                    </div>

                    {/* Documents */}
                    <div className="xl:col-span-1">
                        <DocumentsSection
                            documents={documents}
                            profile={profile}
                            setDocuments={setDocuments}
                            uploadingFile={uploadingFile}
                            setUploadingFile={setUploadingFile}
                            handleDeleteDocument={handleDeleteDocument}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;