module.exports = [
"[project]/Desktop/Inventory/my-app/node_modules/oauth4webapi/build/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/native.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/rng.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/regex.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/validate.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$regex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/regex.js [app-ssr] (ecmascript)");
;
function validate(uuid) {
    return typeof uuid === 'string' && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$regex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].test(uuid);
}
const __TURBOPACK__default__export__ = validate;
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/stringify.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "unsafeStringify",
    ()=>unsafeStringify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/validate.js [app-ssr] (ecmascript)");
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
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$validate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
const __TURBOPACK__default__export__ = stringify;
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/v4.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/native.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/rng.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/stringify.js [app-ssr] (ecmascript)");
;
;
;
function v4(options, buf, offset) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].randomUUID && !buf && !options) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$native$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].randomUUID();
    }
    options = options || {};
    const rnds = options.random || (options.rng || __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$rng$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(let i = 0; i < 16; ++i){
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$stringify$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unsafeStringify"])(rnds);
}
const __TURBOPACK__default__export__ = v4;
}),
"[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/v4.js [app-ssr] (ecmascript) <export default as v4>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "v4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$node$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/uuid/dist/esm-node/v4.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/Inventory/my-app/node_modules/js-cookie/dist/js.cookie.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/Desktop/Inventory/my-app/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
exports._ = _interop_require_wildcard;
}),
"[project]/Desktop/Inventory/my-app/node_modules/color-name/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = {
    "aliceblue": [
        240,
        248,
        255
    ],
    "antiquewhite": [
        250,
        235,
        215
    ],
    "aqua": [
        0,
        255,
        255
    ],
    "aquamarine": [
        127,
        255,
        212
    ],
    "azure": [
        240,
        255,
        255
    ],
    "beige": [
        245,
        245,
        220
    ],
    "bisque": [
        255,
        228,
        196
    ],
    "black": [
        0,
        0,
        0
    ],
    "blanchedalmond": [
        255,
        235,
        205
    ],
    "blue": [
        0,
        0,
        255
    ],
    "blueviolet": [
        138,
        43,
        226
    ],
    "brown": [
        165,
        42,
        42
    ],
    "burlywood": [
        222,
        184,
        135
    ],
    "cadetblue": [
        95,
        158,
        160
    ],
    "chartreuse": [
        127,
        255,
        0
    ],
    "chocolate": [
        210,
        105,
        30
    ],
    "coral": [
        255,
        127,
        80
    ],
    "cornflowerblue": [
        100,
        149,
        237
    ],
    "cornsilk": [
        255,
        248,
        220
    ],
    "crimson": [
        220,
        20,
        60
    ],
    "cyan": [
        0,
        255,
        255
    ],
    "darkblue": [
        0,
        0,
        139
    ],
    "darkcyan": [
        0,
        139,
        139
    ],
    "darkgoldenrod": [
        184,
        134,
        11
    ],
    "darkgray": [
        169,
        169,
        169
    ],
    "darkgreen": [
        0,
        100,
        0
    ],
    "darkgrey": [
        169,
        169,
        169
    ],
    "darkkhaki": [
        189,
        183,
        107
    ],
    "darkmagenta": [
        139,
        0,
        139
    ],
    "darkolivegreen": [
        85,
        107,
        47
    ],
    "darkorange": [
        255,
        140,
        0
    ],
    "darkorchid": [
        153,
        50,
        204
    ],
    "darkred": [
        139,
        0,
        0
    ],
    "darksalmon": [
        233,
        150,
        122
    ],
    "darkseagreen": [
        143,
        188,
        143
    ],
    "darkslateblue": [
        72,
        61,
        139
    ],
    "darkslategray": [
        47,
        79,
        79
    ],
    "darkslategrey": [
        47,
        79,
        79
    ],
    "darkturquoise": [
        0,
        206,
        209
    ],
    "darkviolet": [
        148,
        0,
        211
    ],
    "deeppink": [
        255,
        20,
        147
    ],
    "deepskyblue": [
        0,
        191,
        255
    ],
    "dimgray": [
        105,
        105,
        105
    ],
    "dimgrey": [
        105,
        105,
        105
    ],
    "dodgerblue": [
        30,
        144,
        255
    ],
    "firebrick": [
        178,
        34,
        34
    ],
    "floralwhite": [
        255,
        250,
        240
    ],
    "forestgreen": [
        34,
        139,
        34
    ],
    "fuchsia": [
        255,
        0,
        255
    ],
    "gainsboro": [
        220,
        220,
        220
    ],
    "ghostwhite": [
        248,
        248,
        255
    ],
    "gold": [
        255,
        215,
        0
    ],
    "goldenrod": [
        218,
        165,
        32
    ],
    "gray": [
        128,
        128,
        128
    ],
    "green": [
        0,
        128,
        0
    ],
    "greenyellow": [
        173,
        255,
        47
    ],
    "grey": [
        128,
        128,
        128
    ],
    "honeydew": [
        240,
        255,
        240
    ],
    "hotpink": [
        255,
        105,
        180
    ],
    "indianred": [
        205,
        92,
        92
    ],
    "indigo": [
        75,
        0,
        130
    ],
    "ivory": [
        255,
        255,
        240
    ],
    "khaki": [
        240,
        230,
        140
    ],
    "lavender": [
        230,
        230,
        250
    ],
    "lavenderblush": [
        255,
        240,
        245
    ],
    "lawngreen": [
        124,
        252,
        0
    ],
    "lemonchiffon": [
        255,
        250,
        205
    ],
    "lightblue": [
        173,
        216,
        230
    ],
    "lightcoral": [
        240,
        128,
        128
    ],
    "lightcyan": [
        224,
        255,
        255
    ],
    "lightgoldenrodyellow": [
        250,
        250,
        210
    ],
    "lightgray": [
        211,
        211,
        211
    ],
    "lightgreen": [
        144,
        238,
        144
    ],
    "lightgrey": [
        211,
        211,
        211
    ],
    "lightpink": [
        255,
        182,
        193
    ],
    "lightsalmon": [
        255,
        160,
        122
    ],
    "lightseagreen": [
        32,
        178,
        170
    ],
    "lightskyblue": [
        135,
        206,
        250
    ],
    "lightslategray": [
        119,
        136,
        153
    ],
    "lightslategrey": [
        119,
        136,
        153
    ],
    "lightsteelblue": [
        176,
        196,
        222
    ],
    "lightyellow": [
        255,
        255,
        224
    ],
    "lime": [
        0,
        255,
        0
    ],
    "limegreen": [
        50,
        205,
        50
    ],
    "linen": [
        250,
        240,
        230
    ],
    "magenta": [
        255,
        0,
        255
    ],
    "maroon": [
        128,
        0,
        0
    ],
    "mediumaquamarine": [
        102,
        205,
        170
    ],
    "mediumblue": [
        0,
        0,
        205
    ],
    "mediumorchid": [
        186,
        85,
        211
    ],
    "mediumpurple": [
        147,
        112,
        219
    ],
    "mediumseagreen": [
        60,
        179,
        113
    ],
    "mediumslateblue": [
        123,
        104,
        238
    ],
    "mediumspringgreen": [
        0,
        250,
        154
    ],
    "mediumturquoise": [
        72,
        209,
        204
    ],
    "mediumvioletred": [
        199,
        21,
        133
    ],
    "midnightblue": [
        25,
        25,
        112
    ],
    "mintcream": [
        245,
        255,
        250
    ],
    "mistyrose": [
        255,
        228,
        225
    ],
    "moccasin": [
        255,
        228,
        181
    ],
    "navajowhite": [
        255,
        222,
        173
    ],
    "navy": [
        0,
        0,
        128
    ],
    "oldlace": [
        253,
        245,
        230
    ],
    "olive": [
        128,
        128,
        0
    ],
    "olivedrab": [
        107,
        142,
        35
    ],
    "orange": [
        255,
        165,
        0
    ],
    "orangered": [
        255,
        69,
        0
    ],
    "orchid": [
        218,
        112,
        214
    ],
    "palegoldenrod": [
        238,
        232,
        170
    ],
    "palegreen": [
        152,
        251,
        152
    ],
    "paleturquoise": [
        175,
        238,
        238
    ],
    "palevioletred": [
        219,
        112,
        147
    ],
    "papayawhip": [
        255,
        239,
        213
    ],
    "peachpuff": [
        255,
        218,
        185
    ],
    "peru": [
        205,
        133,
        63
    ],
    "pink": [
        255,
        192,
        203
    ],
    "plum": [
        221,
        160,
        221
    ],
    "powderblue": [
        176,
        224,
        230
    ],
    "purple": [
        128,
        0,
        128
    ],
    "rebeccapurple": [
        102,
        51,
        153
    ],
    "red": [
        255,
        0,
        0
    ],
    "rosybrown": [
        188,
        143,
        143
    ],
    "royalblue": [
        65,
        105,
        225
    ],
    "saddlebrown": [
        139,
        69,
        19
    ],
    "salmon": [
        250,
        128,
        114
    ],
    "sandybrown": [
        244,
        164,
        96
    ],
    "seagreen": [
        46,
        139,
        87
    ],
    "seashell": [
        255,
        245,
        238
    ],
    "sienna": [
        160,
        82,
        45
    ],
    "silver": [
        192,
        192,
        192
    ],
    "skyblue": [
        135,
        206,
        235
    ],
    "slateblue": [
        106,
        90,
        205
    ],
    "slategray": [
        112,
        128,
        144
    ],
    "slategrey": [
        112,
        128,
        144
    ],
    "snow": [
        255,
        250,
        250
    ],
    "springgreen": [
        0,
        255,
        127
    ],
    "steelblue": [
        70,
        130,
        180
    ],
    "tan": [
        210,
        180,
        140
    ],
    "teal": [
        0,
        128,
        128
    ],
    "thistle": [
        216,
        191,
        216
    ],
    "tomato": [
        255,
        99,
        71
    ],
    "turquoise": [
        64,
        224,
        208
    ],
    "violet": [
        238,
        130,
        238
    ],
    "wheat": [
        245,
        222,
        179
    ],
    "white": [
        255,
        255,
        255
    ],
    "whitesmoke": [
        245,
        245,
        245
    ],
    "yellow": [
        255,
        255,
        0
    ],
    "yellowgreen": [
        154,
        205,
        50
    ]
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/is-arrayish/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = function isArrayish(obj) {
    if (!obj || typeof obj === 'string') {
        return false;
    }
    return obj instanceof Array || Array.isArray(obj) || obj.length >= 0 && (obj.splice instanceof Function || Object.getOwnPropertyDescriptor(obj, obj.length - 1) && obj.constructor.name !== 'String');
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/simple-swizzle/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var isArrayish = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/is-arrayish/index.js [app-ssr] (ecmascript)");
var concat = Array.prototype.concat;
var slice = Array.prototype.slice;
var swizzle = module.exports = function swizzle(args) {
    var results = [];
    for(var i = 0, len = args.length; i < len; i++){
        var arg = args[i];
        if (isArrayish(arg)) {
            // http://jsperf.com/javascript-array-concat-vs-push/98
            results = concat.call(results, slice.call(arg));
        } else {
            results.push(arg);
        }
    }
    return results;
};
swizzle.wrap = function(fn) {
    return function() {
        return fn(swizzle(arguments));
    };
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/color-string/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* MIT license */ var colorNames = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/color-name/index.js [app-ssr] (ecmascript)");
var swizzle = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/simple-swizzle/index.js [app-ssr] (ecmascript)");
var hasOwnProperty = Object.hasOwnProperty;
var reverseNames = Object.create(null);
// create a list of reverse color names
for(var name in colorNames){
    if (hasOwnProperty.call(colorNames, name)) {
        reverseNames[colorNames[name]] = name;
    }
}
var cs = module.exports = {
    to: {},
    get: {}
};
cs.get = function(string) {
    var prefix = string.substring(0, 3).toLowerCase();
    var val;
    var model;
    switch(prefix){
        case 'hsl':
            val = cs.get.hsl(string);
            model = 'hsl';
            break;
        case 'hwb':
            val = cs.get.hwb(string);
            model = 'hwb';
            break;
        default:
            val = cs.get.rgb(string);
            model = 'rgb';
            break;
    }
    if (!val) {
        return null;
    }
    return {
        model: model,
        value: val
    };
};
cs.get.rgb = function(string) {
    if (!string) {
        return null;
    }
    var abbr = /^#([a-f0-9]{3,4})$/i;
    var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
    var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
    var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
    var keyword = /^(\w+)$/;
    var rgb = [
        0,
        0,
        0,
        1
    ];
    var match;
    var i;
    var hexAlpha;
    if (match = string.match(hex)) {
        hexAlpha = match[2];
        match = match[1];
        for(i = 0; i < 3; i++){
            // https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
            var i2 = i * 2;
            rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
        }
        if (hexAlpha) {
            rgb[3] = parseInt(hexAlpha, 16) / 255;
        }
    } else if (match = string.match(abbr)) {
        match = match[1];
        hexAlpha = match[3];
        for(i = 0; i < 3; i++){
            rgb[i] = parseInt(match[i] + match[i], 16);
        }
        if (hexAlpha) {
            rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
        }
    } else if (match = string.match(rgba)) {
        for(i = 0; i < 3; i++){
            rgb[i] = parseInt(match[i + 1], 0);
        }
        if (match[4]) {
            if (match[5]) {
                rgb[3] = parseFloat(match[4]) * 0.01;
            } else {
                rgb[3] = parseFloat(match[4]);
            }
        }
    } else if (match = string.match(per)) {
        for(i = 0; i < 3; i++){
            rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
        }
        if (match[4]) {
            if (match[5]) {
                rgb[3] = parseFloat(match[4]) * 0.01;
            } else {
                rgb[3] = parseFloat(match[4]);
            }
        }
    } else if (match = string.match(keyword)) {
        if (match[1] === 'transparent') {
            return [
                0,
                0,
                0,
                0
            ];
        }
        if (!hasOwnProperty.call(colorNames, match[1])) {
            return null;
        }
        rgb = colorNames[match[1]];
        rgb[3] = 1;
        return rgb;
    } else {
        return null;
    }
    for(i = 0; i < 3; i++){
        rgb[i] = clamp(rgb[i], 0, 255);
    }
    rgb[3] = clamp(rgb[3], 0, 1);
    return rgb;
};
cs.get.hsl = function(string) {
    if (!string) {
        return null;
    }
    var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
    var match = string.match(hsl);
    if (match) {
        var alpha = parseFloat(match[4]);
        var h = (parseFloat(match[1]) % 360 + 360) % 360;
        var s = clamp(parseFloat(match[2]), 0, 100);
        var l = clamp(parseFloat(match[3]), 0, 100);
        var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [
            h,
            s,
            l,
            a
        ];
    }
    return null;
};
cs.get.hwb = function(string) {
    if (!string) {
        return null;
    }
    var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
    var match = string.match(hwb);
    if (match) {
        var alpha = parseFloat(match[4]);
        var h = (parseFloat(match[1]) % 360 + 360) % 360;
        var w = clamp(parseFloat(match[2]), 0, 100);
        var b = clamp(parseFloat(match[3]), 0, 100);
        var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [
            h,
            w,
            b,
            a
        ];
    }
    return null;
};
cs.to.hex = function() {
    var rgba = swizzle(arguments);
    return '#' + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : '');
};
cs.to.rgb = function() {
    var rgba = swizzle(arguments);
    return rgba.length < 4 || rgba[3] === 1 ? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')' : 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};
cs.to.rgb.percent = function() {
    var rgba = swizzle(arguments);
    var r = Math.round(rgba[0] / 255 * 100);
    var g = Math.round(rgba[1] / 255 * 100);
    var b = Math.round(rgba[2] / 255 * 100);
    return rgba.length < 4 || rgba[3] === 1 ? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)' : 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};
cs.to.hsl = function() {
    var hsla = swizzle(arguments);
    return hsla.length < 4 || hsla[3] === 1 ? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)' : 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};
// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function() {
    var hwba = swizzle(arguments);
    var a = '';
    if (hwba.length >= 4 && hwba[3] !== 1) {
        a = ', ' + hwba[3];
    }
    return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};
