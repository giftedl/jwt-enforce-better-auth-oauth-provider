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
exports.registerEndpoint = registerEndpoint;
exports.checkOAuthClient = checkOAuthClient;
exports.registerClientMetadataDocument = registerClientMetadataDocument;
exports.createOAuthClientEndpoint = createOAuthClientEndpoint;
exports.oauthToSchema = oauthToSchema;
exports.schemaToOAuth = schemaToOAuth;
var context_1 = require("@better-auth/core/context");
var host_1 = require("@better-auth/core/utils/host");
var redirect_uri_1 = require("@better-auth/core/utils/redirect-uri");
var api_1 = require("better-auth/api");
var crypto_1 = require("better-auth/crypto");
var plugins_1 = require("better-auth/plugins");
var client_jwks_1 = require("./client-jwks");
var client_metadata_1 = require("./client-metadata");
var extensions_1 = require("./extensions");
var client_credentials_1 = require("./oauthClient/client-credentials");
var privileges_1 = require("./oauthClient/privileges");
var privileges_2 = require("./oauthResource/privileges");
var resources_1 = require("./resources");
var utils_1 = require("./utils");
var client_assertion_1 = require("./utils/client-assertion");
var initial_access_token_1 = require("./utils/initial-access-token");
var DEFAULT_REGISTRATION_GRANT_TYPES = [
    "authorization_code",
];
function resolveClientRegistrationScopes(opts) {
    var _a, _b, _c;
    return __spreadArray([], new Set(__spreadArray(__spreadArray([], ((_b = (_a = opts.clientRegistrationDefaultScopes) !== null && _a !== void 0 ? _a : opts.scopes) !== null && _b !== void 0 ? _b : []), true), ((_c = opts.clientRegistrationAllowedScopes) !== null && _c !== void 0 ? _c : []), true)), true);
}
function resolveRegistrationGrantTypes(client) {
    var _a;
    var grantTypes = (_a = client.grant_types) !== null && _a !== void 0 ? _a : __spreadArray([], DEFAULT_REGISTRATION_GRANT_TYPES, true);
    if (grantTypes.length > 0)
        return grantTypes;
    throw new api_1.APIError("BAD_REQUEST", {
        error: "invalid_client_metadata",
        error_description: "grant_types must contain at least one grant type",
    });
}
function resolveRegistrationResponseTypes(client, grantTypes) {
    if (client.response_types)
        return client.response_types;
    return grantTypes.includes("authorization_code") ? ["code"] : undefined;
}
/**
 * The requested grants this server supports. Clients such as MCP connectors
 * send one grant union to every server, so a metadata document or a dynamic
 * registration may list grants this server does not issue. Throws when the
 * request shares no grant with the server.
 */
function resolveMutuallySupportedGrantTypes(opts, grantTypes) {
    var supportedGrantTypes = new Set((0, extensions_1.getSupportedGrantTypes)(opts));
    var mutualGrantTypes = grantTypes.filter(function (grantType) {
        return supportedGrantTypes.has(grantType);
    });
    if (mutualGrantTypes.length === 0) {
        throw new api_1.APIError("BAD_REQUEST", {
            error: "invalid_client_metadata",
            error_description: "no mutually supported grant_type among ".concat(grantTypes.join(", ")),
        });
    }
    return mutualGrantTypes;
}
function applyOAuthClientRegistrationDefaults(client, defaultApplicationType) {
    var _a, _b;
    if (defaultApplicationType === void 0) { defaultApplicationType = "web"; }
    var grantTypes = resolveRegistrationGrantTypes(client);
    return __assign(__assign({}, client), { token_endpoint_auth_method: (_a = client.token_endpoint_auth_method) !== null && _a !== void 0 ? _a : "client_secret_basic", application_type: (_b = client.application_type) !== null && _b !== void 0 ? _b : (defaultApplicationType === null ? undefined : defaultApplicationType), grant_types: grantTypes, response_types: resolveRegistrationResponseTypes(client, grantTypes) });
}
function isCustomSchemeWithHost(redirectUri) {
    var url = new URL(redirectUri);
    return (url.protocol !== "http:" && url.protocol !== "https:" && url.host !== "");
}
function isNonHttpRedirectUri(redirectUri) {
    try {
        var protocol = new URL(redirectUri).protocol;
        return protocol !== "http:" && protocol !== "https:";
    }
    catch (_a) {
        return false;
    }
}
/**
 * Server-owned default for dynamic registrations that omit `application_type`.
 * `"infer"` classifies as native when any redirect URI uses a non-http(s)
 * scheme or http on an exact loopback host, because a web client can never
 * register either. Every URI is then validated against the native rules. A
 * sent `application_type` is never overridden because
 * `applyOAuthClientRegistrationDefaults` only fills the absent field.
 */
