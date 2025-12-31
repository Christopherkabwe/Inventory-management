module.exports = [
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/cookie.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ../../node_modules/.pnpm/oauth4webapi@2.10.3/node_modules/oauth4webapi/build/index.js
__turbopack_context__.s([
    "deleteCookie",
    ()=>deleteCookie,
    "getCookie",
    ()=>getCookie,
    "getVerifierAndState",
    ()=>getVerifierAndState,
    "saveVerifierAndState",
    ()=>saveVerifierAndState,
    "setCookie",
    ()=>setCookie,
    "setOrDeleteCookie",
    ()=>setOrDeleteCookie
]);
// src/lib/cookie.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$sc$2f$dist$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-sc/dist/index.server.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/headers.js [app-ssr] (ecmascript)");
var USER_AGENT;
if (typeof navigator === "undefined" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) {
    const NAME = "oauth4webapi";
    const VERSION = "v2.10.3";
    USER_AGENT = `${NAME}/${VERSION}`;
}
var clockSkew = Symbol();
var clockTolerance = Symbol();
var customFetch = Symbol();
var useMtlsAlias = Symbol();
var encoder = new TextEncoder();
var decoder = new TextDecoder();
function buf(input) {
    if (typeof input === "string") {
        return encoder.encode(input);
    }
    return decoder.decode(input);
}
var CHUNK_SIZE = 32768;
function encodeBase64Url(input) {
    if (input instanceof ArrayBuffer) {
        input = new Uint8Array(input);
    }
    const arr = [];
    for(let i = 0; i < input.byteLength; i += CHUNK_SIZE){
        arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function decodeBase64Url(input) {
    try {
        const binary = atob(input.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, ""));
        const bytes = new Uint8Array(binary.length);
        for(let i = 0; i < binary.length; i++){
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    } catch (cause) {
        throw new OPE("The input to be decoded is not correctly encoded.", {
            cause
        });
    }
}
function b64u(input) {
    if (typeof input === "string") {
        return decodeBase64Url(input);
    }
    return encodeBase64Url(input);
}
var LRU = class {
    constructor(maxSize){
        this.cache = /* @__PURE__ */ new Map();
        this._cache = /* @__PURE__ */ new Map();
        this.maxSize = maxSize;
    }
    get(key) {
        let v = this.cache.get(key);
        if (v) {
            return v;
        }
        if (v = this._cache.get(key)) {
            this.update(key, v);
            return v;
        }
        return void 0;
    }
    has(key) {
        return this.cache.has(key) || this._cache.has(key);
    }
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.set(key, value);
        } else {
            this.update(key, value);
        }
        return this;
    }
    delete(key) {
        if (this.cache.has(key)) {
            return this.cache.delete(key);
        }
        if (this._cache.has(key)) {
            return this._cache.delete(key);
        }
        return false;
    }
    update(key, value) {
        this.cache.set(key, value);
        if (this.cache.size >= this.maxSize) {
            this._cache = this.cache;
            this.cache = /* @__PURE__ */ new Map();
        }
    }
};
var OperationProcessingError = class extends Error {
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
};
var OPE = OperationProcessingError;
var dpopNonces = new LRU(100);
function validateString(input) {
    return typeof input === "string" && input.length !== 0;
}
function randomBytes() {
    return b64u(crypto.getRandomValues(new Uint8Array(32)));
}
function generateRandomCodeVerifier() {
    return randomBytes();
}
function generateRandomState() {
    return randomBytes();
}
async function calculatePKCECodeChallenge(codeVerifier) {
    if (!validateString(codeVerifier)) {
        throw new TypeError('"codeVerifier" must be a non-empty string');
    }
    return b64u(await crypto.subtle.digest("SHA-256", buf(codeVerifier)));
}
var skipSubjectCheck = Symbol();
var expectNoNonce = Symbol();
var skipAuthTimeCheck = Symbol();
var noSignatureCheck = Symbol();
var skipStateCheck = Symbol();
var expectNoState = Symbol();
;
;
function isRscCookieUnavailableError(e) {
    const allowedMessageSnippets = [
        "was called outside a request scope",
        "cookies() expects to have requestAsyncStorage"
    ];
    return typeof e?.message === "string" && allowedMessageSnippets.some((msg)=>e.message.includes(msg));
}
function getCookie(name) {
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])().get(name)?.value ?? null;
    } catch (e) {
        if (isRscCookieUnavailableError(e)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(name) ?? null;
        } else {
            throw e;
        }
    }
}
function setOrDeleteCookie(name, value, options = {}) {
    if (value === null) {
        deleteCookie(name);
    } else {
        setCookie(name, value, options);
    }
}
function deleteCookie(name) {
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])().delete(name);
    } catch (e) {
        if (isRscCookieUnavailableError(e)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].remove(name);
        } else {
            throw e;
        }
    }
}
function setCookie(name, value, options = {}) {
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"])().set(name, value, {
            maxAge: options.maxAge
        });
    } catch (e) {
        if (isRscCookieUnavailableError(e)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].set(name, value, {
                secure: window.location.protocol === "https:",
                expires: options.maxAge === void 0 ? void 0 : new Date(Date.now() + options.maxAge * 1e3)
            });
        } else {
            throw e;
        }
    }
}
async function saveVerifierAndState() {
    const codeVerifier = generateRandomCodeVerifier();
    const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
    const state = generateRandomState();
    setCookie("stack-code-verifier", codeVerifier, {
        maxAge: 60 * 10
    });
    setCookie("stack-state", state, {
        maxAge: 60 * 10
    });
    return {
        codeChallenge,
        state
    };
}
function getVerifierAndState() {
    const codeVerifier = getCookie("stack-code-verifier");
    const state = getCookie("stack-state");
    return {
        codeVerifier,
        state
    };
}
;
 //# sourceMappingURL=cookie.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/next.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/next.tsx
__turbopack_context__.s([
    "isClient",
    ()=>isClient
]);
function isClient() {
    return ("TURBOPACK compile-time value", "undefined") !== "undefined";
}
;
 //# sourceMappingURL=next.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/url.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/url.tsx
__turbopack_context__.s([
    "autoRedirect",
    ()=>autoRedirect,
    "constructRedirectUrl",
    ()=>constructRedirectUrl
]);
function autoRedirect() {
    const url = new URL(window.location.href);
    const redirectUrl = url.searchParams.get("auto-redirect-url");
    if (redirectUrl) {
        const urlObject = new URL(redirectUrl);
        if (urlObject.origin !== window.location.origin) {
            throw new Error("auto-redirect-url is not same origin (" + urlObject.origin + " !== " + window.location.origin + ")");
        }
        url.searchParams.delete("auto-redirect-url");
        window.location.replace(urlObject.href);
    }
}
function constructRedirectUrl(redirectUrl) {
    const url = redirectUrl ? new URL(redirectUrl, window.location.href) : new URL(window.location.href);
    return url.href.split("#")[0];
}
;
 //# sourceMappingURL=url.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/auth.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/auth.ts
__turbopack_context__.s([
    "callOAuthCallback",
    ()=>callOAuthCallback,
    "signInWithOAuth",
    ()=>signInWithOAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/cookie.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/url.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-ssr] (ecmascript)");
;
;
;
;
async function signInWithOAuth(iface, { provider, redirectUrl }) {
    redirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(redirectUrl);
    const { codeChallenge, state } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveVerifierAndState"])();
    const location = await iface.getOAuthUrl(provider, redirectUrl, codeChallenge, state);
    window.location.assign(location);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["neverResolve"])();
}
function consumeOAuthCallbackQueryParams(expectedState) {
    const requiredParams = [
        "code",
        "state"
    ];
    const originalUrl = new URL(window.location.href);
    for (const param of requiredParams){
        if (!originalUrl.searchParams.has(param)) {
            return null;
        }
    }
    if (expectedState !== originalUrl.searchParams.get("state")) {
        return null;
    }
    const newUrl = new URL(originalUrl);
    for (const param of requiredParams){
        newUrl.searchParams.delete(param);
    }
    window.history.replaceState({}, "", newUrl.toString());
    return originalUrl;
}
async function callOAuthCallback(iface, tokenStore, redirectUrl) {
    const { codeVerifier, state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getVerifierAndState"])();
    if (!codeVerifier || !state) {
        throw new Error("Invalid OAuth callback URL parameters. It seems like the OAuth flow was interrupted, so please try again.");
    }
    const originalUrl = consumeOAuthCallbackQueryParams(state);
    if (!originalUrl) return null;
    try {
        return await iface.callOAuthCallback(originalUrl.searchParams, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(redirectUrl), codeVerifier, state, tokenStore);
    } catch (e) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("Error signing in during OAuth callback. Please try again.", {
            cause: e
        });
    }
}
;
 //# sourceMappingURL=auth.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/stack-app.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/stack-app.ts
