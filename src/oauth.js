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
exports.oauthProvider = exports.getOAuthProviderState = exports.oAuthState = exports.DEFAULT_OAUTH_SCOPES = void 0;
var context_1 = require("@better-auth/core/context");
var error_1 = require("@better-auth/core/error");
var api_1 = require("better-auth/api");
var cookies_1 = require("better-auth/cookies");
var db_1 = require("better-auth/db");
var z = require("zod");
var authorize_1 = require("./authorize");
var claims_request_1 = require("./claims-request");
var consent_1 = require("./consent");
var continue_1 = require("./continue");
var extensions_1 = require("./extensions");
var introspect_1 = require("./introspect");
var logout_1 = require("./logout");
var metadata_1 = require("./metadata");
var oauth_endpoint_1 = require("./oauth-endpoint");
var oauthClientEndpoints = require("./oauthClient");
var oauthConsentEndpoints = require("./oauthConsent");
var oauthResourceEndpoints = require("./oauthResource");
var register_1 = require("./register");
var resources_1 = require("./resources");
var revoke_1 = require("./revoke");
var schema_1 = require("./schema");
var standard_claims_1 = require("./standard-claims");
var token_1 = require("./token");
var zod_1 = require("./types/zod");
var userinfo_1 = require("./userinfo");
var utils_1 = require("./utils");
var version_1 = require("./version");
/**
 * Default scopes advertised and accepted when a configuration sets none. Shared
 * with the MCP preset so the resource metadata it serves matches what the
 * authorization-server metadata advertises.
 */
exports.DEFAULT_OAUTH_SCOPES = [
    "openid",
    "profile",
    "email",
    "offline_access",
];
var rpInitiatedLogoutRequestSchema = z.object({
    id_token_hint: z.string().optional(),
    client_id: z.string().optional(),
    post_logout_redirect_uri: zod_1.RedirectUriSyntaxSchema.optional(),
    state: z.string().optional(),
});
exports.oAuthState = (0, context_1.defineRequestState)(function () { return null; });
exports.getOAuthProviderState = exports.oAuthState.get;
var backchannelLogoutPlansByContext = new WeakMap();
var signedQueryIssuedAtMsKey = "signedQueryIssuedAtMs";
function getServerContextSignedQueryIssuedAt(value) {
    var issuedAtMs = typeof value === "number"
        ? value
        : typeof value === "string"
            ? Number(value)
            : undefined;
    if (!issuedAtMs || !Number.isFinite(issuedAtMs) || issuedAtMs <= 0) {
        return undefined;
    }
    return new Date(issuedAtMs);
}
/**
 * oAuth 2.1 provider plugin for Better Auth.
 *
 * @see https://better-auth.com/docs/plugins/oauth-provider
 * @param options - The options for the oAuth Provider plugin.
 * @returns A Better Auth plugin.
 */
