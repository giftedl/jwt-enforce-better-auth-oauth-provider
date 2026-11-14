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
var node_crypto_1 = require("node:crypto");
var crypto_1 = require("better-auth/crypto");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_1 = require("./client");
var oauth_1 = require("./oauth");
var lanOrigin = "http://192.168.1.50:8000";
var lanRedirect = "".concat(lanOrigin, "/auth/callback");
var lanLogoutRedirect = "".concat(lanOrigin, "/logged-out");
var allowLanOrigin = function (url) { return url.origin === lanOrigin; };
function setupProvider(input) {
    return __awaiter(this, void 0, void 0, function () {
        function createClient(body) {
            var _a;
            return auth.api.adminCreateOAuthClient({
                headers: headers,
                body: __assign(__assign({}, body), { token_endpoint_auth_method: "none", skip_consent: (_a = body.skip_consent) !== null && _a !== void 0 ? _a : true, enable_end_session: true }),
            });
        }
        function authorize(clientId, redirectUri) {
            return __awaiter(this, void 0, void 0, function () {
                var codeVerifier, url, location;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            codeVerifier = (0, crypto_1.generateRandomString)(43);
                            url = new URL("".concat(baseURL, "/api/auth/oauth2/authorize"));
                            url.searchParams.set("client_id", clientId);
                            url.searchParams.set("redirect_uri", redirectUri);
                            url.searchParams.set("response_type", "code");
                            url.searchParams.set("scope", "openid");
                            url.searchParams.set("state", "state");
                            url.searchParams.set("code_challenge", (0, node_crypto_1.createHash)("sha256").update(codeVerifier).digest("base64url"));
                            url.searchParams.set("code_challenge_method", "S256");
                            return [4 /*yield*/, client.$fetch(url.toString(), {
                                    headers: headers,
                                    redirect: "manual",
                                    onResponse: function (context) {
                                        var header = context.response.headers.get("location");
                                        if (header)
                                            location = new URL(header, baseURL);
                                    },
                                })];
                        case 1:
                            _a.sent();
                            if (!location)
                                throw new Error("Expected the authorize endpoint to redirect");
                            return [2 /*return*/, { location: location, codeVerifier: codeVerifier }];
                    }
                });
            });
        }
        function exchangeCode(input) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, auth.handler(new Request("".concat(baseURL, "/api/auth/oauth2/token"), {
                                method: "POST",
                                headers: { "content-type": "application/x-www-form-urlencoded" },
                                body: new URLSearchParams({
                                    grant_type: "authorization_code",
                                    client_id: input.clientId,
                                    code: input.code,
                                    code_verifier: input.codeVerifier,
                                    redirect_uri: input.redirectUri,
                                }),
                            }))];
                        case 1:
                            response = _b.sent();
                            _a = {
                                status: response.status
                            };
                            return [4 /*yield*/, response.json()];
                        case 2: return [2 /*return*/, (_a.body = (_b.sent()),
                                _a)];
                    }
                });
            });
        }
        function endSession(clientId, postLogoutRedirectUri) {
            var url = new URL("".concat(baseURL, "/api/auth/oauth2/end-session"));
            url.searchParams.set("client_id", clientId);
            url.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
            var requestHeaders = new Headers(headers);
            requestHeaders.set("accept", "text/html");
            return auth.handler(new Request(url, { headers: requestHeaders, redirect: "manual" }));
        }
        function confirmEndSession(confirmation) {
            var requestHeaders = new Headers(headers);
            var confirmationCookies = confirmation.headers
                .getSetCookie()
                .map(function (cookie) { return cookie.split(";")[0]; });
            requestHeaders.set("cookie", __spreadArray([requestHeaders.get("cookie")], confirmationCookies, true).join("; "));
            requestHeaders.set("accept", "text/html");
            requestHeaders.set("content-type", "application/x-www-form-urlencoded");
            requestHeaders.set("origin", baseURL);
            return auth.handler(new Request("".concat(baseURL, "/api/auth/oauth2/end-session/confirm"), {
                method: "POST",
                headers: requestHeaders,
                body: new URLSearchParams({ action: "confirm" }),
                redirect: "manual",
            }));
        }
        function replaceRegisteredUris(clientId, update) {
            return __awaiter(this, void 0, void 0, function () {
                var context;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, auth.$context];
                        case 1:
                            context = _a.sent();
                            return [4 /*yield*/, context.adapter.update({
                                    model: "oauthClient",
                                    where: [{ field: "clientId", value: clientId }],
                                    update: update,
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function disableClient(clientId) {
            return __awaiter(this, void 0, void 0, function () {
                var context;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, auth.$context];
                        case 1:
                            context = _a.sent();
                            return [4 /*yield*/, context.adapter.update({
                                    model: "oauthClient",
                                    where: [{ field: "clientId", value: clientId }],
                                    update: { disabled: true },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function denyConsent(consentLocation) {
            return auth.api.oauth2Consent({
                headers: new Headers(headers),
                body: {
                    accept: false,
                    oauth_query: consentLocation.searchParams.toString(),
                },
            });
        }
        var baseURL, _a, auth, client, signInWithTestUser, headers;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    baseURL = (_b = input.baseURL) !== null && _b !== void 0 ? _b : "http://localhost:3000";
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: baseURL,
                            plugins: [
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    allowInsecureRedirectUri: input.allowInsecureRedirectUri,
                                    validateRedirectUri: input.validateRedirectUri,
                                }),
                                (0, jwt_1.jwt)(),
                            ],
                        }, { clientOptions: { plugins: [(0, client_1.oauthProviderClient)()] } })];
                case 1:
                    _a = _c.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_c.sent()).headers;
                    return [2 /*return*/, {
                            auth: auth,
                            baseURL: baseURL,
                            createClient: createClient,
                            disableClient: disableClient,
                            denyConsent: denyConsent,
                            authorize: authorize,
                            exchangeCode: exchangeCode,
                            endSession: endSession,
                            confirmEndSession: confirmEndSession,
                            replaceRegisteredUris: replaceRegisteredUris,
                        }];
            }
        });
    });
}
/**
 * @see https://github.com/better-auth/better-auth/issues/11277
 */
