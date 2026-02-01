"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/components/Loading";
import withRole from "@/components/withRole";

import { CustomerCombobox } from "@/components/SingleSelectComboBox/CustomerComboBox";
import { ProductCombobox } from "@/components/SingleSelectComboBox/ProductComboBox";
import { NumberInput } from "@/components/Inputs/NumberInput";
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";
import Link from "next/link";
import { TransporterCombobox } from "@/components/SingleSelectComboBox/TransporterComboBox";
import { getBusinessInfo } from "@/lib/businessInfo";

/* ==============================
   TYPES
============================== */
interface Customer { id: string; name: string; email?: string; phone?: string; address?: string; tpinNumber: string; }
interface Product { id: string; name: string; sku: string; price: number; weightValue?: number; weightUnit?: string; }
interface Location { id: string; name: string; }
interface SalesOrderItem { productId: string; quantity: number; quantityInvoiced: number; product: Product; }
interface SalesOrder { id: string; orderNumber: string; customerId: string; locationId: string; items: SalesOrderItem[]; }
interface InvoiceItem { productId: string; quantity: number; price: number; maxQuantity?: number; product: Product; }

const BUSINESS_INFO = {
    name: "Biz360° Business Management",
    address: "Lusaka, Zambia",
    contact: "support@biz360.com | +260 978 370 871"
};

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

    const business = getBusinessInfo();

    const [transporters, setTransporters] = useState<{ id: string; name: string; contact?: string; phone?: string }[]>([]);
    const [selectedTransporter, setSelectedTransporter] = useState<string>("");
    const [transporterDetails, setTransporterDetails] = useState<any>(null);
    const [deliveryNoteNo, setDeliveryNoteNo] = useState<string | null>(null);

    const [loadingStock, setLoadingStock] = useState(false);

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
                            quantity: remaining,
                            maxQuantity: remaining,
                            price: i.product.price,
                        };
                    })
                    .filter(Boolean) as InvoiceItem[];

                setItems(populatedItems);

            } catch (err) {
                console.error(err);
                toast.error("Failed to load sales order");
            } finally {
                setLoading(false);
            }
        }

        fetchSalesOrder();
    }, [salesOrderId]);

    useEffect(() => {
        if (!salesOrderId) return;

        async function fetchPaidAmount() {
            try {
                const res = await fetch(`/api/invoices/invoice-list?salesOrderId=${salesOrderId}`);
                if (!res.ok) throw new Error("Failed to load invoices");

                const invoices: {
                    id: string;
                    invoiceNumber: string;
                    status: string;
                    createdAt: string;
                    totalAmount: number;
                    amountPaid: number;
                    balance: number;
                }[] = await res.json();

                // ✅ Sum money from PAYMENT ALLOCATIONS
                const totalPaid = invoices.reduce((sum, invoice) => sum + (invoice.amountPaid ?? 0), 0);

                setAmountPaid(totalPaid);
            } catch (err) {
                console.error("Failed to fetch paid amount:", err);
                toast.error("Failed to load paid amount");
            }
        }

        fetchPaidAmount();
    }, [salesOrderId]);

    /* ==============================
       FETCH AVAILABLE QUANTITIES WHEN LOCATION OR ITEMS CHANGE
    ============================== */
    useEffect(() => {
        if (!selectedLocation || items.length === 0) return;

        async function fetchQuantities() {
            setLoadingStock(true); // start loading
            try {
                const stockResults = await Promise.all(
                    items.map(async item => {
                        const res = await fetch(
                            `/api/products/${item.productId}/stock?locationId=${selectedLocation}`
                        );
                        if (!res.ok) throw new Error("Stock fetch failed");
                        const qty = await res.json();
                        return { productId: item.productId, quantity: qty };
                    })
                );

                const stockMap: Record<string, number> = {};
                stockResults.forEach(s => (stockMap[s.productId] = s.quantity));
                setAvailableQuantities(stockMap);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch available quantities");
            } finally {
                setLoadingStock(false); // done loading
            }
        }

        fetchQuantities();
    }, [selectedLocation, items.map(i => i.productId).sort().join(",")]);

    useEffect(() => {
        async function fetchTransporters() {
            try {
                const res = await fetch("/api/options/transporters");
                if (!res.ok) throw new Error("Failed to fetch transporters");
                const data = await res.json();
                setTransporters(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load transporters");
            }
        }
        fetchTransporters();
    }, []);

    useEffect(() => {
        if (!selectedTransporter) return;
        const transporter = transporters.find(t => t.id === selectedTransporter) ?? null;
        setTransporterDetails(transporter);
    }, [selectedTransporter, transporters]);

    /* ==============================
       DERIVED VALUES
    ============================== */

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity * i.price, 0),
        [items]
    );

    const balance = subtotal - amountPaid;
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

    const hasInvoiceableItems = useMemo(
        () => items.some(item => item.quantity > 0),
        [items]
    );

    const paymentStatus = useMemo(() => {
        if (amountPaid >= subtotal) return "PAID";
        if (amountPaid > 0) return "PARTIAL";
        return "PENDING";
    }, [amountPaid, subtotal]);

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
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: selectedCustomer,
                    locationId: selectedLocation,
                    salesOrderId: salesOrder?.id,
                    items,
                    transporterId: selectedTransporter || null, // ✅ include transporter
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Failed to create invoice");

            toast.success("Invoice created successfully");

            // ✅ show Delivery Note Number
            setDeliveryNoteNo(data.deliveryNoteNo ?? null);

            // Navigate if you want
            router.push(`/sales/invoices/${data.id}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) return
    <div>
        <Loading message="Loading invoice form..." />
    </div>;

    /* ==============================
       RENDER
    ============================== */
    return (
        <div>
            <div className="min-h-screen p-5 space-y-6">
                {/* FORM */}

                {!hasInvoiceableItems ? (
                    <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-300 p-6 rounded-xl text-center">
                        <h2 className="text-xl font-semibold text-yellow-800">
                            Order Fully Processed
                        </h2>
                        <p className="text-sm text-yellow-700 mt-2">
                            All items in this sales order have already been invoiced.
                            No further invoices can be created.
                        </p>

                        <div className="mt-4 flex justify-center gap-3">
                            <button
                                onClick={() => router.push("/sales/sales-orders")}
                                className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700"
                            >
                                Back to Sales Orders
                            </button>

                            {salesOrder && (
                                <button
                                    onClick={() =>
                                        router.push(`/sales/invoices/invoice-list?salesOrderId=${salesOrder.id}`)
                                    }
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    View Invoices
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-5 rounded-xl shadow space-y-2">
                        <div className="items-center text-center ">
                            <h1 className="text-2xl font-semibold py-1">Create Invoice</h1>
                            <p className="text-sm text-zinc-500">Sales Order No. : {salesOrder?.orderNumber}</p>
                        </div>
                        <div className="flex ml-auto justify-start">
                            {salesOrder && (
                                <button
                                    type="button"
                                    onClick={() => router.push(`/sales/sales-orders/edit-sales-order/${salesOrder.id}`)}
                                    className="px-4 py-2 mb-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 cursor-pointer"
                                >
                                    Edit Sales Order
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                            <LocationCombobox
                                locations={locations}
                                value={selectedLocation}
                                onChange={setSelectedLocation}
                                disabled={!!salesOrderId && isCreating}
                                label="Select Location" />
                            <CustomerCombobox
                                customers={customers}
                                value={selectedCustomer}
                                onChange={setSelectedCustomer}
                                disabled
                                label="Select Customer"
                            />

                            <TransporterCombobox
                                transporters={transporters}            // pass your fetched transporter list
                                value={selectedTransporter}             // current selected transporter
                                onChange={setSelectedTransporter}       // update state on selection
                                label="Select Transporter (Optional)"  // label for the combobox
                                placeholder="-- None --"
                                disabled={!!salesOrderId && isCreating}             // optional placeholder
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
                                    {loadingStock ? (
                                        <span className="text-xs text-gray-500 mt-3 animate-pulse">
                                            Loading stock...
                                        </span>
                                    ) : availableQuantities[item.productId] !== undefined ? (
                                        <span className="text-xs text-gray-500 mt-3">
                                            Available Stock: {availableQuantities[item.productId]}
                                        </span>
                                    ) : null}
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
                        <div className="border-t pt-4 text-left space-y-1">
                            <p><strong>Subtotal:</strong> K{subtotal.toFixed(2)}</p>
                            <p><strong>Paid:</strong> K{amountPaid.toFixed(2)}</p>
                            <p><strong>Balance:</strong> K{balance.toFixed(2)}</p>
                            <p className="font-semibold">Status: {paymentStatus}</p>
                            {amountPaid > 0 && (
                                <p className="text-sm text-green-700">
                                    Customer has existing payments applied to this order.
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <Link href="/sales/sales-orders" className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                Cancel
                            </Link>
                            <button type="submit" disabled={isCreating} className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                                {isCreating ? "Creating..." : "Create Invoice"}
                            </button>

                        </div>
                    </form>
                )}

                {/* PREVIEW */}
                <div className="max-w-4xl mx-auto overflow-x-auto bg-white rounded-xl shadow p-5">
                    <h2 className="text-xl font-semibold mb-4">Invoice Preview</h2>
                    <div className="flex justify-between mb-4">
                        <div>
                            <p className="font-bold">{business.name}</p>
                            <p className="text-sm">TPIN: {business.TPIN}</p>
                            <p className="text-sm">{business.address}</p>
                            <p className="text-sm">{business.email}</p>
                            <p className="text-sm">{business.contact}</p>
                        </div>
                        <div className="text-right">
                            <p><strong>{selectedCustomerData?.name ?? "-"}</strong></p>
                            <p>TPIN : {selectedCustomerData?.tpinNumber ?? ""}</p>
                            <p>{selectedCustomerData?.address ?? ""}</p>
                        </div>
                    </div>
                    {deliveryNoteNo && (
                        <div className="mt-4 p-3 bg-green-100 rounded text-green-800 font-semibold">
                            Delivery Note Number: {deliveryNoteNo}
                            {transporterDetails && (
                                <p>Transporter: {transporterDetails.name} {transporterDetails.phone ?? ""}</p>
                            )}
                        </div>
                    )}
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
        </div>
    );
};

export default withRole(CreateInvoicePage, ["ADMIN"]);