__turbopack_context__.s([
    "StackAdminApp",
    ()=>StackAdminApp,
    "StackClientApp",
    ()=>StackClientApp,
    "StackServerApp",
    ()=>StackServerApp,
    "stackAppInternalsSymbol",
    ()=>stackAppInternalsSymbol
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/known-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$adminInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/adminInterface.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/clientInterface.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/serverInterface.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/cookie.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/uuids.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/stores.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/next.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/auth.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/url.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/objects.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$caches$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/caches.js [app-ssr] (ecmascript)");
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
;
;
var clientVersion = "js @stackframe/stack@2.4.8";
function permissionDefinitionScopeToType(scope) {
    return ({
        "any-team": "team",
        "specific-team": "team",
        "global": "global"
    })[scope.type];
}
function getUrls(partial) {
    const handler = partial.handler ?? "/handler";
    return {
        handler,
        signIn: `${handler}/signin`,
        afterSignIn: "/",
        signUp: `${handler}/signup`,
        afterSignUp: "/",
        signOut: `${handler}/signout`,
        afterSignOut: "/",
        emailVerification: `${handler}/email-verification`,
        passwordReset: `${handler}/password-reset`,
        forgotPassword: `${handler}/forgot-password`,
        oauthCallback: `${handler}/oauth-callback`,
        magicLinkCallback: `${handler}/magic-link-callback`,
        home: "/",
        accountSettings: `${handler}/account-settings`,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filterUndefined"])(partial)
    };
}
function getDefaultProjectId() {
    return ("TURBOPACK compile-time value", "a18ac01b-59d7-4c8c-80b4-c0c2ec979d96") || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])(new Error("Welcome to Stack! It seems that you haven't provided a project ID. Please create a project on the Stack dashboard at https://app.stack-auth.com and put it in the NEXT_PUBLIC_STACK_PROJECT_ID environment variable."));
}
function getDefaultPublishableClientKey() {
    return ("TURBOPACK compile-time value", "pck_qcjtn291av4x05zntcwhz5w71m8bm8g5mcy1mnze3cqf8") || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])(new Error("Welcome to Stack! It seems that you haven't provided a publishable client key. Please create an API key for your project on the Stack dashboard at https://app.stack-auth.com and copy your publishable client key into the NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY environment variable."));
}
function getDefaultSecretServerKey() {
    return process.env.STACK_SECRET_SERVER_KEY || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])(new Error("No secret server key provided. Please copy your key from the Stack dashboard and put your it in the STACK_SECRET_SERVER_KEY environment variable."));
}
function getDefaultSuperSecretAdminKey() {
    return process.env.STACK_SUPER_SECRET_ADMIN_KEY || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])(new Error("No super secret admin key provided. Please copy your key from the Stack dashboard and put it in the STACK_SUPER_SECRET_ADMIN_KEY environment variable."));
}
function getDefaultBaseUrl() {
    return process.env.NEXT_PUBLIC_STACK_URL || defaultBaseUrl;
}
var defaultBaseUrl = "https://app.stack-auth.com";
function createEmptyTokenStore() {
    const store = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncStore"]();
    store.set({
        refreshToken: null,
        accessToken: null
    });
    return store;
}
var memoryTokenStore = createEmptyTokenStore();
var cookieTokenStore = null;
var cookieTokenStoreInitializer = ()=>{
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isClient"])()) {
        throw new Error("Cannot use cookie token store on the server!");
    }
    if (cookieTokenStore === null) {
        cookieTokenStore = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncStore"]();
        let hasSucceededInWriting = true;
        setInterval(()=>{
            if (hasSucceededInWriting) {
                const newValue = {
                    refreshToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCookie"])("stack-refresh"),
                    accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCookie"])("stack-access")
                };
                const res = cookieTokenStore.get();
                if (res.status !== "ok" || res.data.refreshToken !== newValue.refreshToken || res.data.accessToken !== newValue.accessToken) {
                    cookieTokenStore.set(newValue);
                }
            }
        }, 10);
        cookieTokenStore.onChange((value)=>{
            try {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setOrDeleteCookie"])("stack-refresh", value.refreshToken, {
                    maxAge: 60 * 60 * 24 * 365
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setOrDeleteCookie"])("stack-access", value.accessToken, {
                    maxAge: 60 * 60 * 24
                });
                hasSucceededInWriting = true;
            } catch (e) {
                hasSucceededInWriting = false;
            }
        });
    }
    return cookieTokenStore;
};
var tokenStoreInitializers = /* @__PURE__ */ new Map([
    [
        "cookie",
        cookieTokenStoreInitializer
    ],
    [
        "nextjs-cookie",
        ()=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isClient"])()) {
                return cookieTokenStoreInitializer();
            } else {
                const store = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncStore"]();
                store.set({
                    refreshToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCookie"])("stack-refresh"),
                    accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCookie"])("stack-access")
                });
                store.onChange((value)=>{
                    try {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setOrDeleteCookie"])("stack-refresh", value.refreshToken, {
                            maxAge: 60 * 60 * 24 * 365
                        });
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setOrDeleteCookie"])("stack-access", value.accessToken, {
                            maxAge: 60 * 60 * 24
                        });
                    } catch (e) {}
                });
                return store;
            }
        }
    ],
    [
        "memory",
        ()=>memoryTokenStore
    ],
    [
        null,
        ()=>createEmptyTokenStore()
    ]
]);
function getTokenStore(tokenStoreOptions) {
    return (tokenStoreInitializers.get(tokenStoreOptions) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])(`Invalid token store ${tokenStoreOptions}`))();
}
var loadingSentinel = Symbol("stackAppCacheLoadingSentinel");
function useCache(cache, dependencies, caller) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suspendIfSsr"])(caller);
    const subscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((cb)=>{
        const { unsubscribe } = cache.onChange(dependencies, ()=>cb());
        return unsubscribe;
    }, [
        cache,
        ...dependencies
    ]);
    const getSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncResult"].or(cache.getIfCached(dependencies), loadingSentinel);
    }, [
        cache,
        ...dependencies
    ]);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    if (value === loadingSentinel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(cache.getOrWait(dependencies, "read-write"));
    } else {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolved"])(value));
    }
}
var stackAppInternalsSymbol = Symbol.for("StackAppInternals");
var allClientApps = /* @__PURE__ */ new Map();
var createCache = (fetcher)=>{
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$caches$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncCache"](async (dependencies)=>await fetcher(dependencies), {});
};
var createCacheByTokenStore = (fetcher)=>{
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$caches$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncCache"](async ([tokenStore, ...extraDependencies])=>await fetcher(tokenStore, extraDependencies), {
        onSubscribe: ([tokenStore], refresh)=>{
            const handlerObj = tokenStore.onChange((newValue, oldValue)=>{
                if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return;
                refresh();
            });
            return ()=>handlerObj.unsubscribe();
        }
    });
};
var _StackClientAppImpl = class __StackClientAppImpl {
    _uniqueIdentifier;
    _interface;
    _tokenStoreOptions;
    _urlOptions;
    __DEMO_ENABLE_SLIGHT_FETCH_DELAY = false;
    _currentUserCache = createCacheByTokenStore(async (tokenStore)=>{
        if (this.__DEMO_ENABLE_SLIGHT_FETCH_DELAY) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wait"])(2e3);
        }
        const user = await this._interface.getClientUserByToken(tokenStore);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].or(user, null);
    });
    _currentProjectCache = createCache(async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].orThrow(await this._interface.getClientProject());
    });
    _ownedProjectsCache = createCacheByTokenStore(async (tokenStore)=>{
        return await this._interface.listProjects(tokenStore);
    });
    _currentUserPermissionsCache = createCacheByTokenStore(async (tokenStore, [teamId, type, direct])=>{
        return await this._interface.listClientUserTeamPermissions({
            teamId,
            type,
            direct
        }, tokenStore);
    });
    _currentUserTeamsCache = createCacheByTokenStore(async (tokenStore)=>{
        return await this._interface.listClientUserTeams(tokenStore);
    });
    constructor(options){
        if ("interface" in options) {
            this._interface = options.interface;
        } else {
            this._interface = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackClientInterface"]({
                baseUrl: options.baseUrl ?? getDefaultBaseUrl(),
                projectId: options.projectId ?? getDefaultProjectId(),
                clientVersion,
                publishableClientKey: options.publishableClientKey ?? getDefaultPublishableClientKey()
            });
        }
        this._tokenStoreOptions = options.tokenStore;
        this._urlOptions = options.urls ?? {};
        this._uniqueIdentifier = options.uniqueIdentifier ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUuid"])();
        if (allClientApps.has(this._uniqueIdentifier)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("A Stack client app with the same unique identifier already exists");
        }
        allClientApps.set(this._uniqueIdentifier, [
            options.checkString ?? "default check string",
            this
        ]);
    }
    hasPersistentTokenStore() {
        return this._tokenStoreOptions !== null;
    }
    _ensurePersistentTokenStore() {
        if (!this.hasPersistentTokenStore()) {
            throw new Error("Cannot call this function on a Stack app without a persistent token store. Make sure the tokenStore option is set to a non-null value when initializing Stack.");
        }
    }
    isInternalProject() {
        return this.projectId === "internal";
    }
    _ensureInternalProject() {
        if (!this.isInternalProject()) {
            throw new Error("Cannot call this function on a Stack app with a project ID other than 'internal'.");
        }
    }
    _permissionFromJson(json) {
        const type = permissionDefinitionScopeToType(json.scope);
        if (type === "team") {
            return {
                id: json.id,
                type,
                teamId: json.scope.teamId
            };
        } else {
            return {
                id: json.id,
                type
            };
        }
    }
    _teamFromJson(json) {
        return {
            id: json.id,
            displayName: json.displayName,
            createdAt: new Date(json.createdAtMillis),
            toJson () {
                return json;
            }
        };
    }
    _userFromJson(json) {
        const app = this;
        return {
            projectId: json.projectId,
            id: json.id,
            displayName: json.displayName,
            primaryEmail: json.primaryEmail,
            primaryEmailVerified: json.primaryEmailVerified,
            profileImageUrl: json.profileImageUrl,
            signedUpAt: new Date(json.signedUpAtMillis),
            clientMetadata: json.clientMetadata,
            authMethod: json.authMethod,
            hasPassword: json.hasPassword,
            authWithEmail: json.authWithEmail,
            oauthProviders: json.oauthProviders,
            async getSelectedTeam () {
                return await this.getTeam(json.selectedTeamId || "");
            },
            useSelectedTeam () {
                return this.useTeam(json.selectedTeamId || "");
            },
            async getTeam (teamId) {
                const teams = await this.listTeams();
                return teams.find((t)=>t.id === teamId) ?? null;
            },
            useTeam (teamId) {
                const teams = this.useTeams();
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
                    return teams.find((t)=>t.id === teamId) ?? null;
                }, [
                    teams,
                    teamId
                ]);
            },
            onTeamChange (teamId, callback) {
                return this.onTeamsChange((teams)=>{
                    const team = teams.find((t)=>t.id === teamId) ?? null;
                    callback(team);
                });
            },
            async listTeams () {
                const teams = await app._currentUserTeamsCache.getOrWait([
                    getTokenStore(app._tokenStoreOptions)
                ], "write-only");
                return teams.map((json2)=>app._teamFromJson(json2));
            },
            useTeams () {
                const teams = useCache(app._currentUserTeamsCache, [
                    getTokenStore(app._tokenStoreOptions)
                ], "user.useTeams()");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>teams.map((json2)=>app._teamFromJson(json2)), [
                    teams
                ]);
            },
            onTeamsChange (callback) {
                return app._currentUserTeamsCache.onChange([
                    getTokenStore(app._tokenStoreOptions)
                ], (value, oldValue)=>{
                    callback(value.map((json2)=>app._teamFromJson(json2)), oldValue?.map((json2)=>app._teamFromJson(json2)));
                });
            },
            async listPermissions (scope, options) {
                const permissions = await app._currentUserPermissionsCache.getOrWait([
                    getTokenStore(app._tokenStoreOptions),
                    scope.id,
                    "team",
                    !!options?.direct
                ], "write-only");
                return permissions.map((json2)=>app._permissionFromJson(json2));
            },
            usePermissions (scope, options) {
                const permissions = useCache(app._currentUserPermissionsCache, [
                    getTokenStore(app._tokenStoreOptions),
                    scope.id,
                    "team",
                    !!options?.direct
                ], "user.usePermissions()");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>permissions.map((json2)=>app._permissionFromJson(json2)), [
                    permissions
                ]);
            },
            usePermission (scope, permissionId) {
                const permissions = this.usePermissions(scope);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>permissions.find((p)=>p.id === permissionId) ?? null, [
                    permissions,
                    permissionId
                ]);
            },
            async getPermission (scope, permissionId) {
                const permissions = await this.listPermissions(scope);
                return permissions.find((p)=>p.id === permissionId) ?? null;
            },
            async hasPermission (scope, permissionId) {
                return await this.getPermission(scope, permissionId) !== null;
            },
            toJson () {
                return json;
            }
        };
    }
    _teamMemberFromJson(json) {
        if (json === null) return null;
        return {
            teamId: json.teamId,
            userId: json.userId,
            displayName: json.displayName
        };
    }
    _currentUserFromJson(json, tokenStore) {
        if (json === null) return null;
        const app = this;
        const currentUser = {
            ...this._userFromJson(json),
            tokenStore,
            async updateSelectedTeam (team) {
                await app._updateUser({
                    selectedTeamId: team?.id ?? null
                }, tokenStore);
            },
            update (update) {
                return app._updateUser(update, tokenStore);
            },
            signOut () {
                return app._signOut(tokenStore);
            },
            sendVerificationEmail () {
                return app._sendVerificationEmail(tokenStore);
            },
            updatePassword (options) {
                return app._updatePassword(options, tokenStore);
            }
        };
        if (this.isInternalProject()) {
            const internalUser = {
                ...currentUser,
                createProject (newProject) {
                    return app._createProject(newProject);
                },
                listOwnedProjects () {
                    return app._listOwnedProjects();
                },
                useOwnedProjects () {
                    return app._useOwnedProjects();
                },
                onOwnedProjectsChange (callback) {
                    return app._onOwnedProjectsChange(callback);
                }
            };
            Object.freeze(internalUser);
            return internalUser;
        } else {
            Object.freeze(currentUser);
            return currentUser;
        }
    }
    _projectAdminFromJson(data, adminInterface, onRefresh) {
        if (data.id !== adminInterface.projectId) {
            throw new Error(`The project ID of the provided project JSON (${data.id}) does not match the project ID of the app (${adminInterface.projectId})! This is a Stack bug.`);
        }
        return {
            id: data.id,
            displayName: data.displayName,
            description: data.description,
            createdAt: new Date(data.createdAtMillis),
            userCount: data.userCount,
            isProductionMode: data.isProductionMode,
            evaluatedConfig: {
                id: data.evaluatedConfig.id,
                credentialEnabled: data.evaluatedConfig.credentialEnabled,
                magicLinkEnabled: data.evaluatedConfig.magicLinkEnabled,
                allowLocalhost: data.evaluatedConfig.allowLocalhost,
                oauthProviders: data.evaluatedConfig.oauthProviders,
                emailConfig: data.evaluatedConfig.emailConfig,
                domains: data.evaluatedConfig.domains,
                createTeamOnSignUp: data.evaluatedConfig.createTeamOnSignUp
            },
            async update (update) {
                await adminInterface.updateProject(update);
                await onRefresh();
            },
            toJson () {
                return data;
            },
            getProductionModeErrors () {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProductionModeErrors"])(this.toJson());
            }
        };
    }
    _createAdminInterface(forProjectId, tokenStore) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$adminInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAdminInterface"]({
            baseUrl: this._interface.options.baseUrl,
            projectId: forProjectId,
            clientVersion,
            projectOwnerTokens: tokenStore
        });
    }
    get projectId() {
        return this._interface.projectId;
    }
    get urls() {
        return getUrls(this._urlOptions);
    }
    async _redirectTo(handlerName, options) {
        const url = this.urls[handlerName];
        if (!url) {
            throw new Error(`No URL for handler name ${handlerName}`);
        }
        if (options?.replace) {
            window.location.replace(url);
        } else {
            window.location.assign(url);
        }
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wait"])(2e3);
    }
    async redirectToSignIn() {
        return await this._redirectTo("signIn");
    }
    async redirectToSignUp() {
        return await this._redirectTo("signUp");
    }
    async redirectToSignOut() {
        return await this._redirectTo("signOut");
    }
    async redirectToEmailVerification() {
        return await this._redirectTo("emailVerification");
    }
    async redirectToPasswordReset() {
        return await this._redirectTo("passwordReset");
    }
    async redirectToForgotPassword() {
        return await this._redirectTo("forgotPassword");
    }
    async redirectToHome() {
        return await this._redirectTo("home");
    }
    async redirectToOAuthCallback() {
        return await this._redirectTo("oauthCallback");
    }
    async redirectToMagicLinkCallback() {
        return await this._redirectTo("magicLinkCallback");
    }
    async redirectToAfterSignIn() {
        return await this._redirectTo("afterSignIn");
    }
    async redirectToAfterSignUp() {
        return await this._redirectTo("afterSignUp");
    }
    async redirectToAfterSignOut() {
        return await this._redirectTo("afterSignOut");
    }
    async redirectToAccountSettings() {
        return await this._redirectTo("accountSettings");
    }
    async sendForgotPasswordEmail(email) {
        const redirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(this.urls.passwordReset);
        const error = await this._interface.sendForgotPasswordEmail(email, redirectUrl);
        return error;
    }
    async sendMagicLinkEmail(email) {
        const magicLinkRedirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(this.urls.magicLinkCallback);
        const error = await this._interface.sendMagicLinkEmail(email, magicLinkRedirectUrl);
        return error;
    }
    async resetPassword(options) {
        const error = await this._interface.resetPassword(options);
        return error;
    }
    async verifyPasswordResetCode(code) {
        return await this._interface.verifyPasswordResetCode(code);
    }
    async verifyEmail(code) {
        return await this._interface.verifyEmail(code);
    }
    async getUser(options) {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const userJson = await this._currentUserCache.getOrWait([
            tokenStore
        ], "write-only");
        if (userJson === null) {
            switch(options?.or){
                case "redirect":
                    {
                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["redirect"](this.urls.signIn, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RedirectType"].replace);
                        throw new Error("redirect should never return!");
                    }
                case "throw":
                    {
                        throw new Error("User is not signed in but getUser was called with { or: 'throw' }");
                    }
                default:
                    {
                        return null;
                    }
            }
        }
        return this._currentUserFromJson(userJson, tokenStore);
    }
    useUser(options) {
        this._ensurePersistentTokenStore();
        const router = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"]();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const userJson = useCache(this._currentUserCache, [
            tokenStore
        ], "useUser()");
        if (userJson === null) {
            switch(options?.or){
                case "redirect":
                    {
                        router.replace(this.urls.signIn);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suspend"])();
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("suspend should never return");
                    }
                case "throw":
                    {
                        throw new Error("User is not signed in but useUser was called with { or: 'throw' }");
                    }
                case void 0:
                case "return-null":
                    {}
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
            return this._currentUserFromJson(userJson, tokenStore);
        }, [
            userJson,
            tokenStore,
            options?.or
        ]);
    }
    onUserChange(callback) {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        return this._currentUserCache.onChange([
            tokenStore
        ], (userJson)=>{
            callback(this._currentUserFromJson(userJson, tokenStore));
        });
    }
    async _updateUser(update, tokenStore) {
        const res = await this._interface.setClientUserCustomizableData(update, tokenStore);
        await this._refreshUser(tokenStore);
        return res;
    }
    async signInWithOAuth(provider) {
        this._ensurePersistentTokenStore();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signInWithOAuth"])(this._interface, {
            provider,
            redirectUrl: this.urls.oauthCallback
        });
    }
    async signInWithCredential(options) {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const errorCode = await this._interface.signInWithCredential(options.email, options.password, tokenStore);
        if (!errorCode) {
            await this.redirectToAfterSignIn({
                replace: true
            });
        }
        return errorCode;
    }
    async signUpWithCredential(options) {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const emailVerificationRedirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(this.urls.emailVerification);
        const errorCode = await this._interface.signUpWithCredential(options.email, options.password, emailVerificationRedirectUrl, tokenStore);
        if (!errorCode) {
            await this.redirectToAfterSignUp({
                replace: true
            });
        }
        return errorCode;
    }
    async signInWithMagicLink(code) {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const result = await this._interface.signInWithMagicLink(code, tokenStore);
        if (result instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownError"]) {
            return result;
        }
        if (result.newUser) {
            await this.redirectToAfterSignUp({
                replace: true
            });
        } else {
            await this.redirectToAfterSignIn({
                replace: true
            });
        }
    }
    async callOAuthCallback() {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$auth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callOAuthCallback"])(this._interface, tokenStore, this.urls.oauthCallback);
        if (result) {
            if (result.newUser) {
                await this.redirectToAfterSignUp({
                    replace: true
                });
                return true;
            } else {
                await this.redirectToAfterSignIn({
                    replace: true
                });
                return true;
            }
        }
        return false;
    }
    async _signOut(tokenStore) {
        await this._interface.signOut(tokenStore);
        await this.redirectToAfterSignOut();
    }
    async _sendVerificationEmail(tokenStore) {
        const emailVerificationRedirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(this.urls.emailVerification);
        return await this._interface.sendVerificationEmail(emailVerificationRedirectUrl, tokenStore);
    }
    async _updatePassword(options, tokenStore) {
        return await this._interface.updatePassword(options, tokenStore);
    }
    async signOut() {
        const user = await this.getUser();
        if (user) {
            await user.signOut();
        }
    }
    async getProject() {
        return await this._currentProjectCache.getOrWait([], "write-only");
    }
    useProject() {
        return useCache(this._currentProjectCache, [], "useProject()");
    }
    onProjectChange(callback) {
        return this._currentProjectCache.onChange([], callback);
    }
    async _listOwnedProjects() {
        this._ensureInternalProject();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const json = await this._ownedProjectsCache.getOrWait([
            tokenStore
        ], "write-only");
        return json.map((j)=>this._projectAdminFromJson(j, this._createAdminInterface(j.id, tokenStore), ()=>this._refreshOwnedProjects(tokenStore)));
    }
    _useOwnedProjects() {
        this._ensureInternalProject();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const json = useCache(this._ownedProjectsCache, [
            tokenStore
        ], "useOwnedProjects()");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>json.map((j)=>this._projectAdminFromJson(j, this._createAdminInterface(j.id, tokenStore), ()=>this._refreshOwnedProjects(tokenStore))), [
            json
        ]);
    }
    _onOwnedProjectsChange(callback) {
        this._ensureInternalProject();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        return this._ownedProjectsCache.onChange([
            tokenStore
        ], (projects)=>{
            callback(projects.map((j)=>this._projectAdminFromJson(j, this._createAdminInterface(j.id, tokenStore), ()=>this._refreshOwnedProjects(tokenStore))));
        });
    }
    async _createProject(newProject) {
        this._ensureInternalProject();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const json = await this._interface.createProject(newProject, tokenStore);
        const res = this._projectAdminFromJson(json, this._createAdminInterface(json.id, tokenStore), ()=>this._refreshOwnedProjects(tokenStore));
        await this._refreshOwnedProjects(tokenStore);
        return res;
    }
    async _refreshUser(tokenStore) {
        await this._currentUserCache.refresh([
            tokenStore
        ]);
    }
    async _refreshUsers() {}
    async _refreshProject() {
        await this._currentProjectCache.refresh([]);
    }
    async _refreshOwnedProjects(tokenStore) {
        await this._ownedProjectsCache.refresh([
            tokenStore
        ]);
    }
    static get [stackAppInternalsSymbol]() {
        return {
            fromClientJson: (json)=>{
                const providedCheckString = JSON.stringify((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["omit"])(json, []));
                const existing = allClientApps.get(json.uniqueIdentifier);
                if (existing) {
                    const [existingCheckString, clientApp] = existing;
                    if (existingCheckString !== providedCheckString) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("The provided app JSON does not match the configuration of the existing client app with the same unique identifier", {
                            providedObj: json,
                            existingString: existingCheckString
                        });
                    }
                    return clientApp;
                }
                return new __StackClientAppImpl({
                    ...json,
                    checkString: providedCheckString
                });
            }
        };
    }
    get [stackAppInternalsSymbol]() {
        return {
            toClientJson: ()=>{
                if (!("publishableClientKey" in this._interface.options)) {
                    throw Error("Cannot serialize to JSON from an application without a publishable client key");
                }
                return {
                    baseUrl: this._interface.options.baseUrl,
                    projectId: this.projectId,
                    publishableClientKey: this._interface.options.publishableClientKey,
                    tokenStore: this._tokenStoreOptions,
                    urls: this._urlOptions,
                    uniqueIdentifier: this._uniqueIdentifier
                };
            },
            setCurrentUser: (userJsonPromise)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronously"])(this._currentUserCache.forceSetCachedValueAsync([
                    getTokenStore(this._tokenStoreOptions)
                ], userJsonPromise));
            }
        };
    }
};
var _StackServerAppImpl = class extends _StackClientAppImpl {
    // TODO override the client user cache to use the server user cache, so we save some requests
    _currentServerUserCache = createCacheByTokenStore(async (tokenStore)=>{
        const user = await this._interface.getServerUserByToken(tokenStore);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].or(user, null);
    });
    _serverUsersCache = createCache(async ()=>{
        return await this._interface.listUsers();
    });
    _serverUserCache = createCache(async ([userId])=>{
        const user = await this._interface.getServerUserById(userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].or(user, null);
    });
    _serverTeamsCache = createCache(async ()=>{
        return await this._interface.listTeams();
    });
    _serverTeamMembersCache = createCache(async ([teamId])=>{
        return await this._interface.listTeamMembers(teamId);
    });
    _serverTeamPermissionDefinitionsCache = createCache(async ()=>{
        return await this._interface.listPermissionDefinitions();
    });
    _serverTeamUserPermissionsCache = createCache(async ([teamId, userId, type, direct])=>{
        return await this._interface.listTeamMemberPermissions({
            teamId,
            userId,
            type,
            direct
        });
    });
    constructor(options){
        super("interface" in options ? {
            interface: options.interface,
            tokenStore: options.tokenStore,
            urls: options.urls
        } : {
            interface: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackServerInterface"]({
                baseUrl: options.baseUrl ?? getDefaultBaseUrl(),
                projectId: options.projectId ?? getDefaultProjectId(),
                clientVersion,
                publishableClientKey: options.publishableClientKey ?? getDefaultPublishableClientKey(),
                secretServerKey: options.secretServerKey ?? getDefaultSecretServerKey()
            }),
            tokenStore: options.tokenStore,
            urls: options.urls ?? {}
        });
    }
    _serverUserFromJson(json) {
        if (json === null) return null;
        const app = this;
        return {
            ...this._userFromJson(json),
            serverMetadata: json.serverMetadata,
            async delete () {
                const res = await app._interface.deleteServerUser(this.id);
                await app._refreshUsers();
                return res;
            },
            async update (update) {
                const res = await app._interface.setServerUserCustomizableData(this.id, update);
                await app._refreshUsers();
                return res;
            },
            getClientUser () {
                return app._userFromJson(json);
            },
            async grantPermission (scope, permissionId) {
                await app._interface.grantTeamUserPermission(scope.id, json.id, permissionId, "team");
                for (const direct of [
                    true,
                    false
                ]){
                    await app._serverTeamUserPermissionsCache.refresh([
                        scope.id,
                        json.id,
                        "team",
                        direct
                    ]);
                }
            },
            async revokePermission (scope, permissionId) {
                await app._interface.revokeTeamUserPermission(scope.id, json.id, permissionId, "team");
                for (const direct of [
                    true,
                    false
                ]){
                    await app._serverTeamUserPermissionsCache.refresh([
                        scope.id,
                        json.id,
                        "team",
                        direct
                    ]);
                }
            },
            async getTeam (teamId) {
                const teams = await this.listTeams();
                return teams.find((t)=>t.id === teamId) ?? null;
            },
            useTeam (teamId) {
                const teams = this.useTeams();
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
                    return teams.find((t)=>t.id === teamId) ?? null;
                }, [
                    teams,
                    teamId
                ]);
            },
            onTeamChange (teamId, callback) {
                return this.onTeamsChange((teams)=>{
                    const team = teams.find((t)=>t.id === teamId) ?? null;
                    callback(team);
                });
            },
            async listTeams () {
                const teams = await app._serverTeamsCache.getOrWait([
                    getTokenStore(app._tokenStoreOptions)
                ], "write-only");
                return teams.map((json2)=>app._serverTeamFromJson(json2));
            },
            useTeams () {
                const teams = useCache(app._serverTeamsCache, [
                    getTokenStore(app._tokenStoreOptions)
                ], "user.useTeams()");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>teams.map((json2)=>app._serverTeamFromJson(json2)), [
                    teams
                ]);
            },
            onTeamsChange (callback) {
                return app._serverTeamsCache.onChange([
                    getTokenStore(app._tokenStoreOptions)
                ], (value, oldValue)=>{
                    callback(value.map((json2)=>app._serverTeamFromJson(json2)), oldValue?.map((json2)=>app._serverTeamFromJson(json2)));
                });
            },
            async listPermissions (scope, options) {
                const permissions = await app._serverTeamUserPermissionsCache.getOrWait([
                    scope.id,
                    json.id,
                    "team",
                    !!options?.direct
                ], "write-only");
                return permissions.map((json2)=>app._serverPermissionFromJson(json2));
            },
            usePermissions (scope, options) {
                const permissions = useCache(app._serverTeamUserPermissionsCache, [
                    scope.id,
                    json.id,
                    "team",
                    !!options?.direct
                ], "user.usePermissions()");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>permissions.map((json2)=>app._serverPermissionFromJson(json2)), [
                    permissions
                ]);
            },
            usePermission (scope, permissionId) {
                const permissions = this.usePermissions(scope);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>permissions.find((p)=>p.id === permissionId) ?? null, [
                    permissions,
                    permissionId
                ]);
            },
            async getPermission (scope, permissionId) {
                const permissions = await this.listPermissions(scope);
                return permissions.find((p)=>p.id === permissionId) ?? null;
            },
            async hasPermission (scope, permissionId) {
                const permissions = await this.listPermissions(scope);
                return permissions.some((p)=>p.id === permissionId);
            },
            toJson () {
                return json;
            }
        };
    }
    _currentServerUserFromJson(json, tokenStore) {
        if (json === null) return null;
        const app = this;
        const nonCurrentServerUser = this._serverUserFromJson(json);
        const currentUser = {
            ...nonCurrentServerUser,
            tokenStore,
            async delete () {
                const res = await nonCurrentServerUser.delete();
                await app._refreshUser(tokenStore);
                return res;
            },
            async updateSelectedTeam (team) {
                await this.update({
                    selectedTeamId: team?.id ?? null
                });
            },
            async update (update) {
                const res = await nonCurrentServerUser.update(update);
                await app._refreshUser(tokenStore);
                return res;
            },
            signOut () {
                return app._signOut(tokenStore);
            },
            getClientUser () {
                return app._currentUserFromJson(json, tokenStore);
            },
            sendVerificationEmail () {
                return app._sendVerificationEmail(tokenStore);
            },
            updatePassword (options) {
                return app._updatePassword(options, tokenStore);
            }
        };
        if (this.isInternalProject()) {
            const internalUser = {
                ...currentUser,
                createProject (newProject) {
                    return app._createProject(newProject);
                },
                listOwnedProjects () {
                    return app._listOwnedProjects();
                },
                useOwnedProjects () {
                    return app._useOwnedProjects();
                },
                onOwnedProjectsChange (callback) {
                    return app._onOwnedProjectsChange(callback);
                }
            };
            Object.freeze(internalUser);
            return internalUser;
        } else {
            Object.freeze(currentUser);
            return currentUser;
        }
    }
    _serverTeamMemberFromJson(json) {
        if (json === null) return null;
        const app = this;
        return {
            ...app._teamMemberFromJson(json),
            async getUser () {
                const user = app._serverUserFromJson(await app._serverUserCache.getOrWait([
                    json.userId
                ], "write-only"));
                if (!user) throw new Error(`User ${json.userId} not found`);
                return user;
            }
        };
    }
    _serverTeamFromJson(json) {
        const app = this;
        return {
            id: json.id,
            displayName: json.displayName,
            createdAt: new Date(json.createdAtMillis),
            async listMembers () {
                return (await app._interface.listTeamMembers(json.id)).map((u)=>app._serverTeamMemberFromJson(u));
            },
            async update (update) {
                await app._interface.updateTeam(json.id, update);
                await app._serverTeamsCache.refresh([]);
            },
            async delete () {
                await app._interface.deleteTeam(json.id);
                await app._serverTeamsCache.refresh([]);
            },
            useMembers () {
                const result = useCache(app._serverTeamMembersCache, [
                    json.id
                ], "team.useUsers()");
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>result.map((u)=>app._serverTeamMemberFromJson(u)), [
                    result
                ]);
            },
            async addUser (userId) {
                await app._interface.addUserToTeam({
                    teamId: json.id,
                    userId
                });
                await app._serverTeamMembersCache.refresh([
                    json.id
                ]);
            },
            async removeUser (userId) {
                await app._interface.removeUserFromTeam({
                    teamId: json.id,
                    userId
                });
                await app._serverTeamMembersCache.refresh([
                    json.id
                ]);
            },
            toJson () {
                return json;
            }
        };
    }
    async getServerUser() {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const userJson = await this._currentServerUserCache.getOrWait([
            tokenStore
        ], "write-only");
        return this._currentServerUserFromJson(userJson, tokenStore);
    }
    async getServerUserById(userId) {
        const json = await this._serverUserCache.getOrWait([
            userId
        ], "write-only");
        return this._serverUserFromJson(json);
    }
    useServerUser(options) {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const userJson = useCache(this._currentServerUserCache, [
            tokenStore
        ], "useServerUser()");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
            if (options?.required && userJson === null) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])(this.redirectToSignIn());
            }
            return this._currentServerUserFromJson(userJson, tokenStore);
        }, [
            userJson,
            tokenStore,
            options?.required
        ]);
    }
    onServerUserChange(callback) {
        this._ensurePersistentTokenStore();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        return this._currentServerUserCache.onChange([
            tokenStore
        ], (userJson)=>{
            callback(this._currentServerUserFromJson(userJson, tokenStore));
        });
    }
    async listServerUsers() {
        const json = await this._serverUsersCache.getOrWait([], "write-only");
        return json.map((j)=>this._serverUserFromJson(j));
    }
    useServerUsers() {
        const json = useCache(this._serverUsersCache, [], "useServerUsers()");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
            return json.map((j)=>this._serverUserFromJson(j));
        }, [
            json
        ]);
    }
    onServerUsersChange(callback) {
        return this._serverUsersCache.onChange([], (users)=>{
            callback(users.map((j)=>this._serverUserFromJson(j)));
        });
    }
    async listPermissionDefinitions() {
        return await this._serverTeamPermissionDefinitionsCache.getOrWait([], "write-only");
    }
    usePermissionDefinitions() {
        return useCache(this._serverTeamPermissionDefinitionsCache, [], "usePermissions()");
    }
    _serverPermissionFromJson(json) {
        return {
            ...this._permissionFromJson(json),
            __databaseUniqueId: json.__databaseUniqueId,
            description: json.description,
            containPermissionIds: json.containPermissionIds
        };
    }
    async createPermissionDefinition(data) {
        const permission = await this._serverPermissionFromJson(await this._interface.createPermissionDefinition(data));
        await this._serverTeamPermissionDefinitionsCache.refresh([]);
        return permission;
    }
    async updatePermissionDefinition(permissionId, data) {
        await this._interface.updatePermissionDefinition(permissionId, data);
        await this._serverTeamPermissionDefinitionsCache.refresh([]);
    }
    async deletePermissionDefinition(permissionId) {
        await this._interface.deletePermissionDefinition(permissionId);
        await this._serverTeamPermissionDefinitionsCache.refresh([]);
    }
    async listTeams() {
        const teams = await this._serverTeamsCache.getOrWait([], "write-only");
        return teams.map((t)=>this._serverTeamFromJson(t));
    }
    async createTeam(data) {
        const team = await this._interface.createTeam(data);
        await this._serverTeamsCache.refresh([]);
        return this._serverTeamFromJson(team);
    }
    useTeams() {
        const teams = useCache(this._serverTeamsCache, [], "useServerTeams()");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
            return teams.map((t)=>this._serverTeamFromJson(t));
        }, [
            teams
        ]);
    }
    async getTeam(teamId) {
        const teams = await this.listTeams();
        return teams.find((t)=>t.id === teamId) ?? null;
    }
    useTeam(teamId) {
        const teams = this.useTeams();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
            return teams.find((t)=>t.id === teamId) ?? null;
        }, [
            teams,
            teamId
        ]);
    }
    async _refreshUser(tokenStore) {
        await Promise.all([
            super._refreshUser(tokenStore),
            this._currentServerUserCache.refresh([
                tokenStore
            ])
        ]);
    }
    async _refreshUsers() {
        await Promise.all([
            super._refreshUsers(),
            this._serverUsersCache.refresh([])
        ]);
    }
};
var _StackAdminAppImpl = class extends _StackServerAppImpl {
    _adminProjectCache = createCache(async ()=>{
        return await this._interface.getProject();
    });
    _apiKeySetsCache = createCache(async ()=>{
        return await this._interface.listApiKeySets();
    });
    constructor(options){
        super({
            interface: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$adminInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAdminInterface"]({
                baseUrl: options.baseUrl ?? getDefaultBaseUrl(),
                projectId: options.projectId ?? getDefaultProjectId(),
                clientVersion,
                ..."projectOwnerTokens" in options ? {
                    projectOwnerTokens: options.projectOwnerTokens
                } : {
                    publishableClientKey: options.publishableClientKey ?? getDefaultPublishableClientKey(),
                    secretServerKey: options.secretServerKey ?? getDefaultSecretServerKey(),
                    superSecretAdminKey: options.superSecretAdminKey ?? getDefaultSuperSecretAdminKey()
                }
            }),
            tokenStore: options.tokenStore,
            urls: options.urls
        });
    }
    _createApiKeySetBaseFromJson(data) {
        const app = this;
        return {
            id: data.id,
            description: data.description,
            expiresAt: new Date(data.expiresAtMillis),
            manuallyRevokedAt: data.manuallyRevokedAtMillis ? new Date(data.manuallyRevokedAtMillis) : null,
            createdAt: new Date(data.createdAtMillis),
            isValid () {
                return this.whyInvalid() === null;
            },
            whyInvalid () {
                if (this.expiresAt.getTime() < Date.now()) return "expired";
                if (this.manuallyRevokedAt) return "manually-revoked";
                return null;
            },
            async revoke () {
                const res = await app._interface.revokeApiKeySetById(data.id);
                await app._refreshApiKeySets();
                return res;
            }
        };
    }
    _createApiKeySetFromJson(data) {
        return {
            ...this._createApiKeySetBaseFromJson(data),
            publishableClientKey: data.publishableClientKey ? {
                lastFour: data.publishableClientKey.lastFour
            } : null,
            secretServerKey: data.secretServerKey ? {
                lastFour: data.secretServerKey.lastFour
            } : null,
            superSecretAdminKey: data.superSecretAdminKey ? {
                lastFour: data.superSecretAdminKey.lastFour
            } : null
        };
    }
    _createApiKeySetFirstViewFromJson(data) {
        return {
            ...this._createApiKeySetBaseFromJson(data),
            publishableClientKey: data.publishableClientKey,
            secretServerKey: data.secretServerKey,
            superSecretAdminKey: data.superSecretAdminKey
        };
    }
    async getProjectAdmin() {
        return this._projectAdminFromJson(await this._adminProjectCache.getOrWait([], "write-only"), this._interface, ()=>this._refreshProject());
    }
    useProjectAdmin() {
        const json = useCache(this._adminProjectCache, [], "useProjectAdmin()");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>this._projectAdminFromJson(json, this._interface, ()=>this._refreshProject()), [
            json
        ]);
    }
    onProjectAdminChange(callback) {
        return this._adminProjectCache.onChange([], (project)=>{
            callback(this._projectAdminFromJson(project, this._interface, ()=>this._refreshProject()));
        });
    }
    async listApiKeySets() {
        const json = await this._apiKeySetsCache.getOrWait([], "write-only");
        return json.map((j)=>this._createApiKeySetFromJson(j));
    }
    useApiKeySets() {
        const json = useCache(this._apiKeySetsCache, [], "useApiKeySets()");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
            return json.map((j)=>this._createApiKeySetFromJson(j));
        }, [
            json
        ]);
    }
    onApiKeySetsChange(callback) {
        return this._apiKeySetsCache.onChange([], (apiKeySets)=>{
            callback(apiKeySets.map((j)=>this._createApiKeySetFromJson(j)));
        });
    }
    async createApiKeySet(options) {
        const json = await this._interface.createApiKeySet(options);
        await this._refreshApiKeySets();
        return this._createApiKeySetFirstViewFromJson(json);
    }
    async _refreshProject() {
        await Promise.all([
            super._refreshProject(),
            this._adminProjectCache.refresh([])
        ]);
    }
    async _refreshApiKeySets() {
        await this._apiKeySetsCache.refresh([]);
    }
};
var StackClientApp = _StackClientAppImpl;
var StackServerApp = _StackServerAppImpl;
var StackAdminApp = _StackAdminAppImpl;
;
 //# sourceMappingURL=stack-app.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/hooks.ts
