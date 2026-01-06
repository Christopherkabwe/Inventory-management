"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToaster } from "@/components/Toaster";

export default function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToaster();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                addToast(data.error || "Login failed", "error");
                return;
            }

            // Save token in localStorage (or cookies if you want SSR)
            localStorage.setItem("token", data.token);
            addToast("Login successful");
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            addToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-md"
                    required
                />
                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
