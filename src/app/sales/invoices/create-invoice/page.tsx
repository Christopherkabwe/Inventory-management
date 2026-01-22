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
    weightValue: number;
}

interface Location {
    id: string;
    name: string;
}

interface InvoiceItem {
    productId: string;
    quantity: number;
    price: number;
}

const EMPTY_ITEM: InvoiceItem = {
    productId: "",
    quantity: 1,
    price: 0,
};

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
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    const [items, setItems] = useState<InvoiceItem[]>([EMPTY_ITEM]);
    const [amountPaid, setAmountPaid] = useState(0);

    /** Stock cache: productId_locationId → quantity */
    const [stockCache, setStockCache] = useState<Record<string, number>>({});

    /* ==============================
       INITIAL LOAD
    ============================== */
    useEffect(() => {
        (async () => {
            try {
                const [customersRes, productsRes, locationsRes] = await Promise.all([
                    fetch("/api/options/customers").then(r => r.json()),
                    fetch("/api/options/products").then(r => r.json()),
                    fetch("/api/options/locations").then(r => r.json()),
                ]);

                setCustomers(customersRes?.data ?? customersRes ?? []);
                setProducts(productsRes?.products ?? productsRes ?? []);
                setLocations(locationsRes?.data ?? locationsRes ?? []);
            } catch {
                toast.error("Failed to load form data");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

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

    const selectedCustomerData = useMemo(
        () => customers.find(c => c.id === selectedCustomer),
        [customers, selectedCustomer]
    );

    /* ==============================
       STOCK (LOCATION AWARE)
    ============================== */
    const fetchStock = async (productId: string) => {
        if (!selectedLocation) return;

        const key = `${productId}_${selectedLocation}`;
        if (stockCache[key] !== undefined) return;

        try {
            const res = await fetch(
                `/api/products/${productId}/stock?locationId=${selectedLocation}`
            );
            const data = await res.json();

            const quantity =
                typeof data === "number" ? data : Number(data?.quantity ?? 0);

            setStockCache(prev => ({ ...prev, [key]: quantity }));
        } catch {
            toast.error("Failed to fetch stock");
        }
    };

    const getAvailableStock = (productId: string) => {
        if (!selectedLocation) return undefined;
        return stockCache[`${productId}_${selectedLocation}`];
    };

    /* ==============================
       ITEM HELPERS
    ============================== */
    const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
        setItems(prev =>
            prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
        );
    };

    const addItem = () => setItems(prev => [...prev, EMPTY_ITEM]);

    const removeItem = (index: number) =>
        setItems(prev => prev.filter((_, i) => i !== index));

    /* ==============================
       VALIDATION
    ============================== */
    const validateInvoice = async () => {
        if (!selectedCustomer) {
            toast.error("Please select a customer");
            return false;
        }

        if (!selectedLocation) {
            toast.error("Please select a point of sale");
            return false;
        }

        if (items.length === 0) {
            toast.error("Invoice must contain at least one item");
            return false;
        }

        for (const item of items) {
            if (!item.productId) {
                toast.error("All items must have a product");
                return false;
            }

            if (item.quantity <= 0) {
                toast.error("Quantity must be greater than zero");
                return false;
            }

            const available = getAvailableStock(item.productId);
            if (available !== undefined && item.quantity > available) {
                const product = products.find(p => p.id === item.productId);
                toast.error(`Insufficient stock for ${product?.name}`);
                return false;
            }
        }

        return true;
    };

    /* ==============================
       SUBMIT
    ============================== */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        if (!(await validateInvoice())) {
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

                    {/* LOCATION (POS) */}
                    <div>
                        <label className="text-sm font-medium">Point of Sale</label>
                        <select
                            value={selectedLocation}
                            onChange={e => {
                                setSelectedLocation(e.target.value);
                                setStockCache({});
                            }}
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select location</option>
                            {locations.map(l => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <CustomerCombobox
                        customers={customers}
                        value={selectedCustomer}
                        onChange={setSelectedCustomer}
                    />

                    {items.map((item, index) => {
                        const availableStock = getAvailableStock(item.productId);

                        return (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <ProductCombobox
                                    products={products}
                                    value={item.productId}
                                    onChange={async id => {
                                        const prod = products.find(p => p.id === id);
                                        updateItem(index, {
                                            productId: id,
                                            price: prod?.price ?? 0,
                                        });
                                        await fetchStock(id);
                                    }}
                                />

                                <NumberInput
                                    value={item.quantity}
                                    min={1}
                                    max={availableStock}
                                    onChange={val => updateItem(index, { quantity: val })}
                                />

                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-500 text-sm"
                                >
                                    Remove
                                </button>

                                {availableStock !== undefined && (
                                    <p className="text-xs text-gray-500 col-span-full">
                                        Available stock: {availableStock}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <button
                        type="button"
                        onClick={addItem}
                        className="text-purple-600 text-sm"
                    >
                        + Add Item
                    </button>

                    <NumberInput value={amountPaid} min={0} onChange={setAmountPaid} />

                    <div className="flex justify-end gap-3">
                        <a
                            href="/sales/invoices"
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Cancel
                        </a>
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

                    <p><strong>Customer:</strong> {selectedCustomerData?.name ?? "-"}</p>
                    <p><strong>Location:</strong> {locations.find(l => l.id === selectedLocation)?.name ?? "-"}</p>
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
