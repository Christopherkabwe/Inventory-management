"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location, LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";

interface POItem {
    id: string;
    product: { id: string; name: string; sku: string };
    quantity: number;
    receivedQuantity: number;
}

interface PO {
    id: string;
    poNumber: string;
    status: string;
    supplier: { id: string; name: string };
    items: POItem[];
}

export default function CreateGRNPage() {
    const router = useRouter();

    const [pos, setPOs] = useState<PO[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
    const [selectedPOId, setSelectedPOId] = useState<string | null>(null);
    const [po, setPO] = useState<PO | null>(null);
    const [loading, setLoading] = useState(false);
    const [receivedQuantities, setReceivedQuantities] = useState<Record<string, number>>({});
    const [submitting, setSubmitting] = useState(false);

    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

    // Fetch all POs
    useEffect(() => {
        const fetchPOs = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/purchase-orders");
                if (!res.ok) throw new Error("Failed to fetch POs");
                const data: PO[] = await res.json();
                setPOs(data);
            } catch (err) {
                console.error(err);
                toast.error("Error fetching purchase orders");
            } finally {
                setLoading(false);
            }
        };
        fetchPOs();
    }, []);

    // Fetch locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await fetch("/api/options/locations");
                if (!res.ok) throw new Error("Failed to fetch locations");
                const data: Location[] = await res.json();
                setLocations(data);
            } catch (err) {
                console.error(err);
                toast.error("Error fetching locations");
            }
        };
        fetchLocations();
    }, []);

    // Fetch selected PO details
    useEffect(() => {
        if (!selectedPOId) {
            setPO(null);
            setReceivedQuantities({});
            return;
        }

        const fetchPO = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/purchase-orders/${selectedPOId}`);
                if (!res.ok) throw new Error("Failed to fetch PO details");
                const data: PO = await res.json();
                setPO(data);

                // Initialize received quantities
                const initialQty: Record<string, number> = {};
                data.items.forEach(item => {
                    initialQty[item.id] = 0;
                });
                setReceivedQuantities(initialQty);
            } catch (err) {
                console.error(err);
                toast.error("Error fetching PO details");
            } finally {
                setLoading(false);
            }
        };

        fetchPO();
    }, [selectedPOId]);

    const handleQuantityChange = (poItemId: string, value: number) => {
        if (po) {
            const poItem = po.items.find(item => item.id === poItemId);
            if (poItem) {
                const remaining = poItem.quantity - poItem.receivedQuantity;

                if (value > remaining) {
                    toast.error(`Cannot receive more than ${remaining} for ${poItem.product.name}`);
                    return;
                }
            }
        }
        setReceivedQuantities(prev => ({ ...prev, [poItemId]: value }));
    };

    const handleSubmit = async (status: "DRAFT" | "RECEIVED") => {
        if (!po) return;
        if (!selectedLocation) {
            toast.error("Please select a location");
            return;
        }

        if (status === "RECEIVED") {
            const totalReceived = Object.values(receivedQuantities).reduce((sum, qty) => sum + qty, 0);
            if (totalReceived === 0) {
                toast.error("Please enter at least one received quantity");
                return;
            }

            for (const item of po.items) {
                const received = receivedQuantities[item.id] || 0;
                const remaining = item.quantity - item.receivedQuantity;
                if (received > remaining) {
                    toast.error(`Cannot receive more than ${remaining} for ${item.product.name}`);
                    return;
                }

            }
        }

        setSubmitting(true);
        try {
            const payload = {
                poId: po.id,
                locationId: selectedLocation,
                status,
                items: Object.entries(receivedQuantities)
                    .filter(([_, qty]) => qty > 0)
                    .map(([poItemId, quantityReceived]) => ({ poItemId, quantityReceived })),
            };
            const res = await fetch("/api/grn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to create GRN");
            toast.success(`GRN ${status === "DRAFT" ? "saved as draft" : "created successfully"}`);
            router.push("/purchase-orders/grn");
        } catch (err) {
            console.error(err);
            toast.error("Error creating GRN");
        } finally {
            setSubmitting(false);
        }
    };
    const handleBatchReceive = () => {
        if (!po) return;
        const batchQty = prompt("Enter quantity to receive for all items:");
        if (batchQty === null) return;
        const qty = Number(batchQty);
        if (isNaN(qty) || qty <= 0) {
            toast.error("Invalid quantity");
            return;
        }
        const newReceivedQuantities = { ...receivedQuantities };
        po.items.forEach(item => {
            const remaining = item.quantity - item.receivedQuantity;
            newReceivedQuantities[item.id] = Math.min(qty, remaining);
        });
        setReceivedQuantities(newReceivedQuantities);
    };

    if (loading) return <div className="bg-white p-5 rounded-lg mt-5"><Loading /></div>;

    const suppliers = Array.from(new Set(pos.map(po => po.supplier.name)));
    const filteredPOs = selectedSupplier
        ? pos.filter(
            po =>
                po.supplier.name === selectedSupplier &&
                po.status === "SENT"
        )
        : [];

    return (
        <div className="bg-white p-5 rounded-md space-y-6">
            <h1 className="text-2xl font-bold">Create GRN</h1>

            {/* Supplier & PO selection */}
            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label htmlFor="supplier-select">Select Supplier</Label>
                    <Select
                        value={selectedSupplier ?? ""}
                        onValueChange={value => { setSelectedSupplier(value); setSelectedPOId(null); }}
                        id="supplier-select"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a supplier" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map(supplier => <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {selectedSupplier && (
                    <div className="space-y-2">
                        <Label htmlFor="po-select">Select Purchase Order</Label>
                        <Select
                            value={selectedPOId ?? ""}
                            onValueChange={value => setSelectedPOId(value)}
                            id="po-select"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a PO" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredPOs.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-500">
                                        <p>Selected Supplier has no Outstanding PO</p>
                                        <span>Redirect to existing <a href="/purchase-orders/grn" className="underline text-blue-600">GRN</a> or view <a href="/purchase-orders" className="underline text-blue-600">Purchase Orders</a></span>
                                    </div>
                                ) : (
                                    filteredPOs.map(po => (
                                        <SelectItem key={po.id} value={po.id}>
                                            {po.poNumber}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Location selection */}
            {po && (
                <div className="w-1/2">
                    <LocationCombobox
                        locations={locations}
                        value={selectedLocation ?? ""}
                        onChange={setSelectedLocation}
                        label="Select GRN Location"
                    />
                </div>
            )}

            {/* PO Items */}
            {po && (
                <>
                    <p className="mt-4">Supplier: {po.supplier.name}</p>
                    <table className="w-full text-sm border-collapse mt-2">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">SKU</th>
                                <th className="p-2 text-left">Product</th>
                                <th className="p-2 text-left">Quantity Ordered</th>
                                <th className="p-2 text-left">Already Received</th>
                                <th className="p-2 text-left">Quantity Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {po.items.map(item => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-2">{item.product.sku}</td>
                                    <td className="p-2">{item.product.name}</td>
                                    <td className="p-2">{item.quantity}</td>
                                    <td className="p-2">
                                        <span className="text-gray-500">{item.receivedQuantity}received</span>
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            value={receivedQuantities[item.id]}
                                            onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                                            className="w-20"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <>
                        {/* ... */}
                        <Button onClick={() => handleSubmit("DRAFT")} disabled={submitting} className="bg-gray-500 text-white hover:bg-gray-600 mt-4 mr-2">
                            {submitting ? "Saving..." : "Save as Draft"}
                        </Button>
                        <Button onClick={() => handleSubmit("RECEIVED")} disabled={submitting} className="bg-green-500 text-white hover:bg-green-600 mt-4 mr-2">
                            {submitting ? "Submitting..." : "Receive Items"}
                        </Button>
                        <Button onClick={handleBatchReceive} disabled={submitting} className="bg-blue-500 text-white hover:bg-blue-600 mt-4">
                            Batch Receive
                        </Button>
                    </>
                </>
            )}
        </div>
    );
}
