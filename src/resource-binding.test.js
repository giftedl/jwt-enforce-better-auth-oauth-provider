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
var authServerBaseUrl = "http://localhost:3000";
var rpBaseUrl = "http://localhost:5000";
var resourceA = "https://api-a.example.com";
var resourceB = "https://api-b.example.com";
function toAudienceValues(audienceClaim) {
    if (Array.isArray(audienceClaim))
        return audienceClaim;
    return audienceClaim == null ? [] : [audienceClaim];
}
function tokenForm(params) {
    var body = new URLSearchParams();
    for (var _i = 0, _a = Object.entries(params); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value !== undefined)
            body.set(key, value);
    }
    return {
        body: body,
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            accept: "application/json",
        },
    };
}
/**
 * The RFC 8707 `resource` indicator is bound to the authorization grant. When a
 * client declares a resource at `/authorize`, the token and refresh endpoints
 * may narrow the issued token to a subset of those resources but may not widen
 * it to a resource the authorization never covered. Before the fix the requested
 * resource was read from the token request body and checked only against the
 * global `resources` allowlist, so a client could obtain (or change, across
 * refreshes) a token for any allow-listed resource regardless of the grant.
 *
 * @see https://github.com/better-auth/better-auth/security/advisories/GHSA-p2fr-6hmx-4528
 */
(0, vitest_1.describe)("oauth-provider resource indicator binding", function () { return __awaiter(void 0, void 0, void 0, function () {
    /** Drive /authorize with the given resources and return the issued code. */
    function authorize(resources) {
        return __awaiter(this, void 0, void 0, function () {
            var codeVerifier, url, _i, resources_1, r, callbackRedirectUrl, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw new Error("beforeAll did not run");
                        }
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
                                state: "rfc8707",
                                scopes: ["openid", "offline_access"],
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        url = _a.sent();
                        for (_i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
                            r = resources_1[_i];
                            url.searchParams.append("resource", r);
                        }
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(url.toString(), {
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _a.sent();
                        (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                        code = new URL(callbackRedirectUrl).searchParams.get("code");
                        (0, vitest_1.expect)(code).toBeTruthy();
                        return [2 /*return*/, { code: code, codeVerifier: codeVerifier }];
                }
            });
        });
    }
    function exchangeCode(args) {
        var _a;
        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
            throw new Error("beforeAll did not run");
        }
        var body = new URLSearchParams();
        body.set("grant_type", "authorization_code");
        body.set("code", args.code);
        body.set("code_verifier", args.codeVerifier);
        body.set("redirect_uri", redirectUri);
        body.set("client_id", oauthClient.client_id);
        body.set("client_secret", oauthClient.client_secret);
        for (var _i = 0, _b = (_a = args.resources) !== null && _a !== void 0 ? _a : []; _i < _b.length; _i++) {
            var r = _b[_i];
            body.append("resource", r);
        }
        return client.$fetch("/oauth2/token", {
            method: "POST",
            body: body,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                accept: "application/json",
            },
        });
    }
    function refresh(refreshToken, resources) {
        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
            throw new Error("beforeAll did not run");
        }
        var _a = tokenForm({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: oauthClient.client_id,
            client_secret: oauthClient.client_secret,
            scope: "openid offline_access",
        }), body = _a.body, reqHeaders = _a.headers;
        for (var _i = 0, _b = resources !== null && resources !== void 0 ? resources : []; _i < _b.length; _i++) {
            var r = _b[_i];
            body.append("resource", r);
        }
        return client.$fetch("/oauth2/token", { method: "POST", body: body, headers: reqHeaders });
    }
    var _a, auth, signInWithTestUser, customFetchImpl, headers, client, providerId, redirectUri, oauthClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                    baseURL: authServerBaseUrl,
                    plugins: [
                        (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                        (0, oauth_1.oauthProvider)({
                            loginPage: "/login",
                            consentPage: "/consent",
                            resources: [resourceA, resourceB],
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
                redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
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
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                oauthClient = _a.sent();
                                (0, vitest_1.expect)(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id).toBeDefined();
                                (0, vitest_1.expect)(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a token for a resource the authorization did not cover", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, tokens;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, authorize([resourceA])];
                            case 1:
                                _a = _d.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, exchangeCode({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        resources: [resourceB],
                                    })];
                            case 2:
                                tokens = _d.sent();
                                (0, vitest_1.expect)((_b = tokens.error) === null || _b === void 0 ? void 0 : _b.status).toBeDefined();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("narrows the JWT access-token audience to the requested resource subset", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, tokens, audienceValues;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authorize([resourceA, resourceB])];
                            case 1:
                                _a = _b.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, exchangeCode({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        resources: [resourceA],
                                    })];
                            case 2:
                                tokens = _b.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                audienceValues = toAudienceValues((0, jose_1.decodeJwt)(tokens.data.access_token).aud);
                                (0, vitest_1.expect)(audienceValues).toContain(resourceA);
                                (0, vitest_1.expect)(audienceValues).not.toContain(resourceB);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("inherits the authorized resource when the token request omits it", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, tokens, audienceValues;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authorize([resourceA])];
                            case 1:
                                _a = _b.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, exchangeCode({ code: code, codeVerifier: codeVerifier })];
                            case 2:
                                tokens = _b.sent();
                                (0, vitest_1.expect)(tokens.error).toBeNull();
                                audienceValues = toAudienceValues((0, jose_1.decodeJwt)(tokens.data.access_token).aud);
                                (0, vitest_1.expect)(audienceValues).toContain(resourceA);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("keeps the full authorized set on the refresh token across narrowing", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, initial, refreshed, audienceValues;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, authorize([resourceA, resourceB])];
                            case 1:
                                _a = _c.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, exchangeCode({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        resources: [resourceA],
                                    })];
                            case 2:
                                initial = _c.sent();
                                (0, vitest_1.expect)((_b = initial.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeDefined();
                                return [4 /*yield*/, refresh(initial.data.refresh_token)];
                            case 3:
                                refreshed = _c.sent();
                                (0, vitest_1.expect)(refreshed.error).toBeNull();
                                audienceValues = toAudienceValues((0, jose_1.decodeJwt)(refreshed.data.access_token).aud);
                                (0, vitest_1.expect)(audienceValues).toContain(resourceA);
                                (0, vitest_1.expect)(audienceValues).toContain(resourceB);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a refresh that widens beyond the authorized resources", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, code, codeVerifier, initial, refreshed;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, authorize([resourceA])];
                            case 1:
                                _a = _d.sent(), code = _a.code, codeVerifier = _a.codeVerifier;
                                return [4 /*yield*/, exchangeCode({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        resources: [resourceA],
                                    })];
                            case 2:
                                initial = _d.sent();
                                (0, vitest_1.expect)((_b = initial.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeDefined();
                                return [4 /*yield*/, refresh(initial.data.refresh_token, [resourceB])];
                            case 3:
                                refreshed = _d.sent();
                                (0, vitest_1.expect)((_c = refreshed.error) === null || _c === void 0 ? void 0 : _c.status).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
