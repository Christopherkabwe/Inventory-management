"use client";
import { useState } from "react";

export default function ExcelImport({ batch, refresh }: any) {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async () => {
        if (!file || !batch) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("batchId", batch.id);

        await fetch("/app/sales-targets/api/importExcel", { method: "POST", body: formData });
        await refresh();
    };

    return (
        <div>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload} className="btn btn-primary mt-2">Import Excel</button>
        </div>
    );
}
