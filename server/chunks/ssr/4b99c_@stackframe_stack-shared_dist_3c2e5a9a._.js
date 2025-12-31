module.exports = [
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackAssertionError",
    ()=>StackAssertionError,
    "StatusError",
    ()=>StatusError,
    "captureError",
    ()=>captureError,
    "registerErrorSink",
    ()=>registerErrorSink,
    "throwErr",
    ()=>throwErr,
    "throwStackErr",
    ()=>throwStackErr
]);
function throwErr(...args) {
    if (typeof args[0] === "string") {
        throw new StackAssertionError(args[0]);
    } else if (args[0] instanceof Error) {
        throw args[0];
    } else {
        // @ts-expect-error
        throw new StatusError(...args);
    }
}
class StackAssertionError extends Error {
    extraData;
    constructor(message, extraData, options){
        const disclaimer = `\n\nThis is likely an error in Stack. Please report it.`;
        super(`${message}${message.endsWith(disclaimer) ? "" : disclaimer}`, options);
        this.extraData = extraData;
    }
}
StackAssertionError.prototype.name = "StackAssertionError";
function throwStackErr(message, extraData) {
    throw new StackAssertionError(message, extraData);
}
const errorSinks = new Set();
function registerErrorSink(sink) {
    if (errorSinks.has(sink)) {
        return;
    }
    errorSinks.add(sink);
}
registerErrorSink((location, ...args)=>{
    console.error(`Error in ${location}:`, ...args);
});
function captureError(location, error) {
    for (const sink of errorSinks){
        sink(location, error);
    }
}
class StatusError extends Error {
    name = "StatusError";
    statusCode;
    static BadRequest = {
        statusCode: 400,
        message: "Bad Request"
    };
    static Unauthorized = {
        statusCode: 401,
        message: "Unauthorized"
    };
    static PaymentRequired = {
        statusCode: 402,
        message: "Payment Required"
    };
    static Forbidden = {
        statusCode: 403,
        message: "Forbidden"
    };
    static NotFound = {
        statusCode: 404,
        message: "Not Found"
    };
    static MethodNotAllowed = {
        statusCode: 405,
        message: "Method Not Allowed"
    };
    static NotAcceptable = {
        statusCode: 406,
        message: "Not Acceptable"
    };
    static ProxyAuthenticationRequired = {
        statusCode: 407,
        message: "Proxy Authentication Required"
    };
    static RequestTimeout = {
        statusCode: 408,
        message: "Request Timeout"
    };
    static Conflict = {
        statusCode: 409,
        message: "Conflict"
    };
    static Gone = {
        statusCode: 410,
        message: "Gone"
    };
    static LengthRequired = {
        statusCode: 411,
        message: "Length Required"
    };
    static PreconditionFailed = {
        statusCode: 412,
        message: "Precondition Failed"
    };
    static PayloadTooLarge = {
        statusCode: 413,
        message: "Payload Too Large"
    };
    static URITooLong = {
        statusCode: 414,
        message: "URI Too Long"
    };
    static UnsupportedMediaType = {
        statusCode: 415,
        message: "Unsupported Media Type"
    };
    static RangeNotSatisfiable = {
        statusCode: 416,
        message: "Range Not Satisfiable"
    };
    static ExpectationFailed = {
        statusCode: 417,
        message: "Expectation Failed"
    };
    static ImATeapot = {
        statusCode: 418,
        message: "I'm a teapot"
    };
    static MisdirectedRequest = {
        statusCode: 421,
        message: "Misdirected Request"
    };
    static UnprocessableEntity = {
        statusCode: 422,
        message: "Unprocessable Entity"
    };
    static Locked = {
        statusCode: 423,
        message: "Locked"
    };
    static FailedDependency = {
        statusCode: 424,
        message: "Failed Dependency"
    };
    static TooEarly = {
        statusCode: 425,
        message: "Too Early"
    };
    static UpgradeRequired = {
        statusCode: 426,
        message: "Upgrade Required"
    };
    static PreconditionRequired = {
        statusCode: 428,
        message: "Precondition Required"
    };
    static TooManyRequests = {
        statusCode: 429,
        message: "Too Many Requests"
    };
    static RequestHeaderFieldsTooLarge = {
        statusCode: 431,
        message: "Request Header Fields Too Large"
    };
    static UnavailableForLegalReasons = {
        statusCode: 451,
        message: "Unavailable For Legal Reasons"
    };
    static InternalServerError = {
        statusCode: 500,
        message: "Internal Server Error"
    };
    static NotImplemented = {
        statusCode: 501,
        message: "Not Implemented"
    };
    static BadGateway = {
        statusCode: 502,
        message: "Bad Gateway"
    };
    static ServiceUnavailable = {
        statusCode: 503,
        message: "Service Unavailable"
    };
    static GatewayTimeout = {
        statusCode: 504,
        message: "Gateway Timeout"
    };
    static HTTPVersionNotSupported = {
        statusCode: 505,
        message: "HTTP Version Not Supported"
    };
    static VariantAlsoNegotiates = {
        statusCode: 506,
        message: "Variant Also Negotiates"
    };
    static InsufficientStorage = {
        statusCode: 507,
        message: "Insufficient Storage"
    };
    static LoopDetected = {
        statusCode: 508,
        message: "Loop Detected"
    };
    static NotExtended = {
        statusCode: 510,
        message: "Not Extended"
    };
    static NetworkAuthenticationRequired = {
        statusCode: 511,
        message: "Network Authentication Required"
    };
    constructor(status, message){
        if (typeof status === "object") {
            message ??= status.message;
            status = status.statusCode;
        }
        message ??= "Server Error";
        super(message);
        this.statusCode = status;
    }
    isClientError() {
        return this.statusCode >= 400 && this.statusCode < 500;
    }
    isServerError() {
        return !this.isClientError();
    }
    getStatusCode() {
        return this.statusCode;
    }
    getBody() {
        return new TextEncoder().encode(this.message);
    }
    getHeaders() {
        return {
            "Content-Type": [
                "text/plain; charset=utf-8"
            ]
        };
    }
    toHttpJson() {
        return {
            statusCode: this.statusCode,
            body: this.message,
            headers: this.getHeaders()
        };
    }
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/uuids.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateUuid",
    ()=>generateUuid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/v4.js [app-ssr] (ecmascript) <export default as v4>");
;
function generateUuid() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPromise",
    ()=>createPromise,
    "neverResolve",
    ()=>neverResolve,
    "pending",
    ()=>pending,
    "rateLimited",
    ()=>rateLimited,
    "rejected",
    ()=>rejected,
    "resolved",
    ()=>resolved,
    "runAsynchronously",
    ()=>runAsynchronously,
    "throttled",
    ()=>throttled,
    "timeout",
    ()=>timeout,
    "timeoutThrow",
    ()=>timeoutThrow,
    "wait",
    ()=>wait,
    "waitUntil",
    ()=>waitUntil
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/uuids.js [app-ssr] (ecmascript)");
;
;
;
function createPromise(callback) {
    let status = "pending";
    let valueOrReason = undefined;
    let resolve = null;
    let reject = null;
    const promise = new Promise((res, rej)=>{
        resolve = (value)=>{
            if (status !== "pending") return;
            status = "fulfilled";
            valueOrReason = value;
            res(value);
        };
        reject = (reason)=>{
            if (status !== "pending") return;
            status = "rejected";
            valueOrReason = reason;
            rej(reason);
        };
    });
    callback(resolve, reject);
    return Object.assign(promise, {
        status: status,
        ...status === "fulfilled" ? {
            value: valueOrReason
        } : {},
        ...status === "rejected" ? {
            reason: valueOrReason
        } : {}
    });
}
function resolved(value) {
    return Object.assign(Promise.resolve(value), {
        status: "fulfilled",
        value
    });
}
function rejected(reason) {
    return Object.assign(Promise.reject(reason), {
        status: "rejected",
        reason: reason
    });
}
function neverResolve() {
    return pending(new Promise(()=>{}));
}
function pending(promise, options = {}) {
    const res = promise.then((value)=>{
        res.status = "fulfilled";
        res.value = value;
        return value;
    }, (actualReason)=>{
        res.status = "rejected";
        res.reason = actualReason;
        throw actualReason;
    });
    res.status = "pending";
    return res;
}
async function wait(ms) {
    return await new Promise((resolve)=>setTimeout(resolve, ms));
}
async function waitUntil(date) {
    return await wait(date.getTime() - Date.now());
}
class ErrorDuringRunAsynchronously extends Error {
    constructor(){
        super("The error above originated in a runAsynchronously() call. Here is the stacktrace associated with it.");
        this.name = "ErrorDuringRunAsynchronously";
    }
}
function runAsynchronously(promiseOrFunc, options = {}) {
    if (typeof promiseOrFunc === "function") {
        promiseOrFunc = promiseOrFunc();
    }
    const duringError = new ErrorDuringRunAsynchronously();
    promiseOrFunc?.catch((error)=>{
        const newError = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("Uncaught error in asynchronous function: " + error.toString(), {
            duringError
        }, {
            cause: error
        });
        if (!options.ignoreErrors) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureError"])("runAsynchronously", newError);
        }
    });
}
class TimeoutError extends Error {
    ms;
    constructor(ms){
        super(`Timeout after ${ms}ms`);
        this.ms = ms;
        this.name = "TimeoutError";
    }
}
async function timeout(promise, ms) {
    return await Promise.race([
        promise.then((value)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(value)),
        wait(ms).then(()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(new TimeoutError(ms)))
    ]);
}
async function timeoutThrow(promise, ms) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].orThrow(await timeout(promise, ms));
}
function rateLimited(func, options) {
    let waitUntil = performance.now();
    let queue = [];
    let addedToQueueCallbacks = new Map;
    const next = async ()=>{
        while(true){
            if (waitUntil > performance.now()) {
                await wait(Math.max(1, waitUntil - performance.now() + 1));
            } else if (queue.length === 0) {
                const uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUuid"])();
                await new Promise((resolve)=>{
                    addedToQueueCallbacks.set(uuid, resolve);
                });
                addedToQueueCallbacks.delete(uuid);
            } else {
                break;
            }
        }
        const nextFuncs = options.batchCalls ? queue.splice(0, queue.length) : [
            queue.shift()
        ];
        const start = performance.now();
        const value = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].fromPromise(func());
        const end = performance.now();
        waitUntil = Math.max(waitUntil, start + (options.throttleMs ?? 0), end + (options.gapMs ?? 0));
        for (const nextFunc of nextFuncs){
            value.status === "ok" ? nextFunc[0](value.data) : nextFunc[1](value.error);
        }
    };
    runAsynchronously(async ()=>{
        while(true){
            await next();
        }
    });
    return ()=>{
        return new Promise((resolve, reject)=>{
            waitUntil = Math.max(waitUntil, performance.now() + (options.debounceMs ?? 0));
            queue.push([
                resolve,
                reject
            ]);
            addedToQueueCallbacks.forEach((cb)=>cb());
        });
    };
}
function throttled(func, delayMs) {
    let timeout = null;
    let nextAvailable = null;
    return async (...args)=>{
        while(nextAvailable !== null){
            await nextAvailable;
        }
        nextAvailable = new Promise((resolve)=>{
            timeout = setTimeout(()=>{
                nextAvailable = null;
                resolve(func(...args));
            }, delayMs);
        });
        return await nextAvailable;
    };
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AsyncResult",
    ()=>AsyncResult,
    "Result",
    ()=>Result
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-ssr] (ecmascript)");
;
const Result = {
    fromThrowing,
    fromPromise: promiseToResult,
    ok (data) {
        return {
            status: "ok",
            data
        };
    },
    error (error) {
        return {
            status: "error",
            error
        };
    },
    map: mapResult,
    or: (result, fallback)=>{
        return result.status === "ok" ? result.data : fallback;
    },
    orThrow: (result)=>{
        if (result.status === "error") throw result.error;
        return result.data;
    },
    orThrowAsync: async (result)=>{
        return Result.orThrow(await result);
    },
    retry
};
const AsyncResult = {
    fromThrowing,
    fromPromise: promiseToResult,
    ok: Result.ok,
    error: Result.error,
    pending,
    map: mapResult,
    or: (result, fallback)=>{
        if (result.status === "pending") return fallback;
        return Result.or(result, fallback);
    },
    orThrow: (result)=>{
        if (result.status === "pending") throw new Error("Result still pending");
        return Result.orThrow(result);
    },
    retry
};
function pending(progress) {
    return {
        status: "pending",
        progress: progress
    };
}
async function promiseToResult(promise) {
    try {
        const value = await promise;
        return Result.ok(value);
    } catch (error) {
        return Result.error(error);
    }
}
function fromThrowing(fn) {
    try {
        return Result.ok(fn());
    } catch (error) {
        return Result.error(error);
    }
}
function mapResult(result, fn) {
    if (result.status === "error") return {
        status: "error",
        error: result.error
    };
    if (result.status === "pending") return {
        status: "pending",
        ..."progress" in result ? {
            progress: result.progress
        } : {}
    };
    return Result.ok(fn(result.data));
}
class RetryError extends Error {
    errors;
    constructor(errors){
        super(`Error after retrying ${errors.length} times.`, {
            cause: errors[errors.length - 1]
        });
        this.errors = errors;
        this.name = "RetryError";
    }
    get retries() {
        return this.errors.length;
    }
}
async function retry(fn, retries, { exponentialDelayBase = 2000 }) {
    const errors = [];
    for(let i = 0; i < retries; i++){
        const res = await fn();
        if (res.status === "ok") {
            return Result.ok(res.data);
        } else {
            errors.push(res.error);
            if (i < retries - 1) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wait"])(Math.random() * exponentialDelayBase * 2 ** i);
            }
        }
    }
    return Result.error(new RetryError(errors));
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/stores.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AsyncStore",
    ()=>AsyncStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/uuids.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-ssr] (ecmascript)");
