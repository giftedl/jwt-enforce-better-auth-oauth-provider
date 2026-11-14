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
var resources_1 = require("./resources");
var authServerBaseUrl = "http://localhost:3000";
var rpBaseUrl = "http://localhost:5000";
var providerId = "test";
var redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
var state = "123";
var introspectHeaders = {
    accept: "application/json",
    "content-type": "application/x-www-form-urlencoded",
};
/**
 * Boots an oauth-provider instance, seeds resource rows eagerly, signs in a
 * test user, and returns a configured auth client plus helpers for running the
 * authorization-code flow. Mirrors the harness in `resources-e2e.test.ts`.
 */
function bootHarness() {
    return __awaiter(this, arguments, void 0, function (config, scopes) {
        var opts, _a, auth, signInWithTestUser, customFetchImpl, seedCtx, _b, headers, user, client, registerClient, mintToken, introspect, linkClientToResource;
        var _this = this;
        if (config === void 0) { config = {}; }
        if (scopes === void 0) { scopes = ["openid", "profile", "email", "offline_access"]; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, resources_1.resetSeedStateForTests)();
                    opts = __assign({ loginPage: "/login", consentPage: "/consent", enforcePerClientResources: false, scopes: scopes }, config);
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: __spreadArray([
                                (0, oauth_1.oauthProvider)(opts)
                            ], (opts.disableJwtPlugin
                                ? []
                                : [(0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } })]), true),
                        })];
                case 1:
                    _a = _c.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                    return [4 /*yield*/, auth.$context];
                case 2:
                    seedCtx = _c.sent();
                    return [4 /*yield*/, (0, resources_1.seedResourcesOnce)(seedCtx, opts)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, signInWithTestUser()];
                case 4:
                    _b = _c.sent(), headers = _b.headers, user = _b.user;
                    client = (0, client_1.createAuthClient)({
                        plugins: [(0, client_2.oauthProviderClient)()],
                        baseURL: authServerBaseUrl,
                        fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                    });
                    registerClient = function () {
                        var args_1 = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args_1[_i] = arguments[_i];
                        }
                        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (overrides) {
                            var created;
                            if (overrides === void 0) { overrides = {}; }
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                            headers: headers,
                                            body: __assign({ redirect_uris: [redirectUri], application_type: "native", token_endpoint_auth_method: "client_secret_post", scope: scopes.join(" "), skip_consent: true }, overrides),
                                        })];
                                    case 1:
                                        created = _a.sent();
                                        if (!(created === null || created === void 0 ? void 0 : created.client_id) || !(created === null || created === void 0 ? void 0 : created.client_secret)) {
                                            throw new Error("admin client creation failed");
                                        }
                                        return [2 /*return*/, created];
                                }
                            });
                        });
                    };
                    mintToken = function (oauthClient_1) {
                        var args_1 = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args_1[_i - 1] = arguments[_i];
                        }
                        return __awaiter(_this, __spreadArray([oauthClient_1], args_1, true), void 0, function (oauthClient, overrides) {
                            var codeVerifier, url, values, _a, values_1, r, callbackRedirectUrl, code, body, values, _b, values_2, r, tokens, accessToken;
                            var _c;
                            if (overrides === void 0) { overrides = {}; }
                            return __generator(this, function (_d) {
                                switch (_d.label) {
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
                                                scopes: scopes,
                                                codeVerifier: codeVerifier,
                                            })];
                                    case 1:
                                        url = _d.sent();
                                        if (overrides.resource !== undefined) {
                                            values = Array.isArray(overrides.resource)
                                                ? overrides.resource
                                                : [overrides.resource];
                                            for (_a = 0, values_1 = values; _a < values_1.length; _a++) {
                                                r = values_1[_a];
                                                url.searchParams.append("resource", r);
                                            }
                                        }
                                        callbackRedirectUrl = "";
                                        return [4 /*yield*/, client.$fetch(url.toString(), {
                                                headers: headers,
                                                onError: function (context) {
                                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                                },
                                            })];
                                    case 2:
                                        _d.sent();
                                        code = new URL(callbackRedirectUrl).searchParams.get("code");
                                        if (!code)
                                            throw new Error("authorization code not issued");
                                        body = new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            code_verifier: codeVerifier,
                                            redirect_uri: redirectUri,
                                            client_id: oauthClient.client_id,
                                            client_secret: oauthClient.client_secret,
                                            scope: scopes.join(" "),
                                        });
                                        if (overrides.resource !== undefined) {
                                            values = Array.isArray(overrides.resource)
                                                ? overrides.resource
                                                : [overrides.resource];
                                            for (_b = 0, values_2 = values; _b < values_2.length; _b++) {
                                                r = values_2[_b];
                                                body.append("resource", r);
                                            }
                                        }
                                        return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: introspectHeaders })];
                                    case 3:
                                        tokens = _d.sent();
                                        accessToken = (_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token;
                                        if (!accessToken)
                                            throw new Error("access token not issued");
                                        return [2 /*return*/, accessToken];
                                }
                            });
                        });
                    };
                    introspect = function (params) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, client.oauth2.introspect({
                                    client_id: params.client_id,
                                    client_secret: params.client_secret,
                                    token: params.token,
                                    token_type_hint: "access_token",
                                }, { headers: introspectHeaders })];
                        });
                    }); };
                    linkClientToResource = function (clientId, resourceId) { return __awaiter(_this, void 0, void 0, function () {
                        var ctx;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, auth.$context];
                                case 1:
                                    ctx = _a.sent();
                                    return [4 /*yield*/, ctx.adapter.create({
                                            model: "oauthClientResource",
                                            data: {
                                                clientId: clientId,
                                                resourceId: resourceId,
                                                createdAt: new Date(),
                                            },
                                        })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/, {
                            auth: auth,
                            client: client,
                            headers: headers,
                            user: user,
                            registerClient: registerClient,
                            mintToken: mintToken,
                            introspect: introspect,
                            linkClientToResource: linkClientToResource,
                        }];
            }
        });
    });
}
(0, vitest_1.describe)("opaque introspection — reserved claim stripping", function () { return __awaiter(void 0, void 0, void 0, function () {
    var warnSpy, harness, oauthClient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                warnSpy = vitest_1.vi.spyOn(console, "warn").mockImplementation(function () { return undefined; });
                return [4 /*yield*/, bootHarness({
                        disableJwtPlugin: true,
                        customAccessTokenClaims: function () { return ({
                            role: "admin",
                            iss: "https://evil.example",
                            scope: "evil",
                            auth_time: 999,
                            amr: ["evil"],
                        }); },
                    })];
            case 1:
                harness = _a.sent();
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.registerClient()];
                            case 1:
                                oauthClient = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.afterAll)(function () {
                    warnSpy.mockRestore();
                });
                (0, vitest_1.it)("keeps enriched claims and strips reserved RFC 9068 names the AS owns", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, introspection, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(oauthClient)];
                            case 1:
                                token = _a.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: oauthClient.client_id,
                                        client_secret: oauthClient.client_secret,
                                    })];
                            case 2:
                                introspection = _a.sent();
                                data = introspection.data;
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.active).toBe(true);
                                // Enriched (non-reserved) claim survives.
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.role).toBe("admin");
                                // AS-owned reserved claims keep the server's values, not the overrides.
                                // With the jwt plugin disabled, `iss` falls back to the AS base URL.
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.iss).toBe("".concat(authServerBaseUrl, "/api/auth"));
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.iss).not.toBe("https://evil.example");
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.scope).toBe("openid profile email offline_access");
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.scope).not.toBe("evil");
                                // Reserved names outside the pinned response set are stripped entirely.
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.auth_time).toBeUndefined();
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.amr).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("opaque introspection — per-resource customClaims parity", function () { return __awaiter(void 0, void 0, void 0, function () {
    var resource, harness, oauthClient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resource = "https://api.example.com/claims-parity";
                return [4 /*yield*/, bootHarness({
                        disableJwtPlugin: true,
                        resources: [{ identifier: resource, customClaims: { dept: "ops" } }],
                    })];
            case 1:
                harness = _a.sent();
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.registerClient()];
                            case 1:
                                oauthClient = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("includes per-resource customClaims for a resource-bound opaque token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, introspection, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(oauthClient, { resource: resource })];
                            case 1:
                                token = _a.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: oauthClient.client_id,
                                        client_secret: oauthClient.client_secret,
                                    })];
                            case 2:
                                introspection = _a.sent();
                                data = introspection.data;
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.active).toBe(true);
                                (0, vitest_1.expect)(data === null || data === void 0 ? void 0 : data.dept).toBe("ops");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/issues/8267
 */
