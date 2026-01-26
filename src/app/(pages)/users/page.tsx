"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserRole } from "@/lib/rbac";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useUser } from "@/app/context/UserContext";

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
    const user = useUser();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const isAuthorized = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;

    useEffect(() => {
        async function loadUsers() {
            if (!user) return;

            if (!isAuthorized) {
                // Regular users see only themselves
                setUsers([user]);
                setLoading(false);
                return;
            }

            // Admins/Managers fetch full user list
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                if (data.success && Array.isArray(data.users)) {
                    setUsers(data.users);
                } else {
                    setUsers([]);
                }
            } catch (err) {
                console.error(err);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }

        loadUsers();
    }, [user, isAuthorized]);

    if (loading) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <div>
            <div className="p-8 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Users</h1>

                {users.length === 0 && (
                    <p className="text-center text-gray-600">No users found.</p>
                )}

                {!isAuthorized ? (
                    // Non-admin users
                    users.map((u) => (
                        <div
                            key={u.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4 mb-6"
                        >
                            <p className="text-sm font-medium text-gray-700">Full Name</p>
                            <p className="mt-1 text-gray-900">{u.fullName || "-"}</p>
                            <p className="text-sm font-medium text-gray-700">Email</p>
                            <p className="mt-1 text-gray-900">{u.email || "-"}</p>
                            <p className="text-sm font-medium text-gray-700">Role</p>
                            <p className="mt-1 text-gray-900">{u.role}</p>
                            <p className="text-sm font-medium text-gray-700">Location</p>
                            <p className="mt-1 text-gray-900">{u.location?.name || "-"}</p>
                            <p className="text-sm font-medium text-gray-700">Status</p>
                            <p className="mt-1 text-gray-900">{u.isActive ? "Active" : "Inactive"}</p>
                            <p className="text-sm font-medium text-gray-700">Created At</p>
                            <p className="mt-1 text-gray-900">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                            </p>
                        </div>
                    ))
                ) : (
                    // Admin/Manager table
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
                                {users.map((u) => (
                                    <tr key={u.id} className="whitespace-nowrap hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">{u.fullName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                                        <td className="border border-gray-300 px-4 py-2">{u.role}</td>
                                        <td className="border border-gray-300 px-4 py-2">{u.location?.name || "-"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{u.isActive ? "Active" : "Inactive"}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <div className="flex space-x-2">
                                                <Link href={`/users/user-data/${u.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                                                <button onClick={() => alert("Delete action")} className="text-red-600 hover:underline">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
