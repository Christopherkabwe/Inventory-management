// ./config/navItems.ts

import { Money } from "@mui/icons-material";
import {
    BarChart3,
    Package,
    ShoppingCart,
    Settings,
    Info,
    User,
    Factory,
    Ship,
    Truck,
    DollarSign
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
            { name: "Production Report", href: "/production/production-reports" },
            { name: "Production Data", href: "/production/production-data" },
            { name: "Bill of Materials", href: "/production/production-reports" },
            { name: "Work Order Management", href: "/production/production-reports" },
            { name: "Quality Control", href: "/production/production-reports" },
            { name: "Material Requirement Planning", href: "/production/production-reports" },
            { name: "Capacity Planning", href: "/production/production-reports" },
        ],
    },
    {
        name: "Products",
        icon: Package,
        subItems: [
            { name: "Add Product", href: "/products/add-product" },
            { name: "Product List", href: "/products/product-management" },
        ],
    },
    {
        name: "Inventory",
        icon: Package,
        subItems: [
            { name: "Inventory Management", href: "/inventory/stock-management" },
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
            { name: "Dispatch Transfer", href: "/transfers/create-transfer" },
            { name: "Receive Transfer", href: "/transfers/create-transfer" },
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
            { name: "Customer Service", href: "/customers/customer-management" },
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
            { name: "Quotations", href: "/sales/sales-orders" },
            { name: "Create Sales Order", href: "/sales/sales-orders/create-sales-order" },
            { name: "Invoices", href: "/sales/invoices" },
            { name: "Delivery Notes", href: "/sales/delivery-notes" },
            { name: "Sales Forecasting", href: "/sales/invoices" },
            { name: "Targets vs Achievements", href: "/sales/invoices" },
            { name: "Sales Reporting", href: "/sales/invoices" },
        ],
    },
    {
        name: "Accounting",
        icon: DollarSign,
        subItems: [
            { name: "Add New Payment", href: "/payments/new" },
            { name: "Customer Payments", href: "/payments" },
            { name: "Allocation Tracker", href: "/payments/allocations" },
            { name: "Account Receivables Aging", href: "/payments/aging" },
            { name: "Account Payables Aging", href: "/payments/aging" },
            { name: "Account Receivables", href: "/payments/receivables" },
            { name: "Account Payables", href: "/payments/payables" },
            { name: "Statement of Accounts", href: "/payments/statements" },
            { name: "Journals", href: "/payments" },
            { name: "General Ledger", href: "/payments" },
            { name: "Payment Processing", href: "/payments" },
            { name: "Cash Management", href: "/payments" },
            { name: "Payment Overview", href: "/payments/payment-overview" },
        ],
    },
    {
        name: "Finance",
        icon: DollarSign,
        subItems: [
            { name: "Financial Reporting", href: "/payments/new" },
            { name: "Budgeting & Forecasting", href: "/payments" },
            { name: "Cash Flow Management", href: "/payments/allocations" },
            { name: "Trial Balance", href: "/payments" },
            { name: "Balance Sheet", href: "/payments" },
            { name: "Cash Flow statement", href: "/payments" },
            { name: "Income statement", href: "/payments" },
        ],
    },
    {
        name: "Human Resource",
        icon: User,
        subItems: [
            { name: "Employee Management", href: "/payments/new" },
            { name: "Payroll Management", href: "/payments" },
            { name: "Benefits Administration", href: "/payments/allocations" },
            { name: "Time off Management", href: "/payments" },
            { name: "Performance Management", href: "/payments" },
            { name: "Recruitment Management", href: "/payments" },
            { name: "Training and Development", href: "/payments" },
            { name: "Employee Self Service", href: "/payments" },
            { name: "HR Reporting", href: "/payments" },
        ],
    },
    {
        name: "Users",
        icon: User,
        subItems: [
            { name: "Create User", href: "/users/create-user" },
            { name: "User Data", href: "/users/user-data" },
        ],
    },
    {
        name: "Sequence",
        icon: User,
        subItems: [
            { name: "Sequence", href: "/users/create-user" },
        ],
    },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About Us", href: "/about-us", icon: Info },

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
];