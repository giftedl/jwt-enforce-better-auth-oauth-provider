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
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
var INVALID_ACCESS_TOKEN_CHALLENGE = 'Bearer error="invalid_token", error_description="Invalid access token"';
(0, vitest_1.describe)("oauth userinfo", function () { return __awaiter(void 0, void 0, void 0, function () {
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
    function validateAuthCode(overrides, extraHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, headers, tokenHeaders, _i, _b, _c, key, value, tokens;
            return __generator(this, function (_d) {
                switch (_d.label) {
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
                        _a = _d.sent(), body = _a.body, headers = _a.headers;
                        tokenHeaders = new Headers(headers);
                        if (extraHeaders) {
                            for (_i = 0, _b = new Headers(extraHeaders); _i < _b.length; _i++) {
                                _c = _b[_i], key = _c[0], value = _c[1];
                                tokenHeaders.set(key, value);
                            }
                        }
                        return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: body,
                                headers: tokenHeaders,
                            })];
                    case 2:
                        tokens = _d.sent();
                        return [2 /*return*/, tokens];
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
                        return [4 /*yield*/, (0, oauth2_1.deriveDpopJkt)(publicJwk)];
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
                        return [4 /*yield*/, (0, oauth2_1.deriveDpopAth)(params.accessToken)];
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
    function refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, body, headers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        return [4 /*yield*/, (0, oauth2_1.refreshAccessTokenRequest)({
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
    var authServerBaseUrl, rpBaseUrl, validResource, _a, auth, signInWithTestUser, customFetchImpl, _b, headers, user, client, oauthClient, providerId, redirectUri, state;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                validResource = "https://myapi.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: "".concat(authServerBaseUrl, "/api/auth/"),
                        advanced: { skipTrailingSlashes: true },
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
                _a = _c.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                _b = _c.sent(), headers = _b.headers, user = _b.user;
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
                    var tokens, userinfo;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _c.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.oauth2.userinfo()];
                            case 2:
                                userinfo = _c.sent();
                                (0, vitest_1.expect)((_b = userinfo.error) === null || _b === void 0 ? void 0 : _b.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/9949
                 */
                (0, vitest_1.it)("should return an invalid_token challenge for an unknown bearer token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var wwwAuthenticate, userinfo;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                wwwAuthenticate = "";
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: "Bearer this-is-not-a-valid-access-token",
                                        },
                                        onError: function (context) {
                                            var _a;
                                            wwwAuthenticate =
                                                (_a = context.response.headers.get("WWW-Authenticate")) !== null && _a !== void 0 ? _a : "";
                                        },
                                    })];
                            case 1:
                                userinfo = _b.sent();
                                (0, vitest_1.expect)((_a = userinfo.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                (0, vitest_1.expect)(userinfo.error.error).toBe("invalid_token");
                                (0, vitest_1.expect)(wwwAuthenticate).toBe(INVALID_ACCESS_TOKEN_CHALLENGE);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail without the openid scope", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, getTokens({
                                    scopes: ["profile"],
                                })];
                            case 1:
                                tokens = _e.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                        },
                                    })];
                            case 2:
                                userinfo = _e.sent();
                                (0, vitest_1.expect)((_d = userinfo.error) === null || _d === void 0 ? void 0 : _d.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a revoked access token with invalid_token (401), not invalid_scope", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, ctx, session, error_1, err, headers_1;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                ctx = _b.sent();
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 3:
                                session = _b.sent();
                                return [4 /*yield*/, ctx.adapter.updateMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "sessionId", value: session.session.id }],
                                        update: { revoked: new Date() },
                                    })];
                            case 4:
                                _b.sent();
                                _b.label = 5;
                            case 5:
                                _b.trys.push([5, 7, , 8]);
                                return [4 /*yield*/, auth.api.oauth2UserInfo({
                                        headers: new Headers({
                                            Authorization: "Bearer ".concat(tokens.data.access_token),
                                        }),
                                    })];
                            case 6:
                                _b.sent();
                                vitest_1.expect.unreachable();
                                return [3 /*break*/, 8];
                            case 7:
                                error_1 = _b.sent();
                                err = error_1;
                                headers_1 = new Headers(err.headers);
                                (0, vitest_1.expect)(err.statusCode).toBe(401);
                                (0, vitest_1.expect)(err.body).toMatchObject({ error: "invalid_token" });
                                (0, vitest_1.expect)(headers_1.get("WWW-Authenticate")).toBe(INVALID_ACCESS_TOKEN_CHALLENGE);
                                return [3 /*break*/, 8];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass provide all user information - opaque", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                        },
                                    })];
                            case 2:
                                userinfo = _d.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({
                                    sub: user.id,
                                    name: user.name,
                                    given_name: vitest_1.expect.any(String),
                                    family_name: vitest_1.expect.any(String),
                                    email: user.email,
                                    email_verified: user.emailVerified,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should accept POST with the bearer token in the Authorization header", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        method: "POST",
                                        headers: {
                                            authorization: "Bearer ".concat((_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : ""),
                                        },
                                    })];
                            case 2:
                                userinfo = _d.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({ sub: user.id });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should accept POST with the bearer token in the form body", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        method: "POST",
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        body: new URLSearchParams({
                                            access_token: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                        }),
                                    })];
                            case 2:
                                userinfo = _d.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({ sub: user.id });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject UserInfo requests with bearer tokens in both header and body", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        method: "POST",
                                        headers: {
                                            authorization: "Bearer ".concat((_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : ""),
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        body: new URLSearchParams({
                                            access_token: (_e = (_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : "",
                                        }),
                                    })];
                            case 2:
                                userinfo = _j.sent();
                                (0, vitest_1.expect)((_f = userinfo.error) === null || _f === void 0 ? void 0 : _f.status).toBe(400);
                                (0, vitest_1.expect)((_g = userinfo.error) === null || _g === void 0 ? void 0 : _g.error).toBe("invalid_request");
                                (0, vitest_1.expect)((_h = userinfo.error) === null || _h === void 0 ? void 0 : _h.error_description).toBe("Multiple access token transport methods are not allowed");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * Programmatic callers have no `ctx.request`, so userinfo must resolve the
                 * bearer token from `ctx.headers` for both transports.
                 *
                 * @see https://github.com/better-auth/better-auth/issues/8806
                 */
                (0, vitest_1.it)("should return userinfo via auth.api with headers only (no Request)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, getTokens()];
                            case 1:
                                tokens = _b.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, auth.api.oauth2UserInfo({
                                        headers: new Headers({
                                            Authorization: "Bearer ".concat(tokens.data.access_token),
                                        }),
                                    })];
                            case 2:
                                userinfo = _b.sent();
                                (0, vitest_1.expect)(userinfo).toMatchObject({
                                    sub: user.id,
                                    name: user.name,
                                    given_name: vitest_1.expect.any(String),
                                    family_name: vitest_1.expect.any(String),
                                    email: user.email,
                                    email_verified: user.emailVerified,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject auth.api userinfo when Authorization header is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_2, err;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, auth.api.oauth2UserInfo({ headers: new Headers() })];
                            case 1:
                                _a.sent();
                                vitest_1.expect.unreachable();
                                return [3 /*break*/, 3];
                            case 2:
                                error_2 = _a.sent();
                                err = error_2;
                                (0, vitest_1.expect)(err.statusCode).toBe(401);
                                (0, vitest_1.expect)(err.body).toMatchObject({
                                    error: "invalid_request",
                                    error_description: "access token not found",
                                });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass provide all user information - jwt", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, getTokens(undefined, validResource)];
                            case 1:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                        },
                                    })];
                            case 2:
                                userinfo = _d.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({
                                    sub: user.id,
                                    name: user.name,
                                    given_name: vitest_1.expect.any(String),
                                    family_name: vitest_1.expect.any(String),
                                    email: user.email,
                                    email_verified: user.emailVerified,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("enforces DPoP proof for DPoP-bound userinfo access", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dpopKey, _a, authUrl, codeVerifier, callbackRedirectUrl, callbackUrl, tokenDpopProof, tokens, bearerUserinfo, bodyTokenUserinfo, userinfoDpopProof, response, userinfo;
                    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                    return __generator(this, function (_q) {
                        switch (_q.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _q.sent();
                                return [4 /*yield*/, createAuthUrl({
                                        additionalParams: { dpop_jkt: dpopKey.jkt },
                                    })];
                            case 2:
                                _a = _q.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _q.sent();
                                callbackUrl = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: "".concat(authServerBaseUrl, "/api/auth/oauth2/token"),
                                        jti: "token-proof",
                                    })];
                            case 4:
                                tokenDpopProof = _q.sent();
                                return [4 /*yield*/, validateAuthCode({
                                        code: callbackUrl.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                        resource: validResource,
                                    }, { DPoP: tokenDpopProof })];
                            case 5:
                                tokens = _q.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.token_type).toBe("DPoP");
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: "Bearer ".concat((_e = (_d = tokens.data) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : ""),
                                        },
                                    })];
                            case 6:
                                bearerUserinfo = _q.sent();
                                (0, vitest_1.expect)((_f = bearerUserinfo.error) === null || _f === void 0 ? void 0 : _f.status).toBe(401);
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        method: "POST",
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        body: new URLSearchParams({
                                            access_token: (_h = (_g = tokens.data) === null || _g === void 0 ? void 0 : _g.access_token) !== null && _h !== void 0 ? _h : "",
                                        }),
                                    })];
                            case 7:
                                bodyTokenUserinfo = _q.sent();
                                (0, vitest_1.expect)((_j = bodyTokenUserinfo.error) === null || _j === void 0 ? void 0 : _j.status).toBe(401);
                                (0, vitest_1.expect)((_k = bodyTokenUserinfo.error) === null || _k === void 0 ? void 0 : _k.error).toBe("invalid_token");
                                (0, vitest_1.expect)((_l = bodyTokenUserinfo.error) === null || _l === void 0 ? void 0 : _l.error_description).toBe("DPoP-bound access token requires the DPoP authorization scheme");
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "GET",
                                        url: "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo"),
                                        jti: "userinfo-proof",
                                        accessToken: (_m = tokens.data) === null || _m === void 0 ? void 0 : _m.access_token,
                                    })];
                            case 8:
                                userinfoDpopProof = _q.sent();
                                return [4 /*yield*/, customFetchImpl("http://auth-service:3000/api/auth/oauth2/userinfo", {
                                        headers: {
                                            authorization: "DPoP ".concat((_p = (_o = tokens.data) === null || _o === void 0 ? void 0 : _o.access_token) !== null && _p !== void 0 ? _p : ""),
                                            DPoP: userinfoDpopProof,
                                        },
                                    })];
                            case 9:
                                response = _q.sent();
                                return [4 /*yield*/, response.json()];
                            case 10:
                                userinfo = _q.sent();
                                (0, vitest_1.expect)(response.status).toBe(200);
                                (0, vitest_1.expect)(userinfo).toMatchObject({
                                    sub: user.id,
                                    name: user.name,
                                    email: user.email,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/rfc9449#section-4.3
                 */
                (0, vitest_1.it)("keeps the trailing slash of a DPoP userinfo request when skipTrailingSlashes is on", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dpopKey, _a, authUrl, codeVerifier, callbackRedirectUrl, tokens, _b, _c, accessToken, userinfoUrl, response, _d, _e, _f;
                    var _g, _h, _j;
                    var _k, _l;
                    return __generator(this, function (_m) {
                        switch (_m.label) {
                            case 0: return [4 /*yield*/, createDpopKey()];
                            case 1:
                                dpopKey = _m.sent();
                                return [4 /*yield*/, createAuthUrl({
                                        additionalParams: { dpop_jkt: dpopKey.jkt },
                                    })];
                            case 2:
                                _a = _m.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _m.sent();
                                _b = validateAuthCode;
                                _c = [{
                                        code: new URL(callbackRedirectUrl).searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                        resource: validResource,
                                    }];
                                _g = {};
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "POST",
                                        url: "".concat(authServerBaseUrl, "/api/auth/oauth2/token"),
                                        jti: "trailing-slash-token-proof",
                                    })];
                            case 4: return [4 /*yield*/, _b.apply(void 0, _c.concat([(_g.DPoP = _m.sent(),
                                        _g)]))];
                            case 5:
                                tokens = _m.sent();
                                accessToken = (_l = (_k = tokens.data) === null || _k === void 0 ? void 0 : _k.access_token) !== null && _l !== void 0 ? _l : "";
                                userinfoUrl = "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo/");
                                _d = customFetchImpl;
                                _e = [userinfoUrl];
                                _h = {};
                                _j = {
                                    authorization: "DPoP ".concat(accessToken)
                                };
                                return [4 /*yield*/, createDpopProof({
                                        privateKey: dpopKey.privateKey,
                                        publicJwk: dpopKey.publicJwk,
                                        method: "GET",
                                        url: userinfoUrl,
                                        jti: "trailing-slash-userinfo-proof",
                                        accessToken: accessToken,
                                    })];
                            case 6: return [4 /*yield*/, _d.apply(void 0, _e.concat([(_h.headers = (_j.DPoP = _m.sent(),
                                        _j),
                                        _h)]))];
                            case 7:
                                response = _m.sent();
                                (0, vitest_1.expect)(response.status).toBe(200);
                                _f = vitest_1.expect;
                                return [4 /*yield*/, response.json()];
                            case 8:
                                _f.apply(void 0, [_m.sent()]).toMatchObject({ sub: user.id });
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * Every 401 carries a challenge (RFC 7235 §3.1). A DPoP-bound token, or a
                 * request that used the DPoP scheme, is challenged with `DPoP` and the
                 * accepted proof algorithms; everything else with `Bearer`.
                 *
                 * @see https://datatracker.ietf.org/doc/html/rfc9449#section-7.1
                 * @see https://datatracker.ietf.org/doc/html/rfc6750#section-3
                 */
                (0, vitest_1.describe)("WWW-Authenticate challenges", function () {
                    var userinfoUrl = "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo");
                    var algs = oauth2_1.DPOP_SIGNING_ALGORITHMS.join(" ");
                    var dpopChallenge = function (error, description) {
                        return "DPoP error=\"".concat(error, "\", error_description=\"").concat(description, "\", algs=\"").concat(algs, "\"");
                    };
                    function getDpopBoundToken() {
                        return __awaiter(this, void 0, void 0, function () {
                            var dpopKey, _a, authUrl, codeVerifier, callbackRedirectUrl, tokens, _b, _c;
                            var _d;
                            var _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0: return [4 /*yield*/, createDpopKey()];
                                    case 1:
                                        dpopKey = _f.sent();
                                        return [4 /*yield*/, createAuthUrl({
                                                additionalParams: { dpop_jkt: dpopKey.jkt },
                                            })];
                                    case 2:
                                        _a = _f.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                        callbackRedirectUrl = "";
                                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                                onError: function (context) {
                                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                                },
                                            })];
                                    case 3:
                                        _f.sent();
                                        _b = validateAuthCode;
                                        _c = [{
                                                code: new URL(callbackRedirectUrl).searchParams.get("code"),
                                                codeVerifier: codeVerifier,
                                                resource: validResource,
                                            }];
                                        _d = {};
                                        return [4 /*yield*/, createDpopProof({
                                                privateKey: dpopKey.privateKey,
                                                publicJwk: dpopKey.publicJwk,
                                                method: "POST",
                                                url: "".concat(authServerBaseUrl, "/api/auth/oauth2/token"),
                                                jti: crypto.randomUUID(),
                                            })];
                                    case 4: return [4 /*yield*/, _b.apply(void 0, _c.concat([(_d.DPoP = _f.sent(),
                                                _d)]))];
                                    case 5:
                                        tokens = _f.sent();
                                        (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.token_type).toBe("DPoP");
                                        return [2 /*return*/, { dpopKey: dpopKey, accessToken: tokens.data.access_token }];
                                }
                            });
                        });
                    }
                    function requestUserinfo(init) {
                        return __awaiter(this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, customFetchImpl(userinfoUrl, init)];
                                    case 1:
                                        response = _a.sent();
                                        return [2 /*return*/, {
                                                status: response.status,
                                                challenge: response.headers.get("WWW-Authenticate"),
                                                exposed: response.headers.get("Access-Control-Expose-Headers"),
                                            }];
                                }
                            });
                        });
                    }
                    (0, vitest_1.it)("offers both schemes without an error code when no token is sent", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, requestUserinfo({})];
                                case 1:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe("Bearer, DPoP algs=\"".concat(algs, "\""));
                                    (0, vitest_1.expect)(result.exposed).toBe("WWW-Authenticate");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("carries the no-token challenge on an auth.api error", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var error;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, auth.api
                                        .oauth2UserInfo({ headers: new Headers() })
                                        .catch(function (error) { return error; })];
                                case 1:
                                    error = _a.sent();
                                    (0, vitest_1.expect)(error.statusCode).toBe(401);
                                    (0, vitest_1.expect)(new Headers(error.headers).get("WWW-Authenticate")).toBe("Bearer, DPoP algs=\"".concat(algs, "\""));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("keeps the Bearer challenge for an invalid token sent with the Bearer scheme", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, requestUserinfo({
                                        headers: { authorization: "Bearer this-is-not-a-valid-access-token" },
                                    })];
                                case 1:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(INVALID_ACCESS_TOKEN_CHALLENGE);
                                    (0, vitest_1.expect)(result.exposed).toBe("WWW-Authenticate");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with DPoP for an invalid token sent with the DPoP scheme", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, requestUserinfo({
                                        headers: { authorization: "DPoP this-is-not-a-valid-access-token" },
                                    })];
                                case 1:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_token", "Invalid access token"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with DPoP when a DPoP-bound token is sent with the Bearer scheme", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var accessToken, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    accessToken = (_a.sent()).accessToken;
                                    return [4 /*yield*/, requestUserinfo({
                                            headers: { authorization: "Bearer ".concat(accessToken) },
                                        })];
                                case 2:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_token", "DPoP-bound access token requires the DPoP authorization scheme"));
                                    (0, vitest_1.expect)(result.exposed).toBe("WWW-Authenticate");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with DPoP when a DPoP-bound token is sent in the form body", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var accessToken, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    accessToken = (_a.sent()).accessToken;
                                    return [4 /*yield*/, requestUserinfo({
                                            method: "POST",
                                            headers: { "content-type": "application/x-www-form-urlencoded" },
                                            body: new URLSearchParams({ access_token: accessToken }),
                                        })];
                                case 2:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_token", "DPoP-bound access token requires the DPoP authorization scheme"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with DPoP when the DPoP scheme carries a token that is not DPoP-bound", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var tokens, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getTokens()];
                                case 1:
                                    tokens = _a.sent();
                                    return [4 /*yield*/, requestUserinfo({
                                            headers: { authorization: "DPoP ".concat(tokens.data.access_token) },
                                        })];
                                case 2:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_token", "DPoP authorization requires a DPoP-bound access token"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with invalid_dpop_proof when the proof is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var accessToken, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    accessToken = (_a.sent()).accessToken;
                                    return [4 /*yield*/, requestUserinfo({
                                            headers: { authorization: "DPoP ".concat(accessToken) },
                                        })];
                                case 2:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_dpop_proof", "DPoP proof header is required"));
                                    (0, vitest_1.expect)(result.exposed).toBe("WWW-Authenticate");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with invalid_dpop_proof when the proof is not a JWT", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var accessToken, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    accessToken = (_a.sent()).accessToken;
                                    return [4 /*yield*/, requestUserinfo({
                                            headers: { authorization: "DPoP ".concat(accessToken), DPoP: "not-a-jwt" },
                                        })];
                                case 2:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_dpop_proof", "DPoP proof must be a compact JWT"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with invalid_dpop_proof when the proof htu does not match", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, dpopKey, accessToken, result, _b;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    _a = _e.sent(), dpopKey = _a.dpopKey, accessToken = _a.accessToken;
                                    _b = requestUserinfo;
                                    _c = {};
                                    _d = {
                                        authorization: "DPoP ".concat(accessToken)
                                    };
                                    return [4 /*yield*/, createDpopProof({
                                            privateKey: dpopKey.privateKey,
                                            publicJwk: dpopKey.publicJwk,
                                            method: "GET",
                                            url: "".concat(authServerBaseUrl, "/api/auth/oauth2/introspect"),
                                            jti: crypto.randomUUID(),
                                            accessToken: accessToken,
                                        })];
                                case 2: return [4 /*yield*/, _b.apply(void 0, [(_c.headers = (_d.DPoP = _e.sent(),
                                            _d),
                                            _c)])];
                                case 3:
                                    result = _e.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_dpop_proof", "DPoP proof htu does not match the request URL"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with invalid_dpop_proof when the proof htm does not match", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, dpopKey, accessToken, result, _b;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    _a = _e.sent(), dpopKey = _a.dpopKey, accessToken = _a.accessToken;
                                    _b = requestUserinfo;
                                    _c = {};
                                    _d = {
                                        authorization: "DPoP ".concat(accessToken)
                                    };
                                    return [4 /*yield*/, createDpopProof({
                                            privateKey: dpopKey.privateKey,
                                            publicJwk: dpopKey.publicJwk,
                                            method: "POST",
                                            url: userinfoUrl,
                                            jti: crypto.randomUUID(),
                                            accessToken: accessToken,
                                        })];
                                case 2: return [4 /*yield*/, _b.apply(void 0, [(_c.headers = (_d.DPoP = _e.sent(),
                                            _d),
                                            _c)])];
                                case 3:
                                    result = _e.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_dpop_proof", "DPoP proof htm does not match the request method"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("challenges with invalid_dpop_proof when the proof is signed by another key", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var accessToken, otherKey, result, _a;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    accessToken = (_d.sent()).accessToken;
                                    return [4 /*yield*/, createDpopKey()];
                                case 2:
                                    otherKey = _d.sent();
                                    _a = requestUserinfo;
                                    _b = {};
                                    _c = {
                                        authorization: "DPoP ".concat(accessToken)
                                    };
                                    return [4 /*yield*/, createDpopProof({
                                            privateKey: otherKey.privateKey,
                                            publicJwk: otherKey.publicJwk,
                                            method: "GET",
                                            url: userinfoUrl,
                                            jti: crypto.randomUUID(),
                                            accessToken: accessToken,
                                        })];
                                case 3: return [4 /*yield*/, _a.apply(void 0, [(_b.headers = (_c.DPoP = _d.sent(),
                                            _c),
                                            _b)])];
                                case 4:
                                    result = _d.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_dpop_proof", "DPoP proof key does not match the bound token"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("carries a DPoP challenge on an auth.api error for a DPoP-bound token", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var accessToken, error;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    accessToken = (_a.sent()).accessToken;
                                    return [4 /*yield*/, auth.api
                                            .oauth2UserInfo({
                                            headers: new Headers({ authorization: "DPoP ".concat(accessToken) }),
                                        })
                                            .catch(function (error) { return error; })];
                                case 2:
                                    error = _a.sent();
                                    (0, vitest_1.expect)(error.statusCode).toBe(401);
                                    (0, vitest_1.expect)(new Headers(error.headers).get("WWW-Authenticate")).toBe(dpopChallenge("invalid_token", "DPoP-bound access token requires an HTTP request context"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("sends no challenge on a successful Bearer request", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var tokens, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getTokens()];
                                case 1:
                                    tokens = _a.sent();
                                    return [4 /*yield*/, requestUserinfo({
                                            headers: { authorization: "Bearer ".concat(tokens.data.access_token) },
                                        })];
                                case 2:
                                    result = _a.sent();
                                    (0, vitest_1.expect)(result.status).toBe(200);
                                    (0, vitest_1.expect)(result.challenge).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    /**
                     * The message `DPoP proof typ must be "dpop+jwt"` contains quotes, which
                     * RFC 6750 §3 does not allow in `error_description`. The challenge carries
                     * them as single quotes instead of failing the request with 500.
                     *
                     * @see https://datatracker.ietf.org/doc/html/rfc6750#section-3
                     */
                    (0, vitest_1.it)("challenges with invalid_dpop_proof when the proof message contains quotes", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, dpopKey, accessToken, proof, _b, result;
                        var _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, getDpopBoundToken()];
                                case 1:
                                    _a = _d.sent(), dpopKey = _a.dpopKey, accessToken = _a.accessToken;
                                    _b = jose_1.SignJWT.bind;
                                    _c = {
                                        jti: crypto.randomUUID(),
                                        htm: "GET",
                                        htu: userinfoUrl,
                                        iat: Math.floor(Date.now() / 1000)
                                    };
                                    return [4 /*yield*/, (0, oauth2_1.deriveDpopAth)(accessToken)];
                                case 2: return [4 /*yield*/, new (_b.apply(jose_1.SignJWT, [void 0, (_c.ath = _d.sent(),
                                            _c)]))()
                                        .setProtectedHeader({
                                        typ: "JWT",
                                        alg: "ES256",
                                        jwk: dpopKey.publicJwk,
                                    })
                                        .sign(dpopKey.privateKey)];
                                case 3:
                                    proof = _d.sent();
                                    return [4 /*yield*/, requestUserinfo({
                                            headers: { authorization: "DPoP ".concat(accessToken), DPoP: proof },
                                        })];
                                case 4:
                                    result = _d.sent();
                                    (0, vitest_1.expect)(result.status).toBe(401);
                                    (0, vitest_1.expect)(result.challenge).toBe(dpopChallenge("invalid_dpop_proof", "DPoP proof typ must be 'dpop+jwt'"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.it)("should pass provide scoped user information - sub only", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, getTokens({
                                    scopes: ["openid"],
                                })];
                            case 1:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                        },
                                    })];
                            case 2:
                                userinfo = _j.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({
                                    sub: user.id,
                                });
                                (0, vitest_1.expect)((_d = userinfo.data) === null || _d === void 0 ? void 0 : _d.name).toBeUndefined();
                                (0, vitest_1.expect)((_e = userinfo.data) === null || _e === void 0 ? void 0 : _e.given_name).toBeUndefined();
                                (0, vitest_1.expect)((_f = userinfo.data) === null || _f === void 0 ? void 0 : _f.family_name).toBeUndefined();
                                (0, vitest_1.expect)((_g = userinfo.data) === null || _g === void 0 ? void 0 : _g.email).toBeUndefined();
                                (0, vitest_1.expect)((_h = userinfo.data) === null || _h === void 0 ? void 0 : _h.email_verified).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns explicitly requested UserInfo claims without granting the full scope bundle", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, accessToken, userinfo, introspection, introspectionClaims;
                    var _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, getTokens({
                                    scopes: ["openid"],
                                    additionalParams: {
                                        claims: JSON.stringify({
                                            userinfo: {
                                                name: { essential: true },
                                                email: null,
                                            },
                                        }),
                                    },
                                })];
                            case 1:
                                tokens = _g.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                accessToken = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token;
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: accessToken !== null && accessToken !== void 0 ? accessToken : "",
                                        },
                                    })];
                            case 2:
                                userinfo = _g.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({
                                    sub: user.id,
                                    name: user.name,
                                    email: user.email,
                                });
                                (0, vitest_1.expect)((_c = userinfo.data) === null || _c === void 0 ? void 0 : _c.given_name).toBeUndefined();
                                (0, vitest_1.expect)((_d = userinfo.data) === null || _d === void 0 ? void 0 : _d.family_name).toBeUndefined();
                                (0, vitest_1.expect)((_e = userinfo.data) === null || _e === void 0 ? void 0 : _e.email_verified).toBeUndefined();
                                return [4 /*yield*/, client.oauth2.introspect({
                                        client_id: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id,
                                        client_secret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret,
                                        token: accessToken,
                                        token_type_hint: "access_token",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 3:
                                introspection = _g.sent();
                                (0, vitest_1.expect)((_f = introspection.data) === null || _f === void 0 ? void 0 : _f.active).toBe(true);
                                introspectionClaims = introspection.data;
                                (0, vitest_1.expect)(introspectionClaims === null || introspectionClaims === void 0 ? void 0 : introspectionClaims.name).toBeUndefined();
                                (0, vitest_1.expect)(introspectionClaims === null || introspectionClaims === void 0 ? void 0 : introspectionClaims.email).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("preserves requested UserInfo claims across refresh-token rotation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, refreshedTokens, userinfo;
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, getTokens({
                                    scopes: ["openid", "offline_access"],
                                    additionalParams: {
                                        claims: JSON.stringify({
                                            userinfo: {
                                                name: { essential: true },
                                            },
                                        }),
                                    },
                                })];
                            case 1:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.refresh_token).toBeDefined();
                                return [4 /*yield*/, refreshAccessToken((_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.refresh_token) !== null && _c !== void 0 ? _c : "")];
                            case 2:
                                refreshedTokens = _j.sent();
                                (0, vitest_1.expect)((_d = refreshedTokens.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: (_f = (_e = refreshedTokens.data) === null || _e === void 0 ? void 0 : _e.access_token) !== null && _f !== void 0 ? _f : "",
                                        },
                                    })];
                            case 3:
                                userinfo = _j.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({
                                    sub: user.id,
                                    name: user.name,
                                });
                                (0, vitest_1.expect)((_g = userinfo.data) === null || _g === void 0 ? void 0 : _g.given_name).toBeUndefined();
                                (0, vitest_1.expect)((_h = userinfo.data) === null || _h === void 0 ? void 0 : _h.email).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("resolves JWT access-token UserInfo claims by scope, omitting individually requested claims", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, getTokens({
                                    scopes: ["openid"],
                                    additionalParams: {
                                        claims: JSON.stringify({
                                            userinfo: {
                                                name: { essential: true },
                                            },
                                        }),
                                    },
                                }, validResource)];
                            case 1:
                                tokens = _f.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                        },
                                    })];
                            case 2:
                                userinfo = _f.sent();
                                // A JWT access token has no per-issuance row, so a claim requested through
                                // `claims.userinfo` without its backing scope is omitted (OIDC Core
                                // §5.5.1). UserInfo claims for a JWT token come from granted scopes only.
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({ sub: user.id });
                                (0, vitest_1.expect)((_d = userinfo.data) === null || _d === void 0 ? void 0 : _d.name).toBeUndefined();
                                (0, vitest_1.expect)((_e = userinfo.data) === null || _e === void 0 ? void 0 : _e.email).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass provide scoped user information - profile only", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, getTokens({
                                    scopes: ["openid", "profile"],
                                })];
                            case 1:
                                tokens = _f.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                        },
                                    })];
                            case 2:
                                userinfo = _f.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({
                                    sub: user.id,
                                    name: user.name,
                                    given_name: vitest_1.expect.any(String),
                                    family_name: vitest_1.expect.any(String),
                                });
                                (0, vitest_1.expect)((_d = userinfo.data) === null || _d === void 0 ? void 0 : _d.email).toBeUndefined();
                                (0, vitest_1.expect)((_e = userinfo.data) === null || _e === void 0 ? void 0 : _e.email_verified).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass provide scoped user information - email only", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, userinfo;
                    var _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, getTokens({
                                    scopes: ["openid", "email"],
                                })];
                            case 1:
                                tokens = _g.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                        },
                                    })];
                            case 2:
                                userinfo = _g.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({
                                    sub: user.id,
                                    email: user.email,
                                    email_verified: user.emailVerified,
                                });
                                (0, vitest_1.expect)((_d = userinfo.data) === null || _d === void 0 ? void 0 : _d.name).toBeUndefined();
                                (0, vitest_1.expect)((_e = userinfo.data) === null || _e === void 0 ? void 0 : _e.given_name).toBeUndefined();
                                (0, vitest_1.expect)((_f = userinfo.data) === null || _f === void 0 ? void 0 : _f.family_name).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth userinfo - unresolved baseURL", function () { return __awaiter(void 0, void 0, void 0, function () {
    var auth;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                    baseURL: "",
                    plugins: [
                        (0, oauth_1.oauthProvider)({
                            loginPage: "/login",
                            consentPage: "/consent",
                            disableJwtPlugin: true,
                            scopes: ["openid", "read:posts"],
                            clientPrivileges: function () { return true; },
                        }),
                    ],
                })];
            case 1:
                auth = (_a.sent()).auth;
                /**
                 * Without a static `baseURL` or an HTTP request, `context.baseURL` stays
                 * empty; a headers-only call must still reach the normal token checks.
                 *
                 * @see https://github.com/better-auth/better-auth/issues/8806
                 */
                (0, vitest_1.it)("evaluates a headers-only call without a configured baseURL", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, client, tokens;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.signInEmail({
                                    body: { email: "test@test.com", password: "test123456" },
                                })];
                            case 1:
                                token = (_a.sent()).token;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: new Headers({ authorization: "Bearer ".concat(token) }),
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: ["client_credentials"],
                                            client_credentials_scopes: ["read:posts"],
                                        },
                                    })];
                            case 2:
                                client = _a.sent();
                                return [4 /*yield*/, auth.api.oauth2Token({
                                        body: {
                                            grant_type: "client_credentials",
                                            client_id: client.client_id,
                                            client_secret: client.client_secret,
                                            scope: "read:posts",
                                        },
                                    })];
                            case 3:
                                tokens = _a.sent();
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.oauth2UserInfo({
                                        headers: new Headers({
                                            authorization: "Bearer ".concat(tokens.access_token),
                                        }),
                                    })).rejects.toMatchObject({
                                        statusCode: 400,
                                        body: { error: "invalid_scope" },
                                    })];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth userinfo - exposed headers from hooks", function () { return __awaiter(void 0, void 0, void 0, function () {
    var customFetchImpl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                    baseURL: "http://localhost:3000",
                    hooks: {
                        before: (0, api_1.createAuthMiddleware)(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                ctx.setHeader("Access-Control-Expose-Headers", "X-Request-Id");
                                return [2 /*return*/];
                            });
                        }); }),
                    },
                    plugins: [
                        (0, oauth_1.oauthProvider)({
                            loginPage: "/login",
                            consentPage: "/consent",
                            disableJwtPlugin: true,
                        }),
                    ],
                })];
            case 1:
                customFetchImpl = (_a.sent()).customFetchImpl;
                (0, vitest_1.it)("keeps names a before hook exposed when a 401 exposes its challenge", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, customFetchImpl("http://localhost:3000/api/auth/oauth2/userinfo", { headers: { authorization: "Bearer this-is-not-a-valid-access-token" } })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(401);
                                (0, vitest_1.expect)(response.headers.get("Access-Control-Expose-Headers")).toBe("X-Request-Id, WWW-Authenticate");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
