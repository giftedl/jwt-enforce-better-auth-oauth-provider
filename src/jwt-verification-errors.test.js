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
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_1 = require("./client");
var oauth_1 = require("./oauth");
var authServerBaseUrl = "http://localhost:3000";
var rpBaseUrl = "http://localhost:5000";
var validResource = "https://myapi.example.com";
var redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/test");
var formHeaders = {
    accept: "application/json",
    "content-type": "application/x-www-form-urlencoded",
};
var ALG_NONE_TOKEN = "eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4In0.";
var INVALID_ACCESS_TOKEN_CHALLENGE = 'Bearer error="invalid_token", error_description="Invalid access token"';
function signAccessToken(privateKey, kid) {
    return new jose_1.SignJWT({ sub: "x", azp: "x" })
        .setProtectedHeader({ alg: "EdDSA", kid: kid })
        .setIssuer(authServerBaseUrl)
        .setAudience(validResource)
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(privateKey);
}
function signWithUnknownKey(kid) {
    return __awaiter(this, void 0, void 0, function () {
        var privateKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, jose_1.generateKeyPair)("EdDSA")];
                case 1:
                    privateKey = (_a.sent()).privateKey;
                    return [2 /*return*/, signAccessToken(privateKey, kid)];
            }
        });
    });
}
function tamperSignature(token) {
    var _a = token.split("."), header = _a[0], payload = _a[1], signature = _a[2];
    var tampered = "".concat(signature[0] === "A" ? "B" : "A").concat(signature.slice(1));
    return "".concat(header, ".").concat(payload, ".").concat(tampered);
}
/**
 * Starts an auth server with the oauth provider and registers one
 * confidential client on it.
 */
function setup(jwtPlugin, providerOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, auth, client, signInWithTestUser, headers, oauthClient;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: __spreadArray(__spreadArray([], (jwtPlugin ? [jwtPlugin] : []), true), [
                            (0, oauth_1.oauthProvider)(__assign({ loginPage: "/login", consentPage: "/consent", resources: [validResource], enforcePerClientResources: false }, providerOptions)),
                        ], false),
                    }, { clientOptions: { plugins: [(0, client_1.oauthProviderClient)()] } })];
                case 1:
                    _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                redirect_uris: [redirectUri],
                                application_type: "native",
                                token_endpoint_auth_method: "client_secret_post",
                                scope: "openid profile email offline_access",
                                skip_consent: true,
                            },
                        })];
                case 3:
                    oauthClient = _b.sent();
                    (0, vitest_1.expect)(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id).toBeDefined();
                    return [2 /*return*/, { auth: auth, headers: headers, client: client, oauthClient: oauthClient }];
            }
        });
    });
}
function getAccessToken(_a, resource_1) {
    return __awaiter(this, arguments, void 0, function (_b, resource) {
        var codeVerifier, authUrl, callbackRedirectUrl, code, _c, body, tokenHeaders, tokens;
        var client = _b.client, headers = _b.headers, oauthClient = _b.oauthClient;
        return __generator(this, function (_d) {
            switch (_d.label) {
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
                            state: "123",
                            scopes: ["openid", "profile", "email", "offline_access"],
                            codeVerifier: codeVerifier,
                        })];
                case 1:
                    authUrl = _d.sent();
                    callbackRedirectUrl = "";
                    return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                            headers: headers,
                            onError: function (context) {
                                callbackRedirectUrl = context.response.headers.get("Location") || "";
                            },
                        })];
                case 2:
                    _d.sent();
                    code = new URL(callbackRedirectUrl).searchParams.get("code");
                    return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
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
                case 3:
                    _c = _d.sent(), body = _c.body, tokenHeaders = _c.headers;
                    return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: tokenHeaders })];
                case 4:
                    tokens = _d.sent();
                    return [2 /*return*/, tokens.data.access_token];
            }
        });
    });
}
function introspect(_a, token) {
    var client = _a.client, oauthClient = _a.oauthClient;
    return client.oauth2.introspect({
        client_id: oauthClient.client_id,
        client_secret: oauthClient.client_secret,
        token: token,
        token_type_hint: "access_token",
    }, { headers: formHeaders });
}
function revoke(_a, token, tokenTypeHint) {
    var client = _a.client, oauthClient = _a.oauthClient;
    return client.oauth2.revoke(__assign({ client_id: oauthClient.client_id, client_secret: oauthClient.client_secret, token: token }, (tokenTypeHint ? { token_type_hint: tokenTypeHint } : {})), { headers: formHeaders });
}
function userinfo(_a, token, onError) {
    var client = _a.client;
    return client.$fetch("/oauth2/userinfo", {
        headers: { authorization: "Bearer ".concat(token) },
        onError: onError,
    });
}
/**
 * @see https://github.com/better-auth/better-auth/issues/11595
 */
