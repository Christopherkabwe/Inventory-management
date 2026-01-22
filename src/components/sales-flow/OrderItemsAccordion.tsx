"use client";

import { useState } from "react";

export default function OrderItemsAccordion({ items }: { items: any[] }) {
    const [open, setOpen] = useState(true);

    return (
        <div className="border rounded">
            <button
                className="w-full text-left px-4 py-2 bg-gray-100 font-medium"
                onClick={() => setOpen(!open)}
            >
                {open ? "▼" : "▶"} Items ({items.length})
            </button>

            {open && (
                <table className="min-w-full border-t">
                    <thead className="bg-zinc-100">
                        <tr>
                            <th className="p-2">Product</th>
                            <th className="p-2">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((i) => (
                            <tr key={i.id} className="border-t">
                                <td className="p-2">{i.product.name}</td>
                                <td className="p-2">{i.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
