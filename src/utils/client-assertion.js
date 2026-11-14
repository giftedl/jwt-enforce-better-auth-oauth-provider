"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrivateHostname = isPrivateHostname;
exports.consumeClientAssertion = consumeClientAssertion;
exports.verifyClientAssertion = verifyClientAssertion;
var internal_1 = require("@better-auth/core/db/internal");
var oauth2_1 = require("@better-auth/core/oauth2");
var host_1 = require("@better-auth/core/utils/host");
var hash_1 = require("@better-auth/utils/hash");
var better_call_1 = require("better-call");
var jose_1 = require("jose");
var authorize_1 = require("../authorize");
var client_jwks_1 = require("../client-jwks");
var extensions_1 = require("../extensions");
var index_1 = require("./index");
// Provider-scoped JWKS URI caches with 5-minute TTL and bounded size.
var jwksCaches = new WeakMap();
var JWKS_CACHE_TTL_MS = 5 * 60 * 1000;
var JWKS_CACHE_MAX_ENTRIES = 500;
var JWKS_FETCH_TIMEOUT_MS = 5000;
var MAX_JWKS_RESPONSE_BYTES = 64 * 1024;
var JSON_CONTENT_TYPE = /^application\/(?:[-\w.]+\+)?json\s*(?:;|$)/i;
function setJwksCache(jwksCache, cacheKey, jwks, fetchedAt) {
    jwksCache.set(cacheKey, { jwks: jwks, fetchedAt: fetchedAt });
    if (jwksCache.size > JWKS_CACHE_MAX_ENTRIES) {
        // Evict oldest entry (Map iterates in insertion order)
        var oldest = jwksCache.keys().next().value;
        if (oldest !== undefined)
            jwksCache.delete(oldest);
    }
}
function getJwksCache(opts) {
    var existingCache = jwksCaches.get(opts);
    if (existingCache)
        return existingCache;
    var cache = new Map();
    jwksCaches.set(opts, cache);
    return cache;
}
function getJwksCacheKey(client) {
    var _a, _b;
    return "".concat((_a = client.clientDiscoveryId) !== null && _a !== void 0 ? _a : "managed", ":").concat((_b = client.jwksUri) !== null && _b !== void 0 ? _b : "");
}
var ALGORITHMS_LIST = __spreadArray([], oauth2_1.PRIVATE_KEY_JWT_SIGNING_ALGORITHMS, true);
/**
 * SSRF gate for user-supplied server-side fetch targets (`jwks_uri`,
 * `backchannel_logout_uri`): returns true when the host is NOT publicly
 * routable. That covers loopback, RFC 1918 private, link-local (including AWS
 * IMDS `169.254.169.254`), shared-address-space (carrier-grade NAT),
 * IPv4-mapped IPv6, 6to4/NAT64/Teredo tunnels, every other RFC 6890
 * special-purpose range, and cloud-metadata FQDNs.
 *
 * Delegates to the audited single source of truth so this check cannot drift
 * into the kind of encoding bypass that bespoke regexes invite. This is a
 * syntactic check only: it does not resolve DNS, so a public name that
 * resolves to a private address at fetch time is not caught here.
 */
