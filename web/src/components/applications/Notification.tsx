import { useEffect, useState } from 'react';
import '../../echo';

interface Notification {
    id: string;
    type: string;
    data: {
        message: string;
        titre: string;
        application_id?: number;
        [key: string]: any;
    };
    read_at: string | null;
    created_at: string;
}

declare global {
    interface Window {
        Echo: any;
    }
}

function NotificationComponent() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const userId = 9; // À remplacer par l'ID réel

    useEffect(() => {
        // Vérifier que Echo est bien initialisé
        if (!window.Echo) {
            console.error('Echo n\'est pas initialisé');
            return;
        }

        const channelName = `App.Models.User.${userId}`;
        console.log('🔌 Connexion au canal:', channelName);

        const channel = window.Echo.private(channelName)
            .notification((notification: any) => {
                console.log('✅ Notification reçue:', notification);
                
                setNotifications(prev => [notification, ...prev]);
                
                // Optionnel : notification navigateur
                if (Notification.permission === 'granted') {
                    new Notification(notification.titre || 'Nouvelle notification', {
                        body: notification.message,
                    });
                }
            })
            .error((error: any) => {
                console.error('❌ Erreur Echo:', error);
            });

        // Log de connexion réussie
        channel.subscribed(() => {
            console.log('✅ Abonné au canal:', channelName);
        });

        return () => {
            console.log('🔌 Déconnexion du canal:', channelName);
            window.Echo.leave(channelName);
        };
    }, [userId]);

    // Demander permission notifications navigateur
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    return (
        <div className="notifications-container">
            <h3>Notifications ({notifications.length})</h3>
            {notifications.map((notif, index) => (
                <div key={notif.id || index} className="notification-item">
                    <strong>{notif.data?.titre || ""}</strong>
                    <p>{notif.data?.message || ""}</p>
                    <small>{new Date(notif.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
}

export default NotificationComponent;