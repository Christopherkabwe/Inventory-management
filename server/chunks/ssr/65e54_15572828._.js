module.exports = [
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/oauth4webapi/build/index.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OperationProcessingError",
    ()=>OperationProcessingError,
    "UnsupportedOperationError",
    ()=>UnsupportedOperationError,
    "authorizationCodeGrantRequest",
    ()=>authorizationCodeGrantRequest,
    "calculatePKCECodeChallenge",
    ()=>calculatePKCECodeChallenge,
    "clientCredentialsGrantRequest",
    ()=>clientCredentialsGrantRequest,
    "clockSkew",
    ()=>clockSkew,
    "clockTolerance",
    ()=>clockTolerance,
    "customFetch",
    ()=>customFetch,
    "deviceAuthorizationRequest",
    ()=>deviceAuthorizationRequest,
    "deviceCodeGrantRequest",
    ()=>deviceCodeGrantRequest,
    "discoveryRequest",
    ()=>discoveryRequest,
    "expectNoNonce",
    ()=>expectNoNonce,
    "expectNoState",
    ()=>expectNoState,
    "experimentalCustomFetch",
    ()=>experimentalCustomFetch,
    "experimentalUseMtlsAlias",
    ()=>experimentalUseMtlsAlias,
    "experimental_customFetch",
    ()=>experimental_customFetch,
    "experimental_jwksCache",
    ()=>experimental_jwksCache,
    "experimental_useMtlsAlias",
    ()=>experimental_useMtlsAlias,
    "experimental_validateDetachedSignatureResponse",
    ()=>experimental_validateDetachedSignatureResponse,
    "experimental_validateJwtAccessToken",
    ()=>experimental_validateJwtAccessToken,
    "generateKeyPair",
    ()=>generateKeyPair,
    "generateRandomCodeVerifier",
    ()=>generateRandomCodeVerifier,
    "generateRandomNonce",
    ()=>generateRandomNonce,
    "generateRandomState",
    ()=>generateRandomState,
    "genericTokenEndpointRequest",
    ()=>genericTokenEndpointRequest,
    "getValidatedIdTokenClaims",
    ()=>getValidatedIdTokenClaims,
    "introspectionRequest",
    ()=>introspectionRequest,
    "isOAuth2Error",
    ()=>isOAuth2Error,
    "issueRequestObject",
    ()=>issueRequestObject,
    "jweDecrypt",
    ()=>jweDecrypt,
    "jwksCache",
    ()=>jwksCache,
    "modifyAssertion",
    ()=>modifyAssertion,
    "parseWwwAuthenticateChallenges",
    ()=>parseWwwAuthenticateChallenges,
    "processAuthorizationCodeOAuth2Response",
    ()=>processAuthorizationCodeOAuth2Response,
    "processAuthorizationCodeOpenIDResponse",
    ()=>processAuthorizationCodeOpenIDResponse,
    "processClientCredentialsResponse",
    ()=>processClientCredentialsResponse,
    "processDeviceAuthorizationResponse",
    ()=>processDeviceAuthorizationResponse,
    "processDeviceCodeResponse",
    ()=>processDeviceCodeResponse,
    "processDiscoveryResponse",
    ()=>processDiscoveryResponse,
    "processIntrospectionResponse",
    ()=>processIntrospectionResponse,
    "processPushedAuthorizationResponse",
    ()=>processPushedAuthorizationResponse,
    "processRefreshTokenResponse",
    ()=>processRefreshTokenResponse,
    "processRevocationResponse",
    ()=>processRevocationResponse,
    "processUserInfoResponse",
    ()=>processUserInfoResponse,
    "protectedResourceRequest",
    ()=>protectedResourceRequest,
    "pushedAuthorizationRequest",
    ()=>pushedAuthorizationRequest,
    "refreshTokenGrantRequest",
    ()=>refreshTokenGrantRequest,
    "revocationRequest",
    ()=>revocationRequest,
    "skipAuthTimeCheck",
    ()=>skipAuthTimeCheck,
    "skipStateCheck",
    ()=>skipStateCheck,
    "skipSubjectCheck",
    ()=>skipSubjectCheck,
    "useMtlsAlias",
    ()=>useMtlsAlias,
    "userInfoRequest",
    ()=>userInfoRequest,
    "validateAuthResponse",
    ()=>validateAuthResponse,
    "validateDetachedSignatureResponse",
    ()=>validateDetachedSignatureResponse,
    "validateIdTokenSignature",
    ()=>validateIdTokenSignature,
    "validateJwtAccessToken",
    ()=>validateJwtAccessToken,
    "validateJwtAuthResponse",
    ()=>validateJwtAuthResponse,
    "validateJwtIntrospectionSignature",
    ()=>validateJwtIntrospectionSignature,
    "validateJwtUserInfoSignature",
    ()=>validateJwtUserInfoSignature,
    "validateJwtUserinfoSignature",
    ()=>validateJwtUserinfoSignature
]);
let USER_AGENT;
if (typeof navigator === 'undefined' || !navigator.userAgent?.startsWith?.('Mozilla/5.0 ')) {
    const NAME = 'oauth4webapi';
    const VERSION = 'v2.17.0';
    USER_AGENT = `${NAME}/${VERSION}`;
}
function looseInstanceOf(input, expected) {
    if (input == null) {
        return false;
    }
    try {
        return input instanceof expected || Object.getPrototypeOf(input)[Symbol.toStringTag] === expected.prototype[Symbol.toStringTag];
    } catch  {
        return false;
    }
}
const clockSkew = Symbol();
const clockTolerance = Symbol();
const customFetch = Symbol();
const modifyAssertion = Symbol();
const jweDecrypt = Symbol();
const jwksCache = Symbol();
const useMtlsAlias = Symbol();
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function buf(input) {
    if (typeof input === 'string') {
        return encoder.encode(input);
    }
    return decoder.decode(input);
}
const CHUNK_SIZE = 0x8000;
function encodeBase64Url(input) {
    if (input instanceof ArrayBuffer) {
        input = new Uint8Array(input);
    }
    const arr = [];
    for(let i = 0; i < input.byteLength; i += CHUNK_SIZE){
        arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join('')).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function decodeBase64Url(input) {
    try {
        const binary = atob(input.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''));
        const bytes = new Uint8Array(binary.length);
        for(let i = 0; i < binary.length; i++){
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    } catch (cause) {
        throw new OPE('The input to be decoded is not correctly encoded.', {
            cause
        });
    }
}
function b64u(input) {
    if (typeof input === 'string') {
        return decodeBase64Url(input);
    }
    return encodeBase64Url(input);
}
class LRU {
    constructor(maxSize){
        this.cache = new Map();
        this._cache = new Map();
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
        return undefined;
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
            this.cache = new Map();
        }
    }
}
class UnsupportedOperationError extends Error {
    constructor(message){
        super(message ?? 'operation not supported');
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class OperationProcessingError extends Error {
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
const OPE = OperationProcessingError;
const dpopNonces = new LRU(100);
function isCryptoKey(key) {
    return key instanceof CryptoKey;
}
function isPrivateKey(key) {
    return isCryptoKey(key) && key.type === 'private';
}
function isPublicKey(key) {
    return isCryptoKey(key) && key.type === 'public';
}
const SUPPORTED_JWS_ALGS = [
    'PS256',
    'ES256',
    'RS256',
    'PS384',
    'ES384',
    'RS384',
    'PS512',
    'ES512',
    'RS512',
    'EdDSA'
];
function processDpopNonce(response) {
    try {
        const nonce = response.headers.get('dpop-nonce');
        if (nonce) {
            dpopNonces.set(new URL(response.url).origin, nonce);
        }
    } catch  {}
    return response;
}
function normalizeTyp(value) {
    return value.toLowerCase().replace(/^application\//, '');
}
function isJsonObject(input) {
    if (input === null || typeof input !== 'object' || Array.isArray(input)) {
        return false;
    }
    return true;
}
function prepareHeaders(input) {
    if (looseInstanceOf(input, Headers)) {
        input = Object.fromEntries(input.entries());
    }
    const headers = new Headers(input);
    if (USER_AGENT && !headers.has('user-agent')) {
        headers.set('user-agent', USER_AGENT);
    }
    if (headers.has('authorization')) {
        throw new TypeError('"options.headers" must not include the "authorization" header name');
    }
    if (headers.has('dpop')) {
        throw new TypeError('"options.headers" must not include the "dpop" header name');
    }
    return headers;
}
function signal(value) {
    if (typeof value === 'function') {
        value = value();
    }
    if (!(value instanceof AbortSignal)) {
        throw new TypeError('"options.signal" must return or be an instance of AbortSignal');
    }
    return value;
}
async function discoveryRequest(issuerIdentifier, options) {
    if (!(issuerIdentifier instanceof URL)) {
        throw new TypeError('"issuerIdentifier" must be an instance of URL');
    }
    if (issuerIdentifier.protocol !== 'https:' && issuerIdentifier.protocol !== 'http:') {
        throw new TypeError('"issuer.protocol" must be "https:" or "http:"');
    }
    const url = new URL(issuerIdentifier.href);
    switch(options?.algorithm){
        case undefined:
        case 'oidc':
            url.pathname = `${url.pathname}/.well-known/openid-configuration`.replace('//', '/');
            break;
        case 'oauth2':
            if (url.pathname === '/') {
                url.pathname = '.well-known/oauth-authorization-server';
            } else {
                url.pathname = `.well-known/oauth-authorization-server/${url.pathname}`.replace('//', '/');
            }
            break;
        default:
            throw new TypeError('"options.algorithm" must be "oidc" (default), or "oauth2"');
    }
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    return (options?.[customFetch] || fetch)(url.href, {
        headers: Object.fromEntries(headers.entries()),
        method: 'GET',
        redirect: 'manual',
        signal: options?.signal ? signal(options.signal) : null
    }).then(processDpopNonce);
}
function validateString(input) {
    return typeof input === 'string' && input.length !== 0;
}
async function processDiscoveryResponse(expectedIssuerIdentifier, response) {
    if (!(expectedIssuerIdentifier instanceof URL)) {
        throw new TypeError('"expectedIssuer" must be an instance of URL');
    }
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        throw new OPE('"response" is not a conform Authorization Server Metadata response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.issuer)) {
        throw new OPE('"response" body "issuer" property must be a non-empty string');
    }
    if (new URL(json.issuer).href !== expectedIssuerIdentifier.href) {
        throw new OPE('"response" body "issuer" does not match "expectedIssuer"');
    }
    return json;
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
function generateRandomNonce() {
    return randomBytes();
}
async function calculatePKCECodeChallenge(codeVerifier) {
    if (!validateString(codeVerifier)) {
        throw new TypeError('"codeVerifier" must be a non-empty string');
    }
    return b64u(await crypto.subtle.digest('SHA-256', buf(codeVerifier)));
}
function getKeyAndKid(input) {
    if (input instanceof CryptoKey) {
        return {
            key: input
        };
    }
    if (!(input?.key instanceof CryptoKey)) {
        return {};
    }
    if (input.kid !== undefined && !validateString(input.kid)) {
        throw new TypeError('"kid" must be a non-empty string');
    }
    return {
        key: input.key,
        kid: input.kid,
        modifyAssertion: input[modifyAssertion]
    };
}
function formUrlEncode(token) {
    return encodeURIComponent(token).replace(/%20/g, '+');
}
function clientSecretBasic(clientId, clientSecret) {
    const username = formUrlEncode(clientId);
    const password = formUrlEncode(clientSecret);
    const credentials = btoa(`${username}:${password}`);
    return `Basic ${credentials}`;
}
function psAlg(key) {
    switch(key.algorithm.hash.name){
        case 'SHA-256':
            return 'PS256';
        case 'SHA-384':
            return 'PS384';
        case 'SHA-512':
            return 'PS512';
        default:
            throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name');
    }
}
function rsAlg(key) {
    switch(key.algorithm.hash.name){
        case 'SHA-256':
            return 'RS256';
        case 'SHA-384':
            return 'RS384';
        case 'SHA-512':
            return 'RS512';
        default:
            throw new UnsupportedOperationError('unsupported RsaHashedKeyAlgorithm hash name');
    }
}
function esAlg(key) {
    switch(key.algorithm.namedCurve){
        case 'P-256':
            return 'ES256';
        case 'P-384':
            return 'ES384';
        case 'P-521':
            return 'ES512';
        default:
            throw new UnsupportedOperationError('unsupported EcKeyAlgorithm namedCurve');
    }
}
function keyToJws(key) {
    switch(key.algorithm.name){
        case 'RSA-PSS':
            return psAlg(key);
        case 'RSASSA-PKCS1-v1_5':
            return rsAlg(key);
        case 'ECDSA':
            return esAlg(key);
        case 'Ed25519':
        case 'Ed448':
            return 'EdDSA';
        default:
            throw new UnsupportedOperationError('unsupported CryptoKey algorithm name');
    }
}
function getClockSkew(client) {
    const skew = client?.[clockSkew];
    return typeof skew === 'number' && Number.isFinite(skew) ? skew : 0;
}
function getClockTolerance(client) {
    const tolerance = client?.[clockTolerance];
    return typeof tolerance === 'number' && Number.isFinite(tolerance) && Math.sign(tolerance) !== -1 ? tolerance : 30;
}
function epochTime() {
    return Math.floor(Date.now() / 1000);
}
function clientAssertion(as, client) {
    const now = epochTime() + getClockSkew(client);
    return {
        jti: randomBytes(),
        aud: [
            as.issuer,
            as.token_endpoint
        ],
        exp: now + 60,
        iat: now,
        nbf: now,
        iss: client.client_id,
        sub: client.client_id
    };
}
async function privateKeyJwt(as, client, key, kid, modifyAssertion) {
    const header = {
        alg: keyToJws(key),
        kid
    };
    const payload = clientAssertion(as, client);
    modifyAssertion?.(header, payload);
    return jwt(header, payload, key);
}
function assertAs(as) {
    if (typeof as !== 'object' || as === null) {
        throw new TypeError('"as" must be an object');
    }
    if (!validateString(as.issuer)) {
        throw new TypeError('"as.issuer" property must be a non-empty string');
    }
    return true;
}
function assertClient(client) {
    if (typeof client !== 'object' || client === null) {
        throw new TypeError('"client" must be an object');
    }
    if (!validateString(client.client_id)) {
        throw new TypeError('"client.client_id" property must be a non-empty string');
    }
    return true;
}
function assertClientSecret(clientSecret) {
    if (!validateString(clientSecret)) {
        throw new TypeError('"client.client_secret" property must be a non-empty string');
    }
    return clientSecret;
}
function assertNoClientPrivateKey(clientAuthMethod, clientPrivateKey) {
    if (clientPrivateKey !== undefined) {
        throw new TypeError(`"options.clientPrivateKey" property must not be provided when ${clientAuthMethod} client authentication method is used.`);
    }
}
function assertNoClientSecret(clientAuthMethod, clientSecret) {
    if (clientSecret !== undefined) {
        throw new TypeError(`"client.client_secret" property must not be provided when ${clientAuthMethod} client authentication method is used.`);
    }
}
async function clientAuthentication(as, client, body, headers, clientPrivateKey) {
    body.delete('client_secret');
    body.delete('client_assertion_type');
    body.delete('client_assertion');
    switch(client.token_endpoint_auth_method){
        case undefined:
        case 'client_secret_basic':
            {
                assertNoClientPrivateKey('client_secret_basic', clientPrivateKey);
                headers.set('authorization', clientSecretBasic(client.client_id, assertClientSecret(client.client_secret)));
                break;
            }
        case 'client_secret_post':
            {
                assertNoClientPrivateKey('client_secret_post', clientPrivateKey);
                body.set('client_id', client.client_id);
                body.set('client_secret', assertClientSecret(client.client_secret));
                break;
            }
        case 'private_key_jwt':
            {
                assertNoClientSecret('private_key_jwt', client.client_secret);
                if (clientPrivateKey === undefined) {
                    throw new TypeError('"options.clientPrivateKey" must be provided when "client.token_endpoint_auth_method" is "private_key_jwt"');
                }
                const { key, kid, modifyAssertion } = getKeyAndKid(clientPrivateKey);
                if (!isPrivateKey(key)) {
                    throw new TypeError('"options.clientPrivateKey.key" must be a private CryptoKey');
                }
                body.set('client_id', client.client_id);
                body.set('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');
                body.set('client_assertion', await privateKeyJwt(as, client, key, kid, modifyAssertion));
                break;
            }
        case 'tls_client_auth':
        case 'self_signed_tls_client_auth':
        case 'none':
            {
                assertNoClientSecret(client.token_endpoint_auth_method, client.client_secret);
                assertNoClientPrivateKey(client.token_endpoint_auth_method, clientPrivateKey);
                body.set('client_id', client.client_id);
                break;
            }
        default:
            throw new UnsupportedOperationError('unsupported client token_endpoint_auth_method');
    }
}
async function jwt(header, payload, key) {
    if (!key.usages.includes('sign')) {
        throw new TypeError('CryptoKey instances used for signing assertions must include "sign" in their "usages"');
    }
    const input = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(payload)))}`;
    const signature = b64u(await crypto.subtle.sign(keyToSubtle(key), key, buf(input)));
    return `${input}.${signature}`;
}
async function issueRequestObject(as, client, parameters, privateKey) {
    assertAs(as);
    assertClient(client);
    parameters = new URLSearchParams(parameters);
    const { key, kid, modifyAssertion } = getKeyAndKid(privateKey);
    if (!isPrivateKey(key)) {
        throw new TypeError('"privateKey.key" must be a private CryptoKey');
    }
    parameters.set('client_id', client.client_id);
    const now = epochTime() + getClockSkew(client);
    const claims = {
        ...Object.fromEntries(parameters.entries()),
        jti: randomBytes(),
        aud: as.issuer,
        exp: now + 60,
        iat: now,
        nbf: now,
        iss: client.client_id
    };
    let resource;
    if (parameters.has('resource') && (resource = parameters.getAll('resource')) && resource.length > 1) {
        claims.resource = resource;
    }
    {
        let value = parameters.get('max_age');
        if (value !== null) {
            claims.max_age = parseInt(value, 10);
            if (!Number.isFinite(claims.max_age)) {
                throw new OPE('"max_age" parameter must be a number');
            }
        }
    }
    {
        let value = parameters.get('claims');
        if (value !== null) {
            try {
                claims.claims = JSON.parse(value);
            } catch (cause) {
                throw new OPE('failed to parse the "claims" parameter as JSON', {
                    cause
                });
            }
            if (!isJsonObject(claims.claims)) {
                throw new OPE('"claims" parameter must be a JSON with a top level object');
            }
        }
    }
    {
        let value = parameters.get('authorization_details');
        if (value !== null) {
            try {
                claims.authorization_details = JSON.parse(value);
            } catch (cause) {
                throw new OPE('failed to parse the "authorization_details" parameter as JSON', {
                    cause
                });
            }
            if (!Array.isArray(claims.authorization_details)) {
                throw new OPE('"authorization_details" parameter must be a JSON with a top level array');
            }
        }
    }
    const header = {
        alg: keyToJws(key),
        typ: 'oauth-authz-req+jwt',
        kid
    };
    modifyAssertion?.(header, claims);
    return jwt(header, claims, key);
}
async function dpopProofJwt(headers, options, url, htm, clockSkew, accessToken) {
    const { privateKey, publicKey, nonce = dpopNonces.get(url.origin) } = options;
    if (!isPrivateKey(privateKey)) {
        throw new TypeError('"DPoP.privateKey" must be a private CryptoKey');
    }
    if (!isPublicKey(publicKey)) {
        throw new TypeError('"DPoP.publicKey" must be a public CryptoKey');
    }
    if (nonce !== undefined && !validateString(nonce)) {
        throw new TypeError('"DPoP.nonce" must be a non-empty string or undefined');
    }
    if (!publicKey.extractable) {
        throw new TypeError('"DPoP.publicKey.extractable" must be true');
    }
    const now = epochTime() + clockSkew;
    const header = {
        alg: keyToJws(privateKey),
        typ: 'dpop+jwt',
        jwk: await publicJwk(publicKey)
    };
    const payload = {
        iat: now,
        jti: randomBytes(),
        htm,
        nonce,
        htu: `${url.origin}${url.pathname}`,
        ath: accessToken ? b64u(await crypto.subtle.digest('SHA-256', buf(accessToken))) : undefined
    };
    options[modifyAssertion]?.(header, payload);
    headers.set('dpop', await jwt(header, payload, privateKey));
}
let jwkCache;
async function getSetPublicJwkCache(key) {
    const { kty, e, n, x, y, crv } = await crypto.subtle.exportKey('jwk', key);
    const jwk = {
        kty,
        e,
        n,
        x,
        y,
        crv
    };
    jwkCache.set(key, jwk);
    return jwk;
}
async function publicJwk(key) {
    jwkCache || (jwkCache = new WeakMap());
    return jwkCache.get(key) || getSetPublicJwkCache(key);
}
function validateEndpoint(value, endpoint, useMtlsAlias) {
    if (typeof value !== 'string') {
        if (useMtlsAlias) {
            throw new TypeError(`"as.mtls_endpoint_aliases.${endpoint}" must be a string`);
        }
        throw new TypeError(`"as.${endpoint}" must be a string`);
    }
    return new URL(value);
}
function resolveEndpoint(as, endpoint, useMtlsAlias = false) {
    if (useMtlsAlias && as.mtls_endpoint_aliases && endpoint in as.mtls_endpoint_aliases) {
        return validateEndpoint(as.mtls_endpoint_aliases[endpoint], endpoint, useMtlsAlias);
    }
    return validateEndpoint(as[endpoint], endpoint, useMtlsAlias);
}
function alias(client, options) {
    if (client.use_mtls_endpoint_aliases || options?.[useMtlsAlias]) {
        return true;
    }
    return false;
}
async function pushedAuthorizationRequest(as, client, parameters, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'pushed_authorization_request_endpoint', alias(client, options));
    const body = new URLSearchParams(parameters);
    body.set('client_id', client.client_id);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    if (options?.DPoP !== undefined) {
        await dpopProofJwt(headers, options.DPoP, url, 'POST', getClockSkew(client));
    }
    return authenticatedRequest(as, client, 'POST', url, body, headers, options);
}
function isOAuth2Error(input) {
    const value = input;
    if (typeof value !== 'object' || Array.isArray(value) || value === null) {
        return false;
    }
    return value.error !== undefined;
}
function unquote(value) {
    if (value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"') {
        return value.slice(1, -1);
    }
    return value;
}
const SPLIT_REGEXP = /((?:,|, )?[0-9a-zA-Z!#$%&'*+-.^_`|~]+=)/;
const SCHEMES_REGEXP = /(?:^|, ?)([0-9a-zA-Z!#$%&'*+\-.^_`|~]+)(?=$|[ ,])/g;
function wwwAuth(scheme, params) {
    const arr = params.split(SPLIT_REGEXP).slice(1);
    if (!arr.length) {
        return {
            scheme: scheme.toLowerCase(),
            parameters: {}
        };
    }
    arr[arr.length - 1] = arr[arr.length - 1].replace(/,$/, '');
    const parameters = {};
    for(let i = 1; i < arr.length; i += 2){
        const idx = i;
        if (arr[idx][0] === '"') {
            while(arr[idx].slice(-1) !== '"' && ++i < arr.length){
                arr[idx] += arr[i];
            }
        }
        const key = arr[idx - 1].replace(/^(?:, ?)|=$/g, '').toLowerCase();
        parameters[key] = unquote(arr[idx]);
    }
    return {
        scheme: scheme.toLowerCase(),
        parameters
    };
}
function parseWwwAuthenticateChallenges(response) {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    const header = response.headers.get('www-authenticate');
    if (header === null) {
        return undefined;
    }
    const result = [];
    for (const { 1: scheme, index } of header.matchAll(SCHEMES_REGEXP)){
        result.push([
            scheme,
            index
        ]);
    }
    if (!result.length) {
        return undefined;
    }
    const challenges = result.map(([scheme, indexOf], i, others)=>{
        const next = others[i + 1];
        let parameters;
        if (next) {
            parameters = header.slice(indexOf, next[1]);
        } else {
            parameters = header.slice(indexOf);
        }
        return wwwAuth(scheme, parameters);
    });
    return challenges;
}
async function processPushedAuthorizationResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 201) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Pushed Authorization Request Endpoint response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.request_uri)) {
        throw new OPE('"response" body "request_uri" property must be a non-empty string');
    }
    if (typeof json.expires_in !== 'number' || json.expires_in <= 0) {
        throw new OPE('"response" body "expires_in" property must be a positive number');
    }
    return json;
}
async function protectedResourceRequest(accessToken, method, url, headers, body, options) {
    if (!validateString(accessToken)) {
        throw new TypeError('"accessToken" must be a non-empty string');
    }
    if (!(url instanceof URL)) {
        throw new TypeError('"url" must be an instance of URL');
    }
    headers = prepareHeaders(headers);
    if (options?.DPoP === undefined) {
        headers.set('authorization', `Bearer ${accessToken}`);
    } else {
        await dpopProofJwt(headers, options.DPoP, url, method.toUpperCase(), getClockSkew({
            [clockSkew]: options?.[clockSkew]
        }), accessToken);
        headers.set('authorization', `DPoP ${accessToken}`);
    }
    return (options?.[customFetch] || fetch)(url.href, {
        body,
        headers: Object.fromEntries(headers.entries()),
        method,
        redirect: 'manual',
        signal: options?.signal ? signal(options.signal) : null
    }).then(processDpopNonce);
}
async function userInfoRequest(as, client, accessToken, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'userinfo_endpoint', alias(client, options));
    const headers = prepareHeaders(options?.headers);
    if (client.userinfo_signed_response_alg) {
        headers.set('accept', 'application/jwt');
    } else {
        headers.set('accept', 'application/json');
        headers.append('accept', 'application/jwt');
    }
    return protectedResourceRequest(accessToken, 'GET', url, headers, null, {
        ...options,
        [clockSkew]: getClockSkew(client)
    });
}
let jwksMap;
function setJwksCache(as, jwks, uat, cache) {
    jwksMap || (jwksMap = new WeakMap());
    jwksMap.set(as, {
        jwks,
        uat,
        get age () {
            return epochTime() - this.uat;
        }
    });
    if (cache) {
        Object.assign(cache, {
            jwks: structuredClone(jwks),
            uat
        });
    }
}
function isFreshJwksCache(input) {
    if (typeof input !== 'object' || input === null) {
        return false;
    }
    if (!('uat' in input) || typeof input.uat !== 'number' || epochTime() - input.uat >= 300) {
        return false;
    }
    if (!('jwks' in input) || !isJsonObject(input.jwks) || !Array.isArray(input.jwks.keys) || !Array.prototype.every.call(input.jwks.keys, isJsonObject)) {
        return false;
    }
    return true;
}
function clearJwksCache(as, cache) {
    jwksMap?.delete(as);
    delete cache?.jwks;
    delete cache?.uat;
}
async function getPublicSigKeyFromIssuerJwksUri(as, options, header) {
    const { alg, kid } = header;
    checkSupportedJwsAlg(alg);
    if (!jwksMap?.has(as) && isFreshJwksCache(options?.[jwksCache])) {
        setJwksCache(as, options?.[jwksCache].jwks, options?.[jwksCache].uat);
    }
    let jwks;
    let age;
    if (jwksMap?.has(as)) {
        ;
        ({ jwks, age } = jwksMap.get(as));
        if (age >= 300) {
            clearJwksCache(as, options?.[jwksCache]);
            return getPublicSigKeyFromIssuerJwksUri(as, options, header);
        }
    } else {
        jwks = await jwksRequest(as, options).then(processJwksResponse);
        age = 0;
        setJwksCache(as, jwks, epochTime(), options?.[jwksCache]);
    }
    let kty;
    switch(alg.slice(0, 2)){
        case 'RS':
        case 'PS':
            kty = 'RSA';
            break;
        case 'ES':
            kty = 'EC';
            break;
        case 'Ed':
            kty = 'OKP';
            break;
        default:
            throw new UnsupportedOperationError();
    }
    const candidates = jwks.keys.filter((jwk)=>{
        if (jwk.kty !== kty) {
            return false;
        }
        if (kid !== undefined && kid !== jwk.kid) {
            return false;
        }
        if (jwk.alg !== undefined && alg !== jwk.alg) {
            return false;
        }
        if (jwk.use !== undefined && jwk.use !== 'sig') {
            return false;
        }
        if (jwk.key_ops?.includes('verify') === false) {
            return false;
        }
        switch(true){
            case alg === 'ES256' && jwk.crv !== 'P-256':
            case alg === 'ES384' && jwk.crv !== 'P-384':
            case alg === 'ES512' && jwk.crv !== 'P-521':
            case alg === 'EdDSA' && !(jwk.crv === 'Ed25519' || jwk.crv === 'Ed448'):
                return false;
        }
        return true;
    });
    const { 0: jwk, length } = candidates;
    if (!length) {
        if (age >= 60) {
            clearJwksCache(as, options?.[jwksCache]);
            return getPublicSigKeyFromIssuerJwksUri(as, options, header);
        }
        throw new OPE('error when selecting a JWT verification key, no applicable keys found');
    }
    if (length !== 1) {
        throw new OPE('error when selecting a JWT verification key, multiple applicable keys found, a "kid" JWT Header Parameter is required');
    }
    const key = await importJwk(alg, jwk);
    if (key.type !== 'public') {
        throw new OPE('jwks_uri must only contain public keys');
    }
    return key;
}
const skipSubjectCheck = Symbol();
function getContentType(response) {
    return response.headers.get('content-type')?.split(';')[0];
}
async function processUserInfoResponse(as, client, expectedSubject, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        throw new OPE('"response" is not a conform UserInfo Endpoint response');
    }
    let json;
    if (getContentType(response) === 'application/jwt') {
        assertReadableResponse(response);
        const { claims, jwt } = await validateJwt(await response.text(), checkSigningAlgorithm.bind(undefined, client.userinfo_signed_response_alg, as.userinfo_signing_alg_values_supported), noSignatureCheck, getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(validateOptionalAudience.bind(undefined, client.client_id)).then(validateOptionalIssuer.bind(undefined, as.issuer));
        jwtResponseBodies.set(response, jwt);
        json = claims;
    } else {
        if (client.userinfo_signed_response_alg) {
            throw new OPE('JWT UserInfo Response expected');
        }
        assertReadableResponse(response);
        try {
            json = await response.json();
        } catch (cause) {
            throw new OPE('failed to parse "response" body as JSON', {
                cause
            });
        }
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.sub)) {
        throw new OPE('"response" body "sub" property must be a non-empty string');
    }
    switch(expectedSubject){
        case skipSubjectCheck:
            break;
        default:
            if (!validateString(expectedSubject)) {
                throw new OPE('"expectedSubject" must be a non-empty string');
            }
            if (json.sub !== expectedSubject) {
                throw new OPE('unexpected "response" body "sub" value');
            }
    }
    return json;
}
async function authenticatedRequest(as, client, method, url, body, headers, options) {
    await clientAuthentication(as, client, body, headers, options?.clientPrivateKey);
    headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    return (options?.[customFetch] || fetch)(url.href, {
        body,
        headers: Object.fromEntries(headers.entries()),
        method,
        redirect: 'manual',
        signal: options?.signal ? signal(options.signal) : null
    }).then(processDpopNonce);
}
async function tokenEndpointRequest(as, client, grantType, parameters, options) {
    const url = resolveEndpoint(as, 'token_endpoint', alias(client, options));
    parameters.set('grant_type', grantType);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    if (options?.DPoP !== undefined) {
        await dpopProofJwt(headers, options.DPoP, url, 'POST', getClockSkew(client));
    }
    return authenticatedRequest(as, client, 'POST', url, parameters, headers, options);
}
async function refreshTokenGrantRequest(as, client, refreshToken, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(refreshToken)) {
        throw new TypeError('"refreshToken" must be a non-empty string');
    }
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('refresh_token', refreshToken);
    return tokenEndpointRequest(as, client, 'refresh_token', parameters, options);
}
const idTokenClaims = new WeakMap();
const jwtResponseBodies = new WeakMap();
function getValidatedIdTokenClaims(ref) {
    if (!ref.id_token) {
        return undefined;
    }
    const claims = idTokenClaims.get(ref);
    if (!claims) {
        throw new TypeError('"ref" was already garbage collected or did not resolve from the proper sources');
    }
    return claims[0];
}
async function validateIdTokenSignature(as, ref, options) {
    assertAs(as);
    if (!idTokenClaims.has(ref)) {
        throw new OPE('"ref" does not contain an ID Token to verify the signature of');
    }
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = idTokenClaims.get(ref)[1].split('.');
    const header = JSON.parse(buf(b64u(protectedHeader)));
    if (header.alg.startsWith('HS')) {
        throw new UnsupportedOperationError();
    }
    let key;
    key = await getPublicSigKeyFromIssuerJwksUri(as, options, header);
    await validateJwsSignature(protectedHeader, payload, key, b64u(encodedSignature));
}
async function validateJwtResponseSignature(as, ref, options) {
    assertAs(as);
    if (!jwtResponseBodies.has(ref)) {
        throw new OPE('"ref" does not contain a processed JWT Response to verify the signature of');
    }
    const { 0: protectedHeader, 1: payload, 2: encodedSignature } = jwtResponseBodies.get(ref).split('.');
    const header = JSON.parse(buf(b64u(protectedHeader)));
    if (header.alg.startsWith('HS')) {
        throw new UnsupportedOperationError();
    }
    let key;
    key = await getPublicSigKeyFromIssuerJwksUri(as, options, header);
    await validateJwsSignature(protectedHeader, payload, key, b64u(encodedSignature));
}
function validateJwtUserInfoSignature(as, ref, options) {
    return validateJwtResponseSignature(as, ref, options);
}
function validateJwtIntrospectionSignature(as, ref, options) {
    return validateJwtResponseSignature(as, ref, options);
}
async function processGenericAccessTokenResponse(as, client, response, ignoreIdToken = false, ignoreRefreshToken = false) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Token Endpoint response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.access_token)) {
        throw new OPE('"response" body "access_token" property must be a non-empty string');
    }
    if (!validateString(json.token_type)) {
        throw new OPE('"response" body "token_type" property must be a non-empty string');
    }
    json.token_type = json.token_type.toLowerCase();
    if (json.token_type !== 'dpop' && json.token_type !== 'bearer') {
        throw new UnsupportedOperationError('unsupported `token_type` value');
    }
    if (json.expires_in !== undefined && (typeof json.expires_in !== 'number' || json.expires_in <= 0)) {
        throw new OPE('"response" body "expires_in" property must be a positive number');
    }
    if (!ignoreRefreshToken && json.refresh_token !== undefined && !validateString(json.refresh_token)) {
        throw new OPE('"response" body "refresh_token" property must be a non-empty string');
    }
    if (json.scope !== undefined && typeof json.scope !== 'string') {
        throw new OPE('"response" body "scope" property must be a string');
    }
    if (!ignoreIdToken) {
        if (json.id_token !== undefined && !validateString(json.id_token)) {
            throw new OPE('"response" body "id_token" property must be a non-empty string');
        }
        if (json.id_token) {
            const { claims, jwt } = await validateJwt(json.id_token, checkSigningAlgorithm.bind(undefined, client.id_token_signed_response_alg, as.id_token_signing_alg_values_supported), noSignatureCheck, getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(validatePresence.bind(undefined, [
                'aud',
                'exp',
                'iat',
                'iss',
                'sub'
            ])).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, client.client_id));
            if (Array.isArray(claims.aud) && claims.aud.length !== 1) {
                if (claims.azp === undefined) {
                    throw new OPE('ID Token "aud" (audience) claim includes additional untrusted audiences');
                }
                if (claims.azp !== client.client_id) {
                    throw new OPE('unexpected ID Token "azp" (authorized party) claim value');
                }
            }
            if (claims.auth_time !== undefined && (!Number.isFinite(claims.auth_time) || Math.sign(claims.auth_time) !== 1)) {
                throw new OPE('ID Token "auth_time" (authentication time) must be a positive number');
            }
            idTokenClaims.set(json, [
                claims,
                jwt
            ]);
        }
    }
    return json;
}
async function processRefreshTokenResponse(as, client, response) {
    return processGenericAccessTokenResponse(as, client, response);
}
function validateOptionalAudience(expected, result) {
    if (result.claims.aud !== undefined) {
        return validateAudience(expected, result);
    }
    return result;
}
function validateAudience(expected, result) {
    if (Array.isArray(result.claims.aud)) {
        if (!result.claims.aud.includes(expected)) {
            throw new OPE('unexpected JWT "aud" (audience) claim value');
        }
    } else if (result.claims.aud !== expected) {
        throw new OPE('unexpected JWT "aud" (audience) claim value');
    }
    return result;
}
function validateOptionalIssuer(expected, result) {
    if (result.claims.iss !== undefined) {
        return validateIssuer(expected, result);
    }
    return result;
}
function validateIssuer(expected, result) {
    if (result.claims.iss !== expected) {
        throw new OPE('unexpected JWT "iss" (issuer) claim value');
    }
    return result;
}
const branded = new WeakSet();
function brand(searchParams) {
    branded.add(searchParams);
    return searchParams;
}
async function authorizationCodeGrantRequest(as, client, callbackParameters, redirectUri, codeVerifier, options) {
    assertAs(as);
    assertClient(client);
    if (!branded.has(callbackParameters)) {
        throw new TypeError('"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()');
    }
    if (!validateString(redirectUri)) {
        throw new TypeError('"redirectUri" must be a non-empty string');
    }
    if (!validateString(codeVerifier)) {
        throw new TypeError('"codeVerifier" must be a non-empty string');
    }
    const code = getURLSearchParameter(callbackParameters, 'code');
    if (!code) {
        throw new OPE('no authorization code in "callbackParameters"');
    }
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('redirect_uri', redirectUri);
    parameters.set('code_verifier', codeVerifier);
    parameters.set('code', code);
    return tokenEndpointRequest(as, client, 'authorization_code', parameters, options);
}
const jwtClaimNames = {
    aud: 'audience',
    c_hash: 'code hash',
    client_id: 'client id',
    exp: 'expiration time',
    iat: 'issued at',
    iss: 'issuer',
    jti: 'jwt id',
    nonce: 'nonce',
    s_hash: 'state hash',
    sub: 'subject',
    ath: 'access token hash',
    htm: 'http method',
    htu: 'http uri',
    cnf: 'confirmation'
};
function validatePresence(required, result) {
    for (const claim of required){
        if (result.claims[claim] === undefined) {
            throw new OPE(`JWT "${claim}" (${jwtClaimNames[claim]}) claim missing`);
        }
    }
    return result;
}
const expectNoNonce = Symbol();
const skipAuthTimeCheck = Symbol();
async function processAuthorizationCodeOpenIDResponse(as, client, response, expectedNonce, maxAge) {
    const result = await processGenericAccessTokenResponse(as, client, response);
    if (isOAuth2Error(result)) {
        return result;
    }
    if (!validateString(result.id_token)) {
        throw new OPE('"response" body "id_token" property must be a non-empty string');
    }
    maxAge ?? (maxAge = client.default_max_age ?? skipAuthTimeCheck);
    const claims = getValidatedIdTokenClaims(result);
    if ((client.require_auth_time || maxAge !== skipAuthTimeCheck) && claims.auth_time === undefined) {
        throw new OPE('ID Token "auth_time" (authentication time) claim missing');
    }
    if (maxAge !== skipAuthTimeCheck) {
        if (typeof maxAge !== 'number' || maxAge < 0) {
            throw new TypeError('"maxAge" must be a non-negative number');
        }
        const now = epochTime() + getClockSkew(client);
        const tolerance = getClockTolerance(client);
        if (claims.auth_time + maxAge < now - tolerance) {
            throw new OPE('too much time has elapsed since the last End-User authentication');
        }
    }
    switch(expectedNonce){
        case undefined:
        case expectNoNonce:
            if (claims.nonce !== undefined) {
                throw new OPE('unexpected ID Token "nonce" claim value');
            }
            break;
        default:
            if (!validateString(expectedNonce)) {
                throw new TypeError('"expectedNonce" must be a non-empty string');
            }
            if (claims.nonce === undefined) {
                throw new OPE('ID Token "nonce" claim missing');
            }
            if (claims.nonce !== expectedNonce) {
                throw new OPE('unexpected ID Token "nonce" claim value');
            }
    }
    return result;
}
async function processAuthorizationCodeOAuth2Response(as, client, response) {
    const result = await processGenericAccessTokenResponse(as, client, response, true);
    if (isOAuth2Error(result)) {
        return result;
    }
    if (result.id_token !== undefined) {
        if (typeof result.id_token === 'string' && result.id_token.length) {
            throw new OPE('Unexpected ID Token returned, use processAuthorizationCodeOpenIDResponse() for OpenID Connect callback processing');
        }
        delete result.id_token;
    }
    return result;
}
function checkJwtType(expected, result) {
    if (typeof result.header.typ !== 'string' || normalizeTyp(result.header.typ) !== expected) {
        throw new OPE('unexpected JWT "typ" header parameter value');
    }
    return result;
}
async function clientCredentialsGrantRequest(as, client, parameters, options) {
    assertAs(as);
    assertClient(client);
    return tokenEndpointRequest(as, client, 'client_credentials', new URLSearchParams(parameters), options);
}
async function genericTokenEndpointRequest(as, client, grantType, parameters, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(grantType)) {
        throw new TypeError('"grantType" must be a non-empty string');
    }
    return tokenEndpointRequest(as, client, grantType, new URLSearchParams(parameters), options);
}
async function processClientCredentialsResponse(as, client, response) {
    const result = await processGenericAccessTokenResponse(as, client, response, true, true);
    if (isOAuth2Error(result)) {
        return result;
    }
    return result;
}
async function revocationRequest(as, client, token, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(token)) {
        throw new TypeError('"token" must be a non-empty string');
    }
    const url = resolveEndpoint(as, 'revocation_endpoint', alias(client, options));
    const body = new URLSearchParams(options?.additionalParameters);
    body.set('token', token);
    const headers = prepareHeaders(options?.headers);
    headers.delete('accept');
    return authenticatedRequest(as, client, 'POST', url, body, headers, options);
}
async function processRevocationResponse(response) {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Revocation Endpoint response');
    }
    return undefined;
}
function assertReadableResponse(response) {
    if (response.bodyUsed) {
        throw new TypeError('"response" body has been used already');
    }
}
async function introspectionRequest(as, client, token, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(token)) {
        throw new TypeError('"token" must be a non-empty string');
    }
    const url = resolveEndpoint(as, 'introspection_endpoint', alias(client, options));
    const body = new URLSearchParams(options?.additionalParameters);
    body.set('token', token);
    const headers = prepareHeaders(options?.headers);
    if (options?.requestJwtResponse ?? client.introspection_signed_response_alg) {
        headers.set('accept', 'application/token-introspection+jwt');
    } else {
        headers.set('accept', 'application/json');
    }
    return authenticatedRequest(as, client, 'POST', url, body, headers, options);
}
async function processIntrospectionResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Introspection Endpoint response');
    }
    let json;
    if (getContentType(response) === 'application/token-introspection+jwt') {
        assertReadableResponse(response);
        const { claims, jwt } = await validateJwt(await response.text(), checkSigningAlgorithm.bind(undefined, client.introspection_signed_response_alg, as.introspection_signing_alg_values_supported), noSignatureCheck, getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(checkJwtType.bind(undefined, 'token-introspection+jwt')).then(validatePresence.bind(undefined, [
            'aud',
            'iat',
            'iss'
        ])).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, client.client_id));
        jwtResponseBodies.set(response, jwt);
        json = claims.token_introspection;
        if (!isJsonObject(json)) {
            throw new OPE('JWT "token_introspection" claim must be a JSON object');
        }
    } else {
        assertReadableResponse(response);
        try {
            json = await response.json();
        } catch (cause) {
            throw new OPE('failed to parse "response" body as JSON', {
                cause
            });
        }
        if (!isJsonObject(json)) {
            throw new OPE('"response" body must be a top level object');
        }
    }
    if (typeof json.active !== 'boolean') {
        throw new OPE('"response" body "active" property must be a boolean');
    }
    return json;
}
async function jwksRequest(as, options) {
    assertAs(as);
    const url = resolveEndpoint(as, 'jwks_uri');
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    headers.append('accept', 'application/jwk-set+json');
    return (options?.[customFetch] || fetch)(url.href, {
        headers: Object.fromEntries(headers.entries()),
        method: 'GET',
        redirect: 'manual',
        signal: options?.signal ? signal(options.signal) : null
    }).then(processDpopNonce);
}
async function processJwksResponse(response) {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        throw new OPE('"response" is not a conform JSON Web Key Set response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!Array.isArray(json.keys)) {
        throw new OPE('"response" body "keys" property must be an array');
    }
    if (!Array.prototype.every.call(json.keys, isJsonObject)) {
        throw new OPE('"response" body "keys" property members must be JWK formatted objects');
    }
    return json;
}
async function handleOAuthBodyError(response) {
    if (response.status > 399 && response.status < 500) {
        assertReadableResponse(response);
        try {
            const json = await response.json();
            if (isJsonObject(json) && typeof json.error === 'string' && json.error.length) {
                if (json.error_description !== undefined && typeof json.error_description !== 'string') {
                    delete json.error_description;
                }
                if (json.error_uri !== undefined && typeof json.error_uri !== 'string') {
                    delete json.error_uri;
                }
                if (json.algs !== undefined && typeof json.algs !== 'string') {
                    delete json.algs;
                }
                if (json.scope !== undefined && typeof json.scope !== 'string') {
                    delete json.scope;
                }
                return json;
            }
        } catch  {}
    }
    return undefined;
}
function checkSupportedJwsAlg(alg) {
    if (!SUPPORTED_JWS_ALGS.includes(alg)) {
        throw new UnsupportedOperationError('unsupported JWS "alg" identifier');
    }
    return alg;
}
function checkRsaKeyAlgorithm(algorithm) {
    if (typeof algorithm.modulusLength !== 'number' || algorithm.modulusLength < 2048) {
        throw new OPE(`${algorithm.name} modulusLength must be at least 2048 bits`);
    }
}
function ecdsaHashName(namedCurve) {
    switch(namedCurve){
        case 'P-256':
            return 'SHA-256';
        case 'P-384':
            return 'SHA-384';
        case 'P-521':
            return 'SHA-512';
        default:
            throw new UnsupportedOperationError();
    }
}
function keyToSubtle(key) {
    switch(key.algorithm.name){
        case 'ECDSA':
            return {
                name: key.algorithm.name,
                hash: ecdsaHashName(key.algorithm.namedCurve)
            };
        case 'RSA-PSS':
            {
                checkRsaKeyAlgorithm(key.algorithm);
                switch(key.algorithm.hash.name){
                    case 'SHA-256':
                    case 'SHA-384':
                    case 'SHA-512':
                        return {
                            name: key.algorithm.name,
                            saltLength: parseInt(key.algorithm.hash.name.slice(-3), 10) >> 3
                        };
                    default:
                        throw new UnsupportedOperationError();
                }
            }
        case 'RSASSA-PKCS1-v1_5':
            checkRsaKeyAlgorithm(key.algorithm);
            return key.algorithm.name;
        case 'Ed448':
        case 'Ed25519':
            return key.algorithm.name;
    }
    throw new UnsupportedOperationError();
}
const noSignatureCheck = Symbol();
async function validateJwsSignature(protectedHeader, payload, key, signature) {
    const input = `${protectedHeader}.${payload}`;
    const verified = await crypto.subtle.verify(keyToSubtle(key), key, signature, buf(input));
    if (!verified) {
        throw new OPE('JWT signature verification failed');
    }
}
async function validateJwt(jws, checkAlg, getKey, clockSkew, clockTolerance, decryptJwt) {
    let { 0: protectedHeader, 1: payload, 2: encodedSignature, length } = jws.split('.');
    if (length === 5) {
        if (decryptJwt !== undefined) {
            jws = await decryptJwt(jws);
            ({ 0: protectedHeader, 1: payload, 2: encodedSignature, length } = jws.split('.'));
        } else {
            throw new UnsupportedOperationError('JWE structure JWTs are not supported');
        }
    }
    if (length !== 3) {
        throw new OPE('Invalid JWT');
    }
    let header;
    try {
        header = JSON.parse(buf(b64u(protectedHeader)));
    } catch (cause) {
        throw new OPE('failed to parse JWT Header body as base64url encoded JSON', {
            cause
        });
    }
    if (!isJsonObject(header)) {
        throw new OPE('JWT Header must be a top level object');
    }
    checkAlg(header);
    if (header.crit !== undefined) {
        throw new OPE('unexpected JWT "crit" header parameter');
    }
    const signature = b64u(encodedSignature);
    let key;
    if (getKey !== noSignatureCheck) {
        key = await getKey(header);
        await validateJwsSignature(protectedHeader, payload, key, signature);
    }
    let claims;
    try {
        claims = JSON.parse(buf(b64u(payload)));
    } catch (cause) {
        throw new OPE('failed to parse JWT Payload body as base64url encoded JSON', {
            cause
        });
    }
    if (!isJsonObject(claims)) {
        throw new OPE('JWT Payload must be a top level object');
    }
    const now = epochTime() + clockSkew;
    if (claims.exp !== undefined) {
        if (typeof claims.exp !== 'number') {
            throw new OPE('unexpected JWT "exp" (expiration time) claim type');
        }
        if (claims.exp <= now - clockTolerance) {
            throw new OPE('unexpected JWT "exp" (expiration time) claim value, timestamp is <= now()');
        }
    }
    if (claims.iat !== undefined) {
        if (typeof claims.iat !== 'number') {
            throw new OPE('unexpected JWT "iat" (issued at) claim type');
        }
    }
    if (claims.iss !== undefined) {
        if (typeof claims.iss !== 'string') {
            throw new OPE('unexpected JWT "iss" (issuer) claim type');
        }
    }
    if (claims.nbf !== undefined) {
        if (typeof claims.nbf !== 'number') {
            throw new OPE('unexpected JWT "nbf" (not before) claim type');
        }
        if (claims.nbf > now + clockTolerance) {
            throw new OPE('unexpected JWT "nbf" (not before) claim value, timestamp is > now()');
        }
    }
    if (claims.aud !== undefined) {
        if (typeof claims.aud !== 'string' && !Array.isArray(claims.aud)) {
            throw new OPE('unexpected JWT "aud" (audience) claim type');
        }
    }
    return {
        header,
        claims,
        signature,
        key,
        jwt: jws
    };
}
async function validateJwtAuthResponse(as, client, parameters, expectedState, options) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        parameters = parameters.searchParams;
    }
    if (!(parameters instanceof URLSearchParams)) {
        throw new TypeError('"parameters" must be an instance of URLSearchParams, or URL');
    }
    const response = getURLSearchParameter(parameters, 'response');
    if (!response) {
        throw new OPE('"parameters" does not contain a JARM response');
    }
    const { claims } = await validateJwt(response, checkSigningAlgorithm.bind(undefined, client.authorization_signed_response_alg, as.authorization_signing_alg_values_supported), getPublicSigKeyFromIssuerJwksUri.bind(undefined, as, options), getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(validatePresence.bind(undefined, [
        'aud',
        'exp',
        'iss'
    ])).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, client.client_id));
    const result = new URLSearchParams();
    for (const [key, value] of Object.entries(claims)){
        if (typeof value === 'string' && key !== 'aud') {
            result.set(key, value);
        }
    }
    return validateAuthResponse(as, client, result, expectedState);
}
async function idTokenHash(alg, data, key) {
    let algorithm;
    switch(alg){
        case 'RS256':
        case 'PS256':
        case 'ES256':
            algorithm = 'SHA-256';
            break;
        case 'RS384':
        case 'PS384':
        case 'ES384':
            algorithm = 'SHA-384';
            break;
        case 'RS512':
        case 'PS512':
        case 'ES512':
            algorithm = 'SHA-512';
            break;
        case 'EdDSA':
            if (key.algorithm.name === 'Ed25519') {
                algorithm = 'SHA-512';
                break;
            }
            throw new UnsupportedOperationError();
        default:
            throw new UnsupportedOperationError();
    }
    const digest = await crypto.subtle.digest(algorithm, buf(data));
    return b64u(digest.slice(0, digest.byteLength / 2));
}
async function idTokenHashMatches(data, actual, alg, key) {
    const expected = await idTokenHash(alg, data, key);
    return actual === expected;
}
async function validateDetachedSignatureResponse(as, client, parameters, expectedNonce, expectedState, maxAge, options) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        if (!parameters.hash.length) {
            throw new TypeError('"parameters" as an instance of URL must contain a hash (fragment) with the Authorization Response parameters');
        }
        parameters = new URLSearchParams(parameters.hash.slice(1));
    }
    if (!(parameters instanceof URLSearchParams)) {
        throw new TypeError('"parameters" must be an instance of URLSearchParams');
    }
    parameters = new URLSearchParams(parameters);
    const id_token = getURLSearchParameter(parameters, 'id_token');
    parameters.delete('id_token');
    switch(expectedState){
        case undefined:
        case expectNoState:
            break;
        default:
            if (!validateString(expectedState)) {
                throw new TypeError('"expectedState" must be a non-empty string');
            }
    }
    const result = validateAuthResponse({
        ...as,
        authorization_response_iss_parameter_supported: false
    }, client, parameters, expectedState);
    if (isOAuth2Error(result)) {
        return result;
    }
    if (!id_token) {
        throw new OPE('"parameters" does not contain an ID Token');
    }
    const code = getURLSearchParameter(parameters, 'code');
    if (!code) {
        throw new OPE('"parameters" does not contain an Authorization Code');
    }
    const requiredClaims = [
        'aud',
        'exp',
        'iat',
        'iss',
        'sub',
        'nonce',
        'c_hash'
    ];
    if (typeof expectedState === 'string') {
        requiredClaims.push('s_hash');
    }
    const { claims, header, key } = await validateJwt(id_token, checkSigningAlgorithm.bind(undefined, client.id_token_signed_response_alg, as.id_token_signing_alg_values_supported), getPublicSigKeyFromIssuerJwksUri.bind(undefined, as, options), getClockSkew(client), getClockTolerance(client), client[jweDecrypt]).then(validatePresence.bind(undefined, requiredClaims)).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, client.client_id));
    const clockSkew = getClockSkew(client);
    const now = epochTime() + clockSkew;
    if (claims.iat < now - 3600) {
        throw new OPE('unexpected JWT "iat" (issued at) claim value, it is too far in the past');
    }
    if (typeof claims.c_hash !== 'string' || await idTokenHashMatches(code, claims.c_hash, header.alg, key) !== true) {
        throw new OPE('invalid ID Token "c_hash" (code hash) claim value');
    }
    if (claims.s_hash !== undefined && typeof expectedState !== 'string') {
        throw new OPE('could not verify ID Token "s_hash" (state hash) claim value');
    }
    if (typeof expectedState === 'string' && (typeof claims.s_hash !== 'string' || await idTokenHashMatches(expectedState, claims.s_hash, header.alg, key) !== true)) {
        throw new OPE('invalid ID Token "s_hash" (state hash) claim value');
    }
    if (claims.auth_time !== undefined && (!Number.isFinite(claims.auth_time) || Math.sign(claims.auth_time) !== 1)) {
        throw new OPE('ID Token "auth_time" (authentication time) must be a positive number');
    }
    maxAge ?? (maxAge = client.default_max_age ?? skipAuthTimeCheck);
    if ((client.require_auth_time || maxAge !== skipAuthTimeCheck) && claims.auth_time === undefined) {
        throw new OPE('ID Token "auth_time" (authentication time) claim missing');
    }
    if (maxAge !== skipAuthTimeCheck) {
        if (typeof maxAge !== 'number' || maxAge < 0) {
            throw new TypeError('"maxAge" must be a non-negative number');
        }
        const now = epochTime() + getClockSkew(client);
        const tolerance = getClockTolerance(client);
        if (claims.auth_time + maxAge < now - tolerance) {
            throw new OPE('too much time has elapsed since the last End-User authentication');
        }
    }
    if (!validateString(expectedNonce)) {
        throw new TypeError('"expectedNonce" must be a non-empty string');
    }
    if (claims.nonce !== expectedNonce) {
        throw new OPE('unexpected ID Token "nonce" claim value');
    }
    if (Array.isArray(claims.aud) && claims.aud.length !== 1) {
        if (claims.azp === undefined) {
            throw new OPE('ID Token "aud" (audience) claim includes additional untrusted audiences');
        }
        if (claims.azp !== client.client_id) {
            throw new OPE('unexpected ID Token "azp" (authorized party) claim value');
        }
    }
    return result;
}
function checkSigningAlgorithm(client, issuer, header) {
    if (client !== undefined) {
        if (header.alg !== client) {
            throw new OPE('unexpected JWT "alg" header parameter');
        }
        return;
    }
    if (Array.isArray(issuer)) {
        if (!issuer.includes(header.alg)) {
            throw new OPE('unexpected JWT "alg" header parameter');
        }
        return;
    }
    if (header.alg !== 'RS256') {
        throw new OPE('unexpected JWT "alg" header parameter');
    }
}
function getURLSearchParameter(parameters, name) {
    const { 0: value, length } = parameters.getAll(name);
    if (length > 1) {
        throw new OPE(`"${name}" parameter must be provided only once`);
    }
    return value;
}
const skipStateCheck = Symbol();
const expectNoState = Symbol();
function validateAuthResponse(as, client, parameters, expectedState) {
    assertAs(as);
    assertClient(client);
    if (parameters instanceof URL) {
        parameters = parameters.searchParams;
    }
    if (!(parameters instanceof URLSearchParams)) {
        throw new TypeError('"parameters" must be an instance of URLSearchParams, or URL');
    }
    if (getURLSearchParameter(parameters, 'response')) {
        throw new OPE('"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()');
    }
    const iss = getURLSearchParameter(parameters, 'iss');
    const state = getURLSearchParameter(parameters, 'state');
    if (!iss && as.authorization_response_iss_parameter_supported) {
        throw new OPE('response parameter "iss" (issuer) missing');
    }
    if (iss && iss !== as.issuer) {
        throw new OPE('unexpected "iss" (issuer) response parameter value');
    }
    switch(expectedState){
        case undefined:
        case expectNoState:
            if (state !== undefined) {
                throw new OPE('unexpected "state" response parameter encountered');
            }
            break;
        case skipStateCheck:
            break;
        default:
            if (!validateString(expectedState)) {
                throw new OPE('"expectedState" must be a non-empty string');
            }
            if (state === undefined) {
                throw new OPE('response parameter "state" missing');
            }
            if (state !== expectedState) {
                throw new OPE('unexpected "state" response parameter value');
            }
    }
    const error = getURLSearchParameter(parameters, 'error');
    if (error) {
        return {
            error,
            error_description: getURLSearchParameter(parameters, 'error_description'),
            error_uri: getURLSearchParameter(parameters, 'error_uri')
        };
    }
    const id_token = getURLSearchParameter(parameters, 'id_token');
    const token = getURLSearchParameter(parameters, 'token');
    if (id_token !== undefined || token !== undefined) {
        throw new UnsupportedOperationError('implicit and hybrid flows are not supported');
    }
    return brand(new URLSearchParams(parameters));
}
function algToSubtle(alg, crv) {
    switch(alg){
        case 'PS256':
        case 'PS384':
        case 'PS512':
            return {
                name: 'RSA-PSS',
                hash: `SHA-${alg.slice(-3)}`
            };
        case 'RS256':
        case 'RS384':
        case 'RS512':
            return {
                name: 'RSASSA-PKCS1-v1_5',
                hash: `SHA-${alg.slice(-3)}`
            };
        case 'ES256':
        case 'ES384':
            return {
                name: 'ECDSA',
                namedCurve: `P-${alg.slice(-3)}`
            };
        case 'ES512':
            return {
                name: 'ECDSA',
                namedCurve: 'P-521'
            };
        case 'EdDSA':
            {
                switch(crv){
                    case 'Ed25519':
                    case 'Ed448':
                        return crv;
                    default:
                        throw new UnsupportedOperationError();
                }
            }
        default:
            throw new UnsupportedOperationError();
    }
}
async function importJwk(alg, jwk) {
    const { ext, key_ops, use, ...key } = jwk;
    return crypto.subtle.importKey('jwk', key, algToSubtle(alg, jwk.crv), true, [
        'verify'
    ]);
}
async function deviceAuthorizationRequest(as, client, parameters, options) {
    assertAs(as);
    assertClient(client);
    const url = resolveEndpoint(as, 'device_authorization_endpoint', alias(client, options));
    const body = new URLSearchParams(parameters);
    body.set('client_id', client.client_id);
    const headers = prepareHeaders(options?.headers);
    headers.set('accept', 'application/json');
    return authenticatedRequest(as, client, 'POST', url, body, headers, options);
}
async function processDeviceAuthorizationResponse(as, client, response) {
    assertAs(as);
    assertClient(client);
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response');
    }
    if (response.status !== 200) {
        let err;
        if (err = await handleOAuthBodyError(response)) {
            return err;
        }
        throw new OPE('"response" is not a conform Device Authorization Endpoint response');
    }
    assertReadableResponse(response);
    let json;
    try {
        json = await response.json();
    } catch (cause) {
        throw new OPE('failed to parse "response" body as JSON', {
            cause
        });
    }
    if (!isJsonObject(json)) {
        throw new OPE('"response" body must be a top level object');
    }
    if (!validateString(json.device_code)) {
        throw new OPE('"response" body "device_code" property must be a non-empty string');
    }
    if (!validateString(json.user_code)) {
        throw new OPE('"response" body "user_code" property must be a non-empty string');
    }
    if (!validateString(json.verification_uri)) {
        throw new OPE('"response" body "verification_uri" property must be a non-empty string');
    }
    if (typeof json.expires_in !== 'number' || json.expires_in <= 0) {
        throw new OPE('"response" body "expires_in" property must be a positive number');
    }
    if (json.verification_uri_complete !== undefined && !validateString(json.verification_uri_complete)) {
        throw new OPE('"response" body "verification_uri_complete" property must be a non-empty string');
    }
    if (json.interval !== undefined && (typeof json.interval !== 'number' || json.interval <= 0)) {
        throw new OPE('"response" body "interval" property must be a positive number');
    }
    return json;
}
async function deviceCodeGrantRequest(as, client, deviceCode, options) {
    assertAs(as);
    assertClient(client);
    if (!validateString(deviceCode)) {
        throw new TypeError('"deviceCode" must be a non-empty string');
    }
    const parameters = new URLSearchParams(options?.additionalParameters);
    parameters.set('device_code', deviceCode);
    return tokenEndpointRequest(as, client, 'urn:ietf:params:oauth:grant-type:device_code', parameters, options);
}
async function processDeviceCodeResponse(as, client, response) {
    return processGenericAccessTokenResponse(as, client, response);
}
async function generateKeyPair(alg, options) {
    if (!validateString(alg)) {
        throw new TypeError('"alg" must be a non-empty string');
    }
    const algorithm = algToSubtle(alg, alg === 'EdDSA' ? options?.crv ?? 'Ed25519' : undefined);
    if (alg.startsWith('PS') || alg.startsWith('RS')) {
        Object.assign(algorithm, {
            modulusLength: options?.modulusLength ?? 2048,
            publicExponent: new Uint8Array([
                0x01,
                0x00,
                0x01
            ])
        });
    }
    return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, [
        'sign',
        'verify'
    ]);
}
function normalizeHtu(htu) {
    const url = new URL(htu);
    url.search = '';
    url.hash = '';
    return url.href;
}
async function validateDPoP(as, request, accessToken, accessTokenClaims, options) {
    const header = request.headers.get('dpop');
    if (header === null) {
        throw new OPE('operation indicated DPoP use but the request has no DPoP HTTP Header');
    }
    if (request.headers.get('authorization')?.toLowerCase().startsWith('dpop ') === false) {
        throw new OPE(`operation indicated DPoP use but the request's Authorization HTTP Header scheme is not DPoP`);
    }
    if (typeof accessTokenClaims.cnf?.jkt !== 'string') {
        throw new OPE('operation indicated DPoP use but the JWT Access Token has no jkt confirmation claim');
    }
    const clockSkew = getClockSkew(options);
    const proof = await validateJwt(header, checkSigningAlgorithm.bind(undefined, undefined, as?.dpop_signing_alg_values_supported || SUPPORTED_JWS_ALGS), async ({ jwk, alg })=>{
        if (!jwk) {
            throw new OPE('DPoP Proof is missing the jwk header parameter');
        }
        const key = await importJwk(alg, jwk);
        if (key.type !== 'public') {
            throw new OPE('DPoP Proof jwk header parameter must contain a public key');
        }
        return key;
    }, clockSkew, getClockTolerance(options), undefined).then(checkJwtType.bind(undefined, 'dpop+jwt')).then(validatePresence.bind(undefined, [
        'iat',
        'jti',
        'ath',
        'htm',
        'htu'
    ]));
    const now = epochTime() + clockSkew;
    const diff = Math.abs(now - proof.claims.iat);
    if (diff > 300) {
        throw new OPE('DPoP Proof iat is not recent enough');
    }
    if (proof.claims.htm !== request.method) {
        throw new OPE('DPoP Proof htm mismatch');
    }
    if (typeof proof.claims.htu !== 'string' || normalizeHtu(proof.claims.htu) !== normalizeHtu(request.url)) {
        throw new OPE('DPoP Proof htu mismatch');
    }
    {
        const expected = b64u(await crypto.subtle.digest('SHA-256', encoder.encode(accessToken)));
        if (proof.claims.ath !== expected) {
            throw new OPE('DPoP Proof ath mismatch');
        }
    }
    {
        let components;
        switch(proof.header.jwk.kty){
            case 'EC':
                components = {
                    crv: proof.header.jwk.crv,
                    kty: proof.header.jwk.kty,
                    x: proof.header.jwk.x,
                    y: proof.header.jwk.y
                };
                break;
            case 'OKP':
                components = {
                    crv: proof.header.jwk.crv,
                    kty: proof.header.jwk.kty,
                    x: proof.header.jwk.x
                };
                break;
            case 'RSA':
                components = {
                    e: proof.header.jwk.e,
                    kty: proof.header.jwk.kty,
                    n: proof.header.jwk.n
                };
                break;
            default:
                throw new UnsupportedOperationError();
        }
        const expected = b64u(await crypto.subtle.digest('SHA-256', encoder.encode(JSON.stringify(components))));
        if (accessTokenClaims.cnf.jkt !== expected) {
            throw new OPE('JWT Access Token confirmation mismatch');
        }
    }
}
async function validateJwtAccessToken(as, request, expectedAudience, options) {
    assertAs(as);
    if (!looseInstanceOf(request, Request)) {
        throw new TypeError('"request" must be an instance of Request');
    }
    if (!validateString(expectedAudience)) {
        throw new OPE('"expectedAudience" must be a non-empty string');
    }
    const authorization = request.headers.get('authorization');
    if (authorization === null) {
        throw new OPE('"request" is missing an Authorization HTTP Header');
    }
    let { 0: scheme, 1: accessToken, length } = authorization.split(' ');
    scheme = scheme.toLowerCase();
    switch(scheme){
        case 'dpop':
        case 'bearer':
            break;
        default:
            throw new UnsupportedOperationError('unsupported Authorization HTTP Header scheme');
    }
    if (length !== 2) {
        throw new OPE('invalid Authorization HTTP Header format');
    }
    const requiredClaims = [
        'iss',
        'exp',
        'aud',
        'sub',
        'iat',
        'jti',
        'client_id'
    ];
    if (options?.requireDPoP || scheme === 'dpop' || request.headers.has('dpop')) {
        requiredClaims.push('cnf');
    }
    const { claims } = await validateJwt(accessToken, checkSigningAlgorithm.bind(undefined, undefined, SUPPORTED_JWS_ALGS), getPublicSigKeyFromIssuerJwksUri.bind(undefined, as, options), getClockSkew(options), getClockTolerance(options), undefined).then(checkJwtType.bind(undefined, 'at+jwt')).then(validatePresence.bind(undefined, requiredClaims)).then(validateIssuer.bind(undefined, as.issuer)).then(validateAudience.bind(undefined, expectedAudience));
    for (const claim of [
        'client_id',
        'jti',
        'sub'
    ]){
        if (typeof claims[claim] !== 'string') {
            throw new OPE(`unexpected JWT "${claim}" claim type`);
        }
    }
    if ('cnf' in claims) {
        if (!isJsonObject(claims.cnf)) {
            throw new OPE('unexpected JWT "cnf" (confirmation) claim value');
        }
        const { 0: cnf, length } = Object.keys(claims.cnf);
        if (length) {
            if (length !== 1) {
                throw new UnsupportedOperationError('multiple confirmation claims are not supported');
            }
            if (cnf !== 'jkt') {
                throw new UnsupportedOperationError('unsupported JWT Confirmation method');
            }
        }
    }
    if (options?.requireDPoP || scheme === 'dpop' || claims.cnf?.jkt !== undefined || request.headers.has('dpop')) {
        await validateDPoP(as, request, accessToken, claims, options);
    }
    return claims;
}
const experimentalCustomFetch = customFetch;
const experimental_customFetch = customFetch;
const experimentalUseMtlsAlias = useMtlsAlias;
const experimental_useMtlsAlias = useMtlsAlias;
const experimental_validateDetachedSignatureResponse = (...args)=>validateDetachedSignatureResponse(...args);
const experimental_validateJwtAccessToken = (...args)=>validateJwtAccessToken(...args);
const validateJwtUserinfoSignature = (...args)=>validateJwtUserInfoSignature(...args);
const experimental_jwksCache = jwksCache;
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/native.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const __TURBOPACK__default__export__ = {
    randomUUID: __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomUUID
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/rng.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>rng
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate
let poolPtr = rnds8Pool.length;
function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomFillSync(rnds8Pool);
        poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/regex.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/validate.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$regex$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/regex.js [app-rsc] (ecmascript)");
;
function validate(uuid) {
    return typeof uuid === 'string' && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$regex$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].test(uuid);
}
const __TURBOPACK__default__export__ = validate;
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/stringify.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "unsafeStringify",
    ()=>unsafeStringify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/validate.js [app-rsc] (ecmascript)");
