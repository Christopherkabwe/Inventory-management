"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            // Save JWT in cookie or localStorage
            document.cookie = `auth_token=${data.token}; path=/; max-age=604800`;
            localStorage.setItem("auth_token", data.token);

            router.replace("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
                <h2 className="text-xl font-bold text-center">Sign In</h2>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-sm text-center mt-2">
                    <a href="/update-password/request" className="text-blue-600 hover:underline">
                        Forgot password?
                    </a>
                </p>

                <p className="text-sm text-center mt-1">
                    Don't have an account?{" "}
                    <a href="/sign-up" className="text-blue-600 hover:underline">
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
}
