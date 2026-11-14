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
(0, vitest_1.describe)("oauth introspect", function () { return __awaiter(void 0, void 0, void 0, function () {
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
    function getTokens(overrides, authCodeOverrides, authorizeHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, authUrl, codeVerifier, callbackRedirectUrl, url;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createAuthUrl(overrides)];
                    case 1:
                        _a = _b.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                headers: authorizeHeaders !== null && authorizeHeaders !== void 0 ? authorizeHeaders : headers,
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _b.sent();
                        url = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, validateAuthCode(__assign(__assign({}, authCodeOverrides), { code: url.searchParams.get("code"), codeVerifier: codeVerifier }))];
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
                                        scope: "openid profile email offline_access",
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
                (0, vitest_1.it)("should fail unauthenticated request - no client_id or client_secret", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
                                        token: (_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token,
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                introspection = _c.sent();
                                (0, vitest_1.expect)((_b = introspection.error) === null || _b === void 0 ? void 0 : _b.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass with token_type_hint access_token and sent jwt access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens(undefined, {
                                    resource: validResource,
                                })];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toMatchObject({
                                    active: true,
                                    client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    scope: "openid profile email offline_access",
                                    sub: vitest_1.expect.any(String),
                                    iss: authServerBaseUrl,
                                    exp: vitest_1.expect.any(Number),
                                    iat: vitest_1.expect.any(Number),
                                    sid: vitest_1.expect.any(String),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass with token_type_hint access_token and sent opaque access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toMatchObject({
                                    active: true,
                                    client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    scope: "openid profile email offline_access",
                                    sub: vitest_1.expect.any(String),
                                    iss: authServerBaseUrl,
                                    exp: vitest_1.expect.any(Number),
                                    iat: vitest_1.expect.any(Number),
                                    sid: vitest_1.expect.any(String),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail with token_type_hint access_token and sent refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toEqual({ active: false });
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/9949
                 */
                (0, vitest_1.it)("should return inactive for an unknown access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var introspection;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client.oauth2.introspect({
                                    client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                    token: "this-is-not-a-valid-access-token",
                                    token_type_hint: "access_token",
                                }, {
                                    headers: {
                                        accept: "application/json",
                                        "content-type": "application/x-www-form-urlencoded",
                                    },
                                })];
                            case 1:
                                introspection = _a.sent();
                                (0, vitest_1.expect)(introspection.data).toEqual({ active: false });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass with token_type_hint refresh_token and sent refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toMatchObject({
                                    active: true,
                                    client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    scope: "openid profile email offline_access",
                                    sub: vitest_1.expect.any(String),
                                    iss: authServerBaseUrl,
                                    exp: vitest_1.expect.any(Number),
                                    iat: vitest_1.expect.any(Number),
                                    sid: vitest_1.expect.any(String),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail with token_type_hint refresh_token and sent access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                                introspection = _c.sent();
                                (0, vitest_1.expect)((_b = introspection.data) === null || _b === void 0 ? void 0 : _b.active).toBeFalsy();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass without token_type_hint and sent jwt access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens(undefined, {
                                    resource: validResource,
                                })];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toMatchObject({
                                    active: true,
                                    client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    scope: "openid profile email offline_access",
                                    sub: vitest_1.expect.any(String),
                                    iss: authServerBaseUrl,
                                    exp: vitest_1.expect.any(Number),
                                    iat: vitest_1.expect.any(Number),
                                    sid: vitest_1.expect.any(String),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should read the signing keys once across repeated jwt introspections", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, ctx, findMany, i, introspection, jwksReads;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens(undefined, {
                                    resource: validResource,
                                })];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                ctx = _b.sent();
                                findMany = vitest_1.vi.spyOn(ctx.adapter, "findMany");
                                // Shift only Date past the JWKS cache TTL so any entry cached by earlier
                                // introspections is stale and exactly one fresh read is expected.
                                vitest_1.vi.useFakeTimers({ toFake: ["Date"], now: Date.now() + 6 * 60 * 1000 });
                                _b.label = 3;
                            case 3:
                                _b.trys.push([3, , 8, 9]);
                                i = 0;
                                _b.label = 4;
                            case 4:
                                if (!(i < 2)) return [3 /*break*/, 7];
                                return [4 /*yield*/, client.oauth2.introspect({
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
                            case 5:
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toMatchObject({ active: true });
                                _b.label = 6;
                            case 6:
                                i++;
                                return [3 /*break*/, 4];
                            case 7:
                                jwksReads = findMany.mock.calls.filter(function (_a) {
                                    var args = _a[0];
                                    return args.model === "jwks";
                                });
                                (0, vitest_1.expect)(jwksReads).toHaveLength(1);
                                return [3 /*break*/, 9];
                            case 8:
                                vitest_1.vi.useRealTimers();
                                findMany.mockRestore();
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass without token_type_hint and sent opaque access_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toMatchObject({
                                    active: true,
                                    client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    scope: "openid profile email offline_access",
                                    sub: vitest_1.expect.any(String),
                                    iss: authServerBaseUrl,
                                    exp: vitest_1.expect.any(Number),
                                    iat: vitest_1.expect.any(Number),
                                    sid: vitest_1.expect.any(String),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass without token_type_hint and sent refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toMatchObject({
                                    active: true,
                                    client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    scope: "openid profile email offline_access",
                                    sub: vitest_1.expect.any(String),
                                    iss: authServerBaseUrl,
                                    exp: vitest_1.expect.any(Number),
                                    iat: vitest_1.expect.any(Number),
                                    sid: vitest_1.expect.any(String),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports opaque access_token as inactive after the user signs out", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var testHeaders, tokens, signOut, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                testHeaders = (_b.sent()).headers;
                                return [4 /*yield*/, getTokens(undefined, undefined, testHeaders)];
                            case 2:
                                tokens = _b.sent();
                                return [4 /*yield*/, auth.api.signOut({
                                        headers: testHeaders,
                                    })];
                            case 3:
                                signOut = _b.sent();
                                (0, vitest_1.expect)(signOut.success).toBe(true);
                                return [4 /*yield*/, client.oauth2.introspect({
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
                            case 4:
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toEqual({ active: false });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports opaque access_token as inactive when its bound session has expired, without a revoked flag", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var testHeaders, session, sessionId, tokens, ctx, rows, _i, rows_1, r, introspection;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                testHeaders = (_c.sent()).headers;
                                return [4 /*yield*/, auth.api.getSession({ headers: testHeaders })];
                            case 2:
                                session = _c.sent();
                                sessionId = session.session.id;
                                return [4 /*yield*/, getTokens(undefined, undefined, testHeaders)];
                            case 3:
                                tokens = _c.sent();
                                return [4 /*yield*/, auth.$context];
                            case 4:
                                ctx = _c.sent();
                                return [4 /*yield*/, ctx.adapter.update({
                                        model: "session",
                                        where: [{ field: "id", value: sessionId }],
                                        update: { expiresAt: new Date(Date.now() - 60000) },
                                    })];
                            case 5:
                                _c.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "sessionId", value: sessionId }],
                                    })];
                            case 6:
                                rows = _c.sent();
                                (0, vitest_1.expect)(rows.length).toBeGreaterThan(0);
                                for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                    r = rows_1[_i];
                                    (0, vitest_1.expect)((_a = r.revoked) !== null && _a !== void 0 ? _a : null).toBeNull();
                                }
                                return [4 /*yield*/, client.oauth2.introspect({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token,
                                        token_type_hint: "access_token",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 7:
                                introspection = _c.sent();
                                (0, vitest_1.expect)(introspection.data).toEqual({ active: false });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports opaque access_token as inactive when the revoked flag is set while the session is live", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var testHeaders, session, sessionId, tokens, ctx, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                testHeaders = (_b.sent()).headers;
                                return [4 /*yield*/, auth.api.getSession({ headers: testHeaders })];
                            case 2:
                                session = _b.sent();
                                sessionId = session.session.id;
                                return [4 /*yield*/, getTokens(undefined, undefined, testHeaders)];
                            case 3:
                                tokens = _b.sent();
                                return [4 /*yield*/, auth.$context];
                            case 4:
                                ctx = _b.sent();
                                return [4 /*yield*/, ctx.adapter.updateMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "sessionId", value: sessionId }],
                                        update: { revoked: new Date() },
                                    })];
                            case 5:
                                _b.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
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
                            case 6:
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toEqual({ active: false });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports jwt access_token as inactive after the user signs out", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var testHeaders, tokens, signOut, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                testHeaders = (_b.sent()).headers;
                                return [4 /*yield*/, getTokens(undefined, {
                                        resource: validResource,
                                    }, testHeaders)];
                            case 2:
                                tokens = _b.sent();
                                return [4 /*yield*/, auth.api.signOut({
                                        headers: testHeaders,
                                    })];
                            case 3:
                                signOut = _b.sent();
                                (0, vitest_1.expect)(signOut.success).toBe(true);
                                return [4 /*yield*/, client.oauth2.introspect({
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
                            case 4:
                                introspection = _b.sent();
                                (0, vitest_1.expect)(introspection.data).toEqual({ active: false });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass refresh_token introspection with logged out user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var testHeaders, tokens, signOut, introspection;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                testHeaders = (_c.sent()).headers;
                                return [4 /*yield*/, getTokens(undefined, undefined, testHeaders)];
                            case 2:
                                tokens = _c.sent();
                                return [4 /*yield*/, auth.api.signOut({
                                        headers: testHeaders,
                                    })];
                            case 3:
                                signOut = _c.sent();
                                (0, vitest_1.expect)(signOut.success).toBe(true);
                                return [4 /*yield*/, client.oauth2.introspect({
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
                            case 4:
                                introspection = _c.sent();
                                (0, vitest_1.expect)(introspection.data).toMatchObject({
                                    active: true,
                                    client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                    scope: "openid profile email offline_access",
                                    sub: vitest_1.expect.any(String),
                                    iss: authServerBaseUrl,
                                    exp: vitest_1.expect.any(Number),
                                    iat: vitest_1.expect.any(Number),
                                });
                                (0, vitest_1.expect)((_b = introspection.data) === null || _b === void 0 ? void 0 : _b.sid).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth introspect - config", function () { return __awaiter(void 0, void 0, void 0, function () {
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
            var prefix, testScopes, _a, client, oauthClient, tokens, introspection;
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
                        return [4 /*yield*/, client.oauth2.introspect({
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
                        introspection = _f.sent();
                        (0, vitest_1.expect)(introspection.data).toMatchObject({
                            active: true,
                            client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                            scope: testScopes.join(" "),
                            iss: authServerBaseUrl,
                            exp: vitest_1.expect.any(Number),
                            iat: vitest_1.expect.any(Number),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should pass with the correct refreshTokenPrefix", function () { return __awaiter(void 0, void 0, void 0, function () {
            var refreshTokenPrefix, testScopes, _a, client, oauthClient, _b, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, introspection;
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
                        return [4 /*yield*/, client.oauth2.introspect({
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
                        introspection = _g.sent();
                        (0, vitest_1.expect)(introspection.data).toMatchObject({
                            active: true,
                            client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                            scope: testScopes.join(" "),
                            iss: authServerBaseUrl,
                            sub: vitest_1.expect.any(String),
                            exp: vitest_1.expect.any(Number),
                            iat: vitest_1.expect.any(Number),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should include aud in opaque access token introspection response", function () { return __awaiter(void 0, void 0, void 0, function () {
            var testScopes, _a, client, oauthClient, _b, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, introspection;
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        testScopes = ["openid", "profile", "email", "offline_access"];
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    disableJwtPlugin: true,
                                    scopes: testScopes,
                                },
                            })];
                    case 1:
                        _a = _f.sent(), client = _a.client, oauthClient = _a.oauthClient;
                        if (!oauthClient)
                            vitest_1.expect.unreachable();
                        return [4 /*yield*/, createAuthUrl(oauthClient, {
                                scopes: testScopes,
                            })];
                    case 2:
                        _b = _f.sent(), authUrl = _b.url, codeVerifier = _b.codeVerifier;
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 3:
                        _f.sent();
                        url = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, client.oauth2.token({
                                grant_type: "authorization_code",
                                code: (_c = url.searchParams.get("code")) !== null && _c !== void 0 ? _c : undefined,
                                code_verifier: codeVerifier,
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                scope: testScopes.join(" "),
                                resource: validResource,
                                redirect_uri: redirectUri,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 4:
                        tokens = _f.sent();
                        return [4 /*yield*/, client.oauth2.introspect({
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
                    case 5:
                        introspection = _f.sent();
                        (0, vitest_1.expect)(introspection.data).toMatchObject({
                            active: true,
                            client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                            aud: [validResource, "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo")],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should pass resources to customAccessTokenClaims for jwt and opaque introspection", function () { return __awaiter(void 0, void 0, void 0, function () {
            var testScopes, customAccessTokenClaims, jwtInstance, _a, jwtAuthUrl, jwtCodeVerifier, jwtCallbackRedirectUrl, jwtCallbackUrl, jwtTokens, jwtIntrospection, opaqueInstance, _b, opaqueAuthUrl, opaqueCodeVerifier, opaqueCallbackRedirectUrl, opaqueCallbackUrl, opaqueTokens, opaqueIntrospection;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        testScopes = ["openid", "profile", "email", "offline_access"];
                        customAccessTokenClaims = function (_a) {
                            var _b;
                            var resources = _a.resources;
                            return ({
                                resource_count: (_b = resources === null || resources === void 0 ? void 0 : resources.length) !== null && _b !== void 0 ? _b : 0,
                                first_resource: resources === null || resources === void 0 ? void 0 : resources[0],
                            });
                        };
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    scopes: testScopes,
                                    customAccessTokenClaims: customAccessTokenClaims,
                                },
                            })];
                    case 1:
                        jwtInstance = _s.sent();
                        if (!jwtInstance.oauthClient)
                            vitest_1.expect.unreachable();
                        return [4 /*yield*/, createAuthUrl(jwtInstance.oauthClient, {
                                scopes: testScopes,
                            })];
                    case 2:
                        _a = _s.sent(), jwtAuthUrl = _a.url, jwtCodeVerifier = _a.codeVerifier;
                        jwtCallbackRedirectUrl = "";
                        return [4 /*yield*/, jwtInstance.client.$fetch(jwtAuthUrl.toString(), {
                                onError: function (context) {
                                    jwtCallbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 3:
                        _s.sent();
                        jwtCallbackUrl = new URL(jwtCallbackRedirectUrl);
                        return [4 /*yield*/, jwtInstance.client.oauth2.token({
                                grant_type: "authorization_code",
                                code: (_c = jwtCallbackUrl.searchParams.get("code")) !== null && _c !== void 0 ? _c : undefined,
                                code_verifier: jwtCodeVerifier,
                                client_id: (_d = jwtInstance.oauthClient) === null || _d === void 0 ? void 0 : _d.client_id,
                                client_secret: (_e = jwtInstance.oauthClient) === null || _e === void 0 ? void 0 : _e.client_secret,
                                scope: testScopes.join(" "),
                                resource: validResource,
                                redirect_uri: redirectUri,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 4:
                        jwtTokens = _s.sent();
                        return [4 /*yield*/, jwtInstance.client.oauth2.introspect({
                                client_id: (_f = jwtInstance.oauthClient) === null || _f === void 0 ? void 0 : _f.client_id,
                                client_secret: (_g = jwtInstance.oauthClient) === null || _g === void 0 ? void 0 : _g.client_secret,
                                token: (_j = (_h = jwtTokens.data) === null || _h === void 0 ? void 0 : _h.access_token) !== null && _j !== void 0 ? _j : "",
                                token_type_hint: "access_token",
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 5:
                        jwtIntrospection = _s.sent();
                        (0, vitest_1.expect)(jwtIntrospection.data).toMatchObject({
                            active: true,
                            resource_count: 1,
                            first_resource: validResource,
                        });
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    disableJwtPlugin: true,
                                    scopes: testScopes,
                                    customAccessTokenClaims: customAccessTokenClaims,
                                },
                            })];
                    case 6:
                        opaqueInstance = _s.sent();
                        if (!opaqueInstance.oauthClient)
                            vitest_1.expect.unreachable();
                        return [4 /*yield*/, createAuthUrl(opaqueInstance.oauthClient, {
                                scopes: testScopes,
                            })];
                    case 7:
                        _b = _s.sent(), opaqueAuthUrl = _b.url, opaqueCodeVerifier = _b.codeVerifier;
                        opaqueCallbackRedirectUrl = "";
                        return [4 /*yield*/, opaqueInstance.client.$fetch(opaqueAuthUrl.toString(), {
                                onError: function (context) {
                                    opaqueCallbackRedirectUrl =
                                        context.response.headers.get("Location") || "";
                                },
                            })];
                    case 8:
                        _s.sent();
                        opaqueCallbackUrl = new URL(opaqueCallbackRedirectUrl);
                        return [4 /*yield*/, opaqueInstance.client.oauth2.token({
                                grant_type: "authorization_code",
                                code: (_k = opaqueCallbackUrl.searchParams.get("code")) !== null && _k !== void 0 ? _k : undefined,
                                code_verifier: opaqueCodeVerifier,
                                client_id: (_l = opaqueInstance.oauthClient) === null || _l === void 0 ? void 0 : _l.client_id,
                                client_secret: (_m = opaqueInstance.oauthClient) === null || _m === void 0 ? void 0 : _m.client_secret,
                                scope: testScopes.join(" "),
                                resource: validResource,
                                redirect_uri: redirectUri,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 9:
                        opaqueTokens = _s.sent();
                        return [4 /*yield*/, opaqueInstance.client.oauth2.introspect({
                                client_id: (_o = opaqueInstance.oauthClient) === null || _o === void 0 ? void 0 : _o.client_id,
                                client_secret: (_p = opaqueInstance.oauthClient) === null || _p === void 0 ? void 0 : _p.client_secret,
                                token: (_r = (_q = opaqueTokens.data) === null || _q === void 0 ? void 0 : _q.access_token) !== null && _r !== void 0 ? _r : "",
                                token_type_hint: "access_token",
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 10:
                        opaqueIntrospection = _s.sent();
                        (0, vitest_1.expect)(opaqueIntrospection.data).toMatchObject({
                            active: true,
                            resource_count: 1,
                            first_resource: validResource,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
(0, vitest_1.describe)("oauth introspect - rejects non-OAuth same-issuer JWTs", function () { return __awaiter(void 0, void 0, void 0, function () {
    function getOAuthJwtAccessToken() {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, authUrl, callbackRedirectUrl, code, _a, body, tokenHeaders, tokens;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                id: providerId,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                redirectURI: "",
                                authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                state: "123",
                                scopes: ["openid", "profile", "email", "offline_access"],
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        authUrl = _c.sent();
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                headers: headers,
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _c.sent();
                        code = new URL(callbackRedirectUrl).searchParams.get("code");
                        return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                code: code,
                                codeVerifier: codeVerifier,
                                redirectURI: redirectUri,
                                // resource makes this a JWT access token with aud = authServerBaseUrl
                                resource: authServerBaseUrl,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                            })];
                    case 3:
                        _a = _c.sent(), body = _a.body, tokenHeaders = _a.headers;
                        return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: tokenHeaders })];
                    case 4:
                        tokens = _c.sent();
                        return [2 /*return*/, (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token];
                }
            });
        });
    }
    function introspect(token) {
        return client.oauth2.introspect({
            client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
            client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
            token: token,
            token_type_hint: "access_token",
        }, {
            headers: {
                accept: "application/json",
                "content-type": "application/x-www-form-urlencoded",
            },
        });
    }
    var authServerBaseUrl, rpBaseUrl, providerId, redirectUri, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)({
                                jwt: {
                                    issuer: authServerBaseUrl,
                                    audience: authServerBaseUrl,
                                },
                            }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                resources: [authServerBaseUrl],
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
                oauthClient = null;
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        scope: "openid profile email offline_access",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                oauthClient = _a.sent();
                                (0, vitest_1.expect)(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Positive control: a real OAuth JWT access token (with azp + matching aud)
                // is active in this exact config, proving the iss/aud checks pass here — so
                // the session-token rejection below can only be due to the missing azp.
                (0, vitest_1.it)("treats a real OAuth JWT access token as active", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var accessToken, introspection;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getOAuthJwtAccessToken()];
                            case 1:
                                accessToken = _c.sent();
                                return [4 /*yield*/, introspect(accessToken)];
                            case 2:
                                introspection = _c.sent();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                (0, vitest_1.expect)((_b = introspection.data) === null || _b === void 0 ? void 0 : _b.client_id).toBe(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * A JWT-plugin session token shares the issuer, `aud` verifier value, and
                 * signing keys but has no `azp`/client binding and was never issued through
                 * the OAuth token endpoint. It must not introspect as an active access token.
                 */
                (0, vitest_1.it)("rejects a JWT plugin session token presented as an access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sessionJwt, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, auth.api.getToken({ headers: headers })];
                            case 1:
                                sessionJwt = (_b.sent()).token;
                                // Sanity: it is a real, signed JWS (three segments).
                                (0, vitest_1.expect)(sessionJwt.split(".")).toHaveLength(3);
                                return [4 /*yield*/, introspect(sessionJwt)];
                            case 2:
                                introspection = _b.sent();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * Forced introspection skips the local JWT check, so the resource server's
                 * `typ` check cannot apply. The `azp` gate in introspection is what keeps a
                 * session JWT from passing as an access token.
                 *
                 * @see https://datatracker.ietf.org/doc/html/rfc9068#section-4
                 */
                (0, vitest_1.describe)("resource server verification with the RFC 9068 typ check", function () {
                    (0, vitest_1.beforeEach)(function () {
                        var networkFetch = globalThis.fetch.bind(globalThis);
                        vitest_1.vi.stubGlobal("fetch", function (input, init) {
                            var requestedUrl = typeof input === "string"
                                ? input
                                : input instanceof URL
                                    ? input.href
                                    : input.url;
                            return requestedUrl.startsWith(authServerBaseUrl)
                                ? customFetchImpl(input, init)
                                : networkFetch(input, init);
                        });
                    });
                    (0, vitest_1.afterEach)(function () {
                        vitest_1.vi.unstubAllGlobals();
                    });
                    function verifyByIntrospection(token) {
                        return (0, oauth2_1.verifyAccessTokenRequest)({
                            authorizationHeader: "Bearer ".concat(token),
                            method: "GET",
                            url: authServerBaseUrl,
                        }, {
                            verifyOptions: {
                                issuer: authServerBaseUrl,
                                audience: authServerBaseUrl,
                                typ: "at+jwt",
                            },
                            remoteVerify: {
                                introspectUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/introspect"),
                                clientId: oauthClient.client_id,
                                clientSecret: oauthClient.client_secret,
                                force: true,
                            },
                        });
                    }
                    (0, vitest_1.it)("accepts a real OAuth JWT access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var accessToken;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getOAuthJwtAccessToken()];
                                case 1:
                                    accessToken = _a.sent();
                                    return [4 /*yield*/, (0, vitest_1.expect)(verifyByIntrospection(accessToken)).resolves.toMatchObject({
                                            active: true,
                                            client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("rejects a JWT plugin session token", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var sessionJwt;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, auth.api.getToken({ headers: headers })];
                                case 1:
                                    sessionJwt = (_a.sent()).token;
                                    return [4 /*yield*/, (0, vitest_1.expect)(verifyByIntrospection(sessionJwt)).rejects.toMatchObject({
                                            status: "UNAUTHORIZED",
                                            message: "token inactive",
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); });
