"use client";

import { unitToKg } from "@/lib/UnitToKg";

export default function InventoryTable({ inventories }) {
    const computedItems = inventories.map((inv) => {
        const quantity = inv.quantity || 0;
        const packSize = inv.product?.packSize || 1;
        const weightValue = inv.product?.weightValue || 0;
        const weightUnit = inv.product?.weightUnit || "kg";
        const price = Number(inv.product?.price) || 0;

        const tonnage = (quantity * packSize * unitToKg(weightValue, weightUnit)) / 1000;
        const value = quantity * price;

        return { ...inv, tonnage, value };
    });

    return (
        <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-200">
                <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Location</th>
                    <th>Quantity</th>
                    <th>Tonnage</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {computedItems.map((inv, idx) => (
                    <tr key={inv.id}>
                        <td>{idx + 1}</td>
                        <td>{inv.product?.name}</td>
                        <td>{inv.product?.sku}</td>
                        <td>{inv.location?.name}</td>
                        <td>{inv.quantity}</td>
                        <td>{inv.tonnage.toFixed(2)}</td>
                        <td>{inv.value.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
