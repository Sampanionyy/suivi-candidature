import React from 'react';
import type { IApplication } from '../../interfaces/types';
import TrInput from './TrInput';
import TrContent from './TrContent';
import TrFooter from './TrFooter';
import ThTitle from './TableHeaderApp';
import { useApplicationForm } from '../../hooks/useApplicationForm';
import DeleteModal from './DeleteModal';
import { useModal } from '../../hooks/useModal';

interface TableAppProps {
    sortConfig: { key: keyof IApplication; direction: 'asc' | 'desc' } | null;
    handleSort: (column: keyof IApplication) => void;
    formik: ReturnType<typeof useApplicationForm>['formik'];
    filteredAndSortedApplications: IApplication[];
    formatDate: (dateStr: string) => string;
    statusOptions: { value: string; label: string }[];
    isAddingNew: boolean;
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>;
    editingId: number | null;
    handleDelete: (id: number) => void;
    handleEdit: (id: number) => void;
    handleCancelEdit: () => void;
}

const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    interview: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
    accepted: 'bg-green-100 text-green-800',
    pending: 'bg-gray-100 text-gray-800',
};

const TableApp: React.FC<TableAppProps> = ({
    sortConfig,
    handleSort,
    formik,
    filteredAndSortedApplications,
    formatDate,
    statusOptions,
    isAddingNew,
    setIsAddingNew,
    handleDelete,
    editingId,
    handleEdit,
    handleCancelEdit
}) => {
    const { isOpen, open, close } = useModal();
    const [selectedAppId, setSelectedAppId] = React.useState<number | null>(null);

    const handleOpenDeleteModal = React.useCallback((id: number) => {
        setSelectedAppId(id);
        open();
    }, [open]);

    const handleEditClick = React.useCallback((id: number) => {
        handleEdit(id);
    }, [handleEdit]);

    const handleCancelEditClick = React.useCallback(() => {
        handleCancelEdit();
    }, [handleCancelEdit]);

    const inputMode = isAddingNew ? 'new' : editingId !== null ? 'edit' : null;

    React.useEffect(() => {
        if (inputMode === 'new') {
            formik.resetForm();
        }
    }, [inputMode]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <ThTitle sortConfig={sortConfig} onSort={handleSort} />

                <tbody className="bg-white divide-y divide-gray-200">
                    {inputMode && (
                        <TrInput
                            formik={formik}
                            statusOptions={statusOptions}
                            setIsAddingNew={setIsAddingNew}
                            onCancel={() => {
                                if (inputMode === 'new') setIsAddingNew(false);
                                if (inputMode === 'edit') handleCancelEditClick();
                            }}
                            isEditing={inputMode === 'edit'}
                        />
                    )}

                    {filteredAndSortedApplications.map(app =>
                        editingId === app.id ? null : (
                            <TrContent
                                key={app.id}
                                app={app}
                                formatDate={formatDate}
                                statusColors={statusColors}
                                statusOptions={statusOptions}
                                onDelete={() => handleOpenDeleteModal(app.id)}
                                onEdit={() => handleEditClick(app.id)}
                            />
                        )
                    )}

                    {!inputMode && filteredAndSortedApplications.length === 0 && (
                        <TrFooter setIsAddingNew={setIsAddingNew} />
                    )}
                </tbody>
            </table>

            {selectedAppId !== null && (
                <DeleteModal
                    isOpen={isOpen}
                    onClose={close}
                    onConfirm={() => {
                        handleDelete(selectedAppId);
                        close();
                        setSelectedAppId(null);
                    }}
                />
            )}
        </div>
    );
};

export default TableApp;