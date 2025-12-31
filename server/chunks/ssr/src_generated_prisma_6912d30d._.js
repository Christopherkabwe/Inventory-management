module.exports = [
"[project]/src/generated/prisma/query_compiler_bg.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var h = Object.defineProperty;
var T = Object.getOwnPropertyDescriptor;
var M = Object.getOwnPropertyNames;
var j = Object.prototype.hasOwnProperty;
var D = (e, t)=>{
    for(var n in t)h(e, n, {
        get: t[n],
        enumerable: !0
    });
}, O = (e, t, n, _)=>{
    if (t && typeof t == "object" || typeof t == "function") for (let r of M(t))!j.call(e, r) && r !== n && h(e, r, {
        get: ()=>t[r],
        enumerable: !(_ = T(t, r)) || _.enumerable
    });
    return e;
};
var B = (e)=>O(h({}, "__esModule", {
        value: !0
    }), e);
var xe = {};
D(xe, {
    QueryCompiler: ()=>F,
    __wbg_Error_e83987f665cf5504: ()=>q,
    __wbg_Number_bb48ca12f395cd08: ()=>C,
    __wbg_String_8f0eb39a4a4c2f66: ()=>k,
    __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68: ()=>W,
    __wbg___wbindgen_debug_string_df47ffb5e35e6763: ()=>V,
    __wbg___wbindgen_in_bb933bd9e1b3bc0f: ()=>z,
    __wbg___wbindgen_is_object_c818261d21f283a4: ()=>L,
    __wbg___wbindgen_is_string_fbb76cb2940daafd: ()=>P,
    __wbg___wbindgen_is_undefined_2d472862bd29a478: ()=>Q,
    __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147: ()=>Y,
    __wbg___wbindgen_number_get_a20bf9b85341449d: ()=>G,
    __wbg___wbindgen_string_get_e4f06c90489ad01b: ()=>J,
    __wbg___wbindgen_throw_b855445ff6a94295: ()=>X,
    __wbg_entries_e171b586f8f6bdbf: ()=>H,
    __wbg_getTime_14776bfb48a1bff9: ()=>K,
    __wbg_get_7bed016f185add81: ()=>Z,
    __wbg_get_with_ref_key_1dc361bd10053bfe: ()=>v,
    __wbg_instanceof_ArrayBuffer_70beb1189ca63b38: ()=>ee,
    __wbg_instanceof_Uint8Array_20c8e73002f7af98: ()=>te,
    __wbg_isSafeInteger_d216eda7911dde36: ()=>ne,
    __wbg_length_69bca3cb64fc8748: ()=>re,
    __wbg_length_cdd215e10d9dd507: ()=>_e,
    __wbg_new_0_f9740686d739025c: ()=>oe,
    __wbg_new_1acc0b6eea89d040: ()=>ce,
    __wbg_new_5a79be3ab53b8aa5: ()=>ie,
    __wbg_new_68651c719dcda04e: ()=>se,
    __wbg_new_e17d9f43105b08be: ()=>ue,
    __wbg_prototypesetcall_2a6620b6922694b2: ()=>fe,
    __wbg_set_3f1d0b984ed272ed: ()=>be,
    __wbg_set_907fb406c34a251d: ()=>de,
    __wbg_set_c213c871859d6500: ()=>ae,
    __wbg_set_message_82ae475bb413aa5c: ()=>ge,
    __wbg_set_wasm: ()=>N,
    __wbindgen_cast_2241b6af4c4b2941: ()=>le,
    __wbindgen_cast_4625c577ab2ec9ee: ()=>we,
    __wbindgen_cast_9ae0607507abb057: ()=>pe,
    __wbindgen_cast_d6cd19b81560fd6e: ()=>ye,
    __wbindgen_init_externref_table: ()=>me
});
module.exports = B(xe);
var A = ()=>{};
A.prototype = A;
let o;
function N(e) {
    o = e;
}
let p = null;
function a() {
    return (p === null || p.byteLength === 0) && (p = new Uint8Array(o.memory.buffer)), p;
}
let y = new TextDecoder("utf-8", {
    ignoreBOM: !0,
    fatal: !0
});
y.decode();
const U = 2146435072;
let S = 0;
function R(e, t) {
    return S += t, S >= U && (y = new TextDecoder("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    }), y.decode(), S = t), y.decode(a().subarray(e, e + t));
}
function m(e, t) {
    return e = e >>> 0, R(e, t);
}
let f = 0;
const g = new TextEncoder;
"encodeInto" in g || (g.encodeInto = function(e, t) {
    const n = g.encode(e);
    return t.set(n), {
        read: e.length,
        written: n.length
    };
});
function l(e, t, n) {
    if (n === void 0) {
        const i = g.encode(e), d = t(i.length, 1) >>> 0;
        return a().subarray(d, d + i.length).set(i), f = i.length, d;
    }
    let _ = e.length, r = t(_, 1) >>> 0;
    const s = a();
    let c = 0;
    for(; c < _; c++){
        const i = e.charCodeAt(c);
        if (i > 127) break;
        s[r + c] = i;
    }
    if (c !== _) {
        c !== 0 && (e = e.slice(c)), r = n(r, _, _ = c + e.length * 3, 1) >>> 0;
        const i = a().subarray(r + c, r + _), d = g.encodeInto(e, i);
        c += d.written, r = n(r, _, c, 1) >>> 0;
    }
    return f = c, r;
}
let b = null;
function u() {
    return (b === null || b.buffer.detached === !0 || b.buffer.detached === void 0 && b.buffer !== o.memory.buffer) && (b = new DataView(o.memory.buffer)), b;
}
function x(e) {
    return e == null;
}
function I(e) {
    const t = typeof e;
    if (t == "number" || t == "boolean" || e == null) return `${e}`;
    if (t == "string") return `"${e}"`;
    if (t == "symbol") {
        const r = e.description;
        return r == null ? "Symbol" : `Symbol(${r})`;
    }
    if (t == "function") {
        const r = e.name;
        return typeof r == "string" && r.length > 0 ? `Function(${r})` : "Function";
    }
    if (Array.isArray(e)) {
        const r = e.length;
        let s = "[";
        r > 0 && (s += I(e[0]));
        for(let c = 1; c < r; c++)s += ", " + I(e[c]);
        return s += "]", s;
    }
    const n = /\[object ([^\]]+)\]/.exec(toString.call(e));
    let _;
    if (n && n.length > 1) _ = n[1];
    else return toString.call(e);
    if (_ == "Object") try {
        return "Object(" + JSON.stringify(e) + ")";
    } catch  {
        return "Object";
    }
    return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : _;
}
function $(e, t) {
    return e = e >>> 0, a().subarray(e / 1, e / 1 + t);
}
function w(e) {
    const t = o.__wbindgen_externrefs.get(e);
    return o.__externref_table_dealloc(e), t;
}
const E = typeof FinalizationRegistry > "u" ? {
    register: ()=>{},
    unregister: ()=>{}
} : new FinalizationRegistry((e)=>o.__wbg_querycompiler_free(e >>> 0, 1));
class F {
    __destroy_into_raw() {
        const t = this.__wbg_ptr;
        return this.__wbg_ptr = 0, E.unregister(this), t;
    }
    free() {
        const t = this.__destroy_into_raw();
        o.__wbg_querycompiler_free(t, 0);
    }
    compileBatch(t) {
        const n = l(t, o.__wbindgen_malloc, o.__wbindgen_realloc), _ = f, r = o.querycompiler_compileBatch(this.__wbg_ptr, n, _);
        if (r[2]) throw w(r[1]);
        return w(r[0]);
    }
    constructor(t){
        const n = o.querycompiler_new(t);
        if (n[2]) throw w(n[1]);
        return this.__wbg_ptr = n[0] >>> 0, E.register(this, this.__wbg_ptr, this), this;
    }
    compile(t) {
        const n = l(t, o.__wbindgen_malloc, o.__wbindgen_realloc), _ = f, r = o.querycompiler_compile(this.__wbg_ptr, n, _);
        if (r[2]) throw w(r[1]);
        return w(r[0]);
    }
}
Symbol.dispose && (F.prototype[Symbol.dispose] = F.prototype.free);
function q(e, t) {
    return Error(m(e, t));
}
function C(e) {
    return Number(e);
}
function k(e, t) {
    const n = String(t), _ = l(n, o.__wbindgen_malloc, o.__wbindgen_realloc), r = f;
    u().setInt32(e + 4 * 1, r, !0), u().setInt32(e + 4 * 0, _, !0);
}
function W(e) {
    const t = e, n = typeof t == "boolean" ? t : void 0;
    return x(n) ? 16777215 : n ? 1 : 0;
}
function V(e, t) {
    const n = I(t), _ = l(n, o.__wbindgen_malloc, o.__wbindgen_realloc), r = f;
    u().setInt32(e + 4 * 1, r, !0), u().setInt32(e + 4 * 0, _, !0);
}
function z(e, t) {
    return e in t;
}
function L(e) {
    const t = e;
    return typeof t == "object" && t !== null;
}
function P(e) {
    return typeof e == "string";
}
function Q(e) {
    return e === void 0;
}
function Y(e, t) {
    return e == t;
}
function G(e, t) {
    const n = t, _ = typeof n == "number" ? n : void 0;
    u().setFloat64(e + 8 * 1, x(_) ? 0 : _, !0), u().setInt32(e + 4 * 0, !x(_), !0);
}
function J(e, t) {
    const n = t, _ = typeof n == "string" ? n : void 0;
    var r = x(_) ? 0 : l(_, o.__wbindgen_malloc, o.__wbindgen_realloc), s = f;
    u().setInt32(e + 4 * 1, s, !0), u().setInt32(e + 4 * 0, r, !0);
}
function X(e, t) {
    throw new Error(m(e, t));
}
function H(e) {
    return Object.entries(e);
}
function K(e) {
    return e.getTime();
}
function Z(e, t) {
    return e[t >>> 0];
}
function v(e, t) {
    return e[t];
}
function ee(e) {
    let t;
    try {
        t = e instanceof ArrayBuffer;
    } catch  {
        t = !1;
    }
    return t;
}
function te(e) {
    let t;
    try {
        t = e instanceof Uint8Array;
    } catch  {
        t = !1;
    }
    return t;
}
function ne(e) {
    return Number.isSafeInteger(e);
}
function re(e) {
    return e.length;
}
function _e(e) {
    return e.length;
}
function oe() {
    return new Date;
}
function ce() {
    return new Object;
}
function ie(e) {
    return new Uint8Array(e);
}
function se() {
    return new Map;
}
function ue() {
    return new Array;
}
function fe(e, t, n) {
    Uint8Array.prototype.set.call($(e, t), n);
}
function be(e, t, n) {
    e[t] = n;
}
function de(e, t, n) {
    return e.set(t, n);
}
function ae(e, t, n) {
    e[t >>> 0] = n;
}
function ge(e, t) {
    /*TURBOPACK member replacement*/ __turbopack_context__.g.PRISMA_WASM_PANIC_REGISTRY.set_message(m(e, t));
}
function le(e, t) {
    return m(e, t);
}
function we(e) {
    return BigInt.asUintN(64, e);
}
function pe(e) {
    return e;
}
function ye(e) {
    return e;
}
function me() {
    const e = o.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
}
0 && (module.exports = {
    QueryCompiler,
    __wbg_Error_e83987f665cf5504,
    __wbg_Number_bb48ca12f395cd08,
    __wbg_String_8f0eb39a4a4c2f66,
    __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68,
    __wbg___wbindgen_debug_string_df47ffb5e35e6763,
    __wbg___wbindgen_in_bb933bd9e1b3bc0f,
    __wbg___wbindgen_is_object_c818261d21f283a4,
    __wbg___wbindgen_is_string_fbb76cb2940daafd,
    __wbg___wbindgen_is_undefined_2d472862bd29a478,
    __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147,
    __wbg___wbindgen_number_get_a20bf9b85341449d,
    __wbg___wbindgen_string_get_e4f06c90489ad01b,
    __wbg___wbindgen_throw_b855445ff6a94295,
    __wbg_entries_e171b586f8f6bdbf,
    __wbg_getTime_14776bfb48a1bff9,
    __wbg_get_7bed016f185add81,
    __wbg_get_with_ref_key_1dc361bd10053bfe,
    __wbg_instanceof_ArrayBuffer_70beb1189ca63b38,
    __wbg_instanceof_Uint8Array_20c8e73002f7af98,
    __wbg_isSafeInteger_d216eda7911dde36,
    __wbg_length_69bca3cb64fc8748,
    __wbg_length_cdd215e10d9dd507,
    __wbg_new_0_f9740686d739025c,
    __wbg_new_1acc0b6eea89d040,
    __wbg_new_5a79be3ab53b8aa5,
    __wbg_new_68651c719dcda04e,
    __wbg_new_e17d9f43105b08be,
    __wbg_prototypesetcall_2a6620b6922694b2,
    __wbg_set_3f1d0b984ed272ed,
    __wbg_set_907fb406c34a251d,
    __wbg_set_c213c871859d6500,
    __wbg_set_message_82ae475bb413aa5c,
    __wbg_set_wasm,
    __wbindgen_cast_2241b6af4c4b2941,
    __wbindgen_cast_4625c577ab2ec9ee,
    __wbindgen_cast_9ae0607507abb057,
    __wbindgen_cast_d6cd19b81560fd6e,
    __wbindgen_init_externref_table
});
}),
"[project]/src/generated/prisma/index.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */ // biome-ignore-all lint: generated file
Object.defineProperty(exports, "__esModule", {
    value: true
});
const { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientRustPanicError, PrismaClientInitializationError, PrismaClientValidationError, getPrismaClient, sqltag, empty, join, raw, skip, Decimal, Debug, DbNull, JsonNull, AnyNull, NullTypes, makeStrictEnum, Extensions, warnOnce, defineDmmfProperty, Public, getRuntime, createParam } = __turbopack_context__.r("[project]/src/generated/prisma/runtime/client.js [app-rsc] (ecmascript)");
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 7.2.0
 * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
 */ Prisma.prismaVersion = {
    client: "7.2.0",
    engine: "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3"
};
Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */ Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;
/**
* Extensions
*/ Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;
/**
 * Shorthand utilities for JSON filtering
 */ Prisma.DbNull = DbNull;
