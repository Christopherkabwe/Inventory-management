import { getProducts } from "@/lib/actions/products";
import AddProductClient from "./AddProductClient";

export const metadata = {
    title: "Add Product",
};

export default async function Page() {
    const products = await getProducts();

    return (
        <div className="bg-gray-100 rounded-xl border hover:shadow-md transition-shadow">
            <AddProductClient products={products} />
        </div>
    );
}
