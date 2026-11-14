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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var better_call_1 = require("better-call");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
(0, vitest_1.describe)("pairwise subject identifiers", function () { return __awaiter(void 0, void 0, void 0, function () {
    function getTokensForClient(oauthClient, redirectUri, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, url, callbackRedirectUrl, callbackUrl, code, _a, body, reqHeaders, tokens;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                id: "test",
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                redirectURI: "",
                                authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                state: "test-state",
                                scopes: ["openid", "profile", "email", "offline_access"],
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        url = _b.sent();
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(url.toString(), {
                                headers: headers,
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _b.sent();
                        callbackUrl = new URL(callbackRedirectUrl);
                        code = callbackUrl.searchParams.get("code");
                        return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                code: code,
                                codeVerifier: codeVerifier,
                                redirectURI: redirectUri,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                resource: overrides === null || overrides === void 0 ? void 0 : overrides.resource,
                            })];
                    case 3:
                        _a = _b.sent(), body = _a.body, reqHeaders = _a.headers;
                        return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: reqHeaders,
                            })];
                    case 4:
                        tokens = _b.sent();
                        return [2 /*return*/, tokens];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, rpBaseUrl2, validResource, _a, auth, signInWithTestUser, customFetchImpl, headers, client, pairwiseClientA, pairwiseClientB, publicClient, sameHostClientA, redirectUriA, redirectUriB, redirectUriSameHost, redirectUriPublic;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                rpBaseUrl2 = "http://localhost:6000";
                validResource = "https://myapi.example.com";
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
                                pairwiseSecret: "test-pairwise-secret-key-32chars!!",
                                resources: [validResource],
                                enforcePerClientResources: false,
                                allowDynamicClientRegistration: true,
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                client = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                redirectUriA = "".concat(rpBaseUrl, "/api/auth/callback/test-a");
                redirectUriB = "".concat(rpBaseUrl2, "/api/auth/callback/test-b");
                redirectUriSameHost = "".concat(rpBaseUrl, "/api/auth/callback/test-same");
                redirectUriPublic = "".concat(rpBaseUrl, "/api/auth/callback/test-public");
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUriA],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        scope: "openid profile email offline_access",
                                        skip_consent: true,
                                        subject_type: "pairwise",
                                    },
                                })];
                            case 1:
                                pairwiseClientA = _a.sent();
                                (0, vitest_1.expect)(pairwiseClientA === null || pairwiseClientA === void 0 ? void 0 : pairwiseClientA.client_id).toBeDefined();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUriB],
                                            application_type: "native",
                                            token_endpoint_auth_method: "client_secret_post",
                                            scope: "openid profile email offline_access",
                                            skip_consent: true,
                                            subject_type: "pairwise",
                                        },
                                    })];
                            case 2:
                                pairwiseClientB = _a.sent();
                                (0, vitest_1.expect)(pairwiseClientB === null || pairwiseClientB === void 0 ? void 0 : pairwiseClientB.client_id).toBeDefined();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUriPublic],
                                            application_type: "native",
                                            token_endpoint_auth_method: "client_secret_post",
                                            scope: "openid profile email offline_access",
                                            skip_consent: true,
                                        },
                                    })];
                            case 3:
                                publicClient = _a.sent();
                                (0, vitest_1.expect)(publicClient === null || publicClient === void 0 ? void 0 : publicClient.client_id).toBeDefined();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUriSameHost],
                                            application_type: "native",
                                            token_endpoint_auth_method: "client_secret_post",
                                            scope: "openid profile email offline_access",
                                            skip_consent: true,
                                            subject_type: "pairwise",
                                        },
                                    })];
                            case 4:
                                sameHostClientA = _a.sent();
                                (0, vitest_1.expect)(sameHostClientA === null || sameHostClientA === void 0 ? void 0 : sameHostClientA.client_id).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should produce different sub across pairwise clients (cross-RP unlinkability)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokensA, tokensB, idTokenA, idTokenB;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA)];
                            case 1:
                                tokensA = _a.sent();
                                return [4 /*yield*/, getTokensForClient(pairwiseClientB, redirectUriB)];
                            case 2:
                                tokensB = _a.sent();
                                idTokenA = (0, jose_1.decodeJwt)(tokensA.data.id_token);
                                idTokenB = (0, jose_1.decodeJwt)(tokensB.data.id_token);
                                (0, vitest_1.expect)(idTokenA.sub).toBeDefined();
                                (0, vitest_1.expect)(idTokenB.sub).toBeDefined();
                                // Different sectors → different pairwise sub
                                (0, vitest_1.expect)(idTokenA.sub).not.toBe(idTokenB.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should produce same sub for same pairwise client (determinism)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens1, tokens2, idToken1, idToken2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA)];
                            case 1:
                                tokens1 = _a.sent();
                                return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA)];
                            case 2:
                                tokens2 = _a.sent();
                                idToken1 = (0, jose_1.decodeJwt)(tokens1.data.id_token);
                                idToken2 = (0, jose_1.decodeJwt)(tokens2.data.id_token);
                                (0, vitest_1.expect)(idToken1.sub).toBe(idToken2.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should return user.id as sub for public client (fallback)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var publicTokens, pairwiseTokens, publicIdToken, pairwiseIdToken;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getTokensForClient(publicClient, redirectUriPublic)];
                            case 1:
                                publicTokens = _a.sent();
                                return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA)];
                            case 2:
                                pairwiseTokens = _a.sent();
                                publicIdToken = (0, jose_1.decodeJwt)(publicTokens.data.id_token);
                                pairwiseIdToken = (0, jose_1.decodeJwt)(pairwiseTokens.data.id_token);
                                (0, vitest_1.expect)(publicIdToken.sub).toBeDefined();
                                // Public sub differs from pairwise sub for same user
                                (0, vitest_1.expect)(publicIdToken.sub).not.toBe(pairwiseIdToken.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should produce same pairwise sub for clients on same host (sector isolation)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokensA, tokensSameHost, idTokenA, idTokenSameHost;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA)];
                            case 1:
                                tokensA = _a.sent();
                                return [4 /*yield*/, getTokensForClient(sameHostClientA, redirectUriSameHost)];
                            case 2:
                                tokensSameHost = _a.sent();
                                idTokenA = (0, jose_1.decodeJwt)(tokensA.data.id_token);
                                idTokenSameHost = (0, jose_1.decodeJwt)(tokensSameHost.data.id_token);
                                // Same host (localhost) → same sector → same pairwise sub
                                (0, vitest_1.expect)(idTokenA.sub).toBe(idTokenSameHost.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should have consistent sub between id_token and userinfo", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, idToken, userinfo;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA)];
                            case 1:
                                tokens = _b.sent();
                                idToken = (0, jose_1.decodeJwt)(tokens.data.id_token);
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        method: "GET",
                                        headers: {
                                            authorization: "Bearer ".concat(tokens.data.access_token),
                                        },
                                    })];
                            case 2:
                                userinfo = _b.sent();
                                (0, vitest_1.expect)((_a = userinfo.data) === null || _a === void 0 ? void 0 : _a.sub).toBe(idToken.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should return pairwise sub in opaque access token introspection", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection, idToken;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA)];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
                                        client_id: pairwiseClientA.client_id,
                                        client_secret: pairwiseClientA.client_secret,
                                        token: tokens.data.access_token,
                                        token_type_hint: "access_token",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                introspection = _c.sent();
                                idToken = (0, jose_1.decodeJwt)(tokens.data.id_token);
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                (0, vitest_1.expect)((_b = introspection.data) === null || _b === void 0 ? void 0 : _b.sub).toBe(idToken.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should preserve pairwise sub after token refresh", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, originalIdToken, refreshBody, refreshResponse, refreshedIdToken;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA)];
                            case 1:
                                tokens = _b.sent();
                                originalIdToken = (0, jose_1.decodeJwt)(tokens.data.id_token);
                                refreshBody = new URLSearchParams({
                                    grant_type: "refresh_token",
                                    client_id: pairwiseClientA.client_id,
                                    client_secret: pairwiseClientA.client_secret,
                                    refresh_token: tokens.data.refresh_token,
                                });
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: refreshBody,
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                refreshResponse = _b.sent();
                                (0, vitest_1.expect)((_a = refreshResponse.data) === null || _a === void 0 ? void 0 : _a.id_token).toBeDefined();
                                refreshedIdToken = (0, jose_1.decodeJwt)(refreshResponse.data.id_token);
                                (0, vitest_1.expect)(refreshedIdToken.sub).toBe(originalIdToken.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should keep user.id in JWT access token sub (not pairwise)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, accessToken, idToken;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getTokensForClient(pairwiseClientA, redirectUriA, {
                                    resource: validResource,
                                })];
                            case 1:
                                tokens = _a.sent();
                                accessToken = (0, jose_1.decodeJwt)(tokens.data.access_token);
                                idToken = (0, jose_1.decodeJwt)(tokens.data.id_token);
                                // JWT access token uses real user.id for user lookup
                                (0, vitest_1.expect)(accessToken.sub).toBeDefined();
                                (0, vitest_1.expect)(accessToken.sub).not.toBe(idToken.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("pairwise DCR validation", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, redirectUri;
    return __generator(this, function (_a) {
        authServerBaseUrl = "http://localhost:3000";
        rpBaseUrl = "http://localhost:5000";
        redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/test");
        (0, vitest_1.it)("should reject pairwise subject_type when pairwiseSecret not configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, auth, signInWithTestUser, headers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                }),
                            ],
                        })];
                    case 1:
                        _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_b.sent()).headers;
                        return [4 /*yield*/, (0, vitest_1.expect)(auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                    subject_type: "pairwise",
                                },
                            })).rejects.toThrow(better_call_1.APIError)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should accept pairwise subject_type when pairwiseSecret is configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, auth, signInWithTestUser, headers, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    pairwiseSecret: "test-secret-for-dcr-test-32chars!",
                                }),
                            ],
                        })];
                    case 1:
                        _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_b.sent()).headers;
                        return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                    subject_type: "pairwise",
                                    skip_consent: true,
                                },
                            })];
                    case 3:
                        response = _b.sent();
                        (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                        (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.subject_type).toBe("pairwise");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should default to public when no subject_type specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, auth, signInWithTestUser, headers, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    pairwiseSecret: "test-secret-for-dcr-test-32chars!",
                                }),
                            ],
                        })];
                    case 1:
                        _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_b.sent()).headers;
                        return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                    skip_consent: true,
                                },
                            })];
                    case 3:
                        response = _b.sent();
                        (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                        (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.subject_type).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should reject pairwise client with redirect_uris on different hosts", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, auth, signInWithTestUser, headers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    pairwiseSecret: "test-secret-for-dcr-test-32chars!",
                                }),
                            ],
                        })];
                    case 1:
                        _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_b.sent()).headers;
                        return [4 /*yield*/, (0, vitest_1.expect)(auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    redirect_uris: [
                                        "https://app-a.example.com/callback",
                                        "https://app-b.example.com/callback",
                                    ],
                                    subject_type: "pairwise",
                                },
                            })).rejects.toThrow(better_call_1.APIError)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should accept pairwise client with redirect_uris on the same host", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, auth, signInWithTestUser, headers, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    pairwiseSecret: "test-secret-for-dcr-test-32chars!",
                                }),
                            ],
                        })];
                    case 1:
                        _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_b.sent()).headers;
                        return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    redirect_uris: [
                                        "https://app.example.com/callback-a",
                                        "https://app.example.com/callback-b",
                                    ],
                                    subject_type: "pairwise",
                                    skip_consent: true,
                                },
                            })];
                    case 3:
                        response = _b.sent();
                        (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                        (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.subject_type).toBe("pairwise");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should round-trip subject_type through DCR", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, signInWithTestUser, customFetchImpl, headers, dcrClient, response;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    pairwiseSecret: "test-secret-for-dcr-test-32chars!",
                                    allowDynamicClientRegistration: true,
                                }),
                            ],
                        })];
                    case 1:
                        _a = _c.sent(), signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_c.sent()).headers;
                        dcrClient = (0, client_1.createAuthClient)({
                            plugins: [(0, client_2.oauthProviderClient)()],
                            baseURL: authServerBaseUrl,
                            fetchOptions: {
                                customFetchImpl: customFetchImpl,
                                headers: headers,
                            },
                        });
                        return [4 /*yield*/, dcrClient.$fetch("/oauth2/register", {
                                method: "POST",
                                body: {
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                    subject_type: "pairwise",
                                    token_endpoint_auth_method: "none",
                                },
                            })];
                    case 3:
                        response = _c.sent();
                        (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.subject_type).toBe("pairwise");
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
/**
 * A custom URI scheme is not bound to the host in its authority, so that host
 * cannot identify a pairwise sector.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#PairwiseAlg
 */