cs.to.keyword = function(rgb) {
    return reverseNames[rgb.slice(0, 3)];
};
// helpers
function clamp(num, min, max) {
    return Math.min(Math.max(min, num), max);
}
function hexDouble(num) {
    var str = Math.round(num).toString(16).toUpperCase();
    return str.length < 2 ? '0' + str : str;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/color-convert/conversions.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* MIT license */ /* eslint-disable no-mixed-operators */ const cssKeywords = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/color-name/index.js [app-ssr] (ecmascript)");
// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)
const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)){
    reverseKeywords[cssKeywords[key]] = key;
}
const convert = {
    rgb: {
        channels: 3,
        labels: 'rgb'
    },
    hsl: {
        channels: 3,
        labels: 'hsl'
    },
    hsv: {
        channels: 3,
        labels: 'hsv'
    },
    hwb: {
        channels: 3,
        labels: 'hwb'
    },
    cmyk: {
        channels: 4,
        labels: 'cmyk'
    },
    xyz: {
        channels: 3,
        labels: 'xyz'
    },
    lab: {
        channels: 3,
        labels: 'lab'
    },
    lch: {
        channels: 3,
        labels: 'lch'
    },
    hex: {
        channels: 1,
        labels: [
            'hex'
        ]
    },
    keyword: {
        channels: 1,
        labels: [
            'keyword'
        ]
    },
    ansi16: {
        channels: 1,
        labels: [
            'ansi16'
        ]
    },
    ansi256: {
        channels: 1,
        labels: [
            'ansi256'
        ]
    },
    hcg: {
        channels: 3,
        labels: [
            'h',
            'c',
            'g'
        ]
    },
    apple: {
        channels: 3,
        labels: [
            'r16',
            'g16',
            'b16'
        ]
    },
    gray: {
        channels: 1,
        labels: [
            'gray'
        ]
    }
};
module.exports = convert;
// Hide .channels and .labels properties
for (const model of Object.keys(convert)){
    if (!('channels' in convert[model])) {
        throw new Error('missing channels property: ' + model);
    }
    if (!('labels' in convert[model])) {
        throw new Error('missing channel labels property: ' + model);
    }
    if (convert[model].labels.length !== convert[model].channels) {
        throw new Error('channel and label counts mismatch: ' + model);
    }
    const { channels, labels } = convert[model];
    delete convert[model].channels;
    delete convert[model].labels;
    Object.defineProperty(convert[model], 'channels', {
        value: channels
    });
    Object.defineProperty(convert[model], 'labels', {
        value: labels
    });
}
convert.rgb.hsl = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h;
    let s;
    if (max === min) {
        h = 0;
    } else if (r === max) {
        h = (g - b) / delta;
    } else if (g === max) {
        h = 2 + (b - r) / delta;
    } else if (b === max) {
        h = 4 + (r - g) / delta;
    }
    h = Math.min(h * 60, 360);
    if (h < 0) {
        h += 360;
    }
    const l = (min + max) / 2;
    if (max === min) {
        s = 0;
    } else if (l <= 0.5) {
        s = delta / (max + min);
    } else {
        s = delta / (2 - max - min);
    }
    return [
        h,
        s * 100,
        l * 100
    ];
};
convert.rgb.hsv = function(rgb) {
    let rdif;
    let gdif;
    let bdif;
    let h;
    let s;
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const v = Math.max(r, g, b);
    const diff = v - Math.min(r, g, b);
    const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
    };
    if (diff === 0) {
        h = 0;
        s = 0;
    } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
            h = bdif - gdif;
        } else if (g === v) {
            h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
            h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return [
        h * 360,
        s * 100,
        v * 100
    ];
};
convert.rgb.hwb = function(rgb) {
    const r = rgb[0];
    const g = rgb[1];
    let b = rgb[2];
    const h = convert.rgb.hsl(rgb)[0];
    const w = 1 / 255 * Math.min(r, Math.min(g, b));
    b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
    return [
        h,
        w * 100,
        b * 100
    ];
};
convert.rgb.cmyk = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const k = Math.min(1 - r, 1 - g, 1 - b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    return [
        c * 100,
        m * 100,
        y * 100,
        k * 100
    ];
};
function comparativeDistance(x, y) {
    /*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/ return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
}
convert.rgb.keyword = function(rgb) {
    const reversed = reverseKeywords[rgb];
    if (reversed) {
        return reversed;
    }
    let currentClosestDistance = Infinity;
    let currentClosestKeyword;
    for (const keyword of Object.keys(cssKeywords)){
        const value = cssKeywords[keyword];
        // Compute comparative distance
        const distance = comparativeDistance(rgb, value);
        // Check if its less, if so set as closest
        if (distance < currentClosestDistance) {
            currentClosestDistance = distance;
            currentClosestKeyword = keyword;
        }
    }
    return currentClosestKeyword;
};
convert.keyword.rgb = function(keyword) {
    return cssKeywords[keyword];
};
convert.rgb.xyz = function(rgb) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
    // Assume sRGB
    r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
    g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
    b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [
        x * 100,
        y * 100,
        z * 100
    ];
};
convert.rgb.lab = function(rgb) {
    const xyz = convert.rgb.xyz(rgb);
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return [
        l,
        a,
        b
    ];
};
convert.hsl.rgb = function(hsl) {
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    let t2;
    let t3;
    let val;
    if (s === 0) {
        val = l * 255;
        return [
            val,
            val,
            val
        ];
    }
    if (l < 0.5) {
        t2 = l * (1 + s);
    } else {
        t2 = l + s - l * s;
    }
    const t1 = 2 * l - t2;
    const rgb = [
        0,
        0,
        0
    ];
    for(let i = 0; i < 3; i++){
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
            t3++;
        }
        if (t3 > 1) {
            t3--;
        }
        if (6 * t3 < 1) {
            val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
            val = t2;
        } else if (3 * t3 < 2) {
            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
            val = t1;
        }
        rgb[i] = val * 255;
    }
    return rgb;
};
convert.hsl.hsv = function(hsl) {
    const h = hsl[0];
    let s = hsl[1] / 100;
    let l = hsl[2] / 100;
    let smin = s;
    const lmin = Math.max(l, 0.01);
    l *= 2;
    s *= l <= 1 ? l : 2 - l;
    smin *= lmin <= 1 ? lmin : 2 - lmin;
    const v = (l + s) / 2;
    const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
    return [
        h,
        sv * 100,
        v * 100
    ];
};
convert.hsv.rgb = function(hsv) {
    const h = hsv[0] / 60;
    const s = hsv[1] / 100;
    let v = hsv[2] / 100;
    const hi = Math.floor(h) % 6;
    const f = h - Math.floor(h);
    const p = 255 * v * (1 - s);
    const q = 255 * v * (1 - s * f);
    const t = 255 * v * (1 - s * (1 - f));
    v *= 255;
    switch(hi){
        case 0:
            return [
                v,
                t,
                p
            ];
        case 1:
            return [
                q,
                v,
                p
            ];
        case 2:
            return [
                p,
                v,
                t
            ];
        case 3:
            return [
                p,
                q,
                v
            ];
        case 4:
            return [
                t,
                p,
                v
            ];
        case 5:
            return [
                v,
                p,
                q
            ];
    }
};
convert.hsv.hsl = function(hsv) {
    const h = hsv[0];
    const s = hsv[1] / 100;
    const v = hsv[2] / 100;
    const vmin = Math.max(v, 0.01);
    let sl;
    let l;
    l = (2 - s) * v;
    const lmin = (2 - s) * vmin;
    sl = s * vmin;
    sl /= lmin <= 1 ? lmin : 2 - lmin;
    sl = sl || 0;
    l /= 2;
    return [
        h,
        sl * 100,
        l * 100
    ];
};
// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function(hwb) {
    const h = hwb[0] / 360;
    let wh = hwb[1] / 100;
    let bl = hwb[2] / 100;
    const ratio = wh + bl;
    let f;
    // Wh + bl cant be > 1
    if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
    }
    const i = Math.floor(6 * h);
    const v = 1 - bl;
    f = 6 * h - i;
    if ((i & 0x01) !== 0) {
        f = 1 - f;
    }
    const n = wh + f * (v - wh); // Linear interpolation
    let r;
    let g;
    let b;
    /* eslint-disable max-statements-per-line,no-multi-spaces */ switch(i){
        default:
        case 6:
        case 0:
            r = v;
            g = n;
            b = wh;
            break;
        case 1:
            r = n;
            g = v;
            b = wh;
            break;
        case 2:
            r = wh;
            g = v;
            b = n;
            break;
        case 3:
            r = wh;
            g = n;
            b = v;
            break;
        case 4:
            r = n;
            g = wh;
            b = v;
            break;
        case 5:
            r = v;
            g = wh;
            b = n;
            break;
    }
    /* eslint-enable max-statements-per-line,no-multi-spaces */ return [
        r * 255,
        g * 255,
        b * 255
    ];
};
convert.cmyk.rgb = function(cmyk) {
    const c = cmyk[0] / 100;
    const m = cmyk[1] / 100;
    const y = cmyk[2] / 100;
    const k = cmyk[3] / 100;
    const r = 1 - Math.min(1, c * (1 - k) + k);
    const g = 1 - Math.min(1, m * (1 - k) + k);
    const b = 1 - Math.min(1, y * (1 - k) + k);
    return [
        r * 255,
        g * 255,
        b * 255
    ];
};
convert.xyz.rgb = function(xyz) {
    const x = xyz[0] / 100;
    const y = xyz[1] / 100;
    const z = xyz[2] / 100;
    let r;
    let g;
    let b;
    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.2040 + z * 1.0570;
    // Assume sRGB
    r = r > 0.0031308 ? 1.055 * r ** (1.0 / 2.4) - 0.055 : r * 12.92;
    g = g > 0.0031308 ? 1.055 * g ** (1.0 / 2.4) - 0.055 : g * 12.92;
    b = b > 0.0031308 ? 1.055 * b ** (1.0 / 2.4) - 0.055 : b * 12.92;
    r = Math.min(Math.max(0, r), 1);
    g = Math.min(Math.max(0, g), 1);
    b = Math.min(Math.max(0, b), 1);
    return [
        r * 255,
        g * 255,
        b * 255
    ];
};
convert.xyz.lab = function(xyz) {
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 0.008856 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return [
        l,
        a,
        b
    ];
};
convert.lab.xyz = function(lab) {
    const l = lab[0];
    const a = lab[1];
    const b = lab[2];
    let x;
    let y;
    let z;
    y = (l + 16) / 116;
    x = a / 500 + y;
    z = y - b / 200;
    const y2 = y ** 3;
    const x2 = x ** 3;
    const z2 = z ** 3;
    y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
    x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
    z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;
    x *= 95.047;
    y *= 100;
    z *= 108.883;
    return [
        x,
        y,
        z
    ];
};
convert.lab.lch = function(lab) {
    const l = lab[0];
    const a = lab[1];
    const b = lab[2];
    let h;
    const hr = Math.atan2(b, a);
    h = hr * 360 / 2 / Math.PI;
    if (h < 0) {
        h += 360;
    }
    const c = Math.sqrt(a * a + b * b);
    return [
        l,
        c,
        h
    ];
};
convert.lch.lab = function(lch) {
    const l = lch[0];
    const c = lch[1];
    const h = lch[2];
    const hr = h / 360 * 2 * Math.PI;
    const a = c * Math.cos(hr);
    const b = c * Math.sin(hr);
    return [
        l,
        a,
        b
    ];
};
convert.rgb.ansi16 = function(args, saturation = null) {
    const [r, g, b] = args;
    let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization
    value = Math.round(value / 50);
    if (value === 0) {
        return 30;
    }
    let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
    if (value === 2) {
        ansi += 60;
    }
    return ansi;
};
convert.hsv.ansi16 = function(args) {
    // Optimization here; we already know the value and don't need to get
    // it converted for us.
    return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};
convert.rgb.ansi256 = function(args) {
    const r = args[0];
    const g = args[1];
    const b = args[2];
    // We use the extended greyscale palette here, with the exception of
    // black and white. normal palette only has 4 greyscale shades.
    if (r === g && g === b) {
        if (r < 8) {
            return 16;
        }
        if (r > 248) {
            return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
    }
    const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
    return ansi;
};
convert.ansi16.rgb = function(args) {
    let color = args % 10;
    // Handle greyscale
    if (color === 0 || color === 7) {
        if (args > 50) {
            color += 3.5;
        }
        color = color / 10.5 * 255;
        return [
            color,
            color,
            color
        ];
    }
    const mult = (~~(args > 50) + 1) * 0.5;
    const r = (color & 1) * mult * 255;
    const g = (color >> 1 & 1) * mult * 255;
    const b = (color >> 2 & 1) * mult * 255;
    return [
        r,
        g,
        b
    ];
};
convert.ansi256.rgb = function(args) {
    // Handle greyscale
    if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [
            c,
            c,
            c
        ];
    }
    args -= 16;
    let rem;
    const r = Math.floor(args / 36) / 5 * 255;
    const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
    const b = rem % 6 / 5 * 255;
    return [
        r,
        g,
        b
    ];
};
convert.rgb.hex = function(args) {
    const integer = ((Math.round(args[0]) & 0xFF) << 16) + ((Math.round(args[1]) & 0xFF) << 8) + (Math.round(args[2]) & 0xFF);
    const string = integer.toString(16).toUpperCase();
    return '000000'.substring(string.length) + string;
};
convert.hex.rgb = function(args) {
    const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match) {
        return [
            0,
            0,
            0
        ];
    }
    let colorString = match[0];
    if (match[0].length === 3) {
        colorString = colorString.split('').map((char)=>{
            return char + char;
        }).join('');
    }
    const integer = parseInt(colorString, 16);
    const r = integer >> 16 & 0xFF;
    const g = integer >> 8 & 0xFF;
    const b = integer & 0xFF;
    return [
        r,
        g,
        b
    ];
};
convert.rgb.hcg = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const max = Math.max(Math.max(r, g), b);
    const min = Math.min(Math.min(r, g), b);
    const chroma = max - min;
    let grayscale;
    let hue;
    if (chroma < 1) {
        grayscale = min / (1 - chroma);
    } else {
        grayscale = 0;
    }
    if (chroma <= 0) {
        hue = 0;
    } else if (max === r) {
        hue = (g - b) / chroma % 6;
    } else if (max === g) {
        hue = 2 + (b - r) / chroma;
    } else {
        hue = 4 + (r - g) / chroma;
    }
    hue /= 6;
    hue %= 1;
    return [
        hue * 360,
        chroma * 100,
        grayscale * 100
    ];
};
convert.hsl.hcg = function(hsl) {
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    const c = l < 0.5 ? 2.0 * s * l : 2.0 * s * (1.0 - l);
    let f = 0;
    if (c < 1.0) {
        f = (l - 0.5 * c) / (1.0 - c);
    }
    return [
        hsl[0],
        c * 100,
        f * 100
    ];
};
convert.hsv.hcg = function(hsv) {
    const s = hsv[1] / 100;
    const v = hsv[2] / 100;
    const c = s * v;
    let f = 0;
    if (c < 1.0) {
        f = (v - c) / (1 - c);
    }
    return [
        hsv[0],
        c * 100,
        f * 100
    ];
};
convert.hcg.rgb = function(hcg) {
    const h = hcg[0] / 360;
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    if (c === 0.0) {
        return [
            g * 255,
            g * 255,
            g * 255
        ];
    }
    const pure = [
        0,
        0,
        0
    ];
    const hi = h % 1 * 6;
    const v = hi % 1;
    const w = 1 - v;
    let mg = 0;
    /* eslint-disable max-statements-per-line */ switch(Math.floor(hi)){
        case 0:
            pure[0] = 1;
            pure[1] = v;
            pure[2] = 0;
            break;
        case 1:
            pure[0] = w;
            pure[1] = 1;
            pure[2] = 0;
            break;
        case 2:
            pure[0] = 0;
            pure[1] = 1;
            pure[2] = v;
            break;
        case 3:
            pure[0] = 0;
            pure[1] = w;
            pure[2] = 1;
            break;
        case 4:
            pure[0] = v;
            pure[1] = 0;
            pure[2] = 1;
            break;
        default:
            pure[0] = 1;
            pure[1] = 0;
            pure[2] = w;
    }
    /* eslint-enable max-statements-per-line */ mg = (1.0 - c) * g;
    return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
    ];
};
convert.hcg.hsv = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const v = c + g * (1.0 - c);
    let f = 0;
    if (v > 0.0) {
        f = c / v;
    }
    return [
        hcg[0],
        f * 100,
        v * 100
    ];
};
convert.hcg.hsl = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const l = g * (1.0 - c) + 0.5 * c;
    let s = 0;
    if (l > 0.0 && l < 0.5) {
        s = c / (2 * l);
    } else if (l >= 0.5 && l < 1.0) {
        s = c / (2 * (1 - l));
    }
    return [
        hcg[0],
        s * 100,
        l * 100
    ];
};
convert.hcg.hwb = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const v = c + g * (1.0 - c);
    return [
        hcg[0],
        (v - c) * 100,
        (1 - v) * 100
    ];
};
convert.hwb.hcg = function(hwb) {
    const w = hwb[1] / 100;
    const b = hwb[2] / 100;
    const v = 1 - b;
    const c = v - w;
    let g = 0;
    if (c < 1) {
        g = (v - c) / (1 - c);
    }
    return [
        hwb[0],
        c * 100,
        g * 100
    ];
};
convert.apple.rgb = function(apple) {
    return [
        apple[0] / 65535 * 255,
        apple[1] / 65535 * 255,
        apple[2] / 65535 * 255
    ];
};
convert.rgb.apple = function(rgb) {
    return [
        rgb[0] / 255 * 65535,
        rgb[1] / 255 * 65535,
        rgb[2] / 255 * 65535
    ];
};
convert.gray.rgb = function(args) {
    return [
        args[0] / 100 * 255,
        args[0] / 100 * 255,
        args[0] / 100 * 255
    ];
};
convert.gray.hsl = function(args) {
    return [
        0,
        0,
        args[0]
    ];
};
convert.gray.hsv = convert.gray.hsl;
convert.gray.hwb = function(gray) {
    return [
        0,
        100,
        gray[0]
    ];
};
convert.gray.cmyk = function(gray) {
    return [
        0,
        0,
        0,
        gray[0]
    ];
};
convert.gray.lab = function(gray) {
    return [
        gray[0],
        0,
        0
    ];
};
convert.gray.hex = function(gray) {
    const val = Math.round(gray[0] / 100 * 255) & 0xFF;
    const integer = (val << 16) + (val << 8) + val;
    const string = integer.toString(16).toUpperCase();
    return '000000'.substring(string.length) + string;
};
convert.rgb.gray = function(rgb) {
    const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
    return [
        val / 255 * 100
    ];
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/color-convert/route.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const conversions = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/color-convert/conversions.js [app-ssr] (ecmascript)");
/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/ function buildGraph() {
    const graph = {};
    // https://jsperf.com/object-keys-vs-for-in-with-closure/3
    const models = Object.keys(conversions);
    for(let len = models.length, i = 0; i < len; i++){
        graph[models[i]] = {
            // http://jsperf.com/1-vs-infinity
            // micro-opt, but this is simple.
            distance: -1,
            parent: null
        };
    }
    return graph;
}
// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
    const graph = buildGraph();
    const queue = [
        fromModel
    ]; // Unshift -> queue -> pop
    graph[fromModel].distance = 0;
    while(queue.length){
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for(let len = adjacents.length, i = 0; i < len; i++){
            const adjacent = adjacents[i];
            const node = graph[adjacent];
            if (node.distance === -1) {
                node.distance = graph[current].distance + 1;
                node.parent = current;
                queue.unshift(adjacent);
            }
        }
    }
    return graph;
}
function link(from, to) {
    return function(args) {
        return to(from(args));
    };
}
function wrapConversion(toModel, graph) {
    const path = [
        graph[toModel].parent,
        toModel
    ];
    let fn = conversions[graph[toModel].parent][toModel];
    let cur = graph[toModel].parent;
    while(graph[cur].parent){
        path.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
    }
    fn.conversion = path;
    return fn;
}
module.exports = function(fromModel) {
    const graph = deriveBFS(fromModel);
    const conversion = {};
    const models = Object.keys(graph);
    for(let len = models.length, i = 0; i < len; i++){
        const toModel = models[i];
        const node = graph[toModel];
        if (node.parent === null) {
            continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
    }
    return conversion;
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/color-convert/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const conversions = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/color-convert/conversions.js [app-ssr] (ecmascript)");
const route = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/color-convert/route.js [app-ssr] (ecmascript)");
const convert = {};
const models = Object.keys(conversions);
function wrapRaw(fn) {
    const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === undefined || arg0 === null) {
            return arg0;
        }
        if (arg0.length > 1) {
            args = arg0;
        }
        return fn(args);
    };
    // Preserve .conversion property if there is one
    if ('conversion' in fn) {
        wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
}
function wrapRounded(fn) {
    const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === undefined || arg0 === null) {
            return arg0;
        }
        if (arg0.length > 1) {
            args = arg0;
        }
        const result = fn(args);
        // We're assuming the result is an array here.
        // see notice in conversions.js; don't use box types
        // in conversion functions.
        if (typeof result === 'object') {
            for(let len = result.length, i = 0; i < len; i++){
                result[i] = Math.round(result[i]);
            }
        }
        return result;
    };
    // Preserve .conversion property if there is one
    if ('conversion' in fn) {
        wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
}
models.forEach((fromModel)=>{
    convert[fromModel] = {};
    Object.defineProperty(convert[fromModel], 'channels', {
        value: conversions[fromModel].channels
    });
    Object.defineProperty(convert[fromModel], 'labels', {
        value: conversions[fromModel].labels
    });
    const routes = route(fromModel);
    const routeModels = Object.keys(routes);
    routeModels.forEach((toModel)=>{
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
    });
});
module.exports = convert;
}),
"[project]/Desktop/Inventory/my-app/node_modules/color/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

