"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Key } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

export default function UserInfoDropdown() {
    const [user, setUser] = useState<User | null>(null);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("/api/users/me");
                const data = await res.json();
                if (data.success) setUser(data.user);
            } catch (err) {
                console.error("Failed to load user:", err);
            }
        }
        loadUser();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await fetch("/api/auth/signout", { method: "POST" });
            localStorage.removeItem("auth_token");
            router.replace("/sign-in");
        } catch (err) {
            console.error("Sign out failed:", err);
        }
    };

    if (!user) return <p className="text-sm text-gray-700">Loading...</p>;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white uppercase">
                    {user.fullName[0]}
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.fullName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute bottom-15 left-0 w-max min-w-[12rem] mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    {/* User info at top */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:cursor-pointer">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.role}</p>
                    </div>
                    {/* Actions */}
                    <ul className="py-2">
                        <li>
                            <button
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => router.push("/settings")}
                            >
                                <Settings className="w-4 h-4" /> Settings
                            </button>
                        </li>
                        <li>
                            <button
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => router.push("/update-password/request")}
                            >
                                <Key className="w-4 h-4" /> Update Password
                            </button>
                        </li>
                        <li>
                            <button
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                                onClick={handleSignOut}
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
