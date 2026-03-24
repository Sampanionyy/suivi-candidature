import type { IApplication, IFilterApp } from '../interfaces/types';

interface SortConfig {
    key: keyof IApplication;
    direction: 'asc' | 'desc';
}

export function filterAndSortApplications(
    applications: IApplication[],
    filters: IFilterApp,
    sortConfig?: SortConfig
): IApplication[] {    
    const searchLower = (filters && filters.search) ? filters.search.toLowerCase() : '';

    let filtered = applications.filter(app => {

        const matchesSearch =
            app.position.toLowerCase().includes(searchLower) ||
            app.company.toLowerCase().includes(searchLower) ||
            (app.contact_email?.toLowerCase().includes(searchLower) ?? false);

        const matchesStatus = !filters.status || app.status === filters.status;
        const matchesCompany = !filters.company || app.company.toLowerCase().includes(filters.company.toLowerCase());
        const matchesPosition = !filters.position || app.position.toLowerCase().includes(filters.position.toLowerCase());
        const matchesContactEmail = !filters.contact_email || (app.contact_email?.toLowerCase().includes(filters.contact_email.toLowerCase()) ?? false);

        return matchesSearch && matchesStatus && matchesCompany && matchesPosition && matchesContactEmail;
    });

    if (sortConfig) {        
        filtered.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            
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