__turbopack_context__.s([
    "useStackApp",
    ()=>useStackApp,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
function useUser(options = {}) {
    const stackApp = useStackApp(options);
    if (options.projectIdMustMatch && stackApp.projectId !== options.projectIdMustMatch) {
        throw new Error("Unexpected project ID in useStackApp: " + stackApp.projectId);
    }
    if (options.projectIdMustMatch === "internal") {
        return stackApp.useUser(options);
    } else {
        return stackApp.useUser(options);
    }
}
function useStackApp(options = {}) {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2d$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackContext"]);
    if (context === null) {
        throw new Error("useStackApp must be used within a StackProvider");
    }
    const stackApp = context.app;
    if (options.projectIdMustMatch && stackApp.projectId !== options.projectIdMustMatch) {
        throw new Error("Unexpected project ID in useStackApp: " + stackApp.projectId);
    }
    return stackApp;
}
;
 //# sourceMappingURL=hooks.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackContext",
    ()=>StackContext,
    "StackProviderClient",
    ()=>StackProviderClient,
    "UserSetter",
    ()=>UserSetter
]);
// src/providers/stack-provider-client.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/stack-app.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/hooks.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
var StackContext = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createContext(null);
function StackProviderClient(props) {
    const appJson = props.appJson;
    const app = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackClientApp"][__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stackAppInternalsSymbol"]].fromClientJson(appJson);
    if ("TURBOPACK compile-time truthy", 1) {
        globalThis.stackApp = app;
    }
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StackContext.Provider, {
        value: {
            app
        },
        children: props.children
    });
}
function UserSetter(props) {
    const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$hooks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStackApp"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const promise = (async ()=>await props.userJsonPromise)();
        app[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stackAppInternalsSymbol"]].setCurrentUser(promise);
    }, []);
    return null;
}
;
 //# sourceMappingURL=stack-provider-client.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/constants.tsx
