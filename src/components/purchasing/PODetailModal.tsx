"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";

interface Item {
    id: string;
    quantity: number;
    unitPrice: number;
    product?: {
        name: string;
    };
}

interface PO {
    id: string;
    poNumber: string;
    status: string;
    createdAt: string;

    supplier?: {
        name: string;
    };

    location?: {
        name: string;
    };

    items: Item[];
}

interface Props {
    po?: PO | null;
    open: boolean;
    onClose: () => void;
}

export default function PODetailModal({ po, open, onClose }: Props) {
    if (!po) return null;

    const total = po.items?.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center">
                        <span>Purchase Order: {po.poNumber}</span>
                        <Badge>{po.status}</Badge>
                    </DialogTitle>
                </DialogHeader>

                {/* Supplier Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-semibold">Supplier</p>
                        <p>{po.supplier?.name ?? "N/A"}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Location</p>
                        <p>{po.location?.name ?? "N/A"}</p>
                    </div>

                    <div>
                        <p className="font-semibold">Created</p>
                        <p>
                            {new Date(po.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mt-4">
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Product</th>
                                <th className="p-2 text-right">Qty</th>
                                <th className="p-2 text-right">Unit Price</th>
                                <th className="p-2 text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {po.items?.map(item => {
                                const lineTotal =
                                    item.quantity * item.unitPrice;

                                return (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-2">
                                            {item.product?.name ?? "N/A"}
                                        </td>

                                        <td className="p-2 text-right">
                                            {item.quantity}
                                        </td>

                                        <td className="p-2 text-right">
                                            ${item.unitPrice.toFixed(2)}
                                        </td>

                                        <td className="p-2 text-right">
                                            ${lineTotal.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="mt-4 flex justify-end">
                    <div className="text-right">
                        <p className="text-sm">
                            Items: {po.items?.length}
                        </p>
                        <p className="text-lg font-bold">
                            Total: ${total?.toFixed(2)}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
