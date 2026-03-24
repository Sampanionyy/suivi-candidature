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

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (str: string) =>
    new Date(str).toLocaleDateString("fr-FR", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });