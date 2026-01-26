import { getAllTransfersRaw } from "@/lib/queries/transfers";
import TransfersTable from "./transfers-table";
import DashboardLayout from "@/components/DashboardLayout";

export default async function TransfersDataPage() {
    const transfers = await getAllTransfersRaw();

    return (
        <div>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Inter Branch Transfer Data</h1>
                    <p className="text-gray-500 mt-1 mb-2">Record of all internal STOCK transfer</p>
                </div>

                <TransfersTable transfers={transfers} />
            </div>
        </div>
    );
}
