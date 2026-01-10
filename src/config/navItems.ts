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
            { name: "Create User", href: "/users/create-user" },
            { name: "Update Password", href: "/update-password/request" },
            { name: "User Management", href: "/users/user-data" },
        ],
    },
    {
        name: "Test",
        icon: User,
        subItems: [
            { name: "Test Page", href: "/test/test-pages" },
            { name: "Test KPI", href: "/test/testKpi" },
            { name: "Test RBAC", href: "/test/test-rbac" },
        ],
    },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About Us", href: "/about-us", icon: Info },
];