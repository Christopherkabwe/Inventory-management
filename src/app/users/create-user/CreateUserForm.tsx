"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { UserRole } from "@/lib/rbac";
import { useRouter } from "next/navigation";
import { useToaster } from "@/components/Toaster";

interface Location { id: string; name: string; }
interface CurrentUser { id: string; role: UserRole; locationId: string | null; }
interface CreateUserFormState {
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
    locationId: string;
}
interface Props { currentUser: CurrentUser; }

export default function CreateUserForm({ currentUser }: Props) {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<CreateUserFormState>({
        email: "", fullName: "", password: "", role: UserRole.USER, locationId: ""
    });
    const router = useRouter();
    const { addToast } = useToaster();

    // Load locations
    useEffect(() => {
        async function loadLocations() {
            const res = await fetch("/api/locations");
            const data = await res.json();
            if (!data.success) return;
            let allowed: Location[] = data.locations;
            if (currentUser.role === UserRole.MANAGER) {
                allowed = allowed.filter((l) => l.id === currentUser.locationId);
            }
            setLocations(allowed);
        }
        loadLocations();
    }, [currentUser]);

    // Input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => {
            if (name === "role") {
                const role = value as UserRole;
                return { ...prev, role, locationId: role === UserRole.ADMIN ? "" : prev.locationId };
            }
            return { ...prev, [name]: value };
        });
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const effectiveLocation =
                currentUser.role === UserRole.MANAGER
                    ? currentUser.locationId
                    : form.locationId;

            const payload = {
                ...form,
                locationId: effectiveLocation,
            };

            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                addToast(data.error || "Failed to create user", "error");
                return;
            }

            addToast("User created successfully");
            router.push("/users");

        } catch (err) {
            console.error(err);
            addToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" required />
                    <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" required />
                    <input name="password" type="password" placeholder="Password" value={form.password || ""} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" required />
                    <p className="text-sm text-gray-500">Password must be at least 6 characters</p>

                    {/* Role */}
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        disabled={currentUser.role === UserRole.MANAGER}
                    >
                        <option value={UserRole.USER}>USER</option>

                        {currentUser.role === UserRole.ADMIN && (
                            <>
                                <option value={UserRole.MANAGER}>MANAGER</option>
                                <option value={UserRole.ADMIN}>ADMIN</option>
                            </>
                        )}
                    </select>

                    {/* Location */}
                    <select name="locationId" value={form.locationId} onChange={handleChange} className="w-full border px-3 py-2 rounded-md" required={form.role !== UserRole.ADMIN}>
                        {form.role === UserRole.ADMIN && <option value="">No location (Admin only)</option>}
                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>

                    <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md">
                        {loading ? "Creating..." : "Create User"}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
