module.exports = [
"[project]/Desktop/Inventory/my-app/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/dotenv/config.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@prisma/adapter-pg/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$generated$2f$prisma$2f$client$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/generated/prisma/client.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaPg"]({
    connectionString
});
const prisma = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$generated$2f$prisma$2f$client$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaClient"]({
    adapter
});
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Desktop/Inventory/my-app/src/app/api/stock-report/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/server.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET(req) {
    try {
        const url = new URL(req.url);
        const startDateParam = url.searchParams.get('startDate'); // e.g., "2025-12-24"
        const endDateParam = url.searchParams.get('endDate'); // e.g., "2025-12-25"
        const startDate = startDateParam ? new Date(startDateParam) : null;
        const endDate = endDateParam ? new Date(endDateParam) : null;
        // 1️⃣ Get all movements, ordered chronologically
        const movements = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].stockMovement.findMany({
            include: {
                inventory: {
                    include: {
                        product: true,
                        location: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        const reportMap = new Map();
        movements.forEach((mv)=>{
            const key = `${mv.inventory.product.name}-${mv.inventory.location.name}`;
            if (!reportMap.has(key)) {
                reportMap.set(key, {
                    productName: mv.inventory.product.name,
                    locationName: mv.inventory.location.name,
                    openingStock: 0,
                    receipts: 0,
                    sales: 0,
                    transfersIn: 0,
                    transfersOut: 0,
                    returns: 0,
                    damaged: 0,
                    expired: 0,
                    rebagGain: 0,
                    rebagLoss: 0,
                    closingStock: mv.openingStock ?? 0
                });
            }
            const item = reportMap.get(key);
            // --- 2️⃣ Calculate opening stock ---
            // Movements before startDate affect opening stock
            if (startDate && mv.createdAt < startDate) {
                switch(mv.type){
                    case 'RECEIPT':
                        item.closingStock += mv.quantity;
                        break;
                    case 'SALE':
                        item.closingStock -= mv.quantity;
                        break;
                    case 'TRANSFER_IN':
                        item.closingStock += mv.quantity;
                        break;
                    case 'TRANSFER_OUT':
                        item.closingStock -= mv.quantity;
                        break;
                    case 'RETURN':
                        item.closingStock += mv.quantity;
                        break;
                    case 'DAMAGED':
                        break; // info only
                    case 'EXPIRED':
                        break;
                    case 'REBAG_GAIN':
                        item.closingStock += mv.quantity;
                        break;
                    case 'REBAG_LOSS':
                        item.closingStock -= mv.quantity;
                        break;
                }
                item.openingStock = item.closingStock;
                return; // skip adding to period totals
            }
            // --- 3️⃣ Aggregate movements within range ---
            if ((!startDate || mv.createdAt >= startDate) && (!endDate || mv.createdAt <= endDate)) {
                switch(mv.type){
                    case 'RECEIPT':
                        item.receipts += mv.quantity;
                        item.closingStock += mv.quantity;
                        break;
                    case 'SALE':
                        item.sales += mv.quantity;
                        item.closingStock -= mv.quantity;
                        break;
                    case 'TRANSFER_IN':
                        item.transfersIn += mv.quantity;
                        item.closingStock += mv.quantity;
                        break;
                    case 'TRANSFER_OUT':
                        item.transfersOut += mv.quantity;
                        item.closingStock -= mv.quantity;
                        break;
                    case 'RETURN':
                        item.returns += mv.quantity;
                        item.closingStock += mv.quantity;
                        break;
                    case 'DAMAGED':
                        item.damaged += mv.quantity;
                        break;
                    case 'EXPIRED':
                        item.expired += mv.quantity;
                        break;
                    case 'REBAG_GAIN':
                        item.rebagGain += mv.quantity;
                        item.closingStock += mv.quantity;
                        break;
                    case 'REBAG_LOSS':
                        item.rebagLoss += mv.quantity;
                        item.closingStock -= mv.quantity;
                        break;
                }
            }
            // --- 4️⃣ Movements after endDate do not affect period totals, but do affect future closing stock ---
            if (endDate && mv.createdAt > endDate) {
                switch(mv.type){
                    case 'RECEIPT':
                        item.closingStock += mv.quantity;
                        break;
                    case 'SALE':
                        item.closingStock -= mv.quantity;
                        break;
                    case 'TRANSFER_IN':
                        item.closingStock += mv.quantity;
                        break;
                    case 'TRANSFER_OUT':
                        item.closingStock -= mv.quantity;
                        break;
                    case 'RETURN':
                        item.closingStock += mv.quantity;
                        break;
                    case 'DAMAGED':
                        break;
                    case 'EXPIRED':
                        break;
                    case 'REBAG_GAIN':
                        item.closingStock += mv.quantity;
                        break;
                    case 'REBAG_LOSS':
                        item.closingStock -= mv.quantity;
                        break;
                }
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(Array.from(reportMap.values()));
    } catch (err) {
        console.error(err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to generate stock report'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=Desktop_Inventory_my-app_src_94e6b5a2._.js.map