Prisma.JsonNull = JsonNull;
Prisma.AnyNull = AnyNull;
Prisma.NullTypes = NullTypes;
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
/**
 * Enums
 */ exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.ProductListScalarFieldEnum = {
    id: 'id',
    sku: 'sku',
    name: 'name',
    price: 'price',
    packSize: 'packSize',
    category: 'category',
    weightValue: 'weightValue',
    weightUnit: 'weightUnit',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.InventoryScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    locationId: 'locationId',
    quantity: 'quantity',
    lowStockAt: 'lowStockAt',
    expiryDate: 'expiryDate',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.LocationScalarFieldEnum = {
    id: 'id',
    name: 'name',
    address: 'address',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CustomerScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    country: 'country',
    city: 'city',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SaleScalarFieldEnum = {
    id: 'id',
    customerId: 'customerId',
    customerName: 'customerName',
    productId: 'productId',
    locationId: 'locationId',
    quantity: 'quantity',
    salePrice: 'salePrice',
    totalAmount: 'totalAmount',
    saleDate: 'saleDate',
    isReturn: 'isReturn',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.TransferScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    fromLocationId: 'fromLocationId',
    toLocationId: 'toLocationId',
    quantity: 'quantity',
    transferDate: 'transferDate',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.Prisma.ProductionScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    quantity: 'quantity',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.Prisma.AdjustmentScalarFieldEnum = {
    id: 'id',
    productId: 'productId',
    locationId: 'locationId',
    type: 'type',
    quantity: 'quantity',
    reason: 'reason',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Prisma.ModelName = {
    ProductList: 'ProductList',
    Inventory: 'Inventory',
    Location: 'Location',
    Customer: 'Customer',
    Sale: 'Sale',
    Transfer: 'Transfer',
    Production: 'Production',
    Adjustment: 'Adjustment'
};
/**
 * Create the Client
 */ const config = {
    "previewFeatures": [
        "clientExtensions"
    ],
    "clientVersion": "7.2.0",
    "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
    "activeProvider": "postgresql",
    "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../src/generated/prisma\"\n  engineType      = \"binary\"\n  previewFeatures = [\"clientExtensions\"] // ← enable JS output mode\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\n// -------------------- PRODUCTS --------------------\nmodel ProductList {\n  id          String   @id @default(cuid())\n  sku         String   @unique\n  name        String\n  price       Float\n  packSize    Int\n  category    String?\n  weightValue Float\n  weightUnit  String\n  createdBy   String\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  inventories Inventory[]\n  sales       Sale[]\n  transfers   Transfer[]\n  productions Production[]\n  adjustments Adjustment[]\n\n  @@index([sku])\n}\n\n// -------------------- INVENTORY --------------------\nmodel Inventory {\n  id         String      @id @default(cuid())\n  productId  String\n  product    ProductList @relation(fields: [productId], references: [id])\n  locationId String\n  location   Location    @relation(fields: [locationId], references: [id])\n  quantity   Int\n  lowStockAt Int\n  expiryDate DateTime?\n  createdBy  String\n  createdAt  DateTime    @default(now())\n  updatedAt  DateTime    @updatedAt\n\n  @@unique([productId, locationId])\n  @@index([productId])\n}\n\n// -------------------- LOCATIONS --------------------\nmodel Location {\n  id        String   @id @default(cuid())\n  name      String   @unique\n  address   String?\n  createdBy String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  inventories   Inventory[]\n  sales         Sale[]\n  transfersFrom Transfer[]   @relation(\"TransfersFrom\")\n  transfersTo   Transfer[]   @relation(\"TransfersTo\")\n  adjustments   Adjustment[]\n}\n\n// -------------------- CUSTOMERS --------------------\nmodel Customer {\n  id        String   @id @default(cuid())\n  name      String\n  email     String   @unique\n  phone     String\n  country   String\n  city      String\n  createdBy String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  sales Sale[]\n}\n\n// -------------------- SALES --------------------\nmodel Sale {\n  id           String      @id @default(cuid())\n  customerId   String\n  customerName String\n  customer     Customer    @relation(fields: [customerId], references: [id])\n  productId    String\n  product      ProductList @relation(fields: [productId], references: [id], onDelete: Cascade)\n  locationId   String\n  location     Location    @relation(fields: [locationId], references: [id])\n  quantity     Int\n  salePrice    Float\n  totalAmount  Float\n  saleDate     DateTime    @default(now())\n  isReturn     Boolean     @default(false) // track returns\n  createdBy    String\n  createdAt    DateTime    @default(now())\n  updatedAt    DateTime    @updatedAt\n\n  @@index([customerId])\n  @@index([productId])\n}\n\n// -------------------- TRANSFERS (IBT) --------------------\nmodel Transfer {\n  id             String      @id @default(cuid())\n  productId      String\n  product        ProductList @relation(fields: [productId], references: [id])\n  fromLocationId String?\n  fromLocation   Location?   @relation(\"TransfersFrom\", fields: [fromLocationId], references: [id])\n  toLocationId   String?\n  toLocation     Location?   @relation(\"TransfersTo\", fields: [toLocationId], references: [id])\n  quantity       Int\n  transferDate   DateTime    @default(now())\n  createdBy      String\n  createdAt      DateTime    @default(now())\n}\n\n// -------------------- PRODUCTION --------------------\nmodel Production {\n  id        String      @id @default(cuid())\n  productId String\n  product   ProductList @relation(fields: [productId], references: [id])\n  quantity  Int\n  createdBy String\n  createdAt DateTime    @default(now())\n}\n\n// -------------------- ADJUSTMENTS --------------------\nmodel Adjustment {\n  id         String      @id @default(cuid())\n  productId  String\n  product    ProductList @relation(fields: [productId], references: [id])\n  locationId String\n  location   Location    @relation(fields: [locationId], references: [id])\n  type       String // 'REBAG_GAIN', 'REBAG_LOSS', 'DAMAGED', 'EXPIRED', etc.\n  quantity   Int\n  reason     String? // optional note\n  createdBy  String\n  createdAt  DateTime    @default(now())\n}\n"
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"ProductList\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sku\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"packSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"category\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"weightValue\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"weightUnit\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"inventories\",\"kind\":\"object\",\"type\":\"Inventory\",\"relationName\":\"InventoryToProductList\"},{\"name\":\"sales\",\"kind\":\"object\",\"type\":\"Sale\",\"relationName\":\"ProductListToSale\"},{\"name\":\"transfers\",\"kind\":\"object\",\"type\":\"Transfer\",\"relationName\":\"ProductListToTransfer\"},{\"name\":\"productions\",\"kind\":\"object\",\"type\":\"Production\",\"relationName\":\"ProductListToProduction\"},{\"name\":\"adjustments\",\"kind\":\"object\",\"type\":\"Adjustment\",\"relationName\":\"AdjustmentToProductList\"}],\"dbName\":null},\"Inventory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"ProductList\",\"relationName\":\"InventoryToProductList\"},{\"name\":\"locationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"object\",\"type\":\"Location\",\"relationName\":\"InventoryToLocation\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"lowStockAt\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"expiryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Location\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"inventories\",\"kind\":\"object\",\"type\":\"Inventory\",\"relationName\":\"InventoryToLocation\"},{\"name\":\"sales\",\"kind\":\"object\",\"type\":\"Sale\",\"relationName\":\"LocationToSale\"},{\"name\":\"transfersFrom\",\"kind\":\"object\",\"type\":\"Transfer\",\"relationName\":\"TransfersFrom\"},{\"name\":\"transfersTo\",\"kind\":\"object\",\"type\":\"Transfer\",\"relationName\":\"TransfersTo\"},{\"name\":\"adjustments\",\"kind\":\"object\",\"type\":\"Adjustment\",\"relationName\":\"AdjustmentToLocation\"}],\"dbName\":null},\"Customer\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"country\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"city\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"sales\",\"kind\":\"object\",\"type\":\"Sale\",\"relationName\":\"CustomerToSale\"}],\"dbName\":null},\"Sale\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customerName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"customer\",\"kind\":\"object\",\"type\":\"Customer\",\"relationName\":\"CustomerToSale\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"ProductList\",\"relationName\":\"ProductListToSale\"},{\"name\":\"locationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"object\",\"type\":\"Location\",\"relationName\":\"LocationToSale\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"salePrice\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"saleDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"isReturn\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Transfer\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"ProductList\",\"relationName\":\"ProductListToTransfer\"},{\"name\":\"fromLocationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fromLocation\",\"kind\":\"object\",\"type\":\"Location\",\"relationName\":\"TransfersFrom\"},{\"name\":\"toLocationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toLocation\",\"kind\":\"object\",\"type\":\"Location\",\"relationName\":\"TransfersTo\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"transferDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Production\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"ProductList\",\"relationName\":\"ProductListToProduction\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Adjustment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"product\",\"kind\":\"object\",\"type\":\"ProductList\",\"relationName\":\"AdjustmentToProductList\"},{\"name\":\"locationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"location\",\"kind\":\"object\",\"type\":\"Location\",\"relationName\":\"AdjustmentToLocation\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.compilerWasm = {
    getRuntime: async ()=>__turbopack_context__.r("[project]/src/generated/prisma/query_compiler_bg.js [app-rsc] (ecmascript)"),
    getQueryCompilerWasmModule: async ()=>{
        const { Buffer } = __turbopack_context__.r("[externals]/node:buffer [external] (node:buffer, cjs)");
        const { wasm } = __turbopack_context__.r("[project]/src/generated/prisma/query_compiler_bg.wasm-base64.js [app-rsc] (ecmascript)");
        const queryCompilerWasmFileBytes = Buffer.from(wasm, 'base64');
        return new WebAssembly.Module(queryCompilerWasmFileBytes);
    }
};
const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
}),
"[project]/src/generated/prisma/client.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */ // biome-ignore-all lint: generated file
module.exports = {
    ...__turbopack_context__.r("[project]/src/generated/prisma/index.js [app-rsc] (ecmascript)")
};
}),
];

//# sourceMappingURL=src_generated_prisma_6912d30d._.js.map