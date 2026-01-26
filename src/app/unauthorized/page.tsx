import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                <p className="text-lg text-gray-700 mb-8">
                    You do not have permission to access this page.
                </p>
                <Link
                    href="/"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Go back to home
                </Link>
            </div>
        </div>
    );
}
