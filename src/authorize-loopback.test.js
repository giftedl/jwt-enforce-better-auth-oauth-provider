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
var crypto_1 = require("better-auth/crypto");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var client_1 = require("./client");
var oauth_1 = require("./oauth");
var authServerBaseURL = "http://localhost:3000";
var registeredLocalhostRedirect = "http://localhost/callback?source=cli";
var registeredPortfulLocalhostRedirect = "http://localhost:8080/portful-callback";
var registeredIPv4Redirect = "http://127.0.0.1/callback";
var rejectedRedirects = [
    {
        component: "path",
        redirectUri: "http://localhost:51234/other?source=cli",
        error: "invalid_redirect",
    },
    {
        component: "query",
        redirectUri: "http://localhost:51234/callback?source=other",
        error: "invalid_redirect",
    },
    {
        component: "protocol",
        redirectUri: "https://localhost:51234/callback?source=cli",
        error: "invalid_redirect",
    },
    {
        component: "localhost subdomain",
        redirectUri: "http://tenant.localhost:51234/callback?source=cli",
        error: "invalid_redirect",
    },
    {
        component: "fragment",
        redirectUri: "http://localhost:51234/callback?source=cli#fragment",
        error: "invalid_request",
    },
    {
        component: "empty fragment",
        redirectUri: "http://localhost:51234/callback?source=cli#",
        error: "invalid_request",
    },
    {
        component: "userinfo",
        redirectUri: "http://user:password@localhost:51234/callback?source=cli",
        error: "invalid_redirect",
    },
    {
        component: "scheme casing",
        redirectUri: "HTTP://localhost:51234/callback?source=cli",
        error: "invalid_redirect",
    },
    {
        component: "hostname casing",
        redirectUri: "http://LOCALHOST:51234/callback?source=cli",
        error: "invalid_redirect",
    },
    {
        component: "dot path segment",
        redirectUri: "http://localhost:51234/path/../callback?source=cli",
        error: "invalid_redirect",
    },
    {
        component: "empty query marker",
        redirectUri: "http://127.0.0.1:51234/callback?",
        error: "invalid_redirect",
    },
    {
        component: "IPv4 shorthand",
        redirectUri: "http://127.1:51234/callback",
        error: "invalid_redirect",
    },
];
function expectAuthorizationCodeRedirect(location, expectedRedirect) {
    var expectedURL = new URL(expectedRedirect);
    (0, vitest_1.expect)(location.origin).toBe(expectedURL.origin);
    (0, vitest_1.expect)(location.pathname).toBe(expectedURL.pathname);
    (0, vitest_1.expect)(location.searchParams.get("source")).toBe(expectedURL.searchParams.get("source"));
    (0, vitest_1.expect)(location.searchParams.get("code")).toBeTypeOf("string");
    (0, vitest_1.expect)(location.searchParams.get("state")).toBe("state");
    (0, vitest_1.expect)(location.searchParams.has("error")).toBe(false);
}
function expectRejectedRedirect(location, expectedError) {
    (0, vitest_1.expect)(location.origin).toBe(authServerBaseURL);
    (0, vitest_1.expect)(location.pathname).toBe("/api/auth/error");
    (0, vitest_1.expect)(location.searchParams.get("error")).toBe(expectedError);
    (0, vitest_1.expect)(location.searchParams.has("code")).toBe(false);
}
function setupAuthorizationFixture() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, auth, client, signInWithTestUser, headers, oauthClient;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseURL,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    }, {
                        clientOptions: {
                            plugins: [(0, client_1.oauthProviderClient)()],
                        },
                    })];
                case 1:
                    _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                redirect_uris: [
                                    registeredLocalhostRedirect,
                                    registeredPortfulLocalhostRedirect,
                                    registeredIPv4Redirect,
                                ],
                                application_type: "native",
                                skip_consent: true,
                            },
                        })];
                case 3:
                    oauthClient = _b.sent();
                    return [2 /*return*/, function authorizeRedirect(redirectUri) {
                            return __awaiter(this, void 0, void 0, function () {
                                var authorizationURL, redirectLocation;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            authorizationURL = new URL("".concat(authServerBaseURL, "/api/auth/oauth2/authorize"));
                                            authorizationURL.searchParams.set("client_id", oauthClient.client_id);
                                            authorizationURL.searchParams.set("redirect_uri", redirectUri);
                                            authorizationURL.searchParams.set("response_type", "code");
                                            authorizationURL.searchParams.set("scope", "openid");
                                            authorizationURL.searchParams.set("state", "state");
                                            authorizationURL.searchParams.set("code_challenge", (0, crypto_1.generateRandomString)(43));
                                            authorizationURL.searchParams.set("code_challenge_method", "S256");
                                            return [4 /*yield*/, client.$fetch(authorizationURL.toString(), {
                                                    headers: headers,
                                                    redirect: "manual",
                                                    onResponse: function (context) {
                                                        var location = context.response.headers.get("location");
                                                        if (location) {
                                                            redirectLocation = new URL(location, authServerBaseURL);
                                                        }
                                                    },
                                                })];
                                        case 1:
                                            _a.sent();
                                            if (!redirectLocation) {
                                                throw new Error("Expected the authorize endpoint to redirect");
                                            }
                                            return [2 /*return*/, redirectLocation];
                                    }
                                });
                            });
                        }];
            }
        });
    });
}
/**
 * @see https://github.com/better-auth/better-auth/issues/10937
 */
(0, vitest_1.describe)("oauth authorize loopback port variance", function () {
    var authorizeRedirect;
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupAuthorizationFixture()];
                case 1:
                    authorizeRedirect = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts an ephemeral port for localhost", function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestedRedirect, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestedRedirect = "http://localhost:51234/callback?source=cli";
                    return [4 /*yield*/, authorizeRedirect(requestedRedirect)];
                case 1:
                    location = _a.sent();
                    expectAuthorizationCodeRedirect(location, requestedRedirect);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts a different port for a portful localhost registration", function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestedRedirect, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestedRedirect = "http://localhost:51234/portful-callback";
                    return [4 /*yield*/, authorizeRedirect(requestedRedirect)];
                case 1:
                    location = _a.sent();
                    expectAuthorizationCodeRedirect(location, requestedRedirect);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves loopback IPv4 port variance", function () { return __awaiter(void 0, void 0, void 0, function () {
        var requestedRedirect, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestedRedirect = "http://127.0.0.1:51234/callback";
                    return [4 /*yield*/, authorizeRedirect(requestedRedirect)];
                case 1:
                    location = _a.sent();
                    expectAuthorizationCodeRedirect(location, requestedRedirect);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each(rejectedRedirects)("rejects a changed $component", function (testCase) { return __awaiter(void 0, void 0, void 0, function () {
        var location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authorizeRedirect(testCase.redirectUri)];
                case 1:
                    location = _a.sent();
                    expectRejectedRedirect(location, testCase.error);
                    return [2 /*return*/];
            }
        });
    }); });
});
