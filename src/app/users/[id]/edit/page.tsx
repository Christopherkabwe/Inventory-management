"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToaster } from "@/components/Toaster" // import your hook
import Loading from "@/components/Loading";

type UserRole = "ADMIN" | "MANAGER" | "USER";

interface User {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.id;
    const { addToast } = useToaster(); // <-- use your toaster

    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState("");
    const [role, setRole] = useState<UserRole>("USER");
    const [isActive, setIsActive] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!userId) return;
        fetchUser(userId);
    }, [userId]);

    const fetchUser = async (id: string) => {
        try {
            const res = await fetch(`/api/users/${id}`);
            if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
            const data = await res.json();
            setUser(data.user);
            setFullName(data.user.fullName);
            setRole(data.user.role);
            setIsActive(data.user.isActive);
        } catch (err: any) {
            console.error(err);
            addToast("Failed to load user", "error");
        }
    };

    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, role, isActive }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update user");

            setUser(data.user);
            addToast("User updated successfully", "success");
            router.push("/users/users"); // redirect after save
        } catch (err: any) {
            console.error(err);
            addToast(err.message || "Failed to save user", "error");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return <Loading message="Loading User. Please Wait..." />;

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">Edit User: {user.fullName}</h1>
            <p className="text-gray-600 mb-4">{user.email}</p>

            <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="MANAGER">Manager</option>
                        <option value="USER">User</option>
                    </select>
                </div>

                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 text-blue-600"
                    />
                    <span>{isActive ? "Active" : "Inactive"}</span>
                </div>

                <div className="flex space-x-4 mt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={() => router.push("/users/users")}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