function isPrivateHostname(hostname) {
    return !(0, host_1.isPublicRoutableHost)(hostname);
}
function validateJwksUri(ctx, jwksUri, clientIdUrlOrigin) {
    var parsed = new URL(jwksUri);
    if (parsed.protocol !== "https:") {
        throw new better_call_1.APIError("BAD_REQUEST", {
            error_description: "jwks_uri must use HTTPS",
            error: "invalid_client",
        });
    }
    if (parsed.username || parsed.password) {
        throw new better_call_1.APIError("BAD_REQUEST", {
            error_description: "jwks_uri must not contain credentials",
            error: "invalid_client",
        });
    }
    // URL.hash is empty for a bare trailing `#`, so inspect the source value.
    if (jwksUri.includes("#")) {
        throw new better_call_1.APIError("BAD_REQUEST", {
            error_description: "jwks_uri must not include a fragment component",
            error: "invalid_client",
        });
    }
    if (isPrivateHostname(parsed.hostname)) {
        throw new better_call_1.APIError("BAD_REQUEST", {
            error_description: "jwks_uri must not point to a private or reserved address",
            error: "invalid_client",
        });
    }
    // Trust a jwks_uri that shares origin with a URL-format client_id: the
    // discovery that installed the client has already verified the
    // client_id URL, and same-origin jwks_uri is part of that verification.
    if (clientIdUrlOrigin && parsed.origin === clientIdUrlOrigin) {
        return;
    }
    if (!ctx.context.isTrustedOrigin(parsed.href)) {
        throw new better_call_1.APIError("BAD_REQUEST", {
            error_description: "client jwks_uri is not trusted",
            error: "invalid_client",
        });
    }
}
function urlClientIdOrigin(clientId) {
    try {
        var parsed = new URL(clientId);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
            return undefined;
        }
        return parsed.origin;
    }
    catch (_a) {
        return undefined;
    }
}
function readBoundedResponseBody(response) {
    return __awaiter(this, void 0, void 0, function () {
        var contentLength, reader, chunks, totalBytes, _a, done, value, bytes, offset, _i, chunks_1, chunk;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    contentLength = response.headers.get("content-length");
                    if (!(contentLength !== null &&
                        Number.isFinite(Number(contentLength)) &&
                        Number(contentLength) > MAX_JWKS_RESPONSE_BYTES)) return [3 /*break*/, 2];
                    return [4 /*yield*/, ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel())];
                case 1:
                    _c.sent();
                    throw new Error("JWKS response exceeds 64 KiB");
                case 2:
                    if (!response.body) {
                        return [2 /*return*/, ""];
                    }
                    reader = response.body.getReader();
                    chunks = [];
                    totalBytes = 0;
                    _c.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 7];
                    return [4 /*yield*/, reader.read()];
                case 4:
                    _a = _c.sent(), done = _a.done, value = _a.value;
                    if (done)
                        return [3 /*break*/, 7];
                    totalBytes += value.byteLength;
                    if (!(totalBytes > MAX_JWKS_RESPONSE_BYTES)) return [3 /*break*/, 6];
                    return [4 /*yield*/, reader.cancel()];
                case 5:
                    _c.sent();
                    throw new Error("JWKS response exceeds 64 KiB");
                case 6:
                    chunks.push(value);
                    return [3 /*break*/, 3];
                case 7:
                    bytes = new Uint8Array(totalBytes);
                    offset = 0;
                    for (_i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
                        chunk = chunks_1[_i];
                        bytes.set(chunk, offset);
                        offset += chunk.byteLength;
                    }
                    return [2 /*return*/, new TextDecoder().decode(bytes)];
            }
        });
    });
}
function fetchJwksFromUri(jwksUri_1) {
    return __awaiter(this, arguments, void 0, function (jwksUri, fetchClientMetadataResource) {
        var controller, timeout, response, contentType, responseBody, parsedBody, result;
        if (fetchClientMetadataResource === void 0) { fetchClientMetadataResource = globalThis.fetch; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = new AbortController();
                    timeout = setTimeout(function () { return controller.abort(); }, JWKS_FETCH_TIMEOUT_MS);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, fetchClientMetadataResource(jwksUri, {
                            signal: controller.signal,
                            headers: { accept: "application/json" },
                            redirect: "error",
                        })];
                case 2:
                    response = _a.sent();
                    if (response.redirected) {
                        throw new Error("JWKS fetch redirected");
                    }
                    if (response.status !== 200) {
                        throw new Error("JWKS fetch returned ".concat(response.status));
                    }
                    contentType = response.headers.get("content-type");
                    if (!contentType || !JSON_CONTENT_TYPE.test(contentType)) {
                        throw new Error("JWKS response must use a JSON media type");
                    }
                    return [4 /*yield*/, readBoundedResponseBody(response)];
                case 3:
                    responseBody = _a.sent();
                    parsedBody = void 0;
                    try {
                        parsedBody = JSON.parse(responseBody);
                    }
                    catch (_b) {
                        return [2 /*return*/, { valid: false }];
                    }
                    result = (0, client_jwks_1.validatePublicClientJwks)(parsedBody);
                    if (!result.valid) {
                        return [2 /*return*/, { valid: false }];
                    }
                    return [2 /*return*/, { valid: true, jwks: result.jwks }];
                case 4:
                    clearTimeout(timeout);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createClientJwksFetchError() {
    return new better_call_1.APIError("BAD_REQUEST", {
        error_description: "failed to fetch client JWKS",
        error: "invalid_client",
    });
}
function fetchClientJwks(ctx, opts, client) {
    return __awaiter(this, void 0, void 0, function () {
        var discovery, now, cacheKey, jwksCache, cached, result, _a, staleLimitMs;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (client.jwks) {
                        return [2 /*return*/, JSON.parse(client.jwks)];
                    }
                    if (!client.jwksUri) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client has no JWKS configured",
                            error: "invalid_client",
                        });
                    }
                    discovery = client.clientDiscoveryId
                        ? (0, extensions_1.getClientDiscoveries)(opts).find(function (candidate) { return candidate.id === client.clientDiscoveryId; })
                        : undefined;
                    if (client.clientDiscoveryId && !(discovery === null || discovery === void 0 ? void 0 : discovery.fetchClientMetadataResource)) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client discovery does not provide a metadata resource transport",
                            error: "invalid_client",
                        });
                    }
                    validateJwksUri(ctx, client.jwksUri, client.clientDiscoveryId ? urlClientIdOrigin(client.clientId) : undefined);
                    now = Date.now();
                    cacheKey = getJwksCacheKey(client);
                    jwksCache = getJwksCache(opts);
                    cached = jwksCache.get(cacheKey);
                    if (cached && now - cached.fetchedAt < JWKS_CACHE_TTL_MS) {
                        return [2 /*return*/, cached.jwks];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchJwksFromUri(client.jwksUri, discovery === null || discovery === void 0 ? void 0 : discovery.fetchClientMetadataResource)];
                case 2:
                    result = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    staleLimitMs = JWKS_CACHE_TTL_MS * 2;
                    if (cached && now - cached.fetchedAt < staleLimitMs) {
                        return [2 /*return*/, cached.jwks];
                    }
                    throw createClientJwksFetchError();
                case 4:
                    if (!result.valid)
                        throw createClientJwksFetchError();
                    setJwksCache(jwksCache, cacheKey, result.jwks, now);
                    return [2 /*return*/, result.jwks];
            }
        });
    });
}
/**
 * Refetch JWKS from jwks_uri when signature verification fails with cached keys.
 * Handles key rotation: the client may have published a new key that isn't in our cache yet.
 */
