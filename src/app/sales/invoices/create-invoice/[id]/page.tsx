"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

import DashboardLayout from "@/components/DashboardLayout";
import Loading from "@/components/Loading";
import withRole from "@/components/withRole";

import { CustomerCombobox } from "@/components/SingleSelectComboBox/CustomerComboBox";
import { ProductCombobox } from "@/components/SingleSelectComboBox/ProductComboBox";
import { NumberInput } from "@/components/SingleSelectComboBox/NumberInput";
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";
import Link from "next/link";

/* ==============================
   TYPES
============================== */
interface Customer { id: string; name: string; email?: string; phone?: string; address?: string; tpinNumber: string; }
interface Product { id: string; name: string; sku: string; price: number; weightValue?: number; weightUnit?: string; }
interface Location { id: string; name: string; }
interface SalesOrderItem { productId: string; quantity: number; quantityInvoiced: number; product: Product; }
interface SalesOrder { id: string; orderNumber: string; customerId: string; locationId: string; items: SalesOrderItem[]; }
interface InvoiceItem { productId: string; quantity: number; price: number; maxQuantity?: number; product: Product; }

type PaymentInput = {
    method: string;
    amount: number;
    reference?: string;
};

const PAYMENT_METHODS = [
    "CASH",
    "BANK_TRANSFER",
    "MOBILE_MONEY",
    "CARD",
];
const BUSINESS_INFO = { name: "Biz360° Business Management", address: "Lusaka, Zambia", contact: "support@biz360.com | +260 978 370 871" };

