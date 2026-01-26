"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen w-full bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

            {/* Sidebar */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(prev => !prev)}
            />

            {/* Overlay (mobile only) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main
                className={` transition-all duration-300  px-6 py-2 ${sidebarOpen ? "xl:ml-64" : "xl:ml-0"}`}
            >
                {/* Top bar */}
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(prev => !prev)}
                        className="py-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Menu />
                    </button>
                </div>

                {/* Page content */}
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
