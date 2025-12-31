module.exports = [
"[project]/Desktop/Inventory/my-app/src/app/favicon.ico.mjs { IMAGE => \"[project]/Desktop/Inventory/my-app/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/favicon.ico.mjs { IMAGE => \"[project]/Desktop/Inventory/my-app/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/Desktop/Inventory/my-app/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Desktop/Inventory/my-app/src/app/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopCustomers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/lucide-react/dist/esm/icons/star.js [app-rsc] (ecmascript) <export default as Star>");
;
;
function TopCustomers({ customers, title, iconColor, limit = 5 }) {
    const sortedCustomers = customers?.sort((a, b)=>b.sales.length - a.sales.length);
    const displayedCustomers = sortedCustomers?.slice(0, limit);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white p-6 rounded-xl border hover:shadow-md transition-shadow",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-semibold mb-4 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                        className: `h-5 w-5 ${iconColor}`
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                        lineNumber: 18,
                        columnNumber: 17
                    }, this),
                    title
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            displayedCustomers?.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500",
                children: "No customers yet."
            }, void 0, false, {
                fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                lineNumber: 22,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-3 text-sm",
                children: displayedCustomers?.map((customer, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate font-medium",
                                children: [
                                    index + 1,
                                    ". ",
                                    customer.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                                lineNumber: 27,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600",
                                children: customer.email
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                                lineNumber: 30,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-purple-600",
                                children: [
                                    customer.sales.length,
                                    " purchases"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                                lineNumber: 31,
                                columnNumber: 29
                            }, this)
                        ]
                    }, customer.id, true, {
                        fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                        lineNumber: 26,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                lineNumber: 24,
                columnNumber: 17
            }, this),
            customers?.length > limit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500 mt-2",
                children: [
                    "Showing top ",
                    limit,
                    " customers. ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "#",
                        className: "text-blue-500",
                        children: "View all"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                        lineNumber: 40,
                        columnNumber: 52
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
                lineNumber: 39,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/Inventory/my-app/src/components/LeastCustomers.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeastCustomers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$components$2f$TopCustomers$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx [app-rsc] (ecmascript)");
;
;
function LeastCustomers({ customers }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$components$2f$TopCustomers$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        customers: customers,
        title: "Least Active Customers (Last 30 Days)",
        iconColor: "text-red-500"
    }, void 0, false, {
        fileName: "[project]/Desktop/Inventory/my-app/src/components/LeastCustomers.tsx",
        lineNumber: 11,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/Inventory/my-app/src/app/test/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$components$2f$TopCustomers$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/components/TopCustomers.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$components$2f$LeastCustomers$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/components/LeastCustomers.tsx [app-rsc] (ecmascript)");
;
;
;
;
function CustomersPage() {
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch("/api/customers").then((response)=>response.json()).then((data)=>setCustomers(data));
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$components$2f$TopCustomers$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                customers: customers,
                title: "Top Customers",
                iconColor: "text-green-500"
            }, void 0, false, {
                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                lineNumber: 17,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$src$2f$components$2f$LeastCustomers$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                customers: customers,
                title: "Least Active Customers",
                iconColor: "text-red-500"
            }, void 0, false, {
                fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
                lineNumber: 18,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Inventory/my-app/src/app/test/page.tsx",
        lineNumber: 16,
        columnNumber: 9
    }, this);
}
}),
"[project]/Desktop/Inventory/my-app/src/app/test/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/Desktop/Inventory/my-app/src/app/test/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c3c1508._.js.map