__turbopack_context__.s([
    "BORDER_RADIUS",
    ()=>BORDER_RADIUS,
    "DEFAULT_COLORS",
    ()=>DEFAULT_COLORS,
    "FONT_FAMILY",
    ()=>FONT_FAMILY,
    "FONT_SIZES",
    ()=>FONT_SIZES,
    "LINE_HEIGHTS",
    ()=>LINE_HEIGHTS,
    "LINK_COLORS",
    ()=>LINK_COLORS,
    "PRIMARY_FONT_COLORS",
    ()=>PRIMARY_FONT_COLORS,
    "SECONDARY_FONT_COLORS",
    ()=>SECONDARY_FONT_COLORS,
    "SELECTED_BACKGROUND_COLORS",
    ()=>SELECTED_BACKGROUND_COLORS
]);
var FONT_SIZES = {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "md": "1rem",
    "lg": "1.25rem",
    "xl": "1.5rem"
};
var LINE_HEIGHTS = {
    "xs": "1rem",
    "sm": "1.25rem",
    "md": "1.5rem",
    "lg": "1.75rem",
    "xl": "2rem"
};
var FONT_FAMILY = 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
var PRIMARY_FONT_COLORS = {
    "dark": "white",
    "light": "black"
};
var SECONDARY_FONT_COLORS = {
    "dark": "#a8a8a8",
    "light": "#737373"
};
var SELECTED_BACKGROUND_COLORS = {
    "dark": "rgba(255, 255, 255, 0.1)",
    "light": "rgba(0, 0, 0, 0.04)"
};
var LINK_COLORS = {
    "dark": "#fff",
    "light": "#000"
};
var BORDER_RADIUS = "0.375rem";
var DEFAULT_COLORS = {
    dark: {
        primaryColor: "#570df8",
        secondaryColor: "#404040",
        backgroundColor: "black",
        neutralColor: "#27272a"
    },
    light: {
        primaryColor: "#570df8",
        secondaryColor: "#e0e0e0",
        backgroundColor: "white",
        neutralColor: "#e4e4e7"
    }
};
;
 //# sourceMappingURL=constants.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackDesignProvider",
    ()=>StackDesignProvider,
    "useDesign",
    ()=>useDesign
]);
// src/providers/design-provider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
var DesignContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(void 0);
var defaultBreakpoints = {
    xs: 400,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536
};
function StackDesignProvider(props) {
    const designValue = {
        colors: {
            dark: {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_COLORS"].dark,
                ...props.colors?.dark
            },
            light: {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_COLORS"].light,
                ...props.colors?.light
            }
        },
        breakpoints: {
            ...defaultBreakpoints,
            ...props.breakpoints
        }
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DesignContext.Provider, {
        value: designValue,
        children: props.children
    });
}
function useDesign() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(DesignContext);
    if (!context) {
        throw new Error("useDesign must be used within a StackTheme");
    }
    return context;
}
;
 //# sourceMappingURL=design-provider.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/loading-indicator.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components-core/loading-indicator.tsx
