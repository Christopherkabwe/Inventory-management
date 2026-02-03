"use client";

import { useUser } from "@/app/context/UserContext";
import ProductionManagement from "../page";
import ProductionPage from "../page";

/* ================= PAGE ================= */

export default function ProductionManagementPage() {
    const user = useUser();
    if (!user) return;

    /* ================= MAIN LIST / DEFECTS / REPORTS ================= */
    return (
        <div className="">
            <ProductionPage />
        </div>
    );
}
