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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRedirect = void 0;
exports.formatErrorURL = formatErrorURL;
exports.validateIssuerUrl = validateIssuerUrl;
exports.getIssuer = getIssuer;
exports.getErrorURL = getErrorURL;
exports.resolveTrustedRedirectUri = resolveTrustedRedirectUri;
exports.authorizeRedirectOnError = authorizeRedirectOnError;
exports.authorizeEndpoint = authorizeEndpoint;
var fetch_metadata_1 = require("@better-auth/core/utils/fetch-metadata");
var host_1 = require("@better-auth/core/utils/host");
var redirect_uri_1 = require("@better-auth/core/utils/redirect-uri");
var url_1 = require("@better-auth/core/utils/url");
var api_1 = require("better-auth/api");
var crypto_1 = require("better-auth/crypto");
var better_call_1 = require("better-call");
var authentication_context_1 = require("./authentication-context");
var claims_request_1 = require("./claims-request");
var oauth_1 = require("./oauth");
var oauth_endpoint_1 = require("./oauth-endpoint");
var resources_1 = require("./resources");
var signed_query_1 = require("./signed-query");
var standard_claims_1 = require("./standard-claims");
var zod_1 = require("./types/zod");
var utils_1 = require("./utils");
/**
 * Whether a past authentication is still fresh enough for an OIDC `max_age`
 * request: true when no more than `maxAge` seconds have elapsed since the user
 * last authenticated. The caller supplies `now`, keeping this pure.
 */
function isWithinMaxAge(sessionCreatedAt, maxAgeSeconds, now) {
    if (maxAgeSeconds === 0)
        return false;
    return now.getTime() - sessionCreatedAt.getTime() <= maxAgeSeconds * 1000;
}
function removeMaxAgeFromAuthorizationQuery(query) {
    var _maxAge = query.max_age, queryWithoutMaxAge = __rest(query, ["max_age"]);
    return queryWithoutMaxAge;
}
/**
 * Formats an error url. Per OIDC Core 1.0 §5 / RFC 6749 §4.2.2.1, errors on
 * implicit and hybrid flows are delivered in the URL fragment, not the query.
 * Callers on the code flow (default) omit `mode` and get query delivery.
 */
function formatErrorURL(url, error, description, state, iss, mode) {
    if (mode === void 0) { mode = "query"; }
    var searchParams = new URLSearchParams({
        error: error,
        error_description: description,
    });
    state && searchParams.append("state", state);
    iss && searchParams.append("iss", iss);
    if (mode === "fragment") {
        return "".concat(url, "#").concat(searchParams.toString());
    }
    return (0, url_1.appendQueryParams)(url, searchParams);
}
/**
 * Selects the response mode for an error redirect to the RP. OIDC Core 1.0 §5
 * defines defaults based on response_type: `code` → query, types containing
 * `token` / `id_token` → fragment. An explicit `response_mode` overrides.
 *
 * When `response_type` is duplicated (array) or absent, we can't trust the
 * caller's intent, so we default to query — the safer channel for
 * unrecognized shapes.
 */
function deriveResponseMode(raw) {
    var responseMode = typeof raw.response_mode === "string" ? raw.response_mode : undefined;
    if (responseMode === "fragment")
        return "fragment";
    if (responseMode === "query")
        return "query";
    var responseType = typeof raw.response_type === "string" ? raw.response_type : undefined;
    if (responseType && /\b(token|id_token)\b/.test(responseType)) {
        return "fragment";
    }
    return "query";
}
var authorizationQueryErrorCodesByField = {
    response_type: { invalid: "unsupported_response_type" },
    resource: { invalid: "invalid_target" },
};
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function getStringParameter(value) {
    return typeof value === "string" ? value : undefined;
}
function getAuthorizationRequestParameters(ctx, settings) {
    var source = ctx.method === "POST" && (settings === null || settings === void 0 ? void 0 : settings.isAuthorize) === true
        ? ctx.body
        : ctx.query;
    var parameters = isRecord(source) ? source : {};
    return __assign({}, parameters);
}
var handleRedirect = function (ctx, uri) {
    var _a, _b, _c;
    var fromFetch = (0, fetch_metadata_1.isBrowserFetchRequest)((_a = ctx.request) === null || _a === void 0 ? void 0 : _a.headers);
    var acceptJson = (_c = (_b = ctx.headers) === null || _b === void 0 ? void 0 : _b.get("accept")) === null || _c === void 0 ? void 0 : _c.includes("application/json");
    if (fromFetch || acceptJson) {
        return {
            redirect: true,
            url: uri.toString(),
        };
    }
    else {
        throw ctx.redirect(uri);
    }
};
exports.handleRedirect = handleRedirect;
function redirectWithPromptNoneError(ctx, opts, query, error, description) {
    return (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, error, description, query.state, getIssuer(ctx, opts)));
}
/**
 * Normalizes the issuer URL by removing query and fragment components, which
 * RFC 8414 §2 forbids. The scheme is kept as configured: the issuer must match
 * the `iss` claim of issued tokens exactly (RFC 9207 §2.4).
 *
 * @returns The issuer URL without query, fragment, or trailing slash
 */
