"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import MRPDashboardPage from "./dashboard/page";
import MRPAnalyticsPage from "./analytics/page";
import SuppliersPage from "../../suppliers/page";
import Loading from "@/components/Loading";
import PODashboard from "../../purchase-orders/page";

type MRPView = "list" | "analytics" | "dashboard" | "purchaseOrders" | "suppliers";

interface MRPComponent {
    componentId: string;
    componentName: string;
    type: string;
    grossRequired: number;
    onHand: number;
    inTransit: number;
    netRequired: number;
}

interface MRPResult {
    finishedProductId: string;
    finishedProductName: string;
    demandQty: number;
    components: MRPComponent[];
}

export default function MRPPage() {
    const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
    const [locationId, setLocationId] = useState<string>("");
    const [horizon, setHorizon] = useState<number>(14);
    const [data, setData] = useState<MRPResult[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [view, setView] = useState<MRPView>("list");
    const [loading, setLoading] = useState(false);

    async function loadMRP() {
        if (!locationId || loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/mrp?locationId=${locationId}&horizon=${horizon}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            setData(await res.json());
        } catch (error) {
            console.error('Error loading MRP:', error);
            // Optionally, update the UI to show an error message
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMRP();
    }, [locationId, horizon]);

    useEffect(() => {
        fetch("/api/options/locations")
            .then(res => res.json())
            .then(setLocations);
    }, []);

    if (loading) return (
        <Loading
            message="Loading"
            className="items-center"
        />
    )

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-semibold">Material Requirements Planning</h1>
            <div className="bg-white rounded-sm flex gap-5 p-3">
                <button
                    onClick={() => setView("list")}
                    className={view === "list" ? "font-bold underline" : ""}
                >
                    MRP Results
                </button>

                <button
                    onClick={() => setView("analytics")}
                    className={view === "analytics" ? "font-bold underline" : ""}
                >
                    Analytics
                </button>

                <button
                    onClick={() => setView("dashboard")}
                    className={view === "dashboard" ? "font-bold underline" : ""}
                >
                    Dashboard
                </button>

                <button
                    onClick={() => setView("purchaseOrders")}
                    className={view === "purchaseOrders" ? "font-bold underline" : ""}
                >
                    Purchase Orders
                </button>
                <button
                    onClick={() => setView("suppliers")}
                    className={view === "suppliers" ? "font-bold underline" : ""}
                >
                    Suppliers
                </button>
            </div>

            {/* Filters */}
            {view === "list" && (
                <div className="space-y-4">
                    <Card>
                        <CardContent className="flex gap-4 p-4">
                            <Select value={locationId} onValueChange={setLocationId}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>

                                <SelectContent>
                                    {locations?.map(loc => (
                                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={String(horizon)} onValueChange={v => setHorizon(Number(v))}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Horizon" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="7">7 Days</SelectItem>
                                    <SelectItem value="14">14 Days</SelectItem>
                                    <SelectItem value="30">30 Days</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button onClick={loadMRP}>Recalculate</Button>
                        </CardContent>
                    </Card>

                    {/* Demand Summary */}
                    {data.map((fp, idx) => (
                        <Card key={`${fp.finishedProductId}-${idx}`} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer bg-muted"
                                    onClick={() =>
                                        setExpanded(e => ({ ...e, [fp.finishedProductId]: !e[fp.finishedProductId] }))
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        {expanded[fp.finishedProductId] ? <ChevronDown /> : <ChevronRight />}
                                        <span className="font-medium">{fp.finishedProductName}</span>
                                    </div>
                                    <span className="text-sm">Demand: {fp.demandQty}</span>
                                </div>

                                {expanded[fp.finishedProductId] && (
                                    <div className="p-4">
                                        <table className="w-full text-sm border">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="p-2 text-left">Component</th>
                                                    <th className="p-2">Type</th>
                                                    <th className="p-2">Gross</th>
                                                    <th className="p-2">On Hand</th>
                                                    <th className="p-2">In Transit</th>
                                                    <th className="p-2">Net</th>
                                                    <th className="p-2">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fp.components?.map(c => (
                                                    <tr key={`${fp.finishedProductId}-${c.componentId}`} className="border-t">
                                                        <td className="p-2">{c.componentName}</td>
                                                        <td className="p-2 text-center">{c.type}</td>
                                                        <td className="p-2 text-center">{c.grossRequired}</td>
                                                        <td className="p-2 text-center">{c.onHand}</td>
                                                        <td className="p-2 text-center">{c.inTransit}</td>
                                                        <td className="p-2 text-center font-semibold">{c.netRequired}</td>
                                                        <td className="p-2 text-center">
                                                            {c.netRequired === 0 && <span className="text-green-600">OK</span>}
                                                            {c.netRequired > 0 && c.type === "RAW_MATERIAL" && (
                                                                <span className="text-yellow-600">BUY</span>
                                                            )}
                                                            {c.netRequired > 0 && c.type !== "RAW_MATERIAL" && (
                                                                <span className="text-blue-600">PRODUCE</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {view === "dashboard" && (
                <div>
                    <MRPDashboardPage />
                </div>
            )}

            {view === "analytics" && (
                <div>
                    <MRPAnalyticsPage />
                </div>
            )}
            {view === "purchaseOrders" && (
                <div>
                    <PODashboard />
                </div>
            )}

            {view === "suppliers" && (
                <div>
                    <SuppliersPage />
                </div>
            )}

        </div>
    );
}