(0, vitest_1.describe)("introspection authorization (#8267)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var resource, harness, issuerClientA, resourceServerB, unrelatedClientC;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resource = "https://api.example.com/rs-8267";
                return [4 /*yield*/, bootHarness({ resources: [resource] })];
            case 1:
                harness = _a.sent();
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.registerClient()];
                            case 1:
                                issuerClientA = _a.sent();
                                return [4 /*yield*/, harness.registerClient()];
                            case 2:
                                resourceServerB = _a.sent();
                                return [4 /*yield*/, harness.registerClient()];
                            case 3:
                                unrelatedClientC = _a.sent();
                                return [4 /*yield*/, harness.linkClientToResource(resourceServerB.client_id, resource)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("lets the issuer introspect its own resource-bound token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(issuerClientA, { resource: resource })];
                            case 1:
                                token = _b.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: issuerClientA.client_id,
                                        client_secret: issuerClientA.client_secret,
                                    })];
                            case 2:
                                introspection = _b.sent();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("lets a resource server linked to the audience introspect the token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(issuerClientA, { resource: resource })];
                            case 1:
                                token = _b.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: resourceServerB.client_id,
                                        client_secret: resourceServerB.client_secret,
                                    })];
                            case 2:
                                introspection = _b.sent();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports inactive to an unlinked client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(issuerClientA, { resource: resource })];
                            case 1:
                                token = _b.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: unrelatedClientC.client_id,
                                        client_secret: unrelatedClientC.client_secret,
                                    })];
                            case 2:
                                introspection = _b.sent();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("keeps a token with no resource audience issuer-only", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, issuerView, nonIssuerView;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(issuerClientA)];
                            case 1:
                                token = _c.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: issuerClientA.client_id,
                                        client_secret: issuerClientA.client_secret,
                                    })];
                            case 2:
                                issuerView = _c.sent();
                                (0, vitest_1.expect)((_a = issuerView.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: resourceServerB.client_id,
                                        client_secret: resourceServerB.client_secret,
                                    })];
                            case 3:
                                nonIssuerView = _c.sent();
                                (0, vitest_1.expect)((_b = nonIssuerView.data) === null || _b === void 0 ? void 0 : _b.active).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("opaque introspection — resource lifecycle", function () { return __awaiter(void 0, void 0, void 0, function () {
    var deletedResource, disabledResource, harness, oauthClient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deletedResource = "https://api.example.com/lifecycle-deleted";
                disabledResource = "https://api.example.com/lifecycle-disabled";
                return [4 /*yield*/, bootHarness({
                        disableJwtPlugin: true,
                        resources: [
                            { identifier: deletedResource, customClaims: { dept: "ops" } },
                            { identifier: disabledResource, customClaims: { dept: "sec" } },
                        ],
                    })];
            case 1:
                harness = _a.sent();
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.registerClient()];
                            case 1:
                                oauthClient = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports inactive once the bound resource row is deleted", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, before, ctx, after;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(oauthClient, {
                                    resource: deletedResource,
                                })];
                            case 1:
                                token = _d.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: oauthClient.client_id,
                                        client_secret: oauthClient.client_secret,
                                    })];
                            case 2:
                                before = _d.sent();
                                (0, vitest_1.expect)((_a = before.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                (0, vitest_1.expect)((_b = before.data) === null || _b === void 0 ? void 0 : _b.dept).toBe("ops");
                                return [4 /*yield*/, harness.auth.$context];
                            case 3:
                                ctx = _d.sent();
                                return [4 /*yield*/, ctx.adapter.delete({
                                        model: "oauthResource",
                                        where: [{ field: "identifier", value: deletedResource }],
                                    })];
                            case 4:
                                _d.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: oauthClient.client_id,
                                        client_secret: oauthClient.client_secret,
                                    })];
                            case 5:
                                after = _d.sent();
                                (0, vitest_1.expect)((_c = after.data) === null || _c === void 0 ? void 0 : _c.active).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("stays active and keeps its claims after the bound resource is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, ctx, introspection;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(oauthClient, {
                                    resource: disabledResource,
                                })];
                            case 1:
                                token = _c.sent();
                                return [4 /*yield*/, harness.auth.$context];
                            case 2:
                                ctx = _c.sent();
                                return [4 /*yield*/, ctx.adapter.update({
                                        model: "oauthResource",
                                        where: [{ field: "identifier", value: disabledResource }],
                                        update: { disabled: true },
                                    })];
                            case 3:
                                _c.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: oauthClient.client_id,
                                        client_secret: oauthClient.client_secret,
                                    })];
                            case 4:
                                introspection = _c.sent();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                (0, vitest_1.expect)((_b = introspection.data) === null || _b === void 0 ? void 0 : _b.dept).toBe("sec");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/issues/8267
 */
