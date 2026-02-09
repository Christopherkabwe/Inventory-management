"use client";
import { useState, useEffect } from "react";
import ManualTable from "./components/ManualTable";
import ExcelImport from "./components/ExcelImport";

export default function SalesTargetsPage() {
    const [batch, setBatch] = useState<any>(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState<number | null>(null);
    const [locationId, setLocationId] = useState<string>("");

    async function fetchBatch() {
        if (!year || !locationId) return;
        const res = await fetch(`/app/sales-targets/api/getBatch?year=${year}&month=${month ?? ""}&locationId=${locationId}`);
        const data = await res.json();
        setBatch(data);
    }

    useEffect(() => {
        fetchBatch();
    }, [year, month, locationId]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Set Sales Targets</h1>

            <div className="mb-4 flex gap-4">
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} placeholder="Year" />
                <input type="number" value={month ?? ""} onChange={e => setMonth(Number(e.target.value))} placeholder="Month (optional)" />
                <input type="text" value={locationId} onChange={e => setLocationId(e.target.value)} placeholder="Location ID" />
                <button onClick={fetchBatch} className="btn btn-primary">Load Batch</button>
            </div>

            <div className="tabs mb-4">
                <button className="tab tab-active">Manual Entry</button>
                <button className="tab">Excel Import</button>
            </div>

            <ManualTable batch={batch} refresh={fetchBatch} />
            <ExcelImport batch={batch} refresh={fetchBatch} />
        </div>
    );
}
