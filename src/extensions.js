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
exports.validateOAuthProviderExtensions = validateOAuthProviderExtensions;
exports.getClientDiscoveries = getClientDiscoveries;
exports.extendOAuthProvider = extendOAuthProvider;
exports.getSupportedGrantTypes = getSupportedGrantTypes;
exports.getExtensionGrantHandler = getExtensionGrantHandler;
exports.getSupportedAuthMethods = getSupportedAuthMethods;
exports.isExtensionTokenEndpointAuthMethod = isExtensionTokenEndpointAuthMethod;
exports.getExtensionClientAuthenticationStrategy = getExtensionClientAuthenticationStrategy;
exports.applyOAuthProviderMetadataExtensions = applyOAuthProviderMetadataExtensions;
exports.collectExtensionAccessTokenClaims = collectExtensionAccessTokenClaims;
exports.collectExtensionIdTokenClaims = collectExtensionIdTokenClaims;
exports.collectExtensionUserInfoClaims = collectExtensionUserInfoClaims;
exports.hasUserInfoClaimExtension = hasUserInfoClaimExtension;
var env_1 = require("@better-auth/core/env");
var error_1 = require("@better-auth/core/error");
var oauth2_1 = require("@better-auth/core/oauth2");
var DEFAULT_GRANT_TYPES = [
    "authorization_code",
    "client_credentials",
    "refresh_token",
];
var BUILT_IN_CONFIDENTIAL_AUTH_METHODS = [
    "client_secret_basic",
    "client_secret_post",
    "private_key_jwt",
];
var RESERVED_TOKEN_ENDPOINT_AUTH_METHODS = __spreadArray([
    "none"
], BUILT_IN_CONFIDENTIAL_AUTH_METHODS, true);
var RESERVED_TOKEN_ENDPOINT_AUTH_METHOD_SET = new Set(RESERVED_TOKEN_ENDPOINT_AUTH_METHODS);
function assertNonEmptyExtensionValue(name, value) {
    if (value.trim().length > 0)
        return;
    throw new error_1.BetterAuthError("OAuth Provider extension ".concat(name, " cannot be empty"));
}
function assertAbsoluteUri(name, value) {
    assertNonEmptyExtensionValue(name, value);
    var url;
    try {
        url = new URL(value);
    }
    catch (_a) {
        url = undefined;
    }
    if (url === null || url === void 0 ? void 0 : url.protocol)
        return;
    throw new error_1.BetterAuthError("OAuth Provider extension ".concat(name, " must be an absolute URI: ").concat(value));
}
function assertExtensionGrantType(grantType) {
    assertAbsoluteUri("grant type", grantType);
}
function assertExtensionTokenEndpointAuthMethod(method) {
    assertNonEmptyExtensionValue("token_endpoint_auth_method", method);
    if (!RESERVED_TOKEN_ENDPOINT_AUTH_METHOD_SET.has(method))
        return;
    throw new error_1.BetterAuthError("OAuth Provider extension token_endpoint_auth_method is reserved: ".concat(method));
}
function assertExtensionClientAssertionType(assertionType) {
    assertAbsoluteUri("client_assertion_type", assertionType);
    if (assertionType !== oauth2_1.CLIENT_ASSERTION_TYPE)
        return;
    throw new error_1.BetterAuthError("OAuth Provider extension client_assertion_type is reserved: ".concat(assertionType));
}
/**
 * Validates one extension's dispatched keys (grant types, auth methods,
 * assertion types) and returns them for the cross-extension disjointness check.
 * Throws on a non-absolute grant/assertion URI, a reserved auth-method name, or
 * an empty assertion-type list.
 */
