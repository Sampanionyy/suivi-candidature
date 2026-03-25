import type { INotification } from '../../interfaces/types';
import { timeAgo } from '../../lib/notification.utils';
import styles from '../../../public/style/notification.module.css';
import { useNavigate } from 'react-router-dom';

interface Props {
    notification: INotification;
    onMarkAsRead: (id: string) => void;
}


export function NotificationItem({ notification, onMarkAsRead }: Props) {
    const { id, data, read_at, created_at } = notification;
    const isUnread = !read_at;
    const navigate = useNavigate();

    const handleClick = () => {
        if (isUnread) onMarkAsRead(id);
        if (data?.application_id) {
            navigate(`/applications?highlight=${data.application_id}`);
        }
    };

    const title = data?.titre ?? data?.position ?? 'Notification';
    const initial = title.charAt(0).toUpperCase();

    return (
        <div
            className={`${styles.item} ${isUnread ? styles.itemUnread : styles.itemRead}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleClick()}
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