__turbopack_context__.s([
    "default",
    ()=>LoadingIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
var l7 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`
  33% { background-size: calc(100%/3) 0%, calc(100%/3) 100%, calc(100%/3) 100%; }
  50% { background-size: calc(100%/3) 100%, calc(100%/3) 0%, calc(100%/3) 100%; }
  66% { background-size: calc(100%/3) 100%, calc(100%/3) 100%, calc(100%/3) 0%; }
`;
var StyledLoadingIndicator = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].div`
  width: ${(props)=>props.$size || 36}px;
  aspect-ratio: 4;
  background: 
    var(--_g) 0% 50%, 
    var(--_g) 50% 50%, 
    var(--_g) 100% 50%;
  background-size: calc(100%/3) 100%;
  animation: ${l7} 1s infinite linear;

  --_g: no-repeat radial-gradient(circle closest-side, ${(props)=>props.$color.light} 90%, #0000);

  html[data-stack-theme='dark'] & {
    --_g: no-repeat radial-gradient(circle closest-side, ${(props)=>props.$color.dark} 90%, #0000);
  }
`;
function LoadingIndicator(props) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledLoadingIndicator, {
        $size: props.size,
        $color: props.color
    });
}
;
 //# sourceMappingURL=loading-indicator.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/button.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
