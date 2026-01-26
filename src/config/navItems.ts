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
        name: "Products",
        icon: Package,
        subItems: [
            { name: "Add Product", href: "/products/add-product" },
            { name: "Products Management", href: "/products/product-management" },
        ],
    },
    {
        name: "Inventory",
        icon: Package,
        subItems: [
            { name: "Stock Management", href: "/inventory/stock-management" },
            { name: "Stock adjustments", href: "/inventory/stock-adjustments" },
            { name: "Stock Reports", href: "/inventory/stock-reports" },
            { name: "Inventory Data", href: "/inventory/inventory-data" },
            { name: "Inventory History", href: "/inventory/inventory-history" },
        ],
    },
    {
        name: "Transfers",
        icon: Truck,
        subItems: [
            { name: "Create Transfer", href: "/transfers/create-transfer" },
            { name: "Manage Transfers", href: "/transfers/manage-transfers" },
            { name: "Transfers Data", href: "/transfers/transfer-data" },
        ],
    },
    {
        name: "Customers",
        icon: User,
        subItems: [
            { name: "Create Customer", href: "/customers/create-customer" },
            { name: "Customer Management", href: "/customers/customer-management" },
        ],
    },
    {
        name: "Sales",
        icon: ShoppingCart,
        subItems: [
            { name: "Sales Summary", href: "/sales/sales-summary" },
            { name: "Create Sale", href: "/sales/create-sale" },
            { name: "Credit Notes", href: "/sales/credit-notes" },
            { name: "Sales Return", href: "/sales/sales-returns" },
            { name: "Sales Data", href: "/sales/sales-data" },
            { name: "Sales Orders", href: "/sales/sales-orders" },
            { name: "Create Sales Order", href: "/sales/sales-orders/create-sales-order" },
            { name: "Invoices", href: "/sales/invoices" },
            { name: "Delivery Notes", href: "/sales/delivery-notes" },
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