"use client"

import DashboardLayout from "@/components/DashboardLayout";
import SalesTable from "@/components/sales/SalesTable";

export default function () {

    return (
        <div>
            <div className="space-y-6 p-6">
                <SalesTable />
            </div>
        </div>
    );
}