;
;
;
class AsyncStore {
    _isAvailable;
    _value = undefined;
    _isRejected = false;
    _rejectionError;
    _waitingRejectFunctions = new Map();
    _callbacks = new Map();
    _updateCounter = 0;
    _lastSuccessfulUpdate = -1;
    constructor(...args){
        if (args.length === 0) {
            this._isAvailable = false;
        } else {
            this._isAvailable = true;
            this._value = args[0];
        }
    }
    isAvailable() {
        return this._isAvailable;
    }
    isRejected() {
        return this._isRejected;
    }
    get() {
        if (this.isRejected()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncResult"].error(this._rejectionError);
        } else if (this.isAvailable()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncResult"].ok(this._value);
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncResult"].pending();
        }
    }
    getOrWait() {
        const uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUuid"])();
        if (this.isRejected()) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rejected"])(this._rejectionError);
        } else if (this.isAvailable()) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolved"])(this._value);
        }
        const promise = new Promise((resolve, reject)=>{
            this.onceChange((value)=>{
                resolve(value);
            });
            this._waitingRejectFunctions.set(uuid, reject);
        });
        const withFinally = promise.finally(()=>{
            this._waitingRejectFunctions.delete(uuid);
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pending"])(withFinally);
    }
    _setIfLatest(result, curCounter) {
        if (curCounter > this._lastSuccessfulUpdate) {
            switch(result.status){
                case "ok":
                    {
                        if (!this._isAvailable || this._isRejected || this._value !== result.data) {
                            const oldValue = this._value;
                            this._lastSuccessfulUpdate = curCounter;
                            this._isAvailable = true;
                            this._isRejected = false;
                            this._value = result.data;
                            this._rejectionError = undefined;
                            this._callbacks.forEach((callback)=>callback(result.data, oldValue));
                            return true;
                        }
                        return false;
                    }
                case "error":
                    {
                        this._lastSuccessfulUpdate = curCounter;
                        this._isAvailable = false;
                        this._isRejected = true;
                        this._value = undefined;
                        this._rejectionError = result.error;
                        this._waitingRejectFunctions.forEach((reject)=>reject(result.error));
                        return true;
                    }
            }
        }
        return false;
    }
    set(value) {
        this._setIfLatest(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(value), ++this._updateCounter);
    }
    update(updater) {
        const value = updater(this._value);
        this.set(value);
        return value;
    }
    async setAsync(promise) {
        const curCounter = ++this._updateCounter;
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].fromPromise(promise);
        return this._setIfLatest(result, curCounter);
    }
    setUnavailable() {
        this._lastSuccessfulUpdate = ++this._updateCounter;
        this._isAvailable = false;
        this._isRejected = false;
        this._value = undefined;
        this._rejectionError = undefined;
    }
    setRejected(error) {
        this._setIfLatest(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(error), ++this._updateCounter);
    }
    map(mapper) {
        const store = new AsyncStore();
        this.onChange((value)=>{
            store.set(mapper(value));
        });
        return store;
    }
    onChange(callback) {
        const uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateUuid"])();
        this._callbacks.set(uuid, callback);
        return {
            unsubscribe: ()=>{
                this._callbacks.delete(uuid);
            }
        };
    }
    onceChange(callback) {
        const { unsubscribe } = this.onChange((...args)=>{
            unsubscribe();
            callback(...args);
        });
        return {
            unsubscribe
        };
    }
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/functions.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "identity",
    ()=>identity,
    "identityArgs",
    ()=>identityArgs
]);
function identity(t) {
    return t;
}
function identityArgs(...args) {
    return args;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/strings.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deindent",
    ()=>deindent,
    "getWhitespacePrefix",
    ()=>getWhitespacePrefix,
    "getWhitespaceSuffix",
    ()=>getWhitespaceSuffix,
    "templateIdentity",
    ()=>templateIdentity,
    "trimEmptyLinesEnd",
    ()=>trimEmptyLinesEnd,
    "trimEmptyLinesStart",
    ()=>trimEmptyLinesStart,
    "trimLines",
    ()=>trimLines,
    "typedCapitalize",
    ()=>typedCapitalize,
    "typedToLowercase",
    ()=>typedToLowercase,
    "typedToUppercase",
    ()=>typedToUppercase
]);
function typedToLowercase(s) {
    return s.toLowerCase();
}
function typedToUppercase(s) {
    return s.toUpperCase();
}
function typedCapitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
function getWhitespacePrefix(s) {
    return s.substring(0, s.length - s.trimStart().length);
}
function getWhitespaceSuffix(s) {
    return s.substring(s.trimEnd().length);
}
function trimEmptyLinesStart(s) {
    const lines = s.split("\n");
    const firstNonEmptyLineIndex = lines.findIndex((line)=>line.trim() !== "");
    return lines.slice(firstNonEmptyLineIndex).join("\n");
}
function trimEmptyLinesEnd(s) {
    const lines = s.split("\n");
    const lastNonEmptyLineIndex = lines.findLastIndex((line)=>line.trim() !== "");
    return lines.slice(0, lastNonEmptyLineIndex + 1).join("\n");
}
function trimLines(s) {
    return trimEmptyLinesEnd(trimEmptyLinesStart(s));
}
function templateIdentity(strings, ...values) {
    if (strings.length === 0) return "";
    if (values.length !== strings.length - 1) throw new Error("Invalid number of values; must be one less than strings");
    return strings.slice(1).reduce((result, string, i)=>`${result}${values[i] ?? "n/a"}${string}`, strings[0]);
}
function deindent(strings, ...values) {
    if (typeof strings === "string") return deindent([
        strings
    ]);
    if (strings.length === 0) return "";
    if (values.length !== strings.length - 1) throw new Error("Invalid number of values; must be one less than strings");
    const trimmedStrings = [
        ...strings
    ];
    trimmedStrings[0] = trimEmptyLinesStart(trimmedStrings[0]);
    trimmedStrings[trimmedStrings.length - 1] = trimEmptyLinesEnd(trimmedStrings[trimmedStrings.length - 1]);
    const indentation = trimmedStrings.join("${SOME_VALUE}").split("\n").filter((line)=>line.trim() !== "").map((line)=>getWhitespacePrefix(line).length).reduce((min, current)=>Math.min(min, current), Infinity);
    const deindentedStrings = trimmedStrings.map((string, stringIndex)=>{
        return string.split("\n").map((line, lineIndex)=>stringIndex !== 0 && lineIndex === 0 ? line : line.substring(indentation)).join("\n");
    });
    const indentedValues = values.map((value, i)=>{
        const firstLineIndentation = getWhitespacePrefix(deindentedStrings[i].split("\n").at(-1));
        return `${value}`.replaceAll("\n", `\n${firstLineIndentation}`);
    });
    return templateIdentity(deindentedStrings, ...indentedValues);
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/known-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KnownError",
    ()=>KnownError,
    "KnownErrors",
    ()=>KnownErrors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$functions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/functions.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/strings.js [app-ssr] (ecmascript)");
;
;
;
class KnownError extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StatusError"] {
    statusCode;
    humanReadableMessage;
    details;
    name = "KnownError";
    constructor(statusCode, humanReadableMessage, details){
        super(statusCode, humanReadableMessage);
        this.statusCode = statusCode;
        this.humanReadableMessage = humanReadableMessage;
        this.details = details;
    }
    getBody() {
        return new TextEncoder().encode(JSON.stringify({
            code: this.errorCode,
            message: this.humanReadableMessage,
            details: this.details
        }, undefined, 2));
    }
    getHeaders() {
        return {
            "Content-Type": [
                "application/json; charset=utf-8"
            ],
            "X-Stack-Known-Error": [
                this.errorCode
            ]
        };
    }
    get errorCode() {
        return this.constructor.errorCode ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwStackErr"])(`Can't find error code for this KnownError. Is its constructor a KnownErrorConstructor? ${this}`);
    }
    static constructorArgsFromJson(json) {
        return [
            400,
            json.message,
            json.details
        ];
    }
    static fromJson(json) {
        for (const [_, KnownErrorType] of Object.entries(KnownErrors)){
            if (json.code === KnownErrorType.prototype.errorCode) {
                return new KnownErrorType(// @ts-expect-error
                ...KnownErrorType.constructorArgsFromJson(json));
            }
        }
        throw new Error(`Unknown KnownError code: ${json.code}`);
    }
}
const knownErrorConstructorErrorCodeSentinel = Symbol("knownErrorConstructorErrorCodeSentinel");
function createKnownErrorConstructor(SuperClass, errorCode, create, constructorArgsFromJson) {
    const createFn = create === "inherit" ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$functions$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["identityArgs"] : create;
    const constructorArgsFromJsonFn = constructorArgsFromJson === "inherit" ? SuperClass.constructorArgsFromJson : constructorArgsFromJson;
    // @ts-expect-error this is not a mixin, but TS detects it as one
    class KnownErrorImpl extends SuperClass {
        static errorCode = errorCode;
        name = `KnownError<${errorCode}>`;
        constructor(...args){
            // @ts-expect-error
            super(...createFn(...args));
        }
        static constructorArgsFromJson(json) {
            return constructorArgsFromJsonFn(json);
        }
    }
    ;
    // @ts-expect-error
    return KnownErrorImpl;
}
const UnsupportedError = createKnownErrorConstructor(KnownError, "UNSUPPORTED_ERROR", (originalErrorCode)=>[
        500,
        `An error occured that is not currently supported (possibly because it was added in a version of Stack that is newer than this client). The original unsupported error code was: ${originalErrorCode}`,
        {
            originalErrorCode
        }
    ], (json)=>[
        json.details?.originalErrorCode ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])("originalErrorCode not found in UnsupportedError details")
    ]);
