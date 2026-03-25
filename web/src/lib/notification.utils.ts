import type { INotification, INotificationGroup } from "../interfaces/types";

export function timeAgo(dateStr: string): string {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMin = Math.floor(diffMs / 60_000);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH} h`;
    return `Il y a ${diffD} j`;
}

export function groupNotifications(notifications: INotification[]): INotificationGroup[] {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const groups: INotificationGroup[] = [
        { label: 'Nouveau', items: [] },
        { label: "Aujourd'hui", items: [] },
        { label: 'Cette semaine', items: [] },
        { label: 'Plus tôt', items: [] },
    ];

    for (const n of notifications) {
        const d = new Date(n.created_at);
        if (!n.read_at && d >= todayStart) groups[0].items.push(n);
        else if (d >= todayStart)          groups[1].items.push(n);
        else if (d >= weekStart)           groups[2].items.push(n);
        else                               groups[3].items.push(n);
    }

    return groups.filter(g => g.items.length > 0);
}

export function getAuthHeaders(token: string | null): HeadersInit {
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
}

export function getCurrentUserId(): string | null {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user).id : null;
    } catch {
        return null;
    }
}