function resolveDynamicRegistrationDefaultApplicationType(opts, client) {
    var _a, _b;
    var configured = (_a = opts.clientRegistrationDefaultApplicationType) !== null && _a !== void 0 ? _a : "web";
    if (configured !== "infer")
        return configured;
    return ((_b = client.redirect_uris) !== null && _b !== void 0 ? _b : []).some(function (uri) { return isNonHttpRedirectUri(uri) || isExactLoopbackHttpRedirectUri(uri); })
        ? "native"
        : "web";
}
function invalidRedirectUri(description) {
    throw new api_1.APIError("BAD_REQUEST", {
        error: "invalid_redirect_uri",
        error_description: description,
    });
}
function getRawHttpHostname(redirectUri) {
    var _a, _b;
    var authority = (_a = /^http:\/\/([^/?#]*)/i.exec(redirectUri)) === null || _a === void 0 ? void 0 : _a[1];
    if (!authority)
        return null;
    var hostAndPort = authority.slice(authority.lastIndexOf("@") + 1);
    if (hostAndPort.startsWith("[")) {
        var bracketEnd = hostAndPort.indexOf("]");
        return bracketEnd < 0
            ? null
            : hostAndPort.slice(0, bracketEnd + 1).toLowerCase();
    }
    return ((_b = hostAndPort.split(":")[0]) !== null && _b !== void 0 ? _b : "").toLowerCase();
}
function isExactLoopbackHttpRedirectUri(redirectUri) {
    var hostname = getRawHttpHostname(redirectUri);
    return (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]");
}
function assertDynamicRegistrationResourcesAllowed(opts, requestedResources) {
    var _a, _b;
    var allowedResources = new Set(__spreadArray(__spreadArray([], ((_a = opts.clientRegistrationDefaultResources) !== null && _a !== void 0 ? _a : []), true), ((_b = opts.clientRegistrationAllowedResources) !== null && _b !== void 0 ? _b : []), true));
    for (var _i = 0, requestedResources_1 = requestedResources; _i < requestedResources_1.length; _i++) {
        var identifier = requestedResources_1[_i];
        if (!allowedResources.has(identifier)) {
            throw new api_1.APIError("BAD_REQUEST", {
                error: "invalid_target",
                error_description: "requested resource ".concat(identifier, " is not allowed for client registration"),
            });
        }
    }
}
function resolveClientRegistrationResources(ctx, opts, requestedResources) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultResources, resources, _i, resources_2, identifier, row;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    defaultResources = (_a = opts.clientRegistrationDefaultResources) !== null && _a !== void 0 ? _a : [];
                    resources = __spreadArray([], new Set(__spreadArray(__spreadArray([], defaultResources, true), requestedResources, true)), true);
                    _i = 0, resources_2 = resources;
                    _b.label = 1;
                case 1:
                    if (!(_i < resources_2.length)) return [3 /*break*/, 4];
                    identifier = resources_2[_i];
                    return [4 /*yield*/, (0, resources_1.getResource)(ctx, opts, identifier)];
                case 2:
                    row = _b.sent();
                    if (!row) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_target",
                            error_description: "requested resource ".concat(identifier, " does not exist"),
                        });
                    }
                    if (row.disabled) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_target",
                            error_description: "requested resource ".concat(identifier, " is disabled"),
                        });
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, resources];
            }
        });
    });
}
function validateClientRedirectUri(redirectUri, applicationType, opts) {
    var url;
    try {
        url = new URL(redirectUri);
    }
    catch (_a) {
        invalidRedirectUri("redirect URI must be an absolute URI: ".concat(redirectUri));
    }
    if (redirectUri.includes("#") ||
        url.username.length > 0 ||
        url.password.length > 0) {
        invalidRedirectUri("redirect URI must not include credentials or a fragment: ".concat(redirectUri));
    }
    var isHttp = url.protocol === "http:";
    var isHttps = url.protocol === "https:";
    if (/^localhost\.+$/i.test(url.hostname)) {
        invalidRedirectUri("redirect URI localhost must not include trailing dots: ".concat(redirectUri));
    }
    var isRedirectLoopback = (0, host_1.isLoopbackIP)(url.hostname) || url.hostname === "localhost";
    if (applicationType === "web") {
        if (isHttp && (0, utils_1.isInsecureRedirectUriAllowed)(opts, url))
            return;
        if (!isHttps || isRedirectLoopback) {
            invalidRedirectUri("web clients require https redirect URIs on non-loopback hosts: ".concat(redirectUri));
        }
        return;
    }
    if (isHttps) {
        if (isRedirectLoopback) {
            invalidRedirectUri("native clients must not use https loopback redirect URIs: ".concat(redirectUri));
        }
        return;
    }
    if (isHttp) {
        if (isExactLoopbackHttpRedirectUri(redirectUri))
            return;
        // Loopback hosts keep the exact-host rule; the callback covers other hosts.
        if (!(0, host_1.isLoopbackHost)(url.host) && (0, utils_1.isInsecureRedirectUriAllowed)(opts, url)) {
            return;
        }
        invalidRedirectUri("native clients may use http only on the exact loopback hosts localhost, 127.0.0.1, or [::1]: ".concat(redirectUri));
    }
    if (!(0, redirect_uri_1.isNativePrivateUseRedirectUri)(url)) {
        invalidRedirectUri("native private-use redirect URI schemes must not use a reserved scheme; they must be an authority-free reverse-domain URI or a custom-scheme URI with a host and a path: ".concat(redirectUri));
    }
}
function registerEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var body, session, tokenAuthorization, _a, isTokenAuthorized, grantTypes, droppedAuthorizationCode, metadata, requestedResources, referenceId, _b, _c, response;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    body = ctx.body;
                    if (!opts.allowDynamicClientRegistration) {
                        throw new api_1.APIError("FORBIDDEN", {
                            error: "access_denied",
                            error_description: "Client registration is disabled",
                        });
                    }
                    return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _h.sent();
                    if (!session) return [3 /*break*/, 2];
                    _a = undefined;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (0, initial_access_token_1.authorizeInitialAccessToken)(ctx, opts, body)];
                case 3:
                    _a = _h.sent();
                    _h.label = 4;
                case 4:
                    tokenAuthorization = _a;
                    isTokenAuthorized = Boolean(tokenAuthorization);
                    if (!(session ||
                        isTokenAuthorized ||
                        opts.allowUnauthenticatedClientRegistration)) {
                        // No session, no token, and open registration disabled. A presented but
                        // invalid token already threw above, so this is the no-credentials case:
                        // answer with a bare RFC 6750 §3.1 Bearer challenge and no error code.
                        throw new api_1.APIError("UNAUTHORIZED", {
                            error_description: "Authentication required for client registration",
                        }, __assign({ "WWW-Authenticate": "Bearer" }, api_1.NO_STORE_HEADERS));
                    }
                    grantTypes = ((_d = body.grant_types) === null || _d === void 0 ? void 0 : _d.length)
                        ? resolveMutuallySupportedGrantTypes(opts, body.grant_types)
                        : body.grant_types;
                    droppedAuthorizationCode = ((_e = body.grant_types) === null || _e === void 0 ? void 0 : _e.includes("authorization_code")) &&
                        !(grantTypes === null || grantTypes === void 0 ? void 0 : grantTypes.includes("authorization_code"));
                    metadata = __assign(__assign({}, body), { grant_types: grantTypes, 
                        // `code`, the only response type, goes with `authorization_code`; the
                        // defaults derive response_types from the registered grants instead.
                        response_types: droppedAuthorizationCode ? undefined : body.response_types });
                    if (!session && !isTokenAuthorized) {
                        if ((_f = metadata.grant_types) === null || _f === void 0 ? void 0 : _f.includes("client_credentials")) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error: "invalid_client_metadata",
                                error_description: "client_credentials grant requires authenticated registration",
                            });
                        }
                    }
                    requestedResources = Array.isArray(body.resources)
                        ? body.resources.filter(function (resource) {
                            return typeof resource === "string" && resource.length > 0;
                        })
                        : [];
                    if (!session) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "create")];
                case 5:
                    _h.sent();
                    _h.label = 6;
                case 6:
                    if (!((_g = tokenAuthorization === null || tokenAuthorization === void 0 ? void 0 : tokenAuthorization.referenceId) !== null && _g !== void 0)) return [3 /*break*/, 7];
                    _b = _g;
                    return [3 /*break*/, 11];
                case 7:
                    if (!(session && opts.clientReference)) return [3 /*break*/, 9];
                    return [4 /*yield*/, opts.clientReference({
                            user: session.user,
                            session: session.session,
                        })];
                case 8:
                    _c = _h.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _c = undefined;
                    _h.label = 10;
                case 10:
                    _b = (_c);
                    _h.label = 11;
                case 11:
                    referenceId = _b;
                    return [4 /*yield*/, createOAuthClientRegistration(ctx, opts, {
                            metadata: metadata,
                            registrationSource: "dynamic",
                            userId: referenceId ? undefined : session === null || session === void 0 ? void 0 : session.session.userId,
                            referenceId: referenceId,
                            requestedResources: requestedResources,
                        })];
                case 12:
                    response = _h.sent();
                    ctx.setStatus(201);
                    return [2 /*return*/, ctx.json(response)];
            }
        });
    });
}
function checkOAuthClient(client, opts, settings) {
    return __awaiter(this, void 0, void 0, function () {
        var isClientMetadataDocument, clientWithDefaults, tokenEndpointAuthMethod, supportedTokenEndpointAuthMethods, grantTypes, responseTypes, applicationType, _i, _a, uri, _b, _c, uri, url, supportedGrantTypes, _d, grantTypes_1, grantType, hosts, requestedScopes, validatesRegistrationMetadata, allowedScopes, validScopes, _e, _f, requestedScope, uri, clientId, isSameOriginClientMetadataDocumentKey, url;
        var _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            isClientMetadataDocument = (settings === null || settings === void 0 ? void 0 : settings.registrationSource) === "clientMetadataDocument";
            clientWithDefaults = applyOAuthClientRegistrationDefaults(client, isClientMetadataDocument
                ? null
                : (settings === null || settings === void 0 ? void 0 : settings.registrationSource) === "dynamic"
                    ? resolveDynamicRegistrationDefaultApplicationType(opts, client)
                    : "web");
            tokenEndpointAuthMethod = (_g = clientWithDefaults.token_endpoint_auth_method) !== null && _g !== void 0 ? _g : "client_secret_basic";
            supportedTokenEndpointAuthMethods = new Set((0, extensions_1.getSupportedAuthMethods)(opts, { includeNone: true }));
            if (!supportedTokenEndpointAuthMethods.has(tokenEndpointAuthMethod)) {
                throw new api_1.APIError("BAD_REQUEST", {
                    error: "invalid_client_metadata",
                    error_description: "unsupported token_endpoint_auth_method ".concat(tokenEndpointAuthMethod),
                });
            }
            if (clientWithDefaults.dpop_bound_access_tokens !== undefined &&
                typeof clientWithDefaults.dpop_bound_access_tokens !== "boolean") {
                throw new api_1.APIError("BAD_REQUEST", {
                    error: "invalid_client_metadata",
                    error_description: "dpop_bound_access_tokens must be a boolean",
                });
            }
            grantTypes = (_h = clientWithDefaults.grant_types) !== null && _h !== void 0 ? _h : [];
            responseTypes = clientWithDefaults.response_types;
            applicationType = clientWithDefaults.application_type;
            if (applicationType !== undefined &&
                applicationType !== "web" &&
                applicationType !== "native") {
                throw new api_1.APIError("BAD_REQUEST", {
                    error: "invalid_client_metadata",
                    error_description: "application_type must be web or native",
                });
            }
            // Validate redirect URIs for redirect-based flows
            if (grantTypes.includes("authorization_code") &&
                (!clientWithDefaults.redirect_uris ||
                    clientWithDefaults.redirect_uris.length === 0)) {
                throw new api_1.APIError("BAD_REQUEST", {
                    error: "invalid_redirect_uri",
                    error_description: "Redirect URIs are required for authorization_code and implicit grant types",
                });
            }
            for (_i = 0, _a = (_j = clientWithDefaults.redirect_uris) !== null && _j !== void 0 ? _j : []; _i < _a.length; _i++) {
                uri = _a[_i];
                // A CIMD document may omit application_type. Preserve that absence in
                // storage while validating against the safe union of web and native
                // redirect forms. The native validator is that union: non-loopback HTTPS,
                // exact loopback HTTP, an authority-free reverse-domain private-use
                // scheme, or a host-bearing non-reserved custom scheme.
                validateClientRedirectUri(uri, (_k = applicationType) !== null && _k !== void 0 ? _k : (isClientMetadataDocument ? "native" : "web"), opts);
            }
            for (_b = 0, _c = (_l = clientWithDefaults.post_logout_redirect_uris) !== null && _l !== void 0 ? _l : []; _b < _c.length; _b++) {
                uri = _c[_b];
                url = void 0;
                try {
                    url = new URL(uri);
                }
                catch (_q) { }
                if (!url || url.username || url.password) {
                    invalidRedirectUri("post-logout redirect URI must be an absolute URI without credentials: ".concat(uri));
                }
                if (!(0, utils_1.isRedirectUriTransportAllowed)(opts, uri)) {
                    invalidRedirectUri("".concat(redirect_uri_1.INSECURE_REDIRECT_URI_MESSAGE, ": ").concat(uri));
                }
            }
            // Validate correlation between grant_types and response_types
            if (isClientMetadataDocument) {
                // One metadata document serves every authorization server the client talks
                // to, so it declares a grant union; require one mutual grant and let the
                // token endpoint refuse the rest.
                resolveMutuallySupportedGrantTypes(opts, grantTypes);
            }
            else {
                supportedGrantTypes = new Set((0, extensions_1.getSupportedGrantTypes)(opts));
                for (_d = 0, grantTypes_1 = grantTypes; _d < grantTypes_1.length; _d++) {
                    grantType = grantTypes_1[_d];
                    if (!supportedGrantTypes.has(grantType)) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_client_metadata",
                            error_description: "unsupported grant_type ".concat(grantType),
                        });
                    }
                }
            }
            if (grantTypes.includes("authorization_code") &&
                !(responseTypes === null || responseTypes === void 0 ? void 0 : responseTypes.includes("code"))) {
                throw new api_1.APIError("BAD_REQUEST", {
                    error: "invalid_client_metadata",
                    error_description: "When 'authorization_code' grant type is used, 'code' response type must be included",
                });
            }
            if (!grantTypes.includes("authorization_code") &&
                (responseTypes === null || responseTypes === void 0 ? void 0 : responseTypes.includes("code"))) {
                throw new api_1.APIError("BAD_REQUEST", {
                    error: "invalid_client_metadata",
                    error_description: "When 'code' response type is used, 'authorization_code' grant type must be included",
                });
            }
            // Validate subject_type
            if (clientWithDefaults.subject_type !== undefined) {
                if (clientWithDefaults.subject_type !== "public" &&
                    clientWithDefaults.subject_type !== "pairwise") {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "subject_type must be \"public\" or \"pairwise\"",
                    });
                }
                if (clientWithDefaults.subject_type === "pairwise" &&
                    !opts.pairwiseSecret) {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "pairwise subject_type requires server pairwiseSecret configuration",
                    });
                }
                // The pairwise sector is the redirect URI host. Any app can register a
                // custom scheme, so the host in `app://rp.example.com/callback` does not
                // identify the client and would share an HTTPS client's sector.
                if (clientWithDefaults.subject_type === "pairwise" &&
                    ((_m = clientWithDefaults.redirect_uris) === null || _m === void 0 ? void 0 : _m.some(isCustomSchemeWithHost))) {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "pairwise clients cannot use custom-scheme redirect URIs that include a host",
                    });
                }
                // Per OIDC Core §8.1, when multiple redirect_uris have different hosts,
                // a sector_identifier_uri is required (not yet supported). Reject registration
                // until sector_identifier_uri support is added.
                if (clientWithDefaults.subject_type === "pairwise" &&
                    clientWithDefaults.redirect_uris &&
                    clientWithDefaults.redirect_uris.length > 1) {
                    hosts = new Set(clientWithDefaults.redirect_uris.map(function (uri) { return new URL(uri).host; }));
                    if (hosts.size > 1) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_client_metadata",
                            error_description: "pairwise clients with redirect_uris on different hosts require a sector_identifier_uri, which is not yet supported. All redirect_uris must share the same host.",
                        });
                    }
                }
            }
            requestedScopes = (_o = clientWithDefaults === null || clientWithDefaults === void 0 ? void 0 : clientWithDefaults.scope) === null || _o === void 0 ? void 0 : _o.split(" ").filter(function (v) { return v.length; });
            validatesRegistrationMetadata = (settings === null || settings === void 0 ? void 0 : settings.registrationSource) === "dynamic" ||
                (settings === null || settings === void 0 ? void 0 : settings.registrationSource) === "clientMetadataDocument";
            allowedScopes = validatesRegistrationMetadata
                ? resolveClientRegistrationScopes(opts)
                : opts.scopes;
            if (allowedScopes) {
                validScopes = new Set(allowedScopes);
                for (_e = 0, _f = requestedScopes !== null && requestedScopes !== void 0 ? requestedScopes : []; _e < _f.length; _e++) {
                    requestedScope = _f[_e];
                    if (!(validScopes === null || validScopes === void 0 ? void 0 : validScopes.has(requestedScope))) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_scope",
                            error_description: "cannot request scope ".concat(requestedScope),
                        });
                    }
                }
            }
            if (validatesRegistrationMetadata &&
                clientWithDefaults.require_pkce === false) {
                throw new api_1.APIError("BAD_REQUEST", {
                    error: "invalid_client_metadata",
                    error_description: "pkce is required for registered clients.",
                });
            }
            // Validate client key metadata (jwks / jwks_uri). OIDC Dynamic Client
            // Registration treats these as general client metadata, not only
            // private_key_jwt key material. private_key_jwt still requires one below.
            if (clientWithDefaults.jwks || clientWithDefaults.jwks_uri) {
                // OIDC Registration: jwks and jwks_uri must not both be present.
                if (clientWithDefaults.jwks && clientWithDefaults.jwks_uri) {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "jwks and jwks_uri are mutually exclusive",
                    });
                }
                if (clientWithDefaults.jwks_uri) {
                    try {
                        uri = new URL(clientWithDefaults.jwks_uri);
                        if (uri.protocol !== "https:") {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error: "invalid_client_metadata",
                                error_description: "jwks_uri must use HTTPS",
                            });
                        }
                        if (uri.username || uri.password) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error: "invalid_client_metadata",
                                error_description: "jwks_uri must not contain credentials",
                            });
                        }
                        // URL.hash is empty for a bare trailing `#`, so inspect the source value.
                        if (clientWithDefaults.jwks_uri.includes("#")) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error: "invalid_client_metadata",
                                error_description: "jwks_uri must not include a fragment component",
                            });
                        }
                        if ((0, client_assertion_1.isPrivateHostname)(uri.hostname)) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error: "invalid_client_metadata",
                                error_description: "jwks_uri must not point to a private or reserved address",
                            });
                        }
                        if ((settings === null || settings === void 0 ? void 0 : settings.ctx) && !settings.ctx.context.isTrustedOrigin(uri.href)) {
                            clientId = typeof clientWithDefaults.client_id === "string"
                                ? clientWithDefaults.client_id
                                : undefined;
                            isSameOriginClientMetadataDocumentKey = isClientMetadataDocument &&
                                clientId !== undefined &&
                                URL.canParse(clientId) &&
                                new URL(clientId).origin === uri.origin;
                            if (!isSameOriginClientMetadataDocumentKey) {
                                throw new api_1.APIError("BAD_REQUEST", {
                                    error: "invalid_client_metadata",
                                    error_description: "jwks_uri must belong to a trusted origin or the Client ID Metadata Document origin",
                                });
                            }
                        }
                    }
                    catch (e) {
                        if (e instanceof api_1.APIError)
                            throw e;
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_client_metadata",
                            error_description: "jwks_uri must be a valid URL",
                        });
                    }
                }
                if (clientWithDefaults.jwks) {
                    (0, client_jwks_1.assertValidClientJwks)(clientWithDefaults.jwks);
                }
            }
            // private_key_jwt requires key material; other methods may still register
            // client keys for OIDC features such as request objects or encrypted responses.
            if (tokenEndpointAuthMethod === "private_key_jwt" &&
                !clientWithDefaults.jwks &&
                !clientWithDefaults.jwks_uri) {
                throw new api_1.APIError("BAD_REQUEST", {
                    error: "invalid_client_metadata",
                    error_description: "private_key_jwt requires either jwks or jwks_uri",
                });
            }
            if (clientWithDefaults.backchannel_logout_uri !== undefined) {
                if (opts.disableJwtPlugin) {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "backchannel_logout_uri requires the jwt plugin (disableJwtPlugin must be false)",
                    });
                }
                url = void 0;
                try {
                    url = new URL(clientWithDefaults.backchannel_logout_uri);
                }
                catch (_r) {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "backchannel_logout_uri must be an absolute URL",
                    });
                }
                // Spec §2.2: "The backchannel_logout_uri MUST NOT include a fragment
                // component." Check the raw value rather than `url.hash`, which is empty
                // for a bare trailing `#` and would let that fragment delimiter through.
                if (clientWithDefaults.backchannel_logout_uri.includes("#")) {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "backchannel_logout_uri must not include a fragment component",
                    });
                }
                if (url.protocol !== "https:") {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "backchannel_logout_uri must use https",
                    });
                }
                if (url.username || url.password) {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "backchannel_logout_uri must not contain credentials",
                    });
                }
                // SSRF guard: the OP issues an outbound POST to this URI on every
                // session end, so every target must be publicly routable.
                if ((0, client_assertion_1.isPrivateHostname)(url.hostname)) {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_client_metadata",
                        error_description: "backchannel_logout_uri must not point to a private or reserved address",
                    });
                }
            }
            return [2 /*return*/];
        });
    });
}
var CLIENT_REGISTRATION_COLLISION = Symbol("client-registration-collision");
function isClientRegistrationCollision(error) {
    if (!error || typeof error !== "object")
        return false;
    var candidate = error;
    return (candidate[CLIENT_REGISTRATION_COLLISION] === true &&
        (candidate.kind === "oauth-client-row-unique" ||
            candidate.kind === "oauth-client-resource-link-unique") &&
        "cause" in candidate);
}
/**
 * Creates and persists one canonical OAuth client registration.
 *
 * Authorization and ownership resolution belong to endpoint adapters. This
 * operation owns metadata normalization, validation, credentials, persistence,
 * and resource links so canonical creation paths share one transactional
 * boundary.
 */
