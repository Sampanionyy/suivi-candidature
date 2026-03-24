import React from 'react';
import type { IApplication } from '../../../interfaces/types';
import { useApplicationForm } from '../../../hooks/useApplicationForm';
import DeleteModal from '../DeleteModal';
import FollowUpDrawer from '../FollowUpDrawer';
import { useModal } from '../../../hooks/useModal';
import TitleTableApp from './TitleTableApp';
import InputRowApp from './InputRowApp';
import EditingRowApp from './EditingRowApp';
import FooterTableApp from './FooterTableApp';

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
    handleCancelEdit,
}) => {
    // ── Delete modal ──
    const { isOpen: isDeleteOpen, open: openDelete, close: closeDelete } = useModal();
    const [selectedAppId, setSelectedAppId] = React.useState<number | null>(null);

    // ── Follow-up drawer ──
    const [followUpApp, setFollowUpApp] = React.useState<IApplication | null>(null);
    const isDrawerOpen = followUpApp !== null;

    const handleOpenDeleteModal = React.useCallback((id: number) => {
        setSelectedAppId(id);
        openDelete();
    }, [openDelete]);

    const handleEditClick = React.useCallback((id: number) => {
        handleEdit(id);
    }, [handleEdit]);

    const handleCancelEditClick = React.useCallback(() => {
        handleCancelEdit();
    }, [handleCancelEdit]);

    const handleOpenFollowUp = React.useCallback((app: IApplication) => {
        setFollowUpApp(app);
    }, []);

    const handleCloseFollowUp = React.useCallback(() => {
        setFollowUpApp(null);
    }, []);

    const inputMode = isAddingNew ? 'new' : editingId !== null ? 'edit' : null;

    React.useEffect(() => {
        if (inputMode === 'new') {
            formik.resetForm();
        }
    }, [inputMode]);

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <TitleTableApp sortConfig={sortConfig} onSort={handleSort} />

                    <tbody className="bg-white divide-y divide-gray-200">
                        {inputMode && (
                            <InputRowApp
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
                                <EditingRowApp
                                    key={app.id}
                                    app={app}
                                    formatDate={formatDate}
                                    statusColors={statusColors}
                                    statusOptions={statusOptions}
                                    onDelete={() => handleOpenDeleteModal(app.id)}
                                    onEdit={() => handleEditClick(app.id)}
                                    onFollowUp={() => handleOpenFollowUp(app)}
                                />
                            )
                        )}

                        {!inputMode && filteredAndSortedApplications.length === 0 && (
                            <FooterTableApp setIsAddingNew={setIsAddingNew} />
                        )}
                    </tbody>
                </table>
            </div>

            {selectedAppId !== null && (
                <DeleteModal
                    isOpen={isDeleteOpen}
                    onClose={closeDelete}
                    onConfirm={() => {
                        handleDelete(selectedAppId);
                        closeDelete();
                        setSelectedAppId(null);
                    }}
                />
            )}

            <FollowUpDrawer
                application={followUpApp}
                isOpen={isDrawerOpen}
                onClose={handleCloseFollowUp}
            />
        </>
    );
};

export default TableApp;