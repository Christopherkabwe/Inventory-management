"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Parser as Json2csvParser } from "json2csv";

type Sale = {
    id: string;
    customerName: string;
    productName: string;
    locationName: string;
    quantity: number;
    salePrice: number;
    totalAmount: number;
    saleDate: string;
    isReturn: boolean;
};

export default function SalesDataPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
    const [search, setSearch] = useState("");

    // Fetch sales from API
    const fetchSales = async () => {
        try {
            const res = await fetch("/api/sales"); // Make sure you have this API
            const data = await res.json();
            setSales(data.sales || []);
            setFilteredSales(data.sales || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // Filter/search sales
    useEffect(() => {
        const filtered = sales.filter(
            s =>
                s.customerName.toLowerCase().includes(search.toLowerCase()) ||
                s.productName.toLowerCase().includes(search.toLowerCase()) ||
                s.locationName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredSales(filtered);
    }, [search, sales]);

    const exportCSV = () => {
        const parser = new Json2csvParser({
            fields: ["customerName", "productName", "locationName", "quantity", "salePrice", "totalAmount", "saleDate", "isReturn"],
        });
        const csv = parser.parse(filteredSales);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sales.csv";
        a.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Sales Data", 14, 20);
        filteredSales.forEach((s, i) => {
            doc.text(
                `${i + 1}. ${s.customerName} | ${s.productName} | ${s.locationName} | Qty: ${s.quantity} | Price: ${s.salePrice} | Total: ${s.totalAmount} | Return: ${s.isReturn ? "Yes" : "No"} | Date: ${new Date(s.saleDate).toLocaleDateString()}`,
                14,
                30 + i * 10
            );
        });
        doc.save("sales.pdf");
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Sales Data</h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={exportCSV}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Export CSV
                </button>
                <button
                    onClick={exportPDF}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Export PDF
                </button>
                <input
                    type="text"
                    placeholder="Search by customer, product, or location..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border p-2 rounded flex-1 min-w-[200px]"
                />
            </div>

            {/* Sales Table */}
            <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Customer</th>
                        <th className="p-2 border">Product</th>
                        <th className="p-2 border">Location</th>
                        <th className="p-2 border">Quantity</th>
                        <th className="p-2 border">Sale Price</th>
                        <th className="p-2 border">Total Amount</th>
                        <th className="p-2 border">Return</th>
                        <th className="p-2 border">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSales.map(s => (
                        <tr key={s.id}>
                            <td className="p-2 border">{s.customerName}</td>
                            <td className="p-2 border">{s.productName}</td>
                            <td className="p-2 border">{s.locationName}</td>
                            <td className="p-2 border">{s.quantity}</td>
                            <td className="p-2 border">{s.salePrice}</td>
                            <td className="p-2 border">{s.totalAmount}</td>
                            <td className="p-2 border">{s.isReturn ? "Yes" : "No"}</td>
                            <td className="p-2 border">{new Date(s.saleDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
