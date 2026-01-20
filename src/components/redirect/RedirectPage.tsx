"use client";

import DashboardLayout from "../DashboardLayout";
import RedirectLinks, { RedirectLink } from "./RedirectLinks";

interface RedirectPageProps {
    message: string;
    links: RedirectLink[];
}

export default function RedirectPage({ message, links }: RedirectPageProps) {
    return (
        <DashboardLayout>
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
                {/* Message */}
                <h2 className="mb-4 text-xl font-semibold text-zinc-900 text-center">
                    {message}
                </h2>

                {/* Redirect buttons */}
                <RedirectLinks links={links} />
            </div>
        </DashboardLayout>
    );
}