const colorString = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/color-string/index.js [app-ssr] (ecmascript)");
const convert = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/color-convert/index.js [app-ssr] (ecmascript)");
const skippedModels = [
    // To be honest, I don't really feel like keyword belongs in color convert, but eh.
    'keyword',
    // Gray conflicts with some method names, and has its own method defined.
    'gray',
    // Shouldn't really be in color-convert either...
    'hex'
];
const hashedModelKeys = {};
for (const model of Object.keys(convert)){
    hashedModelKeys[[
        ...convert[model].labels
    ].sort().join('')] = model;
}
const limiters = {};
function Color(object, model) {
    if (!(this instanceof Color)) {
        return new Color(object, model);
    }
    if (model && model in skippedModels) {
        model = null;
    }
    if (model && !(model in convert)) {
        throw new Error('Unknown model: ' + model);
    }
    let i;
    let channels;
    if (object == null) {
        this.model = 'rgb';
        this.color = [
            0,
            0,
            0
        ];
        this.valpha = 1;
    } else if (object instanceof Color) {
        this.model = object.model;
        this.color = [
            ...object.color
        ];
        this.valpha = object.valpha;
    } else if (typeof object === 'string') {
        const result = colorString.get(object);
        if (result === null) {
            throw new Error('Unable to parse color from string: ' + object);
        }
        this.model = result.model;
        channels = convert[this.model].channels;
        this.color = result.value.slice(0, channels);
        this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
    } else if (object.length > 0) {
        this.model = model || 'rgb';
        channels = convert[this.model].channels;
        const newArray = Array.prototype.slice.call(object, 0, channels);
        this.color = zeroArray(newArray, channels);
        this.valpha = typeof object[channels] === 'number' ? object[channels] : 1;
    } else if (typeof object === 'number') {
        // This is always RGB - can be converted later on.
        this.model = 'rgb';
        this.color = [
            object >> 16 & 0xFF,
            object >> 8 & 0xFF,
            object & 0xFF
        ];
        this.valpha = 1;
    } else {
        this.valpha = 1;
        const keys = Object.keys(object);
        if ('alpha' in object) {
            keys.splice(keys.indexOf('alpha'), 1);
            this.valpha = typeof object.alpha === 'number' ? object.alpha : 0;
        }
        const hashedKeys = keys.sort().join('');
        if (!(hashedKeys in hashedModelKeys)) {
            throw new Error('Unable to parse color from object: ' + JSON.stringify(object));
        }
        this.model = hashedModelKeys[hashedKeys];
        const { labels } = convert[this.model];
        const color = [];
        for(i = 0; i < labels.length; i++){
            color.push(object[labels[i]]);
        }
        this.color = zeroArray(color);
    }
    // Perform limitations (clamping, etc.)
    if (limiters[this.model]) {
        channels = convert[this.model].channels;
        for(i = 0; i < channels; i++){
            const limit = limiters[this.model][i];
            if (limit) {
                this.color[i] = limit(this.color[i]);
            }
        }
    }
    this.valpha = Math.max(0, Math.min(1, this.valpha));
    if (Object.freeze) {
        Object.freeze(this);
    }
}
Color.prototype = {
    toString () {
        return this.string();
    },
    toJSON () {
        return this[this.model]();
    },
    string (places) {
        let self = this.model in colorString.to ? this : this.rgb();
        self = self.round(typeof places === 'number' ? places : 1);
        const args = self.valpha === 1 ? self.color : [
            ...self.color,
            this.valpha
        ];
        return colorString.to[self.model](args);
    },
    percentString (places) {
        const self = this.rgb().round(typeof places === 'number' ? places : 1);
        const args = self.valpha === 1 ? self.color : [
            ...self.color,
            this.valpha
        ];
        return colorString.to.rgb.percent(args);
    },
    array () {
        return this.valpha === 1 ? [
            ...this.color
        ] : [
            ...this.color,
            this.valpha
        ];
    },
    object () {
        const result = {};
        const { channels } = convert[this.model];
        const { labels } = convert[this.model];
        for(let i = 0; i < channels; i++){
            result[labels[i]] = this.color[i];
        }
        if (this.valpha !== 1) {
            result.alpha = this.valpha;
        }
        return result;
    },
    unitArray () {
        const rgb = this.rgb().color;
        rgb[0] /= 255;
        rgb[1] /= 255;
        rgb[2] /= 255;
        if (this.valpha !== 1) {
            rgb.push(this.valpha);
        }
        return rgb;
    },
    unitObject () {
        const rgb = this.rgb().object();
        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        if (this.valpha !== 1) {
            rgb.alpha = this.valpha;
        }
        return rgb;
    },
    round (places) {
        places = Math.max(places || 0, 0);
        return new Color([
            ...this.color.map(roundToPlace(places)),
            this.valpha
        ], this.model);
    },
    alpha (value) {
        if (value !== undefined) {
            return new Color([
                ...this.color,
                Math.max(0, Math.min(1, value))
            ], this.model);
        }
        return this.valpha;
    },
    // Rgb
    red: getset('rgb', 0, maxfn(255)),
    green: getset('rgb', 1, maxfn(255)),
    blue: getset('rgb', 2, maxfn(255)),
    hue: getset([
        'hsl',
        'hsv',
        'hsl',
        'hwb',
        'hcg'
    ], 0, (value)=>(value % 360 + 360) % 360),
    saturationl: getset('hsl', 1, maxfn(100)),
    lightness: getset('hsl', 2, maxfn(100)),
    saturationv: getset('hsv', 1, maxfn(100)),
    value: getset('hsv', 2, maxfn(100)),
    chroma: getset('hcg', 1, maxfn(100)),
    gray: getset('hcg', 2, maxfn(100)),
    white: getset('hwb', 1, maxfn(100)),
    wblack: getset('hwb', 2, maxfn(100)),
    cyan: getset('cmyk', 0, maxfn(100)),
    magenta: getset('cmyk', 1, maxfn(100)),
    yellow: getset('cmyk', 2, maxfn(100)),
    black: getset('cmyk', 3, maxfn(100)),
    x: getset('xyz', 0, maxfn(95.047)),
    y: getset('xyz', 1, maxfn(100)),
    z: getset('xyz', 2, maxfn(108.833)),
    l: getset('lab', 0, maxfn(100)),
    a: getset('lab', 1),
    b: getset('lab', 2),
    keyword (value) {
        if (value !== undefined) {
            return new Color(value);
        }
        return convert[this.model].keyword(this.color);
    },
    hex (value) {
        if (value !== undefined) {
            return new Color(value);
        }
        return colorString.to.hex(this.rgb().round().color);
    },
    hexa (value) {
        if (value !== undefined) {
            return new Color(value);
        }
        const rgbArray = this.rgb().round().color;
        let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
        if (alphaHex.length === 1) {
            alphaHex = '0' + alphaHex;
        }
        return colorString.to.hex(rgbArray) + alphaHex;
    },
    rgbNumber () {
        const rgb = this.rgb().color;
        return (rgb[0] & 0xFF) << 16 | (rgb[1] & 0xFF) << 8 | rgb[2] & 0xFF;
    },
    luminosity () {
        // http://www.w3.org/TR/WCAG20/#relativeluminancedef
        const rgb = this.rgb().color;
        const lum = [];
        for (const [i, element] of rgb.entries()){
            const chan = element / 255;
            lum[i] = chan <= 0.04045 ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
        }
        return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    },
    contrast (color2) {
        // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
        const lum1 = this.luminosity();
        const lum2 = color2.luminosity();
        if (lum1 > lum2) {
            return (lum1 + 0.05) / (lum2 + 0.05);
        }
        return (lum2 + 0.05) / (lum1 + 0.05);
    },
    level (color2) {
        // https://www.w3.org/TR/WCAG/#contrast-enhanced
        const contrastRatio = this.contrast(color2);
        if (contrastRatio >= 7) {
            return 'AAA';
        }
        return contrastRatio >= 4.5 ? 'AA' : '';
    },
    isDark () {
        // YIQ equation from http://24ways.org/2010/calculating-color-contrast
        const rgb = this.rgb().color;
        const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 10000;
        return yiq < 128;
    },
    isLight () {
        return !this.isDark();
    },
    negate () {
        const rgb = this.rgb();
        for(let i = 0; i < 3; i++){
            rgb.color[i] = 255 - rgb.color[i];
        }
        return rgb;
    },
    lighten (ratio) {
        const hsl = this.hsl();
        hsl.color[2] += hsl.color[2] * ratio;
        return hsl;
    },
    darken (ratio) {
        const hsl = this.hsl();
        hsl.color[2] -= hsl.color[2] * ratio;
        return hsl;
    },
    saturate (ratio) {
        const hsl = this.hsl();
        hsl.color[1] += hsl.color[1] * ratio;
        return hsl;
    },
    desaturate (ratio) {
        const hsl = this.hsl();
        hsl.color[1] -= hsl.color[1] * ratio;
        return hsl;
    },
    whiten (ratio) {
        const hwb = this.hwb();
        hwb.color[1] += hwb.color[1] * ratio;
        return hwb;
    },
    blacken (ratio) {
        const hwb = this.hwb();
        hwb.color[2] += hwb.color[2] * ratio;
        return hwb;
    },
    grayscale () {
        // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
        const rgb = this.rgb().color;
        const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
        return Color.rgb(value, value, value);
    },
    fade (ratio) {
        return this.alpha(this.valpha - this.valpha * ratio);
    },
    opaquer (ratio) {
        return this.alpha(this.valpha + this.valpha * ratio);
    },
    rotate (degrees) {
        const hsl = this.hsl();
        let hue = hsl.color[0];
        hue = (hue + degrees) % 360;
        hue = hue < 0 ? 360 + hue : hue;
        hsl.color[0] = hue;
        return hsl;
    },
    mix (mixinColor, weight) {
        // Ported from sass implementation in C
        // https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
        if (!mixinColor || !mixinColor.rgb) {
            throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
        }
        const color1 = mixinColor.rgb();
        const color2 = this.rgb();
        const p = weight === undefined ? 0.5 : weight;
        const w = 2 * p - 1;
        const a = color1.alpha() - color2.alpha();
        const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
        const w2 = 1 - w1;
        return Color.rgb(w1 * color1.red() + w2 * color2.red(), w1 * color1.green() + w2 * color2.green(), w1 * color1.blue() + w2 * color2.blue(), color1.alpha() * p + color2.alpha() * (1 - p));
    }
};
// Model conversion methods and static constructors
for (const model of Object.keys(convert)){
    if (skippedModels.includes(model)) {
        continue;
    }
    const { channels } = convert[model];
    // Conversion methods
    Color.prototype[model] = function(...args) {
        if (this.model === model) {
            return new Color(this);
        }
        if (args.length > 0) {
            return new Color(args, model);
        }
        return new Color([
            ...assertArray(convert[this.model][model].raw(this.color)),
            this.valpha
        ], model);
    };
    // 'static' construction methods
    Color[model] = function(...args) {
        let color = args[0];
        if (typeof color === 'number') {
            color = zeroArray(args, channels);
        }
        return new Color(color, model);
    };
}
function roundTo(number, places) {
    return Number(number.toFixed(places));
}
function roundToPlace(places) {
    return function(number) {
        return roundTo(number, places);
    };
}
function getset(model, channel, modifier) {
    model = Array.isArray(model) ? model : [
        model
    ];
    for (const m of model){
        (limiters[m] || (limiters[m] = []))[channel] = modifier;
    }
    model = model[0];
    return function(value) {
        let result;
        if (value !== undefined) {
            if (modifier) {
                value = modifier(value);
            }
            result = this[model]();
            result.color[channel] = value;
            return result;
        }
        result = this[model]().color[channel];
        if (modifier) {
            result = modifier(result);
        }
        return result;
    };
}
function maxfn(max) {
    return function(v) {
        return Math.max(0, Math.min(max, v));
    };
}
function assertArray(value) {
    return Array.isArray(value) ? value : [
        value
    ];
}
function zeroArray(array, length) {
    for(let i = 0; i < length; i++){
        if (typeof array[i] !== 'number') {
            array[i] = 0;
        }
    }
    return array;
}
module.exports = Color;
}),
"[project]/Desktop/Inventory/my-app/node_modules/tslib/tslib.es6.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ /* global Reflect, Promise, SuppressedError, Symbol, Iterator */ __turbopack_context__.s([
    "__addDisposableResource",
    ()=>__addDisposableResource,
    "__assign",
    ()=>__assign,
    "__asyncDelegator",
    ()=>__asyncDelegator,
    "__asyncGenerator",
    ()=>__asyncGenerator,
    "__asyncValues",
    ()=>__asyncValues,
    "__await",
    ()=>__await,
    "__awaiter",
    ()=>__awaiter,
    "__classPrivateFieldGet",
    ()=>__classPrivateFieldGet,
    "__classPrivateFieldIn",
    ()=>__classPrivateFieldIn,
    "__classPrivateFieldSet",
    ()=>__classPrivateFieldSet,
    "__createBinding",
    ()=>__createBinding,
    "__decorate",
    ()=>__decorate,
    "__disposeResources",
    ()=>__disposeResources,
    "__esDecorate",
    ()=>__esDecorate,
    "__exportStar",
    ()=>__exportStar,
    "__extends",
    ()=>__extends,
    "__generator",
    ()=>__generator,
    "__importDefault",
    ()=>__importDefault,
    "__importStar",
    ()=>__importStar,
    "__makeTemplateObject",
    ()=>__makeTemplateObject,
    "__metadata",
    ()=>__metadata,
    "__param",
    ()=>__param,
    "__propKey",
    ()=>__propKey,
    "__read",
    ()=>__read,
    "__rest",
    ()=>__rest,
    "__rewriteRelativeImportExtension",
    ()=>__rewriteRelativeImportExtension,
    "__runInitializers",
    ()=>__runInitializers,
    "__setFunctionName",
    ()=>__setFunctionName,
    "__spread",
    ()=>__spread,
    "__spreadArray",
    ()=>__spreadArray,
    "__spreadArrays",
    ()=>__spreadArrays,
    "__values",
    ()=>__values,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(d, b) {
        d.__proto__ = b;
    } || function(d, b) {
        for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };
    return extendStatics(d, b);
};
function __extends(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function __rest(s, e) {
    var t = {};
    for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for(var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++){
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
}
function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) {
        if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
        return f;
    }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for(var i = decorators.length - 1; i >= 0; i--){
        var context = {};
        for(var p in contextIn)context[p] = p === "access" ? {} : contextIn[p];
        for(var p in contextIn.access)context.access[p] = contextIn.access[p];
        context.addInitializer = function(f) {
            if (done) throw new TypeError("Cannot add initializers after decoration has completed");
            extraInitializers.push(accept(f || null));
        };
        var result = (0, decorators[i])(kind === "accessor" ? {
            get: descriptor.get,
            set: descriptor.set
        } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        } else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
;
function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for(var i = 0; i < initializers.length; i++){
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
}
;
function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
}
;
function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", {
        configurable: true,
        value: prefix ? "".concat(prefix, " ", name) : name
    });
}
;
function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var __createBinding = Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
};
function __exportStar(m, o) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
}
function __spread() {
    for(var ar = [], i = 0; i < arguments.length; i++)ar = ar.concat(__read(arguments[i]));
    return ar;
}
function __spreadArrays() {
    for(var s = 0, i = 0, il = arguments.length; i < il; i++)s += arguments[i].length;
    for(var r = Array(s), k = 0, i = 0; i < il; i++)for(var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)r[k] = a[j];
    return r;
}
function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
        return this;
    }, i;
    //TURBOPACK unreachable
    ;
    function awaitReturn(f) {
        return function(v) {
            return Promise.resolve(v).then(f, reject);
        };
    }
    function verb(n, f) {
        if (g[n]) {
            i[n] = function(v) {
                return new Promise(function(a, b) {
                    q.push([
                        n,
                        v,
                        a,
                        b
                    ]) > 1 || resume(n, v);
                });
            };
            if (f) i[n] = f(i[n]);
        }
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
}
function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function(e) {
        throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
        return this;
    }, i;
    //TURBOPACK unreachable
    ;
    function verb(n, f) {
        i[n] = o[n] ? function(v) {
            return (p = !p) ? {
                value: __await(o[n](v)),
                done: false
            } : f ? f(v) : v;
        } : f;
    }
}
function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
        return this;
    }, i);
    //TURBOPACK unreachable
    ;
    function verb(n) {
        i[n] = o[n] && function(v) {
            return new Promise(function(resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
        };
    }
    function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function(v) {
            resolve({
                value: v,
                done: d
            });
        }, reject);
    }
}
function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", {
            value: raw
        });
    } else {
        cooked.raw = raw;
    }
    return cooked;
}
;
var __setModuleDefault = Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
};
var ownKeys = function(o) {
    ownKeys = Object.getOwnPropertyNames || function(o) {
        var ar = [];
        for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
        return ar;
    };
    return ownKeys(o);
};
function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
    }
    __setModuleDefault(result, mod);
    return result;
}
function __importDefault(mod) {
    return mod && mod.__esModule ? mod : {
        default: mod
    };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() {
            try {
                inner.call(this);
            } catch (e) {
                return Promise.reject(e);
            }
        };
        env.stack.push({
            value: value,
            dispose: dispose,
            async: async
        });
    } else if (async) {
        env.stack.push({
            async: true
        });
    }
    return value;
}
var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function __disposeResources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    var r, s = 0;
    function next() {
        while(r = env.stack.pop()){
            try {
                if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                if (r.dispose) {
                    var result = r.dispose.call(r.value);
                    if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
                        fail(e);
                        return next();
                    });
                } else s |= 1;
            } catch (e) {
                fail(e);
            }
        }
        if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        if (env.hasError) throw env.error;
    }
    return next();
}
function __rewriteRelativeImportExtension(path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
        });
    }
    return path;
}
const __TURBOPACK__default__export__ = {
    __extends,
    __assign,
    __rest,
    __decorate,
    __param,
    __esDecorate,
    __runInitializers,
    __propKey,
    __setFunctionName,
    __metadata,
    __awaiter,
    __generator,
    __createBinding,
    __exportStar,
    __values,
    __read,
    __spread,
    __spreadArrays,
    __spreadArray,
    __await,
    __asyncGenerator,
    __asyncDelegator,
    __asyncValues,
    __makeTemplateObject,
    __importStar,
    __importDefault,
    __classPrivateFieldGet,
    __classPrivateFieldSet,
    __classPrivateFieldIn,
    __addDisposableResource,
    __disposeResources,
    __rewriteRelativeImportExtension
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/@emotion/memoize/dist/emotion-memoize.esm.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>memoize
]);
function memoize(fn) {
    var cache = Object.create(null);
    return function(arg) {
        if (cache[arg] === undefined) cache[arg] = fn(arg);
        return cache[arg];
    };
}
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>isPropValid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$emotion$2f$memoize$2f$dist$2f$emotion$2d$memoize$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@emotion/memoize/dist/emotion-memoize.esm.js [app-ssr] (ecmascript)");
;
var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23
var isPropValid = /* #__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$emotion$2f$memoize$2f$dist$2f$emotion$2d$memoize$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(function(prop) {
    return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
});
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/@emotion/unitless/dist/emotion-unitless.esm.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>unitlessKeys
]);
var unitlessKeys = {
    animationIterationCount: 1,
    aspectRatio: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
};
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/shallowequal/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

//
module.exports = function shallowEqual(objA, objB, compare, compareContext) {
    var ret = compare ? compare.call(compareContext, objA, objB) : void 0;
    if (ret !== void 0) {
        return !!ret;
    }
    if (objA === objB) {
        return true;
    }
    if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    // Test for A's keys different from B.
    for(var idx = 0; idx < keysA.length; idx++){
        var key = keysA[idx];
        if (!bHasOwnProperty(key)) {
            return false;
        }
        var valueA = objA[key];
        var valueB = objB[key];
        ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;
        if (ret === false || ret === void 0 && valueA !== valueB) {
            return false;
        }
    }
    return true;
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Enum.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CHARSET",
    ()=>CHARSET,
    "COMMENT",
    ()=>COMMENT,
    "COUNTER_STYLE",
    ()=>COUNTER_STYLE,
    "DECLARATION",
    ()=>DECLARATION,
    "DOCUMENT",
    ()=>DOCUMENT,
    "FONT_FACE",
    ()=>FONT_FACE,
    "FONT_FEATURE_VALUES",
    ()=>FONT_FEATURE_VALUES,
    "IMPORT",
    ()=>IMPORT,
    "KEYFRAMES",
    ()=>KEYFRAMES,
    "LAYER",
    ()=>LAYER,
    "MEDIA",
    ()=>MEDIA,
    "MOZ",
    ()=>MOZ,
    "MS",
    ()=>MS,
    "NAMESPACE",
    ()=>NAMESPACE,
    "PAGE",
    ()=>PAGE,
    "RULESET",
    ()=>RULESET,
    "SCOPE",
    ()=>SCOPE,
    "SUPPORTS",
    ()=>SUPPORTS,
    "VIEWPORT",
    ()=>VIEWPORT,
    "WEBKIT",
    ()=>WEBKIT
]);
var MS = '-ms-';
var MOZ = '-moz-';
var WEBKIT = '-webkit-';
var COMMENT = 'comm';
var RULESET = 'rule';
var DECLARATION = 'decl';
var PAGE = '@page';
var MEDIA = '@media';
var IMPORT = '@import';
var CHARSET = '@charset';
var VIEWPORT = '@viewport';
var SUPPORTS = '@supports';
var DOCUMENT = '@document';
var NAMESPACE = '@namespace';
var KEYFRAMES = '@keyframes';
var FONT_FACE = '@font-face';
var COUNTER_STYLE = '@counter-style';
var FONT_FEATURE_VALUES = '@font-feature-values';
var LAYER = '@layer';
var SCOPE = '@scope';
}),
"[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Utility.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @param {number}
 * @return {number}
 */ __turbopack_context__.s([
    "abs",
    ()=>abs,
    "append",
    ()=>append,
    "assign",
    ()=>assign,
    "charat",
    ()=>charat,
    "combine",
    ()=>combine,
    "filter",
    ()=>filter,
    "from",
    ()=>from,
    "hash",
    ()=>hash,
    "indexof",
    ()=>indexof,
    "match",
    ()=>match,
    "replace",
    ()=>replace,
    "sizeof",
    ()=>sizeof,
    "strlen",
    ()=>strlen,
    "substr",
    ()=>substr,
    "trim",
    ()=>trim
]);
var abs = Math.abs;
var from = String.fromCharCode;
var assign = Object.assign;
function hash(value, length) {
    return charat(value, 0) ^ 45 ? (((length << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
}
function trim(value) {
    return value.trim();
}
function match(value, pattern) {
    return (value = pattern.exec(value)) ? value[0] : value;
}
function replace(value, pattern, replacement) {
    return value.replace(pattern, replacement);
}
function indexof(value, search, position) {
    return value.indexOf(search, position);
}
function charat(value, index) {
    return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
    return value.slice(begin, end);
}
function strlen(value) {
    return value.length;
}
function sizeof(value) {
    return value.length;
}
function append(value, array) {
    return array.push(value), value;
}
function combine(array, callback) {
    return array.map(callback).join('');
}
function filter(array, pattern) {
    return array.filter(function(value) {
        return !match(value, pattern);
    });
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Tokenizer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "alloc",
    ()=>alloc,
    "caret",
    ()=>caret,
    "char",
    ()=>char,
    "character",
    ()=>character,
    "characters",
    ()=>characters,
    "column",
    ()=>column,
    "commenter",
    ()=>commenter,
    "copy",
    ()=>copy,
    "dealloc",
    ()=>dealloc,
    "delimit",
    ()=>delimit,
    "delimiter",
    ()=>delimiter,
    "escaping",
    ()=>escaping,
    "identifier",
    ()=>identifier,
    "length",
    ()=>length,
    "lift",
    ()=>lift,
    "line",
    ()=>line,
    "next",
    ()=>next,
    "node",
    ()=>node,
    "peek",
    ()=>peek,
    "position",
    ()=>position,
    "prev",
    ()=>prev,
    "slice",
    ()=>slice,
    "token",
    ()=>token,
    "tokenize",
    ()=>tokenize,
    "tokenizer",
    ()=>tokenizer,
    "whitespace",
    ()=>whitespace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Utility.js [app-ssr] (ecmascript)");
;
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = '';
function node(value, root, parent, type, props, children, length, siblings) {
    return {
        value: value,
        root: root,
        parent: parent,
        type: type,
        props: props,
        children: children,
        line: line,
        column: column,
        length: length,
        return: '',
        siblings: siblings
    };
}
function copy(root, props) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assign"])(node('', null, null, '', null, null, 0, root.siblings), root, {
        length: -root.length
    }, props);
}
function lift(root) {
    while(root.root)root = copy(root.root, {
        children: [
            root
        ]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["append"])(root, root.siblings);
}
function char() {
    return character;
}
function prev() {
    character = position > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(characters, --position) : 0;
    if (column--, character === 10) column = 1, line--;
    return character;
}
function next() {
    character = position < length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(characters, position++) : 0;
    if (column++, character === 10) column = 1, line++;
    return character;
}
function peek() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(characters, position);
}
function caret() {
    return position;
}
function slice(begin, end) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["substr"])(characters, begin, end);
}
function token(type) {
    switch(type){
        // \0 \t \n \r \s whitespace token
        case 0:
        case 9:
        case 10:
        case 13:
        case 32:
            return 5;
        // ! + , / > @ ~ isolate token
        case 33:
        case 43:
        case 44:
        case 47:
        case 62:
        case 64:
        case 126:
        // ; { } breakpoint token
        case 59:
        case 123:
        case 125:
            return 4;
        // : accompanied token
        case 58:
            return 3;
        // " ' ( [ opening delimit token
        case 34:
        case 39:
        case 40:
        case 91:
            return 2;
        // ) ] closing delimit token
        case 41:
        case 93:
            return 1;
    }
    return 0;
}
function alloc(value) {
    return line = column = 1, length = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(characters = value), position = 0, [];
}
function dealloc(value) {
    return characters = '', value;
}
function delimit(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trim"])(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function tokenize(value) {
    return dealloc(tokenizer(alloc(value)));
}
function whitespace(type) {
    while(character = peek())if (character < 33) next();
    else break;
    return token(type) > 2 || token(character) > 3 ? '' : ' ';
}
function tokenizer(children) {
    while(next())switch(token(character)){
        case 0:
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["append"])(identifier(position - 1), children);
            break;
        case 2:
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["append"])(delimit(character), children);
            break;
        default:
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["append"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["from"])(character), children);
    }
    return children;
}
function escaping(index, count) {
    while(--count && next())// not 0-9 A-F a-f
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97) break;
    return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
    while(next())switch(character){
        // ] ) " '
        case type:
            return position;
        // " '
        case 34:
        case 39:
            if (type !== 34 && type !== 39) delimiter(character);
            break;
        // (
        case 40:
            if (type === 41) delimiter(type);
            break;
        // \
        case 92:
            next();
            break;
    }
    return position;
}
function commenter(type, index) {
    while(next())// //
    if (type + character === 47 + 10) break;
    else if (type + character === 42 + 42 && peek() === 47) break;
    return '/*' + slice(index, position - 1) + '*' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["from"])(type === 47 ? type : next());
}
function identifier(index) {
    while(!token(peek()))next();
    return slice(index, position);
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Serializer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "serialize",
    ()=>serialize,
    "stringify",
    ()=>stringify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Enum.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Utility.js [app-ssr] (ecmascript)");
;
;
function serialize(children, callback) {
    var output = '';
    for(var i = 0; i < children.length; i++)output += callback(children[i], i, children, callback) || '';
    return output;
}
function stringify(element, index, children, callback) {
    switch(element.type){
        case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAYER"]:
            if (element.children.length) break;
        case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IMPORT"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DECLARATION"]:
            return element.return = element.return || element.value;
        case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMENT"]:
            return '';
        case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEYFRAMES"]:
            return element.return = element.value + '{' + serialize(element.children, callback) + '}';
        case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULESET"]:
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(element.value = element.props.join(','))) return '';
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(children = serialize(element.children, callback)) ? element.return = element.value + '{' + children + '}' : '';
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Prefixer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prefix",
    ()=>prefix
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Enum.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Utility.js [app-ssr] (ecmascript)");
;
;
function prefix(value, length, children) {
    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hash"])(value, length)){
        // color-adjust
        case 5103:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + 'print-' + value + value;
        // animation, animation-(delay|direction|duration|fill-mode|iteration-count|name|play-state|timing-function)
        case 5737:
        case 4201:
        case 3177:
        case 3433:
        case 1641:
        case 4457:
        case 2921:
        // text-decoration, filter, clip-path, backface-visibility, column, box-decoration-break
        case 5572:
        case 6356:
        case 5844:
        case 3191:
        case 6645:
        case 3005:
        // mask, mask-image, mask-(mode|clip|size), mask-(repeat|origin), mask-position, mask-composite,
        case 6391:
        case 5879:
        case 5623:
        case 6135:
        case 4599:
        case 4855:
        // background-clip, columns, column-(count|fill|gap|rule|rule-color|rule-style|rule-width|span|width)
        case 4215:
        case 6389:
        case 5109:
        case 5365:
        case 5621:
        case 3829:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + value;
        // tab-size
        case 4789:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOZ"] + value + value;
        // appearance, user-select, transform, hyphens, text-size-adjust
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOZ"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + value + value;
        // writing-mode
        case 5936:
            switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, length + 11)){
                // vertical-l(r)
                case 114:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /[svh]\w+-[tblr]{2}/, 'tb') + value;
                // vertical-r(l)
                case 108:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /[svh]\w+-[tblr]{2}/, 'tb-rl') + value;
                // horizontal(-)tb
                case 45:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /[svh]\w+-[tblr]{2}/, 'lr') + value;
            }
        // flex, flex-direction, scroll-snap-type, writing-mode
        case 6828:
        case 4268:
        case 2903:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + value + value;
        // order
        case 6165:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'flex-' + value + value;
        // align-items
        case 5187:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /(\w+).+(:[^]+)/, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + 'box-$1$2' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'flex-$1$2') + value;
        // align-self
        case 5443:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'flex-item-' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /flex-|-self/g, '') + (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(value, /flex-|baseline/) ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'grid-row-' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /flex-|-self/g, '') : '') + value;
        // align-content
        case 4675:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'flex-line-pack' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /align-content|flex-|-self/g, '') + value;
        // flex-shrink
        case 5548:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, 'shrink', 'negative') + value;
        // flex-basis
        case 5292:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, 'basis', 'preferred-size') + value;
        // flex-grow
        case 6060:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + 'box-' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, '-grow', '') + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, 'grow', 'positive') + value;
        // transition
        case 4554:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /([^-])(transform)/g, '$1' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + '$2') + value;
        // cursor
        case 6187:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /(zoom-|grab)/, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + '$1'), /(image-set)/, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + '$1'), value, '') + value;
        // background, background-image
        case 5495:
        case 3959:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /(image-set\([^]*)/, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + '$1' + '$`$1');
        // justify-content
        case 4968:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /(.+:)(flex-)?(.*)/, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + 'box-pack:$3' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'flex-pack:$3'), /s.+-b[^;]+/, 'justify') + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + value + value;
        // justify-self
        case 4200:
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(value, /flex-|baseline/)) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'grid-column-align' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["substr"])(value, length) + value;
            break;
        // grid-template-(columns|rows)
        case 2592:
        case 3360:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, 'template-', '') + value;
        // grid-(row|column)-start
        case 4384:
        case 3616:
            if (children && children.some(function(element, index) {
                return length = index, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(element.props, /grid-\w+-end/);
            })) {
                return ~(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexof"])(value + (children = children[length].value), 'span', 0) ? value : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, '-start', '') + value + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'grid-row-span:' + (~(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexof"])(children, 'span', 0) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(children, /\d+/) : +(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(children, /\d+/) - +(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(value, /\d+/)) + ';';
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, '-start', '') + value;
        // grid-(row|column)-end
        case 4896:
        case 4128:
            return children && children.some(function(element) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(element.props, /grid-\w+-start/);
            }) ? value : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, '-end', '-span'), 'span ', '') + value;
        // (margin|padding)-inline-(start|end)
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /(.+)-inline(.+)/, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + '$1$2') + value;
        // (min|max)?(width|height|inline-size|block-size)
        case 8116:
        case 7059:
        case 5753:
        case 5535:
        case 5445:
        case 5701:
        case 4933:
        case 4677:
        case 5533:
        case 5789:
        case 5021:
        case 4765:
            // stretch, max-content, min-content, fill-available
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(value) - 1 - length > 6) switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, length + 1)){
                // (m)ax-content, (m)in-content
                case 109:
                    // -
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, length + 4) !== 45) break;
                // (f)ill-available, (f)it-content
                case 102:
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /(.+:)(.+)-([^]+)/, '$1' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + '$2-$3' + '$1' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOZ"] + ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, length + 3) == 108 ? '$3' : '$2-$3')) + value;
                // (s)tretch
                case 115:
                    return ~(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexof"])(value, 'stretch', 0) ? prefix((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, 'stretch', 'fill-available'), length, children) + value : value;
            }
            break;
        // grid-(column|row)
        case 5152:
        case 5920:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function(_, a, b, c, d, e, f) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + a + ':' + b + f + (c ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + a + '-span:' + (d ? e : +e - +b) + f : '') + value;
            });
        // position: sticky
        case 4949:
            // stick(y)?
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, length + 6) === 121) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, ':', ':' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"]) + value;
            break;
        // display: (flex|inline-flex|grid|inline-grid)
        case 6444:
            switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, 14) === 45 ? 18 : 11)){
                // (inline-)?fle(x)
                case 120:
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, '$1' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, 14) === 45 ? 'inline-' : '') + 'box$3' + '$1' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + '$2$3' + '$1' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + '$2box$3') + value;
                // (inline-)?gri(d)
                case 100:
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, ':', ':' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"]) + value;
            }
            break;
        // scroll-margin, scroll-margin-(top|right|bottom|left)
        case 5719:
        case 2647:
        case 2135:
        case 3927:
        case 2391:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, 'scroll-', 'scroll-snap-') + value;
    }
    return value;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Middleware.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "middleware",
    ()=>middleware,
    "namespace",
    ()=>namespace,
    "prefixer",
    ()=>prefixer,
    "rulesheet",
    ()=>rulesheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Enum.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Utility.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Tokenizer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Serializer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Serializer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Prefixer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Prefixer.js [app-ssr] (ecmascript)");
