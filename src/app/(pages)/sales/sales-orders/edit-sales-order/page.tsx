"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Loading from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";
import withRole from "@/components/withRole";

import { ProductCombobox } from "@/components/SingleSelectComboBox/ProductComboBox";
import { NumberInput } from "@/components/Inputs/NumberInput";
import { CustomerCombobox } from "@/components/SingleSelectComboBox/CustomerComboBox";
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";

import { useUser } from "@/app/context/UserContext";

interface Customer { id: string; name: string; }
interface Product { id: string; name: string; price: number; }
interface Location { id: string; name: string; }
interface SalesOrderItem { productId: string; quantity: number; }

const EditSalesOrderPage: React.FC = () => {
    const router = useRouter();
    const { id: orderId } = useParams();
    const user = useUser();

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    const [customerId, setCustomerId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [items, setItems] = useState<SalesOrderItem[]>([]);

    /* ---------------- FETCH OPTIONS + ORDER ---------------- */
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch options
                const [cRes, pRes, lRes, orderRes] = await Promise.all([
                    fetch("/api/customers").then(r => r.json()),
                    fetch("/api/options/products").then(r => r.json()),
                    fetch("/api/locations").then(r => r.json()),
                    fetch(`/api/sales-orders/orders/${orderId}`).then(r => r.json()),
                ]);

                setCustomers(cRes.customers ?? []);
                setProducts(pRes.products ?? pRes ?? []);
                setLocations(lRes.locations ?? []);

                // Populate order data
                const order = orderRes;
                setCustomerId(order.customerId);
                setLocationId(order.locationId);
                setItems(order.items.map((i: any) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                })));

                setLoading(false);
            } catch (err: any) {
                console.error(err);
                toast.error("Failed to load order data");
                setLoading(false);
            }
        }
        fetchData();
    }, [orderId]);

    /* ---------------- FORM ACTIONS ---------------- */
    const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerId || !locationId || items.some(i => !i.productId || i.quantity <= 0)) {
            toast.error("Please fill all required fields and quantities");
            return;
        }

        if (!user?.id) {
            toast.error("User data missing");
            return;
        }

        setIsUpdating(true);

        try {
            const payload = {
                customerId,
                locationId,
                items,
                updatedById: user.id,
            };

            const res = await fetch(`/api/sales-orders/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to update sales order");
                setIsUpdating(false);
                return;
            }

            toast.success("Sales order updated");
            router.push(`/sales/sales-order/${orderId}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="max-h-[350px] rounded-lg border bg-white flex items-center justify-center">
                    <Loading message="Loading order..." />
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="min-h-screen p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
                    <h1 className="text-2xl font-semibold mb-6">Edit Sales Order</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-row gap-5">
                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1">Customer</label>
                                <CustomerCombobox customers={customers} value={customerId} onChange={setCustomerId} />
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <LocationCombobox locations={locations} value={locationId} onChange={setLocationId} />
                            </div>
                        </div>

                        <div>
                            <h2 className="font-semibold mb-2">Order Items</h2>

                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                    <ProductCombobox
                                        products={products}
                                        value={item.productId}
                                        onChange={(productId) =>
                                            setItems(prev => prev.map((it, i) => i === index ? { ...it, productId } : it))
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
                                disabled={isUpdating}
                            >
                                {isUpdating ? "Updating Order..." : "Update Sales Order"}
                            </button>
                        </div>
                    </form>
                </div>
                <Toaster />
            </div>
        </div>
    );
};

export default withRole(EditSalesOrderPage, ["ADMIN"]);
