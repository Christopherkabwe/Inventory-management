import AddProductClient from "./AddProductClient";
import { checkAdminRoleAction } from "@/lib/actions/auth/CheckAdminRole";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "Add Product",
};
export default async function AddProductsPage() {
    const products = await prisma.productList.findMany();

    const result = await checkAdminRoleAction();
    const isAdmin = !result.error;
    const error = result.error;

    return (
        <div className="w-full">
            <AddProductClient
                products={products}
                error={error}
                isAdmin={isAdmin}
            />
        </div>
    );
}
