"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
        // Flatten sales
        const rows = filteredSales.flatMap((s) =>
            s.items.map((item) => ({
                transactionId: s.id,
                customer: s.customer.name,
                product: item.product.name,
                packSize: item.product.packSize,
                weightValue: item.product.weightValue,
                weightUnit: item.product.weightUnit,
                location: s.location.name,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
                tonnage:
                    ((item.product.weightUnit === "kg"
                        ? item.product.weightValue
                        : item.product.weightValue / 1000) *
                        item.quantity) /
                    1000,
                isReturn: s.isReturn ? "Yes" : "No",
                invoiceNumber: s.invoiceNumber,
                deliveryNote: s.deliveryNote,
                transporterName: s.transporter?.name || "-",
                vehicleNumber: s.transporter?.vehicleNumber || "-",
                driverName: s.transporter?.driverName || "-",
                saleDate: new Date(s.saleDate).toLocaleDateString(),
            }))
        );

        const parser = new Json2csvParser({ fields: Object.keys(rows[0]) });
        const csv = parser.parse(rows);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sales.csv";
        a.click();
    };

    const exportPDF = () => {
        // Landscape orientation, A4 size
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        // Flatten sales data for table
        const rows = filteredSales.flatMap((s) =>
            s.items.map((item) => [
                s.customer.name,
                item.product.name,
                item.product.packSize,
                `${item.product.weightValue} ${item.product.weightUnit}`,
                s.location.name,
                item.quantity,
                item.price.toFixed(2),
                item.total.toFixed(2),
                (
                    ((item.product.weightUnit === "kg"
                        ? item.product.weightValue
                        : item.product.weightValue / 1000) *
                        item.quantity) /
                    1000
                ).toFixed(2),
                s.isReturn ? "Yes" : "No",
                s.invoiceNumber,
                s.deliveryNote,
                s.transporter?.name || "-",
                s.transporter?.vehicleNumber || "-",
                s.transporter?.driverName || "-",
                new Date(s.saleDate).toLocaleDateString(),
            ])
        );

        const headers = [
            "Customer",
            "Product",
            "Pack Size",
            "Weight",
            "Location",
            "Quantity",
            "Price",
            "Total",
            "Tonnage",
            "Return",
            "Invoice No.",
            "Delivery Note",
            "Transporter",
            "Vehicle No.",
            "Driver",
            "Date",
        ];

        doc.text("Sales Data", 14, 15);

        autoTable(doc, {
            startY: 20,
            head: [headers],
            body: rows,
            styles: { fontSize: 8 },      // slightly larger since landscape has more space
            headStyles: { fillColor: [30, 64, 175] },
            theme: "grid",
            margin: { left: 10, right: 10 },
            pageBreak: "auto",
        });

        doc.save("sales.pdf");
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
            <DashboardLayout>
                <h1 className="text-3xl font-semibold mb-4 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    Sales Data
                </h1>
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
                <div className="overflow-auto w-full max-h-[550px] bg-white dark:bg-gray-800">
                    <table className="min-w-full bg-white dark:bg-gray-800 border text-xs text-gray-900 dark:text-gray-200">
                        <thead className="sticky top-0 bg-blue-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                            <tr>
                                <th className="p-2 border border-gray-300 dark:border-gray-600">#</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600">Transaction Id</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Customer Name</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Product Name</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Pack Size</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Weight</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Location</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Quantity</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Sale Price</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Total Amount</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Tonnage</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Return</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Invoice No.</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Delivery Note</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Transporter Name</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Vehicle Number</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Driver's Name</th>
                                <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((s, index) => (
                                <tr key={s.id} className="even:bg-gray-100 dark:even:bg-gray-700">
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 text-center">{index + 1}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 w-20 max-w-[80px] truncate">{s.id}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">{s.customer.name}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">
                                        {s.items.map((item) => item.product.name).join(", ")}
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">
                                        {s.items.map((item) => item.product.packSize).join(", ")}
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">
                                        {s.items.map((item) => `${item.product.weightValue.toFixed(2)} ${item.product.weightUnit}`).join(", ")}
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">{s.location.name}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">
                                        {s.items.map((item) => item.quantity).join(", ")}
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">
                                        {s.items.map((item) => item.price.toFixed(2)).join(", ")}
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">
                                        {s.items.map((item) => item.total.toFixed(2)).join(", ")}
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">
                                        {s.items.map((item) => {
                                            const weightInKg = item.product.weightUnit === 'kg' ? item.product.weightValue : item.product.weightValue / 1000;
                                            const tonnage = (weightInKg * item.quantity) / 1000;
                                            return tonnage.toFixed(2);
                                        }).join(", ")}
                                    </td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">{s.isReturn ? "Yes" : "No"}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">{s.invoiceNumber}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">{s.deliveryNote}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">{s.transporter.name}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">{s.transporter.vehicleNumber}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 truncate">{s.transporter.driverName}</td>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600">
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