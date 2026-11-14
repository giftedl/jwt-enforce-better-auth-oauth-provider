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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("better-auth/api");
var client_1 = require("better-auth/client");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var client_2 = require("../client");
var oauth_1 = require("../oauth");
(0, vitest_1.describe)("oauthClient", function () { return __awaiter(void 0, void 0, void 0, function () {
    var providerId, baseUrl, rpBaseUrl, redirectUri, allowedUser, forbiddenUser, clientPrivileges, _a, auth, customFetchImpl, signInWithUser, allowedUserHeaders, forbiddenUserHeaders, unauthedAuthClient, allowedAuthClient, forbiddenAuthClient, testClientInput, oauthClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                providerId = "test";
                baseUrl = "http://localhost:3000";
                rpBaseUrl = "https://rp.example.com";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
                allowedUser = {
                    email: "allowed@test.com",
                    password: "test123456",
                    name: "allowed user",
                };
                forbiddenUser = {
                    email: "forbidden@test.com",
                    password: "test123456",
                    name: "forbidden user",
                };
                clientPrivileges = vitest_1.vi.fn(function (_a) {
                    var user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.email) === allowedUser.email) {
                        return true;
                    }
                    return false;
                });
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["openid", "profile", "email", "offline_access", "m2m:read"],
                                clientReference: function () {
                                    return "oauth-client-test";
                                },
                                clientPrivileges: clientPrivileges,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl, signInWithUser = _a.signInWithUser;
                return [4 /*yield*/, auth.api.signUpEmail({
                        body: allowedUser,
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, auth.api.signUpEmail({
                        body: forbiddenUser,
                    })];
            case 3:
                _b.sent();
                return [4 /*yield*/, signInWithUser(allowedUser.email, allowedUser.password)];
            case 4:
                allowedUserHeaders = (_b.sent()).headers;
                return [4 /*yield*/, signInWithUser(forbiddenUser.email, forbiddenUser.password)];
            case 5:
                forbiddenUserHeaders = (_b.sent()).headers;
                unauthedAuthClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
                allowedAuthClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: allowedUserHeaders,
                    },
                });
                forbiddenAuthClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: forbiddenUserHeaders,
                    },
                });
                testClientInput = {
                    client_name: "accept name",
                    client_uri: "https://example.com/ok",
                    logo_uri: "https://example.com/logo.png",
                    contacts: ["test@example.com"],
                    tos_uri: "https://example.com/terms",
                    policy_uri: "https://example.com/policy",
                };
                (0, vitest_1.beforeEach)(function () {
                    clientPrivileges.mockClear();
                });
                (0, vitest_1.it)("should not create client with unauthenticated session", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, unauthedAuthClient.oauth2.createClient(__assign(__assign({}, testClientInput), { redirect_uris: [redirectUri] }))];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.error).toMatchObject({
                                    status: 401,
                                    statusText: "UNAUTHORIZED",
                                });
                                (0, vitest_1.expect)(client.data).toMatchObject({});
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not create client with forbidden user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, forbiddenAuthClient.oauth2.createClient(__assign(__assign({}, testClientInput), { redirect_uris: [redirectUri] }))];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.error).toMatchObject({
                                    status: 401,
                                    statusText: "UNAUTHORIZED",
                                });
                                (0, vitest_1.expect)(client.data).toMatchObject({});
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should create client with allowed user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    var _a, _b, _c, _d, _e, _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, allowedAuthClient.oauth2.createClient(__assign(__assign({}, testClientInput), { redirect_uris: [redirectUri] }))];
                            case 1:
                                client = _h.sent();
                                (0, vitest_1.expect)((_a = client === null || client === void 0 ? void 0 : client.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = client === null || client === void 0 ? void 0 : client.data) === null || _b === void 0 ? void 0 : _b.user_id).toBeUndefined();
                                (0, vitest_1.expect)((_c = client === null || client === void 0 ? void 0 : client.data) === null || _c === void 0 ? void 0 : _c.reference_id).toBeDefined();
                                (0, vitest_1.expect)((_d = client === null || client === void 0 ? void 0 : client.data) === null || _d === void 0 ? void 0 : _d.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_e = client === null || client === void 0 ? void 0 : client.data) === null || _e === void 0 ? void 0 : _e.client_id_issued_at).toBeDefined();
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)((_g = (_f = clientPrivileges.mock.calls[0]) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.clientId).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not create client with forbidden user via admin api", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: forbiddenUserHeaders,
                                        body: __assign(__assign({}, testClientInput), { redirect_uris: [redirectUri], skip_consent: true }),
                                    })];
                            case 1:
                                _a.sent();
                                throw new Error("should have thrown");
                            case 2:
                                error_1 = _a.sent();
                                (0, vitest_1.expect)(error_1).toBeInstanceOf(api_1.APIError);
                                if (error_1 instanceof api_1.APIError) {
                                    (0, vitest_1.expect)(error_1.statusCode).toBe(401);
                                    (0, vitest_1.expect)(error_1.status).toBe("UNAUTHORIZED");
                                }
                                return [3 /*break*/, 3];
                            case 3:
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should create client with allowed user via admin api", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var adminClient, client;
                    var _a, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: allowedUserHeaders,
                                    body: __assign(__assign({}, testClientInput), { redirect_uris: [redirectUri] }),
                                })];
                            case 1:
                                adminClient = _f.sent();
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.client_id).toBeDefined();
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.user_id).toBeUndefined();
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.reference_id).toBeDefined();
                                (0, vitest_1.expect)(adminClient === null || adminClient === void 0 ? void 0 : adminClient.client_secret).toBeDefined();
                                (0, vitest_1.expect)(adminClient.client_id_issued_at).toBeDefined();
                                return [4 /*yield*/, allowedAuthClient.oauth2.getClient({
                                        query: {
                                            client_id: adminClient.client_id,
                                        },
                                    })];
                            case 2:
                                client = _f.sent();
                                (0, vitest_1.expect)((_a = client === null || client === void 0 ? void 0 : client.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = client === null || client === void 0 ? void 0 : client.data) === null || _b === void 0 ? void 0 : _b.user_id).toBeUndefined();
                                (0, vitest_1.expect)((_c = client === null || client === void 0 ? void 0 : client.data) === null || _c === void 0 ? void 0 : _c.reference_id).toBeDefined();
                                (0, vitest_1.expect)((_d = client === null || client === void 0 ? void 0 : client.data) === null || _d === void 0 ? void 0 : _d.client_secret).toBeUndefined();
                                (0, vitest_1.expect)((_e = client.data) === null || _e === void 0 ? void 0 : _e.client_id_issued_at).toBeDefined();
                                oauthClient = client.data;
                                oauthClient.client_secret = adminClient.client_secret;
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("requires a distinct privilege action to configure client_credentials scopes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var adminClient;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: allowedUserHeaders,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        client_credentials_scopes: ["m2m:read", "m2m:read"],
                                    },
                                })];
                            case 1:
                                adminClient = _c.sent();
                                (0, vitest_1.expect)(adminClient.client_credentials_scopes).toEqual(["m2m:read"]);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenNthCalledWith(1, vitest_1.expect.objectContaining({ action: "create" }));
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenNthCalledWith(2, vitest_1.expect.objectContaining({
                                    action: "configure-client-credentials-scopes",
                                }));
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(2);
                                (0, vitest_1.expect)((_b = (_a = clientPrivileges.mock.calls[1]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.clientId).toBeUndefined();
                                clientPrivileges.mockClear();
                                return [4 /*yield*/, auth.api.adminUpdateOAuthClient({
                                        headers: allowedUserHeaders,
                                        body: {
                                            client_id: adminClient.client_id,
                                            update: { client_credentials_scopes: ["m2m:read"] },
                                        },
                                    })];
                            case 2:
                                _c.sent();
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenNthCalledWith(1, vitest_1.expect.objectContaining({
                                    action: "update",
                                    clientId: adminClient.client_id,
                                }));
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenNthCalledWith(2, vitest_1.expect.objectContaining({
                                    action: "configure-client-credentials-scopes",
                                    clientId: adminClient.client_id,
                                }));
                                return [4 /*yield*/, allowedAuthClient.oauth2.deleteClient({
                                        client_id: adminClient.client_id,
                                    })];
                            case 3:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("clears client_credentials authority when the grant is removed and does not restore it", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var adminClient, removed, restoredGrant, cleared;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: allowedUserHeaders,
                                    body: {
                                        grant_types: ["authorization_code", "client_credentials"],
                                        redirect_uris: [redirectUri],
                                        client_credentials_scopes: ["m2m:read"],
                                    },
                                })];
                            case 1:
                                adminClient = _a.sent();
                                clientPrivileges.mockClear();
                                return [4 /*yield*/, auth.api.adminUpdateOAuthClient({
                                        headers: allowedUserHeaders,
                                        body: {
                                            client_id: adminClient.client_id,
                                            update: {
                                                grant_types: ["authorization_code"],
                                            },
                                        },
                                    })];
                            case 2:
                                removed = _a.sent();
                                (0, vitest_1.expect)(removed.client_credentials_scopes).toEqual([]);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: "update" }));
                                clientPrivileges.mockClear();
                                return [4 /*yield*/, auth.api.adminUpdateOAuthClient({
                                        headers: allowedUserHeaders,
                                        body: {
                                            client_id: adminClient.client_id,
                                            update: {
                                                grant_types: ["authorization_code", "client_credentials"],
                                            },
                                        },
                                    })];
                            case 3:
                                restoredGrant = _a.sent();
                                (0, vitest_1.expect)(restoredGrant.client_credentials_scopes).toEqual([]);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                clientPrivileges.mockClear();
                                return [4 /*yield*/, auth.api.adminUpdateOAuthClient({
                                        headers: allowedUserHeaders,
                                        body: {
                                            client_id: adminClient.client_id,
                                            update: { client_credentials_scopes: [] },
                                        },
                                    })];
                            case 4:
                                cleared = _a.sent();
                                (0, vitest_1.expect)(cleared.client_credentials_scopes).toEqual([]);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: "update" }));
                                return [4 /*yield*/, allowedAuthClient.oauth2.deleteClient({
                                        client_id: adminClient.client_id,
                                    })];
                            case 5:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not get a client with forbidden user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, forbiddenAuthClient.oauth2.getClient({
                                    query: {
                                        client_id: oauthClient.client_id,
                                    },
                                })];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.error).toMatchObject({
                                    status: 401,
                                    statusText: "UNAUTHORIZED",
                                });
                                (0, vitest_1.expect)(client.data).toMatchObject({});
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get a client with allowed user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, _a, client_secret, check, _clientSecret, expected;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, allowedAuthClient.oauth2.getClient({
                                    query: {
                                        client_id: oauthClient.client_id,
                                    },
                                })];
                            case 1:
                                client = _c.sent();
                                _a = (_b = client.data) !== null && _b !== void 0 ? _b : {}, client_secret = _a.client_secret, check = __rest(_a, ["client_secret"]);
                                _clientSecret = oauthClient.client_secret, expected = __rest(oauthClient, ["client_secret"]);
                                (0, vitest_1.expect)(client_secret).toBeUndefined();
                                (0, vitest_1.expect)(check).toMatchObject(expected);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                    action: "read",
                                    clientId: oauthClient.client_id,
                                }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get public-only information about a client with any user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var allowedClient, forbiddenClient;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, allowedAuthClient.oauth2.publicClient({
                                    query: {
                                        client_id: oauthClient.client_id,
                                    },
                                })];
                            case 1:
                                allowedClient = _a.sent();
                                (0, vitest_1.expect)(allowedClient.data).toMatchObject(__assign({ client_id: oauthClient.client_id }, testClientInput));
                                return [4 /*yield*/, forbiddenAuthClient.oauth2.publicClient({
                                        query: {
                                            client_id: oauthClient.client_id,
                                        },
                                    })];
                            case 2:
                                forbiddenClient = _a.sent();
                                (0, vitest_1.expect)(forbiddenClient.data).toMatchObject(__assign({ client_id: oauthClient.client_id }, testClientInput));
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not get clients with forbidden user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clients;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, forbiddenAuthClient.oauth2.getClients()];
                            case 1:
                                clients = _a.sent();
                                (0, vitest_1.expect)(clients.error).toMatchObject({
                                    status: 401,
                                    statusText: "UNAUTHORIZED",
                                });
                                (0, vitest_1.expect)(clients.data).toMatchObject({});
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get clients with allowed user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clients, _a, _, client, _b, client_secret, check, _clientSecret, expected;
                    var _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, allowedAuthClient.oauth2.getClients()];
                            case 1:
                                clients = _g.sent();
                                (0, vitest_1.expect)((_c = clients === null || clients === void 0 ? void 0 : clients.data) === null || _c === void 0 ? void 0 : _c.length).toBe(2);
                                _a = (_d = clients.data) !== null && _d !== void 0 ? _d : [], _ = _a[0], client = _a[1];
                                _b = client !== null && client !== void 0 ? client : {}, client_secret = _b.client_secret, check = __rest(_b, ["client_secret"]);
                                _clientSecret = oauthClient.client_secret, expected = __rest(oauthClient, ["client_secret"]);
                                (0, vitest_1.expect)(client_secret).toBeUndefined();
                                (0, vitest_1.expect)(check).toMatchObject(expected);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)((_f = (_e = clientPrivileges.mock.calls[0]) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.clientId).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not update the client with forbidden user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var newRedirectUri, client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                newRedirectUri = "https://example.com/api/auth/oauth2/callback/".concat(providerId);
                                return [4 /*yield*/, forbiddenAuthClient.oauth2.updateClient({
                                        client_id: oauthClient.client_id,
                                        update: {
                                            redirect_uris: [redirectUri, newRedirectUri],
                                        },
                                    })];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.error).toMatchObject({
                                    status: 401,
                                    statusText: "UNAUTHORIZED",
                                });
                                (0, vitest_1.expect)(client.data).toMatchObject({});
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should update the client with allowed user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var newRedirectUri, client, _a, client_secret, check, _clientSecret, expected;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                newRedirectUri = "https://example.com/api/auth/oauth2/callback/".concat(providerId);
                                return [4 /*yield*/, allowedAuthClient.oauth2.updateClient({
                                        client_id: oauthClient.client_id,
                                        update: {
                                            redirect_uris: [redirectUri, newRedirectUri],
                                        },
                                    })];
                            case 1:
                                client = _c.sent();
                                _a = (_b = client.data) !== null && _b !== void 0 ? _b : {}, client_secret = _a.client_secret, check = __rest(_a, ["client_secret"]);
                                _clientSecret = oauthClient.client_secret, expected = __rest(oauthClient, ["client_secret"]);
                                (0, vitest_1.expect)(client_secret).toBeUndefined();
                                (0, vitest_1.expect)(check).toMatchObject(__assign(__assign({}, expected), { redirect_uris: [redirectUri, newRedirectUri] }));
                                oauthClient = client.data;
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                    action: "update",
                                    clientId: oauthClient.client_id,
                                }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not rotate the client secret with forbidden user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, forbiddenAuthClient.oauth2.client.rotateSecret({
                                    client_id: oauthClient.client_id,
                                })];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.error).toMatchObject({
                                    status: 401,
                                    statusText: "UNAUTHORIZED",
                                });
                                (0, vitest_1.expect)(client.data).toMatchObject({});
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should rotate the client secret with allowed user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, _a, client_secret, check, clientSecret, expected;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, allowedAuthClient.oauth2.client.rotateSecret({
                                    client_id: oauthClient.client_id,
                                })];
                            case 1:
                                client = _c.sent();
                                _a = (_b = client.data) !== null && _b !== void 0 ? _b : {}, client_secret = _a.client_secret, check = __rest(_a, ["client_secret"]);
                                clientSecret = oauthClient.client_secret, expected = __rest(oauthClient, ["client_secret"]);
                                (0, vitest_1.expect)(client_secret).toBeDefined();
                                (0, vitest_1.expect)(client_secret).not.toBe(clientSecret);
                                (0, vitest_1.expect)(check).toMatchObject(expected);
                                oauthClient = client.data;
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                    action: "rotate",
                                    clientId: oauthClient.client_id,
                                }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not delete the client with forbidden user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, forbiddenAuthClient.oauth2.deleteClient({
                                    client_id: oauthClient.client_id,
                                })];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.error).toMatchObject({
                                    status: 401,
                                    statusText: "UNAUTHORIZED",
                                });
                                (0, vitest_1.expect)(client.data).toMatchObject({});
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should delete the client with allowed user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, allowedAuthClient.oauth2.deleteClient({
                                    client_id: oauthClient.client_id,
                                })];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.data).toBeNull();
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                    action: "delete",
                                    clientId: oauthClient.client_id,
                                }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not create client via admin api without a session", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        body: __assign(__assign({}, testClientInput), { redirect_uris: [redirectUri] }),
                                    })];
                            case 1:
                                _a.sent();
                                throw new Error("should have thrown");
                            case 2:
                                error_2 = _a.sent();
                                (0, vitest_1.expect)(error_2).toBeInstanceOf(api_1.APIError);
                                if (error_2 instanceof api_1.APIError) {
                                    (0, vitest_1.expect)(error_2.statusCode).toBe(401);
                                    (0, vitest_1.expect)(error_2.status).toBe("UNAUTHORIZED");
                                }
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * Dynamic Client Registration must enforce the same clientPrivileges "create"
 * gate as the create-client endpoints. The gate lives in the shared creation
 * chokepoint, so every creation route inherits it; a forbidden authenticated
 * user cannot mint a client through registration, while the unauthenticated
 * open-registration path stays open and never consults the hook.
 *
 * @see https://github.com/better-auth/better-auth/security/advisories/GHSA-jmcv-4jfc-6qqj
 */