(0, vitest_1.describe)("pairwise with custom-scheme redirect URIs", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, auth, signInWithTestUser, headers, customSchemeRedirect, errorCode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                    baseURL: "http://localhost:3000",
                    plugins: [
                        (0, jwt_1.jwt)(),
                        (0, oauth_1.oauthProvider)({
                            loginPage: "/login",
                            consentPage: "/consent",
                            pairwiseSecret: "test-pairwise-secret-key-32chars!!",
                        }),
                    ],
                })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                customSchemeRedirect = "app://rp.example.com/callback";
                errorCode = function (error) {
                    var _a;
                    return error instanceof better_call_1.APIError
                        ? (_a = error.body) === null || _a === void 0 ? void 0 : _a.error
                        : undefined;
                };
                (0, vitest_1.it)("rejects a pairwise client with a custom-scheme redirect URI that includes a host", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api
                                    .adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [customSchemeRedirect],
                                        application_type: "native",
                                        token_endpoint_auth_method: "none",
                                        subject_type: "pairwise",
                                    },
                                })
                                    .catch(function (e) { return e; })];
                            case 1:
                                error = _a.sent();
                                (0, vitest_1.expect)(errorCode(error)).toBe("invalid_client_metadata");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("accepts the same client without pairwise", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [customSchemeRedirect],
                                        application_type: "native",
                                        token_endpoint_auth_method: "none",
                                    },
                                })];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.client_id).toEqual(vitest_1.expect.any(String));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects moving a pairwise client to a custom-scheme redirect URI with a host", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, error;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: ["https://rp.example.com/callback"],
                                        subject_type: "pairwise",
                                    },
                                })];
                            case 1:
                                client = _a.sent();
                                return [4 /*yield*/, auth.api
                                        .adminUpdateOAuthClient({
                                        headers: headers,
                                        body: {
                                            client_id: client.client_id,
                                            update: {
                                                application_type: "native",
                                                redirect_uris: [customSchemeRedirect],
                                            },
                                        },
                                    })
                                        .catch(function (e) { return e; })];
                            case 2:
                                error = _a.sent();
                                (0, vitest_1.expect)(errorCode(error)).toBe("invalid_client_metadata");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("pairwise configuration validation", function () {
    (0, vitest_1.it)("should reject pairwiseSecret shorter than 32 characters", function () {
        (0, vitest_1.expect)(function () {
            return (0, oauth_1.oauthProvider)({
                loginPage: "/login",
                consentPage: "/consent",
                pairwiseSecret: "too-short",
            });
        }).toThrow("pairwiseSecret must be at least 32 characters");
    });
    (0, vitest_1.it)("should accept pairwiseSecret of 32+ characters", function () {
        (0, vitest_1.expect)(function () {
            return (0, oauth_1.oauthProvider)({
                loginPage: "/login",
                consentPage: "/consent",
                pairwiseSecret: "a-valid-secret-that-is-32-chars!",
            });
        }).not.toThrow();
    });
});
(0, vitest_1.describe)("pairwise metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl;
    return __generator(this, function (_a) {
        authServerBaseUrl = "http://localhost:3000";
        (0, vitest_1.it)("should include pairwise in subject_types_supported when secret configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    pairwiseSecret: "test-pairwise-metadata-secret!!!",
                                }),
                            ],
                        })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata.subject_types_supported).toEqual(["public", "pairwise"]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should only include public when no pairwise secret", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                }),
                            ],
                        })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata.subject_types_supported).toEqual(["public"]);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
