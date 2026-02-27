import { useCallback } from 'react';
import type { FormikProps } from 'formik';
import type { IApplicationForm } from '../interfaces/types';

interface UseFormHandlersProps {
    formik: FormikProps<Partial<IApplicationForm>>;
    updateFormikValues: () => void;
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>;
    onCancel?: () => void;
}

export const useFormHandlers = ({
    formik,
    updateFormikValues,
    setIsAddingNew,
    onCancel
}: UseFormHandlersProps) => {
    
    const handleSubmit = useCallback((e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        
        updateFormikValues();

        setTimeout(() => {
            formik.handleSubmit();
        }, 0);
    }, [formik, updateFormikValues]);

    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        } else {
            setIsAddingNew(false);
        }
    }, [onCancel, setIsAddingNew]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    }, [handleSubmit, handleCancel]);

    return {
        handleSubmit,
        handleCancel,
        handleKeyPress,
    };
};