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
var api_1 = require("@better-auth/core/api");
var api_2 = require("better-auth/api");
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var z = require("zod");
var authorize_1 = require("./authorize");
var client_2 = require("./client");
var index_1 = require("./index");
var oauth_1 = require("./oauth");
var signed_query_1 = require("./signed-query");
var signedQueryParameterNameParam = "ba_param";
(0, vitest_1.describe)("validateIssuerUrl (RFC 9207)", function () {
    (0, vitest_1.it)("should allow HTTPS URLs unchanged", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("https://auth.example.com")).toBe("https://auth.example.com");
    });
    /**
     * @see https://github.com/better-auth/better-auth/issues/11740
     */
    (0, vitest_1.it)("should keep a configured HTTP issuer for non-localhost", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("http://auth.example.com")).toBe("http://auth.example.com");
    });
    (0, vitest_1.it)("should allow HTTP for localhost", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("http://localhost:3000")).toBe("http://localhost:3000");
    });
    (0, vitest_1.it)("should allow HTTP for 127.0.0.1", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("http://127.0.0.1:3000")).toBe("http://127.0.0.1:3000");
    });
    (0, vitest_1.it)("should strip query parameters", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("https://auth.example.com?foo=bar")).toBe("https://auth.example.com");
    });
    (0, vitest_1.it)("should strip fragment", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("https://auth.example.com#section")).toBe("https://auth.example.com");
    });
    (0, vitest_1.it)("should strip both query and fragment", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("https://auth.example.com?foo=bar#section")).toBe("https://auth.example.com");
    });
    (0, vitest_1.it)("should remove trailing slash", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("https://auth.example.com/")).toBe("https://auth.example.com");
    });
    (0, vitest_1.it)("should preserve path", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("https://auth.example.com/api/auth")).toBe("https://auth.example.com/api/auth");
    });
    (0, vitest_1.it)("should handle complex invalid URL and sanitize", function () {
        (0, vitest_1.expect)((0, authorize_1.validateIssuerUrl)("http://auth.example.com:8080/path?query=1#hash")).toBe("http://auth.example.com:8080/path");
    });
});
(0, vitest_1.describe)("formatErrorURL", function () {
    (0, vitest_1.it)("should append query errors before the URL fragment", function () {
        (0, vitest_1.expect)((0, authorize_1.formatErrorURL)("/error?source=oauth#retry", "invalid_request", "Missing parameter")).toBe("/error?source=oauth&error=invalid_request&error_description=Missing+parameter#retry");
    });
});
(0, vitest_1.describe)("oauth signed query signatures", function () {
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.unstubAllGlobals();
    });
    var createSignedParams = function (secret, configure) { return __awaiter(void 0, void 0, void 0, function () {
        var params, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    params = new URLSearchParams();
                    params.set("client_id", "client-a");
                    params.set("redirect_uri", "https://rp.example.com/callback");
                    params.set("response_type", "code");
                    params.set("scope", "openid profile");
                    params.set("state", "state-a");
                    configure === null || configure === void 0 ? void 0 : configure(params);
                    params.set("exp", String(Math.floor(Date.now() / 1000) + 600));
                    params.set(signed_query_1.signedQueryIssuedAtParam, String(Date.now()));
                    (0, signed_query_1.setSignedOAuthQueryParameterNames)(params);
                    _b = (_a = params).set;
                    _c = ["sig"];
                    return [4 /*yield*/, (0, crypto_1.makeSignature)((0, signed_query_1.canonicalizeOAuthQueryParams)(params).toString(), secret)];
                case 1:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [2 /*return*/, params];
            }
        });
    }); };
    (0, vitest_1.it)("should verify signed params when query params are reordered", function () { return __awaiter(void 0, void 0, void 0, function () {
        var signedParams, reordered, _i, _a, _b, key, value, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, createSignedParams("test-secret")];
                case 1:
                    signedParams = _d.sent();
                    reordered = new URLSearchParams();
                    for (_i = 0, _a = __spreadArray([], signedParams.entries(), true).reverse(); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        reordered.append(key, value);
                    }
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, index_1.verifyOAuthQueryParams)(reordered.toString(), "test-secret")];
                case 2:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should verify signed params when repeated values are reordered", function () { return __awaiter(void 0, void 0, void 0, function () {
        var signedParams, reordered, _i, _a, _b, key, value, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, createSignedParams("test-secret", function (params) {
                        params.append("resource", "https://b.example.com");
                        params.append("resource", "https://a.example.com");
                    })];
                case 1:
                    signedParams = _d.sent();
                    reordered = new URLSearchParams();
                    for (_i = 0, _a = __spreadArray([], signedParams.entries(), true).reverse(); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        reordered.append(key, value);
                    }
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, index_1.verifyOAuthQueryParams)(reordered.toString(), "test-secret")];
                case 2:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should reject tampered signed params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var signedParams, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, createSignedParams("test-secret")];
                case 1:
                    signedParams = _b.sent();
                    signedParams.set("client_id", "client-b");
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, index_1.verifyOAuthQueryParams)(signedParams.toString(), "test-secret")];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should reject duplicate signature params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var signedParams, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, createSignedParams("test-secret")];
                case 1:
                    signedParams = _b.sent();
                    signedParams.append("sig", "extra-sig");
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, index_1.verifyOAuthQueryParams)(signedParams.toString(), "test-secret")];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should preserve custom signed params when the client copies reordered signed queries", function () { return __awaiter(void 0, void 0, void 0, function () {
        var signedParams, reorderedParams, _i, _a, _b, key, value, plugin, onRequest, ctx, body, forwardedParams, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, createSignedParams("test-secret", function (params) {
                        params.set("custom_authorization_context", "tenant-a");
                        params.append("resource", "https://api.example.com");
                    })];
                case 1:
                    signedParams = _f.sent();
                    reorderedParams = new URLSearchParams();
                    for (_i = 0, _a = __spreadArray([], signedParams.entries(), true).reverse(); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        reorderedParams.append(key, value);
                    }
                    reorderedParams.append("utm_email", "user@example.com");
                    vitest_1.vi.stubGlobal("window", {
                        location: {
                            search: "?".concat(reorderedParams.toString()),
                        },
                    });
                    plugin = (0, client_2.oauthProviderClient)();
                    onRequest = (_e = (_d = plugin.fetchPlugins[0]) === null || _d === void 0 ? void 0 : _d.hooks) === null || _e === void 0 ? void 0 : _e.onRequest;
                    ctx = {
                        method: "POST",
                        headers: new Headers({
                            "content-type": "application/json",
                        }),
                        body: "{}",
                    };
                    return [4 /*yield*/, (onRequest === null || onRequest === void 0 ? void 0 : onRequest(ctx))];
                case 2:
                    _f.sent();
                    body = JSON.parse(String(ctx.body));
                    forwardedParams = new URLSearchParams(body.oauth_query);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, index_1.verifyOAuthQueryParams)(body.oauth_query, "test-secret")];
                case 3:
                    _c.apply(void 0, [_f.sent()]).toBe(true);
                    (0, vitest_1.expect)(forwardedParams.get("custom_authorization_context")).toBe("tenant-a");
                    (0, vitest_1.expect)(forwardedParams.get("resource")).toBe("https://api.example.com");
                    (0, vitest_1.expect)(forwardedParams.get("utm_email")).toBeNull();
                    (0, vitest_1.expect)(forwardedParams.getAll(signedQueryParameterNameParam)).toContain("custom_authorization_context");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("oauth authorize - unauthenticated", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, unauthenticatedClient, oauthClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
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
                unauthenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
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
                (0, vitest_1.it)("should always redirect to /login because user is not logged in", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, loginRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "123",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        codeVerifier: (0, crypto_1.generateRandomString)(64),
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                    })];
                            case 1:
                                authUrl = _a.sent();
                                loginRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            loginRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("/login");
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("response_type=code");
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("scope=openid");
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("redirect_uri=".concat(encodeURIComponent(redirectUri)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/croffasia/itsaplan/issues/564
                 */
                (0, vitest_1.it)("reports an unknown client_id as a client that was not found", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, location, errorUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.search = new URLSearchParams({
                                    response_type: "code",
                                    client_id: "no-such-client",
                                    redirect_uri: redirectUri,
                                    code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
                                    code_challenge_method: "S256",
                                }).toString();
                                location = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            location = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                errorUrl = new URL(location, authServerBaseUrl);
                                (0, vitest_1.expect)(errorUrl.origin).toBe(authServerBaseUrl);
                                (0, vitest_1.expect)(errorUrl.searchParams.get("error")).toBe("invalid_client");
                                (0, vitest_1.expect)(errorUrl.searchParams.get("error_description")).toBe("client not found");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should replace incoming sig when signing the login redirect", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, loginRedirectUrl, loginRedirect, secret, reordered, _i, _a, _b, key, value, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "incoming-sig",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        codeVerifier: (0, crypto_1.generateRandomString)(64),
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                    })];
                            case 1:
                                authUrl = _e.sent();
                                authUrl.searchParams.append("sig", "attacker-sig");
                                loginRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            loginRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _e.sent();
                                loginRedirect = new URL(loginRedirectUrl, authServerBaseUrl);
                                secret = auth.options.secret;
                                reordered = new URLSearchParams();
                                for (_i = 0, _a = __spreadArray([], loginRedirect.searchParams.entries(), true).reverse(); _i < _a.length; _i++) {
                                    _b = _a[_i], key = _b[0], value = _b[1];
                                    reordered.append(key, value);
                                }
                                (0, vitest_1.expect)(loginRedirect.searchParams.getAll("sig")).toHaveLength(1);
                                (0, vitest_1.expect)(loginRedirect.searchParams.get("sig")).not.toBe("attacker-sig");
                                _c = vitest_1.expect;
                                return [4 /*yield*/, (0, index_1.verifyOAuthQueryParams)(loginRedirect.search.slice(1), secret)];
                            case 3:
                                _c.apply(void 0, [_e.sent()]).toBe(true);
                                _d = vitest_1.expect;
                                return [4 /*yield*/, (0, index_1.verifyOAuthQueryParams)(reordered.toString(), secret)];
                            case 4:
                                _d.apply(void 0, [_e.sent()]).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should return login_required when prompt=none and user is not logged in", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, callbackRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "prompt-none-login-required");
                                authUrl.searchParams.set("prompt", "none");
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("error=login_required");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=prompt-none-login-required");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("iss=".concat(encodeURIComponent(authServerBaseUrl)));
                                (0, vitest_1.expect)(callbackRedirectUrl).not.toContain("/login");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth authorize - max_age (OIDC Core 1.0 §3.1.2.1)", function () { return __awaiter(void 0, void 0, void 0, function () {
    function authorizeUrl(maxAge, prompt, clientId) {
        var resolvedClientId = clientId !== null && clientId !== void 0 ? clientId : oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id;
        if (!resolvedClientId)
            throw new Error("beforeAll not run properly");
        var url = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
        url.searchParams.set("client_id", resolvedClientId);
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", "openid");
        url.searchParams.set("state", "123");
        url.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
        url.searchParams.set("code_challenge_method", "S256");
        url.searchParams.set("max_age", maxAge);
        if (prompt)
            url.searchParams.set("prompt", prompt);
        return url.toString();
    }
    function redirectFor(maxAge, prompt, clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        location = "";
                        return [4 /*yield*/, authenticatedClient.$fetch(authorizeUrl(maxAge, prompt, clientId), {
                                onError: function (context) {
                                    location = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, location];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, authenticatedClient, oauthClient, oauthClientNeedsConsent, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
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
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/test");
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
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: false,
                                        },
                                    })];
                            case 2:
                                oauthClientNeedsConsent = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/9936
                 */
                (0, vitest_1.it)("treats max_age=0 as an explicit re-authentication request", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var location;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, redirectFor("0")];
                            case 1:
                                location = _a.sent();
                                (0, vitest_1.expect)(location).toContain("/login");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("does not re-authenticate when the session is within max_age", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var location;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, redirectFor("10000")];
                            case 1:
                                location = _a.sent();
                                (0, vitest_1.expect)(location).toContain(redirectUri);
                                (0, vitest_1.expect)(location).toContain("code=");
                                (0, vitest_1.expect)(location).not.toContain("/login");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/9936
                 */
                (0, vitest_1.it)("removes satisfied max_age before redirecting to consent", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var location, consentUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClientNeedsConsent === null || oauthClientNeedsConsent === void 0 ? void 0 : oauthClientNeedsConsent.client_id)) {
                                    throw new Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, redirectFor("10000", undefined, oauthClientNeedsConsent.client_id)];
                            case 1:
                                location = _a.sent();
                                consentUrl = new URL(location, authServerBaseUrl);
                                (0, vitest_1.expect)(consentUrl.pathname).toBe("/consent");
                                (0, vitest_1.expect)(consentUrl.searchParams.get("max_age")).toBeNull();
                                (0, vitest_1.expect)(consentUrl.searchParams.get("client_id")).toBe(oauthClientNeedsConsent.client_id);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns login_required for prompt=none when the session is older than max_age", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var location;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, redirectFor("0", "none")];
                            case 1:
                                location = _a.sent();
                                (0, vitest_1.expect)(location).toContain("error=login_required");
                                (0, vitest_1.expect)(location).not.toContain("/login");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/9936
                 */
                (0, vitest_1.it)("returns invalid_request for invalid max_age values", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var location;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, redirectFor("-1")];
                            case 1:
                                location = _a.sent();
                                (0, vitest_1.expect)(location).toContain(redirectUri);
                                (0, vitest_1.expect)(location).toContain("error=invalid_request");
                                (0, vitest_1.expect)(location).not.toContain("/login");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/9936
                 */
                (0, vitest_1.it)("returns invalid_request for empty max_age values", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _i, _a, maxAge, location_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _i = 0, _a = ["", "   "];
                                _b.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 4];
                                maxAge = _a[_i];
                                return [4 /*yield*/, redirectFor(maxAge)];
                            case 2:
                                location_1 = _b.sent();
                                (0, vitest_1.expect)(location_1).toContain(redirectUri);
                                (0, vitest_1.expect)(location_1).toContain("error=invalid_request");
                                (0, vitest_1.expect)(location_1).not.toContain("/login");
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth authorize - ACR requests", function () { return __awaiter(void 0, void 0, void 0, function () {
    function authorizeUrl(acrValues, acrClaim, scope, codeChallenge) {
        if (scope === void 0) { scope = "openid"; }
        if (codeChallenge === void 0) { codeChallenge = (0, crypto_1.generateRandomString)(43); }
        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id))
            throw new Error("beforeAll not run properly");
        var url = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
        url.searchParams.set("client_id", oauthClient.client_id);
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", scope);
        url.searchParams.set("state", "acr-state");
        url.searchParams.set("code_challenge", codeChallenge);
        url.searchParams.set("code_challenge_method", "S256");
        if (acrValues !== undefined) {
            url.searchParams.set("acr_values", acrValues);
        }
        if (acrClaim) {
            url.searchParams.set("claims", JSON.stringify({ id_token: { acr: acrClaim } }));
        }
        return url.toString();
    }
    function redirectFor(acrValues, acrClaim, scope, codeChallenge) {
        return __awaiter(this, void 0, void 0, function () {
            var location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        location = "";
                        return [4 /*yield*/, authenticatedClient.$fetch(authorizeUrl(acrValues, acrClaim, scope, codeChallenge), {
                                onError: function (context) {
                                    location = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, location];
                }
            });
        });
    }
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, authenticatedClient, oauthClient, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
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
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/test");
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
                (0, vitest_1.describe)("claims.id_token.acr (OIDC Core 1.0 §5.5.1.1)", function () {
                    (0, vitest_1.it)("accepts an unsupported voluntary claim", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var location, callbackRedirect;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, redirectFor(undefined, { values: ["1"] })];
                                case 1:
                                    location = _a.sent();
                                    callbackRedirect = new URL(location);
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("error")).toBeNull();
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("code")).toEqual(vitest_1.expect.any(String));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    vitest_1.it.each([
                        ["value", { essential: true, value: "1" }],
                        ["values", { essential: true, values: ["1"] }],
                    ])("rejects an unsupported essential %s", function (_, request) { return __awaiter(void 0, void 0, void 0, function () {
                        var location, callbackRedirect;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, redirectFor(undefined, request)];
                                case 1:
                                    location = _a.sent();
                                    callbackRedirect = new URL(location);
                                    (0, vitest_1.expect)(callbackRedirect.origin + callbackRedirect.pathname).toBe(redirectUri);
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("error")).toBe("access_denied");
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("state")).toBe("acr-state");
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("code")).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    vitest_1.it.each([
                        ["value", { essential: true, value: 1 }],
                        ["values", { essential: true, values: "1" }],
                    ])("rejects a malformed essential %s", function (_, request) { return __awaiter(void 0, void 0, void 0, function () {
                        var location, callbackRedirect;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, redirectFor(undefined, request)];
                                case 1:
                                    location = _a.sent();
                                    callbackRedirect = new URL(location);
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("error")).toBe("invalid_request");
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("state")).toBe("acr-state");
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("code")).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    vitest_1.it.each([
                        { essential: true, value: "1" },
                        { essential: true, value: 1 },
                    ])("rejects claims in OAuth-only requests", function (request) { return __awaiter(void 0, void 0, void 0, function () {
                        var location, callbackRedirect;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, redirectFor(undefined, request, "profile")];
                                case 1:
                                    location = _a.sent();
                                    callbackRedirect = new URL(location);
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("error")).toBe("invalid_request");
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("error_description")).toBe("openid scope must be requested when using the claims parameter");
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("code")).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("accepts the current ACR in an essential values request", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var location, callbackRedirect;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, redirectFor(undefined, {
                                        essential: true,
                                        values: ["1", "0"],
                                    })];
                                case 1:
                                    location = _a.sent();
                                    callbackRedirect = new URL(location);
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("error")).toBeNull();
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("code")).toEqual(vitest_1.expect.any(String));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("accepts matching value and values selectors", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var location, callbackRedirect;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, redirectFor(undefined, {
                                        essential: true,
                                        value: "0",
                                        values: ["0"],
                                    })];
                                case 1:
                                    location = _a.sent();
                                    callbackRedirect = new URL(location);
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("error")).toBeNull();
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("code")).toEqual(vitest_1.expect.any(String));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("rejects conflicting value and values selectors", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var location, callbackRedirect;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, redirectFor(undefined, {
                                        essential: true,
                                        value: "0",
                                        values: ["1"],
                                    })];
                                case 1:
                                    location = _a.sent();
                                    callbackRedirect = new URL(location);
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("error")).toBe("access_denied");
                                    (0, vitest_1.expect)(callbackRedirect.searchParams.get("code")).toBeNull();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth authorize - request_uri resolution", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, providerId, redirectUri, requestUri, requestUriWithPostLoginMarker, requestUriWithInvalidMaxAge, requestUriWithReorderedPrompt, requestUriResolver, _a, auth, signInWithTestUser, customFetchImpl, headers, unauthenticatedClient, oauthClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                requestUri = "urn:better-auth:par:test";
                requestUriWithPostLoginMarker = "urn:better-auth:par:post-login";
                requestUriWithInvalidMaxAge = "urn:better-auth:par:invalid-max-age";
                requestUriWithReorderedPrompt = "urn:better-auth:par:reordered-prompt";
                requestUriResolver = vitest_1.vi.fn(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var resolvedParams;
                    var _c;
                    var receivedRequestUri = _b.requestUri;
                    return __generator(this, function (_d) {
                        resolvedParams = {
                            response_type: "code",
                            redirect_uri: redirectUri,
                            scope: "openid",
                            state: "par-state",
                            code_challenge: "a".repeat(43),
                            code_challenge_method: "S256",
                        };
                        if (receivedRequestUri === requestUri) {
                            return [2 /*return*/, resolvedParams];
                        }
                        if (receivedRequestUri === requestUriWithPostLoginMarker) {
                            return [2 /*return*/, __assign(__assign({}, resolvedParams), (_c = {}, _c[signed_query_1.postLoginClearedParam] = "attacker-session", _c))];
                        }
                        if (receivedRequestUri === requestUriWithInvalidMaxAge) {
                            return [2 /*return*/, __assign(__assign({}, resolvedParams), { max_age: "-1" })];
                        }
                        if (receivedRequestUri === requestUriWithReorderedPrompt) {
                            return [2 /*return*/, __assign(__assign({}, resolvedParams), { prompt: "consent login" })];
                        }
                        return [2 /*return*/, null];
                    });
                }); });
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                requestUriResolver: requestUriResolver,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                unauthenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
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
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject request_uri without client_id before resolver lookup", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirectUrl, errorRedirect;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                requestUriResolver.mockClear();
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("request_uri", requestUri);
                                errorRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(requestUriResolver).not.toHaveBeenCalled();
                                errorRedirect = new URL(errorRedirectUrl, authServerBaseUrl);
                                (0, vitest_1.expect)(errorRedirect.searchParams.get("error")).toBe("invalid_request");
                                (0, vitest_1.expect)(errorRedirect.searchParams.get("error_description")).toMatch(/client_id/);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should sign the resolved PAR parameters for the login redirect", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, loginRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("request_uri", requestUri);
                                loginRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            loginRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("/login");
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("response_type=code");
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("scope=openid");
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("redirect_uri=".concat(encodeURIComponent(redirectUri)));
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("state=par-state");
                                (0, vitest_1.expect)(loginRedirectUrl).not.toContain("request_uri=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should drop reserved post-login markers from resolved PAR parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, loginRedirectUrl, loginRedirect;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("request_uri", requestUriWithPostLoginMarker);
                                loginRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            loginRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                loginRedirect = new URL(loginRedirectUrl, authServerBaseUrl);
                                (0, vitest_1.expect)(loginRedirect.pathname).toBe("/login");
                                (0, vitest_1.expect)(loginRedirect.searchParams.get(signed_query_1.postLoginClearedParam)).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * RFC 9126 §4: params must come from the stored request, not the URL.
                 * Extra URL params like prompt or scope must not leak into the signed redirect.
                 */
                (0, vitest_1.it)("should discard front-channel params not in the stored PAR request", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, loginRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("request_uri", requestUri);
                                // These params are NOT in the PAR payload — must be discarded
                                authUrl.searchParams.set("prompt", "none");
                                authUrl.searchParams.set("scope", "openid profile admin");
                                loginRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            loginRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("/login");
                                // PAR-resolved scope must win, not the URL-injected one
                                (0, vitest_1.expect)(loginRedirectUrl).toContain("scope=openid");
                                (0, vitest_1.expect)(loginRedirectUrl).not.toContain("admin");
                                // prompt=none was not in the PAR payload — must not appear
                                (0, vitest_1.expect)(loginRedirectUrl).not.toContain("prompt=none");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/9936
                 */
                (0, vitest_1.it)("should validate resolved PAR parameters through the authorization query schema", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, callbackRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("request_uri", requestUriWithInvalidMaxAge);
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("error=invalid_request");
                                (0, vitest_1.expect)(callbackRedirectUrl).not.toContain("/login");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/9936
                 */
                (0, vitest_1.it)("should accept valid PAR prompt values in any order", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, loginRedirectUrl, loginRedirect;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("request_uri", requestUriWithReorderedPrompt);
                                loginRedirectUrl = "";
                                return [4 /*yield*/, unauthenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            loginRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                loginRedirect = new URL(loginRedirectUrl, authServerBaseUrl);
                                (0, vitest_1.expect)(loginRedirect.pathname).toBe("/login");
                                (0, vitest_1.expect)(loginRedirect.searchParams.get("prompt")).toBe("consent login");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth authorize - authenticated", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, oauthClientNeedsConsent, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
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
                    var response, responseNeedsConsent;
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
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                oauthClient = response;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: false,
                                        },
                                    })];
                            case 2:
                                responseNeedsConsent = _a.sent();
                                (0, vitest_1.expect)(responseNeedsConsent === null || responseNeedsConsent === void 0 ? void 0 : responseNeedsConsent.client_id).toBeDefined();
                                (0, vitest_1.expect)(responseNeedsConsent === null || responseNeedsConsent === void 0 ? void 0 : responseNeedsConsent.user_id).toBeDefined();
                                (0, vitest_1.expect)(responseNeedsConsent === null || responseNeedsConsent === void 0 ? void 0 : responseNeedsConsent.client_secret).toBeDefined();
                                (0, vitest_1.expect)(responseNeedsConsent === null || responseNeedsConsent === void 0 ? void 0 : responseNeedsConsent.redirect_uris).toEqual([redirectUri]);
                                oauthClientNeedsConsent = responseNeedsConsent;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should authorize and include iss parameter", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "123",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 1:
                                authUrl = _a.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("iss=".concat(encodeURIComponent(authServerBaseUrl)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should include iss parameter in error responses", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "error-test-state");
                                errorRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("error=invalid_request");
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("pkce");
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("iss=");
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("iss=".concat(encodeURIComponent(authServerBaseUrl)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should return invalid_target for invalid resource with explicit description", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "invalid-resource-state");
                                authUrl.searchParams.set("resource", "https://resource.example.com");
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                errorRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            errorRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("error=invalid_target");
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("state=invalid-resource-state");
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("iss=".concat(encodeURIComponent(authServerBaseUrl)));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should have metadata issuer match iss parameter (RFC 9207)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var metadata, metadataIssuer, codeVerifier, authUrl, callbackRedirectUrl, redirectUrl, issParam;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, auth.api.getOpenIdConfig()];
                            case 1:
                                metadata = _a.sent();
                                metadataIssuer = metadata.issuer;
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                        },
                                        redirectURI: redirectUri,
                                        state: "issuer-match-test",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                authUrl = _a.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _a.sent();
                                redirectUrl = new URL(callbackRedirectUrl);
                                issParam = redirectUrl.searchParams.get("iss");
                                (0, vitest_1.expect)(issParam).toBe(metadataIssuer);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should return consent_required when prompt=none and consent is needed", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, callbackRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClientNeedsConsent === null || oauthClientNeedsConsent === void 0 ? void 0 : oauthClientNeedsConsent.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClientNeedsConsent.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "prompt-none-consent-required");
                                authUrl.searchParams.set("prompt", "none");
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("error=consent_required");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=prompt-none-consent-required");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("iss=".concat(encodeURIComponent(authServerBaseUrl)));
                                (0, vitest_1.expect)(callbackRedirectUrl).not.toContain("/consent");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/11481
                 */
                (0, vitest_1.it)("accepts consent through auth.api with headers only", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, consentRedirectUrl, consentUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClientNeedsConsent === null || oauthClientNeedsConsent === void 0 ? void 0 : oauthClientNeedsConsent.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClientNeedsConsent.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "server-consent");
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                consentRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            consentRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                consentUrl = new URL(consentRedirectUrl, authServerBaseUrl);
                                (0, vitest_1.expect)(consentUrl.pathname).toBe("/consent");
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.oauth2Consent({
                                        headers: new Headers(headers),
                                        body: {
                                            accept: true,
                                            oauth_query: consentUrl.searchParams.toString(),
                                        },
                                    })).resolves.toMatchObject({
                                        redirect: true,
                                        url: vitest_1.expect.stringContaining("".concat(redirectUri, "?code=")),
                                    })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth authorize - consented resources", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, validResource, secondValidResource, providerId, redirectUri, _a, auth, signInWithTestUser, customFetchImpl, _b, headers, user, client, oauthClientNeedsConsent;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                validResource = "https://api.example.com";
                secondValidResource = "https://api.secondary.example.com";
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                resources: [validResource, secondValidResource],
                                enforcePerClientResources: false,
                            }),
                            (0, jwt_1.jwt)(),
                            {
                                id: "createLegacyConsentTester",
                                endpoints: {
                                    testerCreateConsent: (0, api_1.createAuthEndpoint)("/server/oauth2/consent", {
                                        method: "POST",
                                        body: z.object({
                                            clientId: z.string(),
                                            scopes: z.array(z.string()),
                                            userId: z.string(),
                                            requestedUserInfoClaims: z.array(z.string()).optional(),
                                        }),
                                        use: [api_2.sessionMiddleware],
                                        metadata: {
                                            SERVER_ONLY: true,
                                        },
                                    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                        var iat;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    iat = Math.floor(Date.now() / 1000);
                                                    return [4 /*yield*/, ctx.context.adapter.create({
                                                            model: "oauthConsent",
                                                            data: __assign({ createdAt: new Date(iat * 1000), updatedAt: new Date(iat * 1000) }, ctx.body),
                                                        })];
                                                case 1: return [2 /*return*/, (_a.sent())];
                                            }
                                        });
                                    }); }),
                                },
                            },
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
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var responseNeedsConsent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: false,
                                    },
                                })];
                            case 1:
                                responseNeedsConsent = _a.sent();
                                (0, vitest_1.expect)(responseNeedsConsent === null || responseNeedsConsent === void 0 ? void 0 : responseNeedsConsent.client_id).toBeDefined();
                                oauthClientNeedsConsent = responseNeedsConsent;
                                return [4 /*yield*/, auth.api.testerCreateConsent({
                                        headers: headers,
                                        body: {
                                            clientId: responseNeedsConsent.client_id,
                                            userId: user.id,
                                            scopes: ["openid"],
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should re-prompt for consent when stored consent has no resources and a resource is requested", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, consentRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClientNeedsConsent === null || oauthClientNeedsConsent === void 0 ? void 0 : oauthClientNeedsConsent.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClientNeedsConsent.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "legacy-consent-no-resource");
                                authUrl.searchParams.set("resource", validResource);
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                consentRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            consentRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(consentRedirectUrl).toContain("/consent");
                                (0, vitest_1.expect)(consentRedirectUrl).not.toContain("".concat(redirectUri, "?code="));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should re-prompt for consent when stored consent has no requested UserInfo claim", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dedicatedClient, authUrl, consentRedirectUrl, consentUrl;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: false,
                                    },
                                })];
                            case 1:
                                dedicatedClient = _b.sent();
                                if (!(dedicatedClient === null || dedicatedClient === void 0 ? void 0 : dedicatedClient.client_id)) {
                                    throw Error("unable to create dedicated client");
                                }
                                return [4 /*yield*/, auth.api.testerCreateConsent({
                                        headers: headers,
                                        body: {
                                            clientId: dedicatedClient.client_id,
                                            userId: user.id,
                                            scopes: ["openid"],
                                        },
                                    })];
                            case 2:
                                _b.sent();
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", dedicatedClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "userinfo-claim-consent");
                                authUrl.searchParams.set("claims", JSON.stringify({
                                    userinfo: {
                                        email: null,
                                    },
                                }));
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                consentRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            consentRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _b.sent();
                                (0, vitest_1.expect)(consentRedirectUrl).toContain("/consent");
                                (0, vitest_1.expect)(consentRedirectUrl).not.toContain("".concat(redirectUri, "?code="));
                                consentUrl = new URL(consentRedirectUrl, authServerBaseUrl);
                                (0, vitest_1.expect)(JSON.parse((_a = consentUrl.searchParams.get("claims")) !== null && _a !== void 0 ? _a : "{}")).toEqual({
                                    userinfo: {
                                        email: null,
                                    },
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should persist multiple resource values onto OAuthConsent.resources", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var authUrl, consentRedirectUrl, consentResult, context, savedConsent;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClientNeedsConsent === null || oauthClientNeedsConsent === void 0 ? void 0 : oauthClientNeedsConsent.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClientNeedsConsent.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "multiple-resources-persist");
                                authUrl.searchParams.append("resource", validResource);
                                authUrl.searchParams.append("resource", secondValidResource);
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                consentRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            consentRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _c.sent();
                                (0, vitest_1.expect)(consentRedirectUrl).toContain("/consent");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRedirectUrl, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, client.oauth2.consent({
                                        accept: true,
                                    }, {
                                        throw: true,
                                    })];
                            case 2:
                                consentResult = _c.sent();
                                (0, vitest_1.expect)(consentResult.url).toContain("".concat(redirectUri, "?code="));
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                context = _c.sent();
                                return [4 /*yield*/, context.adapter.findOne({
                                        model: "oauthConsent",
                                        where: [
                                            {
                                                field: "clientId",
                                                value: oauthClientNeedsConsent.client_id,
                                            },
                                            {
                                                field: "userId",
                                                value: user.id,
                                            },
                                        ],
                                    })];
                            case 4:
                                savedConsent = _c.sent();
                                (0, vitest_1.expect)(savedConsent === null || savedConsent === void 0 ? void 0 : savedConsent.resources).toEqual([
                                    validResource,
                                    secondValidResource,
                                ]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should persist only accepted UserInfo claims onto OAuthConsent", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var dedicatedClient, authUrl, consentRedirectUrl, consentResult, context, savedConsent;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: false,
                                    },
                                })];
                            case 1:
                                dedicatedClient = _c.sent();
                                if (!(dedicatedClient === null || dedicatedClient === void 0 ? void 0 : dedicatedClient.client_id)) {
                                    throw Error("unable to create dedicated client");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", dedicatedClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "persist-userinfo-claims");
                                authUrl.searchParams.set("claims", JSON.stringify({
                                    userinfo: {
                                        name: null,
                                        email: null,
                                    },
                                }));
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                consentRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            consentRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _c.sent();
                                (0, vitest_1.expect)(consentRedirectUrl).toContain("/consent");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRedirectUrl, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, client.oauth2.consent({
                                        accept: true,
                                        claims: {
                                            userinfo: {
                                                name: null,
                                            },
                                        },
                                    }, {
                                        throw: true,
                                    })];
                            case 3:
                                consentResult = _c.sent();
                                (0, vitest_1.expect)(consentResult.url).toContain("".concat(redirectUri, "?code="));
                                return [4 /*yield*/, auth.$context];
                            case 4:
                                context = _c.sent();
                                return [4 /*yield*/, context.adapter.findOne({
                                        model: "oauthConsent",
                                        where: [
                                            {
                                                field: "clientId",
                                                value: dedicatedClient.client_id,
                                            },
                                            {
                                                field: "userId",
                                                value: user.id,
                                            },
                                        ],
                                    })];
                            case 5:
                                savedConsent = _c.sent();
                                (0, vitest_1.expect)(savedConsent === null || savedConsent === void 0 ? void 0 : savedConsent.requestedUserInfoClaims).toEqual(["name"]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should return consent_required for prompt=none when requested resource is not covered by prior consent", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var dedicatedClient, authUrl, callbackRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        skip_consent: false,
                                    },
                                })];
                            case 1:
                                dedicatedClient = _a.sent();
                                if (!(dedicatedClient === null || dedicatedClient === void 0 ? void 0 : dedicatedClient.client_id)) {
                                    throw Error("unable to create dedicated client");
                                }
                                return [4 /*yield*/, auth.api.testerCreateConsent({
                                        headers: headers,
                                        body: {
                                            clientId: dedicatedClient.client_id,
                                            userId: user.id,
                                            scopes: ["openid"],
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", dedicatedClient.client_id);
                                authUrl.searchParams.set("redirect_uri", redirectUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "prompt-none-resource-consent");
                                authUrl.searchParams.set("prompt", "none");
                                authUrl.searchParams.set("resource", validResource);
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("error=consent_required");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=prompt-none-resource-consent");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("iss=".concat(encodeURIComponent(authServerBaseUrl)));
                                (0, vitest_1.expect)(callbackRedirectUrl).not.toContain("/consent");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * Extends the default redirect URI validation with a `*.localhost` pattern that
 * must still match a registered `localhost` URI's port and path. Shared by the
 * sync and async `validateRedirectUri` suites below.
 */
var allowLocalhostSubdomain = function (uri, registeredUris, defaultResult) {
    if (defaultResult)
        return true;
    try {
        var url_1 = new URL(uri);
        if (url_1.hostname.endsWith(".localhost")) {
            return registeredUris.some(function (registered) {
                var registeredUrl = new URL(registered);
                return (registeredUrl.hostname === "localhost" &&
                    registeredUrl.port === url_1.port &&
                    registeredUrl.pathname === url_1.pathname);
            });
        }
    }
    catch (_a) {
        return false;
    }
    return false;
};
var allowPreviewRedirectUri = function (uri, _registeredUris, defaultResult) {
    if (defaultResult)
        return true;
    if (uri.includes("#"))
        return false;
    try {
        var url = new URL(uri);
        return (url.protocol === "https:" &&
            url.username === "" &&
            url.password === "" &&
            url.hostname.endsWith(".preview.example.com") &&
            url.port === "" &&
            url.pathname === "/api/auth/callback" &&
            url.search === "");
    }
    catch (_a) {
        return false;
    }
};
(0, vitest_1.describe)("oauth authorize - custom validateRedirectUri", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, registeredUri, previewUri, _a, auth, client, signInWithTestUser, headers, oauthClient, providerId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                registeredUri = "https://app.example.com/api/auth/callback";
                previewUri = "https://pr-123.preview.example.com/api/auth/callback";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                validateRedirectUri: allowPreviewRedirectUri,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                providerId = "test";
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [registeredUri],
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should accept redirect_uri matching custom validation logic", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                        },
                                        redirectURI: previewUri,
                                        state: "custom-validator-test",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 1:
                                authUrl = _a.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(previewUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=custom-validator-test");
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    {
                        name: "a different callback path",
                        uri: "https://pr-123.preview.example.com/other-callback",
                    },
                    {
                        name: "a query parameter",
                        uri: "https://pr-123.preview.example.com/api/auth/callback?next=/evil",
                    },
                    {
                        name: "an unexpected port",
                        uri: "https://pr-123.preview.example.com:8443/api/auth/callback",
                    },
                    {
                        name: "a lookalike host",
                        uri: "https://pr-123.preview.example.com.evil.test/api/auth/callback",
                    },
                ])("should reject $name in a preview redirect URI", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var authUrl, errorRedirectUrl;
                    var uri = _b.uri;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("redirect_uri", uri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "unauthorized-test");
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                errorRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            errorRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _c.sent();
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("error=invalid_redirect");
                                (0, vitest_1.expect)(errorRedirectUrl).not.toContain(uri);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should preserve a registered redirect URI", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("redirect_uri", registeredUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "unknown-scope");
                                errorRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            errorRedirectUrl = context.response.headers.get("location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirectUrl).toContain(registeredUri);
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("error=invalid_scope");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should forward early protocol errors to a custom-validated redirect_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("redirect_uri", previewUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "early-error-forwarding-test");
                                authUrl.searchParams.set("request", "some-request-object");
                                errorRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            errorRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirectUrl).toContain(previewUri);
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("error=request_not_supported");
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("state=early-error-forwarding-test");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth authorize - validateRedirectUri error handling", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, unregisteredThrowingUri, throwingValidator, _a, auth, client, signInWithTestUser, headers, oauthClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                unregisteredThrowingUri = "".concat(rpBaseUrl, "/throw-error-callback");
                throwingValidator = function (uri, _registeredUris, _defaultResult) {
                    if (uri.includes("throw-error")) {
                        throw new Error("Validator intentionally threw");
                    }
                    return uri === "".concat(rpBaseUrl, "/callback");
                };
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                validateRedirectUri: throwingValidator,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        // Only register /callback - NOT the throwing URI
                                        // This ensures default validation fails and custom validator is called
                                        redirect_uris: ["".concat(rpBaseUrl, "/callback")],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail closed when validator throws an exception", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                // Use unregistered URI that triggers throw - default validation fails first,
                                // then custom validator is called and throws
                                authUrl.searchParams.set("redirect_uri", unregisteredThrowingUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "validator-throws-test");
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                errorRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            errorRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("error=invalid_redirect");
                                (0, vitest_1.expect)(errorRedirectUrl).not.toContain("throw-error");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail closed in the error-forwarding path when validator throws", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authUrl, errorRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                                    throw Error("beforeAll not run properly");
                                }
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", oauthClient.client_id);
                                authUrl.searchParams.set("redirect_uri", unregisteredThrowingUri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("state", "error-path-throw-test");
                                authUrl.searchParams.set("request", "some-request-object");
                                errorRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            errorRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(errorRedirectUrl).toContain("error=request_not_supported");
                                (0, vitest_1.expect)(errorRedirectUrl).not.toContain("throw-error");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth authorize - async validateRedirectUri", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, asyncValidator, _a, auth, client, signInWithTestUser, headers, oauthClient, providerId, registeredUri, subdomainUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                asyncValidator = function (uri, registeredUris, defaultResult) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, allowLocalhostSubdomain(uri, registeredUris, defaultResult)];
                        }
                    });
                }); };
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                validateRedirectUri: asyncValidator,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                providerId = "test";
                registeredUri = "".concat(rpBaseUrl, "/callback");
                subdomainUri = "http://async-test.localhost:5000/callback";
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [registeredUri],
                                        application_type: "native",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                oauthClient = response;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should support async validator returning a Promise", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackRedirectUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                        },
                                        redirectURI: subdomainUri,
                                        state: "async-validator-test",
                                        scopes: ["openid"],
                                        responseType: "code",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 1:
                                authUrl = _a.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("async-test.localhost");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=async-validator-test");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://www.rfc-editor.org/rfc/rfc6749.html#section-3.1.2
 */
