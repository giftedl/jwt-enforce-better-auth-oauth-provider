"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtPlugin = exports.getOAuthProviderPlugin = exports.signedQueryIssuedAtParam = exports.postLoginClearedParam = exports.getSignedQueryIssuedAt = void 0;
exports.parseBearerToken = parseBearerToken;
exports.isInvalidJwtError = isInvalidJwtError;
exports.normalizeTimestampValue = normalizeTimestampValue;
exports.resolveSessionAuthTime = resolveSessionAuthTime;
exports.toResourceList = toResourceList;
exports.toAudienceClaim = toAudienceClaim;
exports.verifyOAuthQueryParams = verifyOAuthQueryParams;
exports.assertNotTrustedClient = assertNotTrustedClient;
exports.getClient = getClient;
exports.mergeDiscoveryMetadata = mergeDiscoveryMetadata;
exports.decryptStoredClientSecret = decryptStoredClientSecret;
exports.storeClientSecret = storeClientSecret;
exports.storeToken = storeToken;
exports.getStoredToken = getStoredToken;
exports.normalizeClientAuthenticationParameters = normalizeClientAuthenticationParameters;
exports.clientAllowsGrant = clientAllowsGrant;
exports.validateClientScopes = validateClientScopes;
exports.validateClientCredentials = validateClientCredentials;
exports.parseClientMetadata = parseClientMetadata;
exports.destructureCredentials = destructureCredentials;
exports.extractClientCredentials = extractClientCredentials;
exports.parsePrompt = parsePrompt;
exports.resolveSubjectIdentifier = resolveSubjectIdentifier;
exports.getConsentReferenceId = getConsentReferenceId;
exports.findConsent = findConsent;
exports.searchParamsToQuery = searchParamsToQuery;
exports.isSessionFreshForSignedQuery = isSessionFreshForSignedQuery;
exports.removePromptFromQuery = removePromptFromQuery;
exports.removeMaxAgeFromQuery = removeMaxAgeFromQuery;
exports.isPKCERequired = isPKCERequired;
exports.isRedirectUriTransportAllowed = isRedirectUriTransportAllowed;
exports.isInsecureRedirectUriAllowed = isInsecureRedirectUriAllowed;
var error_1 = require("@better-auth/core/error");
var oauth2_1 = require("@better-auth/core/oauth2");
var host_1 = require("@better-auth/core/utils/host");
var base64_1 = require("@better-auth/utils/base64");
var hash_1 = require("@better-auth/utils/hash");
var crypto_1 = require("better-auth/crypto");
var better_call_1 = require("better-call");
var jose_1 = require("jose");
var extensions_1 = require("../extensions");
var signed_query_1 = require("../signed-query");
var signed_query_2 = require("../signed-query");
Object.defineProperty(exports, "getSignedQueryIssuedAt", { enumerable: true, get: function () { return signed_query_2.getSignedQueryIssuedAt; } });
Object.defineProperty(exports, "postLoginClearedParam", { enumerable: true, get: function () { return signed_query_2.postLoginClearedParam; } });
Object.defineProperty(exports, "signedQueryIssuedAtParam", { enumerable: true, get: function () { return signed_query_2.signedQueryIssuedAtParam; } });
/**
 * Extracts the credentials from an `Authorization: Bearer <token>` header.
 *
 * Returns `undefined` when the header is absent or carries a non-Bearer scheme,
 * leaving the caller to decide whether that is an error. Throws an
 * `invalid_request` `APIError` when the Bearer scheme is present but the
 * credentials are missing or the header carries extra parts. The scheme match
 * is case-insensitive and the credentials are the single token after it.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
 * @see https://datatracker.ietf.org/doc/html/rfc7235#section-2.1
 */
function parseBearerToken(authorization) {
    if (!authorization)
        return undefined;
    var _a = authorization
        .trim()
        .split(/\s+/), scheme = _a[0], credentials = _a[1], extraParts = _a.slice(2);
    if ((scheme === null || scheme === void 0 ? void 0 : scheme.toLowerCase()) !== "bearer")
        return undefined;
    if (!credentials || extraParts.length > 0) {
        throw new better_call_1.APIError("BAD_REQUEST", {
            error: "invalid_request",
            error_description: "Malformed Bearer Authorization header",
        });
    }
    return credentials;
}
function createTTLCache() {
    var cache = new Map();
    return {
        get: function (key) {
            var entry = cache.get(key);
            if (!entry)
                return undefined;
            if (entry.expiresAt && entry.expiresAt < new Date()) {
                cache.delete(key);
                return undefined;
            }
            return entry;
        },
        set: function (key, value) {
            cache.set(key, value);
        },
    };
}
/**
 * Gets the oAuth Provider Plugin
 * @internal
 */
var getOAuthProviderPlugin = function (ctx) {
    return ctx.getPlugin("oauth-provider");
};
exports.getOAuthProviderPlugin = getOAuthProviderPlugin;
/**
 * Gets the JWT Plugin
 * @internal
 */
var getJwtPlugin = function (ctx) {
    var plugin = ctx.getPlugin("jwt");
    if (!plugin) {
        throw new error_1.BetterAuthError("jwt_config");
    }
    return plugin;
};
exports.getJwtPlugin = getJwtPlugin;
var joseInfrastructureErrorCodes = new Set([
    jose_1.errors.JWKSTimeout.code,
    jose_1.errors.JWKSInvalid.code,
    jose_1.errors.JWKSMultipleMatchingKeys.code,
]);
/**
 * Whether a JWT verification error comes from the token itself (malformed,
 * bad signature, unsupported alg, unknown kid, failed claim checks), as
 * opposed to a key set failure that should still surface as a server error.
 *
 * @internal
 */
