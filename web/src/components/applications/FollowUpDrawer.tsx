import React, { useEffect } from "react";
import {
    X, Mail, Clock, StickyNote, Send, Plus, Trash2,
    ChevronRight, Loader2, CheckCircle2, AlertCircle, RefreshCw,
} from "lucide-react";
import type { IApplication } from "../../interfaces/types";
import { useSidebar } from "../../contexts/SidebarContext";
import { useFollowUpDrawer } from "../../hooks/useFollowUpDrawer";
import { TabButton } from "../ui/tab-button";
import { formatDate } from "../../lib/utils";

interface Props {
    application: IApplication | null;
    isOpen: boolean;
    onClose: () => void;
}

const FollowUpDrawer: React.FC<Props> = ({ application, isOpen, onClose }) => {
    const { close: closeSidebar } = useSidebar();

    const {
        activeTab, setActiveTab,
        subject, setSubject,
        body, setBody,
        sending, sendStatus, sendError,
        handleSendEmail,
        emails, loadingEmails, fetchEmails,
        notes, loadingNotes, fetchNotes,
        newNote, setNewNote,
        savingNote, deletingNoteId,
        handleAddNote, handleDeleteNote,
    } = useFollowUpDrawer(application, isOpen);

    useEffect(() => {
        if (isOpen) closeSidebar();
    }, [isOpen, closeSidebar]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!application) return null;

    const canSend = !sending && !!subject.trim() && !!body.trim() && !!application.contact_email;

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            <div className={`
                fixed top-16 lg:top-20 right-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]
                w-[520px] max-w-full bg-white shadow-2xl z-50
                flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${isOpen ? "translate-x-0" : "translate-x-full"}
            `}>
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold uppercase tracking-widest text-fuchsia-500">Relance</span>
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                            <span className="text-xs text-gray-400 truncate">{application.company}</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 truncate">{application.position}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-3 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-gray-100">
                    <TabButton
                        active={activeTab === "compose"}
                        onClick={() => setActiveTab("compose")}
                        icon={<Mail className="w-4 h-4" />}
                        label="Composer"
                    />
                    <TabButton
                        active={activeTab === "history"}
                        onClick={() => { setActiveTab("history"); fetchEmails(); }}
                        icon={<Clock className="w-4 h-4" />}
                        label="Historique"
                        badge={emails.length}
                    />
                    <TabButton
                        active={activeTab === "notes"}
                        onClick={() => { setActiveTab("notes"); fetchNotes(); }}
                        icon={<StickyNote className="w-4 h-4" />}
                        label="Notes"
                        badge={notes.length}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">

                    {activeTab === "compose" && (
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Destinataire
                                </label>
                                <div className="px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-500">
                                    {application.contact_email ?? (
                                        <span className="text-amber-500 flex items-center gap-1.5">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Aucun email de contact renseigné
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Objet
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Objet de l'email..."
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900
                                        focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-fuchsia-400
                                        transition-all placeholder-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Message
                                </label>
                                <textarea
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    rows={10}
                                    placeholder="Votre message..."
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900
                                        focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-fuchsia-400
                                        transition-all placeholder-gray-400 resize-none leading-relaxed"
                                />
                            </div>

                            {sendStatus === "success" && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                    Email envoyé avec succès.
                                </div>
                            )}
                            {sendStatus === "error" && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {sendError}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-700">Emails envoyés</h3>
                                <button
                                    onClick={fetchEmails}
                                    className="p-1.5 text-gray-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition-colors"
                                    title="Rafraîchir"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>

                            {loadingEmails ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-6 h-6 text-fuchsia-400 animate-spin" />
                                </div>
                            ) : emails.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500">Aucun email de relance envoyé.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {emails.map(email => (
                                        <div key={email.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 hover:bg-white hover:border-gray-200 transition-all">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <p className="text-sm font-semibold text-gray-800 leading-tight">{email.subject}</p>
                                                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{formatDate(email.sent_at)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 whitespace-pre-line">{email.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "notes" && (
                        <div className="p-6 space-y-4">
                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 space-y-3">
                                <textarea
                                    value={newNote}
                                    onChange={e => setNewNote(e.target.value)}
                                    rows={3}
                                    placeholder="Ajouter une note..."
                                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400
                                        focus:outline-none resize-none leading-relaxed"
                                    onKeyDown={e => {
                                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote();
                                    }}
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">⌘+Entrée pour sauvegarder</span>
                                    <button
                                        onClick={handleAddNote}
                                        disabled={!newNote.trim() || savingNote}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-600 text-white text-xs font-semibold rounded-lg
                                            hover:bg-fuchsia-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {savingNote ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                        Ajouter
                                    </button>
                                </div>
                            </div>

                            {loadingNotes ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 text-fuchsia-400 animate-spin" />
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                        <StickyNote className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500">Aucune note pour cette candidature.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {notes.map(note => (
                                        <div key={note.id} className="group flex items-start gap-3 rounded-xl bg-white border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm transition-all">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{note.content}</p>
                                                <p className="text-xs text-gray-400 mt-1.5">{formatDate(note.created_at)}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                disabled={deletingNoteId === note.id}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                                            >
                                                {deletingNoteId === note.id
                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    : <Trash2 className="w-3.5 h-3.5" />
                                                }
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {activeTab === "compose" && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-white">
                        <button
                            onClick={handleSendEmail}
                            disabled={!canSend}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-fuchsia-600 text-white
                                font-semibold rounded-xl hover:bg-fuchsia-700 active:scale-[0.98]
                                disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 text-sm"
                        >
                            {sending
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…</>
                                : <><Send className="w-4 h-4" /> Envoyer la relance</>
                            }
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default FollowUpDrawer;