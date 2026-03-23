import type { INotification } from '../../../interfaces/types';
import { timeAgo } from '../../../utils/notification.utils';
import styles from '../../../../public/style/notification.module.css';

interface Props {
    notification: INotification;
    onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: Props) {
    const { id, data, read_at, created_at } = notification;
    const isUnread = !read_at;

    const title = data?.titre ?? data?.position ?? 'Notification';
    const initial = title.charAt(0).toUpperCase();

    return (
        <div
            className={`${styles.item} ${isUnread ? styles.itemUnread : styles.itemRead}`}
            onClick={() => isUnread && onMarkAsRead(id)}
            role={isUnread ? 'button' : undefined}
            tabIndex={isUnread ? 0 : undefined}
            onKeyDown={e => isUnread && e.key === 'Enter' && onMarkAsRead(id)}
        >
            <div className={styles.avatar} aria-hidden>{initial}</div>
            <div className={styles.body}>
                <p className={styles.text}>
                    <strong>{title}</strong>{' '}
                    {data?.message}
                </p>
                <span className={styles.time}>{timeAgo(created_at)}</span>
            </div>
            {isUnread && <div className={styles.dot} aria-label="Non lue" />}
        </div>
    );
}
