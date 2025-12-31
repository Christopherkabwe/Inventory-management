module.exports = [
"[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StockTransferPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function StockTransferPage() {
    const stackApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const user = stackApp.useUser();
    const userId = user?.id;
    // State for products and locations
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [locations, setLocations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Form state
    const [productId, setProductId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [fromLocationId, setFromLocationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [toLocationId, setToLocationId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // Step 2: Fetch products and locations once we have userId
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!userId) return;
        const fetchData = async ()=>{
            try {
                const [productsRes, locationsRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch(`/api/locations?userId=${userId}`)
                ]);
                const productsData = await productsRes.json();
                const locationsData = await locationsRes.json();
                const productsArray = Array.isArray(productsData) ? productsData : Array.isArray(productsData.products) ? productsData.products : [];
                const locationsArray = Array.isArray(locationsData.locations) ? locationsData.locations : [];
                setProducts(productsArray);
                setLocations(locationsArray);
            } catch (err) {
                console.error(err);
                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error("Failed to load products or locations");
            }
        };
        fetchData();
    }, [
        userId
    ]);
    // Step 3: Handle form submission
    const submitTransfer = async ()=>{
        if (!productId || !fromLocationId || !toLocationId || quantity <= 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error("Fill all fields correctly");
            return;
        }
        if (fromLocationId === toLocationId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error("From and To locations cannot be the same");
            return;
        }
        try {
            const res = await fetch("/api/stock-transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId,
                    fromLocationId,
                    toLocationId,
                    quantity
                })
            });
            const data = await res.json();
            if (!res.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(data.error || "Transfer failed");
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success("Stock transferred successfully");
            setQuantity(0);
            setProductId("");
            setFromLocationId("");
            setToLocationId("");
        } catch (err) {
            console.error(err);
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error("Something went wrong");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "ml-64 p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-xl font-semibold",
                    children: "Stock Transfer"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                    lineNumber: 113,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: "border p-2 w-full",
                    value: productId,
                    onChange: (e)=>setProductId(e.target.value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Select Product"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                            lineNumber: 121,
                            columnNumber: 21
                        }, this),
                        products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: p.id,
                                children: p.name
                            }, p.id, false, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                                lineNumber: 123,
                                columnNumber: 25
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                    lineNumber: 116,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: "border p-2 w-full",
                    value: fromLocationId,
                    onChange: (e)=>setFromLocationId(e.target.value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "From Location"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                            lineNumber: 135,
                            columnNumber: 21
                        }, this),
                        locations.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: l.id,
                                children: l.name
                            }, l.id, false, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                                lineNumber: 137,
                                columnNumber: 25
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                    lineNumber: 130,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: "border p-2 w-full",
                    value: toLocationId,
                    onChange: (e)=>setToLocationId(e.target.value),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "To Location"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                            lineNumber: 149,
                            columnNumber: 21
                        }, this),
                        locations.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: l.id,
                                children: l.name
                            }, l.id, false, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                                lineNumber: 151,
                                columnNumber: 25
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                    lineNumber: 144,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    className: "border p-2 w-full",
                    placeholder: "Quantity",
                    min: 1,
                    value: quantity,
                    onChange: (e)=>setQuantity(Number(e.target.value))
                }, void 0, false, {
                    fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                    lineNumber: 158,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: submitTransfer,
                    className: "bg-black text-white px-4 py-2 rounded w-full",
                    children: "Transfer Stock"
                }, void 0, false, {
                    fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
                    lineNumber: 168,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
            lineNumber: 112,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Inventory/my-app/src/app/inventory/stock-transfer/page.tsx",
        lineNumber: 111,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=Desktop_Inventory_my-app_src_app_inventory_stock-transfer_page_tsx_45ffe03f._.js.map