(0, vitest_1.describe)("http redirect URIs on private networks", function () {
    (0, vitest_1.it)("rejects a non-loopback http redirect URI at registration by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(provider.createClient({ redirect_uris: [lanRedirect] })).rejects.toThrow()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows the server error page instead of redirecting to a registered http URI the policy rejects", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, client, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: ["https://rp.example.com/callback"],
                        })];
                case 2:
                    client = _a.sent();
                    return [4 /*yield*/, provider.replaceRegisteredUris(client.client_id, {
                            redirectUris: [lanRedirect],
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, provider.authorize(client.client_id, lanRedirect)];
                case 4:
                    location = (_a.sent()).location;
                    (0, vitest_1.expect)(location.origin).toBe(provider.baseURL);
                    (0, vitest_1.expect)(location.pathname).toBe("/api/auth/error");
                    (0, vitest_1.expect)(location.searchParams.get("error")).toBe("invalid_request");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts an http redirect URI the predicate allows through authorize and token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, client, _a, location, codeVerifier, code, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: allowLanOrigin,
                    })];
                case 1:
                    provider = _b.sent();
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: [lanRedirect],
                        })];
                case 2:
                    client = _b.sent();
                    return [4 /*yield*/, provider.authorize(client.client_id, lanRedirect)];
                case 3:
                    _a = _b.sent(), location = _a.location, codeVerifier = _a.codeVerifier;
                    (0, vitest_1.expect)("".concat(location.origin).concat(location.pathname)).toBe(lanRedirect);
                    code = location.searchParams.get("code");
                    (0, vitest_1.expect)(code).toBeTypeOf("string");
                    return [4 /*yield*/, provider.exchangeCode({
                            clientId: client.client_id,
                            code: code,
                            codeVerifier: codeVerifier,
                            redirectUri: lanRedirect,
                        })];
                case 4:
                    token = _b.sent();
                    (0, vitest_1.expect)(token.status).toBe(200);
                    (0, vitest_1.expect)(token.body.id_token).toBeTypeOf("string");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects an http origin the predicate does not allow", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: allowLanOrigin,
                    })];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(provider.createClient({
                            redirect_uris: ["http://10.0.0.5:8000/callback"],
                        })).rejects.toThrow()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(provider.createClient({
                            redirect_uris: ["https://rp.example.com/callback"],
                            post_logout_redirect_uris: ["http://10.0.0.5:8000/logged-out"],
                        })).rejects.toThrow()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fails closed when the predicate throws", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: function () {
                            throw new Error("policy unavailable");
                        },
                    })];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(provider.createClient({ redirect_uris: [lanRedirect] })).rejects.toThrow()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts an http post-logout redirect URI the predicate allows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, client, response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: allowLanOrigin,
                    })];
                case 1:
                    provider = _b.sent();
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: [lanRedirect],
                            post_logout_redirect_uris: [lanLogoutRedirect],
                        })];
                case 2:
                    client = _b.sent();
                    return [4 /*yield*/, provider.endSession(client.client_id, lanLogoutRedirect)];
                case 3:
                    response = _b.sent();
                    (0, vitest_1.expect)(response.status).toBe(200);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, response.text()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toContain("data-oidc-logout-confirmation");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects a registered http post-logout redirect URI the policy rejects", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, client, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: ["https://rp.example.com/callback"],
                        })];
                case 2:
                    client = _a.sent();
                    return [4 /*yield*/, provider.replaceRegisteredUris(client.client_id, {
                            postLogoutRedirectUris: [lanLogoutRedirect],
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, provider.endSession(client.client_id, lanLogoutRedirect)];
                case 4:
                    response = _a.sent();
                    (0, vitest_1.expect)(response.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("allowInsecureRedirectUri boundaries", function () {
    vitest_1.it.each([
        "http://user:pass@192.168.1.50:8000/logged-out",
        "http://user:pass@localhost:8000/logged-out",
        "https://user:pass@rp.example.com/logged-out",
    ])("rejects credentials in the post-logout redirect URI %s", function (uri) { return __awaiter(void 0, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: allowLanOrigin,
                    })];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(provider.createClient({
                            redirect_uris: [lanRedirect],
                            post_logout_redirect_uris: [uri],
                        })).rejects.toMatchObject({ body: { error: "invalid_redirect_uri" } })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * @see https://datatracker.ietf.org/doc/html/rfc7591#section-3.2.2
     */
    (0, vitest_1.it)("reports a rejected http post-logout redirect URI as invalid_redirect_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(provider.createClient({
                            redirect_uris: ["https://rp.example.com/callback"],
                            post_logout_redirect_uris: [lanLogoutRedirect],
                        })).rejects.toMatchObject({ body: { error: "invalid_redirect_uri" } })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps the exact loopback host rule for native clients", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: function (url) { return url.origin === "http://127.0.0.1"; },
                    })];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(provider.createClient({
                            redirect_uris: ["http://127.1/callback"],
                            application_type: "native",
                        })).rejects.toThrow()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not redirect to a stale logout confirmation after the predicate stops allowing it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var allowed, provider, client, confirmation, completed, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    allowed = true;
                    return [4 /*yield*/, setupProvider({
                            allowInsecureRedirectUri: function (url) { return allowed && allowLanOrigin(url); },
                        })];
                case 1:
                    provider = _b.sent();
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: [lanRedirect],
                            post_logout_redirect_uris: [lanLogoutRedirect],
                        })];
                case 2:
                    client = _b.sent();
                    return [4 /*yield*/, provider.endSession(client.client_id, lanLogoutRedirect)];
                case 3:
                    confirmation = _b.sent();
                    (0, vitest_1.expect)(confirmation.status).toBe(200);
                    allowed = false;
                    return [4 /*yield*/, provider.confirmEndSession(confirmation)];
                case 4:
                    completed = _b.sent();
                    (0, vitest_1.expect)(completed.status).toBe(200);
                    (0, vitest_1.expect)(completed.headers.get("location")).toBeNull();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, completed.text()];
                case 5:
                    _a.apply(void 0, [_b.sent()]).toContain("The requested post-logout redirect was not registered.");
                    return [2 /*return*/];
            }
        });
    }); });
});
/**
 * @see https://github.com/better-auth/better-auth/issues/11445
 */
