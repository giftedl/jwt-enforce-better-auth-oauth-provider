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
exports.oauthProviderOpenIdConfigMetadata = exports.oauthProviderAuthServerMetadata = void 0;
exports.authServerMetadata = authServerMetadata;
exports.oauthAuthorizationServerMetadata = oauthAuthorizationServerMetadata;
exports.oidcServerMetadata = oidcServerMetadata;
exports.metadataResponse = metadataResponse;
var oauth2_1 = require("@better-auth/core/oauth2");
var authentication_context_1 = require("./authentication-context");
var authorize_1 = require("./authorize");
var extensions_1 = require("./extensions");
var standard_claims_1 = require("./standard-claims");
var utils_1 = require("./utils");
function authServerMetadata(ctx, opts, overrides) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var baseURL = ctx.context.baseURL;
    // Back-channel logout requires a verifiable Logout Token, which depends on
    // the JWT plugin's JWKS. Advertise support only when the plugin is enabled.
    var backchannelSupported = !(overrides === null || overrides === void 0 ? void 0 : overrides.jwt_disabled);
    var metadata = {
        scopes_supported: overrides === null || overrides === void 0 ? void 0 : overrides.scopes_supported,
        issuer: (0, authorize_1.validateIssuerUrl)((_b = (_a = opts === null || opts === void 0 ? void 0 : opts.jwt) === null || _a === void 0 ? void 0 : _a.issuer) !== null && _b !== void 0 ? _b : baseURL),
        authorization_endpoint: "".concat(baseURL, "/oauth2/authorize"),
        token_endpoint: "".concat(baseURL, "/oauth2/token"),
        jwks_uri: (overrides === null || overrides === void 0 ? void 0 : overrides.jwt_disabled)
            ? undefined
            : ((_d = (_c = opts === null || opts === void 0 ? void 0 : opts.jwks) === null || _c === void 0 ? void 0 : _c.remoteUrl) !== null && _d !== void 0 ? _d : "".concat(baseURL).concat((_f = (_e = opts === null || opts === void 0 ? void 0 : opts.jwks) === null || _e === void 0 ? void 0 : _e.jwksPath) !== null && _f !== void 0 ? _f : "/jwks")),
        registration_endpoint: (overrides === null || overrides === void 0 ? void 0 : overrides.dynamic_client_registration_supported)
            ? "".concat(baseURL, "/oauth2/register")
            : undefined,
        introspection_endpoint: "".concat(baseURL, "/oauth2/introspect"),
        revocation_endpoint: "".concat(baseURL, "/oauth2/revoke"),
        response_types_supported: (overrides === null || overrides === void 0 ? void 0 : overrides.grant_types_supported) &&
            !overrides.grant_types_supported.includes("authorization_code")
            ? []
            : ["code"],
        response_modes_supported: ["query"],
        grant_types_supported: (_g = overrides === null || overrides === void 0 ? void 0 : overrides.grant_types_supported) !== null && _g !== void 0 ? _g : [
            "authorization_code",
            "client_credentials",
            "refresh_token",
        ],
        token_endpoint_auth_methods_supported: (_h = overrides === null || overrides === void 0 ? void 0 : overrides.token_endpoint_auth_methods_supported) !== null && _h !== void 0 ? _h : __spreadArray(__spreadArray([], ((overrides === null || overrides === void 0 ? void 0 : overrides.public_client_supported)
            ? ["none"]
            : []), true), [
            "client_secret_basic",
            "client_secret_post",
            "private_key_jwt",
        ], false),
        token_endpoint_auth_signing_alg_values_supported: __spreadArray([], oauth2_1.PRIVATE_KEY_JWT_SIGNING_ALGORITHMS, true),
        introspection_endpoint_auth_methods_supported: (_j = overrides === null || overrides === void 0 ? void 0 : overrides.endpoint_auth_methods_supported) !== null && _j !== void 0 ? _j : [
            "client_secret_basic",
            "client_secret_post",
            "private_key_jwt",
        ],
        introspection_endpoint_auth_signing_alg_values_supported: __spreadArray([], oauth2_1.PRIVATE_KEY_JWT_SIGNING_ALGORITHMS, true),
        revocation_endpoint_auth_methods_supported: (_k = overrides === null || overrides === void 0 ? void 0 : overrides.endpoint_auth_methods_supported) !== null && _k !== void 0 ? _k : [
            "client_secret_basic",
            "client_secret_post",
            "private_key_jwt",
        ],
        revocation_endpoint_auth_signing_alg_values_supported: __spreadArray([], oauth2_1.PRIVATE_KEY_JWT_SIGNING_ALGORITHMS, true),
        code_challenge_methods_supported: ["S256"],
        authorization_response_iss_parameter_supported: true,
        dpop_signing_alg_values_supported: (_l = overrides === null || overrides === void 0 ? void 0 : overrides.dpop_signing_alg_values_supported) !== null && _l !== void 0 ? _l : __spreadArray([], oauth2_1.DPOP_SIGNING_ALGORITHMS, true),
        backchannel_logout_supported: backchannelSupported,
        backchannel_logout_session_supported: backchannelSupported,
    };
    return metadata;
}
/**
 * Builds the authorization-server metadata shared by the
 * `/.well-known/oauth-authorization-server` and `/.well-known/openid-configuration`
 * responses, plus the inputs both need to finish their own document.
 */
