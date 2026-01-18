import DashboardLayout from "@/components/DashboardLayout";
import InventorySummary from "@/components/InventorySummary";
import ManageInventory from "@/components/inventory/ManageInventory";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from 'next/navigation';

export default async function InventoryPageClient() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/sign-in');
    }

    return (
        <DashboardLayout>
            <ManageInventory />
            <InventorySummary
                title="Inventory Summary Report"
                iconColor="blue" />
        </DashboardLayout>
    );
}