(0, vitest_1.describe)("web clients on localhost", function () {
    var localhostRedirect = "http://localhost:5173/auth/callback";
    (0, vitest_1.it)("rejects a web client localhost redirect URI by default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(provider.createClient({
                            redirect_uris: [localhostRedirect],
                            application_type: "web",
                        })).rejects.toThrow()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts a web client localhost redirect URI the predicate allows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, client, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: function (url) { return url.hostname === "localhost"; },
                    })];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: [localhostRedirect],
                            application_type: "web",
                        })];
                case 2:
                    client = _a.sent();
                    return [4 /*yield*/, provider.authorize(client.client_id, localhostRedirect)];
                case 3:
                    location = (_a.sent()).location;
                    (0, vitest_1.expect)(client.redirect_uris).toEqual([localhostRedirect]);
                    (0, vitest_1.expect)("".concat(location.origin).concat(location.pathname)).toBe(localhostRedirect);
                    (0, vitest_1.expect)(location.searchParams.get("code")).toBeTypeOf("string");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects a changed port for a web client localhost redirect URI", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, client, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: function (url) { return url.hostname === "localhost"; },
                    })];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: [localhostRedirect],
                            application_type: "web",
                        })];
                case 2:
                    client = _a.sent();
                    return [4 /*yield*/, provider.authorize(client.client_id, "http://localhost:9999/auth/callback")];
                case 3:
                    location = (_a.sent()).location;
                    (0, vitest_1.expect)(location.origin).toBe(provider.baseURL);
                    (0, vitest_1.expect)(location.pathname).toBe("/api/auth/error");
                    (0, vitest_1.expect)(location.searchParams.has("code")).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects a stored web client localhost redirect URI without the predicate", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, client, location;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: ["https://rp.example.com/callback"],
                            application_type: "web",
                        })];
                case 2:
                    client = _a.sent();
                    return [4 /*yield*/, provider.replaceRegisteredUris(client.client_id, {
                            redirectUris: [localhostRedirect],
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, provider.authorize(client.client_id, localhostRedirect)];
                case 4:
                    location = (_a.sent()).location;
                    (0, vitest_1.expect)(location.origin).toBe(provider.baseURL);
                    (0, vitest_1.expect)(location.pathname).toBe("/api/auth/error");
                    (0, vitest_1.expect)(location.searchParams.get("error")).toBe("invalid_request");
                    return [2 /*return*/];
            }
        });
    }); });
});
/**
 * @see https://github.com/better-auth/better-auth/issues/11740
 */
