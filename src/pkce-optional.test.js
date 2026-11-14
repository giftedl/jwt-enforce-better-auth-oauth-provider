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
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
/**
 * Resolves a URL that may be relative or absolute
 */
function resolveUrl(url, baseUrl) {
    try {
        // Try to parse as absolute URL first
        return new URL(url);
    }
    catch (_a) {
        // If it fails, resolve as relative URL
        return new URL(url, baseUrl);
    }
}
(0, vitest_1.describe)("PKCE optional - default behavior", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, authenticatedClient, confidentialClient, publicClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "https://rp.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confResponse, pubResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                confResponse = _a.sent();
                                confidentialClient = confResponse;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                            token_endpoint_auth_method: "none",
                                        },
                                    })];
                            case 2:
                                pubResponse = _a.sent();
                                publicClient = pubResponse;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("public client without PKCE should fail", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirect;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", publicClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "123");
                                errorRedirect = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirect = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirect).toContain("error=invalid_request");
                                (0, vitest_1.expect)(errorRedirect).toContain("pkce+is+required+for+public+clients");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("confidential client without PKCE should fail with default settings", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirect;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", confidentialClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "123");
                                errorRedirect = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirect = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirect).toContain("error=invalid_request");
                                (0, vitest_1.expect)(errorRedirect).toContain("pkce+is+required+for+this+client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("confidential client with PKCE should succeed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "123",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        codeVerifier: codeVerifier,
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                    })];
                            case 1:
                                authUrl = _a.sent();
                                callbackUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                (0, vitest_1.expect)(callbackUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackUrl).toContain("state=123");
                                (0, vitest_1.expect)(callbackUrl).not.toContain("error=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("PKCE optional - per-client opt-out", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, authenticatedClient, confidentialClient, publicClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3001";
                rpBaseUrl = "https://rp.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confResponse, pubResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        skip_consent: true,
                                        require_pkce: false,
                                    },
                                })];
                            case 1:
                                confResponse = _a.sent();
                                confidentialClient = confResponse;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                            token_endpoint_auth_method: "none",
                                        },
                                    })];
                            case 2:
                                pubResponse = _a.sent();
                                publicClient = pubResponse;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("public client without PKCE should always fail", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirect;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", publicClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "123");
                                errorRedirect = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirect = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirect).toContain("error=invalid_request");
                                (0, vitest_1.expect)(errorRedirect).toContain("pkce+is+required+for+public+clients");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("confidential client without PKCE should succeed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, callbackUrl, url, code, _a, body, headers, tokenResponse;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", confidentialClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "123");
                                callbackUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _d.sent();
                                (0, vitest_1.expect)(callbackUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackUrl).not.toContain("code_challenge=");
                                (0, vitest_1.expect)(callbackUrl).toContain("state=123");
                                (0, vitest_1.expect)(callbackUrl).not.toContain("error=");
                                url = resolveUrl(callbackUrl, authServerBaseUrl);
                                code = url.searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 2:
                                _a = _d.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, authenticatedClient.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                tokenResponse = _d.sent();
                                (0, vitest_1.expect)((_b = tokenResponse.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokenResponse.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("PKCE optional - dynamic client registration policy", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, signInWithTestUser, customFetchImpl, headers, authenticatedClient, unauthenticatedClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3005";
                rpBaseUrl = "https://rp.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                allowUnauthenticatedClientRegistration: true,
                                clientRegistrationRequirePKCE: false,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                unauthenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                /**
                 * @see https://github.com/better-auth/better-auth/issues/8588
                 */
                (0, vitest_1.it)("confidential DCR client without PKCE should succeed when registration policy disables PKCE", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var registration, clientId, clientSecret, state, authUrl, consentRedirectUrl, consentResponse, code, _a, tokenBody, tokenHeaders, tokenResponse, tokens;
                    var _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                })];
                            case 1:
                                registration = _f.sent();
                                (0, vitest_1.expect)((_b = registration.data) === null || _b === void 0 ? void 0 : _b.client_id).toBeDefined();
                                (0, vitest_1.expect)((_c = registration.data) === null || _c === void 0 ? void 0 : _c.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_d = registration.data) === null || _d === void 0 ? void 0 : _d.token_endpoint_auth_method).toBe("client_secret_basic");
                                (0, vitest_1.expect)((_e = registration.data) === null || _e === void 0 ? void 0 : _e.require_pkce).toBe(false);
                                clientId = registration.data.client_id;
                                clientSecret = registration.data.client_secret;
                                state = "dcr-no-pkce";
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", clientId);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", state);
                                consentRedirectUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            consentRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _f.sent();
                                (0, vitest_1.expect)(consentRedirectUrl).toContain("/consent");
                                (0, vitest_1.expect)(consentRedirectUrl).not.toContain("error=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRedirectUrl, authServerBaseUrl).search,
                                    },
                                });
                                return [4 /*yield*/, (function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, , 2, 3]);
                                                    return [4 /*yield*/, authenticatedClient.oauth2.consent({ accept: true }, { headers: headers, throw: true })];
                                                case 1: return [2 /*return*/, _a.sent()];
                                                case 2:
                                                    vitest_1.vi.unstubAllGlobals();
                                                    return [7 /*endfinally*/];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); })()];
                            case 3:
                                consentResponse = _f.sent();
                                (0, vitest_1.expect)(consentResponse.url).toContain("code=");
                                (0, vitest_1.expect)(consentResponse.url).toContain("state=".concat(state));
                                code = new URL(consentResponse.url).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        redirectURI: redirectUri,
                                        authentication: "basic",
                                        options: {
                                            clientId: clientId,
                                            clientSecret: clientSecret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 4:
                                _a = _f.sent(), tokenBody = _a.body, tokenHeaders = _a.headers;
                                return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/token"), {
                                        method: "POST",
                                        body: tokenBody.toString(),
                                        headers: tokenHeaders,
                                    })];
                            case 5:
                                tokenResponse = _f.sent();
                                return [4 /*yield*/, tokenResponse.json()];
                            case 6:
                                tokens = _f.sent();
                                (0, vitest_1.expect)(tokenResponse.status).toBe(200);
                                (0, vitest_1.expect)(tokens.access_token).toBeDefined();
                                (0, vitest_1.expect)(tokens.id_token).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("public DCR client without PKCE should still fail", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var registration, authUrl, errorRedirect;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                })];
                            case 1:
                                registration = _c.sent();
                                (0, vitest_1.expect)((_a = registration.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = registration.data) === null || _b === void 0 ? void 0 : _b.token_endpoint_auth_method).toBe("none");
                                (0, vitest_1.expect)(registration.data).not.toHaveProperty("public");
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", registration.data.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "public-dcr-no-pkce");
                                errorRedirect = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirect = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _c.sent();
                                (0, vitest_1.expect)(errorRedirect).toContain("error=invalid_request");
                                (0, vitest_1.expect)(errorRedirect).toContain("pkce+is+required+for+public+clients");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("PKCE optional - offline_access scope", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, authenticatedClient, confidentialClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3002";
                rpBaseUrl = "https://rp.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        skip_consent: true,
                                        require_pkce: false, // Explicitly optional
                                    },
                                })];
                            case 1:
                                confResponse = _a.sent();
                                confidentialClient = confResponse;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("offline_access without PKCE or OIDC nonce should fail even with requirePKCE: false", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirect;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", confidentialClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid offline_access");
                                authUrl.searchParams.set("state", "123");
                                errorRedirect = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirect = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirect).toContain("error=invalid_request");
                                (0, vitest_1.expect)(errorRedirect).toContain("pkce+or+OIDC+nonce+is+required+when+requesting+offline_access+scope");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("offline_access without PKCE should succeed for confidential OIDC requests with nonce", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var nonce, authUrl, callbackUrl, url, code, _a, body, headers, tokenResponse;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                nonce = "offline-access-nonce";
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "123",
                                        scopes: ["openid", "offline_access"],
                                        responseType: "code",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        nonce: nonce,
                                    })];
                            case 1:
                                authUrl = _e.sent();
                                callbackUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _e.sent();
                                (0, vitest_1.expect)(callbackUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackUrl).not.toContain("error=");
                                url = resolveUrl(callbackUrl, authServerBaseUrl);
                                code = url.searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 3:
                                _a = _e.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, authenticatedClient.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 4:
                                tokenResponse = _e.sent();
                                (0, vitest_1.expect)((_b = tokenResponse.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokenResponse.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokenResponse.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((0, jose_1.decodeJwt)(tokenResponse.data.id_token).nonce).toBe(nonce);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("offline_access without PKCE should fail for non-OIDC requests with nonce", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirect;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                    id: providerId,
                                    options: {
                                        clientId: confidentialClient.client_id,
                                        clientSecret: confidentialClient.client_secret,
                                    },
                                    redirectURI: redirectUri,
                                    state: "123",
                                    scopes: ["offline_access"],
                                    responseType: "code",
                                    authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                    nonce: "unused-without-openid",
                                })];
                            case 1:
                                authUrl = _a.sent();
                                errorRedirect = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirect = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirect).toContain("error=invalid_request");
                                (0, vitest_1.expect)(errorRedirect).toContain("pkce+or+OIDC+nonce+is+required+when+requesting+offline_access+scope");
                                (0, vitest_1.expect)(errorRedirect).not.toContain("code=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("offline_access with PKCE should succeed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackUrl, url, code, _a, body, headers, tokenResponse;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "123",
                                        scopes: ["openid", "offline_access"],
                                        responseType: "code",
                                        codeVerifier: codeVerifier,
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                    })];
                            case 1:
                                authUrl = _d.sent();
                                callbackUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _d.sent();
                                (0, vitest_1.expect)(callbackUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackUrl).not.toContain("error=");
                                url = resolveUrl(callbackUrl, authServerBaseUrl);
                                code = url.searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        redirectURI: redirectUri,
                                        codeVerifier: codeVerifier,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 3:
                                _a = _d.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, authenticatedClient.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 4:
                                tokenResponse = _d.sent();
                                (0, vitest_1.expect)((_b = tokenResponse.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokenResponse.data) === null || _c === void 0 ? void 0 : _c.refresh_token).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/issues/11723
 */