// src/components-core/button.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$color$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/color/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$loading$2d$indicator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/loading-indicator.js [app-ssr] (ecmascript)");
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
function getColors({ propsColor, colors, variant }) {
    let bgColor;
    switch(variant){
        case "primary":
            {
                bgColor = colors.primaryColor;
                break;
            }
        case "secondary":
            {
                bgColor = colors.secondaryColor;
                break;
            }
        case "warning":
            {
                bgColor = "#ff4500";
                break;
            }
    }
    if (propsColor) {
        bgColor = propsColor;
    }
    const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$color$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(bgColor);
    const pc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$color$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(colors.primaryColor);
    const changeColor = (value)=>{
        return c.hsl(c.hue(), c.saturationl(), c.lightness() + value).toString();
    };
    const getAlpha = (alpha)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$color$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(pc.isDark() ? "white" : "black").alpha(alpha).toString();
    };
    if (c.alpha() === 0) {
        return {
            bgColor: "transparent",
            hoverBgColor: getAlpha(0.1),
            activeBgColor: getAlpha(0.2),
            textColor: colors.primaryColor
        };
    } else if (c.isLight()) {
        return {
            bgColor,
            hoverBgColor: changeColor(-10),
            activeBgColor: changeColor(-20),
            textColor: "black"
        };
    } else {
        return {
            bgColor,
            hoverBgColor: changeColor(10),
            activeBgColor: changeColor(20),
            textColor: "white"
        };
    }
}
var StyledButton = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].button`
  border: 0;
  border-radius: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BORDER_RADIUS"]};
  padding: ${(props)=>{
    switch(props.$size){
        case "sm":
            {
                return "0rem 0.75rem";
            }
        case "md":
            {
                return "0rem 1rem";
            }
        case "lg":
            {
                return "0rem 2rem";
            }
    }
}};
  height: ${(props)=>{
    switch(props.$size){
        case "sm":
            {
                return "2rem";
            }
        case "md":
            {
                return "2.5rem";
            }
        case "lg":
            {
                return "3rem";
            }
    }
}};
  font-family: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_FAMILY"]};
  font-size: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_SIZES"].md};
  opacity: ${(props)=>props.disabled ? 0.5 : 1};
  transition: background-color 0.05s;
  cursor: pointer;
  position: relative;
  &:disabled {
    cursor: auto;
    opacity: 0.5;
  }

  background-color: ${(props)=>props.$colors.light.bgColor};
  color: ${(props)=>props.$colors.light.textColor};
  &:not([disabled]) {
    &:active,&:hover:active {
      background-color: ${(props)=>props.$colors.light.activeBgColor};
    }
    &:hover {
      background-color: ${(props)=>props.$colors.light.hoverBgColor};
    }
  }

  html[data-stack-theme='dark'] & {
    background-color: ${(props)=>props.$colors.dark.bgColor};
    color: ${(props)=>props.$colors.dark.textColor};
    &:not([disabled]) {
      &:active,&:hover:active {
        background-color: ${(props)=>props.$colors.dark.activeBgColor};
      }
      &:hover {
        background-color: ${(props)=>props.$colors.dark.hoverBgColor};
      }
    }
  }
`;
var Button = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ variant = "primary", size = "md", loading = false, ...props }, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    const { dark, light } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return {
            dark: getColors({
                propsColor: props.color,
                colors: colors.dark,
                variant
            }),
            light: getColors({
                propsColor: props.color,
                colors: colors.light,
                variant
            })
        };
    }, [
        props.color,
        colors,
        variant
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(StyledButton, {
        ref,
        $size: size,
        $loading: loading,
        $colors: {
            dark,
            light
        },
        ...props,
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                style: {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    visibility: loading ? "visible" : "hidden"
                },
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$loading$2d$indicator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    color: {
                        light: light.textColor,
                        dark: dark.textColor
                    }
                })
            }),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("span", {
                style: {
                    visibility: loading ? "hidden" : "visible",
                    whiteSpace: "nowrap"
                },
                children: props.children
            })
        ]
    });
});
Button.displayName = "Button";
;
 //# sourceMappingURL=button.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/container.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Container",
    ()=>Container
]);
// src/components-core/container.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
var OuterContainer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
var InnerContainer = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].div`
  width: 100%;
  @media (min-width: ${(props)=>props.$breakpoint}px) {
    width: ${(props)=>props.$breakpoint}px;
  }
`;
function Container({ size = "md", ...props }) {
    const { breakpoints } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(OuterContainer, {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(InnerContainer, {
            $breakpoint: typeof size === "number" ? size : breakpoints[size],
            ...props,
            children: props.children
        })
    });
}
;
 //# sourceMappingURL=container.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/separator.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
// src/components-core/separator.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@radix-ui/react-separator/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
var StyledSeparator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"])`
  flex-shrink: 0;
  ${(props)=>props.$orientation === "horizontal" ? "height: 1px; width: 100%;" : "height: 100%; width: 1px;"}
  
  background-color: ${(props)=>props.$color.light.neutralColor};

  html[data-stack-theme='dark'] & {
    background-color: ${(props)=>props.$color.dark.neutralColor};
  }
`;
var Separator = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ orientation = "horizontal", decorative = true, ...props }, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledSeparator, {
        ref,
        decorative,
        $orientation: orientation,
        $color: colors,
        ...props
    });
});
Separator.displayName = "Separator";
;
 //# sourceMappingURL=separator.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/input.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
// src/components-core/input.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
var StyledInput = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].input`
  font-family: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_FAMILY"]};
  font-size: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_SIZES"].md};
  height: 2.5rem;
  border-radius: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BORDER_RADIUS"]};
  background-color: transparent;
  border: 1px solid;
  padding: 0rem 1rem;
  &:disabled {
    cursor: auto;
    opacity: 0.5;
  }
  &[type=file]::file-selector-button{
    border: none;
    background-color: transparent;
    height: 2.5rem;
    margin-right: 0.5rem;
    padding: 0;
  }

  border-color: ${(props)=>props.$colors.light.neutralColor};
  color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIMARY_FONT_COLORS"].light};
  &::placeholder {
    color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECONDARY_FONT_COLORS"].light};
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${(props)=>props.$colors.light.primaryColor};
  }
  &[type=file] {
    color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECONDARY_FONT_COLORS"].light};
  }
  &[type=file]::file-selector-button{
    color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIMARY_FONT_COLORS"].light};
  }

  html[data-stack-theme='dark'] & {
    border-color: ${(props)=>props.$colors.dark.neutralColor};
    color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIMARY_FONT_COLORS"].dark};
    &::placeholder {
      color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECONDARY_FONT_COLORS"].dark};
    }
    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px ${(props)=>props.$colors.dark.primaryColor};
    }
    &[type=file] {
      color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECONDARY_FONT_COLORS"].dark};
    }
    &[type=file]::file-selector-button{
      color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIMARY_FONT_COLORS"].dark};
    }
  }