function collectExtensionKeys(extension) {
    var _a, _b, _c;
    var grantTypes = Object.keys((_a = extension.grants) !== null && _a !== void 0 ? _a : {});
    for (var _i = 0, grantTypes_1 = grantTypes; _i < grantTypes_1.length; _i++) {
        var grantType = grantTypes_1[_i];
        assertExtensionGrantType(grantType);
    }
    var authMethods = [];
    var assertionTypes = [];
    for (var _d = 0, _e = Object.entries((_b = extension.clientAuthentication) !== null && _b !== void 0 ? _b : {}); _d < _e.length; _d++) {
        var _f = _e[_d], method = _f[0], strategy = _f[1];
        assertExtensionTokenEndpointAuthMethod(method);
        authMethods.push(method);
        var methodAssertionTypes = (_c = strategy.assertionTypes) !== null && _c !== void 0 ? _c : [method];
        if (methodAssertionTypes.length === 0) {
            throw new error_1.BetterAuthError("OAuth Provider extension client_assertion_type list cannot be empty for ".concat(method));
        }
        for (var _g = 0, methodAssertionTypes_1 = methodAssertionTypes; _g < methodAssertionTypes_1.length; _g++) {
            var assertionType = methodAssertionTypes_1[_g];
            assertExtensionClientAssertionType(assertionType);
            assertionTypes.push(assertionType);
        }
    }
    var clientDiscoveries = extension.clientDiscovery
        ? Array.isArray(extension.clientDiscovery)
            ? extension.clientDiscovery
            : [extension.clientDiscovery]
        : [];
    var clientDiscoveryIds = clientDiscoveries.map(function (discovery) { return discovery.id; });
    for (var _h = 0, clientDiscoveryIds_1 = clientDiscoveryIds; _h < clientDiscoveryIds_1.length; _h++) {
        var clientDiscoveryId = clientDiscoveryIds_1[_h];
        assertNonEmptyExtensionValue("client discovery id", clientDiscoveryId);
    }
    return { grantTypes: grantTypes, authMethods: authMethods, assertionTypes: assertionTypes, clientDiscoveryIds: clientDiscoveryIds };
}
function assertNoDuplicateAcrossExtensions(label, values) {
    var seen = new Set();
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        if (seen.has(value)) {
            throw new error_1.BetterAuthError("OAuth Provider extensions register ".concat(label, " \"").concat(value, "\" more than once. Extension contributions must be disjoint."));
        }
        seen.add(value);
    }
}
/**
 * Validates every extension and rejects two extensions registering the same
 * grant type, auth method, assertion type, or client discovery identifier:
 * otherwise the first would win and the second be silently unreachable. Runs at
 * setup over the whole list; extensions number in the single digits, so a full
 * re-scan per registration is cheaper than the bookkeeping to cache it.
 */
function validateOAuthProviderExtensions(extensions) {
    var keys = (extensions !== null && extensions !== void 0 ? extensions : []).map(collectExtensionKeys);
    assertNoDuplicateAcrossExtensions("grant type", keys.flatMap(function (k) { return k.grantTypes; }));
    assertNoDuplicateAcrossExtensions("token_endpoint_auth_method", keys.flatMap(function (k) { return k.authMethods; }));
    assertNoDuplicateAcrossExtensions("client_assertion_type", keys.flatMap(function (k) { return k.assertionTypes; }));
    assertNoDuplicateAcrossExtensions("client discovery id", keys.flatMap(function (k) { return k.clientDiscoveryIds; }));
}
function getOAuthProviderExtensions(opts) {
    var _a;
    return (_a = opts.extensions) !== null && _a !== void 0 ? _a : [];
}
/**
 * Flattens the client-id discovery sources contributed by every registered
 * extension into a single ordered list. `getClient()` consults them in order;
 * the metadata endpoints merge their `discoveryMetadata`.
 */