function isInvalidJwtError(error) {
    return (error instanceof jose_1.errors.JOSEError &&
        !joseInfrastructureErrorCodes.has(error.code));
}
/**
 * Normalizes timestamp-like values returned by adapters.
 *
 * Accepts Date instances, epoch milliseconds as numbers, and strings that are
 * either ISO dates or numeric millisecond values such as "1774295570569.0".
 */
function normalizeTimestampValue(value) {
    if (value == null) {
        return undefined;
    }
    if (value instanceof Date) {
        return Number.isFinite(value.getTime()) ? value : undefined;
    }
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            return undefined;
        }
        var parsed = new Date(value);
        return Number.isFinite(parsed.getTime()) ? parsed : undefined;
    }
    if (typeof value === "string") {
        var trimmed = value.trim();
        if (!trimmed.length) {
            return undefined;
        }
        var numeric = Number(trimmed);
        if (Number.isFinite(numeric)) {
            var parsed_1 = new Date(numeric);
            return Number.isFinite(parsed_1.getTime()) ? parsed_1 : undefined;
        }
        var parsed = new Date(trimmed);
        return Number.isFinite(parsed.getTime()) ? parsed : undefined;
    }
    return undefined;
}
/**
 * Resolves a session auth time from common adapter return shapes.
 */
function resolveSessionAuthTime(value) {
    var _a, _b;
    if (value instanceof Date) {
        return normalizeTimestampValue(value);
    }
    if (!value || typeof value !== "object") {
        return normalizeTimestampValue(value);
    }
    var direct = (_a = normalizeTimestampValue(value.createdAt)) !== null && _a !== void 0 ? _a : normalizeTimestampValue(value.created_at);
    if (direct) {
        return direct;
    }
    var nested = value.session;
    if (!nested || typeof nested !== "object") {
        return undefined;
    }
    return ((_b = normalizeTimestampValue(nested.createdAt)) !== null && _b !== void 0 ? _b : normalizeTimestampValue(nested.created_at));
}
/**
 * Normalizes OAuth resource values into a non-empty string array.
 */
function toResourceList(value) {
    if (typeof value === "string")
        return [value];
    if (!(value === null || value === void 0 ? void 0 : value.length))
        return undefined;
    return value;
}
/**
 * Normalizes audience values for JWT claims.
 */
function toAudienceClaim(audience) {
    if (typeof audience === "string")
        return audience;
    if (!(audience === null || audience === void 0 ? void 0 : audience.length))
        return undefined;
    return audience.length === 1 ? audience.at(0) : audience;
}
var trustedClientCaches = new WeakMap();
function getTrustedClientCache(options) {
    var existingCache = trustedClientCaches.get(options);
    if (existingCache)
        return existingCache;
    var cache = createTTLCache();
    trustedClientCaches.set(options, cache);
    return cache;
}
/**
 * Verify the signature and expiration of an OAuth query issued by this provider.
 * Use the provider's current auth secret on the server before displaying a
 * consent page. A valid signature does not replace client or session checks.
 */
function verifyOAuthQueryParams(oauth_query, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var queryParams, sig, sigs, exp, verifySig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryParams = new URLSearchParams(oauth_query);
                    sig = queryParams.get("sig");
                    sigs = queryParams.getAll("sig");
                    exp = Number(queryParams.get("exp"));
                    queryParams.delete("sig");
                    return [4 /*yield*/, (0, crypto_1.makeSignature)((0, signed_query_1.canonicalizeOAuthQueryParams)(queryParams).toString(), secret)];
                case 1:
                    verifySig = _a.sent();
                    return [2 /*return*/, (sigs.length === 1 &&
                            !!sig &&
                            (0, crypto_1.constantTimeEqual)(sig, verifySig) &&
                            new Date(exp * 1000) >= new Date())];
            }
        });
    });
}
/**
 * Rejects changes to a client listed in `cachedTrustedClients`. Cached trusted
 * clients are immutable through the client management endpoints.
 */
function assertNotTrustedClient(opts, clientId) {
    var _a;
    if ((_a = opts.cachedTrustedClients) === null || _a === void 0 ? void 0 : _a.has(clientId)) {
        throw new better_call_1.APIError("BAD_REQUEST", {
            error: "invalid_client",
            error_description: "trusted clients must be updated manually",
        });
    }
}
/**
 * Get a client by ID, checking trusted clients first, then database
 */
