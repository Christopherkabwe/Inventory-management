"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
    const router = useRouter();

    useEffect(() => {
        async function signOut() {
            try {
                // Remove token from localStorage (if used)
                localStorage.removeItem("token");

                // Optional: call API to clear cookie
                await fetch("/api/auth/signout", { method: "POST" });

                // Redirect to login
                router.replace("/sign-in");
            } catch (err) {
                console.error("Sign out failed:", err);
            }
        }

        signOut();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-center text-lg">Signing out...</p>
        </div>
    );
}
