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
var oauth2_1 = require("@better-auth/core/oauth2");
var client_1 = require("better-auth/client");
var cookies_1 = require("better-auth/cookies");
var crypto_1 = require("better-auth/crypto");
var node_1 = require("better-auth/node");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var listhen_1 = require("listhen");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
(0, vitest_1.describe)("oauth logout", function () { return __awaiter(void 0, void 0, void 0, function () {
    function requestEndSession(input) {
        return __awaiter(this, void 0, void 0, function () {
            var method, url, _i, _a, _b, key, value, requestHeaders, body, response;
            var _c;
            var _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        method = (_d = input.method) !== null && _d !== void 0 ? _d : "GET";
                        url = new URL(endSessionEndpoint);
                        for (_i = 0, _a = Object.entries((_e = input.query) !== null && _e !== void 0 ? _e : {}); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            url.searchParams.set(key, value);
                        }
                        requestHeaders = new Headers(headers);
                        if (input.includeSessionCookie === false) {
                            requestHeaders.delete("cookie");
                        }
                        requestHeaders.set("accept", (_f = input.accept) !== null && _f !== void 0 ? _f : "text/html");
                        if (input.body) {
                            body = new URLSearchParams(input.body);
                            requestHeaders.set("content-type", "application/x-www-form-urlencoded");
                            requestHeaders.set("origin", (_g = input.origin) !== null && _g !== void 0 ? _g : baseUrl);
                        }
                        return [4 /*yield*/, customFetchImpl(url.toString(), {
                                method: method,
                                headers: requestHeaders,
                                body: body,
                                redirect: "manual",
                            })];
                    case 1:
                        response = _h.sent();
                        _c = { response: response };
                        return [4 /*yield*/, response.text()];
                    case 2: return [2 /*return*/, (_c.body = _h.sent(), _c)];
                }
            });
        });
    }
    function requestConfirmation(input) {
        return __awaiter(this, void 0, void 0, function () {
            var requestHeaders, response;
            var _a;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        requestHeaders = new Headers(headers);
                        requestHeaders.set("accept", (_b = input.accept) !== null && _b !== void 0 ? _b : "text/html");
                        requestHeaders.set("content-type", "application/x-www-form-urlencoded");
                        requestHeaders.set("origin", (_c = input.origin) !== null && _c !== void 0 ? _c : baseUrl);
                        return [4 /*yield*/, customFetchImpl(confirmationEndpoint, {
                                method: "POST",
                                headers: requestHeaders,
                                body: new URLSearchParams((_d = input.body) !== null && _d !== void 0 ? _d : { action: "confirm" }),
                                redirect: "manual",
                            })];
                    case 1:
                        response = _e.sent();
                        _a = { response: response };
                        return [4 /*yield*/, response.text()];
                    case 2: return [2 /*return*/, (_a.body = _e.sent(), _a)];
                }
            });
        });
    }
    function captureResponseCookies(response) {
        cookieSetter(headers)({ response: response });
    }
    function getConfirmationCookie(response) {
        var _a;
        var setCookies = (0, cookies_1.parseSetCookieHeader)((_a = response.headers.get("set-cookie")) !== null && _a !== void 0 ? _a : "");
        var entry = Array.from(setCookies.entries()).find(function (_a) {
            var name = _a[0];
            return name.endsWith(".oauth_logout_confirmation");
        });
        if (!entry)
            throw new Error("confirmation cookie was not set");
        return { name: entry[0], value: entry[1].value };
    }
    function replaceCookie(target, name, value) {
        var _a;
        var cookies = (0, cookies_1.parseCookies)((_a = target.get("cookie")) !== null && _a !== void 0 ? _a : "");
        cookies.set(name, value);
        target.set("cookie", Array.from(cookies, function (_a) {
            var cookieName = _a[0], cookieValue = _a[1];
            return "".concat(cookieName, "=").concat(encodeURIComponent(cookieValue));
        }).join("; "));
    }
    function completeBrowserConfirmation(input) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmation, completed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, requestEndSession({
                            query: input.query,
                            accept: "text/html",
                        })];
                    case 1:
                        confirmation = _a.sent();
                        captureResponseCookies(confirmation.response);
                        (0, vitest_1.expect)(confirmation.response.status).toBe(200);
                        (0, vitest_1.expect)(confirmation.response.headers.get("cache-control")).toBe("no-store");
                        (0, vitest_1.expect)(confirmation.response.headers.get("content-security-policy")).toBe("default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
                        (0, vitest_1.expect)(confirmation.body).toContain("Confirm logout");
                        return [4 /*yield*/, requestConfirmation({
                                accept: "text/html",
                            })];
                    case 2:
                        completed = _a.sent();
                        return [2 /*return*/, { confirmation: confirmation, completed: completed }];
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
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)(__assign({ id: providerId, options: __assign({ clientId: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id, clientSecret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret, redirectURI: redirectUri }, overrides === null || overrides === void 0 ? void 0 : overrides.options), redirectURI: "", authorizationEndpoint: "".concat(baseUrl, "/api/auth/oauth2/authorize"), state: state, scopes: ["openid", "profile", "email", "offline_access"], codeVerifier: codeVerifier }, overrides))];
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
                        return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)(__assign(__assign({}, overrides), { redirectURI: redirectUri, options: __assign({ clientId: oauthClient.client_id, clientSecret: oauthClient.client_secret, redirectURI: redirectUri }, overrides.options) }))];
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
    function issueTokens() {
        return __awaiter(this, arguments, void 0, function (input) {
            var registeredClient, codeVerifier, authUrl, callbackRedirectUrl, callback;
            var _a, _b, _c;
            if (input === void 0) { input = {}; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        registeredClient = (_a = input.client) !== null && _a !== void 0 ? _a : oauthClient;
                        if (!(registeredClient === null || registeredClient === void 0 ? void 0 : registeredClient.client_id) || !registeredClient.client_secret) {
                            throw Error("beforeAll not run properly");
                        }
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                id: providerId,
                                options: {
                                    clientId: registeredClient.client_id,
                                    clientSecret: registeredClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                redirectURI: "",
                                authorizationEndpoint: "".concat(baseUrl, "/api/auth/oauth2/authorize"),
                                state: state,
                                scopes: (_b = input.scopes) !== null && _b !== void 0 ? _b : scopes,
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        authUrl = _d.sent();
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                headers: (_c = input.headers) !== null && _c !== void 0 ? _c : headers,
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _d.sent();
                        callback = new URL(callbackRedirectUrl);
                        return [2 /*return*/, validateAuthCode({
                                code: callback.searchParams.get("code"),
                                codeVerifier: codeVerifier,
                                options: {
                                    clientId: registeredClient.client_id,
                                    clientSecret: registeredClient.client_secret,
                                },
                            })];
                }
            });
        });
    }
    function createLogoutRedirectClient() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                redirect_uris: [redirectUri],
                                application_type: "native",
                                token_endpoint_auth_method: "client_secret_post",
                                enable_end_session: true,
                                skip_consent: true,
                                post_logout_redirect_uris: [logoutRedirectUri],
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        if (!(response === null || response === void 0 ? void 0 : response.client_id) || !response.client_secret) {
                            throw Error("logout redirect client registration failed");
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    }
    var port, baseUrl, rpBaseUrl, state, scopes, _a, auth, signInWithTestUser, customFetchImpl, cookieSetter, headers, client, oauthClient, server, providerId, redirectUri, logoutRedirectUri, endSessionEndpoint, confirmationEndpoint;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                port = 3004;
                baseUrl = "http://localhost:".concat(port);
                rpBaseUrl = "http://localhost:5000";
                state = "123";
                scopes = ["openid", "email", "profile", "offline_access"];
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        advanced: {
                            disableOriginCheck: false,
                        },
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                scopes: scopes,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl, cookieSetter = _a.cookieSetter;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                headers.set("origin", baseUrl);
                client = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                logoutRedirectUri = "".concat(rpBaseUrl, "/api/auth/callback/logout");
                endSessionEndpoint = "".concat(baseUrl, "/api/auth/oauth2/end-session");
                confirmationEndpoint = "".concat(endSessionEndpoint, "/confirm");
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
                                        enable_end_session: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.enable_end_session).toEqual(true);
                                oauthClient = response;
                                return [4 /*yield*/, (0, listhen_1.listen)((0, node_1.toNodeHandler)(auth.handler), {
                                        port: port,
                                    })];
                            case 2:
                                server = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!server) return [3 /*break*/, 2];
                                return [4 /*yield*/, server.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                // Login again after each test
                (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _headers;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                _headers = (_a.sent()).headers;
                                _headers.set("origin", baseUrl);
                                headers = _headers;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail with invalid id_token_hint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var logoutRes;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.oauth2.endSession({
                                    query: {
                                        id_token_hint: "",
                                    },
                                })];
                            case 1:
                                logoutRes = _c.sent();
                                (0, vitest_1.expect)((_a = logoutRes.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = logoutRes.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("requires confirmation before deleting the session without a hint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var before, _a, confirmation, completed, after;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 1:
                                before = _b.sent();
                                (0, vitest_1.expect)(before).not.toBeNull();
                                return [4 /*yield*/, completeBrowserConfirmation({})];
                            case 2:
                                _a = _b.sent(), confirmation = _a.confirmation, completed = _a.completed;
                                (0, vitest_1.expect)(confirmation.body).toContain('<form method="post" data-oidc-logout-confirmation');
                                (0, vitest_1.expect)(confirmation.body).toContain('name="action" value="confirm"');
                                (0, vitest_1.expect)(completed.response.status).toBe(200);
                                (0, vitest_1.expect)(completed.response.headers.get("cache-control")).toBe("no-store");
                                (0, vitest_1.expect)(completed.response.headers.get("content-security-policy")).toBe("default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
                                (0, vitest_1.expect)(completed.body).toContain('data-oidc-logout-state="logged-out"');
                                (0, vitest_1.expect)(completed.body).toContain("Logged out");
                                (0, vitest_1.expect)(completed.response.headers.get("location")).toBeNull();
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 3:
                                after = _b.sent();
                                (0, vitest_1.expect)(after).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("does not delete on an initial no-hint POST", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, requestEndSession({
                                    method: "POST",
                                    body: {},
                                    accept: "text/html",
                                })];
                            case 1:
                                result = _b.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.body).toContain("data-oidc-logout-confirmation");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("confirms a no-hint form POST when the initial navigation omits the session cookie", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sessionHeaders, initial, _a, completed, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                sessionHeaders = new Headers(headers);
                                return [4 /*yield*/, requestEndSession({
                                        method: "POST",
                                        body: {},
                                        accept: "text/html",
                                        includeSessionCookie: false,
                                        origin: "https://rp.example",
                                    })];
                            case 1:
                                initial = _c.sent();
                                (0, vitest_1.expect)(initial.response.status).toBe(200);
                                (0, vitest_1.expect)(initial.body).toContain('<form method="post" data-oidc-logout-confirmation');
                                (0, vitest_1.expect)(initial.body).not.toContain('data-oidc-logout-state="logged-out"');
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: sessionHeaders })];
                            case 2:
                                _a.apply(void 0, [_c.sent()]).not.toBeNull();
                                captureResponseCookies(initial.response);
                                return [4 /*yield*/, requestConfirmation({ accept: "text/html" })];
                            case 3:
                                completed = _c.sent();
                                (0, vitest_1.expect)(completed.response.status).toBe(200);
                                (0, vitest_1.expect)(completed.body).toContain('data-oidc-logout-state="logged-out"');
                                _b = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: sessionHeaders })];
                            case 4:
                                _b.apply(void 0, [_c.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("does not delete when the confirmation state is missing or tampered", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confirmation, missingState, _a, confirmationCookie, tamperedState, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, requestEndSession({ accept: "text/html" })];
                            case 1:
                                confirmation = _c.sent();
                                (0, vitest_1.expect)(confirmation.body).toContain("data-oidc-logout-confirmation");
                                return [4 /*yield*/, requestConfirmation({ accept: "text/html" })];
                            case 2:
                                missingState = _c.sent();
                                (0, vitest_1.expect)(missingState.response.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)(missingState.response.headers.get("cache-control")).toBe("no-store");
                                (0, vitest_1.expect)(missingState.response.headers.get("content-security-policy")).toBe("default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 3:
                                _a.apply(void 0, [_c.sent()]).not.toBeNull();
                                captureResponseCookies(confirmation.response);
                                confirmationCookie = getConfirmationCookie(confirmation.response);
                                replaceCookie(headers, confirmationCookie.name, "tampered");
                                return [4 /*yield*/, requestConfirmation({ accept: "text/html" })];
                            case 4:
                                tamperedState = _c.sent();
                                (0, vitest_1.expect)(tamperedState.response.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)(tamperedState.response.headers.get("cache-control")).toBe("no-store");
                                _b = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 5:
                                _b.apply(void 0, [_c.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("rejects confirmation state bound to a different current session", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confirmation, confirmationCookie, otherSession, originalHeaders, result, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, requestEndSession({ accept: "text/html" })];
                            case 1:
                                confirmation = _c.sent();
                                captureResponseCookies(confirmation.response);
                                confirmationCookie = getConfirmationCookie(confirmation.response);
                                return [4 /*yield*/, signInWithTestUser()];
                            case 2:
                                otherSession = _c.sent();
                                originalHeaders = headers;
                                (0, cookies_1.applySetCookies)(otherSession.headers, [
                                    "".concat(confirmationCookie.name, "=").concat(encodeURIComponent(confirmationCookie.value), "; Path=/"),
                                ]);
                                headers = otherSession.headers;
                                _c.label = 3;
                            case 3:
                                _c.trys.push([3, , 7, 8]);
                                return [4 /*yield*/, requestConfirmation({ accept: "text/html" })];
                            case 4:
                                result = _c.sent();
                                (0, vitest_1.expect)(result.response.status).toBeGreaterThanOrEqual(400);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: originalHeaders })];
                            case 5:
                                _a.apply(void 0, [_c.sent()]).not.toBeNull();
                                _b = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: otherSession.headers })];
                            case 6:
                                _b.apply(void 0, [_c.sent()]).not.toBeNull();
                                return [3 /*break*/, 8];
                            case 7:
                                headers = originalHeaders;
                                return [7 /*endfinally*/];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("rejects a cross-origin confirmation POST", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var confirmation, result, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, requestEndSession({ accept: "text/html" })];
                            case 1:
                                confirmation = _b.sent();
                                captureResponseCookies(confirmation.response);
                                return [4 /*yield*/, requestConfirmation({
                                        accept: "text/html",
                                        origin: "https://attacker.example",
                                    })];
                            case 2:
                                result = _b.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(403);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 3:
                                _a.apply(void 0, [_b.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#Redirection
                 */
                (0, vitest_1.it)("does not redirect or delete for a redirect request without a hint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, requestEndSession({
                                    query: { post_logout_redirect_uri: logoutRedirectUri },
                                    accept: "text/html",
                                })];
                            case 1:
                                result = _b.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.response.headers.get("location")).toBeNull();
                                (0, vitest_1.expect)(result.body).toContain("data-oidc-logout-confirmation");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("redirects after confirming a no-hint request for an identified client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var redirectClient, confirmation, completed, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, createLogoutRedirectClient()];
                            case 1:
                                redirectClient = _b.sent();
                                return [4 /*yield*/, requestEndSession({
                                        query: {
                                            client_id: redirectClient.client_id,
                                            post_logout_redirect_uri: logoutRedirectUri,
                                            state: "confirmed-state",
                                        },
                                        accept: "text/html",
                                    })];
                            case 2:
                                confirmation = _b.sent();
                                captureResponseCookies(confirmation.response);
                                (0, vitest_1.expect)(confirmation.response.status).toBe(200);
                                (0, vitest_1.expect)(confirmation.response.headers.get("location")).toBeNull();
                                (0, vitest_1.expect)(confirmation.body).toContain("data-oidc-logout-confirmation");
                                return [4 /*yield*/, requestConfirmation({ accept: "text/html" })];
                            case 3:
                                completed = _b.sent();
                                (0, vitest_1.expect)(completed.response.status).toBe(302);
                                (0, vitest_1.expect)(completed.response.headers.get("location")).toBe("".concat(logoutRedirectUri, "?state=confirmed-state"));
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 4:
                                _a.apply(void 0, [_b.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#Redirection
                 */
                (0, vitest_1.it)("revalidates a no-hint redirect before completing confirmation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var redirectClient, confirmation, context, completed, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, createLogoutRedirectClient()];
                            case 1:
                                redirectClient = _b.sent();
                                return [4 /*yield*/, requestEndSession({
                                        query: {
                                            client_id: redirectClient.client_id,
                                            post_logout_redirect_uri: logoutRedirectUri,
                                            state: "stale-registration-state",
                                        },
                                        accept: "text/html",
                                    })];
                            case 2:
                                confirmation = _b.sent();
                                captureResponseCookies(confirmation.response);
                                (0, vitest_1.expect)(confirmation.response.status).toBe(200);
                                (0, vitest_1.expect)(confirmation.response.headers.get("location")).toBeNull();
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                context = _b.sent();
                                return [4 /*yield*/, context.adapter.update({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: redirectClient.client_id }],
                                        update: { postLogoutRedirectUris: [] },
                                    })];
                            case 4:
                                _b.sent();
                                return [4 /*yield*/, requestConfirmation({ accept: "text/html" })];
                            case 5:
                                completed = _b.sent();
                                (0, vitest_1.expect)(completed.response.status).toBe(200);
                                (0, vitest_1.expect)(completed.response.headers.get("location")).toBeNull();
                                (0, vitest_1.expect)(completed.body).toContain('data-oidc-logout-state="logged-out"');
                                (0, vitest_1.expect)(completed.body).toContain("The requested post-logout redirect was not registered.");
                                (0, vitest_1.expect)(completed.body).not.toContain("stale-registration-state");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 6:
                                _a.apply(void 0, [_b.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("requires confirmation for a state-only request", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, requestEndSession({
                                    query: { state: "opaque-state" },
                                    accept: "text/html",
                                })];
                            case 1:
                                result = _b.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.response.headers.get("location")).toBeNull();
                                (0, vitest_1.expect)(result.body).toContain("data-oidc-logout-confirmation");
                                (0, vitest_1.expect)(result.body).not.toContain("opaque-state");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("rejects alg=none hints as controlled errors", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var hint, result, _a;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                hint = new jose_1.UnsecuredJWT({ sid: "not-a-session" })
                                    .setIssuer(baseUrl)
                                    .setAudience(oauthClient.client_id)
                                    .encode();
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: { id_token_hint: hint },
                                    })];
                            case 1:
                                result = _d.sent();
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_c = result.error) === null || _c === void 0 ? void 0 : _c.status).toBeLessThan(500);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 2:
                                _a.apply(void 0, [_d.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#Validation
                 */
                (0, vitest_1.it)("offers confirmation for an invalid hint without an unsafe redirect", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, requestEndSession({
                                    query: {
                                        id_token_hint: "not-a-jwt",
                                        post_logout_redirect_uri: "https://evil.example/logout",
                                    },
                                    accept: "text/html",
                                })];
                            case 1:
                                result = _b.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.response.headers.get("location")).toBeNull();
                                (0, vitest_1.expect)(result.body).toContain("data-oidc-logout-confirmation");
                                (0, vitest_1.expect)(result.body).not.toContain("evil.example");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-core-1_0.html#IDToken
                 */
                (0, vitest_1.it)("does not fan out client lookups across unverified hint audiences", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var context, lookup, hint, result, clientLookups;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.$context];
                            case 1:
                                context = _a.sent();
                                lookup = vitest_1.vi.spyOn(context.adapter, "findOne");
                                hint = new jose_1.UnsecuredJWT({ sid: "not-a-session", sub: "test-user" })
                                    .setIssuer(baseUrl)
                                    .setAudience(Array.from({ length: 100 }, function (_, index) { return "unknown-client-".concat(index); }))
                                    .encode();
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, , 4, 5]);
                                return [4 /*yield*/, requestEndSession({
                                        query: { id_token_hint: hint },
                                        accept: "text/html",
                                    })];
                            case 3:
                                result = _a.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.body).toContain("data-oidc-logout-confirmation");
                                clientLookups = lookup.mock.calls.filter(function (_a) {
                                    var query = _a[0];
                                    return query.model === "oauthClient";
                                });
                                (0, vitest_1.expect)(clientLookups).toHaveLength(0);
                                return [3 /*break*/, 5];
                            case 4:
                                lookup.mockRestore();
                                return [7 /*endfinally*/];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-core-1_0.html#IDToken
                 */
                (0, vitest_1.it)("resolves a valid multi-audience logout hint through azp", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, payload, hint, result, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, issueTokens()];
                            case 1:
                                tokens = _c.sent();
                                payload = (0, jose_1.decodeJwt)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.id_token);
                                return [4 /*yield*/, auth.api.signJWT({
                                        body: {
                                            payload: __assign(__assign({}, payload), { aud: [oauthClient.client_id, "https://other-audience.example"], azp: oauthClient.client_id }),
                                        },
                                    })];
                            case 2:
                                hint = _c.sent();
                                return [4 /*yield*/, requestEndSession({
                                        query: { id_token_hint: hint.token },
                                        accept: "text/html",
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.body).toContain('data-oidc-logout-state="logged-out"');
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 4:
                                _a.apply(void 0, [_c.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not allow registration of rp-initiated clients, specifically enable_end_session", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, client.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    application_type: "native",
                                    post_logout_redirect_uris: [logoutRedirectUri],
                                    // @ts-expect-error only through adminCreateOAuthClient
                                    enable_end_session: true,
                                }, {
                                    headers: headers,
                                })];
                            case 1:
                                response = _g.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.user_id).toBeDefined();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_d = response === null || response === void 0 ? void 0 : response.data) === null || _d === void 0 ? void 0 : _d.redirect_uris).toEqual([redirectUri]);
                                (0, vitest_1.expect)((_e = response.data) === null || _e === void 0 ? void 0 : _e.post_logout_redirect_uris).toEqual([
                                    logoutRedirectUri,
                                ]);
                                (0, vitest_1.expect)((_f = response.data) === null || _f === void 0 ? void 0 : _f.enable_end_session).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail for clients without enable_end_session access", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, _a, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken, logoutRes;
                    var _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
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
                                response = _j.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.enable_end_session).toBeUndefined();
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                        options: {
                                            clientId: response.client_id,
                                            clientSecret: response.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 2:
                                _a = _j.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _j.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                        options: {
                                            clientId: response.client_id,
                                            clientSecret: response.client_secret,
                                        },
                                    })];
                            case 4:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined(); // Note: Opaque
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.scope).toBe(scopes.join(" "));
                                idToken = (0, jose_1.decodeJwt)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.id_token);
                                (0, vitest_1.expect)(idToken.sid).toBeUndefined();
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: {
                                            id_token_hint: (_g = tokens.data) === null || _g === void 0 ? void 0 : _g.id_token,
                                        },
                                    })];
                            case 5:
                                logoutRes = _j.sent();
                                (0, vitest_1.expect)((_h = logoutRes.error) === null || _h === void 0 ? void 0 : _h.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass for clients with enable_end_session access", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken, sessionId, sessionBefore, logoutRes, sessionAfter;
                    var _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, createAuthUrl({
                                    scopes: scopes,
                                })];
                            case 1:
                                _a = _j.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _j.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 3:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined(); // Note: Opaque
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.scope).toBe(scopes.join(" "));
                                idToken = (0, jose_1.decodeJwt)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.id_token);
                                sessionId = idToken.sid;
                                (0, vitest_1.expect)(sessionId).toBeDefined();
                                return [4 /*yield*/, client.getSession({
                                        fetchOptions: {
                                            headers: headers,
                                        },
                                    })];
                            case 4:
                                sessionBefore = _j.sent();
                                (0, vitest_1.expect)((_g = sessionBefore.data) === null || _g === void 0 ? void 0 : _g.session.id).toBe(sessionId);
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: {
                                            id_token_hint: (_h = tokens.data) === null || _h === void 0 ? void 0 : _h.id_token,
                                        },
                                    })];
                            case 5:
                                logoutRes = _j.sent();
                                (0, vitest_1.expect)(logoutRes.data).toBeNull();
                                (0, vitest_1.expect)(logoutRes.error).toBeNull();
                                return [4 /*yield*/, client.getSession({
                                        fetchOptions: {
                                            headers: headers,
                                        },
                                    })];
                            case 6:
                                sessionAfter = _j.sent();
                                (0, vitest_1.expect)(sessionAfter.data).toBeNull();
                                (0, vitest_1.expect)(sessionAfter.error).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("supports a valid hint in a form POST", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, result, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, issueTokens()];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, requestEndSession({
                                        method: "POST",
                                        body: { id_token_hint: (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.id_token },
                                        accept: "application/json",
                                    })];
                            case 2:
                                result = _c.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.response.headers.get("location")).toBeNull();
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 3:
                                _a.apply(void 0, [_c.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("supports a valid hint through the generated client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, logoutRes, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, issueTokens()];
                            case 1:
                                tokens = _c.sent();
                                return [4 /*yield*/, client.oauth2.endSession({
                                        id_token_hint: (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.id_token,
                                    })];
                            case 2:
                                logoutRes = _c.sent();
                                if (logoutRes.error) {
                                    (0, vitest_1.expect)(logoutRes.error.status).toBe(302);
                                }
                                else {
                                    (0, vitest_1.expect)(logoutRes.data).toBeNull();
                                }
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 3:
                                _a.apply(void 0, [_c.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("logs out a valid hinted session without browser cookies", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, requestHeaders, result, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, issueTokens()];
                            case 1:
                                tokens = _c.sent();
                                requestHeaders = new Headers({ accept: "application/json" });
                                return [4 /*yield*/, customFetchImpl("".concat(endSessionEndpoint, "?id_token_hint=").concat(encodeURIComponent((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.id_token)), { headers: requestHeaders })];
                            case 2:
                                result = _c.sent();
                                (0, vitest_1.expect)(result.status).toBe(200);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 3:
                                _a.apply(void 0, [_c.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#RPLogout
                 */
                (0, vitest_1.it)("requires confirmation when a valid hint conflicts with the current session", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var currentHeaders, otherSignIn, otherTokens, result, _a, _b;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                currentHeaders = new Headers(headers);
                                return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                otherSignIn = _d.sent();
                                return [4 /*yield*/, issueTokens({ headers: otherSignIn.headers })];
                            case 2:
                                otherTokens = _d.sent();
                                headers = currentHeaders;
                                return [4 /*yield*/, requestEndSession({
                                        query: { id_token_hint: (_c = otherTokens.data) === null || _c === void 0 ? void 0 : _c.id_token },
                                        accept: "text/html",
                                    })];
                            case 3:
                                result = _d.sent();
                                captureResponseCookies(result.response);
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.body).toContain("data-oidc-logout-confirmation");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 4:
                                _a.apply(void 0, [_d.sent()]).not.toBeNull();
                                _b = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: otherSignIn.headers })];
                            case 5:
                                _b.apply(void 0, [_d.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#Validation
                 */
                (0, vitest_1.it)("rejects a bad signed hint without deleting the session", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, idToken, _a, header, payload, signature, replacement, badHint, result, _b;
                    var _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, issueTokens()];
                            case 1:
                                tokens = _f.sent();
                                idToken = (_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token;
                                _a = idToken.split("."), header = _a[0], payload = _a[1], signature = _a[2];
                                replacement = (signature === null || signature === void 0 ? void 0 : signature[0]) === "A" ? "B" : "A";
                                badHint = [
                                    header,
                                    payload,
                                    "".concat(replacement).concat(signature === null || signature === void 0 ? void 0 : signature.slice(1)),
                                ].join(".");
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: { id_token_hint: badHint },
                                    })];
                            case 2:
                                result = _f.sent();
                                (0, vitest_1.expect)((_d = result.error) === null || _d === void 0 ? void 0 : _d.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_e = result.error) === null || _e === void 0 ? void 0 : _e.status).toBeLessThan(500);
                                _b = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 3:
                                _b.apply(void 0, [_f.sent()]).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#Redirection
                 */
                (0, vitest_1.it)("logs out and suppresses an unregistered post-logout redirect", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var redirectClient, tokens, result, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createLogoutRedirectClient()];
                            case 1:
                                redirectClient = _c.sent();
                                return [4 /*yield*/, issueTokens({ client: redirectClient })];
                            case 2:
                                tokens = _c.sent();
                                return [4 /*yield*/, requestEndSession({
                                        query: {
                                            id_token_hint: (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.id_token,
                                            post_logout_redirect_uri: "https://evil.example/logout",
                                        },
                                        accept: "text/html",
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.response.headers.get("location")).toBeNull();
                                (0, vitest_1.expect)(result.body).toContain('data-oidc-logout-state="logged-out"');
                                (0, vitest_1.expect)(result.body).toContain("Logged out");
                                (0, vitest_1.expect)(result.body).not.toContain("evil.example");
                                (0, vitest_1.expect)(result.body).not.toContain("attacker");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 4:
                                _a.apply(void 0, [_c.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#Redirection
                 */
                (0, vitest_1.it)("logs out and suppresses a query-added post-logout redirect", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var redirectClient, tokens, result, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createLogoutRedirectClient()];
                            case 1:
                                redirectClient = _c.sent();
                                return [4 /*yield*/, issueTokens({ client: redirectClient })];
                            case 2:
                                tokens = _c.sent();
                                return [4 /*yield*/, requestEndSession({
                                        query: {
                                            id_token_hint: (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.id_token,
                                            post_logout_redirect_uri: "".concat(logoutRedirectUri, "?attacker=1"),
                                        },
                                        accept: "text/html",
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)(result.response.status).toBe(200);
                                (0, vitest_1.expect)(result.response.headers.get("location")).toBeNull();
                                (0, vitest_1.expect)(result.body).toContain('data-oidc-logout-state="logged-out"');
                                (0, vitest_1.expect)(result.body).toContain("Logged out");
                                (0, vitest_1.expect)(result.body).not.toContain("attacker");
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 4:
                                _a.apply(void 0, [_c.sent()]).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html#Validation
                 */
                (0, vitest_1.it)("surfaces session deletion failures without redirecting as successful", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var tokens, context, deletion, result, _a;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, issueTokens()];
                            case 1:
                                tokens = _e.sent();
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                context = _e.sent();
                                deletion = vitest_1.vi
                                    .spyOn(context.internalAdapter, "deleteSession")
                                    .mockRejectedValue(new Error("adapter failure"));
                                _e.label = 3;
                            case 3:
                                _e.trys.push([3, , 6, 7]);
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: { id_token_hint: (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.id_token },
                                    })];
                            case 4:
                                result = _e.sent();
                                (0, vitest_1.expect)((_c = result.error) === null || _c === void 0 ? void 0 : _c.status).toBeGreaterThanOrEqual(500);
                                (0, vitest_1.expect)((_d = result.error) === null || _d === void 0 ? void 0 : _d.status).toBeLessThan(600);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 5:
                                _a.apply(void 0, [_e.sent()]).not.toBeNull();
                                return [3 /*break*/, 7];
                            case 6:
                                deletion.mockRestore();
                                return [7 /*endfinally*/];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass with redirection", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, _a, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken, sessionId, logoutRedirectRes, logoutRes;
                    var _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        enable_end_session: true,
                                        skip_consent: true,
                                        post_logout_redirect_uris: [logoutRedirectUri],
                                    },
                                })];
                            case 1:
                                response = _j.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                (0, vitest_1.expect)(response.post_logout_redirect_uris).toEqual([logoutRedirectUri]);
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.enable_end_session).toBe(true);
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                        options: {
                                            clientId: response.client_id,
                                            clientSecret: response.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 2:
                                _a = _j.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _j.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                        options: {
                                            clientId: response.client_id,
                                            clientSecret: response.client_secret,
                                        },
                                    })];
                            case 4:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined(); // Note: Opaque
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.scope).toBe(scopes.join(" "));
                                idToken = (0, jose_1.decodeJwt)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.id_token);
                                sessionId = idToken.sid;
                                (0, vitest_1.expect)(sessionId).toBeDefined();
                                logoutRedirectRes = "";
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: {
                                            id_token_hint: (_g = tokens.data) === null || _g === void 0 ? void 0 : _g.id_token,
                                            post_logout_redirect_uri: logoutRedirectUri,
                                            state: "123",
                                        },
                                    }, {
                                        onResponse: function (ctx) {
                                            logoutRedirectRes = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                logoutRes = _j.sent();
                                (0, vitest_1.expect)(logoutRedirectRes).toContain(logoutRedirectUri);
                                (0, vitest_1.expect)(logoutRedirectRes).toContain("state=123");
                                (0, vitest_1.expect)((_h = logoutRes.error) === null || _h === void 0 ? void 0 : _h.status).toBe(302);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth logout confirmation with a custom base path", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, basePath, _a, auth, client, signInWithTestUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = "http://localhost:3006";
                basePath = "/custom/auth";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        basePath: basePath,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["openid"],
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    }, {
                        clientOptions: {
                            plugins: [(0, client_2.oauthProviderClient)()],
                        },
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                (0, vitest_1.it)("uses the custom base path for confirmation navigation and cookies", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, response, body, confirmationURL, cookies, confirmationCookie;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_c.sent()).headers;
                                return [4 /*yield*/, auth.handler(new Request("".concat(baseUrl).concat(basePath, "/oauth2/end-session"), {
                                        headers: {
                                            accept: "text/html",
                                            cookie: (_a = headers.get("cookie")) !== null && _a !== void 0 ? _a : "",
                                        },
                                    }))];
                            case 2:
                                response = _c.sent();
                                return [4 /*yield*/, response.text()];
                            case 3:
                                body = _c.sent();
                                confirmationURL = "".concat(baseUrl).concat(basePath, "/oauth2/end-session/confirm");
                                (0, vitest_1.expect)(response.status).toBe(200);
                                (0, vitest_1.expect)(body).toContain("action=\"".concat(confirmationURL, "\""));
                                cookies = (0, cookies_1.parseSetCookieHeader)((_b = response.headers.get("set-cookie")) !== null && _b !== void 0 ? _b : "");
                                confirmationCookie = Array.from(cookies.entries()).find(function (_a) {
                                    var name = _a[0];
                                    return name.endsWith(".oauth_logout_confirmation");
                                });
                                (0, vitest_1.expect)(confirmationCookie === null || confirmationCookie === void 0 ? void 0 : confirmationCookie[1].path).toBe("".concat(basePath, "/oauth2/end-session/confirm"));
                                // @ts-expect-error HTTP-scoped endpoints are excluded from the server API.
                                auth.api.oauth2EndSessionConfirmation;
                                // @ts-expect-error HTTP-scoped endpoints are excluded from generated clients.
                                client.oauth2.endSessionConfirmation;
                                if (false) {
                                    // @ts-expect-error The internal confirmation action is not public logout input.
                                    client.oauth2.endSession({ action: "confirm" });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth logout - disableJwtPlugin", function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)(__assign({ id: providerId, options: __assign({ clientId: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id, clientSecret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret, redirectURI: redirectUri }, overrides === null || overrides === void 0 ? void 0 : overrides.options), redirectURI: "", authorizationEndpoint: "".concat(baseUrl, "/api/auth/oauth2/authorize"), state: state, scopes: ["openid", "profile", "email", "offline_access"], codeVerifier: codeVerifier }, overrides))];
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
                        return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)(__assign(__assign({}, overrides), { redirectURI: redirectUri, options: __assign({ clientId: oauthClient.client_id, clientSecret: oauthClient.client_secret, redirectURI: redirectUri }, overrides.options) }))];
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
    var port, baseUrl, rpBaseUrl, state, scopes, _a, auth, signInWithTestUser, customFetchImpl, headers, client, oauthClient, server, providerId, redirectUri, logoutRedirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                port = 3005;
                baseUrl = "http://localhost:".concat(port);
                rpBaseUrl = "http://localhost:5000";
                state = "123";
                scopes = ["openid", "email", "profile", "offline_access"];
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                disableJwtPlugin: true,
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                scopes: scopes,
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
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                logoutRedirectUri = "".concat(rpBaseUrl, "/api/auth/callback/logout");
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
                                        enable_end_session: true,
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.enable_end_session).toEqual(true);
                                oauthClient = response;
                                return [4 /*yield*/, (0, listhen_1.listen)((0, node_1.toNodeHandler)(auth.handler), {
                                        port: port,
                                    })];
                            case 2:
                                server = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!server) return [3 /*break*/, 2];
                                return [4 /*yield*/, server.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                // Login again after each test
                (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _headers;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                _headers = (_a.sent()).headers;
                                headers = _headers;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass for clients with enable_end_session access", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken, sessionId, sessionBefore, logoutRes, sessionAfter;
                    var _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, createAuthUrl({
                                    scopes: scopes,
                                })];
                            case 1:
                                _a = _j.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 2:
                                _j.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                    })];
                            case 3:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined(); // Note: Opaque
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.scope).toBe(scopes.join(" "));
                                idToken = (0, jose_1.decodeJwt)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.id_token);
                                sessionId = idToken.sid;
                                (0, vitest_1.expect)(sessionId).toBeDefined();
                                return [4 /*yield*/, client.getSession({
                                        fetchOptions: {
                                            headers: headers,
                                        },
                                    })];
                            case 4:
                                sessionBefore = _j.sent();
                                (0, vitest_1.expect)((_g = sessionBefore.data) === null || _g === void 0 ? void 0 : _g.session.id).toBe(sessionId);
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: {
                                            id_token_hint: (_h = tokens.data) === null || _h === void 0 ? void 0 : _h.id_token,
                                        },
                                    })];
                            case 5:
                                logoutRes = _j.sent();
                                (0, vitest_1.expect)(logoutRes.data).toBeNull();
                                (0, vitest_1.expect)(logoutRes.error).toBeNull();
                                return [4 /*yield*/, client.getSession({
                                        fetchOptions: {
                                            headers: headers,
                                        },
                                    })];
                            case 6:
                                sessionAfter = _j.sent();
                                (0, vitest_1.expect)(sessionAfter.data).toBeNull();
                                (0, vitest_1.expect)(sessionAfter.error).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass with redirection", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, _a, authUrl, codeVerifier, callbackRedirectUrl, url, tokens, idToken, sessionId, logoutRedirectRes, logoutRes;
                    var _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        enable_end_session: true,
                                        skip_consent: true,
                                        post_logout_redirect_uris: [logoutRedirectUri],
                                    },
                                })];
                            case 1:
                                response = _j.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                (0, vitest_1.expect)(response.post_logout_redirect_uris).toEqual([logoutRedirectUri]);
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.enable_end_session).toBe(true);
                                return [4 /*yield*/, createAuthUrl({
                                        scopes: scopes,
                                        options: {
                                            clientId: response.client_id,
                                            clientSecret: response.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 2:
                                _a = _j.sent(), authUrl = _a.url, codeVerifier = _a.codeVerifier;
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _j.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=123");
                                url = new URL(callbackRedirectUrl);
                                return [4 /*yield*/, validateAuthCode({
                                        code: url.searchParams.get("code"),
                                        codeVerifier: codeVerifier,
                                        options: {
                                            clientId: response.client_id,
                                            clientSecret: response.client_secret,
                                        },
                                    })];
                            case 4:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined(); // Note: Opaque
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.refresh_token).toBeDefined();
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.scope).toBe(scopes.join(" "));
                                idToken = (0, jose_1.decodeJwt)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.id_token);
                                sessionId = idToken.sid;
                                (0, vitest_1.expect)(sessionId).toBeDefined();
                                logoutRedirectRes = "";
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: {
                                            id_token_hint: (_g = tokens.data) === null || _g === void 0 ? void 0 : _g.id_token,
                                            post_logout_redirect_uri: logoutRedirectUri,
                                        },
                                    }, {
                                        onResponse: function (ctx) {
                                            logoutRedirectRes = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                logoutRes = _j.sent();
                                (0, vitest_1.expect)(logoutRedirectRes).toBe(logoutRedirectUri);
                                (0, vitest_1.expect)((_h = logoutRes.error) === null || _h === void 0 ? void 0 : _h.status).toBe(302);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
