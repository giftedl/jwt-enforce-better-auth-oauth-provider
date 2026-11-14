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
var api_1 = require("better-auth/api");
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var plugins_1 = require("better-auth/plugins");
var jwt_1 = require("better-auth/plugins/jwt");
var organization_1 = require("better-auth/plugins/organization");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
var register_1 = require("./register");
var resources_1 = require("./resources");
var makeRegister = function (fetchImpl, baseURL) {
    if (baseURL === void 0) { baseURL = "http://localhost:3000"; }
    return function (body, headers) {
        var requestHeaders = new Headers(headers);
        requestHeaders.set("content-type", "application/json");
        return fetchImpl("".concat(baseURL, "/api/auth/oauth2/register"), {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify(body),
        });
    };
};
(0, vitest_1.describe)("oauth register", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, rpBaseUrl, _a, auth, signInWithTestUser, customFetchImpl, headers, serverClient, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                resources: ["https://api.example.com/dcr-dedupe"],
                                clientRegistrationAllowedResources: [
                                    "https://api.example.com/dcr-dedupe",
                                ],
                                scopes: [
                                    "openid",
                                    "profile",
                                    "email",
                                    "offline_access",
                                    "create:test",
                                    "delete:test",
                                ],
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                serverClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                redirectUri = "https://rp.example.com/api/auth/callback/test";
                (0, vitest_1.it)("should fail without body", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.$fetch("/oauth2/register", {
                                    method: "POST",
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail without authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var unauthenticatedClient, response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                unauthenticatedClient = (0, client_1.createAuthClient)({
                                    plugins: [(0, client_2.oauthProviderClient)()],
                                    baseURL: baseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImpl,
                                    },
                                });
                                return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                        redirect_uris: [redirectUri],
                                    })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject unauthenticated registration before metadata validation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var unauthenticatedClient, response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                unauthenticatedClient = (0, client_1.createAuthClient)({
                                    plugins: [(0, client_2.oauthProviderClient)()],
                                    baseURL: baseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImpl,
                                    },
                                });
                                return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                        redirect_uris: [redirectUri],
                                        token_endpoint_auth_method: "not_a_real_method",
                                    })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should register private client with minimum requirements", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.user_id).toBeDefined();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.client_secret).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("persists operator-approved scopes so a DCR client can step up later", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, context, stored;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    scope: "openid",
                                })];
                            case 1:
                                response = _e.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.scope) === null || _b === void 0 ? void 0 : _b.split(" ")).toEqual([
                                    "openid",
                                    "profile",
                                    "email",
                                    "offline_access",
                                    "create:test",
                                    "delete:test",
                                ]);
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                context = _e.sent();
                                return [4 /*yield*/, context.adapter.findOne({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: response.data.client_id }],
                                    })];
                            case 3:
                                stored = _e.sent();
                                (0, vitest_1.expect)(stored === null || stored === void 0 ? void 0 : stored.scopes).toEqual((_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.scope) === null || _d === void 0 ? void 0 : _d.split(" "));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("resolves registration scope policy as a deterministic default and allowed union", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var policyBaseUrl, policyFetch, policyClient, accepted, rejected;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                policyBaseUrl = "http://localhost:3018";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: policyBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)(),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                allowDynamicClientRegistration: true,
                                                allowUnauthenticatedClientRegistration: true,
                                                scopes: ["openid", "read", "write", "admin"],
                                                clientRegistrationDefaultScopes: ["openid", "read", "read"],
                                                clientRegistrationAllowedScopes: ["write", "read"],
                                            }),
                                        ],
                                    })];
                            case 1:
                                policyFetch = (_c.sent()).customFetchImpl;
                                policyClient = (0, client_1.createAuthClient)({
                                    plugins: [(0, client_2.oauthProviderClient)()],
                                    baseURL: policyBaseUrl,
                                    fetchOptions: { customFetchImpl: policyFetch },
                                });
                                return [4 /*yield*/, policyClient.oauth2.register({
                                        redirect_uris: [redirectUri],
                                        token_endpoint_auth_method: "none",
                                        scope: "read",
                                    })];
                            case 2:
                                accepted = _c.sent();
                                (0, vitest_1.expect)(accepted.error).toBeNull();
                                (0, vitest_1.expect)((_a = accepted.data) === null || _a === void 0 ? void 0 : _a.scope).toBe("openid read write");
                                return [4 /*yield*/, policyClient.oauth2.register({
                                        redirect_uris: [redirectUri],
                                        token_endpoint_auth_method: "none",
                                        scope: "admin",
                                    })];
                            case 3:
                                rejected = _c.sent();
                                (0, vitest_1.expect)((_b = rejected.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("defaults omitted application_type to web independently of public client authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, ctx, stored;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: ["https://client.example.com/callback"],
                                    token_endpoint_auth_method: "none",
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)(response.data).toMatchObject({
                                    application_type: "web",
                                    token_endpoint_auth_method: "none",
                                });
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_secret).toBeUndefined();
                                (0, vitest_1.expect)(response.data).not.toHaveProperty("public");
                                (0, vitest_1.expect)(response.data).not.toHaveProperty("type");
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                ctx = _b.sent();
                                return [4 /*yield*/, ctx.adapter.findOne({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: response.data.client_id }],
                                    })];
                            case 3:
                                stored = _b.sent();
                                (0, vitest_1.expect)(stored).toMatchObject({
                                    applicationType: "web",
                                    tokenEndpointAuthMethod: "none",
                                });
                                (0, vitest_1.expect)(stored).not.toHaveProperty("public");
                                (0, vitest_1.expect)(stored).not.toHaveProperty("type");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail authorization_code without response type code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    // @ts-expect-error testing with a different response type even though unsupported
                                    response_types: ["token"],
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should register confidential client and check that certain fields are overwritten", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var applicationRequest, response;
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                applicationRequest = {
                                    client_id: "bad-actor",
                                    client_secret: "bad-actor",
                                    client_secret_expires_at: 0,
                                    scope: "create:test delete:test",
                                    //---- Recommended client data ----//
                                    user_id: "bad-actor",
                                    client_id_issued_at: Math.floor(Date.now() / 1000),
                                    //---- UI Metadata ----//
                                    client_name: "accept name",
                                    client_uri: "https://example.com/ok",
                                    logo_uri: "https://example.com/logo.png",
                                    contacts: ["test@example.com"],
                                    tos_uri: "https://example.com/terms",
                                    policy_uri: "https://example.com/policy",
                                    //---- Client key metadata (only one can be used) ----//
                                    // jwks: { keys: [] },
                                    // jwks_uri: "https://example.com/.well-known/jwks.json",
                                    //---- User Software Identifiers ----//
                                    software_id: "custom-software-id",
                                    software_version: "custom-v1",
                                    software_statement: "custom software statement",
                                    //---- Authentication Metadata ----//
                                    redirect_uris: ["https://example.com/callback"],
                                    token_endpoint_auth_method: "client_secret_post",
                                    grant_types: [
                                        "authorization_code",
                                        "client_credentials",
                                        "refresh_token",
                                    ],
                                    response_types: ["code"],
                                    application_type: "web",
                                    //---- Not Part of RFC7591 Spec ----//
                                    disabled: false,
                                };
                                return [4 /*yield*/, serverClient.$fetch("/oauth2/register", {
                                        method: "POST",
                                        body: applicationRequest,
                                    })];
                            case 1:
                                response = _p.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.client_id).not.toEqual(applicationRequest.client_id);
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_d = response.data) === null || _d === void 0 ? void 0 : _d.client_secret).not.toEqual(applicationRequest.client_secret);
                                (0, vitest_1.expect)((_e = response.data) === null || _e === void 0 ? void 0 : _e.client_secret_expires_at).toEqual(0);
                                (0, vitest_1.expect)((_g = (_f = response.data) === null || _f === void 0 ? void 0 : _f.scope) === null || _g === void 0 ? void 0 : _g.split(" ")).toEqual([
                                    "openid",
                                    "profile",
                                    "email",
                                    "offline_access",
                                    "create:test",
                                    "delete:test",
                                ]);
                                (0, vitest_1.expect)((_h = response.data) === null || _h === void 0 ? void 0 : _h.user_id).toBeDefined();
                                (0, vitest_1.expect)((_j = response.data) === null || _j === void 0 ? void 0 : _j.user_id).not.toEqual(applicationRequest.user_id);
                                (0, vitest_1.expect)((_k = response.data) === null || _k === void 0 ? void 0 : _k.client_id_issued_at).toBeDefined();
                                (0, vitest_1.expect)(response.data).toMatchObject({
                                    client_name: applicationRequest.client_name,
                                    client_uri: applicationRequest.client_uri,
                                    logo_uri: applicationRequest.logo_uri,
                                    contacts: applicationRequest.contacts,
                                    tos_uri: applicationRequest.tos_uri,
                                    policy_uri: applicationRequest.policy_uri,
                                });
                                (0, vitest_1.expect)((_l = response.data) === null || _l === void 0 ? void 0 : _l.jwks).toBeUndefined();
                                (0, vitest_1.expect)((_m = response.data) === null || _m === void 0 ? void 0 : _m.jwks_uri).toBeUndefined();
                                (0, vitest_1.expect)(response.data).toMatchObject({
                                    software_id: applicationRequest.software_id,
                                    software_version: applicationRequest.software_version,
                                    software_statement: applicationRequest.software_statement,
                                    redirect_uris: applicationRequest.redirect_uris,
                                    token_endpoint_auth_method: applicationRequest.token_endpoint_auth_method,
                                    grant_types: applicationRequest.grant_types,
                                    response_types: applicationRequest.response_types,
                                });
                                (0, vitest_1.expect)(response.data).not.toHaveProperty("public");
                                (0, vitest_1.expect)(response.data).not.toHaveProperty("type");
                                (0, vitest_1.expect)((_o = response.data) === null || _o === void 0 ? void 0 : _o.disabled).toBeFalsy();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("preserves surrounding client_name whitespace through registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientName, response, clientId, context, stored;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                clientName = "  Deliberately Spaced Client  ";
                                return [4 /*yield*/, serverClient.oauth2.register({
                                        client_name: clientName,
                                        redirect_uris: ["https://example.com/callback"],
                                    })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_name).toBe(clientName);
                                clientId = (_b = response.data) === null || _b === void 0 ? void 0 : _b.client_id;
                                if (!clientId)
                                    throw new Error("registered client ID was not returned");
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                context = _c.sent();
                                return [4 /*yield*/, context.adapter.findOne({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: clientId }],
                                    })];
                            case 3:
                                stored = _c.sent();
                                (0, vitest_1.expect)(stored === null || stored === void 0 ? void 0 : stored.name).toBe(clientName);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should preserve confidential method and application type for authenticated registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    token_endpoint_auth_method: "client_secret_post",
                                    application_type: "web",
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _e.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.token_endpoint_auth_method).toBe("client_secret_post");
                                (0, vitest_1.expect)((_d = response.data) === null || _d === void 0 ? void 0 : _d.application_type).toBe("web");
                                (0, vitest_1.expect)(response.data).not.toHaveProperty("public");
                                (0, vitest_1.expect)(response.data).not.toHaveProperty("type");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("dedupes repeated DCR resources to a single client/resource link row", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var identifier, response, clientId, ctx, links;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                identifier = "https://api.example.com/dcr-dedupe";
                                return [4 /*yield*/, serverClient.$fetch("/oauth2/register", {
                                        method: "POST",
                                        body: {
                                            redirect_uris: [redirectUri],
                                            resources: [identifier, identifier],
                                        },
                                    })];
                            case 1:
                                response = _b.sent();
                                clientId = (_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id;
                                (0, vitest_1.expect)(clientId).toBeDefined();
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                ctx = _b.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthClientResource",
                                        where: [{ field: "clientId", value: clientId }],
                                    })];
                            case 3:
                                links = _b.sent();
                                (0, vitest_1.expect)(links.length).toBe(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a registration resource that is not a valid RFC 8707 URI", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, serverClient.$fetch("/oauth2/register", {
                                    method: "POST",
                                    body: {
                                        redirect_uris: [redirectUri],
                                        resources: ["not-a-uri"],
                                    },
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_target");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("lazy-seeds configured resources before DCR validation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var identifier, _a, auth, signInWithTestUser, customFetchImpl, ctx, headers, client, response;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                identifier = "https://api.example.com/dcr-lazy-seed";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: baseUrl,
                                        plugins: [
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                allowDynamicClientRegistration: true,
                                                resources: [identifier],
                                                clientRegistrationAllowedResources: [identifier],
                                            }),
                                            (0, jwt_1.jwt)(),
                                        ],
                                    })];
                            case 1:
                                _a = _c.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                                return [4 /*yield*/, auth.$context];
                            case 2:
                                ctx = _c.sent();
                                return [4 /*yield*/, ctx.adapter.delete({
                                        model: "oauthResource",
                                        where: [{ field: "identifier", value: identifier }],
                                    })];
                            case 3:
                                _c.sent();
                                (0, resources_1.resetSeedStateForTests)();
                                return [4 /*yield*/, signInWithTestUser()];
                            case 4:
                                headers = (_c.sent()).headers;
                                client = (0, client_1.createAuthClient)({
                                    plugins: [(0, client_2.oauthProviderClient)()],
                                    baseURL: baseUrl,
                                    fetchOptions: {
                                        customFetchImpl: customFetchImpl,
                                        headers: headers,
                                    },
                                });
                                return [4 /*yield*/, client.$fetch("/oauth2/register", {
                                        method: "POST",
                                        body: {
                                            redirect_uris: [redirectUri],
                                            resources: [identifier],
                                        },
                                    })];
                            case 5:
                                response = _c.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.resources).toEqual([identifier]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should register client with metadata field", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        metadata: {
                                            foo: "bar",
                                            nested: { key: "value" },
                                        },
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_secret).toBeDefined();
                                // Metadata should be spread at the top level of the response
                                (0, vitest_1.expect)(Reflect.get(response, "foo")).toBe("bar");
                                (0, vitest_1.expect)(Reflect.get(response, "nested")).toEqual({ key: "value" });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a bare JWK array through dynamic registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    token_endpoint_auth_method: "private_key_jwt",
                                    // @ts-expect-error RFC 7517 requires a JWK Set object.
                                    jwks: [{ kty: "RSA", n: "modulus", e: "AQAB" }],
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject registration with an empty jwks.keys array", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    token_endpoint_auth_method: "private_key_jwt",
                                    jwks: { keys: [] },
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.for([
                    { kty: "oct", k: "secret-key" },
                    { kty: "RSA", n: "test", e: "test-exponent", d: "private-exponent" },
                ])("should reject private or symmetric jwks material", function (key) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    jwks: { keys: [key] },
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.for([
                    {},
                    { use: "sig" },
                    { kty: "RSA", n: "test" },
                    { kty: "EC", crv: "P-256", x: "test" },
                    { kty: "OKP", crv: "Ed25519" },
                    { kty: "unsupported", n: "test", e: "test-exponent" },
                    { kty: "RSA", n: "test", e: "AQAB", alg: "HS256" },
                    { kty: "EC", crv: "P-256", x: "x", y: "y", alg: "RS256" },
                    { kty: "EC", crv: "P-256", x: "x", y: "y", alg: "ES384" },
                    { kty: "OKP", crv: "Ed448", x: "x", alg: "EdDSA" },
                ])("should reject malformed jwks public keys", function (key) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    jwks: { keys: [key] },
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    {
                        jwksUri: "https://user:password@example.com/.well-known/jwks.json",
                        error: "credentials",
                    },
                    {
                        jwksUri: "https://example.com/.well-known/jwks.json#keys",
                        error: "fragment",
                    },
                ])("rejects jwks_uri containing $error", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var jwksUri = _b.jwksUri, error = _b.error;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.checkOAuthClient)({
                                    client_id: "jwks-uri-client",
                                    redirect_uris: [redirectUri],
                                    jwks_uri: jwksUri,
                                }, {
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                })).rejects.toMatchObject({
                                    body: {
                                        error_description: vitest_1.expect.stringContaining(error),
                                    },
                                })];
                            case 1:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/10660
                 */
                (0, vitest_1.describe)("client metadata document grant intersection", function () {
                    (0, vitest_1.it)("keeps a client metadata document whose grants intersect the supported set", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.checkOAuthClient)({
                                        client_id: "https://client.example.com/oauth/client-metadata",
                                        client_name: "Claude",
                                        redirect_uris: ["https://client.example.com/api/auth_callback"],
                                        grant_types: [
                                            "authorization_code",
                                            "refresh_token",
                                            "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                        ],
                                        response_types: ["code"],
                                        token_endpoint_auth_method: "none",
                                    }, {
                                        loginPage: "/login",
                                        consentPage: "/consent",
                                    }, { registrationSource: "clientMetadataDocument" })).resolves.toBeUndefined()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("rejects a client metadata document sharing no grant with the server", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.checkOAuthClient)({
                                        client_id: "https://client.example.com/oauth/client-metadata",
                                        client_name: "Assertion Only",
                                        redirect_uris: [],
                                        grant_types: ["urn:ietf:params:oauth:grant-type:jwt-bearer"],
                                        response_types: [],
                                        token_endpoint_auth_method: "none",
                                    }, {
                                        loginPage: "/login",
                                        consentPage: "/consent",
                                    }, { registrationSource: "clientMetadataDocument" })).rejects.toMatchObject({
                                        body: {
                                            error_description: vitest_1.expect.stringContaining("no mutually supported"),
                                        },
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("keeps managed registration strict about unsupported grants", function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.checkOAuthClient)({
                                        client_id: "managed-client",
                                        redirect_uris: [redirectUri],
                                        grant_types: [
                                            "authorization_code",
                                            "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                        ],
                                        response_types: ["code"],
                                    }, {
                                        loginPage: "/login",
                                        consentPage: "/consent",
                                    }, { registrationSource: "managed" })).rejects.toMatchObject({
                                        body: {
                                            error_description: vitest_1.expect.stringContaining("unsupported grant_type"),
                                        },
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.it)("rejects a bare JWK array through managed registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, vitest_1.expect)(auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        token_endpoint_auth_method: "private_key_jwt",
                                        // @ts-expect-error RFC 7517 requires a JWK Set object.
                                        jwks: [{ kty: "RSA", n: "modulus", e: "AQAB" }],
                                    },
                                })).rejects.toThrow()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should register client with metadata and strip extra fields not in schema", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        metadata: {
                                            fromMetadata: "value1",
                                        },
                                        customField: "value2",
                                    },
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response === null || response === void 0 ? void 0 : response.client_id).toBeDefined();
                                // metadata contents should be spread at the top level, extra fields not in schema should be stripped
                                (0, vitest_1.expect)(Reflect.get(response, "fromMetadata")).toBe("value1");
                                (0, vitest_1.expect)(Reflect.get(response, "customField")).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("round-trips backchannel_logout_uri and backchannel_logout_session_required", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var backchannelUri, response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                backchannelUri = "https://rp.example.com/logout/backchannel";
                                return [4 /*yield*/, serverClient.oauth2.register({
                                        redirect_uris: [redirectUri],
                                        backchannel_logout_uri: backchannelUri,
                                        backchannel_logout_session_required: true,
                                    })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.backchannel_logout_uri).toBe(backchannelUri);
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.backchannel_logout_session_required).toBe(true);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects backchannel_logout_uri with a fragment", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    backchannel_logout_uri: "https://rp.example.com/logout/backchannel#section",
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects backchannel_logout_uri ending with a bare fragment delimiter", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    backchannel_logout_uri: "https://rp.example.com/logout/backchannel#",
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects http backchannel_logout_uri on confidential clients", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    backchannel_logout_uri: "http://rp.example.com/logout/backchannel",
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects http backchannel_logout_uri on public clients", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    token_endpoint_auth_method: "none",
                                    backchannel_logout_uri: "".concat(rpBaseUrl, "/logout/backchannel"),
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects credentials in backchannel_logout_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                    backchannel_logout_uri: "https://user:password@rp.example.com/logout/backchannel",
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects backchannel_logout_uri pointing at private, tunneled, or metadata targets", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var targets, _i, targets_1, backchannel_logout_uri, response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                targets = [
                                    "https://10.0.0.1/logout",
                                    "https://169.254.169.254/logout",
                                    "https://[::ffff:169.254.169.254]/logout",
                                    "https://[64:ff9b::a9fe:a9fe]/logout",
                                    "https://100.64.0.1/logout",
                                    "https://metadata.google.internal/logout",
                                ];
                                _i = 0, targets_1 = targets;
                                _b.label = 1;
                            case 1:
                                if (!(_i < targets_1.length)) return [3 /*break*/, 4];
                                backchannel_logout_uri = targets_1[_i];
                                return [4 /*yield*/, serverClient.oauth2.register({
                                        redirect_uris: [redirectUri],
                                        backchannel_logout_uri: backchannel_logout_uri,
                                    })];
                            case 2:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
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
/**
 * @see https://github.com/better-auth/better-auth/issues/11081
 */
