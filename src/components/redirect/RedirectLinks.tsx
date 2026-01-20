"use client";

import { useRouter } from "next/navigation";

export interface RedirectLink {
    label: string;
    href: string;
}

interface RedirectLinksProps {
    links: RedirectLink[];
}

export default function RedirectLinks({ links }: RedirectLinksProps) {
    const router = useRouter();

    return (
        <ul className="mt-4 flex flex-col gap-2">
            {links.map((link) => (
                <li key={link.href}>
                    <button
                        onClick={() => router.push(link.href)}
                        className="w-full text-left rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                    >
                        {link.label}
                    </button>
                </li>
            ))}
        </ul>
    );
}
