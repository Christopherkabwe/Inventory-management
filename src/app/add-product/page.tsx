import Sidebar from "@/components/sidebar";

export default function ProductsPage() {
    return (
        < div className="min-h-screen bg-gray-50" >
            <Sidebar currentPath="/add-product" />
            <main>
                Products Page
            </main>
        </div>
    );
}
