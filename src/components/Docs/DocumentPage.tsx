"use client";

import DashboardLayout from "@/components/DashboardLayout";

interface ProductItem {
    name: string;
    sku: string;
    packSize?: number;
    uom?: string;
    quantity: number;
    price: number;
    vat?: number;
    total: number;
    tonnage?: number;
}

interface Customer {
    name: string;
    address?: string;
}

interface Location {
    name: string;
}

interface DocumentData {
    documentType: "Order" | "Quotation" | "Invoice" | "Delivery Note" | "Return" | "Credit Note";
    documentNumber: string;
    date: string;
    customer: Customer;
    location: Location;
    transporter?: string;
    vehicleNumber?: string;
    driverName?: string;
    driverContact?: string;
    items: ProductItem[];
    preparedBy?: string;
    approvedBy?: string;
    collectedBy?: string;
    dispatchedBy?: string;
    totalQuantity?: number;
    totalTonnage?: number;
    totalAmount?: number;
    totalVAT?: number;
}

interface Props {
    data: DocumentData;
}

export default function DocumentPage({ data }: Props) {
    const { documentType, documentNumber, date, customer, location, items } = data;

    const totalQty = items.reduce((s, i) => s + i.quantity, 0);
    const totalTonnage = items.reduce((s, i) => s + (i.tonnage || 0), 0);
    const totalAmount = items.reduce((s, i) => s + i.total, 0);
    const totalVAT = items.reduce((s, i) => s + (i.total - (i.price * i.quantity)), 0);

    return (
        <div>
            <div className="w-full p-6 border border-black bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {/* Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Biz360°</h1>
                        <p>123 Business St., Lusaka, Zambia</p>
                        <p>support@biz360.com | +260 978 370 871</p>
                    </div>
                    <div className="flex justify-center items-center">
                        <h1 className="text-4xl font-bold text-blue-900">{documentType}</h1>
                    </div>
                    <div className="text-right">
                        <p><strong>Number:</strong> {documentNumber}</p>
                        <p><strong>Date:</strong> {date}</p>
                        <p><strong>Location:</strong> {location.name}</p>
                    </div>
                </div>

                {/* Customer / Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
                    <div className="border p-2">
                        <h2 className="font-bold text-center">Customer</h2>
                        <p>{customer.name}</p>
                        <p>{customer.address}</p>
                    </div>
                    <div className="border p-2">
                        <h2 className="font-bold text-center">Transport & Delivery</h2>
                        <p><strong>Transporter:</strong> {data.transporter || "-"}</p>
                        <p><strong>Vehicle No:</strong> {data.vehicleNumber || "-"}</p>
                        <p><strong>Driver:</strong> {data.driverName || "-"}</p>
                        <p><strong>Driver Contact:</strong> {data.driverContact || "-"}</p>
                    </div>
                    <div className="border p-2">
                        <h2 className="font-bold text-center">Prepared / Approved By</h2>
                        <p><strong>Prepared By:</strong> {data.preparedBy || "-"}</p>
                        <p><strong>Approved By:</strong> {data.approvedBy || "-"}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border border-black text-sm">
                        <thead className="bg-blue-200">
                            <tr>
                                <th className="border px-2 py-1">#</th>
                                <th className="border px-2 py-1">Product</th>
                                <th className="border px-2 py-1">SKU</th>
                                <th className="border px-2 py-1">Pack</th>
                                <th className="border px-2 py-1">UoM</th>
                                <th className="border px-2 py-1">Qty</th>
                                <th className="border px-2 py-1">Tonnage</th>
                                <th className="border px-2 py-1">Price</th>
                                <th className="border px-2 py-1">VAT</th>
                                <th className="border px-2 py-1">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="border px-2 py-1 text-center">{idx + 1}</td>
                                    <td className="border px-2 py-1">{item.name}</td>
                                    <td className="border px-2 py-1">{item.sku}</td>
                                    <td className="border px-2 py-1 text-center">{item.packSize || "-"}</td>
                                    <td className="border px-2 py-1 text-center">{item.uom || "-"}</td>
                                    <td className="border px-2 py-1 text-center">{item.quantity}</td>
                                    <td className="border px-2 py-1 text-center">{item.tonnage?.toFixed(2) || "0.00"}</td>
                                    <td className="border px-2 py-1 text-center">{item.price.toFixed(2)}</td>
                                    <td className="border px-2 py-1 text-center">{item.vat || 0}</td>
                                    <td className="border px-2 py-1 text-center">{item.total.toFixed(2)}</td>
                                </tr>
                            ))}

                            {/* Totals Row */}
                            <tr className="bg-blue-200 font-bold">
                                <td colSpan={5} className="border px-2 py-1 text-center">Totals</td>
                                <td className="border px-2 py-1 text-center">{totalQty}</td>
                                <td className="border px-2 py-1 text-center">{totalTonnage.toFixed(2)}</td>
                                <td colSpan={2} className="border px-2 py-1 text-center"></td>
                                <td className="border px-2 py-1 text-center">{totalAmount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Authorisation / Signatures */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="border p-2 text-center">
                        <h3 className="font-bold">Collected / Received By</h3>
                        <p>{data.collectedBy || "-"}</p>
                        <p>Date: ___________</p>
                        <p>Time: ___________</p>
                        <p>Signature: ___________</p>
                    </div>
                    <div className="border p-2 text-center">
                        <h3 className="font-bold">Dispatched By</h3>
                        <p>{data.dispatchedBy || "-"}</p>
                        <p>Date: ___________</p>
                        <p>Time: ___________</p>
                        <p>Signature: ___________</p>
                    </div>
                    <div className="border p-2 text-center">
                        <h3 className="font-bold">Authorised By</h3>
                        <p>{data.approvedBy || "-"}</p>
                        <p>Date: ___________</p>
                        <p>Time: ___________</p>
                        <p>Signature: ___________</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-gray-500 font-semibold">
                    <p>This is a system generated {documentType}. Please verify Products, Quantities, Prices, and Totals.</p>
                    <p>It's a pleasure doing business with you.</p>
                </div>
            </div>
        </div>
    );
}
