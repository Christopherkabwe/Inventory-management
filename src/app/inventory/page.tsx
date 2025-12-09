import Sidebar from "@/components/sidebar";

export default async function InventoryPage() {
    return (
        < div className="min-h-screen bg-gray-50" >
            <Sidebar currentPath="/inventory" />

        </div>
    );
}
