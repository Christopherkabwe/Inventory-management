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
"[project]/Desktop/Inventory/my-app/src/app/reports/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getStockReport",
    ()=>getStockReport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function getStockReport() {
    // Fetch all inventories with related product and location
    const inventories = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].inventory.findMany({
        include: {
            product: {
                include: {
                    productions: true,
                    adjustments: true,
                    transfers: true
                }
            },
            location: true
        }
    });
    const report = [];
    for (const inv of inventories){
        const { product, location } = inv;
        // Fetch sales for this product at this location
        const sales = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].sale.findMany({
            where: {
                productId: product.id,
                locationId: location.id
            }
        });
        const salesQty = sales.filter((s)=>!s.isReturn).reduce((acc, s)=>acc + s.quantity, 0);
        const returnsQty = sales.filter((s)=>s.isReturn).reduce((acc, s)=>acc + s.quantity, 0);
        const ibtIssued = product.transfers.filter((t)=>t.fromLocationId === location.id).reduce((acc, t)=>acc + t.quantity, 0);
        const ibtReceived = product.transfers.filter((t)=>t.toLocationId === location.id).reduce((acc, t)=>acc + t.quantity, 0);
        const production = product.productions.reduce((acc, p)=>acc + p.quantity, 0);
        const rebagGain = product.adjustments.filter((a)=>a.locationId === location.id && a.type === "REBAG_GAIN").reduce((acc, a)=>acc + a.quantity, 0);
        const damaged = product.adjustments.filter((a)=>a.locationId === location.id && a.type === "DAMAGED").reduce((acc, a)=>acc + a.quantity, 0);
        const expired = product.adjustments.filter((a)=>a.locationId === location.id && a.type === "EXPIRED").reduce((acc, a)=>acc + a.quantity, 0);
        const openingStock = inv.quantity;
        const closingStock = openingStock + production + ibtReceived + rebagGain + returnsQty - ibtIssued - salesQty - damaged - expired;
        report.push({
            productName: product.name,
            location: location.name,
            openingStock,
            production,
            ibtReceived,
            ibtIssued,
            rebagGain,
            damaged,
            expired,
            returns: returnsQty,
            salesQty,
            closingStock
        });
    }
    return report;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/Inventory/my-app/src/app/reports/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/reports/page.tsx [app-rsc] (ecmascript)"));
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

//# sourceMappingURL=Desktop_Inventory_my-app_src_f3cdc27e._.js.map