(0, vitest_1.describe)("oauth authorize - custom redirect URI safety", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, registeredUri, _a, auth, client, signInWithTestUser, headers, clientId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                registeredUri = "https://app.example.com/api/auth/callback";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                validateRedirectUri: function () { return true; },
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [registeredUri],
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                oauthClient = _a.sent();
                                clientId = oauthClient.client_id;
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    {
                        name: "a fragment",
                        uri: "https://pr-123.preview.example.com/api/auth/callback#fragment",
                    },
                    {
                        name: "userinfo",
                        uri: "https://user@pr-123.preview.example.com/api/auth/callback",
                    },
                    { name: "an unsafe scheme", uri: "javascript:alert(1)" },
                    {
                        name: "HTTP on a public host",
                        uri: "http://pr-123.preview.example.com/api/auth/callback",
                    },
                ])("does not forward early errors to a URI with $name", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var authUrl, location;
                    var uri = _b.uri;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", clientId);
                                authUrl.searchParams.set("redirect_uri", uri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("request", "unsupported-request-object");
                                location = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        redirect: "manual",
                                        onResponse: function (context) {
                                            location = context.response.headers.get("location") || "";
                                        },
                                    })];
                            case 1:
                                _c.sent();
                                (0, vitest_1.expect)(location).toContain("".concat(authServerBaseUrl, "/api/auth/error"));
                                (0, vitest_1.expect)(location).toContain("error=request_not_supported");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects userinfo in a parsed authorization request", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var uri, authUrl, location;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                uri = "https://user@pr-123.preview.example.com/api/auth/callback";
                                authUrl = new URL("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                authUrl.searchParams.set("client_id", clientId);
                                authUrl.searchParams.set("redirect_uri", uri);
                                authUrl.searchParams.set("response_type", "code");
                                authUrl.searchParams.set("scope", "openid");
                                authUrl.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                authUrl.searchParams.set("code_challenge_method", "S256");
                                location = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        redirect: "manual",
                                        onResponse: function (context) {
                                            location = context.response.headers.get("location") || "";
                                        },
                                    })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(location).toContain("".concat(authServerBaseUrl, "/api/auth/error"));
                                (0, vitest_1.expect)(location).toContain("error=invalid_redirect");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