(0, vitest_1.describe)("oauthClient dynamic registration privileges", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, redirectUri, allowedUser, forbiddenUser, clientPrivileges, _a, auth, customFetchImpl, signInWithUser, allowedUserHeaders, forbiddenUserHeaders, allowedAuthClient, forbiddenAuthClient, unauthedAuthClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = "http://localhost:3000";
                redirectUri = "https://rp.example.com/callback";
                allowedUser = {
                    email: "dcr-allowed@test.com",
                    password: "test123456",
                    name: "dcr allowed user",
                };
                forbiddenUser = {
                    email: "dcr-forbidden@test.com",
                    password: "test123456",
                    name: "dcr forbidden user",
                };
                clientPrivileges = vitest_1.vi.fn(function (_a) {
                    var user = _a.user;
                    if ((user === null || user === void 0 ? void 0 : user.email) === allowedUser.email) {
                        return true;
                    }
                    return false;
                });
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                allowUnauthenticatedClientRegistration: true,
                                clientPrivileges: clientPrivileges,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl, signInWithUser = _a.signInWithUser;
                return [4 /*yield*/, auth.api.signUpEmail({ body: allowedUser })];
            case 2:
                _b.sent();
                return [4 /*yield*/, auth.api.signUpEmail({ body: forbiddenUser })];
            case 3:
                _b.sent();
                return [4 /*yield*/, signInWithUser(allowedUser.email, allowedUser.password)];
            case 4:
                allowedUserHeaders = (_b.sent()).headers;
                return [4 /*yield*/, signInWithUser(forbiddenUser.email, forbiddenUser.password)];
            case 5:
                forbiddenUserHeaders = (_b.sent()).headers;
                allowedAuthClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: allowedUserHeaders },
                });
                forbiddenAuthClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: forbiddenUserHeaders },
                });
                unauthedAuthClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl },
                });
                (0, vitest_1.beforeEach)(function () {
                    clientPrivileges.mockClear();
                });
                (0, vitest_1.it)("should not register a client for a forbidden user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, forbiddenAuthClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                client = _b.sent();
                                (0, vitest_1.expect)(client.error).toMatchObject({
                                    status: 401,
                                    statusText: "UNAUTHORIZED",
                                });
                                (0, vitest_1.expect)((_a = client.data) === null || _a === void 0 ? void 0 : _a.client_secret).toBeUndefined();
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: "create" }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should register a client for an allowed user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, allowedAuthClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                client = _c.sent();
                                (0, vitest_1.expect)((_a = client.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = client.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeDefined();
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: "create" }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should allow unauthenticated public registration without invoking the gate", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, unauthedAuthClient.oauth2.register({
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                client = _d.sent();
                                (0, vitest_1.expect)((_a = client.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = client.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeUndefined();
                                (0, vitest_1.expect)((_c = client.data) === null || _c === void 0 ? void 0 : _c.token_endpoint_auth_method).toBe("none");
                                (0, vitest_1.expect)(client.data).not.toHaveProperty("public");
                                (0, vitest_1.expect)(clientPrivileges).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should allow unauthenticated confidential registration without invoking the gate", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, unauthedAuthClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                client = _d.sent();
                                (0, vitest_1.expect)((_a = client.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = client.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_c = client.data) === null || _c === void 0 ? void 0 : _c.token_endpoint_auth_method).toBe("client_secret_basic");
                                (0, vitest_1.expect)(client.data).not.toHaveProperty("public");
                                (0, vitest_1.expect)(clientPrivileges).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/issues/11589
 */
(0, vitest_1.describe)("clientPrivileges client ID", function () { return __awaiter(void 0, void 0, void 0, function () {
    var redirectUri, owner, collaborator, restrictedClientId, clientPrivileges, _a, auth, signInWithUser, ownerHeaders, collaboratorHeaders, restrictedClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                redirectUri = "https://rp.example.com/callback";
                owner = {
                    email: "owner@test.com",
                    password: "test123456",
                    name: "owner",
                };
                collaborator = {
                    email: "collaborator@test.com",
                    password: "test123456",
                    name: "collaborator",
                };
                restrictedClientId = "";
                clientPrivileges = vitest_1.vi.fn(function (_a) {
                    var user = _a.user, action = _a.action, clientId = _a.clientId;
                    return (user === null || user === void 0 ? void 0 : user.email) !== collaborator.email ||
                        action === "read" ||
                        clientId !== restrictedClientId;
                });
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                clientReference: function () { return "shared-organization"; },
                                clientPrivileges: clientPrivileges,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithUser = _a.signInWithUser;
                return [4 /*yield*/, auth.api.signUpEmail({ body: owner })];
            case 2:
                _b.sent();
                return [4 /*yield*/, auth.api.signUpEmail({ body: collaborator })];
            case 3:
                _b.sent();
                return [4 /*yield*/, signInWithUser(owner.email, owner.password)];
            case 4:
                ownerHeaders = (_b.sent()).headers;
                return [4 /*yield*/, signInWithUser(collaborator.email, collaborator.password)];
            case 5:
                collaboratorHeaders = (_b.sent()).headers;
                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                        headers: ownerHeaders,
                        body: { redirect_uris: [redirectUri] },
                    })];
            case 6:
                restrictedClient = _b.sent();
                restrictedClientId = restrictedClient.client_id;
                (0, vitest_1.beforeEach)(function () {
                    clientPrivileges.mockClear();
                });
                (0, vitest_1.it)("should let a collaborator read but not change a restricted shared client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, _i, _a, action, stored;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, auth.api.getOAuthClient({
                                    headers: collaboratorHeaders,
                                    query: { client_id: restrictedClientId },
                                })];
                            case 1:
                                client = _b.sent();
                                (0, vitest_1.expect)(client.client_id).toBe(restrictedClientId);
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.updateOAuthClient({
                                        headers: collaboratorHeaders,
                                        body: {
                                            client_id: restrictedClientId,
                                            update: { client_name: "renamed" },
                                        },
                                    })).rejects.toMatchObject({ statusCode: 401 })];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.rotateClientSecret({
                                        headers: collaboratorHeaders,
                                        body: { client_id: restrictedClientId },
                                    })).rejects.toMatchObject({ statusCode: 401 })];
                            case 3:
                                _b.sent();
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.deleteOAuthClient({
                                        headers: collaboratorHeaders,
                                        body: { client_id: restrictedClientId },
                                    })).rejects.toMatchObject({ statusCode: 401 })];
                            case 4:
                                _b.sent();
                                for (_i = 0, _a = ["read", "update", "rotate", "delete"]; _i < _a.length; _i++) {
                                    action = _a[_i];
                                    (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: action, clientId: restrictedClientId }));
                                }
                                return [4 /*yield*/, auth.api.getOAuthClient({
                                        headers: ownerHeaders,
                                        query: { client_id: restrictedClientId },
                                    })];
                            case 5:
                                stored = _b.sent();
                                (0, vitest_1.expect)(stored.client_name).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should let a collaborator change another shared client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var otherClient, updated;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: ownerHeaders,
                                    body: { redirect_uris: [redirectUri] },
                                })];
                            case 1:
                                otherClient = _a.sent();
                                return [4 /*yield*/, auth.api.updateOAuthClient({
                                        headers: collaboratorHeaders,
                                        body: {
                                            client_id: otherClient.client_id,
                                            update: { client_name: "renamed" },
                                        },
                                    })];
                            case 2:
                                updated = _a.sent();
                                (0, vitest_1.expect)(updated.client_name).toBe("renamed");
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                    action: "update",
                                    clientId: otherClient.client_id,
                                }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass an unknown client ID to the callback before the lookup", function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, vitest_1.expect)(auth.api.getOAuthClient({
                                    headers: ownerHeaders,
                                    query: { client_id: "unknown-client" },
                                })).rejects.toMatchObject({ statusCode: 404 })];
                            case 1:
                                _a.sent();
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: "read", clientId: "unknown-client" }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("clientPrivileges client ID across owners", function () { return __awaiter(void 0, void 0, void 0, function () {
    var clientPrivileges, _a, auth, signInWithUser, owner, administrator, ownerHeaders, administratorHeaders;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                clientPrivileges = vitest_1.vi.fn(function (_context) { return true; });
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["m2m:read"],
                                clientPrivileges: clientPrivileges,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithUser = _a.signInWithUser;
                owner = {
                    email: "client-owner@test.com",
                    password: "test123456",
                    name: "client owner",
                };
                administrator = {
                    email: "administrator@test.com",
                    password: "test123456",
                    name: "administrator",
                };
                return [4 /*yield*/, auth.api.signUpEmail({ body: owner })];
            case 2:
                _b.sent();
                return [4 /*yield*/, auth.api.signUpEmail({ body: administrator })];
            case 3:
                _b.sent();
                return [4 /*yield*/, signInWithUser(owner.email, owner.password)];
            case 4:
                ownerHeaders = (_b.sent()).headers;
                return [4 /*yield*/, signInWithUser(administrator.email, administrator.password)];
            case 5:
                administratorHeaders = (_b.sent()).headers;
                (0, vitest_1.it)("should pass the client ID when configuring scopes on another owner's client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, updated;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: ownerHeaders,
                                    body: { grant_types: ["client_credentials"] },
                                })];
                            case 1:
                                client = _a.sent();
                                clientPrivileges.mockClear();
                                return [4 /*yield*/, auth.api.adminUpdateOAuthClient({
                                        headers: administratorHeaders,
                                        body: {
                                            client_id: client.client_id,
                                            update: { client_credentials_scopes: ["m2m:read"] },
                                        },
                                    })];
                            case 2:
                                updated = _a.sent();
                                (0, vitest_1.expect)(updated.client_credentials_scopes).toEqual(["m2m:read"]);
                                (0, vitest_1.expect)(clientPrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                    action: "configure-client-credentials-scopes",
                                    clientId: client.client_id,
                                }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