;
;
;
;
;
function middleware(collection) {
    var length = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sizeof"])(collection);
    return function(element, index, children, callback) {
        var output = '';
        for(var i = 0; i < length; i++)output += collection[i](element, index, children, callback) || '';
        return output;
    };
}
function rulesheet(callback) {
    return function(element) {
        if (!element.root) {
            if (element = element.return) callback(element);
        }
    };
}
function prefixer(element, index, children, callback) {
    if (element.length > -1) {
        if (!element.return) switch(element.type){
            case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DECLARATION"]:
                element.return = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Prefixer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["prefix"])(element.value, element.length, children);
                return;
            case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KEYFRAMES"]:
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Serializer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serialize"])([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(element, {
                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(element.value, '@', '@' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"])
                    })
                ], callback);
            case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULESET"]:
                if (element.length) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combine"])(children = element.props, function(value) {
                    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["match"])(value, callback = /(::plac\w+|:read-\w+)/)){
                        // :read-(only|write)
                        case ':read-only':
                        case ':read-write':
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(element, {
                                props: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /:(read-\w+)/, ':' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOZ"] + '$1')
                                ]
                            }));
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(element, {
                                props: [
                                    value
                                ]
                            }));
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assign"])(element, {
                                props: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])(children, callback)
                            });
                            break;
                        // :placeholder
                        case '::placeholder':
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(element, {
                                props: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /:(plac\w+)/, ':' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WEBKIT"] + 'input-$1')
                                ]
                            }));
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(element, {
                                props: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /:(plac\w+)/, ':' + __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOZ"] + '$1')
                                ]
                            }));
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(element, {
                                props: [
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(value, /:(plac\w+)/, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MS"] + 'input-$1')
                                ]
                            }));
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["lift"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["copy"])(element, {
                                props: [
                                    value
                                ]
                            }));
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assign"])(element, {
                                props: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filter"])(children, callback)
                            });
                            break;
                    }
                    return '';
                });
        }
    }
}
function namespace(element) {
    switch(element.type){
        case __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULESET"]:
            element.props = element.props.map(function(value) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["combine"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tokenize"])(value), function(value, index, children) {
                    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(value, 0)){
                        // \f
                        case 12:
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["substr"])(value, 1, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(value));
                        // \0 ( + > ~
                        case 0:
                        case 40:
                        case 43:
                        case 62:
                        case 126:
                            return value;
                        // :
                        case 58:
                            if (children[++index] === 'global') children[index] = '', children[++index] = '\f' + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["substr"])(children[index], index = 1, -1);
                        // \s
                        case 32:
                            return index === 1 ? '' : value;
                        default:
                            switch(index){
                                case 0:
                                    element = value;
                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sizeof"])(children) > 1 ? '' : value;
                                case index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sizeof"])(children) - 1:
                                case 2:
                                    return index === 2 ? value + element + element : value + element;
                                default:
                                    return value;
                            }
                    }
                });
            });
    }
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Parser.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "comment",
    ()=>comment,
    "compile",
    ()=>compile,
    "declaration",
    ()=>declaration,
    "parse",
    ()=>parse,
    "ruleset",
    ()=>ruleset
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Enum.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Utility.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/stylis/src/Tokenizer.js [app-ssr] (ecmascript)");
;
;
;
function compile(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dealloc"])(parse('', null, null, null, [
        ''
    ], value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["alloc"])(value), 0, [
        0
    ], value));
}
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index = 0;
    var offset = 0;
    var length = pseudo;
    var atrule = 0;
    var property = 0;
    var previous = 0;
    var variable = 1;
    var scanning = 1;
    var ampersand = 1;
    var character = 0;
    var type = '';
    var props = rules;
    var children = rulesets;
    var reference = rule;
    var characters = type;
    while(scanning)switch(previous = character, character = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["next"])()){
        // (
        case 40:
            if (previous != 108 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(characters, length - 1) == 58) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["indexof"])(characters += (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["delimit"])(character), '&', '&\f'), '&\f', (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["abs"])(index ? points[index - 1] : 0)) != -1) ampersand = -1;
                break;
            }
        // " ' [
        case 34:
        case 39:
        case 91:
            characters += (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["delimit"])(character);
            break;
        // \t \n \r \s
        case 9:
        case 10:
        case 13:
        case 32:
            characters += (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["whitespace"])(previous);
            break;
        // \
        case 92:
            characters += (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["escaping"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["caret"])() - 1, 7);
            continue;
        // /
        case 47:
            switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["peek"])()){
                case 42:
                case 47:
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["append"])(comment((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commenter"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["next"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["caret"])()), root, parent, declarations), declarations);
                    break;
                default:
                    characters += '/';
            }
            break;
        // {
        case 123 * variable:
            points[index++] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(characters) * ampersand;
        // } ; \0
        case 125 * variable:
        case 59:
        case 0:
            switch(character){
                // \0 }
                case 0:
                case 125:
                    scanning = 0;
                // ;
                case 59 + offset:
                    if (ampersand == -1) characters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(characters, /\f/g, '');
                    if (property > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(characters) - length) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["append"])(property > 32 ? declaration(characters + ';', rule, parent, length - 1, declarations) : declaration((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(characters, ' ', '') + ';', rule, parent, length - 2, declarations), declarations);
                    break;
                // @ ;
                case 59:
                    characters += ';';
                // { rule/at-rule
                default:
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["append"])(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets);
                    if (character === 123) if (offset === 0) parse(characters, root, reference, reference, props, rulesets, length, points, children);
                    else switch(atrule === 99 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["charat"])(characters, 3) === 110 ? 100 : atrule){
                        // d l m s
                        case 100:
                        case 108:
                        case 109:
                        case 115:
                            parse(value, reference, reference, rule && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["append"])(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children);
                            break;
                        default:
                            parse(characters, reference, reference, reference, [
                                ''
                            ], children, 0, points, children);
                    }
            }
            index = offset = property = 0, variable = ampersand = 1, type = characters = '', length = pseudo;
            break;
        // :
        case 58:
            length = 1 + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(characters), property = previous;
        default:
            if (variable < 1) {
                if (character == 123) --variable;
                else if (character == 125 && variable++ == 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["prev"])() == 125) continue;
            }
            switch(characters += (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["from"])(character), character * variable){
                // &
                case 38:
                    ampersand = offset > 0 ? 1 : (characters += '\f', -1);
                    break;
                // ,
                case 44:
                    points[index++] = ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(characters) - 1) * ampersand, ampersand = 1;
                    break;
                // @
                case 64:
                    // -
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["peek"])() === 45) characters += (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["delimit"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["next"])());
                    atrule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["peek"])(), offset = length = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(type = characters += (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["identifier"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["caret"])())), character++;
                    break;
                // -
                case 45:
                    if (previous === 45 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["strlen"])(characters) == 2) variable = 0;
            }
    }
    return rulesets;
}
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
    var post = offset - 1;
    var rule = offset === 0 ? rules : [
        ''
    ];
    var size = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sizeof"])(rule);
    for(var i = 0, j = 0, k = 0; i < index; ++i)for(var x = 0, y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["substr"])(value, post + 1, post = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["abs"])(j = points[i])), z = value; x < size; ++x)if (z = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trim"])(j > 0 ? rule[x] + ' ' + y : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replace"])(y, /&\f/g, rule[x]))) props[k++] = z;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["node"])(value, root, parent, offset === 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RULESET"] : type, props, children, length, siblings);
}
function comment(value, root, parent, siblings) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["node"])(value, root, parent, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COMMENT"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["from"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["char"])()), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["substr"])(value, 2, -2), 0, siblings);
}
function declaration(value, root, parent, length, siblings) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Tokenizer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["node"])(value, root, parent, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Enum$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DECLARATION"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["substr"])(value, 0, length), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$stylis$2f$src$2f$Utility$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["substr"])(value, length + 1, -1), length, siblings);
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/compose-refs/src/compose-refs.tsx
__turbopack_context__.s([
    "composeRefs",
    ()=>composeRefs,
    "useComposedRefs",
    ()=>useComposedRefs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function setRef(ref, value) {
    if (typeof ref === "function") {
        return ref(value);
    } else if (ref !== null && ref !== void 0) {
        ref.current = value;
    }
}
function composeRefs(...refs) {
    return (node)=>{
        let hasCleanup = false;
        const cleanups = refs.map((ref)=>{
            const cleanup = setRef(ref, node);
            if (!hasCleanup && typeof cleanup == "function") {
                hasCleanup = true;
            }
            return cleanup;
        });
        if (hasCleanup) {
            return ()=>{
                for(let i = 0; i < cleanups.length; i++){
                    const cleanup = cleanups[i];
                    if (typeof cleanup == "function") {
                        cleanup();
                    } else {
                        setRef(refs[i], null);
                    }
                }
            };
        }
    };
}
function useComposedRefs(...refs) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](composeRefs(...refs), refs);
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/slot.tsx
__turbopack_context__.s([
    "Root",
    ()=>Slot,
    "Slot",
    ()=>Slot,
    "Slottable",
    ()=>Slottable,
    "createSlot",
    ()=>createSlot,
    "createSlottable",
    ()=>createSlottable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
;
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
    const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
    const Slot2 = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { children, ...slotProps } = props;
        const childrenArray = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].toArray(children);
        const slottable = childrenArray.find(isSlottable);
        if (slottable) {
            const newElement = slottable.props.children;
            const newChildren = childrenArray.map((child)=>{
                if (child === slottable) {
                    if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].count(newElement) > 1) return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].only(null);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](newElement) ? newElement.props.children : null;
                } else {
                    return child;
                }
            });
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SlotClone, {
                ...slotProps,
                ref: forwardedRef,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](newElement) ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"](newElement, void 0, newChildren) : null
            });
        }
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(SlotClone, {
            ...slotProps,
            ref: forwardedRef,
            children
        });
    });
    Slot2.displayName = `${ownerName}.Slot`;
    return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
    const SlotClone = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"]((props, forwardedRef)=>{
        const { children, ...slotProps } = props;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](children)) {
            const childrenRef = getElementRef(children);
            const props2 = mergeProps(slotProps, children.props);
            if (children.type !== __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"]) {
                props2.ref = forwardedRef ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeRefs"])(forwardedRef, childrenRef) : childrenRef;
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"](children, props2);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].count(children) > 1 ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
    const Slottable2 = ({ children })=>{
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children
        });
    };
    Slottable2.displayName = `${ownerName}.Slottable`;
    Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
    return Slottable2;
}
var Slottable = /* @__PURE__ */ createSlottable("Slottable");
function isSlottable(child) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidElement"](child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
    const overrideProps = {
        ...childProps
    };
    for(const propName in childProps){
        const slotPropValue = slotProps[propName];
        const childPropValue = childProps[propName];
        const isHandler = /^on[A-Z]/.test(propName);
        if (isHandler) {
            if (slotPropValue && childPropValue) {
                overrideProps[propName] = (...args)=>{
                    const result = childPropValue(...args);
                    slotPropValue(...args);
                    return result;
                };
            } else if (slotPropValue) {
                overrideProps[propName] = slotPropValue;
            }
        } else if (propName === "style") {
            overrideProps[propName] = {
                ...slotPropValue,
                ...childPropValue
            };
        } else if (propName === "className") {
            overrideProps[propName] = [
                slotPropValue,
                childPropValue
            ].filter(Boolean).join(" ");
        }
    }
    return {
        ...slotProps,
        ...overrideProps
    };
}
function getElementRef(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
        return element.props.ref;
    }
    return element.props.ref || element.ref;
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/primitive.tsx
__turbopack_context__.s([
    "canUseDOM",
    ()=>canUseDOM,
    "composeEventHandlers",
    ()=>composeEventHandlers,
    "getActiveElement",
    ()=>getActiveElement,
    "getOwnerDocument",
    ()=>getOwnerDocument,
    "getOwnerWindow",
    ()=>getOwnerWindow,
    "isFrame",
    ()=>isFrame
]);
var canUseDOM = !!(("TURBOPACK compile-time value", "undefined") !== "undefined" && window.document && window.document.createElement);
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return function handleEvent(event) {
        originalEventHandler?.(event);
        if (checkForDefaultPrevented === false || !event.defaultPrevented) {
            return ourEventHandler?.(event);
        }
    };
}
function getOwnerWindow(element) {
    if ("TURBOPACK compile-time truthy", 1) {
        throw new Error("Cannot access window outside of the DOM");
    }
    return element?.ownerDocument?.defaultView ?? window;
}
function getOwnerDocument(element) {
    if ("TURBOPACK compile-time truthy", 1) {
        throw new Error("Cannot access document outside of the DOM");
    }
    return element?.ownerDocument ?? document;
}
function getActiveElement(node, activeDescendant = false) {
    const { activeElement } = getOwnerDocument(node);
    if (!activeElement?.nodeName) {
        return null;
    }
    if (isFrame(activeElement) && activeElement.contentDocument) {
        return getActiveElement(activeElement.contentDocument.body, activeDescendant);
    }
    if (activeDescendant) {
        const id = activeElement.getAttribute("aria-activedescendant");
        if (id) {
            const element = getOwnerDocument(activeElement).getElementById(id);
            if (element) {
                return element;
            }
        }
    }
    return activeElement;
}
function isFrame(element) {
    return element.tagName === "IFRAME";
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-context/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/create-context.tsx
__turbopack_context__.s([
    "createContext",
    ()=>createContext2,
    "createContextScope",
    ()=>createContextScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
function createContext2(rootComponentName, defaultContext) {
    const Context = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](defaultContext);
    Context.displayName = rootComponentName + "Context";
    const Provider = (props)=>{
        const { children, ...context } = props;
        const value = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>context, Object.values(context));
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Context.Provider, {
            value,
            children
        });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName) {
        const context = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](Context);
        if (context) return context;
        if (defaultContext !== void 0) return defaultContext;
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [
        Provider,
        useContext2
    ];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    function createContext3(rootComponentName, defaultContext) {
        const BaseContext = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](defaultContext);
        BaseContext.displayName = rootComponentName + "Context";
        const index = defaultContexts.length;
        defaultContexts = [
            ...defaultContexts,
            defaultContext
        ];
        const Provider = (props)=>{
            const { scope, children, ...context } = props;
            const Context = scope?.[scopeName]?.[index] || BaseContext;
            const value = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>context, Object.values(context));
            return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(Context.Provider, {
                value,
                children
            });
        };
        Provider.displayName = rootComponentName + "Provider";
        function useContext2(consumerName, scope) {
            const Context = scope?.[scopeName]?.[index] || BaseContext;
            const context = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](Context);
            if (context) return context;
            if (defaultContext !== void 0) return defaultContext;
            throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
        }
        return [
            Provider,
            useContext2
        ];
    }
    const createScope = ()=>{
        const scopeContexts = defaultContexts.map((defaultContext)=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](defaultContext);
        });
        return function useScope(scope) {
            const contexts = scope?.[scopeName] || scopeContexts;
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
                    [`__scope${scopeName}`]: {
                        ...scope,
                        [scopeName]: contexts
                    }
                }), [
                scope,
                contexts
            ]);
        };
    };
    createScope.scopeName = scopeName;
    return [
        createContext3,
        composeContextScopes(createScope, ...createContextScopeDeps)
    ];
}
function composeContextScopes(...scopes) {
    const baseScope = scopes[0];
    if (scopes.length === 1) return baseScope;
    const createScope = ()=>{
        const scopeHooks = scopes.map((createScope2)=>({
                useScope: createScope2(),
                scopeName: createScope2.scopeName
            }));
        return function useComposedScopes(overrideScopes) {
            const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName })=>{
                const scopeProps = useScope(overrideScopes);
                const currentScope = scopeProps[`__scope${scopeName}`];
                return {
                    ...nextScopes2,
                    ...currentScope
                };
            }, {});
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
                    [`__scope${baseScope.scopeName}`]: nextScopes
                }), [
                nextScopes
            ]);
        };
    };
    createScope.scopeName = baseScope.scopeName;
    return createScope;
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/use-callback-ref/src/use-callback-ref.tsx
__turbopack_context__.s([
    "useCallbackRef",
    ()=>useCallbackRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useCallbackRef(callback) {
    const callbackRef = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](callback);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        callbackRef.current = callback;
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(...args)=>callbackRef.current?.(...args), []);
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/use-escape-keydown/src/use-escape-keydown.tsx
__turbopack_context__.s([
    "useEscapeKeydown",
    ()=>useEscapeKeydown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)");
;
;
function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
    const onEscapeKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])(onEscapeKeyDownProp);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const handleKeyDown = (event)=>{
            if (event.key === "Escape") {
                onEscapeKeyDown(event);
            }
        };
        ownerDocument.addEventListener("keydown", handleKeyDown, {
            capture: true
        });
        return ()=>ownerDocument.removeEventListener("keydown", handleKeyDown, {
                capture: true
            });
    }, [
        onEscapeKeyDown,
        ownerDocument
    ]);
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-focus-guards/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusGuards",
    ()=>FocusGuards,
    "Root",
    ()=>FocusGuards,
    "useFocusGuards",
    ()=>useFocusGuards
]);
// src/focus-guards.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
var count = 0;
function FocusGuards(props) {
    useFocusGuards();
    return props.children;
}
function useFocusGuards() {
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
        document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
        document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
        count++;
        return ()=>{
            if (count === 1) {
                document.querySelectorAll("[data-radix-focus-guard]").forEach((node)=>node.remove());
            }
            count--;
        };
    }, []);
}
function createFocusGuard() {
    const element = document.createElement("span");
    element.setAttribute("data-radix-focus-guard", "");
    element.tabIndex = 0;
    element.style.outline = "none";
    element.style.opacity = "0";
    element.style.position = "fixed";
    element.style.pointerEvents = "none";
    return element;
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/use-layout-effect/src/use-layout-effect.tsx
__turbopack_context__.s([
    "useLayoutEffect",
    ()=>useLayoutEffect2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
var useLayoutEffect2 = globalThis?.document ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"] : ()=>{};
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-id/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/id/src/id.tsx
__turbopack_context__.s([
    "useId",
    ()=>useId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-ssr] (ecmascript)");
;
;
var useReactId = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[" useId ".trim().toString()] || (()=>void 0);
var count = 0;
function useId(deterministicId) {
    const [id, setId] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useState(useReactId());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        if (!deterministicId) setId((reactId)=>reactId ?? String(count++));
    }, [
        deterministicId
    ]);
    return deterministicId || (id ? `radix-${id}` : "");
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-size/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/use-size/src/use-size.tsx
__turbopack_context__.s([
    "useSize",
    ()=>useSize
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-ssr] (ecmascript)");
;
;
function useSize(element) {
    const [size, setSize] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](void 0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        if (element) {
            setSize({
                width: element.offsetWidth,
                height: element.offsetHeight
            });
            const resizeObserver = new ResizeObserver((entries)=>{
                if (!Array.isArray(entries)) {
                    return;
                }
                if (!entries.length) {
                    return;
                }
                const entry = entries[0];
                let width;
                let height;
                if ("borderBoxSize" in entry) {
                    const borderSizeEntry = entry["borderBoxSize"];
                    const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
                    width = borderSize["inlineSize"];
                    height = borderSize["blockSize"];
                } else {
                    width = element.offsetWidth;
                    height = element.offsetHeight;
                }
                setSize({
                    width,
                    height
                });
            });
            resizeObserver.observe(element, {
                box: "border-box"
            });
            return ()=>resizeObserver.unobserve(element);
        } else {
            setSize(void 0);
        }
    }, [
        element
    ]);
    return size;
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/use-effect-event.tsx
__turbopack_context__.s([
    "useEffectEvent",
    ()=>useEffectEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
var useReactEffectEvent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[" useEffectEvent ".trim().toString()];
var useReactInsertionEffect = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[" useInsertionEffect ".trim().toString()];
function useEffectEvent(callback) {
    if (typeof useReactEffectEvent === "function") {
        return useReactEffectEvent(callback);
    }
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useRef(()=>{
        throw new Error("Cannot call an event handler while rendering.");
    });
    if (typeof useReactInsertionEffect === "function") {
        useReactInsertionEffect(()=>{
            ref.current = callback;
        });
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
            ref.current = callback;
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useMemo(()=>(...args)=>ref.current?.(...args), []);
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/use-controllable-state.tsx
__turbopack_context__.s([
    "useControllableState",
    ()=>useControllableState,
    "useControllableStateReducer",
    ()=>useControllableStateReducer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$effect$2d$event$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-effect-event/dist/index.mjs [app-ssr] (ecmascript)");
;
;
var useInsertionEffect = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[" useInsertionEffect ".trim().toString()] || __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$layout$2d$effect$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"];
function useControllableState({ prop, defaultProp, onChange = ()=>{}, caller }) {
    const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
        defaultProp,
        onChange
    });
    const isControlled = prop !== void 0;
    const value = isControlled ? prop : uncontrolledProp;
    if ("TURBOPACK compile-time truthy", 1) {
        const isControlledRef = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useRef(prop !== void 0);
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useEffect(()=>{
            const wasControlled = isControlledRef.current;
            if (wasControlled !== isControlled) {
                const from = wasControlled ? "controlled" : "uncontrolled";
                const to = isControlled ? "controlled" : "uncontrolled";
                console.warn(`${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`);
            }
            isControlledRef.current = isControlled;
        }, [
            isControlled,
            caller
        ]);
    }
    const setValue = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useCallback((nextValue)=>{
        if (isControlled) {
            const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
            if (value2 !== prop) {
                onChangeRef.current?.(value2);
            }
        } else {
            setUncontrolledProp(nextValue);
        }
    }, [
        isControlled,
        prop,
        setUncontrolledProp,
        onChangeRef
    ]);
    return [
        value,
        setValue
    ];
}
function useUncontrolledState({ defaultProp, onChange }) {
    const [value, setValue] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useState(defaultProp);
    const prevValueRef = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useRef(value);
    const onChangeRef = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useRef(onChange);
    useInsertionEffect(()=>{
        onChangeRef.current = onChange;
    }, [
        onChange
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useEffect(()=>{
        if (prevValueRef.current !== value) {
            onChangeRef.current?.(value);
            prevValueRef.current = value;
        }
    }, [
        value,
        prevValueRef
    ]);
    return [
        value,
        setValue,
        onChangeRef
    ];
}
function isFunction(value) {
    return typeof value === "function";
}
;
;
var SYNC_STATE = Symbol("RADIX:SYNC_STATE");
function useControllableStateReducer(reducer, userArgs, initialArg, init) {
    const { prop: controlledState, defaultProp, onChange: onChangeProp, caller } = userArgs;
    const isControlled = controlledState !== void 0;
    const onChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$effect$2d$event$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffectEvent"])(onChangeProp);
    if ("TURBOPACK compile-time truthy", 1) {
        const isControlledRef = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useRef(controlledState !== void 0);
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useEffect(()=>{
            const wasControlled = isControlledRef.current;
            if (wasControlled !== isControlled) {
                const from = wasControlled ? "controlled" : "uncontrolled";
                const to = isControlled ? "controlled" : "uncontrolled";
                console.warn(`${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`);
            }
            isControlledRef.current = isControlled;
        }, [
            isControlled,
            caller
        ]);
    }
    const args = [
        {
            ...initialArg,
            state: defaultProp
        }
    ];
    if (init) {
        args.push(init);
    }
    const [internalState, dispatch] = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useReducer((state2, action)=>{
        if (action.type === SYNC_STATE) {
            return {
                ...state2,
                state: action.state
            };
        }
        const next = reducer(state2, action);
        if (isControlled && !Object.is(next.state, state2.state)) {
            onChange(next.state);
        }
        return next;
    }, ...args);
    const uncontrolledState = internalState.state;
    const prevValueRef = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useRef(uncontrolledState);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useEffect(()=>{
        if (prevValueRef.current !== uncontrolledState) {
            prevValueRef.current = uncontrolledState;
            if (!isControlled) {
                onChange(uncontrolledState);
            }
        }
    }, [
        onChange,
        uncontrolledState,
        prevValueRef,
        isControlled
    ]);
    const state = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useMemo(()=>{
        const isControlled2 = controlledState !== void 0;
        if (isControlled2) {
            return {
                ...internalState,
                state: controlledState
            };
        }
        return internalState;
    }, [
        internalState,
        controlledState
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__.useEffect(()=>{
        if (isControlled && !Object.is(controlledState, internalState.state)) {
            dispatch({
                type: SYNC_STATE,
                state: controlledState
            });
        }
    }, [
        controlledState,
        internalState.state,
        isControlled
    ]);
    return [
        state,
        dispatch
    ];
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-direction/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// packages/react/direction/src/direction.tsx
__turbopack_context__.s([
    "DirectionProvider",
    ()=>DirectionProvider,
    "Provider",
    ()=>Provider,
    "useDirection",
    ()=>useDirection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
;
;
var DirectionContext = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"](void 0);
var DirectionProvider = (props)=>{
    const { dir, children } = props;
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsx"])(DirectionContext.Provider, {
        value: dir,
        children
    });
};
function useDirection(localDir) {
    const globalDir = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"](DirectionContext);
    return localDir || globalDir || "ltr";
}
var Provider = DirectionProvider;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/@radix-ui/react-use-is-hydrated/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/use-is-hydrated.tsx
__turbopack_context__.s([
    "useIsHydrated",
    ()=>useIsHydrated
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/use-sync-external-store/shim/index.js [app-ssr] (ecmascript)");
;
function useIsHydrated() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, ()=>true, ()=>false);
}
function subscribe() {
    return ()=>{};
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/Desktop/Inventory/my-app/node_modules/aria-hidden/dist/es2015/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hideOthers",
    ()=>hideOthers,
    "inertOthers",
    ()=>inertOthers,
    "supportsInert",
    ()=>supportsInert,
    "suppressOthers",
    ()=>suppressOthers
]);
var getDefaultParent = function(originalTarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
};
var counterMap = new WeakMap();
var uncontrolledNodes = new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function(node) {
    return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function(parent, targets) {
    return targets.map(function(target) {
        if (parent.contains(target)) {
            return target;
        }
        var correctedTarget = unwrapHost(target);
        if (correctedTarget && parent.contains(correctedTarget)) {
            return correctedTarget;
        }
        console.error('aria-hidden', target, 'in not contained inside', parent, '. Doing nothing');
        return null;
    }).filter(function(x) {
        return Boolean(x);
    });
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @param {String} [controlAttribute] - html Attribute to control
 * @return {Undo} undo command
 */ var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [
        originalTarget
    ]);
    if (!markerMap[markerName]) {
        markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function(el) {
        if (!el || elementsToKeep.has(el)) {
            return;
        }
        elementsToKeep.add(el);
        keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function(parent) {
        if (!parent || elementsToStop.has(parent)) {
            return;
        }
        Array.prototype.forEach.call(parent.children, function(node) {
            if (elementsToKeep.has(node)) {
                deep(node);
            } else {
                try {
                    var attr = node.getAttribute(controlAttribute);
                    var alreadyHidden = attr !== null && attr !== 'false';
                    var counterValue = (counterMap.get(node) || 0) + 1;
                    var markerValue = (markerCounter.get(node) || 0) + 1;
                    counterMap.set(node, counterValue);
                    markerCounter.set(node, markerValue);
                    hiddenNodes.push(node);
                    if (counterValue === 1 && alreadyHidden) {
                        uncontrolledNodes.set(node, true);
                    }
                    if (markerValue === 1) {
                        node.setAttribute(markerName, 'true');
                    }
                    if (!alreadyHidden) {
                        node.setAttribute(controlAttribute, 'true');
                    }
                } catch (e) {
                    console.error('aria-hidden: cannot operate on ', node, e);
                }
            }
        });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function() {
        hiddenNodes.forEach(function(node) {
            var counterValue = counterMap.get(node) - 1;
            var markerValue = markerCounter.get(node) - 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            if (!counterValue) {
                if (!uncontrolledNodes.has(node)) {
                    node.removeAttribute(controlAttribute);
                }
                uncontrolledNodes.delete(node);
            }
            if (!markerValue) {
                node.removeAttribute(markerName);
            }
        });
        lockCount--;
        if (!lockCount) {
            // clear
            counterMap = new WeakMap();
            counterMap = new WeakMap();
            uncontrolledNodes = new WeakMap();
            markerMap = {};
        }
    };
};
var hideOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
        markerName = 'data-aria-hidden';
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [
        originalTarget
    ]);
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function() {
            return null;
        };
    }
    // we should not hide aria-live elements - https://github.com/theKashey/aria-hidden/issues/10
    // and script elements, as they have no impact on accessibility.
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll('[aria-live], script')));
    return applyAttributeToOthers(targets, activeParentNode, markerName, 'aria-hidden');
};
var inertOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
        markerName = 'data-inert-ed';
    }
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function() {
            return null;
        };
    }
    return applyAttributeToOthers(originalTarget, activeParentNode, markerName, 'inert');
};
var supportsInert = function() {
    return typeof HTMLElement !== 'undefined' && HTMLElement.prototype.hasOwnProperty('inert');
};
var suppressOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
        markerName = 'data-suppressed';
    }
    return (supportsInert() ? inertOthers : hideOthers)(originalTarget, parentNode, markerName);
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fullWidthClassName",
    ()=>fullWidthClassName,
    "noScrollbarsClassName",
    ()=>noScrollbarsClassName,
    "removedBarSizeVariable",
    ()=>removedBarSizeVariable,
    "zeroRightClassName",
    ()=>zeroRightClassName
]);
var zeroRightClassName = 'right-scroll-bar-position';
var fullWidthClassName = 'width-before-scroll-bar';
var noScrollbarsClassName = 'with-scroll-bars-hidden';
var removedBarSizeVariable = '--removed-body-scroll-bar-size';
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getGapWidth",
    ()=>getGapWidth,
    "zeroGap",
    ()=>zeroGap
]);
var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
};
var parse = function(x) {
    return parseInt(x || '', 10) || 0;
};
var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === 'padding' ? 'paddingLeft' : 'marginLeft'];
    var top = cs[gapMode === 'padding' ? 'paddingTop' : 'marginTop'];
    var right = cs[gapMode === 'padding' ? 'paddingRight' : 'marginRight'];
    return [
        parse(left),
        parse(top),
        parse(right)
    ];
};
var getGapWidth = function(gapMode) {
    if (gapMode === void 0) {
        gapMode = 'margin';
    }
    if ("TURBOPACK compile-time truthy", 1) {
        return zeroGap;
    }
    //TURBOPACK unreachable
    ;
    var offsets;
    var documentWidth;
    var windowWidth;
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/component.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoveScrollBar",
    ()=>RemoveScrollBar,
    "lockAttribute",
    ()=>lockAttribute,
    "useLockAttribute",
    ()=>useLockAttribute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/utils.js [app-ssr] (ecmascript)");
;
;
;
;
var Style = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styleSingleton"])();
var lockAttribute = 'data-scroll-locked';
// important tip - once we measure scrollBar width and remove them
// we could not repeat this operation
// thus we are using style-singleton - only the first "yet correct" style will be applied.
var getStyles = function(_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) {
        gapMode = 'margin';
    }
    return "\n  .".concat(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noScrollbarsClassName"], " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
        allowRelative && "position: relative ".concat(important, ";"),
        gapMode === 'margin' && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
        gapMode === 'padding' && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(''), "\n  }\n  \n  .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroRightClassName"], " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fullWidthClassName"], " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroRightClassName"], " .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroRightClassName"], " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fullWidthClassName"], " .").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fullWidthClassName"], " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removedBarSizeVariable"], ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function() {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || '0', 10);
    return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function() {
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](function() {
        document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
        return function() {
            var newCounter = getCurrentUseCounter() - 1;
            if (newCounter <= 0) {
                document.body.removeAttribute(lockAttribute);
            } else {
                document.body.setAttribute(lockAttribute, newCounter.toString());
            }
        };
    }, []);
};
var RemoveScrollBar = function(_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? 'margin' : _b;
    useLockAttribute();
    /*
     gap will be measured on every component mount
     however it will be used only by the "first" invocation
     due to singleton nature of <Style
     */ var gap = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGapWidth"])(gapMode);
    }, [
        gapMode
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](Style, {
        styles: getStyles(gap, !noRelative, gapMode, !noImportant ? '!important' : '')
    });
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/utils.js [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/use-callback-ref/dist/es2015/assignRef.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Assigns a value for a given ref, no matter of the ref format
 * @param {RefObject} ref - a callback function or ref object
 * @param value - a new value
 *
 * @see https://github.com/theKashey/use-callback-ref#assignref
 * @example
 * const refObject = useRef();
 * const refFn = (ref) => {....}
 *
 * assignRef(refObject, "refValue");
 * assignRef(refFn, "refValue");
 */ __turbopack_context__.s([
    "assignRef",
    ()=>assignRef
]);
function assignRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
    return ref;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/use-callback-ref/dist/es2015/useRef.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCallbackRef",
    ()=>useCallbackRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useCallbackRef(initialValue, callback) {
    var ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(function() {
        return {
            // value
            value: initialValue,
            // last callback
            callback: callback,
            // "memoized" public interface
            facade: {
                get current () {
                    return ref.value;
                },
                set current (value){
                    var last = ref.value;
                    if (last !== value) {
                        ref.value = value;
                        ref.callback(value, last);
                    }
                }
            }
        };
    })[0];
    // update callback
    ref.callback = callback;
    return ref.facade;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/use-callback-ref/dist/es2015/useMergeRef.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMergeRefs",
    ()=>useMergeRefs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$assignRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/use-callback-ref/dist/es2015/assignRef.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$useRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/use-callback-ref/dist/es2015/useRef.js [app-ssr] (ecmascript)");
;
;
;
var useIsomorphicLayoutEffect = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"];
var currentValues = new WeakMap();
function useMergeRefs(refs, defaultValue) {
    var callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$useRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])(defaultValue || null, function(newValue) {
        return refs.forEach(function(ref) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$assignRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assignRef"])(ref, newValue);
        });
    });
    // handle refs changes - added or removed
    useIsomorphicLayoutEffect(function() {
        var oldValue = currentValues.get(callbackRef);
        if (oldValue) {
            var prevRefs_1 = new Set(oldValue);
            var nextRefs_1 = new Set(refs);
            var current_1 = callbackRef.current;
            prevRefs_1.forEach(function(ref) {
                if (!nextRefs_1.has(ref)) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$assignRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assignRef"])(ref, null);
                }
            });
            nextRefs_1.forEach(function(ref) {
                if (!prevRefs_1.has(ref)) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$assignRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["assignRef"])(ref, current_1);
                }
            });
        }
        currentValues.set(callbackRef, refs);
    }, [
        refs
    ]);
    return callbackRef;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/use-sidecar/dist/es2015/medium.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMedium",
    ()=>createMedium,
    "createSidecarMedium",
    ()=>createSidecarMedium
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/tslib/tslib.es6.mjs [app-ssr] (ecmascript)");
;
function ItoI(a) {
    return a;
}
function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) {
        middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
        read: function() {
            if (assigned) {
                throw new Error('Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.');
            }
            if (buffer.length) {
                return buffer[buffer.length - 1];
            }
            return defaults;
        },
        useMedium: function(data) {
            var item = middleware(data, assigned);
            buffer.push(item);
            return function() {
                buffer = buffer.filter(function(x) {
                    return x !== item;
                });
            };
        },
        assignSyncMedium: function(cb) {
            assigned = true;
            while(buffer.length){
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
            }
            buffer = {
                push: function(x) {
                    return cb(x);
                },
                filter: function() {
                    return buffer;
                }
            };
        },
        assignMedium: function(cb) {
            assigned = true;
            var pendingQueue = [];
            if (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
                pendingQueue = buffer;
            }
            var executeQueue = function() {
                var cbs = pendingQueue;
                pendingQueue = [];
                cbs.forEach(cb);
            };
            var cycle = function() {
                return Promise.resolve().then(executeQueue);
            };
            cycle();
            buffer = {
                push: function(x) {
                    pendingQueue.push(x);
                    cycle();
                },
                filter: function(filter) {
                    pendingQueue = pendingQueue.filter(filter);
                    return buffer;
                }
            };
        }
    };
    return medium;
}
function createMedium(defaults, middleware) {
    if (middleware === void 0) {
        middleware = ItoI;
    }
    return innerCreateMedium(defaults, middleware);
}
function createSidecarMedium(options) {
    if (options === void 0) {
        options = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__assign"])({
        async: true,
        ssr: false
    }, options);
    return medium;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/use-sidecar/dist/es2015/exports.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exportSidecar",
    ()=>exportSidecar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/tslib/tslib.es6.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