function persistOAuthClientRegistration(ctx, opts, input) {
    return __awaiter(this, void 0, void 0, function () {
        var registrationMetadata, body, isPublic, isPrivateKeyJwt, isExtensionAuthMethod, clientId, clientSecret, storedClientSecret, _a, isPKCEOptionalForRegisteredClient, requirePKCE, iat, effectiveBody, _requestedResources, persistableBody, owner, schema, requestedResources, resources, clientModel, clientResourceModel, existingClient, clientDiscoveryId, persistenceResult;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    registrationMetadata = input.registrationSource === "dynamic" && !input.metadata.scope
                        ? __assign(__assign({}, input.metadata), { scope: (_c = ((_b = opts.clientRegistrationDefaultScopes) !== null && _b !== void 0 ? _b : opts.scopes)) === null || _c === void 0 ? void 0 : _c.join(" ") }) : input.metadata;
                    body = applyOAuthClientRegistrationDefaults(registrationMetadata, input.registrationSource === "clientMetadataDocument"
                        ? null
                        : input.registrationSource === "dynamic"
                            ? resolveDynamicRegistrationDefaultApplicationType(opts, registrationMetadata)
                            : "web");
                    isPublic = body.token_endpoint_auth_method === "none";
                    isPrivateKeyJwt = body.token_endpoint_auth_method === "private_key_jwt";
                    isExtensionAuthMethod = (0, extensions_1.isExtensionTokenEndpointAuthMethod)(opts, body.token_endpoint_auth_method);
                    // Check if client parameters are valid combination
                    return [4 /*yield*/, checkOAuthClient(body, opts, {
                            registrationSource: input.registrationSource,
                            ctx: ctx,
                        })];
                case 1:
                    // Check if client parameters are valid combination
                    _t.sent();
                    clientId = (_f = (_d = input.clientId) !== null && _d !== void 0 ? _d : (_e = opts.generateClientId) === null || _e === void 0 ? void 0 : _e.call(opts)) !== null && _f !== void 0 ? _f : (0, crypto_1.generateRandomString)(32, "a-z", "A-Z");
                    clientSecret = isPublic || isPrivateKeyJwt || isExtensionAuthMethod
                        ? undefined
                        : ((_g = opts.generateClientSecret) === null || _g === void 0 ? void 0 : _g.call(opts)) || (0, crypto_1.generateRandomString)(32, "a-z", "A-Z");
                    if (!clientSecret) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, utils_1.storeClientSecret)(ctx, opts, clientSecret)];
                case 2:
                    _a = _t.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = undefined;
                    _t.label = 4;
                case 4:
                    storedClientSecret = _a;
                    isPKCEOptionalForRegisteredClient = input.registrationSource === "dynamic" &&
                        !isPublic &&
                        opts.clientRegistrationRequirePKCE === false;
                    requirePKCE = (_h = body.require_pkce) !== null && _h !== void 0 ? _h : (isPKCEOptionalForRegisteredClient ? false : undefined);
                    iat = Math.floor(Date.now() / 1000);
                    effectiveBody = input.registrationSource === "dynamic" ||
                        input.registrationSource === "clientMetadataDocument"
                        ? __assign(__assign({}, body), { scope: resolveClientRegistrationScopes(opts).join(" ") }) : body;
                    _requestedResources = effectiveBody.resources, persistableBody = __rest(effectiveBody, ["resources"]);
                    owner = input.registrationSource === "clientMetadataDocument"
                        ? undefined
                        : {
                            userId: input.userId,
                            referenceId: input.referenceId,
                        };
                    schema = oauthToSchema(__assign(__assign({}, persistableBody), { redirect_uris: (_j = body.redirect_uris) !== null && _j !== void 0 ? _j : [], 
                        // Dynamic registration should not have disabled defined
                        disabled: undefined, 
                        // Required if client secret is issued
                        client_secret_expires_at: storedClientSecret
                            ? input.registrationSource === "dynamic" &&
                                opts.clientRegistrationClientSecretExpiration
                                ? (0, plugins_1.toExpJWT)(opts.clientRegistrationClientSecretExpiration, iat)
                                : 0
                            : undefined, 
                        // Override
                        client_id: clientId, client_secret: storedClientSecret, client_id_issued_at: iat, require_pkce: requirePKCE, user_id: (owner === null || owner === void 0 ? void 0 : owner.referenceId) ? undefined : owner === null || owner === void 0 ? void 0 : owner.userId, reference_id: owner === null || owner === void 0 ? void 0 : owner.referenceId }));
                    // A discovery refresh leaves the stored ceiling alone (see the update below).
                    schema.clientCredentialsScopes =
                        input.registrationSource === "managed"
                            ? ((_k = input.clientCredentialsScopes) !== null && _k !== void 0 ? _k : [])
                            : [];
                    schema.clientDiscoveryId =
                        input.registrationSource === "clientMetadataDocument"
                            ? input.clientDiscoveryId
                            : null;
                    if (input.registrationSource === "clientMetadataDocument" &&
                        body.application_type === undefined) {
                        schema.applicationType = null;
                    }
                    requestedResources = input.registrationSource === "clientMetadataDocument"
                        ? []
                        : ((_l = input.requestedResources) !== null && _l !== void 0 ? _l : []);
                    if (input.registrationSource === "dynamic") {
                        assertDynamicRegistrationResourcesAllowed(opts, requestedResources);
                    }
                    return [4 /*yield*/, resolveClientRegistrationResources(ctx, opts, requestedResources)];
                case 5:
                    resources = _t.sent();
                    clientModel = (_p = (_o = (_m = opts.schema) === null || _m === void 0 ? void 0 : _m.oauthClient) === null || _o === void 0 ? void 0 : _o.modelName) !== null && _p !== void 0 ? _p : "oauthClient";
                    clientResourceModel = (_s = (_r = (_q = opts.schema) === null || _q === void 0 ? void 0 : _q.oauthClientResource) === null || _r === void 0 ? void 0 : _r.modelName) !== null && _s !== void 0 ? _s : "oauthClientResource";
                    existingClient = input.registrationSource === "clientMetadataDocument"
                        ? input.existingClient
                        : undefined;
                    clientDiscoveryId = input.registrationSource === "clientMetadataDocument"
                        ? input.clientDiscoveryId
                        : null;
                    return [4 /*yield*/, (0, context_1.runWithTransaction)(ctx.context.adapter, function () { return __awaiter(_this, void 0, void 0, function () {
                            var adapter, storedClient, created, _ceiling, _disabled, _skipConsent, _enableEndSession, refreshed, updatedClient, error_1, linkedResources, _a, linkedResourceIds, now, _i, resources_3, resourceId, error_2;
                            var _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, (0, context_1.getCurrentAdapter)(ctx.context.adapter)];
                                    case 1:
                                        adapter = _d.sent();
                                        created = false;
                                        if (!existingClient) return [3 /*break*/, 3];
                                        _ceiling = schema.clientCredentialsScopes, _disabled = schema.disabled, _skipConsent = schema.skipConsent, _enableEndSession = schema.enableEndSession, refreshed = __rest(schema, ["clientCredentialsScopes", "disabled", "skipConsent", "enableEndSession"]);
                                        return [4 /*yield*/, adapter.update({
                                                model: clientModel,
                                                where: [
                                                    { field: "clientId", value: clientId },
                                                    {
                                                        field: "clientDiscoveryId",
                                                        value: clientDiscoveryId,
                                                    },
                                                ],
                                                update: __assign(__assign({}, refreshed), { createdAt: existingClient.createdAt, updatedAt: new Date(iat * 1000) }),
                                            })];
                                    case 2:
                                        updatedClient = _d.sent();
                                        if (!updatedClient) {
                                            throw new api_1.APIError("BAD_REQUEST", {
                                                error: "invalid_client",
                                                error_description: "client no longer exists",
                                            });
                                        }
                                        storedClient = updatedClient;
                                        return [3 /*break*/, 7];
                                    case 3:
                                        _d.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, adapter.create({
                                                model: clientModel,
                                                data: __assign(__assign({}, schema), { createdAt: new Date(iat * 1000), updatedAt: new Date(iat * 1000) }),
                                            })];
                                    case 4:
                                        storedClient = _d.sent();
                                        return [3 /*break*/, 6];
                                    case 5:
                                        error_1 = _d.sent();
                                        if (input.registrationSource === "clientMetadataDocument" &&
                                            isUniqueConstraintError(error_1)) {
                                            throw _b = {},
                                                _b[CLIENT_REGISTRATION_COLLISION] = true,
                                                _b.kind = "oauth-client-row-unique",
                                                _b.clientId = clientId,
                                                _b.cause = error_1,
                                                _b;
                                        }
                                        throw error_1;
                                    case 6:
                                        created = true;
                                        _d.label = 7;
                                    case 7:
                                        if (!(resources.length === 0)) return [3 /*break*/, 8];
                                        _a = [];
                                        return [3 /*break*/, 10];
                                    case 8: return [4 /*yield*/, adapter.findMany({
                                            model: clientResourceModel,
                                            where: [{ field: "clientId", value: clientId }],
                                        })];
                                    case 9:
                                        _a = _d.sent();
                                        _d.label = 10;
                                    case 10:
                                        linkedResources = _a;
                                        linkedResourceIds = new Set(linkedResources.map(function (link) { return link.resourceId; }));
                                        now = new Date();
                                        _i = 0, resources_3 = resources;
                                        _d.label = 11;
                                    case 11:
                                        if (!(_i < resources_3.length)) return [3 /*break*/, 16];
                                        resourceId = resources_3[_i];
                                        if (linkedResourceIds.has(resourceId))
                                            return [3 /*break*/, 15];
                                        _d.label = 12;
                                    case 12:
                                        _d.trys.push([12, 14, , 15]);
                                        return [4 /*yield*/, adapter.create({
                                                model: clientResourceModel,
                                                data: {
                                                    clientId: clientId,
                                                    resourceId: resourceId,
                                                    createdAt: now,
                                                },
                                            })];
                                    case 13:
                                        _d.sent();
                                        return [3 /*break*/, 15];
                                    case 14:
                                        error_2 = _d.sent();
                                        if (input.registrationSource === "clientMetadataDocument" &&
                                            isUniqueConstraintError(error_2)) {
                                            throw _c = {},
                                                _c[CLIENT_REGISTRATION_COLLISION] = true,
                                                _c.kind = "oauth-client-resource-link-unique",
                                                _c.clientId = clientId,
                                                _c.resourceId = resourceId,
                                                _c.cause = error_2,
                                                _c;
                                        }
                                        throw error_2;
                                    case 15:
                                        _i++;
                                        return [3 /*break*/, 11];
                                    case 16: return [2 /*return*/, { client: storedClient, created: created }];
                                }
                            });
                        }); })];
                case 6:
                    persistenceResult = _t.sent();
                    return [2 /*return*/, {
                            client: persistenceResult.client,
                            clientSecret: clientSecret,
                            resources: resources,
                            created: persistenceResult.created,
                        }];
            }
        });
    });
}
function createOAuthClientRegistrationResponse(result, opts) {
    var _a, _b;
    var responseBody = schemaToOAuth(__assign(__assign({}, result.client), { clientSecret: result.clientSecret
            ? ((_b = (_a = opts.prefix) === null || _a === void 0 ? void 0 : _a.clientSecret) !== null && _b !== void 0 ? _b : "") + result.clientSecret
            : undefined }));
    if (result.resources.length > 0)
        responseBody.resources = result.resources;
    return responseBody;
}
function createOAuthClientAdministrativeResponse(result, opts) {
    var _a;
    return __assign(__assign({}, createOAuthClientRegistrationResponse(result, opts)), { client_credentials_scopes: __spreadArray([], ((_a = result.client.clientCredentialsScopes) !== null && _a !== void 0 ? _a : []), true) });
}
/**
 * Creates and persists one canonical OAuth client registration.
 */
