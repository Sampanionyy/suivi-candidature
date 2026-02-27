export const setStatusName = (status: string) => {
    switch (status) {
        case 'interview':
            return 'Entretien';
        case 'applied':
            return 'Candidature envoyée';
        case 'rejected':
            return 'Rejeté';
        default:
            return status;
    }
}