(0, vitest_1.describe)("PKCE optional - consistency checks", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, authenticatedClient, confidentialClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3003";
                rpBaseUrl = "https://rp.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        skip_consent: true,
                                        require_pkce: false,
                                    },
                                })];
                            case 1:
                                confResponse = _a.sent();
                                confidentialClient = confResponse;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("PKCE in auth but not in token should fail", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackUrl, url, code, _a, body, headers, tokenResponse;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "123",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        codeVerifier: codeVerifier,
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                    })];
                            case 1:
                                authUrl = _b.sent();
                                callbackUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _b.sent();
                                url = resolveUrl(callbackUrl, authServerBaseUrl);
                                code = url.searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        redirectURI: redirectUri,
                                        // Intentionally omit codeVerifier
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 3:
                                _a = _b.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, authenticatedClient.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                        onError: function (context) {
                                            (0, vitest_1.expect)(context.response.status).toBe(400);
                                        },
                                    })];
                            case 4:
                                tokenResponse = _b.sent();
                                (0, vitest_1.expect)(tokenResponse.error).toBeDefined();
                                (0, vitest_1.expect)(tokenResponse.error.error).toBe("invalid_request");
                                (0, vitest_1.expect)(tokenResponse.error.error_description).toContain("code_verifier required because PKCE was used in authorization");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("PKCE not in auth but in token should fail", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, callbackUrl, url, code, wrongCodeVerifier, _a, body, headers, tokenResponse;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", confidentialClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "123");
                                callbackUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _b.sent();
                                url = resolveUrl(callbackUrl, authServerBaseUrl);
                                code = url.searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeDefined();
                                wrongCodeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        redirectURI: redirectUri,
                                        codeVerifier: wrongCodeVerifier,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 2:
                                _a = _b.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, authenticatedClient.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                        onError: function (context) {
                                            (0, vitest_1.expect)(context.response.status).toBe(400);
                                        },
                                    })];
                            case 3:
                                tokenResponse = _b.sent();
                                (0, vitest_1.expect)(tokenResponse.error).toBeDefined();
                                (0, vitest_1.expect)(tokenResponse.error.error).toBe("invalid_request");
                                (0, vitest_1.expect)(tokenResponse.error.error_description).toContain("code_verifier provided but PKCE was not used in authorization");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/rfc7636#section-4.6
                 */
                (0, vitest_1.it)("mismatched PKCE challenge should fail", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackUrl, url, code, wrongVerifier, _a, body, headers, tokenResponse;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "123",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        codeVerifier: codeVerifier,
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                    })];
                            case 1:
                                authUrl = _b.sent();
                                callbackUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _b.sent();
                                url = resolveUrl(callbackUrl, authServerBaseUrl);
                                code = url.searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeDefined();
                                wrongVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        redirectURI: redirectUri,
                                        codeVerifier: wrongVerifier,
                                        options: {
                                            clientId: confidentialClient.client_id,
                                            clientSecret: confidentialClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 3:
                                _a = _b.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, authenticatedClient.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                        onError: function (context) {
                                            (0, vitest_1.expect)(context.response.status).toBe(400);
                                        },
                                    })];
                            case 4:
                                tokenResponse = _b.sent();
                                (0, vitest_1.expect)(tokenResponse.error).toBeDefined();
                                (0, vitest_1.expect)(tokenResponse.error.error).toBe("invalid_grant");
                                (0, vitest_1.expect)(tokenResponse.error.error_description).toContain("code verification failed");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("PKCE optional - registration restrictions", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, authenticatedClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3004";
                rpBaseUrl = "https://rp.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                (0, vitest_1.it)("admin create endpoint should persist require_pkce", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var pkceDisabledClient, pkceRequiredClient;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        require_pkce: false,
                                    },
                                })];
                            case 1:
                                pkceDisabledClient = _a.sent();
                                (0, vitest_1.expect)(pkceDisabledClient.require_pkce).toBe(false);
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            require_pkce: true,
                                        },
                                    })];
                            case 2:
                                pkceRequiredClient = _a.sent();
                                (0, vitest_1.expect)(pkceRequiredClient.require_pkce).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    ["dynamic registration", "/oauth2/register"],
                    ["non-admin create-client", "/oauth2/create-client"],
                ])("should ignore require_pkce false (%s)", function (_, endpoint) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, authUrl, errorRedirect;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, authenticatedClient.$fetch(endpoint, {
                                    method: "POST",
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        require_pkce: false,
                                    },
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.require_pkce).not.toBe(true);
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", response.data.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "123");
                                errorRedirect = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirect = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _c.sent();
                                (0, vitest_1.expect)(errorRedirect).toContain("error=invalid_request");
                                (0, vitest_1.expect)(errorRedirect).toContain("pkce+is+required+for+this+client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
