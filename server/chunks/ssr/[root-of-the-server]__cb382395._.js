module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/Desktop/Inventory/my-app/src/lib/UnitToKg.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unitToKg",
    ()=>unitToKg
]);
const unitToKg = (weight, unit)=>{
    const map = {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.453592,
        oz: 0.0283495,
        ton: 1000
    };
    const u = typeof unit === "string" ? unit.toLowerCase() : "";
    const factor = map[u] ?? 1; // fallback to 1 if unknown
    return weight * factor;
}; // HOW TO USE //
 //import { unitToKg } from "@/lib/unitToKg";
 // Inside your aggregate calculation:
 //map[p.id].tonnage +=
 //    (item.quantity * p.packSize * unitToKg(item.product.weightValue, item.product.weightUnit)) / 1000;
}),
"[project]/Desktop/Inventory/my-app/src/app/test/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SalesSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/jspdf/dist/jspdf.node.min.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$UnitToKg$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/lib/UnitToKg.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function SalesSummary({ inventory, sales = [], title, iconColor }) {
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("quantity");
    const [sortDir, setSortDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("desc");
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedLocation, setSelectedLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [showProducts, setShowProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedProducts, setSelectedProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const productRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    /* ---------------- FILTER OPTIONS ---------------- */ const locations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Array.from(new Set(sales.map((i)=>i.location.name))), [
        sales
    ]);
    console.log(locations);
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Array.from(new Set(sales.map((i)=>i.product.category))), [
        sales
    ]);
    console.log(categories);
    const products = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>Array.from(new Set(sales.map((i)=>i.product.name))), [
        sales
    ]);
    console.log(products);
    // Close product dropdown
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handler = (e)=>{
            if (productRef.current && !productRef.current.contains(e.target)) {
                setShowProducts(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return ()=>document.removeEventListener("mousedown", handler);
    }, []);
    /* ---------------- FILTER INVENTORY ---------------- */ const filteredInventory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return inventory.filter((i)=>{
            if (startDate && i.updatedAt < startDate) return false;
            if (endDate && i.updatedAt > endDate) return false;
            if (selectedLocation !== "all" && i.location.name !== selectedLocation) return false;
            if (selectedCategory !== "all" && (i.product.category ?? "Uncategorized") !== selectedCategory) return false;
            if (selectedProducts.length > 0 && !selectedProducts.includes(i.product.name)) return false;
            return true;
        });
    }, [
        inventory,
        startDate,
        endDate,
        selectedLocation,
        selectedCategory,
        selectedProducts
    ]);
    /* ---------------- SALES MAP ---------------- */ const salesMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = {};
        sales.forEach((s)=>{
            map[s.productId] = (map[s.productId] || 0) + s.quantity;
        });
        return map;
    }, [
        sales
    ]);
    /* ---------------- AGGREGATE ---------------- */ const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const map = {};
        filteredInventory.forEach((item)=>{
            const p = item.product;
            if (!map[p.id]) {
                map[p.id] = {
                    id: p.id,
                    name: p.name,
                    sku: p.sku,
                    packSize: p.packSize,
                    weightValue: p.weightValue,
                    weightUnit: p.weightUnit,
                    quantity: 0,
                    price: p.price,
                    value: 0,
                    tonnage: 0,
                    lowStockAt: item.lowStockAt
                };
            }
            map[p.id].quantity += item.quantity;
            map[p.id].value += item.quantity * p.price;
            map[p.id].tonnage += item.quantity * p.packSize * (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$UnitToKg$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unitToKg"])(item.product.weightValue, item.product.weightUnit) / 1000;
        });
        return Object.values(map);
    }, [
        filteredInventory
    ]);
    /* ---------------- SORT ---------------- */ const sortedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return [
            ...data
        ].sort((a, b)=>{
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            // String sorting
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            // Numeric sorting
            return sortDir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
        });
    }, [
        data,
        sortKey,
        sortDir
    ]);
    const toggleSort = (key)=>{
        if (key === sortKey) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };
    /* ---------------- EXPORT CSV ---------------- */ const exportCSV = ()=>{
        const headers = [
            "Product",
            "Product ID",
            "SKU",
            "Pack Size",
            "Weight Value",
            "Weight Unit",
            "Quantity",
            "Tonnage",
            "Price",
            "Value",
            "Low Stock At",
            "Status"
        ];
        const rows = sortedData.map((p)=>{
            const status = p.quantity === 0 ? "Out of Stock" : p.quantity < p.lowStockAt ? "Low Stock" : "Available";
            return [
                p.name,
                p.id,
                p.sku,
                p.packSize,
                p.weightValue,
                p.weightUnit,
                p.quantity,
                p.tonnage.toFixed(2),
                p.price.toFixed(2),
                p.value.toFixed(2),
                p.lowStockAt,
                status
            ];
        });
        const csv = [
            headers,
            ...rows
        ].map((r)=>r.join(",")).join("\n");
        const blob = new Blob([
            csv
        ], {
            type: "text/csv"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inventory_summary.csv";
        a.click();
        URL.revokeObjectURL(url);
    };
    /* ---------------- EXPORT PDF ---------------- */ const exportPDF = ()=>{
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        const start = startDate ? startDate.toLocaleDateString() : "N/A";
        const end = endDate ? endDate.toLocaleDateString() : "N/A";
        doc.setFontSize(16);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, {
            align: "center"
        });
        doc.setFontSize(10);
        doc.text(`Date Range: ${start} - ${end}`, doc.internal.pageSize.getWidth() / 2, 23, {
            align: "center"
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(doc, {
            startY: 30,
            head: [
                [
                    "#",
                    "Product",
                    "Product ID",
                    "SKU",
                    "Pack Size",
                    "Weight Value",
                    "Weight Unit",
                    "Quantity",
                    "Tonnage",
                    "Price",
                    "Value",
                    "Low Stock At",
                    "Status"
                ]
            ],
            body: sortedData.map((p, i)=>{
                const status = p.quantity === 0 ? "Out of Stock" : p.quantity < p.lowStockAt ? "Low Stock" : "Available";
                return [
                    i + 1,
                    p.name,
                    p.id,
                    p.sku,
                    p.packSize,
                    p.weightValue,
                    p.weightUnit,
                    p.quantity,
                    p.tonnage.toFixed(2),
                    p.price.toFixed(2),
                    p.value.toFixed(2),
                    p.lowStockAt,
                    status
                ];
            }),
            styles: {
                fontSize: 9,
                cellPadding: 4
            },
            headStyles: {
                fillColor: [
                    100,
                    100,
                    100
                ],
                textColor: 255
            },
            alternateRowStyles: {
                fillColor: [
                    245,
                    245,
                    245
                ]
            }
        });
        doc.save("inventory_summary.pdf");
    };
    /* ---------------- RENDER ---------------- */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white p-4 rounded-xl border hover:shadow-md transition-shadow",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-semibold mb-4 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        className: `h-5 w-5 ${iconColor}`
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                        lineNumber: 335,
                        columnNumber: 17
                    }, this),
                    title
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                lineNumber: 334,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap justify-between items-center mb-4 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-8 gap-5 px-2 py-1 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2",
                                children: [
                                    "Select Location:",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedLocation,
                                        onChange: (e)=>setSelectedLocation(e.target.value),
                                        className: "border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 29
                                            }, this),
                                            locations.map((loc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: loc,
                                                    children: loc
                                                }, loc, false, {
                                                    fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                                    lineNumber: 351,
                                                    columnNumber: 33
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                        lineNumber: 344,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                lineNumber: 342,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-center gap-2",
                                children: [
                                    "Select Category:",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedCategory,
                                        onChange: (e)=>setSelectedCategory(e.target.value),
                                        className: "border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: "All"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                                lineNumber: 365,
                                                columnNumber: 29
                                            }, this),
                                            categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: cat,
                                                    children: cat
                                                }, cat, false, {
                                                    fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                                    lineNumber: 367,
                                                    columnNumber: 33
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                        lineNumber: 360,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                lineNumber: 358,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: productRef,
                                className: "relative inline-block whitespace-nowrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mr-2 text-sm",
                                        children: "Select Product:"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                        lineNumber: 374,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowProducts((v)=>!v),
                                        className: "px-3 h-8 border rounded bg-white hover:bg-gray-100 text-sm",
                                        children: selectedProducts.length === 0 ? "All Products" : `${selectedProducts.length} selected`
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                        lineNumber: 376,
                                        columnNumber: 25
                                    }, this),
                                    showProducts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute left-0 mt-2 bg-white border rounded shadow-lg z-50 w-64 max-h-56 overflow-y-auto p-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedProducts([]),
                                                className: "text-xs text-blue-600 hover:underline mb-2 block",
                                                children: "Clear Selection"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                                lineNumber: 388,
                                                columnNumber: 33
                                            }, this),
                                            products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: selectedProducts.includes(p),
                                                            onChange: (e)=>{
                                                                if (e.target.checked) {
                                                                    setSelectedProducts([
                                                                        ...selectedProducts,
                                                                        p
                                                                    ]);
                                                                } else {
                                                                    setSelectedProducts(selectedProducts.filter((x)=>x !== p));
                                                                }
                                                            },
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                                            lineNumber: 400,
                                                            columnNumber: 41
                                                        }, this),
                                                        p
                                                    ]
                                                }, p, true, {
                                                    fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 37
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                        lineNumber: 386,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                lineNumber: 373,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                        lineNumber: 341,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-8 gap-2 px-2 py-1 flex-wrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: exportCSV,
                                className: "text-sm px-2 py-1 rounded border hover:bg-gray-100",
                                children: "Export CSV"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                lineNumber: 423,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: exportPDF,
                                className: "text-sm px-2 py-1 rounded border hover:bg-gray-100",
                                children: "Export PDF"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                                lineNumber: 429,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                        lineNumber: 422,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                lineNumber: 340,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
        lineNumber: 333,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cb382395._.js.map