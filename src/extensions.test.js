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
var api_1 = require("better-auth/api");
var client_1 = require("better-auth/client");
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var extensions_1 = require("./extensions");
var oauth_1 = require("./oauth");
var token_1 = require("./token");
var client_assertion_1 = require("./utils/client-assertion");
(0, vitest_1.describe)("oauth-provider extensions", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, resource, redirectUri, extensionGrant, extensionOpaqueGrant, extensionOpaqueBoundGrant, extensionDriftGrant, extensionAuthMethod, extensionAssertionType, grantUser, observedCustomParam, clientDiscovery, extensionPlugin, _a, auth, signInWithTestUser, customFetchImpl, _b, headers, user, client;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                resource = "https://vc.example.com/credential";
                redirectUri = "https://client.example.com/callback";
                extensionGrant = "urn:better-auth:test:grant";
                extensionOpaqueGrant = "urn:better-auth:test:opaque-grant";
                extensionOpaqueBoundGrant = "urn:better-auth:test:opaque-bound-grant";
                extensionDriftGrant = "urn:better-auth:test:drift-grant";
                extensionAuthMethod = "test_attestation_jwt";
                extensionAssertionType = "urn:better-auth:test:client-assertion-type:test-attestation";
                clientDiscovery = {
                    id: "test-client-discovery",
                    matches: function () { return false; },
                    resolve: function () { return null; },
                    discoveryMetadata: {
                        issuer: "https://malicious-discovery.example.com",
                        token_endpoint: "https://malicious-discovery.example.com/token",
                        client_id_metadata_document_supported: true,
                    },
                };
                extensionPlugin = {
                    id: "test-oauth-extension",
                    init: function (ctx) {
                        var _a, _b;
                        var _this = this;
                        (0, extensions_1.extendOAuthProvider)(ctx, {
                            grants: (_a = {},
                                _a[extensionGrant] = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                    var _c, client, confirmation;
                                    var ctx = _b.ctx, provider = _b.provider;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                observedCustomParam = ctx.body
                                                    .custom_param;
                                                if (!grantUser) {
                                                    throw new api_1.APIError("BAD_REQUEST", {
                                                        error: "invalid_request",
                                                        error_description: "test user is not ready",
                                                    });
                                                }
                                                return [4 /*yield*/, provider.authenticateClient({
                                                        scopes: ["openid", "email", "vc"],
                                                    })];
                                            case 1:
                                                _c = _d.sent(), client = _c.client, confirmation = _c.confirmation;
                                                return [2 /*return*/, provider.issueTokens({
                                                        client: client,
                                                        scopes: ["openid", "email", "vc"],
                                                        user: grantUser,
                                                        resources: [resource],
                                                        // Forward the confirmation the auth strategy proved.
                                                        confirmation: confirmation,
                                                        accessTokenClaims: {
                                                            grant_claim: "grant-access",
                                                            client_id: "malicious-client",
                                                        },
                                                        idTokenClaims: {
                                                            grant_id_claim: "grant-id",
                                                            sub: "malicious-sub",
                                                            auth_time: 0,
                                                            amr: ["malicious-grant"],
                                                            azp: "malicious-authorized-party",
                                                            nbf: 0,
                                                            jti: "malicious-jti",
                                                            c_hash: "malicious-code-hash",
                                                            s_hash: "malicious-state-hash",
                                                            // Collides with the extension idToken contributor below;
                                                            // the per-issuance value must win.
                                                            order_probe: "grant",
                                                        },
                                                        tokenResponse: {
                                                            issued_token_type: "urn:better-auth:test:access_token",
                                                        },
                                                    })];
                                        }
                                    });
                                }); },
                                // Issues an opaque access token (no resource -> no audience), so
                                // introspection re-derives extension claims through the resolver
                                // instead of returning a signed JWT payload verbatim.
                                _a[extensionOpaqueGrant] = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                    var client;
                                    var provider = _b.provider;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                if (!grantUser) {
                                                    throw new api_1.APIError("BAD_REQUEST", {
                                                        error: "invalid_request",
                                                        error_description: "test user is not ready",
                                                    });
                                                }
                                                return [4 /*yield*/, provider.authenticateClient({
                                                        scopes: ["openid", "email", "vc"],
                                                    })];
                                            case 1:
                                                client = (_c.sent()).client;
                                                return [2 /*return*/, provider.issueTokens({
                                                        client: client,
                                                        scopes: ["openid", "email", "vc"],
                                                        user: grantUser,
                                                        // Per-issuance claims are JWT-only; an opaque token persists
                                                        // none, so this must be absent at introspection.
                                                        accessTokenClaims: { opaque_per_issuance: "jwt-only" },
                                                    })];
                                        }
                                    });
                                }); },
                                // Sender-constrains an opaque access token (no resource). The
                                // confirmation is persisted on the opaque-token row (RFC 7800 `cnf`)
                                // and surfaced at introspection, not silently dropped.
                                _a[extensionOpaqueBoundGrant] = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                    var client;
                                    var provider = _b.provider;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                if (!grantUser) {
                                                    throw new api_1.APIError("BAD_REQUEST", {
                                                        error: "invalid_request",
                                                        error_description: "test user is not ready",
                                                    });
                                                }
                                                return [4 /*yield*/, provider.authenticateClient({
                                                        scopes: ["openid", "email", "vc"],
                                                    })];
                                            case 1:
                                                client = (_c.sent()).client;
                                                return [2 /*return*/, provider.issueTokens({
                                                        client: client,
                                                        scopes: ["openid", "email", "vc"],
                                                        user: grantUser,
                                                        confirmation: { jkt: "opaque-bound-jkt" },
                                                    })];
                                        }
                                    });
                                }); },
                                // A stale/buggy handler that still passes a permissive grantType the
                                // type no longer allows. The provider must ignore it and authorize
                                // against the dispatched grant.
                                _a[extensionDriftGrant] = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                    var staleRequest, client;
                                    var provider = _b.provider;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                if (!grantUser) {
                                                    throw new api_1.APIError("BAD_REQUEST", {
                                                        error: "invalid_request",
                                                        error_description: "test user is not ready",
                                                    });
                                                }
                                                staleRequest = {
                                                    scopes: ["openid", "email", "vc"],
                                                    grantType: extensionOpaqueGrant,
                                                };
                                                return [4 /*yield*/, provider.authenticateClient(staleRequest)];
                                            case 1:
                                                client = (_c.sent()).client;
                                                return [2 /*return*/, provider.issueTokens({
                                                        client: client,
                                                        scopes: ["openid", "email", "vc"],
                                                        user: grantUser,
                                                    })];
                                        }
                                    });
                                }); },
                                _a),
                            clientAuthentication: (_b = {},
                                _b[extensionAuthMethod] = {
                                    assertionTypes: [extensionAssertionType],
                                    authenticate: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                                        var assertion = _b.assertion, clientId = _b.clientId;
                                        return __generator(this, function (_c) {
                                            if (!clientId || assertion !== "assertion:".concat(clientId)) {
                                                throw new api_1.APIError("UNAUTHORIZED", {
                                                    error: "invalid_client",
                                                    error_description: "invalid test assertion",
                                                });
                                            }
                                            // Prove the caller controls clientId; the provider resolves and
                                            // authorizes the client record itself.
                                            return [2 /*return*/, {
                                                    clientId: clientId,
                                                    // A sender-constraint the strategy proved (wallet
                                                    // attestation); the grant forwards it to issueTokens. An
                                                    // mTLS-style `x5t#S256` keeps the token bearer-presentable,
                                                    // unlike a DPoP `jkt` which would require a proof per request.
                                                    confirmation: { "x5t#S256": "wallet-attested-cert" },
                                                }];
                                        });
                                    }); },
                                },
                                _b),
                            metadata: function () { return ({
                                issuer: "https://malicious.example.com",
                                credential_issuer: "https://vc.example.com",
                            }); },
                            claims: {
                                accessToken: function () { return ({
                                    extension_access_claim: "extension-access",
                                    client_id: "malicious-extension-client",
                                    cnf: { jkt: "forged-by-extension" },
                                }); },
                                idToken: function () { return ({
                                    extension_id_claim: "extension-id",
                                    sub: "malicious-extension-sub",
                                    email: "evil@malicious.example",
                                    azp: "malicious-extension-authorized-party",
                                    jti: "malicious-extension-jti",
                                    order_probe: "extension",
                                }); },
                                userInfo: function () { return ({
                                    extension_userinfo_claim: "extension-userinfo",
                                    email: undefined,
                                    sub: "malicious-extension-sub",
                                }); },
                            },
                            clientDiscovery: clientDiscovery,
                        });
                    },
                };
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)({
                                jwt: {
                                    issuer: authServerBaseUrl,
                                },
                            }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                resources: [resource],
                                enforcePerClientResources: false,
                                allowDynamicClientRegistration: true,
                                scopes: ["openid", "profile", "email", "offline_access", "vc"],
                                customUserInfoClaims: function () { return ({
                                    custom_userinfo_claim: "custom-userinfo",
                                    sub: "malicious-custom-sub", // re-pinned by the endpoint
                                    email_verified: true, // first-party override of a base claim
                                }); },
                            }),
                            extensionPlugin,
                        ],
                    })];
            case 1:
                _a = _c.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                _b = _c.sent(), headers = _b.headers, user = _b.user;
                grantUser = user;
                client = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
                (0, vitest_1.it)("advertises extension metadata without overriding core metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.getOpenIdConfig()];
                            case 1:
                                metadata = (_a.sent());
                                (0, vitest_1.expect)(metadata.issuer).toBe(authServerBaseUrl);
                                (0, vitest_1.expect)(metadata.token_endpoint).not.toBe("https://malicious-discovery.example.com/token");
                                (0, vitest_1.expect)(metadata.credential_issuer).toBe("https://vc.example.com");
                                (0, vitest_1.expect)(metadata.client_id_metadata_document_supported).toBe(true);
                                (0, vitest_1.expect)(metadata.grant_types_supported).toContain(extensionGrant);
                                (0, vitest_1.expect)(metadata.token_endpoint_auth_methods_supported).toContain(extensionAuthMethod);
                                (0, vitest_1.expect)(metadata.introspection_endpoint_auth_methods_supported).toContain(extensionAuthMethod);
                                (0, vitest_1.expect)(metadata.revocation_endpoint_auth_methods_supported).toContain(extensionAuthMethod);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("registers extension grants and auth methods through normal client creation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var adminClient, registeredClient;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: extensionAuthMethod,
                                        grant_types: [extensionGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                adminClient = _a.sent();
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.client_id).toBeDefined();
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.client_secret).toBeUndefined();
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.token_endpoint_auth_method).toBe(extensionAuthMethod);
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.grant_types).toEqual([extensionGrant]);
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.redirect_uris).toEqual([]);
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.response_types).toBeUndefined();
                                return [4 /*yield*/, auth.api.registerOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: extensionAuthMethod,
                                            grant_types: [extensionGrant],
                                            scope: "openid email vc",
                                            application_type: "web",
                                        },
                                    })];
                            case 2:
                                registeredClient = _a.sent();
                                (0, vitest_1.expect)(registeredClient === null || registeredClient === void 0 ? void 0 : registeredClient.client_id).toBeDefined();
                                (0, vitest_1.expect)(registeredClient === null || registeredClient === void 0 ? void 0 : registeredClient.client_secret).toBeUndefined();
                                (0, vitest_1.expect)(registeredClient === null || registeredClient === void 0 ? void 0 : registeredClient.token_endpoint_auth_method).toBe(extensionAuthMethod);
                                (0, vitest_1.expect)(registeredClient === null || registeredClient === void 0 ? void 0 : registeredClient.redirect_uris).toEqual([]);
                                (0, vitest_1.expect)(registeredClient === null || registeredClient === void 0 ? void 0 : registeredClient.response_types).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects code response type without authorization code grant", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error, e_1;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: extensionAuthMethod,
                                            grant_types: [extensionGrant],
                                            response_types: ["code"],
                                            scope: "openid email vc",
                                            application_type: "web",
                                        },
                                    })];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _b.sent();
                                error = e_1;
                                return [3 /*break*/, 3];
                            case 3:
                                (0, vitest_1.expect)(error === null || error === void 0 ? void 0 : error.statusCode).toBe(400);
                                (0, vitest_1.expect)((_a = error === null || error === void 0 ? void 0 : error.body) === null || _a === void 0 ? void 0 : _a.error_description).toContain("authorization_code");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("validates jwks_uri for extension auth-method clients", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error, e_2;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: extensionAuthMethod,
                                            grant_types: [extensionGrant],
                                            jwks_uri: "https://127.0.0.1/jwks",
                                            scope: "openid email vc",
                                            application_type: "web",
                                        },
                                    })];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_2 = _b.sent();
                                error = e_2;
                                return [3 /*break*/, 3];
                            case 3:
                                (0, vitest_1.expect)(error === null || error === void 0 ? void 0 : error.statusCode).toBe(400);
                                (0, vitest_1.expect)((_a = error === null || error === void 0 ? void 0 : error.body) === null || _a === void 0 ? void 0 : _a.error_description).toContain("private or reserved address");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects extension auth-method clients carrying both jwks and jwks_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error, e_3;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: extensionAuthMethod,
                                            grant_types: [extensionGrant],
                                            jwks: {
                                                keys: [{ kty: "RSA", n: "test", e: "test-exponent" }],
                                            },
                                            jwks_uri: "https://client.example.com/jwks",
                                            scope: "openid email vc",
                                            application_type: "web",
                                        },
                                    })];
                            case 1:
                                _b.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_3 = _b.sent();
                                error = e_3;
                                return [3 /*break*/, 3];
                            case 3:
                                (0, vitest_1.expect)(error === null || error === void 0 ? void 0 : error.statusCode).toBe(400);
                                (0, vitest_1.expect)((_a = error === null || error === void 0 ? void 0 : error.body) === null || _a === void 0 ? void 0 : _a.error_description).toContain("mutually exclusive");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects empty grant type registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/register", {
                                    method: "POST",
                                    headers: headers,
                                    body: {
                                        grant_types: [],
                                        redirect_uris: [redirectUri],
                                    },
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects assertion auth for clients with omitted (default) auth method", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var legacyClient, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: [extensionGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                legacyClient = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: extensionGrant,
                                            client_id: legacyClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(legacyClient.client_id),
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error_description).toContain("client registered for client_secret_basic cannot use");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns invalid_client when an extension grant omits required credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confidentialClient, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: [extensionGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                confidentialClient = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: extensionGrant,
                                            client_id: confidentialClient.client_id,
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("challenges Basic authentication with an empty secret", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confidentialClient, responseHeaders, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: [extensionGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                confidentialClient = _c.sent();
                                if (!(confidentialClient === null || confidentialClient === void 0 ? void 0 : confidentialClient.client_id)) {
                                    throw new Error("confidential OAuth client was not created");
                                }
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({ grant_type: extensionGrant }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                            authorization: "Basic ".concat(Buffer.from("".concat(confidentialClient.client_id, ":")).toString("base64")),
                                        },
                                        onError: function (context) {
                                            responseHeaders = context.response.headers;
                                        },
                                    })];
                            case 2:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                (0, vitest_1.expect)(responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get("WWW-Authenticate")).toBe("Basic");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("authorizes against the resolved record, not the strategy", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: new URLSearchParams({
                                        grant_type: extensionGrant,
                                        client_id: "unregistered-but-proven",
                                        client_assertion_type: extensionAssertionType,
                                        client_assertion: "assertion:unregistered-but-proven",
                                    }),
                                    headers: {
                                        "content-type": "application/x-www-form-urlencoded",
                                    },
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects invalid direct extension options during provider setup", function () {
                    (0, vitest_1.expect)(function () {
                        return (0, oauth_1.oauthProvider)({
                            loginPage: "/login",
                            consentPage: "/consent",
                            extensions: [
                                {
                                    grants: {
                                        password: function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                throw new api_1.APIError("BAD_REQUEST", {
                                                    error: "invalid_request",
                                                    error_description: "unreachable test grant",
                                                });
                                            });
                                        }); },
                                    },
                                },
                            ],
                        });
                    }).toThrow("grant type must be an absolute URI");
                });
                (0, vitest_1.it)("registers an extension at most once per extension object", function () {
                    var _a;
                    var provider = (0, oauth_1.oauthProvider)({
                        loginPage: "/login",
                        consentPage: "/consent",
                    });
                    var ctx = {
                        getPlugin: function (id) { return (id === "oauth-provider" ? provider : null); },
                    };
                    var extension = {
                        grants: (_a = {},
                            _a[extensionGrant] = function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    throw new api_1.APIError("BAD_REQUEST", {
                                        error: "invalid_request",
                                        error_description: "unreachable test grant",
                                    });
                                });
                            }); },
                            _a),
                    };
                    (0, extensions_1.extendOAuthProvider)(ctx, extension);
                    // Re-running init() with the same extension object must not double-register.
                    (0, extensions_1.extendOAuthProvider)(ctx, extension);
                    (0, vitest_1.expect)(provider.options.extensions).toHaveLength(1);
                });
                (0, vitest_1.it)("dispatches extension grants through shared token issuance", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, tokenResponse, accessTokenPayload, idTokenPayload, userInfo, introspection;
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: ["".concat(redirectUri, "/token")],
                                        token_endpoint_auth_method: extensionAuthMethod,
                                        grant_types: [extensionGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                oauthClient = _l.sent();
                                (0, vitest_1.expect)(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: extensionGrant,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(oauthClient.client_id),
                                            custom_param: "preserved",
                                            resource: resource,
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                tokenResponse = _l.sent();
                                (0, vitest_1.expect)(tokenResponse.error).toBeNull();
                                (0, vitest_1.expect)((_a = tokenResponse.data) === null || _a === void 0 ? void 0 : _a.issued_token_type).toBe("urn:better-auth:test:access_token");
                                (0, vitest_1.expect)((_b = tokenResponse.data) === null || _b === void 0 ? void 0 : _b.scope).toBe("openid email vc");
                                (0, vitest_1.expect)(observedCustomParam).toBe("preserved");
                                accessTokenPayload = (0, jose_1.decodeJwt)(tokenResponse.data.access_token);
                                (0, vitest_1.expect)(accessTokenPayload.extension_access_claim).toBe("extension-access");
                                (0, vitest_1.expect)(accessTokenPayload.grant_claim).toBe("grant-access");
                                (0, vitest_1.expect)(accessTokenPayload.client_id).toBe(oauthClient.client_id);
                                (0, vitest_1.expect)(accessTokenPayload.aud).toContain(resource);
                                // The auth strategy proved a confirmation, the grant forwarded it through
                                // authenticateClient, and it is stamped as `cnf`, sender-constraining the
                                // token. `cnf` is AS-owned, so the extension's forged `cnf` is stripped and
                                // the strategy's confirmation is the only one present.
                                (0, vitest_1.expect)(accessTokenPayload.cnf).toEqual({
                                    "x5t#S256": "wallet-attested-cert",
                                });
                                (0, vitest_1.expect)((_c = tokenResponse.data) === null || _c === void 0 ? void 0 : _c.token_type).toBe("Bearer");
                                idTokenPayload = (0, jose_1.decodeJwt)(tokenResponse.data.id_token);
                                (0, vitest_1.expect)(idTokenPayload.extension_id_claim).toBe("extension-id");
                                (0, vitest_1.expect)(idTokenPayload.grant_id_claim).toBe("grant-id");
                                (0, vitest_1.expect)(idTokenPayload.sub).toBe(user.id);
                                (0, vitest_1.expect)(idTokenPayload.auth_time).toBeUndefined();
                                (0, vitest_1.expect)(idTokenPayload.amr).toBeUndefined();
                                (0, vitest_1.expect)(idTokenPayload.azp).toBeUndefined();
                                (0, vitest_1.expect)(idTokenPayload.nbf).toBeUndefined();
                                (0, vitest_1.expect)(idTokenPayload.jti).toBeUndefined();
                                (0, vitest_1.expect)(idTokenPayload.c_hash).toBeUndefined();
                                (0, vitest_1.expect)(idTokenPayload.s_hash).toBeUndefined();
                                // Extension id-token claims are additive: they cannot fill standard
                                // identity claims that scope values only request from UserInfo.
                                (0, vitest_1.expect)(idTokenPayload.email).toBeUndefined();
                                // Per-issuance idTokenClaims win a collision against an extension idToken
                                // contributor (extension < per-issuance), matching the access-token ladder.
                                (0, vitest_1.expect)(idTokenPayload.order_probe).toBe("grant");
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: "Bearer ".concat(tokenResponse.data.access_token),
                                        },
                                    })];
                            case 3:
                                userInfo = _l.sent();
                                (0, vitest_1.expect)(userInfo.error).toBeNull();
                                (0, vitest_1.expect)((_d = userInfo.data) === null || _d === void 0 ? void 0 : _d.sub).toBe(user.id);
                                (0, vitest_1.expect)((_e = userInfo.data) === null || _e === void 0 ? void 0 : _e.email).toBe(user.email);
                                (0, vitest_1.expect)((_f = userInfo.data) === null || _f === void 0 ? void 0 : _f.extension_userinfo_claim).toBe("extension-userinfo");
                                (0, vitest_1.expect)((_g = userInfo.data) === null || _g === void 0 ? void 0 : _g.custom_userinfo_claim).toBe("custom-userinfo");
                                // First-party customUserInfoClaims may override a provider base claim,
                                // unlike an additive third-party extension claim. `sub` stays re-pinned.
                                (0, vitest_1.expect)((_h = userInfo.data) === null || _h === void 0 ? void 0 : _h.email_verified).toBe(true);
                                return [4 /*yield*/, client.$fetch("/oauth2/introspect", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            token: tokenResponse.data.access_token,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(oauthClient.client_id),
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 4:
                                introspection = _l.sent();
                                (0, vitest_1.expect)(introspection.error).toBeNull();
                                (0, vitest_1.expect)((_j = introspection.data) === null || _j === void 0 ? void 0 : _j.active).toBe(true);
                                (0, vitest_1.expect)((_k = introspection.data) === null || _k === void 0 ? void 0 : _k.extension_access_claim).toBe("extension-access");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("ignores a runtime grantType argument and gates on the dispatched grant", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: extensionAuthMethod,
                                        grant_types: [extensionOpaqueGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                oauthClient = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: extensionDriftGrant,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(oauthClient.client_id),
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("unauthorized_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects unsupported extension grant types before credential handling", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: new URLSearchParams({
                                        grant_type: "urn:better-auth:test:missing-grant",
                                    }),
                                    headers: {
                                        "content-type": "application/x-www-form-urlencoded",
                                    },
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("unsupported_grant_type");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects extension grant keys that are not absolute URIs", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var invalidExtensionPlugin;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                invalidExtensionPlugin = {
                                    id: "invalid-oauth-extension",
                                    init: function (ctx) {
                                        var _this = this;
                                        (0, extensions_1.extendOAuthProvider)(ctx, {
                                            grants: {
                                                custom: function () { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        throw new api_1.APIError("BAD_REQUEST", {
                                                            error: "invalid_request",
                                                            error_description: "unreachable test grant",
                                                        });
                                                    });
                                                }); },
                                            },
                                        });
                                    },
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({
                                                jwt: {
                                                    issuer: authServerBaseUrl,
                                                },
                                            }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            invalidExtensionPlugin,
                                        ],
                                    })).rejects.toThrow("grant type must be an absolute URI")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects extension auth method keys reserved by built-in client authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var invalidExtensionPlugin;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                invalidExtensionPlugin = {
                                    id: "invalid-oauth-auth-method-extension",
                                    init: function (ctx) {
                                        var _this = this;
                                        (0, extensions_1.extendOAuthProvider)(ctx, {
                                            clientAuthentication: {
                                                private_key_jwt: {
                                                    assertionTypes: [extensionAssertionType],
                                                    authenticate: function () { return __awaiter(_this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            throw new api_1.APIError("BAD_REQUEST", {
                                                                error: "invalid_request",
                                                                error_description: "unreachable test authentication",
                                                            });
                                                        });
                                                    }); },
                                                },
                                            },
                                        });
                                    },
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({
                                                jwt: {
                                                    issuer: authServerBaseUrl,
                                                },
                                            }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            invalidExtensionPlugin,
                                        ],
                                    })).rejects.toThrow("token_endpoint_auth_method is reserved: private_key_jwt")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects extension assertion types reserved by private_key_jwt", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var invalidExtensionPlugin;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                invalidExtensionPlugin = {
                                    id: "invalid-oauth-assertion-type-extension",
                                    init: function (ctx) {
                                        var _a;
                                        var _this = this;
                                        (0, extensions_1.extendOAuthProvider)(ctx, {
                                            clientAuthentication: (_a = {},
                                                _a[extensionAuthMethod] = {
                                                    assertionTypes: [oauth2_1.CLIENT_ASSERTION_TYPE],
                                                    authenticate: function () { return __awaiter(_this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            throw new api_1.APIError("BAD_REQUEST", {
                                                                error: "invalid_request",
                                                                error_description: "unreachable test authentication",
                                                            });
                                                        });
                                                    }); },
                                                },
                                                _a),
                                        });
                                    },
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({
                                                jwt: {
                                                    issuer: authServerBaseUrl,
                                                },
                                            }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            invalidExtensionPlugin,
                                        ],
                                    })).rejects.toThrow("client_assertion_type is reserved: ".concat(oauth2_1.CLIENT_ASSERTION_TYPE))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects extension auth methods without assertion types", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var invalidExtensionPlugin;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                invalidExtensionPlugin = {
                                    id: "invalid-oauth-empty-assertion-types-extension",
                                    init: function (ctx) {
                                        var _a;
                                        var _this = this;
                                        (0, extensions_1.extendOAuthProvider)(ctx, {
                                            clientAuthentication: (_a = {},
                                                _a[extensionAuthMethod] = {
                                                    assertionTypes: [],
                                                    authenticate: function () { return __awaiter(_this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            throw new api_1.APIError("BAD_REQUEST", {
                                                                error: "invalid_request",
                                                                error_description: "unreachable test authentication",
                                                            });
                                                        });
                                                    }); },
                                                },
                                                _a),
                                        });
                                    },
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({
                                                jwt: {
                                                    issuer: authServerBaseUrl,
                                                },
                                            }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            invalidExtensionPlugin,
                                        ],
                                    })).rejects.toThrow("client_assertion_type list cannot be empty")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects two extensions registering the same grant type", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sharedGrant, makeExtensionPlugin;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                sharedGrant = "urn:better-auth:test:shared-grant";
                                makeExtensionPlugin = function (id) {
                                    return ({
                                        id: id,
                                        init: function (ctx) {
                                            var _a;
                                            var _this = this;
                                            (0, extensions_1.extendOAuthProvider)(ctx, {
                                                grants: (_a = {},
                                                    _a[sharedGrant] = function () { return __awaiter(_this, void 0, void 0, function () {
                                                        return __generator(this, function (_a) {
                                                            throw new api_1.APIError("BAD_REQUEST", {
                                                                error: "invalid_request",
                                                                error_description: "unreachable test grant",
                                                            });
                                                        });
                                                    }); },
                                                    _a),
                                            });
                                        },
                                    });
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            makeExtensionPlugin("ext-a"),
                                            makeExtensionPlugin("ext-b"),
                                        ],
                                    })).rejects.toThrow("register grant type")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects two extensions registering the same auth method", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sharedMethod, makeAuthExtensionPlugin;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                sharedMethod = "shared_attestation_jwt";
                                makeAuthExtensionPlugin = function (id, assertionType) {
                                    return ({
                                        id: id,
                                        init: function (ctx) {
                                            var _a;
                                            var _this = this;
                                            (0, extensions_1.extendOAuthProvider)(ctx, {
                                                clientAuthentication: (_a = {},
                                                    _a[sharedMethod] = {
                                                        assertionTypes: [assertionType],
                                                        authenticate: function () { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                throw new api_1.APIError("BAD_REQUEST", {
                                                                    error: "invalid_request",
                                                                    error_description: "unreachable test authentication",
                                                                });
                                                            });
                                                        }); },
                                                    },
                                                    _a),
                                            });
                                        },
                                    });
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            makeAuthExtensionPlugin("auth-ext-a", "urn:better-auth:test:a"),
                                            makeAuthExtensionPlugin("auth-ext-b", "urn:better-auth:test:b"),
                                        ],
                                    })).rejects.toThrow("register token_endpoint_auth_method")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects two extensions registering the same assertion type", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sharedAssertion, makeAssertionExtensionPlugin;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                sharedAssertion = "urn:better-auth:test:shared-assertion";
                                makeAssertionExtensionPlugin = function (id, method) {
                                    return ({
                                        id: id,
                                        init: function (ctx) {
                                            var _a;
                                            var _this = this;
                                            (0, extensions_1.extendOAuthProvider)(ctx, {
                                                clientAuthentication: (_a = {},
                                                    _a[method] = {
                                                        assertionTypes: [sharedAssertion],
                                                        authenticate: function () { return __awaiter(_this, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                throw new api_1.APIError("BAD_REQUEST", {
                                                                    error: "invalid_request",
                                                                    error_description: "unreachable test authentication",
                                                                });
                                                            });
                                                        }); },
                                                    },
                                                    _a),
                                            });
                                        },
                                    });
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            makeAssertionExtensionPlugin("assert-ext-a", "method_a_jwt"),
                                            makeAssertionExtensionPlugin("assert-ext-b", "method_b_jwt"),
                                        ],
                                    })).rejects.toThrow("register client_assertion_type")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects duplicate client discovery identifiers", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var makeDiscoveryExtensionPlugin;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                makeDiscoveryExtensionPlugin = function (pluginId) {
                                    return ({
                                        id: pluginId,
                                        init: function (ctx) {
                                            (0, extensions_1.extendOAuthProvider)(ctx, {
                                                clientDiscovery: {
                                                    id: "shared-client-discovery",
                                                    matches: function () { return false; },
                                                    resolve: function () { return null; },
                                                },
                                            });
                                        },
                                    });
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            makeDiscoveryExtensionPlugin("discovery-ext-a"),
                                            makeDiscoveryExtensionPlugin("discovery-ext-b"),
                                        ],
                                    })).rejects.toThrow("register client discovery id")];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("resolves a metadata key collision to the first-registered extension", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var makeMetadataExtensionPlugin, instance, metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                makeMetadataExtensionPlugin = function (id, value) {
                                    return ({
                                        id: id,
                                        init: function (ctx) {
                                            (0, extensions_1.extendOAuthProvider)(ctx, {
                                                metadata: function () { return ({ shared_metadata_field: value }); },
                                            });
                                        },
                                    });
                                };
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            makeMetadataExtensionPlugin("meta-ext-a", "first"),
                                            makeMetadataExtensionPlugin("meta-ext-b", "second"),
                                        ],
                                    })];
                            case 1:
                                instance = _a.sent();
                                return [4 /*yield*/, instance.auth.api.getOpenIdConfig()];
                            case 2:
                                metadata = (_a.sent());
                                (0, vitest_1.expect)(metadata.shared_metadata_field).toBe("first");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://www.better-auth.com/docs/plugins/oauth-provider/reference#provider-extensions
                 */
                (0, vitest_1.it)("warns when two extensions contribute the same metadata key", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var makeMetadataExtensionPlugin, instance, logger, warn, openIdConfig;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                makeMetadataExtensionPlugin = function (id, metadata) {
                                    return ({
                                        id: id,
                                        init: function (ctx) {
                                            (0, extensions_1.extendOAuthProvider)(ctx, { metadata: function () { return metadata; } });
                                        },
                                    });
                                };
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                            }),
                                            makeMetadataExtensionPlugin("meta-ext-a", {
                                                authorization_details_types_supported: ["type_a"],
                                                only_in_a: true,
                                            }),
                                            makeMetadataExtensionPlugin("meta-ext-b", {
                                                authorization_details_types_supported: ["type_b"],
                                                issuer: "https://ignored.example.com",
                                            }),
                                        ],
                                    })];
                            case 1:
                                instance = _a.sent();
                                return [4 /*yield*/, instance.auth.$context];
                            case 2:
                                logger = (_a.sent()).logger;
                                warn = vitest_1.vi.spyOn(logger, "warn").mockImplementation(function () { });
                                return [4 /*yield*/, instance.auth.api.getOpenIdConfig()];
                            case 3:
                                openIdConfig = (_a.sent());
                                (0, vitest_1.expect)(openIdConfig.authorization_details_types_supported).toEqual([
                                    "type_a",
                                ]);
                                (0, vitest_1.expect)(warn.mock.calls.map(function (_a) {
                                    var message = _a[0];
                                    return message;
                                })).toEqual([
                                    'oauth-provider: two extensions contributed the discovery metadata key "authorization_details_types_supported" to openid-configuration; keeping the first-registered value.',
                                ]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("re-derives extension access-token claims on opaque-token introspection", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, tokenResponse, introspection;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: extensionAuthMethod,
                                        grant_types: [extensionOpaqueGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                oauthClient = _e.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: extensionOpaqueGrant,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(oauthClient.client_id),
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 2:
                                tokenResponse = _e.sent();
                                (0, vitest_1.expect)(tokenResponse.error).toBeNull();
                                // Opaque, not a JWT: a random string with no dot-delimited JWT segments.
                                (0, vitest_1.expect)(tokenResponse.data.access_token).not.toContain(".");
                                return [4 /*yield*/, client.$fetch("/oauth2/introspect", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            token: tokenResponse.data.access_token,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(oauthClient.client_id),
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                introspection = _e.sent();
                                (0, vitest_1.expect)(introspection.error).toBeNull();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                // Re-derived through the claim authority, not stored on the opaque row.
                                (0, vitest_1.expect)((_b = introspection.data) === null || _b === void 0 ? void 0 : _b.extension_access_claim).toBe("extension-access");
                                // The contributor tried to set the reserved client_id; the AS owns it.
                                (0, vitest_1.expect)((_c = introspection.data) === null || _c === void 0 ? void 0 : _c.client_id).toBe(oauthClient.client_id);
                                // Per-issuance extras are JWT-only and must not reappear on opaque tokens.
                                (0, vitest_1.expect)((_d = introspection.data) === null || _d === void 0 ? void 0 : _d.opaque_per_issuance).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("surfaces an extension assertion rejection as invalid_client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: extensionAuthMethod,
                                        grant_types: [extensionGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                oauthClient = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: extensionGrant,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:wrong",
                                            resource: resource,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 2:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("authenticates an extension assertion on the revoke endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, tokenResponse, accessToken, revoke, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: extensionAuthMethod,
                                        grant_types: [extensionOpaqueGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                oauthClient = _b.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: extensionOpaqueGrant,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(oauthClient.client_id),
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 2:
                                tokenResponse = _b.sent();
                                (0, vitest_1.expect)(tokenResponse.error).toBeNull();
                                accessToken = tokenResponse.data.access_token;
                                return [4 /*yield*/, client.$fetch("/oauth2/revoke", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            token: accessToken,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(oauthClient.client_id),
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                revoke = _b.sent();
                                // No invalid_client: the extension assertion authenticated on /revoke.
                                (0, vitest_1.expect)(revoke.error).toBeNull();
                                return [4 /*yield*/, client.$fetch("/oauth2/introspect", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            token: accessToken,
                                            client_id: oauthClient.client_id,
                                            client_assertion_type: extensionAssertionType,
                                            client_assertion: "assertion:".concat(oauthClient.client_id),
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 4:
                                introspection = _b.sent();
                                // The revoked token is gone: introspection reports it inactive or unknown,
                                // never active.
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).not.toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("consumeClientAssertion rejects an already-expired assertion", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var now, audience;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                now = Math.floor(Date.now() / 1000);
                                audience = "".concat(authServerBaseUrl, "/oauth2/token");
                                // The expiry check runs before any adapter access, so a minimal ctx is enough.
                                return [4 /*yield*/, (0, vitest_1.expect)((0, client_assertion_1.consumeClientAssertion)({
                                        context: { baseURL: authServerBaseUrl },
                                    }, {}, {
                                        namespace: "test:expired",
                                        payload: { aud: audience, exp: now - 10, jti: "expired-jti" },
                                        expectedAudience: audience,
                                    })).rejects.toMatchObject({
                                        statusCode: 400,
                                        body: {
                                            error: "invalid_client",
                                            error_description: "client assertion has expired",
                                        },
                                    })];
                            case 1:
                                // The expiry check runs before any adapter access, so a minimal ctx is enough.
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("binds an opaque access token to its confirmation and surfaces it at introspection", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, clientAuth, response, introspection;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: extensionAuthMethod,
                                        grant_types: [extensionOpaqueBoundGrant],
                                        scope: "openid email vc",
                                        application_type: "web",
                                    },
                                })];
                            case 1:
                                oauthClient = _e.sent();
                                clientAuth = {
                                    client_id: oauthClient.client_id,
                                    client_assertion_type: extensionAssertionType,
                                    client_assertion: "assertion:".concat(oauthClient.client_id),
                                };
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams(__assign({ grant_type: extensionOpaqueBoundGrant }, clientAuth)),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 2:
                                response = _e.sent();
                                // The opaque token carries the RFC 7800 `cnf` confirmation (persisted on
                                // its row), so it is sender-constrained, not silently minted unbound.
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.token_type).toBe("DPoP");
                                return [4 /*yield*/, client.$fetch("/oauth2/introspect", {
                                        method: "POST",
                                        body: new URLSearchParams(__assign({ token: response.data.access_token, token_type_hint: "access_token" }, clientAuth)),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                introspection = _e.sent();
                                (0, vitest_1.expect)((_b = introspection.data) === null || _b === void 0 ? void 0 : _b.active).toBe(true);
                                (0, vitest_1.expect)((_c = introspection.data) === null || _c === void 0 ? void 0 : _c.token_type).toBe("DPoP");
                                (0, vitest_1.expect)((_d = introspection.data) === null || _d === void 0 ? void 0 : _d.cnf).toEqual({ jkt: "opaque-bound-jkt" });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("authenticateClient binds the assertion audience to the served endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var observedAudience, opts, ctx;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                opts = {
                                    extensions: [
                                        {
                                            clientAuthentication: {
                                                audience_probe_method: {
                                                    assertionTypes: ["urn:better-auth:test:audience-probe"],
                                                    authenticate: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                                                        var expectedAudience = _b.expectedAudience;
                                                        return __generator(this, function (_c) {
                                                            observedAudience = expectedAudience;
                                                            // Stop before client validation; we only assert the audience.
                                                            throw new api_1.APIError("BAD_REQUEST", {
                                                                error: "invalid_client",
                                                                error_description: "audience recorded",
                                                            });
                                                        });
                                                    }); },
                                                },
                                            },
                                        },
                                    ],
                                };
                                ctx = {
                                    path: "/oauth2/bc-authorize",
                                    context: { baseURL: authServerBaseUrl },
                                    body: {
                                        client_id: "probe-client",
                                        client_assertion: "probe-assertion",
                                        client_assertion_type: "urn:better-auth:test:audience-probe",
                                    },
                                    request: { headers: new Headers() },
                                };
                                return [4 /*yield*/, (0, vitest_1.expect)((0, token_1.getOAuthProviderApi)(ctx, opts, "urn:better-auth:test:grant").authenticateClient()).rejects.toBeDefined()];
                            case 1:
                                _a.sent();
                                // The audience is the endpoint serving the request, not a hardcoded token
                                // endpoint, so the same assertion cannot be replayed at another endpoint.
                                (0, vitest_1.expect)(observedAudience).toBe("".concat(authServerBaseUrl, "/oauth2/bc-authorize"));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("getOAuthProviderApi.issueTokens requires a bound grant type", function () {
                    var api = (0, token_1.getOAuthProviderApi)({
                        context: { baseURL: authServerBaseUrl },
                    }, {});
                    // No grantType bound (the accessor was obtained for non-issuing
                    // capabilities): issuing must fail loudly rather than mislabel the grant.
                    (0, vitest_1.expect)(function () {
                        return api.issueTokens({
                            client: { clientId: "x" },
                            scopes: [],
                        });
                    }).toThrow(vitest_1.expect.objectContaining({
                        body: vitest_1.expect.objectContaining({
                            error_description: vitest_1.expect.stringContaining("grant type"),
                        }),
                    }));
                });
                return [2 /*return*/];
        }
    });
}); });
