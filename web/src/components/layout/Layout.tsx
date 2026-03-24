import { Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

interface LayoutProps {
    children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Sidebar />

            <main className="flex-1 flex flex-col lg:ml-72">
                <AppHeader />

                <div
                    className="flex-1 p-4 lg:p-6 overflow-auto"
                    style={{ position: "relative", zIndex: 0 }}
                >
                    <div className="max-w-8xl mx-auto">
                        {children || <Outlet />}
                    </div>
                </div>
            </main>
        </div>
    );
}