function buildAuthServerMetadata(ctx, opts) {
    var _a, _b, _c;
    var jwtPluginOptions = opts.disableJwtPlugin
        ? undefined
        : (0, utils_1.getJwtPlugin)(ctx.context).options;
    var clientDiscoveries = (0, extensions_1.getClientDiscoveries)(opts);
    // Any contributed `clientDiscovery` implicitly produces public clients
    // (CIMD, wallet attestation, etc.), so it flips `public_client_supported`
    // and the advertised `"none"` auth method alongside unauthenticated DCR.
    var publicClientSupported = opts.allowUnauthenticatedClientRegistration || clientDiscoveries.length > 0;
    var authMetadata = authServerMetadata(ctx, jwtPluginOptions, {
        scopes_supported: (_b = (_a = opts.advertisedMetadata) === null || _a === void 0 ? void 0 : _a.scopes_supported) !== null && _b !== void 0 ? _b : opts.scopes,
        dynamic_client_registration_supported: opts.allowDynamicClientRegistration,
        public_client_supported: publicClientSupported,
        grant_types_supported: (0, extensions_1.getSupportedGrantTypes)(opts),
        token_endpoint_auth_methods_supported: (0, extensions_1.getSupportedAuthMethods)(opts, {
            includeNone: publicClientSupported,
        }),
        endpoint_auth_methods_supported: (0, extensions_1.getSupportedAuthMethods)(opts),
        jwt_disabled: opts.disableJwtPlugin,
        dpop_signing_alg_values_supported: (_c = opts.dpop) === null || _c === void 0 ? void 0 : _c.signingAlgorithms,
    });
    return { jwtPluginOptions: jwtPluginOptions, clientDiscoveries: clientDiscoveries, authMetadata: authMetadata };
}
function oauthAuthorizationServerMetadata(ctx, opts) {
    var _a = buildAuthServerMetadata(ctx, opts), clientDiscoveries = _a.clientDiscoveries, authMetadata = _a.authMetadata;
    return (0, extensions_1.applyOAuthProviderMetadataExtensions)(ctx, opts, "oauth-authorization-server", __assign(__assign({}, (0, utils_1.mergeDiscoveryMetadata)(clientDiscoveries)), authMetadata));
}
function oidcServerMetadata(ctx, opts) {
    var baseURL = ctx.context.baseURL;
    var _a = buildAuthServerMetadata(ctx, opts), jwtPluginOptions = _a.jwtPluginOptions, clientDiscoveries = _a.clientDiscoveries, authMetadata = _a.authMetadata;
    var metadata = __assign(__assign({}, authMetadata), { claims_supported: (0, standard_claims_1.getSupportedClaims)(opts), claims_parameter_supported: true, userinfo_endpoint: "".concat(baseURL, "/oauth2/userinfo"), subject_types_supported: opts.pairwiseSecret
            ? ["public", "pairwise"]
            : ["public"], acr_values_supported: [authentication_context_1.LEVEL_0_ACR], id_token_signing_alg_values_supported: (function () {
            var _a, _b, _c, _d, _e, _f;
            if (opts.disableJwtPlugin)
                return ["HS256"];
            // Advertise every algorithm the plugin can sign with: the primary
            // keyPairConfig.alg plus every alg declared in keyPairConfigs[]
            // (lazy-minted on demand for per-resource signing pins).
            // Deduplicated so overlapping declarations don't produce repeats.
            var primary = (_c = (_b = (_a = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _a === void 0 ? void 0 : _a.keyPairConfig) === null || _b === void 0 ? void 0 : _b.alg) !== null && _c !== void 0 ? _c : "EdDSA";
            var extras = (_f = (_e = (_d = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _d === void 0 ? void 0 : _d.keyPairConfigs) === null || _e === void 0 ? void 0 : _e.map(function (c) { return c.alg; })) !== null && _f !== void 0 ? _f : [];
            return Array.from(new Set(__spreadArray([primary], extras, true)));
        })(), end_session_endpoint: "".concat(baseURL, "/oauth2/end-session"), request_parameter_supported: false, request_uri_parameter_supported: false, prompt_values_supported: [
            "login",
            "consent",
            "create",
            "select_account",
            "none",
        ] });
    return (0, extensions_1.applyOAuthProviderMetadataExtensions)(ctx, opts, "openid-configuration", __assign(__assign({}, (0, utils_1.mergeDiscoveryMetadata)(clientDiscoveries)), metadata));
}
// Cache for 15s with a short stale window; metadata rarely changes.
var METADATA_CACHE_CONTROL = "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400";
function metadataResponse(body, extraHeaders) {
    var headers = new Headers(extraHeaders);
    if (!headers.has("Cache-Control")) {
        headers.set("Cache-Control", METADATA_CACHE_CONTROL);
    }
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(body), { status: 200, headers: headers });
}
/**
 * Provides an exportable `/.well-known/oauth-authorization-server`.
 *
 * Useful when basePath prevents the endpoint from being located at the root
 * and must be provided manually.
 *
 * @external
 */
var oauthProviderAuthServerMetadata = function (auth, opts) {
    return function (request) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, auth.api.getOAuthServerConfig({
                        request: request,
                        asResponse: false,
                    })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, metadataResponse(res, opts === null || opts === void 0 ? void 0 : opts.headers)];
            }
        });
    }); };
};
exports.oauthProviderAuthServerMetadata = oauthProviderAuthServerMetadata;
/**
 * Provides an exportable `/.well-known/openid-configuration`.
 *
 * Useful when basePath prevents the endpoint from being located at the root
 * and must be provided manually.
 *
 * @external
 */
var oauthProviderOpenIdConfigMetadata = function (auth, opts) {
    return function (request) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, auth.api.getOpenIdConfig({
                        request: request,
                        asResponse: false,
                    })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, metadataResponse(res, opts === null || opts === void 0 ? void 0 : opts.headers)];
            }
        });
    }); };
};
exports.oauthProviderOpenIdConfigMetadata = oauthProviderOpenIdConfigMetadata;
