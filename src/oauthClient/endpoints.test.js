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
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("../client");
var oauth_1 = require("../oauth");
(0, vitest_1.describe)("oauthClient", function () { return __awaiter(void 0, void 0, void 0, function () {
    function signedOAuthQuery(clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var signedParams, sig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        signedParams = new URLSearchParams({
                            client_id: clientId,
                            exp: "".concat(Math.floor(Date.now() / 1000) + 60),
                        });
                        return [4 /*yield*/, (0, crypto_1.makeSignature)(signedParams.toString(), auth.options.secret)];
                    case 1:
                        sig = _a.sent();
                        signedParams.set("sig", sig);
                        return [2 /*return*/, signedParams.toString()];
                }
            });
        });
    }
    var providerId, baseUrl, rpBaseUrl, redirectUri, _a, auth, signInWithTestUser, customFetchImpl, headers, authClient, testUiClientInput, oauthClient, oauthPublicClient, oauthUiClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                providerId = "test";
                baseUrl = "http://localhost:3000";
                rpBaseUrl = "https://rp.example.com";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["openid", "profile", "email", "offline_access", "m2m:read"],
                                allowPublicClientPrelogin: true,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                testUiClientInput = {
                    client_name: "accept name",
                    client_uri: "https://example.com/ok",
                    logo_uri: "https://example.com/logo.png",
                    contacts: ["test@example.com"],
                    tos_uri: "https://example.com/terms",
                    policy_uri: "https://example.com/policy",
                };
                (0, vitest_1.it)("round-trips application_type through user create and update with redirect revalidation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var created, invalidUpdate, updated;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.createClient({
                                    application_type: "native",
                                    redirect_uris: ["com.example.desktop:/callback"],
                                    token_endpoint_auth_method: "client_secret_post",
                                })];
                            case 1:
                                created = _d.sent();
                                (0, vitest_1.expect)(created.error).toBeNull();
                                (0, vitest_1.expect)(created.data).toMatchObject({
                                    application_type: "native",
                                    token_endpoint_auth_method: "client_secret_post",
                                });
                                (0, vitest_1.expect)((_a = created.data) === null || _a === void 0 ? void 0 : _a.client_secret).toBeDefined();
                                (0, vitest_1.expect)(created.data).not.toHaveProperty("public");
                                (0, vitest_1.expect)(created.data).not.toHaveProperty("type");
                                return [4 /*yield*/, authClient.oauth2.updateClient({
                                        client_id: created.data.client_id,
                                        update: { application_type: "web" },
                                    })];
                            case 2:
                                invalidUpdate = _d.sent();
                                (0, vitest_1.expect)((_b = invalidUpdate.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                return [4 /*yield*/, authClient.oauth2.updateClient({
                                        client_id: created.data.client_id,
                                        update: {
                                            application_type: "web",
                                            redirect_uris: ["https://client.example.com/callback"],
                                        },
                                    })];
                            case 3:
                                updated = _d.sent();
                                (0, vitest_1.expect)(updated.error).toBeNull();
                                (0, vitest_1.expect)((_c = updated.data) === null || _c === void 0 ? void 0 : _c.application_type).toBe("web");
                                return [4 /*yield*/, authClient.oauth2.deleteClient({
                                        client_id: created.data.client_id,
                                    })];
                            case 4:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("round-trips application_type through admin create and update", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var created, updated;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        application_type: "native",
                                        redirect_uris: ["com.example.admin:/callback"],
                                        token_endpoint_auth_method: "client_secret_basic",
                                    },
                                })];
                            case 1:
                                created = _a.sent();
                                (0, vitest_1.expect)(created.application_type).toBe("native");
                                (0, vitest_1.expect)(created.client_secret).toBeDefined();
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.adminUpdateOAuthClient({
                                        headers: headers,
                                        body: {
                                            client_id: created.client_id,
                                            update: { application_type: "web" },
                                        },
                                    })).rejects.toMatchObject({
                                        body: vitest_1.expect.objectContaining({ error: "invalid_redirect_uri" }),
                                    })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, auth.api.adminUpdateOAuthClient({
                                        headers: headers,
                                        body: {
                                            client_id: created.client_id,
                                            update: {
                                                application_type: "web",
                                                redirect_uris: ["https://admin.example.com/callback"],
                                            },
                                        },
                                    })];
                            case 3:
                                updated = _a.sent();
                                (0, vitest_1.expect)(updated.application_type).toBe("web");
                                (0, vitest_1.expect)(updated).not.toHaveProperty("public");
                                (0, vitest_1.expect)(updated).not.toHaveProperty("type");
                                return [4 /*yield*/, authClient.oauth2.deleteClient({ client_id: created.client_id })];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("fails closed when no privilege callback can configure client_credentials scopes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, vitest_1.expect)(auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        client_credentials_scopes: ["m2m:read"],
                                    },
                                })).rejects.toMatchObject({
                                    status: "UNAUTHORIZED",
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects client_credentials scope authority for public clients", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var publicClient;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, vitest_1.expect)(auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        grant_types: ["client_credentials"],
                                        token_endpoint_auth_method: "none",
                                        client_credentials_scopes: ["m2m:read"],
                                    },
                                })).rejects.toMatchObject({
                                    status: "BAD_REQUEST",
                                })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            grant_types: ["client_credentials"],
                                            token_endpoint_auth_method: "none",
                                        },
                                    })];
                            case 2:
                                publicClient = _a.sent();
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.adminUpdateOAuthClient({
                                        headers: headers,
                                        body: {
                                            client_id: publicClient.client_id,
                                            update: {
                                                client_credentials_scopes: ["m2m:read"],
                                            },
                                        },
                                    })).rejects.toMatchObject({
                                        status: "BAD_REQUEST",
                                    })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, authClient.oauth2.deleteClient({
                                        client_id: publicClient.client_id,
                                    })];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("does not let an administrative update mutate unowned client metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var created, context;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                    },
                                })];
                            case 1:
                                created = _a.sent();
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                context = _a.sent();
                                return [4 /*yield*/, context.adapter.update({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: created.client_id }],
                                        update: { userId: null, referenceId: null },
                                    })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.adminUpdateOAuthClient({
                                        headers: headers,
                                        body: {
                                            client_id: created.client_id,
                                            update: { client_name: "Cross-owner mutation" },
                                        },
                                    })).rejects.toMatchObject({ status: "UNAUTHORIZED" })];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, context.adapter.delete({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: created.client_id }],
                                    })];
                            case 5:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should create clients with minimum requirements", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, publicClient, uiClient;
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                    return __generator(this, function (_o) {
                        switch (_o.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.createClient({
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                client = _o.sent();
                                (0, vitest_1.expect)((_a = client === null || client === void 0 ? void 0 : client.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = client === null || client === void 0 ? void 0 : client.data) === null || _b === void 0 ? void 0 : _b.user_id).toBeDefined();
                                (0, vitest_1.expect)((_c = client === null || client === void 0 ? void 0 : client.data) === null || _c === void 0 ? void 0 : _c.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_d = client.data) === null || _d === void 0 ? void 0 : _d.client_id_issued_at).toBeDefined();
                                oauthClient = client.data;
                                return [4 /*yield*/, authClient.oauth2.createClient({
                                        token_endpoint_auth_method: "none",
                                        redirect_uris: [redirectUri],
                                    })];
                            case 2:
                                publicClient = _o.sent();
                                (0, vitest_1.expect)((_e = publicClient === null || publicClient === void 0 ? void 0 : publicClient.data) === null || _e === void 0 ? void 0 : _e.client_id).toBeDefined();
                                (0, vitest_1.expect)((_f = publicClient === null || publicClient === void 0 ? void 0 : publicClient.data) === null || _f === void 0 ? void 0 : _f.user_id).toBeDefined();
                                (0, vitest_1.expect)((_g = publicClient === null || publicClient === void 0 ? void 0 : publicClient.data) === null || _g === void 0 ? void 0 : _g.client_secret).toBeUndefined();
                                (0, vitest_1.expect)((_h = publicClient.data) === null || _h === void 0 ? void 0 : _h.client_id_issued_at).toBeDefined();
                                oauthPublicClient = publicClient.data;
                                return [4 /*yield*/, authClient.oauth2.createClient(__assign(__assign({}, testUiClientInput), { redirect_uris: [redirectUri] }))];
                            case 3:
                                uiClient = _o.sent();
                                (0, vitest_1.expect)((_j = uiClient === null || uiClient === void 0 ? void 0 : uiClient.data) === null || _j === void 0 ? void 0 : _j.client_id).toBeDefined();
                                (0, vitest_1.expect)((_k = uiClient === null || uiClient === void 0 ? void 0 : uiClient.data) === null || _k === void 0 ? void 0 : _k.user_id).toBeDefined();
                                (0, vitest_1.expect)((_l = uiClient === null || uiClient === void 0 ? void 0 : uiClient.data) === null || _l === void 0 ? void 0 : _l.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_m = uiClient.data) === null || _m === void 0 ? void 0 : _m.client_id_issued_at).toBeDefined();
                                oauthUiClient = uiClient.data;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get a client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, _a, client_secret, check, _clientSecret, expected;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.getClient({
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
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get public-only information about a client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.publicClient({
                                    query: {
                                        client_id: oauthUiClient.client_id,
                                    },
                                })];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.data).toMatchObject(__assign({ client_id: oauthUiClient.client_id }, testUiClientInput));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get public-only information about a client prelogin", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, _a, _b;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _b = (_a = authClient.oauth2).publicClientPrelogin;
                                _c = {
                                    client_id: oauthUiClient.client_id
                                };
                                return [4 /*yield*/, signedOAuthQuery(oauthUiClient.client_id)];
                            case 1: return [4 /*yield*/, _b.apply(_a, [(_c.oauth_query = _d.sent(),
                                        _c)])];
                            case 2:
                                client = _d.sent();
                                (0, vitest_1.expect)(client.data).toMatchObject(__assign({ client_id: oauthUiClient.client_id }, testUiClientInput));
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/8214
                 */
                (0, vitest_1.it)("should reject a prelogin lookup for a client other than the signed query's", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, _a, _b;
                    var _c;
                    var _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _b = (_a = authClient.oauth2).publicClientPrelogin;
                                _c = {
                                    client_id: oauthClient.client_id
                                };
                                return [4 /*yield*/, signedOAuthQuery(oauthUiClient.client_id)];
                            case 1: return [4 /*yield*/, _b.apply(_a, [(_c.oauth_query = _e.sent(),
                                        _c)])];
                            case 2:
                                client = _e.sent();
                                (0, vitest_1.expect)(client.data).toBeNull();
                                (0, vitest_1.expect)((_d = client.error) === null || _d === void 0 ? void 0 : _d.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get user's clients", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clients, _a, client, clientPublic, _b, client_secret, check, _clientSecret, expected, _c, clientSecretPublic, checkPublic, _clientSecretPublic, expectedPublic;
                    var _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.getClients()];
                            case 1:
                                clients = _f.sent();
                                (0, vitest_1.expect)((_d = clients === null || clients === void 0 ? void 0 : clients.data) === null || _d === void 0 ? void 0 : _d.length).toBe(3);
                                _a = (_e = clients.data) !== null && _e !== void 0 ? _e : [], client = _a[0], clientPublic = _a[1];
                                _b = client !== null && client !== void 0 ? client : {}, client_secret = _b.client_secret, check = __rest(_b, ["client_secret"]);
                                _clientSecret = oauthClient.client_secret, expected = __rest(oauthClient, ["client_secret"]);
                                (0, vitest_1.expect)(client_secret).toBeUndefined();
                                (0, vitest_1.expect)(check).toMatchObject(expected);
                                _c = clientPublic !== null && clientPublic !== void 0 ? clientPublic : {}, clientSecretPublic = _c.client_secret, checkPublic = __rest(_c, ["client_secret"]);
                                _clientSecretPublic = oauthPublicClient.client_secret, expectedPublic = __rest(oauthPublicClient, ["client_secret"]);
                                (0, vitest_1.expect)(clientSecretPublic).toBeUndefined();
                                (0, vitest_1.expect)(checkPublic).toMatchObject(expectedPublic);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not allow token endpoint authentication method updates", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, _a, client_secret, check, _clientSecret, expected;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.updateClient({
                                    client_id: oauthClient.client_id,
                                    update: {
                                        // @ts-expect-error
                                        token_endpoint_auth_method: "none",
                                        client_secret: undefined,
                                    },
                                })];
                            case 1:
                                client = _c.sent();
                                _a = (_b = client.data) !== null && _b !== void 0 ? _b : {}, client_secret = _a.client_secret, check = __rest(_a, ["client_secret"]);
                                _clientSecret = oauthClient.client_secret, expected = __rest(oauthClient, ["client_secret"]);
                                (0, vitest_1.expect)(client_secret).toBeUndefined();
                                (0, vitest_1.expect)(check).toMatchObject(expected);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not allow updates to client_secret", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, _a, client_secret, check, _clientSecret, expected;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.updateClient({
                                    client_id: oauthClient.client_id,
                                    update: {
                                        // @ts-expect-error
                                        client_secret: "bad_request",
                                    },
                                })];
                            case 1:
                                client = _c.sent();
                                _a = (_b = client.data) !== null && _b !== void 0 ? _b : {}, client_secret = _a.client_secret, check = __rest(_a, ["client_secret"]);
                                _clientSecret = oauthClient.client_secret, expected = __rest(oauthClient, ["client_secret"]);
                                (0, vitest_1.expect)(client_secret).toBeUndefined();
                                (0, vitest_1.expect)(check).toMatchObject(expected);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should update the client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var newRedirectUri, client, _a, client_secret, check, _clientSecret, expected;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                newRedirectUri = "https://example.com/api/auth/callback/".concat(providerId);
                                return [4 /*yield*/, authClient.oauth2.updateClient({
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
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should rotate the client secret", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, client, _a, client_secret, check, clientSecret, expected;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.client.rotateSecret({ client_id: oauthClient.client_id }, {
                                    onResponse: function (context) {
                                        response = context.response;
                                    },
                                })];
                            case 1:
                                client = _c.sent();
                                _a = (_b = client.data) !== null && _b !== void 0 ? _b : {}, client_secret = _a.client_secret, check = __rest(_a, ["client_secret"]);
                                clientSecret = oauthClient.client_secret, expected = __rest(oauthClient, ["client_secret"]);
                                (0, vitest_1.expect)(client_secret).toBeDefined();
                                (0, vitest_1.expect)(client_secret).not.toBe(clientSecret);
                                (0, vitest_1.expect)(check).toMatchObject(expected);
                                // The rotated secret must not be cached.
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.headers.get("Pragma")).toBe("no-cache");
                                oauthClient = client.data;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should delete the client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.deleteClient({
                                    client_id: oauthClient.client_id,
                                })];
                            case 1:
                                client = _a.sent();
                                (0, vitest_1.expect)(client.data).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauthClient private_key_jwt clients", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, redirectUri, trustedJwksUri, _a, signInWithTestUser, customFetchImpl, headers, authClient, publicJwk, jwksClient, jwksUriClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = "http://localhost:3002";
                redirectUri = "https://rp.example.com/callback";
                trustedJwksUri = "https://trusted.example.com/.well-known/jwks.json";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        trustedOrigins: [
                            "https://trusted.example.com",
                            "https://trusted-updated.example.com",
                        ],
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowPublicClientPrelogin: true,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var publicKey;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, jose_1.generateKeyPair)("RS256", { extractable: true })];
                            case 1:
                                publicKey = (_a.sent()).publicKey;
                                return [4 /*yield*/, (0, jose_1.exportJWK)(publicKey)];
                            case 2:
                                publicJwk = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a bare JWK array when a user creates a client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.createClient({
                                    redirect_uris: [redirectUri],
                                    token_endpoint_auth_method: "private_key_jwt",
                                    // @ts-expect-error RFC 7517 requires a JWK Set object.
                                    jwks: [__assign(__assign({}, publicJwk), { kid: "bare-user-key", alg: "RS256", use: "sig" })],
                                })];
                            case 1:
                                result = _b.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should create private_key_jwt clients with jwks and jwks_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var inlineJwks, inlineClient, remoteClient;
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                inlineJwks = {
                                    keys: [
                                        __assign(__assign({}, publicJwk), { kid: "crud-inline-key", alg: "RS256", use: "sig" }),
                                    ],
                                };
                                return [4 /*yield*/, authClient.oauth2.createClient({
                                        redirect_uris: [redirectUri],
                                        token_endpoint_auth_method: "private_key_jwt",
                                        jwks: inlineJwks,
                                    })];
                            case 1:
                                inlineClient = _j.sent();
                                (0, vitest_1.expect)((_a = inlineClient.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = inlineClient.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeUndefined();
                                (0, vitest_1.expect)((_c = inlineClient.data) === null || _c === void 0 ? void 0 : _c.token_endpoint_auth_method).toBe("private_key_jwt");
                                (0, vitest_1.expect)((_d = inlineClient.data) === null || _d === void 0 ? void 0 : _d.jwks).toEqual(inlineJwks);
                                jwksClient = inlineClient.data;
                                return [4 /*yield*/, authClient.oauth2.createClient({
                                        redirect_uris: [redirectUri],
                                        token_endpoint_auth_method: "private_key_jwt",
                                        jwks_uri: trustedJwksUri,
                                    })];
                            case 2:
                                remoteClient = _j.sent();
                                (0, vitest_1.expect)((_e = remoteClient.data) === null || _e === void 0 ? void 0 : _e.client_id).toBeDefined();
                                (0, vitest_1.expect)((_f = remoteClient.data) === null || _f === void 0 ? void 0 : _f.client_secret).toBeUndefined();
                                (0, vitest_1.expect)((_g = remoteClient.data) === null || _g === void 0 ? void 0 : _g.token_endpoint_auth_method).toBe("private_key_jwt");
                                (0, vitest_1.expect)((_h = remoteClient.data) === null || _h === void 0 ? void 0 : _h.jwks_uri).toBe(trustedJwksUri);
                                jwksUriClient = remoteClient.data;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get private_key_jwt clients without leaking secrets", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var inlineClient, remoteClient;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.getClient({
                                    query: { client_id: jwksClient.client_id },
                                })];
                            case 1:
                                inlineClient = _e.sent();
                                (0, vitest_1.expect)((_a = inlineClient.data) === null || _a === void 0 ? void 0 : _a.client_secret).toBeUndefined();
                                (0, vitest_1.expect)((_b = inlineClient.data) === null || _b === void 0 ? void 0 : _b.jwks).toEqual(jwksClient.jwks);
                                return [4 /*yield*/, authClient.oauth2.getClient({
                                        query: { client_id: jwksUriClient.client_id },
                                    })];
                            case 2:
                                remoteClient = _e.sent();
                                (0, vitest_1.expect)((_c = remoteClient.data) === null || _c === void 0 ? void 0 : _c.client_secret).toBeUndefined();
                                (0, vitest_1.expect)((_d = remoteClient.data) === null || _d === void 0 ? void 0 : _d.jwks_uri).toBe(trustedJwksUri);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should include private_key_jwt clients in the client list", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clients, byId;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.getClients()];
                            case 1:
                                clients = _e.sent();
                                byId = new Map(((_a = clients.data) !== null && _a !== void 0 ? _a : []).map(function (client) { return [client.client_id, client]; }));
                                (0, vitest_1.expect)((_b = byId.get(jwksClient.client_id)) === null || _b === void 0 ? void 0 : _b.token_endpoint_auth_method).toBe("private_key_jwt");
                                (0, vitest_1.expect)((_c = byId.get(jwksClient.client_id)) === null || _c === void 0 ? void 0 : _c.jwks).toEqual(jwksClient.jwks);
                                (0, vitest_1.expect)((_d = byId.get(jwksUriClient.client_id)) === null || _d === void 0 ? void 0 : _d.jwks_uri).toBe(trustedJwksUri);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should preserve inline jwks metadata when updating a private_key_jwt client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var updated;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.updateClient({
                                    client_id: jwksClient.client_id,
                                    update: {
                                        client_name: "Updated inline client",
                                        redirect_uris: [redirectUri, "https://example.com/callback"],
                                    },
                                })];
                            case 1:
                                updated = _d.sent();
                                (0, vitest_1.expect)((_a = updated.data) === null || _a === void 0 ? void 0 : _a.client_name).toBe("Updated inline client");
                                (0, vitest_1.expect)((_b = updated.data) === null || _b === void 0 ? void 0 : _b.jwks).toEqual(jwksClient.jwks);
                                (0, vitest_1.expect)((_c = updated.data) === null || _c === void 0 ? void 0 : _c.redirect_uris).toEqual([
                                    redirectUri,
                                    "https://example.com/callback",
                                ]);
                                jwksClient = updated.data;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should preserve jwks_uri metadata when updating a private_key_jwt client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var updated;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.updateClient({
                                    client_id: jwksUriClient.client_id,
                                    update: {
                                        client_name: "Updated remote client",
                                        redirect_uris: [
                                            redirectUri,
                                            "https://trusted-updated.example.com/callback",
                                        ],
                                    },
                                })];
                            case 1:
                                updated = _d.sent();
                                (0, vitest_1.expect)((_a = updated.data) === null || _a === void 0 ? void 0 : _a.client_name).toBe("Updated remote client");
                                (0, vitest_1.expect)((_b = updated.data) === null || _b === void 0 ? void 0 : _b.jwks_uri).toBe(trustedJwksUri);
                                (0, vitest_1.expect)((_c = updated.data) === null || _c === void 0 ? void 0 : _c.redirect_uris).toEqual([
                                    redirectUri,
                                    "https://trusted-updated.example.com/callback",
                                ]);
                                jwksUriClient = updated.data;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject client secret rotation for private_key_jwt clients", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.client.rotateSecret({
                                    client_id: jwksClient.client_id,
                                })];
                            case 1:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauthClient - trusted clients", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseURL, trustedClients, _a, auth, signInWithTestUser, customFetchImpl, headers;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseURL = "http://localhost:3000";
                trustedClients = new Set();
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseURL,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                cachedTrustedClients: trustedClients,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                (0, vitest_1.it)("refuses to change a trusted client as a client error, not a server failure", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var created, clientId, _i, _a, _b, path, body, response, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, auth.api.createOAuthClient({
                                    headers: headers,
                                    body: { redirect_uris: ["https://rp.example.com/callback"] },
                                })];
                            case 1:
                                created = _d.sent();
                                clientId = created.client_id;
                                trustedClients.add(clientId);
                                _i = 0, _a = [
                                    [
                                        "/oauth2/update-client",
                                        { client_id: clientId, update: { client_name: "x" } },
                                    ],
                                    ["/oauth2/client/rotate-secret", { client_id: clientId }],
                                    ["/oauth2/delete-client", { client_id: clientId }],
                                ];
                                _d.label = 2;
                            case 2:
                                if (!(_i < _a.length)) return [3 /*break*/, 6];
                                _b = _a[_i], path = _b[0], body = _b[1];
                                return [4 /*yield*/, customFetchImpl("".concat(baseURL, "/api/auth").concat(path), {
                                        method: "POST",
                                        headers: __assign(__assign({}, Object.fromEntries(headers)), { "content-type": "application/json" }),
                                        body: JSON.stringify(body),
                                    })];
                            case 3:
                                response = _d.sent();
                                (0, vitest_1.expect)(response.status, path).toBe(400);
                                _c = vitest_1.expect;
                                return [4 /*yield*/, response.json()];
                            case 4:
                                _c.apply(void 0, [_d.sent(), path]).toMatchObject({
                                    error: "invalid_client",
                                });
                                _d.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 2];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
