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
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
var resources_1 = require("./resources");
/**
 * Boots an in-memory better-auth instance with the oauth-provider plugin and
 * (when not disabled by callers) the jwt plugin. Pre-seeds resource rows so
 * tests don't have to deal with the lazy seeding semantics directly.
 */
var bootProvider = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (options) {
        var opts, instance, ctx;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign({ loginPage: "/login", consentPage: "/consent", 
                        // Resource-linkage enforcement has its own coverage; disable here so
                        // unit-level resolveResourcePolicy tests don't have to seed
                        // `oauthClientResource` rows just to validate policy fields.
                        enforcePerClientResources: false }, options);
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            plugins: [(0, jwt_1.jwt)(), (0, oauth_1.oauthProvider)(opts)],
                        })];
                case 1:
                    instance = _a.sent();
                    (0, resources_1.resetSeedStateForTests)();
                    return [4 /*yield*/, instance.auth.$context];
                case 2:
                    ctx = _a.sent();
                    return [4 /*yield*/, (0, resources_1.seedResourcesOnce)(ctx, opts)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign({}, instance), { ctx: ctx, opts: opts })];
            }
        });
    });
};
var fakeEndpointCtx = function (authCtx) {
    return ({
        context: authCtx,
        body: {},
    });
};
/**
 * Full-flow harness that runs an authorization code grant end-to-end against
 * a booted oauth-provider instance. Returns the booted instance and helpers
 * for issuing codes and exchanging them for tokens, parameterized by
 * authorize-time `resource` and token-time `resource`.
 */
