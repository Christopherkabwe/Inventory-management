module.exports = [
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/translations.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/translations.tsx
__turbopack_context__.s([
    "useTranslation",
    ()=>useTranslation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$translation$2d$provider$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/translation-provider-client.js [app-ssr] (ecmascript)");
;
;
function useTranslation() {
    const translationContext = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useContext(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$translation$2d$provider$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TranslationContext"]);
    if (!translationContext) {
        throw new Error("Translation context not found; did you forget to wrap your app in a <StackProvider />?");
    }
    return {
        t: (str, templateVars)=>{
            const { quetzalKeys, quetzalLocale } = translationContext;
            let translation = quetzalLocale.get(quetzalKeys.get(str) ?? void 0) ?? str;
            for (const [key, value] of Object.entries(templateVars || {})){
                translation = translation.replace(`{${key}}`, value);
            }
            return translation;
        }
    };
}
;
 //# sourceMappingURL=translations.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/form-warning.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormWarningText",
    ()=>FormWarningText
]);
// src/components/elements/form-warning.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
function FormWarningText({ text }) {
    if (!text) {
        return null;
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: "text-red-500 text-sm mt-1",
        children: text
    });
}
;
 //# sourceMappingURL=form-warning.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/link.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link,
    "StyledLink",
    ()=>StyledLink
]);
// src/components/link.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
function Link(props) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: props.href,
        target: props.target,
        className: props.className,
        prefetch: props.prefetch,
        onClick: props.onClick,
        children: props.children
    });
}
function StyledLink(props) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Link, {
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("underline font-medium", props.className),
        children: props.children
    });
}
;
 //# sourceMappingURL=link.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/credential-sign-in.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CredentialSignIn",
    ()=>CredentialSignIn
]);
// src/components/credential-sign-in.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$yup$2f$dist$2f$yup$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@hookform/resolvers/yup/dist/yup.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/schema-fields.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/utils/promises.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/input.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/label.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$password$2d$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/password-input.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-hook-form/dist/index.esm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/translations.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/form-warning.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
;
;
;
;
;
;
function CredentialSignIn() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yupObject"])({
        email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strictEmailSchema"])(t("Please enter a valid email")).defined().nonEmpty(t("Please enter your email")),
        password: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["passwordSchema"].defined().nonEmpty(t("Please enter your password"))
    });
    const { register, handleSubmit, setError, formState: { errors } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$yup$2f$dist$2f$yup$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yupResolver"])(schema)
    });
    const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const onSubmit = async (data)=>{
        setLoading(true);
        try {
            const { email, password } = data;
            const result = await app.signInWithCredential({
                email,
                password
            });
            if (result.status === "error") {
                setError("email", {
                    type: "manual",
                    message: result.error.message
                });
            }
        } finally{
            setLoading(false);
        }
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("form", {
        className: "flex flex-col items-stretch stack-scope",
        onSubmit: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronouslyWithAlert"])(handleSubmit(onSubmit)(e)),
        noValidate: true,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                htmlFor: "email",
                className: "mb-1",
                children: t("Email")
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                id: "email",
                type: "email",
                autoComplete: "email",
                ...register("email")
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormWarningText"], {
                text: errors.email?.message?.toString()
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                htmlFor: "password",
                className: "mt-4 mb-1",
                children: t("Password")
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$password$2d$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordInput"], {
                id: "password",
                autoComplete: "current-password",
                ...register("password")
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormWarningText"], {
                text: errors.password?.message?.toString()
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StyledLink"], {
                href: app.urls.forgotPassword,
                className: "mt-1 text-sm",
                children: t("Forgot password?")
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                type: "submit",
                className: "mt-6",
                loading,
                children: t("Sign In")
            })
        ]
    });
}
;
 //# sourceMappingURL=credential-sign-in.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/credential-sign-up.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CredentialSignUp",
    ()=>CredentialSignUp
]);
// src/components/credential-sign-up.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$yup$2f$dist$2f$yup$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@hookform/resolvers/yup/dist/yup.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$helpers$2f$password$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/helpers/password.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/schema-fields.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/utils/promises.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/input.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/label.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$password$2d$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/password-input.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-hook-form/dist/index.esm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$yup$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/yup/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/translations.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/form-warning.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
function CredentialSignUp(props) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yupObject"])({
        email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strictEmailSchema"])(t("Please enter a valid email")).defined().nonEmpty(t("Please enter your email")),
        password: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["passwordSchema"].defined().nonEmpty(t("Please enter your password")).test({
            name: "is-valid-password",
            test: (value, ctx)=>{
                const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$helpers$2f$password$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPasswordError"])(value);
                if (error) {
                    return ctx.createError({
                        message: error.message
                    });
                } else {
                    return true;
                }
            }
        }),
        ...!props.noPasswordRepeat && {
            passwordRepeat: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["passwordSchema"].nullable().oneOf([
                __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$yup$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ref"]("password"),
                "",
                null
            ], t("Passwords do not match")).nonEmpty(t("Please repeat your password"))
        }
    });
    const { register, handleSubmit, setError, formState: { errors }, clearErrors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$yup$2f$dist$2f$yup$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yupResolver"])(schema)
    });
    const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const onSubmit = async (data)=>{
        setLoading(true);
        try {
            const { email, password } = data;
            const result = await app.signUpWithCredential({
                email,
                password
            });
            if (result.status === "error") {
                setError("email", {
                    type: "manual",
                    message: result.error.message
                });
            }
        } finally{
            setLoading(false);
        }
    };
    const registerPassword = register("password");
    const registerPasswordRepeat = register("passwordRepeat");
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("form", {
        className: "flex flex-col items-stretch stack-scope",
        onSubmit: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronouslyWithAlert"])(handleSubmit(onSubmit)(e)),
        noValidate: true,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                htmlFor: "email",
                className: "mb-1",
                children: t("Email")
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                id: "email",
                type: "email",
                autoComplete: "email",
                ...register("email")
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormWarningText"], {
                text: errors.email?.message?.toString()
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                htmlFor: "password",
                className: "mt-4 mb-1",
                children: t("Password")
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$password$2d$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordInput"], {
                id: "password",
                autoComplete: "new-password",
                ...registerPassword,
                onChange: (e)=>{
                    clearErrors("password");
                    clearErrors("passwordRepeat");
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronously"])(registerPassword.onChange(e));
                }
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormWarningText"], {
                text: errors.password?.message?.toString()
            }),
            !props.noPasswordRepeat && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                        htmlFor: "repeat-password",
                        className: "mt-4 mb-1",
                        children: t("Repeat Password")
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$password$2d$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasswordInput"], {
                        id: "repeat-password",
                        ...registerPasswordRepeat,
                        onChange: (e)=>{
                            clearErrors("password");
                            clearErrors("passwordRepeat");
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronously"])(registerPasswordRepeat.onChange(e));
                        }
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormWarningText"], {
                        text: errors.passwordRepeat?.message?.toString()
                    })
                ]
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                type: "submit",
                className: "mt-6",
                loading,
                children: t("Sign Up")
            })
        ]
    });
}
;
 //# sourceMappingURL=credential-sign-up.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/maybe-full-page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MaybeFullPage",
    ()=>MaybeFullPage
]);
// src/components/elements/maybe-full-page.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$ssr$2d$layout$2d$effect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/ssr-layout-effect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
function MaybeFullPage({ children, fullPage }) {
    const uniqueId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const id = `stack-full-page-container-${uniqueId}`;
    const scriptString = `(([id]) => {
    const el = document.getElementById(id);
    if (!el) {
      // component is not full page
      return;
    }
    const offset = el.getBoundingClientRect().top + document.documentElement.scrollTop;
    el.style.minHeight = \`calc(100vh - \${offset}px)\`;
  })(${JSON.stringify([
        id
    ])})`;
    if (fullPage) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    suppressHydrationWarning: true,
                    id,
                    style: {
                        minHeight: "100vh",
                        alignSelf: "stretch",
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    },
                    className: "stack-scope",
                    children
                }),
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$ssr$2d$layout$2d$effect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SsrScript"], {
                    script: scriptString
                })
            ]
        });
    } else {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children
        });
    }
}
;
 //# sourceMappingURL=maybe-full-page.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/separator-with-text.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SeparatorWithText",
    ()=>SeparatorWithText
]);
// src/components/elements/separator-with-text.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$separator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/separator.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
function SeparatorWithText({ text }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        className: "flex items-center justify-center my-6 stack-scope",
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: "flex-1",
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$separator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {})
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: "mx-2 text-sm text-zinc-500",
                children: text
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: "flex-1",
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$separator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {})
            })
        ]
    });
}
;
 //# sourceMappingURL=separator-with-text.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/magic-link-sign-in.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MagicLinkSignIn",
    ()=>MagicLinkSignIn
]);
// src/components/magic-link-sign-in.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$yup$2f$dist$2f$yup$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@hookform/resolvers/yup/dist/yup.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/known-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/schema-fields.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/utils/promises.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/input.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2d$otp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/input-otp.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/label.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/typography.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-hook-form/dist/index.esm.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/translations.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/form-warning.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
;
;
;
;
;
;
function OTP(props) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const stackApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (otp.length === 6 && !submitting) {
            setSubmitting(true);
            stackApp.signInWithMagicLink(otp + props.nonce).then((result)=>{
                if (result.status === "error") {
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].VerificationCodeError.isInstance(result.error)) {
                        setError(t("Invalid code"));
                    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].InvalidTotpCode.isInstance(result.error)) {
                        setError(t("Invalid TOTP code"));
                    } else {
                        throw result.error;
                    }
                }
            }).catch((e)=>console.error(e)).finally(()=>{
                setSubmitting(false);
                setOtp("");
            });
        }
        if (otp.length !== 0 && otp.length !== 6) {
            setError(null);
        }
    }, [
        otp,
        submitting
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        className: "flex flex-col items-stretch stack-scope",
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("form", {
                className: "w-full flex flex-col items-center mb-2",
                children: [
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Typography"], {
                        className: "mb-2",
                        children: t("Enter the code from your email")
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2d$otp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InputOTP"], {
                        maxLength: 6,
                        type: "text",
                        inputMode: "text",
                        pattern: "^[a-zA-Z0-9]+$",
                        value: otp,
                        onChange: (value)=>setOtp(value.toUpperCase()),
                        disabled: submitting,
                        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2d$otp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InputOTPGroup"], {
                            children: [
                                0,
                                1,
                                2,
                                3,
                                4,
                                5
                            ].map((index)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2d$otp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InputOTPSlot"], {
                                    index,
                                    size: "lg"
                                }, index))
                        })
                    }),
                    error && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormWarningText"], {
                        text: error
                    })
                ]
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                variant: "link",
                onClick: props.onBack,
                className: "underline",
                children: t("Cancel")
            })
        ]
    });
}
function MagicLinkSignIn() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [nonce, setNonce] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yupObject"])({
        email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$schema$2d$fields$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strictEmailSchema"])(t("Please enter a valid email")).defined().nonEmpty(t("Please enter your email"))
    });
    const { register, handleSubmit, setError, formState: { errors } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$hookform$2f$resolvers$2f$yup$2f$dist$2f$yup$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["yupResolver"])(schema)
    });
    const onSubmit = async (data)=>{
        setLoading(true);
        try {
            const { email } = data;
            const result = await app.sendMagicLinkEmail(email);
            if (result.status === "error") {
                setError("email", {
                    type: "manual",
                    message: result.error.message
                });
                return;
            } else {
                setNonce(result.data.nonce);
            }
        } catch (e) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].SignUpNotEnabled.isInstance(e)) {
                setError("email", {
                    type: "manual",
                    message: t("New account registration is not allowed")
                });
            } else {
                throw e;
            }
        } finally{
            setLoading(false);
        }
    };
    if (nonce) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(OTP, {
            nonce,
            onBack: ()=>setNonce(null)
        });
    } else {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("form", {
            className: "flex flex-col items-stretch stack-scope",
            onSubmit: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronouslyWithAlert"])(handleSubmit(onSubmit)(e)),
            noValidate: true,
            children: [
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                    htmlFor: "email",
                    className: "mb-1",
                    children: t("Email")
                }),
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                    id: "email",
                    type: "email",
                    autoComplete: "email",
                    ...register("email")
                }),
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$form$2d$warning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FormWarningText"], {
                    text: errors.email?.message?.toString()
                }),
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    type: "submit",
                    className: "mt-6",
                    loading,
                    children: t("Send email")
                })
            ]
        });
    }
}
;
 //# sourceMappingURL=magic-link-sign-in.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/message-cards/message-card.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageCard",
    ()=>MessageCard
]);
// src/components/message-cards/message-card.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$maybe$2d$full$2d$page$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/maybe-full-page.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/typography.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
function MessageCard({ fullPage = false, ...props }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$maybe$2d$full$2d$page$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MaybeFullPage"], {
        fullPage,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
            className: "text-center stack-scope flex flex-col gap-4",
            style: {
                maxWidth: "380px",
                flexBasis: "380px",
                padding: fullPage ? "1rem" : 0
            },
            children: [
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Typography"], {
                    type: "h3",
                    children: props.title
                }),
                props.children,
                (props.primaryButtonText || props.secondaryButtonText) && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                    className: "flex justify-center gap-4 my-5",
                    children: [
                        props.secondaryButtonText && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "secondary",
                            onClick: props.secondaryAction,
                            children: props.secondaryButtonText
                        }),
                        props.primaryButtonText && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: props.primaryAction,
                            children: props.primaryButtonText
                        })
                    ]
                })
            ]
        })
    });
}
;
 //# sourceMappingURL=message-card.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/message-cards/predefined-message-card.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PredefinedMessageCard",
    ()=>PredefinedMessageCard
]);
// src/components/message-cards/predefined-message-card.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/typography.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/translations.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$message$2d$cards$2f$message$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/message-cards/message-card.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
function PredefinedMessageCard({ type, fullPage = false }) {
    const stackApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    let title;
    let message = null;
    let primaryButton = null;
    let secondaryButton = null;
    let primaryAction = null;
    let secondaryAction = null;
    switch(type){
        case "signedIn":
            {
                title = t("You are already signed in");
                primaryAction = ()=>stackApp.redirectToHome();
                secondaryAction = ()=>stackApp.redirectToSignOut();
                primaryButton = t("Go home");
                secondaryButton = t("Sign out");
                break;
            }
        case "signedOut":
            {
                title = t("You are not currently signed in.");
                primaryAction = ()=>stackApp.redirectToSignIn();
                primaryButton = t("Sign in");
                break;
            }
        case "signUpDisabled":
            {
                title = t("Sign up for new users is not enabled at the moment.");
                primaryAction = ()=>stackApp.redirectToHome();
                secondaryAction = ()=>stackApp.redirectToSignIn();
                primaryButton = t("Go home");
                secondaryButton = t("Sign in");
                break;
            }
        case "emailSent":
            {
                title = t("Email sent!");
                message = t("If the user with this e-mail address exists, an e-mail was sent to your inbox. Make sure to check your spam folder.");
                primaryAction = ()=>stackApp.redirectToHome();
                primaryButton = t("Go home");
                break;
            }
        case "passwordReset":
            {
                title = t("Password reset successfully!");
                message = t("Your password has been reset. You can now sign in with your new password.");
                primaryAction = ()=>stackApp.redirectToSignIn({
                        noRedirectBack: true
                    });
                primaryButton = t("Sign in");
                break;
            }
        case "unknownError":
            {
                title = t("An unknown error occurred");
                message = t("Please try again and if the problem persists, contact support.");
                primaryAction = ()=>stackApp.redirectToHome();
                primaryButton = t("Go home");
                break;
            }
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$message$2d$cards$2f$message$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageCard"], {
        title,
        fullPage,
        primaryButtonText: primaryButton,
        primaryAction,
        secondaryButtonText: secondaryButton || void 0,
        secondaryAction: secondaryAction || void 0,
        children: message && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Typography"], {
            children: message
        })
    });
}
;
 //# sourceMappingURL=predefined-message-card.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/use-in-iframe.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInIframe",
    ()=>useInIframe
]);
// src/components/use-in-iframe.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
function useInIframe() {
    const [isIframe, setIsIframe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (window.self !== window.top) {
            setIsIframe(true);
        }
    }, []);
    return isIframe;
}
;
 //# sourceMappingURL=use-in-iframe.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/oauth-button.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OAuthButton",
    ()=>OAuthButton
]);
// src/components/oauth-button.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/brand-icons.js [app-ssr] (ecmascript) <export * as BrandIcons>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$simple$2d$tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/simple-tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$color$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/color/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/translations.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$use$2d$in$2d$iframe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/use-in-iframe.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
;
;
var iconSize = 22;
var changeColor = (c, value)=>{
    if (c.isLight()) {
        value = -value;
    }
    return c.hsl(c.hue(), c.saturationl(), c.lightness() + value).toString();
};
function OAuthButton({ provider, type, isMock = false }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const stackApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const styleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])().replaceAll(":", "-");
    const isIframe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$use$2d$in$2d$iframe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInIframe"])();
    const [lastUsed, setLastUsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLastUsed(localStorage.getItem("_STACK_AUTH.lastUsed"));
    }, []);
    let style;
    switch(provider){
        case "google":
            {
                style = {
                    backgroundColor: "#fff",
                    textColor: "#000",
                    name: "Google",
                    border: "1px solid #ddd",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Google, {
                        iconSize
                    })
                };
                break;
            }
        case "github":
            {
                style = {
                    backgroundColor: "#111",
                    textColor: "#fff",
                    border: "1px solid #333",
                    name: "GitHub",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].GitHub, {
                        iconSize
                    })
                };
                break;
            }
        case "facebook":
            {
                style = {
                    backgroundColor: "#1877F2",
                    textColor: "#fff",
                    name: "Facebook",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Facebook, {
                        iconSize
                    })
                };
                break;
            }
        case "microsoft":
            {
                style = {
                    backgroundColor: "#2f2f2f",
                    textColor: "#fff",
                    name: "Microsoft",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Microsoft, {
                        iconSize
                    })
                };
                break;
            }
        case "spotify":
            {
                style = {
                    backgroundColor: "#1DB954",
                    textColor: "#fff",
                    name: "Spotify",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Spotify, {
                        iconSize
                    })
                };
                break;
            }
        case "discord":
            {
                style = {
                    backgroundColor: "#5865F2",
                    textColor: "#fff",
                    name: "Discord",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Discord, {
                        iconSize
                    })
                };
                break;
            }
        case "gitlab":
            {
                style = {
                    backgroundColor: "#111",
                    textColor: "#fff",
                    border: "1px solid #333",
                    name: "Gitlab",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Gitlab, {
                        iconSize
                    })
                };
                break;
            }
        case "apple":
            {
                style = {
                    backgroundColor: "#000",
                    textColor: "#fff",
                    border: "1px solid #333",
                    name: "Apple",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Apple, {
                        iconSize
                    })
                };
                break;
            }
        case "bitbucket":
            {
                style = {
                    backgroundColor: "#fff",
                    textColor: "#000",
                    border: "1px solid #ddd",
                    name: "Bitbucket",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Bitbucket, {
                        iconSize
                    })
                };
                break;
            }
        case "linkedin":
            {
                style = {
                    backgroundColor: "#0073b1",
                    textColor: "#fff",
                    name: "LinkedIn",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].LinkedIn, {
                        iconSize
                    })
                };
                break;
            }
        case "x":
            {
                style = {
                    backgroundColor: "#000",
                    textColor: "#fff",
                    name: "X",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].X, {
                        iconSize
                    })
                };
                break;
            }
        case "twitch":
            {
                style = {
                    backgroundColor: "#6441a5",
                    textColor: "#fff",
                    name: "Twitch",
                    icon: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$brand$2d$icons$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__BrandIcons$3e$__["BrandIcons"].Twitch, {
                        iconSize
                    })
                };
                break;
            }
        default:
            {
                style = {
                    name: provider,
                    icon: null
                };
            }
    }
    const styleSheet = `
    .stack-oauth-button-${styleId} {
      background-color: ${style.backgroundColor} !important;
      color: ${style.textColor} !important;
      border: ${style.border} !important;
    }
    .stack-oauth-button-${styleId}:hover {
      background-color: ${changeColor((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$color$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(style.backgroundColor), 10)} !important;
    }
  `;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("style", {
                children: styleSheet
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$simple$2d$tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SimpleTooltip"], {
                disabled: !isIframe,
                tooltip: isIframe ? "This auth provider is not supported in an iframe for security reasons." : void 0,
                className: "stack-scope w-full inline-flex",
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    onClick: async ()=>{
                        localStorage.setItem("_STACK_AUTH.lastUsed", provider);
                        await stackApp.signInWithOAuth(provider);
                    },
                    className: `stack-oauth-button-${styleId} stack-scope relative w-full`,
                    disabled: isIframe,
                    children: [
                        !isMock && lastUsed === provider && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                            className: "absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md",
                            children: "last"
                        }),
                        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                            className: "flex items-center w-full gap-4",
                            children: [
                                style.icon,
                                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                                    className: "flex-1",
                                    children: type === "sign-up" ? t("Sign up with {provider}", {
                                        provider: style.name
                                    }) : t("Sign in with {provider}", {
                                        provider: style.name
                                    })
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
}
;
 //# sourceMappingURL=oauth-button.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/oauth-button-group.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OAuthButtonGroup",
    ()=>OAuthButtonGroup
]);
// src/components/oauth-button-group.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$oauth$2d$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/oauth-button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
function OAuthButtonGroup({ type, mockProject }) {
    const stackApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const project = mockProject || stackApp.useProject();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: "gap-4 flex flex-col items-stretch stack-scope",
        children: project.config.oauthProviders.map((p)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$oauth$2d$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OAuthButton"], {
                provider: p.id,
                type,
                isMock: !!mockProject
            }, p.id))
    });
}
;
 //# sourceMappingURL=oauth-button-group.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/passkey-button.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PasskeyButton",
    ()=>PasskeyButton
]);
// src/components/passkey-button.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__KeyRound$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/lucide-react/dist/esm/icons/key-round.js [app-ssr] (ecmascript) <export default as KeyRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/translations.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
;
function PasskeyButton({ type }) {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const stackApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const styleId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])().replaceAll(":", "-");
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
            onClick: async ()=>{
                await stackApp.signInWithPasskey();
            },
            className: `stack-oauth-button-${styleId} stack-scope`,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: "flex items-center w-full gap-4",
                children: [
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__KeyRound$3e$__["KeyRound"], {}),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        className: "flex-1",
                        children: type === "sign-up" ? t("Sign up with Passkey") : t("Sign in with Passkey")
                    })
                ]
            })
        })
    });
}
;
 //# sourceMappingURL=passkey-button.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-page/auth-page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthPage",
    ()=>AuthPage
]);
// src/components-page/auth-page.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-shared/dist/esm/utils/promises.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/skeleton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/tabs.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/components/ui/typography.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack-ui/dist/lib/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$credential$2d$sign$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/credential-sign-in.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$credential$2d$sign$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/credential-sign-up.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$maybe$2d$full$2d$page$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/maybe-full-page.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$separator$2d$with$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/elements/separator-with-text.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$magic$2d$link$2d$sign$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/magic-link-sign-in.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$message$2d$cards$2f$predefined$2d$message$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/message-cards/predefined-message-card.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$oauth$2d$button$2d$group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/oauth-button-group.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$passkey$2d$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components/passkey-button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/translations.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function AuthPage(props) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Fallback, {
            ...props
        }),
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Inner, {
            ...props
        })
    });
}
function Fallback(props) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$maybe$2d$full$2d$page$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MaybeFullPage"], {
        fullPage: !!props.fullPage,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: "stack-scope flex flex-col items-stretch",
            style: {
                maxWidth: "380px",
                flexBasis: "380px",
                padding: props.fullPage ? "1rem" : 0
            },
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: "text-center mb-6 flex flex-col",
                children: [
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-9 w-2/3 self-center"
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-16 mt-8"
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-9 w-full mt-1"
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-3 w-24 mt-2"
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-9 w-full mt-1"
                    }),
                    /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        className: "h-9 w-full mt-6"
                    })
                ]
            })
        })
    });
}
function Inner(props) {
    const stackApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const projectFromHook = stackApp.useProject();
    const project = props.mockProject || projectFromHook;
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$translations$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (props.automaticRedirect && user && !props.mockProject) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronously"])(props.type === "sign-in" ? stackApp.redirectToAfterSignIn({
                replace: true
            }) : stackApp.redirectToAfterSignUp({
                replace: true
            }));
        }
    }, [
        user,
        props.mockProject,
        stackApp,
        props.automaticRedirect
    ]);
    if (user && !props.mockProject && !props.automaticRedirect) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$message$2d$cards$2f$predefined$2d$message$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PredefinedMessageCard"], {
            type: "signedIn",
            fullPage: props.fullPage
        });
    }
    if (props.type === "sign-up" && !project.config.signUpEnabled) {
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$message$2d$cards$2f$predefined$2d$message$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PredefinedMessageCard"], {
            type: "signUpDisabled",
            fullPage: props.fullPage
        });
    }
    const hasOAuthProviders = project.config.oauthProviders.length > 0;
    const hasPasskey = project.config.passkeyEnabled === true && props.type === "sign-in";
    const enableSeparator = (project.config.credentialEnabled || project.config.magicLinkEnabled) && (hasOAuthProviders || hasPasskey);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$maybe$2d$full$2d$page$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MaybeFullPage"], {
        fullPage: !!props.fullPage,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
            className: "stack-scope flex flex-col items-stretch",
            style: {
                maxWidth: "380px",
                flexBasis: "380px",
                padding: props.fullPage ? "1rem" : 0
            },
            children: [
                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                    className: "text-center mb-6",
                    children: [
                        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Typography"], {
                            type: "h2",
                            children: props.type === "sign-in" ? t("Sign in to your account") : t("Create a new account")
                        }),
                        props.type === "sign-in" ? project.config.signUpEnabled && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Typography"], {
                            children: [
                                t("Don't have an account?"),
                                " ",
                                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StyledLink"], {
                                    href: stackApp.urls.signUp,
                                    onClick: (e)=>{
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronously"])(stackApp.redirectToSignUp());
                                        e.preventDefault();
                                    },
                                    children: t("Sign up")
                                })
                            ]
                        }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Typography"], {
                            children: [
                                t("Already have an account?"),
                                " ",
                                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StyledLink"], {
                                    href: stackApp.urls.signIn,
                                    onClick: (e)=>{
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$esm$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronously"])(stackApp.redirectToSignIn());
                                        e.preventDefault();
                                    },
                                    children: t("Sign in")
                                })
                            ]
                        })
                    ]
                }),
                (hasOAuthProviders || hasPasskey) && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                    className: "gap-4 flex flex-col items-stretch stack-scope",
                    children: [
                        hasOAuthProviders && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$oauth$2d$button$2d$group$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OAuthButtonGroup"], {
                            type: props.type,
                            mockProject: props.mockProject
                        }),
                        hasPasskey && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$passkey$2d$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PasskeyButton"], {
                            type: props.type
                        })
                    ]
                }),
                enableSeparator && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$elements$2f$separator$2d$with$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SeparatorWithText"], {
                    text: t("Or continue with")
                }),
                project.config.credentialEnabled && project.config.magicLinkEnabled ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tabs"], {
                    defaultValue: props.firstTab || "magic-link",
                    children: [
                        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsList"], {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full mb-2", {
                                "flex-row-reverse": props.firstTab === "password"
                            }),
                            children: [
                                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                    value: "magic-link",
                                    className: "flex-1",
                                    children: t("Email")
                                }),
                                /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                    value: "password",
                                    className: "flex-1",
                                    children: t("Email & Password")
                                })
                            ]
                        }),
                        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "magic-link",
                            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$magic$2d$link$2d$sign$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MagicLinkSignIn"], {})
                        }),
                        /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "password",
                            children: props.type === "sign-up" ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$credential$2d$sign$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CredentialSignUp"], {
                                noPasswordRepeat: props.noPasswordRepeat
                            }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$credential$2d$sign$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CredentialSignIn"], {})
                        })
                    ]
                }) : project.config.credentialEnabled ? props.type === "sign-up" ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$credential$2d$sign$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CredentialSignUp"], {
                    noPasswordRepeat: props.noPasswordRepeat
                }) : /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$credential$2d$sign$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CredentialSignIn"], {}) : project.config.magicLinkEnabled ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2f$magic$2d$link$2d$sign$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MagicLinkSignIn"], {}) : !(hasOAuthProviders || hasPasskey) ? /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$components$2f$ui$2f$typography$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Typography"], {
                    variant: "destructive",
                    className: "text-center",
                    children: t("No authentication method enabled.")
                }) : null,
                props.extraInfo && /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2d$ui$2f$dist$2f$lib$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center text-center text-sm text-gray-500", {
                        "mt-2": project.config.credentialEnabled || project.config.magicLinkEnabled,
                        "mt-6": !(project.config.credentialEnabled || project.config.magicLinkEnabled)
                    }),
                    children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        children: props.extraInfo
                    })
                })
            ]
        })
    });
}
;
 //# sourceMappingURL=auth-page.js.map
}),
];

//# sourceMappingURL=65e54_%40stackframe_stack_dist_esm_d5029937._.js.map