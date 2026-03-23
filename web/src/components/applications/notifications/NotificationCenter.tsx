import { useMemo, useState } from 'react';
import { NotificationBell } from './NotificationBell';
import { NotificationPanel } from './NotificationPanel';
import { useNotifications } from '../../../hooks/useNotifications';
import { useNotificationPanel } from '../../../hooks/useNotificationPanel';
import type { TActiveTab } from '../../../interfaces/types';
import { groupNotifications } from '../../../utils/notification.utils';

export function NotificationCenter() {
    const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const { open, toggle, panelPos, bellRef, panelRef } = useNotificationPanel();
    const [activeTab, setActiveTab] = useState<TActiveTab>('all');

    const displayed = useMemo(
        () => activeTab === 'unread' ? notifications.filter(n => !n.read_at) : notifications,
        [notifications, activeTab],
    );

    const groups = useMemo(() => groupNotifications(displayed), [displayed]);

    return (
        <>
            <NotificationBell
                ref={bellRef}
                open={open}
                unreadCount={unreadCount}
                onClick={toggle}
            />

            {open && (
                <NotificationPanel
                    ref={panelRef}
                    loading={loading}
                    groups={groups}
                    displayed={displayed}
                    activeTab={activeTab}
                    unreadCount={unreadCount}
                    panelPos={panelPos}
                    onTabChange={setActiveTab}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                />
            )}
        </>
    );
}

export default NotificationCenter;