(0, vitest_1.describe)("oauth register - dynamic registration grant narrowing", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, instanceWithGrants, register;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                instanceWithGrants = function (grantTypes) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, customFetchImpl, signInWithTestUser;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                                    baseURL: authServerBaseUrl,
                                    plugins: [
                                        (0, jwt_1.jwt)(),
                                        (0, oauth_1.oauthProvider)({
                                            loginPage: "/login",
                                            consentPage: "/consent",
                                            allowDynamicClientRegistration: true,
                                            allowUnauthenticatedClientRegistration: true,
                                            grantTypes: grantTypes,
                                        }),
                                    ],
                                })];
                            case 1:
                                _a = _b.sent(), customFetchImpl = _a.customFetchImpl, signInWithTestUser = _a.signInWithTestUser;
                                return [2 /*return*/, {
                                        register: makeRegister(customFetchImpl),
                                        signInWithTestUser: signInWithTestUser,
                                    }];
                        }
                    });
                }); };
                return [4 /*yield*/, instanceWithGrants([
                        "authorization_code",
                        "refresh_token",
                    ])];
            case 1:
                register = (_a.sent()).register;
                (0, vitest_1.it)("registers Claude's connector with only the grants the server supports", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    redirect_uris: ["https://claude.ai/api/mcp/auth_callback"],
                                    token_endpoint_auth_method: "none",
                                    grant_types: [
                                        "authorization_code",
                                        "refresh_token",
                                        "urn:ietf:params:oauth:grant-type:jwt-bearer",
                                    ],
                                    response_types: ["code"],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.grant_types).toEqual(["authorization_code", "refresh_token"]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("drops an unsupported client_credentials grant from unauthenticated registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    redirect_uris: ["https://rp.example.com/callback"],
                                    token_endpoint_auth_method: "none",
                                    grant_types: ["authorization_code", "client_credentials"],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.grant_types).toEqual(["authorization_code"]);
                                (0, vitest_1.expect)(body.response_types).toEqual(["code"]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a registration that shares no grant with the server", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, register({
                                    redirect_uris: ["https://rp.example.com/callback"],
                                    token_endpoint_auth_method: "none",
                                    grant_types: ["urn:ietf:params:oauth:grant-type:jwt-bearer"],
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, response.json()];
                            case 2:
                                _a.apply(void 0, [_b.sent()]).toMatchObject({
                                    error: "invalid_client_metadata",
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("drops the code response type along with an unsupported authorization_code grant", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var machineServer, headers, _i, _a, responseTypes, response, body;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, instanceWithGrants(["client_credentials"])];
                            case 1:
                                machineServer = _c.sent();
                                return [4 /*yield*/, machineServer.signInWithTestUser()];
                            case 2:
                                headers = (_c.sent()).headers;
                                _i = 0, _a = [undefined, ["code"]];
                                _c.label = 3;
                            case 3:
                                if (!(_i < _a.length)) return [3 /*break*/, 7];
                                responseTypes = _a[_i];
                                return [4 /*yield*/, machineServer.register({
                                        token_endpoint_auth_method: "client_secret_basic",
                                        grant_types: ["authorization_code", "client_credentials"],
                                        response_types: responseTypes,
                                    }, headers)];
                            case 4:
                                response = _c.sent();
                                return [4 /*yield*/, response.json()];
                            case 5:
                                body = (_c.sent());
                                (0, vitest_1.expect)(response.status, JSON.stringify(body)).toBe(201);
                                (0, vitest_1.expect)(body.grant_types).toEqual(["client_credentials"]);
                                (0, vitest_1.expect)((_b = body.response_types) !== null && _b !== void 0 ? _b : []).toEqual([]);
                                _c.label = 6;
                            case 6:
                                _i++;
                                return [3 /*break*/, 3];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth register - disableJwtPlugin", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, rpBaseUrl, _a, signInWithTestUser, customFetchImpl, headers, serverClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                disableJwtPlugin: true,
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                serverClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                (0, vitest_1.it)("rejects backchannel_logout_uri when jwt plugin is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: ["".concat(rpBaseUrl, "/callback")],
                                    backchannel_logout_uri: "".concat(rpBaseUrl, "/logout/backchannel"),
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth register - unauthenticated", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, customFetchImpl, unauthenticatedClient, redirectUri;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                allowUnauthenticatedClientRegistration: true,
                            }),
                        ],
                    })];
            case 1:
                customFetchImpl = (_a.sent()).customFetchImpl;
                unauthenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
                redirectUri = "https://rp.example.com/api/auth/callback/test";
                (0, vitest_1.it)("should create public clients without authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.user_id).toBeUndefined();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.client_secret).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * RFC 7591 §2: when token_endpoint_auth_method is omitted, the default
                 * is "client_secret_basic". Open registration may still create a
                 * confidential client and return the generated client_secret.
                 *
                 * @see https://github.com/better-auth/better-auth/issues/8588
                 */
                (0, vitest_1.it)("should apply the client_secret_basic default without authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.token_endpoint_auth_method).toBe("client_secret_basic");
                                (0, vitest_1.expect)(response.data).not.toHaveProperty("public");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * Open registration preserves the requested confidential client auth method
                 * and returns a secret for token endpoint authentication.
                 *
                 * @see https://github.com/better-auth/better-auth/issues/8588
                 */
                (0, vitest_1.it)("should preserve client_secret_post for unauthenticated DCR", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                    token_endpoint_auth_method: "client_secret_post",
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.token_endpoint_auth_method).toBe("client_secret_post");
                                (0, vitest_1.expect)(response.data).not.toHaveProperty("public");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/8588
                 */
                (0, vitest_1.it)("should accept client_secret_basic with inline jwks for unauthenticated DCR", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var jwks, response;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                jwks = {
                                    keys: [{ kty: "RSA", kid: "client-key", n: "test", e: "test-exponent" }],
                                };
                                return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                        token_endpoint_auth_method: "client_secret_basic",
                                        redirect_uris: [redirectUri],
                                        jwks: jwks,
                                    })];
                            case 1:
                                response = _e.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.token_endpoint_auth_method).toBe("client_secret_basic");
                                (0, vitest_1.expect)((_d = response.data) === null || _d === void 0 ? void 0 : _d.jwks).toEqual(jwks);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/8588
                 */
                (0, vitest_1.it)("should preserve application_type 'web' for unauthenticated confidential DCR", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                    token_endpoint_auth_method: "client_secret_post",
                                    application_type: "web",
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _e.sent();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.token_endpoint_auth_method).toBe("client_secret_post");
                                (0, vitest_1.expect)((_d = response.data) === null || _d === void 0 ? void 0 : _d.application_type).toBe("web");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * client_credentials can mint tokens without an end-user authorization step.
                 * Keep open registration on authorization-code clients unless the caller is
                 * authenticated through a session or an initial access token.
                 *
                 * @see https://github.com/better-auth/better-auth/issues/8588
                 */
                (0, vitest_1.it)("should reject client_credentials grant for unauthenticated DCR", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                    grant_types: ["client_credentials"],
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * Verifies the open-registration confidential client is actually usable end-to-end:
 * DCR with client_secret_post -> authorize -> PKCE token exchange with client_secret.
 *
 * @see https://github.com/better-auth/better-auth/issues/8588
 */
(0, vitest_1.describe)("oauth register - unauthenticated DCR full flow", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, _a, signInWithTestUser, customFetchImpl, headers, authenticatedClient, unauthenticatedClient, providerId, redirectUri, state;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "https://rp.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                allowUnauthenticatedClientRegistration: true,
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                authenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                unauthenticatedClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerBaseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl },
                });
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/oauth2/callback/").concat(providerId);
                state = "e2e-test-state";
                (0, vitest_1.it)("should complete authorize + PKCE token exchange for client_secret_post", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var reg, clientId, clientSecret, codeVerifier, authUrl, consentRedirectUrl, consentRes, code, _a, tokenBody, tokenHeaders, tokenRes, tokens;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, unauthenticatedClient.oauth2.register({
                                    token_endpoint_auth_method: "client_secret_post",
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                reg = _e.sent();
                                (0, vitest_1.expect)((_b = reg.data) === null || _b === void 0 ? void 0 : _b.client_id).toBeDefined();
                                (0, vitest_1.expect)((_c = reg.data) === null || _c === void 0 ? void 0 : _c.client_secret).toBeDefined();
                                (0, vitest_1.expect)((_d = reg.data) === null || _d === void 0 ? void 0 : _d.token_endpoint_auth_method).toBe("client_secret_post");
                                clientId = reg.data.client_id;
                                clientSecret = reg.data.client_secret;
                                codeVerifier = (0, crypto_1.generateRandomString)(64);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: clientId,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                authUrl = _e.sent();
                                consentRedirectUrl = "";
                                return [4 /*yield*/, authenticatedClient.$fetch(authUrl.toString(), {
                                        onError: function (ctx) {
                                            consentRedirectUrl = ctx.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _e.sent();
                                (0, vitest_1.expect)(consentRedirectUrl).toContain("/consent");
                                // 4. Accept consent -> get authorization code
                                vitest_1.vi.stubGlobal("window", {
                                    location: {
                                        search: new URL(consentRedirectUrl, authServerBaseUrl).search,
                                    },
                                });
                                (0, vitest_1.onTestFinished)(function () {
                                    vitest_1.vi.unstubAllGlobals();
                                });
                                return [4 /*yield*/, authenticatedClient.oauth2.consent({ accept: true }, { headers: headers, throw: true })];
                            case 4:
                                consentRes = _e.sent();
                                (0, vitest_1.expect)(consentRes.url).toContain("code=");
                                code = new URL(consentRes.url).searchParams.get("code");
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: clientId,
                                            clientSecret: clientSecret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 5:
                                _a = _e.sent(), tokenBody = _a.body, tokenHeaders = _a.headers;
                                return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/token"), {
                                        method: "POST",
                                        body: tokenBody.toString(),
                                        headers: tokenHeaders,
                                    })];
                            case 6:
                                tokenRes = _e.sent();
                                return [4 /*yield*/, tokenRes.json()];
                            case 7:
                                tokens = _e.sent();
                                (0, vitest_1.expect)(tokens.access_token).toBeDefined();
                                (0, vitest_1.expect)(tokens.id_token).toBeDefined();
                                (0, vitest_1.expect)(tokens.token_type.toLowerCase()).toBe("bearer");
                                (0, vitest_1.expect)(tokens.scope).toBe("openid");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth register - organization", function () { return __awaiter(void 0, void 0, void 0, function () {
    var providerId, baseUrl, rpBaseUrl, redirectUri, _a, auth, signInWithTestUser, customFetchImpl, _b, headers, user, serverClient, org;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                providerId = "test";
                baseUrl = "http://localhost:3000";
                rpBaseUrl = "https://rp.example.com";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, organization_1.organization)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                clientReference: function (_a) {
                                    var _b;
                                    var session = _a.session;
                                    return ((_b = session === null || session === void 0 ? void 0 : session.activeOrganizationId) !== null && _b !== void 0 ? _b : undefined);
                                },
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _c.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                _b = _c.sent(), headers = _b.headers, user = _b.user;
                serverClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _org, session, sessionData;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, auth.api.createOrganization({
                                    body: {
                                        name: "my-org",
                                        slug: "my-org",
                                        userId: user.id,
                                    },
                                })];
                            case 1:
                                _org = _b.sent();
                                (0, vitest_1.expect)(_org).toBeDefined();
                                org = _org;
                                return [4 /*yield*/, serverClient.$fetch("/organization/set-active", {
                                        method: "POST",
                                        body: {
                                            organizationId: org.id,
                                            organizationSlug: org.slug,
                                        },
                                        headers: headers,
                                        throw: true,
                                    })];
                            case 2:
                                _b.sent();
                                return [4 /*yield*/, serverClient.getSession({
                                        fetchOptions: {
                                            headers: headers,
                                        },
                                    })];
                            case 3:
                                session = _b.sent();
                                sessionData = (_a = session.data) === null || _a === void 0 ? void 0 : _a.session;
                                (0, vitest_1.expect)(sessionData === null || sessionData === void 0 ? void 0 : sessionData.activeOrganizationId).toBe(org === null || org === void 0 ? void 0 : org.id);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should create organizational oauthClient", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                client = _c.sent();
                                (0, vitest_1.expect)((_a = client.data) === null || _a === void 0 ? void 0 : _a.user_id).toBeUndefined();
                                (0, vitest_1.expect)((_b = client.data) === null || _b === void 0 ? void 0 : _b.reference_id).toBe(org.id);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth register - skip_consent blocked", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, _a, signInWithTestUser, customFetchImpl, headers, serverClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = "http://localhost:3000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                _a = _b.sent(), signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                serverClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                (0, vitest_1.it)("should reject skip_consent during dynamic registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var res;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: ["https://rp.example.com/callback"],
                                    // @ts-expect-error testing skip consent mimicing client incorrectly sending parameter
                                    skip_consent: true,
                                })];
                            case 1:
                                res = _b.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should allow registration without skip_consent", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var res;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, serverClient.oauth2.register({
                                    redirect_uris: ["https://rp.example.com/callback"],
                                })];
                            case 1:
                                res = _b.sent();
                                (0, vitest_1.expect)((_a = res.data) === null || _a === void 0 ? void 0 : _a.client_id).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth register - protected dynamic registration", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, rpBaseUrl, validInitialAccessToken, validateInitialAccessToken, _a, auth, customFetchImpl, providerId, redirectUri;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                rpBaseUrl = "https://rp.example.com";
                validInitialAccessToken = "valid-initial-registration-token";
                validateInitialAccessToken = vitest_1.vi.fn(function (_a) {
                    var initialAccessToken = _a.initialAccessToken, clientMetadata = _a.clientMetadata;
                    if (initialAccessToken === validInitialAccessToken &&
                        clientMetadata.client_name === "Machine Client") {
                        return { referenceId: "infra-provisioner" };
                    }
                    return false;
                });
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                validateInitialAccessToken: validateInitialAccessToken,
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl;
                providerId = "test";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                (0, vitest_1.it)("should create confidential clients with a valid initial access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body, context, stored, tokenResponse, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/register"), {
                                    method: "POST",
                                    headers: {
                                        authorization: "Bearer ".concat(validInitialAccessToken),
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        client_name: "Machine Client",
                                        redirect_uris: [redirectUri],
                                        grant_types: ["client_credentials"],
                                        client_credentials_scopes: ["admin"],
                                        clientCredentialsScopes: ["admin"],
                                    }),
                                })];
                            case 1:
                                response = _b.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                // The success response carries a client_secret, so it must not be cached.
                                (0, vitest_1.expect)(response.headers.get("Cache-Control")).toBe("no-store");
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_b.sent());
                                (0, vitest_1.expect)(body.client_id).toBeDefined();
                                (0, vitest_1.expect)(body.client_secret).toBeDefined();
                                (0, vitest_1.expect)(body.grant_types).toEqual(["client_credentials"]);
                                (0, vitest_1.expect)(body.reference_id).toBe("infra-provisioner");
                                (0, vitest_1.expect)(body.user_id).toBeUndefined();
                                (0, vitest_1.expect)(body.token_endpoint_auth_method).toBe("client_secret_basic");
                                (0, vitest_1.expect)(body).not.toHaveProperty("client_credentials_scopes");
                                (0, vitest_1.expect)(body).not.toHaveProperty("clientCredentialsScopes");
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                context = _b.sent();
                                return [4 /*yield*/, context.adapter.findOne({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: body.client_id }],
                                    })];
                            case 4:
                                stored = _b.sent();
                                (0, vitest_1.expect)(stored === null || stored === void 0 ? void 0 : stored.clientCredentialsScopes).toEqual([]);
                                return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/token"), {
                                        method: "POST",
                                        headers: {
                                            authorization: "Basic ".concat(Buffer.from("".concat(body.client_id, ":").concat(body.client_secret)).toString("base64")),
                                            "content-type": "application/x-www-form-urlencoded",
                                        },
                                        body: new URLSearchParams({
                                            grant_type: "client_credentials",
                                        }),
                                    })];
                            case 5:
                                tokenResponse = _b.sent();
                                (0, vitest_1.expect)(tokenResponse.status).toBe(400);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, tokenResponse.json()];
                            case 6:
                                _a.apply(void 0, [_b.sent()]).toMatchObject({
                                    error: "unauthorized_client",
                                });
                                (0, vitest_1.expect)(validateInitialAccessToken).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                                    initialAccessToken: validInitialAccessToken,
                                    clientMetadata: vitest_1.expect.objectContaining({
                                        client_name: "Machine Client",
                                        grant_types: ["client_credentials"],
                                    }),
                                }));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject invalid initial access tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/register"), {
                                    method: "POST",
                                    headers: {
                                        authorization: "Bearer invalid-initial-registration-token",
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        client_name: "Machine Client",
                                        redirect_uris: [redirectUri],
                                    }),
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(401);
                                (0, vitest_1.expect)(response.headers.get("WWW-Authenticate")).toBe('Bearer error="invalid_token"');
                                (0, vitest_1.expect)(response.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(response.headers.get("Pragma")).toBe("no-cache");
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_token");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject malformed initial access token headers", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/register"), {
                                    method: "POST",
                                    headers: {
                                        authorization: "Bearer",
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        client_name: "Machine Client",
                                        redirect_uris: [redirectUri],
                                    }),
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                (0, vitest_1.expect)(response.headers.get("WWW-Authenticate")).toBe('Bearer error="invalid_request"');
                                (0, vitest_1.expect)(response.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(response.headers.get("Pragma")).toBe("no-cache");
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject initial access tokens when validation is not configured", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var noValidatorAuthServerBaseUrl, customFetchWithoutValidator, response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                noValidatorAuthServerBaseUrl = "http://localhost:3001";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: noValidatorAuthServerBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)(),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                allowDynamicClientRegistration: true,
                                            }),
                                        ],
                                    })];
                            case 1:
                                customFetchWithoutValidator = (_a.sent()).customFetchImpl;
                                return [4 /*yield*/, customFetchWithoutValidator("".concat(noValidatorAuthServerBaseUrl, "/api/auth/oauth2/register"), {
                                        method: "POST",
                                        headers: {
                                            authorization: "Bearer ".concat(validInitialAccessToken),
                                            "content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            client_name: "Machine Client",
                                            redirect_uris: [redirectUri],
                                        }),
                                    })];
                            case 2:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(401);
                                (0, vitest_1.expect)(response.headers.get("WWW-Authenticate")).toBe('Bearer error="invalid_token"');
                                (0, vitest_1.expect)(response.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(response.headers.get("Pragma")).toBe("no-cache");
                                return [4 /*yield*/, response.json()];
                            case 3:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_token");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should register a confidential client_credentials client without redirect_uris", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/register"), {
                                    method: "POST",
                                    headers: {
                                        authorization: "Bearer ".concat(validInitialAccessToken),
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        client_name: "Machine Client",
                                        grant_types: ["client_credentials"],
                                    }),
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.client_id).toBeDefined();
                                (0, vitest_1.expect)(body.client_secret).toBeDefined();
                                (0, vitest_1.expect)(body.grant_types).toEqual(["client_credentials"]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject an authorization_code registration without redirect_uris", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/register"), {
                                    method: "POST",
                                    headers: {
                                        authorization: "Bearer ".concat(validInitialAccessToken),
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        client_name: "Machine Client",
                                        grant_types: ["authorization_code"],
                                    }),
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_redirect_uri");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should answer a no-credentials request with a bare Bearer challenge", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/register"), {
                                    method: "POST",
                                    headers: { "content-type": "application/json" },
                                    body: JSON.stringify({
                                        client_name: "Machine Client",
                                        redirect_uris: [redirectUri],
                                    }),
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(401);
                                // RFC 6750 §3.1: a request with no credentials gets a bare challenge with
                                // no error code.
                                (0, vitest_1.expect)(response.headers.get("WWW-Authenticate")).toBe("Bearer");
                                (0, vitest_1.expect)(response.headers.get("Cache-Control")).toBe("no-store");
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should create an unowned client when the validator returns no referenceId", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var ownerlessBaseUrl, ownerlessFetch, response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ownerlessBaseUrl = "http://localhost:3002";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: ownerlessBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)(),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                allowDynamicClientRegistration: true,
                                                validateInitialAccessToken: function () { return ({}); },
                                            }),
                                        ],
                                    })];
                            case 1:
                                ownerlessFetch = (_a.sent()).customFetchImpl;
                                return [4 /*yield*/, ownerlessFetch("".concat(ownerlessBaseUrl, "/api/auth/oauth2/register"), {
                                        method: "POST",
                                        headers: {
                                            authorization: "Bearer ".concat(validInitialAccessToken),
                                            "content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            client_name: "Machine Client",
                                            grant_types: ["client_credentials"],
                                        }),
                                    })];
                            case 2:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                return [4 /*yield*/, response.json()];
                            case 3:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.client_id).toBeDefined();
                                (0, vitest_1.expect)(body.reference_id).toBeUndefined();
                                (0, vitest_1.expect)(body.user_id).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail closed when the validator throws", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var throwingBaseUrl, throwingFetch, response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                throwingBaseUrl = "http://localhost:3003";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: throwingBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)(),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                allowDynamicClientRegistration: true,
                                                validateInitialAccessToken: function () {
                                                    throw new Error("validator failure");
                                                },
                                            }),
                                        ],
                                    })];
                            case 1:
                                throwingFetch = (_a.sent()).customFetchImpl;
                                return [4 /*yield*/, throwingFetch("".concat(throwingBaseUrl, "/api/auth/oauth2/register"), {
                                        method: "POST",
                                        headers: {
                                            authorization: "Bearer ".concat(validInitialAccessToken),
                                            "content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            client_name: "Machine Client",
                                            redirect_uris: [redirectUri],
                                        }),
                                    })];
                            case 2:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(500);
                                return [4 /*yield*/, response.json()];
                            case 3:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("server_error");
                                (0, vitest_1.expect)(body.error_description).not.toContain("validator failure");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("passes through an APIError the validator throws", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var apiErrorBaseUrl, apiErrorFetch, response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                apiErrorBaseUrl = "http://localhost:3006";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: apiErrorBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)(),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                allowDynamicClientRegistration: true,
                                                validateInitialAccessToken: function () {
                                                    throw new api_1.APIError("FORBIDDEN", {
                                                        error: "access_denied",
                                                        error_description: "tenant suspended",
                                                    });
                                                },
                                            }),
                                        ],
                                    })];
                            case 1:
                                apiErrorFetch = (_a.sent()).customFetchImpl;
                                return [4 /*yield*/, apiErrorFetch("".concat(apiErrorBaseUrl, "/api/auth/oauth2/register"), {
                                        method: "POST",
                                        headers: {
                                            authorization: "Bearer ".concat(validInitialAccessToken),
                                            "content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            client_name: "Machine Client",
                                            redirect_uris: [redirectUri],
                                        }),
                                    })];
                            case 2:
                                response = _a.sent();
                                // A deliberately-thrown APIError shapes the response; it is not swallowed
                                // into the generic server_error.
                                (0, vitest_1.expect)(response.status).toBe(403);
                                return [4 /*yield*/, response.json()];
                            case 3:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("access_denied");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not consult the validator for session-backed registration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var sessionBaseUrl, sessionValidator, _a, sessionFetch, signInSessionUser, headers, sessionClient, response;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                sessionBaseUrl = "http://localhost:3004";
                                sessionValidator = vitest_1.vi.fn(function () { return ({ referenceId: "from-token" }); });
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: sessionBaseUrl,
                                        plugins: [
                                            (0, jwt_1.jwt)(),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                allowDynamicClientRegistration: true,
                                                validateInitialAccessToken: sessionValidator,
                                            }),
                                        ],
                                    })];
                            case 1:
                                _a = _e.sent(), sessionFetch = _a.customFetchImpl, signInSessionUser = _a.signInWithTestUser;
                                return [4 /*yield*/, signInSessionUser()];
                            case 2:
                                headers = (_e.sent()).headers;
                                sessionClient = (0, client_1.createAuthClient)({
                                    plugins: [(0, client_2.oauthProviderClient)()],
                                    baseURL: sessionBaseUrl,
                                    fetchOptions: { customFetchImpl: sessionFetch, headers: headers },
                                });
                                return [4 /*yield*/, sessionClient.oauth2.register({
                                        client_name: "Session Client",
                                        redirect_uris: [redirectUri],
                                    })];
                            case 3:
                                response = _e.sent();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.client_id).toBeDefined();
                                (0, vitest_1.expect)(sessionValidator).not.toHaveBeenCalled();
                                (0, vitest_1.expect)((_c = response.data) === null || _c === void 0 ? void 0 : _c.reference_id).toBeUndefined();
                                (0, vitest_1.expect)((_d = response.data) === null || _d === void 0 ? void 0 : _d.user_id).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("with the bearer plugin: a session bearer is the session, a non-session bearer is an initial access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var bearerBaseUrl, bearerIat, bearerValidator, _a, client, testUser, bearerFetch, sessionBearer, sessionResponse, sessionBody, tokenResponse, tokenBody;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                bearerBaseUrl = "http://localhost:3005";
                                bearerIat = "bearer-precedence-initial-access-token";
                                bearerValidator = vitest_1.vi.fn(function (_a) {
                                    var initialAccessToken = _a.initialAccessToken;
                                    return initialAccessToken === bearerIat
                                        ? { referenceId: "infra-provisioner" }
                                        : false;
                                });
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: bearerBaseUrl,
                                        plugins: [
                                            (0, plugins_1.bearer)(),
                                            (0, jwt_1.jwt)(),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                allowDynamicClientRegistration: true,
                                                validateInitialAccessToken: bearerValidator,
                                            }),
                                        ],
                                    })];
                            case 1:
                                _a = _b.sent(), client = _a.client, testUser = _a.testUser, bearerFetch = _a.customFetchImpl;
                                sessionBearer = "";
                                return [4 /*yield*/, client.signIn.email({ email: testUser.email, password: testUser.password }, {
                                        onSuccess: function (ctx) {
                                            var _a;
                                            sessionBearer = (_a = ctx.response.headers.get("set-auth-token")) !== null && _a !== void 0 ? _a : "";
                                        },
                                    })];
                            case 2:
                                _b.sent();
                                (0, vitest_1.expect)(sessionBearer.length).toBeGreaterThan(0);
                                return [4 /*yield*/, bearerFetch("".concat(bearerBaseUrl, "/api/auth/oauth2/register"), {
                                        method: "POST",
                                        headers: {
                                            authorization: "Bearer ".concat(sessionBearer),
                                            "content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            client_name: "Session Bearer Client",
                                            redirect_uris: [redirectUri],
                                        }),
                                    })];
                            case 3:
                                sessionResponse = _b.sent();
                                (0, vitest_1.expect)(sessionResponse.status).toBe(201);
                                (0, vitest_1.expect)(bearerValidator).not.toHaveBeenCalled();
                                return [4 /*yield*/, sessionResponse.json()];
                            case 4:
                                sessionBody = (_b.sent());
                                (0, vitest_1.expect)(sessionBody.user_id).toBeDefined();
                                (0, vitest_1.expect)(sessionBody.reference_id).toBeUndefined();
                                return [4 /*yield*/, bearerFetch("".concat(bearerBaseUrl, "/api/auth/oauth2/register"), {
                                        method: "POST",
                                        headers: {
                                            authorization: "Bearer ".concat(bearerIat),
                                            "content-type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            client_name: "Machine Client",
                                            grant_types: ["client_credentials"],
                                        }),
                                    })];
                            case 5:
                                tokenResponse = _b.sent();
                                (0, vitest_1.expect)(tokenResponse.status).toBe(201);
                                (0, vitest_1.expect)(bearerValidator).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ initialAccessToken: bearerIat }));
                                return [4 /*yield*/, tokenResponse.json()];
                            case 6:
                                tokenBody = (_b.sent());
                                (0, vitest_1.expect)(tokenBody.reference_id).toBe("infra-provisioner");
                                (0, vitest_1.expect)(tokenBody.user_id).toBeUndefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth register - application_type", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, customFetchImpl, register;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                allowUnauthenticatedClientRegistration: true,
                            }),
                        ],
                    })];
            case 1:
                customFetchImpl = (_a.sent()).customFetchImpl;
                register = makeRegister(customFetchImpl);
                (0, vitest_1.it)("maps applicationType as a first-class field without hiding it in metadata", function () {
                    var stored = (0, register_1.oauthToSchema)({
                        client_id: "mapping-client",
                        redirect_uris: ["com.example.app:/callback"],
                        application_type: "native",
                        metadata: { custom: "value" },
                    });
                    (0, vitest_1.expect)(stored.applicationType).toBe("native");
                    (0, vitest_1.expect)(stored.metadata).toEqual({ custom: "value" });
                    var wire = (0, register_1.schemaToOAuth)(stored);
                    (0, vitest_1.expect)(wire.application_type).toBe("native");
                    (0, vitest_1.expect)(Reflect.get(wire, "custom")).toBe("value");
                    (0, vitest_1.expect)(wire).not.toHaveProperty("applicationType");
                });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/12019
                 */
                (0, vitest_1.it)("stores client metadata as an object for the json column", function () {
                    var stored = (0, register_1.oauthToSchema)({
                        client_id: "metadata-client",
                        redirect_uris: ["https://app.example.com/callback"],
                        metadata: { foo: "bar" },
                    });
                    (0, vitest_1.expect)(stored.metadata).toEqual({ foo: "bar" });
                });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/12019
                 */
                (0, vitest_1.it)("reads client metadata stored as a JSON string", function () {
                    var wire = (0, register_1.schemaToOAuth)({
                        clientId: "legacy-metadata-client",
                        metadata: JSON.stringify({ foo: "bar" }),
                    });
                    (0, vitest_1.expect)(Reflect.get(wire, "foo")).toBe("bar");
                });
                (0, vitest_1.it)("keeps reserved client fields out of opaque metadata responses", function () {
                    var reservedMetadata = {
                        skipConsent: true,
                        enableEndSession: true,
                        requirePKCE: true,
                        clientSecret: "injected-secret",
                        referenceId: "injected-reference",
                        userId: "injected-user",
                        clientId: "injected-client",
                        applicationType: "native",
                        tokenEndpointAuthMethod: "none",
                        redirectUris: ["https://evil.example.com/callback"],
                        postLogoutRedirectUris: ["https://evil.example.com/logout"],
                        grantTypes: ["client_credentials"],
                        responseTypes: ["token"],
                        scopes: ["admin"],
                        clientCredentialsScopes: ["admin"],
                        expiresAt: "2099-01-01T00:00:00.000Z",
                        createdAt: "2099-01-01T00:00:00.000Z",
                        updatedAt: "2099-01-01T00:00:00.000Z",
                        disabled: true,
                        name: "Injected name",
                        uri: "https://evil.example.com",
                        icon: "https://evil.example.com/icon.png",
                        contacts: ["attacker@example.com"],
                        tos: "https://evil.example.com/tos",
                        policy: "https://evil.example.com/policy",
                        softwareId: "injected-software",
                        softwareVersion: "99",
                        softwareStatement: "injected-statement",
                        backchannelLogoutUri: "https://evil.example.com/logout",
                        backchannelLogoutSessionRequired: true,
                        jwks: "injected-jwks",
                        jwksUri: "https://evil.example.com/jwks",
                        dpopBoundAccessTokens: true,
                        subjectType: "pairwise",
                        public: true,
                        type: "native",
                        metadata: { nested: "injected" },
                        resources: ["https://api.example.com/stale"],
                        client_credentials_scopes: ["admin"],
                    };
                    var stored = (0, register_1.oauthToSchema)({
                        client_id: "reserved-metadata-client",
                        redirect_uris: ["https://app.example.com/callback"],
                        metadata: __assign({ custom: "preserved" }, reservedMetadata),
                    });
                    (0, vitest_1.expect)(stored.metadata).toEqual({
                        custom: "preserved",
                    });
                    var wire = (0, register_1.schemaToOAuth)(stored);
                    (0, vitest_1.expect)(Reflect.get(wire, "custom")).toBe("preserved");
                    for (var _i = 0, _a = Object.entries(reservedMetadata); _i < _a.length; _i++) {
                        var _b = _a[_i], field = _b[0], injectedValue = _b[1];
                        (0, vitest_1.expect)(Reflect.get(wire, field)).not.toEqual(injectedValue);
                    }
                });
                (0, vitest_1.it)("registers a native client with exact loopback hosts and custom-scheme redirect URIs", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "native",
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: [
                                        "http://localhost:3005/callback",
                                        "http://127.0.0.1:3005/callback",
                                        "com.example.app:/callback",
                                    ],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.application_type).toBe("native");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a native client with an http redirect URI on a routable host", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "native",
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: ["http://example.com/callback"],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_redirect_uri");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects alternate numeric spellings of the IPv4 loopback host", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "native",
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: ["http://127.1/callback"],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_redirect_uri");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects loopback back-channel logout targets", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "native",
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: ["http://127.0.0.1/callback"],
                                    backchannel_logout_uri: "https://127.0.0.1/backchannel",
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_client_metadata");
                                (0, vitest_1.expect)(body.error_description).toContain("private or reserved");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a web client with an http redirect URI", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "web",
                                    redirect_uris: ["http://example.com/callback"],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_redirect_uri");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a web client with a loopback redirect URI", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _i, _a, redirectUri, response, body;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _i = 0, _a = [
                                    "https://localhost:3005/callback",
                                    "https://localhost./callback",
                                    "https://localhost../callback",
                                ];
                                _b.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 5];
                                redirectUri = _a[_i];
                                return [4 /*yield*/, register({
                                        application_type: "web",
                                        redirect_uris: [redirectUri],
                                    })];
                            case 2:
                                response = _b.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                return [4 /*yield*/, response.json()];
                            case 3:
                                body = (_b.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_redirect_uri");
                                _b.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 1];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("registers a web client with an https redirect URI", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "web",
                                    redirect_uris: ["https://rp.example.com/callback"],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.application_type).toBe("web");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("keeps application type and client authentication as orthogonal axes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "native",
                                    token_endpoint_auth_method: "client_secret_post",
                                    redirect_uris: ["com.example.app:/callback"],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.application_type).toBe("native");
                                (0, vitest_1.expect)(body.token_endpoint_auth_method).toBe("client_secret_post");
                                (0, vitest_1.expect)(body.client_secret).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.for([
                    "file:///callback",
                    "ftp://example.com/callback",
                    "mailto:oauth@example.com",
                    "ws://host/callback",
                    "wss://host/callback",
                    "myapp:/callback",
                    "com.example.app:callback",
                    "com.example.app:///callback",
                    "com..example.app:/callback",
                    "com.example..app:/callback",
                    "com.example.-app:/callback",
                    "com.example.app-:/callback",
                    "https://localhost/callback",
                    "https://localhost./callback",
                    "https://localhost../callback",
                    "http://localhost./callback",
                    "http://localhost../callback",
                    "https://127.0.0.1/callback",
                    "http://example.com/callback",
                    "http://192.168.1.2/callback",
                    "http://tenant.localhost/callback",
                    "http://127.42.7.9:49152/callback",
                    "https://user:password@example.com/callback",
                    "https://example.com/callback#fragment",
                ])("rejects invalid native redirect URI %s", function (redirectUri) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "native",
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.for([
                    "http://localhost:54921/callback",
                    "http://127.0.0.1:54921/callback",
                    "http://[::1]:61234/callback",
                    "com.example.app:/callback",
                    "com.example.app://host/callback",
                    "https://app.example.com/callback",
                ])("accepts valid native redirect URI %s", function (redirectUri) { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "native",
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: [redirectUri],
                                })];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(201);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("defaults omitted application_type to web and applies web redirect policy", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var rejected, accepted, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    redirect_uris: ["http://localhost:5000/api/auth/callback/test"],
                                })];
                            case 1:
                                rejected = _a.sent();
                                (0, vitest_1.expect)(rejected.status).toBe(400);
                                return [4 /*yield*/, register({
                                        redirect_uris: ["https://rp.example.com/callback"],
                                    })];
                            case 2:
                                accepted = _a.sent();
                                (0, vitest_1.expect)(accepted.status).toBe(201);
                                return [4 /*yield*/, accepted.json()];
                            case 3:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.application_type).toBe("web");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * Cursor's MCP OAuth client registers `cursor://…` as a native private-use
                 * redirect. Host-bearing custom schemes are valid native URIs (RFC 8252 §7.1
                 * recommends, but does not require, the authority-free reverse-domain form).
                 * A `web` registration with the same URI still fails — this is not a
                 * `web`→`native` coercion.
                 *
                 * @see https://github.com/better-auth/better-auth/issues/10946
                 */
                (0, vitest_1.it)("registers Cursor's host-bearing cursor:// redirect for native clients only", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var native, nativeBody, web, webBody;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, register({
                                    application_type: "native",
                                    token_endpoint_auth_method: "none",
                                    redirect_uris: ["cursor://anysphere.cursor-mcp/oauth/callback"],
                                })];
                            case 1:
                                native = _a.sent();
                                (0, vitest_1.expect)(native.status).toBe(201);
                                return [4 /*yield*/, native.json()];
                            case 2:
                                nativeBody = (_a.sent());
                                (0, vitest_1.expect)(nativeBody.application_type).toBe("native");
                                (0, vitest_1.expect)(nativeBody.redirect_uris).toEqual([
                                    "cursor://anysphere.cursor-mcp/oauth/callback",
                                ]);
                                return [4 /*yield*/, register({
                                        application_type: "web",
                                        redirect_uris: ["cursor://anysphere.cursor-mcp/oauth/callback"],
                                    })];
                            case 3:
                                web = _a.sent();
                                (0, vitest_1.expect)(web.status).toBe(400);
                                return [4 /*yield*/, web.json()];
                            case 4:
                                webBody = (_a.sent());
                                (0, vitest_1.expect)(webBody.error).toBe("invalid_redirect_uri");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * Current Cursor builds (observed on 3.13.25) OMIT `application_type` in DCR,
 * so the OIDC `web` default rejects their `cursor://` redirect before the
 * native validator is consulted. `clientRegistrationDefaultApplicationType`
 * is server-owned policy for that absent field only — a sent value is never
 * overridden.
 *
 * @see https://github.com/better-auth/better-auth/issues/10946
 */
