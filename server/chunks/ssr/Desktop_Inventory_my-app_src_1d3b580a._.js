module.exports = [
"[project]/Desktop/Inventory/my-app/src/app/favicon.ico.mjs { IMAGE => \"[project]/Desktop/Inventory/my-app/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/favicon.ico.mjs { IMAGE => \"[project]/Desktop/Inventory/my-app/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/Desktop/Inventory/my-app/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Desktop/Inventory/my-app/src/app/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Desktop/Inventory/my-app/src/app/reports/stockReport.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "generateStockReport",
    ()=>generateStockReport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function generateStockReport() {
    const inventories = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].inventory.findMany({
        include: {
            product: {
                include: {
                    productions: true,
                    adjustments: true,
                    transfersFrom: true,
                    transfersTo: true
                }
            },
            location: true,
            sales: true
        }
    });
    const report = inventories.map((inv)=>{
        const product = inv.product;
        const location = inv.location;
        const salesQty = inv.sales.filter((s)=>!s.isReturn).reduce((acc, s)=>acc + s.quantity, 0);
        const returnsQty = inv.sales.filter((s)=>s.isReturn).reduce((acc, s)=>acc + s.quantity, 0);
        const ibtIssued = product.transfersFrom.filter((t)=>t.fromLocationId === location.id).reduce((acc, t)=>acc + t.quantity, 0);
        const ibtReceived = product.transfersTo.filter((t)=>t.toLocationId === location.id).reduce((acc, t)=>acc + t.quantity, 0);
        const stockRecdFromProduction = product.productions.reduce((acc, p)=>acc + p.quantity, 0);
        const rebaggingGain = product.adjustments.filter((adj)=>adj.locationId === location.id && adj.type === "REBAG_GAIN").reduce((acc, adj)=>acc + adj.quantity, 0);
        const openingStock = inv.quantity;
        const closingStock = openingStock + stockRecdFromProduction + returnsQty + ibtReceived + rebaggingGain - salesQty - ibtIssued;
        return {
            productName: product.name,
            location: location.name,
            stockOpening: openingStock,
            stockRecdDepots: stockRecdFromProduction,
            returns: returnsQty,
            stockRecdFromProdn: stockRecdFromProduction,
            ibtRec: ibtReceived,
            ibtIssued: ibtIssued,
            rebaggingGain: rebaggingGain,
            salesQty: salesQty,
            closingStock: closingStock,
            physicalStock: null,
            difference: null
        };
    });
    return report;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/Inventory/my-app/src/app/reports/page.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$app$2f$reports$2f$stockReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/reports/stockReport.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$app$2f$reports$2f$stockReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$app$2f$reports$2f$stockReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function main() {
    const report = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$app$2f$reports$2f$stockReport$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateStockReport"])();
    console.log("Stock Report:");
    console.table(report); // easy view in console
}
main().catch((e)=>console.error(e)).finally(()=>process.exit());
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/Inventory/my-app/src/app/reports/page.ts [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/reports/page.ts [app-rsc] (ecmascript)"));
}),
"[project]/Desktop/Inventory/my-app/src/lib/prisma.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/dotenv/config.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@prisma/adapter-pg/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$generated$2f$prisma$2f$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/generated/prisma/client.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PrismaPg"]({
    connectionString
});
const prisma = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$generated$2f$prisma$2f$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PrismaClient"]({
    adapter
});
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=Desktop_Inventory_my-app_src_1d3b580a._.js.map