"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Parser as Json2csvParser } from "json2csv";
import DashboardLayout from "@/components/DashboardLayout";
import Loading from "@/components/Loading";

type Sale = {
    id: string;
    customer: { name: string };
    location: { name: string };
    transporter: {
        name: string;
        vehicleNumber: string | null;
        driverName: string | null;
    } | null;
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
    invoiceNumber: string;
    deliveryNoteNo?: string | null;
};

export default function SalesData({
    sales = [],
    loading = false,
}: {
    sales?: Sale[];
    loading?: boolean;
}) {
    const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState(null);


    useEffect(() => {
        const filtered = sales.filter((s) => {
            const saleTime = new Date(s.saleDate).getTime();
            const matchesSearch =
                s.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
                s.transporter?.name.toLowerCase().includes(search.toLowerCase()) ||
                s.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
                s.deliveryNoteNo?.toLowerCase().includes(search.toLowerCase()) ||
                s.items.some((item) =>
                    item.product.name.toLowerCase().includes(search.toLowerCase())
                ) ||
                s.location?.name.toLowerCase().includes(search.toLowerCase());
            const matchesStartDate = !startDate || saleTime >= new Date(`${startDate}T00:00:00`).getTime();
            const matchesEndDate = !endDate || saleTime <= new Date(`${endDate}T23:59:59`).getTime();
            return matchesSearch && matchesStartDate && matchesEndDate;
        });
        setFilteredSales(filtered);
    }, [search, startDate, endDate, sales]);

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
    };

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
                deliveryNote: s.deliveryNoteNo || "-",
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
                s.deliveryNoteNo || "-",
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
        <div>
            <div>
                <h1 className="text-3xl font-bold">Sales Data</h1>
                <p className="text-gray-500 mt-1 mb-2">
                    A comprehensive overview of sales transactions, including products, customers, and delivery details.
                </p>
            </div>
            {/* Controls */}
            <div className="mb-4 flex flex-wrap items-end gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                {/* Search */}
                <div className="flex flex-col flex-1 min-w-[220px]">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Search
                    </label>
                    <input
                        type="text"
                        placeholder="Customer, product, location, invoice, delivery note or transporter..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-gray-300 outline-none dark:text-black"
                    />
                </div>

                {/* Start Date */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="border px-3 py-2 rounded text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none dark:text-black"
                    />
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="border px-3 py-2 rounded text-sm hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none dark:text-black"
                    />
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={exportCSV}
                        className="px-4 py-2 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition"
                    >
                        Export CSV
                    </button>

                    <button
                        onClick={exportPDF}
                        className="px-4 py-2 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        Export PDF
                    </button>
                </div>
            </div>
            {/* Sales Table */}
            <div className="overflow-auto w-full max-h-[550px] bg-white dark:bg-gray-800">
                <table className="min-w-full bg-white dark:bg-gray-800 border text-xs text-gray-900 dark:text-gray-200 w-full border-collapse whitespace-nowrap">
                    <thead className="sticky p-2 top-0 bg-blue-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
                        {loading ? (
                            <tr>
                                <Loading message="Loading sales" colSpan={18} />
                            </tr>
                        ) : (
                            (() => {
                                let rowNumber = 1; // initialize row counter
                                return filteredSales
                                    .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
                                    .flatMap((s) =>
                                        s.items.map((item) => {
                                            const weightInKg =
                                                item.product.weightUnit.toLowerCase() === "kg"
                                                    ? item.product.weightValue
                                                    : item.product.weightValue / 1000;
                                            const tonnage = (weightInKg * item.quantity) / 1000;

                                            return (
                                                <tr key={`${s.id}-${item.product.name}-${rowNumber}`} className="even:bg-gray-100 dark:even:bg-gray-700">
                                                    <td className="p-2 border text-center">{rowNumber++}</td>
                                                    <td className="p-2 border w-20 max-w-[80px] truncate">{s.id}</td>
                                                    <td className="p-2 border">{s.customer.name}</td>
                                                    <td className="p-2 border">{item.product.name}</td>
                                                    <td className="p-2 border">{item.product.packSize}</td>
                                                    <td className="p-2 border">{`${item.product.weightValue.toFixed(2)} ${item.product.weightUnit}`}</td>
                                                    <td className="p-2 border">{s.location.name}</td>
                                                    <td className="p-2 border">{item.quantity}</td>
                                                    <td className="p-2 border">{item.price.toFixed(2)}</td>
                                                    <td className="p-2 border">{item.total.toFixed(2)}</td>
                                                    <td className="p-2 border">{tonnage.toFixed(2)}</td>
                                                    <td className="p-2 border">{s.isReturn ? "Yes" : "No"}</td>
                                                    <td className="p-2 border">{s.invoiceNumber}</td>
                                                    <td className="p-2 border whitespace-nowrap">{s.deliveryNoteNo ?? "-"}</td>
                                                    <td className="p-2 border">{s.transporter?.name ?? "-"}</td>
                                                    <td className="p-2 border">{s.transporter?.vehicleNumber ?? "-"}</td>
                                                    <td className="p-2 border truncate">{s.transporter?.driverName ?? "-"}</td>
                                                    <td className="p-2 border">{new Date(s.saleDate).toLocaleDateString()}</td>
                                                </tr>
                                            );
                                        })
                                    );
                            })()
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}