(0, vitest_1.describe)("introspection authorization (#8267) — opaque tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
    var resource, harness, issuerClientA, resourceServerB, unrelatedClientC;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resource = "https://api.example.com/rs-8267-opaque";
                return [4 /*yield*/, bootHarness({
                        disableJwtPlugin: true,
                        resources: [resource],
                    })];
            case 1:
                harness = _a.sent();
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.registerClient()];
                            case 1:
                                issuerClientA = _a.sent();
                                return [4 /*yield*/, harness.registerClient()];
                            case 2:
                                resourceServerB = _a.sent();
                                return [4 /*yield*/, harness.registerClient()];
                            case 3:
                                unrelatedClientC = _a.sent();
                                return [4 /*yield*/, harness.linkClientToResource(resourceServerB.client_id, resource)];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("lets a linked resource server introspect an opaque resource-bound token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(issuerClientA, { resource: resource })];
                            case 1:
                                token = _b.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: resourceServerB.client_id,
                                        client_secret: resourceServerB.client_secret,
                                    })];
                            case 2:
                                introspection = _b.sent();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("reports inactive to an unlinked client for an opaque token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, introspection;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(issuerClientA, { resource: resource })];
                            case 1:
                                token = _b.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: unrelatedClientC.client_id,
                                        client_secret: unrelatedClientC.client_secret,
                                    })];
                            case 2:
                                introspection = _b.sent();
                                (0, vitest_1.expect)((_a = introspection.data) === null || _a === void 0 ? void 0 : _a.active).toBe(false);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("introspection — pairwise sub across clients", function () { return __awaiter(void 0, void 0, void 0, function () {
    var resource, harness, issuerClient, resourceServer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resource = "https://api.example.com/rs-pairwise";
                return [4 /*yield*/, bootHarness({
                        pairwiseSecret: "pairwise-secret-at-least-32-chars-long",
                        resources: [resource],
                    })];
            case 1:
                harness = _a.sent();
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.registerClient({ subject_type: "pairwise" })];
                            case 1:
                                issuerClient = _a.sent();
                                return [4 /*yield*/, harness.registerClient()];
                            case 2:
                                resourceServer = _a.sent();
                                return [4 /*yield*/, harness.linkClientToResource(resourceServer.client_id, resource)];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns the issuing client's pairwise sub to a linked resource server", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var token, issuerView, resourceServerView;
                    var _a, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, harness.mintToken(issuerClient, { resource: resource })];
                            case 1:
                                token = _f.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: issuerClient.client_id,
                                        client_secret: issuerClient.client_secret,
                                    })];
                            case 2:
                                issuerView = _f.sent();
                                return [4 /*yield*/, harness.introspect({
                                        token: token,
                                        client_id: resourceServer.client_id,
                                        client_secret: resourceServer.client_secret,
                                    })];
                            case 3:
                                resourceServerView = _f.sent();
                                (0, vitest_1.expect)((_a = issuerView.data) === null || _a === void 0 ? void 0 : _a.active).toBe(true);
                                (0, vitest_1.expect)((_b = resourceServerView.data) === null || _b === void 0 ? void 0 : _b.active).toBe(true);
                                // Pairwise applied (not the raw user id), and identical for both callers.
                                (0, vitest_1.expect)((_c = issuerView.data) === null || _c === void 0 ? void 0 : _c.sub).not.toBe(harness.user.id);
                                (0, vitest_1.expect)((_d = resourceServerView.data) === null || _d === void 0 ? void 0 : _d.sub).toBe((_e = issuerView.data) === null || _e === void 0 ? void 0 : _e.sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("id_token claim input — sessionId", function () { return __awaiter(void 0, void 0, void 0, function () {
    var capturedInput, harness, oauthClient;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bootHarness({
                    extensions: [
                        {
                            claims: {
                                idToken: function (input) {
                                    capturedInput = input;
                                    return { session_probe: "captured" };
                                },
                            },
                        },
                    ],
                })];
            case 1:
                harness = _a.sent();
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, harness.registerClient()];
                            case 1:
                                oauthClient = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("passes the issuing session id to a claims.idToken contributor on authorization_code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var input;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                capturedInput = undefined;
                                return [4 /*yield*/, harness.mintToken(oauthClient)];
                            case 1:
                                _a.sent();
                                input = capturedInput;
                                (0, vitest_1.expect)(input).toBeDefined();
                                (0, vitest_1.expect)(input === null || input === void 0 ? void 0 : input.grantType).toBe("authorization_code");
                                (0, vitest_1.expect)(typeof (input === null || input === void 0 ? void 0 : input.sessionId)).toBe("string");
                                (0, vitest_1.expect)(input === null || input === void 0 ? void 0 : input.sessionId).not.toBe("");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