function refetchClientJwks(opts, client) {
    return __awaiter(this, void 0, void 0, function () {
        var discovery, result, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!client.jwksUri)
                        return [2 /*return*/, null];
                    discovery = client.clientDiscoveryId
                        ? (0, extensions_1.getClientDiscoveries)(opts).find(function (candidate) { return candidate.id === client.clientDiscoveryId; })
                        : undefined;
                    if (client.clientDiscoveryId && !(discovery === null || discovery === void 0 ? void 0 : discovery.fetchClientMetadataResource)) {
                        return [2 /*return*/, null];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchJwksFromUri(client.jwksUri, discovery === null || discovery === void 0 ? void 0 : discovery.fetchClientMetadataResource)];
                case 2:
                    result = _b.sent();
                    if (!result.valid)
                        return [2 /*return*/, null];
                    setJwksCache(getJwksCache(opts), getJwksCacheKey(client), result.jwks, Date.now());
                    return [2 /*return*/, result.jwks];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Enforces the assertion-hygiene claims every client-assertion authentication
 * method must check, independent of how the signature is verified or where the
 * verification keys come from:
 * - `aud` MUST include `expectedAudience` (RFC 7523 §3 rule 3),
 * - `exp` MUST be present, unexpired, and at most `assertionMaxLifetime`
 *   seconds away (RFC 7523 §3 rule 4),
 * - `iat`, when present, MUST be within `assertionMaxLifetime`,
 * - `jti` MUST be present and single-use; this consumes a replay tombstone keyed
 *   by `` `${namespace}:${jti}` ``, inserted under the adapter's primary key so a
 *   replay across workers fails atomically.
 *
 * A custom {@link OAuthClientAuthenticationStrategy} should call this after
 * verifying the assertion signature, so an extension method inherits the same
 * replay, lifetime, and audience guarantees as the built-in `private_key_jwt`
 * path, which calls it too.
 *
 * @param params.namespace Scopes the replay tombstone to the method and client,
 *   e.g. `` `${method}:${clientId}` ``, so the same `jti` can recur across
 *   distinct methods or clients but never within one.
 */
function consumeClientAssertion(ctx, opts, params) {
    return __awaiter(this, void 0, void 0, function () {
        var namespace, payload, expectedAudience, audiences, maxLifetime, now, jtiDigest, jtiId, createErr_1, alreadyUsed, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    namespace = params.namespace, payload = params.payload, expectedAudience = params.expectedAudience;
                    audiences = Array.isArray(payload.aud)
                        ? payload.aud
                        : payload.aud != null
                            ? [payload.aud]
                            : [];
                    if (!audiences.includes(expectedAudience)) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client assertion aud does not match the endpoint",
                            error: "invalid_client",
                        });
                    }
                    maxLifetime = (_c = opts.assertionMaxLifetime) !== null && _c !== void 0 ? _c : 300;
                    now = Math.floor(Date.now() / 1000);
                    if (typeof payload.exp !== "number") {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client assertion must include exp claim",
                            error: "invalid_client",
                        });
                    }
                    // An extension strategy relies on this; the built-in path has jose reject
                    // expiry before this runs.
                    if (payload.exp <= now) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client assertion has expired",
                            error: "invalid_client",
                        });
                    }
                    // Cap the window so exp cannot outlive the jti tombstone.
                    if (payload.exp - now > maxLifetime) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client assertion exp is too far in the future (max ".concat(maxLifetime, "s)"),
                            error: "invalid_client",
                        });
                    }
                    if (typeof payload.iat === "number" && now - payload.iat > maxLifetime) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client assertion iat is too far in the past (max ".concat(maxLifetime, "s)"),
                            error: "invalid_client",
                        });
                    }
                    if (typeof payload.jti !== "string" || payload.jti.length === 0) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client assertion must include jti claim",
                            error: "invalid_client",
                        });
                    }
                    return [4 /*yield*/, (0, hash_1.createHash)("SHA-256").digest(new TextEncoder().encode("".concat(namespace, ":").concat(payload.jti)))];
                case 1:
                    jtiDigest = _d.sent();
                    jtiId = (0, internal_1.encodeDeterministicId)(new Uint8Array(jtiDigest).slice(0, 24), ctx.context.options, { adapter: ctx.context.adapter, model: "oauthClientAssertion" });
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 9]);
                    return [4 /*yield*/, ctx.context.adapter.create({
                            model: "oauthClientAssertion",
                            data: {
                                id: jtiId,
                                expiresAt: new Date(payload.exp * 1000),
                            },
                            forceAllowId: true,
                        })];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 4:
                    createErr_1 = _d.sent();
                    alreadyUsed = false;
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 7, , 8]);
                    _a = Boolean;
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: "oauthClientAssertion",
                            where: [{ field: "id", value: jtiId }],
                        })];
                case 6:
                    alreadyUsed = _a.apply(void 0, [_d.sent()]);
                    return [3 /*break*/, 8];
                case 7:
                    _b = _d.sent();
                    return [3 /*break*/, 8];
                case 8:
                    if (alreadyUsed) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client assertion jti has already been used",
                            error: "invalid_client",
                        });
                    }
                    throw createErr_1;
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * Verifies a client assertion JWT for `private_key_jwt` authentication.
 *
 * Validates: signature, iss=client_id, sub=client_id, aud=the endpoint serving
 * the assertion or the normalized OP issuer, exp, assertion max lifetime,
 * jti uniqueness (replay prevention).
 *
 * Returns the client record the signature was checked against, so a caller that
 * mutates the client can guard its write on exactly that snapshot.
 *
 * With `endpointAudienceOnly`, the issuer is not an accepted audience, so only
 * an assertion whose `aud` includes `expectedAudience` verifies. Endpoints that
 * change client credentials use it, so an assertion minted for the token
 * endpoint or the issuer cannot be redirected to them.
 *
 * `assertClient` runs on the looked-up client before any key is fetched or the
 * jti is consumed, so a caller can refuse a client it does not serve without
 * spending the assertion or reaching out to a `jwks_uri`.
 */
