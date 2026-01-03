"use client";
import { UserButton } from "@stackframe/stack";
import {
    BarChart3, Package, Plus, Settings, Info,
    ShoppingCart, ChevronDown, Menu, X, User, MapPin,
    RotateCw,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

interface Props {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ sidebarOpen, toggleSidebar }: Props) {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const currentPath = usePathname();

    const NAV_ITEMS = [
        {
            name: "Dashboard",
            icon: BarChart3,
            subItems: [
                { name: "Inventory Dashboard", href: "/dashboard/inventory" },
                { name: "Sales Dashboard", href: "/dashboard/sales" },
            ],
        },
        {
            name: "Inventory",
            icon: Package,
            subItems: [
                { name: "Inventory Summary", href: "/inventory/inventory" },
                { name: "Add Product", href: "/inventory/add-product" },
                { name: "Production", href: "/inventory/production" },
                { name: "Stock Transfers", href: "/inventory/stock-transfers" },
                { name: "Stock adjustments", href: "/inventory/stock-adjustments" },
                { name: "Stock Reports", href: "/inventory/stock-reports" },
                { name: "Inventory Data", href: "/inventory/inventory-data" },
            ],
        },
        {
            name: "Sales",
            icon: ShoppingCart,
            subItems: [
                { name: "Sales Summary", href: "/sales/sales-summary" },
                { name: "Create Sale", href: "/sales/create-sale" },
                { name: "Credit Notes", href: "/sales/credit-notes" },
                { name: "Sales Returns", href: "/sales/sales-return" },
                { name: "Sales Data", href: "/sales/sales-data" },
            ],
        },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "About Us", href: "/about-us", icon: Info },
    ];

    useEffect(() => {
        const activeItem = NAV_ITEMS.find((item) =>
            item.subItems?.some((sub) => currentPath === sub.href)
        );
        if (activeItem) setOpenItems([activeItem.name]);
    }, [currentPath]);

    const toggleItem = (name: string) => {
        if (openItems.includes(name)) {
            setOpenItems(openItems.filter((i) => i !== name));
        } else {
            setOpenItems([...openItems, name]);
        }
    };

    const isActive = (href: string) => currentPath.startsWith(href);
    const isParentActive = (subItems?: { href: string }[]) =>
        subItems?.some((sub) => currentPath.startsWith(sub.href));
    const isOpen = (name: string) => openItems.includes(name);

    return (
        <>
            {/* Hamburger button */}
            <div className="md:hidden fixed top-4 left-4 z-20">
                <button
                    aria-label="Toggle sidebar"
                    onClick={toggleSidebar}
                    className="p-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-55 p-2 z-10 transform transition-transform duration-300 ease-in-out
                bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0 border-r border-gray-700`}
            >
                <div className="mb-5 mt-5 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <RotateCw className="w-10 h-10" />
                        <div>
                            <span className="text-xl font-semibold">Biz360°</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Business Management
                            </p>
                        </div>
                    </div>

                    {/* Theme toggle */}
                    <ThemeToggle />
                </div>

                <hr className="border-gray-300 dark:border-gray-700 mb-4" />

                <nav className="space-y-1">
                    {NAV_ITEMS.map((item, key) => {
                        const IconComponent = item.icon;
                        const parentActive = isParentActive(item.subItems);
                        const itemActive = isActive(item.href);

                        if (item.subItems) {
                            return (
                                <div key={key}>
                                    <button
                                        onClick={() => toggleItem(item.name)}
                                        className={`flex items-center justify-between w-full py-1 px-2 rounded-lg
                                        ${parentActive ? "font-bold text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <IconComponent className="w-5 h-5" />
                                            <span className="text-sm">{item.name}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen(item.name) ? "rotate-180" : ""}`} />
                                    </button>
                                    {isOpen(item.name) && (
                                        <ul className="ml-3 mt-1 space-y-1">
                                            {item.subItems.map((subItem, subKey) => (
                                                <li key={subKey}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`block py-1 px-2 rounded-lg text-sm
                                                        ${isActive(subItem.href) ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300 hover:underline"}`}
                                                    >
                                                        {subItem.name}
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
                                href={item.href!}
                                key={key}
                                className={`flex items-center gap-3 py-2 px-3 rounded-lg
                                ${itemActive ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"}`}
                            >
                                <IconComponent className="w-5 h-5" />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-300 dark:border-gray-700">
                    <UserButton showUserInfo />
                </div>
            </div>

            {/* Overlay for small screens */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}