function getClient(ctx, options, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var trustedClientCache, trustedClient, dbClient, discoveries, clientDiscoveryId_1, discovery, _i, discoveries_1, discovery, resolved;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    trustedClientCache = getTrustedClientCache(options);
                    trustedClient = trustedClientCache.get(clientId);
                    if (trustedClient && !trustedClient.clientDiscoveryId) {
                        return [2 /*return*/, Object.assign({}, trustedClient)];
                    }
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: (_c = (_b = (_a = options.schema) === null || _a === void 0 ? void 0 : _a.oauthClient) === null || _b === void 0 ? void 0 : _b.modelName) !== null && _c !== void 0 ? _c : "oauthClient",
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 1:
                    dbClient = _e.sent();
                    discoveries = (0, extensions_1.getClientDiscoveries)(options);
                    if (!(dbClient === null || dbClient === void 0 ? void 0 : dbClient.clientDiscoveryId)) return [3 /*break*/, 3];
                    clientDiscoveryId_1 = dbClient.clientDiscoveryId;
                    discovery = discoveries.find(function (candidate) { return candidate.id === clientDiscoveryId_1; });
                    if (!(discovery === null || discovery === void 0 ? void 0 : discovery.matches(clientId)))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, discovery.resolve(ctx, clientId, dbClient)];
                case 2:
                    dbClient = _e.sent();
                    if (!dbClient)
                        return [2 /*return*/, null];
                    return [3 /*break*/, 8];
                case 3:
                    if (!dbClient) return [3 /*break*/, 4];
                    if ((_d = options.cachedTrustedClients) === null || _d === void 0 ? void 0 : _d.has(clientId)) {
                        trustedClientCache.set(clientId, Object.assign({}, dbClient));
                    }
                    return [2 /*return*/, dbClient];
                case 4:
                    _i = 0, discoveries_1 = discoveries;
                    _e.label = 5;
                case 5:
                    if (!(_i < discoveries_1.length)) return [3 /*break*/, 8];
                    discovery = discoveries_1[_i];
                    if (!discovery.matches(clientId))
                        return [3 /*break*/, 7];
                    return [4 /*yield*/, discovery.resolve(ctx, clientId, null)];
                case 6:
                    resolved = _e.sent();
                    if (resolved) {
                        dbClient = resolved;
                        return [3 /*break*/, 8];
                    }
                    _e.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, dbClient];
            }
        });
    });
}
/**
 * Merge `discoveryMetadata` from every contributed {@link ClientDiscovery}
 * into a single object. Entries are spread in order; later entries override
 * earlier ones on key collisions.
 *
 * @internal
 */
function mergeDiscoveryMetadata(discoveries) {
    return discoveries.reduce(function (acc, d) { var _a; return (__assign(__assign({}, acc), ((_a = d.discoveryMetadata) !== null && _a !== void 0 ? _a : {}))); }, {});
}
/**
 * Default client secret hasher using SHA-256
 *
 * @internal
 */
var defaultHasher = function (value) { return __awaiter(void 0, void 0, void 0, function () {
    var hash, hashed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, hash_1.createHash)("SHA-256").digest(new TextEncoder().encode(value))];
            case 1:
                hash = _a.sent();
                hashed = base64_1.base64Url.encode(new Uint8Array(hash), {
                    padding: false,
                });
                return [2 /*return*/, hashed];
        }
    });
}); };
/**
 * Decrypts a storedClientSecret for signing
 *
 * @internal
 */
function decryptStoredClientSecret(ctx, storageMethod, storedClientSecret) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(storageMethod === "encrypted")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, crypto_1.symmetricDecrypt)({
                            key: ctx.context.secretConfig,
                            data: storedClientSecret,
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(typeof storageMethod === "object" && "decrypt" in storageMethod)) return [3 /*break*/, 4];
                    return [4 /*yield*/, storageMethod.decrypt(storedClientSecret)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: throw new error_1.BetterAuthError("Unsupported decryption storageMethod type '".concat(storageMethod, "'"));
            }
        });
    });
}
/**
 * Verify stored client secret against provided client secret
 *
 * @internal
 */
function verifyStoredClientSecret(ctx, opts, storedClientSecret, clientSecret) {
    return __awaiter(this, void 0, void 0, function () {
        var storageMethod, hashedClientSecret, _a, _b, hashedClientSecret, _c, decryptedClientSecret, _d, decryptedClientSecret;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    storageMethod = (_e = opts.storeClientSecret) !== null && _e !== void 0 ? _e : (opts.disableJwtPlugin ? "encrypted" : "hashed");
                    if (clientSecret && ((_f = opts.prefix) === null || _f === void 0 ? void 0 : _f.clientSecret)) {
                        if (!clientSecret.startsWith(opts.prefix.clientSecret)) {
                            return [2 /*return*/, false];
                        }
                        clientSecret = clientSecret.replace(opts.prefix.clientSecret, "");
                    }
                    if (!(storageMethod === "hashed")) return [3 /*break*/, 4];
                    if (!clientSecret) return [3 /*break*/, 2];
                    return [4 /*yield*/, defaultHasher(clientSecret)];
                case 1:
                    _a = _g.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = undefined;
                    _g.label = 3;
                case 3:
                    hashedClientSecret = _a;
                    return [2 /*return*/, (!!hashedClientSecret &&
                            (0, crypto_1.constantTimeEqual)(hashedClientSecret, storedClientSecret))];
                case 4:
                    if (!(typeof storageMethod === "object" && "hash" in storageMethod)) return [3 /*break*/, 12];
                    if (!storageMethod.verify) return [3 /*break*/, 7];
                    _b = !!clientSecret;
                    if (!_b) return [3 /*break*/, 6];
                    return [4 /*yield*/, storageMethod.verify(clientSecret, storedClientSecret)];
                case 5:
                    _b = (_g.sent());
                    _g.label = 6;
                case 6: return [2 /*return*/, (_b)];
                case 7:
                    if (!clientSecret) return [3 /*break*/, 9];
                    return [4 /*yield*/, storageMethod.hash(clientSecret)];
                case 8:
                    _c = _g.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _c = undefined;
                    _g.label = 10;
                case 10:
                    hashedClientSecret = _c;
                    return [2 /*return*/, (!!hashedClientSecret &&
                            (0, crypto_1.constantTimeEqual)(hashedClientSecret, storedClientSecret))];
                case 11: return [3 /*break*/, 19];
                case 12:
                    if (!(storageMethod === "encrypted")) return [3 /*break*/, 17];
                    _g.label = 13;
                case 13:
                    _g.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, decryptStoredClientSecret(ctx, storageMethod, storedClientSecret)];
                case 14:
                    decryptedClientSecret = _g.sent();
                    return [2 /*return*/, (!!clientSecret && (0, crypto_1.constantTimeEqual)(decryptedClientSecret, clientSecret))];
                case 15:
                    _d = _g.sent();
                    return [2 /*return*/, false];
                case 16: return [3 /*break*/, 19];
                case 17:
                    if (!(typeof storageMethod === "object" && "decrypt" in storageMethod)) return [3 /*break*/, 19];
                    return [4 /*yield*/, decryptStoredClientSecret(ctx, storageMethod, storedClientSecret)];
                case 18:
                    decryptedClientSecret = _g.sent();
                    return [2 /*return*/, (!!clientSecret && (0, crypto_1.constantTimeEqual)(decryptedClientSecret, clientSecret))];
                case 19: throw new error_1.BetterAuthError("Unsupported verify storageMethod type '".concat(storageMethod, "'"));
            }
        });
    });
}
/**
 * Store client secret according to the configured storage method
 *
 * @internal
 */