function createOAuthClientRegistration(ctx, opts, input) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, persistOAuthClientRegistration(ctx, opts, input)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, createOAuthClientRegistrationResponse(result, opts)];
            }
        });
    });
}
function createOAuthClientAdministrativeRegistration(ctx, opts, input) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, persistOAuthClientRegistration(ctx, opts, input)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, createOAuthClientAdministrativeResponse(result, opts)];
            }
        });
    });
}
function assertClientDiscoveryOwnership(client, clientDiscoveryId) {
    if (!client || client.clientDiscoveryId === clientDiscoveryId)
        return;
    throw new api_1.APIError("BAD_REQUEST", {
        error: "invalid_client",
        error_description: "client_id is already owned by a different registration source",
    });
}
/**
 * First-party persistence seam for a validated Client ID Metadata Document.
 *
 * This operation owns both initial creation and atomic replacement. It never
 * generates a client secret, preserves operator-controlled flags on
 * replacement, and ensures server-default resource links in the same
 * transaction.
 *
 * @internal
 */
function registerClientMetadataDocument(ctx, opts, input) {
    return __awaiter(this, void 0, void 0, function () {
        var registrationInput, error_3, clientModel, clientResourceModel, currentClient, exactLink, retryError_1;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    assertClientDiscoveryOwnership(input.existingClient, input.clientDiscoveryId);
                    if (input.metadata.backchannel_logout_uri !== undefined ||
                        input.metadata.backchannel_logout_session_required !== undefined) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_client_metadata",
                            error_description: "Client ID Metadata Documents cannot register a back-channel logout target",
                        });
                    }
                    if (((_a = input.metadata.token_endpoint_auth_method) !== null && _a !== void 0 ? _a : "none") !== "none" &&
                        input.metadata.token_endpoint_auth_method !== "private_key_jwt") {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_client_metadata",
                            error_description: "Client ID Metadata Document clients cannot use a shared secret",
                        });
                    }
                    registrationInput = __assign(__assign({}, input), { metadata: __assign(__assign({}, input.metadata), { token_endpoint_auth_method: (_b = input.metadata.token_endpoint_auth_method) !== null && _b !== void 0 ? _b : "none", client_secret: undefined, client_secret_expires_at: undefined }), registrationSource: "clientMetadataDocument" });
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 3, , 10]);
                    return [4 /*yield*/, persistOAuthClientRegistration(ctx, opts, registrationInput)];
                case 2: return [2 /*return*/, _j.sent()];
                case 3:
                    error_3 = _j.sent();
                    if (!isClientRegistrationCollision(error_3))
                        throw error_3;
                    clientModel = (_e = (_d = (_c = opts.schema) === null || _c === void 0 ? void 0 : _c.oauthClient) === null || _d === void 0 ? void 0 : _d.modelName) !== null && _e !== void 0 ? _e : "oauthClient";
                    clientResourceModel = (_h = (_g = (_f = opts.schema) === null || _f === void 0 ? void 0 : _f.oauthClientResource) === null || _g === void 0 ? void 0 : _g.modelName) !== null && _h !== void 0 ? _h : "oauthClientResource";
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: clientModel,
                            where: [{ field: "clientId", value: input.clientId }],
                        })];
                case 4:
                    currentClient = _j.sent();
                    if (error_3.clientId !== input.clientId ||
                        !currentClient ||
                        currentClient.clientDiscoveryId !== input.clientDiscoveryId) {
                        throw error_3.cause;
                    }
                    if (!(error_3.kind === "oauth-client-resource-link-unique")) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: clientResourceModel,
                            where: [
                                { field: "clientId", value: error_3.clientId },
                                { field: "resourceId", value: error_3.resourceId },
                            ],
                        })];
                case 5:
                    exactLink = _j.sent();
                    if (!exactLink)
                        throw error_3.cause;
                    _j.label = 6;
                case 6:
                    _j.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, persistOAuthClientRegistration(ctx, opts, __assign(__assign({}, registrationInput), { existingClient: currentClient }))];
                case 7: return [2 /*return*/, _j.sent()];
                case 8:
                    retryError_1 = _j.sent();
                    if (isClientRegistrationCollision(retryError_1)) {
                        throw retryError_1.cause;
                    }
                    throw retryError_1;
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function isUniqueConstraintError(error) {
    var _a, _b;
    if (!error || typeof error !== "object")
        return false;
    var candidate = error;
    var code = String((_b = (_a = candidate.code) !== null && _a !== void 0 ? _a : candidate.errno) !== null && _b !== void 0 ? _b : "");
    if ([
        "1062",
        "11000",
        "23505",
        "ER_DUP_ENTRY",
        "P2002",
        "SQLITE_CONSTRAINT_UNIQUE",
    ].includes(code)) {
        return true;
    }
    if (candidate.name === "MongoServerError" && candidate.code === 11000) {
        return true;
    }
    return (typeof candidate.message === "string" &&
        /(?:duplicate|unique constraint|unique key)/i.test(candidate.message));
}
function createOAuthClientEndpoint(ctx, opts, settings) {
    return __awaiter(this, void 0, void 0, function () {
        var session, referenceId, _a, _b, rawClientCredentialsScopes, metadata, clientCredentialsScopes, grantTypes, requestedResources, _i, _c, identifier, registrationInput, responseBody, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _e.sent();
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "create")];
                case 2:
                    _e.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    if (!opts.clientReference) return [3 /*break*/, 4];
                    return [4 /*yield*/, opts.clientReference({
                            user: session.user,
                            session: session.session,
                        })];
                case 3:
                    _a = _e.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = undefined;
                    _e.label = 5;
                case 5:
                    referenceId = _a;
                    _b = ctx.body, rawClientCredentialsScopes = _b.client_credentials_scopes, metadata = __rest(_b, ["client_credentials_scopes"]);
                    clientCredentialsScopes = (settings === null || settings === void 0 ? void 0 : settings.admin)
                        ? (0, client_credentials_1.normalizeClientCredentialsScopes)(rawClientCredentialsScopes !== null && rawClientCredentialsScopes !== void 0 ? rawClientCredentialsScopes : [])
                        : [];
                    grantTypes = resolveRegistrationGrantTypes(metadata);
                    (0, client_credentials_1.validateClientCredentialsScopes)(clientCredentialsScopes, grantTypes, metadata.token_endpoint_auth_method, opts);
                    if (!(clientCredentialsScopes.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "configure-client-credentials-scopes")];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    requestedResources = (settings === null || settings === void 0 ? void 0 : settings.admin) ? metadata.resources : undefined;
                    _i = 0, _c = new Set(requestedResources !== null && requestedResources !== void 0 ? requestedResources : []);
                    _e.label = 8;
                case 8:
                    if (!(_i < _c.length)) return [3 /*break*/, 11];
                    identifier = _c[_i];
                    return [4 /*yield*/, (0, privileges_2.assertResourcePrivileges)(ctx, session, opts, "link", identifier)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11:
                    registrationInput = __assign({ metadata: metadata, registrationSource: "managed", userId: referenceId ? undefined : session.session.userId, referenceId: referenceId, clientCredentialsScopes: clientCredentialsScopes }, (requestedResources ? { requestedResources: requestedResources } : {}));
                    if (!(settings === null || settings === void 0 ? void 0 : settings.admin)) return [3 /*break*/, 13];
                    return [4 /*yield*/, createOAuthClientAdministrativeRegistration(ctx, opts, registrationInput)];
                case 12:
                    _d = _e.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, createOAuthClientRegistration(ctx, opts, registrationInput)];
                case 14:
                    _d = _e.sent();
                    _e.label = 15;
                case 15:
                    responseBody = _d;
                    ctx.setStatus(201);
                    return [2 /*return*/, ctx.json(responseBody)];
            }
        });
    });
}
function oauthToSchema(input) {
    var 
    // Important Fields
    clientId = input.client_id, clientSecret = input.client_secret, _expiresAt = input.client_secret_expires_at, _scope = input.scope, 
    // Recommended client data
    userId = input.user_id, _createdAt = input.client_id_issued_at, 
    // UI Metadata
    name = input.client_name, uri = input.client_uri, icon = input.logo_uri, contacts = input.contacts, tos = input.tos_uri, policy = input.policy_uri, 
    // Client key metadata (only one can be used)
    inputJwks = input.jwks, jwksUri = input.jwks_uri, 
    // User Software Identifiers
    softwareId = input.software_id, softwareVersion = input.software_version, softwareStatement = input.software_statement, 
    // Authentication Metadata
    redirectUris = input.redirect_uris, postLogoutRedirectUris = input.post_logout_redirect_uris, backchannelLogoutUri = input.backchannel_logout_uri, backchannelLogoutSessionRequired = input.backchannel_logout_session_required, tokenEndpointAuthMethod = input.token_endpoint_auth_method, grantTypes = input.grant_types, responseTypes = input.response_types, applicationType = input.application_type, 
    // Not Part of RFC7591 Spec
    disabled = input.disabled, skipConsent = input.skip_consent, enableEndSession = input.enable_end_session, requirePKCE = input.require_pkce, dpopBoundAccessTokens = input.dpop_bound_access_tokens, subjectType = input.subject_type, referenceId = input.reference_id, inputMetadata = input.metadata;
    // Type conversions
    var expiresAt = _expiresAt
        ? new Date(Number(_expiresAt) * 1000)
        : undefined;
    var createdAt = _createdAt ? new Date(_createdAt * 1000) : undefined;
    var scopes = _scope === null || _scope === void 0 ? void 0 : _scope.split(" ");
    var metadataObj = (0, client_metadata_1.stripReservedOAuthClientMetadataExtensions)(inputMetadata !== null && inputMetadata !== void 0 ? inputMetadata : {});
    var metadata = metadataObj && Object.keys(metadataObj).length ? metadataObj : undefined;
    return {
        // Important Fields
        clientId: clientId,
        clientSecret: clientSecret,
        disabled: disabled,
        scopes: scopes,
        // Recommended client data
        userId: userId,
        createdAt: createdAt,
        expiresAt: expiresAt,
        // UI Metadata
        name: name,
        uri: uri,
        icon: icon,
        contacts: contacts,
        tos: tos,
        policy: policy,
        // User Software Identifiers
        softwareId: softwareId,
        softwareVersion: softwareVersion,
        softwareStatement: softwareStatement,
        // Authentication Metadata
        redirectUris: redirectUris,
        postLogoutRedirectUris: postLogoutRedirectUris,
        backchannelLogoutUri: backchannelLogoutUri,
        backchannelLogoutSessionRequired: backchannelLogoutSessionRequired,
        tokenEndpointAuthMethod: tokenEndpointAuthMethod,
        grantTypes: grantTypes,
        responseTypes: responseTypes,
        // Client key metadata
        jwks: inputJwks ? JSON.stringify(inputJwks) : undefined,
        jwksUri: jwksUri,
        applicationType: applicationType,
        // All other metadata
        skipConsent: skipConsent,
        enableEndSession: enableEndSession,
        requirePKCE: requirePKCE,
        dpopBoundAccessTokens: dpopBoundAccessTokens,
        subjectType: subjectType,
        referenceId: referenceId,
        metadata: metadata,
    };
}
/**
 * Converts a Database Schema to an OAuth 2.0 Dynamic Client Schema
 * @param input
 * @param cleaned - default true, determines if the output has only Oauth 2.0 compatible data
 * @returns
 */
