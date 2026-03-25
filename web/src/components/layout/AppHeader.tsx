import { LogOut, Menu, User, UserCircle } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { useSidebar } from "../../contexts/SidebarContext";
import NotificationCenter from "../notifications/NotificationCenter";

export default function AppHeader() {
    const { user, logout } = useUser();
    const { toggle } = useSidebar();

    return (
        <header
            className="h-16 lg:h-20 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-6 shadow-sm flex items-center"
            style={{ position: "relative", zIndex: 40, overflow: "visible" }}
        >
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                    <button onClick={toggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        {user ? (
                            <>
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                                    <span className="hidden sm:inline">Bienvenue, </span>
                                    {user.name?.split(" ")[0] || "Utilisateur"}
                                    <span className="hidden sm:inline">.</span>
                                </h2>
                                <p className="text-gray-600 text-xs lg:text-sm hidden sm:block">
                                    Gérez vos candidatures efficacement
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                                    <span className="hidden sm:inline">ApplyTracker 📋</span>
                                    <span className="sm:hidden">📋</span>
                                </h2>
                                <p className="text-gray-600 text-xs lg:text-sm hidden md:block">
                                    Connectez-vous pour gérer vos candidatures
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2 lg:space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-2 lg:space-x-3">
                            <a
                                href="/profile"
                                className="flex items-center space-x-2 px-2 lg:px-4 py-2 text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600 rounded-xl transition-all duration-200"
                            >
                                <UserCircle className="w-5 h-5" />
                                <span className="font-medium hidden sm:inline">Profil</span>
                            </a>

                            <NotificationCenter />

                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-2 lg:px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium hidden sm:inline">Déconnexion {user.id}</span>
                            </button>
                        </div>
                    ) : (
                        <a
                            href="/login"
                            className="flex items-center space-x-2 px-2 lg:px-4 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-xl transition-all duration-200"
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium hidden sm:inline">Connexion</span>
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
}