function storeClientSecret(ctx, opts, clientSecret) {
    return __awaiter(this, void 0, void 0, function () {
        var storageMethod;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    storageMethod = (_a = opts.storeClientSecret) !== null && _a !== void 0 ? _a : (opts.disableJwtPlugin ? "encrypted" : "hashed");
                    if (!(storageMethod === "encrypted")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, crypto_1.symmetricEncrypt)({
                            key: ctx.context.secretConfig,
                            data: clientSecret,
                        })];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    if (!(storageMethod === "hashed")) return [3 /*break*/, 4];
                    return [4 /*yield*/, defaultHasher(clientSecret)];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    if (!(typeof storageMethod === "object" && "hash" in storageMethod)) return [3 /*break*/, 6];
                    return [4 /*yield*/, storageMethod.hash(clientSecret)];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    if (!(typeof storageMethod === "object" && "encrypt" in storageMethod)) return [3 /*break*/, 8];
                    return [4 /*yield*/, storageMethod.encrypt(clientSecret)];
                case 7: return [2 /*return*/, _b.sent()];
                case 8: throw new error_1.BetterAuthError("Unsupported storeClientSecret type '".concat(storageMethod, "'"));
            }
        });
    });
}
/**
 * Stores a token value (ie opaque tokens, refresh tokens, transaction tokens, verification codes)
 * on the database in a secure hashed format.
 *
 * @internal
 */
function storeToken() {
    return __awaiter(this, arguments, void 0, function (storageMethod, token, type) {
        if (storageMethod === void 0) { storageMethod = "hashed"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(storageMethod === "hashed")) return [3 /*break*/, 2];
                    return [4 /*yield*/, defaultHasher(token)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(typeof storageMethod === "object" && "hash" in storageMethod)) return [3 /*break*/, 4];
                    return [4 /*yield*/, storageMethod.hash(token, type)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: throw new error_1.BetterAuthError("storeToken: unsupported storageMethod type '".concat(storageMethod, "'"));
            }
        });
    });
}
/**
 * Gets a hashed token value to find on the database.
 *
 * @internal
 */
function getStoredToken() {
    return __awaiter(this, arguments, void 0, function (storageMethod, token, type) {
        var hashedToken, hashedToken;
        if (storageMethod === void 0) { storageMethod = "hashed"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(storageMethod === "hashed")) return [3 /*break*/, 2];
                    return [4 /*yield*/, defaultHasher(token)];
                case 1:
                    hashedToken = _a.sent();
                    return [2 /*return*/, hashedToken];
                case 2:
                    if (!(typeof storageMethod === "object" && "hash" in storageMethod)) return [3 /*break*/, 4];
                    return [4 /*yield*/, storageMethod.hash(token, type)];
                case 3:
                    hashedToken = _a.sent();
                    return [2 /*return*/, hashedToken];
                case 4: throw new error_1.BetterAuthError("getStoredToken: unsupported storageMethod type '".concat(storageMethod, "'"));
            }
        });
    });
}
/**
 * Converts a BASIC authorization header
 * into its client_id and client_secret representation
 *
 * @internal
 */
