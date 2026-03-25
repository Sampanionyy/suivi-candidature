import { RefreshCcwDot, CheckCircle, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const MailsList = () => {
    const { user, gmailConnected } = useUser();

    const handleSync = () => {
        const token = localStorage.getItem('token');
        window.location.href = `/api/gmail/connect?token=${token}`;
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                {/* Statut Gmail */}
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
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                    title='Vous allez être redirigé vers Google Connect'
                >
                    <RefreshCcwDot width={16} />
                    <span>{gmailConnected ? 'Resynchroniser' : 'Synchroniser'} les mails</span>
                </button>
            </div>
        </div>
    );
};

export default MailsList;