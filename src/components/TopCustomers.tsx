import { Star } from "lucide-react";
import { Customer } from "./Customer";

interface Props {
    customers: Customer[];
    title: string;
    iconColor: string;
    limit?: number;
}

export default function TopCustomers({ customers, title, iconColor, limit = 5 }: Props) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Calculate total tonnage for each customer in the last 30 days
    const customersWithTonnage = (customers || []).map(customer => {
        const recentSales = customer.sales?.filter(sale => new Date(sale.saleDate) >= thirtyDaysAgo) || [];

        const totalTonnage = recentSales.reduce((sum, sale) => {
            const productWeight = sale.product?.weightValue || 0;
            const packSize = sale.product?.packSize || 1;
            return sum + (productWeight * sale.quantity * packSize) / 1000; // convert to tons
        }, 0);

        const totalSalesValue = recentSales.reduce((sum, sale) => {
            return sum + (sale.totalAmount || sale.salePrice * sale.quantity);
        }, 0);

        return { ...customer, totalTonnage, totalSalesValue, recentSales };
    });

    // Sort by totalTonnage descending
    const sortedCustomers = customersWithTonnage.sort((a, b) => b.totalTonnage - a.totalTonnage);
    const displayedCustomers = sortedCustomers.slice(0, limit);

    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>

            {displayedCustomers.length === 0 ? (
                <p className="text-sm text-gray-500">No customers yet.</p>
            ) : (
                <ul className="space-y-3 text-sm">
                    {displayedCustomers.map((customer, index) => {
                        const totalTonnage = customer.totalTonnage;
                        const totalSalesValue = customer.totalSalesValue;
                        const purchaseCount = customer.recentSales.length;

                        return (
                            <li key={customer.id} className="flex flex-col-2 xl:flex-row justify-between items-start xl:items-center gap-1 xl:gap-0">
                                <span className="truncate font-medium">
                                    {index + 1}. {customer.name}
                                </span>
                                <span className="font-bold text-purple-600">
                                    {purchaseCount} purchases
                                </span>
                                <span className="font-bold text-green-600">
                                    {totalTonnage.toFixed(2)} tons
                                </span>
                                <span className="font-bold text-blue-600">
                                    K{totalSalesValue.toFixed(0)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}

            {customers?.length > limit && (
                <p className="text-sm text-gray-500 mt-2">
                    Showing top {limit} customers. <a href="#" className="text-blue-500">View all</a>
                </p>
            )}
        </div>
    );
}