;
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ const byteToHex = [];
for(let i = 0; i < 256; ++i){
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
const __TURBOPACK__default__export__ = stringify;
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/v4.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/native.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/rng.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/stringify.js [app-rsc] (ecmascript)");
;
;
;
function v4(options, buf, offset) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].randomUUID && !buf && !options) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(let i = 0; i < 16; ++i){
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unsafeStringify"])(rnds);
}
const __TURBOPACK__default__export__ = v4;
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/v4.js [app-rsc] (ecmascript) <export default as v4>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "v4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/v4.js [app-rsc] (ecmascript)");
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/uuids.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateUuid",
    ()=>generateUuid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/v4.js [app-rsc] (ecmascript) <export default as v4>");
;
function generateUuid() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/uuids.js [app-rsc] (ecmascript)");
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
        const newError = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("Uncaught error in asynchronous function: " + error.toString(), {
            duringError
        }, {
            cause: error
        });
        if (!options.ignoreErrors) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["captureError"])("runAsynchronously", newError);
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
        promise.then((value)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(value)),
        wait(ms).then(()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(new TimeoutError(ms)))
    ]);
}
async function timeoutThrow(promise, ms) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].orThrow(await timeout(promise, ms));
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
                const uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateUuid"])();
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
        const value = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].fromPromise(func());
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AsyncResult",
    ()=>AsyncResult,
    "Result",
    ()=>Result
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-rsc] (ecmascript)");
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
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wait"])(Math.random() * exponentialDelayBase * 2 ** i);
            }
        }
    }
    return Result.error(new RetryError(errors));
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/stores.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AsyncStore",
    ()=>AsyncStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/uuids.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-rsc] (ecmascript)");
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncResult"].error(this._rejectionError);
        } else if (this.isAvailable()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncResult"].ok(this._value);
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncResult"].pending();
        }
    }
    getOrWait() {
        const uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateUuid"])();
        if (this.isRejected()) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rejected"])(this._rejectionError);
        } else if (this.isAvailable()) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolved"])(this._value);
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pending"])(withFinally);
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
        this._setIfLatest(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(value), ++this._updateCounter);
    }
    update(updater) {
        const value = updater(this._value);
        this.set(value);
        return value;
    }
    async setAsync(promise) {
        const curCounter = ++this._updateCounter;
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].fromPromise(promise);
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
        this._setIfLatest(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(error), ++this._updateCounter);
    }
    map(mapper) {
        const store = new AsyncStore();
        this.onChange((value)=>{
            store.set(mapper(value));
        });
        return store;
    }
    onChange(callback) {
        const uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateUuid"])();
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/functions.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/strings.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/known-errors.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KnownError",
    ()=>KnownError,
    "KnownErrors",
    ()=>KnownErrors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$functions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/functions.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/strings.js [app-rsc] (ecmascript)");
;
;
;
class KnownError extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StatusError"] {
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
        return this.constructor.errorCode ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwStackErr"])(`Can't find error code for this KnownError. Is its constructor a KnownErrorConstructor? ${this}`);
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
    const createFn = create === "inherit" ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$functions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["identityArgs"] : create;
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
        json.details?.originalErrorCode ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])("originalErrorCode not found in UnsupportedError details")
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
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deindent"]`
      This endpoint has multiple overloads, but they all failed to process the request.

        ${overloadErrors.map((e, i)=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deindent"]`
          Overload ${i + 1}: ${JSON.stringify(e, undefined, 2)}
        `).join("\n\n")}
    `,
        {
            overloadErrors
        }
    ], (json)=>[
        json.details?.overloadErrors ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])("overloadErrors not found in AllOverloadsFailed details")
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
        json.details?.requestType ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])("requestType not found in InvalidRequestType details")
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
        json.details?.minLength ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])("minLength not found in PasswordTooShort details")
    ]);