function getClientDiscoveries(opts) {
    return getOAuthProviderExtensions(opts).flatMap(function (extension) {
        var discovery = extension.clientDiscovery;
        if (!discovery)
            return [];
        return Array.isArray(discovery) ? discovery : [discovery];
    });
}
/**
 * Registers an {@link OAuthProviderExtension} with the OAuth Provider plugin
 * from a companion plugin's `init()` hook. An extension can add token grants,
 * assertion-based client authentication methods, additive discovery metadata,
 * access-token / ID-token / UserInfo claims, and client-id discovery, without
 * forking provider core.
 *
 * Call this once, at `init()` time. It is idempotent in the same `extension`
 * object, so re-running a plugin's `init()` (for example when one plugin factory
 * result is shared across two `betterAuth()` instances) does not register it
 * twice. It throws if the oauth-provider plugin is not installed, if a grant
 * type or assertion type is not an absolute URI, if a client authentication
 * method reuses a built-in name, or if the extension registers a grant type,
 * auth method, assertion type, or client discovery identifier that another
 * extension already registered (contributions must be disjoint).
 *
 * @example
 * ```ts
 * init(ctx) {
 *   extendOAuthProvider(ctx, {
 *     grants: { "urn:example:grant": async ({ provider }) => provider.issueTokens(...) },
 *   });
 * }
 * ```
 */
function extendOAuthProvider(ctx, extension) {
    var _a;
    var provider = ctx.getPlugin("oauth-provider");
    if (!provider) {
        throw new error_1.BetterAuthError("extendOAuthProvider requires the oauth-provider plugin.");
    }
    var existing = (_a = provider.options.extensions) !== null && _a !== void 0 ? _a : [];
    if (existing.includes(extension))
        return;
    var extensions = __spreadArray(__spreadArray([], existing, true), [extension], false);
    validateOAuthProviderExtensions(extensions);
    provider.options.extensions = extensions;
}
function getExtensionGrantTypes(opts) {
    return getOAuthProviderExtensions(opts).flatMap(function (extension) { var _a; return Object.keys((_a = extension.grants) !== null && _a !== void 0 ? _a : {}); });
}
function getSupportedGrantTypes(opts) {
    var _a;
    return Array.from(new Set(__spreadArray(__spreadArray([], ((_a = opts.grantTypes) !== null && _a !== void 0 ? _a : DEFAULT_GRANT_TYPES), true), getExtensionGrantTypes(opts), true)));
}
function getExtensionGrantHandler(opts, grantType) {
    var _a;
    for (var _i = 0, _b = getOAuthProviderExtensions(opts); _i < _b.length; _i++) {
        var extension = _b[_i];
        var handler = (_a = extension.grants) === null || _a === void 0 ? void 0 : _a[grantType];
        if (handler)
            return handler;
    }
    return undefined;
}
function getExtensionTokenEndpointAuthMethods(opts) {
    return getOAuthProviderExtensions(opts).flatMap(function (extension) { var _a; return Object.keys((_a = extension.clientAuthentication) !== null && _a !== void 0 ? _a : {}); });
}
/**
 * Confidential and extension client-authentication methods the provider
 * supports. Pass `includeNone` to prepend `"none"` for the token endpoint and
 * DCR, where public clients are allowed; the introspection and revocation
 * endpoints, which never accept public clients, omit it (the default).
 */