// RFC 7235 §2.1: the auth scheme is case-insensitive and is followed by
// one or more SP. Match liberally so requests using `basic` or extra
// spaces aren't rejected before reaching the spec-correct decoder.
var BASIC_SCHEME_PREFIX = /^Basic +/i;
var AUTH_SCHEME_TOKEN = /^([!#$%&'*+\-.^_`|~0-9A-Za-z]+)(?=\s|$)/;
function parseAuthorizationScheme(authorization) {
    var _a;
    return (_a = authorization.match(AUTH_SCHEME_TOKEN)) === null || _a === void 0 ? void 0 : _a[1];
}
var CLIENT_AUTHENTICATION_FIELDS = [
    "client_secret",
    "client_assertion",
    "client_assertion_type",
];
function throwInvalidAuthenticationRequest(errorDescription) {
    throw new better_call_1.APIError("BAD_REQUEST", {
        error: "invalid_request",
        error_description: errorDescription,
    });
}
/**
 * Normalizes client identification and authentication parameters while
 * enforcing RFC 6749 §2.3 and RFC 8628 §3.1 cardinality. Empty values are
 * omitted. Client identification remains separate from authentication-method
 * detection so a public `client_id` does not count as an authentication attempt.
 * Repeated `resource` parameters are intentionally outside this parser because
 * RFC 8707 §2 explicitly permits them.
 *
 * Credential and assertion verification remain the responsibility of
 * `extractClientCredentials`.
 *
 * @internal
 */
function normalizeClientAuthenticationParameters(request_1) {
    return __awaiter(this, arguments, void 0, function (request, body) {
        var clientId, fields, setEffectiveField, _i, CLIENT_AUTHENTICATION_FIELDS_1, field, authorization, hasAuthorizationHeader, contentType, params, _a, clientIds, _b, CLIENT_AUTHENTICATION_FIELDS_2, field, values, hasClientSecret, hasClientAssertion, _c, CLIENT_AUTHENTICATION_FIELDS_3, field;
        var _d, _e;
        if (body === void 0) { body = {}; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (body.client_id !== undefined && body.client_id !== "") {
                        if (typeof body.client_id !== "string") {
                            throwInvalidAuthenticationRequest("client_id must be a string");
                        }
                        clientId = body.client_id;
                    }
                    fields = {};
                    setEffectiveField = function (field, value) {
                        if (value === undefined || value === "")
                            return;
                        if (typeof value !== "string") {
                            throwInvalidAuthenticationRequest("".concat(field, " must be a string"));
                        }
                        fields[field] = value;
                    };
                    for (_i = 0, CLIENT_AUTHENTICATION_FIELDS_1 = CLIENT_AUTHENTICATION_FIELDS; _i < CLIENT_AUTHENTICATION_FIELDS_1.length; _i++) {
                        field = CLIENT_AUTHENTICATION_FIELDS_1[_i];
                        if (Object.hasOwn(body, field)) {
                            setEffectiveField(field, body[field]);
                        }
                    }
                    authorization = request === null || request === void 0 ? void 0 : request.headers.get("authorization");
                    hasAuthorizationHeader = Boolean(authorization);
                    if (!request) return [3 /*break*/, 2];
                    contentType = (_e = (_d = request.headers.get("content-type")) === null || _d === void 0 ? void 0 : _d.toLowerCase()) !== null && _e !== void 0 ? _e : "";
                    if (!contentType.includes("application/x-www-form-urlencoded")) return [3 /*break*/, 2];
                    _a = URLSearchParams.bind;
                    return [4 /*yield*/, request.clone().text()];
                case 1:
                    params = new (_a.apply(URLSearchParams, [void 0, _f.sent()]))();
                    clientIds = params
                        .getAll("client_id")
                        .filter(function (value) { return value.length > 0; });
                    if (clientIds.length > 1) {
                        throwInvalidAuthenticationRequest("client_id must not be repeated");
                    }
                    clientId = clientIds[0];
                    for (_b = 0, CLIENT_AUTHENTICATION_FIELDS_2 = CLIENT_AUTHENTICATION_FIELDS; _b < CLIENT_AUTHENTICATION_FIELDS_2.length; _b++) {
                        field = CLIENT_AUTHENTICATION_FIELDS_2[_b];
                        values = params.getAll(field).filter(function (value) { return value.length > 0; });
                        if (values.length > 1) {
                            throwInvalidAuthenticationRequest("".concat(field, " must not be repeated"));
                        }
                        if (values.length === 1)
                            setEffectiveField(field, values[0]);
                    }
                    _f.label = 2;
                case 2:
                    hasClientSecret = fields.client_secret !== undefined;
                    hasClientAssertion = fields.client_assertion !== undefined ||
                        fields.client_assertion_type !== undefined;
                    if ((hasAuthorizationHeader && (hasClientSecret || hasClientAssertion)) ||
                        (hasClientSecret && hasClientAssertion)) {
                        throwInvalidAuthenticationRequest("A request must use only one client authentication method");
                    }
                    body.client_id = clientId;
                    for (_c = 0, CLIENT_AUTHENTICATION_FIELDS_3 = CLIENT_AUTHENTICATION_FIELDS; _c < CLIENT_AUTHENTICATION_FIELDS_3.length; _c++) {
                        field = CLIENT_AUTHENTICATION_FIELDS_3[_c];
                        body[field] = fields[field];
                    }
                    return [2 /*return*/, {
                            detected: hasAuthorizationHeader || Object.keys(fields).length > 0,
                        }];
            }
        });
    });
}
function basicToClientCredentials(authorization) {
    if (!BASIC_SCHEME_PREFIX.test(authorization)) {
        return undefined;
    }
    try {
        var _a = (0, oauth2_1.decodeBasicCredentials)(authorization), clientId = _a.clientId, clientSecret = _a.clientSecret;
        return { client_id: clientId, client_secret: clientSecret };
    }
    catch (_b) {
        throw new better_call_1.APIError("UNAUTHORIZED", {
            error_description: "invalid authorization header format",
            error: "invalid_client",
        }, { "WWW-Authenticate": "Basic" });
    }
}
/**
 * Whether a client is allowed to use a given grant type.
 *
 * A client's registered `grantTypes` defaults to the documented default
 * `["authorization_code"]` when unset (see client registration). Refresh tokens
 * are only ever issued through the authorization_code flow, so a client allowed
 * to use `authorization_code` is implicitly allowed to use `refresh_token`.
 *
 * @internal
 */
function clientAllowsGrant(client, grantType) {
    var allowedGrants = client.grantTypes && client.grantTypes.length > 0
        ? client.grantTypes
        : ["authorization_code"];
    if (grantType === "refresh_token" &&
        allowedGrants.includes("authorization_code")) {
        return true;
    }
    return allowedGrants.includes(grantType);
}
/**
 * Validates requested scopes against a registered client's allowed scopes.
 *
 * @internal
 */