function verifyClientAssertion(ctx, opts, clientAssertion, clientAssertionType, clientIdHint, expectedAudience, options) {
    return __awaiter(this, void 0, void 0, function () {
        var header, unverified, clientId, client, jwks, endpointAudience, issuerAudience, acceptedAudiences, verifyOpts, payload, verifyErr_1, isKeyError, refreshed, _a, assertionAudiences, acceptedAudience;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (clientAssertionType !== oauth2_1.CLIENT_ASSERTION_TYPE) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "unsupported client_assertion_type",
                            error: "invalid_client",
                        });
                    }
                    try {
                        header = (0, jose_1.decodeProtectedHeader)(clientAssertion);
                    }
                    catch (_e) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "malformed client assertion: invalid JWT header",
                            error: "invalid_client",
                        });
                    }
                    if (!header.alg || !ALGORITHMS_LIST.includes(header.alg)) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "unsupported assertion signing algorithm: ".concat(header.alg),
                            error: "invalid_client",
                        });
                    }
                    try {
                        unverified = (0, jose_1.decodeJwt)(clientAssertion);
                    }
                    catch (_f) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "malformed client assertion: invalid JWT payload",
                            error: "invalid_client",
                        });
                    }
                    clientId = (_b = unverified.sub) !== null && _b !== void 0 ? _b : unverified.iss;
                    if (!clientId) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client assertion must contain sub or iss claim identifying the client",
                            error: "invalid_client",
                        });
                    }
                    // Validate consistency with body client_id if provided
                    if (clientIdHint && clientIdHint !== clientId) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client_id in body does not match assertion sub/iss",
                            error: "invalid_client",
                        });
                    }
                    return [4 /*yield*/, (0, index_1.getClient)(ctx, opts, clientId)];
                case 1:
                    client = _d.sent();
                    if (!client) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client not found",
                            error: "invalid_client",
                        });
                    }
                    if (client.disabled) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client is disabled",
                            error: "invalid_client",
                        });
                    }
                    if (client.tokenEndpointAuthMethod !== "private_key_jwt") {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client is not registered for private_key_jwt authentication",
                            error: "invalid_client",
                        });
                    }
                    (_c = options === null || options === void 0 ? void 0 : options.assertClient) === null || _c === void 0 ? void 0 : _c.call(options, client);
                    return [4 /*yield*/, fetchClientJwks(ctx, opts, client)];
                case 2:
                    jwks = _d.sent();
                    endpointAudience = expectedAudience !== null && expectedAudience !== void 0 ? expectedAudience : "".concat(ctx.context.baseURL, "/oauth2/token");
                    issuerAudience = (0, authorize_1.getIssuer)(ctx, opts);
                    acceptedAudiences = (options === null || options === void 0 ? void 0 : options.endpointAudienceOnly)
                        ? [endpointAudience]
                        : __spreadArray([], new Set([endpointAudience, issuerAudience]), true);
                    verifyOpts = {
                        issuer: clientId,
                        subject: clientId,
                        audience: acceptedAudiences,
                        algorithms: ALGORITHMS_LIST,
                    };
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 15]);
                    return [4 /*yield*/, (0, jose_1.jwtVerify)(clientAssertion, (0, jose_1.createLocalJWKSet)(jwks), verifyOpts)];
                case 4:
                    (payload = (_d.sent()).payload);
                    return [3 /*break*/, 15];
                case 5:
                    verifyErr_1 = _d.sent();
                    isKeyError = verifyErr_1 instanceof Error &&
                        /no matching key|no applicable key/i.test(verifyErr_1.message);
                    if (!isKeyError) return [3 /*break*/, 13];
                    return [4 /*yield*/, refetchClientJwks(opts, client)];
                case 6:
                    refreshed = _d.sent();
                    if (!refreshed) return [3 /*break*/, 11];
                    _d.label = 7;
                case 7:
                    _d.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, (0, jose_1.jwtVerify)(clientAssertion, (0, jose_1.createLocalJWKSet)(refreshed), verifyOpts)];
                case 8:
                    (payload = (_d.sent()).payload);
                    return [3 /*break*/, 10];
                case 9:
                    _a = _d.sent();
                    throw new better_call_1.APIError("UNAUTHORIZED", {
                        error_description: "client assertion signature verification failed",
                        error: "invalid_client",
                    });
                case 10: return [3 /*break*/, 12];
                case 11: throw new better_call_1.APIError("UNAUTHORIZED", {
                    error_description: "client assertion signature verification failed",
                    error: "invalid_client",
                });
                case 12: return [3 /*break*/, 14];
                case 13: throw new better_call_1.APIError("UNAUTHORIZED", {
                    error_description: "client assertion signature verification failed",
                    error: "invalid_client",
                });
                case 14: return [3 /*break*/, 15];
                case 15:
                    assertionAudiences = Array.isArray(payload.aud)
                        ? payload.aud
                        : [payload.aud];
                    acceptedAudience = assertionAudiences.find(function (value) {
                        return typeof value === "string" && acceptedAudiences.includes(value);
                    });
                    // Audience, lifetime, and jti single-use replay protection, shared with
                    // extension client-auth methods through `consumeClientAssertion` so both
                    // paths enforce RFC 7523 §3 identically. jose already matched `aud` via
                    // `verifyOpts.audience`; the helper re-checks it so it is self-sufficient for
                    // callers that verify the signature without jose.
                    return [4 /*yield*/, consumeClientAssertion(ctx, opts, {
                            namespace: "private_key_jwt:".concat(clientId),
                            payload: payload,
                            expectedAudience: acceptedAudience,
                        })];
                case 16:
                    // Audience, lifetime, and jti single-use replay protection, shared with
                    // extension client-auth methods through `consumeClientAssertion` so both
                    // paths enforce RFC 7523 §3 identically. jose already matched `aud` via
                    // `verifyOpts.audience`; the helper re-checks it so it is self-sufficient for
                    // callers that verify the signature without jose.
                    _d.sent();
                    return [2 /*return*/, { clientId: clientId, client: client }];
            }
        });
    });
}