function validateIssuerUrl(issuer) {
    try {
        var url = new URL(issuer);
        url.search = "";
        url.hash = "";
        return url.toString().replace(/\/$/, "");
    }
    catch (_a) {
        // If URL parsing fails, return as-is
        return issuer;
    }
}
/**
 * Gets the issuer identifier
 */
function getIssuer(ctx, opts) {
    var _a, _b;
    var issuer;
    if (opts.disableJwtPlugin) {
        issuer = ctx.context.baseURL;
    }
    else {
        try {
            var jwtPluginOptions = (0, utils_1.getJwtPlugin)(ctx.context).options;
            issuer = (_b = (_a = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _a === void 0 ? void 0 : _a.issuer) !== null && _b !== void 0 ? _b : ctx.context.baseURL;
        }
        catch (_c) {
            issuer = ctx.context.baseURL;
        }
    }
    return validateIssuerUrl(issuer);
}
/**
 * Error page url if redirect_uri has not been verified yet
 * Generates Url for custom error page
 */
function getErrorURL(ctx, error, description) {
    var _a;
    var baseURL = ((_a = ctx.context.options.onAPIError) === null || _a === void 0 ? void 0 : _a.errorURL) || "".concat(ctx.context.baseURL, "/error");
    var formattedURL = formatErrorURL(baseURL, error, description);
    return formattedURL;
}
/**
 * Based on the loopback port matching approach in node-oidc-provider.
 *
 * @see https://github.com/panva/node-oidc-provider/blob/ea1456f987de7750b6af8a89a1881e70c70827fe/lib/models/client.js#L36-L76
 */
function stripLoopbackRedirectPort(uri) {
    var parsed;
    try {
        parsed = new URL(uri);
    }
    catch (_a) {
        return undefined;
    }
    var isLoopback = (0, host_1.isLoopbackIP)(parsed.hostname) || parsed.hostname === "localhost";
    if (parsed.protocol !== "http:" || !isLoopback) {
        return undefined;
    }
    var schemeSeparatorIndex = uri.indexOf("://");
    if (schemeSeparatorIndex < 0)
        return undefined;
    var authorityStart = schemeSeparatorIndex + 3;
    var authorityEndOffset = uri.slice(authorityStart).search(/[/?#]/u);
    var authorityEnd = uri.length;
    if (authorityEndOffset >= 0) {
        authorityEnd = authorityStart + authorityEndOffset;
    }
    var authority = uri.slice(authorityStart, authorityEnd);
    var portStart;
    if (authority.startsWith("[")) {
        var closingBracket = authority.indexOf("]");
        if (closingBracket < 0)
            return undefined;
        if (authority[closingBracket + 1] !== ":")
            return uri;
        portStart = closingBracket + 1;
    }
    else {
        portStart = authority.lastIndexOf(":");
        if (portStart < 0)
            return uri;
    }
    var port = authority.slice(portStart + 1);
    if (!/^\d*$/u.test(port)) {
        return undefined;
    }
    var portStartInUri = authorityStart + portStart;
    return "".concat(uri.slice(0, portStartInUri)).concat(uri.slice(authorityEnd));
}
/**
 * Finds the matching entry in a client's registered redirect URIs.
 *
 * For clients that are not `web`, registration limits loopback redirects to
 * native-compatible HTTP forms. Within that boundary, only the port may vary;
 * every other character must match the registered URI. Web clients, which
 * reach loopback only through `allowInsecureRedirectUri`, must match exactly.
 *
 * @see https://www.rfc-editor.org/rfc/rfc9700.html#section-4.1.3
 * @see https://www.rfc-editor.org/rfc/rfc8252.html#section-8.3
 */
function findRegisteredRedirectUri(registered, requested, isWebClient) {
    if (!registered || !requested)
        return undefined;
    var requestedUrl;
    try {
        requestedUrl = new URL(requested);
    }
    catch (_a) {
        return undefined;
    }
    /**
     * A trailing `#` yields an empty `URL.hash` but still defines a fragment.
     */
    var hasFragment = requested.includes("#");
    var hasUserinfo = requestedUrl.username.length > 0 || requestedUrl.password.length > 0;
    if (hasFragment || hasUserinfo) {
        return undefined;
    }
    var requestedWithoutPort = isWebClient
        ? undefined
        : stripLoopbackRedirectPort(requested);
    return registered.find(function (url) {
        if (url === requested)
            return true;
        if (!requestedWithoutPort)
            return false;
        return stripLoopbackRedirectPort(url) === requestedWithoutPort;
    });
}
/**
 * Keep URI syntax and credential checks outside the custom trust decision.
 * Callers apply the HTTPS policy first.
 */
function isSafeCustomRedirectUri(uri) {
    if (!zod_1.RedirectUriSyntaxSchema.safeParse(uri).success)
        return false;
    var parsed = new URL(uri);
    return parsed.username.length === 0 && parsed.password.length === 0;
}
/**
 * Loads the client, verifies it's enabled, and returns the requested
 * redirect_uri when it matches a registered entry (or is accepted by the
 * custom `validateRedirectUri` option, mirroring the authorize endpoint's
 * validation). Returns null whenever the RP cannot be safely reached, so
 * callers can fall back to the server error page (avoiding open-redirect
 * risk on validation failures).
 */
function resolveTrustedRedirectUri(ctx, opts, clientId, redirectUri) {
    return __awaiter(this, void 0, void 0, function () {
        var client, _a, isWebClient, registeredUris, matched, isValid, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!clientId || !redirectUri)
                        return [2 /*return*/, null];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, clientId)];
                case 2:
                    client = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _d.sent();
                    return [2 /*return*/, null];
                case 4:
                    if (!client || client.disabled)
                        return [2 /*return*/, null];
                    isWebClient = client.applicationType === "web";
                    if (!(0, utils_1.isRedirectUriTransportAllowed)(opts, redirectUri, isWebClient)) {
                        return [2 /*return*/, null];
                    }
                    registeredUris = (_c = client.redirectUris) !== null && _c !== void 0 ? _c : [];
                    matched = findRegisteredRedirectUri(registeredUris, redirectUri, isWebClient);
                    if (!opts.validateRedirectUri) return [3 /*break*/, 8];
                    if (!isSafeCustomRedirectUri(redirectUri))
                        return [2 /*return*/, null];
                    _d.label = 5;
                case 5:
                    _d.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, opts.validateRedirectUri(redirectUri, registeredUris, Boolean(matched))];
                case 6:
                    isValid = _d.sent();
                    return [2 /*return*/, isValid ? redirectUri : null];
                case 7:
                    _b = _d.sent();
                    return [2 /*return*/, null];
                case 8: return [2 /*return*/, matched ? redirectUri : null];
            }
        });
    });
}
/**
 * `redirectOnError` callback for `/oauth2/authorize`. Per RFC 6749 §4.1.2.1,
 * authorize errors MUST be delivered to the client's `redirect_uri` with
 * `error`, `error_description`, `state`, and (RFC 9207) `iss`. The clause
 * carves out one case: a missing/invalid `redirect_uri` or `client_id` MUST
 * NOT redirect to the requested URI. We implement the carve-out via
 * `resolveTrustedRedirectUri`, falling back to the server error page.
 *
 * Channel (query vs fragment) follows OIDC Core §5 via `deriveResponseMode`.
 */
