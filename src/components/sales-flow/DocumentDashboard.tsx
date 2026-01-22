"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DocumentType = "ORDER" | "PROFORMA" | "INVOICE" | "DELIVERYNOTE" | "RETURN" | "CREDITNOTE";

type DashboardItem = {
    id: string;
    documentType: DocumentType;
    documentNumber: string;
    customerName: string;
    status: string;
    createdAt: string;
};

export default function DocumentsDashboard() {
    const [documents, setDocuments] = useState<DashboardItem[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/dashboard/documents"); // aggregate API for all docs
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (err) {
            console.error(err);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const viewDocument = (id: string, type: DocumentType) => {
        router.push(`/documents/${id}?type=${type}`);
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Documents Dashboard</h1>

            {loading ? (
                <p>Loading documents...</p>
            ) : documents.length === 0 ? (
                <p>No documents found.</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">#</th>
                            <th className="p-2 border">Document Type</th>
                            <th className="p-2 border">Number</th>
                            <th className="p-2 border">Customer</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((d, idx) => (
                            <tr key={d.id} className="border-t">
                                <td className="px-2 py-1">{idx + 1}</td>
                                <td className="px-2 py-1">{d.documentType}</td>
                                <td className="px-2 py-1">{d.documentNumber}</td>
                                <td className="px-2 py-1">{d.customerName}</td>
                                <td className="px-2 py-1">{d.status}</td>
                                <td className="px-2 py-1">{new Date(d.createdAt).toLocaleDateString()}</td>
                                <td className="px-2 py-1">
                                    <button
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => viewDocument(d.id, d.documentType)}
                                    >
                                        View Document
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
