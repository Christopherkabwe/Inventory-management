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
"[project]/Desktop/Inventory/my-app/src/app/inventory/receipt/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/inventory/receipt/page.tsx (Server Component)
__turbopack_context__.s([
    "default",
    ()=>ReceiveStock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$stockMovement$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/lib/stockMovement.ts [app-rsc] (ecmascript)");
;
;
async function ReceiveStock() {
    const movement = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$lib$2f$stockMovement$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logStockMovement"])({
        inventoryId: 'inv123',
        type: 'RECEIPT',
        quantity: 50,
        createdBy: 'user123',
        reason: 'New shipment'
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            "Received ",
            movement.quantity,
            " items."
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/receipt/page.tsx",
        lineNumber: 13,
        columnNumber: 12
    }, this);
}
}),
"[project]/Desktop/Inventory/my-app/src/app/inventory/receipt/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/inventory/receipt/page.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Desktop/Inventory/my-app/src/lib/stockMovement.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logStockMovement",
    ()=>logStockMovement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$generated$2f$prisma$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/generated/prisma/index.js [app-rsc] (ecmascript)");
;
const prisma = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$generated$2f$prisma$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PrismaClient"]();
async function logStockMovement(input) {
    const inventory = await prisma.inventory.findUnique({
        where: {
            id: input.inventoryId
        }
    });
    if (!inventory) throw new Error('Inventory not found');
    let newQuantity = inventory.quantity;
    // Adjust quantity based on movement type
    switch(input.type){
        case 'RECEIPT':
        case 'TRANSFER_IN':
        case 'RETURN':
        case 'REBAG_GAIN':
            newQuantity += input.quantity;
            break;
        case 'SALE':
        case 'TRANSFER_OUT':
        case 'DAMAGED':
        case 'REBAG_LOSS':
        case 'EXPIRED':
        case 'ADJUSTMENT':
            newQuantity -= input.quantity;
            break;
        default:
            throw new Error('Invalid movement type');
    }
    // Create StockMovement record
    const movement = await prisma.stockMovement.create({
        data: {
            inventoryId: input.inventoryId,
            type: input.type,
            quantity: input.quantity,
            openingStock: inventory.quantity,
            closingStock: newQuantity,
            physicalStock: input.physicalStock ?? null,
            createdBy: input.createdBy,
            saleId: input.saleId,
            customerId: input.customerId,
            fromLocationId: input.fromLocationId,
            toLocationId: input.toLocationId,
            reason: input.reason
        }
    });
    // Update Inventory quantity
    await prisma.inventory.update({
        where: {
            id: inventory.id
        },
        data: {
            quantity: newQuantity
        }
    });
    return movement;
}
}),
];

//# sourceMappingURL=Desktop_Inventory_my-app_src_1c0046d1._.js.map