const PasswordTooLong = createKnownErrorConstructor(PasswordRequirementsNotMet, "PASSWORD_TOO_LONG", (maxLength)=>[
        400,
        `Password too long. Maximum length is ${maxLength}.`,
        {
            maxLength
        }
    ], (json)=>[
        json.details?.maxLength ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])("maxLength not found in PasswordTooLong details")
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
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/cookies.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    RequestCookies: null,
    ResponseCookies: null,
    stringifyCookie: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RequestCookies: function() {
        return _cookies.RequestCookies;
    },
    ResponseCookies: function() {
        return _cookies.ResponseCookies;
    },
    stringifyCookie: function() {
        return _cookies.stringifyCookie;
    }
});
const _cookies = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/compiled/@edge-runtime/cookies/index.js [app-rsc] (ecmascript)"); //# sourceMappingURL=cookies.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReflectAdapter", {
    enumerable: true,
    get: function() {
        return ReflectAdapter;
    }
});
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
} //# sourceMappingURL=reflect.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MutableRequestCookiesAdapter: null,
    ReadonlyRequestCookiesError: null,
    RequestCookiesAdapter: null,
    appendMutableCookies: null,
    areCookiesMutableInCurrentPhase: null,
    createCookiesWithMutableAccessCheck: null,
    getModifiedCookieValues: null,
    responseCookiesToRequestCookies: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    MutableRequestCookiesAdapter: function() {
        return MutableRequestCookiesAdapter;
    },
    ReadonlyRequestCookiesError: function() {
        return ReadonlyRequestCookiesError;
    },
    RequestCookiesAdapter: function() {
        return RequestCookiesAdapter;
    },
    appendMutableCookies: function() {
        return appendMutableCookies;
    },
    areCookiesMutableInCurrentPhase: function() {
        return areCookiesMutableInCurrentPhase;
    },
    createCookiesWithMutableAccessCheck: function() {
        return createCookiesWithMutableAccessCheck;
    },
    getModifiedCookieValues: function() {
        return getModifiedCookieValues;
    },
    responseCookiesToRequestCookies: function() {
        return responseCookiesToRequestCookies;
    }
});
const _cookies = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/cookies.js [app-rsc] (ecmascript)");
const _reflect = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-rsc] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
class ReadonlyRequestCookiesError extends Error {
    constructor(){
        super('Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options');
    }
    static callable() {
        throw new ReadonlyRequestCookiesError();
    }
}
class RequestCookiesAdapter {
    static seal(cookies) {
        return new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'clear':
                    case 'delete':
                    case 'set':
                        return ReadonlyRequestCookiesError.callable;
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
}
const SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for('next.mutated.cookies');
function getModifiedCookieValues(cookies) {
    const modified = cookies[SYMBOL_MODIFY_COOKIE_VALUES];
    if (!modified || !Array.isArray(modified) || modified.length === 0) {
        return [];
    }
    return modified;
}
function appendMutableCookies(headers, mutableCookies) {
    const modifiedCookieValues = getModifiedCookieValues(mutableCookies);
    if (modifiedCookieValues.length === 0) {
        return false;
    }
    // Return a new response that extends the response with
    // the modified cookies as fallbacks. `res` cookies
    // will still take precedence.
    const resCookies = new _cookies.ResponseCookies(headers);
    const returnedCookies = resCookies.getAll();
    // Set the modified cookies as fallbacks.
    for (const cookie of modifiedCookieValues){
        resCookies.set(cookie);
    }
    // Set the original cookies as the final values.
    for (const cookie of returnedCookies){
        resCookies.set(cookie);
    }
    return true;
}
class MutableRequestCookiesAdapter {
    static wrap(cookies, onUpdateCookies) {
        const responseCookies = new _cookies.ResponseCookies(new Headers());
        for (const cookie of cookies.getAll()){
            responseCookies.set(cookie);
        }
        let modifiedValues = [];
        const modifiedCookies = new Set();
        const updateResponseCookies = ()=>{
            // TODO-APP: change method of getting workStore
            const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
            if (workStore) {
                workStore.pathWasRevalidated = true;
            }
            const allCookies = responseCookies.getAll();
            modifiedValues = allCookies.filter((c)=>modifiedCookies.has(c.name));
            if (onUpdateCookies) {
                const serializedCookies = [];
                for (const cookie of modifiedValues){
                    const tempCookies = new _cookies.ResponseCookies(new Headers());
                    tempCookies.set(cookie);
                    serializedCookies.push(tempCookies.toString());
                }
                onUpdateCookies(serializedCookies);
            }
        };
        const wrappedCookies = new Proxy(responseCookies, {
            get (target, prop, receiver) {
                switch(prop){
                    // A special symbol to get the modified cookie values
                    case SYMBOL_MODIFY_COOKIE_VALUES:
                        return modifiedValues;
                    // TODO: Throw error if trying to set a cookie after the response
                    // headers have been set.
                    case 'delete':
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === 'string' ? args[0] : args[0].name);
                            try {
                                target.delete(...args);
                                return wrappedCookies;
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    case 'set':
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === 'string' ? args[0] : args[0].name);
                            try {
                                target.set(...args);
                                return wrappedCookies;
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
        return wrappedCookies;
    }
}
function createCookiesWithMutableAccessCheck(requestStore) {
    const wrappedCookies = new Proxy(requestStore.mutableCookies, {
        get (target, prop, receiver) {
            switch(prop){
                case 'delete':
                    return function(...args) {
                        ensureCookiesAreStillMutable(requestStore, 'cookies().delete');
                        target.delete(...args);
                        return wrappedCookies;
                    };
                case 'set':
                    return function(...args) {
                        ensureCookiesAreStillMutable(requestStore, 'cookies().set');
                        target.set(...args);
                        return wrappedCookies;
                    };
                default:
                    return _reflect.ReflectAdapter.get(target, prop, receiver);
            }
        }
    });
    return wrappedCookies;
}
function areCookiesMutableInCurrentPhase(requestStore) {
    return requestStore.phase === 'action';
}
/** Ensure that cookies() starts throwing on mutation
 * if we changed phases and can no longer mutate.
 *
 * This can happen when going:
 *   'render' -> 'after'
 *   'action' -> 'render'
 * */ function ensureCookiesAreStillMutable(requestStore, _callingExpression) {
    if (!areCookiesMutableInCurrentPhase(requestStore)) {
        // TODO: maybe we can give a more precise error message based on callingExpression?
        throw new ReadonlyRequestCookiesError();
    }
}
function responseCookiesToRequestCookies(responseCookies) {
    const requestCookies = new _cookies.RequestCookies(new Headers());
    for (const cookie of responseCookies.getAll()){
        requestCookies.set(cookie);
    }
    return requestCookies;
} //# sourceMappingURL=request-cookies.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/hooks-server-context.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DynamicServerError: null,
    isDynamicServerError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DynamicServerError: function() {
        return DynamicServerError;
    },
    isDynamicServerError: function() {
        return isDynamicServerError;
    }
});
const DYNAMIC_ERROR_CODE = 'DYNAMIC_SERVER_USAGE';
class DynamicServerError extends Error {
    constructor(description){
        super(`Dynamic server usage: ${description}`), this.description = description, this.digest = DYNAMIC_ERROR_CODE;
    }
}
function isDynamicServerError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err) || typeof err.digest !== 'string') {
        return false;
    }
    return err.digest === DYNAMIC_ERROR_CODE;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=hooks-server-context.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StaticGenBailoutError: null,
    isStaticGenBailoutError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    StaticGenBailoutError: function() {
        return StaticGenBailoutError;
    },
    isStaticGenBailoutError: function() {
        return isStaticGenBailoutError;
    }
});
const NEXT_STATIC_GEN_BAILOUT = 'NEXT_STATIC_GEN_BAILOUT';
class StaticGenBailoutError extends Error {
    constructor(...args){
        super(...args), this.code = NEXT_STATIC_GEN_BAILOUT;
    }
}
function isStaticGenBailoutError(error) {
    if (typeof error !== 'object' || error === null || !('code' in error)) {
        return false;
    }
    return error.code === NEXT_STATIC_GEN_BAILOUT;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=static-generation-bailout.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/dynamic-rendering-utils.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isHangingPromiseRejectionError: null,
    makeDevtoolsIOAwarePromise: null,
    makeHangingPromise: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isHangingPromiseRejectionError: function() {
        return isHangingPromiseRejectionError;
    },
    makeDevtoolsIOAwarePromise: function() {
        return makeDevtoolsIOAwarePromise;
    },
    makeHangingPromise: function() {
        return makeHangingPromise;
    }
});
function isHangingPromiseRejectionError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === HANGING_PROMISE_REJECTION;
}
const HANGING_PROMISE_REJECTION = 'HANGING_PROMISE_REJECTION';
class HangingPromiseRejectionError extends Error {
    constructor(route, expression){
        super(`During prerendering, ${expression} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${expression} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${route}".`), this.route = route, this.expression = expression, this.digest = HANGING_PROMISE_REJECTION;
    }
}
const abortListenersBySignal = new WeakMap();
function makeHangingPromise(signal, route, expression) {
    if (signal.aborted) {
        return Promise.reject(new HangingPromiseRejectionError(route, expression));
    } else {
        const hangingPromise = new Promise((_, reject)=>{
            const boundRejection = reject.bind(null, new HangingPromiseRejectionError(route, expression));
            let currentListeners = abortListenersBySignal.get(signal);
            if (currentListeners) {
                currentListeners.push(boundRejection);
            } else {
                const listeners = [
                    boundRejection
                ];
                abortListenersBySignal.set(signal, listeners);
                signal.addEventListener('abort', ()=>{
                    for(let i = 0; i < listeners.length; i++){
                        listeners[i]();
                    }
                }, {
                    once: true
                });
            }
        });
        // We are fine if no one actually awaits this promise. We shouldn't consider this an unhandled rejection so
        // we attach a noop catch handler here to suppress this warning. If you actually await somewhere or construct
        // your own promise out of it you'll need to ensure you handle the error when it rejects.
        hangingPromise.catch(ignoreReject);
        return hangingPromise;
    }
}
function ignoreReject() {}
function makeDevtoolsIOAwarePromise(underlying, requestStore, stage) {
    if (requestStore.stagedRendering) {
        // We resolve each stage in a timeout, so React DevTools will pick this up as IO.
        return requestStore.stagedRendering.delayUntilStage(stage, undefined, underlying);
    }
    // in React DevTools if we resolve in a setTimeout we will observe
    // the promise resolution as something that can suspend a boundary or root.
    return new Promise((resolve)=>{
        // Must use setTimeout to be considered IO React DevTools. setImmediate will not work.
        setTimeout(()=>{
            resolve(underlying);
        }, 0);
    });
} //# sourceMappingURL=dynamic-rendering-utils.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/lib/framework/boundary-constants.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    METADATA_BOUNDARY_NAME: null,
    OUTLET_BOUNDARY_NAME: null,
    ROOT_LAYOUT_BOUNDARY_NAME: null,
    VIEWPORT_BOUNDARY_NAME: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    METADATA_BOUNDARY_NAME: function() {
        return METADATA_BOUNDARY_NAME;
    },
    OUTLET_BOUNDARY_NAME: function() {
        return OUTLET_BOUNDARY_NAME;
    },
    ROOT_LAYOUT_BOUNDARY_NAME: function() {
        return ROOT_LAYOUT_BOUNDARY_NAME;
    },
    VIEWPORT_BOUNDARY_NAME: function() {
        return VIEWPORT_BOUNDARY_NAME;
    }
});
const METADATA_BOUNDARY_NAME = '__next_metadata_boundary__';
const VIEWPORT_BOUNDARY_NAME = '__next_viewport_boundary__';
const OUTLET_BOUNDARY_NAME = '__next_outlet_boundary__';
const ROOT_LAYOUT_BOUNDARY_NAME = '__next_root_layout_boundary__'; //# sourceMappingURL=boundary-constants.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/lib/scheduler.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    atLeastOneTask: null,
    scheduleImmediate: null,
    scheduleOnNextTick: null,
    waitAtLeastOneReactRenderTask: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    atLeastOneTask: function() {
        return atLeastOneTask;
    },
    scheduleImmediate: function() {
        return scheduleImmediate;
    },
    scheduleOnNextTick: function() {
        return scheduleOnNextTick;
    },
    waitAtLeastOneReactRenderTask: function() {
        return waitAtLeastOneReactRenderTask;
    }
});
const scheduleOnNextTick = (cb)=>{
    // We use Promise.resolve().then() here so that the operation is scheduled at
    // the end of the promise job queue, we then add it to the next process tick
    // to ensure it's evaluated afterwards.
    //
    // This was inspired by the implementation of the DataLoader interface: https://github.com/graphql/dataloader/blob/d336bd15282664e0be4b4a657cb796f09bafbc6b/src/index.js#L213-L255
    //
    Promise.resolve().then(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            process.nextTick(cb);
        }
    });
};
const scheduleImmediate = (cb)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        setImmediate(cb);
    }
};
function atLeastOneTask() {
    return new Promise((resolve)=>scheduleImmediate(resolve));
}
function waitAtLeastOneReactRenderTask() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return new Promise((r)=>setImmediate(r));
    }
} //# sourceMappingURL=scheduler.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This has to be a shared module which is shared between client component error boundary and dynamic component
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BailoutToCSRError: null,
    isBailoutToCSRError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    BailoutToCSRError: function() {
        return BailoutToCSRError;
    },
    isBailoutToCSRError: function() {
        return isBailoutToCSRError;
    }
});
const BAILOUT_TO_CSR = 'BAILOUT_TO_CLIENT_SIDE_RENDERING';
class BailoutToCSRError extends Error {
    constructor(reason){
        super(`Bail out to client-side rendering: ${reason}`), this.reason = reason, this.digest = BAILOUT_TO_CSR;
    }
}
function isBailoutToCSRError(err) {
    if (typeof err !== 'object' || err === null || !('digest' in err)) {
        return false;
    }
    return err.digest === BAILOUT_TO_CSR;
} //# sourceMappingURL=bailout-to-csr.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/promise-with-resolvers.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createPromiseWithResolvers", {
    enumerable: true,
    get: function() {
        return createPromiseWithResolvers;
    }
});
function createPromiseWithResolvers() {
    // Shim of Stage 4 Promise.withResolvers proposal
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
    return {
        resolve: resolve,
        reject: reject,
        promise
    };
} //# sourceMappingURL=promise-with-resolvers.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/staged-rendering.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    RenderStage: null,
    StagedRenderingController: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RenderStage: function() {
        return RenderStage;
    },
    StagedRenderingController: function() {
        return StagedRenderingController;
    }
});
const _invarianterror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/invariant-error.js [app-rsc] (ecmascript)");
const _promisewithresolvers = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/promise-with-resolvers.js [app-rsc] (ecmascript)");
var RenderStage = /*#__PURE__*/ function(RenderStage) {
    RenderStage[RenderStage["Static"] = 1] = "Static";
    RenderStage[RenderStage["Runtime"] = 2] = "Runtime";
    RenderStage[RenderStage["Dynamic"] = 3] = "Dynamic";
    return RenderStage;
}({});
class StagedRenderingController {
    constructor(abortSignal = null){
        this.abortSignal = abortSignal;
        this.currentStage = 1;
        this.runtimeStagePromise = (0, _promisewithresolvers.createPromiseWithResolvers)();
        this.dynamicStagePromise = (0, _promisewithresolvers.createPromiseWithResolvers)();
        if (abortSignal) {
            abortSignal.addEventListener('abort', ()=>{
                const { reason } = abortSignal;
                if (this.currentStage < 2) {
                    this.runtimeStagePromise.promise.catch(ignoreReject) // avoid unhandled rejections
                    ;
                    this.runtimeStagePromise.reject(reason);
                }
                if (this.currentStage < 3) {
                    this.dynamicStagePromise.promise.catch(ignoreReject) // avoid unhandled rejections
                    ;
                    this.dynamicStagePromise.reject(reason);
                }
            }, {
                once: true
            });
        }
    }
    advanceStage(stage) {
        // If we're already at the target stage or beyond, do nothing.
        // (this can happen e.g. if sync IO advanced us to the dynamic stage)
        if (this.currentStage >= stage) {
            return;
        }
        this.currentStage = stage;
        // Note that we might be going directly from Static to Dynamic,
        // so we need to resolve the runtime stage as well.
        if (stage >= 2) {
            this.runtimeStagePromise.resolve();
        }
        if (stage >= 3) {
            this.dynamicStagePromise.resolve();
        }
    }
    getStagePromise(stage) {
        switch(stage){
            case 2:
                {
                    return this.runtimeStagePromise.promise;
                }
            case 3:
                {
                    return this.dynamicStagePromise.promise;
                }
            default:
                {
                    stage;
                    throw Object.defineProperty(new _invarianterror.InvariantError(`Invalid render stage: ${stage}`), "__NEXT_ERROR_CODE", {
                        value: "E881",
                        enumerable: false,
                        configurable: true
                    });
                }
        }
    }
    waitForStage(stage) {
        return this.getStagePromise(stage);
    }
    delayUntilStage(stage, displayName, resolvedValue) {
        const ioTriggerPromise = this.getStagePromise(stage);
        const promise = makeDevtoolsIOPromiseFromIOTrigger(ioTriggerPromise, displayName, resolvedValue);
        // Analogously to `makeHangingPromise`, we might reject this promise if the signal is invoked.
        // (e.g. in the case where we don't want want the render to proceed to the dynamic stage and abort it).
        // We shouldn't consider this an unhandled rejection, so we attach a noop catch handler here to suppress this warning.
        if (this.abortSignal) {
            promise.catch(ignoreReject);
        }
        return promise;
    }
}
function ignoreReject() {}
// TODO(restart-on-cache-miss): the layering of `delayUntilStage`,
// `makeDevtoolsIOPromiseFromIOTrigger` and and `makeDevtoolsIOAwarePromise`
// is confusing, we should clean it up.
function makeDevtoolsIOPromiseFromIOTrigger(ioTrigger, displayName, resolvedValue) {
    // If we create a `new Promise` and give it a displayName
    // (with no userspace code above us in the stack)
    // React Devtools will use it as the IO cause when determining "suspended by".
    // In particular, it should shadow any inner IO that resolved/rejected the promise
    // (in case of staged rendering, this will be the `setTimeout` that triggers the relevant stage)
    const promise = new Promise((resolve, reject)=>{
        ioTrigger.then(resolve.bind(null, resolvedValue), reject);
    });
    if (displayName !== undefined) {
        // @ts-expect-error
        promise.displayName = displayName;
    }
    return promise;
} //# sourceMappingURL=staged-rendering.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * The functions provided by this module are used to communicate certain properties
 * about the currently running code so that Next.js can make decisions on how to handle
 * the current execution in different rendering modes such as pre-rendering, resuming, and SSR.
 *
 * Today Next.js treats all code as potentially static. Certain APIs may only make sense when dynamically rendering.
 * Traditionally this meant deopting the entire render to dynamic however with PPR we can now deopt parts
 * of a React tree as dynamic while still keeping other parts static. There are really two different kinds of
 * Dynamic indications.
 *
 * The first is simply an intention to be dynamic. unstable_noStore is an example of this where
 * the currently executing code simply declares that the current scope is dynamic but if you use it
 * inside unstable_cache it can still be cached. This type of indication can be removed if we ever
 * make the default dynamic to begin with because the only way you would ever be static is inside
 * a cache scope which this indication does not affect.
 *
 * The second is an indication that a dynamic data source was read. This is a stronger form of dynamic
 * because it means that it is inappropriate to cache this at all. using a dynamic data source inside
 * unstable_cache should error. If you want to use some dynamic data inside unstable_cache you should
 * read that data outside the cache and pass it in as an argument to the cached function.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Postpone: null,
    PreludeState: null,
    abortAndThrowOnSynchronousRequestDataAccess: null,
    abortOnSynchronousPlatformIOAccess: null,
    accessedDynamicData: null,
    annotateDynamicAccess: null,
    consumeDynamicAccess: null,
    createDynamicTrackingState: null,
    createDynamicValidationState: null,
    createHangingInputAbortSignal: null,
    createRenderInBrowserAbortSignal: null,
    delayUntilRuntimeStage: null,
    formatDynamicAPIAccesses: null,
    getFirstDynamicReason: null,
    isDynamicPostpone: null,
    isPrerenderInterruptedError: null,
    logDisallowedDynamicError: null,
    markCurrentScopeAsDynamic: null,
    postponeWithTracking: null,
    throwIfDisallowedDynamic: null,
    throwToInterruptStaticGeneration: null,
    trackAllowedDynamicAccess: null,
    trackDynamicDataInDynamicRender: null,
    trackSynchronousPlatformIOAccessInDev: null,
    useDynamicRouteParams: null,
    useDynamicSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Postpone: function() {
        return Postpone;
    },
    PreludeState: function() {
        return PreludeState;
    },
    abortAndThrowOnSynchronousRequestDataAccess: function() {
        return abortAndThrowOnSynchronousRequestDataAccess;
    },
    abortOnSynchronousPlatformIOAccess: function() {
        return abortOnSynchronousPlatformIOAccess;
    },
    accessedDynamicData: function() {
        return accessedDynamicData;
    },
    annotateDynamicAccess: function() {
        return annotateDynamicAccess;
    },
    consumeDynamicAccess: function() {
        return consumeDynamicAccess;
    },
    createDynamicTrackingState: function() {
        return createDynamicTrackingState;
    },
    createDynamicValidationState: function() {
        return createDynamicValidationState;
    },
    createHangingInputAbortSignal: function() {
        return createHangingInputAbortSignal;
    },
    createRenderInBrowserAbortSignal: function() {
        return createRenderInBrowserAbortSignal;
    },
    delayUntilRuntimeStage: function() {
        return delayUntilRuntimeStage;
    },
    formatDynamicAPIAccesses: function() {
        return formatDynamicAPIAccesses;
    },
    getFirstDynamicReason: function() {
        return getFirstDynamicReason;
    },
    isDynamicPostpone: function() {
        return isDynamicPostpone;
    },
    isPrerenderInterruptedError: function() {
        return isPrerenderInterruptedError;
    },
    logDisallowedDynamicError: function() {
        return logDisallowedDynamicError;
    },
    markCurrentScopeAsDynamic: function() {
        return markCurrentScopeAsDynamic;
    },
    postponeWithTracking: function() {
        return postponeWithTracking;
    },
    throwIfDisallowedDynamic: function() {
        return throwIfDisallowedDynamic;
    },
    throwToInterruptStaticGeneration: function() {
        return throwToInterruptStaticGeneration;
    },
    trackAllowedDynamicAccess: function() {
        return trackAllowedDynamicAccess;
    },
    trackDynamicDataInDynamicRender: function() {
        return trackDynamicDataInDynamicRender;
    },
    trackSynchronousPlatformIOAccessInDev: function() {
        return trackSynchronousPlatformIOAccessInDev;
    },
    useDynamicRouteParams: function() {
        return useDynamicRouteParams;
    },
    useDynamicSearchParams: function() {
        return useDynamicSearchParams;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(__turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)"));
const _hooksservercontext = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/hooks-server-context.js [app-rsc] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/dynamic-rendering-utils.js [app-rsc] (ecmascript)");
const _boundaryconstants = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/lib/framework/boundary-constants.js [app-rsc] (ecmascript)");
const _scheduler = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/lib/scheduler.js [app-rsc] (ecmascript)");
const _bailouttocsr = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-rsc] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/invariant-error.js [app-rsc] (ecmascript)");
const _stagedrendering = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/staged-rendering.js [app-rsc] (ecmascript)");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const hasPostpone = typeof _react.default.unstable_postpone === 'function';
function createDynamicTrackingState(isDebugDynamicAccesses) {
    return {
        isDebugDynamicAccesses,
        dynamicAccesses: [],
        syncDynamicErrorWithStack: null
    };
}
function createDynamicValidationState() {
    return {
        hasSuspenseAboveBody: false,
        hasDynamicMetadata: false,
        hasDynamicViewport: false,
        hasAllowedDynamic: false,
        dynamicErrors: []
    };
}
function getFirstDynamicReason(trackingState) {
    var _trackingState_dynamicAccesses_;
    return (_trackingState_dynamicAccesses_ = trackingState.dynamicAccesses[0]) == null ? void 0 : _trackingState_dynamicAccesses_.expression;
}
function markCurrentScopeAsDynamic(store, workUnitStore, expression) {
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'cache':
            case 'unstable-cache':
                // Inside cache scopes, marking a scope as dynamic has no effect,
                // because the outer cache scope creates a cache boundary. This is
                // subtly different from reading a dynamic data source, which is
                // forbidden inside a cache scope.
                return;
            case 'private-cache':
                // A private cache scope is already dynamic by definition.
                return;
            case 'prerender-legacy':
            case 'prerender-ppr':
            case 'request':
                break;
            default:
                workUnitStore;
        }
    }
    // If we're forcing dynamic rendering or we're forcing static rendering, we
    // don't need to do anything here because the entire page is already dynamic
    // or it's static and it should not throw or postpone here.
    if (store.forceDynamic || store.forceStatic) return;
    if (store.dynamicShouldError) {
        throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${store.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
            value: "E553",
            enumerable: false,
            configurable: true
        });
    }
    if (workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-ppr':
                return postponeWithTracking(store.route, expression, workUnitStore.dynamicTracking);
            case 'prerender-legacy':
                workUnitStore.revalidate = 0;
                // We aren't prerendering, but we are generating a static page. We need
                // to bail out of static generation.
                const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
                    value: "E550",
                    enumerable: false,
                    configurable: true
                });
                store.dynamicUsageDescription = expression;
                store.dynamicUsageStack = err.stack;
                throw err;
            case 'request':
                if ("TURBOPACK compile-time truthy", 1) {
                    workUnitStore.usedDynamic = true;
                }
                break;
            default:
                workUnitStore;
        }
    }
}
function throwToInterruptStaticGeneration(expression, store, prerenderStore) {
    // We aren't prerendering but we are generating a static page. We need to bail out of static generation
    const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${store.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
        value: "E558",
        enumerable: false,
        configurable: true
    });
    prerenderStore.revalidate = 0;
    store.dynamicUsageDescription = expression;
    store.dynamicUsageStack = err.stack;
    throw err;
}
function trackDynamicDataInDynamicRender(workUnitStore) {
    switch(workUnitStore.type){
        case 'cache':
        case 'unstable-cache':
            // Inside cache scopes, marking a scope as dynamic has no effect,
            // because the outer cache scope creates a cache boundary. This is
            // subtly different from reading a dynamic data source, which is
            // forbidden inside a cache scope.
            return;
        case 'private-cache':
            // A private cache scope is already dynamic by definition.
            return;
        case 'prerender':
        case 'prerender-runtime':
        case 'prerender-legacy':
        case 'prerender-ppr':
        case 'prerender-client':
            break;
        case 'request':
            if ("TURBOPACK compile-time truthy", 1) {
                workUnitStore.usedDynamic = true;
            }
            break;
        default:
            workUnitStore;
    }
}
function abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore) {
    const reason = `Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`;
    const error = createPrerenderInterruptedError(reason);
    prerenderStore.controller.abort(error);
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
}
function abortOnSynchronousPlatformIOAccess(route, expression, errorWithStack, prerenderStore) {
    const dynamicTracking = prerenderStore.dynamicTracking;
    abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
    // It is important that we set this tracking value after aborting. Aborts are executed
    // synchronously except for the case where you abort during render itself. By setting this
    // value late we can use it to determine if any of the aborted tasks are the task that
    // called the sync IO expression in the first place.
    if (dynamicTracking) {
        if (dynamicTracking.syncDynamicErrorWithStack === null) {
            dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
        }
    }
}
function trackSynchronousPlatformIOAccessInDev(requestStore) {
    // We don't actually have a controller to abort but we do the semantic equivalent by
    // advancing the request store out of the prerender stage
    if (requestStore.stagedRendering) {
        // TODO: error for sync IO in the runtime stage
        // (which is not currently covered by the validation render in `spawnDynamicValidationInDev`)
        requestStore.stagedRendering.advanceStage(_stagedrendering.RenderStage.Dynamic);
    }
}
function abortAndThrowOnSynchronousRequestDataAccess(route, expression, errorWithStack, prerenderStore) {
    const prerenderSignal = prerenderStore.controller.signal;
    if (prerenderSignal.aborted === false) {
        // TODO it would be better to move this aborted check into the callsite so we can avoid making
        // the error object when it isn't relevant to the aborting of the prerender however
        // since we need the throw semantics regardless of whether we abort it is easier to land
        // this way. See how this was handled with `abortOnSynchronousPlatformIOAccess` for a closer
        // to ideal implementation
        abortOnSynchronousDynamicDataAccess(route, expression, prerenderStore);
        // It is important that we set this tracking value after aborting. Aborts are executed
        // synchronously except for the case where you abort during render itself. By setting this
        // value late we can use it to determine if any of the aborted tasks are the task that
        // called the sync IO expression in the first place.
        const dynamicTracking = prerenderStore.dynamicTracking;
        if (dynamicTracking) {
            if (dynamicTracking.syncDynamicErrorWithStack === null) {
                dynamicTracking.syncDynamicErrorWithStack = errorWithStack;
            }
        }
    }
    throw createPrerenderInterruptedError(`Route ${route} needs to bail out of prerendering at this point because it used ${expression}.`);
}
function Postpone({ reason, route }) {
    const prerenderStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    const dynamicTracking = prerenderStore && prerenderStore.type === 'prerender-ppr' ? prerenderStore.dynamicTracking : null;
    postponeWithTracking(route, reason, dynamicTracking);
}
function postponeWithTracking(route, expression, dynamicTracking) {
    assertPostpone();
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            // When we aren't debugging, we don't need to create another error for the
            // stack trace.
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
    _react.default.unstable_postpone(createPostponeReason(route, expression));
}
function createPostponeReason(route, expression) {
    return `Route ${route} needs to bail out of prerendering at this point because it used ${expression}. ` + `React throws this special object to indicate where. It should not be caught by ` + `your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
}
function isDynamicPostpone(err) {
    if (typeof err === 'object' && err !== null && typeof err.message === 'string') {
        return isDynamicPostponeReason(err.message);
    }
    return false;
}
function isDynamicPostponeReason(reason) {
    return reason.includes('needs to bail out of prerendering at this point because it used') && reason.includes('Learn more: https://nextjs.org/docs/messages/ppr-caught-error');
}
if (isDynamicPostponeReason(createPostponeReason('%%%', '^^^')) === false) {
    throw Object.defineProperty(new Error('Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js'), "__NEXT_ERROR_CODE", {
        value: "E296",
        enumerable: false,
        configurable: true
    });
}
const NEXT_PRERENDER_INTERRUPTED = 'NEXT_PRERENDER_INTERRUPTED';
function createPrerenderInterruptedError(message) {
    const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = NEXT_PRERENDER_INTERRUPTED;
    return error;
}
function isPrerenderInterruptedError(error) {
    return typeof error === 'object' && error !== null && error.digest === NEXT_PRERENDER_INTERRUPTED && 'name' in error && 'message' in error && error instanceof Error;
}
function accessedDynamicData(dynamicAccesses) {
    return dynamicAccesses.length > 0;
}
function consumeDynamicAccess(serverDynamic, clientDynamic) {
    // We mutate because we only call this once we are no longer writing
    // to the dynamicTrackingState and it's more efficient than creating a new
    // array.
    serverDynamic.dynamicAccesses.push(...clientDynamic.dynamicAccesses);
    return serverDynamic.dynamicAccesses;
}
function formatDynamicAPIAccesses(dynamicAccesses) {
    return dynamicAccesses.filter((access)=>typeof access.stack === 'string' && access.stack.length > 0).map(({ expression, stack })=>{
        stack = stack.split('\n') // Remove the "Error: " prefix from the first line of the stack trace as
        // well as the first 4 lines of the stack trace which is the distance
        // from the user code and the `new Error().stack` call.
        .slice(4).filter((line)=>{
            // Exclude Next.js internals from the stack trace.
            if (line.includes('node_modules/next/')) {
                return false;
            }
            // Exclude anonymous functions from the stack trace.
            if (line.includes(' (<anonymous>)')) {
                return false;
            }
            // Exclude Node.js internals from the stack trace.
            if (line.includes(' (node:')) {
                return false;
            }
            return true;
        }).join('\n');
        return `Dynamic API Usage Debug - ${expression}:\n${stack}`;
    });
}
function assertPostpone() {
    if (!hasPostpone) {
        throw Object.defineProperty(new Error(`Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js`), "__NEXT_ERROR_CODE", {
            value: "E224",
            enumerable: false,
            configurable: true
        });
    }
}
function createRenderInBrowserAbortSignal() {
    const controller = new AbortController();
    controller.abort(Object.defineProperty(new _bailouttocsr.BailoutToCSRError('Render in Browser'), "__NEXT_ERROR_CODE", {
        value: "E721",
        enumerable: false,
        configurable: true
    }));
    return controller.signal;
}
function createHangingInputAbortSignal(workUnitStore) {
    switch(workUnitStore.type){
        case 'prerender':
        case 'prerender-runtime':
            const controller = new AbortController();
            if (workUnitStore.cacheSignal) {
                // If we have a cacheSignal it means we're in a prospective render. If
                // the input we're waiting on is coming from another cache, we do want
                // to wait for it so that we can resolve this cache entry too.
                workUnitStore.cacheSignal.inputReady().then(()=>{
                    controller.abort();
                });
            } else {
                // Otherwise we're in the final render and we should already have all
                // our caches filled.
                // If the prerender uses stages, we have wait until the runtime stage,
                // at which point all runtime inputs will be resolved.
                // (otherwise, a runtime prerender might consider `cookies()` hanging
                //  even though they'd resolve in the next task.)
                //
                // We might still be waiting on some microtasks so we
                // wait one tick before giving up. When we give up, we still want to
                // render the content of this cache as deeply as we can so that we can
                // suspend as deeply as possible in the tree or not at all if we don't
                // end up waiting for the input.
                const runtimeStagePromise = (0, _workunitasyncstorageexternal.getRuntimeStagePromise)(workUnitStore);
                if (runtimeStagePromise) {
                    runtimeStagePromise.then(()=>(0, _scheduler.scheduleOnNextTick)(()=>controller.abort()));
                } else {
                    (0, _scheduler.scheduleOnNextTick)(()=>controller.abort());
                }
            }
            return controller.signal;
        case 'prerender-client':
        case 'prerender-ppr':
        case 'prerender-legacy':
        case 'request':
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
            return undefined;
        default:
            workUnitStore;
    }
}
function annotateDynamicAccess(expression, prerenderStore) {
    const dynamicTracking = prerenderStore.dynamicTracking;
    if (dynamicTracking) {
        dynamicTracking.dynamicAccesses.push({
            stack: dynamicTracking.isDebugDynamicAccesses ? new Error().stack : undefined,
            expression
        });
    }
}
function useDynamicRouteParams(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore && workUnitStore) {
        switch(workUnitStore.type){
            case 'prerender-client':
            case 'prerender':
                {
                    const fallbackParams = workUnitStore.fallbackRouteParams;
                    if (fallbackParams && fallbackParams.size > 0) {
                        // We are in a prerender with cacheComponents semantics. We are going to
                        // hang here and never resolve. This will cause the currently
                        // rendering component to effectively be a dynamic hole.
                        _react.default.use((0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, expression));
                    }
                    break;
                }
            case 'prerender-ppr':
                {
                    const fallbackParams = workUnitStore.fallbackRouteParams;
                    if (fallbackParams && fallbackParams.size > 0) {
                        return postponeWithTracking(workStore.route, expression, workUnitStore.dynamicTracking);
                    }
                    break;
                }
            case 'prerender-runtime':
                throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called during a runtime prerender. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                    value: "E771",
                    enumerable: false,
                    configurable: true
                });
            case 'cache':
            case 'private-cache':
                throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                    value: "E745",
                    enumerable: false,
                    configurable: true
                });
            case 'prerender-legacy':
            case 'request':
            case 'unstable-cache':
                break;
            default:
                workUnitStore;
        }
    }
}
function useDynamicSearchParams(expression) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (!workStore) {
        // We assume pages router context and just return
        return;
    }
    if (!workUnitStore) {
        (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(expression);
    }
    switch(workUnitStore.type){
        case 'prerender-client':
            {
                _react.default.use((0, _dynamicrenderingutils.makeHangingPromise)(workUnitStore.renderSignal, workStore.route, expression));
                break;
            }
        case 'prerender-legacy':
        case 'prerender-ppr':
            {
                if (workStore.forceStatic) {
                    return;
                }
                throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(expression), "__NEXT_ERROR_CODE", {
                    value: "E394",
                    enumerable: false,
                    configurable: true
                });
            }
        case 'prerender':
        case 'prerender-runtime':
            throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called from a Server Component. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                value: "E795",
                enumerable: false,
                configurable: true
            });
        case 'cache':
        case 'unstable-cache':
        case 'private-cache':
            throw Object.defineProperty(new _invarianterror.InvariantError(`\`${expression}\` was called inside a cache scope. Next.js should be preventing ${expression} from being included in server components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                value: "E745",
                enumerable: false,
                configurable: true
            });
        case 'request':
            return;
        default:
            workUnitStore;
    }
}
const hasSuspenseRegex = /\n\s+at Suspense \(<anonymous>\)/;
// Common implicit body tags that React will treat as body when placed directly in html
const bodyAndImplicitTags = 'body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6';
// Detects when RootLayoutBoundary (our framework marker component) appears
// after Suspense in the component stack, indicating the root layout is wrapped
// within a Suspense boundary. Ensures no body/html/implicit-body components are in between.
//
// Example matches:
//   at Suspense (<anonymous>)
//   at __next_root_layout_boundary__ (<anonymous>)
//
// Or with other components in between (but not body/html/implicit-body):
//   at Suspense (<anonymous>)
//   at SomeComponent (<anonymous>)
//   at __next_root_layout_boundary__ (<anonymous>)
const hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex = new RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:${bodyAndImplicitTags}) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at ${_boundaryconstants.ROOT_LAYOUT_BOUNDARY_NAME} \\([^\\n]*\\)`);
const hasMetadataRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.METADATA_BOUNDARY_NAME}[\\n\\s]`);
const hasViewportRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.VIEWPORT_BOUNDARY_NAME}[\\n\\s]`);
const hasOutletRegex = new RegExp(`\\n\\s+at ${_boundaryconstants.OUTLET_BOUNDARY_NAME}[\\n\\s]`);
function trackAllowedDynamicAccess(workStore, componentStack, dynamicValidation, clientDynamic) {
    if (hasOutletRegex.test(componentStack)) {
        // We don't need to track that this is dynamic. It is only so when something else is also dynamic.
        return;
    } else if (hasMetadataRegex.test(componentStack)) {
        dynamicValidation.hasDynamicMetadata = true;
        return;
    } else if (hasViewportRegex.test(componentStack)) {
        dynamicValidation.hasDynamicViewport = true;
        return;
    } else if (hasSuspenseBeforeRootLayoutWithoutBodyOrImplicitBodyRegex.test(componentStack)) {
        // For Suspense within body, the prelude wouldn't be empty so it wouldn't violate the empty static shells rule.
        // But if you have Suspense above body, the prelude is empty but we allow that because having Suspense
        // is an explicit signal from the user that they acknowledge the empty shell and want dynamic rendering.
        dynamicValidation.hasAllowedDynamic = true;
        dynamicValidation.hasSuspenseAboveBody = true;
        return;
    } else if (hasSuspenseRegex.test(componentStack)) {
        // this error had a Suspense boundary above it so we don't need to report it as a source
        // of disallowed
        dynamicValidation.hasAllowedDynamic = true;
        return;
    } else if (clientDynamic.syncDynamicErrorWithStack) {
        // This task was the task that called the sync error.
        dynamicValidation.dynamicErrors.push(clientDynamic.syncDynamicErrorWithStack);
        return;
    } else {
        const message = `Route "${workStore.route}": Uncached data was accessed outside of ` + '<Suspense>. This delays the entire page from rendering, resulting in a ' + 'slow user experience. Learn more: ' + 'https://nextjs.org/docs/messages/blocking-route';
        const error = createErrorWithComponentOrOwnerStack(message, componentStack);
        dynamicValidation.dynamicErrors.push(error);
        return;
    }
}
/**
 * In dev mode, we prefer using the owner stack, otherwise the provided
 * component stack is used.
 */ function createErrorWithComponentOrOwnerStack(message, componentStack) {
    const ownerStack = ("TURBOPACK compile-time value", "development") !== 'production' && _react.default.captureOwnerStack ? _react.default.captureOwnerStack() : null;
    const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.stack = error.name + ': ' + message + (ownerStack ?? componentStack);
    return error;
}
var PreludeState = /*#__PURE__*/ function(PreludeState) {
    PreludeState[PreludeState["Full"] = 0] = "Full";
    PreludeState[PreludeState["Empty"] = 1] = "Empty";
    PreludeState[PreludeState["Errored"] = 2] = "Errored";
    return PreludeState;
}({});
function logDisallowedDynamicError(workStore, error) {
    console.error(error);
    if (!workStore.dev) {
        if (workStore.hasReadableErrorStacks) {
            console.error(`To get a more detailed stack trace and pinpoint the issue, start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.`);
        } else {
            console.error(`To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running \`next dev\`, then open "${workStore.route}" in your browser to investigate the error.
  - Rerun the production build with \`next build --debug-prerender\` to generate better stack traces.`);
        }
    }
}
function throwIfDisallowedDynamic(workStore, prelude, dynamicValidation, serverDynamic) {
    if (serverDynamic.syncDynamicErrorWithStack) {
        logDisallowedDynamicError(workStore, serverDynamic.syncDynamicErrorWithStack);
        throw new _staticgenerationbailout.StaticGenBailoutError();
    }
    if (prelude !== 0) {
        if (dynamicValidation.hasSuspenseAboveBody) {
            // This route has opted into allowing fully dynamic rendering
            // by including a Suspense boundary above the body. In this case
            // a lack of a shell is not considered disallowed so we simply return
            return;
        }
        // We didn't have any sync bailouts but there may be user code which
        // blocked the root. We would have captured these during the prerender
        // and can log them here and then terminate the build/validating render
        const dynamicErrors = dynamicValidation.dynamicErrors;
        if (dynamicErrors.length > 0) {
            for(let i = 0; i < dynamicErrors.length; i++){
                logDisallowedDynamicError(workStore, dynamicErrors[i]);
            }
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
        // If we got this far then the only other thing that could be blocking
        // the root is dynamic Viewport. If this is dynamic then
        // you need to opt into that by adding a Suspense boundary above the body
        // to indicate your are ok with fully dynamic rendering.
        if (dynamicValidation.hasDynamicViewport) {
            console.error(`Route "${workStore.route}" has a \`generateViewport\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) without explicitly allowing fully dynamic rendering. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-viewport`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
        if (prelude === 1) {
            // If we ever get this far then we messed up the tracking of invalid dynamic.
            // We still adhere to the constraint that you must produce a shell but invite the
            // user to report this as a bug in Next.js.
            console.error(`Route "${workStore.route}" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
    } else {
        if (dynamicValidation.hasAllowedDynamic === false && dynamicValidation.hasDynamicMetadata) {
            console.error(`Route "${workStore.route}" has a \`generateMetadata\` that depends on Request data (\`cookies()\`, etc...) or uncached external data (\`fetch(...)\`, etc...) when the rest of the route does not. See more info here: https://nextjs.org/docs/messages/next-prerender-dynamic-metadata`);
            throw new _staticgenerationbailout.StaticGenBailoutError();
        }
    }
}
function delayUntilRuntimeStage(prerenderStore, result) {
    if (prerenderStore.runtimeStagePromise) {
        return prerenderStore.runtimeStagePromise.then(()=>result);
    }
    return result;
} //# sourceMappingURL=dynamic-rendering.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createDedupedByCallsiteServerErrorLoggerDev", {
    enumerable: true,
    get: function() {
        return createDedupedByCallsiteServerErrorLoggerDev;
    }
});
const _react = /*#__PURE__*/ _interop_require_wildcard(__turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const errorRef = {
    current: null
};
// React.cache is currently only available in canary/experimental React channels.
const cache = typeof _react.cache === 'function' ? _react.cache : (fn)=>fn;
// When Cache Components is enabled, we record these as errors so that they
// are captured by the dev overlay as it's more critical to fix these
// when enabled.
const logErrorOrWarn = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : console.warn;
// We don't want to dedupe across requests.
// The developer might've just attempted to fix the warning so we should warn again if it still happens.
const flushCurrentErrorIfNew = cache((key)=>{
    try {
        logErrorOrWarn(errorRef.current);
    } finally{
        errorRef.current = null;
    }
});
function createDedupedByCallsiteServerErrorLoggerDev(getMessage) {
    return function logDedupedError(...args) {
        const message = getMessage(...args);
        if ("TURBOPACK compile-time truthy", 1) {
            var _stack;
            const callStackFrames = (_stack = new Error().stack) == null ? void 0 : _stack.split('\n');
            if (callStackFrames === undefined || callStackFrames.length < 4) {
                logErrorOrWarn(message);
            } else {
                // Error:
                //   logDedupedError
                //   asyncApiBeingAccessedSynchronously
                //   <userland callsite>
                // TODO: This breaks if sourcemaps with ignore lists are enabled.
                const key = callStackFrames[4];
                errorRef.current = message;
                flushCurrentErrorIfNew(key);
            }
        } else //TURBOPACK unreachable
        ;
    };
} //# sourceMappingURL=create-deduped-by-callsite-server-error-logger.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/utils.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isRequestAPICallableInsideAfter: null,
    throwForSearchParamsAccessInUseCache: null,
    throwWithStaticGenerationBailoutErrorWithDynamicError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isRequestAPICallableInsideAfter: function() {
        return isRequestAPICallableInsideAfter;
    },
    throwForSearchParamsAccessInUseCache: function() {
        return throwForSearchParamsAccessInUseCache;
    },
    throwWithStaticGenerationBailoutErrorWithDynamicError: function() {
        return throwWithStaticGenerationBailoutErrorWithDynamicError;
    }
});
const _staticgenerationbailout = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)");
const _aftertaskasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)");
function throwWithStaticGenerationBailoutErrorWithDynamicError(route, expression) {
    throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${route} with \`dynamic = "error"\` couldn't be rendered statically because it used ${expression}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
        value: "E543",
        enumerable: false,
        configurable: true
    });
}
function throwForSearchParamsAccessInUseCache(workStore, constructorOpt) {
    const error = Object.defineProperty(new Error(`Route ${workStore.route} used \`searchParams\` inside "use cache". Accessing dynamic request data inside a cache scope is not supported. If you need some search params inside a cached function await \`searchParams\` outside of the cached function and pass only the required search params as arguments to the cached function. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
        value: "E842",
        enumerable: false,
        configurable: true
    });
    Error.captureStackTrace(error, constructorOpt);
    workStore.invalidDynamicUsageError ??= error;
    throw error;
}
function isRequestAPICallableInsideAfter() {
    const afterTaskStore = _aftertaskasyncstorageexternal.afterTaskAsyncStorage.getStore();
    return (afterTaskStore == null ? void 0 : afterTaskStore.rootTaskSpawnPhase) === 'action';
} //# sourceMappingURL=utils.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/cookies.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "cookies", {
    enumerable: true,
    get: function() {
        return cookies;
    }
});
const _requestcookies = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/adapters/request-cookies.js [app-rsc] (ecmascript)");
const _cookies = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/cookies.js [app-rsc] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _dynamicrendering = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-rsc] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/dynamic-rendering-utils.js [app-rsc] (ecmascript)");
const _creatededupedbycallsiteservererrorlogger = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-rsc] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/utils.js [app-rsc] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/invariant-error.js [app-rsc] (ecmascript)");
const _stagedrendering = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/staged-rendering.js [app-rsc] (ecmascript)");
function cookies() {
    const callingExpression = 'cookies';
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore) {
        if (workUnitStore && workUnitStore.phase === 'after' && !(0, _utils.isRequestAPICallableInsideAfter)()) {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used \`cookies()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`cookies()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", {
                value: "E843",
                enumerable: false,
                configurable: true
            });
        }
        if (workStore.forceStatic) {
            // When using forceStatic we override all other logic and always just return an empty
            // cookies object without tracking
            const underlyingCookies = createEmptyCookies();
            return makeUntrackedCookies(underlyingCookies);
        }
        if (workStore.dynamicShouldError) {
            throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
                value: "E849",
                enumerable: false,
                configurable: true
            });
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'cache':
                    const error = Object.defineProperty(new Error(`Route ${workStore.route} used \`cookies()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                        value: "E831",
                        enumerable: false,
                        configurable: true
                    });
                    Error.captureStackTrace(error, cookies);
                    workStore.invalidDynamicUsageError ??= error;
                    throw error;
                case 'unstable-cache':
                    throw Object.defineProperty(new Error(`Route ${workStore.route} used \`cookies()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                        value: "E846",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender':
                    return makeHangingCookies(workStore, workUnitStore);
                case 'prerender-client':
                    const exportName = '`cookies`';
                    throw Object.defineProperty(new _invarianterror.InvariantError(`${exportName} must not be used within a Client Component. Next.js should be preventing ${exportName} from being included in Client Components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                        value: "E832",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender-ppr':
                    // We need track dynamic access here eagerly to keep continuity with
                    // how cookies has worked in PPR without cacheComponents.
                    return (0, _dynamicrendering.postponeWithTracking)(workStore.route, callingExpression, workUnitStore.dynamicTracking);
                case 'prerender-legacy':
                    // We track dynamic access here so we don't need to wrap the cookies
                    // in individual property access tracking.
                    return (0, _dynamicrendering.throwToInterruptStaticGeneration)(callingExpression, workStore, workUnitStore);
                case 'prerender-runtime':
                    return (0, _dynamicrendering.delayUntilRuntimeStage)(workUnitStore, makeUntrackedCookies(workUnitStore.cookies));
                case 'private-cache':
                    // Private caches are delayed until the runtime stage in use-cache-wrapper,
                    // so we don't need an additional delay here.
                    return makeUntrackedCookies(workUnitStore.cookies);
                case 'request':
                    (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                    let underlyingCookies;
                    if ((0, _requestcookies.areCookiesMutableInCurrentPhase)(workUnitStore)) {
                        // We can't conditionally return different types here based on the context.
                        // To avoid confusion, we always return the readonly type here.
                        underlyingCookies = workUnitStore.userspaceMutableCookies;
                    } else {
                        underlyingCookies = workUnitStore.cookies;
                    }
                    if ("TURBOPACK compile-time truthy", 1) {
                        // Semantically we only need the dev tracking when running in `next dev`
                        // but since you would never use next dev with production NODE_ENV we use this
                        // as a proxy so we can statically exclude this code from production builds.
                        return makeUntrackedCookiesWithDevWarnings(workUnitStore, underlyingCookies, workStore == null ? void 0 : workStore.route);
                    } else //TURBOPACK unreachable
                    ;
                default:
                    workUnitStore;
            }
        }
    }
    // If we end up here, there was no work store or work unit store present.
    (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(callingExpression);
}
function createEmptyCookies() {
    return _requestcookies.RequestCookiesAdapter.seal(new _cookies.RequestCookies(new Headers({})));
}
const CachedCookies = new WeakMap();
function makeHangingCookies(workStore, prerenderStore) {
    const cachedPromise = CachedCookies.get(prerenderStore);
    if (cachedPromise) {
        return cachedPromise;
    }
    const promise = (0, _dynamicrenderingutils.makeHangingPromise)(prerenderStore.renderSignal, workStore.route, '`cookies()`');
    CachedCookies.set(prerenderStore, promise);
    return promise;
}
function makeUntrackedCookies(underlyingCookies) {
    const cachedCookies = CachedCookies.get(underlyingCookies);
    if (cachedCookies) {
        return cachedCookies;
    }
    const promise = Promise.resolve(underlyingCookies);
    CachedCookies.set(underlyingCookies, promise);
    return promise;
}
function makeUntrackedCookiesWithDevWarnings(requestStore, underlyingCookies, route) {
    if (requestStore.asyncApiPromises) {
        let promise;
        if (underlyingCookies === requestStore.mutableCookies) {
            promise = requestStore.asyncApiPromises.mutableCookies;
        } else if (underlyingCookies === requestStore.cookies) {
            promise = requestStore.asyncApiPromises.cookies;
        } else {
            throw Object.defineProperty(new _invarianterror.InvariantError('Received an underlying cookies object that does not match either `cookies` or `mutableCookies`'), "__NEXT_ERROR_CODE", {
                value: "E890",
                enumerable: false,
                configurable: true
            });
        }
        return instrumentCookiesPromiseWithDevWarnings(promise, route);
    }
    const cachedCookies = CachedCookies.get(underlyingCookies);
    if (cachedCookies) {
        return cachedCookies;
    }
    const promise = (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(underlyingCookies, requestStore, _stagedrendering.RenderStage.Runtime);
    const proxiedPromise = instrumentCookiesPromiseWithDevWarnings(promise, route);
    CachedCookies.set(underlyingCookies, proxiedPromise);
    return proxiedPromise;
}
const warnForSyncAccess = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createCookiesAccessError);
function instrumentCookiesPromiseWithDevWarnings(promise, route) {
    Object.defineProperties(promise, {
        [Symbol.iterator]: replaceableWarningDescriptorForSymbolIterator(promise, route),
        size: replaceableWarningDescriptor(promise, 'size', route),
        get: replaceableWarningDescriptor(promise, 'get', route),
        getAll: replaceableWarningDescriptor(promise, 'getAll', route),
        has: replaceableWarningDescriptor(promise, 'has', route),
        set: replaceableWarningDescriptor(promise, 'set', route),
        delete: replaceableWarningDescriptor(promise, 'delete', route),
        clear: replaceableWarningDescriptor(promise, 'clear', route),
        toString: replaceableWarningDescriptor(promise, 'toString', route)
    });
    return promise;
}
function replaceableWarningDescriptor(target, prop, route) {
    return {
        enumerable: false,
        get () {
            warnForSyncAccess(route, `\`cookies().${prop}\``);
            return undefined;
        },
        set (value) {
            Object.defineProperty(target, prop, {
                value,
                writable: true,
                configurable: true
            });
        },
        configurable: true
    };
}
function replaceableWarningDescriptorForSymbolIterator(target, route) {
    return {
        enumerable: false,
        get () {
            warnForSyncAccess(route, '`...cookies()` or similar iteration');
            return undefined;
        },
        set (value) {
            Object.defineProperty(target, Symbol.iterator, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        },
        configurable: true
    };
}
function createCookiesAccessError(route, expression) {
    const prefix = route ? `Route "${route}" ` : 'This route ';
    return Object.defineProperty(new Error(`${prefix}used ${expression}. ` + `\`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", {
        value: "E830",
        enumerable: false,
        configurable: true
    });
} //# sourceMappingURL=cookies.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/adapters/headers.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HeadersAdapter: null,
    ReadonlyHeadersError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HeadersAdapter: function() {
        return HeadersAdapter;
    },
    ReadonlyHeadersError: function() {
        return ReadonlyHeadersError;
    }
});
const _reflect = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-rsc] (ecmascript)");
class ReadonlyHeadersError extends Error {
    constructor(){
        super('Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers');
    }
    static callable() {
        throw new ReadonlyHeadersError();
    }
}
class HeadersAdapter extends Headers {
    constructor(headers){
        // We've already overridden the methods that would be called, so we're just
        // calling the super constructor to ensure that the instanceof check works.
        super();
        this.headers = new Proxy(headers, {
            get (target, prop, receiver) {
                // Because this is just an object, we expect that all "get" operations
                // are for properties. If it's a "get" for a symbol, we'll just return
                // the symbol.
                if (typeof prop === 'symbol') {
                    return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return undefined.
                if (typeof original === 'undefined') return;
                // If the original casing exists, return the value.
                return _reflect.ReflectAdapter.get(target, original, receiver);
            },
            set (target, prop, value, receiver) {
                if (typeof prop === 'symbol') {
                    return _reflect.ReflectAdapter.set(target, prop, value, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, use the prop as the key.
                return _reflect.ReflectAdapter.set(target, original ?? prop, value, receiver);
            },
            has (target, prop) {
                if (typeof prop === 'symbol') return _reflect.ReflectAdapter.has(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return false.
                if (typeof original === 'undefined') return false;
                // If the original casing exists, return true.
                return _reflect.ReflectAdapter.has(target, original);
            },
            deleteProperty (target, prop) {
                if (typeof prop === 'symbol') return _reflect.ReflectAdapter.deleteProperty(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return true.
                if (typeof original === 'undefined') return true;
                // If the original casing exists, delete the property.
                return _reflect.ReflectAdapter.deleteProperty(target, original);
            }
        });
    }
    /**
   * Seals a Headers instance to prevent modification by throwing an error when
   * any mutating method is called.
   */ static seal(headers) {
        return new Proxy(headers, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'append':
                    case 'delete':
                    case 'set':
                        return ReadonlyHeadersError.callable;
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
    /**
   * Merges a header value into a string. This stores multiple values as an
   * array, so we need to merge them into a string.
   *
   * @param value a header value
   * @returns a merged header value (a string)
   */ merge(value) {
        if (Array.isArray(value)) return value.join(', ');
        return value;
    }
    /**
   * Creates a Headers instance from a plain object or a Headers instance.
   *
   * @param headers a plain object or a Headers instance
   * @returns a headers instance
   */ static from(headers) {
        if (headers instanceof Headers) return headers;
        return new HeadersAdapter(headers);
    }
    append(name, value) {
        const existing = this.headers[name];
        if (typeof existing === 'string') {
            this.headers[name] = [
                existing,
                value
            ];
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            this.headers[name] = value;
        }
    }
    delete(name) {
        delete this.headers[name];
    }
    get(name) {
        const value = this.headers[name];
        if (typeof value !== 'undefined') return this.merge(value);
        return null;
    }
    has(name) {
        return typeof this.headers[name] !== 'undefined';
    }
    set(name, value) {
        this.headers[name] = value;
    }
    forEach(callbackfn, thisArg) {
        for (const [name, value] of this.entries()){
            callbackfn.call(thisArg, value, name, this);
        }
    }
    *entries() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(name);
            yield [
                name,
                value
            ];
        }
    }
    *keys() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            yield name;
        }
    }
    *values() {
        for (const key of Object.keys(this.headers)){
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(key);
            yield value;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
} //# sourceMappingURL=headers.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/headers.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "headers", {
    enumerable: true,
    get: function() {
        return headers;
    }
});
const _headers = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/adapters/headers.js [app-rsc] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _dynamicrendering = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-rsc] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)");
const _dynamicrenderingutils = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/dynamic-rendering-utils.js [app-rsc] (ecmascript)");
const _creatededupedbycallsiteservererrorlogger = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-rsc] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/utils.js [app-rsc] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/invariant-error.js [app-rsc] (ecmascript)");
const _stagedrendering = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/staged-rendering.js [app-rsc] (ecmascript)");
function headers() {
    const callingExpression = 'headers';
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore) {
        if (workUnitStore && workUnitStore.phase === 'after' && !(0, _utils.isRequestAPICallableInsideAfter)()) {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used \`headers()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`headers()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", {
                value: "E839",
                enumerable: false,
                configurable: true
            });
        }
        if (workStore.forceStatic) {
            // When using forceStatic we override all other logic and always just return an empty
            // headers object without tracking
            const underlyingHeaders = _headers.HeadersAdapter.seal(new Headers({}));
            return makeUntrackedHeaders(underlyingHeaders);
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'cache':
                    {
                        const error = Object.defineProperty(new Error(`Route ${workStore.route} used \`headers()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                            value: "E833",
                            enumerable: false,
                            configurable: true
                        });
                        Error.captureStackTrace(error, headers);
                        workStore.invalidDynamicUsageError ??= error;
                        throw error;
                    }
                case 'unstable-cache':
                    throw Object.defineProperty(new Error(`Route ${workStore.route} used \`headers()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                        value: "E838",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender':
                case 'prerender-client':
                case 'private-cache':
                case 'prerender-runtime':
                case 'prerender-ppr':
                case 'prerender-legacy':
                case 'request':
                    break;
                default:
                    workUnitStore;
            }
        }
        if (workStore.dynamicShouldError) {
            throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
                value: "E828",
                enumerable: false,
                configurable: true
            });
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'prerender':
                    return makeHangingHeaders(workStore, workUnitStore);
                case 'prerender-client':
                    const exportName = '`headers`';
                    throw Object.defineProperty(new _invarianterror.InvariantError(`${exportName} must not be used within a client component. Next.js should be preventing ${exportName} from being included in client components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                        value: "E693",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender-ppr':
                    // PPR Prerender (no cacheComponents)
                    // We are prerendering with PPR. We need track dynamic access here eagerly
                    // to keep continuity with how headers has worked in PPR without cacheComponents.
                    // TODO consider switching the semantic to throw on property access instead
                    return (0, _dynamicrendering.postponeWithTracking)(workStore.route, callingExpression, workUnitStore.dynamicTracking);
                case 'prerender-legacy':
                    // Legacy Prerender
                    // We are in a legacy static generation mode while prerendering
                    // We track dynamic access here so we don't need to wrap the headers in
                    // individual property access tracking.
                    return (0, _dynamicrendering.throwToInterruptStaticGeneration)(callingExpression, workStore, workUnitStore);
                case 'prerender-runtime':
                    return (0, _dynamicrendering.delayUntilRuntimeStage)(workUnitStore, makeUntrackedHeaders(workUnitStore.headers));
                case 'private-cache':
                    // Private caches are delayed until the runtime stage in use-cache-wrapper,
                    // so we don't need an additional delay here.
                    return makeUntrackedHeaders(workUnitStore.headers);
                case 'request':
                    (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                    if ("TURBOPACK compile-time truthy", 1) {
                        // Semantically we only need the dev tracking when running in `next dev`
                        // but since you would never use next dev with production NODE_ENV we use this
                        // as a proxy so we can statically exclude this code from production builds.
                        return makeUntrackedHeadersWithDevWarnings(workUnitStore.headers, workStore == null ? void 0 : workStore.route, workUnitStore);
                    } else //TURBOPACK unreachable
                    ;
                    //TURBOPACK unreachable
                    ;
                default:
                    workUnitStore;
            }
        }
    }
    // If we end up here, there was no work store or work unit store present.
    (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(callingExpression);
}
const CachedHeaders = new WeakMap();
function makeHangingHeaders(workStore, prerenderStore) {
    const cachedHeaders = CachedHeaders.get(prerenderStore);
    if (cachedHeaders) {
        return cachedHeaders;
    }
    const promise = (0, _dynamicrenderingutils.makeHangingPromise)(prerenderStore.renderSignal, workStore.route, '`headers()`');
    CachedHeaders.set(prerenderStore, promise);
    return promise;
}
function makeUntrackedHeaders(underlyingHeaders) {
    const cachedHeaders = CachedHeaders.get(underlyingHeaders);
    if (cachedHeaders) {
        return cachedHeaders;
    }
    const promise = Promise.resolve(underlyingHeaders);
    CachedHeaders.set(underlyingHeaders, promise);
    return promise;
}
function makeUntrackedHeadersWithDevWarnings(underlyingHeaders, route, requestStore) {
    if (requestStore.asyncApiPromises) {
        const promise = requestStore.asyncApiPromises.headers;
        return instrumentHeadersPromiseWithDevWarnings(promise, route);
    }
    const cachedHeaders = CachedHeaders.get(underlyingHeaders);
    if (cachedHeaders) {
        return cachedHeaders;
    }
    const promise = (0, _dynamicrenderingutils.makeDevtoolsIOAwarePromise)(underlyingHeaders, requestStore, _stagedrendering.RenderStage.Runtime);
    const proxiedPromise = instrumentHeadersPromiseWithDevWarnings(promise, route);
    CachedHeaders.set(underlyingHeaders, proxiedPromise);
    return proxiedPromise;
}
const warnForSyncAccess = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createHeadersAccessError);
function instrumentHeadersPromiseWithDevWarnings(promise, route) {
    Object.defineProperties(promise, {
        [Symbol.iterator]: replaceableWarningDescriptorForSymbolIterator(promise, route),
        append: replaceableWarningDescriptor(promise, 'append', route),
        delete: replaceableWarningDescriptor(promise, 'delete', route),
        get: replaceableWarningDescriptor(promise, 'get', route),
        has: replaceableWarningDescriptor(promise, 'has', route),
        set: replaceableWarningDescriptor(promise, 'set', route),
        getSetCookie: replaceableWarningDescriptor(promise, 'getSetCookie', route),
        forEach: replaceableWarningDescriptor(promise, 'forEach', route),
        keys: replaceableWarningDescriptor(promise, 'keys', route),
        values: replaceableWarningDescriptor(promise, 'values', route),
        entries: replaceableWarningDescriptor(promise, 'entries', route)
    });
    return promise;
}
function replaceableWarningDescriptor(target, prop, route) {
    return {
        enumerable: false,
        get () {
            warnForSyncAccess(route, `\`headers().${prop}\``);
            return undefined;
        },
        set (value) {
            Object.defineProperty(target, prop, {
                value,
                writable: true,
                configurable: true
            });
        },
        configurable: true
    };
}
function replaceableWarningDescriptorForSymbolIterator(target, route) {
    return {
        enumerable: false,
        get () {
            warnForSyncAccess(route, '`...headers()` or similar iteration');
            return undefined;
        },
        set (value) {
            Object.defineProperty(target, Symbol.iterator, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        },
        configurable: true
    };
}
function createHeadersAccessError(route, expression) {
    const prefix = route ? `Route "${route}" ` : 'This route ';
    return Object.defineProperty(new Error(`${prefix}used ${expression}. ` + `\`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", {
        value: "E836",
        enumerable: false,
        configurable: true
    });
} //# sourceMappingURL=headers.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/draft-mode.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "draftMode", {
    enumerable: true,
    get: function() {
        return draftMode;
    }
});
const _workunitasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)");
const _workasyncstorageexternal = __turbopack_context__.r("[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)");
const _dynamicrendering = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-rsc] (ecmascript)");
const _creatededupedbycallsiteservererrorlogger = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/create-deduped-by-callsite-server-error-logger.js [app-rsc] (ecmascript)");
const _staticgenerationbailout = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/static-generation-bailout.js [app-rsc] (ecmascript)");
const _hooksservercontext = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/hooks-server-context.js [app-rsc] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/invariant-error.js [app-rsc] (ecmascript)");
const _reflect = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-rsc] (ecmascript)");
function draftMode() {
    const callingExpression = 'draftMode';
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (!workStore || !workUnitStore) {
        (0, _workunitasyncstorageexternal.throwForMissingRequestStore)(callingExpression);
    }
    switch(workUnitStore.type){
        case 'prerender-runtime':
            // TODO(runtime-ppr): does it make sense to delay this? normally it's always microtasky
            return (0, _dynamicrendering.delayUntilRuntimeStage)(workUnitStore, createOrGetCachedDraftMode(workUnitStore.draftMode, workStore));
        case 'request':
            return createOrGetCachedDraftMode(workUnitStore.draftMode, workStore);
        case 'cache':
        case 'private-cache':
        case 'unstable-cache':
            // Inside of `"use cache"` or `unstable_cache`, draft mode is available if
            // the outmost work unit store is a request store (or a runtime prerender),
            // and if draft mode is enabled.
            const draftModeProvider = (0, _workunitasyncstorageexternal.getDraftModeProviderForCacheScope)(workStore, workUnitStore);
            if (draftModeProvider) {
                return createOrGetCachedDraftMode(draftModeProvider, workStore);
            }
        // Otherwise, we fall through to providing an empty draft mode.
        // eslint-disable-next-line no-fallthrough
        case 'prerender':
        case 'prerender-client':
        case 'prerender-ppr':
        case 'prerender-legacy':
            // Return empty draft mode
            return createOrGetCachedDraftMode(null, workStore);
        default:
            return workUnitStore;
    }
}
function createOrGetCachedDraftMode(draftModeProvider, workStore) {
    const cacheKey = draftModeProvider ?? NullDraftMode;
    const cachedDraftMode = CachedDraftModes.get(cacheKey);
    if (cachedDraftMode) {
        return cachedDraftMode;
    }
    if (("TURBOPACK compile-time value", "development") === 'development' && !(workStore == null ? void 0 : workStore.isPrefetchRequest)) {
        const route = workStore == null ? void 0 : workStore.route;
        return createDraftModeWithDevWarnings(draftModeProvider, route);
    } else {
        return Promise.resolve(new DraftMode(draftModeProvider));
    }
}
const NullDraftMode = {};
const CachedDraftModes = new WeakMap();
function createDraftModeWithDevWarnings(underlyingProvider, route) {
    const instance = new DraftMode(underlyingProvider);
    const promise = Promise.resolve(instance);
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            switch(prop){
                case 'isEnabled':
                    warnForSyncAccess(route, `\`draftMode().${prop}\``);
                    break;
                case 'enable':
                case 'disable':
                    {
                        warnForSyncAccess(route, `\`draftMode().${prop}()\``);
                        break;
                    }
                default:
                    {
                    // We only warn for well-defined properties of the draftMode object.
                    }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        }
    });
    return proxiedPromise;
}
class DraftMode {
    constructor(provider){
        this._provider = provider;
    }
    get isEnabled() {
        if (this._provider !== null) {
            return this._provider.isEnabled;
        }
        return false;
    }
    enable() {
        // We have a store we want to track dynamic data access to ensure we
        // don't statically generate routes that manipulate draft mode.
        trackDynamicDraftMode('draftMode().enable()', this.enable);
        if (this._provider !== null) {
            this._provider.enable();
        }
    }
    disable() {
        trackDynamicDraftMode('draftMode().disable()', this.disable);
        if (this._provider !== null) {
            this._provider.disable();
        }
    }
}
const warnForSyncAccess = (0, _creatededupedbycallsiteservererrorlogger.createDedupedByCallsiteServerErrorLoggerDev)(createDraftModeAccessError);
function createDraftModeAccessError(route, expression) {
    const prefix = route ? `Route "${route}" ` : 'This route ';
    return Object.defineProperty(new Error(`${prefix}used ${expression}. ` + `\`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", {
        value: "E835",
        enumerable: false,
        configurable: true
    });
}
function trackDynamicDraftMode(expression, constructorOpt) {
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    const workUnitStore = _workunitasyncstorageexternal.workUnitAsyncStorage.getStore();
    if (workStore) {
        // We have a store we want to track dynamic data access to ensure we
        // don't statically generate routes that manipulate draft mode.
        if ((workUnitStore == null ? void 0 : workUnitStore.phase) === 'after') {
            throw Object.defineProperty(new Error(`Route ${workStore.route} used "${expression}" inside \`after()\`. The enabled status of \`draftMode()\` can be read inside \`after()\` but you cannot enable or disable \`draftMode()\`. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", {
                value: "E845",
                enumerable: false,
                configurable: true
            });
        }
        if (workStore.dynamicShouldError) {
            throw Object.defineProperty(new _staticgenerationbailout.StaticGenBailoutError(`Route ${workStore.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", {
                value: "E553",
                enumerable: false,
                configurable: true
            });
        }
        if (workUnitStore) {
            switch(workUnitStore.type){
                case 'cache':
                case 'private-cache':
                    {
                        const error = Object.defineProperty(new Error(`Route ${workStore.route} used "${expression}" inside "use cache". The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", {
                            value: "E829",
                            enumerable: false,
                            configurable: true
                        });
                        Error.captureStackTrace(error, constructorOpt);
                        workStore.invalidDynamicUsageError ??= error;
                        throw error;
                    }
                case 'unstable-cache':
                    throw Object.defineProperty(new Error(`Route ${workStore.route} used "${expression}" inside a function cached with \`unstable_cache()\`. The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", {
                        value: "E844",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender':
                case 'prerender-runtime':
                    {
                        const error = Object.defineProperty(new Error(`Route ${workStore.route} used ${expression} without first calling \`await connection()\`. See more info here: https://nextjs.org/docs/messages/next-prerender-sync-headers`), "__NEXT_ERROR_CODE", {
                            value: "E126",
                            enumerable: false,
                            configurable: true
                        });
                        return (0, _dynamicrendering.abortAndThrowOnSynchronousRequestDataAccess)(workStore.route, expression, error, workUnitStore);
                    }
                case 'prerender-client':
                    const exportName = '`draftMode`';
                    throw Object.defineProperty(new _invarianterror.InvariantError(`${exportName} must not be used within a Client Component. Next.js should be preventing ${exportName} from being included in Client Components statically, but did not in this case.`), "__NEXT_ERROR_CODE", {
                        value: "E832",
                        enumerable: false,
                        configurable: true
                    });
                case 'prerender-ppr':
                    return (0, _dynamicrendering.postponeWithTracking)(workStore.route, expression, workUnitStore.dynamicTracking);
                case 'prerender-legacy':
                    workUnitStore.revalidate = 0;
                    const err = Object.defineProperty(new _hooksservercontext.DynamicServerError(`Route ${workStore.route} couldn't be rendered statically because it used \`${expression}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", {
                        value: "E558",
                        enumerable: false,
                        configurable: true
                    });
                    workStore.dynamicUsageDescription = expression;
                    workStore.dynamicUsageStack = err.stack;
                    throw err;
                case 'request':
                    (0, _dynamicrendering.trackDynamicDataInDynamicRender)(workUnitStore);
                    break;
                default:
                    workUnitStore;
            }
        }
    }
} //# sourceMappingURL=draft-mode.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/headers.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports.cookies = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/cookies.js [app-rsc] (ecmascript)").cookies;
module.exports.headers = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/headers.js [app-rsc] (ecmascript)").headers;
module.exports.draftMode = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/request/draft-mode.js [app-rsc] (ecmascript)").draftMode;
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-sc/dist/index.server.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/bytes.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/crypto.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateSecureRandomString",
    ()=>generateSecureRandomString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$bytes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/bytes.js [app-rsc] (ecmascript)");
;
function generateSecureRandomString(minBitsOfEntropy = 224) {
    const base32CharactersCount = Math.ceil(minBitsOfEntropy / 5);
    const bytesCount = Math.ceil(base32CharactersCount * 5 / 8);
    const randomBytes = globalThis.crypto.getRandomValues(new Uint8Array(bytesCount));
    const str = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$bytes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeBase32"])(randomBytes);
    return str.slice(str.length - base32CharactersCount).toLowerCase();
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/clientInterface.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/oauth4webapi/build/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/stores.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/known-errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$sc$2f$dist$2f$index$2e$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-sc/dist/index.server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$crypto$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/crypto.js [app-rsc] (ecmascript)");
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
        const rawResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshTokenGrantRequest"](as, client, refreshToken);
        const response = await this._processResponse(rawResponse);
        if (response.status === "error") {
            const error = response.error;
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].RefreshTokenError) {
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
        if (challenges = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseWwwAuthenticateChallenges"](response.data)) {
            // TODO Handle WWW-Authenticate Challenges as needed
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("OAuth WWW-Authenticate challenge not implemented", {
                challenges
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processRefreshTokenResponse"](as, client, response.data);
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isOAuth2Error"](result)) {
            // TODO Handle OAuth 2.0 response body error
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("OAuth error", {
                result
            });
        }
        tokenStore.update((old)=>({
                accessToken: result.access_token ?? null,
                refreshToken: result.refresh_token ?? old?.refreshToken ?? null
            }));
    }
    async sendClientRequest(path, requestOptions, tokenStoreOrNull, requestType = "client") {
        const tokenStore = tokenStoreOrNull ?? new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncStore"]({
            accessToken: null,
            refreshToken: null
        });
        return await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].orThrowAsync(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].retry(()=>this.sendClientRequestInner(path, requestOptions, tokenStore, requestType), 5, {
            exponentialDelayBase: 1000
        }));
    }
    async sendClientRequestAndCatchKnownError(path, requestOptions, tokenStoreOrNull, errorsToCatch) {
        try {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(await this.sendClientRequest(path, requestOptions, tokenStoreOrNull));
        } catch (e) {
            for (const errorType of errorsToCatch){
                if (e instanceof errorType) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(e);
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
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"]?.();
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
                "X-Stack-Random-Nonce": (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$crypto$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateSecureRandomString"])(),
                ...options.headers
            },
            cache: "no-store"
        };
        const rawRes = await fetch(url, params);
        const processedRes = await this._processResponse(rawRes);
        if (processedRes.status === "error") {
            // If the access token is expired, reset it and retry
            if (processedRes.error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].InvalidAccessToken) {
                tokenStore.set({
                    accessToken: null,
                    refreshToken: tokenObj.refreshToken
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(new Error("Access token expired"));
            }
            // Known errors are client side errors, and should hence not be retried (except for access token expired above).
            // Hence, throw instead of returning an error
            throw processedRes.error;
        }
        const res = Object.assign(processedRes.data, {
            usedTokens: tokenObj
        });
        if (res.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(res);
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
            const error = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownError"].fromJson(errorJson);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(error);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(res);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].UserNotFound
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].EmailAlreadyVerified
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].RedirectUrlNotWhitelisted
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordResetError
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordMismatch,
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordRequirementsNotMet
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
        if (res && !(res instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordResetCodeError)) {
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].EmailVerificationError
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].EmailPasswordMismatch
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].UserEmailAlreadyExists,
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].PasswordRequirementsNotMet
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
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownErrors"].MagicLinkError
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
        const params = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthResponse"](as, client, oauthParams, state);
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isOAuth2Error"](params)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("Error validating OAuth response", {
                params
            }); // Handle OAuth 2.0 redirect error
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authorizationCodeGrantRequest"](as, client, params, redirectUri, codeVerifier);
        let challenges;
        if (challenges = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseWwwAuthenticateChallenges"](response)) {
            // TODO Handle WWW-Authenticate Challenges as needed
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("OAuth WWW-Authenticate challenge not implemented", {
                challenges
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["processAuthorizationCodeOAuth2Response"](as, client, response);
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$oauth4webapi$2f$build$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isOAuth2Error"](result)) {
            // TODO Handle OAuth 2.0 response body error
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("OAuth error", {
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
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(new Error("Failed to get user"));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(user);
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
        if (!project) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(new Error("Failed to get project"));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(project);
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/serverInterface.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackServerInterface",
    ()=>StackServerInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/clientInterface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-rsc] (ecmascript)");
;
;
class StackServerInterface extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackClientInterface"] {
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
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(new Error("Failed to get user"));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(user);
    }
    async getServerUserById(userId) {
        const response = await this.sendServerRequest(`/users/${userId}?server=true`, {}, null);
        const user = await response.json();
        if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(new Error("Failed to get user"));
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(user);
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/adminInterface.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackAdminInterface",
    ()=>StackAdminInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/serverInterface.js [app-rsc] (ecmascript)");
;
class StackAdminInterface extends __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackServerInterface"] {
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/index.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/clientInterface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/serverInterface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$adminInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/adminInterface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/known-errors.js [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/js-cookie/dist/js.cookie.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*! js-cookie v3.0.5 | MIT */ /* eslint-disable no-var */ __turbopack_context__.s([
    "default",
    ()=>api
]);
function assign(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i];
        for(var key in source){
            target[key] = source[key];
        }
    }
    return target;
}
/* eslint-enable no-var */ /* eslint-disable no-var */ var defaultConverter = {
    read: function(value) {
        if (value[0] === '"') {
            value = value.slice(1, -1);
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function(value) {
        return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
    }
};
/* eslint-enable no-var */ /* eslint-disable no-var */ function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
        if (typeof document === 'undefined') {
            return;
        }
        attributes = assign({}, defaultAttributes, attributes);
        if (typeof attributes.expires === 'number') {
            attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
        }
        if (attributes.expires) {
            attributes.expires = attributes.expires.toUTCString();
        }
        name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
        var stringifiedAttributes = '';
        for(var attributeName in attributes){
            if (!attributes[attributeName]) {
                continue;
            }
            stringifiedAttributes += '; ' + attributeName;
            if (attributes[attributeName] === true) {
                continue;
            }
            // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (";")
            //     character:
            // Consume the characters of the unparsed-attributes up to,
            // not including, the first %x3B (";") character.
            // ...
            stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
        }
        return document.cookie = name + '=' + converter.write(value, name) + stringifiedAttributes;
    }
    function get(name) {
        if (typeof document === 'undefined' || arguments.length && !name) {
            return;
        }
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var jar = {};
        for(var i = 0; i < cookies.length; i++){
            var parts = cookies[i].split('=');
            var value = parts.slice(1).join('=');
            try {
                var found = decodeURIComponent(parts[0]);
                jar[found] = converter.read(value, found);
                if (name === found) {
                    break;
                }
            } catch (e) {}
        }
        return name ? jar[name] : jar;
    }
    return Object.create({
        set,
        get,
        remove: function(name, attributes) {
            set(name, '', assign({}, attributes, {
                expires: -1
            }));
        },
        withAttributes: function(attributes) {
            return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function(converter) {
            return init(assign({}, this.converter, converter), this.attributes);
        }
    }, {
        attributes: {
            value: Object.freeze(defaultAttributes)
        },
        converter: {
            value: Object.freeze(converter)
        }
    });
}
var api = init(defaultConverter, {
    path: '/'
});
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/cookie.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/js-cookie/dist/js.cookie.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$sc$2f$dist$2f$index$2e$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-sc/dist/index.server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/headers.js [app-rsc] (ecmascript)");
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])().get(name)?.value ?? null;
    } catch (e) {
        if (isRscCookieUnavailableError(e)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].get(name) ?? null;
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])().delete(name);
    } catch (e) {
        if (isRscCookieUnavailableError(e)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].remove(name);
        } else {
            throw e;
        }
    }
}
function setCookie(name, value, options = {}) {
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])().set(name, value, {
            maxAge: options.maxAge
        });
    } catch (e) {
        if (isRscCookieUnavailableError(e)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].set(name, value, {
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/react.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNodeText",
    ()=>getNodeText,
    "suspend",
    ()=>suspend,
    "suspendIfSsr",
    ()=>suspendIfSsr
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/strings.js [app-rsc] (ecmascript)");
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["use"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neverResolve"])());
    throw new Error("Somehow a Promise that never resolves was resolved?");
}
function suspendIfSsr(caller) {
    if ("TURBOPACK compile-time truthy", 1) {
        const error = Object.assign(new Error(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$strings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deindent"]`
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/next.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/url.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/auth.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/auth.ts
__turbopack_context__.s([
    "callOAuthCallback",
    ()=>callOAuthCallback,
    "signInWithOAuth",
    ()=>signInWithOAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/cookie.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/url.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-rsc] (ecmascript)");
;
;
;
;
async function signInWithOAuth(iface, { provider, redirectUrl }) {
    redirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(redirectUrl);
    const { codeChallenge, state } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveVerifierAndState"])();
    const location = await iface.getOAuthUrl(provider, redirectUrl, codeChallenge, state);
    window.location.assign(location);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["neverResolve"])();
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
    const { codeVerifier, state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVerifierAndState"])();
    if (!codeVerifier || !state) {
        throw new Error("Invalid OAuth callback URL parameters. It seems like the OAuth flow was interrupted, so please try again.");
    }
    const originalUrl = consumeOAuthCallbackQueryParams(state);
    if (!originalUrl) return null;
    try {
        return await iface.callOAuthCallback(originalUrl.searchParams, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(redirectUrl), codeVerifier, state, tokenStore);
    } catch (e) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("Error signing in during OAuth callback. Please try again.", {
            cause: e
        });
    }
}
;
 //# sourceMappingURL=auth.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/readonly-url-search-params.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * ReadonlyURLSearchParams implementation shared between client and server.
 * This file is intentionally not marked as 'use client' or 'use server'
 * so it can be imported by both environments.
 */ /** @internal */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReadonlyURLSearchParams", {
    enumerable: true,
    get: function() {
        return ReadonlyURLSearchParams;
    }
});
class ReadonlyURLSearchParamsError extends Error {
    constructor(){
        super('Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams');
    }
}
class ReadonlyURLSearchParams extends URLSearchParams {
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ append() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ delete() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ set() {
        throw new ReadonlyURLSearchParamsError();
    }
    /** @deprecated Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams */ sort() {
        throw new ReadonlyURLSearchParamsError();
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=readonly-url-search-params.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect-status-code.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RedirectStatusCode", {
    enumerable: true,
    get: function() {
        return RedirectStatusCode;
    }
});
var RedirectStatusCode = /*#__PURE__*/ function(RedirectStatusCode) {
    RedirectStatusCode[RedirectStatusCode["SeeOther"] = 303] = "SeeOther";
    RedirectStatusCode[RedirectStatusCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    RedirectStatusCode[RedirectStatusCode["PermanentRedirect"] = 308] = "PermanentRedirect";
    return RedirectStatusCode;
}({});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect-status-code.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect-error.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    REDIRECT_ERROR_CODE: null,
    RedirectType: null,
    isRedirectError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    REDIRECT_ERROR_CODE: function() {
        return REDIRECT_ERROR_CODE;
    },
    RedirectType: function() {
        return RedirectType;
    },
    isRedirectError: function() {
        return isRedirectError;
    }
});
const _redirectstatuscode = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect-status-code.js [app-rsc] (ecmascript)");
const REDIRECT_ERROR_CODE = 'NEXT_REDIRECT';
var RedirectType = /*#__PURE__*/ function(RedirectType) {
    RedirectType["push"] = "push";
    RedirectType["replace"] = "replace";
    return RedirectType;
}({});
function isRedirectError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const digest = error.digest.split(';');
    const [errorCode, type] = digest;
    const destination = digest.slice(2, -2).join(';');
    const status = digest.at(-2);
    const statusCode = Number(status);
    return errorCode === REDIRECT_ERROR_CODE && (type === 'replace' || type === 'push') && typeof destination === 'string' && !isNaN(statusCode) && statusCode in _redirectstatuscode.RedirectStatusCode;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect-error.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getRedirectError: null,
    getRedirectStatusCodeFromError: null,
    getRedirectTypeFromError: null,
    getURLFromRedirectError: null,
    permanentRedirect: null,
    redirect: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getRedirectError: function() {
        return getRedirectError;
    },
    getRedirectStatusCodeFromError: function() {
        return getRedirectStatusCodeFromError;
    },
    getRedirectTypeFromError: function() {
        return getRedirectTypeFromError;
    },
    getURLFromRedirectError: function() {
        return getURLFromRedirectError;
    },
    permanentRedirect: function() {
        return permanentRedirect;
    },
    redirect: function() {
        return redirect;
    }
});
const _redirectstatuscode = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect-status-code.js [app-rsc] (ecmascript)");
const _redirecterror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect-error.js [app-rsc] (ecmascript)");
const actionAsyncStorage = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)").actionAsyncStorage : "TURBOPACK unreachable";
function getRedirectError(url, type, statusCode = _redirectstatuscode.RedirectStatusCode.TemporaryRedirect) {
    const error = Object.defineProperty(new Error(_redirecterror.REDIRECT_ERROR_CODE), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = `${_redirecterror.REDIRECT_ERROR_CODE};${type};${url};${statusCode};`;
    return error;
}
function redirect(/** The URL to redirect to */ url, type) {
    type ??= actionAsyncStorage?.getStore()?.isAction ? _redirecterror.RedirectType.push : _redirecterror.RedirectType.replace;
    throw getRedirectError(url, type, _redirectstatuscode.RedirectStatusCode.TemporaryRedirect);
}
function permanentRedirect(/** The URL to redirect to */ url, type = _redirecterror.RedirectType.replace) {
    throw getRedirectError(url, type, _redirectstatuscode.RedirectStatusCode.PermanentRedirect);
}
function getURLFromRedirectError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) return null;
    // Slices off the beginning of the digest that contains the code and the
    // separating ';'.
    return error.digest.split(';').slice(2, -2).join(';');
}
function getRedirectTypeFromError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) {
        throw Object.defineProperty(new Error('Not a redirect error'), "__NEXT_ERROR_CODE", {
            value: "E260",
            enumerable: false,
            configurable: true
        });
    }
    return error.digest.split(';', 2)[1];
}
function getRedirectStatusCodeFromError(error) {
    if (!(0, _redirecterror.isRedirectError)(error)) {
        throw Object.defineProperty(new Error('Not a redirect error'), "__NEXT_ERROR_CODE", {
            value: "E260",
            enumerable: false,
            configurable: true
        });
    }
    return Number(error.digest.split(';').at(-2));
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=redirect.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HTTPAccessErrorStatus: null,
    HTTP_ERROR_FALLBACK_ERROR_CODE: null,
    getAccessFallbackErrorTypeByStatus: null,
    getAccessFallbackHTTPStatus: null,
    isHTTPAccessFallbackError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HTTPAccessErrorStatus: function() {
        return HTTPAccessErrorStatus;
    },
    HTTP_ERROR_FALLBACK_ERROR_CODE: function() {
        return HTTP_ERROR_FALLBACK_ERROR_CODE;
    },
    getAccessFallbackErrorTypeByStatus: function() {
        return getAccessFallbackErrorTypeByStatus;
    },
    getAccessFallbackHTTPStatus: function() {
        return getAccessFallbackHTTPStatus;
    },
    isHTTPAccessFallbackError: function() {
        return isHTTPAccessFallbackError;
    }
});
const HTTPAccessErrorStatus = {
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401
};
const ALLOWED_CODES = new Set(Object.values(HTTPAccessErrorStatus));
const HTTP_ERROR_FALLBACK_ERROR_CODE = 'NEXT_HTTP_ERROR_FALLBACK';
function isHTTPAccessFallbackError(error) {
    if (typeof error !== 'object' || error === null || !('digest' in error) || typeof error.digest !== 'string') {
        return false;
    }
    const [prefix, httpStatus] = error.digest.split(';');
    return prefix === HTTP_ERROR_FALLBACK_ERROR_CODE && ALLOWED_CODES.has(Number(httpStatus));
}
function getAccessFallbackHTTPStatus(error) {
    const httpStatus = error.digest.split(';')[1];
    return Number(httpStatus);
}
function getAccessFallbackErrorTypeByStatus(status) {
    switch(status){
        case 401:
            return 'unauthorized';
        case 403:
            return 'forbidden';
        case 404:
            return 'not-found';
        default:
            return;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=http-access-fallback.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/not-found.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "notFound", {
    enumerable: true,
    get: function() {
        return notFound;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-rsc] (ecmascript)");
/**
 * This function allows you to render the [not-found.js file](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
 * within a route segment as well as inject a tag.
 *
 * `notFound()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 * - In a Server Component, this will insert a `<meta name="robots" content="noindex" />` meta tag and set the status code to 404.
 * - In a Route Handler or Server Action, it will serve a 404 to the caller.
 *
 * Read more: [Next.js Docs: `notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;
function notFound() {
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=not-found.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/forbidden.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "forbidden", {
    enumerable: true,
    get: function() {
        return forbidden;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-rsc] (ecmascript)");
// TODO: Add `forbidden` docs
/**
 * @experimental
 * This function allows you to render the [forbidden.js file](https://nextjs.org/docs/app/api-reference/file-conventions/forbidden)
 * within a route segment as well as inject a tag.
 *
 * `forbidden()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 * Read more: [Next.js Docs: `forbidden`](https://nextjs.org/docs/app/api-reference/functions/forbidden)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};403`;
function forbidden() {
    if ("TURBOPACK compile-time truthy", 1) {
        throw Object.defineProperty(new Error(`\`forbidden()\` is experimental and only allowed to be enabled when \`experimental.authInterrupts\` is enabled.`), "__NEXT_ERROR_CODE", {
            value: "E488",
            enumerable: false,
            configurable: true
        });
    }
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=forbidden.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/unauthorized.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unauthorized", {
    enumerable: true,
    get: function() {
        return unauthorized;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-rsc] (ecmascript)");
// TODO: Add `unauthorized` docs
/**
 * @experimental
 * This function allows you to render the [unauthorized.js file](https://nextjs.org/docs/app/api-reference/file-conventions/unauthorized)
 * within a route segment as well as inject a tag.
 *
 * `unauthorized()` can be used in
 * [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components),
 * [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), and
 * [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).
 *
 *
 * Read more: [Next.js Docs: `unauthorized`](https://nextjs.org/docs/app/api-reference/functions/unauthorized)
 */ const DIGEST = `${_httpaccessfallback.HTTP_ERROR_FALLBACK_ERROR_CODE};401`;
function unauthorized() {
    if ("TURBOPACK compile-time truthy", 1) {
        throw Object.defineProperty(new Error(`\`unauthorized()\` is experimental and only allowed to be used when \`experimental.authInterrupts\` is enabled.`), "__NEXT_ERROR_CODE", {
            value: "E411",
            enumerable: false,
            configurable: true
        });
    }
    const error = Object.defineProperty(new Error(DIGEST), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
    error.digest = DIGEST;
    throw error;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=unauthorized.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/lib/router-utils/is-postpone.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isPostpone", {
    enumerable: true,
    get: function() {
        return isPostpone;
    }
});
const REACT_POSTPONE_TYPE = Symbol.for('react.postpone');
function isPostpone(error) {
    return typeof error === 'object' && error !== null && error.$$typeof === REACT_POSTPONE_TYPE;
} //# sourceMappingURL=is-postpone.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/is-next-router-error.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isNextRouterError", {
    enumerable: true,
    get: function() {
        return isNextRouterError;
    }
});
const _httpaccessfallback = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/http-access-fallback/http-access-fallback.js [app-rsc] (ecmascript)");
const _redirecterror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect-error.js [app-rsc] (ecmascript)");
function isNextRouterError(error) {
    return (0, _redirecterror.isRedirectError)(error) || (0, _httpaccessfallback.isHTTPAccessFallbackError)(error);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=is-next-router-error.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/unstable-rethrow.server.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_rethrow", {
    enumerable: true,
    get: function() {
        return unstable_rethrow;
    }
});
const _dynamicrenderingutils = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/dynamic-rendering-utils.js [app-rsc] (ecmascript)");
const _ispostpone = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/lib/router-utils/is-postpone.js [app-rsc] (ecmascript)");
const _bailouttocsr = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-rsc] (ecmascript)");
const _isnextroutererror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/is-next-router-error.js [app-rsc] (ecmascript)");
const _dynamicrendering = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/app-render/dynamic-rendering.js [app-rsc] (ecmascript)");
const _hooksservercontext = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/hooks-server-context.js [app-rsc] (ecmascript)");
function unstable_rethrow(error) {
    if ((0, _isnextroutererror.isNextRouterError)(error) || (0, _bailouttocsr.isBailoutToCSRError)(error) || (0, _hooksservercontext.isDynamicServerError)(error) || (0, _dynamicrendering.isDynamicPostpone)(error) || (0, _ispostpone.isPostpone)(error) || (0, _dynamicrenderingutils.isHangingPromiseRejectionError)(error) || (0, _dynamicrendering.isPrerenderInterruptedError)(error)) {
        throw error;
    }
    if (error instanceof Error && 'cause' in error) {
        unstable_rethrow(error.cause);
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=unstable-rethrow.server.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/unstable-rethrow.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * This function should be used to rethrow internal Next.js errors so that they can be handled by the framework.
 * When wrapping an API that uses errors to interrupt control flow, you should use this function before you do any error handling.
 * This function will rethrow the error if it is a Next.js error so it can be handled, otherwise it will do nothing.
 *
 * Read more: [Next.js Docs: `unstable_rethrow`](https://nextjs.org/docs/app/api-reference/functions/unstable_rethrow)
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "unstable_rethrow", {
    enumerable: true,
    get: function() {
        return unstable_rethrow;
    }
});
const unstable_rethrow = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/unstable-rethrow.server.js [app-rsc] (ecmascript)").unstable_rethrow : "TURBOPACK unreachable";
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=unstable-rethrow.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ReadonlyURLSearchParams: null,
    RedirectType: null,
    forbidden: null,
    notFound: null,
    permanentRedirect: null,
    redirect: null,
    unauthorized: null,
    unstable_isUnrecognizedActionError: null,
    unstable_rethrow: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ReadonlyURLSearchParams: function() {
        return _readonlyurlsearchparams.ReadonlyURLSearchParams;
    },
    RedirectType: function() {
        return _redirecterror.RedirectType;
    },
    forbidden: function() {
        return _forbidden.forbidden;
    },
    notFound: function() {
        return _notfound.notFound;
    },
    permanentRedirect: function() {
        return _redirect.permanentRedirect;
    },
    redirect: function() {
        return _redirect.redirect;
    },
    unauthorized: function() {
        return _unauthorized.unauthorized;
    },
    unstable_isUnrecognizedActionError: function() {
        return unstable_isUnrecognizedActionError;
    },
    unstable_rethrow: function() {
        return _unstablerethrow.unstable_rethrow;
    }
});
const _readonlyurlsearchparams = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/readonly-url-search-params.js [app-rsc] (ecmascript)");
const _redirect = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect.js [app-rsc] (ecmascript)");
const _redirecterror = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/redirect-error.js [app-rsc] (ecmascript)");
const _notfound = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/not-found.js [app-rsc] (ecmascript)");
const _forbidden = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/forbidden.js [app-rsc] (ecmascript)");
const _unauthorized = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/unauthorized.js [app-rsc] (ecmascript)");
const _unstablerethrow = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/unstable-rethrow.js [app-rsc] (ecmascript)");
function unstable_isUnrecognizedActionError() {
    throw Object.defineProperty(new Error('`unstable_isUnrecognizedActionError` can only be used on the client.'), "__NEXT_ERROR_CODE", {
        value: "E776",
        enumerable: false,
        configurable: true
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=navigation.react-server.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)"); //# sourceMappingURL=navigation.react-server.js.map
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/objects.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/maps.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DependenciesMap",
    ()=>DependenciesMap,
    "MaybeWeakMap",
    ()=>MaybeWeakMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-rsc] (ecmascript)");
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(inner.value);
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(undefined);
        }
    }
    _unwrapFromInner(dependencies, inner) {
        if (dependencies.length === 0) {
            return this._valueToResult(inner);
        } else {
            const [key, ...rest] = dependencies;
            const newInner = inner.map.get(key);
            if (!newInner) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(undefined);
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].or(this._unwrapFromInner(dependencies, this._inner), undefined);
    }
    set(dependencies, value) {
        this._setInInner(dependencies, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].ok(value), this._inner);
        return this;
    }
    delete(dependencies) {
        return this._setInInner(dependencies, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].error(undefined), this._inner).status === "ok";
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/caches.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AsyncCache",
    ()=>AsyncCache,
    "cacheFunction",
    ()=>cacheFunction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$maps$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/maps.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/objects.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/stores.js [app-rsc] (ecmascript)");
