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
var api_1 = require("better-auth/api");
var client_1 = require("better-auth/client");
var node_1 = require("better-auth/node");
var generic_oauth_1 = require("better-auth/plugins/generic-oauth");
var jwt_1 = require("better-auth/plugins/jwt");
var multi_session_1 = require("better-auth/plugins/multi-session");
var open_api_1 = require("better-auth/plugins/open-api");
var organization_1 = require("better-auth/plugins/organization");
var test_1 = require("better-auth/test");
var better_call_1 = require("better-call");
var jose_1 = require("jose");
var listhen_1 = require("listhen");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var client_resource_1 = require("./client-resource");
var oauth_1 = require("./oauth");
function isRedirectResult(value) {
    return (typeof value === "object" &&
        value !== null &&
        "redirect" in value &&
        typeof value.redirect === "boolean" &&
        "url" in value &&
        typeof value.url === "string");
}
function expectUrl(url) {
    (0, vitest_1.expect)(url).toBeDefined();
    if (!url) {
        throw new Error("missing authorization URL");
    }
    return url;
}
function getFetchData(response) {
    if (typeof response === "object" && response !== null && "data" in response) {
        return response.data;
    }
    return response;
}
(0, vitest_1.describe)("oauth - init", function () {
    var createSecondaryStorage = function () { return ({
        set: function (key, value, ttl) { },
        get: function (key) {
            return null;
        },
        getAndDelete: function (key) {
            return null;
        },
        increment: function (key, ttl) {
            return 1;
        },
        delete: function (key) { },
    }); };
    (0, vitest_1.it)("should fail without the jwt plugin", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })).rejects.toThrowError("jwt_config")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should pass without the jwt plugin and disableJwtPlugin set", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var expect = _b.expect;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, expect((0, test_1.getTestInstance)({
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                disableJwtPlugin: true,
                            }),
                        ],
                    })).resolves.not.toThrowError()];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should pass with correct plugins", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })).resolves.not.toThrowError()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should fail with secondaryStorage when session config is omitted", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        secondaryStorage: createSecondaryStorage(),
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })).rejects.toThrowError("OAuth Provider requires `session.storeSessionInDatabase: true` when using secondaryStorage")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should fail with secondaryStorage when storeSessionInDatabase is false", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        secondaryStorage: createSecondaryStorage(),
                        session: {
                            storeSessionInDatabase: false,
                        },
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })).rejects.toThrowError("OAuth Provider requires `session.storeSessionInDatabase: true` when using secondaryStorage")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should pass with secondaryStorage when storeSessionInDatabase is true", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        secondaryStorage: createSecondaryStorage(),
                        session: {
                            storeSessionInDatabase: true,
                        },
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })).resolves.not.toThrowError()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should pass with dynamic baseURL config when ctx.baseURL is unresolved during init", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        baseURL: {
                            allowedHosts: ["localhost:3000"],
                            protocol: "http",
                        },
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })).resolves.not.toThrowError()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should still fail for an invalid configured jwt issuer", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        plugins: [
                            (0, jwt_1.jwt)({
                                jwt: {
                                    issuer: "not-a-valid-url",
                                },
                            }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })).rejects.toThrowError("Invalid URL")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
/**
 * @see https://github.com/better-auth/better-auth/issues/10880
 */