`;
var Input = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef((props, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledInput, {
        ref,
        $colors: colors,
        ...props
    });
});
Input.displayName = "Input";
;
 //# sourceMappingURL=input.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/link.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link
]);
// src/components-core/link.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
var StyledNextLink = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])`
  font-size: ${(props)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_SIZES"][props.$size]};
  line-height: ${(props)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINE_HEIGHTS"][props.$size]};
  font-weight: 500;
  font-family: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_FAMILY"]};
  text-decoration: underline;
  margin: 0;
  padding: 0;

  color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINK_COLORS"].light};

  html[data-stack-theme='dark'] & {
    color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINK_COLORS"].dark};
  }
`;
var Link = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ size = "md", href, ...props }, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledNextLink, {
        $size: size,
        href,
        style: props.style,
        children: props.children
    });
});
;
 //# sourceMappingURL=link.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/label.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
// src/components-core/label.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@radix-ui/react-label/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
var Primitive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"])`
  font-size: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_SIZES"].sm};
  line-height: 1;
  font-weight: 500;
  font-family: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_FAMILY"]};
  display: block;
  margin-bottom: 0.5rem;

  color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECONDARY_FONT_COLORS"].light};

  html[data-stack-theme='dark'] & {
    color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECONDARY_FONT_COLORS"].dark};
  }
`;
var Label = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef((props, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Primitive, {
        ref,
        ...props
    });
});
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
;
 //# sourceMappingURL=label.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/text.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Text",
    ()=>Text
]);
// src/components-core/text.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/objects.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
var components = [
    "p",
    "h6",
    "h5",
    "h4",
    "h3",
    "h2",
    "h1"
];
var StyledComponents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["typedFromEntries"])(components.map((component)=>{
    return [
        component,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(component)`
      font-family: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_FAMILY"]};
      font-size: ${(props)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FONT_SIZES"][props.$size]};
      line-height: ${(props)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LINE_HEIGHTS"][props.$size]};
      margin: 0;
      padding: 0;
      color: ${(props)=>props.$textColor.light};
      
      html[data-stack-theme='dark'] & {
        color: ${(props)=>props.$textColor.dark};
      }
    `
    ];
}));
var Text = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ variant = "primary", size = "md", as = "p", ...props }, ref)=>{
    let textColor;
    switch(variant){
        case "primary":
            {
                textColor = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIMARY_FONT_COLORS"];
                break;
            }
        case "secondary":
            {
                textColor = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SECONDARY_FONT_COLORS"];
                break;
            }
        case "warning":
            {
                textColor = {
                    light: "#b33b1d",
                    dark: "#ff7b5c"
                };
                break;
            }
        case "success":
            {
                textColor = {
                    light: "#3da63d",
                    dark: "#3da63d"
                };
                break;
            }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"])(StyledComponents[as], {
        $size: size,
        $textColor: textColor,
        ...props,
        ref
    });
});
Text.displayName = "Text";
;
 //# sourceMappingURL=text.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/card.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader
]);
// src/components-core/card.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
var StyledCard = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].div`
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
  padding: 1.5rem;

  border: 1px solid ${(props)=>props.$colors.light.neutralColor};
  background-color: ${(props)=>props.$colors.light.backgroundColor};

  html[data-stack-theme='dark'] & {
    border-color: ${(props)=>props.$colors.dark.neutralColor};
    background-color: ${(props)=>props.$colors.dark.backgroundColor};
  }
`;
var StyledCardHeader = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.5rem;
`;
var StyledCardContent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].div`
`;
var StyledCardFooter = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].div`
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
`;
var Card = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledCard, {
        ref,
        ...props,
        $colors: colors
    });
});
Card.displayName = "Card";
var CardHeader = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledCardHeader, {
        ref,
        ...props
    }));
CardHeader.displayName = "CardHeader";
var CardContent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledCardContent, {
        ref,
        ...props
    }));
CardContent.displayName = "CardContent";
var CardFooter = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledCardFooter, {
        ref,
        ...props
    }));
CardFooter.displayName = "CardFooter";
;
 //# sourceMappingURL=card.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/popover.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components-core/popover.tsx