const BodyParsingError = createKnownErrorConstructor(KnownError, "BODY_PARSING_ERROR", (message)=>[
        400,
        message
    ], (json)=>[
        json.message
    ]);
const SchemaError = createKnownErrorConstructor(KnownError, "SCHEMA_ERROR", (message)=>[
        400,
        message
    ], (json)=>[
        json.message
    ]);
const AllOverloadsFailed = createKnownErrorConstructor(KnownError, "ALL_OVERLOADS_FAILED", (overloadErrors)=>[
        400,
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deindent"]`
      This endpoint has multiple overloads, but they all failed to process the request.

        ${overloadErrors.map((e, i)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deindent"]`
          Overload ${i + 1}: ${JSON.stringify(e, undefined, 2)}
        `).join("\n\n")}
    `,
        {
            overloadErrors
        }
    ], (json)=>[
        json.details?.overloadErrors ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])("overloadErrors not found in AllOverloadsFailed details")
    ]);
const ProjectAuthenticationError = createKnownErrorConstructor(KnownError, "PROJECT_AUTHENTICATION_ERROR", "inherit", "inherit");
const InvalidProjectAuthentication = createKnownErrorConstructor(ProjectAuthenticationError, "INVALID_PROJECT_AUTHENTICATION", "inherit", "inherit");
const ProjectKeyWithoutRequestType = createKnownErrorConstructor(InvalidProjectAuthentication, "PROJECT_KEY_WITHOUT_REQUEST_TYPE", ()=>[
        400,
        "Either an API key or an admin access token was provided, but the x-stack-request-type header is missing. Set it to 'client', 'server', or 'admin' as appropriate."
    ], ()=>[]);
const InvalidRequestType = createKnownErrorConstructor(InvalidProjectAuthentication, "INVALID_REQUEST_TYPE", (requestType)=>[
        400,
        `The x-stack-request-type header must be 'client', 'server', or 'admin', but was '${requestType}'.`
    ], (json)=>[
        json.details?.requestType ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])("requestType not found in InvalidRequestType details")
    ]);
const RequestTypeWithoutProjectId = createKnownErrorConstructor(InvalidProjectAuthentication, "REQUEST_TYPE_WITHOUT_PROJECT_ID", (requestType)=>[
        400,
        `The x-stack-request-type header was '${requestType}', but the x-stack-project-id header was not provided.`,
        {
            requestType
        }
    ], (json)=>[
        json.requestType
    ]);
const InvalidPublishableClientKey = createKnownErrorConstructor(InvalidProjectAuthentication, "INVALID_PUBLISHABLE_CLIENT_KEY", ()=>[
        401,
        "The publishable key is not valid for the given project. Does the project and/or the key exist?"
    ], ()=>[]);
const InvalidSecretServerKey = createKnownErrorConstructor(InvalidProjectAuthentication, "INVALID_SECRET_SERVER_KEY", ()=>[
        401,
        "The secret server key is not valid for the given project. Does the project and/or the key exist?"
    ], ()=>[]);
const InvalidSuperSecretAdminKey = createKnownErrorConstructor(InvalidProjectAuthentication, "INVALID_SUPER_SECRET_ADMIN_KEY", ()=>[
        401,
        "The super secret admin key is not valid for the given project. Does the project and/or the key exist?"
    ], ()=>[]);
const InvalidAdminAccessToken = createKnownErrorConstructor(InvalidProjectAuthentication, "INVALID_ADMIN_ACCESS_TOKEN", "inherit", "inherit");
const UnparsableAdminAccessToken = createKnownErrorConstructor(InvalidAdminAccessToken, "UNPARSABLE_ADMIN_ACCESS_TOKEN", ()=>[
        401,
        "Admin access token is not parsable."
    ], ()=>[]);
const AdminAccessTokenExpired = createKnownErrorConstructor(InvalidAdminAccessToken, "ADMIN_ACCESS_TOKEN_EXPIRED", ()=>[
        401,
        "Admin access token has expired. Please refresh it and try again."
    ], ()=>[]);
const InvalidProjectForAdminAccessToken = createKnownErrorConstructor(InvalidAdminAccessToken, "INVALID_PROJECT_FOR_ADMIN_ACCESS_TOKEN", ()=>[
        401,
        "Admin access token not valid for this project."
    ], ()=>[]);
const AdminAccessTokenIsNotAdmin = createKnownErrorConstructor(InvalidAdminAccessToken, "ADMIN_ACCESS_TOKEN_IS_NOT_ADMIN", ()=>[
        401,
        "Admin access token does not have the required permissions to access this project."
    ], ()=>[]);
const ProjectAuthenticationRequired = createKnownErrorConstructor(ProjectAuthenticationError, "PROJECT_AUTHENTICATION_REQUIRED", "inherit", "inherit");
const ClientAuthenticationRequired = createKnownErrorConstructor(ProjectAuthenticationRequired, "CLIENT_AUTHENTICATION_REQUIRED", ()=>[
        401,
        "The publishable client key must be provided."
    ], ()=>[]);
const ServerAuthenticationRequired = createKnownErrorConstructor(ProjectAuthenticationRequired, "SERVER_AUTHENTICATION_REQUIRED", ()=>[
        401,
        "The secret server key must be provided."
    ], ()=>[]);
const ClientOrServerAuthenticationRequired = createKnownErrorConstructor(ProjectAuthenticationRequired, "CLIENT_OR_SERVER_AUTHENTICATION_REQUIRED", ()=>[
        401,
        "Either the publishable client key or the secret server key must be provided."
    ], ()=>[]);
const ClientOrAdminAuthenticationRequired = createKnownErrorConstructor(ProjectAuthenticationRequired, "CLIENT_OR_ADMIN_AUTHENTICATION_REQUIRED", ()=>[
        401,
        "Either the publishable client key or the super secret admin key must be provided."
    ], ()=>[]);
const ClientOrServerOrAdminAuthenticationRequired = createKnownErrorConstructor(ProjectAuthenticationRequired, "CLIENT_OR_SERVER_OR_ADMIN_AUTHENTICATION_REQUIRED", ()=>[
        401,
        "Either the publishable client key, the secret server key, or the super secret admin key must be provided."
    ], ()=>[]);
