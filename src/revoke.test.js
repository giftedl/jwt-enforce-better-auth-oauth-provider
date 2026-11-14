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
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
(0, vitest_1.describe)("oauth revoke", function () { return __awaiter(void 0, void 0, void 0, function () {
    function createAuthUrl(overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)(__assign({ id: providerId, options: {
                                    clientId: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    clientSecret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                }, redirectURI: "", authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"), state: state, scopes: ["openid", "profile", "email", "offline_access"], codeVerifier: codeVerifier }, overrides))];
                    case 1:
                        url = _a.sent();
                        return [2 /*return*/, {
                                url: url,
                                codeVerifier: codeVerifier,
                            }];
                }
            });
        });
    }
    function validateAuthCode(overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, headers, tokens;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)(__assign(__assign({}, overrides), { redirectURI: redirectUri, options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                } }))];
                    case 1:
                        _a = _b.sent(), body = _a.body, headers = _a.headers;
                        return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: headers,
                            })];
                    case 2:
                        tokens = _b.sent();
                        return [2 /*return*/, tokens];
                }
            });
        });
    }
    function getTokens(overrides, resource) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, authUrl, codeVerifier, callbackRedirectUrl, url;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createAuthUrl(overrides)];
                    case 1:
                        _a = _b.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _b.sent();
                        url = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, validateAuthCode({
                                code: url.searchParams.get("code"),
                                codeVerifier: codeVerifier,
                                resource: resource,
                            })];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, validResource, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri, state;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
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
                                resources: [validResource],
                                enforcePerClientResources: false,
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
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                state = "123";
                // Registers a confidential client application to work with
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
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
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail unauthenticated request", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token,
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _c.sent();
                                (0, vitest_1.expect)((_b = revocation.error) === null || _b === void 0 ? void 0 : _b.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports unsupported_token_type for a jwt access_token with token_type_hint access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens(undefined, validResource)];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token,
                                        token_type_hint: "access_token",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _c.sent();
                                (0, vitest_1.expect)((_b = revocation.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)(revocation.error).toMatchObject({
                                    error: "unsupported_token_type",
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass verification with token_type_hint access_token and sent opaque access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token,
                                        token_type_hint: "access_token",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _b.sent();
                                (0, vitest_1.expect)(revocation.data).toBe(null);
                                (0, vitest_1.expect)(revocation.error).toBe(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail with token_type_hint access_token and sent refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.refresh_token,
                                        token_type_hint: "access_token",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _c.sent();
                                (0, vitest_1.expect)((_b = revocation.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass verification with token_type_hint refresh_token and sent refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.refresh_token,
                                        token_type_hint: "refresh_token",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _b.sent();
                                (0, vitest_1.expect)(revocation.data).toBe(null);
                                (0, vitest_1.expect)(revocation.error).toBe(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail verification with token_type_hint refresh_token and sent access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token,
                                        token_type_hint: "refresh_token",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _c.sent();
                                (0, vitest_1.expect)((_b = revocation.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports unsupported_token_type for a jwt access_token without token_type_hint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens(undefined, validResource)];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token,
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _c.sent();
                                (0, vitest_1.expect)((_b = revocation.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)(revocation.error).toMatchObject({
                                    error: "unsupported_token_type",
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass verification without token_type_hint and sent opaque access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token,
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _b.sent();
                                (0, vitest_1.expect)(revocation.data).toBe(null);
                                (0, vitest_1.expect)(revocation.error).toBe(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass verification without token_type_hint and sent refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, revocation;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.revoke({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.refresh_token,
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revocation = _b.sent();
                                (0, vitest_1.expect)(revocation.data).toBe(null);
                                (0, vitest_1.expect)(revocation.error).toBe(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth revoke - config", function () { return __awaiter(void 0, void 0, void 0, function () {
    function createTestInstance(opts) {
        return __awaiter(this, void 0, void 0, function () {
            var clientCredentialsScopes, _a, auth, customFetchImpl, signInWithTestUser, headers, client, registeredClient;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        clientCredentialsScopes = ((_c = (_b = opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig) === null || _b === void 0 ? void 0 : _b.scopes) !== null && _c !== void 0 ? _c : scopes).filter(function (scope) {
                            return !["openid", "profile", "email", "offline_access"].includes(scope);
                        });
                        return [4 /*yield*/, (0, test_1.getTestInstance)({
                                baseURL: authServerBaseUrl,
                                plugins: __spreadArray([
                                    (0, oauth_1.oauthProvider)(__assign({ loginPage: "/login", consentPage: "/consent", resources: [validResource], enforcePerClientResources: false, scopes: scopes, clientPrivileges: function (_a) {
                                            var action = _a.action;
                                            return action === "create" ||
                                                action === "configure-client-credentials-scopes";
                                        } }, opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig))
                                ], (((_d = opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig) === null || _d === void 0 ? void 0 : _d.disableJwtPlugin)
                                    ? []
                                    : [
                                        (0, jwt_1.jwt)({
                                            jwt: {
                                                issuer: authServerBaseUrl,
                                            },
                                        }),
                                    ]), true),
                            })];
                    case 1:
                        _a = _e.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl, signInWithTestUser = _a.signInWithTestUser;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_e.sent()).headers;
                        client = (0, client_1.createAuthClient)({
                            plugins: [(0, client_2.oauthProviderClient)()],
                            baseURL: authServerBaseUrl,
                            fetchOptions: {
                                customFetchImpl: customFetchImpl,
                                headers: headers,
                            },
                        });
                        return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    grant_types: [
                                        "authorization_code",
                                        "client_credentials",
                                        "refresh_token",
                                    ],
                                    token_endpoint_auth_method: "client_secret_post",
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                    skip_consent: true,
                                    client_credentials_scopes: clientCredentialsScopes,
                                },
                            })];
                    case 3:
                        registeredClient = _e.sent();
                        return [2 /*return*/, {
                                client: client,
                                oauthClient: registeredClient,
                            }];
                }
            });
        });
    }
    function createAuthUrl(oauthClient, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)(__assign({ id: providerId, options: {
                                    clientId: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    clientSecret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                }, redirectURI: "", authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"), state: "123", scopes: ["openid", "profile", "email", "offline_access"], codeVerifier: codeVerifier }, overrides))];
                    case 1:
                        url = _a.sent();
                        return [2 /*return*/, {
                                url: url,
                                codeVerifier: codeVerifier,
                            }];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, validResource, providerId, redirectUri, scopes;
    return __generator(this, function (_a) {
        authServerBaseUrl = "http://localhost:3000";
        rpBaseUrl = "http://localhost:5000";
        validResource = "https://myapi.example.com";
        providerId = "test";
        redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
        scopes = [
            "openid",
            "email",
            "profile",
            "offline_access",
            "read:profile",
        ];
        (0, vitest_1.it)("should pass with the correct opaqueAccessTokenPrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
            var prefix, testScopes, _a, client, oauthClient, tokens, revocation;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        prefix = "hello_";
                        testScopes = ["read:profile"];
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    prefix: {
                                        opaqueAccessToken: prefix,
                                    },
                                    scopes: testScopes,
                                },
                            })];
                    case 1:
                        _a = _f.sent(), client = _a.client, oauthClient = _a.oauthClient;
                        return [4 /*yield*/, client.oauth2.token({
                                grant_type: "client_credentials",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                scope: testScopes.join(" "),
                                redirect_uri: redirectUri,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 2:
                        tokens = _f.sent();
                        (0, vitest_1.expect)((_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) === null || _c === void 0 ? void 0 : _c.startsWith(prefix)).toBeTruthy();
                        return [4 /*yield*/, client.oauth2.revoke({
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                token: (_e = (_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : "",
                                token_type_hint: "access_token",
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 3:
                        revocation = _f.sent();
                        (0, vitest_1.expect)(revocation.data).toBe(null);
                        (0, vitest_1.expect)(revocation.error).toBe(null);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should pass with the correct refreshTokenPrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
            var refreshTokenPrefix, testScopes, _a, client, oauthClient, _b, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, revocation;
            var _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        refreshTokenPrefix = "hello_rt_";
                        testScopes = ["openid", "offline_access"];
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    prefix: {
                                        refreshToken: refreshTokenPrefix,
                                    },
                                    scopes: testScopes,
                                },
                            })];
                    case 1:
                        _a = _g.sent(), client = _a.client, oauthClient = _a.oauthClient;
                        if (!oauthClient)
                            vitest_1.expect.unreachable();
                        return [4 /*yield*/, createAuthUrl(oauthClient, {
                                scopes: testScopes,
                            })];
                    case 2:
                        _b = _g.sent(), authUrl = _b.url, codeVerifier = _b.codeVerifier;
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 3:
                        _g.sent();
                        url = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, client.oauth2.token({
                                grant_type: "authorization_code",
                                code: (_c = url.searchParams.get("code")) !== null && _c !== void 0 ? _c : undefined,
                                code_verifier: codeVerifier,
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                scope: testScopes.join(" "),
                                redirect_uri: redirectUri,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 4:
                        tokens = _g.sent();
                        if ("refresh_token" in ((_d = tokens.data) !== null && _d !== void 0 ? _d : {})) {
                            (0, vitest_1.expect)((_e = tokens.data.refresh_token) === null || _e === void 0 ? void 0 : _e.startsWith(refreshTokenPrefix)).toBeTruthy();
                        }
                        else {
                            vitest_1.expect.unreachable();
                        }
                        return [4 /*yield*/, client.oauth2.revoke({
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                // @ts-expect-error refresh token sent
                                token: (_f = tokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token,
                                token_type_hint: "refresh_token",
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 5:
                        revocation = _g.sent();
                        (0, vitest_1.expect)(revocation.data).toBe(null);
                        (0, vitest_1.expect)(revocation.error).toBe(null);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
