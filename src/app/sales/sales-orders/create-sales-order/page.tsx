"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Loading from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";
import withRole from "@/components/withRole";

import { ProductCombobox } from "@/components/SingleSelectComboBox/ProductComboBox";
import { NumberInput } from "@/components/SingleSelectComboBox/NumberInput";
import { CustomerCombobox } from "@/components/SingleSelectComboBox/CustomerComboBox";
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox"; // <-- new

import { useUser } from "@/app/context/UserContext";

interface Customer {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    sku?: string;
    price: number;
}

interface Location {
    id: string;
    name: string;
}

interface SalesOrderItem {
    productId: string;
    quantity: number;
}

const CreateSalesOrderPage: React.FC = () => {
    const router = useRouter();
    const user = useUser();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [customerId, setCustomerId] = useState("");
    const [locationId, setLocationId] = useState(""); // <-- new
    const [items, setItems] = useState<SalesOrderItem[]>([{ productId: "", quantity: 1 }]);

    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    /* ---------------- FETCH DATA ---------------- */
    useEffect(() => {
        async function fetchData() {
            try {
                const [c, p, l] = await Promise.all([
                    fetch("/api/customers").then(r => r.json()),
                    fetch("/api/options/products").then(r => r.json()),
                    fetch("/api/locations").then(r => r.json()), // <-- fetch locations
                ]);

                setCustomers(c.customers ?? []);
                setProducts(Array.isArray(p) ? p : p.products ?? []);
                setLocations(l.locations ?? []); // <-- set locations
                setLoading(false);
            } catch (err: any) {
                toast.error("Failed to load customers, products, or locations");
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    /* ---------------- FORM ACTIONS ---------------- */
    const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerId) {
            toast.error("Please select a customer");
            return;
        }

        if (!locationId) {
            toast.error("Please select a location");
            return;
        }

        if (items.length === 0 || items.some(i => !i.productId)) {
            toast.error("Please add at least one valid product");
            return;
        }

        if (!user?.id) {
            toast.error("User data missing");
            return;
        }

        setIsCreating(true);

        try {
            const payload = {
                customerId,
                locationId, // <-- use selected location
                createdById: user.id,
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
            };

            const res = await fetch("/api/order-flow/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to create sales order");
                setIsCreating(false);
                return;
            }

            toast.success("Sales order created");
            router.push(`/sales/sales-order/${data.id}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    /* ---------------- LOADING STATE ---------------- */
    if (loading) {
        return (
            <DashboardLayout>
                <div className="max-h-[350px] rounded-lg border bg-white flex items-center justify-center">
                    <Loading message="Loading..." />
                </div>
            </DashboardLayout>
        );
    }

    /* ---------------- UI ---------------- */
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
                    <h1 className="text-2xl font-semibold mb-6">Create Sales Order</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer */}
                        <div className="flex flex-row gap-5">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1">Customer</label>
                                <CustomerCombobox
                                    customers={customers}
                                    value={customerId}
                                    onChange={setCustomerId}
                                />
                            </div>

                            {/* Location */}
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <LocationCombobox
                                    locations={locations}
                                    value={locationId}
                                    onChange={setLocationId}
                                />
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                            <h2 className="font-semibold mb-2">Order Items</h2>

                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                    <ProductCombobox
                                        products={products}
                                        value={item.productId}
                                        onChange={(productId) =>
                                            setItems(prev => prev.map((it, i) => (i === index ? { ...it, productId } : it)))
                                        }
                                    />

                                    <NumberInput
                                        value={item.quantity}
                                        min={1}
                                        required
                                        onChange={(value) => {
                                            const copy = [...items];
                                            copy[index].quantity = value;
                                            setItems(copy);
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="text-red-500 hover:underline text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addItem}
                                className="text-purple-600 hover:underline text-sm"
                            >
                                + Add another item
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <a
                                href="/sales/sales-orders"
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Cancel
                            </a>

                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                disabled={isCreating}
                            >
                                {isCreating ? "Creating Order..." : "Create Sales Order"}
                            </button>
                        </div>
                    </form>
                </div>
                <Toaster />
            </div>
        </DashboardLayout>
    );
};

export default withRole(CreateSalesOrderPage, ["ADMIN"]);
