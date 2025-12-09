import Sidebar from "@/components/sidebar";

export default function SettingsPage() {
    return (
        < div className="min-h-screen bg-gray-50" >
            <Sidebar currentPath="/settings" />
        </div>
    );
}
