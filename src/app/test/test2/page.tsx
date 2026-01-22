"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import DashboardLayout from "@/components/DashboardLayout";
import Loading from "@/components/Loading";
import withRole from "@/components/withRole";

import { CustomerCombobox } from "@/components/SingleSelectComboBox/CustomerComboBox";
import { ProductCombobox } from "@/components/SingleSelectComboBox/ProductComboBox";
import { NumberInput } from "@/components/SingleSelectComboBox/NumberInput";

/* ==============================
   TYPES
============================== */
interface Customer {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

interface Location {
    id: string;
    name: string;
}

interface SalesOrderItem {
    productId: string;
    quantity: number;
    quantityInvoiced: number;
    product: Product;
}

interface SalesOrder {
    id: string;
    orderNumber: string;
    items: SalesOrderItem[];
}

interface InvoiceItem {
    productId: string;
    quantity: number;
    price: number;
    maxQuantity?: number;
}

const BUSINESS_INFO = {
    name: "Biz360° Business Management",
    address: "Lusaka, Zambia",
    contact: "support@biz360.com | +260 978 370 871",
};

const CreateInvoicePage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState("");

    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [amountPaid, setAmountPaid] = useState(0);

    /* ==============================
       INITIAL LOAD
    ============================== */
    useEffect(() => {
        (async () => {
            try {
                const [c, l] = await Promise.all([
                    fetch("/api/options/customers").then(r => r.json()),
                    fetch("/api/options/locations").then(r => r.json()),
                ]);

                setCustomers(c?.data ?? []);
                setLocations(l?.data ?? []);
            } catch {
                toast.error("Failed to load invoice data");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* ==============================
       LOAD SALES ORDERS
    ============================== */
    useEffect(() => {
        if (!selectedCustomer || !selectedLocation) {
            setSalesOrders([]);
            return;
        }

        (async () => {
            try {
                const res = await fetch(
                    `/api/options/sales-orders?customerId=${selectedCustomer}&locationId=${selectedLocation}`
                );
                const data = await res.json();
                setSalesOrders(data?.data ?? []);
            } catch {
                toast.error("Failed to load sales orders");
            }
        })();
    }, [selectedCustomer, selectedLocation]);

    /* ==============================
       AUTO-POPULATE ITEMS FROM SO
    ============================== */
    useEffect(() => {
        if (!selectedOrderId) {
            setItems([]);
            return;
        }

        const order = salesOrders.find(o => o.id === selectedOrderId);
        if (!order) return;

        const populated: InvoiceItem[] = order.items
            .map(i => {
                const remaining = i.quantity - i.quantityInvoiced;
                if (remaining <= 0) return null;

                return {
                    productId: i.productId,
                    quantity: remaining,
                    maxQuantity: remaining,
                    price: i.product.price,
                };
            })
            .filter(Boolean) as InvoiceItem[];

        setItems(populated);
    }, [selectedOrderId, salesOrders]);

    /* ==============================
       DERIVED VALUES
    ============================== */
    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
        [items]
    );

    const balance = useMemo(
        () => subtotal - amountPaid,
        [subtotal, amountPaid]
    );

    /* ==============================
       ITEM UPDATE
    ============================== */
    const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
        setItems(prev =>
            prev.map((i, idx) => (idx === index ? { ...i, ...patch } : i))
        );
    };

    /* ==============================
       VALIDATION
    ============================== */
    const validateInvoice = () => {
        if (!selectedCustomer || !selectedLocation || !selectedOrderId) {
            toast.error("Customer, location and sales order are required");
            return false;
        }

        for (const item of items) {
            if (item.quantity <= 0) {
                toast.error("Quantity must be greater than zero");
                return false;
            }

            if (
                item.maxQuantity !== undefined &&
                item.quantity > item.maxQuantity
            ) {
                toast.error("Cannot invoice more than remaining order quantity");
                return false;
            }
        }

        if (amountPaid < 0 || amountPaid > subtotal) {
            toast.error("Invalid payment amount");
            return false;
        }

        return true;
    };

    /* ==============================
       SUBMIT
    ============================== */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        if (!validateInvoice()) {
            setIsCreating(false);
            return;
        }

        try {
            const res = await fetch("/api/rbac/sales-flow/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: selectedCustomer,
                    locationId: selectedLocation,
                    salesOrderId: selectedOrderId,
                    items,
                    amountPaid,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Failed to create invoice");

            toast.success("Invoice created successfully");
            router.push(`/sales/invoices/${data.id}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loading message="Loading invoice form..." />
            </DashboardLayout>
        );
    }

    /* ==============================
       RENDER
    ============================== */
    return (
        <DashboardLayout>
            <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6"
                >
                    <h1 className="text-2xl font-semibold">Create Invoice</h1>

                    {/* LOCATION */}
                    <select
                        value={selectedLocation}
                        onChange={e => setSelectedLocation(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Location</option>
                        {locations.map(l => (
                            <option key={l.id} value={l.id}>
                                {l.name}
                            </option>
                        ))}
                    </select>

                    {/* CUSTOMER */}
                    <CustomerCombobox
                        customers={customers}
                        value={selectedCustomer}
                        onChange={setSelectedCustomer}
                    />

                    {/* SALES ORDER */}
                    <select
                        value={selectedOrderId}
                        onChange={e => setSelectedOrderId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Sales Order</option>
                        {salesOrders.map(o => (
                            <option key={o.id} value={o.id}>
                                {o.orderNumber}
                            </option>
                        ))}
                    </select>

                    {/* ITEMS */}
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            <ProductCombobox
                                products={[]}
                                value={item.productId}
                                onChange={() => { }}
                                disabled
                            />

                            <NumberInput
                                value={item.quantity}
                                min={1}
                                max={item.maxQuantity}
                                onChange={val =>
                                    updateItem(index, { quantity: val })
                                }
                            />

                            <p className="text-xs text-gray-500">
                                Remaining: {item.maxQuantity}
                            </p>
                        </div>
                    ))}

                    {/* PAYMENT */}
                    <NumberInput
                        label="Amount Paid"
                        value={amountPaid}
                        min={0}
                        max={subtotal}
                        onChange={setAmountPaid}
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            disabled={isCreating}
                            className="px-6 py-2 bg-purple-600 text-white rounded"
                        >
                            {isCreating ? "Creating..." : "Create Invoice"}
                        </button>
                    </div>
                </form>

                {/* PREVIEW */}
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
                    <p className="font-bold">{BUSINESS_INFO.name}</p>
                    <p className="text-sm">{BUSINESS_INFO.address}</p>
                    <p className="text-sm">{BUSINESS_INFO.contact}</p>

                    <hr className="my-4" />

                    <p><strong>Subtotal:</strong> K{subtotal.toFixed(2)}</p>
                    <p><strong>Paid:</strong> K{amountPaid.toFixed(2)}</p>
                    <p><strong>Balance:</strong> K{balance.toFixed(2)}</p>
                </div>
            </div>

            <Toaster />
        </DashboardLayout>
    );
};

export default withRole(CreateInvoicePage, ["ADMIN"]);