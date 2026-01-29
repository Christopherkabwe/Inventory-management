"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import PaymentDistributionPie from "@/components/sales/PaymentDistributionPie";
import MonthlySalesChart from "@/components/sales/MonthlySalesPaymentBarchart";


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SalesOverview() {
    // -----------------------------
    // Data fetching
    // -----------------------------
    const { data: sales, error } = useSWR("/api/invoices", fetcher, { refreshInterval: 2000 });
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [search, setSearch] = useState("");

    // -----------------------------
    // Filtered sales
    // -----------------------------
    const filteredSales = useMemo(() =>
        sales?.filter((s: any) =>
            (filterStatus === "ALL" || s.status === filterStatus) &&
            (s.invoiceNumber.includes(search) || s.customer.name.toLowerCase().includes(search.toLowerCase()))
        ), [sales, filterStatus, search]);

    // -----------------------------
    // Summary totals
    // -----------------------------
    const totalSales = useMemo(() => filteredSales?.reduce((sum, s) => sum + s.total, 0), [filteredSales]);
    const totalPaid = useMemo(() => filteredSales?.reduce((sum, s) => sum + s.paid, 0), [filteredSales]);
    const totalCredit = useMemo(() => filteredSales?.reduce((sum, s) => sum + s.creditNotesTotal, 0), [filteredSales]);
    const totalBalance = useMemo(() => filteredSales?.reduce((sum, s) => sum + s.balance, 0), [filteredSales]);

    // -----------------------------
    // Monthly sales chart
    // -----------------------------
    const monthlyData = useMemo(() => {
        const monthMap: Record<string, { total: number; paid: number; credit: number }> = {};

        filteredSales?.forEach((s: any) => {
            const month = format(new Date(s.saleDate), "yyyy-MM");
            if (!monthMap[month]) monthMap[month] = { total: 0, paid: 0, credit: 0 };
            monthMap[month].total += s.total;
            monthMap[month].paid += s.paid;
            monthMap[month].credit += s.creditNotesTotal;
        });

        // Return chart data object
        return {
            labels: Object.keys(monthMap),
            datasets: [
                { label: "Total", data: Object.values(monthMap).map(m => m.total), backgroundColor: "#3b82f6" },
                { label: "Paid", data: Object.values(monthMap).map(m => m.paid), backgroundColor: "#10b981" },
                { label: "Credit Notes", data: Object.values(monthMap).map(m => m.credit), backgroundColor: "#f59e0b" },
            ],
        };
    }, [filteredSales]);

    if (error) return <div>Error loading sales</div>;
    if (!sales) return <div>Loading...</div>;

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <div>
            <div className="p-4 space-y-6">
                {/* Filters */}
                <div className="flex gap-4">
                    <input
                        className="p-2 border rounded bg-white"
                        placeholder="Search by invoice or customer"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded bg-white"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PARTIALLY_PAID">Partially Paid</option>
                        <option value="PAID">Paid</option>
                    </select>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-white shadow rounded">
                        Total Sales: K{totalSales.toLocaleString("en-ZM", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </div>
                    <div className="p-4 bg-white shadow rounded">Total Paid: K{totalPaid.toLocaleString("en-ZM", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}</div>
                    <div className="p-4 bg-white shadow rounded">Total Credit Notes: K{totalCredit.toLocaleString("en-ZM", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                    </div>
                    <div className="p-4 bg-white shadow rounded">Total Balance: K{totalBalance.toLocaleString("en-ZM", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <MonthlySalesChart data={monthlyData} title="Invoices Monthly Breakdown" />
                    </div>

                    {/* Payment Distribution Pie Chart */}
                    <div className="p-4 bg-white shadow rounded">
                        <h3 className="mb-2 font-bold">Payment Distribution</h3>
                        <PaymentDistributionPie
                            paid={totalPaid}
                            outstanding={totalBalance}
                            creditNotes={totalCredit}
                        />
                    </div>
                </div>

                {/* Sales Table */}
                <table className="w-full table-auto border mt-4">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Invoice #</th>
                            <th className="px-4 py-2 text-left">Customer</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Total</th>
                            <th className="px-4 py-2 text-left">Paid</th>
                            <th className="px-4 py-2 text-left">Credit Notes</th>
                            <th className="px-4 py-2 text-left">Balance</th>
                            <th className="px-4 py-2 text-left">Sale Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.map((s: any) => (
                            <tr key={s.id} className="border-b">
                                <td className="px-4 py-2">{s.invoiceNumber}</td>
                                <td className="px-4 py-2">{s.customer.name}</td>
                                <td className="px-4 py-2">{s.status}</td>
                                <td className="px-4 py-2">{s.total.toFixed(2)}</td>
                                <td className="px-4 py-2">{s.paid.toFixed(2)}</td>
                                <td className="px-4 py-2">{s.creditNotesTotal.toFixed(2)}</td>
                                <td className="px-4 py-2">{s.balance.toFixed(2)}</td>
                                <td className="px-4 py-2">{format(new Date(s.saleDate), "yyyy-MM-dd")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
