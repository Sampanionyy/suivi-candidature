import { useCallback, useEffect, useState } from 'react';
import { getAuthHeaders, getCurrentUserId } from '../utils/notification.utils';
import type { INotification } from '../interfaces/types';
import '../echo';

const API_URL = import.meta.env.VITE_API_URL as string;

export function useNotifications() {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const userId = getCurrentUserId();
    const headers = getAuthHeaders(token);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch(`${API_URL}/notifications`, { headers });
                const json = await res.json();
                if (!cancelled && json.success) {
                    setNotifications(json.data.data ?? json.data);
                }
            } catch (err) {
                console.error('[Notifications] fetch error:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!window.Echo || !userId) return;

        const channel = window.Echo.private(`App.Models.User.${userId}`);

        channel.notification((raw: any) => {
            const newNotif: INotification = {
                id: (raw.id as string) ?? crypto.randomUUID(),
                type: (raw.type as string) ?? '',
                data: {
                    message: raw.message as string,
                    titre: raw.titre as string | undefined,
                },
                read_at: null,
                created_at: new Date().toISOString(),
            };

            setNotifications(prev =>
                prev.some(n => n.id === newNotif.id) ? prev : [newNotif, ...prev],
            );

            if (Notification.permission === 'granted') {
                new Notification((raw.titre as string) ?? 'Nouvelle notification', {
                    body: raw.message as string,
                });
            }
        });

        return () => window.Echo.leave(`App.Models.User.${userId}`);
    }, [userId]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await fetch(`${API_URL}/notifications/${id}/mark-as-read`, {
                method: 'POST',
                headers,
            });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n),
            );
        } catch (err) {
            console.error('[Notifications] markAsRead error:', err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await fetch(`${API_URL}/notifications/mark-all-as-read`, {
                method: 'POST',
                headers,
            });
            setNotifications(prev =>
                prev.map(n => ({ ...n, read_at: new Date().toISOString() })),
            );
        } catch (err) {
            console.error('[Notifications] markAllAsRead error:', err);
        }
    }, []);

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return { notifications, loading, unreadCount, markAsRead, markAllAsRead };
}
