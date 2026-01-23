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
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";

/* ==============================
   TYPES
============================== */
interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    weightValue?: number;
    weightUnit?: string;
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

    /* ==============================
       STATE
    ============================== */
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState("");

    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [amountPaid, setAmountPaid] = useState(0);
    const [availableQuantities, setAvailableQuantities] = useState<Record<string, number>>({});

    /* ==============================
       INITIAL DATA LOAD
    ============================== */
    useEffect(() => {
        async function fetchData() {
            try {
                const [cRes, lRes, pRes] = await Promise.all([
                    fetch("/api/options/customers").then(r => r.json()),
                    fetch("/api/options/locations").then(r => r.json()),
                    fetch("/api/options/products").then(r => r.json()),
                ]);

                setCustomers(cRes ?? []);
                setLocations(lRes ?? []);
                setProducts(pRes ?? []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load form data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    /* ==============================
       RESET DOWNSTREAM SELECTIONS
    ============================== */
    useEffect(() => {
        // When location changes: reset customer, order, items
        setSelectedCustomer("");
        setSelectedOrderId("");
        setItems([]);
        setSalesOrders([]);
    }, [selectedLocation]);

    useEffect(() => {
        // When customer changes: reset order, items
        setSelectedOrderId("");
        setItems([]);
    }, [selectedCustomer]);

    /* ==============================
       LOAD SALES ORDERS
    ============================== */
    useEffect(() => {
        if (!selectedLocation) {
            setSalesOrders([]);
            return;
        }

        (async () => {
            try {
                const params = new URLSearchParams();
                params.set("locationId", selectedLocation);
                if (selectedCustomer) params.set("customerId", selectedCustomer);

                const res = await fetch(`/api/options/sales-orders?${params.toString()}`);
                const data = await res.json();
                console.log(data)
                setSalesOrders(data?.data ?? []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load sales orders");
            }
        })();
    }, [selectedLocation, selectedCustomer]);

    /* ==============================
       AUTO-POPULATE ITEMS FROM SALES ORDER
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

        // Fetch available stock per product
        populated.forEach(async i => {
            try {
                const res = await fetch(`/api/products/${i.productId}/stock`);
                const quantity = await res.json();
                if (typeof quantity === "number") {
                    setAvailableQuantities(prev => ({ ...prev, [i.productId]: quantity }));
                }
            } catch (err) {
                console.error(err);
            }
        });
    }, [selectedOrderId, salesOrders]);

    /* ==============================
       DERIVED VALUES
    ============================== */
    const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.price, 0), [items]);
    const balance = useMemo(() => subtotal - amountPaid, [subtotal, amountPaid]);

    const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

    /* ==============================
       ITEM UPDATE
    ============================== */
    const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
        setItems(prev => prev.map((i, idx) => (idx === index ? { ...i, ...patch } : i)));
    };

    /* ==============================
       VALIDATION
    ============================== */
    const validateInvoice = () => {
        if (!selectedCustomer || !selectedLocation || !selectedOrderId) {
            toast.error("Customer, location, and sales order are required");
            return false;
        }

        for (const item of items) {
            if (item.quantity <= 0) {
                toast.error("Quantity must be greater than zero");
                return false;
            }
            if (item.maxQuantity !== undefined && item.quantity > item.maxQuantity) {
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
       SUBMIT INVOICE
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

    if (loading) return <DashboardLayout><Loading message="Loading invoice form..." /></DashboardLayout>;

    /* ==============================
       RENDER
    ============================== */
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-6 space-y-6">
                {/* FORM */}
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
                    <h1 className="text-2xl font-semibold">Create Invoice</h1>

                    {/* LOCATION */}
                    <LocationCombobox
                        locations={locations}
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                    />

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
                            <option key={o.id} value={o.id}>{o.orderNumber}</option>
                        ))}
                    </select>

                    {/* ITEMS */}
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ProductCombobox
                                products={products}
                                value={item.productId}
                                disabled
                            />

                            <NumberInput
                                value={item.quantity}
                                min={1}
                                max={item.maxQuantity}
                                onChange={val => updateItem(index, { quantity: val })}
                            />

                            {item.maxQuantity !== undefined && (
                                <span className="text-xs text-gray-500">Remaining: {item.maxQuantity}</span>
                            )}
                        </div>
                    ))}

                    {/* AMOUNT PAID */}
                    <NumberInput
                        label="Amount Paid"
                        value={amountPaid}
                        min={0}
                        max={subtotal}
                        onChange={setAmountPaid}
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                            {isCreating ? "Creating..." : "Create Invoice"}
                        </button>
                    </div>
                </form>

                {/* PREVIEW */}
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>

                    <div className="flex justify-between mb-4">
                        <div>
                            <p className="font-bold">{BUSINESS_INFO.name}</p>
                            <p className="text-sm">{BUSINESS_INFO.address}</p>
                            <p className="text-sm">{BUSINESS_INFO.contact}</p>
                        </div>
                        <div className="text-right">
                            <p><strong>Customer:</strong> {selectedCustomerData?.name ?? "-"}</p>
                            <p>{selectedCustomerData?.address ?? ""}</p>
                            <p>{selectedCustomerData?.email ?? ""}</p>
                            <p>{selectedCustomerData?.phone ?? ""}</p>
                        </div>
                    </div>

                    <table className="w-full border text-sm border-black">
                        <thead className="bg-zinc-100 border-b border-black">
                            <tr>
                                <th className="px-4 py-2 border-r border-black text-left">Product</th>
                                <th className="px-4 py-2 border-r border-black text-center">Price</th>
                                <th className="px-4 py-2 border-r border-black text-center">Quantity</th>
                                <th className="px-4 py-2 border-r border-black text-center">Tonnage</th>
                                <th className="px-4 py-2 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items
                                .filter(item => item.quantity > 0)
                                .map((item, i) => {
                                    const product = products.find(p => p.id === item.productId);
                                    const price = product?.price ?? 0;
                                    const quantity = item.quantity ?? 0;
                                    const tonnage = product?.weightValue ? (product.weightValue * quantity) / 1000 : 0;
                                    return (
                                        <tr key={i} className="border-b border-black">
                                            <td className="px-4 py-2">{product?.name ?? "-"}</td>
                                            <td className="px-4 py-2 text-center">K{price.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">{quantity}</td>
                                            <td className="px-4 py-2 text-center">{tonnage.toFixed(2)} MT</td>
                                            <td className="px-4 py-2 text-center">K{(price * quantity).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-zinc-100 font-semibold border-t border-black">
                                <td colSpan={2} className="px-4 py-2 text-center border-r border-black">TOTAL</td>
                                <td className="px-4 py-2 text-center border-r border-black">{items.reduce((a, i) => a + i.quantity, 0)}</td>
                                <td className="px-4 py-2 text-center border-r border-black">{items.reduce((acc, i) => acc + ((products.find(p => p.id === i.productId)?.weightValue ?? 0) * i.quantity) / 1000, 0).toFixed(2)} MT</td>
                                <td className="px-4 py-2 text-center">K{subtotal.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="mt-4 text-right space-y-1">
                        <p><strong>Paid:</strong> K{amountPaid.toFixed(2)}</p>
                        <p><strong>Balance:</strong> K{balance.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <Toaster />
        </DashboardLayout>
    );
};

export default withRole(CreateInvoicePage, ["ADMIN"]);
