"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { SupplierCombobox } from "@/components/SingleSelectComboBox/SupplierCombobox";
import { ProductCombobox } from "@/components/SingleSelectComboBox/ProductComboBox";
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";
import { NumberInput } from "@/components/Inputs/NumberInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextInput } from "@/components/Inputs/TextInput";

/* ==============================
   TYPES
============================== */
interface Supplier { id: string; name: string; email?: string; phone?: string; }
interface Product { id: string; name: string; sku: string; price: number; weightValue: number; weightUnit: string; }
interface Location { id: string; name: string; }

interface POItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    uom: string;
    product: Product;
}

/* ==============================
   PAGE
============================== */
export default function CreatePOPage() {
    const router = useRouter();

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    const [selectedSupplier, setSelectedSupplier] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const [items, setItems] = useState<POItem[]>([]);

    const [isCreating, setIsCreating] = useState(false);

    /* ==============================
       LOAD OPTIONS
    ============================== */
    useEffect(() => {
        async function fetchOptions() {
            try {
                const [sRes, pRes, lRes] = await Promise.all([
                    fetch("/api/suppliers").then(r => r.json()),
                    fetch("/api/options/products").then(r => r.json()),
                    fetch("/api/options/locations").then(r => r.json()),
                ]);
                setSuppliers(sRes ?? []);
                setProducts(pRes ?? []);
                setLocations(lRes ?? []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load options");
            }
        }
        fetchOptions();
    }, []);

    /* ==============================
       ITEM HANDLERS
    ============================== */
    const addItem = () => {
        setItems(prev => [
            ...prev,
            { productId: "", quantity: 1, unitPrice: 0, uom: "pcs", product: { id: "", name: "", sku: "", price: 0, weightUnit: "", weightValue: 50 } }
        ]);
    };

    const removeItem = (index: number) => {
        setItems(prev => prev.filter((_, idx) => idx !== index));
    };

    const updateItem = (index: number, patch: Partial<POItem>) => {
        setItems(prev => prev.map((i, idx) => idx === index ? { ...i, ...patch } : i));
    };

    const subtotal = useMemo(() => {
        return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    }, [items]);

    /* ==============================
       VALIDATION
    ============================== */
    const validatePO = () => {
        if (!selectedSupplier || !selectedLocation) {
            toast.error("Supplier and location are required");
            return false;
        }

        if (items.length === 0) {
            toast.error("Add at least one product");
            return false;
        }

        for (const item of items) {
            if (!item.productId) {
                toast.error("Select a product for all items");
                return false;
            }
            if (item.quantity <= 0) {
                toast.error("Quantity must be greater than zero");
                return false;
            }
            if (item.unitPrice < 0) {
                toast.error("Unit price must be >= 0");
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
        if (!validatePO()) return;
        setIsCreating(true);

        try {
            const res = await fetch("/api/purchase-orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    supplierId: selectedSupplier,
                    locationId: selectedLocation,
                    notes,
                    items: items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                        uom: i.uom
                    })),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Failed to create purchase order");

            toast.success("Purchase Order created successfully");
            router.push(`/purchase-orders/${data.id}`);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    /* ==============================
       RENDER
    ============================== */
    return (
        <div className="bg-white p-5 max-w-5xl mx-auto space-y-6 rounded-md">
            <h1 className="text-2xl font-bold text-center">Create Purchase Order</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <SupplierCombobox
                        suppliers={suppliers}
                        value={selectedSupplier}
                        onChange={setSelectedSupplier}
                        label="Select Supplier"
                    />
                    <LocationCombobox
                        locations={locations}
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                        label="Select Location"
                    />
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Notes (Optional)</label>
                        <textarea
                            className="border p-2 rounded h-16"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                {/* PO ITEMS */}
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-end">
                            <ProductCombobox
                                products={products}
                                value={item.productId}
                                onChange={pid => {
                                    const prod = products.find(p => p.id === pid)!;
                                    updateItem(idx, { productId: pid, product: prod, unitPrice: prod.price });
                                }}
                                label="Select Product"
                            />
                            <NumberInput
                                label="Quantity"
                                value={item.quantity}
                                min={1}
                                onChange={val => updateItem(idx, { quantity: val })}
                            />
                            <NumberInput
                                label="Unit Price"
                                value={item.unitPrice}
                                min={0}
                                step={0.01}
                                onChange={val => updateItem(idx, { unitPrice: val })}
                            />
                            <TextInput
                                className="border rounded p-2"
                                value={item.product.weightUnit}
                                onChange={e => updateItem(idx, { uom: item.product.weightUnit })}
                                label="Uom"
                            />
                            <Button type="button" variant="destructive" onClick={() => removeItem(idx)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={addItem}>Add Product</Button>
                </div>

                <div className="border-t pt-4 space-y-1">
                    <p><strong>Subtotal:</strong> K{subtotal.toFixed(2)}</p>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Purchase Order"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
