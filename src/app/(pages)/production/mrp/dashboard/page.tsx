"use client";

// app/(erp)/mrp/dashboard/page.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Factory, AlertTriangle } from "lucide-react";
import Pagination from "@/components/pagination/pagination";
import Link from "next/link";
import Loading from "@/components/Loading";

interface ProductionRow {
    id: string;
    productionNo: string;
    batchNumber: string;
    productName: string;
    quantity: number;
    sku: string;
    weightUnit: string;
    weightValue: number;
    status: "DRAFT" | "CONFIRMED";
}

interface ShortageRow {
    netShortage: number;
    available: number;
    action: "BUY" | "PRODUCE" | "OK";
    product: {
        id: string;
        sku: string;
        name: string;
        price: number;
        costPerBag: number;
        [key: string]: any; // allow other product props
    };
}


export default function MRPDashboardPage() {
    const [productions, setProductions] = useState<ProductionRow[]>([]);
    const [shortages, setShortages] = useState<ShortageRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch productions
                const productionsResponse = await fetch("/api/mrp/production?status=DRAFT");
                const productionsData = await productionsResponse.json();

                const mappedProductions: ProductionRow[] = productionsData.flatMap((p: any) =>
                    p.items.map((item: any) => ({
                        id: `${p.id}-${item.id}`,
                        productionNo: p.productionNo,
                        batchNumber: p.batchNumber,
                        status: p.status,
                        productName: item.product?.name || "N/A",
                        sku: item.product?.sku,
                        weightUnit: item.product?.weightUnit,
                        weightValue: item.product?.weightValue,
                        quantity: item.quantity,
                    }))
                );
                setProductions(mappedProductions);

                // Fetch shortages
                const shortagesResponse = await fetch("/api/mrp/shortages");
                const shortagesData = await shortagesResponse.json();
                setShortages(shortagesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const ITEMS_PER_PAGE = 15;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(productions.length / ITEMS_PER_PAGE);

    const paginatedProductions = productions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    if (loading)
        return (
            <div className="bg-white rounded-lg">
                <Loading />
            </div>
        );
    return (
        <div className="bg-white space-y-6 p-5 rounded-md">
            <h1 className="text-2xl font-bold">MRP Control Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Factory className="w-5 h-5" />
                            <span className="text-sm">Draft Productions</span>
                        </div>
                        <div className="text-2xl font-bold ml-10">{productions.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            <span className="text-sm">Active Products</span>
                        </div>
                        <div className="text-2xl font-bold ml-10">{shortages.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Production Confirmation Table */}
            <div>
                <Card>
                    <CardContent className="p-5">
                        <h2 className="font-semibold mb-3 text-2xl">Production Confirmation</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th>Production No.</th>
                                    <th>Batch No.</th>
                                    <th>SKU</th>
                                    <th>Product</th>
                                    <th>Weight</th>
                                    <th>Qty</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProductions.map(p => (
                                    <tr key={p.id} className="border-b">
                                        <td>{p.productionNo}</td>
                                        <td>{p.batchNumber}</td>
                                        <td>{p.sku}</td>
                                        <td>{p.productName}</td>
                                        <td>{p.weightValue} {p.weightUnit}</td>
                                        <td>{p.quantity}</td>
                                        <td><Badge>{p.status}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                    <div className="p-2">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </Card>

            </div>
            {/* Shortage Action Table */}
            <Card>
                <CardContent className="p-4">
                    <h2 className="font-semibold mb-5 text-2xl">Material Requirement Planning</h2>
                    <div>
                        <table className="w-full text-sm overflow-auto">
                            <thead>
                                <tr className="border-b text-left">
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Weight</th>
                                    <th>Available</th>
                                    <th>Required</th>
                                    <th>Price (Bag)</th>
                                    <th>Cost (Bag)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shortages?.map((s, i) => (
                                    <tr key={i} className="border-b">
                                        <td>{s.product.name}</td>
                                        <td>{s.product.sku}</td>
                                        <td>{s.product.weightValue} {s.product.weightUnit}</td>
                                        <td>{s.available}</td>
                                        <td>{s.netShortage}</td>
                                        <td>{s.product.price}</td>
                                        <td>{s.product.costPerBag}</td>
                                        <td>
                                            {s.action === "BUY" ? (
                                                <Link href={`/purchase-orders/create-po?productId=${s.product.id}`}>
                                                    <Badge className="bg-red-500 text-white cursor-pointer hover:bg-red-600">
                                                        {s.action}
                                                    </Badge>
                                                </Link>
                                            ) : (
                                                <Badge variant={s.action === "OK" ? "secondary" : "destructive"}>
                                                    {s.action}
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


