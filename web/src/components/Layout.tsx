import { User, LogOut, Home, UserCircle, Briefcase, BarChart3, Calendar, Menu, X } from "lucide-react"
import { Outlet, useLocation } from "react-router-dom"
import type { ReactNode } from 'react'
import { useUser } from "../contexts/UserContext"
import { useState } from "react"
import NotificationComponent from "./applications/Notification"

interface LayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: LayoutProps) {    
    const { user, logout } = useUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    const handleLogout = () => logout();
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const navigationItems = [
        { href: "/dashboard", icon: Home, label: "Tableau de bord" },
        { href: "/applications", icon: Briefcase, label: "Candidatures" },
        { href: "/stats", icon: BarChart3, label: "Statistiques" },
        { href: "/calendar", icon: Calendar, label: "Calendrier", requiresAuth: true },
    ]

    const filteredNavigation = navigationItems.filter(item => 
        !item.requiresAuth || (item.requiresAuth && user)
    )

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            <aside className={`
                fixed lg:static inset-y-0 left-0 z-30
                w-72 bg-white shadow-xl border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
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
                    <button onClick={closeSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <nav className="p-4 pb-24">
                    <ul className="space-y-2">
                        {filteredNavigation.map((item) => {
                            const IconComponent = item.icon
                            const isActive = currentPath === item.href
                            return (
                                <li key={item.href}>
                                    <a 
                                        href={item.href}
                                        onClick={closeSidebar}
                                        className={`
                                            flex items-center space-x-3 px-4 py-3 rounded-xl
                                            text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600
                                            transition-all duration-200 group
                                            ${isActive ? 'bg-fuchsia-100 text-fuchsia-700 font-semibold' : ''}
                                        `}
                                    >
                                        <IconComponent className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-fuchsia-700' : ''}`} />
                                        <span className="font-medium">{item.label}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col lg:ml-0">
                {/*
                    ✅ z-index: 40 sur le header pour passer au-dessus du contenu
                    ✅ overflow-visible pour que le dropdown de notif dépasse vers le bas
                    ✅ position: relative pour que z-index soit actif
                */}
                <header
                    className="h-16 lg:h-20 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 lg:px-6 shadow-sm flex items-center"
                    style={{ position: 'relative', zIndex: 40, overflow: 'visible' }}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                {user ? (
                                    <>
                                        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                                            <span className="hidden sm:inline">Bienvenue, </span>
                                            {user.name?.split(' ')[0] || 'Utilisateur'}
                                            <span className="hidden sm:inline">.</span>
                                        </h2>
                                        <p className="text-gray-600 text-xs lg:text-sm hidden sm:block">Gérez vos candidatures efficacement</p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                                            <span className="hidden sm:inline">ApplyTracker 📋</span>
                                            <span className="sm:hidden">📋</span>
                                        </h2>
                                        <p className="text-gray-600 text-xs lg:text-sm hidden md:block">Connectez-vous pour gérer vos candidatures</p>
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

                                    {/* ✅ NotificationComponent gère sa cloche + son dropdown en position:fixed */}
                                    <NotificationComponent />

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 px-2 lg:px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium hidden sm:inline">Déconnexion {user.id}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 lg:space-x-3">
                                    <a 
                                        href="/login"
                                        className="flex items-center space-x-2 px-2 lg:px-4 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-xl transition-all duration-200"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium hidden sm:inline">Connexion</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/*
                    ✅ position: relative + z-index: 0 sur le contenu
                    → garantit que les graphiques/cartes passent SOUS le dropdown
                */}
                <div className="flex-1 p-4 lg:p-6 overflow-auto" style={{ position: 'relative', zIndex: 0 }}>
                    <div className="max-w-7xl mx-auto">
                        {children || <Outlet />}
                    </div>
                </div>
            </main>
        </div>
    )
}