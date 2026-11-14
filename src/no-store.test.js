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
var oauth2_1 = require("@better-auth/core/oauth2");
var client_1 = require("better-auth/client");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
(0, vitest_1.describe)("oauth credential responses carry no-store", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseURL, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, client, redirectUri, oauthClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseURL = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseURL,
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
                                allowDynamicClientRegistration: true,
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
                    baseURL: baseURL,
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/test");
                oauthClient = null;
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        skip_consent: true,
                                        client_credentials_scopes: ["m2m:read"],
                                    },
                                })];
                            case 1:
                                oauthClient = _a.sent();
                                (0, vitest_1.expect)(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                // RFC 6749 §5.1: the token response carries live credentials.
                (0, vitest_1.it)("sets no-store on a successful token response", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, body, reqHeaders, response, tokens;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, (0, oauth2_1.clientCredentialsTokenRequest)({
                                    options: {
                                        clientId: oauthClient.client_id,
                                        clientSecret: oauthClient.client_secret,
                                        redirectURI: redirectUri,
                                    },
                                })];
                            case 1:
                                _a = _c.sent(), body = _a.body, reqHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: reqHeaders,
                                        onResponse: function (context) {
                                            response = context.response;
                                        },
                                    })];
                            case 2:
                                tokens = _c.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Pragma")).toBe("no-cache");
                                return [2 /*return*/];
                        }
                    });
                }); });
                // The flag applies to thrown errors too: an unknown client reaches the
                // handler, which rejects it, and the error response is still no-store.
                (0, vitest_1.it)("sets no-store on a token error response", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, body, reqHeaders, response;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, oauth2_1.clientCredentialsTokenRequest)({
                                    options: {
                                        clientId: "client-that-does-not-exist",
                                        clientSecret: "wrong",
                                        redirectURI: redirectUri,
                                    },
                                })];
                            case 1:
                                _a = _b.sent(), body = _a.body, reqHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: reqHeaders,
                                        onResponse: function (context) {
                                            response = context.response;
                                        },
                                    })];
                            case 2:
                                _b.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Pragma")).toBe("no-cache");
                                return [2 /*return*/];
                        }
                    });
                }); });
                // RFC 7591 §3.2.1: registration returns 201 and a client_secret to protect.
                (0, vitest_1.it)("sets 201 and no-store on a registration response", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, result;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/oauth2/register", {
                                    method: "POST",
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                    },
                                    onResponse: function (context) {
                                        response = context.response;
                                    },
                                })];
                            case 1:
                                result = _b.sent();
                                (0, vitest_1.expect)((_a = result.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.status).toBe(201);
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Pragma")).toBe("no-cache");
                                return [2 /*return*/];
                        }
                    });
                }); });
                // Introspection exposes token metadata; Better Auth marks it no-store.
                (0, vitest_1.it)("sets no-store on the introspection response", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, body, reqHeaders, tokens, response;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, (0, oauth2_1.clientCredentialsTokenRequest)({
                                    options: {
                                        clientId: oauthClient.client_id,
                                        clientSecret: oauthClient.client_secret,
                                        redirectURI: redirectUri,
                                    },
                                })];
                            case 1:
                                _a = _d.sent(), body = _a.body, reqHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: reqHeaders })];
                            case 2:
                                tokens = _d.sent();
                                return [4 /*yield*/, client.oauth2.introspect({
                                        client_id: oauthClient.client_id,
                                        client_secret: oauthClient.client_secret,
                                        token: (_c = (_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : "",
                                    }, {
                                        headers: {
                                            accept: "application/json",
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        onResponse: function (context) {
                                            response = context.response;
                                        },
                                    })];
                            case 3:
                                _d.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Pragma")).toBe("no-cache");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
