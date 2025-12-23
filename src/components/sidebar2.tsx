"use client";
import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, Plus, Settings, Info, ShoppingCart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const [openItems, setOpenItems] = useState<string[]>([]);
    const currentPath = usePathname();

    useEffect(() => {
        const activeItem = NAV_ITEMS.find((item) => item.subItems && item.subItems.some((sub) => currentPath === sub.href));
        if (activeItem) {
            setOpenItems([activeItem.name]);
        }
    }, [currentPath]);

    const NAV_ITEMS = [
        {
            name: "Dashboard",
            icon: BarChart3,
            subItems: [
                { name: "Inventory Dashboard", href: "/dashboard/inventory" },
                { name: "Sales Dashboard", href: "/dashboard/sales" },
            ],
        },
        { name: "Inventory", href: "/inventory", icon: Package },
        { name: "Add Product", href: "/add-product", icon: Plus },
        { name: "Sales", href: "/sales", icon: ShoppingCart },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "About", href: "/about", icon: Info },
    ];

    const toggleItem = (name: string) => {
        if (openItems.includes(name)) {
            setOpenItems(openItems.filter((item) => item !== name));
        } else {
            setOpenItems([...openItems, name]);
        }
    };

    const isActive = (href: string) => currentPath === href;
    const isParentActive = (subItems?: { href: string }[]) => subItems?.some((sub) => currentPath === sub.href);
    const isOpen = (name: string) => openItems.includes(name);

    return (
        <div className="fixed left-0 top-0 bg-gray-900 text-white w-64 min-h-screen p-6 z-10">
            <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-10 h-10" />
                    <span className="text-md font-semibold">Inventory Management App</span>
                </div>
            </div>
            <nav className="space-y-1">
                <div className="text-sm font-semibold text-gray-400 uppercase">Inventory</div>
                {NAV_ITEMS.map((item, key) => {
                    const IconComponent = item.icon;
                    const parentActive = isParentActive(item.subItems);
                    const itemActive = isActive(item.href);

                    if (item.subItems) {
                        return (
                            <div key={key}>
                                <button
                                    onClick={() => toggleItem(item.name)}
                                    className={`flex items-center justify-between w-full py-2 px-3 rounded-lg ${parentActive ? "bg-purple-50 text-gray-800" : "hover:bg-gray-800 text-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <IconComponent className="w-5 h-5" />
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen(item.name) ? "rotate-180" : ""}`} />
                                </button>
                                {isOpen(item.name) && (
                                    <ul className="ml-6 mt-2 space-y-2">
                                        {item.subItems.map((subItem, subKey) => (
                                            <li key={subKey}>
                                                <Link
                                                    href={subItem.href}
                                                    className={`flex items-center space-x-3 py-2 px-3 rounded-lg text-md ${isActive(subItem.href) ? "text-white-800" : "hover:bg-gray-800 text-gray-300"
                                                        }`}
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
                            href={item.href}
                            key={key}
                            className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${itemActive ? "bg-purple-100 text-gray-800" : "hover:bg-gray-800 text-gray-300"
                                }`}
                        >
                            <IconComponent className="w-5 h-5" />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                    <UserButton showUserInfo />
                </div>
            </div>
        </div>
    );
}