var bootCodeFlowHarness = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (options) {
        var authServerBaseUrl, rpBaseUrl, providerId, redirectUri, state, opts, _a, auth, signInWithTestUser, customFetchImpl, seedCtx, headers, client, adminCreated, oauthClient, createAuthUrl, exchangeCode, runCodeFlow;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Module-level resource cache + seed-completion flag persist across tests
                    // in this file. Reset both before each harness boot so a stale cached row
                    // from an earlier test doesn't leak into a fresh instance.
                    (0, resources_1.resetSeedStateForTests)();
                    (0, resources_1.invalidateResourceCache)();
                    authServerBaseUrl = "http://localhost:3000";
                    rpBaseUrl = "https://rp.example.com";
                    providerId = "test";
                    redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
                    state = "state-123";
                    opts = __assign({ loginPage: "/login", consentPage: "/consent", 
                        // Disable the per-client resource-linkage check for the harness.
                        // Bug-fix coverage targets the policy / introspection / refresh paths;
                        // per-client linkage has its own coverage in resources.test.ts.
                        enforcePerClientResources: false }, options);
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [(0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }), (0, oauth_1.oauthProvider)(opts)],
                        })];
                case 1:
                    _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                    return [4 /*yield*/, auth.$context];
                case 2:
                    seedCtx = _b.sent();
                    return [4 /*yield*/, (0, resources_1.seedResourcesOnce)(seedCtx, opts)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, signInWithTestUser()];
                case 4:
                    headers = (_b.sent()).headers;
                    client = (0, client_1.createAuthClient)({
                        plugins: [(0, client_2.oauthProviderClient)()],
                        baseURL: authServerBaseUrl,
                        fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                    });
                    return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                redirect_uris: [redirectUri],
                                token_endpoint_auth_method: "client_secret_post",
                                scope: "openid profile email offline_access",
                                skip_consent: true,
                            },
                        })];
                case 5:
                    adminCreated = _b.sent();
                    if (!(adminCreated === null || adminCreated === void 0 ? void 0 : adminCreated.client_id) || !(adminCreated === null || adminCreated === void 0 ? void 0 : adminCreated.client_secret)) {
                        throw new Error("admin client creation failed");
                    }
                    oauthClient = adminCreated;
                    createAuthUrl = function (overrides) { return __awaiter(void 0, void 0, void 0, function () {
                        var codeVerifier, url, values, _i, values_1, r;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
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
                                            state: state,
                                            scopes: (_a = overrides === null || overrides === void 0 ? void 0 : overrides.scopes) !== null && _a !== void 0 ? _a : [
                                                "openid",
                                                "profile",
                                                "email",
                                                "offline_access",
                                            ],
                                            codeVerifier: codeVerifier,
                                        })];
                                case 1:
                                    url = _b.sent();
                                    // `createAuthorizationURL` doesn't model RFC 8707 `resource` — append
                                    // it ourselves so the authorize-side validation path sees it. Multiple
                                    // values are repeated parameters per the spec.
                                    if ((overrides === null || overrides === void 0 ? void 0 : overrides.resource) !== undefined) {
                                        values = Array.isArray(overrides.resource)
                                            ? overrides.resource
                                            : [overrides.resource];
                                        for (_i = 0, values_1 = values; _i < values_1.length; _i++) {
                                            r = values_1[_i];
                                            url.searchParams.append("resource", r);
                                        }
                                    }
                                    return [2 /*return*/, { url: url, codeVerifier: codeVerifier }];
                            }
                        });
                    }); };
                    exchangeCode = function (overrides) { return __awaiter(void 0, void 0, void 0, function () {
                        var body, resources, _i, resources_2, r;
                        return __generator(this, function (_a) {
                            body = new URLSearchParams({
                                grant_type: "authorization_code",
                                code: overrides.code,
                                redirect_uri: redirectUri,
                                client_id: oauthClient.client_id,
                                client_secret: oauthClient.client_secret,
                            });
                            if (overrides.codeVerifier) {
                                body.set("code_verifier", overrides.codeVerifier);
                            }
                            // RFC 8707 §2: `resource` may be repeated. URLSearchParams.append keeps
                            // each entry distinct so the array form round-trips.
                            if (overrides.resource !== undefined) {
                                resources = Array.isArray(overrides.resource)
                                    ? overrides.resource
                                    : [overrides.resource];
                                for (_i = 0, resources_2 = resources; _i < resources_2.length; _i++) {
                                    r = resources_2[_i];
                                    body.append("resource", r);
                                }
                            }
                            return [2 /*return*/, client.$fetch("/oauth2/token", {
                                    method: "POST",
                                    body: body,
                                    headers: {
                                        "content-type": "application/x-www-form-urlencoded",
                                        accept: "application/json",
                                    },
                                })];
                        });
                    }); };
                    runCodeFlow = function () {
                        var args_2 = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args_2[_i] = arguments[_i];
                        }
                        return __awaiter(void 0, __spreadArray([], args_2, true), void 0, function (opts) {
                            var _a, url, codeVerifier, callbackRedirectUrl, codeUrl, code, tokens;
                            if (opts === void 0) { opts = {}; }
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, createAuthUrl({
                                            resource: opts.authorizeResource,
                                            scopes: opts.scopes,
                                        })];
                                    case 1:
                                        _a = _b.sent(), url = _a.url, codeVerifier = _a.codeVerifier;
                                        callbackRedirectUrl = "";
                                        return [4 /*yield*/, client.$fetch(url.toString(), {
                                                headers: headers, // signed-in cookie
                                                onError: function (context) {
                                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                                },
                                            })];
                                    case 2:
                                        _b.sent();
                                        codeUrl = new URL(callbackRedirectUrl);
                                        code = codeUrl.searchParams.get("code");
                                        if (!code) {
                                            return [2 /*return*/, { redirected: callbackRedirectUrl, code: null, tokens: null }];
                                        }
                                        return [4 /*yield*/, exchangeCode({
                                                code: code,
                                                codeVerifier: codeVerifier,
                                                resource: opts.tokenResource,
                                            })];
                                    case 3:
                                        tokens = _b.sent();
                                        return [2 /*return*/, { redirected: callbackRedirectUrl, code: code, tokens: tokens }];
                                }
                            });
                        });
                    };
                    return [2 /*return*/, {
                            auth: auth,
                            client: client,
                            oauthClient: oauthClient,
                            headers: headers,
                            authServerBaseUrl: authServerBaseUrl,
                            runCodeFlow: runCodeFlow,
                            exchangeCode: exchangeCode,
                        }];
            }
        });
    });
};
// ────────────────────────────────────────────────────────────────────────────
// Introspection of entity-issued JWTs
// ────────────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)("introspection accepts entity-issued JWTs and rejects deleted-resource tokens", function () {
    (0, vitest_1.it)("introspects a JWT whose `aud` is an oauthResource identifier as active", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validResource, harness, result, introspection, decoded, audClaim;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    validResource = "https://api.example.com/bug-1";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [validResource],
                        })];
                case 1:
                    harness = _c.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: validResource,
                            tokenResource: validResource,
                        })];
                case 2:
                    result = _c.sent();
                    (0, vitest_1.expect)((_b = (_a = result.tokens) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                    return [4 /*yield*/, harness.client.oauth2.introspect({
                            client_id: harness.oauthClient.client_id,
                            client_secret: harness.oauthClient.client_secret,
                            token: result.tokens.data.access_token,
                            token_type_hint: "access_token",
                        }, {
                            headers: {
                                accept: "application/json",
                                "content-type": "application/x-www-form-urlencoded",
                            },
                        })];
                case 3:
                    introspection = _c.sent();
                    (0, vitest_1.expect)(introspection.data).toMatchObject({
                        active: true,
                        client_id: harness.oauthClient.client_id,
                    });
                    decoded = (0, jose_1.decodeJwt)(result.tokens.data.access_token);
                    audClaim = Array.isArray(decoded.aud) ? decoded.aud : [decoded.aud];
                    (0, vitest_1.expect)(audClaim).toContain(validResource);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("hard-rejects a JWT whose resource row was deleted (introspection inactive)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validResource, harness, result, accessToken, beforeDelete, ctx, afterDelete;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    validResource = "https://api.example.com/bug-1-delete";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [validResource],
                        })];
                case 1:
                    harness = _c.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: validResource,
                            tokenResource: validResource,
                        })];
                case 2:
                    result = _c.sent();
                    accessToken = result.tokens.data.access_token;
                    return [4 /*yield*/, harness.client.oauth2.introspect({
                            client_id: harness.oauthClient.client_id,
                            client_secret: harness.oauthClient.client_secret,
                            token: accessToken,
                            token_type_hint: "access_token",
                        }, {
                            headers: {
                                accept: "application/json",
                                "content-type": "application/x-www-form-urlencoded",
                            },
                        })];
                case 3:
                    beforeDelete = _c.sent();
                    (0, vitest_1.expect)((_a = beforeDelete.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                    return [4 /*yield*/, harness.auth.$context];
                case 4:
                    ctx = _c.sent();
                    return [4 /*yield*/, ctx.adapter.delete({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: validResource }],
                        })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, harness.client.oauth2.introspect({
                            client_id: harness.oauthClient.client_id,
                            client_secret: harness.oauthClient.client_secret,
                            token: accessToken,
                            token_type_hint: "access_token",
                        }, {
                            headers: {
                                accept: "application/json",
                                "content-type": "application/x-www-form-urlencoded",
                            },
                        })];
                case 6:
                    afterDelete = _c.sent();
                    (0, vitest_1.expect)((_b = afterDelete.data) === null || _b === void 0 ? void 0 : _b.active).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("continues to verify a JWT whose resource row was disabled (block new issuance only)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validResource, harness, result, accessToken, ctx, introspection;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    validResource = "https://api.example.com/bug-1-disabled";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [validResource],
                        })];
                case 1:
                    harness = _b.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: validResource,
                            tokenResource: validResource,
                        })];
                case 2:
                    result = _b.sent();
                    accessToken = result.tokens.data.access_token;
                    return [4 /*yield*/, harness.auth.$context];
                case 3:
                    ctx = _b.sent();
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: validResource }],
                            update: { disabled: true },
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, harness.client.oauth2.introspect({
                            client_id: harness.oauthClient.client_id,
                            client_secret: harness.oauthClient.client_secret,
                            token: accessToken,
                            token_type_hint: "access_token",
                        }, {
                            headers: {
                                accept: "application/json",
                                "content-type": "application/x-www-form-urlencoded",
                            },
                        })];
                case 5:
                    introspection = _b.sent();
                    (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks NEW issuance against a disabled resource (resolveResourcePolicy rejects)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceIdentifier, harness, ctx, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resourceIdentifier = "https://api.example.com/bug-1-disabled-mint";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceIdentifier],
                        })];
                case 1:
                    harness = _a.sent();
                    return [4 /*yield*/, harness.auth.$context];
                case 2:
                    ctx = _a.sent();
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: resourceIdentifier }],
                            update: { disabled: true },
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: resourceIdentifier,
                            tokenResource: resourceIdentifier,
                        })];
                case 4:
                    result = _a.sent();
                    // authorize-time validation rejects → redirect with error, no code.
                    (0, vitest_1.expect)(result.code).toBeNull();
                    (0, vitest_1.expect)(result.redirected).toMatch(/invalid_target/);
                    return [2 /*return*/];
            }
        });
    }); });
});
// ────────────────────────────────────────────────────────────────────────────
// Code grant binding of authorize-time resource
// ────────────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)("code grant binds authorize-time `resource`", function () {
    (0, vitest_1.it)("reissues against the authorize-time resource when /token omits it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceIdentifier, harness, result, decoded, audClaim;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    resourceIdentifier = "https://api.example.com/bug-2-omit";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceIdentifier],
                        })];
                case 1:
                    harness = _c.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: resourceIdentifier,
                            // Intentionally omit tokenResource — pre-fix behavior would mint
                            // an opaque token here; post-fix the JWT audience includes the
                            // authorize-time resource.
                            tokenResource: undefined,
                        })];
                case 2:
                    result = _c.sent();
                    (0, vitest_1.expect)((_b = (_a = result.tokens) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                    decoded = (0, jose_1.decodeJwt)(result.tokens.data.access_token);
                    audClaim = Array.isArray(decoded.aud) ? decoded.aud : [decoded.aud];
                    (0, vitest_1.expect)(audClaim).toContain(resourceIdentifier);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects with invalid_target when /token widens the resource set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceA, resourceB, harness, result, tokenError;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resourceA = "https://api.example.com/bug-2-widen-a";
                    resourceB = "https://api.example.com/bug-2-widen-b";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceA, resourceB],
                        })];
                case 1:
                    harness = _b.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: resourceA,
                            tokenResource: resourceB,
                        })];
                case 2:
                    result = _b.sent();
                    tokenError = (_a = result.tokens) === null || _a === void 0 ? void 0 : _a.error;
                    (0, vitest_1.expect)(tokenError === null || tokenError === void 0 ? void 0 : tokenError.error).toBe("invalid_target");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts /token resource when it equals the authorize-time resource", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceIdentifier, harness, result, decoded, audClaim;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    resourceIdentifier = "https://api.example.com/bug-2-match";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceIdentifier],
                        })];
                case 1:
                    harness = _c.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: resourceIdentifier,
                            tokenResource: resourceIdentifier,
                        })];
                case 2:
                    result = _c.sent();
                    (0, vitest_1.expect)((_b = (_a = result.tokens) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                    decoded = (0, jose_1.decodeJwt)(result.tokens.data.access_token);
                    audClaim = Array.isArray(decoded.aud) ? decoded.aud : [decoded.aud];
                    (0, vitest_1.expect)(audClaim).toContain(resourceIdentifier);
                    return [2 /*return*/];
            }
        });
    }); });
});
// ────────────────────────────────────────────────────────────────────────────
// Refresh-token preservation of original resource
// ────────────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)("refresh tokens preserve original resource", function () {
    (0, vitest_1.it)("persists `resource` on the oauthRefreshToken row at issuance", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceIdentifier, harness, result, ctx, rows, persisted;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    resourceIdentifier = "https://api.example.com/bug-3-persist";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceIdentifier],
                        })];
                case 1:
                    harness = _c.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: resourceIdentifier,
                            tokenResource: resourceIdentifier,
                        })];
                case 2:
                    result = _c.sent();
                    (0, vitest_1.expect)((_b = (_a = result.tokens) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeDefined();
                    return [4 /*yield*/, harness.auth.$context];
                case 3:
                    ctx = _c.sent();
                    return [4 /*yield*/, ctx.adapter.findMany({
                            model: "oauthRefreshToken",
                            where: [{ field: "clientId", value: harness.oauthClient.client_id }],
                        })];
                case 4:
                    rows = _c.sent();
                    (0, vitest_1.expect)(rows.length).toBeGreaterThan(0);
                    persisted = rows.find(function (r) { var _a; return ((_a = r.resources) !== null && _a !== void 0 ? _a : []).includes(resourceIdentifier); });
                    (0, vitest_1.expect)(persisted).toBeDefined();
                    (0, vitest_1.expect)(persisted === null || persisted === void 0 ? void 0 : persisted.resources).toContain(resourceIdentifier);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("re-applies the original resource on refresh when /token omits resource", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceIdentifier, harness, initial, refreshToken, refreshed, decoded, audClaim;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resourceIdentifier = "https://api.example.com/bug-3-rebind";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceIdentifier],
                        })];
                case 1:
                    harness = _b.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: resourceIdentifier,
                            tokenResource: resourceIdentifier,
                        })];
                case 2:
                    initial = _b.sent();
                    refreshToken = initial.tokens.data.refresh_token;
                    return [4 /*yield*/, harness.client.$fetch("/oauth2/token", {
                            method: "POST",
                            body: new URLSearchParams({
                                grant_type: "refresh_token",
                                refresh_token: refreshToken,
                                client_id: harness.oauthClient.client_id,
                                client_secret: harness.oauthClient.client_secret,
                                // Intentionally NO `resource` on the refresh body.
                            }),
                            headers: {
                                "content-type": "application/x-www-form-urlencoded",
                                accept: "application/json",
                            },
                        })];
                case 3:
                    refreshed = _b.sent();
                    (0, vitest_1.expect)((_a = refreshed.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                    decoded = (0, jose_1.decodeJwt)(refreshed.data.access_token);
                    audClaim = Array.isArray(decoded.aud) ? decoded.aud : [decoded.aud];
                    (0, vitest_1.expect)(audClaim).toContain(resourceIdentifier);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects refresh that widens the resource beyond the persisted set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceA, resourceB, harness, initial, refreshToken, refreshed, refreshError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resourceA = "https://api.example.com/bug-3-widen-a";
                    resourceB = "https://api.example.com/bug-3-widen-b";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceA, resourceB],
                        })];
                case 1:
                    harness = _a.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: resourceA,
                            tokenResource: resourceA,
                        })];
                case 2:
                    initial = _a.sent();
                    refreshToken = initial.tokens.data.refresh_token;
                    return [4 /*yield*/, harness.client.$fetch("/oauth2/token", {
                            method: "POST",
                            body: new URLSearchParams({
                                grant_type: "refresh_token",
                                refresh_token: refreshToken,
                                client_id: harness.oauthClient.client_id,
                                client_secret: harness.oauthClient.client_secret,
                                resource: resourceB, // not in the persisted set
                            }),
                            headers: {
                                "content-type": "application/x-www-form-urlencoded",
                                accept: "application/json",
                            },
                        })];
                case 3:
                    refreshed = _a.sent();
                    refreshError = refreshed.error;
                    (0, vitest_1.expect)(refreshError === null || refreshError === void 0 ? void 0 : refreshError.error).toBe("invalid_target");
                    return [2 /*return*/];
            }
        });
    }); });
});
// ────────────────────────────────────────────────────────────────────────────
// DB-only resources without config
// ────────────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)("DB-only resources resolve without `resources` config", function () {
    (0, vitest_1.it)("looks up a DB row even when resources config is absent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts, identifier, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider({})];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    identifier = "https://api.example.com/bug-4-db-only";
                    return [4 /*yield*/, ctx.adapter.create({
                            model: "oauthResource",
                            data: {
                                identifier: identifier,
                                name: identifier,
                                accessTokenTtl: 120,
                                refreshTokenTtl: null,
                                signingAlgorithm: null,
                                signingKeyId: null,
                                allowedScopes: null,
                                customClaims: null,
                                disabled: false,
                                policyVersion: 1,
                                metadata: null,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: identifier,
                            clientId: "client-x",
                            requestedScopes: ["read"],
                        })];
                case 3:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toBe(identifier);
                    (0, vitest_1.expect)(policy.accessTokenTtl).toBe(120);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects an unknown identifier with invalid_target when no config and no DB row", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider({})];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: "https://api.example.com/bug-4-nope",
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects a disabled DB row with invalid_target even without legacy config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts, identifier;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider({})];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    identifier = "https://api.example.com/bug-4-disabled";
                    return [4 /*yield*/, ctx.adapter.create({
                            model: "oauthResource",
                            data: {
                                identifier: identifier,
                                name: identifier,
                                accessTokenTtl: null,
                                refreshTokenTtl: null,
                                signingAlgorithm: null,
                                signingKeyId: null,
                                allowedScopes: null,
                                customClaims: null,
                                disabled: true,
                                policyVersion: 1,
                                metadata: null,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: identifier,
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
// ────────────────────────────────────────────────────────────────────────────
// refreshTokenTtl application at issuance
// ────────────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)("refreshTokenTtl from oauthResource is applied at issuance", function () {
    (0, vitest_1.it)("uses the resource refreshTokenTtl when shorter than plugin default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, resourceRefreshTtl, harness, result, refreshToken, ctx, rows, row, ttlSeconds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = "https://api.example.com/bug-7-short";
                    resourceRefreshTtl = 60;
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [
                                {
                                    identifier: identifier,
                                    refreshTokenTtl: resourceRefreshTtl,
                                },
                            ],
                            refreshTokenExpiresIn: 86400, // 1 day — should be ignored
                        })];
                case 1:
                    harness = _a.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: identifier,
                            tokenResource: identifier,
                        })];
                case 2:
                    result = _a.sent();
                    refreshToken = result.tokens.data.refresh_token;
                    (0, vitest_1.expect)(refreshToken).toBeDefined();
                    return [4 /*yield*/, harness.auth.$context];
                case 3:
                    ctx = _a.sent();
                    return [4 /*yield*/, ctx.adapter.findMany({
                            model: "oauthRefreshToken",
                            where: [{ field: "clientId", value: harness.oauthClient.client_id }],
                        })];
                case 4:
                    rows = _a.sent();
                    row = rows.find(function (r) { var _a; return ((_a = r.resources) !== null && _a !== void 0 ? _a : []).includes(identifier); });
                    (0, vitest_1.expect)(row).toBeDefined();
                    ttlSeconds = (new Date(row.expiresAt).getTime() -
                        new Date(row.createdAt).getTime()) /
                        1000;
                    // Within 5s tolerance of the resource TTL.
                    (0, vitest_1.expect)(Math.abs(ttlSeconds - resourceRefreshTtl)).toBeLessThan(5);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("policy.refreshTokenTtl reflects resource override (unit-level)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/bug-7-policy";
                    return [4 /*yield*/, bootProvider({
                            resources: [{ identifier: id, refreshTokenTtl: 300 }],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.refreshTokenTtl).toBe(300);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("policy.refreshTokenTtl picks the minimum across multi-resource requests", function () { return __awaiter(void 0, void 0, void 0, function () {
        var a, b, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    a = "https://api.example.com/bug-7-multi-a";
                    b = "https://api.example.com/bug-7-multi-b";
                    return [4 /*yield*/, bootProvider({
                            resources: [
                                { identifier: a, refreshTokenTtl: 600 },
                                { identifier: b, refreshTokenTtl: 120 },
                            ],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [a, b],
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.refreshTokenTtl).toBe(120);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("caps resource refreshTokenTtl against the plugin default (lowest wins)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, pluginDefault, resourceRefreshTtl, harness, result, refreshToken, ctx, rows, row, ttlSeconds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = "https://api.example.com/bug-7-cap";
                    pluginDefault = 60;
                    resourceRefreshTtl = 3600;
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [
                                {
                                    identifier: identifier,
                                    refreshTokenTtl: resourceRefreshTtl,
                                },
                            ],
                            refreshTokenExpiresIn: pluginDefault,
                        })];
                case 1:
                    harness = _a.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: identifier,
                            tokenResource: identifier,
                        })];
                case 2:
                    result = _a.sent();
                    refreshToken = result.tokens.data.refresh_token;
                    (0, vitest_1.expect)(refreshToken).toBeDefined();
                    return [4 /*yield*/, harness.auth.$context];
                case 3:
                    ctx = _a.sent();
                    return [4 /*yield*/, ctx.adapter.findMany({
                            model: "oauthRefreshToken",
                            where: [{ field: "clientId", value: harness.oauthClient.client_id }],
                        })];
                case 4:
                    rows = _a.sent();
                    row = rows.find(function (r) { var _a; return ((_a = r.resources) !== null && _a !== void 0 ? _a : []).includes(identifier); });
                    (0, vitest_1.expect)(row).toBeDefined();
                    ttlSeconds = (new Date(row.expiresAt).getTime() -
                        new Date(row.createdAt).getTime()) /
                        1000;
                    // Within 5s tolerance of the plugin-default TTL, NOT the resource TTL.
                    (0, vitest_1.expect)(Math.abs(ttlSeconds - pluginDefault)).toBeLessThan(5);
                    (0, vitest_1.expect)(ttlSeconds).toBeLessThan(resourceRefreshTtl);
                    return [2 /*return*/];
            }
        });
    }); });
});
// ────────────────────────────────────────────────────────────────────────────
// RFC 8707 §2: repeated `resource` form parameters
// ────────────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)("repeated `resource` form parameter mints multi-resource tokens", function () {
    (0, vitest_1.it)("JWT audience carries every requested resource (auth code grant)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceA, resourceB, harness, result, accessToken, decoded, audClaim;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resourceA = "https://api.example.com/bug-10-a";
                    resourceB = "https://api.example.com/bug-10-b";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceA, resourceB],
                        })];
                case 1:
                    harness = _a.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: [resourceA, resourceB],
                            tokenResource: [resourceA, resourceB],
                        })];
                case 2:
                    result = _a.sent();
                    accessToken = result.tokens.data.access_token;
                    (0, vitest_1.expect)(accessToken).toBeDefined();
                    decoded = (0, jose_1.decodeJwt)(accessToken);
                    audClaim = Array.isArray(decoded.aud) ? decoded.aud : [decoded.aud];
                    (0, vitest_1.expect)(audClaim).toContain(resourceA);
                    (0, vitest_1.expect)(audClaim).toContain(resourceB);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("refresh-token row persists every requested resource", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceA, resourceB, harness, result, ctx, rows, row;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    resourceA = "https://api.example.com/bug-10-refresh-a";
                    resourceB = "https://api.example.com/bug-10-refresh-b";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceA, resourceB],
                        })];
                case 1:
                    harness = _c.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: [resourceA, resourceB],
                            tokenResource: [resourceA, resourceB],
                        })];
                case 2:
                    result = _c.sent();
                    (0, vitest_1.expect)((_b = (_a = result.tokens) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.refresh_token).toBeDefined();
                    return [4 /*yield*/, harness.auth.$context];
                case 3:
                    ctx = _c.sent();
                    return [4 /*yield*/, ctx.adapter.findMany({
                            model: "oauthRefreshToken",
                            where: [{ field: "clientId", value: harness.oauthClient.client_id }],
                        })];
                case 4:
                    rows = _c.sent();
                    row = rows.find(function (r) {
                        var _a;
                        var resources = (_a = r.resources) !== null && _a !== void 0 ? _a : [];
                        return resources.includes(resourceA) && resources.includes(resourceB);
                    });
                    (0, vitest_1.expect)(row).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("single-value `resource` form continues to work unchanged", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceIdentifier, harness, result, accessToken, decoded, audClaim;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resourceIdentifier = "https://api.example.com/bug-10-single";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [resourceIdentifier],
                        })];
                case 1:
                    harness = _a.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: resourceIdentifier,
                            tokenResource: resourceIdentifier,
                        })];
                case 2:
                    result = _a.sent();
                    accessToken = result.tokens.data.access_token;
                    decoded = (0, jose_1.decodeJwt)(accessToken);
                    audClaim = Array.isArray(decoded.aud) ? decoded.aud : [decoded.aud];
                    (0, vitest_1.expect)(audClaim).toContain(resourceIdentifier);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resource policy downscopes token responses", function () {
    (0, vitest_1.it)("reports the effective scope after allowedScopes narrows the grant", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, harness, result, decoded;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    identifier = "https://api.example.com/downscope-response";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [{ identifier: identifier, allowedScopes: ["email"] }],
                        })];
                case 1:
                    harness = _c.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: identifier,
                            tokenResource: identifier,
                            scopes: ["profile", "email"],
                        })];
                case 2:
                    result = _c.sent();
                    (0, vitest_1.expect)((_b = (_a = result.tokens) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.scope).toBe("email");
                    decoded = (0, jose_1.decodeJwt)(result.tokens.data.access_token);
                    (0, vitest_1.expect)(decoded.scope).toBe("email");
                    return [2 /*return*/];
            }
        });
    }); });
});
// ────────────────────────────────────────────────────────────────────────────
// RFC 9068 §2.2.3 `client_id` claim emission
// ────────────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)("JWT access tokens emit RFC 9068 §2.2.3 `client_id` claim", function () {
    (0, vitest_1.it)("emits both `client_id` and `azp` on a JWT access token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, harness, result, accessToken, protectedHeader, decoded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = "https://api.example.com/bug-8";
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [identifier],
                        })];
                case 1:
                    harness = _a.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: identifier,
                            tokenResource: identifier,
                        })];
                case 2:
                    result = _a.sent();
                    accessToken = result.tokens.data.access_token;
                    protectedHeader = (0, jose_1.decodeProtectedHeader)(accessToken);
                    decoded = (0, jose_1.decodeJwt)(accessToken);
                    (0, vitest_1.expect)(protectedHeader.typ).toBe("at+jwt");
                    (0, vitest_1.expect)(decoded.client_id).toBe(harness.oauthClient.client_id);
                    // `azp` continues to be set for back-compat with code that keyed on it.
                    (0, vitest_1.expect)(decoded.azp).toBe(harness.oauthClient.client_id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses the client identifier as sub for client_credentials JWT access tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
        var authServerBaseUrl, resource, oauthOptions, _a, auth, customFetchImpl, signInWithTestUser, ctx, headers, authClient, client, tokenResponse, accessToken, protectedHeader, decoded;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authServerBaseUrl = "http://localhost:3000";
                    resource = "https://api.example.com/m2m-sub";
                    oauthOptions = {
                        loginPage: "/login",
                        consentPage: "/consent",
                        scopes: ["read"],
                        resources: [resource],
                        enforcePerClientResources: false,
                        clientPrivileges: function () { return true; },
                    };
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                                (0, oauth_1.oauthProvider)(oauthOptions),
                            ],
                        })];
                case 1:
                    _a = _b.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl, signInWithTestUser = _a.signInWithTestUser;
                    (0, resources_1.resetSeedStateForTests)();
                    return [4 /*yield*/, auth.$context];
                case 2:
                    ctx = _b.sent();
                    return [4 /*yield*/, (0, resources_1.seedResourcesOnce)(ctx, oauthOptions)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, signInWithTestUser()];
                case 4:
                    headers = (_b.sent()).headers;
                    authClient = (0, client_1.createAuthClient)({
                        baseURL: authServerBaseUrl,
                        fetchOptions: { customFetchImpl: customFetchImpl },
                    });
                    return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                scope: "read",
                                grant_types: ["client_credentials"],
                                token_endpoint_auth_method: "client_secret_basic",
                                client_credentials_scopes: ["read"],
                                redirect_uris: ["https://client.example.com/callback"],
                            },
                        })];
                case 5:
                    client = _b.sent();
                    if (!(client === null || client === void 0 ? void 0 : client.client_id) || !(client === null || client === void 0 ? void 0 : client.client_secret)) {
                        throw new Error("client_credentials client creation failed");
                    }
                    return [4 /*yield*/, authClient.$fetch("/oauth2/token", {
                            method: "POST",
                            body: new URLSearchParams({
                                grant_type: "client_credentials",
                                scope: "read",
                                resource: resource,
                            }),
                            headers: {
                                authorization: "Basic ".concat(Buffer.from("".concat(client.client_id, ":").concat(client.client_secret)).toString("base64")),
                                "content-type": "application/x-www-form-urlencoded",
                            },
                        })];
                case 6:
                    tokenResponse = _b.sent();
                    accessToken = tokenResponse.data.access_token;
                    protectedHeader = (0, jose_1.decodeProtectedHeader)(accessToken);
                    decoded = (0, jose_1.decodeJwt)(accessToken);
                    (0, vitest_1.expect)(protectedHeader.typ).toBe("at+jwt");
                    (0, vitest_1.expect)(decoded.sub).toBe(client.client_id);
                    (0, vitest_1.expect)(decoded.client_id).toBe(client.client_id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("strips `client_id` from per-resource customClaims (AS owns it)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, warnSpy, harness, result, decoded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = "https://api.example.com/bug-8-strip";
                    warnSpy = vitest_1.vi
                        .spyOn(console, "warn")
                        .mockImplementation(function () { return undefined; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 4, 5]);
                    return [4 /*yield*/, bootCodeFlowHarness({
                            resources: [
                                {
                                    identifier: identifier,
                                    customClaims: {
                                        client_id: "attacker-owned-value",
                                        department: "ok-claim",
                                    },
                                },
                            ],
                        })];
                case 2:
                    harness = _a.sent();
                    return [4 /*yield*/, harness.runCodeFlow({
                            authorizeResource: identifier,
                            tokenResource: identifier,
                        })];
                case 3:
                    result = _a.sent();
                    decoded = (0, jose_1.decodeJwt)(result.tokens.data.access_token);
                    // Real client_id survives; the customClaims override was stripped.
                    (0, vitest_1.expect)(decoded.client_id).toBe(harness.oauthClient.client_id);
                    (0, vitest_1.expect)(decoded.client_id).not.toBe("attacker-owned-value");
                    (0, vitest_1.expect)(decoded.department).toBe("ok-claim");
                    return [3 /*break*/, 5];
                case 4:
                    warnSpy.mockRestore();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
// ────────────────────────────────────────────────────────────────────────────
// Identifier validation in the seed path
// ────────────────────────────────────────────────────────────────────────────
(0, vitest_1.describe)("seed path applies identifier validation and warns on failures", function () {
    var warnMessages;
    var warnSpy;
    (0, vitest_1.beforeEach)(function () {
        warnMessages = [];
        // Tap @better-auth/core/env logger.warn so we can assert seed warns.
        // (Better Auth's logger forwards to console.warn by default; tap that.)
        warnSpy = vitest_1.vi
            .spyOn(console, "warn")
            .mockImplementation(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            warnMessages.push(args.map(function (a) { return String(a); }).join(" "));
        });
    });
    (0, vitest_1.afterEach)(function () {
        warnSpy.mockRestore();
    });
    (0, vitest_1.it)("skips invalid identifiers without throwing during seed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var goodIdentifier, ctx, goodRow, badRow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    goodIdentifier = "https://api.example.com/bug-9-good";
                    return [4 /*yield*/, bootProvider({
                            resources: [
                                goodIdentifier,
                                "not a uri", // invalid — must be skipped
                            ],
                        })];
                case 1:
                    ctx = (_a.sent()).ctx;
                    return [4 /*yield*/, ctx.adapter.findOne({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: goodIdentifier }],
                        })];
                case 2:
                    goodRow = _a.sent();
                    (0, vitest_1.expect)(goodRow === null || goodRow === void 0 ? void 0 : goodRow.identifier).toBe(goodIdentifier);
                    return [4 /*yield*/, ctx.adapter.findOne({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: "not a uri" }],
                        })];
                case 3:
                    badRow = _a.sent();
                    (0, vitest_1.expect)(badRow).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips identifiers with URI fragments (RFC 8707 §2)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var goodIdentifier, ctx, goodRow, fragRow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    goodIdentifier = "https://api.example.com/bug-9-frag-good";
                    return [4 /*yield*/, bootProvider({
                            resources: [
                                goodIdentifier,
                                "https://api.example.com/bug-9#fragment", // RFC 8707 §2 violation
                            ],
                        })];
                case 1:
                    ctx = (_a.sent()).ctx;
                    return [4 /*yield*/, ctx.adapter.findOne({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: goodIdentifier }],
                        })];
                case 2:
                    goodRow = _a.sent();
                    (0, vitest_1.expect)(goodRow === null || goodRow === void 0 ? void 0 : goodRow.identifier).toBe(goodIdentifier);
                    return [4 /*yield*/, ctx.adapter.findOne({
                            model: "oauthResource",
                            where: [
                                {
                                    field: "identifier",
                                    value: "https://api.example.com/bug-9#fragment",
                                },
                            ],
                        })];
                case 3:
                    fragRow = _a.sent();
                    (0, vitest_1.expect)(fragRow).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("honors a custom identifierValidator that rejects entries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var goodIdentifier, blockedIdentifier, ctx, goodRow, blockedRow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    goodIdentifier = "https://allowed.example.com/bug-9";
                    blockedIdentifier = "https://blocked.example.com/bug-9";
                    return [4 /*yield*/, bootProvider({
                            identifierValidator: function (id) { return !id.includes("blocked.example.com"); },
                            resources: [goodIdentifier, blockedIdentifier],
                        })];
                case 1:
                    ctx = (_a.sent()).ctx;
                    return [4 /*yield*/, ctx.adapter.findOne({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: goodIdentifier }],
                        })];
                case 2:
                    goodRow = _a.sent();
                    (0, vitest_1.expect)(goodRow === null || goodRow === void 0 ? void 0 : goodRow.identifier).toBe(goodIdentifier);
                    return [4 /*yield*/, ctx.adapter.findOne({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: blockedIdentifier }],
                        })];
                case 3:
                    blockedRow = _a.sent();
                    (0, vitest_1.expect)(blockedRow).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("strips unsupported signingAlgorithm values from seed config and warns", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resourceIdentifier, ctx, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resourceIdentifier = "https://api.example.com/bug-5-seed-alg";
                    return [4 /*yield*/, bootProvider({
                            resources: [
                                {
                                    identifier: resourceIdentifier,
                                    // Intentionally bogus — must be stripped to null, not persisted.
                                    signingAlgorithm: "HS256",
                                },
                            ],
                        })];
                case 1:
                    ctx = (_a.sent()).ctx;
                    return [4 /*yield*/, ctx.adapter.findOne({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: resourceIdentifier }],
                        })];
                case 2:
                    row = _a.sent();
                    (0, vitest_1.expect)(row === null || row === void 0 ? void 0 : row.identifier).toBe(resourceIdentifier);
                    (0, vitest_1.expect)(row === null || row === void 0 ? void 0 : row.signingAlgorithm).toBeNull();
                    (0, vitest_1.expect)(warnMessages.some(function (m) {
                        return m.includes("dropping unsupported signingAlgorithm \"HS256\"") &&
                            m.includes(resourceIdentifier);
                    })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
