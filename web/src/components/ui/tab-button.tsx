export const TabButton: React.FC<{
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    badge?: number;
}> = ({ active, onClick, icon, label, badge }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            active
                ? "bg-fuchsia-50 text-fuchsia-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
    >
        {icon}
        {label}
        {badge !== undefined && badge > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full font-semibold ${
                active ? "bg-fuchsia-200 text-fuchsia-800" : "bg-gray-200 text-gray-600"
            }`}>
                {badge}
            </span>
        )}
    </button>
);