var SideCar = function(_a) {
    var sideCar = _a.sideCar, rest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__rest"])(_a, [
        "sideCar"
    ]);
    if (!sideCar) {
        throw new Error('Sidecar: please provide `sideCar` property to import the right car');
    }
    var Target = sideCar.read();
    if (!Target) {
        throw new Error('Sidecar medium not found');
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](Target, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__assign"])({}, rest));
};
SideCar.isSideCarExport = true;
function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/medium.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "effectCar",
    ()=>effectCar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$sidecar$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/use-sidecar/dist/es2015/medium.js [app-ssr] (ecmascript)");
;
var effectCar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$sidecar$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSidecarMedium"])();
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/UI.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoveScroll",
    ()=>RemoveScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/tslib/tslib.es6.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/constants.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$useMergeRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/use-callback-ref/dist/es2015/useMergeRef.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/medium.js [app-ssr] (ecmascript)");
;
;
;
;
;
var nothing = function() {
    return;
};
/**
 * Removes scrollbar from the page and contain the scroll within the Lock
 */ var RemoveScroll = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](function(props, parentRef) {
    var ref = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    var _a = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        onScrollCapture: nothing,
        onWheelCapture: nothing,
        onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? 'div' : _b, gapMode = props.gapMode, rest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__rest"])(props, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noRelative",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
        "gapMode"
    ]);
    var SideCar = sideCar;
    var containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$callback$2d$ref$2f$dist$2f$es2015$2f$useMergeRef$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMergeRefs"])([
        ref,
        parentRef
    ]);
    var containerProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__assign"])({}, rest), callbacks);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], null, enabled && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](SideCar, {
        sideCar: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["effectCar"],
        removeScrollBar: removeScrollBar,
        shards: shards,
        noRelative: noRelative,
        noIsolation: noIsolation,
        inert: inert,
        setCallbacks: setCallbacks,
        allowPinchZoom: !!allowPinchZoom,
        lockRef: ref,
        gapMode: gapMode
    }), forwardProps ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cloneElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Children"].only(children), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__assign"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__assign"])({}, containerProps), {
        ref: containerRef
    })) : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](Container, (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__assign"])({}, containerProps, {
        className: className,
        ref: containerRef
    }), children));
});
RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
};
RemoveScroll.classNames = {
    fullWidth: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fullWidthClassName"],
    zeroRight: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$constants$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["zeroRightClassName"]
};
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "nonPassive",
    ()=>nonPassive
]);
var passiveSupported = false;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
{
    var options;
}
var nonPassive = passiveSupported ? {
    passive: false
} : false;
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/handleScroll.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleScroll",
    ()=>handleScroll,
    "locationCouldBeScrolled",
    ()=>locationCouldBeScrolled
]);
var alwaysContainsScroll = function(node) {
    // textarea will always _contain_ scroll inside self. It only can be hidden
    return node.tagName === 'TEXTAREA';
};
var elementCanBeScrolled = function(node, overflow) {
    if (!(node instanceof Element)) {
        return false;
    }
    var styles = window.getComputedStyle(node);
    return(// not-not-scrollable
    styles[overflow] !== 'hidden' && // contains scroll inside self
    !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === 'visible'));
};
var elementCouldBeVScrolled = function(node) {
    return elementCanBeScrolled(node, 'overflowY');
};
var elementCouldBeHScrolled = function(node) {
    return elementCanBeScrolled(node, 'overflowX');
};
var locationCouldBeScrolled = function(axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
        // Skip over shadow root
        if (typeof ShadowRoot !== 'undefined' && current instanceof ShadowRoot) {
            current = current.host;
        }
        var isScrollable = elementCouldBeScrolled(axis, current);
        if (isScrollable) {
            var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
            if (scrollHeight > clientHeight) {
                return true;
            }
        }
        current = current.parentNode;
    }while (current && current !== ownerDocument.body)
    return false;
};
var getVScrollVariables = function(_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
        scrollTop,
        scrollHeight,
        clientHeight
    ];
};
var getHScrollVariables = function(_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
        scrollLeft,
        scrollWidth,
        clientWidth
    ];
};
var elementCouldBeScrolled = function(axis, node) {
    return axis === 'v' ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function(axis, node) {
    return axis === 'v' ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function(axis, direction) {
    /**
     * If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
     * and then increasingly negative as you scroll towards the end of the content.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
     */ return axis === 'h' && direction === 'rtl' ? -1 : 1;
};
var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    // find scrollable target
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
        if (!target) {
            break;
        }
        var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
        var elementScroll = scroll_1 - capacity - directionFactor * position;
        if (position || elementScroll) {
            if (elementCouldBeScrolled(axis, target)) {
                availableScroll += elementScroll;
                availableScrollTop += position;
            }
        }
        var parent_1 = target.parentNode;
        // we will "bubble" from ShadowDom in case we are, or just to the parent in normal case
        // this is the same logic used in focus-lock
        target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
    }while (// portaled content
    !targetInLock && target !== document.body || targetInLock && (endTarget.contains(target) || endTarget === target))
    // handle epsilon around 0 (non standard zoom levels)
    if (isDeltaPositive && (noOverscroll && Math.abs(availableScroll) < 1 || !noOverscroll && delta > availableScroll)) {
        shouldCancelScroll = true;
    } else if (!isDeltaPositive && (noOverscroll && Math.abs(availableScrollTop) < 1 || !noOverscroll && -delta > availableScrollTop)) {
        shouldCancelScroll = true;
    }
    return shouldCancelScroll;
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/SideEffect.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoveScrollSideCar",
    ()=>RemoveScrollSideCar,
    "getDeltaXY",
    ()=>getDeltaXY,
    "getTouchXY",
    ()=>getTouchXY
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/tslib/tslib.es6.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll-bar/dist/es2015/component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$handleScroll$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/handleScroll.js [app-ssr] (ecmascript)");
;
;
;
;
;
;
var getTouchXY = function(event) {
    return 'changedTouches' in event ? [
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
    ] : [
        0,
        0
    ];
};
var getDeltaXY = function(event) {
    return [
        event.deltaX,
        event.deltaY
    ];
};
var extractRef = function(ref) {
    return ref && 'current' in ref ? ref.current : ref;
};
var deltaCompare = function(x, y) {
    return x[0] === y[0] && x[1] === y[1];
};
var generateStyle = function(id) {
    return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
};
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
    var shouldPreventQueue = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"]([]);
    var touchStartRef = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"]([
        0,
        0
    ]);
    var activeAxis = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"]();
    var id = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](idCounter++)[0];
    var Style = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styleSingleton"])[0];
    var lastProps = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](props);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](function() {
        lastProps.current = props;
    }, [
        props
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](function() {
        if (props.inert) {
            document.body.classList.add("block-interactivity-".concat(id));
            var allow_1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__spreadArray"])([
                props.lockRef.current
            ], (props.shards || []).map(extractRef), true).filter(Boolean);
            allow_1.forEach(function(el) {
                return el.classList.add("allow-interactivity-".concat(id));
            });
            return function() {
                document.body.classList.remove("block-interactivity-".concat(id));
                allow_1.forEach(function(el) {
                    return el.classList.remove("allow-interactivity-".concat(id));
                });
            };
        }
        return;
    }, [
        props.inert,
        props.lockRef.current,
        props.shards
    ]);
    var shouldCancelEvent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](function(event, parent) {
        if ('touches' in event && event.touches.length === 2 || event.type === 'wheel' && event.ctrlKey) {
            return !lastProps.current.allowPinchZoom;
        }
        var touch = getTouchXY(event);
        var touchStart = touchStartRef.current;
        var deltaX = 'deltaX' in event ? event.deltaX : touchStart[0] - touch[0];
        var deltaY = 'deltaY' in event ? event.deltaY : touchStart[1] - touch[1];
        var currentAxis;
        var target = event.target;
        var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';
        // allow horizontal touch move on Range inputs. They will not cause any scroll
        if ('touches' in event && moveDirection === 'h' && target.type === 'range') {
            return false;
        }
        // allow drag selection (iOS); check if selection's anchorNode is the same as target or contains target
        var selection = window.getSelection();
        var anchorNode = selection && selection.anchorNode;
        var isTouchingSelection = anchorNode ? anchorNode === target || anchorNode.contains(target) : false;
        if (isTouchingSelection) {
            return false;
        }
        var canBeScrolledInMainDirection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$handleScroll$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["locationCouldBeScrolled"])(moveDirection, target);
        if (!canBeScrolledInMainDirection) {
            return true;
        }
        if (canBeScrolledInMainDirection) {
            currentAxis = moveDirection;
        } else {
            currentAxis = moveDirection === 'v' ? 'h' : 'v';
            canBeScrolledInMainDirection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$handleScroll$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["locationCouldBeScrolled"])(moveDirection, target);
        // other axis might be not scrollable
        }
        if (!canBeScrolledInMainDirection) {
            return false;
        }
        if (!activeAxis.current && 'changedTouches' in event && (deltaX || deltaY)) {
            activeAxis.current = currentAxis;
        }
        if (!currentAxis) {
            return true;
        }
        var cancelingAxis = activeAxis.current || currentAxis;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$handleScroll$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleScroll"])(cancelingAxis, parent, event, cancelingAxis === 'h' ? deltaX : deltaY, true);
    }, []);
    var shouldPrevent = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](function(_event) {
        var event = _event;
        if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) {
            // not the last active
            return;
        }
        var delta = 'deltaY' in event ? getDeltaXY(event) : getTouchXY(event);
        var sourceEvent = shouldPreventQueue.current.filter(function(e) {
            return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
        })[0];
        // self event, and should be canceled
        if (sourceEvent && sourceEvent.should) {
            if (event.cancelable) {
                event.preventDefault();
            }
            return;
        }
        // outside or shard event
        if (!sourceEvent) {
            var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
                return node.contains(event.target);
            });
            var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
            if (shouldStop) {
                if (event.cancelable) {
                    event.preventDefault();
                }
            }
        }
    }, []);
    var shouldCancel = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](function(name, delta, target, should) {
        var event = {
            name: name,
            delta: delta,
            target: target,
            should: should,
            shadowParent: getOutermostShadowParent(target)
        };
        shouldPreventQueue.current.push(event);
        setTimeout(function() {
            shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
                return e !== event;
            });
        }, 1);
    }, []);
    var scrollTouchStart = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](function(event) {
        touchStartRef.current = getTouchXY(event);
        activeAxis.current = undefined;
    }, []);
    var scrollWheel = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](function(event) {
        shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](function(event) {
        shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](function() {
        lockStack.push(Style);
        props.setCallbacks({
            onScrollCapture: scrollWheel,
            onWheelCapture: scrollWheel,
            onTouchMoveCapture: scrollTouchMove
        });
        document.addEventListener('wheel', shouldPrevent, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nonPassive"]);
        document.addEventListener('touchmove', shouldPrevent, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nonPassive"]);
        document.addEventListener('touchstart', scrollTouchStart, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nonPassive"]);
        return function() {
            lockStack = lockStack.filter(function(inst) {
                return inst !== Style;
            });
            document.removeEventListener('wheel', shouldPrevent, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nonPassive"]);
            document.removeEventListener('touchmove', shouldPrevent, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nonPassive"]);
            document.removeEventListener('touchstart', scrollTouchStart, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$aggresiveCapture$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["nonPassive"]);
        };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], null, inert ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](Style, {
        styles: generateStyle(id)
    }) : null, removeScrollBar ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2d$bar$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RemoveScrollBar"], {
        noRelative: props.noRelative,
        gapMode: props.gapMode
    }) : null);
}
function getOutermostShadowParent(node) {
    var shadowParent = null;
    while(node !== null){
        if (node instanceof ShadowRoot) {
            shadowParent = node.host;
            node = node.host;
        }
        node = node.parentNode;
    }
    return shadowParent;
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/sidecar.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$sidecar$2f$dist$2f$es2015$2f$exports$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/use-sidecar/dist/es2015/exports.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$SideEffect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/SideEffect.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/medium.js [app-ssr] (ecmascript)");
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$use$2d$sidecar$2f$dist$2f$es2015$2f$exports$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportSidecar"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$medium$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["effectCar"], __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$SideEffect$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RemoveScrollSideCar"]);
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/Combination.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/tslib/tslib.es6.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$UI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/UI.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$sidecar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/sidecar.js [app-ssr] (ecmascript)");
;
;
;
;
var ReactRemoveScroll = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](function(props, ref) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$UI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RemoveScroll"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__assign"])({}, props, {
        ref: ref,
        sideCar: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$sidecar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
    }));
});
ReactRemoveScroll.classNames = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$UI$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RemoveScroll"].classNames;
const __TURBOPACK__default__export__ = ReactRemoveScroll;
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/Combination.js [app-ssr] (ecmascript) <export default as RemoveScroll>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RemoveScroll",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$Combination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$remove$2d$scroll$2f$dist$2f$es2015$2f$Combination$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-remove-scroll/dist/es2015/Combination.js [app-ssr] (ecmascript)");
}),
"[project]/Desktop/Inventory/my-app/node_modules/get-nonce/dist/es2015/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNonce",
    ()=>getNonce,
    "setNonce",
    ()=>setNonce
]);
var currentNonce;
var setNonce = function(nonce) {
    currentNonce = nonce;
};
var getNonce = function() {
    if (currentNonce) {
        return currentNonce;
    }
    if (typeof __webpack_nonce__ !== 'undefined') {
        return __webpack_nonce__;
    }
    return undefined;
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/singleton.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stylesheetSingleton",
    ()=>stylesheetSingleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$get$2d$nonce$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/get-nonce/dist/es2015/index.js [app-ssr] (ecmascript)");
;
function makeStyleTag() {
    if (!document) return null;
    var tag = document.createElement('style');
    tag.type = 'text/css';
    var nonce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$get$2d$nonce$2f$dist$2f$es2015$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getNonce"])();
    if (nonce) {
        tag.setAttribute('nonce', nonce);
    }
    return tag;
}
function injectStyles(tag, css) {
    // @ts-ignore
    if (tag.styleSheet) {
        // @ts-ignore
        tag.styleSheet.cssText = css;
    } else {
        tag.appendChild(document.createTextNode(css));
    }
}
function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(tag);
}
var stylesheetSingleton = function() {
    var counter = 0;
    var stylesheet = null;
    return {
        add: function(style) {
            if (counter == 0) {
                if (stylesheet = makeStyleTag()) {
                    injectStyles(stylesheet, style);
                    insertStyleTag(stylesheet);
                }
            }
            counter++;
        },
        remove: function() {
            counter--;
            if (!counter && stylesheet) {
                stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
                stylesheet = null;
            }
        }
    };
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/hook.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "styleHookSingleton",
    ()=>styleHookSingleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$singleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/singleton.js [app-ssr] (ecmascript)");
;
;
var styleHookSingleton = function() {
    var sheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$singleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stylesheetSingleton"])();
    return function(styles, isDynamic) {
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](function() {
            sheet.add(styles);
            return function() {
                sheet.remove();
            };
        }, [
            styles && isDynamic
        ]);
    };
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/component.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "styleSingleton",
    ()=>styleSingleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$hook$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/hook.js [app-ssr] (ecmascript)");
;
var styleSingleton = function() {
    var useStyle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$hook$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styleHookSingleton"])();
    var Sheet = function(_a) {
        var styles = _a.styles, dynamic = _a.dynamic;
        useStyle(styles, dynamic);
        return null;
    };
    return Sheet;
};
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/index.js [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$component$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/component.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$singleton$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/singleton.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$react$2d$style$2d$singleton$2f$dist$2f$es2015$2f$hook$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/react-style-singleton/dist/es2015/hook.js [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "production" !== ("TURBOPACK compile-time value", "development") && function() {
    function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    function useSyncExternalStore$2(subscribe, getSnapshot) {
        didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
        var value = getSnapshot();
        if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
        }
        cachedValue = useState({
            inst: {
                value: value,
                getSnapshot: getSnapshot
            }
        });
        var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
        useLayoutEffect(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            checkIfSnapshotChanged(inst) && forceUpdate({
                inst: inst
            });
        }, [
            subscribe,
            value,
            getSnapshot
        ]);
        useEffect(function() {
            checkIfSnapshotChanged(inst) && forceUpdate({
                inst: inst
            });
            return subscribe(function() {
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
            });
        }, [
            subscribe
        ]);
        useDebugValue(value);
        return value;
    }
    function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        inst = inst.value;
        try {
            var nextValue = latestGetSnapshot();
            return !objectIs(inst, nextValue);
        } catch (error) {
            return !0;
        }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
        return getSnapshot();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = ("TURBOPACK compile-time truthy", 1) ? useSyncExternalStore$1 : "TURBOPACK unreachable";
    exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/Desktop/Inventory/my-app/node_modules/use-sync-external-store/shim/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/Desktop/Inventory/my-app/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-ssr] (ecmascript)");
}
}),
"[project]/Desktop/Inventory/my-app/node_modules/goober/dist/goober.modern.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "css",
    ()=>u,
    "extractCss",
    ()=>r,
    "glob",
    ()=>b,
    "keyframes",
    ()=>h,
    "setup",
    ()=>m,
    "styled",
    ()=>w
]);
let e = {
    data: ""
}, t = (t)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return t || e;
}, r = (e)=>{
    let r = t(e), l = r.data;
    return r.data = "", l;
}, l = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g, a = /\/\*[^]*?\*\/|  +/g, n = /\n+/g, o = (e, t)=>{
    let r = "", l = "", a = "";
    for(let n in e){
        let c = e[n];
        "@" == n[0] ? "i" == n[1] ? r = n + " " + c + ";" : l += "f" == n[1] ? o(c, n) : n + "{" + o(c, "k" == n[1] ? "" : t) + "}" : "object" == typeof c ? l += o(c, t ? t.replace(/([^,])+/g, (e)=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g, (t)=>/&/.test(t) ? t.replace(/&/g, e) : e ? e + " " + t : t)) : n) : null != c && (n = /^--/.test(n) ? n : n.replace(/[A-Z]/g, "-$&").toLowerCase(), a += o.p ? o.p(n, c) : n + ":" + c + ";");
    }
    return r + (t && a ? t + "{" + a + "}" : a) + l;
}, c = {}, s = (e)=>{
    if ("object" == typeof e) {
        let t = "";
        for(let r in e)t += r + s(e[r]);
        return t;
    }
    return e;
}, i = (e, t, r, i, p)=>{
    let u = s(e), d = c[u] || (c[u] = ((e)=>{
        let t = 0, r = 11;
        for(; t < e.length;)r = 101 * r + e.charCodeAt(t++) >>> 0;
        return "go" + r;
    })(u));
    if (!c[d]) {
        let t = u !== e ? e : ((e)=>{
            let t, r, o = [
                {}
            ];
            for(; t = l.exec(e.replace(a, ""));)t[4] ? o.shift() : t[3] ? (r = t[3].replace(n, " ").trim(), o.unshift(o[0][r] = o[0][r] || {})) : o[0][t[1]] = t[2].replace(n, " ").trim();
            return o[0];
        })(e);
        c[d] = o(p ? {
            ["@keyframes " + d]: t
        } : t, r ? "" : "." + d);
    }
    let f = r && c.g ? c.g : null;
    return r && (c.g = c[d]), ((e, t, r, l)=>{
        l ? t.data = t.data.replace(l, e) : -1 === t.data.indexOf(e) && (t.data = r ? e + t.data : t.data + e);
    })(c[d], t, i, f), d;
}, p = (e, t, r)=>e.reduce((e, l, a)=>{
        let n = t[a];
        if (n && n.call) {
            let e = n(r), t = e && e.props && e.props.className || /^go/.test(e) && e;
            n = t ? "." + t : e && "object" == typeof e ? e.props ? "" : o(e, "") : !1 === e ? "" : e;
        }
        return e + l + (null == n ? "" : n);
    }, "");