function getSupportedAuthMethods(opts, settings) {
    return Array.from(new Set(__spreadArray(__spreadArray(__spreadArray([], ((settings === null || settings === void 0 ? void 0 : settings.includeNone) ? ["none"] : []), true), BUILT_IN_CONFIDENTIAL_AUTH_METHODS, true), getExtensionTokenEndpointAuthMethods(opts), true)));
}
function isExtensionTokenEndpointAuthMethod(opts, method) {
    return method
        ? getExtensionTokenEndpointAuthMethods(opts).includes(method)
        : false;
}
function getExtensionClientAuthenticationStrategy(opts, assertionType) {
    var _a, _b;
    if (assertionType === oauth2_1.CLIENT_ASSERTION_TYPE)
        return undefined;
    for (var _i = 0, _c = getOAuthProviderExtensions(opts); _i < _c.length; _i++) {
        var extension = _c[_i];
        var strategies = (_a = extension.clientAuthentication) !== null && _a !== void 0 ? _a : {};
        for (var _d = 0, _e = Object.entries(strategies); _d < _e.length; _d++) {
            var _f = _e[_d], method = _f[0], strategy = _f[1];
            var assertionTypes = (_b = strategy.assertionTypes) !== null && _b !== void 0 ? _b : [method];
            if (assertionTypes.includes(assertionType)) {
                return { method: method, strategy: strategy };
            }
        }
    }
    return undefined;
}
/**
 * Merges each registered extension's `metadata()` contribution into `document`,
 * first-wins: the provider owns every key it already wrote, so an extension can
 * add fields but never override core. A key two extensions contribute keeps the
 * first-registered value and logs a warning. Each contributor sees the base `document`,
 * not the running accumulation, so contributions stay order-independent.
 */
function applyOAuthProviderMetadataExtensions(ctx, opts, type, document) {
    var _a;
    var next = __assign({}, document);
    for (var _i = 0, _b = getOAuthProviderExtensions(opts); _i < _b.length; _i++) {
        var extension = _b[_i];
        var contribution = (_a = extension.metadata) === null || _a === void 0 ? void 0 : _a.call(extension, { ctx: ctx, opts: opts, type: type, document: document });
        for (var _c = 0, _d = Object.entries(contribution !== null && contribution !== void 0 ? contribution : {}); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
            if (!(key in next)) {
                next[key] = value;
            }
            else if (!(key in document)) {
                ctx.context.logger.warn("oauth-provider: two extensions contributed the discovery metadata key \"".concat(key, "\" to ").concat(type, "; keeping the first-registered value."));
            }
        }
    }
    return next;
}
function collectClaims(opts, run) {
    return __awaiter(this, void 0, void 0, function () {
        var claims, _i, _a, extension, contribution, _b, _c, _d, key, value;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    claims = {};
                    _i = 0, _a = getOAuthProviderExtensions(opts);
                    _f.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    extension = _a[_i];
                    return [4 /*yield*/, run(extension)];
                case 2:
                    contribution = (_e = (_f.sent())) !== null && _e !== void 0 ? _e : {};
                    for (_b = 0, _c = Object.entries(contribution); _b < _c.length; _b++) {
                        _d = _c[_b], key = _d[0], value = _d[1];
                        if (key in claims) {
                            env_1.logger.warn("oauth-provider: two extensions contributed the claim \"".concat(key, "\"; keeping the first-registered value."));
                            continue;
                        }
                        claims[key] = value;
                    }
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, claims];
            }
        });
    });
}
function collectExtensionAccessTokenClaims(opts, input) {
    return collectClaims(opts, function (extension) { var _a, _b; return (_b = (_a = extension.claims) === null || _a === void 0 ? void 0 : _a.accessToken) === null || _b === void 0 ? void 0 : _b.call(_a, input); });
}
function collectExtensionIdTokenClaims(opts, input) {
    return collectClaims(opts, function (extension) { var _a, _b; return (_b = (_a = extension.claims) === null || _a === void 0 ? void 0 : _a.idToken) === null || _b === void 0 ? void 0 : _b.call(_a, input); });
}
function collectExtensionUserInfoClaims(opts, input) {
    return collectClaims(opts, function (extension) { var _a, _b; return (_b = (_a = extension.claims) === null || _a === void 0 ? void 0 : _a.userInfo) === null || _b === void 0 ? void 0 : _b.call(_a, input); });
}
/**
 * Whether any registered extension contributes UserInfo claims. Lets the
 * UserInfo endpoint skip loading the client when nothing needs it.
 */
function hasUserInfoClaimExtension(opts) {
    return getOAuthProviderExtensions(opts).some(function (extension) { var _a; return (_a = extension.claims) === null || _a === void 0 ? void 0 : _a.userInfo; });
}
