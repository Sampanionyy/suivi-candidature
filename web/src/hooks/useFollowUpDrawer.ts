import { useState, useCallback, useEffect } from "react";
import type { IApplication, IApplicationNote, IFollowUpEmail, Tab } from "../interfaces/types";
import {
    getFollowUpEmails,
    sendFollowUpEmail,
    getNotes,
    createNote,
    deleteNote,
} from "../services/follow-up.service";

const DEFAULT_BODY = (position: string, company: string) =>
    `Bonjour,\n\nJe me permets de revenir vers vous concernant ma candidature au poste de ${position} chez ${company}.\n\nDans l'attente de votre retour,\nCordialement`;

export function useFollowUpDrawer(application: IApplication | null, isOpen: boolean) {
    const [activeTab, setActiveTab] = useState<Tab>("compose");

    // Compose
    const [subject, setSubject] = useState("");
    const [body, setBody]       = useState("");
    const [sending, setSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");
    const [sendError, setSendError]   = useState("");

    // Emails
    const [emails, setEmails]             = useState<IFollowUpEmail[]>([]);
    const [loadingEmails, setLoadingEmails] = useState(false);

    // Notes
    const [notes, setNotes]               = useState<IApplicationNote[]>([]);
    const [loadingNotes, setLoadingNotes]   = useState(false);
    const [newNote, setNewNote]             = useState("");
    const [savingNote, setSavingNote]       = useState(false);
    const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);

    // Reset when drawer opens on a new application
    useEffect(() => {
        if (!isOpen || !application) return;

        setActiveTab("compose");
        setSendStatus("idle");
        setSendError("");
        setSubject(`Relance — candidature ${application.position} chez ${application.company}`);
        setBody(DEFAULT_BODY(application.position, application.company));
        fetchEmails();
        fetchNotes();
    }, [isOpen, application?.id]);

    const fetchEmails = useCallback(async () => {
        if (!application) return;
        setLoadingEmails(true);
        try {
            const { data } = await getFollowUpEmails(application.id);
            setEmails(data);
        } catch {
            setEmails([]);
        } finally {
            setLoadingEmails(false);
        }
    }, [application]);

    const fetchNotes = useCallback(async () => {
        if (!application) return;
        setLoadingNotes(true);
        try {
            const { data } = await getNotes(application.id);
            setNotes(data);
        } catch {
            setNotes([]);
        } finally {
            setLoadingNotes(false);
        }
    }, [application]);

    const handleSendEmail = useCallback(async () => {
        if (!application || !subject.trim() || !body.trim()) return;
        setSending(true);
        setSendStatus("idle");
        try {
            await sendFollowUpEmail(application.id, { subject, body });
            setSendStatus("success");
            fetchEmails();
            setTimeout(() => setSendStatus("idle"), 3000);
        } catch (err: any) {
            setSendStatus("error");
            setSendError(err?.response?.data?.message ?? "Erreur lors de l'envoi.");
        } finally {
            setSending(false);
        }
    }, [application, subject, body, fetchEmails]);

    const handleAddNote = useCallback(async () => {
        if (!application || !newNote.trim()) return;
        setSavingNote(true);
        try {
            await createNote(application.id, newNote);
            setNewNote("");
            fetchNotes();
        } finally {
            setSavingNote(false);
        }
    }, [application, newNote, fetchNotes]);

    const handleDeleteNote = useCallback(async (noteId: number) => {
        if (!application) return;
        setDeletingNoteId(noteId);
        try {
            await deleteNote(application.id, noteId);
            setNotes(prev => prev.filter(n => n.id !== noteId));
        } finally {
            setDeletingNoteId(null);
        }
    }, [application]);

    return {
        // Tabs
        activeTab, setActiveTab,
        // Compose
        subject, setSubject,
        body, setBody,
        sending, sendStatus, sendError,
        handleSendEmail,
        // Emails
        emails, loadingEmails, fetchEmails,
        // Notes
        notes, loadingNotes, fetchNotes,
        newNote, setNewNote,
        savingNote, deletingNoteId,
        handleAddNote, handleDeleteNote,
    };
}