(0, vitest_1.describe)("oauth register - clientRegistrationDefaultApplicationType", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, instanceWithDefault;
    return __generator(this, function (_a) {
        authServerBaseUrl = "http://localhost:3000";
        instanceWithDefault = function (defaultApplicationType) { return __awaiter(void 0, void 0, void 0, function () {
            var customFetchImpl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authServerBaseUrl,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    allowDynamicClientRegistration: true,
                                    allowUnauthenticatedClientRegistration: true,
                                    clientRegistrationDefaultApplicationType: defaultApplicationType,
                                }),
                            ],
                        })];
                    case 1:
                        customFetchImpl = (_a.sent()).customFetchImpl;
                        return [2 /*return*/, makeRegister(customFetchImpl)];
                }
            });
        }); };
        (0, vitest_1.it)("infers native when a redirect URI uses a custom scheme", function () { return __awaiter(void 0, void 0, void 0, function () {
            var register, response, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instanceWithDefault("infer")];
                    case 1:
                        register = _a.sent();
                        return [4 /*yield*/, register({
                                token_endpoint_auth_method: "none",
                                redirect_uris: ["cursor://anysphere.cursor-mcp/oauth/callback"],
                            })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(201);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        body = (_a.sent());
                        (0, vitest_1.expect)(body.application_type).toBe("native");
                        (0, vitest_1.expect)(body.token_endpoint_auth_method).toBe("none");
                        (0, vitest_1.expect)(body.redirect_uris).toEqual([
                            "cursor://anysphere.cursor-mcp/oauth/callback",
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * @see https://github.com/croffasia/itsaplan/issues/563
         */
        vitest_1.it.each([
            "http://127.0.0.1:33418/callback",
            "http://localhost:33418/callback",
            "http://[::1]:33418/callback",
        ])("infers native for an http loopback redirect URI: %s", function (redirectUri) { return __awaiter(void 0, void 0, void 0, function () {
            var register, response, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instanceWithDefault("infer")];
                    case 1:
                        register = _a.sent();
                        return [4 /*yield*/, register({
                                token_endpoint_auth_method: "none",
                                redirect_uris: [redirectUri],
                            })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(201);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        body = (_a.sent());
                        (0, vitest_1.expect)(body.application_type).toBe("native");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("keeps the web classification under infer when every redirect URI is https", function () { return __awaiter(void 0, void 0, void 0, function () {
            var register, https, httpsBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instanceWithDefault("infer")];
                    case 1:
                        register = _a.sent();
                        return [4 /*yield*/, register({
                                redirect_uris: ["https://rp.example.com/callback"],
                            })];
                    case 2:
                        https = _a.sent();
                        (0, vitest_1.expect)(https.status).toBe(201);
                        return [4 /*yield*/, https.json()];
                    case 3:
                        httpsBody = (_a.sent());
                        (0, vitest_1.expect)(httpsBody.application_type).toBe("web");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("infers native for Cursor's mixed redirect URI registration", function () { return __awaiter(void 0, void 0, void 0, function () {
            var register, response, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instanceWithDefault("infer")];
                    case 1:
                        register = _a.sent();
                        return [4 /*yield*/, register({
                                client_name: "Cursor",
                                redirect_uris: [
                                    "cursor://anysphere.cursor-mcp/oauth/callback",
                                    "https://www.cursor.com/agents/mcp/oauth/callback",
                                    "http://localhost:8787/callback",
                                ],
                                grant_types: ["authorization_code", "refresh_token"],
                                response_types: ["code"],
                                token_endpoint_auth_method: "none",
                            })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(201);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        body = (_a.sent());
                        (0, vitest_1.expect)(body.application_type).toBe("native");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("applies native redirect rules to every URI of an inferred native client", function () { return __awaiter(void 0, void 0, void 0, function () {
            var register, response, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instanceWithDefault("infer")];
                    case 1:
                        register = _a.sent();
                        return [4 /*yield*/, register({
                                token_endpoint_auth_method: "none",
                                redirect_uris: [
                                    "cursor://anysphere.cursor-mcp/oauth/callback",
                                    "http://rp.example.com/callback",
                                ],
                            })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(400);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        body = (_a.sent());
                        (0, vitest_1.expect)(body.error).toBe("invalid_redirect_uri");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("never overrides an application_type the client actually sent", function () { return __awaiter(void 0, void 0, void 0, function () {
            var register, response, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instanceWithDefault("infer")];
                    case 1:
                        register = _a.sent();
                        return [4 /*yield*/, register({
                                application_type: "web",
                                token_endpoint_auth_method: "none",
                                redirect_uris: ["cursor://anysphere.cursor-mcp/oauth/callback"],
                            })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(400);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        body = (_a.sent());
                        (0, vitest_1.expect)(body.error).toBe("invalid_redirect_uri");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("applies a configured native default to omitted application_type", function () { return __awaiter(void 0, void 0, void 0, function () {
            var register, response, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instanceWithDefault("native")];
                    case 1:
                        register = _a.sent();
                        return [4 /*yield*/, register({
                                token_endpoint_auth_method: "none",
                                redirect_uris: ["cursor://anysphere.cursor-mcp/oauth/callback"],
                            })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(201);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        body = (_a.sent());
                        (0, vitest_1.expect)(body.application_type).toBe("native");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("completes authorization and token exchange for an inferred Cursor client", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cursorRedirect, _a, client, customFetchImpl, signInWithTestUser, register, registration, clientId, headers, codeVerifier, authUrl, consentRedirectUrl, consentRes, callback, code, _b, tokenBody, tokenHeaders, tokenRes, tokens;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cursorRedirect = "cursor://anysphere.cursor-mcp/oauth/callback";
                        return [4 /*yield*/, (0, test_1.getTestInstance)({
                                baseURL: authServerBaseUrl,
                                plugins: [
                                    (0, jwt_1.jwt)(),
                                    (0, oauth_1.oauthProvider)({
                                        loginPage: "/login",
                                        consentPage: "/consent",
                                        allowDynamicClientRegistration: true,
                                        allowUnauthenticatedClientRegistration: true,
                                        clientRegistrationDefaultApplicationType: "infer",
                                    }),
                                ],
                            }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
                    case 1:
                        _a = _c.sent(), client = _a.client, customFetchImpl = _a.customFetchImpl, signInWithTestUser = _a.signInWithTestUser;
                        register = makeRegister(customFetchImpl);
                        return [4 /*yield*/, register({
                                client_name: "Cursor",
                                redirect_uris: [
                                    cursorRedirect,
                                    "https://www.cursor.com/agents/mcp/oauth/callback",
                                    "http://localhost:8787/callback",
                                ],
                                grant_types: ["authorization_code", "refresh_token"],
                                response_types: ["code"],
                                token_endpoint_auth_method: "none",
                            })];
                    case 2:
                        registration = _c.sent();
                        (0, vitest_1.expect)(registration.status).toBe(201);
                        return [4 /*yield*/, registration.json()];
                    case 3:
                        clientId = (_c.sent()).client_id;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 4:
                        headers = (_c.sent()).headers;
                        codeVerifier = (0, crypto_1.generateRandomString)(64);
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                id: "cursor",
                                options: { clientId: clientId, redirectURI: cursorRedirect },
                                redirectURI: "",
                                authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                                state: "cursor-state",
                                scopes: ["openid"],
                                codeVerifier: codeVerifier,
                            })];
                    case 5:
                        authUrl = _c.sent();
                        consentRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                headers: headers,
                                onError: function (ctx) {
                                    consentRedirectUrl = ctx.response.headers.get("Location") || "";
                                },
                            })];
                    case 6:
                        _c.sent();
                        (0, vitest_1.expect)(consentRedirectUrl).toContain("/consent");
                        vitest_1.vi.stubGlobal("window", {
                            location: {
                                search: new URL(consentRedirectUrl, authServerBaseUrl).search,
                            },
                        });
                        (0, vitest_1.onTestFinished)(function () {
                            vitest_1.vi.unstubAllGlobals();
                        });
                        return [4 /*yield*/, client.oauth2.consent({ accept: true }, { headers: headers, throw: true })];
                    case 7:
                        consentRes = _c.sent();
                        callback = new URL(consentRes.url);
                        (0, vitest_1.expect)("".concat(callback.protocol, "//").concat(callback.host).concat(callback.pathname)).toBe(cursorRedirect);
                        code = callback.searchParams.get("code");
                        (0, vitest_1.expect)(code).toEqual(vitest_1.expect.any(String));
                        return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                code: code,
                                codeVerifier: codeVerifier,
                                redirectURI: cursorRedirect,
                                options: { clientId: clientId, redirectURI: cursorRedirect },
                            })];
                    case 8:
                        _b = _c.sent(), tokenBody = _b.body, tokenHeaders = _b.headers;
                        return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/api/auth/oauth2/token"), { method: "POST", body: tokenBody.toString(), headers: tokenHeaders })];
                    case 9:
                        tokenRes = _c.sent();
                        (0, vitest_1.expect)(tokenRes.status).toBe(200);
                        return [4 /*yield*/, tokenRes.json()];
                    case 10:
                        tokens = (_c.sent());
                        (0, vitest_1.expect)(tokens.access_token).toEqual(vitest_1.expect.any(String));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("keeps the strict web default when the option is unset", function () { return __awaiter(void 0, void 0, void 0, function () {
            var register, response, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instanceWithDefault(undefined)];
                    case 1:
                        register = _a.sent();
                        return [4 /*yield*/, register({
                                token_endpoint_auth_method: "none",
                                redirect_uris: ["cursor://anysphere.cursor-mcp/oauth/callback"],
                            })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(400);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        body = (_a.sent());
                        (0, vitest_1.expect)(body.error).toBe("invalid_redirect_uri");
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
