"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useState, useEffect } from "react";

interface Props {
    children: ReactNode;
}

export default function ThemeProviderWrapper({ children }: Props) {
    const [mounted, setMounted] = useState(false);

    // Wait until the client mounts to avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return null; // nothing rendered on server

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    );
}
