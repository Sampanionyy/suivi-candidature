import { useEffect, useRef, useState } from 'react';
import '../../echo';

interface NotificationData {
    message: string;
    titre?: string;
    position?: string;
    company?: string;
    application_id?: number;
    type?: string;
    [key: string]: any;
}

interface Notification {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

declare global {
    interface Window {
        Echo: any;
    }
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH} h`;
    return `Il y a ${diffD} j`;
}

function groupNotifications(notifications: Notification[]) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const groups: { label: string; items: Notification[] }[] = [
        { label: 'Nouveau', items: [] },
        { label: "Aujourd'hui", items: [] },
        { label: 'Cette semaine', items: [] },
        { label: 'Plus tôt', items: [] },
    ];

    for (const n of notifications) {
        const d = new Date(n.created_at);
        if (!n.read_at && d >= todayStart) groups[0].items.push(n);
        else if (d >= todayStart) groups[1].items.push(n);
        else if (d >= weekStart) groups[2].items.push(n);
        else groups[3].items.push(n);
    }

    return groups.filter(g => g.items.length > 0);
}

function NotificationComponent() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    // Position du panel calculée depuis le bouton
    const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });

    const userId = 9;
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    const bellRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${apiUrl}/notifications`, { headers });
                const json = await res.json();
                if (json.success) {
                    const list = json.data.data ?? json.data;
                    setNotifications(list);
                    setUnreadCount(list.filter((n: Notification) => !n.read_at).length);
                }
            } catch (err) {
                console.error('Erreur fetch notifications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!window.Echo || !userId) return;
        window.Echo.private(`App.Models.User.${userId}`)
            .notification((notification: any) => {
                const newNotif: Notification = {
                    id: notification.id ?? crypto.randomUUID(),
                    type: notification.type ?? '',
                    data: { message: notification.message, titre: notification.titre },
                    read_at: null,
                    created_at: new Date().toISOString(),
                };
                setNotifications(prev => [newNotif, ...prev]);
                setUnreadCount(prev => prev + 1);
                if (Notification.permission === 'granted') {
                    new Notification(notification.titre ?? 'Nouvelle notification', {
                        body: notification.message,
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

    // Calculer position du panel depuis le bouton cloche
    const handleToggle = () => {
        if (!open && bellRef.current) {
            const rect = bellRef.current.getBoundingClientRect();
            setPanelPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
        setOpen(o => !o);
    };

    // Fermer au clic extérieur
    useEffect(() => {
        if (!open) return;
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            const clickedBell = bellRef.current?.contains(target);
            const clickedPanel = panelRef.current?.contains(target);
            if (!clickedBell && !clickedPanel) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`${apiUrl}/notifications/${id}/mark-as-read`, { method: 'POST', headers });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Erreur markAsRead:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`${apiUrl}/notifications/mark-all-as-read`, { method: 'POST', headers });
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Erreur markAllAsRead:', err);
        }
    };

    const displayed = activeTab === 'unread'
        ? notifications.filter(n => !n.read_at)
        : notifications;

    const grouped = groupNotifications(displayed);

    return (
        <>
            <style>{`
                .nw {
                    display: inline-block;
                    position: relative;
                }

                /* ── Cloche ── */
                .nw-bell {
                    position: relative;
                    background: none;
                    border: none;
                    cursor: pointer;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #888;
                    transition: background 0.15s, color 0.15s;
                }
                .nw-bell:hover,
                .nw-bell.open {
                    background: #fce4f3;
                    color: #e91e8c;
                }

                .nw-badge {
                    position: absolute;
                    top: 1px;
                    right: 1px;
                    min-width: 17px;
                    height: 17px;
                    background: #e91e8c;
                    color: #fff;
                    font-size: 10px;
                    font-weight: 700;
                    border-radius: 9px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 3px;
                    border: 2px solid #fff;
                    pointer-events: none;
                    font-family: 'Segoe UI', sans-serif;
                }

                /* ── Panel — position:fixed pour échapper au overflow:hidden de la navbar ── */
                .nw-panel {
                    position: fixed;
                    width: 360px;
                    background: #fff;
                    border-radius: 14px;
                    box-shadow:
                        0 8px 32px rgba(233, 30, 140, 0.13),
                        0 2px 10px rgba(0, 0, 0, 0.09);
                    border: 1px solid #f5dced;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Segoe UI', sans-serif;
                    animation: nwFadeIn 0.16s ease;
                }

                @keyframes nwFadeIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ── Header ── */
                .nw-head {
                    padding: 14px 16px 0;
                    flex-shrink: 0;
                    border-radius: 14px 14px 0 0;
                    background: #fff;
                }

                .nw-head-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .nw-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin: 0;
                }

                .nw-mark-all {
                    background: none;
                    border: none;
                    color: #e91e8c;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    padding: 0;
                    font-family: inherit;
                }
                .nw-mark-all:hover { text-decoration: underline; }

                .nw-tabs {
                    display: flex;
                    gap: 6px;
                    margin-bottom: 10px;
                }
                .nw-tab {
                    padding: 5px 14px;
                    border-radius: 20px;
                    border: none;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.15s;
                    font-family: inherit;
                }
                .nw-tab.on  { background: #fce4f3; color: #e91e8c; }
                .nw-tab.off { background: #f0f2f5; color: #555; }
                .nw-tab.off:hover { background: #e8eaed; }

                .nw-divider {
                    height: 1px;
                    background: #f5dced;
                    flex-shrink: 0;
                }

                /* ── Liste scrollable ── */
                .nw-list {
                    overflow-y: auto;
                    max-height: 430px;
                    padding: 6px 0 8px;
                    border-radius: 0 0 14px 14px;
                    scrollbar-width: thin;
                    scrollbar-color: #f0c0de transparent;
                }
                .nw-list::-webkit-scrollbar { width: 4px; }
                .nw-list::-webkit-scrollbar-thumb {
                    background: #f0c0de;
                    border-radius: 4px;
                }

                .nw-group-label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #1a1a2e;
                    padding: 8px 16px 2px;
                    margin: 0;
                }

                .nw-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 8px 12px;
                    margin: 0 4px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background 0.12s;
                }
                .nw-item:hover        { background: #fdf0f8; }
                .nw-item.unread       { background: #fef5fb; }
                .nw-item.unread:hover { background: #fce4f3; }
                .nw-item.read         { cursor: default; opacity: 0.72; }

                .nw-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #e91e8c, #c2185b);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-weight: 700;
                    font-size: 15px;
                    flex-shrink: 0;
                }

                .nw-body { flex: 1; min-width: 0; }

                .nw-text {
                    font-size: 13px;
                    color: #1a1a2e;
                    line-height: 1.4;
                    margin: 0;
                    word-break: break-word;
                }
                .nw-text strong { font-weight: 700; }

                .nw-time {
                    font-size: 11px;
                    color: #e91e8c;
                    font-weight: 600;
                    margin-top: 3px;
                    display: block;
                }

                .nw-dot {
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    background: #e91e8c;
                    flex-shrink: 0;
                    margin-top: 13px;
                }

                .nw-state {
                    text-align: center;
                    padding: 28px 16px;
                    color: #aaa;
                    font-size: 13px;
                }
                .nw-state.pink { color: #e91e8c; }
            `}</style>

            {/* ── Bouton cloche ── */}
            <div className="nw">
                <button
                    ref={bellRef}
                    className={`nw-bell ${open ? 'open' : ''}`}
                    onClick={handleToggle}
                    aria-label="Notifications"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    {unreadCount > 0 && (
                        <span className="nw-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                    )}
                </button>
            </div>

            {/* ── Panel rendu en dehors du flux normal ── */}
            {open && (
                <div
                    ref={panelRef}
                    className="nw-panel"
                    style={{ top: panelPos.top, right: panelPos.right }}
                >
                    {/* Header */}
                    <div className="nw-head">
                        <div className="nw-head-row">
                            <h3 className="nw-title">Notifications</h3>
                            {unreadCount > 0 && (
                                <button className="nw-mark-all" onClick={markAllAsRead}>
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>
                        <div className="nw-tabs">
                            <button
                                className={`nw-tab ${activeTab === 'all' ? 'on' : 'off'}`}
                                onClick={() => setActiveTab('all')}
                            >Tout</button>
                            <button
                                className={`nw-tab ${activeTab === 'unread' ? 'on' : 'off'}`}
                                onClick={() => setActiveTab('unread')}
                            >
                                Non lues{unreadCount > 0 ? ` (${unreadCount})` : ''}
                            </button>
                        </div>
                    </div>

                    <div className="nw-divider" />

                    {/* Liste scrollable */}
                    <div className="nw-list">
                        {loading ? (
                            <div className="nw-state pink">Chargement…</div>
                        ) : displayed.length === 0 ? (
                            <div className="nw-state">
                                {activeTab === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                            </div>
                        ) : (
                            grouped.map(group => (
                                <div key={group.label}>
                                    <p className="nw-group-label">{group.label}</p>
                                    {group.items.map((notif, i) => {
                                        const title = notif.data?.titre ?? notif.data?.position ?? 'Notification';
                                        const initial = title.charAt(0).toUpperCase();
                                        const isUnread = !notif.read_at;
                                        return (
                                            <div
                                                key={notif.id ?? i}
                                                className={`nw-item ${isUnread ? 'unread' : 'read'}`}
                                                onClick={() => isUnread && markAsRead(notif.id)}
                                            >
                                                <div className="nw-avatar">{initial}</div>
                                                <div className="nw-body">
                                                    <p className="nw-text">
                                                        <strong>{title}</strong>{' '}
                                                        {notif.data?.message}
                                                    </p>
                                                    <span className="nw-time">
                                                        {timeAgo(notif.created_at)}
                                                    </span>
                                                </div>
                                                {isUnread && <div className="nw-dot" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default NotificationComponent;