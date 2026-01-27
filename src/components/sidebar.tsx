"use client";

import {
    ChevronDown,
    Menu,
    X,
    RotateCw,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/config/navItems";
import UserInfo from "@/components/UserInfo";

interface Props {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ sidebarOpen, toggleSidebar }: Props) {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const pathname = usePathname();

    useEffect(() => {
        const activeItem = NAV_ITEMS.find(item =>
            item.subItems?.some(sub => pathname.startsWith(sub.href))
        );
        if (activeItem) setOpenItems([activeItem.name]);
    }, [pathname]);

    const toggleItem = (name: string) => {
        setOpenItems(prev =>
            prev.includes(name)
                ? prev.filter(i => i !== name)
                : [...prev, name]
        );
    };

    const isParentActive = (item: typeof NAV_ITEMS[number]) => {
        if (!item.subItems) return false;
        return item.subItems.some(sub => pathname.startsWith(sub.href));
    };
    const isActive = (href: string) => pathname.startsWith(href);
    const isOpen = (name: string) => openItems.includes(name);

    return (
        <aside
            className={`
    fixed top-0 left-0 z-50 h-full
    bg-gray-900 dark:bg-gray-900
    text-white dark:text-gray-100
    transition-all duration-300 ease-in-out
    overflow-hidden
    ${sidebarOpen ? "w-64" : "w-0"}
  `}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <RotateCw className="w-8 h-8" />
                        <div>
                            <span className="text-lg font-semibold">Biz360°</span>
                            <p className="text-xs text-gray-300 dark:text-gray-300">
                                Business Management
                            </p>
                        </div>
                    </div>

                    <button onClick={toggleSidebar} className="md:hidden" aria-label="Close sidebar">
                        <X />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {NAV_ITEMS.map((item, index) => {
                        const Icon = item.icon;

                        if (item.subItems) {
                            return (
                                <div key={index}>
                                    <button
                                        onClick={() => toggleItem(item.name)}
                                        className={`flex w-full items-center justify-between px-3 py-2 rounded-lg 
                                            ${isParentActive(item) ? "font-bold" : "hover:underline cursor-pointer"}`
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5" />
                                            <span className="text-sm">{item.name}</span>
                                        </div>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${isOpen(item.name) ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    {isOpen(item.name) && (
                                        <ul className="ml-6 mt-1 space-y-1">
                                            {item.subItems.map((sub, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link
                                                        href={sub.href}
                                                        className={`block px-3 py-1 text-sm rounded 
                          ${isActive(sub.href)
                                                                ? "font-semibold underline dark:bg-gray-700"
                                                                : "hover:underline"
                                                            }`}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={index}
                                href={item.href!}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg 
              ${isActive(item.href!) ? "hover:underline" : "hover:underline"}`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-300 dark:border-gray-700">
                    <UserInfo />
                </div>
            </div>
        </aside>
    );
}
