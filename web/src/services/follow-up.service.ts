import type { IApplicationNote, IFollowUpEmail } from "../interfaces/types";
import apiClient from "./api.service";

export const getFollowUpEmails = (applicationId: number) =>
    apiClient.get<IFollowUpEmail[]>(`/applications/${applicationId}/follow-up-emails`);

export const sendFollowUpEmail = (
    applicationId: number,
    payload: { subject: string; body: string }
) => apiClient.post<IFollowUpEmail>(`/applications/${applicationId}/follow-up-emails`, payload);


export const getNotes = (applicationId: number) =>
    apiClient.get<IApplicationNote[]>(`/applications/${applicationId}/notes`);
export const createNote = (applicationId: number, content: string) =>
    apiClient.post<IApplicationNote>(`/applications/${applicationId}/notes`, { content });

export const deleteNote = (applicationId: number, noteId: number) =>
    apiClient.delete(`/applications/${applicationId}/notes/${noteId}`);