const AdminAuthenticationRequired = createKnownErrorConstructor(ProjectAuthenticationRequired, "ADMIN_AUTHENTICATION_REQUIRED", ()=>[
        401,
        "The super secret admin key must be provided."
    ], ()=>[]);
const ExpectedInternalProject = createKnownErrorConstructor(ProjectAuthenticationError, "EXPECTED_INTERNAL_PROJECT", ()=>[
        401,
        "The project ID is expected to be internal."
    ], ()=>[]);
const SessionAuthenticationError = createKnownErrorConstructor(KnownError, "SESSION_AUTHENTICATION_ERROR", "inherit", "inherit");
const InvalidSessionAuthentication = createKnownErrorConstructor(SessionAuthenticationError, "INVALID_SESSION_AUTHENTICATION", "inherit", "inherit");
const InvalidAccessToken = createKnownErrorConstructor(InvalidSessionAuthentication, "INVALID_ACCESS_TOKEN", "inherit", "inherit");
const UnparsableAccessToken = createKnownErrorConstructor(InvalidAccessToken, "UNPARSABLE_ACCESS_TOKEN", ()=>[
        401,
        "Access token is not parsable."
    ], ()=>[]);
const AccessTokenExpired = createKnownErrorConstructor(InvalidAccessToken, "ACCESS_TOKEN_EXPIRED", ()=>[
        401,
        "Access token has expired. Please refresh it and try again."
    ], ()=>[]);
const InvalidProjectForAccessToken = createKnownErrorConstructor(InvalidAccessToken, "INVALID_PROJECT_FOR_ACCESS_TOKEN", ()=>[
        401,
        "Access token not valid for this project."
    ], ()=>[]);
const SessionUserEmailNotVerified = createKnownErrorConstructor(InvalidSessionAuthentication, "SESSION_USER_EMAIL_NOT_VERIFIED", ()=>[
        401,
        "User e-mail not verified, but is required by the project."
    ], ()=>[]);
const SessionAuthenticationRequired = createKnownErrorConstructor(SessionAuthenticationError, "SESSION_AUTHENTICATION_REQUIRED", ()=>[
        401,
        "Session required for this request."
    ], ()=>[]);
const RefreshTokenError = createKnownErrorConstructor(KnownError, "INVALID_REFRESH_TOKEN", "inherit", "inherit");
const ProviderRejected = createKnownErrorConstructor(RefreshTokenError, "PROVIDER_REJECTED", ()=>[
        401,
        "The provider refused to refresh their token."
    ], ()=>[]);
const InvalidRefreshToken = createKnownErrorConstructor(RefreshTokenError, "REFRESH_TOKEN_EXPIRED", ()=>[
        401,
        "Refresh token has expired. A new refresh token requires reauthentication."
    ], ()=>[]);
const UserEmailAlreadyExists = createKnownErrorConstructor(KnownError, "USER_EMAIL_ALREADY_EXISTS", ()=>[
        400,
        "User already exists."
    ], ()=>[]);
const UserNotFound = createKnownErrorConstructor(KnownError, "USER_NOT_FOUND", ()=>[
        404,
        "User not found."
    ], ()=>[]);
const ApiKeyNotFound = createKnownErrorConstructor(KnownError, "API_KEY_NOT_FOUND", ()=>[
        404,
        "API key not found."
    ], ()=>[]);
const ProjectNotFound = createKnownErrorConstructor(KnownError, "PROJECT_NOT_FOUND", ()=>[
        404,
        "Project not found or is not accessible with the current user."
    ], ()=>[]);
const EmailPasswordMismatch = createKnownErrorConstructor(KnownError, "EMAIL_PASSWORD_MISMATCH", ()=>[
        400,
        "Wrong e-mail or password."
    ], ()=>[]);
const RedirectUrlNotWhitelisted = createKnownErrorConstructor(KnownError, "REDIRECT_URL_NOT_WHITELISTED", ()=>[
        400,
        "Redirect URL not whitelisted."
    ], ()=>[]);
const PasswordRequirementsNotMet = createKnownErrorConstructor(KnownError, "PASSWORD_REQUIREMENTS_NOT_MET", "inherit", "inherit");
const PasswordTooShort = createKnownErrorConstructor(PasswordRequirementsNotMet, "PASSWORD_TOO_SHORT", (minLength)=>[
        400,
        `Password too short. Minimum length is ${minLength}.`,
        {
            minLength
        }
    ], (json)=>[
        json.details?.minLength ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])("minLength not found in PasswordTooShort details")
    ]);
const PasswordTooLong = createKnownErrorConstructor(PasswordRequirementsNotMet, "PASSWORD_TOO_LONG", (maxLength)=>[
        400,
        `Password too long. Maximum length is ${maxLength}.`,
        {
            maxLength
        }
    ], (json)=>[
        json.details?.maxLength ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["throwErr"])("maxLength not found in PasswordTooLong details")
    ]);
const EmailVerificationError = createKnownErrorConstructor(KnownError, "EMAIL_VERIFICATION_ERROR", "inherit", "inherit");
const EmailVerificationCodeError = createKnownErrorConstructor(EmailVerificationError, "EMAIL_VERIFICATION_CODE_ERROR", "inherit", "inherit");
const EmailVerificationCodeNotFound = createKnownErrorConstructor(EmailVerificationCodeError, "EMAIL_VERIFICATION_CODE_NOT_FOUND", ()=>[
        404,
        "The e-mail verification code does not exist for this project."
    ], ()=>[]);
const EmailVerificationCodeExpired = createKnownErrorConstructor(EmailVerificationCodeError, "EMAIL_VERIFICATION_CODE_EXPIRED", ()=>[
        400,
        "The e-mail verification code has expired."
    ], ()=>[]);
const EmailVerificationCodeAlreadyUsed = createKnownErrorConstructor(EmailVerificationCodeError, "EMAIL_VERIFICATION_CODE_ALREADY_USED", ()=>[
        400,
        "The e-mail verification link has already been used."
    ], ()=>[]);
const MagicLinkError = createKnownErrorConstructor(KnownError, "MAGIC_LINK_ERROR", "inherit", "inherit");
const MagicLinkCodeError = createKnownErrorConstructor(MagicLinkError, "MAGIC_LINK_CODE_ERROR", "inherit", "inherit");
const MagicLinkCodeNotFound = createKnownErrorConstructor(MagicLinkCodeError, "MAGIC_LINK_CODE_NOT_FOUND", ()=>[
        404,
        "The e-mail verification code does not exist for this project."
    ], ()=>[]);
const MagicLinkCodeExpired = createKnownErrorConstructor(MagicLinkCodeError, "MAGIC_LINK_CODE_EXPIRED", ()=>[
        400,
        "The e-mail verification code has expired."
    ], ()=>[]);
const MagicLinkCodeAlreadyUsed = createKnownErrorConstructor(MagicLinkCodeError, "MAGIC_LINK_CODE_ALREADY_USED", ()=>[
        400,
        "The e-mail verification link has already been used."
    ], ()=>[]);
const PasswordMismatch = createKnownErrorConstructor(KnownError, "PASSWORD_MISMATCH", ()=>[
        400,
        "Passwords do not match."
    ], ()=>[]);
const PasswordResetError = createKnownErrorConstructor(KnownError, "PASSWORD_RESET_ERROR", "inherit", "inherit");
const PasswordResetCodeError = createKnownErrorConstructor(PasswordResetError, "PASSWORD_RESET_CODE_ERROR", "inherit", "inherit");
const PasswordResetCodeNotFound = createKnownErrorConstructor(PasswordResetCodeError, "PASSWORD_RESET_CODE_NOT_FOUND", ()=>[
        404,
        "The password reset code does not exist for this project."
    ], ()=>[]);
const PasswordResetCodeExpired = createKnownErrorConstructor(PasswordResetCodeError, "PASSWORD_RESET_CODE_EXPIRED", ()=>[
        400,
        "The password reset code has expired."
    ], ()=>[]);
const PasswordResetCodeAlreadyUsed = createKnownErrorConstructor(PasswordResetCodeError, "PASSWORD_RESET_CODE_ALREADY_USED", ()=>[
        400,
        "The password reset code has already been used."
    ], ()=>[]);
const EmailAlreadyVerified = createKnownErrorConstructor(KnownError, "EMAIL_ALREADY_VERIFIED", ()=>[
        400,
        "The e-mail is already verified."
    ], ()=>[]);
const PermissionNotFound = createKnownErrorConstructor(KnownError, "PERMISSION_NOT_FOUND", (permissionId)=>[
        404,
        `Permission ${permissionId} not found. Make sure you created it on the dashboard.`,
        {
            permissionId
        }
    ], (json)=>[
        json.details.permissionId
    ]);
