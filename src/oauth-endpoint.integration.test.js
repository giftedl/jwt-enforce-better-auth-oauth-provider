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
var client_1 = require("better-auth/client");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
var authServerBaseUrl = "http://localhost:3000";
/**
 * @see https://github.com/better-auth/better-auth/issues/9250
 */
(0, vitest_1.describe)("RFC envelope compliance across OAuth endpoints", function () { return __awaiter(void 0, void 0, void 0, function () {
    function captureJsonResponse(path, init) {
        return __awaiter(this, void 0, void 0, function () {
            var status, body;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = 0;
                        body = null;
                        return [4 /*yield*/, client.$fetch(path, __assign(__assign({}, init), { onResponse: function (context) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                status = context.response.status;
                                                _b.label = 1;
                                            case 1:
                                                _b.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, context.response.clone().json()];
                                            case 2:
                                                body = (_b.sent());
                                                return [3 /*break*/, 4];
                                            case 3:
                                                _a = _b.sent();
                                                body = null;
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); } }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { status: status, body: body }];
                }
            });
        });
    }
    function captureRedirect(path_1) {
        return __awaiter(this, arguments, void 0, function (path, init) {
            var status, location;
            var _this = this;
            if (init === void 0) { init = { method: "GET" }; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = 0;
                        location = null;
                        return [4 /*yield*/, client.$fetch(path, __assign(__assign({}, init), { redirect: "manual", onResponse: function (context) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        status = context.response.status;
                                        location = context.response.headers.get("location");
                                        return [2 /*return*/];
                                    });
                                }); } }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { status: status, location: location }];
                }
            });
        });
    }
    function expectRedirectLocation(location) {
        (0, vitest_1.expect)(location).toBeTruthy();
        if (!location) {
            throw new Error("missing redirect location");
        }
        return location;
    }
    function postForm(path, body) {
        return captureJsonResponse(path, {
            method: "POST",
            body: body,
            headers: { "content-type": "application/x-www-form-urlencoded" },
        });
    }
    function postJson(path, body) {
        return captureJsonResponse(path, { method: "POST", body: body });
    }
    var _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
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
                redirectUri = "http://localhost:5000/api/auth/oauth2/callback/test";
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
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
                                oauthClient = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10752#pullrequestreview-4910497732
                 */
                vitest_1.it.each(["/oauth2/introspect", "/oauth2/revoke"])("%s rejects repeated form client authentication fields", function (path) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, status, body;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !oauthClient.client_secret) {
                                    throw new Error("OAuth client was not created");
                                }
                                return [4 /*yield*/, captureJsonResponse(path, {
                                        method: "POST",
                                        body: new URLSearchParams([
                                            ["client_id", oauthClient.client_id],
                                            ["client_secret", oauthClient.client_secret],
                                            ["client_secret", "duplicate-secret"],
                                            ["token", "opaque-token"],
                                        ]),
                                        headers: {
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                    })];
                            case 1:
                                _a = _b.sent(), status = _a.status, body = _a.body;
                                (0, vitest_1.expect)(status).toBe(400);
                                (0, vitest_1.expect)(body === null || body === void 0 ? void 0 : body.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.describe)("oauth2Token (JSON delivery)", function () {
                    (0, vitest_1.it)("missing grant_type → invalid_request", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, status, body;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, postForm("/oauth2/token", {})];
                                case 1:
                                    _a = _b.sent(), status = _a.status, body = _a.body;
                                    (0, vitest_1.expect)(status).toBe(400);
                                    (0, vitest_1.expect)(body).toEqual({
                                        error: "invalid_request",
                                        error_description: "grant_type is required",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("unsupported grant_type → unsupported_grant_type", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, status, body;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, postForm("/oauth2/token", {
                                        grant_type: "password",
                                    })];
                                case 1:
                                    _a = _b.sent(), status = _a.status, body = _a.body;
                                    (0, vitest_1.expect)(status).toBe(400);
                                    (0, vitest_1.expect)(body === null || body === void 0 ? void 0 : body.error).toBe("unsupported_grant_type");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.describe)("oauth2Revoke (JSON delivery)", function () {
                    (0, vitest_1.it)("unknown token_type_hint is ignored at schema level (RFC 7009 §2.2.1)", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var body;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, postForm("/oauth2/revoke", {
                                        token: "placeholder",
                                        token_type_hint: "id_token",
                                    })];
                                case 1:
                                    body = (_a.sent()).body;
                                    // The schema used to reject unknown hints with unsupported_token_type.
                                    // RFC 7009 §2.2.1 says servers MAY ignore the hint; that error code is
                                    // reserved for the token type itself being unsupported, not the hint.
                                    (0, vitest_1.expect)(body === null || body === void 0 ? void 0 : body.error).not.toBe("unsupported_token_type");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("missing token → invalid_request with envelope", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, status, body;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, postForm("/oauth2/revoke", {})];
                                case 1:
                                    _a = _b.sent(), status = _a.status, body = _a.body;
                                    (0, vitest_1.expect)(status).toBe(400);
                                    (0, vitest_1.expect)(body).toEqual({
                                        error: "invalid_request",
                                        error_description: "token is required",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.describe)("registerOAuthClient (JSON delivery)", function () {
                    (0, vitest_1.it)("disabled registration rejects before metadata validation", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, status, body;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, postJson("/oauth2/register", {})];
                                case 1:
                                    _a = _b.sent(), status = _a.status, body = _a.body;
                                    (0, vitest_1.expect)(status).toBe(403);
                                    (0, vitest_1.expect)(body === null || body === void 0 ? void 0 : body.error).toBe("access_denied");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("disabled registration does not leak supported auth methods", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, status, body;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, postJson("/oauth2/register", {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "not_a_real_method",
                                    })];
                                case 1:
                                    _a = _b.sent(), status = _a.status, body = _a.body;
                                    (0, vitest_1.expect)(status).toBe(403);
                                    (0, vitest_1.expect)(body === null || body === void 0 ? void 0 : body.error).toBe("access_denied");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.describe)("oauth2Authorize (redirect delivery)", function () {
                    (0, vitest_1.it)("unsupported response_type=token → error in fragment (OIDC §5)", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var state, qs, _a, status, location, redirectLocation, errorUrl, params;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    state = "opaque-state-abc";
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: redirectUri,
                                        response_type: "token",
                                        state: state,
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    errorUrl = new URL(redirectLocation);
                                    // Implicit flow: errors MUST be in the fragment, not query.
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(true);
                                    (0, vitest_1.expect)(errorUrl.hash).toBeTruthy();
                                    params = new URLSearchParams(errorUrl.hash.slice(1));
                                    (0, vitest_1.expect)(params.get("error")).toBe("unsupported_response_type");
                                    (0, vitest_1.expect)(params.get("error_description")).toBeTruthy();
                                    (0, vitest_1.expect)(params.get("state")).toBe(state);
                                    (0, vitest_1.expect)(params.get("iss")).toBeTruthy();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("response_mode=query overrides implicit default", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, location, redirectLocation, errorUrl;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: redirectUri,
                                        response_type: "token",
                                        response_mode: "query",
                                        state: "s",
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    location = (_a.sent()).location;
                                    redirectLocation = expectRedirectLocation(location);
                                    errorUrl = new URL(redirectLocation);
                                    // Explicit response_mode wins over the response_type-derived default.
                                    (0, vitest_1.expect)(errorUrl.hash).toBe("");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("unsupported_response_type");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("duplicated response_type → invalid_request (RFC 6749 §3.1)", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, _a, status, location, redirectLocation, errorUrl;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    qs = new URLSearchParams([
                                        ["client_id", oauthClient.client_id],
                                        ["redirect_uri", redirectUri],
                                        ["response_type", "code"],
                                        ["response_type", "token"],
                                        ["state", "s"],
                                    ]).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    errorUrl = new URL(redirectLocation);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("invalid_request");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error_description")).toMatch(/response_type/);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("missing response_type with trusted redirect_uri → invalid_request", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var state, qs, _a, status, location, redirectLocation, errorUrl;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    state = "missing-response-type";
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: redirectUri,
                                        state: state,
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(true);
                                    errorUrl = new URL(redirectLocation);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("invalid_request");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error_description")).toMatch(/response_type/);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("state")).toBe(state);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("iss")).toBeTruthy();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("missing response_type with unregistered redirect_uri → server error page", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, _a, status, location, redirectLocation, errorUrl;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: "https://evil.example.com/callback",
                                        state: "s",
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(false);
                                    (0, vitest_1.expect)(redirectLocation).not.toContain("evil.example.com");
                                    errorUrl = new URL(redirectLocation);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("invalid_request");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error_description")).toMatch(/response_type/);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("form POST authorization request → code redirect", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var state, body, _a, status, location, redirectLocation, callback;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    state = "post-authorization-state";
                                    body = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: redirectUri,
                                        response_type: "code",
                                        scope: "openid",
                                        state: state,
                                        code_challenge: "a".repeat(43),
                                        code_challenge_method: "S256",
                                    });
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize", {
                                            method: "POST",
                                            body: body,
                                            headers: { "content-type": "application/x-www-form-urlencoded" },
                                        })];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    callback = new URL(redirectLocation);
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(true);
                                    (0, vitest_1.expect)(callback.searchParams.get("code")).toBeTruthy();
                                    (0, vitest_1.expect)(callback.searchParams.get("state")).toBe(state);
                                    (0, vitest_1.expect)(callback.searchParams.get("iss")).toBeTruthy();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("unsupported request object → request_not_supported", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, _a, status, location, redirectLocation, errorUrl;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: redirectUri,
                                        response_type: "code",
                                        scope: "openid",
                                        request: "eyJhbGciOiJub25lIn0.eyJzdGF0ZSI6Imp3dC1zdGF0ZSJ9.",
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    errorUrl = new URL(redirectLocation);
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(true);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("request_not_supported");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("code")).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("empty request object parameter → request_not_supported", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, _a, status, location, redirectLocation, errorUrl;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: redirectUri,
                                        response_type: "code",
                                        scope: "openid",
                                        request: "",
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    errorUrl = new URL(redirectLocation);
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(true);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("request_not_supported");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("code")).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("unsupported request_uri without resolver → request_uri_not_supported", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, _a, status, location, redirectLocation, errorUrl;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: redirectUri,
                                        response_type: "code",
                                        scope: "openid",
                                        request_uri: "https://rp.example.com/request.jwt",
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    errorUrl = new URL(redirectLocation);
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(true);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("request_uri_not_supported");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("code")).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("empty request_uri parameter without resolver → request_uri_not_supported", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, _a, status, location, redirectLocation, errorUrl;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: redirectUri,
                                        response_type: "code",
                                        scope: "openid",
                                        request_uri: "",
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    errorUrl = new URL(redirectLocation);
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(true);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("request_uri_not_supported");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("code")).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("missing client_id → server error page with invalid_request (no RP to trust)", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, _a, status, location, redirectLocation, errorUrl;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    qs = new URLSearchParams({
                                        redirect_uri: redirectUri,
                                        response_type: "code",
                                        state: "s",
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    // Without a trusted client_id we cannot redirect to the RP: fall back
                                    // to the server error page.
                                    (0, vitest_1.expect)(redirectLocation.startsWith(redirectUri)).toBe(false);
                                    errorUrl = new URL(redirectLocation);
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("invalid_request");
                                    (0, vitest_1.expect)(errorUrl.searchParams.get("error_description")).toBeTruthy();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("invalid response_type with unregistered redirect_uri → server error page", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var qs, _a, status, location, redirectLocation;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
                                        throw new Error("beforeAll didn't run");
                                    qs = new URLSearchParams({
                                        client_id: oauthClient.client_id,
                                        redirect_uri: "http://evil.example.com/callback",
                                        response_type: "token",
                                        state: "s",
                                    }).toString();
                                    return [4 /*yield*/, captureRedirect("/oauth2/authorize?".concat(qs))];
                                case 1:
                                    _a = _b.sent(), status = _a.status, location = _a.location;
                                    (0, vitest_1.expect)(status).toBeGreaterThanOrEqual(300);
                                    (0, vitest_1.expect)(status).toBeLessThan(400);
                                    redirectLocation = expectRedirectLocation(location);
                                    // Open-redirect guard: unregistered redirect_uri means we cannot trust
                                    // the RP, regardless of other validation failures.
                                    (0, vitest_1.expect)(redirectLocation.startsWith("http://evil.example.com")).toBe(false);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.describe)("oauth2Introspect (JSON delivery)", function () {
                    (0, vitest_1.it)("missing token → invalid_request with envelope", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, status, body;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, postForm("/oauth2/introspect", {})];
                                case 1:
                                    _a = _b.sent(), status = _a.status, body = _a.body;
                                    (0, vitest_1.expect)(status).toBe(400);
                                    (0, vitest_1.expect)(body).toEqual({
                                        error: "invalid_request",
                                        error_description: "token is required",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.describe)("oauth2EndSession (JSON delivery)", function () {
                    (0, vitest_1.it)("missing id_token_hint → controlled invalid_request with envelope", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, status, body;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, captureJsonResponse("/oauth2/end-session", { method: "GET" })];
                                case 1:
                                    _a = _b.sent(), status = _a.status, body = _a.body;
                                    (0, vitest_1.expect)(status).toBe(400);
                                    (0, vitest_1.expect)(body).toEqual({
                                        error: "invalid_request",
                                        error_description: "User confirmation is required to complete logout",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); });