__turbopack_context__.s([
    "Popover",
    ()=>Popover,
    "PopoverContent",
    ()=>PopoverContent,
    "PopoverTrigger",
    ()=>PopoverTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@radix-ui/react-popover/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
;
;
var Popover = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
var PopoverTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"];
var StyledContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"])`
  z-index: 50;
  width: 18rem;
  border-radius: 0.375rem;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  outline: none;

  border: 1px solid ${({ $colors })=>$colors.light.neutralColor};
  background-color: ${({ $colors })=>$colors.light.backgroundColor};

  html[data-stack-theme='dark'] & {
    border-color: ${({ $colors })=>$colors.dark.neutralColor};
    background-color: ${({ $colors })=>$colors.dark.backgroundColor};
  }
`;
var PopoverContent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef(({ align = "center", sideOffset = 4, ...props }, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledContent, {
            $colors: colors,
            ref,
            align,
            sideOffset,
            ...props
        })
    });
});
PopoverContent.displayName = "PopoverContent";
;
 //# sourceMappingURL=popover.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/dropdown.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger
]);
// src/components-core/dropdown.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
;
var DropdownMenu = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
var StyledTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"])`
  all: unset;
  &:focus {
    outline: none;
    box-shadow: 0;
  }
  &:hover {
    cursor: pointer;
  }
`;
var DropdownMenuTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledTrigger, {
        ref,
        ...props
    }));
var StyledContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"])`
  z-index: 50;
  min-width: 8rem;
  overflow: hidden;
  border-radius: 4px;
  padding: 0.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  border: 1px solid ${({ $colors })=>$colors.light.neutralColor};
  background: ${({ $colors })=>$colors.light.backgroundColor};

  html[data-stack-theme='dark'] & {
    border-color: ${({ $colors })=>$colors.dark.neutralColor};
    background: ${({ $colors })=>$colors.dark.backgroundColor};
  }
`;
var DropdownMenuContent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, sideOffset = 4, ...props }, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledContent, {
            $colors: colors,
            sideOffset,
            ref,
            ...props
        })
    });
});
DropdownMenuContent.displayName = "DropdownMenuContent";
var StyledItem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Item"])`
  display: flex;
  cursor: default;
  align-items: center;
  border-radius: 4px;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: color 0.2s ease;
  &:focus {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
  ${({ $inset })=>$inset && "padding-left: 2rem;"}

  &:hover {
    background-color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SELECTED_BACKGROUND_COLORS"].light};
  }

  html[data-stack-theme='dark'] & {
    &:hover {
      background-color: ${__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SELECTED_BACKGROUND_COLORS"].dark};
    }
  }
`;
var DropdownMenuItem = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, inset, ...props }, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledItem, {
        ref,
        ...props,
        $inset: inset
    });
});
DropdownMenuItem.displayName = "DropdownMenuItem";
var StyledLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"])`
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  ${({ inset })=>inset && "padding-left: 2rem;"}
`;
var DropdownMenuLabel = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, inset, ...props }, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledLabel, {
        ref,
        ...props,
        inset
    }));
DropdownMenuLabel.displayName = "DropdownMenuLabel";
var StyledSeparator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"])`
  margin: 0.25rem -0.25rem;
  height: 1px;
  background-color: ${({ $colors })=>$colors.light.neutralColor};

  html[data-stack-theme='dark'] & {
    background-color: ${({ $colors })=>$colors.dark.neutralColor};
  }
`;
var DropdownMenuSeparator = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledSeparator, {
        ref,
        ...props,
        $colors: colors
    });
});
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
;
 //# sourceMappingURL=dropdown.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/avatar.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components-core/avatar.tsx
__turbopack_context__.s([
    "Avatar",
    ()=>Avatar,
    "AvatarFallback",
    ()=>AvatarFallback,
    "AvatarImage",
    ()=>AvatarImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@radix-ui/react-avatar/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
;
;
var StyledAvatar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"])`
  position: relative;
  display: flex;
  height: 2rem;
  width: 2rem;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 9999px;
`;
var Avatar = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledAvatar, {
        ref,
        className,
        ...props
    }));
Avatar.displayName = "Avatar";
var StyledAvatarImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Image"])`
  aspect-ratio: 1 / 1;
  height: 100%;
  width: 100%;
`;
var AvatarImage = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledAvatarImage, {
        ref,
        className,
        ...props
    }));
AvatarImage.displayName = "AvatarImage";
var StyledAvatarFallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fallback"])`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  
  background-color: ${({ $colors })=>$colors.light.secondaryColor};

  html[data-stack-theme='dark'] & {
    background-color: ${({ $colors })=>$colors.dark.secondaryColor};
  }
`;
var AvatarFallback = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledAvatarFallback, {
        ref,
        className,
        $colors: colors,
        ...props
    });
});
AvatarFallback.displayName = "AvatarFallback";
;
 //# sourceMappingURL=avatar.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/collapsible.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Collapsible",
    ()=>Collapsible,
    "CollapsibleContent",
    ()=>CollapsibleContent2,
    "CollapsibleTrigger",
    ()=>CollapsibleTrigger2
]);
// src/components-core/collapsible.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@radix-ui/react-collapsible/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
"use client";
;
var Collapsible = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
var CollapsibleTrigger2 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CollapsibleTrigger"];
var CollapsibleContent2 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$collapsible$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CollapsibleContent"];
;
 //# sourceMappingURL=collapsible.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar,
    "AvatarFallback",
    ()=>AvatarFallback,
    "AvatarImage",
    ()=>AvatarImage,
    "Button",
    ()=>Button,
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "Collapsible",
    ()=>Collapsible,
    "CollapsibleContent",
    ()=>CollapsibleContent,
    "CollapsibleTrigger",
    ()=>CollapsibleTrigger,
    "Container",
    ()=>Container,
    "DropdownMenu",
    ()=>DropdownMenu,
    "DropdownMenuContent",
    ()=>DropdownMenuContent,
    "DropdownMenuItem",
    ()=>DropdownMenuItem,
    "DropdownMenuLabel",
    ()=>DropdownMenuLabel,
    "DropdownMenuSeparator",
    ()=>DropdownMenuSeparator,
    "DropdownMenuTrigger",
    ()=>DropdownMenuTrigger,
    "Input",
    ()=>Input,
    "Label",
    ()=>Label,
    "Link",
    ()=>Link,
    "Popover",
    ()=>Popover,
    "PopoverContent",
    ()=>PopoverContent,
    "PopoverTrigger",
    ()=>PopoverTrigger,
    "Separator",
    ()=>Separator,
    "Skeleton",
    ()=>Skeleton,
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger,
    "Text",
    ()=>Text
]);
// src/components-core/index.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$component$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/component-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$hooks$2f$use$2d$async$2d$callback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/hooks/use-async-callback.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
var Button = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const { Button: Button2 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$component$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComponents"])();
    const [onClick, onClickLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$hooks$2f$use$2d$async$2d$callback$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAsyncCallbackWithLoggedError"])(async ()=>{
        return await props.onClick?.();
    }, [
        props.onClick
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Button2, {
        ...props,
        onClick: props.onClick && onClick,
        loading: props.loading || onClickLoading,
        disabled: props.disabled || onClickLoading,
        ref
    });
});
function createDynamicComponent(component) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
        const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$component$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComponents"])()[component];
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Component, {
            ...props,
            ref
        });
    });
}
var Input = createDynamicComponent("Input");
var Container = createDynamicComponent("Container");
var Separator = createDynamicComponent("Separator");
var Label = createDynamicComponent("Label");
var Link = createDynamicComponent("Link");
var Text = createDynamicComponent("Text");
var Popover = createDynamicComponent("Popover");
var PopoverTrigger = createDynamicComponent("PopoverTrigger");
var PopoverContent = createDynamicComponent("PopoverContent");
var DropdownMenu = createDynamicComponent("DropdownMenu");
var DropdownMenuTrigger = createDynamicComponent("DropdownMenuTrigger");
var DropdownMenuContent = createDynamicComponent("DropdownMenuContent");
var DropdownMenuItem = createDynamicComponent("DropdownMenuItem");
var DropdownMenuLabel = createDynamicComponent("DropdownMenuLabel");
var DropdownMenuSeparator = createDynamicComponent("DropdownMenuSeparator");
var Avatar = createDynamicComponent("Avatar");
var AvatarFallback = createDynamicComponent("AvatarFallback");
var AvatarImage = createDynamicComponent("AvatarImage");
var Collapsible = createDynamicComponent("Collapsible");
var CollapsibleTrigger = createDynamicComponent("CollapsibleTrigger");
var CollapsibleContent = createDynamicComponent("CollapsibleContent");
var Card = createDynamicComponent("Card");
var CardHeader = createDynamicComponent("CardHeader");
var CardContent = createDynamicComponent("CardContent");
var CardFooter = createDynamicComponent("CardFooter");
var Tabs = createDynamicComponent("Tabs");
var TabsList = createDynamicComponent("TabsList");
var TabsContent = createDynamicComponent("TabsContent");
var TabsTrigger = createDynamicComponent("TabsTrigger");
var Skeleton = createDynamicComponent("Skeleton");
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/tabs.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/components-core/tabs.tsx
__turbopack_context__.s([
    "Tabs",
    ()=>Tabs,
    "TabsContent",
    ()=>TabsContent,
    "TabsList",
    ()=>TabsList,
    "TabsTrigger",
    ()=>TabsTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@radix-ui/react-tabs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
;
;
var Tabs = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"];
var StyledTabsList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["List"])`
  display: flex;
  height: 2.5rem
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  padding: 0.25rem;

  background-color: rgb(244, 244, 245);

  html[data-stack-theme='dark'] & {
    background-color: rgb(39, 39, 42);
  }
`;
var TabsList = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledTabsList, {
        ...props,
        ref
    });
});
var StyledTabsTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"])`
  all: unset;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  transition: all;
  outline: none;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &[data-state='active'] {
    background-color: ${({ $colors })=>$colors.light.backgroundColor};
  }

  html[data-stack-theme='dark'] & {
    &[data-state='active'] {
      background-color: ${({ $colors })=>$colors.dark.backgroundColor};
    }
  }
`;
var TabsTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ children, ...props }, ref)=>{
    const { colors } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDesign"])();
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledTabsTrigger, {
        $colors: colors,
        ...props,
        ref,
        children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"], {
            children
        })
    });
});
var StyledTabsContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"])`
  margin-top: 1.5rem;
`;
var TabsContent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(StyledTabsContent, {
        ...props,
        ref
    });
});
;
 //# sourceMappingURL=tabs.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/skeleton.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
// src/components-core/skeleton.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
var getFilterString = (brightness1, brightness2)=>{
    return `
    0% {
      filter: grayscale(1) contrast(0) brightness(0) invert(1) brightness(${brightness1});
    }
    100% {
      filter: grayscale(1) contrast(0) brightness(0) invert(1) brightness(${brightness2});
    }
  `;
};
var animationLight = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`${getFilterString(0.8, 0.9)}`;
var animationDark = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`${getFilterString(0.2, 0.1)}`;
var Primitive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("span")`
  &[data-stack-state="activated"], &[data-stack-state="activated"] * {
    pointer-events: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    user-select: none !important;
    cursor: default !important;
  }

  &[data-stack-state="activated"] {
    animation: ${animationLight} 1s infinite alternate-reverse !important;
  }

  html[data-stack-theme='dark'] &[data-stack-state="activated"] {
    animation: ${animationDark} 1s infinite alternate-reverse !important;
  }
`;
var Skeleton = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].forwardRef((props, ref)=>{
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Primitive, {
        ref,
        "data-stack-state": props.deactivated ? "deactivated" : "activated",
        ...props
    });
});
Skeleton.displayName = "Skeleton";
;
 //# sourceMappingURL=skeleton.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/component-provider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Components",
    ()=>Components,
    "StackComponentProvider",
    ()=>StackComponentProvider,
    "useComponents",
    ()=>useComponents
]);
// src/providers/component-provider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/button.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$container$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/container.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$separator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/separator.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/input.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/label.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/text.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/card.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$popover$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/popover.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$dropdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/dropdown.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$avatar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/avatar.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$collapsible$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/collapsible.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/tabs.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/components-core/skeleton.js [app-ssr] (ecmascript)");
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
;
var Components = {
    Input: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$input$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"],
    Button: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$button$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"],
    Container: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$container$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"],
    Separator: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$separator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"],
    Label: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$label$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"],
    Link: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Link"],
    Text: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Text"],
    Popover: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$popover$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Popover"],
    PopoverTrigger: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$popover$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopoverTrigger"],
    PopoverContent: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$popover$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PopoverContent"],
    DropdownMenu: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$dropdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"],
    DropdownMenuTrigger: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$dropdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"],
    DropdownMenuContent: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$dropdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"],
    DropdownMenuItem: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$dropdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"],
    DropdownMenuLabel: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$dropdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuLabel"],
    DropdownMenuSeparator: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$dropdown$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"],
    Avatar: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$avatar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"],
    AvatarFallback: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$avatar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarFallback"],
    AvatarImage: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$avatar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AvatarImage"],
    Collapsible: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$collapsible$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Collapsible"],
    CollapsibleTrigger: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$collapsible$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CollapsibleTrigger"],
    CollapsibleContent: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$collapsible$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CollapsibleContent"],
    Card: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"],
    CardHeader: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"],
    CardContent: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"],
    CardFooter: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardFooter"],
    Tabs: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tabs"],
    TabsList: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsList"],
    TabsContent: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"],
    TabsTrigger: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$tabs$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsTrigger"],
    Skeleton: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$components$2d$core$2f$skeleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"]
};
var ComponentContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(void 0);
function useComponents() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ComponentContext);
    if (!context) {
        throw new Error("Stack UI components must be used within a StackTheme");
    }
    return context;
}
function StackComponentProvider(props) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(ComponentContext.Provider, {
        value: {
            ...Components,
            ...props.components
        },
        children: props.children
    });
}
;
 //# sourceMappingURL=component-provider.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/styled-components-registry.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StyledComponentsRegistry
]);
// src/providers/styled-components-registry.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/styled-components/dist/styled-components.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
function StyledComponentsRegistry({ children }) {
    const [styledComponentsStyleSheet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ServerStyleSheet"]());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useServerInsertedHTML"])(()=>{
        const styles = styledComponentsStyleSheet.getStyleElement();
        styledComponentsStyleSheet.instance.clearTag();
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: styles
        });
    });
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StyleSheetManager"], {
        sheet: styledComponentsStyleSheet.instance,
        children
    });
}
;
 //# sourceMappingURL=styled-components-registry.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/browser-script.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/browser-script.tsx
__turbopack_context__.s([
    "BrowserScript",
    ()=>BrowserScript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
var script = ()=>{
    const attributes = [
        "data-joy-color-scheme",
        "data-mui-color-scheme",
        "data-theme",
        "data-color-scheme",
        "class"
    ];
    const observer = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            for (const attributeName of attributes){
                if (mutation.attributeName === attributeName) {
                    const colorTheme = document.documentElement.getAttribute(attributeName);
                    if (!colorTheme) {
                        continue;
                    }
                    const darkMode = colorTheme.includes("dark");
                    const lightMode = colorTheme.includes("light");
                    if (!darkMode && !lightMode) {
                        continue;
                    }
                    document.documentElement.setAttribute("data-stack-theme", darkMode ? "dark" : "light");
                }
            }
        });
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: attributes
    });
};
function BrowserScript() {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])("script", {
        dangerouslySetInnerHTML: {
            __html: `(${script.toString()})()`
        }
    });
}
;
 //# sourceMappingURL=browser-script.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/theme-provider.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackTheme",
    ()=>StackTheme
]);
// src/providers/theme-provider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/design-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$component$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/component-provider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$styled$2d$components$2d$registry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/styled-components-registry.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$browser$2d$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/browser-script.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
"use client";
"use client";
;
;
;
;
;
function StackTheme({ theme, children }) {
    const componentProps = {
        components: theme?.components
    };
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$styled$2d$components$2d$registry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$browser$2d$script$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BrowserScript"], {}),
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$design$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackDesignProvider"], {
                ...theme,
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$component$2d$provider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackComponentProvider"], {
                    ...componentProps,
                    children
                })
            })
        ]
    });
}
;
 //# sourceMappingURL=theme-provider.js.map
}),
];

//# sourceMappingURL=65e54_%40stackframe_stack_dist_esm_c519a41a._.js.map