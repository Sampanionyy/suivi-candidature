import type { Interview } from "../interfaces/types";

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const getInterviewsForDate = (date: Date, interviews: Interview[]) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    return Object.values(interviews).filter((interview: Interview) => {
        // Comparer juste la date => Ignorer l'heure
        const interviewDate = interview.interview_date.split('T')[0];
        return interviewDate === dateString;
    });
};