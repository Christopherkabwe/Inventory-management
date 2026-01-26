import DashboardLayout from "@/components/DashboardLayout";
import Sidebar from "@/components/Simplesidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        return <div className="p-8">Not authenticated</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div>

                <main className="ml-64 p-8">
                    <header className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Settings
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage your account settings and security
                        </p>
                    </header>

                    <div className="space-y-8 max-w-3xl">
                        {/* Profile */}
                        <section className="bg-white border rounded-lg p-6">
                            <h2 className="text-lg font-medium mb-4">
                                Profile
                            </h2>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600">
                                        Full Name
                                    </label>
                                    <input
                                        name="fullName"
                                        defaultValue={user.fullName ?? ""}
                                        className="mt-1 w-full border rounded-md px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">
                                        Email
                                    </label>
                                    <input
                                        value={user.email}
                                        disabled
                                        className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100"
                                    />
                                </div>

                                <button className="bg-black text-white px-4 py-2 rounded-md">
                                    Save changes
                                </button>
                            </form>
                        </section>

                        {/* Password */}
                        <section className="bg-white border rounded-lg p-6">
                            <h2 className="text-lg font-medium mb-4">
                                Change Password
                            </h2>

                            <form className="space-y-4">
                                <input
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Current password"
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                />

                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New password"
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                />

                                <button className="bg-black text-white px-4 py-2 rounded-md">
                                    Update password
                                </button>
                            </form>
                        </section>

                        {/* Sessions */}
                        <section className="bg-white border rounded-lg p-6">
                            <h2 className="text-lg font-medium mb-4">
                                Sessions
                            </h2>

                            <form>
                                <button className="text-red-600 hover:underline">
                                    Log out of all devices
                                </button>
                            </form>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