function validateClientScopes(client, scopes) {
    if (!scopes || !client.scopes)
        return;
    var validScopes = new Set(client.scopes);
    for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
        var scope = scopes_1[_i];
        if (!validScopes.has(scope)) {
            throw new better_call_1.APIError("BAD_REQUEST", {
                error_description: "client does not allow scope ".concat(scope),
                error: "invalid_scope",
            });
        }
    }
}
function throwInvalidClient(errorDescription, authentication) {
    var _a;
    var attemptedBasicAuthentication = (authentication === null || authentication === void 0 ? void 0 : authentication.method) === "client_secret_basic";
    var challengeScheme = (_a = authentication === null || authentication === void 0 ? void 0 : authentication.scheme) !== null && _a !== void 0 ? _a : (attemptedBasicAuthentication ? "Basic" : undefined);
    throw new better_call_1.APIError(challengeScheme ? "UNAUTHORIZED" : "BAD_REQUEST", {
        error_description: errorDescription,
        error: "invalid_client",
    }, challengeScheme ? { "WWW-Authenticate": challengeScheme } : undefined);
}
/**
 * Resolves the registered client by id and authorizes it: existence, disabled
 * state, registered auth method, requested scopes, and grant type. The record is
 * always resolved here via `getClient`, so a client-auth strategy proves the
 * caller controls `clientId` but never supplies the record. `preVerified` marks
 * that an assertion already proved control, so the client-secret check is skipped.
 *
 * @internal
 */
function validateClientCredentials(ctx, options, clientId, clientSecret, // optional because required if client is confidential or this value is defined
scopes, // checks requested scopes against allowed scopes
preVerified, // an assertion already proved control of clientId; skip the secret check
grantType, // if set, enforces the client is registered for this grant type
authMethod) {
    return __awaiter(this, void 0, void 0, function () {
        var client, registeredAuthMethod, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getClient(ctx, options, clientId)];
                case 1:
                    client = _c.sent();
                    if (!client) {
                        throwInvalidClient("client not found", { method: authMethod });
                    }
                    if (client.disabled) {
                        throwInvalidClient("client is disabled", { method: authMethod });
                    }
                    registeredAuthMethod = (_b = client.tokenEndpointAuthMethod) !== null && _b !== void 0 ? _b : "client_secret_basic";
                    if (authMethod && registeredAuthMethod !== authMethod) {
                        throwInvalidClient("client registered for ".concat(registeredAuthMethod, " cannot use ").concat(authMethod), { method: authMethod });
                    }
                    if ((client.tokenEndpointAuthMethod === "private_key_jwt" ||
                        (0, extensions_1.isExtensionTokenEndpointAuthMethod)(options, client.tokenEndpointAuthMethod)) &&
                        !preVerified) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client registered for ".concat(client.tokenEndpointAuthMethod, " must use client_assertion"),
                            error: "invalid_client",
                        });
                    }
                    if (!!preVerified) return [3 /*break*/, 4];
                    // Only token_endpoint_auth_method=none identifies a public client.
                    if (client.tokenEndpointAuthMethod !== "none" && !clientSecret) {
                        throwInvalidClient("client secret must be provided", {
                            method: authMethod,
                        });
                    }
                    // Secret should not be received
                    if (clientSecret && !client.clientSecret) {
                        throwInvalidClient("public client, client secret should not be received", { method: authMethod });
                    }
                    _a = clientSecret;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, verifyStoredClientSecret(ctx, options, client.clientSecret, clientSecret)];
                case 2:
                    _a = !(_c.sent());
                    _c.label = 3;
                case 3:
                    // Compare Secrets when secret is provided
                    if (_a) {
                        throwInvalidClient("invalid client_secret", { method: authMethod });
                    }
                    _c.label = 4;
                case 4:
                    validateClientScopes(client, scopes);
                    // Enforce the client is registered for the requested grant type
                    if (grantType && !clientAllowsGrant(client, grantType)) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client is not authorized to use grant type ".concat(grantType),
                            error: "unauthorized_client",
                        });
                    }
                    return [2 /*return*/, client];
            }
        });
    });
}
/**
 * Parse client metadata that may be stored as JSON string or already parsed object.
 * Handles database adapters that auto-parse JSON columns.
 *
 * @internal
 */
function parseClientMetadata(metadata) {
    if (!metadata)
        return undefined;
    return typeof metadata === "string"
        ? JSON.parse(metadata)
        : metadata;
}
/** Unwraps ExtractedCredentials into the fields each grant handler needs. */
function destructureCredentials(credentials) {
    return {
        clientId: credentials === null || credentials === void 0 ? void 0 : credentials.clientId,
        clientSecret: (credentials === null || credentials === void 0 ? void 0 : credentials.kind) === "client_secret"
            ? credentials.clientSecret
            : undefined,
        preVerified: (credentials === null || credentials === void 0 ? void 0 : credentials.kind) === "pre_verified",
        authMethod: credentials === null || credentials === void 0 ? void 0 : credentials.method,
        confirmation: (credentials === null || credentials === void 0 ? void 0 : credentials.kind) === "pre_verified"
            ? credentials.confirmation
            : undefined,
    };
}
/**
 * Extracts and resolves client credentials from the request.
 * Supports: client_secret_basic, client_secret_post, private_key_jwt, and none (public).
 */