(0, vitest_1.describe)("http issuer on a private network", function () {
    (0, vitest_1.it)("uses the configured http issuer in discovery, the authorization response, and the ID token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, expectedIssuer, redirectUri, client, discovery, _a, location, codeVerifier, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, setupProvider({ baseURL: "http://10.0.0.5:3000" })];
                case 1:
                    provider = _b.sent();
                    expectedIssuer = "http://10.0.0.5:3000/api/auth";
                    redirectUri = "https://rp.example.com/callback";
                    return [4 /*yield*/, provider.createClient({
                            redirect_uris: [redirectUri],
                        })];
                case 2:
                    client = _b.sent();
                    return [4 /*yield*/, provider.auth.api.getOpenIdConfig()];
                case 3:
                    discovery = _b.sent();
                    return [4 /*yield*/, provider.authorize(client.client_id, redirectUri)];
                case 4:
                    _a = _b.sent(), location = _a.location, codeVerifier = _a.codeVerifier;
                    return [4 /*yield*/, provider.exchangeCode({
                            clientId: client.client_id,
                            code: location.searchParams.get("code"),
                            codeVerifier: codeVerifier,
                            redirectUri: redirectUri,
                        })];
                case 5:
                    token = _b.sent();
                    (0, vitest_1.expect)(discovery.issuer).toBe(expectedIssuer);
                    (0, vitest_1.expect)(location.searchParams.get("iss")).toBe(expectedIssuer);
                    (0, vitest_1.expect)((0, jose_1.decodeJwt)(token.body.id_token).iss).toBe(expectedIssuer);
                    return [2 /*return*/];
            }
        });
    }); });
});
/**
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1
 * @see https://datatracker.ietf.org/doc/html/rfc9700#section-4.11.2
 */
