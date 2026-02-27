import { useState, useEffect } from 'react';
import type { FormikProps } from 'formik';
import type { IApplicationForm } from '../interfaces/types';

export const useFormInputs = (formik: FormikProps<Partial<IApplicationForm>>) => {
    const [localValues, setLocalValues] = useState({
        position: '',
        company: '',
        jobUrl: '',
        appliedDate: '',
        interviewDate: '',
        notes: '',
    });

    const formatDateForInput = (dateString: string | null | undefined): string => {
        if (!dateString) return '';
        const dateOnly = dateString.split(' ')[0].split('T')[0];
        return dateOnly || '';
    };

    useEffect(() => {
        setLocalValues({
            position: formik.values.position || '',
            company: formik.values.company || '',
            jobUrl: formik.values.job_url || '',
            appliedDate: formatDateForInput(formik.values.applied_date),
            interviewDate: formatDateForInput(formik.values.interview_date),
            notes: formik.values.notes || '',
        });
    }, [
        formik.values.position,
        formik.values.company,
        formik.values.job_url,
        formik.values.applied_date,
        formik.values.interview_date,
        formik.values.notes
    ]);

    const updateFormikValues = () => {
        formik.setValues({
            ...formik.values,
            position: localValues.position,
            company: localValues.company,
            job_url: localValues.jobUrl,
            applied_date: localValues.appliedDate,
            interview_date: localValues.interviewDate || null,
            notes: localValues.notes,
        });
    };

    return {
        localValues,
        setLocalValues,
        updateFormikValues,
    };
};