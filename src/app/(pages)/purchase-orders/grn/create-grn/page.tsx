"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface POItem {
    id: string;
    product: {
        id: string;
        name: string;
        sku: string;
    };
    quantity: number;
}

interface PO {
    id: string;
    poNumber: string;
    supplier: {
        id: string;
        name: string;
    };
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

    // Fetch selected PO details when PO ID changes
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

                // Initialize received quantities to 0
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
        setReceivedQuantities(prev => ({ ...prev, [poItemId]: value }));
    };

    const handleSubmit = async () => {
        if (!po) return;

        // Validate at least one quantity > 0
        const totalReceived = Object.values(receivedQuantities).reduce((sum, qty) => sum + qty, 0);
        if (totalReceived === 0) {
            toast.error("Please enter at least one received quantity");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                poId: po.id,
                items: Object.entries(receivedQuantities).map(([poItemId, quantityReceived]) => ({
                    poItemId,
                    quantityReceived,
                })),
            };

            const res = await fetch("/api/grn", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create GRN");

            toast.success("GRN created successfully");
            router.push("/purchase-orders/grn");
        } catch (err) {
            console.error(err);
            toast.error("Error creating GRN");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="bg-white p-5 rounded-lg mt-5"><Loading /></div>;

    // Unique suppliers for dropdown
    const suppliers = Array.from(new Set(pos.map(po => po.supplier.name)));

    // Filter POs by selected supplier
    const filteredPOs = selectedSupplier
        ? pos.filter(po => po.supplier.name === selectedSupplier)
        : [];

    return (
        <div className="bg-white p-5 rounded-md space-y-6">
            <h1 className="text-2xl font-bold">Create GRN</h1>

            {/* Select Supplier */}
            <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label htmlFor="supplier-select">Select Supplier</Label>
                    <Select
                        value={selectedSupplier ?? ""}
                        onValueChange={value => {
                            setSelectedSupplier(value);
                            setSelectedPOId(null);
                        }}
                        id="supplier-select"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a supplier" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map(supplier => (
                                <SelectItem key={supplier} value={supplier}>
                                    {supplier}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Select PO */}
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
                                {filteredPOs.map(po => (
                                    <SelectItem key={po.id} value={po.id}>
                                        {po.poNumber}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
            {/* Show PO items */}
            {po && (
                <>
                    <p className="mt-4">Supplier: {po.supplier.name}</p>
                    <table className="w-full text-sm border-collapse mt-2">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">SKU</th>
                                <th className="p-2 text-left">Product</th>
                                <th className="p-2 text-left">Quantity Ordered</th>
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
                                        <Input
                                            type="number"
                                            min={0}
                                            max={item.quantity}
                                            value={receivedQuantities[item.id]}
                                            onChange={e =>
                                                handleQuantityChange(item.id, Number(e.target.value))
                                            }
                                            className="w-20"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-green-500 text-white hover:bg-green-600 mt-4"
                    >
                        {submitting ? "Submitting..." : "Create GRN"}
                    </Button>
                </>
            )}
        </div>
    );
}
