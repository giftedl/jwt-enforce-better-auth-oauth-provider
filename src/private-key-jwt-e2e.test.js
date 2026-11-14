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
var client_1 = require("better-auth/client");
var node_1 = require("better-auth/node");
var oauth2_1 = require("better-auth/oauth2");
var generic_oauth_1 = require("better-auth/plugins/generic-oauth");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
/**
 * End-to-end test: full OAuth2 sign-in flow using private_key_jwt
 * across the entire stack.
 *
 * - Authorization server: oauthProvider plugin with a private_key_jwt client
 * - Relying party: genericOAuth plugin with a private_key_jwt assertion provider
 * - Flow: RP → authorize → login → callback → token exchange (with JWT assertion) → session
 */
(0, vitest_1.describe)("private_key_jwt e2e", function () { return __awaiter(void 0, void 0, void 0, function () {
    var rpBaseUrl, providerId, keyPair, privateJwk, publicJwk, _a, authorizationServer, signInWithTestUser, customFetchImpl, cookieSetter, testUser, server, authServerBaseUrl, redirectUri, authClient, oauthClient, oauthJwksUriClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                rpBaseUrl = "http://localhost:5002";
                providerId = "jwt-assertion-provider";
                return [4 /*yield*/, (0, jose_1.generateKeyPair)("RS256", { extractable: true })];
            case 1:
                keyPair = _b.sent();
                return [4 /*yield*/, (0, jose_1.exportJWK)(keyPair.privateKey)];
            case 2:
                privateJwk = _b.sent();
                return [4 /*yield*/, (0, jose_1.exportJWK)(keyPair.publicKey)];
            case 3:
                publicJwk = _b.sent();
                return [4 /*yield*/, (0, test_1.getHttpTestInstance)({
                        trustedOrigins: ["https://trusted.example.com"],
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                assertionMaxLifetime: 300,
                            }),
                        ],
                    }, {
                        handler: function (auth) {
                            var nodeHandler = (0, node_1.toNodeHandler)(auth.handler);
                            return function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (req.url === "/.well-known/openid-configuration") {
                                                req.url = "/api/auth/.well-known/openid-configuration";
                                            }
                                            return [4 /*yield*/, nodeHandler(req, res)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                        },
                    })];
            case 4:
                _a = _b.sent(), authorizationServer = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl, cookieSetter = _a.cookieSetter, testUser = _a.testUser, server = _a.server, authServerBaseUrl = _a.baseURL;
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                authClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl },
                });
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_a.sent()).headers;
                                return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                            token_endpoint_auth_method: "private_key_jwt",
                                            jwks: {
                                                keys: [
                                                    __assign(__assign({}, publicJwk), { kid: "e2e-key-1", alg: "RS256", use: "sig" }),
                                                ],
                                            },
                                        },
                                    })];
                            case 2:
                                oauthClient = (_a.sent());
                                (0, vitest_1.expect)(oauthClient.client_id).toBeDefined();
                                (0, vitest_1.expect)(oauthClient.client_secret).toBeUndefined();
                                return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                            token_endpoint_auth_method: "private_key_jwt",
                                            jwks_uri: "https://trusted.example.com/.well-known/jwks.json",
                                        },
                                    })];
                            case 3:
                                oauthJwksUriClient = (_a.sent());
                                (0, vitest_1.expect)(oauthJwksUriClient.client_id).toBeDefined();
                                (0, vitest_1.expect)(oauthJwksUriClient.client_secret).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, server.close()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should complete full sign-in flow using private_key_jwt across RP and provider", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var rpFetchImpl, rpClient, rpHeaders, signInResult, loginRedirectUri, signInResponse, callbackUrl;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                                    account: {
                                        accountLinking: {
                                            trustedProviders: [providerId],
                                            requireLocalEmailVerified: false,
                                        },
                                    },
                                    plugins: [
                                        (0, generic_oauth_1.genericOAuth)({
                                            config: [
                                                {
                                                    providerId: providerId,
                                                    clientId: oauthClient.client_id,
                                                    redirectURI: redirectUri,
                                                    discoveryUrl: "".concat(authServerBaseUrl, "/.well-known/openid-configuration"),
                                                    scopes: ["openid", "profile", "email"],
                                                    pkce: true,
                                                    tokenEndpointAuth: {
                                                        method: "private_key_jwt",
                                                        getClientAssertion: (0, oauth2_1.createPrivateKeyJwtClientAssertionGetter)({
                                                            privateKeyJwk: privateJwk,
                                                            kid: "e2e-key-1",
                                                            algorithm: "RS256",
                                                        }),
                                                    },
                                                },
                                            ],
                                        }),
                                    ],
                                })];
                            case 1:
                                rpFetchImpl = (_c.sent()).customFetchImpl;
                                rpClient = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: { customFetchImpl: rpFetchImpl },
                                });
                                rpHeaders = new Headers();
                                return [4 /*yield*/, rpClient.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(rpHeaders),
                                    })];
                            case 2:
                                signInResult = _c.sent();
                                (0, vitest_1.expect)(signInResult.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(signInResult.url).toContain("client_id=".concat(oauthClient.client_id));
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(signInResult.url, {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _c.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                // Step 3: Stub window for the login flow
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, { throw: true })];
                            case 4:
                                signInResponse = _c.sent();
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                (0, vitest_1.expect)(signInResponse.url).toContain(rpBaseUrl);
                                callbackUrl = "";
                                return [4 /*yield*/, rpClient.$fetch(signInResponse.url, {
                                        method: "GET",
                                        headers: rpHeaders,
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _c.sent();
                                // If we reach the success callback, the full flow worked:
                                // RP signed JWT assertion → provider verified against JWKS → tokens issued → session created
                                (0, vitest_1.expect)(callbackUrl).toContain("/success");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should complete full sign-in flow using a trusted jwks_uri client", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var originalFetch, fetchSpy, rpFetchImpl, rpClient, rpHeaders, signInResult, loginRedirectUri, signInResponse, callbackUrl;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                originalFetch = globalThis.fetch.bind(globalThis);
                                fetchSpy = vitest_1.vi.fn(function (input, init) {
                                    var url = typeof input === "string"
                                        ? input
                                        : input instanceof URL
                                            ? input.href
                                            : input.url;
                                    if (url === "https://trusted.example.com/.well-known/jwks.json") {
                                        return Promise.resolve(new Response(JSON.stringify({
                                            keys: [
                                                __assign(__assign({}, publicJwk), { kid: "e2e-key-1", alg: "RS256", use: "sig" }),
                                            ],
                                        }), {
                                            status: 200,
                                            headers: { "content-type": "application/json" },
                                        }));
                                    }
                                    return originalFetch(input, init);
                                });
                                vitest_1.vi.stubGlobal("fetch", fetchSpy);
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        account: {
                                            accountLinking: {
                                                trustedProviders: [providerId],
                                                requireLocalEmailVerified: false,
                                            },
                                        },
                                        plugins: [
                                            (0, generic_oauth_1.genericOAuth)({
                                                config: [
                                                    {
                                                        providerId: providerId,
                                                        clientId: oauthJwksUriClient.client_id,
                                                        redirectURI: redirectUri,
                                                        discoveryUrl: "".concat(authServerBaseUrl, "/.well-known/openid-configuration"),
                                                        scopes: ["openid", "profile", "email"],
                                                        pkce: true,
                                                        tokenEndpointAuth: {
                                                            method: "private_key_jwt",
                                                            getClientAssertion: (0, oauth2_1.createPrivateKeyJwtClientAssertionGetter)({
                                                                privateKeyJwk: privateJwk,
                                                                kid: "e2e-key-1",
                                                                algorithm: "RS256",
                                                            }),
                                                        },
                                                    },
                                                ],
                                            }),
                                        ],
                                    })];
                            case 1:
                                rpFetchImpl = (_c.sent()).customFetchImpl;
                                rpClient = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: { customFetchImpl: rpFetchImpl },
                                });
                                rpHeaders = new Headers();
                                return [4 /*yield*/, rpClient.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(rpHeaders),
                                    })];
                            case 2:
                                signInResult = _c.sent();
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(signInResult.url, {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _c.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, { throw: true })];
                            case 4:
                                signInResponse = _c.sent();
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                (0, vitest_1.expect)(signInResponse.url).toContain(rpBaseUrl);
                                callbackUrl = "";
                                return [4 /*yield*/, rpClient.$fetch(signInResponse.url, {
                                        method: "GET",
                                        headers: rpHeaders,
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _c.sent();
                                (0, vitest_1.expect)(fetchSpy).toHaveBeenCalledWith("https://trusted.example.com/.well-known/jwks.json", vitest_1.expect.objectContaining({
                                    headers: { accept: "application/json" },
                                    redirect: "error",
                                }));
                                (0, vitest_1.expect)(callbackUrl).toContain("/success");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
