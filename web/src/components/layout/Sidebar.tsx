import { Briefcase, BarChart3, Calendar, Home, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useSidebar } from "../../contexts/SidebarContext";

const navigationItems = [
    { href: "/dashboard",    icon: Home,      label: "Tableau de bord" },
    { href: "/applications", icon: Briefcase, label: "Candidatures" },
    { href: "/stats",        icon: BarChart3,  label: "Statistiques" },
    { href: "/calendar",     icon: Calendar,   label: "Calendrier", requiresAuth: true },
];

export default function Sidebar() {
    const { user } = useUser();
    const { isOpen, close } = useSidebar();
    const { pathname } = useLocation();

    const filteredNavigation = navigationItems.filter(
        item => !item.requiresAuth || user
    );

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={close}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-30
                w-72 bg-white shadow-xl border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="h-16 lg:h-20 px-4 lg:px-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-fuchsia-300 to-pink-300 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-4 lg:w-6 h-4 lg:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
                                ApplyTracker
                            </h1>
                            <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">Suivi des candidatures</p>
                        </div>
                    </div>
                    <button onClick={close} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <nav className="p-4 pb-24">
                    <ul className="space-y-2">
                        {filteredNavigation.map(({ href, icon: Icon, label }) => {
                            const isActive = pathname === href;
                            return (
                                <li key={href}>
                                    <a
                                        href={href}
                                        onClick={close}
                                        className={`
                                            flex items-center space-x-3 px-4 py-3 rounded-xl
                                            text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600
                                            transition-all duration-200 group
                                            ${isActive ? "bg-fuchsia-100 text-fuchsia-700 font-semibold" : ""}
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-fuchsia-700" : ""}`} />
                                        <span className="font-medium">{label}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
}