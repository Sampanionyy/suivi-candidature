import { forwardRef } from 'react';
import styles from '../../../../public/style/notification.module.css';

interface Props {
    open: boolean;
    unreadCount: number;
    onClick: () => void;
}

export const NotificationBell = forwardRef<HTMLButtonElement, Props>(
    ({ open, unreadCount, onClick }, ref) => (
        <button
            ref={ref}
            className={`${styles.bell} ${open ? styles.bellOpen : ''}`}
            onClick={onClick}
            aria-label="Notifications"
            aria-expanded={open}
            aria-haspopup="dialog"
        >
            <svg
                width="20" height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
            >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {unreadCount > 0 && (
                <span className={styles.badge} aria-label={`${unreadCount} notifications non lues`}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </button>
    ),
);

NotificationBell.displayName = 'NotificationBell';