const PermissionScopeMismatch = createKnownErrorConstructor(KnownError, "PERMISSION_SCOPE_MISMATCH", (permissionId, permissionScope, testScope)=>{
    return [
        400,
        `The scope of the permission with ID ${permissionId} is \`${permissionScope.type}\` but you tested against permissions of scope \`${testScope.type}\`. ${{
            "global": `Please don't specify any teams when using global permissions. For example: \`user.hasPermission(${JSON.stringify(permissionId)})\`.`,
            "any-team": `Please specify the team. For example: \`user.hasPermission(team, ${JSON.stringify(permissionId)})\`.`,
            "specific-team": `Please specify the team. For example: \`user.hasPermission(team, ${JSON.stringify(permissionId)})\`.`
        }[permissionScope.type]}`,
        {
            permissionId,
            permissionScope,
            testScope
        }
    ];
}, (json)=>[
        json.details.permissionId,
        json.details.permissionScope,
        json.details.testScope
    ]);
const UserNotInTeam = createKnownErrorConstructor(KnownError, "USER_NOT_IN_TEAM", (userId, teamId)=>[
        400,
        `User ${userId} is not in team ${teamId}.`,
        {
            userId,
            teamId
        }
    ], (json)=>[
        json.details.userId,
        json.details.teamId
    ]);
const TeamNotFound = createKnownErrorConstructor(KnownError, "TEAM_NOT_FOUND", (teamId)=>[
        404,
        `Team ${teamId} not found.`,
        {
            teamId
        }
    ], (json)=>[
        json.details.teamId
    ]);
const KnownErrors = {
    UnsupportedError,
    BodyParsingError,
    SchemaError,
    AllOverloadsFailed,
    ProjectAuthenticationError,
    InvalidProjectAuthentication,
    ProjectKeyWithoutRequestType,
    InvalidRequestType,
    RequestTypeWithoutProjectId,
    InvalidPublishableClientKey,
    InvalidSecretServerKey,
    InvalidSuperSecretAdminKey,
    InvalidAdminAccessToken,
    UnparsableAdminAccessToken,
    AdminAccessTokenExpired,
    InvalidProjectForAdminAccessToken,
    AdminAccessTokenIsNotAdmin,
    ProjectAuthenticationRequired,
    ClientAuthenticationRequired,
    ServerAuthenticationRequired,
    ClientOrServerAuthenticationRequired,
    ClientOrAdminAuthenticationRequired,
    ClientOrServerOrAdminAuthenticationRequired,
    AdminAuthenticationRequired,
    ExpectedInternalProject,
    SessionAuthenticationError,
    InvalidSessionAuthentication,
    InvalidAccessToken,
    UnparsableAccessToken,
    AccessTokenExpired,
    InvalidProjectForAccessToken,
    SessionUserEmailNotVerified,
    SessionAuthenticationRequired,
    RefreshTokenError,
    ProviderRejected,
    InvalidRefreshToken,
    UserEmailAlreadyExists,
    UserNotFound,
    ApiKeyNotFound,
    ProjectNotFound,
    EmailPasswordMismatch,
    RedirectUrlNotWhitelisted,
    PasswordRequirementsNotMet,
    PasswordTooShort,
    PasswordTooLong,
    EmailVerificationError,
    EmailVerificationCodeError,
    EmailVerificationCodeNotFound,
    EmailVerificationCodeExpired,
    EmailVerificationCodeAlreadyUsed,
    MagicLinkError,
    MagicLinkCodeError,
    MagicLinkCodeNotFound,
    MagicLinkCodeExpired,
    MagicLinkCodeAlreadyUsed,
    PasswordResetError,
    PasswordResetCodeError,
    PasswordResetCodeNotFound,
    PasswordResetCodeExpired,
    PasswordResetCodeAlreadyUsed,
    PasswordMismatch,
    EmailAlreadyVerified,
    PermissionNotFound,
    PermissionScopeMismatch,
    TeamNotFound
};
// ensure that all known error codes are unique
const knownErrorCodes = new Set();
for (const [_, KnownError] of Object.entries(KnownErrors)){
    if (knownErrorCodes.has(KnownError.errorCode)) {
        throw new Error(`Duplicate known error code: ${KnownError.errorCode}`);
    }
    knownErrorCodes.add(KnownError.errorCode);
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/bytes.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeBase32",
    ()=>decodeBase32,
    "encodeBase32",
    ()=>encodeBase32
]);
const crockfordAlphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const crockfordReplacements = new Map([
    [
        "o",
        "0"
    ],
    [
        "i",
        "1"
    ],
    [
        "l",
        "1"
    ]
]);
function encodeBase32(input) {
    let bits = 0;
    let value = 0;
    let output = "";
    for(let i = 0; i < input.length; i++){
        value = value << 8 | input[i];
        bits += 8;
        while(bits >= 5){
            output += crockfordAlphabet[value >>> bits - 5 & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        output += crockfordAlphabet[value << 5 - bits & 31];
    }
    return output;
}
function decodeBase32(input) {
    const output = new Uint8Array(input.length * 5 / 8 | 0);
    let bits = 0;
    let value = 0;
    let outputIndex = 0;
    for(let i = 0; i < input.length; i++){
        let char = input[i].toLowerCase();
        if (char === " ") continue;
        if (crockfordReplacements.has(char)) {
            char = crockfordReplacements.get(char);
        }
        const index = crockfordAlphabet.indexOf(char);
        if (index === -1) {
            throw new Error(`Invalid character: ${char}`);
        }
        value = value << 5 | index;
        bits += 5;
        if (bits >= 8) {
            output[outputIndex++] = value >>> bits - 8 & 255;
            bits -= 8;
        }
    }
    return output;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/crypto.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateSecureRandomString",
    ()=>generateSecureRandomString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$bytes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/bytes.js [app-ssr] (ecmascript)");
;
function generateSecureRandomString(minBitsOfEntropy = 224) {
    const base32CharactersCount = Math.ceil(minBitsOfEntropy / 5);
    const bytesCount = Math.ceil(base32CharactersCount * 5 / 8);
    const randomBytes = globalThis.crypto.getRandomValues(new Uint8Array(bytesCount));
    const str = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$bytes$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encodeBase32"])(randomBytes);
    return str.slice(str.length - base32CharactersCount).toLowerCase();
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/clientInterface.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackClientInterface",
    ()=>StackClientInterface,
    "getProductionModeErrors",
    ()=>getProductionModeErrors,
    "sharedProviders",
    ()=>sharedProviders,
    "standardProviders",
    ()=>standardProviders,
    "toSharedProvider",
    ()=>toSharedProvider,
    "toStandardProvider",
    ()=>toStandardProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/oauth4webapi/build/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/stores.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/known-errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$sc$2f$dist$2f$index$2e$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-sc/dist/index.client.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$crypto$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/crypto.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const sharedProviders = [
    "shared-github",
    "shared-google",
    "shared-facebook",
    "shared-microsoft"
];
const standardProviders = [
    "github",
    "facebook",
    "google",
    "microsoft"
];
function toStandardProvider(provider) {
    return provider.replace("shared-", "");
}
function toSharedProvider(provider) {
    return "shared-" + provider;
}
class StackClientInterface {
    options;
    constructor(options){
        this.options = options;
    // nothing here
    }
    get projectId() {
        return this.options.projectId;
    }
    getApiUrl() {
        return this.options.baseUrl + "/api/v1";
    }
    async refreshAccessToken(tokenStore) {
        if (!('publishableClientKey' in this.options)) {
            // TODO fix
            throw new Error("Admin session token is currently not supported for fetching new access token");
        }
        const refreshToken = (await tokenStore.getOrWait()).refreshToken;
        if (!refreshToken) {
            tokenStore.set({
                accessToken: null,
                refreshToken: null
            });
            return;
        }
        const as = {
            issuer: this.options.baseUrl,
            algorithm: 'oauth2',
            token_endpoint: this.getApiUrl() + '/auth/token'
        };
        const client = {
            client_id: this.projectId,
            client_secret: this.options.publishableClientKey,
            token_endpoint_auth_method: 'client_secret_basic'
        };
        const rawResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["refreshTokenGrantRequest"](as, client, refreshToken);
        const response = await this._processResponse(rawResponse);
        if (response.status === "error") {
            const error = response.error;
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].RefreshTokenError) {
                return tokenStore.set({
                    accessToken: null,
                    refreshToken: null
                });
            }
            throw error;
        }
        if (!response.data.ok) {
            const body = await response.data.text();
            throw new Error(`Failed to send refresh token request: ${response.status} ${body}`);
        }
        let challenges;
        if (challenges = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseWwwAuthenticateChallenges"](response.data)) {
            // TODO Handle WWW-Authenticate Challenges as needed
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("OAuth WWW-Authenticate challenge not implemented", {
                challenges
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processRefreshTokenResponse"](as, client, response.data);
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOAuth2Error"](result)) {
            // TODO Handle OAuth 2.0 response body error
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("OAuth error", {
                result
            });
        }
        tokenStore.update((old)=>({
                accessToken: result.access_token ?? null,
                refreshToken: result.refresh_token ?? old?.refreshToken ?? null
            }));
    }
    async sendClientRequest(path, requestOptions, tokenStoreOrNull, requestType = "client") {
        const tokenStore = tokenStoreOrNull ?? new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncStore"]({
            accessToken: null,
            refreshToken: null
        });
        return await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].orThrowAsync(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].retry(()=>this.sendClientRequestInner(path, requestOptions, tokenStore, requestType), 5, {
            exponentialDelayBase: 1000
        }));
    }
    async sendClientRequestAndCatchKnownError(path, requestOptions, tokenStoreOrNull, errorsToCatch) {
        try {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(await this.sendClientRequest(path, requestOptions, tokenStoreOrNull));
        } catch (e) {
            for (const errorType of errorsToCatch){
                if (e instanceof errorType) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(e);
                }
            }
            throw e;
        }
    }
    async sendClientRequestInner(path, options, /**
     * This object will be modified for future retries, so it should be passed by reference.
     */ tokenStore, requestType) {
        let tokenObj = await tokenStore.getOrWait();
        if (!tokenObj.accessToken && tokenObj.refreshToken) {
            await this.refreshAccessToken(tokenStore);
            tokenObj = await tokenStore.getOrWait();
        }
        // all requests should be dynamic to prevent Next.js caching
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$sc$2f$dist$2f$index$2e$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cookies"]?.();
        const url = this.getApiUrl() + path;
        const params = {
            /**
             * This fetch may be cross-origin, in which case we don't want to send cookies of the
             * original origin (this is the default behaviour of `credentials`).
             *
             * To help debugging, also omit cookies on same-origin, so we don't accidentally
             * implement reliance on cookies anywhere.
             */ credentials: "omit",
            ...options,
            headers: {
                "X-Stack-Override-Error-Status": "true",
                "X-Stack-Project-Id": this.projectId,
                "X-Stack-Request-Type": requestType,
                "X-Stack-Client-Version": this.options.clientVersion,
                ...tokenObj.accessToken ? {
                    "Authorization": "StackSession " + tokenObj.accessToken,
                    "X-Stack-Access-Token": tokenObj.accessToken
                } : {},
                ...tokenObj.refreshToken ? {
                    "X-Stack-Refresh-Token": tokenObj.refreshToken
                } : {},
                ...'publishableClientKey' in this.options ? {
                    "X-Stack-Publishable-Client-Key": this.options.publishableClientKey
                } : {},
                ...'projectOwnerTokens' in this.options ? {
                    "X-Stack-Admin-Access-Token": (await this.options.projectOwnerTokens?.getOrWait())?.accessToken ?? ""
                } : {},
                "X-Stack-Random-Nonce": (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$crypto$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSecureRandomString"])(),
                ...options.headers
            },
            cache: "no-store"
        };
        const rawRes = await fetch(url, params);
        const processedRes = await this._processResponse(rawRes);
        if (processedRes.status === "error") {
            // If the access token is expired, reset it and retry
            if (processedRes.error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].InvalidAccessToken) {
                tokenStore.set({
                    accessToken: null,
                    refreshToken: tokenObj.refreshToken
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(new Error("Access token expired"));
            }
            // Known errors are client side errors, and should hence not be retried (except for access token expired above).
            // Hence, throw instead of returning an error
            throw processedRes.error;
        }
        const res = Object.assign(processedRes.data, {
            usedTokens: tokenObj
        });
        if (res.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(res);
        } else {
            const error = await res.text();
            // Do not retry, throw error instead of returning one
            throw new Error(`Failed to send request to ${url}: ${res.status} ${error}`);
        }
    }
    async _processResponse(rawRes) {
        let res = rawRes;
        if (rawRes.headers.has("x-stack-actual-status")) {
            const actualStatus = Number(rawRes.headers.get("x-stack-actual-status"));
            res = new Response(rawRes.body, {
                status: actualStatus,
                statusText: rawRes.statusText,
                headers: rawRes.headers
            });
        }
        // Handle known errors
        if (res.headers.has("x-stack-known-error")) {
            const errorJson = await res.json();
            if (res.headers.get("x-stack-known-error") !== errorJson.code) {
                throw new Error("Mismatch between x-stack-known-error header and error code in body; the server's response is invalid");
            }
            const error = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownError"].fromJson(errorJson);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(error);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(res);
    }
    async sendForgotPasswordEmail(email, redirectUrl) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                redirectUrl
            })
        }, null, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].UserNotFound
        ]);
        if (res.status === "error") {
            return res.error;
        }
    }
    async sendVerificationEmail(emailVerificationRedirectUrl, tokenStore) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/send-verification-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailVerificationRedirectUrl
            })
        }, tokenStore, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].EmailAlreadyVerified
        ]);
        if (res.status === "error") {
            return res.error;
        }
    }
    async sendMagicLinkEmail(email, redirectUrl) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/send-magic-link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                redirectUrl
            })
        }, null, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].RedirectUrlNotWhitelisted
        ]);
        if (res.status === "error") {
            return res.error;
        }
    }
    async resetPassword(options) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/password-reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(options)
        }, null, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordResetError
        ]);
        if (res.status === "error") {
            return res.error;
        }
    }
    async updatePassword(options, tokenStore) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(options)
        }, tokenStore, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordMismatch,
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordRequirementsNotMet
        ]);
        if (res.status === "error") {
            return res.error;
        }
    }
    async verifyPasswordResetCode(code) {
        const res = await this.resetPassword({
            code,
            onlyVerifyCode: true
        });
        if (res && !(res instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordResetCodeError)) {
            throw res;
        }
        return res;
    }
    async verifyEmail(code) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/email-verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code
            })
        }, null, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].EmailVerificationError
        ]);
        if (res.status === "error") {
            return res.error;
        }
    }
    async signInWithCredential(email, password, tokenStore) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }, tokenStore, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].EmailPasswordMismatch
        ]);
        if (res.status === "error") {
            return res.error;
        }
        const result = await res.data.json();
        tokenStore.set({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        });
    }
    async signUpWithCredential(email, password, emailVerificationRedirectUrl, tokenStore) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/signup", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                emailVerificationRedirectUrl
            })
        }, tokenStore, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].UserEmailAlreadyExists,
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordRequirementsNotMet
        ]);
        if (res.status === "error") {
            return res.error;
        }
        const result = await res.data.json();
        tokenStore.set({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        });
    }
    async signInWithMagicLink(code, tokenStore) {
        const res = await this.sendClientRequestAndCatchKnownError("/auth/magic-link-verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code
            })
        }, null, [
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KnownErrors"].MagicLinkError
        ]);
        if (res.status === "error") {
            return res.error;
        }
        const result = await res.data.json();
        tokenStore.set({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        });
        return {
            newUser: result.newUser
        };
    }
    async getOAuthUrl(provider, redirectUrl, codeChallenge, state) {
        const updatedRedirectUrl = new URL(redirectUrl);
        for (const key of [
            "code",
            "state"
        ]){
            if (updatedRedirectUrl.searchParams.has(key)) {
                console.warn("Redirect URL already contains " + key + " parameter, removing it as it will be overwritten by the OAuth callback");
            }
            updatedRedirectUrl.searchParams.delete(key);
        }
        if (!('publishableClientKey' in this.options)) {
            // TODO fix
            throw new Error("Admin session token is currently not supported for OAuth");
        }
        const url = new URL(this.getApiUrl() + "/auth/authorize/" + provider.toLowerCase());
        url.searchParams.set("client_id", this.projectId);
        url.searchParams.set("client_secret", this.options.publishableClientKey);
        url.searchParams.set("redirect_uri", updatedRedirectUrl.toString());
        url.searchParams.set("scope", "openid");
        url.searchParams.set("state", state);
        url.searchParams.set("grant_type", "authorization_code");
        url.searchParams.set("code_challenge", codeChallenge);
        url.searchParams.set("code_challenge_method", "S256");
        url.searchParams.set("response_type", "code");
        return url.toString();
    }
    async callOAuthCallback(oauthParams, redirectUri, codeVerifier, state, tokenStore) {
        if (!('publishableClientKey' in this.options)) {
            // TODO fix
            throw new Error("Admin session token is currently not supported for OAuth");
        }
        const as = {
            issuer: this.options.baseUrl,
            algorithm: 'oauth2',
            token_endpoint: this.getApiUrl() + '/auth/token'
        };
        const client = {
            client_id: this.projectId,
            client_secret: this.options.publishableClientKey,
            token_endpoint_auth_method: 'client_secret_basic'
        };
        const params = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateAuthResponse"](as, client, oauthParams, state);
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOAuth2Error"](params)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("Error validating OAuth response", {
                params
            }); // Handle OAuth 2.0 redirect error
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authorizationCodeGrantRequest"](as, client, params, redirectUri, codeVerifier);
        let challenges;
        if (challenges = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseWwwAuthenticateChallenges"](response)) {
            // TODO Handle WWW-Authenticate Challenges as needed
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("OAuth WWW-Authenticate challenge not implemented", {
                challenges
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processAuthorizationCodeOAuth2Response"](as, client, response);
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isOAuth2Error"](result)) {
            // TODO Handle OAuth 2.0 response body error
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackAssertionError"]("OAuth error", {
                result
            });
        }
        tokenStore.update((old)=>({
                accessToken: result.access_token ?? null,
                refreshToken: result.refresh_token ?? old?.refreshToken ?? null
            }));
        return result;
    }
    async signOut(tokenStore) {
        const tokenObj = await tokenStore.getOrWait();
        const res = await this.sendClientRequest("/auth/signout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refreshToken: tokenObj.refreshToken ?? ""
            })
        }, tokenStore);
        await res.json();
        tokenStore.set({
            accessToken: null,
            refreshToken: null
        });
    }
    async getClientUserByToken(tokenStore) {
        const response = await this.sendClientRequest("/current-user", {}, tokenStore);
        const user = await response.json();
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(new Error("Failed to get user"));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(user);
    }
    async listClientUserTeamPermissions(options, tokenStore) {
        const response = await this.sendClientRequest(`/current-user/teams/${options.teamId}/permissions?type=${options.type}&direct=${options.direct}`, {}, tokenStore);
        const permissions = await response.json();
        return permissions;
    }
    async listClientUserTeams(tokenStore) {
        const response = await this.sendClientRequest("/current-user/teams", {}, tokenStore);
        const teams = await response.json();
        return teams;
    }
    async getClientProject() {
        const response = await this.sendClientRequest("/projects/" + this.options.projectId, {}, null);
        const project = await response.json();
        if (!project) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(new Error("Failed to get project"));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(project);
    }
    async setClientUserCustomizableData(update, tokenStore) {
        await this.sendClientRequest("/current-user", {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(update)
        }, tokenStore);
    }
    async listProjects(tokenStore) {
        const response = await this.sendClientRequest("/projects", {}, tokenStore);
        if (!response.ok) {
            throw new Error("Failed to list projects: " + response.status + " " + await response.text());
        }
        const json = await response.json();
        return json;
    }
    async createProject(project, tokenStore) {
        const fetchResponse = await this.sendClientRequest("/projects", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(project)
        }, tokenStore);
        if (!fetchResponse.ok) {
            throw new Error("Failed to create project: " + fetchResponse.status + " " + await fetchResponse.text());
        }
        const json = await fetchResponse.json();
        return json;
    }
}
function getProductionModeErrors(project) {
    const errors = [];
    const fixUrlRelative = `/projects/${project.id}/domains`;
    if (project.evaluatedConfig.allowLocalhost) {
        errors.push({
            errorMessage: "Localhost is not allowed in production mode, turn off 'Allow localhost' in project settings",
            fixUrlRelative
        });
    }
    for (const { domain } of project.evaluatedConfig.domains){
        let url;
        try {
            url = new URL(domain);
        } catch (e) {
            errors.push({
                errorMessage: "Domain should be a valid URL: " + domain,
                fixUrlRelative
            });
            continue;
        }
        if (url.hostname === "localhost") {
            errors.push({
                errorMessage: "Domain should not be localhost: " + domain,
                fixUrlRelative
            });
        } else if (!url.hostname.includes(".") || url.hostname.match(/\d+(\.\d+)*/)) {
            errors.push({
                errorMessage: "Not a valid domain" + domain,
                fixUrlRelative
            });
        } else if (url.protocol !== "https:") {
            errors.push({
                errorMessage: "Domain should be HTTPS: " + domain,
                fixUrlRelative
            });
        }
    }
    return errors;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/serverInterface.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackServerInterface",
    ()=>StackServerInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/clientInterface.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-ssr] (ecmascript)");
;
;
class StackServerInterface extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackClientInterface"] {
    options;
    constructor(options){
        super(options);
        this.options = options;
    }
    async sendServerRequest(path, options, tokenStore, requestType = "server") {
        return await this.sendClientRequest(path, {
            ...options,
            headers: {
                "x-stack-secret-server-key": "secretServerKey" in this.options ? this.options.secretServerKey : "",
                ...options.headers
            }
        }, tokenStore, requestType);
    }
    async getServerUserByToken(tokenStore) {
        const response = await this.sendServerRequest("/current-user?server=true", {}, tokenStore);
        const user = await response.json();
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(new Error("Failed to get user"));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(user);
    }
    async getServerUserById(userId) {
        const response = await this.sendServerRequest(`/users/${userId}?server=true`, {}, null);
        const user = await response.json();
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(new Error("Failed to get user"));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(user);
    }
    async listServerUserTeamPermissions(options, tokenStore) {
        const response = await this.sendServerRequest(`/current-user/teams/${options.teamId}/permissions?type=${options.type}&direct=${options.direct}&server=true`, {}, tokenStore);
        const permissions = await response.json();
        return permissions;
    }
    async listServerUserTeams(tokenStore) {
        const response = await this.sendServerRequest("/current-user/teams?server=true", {}, tokenStore);
        const teams = await response.json();
        return teams;
    }
    async listPermissionDefinitions() {
        const response = await this.sendServerRequest(`/permission-definitions?server=true`, {}, null);
        return await response.json();
    }
    async createPermissionDefinition(data) {
        const response = await this.sendServerRequest("/permission-definitions?server=true", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                scope: {
                    type: "any-team"
                }
            })
        }, null);
        return await response.json();
    }
    async updatePermissionDefinition(permissionId, data) {
        await this.sendServerRequest(`/permission-definitions/${permissionId}?server=true`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        }, null);
    }
    async deletePermissionDefinition(permissionId) {
        await this.sendServerRequest(`/permission-definitions/${permissionId}?server=true`, {
            method: "DELETE"
        }, null);
    }
    async listUsers() {
        const response = await this.sendServerRequest("/users?server=true", {}, null);
        return await response.json();
    }
    async listTeams() {
        const response = await this.sendServerRequest("/teams?server=true", {}, null);
        const json = await response.json();
        return json;
    }
    async listTeamMembers(teamId) {
        const response = await this.sendServerRequest(`/teams/${teamId}/users?server=true`, {}, null);
        return await response.json();
    }
    async createTeam(data) {
        const response = await this.sendServerRequest("/teams?server=true", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        }, null);
        return await response.json();
    }
    async updateTeam(teamId, data) {
        await this.sendServerRequest(`/teams/${teamId}?server=true`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(data)
        }, null);
    }
    async deleteTeam(teamId) {
        await this.sendServerRequest(`/teams/${teamId}?server=true`, {
            method: "DELETE"
        }, null);
    }
    async addUserToTeam(options) {
        await this.sendServerRequest(`/teams/${options.teamId}/users/${options.userId}?server=true`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({})
        }, null);
    }
    async removeUserFromTeam(options) {
        await this.sendServerRequest(`/teams/${options.teamId}/users/${options.userId}?server=true`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({})
        }, null);
    }
    async setServerUserCustomizableData(userId, update) {
        await this.sendServerRequest(`/users/${userId}?server=true`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(update)
        }, null);
    }
    async listTeamMemberPermissions(options) {
        const response = await this.sendServerRequest(`/teams/${options.teamId}/users/${options.userId}/permissions?server=true&type=${options.type}&direct=${options.direct}`, {}, null);
        return await response.json();
    }
    async grantTeamUserPermission(teamId, userId, permissionId, type) {
        await this.sendServerRequest(`/teams/${teamId}/users/${userId}/permissions/${permissionId}?server=true`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                type
            })
        }, null);
    }
    async revokeTeamUserPermission(teamId, userId, permissionId, type) {
        await this.sendServerRequest(`/teams/${teamId}/users/${userId}/permissions/${permissionId}?server=true`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                type
            })
        }, null);
    }
    async deleteServerUser(userId) {
        await this.sendServerRequest(`/users/${userId}?server=true`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({})
        }, null);
    }
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/adminInterface.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackAdminInterface",
    ()=>StackAdminInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/serverInterface.js [app-ssr] (ecmascript)");
;
class StackAdminInterface extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StackServerInterface"] {
    options;
    constructor(options){
        super(options);
        this.options = options;
    }
    async sendAdminRequest(path, options, tokenStore, requestType = "admin") {
        return await this.sendServerRequest(path, {
            ...options,
            headers: {
                "x-stack-super-secret-admin-key": "superSecretAdminKey" in this.options ? this.options.superSecretAdminKey : "",
                ...options.headers
            }
        }, tokenStore, requestType);
    }
    async getProject(options) {
        const response = await this.sendAdminRequest("/projects/" + encodeURIComponent(this.projectId), {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(options ?? {})
        }, null);
        return await response.json();
    }
    async updateProject(update) {
        const response = await this.sendAdminRequest("/projects/" + encodeURIComponent(this.projectId), {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(update)
        }, null);
        return await response.json();
    }
    async createApiKeySet(options) {
        const response = await this.sendServerRequest("/api-keys", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(options)
        }, null);
        return await response.json();
    }
    async listApiKeySets() {
        const response = await this.sendAdminRequest("/api-keys", {}, null);
        const json = await response.json();
        return json.map((k)=>k);
    }
    async revokeApiKeySetById(id) {
        await this.sendAdminRequest(`/api-keys/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                revoke: true
            })
        }, null);
    }
    async getApiKeySet(id, tokenStore) {
        const response = await this.sendAdminRequest(`/api-keys/${id}`, {}, tokenStore);
        return await response.json();
    }
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/clientInterface.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/serverInterface.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$adminInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/adminInterface.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/known-errors.js [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/react.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNodeText",
    ()=>getNodeText,
    "suspend",
    ()=>suspend,
    "suspendIfSsr",
    ()=>suspendIfSsr
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/strings.js [app-ssr] (ecmascript)");
;
;
;
function getNodeText(node) {
    if ([
        "number",
        "string"
    ].includes(typeof node)) {
        return `${node}`;
    }
    if (!node) {
        return "";
    }
    if (Array.isArray(node)) {
        return node.map(getNodeText).join("");
    }
    if (typeof node === "object" && "props" in node) {
        return getNodeText(node.props.children);
    }
    throw new Error(`Unknown node type: ${typeof node}`);
}
function suspend() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["use"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["neverResolve"])());
    throw new Error("Somehow a Promise that never resolves was resolved?");
}
function suspendIfSsr(caller) {
    if ("TURBOPACK compile-time truthy", 1) {
        const error = Object.assign(new Error(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deindent"]`
        ${caller ?? "This code path"} attempted to display a loading indicator during SSR by falling back to the nearest Suspense boundary. If you see this error, it means no Suspense boundary was found, and no loading indicator could be displayed. Make sure you are not catching this error with try-catch, and that the component is rendered inside a Suspense boundary, for example by adding a \`loading.tsx\` file in your app directory.

        See: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout

        More information on SSR and Suspense boundaries: https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content
      `), {
            // set the digest so nextjs doesn't log the error
            // https://github.com/vercel/next.js/blob/d01d6d9c35a8c2725b3d74c1402ab76d4779a6cf/packages/next/src/shared/lib/lazy-dynamic/bailout-to-csr.ts#L14
            digest: "BAILOUT_TO_CLIENT_SIDE_RENDERING",
            reason: caller ?? "suspendIfSsr()"
        });
        throw error;
    }
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/objects.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Assumes both objects are primitives, arrays, or non-function plain objects, and compares them deeply.
 *
 * Note that since they are assumed to be plain objects, this function does not compare prototypes.
 */ __turbopack_context__.s([
    "deepPlainEquals",
    ()=>deepPlainEquals,
    "filterUndefined",
    ()=>filterUndefined,
    "omit",
    ()=>omit,
    "pick",
    ()=>pick,
    "typedAssign",
    ()=>typedAssign,
    "typedEntries",
    ()=>typedEntries,
    "typedFromEntries",
    ()=>typedFromEntries,
    "typedKeys",
    ()=>typedKeys,
    "typedValues",
    ()=>typedValues
]);
function deepPlainEquals(obj1, obj2) {
    if (typeof obj1 !== typeof obj2) return false;
    if (obj1 === obj2) return true;
    switch(typeof obj1){
        case 'object':
            {
                if (!obj1 || !obj2) return false;
                if (Array.isArray(obj1) || Array.isArray(obj2)) {
                    if (!Array.isArray(obj1) || !Array.isArray(obj2)) return false;
                    if (obj1.length !== obj2.length) return false;
                    return obj1.every((v, i)=>deepPlainEquals(v, obj2[i]));
                }
                const keys1 = Object.keys(obj1);
                const keys2 = Object.keys(obj2);
                if (keys1.length !== keys2.length) return false;
                return keys1.every((k)=>k in obj2 && deepPlainEquals(obj1[k], obj2[k]));
            }
        case 'undefined':
        case 'string':
        case 'number':
        case 'boolean':
        case 'bigint':
        case 'symbol':
        case 'function':
            {
                return false;
            }
        default:
            {
                throw new Error("Unexpected typeof " + typeof obj1);
            }
    }
}
function typedEntries(obj) {
    return Object.entries(obj);
}
function typedFromEntries(entries) {
    return Object.fromEntries(entries);
}
function typedKeys(obj) {
    return Object.keys(obj);
}
function typedValues(obj) {
    return Object.values(obj);
}
function typedAssign(target, source) {
    Object.assign(target, source);
}
function filterUndefined(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v])=>v !== undefined));
}
function pick(obj, keys) {
    return Object.fromEntries(Object.entries(obj).filter(([k])=>keys.includes(k)));
}
function omit(obj, keys) {
    return Object.fromEntries(Object.entries(obj).filter(([k])=>!keys.includes(k)));
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/maps.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DependenciesMap",
    ()=>DependenciesMap,
    "MaybeWeakMap",
    ()=>MaybeWeakMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-ssr] (ecmascript)");
