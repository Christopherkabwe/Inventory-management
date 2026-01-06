"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

            {/* Sidebar (desktop) */}
            <aside className="hidden md:block w-55 bg-gray-900 text-white">
                <Sidebar sidebarOpen toggleSidebar={() => { }} />
            </aside>

            {/* Sidebar (mobile overlay) */}
            {sidebarOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 md:hidden">
                        <Sidebar sidebarOpen toggleSidebar={() => setSidebarOpen(false)} />
                    </aside>
                </>
            )}

            {/* Main content */}
            <main className="flex-1 p-8 overflow-x-hidden">

                {/* Mobile menu */}
                <button
                    className="md:hidden mb-4 p-2 rounded bg-gray-200"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* CONTENT CONTAINER */}
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
