import React from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import apiClient from '../../services/api.service';
import type { IDocument, IProfile } from '../../interfaces/types';

interface DocumentsSectionProps {
    documents: IDocument[];
    profile: IProfile | null;
    setDocuments: React.Dispatch<React.SetStateAction<IDocument[]>>;
    uploadingFile: boolean;
    setUploadingFile: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteDocument: (id: number) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
    documents,
    profile,
    setDocuments,
    uploadingFile,
    setUploadingFile,
    handleDeleteDocument
}) => {
    const formik = useFormik({
        initialValues: {
            type: 'CV' as 'CV' | 'LM',
            file: null as File | null,
        },
        validationSchema: Yup.object({
            type: Yup.mixed<'CV' | 'LM'>().oneOf(['CV', 'LM']).required('Type requis'),
            file: Yup.mixed().required('Fichier requis'),
        }),
        onSubmit: async (values, { resetForm }) => {
            if (!values.file || !profile) return;

            const formData = new FormData();
            formData.append('file', values.file);
            if(profile?.id) {
                formData.append('user_id', profile.id.toString());
            }
            formData.append('type', values.type);
            formData.append('name', values.file.name);

            try {
                setUploadingFile(true);
                const response = await apiClient.post('documents', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                const newDoc: IDocument = response.data.data;
                setDocuments([...documents, newDoc]);
                toast.success('Document ajouté avec succès !');
                resetForm();
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors de l'upload du document !");
            } finally {
                setUploadingFile(false);
            }
        },
    });

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-fuchsia-100">
            <div className="bg-gradient-to-r from-purple-400 to-fuchsia-300 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText size={24} />
                    Documents
                </h2>
                <p className="text-white/80 mt-1">CV et lettres de motivation</p>
            </div>

            <div className="p-6">
                <div className="space-y-4 mb-6">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-fuchsia-200 transition-colors group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                doc.type === 'CV'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {doc.type}
                                        </div>
                                    </div>
                                    <h4 className="font-medium text-gray-800 truncate mb-1">{doc.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <a
                                href={`${import.meta.env.VITE_API_BASE_URL}${doc.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-3 block text-center bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                            >
                                Télécharger
                            </a>
                        </div>
                    ))}
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-3">
                    <select
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-gray-300 rounded-xl py-2 px-3 text-gray-700"
                    >
                        <option value="CV">CV</option>
                        <option value="LM">Lettre de motivation</option>
                    </select>
                    {formik.touched.type && formik.errors.type && (
                        <div className="text-red-500 text-sm">{formik.errors.type}</div>
                    )}

                    <input
                        type="file"
                        name="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                formik.setFieldValue('file', e.target.files[0]);
                            }
                        }}
                        className="w-full"
                    />
                    {formik.touched.file && formik.errors.file && (
                        <div className="text-red-500 text-sm">{formik.errors.file}</div>
                    )}

                    <button
                        type="submit"
                        disabled={uploadingFile}
                        className="w-full bg-gradient-to-r from-fuchsia-300 to-purple-400 hover:from-fuchsia-400 hover:to-purple-500 disabled:opacity-50 text-white py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
                    >
                        {uploadingFile ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Plus size={18} />
                        )}
                        Ajouter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DocumentsSection;