function authorizeRedirectOnError(opts) {
    var _this = this;
    return function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var raw, clientId, redirectUriRaw, trusted;
        var _c;
        var error = _b.error, error_description = _b.error_description, ctx = _b.ctx;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    raw = ((_c = ctx.query) !== null && _c !== void 0 ? _c : {});
                    clientId = typeof raw.client_id === "string" ? raw.client_id : undefined;
                    redirectUriRaw = typeof raw.redirect_uri === "string" ? raw.redirect_uri : undefined;
                    return [4 /*yield*/, resolveTrustedRedirectUri(ctx, opts, clientId, redirectUriRaw)];
                case 1:
                    trusted = _d.sent();
                    if (trusted) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(trusted, error, error_description, typeof raw.state === "string" ? raw.state : undefined, getIssuer(ctx, opts), deriveResponseMode(raw)))];
                    }
                    return [2 /*return*/, (0, exports.handleRedirect)(ctx, getErrorURL(ctx, error, error_description))];
            }
        });
    }); };
}
function authorizeEndpoint(ctx, opts, settings) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, query, requestObject, requestUri, clientId, resolvedParams, urlClientId, parsedQuery, mappedError, promptSet, promptNone, client, registeredUris, isWebClient, isValidRedirectUri, defaultResult, _a, requestedScopes, validScopes_1, invalidScopes, openidRequested, requestedUserInfoClaims, err_1, error, description, pkceRequired, codeChallengesSupported, requestedResources, session, maxAgeSeconds, hasSatisfiedMaxAge, staleForMaxAge, selectedAccountRedirect, signupRedirect, postLoginRedirect, referenceId, consent, consentedResources;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    // Grant type must include authorization_code to use this endpoint
                    if (opts.grantTypes && !opts.grantTypes.includes("authorization_code")) {
                        throw new better_call_1.APIError("NOT_FOUND");
                    }
                    headers = (_c = (_b = ctx.request) === null || _b === void 0 ? void 0 : _b.headers) !== null && _c !== void 0 ? _c : ctx.headers;
                    if (!headers) {
                        throw new better_call_1.APIError("UNAUTHORIZED", {
                            error_description: "request not found",
                            error: "invalid_request",
                        });
                    }
                    query = getAuthorizationRequestParameters(ctx, settings);
                    ctx.query = query;
                    requestObject = getStringParameter(query.request);
                    requestUri = getStringParameter(query.request_uri);
                    if (requestObject !== undefined && requestUri !== undefined) {
                        return [2 /*return*/, authorizeRedirectOnError(opts)({
                                error: "invalid_request",
                                error_description: "request and request_uri cannot be used together",
                                ctx: ctx,
                            })];
                    }
                    if (requestObject !== undefined) {
                        return [2 /*return*/, authorizeRedirectOnError(opts)({
                                error: "request_not_supported",
                                error_description: "request object not supported",
                                ctx: ctx,
                            })];
                    }
                    if (!(requestUri !== undefined)) return [3 /*break*/, 2];
                    clientId = getStringParameter(query.client_id);
                    if (!clientId) {
                        return [2 /*return*/, authorizeRedirectOnError(opts)({
                                error: "invalid_request",
                                error_description: "client_id is required",
                                ctx: ctx,
                            })];
                    }
                    if (!opts.requestUriResolver) {
                        return [2 /*return*/, authorizeRedirectOnError(opts)({
                                error: "request_uri_not_supported",
                                error_description: "request_uri not supported",
                                ctx: ctx,
                            })];
                    }
                    return [4 /*yield*/, opts.requestUriResolver({
                            requestUri: requestUri,
                            clientId: clientId,
                            ctx: ctx,
                        })];
                case 1:
                    resolvedParams = _w.sent();
                    if (!resolvedParams) {
                        return [2 /*return*/, authorizeRedirectOnError(opts)({
                                error: "invalid_request_uri",
                                error_description: "request_uri is invalid or expired",
                                ctx: ctx,
                            })];
                    }
                    urlClientId = query.client_id;
                    query = resolvedParams;
                    if (urlClientId) {
                        query.client_id = urlClientId;
                    }
                    _w.label = 2;
                case 2:
                    ctx.query = query;
                    parsedQuery = zod_1.authorizationQuerySchema.safeParse(query);
                    if (!parsedQuery.success) {
                        mappedError = (0, oauth_endpoint_1.mapIssuesToOAuthError)(parsedQuery.error.issues, authorizationQueryErrorCodesByField);
                        return [2 /*return*/, authorizeRedirectOnError(opts)(__assign(__assign({}, mappedError), { ctx: ctx }))];
                    }
                    query = parsedQuery.data;
                    ctx.query = query;
                    return [4 /*yield*/, oauth_1.oAuthState.set({
                            query: serializeAuthorizationQuery(query).toString(),
                        })];
                case 3:
                    _w.sent();
                    if (!query.response_type) {
                        return [2 /*return*/, authorizeRedirectOnError(opts)({
                                error: "invalid_request",
                                error_description: "response_type is required",
                                ctx: ctx,
                            })];
                    }
                    promptSet = ((_d = ctx.query) === null || _d === void 0 ? void 0 : _d.prompt)
                        ? (0, utils_1.parsePrompt)((_e = ctx.query) === null || _e === void 0 ? void 0 : _e.prompt)
                        : undefined;
                    promptNone = (_f = promptSet === null || promptSet === void 0 ? void 0 : promptSet.has("none")) !== null && _f !== void 0 ? _f : false;
                    if ((promptSet === null || promptSet === void 0 ? void 0 : promptSet.has("select_account")) && !((_g = opts.selectAccount) === null || _g === void 0 ? void 0 : _g.page)) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, getErrorURL(ctx, "unsupported_prompt_select_account", "unsupported prompt type"))];
                    }
                    if (!(query.response_type === "code")) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, getErrorURL(ctx, "unsupported_response_type", "unsupported response type"))];
                    }
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, query.client_id)];
                case 4:
                    client = _w.sent();
                    if (!client) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, getErrorURL(ctx, "invalid_client", "client not found"))];
                    }
                    if (client.disabled) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, getErrorURL(ctx, "client_disabled", "client is disabled"))];
                    }
                    // The authorize endpoint only serves the authorization_code grant; reject
                    // clients that are not registered for it.
                    if (!(0, utils_1.clientAllowsGrant)(client, "authorization_code")) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, getErrorURL(ctx, "unauthorized_client", "client is not authorized to use the authorization_code grant"))];
                    }
                    registeredUris = (_h = client.redirectUris) !== null && _h !== void 0 ? _h : [];
                    isWebClient = client.applicationType === "web";
                    isValidRedirectUri = false;
                    if (!query.redirect_uri) return [3 /*break*/, 10];
                    if (!(0, utils_1.isRedirectUriTransportAllowed)(opts, query.redirect_uri, isWebClient)) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, getErrorURL(ctx, "invalid_request", redirect_uri_1.INSECURE_REDIRECT_URI_MESSAGE))];
                    }
                    defaultResult = Boolean(findRegisteredRedirectUri(registeredUris, query.redirect_uri, isWebClient));
                    if (!(opts.validateRedirectUri &&
                        isSafeCustomRedirectUri(query.redirect_uri))) return [3 /*break*/, 9];
                    _w.label = 5;
                case 5:
                    _w.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, opts.validateRedirectUri(query.redirect_uri, registeredUris, defaultResult)];
                case 6:
                    // Custom validator receives defaultResult for composition
                    isValidRedirectUri = _w.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a = _w.sent();
                    // Fail closed: a throwing validator rejects the request
                    isValidRedirectUri = false;
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    if (!opts.validateRedirectUri) {
                        isValidRedirectUri = defaultResult;
                    }
                    _w.label = 10;
                case 10:
                    if (!isValidRedirectUri) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, getErrorURL(ctx, "invalid_redirect", "invalid redirect uri"))];
                    }
                    requestedScopes = (_j = query.scope) === null || _j === void 0 ? void 0 : _j.split(" ").filter(function (s) { return s; });
                    if (requestedScopes) {
                        validScopes_1 = new Set((_k = client.scopes) !== null && _k !== void 0 ? _k : opts.scopes);
                        invalidScopes = requestedScopes.filter(function (scope) {
                            return !(validScopes_1 === null || validScopes_1 === void 0 ? void 0 : validScopes_1.has(scope));
                        });
                        if (invalidScopes.length) {
                            return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, "invalid_scope", "The following scopes are invalid: ".concat(invalidScopes.join(", ")), query.state, getIssuer(ctx, opts)))];
                        }
                    }
                    // Always set default scopes if not originally sent
                    if (!requestedScopes) {
                        requestedScopes = (_m = (_l = client.scopes) !== null && _l !== void 0 ? _l : opts.scopes) !== null && _m !== void 0 ? _m : [];
                        query.scope = requestedScopes.join(" ");
                    }
                    openidRequested = requestedScopes.includes("openid");
                    if (query.claims !== undefined && !openidRequested) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, "invalid_request", "openid scope must be requested when using the claims parameter", query.state, getIssuer(ctx, opts)))];
                    }
                    if (openidRequested && !(0, claims_request_1.isValidOidcClaimsRequest)(query.claims)) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, "invalid_request", "claims must be a valid Claims request object", query.state, getIssuer(ctx, opts)))];
                    }
                    if (openidRequested &&
                        !(0, claims_request_1.canSatisfyEssentialAcrRequest)(query.claims, authentication_context_1.LEVEL_0_ACR)) {
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, "access_denied", "essential acr requirement cannot be met", query.state, getIssuer(ctx, opts)))];
                    }
                    requestedUserInfoClaims = (0, claims_request_1.getRequestedUserInfoClaims)(query.claims, (0, standard_claims_1.getSupportedClaims)(opts));
                    if (!(query.resource !== undefined)) return [3 /*break*/, 14];
                    _w.label = 11;
                case 11:
                    _w.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(ctx, opts, {
                            resource: query.resource,
                            clientId: client.clientId,
                            requestedScopes: requestedScopes,
                        })];
                case 12:
                    _w.sent();
                    return [3 /*break*/, 14];
                case 13:
                    err_1 = _w.sent();
                    if (err_1 instanceof better_call_1.APIError) {
                        error = (_p = (_o = err_1.body) === null || _o === void 0 ? void 0 : _o.error) !== null && _p !== void 0 ? _p : "invalid_target";
                        description = (_r = (_q = err_1.body) === null || _q === void 0 ? void 0 : _q.error_description) !== null && _r !== void 0 ? _r : "requested resource invalid";
                        return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, error, description, query.state, getIssuer(ctx, opts)))];
                    }
                    throw err_1;
                case 14:
                    pkceRequired = (0, utils_1.isPKCERequired)(client, {
                        scopes: requestedScopes,
                        nonce: query.nonce,
                    });
                    // Validate PKCE parameters if required
                    if (pkceRequired) {
                        if (!query.code_challenge || !query.code_challenge_method) {
                            return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, "invalid_request", pkceRequired.valueOf(), query.state, getIssuer(ctx, opts)))];
                        }
                    }
                    // If PKCE parameters are provided, validate them (even if not required)
                    if (query.code_challenge || query.code_challenge_method) {
                        // Both parameters must be provided together
                        if (!query.code_challenge || !query.code_challenge_method) {
                            return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, "invalid_request", "code_challenge and code_challenge_method must both be provided", query.state, getIssuer(ctx, opts)))];
                        }
                        codeChallengesSupported = ["S256"];
                        if (!codeChallengesSupported.includes(query.code_challenge_method)) {
                            return [2 /*return*/, (0, exports.handleRedirect)(ctx, formatErrorURL(query.redirect_uri, "invalid_request", "invalid code_challenge method, only S256 is supported", query.state, getIssuer(ctx, opts)))];
                        }
                    }
                    requestedResources = (_s = (0, utils_1.toResourceList)(query.resource)) !== null && _s !== void 0 ? _s : [];
                    return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 15:
                    session = _w.sent();
                    maxAgeSeconds = query.max_age;
                    hasSatisfiedMaxAge = session != null &&
                        maxAgeSeconds !== undefined &&
                        isWithinMaxAge(new Date(session.session.createdAt), maxAgeSeconds, new Date());
                    staleForMaxAge = session != null && maxAgeSeconds !== undefined && !hasSatisfiedMaxAge;
                    if (!session ||
                        staleForMaxAge ||
                        (promptSet === null || promptSet === void 0 ? void 0 : promptSet.has("login")) ||
                        (promptSet === null || promptSet === void 0 ? void 0 : promptSet.has("create"))) {
                        if (promptNone) {
                            return [2 /*return*/, redirectWithPromptNoneError(ctx, opts, query, "login_required", "authentication required")];
                        }
                        return [2 /*return*/, redirectWithPromptCode(ctx, opts, (promptSet === null || promptSet === void 0 ? void 0 : promptSet.has("create")) ? "create" : "login")];
                    }
                    if (hasSatisfiedMaxAge) {
                        query = removeMaxAgeFromAuthorizationQuery(query);
                        ctx.query = query;
                    }
                    // Force account selection (eg. multi-session)
                    if ((settings === null || settings === void 0 ? void 0 : settings.isAuthorize) && (promptSet === null || promptSet === void 0 ? void 0 : promptSet.has("select_account"))) {
                        return [2 /*return*/, redirectWithPromptCode(ctx, opts, "select_account")];
                    }
                    if (!
                    // Check if account needs selection (only for authorize endpoint)
                    ((settings === null || settings === void 0 ? void 0 : settings.isAuthorize) &&
                        opts.selectAccount)) 
                    // Check if account needs selection (only for authorize endpoint)
                    return [3 /*break*/, 17];
                    return [4 /*yield*/, opts.selectAccount.shouldRedirect({
                            headers: headers,
                            user: session.user,
                            session: session.session,
                            scopes: requestedScopes,
                        })];
                case 16:
                    selectedAccountRedirect = _w.sent();
                    if (selectedAccountRedirect) {
                        if (promptNone) {
                            return [2 /*return*/, redirectWithPromptNoneError(ctx, opts, query, "account_selection_required", "End-User account selection is required")];
                        }
                        return [2 /*return*/, redirectWithPromptCode(ctx, opts, "select_account")];
                    }
                    _w.label = 17;
                case 17:
                    if (!((_t = opts.signup) === null || _t === void 0 ? void 0 : _t.shouldRedirect)) return [3 /*break*/, 19];
                    return [4 /*yield*/, opts.signup.shouldRedirect({
                            headers: headers,
                            user: session.user,
                            session: session.session,
                            scopes: requestedScopes,
                        })];
                case 18:
                    signupRedirect = _w.sent();
                    if (signupRedirect) {
                        if (promptNone) {
                            return [2 /*return*/, redirectWithPromptNoneError(ctx, opts, query, "interaction_required", "End-User interaction is required")];
                        }
                        return [2 /*return*/, redirectWithPromptCode(ctx, opts, "create", {
                                page: typeof signupRedirect === "string" ? signupRedirect : undefined,
                            })];
                    }
                    _w.label = 19;
                case 19:
                    if (!(!(settings === null || settings === void 0 ? void 0 : settings.postLogin) && opts.postLogin)) return [3 /*break*/, 21];
                    return [4 /*yield*/, opts.postLogin.shouldRedirect({
                            headers: headers,
                            user: session.user,
                            session: session.session,
                            scopes: requestedScopes,
                            isContinuation: (_u = settings === null || settings === void 0 ? void 0 : settings.isPostLoginContinuation) !== null && _u !== void 0 ? _u : false,
                        })];
                case 20:
                    postLoginRedirect = _w.sent();
                    if (postLoginRedirect) {
                        if (promptNone) {
                            return [2 /*return*/, redirectWithPromptNoneError(ctx, opts, query, "interaction_required", "End-User interaction is required")];
                        }
                        return [2 /*return*/, redirectWithPromptCode(ctx, opts, "post_login")];
                    }
                    _w.label = 21;
                case 21:
                    // Force consent screen
                    if (promptSet === null || promptSet === void 0 ? void 0 : promptSet.has("consent")) {
                        return [2 /*return*/, redirectWithPromptCode(ctx, opts, "consent", {
                                sessionId: session.session.id,
                            })];
                    }
                    return [4 /*yield*/, (0, utils_1.getConsentReferenceId)(opts, {
                            user: session.user,
                            session: session.session,
                            scopes: requestedScopes,
                        })];
                case 22:
                    referenceId = _w.sent();
                    // Can skip consent (unless forced by prompt above)
                    if (client.skipConsent) {
                        return [2 /*return*/, redirectWithAuthorizationCode(ctx, opts, {
                                query: query,
                                clientId: client.clientId,
                                userId: session.user.id,
                                sessionId: session.session.id,
                                authTime: new Date(session.session.createdAt).getTime(),
                                referenceId: referenceId,
                                resource: requestedResources,
                            })];
                    }
                    return [4 /*yield*/, (0, utils_1.findConsent)(ctx, client.clientId, session.user.id, referenceId)];
                case 23:
                    consent = _w.sent();
                    if (!consent ||
                        !requestedScopes.every(function (val) { return consent.scopes.includes(val); }) ||
                        !requestedUserInfoClaims.every(function (claim) { var _a; return ((_a = consent.requestedUserInfoClaims) !== null && _a !== void 0 ? _a : []).includes(claim); })) {
                        if (promptNone) {
                            return [2 /*return*/, redirectWithPromptNoneError(ctx, opts, query, "consent_required", "End-User consent is required")];
                        }
                        return [2 /*return*/, redirectWithPromptCode(ctx, opts, "consent", {
                                sessionId: session.session.id,
                            })];
                    }
                    consentedResources = (_v = consent === null || consent === void 0 ? void 0 : consent.resources) !== null && _v !== void 0 ? _v : [];
                    if (requestedResources.some(function (requestedResource) { return !consentedResources.includes(requestedResource); })) {
                        if (promptNone) {
                            return [2 /*return*/, redirectWithPromptNoneError(ctx, opts, query, "consent_required", "End-User consent is required")];
                        }
                        return [2 /*return*/, redirectWithPromptCode(ctx, opts, "consent", {
                                sessionId: session.session.id,
                            })];
                    }
                    return [2 /*return*/, redirectWithAuthorizationCode(ctx, opts, {
                            query: query,
                            clientId: client.clientId,
                            userId: session.user.id,
                            sessionId: session.session.id,
                            authTime: new Date(session.session.createdAt).getTime(),
                            referenceId: referenceId,
                            resource: requestedResources,
                        })];
            }
        });
    });
}
function serializeAuthorizationQuery(query) {
    var params = new URLSearchParams();
    for (var _i = 0, _a = Object.entries(query); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value == null)
            continue;
        if (Array.isArray(value)) {
            for (var _c = 0, value_1 = value; _c < value_1.length; _c++) {
                var v = value_1[_c];
                params.append(key, String(v));
            }
        }
        else if (key === "claims" && typeof value === "object") {
            params.set(key, JSON.stringify(value));
        }
        else {
            params.set(key, String(value));
        }
    }
    return params;
}
function redirectWithAuthorizationCode(ctx, opts, verificationValue) {
    return __awaiter(this, void 0, void 0, function () {
        var code, iat, exp, data, redirectUriWithCode;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    code = (0, crypto_1.generateRandomString)(32, "a-z", "A-Z", "0-9");
                    iat = Math.floor(Date.now() / 1000);
                    exp = iat + ((_b = opts.codeExpiresIn) !== null && _b !== void 0 ? _b : 600);
                    _a = {};
                    return [4 /*yield*/, (0, utils_1.storeToken)(opts.storeTokens, code, "authorization_code")];
                case 1:
                    data = (_a.identifier = _c.sent(),
                        _a.updatedAt = new Date(iat * 1000),
                        _a.expiresAt = new Date(exp * 1000),
                        _a.value = JSON.stringify({
                            type: "authorization_code",
                            query: verificationValue.query,
                            userId: verificationValue.userId,
                            sessionId: verificationValue === null || verificationValue === void 0 ? void 0 : verificationValue.sessionId,
                            referenceId: verificationValue.referenceId,
                            authTime: verificationValue.authTime,
                            resource: verificationValue.resource,
                        }),
                        _a);
                    return [4 /*yield*/, ctx.context.internalAdapter.createVerificationValue(__assign(__assign({}, data), { createdAt: new Date(iat * 1000) }))];
                case 2:
                    _c.sent();
                    redirectUriWithCode = new URL(verificationValue.query.redirect_uri);
                    redirectUriWithCode.searchParams.set("code", code);
                    if (verificationValue.query.state) {
                        redirectUriWithCode.searchParams.set("state", verificationValue.query.state);
                    }
                    redirectUriWithCode.searchParams.set("iss", getIssuer(ctx, opts));
                    return [2 /*return*/, (0, exports.handleRedirect)(ctx, redirectUriWithCode.toString())];
            }
        });
    });
}
function redirectWithPromptCode(ctx, opts, type, options) {
    return __awaiter(this, void 0, void 0, function () {
        var queryParams, path;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, signParams(ctx, opts, {
                        postLoginClearedForSession: type === "consent" && opts.postLogin ? options === null || options === void 0 ? void 0 : options.sessionId : undefined,
                    })];
                case 1:
                    queryParams = _h.sent();
                    path = opts.loginPage;
                    if (type === "select_account") {
                        path = (_b = (_a = opts.selectAccount) === null || _a === void 0 ? void 0 : _a.page) !== null && _b !== void 0 ? _b : opts.loginPage;
                    }
                    else if (type === "post_login") {
                        if (!((_c = opts.postLogin) === null || _c === void 0 ? void 0 : _c.page))
                            throw new better_call_1.APIError("INTERNAL_SERVER_ERROR", {
                                error_description: "postLogin should have been defined",
                            });
                        path = (_d = opts.postLogin) === null || _d === void 0 ? void 0 : _d.page;
                    }
                    else if (type === "consent") {
                        path = opts.consentPage;
                    }
                    else if (type === "create") {
                        path = (_f = (_e = opts.signup) === null || _e === void 0 ? void 0 : _e.page) !== null && _f !== void 0 ? _f : opts.loginPage;
                    }
                    return [2 /*return*/, (0, exports.handleRedirect)(ctx, "".concat((_g = options === null || options === void 0 ? void 0 : options.page) !== null && _g !== void 0 ? _g : path, "?").concat(queryParams))];
            }
        });
    });
}
function signParams(ctx, opts, flags) {
    return __awaiter(this, void 0, void 0, function () {
        var issuedAt, iat, exp, params, signature;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    issuedAt = Date.now();
                    iat = Math.floor(issuedAt / 1000);
                    exp = iat + ((_a = opts.codeExpiresIn) !== null && _a !== void 0 ? _a : 600);
                    params = serializeAuthorizationQuery(ctx.query);
                    params.set("exp", String(exp));
                    params.set(signed_query_1.signedQueryIssuedAtParam, String(issuedAt));
                    params.delete("sig");
                    // Reserved marker: only server-issued consent redirects may sign this.
                    params.delete(signed_query_1.postLoginClearedParam);
                    if (flags === null || flags === void 0 ? void 0 : flags.postLoginClearedForSession) {
                        params.set(signed_query_1.postLoginClearedParam, flags.postLoginClearedForSession);
                    }
                    (0, signed_query_1.setSignedOAuthQueryParameterNames)(params);
                    return [4 /*yield*/, (0, crypto_1.makeSignature)((0, signed_query_1.canonicalizeOAuthQueryParams)(params).toString(), ctx.context.secret)];
                case 1:
                    signature = _b.sent();
                    params.set("sig", signature);
                    return [2 /*return*/, params.toString()];
            }
        });
    });
}
