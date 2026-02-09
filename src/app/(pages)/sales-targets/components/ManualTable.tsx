"use client";
import { useState, useEffect } from "react";

export default function ManualTable({ batch, refresh }: any) {
    const [lines, setLines] = useState<any[]>([]);

    useEffect(() => {
        if (batch?.lines) setLines(batch.lines);
    }, [batch]);

    const handleChange = (index: number, field: string, value: any) => {
        const updated = [...lines];
        updated[index][field] = value;
        setLines(updated);
    };

    const handleSave = async () => {
        await fetch("/app/sales-targets/api/saveManual", {
            method: "POST",
            body: JSON.stringify({ batchId: batch.id, lines }),
            headers: { "Content-Type": "application/json" }
        });
        await refresh();
    };

    return (
        <div>
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>Salesperson</th>
                        <th>Product</th>
                        <th>Target Amount</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {lines.map((line, i) => (
                        <tr key={line.id}>
                            <td><input value={line.userId || ""} onChange={e => handleChange(i, "userId", e.target.value)} /></td>
                            <td><input value={line.productId || ""} onChange={e => handleChange(i, "productId", e.target.value)} /></td>
                            <td><input type="number" value={line.targetAmount || 0} onChange={e => handleChange(i, "targetAmount", Number(e.target.value))} /></td>
                            <td><input value={line.notes || ""} onChange={e => handleChange(i, "notes", e.target.value)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSave} className="btn btn-primary mt-2">Save</button>
        </div>
    );
}