;
;
;
;
function cacheFunction(f) {
    const dependenciesMap = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$maps$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DependenciesMap"]();
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
    _map = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$maps$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DependenciesMap"]();
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
        this._store = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncStore"]();
        this._rateLimitOptions = {
            concurrency: 1,
            throttleMs: 300,
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["filterUndefined"])(_options.rateLimiter ?? {})
        };
        this._fetcher = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rateLimited"])(fetcher, {
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
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolved"])(cached.data);
        }
        return this._refetch(cacheStrategy);
    }
    _set(value) {
        this._store.set(value);
    }
    _setAsync(value) {
        const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pending"])(value);
        this._pendingPromise = promise;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pending"])(this._store.setAsync(promise));
    }
    _refetch(cacheStrategy) {
        if (cacheStrategy === "read-write" && this._pendingPromise) {
            return this._pendingPromise;
        }
        const promise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pending"])(this._fetcher());
        if (cacheStrategy === "never") {
            return promise;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pending"])(this._setAsync(promise).then(()=>promise));
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
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runAsynchronously"])(this.refresh());
            });
            this._unsubscribers.push(unsubscribe);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runAsynchronously"])(this.refresh());
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/stack-app.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/known-errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$adminInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/adminInterface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/clientInterface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/interface/serverInterface.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/cookie.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/errors.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/uuids.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/results.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/stores.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$next$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/next.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/auth.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/utils/url.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/objects.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/promises.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$caches$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/node_modules/@stackframe/stack-shared/dist/utils/caches.js [app-rsc] (ecmascript)");
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
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["filterUndefined"])(partial)
    };
}
function getDefaultProjectId() {
    return ("TURBOPACK compile-time value", "a18ac01b-59d7-4c8c-80b4-c0c2ec979d96") || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])(new Error("Welcome to Stack! It seems that you haven't provided a project ID. Please create a project on the Stack dashboard at https://app.stack-auth.com and put it in the NEXT_PUBLIC_STACK_PROJECT_ID environment variable."));
}
function getDefaultPublishableClientKey() {
    return ("TURBOPACK compile-time value", "pck_qcjtn291av4x05zntcwhz5w71m8bm8g5mcy1mnze3cqf8") || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])(new Error("Welcome to Stack! It seems that you haven't provided a publishable client key. Please create an API key for your project on the Stack dashboard at https://app.stack-auth.com and copy your publishable client key into the NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY environment variable."));
}
function getDefaultSecretServerKey() {
    return process.env.STACK_SECRET_SERVER_KEY || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])(new Error("No secret server key provided. Please copy your key from the Stack dashboard and put your it in the STACK_SECRET_SERVER_KEY environment variable."));
}
function getDefaultSuperSecretAdminKey() {
    return process.env.STACK_SUPER_SECRET_ADMIN_KEY || (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])(new Error("No super secret admin key provided. Please copy your key from the Stack dashboard and put it in the STACK_SUPER_SECRET_ADMIN_KEY environment variable."));
}
function getDefaultBaseUrl() {
    return process.env.NEXT_PUBLIC_STACK_URL || defaultBaseUrl;
}
var defaultBaseUrl = "https://app.stack-auth.com";
function createEmptyTokenStore() {
    const store = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncStore"]();
    store.set({
        refreshToken: null,
        accessToken: null
    });
    return store;
}
var memoryTokenStore = createEmptyTokenStore();
var cookieTokenStore = null;
var cookieTokenStoreInitializer = ()=>{
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$next$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isClient"])()) {
        throw new Error("Cannot use cookie token store on the server!");
    }
    if (cookieTokenStore === null) {
        cookieTokenStore = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncStore"]();
        let hasSucceededInWriting = true;
        setInterval(()=>{
            if (hasSucceededInWriting) {
                const newValue = {
                    refreshToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCookie"])("stack-refresh"),
                    accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCookie"])("stack-access")
                };
                const res = cookieTokenStore.get();
                if (res.status !== "ok" || res.data.refreshToken !== newValue.refreshToken || res.data.accessToken !== newValue.accessToken) {
                    cookieTokenStore.set(newValue);
                }
            }
        }, 10);
        cookieTokenStore.onChange((value)=>{
            try {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setOrDeleteCookie"])("stack-refresh", value.refreshToken, {
                    maxAge: 60 * 60 * 24 * 365
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setOrDeleteCookie"])("stack-access", value.accessToken, {
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
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$next$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isClient"])()) {
                return cookieTokenStoreInitializer();
            } else {
                const store = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$stores$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncStore"]();
                store.set({
                    refreshToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCookie"])("stack-refresh"),
                    accessToken: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCookie"])("stack-access")
                });
                store.onChange((value)=>{
                    try {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setOrDeleteCookie"])("stack-refresh", value.refreshToken, {
                            maxAge: 60 * 60 * 24 * 365
                        });
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$cookie$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setOrDeleteCookie"])("stack-access", value.accessToken, {
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
    return (tokenStoreInitializers.get(tokenStoreOptions) ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["throwErr"])(`Invalid token store ${tokenStoreOptions}`))();
}
var loadingSentinel = Symbol("stackAppCacheLoadingSentinel");
function useCache(cache, dependencies, caller) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suspendIfSsr"])(caller);
    const subscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])((cb)=>{
        const { unsubscribe } = cache.onChange(dependencies, ()=>cb());
        return unsubscribe;
    }, [
        cache,
        ...dependencies
    ]);
    const getSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncResult"].or(cache.getIfCached(dependencies), loadingSentinel);
    }, [
        cache,
        ...dependencies
    ]);
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    if (value === loadingSentinel) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["use"])(cache.getOrWait(dependencies, "read-write"));
    } else {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["use"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolved"])(value));
    }
}
var stackAppInternalsSymbol = Symbol.for("StackAppInternals");
var allClientApps = /* @__PURE__ */ new Map();
var createCache = (fetcher)=>{
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$caches$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncCache"](async (dependencies)=>await fetcher(dependencies), {});
};
var createCacheByTokenStore = (fetcher)=>{
    return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$caches$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AsyncCache"](async ([tokenStore, ...extraDependencies])=>await fetcher(tokenStore, extraDependencies), {
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wait"])(2e3);
        }
        const user = await this._interface.getClientUserByToken(tokenStore);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].or(user, null);
    });
    _currentProjectCache = createCache(async ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].orThrow(await this._interface.getClientProject());
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
            this._interface = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackClientInterface"]({
                baseUrl: options.baseUrl ?? getDefaultBaseUrl(),
                projectId: options.projectId ?? getDefaultProjectId(),
                clientVersion,
                publishableClientKey: options.publishableClientKey ?? getDefaultPublishableClientKey()
            });
        }
        this._tokenStoreOptions = options.tokenStore;
        this._urlOptions = options.urls ?? {};
        this._uniqueIdentifier = options.uniqueIdentifier ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$uuids$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateUuid"])();
        if (allClientApps.has(this._uniqueIdentifier)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("A Stack client app with the same unique identifier already exists");
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>teams.map((json2)=>app._teamFromJson(json2)), [
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>permissions.map((json2)=>app._permissionFromJson(json2)), [
                    permissions
                ]);
            },
            usePermission (scope, permissionId) {
                const permissions = this.usePermissions(scope);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>permissions.find((p)=>p.id === permissionId) ?? null, [
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$clientInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductionModeErrors"])(this.toJson());
            }
        };
    }
    _createAdminInterface(forProjectId, tokenStore) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$adminInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAdminInterface"]({
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
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wait"])(2e3);
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
        const redirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(this.urls.passwordReset);
        const error = await this._interface.sendForgotPasswordEmail(email, redirectUrl);
        return error;
    }
    async sendMagicLinkEmail(email) {
        const magicLinkRedirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(this.urls.magicLinkCallback);
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
                        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"](this.urls.signIn, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RedirectType"].replace);
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
        const router = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRouter"]();
        const tokenStore = getTokenStore(this._tokenStoreOptions);
        const userJson = useCache(this._currentUserCache, [
            tokenStore
        ], "useUser()");
        if (userJson === null) {
            switch(options?.or){
                case "redirect":
                    {
                        router.replace(this.urls.signIn);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suspend"])();
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("suspend should never return");
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signInWithOAuth"])(this._interface, {
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
        const emailVerificationRedirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(this.urls.emailVerification);
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
        if (result instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$known$2d$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KnownError"]) {
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
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["callOAuthCallback"])(this._interface, tokenStore, this.urls.oauthCallback);
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
        const emailVerificationRedirectUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$utils$2f$url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["constructRedirectUrl"])(this.urls.emailVerification);
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>json.map((j)=>this._projectAdminFromJson(j, this._createAdminInterface(j.id, tokenStore), ()=>this._refreshOwnedProjects(tokenStore))), [
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
                const providedCheckString = JSON.stringify((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$objects$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["omit"])(json, []));
                const existing = allClientApps.get(json.uniqueIdentifier);
                if (existing) {
                    const [existingCheckString, clientApp] = existing;
                    if (existingCheckString !== providedCheckString) {
                        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAssertionError"]("The provided app JSON does not match the configuration of the existing client app with the same unique identifier", {
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
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$promises$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runAsynchronously"])(this._currentUserCache.forceSetCachedValueAsync([
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].or(user, null);
    });
    _serverUsersCache = createCache(async ()=>{
        return await this._interface.listUsers();
    });
    _serverUserCache = createCache(async ([userId])=>{
        const user = await this._interface.getServerUserById(userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$utils$2f$results$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Result"].or(user, null);
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
            interface: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$serverInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackServerInterface"]({
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>teams.map((json2)=>app._serverTeamFromJson(json2)), [
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>permissions.map((json2)=>app._serverPermissionFromJson(json2)), [
                    permissions
                ]);
            },
            usePermission (scope, permissionId) {
                const permissions = this.usePermissions(scope);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>permissions.find((p)=>p.id === permissionId) ?? null, [
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
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>result.map((u)=>app._serverTeamMemberFromJson(u)), [
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
            if (options?.required && userJson === null) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["use"])(this.redirectToSignIn());
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
            interface: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$node_modules$2f40$stackframe$2f$stack$2d$shared$2f$dist$2f$interface$2f$adminInterface$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackAdminInterface"]({
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>this._projectAdminFromJson(json, this._interface, ()=>this._refreshProject()), [
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
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
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
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "StackContext",
    ()=>StackContext,
    "StackProviderClient",
    ()=>StackProviderClient,
    "UserSetter",
    ()=>UserSetter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StackContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StackContext() from the server but StackContext is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js <module evaluation>", "StackContext");
const StackProviderClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StackProviderClient() from the server but StackProviderClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js <module evaluation>", "StackProviderClient");
const UserSetter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call UserSetter() from the server but UserSetter is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js <module evaluation>", "UserSetter");
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "StackContext",
    ()=>StackContext,
    "StackProviderClient",
    ()=>StackProviderClient,
    "UserSetter",
    ()=>UserSetter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StackContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StackContext() from the server but StackContext is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js", "StackContext");
const StackProviderClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StackProviderClient() from the server but StackProviderClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js", "StackProviderClient");
const UserSetter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call UserSetter() from the server but UserSetter is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js", "UserSetter");
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/providers/stack-provider.tsx
__turbopack_context__.s([
    "default",
    ()=>StackProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/lib/stack-app.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider-client.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-runtime.js [app-rsc] (ecmascript)");
;
;
;
;
function StackProvider({ children, app }) {
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StackProviderClient"], {
        appJson: app[__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$lib$2f$stack$2d$app$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["stackAppInternalsSymbol"]].toClientJson(),
        children: [
            /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: null,
                children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(UserFetcher, {
                    app
                })
            }),
            children
        ]
    });
}
function UserFetcher(props) {
    const userPromise = props.app.getUser().then((user)=>user?.toJson() ?? null);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2d$client$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UserSetter"], {
        userJsonPromise: userPromise
    });
}
;
 //# sourceMappingURL=stack-provider.js.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider.js [app-rsc] (ecmascript) <export default as StackProvider>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StackProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$stack$2d$provider$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/stack-provider.js [app-rsc] (ecmascript)");
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/theme-provider.js [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "StackTheme",
    ()=>StackTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StackTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StackTheme() from the server but StackTheme is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/theme-provider.js <module evaluation>", "StackTheme");
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/theme-provider.js [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "StackTheme",
    ()=>StackTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StackTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StackTheme() from the server but StackTheme is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/theme-provider.js", "StackTheme");
}),
"[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/theme-provider.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$theme$2d$provider$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/theme-provider.js [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$theme$2d$provider$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@stackframe/stack/dist/esm/providers/theme-provider.js [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$stackframe$2f$stack$2f$dist$2f$esm$2f$providers$2f$theme$2d$provider$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "CheckmarkIcon",
    ()=>CheckmarkIcon,
    "ErrorIcon",
    ()=>ErrorIcon,
    "LoaderIcon",
    ()=>LoaderIcon,
    "ToastBar",
    ()=>ToastBar,
    "ToastIcon",
    ()=>ToastIcon,
    "Toaster",
    ()=>Toaster,
    "default",
    ()=>__TURBOPACK__default__export__,
    "resolveValue",
    ()=>resolveValue,
    "toast",
    ()=>toast,
    "useToaster",
    ()=>useToaster,
    "useToasterStore",
    ()=>useToasterStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CheckmarkIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CheckmarkIcon() from the server but CheckmarkIcon is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "CheckmarkIcon");
const ErrorIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ErrorIcon() from the server but ErrorIcon is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "ErrorIcon");
const LoaderIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LoaderIcon() from the server but LoaderIcon is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "LoaderIcon");
const ToastBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ToastBar() from the server but ToastBar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "ToastBar");
const ToastIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ToastIcon() from the server but ToastIcon is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "ToastIcon");
const Toaster = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Toaster() from the server but Toaster is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "Toaster");
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "default");
const resolveValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call resolveValue() from the server but resolveValue is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "resolveValue");
const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call toast() from the server but toast is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "toast");
const useToaster = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useToaster() from the server but useToaster is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "useToaster");
const useToasterStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useToasterStore() from the server but useToasterStore is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs <module evaluation>", "useToasterStore");
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "CheckmarkIcon",
    ()=>CheckmarkIcon,
    "ErrorIcon",
    ()=>ErrorIcon,
    "LoaderIcon",
    ()=>LoaderIcon,
    "ToastBar",
    ()=>ToastBar,
    "ToastIcon",
    ()=>ToastIcon,
    "Toaster",
    ()=>Toaster,
    "default",
    ()=>__TURBOPACK__default__export__,
    "resolveValue",
    ()=>resolveValue,
    "toast",
    ()=>toast,
    "useToaster",
    ()=>useToaster,
    "useToasterStore",
    ()=>useToasterStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const CheckmarkIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call CheckmarkIcon() from the server but CheckmarkIcon is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "CheckmarkIcon");
const ErrorIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ErrorIcon() from the server but ErrorIcon is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "ErrorIcon");
const LoaderIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call LoaderIcon() from the server but LoaderIcon is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "LoaderIcon");
const ToastBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ToastBar() from the server but ToastBar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "ToastBar");
const ToastIcon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ToastIcon() from the server but ToastIcon is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "ToastIcon");
const Toaster = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Toaster() from the server but Toaster is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "Toaster");
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "default");
const resolveValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call resolveValue() from the server but resolveValue is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "resolveValue");
const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call toast() from the server but toast is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "toast");
const useToaster = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useToaster() from the server but useToaster is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "useToaster");
const useToasterStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call useToasterStore() from the server but useToasterStore is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs", "useToasterStore");
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
];

//# sourceMappingURL=65e54_15572828._.js.map