function u(e) {
    let r = this || {}, l = e.call ? e(r.p) : e;
    return i(l.unshift ? l.raw ? p(l, [].slice.call(arguments, 1), r.p) : l.reduce((e, t)=>Object.assign(e, t && t.call ? t(r.p) : t), {}) : l, t(r.target), r.g, r.o, r.k);
}
let d, f, g, b = u.bind({
    g: 1
}), h = u.bind({
    k: 1
});
function m(e, t, r, l) {
    o.p = t, d = e, f = r, g = l;
}
function w(e, t) {
    let r = this || {};
    return function() {
        let l = arguments;
        function a(n, o) {
            let c = Object.assign({}, n), s = c.className || a.className;
            r.p = Object.assign({
                theme: f && f()
            }, c), r.o = / *go\d+/.test(s), c.className = u.apply(r, l) + (s ? " " + s : ""), t && (c.ref = o);
            let i = e;
            return e[0] && (i = c.as || e, delete c.as), g && i[0] && g(c), d(i, c);
        }
        return t ? t(a) : a;
    };
}
;
}),
"[project]/Desktop/Inventory/my-app/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CheckmarkIcon",
    ()=>L,
    "ErrorIcon",
    ()=>C,
    "LoaderIcon",
    ()=>F,
    "ToastBar",
    ()=>N,
    "ToastIcon",
    ()=>$,
    "Toaster",
    ()=>Fe,
    "default",
    ()=>zt,
    "resolveValue",
    ()=>h,
    "toast",
    ()=>n,
    "useToaster",
    ()=>w,
    "useToasterStore",
    ()=>V
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Inventory/my-app/node_modules/goober/dist/goober.modern.js [app-ssr] (ecmascript)");
"use client";
var Z = (e)=>typeof e == "function", h = (e, t)=>Z(e) ? e(t) : e;
var W = (()=>{
    let e = 0;
    return ()=>(++e).toString();
})(), E = (()=>{
    let e;
    return ()=>{
        if (e === void 0 && ("TURBOPACK compile-time value", "undefined") < "u") {
            let t = matchMedia("(prefers-reduced-motion: reduce)");
            e = !t || t.matches;
        }
        return e;
    };
})();
;
var re = 20, k = "default";
var H = (e, t)=>{
    let { toastLimit: o } = e.settings;
    switch(t.type){
        case 0:
            return {
                ...e,
                toasts: [
                    t.toast,
                    ...e.toasts
                ].slice(0, o)
            };
        case 1:
            return {
                ...e,
                toasts: e.toasts.map((r)=>r.id === t.toast.id ? {
                        ...r,
                        ...t.toast
                    } : r)
            };
        case 2:
            let { toast: s } = t;
            return H(e, {
                type: e.toasts.find((r)=>r.id === s.id) ? 1 : 0,
                toast: s
            });
        case 3:
            let { toastId: a } = t;
            return {
                ...e,
                toasts: e.toasts.map((r)=>r.id === a || a === void 0 ? {
                        ...r,
                        dismissed: !0,
                        visible: !1
                    } : r)
            };
        case 4:
            return t.toastId === void 0 ? {
                ...e,
                toasts: []
            } : {
                ...e,
                toasts: e.toasts.filter((r)=>r.id !== t.toastId)
            };
        case 5:
            return {
                ...e,
                pausedAt: t.time
            };
        case 6:
            let i = t.time - (e.pausedAt || 0);
            return {
                ...e,
                pausedAt: void 0,
                toasts: e.toasts.map((r)=>({
                        ...r,
                        pauseDuration: r.pauseDuration + i
                    }))
            };
    }
}, v = [], j = {
    toasts: [],
    pausedAt: void 0,
    settings: {
        toastLimit: re
    }
}, f = {}, Y = (e, t = k)=>{
    f[t] = H(f[t] || j, e), v.forEach(([o, s])=>{
        o === t && s(f[t]);
    });
}, _ = (e)=>Object.keys(f).forEach((t)=>Y(e, t)), Q = (e)=>Object.keys(f).find((t)=>f[t].toasts.some((o)=>o.id === e)), S = (e = k)=>(t)=>{
        Y(t, e);
    }, se = {
    blank: 4e3,
    error: 4e3,
    success: 2e3,
    loading: 1 / 0,
    custom: 4e3
}, V = (e = {}, t = k)=>{
    let [o, s] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(f[t] || j), a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(f[t]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>(a.current !== f[t] && s(f[t]), v.push([
            t,
            s
        ]), ()=>{
            let r = v.findIndex(([l])=>l === t);
            r > -1 && v.splice(r, 1);
        }), [
        t
    ]);
    let i = o.toasts.map((r)=>{
        var l, g, T;
        return {
            ...e,
            ...e[r.type],
            ...r,
            removeDelay: r.removeDelay || ((l = e[r.type]) == null ? void 0 : l.removeDelay) || (e == null ? void 0 : e.removeDelay),
            duration: r.duration || ((g = e[r.type]) == null ? void 0 : g.duration) || (e == null ? void 0 : e.duration) || se[r.type],
            style: {
                ...e.style,
                ...(T = e[r.type]) == null ? void 0 : T.style,
                ...r.style
            }
        };
    });
    return {
        ...o,
        toasts: i
    };
};
var ie = (e, t = "blank", o)=>({
        createdAt: Date.now(),
        visible: !0,
        dismissed: !1,
        type: t,
        ariaProps: {
            role: "status",
            "aria-live": "polite"
        },
        message: e,
        pauseDuration: 0,
        ...o,
        id: (o == null ? void 0 : o.id) || W()
    }), P = (e)=>(t, o)=>{
        let s = ie(t, e, o);
        return S(s.toasterId || Q(s.id))({
            type: 2,
            toast: s
        }), s.id;
    }, n = (e, t)=>P("blank")(e, t);
