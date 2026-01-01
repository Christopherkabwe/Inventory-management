"use client";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Parser as Json2csvParser } from "json2csv";
import DashboardLayout from "@/components/DashboardLayout";

type Sale = {
    id: string;
    customer: { name: string; };
    location: { name: string; };
    transporter: {
        name: string;
        vehicleNumber: string;
        driverName: string;
    };
    items: {
        product: {
            name: string;
            packSize: string;
            weightUnit: string;
            weightValue: number;
        };
        quantity: number;
        price: number;
        total: number;
    }[];
    saleDate: string;
    isReturn: boolean;
    invoiceNumber: String;
    deliveryNote: string;
};

export default function SalesDataPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSales = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/sales");
            const data = await res.json();
            console.log(data); // Add this to see the data structure
            setSales(data.data || []); // Update this line
            setFilteredSales(data.data || []); // Update this line
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    useEffect(() => {
        const filtered = sales.filter(
            (s) =>
                s.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                s.items.some((item) =>
                    item.product.name.toLowerCase().includes(search.toLowerCase())
                ) ||
                s.location.name.toLowerCase().includes(search.toLowerCase())
        ).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());

        setFilteredSales(filtered);
    }, [search, sales]);

    const exportCSV = () => {
        const parser = new Json2csvParser({
            fields: [
                "customer.name",
                "items.product.name",
                "items.product.packSize",
                "items.product.weightValue",
                "items.product.weightUnit",
                "location.name",
                "items.quantity",
                "items.price",
                "items.total",
                "saleDate",
                "isReturn",
                "invoiceNumber",
                "deliveryNote",
            ],
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
        let y = 30;
        filteredSales.forEach((s, i) => {
            doc.text(
                `${i + 1}. Customer: ${s.customer.name}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Products: ${s.items.map((item) => item.product.name).join(", ")}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Pack Size: ${s.items.map((item) => item.product.packSize).join(", ")}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Weight: ${s.items.map((item) => `${item.product.weightValue.toFixed(2)} ${item.product.weightUnit}`).join(", ")}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Location: ${s.location.name}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Quantity: ${s.items.map((item) => item.quantity).join(", ")}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Price: ${s.items.map((item) => item.price.toFixed(2)).join(", ")}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Total: ${s.items.map((item) => item.total.toFixed(2)).join(", ")}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Tonnage: ${s.items.map((item) => {
                    const weightInKg = item.product.weightUnit === 'kg' ? item.product.weightValue : item.product.weightValue / 1000;
                    const tonnage = (weightInKg * item.quantity) / 1000;
                    return tonnage.toFixed(2);
                }).join(", ")}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Return: ${s.isReturn ? "Yes" : "No"}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Invoice No: ${s.invoiceNumber}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Delivery Note: ${s.deliveryNote}`,
                14,
                y
            );
            y += 10;
            doc.text(
                `Date: ${new Date(s.saleDate).toLocaleDateString()}`,
                14,
                y
            );
            y += 20;
        });
        doc.save("sales.pdf");
    };

    if (loading) return <div>Loading Data...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="">
            <DashboardLayout>
                <h1 className="text-2xl font-semibold mb-4">Sales Data</h1>
                {/* Controls */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search by customer, product, or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 bg-white rounded flex-1 min-w-[200px]"
                    />
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

                </div>
                {/* Sales Table */}
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white border text-xs">
                        <thead className="sticky top-0 bg-blue-300">
                            <tr>
                                <th className="p-2 border">#</th>
                                <th className="p-2 border hidden">Transax Id</th>
                                <th className="p-2 border text-left">Customer Name</th>
                                <th className="p-2 border text-left">Product Name</th>
                                <th className="p-2 border text-left">Pack Size</th>
                                <th className="p-2 border text-left">Weight</th>
                                <th className="p-2 border text-left">Location</th>
                                <th className="p-2 border text-left">Quantity</th>
                                <th className="p-2 border text-left">Sale Price</th>
                                <th className="p-2 border text-left">Total Amount</th>
                                <th className="p-2 border text-left">Tonnage</th>
                                <th className="p-2 border text-left">Return</th>
                                <th className="p-2 border text-left">Invoice No.</th>
                                <th className="p-2 border text-left">Delivery Note</th>
                                <th className="p-2 border text-left">Transporter Name</th>
                                <th className="p-2 border text-left">Vehicle Number</th>
                                <th className="p-2 border text-left">Driver's Name</th>
                                <th className="p-2 border text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((s, index) => (
                                <tr key={s.id}>
                                    <td className="p-2 border text-center">{index + 1}</td>
                                    <td className="p-2 border hidden">{s.id}</td>
                                    <td className="p-2 border">{s.customer.name}</td>
                                    <td className="p-2 border">
                                        {s.items.map((item) => item.product.name).join(", ")}
                                    </td>
                                    <td className="p-2 border">
                                        {s.items.map((item) => item.product.packSize).join(", ")}
                                    </td>
                                    <td className="p-2 border">
                                        {s.items.map((item) => `${item.product.weightValue.toFixed(2)} ${item.product.weightUnit}`).join(", ")}
                                    </td>
                                    <td className="p-2 border">{s.location.name}</td>
                                    <td className="p-2 border">
                                        {s.items.map((item) => item.quantity).join(", ")}
                                    </td>
                                    <td className="p-2 border">
                                        {s.items.map((item) => item.price.toFixed(2)).join(", ")}
                                    </td>
                                    <td className="p-2 border">
                                        {s.items.map((item) => item.total.toFixed(2)).join(", ")}
                                    </td>
                                    <td className="p-2 border">
                                        {s.items.map((item) => {
                                            const weightInKg = item.product.weightUnit === 'kg' ? item.product.weightValue : item.product.weightValue / 1000;
                                            const tonnage = (weightInKg * item.quantity) / 1000;
                                            return tonnage.toFixed(2);
                                        }).join(", ")}
                                    </td>
                                    <td className="p-2 border">{s.isReturn ? "Yes" : "No"}</td>
                                    <td className="p-2 border">{s.invoiceNumber}</td>
                                    <td className="p-2 border">{s.deliveryNote}</td>
                                    <td className="p-2 border">{s.transporter.name}</td>
                                    <td className="p-2 border">{s.transporter.vehicleNumber}</td>
                                    <td className="p-2 border truncate">{s.transporter.driverName}</td>
                                    <td className="p-2 border">
                                        {new Date(s.saleDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DashboardLayout>
        </div>
    );
}