;
class MaybeWeakMap {
    _primitiveMap;
    _weakMap;
    constructor(entries){
        const entriesArray = [
            ...entries ?? []
        ];
        this._primitiveMap = new Map(entriesArray.filter((e)=>!this._isAllowedInWeakMap(e[0])));
        this._weakMap = new WeakMap(entriesArray.filter((e)=>this._isAllowedInWeakMap(e[0])));
    }
    _isAllowedInWeakMap(key) {
        return typeof key === "object" && key !== null || typeof key === "symbol" && Symbol.keyFor(key) === undefined;
    }
    get(key) {
        if (this._isAllowedInWeakMap(key)) {
            return this._weakMap.get(key);
        } else {
            return this._primitiveMap.get(key);
        }
    }
    set(key, value) {
        if (this._isAllowedInWeakMap(key)) {
            this._weakMap.set(key, value);
        } else {
            this._primitiveMap.set(key, value);
        }
        return this;
    }
    delete(key) {
        if (this._isAllowedInWeakMap(key)) {
            return this._weakMap.delete(key);
        } else {
            return this._primitiveMap.delete(key);
        }
    }
    has(key) {
        if (this._isAllowedInWeakMap(key)) {
            return this._weakMap.has(key);
        } else {
            return this._primitiveMap.has(key);
        }
    }
    [Symbol.toStringTag] = "MaybeWeakMap";
}
class DependenciesMap {
    _inner = {
        map: new MaybeWeakMap(),
        hasValue: false,
        value: undefined
    };
    _valueToResult(inner) {
        if (inner.hasValue) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(inner.value);
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(undefined);
        }
    }
    _unwrapFromInner(dependencies, inner) {
        if (dependencies.length === 0) {
            return this._valueToResult(inner);
        } else {
            const [key, ...rest] = dependencies;
            const newInner = inner.map.get(key);
            if (!newInner) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(undefined);
            }
            return this._unwrapFromInner(rest, newInner);
        }
    }
    _setInInner(dependencies, value, inner) {
        if (dependencies.length === 0) {
            const res = this._valueToResult(inner);
            if (value.status === "ok") {
                inner.hasValue = true;
                inner.value = value.data;
            } else {
                inner.hasValue = false;
                inner.value = undefined;
            }
            return res;
        } else {
            const [key, ...rest] = dependencies;
            let newInner = inner.map.get(key);
            if (!newInner) {
                inner.map.set(key, newInner = {
                    map: new MaybeWeakMap(),
                    hasValue: false,
                    value: undefined
                });
            }
            return this._setInInner(rest, value, newInner);
        }
    }
    get(dependencies) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].or(this._unwrapFromInner(dependencies, this._inner), undefined);
    }
    set(dependencies, value) {
        this._setInInner(dependencies, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].ok(value), this._inner);
        return this;
    }
    delete(dependencies) {
        return this._setInInner(dependencies, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Result"].error(undefined), this._inner).status === "ok";
    }
    has(dependencies) {
        return this._unwrapFromInner(dependencies, this._inner).status === "ok";
    }
    clear() {
        this._inner = {
            map: new MaybeWeakMap(),
            hasValue: false,
            value: undefined
        };
    }
    [Symbol.toStringTag] = "DependenciesMap";
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/caches.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AsyncCache",
    ()=>AsyncCache,
    "cacheFunction",
    ()=>cacheFunction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$maps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/maps.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/objects.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/stores.js [app-ssr] (ecmascript)");
;
;
;
;
function cacheFunction(f) {
    const dependenciesMap = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$maps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DependenciesMap"]();
    return (...args)=>{
        if (dependenciesMap.has(args)) {
            return dependenciesMap.get(args);
        }
        const value = f(...args);
        dependenciesMap.set(args, value);
        return value;
    };
}
class AsyncCache {
    _fetcher;
    _options;
    _map = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$maps$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DependenciesMap"]();
    constructor(_fetcher, _options = {}){
        this._fetcher = _fetcher;
        this._options = _options;
    // nothing here yet
    }
    _createKeyed(functionName) {
        return (key, ...args)=>{
            const valueCache = this.getValueCache(key);
            return valueCache[functionName].apply(valueCache, args);
        };
    }
    getValueCache(dependencies) {
        let cache = this._map.get(dependencies);
        if (!cache) {
            cache = new AsyncValueCache(async ()=>await this._fetcher(dependencies), {
                ...this._options,
                onSubscribe: this._options.onSubscribe ? (cb)=>this._options.onSubscribe(dependencies, cb) : undefined
            });
            this._map.set(dependencies, cache);
        }
        return cache;
    }
    isCacheAvailable = this._createKeyed("isCacheAvailable");
    getIfCached = this._createKeyed("getIfCached");
    getOrWait = this._createKeyed("getOrWait");
    forceSetCachedValue = this._createKeyed("forceSetCachedValue");
    forceSetCachedValueAsync = this._createKeyed("forceSetCachedValueAsync");
    refresh = this._createKeyed("refresh");
    invalidate = this._createKeyed("invalidate");
    onChange = this._createKeyed("onChange");
}
class AsyncValueCache {
    _options;
    _store;
    _pendingPromise;
    _fetcher;
    _rateLimitOptions;
    _subscriptionsCount = 0;
    _unsubscribers = [];
    constructor(fetcher, _options = {}){
        this._options = _options;
        this._store = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AsyncStore"]();
        this._rateLimitOptions = {
            concurrency: 1,
            throttleMs: 300,
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filterUndefined"])(_options.rateLimiter ?? {})
        };
        this._fetcher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rateLimited"])(fetcher, {
            ...this._rateLimitOptions,
            batchCalls: true
        });
    }
    isCacheAvailable() {
        return this._store.isAvailable();
    }
    getIfCached() {
        return this._store.get();
    }
    getOrWait(cacheStrategy) {
        const cached = this.getIfCached();
        if (cacheStrategy === "read-write" && cached.status === "ok") {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolved"])(cached.data);
        }
        return this._refetch(cacheStrategy);
    }
    _set(value) {
        this._store.set(value);
    }
    _setAsync(value) {
        const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pending"])(value);
        this._pendingPromise = promise;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pending"])(this._store.setAsync(promise));
    }
    _refetch(cacheStrategy) {
        if (cacheStrategy === "read-write" && this._pendingPromise) {
            return this._pendingPromise;
        }
        const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pending"])(this._fetcher());
        if (cacheStrategy === "never") {
            return promise;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pending"])(this._setAsync(promise).then(()=>promise));
    }
    forceSetCachedValue(value) {
        this._set(value);
    }
    forceSetCachedValueAsync(value) {
        return this._setAsync(value);
    }
    async refresh() {
        return await this.getOrWait("write-only");
    }
    async invalidate() {
        this._store.setUnavailable();
        this._pendingPromise = undefined;
        return await this.refresh();
    }
    onChange(callback) {
        const storeObj = this._store.onChange(callback);
        if (this._subscriptionsCount++ === 0 && this._options.onSubscribe) {
            const unsubscribe = this._options.onSubscribe(()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronously"])(this.refresh());
            });
            this._unsubscribers.push(unsubscribe);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["runAsynchronously"])(this.refresh());
        let hasUnsubscribed = false;
        return {
            unsubscribe: ()=>{
                if (hasUnsubscribed) return;
                hasUnsubscribed = true;
                storeObj.unsubscribe();
                if (--this._subscriptionsCount === 0) {
                    for (const unsubscribe of this._unsubscribers){
                        unsubscribe();
                    }
                }
            }
        };
    }
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/hooks/use-async-callback.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAsyncCallback",
    ()=>useAsyncCallback,
    "useAsyncCallbackWithLoggedError",
    ()=>useAsyncCallbackWithLoggedError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-ssr] (ecmascript)");
;
;
function useAsyncCallback(callback, deps) {
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(undefined);
    const [loadingCount, setLoadingCount] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(0);
    const cb = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useCallback(async (...args)=>{
        setLoadingCount((c)=>c + 1);
        try {
            return await callback(...args);
        } catch (e) {
            setError(e);
            throw e;
        } finally{
            setLoadingCount((c)=>c - 1);
        }
    }, deps);
    return [
        cb,
        loadingCount > 0,
        error
    ];
}
function useAsyncCallbackWithLoggedError(callback, deps) {
    const [newCallback, loading] = useAsyncCallback(async (...args)=>{
        try {
            return await callback(...args);
        } catch (e) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureError"])("async-callback", e);
            throw e;
        }
    }, deps);
    return [
        newCallback,
        loading
    ];
}
}),
];

//# sourceMappingURL=4b99c_%40stackframe_stack-shared_dist_3c2e5a9a._.js.map