(0, vitest_1.describe)("oauth - OpenAPI response schemas", function () {
    vitest_1.it.for(["/oauth2/consent", "/oauth2/continue"])("documents the redirect response for POST %s", function (path_1, _a) { return __awaiter(void 0, [path_1, _a], void 0, function (path, _b) {
        var auth, document, schema;
        var _c, _d, _e, _f, _g, _h;
        var expect = _b.expect;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, open_api_1.openAPI)(),
                        ],
                    }, { disableTestUser: true })];
                case 1:
                    auth = (_j.sent()).auth;
                    return [4 /*yield*/, auth.api.generateOpenAPISchema()];
                case 2:
                    document = _j.sent();
                    schema = (_h = (_g = (_f = (_e = (_d = (_c = document.paths[path]) === null || _c === void 0 ? void 0 : _c.post) === null || _d === void 0 ? void 0 : _d.responses) === null || _e === void 0 ? void 0 : _e["200"]) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g["application/json"]) === null || _h === void 0 ? void 0 : _h.schema;
                    expect(schema).toMatchObject({
                        type: "object",
                        properties: {
                            redirect: { type: "boolean", enum: [true] },
                            url: { type: "string", format: "uri-reference" },
                        },
                        required: expect.arrayContaining(["redirect", "url"]),
                    });
                    expect(schema).not.toHaveProperty("properties.redirect_uri");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("oauth", function () { return __awaiter(void 0, void 0, void 0, function () {
    function createTestInstance(config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        return [4 /*yield*/, (0, test_1.getTestInstance)({
                                // Used to trust callbackUrl in test
                                account: {
                                    accountLinking: {
                                        trustedProviders: [providerId],
                                    },
                                },
                                plugins: [
                                    (0, generic_oauth_1.genericOAuth)({
                                        config: [
                                            __assign(__assign({ scopes: ["openid", "profile", "email"] }, config), { accountSubject: (_a = config === null || config === void 0 ? void 0 : config.accountSubject) !== null && _a !== void 0 ? _a : (function (_a) {
                                                    var _b;
                                                    var profile = _a.profile;
                                                    return (_b = profile.sub) !== null && _b !== void 0 ? _b : "";
                                                }), providerId: providerId, redirectURI: redirectUri, authorizationUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"), tokenUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/token"), userInfoUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo"), clientId: oauthClient.client_id, clientSecret: oauthClient.client_secret, pkce: true }),
                                        ],
                                    }),
                                ],
                            }, {
                                // The OAuth flow creates the RP-side user on first sign-in. Skipping
                                // the default test-user prevents a same-email collision that would
                                // otherwise route through the existing-user-no-link branch and trip
                                // the local-emailVerified gate.
                                disableTestUser: true,
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    }
    var port, authServerBaseUrl, rpBaseUrl, _a, authorizationServer, signInWithTestUser, customFetchImpl, cookieSetter, testUser, authClient, server, oauthClient, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                port = 3001;
                authServerBaseUrl = "http://localhost:".concat(port);
                rpBaseUrl = "http://localhost:5000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), authorizationServer = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl, cookieSetter = _a.cookieSetter, testUser = _a.testUser;
                authClient = (0, client_1.createAuthClient)({
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
                    var headers, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, listhen_1.listen)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                                    var config;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(req.url === "/.well-known/openid-configuration")) return [3 /*break*/, 2];
                                                return [4 /*yield*/, authorizationServer.api.getOpenIdConfig()];
                                            case 1:
                                                config = _a.sent();
                                                res.setHeader("Content-Type", "application/json");
                                                res.end(JSON.stringify(config));
                                                return [3 /*break*/, 4];
                                            case 2: return [4 /*yield*/, (0, node_1.toNodeHandler)(authorizationServer.handler)(req, res)];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); }, {
                                    port: port,
                                })];
                            case 1:
                                // Opens the authorization server for testing with genericOAuth
                                server = _a.sent();
                                return [4 /*yield*/, signInWithTestUser()];
                            case 2:
                                headers = (_a.sent()).headers;
                                return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            grant_types: [
                                                "authorization_code",
                                                "client_credentials",
                                                "refresh_token",
                                            ],
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            token_endpoint_auth_method: "client_secret_post",
                                            skip_consent: true,
                                        },
                                    })];
                            case 3:
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
                (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, server.close()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Tests if it is oauth2 compatible
                (0, vitest_1.it)("should sign in using generic oauth plugin", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var customFetchImplRP, client, headers, data, loginRedirectUri, signInResponse, signInUrl, callbackUrl;
                    var _c;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                customFetchImplRP = (_d.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                headers = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _d.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                (0, vitest_1.expect)(loginRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(loginRedirectUri).toContain("redirect_uri=".concat(encodeURIComponent((_c = oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.redirect_uris) === null || _c === void 0 ? void 0 : _c.at(0))));
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        throw: true,
                                    })];
                            case 4:
                                signInResponse = _d.sent();
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                signInUrl = signInResponse.url;
                                (0, vitest_1.expect)(signInUrl).toBeDefined();
                                if (!signInUrl) {
                                    throw new Error("Expected sign-in response URL");
                                }
                                (0, vitest_1.expect)(signInUrl).toContain(rpBaseUrl);
                                callbackUrl = "";
                                return [4 /*yield*/, client.$fetch(signInUrl, {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            callbackUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _d.sent();
                                (0, vitest_1.expect)(callbackUrl).toContain("/success");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should return a JSON redirect after email sign-in in a fetch-based oauth flow", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var customFetchImplRP, client, headers, data, loginRedirectUri, signInLocationHeader, signInResponse;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                customFetchImplRP = (_c.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                headers = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _c.sent();
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _c.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        href: "",
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                signInLocationHeader = "";
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        headers: {
                                            "Sec-Fetch-Mode": "cors",
                                        },
                                        throw: true,
                                        onResponse: function (ctx) {
                                            signInLocationHeader = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 4:
                                signInResponse = _c.sent();
                                (0, vitest_1.expect)(signInLocationHeader).toBe("");
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                (0, vitest_1.expect)(signInResponse.url).toContain("".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId));
                                (0, vitest_1.expect)(signInResponse.url).not.toContain("".concat(authServerBaseUrl, "/login"));
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/7041
                 */
                (0, vitest_1.it)("should return JSON redirect after sign-in without Sec-Fetch-Mode header", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var customFetchImplRP, client, headers, data, loginRedirectUri, signInLocationHeader, signInResponse;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                customFetchImplRP = (_c.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                headers = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _c.sent();
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _c.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        href: "",
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                signInLocationHeader = "";
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        throw: true,
                                        onResponse: function (ctx) {
                                            signInLocationHeader = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 4:
                                signInResponse = _c.sent();
                                (0, vitest_1.expect)(signInLocationHeader).toBe("");
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                (0, vitest_1.expect)(signInResponse.url).toContain("".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId));
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/7041
                 */
                (0, vitest_1.it)("should still return 302 redirect for navigate-mode requests (form submissions)", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var customFetchImplRP, client, headers, data, loginRedirectUri, signInLocationHeader;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                customFetchImplRP = (_c.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                headers = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _c.sent();
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _c.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        href: "",
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                signInLocationHeader = "";
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        headers: {
                                            "Sec-Fetch-Mode": "navigate",
                                        },
                                        onResponse: function (ctx) {
                                            signInLocationHeader = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 4:
                                _c.sent();
                                (0, vitest_1.expect)(signInLocationHeader).toContain(rpBaseUrl);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/7041
                 */
                (0, vitest_1.it)("should still return 302 redirect for html accept requests without Sec-Fetch-Mode", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var customFetchImplRP, client, headers, data, loginRedirectUri, signInLocationHeader;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                customFetchImplRP = (_c.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                headers = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _c.sent();
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _c.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        href: "",
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                signInLocationHeader = "";
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        headers: {
                                            accept: "text/html,application/xhtml+xml",
                                        },
                                        onResponse: function (ctx) {
                                            signInLocationHeader = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 4:
                                _c.sent();
                                (0, vitest_1.expect)(signInLocationHeader).toContain(rpBaseUrl);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/7041
                 */
                (0, vitest_1.it)("should return JSON error redirect when client is deleted during OAuth flow", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var adminHeaders, tempClient, customFetchImplRP, client, rpHeaders, data, loginRedirectUri, signInResponse;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                adminHeaders = (_c.sent()).headers;
                                return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                        headers: adminHeaders,
                                        body: {
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
                            case 2:
                                tempClient = _c.sent();
                                (0, vitest_1.expect)(tempClient === null || tempClient === void 0 ? void 0 : tempClient.client_id).toBeDefined();
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        account: {
                                            accountLinking: { trustedProviders: [providerId] },
                                        },
                                        plugins: [
                                            (0, generic_oauth_1.genericOAuth)({
                                                config: [
                                                    {
                                                        scopes: ["openid", "profile", "email"],
                                                        accountSubject: function (_a) {
                                                            var _b;
                                                            var profile = _a.profile;
                                                            return (_b = profile.sub) !== null && _b !== void 0 ? _b : "";
                                                        },
                                                        providerId: providerId,
                                                        redirectURI: redirectUri,
                                                        authorizationUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                                        tokenUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/token"),
                                                        userInfoUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo"),
                                                        clientId: tempClient.client_id,
                                                        clientSecret: tempClient.client_secret,
                                                        pkce: true,
                                                    },
                                                ],
                                            }),
                                        ],
                                    })];
                            case 3:
                                customFetchImplRP = (_c.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: { customFetchImpl: customFetchImplRP },
                                });
                                rpHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({ provider: providerId, callbackURL: "/success" }, { throw: true, onSuccess: cookieSetter(rpHeaders) })];
                            case 4:
                                data = _c.sent();
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _c.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        href: "",
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                // Delete the client AFTER the authorize redirect but BEFORE sign-in
                                return [4 /*yield*/, authorizationServer.api.deleteOAuthClient({
                                        headers: adminHeaders,
                                        body: { client_id: tempClient.client_id },
                                    })];
                            case 6:
                                // Delete the client AFTER the authorize redirect but BEFORE sign-in
                                _c.sent();
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        throw: true,
                                    })];
                            case 7:
                                signInResponse = _c.sent();
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                (0, vitest_1.expect)(signInResponse.url).toContain("error=invalid_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/7041
                 */
                (0, vitest_1.it)("should return JSON error redirect when client is disabled during OAuth flow", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var adminHeaders, tempClient, customFetchImplRP, client, rpHeaders, data, loginRedirectUri, context, signInResponse;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                adminHeaders = (_c.sent()).headers;
                                return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                        headers: adminHeaders,
                                        body: {
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
                            case 2:
                                tempClient = _c.sent();
                                (0, vitest_1.expect)(tempClient === null || tempClient === void 0 ? void 0 : tempClient.client_id).toBeDefined();
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        account: {
                                            accountLinking: { trustedProviders: [providerId] },
                                        },
                                        plugins: [
                                            (0, generic_oauth_1.genericOAuth)({
                                                config: [
                                                    {
                                                        scopes: ["openid", "profile", "email"],
                                                        accountSubject: function (_a) {
                                                            var _b;
                                                            var profile = _a.profile;
                                                            return (_b = profile.sub) !== null && _b !== void 0 ? _b : "";
                                                        },
                                                        providerId: providerId,
                                                        redirectURI: redirectUri,
                                                        authorizationUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                                        tokenUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/token"),
                                                        userInfoUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo"),
                                                        clientId: tempClient.client_id,
                                                        clientSecret: tempClient.client_secret,
                                                        pkce: true,
                                                    },
                                                ],
                                            }),
                                        ],
                                    })];
                            case 3:
                                customFetchImplRP = (_c.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: { customFetchImpl: customFetchImplRP },
                                });
                                rpHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({ provider: providerId, callbackURL: "/success" }, { throw: true, onSuccess: cookieSetter(rpHeaders) })];
                            case 4:
                                data = _c.sent();
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _c.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        href: "",
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, authorizationServer.$context];
                            case 6:
                                context = _c.sent();
                                return [4 /*yield*/, context.adapter.update({
                                        model: "oauthClient",
                                        where: [
                                            {
                                                field: "clientId",
                                                value: tempClient.client_id,
                                            },
                                        ],
                                        update: {
                                            disabled: true,
                                        },
                                    })];
                            case 7:
                                _c.sent();
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        throw: true,
                                    })];
                            case 8:
                                signInResponse = _c.sent();
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                (0, vitest_1.expect)(signInResponse.url).toContain("error=client_disabled");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should sign in using generic oauth discovery", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var customFetchImplRP, client, headers, data, loginRedirectUri, signInResponse, signInUrl, callbackURL;
                    var _c;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance({
                                        discoveryUrl: "".concat(authServerBaseUrl, "/.well-known/openid-configuration"),
                                    })];
                            case 1:
                                customFetchImplRP = (_d.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                headers = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _d.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                loginRedirectUri = "";
                                return [4 /*yield*/, authClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (ctx) {
                                            loginRedirectUri = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                (0, vitest_1.expect)(loginRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(loginRedirectUri).toContain("redirect_uri=".concat(encodeURIComponent((_c = oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.redirect_uris) === null || _c === void 0 ? void 0 : _c.at(0))));
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, authClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        throw: true,
                                    })];
                            case 4:
                                signInResponse = _d.sent();
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                signInUrl = signInResponse.url;
                                (0, vitest_1.expect)(signInUrl).toBeDefined();
                                if (!signInUrl) {
                                    throw new Error("Expected sign-in response URL");
                                }
                                (0, vitest_1.expect)(signInUrl).toContain(rpBaseUrl);
                                callbackURL = "";
                                return [4 /*yield*/, client.$fetch(signInUrl, {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (ctx) {
                                            callbackURL = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _d.sent();
                                (0, vitest_1.expect)(callbackURL).toContain("/success");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth - prompt", function () { return __awaiter(void 0, void 0, void 0, function () {
    function selectAccount(context) {
        return __awaiter(this, void 0, void 0, function () {
            var allSessions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!enableSelectAccount)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, authorizationServer.api.listDeviceSessions({
                                headers: context.headers,
                            })];
                    case 1:
                        allSessions = _a.sent();
                        return [2 /*return*/, (allSessions === null || allSessions === void 0 ? void 0 : allSessions.length) >= 1];
                }
            });
        });
    }
    function createTestInstance(config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                            throw Error("beforeAll not run properly");
                        }
                        return [4 /*yield*/, (0, test_1.getTestInstance)({
                                // Used to trust callbackUrl in test
                                account: {
                                    accountLinking: {
                                        trustedProviders: [providerId],
                                    },
                                },
                                plugins: [
                                    (0, generic_oauth_1.genericOAuth)({
                                        config: [
                                            __assign(__assign({ scopes: ["openid", "profile", "email"] }, config), { accountSubject: (_a = config === null || config === void 0 ? void 0 : config.accountSubject) !== null && _a !== void 0 ? _a : (function (_a) {
                                                    var _b;
                                                    var profile = _a.profile;
                                                    return (_b = profile.sub) !== null && _b !== void 0 ? _b : "";
                                                }), providerId: providerId, redirectURI: redirectUri, authorizationUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"), tokenUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/token"), userInfoUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo"), clientId: oauthClient.client_id, clientSecret: oauthClient.client_secret, pkce: true }),
                                        ],
                                    }),
                                ],
                            }, {
                                // The OAuth flow creates the RP-side user on first sign-in. Skipping
                                // the default test-user prevents a same-email collision that would
                                // otherwise route through the existing-user-no-link branch and trip
                                // the local-emailVerified gate.
                                disableTestUser: true,
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    }
    var port, authServerBaseUrl, rpBaseUrl, scopes, enableSelectAccount, enablePostLogin, selectedPostLogin, forcePostLoginRedirect, bypassReferenceIdCheck, isUserRegistered, authorizeBeforeHookCount, _a, authorizationServer, customFetchImpl, testUser, cookieSetter, serverClient, headers, server, oauthClient, org, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                port = 3001;
                authServerBaseUrl = "http://localhost:".concat(port);
                rpBaseUrl = "http://localhost:5000";
                scopes = ["openid", "profile", "email", "offline_access", "read:posts"];
                enableSelectAccount = false;
                enablePostLogin = false;
                selectedPostLogin = false;
                forcePostLoginRedirect = false;
                bypassReferenceIdCheck = false;
                isUserRegistered = true;
                authorizeBeforeHookCount = 0;
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        hooks: {
                            before: (0, api_1.createAuthMiddleware)(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (ctx.path === "/oauth2/authorize") {
                                        authorizeBeforeHookCount++;
                                    }
                                    return [2 /*return*/];
                                });
                            }); }),
                        },
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, multi_session_1.multiSession)(),
                            (0, organization_1.organization)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                signup: {
                                    page: "/signup",
                                    shouldRedirect: function () {
                                        return isUserRegistered ? false : "/setup";
                                    },
                                },
                                scopes: scopes,
                                selectAccount: {
                                    page: "/select-account",
                                    shouldRedirect: selectAccount,
                                },
                                postLogin: {
                                    page: "/select-organization",
                                    shouldRedirect: function (_a) {
                                        var session = _a.session;
                                        if (!enablePostLogin)
                                            return false;
                                        if (selectedPostLogin)
                                            return false;
                                        if (forcePostLoginRedirect)
                                            return true;
                                        return !(session === null || session === void 0 ? void 0 : session.activeOrganizationId);
                                    },
                                    consentReferenceId: function (_a) {
                                        var _b;
                                        var session = _a.session;
                                        if (!enablePostLogin)
                                            return undefined;
                                        if (selectedPostLogin)
                                            return undefined;
                                        if (bypassReferenceIdCheck)
                                            return undefined;
                                        var activeOrganizationId = ((_b = session === null || session === void 0 ? void 0 : session.activeOrganizationId) !== null && _b !== void 0 ? _b : undefined);
                                        if (!activeOrganizationId)
                                            throw new better_call_1.APIError("BAD_REQUEST", {
                                                error: "set_organization",
                                                error_description: "must set organization for these scopes",
                                            });
                                        return activeOrganizationId;
                                    },
                                },
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), authorizationServer = _a.auth, customFetchImpl = _a.customFetchImpl, testUser = _a.testUser, cookieSetter = _a.cookieSetter;
                serverClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
                headers = new Headers();
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                // Registers a confidential client application to work with
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var user, response, _org;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: undefined,
                                    },
                                });
                                return [4 /*yield*/, (0, listhen_1.listen)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                                        var config;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(req.url === "/.well-known/openid-configuration")) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, authorizationServer.api.getOpenIdConfig()];
                                                case 1:
                                                    config = _a.sent();
                                                    res.setHeader("Content-Type", "application/json");
                                                    res.end(JSON.stringify(config));
                                                    return [3 /*break*/, 4];
                                                case 2: return [4 /*yield*/, (0, node_1.toNodeHandler)(authorizationServer.handler)(req, res)];
                                                case 3:
                                                    _a.sent();
                                                    _a.label = 4;
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); }, {
                                        port: port,
                                    })];
                            case 1:
                                // Opens the authorization server for testing with genericOAuth
                                server = _a.sent();
                                return [4 /*yield*/, serverClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                user = (_a.sent()).user;
                                (0, vitest_1.expect)(user.id).toBeDefined();
                                return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            grant_types: [
                                                "authorization_code",
                                                "client_credentials",
                                                "refresh_token",
                                            ],
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            token_endpoint_auth_method: "client_secret_post",
                                        },
                                    })];
                            case 3:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.user_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.redirect_uris).toEqual([redirectUri]);
                                oauthClient = response;
                                return [4 /*yield*/, authorizationServer.api.createOrganization({
                                        body: {
                                            name: "my-org",
                                            slug: "my-org",
                                            userId: user.id,
                                        },
                                    })];
                            case 4:
                                _org = _a.sent();
                                (0, vitest_1.expect)(_org).toBeDefined();
                                org = _org;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, server.close()];
                            case 1:
                                _a.sent();
                                vitest_1.vi.unstubAllGlobals();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("login - should always redirect to login", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var customFetchImplRP, client, data, loginRedirectUri;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "login",
                                    })];
                            case 1:
                                customFetchImplRP = (_b.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                    })];
                            case 2:
                                data = _b.sent();
                                if (!data.url) {
                                    throw new Error("missing authorization URL");
                                }
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                loginRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (context) {
                                            loginRedirectUri = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _b.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                (0, vitest_1.expect)(loginRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(loginRedirectUri).toContain("redirect_uri=".concat(encodeURIComponent((_a = oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.redirect_uris) === null || _a === void 0 ? void 0 : _a.at(0))));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("create - should always redirect to signup", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var customFetchImplRP, client, data, signupRedirectUri;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "create",
                                    })];
                            case 1:
                                customFetchImplRP = (_b.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                    })];
                            case 2:
                                data = _b.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                signupRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        onError: function (context) {
                                            signupRedirectUri = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _b.sent();
                                (0, vitest_1.expect)(signupRedirectUri).toContain("/signup");
                                (0, vitest_1.expect)(signupRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(signupRedirectUri).toContain("redirect_uri=".concat(encodeURIComponent((_a = oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.redirect_uris) === null || _a === void 0 ? void 0 : _a.at(0))));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("create - should redirect to setup page", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, customFetchImplRP, cookieSetter, client, oauthHeaders, data, setupRedirectUri;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                isUserRegistered = false;
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                _a = _c.sent(), customFetchImplRP = _a.customFetchImpl, cookieSetter = _a.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(oauthHeaders),
                                    })];
                            case 2:
                                data = _c.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                setupRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            setupRedirectUri = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _c.sent();
                                (0, vitest_1.expect)(setupRedirectUri).toContain("/setup");
                                (0, vitest_1.expect)(setupRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(setupRedirectUri).toContain("redirect_uri=".concat(encodeURIComponent((_b = oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.redirect_uris) === null || _b === void 0 ? void 0 : _b.at(0))));
                                isUserRegistered = true;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("create - should return JSON redirect when continuing from setup", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var tempClient, _c, customFetchImplRP, cookieSetter, client, oauthHeaders, data, setupRedirectUri, continueLocationHeader, continueRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                isUserRegistered = false;
                                onTestFinished(function () {
                                    isUserRegistered = true;
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            grant_types: [
                                                "authorization_code",
                                                "client_credentials",
                                                "refresh_token",
                                            ],
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                        },
                                    })];
                            case 1:
                                tempClient = _d.sent();
                                if (!(tempClient === null || tempClient === void 0 ? void 0 : tempClient.client_id) || !tempClient.client_secret) {
                                    vitest_1.expect.unreachable();
                                }
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        account: {
                                            accountLinking: { trustedProviders: [providerId] },
                                        },
                                        plugins: [
                                            (0, generic_oauth_1.genericOAuth)({
                                                config: [
                                                    {
                                                        scopes: ["openid", "profile", "email"],
                                                        accountSubject: function (_a) {
                                                            var _b;
                                                            var profile = _a.profile;
                                                            return (_b = profile.sub) !== null && _b !== void 0 ? _b : "";
                                                        },
                                                        providerId: providerId,
                                                        redirectURI: redirectUri,
                                                        authorizationUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                                        tokenUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/token"),
                                                        userInfoUrl: "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo"),
                                                        clientId: tempClient.client_id,
                                                        clientSecret: tempClient.client_secret,
                                                        pkce: true,
                                                    },
                                                ],
                                            }),
                                        ],
                                    })];
                            case 2:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(oauthHeaders),
                                    })];
                            case 3:
                                data = _d.sent();
                                setupRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            setupRedirectUri = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 4:
                                _d.sent();
                                (0, vitest_1.expect)(setupRedirectUri).toContain("/setup");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(setupRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                isUserRegistered = true;
                                continueLocationHeader = "";
                                return [4 /*yield*/, serverClient.oauth2.continue({
                                        created: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onResponse: function (context) {
                                            continueLocationHeader =
                                                context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                continueRes = _d.sent();
                                (0, vitest_1.expect)(continueLocationHeader).toBe("");
                                (0, vitest_1.expect)(continueRes.redirect).toBe(true);
                                (0, vitest_1.expect)(continueRes.url).toContain("/consent");
                                (0, vitest_1.expect)(continueRes.url).toContain("client_id=".concat(tempClient.client_id));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("consent - should sign in", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, oauthHeaders, data, consentRedirectUri, consentRes, callbackURL;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "consent",
                                    })];
                            case 1:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(oauthHeaders),
                                    })];
                            case 2:
                                data = _d.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(data.url).toContain("prompt=consent");
                                consentRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            consentRedirectUri = context.response.headers.get("Location") || "";
                                            cookieSetter(headers)(context);
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(consentRedirectUri).toContain("/consent");
                                (0, vitest_1.expect)(consentRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(consentRedirectUri).toContain("scope=");
                                (0, vitest_1.expect)(consentRedirectUri).toContain("state=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.oauth2.consent({
                                        accept: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 4:
                                consentRes = _d.sent();
                                (0, vitest_1.expect)(consentRes.redirect).toBeTruthy();
                                (0, vitest_1.expect)(consentRes.url).toContain(redirectUri);
                                (0, vitest_1.expect)(consentRes.url).toContain("code=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRes.url, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                callbackURL = "";
                                return [4 /*yield*/, client.$fetch(consentRes.url, {
                                        method: "GET",
                                        headers: oauthHeaders,
                                        onError: function (context) {
                                            callbackURL = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 5:
                                _d.sent();
                                (0, vitest_1.expect)(callbackURL).toContain("/success");
                                (0, vitest_1.expect)(headers.get("cookie")).toContain("better-auth.session_token=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("consent - should sign in given previous consent (see previous test)", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, data, callbackRedirectUrl, callbackURL;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _d.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                            cookieSetter(headers)(context);
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("state=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(callbackRedirectUrl, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                callbackURL = "";
                                return [4 /*yield*/, client.$fetch(callbackRedirectUrl, {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            callbackURL = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 4:
                                _d.sent();
                                (0, vitest_1.expect)(callbackURL).toContain("/success");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("consent - should require consent again when new scope is requested", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, customFetchImplRP, cookieSetter, client, data, consentRedirectUri;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance({
                                        scopes: ["openid", "profile", "email", "offline_access"],
                                    })];
                            case 1:
                                _a = _b.sent(), customFetchImplRP = _a.customFetchImpl, cookieSetter = _a.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _b.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                consentRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            consentRedirectUri = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _b.sent();
                                (0, vitest_1.expect)(consentRedirectUri).toContain("/consent");
                                (0, vitest_1.expect)(consentRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(consentRedirectUri).toContain("scope=");
                                (0, vitest_1.expect)(consentRedirectUri).toContain("state=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("consent - should issue code when user consents to fewer scopes", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, oauthHeaders, data, consentRedirectUri, consentRes, callbackUrl, code, authToken, requestHeaders, accounts, accountId, tokens;
                    var _d, _e, _f, _g, _h;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "consent",
                                        scopes: ["openid", "profile", "email", "read:posts"],
                                    })];
                            case 1:
                                _c = _j.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(oauthHeaders),
                                    })];
                            case 2:
                                data = _j.sent();
                                (0, vitest_1.expect)(data.url).toContain("prompt=consent");
                                consentRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            consentRedirectUri = context.response.headers.get("Location") || "";
                                            cookieSetter(headers)(context);
                                        },
                                    })];
                            case 3:
                                _j.sent();
                                (0, vitest_1.expect)(consentRedirectUri).toContain("/consent");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.oauth2.consent({
                                        accept: true,
                                        scope: "openid profile email",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 4:
                                consentRes = _j.sent();
                                (0, vitest_1.expect)(consentRes.redirect).toBeTruthy();
                                (0, vitest_1.expect)(consentRes.url).toContain(redirectUri);
                                (0, vitest_1.expect)(consentRes.url).toContain("code=");
                                (0, vitest_1.expect)(consentRes.url).not.toContain("/consent");
                                callbackUrl = new URL(consentRes.url);
                                code = callbackUrl.searchParams.get("code");
                                (0, vitest_1.expect)(code).toBeTruthy();
                                return [4 /*yield*/, client.$fetch(consentRes.url, {
                                        method: "GET",
                                        headers: oauthHeaders,
                                        onError: function (context) {
                                            var _a;
                                            authToken = (_a = context.response.headers.get("set-auth-token")) !== null && _a !== void 0 ? _a : undefined;
                                        },
                                    })];
                            case 5:
                                _j.sent();
                                (0, vitest_1.expect)(authToken).toBeDefined();
                                if (!authToken)
                                    throw new Error("missing session bearer token");
                                requestHeaders = new Headers({
                                    authorization: "Bearer ".concat(authToken),
                                });
                                return [4 /*yield*/, client.listAccounts({
                                        fetchOptions: { headers: requestHeaders },
                                    })];
                            case 6:
                                accounts = _j.sent();
                                accountId = (_e = (_d = accounts.data) === null || _d === void 0 ? void 0 : _d.find(function (account) { return account.providerId === providerId; })) === null || _e === void 0 ? void 0 : _e.id;
                                (0, vitest_1.expect)(accountId).toBeDefined();
                                if (!accountId)
                                    throw new Error("missing provider account");
                                return [4 /*yield*/, client.getAccessToken({ accountId: accountId }, { headers: requestHeaders })];
                            case 7:
                                tokens = _j.sent();
                                (0, vitest_1.expect)((_f = tokens.data) === null || _f === void 0 ? void 0 : _f.accessToken).toBeDefined();
                                (0, vitest_1.expect)((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.scopes).toEqual(["openid", "profile", "email"]);
                                (0, vitest_1.expect)((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.scopes).not.toContain("read:posts");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("select_account - should sign in requesting account selection", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, data, selectAccountRedirectUri, selectedAccountRes, selectedAccountRedirectUri;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enableSelectAccount = true;
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        headers: headers,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _d.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                selectAccountRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (ctx) {
                                            selectAccountRedirectUri = ctx.response.headers.get("Location") || "";
                                            cookieSetter(headers)(ctx);
                                            headers.append("Cookie", headers.get("Cookie") || "");
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("/select-account");
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("scope=");
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("state=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectAccountRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.oauth2.continue({
                                        selected: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 4:
                                selectedAccountRes = _d.sent();
                                (0, vitest_1.expect)(selectedAccountRes.redirect).toBeTruthy();
                                selectedAccountRedirectUri = selectedAccountRes === null || selectedAccountRes === void 0 ? void 0 : selectedAccountRes.url;
                                (0, vitest_1.expect)(selectedAccountRedirectUri).toContain(redirectUri);
                                (0, vitest_1.expect)(selectedAccountRedirectUri).toContain("code=");
                                enableSelectAccount = false;
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/9887
                 *
                 * The resumed `/oauth2/authorize` step must run configured hooks. Before the
                 * fix it called the raw authorize function directly, skipping the dispatch
                 * pipeline, so hooks ran for the standalone request but not the resume.
                 */
                (0, vitest_1.it)("runs configured hooks when authorize resumes from continue", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, data, selectAccountRedirectUri, countBeforeResume, selectedAccountRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enableSelectAccount = true;
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                    enableSelectAccount = false;
                                });
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        throw: true,
                                        headers: headers,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _d.sent();
                                selectAccountRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (ctx) {
                                            selectAccountRedirectUri = ctx.response.headers.get("Location") || "";
                                            cookieSetter(headers)(ctx);
                                            headers.append("Cookie", headers.get("Cookie") || "");
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("/select-account");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectAccountRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                countBeforeResume = authorizeBeforeHookCount;
                                (0, vitest_1.expect)(countBeforeResume).toBeGreaterThan(0);
                                return [4 /*yield*/, serverClient.oauth2.continue({
                                        selected: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 4:
                                selectedAccountRes = _d.sent();
                                // Whether the resume lands on consent or the callback, it re-dispatched
                                // `/oauth2/authorize`, so the configured hook must have run once more.
                                (0, vitest_1.expect)(selectedAccountRes.redirect).toBeTruthy();
                                (0, vitest_1.expect)(authorizeBeforeHookCount).toBe(countBeforeResume + 1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("none - should return account_selection_required when account selection is required", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var customFetchImplRP, client, data, callbackRedirectUri_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enableSelectAccount = true;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, , 5, 6]);
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "none",
                                    })];
                            case 2:
                                customFetchImplRP = (_a.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 3:
                                data = _a.sent();
                                (0, vitest_1.expect)(data.url).toContain("prompt=none");
                                callbackRedirectUri_1 = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUri_1 = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 4:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUri_1).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUri_1).toContain("error=account_selection_required");
                                (0, vitest_1.expect)(callbackRedirectUri_1).toContain("state=");
                                (0, vitest_1.expect)(callbackRedirectUri_1).toContain("iss=".concat(encodeURIComponent(authServerBaseUrl)));
                                (0, vitest_1.expect)(callbackRedirectUri_1).not.toContain("/select-account");
                                return [3 /*break*/, 6];
                            case 5:
                                enableSelectAccount = false;
                                return [7 /*endfinally*/];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("none - should return interaction_required when post login is required", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var customFetchImplRP, client, data, callbackRedirectUri_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enableSelectAccount = false;
                                enablePostLogin = true;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, , 5, 6]);
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "none",
                                    })];
                            case 2:
                                customFetchImplRP = (_a.sent()).customFetchImpl;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 3:
                                data = _a.sent();
                                (0, vitest_1.expect)(data.url).toContain("prompt=none");
                                callbackRedirectUri_2 = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUri_2 = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 4:
                                _a.sent();
                                (0, vitest_1.expect)(callbackRedirectUri_2).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUri_2).toContain("error=interaction_required");
                                (0, vitest_1.expect)(callbackRedirectUri_2).toContain("state=");
                                (0, vitest_1.expect)(callbackRedirectUri_2).toContain("iss=".concat(encodeURIComponent(authServerBaseUrl)));
                                (0, vitest_1.expect)(callbackRedirectUri_2).not.toContain("/select-organization");
                                return [3 /*break*/, 6];
                            case 5:
                                enablePostLogin = false;
                                return [7 /*endfinally*/];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("login+consent - should always redirect to login and force consent (notice consent previously given)", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, data, loginRedirectUri, loginRedirectSearch, signInResponse, consentRes;
                    var _d;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "login consent",
                                    })];
                            case 1:
                                _c = _e.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 2:
                                data = _e.sent();
                                if (!data.url) {
                                    throw new Error("missing authorization URL");
                                }
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                loginRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            loginRedirectUri = context.response.headers.get("Location") || "";
                                            cookieSetter(headers)(context);
                                        },
                                    })];
                            case 3:
                                _e.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                (0, vitest_1.expect)(loginRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(loginRedirectUri).toContain("redirect_uri=".concat(encodeURIComponent((_d = oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.redirect_uris) === null || _d === void 0 ? void 0 : _d.at(0))));
                                loginRedirectSearch = new URL(loginRedirectUri, authServerBaseUrl)
                                    .search;
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: loginRedirectSearch,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 4:
                                signInResponse = _e.sent();
                                (0, vitest_1.expect)(signInResponse.redirect).toBe(true);
                                (0, vitest_1.expect)(signInResponse.url).toContain("/consent");
                                (0, vitest_1.expect)(signInResponse.url).toContain("prompt=consent");
                                (0, vitest_1.expect)(signInResponse.url).not.toContain("prompt=login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: loginRedirectSearch,
                                    },
                                });
                                return [4 /*yield*/, serverClient.oauth2.consent({
                                        accept: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 5:
                                consentRes = _e.sent();
                                (0, vitest_1.expect)(consentRes.redirect).toBe(true);
                                (0, vitest_1.expect)(consentRes.url).toContain(redirectUri);
                                (0, vitest_1.expect)(consentRes.url).toContain("code=");
                                (0, vitest_1.expect)(consentRes.url).not.toContain("/login");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/discussions/9261
                 */
                (0, vitest_1.it)("login+consent - should not accept stale login prompt without reauthentication", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var staleHeaders, user, _c, customFetchImplRP, rpCookieSetter, client, rpHeaders, data, loginRedirectUri, consentRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                staleHeaders = new Headers();
                                return [4 /*yield*/, serverClient.signIn.email({
                                        email: testUser.email,
                                        password: testUser.password,
                                    }, {
                                        throw: true,
                                        onSuccess: cookieSetter(staleHeaders),
                                    })];
                            case 1:
                                user = (_d.sent()).user;
                                (0, vitest_1.expect)(user.id).toBeDefined();
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "login consent",
                                    })];
                            case 2:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, rpCookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                rpHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: rpHeaders,
                                        throw: true,
                                    })];
                            case 3:
                                data = _d.sent();
                                if (!data.url) {
                                    throw new Error("missing authorization URL");
                                }
                                loginRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: rpHeaders,
                                        onError: function (context) {
                                            loginRedirectUri = context.response.headers.get("Location") || "";
                                            rpCookieSetter(rpHeaders)(context);
                                        },
                                    })];
                            case 4:
                                _d.sent();
                                (0, vitest_1.expect)(loginRedirectUri).toContain("/login");
                                (0, vitest_1.expect)(loginRedirectUri).toContain("prompt=login");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(loginRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.oauth2.consent({
                                        accept: true,
                                    }, {
                                        headers: staleHeaders,
                                        throw: true,
                                    })];
                            case 5:
                                consentRes = _d.sent();
                                (0, vitest_1.expect)(consentRes.redirect).toBe(true);
                                (0, vitest_1.expect)(consentRes.url).toContain("/login");
                                (0, vitest_1.expect)(consentRes.url).toContain("prompt=login");
                                (0, vitest_1.expect)(consentRes.url).not.toContain("code=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("select_account+consent - should always redirect to select_account and force consent (notice consent previously given)", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, data, selectAccountRedirectUri, selectedAccountRes, consentRedirectUri;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enableSelectAccount = true;
                                return [4 /*yield*/, createTestInstance({
                                        prompt: "select_account consent",
                                    })];
                            case 1:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 2:
                                data = _d.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                selectAccountRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (ctx) {
                                            selectAccountRedirectUri = ctx.response.headers.get("Location") || "";
                                            cookieSetter(headers)(ctx);
                                            headers.append("Cookie", headers.get("Cookie") || "");
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("/select-account");
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("scope=");
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("state=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectAccountRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.oauth2.continue({
                                        selected: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 4:
                                selectedAccountRes = _d.sent();
                                (0, vitest_1.expect)(selectedAccountRes.redirect).toBeTruthy();
                                consentRedirectUri = selectedAccountRes === null || selectedAccountRes === void 0 ? void 0 : selectedAccountRes.url;
                                (0, vitest_1.expect)(consentRedirectUri).toContain("/consent");
                                (0, vitest_1.expect)(consentRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(consentRedirectUri).toContain("scope=");
                                (0, vitest_1.expect)(consentRedirectUri).toContain("state=");
                                enableSelectAccount = false;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("shall allow user to post login via continue", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, oauthHeaders, data, selectOrgRedirectUri, continueRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enablePostLogin = true;
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    plugins: [(0, organization_1.organization)()],
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onSuccess: cookieSetter(oauthHeaders),
                                    })];
                            case 2:
                                data = _d.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                selectOrgRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            selectOrgRedirectUri = context.response.headers.get("Location") || "";
                                            cookieSetter(headers)(context);
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(selectOrgRedirectUri).toContain("/select-organization");
                                (0, vitest_1.expect)(selectOrgRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(selectOrgRedirectUri).toContain("scope=");
                                (0, vitest_1.expect)(selectOrgRedirectUri).toContain("state=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectOrgRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                selectedPostLogin = true;
                                return [4 /*yield*/, serverClient.oauth2.continue({
                                        postLogin: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onResponse: cookieSetter(headers),
                                    })];
                            case 4:
                                continueRes = _d.sent();
                                (0, vitest_1.expect)(continueRes.url).toContain(redirectUri);
                                (0, vitest_1.expect)(continueRes.url).toContain("code=");
                                selectedPostLogin = false;
                                enablePostLogin = false;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("shall not let a client self-attest post login completion via continue", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, oauthHeaders, data, selectOrgRedirectUri, continueRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enablePostLogin = true;
                                // Return a default reference instead of throwing, so the only thing that
                                // can stop token issuance is the post-login gate itself — isolating the
                                // self-attestation behavior under test.
                                bypassReferenceIdCheck = true;
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    plugins: [(0, organization_1.organization)()],
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onSuccess: cookieSetter(oauthHeaders),
                                    })];
                            case 2:
                                data = _d.sent();
                                selectOrgRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            selectOrgRedirectUri = context.response.headers.get("Location") || "";
                                            cookieSetter(headers)(context);
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(selectOrgRedirectUri).toContain("/select-organization");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectOrgRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                    bypassReferenceIdCheck = false;
                                    selectedPostLogin = false;
                                    enablePostLogin = false;
                                });
                                // Skip the actual selection: resubmit the signed oauth_query and claim
                                // the gate completed by posting `postLogin: true`. The server must re-run
                                // the gate against the live (still-unselected) session and redirect back
                                // rather than mint an authorization code.
                                selectedPostLogin = false;
                                return [4 /*yield*/, serverClient.oauth2.continue({
                                        postLogin: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onResponse: cookieSetter(headers),
                                    })];
                            case 4:
                                continueRes = _d.sent();
                                (0, vitest_1.expect)(continueRes.url).toContain("/select-organization");
                                (0, vitest_1.expect)(continueRes.url).not.toContain("code=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("shall allow user to select an organization/team post login and consent", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var _c, customFetchImplRP, cookieSetter, client, oauthHeaders, data, selectAccountRedirectUri, setActiveResponse, setActiveResult, consentRedirectUri, consentRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enablePostLogin = true;
                                return [4 /*yield*/, createTestInstance()];
                            case 1:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    plugins: [(0, organization_1.organization)()],
                                    baseURL: rpBaseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImplRP,
                                    },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({
                                        provider: providerId,
                                        callbackURL: "/success",
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onSuccess: cookieSetter(oauthHeaders),
                                    })];
                            case 2:
                                data = _d.sent();
                                (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                                (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient.client_id));
                                selectAccountRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: headers,
                                        onError: function (context) {
                                            selectAccountRedirectUri =
                                                context.response.headers.get("Location") || "";
                                            cookieSetter(headers)(context);
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("/select-organization");
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("scope=");
                                (0, vitest_1.expect)(selectAccountRedirectUri).toContain("state=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectAccountRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.$fetch("/organization/set-active", {
                                        method: "POST",
                                        body: {
                                            organizationId: org.id,
                                            organizationSlug: org.slug,
                                        },
                                        headers: headers,
                                        throw: true,
                                        onSuccess: cookieSetter(headers),
                                    })];
                            case 4:
                                setActiveResponse = _d.sent();
                                setActiveResult = getFetchData(setActiveResponse);
                                (0, vitest_1.expect)(isRedirectResult(setActiveResult)).toBe(true);
                                if (!isRedirectResult(setActiveResult)) {
                                    vitest_1.expect.unreachable();
                                }
                                (0, vitest_1.expect)(setActiveResult.redirect).toBe(true);
                                consentRedirectUri = setActiveResult.url;
                                (0, vitest_1.expect)(consentRedirectUri).toContain("/consent");
                                (0, vitest_1.expect)(consentRedirectUri).toContain("client_id=".concat(oauthClient.client_id));
                                (0, vitest_1.expect)(consentRedirectUri).toContain("scope=");
                                (0, vitest_1.expect)(consentRedirectUri).toContain("state=");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.oauth2.consent({
                                        accept: true,
                                    }, {
                                        headers: headers,
                                        throw: true,
                                        onResponse: cookieSetter(headers),
                                    })];
                            case 5:
                                consentRes = _d.sent();
                                (0, vitest_1.expect)(consentRes.url).toContain(redirectUri);
                                (0, vitest_1.expect)(consentRes.url).toContain("code=");
                                enablePostLogin = false;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("consent accept should not re-trigger postLogin redirect", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var freshHeaders, _c, customFetchImplRP, rpCookieSetter, client, oauthHeaders, data, selectOrgRedirectUri, setActiveResponse, setActiveResult, consentRedirectUri, consentRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enablePostLogin = true;
                                onTestFinished(function () {
                                    enablePostLogin = false;
                                    forcePostLoginRedirect = false;
                                });
                                freshHeaders = new Headers();
                                return [4 /*yield*/, serverClient.signIn.email({ email: testUser.email, password: testUser.password }, { throw: true, onSuccess: cookieSetter(freshHeaders) })];
                            case 1:
                                _d.sent();
                                return [4 /*yield*/, createTestInstance({ prompt: "consent" })];
                            case 2:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, rpCookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    plugins: [(0, organization_1.organization)()],
                                    baseURL: rpBaseUrl,
                                    fetchOptions: { customFetchImpl: customFetchImplRP },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({ provider: providerId, callbackURL: "/success" }, {
                                        headers: freshHeaders,
                                        throw: true,
                                        onSuccess: rpCookieSetter(oauthHeaders),
                                    })];
                            case 3:
                                data = _d.sent();
                                if (!data.url) {
                                    throw new Error("missing authorization URL");
                                }
                                selectOrgRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: freshHeaders,
                                        onError: function (context) {
                                            selectOrgRedirectUri = context.response.headers.get("Location") || "";
                                            cookieSetter(freshHeaders)(context);
                                        },
                                    })];
                            case 4:
                                _d.sent();
                                (0, vitest_1.expect)(selectOrgRedirectUri).toContain("/select-organization");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectOrgRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.$fetch("/organization/set-active", {
                                        method: "POST",
                                        body: { organizationId: org.id, organizationSlug: org.slug },
                                        headers: freshHeaders,
                                        throw: true,
                                        onSuccess: cookieSetter(freshHeaders),
                                    })];
                            case 5:
                                setActiveResponse = _d.sent();
                                setActiveResult = getFetchData(setActiveResponse);
                                if (!isRedirectResult(setActiveResult)) {
                                    vitest_1.expect.unreachable();
                                }
                                consentRedirectUri = setActiveResult.url;
                                (0, vitest_1.expect)(consentRedirectUri).toContain("/consent");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                forcePostLoginRedirect = true;
                                return [4 /*yield*/, serverClient.oauth2.consent({ accept: true }, {
                                        headers: freshHeaders,
                                        throw: true,
                                        onResponse: cookieSetter(freshHeaders),
                                    })];
                            case 6:
                                consentRes = _d.sent();
                                (0, vitest_1.expect)(consentRes.url).toContain(redirectUri);
                                (0, vitest_1.expect)(consentRes.url).toContain("code=");
                                (0, vitest_1.expect)(consentRes.url).not.toContain("/select-organization");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("consent accept should not bypass postLogin when posted with a pre-postLogin signed query", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var freshHeaders, _c, customFetchImplRP, rpCookieSetter, client, oauthHeaders, data, selectOrgRedirectUri, consentRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enablePostLogin = true;
                                bypassReferenceIdCheck = true;
                                onTestFinished(function () {
                                    enablePostLogin = false;
                                    bypassReferenceIdCheck = false;
                                });
                                freshHeaders = new Headers();
                                return [4 /*yield*/, serverClient.signIn.email({ email: testUser.email, password: testUser.password }, { throw: true, onSuccess: cookieSetter(freshHeaders) })];
                            case 1:
                                _d.sent();
                                return [4 /*yield*/, createTestInstance({ prompt: "consent" })];
                            case 2:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, rpCookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    plugins: [(0, organization_1.organization)()],
                                    baseURL: rpBaseUrl,
                                    fetchOptions: { customFetchImpl: customFetchImplRP },
                                });
                                oauthHeaders = new Headers();
                                return [4 /*yield*/, client.signIn.social({ provider: providerId, callbackURL: "/success" }, {
                                        headers: freshHeaders,
                                        throw: true,
                                        onSuccess: rpCookieSetter(oauthHeaders),
                                    })];
                            case 3:
                                data = _d.sent();
                                if (!data.url) {
                                    throw new Error("missing authorization URL");
                                }
                                selectOrgRedirectUri = "";
                                return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                                        method: "GET",
                                        headers: freshHeaders,
                                        onError: function (context) {
                                            selectOrgRedirectUri = context.response.headers.get("Location") || "";
                                            cookieSetter(freshHeaders)(context);
                                        },
                                    })];
                            case 4:
                                _d.sent();
                                (0, vitest_1.expect)(selectOrgRedirectUri).toContain("/select-organization");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectOrgRedirectUri, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.oauth2.consent({ accept: true }, {
                                        headers: freshHeaders,
                                        throw: true,
                                        onResponse: cookieSetter(freshHeaders),
                                    })];
                            case 5:
                                consentRes = _d.sent();
                                (0, vitest_1.expect)(consentRes.url).toContain("/select-organization");
                                (0, vitest_1.expect)(consentRes.url).not.toContain("code=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("consent accept should not skip postLogin when the ba_pl marker is from another session", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var headersA, _c, customFetchImplRP, rpCookieSetter, client, oauthHeadersA, dataA, selectOrgUriA, setActiveResponse, setActiveResult, consentUrlWithMarker, headersB, consentRes;
                    var onTestFinished = _b.onTestFinished;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw Error("beforeAll not run properly");
                                }
                                enablePostLogin = true;
                                bypassReferenceIdCheck = true;
                                onTestFinished(function () {
                                    enablePostLogin = false;
                                    bypassReferenceIdCheck = false;
                                });
                                headersA = new Headers();
                                return [4 /*yield*/, serverClient.signIn.email({ email: testUser.email, password: testUser.password }, { throw: true, onSuccess: cookieSetter(headersA) })];
                            case 1:
                                _d.sent();
                                return [4 /*yield*/, createTestInstance({ prompt: "consent" })];
                            case 2:
                                _c = _d.sent(), customFetchImplRP = _c.customFetchImpl, rpCookieSetter = _c.cookieSetter;
                                client = (0, client_1.createAuthClient)({
                                    plugins: [(0, organization_1.organization)()],
                                    baseURL: rpBaseUrl,
                                    fetchOptions: { customFetchImpl: customFetchImplRP },
                                });
                                oauthHeadersA = new Headers();
                                return [4 /*yield*/, client.signIn.social({ provider: providerId, callbackURL: "/success" }, {
                                        headers: headersA,
                                        throw: true,
                                        onSuccess: rpCookieSetter(oauthHeadersA),
                                    })];
                            case 3:
                                dataA = _d.sent();
                                if (!dataA.url) {
                                    throw new Error("missing authorization URL");
                                }
                                selectOrgUriA = "";
                                return [4 /*yield*/, serverClient.$fetch(dataA.url, {
                                        method: "GET",
                                        headers: headersA,
                                        onError: function (context) {
                                            selectOrgUriA = context.response.headers.get("Location") || "";
                                            cookieSetter(headersA)(context);
                                        },
                                    })];
                            case 4:
                                _d.sent();
                                (0, vitest_1.expect)(selectOrgUriA).toContain("/select-organization");
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(selectOrgUriA, authServerBaseUrl).search,
                                    },
                                });
                                return [4 /*yield*/, serverClient.$fetch("/organization/set-active", {
                                        method: "POST",
                                        body: { organizationId: org.id, organizationSlug: org.slug },
                                        headers: headersA,
                                        throw: true,
                                        onSuccess: cookieSetter(headersA),
                                    })];
                            case 5:
                                setActiveResponse = _d.sent();
                                setActiveResult = getFetchData(setActiveResponse);
                                if (!isRedirectResult(setActiveResult)) {
                                    vitest_1.expect.unreachable();
                                }
                                consentUrlWithMarker = setActiveResult.url;
                                (0, vitest_1.expect)(consentUrlWithMarker).toContain("/consent");
                                headersB = new Headers();
                                return [4 /*yield*/, serverClient.signIn.email({ email: testUser.email, password: testUser.password }, { throw: true, onSuccess: cookieSetter(headersB) })];
                            case 6:
                                _d.sent();
                                // Session B posts to /consent using session A's marker.
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentUrlWithMarker, authServerBaseUrl).search,
                                    },
                                });
                                onTestFinished(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, serverClient.oauth2.consent({ accept: true }, { headers: headersB, throw: true, onResponse: cookieSetter(headersB) })];
                            case 7:
                                consentRes = _d.sent();
                                // Session B must not be granted a code using session A's marker.
                                (0, vitest_1.expect)(consentRes.url).toContain("/select-organization");
                                (0, vitest_1.expect)(consentRes.url).not.toContain("code=");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth - config", function () {
    var port = 3002;
    var authServerBaseUrl = "http://localhost:".concat(port);
    var authServerUrl = "".concat(authServerBaseUrl, "/api/auth");
    var rpBaseUrl = "http://localhost:5000";
    var providerId = "test";
    var redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
    var server;
    var oauthClient;
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var tempServer;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, listhen_1.listen)((0, node_1.toNodeHandler)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, new Response("temp")];
                    }); }); }), {
                        port: 0,
                    })];
                case 1:
                    tempServer = _c.sent();
                    port = (_b = (_a = tempServer.address) === null || _a === void 0 ? void 0 : _a.port) !== null && _b !== void 0 ? _b : 3002;
                    authServerBaseUrl = "http://localhost:".concat(port);
                    authServerUrl = "".concat(authServerBaseUrl, "/api/auth");
                    return [4 /*yield*/, tempServer.close()];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
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
    /** Create a test client */
    function createTestInstance(config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id)) {
                            throw Error("beforeAll not run properly");
                        }
                        return [4 /*yield*/, (0, test_1.getTestInstance)({
                                // Used to trust callbackUrl in test
                                account: {
                                    accountLinking: {
                                        trustedProviders: [providerId],
                                    },
                                },
                                plugins: [
                                    (0, generic_oauth_1.genericOAuth)({
                                        config: [
                                            __assign(__assign({ scopes: ["openid", "profile", "email"] }, config), { accountSubject: (_a = config === null || config === void 0 ? void 0 : config.accountSubject) !== null && _a !== void 0 ? _a : (function (_a) {
                                                    var _b;
                                                    var profile = _a.profile;
                                                    return (_b = profile.sub) !== null && _b !== void 0 ? _b : "";
                                                }), providerId: providerId, redirectURI: redirectUri, authorizationUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"), tokenUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/token"), userInfoUrl: (config === null || config === void 0 ? void 0 : config.discoveryUrl)
                                                    ? undefined
                                                    : "".concat(authServerBaseUrl, "/api/auth/oauth2/userinfo"), clientId: oauthClient.client_id, clientSecret: oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret, pkce: true }),
                                        ],
                                    }),
                                ],
                            }, {
                                // The OAuth flow creates the RP-side user on first sign-in. Skipping
                                // the default test-user prevents a same-email collision that would
                                // otherwise route through the existing-user-no-link branch and trip
                                // the local-emailVerified gate.
                                disableTestUser: true,
                            })];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    }
    /**
     * @see https://github.com/better-auth/better-auth/issues/8017
     */
    (0, vitest_1.it)("should preserve form-urlencoded token body when req.body was pre-parsed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, authorizationServer, signInWithTestUser, headers, nodeHandler, createdClient, tokenResponse, tokenPayload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["m2m:read"],
                                clientPrivileges: function (_a) {
                                    var action = _a.action;
                                    return action === "create" ||
                                        action === "configure-client-credentials-scopes";
                                },
                            }),
                        ],
                    })];
                case 1:
                    _a = _b.sent(), authorizationServer = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    nodeHandler = (0, node_1.toNodeHandler)(authorizationServer.handler);
                    return [4 /*yield*/, (0, listhen_1.listen)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                            var requestWithParsedBody;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith("/api/auth/oauth2/token")) {
                                            requestWithParsedBody = req;
                                            requestWithParsedBody.body = {};
                                        }
                                        return [4 /*yield*/, nodeHandler(req, res)];
                                    case 1:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, {
                            port: port,
                        })];
                case 3:
                    server = _b.sent();
                    return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                grant_types: [
                                    "authorization_code",
                                    "client_credentials",
                                    "refresh_token",
                                ],
                                redirect_uris: [redirectUri],
                                application_type: "native",
                                token_endpoint_auth_method: "client_secret_post",
                                skip_consent: true,
                                client_credentials_scopes: ["m2m:read"],
                            },
                        })];
                case 4:
                    createdClient = _b.sent();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_id).toBeDefined();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_secret).toBeDefined();
                    return [4 /*yield*/, fetch(new URL("/api/auth/oauth2/token", server.url), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({
                                grant_type: "client_credentials",
                                client_id: createdClient.client_id,
                                client_secret: createdClient.client_secret,
                            }).toString(),
                        })];
                case 5:
                    tokenResponse = _b.sent();
                    return [4 /*yield*/, tokenResponse.json()];
                case 6:
                    tokenPayload = (_b.sent());
                    (0, vitest_1.expect)(tokenResponse.status).toBe(200);
                    (0, vitest_1.expect)(tokenPayload.error).toBeUndefined();
                    (0, vitest_1.expect)(tokenPayload.access_token).toBeDefined();
                    (0, vitest_1.expect)(tokenPayload.token_type).toBe("Bearer");
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.for([
        {
            storeClientSecret: undefined,
        },
        {
            storeClientSecret: "hashed",
        },
    ])("storeClientSecret: $storeClientSecret", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c, authorizationServer, signInWithTestUser, customFetchImpl, headers, serverClient, createdClient, _d, customFetchImplRP, cookieSetter, client, oauthHeaders, data, redirectUriResponse, callbackURL;
        var storeClientSecret = _b.storeClientSecret;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                storeClientSecret: storeClientSecret,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
                case 1:
                    _c = _e.sent(), authorizationServer = _c.auth, signInWithTestUser = _c.signInWithTestUser, customFetchImpl = _c.customFetchImpl;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_e.sent()).headers;
                    serverClient = (0, client_1.createAuthClient)({
                        plugins: [(0, client_2.oauthProviderClient)()],
                        baseURL: authServerBaseUrl,
                        fetchOptions: {
                            customFetchImpl: customFetchImpl,
                            headers: headers,
                        },
                    });
                    return [4 /*yield*/, (0, listhen_1.listen)((0, node_1.toNodeHandler)(authorizationServer.handler), {
                            port: port,
                        })];
                case 3:
                    server = _e.sent();
                    return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                grant_types: [
                                    "authorization_code",
                                    "client_credentials",
                                    "refresh_token",
                                ],
                                redirect_uris: [redirectUri],
                                application_type: "native",
                                token_endpoint_auth_method: "client_secret_post",
                                skip_consent: true,
                            },
                        })];
                case 4:
                    createdClient = _e.sent();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_id).toBeDefined();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.user_id).toBeDefined();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_secret).toBeDefined();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.redirect_uris).toEqual([redirectUri]);
                    oauthClient = createdClient;
                    return [4 /*yield*/, createTestInstance()];
                case 5:
                    _d = _e.sent(), customFetchImplRP = _d.customFetchImpl, cookieSetter = _d.cookieSetter;
                    client = (0, client_1.createAuthClient)({
                        baseURL: rpBaseUrl,
                        fetchOptions: {
                            customFetchImpl: customFetchImplRP,
                        },
                    });
                    oauthHeaders = new Headers();
                    return [4 /*yield*/, client.signIn.social({
                            provider: "test",
                            callbackURL: "/success",
                        }, {
                            throw: true,
                            onSuccess: cookieSetter(oauthHeaders),
                        })];
                case 6:
                    data = _e.sent();
                    (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                    (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id));
                    redirectUriResponse = "";
                    return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                            method: "GET",
                            onError: function (context) {
                                redirectUriResponse = context.response.headers.get("Location") || "";
                            },
                        })];
                case 7:
                    _e.sent();
                    (0, vitest_1.expect)(redirectUriResponse).toContain(redirectUri);
                    (0, vitest_1.expect)(redirectUriResponse).toContain("code=");
                    callbackURL = "";
                    return [4 /*yield*/, client.$fetch(redirectUriResponse, {
                            method: "GET",
                            headers: oauthHeaders,
                            onError: function (context) {
                                callbackURL = context.response.headers.get("Location") || "";
                            },
                        })];
                case 8:
                    _e.sent();
                    (0, vitest_1.expect)(callbackURL).toContain("/success");
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.for([
        {
            storeClientSecret: "encrypted",
        },
    ])("storeClientSecret: $storeClientSecret", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var _c, authorizationServer, signInWithTestUser, customFetchImpl, cookieSetter, headers, serverClient, createdClient, customFetchImplRP, client, oauthHeaders, data, redirectUriResponse, callbackURL;
        var storeClientSecret = _b.storeClientSecret;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                storeClientSecret: storeClientSecret,
                                disableJwtPlugin: true,
                            }),
                        ],
                    })];
                case 1:
                    _c = _d.sent(), authorizationServer = _c.auth, signInWithTestUser = _c.signInWithTestUser, customFetchImpl = _c.customFetchImpl, cookieSetter = _c.cookieSetter;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_d.sent()).headers;
                    serverClient = (0, client_1.createAuthClient)({
                        plugins: [(0, client_2.oauthProviderClient)()],
                        baseURL: authServerBaseUrl,
                        fetchOptions: {
                            customFetchImpl: customFetchImpl,
                            headers: headers,
                        },
                    });
                    return [4 /*yield*/, (0, listhen_1.listen)((0, node_1.toNodeHandler)(authorizationServer.handler), {
                            port: port,
                        })];
                case 3:
                    server = _d.sent();
                    return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                grant_types: [
                                    "authorization_code",
                                    "client_credentials",
                                    "refresh_token",
                                ],
                                redirect_uris: [redirectUri],
                                application_type: "native",
                                token_endpoint_auth_method: "client_secret_post",
                                skip_consent: true,
                            },
                        })];
                case 4:
                    createdClient = _d.sent();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_id).toBeDefined();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.user_id).toBeDefined();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_secret).toBeDefined();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.redirect_uris).toEqual([redirectUri]);
                    oauthClient = createdClient;
                    return [4 /*yield*/, createTestInstance()];
                case 5:
                    customFetchImplRP = (_d.sent()).customFetchImpl;
                    client = (0, client_1.createAuthClient)({
                        baseURL: rpBaseUrl,
                        fetchOptions: {
                            customFetchImpl: customFetchImplRP,
                        },
                    });
                    oauthHeaders = new Headers();
                    return [4 /*yield*/, client.signIn.social({
                            provider: "test",
                            callbackURL: "/success",
                        }, {
                            throw: true,
                            onSuccess: cookieSetter(oauthHeaders),
                        })];
                case 6:
                    data = _d.sent();
                    (0, vitest_1.expect)(data.url).toContain("".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"));
                    (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id));
                    redirectUriResponse = "";
                    return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                            method: "GET",
                            onError: function (context) {
                                redirectUriResponse = context.response.headers.get("Location") || "";
                            },
                        })];
                case 7:
                    _d.sent();
                    (0, vitest_1.expect)(redirectUriResponse).toContain(redirectUri);
                    (0, vitest_1.expect)(redirectUriResponse).toContain("code=");
                    callbackURL = "";
                    return [4 /*yield*/, client.$fetch(redirectUriResponse, {
                            method: "GET",
                            headers: oauthHeaders,
                            onError: function (context) {
                                callbackURL = context.response.headers.get("Location") || "";
                            },
                        })];
                case 8:
                    _d.sent();
                    (0, vitest_1.expect)(callbackURL).toContain("/success");
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.for([
        { disableJwtPlugin: false, publicClient: false, resource: false },
        { disableJwtPlugin: true, publicClient: false, resource: false },
        { disableJwtPlugin: false, publicClient: true, resource: false },
        { disableJwtPlugin: true, publicClient: true, resource: false },
        { disableJwtPlugin: false, publicClient: false, resource: true },
        { disableJwtPlugin: true, publicClient: false, resource: true },
        { disableJwtPlugin: false, publicClient: true, resource: true },
        { disableJwtPlugin: true, publicClient: true, resource: true },
    ])("token return type - disableJwtPlugin: $disableJwtPlugin, publicClient: $publicClient, resource: $resource", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var validResource, _c, authorizationServer, cookieSetter, signInWithTestUser, customFetchImpl, _d, headers, user, serverClient, createdClient, customFetchImplRP, client, oauthHeaders, data, redirectUriResponse, authToken, callbackURL, requestHeaders, accounts, accountId, tokens, payload, clientSecret, checkSignature, jwks, jwkSet, checkSignature;
        var _e, _f, _g, _h, _j, _k, _l, _m;
        var disableJwtPlugin = _b.disableJwtPlugin, publicClient = _b.publicClient, resource = _b.resource;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    validResource = disableJwtPlugin
                        ? "".concat(authServerBaseUrl, "/api/auth")
                        : "https://api.example.com";
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: __spreadArray([
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    disableJwtPlugin: disableJwtPlugin,
                                    resources: resource ? [validResource] : undefined,
                                    enforcePerClientResources: false,
                                })
                            ], (disableJwtPlugin ? [] : [(0, jwt_1.jwt)()]), true),
                        })];
                case 1:
                    _c = _o.sent(), authorizationServer = _c.auth, cookieSetter = _c.cookieSetter, signInWithTestUser = _c.signInWithTestUser, customFetchImpl = _c.customFetchImpl;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    _d = _o.sent(), headers = _d.headers, user = _d.user;
                    serverClient = (0, client_1.createAuthClient)({
                        plugins: [(0, client_2.oauthProviderClient)()],
                        baseURL: authServerBaseUrl,
                        fetchOptions: {
                            customFetchImpl: customFetchImpl,
                            headers: headers,
                        },
                    });
                    return [4 /*yield*/, (0, listhen_1.listen)((0, node_1.toNodeHandler)(authorizationServer.handler), {
                            port: port,
                        })];
                case 3:
                    server = _o.sent();
                    return [4 /*yield*/, authorizationServer.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                grant_types: [
                                    "authorization_code",
                                    "client_credentials",
                                    "refresh_token",
                                ],
                                redirect_uris: [redirectUri],
                                application_type: "native",
                                token_endpoint_auth_method: publicClient
                                    ? "none"
                                    : "client_secret_post",
                                skip_consent: true,
                            },
                        })];
                case 4:
                    createdClient = _o.sent();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_id).toBeDefined();
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.user_id).toBeDefined();
                    if (publicClient) {
                        (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_secret).toBeUndefined();
                    }
                    else {
                        (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_secret).toBeDefined();
                    }
                    (0, vitest_1.expect)(createdClient === null || createdClient === void 0 ? void 0 : createdClient.redirect_uris).toEqual([redirectUri]);
                    oauthClient = createdClient;
                    return [4 /*yield*/, createTestInstance({
                            tokenUrlParams: resource
                                ? {
                                    resource: validResource,
                                }
                                : undefined,
                        })];
                case 5:
                    customFetchImplRP = (_o.sent()).customFetchImpl;
                    client = (0, client_1.createAuthClient)({
                        plugins: [(0, client_resource_1.oauthProviderResourceClient)()],
                        baseURL: rpBaseUrl,
                        fetchOptions: {
                            customFetchImpl: customFetchImplRP,
                        },
                    });
                    oauthHeaders = new Headers();
                    return [4 /*yield*/, client.signIn.social({
                            provider: "test",
                            callbackURL: "/success",
                        }, {
                            throw: true,
                            onSuccess: cookieSetter(oauthHeaders),
                        })];
                case 6:
                    data = _o.sent();
                    (0, vitest_1.expect)(data.url).toContain("".concat(authServerUrl, "/oauth2/authorize"));
                    (0, vitest_1.expect)(data.url).toContain("client_id=".concat(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id));
                    redirectUriResponse = "";
                    return [4 /*yield*/, serverClient.$fetch(expectUrl(data.url), {
                            method: "GET",
                            onError: function (context) {
                                redirectUriResponse = context.response.headers.get("Location") || "";
                            },
                        })];
                case 7:
                    _o.sent();
                    (0, vitest_1.expect)(redirectUriResponse).toContain(redirectUri);
                    (0, vitest_1.expect)(redirectUriResponse).toContain("code=");
                    return [4 /*yield*/, client.$fetch(redirectUriResponse, {
                            method: "GET",
                            headers: oauthHeaders,
                            onError: function (context) {
                                var _a, _b;
                                callbackURL = (_a = context.response.headers.get("Location")) !== null && _a !== void 0 ? _a : undefined;
                                authToken =
                                    (_b = context.response.headers.get("set-auth-token")) !== null && _b !== void 0 ? _b : undefined;
                            },
                        })];
                case 8:
                    _o.sent();
                    (0, vitest_1.expect)(callbackURL).toContain("/success");
                    (0, vitest_1.expect)(authToken).toBeDefined();
                    if (!authToken)
                        throw new Error("missing session bearer token");
                    requestHeaders = new Headers({
                        authorization: "Bearer ".concat(authToken),
                    });
                    return [4 /*yield*/, client.listAccounts({
                            fetchOptions: { headers: requestHeaders },
                        })];
                case 9:
                    accounts = _o.sent();
                    accountId = (_f = (_e = accounts.data) === null || _e === void 0 ? void 0 : _e.find(function (account) { return account.providerId === "test"; })) === null || _f === void 0 ? void 0 : _f.id;
                    (0, vitest_1.expect)(accountId).toBeDefined();
                    if (!accountId)
                        throw new Error("missing provider account");
                    return [4 /*yield*/, client.getAccessToken({ accountId: accountId, userId: user.id }, { headers: requestHeaders })];
                case 10:
                    tokens = _o.sent();
                    // Check for access tokens
                    (0, vitest_1.expect)((_g = tokens.data) === null || _g === void 0 ? void 0 : _g.accessToken).toBeDefined();
                    if (!(publicClient && !(resource && !disableJwtPlugin))) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, vitest_1.expect)(client.verifyBearerToken((_h = tokens.data) === null || _h === void 0 ? void 0 : _h.accessToken, {
                            verifyOptions: {
                                audience: validResource,
                                issuer: authServerUrl,
                            },
                            jwksUrl: (disableJwtPlugin ? undefined : "".concat(authServerUrl, "/jwks")),
                        })).rejects.toThrowError()];
                case 11:
                    _o.sent();
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, client.verifyBearerToken((_j = tokens.data) === null || _j === void 0 ? void 0 : _j.accessToken, {
                        verifyOptions: {
                            audience: validResource,
                            issuer: authServerUrl,
                        },
                        jwksUrl: (disableJwtPlugin ? undefined : "".concat(authServerUrl, "/jwks")),
                        remoteVerify: publicClient
                            ? undefined
                            : {
                                introspectUrl: "".concat(authServerUrl, "/oauth2/introspect"),
                                clientId: createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_id,
                                clientSecret: createdClient === null || createdClient === void 0 ? void 0 : createdClient.client_secret,
                                // Tokens minted without a resource (or with the JWT plugin
                                // disabled) carry no `aud`, which the configured `audience`
                                // would otherwise reject by default.
                                allowMissingAudience: !(resource && !disableJwtPlugin),
                            },
                    })];
                case 13:
                    payload = _o.sent();
                    (0, vitest_1.expect)(payload).toMatchObject({
                        sub: vitest_1.expect.any(String),
                        iss: authServerUrl,
                        scope: ["openid", "profile", "email"].join(" "),
                        client_id: createdClient.client_id,
                        iat: vitest_1.expect.any(Number),
                        exp: vitest_1.expect.any(Number),
                    });
                    if (resource) {
                        (0, vitest_1.expect)(payload === null || payload === void 0 ? void 0 : payload.aud).toStrictEqual([
                            validResource,
                            "".concat(authServerUrl, "/oauth2/userinfo"),
                        ]);
                    }
                    else {
                        (0, vitest_1.expect)(payload === null || payload === void 0 ? void 0 : payload.aud).toBeUndefined();
                    }
                    _o.label = 14;
                case 14:
                    if (!disableJwtPlugin) return [3 /*break*/, 17];
                    if (!!publicClient) return [3 /*break*/, 16];
                    clientSecret = oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret;
                    return [4 /*yield*/, (0, jose_1.jwtVerify)((_k = tokens.data) === null || _k === void 0 ? void 0 : _k.idToken, new TextEncoder().encode(clientSecret), {
                            algorithms: ["HS256"],
                        })];
                case 15:
                    checkSignature = _o.sent();
                    (0, vitest_1.expect)(checkSignature).toBeDefined();
                    _o.label = 16;
                case 16: return [3 /*break*/, 20];
                case 17:
                    (0, vitest_1.expect)((_l = tokens.data) === null || _l === void 0 ? void 0 : _l.idToken).toBeDefined();
                    return [4 /*yield*/, authorizationServer.api.getJwks()];
                case 18:
                    jwks = _o.sent();
                    jwkSet = (0, jose_1.createLocalJWKSet)(jwks);
                    return [4 /*yield*/, (0, jose_1.jwtVerify)((_m = tokens.data) === null || _m === void 0 ? void 0 : _m.idToken, jwkSet, {
                            algorithms: ["EdDSA"],
                        })];
                case 19:
                    checkSignature = _o.sent();
                    (0, vitest_1.expect)(checkSignature).toBeDefined();
                    _o.label = 20;
                case 20: return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("oauth - rate limiting", function () {
    (0, vitest_1.it)("should have default rate limits configured", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, plugin, tokenRule, rotateKeysRule, authorizeRule, introspectRule, revokeRule, registerRule, userinfoRule;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })];
                case 1:
                    auth = (_k.sent()).auth;
                    plugin = (_a = auth.options.plugins) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.id === "oauth-provider"; });
                    (0, vitest_1.expect)(plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit).toBeDefined();
                    (0, vitest_1.expect)((_b = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _b === void 0 ? void 0 : _b.length).toBe(7);
                    tokenRule = (_c = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _c === void 0 ? void 0 : _c.find(function (r) {
                        return r.pathMatcher("/oauth2/token");
                    });
                    (0, vitest_1.expect)(tokenRule === null || tokenRule === void 0 ? void 0 : tokenRule.window).toBe(60);
                    (0, vitest_1.expect)(tokenRule === null || tokenRule === void 0 ? void 0 : tokenRule.max).toBe(20);
                    rotateKeysRule = (_d = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _d === void 0 ? void 0 : _d.find(function (r) {
                        return r.pathMatcher("/oauth2/client/rotate-keys");
                    });
                    (0, vitest_1.expect)(rotateKeysRule === null || rotateKeysRule === void 0 ? void 0 : rotateKeysRule.window).toBe(60);
                    (0, vitest_1.expect)(rotateKeysRule === null || rotateKeysRule === void 0 ? void 0 : rotateKeysRule.max).toBe(5);
                    authorizeRule = (_e = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _e === void 0 ? void 0 : _e.find(function (r) {
                        return r.pathMatcher("/oauth2/authorize");
                    });
                    (0, vitest_1.expect)(authorizeRule === null || authorizeRule === void 0 ? void 0 : authorizeRule.window).toBe(60);
                    (0, vitest_1.expect)(authorizeRule === null || authorizeRule === void 0 ? void 0 : authorizeRule.max).toBe(30);
                    introspectRule = (_f = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _f === void 0 ? void 0 : _f.find(function (r) {
                        return r.pathMatcher("/oauth2/introspect");
                    });
                    (0, vitest_1.expect)(introspectRule === null || introspectRule === void 0 ? void 0 : introspectRule.window).toBe(60);
                    (0, vitest_1.expect)(introspectRule === null || introspectRule === void 0 ? void 0 : introspectRule.max).toBe(100);
                    revokeRule = (_g = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _g === void 0 ? void 0 : _g.find(function (r) {
                        return r.pathMatcher("/oauth2/revoke");
                    });
                    (0, vitest_1.expect)(revokeRule === null || revokeRule === void 0 ? void 0 : revokeRule.window).toBe(60);
                    (0, vitest_1.expect)(revokeRule === null || revokeRule === void 0 ? void 0 : revokeRule.max).toBe(30);
                    registerRule = (_h = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _h === void 0 ? void 0 : _h.find(function (r) {
                        return r.pathMatcher("/oauth2/register");
                    });
                    (0, vitest_1.expect)(registerRule === null || registerRule === void 0 ? void 0 : registerRule.window).toBe(60);
                    (0, vitest_1.expect)(registerRule === null || registerRule === void 0 ? void 0 : registerRule.max).toBe(5);
                    userinfoRule = (_j = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _j === void 0 ? void 0 : _j.find(function (r) {
                        return r.pathMatcher("/oauth2/userinfo");
                    });
                    (0, vitest_1.expect)(userinfoRule === null || userinfoRule === void 0 ? void 0 : userinfoRule.window).toBe(60);
                    (0, vitest_1.expect)(userinfoRule === null || userinfoRule === void 0 ? void 0 : userinfoRule.max).toBe(60);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should allow custom rate limit values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, plugin, tokenRule, introspectRule, authorizeRule;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                rateLimit: {
                                    token: { window: 1, max: 4 },
                                    introspect: { window: 1, max: 50 },
                                },
                            }),
                        ],
                    })];
                case 1:
                    auth = (_e.sent()).auth;
                    plugin = (_a = auth.options.plugins) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.id === "oauth-provider"; });
                    tokenRule = (_b = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _b === void 0 ? void 0 : _b.find(function (r) {
                        return r.pathMatcher("/oauth2/token");
                    });
                    (0, vitest_1.expect)(tokenRule === null || tokenRule === void 0 ? void 0 : tokenRule.window).toBe(1);
                    (0, vitest_1.expect)(tokenRule === null || tokenRule === void 0 ? void 0 : tokenRule.max).toBe(4);
                    introspectRule = (_c = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _c === void 0 ? void 0 : _c.find(function (r) {
                        return r.pathMatcher("/oauth2/introspect");
                    });
                    (0, vitest_1.expect)(introspectRule === null || introspectRule === void 0 ? void 0 : introspectRule.window).toBe(1);
                    (0, vitest_1.expect)(introspectRule === null || introspectRule === void 0 ? void 0 : introspectRule.max).toBe(50);
                    authorizeRule = (_d = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _d === void 0 ? void 0 : _d.find(function (r) {
                        return r.pathMatcher("/oauth2/authorize");
                    });
                    (0, vitest_1.expect)(authorizeRule === null || authorizeRule === void 0 ? void 0 : authorizeRule.window).toBe(60);
                    (0, vitest_1.expect)(authorizeRule === null || authorizeRule === void 0 ? void 0 : authorizeRule.max).toBe(30);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should allow disabling rate limit for specific endpoints", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, plugin, tokenRule, introspectRule, authorizeRule;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                rateLimit: {
                                    token: false,
                                    introspect: false,
                                },
                            }),
                        ],
                    })];
                case 1:
                    auth = (_f.sent()).auth;
                    plugin = (_a = auth.options.plugins) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p.id === "oauth-provider"; });
                    // Token and introspect should be disabled (not in array)
                    (0, vitest_1.expect)((_b = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _b === void 0 ? void 0 : _b.length).toBe(5);
                    tokenRule = (_c = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _c === void 0 ? void 0 : _c.find(function (r) {
                        return r.pathMatcher("/oauth2/token");
                    });
                    (0, vitest_1.expect)(tokenRule).toBeUndefined();
                    introspectRule = (_d = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _d === void 0 ? void 0 : _d.find(function (r) {
                        return r.pathMatcher("/oauth2/introspect");
                    });
                    (0, vitest_1.expect)(introspectRule).toBeUndefined();
                    authorizeRule = (_e = plugin === null || plugin === void 0 ? void 0 : plugin.rateLimit) === null || _e === void 0 ? void 0 : _e.find(function (r) {
                        return r.pathMatcher("/oauth2/authorize");
                    });
                    (0, vitest_1.expect)(authorizeRule).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should enforce rate limits on token endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, auth, signInWithTestUser, customFetchImpl, headers, client, statuses, i, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        rateLimit: {
                            enabled: true,
                        },
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["m2m:read"],
                                clientPrivileges: function (_a) {
                                    var action = _a.action;
                                    return action === "create" ||
                                        action === "configure-client-credentials-scopes";
                                },
                                rateLimit: {
                                    token: { window: 60, max: 3 },
                                },
                            }),
                        ],
                    })];
                case 1:
                    _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                grant_types: [
                                    "authorization_code",
                                    "client_credentials",
                                    "refresh_token",
                                ],
                                redirect_uris: ["http://localhost:5000/callback"],
                                application_type: "native",
                                token_endpoint_auth_method: "client_secret_post",
                                client_credentials_scopes: ["m2m:read"],
                            },
                        })];
                case 3:
                    client = _b.sent();
                    statuses = [];
                    i = 0;
                    _b.label = 4;
                case 4:
                    if (!(i < 5)) return [3 /*break*/, 7];
                    return [4 /*yield*/, customFetchImpl("http://localhost:3000/api/auth/oauth2/token", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({
                                grant_type: "client_credentials",
                                client_id: client.client_id,
                                client_secret: client.client_secret,
                            }).toString(),
                        })];
                case 5:
                    response = _b.sent();
                    statuses.push(response.status);
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    // First 3 requests should succeed (200), last 2 should be rate limited (429)
                    (0, vitest_1.expect)(statuses[0]).toBe(200);
                    (0, vitest_1.expect)(statuses[1]).toBe(200);
                    (0, vitest_1.expect)(statuses[2]).toBe(200);
                    (0, vitest_1.expect)(statuses[3]).toBe(429);
                    (0, vitest_1.expect)(statuses[4]).toBe(429);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("should not rate limit when endpoint rate limit is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, auth, signInWithTestUser, customFetchImpl, headers, client, i, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        rateLimit: {
                            enabled: true,
                        },
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["m2m:read"],
                                clientPrivileges: function (_a) {
                                    var action = _a.action;
                                    return action === "create" ||
                                        action === "configure-client-credentials-scopes";
                                },
                                rateLimit: {
                                    token: false, // Disable rate limiting for token endpoint
                                },
                            }),
                        ],
                    })];
                case 1:
                    _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                grant_types: [
                                    "authorization_code",
                                    "client_credentials",
                                    "refresh_token",
                                ],
                                redirect_uris: ["http://localhost:5000/callback"],
                                application_type: "native",
                                token_endpoint_auth_method: "client_secret_post",
                                client_credentials_scopes: ["m2m:read"],
                            },
                        })];
                case 3:
                    client = _b.sent();
                    i = 0;
                    _b.label = 4;
                case 4:
                    if (!(i < 10)) return [3 /*break*/, 7];
                    return [4 /*yield*/, customFetchImpl("http://localhost:3000/api/auth/oauth2/token", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({
                                grant_type: "client_credentials",
                                client_id: client.client_id,
                                client_secret: client.client_secret,
                            }).toString(),
                        })];
                case 5:
                    response = _b.sent();
                    (0, vitest_1.expect)(response.status).toBe(200);
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    // Note: Window expiry/reset behavior is tested in the core rate-limiter tests.
    // See packages/better-auth/src/api/rate-limiter/rate-limiter.test.ts
});
