import { AlertTriangle } from "lucide-react";
import TopCustomers from "./TopCustomers";
import { Customer } from "./Customer";

interface Props {
    customers: Customer[];
}

export default function LeastCustomers({ customers }: Props) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const customersWithTonnage = (customers || []).map(customer => {
        const recentSales = customer.sales?.filter(sale => new Date(sale.saleDate) >= thirtyDaysAgo) || [];
        const totalTonnage = recentSales.reduce((sum, sale) => {
            const productWeight = sale.product?.weightValue || 0;
            const packSize = sale.product?.packSize || 1;
            return sum + (productWeight * sale.quantity * packSize) / 1000; // convert to tons
        }, 0);
        return { ...customer, totalTonnage };
    });

    const sortedCustomers = customersWithTonnage.sort((a, b) => a.totalTonnage - b.totalTonnage);

    return (
        <TopCustomers
            customers={sortedCustomers}
            title="Least Active Customers (Last 30 Days)"
            iconColor="text-red-500"
        />
    );
}