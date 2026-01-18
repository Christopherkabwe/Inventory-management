"use client"

import DashboardLayout from "@/components/DashboardLayout";
import SalesTable from "@/components/sales/SalesTable";

export default function () {

    return (
        <DashboardLayout>
            <div className="space-y-6 p-6">
                <SalesTable />
            </div>
        </DashboardLayout>
    );
}