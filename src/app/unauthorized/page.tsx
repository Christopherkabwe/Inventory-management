import DashboardLayout from "@/components/DashboardLayout";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();
    return (
        <div className="bg-white p-5 rounded-lg h-50 max-w-[800px] mx-auto">
            <div className="grid grid-cols-1">
                <div className="w-full flex justify-center"><h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1></div>
                <div className="w-full flex justify-center"><p className="text-lg text-gray-700 mb-8">
                    You do not have permission to access this page.
                </p></div>
                <div className="w-full flex justify-center">
                    <button
                        onClick={() => router.push("/")}
                        className="h-9 inline-flex items-center gap-2 rounded-md bg-blue-500 px-5 py-2
                        text-sm font-medium text-white hover:bg-blue-600 cursor-pointer items-center"
                    >
                        <Home size={16} className="items-center" />
                        Go Back Home
                    </button>
                </div>
            </div>
        </div>
    );
}
