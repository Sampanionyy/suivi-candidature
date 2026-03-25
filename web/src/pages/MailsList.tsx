import { RefreshCcwDot, CheckCircle, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';

interface IMail {
    id: string;
    subject: string;
    from: string;
    date: string;
    snippet: string;
}

const MailsList = () => {
    const { gmailConnected } = useUser();
    const [mails, setMails] = useState<IMail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMails = async () => {
        const token = localStorage.getItem('token');
        if (!token || !gmailConnected) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/gmail/mails', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Erreur lors de la récupération');
            const data = await res.json();
            setMails(data);
        } catch (e) {
            setError('Impossible de charger les mails.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (gmailConnected) fetchMails();
    }, [gmailConnected]);

    const handleSync = () => {
        const token = localStorage.getItem('token');
        window.location.href = `/api/gmail/connect?token=${token}`;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                {gmailConnected ? (
                    <span className="flex items-center gap-2 px-4 py-2 bg-green-100 border-green-300 border-2 rounded-lg text-green-700 text-sm">
                        <CheckCircle width={16} />
                        Compte Gmail connecté
                    </span>
                ) : (
                    <span className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border-yellow-300 border-2 rounded-lg text-yellow-700 text-sm">
                        <AlertCircle width={16} />
                        Gmail non connecté
                    </span>
                )}

                <button
                    onClick={handleSync}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                    title='Vous allez être redirigé vers Google Connect'
                >
                    <RefreshCcwDot width={16} />
                    <span>{gmailConnected ? 'Resynchroniser' : 'Synchroniser'} les mails</span>
                </button>

                {gmailConnected && (
                    <button
                        onClick={fetchMails}
                        className="px-4 py-2 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 transition-colors text-sm"
                    >
                        Rafraîchir
                    </button>
                )}
            </div>

            {/* Contenu */}
            {!gmailConnected && (
                <p className="text-slate-500 text-sm">Connectez votre compte Gmail pour voir vos mails.</p>
            )}

            {loading && (
                <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 width={16} className="animate-spin" />
                    Chargement des mails...
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {!loading && mails.length > 0 && (
                <div className="flex flex-col gap-3">
                    {mails.map((mail) => (
                        <div key={mail.id} className="p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <Mail width={18} className="text-slate-400 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{mail.subject}</p>
                                    <p className="text-sm text-slate-500 truncate">{mail.from}</p>
                                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">{mail.snippet}</p>
                                </div>
                                <span className="text-xs text-slate-400 shrink-0">{mail.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && gmailConnected && mails.length === 0 && !error && (
                <p className="text-slate-500 text-sm">Aucun mail trouvé.</p>
            )}
        </div>
    );
};

export default MailsList;