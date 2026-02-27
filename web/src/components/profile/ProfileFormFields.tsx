import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import type { IProfileFormValues } from '../../interfaces/types';

interface ProfileFormFieldsProps {
    formik: ReturnType<typeof useFormik<IProfileFormValues>>;
    isEditingProfile: boolean;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
    formik,
    isEditingProfile,
}) => {
    const getInputClassName = useCallback((fieldName: keyof IProfileFormValues) => {
        const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500';
        const hasError = formik.touched[fieldName] && formik.errors[fieldName];
        const borderClass = hasError ? 'border-red-300' : 'border-gray-300';
        return `${baseClasses} ${borderClass}`;
    }, [formik.touched, formik.errors]);

    return (
        <div className="flex-1 min-w-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label 
                        htmlFor="first_name" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!isEditingProfile}
                        className={getInputClassName('first_name')}
                        placeholder="Votre prénom"
                        aria-required="true"
                        aria-invalid={!!(formik.touched.first_name && formik.errors.first_name)}
                    />
                    {formik.touched.first_name && formik.errors.first_name && (
                        <div className="text-red-500 text-sm mt-1" role="alert">
                            {formik.errors.first_name}
                        </div>
                    )}
                </div>

                <div>
                    <label 
                        htmlFor="last_name" 
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={!isEditingProfile}
                        className={getInputClassName('last_name')}
                        placeholder="Votre nom"
                        aria-required="true"
                        aria-invalid={!!(formik.touched.last_name && formik.errors.last_name)}
                    />
                    {formik.touched.last_name && formik.errors.last_name && (
                        <div className="text-red-500 text-sm mt-1" role="alert">
                            {formik.errors.last_name}
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label 
                    htmlFor="summary" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Résumé
                </label>
                <textarea
                    id="summary"
                    name="summary"
                    value={formik.values.summary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isEditingProfile}
                    rows={3}
                    className={`${getInputClassName('summary')} resize-none`}
                    placeholder="Décrivez-vous en quelques mots..."
                    aria-invalid={!!(formik.touched.summary && formik.errors.summary)}
                />
                {formik.touched.summary && formik.errors.summary && (
                    <div className="text-red-500 text-sm mt-1" role="alert">
                        {formik.errors.summary}
                    </div>
                )}
            </div>
        </div>
    );
};