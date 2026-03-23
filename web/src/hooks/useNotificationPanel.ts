import { useEffect, useRef, useState } from 'react';

interface PanelPosition {
    top: number;
    right: number;
}

export function useNotificationPanel() {
    const [open, setOpen] = useState(false);
    const [panelPos, setPanelPos] = useState<PanelPosition>({ top: 0, right: 0 });

    const bellRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const toggle = () => {
        if (!open && bellRef.current) {
            const rect = bellRef.current.getBoundingClientRect();
            setPanelPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
        setOpen(o => !o);
    };

    // Close on outside click
    useEffect(() => {
        if (!open) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (!bellRef.current?.contains(target) && !panelRef.current?.contains(target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    return { open, toggle, panelPos, bellRef, panelRef };
}
