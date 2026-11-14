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
var oauth2_1 = require("@better-auth/core/oauth2");
var memory_adapter_1 = require("@better-auth/memory-adapter");
var api_1 = require("better-auth/api");
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var oauth2_2 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
var token_1 = require("./token");
var zod_1 = require("./types/zod");
var utils_1 = require("./utils");
(0, vitest_1.describe)("oauth token - authorization_code", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)(__assign({ id: providerId, options: {
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
                        return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)(__assign(__assign({}, overrides), { redirectURI: redirectUri, options: {
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
    var authServerBaseUrl, rpBaseUrl, validResource, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri, state, jwks;
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
                    var response, jwksResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        grant_types: [
                                            "authorization_code",
                                            "client_credentials",
                                            "refresh_token",
                                        ],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
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
                                return [4 /*yield*/, client.$fetch("/jwks", { method: "GET" })];
                            case 2:
                                jwksResult = _a.sent();
                                if (!jwksResult.data) {
                                    throw new Error("Unable to fetch jwks");
                                }
                                jwks = (0, jose_1.createLocalJWKSet)(jwksResult.data);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("scope openid should provide access_token and id_token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, _c, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken;
                    var _d, _e, _f, _g, _h;
                    var expect = _b.expect;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid"];
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                    })];
                            case 1:
                                _c = _j.sent(), authUrl = _c.url, codeVerifier = _c.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _j.sent();
                                expect(callbackRedirectUrl).toContain(redirectUri);
                                expect(callbackRedirectUrl).toContain("code=");
                                expect(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 3:
                                tokens = _j.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined(); // Note: Opaque
                                expect((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeUndefined();
                                expect((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(scopes.join(" "));
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.id_token, jwks)];
                            case 4:
                                idToken = _j.sent();
                                expect(idToken.protectedHeader).toBeDefined();
                                expect(idToken.payload).toBeDefined();
                                expect(idToken.payload.sub).toBeDefined();
                                expect(idToken.payload.name).toBeUndefined();
                                expect(idToken.payload.email).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should exchange a PKCE authorization code when state is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var scopes, _a, authUrl, codeVerifier, callbackRedirectUrl, url, tokens;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                scopes = ["openid"];
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                    })];
                            case 1:
                                _a = _e.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                authUrl.searchParams.delete("state");
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _e.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).not.toContain("state=");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 3:
                                tokens = _e.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.scope).toBe(scopes.join(" "));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("scope openid+profile should provide access_token and id_token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, _c, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken;
                    var _d, _e, _f, _g, _h;
                    var expect = _b.expect;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile"];
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                    })];
                            case 1:
                                _c = _j.sent(), authUrl = _c.url, codeVerifier = _c.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _j.sent();
                                expect(callbackRedirectUrl).toContain(redirectUri);
                                expect(callbackRedirectUrl).toContain("code=");
                                expect(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 3:
                                tokens = _j.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeUndefined();
                                expect((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(scopes.join(" "));
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.id_token, jwks)];
                            case 4:
                                idToken = _j.sent();
                                expect(idToken.protectedHeader).toBeDefined();
                                expect(idToken.payload).toBeDefined();
                                expect(idToken.payload.sub).toBeDefined();
                                expect(idToken.payload.name).toBeUndefined();
                                expect(idToken.payload.email).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("scope openid+email should provide access_token and id_token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, _c, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken;
                    var _d, _e, _f, _g, _h;
                    var expect = _b.expect;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "email"];
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                    })];
                            case 1:
                                _c = _j.sent(), authUrl = _c.url, codeVerifier = _c.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _j.sent();
                                expect(callbackRedirectUrl).toContain(redirectUri);
                                expect(callbackRedirectUrl).toContain("code=");
                                expect(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 3:
                                tokens = _j.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeUndefined();
                                expect((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(scopes.join(" "));
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.id_token, jwks)];
                            case 4:
                                idToken = _j.sent();
                                expect(idToken.protectedHeader).toBeDefined();
                                expect(idToken.payload).toBeDefined();
                                expect(idToken.payload.sub).toBeDefined();
                                expect(idToken.payload.name).toBeUndefined();
                                expect(idToken.payload.email).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("scope openid+offline_access should provide opaque access_token, id_token, and refresh_token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, _c, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken;
                    var _d, _e, _f, _g, _h;
                    var expect = _b.expect;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "offline_access"];
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                    })];
                            case 1:
                                _c = _j.sent(), authUrl = _c.url, codeVerifier = _c.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _j.sent();
                                expect(callbackRedirectUrl).toContain(redirectUri);
                                expect(callbackRedirectUrl).toContain("code=");
                                expect(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 3:
                                tokens = _j.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeDefined();
                                expect((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(scopes.join(" "));
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.id_token, jwks)];
                            case 4:
                                idToken = _j.sent();
                                expect(idToken.protectedHeader).toBeDefined();
                                expect(idToken.payload).toBeDefined();
                                expect(idToken.payload.sub).toBeDefined();
                                expect(idToken.payload.name).toBeUndefined();
                                expect(idToken.payload.email).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("scope openid+offline_access & specified resource should provide JWT access_token, id_token, and refresh_token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, _c, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken, accessToken;
                    var _d, _e, _f, _g, _h, _j, _k;
                    var expect = _b.expect;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "offline_access"];
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                    })];
                            case 1:
                                _c = _l.sent(), authUrl = _c.url, codeVerifier = _c.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _l.sent();
                                expect(callbackRedirectUrl).toContain(redirectUri);
                                expect(callbackRedirectUrl).toContain("code=");
                                expect(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                        resource: validResource,
                                    })];
                            case 3:
                                tokens = _l.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeDefined();
                                expect((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(scopes.join(" "));
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.id_token, jwks)];
                            case 4:
                                idToken = _l.sent();
                                expect(idToken.protectedHeader).toBeDefined();
                                expect(idToken.payload).toBeDefined();
                                expect(idToken.payload.sub).toBeDefined();
                                expect(idToken.payload.name).toBeUndefined();
                                expect(idToken.payload.email).toBeUndefined();
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_j = tokens.data) === null || _j === void 0 ? void 0 : _j.access_token, jwks, {
                                        audience: validResource,
                                        issuer: authServerBaseUrl,
                                    })];
                            case 5:
                                accessToken = _l.sent();
                                expect(accessToken.payload.azp).toBe(oauthClient.client_id);
                                expect(accessToken.payload.sub).toBeDefined();
                                expect(accessToken.payload.iat).toBeDefined();
                                expect(accessToken.payload.exp).toBe((_k = tokens.data) === null || _k === void 0 ? void 0 : _k.expires_at);
                                expect(accessToken.payload.scope).toBe(scopes.join(" "));
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * Concurrent redemption of the same authorization code must mint
                 * tokens for exactly one caller. Before the atomic-consume primitive,
                 * two requests could both pass the find step before either delete
                 * completed and both proceeded to issue token pairs.
                 *
                 * The interleaving relies on the in-memory adapter yielding control at
                 * each `await` boundary; reverting `consumeVerificationValue` to the old
                 * find/delete pair makes this test fail with two successes (verified
                 * empirically), so a synthetic scheduling barrier is unnecessary.
                 *
                 * @see https://github.com/better-auth/better-auth/security/advisories/GHSA-7w99-5wm4-3g79
                 */
                (0, vitest_1.it)("rejects concurrent redemption of the same authorization code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, authUrl, codeVerifier, callbackRedirectUrl, code, _b, first, second, successes, failures;
                    var _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: ["openid", "offline_access"],
                                    })];
                            case 1:
                                _a = _j.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _j.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeTruthy();
                                return [4 /*yield*/, Promise.all([
                                        validateAuthCode({ code: code, codeVerifier: codeVerifier }),
                                        validateAuthCode({ code: code, codeVerifier: codeVerifier }),
                                    ])];
                            case 3:
                                _b = _j.sent(), first = _b[0], second = _b[1];
                                successes = [first, second].filter(function (r) { return r.error === null; });
                                failures = [first, second].filter(function (r) { return r.error !== null; });
                                (0, vitest_1.expect)(successes).toHaveLength(1);
                                (0, vitest_1.expect)(failures).toHaveLength(1);
                                (0, vitest_1.expect)((_d = (_c = successes[0]) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                (0, vitest_1.expect)((_f = (_e = successes[0]) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.id_token).toBeDefined();
                                (0, vitest_1.expect)((_h = (_g = failures[0]) === null || _g === void 0 ? void 0 : _g.error) === null || _h === void 0 ? void 0 : _h.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * A replay that arrives while the first redemption is still issuing tokens
                 * revokes them (RFC 6749 §4.1.2), including the refresh token already
                 * stored, so the first redemption must fail with `invalid_grant`.
                 *
                 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
                 */
                (0, vitest_1.it)("fails an in-flight redemption with invalid_grant when a replay revokes its tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, authUrl, codeVerifier, callbackRedirectUrl, code, context, create, reached, released, spy, redeeming, replay, redeemed;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, createAuthUrl({
                                    scopes: ["openid", "offline_access"],
                                })];
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
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                context = _b.sent();
                                create = context.adapter.create.bind(context.adapter);
                                reached = Promise.withResolvers();
                                released = Promise.withResolvers();
                                spy = vitest_1.vi.spyOn(context.adapter, "create");
                                spy.mockImplementation(function () {
                                    var args = [];
                                    for (var _i = 0; _i < arguments.length; _i++) {
                                        args[_i] = arguments[_i];
                                    }
                                    return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(args[0].model === "oauthAccessToken")) return [3 /*break*/, 2];
                                                    spy.mockRestore();
                                                    reached.resolve();
                                                    return [4 /*yield*/, released.promise];
                                                case 1:
                                                    _a.sent();
                                                    _a.label = 2;
                                                case 2: return [2 /*return*/, create.apply(void 0, args)];
                                            }
                                        });
                                    });
                                });
                                _b.label = 4;
                            case 4:
                                _b.trys.push([4, , 8, 9]);
                                redeeming = validateAuthCode({ code: code, codeVerifier: codeVerifier });
                                return [4 /*yield*/, reached.promise];
                            case 5:
                                _b.sent();
                                return [4 /*yield*/, validateAuthCode({ code: code, codeVerifier: codeVerifier })];
                            case 6:
                                replay = _b.sent();
                                released.resolve();
                                return [4 /*yield*/, redeeming];
                            case 7:
                                redeemed = _b.sent();
                                (0, vitest_1.expect)(replay.error).toMatchObject({ error: "invalid_grant" });
                                (0, vitest_1.expect)(redeemed.error).toMatchObject({ error: "invalid_grant" });
                                return [3 /*break*/, 9];
                            case 8:
                                released.resolve();
                                spy.mockRestore();
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10150
                 */
                (0, vitest_1.it)("rejects authorization code replay with invalid_grant and revokes issued tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, authUrl, codeVerifier, callbackRedirectUrl, code, tokens, replay, userinfo;
                    var _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: ["openid"],
                                    })];
                            case 1:
                                _a = _f.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _f.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeTruthy();
                                return [4 /*yield*/, validateAuthCode({ code: code, codeVerifier: codeVerifier })];
                            case 3:
                                tokens = _f.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                return [4 /*yield*/, validateAuthCode({ code: code, codeVerifier: codeVerifier })];
                            case 4:
                                replay = _f.sent();
                                (0, vitest_1.expect)((_c = replay.error) === null || _c === void 0 ? void 0 : _c.status).toBe(400);
                                (0, vitest_1.expect)((_d = replay.error) === null || _d === void 0 ? void 0 : _d.error).toBe("invalid_grant");
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            Authorization: "Bearer ".concat(tokens.data.access_token),
                                        },
                                    })];
                            case 5:
                                userinfo = _f.sent();
                                (0, vitest_1.expect)((_e = userinfo.error) === null || _e === void 0 ? void 0 : _e.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10150
                 */
                (0, vitest_1.it)("rejects authorization code replay with invalid_grant and still attempts refresh-token cleanup when access-token cleanup fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, authUrl, codeVerifier, callbackRedirectUrl, code, tokens, context, originalDeleteMany, accessTokenCleanupFailed, deleteMany, loggerError, replay, cleanupModels, _b, body, headers_1, refresh;
                    var _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: ["openid", "offline_access"],
                                    })];
                            case 1:
                                _a = _j.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _j.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeTruthy();
                                return [4 /*yield*/, validateAuthCode({ code: code, codeVerifier: codeVerifier })];
                            case 3:
                                tokens = _j.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                                return [4 /*yield*/, auth.$context];
                            case 4:
                                context = _j.sent();
                                originalDeleteMany = context.adapter.deleteMany.bind(context.adapter);
                                accessTokenCleanupFailed = false;
                                deleteMany = vitest_1.vi
                                    .spyOn(context.adapter, "deleteMany")
                                    .mockImplementation(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        // The code lookup's expired-row cleanup also calls deleteMany, so
                                        // fail the first access-token cleanup rather than the first call.
                                        if (data.model === "oauthAccessToken" && !accessTokenCleanupFailed) {
                                            accessTokenCleanupFailed = true;
                                            throw new Error("cleanup failed");
                                        }
                                        return [2 /*return*/, originalDeleteMany(data)];
                                    });
                                }); });
                                loggerError = vitest_1.vi
                                    .spyOn(context.logger, "error")
                                    .mockImplementation(function () { return undefined; });
                                _j.label = 5;
                            case 5:
                                _j.trys.push([5, , 9, 10]);
                                return [4 /*yield*/, validateAuthCode({ code: code, codeVerifier: codeVerifier })];
                            case 6:
                                replay = _j.sent();
                                (0, vitest_1.expect)((_e = replay.error) === null || _e === void 0 ? void 0 : _e.status).toBe(400);
                                (0, vitest_1.expect)((_f = replay.error) === null || _f === void 0 ? void 0 : _f.error).toBe("invalid_grant");
                                (0, vitest_1.expect)(loggerError).toHaveBeenCalledWith("authorization code replay cleanup failed", vitest_1.expect.any(Error));
                                cleanupModels = deleteMany.mock.calls
                                    .map(function (_a) {
                                    var data = _a[0];
                                    return data.model;
                                })
                                    .filter(function (model) {
                                    return model === "oauthAccessToken" || model === "oauthRefreshToken";
                                });
                                (0, vitest_1.expect)(cleanupModels).toEqual([
                                    "oauthAccessToken",
                                    "oauthRefreshToken",
                                    "oauthAccessToken",
                                ]);
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens.data.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 7:
                                _b = _j.sent(), body = _b.body, headers_1 = _b.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers_1,
                                    })];
                            case 8:
                                refresh = _j.sent();
                                (0, vitest_1.expect)((_g = refresh.error) === null || _g === void 0 ? void 0 : _g.status).toBe(400);
                                (0, vitest_1.expect)((_h = refresh.error) === null || _h === void 0 ? void 0 : _h.error).toBe("invalid_grant");
                                return [3 /*break*/, 10];
                            case 9:
                                deleteMany.mockRestore();
                                loggerError.mockRestore();
                                return [7 /*endfinally*/];
                            case 10: return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-15#section-4.1.3
                 */
                (0, vitest_1.it)("keeps the authorization code when the PKCE verifier is rejected", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, authUrl, codeVerifier, callbackRedirectUrl, code, rejected, tokens, replay;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, createAuthUrl({
                                    scopes: ["openid"],
                                })];
                            case 1:
                                _a = _e.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _e.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeTruthy();
                                return [4 /*yield*/, validateAuthCode({
                                        code: code,
                                        codeVerifier: (0, crypto_1.generateRandomString)(32),
                                    })];
                            case 3:
                                rejected = _e.sent();
                                (0, vitest_1.expect)((_b = rejected.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [4 /*yield*/, validateAuthCode({ code: code, codeVerifier: codeVerifier })];
                            case 4:
                                tokens = _e.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeDefined();
                                return [4 /*yield*/, validateAuthCode({ code: code, codeVerifier: codeVerifier })];
                            case 5:
                                replay = _e.sent();
                                (0, vitest_1.expect)((_d = replay.error) === null || _d === void 0 ? void 0 : _d.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-15#section-4.1.3
                 */
                (0, vitest_1.it)("rejects an expired authorization code with invalid_grant", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, authUrl, codeVerifier, callbackRedirectUrl, code, context, _b, _c, tokens;
                    var _d, _e;
                    var _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, createAuthUrl({
                                    scopes: ["openid"],
                                })];
                            case 1:
                                _a = _h.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _h.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeTruthy();
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                context = _h.sent();
                                _c = (_b = context.adapter).update;
                                _d = {
                                    model: "verification"
                                };
                                _e = {
                                    field: "identifier"
                                };
                                return [4 /*yield*/, (0, utils_1.storeToken)("hashed", code, "authorization_code")];
                            case 4: return [4 /*yield*/, _c.apply(_b, [(_d.where = [
                                        (_e.value = _h.sent(),
                                            _e)
                                    ],
                                        _d.update = { expiresAt: new Date(Date.now() - 1000) },
                                        _d)])];
                            case 5:
                                _h.sent();
                                return [4 /*yield*/, validateAuthCode({ code: code, codeVerifier: codeVerifier })];
                            case 6:
                                tokens = _h.sent();
                                (0, vitest_1.expect)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.access_token).toBeUndefined();
                                (0, vitest_1.expect)((_g = tokens.error) === null || _g === void 0 ? void 0 : _g.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/11035
                 */
                (0, vitest_1.it)("returns invalid_client for an unknown client_id before checking the code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: new URLSearchParams({
                                        grant_type: "authorization_code",
                                        client_id: "unknown-client",
                                        client_secret: "secret",
                                        code: "not-a-real-code",
                                        redirect_uri: redirectUri,
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
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10159
                 *
                 * RFC 6749 §4.1.3 binds redirect_uri at the token endpoint only when the
                 * authorization request carried one. The authorize endpoint always records a
                 * redirect_uri (it delivers the code through it), so a headless code is
                 * inserted the way authorize.ts persists one to exercise redemption directly.
                 */
                (0, vitest_1.describe)("redirect_uri conditional (RFC 6749 §4.1.3)", function () {
                    var tokenRequestHeaders = {
                        accept: "application/json",
                        "content-type": "application/x-www-form-urlencoded",
                    };
                    function s256Challenge(verifier) {
                        return __awaiter(this, void 0, void 0, function () {
                            var digest;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))];
                                    case 1:
                                        digest = _a.sent();
                                        return [2 /*return*/, jose_1.base64url.encode(new Uint8Array(digest))];
                                }
                            });
                        });
                    }
                    // Headless first-party / device flows are public clients, so the code is
                    // minted with a PKCE challenge and redeemed with its verifier.
                    function mintHeadlessCode() {
                        return __awaiter(this, void 0, void 0, function () {
                            var context, session, code, codeVerifier, now, _a, _b, _c, _d;
                            var _e, _f, _g;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0: return [4 /*yield*/, auth.$context];
                                    case 1:
                                        context = _h.sent();
                                        return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                                    case 2:
                                        session = _h.sent();
                                        if (!session)
                                            throw new Error("test session unavailable");
                                        code = (0, crypto_1.generateRandomString)(32, "a-z", "A-Z", "0-9");
                                        codeVerifier = (0, crypto_1.generateRandomString)(43, "a-z", "A-Z", "0-9");
                                        now = Date.now();
                                        _b = (_a = context.internalAdapter).createVerificationValue;
                                        _e = {};
                                        return [4 /*yield*/, (0, utils_1.storeToken)("hashed", code, "authorization_code")];
                                    case 3:
                                        _e.identifier = _h.sent();
                                        _d = (_c = JSON).stringify;
                                        _f = {
                                            type: "authorization_code"
                                        };
                                        _g = {
                                            client_id: oauthClient.client_id,
                                            scope: "openid"
                                        };
                                        return [4 /*yield*/, s256Challenge(codeVerifier)];
                                    case 4: return [4 /*yield*/, _b.apply(_a, [(_e.value = _d.apply(_c, [(_f.query = (_g.code_challenge = _h.sent(),
                                                    _g.code_challenge_method = "S256",
                                                    _g),
                                                    _f.userId = session.user.id,
                                                    _f.sessionId = session.session.id,
                                                    _f.authTime = now,
                                                    _f)]),
                                                _e.expiresAt = new Date(now + 600000),
                                                _e)])];
                                    case 5:
                                        _h.sent();
                                        return [2 /*return*/, { code: code, codeVerifier: codeVerifier }];
                                }
                            });
                        });
                    }
                    function mintRedirectBoundCode() {
                        return __awaiter(this, void 0, void 0, function () {
                            var authUrl, callbackRedirectUrl;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, createAuthUrl()];
                                    case 1:
                                        authUrl = (_a.sent()).url;
                                        callbackRedirectUrl = "";
                                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                                onError: function (context) {
                                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                                },
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, new URL(callbackRedirectUrl).searchParams.get("code")];
                                }
                            });
                        });
                    }
                    (0, vitest_1.it)("exchanges a headless code that omits redirect_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, code, codeVerifier, tokens;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, mintHeadlessCode()];
                                case 1:
                                    _a = _c.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                    return [4 /*yield*/, client.oauth2.token({
                                            code: code,
                                            code_verifier: codeVerifier,
                                            grant_type: "authorization_code",
                                            client_id: oauthClient.client_id,
                                            client_secret: oauthClient.client_secret,
                                        }, { headers: tokenRequestHeaders })];
                                case 2:
                                    tokens = _c.sent();
                                    (0, vitest_1.expect)(tokens.error).toBeNull();
                                    (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("rejects a redirect_uri supplied against a headless code with invalid_grant", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, code, codeVerifier, tokens;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, mintHeadlessCode()];
                                case 1:
                                    _a = _d.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                    return [4 /*yield*/, client.oauth2.token({
                                            code: code,
                                            code_verifier: codeVerifier,
                                            grant_type: "authorization_code",
                                            client_id: oauthClient.client_id,
                                            client_secret: oauthClient.client_secret,
                                            redirect_uri: redirectUri,
                                        }, { headers: tokenRequestHeaders })];
                                case 2:
                                    tokens = _d.sent();
                                    (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeUndefined();
                                    (0, vitest_1.expect)((_c = tokens.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_grant");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("requires redirect_uri when the code was bound to one", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var code, tokens;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, mintRedirectBoundCode()];
                                case 1:
                                    code = _c.sent();
                                    return [4 /*yield*/, client.oauth2.token({
                                            code: code,
                                            grant_type: "authorization_code",
                                            client_id: oauthClient.client_id,
                                            client_secret: oauthClient.client_secret,
                                        }, { headers: tokenRequestHeaders })];
                                case 2:
                                    tokens = _c.sent();
                                    (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeUndefined();
                                    (0, vitest_1.expect)((_b = tokens.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("rejects a mismatched redirect_uri with invalid_grant", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var code, tokens;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, mintRedirectBoundCode()];
                                case 1:
                                    code = _c.sent();
                                    return [4 /*yield*/, client.oauth2.token({
                                            code: code,
                                            grant_type: "authorization_code",
                                            client_id: oauthClient.client_id,
                                            client_secret: oauthClient.client_secret,
                                            redirect_uri: "https://attacker.example/callback",
                                        }, { headers: tokenRequestHeaders })];
                                case 2:
                                    tokens = _c.sent();
                                    (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeUndefined();
                                    (0, vitest_1.expect)((_b = tokens.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth token - refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)(__assign({ id: providerId, options: {
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
                        return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)(__assign(__assign({}, overrides), { redirectURI: redirectUri, options: {
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
    /** Initial authorization */
    function authorizeForRefreshToken(scopes) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken;
            var _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, createAuthUrl({
                            scopes: scopes,
                        })];
                    case 1:
                        _a = _g.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _g.sent();
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                        url = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, validateAuthCode({
                                code: url.searchParams.get("code"),
                                codeVerifier: codeVerifier,
                            })];
                    case 3:
                        tokens = _g.sent();
                        (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                        (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                        (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                        (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.scope).toBe(scopes.join(" "));
                        return [4 /*yield*/, (0, jose_1.jwtVerify)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.id_token, jwks)];
                    case 4:
                        idToken = _g.sent();
                        (0, vitest_1.expect)(idToken.protectedHeader).toBeDefined();
                        (0, vitest_1.expect)(idToken.payload).toBeDefined();
                        (0, vitest_1.expect)(idToken.payload.sub).toBeDefined();
                        (0, vitest_1.expect)(idToken.payload.name).toBeUndefined();
                        (0, vitest_1.expect)(idToken.payload.email).toBeUndefined();
                        return [2 /*return*/, tokens.data];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, validResource, _a, authorizationServer, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri, state, jwks;
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
                _a = _b.sent(), authorizationServer = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
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
                    var response, jwksResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        grant_types: [
                                            "authorization_code",
                                            "client_credentials",
                                            "refresh_token",
                                        ],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
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
                                return [4 /*yield*/, client.$fetch("/jwks", { method: "GET" })];
                            case 2:
                                jwksResult = _a.sent();
                                if (!jwksResult.data) {
                                    throw new Error("Unable to fetch jwks");
                                }
                                jwks = (0, jose_1.createLocalJWKSet)(jwksResult.data);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns invalid_request when refresh_token omits client_id", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: new URLSearchParams({
                                        grant_type: "refresh_token",
                                        refresh_token: "not-used",
                                    }),
                                    headers: {
                                        "content-type": "application/x-www-form-urlencoded",
                                    },
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns invalid_request when refresh_token is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !oauthClient.client_secret) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "refresh_token",
                                            client_id: oauthClient.client_id,
                                            client_secret: oauthClient.client_secret,
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/11035
                 */
                (0, vitest_1.describe)("unknown client_id", function () {
                    (0, vitest_1.it)("returns invalid_client to a public client before looking up the refresh token", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var response;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "refresh_token",
                                            refresh_token: "not-a-real-refresh-token",
                                            client_id: "unknown-client",
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                                case 1:
                                    response = _b.sent();
                                    (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                    (0, vitest_1.expect)(response.error).toMatchObject({
                                        error: "invalid_client",
                                        error_description: "client not found",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("returns 401 invalid_client to a Basic-authenticated client before looking up the refresh token", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var responseHeaders, response;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "refresh_token",
                                            refresh_token: "not-a-real-refresh-token",
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                            authorization: "Basic ".concat(Buffer.from("unknown-client:secret").toString("base64")),
                                        },
                                        onError: function (context) {
                                            responseHeaders = context.response.headers;
                                        },
                                    })];
                                case 1:
                                    response = _c.sent();
                                    (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                    (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                    (0, vitest_1.expect)(responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get("WWW-Authenticate")).toBe("Basic");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.it)("should refresh token with same scopes, opaque access token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, tokens, _c, body, headers, newTokens;
                    var _d, _e, _f, _g, _h;
                    var expect = _b.expect;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _j.sent();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        extraParams: {
                                            scope: scopes.join(" "),
                                        },
                                    })];
                            case 2:
                                _c = _j.sent(), body = _c.body, headers = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                newTokens = _j.sent();
                                expect((_d = newTokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = newTokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = newTokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeDefined();
                                expect((_g = newTokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(scopes.join(" "));
                                // Always expect a new refresh token
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).not.toEqual((_h = newTokens.data) === null || _h === void 0 ? void 0 : _h.refresh_token);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects refresh token use by a different client with invalid_grant", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, tokens, otherRedirectUri, otherClient, _c, body, tokenHeaders, result;
                    var _d, _e;
                    var expect = _b.expect;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _f.sent();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                otherRedirectUri = "".concat(rpBaseUrl, "/api/auth/callback/other");
                                return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: ["authorization_code", "refresh_token"],
                                            redirect_uris: [otherRedirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                        },
                                    })];
                            case 2:
                                otherClient = _f.sent();
                                expect(otherClient.client_id).toBeDefined();
                                expect(otherClient.client_secret).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens.refresh_token,
                                        options: {
                                            clientId: otherClient.client_id,
                                            clientSecret: otherClient.client_secret,
                                            redirectURI: otherRedirectUri,
                                        },
                                        extraParams: {
                                            scope: scopes.join(" "),
                                        },
                                    })];
                            case 3:
                                _c = _f.sent(), body = _c.body, tokenHeaders = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: tokenHeaders,
                                    })];
                            case 4:
                                result = _f.sent();
                                expect((_d = result.error) === null || _d === void 0 ? void 0 : _d.error).toBe("invalid_grant");
                                expect((_e = result.error) === null || _e === void 0 ? void 0 : _e.error_description).toBe("invalid refresh token");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should preserve auth_time in id_token after refresh (OIDC Core 1.0 Section 12.2)", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, tokens, originalIdToken, _c, body, headers, newTokens, refreshedIdToken;
                    var _d;
                    var expect = _b.expect;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _e.sent();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.id_token).toBeDefined();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                originalIdToken = (0, jose_1.decodeJwt)(tokens.id_token);
                                expect(originalIdToken.auth_time).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        extraParams: {
                                            scope: scopes.join(" "),
                                        },
                                    })];
                            case 2:
                                _c = _e.sent(), body = _c.body, headers = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                newTokens = _e.sent();
                                expect((_d = newTokens.data) === null || _d === void 0 ? void 0 : _d.id_token).toBeDefined();
                                refreshedIdToken = (0, jose_1.decodeJwt)(newTokens.data.id_token);
                                expect(refreshedIdToken.auth_time).toBe(originalIdToken.auth_time);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should refresh token with same scopes, JWT access token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, tokens, _c, body, headers, newTokens, accessToken;
                    var _d, _e, _f, _g, _h, _j, _k;
                    var expect = _b.expect;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _l.sent();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        extraParams: {
                                            scope: scopes.join(" "),
                                        },
                                        resource: validResource,
                                    })];
                            case 2:
                                _c = _l.sent(), body = _c.body, headers = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                newTokens = _l.sent();
                                expect((_d = newTokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = newTokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = newTokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeDefined();
                                expect((_g = newTokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(scopes.join(" "));
                                // Always expect a new refresh token
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).not.toEqual((_h = newTokens.data) === null || _h === void 0 ? void 0 : _h.refresh_token);
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_j = newTokens.data) === null || _j === void 0 ? void 0 : _j.access_token, jwks, {
                                        audience: validResource,
                                        issuer: authServerBaseUrl,
                                    })];
                            case 4:
                                accessToken = _l.sent();
                                expect(accessToken.payload.azp).toBe(oauthClient.client_id);
                                expect(accessToken.payload.sub).toBeDefined();
                                expect(accessToken.payload.iat).toBeDefined();
                                expect(accessToken.payload.exp).toBe((_k = newTokens.data) === null || _k === void 0 ? void 0 : _k.expires_at);
                                expect(accessToken.payload.scope).toBe(scopes.join(" "));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should refresh token with lesser scopes, opaque access token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, newScopes, tokens, _c, body, headers, newTokens;
                    var _d, _e, _f, _g, _h;
                    var expect = _b.expect;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                newScopes = ["openid", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _j.sent();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        extraParams: {
                                            scope: newScopes.join(" "),
                                        },
                                    })];
                            case 2:
                                _c = _j.sent(), body = _c.body, headers = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                newTokens = _j.sent();
                                expect((_d = newTokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = newTokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = newTokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeDefined();
                                expect((_g = newTokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(newScopes.join(" "));
                                // Always expect a new refresh token
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).not.toEqual((_h = newTokens.data) === null || _h === void 0 ? void 0 : _h.refresh_token);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should refresh token with lesser scopes, JWT access token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, newScopes, tokens, _c, body, headers, newTokens, accessToken;
                    var _d, _e, _f, _g, _h, _j, _k;
                    var expect = _b.expect;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                newScopes = ["openid", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _l.sent();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        extraParams: {
                                            scope: newScopes.join(" "),
                                        },
                                        resource: validResource,
                                    })];
                            case 2:
                                _c = _l.sent(), body = _c.body, headers = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                newTokens = _l.sent();
                                expect((_d = newTokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = newTokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = newTokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeDefined();
                                expect((_g = newTokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(newScopes.join(" "));
                                // Always expect a new refresh token
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).not.toEqual((_h = newTokens.data) === null || _h === void 0 ? void 0 : _h.refresh_token);
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_j = newTokens.data) === null || _j === void 0 ? void 0 : _j.access_token, jwks, {
                                        audience: validResource,
                                        issuer: authServerBaseUrl,
                                    })];
                            case 4:
                                accessToken = _l.sent();
                                expect(accessToken.payload.azp).toBe(oauthClient.client_id);
                                expect(accessToken.payload.sub).toBeDefined();
                                expect(accessToken.payload.iat).toBeDefined();
                                expect(accessToken.payload.exp).toBe((_k = newTokens.data) === null || _k === void 0 ? void 0 : _k.expires_at);
                                expect(accessToken.payload.scope).toBe(newScopes.join(" "));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should refresh token even when removing offline_scope", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, newScopes, tokens, _c, body, headers, newTokens;
                    var _d, _e, _f, _g, _h;
                    var expect = _b.expect;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                newScopes = ["openid"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _j.sent();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        extraParams: {
                                            scope: newScopes.join(" "),
                                        },
                                    })];
                            case 2:
                                _c = _j.sent(), body = _c.body, headers = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                newTokens = _j.sent();
                                expect((_d = newTokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = newTokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeDefined();
                                expect((_f = newTokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeDefined();
                                expect(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).not.toEqual((_g = newTokens.data) === null || _g === void 0 ? void 0 : _g.refresh_token);
                                expect((_h = newTokens.data) === null || _h === void 0 ? void 0 : _h.scope).toBe(newScopes.join(" "));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not refresh token with more scopes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var scopes, newScopes, tokens, _a, body, headers, newTokens;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                newScopes = ["openid", "email", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _c.sent();
                                (0, vitest_1.expect)(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        extraParams: {
                                            scope: newScopes.join(" "),
                                        },
                                    })];
                            case 2:
                                _a = _c.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                newTokens = _c.sent();
                                (0, vitest_1.expect)((_b = newTokens.error) === null || _b === void 0 ? void 0 : _b.status).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should prevent replay attacks", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var scopes, tokens, _a, body, headers, newTokens, replayedTokens, _b, newBody, newHeaders, newTokensRefresh;
                    var _c, _d, _e, _f, _g, _h, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _k.sent();
                                (0, vitest_1.expect)(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 2:
                                _a = _k.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 3:
                                newTokens = _k.sent();
                                (0, vitest_1.expect)((_c = newTokens.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeDefined();
                                (0, vitest_1.expect)((_d = newTokens.data) === null || _d === void 0 ? void 0 : _d.id_token).toBeDefined();
                                (0, vitest_1.expect)((_e = newTokens.data) === null || _e === void 0 ? void 0 : _e.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_f = newTokens.data) === null || _f === void 0 ? void 0 : _f.scope).toBe(scopes.join(" "));
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 4:
                                replayedTokens = _k.sent();
                                (0, vitest_1.expect)((_g = replayedTokens.error) === null || _g === void 0 ? void 0 : _g.status).toBeDefined();
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: (_h = newTokens === null || newTokens === void 0 ? void 0 : newTokens.data) === null || _h === void 0 ? void 0 : _h.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 5:
                                _b = _k.sent(), newBody = _b.body, newHeaders = _b.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: newBody,
                                        headers: newHeaders,
                                    })];
                            case 6:
                                newTokensRefresh = _k.sent();
                                (0, vitest_1.expect)((_j = newTokensRefresh.error) === null || _j === void 0 ? void 0 : _j.status).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * /oauth2/revoke (RFC 7009) on an active refresh token must mark the row
                 * `revoked` (via the same CAS used in rotation) so that subsequent reuse
                 * trips the family-invalidation guard.
                 *
                 * @see https://github.com/better-auth/better-auth/security/advisories/GHSA-392p-2q2v-4372
                 */
                (0, vitest_1.it)("revoke endpoint marks the refresh row revoked and blocks reuse", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var scopes, tokens, revoke, context, refreshRows, _a, replayBody, replayHeaders, replay;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile", "offline_access"];
                                return [4 /*yield*/, authorizeForRefreshToken(scopes)];
                            case 1:
                                tokens = _c.sent();
                                (0, vitest_1.expect)(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/revoke", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            token: tokens.refresh_token,
                                            token_type_hint: "refresh_token",
                                            client_id: oauthClient.client_id,
                                            client_secret: oauthClient.client_secret,
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 2:
                                revoke = _c.sent();
                                (0, vitest_1.expect)(revoke.error).toBeNull();
                                return [4 /*yield*/, authorizationServer.$context];
                            case 3:
                                context = _c.sent();
                                return [4 /*yield*/, context.adapter.findMany({
                                        model: "oauthRefreshToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 4:
                                refreshRows = _c.sent();
                                (0, vitest_1.expect)(refreshRows.length).toBeGreaterThanOrEqual(1);
                                // The just-revoked row must carry a `revoked` timestamp.
                                (0, vitest_1.expect)(refreshRows.some(function (r) { return r.revoked != null; })).toBe(true);
                                return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                        refreshToken: tokens.refresh_token,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 5:
                                _a = _c.sent(), replayBody = _a.body, replayHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: replayBody,
                                        headers: replayHeaders,
                                    })];
                            case 6:
                                replay = _c.sent();
                                (0, vitest_1.expect)((_b = replay.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * Two requests racing on the same parent refresh token. Rotation and
                 * `revokeRefreshToken` run through the same CAS, so exactly one wins and the
                 * loser fails closed. Each ordering is forced by holding one request at an
                 * adapter call until the other has finished, instead of leaving it to
                 * scheduling.
                 *
                 * @see https://github.com/better-auth/better-auth/security/advisories/GHSA-392p-2q2v-4372
                 */
                (0, vitest_1.describe)("concurrent use of the same refresh token", function () {
                    function refresh(refreshToken) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, body, headers;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                            refreshToken: refreshToken,
                                            options: {
                                                clientId: oauthClient.client_id,
                                                clientSecret: oauthClient.client_secret,
                                                redirectURI: redirectUri,
                                            },
                                        })];
                                    case 1:
                                        _a = _b.sent(), body = _a.body, headers = _a.headers;
                                        return [2 /*return*/, client.$fetch("/oauth2/token", {
                                                method: "POST",
                                                body: body,
                                                headers: headers,
                                            })];
                                }
                            });
                        });
                    }
                    function revoke(refreshToken) {
                        return client.$fetch("/oauth2/revoke", {
                            method: "POST",
                            body: new URLSearchParams({
                                token: refreshToken,
                                token_type_hint: "refresh_token",
                                client_id: oauthClient.client_id,
                                client_secret: oauthClient.client_secret,
                            }),
                            headers: {
                                "content-type": "application/x-www-form-urlencoded",
                            },
                        });
                    }
                    /** Pauses the next refresh-token CAS until `release` is called. */
                    function holdNextRefreshTokenCas() {
                        return __awaiter(this, void 0, void 0, function () {
                            var context, incrementOne, reached, released, spy;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, authorizationServer.$context];
                                    case 1:
                                        context = _a.sent();
                                        incrementOne = context.adapter.incrementOne.bind(context.adapter);
                                        reached = Promise.withResolvers();
                                        released = Promise.withResolvers();
                                        spy = vitest_1.vi.spyOn(context.adapter, "incrementOne");
                                        spy.mockImplementation(function () {
                                            var args = [];
                                            for (var _i = 0; _i < arguments.length; _i++) {
                                                args[_i] = arguments[_i];
                                            }
                                            return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!(args[0].model === "oauthRefreshToken")) return [3 /*break*/, 2];
                                                            spy.mockRestore();
                                                            reached.resolve();
                                                            return [4 /*yield*/, released.promise];
                                                        case 1:
                                                            _a.sent();
                                                            _a.label = 2;
                                                        case 2: return [2 /*return*/, incrementOne.apply(void 0, args)];
                                                    }
                                                });
                                            });
                                        });
                                        return [2 /*return*/, {
                                                reached: reached.promise,
                                                release: released.resolve,
                                                // Also release, so a failed test never leaves the held request paused.
                                                restore: function () {
                                                    spy.mockRestore();
                                                    released.resolve();
                                                },
                                            }];
                                }
                            });
                        });
                    }
                    /** Pauses the next access-token insert until `release` is called. */
                    function holdNextAccessTokenInsert() {
                        return __awaiter(this, void 0, void 0, function () {
                            var context, create, reached, released, spy;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, authorizationServer.$context];
                                    case 1:
                                        context = _a.sent();
                                        create = context.adapter.create.bind(context.adapter);
                                        reached = Promise.withResolvers();
                                        released = Promise.withResolvers();
                                        spy = vitest_1.vi.spyOn(context.adapter, "create");
                                        spy.mockImplementation(function () {
                                            var args = [];
                                            for (var _i = 0; _i < arguments.length; _i++) {
                                                args[_i] = arguments[_i];
                                            }
                                            return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!(args[0].model === "oauthAccessToken")) return [3 /*break*/, 2];
                                                            spy.mockRestore();
                                                            reached.resolve();
                                                            return [4 /*yield*/, released.promise];
                                                        case 1:
                                                            _a.sent();
                                                            _a.label = 2;
                                                        case 2: return [2 /*return*/, create.apply(void 0, args)];
                                                    }
                                                });
                                            });
                                        });
                                        return [2 /*return*/, {
                                                reached: reached.promise,
                                                release: released.resolve,
                                                restore: function () {
                                                    released.resolve();
                                                    spy.mockRestore();
                                                },
                                            }];
                                }
                            });
                        });
                    }
                    function issueParentRefreshToken() {
                        return __awaiter(this, void 0, void 0, function () {
                            var tokens;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, authorizeForRefreshToken([
                                            "openid",
                                            "profile",
                                            "offline_access",
                                        ])];
                                    case 1:
                                        tokens = _a.sent();
                                        (0, vitest_1.expect)(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token).toBeDefined();
                                        return [2 /*return*/, tokens.refresh_token];
                                }
                            });
                        });
                    }
                    (0, vitest_1.it)("rotates once and fails the other rotation with invalid_grant", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var parentToken, cas, losing, rotated, lost, next, _a;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, issueParentRefreshToken()];
                                case 1:
                                    parentToken = _c.sent();
                                    return [4 /*yield*/, holdNextRefreshTokenCas()];
                                case 2:
                                    cas = _c.sent();
                                    _c.label = 3;
                                case 3:
                                    _c.trys.push([3, , 9, 10]);
                                    losing = refresh(parentToken);
                                    return [4 /*yield*/, cas.reached];
                                case 4:
                                    _c.sent();
                                    return [4 /*yield*/, refresh(parentToken)];
                                case 5:
                                    rotated = _c.sent();
                                    cas.release();
                                    return [4 /*yield*/, losing];
                                case 6:
                                    lost = _c.sent();
                                    (0, vitest_1.expect)(rotated.error).toBeNull();
                                    (0, vitest_1.expect)(lost.error).toMatchObject({ error: "invalid_grant" });
                                    return [4 /*yield*/, refresh(rotated.data.refresh_token)];
                                case 7:
                                    next = _c.sent();
                                    (0, vitest_1.expect)(next.error).toBeNull();
                                    (0, vitest_1.expect)((_b = next.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeDefined();
                                    // Reusing the rotated parent still revokes the family.
                                    _a = vitest_1.expect;
                                    return [4 /*yield*/, refresh(parentToken)];
                                case 8:
                                    // Reusing the rotated parent still revokes the family.
                                    _a.apply(void 0, [(_c.sent()).error]).toMatchObject({
                                        error: "invalid_grant",
                                    });
                                    return [3 /*break*/, 10];
                                case 9:
                                    cas.restore();
                                    return [7 /*endfinally*/];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                    /**
                     * A request that reads the parent after the other's CAS presents a reused
                     * token, so it revokes the family (RFC 9700 §4.14.2), including the new
                     * refresh token the winner is still issuing.
                     *
                     * @see https://datatracker.ietf.org/doc/html/rfc9700#section-4.14.2
                     */
                    (0, vitest_1.it)("fails an in-flight rotation with invalid_grant when reuse revokes its family", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var parentToken, insert, rotating, reused, rotated;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, issueParentRefreshToken()];
                                case 1:
                                    parentToken = _a.sent();
                                    return [4 /*yield*/, holdNextAccessTokenInsert()];
                                case 2:
                                    insert = _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, , 7, 8]);
                                    rotating = refresh(parentToken);
                                    return [4 /*yield*/, insert.reached];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, refresh(parentToken)];
                                case 5:
                                    reused = _a.sent();
                                    insert.release();
                                    return [4 /*yield*/, rotating];
                                case 6:
                                    rotated = _a.sent();
                                    (0, vitest_1.expect)(reused.error).toMatchObject({ error: "invalid_grant" });
                                    (0, vitest_1.expect)(rotated.error).toMatchObject({ error: "invalid_grant" });
                                    return [3 /*break*/, 8];
                                case 7:
                                    insert.restore();
                                    return [7 /*endfinally*/];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("fails the revoke closed when the rotation wins", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var parentToken, cas, revoking, rotated, revoked, _a, _b;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, issueParentRefreshToken()];
                                case 1:
                                    parentToken = _d.sent();
                                    return [4 /*yield*/, holdNextRefreshTokenCas()];
                                case 2:
                                    cas = _d.sent();
                                    _d.label = 3;
                                case 3:
                                    _d.trys.push([3, , 9, 10]);
                                    revoking = revoke(parentToken);
                                    return [4 /*yield*/, cas.reached];
                                case 4:
                                    _d.sent();
                                    return [4 /*yield*/, refresh(parentToken)];
                                case 5:
                                    rotated = _d.sent();
                                    cas.release();
                                    return [4 /*yield*/, revoking];
                                case 6:
                                    revoked = _d.sent();
                                    (0, vitest_1.expect)(rotated.error).toBeNull();
                                    (0, vitest_1.expect)((_c = rotated.data) === null || _c === void 0 ? void 0 : _c.refresh_token).toBeDefined();
                                    // Known bug: RFC 7009 §2.2 expects 200 for an already-invalid token,
                                    // but the endpoint's invalid-token catch never matches. Flip this
                                    // to 200 when that is fixed; the family teardown below must stay.
                                    (0, vitest_1.expect)(revoked.error).toMatchObject({
                                        status: 400,
                                        error: "invalid_request",
                                    });
                                    // The losing revoke tears down the family, including the new token.
                                    _a = vitest_1.expect;
                                    return [4 /*yield*/, refresh(rotated.data.refresh_token)];
                                case 7:
                                    // The losing revoke tears down the family, including the new token.
                                    _a.apply(void 0, [(_d.sent()).error]).toMatchObject({ error: "invalid_grant" });
                                    _b = vitest_1.expect;
                                    return [4 /*yield*/, refresh(parentToken)];
                                case 8:
                                    _b.apply(void 0, [(_d.sent()).error]).toMatchObject({
                                        error: "invalid_grant",
                                    });
                                    return [3 /*break*/, 10];
                                case 9:
                                    cas.restore();
                                    return [7 /*endfinally*/];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("fails the rotation with invalid_grant when the revoke wins", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var parentToken, cas, rotating, revoked, rotated, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, issueParentRefreshToken()];
                                case 1:
                                    parentToken = _b.sent();
                                    return [4 /*yield*/, holdNextRefreshTokenCas()];
                                case 2:
                                    cas = _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _b.trys.push([3, , 8, 9]);
                                    rotating = refresh(parentToken);
                                    return [4 /*yield*/, cas.reached];
                                case 4:
                                    _b.sent();
                                    return [4 /*yield*/, revoke(parentToken)];
                                case 5:
                                    revoked = _b.sent();
                                    cas.release();
                                    return [4 /*yield*/, rotating];
                                case 6:
                                    rotated = _b.sent();
                                    (0, vitest_1.expect)(revoked.error).toBeNull();
                                    (0, vitest_1.expect)(rotated.error).toMatchObject({ error: "invalid_grant" });
                                    _a = vitest_1.expect;
                                    return [4 /*yield*/, refresh(parentToken)];
                                case 7:
                                    _a.apply(void 0, [(_b.sent()).error]).toMatchObject({
                                        error: "invalid_grant",
                                    });
                                    return [3 /*break*/, 9];
                                case 8:
                                    cas.restore();
                                    return [7 /*endfinally*/];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth token - refresh_token reuse interval", function () { return __awaiter(void 0, void 0, void 0, function () {
    function createOAuthClient() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                token_endpoint_auth_method: "client_secret_post",
                                grant_types: [
                                    "authorization_code",
                                    "client_credentials",
                                    "refresh_token",
                                ],
                                redirect_uris: [redirectUri],
                                application_type: "native",
                                skip_consent: true,
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                        (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                        return [2 /*return*/, response];
                }
            });
        });
    }
    function authorizeForRefreshToken(scopes) {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, authUrl, callbackRedirectUrl, callbackUrl, _a, body, headers, tokens;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                id: providerId,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                redirectURI: "",
                                authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                state: state,
                                scopes: scopes,
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        authUrl = _c.sent();
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _c.sent();
                        callbackUrl = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                code: callbackUrl.searchParams.get("code"),
                                codeVerifier: codeVerifier,
                                redirectURI: redirectUri,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                            })];
                    case 3:
                        _a = _c.sent(), body = _a.body, headers = _a.headers;
                        return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: headers,
                            })];
                    case 4:
                        tokens = _c.sent();
                        (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeDefined();
                        return [2 /*return*/, tokens.data];
                }
            });
        });
    }
    function refresh(refreshToken, params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, headers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                refreshToken: refreshToken,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                extraParams: (params === null || params === void 0 ? void 0 : params.scope) ? { scope: params.scope } : undefined,
                                resource: params === null || params === void 0 ? void 0 : params.resource,
                            })];
                    case 1:
                        _a = _b.sent(), body = _a.body, headers = _a.headers;
                        return [2 /*return*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: headers,
                            })];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, validAudience, otherAudience, refreshTokenResponseCalls, _a, authorizationServer, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri, state;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                validAudience = "https://reuse-api.example.com";
                otherAudience = "https://other-reuse-api.example.com";
                refreshTokenResponseCalls = 0;
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
                                resources: [validAudience, otherAudience],
                                enforcePerClientResources: false,
                                refreshTokenReuseInterval: 30,
                                customTokenResponseFields: function (_a) {
                                    var grantType = _a.grantType;
                                    if (grantType !== "refresh_token") {
                                        return {};
                                    }
                                    refreshTokenResponseCalls += 1;
                                    return {
                                        refresh_call: "".concat(refreshTokenResponseCalls),
                                    };
                                },
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), authorizationServer = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
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
                redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
                state = "123";
                /**
                 * @see https://github.com/better-auth/better-auth/issues/8512
                 */
                (0, vitest_1.it)("replays the same response inside the refresh token reuse interval", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, firstRefresh, replay, next;
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                    return __generator(this, function (_o) {
                        switch (_o.label) {
                            case 0: return [4 /*yield*/, createOAuthClient()];
                            case 1:
                                oauthClient = _o.sent();
                                refreshTokenResponseCalls = 0;
                                return [4 /*yield*/, authorizeForRefreshToken([
                                        "openid",
                                        "profile",
                                        "offline_access",
                                    ])];
                            case 2:
                                tokens = _o.sent();
                                return [4 /*yield*/, refresh(tokens.refresh_token)];
                            case 3:
                                firstRefresh = _o.sent();
                                (0, vitest_1.expect)(firstRefresh.error).toBeNull();
                                (0, vitest_1.expect)((_a = firstRefresh.data) === null || _a === void 0 ? void 0 : _a.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_b = firstRefresh.data) === null || _b === void 0 ? void 0 : _b.refresh_call).toBe("1");
                                return [4 /*yield*/, refresh(tokens.refresh_token)];
                            case 4:
                                replay = _o.sent();
                                (0, vitest_1.expect)(replay.error).toBeNull();
                                (0, vitest_1.expect)(replay.data).toMatchObject({
                                    access_token: (_c = firstRefresh.data) === null || _c === void 0 ? void 0 : _c.access_token,
                                    expires_at: (_d = firstRefresh.data) === null || _d === void 0 ? void 0 : _d.expires_at,
                                    token_type: (_e = firstRefresh.data) === null || _e === void 0 ? void 0 : _e.token_type,
                                    refresh_token: (_f = firstRefresh.data) === null || _f === void 0 ? void 0 : _f.refresh_token,
                                    scope: (_g = firstRefresh.data) === null || _g === void 0 ? void 0 : _g.scope,
                                    id_token: (_h = firstRefresh.data) === null || _h === void 0 ? void 0 : _h.id_token,
                                    refresh_call: "1",
                                });
                                (0, vitest_1.expect)((_j = replay.data) === null || _j === void 0 ? void 0 : _j.expires_in).toBeLessThanOrEqual(firstRefresh.data.expires_in);
                                (0, vitest_1.expect)(refreshTokenResponseCalls).toBe(1);
                                return [4 /*yield*/, refresh(firstRefresh.data.refresh_token)];
                            case 5:
                                next = _o.sent();
                                (0, vitest_1.expect)(next.error).toBeNull();
                                (0, vitest_1.expect)((_k = next.data) === null || _k === void 0 ? void 0 : _k.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_l = next.data) === null || _l === void 0 ? void 0 : _l.refresh_token).not.toEqual((_m = firstRefresh.data) === null || _m === void 0 ? void 0 : _m.refresh_token);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/8512
                 */
                (0, vitest_1.it)("replays equivalent requests when scope and resource order differ", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, firstRefresh, replay;
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, createOAuthClient()];
                            case 1:
                                oauthClient = _j.sent();
                                refreshTokenResponseCalls = 0;
                                return [4 /*yield*/, authorizeForRefreshToken([
                                        "openid",
                                        "profile",
                                        "offline_access",
                                    ])];
                            case 2:
                                tokens = _j.sent();
                                return [4 /*yield*/, refresh(tokens.refresh_token, {
                                        scope: "profile openid offline_access",
                                        resource: [validAudience, otherAudience],
                                    })];
                            case 3:
                                firstRefresh = _j.sent();
                                (0, vitest_1.expect)(firstRefresh.error).toBeNull();
                                (0, vitest_1.expect)((_a = firstRefresh.data) === null || _a === void 0 ? void 0 : _a.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_b = firstRefresh.data) === null || _b === void 0 ? void 0 : _b.refresh_call).toBe("1");
                                return [4 /*yield*/, refresh(tokens.refresh_token, {
                                        scope: "offline_access profile openid",
                                        resource: [otherAudience, validAudience],
                                    })];
                            case 4:
                                replay = _j.sent();
                                (0, vitest_1.expect)(replay.error).toBeNull();
                                (0, vitest_1.expect)(replay.data).toMatchObject({
                                    access_token: (_c = firstRefresh.data) === null || _c === void 0 ? void 0 : _c.access_token,
                                    expires_at: (_d = firstRefresh.data) === null || _d === void 0 ? void 0 : _d.expires_at,
                                    token_type: (_e = firstRefresh.data) === null || _e === void 0 ? void 0 : _e.token_type,
                                    refresh_token: (_f = firstRefresh.data) === null || _f === void 0 ? void 0 : _f.refresh_token,
                                    scope: (_g = firstRefresh.data) === null || _g === void 0 ? void 0 : _g.scope,
                                    id_token: (_h = firstRefresh.data) === null || _h === void 0 ? void 0 : _h.id_token,
                                    refresh_call: "1",
                                });
                                (0, vitest_1.expect)(refreshTokenResponseCalls).toBe(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10145
                 */
                (0, vitest_1.it)("returns the rotated token response when storing the replay cache fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, context, originalUpdate, update, loggerError, firstRefresh, next;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, createOAuthClient()];
                            case 1:
                                oauthClient = _e.sent();
                                refreshTokenResponseCalls = 0;
                                return [4 /*yield*/, authorizeForRefreshToken([
                                        "openid",
                                        "profile",
                                        "offline_access",
                                    ])];
                            case 2:
                                tokens = _e.sent();
                                return [4 /*yield*/, authorizationServer.$context];
                            case 3:
                                context = _e.sent();
                                originalUpdate = context.adapter.update.bind(context.adapter);
                                update = vitest_1.vi.spyOn(context.adapter, "update");
                                loggerError = vitest_1.vi
                                    .spyOn(context.logger, "error")
                                    .mockImplementation(function () { return undefined; });
                                update.mockImplementation(function () {
                                    var args = [];
                                    for (var _i = 0; _i < arguments.length; _i++) {
                                        args[_i] = arguments[_i];
                                    }
                                    return __awaiter(void 0, void 0, void 0, function () {
                                        var params;
                                        return __generator(this, function (_a) {
                                            params = args[0];
                                            if (params.model === "oauthRefreshToken" &&
                                                Object.prototype.hasOwnProperty.call(params.update, "rotationReplayResponse")) {
                                                throw new Error("replay cache unavailable");
                                            }
                                            return [2 /*return*/, originalUpdate.apply(void 0, args)];
                                        });
                                    });
                                });
                                _e.label = 4;
                            case 4:
                                _e.trys.push([4, , 7, 8]);
                                return [4 /*yield*/, refresh(tokens.refresh_token)];
                            case 5:
                                firstRefresh = _e.sent();
                                (0, vitest_1.expect)(firstRefresh.error).toBeNull();
                                (0, vitest_1.expect)((_a = firstRefresh.data) === null || _a === void 0 ? void 0 : _a.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_b = firstRefresh.data) === null || _b === void 0 ? void 0 : _b.refresh_call).toBe("1");
                                (0, vitest_1.expect)(loggerError).toHaveBeenCalledWith("failed to store refresh token rotation replay", vitest_1.expect.any(Error));
                                return [4 /*yield*/, refresh(firstRefresh.data.refresh_token)];
                            case 6:
                                next = _e.sent();
                                (0, vitest_1.expect)(next.error).toBeNull();
                                (0, vitest_1.expect)((_c = next.data) === null || _c === void 0 ? void 0 : _c.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_d = next.data) === null || _d === void 0 ? void 0 : _d.refresh_call).toBe("2");
                                return [3 /*break*/, 8];
                            case 7:
                                update.mockRestore();
                                loggerError.mockRestore();
                                return [7 /*endfinally*/];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/8512
                 */
                (0, vitest_1.it)("does not replay a cached response for a different resource", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, firstRefresh, mismatchedReplay, next;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, createOAuthClient()];
                            case 1:
                                oauthClient = _d.sent();
                                return [4 /*yield*/, authorizeForRefreshToken([
                                        "openid",
                                        "profile",
                                        "offline_access",
                                    ])];
                            case 2:
                                tokens = _d.sent();
                                return [4 /*yield*/, refresh(tokens.refresh_token, {
                                        resource: validAudience,
                                    })];
                            case 3:
                                firstRefresh = _d.sent();
                                (0, vitest_1.expect)(firstRefresh.error).toBeNull();
                                (0, vitest_1.expect)((_a = firstRefresh.data) === null || _a === void 0 ? void 0 : _a.refresh_token).toBeDefined();
                                return [4 /*yield*/, refresh(tokens.refresh_token, {
                                        resource: otherAudience,
                                    })];
                            case 4:
                                mismatchedReplay = _d.sent();
                                (0, vitest_1.expect)((_b = mismatchedReplay.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [4 /*yield*/, refresh(firstRefresh.data.refresh_token)];
                            case 5:
                                next = _d.sent();
                                (0, vitest_1.expect)(next.error).toBeNull();
                                (0, vitest_1.expect)((_c = next.data) === null || _c === void 0 ? void 0 : _c.refresh_token).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/8512
                 */
                (0, vitest_1.it)("invalidates the family after the reuse interval expires", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, firstRefresh, context, rotatedRows, rotatedRow, replay, childReplay;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, createOAuthClient()];
                            case 1:
                                oauthClient = _d.sent();
                                return [4 /*yield*/, authorizeForRefreshToken([
                                        "openid",
                                        "profile",
                                        "offline_access",
                                    ])];
                            case 2:
                                tokens = _d.sent();
                                return [4 /*yield*/, refresh(tokens.refresh_token)];
                            case 3:
                                firstRefresh = _d.sent();
                                (0, vitest_1.expect)(firstRefresh.error).toBeNull();
                                (0, vitest_1.expect)((_a = firstRefresh.data) === null || _a === void 0 ? void 0 : _a.refresh_token).toBeDefined();
                                return [4 /*yield*/, authorizationServer.$context];
                            case 4:
                                context = _d.sent();
                                return [4 /*yield*/, context.adapter.findMany({
                                        model: "oauthRefreshToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 5:
                                rotatedRows = _d.sent();
                                rotatedRow = rotatedRows.find(function (row) { return row.rotationReplayResponse; });
                                (0, vitest_1.expect)(rotatedRow === null || rotatedRow === void 0 ? void 0 : rotatedRow.id).toBeDefined();
                                return [4 /*yield*/, context.adapter.update({
                                        model: "oauthRefreshToken",
                                        where: [{ field: "id", value: rotatedRow.id }],
                                        update: {
                                            rotationReplayExpiresAt: new Date(0),
                                        },
                                    })];
                            case 6:
                                _d.sent();
                                return [4 /*yield*/, refresh(tokens.refresh_token)];
                            case 7:
                                replay = _d.sent();
                                (0, vitest_1.expect)((_b = replay.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [4 /*yield*/, refresh(firstRefresh.data.refresh_token)];
                            case 8:
                                childReplay = _d.sent();
                                (0, vitest_1.expect)((_c = childReplay.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth token - client_credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, validResource, allScopes, clientScopes, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri, jwks;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                validResource = "https://myapi.example.com";
                allScopes = ["openid", "profile", "email", "read:posts", "write:posts"];
                clientScopes = ["read:posts", "write:posts"];
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
                                allowDynamicClientRegistration: true,
                                scopes: allScopes,
                                clientPrivileges: function () { return true; },
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
                // Registers a confidential client application to work with
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, jwksResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: [
                                            "authorization_code",
                                            "client_credentials",
                                            "refresh_token",
                                        ],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                        scope: clientScopes.join(" "),
                                        client_credentials_scopes: clientScopes,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.scope).toEqual(clientScopes.join(" "));
                                oauthClient = response;
                                return [4 /*yield*/, client.$fetch("/jwks", { method: "GET" })];
                            case 2:
                                jwksResult = _a.sent();
                                if (!jwksResult.data) {
                                    throw new Error("Unable to fetch jwks");
                                }
                                jwks = (0, jose_1.createLocalJWKSet)(jwksResult.data);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should obtain an opaque access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var scopes, _a, body, headers, tokens;
                    var _b, _c, _d, _e, _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["read:posts"];
                                return [4 /*yield*/, (0, oauth2_1.clientCredentialsTokenRequest)({
                                        authentication: "basic",
                                        scope: scopes.join(" "),
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 1:
                                _a = _h.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 2:
                                tokens = _h.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeUndefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeUndefined();
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.scope).toBe(scopes.join(" "));
                                (0, vitest_1.expect)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.expires_in).toBe(3600);
                                (0, vitest_1.expect)((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.expires_at).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("lets an admin disable and re-enable a client without deleting it", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var registered, requestToken, issuedToken, resourceServer, introspect, initialIntrospection, disabled, _a, blocked, userUpdate, enabled, _b;
                    var _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        client_credentials_scopes: ["read:posts"],
                                    },
                                })];
                            case 1:
                                registered = _j.sent();
                                if (!registered.client_secret)
                                    throw new Error("missing client secret");
                                requestToken = function () {
                                    return client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "client_credentials",
                                            resource: validResource,
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                            authorization: "Basic ".concat(Buffer.from("".concat(registered.client_id, ":").concat(registered.client_secret)).toString("base64")),
                                        },
                                    });
                                };
                                return [4 /*yield*/, requestToken()];
                            case 2:
                                issuedToken = (_c = (_j.sent()).data) === null || _c === void 0 ? void 0 : _c.access_token;
                                (0, vitest_1.expect)(issuedToken).toBeDefined();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            grant_types: ["client_credentials"],
                                            token_endpoint_auth_method: "client_secret_post",
                                        },
                                    })];
                            case 3:
                                resourceServer = _j.sent();
                                if (!resourceServer.client_secret)
                                    throw new Error("missing resource server secret");
                                return [4 /*yield*/, auth.api.adminLinkClientResource({
                                        headers: headers,
                                        params: {
                                            identifier: encodeURIComponent(validResource),
                                            client_id: resourceServer.client_id,
                                        },
                                    })];
                            case 4:
                                _j.sent();
                                introspect = function () {
                                    return client.oauth2.introspect({
                                        client_id: resourceServer.client_id,
                                        client_secret: resourceServer.client_secret,
                                        token: issuedToken,
                                    }, { headers: { "content-type": "application/x-www-form-urlencoded" } });
                                };
                                return [4 /*yield*/, introspect()];
                            case 5:
                                initialIntrospection = _j.sent();
                                (0, vitest_1.expect)(initialIntrospection.error).toBeNull();
                                (0, vitest_1.expect)((_d = initialIntrospection.data) === null || _d === void 0 ? void 0 : _d.active).toBe(true);
                                return [4 /*yield*/, auth.api.adminUpdateOAuthClient({
                                        headers: headers,
                                        body: { client_id: registered.client_id, update: { disabled: true } },
                                    })];
                            case 6:
                                disabled = _j.sent();
                                (0, vitest_1.expect)(disabled.disabled).toBe(true);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, introspect()];
                            case 7:
                                _a.apply(void 0, [(_j.sent()).data]).toEqual({ active: false });
                                return [4 /*yield*/, requestToken()];
                            case 8:
                                blocked = _j.sent();
                                (0, vitest_1.expect)((_e = blocked.error) === null || _e === void 0 ? void 0 : _e.status).toBe(401);
                                (0, vitest_1.expect)((_f = blocked.error) === null || _f === void 0 ? void 0 : _f.error).toBe("invalid_client");
                                return [4 /*yield*/, client.$fetch("/oauth2/update-client", {
                                        method: "POST",
                                        body: {
                                            client_id: registered.client_id,
                                            update: { disabled: false },
                                        },
                                    })];
                            case 9:
                                userUpdate = _j.sent();
                                (0, vitest_1.expect)((_g = userUpdate.data) === null || _g === void 0 ? void 0 : _g.disabled).toBe(true);
                                return [4 /*yield*/, auth.api.adminUpdateOAuthClient({
                                        headers: headers,
                                        body: { client_id: registered.client_id, update: { disabled: false } },
                                    })];
                            case 10:
                                enabled = _j.sent();
                                (0, vitest_1.expect)(enabled.disabled).toBe(false);
                                _b = vitest_1.expect;
                                return [4 /*yield*/, requestToken()];
                            case 11:
                                _b.apply(void 0, [(_h = (_j.sent()).data) === null || _h === void 0 ? void 0 : _h.access_token]).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns invalid_request when client_credentials omits client_id", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: new URLSearchParams({ grant_type: "client_credentials" }),
                                    headers: {
                                        "content-type": "application/x-www-form-urlencoded",
                                    },
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects repeated form client authentication fields", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: new URLSearchParams([
                                        ["grant_type", "client_credentials"],
                                        ["client_id", "repeated-auth-client"],
                                        ["client_secret", "first"],
                                        ["client_secret", "second"],
                                    ]),
                                    headers: {
                                        "content-type": "application/x-www-form-urlencoded",
                                    },
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10752#pullrequestreview-4910497732
                 */
                (0, vitest_1.it)("rejects repeated non-empty form client IDs", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !oauthClient.client_secret) {
                                    throw new Error("OAuth client was not created");
                                }
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams([
                                            ["grant_type", "client_credentials"],
                                            ["client_id", oauthClient.client_id],
                                            ["client_id", "duplicate-client"],
                                            ["scope", "read:posts"],
                                        ]),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                            authorization: "Basic ".concat(Buffer.from("".concat(oauthClient.client_id, ":").concat(oauthClient.client_secret)).toString("base64")),
                                        },
                                    })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a secret method different from the registered method", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !oauthClient.client_secret) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "client_credentials",
                                            client_id: oauthClient.client_id,
                                            client_secret: oauthClient.client_secret,
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                (0, vitest_1.expect)((_c = response.error) === null || _c === void 0 ? void 0 : _c.error_description).toContain("registered for client_secret_basic");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/croffasia/itsaplan/issues/564
                 */
                (0, vitest_1.it)("reports an unknown client_id as a client that was not found", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: new URLSearchParams({
                                        grant_type: "client_credentials",
                                        client_id: "no-such-client",
                                        client_secret: "no-such-secret",
                                    }),
                                    headers: {
                                        "content-type": "application/x-www-form-urlencoded",
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.error).toMatchObject({
                                    error: "invalid_client",
                                    error_description: "client not found",
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns 400 for failed client_secret_post authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var postClient, responseHeaders, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        token_endpoint_auth_method: "client_secret_post",
                                        client_credentials_scopes: ["read:posts"],
                                    },
                                })];
                            case 1:
                                postClient = _c.sent();
                                if (!(postClient === null || postClient === void 0 ? void 0 : postClient.client_id)) {
                                    throw Error("client_secret_post client was not created");
                                }
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "client_credentials",
                                            client_id: postClient.client_id,
                                            client_secret: "wrong-secret",
                                        }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        onError: function (context) {
                                            responseHeaders = context.response.headers;
                                        },
                                    })];
                            case 2:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                (0, vitest_1.expect)(responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.has("WWW-Authenticate")).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("challenges failed client_secret_basic authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var responseHeaders, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({ grant_type: "client_credentials" }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                            authorization: "Basic ".concat(Buffer.from("".concat(oauthClient.client_id, ":wrong-secret")).toString("base64")),
                                        },
                                        onError: function (context) {
                                            responseHeaders = context.response.headers;
                                        },
                                    })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                (0, vitest_1.expect)(responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get("WWW-Authenticate")).toBe("Basic");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("challenges client_secret_basic authentication without a secret", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var responseHeaders, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({ grant_type: "client_credentials" }),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                            authorization: "Basic ".concat(Buffer.from("".concat(oauthClient.client_id, ":")).toString("base64")),
                                        },
                                        onError: function (context) {
                                            responseHeaders = context.response.headers;
                                        },
                                    })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                (0, vitest_1.expect)(responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get("WWW-Authenticate")).toBe("Basic");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("challenges an unknown client_secret_basic client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var responseHeaders, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: new URLSearchParams({ grant_type: "client_credentials" }),
                                    headers: {
                                        "content-type": "application/x-www-form-urlencoded",
                                        authorization: "Basic ".concat(Buffer.from("unknown-client:secret").toString("base64")),
                                    },
                                    onError: function (context) {
                                        responseHeaders = context.response.headers;
                                    },
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                (0, vitest_1.expect)(responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get("WWW-Authenticate")).toBe("Basic");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should match created client scopes", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, body, headers, tokens;
                    var _d, _e, _f, _g, _h, _j;
                    var expect = _b.expect;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, (0, oauth2_1.clientCredentialsTokenRequest)({
                                        authentication: "basic",
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 1:
                                _c = _k.sent(), body = _c.body, headers = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 2:
                                tokens = _k.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                expect((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.id_token).toBeUndefined();
                                expect((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.refresh_token).toBeUndefined();
                                expect((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.scope).toBe(clientScopes.join(" "));
                                expect((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.expires_in).toBe(3600);
                                expect((_j = tokens.data) === null || _j === void 0 ? void 0 : _j.expires_at).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should obtain a JWT access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var scopes, _a, body, headers, tokens, accessToken;
                    var _b, _c, _d, _e, _f, _g, _h, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["read:posts"];
                                return [4 /*yield*/, (0, oauth2_1.clientCredentialsTokenRequest)({
                                        authentication: "basic",
                                        scope: scopes.join(" "),
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        resource: validResource,
                                    })];
                            case 1:
                                _a = _k.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 2:
                                tokens = _k.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeUndefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeUndefined();
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.scope).toBe(scopes.join(" "));
                                (0, vitest_1.expect)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.expires_in).toBe(3600);
                                (0, vitest_1.expect)((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.expires_at).toBeDefined();
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.access_token, jwks, {
                                        audience: validResource,
                                        issuer: authServerBaseUrl,
                                    })];
                            case 3:
                                accessToken = _k.sent();
                                (0, vitest_1.expect)(accessToken.payload.azp).toBe(oauthClient.client_id);
                                (0, vitest_1.expect)(accessToken.payload.sub).toBe(oauthClient.client_id);
                                (0, vitest_1.expect)(accessToken.payload.iat).toBeDefined();
                                (0, vitest_1.expect)(accessToken.payload.exp).toBe((_j = tokens.data) === null || _j === void 0 ? void 0 : _j.expires_at);
                                (0, vitest_1.expect)(accessToken.payload.scope).toBe(scopes.join(" "));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a client_credentials scope outside the administrator-owned ceiling", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, body, headers, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, (0, oauth2_1.clientCredentialsTokenRequest)({
                                        authentication: "basic",
                                        scope: "delete:posts",
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 1:
                                _a = _d.sent(), body = _a.body, headers = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: headers,
                                    })];
                            case 2:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_b = tokens.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)((_c = tokens.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_scope");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth token - customIdTokenClaims precedence", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri, state, jwks;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
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
                                customIdTokenClaims: function () { return ({
                                    given_name: "CustomFirst",
                                    family_name: "CustomLast",
                                    custom_field: "custom_value",
                                }); },
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
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, jwksResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        grant_types: [
                                            "authorization_code",
                                            "client_credentials",
                                            "refresh_token",
                                        ],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toBeDefined();
                                oauthClient = response;
                                return [4 /*yield*/, client.$fetch("/jwks", { method: "GET" })];
                            case 2:
                                jwksResult = _a.sent();
                                if (!jwksResult.data) {
                                    throw new Error("Unable to fetch jwks");
                                }
                                jwks = (0, jose_1.createLocalJWKSet)(jwksResult.data);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("custom claims can add profile claim names to id_token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var scopes, codeVerifier, url, callbackRedirectUrl, callbackUrl, code, returnedState, _c, body, reqHeaders, tokens, idToken;
                    var _d, _e;
                    var expect = _b.expect;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                scopes = ["openid", "profile"];
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: scopes,
                                        codeVerifier: codeVerifier,
                                    })];
                            case 1:
                                url = _f.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(url.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _f.sent();
                                expect(callbackRedirectUrl).not.toBe("");
                                expect(callbackRedirectUrl).toContain(redirectUri);
                                callbackUrl = new URL(callbackRedirectUrl);
                                code = callbackUrl.searchParams.get("code");
                                returnedState = callbackUrl.searchParams.get("state");
                                expect(code).toBeTruthy();
                                expect(returnedState).toBe(state);
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 3:
                                _c = _f.sent(), body = _c.body, reqHeaders = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: reqHeaders,
                                    })];
                            case 4:
                                tokens = _f.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.id_token).toBeDefined();
                                return [4 /*yield*/, (0, jose_1.jwtVerify)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.id_token, jwks)];
                            case 5:
                                idToken = _f.sent();
                                // First-party custom claims can deliberately place profile claims in the
                                // ID token, even though scopes now place them on UserInfo by default.
                                expect(idToken.payload.given_name).toBe("CustomFirst");
                                expect(idToken.payload.family_name).toBe("CustomLast");
                                expect(idToken.payload.custom_field).toBe("custom_value");
                                expect(idToken.payload.name).toBeUndefined();
                                expect(idToken.payload.sub).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth token - config", function () { return __awaiter(void 0, void 0, void 0, function () {
    function createTestInstance(opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, auth, customFetchImpl, signInWithTestUser, headers, client, registeredClient;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: __spreadArray([
                                (0, oauth_1.oauthProvider)(__assign({ loginPage: "/login", consentPage: "/consent", resources: [validResource], enforcePerClientResources: false, scopes: scopes, clientPrivileges: function () { return true; } }, opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig))
                            ], (((_b = opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig) === null || _b === void 0 ? void 0 : _b.disableJwtPlugin)
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
                        _a = _c.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl, signInWithTestUser = _a.signInWithTestUser;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_c.sent()).headers;
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
                                    token_endpoint_auth_method: "client_secret_post",
                                    grant_types: [
                                        "authorization_code",
                                        "client_credentials",
                                        "refresh_token",
                                    ],
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                    skip_consent: true,
                                    client_credentials_scopes: [
                                        "read:payments",
                                        "write:payments",
                                        "read:profile",
                                    ],
                                },
                            })];
                    case 3:
                        registeredClient = _c.sent();
                        return [2 /*return*/, {
                                client: client,
                                oauthClient: registeredClient,
                            }];
                }
            });
        });
    }
    function createAuthUrl(credentials, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)(__assign({ id: providerId, options: credentials, redirectURI: redirectUri, authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"), state: state, scopes: scopes, codeVerifier: codeVerifier }, overrides))];
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
    var authServerBaseUrl, rpBaseUrl, validResource, providerId, redirectUri, state, scopes;
    return __generator(this, function (_a) {
        authServerBaseUrl = "http://localhost:3000";
        rpBaseUrl = "http://localhost:5000";
        validResource = "https://myapi.example.com";
        providerId = "test";
        redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
        state = "123";
        scopes = [
            "openid",
            "email",
            "profile",
            "offline_access",
            "read:payments", // should use scopeExpirations 30m
            "write:payments", // should use scopeExpirations 5m
            "read:profile", // should use default
        ];
        // Client Credentials Grant
        vitest_1.it.for([
            {
                testScopes: ["read:payments"],
                result: 1800, // 30m lowest
            },
            {
                testScopes: ["read:payments", "write:payments"],
                result: 300, // 5m lowest
            },
            {
                testScopes: ["read:profile"],
                result: 7200, // m2m expiresIn 2hr
            },
        ])("scopeExpirations - access token expiration $testScopes", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var _c, client, oauthClient, tokens, accessToken;
            var _d, _e, _f, _g, _h;
            var testScopes = _b.testScopes, result = _b.result;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, createTestInstance({
                            oauthProviderConfig: {
                                m2mAccessTokenExpiresIn: 7200,
                                scopeExpirations: {
                                    "read:payments": "30m",
                                    "write:payments": "5m",
                                },
                            },
                        })];
                    case 1:
                        _c = _j.sent(), client = _c.client, oauthClient = _c.oauthClient;
                        return [4 /*yield*/, client.oauth2.token({
                                resource: validResource,
                                grant_type: "client_credentials",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                scope: testScopes.join(" "),
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 2:
                        tokens = _j.sent();
                        (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.expires_in).toBe(result); // 5m lowest
                        accessToken = (0, jose_1.decodeJwt)((_f = (_e = tokens.data) === null || _e === void 0 ? void 0 : _e.access_token) !== null && _f !== void 0 ? _f : "");
                        (0, vitest_1.expect)(((_g = accessToken.exp) !== null && _g !== void 0 ? _g : 0) - ((_h = accessToken.iat) !== null && _h !== void 0 ? _h : 0)).toBe(result); // 5m lowest
                        return [2 /*return*/];
                }
            });
        }); });
        // Authorization Code and Refresh Token grants
        vitest_1.it.for([
            {
                testScopes: ["read:payments", "offline_access"],
                result: 1800, // 30m lowest
            },
            {
                testScopes: ["read:payments", "write:payments", "offline_access"],
                result: 300, // 5m lowest
            },
            {
                testScopes: ["profile", "offline_access"],
                result: 7200, // accessTokenExpiresIn 2hr
            },
        ])("scopeExpirations - access token expiration $testScopes", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var _c, client, oauthClient, _d, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, accessToken, refreshedTokens, refreshedAccessToken;
            var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            var testScopes = _b.testScopes, result = _b.result;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0: return [4 /*yield*/, createTestInstance({
                            oauthProviderConfig: {
                                accessTokenExpiresIn: 7200,
                                scopeExpirations: {
                                    "read:payments": "30m",
                                    "write:payments": "5m",
                                },
                            },
                        })];
                    case 1:
                        _c = _r.sent(), client = _c.client, oauthClient = _c.oauthClient;
                        return [4 /*yield*/, createAuthUrl({
                                clientId: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                clientSecret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                            }, {
                                scopes: testScopes,
                            })];
                    case 2:
                        _d = _r.sent(), authUrl = _d.url, codeVerifier = _d.codeVerifier;
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 3:
                        _r.sent();
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                        url = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, client.oauth2.token({
                                code: url.searchParams.get("code"),
                                code_verifier: codeVerifier,
                                grant_type: "authorization_code",
                                resource: validResource,
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                redirect_uri: redirectUri,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 4:
                        tokens = _r.sent();
                        (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.expires_in).toBe(result); // 5m lowest
                        accessToken = (0, jose_1.decodeJwt)((_g = (_f = tokens.data) === null || _f === void 0 ? void 0 : _f.access_token) !== null && _g !== void 0 ? _g : "");
                        (0, vitest_1.expect)(((_h = accessToken.exp) !== null && _h !== void 0 ? _h : 0) - ((_j = accessToken.iat) !== null && _j !== void 0 ? _j : 0)).toBe(result); // 5m lowest
                        return [4 /*yield*/, client.oauth2.token({
                                resource: validResource,
                                refresh_token: (_k = tokens.data) === null || _k === void 0 ? void 0 : _k.refresh_token,
                                grant_type: "refresh_token",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 5:
                        refreshedTokens = _r.sent();
                        (0, vitest_1.expect)((_l = refreshedTokens.data) === null || _l === void 0 ? void 0 : _l.expires_in).toBe(result); // 5m lowest
                        refreshedAccessToken = (0, jose_1.decodeJwt)((_o = (_m = refreshedTokens.data) === null || _m === void 0 ? void 0 : _m.access_token) !== null && _o !== void 0 ? _o : "");
                        (0, vitest_1.expect)(((_p = refreshedAccessToken.exp) !== null && _p !== void 0 ? _p : 0) - ((_q = refreshedAccessToken.iat) !== null && _q !== void 0 ? _q : 0)).toBe(result); // 5m lowest
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("opaqueAccessTokenPrefix - client_credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
            var prefix, testScopes, _a, client, oauthClient, tokens;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        prefix = "hello_";
                        testScopes = ["read:profile"];
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    prefix: {
                                        opaqueAccessToken: prefix,
                                    },
                                },
                            })];
                    case 1:
                        _a = _d.sent(), client = _a.client, oauthClient = _a.oauthClient;
                        return [4 /*yield*/, client.oauth2.token({
                                grant_type: "client_credentials",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                scope: testScopes.join(" "),
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 2:
                        tokens = _d.sent();
                        (0, vitest_1.expect)((_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) === null || _c === void 0 ? void 0 : _c.startsWith(prefix)).toBeTruthy();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("opaqueAccessTokenPrefix, refreshTokenPrefix - code_authorization, refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var accessTokenPrefix, refreshTokenPrefix, _a, client, oauthClient, _b, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, refreshedTokens;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        accessTokenPrefix = "hello__ac_";
                        refreshTokenPrefix = "hello_rt_";
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    prefix: {
                                        opaqueAccessToken: accessTokenPrefix,
                                        refreshToken: refreshTokenPrefix,
                                    },
                                },
                            })];
                    case 1:
                        _a = _m.sent(), client = _a.client, oauthClient = _a.oauthClient;
                        return [4 /*yield*/, createAuthUrl({
                                clientId: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                clientSecret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                            })];
                    case 2:
                        _b = _m.sent(), authUrl = _b.url, codeVerifier = _b.codeVerifier;
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 3:
                        _m.sent();
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                        url = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, client.oauth2.token({
                                code: url.searchParams.get("code"),
                                code_verifier: codeVerifier,
                                grant_type: "authorization_code",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                redirect_uri: redirectUri,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 4:
                        tokens = _m.sent();
                        (0, vitest_1.expect)((_d = (_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token) === null || _d === void 0 ? void 0 : _d.startsWith(accessTokenPrefix)).toBeTruthy();
                        if ("refresh_token" in ((_e = tokens.data) !== null && _e !== void 0 ? _e : {})) {
                            (0, vitest_1.expect)((_f = tokens.data.refresh_token) === null || _f === void 0 ? void 0 : _f.startsWith(refreshTokenPrefix)).toBeTruthy();
                        }
                        else {
                            vitest_1.expect.unreachable();
                        }
                        return [4 /*yield*/, client.oauth2.token({
                                refresh_token: (_g = tokens.data) === null || _g === void 0 ? void 0 : _g.refresh_token,
                                grant_type: "refresh_token",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 5:
                        refreshedTokens = _m.sent();
                        (0, vitest_1.expect)((_j = (_h = refreshedTokens.data) === null || _h === void 0 ? void 0 : _h.access_token) === null || _j === void 0 ? void 0 : _j.startsWith(accessTokenPrefix)).toBeTruthy();
                        if ("refresh_token" in ((_k = refreshedTokens.data) !== null && _k !== void 0 ? _k : {})) {
                            (0, vitest_1.expect)((_l = refreshedTokens.data.refresh_token) === null || _l === void 0 ? void 0 : _l.startsWith(refreshTokenPrefix)).toBeTruthy();
                        }
                        else {
                            vitest_1.expect.unreachable();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("formatRefreshToken with an async encrypt - code_authorization, refresh_token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var refreshTokenPrefix, _a, client, oauthClient, _b, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, refreshToken, refreshedTokens;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        refreshTokenPrefix = "hello_rt_";
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    prefix: {
                                        refreshToken: refreshTokenPrefix,
                                    },
                                    formatRefreshToken: {
                                        encrypt: function (token) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, "enc.".concat(token)];
                                        }); }); },
                                        decrypt: function (value) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, ({ token: value.slice("enc.".length) })];
                                        }); }); },
                                    },
                                },
                            })];
                    case 1:
                        _a = _e.sent(), client = _a.client, oauthClient = _a.oauthClient;
                        return [4 /*yield*/, createAuthUrl({
                                clientId: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                clientSecret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                            })];
                    case 2:
                        _b = _e.sent(), authUrl = _b.url, codeVerifier = _b.codeVerifier;
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 3:
                        _e.sent();
                        url = new URL(callbackRedirectUrl);
                        return [4 /*yield*/, client.oauth2.token({
                                code: url.searchParams.get("code"),
                                code_verifier: codeVerifier,
                                grant_type: "authorization_code",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                redirect_uri: redirectUri,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 4:
                        tokens = _e.sent();
                        refreshToken = (_c = tokens.data) === null || _c === void 0 ? void 0 : _c.refresh_token;
                        (0, vitest_1.expect)(refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.startsWith("".concat(refreshTokenPrefix, "enc."))).toBe(true);
                        return [4 /*yield*/, client.oauth2.token({
                                refresh_token: refreshToken,
                                grant_type: "refresh_token",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 5:
                        refreshedTokens = _e.sent();
                        (0, vitest_1.expect)(refreshedTokens.error).toBeNull();
                        (0, vitest_1.expect)((_d = refreshedTokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toMatch(new RegExp("^".concat(refreshTokenPrefix, "enc\\.")));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("clientSecretPrefix - client_credentials", function () { return __awaiter(void 0, void 0, void 0, function () {
            var prefix, testScopes, _a, client, oauthClient, tokens;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        prefix = "hello_cs_";
                        testScopes = ["read:profile"];
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    prefix: {
                                        clientSecret: prefix,
                                    },
                                },
                            })];
                    case 1:
                        _a = _e.sent(), client = _a.client, oauthClient = _a.oauthClient;
                        (0, vitest_1.expect)((_b = oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret) === null || _b === void 0 ? void 0 : _b.startsWith(prefix)).toBeTruthy();
                        return [4 /*yield*/, client.oauth2.token({
                                grant_type: "client_credentials",
                                client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                scope: testScopes.join(""),
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                            })];
                    case 2:
                        tokens = _e.sent();
                        (0, vitest_1.expect)((_c = tokens.error) === null || _c === void 0 ? void 0 : _c.status).toBeUndefined();
                        (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * @see https://github.com/better-auth/better-auth/issues/12227
         */
        (0, vitest_1.it)("rejects a client secret without the configured prefix like any wrong secret", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, auth, signInWithTestUser, headers, basicClient, postClient, tokenUrl, basic, post;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    scopes: scopes,
                                    clientPrivileges: function () { return true; },
                                    prefix: {
                                        clientSecret: "hello_cs_",
                                    },
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
                                    token_endpoint_auth_method: "client_secret_basic",
                                    grant_types: ["client_credentials"],
                                    client_credentials_scopes: ["read:profile"],
                                },
                            })];
                    case 3:
                        basicClient = _b.sent();
                        return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    token_endpoint_auth_method: "client_secret_post",
                                    grant_types: ["client_credentials"],
                                    client_credentials_scopes: ["read:profile"],
                                },
                            })];
                    case 4:
                        postClient = _b.sent();
                        tokenUrl = "".concat(authServerBaseUrl, "/api/auth/oauth2/token");
                        return [4 /*yield*/, auth.handler(new Request(tokenUrl, {
                                method: "POST",
                                headers: {
                                    "content-type": "application/x-www-form-urlencoded",
                                    authorization: "Basic ".concat(Buffer.from("".concat(basicClient.client_id, ":wrong-secret")).toString("base64")),
                                },
                                body: new URLSearchParams({ grant_type: "client_credentials" }),
                            }))];
                    case 5:
                        basic = _b.sent();
                        return [4 /*yield*/, auth.handler(new Request(tokenUrl, {
                                method: "POST",
                                headers: {
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                                body: new URLSearchParams({
                                    grant_type: "client_credentials",
                                    client_id: postClient.client_id,
                                    client_secret: "wrong-secret",
                                }),
                            }))];
                    case 6:
                        post = _b.sent();
                        return [4 /*yield*/, (0, vitest_1.expect)(basic.json()).resolves.toMatchObject({
                                error: "invalid_client",
                            })];
                    case 7:
                        _b.sent();
                        (0, vitest_1.expect)(basic.status).toBe(401);
                        (0, vitest_1.expect)(basic.headers.get("WWW-Authenticate")).toBe("Basic");
                        return [4 /*yield*/, (0, vitest_1.expect)(post.json()).resolves.toMatchObject({
                                error: "invalid_client",
                            })];
                    case 8:
                        _b.sent();
                        (0, vitest_1.expect)(post.status).toBe(400);
                        (0, vitest_1.expect)(post.headers.has("WWW-Authenticate")).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
(0, vitest_1.describe)("oauth token - client secret validation", function () { return __awaiter(void 0, void 0, void 0, function () {
    function createValidationInstance(opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, auth, customFetchImpl, signInWithTestUser, db, headers, client, oauthClient;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: __spreadArray([
                                (0, oauth_1.oauthProvider)(__assign({ loginPage: "/login", consentPage: "/consent", resources: [validResource], enforcePerClientResources: false, scopes: scopes }, opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig))
                            ], (((_b = opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig) === null || _b === void 0 ? void 0 : _b.disableJwtPlugin)
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
                        _a = _c.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl, signInWithTestUser = _a.signInWithTestUser, db = _a.db;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        headers = (_c.sent()).headers;
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
                                    token_endpoint_auth_method: "client_secret_post",
                                    grant_types: [
                                        "authorization_code",
                                        "client_credentials",
                                        "refresh_token",
                                    ],
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                    skip_consent: true,
                                },
                            })];
                    case 3:
                        oauthClient = _c.sent();
                        return [2 /*return*/, { client: client, oauthClient: oauthClient, db: db }];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, validResource, providerId, redirectUri, scopes;
    return __generator(this, function (_a) {
        authServerBaseUrl = "http://localhost:3010";
        rpBaseUrl = "http://localhost:5010";
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
        /**
         * @see https://github.com/better-auth/better-auth/issues/8016
         */
        (0, vitest_1.it)("should return invalid_client for encrypted client secret format mismatch", function () { return __awaiter(void 0, void 0, void 0, function () {
            var storedClientSecret, _a, client, oauthClient, db, responseStatus, tokenResponse;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        storedClientSecret = "Mda8BIefhR8eFkYfFq8H7XAW-fj8GNjQYKPfN8LZ6u8";
                        return [4 /*yield*/, createValidationInstance({
                                oauthProviderConfig: {
                                    storeClientSecret: "encrypted",
                                    disableJwtPlugin: true,
                                },
                            })];
                    case 1:
                        _a = _b.sent(), client = _a.client, oauthClient = _a.oauthClient, db = _a.db;
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        return [4 /*yield*/, db.update({
                                model: "oauthClient",
                                where: [{ field: "clientId", value: oauthClient.client_id }],
                                update: { clientSecret: storedClientSecret },
                            })];
                    case 2:
                        _b.sent();
                        responseStatus = 0;
                        return [4 /*yield*/, client.oauth2.token({
                                grant_type: "client_credentials",
                                client_id: oauthClient.client_id,
                                client_secret: oauthClient.client_secret,
                                scope: "read:profile",
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                                onError: function (context) {
                                    responseStatus = context.response.status;
                                },
                            })];
                    case 3:
                        tokenResponse = _b.sent();
                        (0, vitest_1.expect)(responseStatus).toBe(400);
                        (0, vitest_1.expect)(tokenResponse.error).toMatchObject({
                            error: "invalid_client",
                            error_description: "invalid client_secret",
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should propagate custom decrypt storage errors during client secret verification", function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, client, oauthClient, responseStatus;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createValidationInstance({
                            oauthProviderConfig: {
                                storeClientSecret: {
                                    encrypt: function (clientSecret) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, clientSecret];
                                    }); }); },
                                    decrypt: function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            throw new Error("decrypt service unavailable");
                                        });
                                    }); },
                                },
                                disableJwtPlugin: true,
                            },
                        })];
                    case 1:
                        _a = _b.sent(), client = _a.client, oauthClient = _a.oauthClient;
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        responseStatus = 0;
                        return [4 /*yield*/, client.oauth2.token({
                                grant_type: "client_credentials",
                                client_id: oauthClient.client_id,
                                client_secret: oauthClient.client_secret,
                                scope: "read:profile",
                            }, {
                                headers: {
                                    accept: "application/json",
                                    "content-type": "application/x-www-form-urlencoded",
                                },
                                onError: function (context) {
                                    responseStatus = context.response.status;
                                },
                            })];
                    case 2:
                        _b.sent();
                        (0, vitest_1.expect)(responseStatus).toBe(500);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