(0, vitest_1.describe)("oauth-provider - JWT access tokens that fail verification", function () { return __awaiter(void 0, void 0, void 0, function () {
    var server, auth, invalidTokens;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup((0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }))];
            case 1:
                server = _a.sent();
                auth = server.auth;
                invalidTokens = [
                    ["alg:none", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ALG_NONE_TOKEN];
                        }); }); }],
                    [
                        "tampered signature",
                        function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = tamperSignature;
                                    return [4 /*yield*/, getAccessToken(server, validResource)];
                                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                            }
                        }); }); },
                    ],
                    ["unknown kid", function () { return signWithUnknownKey("unknown-kid"); }],
                    [
                        "wrong issuer",
                        function () { return __awaiter(void 0, void 0, void 0, function () {
                            var token;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, auth.api.signJWT({
                                            body: {
                                                payload: {
                                                    sub: "x",
                                                    azp: "x",
                                                    iss: "https://wrong-issuer.example.com",
                                                    aud: validResource,
                                                },
                                            },
                                        })];
                                    case 1:
                                        token = (_a.sent()).token;
                                        return [2 /*return*/, token];
                                }
                            });
                        }); },
                    ],
                ];
                (0, vitest_1.it)("verifies an untampered JWT access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a, info;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, getAccessToken(server, validResource)];
                            case 1:
                                token = _d.sent();
                                (0, vitest_1.expect)(token.split(".")).toHaveLength(3);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, introspect(server, token)];
                            case 2:
                                _a.apply(void 0, [(_b = (_d.sent()).data) === null || _b === void 0 ? void 0 : _b.active]).toBe(true);
                                return [4 /*yield*/, userinfo(server, token)];
                            case 3:
                                info = _d.sent();
                                (0, vitest_1.expect)(info.error).toBeNull();
                                (0, vitest_1.expect)((_c = info.data) === null || _c === void 0 ? void 0 : _c.sub).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("still falls through to opaque access token validation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a, info;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, getAccessToken(server)];
                            case 1:
                                token = _d.sent();
                                (0, vitest_1.expect)(token.split(".")).not.toHaveLength(3);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, introspect(server, token)];
                            case 2:
                                _a.apply(void 0, [(_b = (_d.sent()).data) === null || _b === void 0 ? void 0 : _b.active]).toBe(true);
                                return [4 /*yield*/, userinfo(server, token)];
                            case 3:
                                info = _d.sent();
                                (0, vitest_1.expect)(info.error).toBeNull();
                                (0, vitest_1.expect)((_c = info.data) === null || _c === void 0 ? void 0 : _c.sub).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each(invalidTokens)("introspects a JWT with %s as inactive", function (_, getToken) { return __awaiter(void 0, void 0, void 0, function () {
                    var introspection, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = introspect;
                                _b = [server];
                                return [4 /*yield*/, getToken()];
                            case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                            case 2:
                                introspection = _c.sent();
                                (0, vitest_1.expect)(introspection.error).toBeNull();
                                (0, vitest_1.expect)(introspection.data).toEqual({ active: false });
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each(invalidTokens)("rejects a JWT with %s at userinfo with invalid_token", function (_, getToken) { return __awaiter(void 0, void 0, void 0, function () {
                    var wwwAuthenticate, info, _a, _b;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                wwwAuthenticate = "";
                                _a = userinfo;
                                _b = [server];
                                return [4 /*yield*/, getToken()];
                            case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_d.sent(), function (context) {
                                        var _a;
                                        wwwAuthenticate =
                                            (_a = context.response.headers.get("WWW-Authenticate")) !== null && _a !== void 0 ? _a : "";
                                    }]))];
                            case 2:
                                info = _d.sent();
                                (0, vitest_1.expect)((_c = info.error) === null || _c === void 0 ? void 0 : _c.status).toBe(401);
                                (0, vitest_1.expect)(info.error).toMatchObject({ error: "invalid_token" });
                                (0, vitest_1.expect)(wwwAuthenticate).toBe(INVALID_ACCESS_TOKEN_CHALLENGE);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each(invalidTokens)("answers a JWT with %s at revocation as for any unknown token", function (_, getToken) { return __awaiter(void 0, void 0, void 0, function () {
                    var error, _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _a = revoke;
                                _b = [server];
                                return [4 /*yield*/, getToken()];
                            case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_e.sent()]))];
                            case 2:
                                error = (_e.sent()).error;
                                (0, vitest_1.expect)(error === null || error === void 0 ? void 0 : error.status).not.toBe(500);
                                _d = (_c = (0, vitest_1.expect)(error)).toEqual;
                                return [4 /*yield*/, revoke(server, "unknown-opaque-token")];
                            case 3:
                                _d.apply(_c, [(_e.sent()).error]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("surfaces a database failure during the revocation audience check", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, adapter, findOne, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, getAccessToken(server, validResource)];
                            case 1:
                                token = _c.sent();
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                adapter = (_c.sent()).adapter;
                                findOne = adapter.findOne.bind(adapter);
                                vitest_1.vi.spyOn(adapter, "findOne").mockImplementation(function (args) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        if (args.model === "oauthResource")
                                            throw new TypeError("fetch failed");
                                        return [2 /*return*/, findOne(args)];
                                    });
                                }); });
                                _a = vitest_1.expect;
                                return [4 /*yield*/, revoke(server, token)];
                            case 3:
                                _a.apply(void 0, [(_b = (_c.sent()).error) === null || _b === void 0 ? void 0 : _b.status]).toBe(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth-provider - JWT-shaped tokens with disableJwtPlugin", function () { return __awaiter(void 0, void 0, void 0, function () {
    var server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup(null, { disableJwtPlugin: true })];
            case 1:
                server = _a.sent();
                vitest_1.it.each([
                    ["alg:none", function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ALG_NONE_TOKEN];
                        }); }); }],
                    ["EdDSA signature", function () { return signWithUnknownKey("any-kid"); }],
                ])("answers a JWT with %s as an unknown token", function (_, getToken) { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, getToken()];
                            case 1:
                                token = _f.sent();
                                _a = vitest_1.expect;
                                return [4 /*yield*/, introspect(server, token)];
                            case 2:
                                _a.apply(void 0, [(_f.sent()).data, "introspection"]).toEqual({
                                    active: false,
                                });
                                _b = vitest_1.expect;
                                return [4 /*yield*/, userinfo(server, token)];
                            case 3:
                                _b.apply(void 0, [(_f.sent()).error, "userinfo"]).toMatchObject({
                                    status: 401,
                                    error: "invalid_token",
                                });
                                _d = vitest_1.expect;
                                return [4 /*yield*/, revoke(server, token)];
                            case 4:
                                _e = (_c = _d.apply(void 0, [(_f.sent()).error, "revocation"])).toEqual;
                                return [4 /*yield*/, revoke(server, "unknown-opaque-token")];
                            case 5:
                                _e.apply(_c, [(_f.sent()).error]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth-provider - JWT-shaped opaque access tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
    var server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup((0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }), {
                    // A custom opaque format that is a JWS signed by a key this server's
                    // JWKS does not contain.
                    generateOpaqueAccessToken: function () { return signWithUnknownKey("custom-opaque"); },
                })];
            case 1:
                server = _a.sent();
                (0, vitest_1.it)("validates and revokes them as opaque tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a, info, revocation, _b;
                    var _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, getAccessToken(server)];
                            case 1:
                                token = _f.sent();
                                (0, vitest_1.expect)(token.split(".")).toHaveLength(3);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, introspect(server, token)];
                            case 2:
                                _a.apply(void 0, [(_c = (_f.sent()).data) === null || _c === void 0 ? void 0 : _c.active]).toBe(true);
                                return [4 /*yield*/, userinfo(server, token)];
                            case 3:
                                info = _f.sent();
                                (0, vitest_1.expect)((_d = info.data) === null || _d === void 0 ? void 0 : _d.sub).toBeDefined();
                                return [4 /*yield*/, revoke(server, token, "access_token")];
                            case 4:
                                revocation = _f.sent();
                                (0, vitest_1.expect)(revocation.error).toBeNull();
                                _b = vitest_1.expect;
                                return [4 /*yield*/, introspect(server, token)];
                            case 5:
                                _b.apply(void 0, [(_e = (_f.sent()).data) === null || _e === void 0 ? void 0 : _e.active]).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth-provider - JWKS failures during access token verification", function () { return __awaiter(void 0, void 0, void 0, function () {
    var jwksUrl, kid, _a, privateKey, publicKey, publicJwk, _b, server;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                jwksUrl = "https://jwks.example.com/jwks";
                kid = "duplicated-kid";
                return [4 /*yield*/, (0, jose_1.generateKeyPair)("EdDSA", {
                        extractable: true,
                    })];
            case 1:
                _a = _c.sent(), privateKey = _a.privateKey, publicKey = _a.publicKey;
                _b = [{}];
                return [4 /*yield*/, (0, jose_1.exportJWK)(publicKey)];
            case 2:
                publicJwk = __assign.apply(void 0, [__assign.apply(void 0, _b.concat([(_c.sent())])), { kid: kid, alg: "EdDSA" }]);
                return [4 /*yield*/, setup((0, jwt_1.jwt)({
                        jwt: { issuer: authServerBaseUrl },
                        jwks: { remoteUrl: jwksUrl, keyPairConfig: { alg: "EdDSA" } },
                    }))];
            case 3:
                server = _c.sent();
                (0, vitest_1.beforeEach)(function () {
                    // Two keys share the token's kid, so jose cannot pick one
                    // (JWKSMultipleMatchingKeys), a key set problem rather than a bad token.
                    var networkFetch = globalThis.fetch.bind(globalThis);
                    vitest_1.vi.stubGlobal("fetch", function (input, init) {
                        var requestedUrl = typeof input === "string"
                            ? input
                            : input instanceof URL
                                ? input.href
                                : input.url;
                        if (requestedUrl === jwksUrl) {
                            return Promise.resolve(Response.json({ keys: [publicJwk, __assign({}, publicJwk)] }));
                        }
                        return networkFetch(input, init);
                    });
                });
                (0, vitest_1.afterEach)(function () {
                    vitest_1.vi.unstubAllGlobals();
                });
                (0, vitest_1.it)("surfaces the key set failure at introspection", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signAccessToken(privateKey, kid)];
                            case 1:
                                token = _c.sent();
                                _a = vitest_1.expect;
                                return [4 /*yield*/, introspect(server, token)];
                            case 2:
                                _a.apply(void 0, [(_b = (_c.sent()).error) === null || _b === void 0 ? void 0 : _b.status]).toBe(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("surfaces the key set failure at userinfo", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signAccessToken(privateKey, kid)];
                            case 1:
                                token = _c.sent();
                                _a = vitest_1.expect;
                                return [4 /*yield*/, userinfo(server, token)];
                            case 2:
                                _a.apply(void 0, [(_b = (_c.sent()).error) === null || _b === void 0 ? void 0 : _b.status]).toBe(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("surfaces the key set failure at revocation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signAccessToken(privateKey, kid)];
                            case 1:
                                token = _c.sent();
                                _a = vitest_1.expect;
                                return [4 /*yield*/, revoke(server, token)];
                            case 2:
                                _a.apply(void 0, [(_b = (_c.sent()).error) === null || _b === void 0 ? void 0 : _b.status]).toBe(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/issues/11611
 */
(0, vitest_1.describe)("oauth-provider - unreachable remote JWKS", function () { return __awaiter(void 0, void 0, void 0, function () {
    var jwksUrl, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwksUrl = "https://jwks-down.example.com/jwks";
                return [4 /*yield*/, setup((0, jwt_1.jwt)({
                        jwt: { issuer: authServerBaseUrl },
                        jwks: { remoteUrl: jwksUrl, keyPairConfig: { alg: "EdDSA" } },
                    }))];
            case 1:
                server = _a.sent();
                (0, vitest_1.beforeEach)(function () {
                    // A refused connection: `fetch` rejects with a TypeError.
                    var networkFetch = globalThis.fetch.bind(globalThis);
                    vitest_1.vi.stubGlobal("fetch", function (input, init) {
                        var requestedUrl = typeof input === "string"
                            ? input
                            : input instanceof URL
                                ? input.href
                                : input.url;
                        if (requestedUrl === jwksUrl) {
                            return Promise.reject(new TypeError("fetch failed"));
                        }
                        return networkFetch(input, init);
                    });
                });
                (0, vitest_1.afterEach)(function () {
                    vitest_1.vi.unstubAllGlobals();
                });
                (0, vitest_1.it)("surfaces the outage at introspection", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signWithUnknownKey("remote-kid")];
                            case 1:
                                token = _c.sent();
                                _a = vitest_1.expect;
                                return [4 /*yield*/, introspect(server, token)];
                            case 2:
                                _a.apply(void 0, [(_b = (_c.sent()).error) === null || _b === void 0 ? void 0 : _b.status]).toBe(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("surfaces the outage at userinfo", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signWithUnknownKey("remote-kid")];
                            case 1:
                                token = _c.sent();
                                _a = vitest_1.expect;
                                return [4 /*yield*/, userinfo(server, token)];
                            case 2:
                                _a.apply(void 0, [(_b = (_c.sent()).error) === null || _b === void 0 ? void 0 : _b.status]).toBe(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("surfaces the outage at revocation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signWithUnknownKey("remote-kid")];
                            case 1:
                                token = _c.sent();
                                _a = vitest_1.expect;
                                return [4 /*yield*/, revoke(server, token)];
                            case 2:
                                _a.apply(void 0, [(_b = (_c.sent()).error) === null || _b === void 0 ? void 0 : _b.status]).toBe(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
