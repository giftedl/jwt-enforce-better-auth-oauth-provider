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
var api_1 = require("@better-auth/core/api");
var api_2 = require("better-auth/api");
var client_1 = require("better-auth/client");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var z = require("zod");
var client_2 = require("../client");
var oauth_1 = require("../oauth");
(0, vitest_1.describe)("oauthConsent", function () { return __awaiter(void 0, void 0, void 0, function () {
    var providerId, baseUrl, rpBaseUrl, redirectUri, _a, auth, signInWithTestUser, customFetchImpl, _b, headers, user, authClient, oauthClient1, oauthClient1Scopes, oauthClient2, oauthClient2Scopes, consent1, consent2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                providerId = "test";
                baseUrl = "http://localhost:3000";
                rpBaseUrl = "http://localhost:5000";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, jwt_1.jwt)(),
                            {
                                id: "createConsentTester",
                                endpoints: {
                                    testerCreateConsent: (0, api_1.createAuthEndpoint)("/server/oauth2/consent", {
                                        method: "POST",
                                        body: z.object({
                                            clientId: z.string(),
                                            scopes: z.array(z.string()),
                                            userId: z.string().optional(),
                                            referenceId: z.string().optional(),
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
                authClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                        headers: headers,
                    },
                });
                oauthClient1Scopes = ["profile"];
                oauthClient2Scopes = ["openid", "profile"];
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client1, client2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                    },
                                })];
                            case 1:
                                client1 = _a.sent();
                                (0, vitest_1.expect)(client1 === null || client1 === void 0 ? void 0 : client1.client_id).toBeDefined();
                                (0, vitest_1.expect)(client1 === null || client1 === void 0 ? void 0 : client1.user_id).toBeDefined();
                                (0, vitest_1.expect)(client1 === null || client1 === void 0 ? void 0 : client1.client_secret).toBeDefined();
                                oauthClient1 = client1;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            scope: oauthClient2Scopes.join(" "),
                                        },
                                    })];
                            case 2:
                                client2 = _a.sent();
                                (0, vitest_1.expect)(client2 === null || client2 === void 0 ? void 0 : client2.client_id).toBeDefined();
                                (0, vitest_1.expect)(client2 === null || client2 === void 0 ? void 0 : client2.user_id).toBeDefined();
                                (0, vitest_1.expect)(client2 === null || client2 === void 0 ? void 0 : client2.client_secret).toBeDefined();
                                (0, vitest_1.expect)(client2 === null || client2 === void 0 ? void 0 : client2.scope).toBe(oauthClient2Scopes.join(" "));
                                oauthClient2 = client2;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should create a tester consents", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _consent1, _consent2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.testerCreateConsent({
                                    headers: headers,
                                    body: {
                                        clientId: oauthClient1.client_id,
                                        userId: user.id,
                                        scopes: oauthClient1Scopes,
                                    },
                                })];
                            case 1:
                                _consent1 = _a.sent();
                                (0, vitest_1.expect)(_consent1 === null || _consent1 === void 0 ? void 0 : _consent1.clientId).toBe(oauthClient1.client_id);
                                (0, vitest_1.expect)(_consent1 === null || _consent1 === void 0 ? void 0 : _consent1.userId).toBe(user.id);
                                (0, vitest_1.expect)(_consent1.scopes).toStrictEqual(oauthClient1Scopes);
                                consent1 = _consent1;
                                return [4 /*yield*/, auth.api.testerCreateConsent({
                                        headers: headers,
                                        body: {
                                            clientId: oauthClient2.client_id,
                                            userId: user.id,
                                            scopes: oauthClient2Scopes,
                                        },
                                    })];
                            case 2:
                                _consent2 = _a.sent();
                                (0, vitest_1.expect)(_consent2 === null || _consent2 === void 0 ? void 0 : _consent2.clientId).toBe(oauthClient2.client_id);
                                (0, vitest_1.expect)(_consent2 === null || _consent2 === void 0 ? void 0 : _consent2.userId).toBe(user.id);
                                (0, vitest_1.expect)(_consent2.scopes).toStrictEqual(oauthClient2Scopes);
                                consent2 = _consent2;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get a specific consent", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var consent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.getConsent({
                                    query: {
                                        id: consent1.id,
                                    },
                                })];
                            case 1:
                                consent = _a.sent();
                                (0, vitest_1.expect)(consent.data).toMatchObject(consent1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should get user's consents", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var consents;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.getConsents()];
                            case 1:
                                consents = _b.sent();
                                (0, vitest_1.expect)((_a = consents.data) === null || _a === void 0 ? void 0 : _a.length).toBe(2);
                                (0, vitest_1.expect)(consents.data).toStrictEqual([consent1, consent2]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not allow updates to scopes not granted to client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var consent;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.updateConsent({
                                    id: consent2.id,
                                    update: {
                                        scopes: ["email"],
                                    },
                                })];
                            case 1:
                                consent = _b.sent();
                                (0, vitest_1.expect)((_a = consent.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should allow scopes change to client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var consent;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.updateConsent({
                                    id: consent1.id,
                                    update: {
                                        scopes: ["email"],
                                    },
                                })];
                            case 1:
                                consent = _b.sent();
                                (0, vitest_1.expect)((_a = consent.data) === null || _a === void 0 ? void 0 : _a.scopes).toStrictEqual(["email"]);
                                consent1 = consent.data;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject updates to a consent owned by another user", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var otherUser, otherConsent, res;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, auth.api.signUpEmail({
                                    body: {
                                        email: "other-consent-owner@test.com",
                                        password: "password123",
                                        name: "Other Consent Owner",
                                    },
                                })];
                            case 1:
                                otherUser = _b.sent();
                                return [4 /*yield*/, auth.api.testerCreateConsent({
                                        headers: headers,
                                        body: {
                                            clientId: oauthClient1.client_id,
                                            userId: otherUser.user.id,
                                            scopes: oauthClient1Scopes,
                                        },
                                    })];
                            case 2:
                                otherConsent = _b.sent();
                                return [4 /*yield*/, authClient.oauth2.updateConsent({
                                        id: otherConsent.id,
                                        update: { scopes: oauthClient1Scopes },
                                    })];
                            case 3:
                                res = _b.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should delete the consent", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var consent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, authClient.oauth2.deleteConsent({
                                    id: consent1.id,
                                })];
                            case 1:
                                consent = _a.sent();
                                (0, vitest_1.expect)(consent.data).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
