"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";

type Inventory = {
    id: string;
    quantity: number;
    product: { name: string; sku: string };
    location: { name: string } | null;
};

type ProductList = {
    id: string;
    name: string;
    sku: string;
    price: number;
    createdById: string;
};

type SalesOrder = {
    id: string;
    orderNumber: string;
    customer: { name: string };
    location: { name: string };
};

type Sale = {
    id: string;
    invoiceNumber: string;
    customer: { name: string };
    location: { name: string };
};

type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
};

export default function TestRBAC() {
    const [inventories, setInventories] = useState<Inventory[]>([]);
    const [inventorySingle, setInventorySingle] = useState<Inventory | null>(null);

    const [products, setProducts] = useState<ProductList[]>([]);
    const [productSingle, setProductSingle] = useState<ProductList | null>(null);

    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [salesOrderSingle, setSalesOrderSingle] = useState<SalesOrder | null>(null);

    const [sales, setSales] = useState<Sale[]>([]);
    const [saleSingle, setSaleSingle] = useState<Sale | null>(null);

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerSingle, setCustomerSingle] = useState<Customer | null>(null);

    useEffect(() => {
        async function fetchAll() {
            // INVENTORY
            const invRes = await fetch("/api/rbac/inventory");
            const invData = await invRes.json();
            setInventories(invData);
            if (invData.length) {
                const singleRes = await fetch(`/api/rbac/inventory/${invData[0].id}`);
                setInventorySingle(await singleRes.json());
            }

            // PRODUCTS
            const prodRes = await fetch("/api/rbac/products");
            const prodData = await prodRes.json();
            setProducts(prodData);
            if (prodData.length) {
                const singleProdRes = await fetch(`/api/rbac/products/${prodData[0].id}`);
                setProductSingle(await singleProdRes.json());
            }

            // SALES ORDERS
            const soRes = await fetch("/api/rbac/sales-orders");
            const soData = await soRes.json();
            setSalesOrders(soData);
            if (soData.length) {
                const singleSORes = await fetch(`/api/rbac/sales-orders/${soData[0].id}`);
                setSalesOrderSingle(await singleSORes.json());
            }

            // SALES
            const saleRes = await fetch("/api/rbac/sales");
            const saleData = await saleRes.json();
            setSales(saleData);
            if (saleData.length) {
                const singleSaleRes = await fetch(`/api/rbac/sales/${saleData[0].id}`);
                setSaleSingle(await singleSaleRes.json());
            }

            // CUSTOMERS
            const custRes = await fetch("/api/rbac/customers");
            const custData = await custRes.json();
            setCustomers(custData);

            if (custData.length) {
                try {
                    const singleCustRes = await fetch(`/api/rbac/customers/${custData[0].id}`);
                    if (!singleCustRes.ok) {
                        throw new Error(`Error fetching single customer: ${singleCustRes.status}`);
                    }
                    const singleCustData = await singleCustRes.json();
                    setCustomerSingle(singleCustData);
                } catch (error) {
                    console.error('Error fetching single customer:', error);
                }
            }
        }

        fetchAll();
    }, []);

    { console.log('customerSingle:', customerSingle) }

    return (
        <DashboardLayout>
            <div className="p-4 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Global RBAC Test</h1>

                {/* INVENTORY */}
                <section>
                    <h2 className="font-semibold">Inventories:</h2>
                    <ul>
                        {inventories.slice(0, 10).map((i) => (
                            <li key={i.id}>
                                {i.product.name} ({i.product.sku}) - {i.quantity} | Location: {i.location?.name}
                            </li>
                        ))}
                    </ul>
                    <h3 className="mt-2">Single Inventory:</h3>
                    {inventorySingle && (
                        <p>{inventorySingle.product.name} ({inventorySingle.product.sku}) - {inventorySingle.quantity}</p>
                    )}
                </section>

                {/* PRODUCTS */}
                <section>
                    <h2 className="font-semibold">Products:</h2>
                    {products.length > 0 ? (
                        <ul>
                            {products.slice(0, 10).map((p) => (
                                <li key={p.id}>
                                    {p.name} ({p.sku}) - ${p.price}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No products found.</p>
                    )}

                    <h3 className="mt-2">Single Product:</h3>
                    {productSingle ? (
                        <p>
                            {productSingle.name} ({productSingle.sku}) - ${productSingle.price}
                        </p>
                    ) : (
                        <p>No single product selected.</p>
                    )}
                </section>

                {/* SALES ORDERS */}
                <section>
                    <h2 className="font-semibold">Sales Orders:</h2>
                    {salesOrders.length > 0 ? (
                        <ul>
                            {salesOrders.slice(0, 10).map((so) => (
                                <li key={so.id}>
                                    {so.orderNumber} - {so.customer?.name || 'Unknown Customer'} | Location: {so.location?.name || 'Unknown Location'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No sales orders found.</p>
                    )}

                    <h3 className="mt-2">Single Sales Order:</h3>
                    {salesOrderSingle ? (
                        <p>
                            {salesOrderSingle.orderNumber} - {salesOrderSingle.customer?.name || 'Unknown Customer'}
                        </p>
                    ) : (
                        <p>No single sales order selected.</p>
                    )}
                </section>
                {/* SALES */}
                <section>
                    <h2 className="font-semibold">Sales:</h2>
                    {sales.length > 0 ? (
                        <ul>
                            {sales.slice(0, 10).map((s) => (
                                <li key={s.id}>
                                    {s.invoiceNumber} - {s.customer?.name || 'Unknown Customer'} | Location: {s.location?.name || 'Unknown Location'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No sales found.</p>
                    )}

                    <h3 className="mt-2">Single Sale:</h3>
                    {saleSingle ? (
                        <p>
                            {saleSingle.invoiceNumber} - {saleSingle.customer?.name || 'Unknown Customer'}
                        </p>
                    ) : (
                        <p>No single sale selected.</p>
                    )}
                </section>

                {/* CUSTOMERS */}
                <section>
                    <h2 className="font-semibold">Customers:</h2>
                    {customers.length > 0 ? (
                        <ul>
                            {customers.map((c) => (
                                <li key={c.id}>
                                    {c.name} ({c.email || 'No Email'}) - {c.phone || 'No Phone'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No customers found.</p>
                    )}

                    <h3 className="mt-2">Single Customer:</h3>

                    {customerSingle ? (
                        <p>
                            {customerSingle.name} ({customerSingle.email || 'No Email'})
                        </p>
                    ) : (
                        <p>No single customer selected.</p>
                    )}

                </section>
            </div>
        </DashboardLayout>
    );
}