function extractClientCredentials(ctx, opts, expectedAudience) {
    return __awaiter(this, void 0, void 0, function () {
        var body, authorization, assertion, assertionType, extensionStrategy, result_1, verify, result, authorizationScheme, res;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    body = __assign({}, ((_a = ctx.body) !== null && _a !== void 0 ? _a : {}));
                    return [4 /*yield*/, normalizeClientAuthenticationParameters(ctx.request, body)];
                case 1:
                    _d.sent();
                    authorization = (_c = (_b = ctx.request) === null || _b === void 0 ? void 0 : _b.headers.get("authorization")) !== null && _c !== void 0 ? _c : undefined;
                    if (!(body.client_assertion_type || body.client_assertion)) return [3 /*break*/, 6];
                    if (!body.client_assertion || !body.client_assertion_type) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "client_assertion and client_assertion_type must both be provided",
                            error: "invalid_client",
                        });
                    }
                    assertion = body.client_assertion;
                    assertionType = body.client_assertion_type;
                    extensionStrategy = (0, extensions_1.getExtensionClientAuthenticationStrategy)(opts, assertionType);
                    if (!extensionStrategy) return [3 /*break*/, 3];
                    return [4 /*yield*/, extensionStrategy.strategy.authenticate({
                            ctx: ctx,
                            opts: opts,
                            assertion: assertion,
                            assertionType: assertionType,
                            clientId: body.client_id,
                            expectedAudience: expectedAudience,
                        })];
                case 2:
                    result_1 = _d.sent();
                    return [2 /*return*/, {
                            kind: "pre_verified",
                            method: extensionStrategy.method,
                            clientId: result_1.clientId,
                            confirmation: result_1.confirmation,
                        }];
                case 3: return [4 /*yield*/, Promise.resolve().then(function () { return require("./client-assertion"); })];
                case 4:
                    verify = (_d.sent()).verifyClientAssertion;
                    return [4 /*yield*/, verify(ctx, opts, assertion, assertionType, body.client_id, expectedAudience)];
                case 5:
                    result = _d.sent();
                    return [2 /*return*/, {
                            kind: "pre_verified",
                            method: "private_key_jwt",
                            clientId: result.clientId,
                        }];
                case 6:
                    if (authorization && !BASIC_SCHEME_PREFIX.test(authorization)) {
                        authorizationScheme = parseAuthorizationScheme(authorization);
                        if (!authorizationScheme) {
                            throw new better_call_1.APIError("BAD_REQUEST", {
                                error: "invalid_request",
                                error_description: "Invalid authorization header format",
                            });
                        }
                        throwInvalidClient("unsupported authorization scheme", {
                            scheme: authorizationScheme,
                        });
                    }
                    // 2. Check for Basic auth header
                    if (authorization && BASIC_SCHEME_PREFIX.test(authorization)) {
                        res = basicToClientCredentials(authorization);
                        if (res) {
                            return [2 /*return*/, {
                                    kind: "client_secret",
                                    method: "client_secret_basic",
                                    clientId: res.client_id,
                                    clientSecret: res.client_secret,
                                }];
                        }
                    }
                    // 3. Check body params
                    if (body.client_id && body.client_secret) {
                        return [2 /*return*/, {
                                kind: "client_secret",
                                method: "client_secret_post",
                                clientId: body.client_id,
                                clientSecret: body.client_secret,
                            }];
                    }
                    // 4. client_id only (public client)
                    if (body.client_id) {
                        return [2 /*return*/, {
                                kind: "public",
                                method: "none",
                                clientId: body.client_id,
                            }];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
/**
 * Parse space-separated prompt string into a set of prompts
 *
 * @param prompt
 */
function parsePrompt(prompt) {
    var prompts = prompt.split(" ").map(function (p) { return p.trim(); });
    var set = new Set();
    for (var _i = 0, prompts_1 = prompts; _i < prompts_1.length; _i++) {
        var p = prompts_1[_i];
        if (p === "login" ||
            p === "consent" ||
            p === "create" ||
            p === "select_account" ||
            p === "none") {
            set.add(p);
        }
    }
    return new Set(set);
}
/**
 * Extracts the sector identifier (hostname) from a client's first redirect URI.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#PairwiseAlg
 * @internal
 */
function getSectorIdentifier(client) {
    var _a;
    var uri = (_a = client.redirectUris) === null || _a === void 0 ? void 0 : _a[0];
    if (!uri) {
        throw new error_1.BetterAuthError("Client has no redirect URIs for sector identifier");
    }
    return new URL(uri).host;
}
/**
 * Computes a pairwise subject identifier using HMAC-SHA256.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#PairwiseAlg
 * @internal
 */
function computePairwiseSub(userId, client, secret) {
    return __awaiter(this, void 0, void 0, function () {
        var sectorId;
        return __generator(this, function (_a) {
            sectorId = getSectorIdentifier(client);
            return [2 /*return*/, (0, crypto_1.makeSignature)("".concat(sectorId, ".").concat(userId), secret)];
        });
    });
}
/**
 * Returns the appropriate subject identifier for a user+client pair.
 * Uses pairwise when the client opts in and the server has a secret configured.
 *
 * @internal
 */
function resolveSubjectIdentifier(userId, client, opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (client.subjectType === "pairwise" && opts.pairwiseSecret) {
                return [2 /*return*/, computePairwiseSub(userId, client, opts.pairwiseSecret)];
            }
            return [2 /*return*/, userId];
        });
    });
}
/**
 * Resolves `postLogin.consentReferenceId`, treating an empty value as no reference.
 *
 * @internal
 */
function getConsentReferenceId(opts, context) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ((_b = (_a = opts.postLogin) === null || _a === void 0 ? void 0 : _a.consentReferenceId) === null || _b === void 0 ? void 0 : _b.call(_a, context))];
                case 1: return [2 /*return*/, (_c.sent()) || undefined];
            }
        });
    });
}
/**
 * Finds the consent stored for exactly this reference. Without a reference,
 * only consent stored without one (missing, null, or empty) matches.
 *
 * @internal
 */