(0, vitest_1.describe)("consent denial redirect trust", function () {
    function startConsent(provider, redirectUris) {
        return __awaiter(this, void 0, void 0, function () {
            var client, location;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.createClient({
                            redirect_uris: redirectUris,
                            skip_consent: false,
                        })];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, provider.authorize(client.client_id, redirectUris[0])];
                    case 2:
                        location = (_a.sent()).location;
                        (0, vitest_1.expect)(location.pathname).toBe("/consent");
                        return [2 /*return*/, { client: client, consentLocation: location }];
                }
            });
        });
    }
    function expectServerErrorPage(provider, result) {
        var url = new URL(result.url);
        (0, vitest_1.expect)(result.redirect).toBe(true);
        (0, vitest_1.expect)(url.origin).toBe(provider.baseURL);
        (0, vitest_1.expect)(url.pathname).toBe("/api/auth/error");
        (0, vitest_1.expect)(url.searchParams.get("error")).toBe("access_denied");
    }
    (0, vitest_1.it)("redirects the denial to the registered redirect URI", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, consentLocation, result, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, startConsent(provider, [
                            "https://rp.example.com/callback",
                        ])];
                case 2:
                    consentLocation = (_a.sent()).consentLocation;
                    return [4 /*yield*/, provider.denyConsent(consentLocation)];
                case 3:
                    result = _a.sent();
                    url = new URL(result.url);
                    (0, vitest_1.expect)(result.redirect).toBe(true);
                    (0, vitest_1.expect)(url.origin + url.pathname).toBe("https://rp.example.com/callback");
                    (0, vitest_1.expect)(url.searchParams.get("error")).toBe("access_denied");
                    (0, vitest_1.expect)(url.searchParams.get("state")).toBe("state");
                    (0, vitest_1.expect)(url.searchParams.get("iss")).toBe("".concat(provider.baseURL, "/api/auth"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows the server error page once allowInsecureRedirectUri no longer allows the http redirect URI", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lanAllowed, provider, consentLocation, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    lanAllowed = true;
                    return [4 /*yield*/, setupProvider({
                            allowInsecureRedirectUri: function (url) { return lanAllowed && allowLanOrigin(url); },
                        })];
                case 1:
                    provider = _c.sent();
                    return [4 /*yield*/, startConsent(provider, [lanRedirect])];
                case 2:
                    consentLocation = (_c.sent()).consentLocation;
                    lanAllowed = false;
                    _a = expectServerErrorPage;
                    _b = [provider];
                    return [4 /*yield*/, provider.denyConsent(consentLocation)];
                case 3:
                    _a.apply(void 0, _b.concat([_c.sent()]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("still redirects the denial to an http redirect URI the policy allows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, consentLocation, result, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, setupProvider({
                        allowInsecureRedirectUri: allowLanOrigin,
                    })];
                case 1:
                    provider = _a.sent();
                    return [4 /*yield*/, startConsent(provider, [lanRedirect])];
                case 2:
                    consentLocation = (_a.sent()).consentLocation;
                    return [4 /*yield*/, provider.denyConsent(consentLocation)];
                case 3:
                    result = _a.sent();
                    url = new URL(result.url);
                    (0, vitest_1.expect)(url.origin + url.pathname).toBe(lanRedirect);
                    (0, vitest_1.expect)(url.searchParams.get("error")).toBe("access_denied");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows the server error page once validateRedirectUri rejects the redirect URI", function () { return __awaiter(void 0, void 0, void 0, function () {
        var validatorAccepts, provider, consentLocation, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    validatorAccepts = true;
                    return [4 /*yield*/, setupProvider({
                            validateRedirectUri: function (_uri, _registered, defaultResult) {
                                return validatorAccepts && defaultResult;
                            },
                        })];
                case 1:
                    provider = _c.sent();
                    return [4 /*yield*/, startConsent(provider, [
                            "https://rp.example.com/callback",
                        ])];
                case 2:
                    consentLocation = (_c.sent()).consentLocation;
                    validatorAccepts = false;
                    _a = expectServerErrorPage;
                    _b = [provider];
                    return [4 /*yield*/, provider.denyConsent(consentLocation)];
                case 3:
                    _a.apply(void 0, _b.concat([_c.sent()]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows the server error page once the client is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, _a, client, consentLocation, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _d.sent();
                    return [4 /*yield*/, startConsent(provider, [
                            "https://rp.example.com/callback",
                        ])];
                case 2:
                    _a = _d.sent(), client = _a.client, consentLocation = _a.consentLocation;
                    return [4 /*yield*/, provider.disableClient(client.client_id)];
                case 3:
                    _d.sent();
                    _b = expectServerErrorPage;
                    _c = [provider];
                    return [4 /*yield*/, provider.denyConsent(consentLocation)];
                case 4:
                    _b.apply(void 0, _c.concat([_d.sent()]));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows the server error page once the redirect URI is removed from the client", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, _a, client, consentLocation, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, setupProvider({})];
                case 1:
                    provider = _d.sent();
                    return [4 /*yield*/, startConsent(provider, [
                            "https://rp.example.com/callback",
                        ])];
                case 2:
                    _a = _d.sent(), client = _a.client, consentLocation = _a.consentLocation;
                    return [4 /*yield*/, provider.replaceRegisteredUris(client.client_id, {
                            redirectUris: ["https://rp.example.com/other"],
                        })];
                case 3:
                    _d.sent();
                    _b = expectServerErrorPage;
                    _c = [provider];
                    return [4 /*yield*/, provider.denyConsent(consentLocation)];
                case 4:
                    _b.apply(void 0, _c.concat([_d.sent()]));
                    return [2 /*return*/];
            }
        });
    }); });
});
