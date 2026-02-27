import React from 'react';
import type { FormikProps } from 'formik';
import type { IApplicationForm } from '../../interfaces/types';

import { FormInput } from './FormInput';
import { FormActions } from './FormActions';
import { FileUploadSection } from './FileUploadSection';

interface TrInputProps {
    formik: FormikProps<Partial<IApplicationForm>>;
    statusOptions: { value: string; label: string }[];
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>;
    onCancel?: () => void;
    isEditing?: boolean;
}

const TrInput: React.FC<TrInputProps> = ({ 
    formik, 
    statusOptions, 
    setIsAddingNew, 
    onCancel,
    isEditing = false 
}) => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await formik.submitForm();
    };

    const handleCancel = () => {
        formik.resetForm();
        setIsAddingNew(false);
        if (onCancel) onCancel();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <tr className="bg-fuchsia-50 border-l-4 border-fuchsia-500" onKeyDown={handleKeyPress}>
            <td className="px-3 py-2 md:px-6 md:py-4">
                <FormInput
                    name="position"
                    placeholder="Poste..."
                    value={formik.values.position || ''}
                    onChange={(value) => formik.setFieldValue('position', value)}
                    error={formik.errors.position}
                    touched={formik.touched.position}
                    autoFocus={!isEditing}
                />
            </td>

            <td className="px-3 py-2 md:px-6 md:py-4">
                <FormInput
                    name="company"
                    placeholder="Entreprise..."
                    value={formik.values.company || ''}
                    onChange={(value) => formik.setFieldValue('company', value)}
                    error={formik.errors.company}
                    touched={formik.touched.company}
                />
            </td>

            <td className="px-3 py-2 md:px-6 md:py-4">
                <FormInput
                    type="date"
                    name="applied_date"
                    value={formik.values.applied_date || ''}
                    onChange={(value) => formik.setFieldValue('applied_date', value)}
                    error={formik.errors.applied_date}
                    touched={formik.touched.applied_date}
                />
            </td>

            <td className="px-3 py-2 md:px-6 md:py-4">
                <select
                    name="status"
                    value={formik.values.status || 'applied'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.status}</div>
                )}
            </td>

            <td className="px-3 py-2 md:px-6 md:py-4">
                <FormInput
                    type="date"
                    name="interview_date"
                    value={formik.values.interview_date || ''}
                    onChange={(value) => formik.setFieldValue('interview_date', value || null)}
                    error={formik.errors.interview_date}
                    touched={formik.touched.interview_date}
                    disabled={formik.values.status !== "interview"} 
                />
            </td>

            <td className="px-3 py-2 md:px-6 md:py-4">
                <FileUploadSection
                    cvPath={formik.values.cv_path || null}
                    coverLetterPath={formik.values.cover_letter_path || null}
                    jobUrl={formik.values.job_url || ''}
                    onCvChange={file => formik.setFieldValue('cv_path', file)}
                    onCoverLetterChange={file => formik.setFieldValue('cover_letter_path', file)}
                /> 
            </td>

            <td className="px-3 py-2 md:px-6 md:py-4">
                <div className="flex flex-col space-y-2">
                    <FormActions
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={formik.isSubmitting}
                        isEditing={isEditing}
                    />
                    
                    <FormInput
                        type="url"
                        name="job_url"
                        placeholder="URL offre..."
                        value={formik.values.job_url || ''}
                        onChange={(value) => formik.setFieldValue('job_url', value)}
                        error={formik.errors.job_url}
                        touched={formik.touched.job_url}
                        className="text-xs"
                    />
                    
                    <FormInput
                        type="textarea"
                        name="notes"
                        placeholder="Notes..."
                        value={formik.values.notes || ''}
                        onChange={(value) => formik.setFieldValue('notes', value)}
                        error={formik.errors.notes}
                        touched={formik.touched.notes}
                        rows={2}
                        className="text-xs"
                    />
                </div>
            </td>
        </tr>
    );
};

export default React.memo(TrInput);