(0, vitest_1.describe)("id token claim override security", function () { return __awaiter(void 0, void 0, void 0, function () {
    function getIdTokenClaims() {
        return __awaiter(this, void 0, void 0, function () {
            var scopes, codeVerifier, url, callbackRedirectUrl, callbackUrl, code, returnedState, _a, body, reqHeaders, tokens;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        scopes = ["openid", "profile"];
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                id: providerId,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                redirectURI: "",
                                authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                state: state,
                                scopes: scopes,
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        url = _c.sent();
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(url.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _c.sent();
                        (0, vitest_1.expect)(callbackRedirectUrl).not.toBe("");
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                        callbackUrl = new URL(callbackRedirectUrl);
                        code = callbackUrl.searchParams.get("code");
                        returnedState = callbackUrl.searchParams.get("state");
                        (0, vitest_1.expect)(code).toBeTruthy();
                        (0, vitest_1.expect)(returnedState).toBe(state);
                        return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                code: code,
                                codeVerifier: codeVerifier,
                                redirectURI: redirectUri,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                            })];
                    case 3:
                        _a = _c.sent(), body = _a.body, reqHeaders = _a.headers;
                        return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: reqHeaders,
                            })];
                    case 4:
                        tokens = _c.sent();
                        (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.id_token).toBeDefined();
                        return [2 /*return*/, (0, jose_1.decodeJwt)(tokens.data.id_token)];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri, state;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
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
                                customIdTokenClaims: function () { return ({
                                    acr: "silver",
                                    auth_time: 0,
                                    amr: ["evil"],
                                    sub: "evil",
                                    iss: "https://evil.com",
                                    aud: "evil-client",
                                    nonce: "evil-nonce",
                                    iat: 0,
                                    nbf: 0,
                                    exp: 0,
                                    jti: "evil-jti",
                                    azp: "evil-authorized-party",
                                    sid: "evil-sid",
                                    at_hash: "evil-at-hash",
                                    c_hash: "evil-code-hash",
                                    s_hash: "evil-state-hash",
                                    "https://example.com/custom": "safe-custom-claim",
                                }); },
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
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        grant_types: [
                                            "authorization_code",
                                            "client_credentials",
                                            "refresh_token",
                                        ],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toBeDefined();
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("customIdTokenClaims cannot override authentication context claims", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var claims;
                    var expect = _b.expect;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getIdTokenClaims()];
                            case 1:
                                claims = _c.sent();
                                expect(claims.acr).toBe("0");
                                expect(claims.auth_time).not.toBe(0);
                                expect(claims.amr).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("customIdTokenClaims cannot override provider-owned id token claims", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var claims;
                    var expect = _b.expect;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getIdTokenClaims()];
                            case 1:
                                claims = _c.sent();
                                expect(claims.sub).not.toBe("evil");
                                expect(claims.iss).not.toBe("https://evil.com");
                                expect(claims.aud).not.toBe("evil-client");
                                expect(claims.nonce).not.toBe("evil-nonce");
                                expect(claims.iat).not.toBe(0);
                                expect(claims.nbf).not.toBe(0);
                                expect(claims.exp).not.toBe(0);
                                expect(claims.jti).not.toBe("evil-jti");
                                expect(claims.azp).not.toBe("evil-authorized-party");
                                expect(claims.sid).not.toBe("evil-sid");
                                expect(claims.at_hash).not.toBe("evil-at-hash");
                                expect(claims.c_hash).not.toBe("evil-code-hash");
                                expect(claims.s_hash).not.toBe("evil-state-hash");
                                expect(claims["https://example.com/custom"]).toBe("safe-custom-claim");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("loopback redirect URI matching", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, client, providerId, state;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
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
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                providerId = "test";
                state = "123";
                (0, vitest_1.it)("127.0.0.1 with different ports should succeed", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var registeredUri, requestedUri, oauthClient, codeVerifier, url, callbackRedirectUrl, code, _c, body, reqHeaders, tokens;
                    var _d;
                    var expect = _b.expect;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                registeredUri = "http://127.0.0.1:8080/callback";
                                requestedUri = "http://127.0.0.1:9090/callback";
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            redirect_uris: [registeredUri],
                                            application_type: "native",
                                            skip_consent: true,
                                        },
                                    })];
                            case 1:
                                oauthClient = _e.sent();
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: requestedUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                url = _e.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(url.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _e.sent();
                                expect(callbackRedirectUrl).toContain("code=");
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: requestedUri,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: requestedUri,
                                        },
                                    })];
                            case 4:
                                _c = _e.sent(), body = _c.body, reqHeaders = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: reqHeaders })];
                            case 5:
                                tokens = _e.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("[::1] with different ports should succeed", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var registeredUri, requestedUri, oauthClient, codeVerifier, url, callbackRedirectUrl, code, _c, body, reqHeaders, tokens;
                    var _d;
                    var expect = _b.expect;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                registeredUri = "http://[::1]:8080/callback";
                                requestedUri = "http://[::1]:3000/callback";
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            redirect_uris: [registeredUri],
                                            application_type: "native",
                                            skip_consent: true,
                                        },
                                    })];
                            case 1:
                                oauthClient = _e.sent();
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: requestedUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                url = _e.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(url.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _e.sent();
                                expect(callbackRedirectUrl).toContain("code=");
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: requestedUri,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: requestedUri,
                                        },
                                    })];
                            case 4:
                                _c = _e.sent(), body = _c.body, reqHeaders = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: reqHeaders })];
                            case 5:
                                tokens = _e.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("loopback with different path should be rejected", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var registeredUri, requestedUri, oauthClient, codeVerifier, url, callbackRedirectUrl;
                    var expect = _b.expect;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                registeredUri = "http://127.0.0.1:8080/callback";
                                requestedUri = "http://127.0.0.1:8080/other-path";
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [registeredUri],
                                            application_type: "native",
                                            skip_consent: true,
                                        },
                                    })];
                            case 1:
                                oauthClient = _c.sent();
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: requestedUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                url = _c.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(url.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _c.sent();
                                expect(callbackRedirectUrl).toContain("invalid_redirect");
                                expect(callbackRedirectUrl).not.toContain("code=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("scope preservation through authorization code flow", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, client, providerId, redirectUri, state;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
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
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                state = "123";
                (0, vitest_1.it)("scopes from authorization request should survive into token response", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var oauthClient, requestedScopes, codeVerifier, url, callbackRedirectUrl, code, _c, body, reqHeaders, tokens;
                    var _d;
                    var expect = _b.expect;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                oauthClient = _e.sent();
                                requestedScopes = ["openid", "profile", "email"];
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: requestedScopes,
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                url = _e.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(url.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _e.sent();
                                expect(callbackRedirectUrl).toContain("code=");
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 4:
                                _c = _e.sent(), body = _c.body, reqHeaders = _c.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: reqHeaders,
                                    })];
                            case 5:
                                tokens = _e.sent();
                                expect((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.scope).toBe(requestedScopes.join(" "));
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("at_hash in id tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
    function getTokens(scopes, resource) {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, url, callbackRedirectUrl, callbackUrl, code, _a, body, reqHeaders, params, tokens;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                id: providerId,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                redirectURI: "",
                                authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                state: state,
                                scopes: scopes,
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        url = _b.sent();
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(url.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _b.sent();
                        callbackUrl = new URL(callbackRedirectUrl);
                        code = callbackUrl.searchParams.get("code");
                        return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                authentication: "basic",
                                code: code,
                                codeVerifier: codeVerifier,
                                redirectURI: redirectUri,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                            })];
                    case 3:
                        _a = _b.sent(), body = _a.body, reqHeaders = _a.headers;
                        params = new URLSearchParams(body.toString());
                        if (resource) {
                            params.set("resource", resource);
                        }
                        return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: params.toString(),
                                headers: reqHeaders,
                            })];
                    case 4:
                        tokens = _b.sent();
                        return [2 /*return*/, tokens.data];
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
                redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
                state = "123";
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should include at_hash when id token is issued with access token", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var tokens, decoded;
                    var expect = _b.expect;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens(["openid"])];
                            case 1:
                                tokens = _c.sent();
                                expect(tokens.id_token).toBeDefined();
                                expect(tokens.access_token).toBeDefined();
                                decoded = (0, jose_1.decodeJwt)(tokens.id_token);
                                expect(decoded.at_hash).toBeDefined();
                                expect(typeof decoded.at_hash).toBe("string");
                                expect(decoded.at_hash.length).toBeGreaterThan(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * EdDSA (Ed25519) uses SHA-512 per RFC 8032.
                 * at_hash = base64url(left-half(SHA-512(access_token)))
                 */
                (0, vitest_1.it)("at_hash should match manual computation for EdDSA", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var tokens, decoded, digest, _c, expectedAtHash;
                    var expect = _b.expect;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, getTokens(["openid"])];
                            case 1:
                                tokens = _d.sent();
                                decoded = (0, jose_1.decodeJwt)(tokens.id_token);
                                _c = Uint8Array.bind;
                                return [4 /*yield*/, crypto.subtle.digest("SHA-512", new TextEncoder().encode(tokens.access_token))];
                            case 2:
                                digest = new (_c.apply(Uint8Array, [void 0, _d.sent()]))();
                                expectedAtHash = jose_1.base64url.encode(digest.slice(0, digest.length / 2));
                                expect(decoded.at_hash).toBe(expectedAtHash);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("at_hash should not be present without openid scope", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var tokens;
                    var expect = _b.expect;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens(["offline_access"], validResource)];
                            case 1:
                                tokens = _c.sent();
                                expect(tokens.id_token).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("customIdTokenClaims should not receive accessToken", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var receivedKeys, _c, testAuth, signIn, fetchImpl, testHeaders, testClient, testOauthClient, codeVerifier, url, callbackUrl, code, _d, body, reqHeaders;
                    var expect = _b.expect;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                receivedKeys = [];
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                customIdTokenClaims: function (info) {
                                                    receivedKeys = Object.keys(info);
                                                    return {};
                                                },
                                            }),
                                        ],
                                    })];
                            case 1:
                                _c = _e.sent(), testAuth = _c.auth, signIn = _c.signInWithTestUser, fetchImpl = _c.customFetchImpl;
                                return [4 /*yield*/, signIn()];
                            case 2:
                                testHeaders = (_e.sent()).headers;
                                testClient = (0, client_1.createAuthClient)({
                                    plugins: [(0, client_2.oauthProviderClient)()],
                                    baseURL: authServerBaseUrl,
                                    fetchOptions: { customFetchImpl: fetchImpl, headers: testHeaders },
                                });
                                return [4 /*yield*/, testAuth.api.adminCreateOAuthClient({
                                        headers: testHeaders,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                        },
                                    })];
                            case 3:
                                testOauthClient = _e.sent();
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: testOauthClient.client_id,
                                            clientSecret: testOauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 4:
                                url = _e.sent();
                                callbackUrl = "";
                                return [4 /*yield*/, testClient.$fetch(url.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _e.sent();
                                code = new URL(callbackUrl).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        authentication: "basic",
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: testOauthClient.client_id,
                                            clientSecret: testOauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 6:
                                _d = _e.sent(), body = _d.body, reqHeaders = _d.headers;
                                return [4 /*yield*/, testClient.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: reqHeaders,
                                    })];
                            case 7:
                                _e.sent();
                                expect(receivedKeys).toContain("user");
                                expect(receivedKeys).toContain("scopes");
                                expect(receivedKeys).toContain("metadata");
                                expect(receivedKeys).not.toContain("accessToken");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("customTokenResponseFields", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri, state;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
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
                                scopes: [
                                    "openid",
                                    "profile",
                                    "email",
                                    "offline_access",
                                    "service:read",
                                ],
                                clientPrivileges: function () { return true; },
                                customTokenResponseFields: function (_a) {
                                    var grantType = _a.grantType, verificationValue = _a.verificationValue;
                                    if (grantType === "authorization_code" &&
                                        (verificationValue === null || verificationValue === void 0 ? void 0 : verificationValue.referenceId)) {
                                        return { org_id: verificationValue.referenceId };
                                    }
                                    return { server_time: "2024-01-01" };
                                },
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
                redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
                state = "custom-fields-test";
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        grant_types: [
                                            "authorization_code",
                                            "client_credentials",
                                            "refresh_token",
                                        ],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                        client_credentials_scopes: ["service:read"],
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should include custom fields in authorization_code token response", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackRedirectUrl, url, code, _a, body, tokenHeaders, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 1:
                                authUrl = _d.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _d.sent();
                                url = new URL(callbackRedirectUrl);
                                code = url.searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 3:
                                _a = _d.sent(), body = _a.body, tokenHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: tokenHeaders,
                                    })];
                            case 4:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.server_time).toBe("2024-01-01");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not allow custom fields to override standard OAuth fields", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authServerBaseUrl2, _a, auth2, signIn2, fetch2, headers2, client2, response, codeVerifier, authUrl, callbackUrl, code, _b, body, tokenHeaders, tokens;
                    var _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                authServerBaseUrl2 = "http://localhost:3000";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: authServerBaseUrl2,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl2 } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                customTokenResponseFields: function () { return ({
                                                    access_token: "should-be-ignored",
                                                    token_type: "should-be-ignored",
                                                    custom_field: "should-be-present",
                                                }); },
                                            }),
                                        ],
                                    })];
                            case 1:
                                _a = _f.sent(), auth2 = _a.auth, signIn2 = _a.signInWithTestUser, fetch2 = _a.customFetchImpl;
                                return [4 /*yield*/, signIn2()];
                            case 2:
                                headers2 = (_f.sent()).headers;
                                client2 = (0, client_1.createAuthClient)({
                                    plugins: [(0, client_2.oauthProviderClient)()],
                                    baseURL: authServerBaseUrl2,
                                    fetchOptions: { customFetchImpl: fetch2, headers: headers2 },
                                });
                                return [4 /*yield*/, auth2.api.adminCreateOAuthClient({
                                        headers: headers2,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: [
                                                "authorization_code",
                                                "client_credentials",
                                                "refresh_token",
                                            ],
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                        },
                                    })];
                            case 3:
                                response = _f.sent();
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: response.client_id,
                                            clientSecret: response.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl2, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 4:
                                authUrl = _f.sent();
                                callbackUrl = "";
                                return [4 /*yield*/, client2.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _f.sent();
                                code = new URL(callbackUrl).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: response.client_id,
                                            clientSecret: response.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 6:
                                _b = _f.sent(), body = _b.body, tokenHeaders = _b.headers;
                                return [4 /*yield*/, client2.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: tokenHeaders,
                                    })];
                            case 7:
                                tokens = _f.sent();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token).not.toBe("should-be-ignored");
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.token_type).toBe("Bearer");
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.custom_field).toBe("should-be-present");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should include custom fields in client_credentials token response", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, body, tokenHeaders, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, (0, oauth2_1.clientCredentialsTokenRequest)({
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 1:
                                _a = _d.sent(), body = _a.body, tokenHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: tokenHeaders,
                                    })];
                            case 2:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.server_time).toBe("2024-01-01");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("verificationValueSchema", function () {
    (0, vitest_1.it)("should validate a well-formed verification value", function () {
        var value = {
            type: "authorization_code",
            query: {
                response_type: "code",
                client_id: "test-client",
                redirect_uri: "https://example.com/callback",
                scope: "openid",
                state: "abc123",
            },
            userId: "user-1",
            sessionId: "session-1",
        };
        var result = zod_1.verificationValueSchema.safeParse(value);
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("should validate a verification value without state", function () {
        var value = {
            type: "authorization_code",
            query: {
                response_type: "code",
                client_id: "test-client",
                redirect_uri: "https://example.com/callback",
                scope: "openid",
            },
            userId: "user-1",
            sessionId: "session-1",
        };
        var result = zod_1.verificationValueSchema.safeParse(value);
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    /**
     * @see https://github.com/better-auth/better-auth/pull/10159
     */
    (0, vitest_1.it)("should validate a headless verification value without redirect_uri", function () {
        var value = {
            type: "authorization_code",
            query: {
                response_type: "code",
                client_id: "test-client",
                scope: "openid",
            },
            userId: "user-1",
            sessionId: "session-1",
        };
        var result = zod_1.verificationValueSchema.safeParse(value);
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("should validate a verification value with UserInfo claims", function () {
        var value = {
            type: "authorization_code",
            query: {
                response_type: "code",
                client_id: "test-client",
                redirect_uri: "https://example.com/callback",
                scope: "openid",
                claims: JSON.stringify({
                    userinfo: {
                        name: { essential: true },
                    },
                }),
            },
            userId: "user-1",
            sessionId: "session-1",
        };
        var result = zod_1.verificationValueSchema.safeParse(value);
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("should reject a verification value with malformed claims", function () {
        var result = zod_1.verificationValueSchema.safeParse({
            type: "authorization_code",
            query: {
                response_type: "code",
                client_id: "test-client",
                redirect_uri: "https://example.com/callback",
                scope: "openid",
                claims: "not-json",
            },
            userId: "user-1",
            sessionId: "session-1",
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("should reject a verification value with wrong type", function () {
        var result = zod_1.verificationValueSchema.safeParse({
            type: "password_reset",
            query: {
                client_id: "test",
                redirect_uri: "https://example.com",
                state: "abc",
            },
            userId: "u1",
            sessionId: "s1",
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("should reject a verification value missing required fields", function () {
        var result = zod_1.verificationValueSchema.safeParse({
            type: "authorization_code",
            query: {
                client_id: "test",
                redirect_uri: "https://example.com",
                state: "abc",
            },
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("should pass through unknown fields for extensibility", function () {
        var value = {
            type: "authorization_code",
            query: {
                client_id: "test",
                redirect_uri: "https://example.com",
                state: "abc",
            },
            userId: "u1",
            sessionId: "s1",
            futureField: "should-pass-through",
        };
        var result = zod_1.verificationValueSchema.safeParse(value);
        (0, vitest_1.expect)(result.success).toBe(true);
        if (result.success) {
            (0, vitest_1.expect)(result.data.futureField).toBe("should-pass-through");
        }
    });
    (0, vitest_1.it)("should coerce valid max_age values in stored authorization queries", function () {
        var result = zod_1.verificationValueSchema.safeParse({
            type: "authorization_code",
            query: {
                client_id: "test",
                redirect_uri: "https://example.com",
                max_age: "30",
            },
            userId: "u1",
            sessionId: "s1",
        });
        (0, vitest_1.expect)(result.success).toBe(true);
        if (result.success) {
            (0, vitest_1.expect)(result.data.query.max_age).toBe(30);
        }
    });
    (0, vitest_1.it)("should reject invalid max_age values in stored authorization queries", function () {
        var result = zod_1.verificationValueSchema.safeParse({
            type: "authorization_code",
            query: {
                client_id: "test",
                redirect_uri: "https://example.com",
                max_age: -1,
            },
            userId: "u1",
            sessionId: "s1",
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("should reject empty max_age values in stored authorization queries", function () {
        for (var _i = 0, _a = ["", "   "]; _i < _a.length; _i++) {
            var maxAge = _a[_i];
            var result = zod_1.verificationValueSchema.safeParse({
                type: "authorization_code",
                query: {
                    client_id: "test",
                    redirect_uri: "https://example.com",
                    max_age: maxAge,
                },
                userId: "u1",
                sessionId: "s1",
            });
            (0, vitest_1.expect)(result.success).toBe(false);
        }
    });
    (0, vitest_1.it)("should accept valid prompt values in any order", function () {
        var result = zod_1.verificationValueSchema.safeParse({
            type: "authorization_code",
            query: {
                client_id: "test",
                redirect_uri: "https://example.com",
                prompt: "consent login",
            },
            userId: "u1",
            sessionId: "s1",
        });
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("should reject prompt=none combined with other prompt values", function () {
        var result = zod_1.verificationValueSchema.safeParse({
            type: "authorization_code",
            query: {
                client_id: "test",
                redirect_uri: "https://example.com",
                prompt: "none login",
            },
            userId: "u1",
            sessionId: "s1",
        });
        (0, vitest_1.expect)(result.success).toBe(false);
    });
});
(0, vitest_1.describe)("oauth token - per-client grant_type enforcement", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, client, providerId, redirectUri, authCodeOnlyClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: [
                                    "openid",
                                    "profile",
                                    "email",
                                    "offline_access",
                                    "m2m:read",
                                    "m2m:write",
                                ],
                                clientPrivileges: function () { return true; },
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
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
                authCodeOnlyClient = null;
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["authorization_code"],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                authCodeOnlyClient = _a.sent();
                                (0, vitest_1.expect)(authCodeOnlyClient === null || authCodeOnlyClient === void 0 ? void 0 : authCodeOnlyClient.client_secret).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                // The core fix: a user-delegated (authorization_code) client must not be
                // able to mint machine-to-machine tokens.
                (0, vitest_1.it)("rejects client_credentials for an authorization_code-only client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var body, reqHeaders, res;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                body = new URLSearchParams({ grant_type: "client_credentials" });
                                reqHeaders = {
                                    "content-type": "application/x-www-form-urlencoded",
                                    authorization: "Basic ".concat(Buffer.from("".concat(authCodeOnlyClient.client_id, ":").concat(authCodeOnlyClient.client_secret)).toString("base64")),
                                };
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: reqHeaders })];
                            case 1:
                                res = _d.sent();
                                (0, vitest_1.expect)((_a = res.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeUndefined();
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)((_c = res.error) === null || _c === void 0 ? void 0 : _c.error).toBe("unauthorized_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Targeted policy: refresh tokens stay tied to the authorization_code flow +
                // offline_access, so an authorization_code client keeps getting them without
                // having to also register the refresh_token grant explicitly.
                (0, vitest_1.it)("still issues refresh tokens to an authorization_code client with offline_access", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackRedirectUrl, code, _a, body, reqHeaders, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: authCodeOnlyClient.client_id,
                                            clientSecret: authCodeOnlyClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: "grant-enforcement",
                                        scopes: ["openid", "offline_access"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 1:
                                authUrl = _d.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _d.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        authentication: "basic",
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: authCodeOnlyClient.client_id,
                                            clientSecret: authCodeOnlyClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 3:
                                _a = _d.sent(), body = _a.body, reqHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: reqHeaders })];
                            case 4:
                                tokens = _d.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.refresh_token).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Guard against over-blocking: a client explicitly registered for
                // client_credentials must still be able to use it.
                (0, vitest_1.it)("fails closed when a client_credentials client has no M2M scope authority", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ccClient, body, reqHeaders, res;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                ccClient = _d.sent();
                                (0, vitest_1.expect)(ccClient).toMatchObject({ client_credentials_scopes: [] });
                                body = new URLSearchParams({ grant_type: "client_credentials" });
                                reqHeaders = {
                                    "content-type": "application/x-www-form-urlencoded",
                                    authorization: "Basic ".concat(Buffer.from("".concat(ccClient.client_id, ":").concat(ccClient.client_secret)).toString("base64")),
                                };
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: reqHeaders })];
                            case 2:
                                res = _d.sent();
                                (0, vitest_1.expect)((_a = res.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeUndefined();
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)((_c = res.error) === null || _c === void 0 ? void 0 : _c.error).toBe("unauthorized_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("fails closed when a legacy client has a null M2M scope authority", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ccClient, context, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        client_credentials_scopes: ["m2m:read"],
                                    },
                                })];
                            case 1:
                                ccClient = _c.sent();
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                context = _c.sent();
                                return [4 /*yield*/, context.adapter.update({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: ccClient.client_id }],
                                        update: { clientCredentialsScopes: null },
                                    })];
                            case 3:
                                _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                            authorization: "Basic ".concat(Buffer.from("".concat(ccClient.client_id, ":").concat(ccClient.client_secret)).toString("base64")),
                                        },
                                        body: new URLSearchParams({
                                            grant_type: "client_credentials",
                                        }),
                                    })];
                            case 4:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("unauthorized_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("classifies public client_credentials clients as unauthorized_client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var publicClient, context, res;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        token_endpoint_auth_method: "none",
                                    },
                                })];
                            case 1:
                                publicClient = _d.sent();
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                context = _d.sent();
                                return [4 /*yield*/, context.adapter.update({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: publicClient.client_id }],
                                        update: { clientCredentialsScopes: ["m2m:read"] },
                                    })];
                            case 3:
                                _d.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        body: new URLSearchParams({
                                            grant_type: "client_credentials",
                                            client_id: publicClient.client_id,
                                        }),
                                    })];
                            case 4:
                                res = _d.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("unauthorized_client");
                                (0, vitest_1.expect)((_c = res.error) === null || _c === void 0 ? void 0 : _c.error_description).toBe("public clients cannot use the client_credentials grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Guard against over-blocking: an administrator-authorized client explicitly
                // registered for client_credentials must still be able to use it.
                (0, vitest_1.it)("allows client_credentials for a client registered for it", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ccClient, body, reqHeaders, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                        client_credentials_scopes: ["m2m:read", "m2m:read"],
                                    },
                                })];
                            case 1:
                                ccClient = _c.sent();
                                (0, vitest_1.expect)(ccClient).toMatchObject({
                                    client_credentials_scopes: ["m2m:read"],
                                });
                                body = new URLSearchParams({ grant_type: "client_credentials" });
                                reqHeaders = {
                                    "content-type": "application/x-www-form-urlencoded",
                                    authorization: "Basic ".concat(Buffer.from("".concat(ccClient.client_id, ":").concat(ccClient.client_secret)).toString("base64")),
                                };
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: reqHeaders })];
                            case 2:
                                res = _c.sent();
                                (0, vitest_1.expect)(res.error).toBeNull();
                                (0, vitest_1.expect)((_a = res.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                (0, vitest_1.expect)((_b = res.data) === null || _b === void 0 ? void 0 : _b.scope).toBe("m2m:read");
                                return [2 /*return*/];
                        }
                    });
                }); });
                // The /authorize endpoint only serves authorization_code; a machine-to-machine
                // (client_credentials-only) client must be rejected there too.
                (0, vitest_1.it)("rejects /authorize for a client not registered for authorization_code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ccClient, codeVerifier, authUrl, location;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                ccClient = _a.sent();
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: ccClient.client_id,
                                            clientSecret: ccClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: "authorize-grant-enforcement",
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                authUrl = _a.sent();
                                location = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            location = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _a.sent();
                                (0, vitest_1.expect)(location).toContain("error=unauthorized_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth token - DPoP", function () { return __awaiter(void 0, void 0, void 0, function () {
    function issueFromPlugin(ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, client, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        provider = (0, token_1.getOAuthProviderApi)(ctx, ctx.context.getPlugin("oauth-provider").options, "client_credentials");
                        return [4 /*yield*/, provider.authenticateClient()];
                    case 1:
                        client = (_c.sent()).client;
                        _b = (_a = ctx).json;
                        return [4 /*yield*/, provider.issueTokens({ client: client, scopes: [] })];
                    case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    }
    function createDpopKey() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, privateKey, publicKey, publicJwk, jkt;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, jose_1.generateKeyPair)("ES256", {
                            extractable: true,
                        })];
                    case 1:
                        _a = _b.sent(), privateKey = _a.privateKey, publicKey = _a.publicKey;
                        return [4 /*yield*/, (0, jose_1.exportJWK)(publicKey)];
                    case 2:
                        publicJwk = _b.sent();
                        return [4 /*yield*/, (0, oauth2_2.deriveDpopJkt)(publicJwk)];
                    case 3:
                        jkt = _b.sent();
                        return [2 /*return*/, { privateKey: privateKey, publicJwk: publicJwk, jkt: jkt }];
                }
            });
        });
    }
    function createDpopProof(params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = jose_1.SignJWT.bind;
                        _b = [{ jti: params.jti, htm: params.method, htu: params.url, iat: Math.floor(Date.now() / 1000) }];
                        if (!params.accessToken) return [3 /*break*/, 2];
                        _d = {};
                        return [4 /*yield*/, (0, oauth2_2.deriveDpopAth)(params.accessToken)];
                    case 1:
                        _c = (_d.ath = _e.sent(), _d);
                        return [3 /*break*/, 3];
                    case 2:
                        _c = {};
                        _e.label = 3;
                    case 3: return [2 /*return*/, new (_a.apply(jose_1.SignJWT, [void 0, __assign.apply(void 0, _b.concat([(_c)]))]))()
                            .setProtectedHeader({
                            typ: "dpop+jwt",
                            alg: "ES256",
                            jwk: params.publicJwk,
                        })
                            .sign(params.privateKey)];
                }
            });
        });
    }
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
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)(__assign({ id: providerId, options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                }, redirectURI: "", authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"), state: "123", scopes: ["openid", "offline_access"], codeVerifier: codeVerifier }, overrides))];
                    case 1:
                        url = _a.sent();
                        return [2 /*return*/, { url: url, codeVerifier: codeVerifier }];
                }
            });
        });
    }
    function exchangeCode(code, codeVerifier, resource, dpopProof) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, reqHeaders, tokenHeaders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                            code: code,
                            codeVerifier: codeVerifier,
                            redirectURI: redirectUri,
                            resource: resource,
                            options: {
                                clientId: oauthClient.client_id,
                                clientSecret: oauthClient.client_secret,
                                redirectURI: redirectUri,
                            },
                        })];
                    case 1:
                        _a = _b.sent(), body = _a.body, reqHeaders = _a.headers;
                        tokenHeaders = new Headers(reqHeaders);
                        if (dpopProof)
                            tokenHeaders.set("DPoP", dpopProof);
                        return [2 /*return*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: tokenHeaders })];
                }
            });
        });
    }
    function authorizeForCode(jkt, resource) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, authUrl, codeVerifier, callbackRedirectUrl, url;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createAuthUrl(jkt ? { additionalParams: { dpop_jkt: jkt } } : undefined)];
                    case 1:
                        _a = _b.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                        authUrl.searchParams.set("resource", resource);
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _b.sent();
                        url = new URL(callbackRedirectUrl);
                        return [2 /*return*/, { code: url.searchParams.get("code"), codeVerifier: codeVerifier }];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, jwtResource, dpopRequiredResource, tokenEndpoint, internalTokenEndpoint, pluginIssueEndpoint, pluginTenantIssueEndpoint, pluginIssuer, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                jwtResource = "https://dpop-api.example.com";
                dpopRequiredResource = "https://dpop-required.example.com";
                tokenEndpoint = "".concat(authServerBaseUrl, "/api/auth/oauth2/token");
                internalTokenEndpoint = "http://auth-service:3000/api/auth/oauth2/token";
                pluginIssueEndpoint = "".concat(authServerBaseUrl, "/api/auth/test/dpop-issue");
                pluginTenantIssueEndpoint = "".concat(authServerBaseUrl, "/api/auth/test/acme/dpop-issue");
                pluginIssuer = {
                    id: "test-dpop-plugin-issuer",
                    endpoints: {
                        testDpopIssue: (0, api_1.createAuthEndpoint)("/test/dpop-issue", { method: "POST" }, issueFromPlugin),
                        testTenantDpopIssue: (0, api_1.createAuthEndpoint)("/test/:tenant/dpop-issue", { method: "POST" }, issueFromPlugin),
                    },
                };
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: "".concat(authServerBaseUrl, "/api/auth/"),
                        advanced: { skipTrailingSlashes: true },
                        plugins: [
                            pluginIssuer,
                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                refreshTokenReuseInterval: 30,
                                resources: [
                                    jwtResource,
                                    {
                                        identifier: dpopRequiredResource,
                                        dpopBoundAccessTokensRequired: true,
                                    },
                                ],
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
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        grant_types: ["authorization_code", "refresh_token"],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("issues a JWT access token bound to the proof key via cnf.jkt", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dpopKey, _a, code, codeVerifier, proof, tokens, payload;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _c.sent();
                                return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                            case 2:
                                _a = _c.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "issue-proof",
                                    })];
                            case 3:
                                proof = _c.sent();
                                return [4 /*yield*/, exchangeCode(code, codeVerifier, jwtResource, proof)];
                            case 4:
                                tokens = _c.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.token_type).toBe("DPoP");
                                payload = (0, jose_1.decodeJwt)(tokens.data.access_token);
                                (0, vitest_1.expect)(payload.cnf).toMatchObject({ jkt: dpopKey.jkt });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("validates DPoP against the plugin endpoint that issues the tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var issuerClient, dpopKey, proof, response, tokens;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        grant_types: ["client_credentials"],
                                    },
                                })];
                            case 1:
                                issuerClient = _a.sent();
                                return [4 /*yield*/, createDpopKey()];
                            case 2:
                                dpopKey = _a.sent();
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: pluginIssueEndpoint,
                                        jti: "plugin-endpoint-proof",
                                    })];
                            case 3:
                                proof = _a.sent();
                                return [4 /*yield*/, customFetchImpl(pluginIssueEndpoint, {
                                        method: "POST",
                                        headers: { "content-type": "application/json", DPoP: proof },
                                        body: JSON.stringify({
                                            client_id: issuerClient.client_id,
                                            client_secret: issuerClient.client_secret,
                                        }),
                                    })];
                            case 4:
                                response = _a.sent();
                                return [4 /*yield*/, response.json()];
                            case 5:
                                tokens = _a.sent();
                                (0, vitest_1.expect)(tokens).toMatchObject({ token_type: "DPoP" });
                                (0, vitest_1.expect)(response.status).toBe(200);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/rfc9449#section-4.3
                 */
                (0, vitest_1.describe)("expected htu is the concrete request URL", function () {
                    (0, vitest_1.it)("resolves route params of a plugin endpoint that issues tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var issuerClient, dpopKey, proof, response, tokens;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: ["client_credentials"],
                                        },
                                    })];
                                case 1:
                                    issuerClient = _a.sent();
                                    return [4 /*yield*/, createDpopKey()];
                                case 2:
                                    dpopKey = _a.sent();
                                    return [4 /*yield*/, createDpopProof({
                                            privateKey: dpopKey.privateKey,
                                            publicJwk: dpopKey.publicJwk,
                                            method: "POST",
                                            url: pluginTenantIssueEndpoint,
                                            jti: "plugin-tenant-proof",
                                        })];
                                case 3:
                                    proof = _a.sent();
                                    return [4 /*yield*/, customFetchImpl(pluginTenantIssueEndpoint, {
                                            method: "POST",
                                            headers: { "content-type": "application/json", DPoP: proof },
                                            body: JSON.stringify({
                                                client_id: issuerClient.client_id,
                                                client_secret: issuerClient.client_secret,
                                            }),
                                        })];
                                case 4:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 5:
                                    tokens = _a.sent();
                                    (0, vitest_1.expect)(tokens).toMatchObject({ token_type: "DPoP" });
                                    (0, vitest_1.expect)(response.status).toBe(200);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("keeps the trailing slash of a token request when skipTrailingSlashes is on", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var dpopKey, _a, code, codeVerifier, _b, body, requestHeaders, trailingSlashTokenEndpoint, tokenHeaders, _c, _d, _e, response, tokens;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, createDpopKey()];
                                case 1:
                                    dpopKey = _f.sent();
                                    return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                                case 2:
                                    _a = _f.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                    return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                            code: code,
                                            codeVerifier: codeVerifier,
                                            redirectURI: redirectUri,
                                            resource: jwtResource,
                                            options: {
                                                clientId: oauthClient.client_id,
                                                clientSecret: oauthClient.client_secret,
                                                redirectURI: redirectUri,
                                            },
                                        })];
                                case 3:
                                    _b = _f.sent(), body = _b.body, requestHeaders = _b.headers;
                                    trailingSlashTokenEndpoint = "".concat(tokenEndpoint, "/");
                                    tokenHeaders = new Headers(requestHeaders);
                                    _d = (_c = tokenHeaders).set;
                                    _e = ["DPoP"];
                                    return [4 /*yield*/, createDpopProof({
                                            privateKey: dpopKey.privateKey,
                                            publicJwk: dpopKey.publicJwk,
                                            method: "POST",
                                            url: trailingSlashTokenEndpoint,
                                            jti: "trailing-slash-proof",
                                        })];
                                case 4:
                                    _d.apply(_c, _e.concat([_f.sent()]));
                                    return [4 /*yield*/, customFetchImpl(trailingSlashTokenEndpoint, {
                                            method: "POST",
                                            body: body,
                                            headers: tokenHeaders,
                                        })];
                                case 5:
                                    response = _f.sent();
                                    return [4 /*yield*/, response.json()];
                                case 6:
                                    tokens = _f.sent();
                                    (0, vitest_1.expect)(tokens).toMatchObject({ token_type: "DPoP" });
                                    (0, vitest_1.expect)(response.status).toBe(200);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.it)("validates DPoP against the public token endpoint URL", function () { return __awaiter(void 0, void 0, void 0, function () {
                    function requestTokenWithProofUrl(proofUrl, jti) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, code, codeVerifier, proof, _b, body, requestHeaders, headers, response, tokens;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                                    case 1:
                                        _a = _c.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                        return [4 /*yield*/, createDpopProof({
                                                privateKey: dpopKey.privateKey,
                                                publicJwk: dpopKey.publicJwk,
                                                method: "POST",
                                                url: proofUrl,
                                                jti: jti,
                                            })];
                                    case 2:
                                        proof = _c.sent();
                                        return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                                code: code,
                                                codeVerifier: codeVerifier,
                                                redirectURI: redirectUri,
                                                resource: jwtResource,
                                                options: {
                                                    clientId: oauthClient.client_id,
                                                    clientSecret: oauthClient.client_secret,
                                                    redirectURI: redirectUri,
                                                },
                                            })];
                                    case 3:
                                        _b = _c.sent(), body = _b.body, requestHeaders = _b.headers;
                                        headers = new Headers(requestHeaders);
                                        headers.set("DPoP", proof);
                                        return [4 /*yield*/, customFetchImpl(internalTokenEndpoint, {
                                                method: "POST",
                                                body: body,
                                                headers: headers,
                                            })];
                                    case 4:
                                        response = _c.sent();
                                        return [4 /*yield*/, response.json()];
                                    case 5:
                                        tokens = _c.sent();
                                        return [2 /*return*/, { response: response, tokens: tokens }];
                                }
                            });
                        });
                    }
                    var dpopKey, publicRequest, internalRequest;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _a.sent();
                                return [4 /*yield*/, requestTokenWithProofUrl(tokenEndpoint, "public-endpoint-proof")];
                            case 2:
                                publicRequest = _a.sent();
                                (0, vitest_1.expect)(publicRequest.response.status).toBe(200);
                                (0, vitest_1.expect)(publicRequest.tokens.token_type).toBe("DPoP");
                                return [4 /*yield*/, requestTokenWithProofUrl(internalTokenEndpoint, "internal-endpoint-proof")];
                            case 3:
                                internalRequest = _a.sent();
                                (0, vitest_1.expect)(internalRequest.response.status).toBe(400);
                                (0, vitest_1.expect)(internalRequest.tokens.error).toBe("invalid_dpop_proof");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a token request without a proof when the resource requires DPoP", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, authorizeForCode(undefined, dpopRequiredResource)];
                            case 1:
                                _a = _d.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, exchangeCode(code, codeVerifier, dpopRequiredResource)];
                            case 2:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeUndefined();
                                (0, vitest_1.expect)((_c = tokens.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_dpop_proof");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/rfc9449#section-8
                 */
                (0, vitest_1.it)("keeps the authorization code when the DPoP proof is rejected", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dpopKey, otherKey, _a, code, codeVerifier, wrongKeyProof, rejected, proof, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _d.sent();
                                return [4 /*yield*/, createDpopKey()];
                            case 2:
                                otherKey = _d.sent();
                                return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                            case 3:
                                _a = _d.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: otherKey.privateKey,
                                        publicJwk: otherKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "retry-wrong-key-proof",
                                    })];
                            case 4:
                                wrongKeyProof = _d.sent();
                                return [4 /*yield*/, exchangeCode(code, codeVerifier, jwtResource, wrongKeyProof)];
                            case 5:
                                rejected = _d.sent();
                                (0, vitest_1.expect)((_b = rejected.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_dpop_proof");
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "retry-valid-proof",
                                    })];
                            case 6:
                                proof = _d.sent();
                                return [4 /*yield*/, exchangeCode(code, codeVerifier, jwtResource, proof)];
                            case 7:
                                tokens = _d.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.token_type).toBe("DPoP");
                                (0, vitest_1.expect)((0, jose_1.decodeJwt)(tokens.data.access_token).cnf).toMatchObject({
                                    jkt: dpopKey.jkt,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/rfc9449#section-8
                 */
                (0, vitest_1.it)("keeps the authorization code when a required DPoP proof is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dpopKey, _a, code, codeVerifier, rejected, proof, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _d.sent();
                                return [4 /*yield*/, authorizeForCode(undefined, dpopRequiredResource)];
                            case 2:
                                _a = _d.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, exchangeCode(code, codeVerifier, dpopRequiredResource)];
                            case 3:
                                rejected = _d.sent();
                                (0, vitest_1.expect)((_b = rejected.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_dpop_proof");
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "retry-required-proof",
                                    })];
                            case 4:
                                proof = _d.sent();
                                return [4 /*yield*/, exchangeCode(code, codeVerifier, dpopRequiredResource, proof)];
                            case 5:
                                tokens = _d.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.token_type).toBe("DPoP");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * The proof's `jti` is recorded only after the code is consumed, so the
                 * request that loses the race is told the code is gone, not that the proof
                 * was replayed.
                 *
                 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
                 */
                (0, vitest_1.it)("issues once when two exchanges with one DPoP proof arrive together", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dpopKey, _a, code, codeVerifier, proof, results, successes, failures;
                    var _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _f.sent();
                                return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                            case 2:
                                _a = _f.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "concurrent-shared-proof",
                                    })];
                            case 3:
                                proof = _f.sent();
                                return [4 /*yield*/, Promise.all([
                                        exchangeCode(code, codeVerifier, jwtResource, proof),
                                        exchangeCode(code, codeVerifier, jwtResource, proof),
                                    ])];
                            case 4:
                                results = _f.sent();
                                successes = results.filter(function (result) { return result.error === null; });
                                failures = results.filter(function (result) { return result.error !== null; });
                                (0, vitest_1.expect)(successes).toHaveLength(1);
                                (0, vitest_1.expect)((_c = (_b = successes[0]) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.token_type).toBe("DPoP");
                                (0, vitest_1.expect)(failures).toHaveLength(1);
                                (0, vitest_1.expect)((_e = (_d = failures[0]) === null || _d === void 0 ? void 0 : _d.error) === null || _e === void 0 ? void 0 : _e.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("preserves the key binding across refresh and rejects a proofless refresh", function () { return __awaiter(void 0, void 0, void 0, function () {
                    function refresh(dpopProof) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, body, reqHeaders, refreshHeaders;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                            refreshToken: tokens.data.refresh_token,
                                            options: {
                                                clientId: oauthClient.client_id,
                                                clientSecret: oauthClient.client_secret,
                                                redirectURI: redirectUri,
                                            },
                                        })];
                                    case 1:
                                        _a = _b.sent(), body = _a.body, reqHeaders = _a.headers;
                                        refreshHeaders = new Headers(reqHeaders);
                                        if (dpopProof)
                                            refreshHeaders.set("DPoP", dpopProof);
                                        return [2 /*return*/, client.$fetch("/oauth2/token", {
                                                method: "POST",
                                                body: body,
                                                headers: refreshHeaders,
                                            })];
                                }
                            });
                        });
                    }
                    var dpopKey, _a, code, codeVerifier, issueProof, tokens, proofless, refreshProof, rotated, rotatedPayload;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _e.sent();
                                return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                            case 2:
                                _a = _e.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "rotate-issue-proof",
                                    })];
                            case 3:
                                issueProof = _e.sent();
                                return [4 /*yield*/, exchangeCode(code, codeVerifier, jwtResource, issueProof)];
                            case 4:
                                tokens = _e.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeDefined();
                                return [4 /*yield*/, refresh()];
                            case 5:
                                proofless = _e.sent();
                                (0, vitest_1.expect)((_c = proofless.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_dpop_proof");
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "rotate-refresh-proof",
                                    })];
                            case 6:
                                refreshProof = _e.sent();
                                return [4 /*yield*/, refresh(refreshProof)];
                            case 7:
                                rotated = _e.sent();
                                (0, vitest_1.expect)(rotated.error).toBeNull();
                                (0, vitest_1.expect)((_d = rotated.data) === null || _d === void 0 ? void 0 : _d.token_type).toBe("DPoP");
                                rotatedPayload = (0, jose_1.decodeJwt)(rotated.data.access_token);
                                (0, vitest_1.expect)(rotatedPayload.cnf).toMatchObject({ jkt: dpopKey.jkt });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("replays a DPoP-bound refresh response only after validating the proof key", function () { return __awaiter(void 0, void 0, void 0, function () {
                    function refresh(dpopProof) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _a, body, reqHeaders, refreshHeaders;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                                            refreshToken: tokens.data.refresh_token,
                                            options: {
                                                clientId: oauthClient.client_id,
                                                clientSecret: oauthClient.client_secret,
                                                redirectURI: redirectUri,
                                            },
                                        })];
                                    case 1:
                                        _a = _b.sent(), body = _a.body, reqHeaders = _a.headers;
                                        refreshHeaders = new Headers(reqHeaders);
                                        if (dpopProof)
                                            refreshHeaders.set("DPoP", dpopProof);
                                        return [2 /*return*/, client.$fetch("/oauth2/token", {
                                                method: "POST",
                                                body: body,
                                                headers: refreshHeaders,
                                            })];
                                }
                            });
                        });
                    }
                    var dpopKey, _a, code, codeVerifier, issueProof, tokens, firstProof, firstRefresh, prooflessReplay, replayProof, replay;
                    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _m.sent();
                                return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                            case 2:
                                _a = _m.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "reuse-issue-proof",
                                    })];
                            case 3:
                                issueProof = _m.sent();
                                return [4 /*yield*/, exchangeCode(code, codeVerifier, jwtResource, issueProof)];
                            case 4:
                                tokens = _m.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeDefined();
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "reuse-refresh-proof-1",
                                    })];
                            case 5:
                                firstProof = _m.sent();
                                return [4 /*yield*/, refresh(firstProof)];
                            case 6:
                                firstRefresh = _m.sent();
                                (0, vitest_1.expect)(firstRefresh.error).toBeNull();
                                (0, vitest_1.expect)((_c = firstRefresh.data) === null || _c === void 0 ? void 0 : _c.token_type).toBe("DPoP");
                                (0, vitest_1.expect)((_d = firstRefresh.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                                return [4 /*yield*/, refresh()];
                            case 7:
                                prooflessReplay = _m.sent();
                                (0, vitest_1.expect)((_e = prooflessReplay.error) === null || _e === void 0 ? void 0 : _e.error).toBe("invalid_dpop_proof");
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "reuse-refresh-proof-2",
                                    })];
                            case 8:
                                replayProof = _m.sent();
                                return [4 /*yield*/, refresh(replayProof)];
                            case 9:
                                replay = _m.sent();
                                (0, vitest_1.expect)(replay.error).toBeNull();
                                (0, vitest_1.expect)(replay.data).toMatchObject({
                                    access_token: (_f = firstRefresh.data) === null || _f === void 0 ? void 0 : _f.access_token,
                                    expires_at: (_g = firstRefresh.data) === null || _g === void 0 ? void 0 : _g.expires_at,
                                    token_type: "DPoP",
                                    refresh_token: (_h = firstRefresh.data) === null || _h === void 0 ? void 0 : _h.refresh_token,
                                    scope: (_j = firstRefresh.data) === null || _j === void 0 ? void 0 : _j.scope,
                                    id_token: (_k = firstRefresh.data) === null || _k === void 0 ? void 0 : _k.id_token,
                                });
                                (0, vitest_1.expect)((_l = replay.data) === null || _l === void 0 ? void 0 : _l.expires_in).toBeLessThanOrEqual(firstRefresh.data.expires_in);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a replayed DPoP proof at the token endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dpopKey, proof, first, firstTokens, second, replayed;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _d.sent();
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: tokenEndpoint,
                                        jti: "replayed-proof",
                                    })];
                            case 2:
                                proof = _d.sent();
                                return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                            case 3:
                                first = _d.sent();
                                return [4 /*yield*/, exchangeCode(first.code, first.codeVerifier, jwtResource, proof)];
                            case 4:
                                firstTokens = _d.sent();
                                (0, vitest_1.expect)(firstTokens.error).toBeNull();
                                (0, vitest_1.expect)((_a = firstTokens.data) === null || _a === void 0 ? void 0 : _a.token_type).toBe("DPoP");
                                return [4 /*yield*/, authorizeForCode(dpopKey.jkt, jwtResource)];
                            case 5:
                                second = _d.sent();
                                return [4 /*yield*/, exchangeCode(second.code, second.codeVerifier, jwtResource, proof)];
                            case 6:
                                replayed = _d.sent();
                                (0, vitest_1.expect)((_b = replayed.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeUndefined();
                                (0, vitest_1.expect)((_c = replayed.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_dpop_proof");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("persists dpop_bound_access_tokens through dynamic client registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var registration;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/register", {
                                    method: "POST",
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        grant_types: ["authorization_code"],
                                        token_endpoint_auth_method: "client_secret_basic",
                                        dpop_bound_access_tokens: true,
                                    },
                                })];
                            case 1:
                                registration = _b.sent();
                                (0, vitest_1.expect)(registration.error).toBeNull();
                                (0, vitest_1.expect)((_a = registration.data) === null || _a === void 0 ? void 0 : _a.dpop_bound_access_tokens).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("enforces DPoP from the client dpop_bound_access_tokens flag alone", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var flagged, codeVerifier, url, callbackRedirectUrl, code, _a, body, reqHeaders, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        token_endpoint_auth_method: "client_secret_post",
                                        grant_types: ["authorization_code"],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: true,
                                        dpop_bound_access_tokens: true,
                                    },
                                })];
                            case 1:
                                flagged = _d.sent();
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: flagged.client_id,
                                            clientSecret: flagged.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: "123",
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                url = _d.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(url.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: flagged.client_id,
                                            clientSecret: flagged.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 4:
                                _a = _d.sent(), body = _a.body, reqHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: reqHeaders,
                                    })];
                            case 5:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeUndefined();
                                (0, vitest_1.expect)((_c = tokens.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_dpop_proof");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/pull/10039
 */
(0, vitest_1.describe)("confirmationTokenType", function () {
    (0, vitest_1.it)("falls back to Bearer for a malformed confirmation instead of throwing", function () {
        // A corrupted `confirmation` JSON column can deserialize to a primitive or
        // array; the token type must degrade to Bearer rather than 500.
        for (var _i = 0, _a = ["garbage", 42, ["jkt"], { jkt: "" }]; _i < _a.length; _i++) {
            var malformed = _a[_i];
            (0, vitest_1.expect)((0, token_1.confirmationTokenType)(malformed)).toBe("Bearer");
        }
        (0, vitest_1.expect)((0, token_1.confirmationTokenType)({ jkt: "thumbprint" })).toBe("DPoP");
        (0, vitest_1.expect)((0, token_1.confirmationTokenType)(undefined)).toBe("Bearer");
    });
});
/**
 * The memory and MongoDB adapters do not enforce the `refreshId` foreign key,
 * so an access token insert that lands after a concurrent revocation succeeds.
 * Revocation must still leave no access token behind.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2
 * @see https://datatracker.ietf.org/doc/html/rfc9700#section-4.14.2
 */
(0, vitest_1.describe)("oauth token - in-flight issuance without foreign keys", function () { return __awaiter(void 0, void 0, void 0, function () {
    function authorize() {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, url, location, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                id: "test",
                                options: clientOptions,
                                redirectURI: "",
                                authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                state: "123",
                                scopes: ["openid", "offline_access"],
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        url = _a.sent();
                        location = "";
                        return [4 /*yield*/, client.$fetch(url.toString(), {
                                headers: headers,
                                onError: function (context) {
                                    location = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _a.sent();
                        code = new URL(location).searchParams.get("code");
                        return [2 /*return*/, { code: code, codeVerifier: codeVerifier }];
                }
            });
        });
    }
    function redeem(code, codeVerifier) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, headers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                            code: code,
                            codeVerifier: codeVerifier,
                            redirectURI: redirectUri,
                            options: clientOptions,
                        })];
                    case 1:
                        _a = _b.sent(), body = _a.body, headers = _a.headers;
                        return [2 /*return*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: headers,
                            })];
                }
            });
        });
    }
    function refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, headers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                            refreshToken: refreshToken,
                            options: clientOptions,
                        })];
                    case 1:
                        _a = _b.sent(), body = _a.body, headers = _a.headers;
                        return [2 /*return*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: headers,
                            })];
                }
            });
        });
    }
    /** Pauses the first adapter call that `matches` until `release` runs. */
    function holdNext(method, matches) {
        return __awaiter(this, void 0, void 0, function () {
            var context, original, reached, released, spy;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auth.$context];
                    case 1:
                        context = _a.sent();
                        original = context.adapter[method].bind(context.adapter);
                        reached = Promise.withResolvers();
                        released = Promise.withResolvers();
                        spy = vitest_1.vi.spyOn(context.adapter, method);
                        spy.mockImplementation((function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!matches(args[0].model)) return [3 /*break*/, 2];
                                            spy.mockRestore();
                                            reached.resolve();
                                            return [4 /*yield*/, released.promise];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/, original.apply(void 0, args)];
                                    }
                                });
                            });
                        }));
                        return [2 /*return*/, {
                                reached: reached.promise,
                                release: released.resolve,
                                restore: function () {
                                    released.resolve();
                                    spy.mockRestore();
                                },
                            }];
                }
            });
        });
    }
    var authServerBaseUrl, redirectUri, database, _a, auth, client, signInWithTestUser, headers, oauthClient, clientOptions;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                redirectUri = "http://localhost:5000/api/auth/callback/test";
                database = {
                    account: [],
                    jwks: [],
                    oauthAccessToken: [],
                    oauthClient: [],
                    oauthClientAssertion: [],
                    oauthClientResource: [],
                    oauthConsent: [],
                    oauthRefreshToken: [],
                    oauthResource: [],
                    session: [],
                    user: [],
                    verification: [],
                };
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        database: (0, memory_adapter_1.memoryAdapter)(database),
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                            (0, oauth_1.oauthProvider)({ loginPage: "/login", consentPage: "/consent" }),
                        ],
                    }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                        headers: headers,
                        body: {
                            token_endpoint_auth_method: "client_secret_post",
                            grant_types: ["authorization_code", "refresh_token"],
                            redirect_uris: [redirectUri],
                            application_type: "native",
                            skip_consent: true,
                        },
                    })];
            case 3:
                oauthClient = _b.sent();
                clientOptions = {
                    clientId: oauthClient.client_id,
                    clientSecret: oauthClient.client_secret,
                    redirectURI: redirectUri,
                };
                (0, vitest_1.beforeEach)(function () {
                    database.oauthAccessToken = [];
                    database.oauthRefreshToken = [];
                });
                (0, vitest_1.it)("fails an in-flight redemption and keeps no access token when a replay revokes it", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, insert, redeeming, replay, redeemed;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authorize()];
                            case 1:
                                _a = _b.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, holdNext("create", function (m) { return m === "oauthAccessToken"; })];
                            case 2:
                                insert = _b.sent();
                                _b.label = 3;
                            case 3:
                                _b.trys.push([3, , 7, 8]);
                                redeeming = redeem(code, codeVerifier);
                                return [4 /*yield*/, insert.reached];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, redeem(code, codeVerifier)];
                            case 5:
                                replay = _b.sent();
                                insert.release();
                                return [4 /*yield*/, redeeming];
                            case 6:
                                redeemed = _b.sent();
                                (0, vitest_1.expect)(replay.error).toMatchObject({ error: "invalid_grant" });
                                (0, vitest_1.expect)(redeemed.error).toMatchObject({ error: "invalid_grant" });
                                (0, vitest_1.expect)(database.oauthAccessToken).toHaveLength(0);
                                (0, vitest_1.expect)(database.oauthRefreshToken).toHaveLength(0);
                                return [3 /*break*/, 8];
                            case 7:
                                insert.restore();
                                return [7 /*endfinally*/];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("fails an in-flight rotation and keeps no access token when reuse revokes its family", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, issued, parentToken, insert, rotating, reused, rotated;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authorize()];
                            case 1:
                                _a = _b.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, redeem(code, codeVerifier)];
                            case 2:
                                issued = _b.sent();
                                parentToken = issued.data.refresh_token;
                                return [4 /*yield*/, holdNext("create", function (m) { return m === "oauthAccessToken"; })];
                            case 3:
                                insert = _b.sent();
                                _b.label = 4;
                            case 4:
                                _b.trys.push([4, , 8, 9]);
                                rotating = refresh(parentToken);
                                return [4 /*yield*/, insert.reached];
                            case 5:
                                _b.sent();
                                return [4 /*yield*/, refresh(parentToken)];
                            case 6:
                                reused = _b.sent();
                                insert.release();
                                return [4 /*yield*/, rotating];
                            case 7:
                                rotated = _b.sent();
                                (0, vitest_1.expect)(reused.error).toMatchObject({ error: "invalid_grant" });
                                (0, vitest_1.expect)(rotated.error).toMatchObject({ error: "invalid_grant" });
                                (0, vitest_1.expect)(database.oauthAccessToken).toHaveLength(0);
                                return [3 /*break*/, 9];
                            case 8:
                                insert.restore();
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("revokes every access token in a family larger than the findMany limit", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, issued, parentToken, context, family, i, sibling, rotated, reused;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authorize()];
                            case 1:
                                _a = _b.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, redeem(code, codeVerifier)];
                            case 2:
                                issued = _b.sent();
                                parentToken = issued.data.refresh_token;
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                context = _b.sent();
                                family = database.oauthRefreshToken[0];
                                i = 0;
                                _b.label = 4;
                            case 4:
                                if (!(i < 101)) return [3 /*break*/, 8];
                                return [4 /*yield*/, context.adapter.create({
                                        model: "oauthRefreshToken",
                                        data: {
                                            token: "sibling-refresh-".concat(i),
                                            clientId: family.clientId,
                                            userId: family.userId,
                                            scopes: ["openid", "offline_access"],
                                            createdAt: new Date(),
                                            expiresAt: new Date(Date.now() + 60000),
                                        },
                                    })];
                            case 5:
                                sibling = _b.sent();
                                return [4 /*yield*/, context.adapter.create({
                                        model: "oauthAccessToken",
                                        data: {
                                            token: "sibling-access-".concat(i),
                                            clientId: family.clientId,
                                            userId: family.userId,
                                            refreshId: sibling.id,
                                            scopes: ["openid"],
                                            createdAt: new Date(),
                                            expiresAt: new Date(Date.now() + 60000),
                                        },
                                    })];
                            case 6:
                                _b.sent();
                                _b.label = 7;
                            case 7:
                                i++;
                                return [3 /*break*/, 4];
                            case 8: return [4 /*yield*/, refresh(parentToken)];
                            case 9:
                                rotated = _b.sent();
                                (0, vitest_1.expect)(rotated.error).toBeNull();
                                return [4 /*yield*/, refresh(parentToken)];
                            case 10:
                                reused = _b.sent();
                                (0, vitest_1.expect)(reused.error).toMatchObject({ error: "invalid_grant" });
                                (0, vitest_1.expect)(database.oauthRefreshToken).toHaveLength(0);
                                (0, vitest_1.expect)(database.oauthAccessToken).toHaveLength(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("removes an access token stored between the revocation's deletes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, issued, parentToken, insert, familyDelete, rotating, reusing, rotated, reused;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authorize()];
                            case 1:
                                _a = _b.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, redeem(code, codeVerifier)];
                            case 2:
                                issued = _b.sent();
                                parentToken = issued.data.refresh_token;
                                return [4 /*yield*/, holdNext("create", function (m) { return m === "oauthAccessToken"; })];
                            case 3:
                                insert = _b.sent();
                                return [4 /*yield*/, holdNext("deleteMany", function (m) { return m === "oauthRefreshToken"; })];
                            case 4:
                                familyDelete = _b.sent();
                                _b.label = 5;
                            case 5:
                                _b.trys.push([5, , 10, 11]);
                                rotating = refresh(parentToken);
                                return [4 /*yield*/, insert.reached];
                            case 6:
                                _b.sent();
                                reusing = refresh(parentToken);
                                return [4 /*yield*/, familyDelete.reached];
                            case 7:
                                _b.sent();
                                insert.release();
                                return [4 /*yield*/, rotating];
                            case 8:
                                rotated = _b.sent();
                                familyDelete.release();
                                return [4 /*yield*/, reusing];
                            case 9:
                                reused = _b.sent();
                                (0, vitest_1.expect)(rotated.error).toBeNull();
                                (0, vitest_1.expect)(reused.error).toMatchObject({ error: "invalid_grant" });
                                (0, vitest_1.expect)(database.oauthAccessToken).toHaveLength(0);
                                (0, vitest_1.expect)(database.oauthRefreshToken).toHaveLength(0);
                                return [3 /*break*/, 11];
                            case 10:
                                insert.restore();
                                familyDelete.restore();
                                return [7 /*endfinally*/];
                            case 11: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/pull/12402
 */
(0, vitest_1.describe)("oauth token - refresh family revocation with serial ids", function () { return __awaiter(void 0, void 0, void 0, function () {
    function issue(scopes) {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, url, location, _a, body, tokenHeaders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                                id: "test",
                                options: clientOptions,
                                redirectURI: "",
                                authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                state: "123",
                                scopes: scopes,
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        url = _b.sent();
                        location = "";
                        return [4 /*yield*/, client.$fetch(url.toString(), {
                                headers: headers,
                                onError: function (context) {
                                    location = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, (0, oauth2_2.authorizationCodeRequest)({
                                code: new URL(location).searchParams.get("code"),
                                codeVerifier: codeVerifier,
                                redirectURI: redirectUri,
                                options: clientOptions,
                            })];
                    case 3:
                        _a = _b.sent(), body = _a.body, tokenHeaders = _a.headers;
                        return [2 /*return*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: tokenHeaders,
                            })];
                }
            });
        });
    }
    function refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, tokenHeaders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, oauth2_2.refreshAccessTokenRequest)({
                            refreshToken: refreshToken,
                            options: clientOptions,
                        })];
                    case 1:
                        _a = _b.sent(), body = _a.body, tokenHeaders = _a.headers;
                        return [2 /*return*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: tokenHeaders,
                            })];
                }
            });
        });
    }
    var authServerBaseUrl, redirectUri, database, _a, auth, client, signInWithTestUser, headers, oauthClient, clientOptions;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                redirectUri = "http://localhost:5000/api/auth/callback/test";
                database = {
                    account: [],
                    jwks: [],
                    oauthAccessToken: [],
                    oauthClient: [],
                    oauthClientAssertion: [],
                    oauthClientResource: [],
                    oauthConsent: [],
                    oauthRefreshToken: [],
                    oauthResource: [],
                    session: [],
                    user: [],
                    verification: [],
                };
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        database: (0, memory_adapter_1.memoryAdapter)(database),
                        advanced: { database: { generateId: "serial" } },
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                            (0, oauth_1.oauthProvider)({ loginPage: "/login", consentPage: "/consent" }),
                        ],
                    }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                        headers: headers,
                        body: {
                            token_endpoint_auth_method: "client_secret_post",
                            grant_types: ["authorization_code", "refresh_token"],
                            redirect_uris: [redirectUri],
                            application_type: "native",
                            skip_consent: true,
                        },
                    })];
            case 3:
                oauthClient = _b.sent();
                clientOptions = {
                    clientId: oauthClient.client_id,
                    clientSecret: oauthClient.client_secret,
                    redirectURI: redirectUri,
                };
                (0, vitest_1.it)("keeps access tokens issued without a refresh token when reuse revokes a family", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var accessOnly, family, parentToken, _a, reused;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, issue(["openid"])];
                            case 1:
                                accessOnly = _e.sent();
                                (0, vitest_1.expect)((_b = accessOnly.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeUndefined();
                                return [4 /*yield*/, issue(["openid", "offline_access"])];
                            case 2:
                                family = _e.sent();
                                parentToken = family.data.refresh_token;
                                _a = vitest_1.expect;
                                return [4 /*yield*/, refresh(parentToken)];
                            case 3:
                                _a.apply(void 0, [(_e.sent()).error]).toBeNull();
                                return [4 /*yield*/, refresh(parentToken)];
                            case 4:
                                reused = _e.sent();
                                (0, vitest_1.expect)(reused.error).toMatchObject({ error: "invalid_grant" });
                                (0, vitest_1.expect)(database.oauthAccessToken).toHaveLength(1);
                                (0, vitest_1.expect)((_d = (_c = database.oauthAccessToken) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.refreshId).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