function findConsent(ctx, clientId, userId, referenceId) {
    return __awaiter(this, void 0, void 0, function () {
        var findByReference;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    findByReference = function (value) {
                        return ctx.context.adapter.findOne({
                            model: "oauthConsent",
                            where: [
                                { field: "clientId", value: clientId },
                                { field: "userId", value: userId },
                                { field: "referenceId", value: value },
                            ],
                        });
                    };
                    if (referenceId)
                        return [2 /*return*/, findByReference(referenceId)];
                    return [4 /*yield*/, findByReference(null)];
                case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : findByReference("")];
            }
        });
    });
}
/**
 * Converts URLSearchParams to a plain object, preserving
 * multi-valued keys as arrays instead of discarding duplicates.
 */
function searchParamsToQuery(params) {
    var result = Object.create(null);
    for (var _i = 0, _a = new Set(params.keys()); _i < _a.length; _i++) {
        var key = _a[_i];
        var values = params.getAll(key);
        result[key] = values.length === 1 ? values[0] : values;
    }
    return result;
}
function isSessionFreshForSignedQuery(sessionCreatedAt, signedQueryIssuedAt) {
    if (!signedQueryIssuedAt)
        return false;
    var normalized = normalizeTimestampValue(sessionCreatedAt);
    if (!normalized)
        return false;
    return normalized.getTime() >= signedQueryIssuedAt.getTime();
}
function removePromptFromQuery(query, prompt) {
    var _a, _b;
    var nextQuery = new URLSearchParams(query);
    var prompts = (_a = nextQuery.get("prompt")) === null || _a === void 0 ? void 0 : _a.split(" ");
    var foundPrompt = (_b = prompts === null || prompts === void 0 ? void 0 : prompts.findIndex(function (v) { return v === prompt; })) !== null && _b !== void 0 ? _b : -1;
    if (foundPrompt >= 0) {
        prompts === null || prompts === void 0 ? void 0 : prompts.splice(foundPrompt, 1);
        (prompts === null || prompts === void 0 ? void 0 : prompts.length)
            ? nextQuery.set("prompt", prompts.join(" "))
            : nextQuery.delete("prompt");
    }
    return nextQuery;
}
function removeMaxAgeFromQuery(query) {
    var nextQuery = new URLSearchParams(query);
    nextQuery.delete("max_age");
    return nextQuery;
}
var PKCERequirementErrors;
(function (PKCERequirementErrors) {
    PKCERequirementErrors["PUBLIC_CLIENT"] = "pkce is required for public clients";
    PKCERequirementErrors["OFFLINE_ACCESS_SCOPE"] = "pkce or OIDC nonce is required when requesting offline_access scope";
    PKCERequirementErrors["CLIENT_REQUIRE_PKCE"] = "pkce is required for this client";
})(PKCERequirementErrors || (PKCERequirementErrors = {}));
/**
 * Determines if PKCE is required for a given client and authorization request.
 *
 * PKCE is always required for:
 * 1. Public clients (cannot securely store client_secret)
 * 2. Requests with offline_access scope unless a confidential OIDC request
 *    already uses nonce as its authorization-code injection countermeasure.
 *
 * For confidential clients:
 * - Uses client.requirePKCE if set (defaults to true)
 *
 * Returns false if PKCE is not required, or the reason it is required.
 *
 * @internal
 */
function isPKCERequired(client, request) {
    var _a, _b;
    // Determine if client is public
    var isPublicClient = client.tokenEndpointAuthMethod === "none";
    // PKCE always required for public clients
    if (isPublicClient) {
        return PKCERequirementErrors.PUBLIC_CLIENT;
    }
    var requestScopes = (_a = request === null || request === void 0 ? void 0 : request.scopes) !== null && _a !== void 0 ? _a : [];
    var isOpenIdRequest = requestScopes.includes("openid");
    var hasNonce = typeof (request === null || request === void 0 ? void 0 : request.nonce) === "string" && request.nonce.length > 0;
    var hasOidcNonce = isOpenIdRequest && hasNonce;
    if (requestScopes.includes("offline_access") && !hasOidcNonce) {
        return PKCERequirementErrors.OFFLINE_ACCESS_SCOPE;
    }
    if ((_b = client.requirePKCE) !== null && _b !== void 0 ? _b : true) {
        return PKCERequirementErrors.CLIENT_REQUIRE_PKCE;
    }
    return false;
}
/**
 * Applies the redirect URI HTTPS policy: `http:` is allowed on loopback hosts
 * for clients that are not `web`, or when `allowInsecureRedirectUri` accepts
 * the URL. A throwing callback rejects the URI.
 */
function isRedirectUriTransportAllowed(opts, uri, isWebClient) {
    if (isWebClient === void 0) { isWebClient = false; }
    var url;
    try {
        url = new URL(uri);
    }
    catch (_a) {
        return false;
    }
    if (url.protocol !== "http:")
        return true;
    if (!isWebClient && (0, host_1.isLoopbackHost)(url.host))
        return true;
    return isInsecureRedirectUriAllowed(opts, url);
}
/**
 * Runs `allowInsecureRedirectUri` for an `http:` URL, failing closed. URLs
 * with credentials are never accepted.
 */
function isInsecureRedirectUriAllowed(opts, url) {
    var _a;
    if (url.username || url.password)
        return false;
    try {
        return ((_a = opts.allowInsecureRedirectUri) === null || _a === void 0 ? void 0 : _a.call(opts, url)) === true;
    }
    catch (_b) {
        return false;
    }
}
