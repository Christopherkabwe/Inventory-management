"use client";

export default function StockReportTable({ inventory }) {
    return (
        <div className="mt-4 bg-white border rounded overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-3 border-r">#</th>
                        <th className="py-2 px-3 border-r">Product Name</th>
                        <th className="py-2 px-3 border-r">SKU</th>
                        <th className="py-2 px-3 border-r">Quantity</th>
                        <th className="py-2 px-3 border-r">Location</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-3 py-2 border-r">{idx + 1}</td>
                            <td className="px-3 py-2 border-r">{item.product.name}</td>
                            <td className="px-3 py-2 border-r">{item.product.sku}</td>
                            <td className="px-3 py-2 border-r">{item.quantity}</td>
                            <td className="px-3 py-2 border-r">{item.location.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
