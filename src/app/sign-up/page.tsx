import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";
import { SignUp } from "@stackframe/stack";

export const metadata = {
    title: "Sign Up",
};

export default async function SignInPage() {
    const user = await stackServerApp.getUser();

    // Redirect logged-in users to dashboard
    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <SignUp />
        </div>
    );
};