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
import { NumberInput } from "@/components/Inputs/NumberInput";

interface POItem {
    id: string;
    product: { id: string; name: string; sku: string };
    quantity: number;
    receivedQuantity: number;
    returnedQuantity: number;
    pending: number;
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

                // Filter items to only those with remaining quantity > 0
                const filteredItems = data.items.filter(
                    item => (item.quantity - item.receivedQuantity + item.returnedQuantity) > 0
                );

                setPO({ ...data, items: filteredItems });

                // Initialize received quantities only for items with remaining
                const initialQty: Record<string, number> = {};
                filteredItems.forEach(item => {
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

    const handleQuantityChange = (poItemId: string, value: number | string) => {
        if (po) {
            const poItem = po.items.find(item => item.id === poItemId);
            if (poItem) {
                const remaining = poItem.quantity - poItem.receivedQuantity;
                if (value === '') {
                    setReceivedQuantities(prev => ({ ...prev, [poItemId]: 0 }));
                    return;
                }
                const numValue = Number(value);
                if (numValue > remaining) {
                    toast.error(`Cannot receive more than ${remaining} for ${poItem.product.name}`);
                    return;
                }
                setReceivedQuantities(prev => ({ ...prev, [poItemId]: numValue }));
            }
        }
    };

    const receiveAll = () => {
        if (!po) return;
        const updated: Record<string, number> = {};
        po.items.forEach(item => {
            updated[item.id] = item.quantity - item.receivedQuantity + item.returnedQuantity;
        });
        setReceivedQuantities(updated);
    };


    const handleSubmit = async (status: "DRAFT" | "RECEIVED") => {
        if (!po) return;
        if (!selectedLocation) {
            toast.error("Please select a location");
            return;
        }

        // Only validate when finalizing RECEIVED
        if (status === "RECEIVED") {
            const totalReceived = Object.values(receivedQuantities)
                .reduce((sum, qty) => sum + qty, 0);

            if (totalReceived === 0) {
                toast.error("Please enter at least one received quantity");
                return;
            }

            for (const item of po.items) {
                const received = receivedQuantities[item.id] || 0;
                const remaining = item.quantity - item.receivedQuantity + item.returnedQuantity;

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
                    // Allow zero quantities for drafts
                    .filter(([_, qty]) => status === "RECEIVED" ? qty > 0 : true)
                    .map(([poItemId, quantityReceived]) => ({
                        poItemId,
                        quantityReceived
                    })),
            };

            const res = await fetch("/api/grn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create GRN");

            toast.success(
                status === "DRAFT"
                    ? "GRN saved as draft"
                    : "GRN created successfully"
            );

            router.push("/grn");

        } catch (err) {
            console.error(err);
            toast.error("Error creating GRN");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="bg-white p-5 rounded-lg mt-5"><Loading /></div>;


    const suppliers = Array.from(new Set(pos.map(po => po.supplier.name)));
    const filteredPOs = selectedSupplier
        ? pos.filter(
            po =>
                po.supplier.name === selectedSupplier &&
                ["SENT", "PARTIALLY_RECEIVED"].includes(po.status)
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
                                        <span>Redirect to existing <a href="/grn" className="underline text-blue-600">GRN</a> or view <a href="/purchase-orders" className="underline text-blue-600">Purchase Orders</a></span>
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
                    <div className="flex justify-end mb-2 px-5">
                        <Button onClick={receiveAll} className="bg-blue-500 text-white hover:bg-blue-600">
                            Receive All
                        </Button>
                    </div>
                    <table className="w-full text-sm border-collapse mt-2">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">SKU</th>
                                <th className="p-2 text-left">Product</th>
                                <th className="p-2 text-center">Ordered</th>
                                <th className="p-2 text-center">Already Received</th>
                                <th className="p-2 text-center">Returned</th>
                                <th className="p-2 text-center">Pending</th>
                                <th className="p-2 text-left">Received Now</th>
                            </tr>
                        </thead>
                        <tbody>
                            {po.items.map(item => {
                                const pending =
                                    item.quantity -
                                    item.receivedQuantity -
                                    (receivedQuantities[item.id] ?? 0) + item.returnedQuantity;

                                return (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-2">{item.product.sku}</td>
                                        <td className="p-2">{item.product.name}</td>
                                        <td className="p-2 text-center">{item.quantity}</td>
                                        <td className="p-2 text-center">{item.receivedQuantity}</td>
                                        <td className="p-2 text-center">{item.returnedQuantity}</td>
                                        <td className="p-2 text-center">{pending}</td>
                                        <td className="p-2">
                                            <NumberInput
                                                min={0}
                                                value={receivedQuantities[item.id] ?? 0}
                                                onChange={value => handleQuantityChange(item.id, value)}
                                                className="w-50"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="flex ml-10 gap-5">
                        {/* ... */}
                        <Button
                            onClick={router.back}
                            disabled={submitting}
                            className="bg-red-500 text-white hover:bg-red-600">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleSubmit("RECEIVED")}
                            disabled={submitting}
                            className="bg-green-500 text-white hover:bg-green-600">
                            {submitting ? "Submitting..." : "Receive Items"}
                        </Button>

                    </div>
                </>
            )
            }
        </div >
    );
}
