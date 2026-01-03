"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Sun
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Moon

interface ThemeToggleProps {
    className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Only render after mount to avoid hydration mismatch
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const currentTheme = theme === "system" ? "light" : theme;
    const isDark = currentTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`absolute top-2 right-2 z-50 p-1 rounded-sm
                  ${isDark ? "text-white" : "text-black"} 
                  shadow-md hover:scale-105 transition-transform ${className}`}
            aria-label="Toggle Theme"
        >
            {isDark ? <DarkModeIcon sx={{ fontSize: 30 }} /> : <WbSunnyIcon sx={{ fontSize: 30 }} />}
        </button>
    );
}
