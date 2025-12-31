// app/reports/page.tsx
import { getStockReport } from "./stockReport";

export default async function StockReportPage() {
    const report = await getStockReport();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Stock Report</h1>
            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead>
                        <tr className="text-center">
                            <th className="border p-2">Product</th>
                            <th className="border p-2">Location</th>
                            <th className="border p-2">Opening Stock</th>
                            <th className="border p-2">Production</th>
                            <th className="border p-2">IBT Rec</th>
                            <th className="border p-2">IBT Issued</th>
                            <th className="border p-2">Rebag Gain</th>
                            <th className="border p-2">Rebag Loss</th>
                            <th className="border p-2">Damaged</th>
                            <th className="border p-2">Expired</th>
                            <th className="border p-2">Returns</th>
                            <th className="border p-2">Sales Qty</th>
                            <th className="border p-2">Closing Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((row, i) => (
                            <tr key={i} className="text-center">
                                <td className="border p-2">{row.productName}</td>
                                <td className="border p-2">{row.location}</td>
                                <td className="border p-2">{row.openingStock}</td>
                                <td className="border p-2">{row.production}</td>
                                <td className="border p-2">{row.ibtReceived}</td>
                                <td className="border p-2">{row.ibtIssued}</td>
                                <td className="border p-2">{row.rebagGain}</td>
                                <td className="border p-2">{row.rebagLoss}</td>
                                <td className="border p-2">{row.damaged}</td>
                                <td className="border p-2">{row.expired}</td>
                                <td className="border p-2">{row.returns}</td>
                                <td className="border p-2">{row.salesQty}</td>
                                <td className="border p-2">{row.closingStock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
