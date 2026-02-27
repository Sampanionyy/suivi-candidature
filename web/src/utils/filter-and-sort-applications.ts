import type { IApplication } from '../interfaces/types';

interface Filters {
    search: string;
    status?: string;
    company?: string;
    position?: string;
}

interface SortConfig {
    key: keyof IApplication;
    direction: 'asc' | 'desc';
}

export function filterAndSortApplications(
    applications: IApplication[],
    filters: Filters,
    sortConfig?: SortConfig
): IApplication[] {
    const searchLower = filters.search.toLowerCase();

    let filtered = applications.filter(app => {

        const matchesSearch =
            app.position.toLowerCase().includes(searchLower) ||
            app.company.toLowerCase().includes(searchLower) ||
            (app.notes && app.notes.toLowerCase().includes(searchLower));

        const matchesStatus = !filters.status || app.status === filters.status;
        const matchesCompany = !filters.company || app.company.toLowerCase().includes(filters.company.toLowerCase());
        const matchesPosition = !filters.position || app.position.toLowerCase().includes(filters.position.toLowerCase());

        return matchesSearch && matchesStatus && matchesCompany && matchesPosition;
    });

    if (sortConfig) {
        filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            // Gestion des chaînes et des dates avec localeCompare
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return filtered;
}