n.error = P("error");
n.success = P("success");
n.loading = P("loading");
n.custom = P("custom");
n.dismiss = (e, t)=>{
    let o = {
        type: 3,
        toastId: e
    };
    t ? S(t)(o) : _(o);
};
n.dismissAll = (e)=>n.dismiss(void 0, e);
n.remove = (e, t)=>{
    let o = {
        type: 4,
        toastId: e
    };
    t ? S(t)(o) : _(o);
};
n.removeAll = (e)=>n.remove(void 0, e);
n.promise = (e, t, o)=>{
    let s = n.loading(t.loading, {
        ...o,
        ...o == null ? void 0 : o.loading
    });
    return typeof e == "function" && (e = e()), e.then((a)=>{
        let i = t.success ? h(t.success, a) : void 0;
        return i ? n.success(i, {
            id: s,
            ...o,
            ...o == null ? void 0 : o.success
        }) : n.dismiss(s), a;
    }).catch((a)=>{
        let i = t.error ? h(t.error, a) : void 0;
        i ? n.error(i, {
            id: s,
            ...o,
            ...o == null ? void 0 : o.error
        }) : n.dismiss(s);
    }), e;
};
;
var ce = 1e3, w = (e, t = "default")=>{
    let { toasts: o, pausedAt: s } = V(e, t), a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map).current, i = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((c, m = ce)=>{
        if (a.has(c)) return;
        let p = setTimeout(()=>{
            a.delete(c), r({
                type: 4,
                toastId: c
            });
        }, m);
        a.set(c, p);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (s) return;
        let c = Date.now(), m = o.map((p)=>{
            if (p.duration === 1 / 0) return;
            let R = (p.duration || 0) + p.pauseDuration - (c - p.createdAt);
            if (R < 0) {
                p.visible && n.dismiss(p.id);
                return;
            }
            return setTimeout(()=>n.dismiss(p.id, t), R);
        });
        return ()=>{
            m.forEach((p)=>p && clearTimeout(p));
        };
    }, [
        o,
        s,
        t
    ]);
    let r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(S(t), [
        t
    ]), l = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        r({
            type: 5,
            time: Date.now()
        });
    }, [
        r
    ]), g = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((c, m)=>{
        r({
            type: 1,
            toast: {
                id: c,
                height: m
            }
        });
    }, [
        r
    ]), T = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        s && r({
            type: 6,
            time: Date.now()
        });
    }, [
        s,
        r
    ]), d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((c, m)=>{
        let { reverseOrder: p = !1, gutter: R = 8, defaultPosition: z } = m || {}, O = o.filter((u)=>(u.position || z) === (c.position || z) && u.height), K = O.findIndex((u)=>u.id === c.id), B = O.filter((u, I)=>I < K && u.visible).length;
        return O.filter((u)=>u.visible).slice(...p ? [
            B + 1
        ] : [
            0,
            B
        ]).reduce((u, I)=>u + (I.height || 0) + R, 0);
    }, [
        o
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        o.forEach((c)=>{
            if (c.dismissed) i(c.id, c.removeDelay);
            else {
                let m = a.get(c.id);
                m && (clearTimeout(m), a.delete(c.id));
            }
        });
    }, [
        o,
        i
    ]), {
        toasts: o,
        handlers: {
            updateHeight: g,
            startPause: l,
            endPause: T,
            calculateOffset: d
        }
    };
};
;
;
;
;
;
var de = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`, me = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`, le = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`, C = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styled"])("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e)=>e.primary || "#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${de} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${me} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${(e)=>e.secondary || "#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${le} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`;
;
var Te = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`, F = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styled"])("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${(e)=>e.secondary || "#e0e0e0"};
  border-right-color: ${(e)=>e.primary || "#616161"};
  animation: ${Te} 1s linear infinite;
`;
;
var ge = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`, he = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`, L = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styled"])("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${(e)=>e.primary || "#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ge} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${he} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${(e)=>e.secondary || "#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`;
var be = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styled"])("div")`
  position: absolute;
`, Se = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styled"])("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`, Ae = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"]`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`, Pe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styled"])("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ae} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`, $ = ({ toast: e })=>{
    let { icon: t, type: o, iconTheme: s } = e;
    return t !== void 0 ? typeof t == "string" ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](Pe, null, t) : t : o === "blank" ? null : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](Se, null, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](F, {
        ...s
    }), o !== "loading" && __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](be, null, o === "error" ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](C, {
        ...s
    }) : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](L, {
        ...s
    })));
};
var Re = (e)=>`
0% {transform: translate3d(0,${e * -200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`, Ee = (e)=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e * -150}%,-1px) scale(.6); opacity:0;}
`, ve = "0%{opacity:0;} 100%{opacity:1;}", De = "0%{opacity:1;} 100%{opacity:0;}", Oe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styled"])("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`, Ie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["styled"])("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`, ke = (e, t)=>{
    let s = e.includes("top") ? 1 : -1, [a, i] = E() ? [
        ve,
        De
    ] : [
        Re(s),
        Ee(s)
    ];
    return {
        animation: t ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"])(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards` : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keyframes"])(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`
    };
}, N = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"](({ toast: e, position: t, style: o, children: s })=>{
    let a = e.height ? ke(e.position || t || "top-center", e.visible) : {
        opacity: 0
    }, i = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]($, {
        toast: e
    }), r = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](Ie, {
        ...e.ariaProps
    }, h(e.message, e));
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](Oe, {
        className: e.className,
        style: {
            ...a,
            ...o,
            ...e.style
        }
    }, typeof s == "function" ? s({
        icon: i,
        message: r
    }) : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], null, i, r));
});
;
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setup"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]);
var we = ({ id: e, className: t, style: o, onHeightUpdate: s, children: a })=>{
    let i = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((r)=>{
        if (r) {
            let l = ()=>{
                let g = r.getBoundingClientRect().height;
                s(e, g);
            };
            l(), new MutationObserver(l).observe(r, {
                subtree: !0,
                childList: !0,
                characterData: !0
            });
        }
    }, [
        e,
        s
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("div", {
        ref: i,
        className: t,
        style: o
    }, a);
}, Me = (e, t)=>{
    let o = e.includes("top"), s = o ? {
        top: 0
    } : {
        bottom: 0
    }, a = e.includes("center") ? {
        justifyContent: "center"
    } : e.includes("right") ? {
        justifyContent: "flex-end"
    } : {};
    return {
        left: 0,
        right: 0,
        display: "flex",
        position: "absolute",
        transition: E() ? void 0 : "all 230ms cubic-bezier(.21,1.02,.73,1)",
        transform: `translateY(${t * (o ? 1 : -1)}px)`,
        ...s,
        ...a
    };
}, Ce = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$goober$2f$dist$2f$goober$2e$modern$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["css"]`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`, D = 16, Fe = ({ reverseOrder: e, position: t = "top-center", toastOptions: o, gutter: s, children: a, toasterId: i, containerStyle: r, containerClassName: l })=>{
    let { toasts: g, handlers: T } = w(o, i);
    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"]("div", {
        "data-rht-toaster": i || "",
        style: {
            position: "fixed",
            zIndex: 9999,
            top: D,
            left: D,
            right: D,
            bottom: D,
            pointerEvents: "none",
            ...r
        },
        className: l,
        onMouseEnter: T.startPause,
        onMouseLeave: T.endPause
    }, g.map((d)=>{
        let c = d.position || t, m = T.calculateOffset(d, {
            reverseOrder: e,
            gutter: s,
            defaultPosition: t
        }), p = Me(c, m);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](we, {
            id: d.id,
            key: d.id,
            onHeightUpdate: T.updateHeight,
            className: d.visible ? Ce : "",
            style: p
        }, d.type === "custom" ? h(d.message, d) : a ? a(d) : __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Inventory$2f$my$2d$app$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createElement"](N, {
            toast: d,
            position: c
        }));
    }));
};
var zt = n;
;
 //# sourceMappingURL=index.mjs.map
}),
];

//# sourceMappingURL=65e54_f4bb3d58._.js.map