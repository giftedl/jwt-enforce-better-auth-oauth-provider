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
var jwt_1 = require("better-auth/plugins/jwt");
var organization_1 = require("better-auth/plugins/organization");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var client_1 = require("./client");
var oauth_1 = require("./oauth");
var signed_query_1 = require("./signed-query");
var baseURL = "http://localhost:3000";
var redirectURI = "https://client.example.com/callback";
function createPostLoginTestInstance() {
    return __awaiter(this, void 0, void 0, function () {
        function authorize() {
            return __awaiter(this, arguments, void 0, function (requestHeaders) {
                var response;
                var _a;
                if (requestHeaders === void 0) { requestHeaders = headers; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, auth.handler(new Request("".concat(baseURL, "/api/auth/oauth2/authorize?").concat(query), {
                                headers: requestHeaders,
                            }))];
                        case 1:
                            response = _b.sent();
                            return [2 /*return*/, new URL((_a = response.headers.get("location")) !== null && _a !== void 0 ? _a : "", baseURL)];
                    }
                });
            });
        }
        var shouldRedirect, instance, auth, signInWithTestUser, headers, organizations, _i, _a, slug, organization_2, oauthClient, query;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    shouldRedirect = vitest_1.vi.fn();
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: baseURL,
                            plugins: [
                                (0, organization_1.organization)(),
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    scopes: ["openid", "read:organization"],
                                    postLogin: {
                                        page: "/select-organization",
                                        shouldRedirect: shouldRedirect,
                                        consentReferenceId: function (_a) {
                                            var session = _a.session;
                                            if (typeof session.activeOrganizationId !== "string") {
                                                throw new api_1.APIError("BAD_REQUEST", {
                                                    message: "Select an organization",
                                                });
                                            }
                                            return session.activeOrganizationId;
                                        },
                                    },
                                }),
                            ],
                        }, { clientOptions: { plugins: [(0, client_1.oauthProviderClient)()] } })];
                case 1:
                    instance = _b.sent();
                    auth = instance.auth, signInWithTestUser = instance.signInWithTestUser;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    organizations = [];
                    _i = 0, _a = ["first", "second"];
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    slug = _a[_i];
                    return [4 /*yield*/, auth.api.createOrganization({
                            headers: headers,
                            body: { name: slug, slug: slug, keepCurrentActiveOrganization: true },
                        })];
                case 4:
                    organization_2 = _b.sent();
                    if (!organization_2)
                        throw new Error("Organization was not created");
                    organizations.push(organization_2);
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    shouldRedirect.mockImplementation(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var memberships, hasActiveOrganization;
                        var session = _b.session, headers = _b.headers, isContinuation = _b.isContinuation;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, auth.api.listOrganizations({ headers: headers })];
                                case 1:
                                    memberships = _c.sent();
                                    hasActiveOrganization = memberships.some(function (organization) { return organization.id === session.activeOrganizationId; });
                                    return [2 /*return*/, (!hasActiveOrganization || (!isContinuation && memberships.length > 1))];
                            }
                        });
                    }); });
                    return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: { redirect_uris: [redirectURI] },
                        })];
                case 7:
                    oauthClient = _b.sent();
                    query = new URLSearchParams({
                        client_id: oauthClient.client_id,
                        redirect_uri: redirectURI,
                        response_type: "code",
                        scope: "openid read:organization",
                        state: "organization-selection",
                        code_challenge: "a".repeat(43),
                        code_challenge_method: "S256",
                    });
                    return [2 /*return*/, __assign(__assign({}, instance), { headers: headers, organizations: organizations, shouldRedirect: shouldRedirect, authorize: authorize })];
            }
        });
    });
}
/** @see https://github.com/better-auth/better-auth/issues/11093 */
(0, vitest_1.describe)("post-login organization selection", function () {
    (0, vitest_1.it)("continues to consent for a multi-organization user and asks again on a new grant", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, auth, client, headers, organizations, shouldRedirect, authorize, selection, continuation, consent, result, callback, adapter, savedConsent, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, createPostLoginTestInstance()];
                case 1:
                    _a = _c.sent(), auth = _a.auth, client = _a.client, headers = _a.headers, organizations = _a.organizations, shouldRedirect = _a.shouldRedirect, authorize = _a.authorize;
                    return [4 /*yield*/, authorize()];
                case 2:
                    selection = _c.sent();
                    (0, vitest_1.expect)(selection.pathname).toBe("/select-organization");
                    (0, vitest_1.expect)(selection.searchParams.get(signed_query_1.postLoginClearedParam)).toBeNull();
                    return [4 /*yield*/, auth.api.setActiveOrganization({
                            headers: headers,
                            body: { organizationId: organizations[1].id },
                        })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, client.oauth2.continue({
                            postLogin: true,
                            oauth_query: selection.search.slice(1),
                            fetchOptions: { headers: headers, throw: true },
                        })];
                case 4:
                    continuation = _c.sent();
                    consent = new URL(continuation.url, baseURL);
                    (0, vitest_1.expect)(consent.pathname).toBe("/consent");
                    (0, vitest_1.expect)(shouldRedirect).toHaveBeenLastCalledWith(vitest_1.expect.objectContaining({ isContinuation: true }));
                    return [4 /*yield*/, client.oauth2.consent({
                            accept: true,
                            oauth_query: consent.search.slice(1),
                            fetchOptions: { headers: headers, throw: true },
                        })];
                case 5:
                    result = _c.sent();
                    callback = new URL(result.url);
                    (0, vitest_1.expect)(callback.origin + callback.pathname).toBe(redirectURI);
                    (0, vitest_1.expect)(callback.searchParams.get("code")).toBeTruthy();
                    (0, vitest_1.expect)(callback.searchParams.get("state")).toBe("organization-selection");
                    return [4 /*yield*/, auth.$context];
                case 6:
                    adapter = (_c.sent()).adapter;
                    return [4 /*yield*/, adapter.findOne({
                            model: "oauthConsent",
                            where: [{ field: "referenceId", value: organizations[1].id }],
                        })];
                case 7:
                    savedConsent = _c.sent();
                    (0, vitest_1.expect)(savedConsent === null || savedConsent === void 0 ? void 0 : savedConsent.referenceId).toBe(organizations[1].id);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, authorize()];
                case 8:
                    _b.apply(void 0, [(_c.sent()).pathname]).toBe("/select-organization");
                    (0, vitest_1.expect)(shouldRedirect).toHaveBeenLastCalledWith(vitest_1.expect.objectContaining({ isContinuation: false }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("keeps the selection page when continuation has no selected organization", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, client, headers, authorize, selection, continuation, redirect;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, createPostLoginTestInstance()];
                case 1:
                    _a = _b.sent(), client = _a.client, headers = _a.headers, authorize = _a.authorize;
                    return [4 /*yield*/, authorize()];
                case 2:
                    selection = _b.sent();
                    return [4 /*yield*/, client.oauth2.continue({
                            postLogin: true,
                            oauth_query: selection.search.slice(1),
                            fetchOptions: { headers: headers, throw: true },
                        })];
                case 3:
                    continuation = _b.sent();
                    redirect = new URL(continuation.url, baseURL);
                    (0, vitest_1.expect)(redirect.pathname).toBe("/select-organization");
                    (0, vitest_1.expect)(redirect.searchParams.get("code")).toBeNull();
                    (0, vitest_1.expect)(redirect.searchParams.get(signed_query_1.postLoginClearedParam)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
vitest_1.describe.each([
    ["undefined", undefined],
    ["an empty string", ""],
])("consent without a reference (%s)", function (_, noReference) {
    function createNoReferenceTestInstance() {
        return __awaiter(this, void 0, void 0, function () {
            function storeConsent(referenceId, scopes, id) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, adapter.create({
                                    model: "oauthConsent",
                                    forceAllowId: id !== undefined,
                                    data: __assign(__assign({}, (id ? { id: id } : {})), { clientId: oauthClient.client_id, userId: user.id, referenceId: referenceId, scopes: scopes, createdAt: new Date(), updatedAt: new Date() }),
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
            function authorize(scope) {
                return __awaiter(this, void 0, void 0, function () {
                    var query, response;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                query = new URLSearchParams({
                                    client_id: oauthClient.client_id,
                                    redirect_uri: redirectURI,
                                    response_type: "code",
                                    scope: scope,
                                    state: "no-reference",
                                    code_challenge: "a".repeat(43),
                                    code_challenge_method: "S256",
                                });
                                return [4 /*yield*/, auth.handler(new Request("".concat(baseURL, "/api/auth/oauth2/authorize?").concat(query), {
                                        headers: headers,
                                    }))];
                            case 1:
                                response = _b.sent();
                                return [2 /*return*/, new URL((_a = response.headers.get("location")) !== null && _a !== void 0 ? _a : "", baseURL)];
                        }
                    });
                });
            }
            function findConsents() {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, adapter.findMany({
                                model: "oauthConsent",
                                where: [{ field: "clientId", value: oauthClient.client_id }],
                            })];
                    });
                });
            }
            var instance, auth, signInWithTestUser, _a, headers, user, oauthClient, adapter;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: baseURL,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    scopes: ["openid", "read", "write"],
                                    postLogin: {
                                        page: "/select-organization",
                                        shouldRedirect: function () { return false; },
                                        consentReferenceId: function () { return noReference; },
                                    },
                                }),
                            ],
                        }, { clientOptions: { plugins: [(0, client_1.oauthProviderClient)()] } })];
                    case 1:
                        instance = _b.sent();
                        auth = instance.auth, signInWithTestUser = instance.signInWithTestUser;
                        return [4 /*yield*/, signInWithTestUser()];
                    case 2:
                        _a = _b.sent(), headers = _a.headers, user = _a.user;
                        return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: { redirect_uris: [redirectURI] },
                            })];
                    case 3:
                        oauthClient = _b.sent();
                        return [4 /*yield*/, auth.$context];
                    case 4:
                        adapter = (_b.sent()).adapter;
                        return [4 /*yield*/, storeConsent("org_1", ["read"])];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, __assign(__assign({}, instance), { headers: headers, authorize: authorize, findConsents: findConsents, storeConsent: storeConsent })];
                }
            });
        });
    }
    (0, vitest_1.it)("asks for consent instead of reusing another reference's consent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var authorize, redirect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createNoReferenceTestInstance()];
                case 1:
                    authorize = (_a.sent()).authorize;
                    return [4 /*yield*/, authorize("read")];
                case 2:
                    redirect = _a.sent();
                    (0, vitest_1.expect)(redirect.pathname).toBe("/consent");
                    (0, vitest_1.expect)(redirect.searchParams.get("code")).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reuses consent saved with an empty reference", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, authorize, storeConsent, redirect;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, createNoReferenceTestInstance()];
                case 1:
                    _a = _b.sent(), authorize = _a.authorize, storeConsent = _a.storeConsent;
                    return [4 /*yield*/, storeConsent("", ["read"])];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, authorize("read")];
                case 3:
                    redirect = _b.sent();
                    (0, vitest_1.expect)(redirect.origin + redirect.pathname).toBe(redirectURI);
                    (0, vitest_1.expect)(redirect.searchParams.get("code")).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("finds consent without a reference past the first page of consents", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, authorize, storeConsent, redirect;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, createNoReferenceTestInstance()];
                case 1:
                    _a = _b.sent(), authorize = _a.authorize, storeConsent = _a.storeConsent;
                    return [4 /*yield*/, Promise.all(Array.from({ length: 100 }, function (_, i) {
                            var index = String(i).padStart(3, "0");
                            return storeConsent("org_".concat(index), ["read"], "consent-".concat(index));
                        }))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, storeConsent("", ["read"], "consent-zzz")];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, authorize("read")];
                case 4:
                    redirect = _b.sent();
                    (0, vitest_1.expect)(redirect.origin + redirect.pathname).toBe(redirectURI);
                    (0, vitest_1.expect)(redirect.searchParams.get("code")).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("stores the approval without changing another reference's consent", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, client, headers, authorize, findConsents, consentPage, result, callback, consents;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, createNoReferenceTestInstance()];
                case 1:
                    _a = _d.sent(), client = _a.client, headers = _a.headers, authorize = _a.authorize, findConsents = _a.findConsents;
                    return [4 /*yield*/, authorize("read write")];
                case 2:
                    consentPage = _d.sent();
                    (0, vitest_1.expect)(consentPage.pathname).toBe("/consent");
                    return [4 /*yield*/, client.oauth2.consent({
                            accept: true,
                            oauth_query: consentPage.search.slice(1),
                            fetchOptions: { headers: headers, throw: true },
                        })];
                case 3:
                    result = _d.sent();
                    callback = new URL(result.url);
                    (0, vitest_1.expect)(callback.origin + callback.pathname).toBe(redirectURI);
                    (0, vitest_1.expect)(callback.searchParams.get("code")).toBeTruthy();
                    return [4 /*yield*/, findConsents()];
                case 4:
                    consents = _d.sent();
                    (0, vitest_1.expect)(consents).toHaveLength(2);
                    (0, vitest_1.expect)((_b = consents.find(function (c) { return c.referenceId === "org_1"; })) === null || _b === void 0 ? void 0 : _b.scopes).toEqual([
                        "read",
                    ]);
                    (0, vitest_1.expect)((_c = consents.find(function (c) { return !c.referenceId; })) === null || _c === void 0 ? void 0 : _c.scopes).toEqual([
                        "read",
                        "write",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
});