function schemaToOAuth(input) {
    var 
    // Important Fields
    clientId = input.clientId, clientSecret = input.clientSecret, disabled = input.disabled, scopes = input.scopes, 
    // Recommended client data
    userId = input.userId, createdAt = input.createdAt, _updatedAt = input.updatedAt, expiresAt = input.expiresAt, 
    // UI Metadata
    name = input.name, uri = input.uri, icon = input.icon, contacts = input.contacts, tos = input.tos, policy = input.policy, 
    // User Software Identifiers
    softwareId = input.softwareId, softwareVersion = input.softwareVersion, softwareStatement = input.softwareStatement, 
    // Authentication Metadata
    redirectUris = input.redirectUris, postLogoutRedirectUris = input.postLogoutRedirectUris, backchannelLogoutUri = input.backchannelLogoutUri, backchannelLogoutSessionRequired = input.backchannelLogoutSessionRequired, tokenEndpointAuthMethod = input.tokenEndpointAuthMethod, grantTypes = input.grantTypes, responseTypes = input.responseTypes, applicationType = input.applicationType, 
    // Jwks
    jwks = input.jwks, jwksUri = input.jwksUri, 
    // All other metadata
    skipConsent = input.skipConsent, enableEndSession = input.enableEndSession, requirePKCE = input.requirePKCE, dpopBoundAccessTokens = input.dpopBoundAccessTokens, subjectType = input.subjectType, referenceId = input.referenceId, metadata = input.metadata;
    // Type conversions
    var _expiresAt = expiresAt
        ? Math.round(new Date(expiresAt).getTime() / 1000)
        : undefined;
    var _createdAt = createdAt
        ? Math.round(new Date(createdAt).getTime() / 1000)
        : undefined;
    var _scopes = scopes === null || scopes === void 0 ? void 0 : scopes.join(" ");
    var _metadata = (0, client_metadata_1.stripReservedOAuthClientMetadataExtensions)((0, utils_1.parseClientMetadata)(metadata));
    return __assign(__assign({}, _metadata), { 
        // Important Fields
        client_id: clientId, client_secret: clientSecret !== null && clientSecret !== void 0 ? clientSecret : undefined, client_secret_expires_at: clientSecret ? (_expiresAt !== null && _expiresAt !== void 0 ? _expiresAt : 0) : undefined, scope: _scopes !== null && _scopes !== void 0 ? _scopes : undefined, 
        // Recommended client data
        user_id: userId !== null && userId !== void 0 ? userId : undefined, client_id_issued_at: _createdAt !== null && _createdAt !== void 0 ? _createdAt : undefined, 
        // UI Metadata
        client_name: name !== null && name !== void 0 ? name : undefined, client_uri: uri !== null && uri !== void 0 ? uri : undefined, logo_uri: icon !== null && icon !== void 0 ? icon : undefined, contacts: contacts !== null && contacts !== void 0 ? contacts : undefined, tos_uri: tos !== null && tos !== void 0 ? tos : undefined, policy_uri: policy !== null && policy !== void 0 ? policy : undefined, 
        // Client key metadata (only one can be used)
        jwks: jwks
            ? JSON.parse(jwks)
            : undefined, jwks_uri: jwksUri !== null && jwksUri !== void 0 ? jwksUri : undefined, 
        // User Software Identifiers
        software_id: softwareId !== null && softwareId !== void 0 ? softwareId : undefined, software_version: softwareVersion !== null && softwareVersion !== void 0 ? softwareVersion : undefined, software_statement: softwareStatement !== null && softwareStatement !== void 0 ? softwareStatement : undefined, 
        // Authentication Metadata
        redirect_uris: redirectUris !== null && redirectUris !== void 0 ? redirectUris : [], post_logout_redirect_uris: postLogoutRedirectUris !== null && postLogoutRedirectUris !== void 0 ? postLogoutRedirectUris : undefined, backchannel_logout_uri: backchannelLogoutUri !== null && backchannelLogoutUri !== void 0 ? backchannelLogoutUri : undefined, backchannel_logout_session_required: backchannelLogoutSessionRequired !== null && backchannelLogoutSessionRequired !== void 0 ? backchannelLogoutSessionRequired : undefined, token_endpoint_auth_method: tokenEndpointAuthMethod !== null && tokenEndpointAuthMethod !== void 0 ? tokenEndpointAuthMethod : undefined, grant_types: grantTypes !== null && grantTypes !== void 0 ? grantTypes : undefined, response_types: responseTypes !== null && responseTypes !== void 0 ? responseTypes : undefined, application_type: applicationType !== null && applicationType !== void 0 ? applicationType : undefined, 
        // Not Part of RFC7591 Spec
        disabled: disabled !== null && disabled !== void 0 ? disabled : undefined, skip_consent: skipConsent !== null && skipConsent !== void 0 ? skipConsent : undefined, enable_end_session: enableEndSession !== null && enableEndSession !== void 0 ? enableEndSession : undefined, require_pkce: requirePKCE !== null && requirePKCE !== void 0 ? requirePKCE : undefined, dpop_bound_access_tokens: dpopBoundAccessTokens !== null && dpopBoundAccessTokens !== void 0 ? dpopBoundAccessTokens : undefined, subject_type: subjectType !== null && subjectType !== void 0 ? subjectType : undefined, reference_id: referenceId !== null && referenceId !== void 0 ? referenceId : undefined });
}
