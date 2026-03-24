import React, { useState, useMemo, useEffect } from 'react';
import apiClient from '../services/api.service';
import { toast } from 'sonner';
import type { IApplication } from '../interfaces/types';
import Header from '../components/applications/table/Header';
import TableApp from '../components/applications/table/TableApp';
import { filterAndSortApplications } from '../lib/filter-and-sort-applications.utils';
import ResumeFooterApp from '../components/applications/table/ResumeFooterApp';
import { useUser } from '../contexts/UserContext';
import { useApplicationForm } from '../hooks/useApplicationForm';
import AppPagination from '../components/AppPagination';

const statusOptions = [
    { value: 'applied',   label: 'Candidature envoyée' },
    { value: 'interview', label: 'Entretien' },
    { value: 'rejected',  label: 'Refusée' },
    { value: 'accepted',  label: 'Acceptée' },
];

export default function ApplicationsTable() {
    const [applications, setApplications] = useState<IApplication[]>([]);
    const [editingId, setEditingId] = React.useState<number | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await apiClient.get('/applications');
                setApplications(response.data.data);
            } catch (err: any) {
                console.error(err);
                toast.error('Impossible de charger les candidatures');
            }
        };
        fetchApplications();
    }, []);

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        company: '',
        position: ''
    });

    const [sortConfig, setSortConfig] = useState<{
        key: keyof IApplication;
        direction: 'asc' | 'desc';
    } | null>(null);

    const [isAddingNew, setIsAddingNew] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSort = (key: keyof IApplication) => {
        setSortConfig(current => ({
            key,
            direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedApplications = useMemo(
        () => filterAndSortApplications(applications, filters, sortConfig ?? undefined),
        [applications, filters, sortConfig]
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortConfig]);

    const appToEdit = editingId ? applications.find(app => app.id === editingId) : undefined;

    const { formik } = useApplicationForm(
        setApplications,
        setIsAddingNew,
        setEditingId,
        applications,
        user?.id ?? null,
        appToEdit
    );

    useEffect(() => {
        if (editingId && appToEdit) {
            
            const formatDateForInput = (dateString: string | null | undefined): string => {
                if (!dateString) return '';
                return dateString.split(' ')[0].split('T')[0] || '';
            };

            setTimeout(() => {
                formik.setValues({
                    id: appToEdit.id,
                    user_id: appToEdit.user_id ?? user?.id ?? 0,
                    position: appToEdit.position ?? '',
                    company: appToEdit.company ?? '',
                    job_url: appToEdit.job_url ?? '',
                    applied_date: formatDateForInput(appToEdit.applied_date) || new Date().toISOString().split('T')[0],
                    status: appToEdit.status ?? 'applied',
                    interview_date: formatDateForInput(appToEdit.interview_date) || null,
                    contact_email: appToEdit.contact_email ?? '',
                    notes: appToEdit.notes ?? '',
                    cv_path: null,
                    cover_letter_path: null,
                });
            }, 0);
        } else if (!editingId && !isAddingNew) {
            formik.resetForm();
        }
    }, [editingId, appToEdit, user?.id, isAddingNew]);

    const handleEdit = (id: number) => {
        setEditingId(id);
        setIsAddingNew(false);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        formik.resetForm();
    };

    const handleDelete = async (id: number) => {
        try {
            await apiClient.delete(`/applications/${id}`);
            setApplications(prev => prev.filter(app => app.id !== id));
            toast.success('Candidature supprimée avec succès !');
        } catch (err) {
            console.error(err);
            toast.error('Échec de la suppression de la candidature');
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('fr-FR');

    const totalPages = Math.ceil(filteredAndSortedApplications.length / itemsPerPage);
    const paginatedApplications = filteredAndSortedApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <Header filters={filters} setFilters={setFilters} setIsAddingNew={setIsAddingNew} />

            <div className="px-4 py-2">
                <AppPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {user && (
                <>
                    <TableApp
                        handleDelete={handleDelete}
                        formik={formik}
                        handleSort={handleSort}
                        sortConfig={sortConfig}
                        isAddingNew={isAddingNew}
                        setIsAddingNew={setIsAddingNew}
                        filteredAndSortedApplications={paginatedApplications}
                        formatDate={formatDate}
                        statusOptions={statusOptions}
                        editingId={editingId}
                        handleEdit={handleEdit}
                        handleCancelEdit={handleCancelEdit}
                    />

                    {paginatedApplications.length > 0 && (
                        <ResumeFooterApp
                            filteredAndSortedApplications={paginatedApplications}
                            applications={applications}
                        />
                    )}
                </>
            )}
        </div>
    );
}