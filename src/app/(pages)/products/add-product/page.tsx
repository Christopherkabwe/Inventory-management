import { getProducts } from "@/lib/actions/products";
import AddProductClient from "./AddProductClient";
import { checkAdminRoleAction } from "@/lib/actions/auth/CheckAdminRole";
import { getCategories, getLocations, getUsers } from "@/lib/actions/dataFetchers";

export const metadata = {
    title: "Add Product",
};

export default async function AddProductsPage() {
    const products = await getProducts();
    const result = await checkAdminRoleAction();
    const isAdmin = !result.error;
    const error = result.error;

    const users = await getUsers();
    const locations = await getLocations();
    const categories = await getCategories();
    return (
        <div className="w-full">
            <AddProductClient
                products={products}
                error={error}
                isAdmin={isAdmin}
                users={users}
                locations={locations}
                categories={categories}
            />
        </div>
    );
}
