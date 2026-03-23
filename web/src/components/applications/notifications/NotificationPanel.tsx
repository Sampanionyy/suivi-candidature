import { forwardRef } from 'react';
import { NotificationItem } from './NotificationItem';
import styles from '../../../../public/style/notification.module.css';
import type { INotification, INotificationGroup, TActiveTab } from '../../../interfaces/types';

interface Props {
    loading: boolean;
    groups: INotificationGroup[];
    displayed: INotification[];
    activeTab: TActiveTab;
    unreadCount: number;
    panelPos: { top: number; right: number };
    onTabChange: (tab: TActiveTab) => void;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

export const NotificationPanel = forwardRef<HTMLDivElement, Props>(
    (
        {
            loading,
            groups,
            displayed,
            activeTab,
            unreadCount,
            panelPos,
            onTabChange,
            onMarkAsRead,
            onMarkAllAsRead,
        },
        ref,
    ) => (
        <div
            ref={ref}
            className={styles.panel}
            style={{ top: panelPos.top, right: panelPos.right }}
            role="dialog"
            aria-label="Centre de notifications"
        >
            {/* ── Header ── */}
            <div className={styles.head}>
                <div className={styles.headRow}>
                    <h3 className={styles.title}>Notifications</h3>
                    {unreadCount > 0 && (
                        <button className={styles.markAll} onClick={onMarkAllAsRead}>
                            Tout marquer comme lu
                        </button>
                    )}
                </div>

                {/* ── Tabs ── */}
                <div className={styles.tabs} role="tablist">
                    {(['all', 'unread'] as const).map(tab => (
                        <button
                            key={tab}
                            role="tab"
                            aria-selected={activeTab === tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : styles.tabInactive}`}
                            onClick={() => onTabChange(tab)}
                        >
                            {tab === 'all'
                                ? 'Tout'
                                : `Non lues${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.divider} />

            {/* ── List ── */}
            <div className={styles.list} role="list">
                {loading ? (
                    <div className={`${styles.state} ${styles.stateLoading}`}>Chargement…</div>
                ) : displayed.length === 0 ? (
                    <div className={styles.state}>
                        {activeTab === 'unread'
                            ? 'Aucune notification non lue'
                            : 'Aucune notification'}
                    </div>
                ) : (
                    groups.map(group => (
                        <div key={group.label} role="group" aria-label={group.label}>
                            <p className={styles.groupLabel}>{group.label}</p>
                            {group.items.map(notif => (
                                <NotificationItem
                                    key={notif.id}
                                    notification={notif}
                                    onMarkAsRead={onMarkAsRead}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    ),
);

NotificationPanel.displayName = 'NotificationPanel';
