"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserRole } from "@/lib/rbac";
import Link from "next/link";
import Loading from "@/components/Loading";

interface Location {
    id: string;
    name: string;
}

interface User {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    location?: Location | null;
    isActive: boolean;
    createdAt?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                // Fetch current user
                const meRes = await fetch("/api/users/me");
                const meData = await meRes.json();
                if (!meData.success) throw new Error("Unauthorized");
                setCurrentUser(meData.user);

                // Check role
                const authorized =
                    meData.user.role === UserRole.ADMIN ||
                    meData.user.role === UserRole.MANAGER;
                setIsAuthorized(authorized);

                // Fetch users if authorized
                if (authorized) {
                    const res = await fetch("/api/users");
                    const data = await res.json();
                    if (data.success) setUsers(data.data);
                } else {
                    // Not authorized → show only self
                    setUsers([meData.user]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <Loading message="Loading... Please wait" />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Users</h1>

                {!isAuthorized ? (
                    // --------------------------------------
                    // Read-only cards for unauthorized users
                    // --------------------------------------
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4 mb-6"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-700">Full Name</p>
                                <p className="mt-1 text-gray-900">{user.fullName || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Email</p>
                                <p className="mt-1 text-gray-900">{user.email || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Role</p>
                                <p className="mt-1 text-gray-900">{user.role}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Location</p>
                                <p className="mt-1 text-gray-900">{user.location?.name || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Status</p>
                                <p className="mt-1 text-gray-900">{user.isActive ? "Active" : "Inactive"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Created At</p>
                                <p className="mt-1 text-gray-900">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    // --------------------------------------
                    // Authorized users → table with actions
                    // --------------------------------------
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="whitespace-nowrap hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">{user.fullName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                        <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                                        <td className="border border-gray-300 px-4 py-2">{user.location?.name || "-"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{user.isActive ? "Active" : "Inactive"}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div className="flex space-x-2">
                                                <Link href={`/users/${user.id}/edit`} className="text-blue-600 hover:underline">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => alert("Delete action")}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
