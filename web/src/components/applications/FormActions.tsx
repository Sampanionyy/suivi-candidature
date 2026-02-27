import React from 'react';
import { Save, X } from 'lucide-react';

interface FormActionsProps {
    onSubmit: (e: React.FormEvent) => void | Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
    isEditing: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
    onSubmit,
    onCancel,
    isSubmitting,
    isEditing
}) => {
    const handleSubmitClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Créer un FormEvent synthétique
        const formEvent = new Event('submit') as any;
        onSubmit(formEvent);
    };

    return (
        <div className="flex space-x-2">
            <button
                type="button"
                onClick={handleSubmitClick}
                disabled={isSubmitting}
                className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors disabled:opacity-50"
                title={`${isEditing ? 'Mettre à jour' : 'Sauvegarder'} (Ctrl+Enter)`}
            >
                <Save className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                title="Annuler (Escape)"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};