var oauthProvider = function (options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28;
    var clientRegistrationAllowedScopes = options.clientRegistrationAllowedScopes;
    if (options.clientRegistrationDefaultScopes) {
        var _allowedScopes = clientRegistrationAllowedScopes
            ? new Set(__spreadArray(__spreadArray([], clientRegistrationAllowedScopes, true), options.clientRegistrationDefaultScopes, true))
            : new Set(__spreadArray([], options.clientRegistrationDefaultScopes, true));
        clientRegistrationAllowedScopes = Array.from(_allowedScopes);
    }
    // Validate scopes
    var scopes = new Set(((_a = options.scopes) !== null && _a !== void 0 ? _a : exports.DEFAULT_OAUTH_SCOPES).filter(function (val) { return val.length; }));
    if (clientRegistrationAllowedScopes) {
        for (var _i = 0, clientRegistrationAllowedScopes_1 = clientRegistrationAllowedScopes; _i < clientRegistrationAllowedScopes_1.length; _i++) {
            var sc = clientRegistrationAllowedScopes_1[_i];
            if (!scopes.has(sc)) {
                throw new error_1.BetterAuthError("clientRegistrationAllowedScope ".concat(sc, " not found in scopes"));
            }
        }
    }
    for (var _29 = 0, _30 = (_c = (_b = options.advertisedMetadata) === null || _b === void 0 ? void 0 : _b.scopes_supported) !== null && _c !== void 0 ? _c : []; _29 < _30.length; _29++) {
        var sc = _30[_29];
        if (!(scopes === null || scopes === void 0 ? void 0 : scopes.has(sc))) {
            throw new error_1.BetterAuthError("advertisedMetadata.scopes_supported ".concat(sc, " not found in scopes"));
        }
    }
    var configuredResourceIdentifiers = new Set(((_d = options.resources) !== null && _d !== void 0 ? _d : []).map(function (resource) {
        return typeof resource === "string" ? resource : resource.identifier;
    }));
    for (var _31 = 0, _32 = [
        [
            "clientRegistrationDefaultResources",
            options.clientRegistrationDefaultResources,
        ],
        [
            "clientRegistrationAllowedResources",
            options.clientRegistrationAllowedResources,
        ],
    ]; _31 < _32.length; _31++) {
        var _33 = _32[_31], optionName = _33[0], identifiers = _33[1];
        for (var _34 = 0, _35 = identifiers !== null && identifiers !== void 0 ? identifiers : []; _34 < _35.length; _34++) {
            var identifier = _35[_34];
            if (!configuredResourceIdentifiers.has(identifier)) {
                throw new error_1.BetterAuthError("".concat(optionName, " resource ").concat(identifier, " not found in resources"));
            }
        }
    }
    // Discovery `claims_supported`: protocol claims that are always present, plus
    // the standard identity claims whose backing scope is configured. The
    // identity set is derived from the one claim registry so the advertisement
    // cannot drift from what UserInfo actually resolves.
    var claims = new Set(__spreadArray([
        "sub",
        "iss",
        "aud",
        "exp",
        "iat",
        "sid",
        "scope",
        "azp"
    ], standard_claims_1.STANDARD_CLAIM_NAMES.filter(function (name) {
        return scopes.has(standard_claims_1.STANDARD_CLAIMS[name].scope);
    }), true));
    var opts = __assign(__assign({ codeExpiresIn: 600, accessTokenExpiresIn: 3600, m2mAccessTokenExpiresIn: 3600, refreshTokenExpiresIn: 2592000, refreshTokenReuseInterval: 0, allowUnauthenticatedClientRegistration: false, allowDynamicClientRegistration: false, disableJwtPlugin: false, storeClientSecret: options.disableJwtPlugin ? "encrypted" : "hashed", storeTokens: "hashed", grantTypes: ["authorization_code", "client_credentials", "refresh_token"] }, options), { scopes: Array.from(scopes), claims: Array.from(claims), clientRegistrationAllowedScopes: clientRegistrationAllowedScopes });
    (0, extensions_1.validateOAuthProviderExtensions)(opts.extensions);
    // Validate pairwiseSecret minimum length
    if (opts.pairwiseSecret && opts.pairwiseSecret.length < 32) {
        throw new error_1.BetterAuthError("pairwiseSecret must be at least 32 characters long for adequate HMAC-SHA256 security");
    }
    // TODO: device_code grant also allows for refresh tokens
    if (opts.grantTypes &&
        opts.grantTypes.includes("refresh_token") &&
        !opts.grantTypes.includes("authorization_code")) {
        throw new error_1.BetterAuthError("refresh_token grant requires authorization_code grant");
    }
    if (opts.disableJwtPlugin &&
        (opts.storeClientSecret === "hashed" ||
            (typeof opts.storeClientSecret === "object" &&
                "hash" in opts.storeClientSecret))) {
        throw new error_1.BetterAuthError("unable to store hashed secrets because id tokens will be signed with secret");
    }
    if (!opts.disableJwtPlugin &&
        (opts.storeClientSecret === "encrypted" ||
            (typeof opts.storeClientSecret === "object" &&
                ("encrypt" in opts.storeClientSecret ||
                    "decrypt" in opts.storeClientSecret)))) {
        throw new error_1.BetterAuthError("encryption method not recommended, please use 'hashed' or the 'hash' function");
    }
    var handleIssuerMetadataRequest = function (request, ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var requestPathname, requestPath, issuer, issuerPath, endpointCtx, authServerMetadataPaths, openIdConfigPath, isAuthServerMetadataRequest, isOpenIdConfigRequest, createMetadataResponse;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            requestPathname = new URL(request.url).pathname;
            requestPath = ((_a = ctx.options.advanced) === null || _a === void 0 ? void 0 : _a.skipTrailingSlashes)
                ? requestPathname.replace(/\/+$/, "") || "/"
                : requestPathname;
            issuer = opts.disableJwtPlugin
                ? ctx.baseURL
                : ((_e = (_d = (_c = (_b = (0, utils_1.getJwtPlugin)(ctx)) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.jwt) === null || _d === void 0 ? void 0 : _d.issuer) !== null && _e !== void 0 ? _e : ctx.baseURL);
            issuerPath = "/";
            try {
                issuerPath = new URL(issuer).pathname.replace(/\/$/, "") || "";
            }
            catch (_j) {
                issuerPath = new URL(ctx.baseURL).pathname.replace(/\/$/, "") || "";
            }
            endpointCtx = { context: ctx };
            authServerMetadataPaths = new Set([
                "/.well-known/oauth-authorization-server".concat(issuerPath),
                "".concat(issuerPath, "/.well-known/oauth-authorization-server"),
            ]);
            openIdConfigPath = "".concat(issuerPath, "/.well-known/openid-configuration");
            isAuthServerMetadataRequest = authServerMetadataPaths.has(requestPath);
            isOpenIdConfigRequest = ((_f = opts.scopes) === null || _f === void 0 ? void 0 : _f.includes("openid")) && requestPath === openIdConfigPath;
            createMetadataResponse = function (metadata) {
                var response = (0, metadata_1.metadataResponse)(metadata);
                if (request.method === "HEAD") {
                    return new Response(null, {
                        status: response.status,
                        headers: response.headers,
                    });
                }
                return response;
            };
            if (isAuthServerMetadataRequest || isOpenIdConfigRequest) {
                if (request.method !== "GET" && request.method !== "HEAD") {
                    return [2 /*return*/, {
                            response: new Response(null, {
                                status: 405,
                                headers: {
                                    Allow: "GET, HEAD",
                                },
                            }),
                        }];
                }
            }
            if (isAuthServerMetadataRequest) {
                if ((_g = opts.scopes) === null || _g === void 0 ? void 0 : _g.includes("openid")) {
                    return [2 /*return*/, {
                            response: createMetadataResponse((0, metadata_1.oidcServerMetadata)(endpointCtx, opts)),
                        }];
                }
                return [2 /*return*/, {
                        response: createMetadataResponse((0, metadata_1.oauthAuthorizationServerMetadata)(endpointCtx, opts)),
                    }];
            }
            if (isOpenIdConfigRequest) {
                return [2 /*return*/, {
                        response: createMetadataResponse((0, metadata_1.oidcServerMetadata)(endpointCtx, opts)),
                    }];
            }
            return [2 /*return*/];
        });
    }); };
    var oauth2AuthorizeEndpoint = (0, oauth_endpoint_1.createOAuthEndpoint)("/oauth2/authorize", {
        method: ["GET", "POST"],
        body: z.object({}).passthrough(),
        redirectOnError: (0, authorize_1.authorizeRedirectOnError)(opts),
        metadata: {
            allowedMediaTypes: ["application/x-www-form-urlencoded"],
            openapi: {
                description: "Authorize an OAuth 2.1 request from query parameters or an application/x-www-form-urlencoded POST body",
                parameters: [
                    {
                        name: "response_type",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "OAuth 2.1 response type (e.g., 'code')",
                    },
                    {
                        name: "client_id",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                        description: "OAuth 2.1 client ID",
                    },
                    {
                        name: "redirect_uri",
                        in: "query",
                        required: false,
                        schema: { type: "string", format: "uri" },
                        description: "OAuth 2.1 redirect URI",
                    },
                    {
                        name: "scope",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "OAuth 2.1 scopes (space-separated)",
                    },
                    {
                        name: "state",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "OAuth 2.1 state parameter",
                    },
                    {
                        name: "request_uri",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "Pushed Authorization Request URI referencing stored parameters",
                    },
                    {
                        name: "code_challenge",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "PKCE code challenge",
                    },
                    {
                        name: "code_challenge_method",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "PKCE code challenge method",
                    },
                    {
                        name: "nonce",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "OpenID Connect nonce",
                    },
                    {
                        name: "max_age",
                        in: "query",
                        required: false,
                        schema: { type: "integer", minimum: 0 },
                        description: "Maximum authentication age in seconds; forces re-authentication when exceeded",
                    },
                    {
                        name: "resource",
                        in: "query",
                        required: false,
                        schema: { type: "array", items: { type: "string" } },
                        description: "Requested protected resource(s) for the access token. May be supplied multiple times as repeated 'resource' query parameters (RFC 8707) or as an array of strings.",
                    },
                    {
                        name: "prompt",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "OAuth2 prompt parameter",
                    },
                ],
                responses: {
                    "302": {
                        description: "Redirect to client with code or error",
                        headers: {
                            Location: {
                                description: "Redirect URI with code or error",
                                schema: { type: "string", format: "uri" },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid request",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        error: { type: "string" },
                                        error_description: { type: "string" },
                                        state: { type: "string" },
                                    },
                                    required: ["error"],
                                },
                            },
                        },
                    },
                },
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var settings;
        var _a;
        return __generator(this, function (_b) {
            settings = (_a = ctx.authorizeSettings) !== null && _a !== void 0 ? _a : {
                isAuthorize: true,
            };
            return [2 /*return*/, (0, authorize_1.authorizeEndpoint)(ctx, opts, settings)];
        });
    }); });
    var runOAuth2Authorize = function (ctx, settings) {
        return (0, api_1.dispatchAuthEndpoint)(oauth2AuthorizeEndpoint, __assign(__assign({}, ctx), { asResponse: false, returnHeaders: false, returnStatus: false, authorizeSettings: settings !== null && settings !== void 0 ? settings : {} }));
    };
    return {
        id: "oauth-provider",
        version: version_1.PACKAGE_VERSION,
        options: opts,
        onRequest: handleIssuerMetadataRequest,
        init: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
            var gap, jwtPlugin, jwtPluginOptions, issuer, isDynamicBaseURLInit;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        // OAuth provider performs adapter-level session lookups by id, so it
                        // currently requires DB-backed sessions whenever secondary storage is enabled.
                        if (ctx.options.secondaryStorage &&
                            ((_a = ctx.options.session) === null || _a === void 0 ? void 0 : _a.storeSessionInDatabase) !== true) {
                            throw new error_1.BetterAuthError("OAuth Provider requires `session.storeSessionInDatabase: true` when using secondaryStorage");
                        }
                        // A replayed rotation assertion would hand over a client's keys, so
                        // rotation needs the jti tombstone to be single-use. The memory adapter
                        // does not enforce primary keys, and "serial" ids replace the derived id.
                        // shortcut: lists the known built-in gaps only; replace with a core check
                        // when the FIXME(serial-derived-ids) in get-id-field.ts is resolved.
                        if (opts.allowClientKeyRotation) {
                            gap = ctx.adapter.id === "memory"
                                ? "the memory adapter"
                                : ((_c = (_b = ctx.options.advanced) === null || _b === void 0 ? void 0 : _b.database) === null || _c === void 0 ? void 0 : _c.generateId) === "serial"
                                    ? '`advanced.database.generateId: "serial"`'
                                    : undefined;
                            if (gap) {
                                throw new error_1.BetterAuthError("`allowClientKeyRotation` requires single-use client assertions, which ".concat(gap, " does not enforce"));
                            }
                        }
                        // Seed `oauthResource` rows from plugin config. A failure must not
                        // reject init (a failed init is cached and breaks every route);
                        // `getResource` retries the seed on first resource access.
                        // TODO(#11725): remove database I/O from init. Resolve configured
                        // resources at lookup time and create a row only when a link needs one.
                        return [4 /*yield*/, (0, resources_1.seedResourcesOnce)(ctx, opts).catch(function (error) {
                                return (0, resources_1.logStartupSeedFailure)(ctx, error);
                            })];
                    case 1:
                        // Seed `oauthResource` rows from plugin config. A failure must not
                        // reject init (a failed init is cached and breaks every route);
                        // `getResource` retries the seed on first resource access.
                        // TODO(#11725): remove database I/O from init. Resolve configured
                        // resources at lookup time and create a row only when a link needs one.
                        _g.sent();
                        // Record which default applied to `enforcePerClientResources` so
                        // admins can see it in startup logs. Pure resolution lives in
                        // `resolveEnforcePerClientResources` so validation flow stays cheap.
                        (0, resources_1.logEnforcePerClientResourcesResolution)(opts);
                        // Fail fast on an invalid configured issuer. A dynamic baseURL
                        // resolves per-request, so there is nothing to validate at init
                        // time for that deployment shape.
                        if (!opts.disableJwtPlugin) {
                            jwtPlugin = (0, utils_1.getJwtPlugin)(ctx);
                            jwtPluginOptions = jwtPlugin === null || jwtPlugin === void 0 ? void 0 : jwtPlugin.options;
                            issuer = (_e = (_d = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _d === void 0 ? void 0 : _d.issuer) !== null && _e !== void 0 ? _e : ctx.baseURL;
                            isDynamicBaseURLInit = ((_f = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _f === void 0 ? void 0 : _f.issuer) == null &&
                                typeof ctx.options.baseURL === "object" &&
                                ctx.options.baseURL !== null &&
                                "allowedHosts" in ctx.options.baseURL;
                            try {
                                new URL(issuer);
                            }
                            catch (error) {
                                if (!isDynamicBaseURLInit || issuer !== "")
                                    throw error;
                            }
                        }
                        // The hook must register for every configuration path (including
                        // dynamic baseURL). Core runs delete.after only after the session row is
                        // consumed and queues it until the surrounding transaction commits.
                        return [2 /*return*/, {
                                options: {
                                    databaseHooks: {
                                        session: {
                                            delete: {
                                                before: function (session, hookCtx) {
                                                    return __awaiter(this, void 0, void 0, function () {
                                                        var plan, logoutPlanBySessionId;
                                                        var _a;
                                                        return __generator(this, function (_b) {
                                                            switch (_b.label) {
                                                                case 0:
                                                                    if (!hookCtx)
                                                                        return [2 /*return*/];
                                                                    return [4 /*yield*/, (0, logout_1.prepareBackchannelLogoutPlan)(hookCtx, opts, {
                                                                            sessionId: session.id,
                                                                            userId: session.userId,
                                                                        })];
                                                                case 1:
                                                                    plan = _b.sent();
                                                                    if (!plan)
                                                                        return [2 /*return*/];
                                                                    logoutPlanBySessionId = (_a = backchannelLogoutPlansByContext.get(hookCtx)) !== null && _a !== void 0 ? _a : new Map();
                                                                    logoutPlanBySessionId.set(session.id, plan);
                                                                    backchannelLogoutPlansByContext.set(hookCtx, logoutPlanBySessionId);
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    });
                                                },
                                                after: function (session, hookCtx) {
                                                    return __awaiter(this, void 0, void 0, function () {
                                                        var logoutPlanBySessionId, plan, logoutTask;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    if (!hookCtx)
                                                                        return [2 /*return*/];
                                                                    logoutPlanBySessionId = backchannelLogoutPlansByContext.get(hookCtx);
                                                                    if (!logoutPlanBySessionId)
                                                                        return [2 /*return*/];
                                                                    plan = logoutPlanBySessionId.get(session.id);
                                                                    logoutPlanBySessionId.delete(session.id);
                                                                    if (logoutPlanBySessionId.size === 0) {
                                                                        backchannelLogoutPlansByContext.delete(hookCtx);
                                                                    }
                                                                    if (!plan)
                                                                        return [2 /*return*/];
                                                                    logoutTask = (0, logout_1.applyBackchannelLogoutPlan)(hookCtx, plan).catch(function (error) {
                                                                        hookCtx.context.logger.error("Back-channel logout failed after session deletion", error);
                                                                    });
                                                                    return [4 /*yield*/, hookCtx.context.runInBackgroundOrAwait(logoutTask)];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    });
                                                },
                                            },
                                        },
                                    },
                                },
                            }];
                }
            });
        }); },
        hooks: {
            before: [
                {
                    // Add oauth_query to request state
                    matcher: function (ctx) {
                        var _a;
                        return (_a = ctx.body) === null || _a === void 0 ? void 0 : _a.oauth_query;
                    },
                    handler: (0, api_1.createAuthMiddleware)(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                        var query, isValid, signedQueryIssuedAt, queryParams, postLoginClearedForSession;
                        var _a;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    query = ctx.body.oauth_query;
                                    return [4 /*yield*/, (0, utils_1.verifyOAuthQueryParams)(query, ctx.context.secret)];
                                case 1:
                                    isValid = _c.sent();
                                    if (!isValid) {
                                        throw new api_1.APIError("BAD_REQUEST", {
                                            error: "invalid_signature",
                                        });
                                    }
                                    signedQueryIssuedAt = (0, utils_1.getSignedQueryIssuedAt)(query);
                                    queryParams = new URLSearchParams(query);
                                    postLoginClearedForSession = (_b = queryParams.get(utils_1.postLoginClearedParam)) !== null && _b !== void 0 ? _b : undefined;
                                    queryParams.delete("sig");
                                    queryParams.delete("exp");
                                    queryParams.delete(utils_1.signedQueryIssuedAtParam);
                                    queryParams.delete(utils_1.postLoginClearedParam);
                                    return [4 /*yield*/, exports.oAuthState.set({
                                            query: queryParams.toString(),
                                            signedQueryIssuedAt: signedQueryIssuedAt !== null && signedQueryIssuedAt !== void 0 ? signedQueryIssuedAt : undefined,
                                            postLoginClearedForSession: postLoginClearedForSession,
                                        })];
                                case 2:
                                    _c.sent();
                                    if (!(ctx.path === "/sign-in/social")) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, api_1.addOAuthServerContext)(__assign({ query: queryParams.toString() }, (signedQueryIssuedAt
                                            ? (_a = {},
                                                _a[signedQueryIssuedAtMsKey] = signedQueryIssuedAt.getTime(),
                                                _a) : {})))];
                                case 3:
                                    _c.sent();
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }),
                },
            ],
            after: [
                {
                    // Should only capture when session cookie is set (ie after login)
                    matcher: function (ctx) {
                        var _a;
                        return (0, cookies_1.parseSetCookieHeader)(((_a = ctx.context.responseHeaders) === null || _a === void 0 ? void 0 : _a.get("set-cookie")) || "").has(ctx.context.authCookies.sessionToken.name);
                    },
                    handler: (0, api_1.createAuthMiddleware)(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                        var sessionToken, oauthRequest, oauthState, serverContext, _query, query, session, secFetchMode, acceptHeader, isNavigationRequest, signedQueryIssuedAt, authorizationQuery;
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0:
                                    sessionToken = (_b = (0, cookies_1.parseSetCookieHeader)(((_a = ctx.context.responseHeaders) === null || _a === void 0 ? void 0 : _a.get("set-cookie")) || "")
                                        .get(ctx.context.authCookies.sessionToken.name)) === null || _b === void 0 ? void 0 : _b.value.split(".")[0];
                                    if (!sessionToken)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, exports.oAuthState.get()];
                                case 1:
                                    oauthRequest = _o.sent();
                                    return [4 /*yield*/, (0, api_1.getOAuthState)()];
                                case 2:
                                    oauthState = _o.sent();
                                    serverContext = oauthState === null || oauthState === void 0 ? void 0 : oauthState.serverContext;
                                    _query = (_c = oauthRequest === null || oauthRequest === void 0 ? void 0 : oauthRequest.query) !== null && _c !== void 0 ? _c : serverContext === null || serverContext === void 0 ? void 0 : serverContext.query;
                                    if (!_query)
                                        return [2 /*return*/];
                                    query = new URLSearchParams(_query);
                                    return [4 /*yield*/, ctx.context.internalAdapter.findSession(sessionToken)];
                                case 3:
                                    session = _o.sent();
                                    if (!session)
                                        return [2 /*return*/];
                                    ctx.context.session = session;
                                    secFetchMode = (_f = (_e = (_d = ctx.request) === null || _d === void 0 ? void 0 : _d.headers) === null || _e === void 0 ? void 0 : _e.get("sec-fetch-mode")) === null || _f === void 0 ? void 0 : _f.toLowerCase();
                                    acceptHeader = (_k = (_j = (_h = (_g = ctx.request) === null || _g === void 0 ? void 0 : _g.headers) === null || _h === void 0 ? void 0 : _h.get("accept")) === null || _j === void 0 ? void 0 : _j.toLowerCase()) !== null && _k !== void 0 ? _k : "";
                                    isNavigationRequest = secFetchMode === "navigate" ||
                                        (!secFetchMode &&
                                            (acceptHeader.includes("text/html") ||
                                                acceptHeader.includes("application/xhtml+xml")));
                                    if (!isNavigationRequest) {
                                        (_l = ctx.headers) === null || _l === void 0 ? void 0 : _l.set("accept", "application/json");
                                    }
                                    signedQueryIssuedAt = (_m = oauthRequest === null || oauthRequest === void 0 ? void 0 : oauthRequest.signedQueryIssuedAt) !== null && _m !== void 0 ? _m : getServerContextSignedQueryIssuedAt(serverContext === null || serverContext === void 0 ? void 0 : serverContext[signedQueryIssuedAtMsKey]);
                                    authorizationQuery = (0, utils_1.removePromptFromQuery)(query, "login");
                                    if ((0, utils_1.isSessionFreshForSignedQuery)(session.session.createdAt, signedQueryIssuedAt)) {
                                        authorizationQuery = (0, utils_1.removeMaxAgeFromQuery)(authorizationQuery);
                                    }
                                    ctx.query = (0, utils_1.searchParamsToQuery)(authorizationQuery);
                                    return [4 /*yield*/, runOAuth2Authorize(ctx)];
                                case 4: return [2 /*return*/, _o.sent()];
                            }
                        });
                    }); }),
                },
            ],
        },
        endpoints: {
            /**
             * A server-only endpoint that helps provide the
             * oAuth Server configuration at the well-known endpoint.
             *
             * Provided at /.well-known/oauth-authorization-server/[issuer-path]
             * (root if no issuer-path).
             */
            getOAuthServerConfig: (0, api_1.createAuthEndpoint)("/.well-known/oauth-authorization-server", {
                method: "GET",
                metadata: {
                    SERVER_ONLY: true,
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                var metadata;
                return __generator(this, function (_a) {
                    if (opts.scopes && opts.scopes.includes("openid")) {
                        metadata = (0, metadata_1.oidcServerMetadata)(ctx, opts);
                        return [2 /*return*/, metadata];
                    }
                    else {
                        return [2 /*return*/, (0, metadata_1.oauthAuthorizationServerMetadata)(ctx, opts)];
                    }
                    return [2 /*return*/];
                });
            }); }),
            /**
             * A server-only endpoint that helps provide the
             * OpenId configuration at the well-known endpoint.
             *
             * Provided at [issuer-path]/.well-known/openid-configuration
             * (root if no issuer-path).
             */
            getOpenIdConfig: (0, api_1.createAuthEndpoint)("/.well-known/openid-configuration", {
                method: "GET",
                metadata: {
                    SERVER_ONLY: true,
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                var metadata;
                return __generator(this, function (_a) {
                    if (opts.scopes && !opts.scopes.includes("openid")) {
                        throw new api_1.APIError("NOT_FOUND");
                    }
                    metadata = (0, metadata_1.oidcServerMetadata)(ctx, opts);
                    return [2 /*return*/, metadata];
                });
            }); }),
            oauth2Authorize: oauth2AuthorizeEndpoint,
            oauth2Consent: (0, api_1.createAuthEndpoint)("/oauth2/consent", {
                method: "POST",
                body: z.object({
                    accept: z.boolean().meta({
                        description: "Accept or deny user consent for a set of scopes",
                    }),
                    scope: z.string().optional().meta({
                        description: "List of accept of accepted space-separated scopes. If none is provided, then all originally requested scopes are accepted.",
                    }),
                    claims: claims_request_1.claimsRequestParameterSchema.optional().meta({
                        description: "Accepted OIDC claims request object. If none is provided, then all originally requested claims are accepted.",
                    }),
                    oauth_query: z.string().optional().meta({
                        description: "The redirected page's query parameters",
                    }),
                }),
                use: [api_1.sessionMiddleware],
                metadata: {
                    openapi: {
                        description: "Handle OAuth2 consent",
                        responses: {
                            "200": {
                                description: "Consent processed successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                redirect: {
                                                    type: "boolean",
                                                    description: "Always true. Indicates the caller should redirect to `url`.",
                                                    enum: [true],
                                                },
                                                url: {
                                                    type: "string",
                                                    format: "uri-reference",
                                                    description: "The absolute or relative URI to redirect to next.",
                                                },
                                            },
                                            required: ["redirect", "url"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, consent_1.consentEndpoint)(ctx, opts, runOAuth2Authorize)];
                });
            }); }),
            oauth2Continue: (0, api_1.createAuthEndpoint)("/oauth2/continue", {
                method: "POST",
                body: z.object({
                    selected: z.boolean().optional().meta({
                        description: "Confirms an account has been selected and authorization can proceed.",
                    }),
                    created: z.boolean().optional().meta({
                        description: "Confirms an account was registered",
                    }),
                    postLogin: z.boolean().optional().meta({
                        description: "Resumes after the post login page. postLogin.shouldRedirect runs again with isContinuation: true.",
                    }),
                    oauth_query: z.string().optional().meta({
                        description: "The redirected page's query parameters",
                    }),
                }),
                use: [api_1.sessionMiddleware],
                metadata: {
                    openapi: {
                        description: "Continues OAuth2 authorization flow",
                        responses: {
                            "200": {
                                description: "Authorization flow continued successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                redirect: {
                                                    type: "boolean",
                                                    description: "Always true. Indicates the caller should redirect to `url`.",
                                                    enum: [true],
                                                },
                                                url: {
                                                    type: "string",
                                                    format: "uri-reference",
                                                    description: "The absolute or relative URI to redirect to next.",
                                                },
                                            },
                                            required: ["redirect", "url"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, continue_1.continueEndpoint)(ctx, runOAuth2Authorize)];
                });
            }); }),
            oauth2Token: (0, oauth_endpoint_1.createOAuthEndpoint)("/oauth2/token", {
                method: "POST",
                // RFC 8707 §2 allows the client to repeat the `resource`
                // parameter. better-call's form-body parser collapses
                // repeated keys (last-write-wins) so we re-parse the raw
                // body in the handler to recover the full list. That
                // requires the underlying request body to be readable a
                // second time, which only works when better-call clones
                // the request before its own parse.
                cloneRequest: true,
                body: z
                    .object({
                    grant_type: z.string().trim().min(1),
                    client_id: z.string().optional(),
                    client_secret: z.string().optional(),
                    client_assertion: z.string().optional(),
                    client_assertion_type: z.string().optional(),
                    code: z.string().optional(),
                    code_verifier: z.string().optional(),
                    redirect_uri: zod_1.RedirectUriSyntaxSchema.optional(),
                    refresh_token: z.string().optional(),
                    resource: z
                        .union([zod_1.ResourceUriSchema, z.array(zod_1.ResourceUriSchema).min(1)])
                        .optional(),
                    scope: z.string().optional(),
                })
                    .passthrough(),
                errorCodesByField: {
                    grant_type: {
                        missing: "invalid_request",
                        invalid: "unsupported_grant_type",
                    },
                    resource: { invalid: "invalid_target" },
                },
                metadata: {
                    noStore: true,
                    allowedMediaTypes: ["application/x-www-form-urlencoded"],
                    openapi: {
                        description: "Obtain an OAuth2.1 access token",
                        parameters: [
                            {
                                name: "DPoP",
                                in: "header",
                                required: false,
                                schema: { type: "string" },
                                description: "RFC 9449 DPoP proof JWT for issuing DPoP-bound tokens",
                            },
                        ],
                        requestBody: {
                            required: true,
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            grant_type: {
                                                type: "string",
                                                description: "OAuth2 grant type",
                                            },
                                            client_id: {
                                                type: "string",
                                                description: "OAuth2 client ID",
                                            },
                                            client_secret: {
                                                type: "string",
                                                description: "OAuth2 client secret",
                                            },
                                            code: {
                                                type: "string",
                                                description: "Authorization code (for authorization_code grant)",
                                            },
                                            code_verifier: {
                                                type: "string",
                                                description: "PKCE code verifier (for authorization_code grant)",
                                            },
                                            redirect_uri: {
                                                type: "string",
                                                format: "uri",
                                                description: "Redirect URI (for authorization_code grant)",
                                            },
                                            refresh_token: {
                                                type: "string",
                                                description: "Refresh token (for refresh_token grant)",
                                            },
                                            resource: {
                                                oneOf: [
                                                    {
                                                        type: "string",
                                                        description: "Single resource (URL)",
                                                    },
                                                    {
                                                        type: "array",
                                                        items: { type: "string" },
                                                        description: "Multiple resources (URLs)",
                                                    },
                                                ],
                                                description: "Requested protected resource(s) for the access token",
                                            },
                                            scope: {
                                                type: "string",
                                                description: "Requested scopes (for client_credentials grant)",
                                            },
                                        },
                                        required: ["grant_type"],
                                    },
                                },
                            },
                        },
                        responses: {
                            "200": {
                                description: "Access token response",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                access_token: {
                                                    type: "string",
                                                    description: "The access token issued by the authorization server",
                                                },
                                                token_type: {
                                                    type: "string",
                                                    description: "The type of the token issued",
                                                    enum: ["Bearer", "DPoP"],
                                                },
                                                expires_in: {
                                                    type: "number",
                                                    description: "Lifetime in seconds of the access token",
                                                },
                                                refresh_token: {
                                                    type: "string",
                                                    description: "Refresh token, if issued",
                                                },
                                                scope: {
                                                    type: "string",
                                                    description: "Scopes granted by the access token",
                                                },
                                                id_token: {
                                                    type: "string",
                                                    description: "ID Token (if OpenID Connect)",
                                                },
                                            },
                                            required: ["access_token", "token_type", "expires_in"],
                                        },
                                    },
                                },
                            },
                            "400": {
                                description: "Invalid request or error response",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                error: { type: "string" },
                                                error_description: { type: "string" },
                                                error_uri: { type: "string" },
                                            },
                                            required: ["error"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                var repeated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!ctx.request) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, resources_1.extractRepeatedResourceFromForm)(ctx.request)];
                        case 1:
                            repeated = _a.sent();
                            if (repeated && repeated.length > 1) {
                                ctx.body.resource = repeated;
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/, (0, token_1.tokenEndpoint)(ctx, opts)];
                    }
                });
            }); }),
            oauth2Introspect: (0, oauth_endpoint_1.createOAuthEndpoint)("/oauth2/introspect", {
                method: "POST",
                // Credential cardinality is enforced from the raw form body.
                cloneRequest: true,
                body: z.object({
                    client_id: z.string().optional(),
                    client_secret: z.string().optional(),
                    client_assertion: z.string().optional(),
                    client_assertion_type: z.string().optional(),
                    token: z.string(),
                    // RFC 7662 §2.1: hint, server MAY ignore. Unknown values are
                    // coerced to undefined in introspectEndpoint so detection falls
                    // back to trying both token types.
                    token_type_hint: z.string().optional(),
                }),
                metadata: {
                    noStore: true,
                    allowedMediaTypes: ["application/x-www-form-urlencoded"],
                    openapi: {
                        description: "Introspect an OAuth2 access or refresh token",
                        requestBody: {
                            required: true,
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            client_id: {
                                                type: "string",
                                                description: "OAuth2 client ID",
                                            },
                                            client_secret: {
                                                type: "string",
                                                description: "OAuth2 client secret",
                                            },
                                            token: {
                                                type: "string",
                                                description: "The token to introspect (access or refresh token)",
                                            },
                                            token_type_hint: {
                                                type: "string",
                                                description: "Hint about the token type. Recognized values: `access_token`, `refresh_token`.",
                                            },
                                        },
                                        required: ["token"],
                                    },
                                },
                            },
                        },
                        responses: {
                            "200": {
                                description: "Token introspection response",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                active: {
                                                    type: "boolean",
                                                    description: "Whether the token is active",
                                                },
                                                scope: {
                                                    type: "string",
                                                    description: "Scopes associated with the token",
                                                },
                                                client_id: {
                                                    type: "string",
                                                    description: "Client ID associated with the token",
                                                },
                                                username: {
                                                    type: "string",
                                                    description: "Username associated with the token",
                                                },
                                                token_type: {
                                                    type: "string",
                                                    description: "Type of the token",
                                                },
                                                exp: {
                                                    type: "number",
                                                    description: "Expiration time of the token (seconds since epoch)",
                                                },
                                                iat: {
                                                    type: "number",
                                                    description: "Issued at time (seconds since epoch)",
                                                },
                                                nbf: {
                                                    type: "number",
                                                    description: "Not before time (seconds since epoch)",
                                                },
                                                sub: {
                                                    type: "string",
                                                    description: "Subject of the token",
                                                },
                                                aud: {
                                                    type: "string",
                                                    description: "Audience of the token",
                                                },
                                                iss: {
                                                    type: "string",
                                                    description: "Issuer of the token",
                                                },
                                                jti: {
                                                    type: "string",
                                                    description: "JWT ID",
                                                },
                                            },
                                            required: ["active"],
                                        },
                                    },
                                },
                            },
                            "400": {
                                description: "Invalid request or error response",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                error: { type: "string" },
                                                error_description: { type: "string" },
                                                error_uri: { type: "string" },
                                            },
                                            required: ["error"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, introspect_1.introspectEndpoint)(ctx, opts)];
                });
            }); }),
            oauth2Revoke: (0, oauth_endpoint_1.createOAuthEndpoint)("/oauth2/revoke", {
                method: "POST",
                // Credential cardinality is enforced from the raw form body.
                cloneRequest: true,
                body: z.object({
                    client_id: z.string().optional(),
                    client_secret: z.string().optional(),
                    client_assertion: z.string().optional(),
                    client_assertion_type: z.string().optional(),
                    token: z.string(),
                    // RFC 7009 §2.2.1: hint, server MAY ignore. Unknown values are
                    // coerced to undefined in revokeEndpoint; `unsupported_token_type`
                    // in RFC 7009 applies to the token itself, not the hint value.
                    token_type_hint: z.string().optional(),
                }),
                metadata: {
                    allowedMediaTypes: ["application/x-www-form-urlencoded"],
                    openapi: {
                        description: "Revoke an OAuth2 access or refresh token",
                        requestBody: {
                            required: true,
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            client_id: {
                                                type: "string",
                                                description: "OAuth2 client ID",
                                            },
                                            client_secret: {
                                                type: "string",
                                                description: "OAuth2 client secret",
                                            },
                                            token: {
                                                type: "string",
                                                description: "The token to revoke (access or refresh token)",
                                            },
                                            token_type_hint: {
                                                type: "string",
                                                description: "Hint about the token type. Recognized values: `access_token`, `refresh_token`.",
                                            },
                                        },
                                        required: ["token"],
                                    },
                                },
                            },
                        },
                        responses: {
                            "200": {
                                description: "Token revoked successfully. The response body is empty.",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            description: "Empty object on success",
                                        },
                                    },
                                },
                            },
                            "400": {
                                description: "Invalid request or error response",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                error: { type: "string" },
                                                error_description: { type: "string" },
                                                error_uri: { type: "string" },
                                            },
                                            required: ["error"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, revoke_1.revokeEndpoint)(ctx, opts)];
                });
            }); }),
            oauth2UserInfo: (0, api_1.createAuthEndpoint)("/oauth2/userinfo", {
                method: ["GET", "POST"],
                body: z
                    .object({
                    access_token: z.string().optional(),
                })
                    .passthrough()
                    .optional(),
                metadata: {
                    noStore: true,
                    allowedMediaTypes: ["application/x-www-form-urlencoded"],
                    openapi: {
                        description: "Get OpenID Connect user information (UserInfo endpoint)",
                        security: [
                            { bearerAuth: [] },
                            { OAuth2: ["openid", "profile", "email"] },
                        ],
                        parameters: [
                            {
                                name: "Authorization",
                                in: "header",
                                required: false,
                                schema: { type: "string" },
                                description: "Bearer or DPoP access token",
                            },
                            {
                                name: "DPoP",
                                in: "header",
                                required: false,
                                schema: { type: "string" },
                                description: "RFC 9449 DPoP proof JWT when using a DPoP-bound access token",
                            },
                        ],
                        responses: {
                            "200": {
                                description: "User information retrieved successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                sub: {
                                                    type: "string",
                                                    description: "Subject identifier (user ID)",
                                                },
                                                email: {
                                                    type: "string",
                                                    format: "email",
                                                    nullable: true,
                                                    description: "User's email address, included if 'email' scope is granted",
                                                },
                                                name: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "User's full name, included if 'profile' scope is granted",
                                                },
                                                picture: {
                                                    type: "string",
                                                    format: "uri",
                                                    nullable: true,
                                                    description: "User's profile picture URL, included if 'profile' scope is granted",
                                                },
                                                given_name: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "User's given name, included if 'profile' scope is granted",
                                                },
                                                family_name: {
                                                    type: "string",
                                                    nullable: true,
                                                    description: "User's family name, included if 'profile' scope is granted",
                                                },
                                                email_verified: {
                                                    type: "boolean",
                                                    nullable: true,
                                                    description: "Whether the email is verified, included if 'email' scope is granted",
                                                },
                                            },
                                            required: ["sub"],
                                        },
                                    },
                                },
                            },
                            "401": {
                                description: "Unauthorized - invalid or missing access token",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                error: { type: "string" },
                                                error_description: { type: "string" },
                                            },
                                            required: ["error"],
                                        },
                                    },
                                },
                            },
                            "403": {
                                description: "Forbidden - insufficient scope",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                error: { type: "string" },
                                                error_description: { type: "string" },
                                            },
                                            required: ["error"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, userinfo_1.userInfoEndpoint)(ctx, opts)];
                });
            }); }),
            oauth2EndSession: (0, oauth_endpoint_1.createOAuthEndpoint)("/oauth2/end-session", {
                method: ["GET", "POST"],
                body: rpInitiatedLogoutRequestSchema.optional(),
                query: rpInitiatedLogoutRequestSchema.optional(),
                metadata: {
                    noStore: true,
                    allowedMediaTypes: [
                        "application/x-www-form-urlencoded",
                        // Better Auth's generated client sends endpoint bodies as JSON.
                        "application/json",
                    ],
                    $Infer: {
                        body: {},
                        query: {},
                    },
                    openapi: {
                        description: "RP-Initiated Logout endpoint. Accepts standard logout parameters through GET or an application/x-www-form-urlencoded POST body, plus JSON for Better Auth generated-client calls. Requests without a usable id_token_hint may require explicit OP confirmation.",
                        responses: {
                            "200": {
                                description: "Logout completed, or an HTML confirmation page was returned for browser navigation. A redirect is used only for an exact registered post_logout_redirect_uri.",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                redirect_uri: {
                                                    type: "string",
                                                    format: "uri",
                                                    description: "URI to redirect to after logout (if post_logout_redirect_uri was provided)",
                                                },
                                                message: {
                                                    type: "string",
                                                    description: "Success message",
                                                },
                                            },
                                        },
                                    },
                                    "text/html": {
                                        schema: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, logout_1.rpInitiatedLogoutEndpoint)(ctx, opts)];
                });
            }); }),
            oauth2EndSessionConfirmation: (0, oauth_endpoint_1.createOAuthEndpoint)("/oauth2/end-session/confirm", {
                method: "POST",
                body: z.object({
                    action: z.literal("confirm"),
                }),
                metadata: {
                    noStore: true,
                    allowedMediaTypes: ["application/x-www-form-urlencoded"],
                    scope: "http",
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, logout_1.rpInitiatedLogoutConfirmationEndpoint)(ctx, opts)];
                });
            }); }),
            registerOAuthClient: (0, oauth_endpoint_1.createOAuthEndpoint)("/oauth2/register", {
                method: "POST",
                body: zod_1.clientRegistrationRequestSchema,
                errorCodesByField: {
                    redirect_uris: "invalid_redirect_uri",
                    post_logout_redirect_uris: "invalid_redirect_uri",
                    software_statement: "invalid_software_statement",
                    // RFC 8707 §2: a malformed resource indicator is invalid_target,
                    // matching the existence check in registerEndpoint.
                    resources: "invalid_target",
                },
                defaultError: "invalid_client_metadata",
                metadata: {
                    noStore: true,
                    openapi: {
                        description: "Register an OAuth2 application",
                        responses: {
                            "201": {
                                description: "OAuth2 application registered successfully",
                                content: {
                                    "application/json": {
                                        schema: {
                                            /** @returns {OauthClient} */
                                            type: "object",
                                            properties: {
                                                client_id: {
                                                    type: "string",
                                                    description: "Unique identifier for the client",
                                                },
                                                client_secret: {
                                                    type: "string",
                                                    description: "Secret key for the client",
                                                },
                                                client_secret_expires_at: {
                                                    type: "number",
                                                    description: "Time the client secret will expire. If 0, the client secret will never expire.",
                                                },
                                                scope: {
                                                    type: "string",
                                                    description: "Space-separated scopes allowed by the client",
                                                },
                                                user_id: {
                                                    type: "string",
                                                    description: "ID of the user who registered the client, null if registered anonymously",
                                                },
                                                client_id_issued_at: {
                                                    type: "number",
                                                    description: "Creation timestamp of this client",
                                                },
                                                client_name: {
                                                    type: "string",
                                                    description: "Name of the OAuth2 application",
                                                },
                                                client_uri: {
                                                    type: "string",
                                                    description: "Name of the OAuth2 application",
                                                },
                                                logo_uri: {
                                                    type: "string",
                                                    description: "Icon URL for the application",
                                                },
                                                contacts: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                    },
                                                    description: "List representing ways to contact people responsible for this client, typically email addresses",
                                                },
                                                tos_uri: {
                                                    type: "string",
                                                    description: "Client's terms of service uri",
                                                },
                                                policy_uri: {
                                                    type: "string",
                                                    description: "Client's policy uri",
                                                },
                                                software_id: {
                                                    type: "string",
                                                    description: "Unique identifier assigned by the developer to help in the dynamic registration process",
                                                },
                                                software_version: {
                                                    type: "string",
                                                    description: "Version identifier for the software_id",
                                                },
                                                software_statement: {
                                                    type: "string",
                                                    description: "JWT containing metadata values about the client software as claims",
                                                },
                                                redirect_uris: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        format: "uri",
                                                    },
                                                    description: "List of allowed redirect uris",
                                                },
                                                post_logout_redirect_uris: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        format: "uri",
                                                    },
                                                    description: "List of allowed logout redirect uris",
                                                },
                                                backchannel_logout_uri: {
                                                    type: "string",
                                                    format: "uri",
                                                    description: "RP URL to receive signed Logout Tokens when the end-user's OP session terminates",
                                                },
                                                backchannel_logout_session_required: {
                                                    type: "boolean",
                                                    description: "Whether the RP requires a `sid` claim in every Logout Token",
                                                },
                                                token_endpoint_auth_method: {
                                                    type: "string",
                                                    description: "Requested authentication method for the token endpoint",
                                                },
                                                grant_types: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                    },
                                                    description: "Grant types the client may use at the token endpoint",
                                                },
                                                response_types: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        enum: ["code"],
                                                    },
                                                    description: "Response types the client may use at the authorization endpoint",
                                                },
                                                application_type: {
                                                    type: "string",
                                                    description: "OIDC application type used to classify redirect URI policy",
                                                    enum: ["web", "native"],
                                                },
                                                resources: {
                                                    type: "array",
                                                    items: {
                                                        type: "string",
                                                        format: "uri",
                                                    },
                                                    description: "Final resource identifiers linked to the registered client",
                                                },
                                                disabled: {
                                                    type: "boolean",
                                                    description: "Whether the client is disabled",
                                                },
                                            },
                                            required: ["client_id"],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (0, register_1.registerEndpoint)(ctx, opts)];
                });
            }); }),
            adminCreateOAuthClient: oauthClientEndpoints.adminCreateOAuthClient(opts),
            createOAuthClient: oauthClientEndpoints.createOAuthClient(opts),
            getOAuthClient: oauthClientEndpoints.getOAuthClient(opts),
            getOAuthClientPublic: oauthClientEndpoints.getOAuthClientPublic(opts),
            getOAuthClientPublicPrelogin: oauthClientEndpoints.getOAuthClientPublicPrelogin(opts),
            getOAuthClients: oauthClientEndpoints.getOAuthClients(opts),
            adminUpdateOAuthClient: oauthClientEndpoints.adminUpdateOAuthClient(opts),
            updateOAuthClient: oauthClientEndpoints.updateOAuthClient(opts),
            rotateClientSecret: oauthClientEndpoints.rotateClientSecret(opts),
            rotateClientKeys: oauthClientEndpoints.rotateClientKeys(opts),
            deleteOAuthClient: oauthClientEndpoints.deleteOAuthClient(opts),
            getOAuthConsent: oauthConsentEndpoints.getOAuthConsent(opts),
            getOAuthConsents: oauthConsentEndpoints.getOAuthConsents(opts),
            updateOAuthConsent: oauthConsentEndpoints.updateOAuthConsent(opts),
            deleteOAuthConsent: oauthConsentEndpoints.deleteOAuthConsent(opts),
            adminCreateOAuthResource: oauthResourceEndpoints.adminCreateOAuthResource(opts),
            adminListOAuthResources: oauthResourceEndpoints.adminListOAuthResources(opts),
            adminGetOAuthResource: oauthResourceEndpoints.adminGetOAuthResource(opts),
            adminUpdateOAuthResource: oauthResourceEndpoints.adminUpdateOAuthResource(opts),
            adminDeleteOAuthResource: oauthResourceEndpoints.adminDeleteOAuthResource(opts),
            adminLinkClientResource: oauthResourceEndpoints.adminLinkClientResource(opts),
            adminUnlinkClientResource: oauthResourceEndpoints.adminUnlinkClientResource(opts),
        },
        // `mergeSchema` applies overrides in place. Clone the package schema so
        // one auth instance's custom model/field names cannot leak into another
        // instance created in the same process.
        schema: (0, db_1.mergeSchema)(structuredClone(schema_1.schema), opts === null || opts === void 0 ? void 0 : opts.schema),
        rateLimit: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], (((_e = opts.rateLimit) === null || _e === void 0 ? void 0 : _e.token) !== false
            ? [
                {
                    pathMatcher: function (path) { return path === "/oauth2/token"; },
                    window: (_h = (_g = (_f = opts.rateLimit) === null || _f === void 0 ? void 0 : _f.token) === null || _g === void 0 ? void 0 : _g.window) !== null && _h !== void 0 ? _h : 60,
                    max: (_l = (_k = (_j = opts.rateLimit) === null || _j === void 0 ? void 0 : _j.token) === null || _k === void 0 ? void 0 : _k.max) !== null && _l !== void 0 ? _l : 20,
                },
            ]
            : []), true), (((_m = opts.rateLimit) === null || _m === void 0 ? void 0 : _m.authorize) !== false
            ? [
                {
                    pathMatcher: function (path) { return path === "/oauth2/authorize"; },
                    window: (_q = (_p = (_o = opts.rateLimit) === null || _o === void 0 ? void 0 : _o.authorize) === null || _p === void 0 ? void 0 : _p.window) !== null && _q !== void 0 ? _q : 60,
                    max: (_t = (_s = (_r = opts.rateLimit) === null || _r === void 0 ? void 0 : _r.authorize) === null || _s === void 0 ? void 0 : _s.max) !== null && _t !== void 0 ? _t : 30,
                },
            ]
            : []), true), (((_u = opts.rateLimit) === null || _u === void 0 ? void 0 : _u.introspect) !== false
            ? [
                {
                    pathMatcher: function (path) { return path === "/oauth2/introspect"; },
                    window: (_x = (_w = (_v = opts.rateLimit) === null || _v === void 0 ? void 0 : _v.introspect) === null || _w === void 0 ? void 0 : _w.window) !== null && _x !== void 0 ? _x : 60,
                    max: (_0 = (_z = (_y = opts.rateLimit) === null || _y === void 0 ? void 0 : _y.introspect) === null || _z === void 0 ? void 0 : _z.max) !== null && _0 !== void 0 ? _0 : 100,
                },
            ]
            : []), true), (((_1 = opts.rateLimit) === null || _1 === void 0 ? void 0 : _1.revoke) !== false
            ? [
                {
                    pathMatcher: function (path) { return path === "/oauth2/revoke"; },
                    window: (_4 = (_3 = (_2 = opts.rateLimit) === null || _2 === void 0 ? void 0 : _2.revoke) === null || _3 === void 0 ? void 0 : _3.window) !== null && _4 !== void 0 ? _4 : 60,
                    max: (_7 = (_6 = (_5 = opts.rateLimit) === null || _5 === void 0 ? void 0 : _5.revoke) === null || _6 === void 0 ? void 0 : _6.max) !== null && _7 !== void 0 ? _7 : 30,
                },
            ]
            : []), true), (((_8 = opts.rateLimit) === null || _8 === void 0 ? void 0 : _8.register) !== false
            ? [
                {
                    pathMatcher: function (path) { return path === "/oauth2/register"; },
                    window: (_11 = (_10 = (_9 = opts.rateLimit) === null || _9 === void 0 ? void 0 : _9.register) === null || _10 === void 0 ? void 0 : _10.window) !== null && _11 !== void 0 ? _11 : 60,
                    max: (_14 = (_13 = (_12 = opts.rateLimit) === null || _12 === void 0 ? void 0 : _12.register) === null || _13 === void 0 ? void 0 : _13.max) !== null && _14 !== void 0 ? _14 : 5,
                },
            ]
            : []), true), (((_15 = opts.rateLimit) === null || _15 === void 0 ? void 0 : _15.rotateClientKeys) !== false
            ? [
                {
                    pathMatcher: function (path) {
                        return path === "/oauth2/client/rotate-keys";
                    },
                    window: (_18 = (_17 = (_16 = opts.rateLimit) === null || _16 === void 0 ? void 0 : _16.rotateClientKeys) === null || _17 === void 0 ? void 0 : _17.window) !== null && _18 !== void 0 ? _18 : 60,
                    max: (_21 = (_20 = (_19 = opts.rateLimit) === null || _19 === void 0 ? void 0 : _19.rotateClientKeys) === null || _20 === void 0 ? void 0 : _20.max) !== null && _21 !== void 0 ? _21 : 5,
                },
            ]
            : []), true), (((_22 = opts.rateLimit) === null || _22 === void 0 ? void 0 : _22.userinfo) !== false
            ? [
                {
                    pathMatcher: function (path) { return path === "/oauth2/userinfo"; },
                    window: (_25 = (_24 = (_23 = opts.rateLimit) === null || _23 === void 0 ? void 0 : _23.userinfo) === null || _24 === void 0 ? void 0 : _24.window) !== null && _25 !== void 0 ? _25 : 60,
                    max: (_28 = (_27 = (_26 = opts.rateLimit) === null || _26 === void 0 ? void 0 : _26.userinfo) === null || _27 === void 0 ? void 0 : _27.max) !== null && _28 !== void 0 ? _28 : 60,
                },
            ]
            : []), true),
    };
};
exports.oauthProvider = oauthProvider;
