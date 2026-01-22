"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import DocumentPage from "@/components/Docs/DocumentPage";

export default function ViewDocumentPage() {
    const { documentId } = useParams();
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "INVOICE";
    const [document, setDocument] = useState<any>(null);

    useEffect(() => {
        async function fetchDocument() {
            const res = await fetch(`/api/documents/${documentId}?type=${type}`);
            const data = await res.json();
            console.log(data)
            setDocument(data);
        }
        fetchDocument();
    }, [documentId, type]);

    if (!document) return <div className="p-5">Loading...</div>;

    return <DocumentPage data={document} documentType={type} />;
}
