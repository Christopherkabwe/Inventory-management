"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (!token) {
            setMessage("Invalid or missing token");
            return;
        }

        if (!password || !confirmPassword) {
            setMessage("Please enter and confirm your new password");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,          // from searchParams
                    password,       // new password
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Failed to reset password");
                setLoading(false);
                return;
            }

            setMessage("Password reset successful! Redirecting to sign-in...");
            setTimeout(() => router.push("/sign-in"), 2000);
        } catch (err) {
            console.error(err);
            setMessage("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
                {message && (
                    <p className={`mb-4 text-center ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
                <form onSubmit={handleReset} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
