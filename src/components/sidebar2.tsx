"use client";
import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, Plus, Settings, Info, ShoppingCart, ChevronDown, Menu, X, User, User2Icon, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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
        {
            name: "Users",
            icon: User,
            subItems: [
                { name: "Create New Account", href: "/users/create-user" },
                { name: "Delete Account", href: "/users/delete-user" },
                { name: "Edit Account", href: "/users/edit-user" },
            ],
        },
        {
            name: "Customers",
            icon: User,
            subItems: [
                { name: "Customer Management", href: "/customers/customer-management" },
            ],
        },
        {
            name: "Locations",
            icon: MapPin,
            subItems: [
                { name: "Create New Location", href: "/location/create-location" },
                { name: "Delete Location", href: "/location/delete-location" },
                { name: "Edit Location", href: "/location/edit-location" },
            ],
        },
        {
            name: "Products",
            icon: Package,
            subItems: [
                { name: "Create New Product", href: "/product/create-product" },
                { name: "Delete Product", href: "/product/delete-product" },
                { name: "Edit Product", href: "/product/edit-product" },
            ],
        },
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "About", href: "/about", icon: Info },
    ];


    useEffect(() => {
        const activeItem = NAV_ITEMS.find((item) => item.subItems && item.subItems.some((sub) => currentPath === sub.href));
        if (activeItem) {
            setOpenItems([activeItem.name]);
        }
    }, [currentPath]);

    const toggleItem = (name: string) => {
        if (openItems.includes(name)) {
            setOpenItems(openItems.filter((item) => item !== name));
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
            {/* Hamburger button for small screens */}
            <div className="md:hidden fixed top-4 left-4 z-20 mb-2">
                <button
                    aria-label="Toggle sidebar"
                    onClick={toggleSidebar}
                    className="p-2 rounded-md text-white hover:bg-gray-200"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 z-10 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                <div className="mb-5 mt-5">
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
                                        className={`flex items-center justify-between w-full py-1 px-2 rounded-lg ${parentActive ? "bg-gray-700 text-white" : "hover:bg-gray-500 text-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <IconComponent className="w-5 h-5" />
                                            <span className="text-sm">{item.name}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen(item.name) ? "rotate-180" : ""}`} />
                                    </button>
                                    {isOpen(item.name) && (
                                        <ul className="ml-3">
                                            {item.subItems.map((subItem, subKey) => (
                                                <li key={subKey}>
                                                    <Link
                                                        href={subItem.href}
                                                        className={`flex items-center py-1 px-2 rounded-lg text-sm ${isActive(subItem.href) ? "text-white" : "hover:underline text-gray-300"
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
                                className={`flex items-center space-x-3 py-2 px-3 rounded-lg ${itemActive ? "bg-gray-700 text-gray-800" : "hover:bg-gray-800 text-gray-300"
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

            {/* Overlay for small screens when sidebar is open */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden" onClick={toggleSidebar} />
            )}
        </>
    );
}
