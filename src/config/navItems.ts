// ./config/navItems.ts

import {
    BarChart3,
    Package,
    ShoppingCart,
    Settings,
    Info,
    User
} from "lucide-react";

export interface NavSubItem {
    name: string;
    href: string;
}

export interface NavItem {
    name: string;
    icon?: any;
    href?: string;
    subItems?: NavSubItem[];
}

export const NAV_ITEMS: NavItem[] = [
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
            { name: "User Management", href: "/users" },
            { name: "Create User", href: "/users/create-user" },
        ],
    },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About Us", href: "/about-us", icon: Info },
];