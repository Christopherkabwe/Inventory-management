// ./config/navItems.ts

import {
    BarChart3,
    Package,
    ShoppingCart,
    Settings,
    Info,
    User,
    Factory,
    Ship,
    Truck
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
        name: "Production",
        icon: Factory,
        subItems: [
            { name: "Add Productions", href: "/production/add-productions" },
            { name: "Production Data", href: "/production/production-data" },
            { name: "Production Report", href: "/production/production-reports" },
        ],
    },
    {
        name: "Inventory",
        icon: Package,
        subItems: [
            { name: "Inventory Management", href: "/inventory/inventory-management" },
            { name: "Add Product", href: "/inventory/add-product" },
            { name: "Stock Transfers", href: "/inventory/stock-transfers" },
            { name: "Stock adjustments", href: "/inventory/stock-adjustments" },
            { name: "Stock Reports", href: "/inventory/stock-reports" },
            { name: "Inventory Data", href: "/inventory/inventory-data" },
        ],
    },
    {
        name: "Transfers",
        icon: Truck,
        subItems: [
            { name: "Create Transfer", href: "/transfers/create-transfer" },
            { name: "Dispatch Transfer", href: "/transfers/dispatch-transfer" },
            { name: "Receive Transfer", href: "/transfers/receive-transfer" },
            { name: "Manage Transfers", href: "/transfers" },
            { name: "Transfers Data", href: "/transfers/transfer-data" },
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
        icon: Ship,
        subItems: [
            { name: "Test Page", href: "/test/test-pages" },
            { name: "Test KPI", href: "/test/testKpi" },
            { name: "Test RBAC", href: "/test/test-rbac" },
            { name: "Test Inventory", href: "/test/test2" },
            { name: "Test Filters", href: "/test/test-filters" },
        ],
    },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About Us", href: "/about-us", icon: Info },
];