const CreateInvoicePage = () => {
    const router = useRouter();
    const { id: salesOrderId } = useParams();

    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [salesOrder, setSalesOrder] = useState<SalesOrder | null>(null);

    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [amountPaid, setAmountPaid] = useState(0);
    const [availableQuantities, setAvailableQuantities] = useState<Record<string, number>>({});

    const [payments, setPayments] = useState<PaymentInput[]>([
        { method: "CASH", amount: 0 },
    ]);

    /* ==============================
       LOAD FORM OPTIONS
    ============================== */
    useEffect(() => {
        async function fetchOptions() {
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
                toast.error("Failed to load form options");
            }
        }
        fetchOptions();
    }, []);

    /* ==============================
       LOAD SALES ORDER
    ============================== */
    useEffect(() => {
        if (!salesOrderId) {
            setLoading(false);
            return;
        }
        async function fetchSalesOrder() {
            setLoading(true);
            try {
                const res = await fetch(`/api/options/sales-orders/${salesOrderId}`);
                if (!res.ok) throw new Error("Failed to load sales order");
                const order: SalesOrder = await res.json();
                setSalesOrder(order);
                setSelectedCustomer(order.customerId);
                setSelectedLocation(order.locationId);
                const populatedItems: InvoiceItem[] = order.items
                    .map(i => {
                        const remaining = i.quantity - i.quantityInvoiced;
                        if (remaining <= 0) return null;
                        return {
                            productId: i.productId,
                            quantity: i.quantity,
                            maxQuantity: remaining,
                            price: i.product.price,
                        };
                    })
                    .filter(Boolean) as InvoiceItem[];
                setItems(populatedItems);
                console.log(populatedItems)
                /* ============================== FETCH STOCK (FIXED) ============================== */
                if (order.locationId && populatedItems.length > 0) {
                    const stockResults = await Promise.all(
                        populatedItems.map(async item => {
                            const stockRes = await fetch(
                                `/api/products/${item.productId}/stock?locationId=${order.locationId}`
                            );
                            if (!stockRes.ok) throw new Error("Stock fetch failed");
                            const qty = await stockRes.json();
                            return { productId: item.productId, quantity: qty };
                        })
                    );
                    const stockMap: Record<string, number> = {};
                    stockResults.forEach(s => {
                        stockMap[s.productId] = s.quantity;
                    });
                    setAvailableQuantities(stockMap);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load sales order");
            } finally {
                // Removed setLoading(false) from here
            }
        }
        fetchSalesOrder().finally(() => setLoading(false));
    }, [salesOrderId]);

    /* ==============================
       DERIVED VALUES
    ============================== */
    const totalPaid = useMemo(
        () => payments.reduce((a, p) => a + p.amount, 0),
        [payments]
    );
    const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.price, 0), [items]);
    const balance = subtotal - totalPaid;
    const selectedCustomerData = customers.find(c => c.id === selectedCustomer);

    const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
        const item = items[index];
        const maxQuantity = item.maxQuantity ?? 0;
        if (patch.quantity && patch.quantity > maxQuantity) {
            if (!confirm(`Are you sure you want to increase quantity to ${patch.quantity}? This exceeds the remaining order quantity of ${maxQuantity}.`)) {
                return;
            }
        }
        setItems(prev => prev.map((i, idx) => (idx === index ? { ...i, ...patch } : i)));
    };


    /* ==============================
       VALIDATION
    ============================== */
    const validateInvoice = () => {
        if (!selectedCustomer || !selectedLocation || !salesOrder) {
            toast.error("Customer, location, and sales order are required");
            return false;
        }

        for (const item of items) {
            if (item.quantity < 0) {
                toast.error("Quantity must be greater than zero");
                return false;
            }

            // ✅ PREVENT OVER-INVOICING STOCK (ADD HERE)
            const available = availableQuantities[item.productId];
            if (available !== undefined && item.quantity > available) {
                toast.error(
                    `Insufficient stock. Available: ${available}`
                );
                return false;
            }
        }

        if (amountPaid < 0) {
            if (!confirm(`Are you sure the amount paid is K${amountPaid}?`)) {
                return;
            }
            toast.error("Amount paid must be greater than zero");
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
        if (!validateInvoice()) { setIsCreating(false); return; }

        try {
            const res = await fetch("/api/rbac/sales-flow/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: selectedCustomer,
                    locationId: selectedLocation,
                    salesOrderId: salesOrder?.id,
                    items,
                    payments: payments.filter(p => p.amount > 0),
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

    const updatePayment = (index: number, patch: Partial<PaymentInput>) => {
        setPayments(prev =>
            prev.map((p, i) => (i === index ? { ...p, ...patch } : p))
        );
    };

    const addPayment = () => {
        setPayments(prev => [...prev, { method: "CASH", amount: 0 }]);
    };

    const removePayment = (index: number) => {
        setPayments(prev => prev.filter((_, i) => i !== index));
    };


    if (loading) return <DashboardLayout><Loading message="Loading invoice form..." /></DashboardLayout>;

    /* ==============================
       RENDER
    ============================== */
    return (
        <DashboardLayout>
            <div className="min-h-screen p-5 space-y-6">
                {/* FORM */}
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-5 rounded-xl shadow space-y-2">
                    <h1 className="text-2xl font-semibold">Create Invoice</h1>
                    <div className="flex ml-auto justify-end">
                        {salesOrder && (
                            <button
                                type="button"
                                onClick={() => router.push(`/sales/sales-orders/edit-sales-order/${salesOrder.id}`)}
                                className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 cursor-pointer"
                            >
                                Edit Sales Order
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <LocationCombobox
                            locations={locations}
                            value={selectedLocation}
                            onChange={setSelectedLocation}
                            disabled={!!salesOrderId}
                            label="Select Location" />
                        <CustomerCombobox
                            customers={customers}
                            value={selectedCustomer}
                            onChange={setSelectedCustomer}
                            disabled={!!salesOrderId}
                            label="Select Customer"
                        />
                    </div>


                    {items.map((item, idx) => (
                        <div key={idx} className="w-full grid grid-cols-1 xl:grid-cols-4 gap-4 items-center">
                            {/* Product Combobox */}
                            <ProductCombobox
                                products={products}
                                value={item.productId}
                                onChange={() => { }}
                                disabled
                                label="Select Product"
                            />
                            {/* Quantity Input */}
                            <div className="flex justify-center text-center">
                                {availableQuantities[item.productId] !== undefined && (
                                    <span className="text-xs text-gray-500 mt-3">
                                        Available Stock : {availableQuantities[item.productId]}
                                    </span>
                                )}
                            </div>
                            <div className="">
                                <NumberInput
                                    value={item.quantity}
                                    min={0}
                                    max={availableQuantities[item.productId] ?? Infinity}
                                    onChange={val => updateItem(idx, { quantity: val })}
                                    label="Select Quantity"
                                />

                            </div>
                            {/* Price Input */}
                            <div className="grid grid-cols-1">

                                <NumberInput
                                    value={item.price}
                                    min={0}
                                    step={0.01}
                                    onChange={val => updateItem(idx, { price: val })}
                                    label="Enter Price"
                                />
                            </div>
                        </div>
                    ))}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Payments</h3>

                        {payments.map((payment, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-1 xl:grid-cols-4 gap-3 items-end border p-3 rounded-lg"
                            >
                                {/* Payment Method */}
                                <div>
                                    <label className="text-sm font-medium">Method</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={payment.method}
                                        onChange={e =>
                                            updatePayment(idx, { method: e.target.value })
                                        }
                                    >
                                        {PAYMENT_METHODS.map(m => (
                                            <option key={m} value={m}>
                                                {m.replace("_", " ")}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount */}
                                <NumberInput
                                    label="Amount"
                                    min={0}
                                    value={payment.amount}
                                    onChange={val => updatePayment(idx, { amount: val })}
                                />

                                {/* Reference */}
                                <div>
                                    <label className="text-sm font-medium">Reference (optional)</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        value={payment.reference ?? ""}
                                        onChange={e =>
                                            updatePayment(idx, { reference: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() => removePayment(idx)}
                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    disabled={payments.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addPayment}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            + Add Payment Method
                        </button>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Link href="/sales/sales-orders" className="px-6 py-2 bg-red-400 text-white rounded hover:bg-red-500">
                            Cancel
                        </Link>
                        <button type="submit" disabled={isCreating} className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                            {isCreating ? "Creating..." : "Create Invoice"}
                        </button>

                    </div>
                </form>

                {/* PREVIEW */}
                <div className="max-w-4xl mx-auto overflow-x-auto bg-white rounded-xl shadow p-5">
                    <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
                    <div className="flex justify-between mb-4">
                        <div>
                            <p className="font-bold">{BUSINESS_INFO.name}</p>
                            <p className="text-sm">{BUSINESS_INFO.address}</p>
                            <p className="text-sm">{BUSINESS_INFO.contact}</p>
                        </div>
                        <div className="text-right">
                            <p><strong>{selectedCustomerData?.name ?? "-"}</strong></p>
                            <p>TPIN : {selectedCustomerData?.tpinNumber ?? ""}</p>
                            <p>{selectedCustomerData?.address ?? ""}</p>
                        </div>
                    </div>
                    <table className="w-full border text-sm border-black">
                        <thead className="bg-zinc-100 border-b border-black">
                            <tr>
                                <th className="px-4 py-2 border-r border-black text-left">SKU</th>
                                <th className="px-4 py-2 border-r border-black text-left">Product</th>
                                <th className="px-4 py-2 border-r border-black text-center">Weight</th>
                                <th className="px-4 py-2 border-r border-black text-center">Price</th>
                                <th className="px-4 py-2 border-r border-black text-center">Quantity</th>
                                <th className="px-4 py-2 border-r border-black text-center">Tonnage</th>
                                <th className="px-4 py-2 text-center">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => {
                                const product = products.find(p => p.id === item.productId);
                                const price = item.price; // ✅ use price from InvoiceItem
                                const quantity = item.quantity ?? 0;
                                const tonnage = product?.weightValue ? (product.weightValue * quantity) / 1000 : 0;

                                return (
                                    <tr key={i} className="border-b border-black">
                                        <td className="px-2 py-1 border-r border-black text-left">{product?.sku ?? "-"}</td>
                                        <td className="px-2 py-1 border-r border-black">{product?.name ?? "-"}</td>
                                        <td className="p2-4 py-1 border-r border-black text-center">
                                            {(product?.weightValue)?.toFixed(2) ?? "-"} {product?.weightUnit ?? "-"}
                                        </td>
                                        <td className="px-2 py-1 border-r border-black text-center">K{price.toFixed(2)}</td>
                                        <td className="px-2 py-1 border-r border-black text-center">{quantity}</td>
                                        <td className="px-2 py-1 border-r border-black text-center">{tonnage.toFixed(2)} MT</td>
                                        <td className="px-2 py-1 border-r border-black text-center">K{(price * quantity).toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-zinc-100 font-semibold border-t border-black">
                                <td colSpan={4} className="px-4 py-2 text-center border-r border-black">TOTAL</td>
                                <td className="px-4 py-2 text-center border-r border-black">{items.reduce((a, i) => a + i.quantity, 0)}</td>
                                <td className="px-4 py-2 text-center border-r border-black">{items.reduce((acc, i) => {
                                    const product = products.find(p => p.id === i.productId);
                                    return acc + ((product?.weightValue ?? 0) * i.quantity) / 1000;
                                }, 0).toFixed(2)} MT</td>
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
