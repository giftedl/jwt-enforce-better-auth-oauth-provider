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
var env_1 = require("@better-auth/core/env");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var oauth_1 = require("./oauth");
var register_1 = require("./register");
var resources_1 = require("./resources");
var utils_1 = require("./utils");
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.spyOn(env_1.logger, "warn").mockImplementation(function () { return undefined; });
    vitest_1.vi.spyOn(env_1.logger, "info").mockImplementation(function () { return undefined; });
});
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.restoreAllMocks();
    (0, resources_1.invalidateResourceCache)();
});
var boot = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (options, useTransactionalMemory) {
        var opts, instance, ctx;
        if (options === void 0) { options = {}; }
        if (useTransactionalMemory === void 0) { useTransactionalMemory = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign({ loginPage: "/login", consentPage: "/consent" }, options);
                    return [4 /*yield*/, (0, test_1.getTestInstance)(__assign(__assign({}, (useTransactionalMemory ? { database: undefined } : {})), { plugins: [(0, jwt_1.jwt)(), (0, oauth_1.oauthProvider)(opts)] }))];
                case 1:
                    instance = _a.sent();
                    (0, resources_1.resetSeedStateForTests)();
                    return [4 /*yield*/, instance.auth.$context];
                case 2:
                    ctx = _a.sent();
                    return [4 /*yield*/, (0, resources_1.seedResourcesOnce)(ctx, opts)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign({}, instance), { ctx: ctx, opts: opts })];
            }
        });
    });
};
(0, vitest_1.describe)("DCR — resources field (RFC 7591 §2 extension)", function () {
    (0, vitest_1.it)("unions registration defaults with explicit resources and dedupes the final links", function () { return __awaiter(void 0, void 0, void 0, function () {
        var defaultResource, requestedResource, instance, result, links;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    defaultResource = "https://api.example.com/default";
                    requestedResource = "https://api.example.com/requested";
                    return [4 /*yield*/, boot({
                            allowDynamicClientRegistration: true,
                            allowUnauthenticatedClientRegistration: true,
                            resources: [defaultResource, requestedResource],
                            clientRegistrationDefaultResources: [defaultResource, defaultResource],
                            clientRegistrationAllowedResources: [requestedResource],
                        })];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, instance.auth.api.registerOAuthClient({
                            body: {
                                redirect_uris: ["https://app.example.com/callback"],
                                resources: [requestedResource, defaultResource, requestedResource],
                            },
                        })];
                case 2:
                    result = (_a.sent());
                    (0, vitest_1.expect)(result.resources).toEqual([defaultResource, requestedResource]);
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: result.client_id }],
                        })];
                case 3:
                    links = _a.sent();
                    (0, vitest_1.expect)(links.map(function (link) { return link.resourceId; }).sort()).toEqual([defaultResource, requestedResource].sort());
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects explicit resources outside the effective registration allowlist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var defaultResource, disallowedResource, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    defaultResource = "https://api.example.com/default-only";
                    disallowedResource = "https://api.example.com/configured-but-disallowed";
                    return [4 /*yield*/, boot({
                            allowDynamicClientRegistration: true,
                            allowUnauthenticatedClientRegistration: true,
                            resources: [defaultResource, disallowedResource],
                            clientRegistrationDefaultResources: [defaultResource],
                        })];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.registerOAuthClient({
                            body: {
                                redirect_uris: ["https://app.example.com/callback"],
                                resources: [disallowedResource],
                            },
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects registration resource policies that name unconfigured resources", function () {
        (0, vitest_1.expect)(function () {
            return (0, oauth_1.oauthProvider)({
                loginPage: "/login",
                consentPage: "/consent",
                resources: ["https://api.example.com/configured"],
                clientRegistrationAllowedResources: [
                    "https://api.example.com/not-configured",
                ],
            });
        }).toThrow(/not-configured.*not found in resources/);
    });
    (0, vitest_1.it)("registers a client with valid resources and creates link rows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resource, instance, result, links, storedClient, metadata;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resource = "https://api.example.com/dcr-link";
                    return [4 /*yield*/, boot({
                            allowDynamicClientRegistration: true,
                            allowUnauthenticatedClientRegistration: true,
                            resources: [resource],
                            clientRegistrationAllowedResources: [resource],
                        })];
                case 1:
                    instance = _b.sent();
                    return [4 /*yield*/, instance.auth.api.registerOAuthClient({
                            body: {
                                redirect_uris: ["https://app.example.com/callback"],
                                resources: [resource],
                            },
                        })];
                case 2:
                    result = (_b.sent());
                    (0, vitest_1.expect)(result.client_id).toBeDefined();
                    (0, vitest_1.expect)(result.resources).toEqual([resource]);
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: result.client_id }],
                        })];
                case 3:
                    links = _b.sent();
                    (0, vitest_1.expect)(links === null || links === void 0 ? void 0 : links.length).toBe(1);
                    (0, vitest_1.expect)((_a = links === null || links === void 0 ? void 0 : links[0]) === null || _a === void 0 ? void 0 : _a.resourceId).toBe(resource);
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "clientId", value: result.client_id }],
                        })];
                case 4:
                    storedClient = _b.sent();
                    metadata = typeof (storedClient === null || storedClient === void 0 ? void 0 : storedClient.metadata) === "string"
                        ? JSON.parse(storedClient.metadata)
                        : storedClient === null || storedClient === void 0 ? void 0 : storedClient.metadata;
                    (0, vitest_1.expect)(metadata !== null && metadata !== void 0 ? metadata : {}).not.toHaveProperty("resources");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects an explicit resource when no registration resources are allowed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot({
                        allowDynamicClientRegistration: true,
                        allowUnauthenticatedClientRegistration: true,
                        resources: ["https://api.example.com/exists"],
                    })];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.registerOAuthClient({
                            body: {
                                redirect_uris: ["https://app.example.com/callback"],
                                resources: ["https://api.example.com/exists"],
                            },
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects registration when one requested resource is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resource, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resource = "https://api.example.com/disabled-test";
                    return [4 /*yield*/, boot({
                            allowDynamicClientRegistration: true,
                            allowUnauthenticatedClientRegistration: true,
                            resources: [resource],
                            clientRegistrationAllowedResources: [resource],
                        })];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, instance.ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: resource }],
                            update: { disabled: true },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.registerOAuthClient({
                            body: {
                                redirect_uris: ["https://app.example.com/callback"],
                                resources: [resource],
                            },
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("registration without resources still works (no behavior change)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot({
                        allowDynamicClientRegistration: true,
                        allowUnauthenticatedClientRegistration: true,
                    })];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, instance.auth.api.registerOAuthClient({
                            body: {
                                redirect_uris: ["https://app.example.com/callback"],
                            },
                        })];
                case 2:
                    result = (_a.sent());
                    (0, vitest_1.expect)(result.client_id).toBeDefined();
                    (0, vitest_1.expect)(result.resources).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("managed client registration resources", function () {
    (0, vitest_1.it)("links explicitly selected resources during managed client creation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resource, resourcePrivileges, instance, headers, result, links;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resource = "https://api.example.com/managed-requested";
                    resourcePrivileges = vitest_1.vi.fn(function (_a) {
                        var action = _a.action;
                        return action === "link";
                    });
                    return [4 /*yield*/, boot({
                            resources: [resource],
                            scopes: ["read:business"],
                            clientPrivileges: function () { return true; },
                            resourcePrivileges: resourcePrivileges,
                        }, true)];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, instance.signInWithTestUser()];
                case 2:
                    headers = (_a.sent()).headers;
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                grant_types: ["client_credentials"],
                                client_credentials_scopes: ["read:business"],
                                resources: [resource, resource],
                            },
                        })];
                case 3:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.resources).toEqual([resource]);
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: result.client_id }],
                        })];
                case 4:
                    links = _a.sent();
                    (0, vitest_1.expect)(links.map(function (link) { return link.resourceId; })).toEqual([resource]);
                    (0, vitest_1.expect)(resourcePrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: "link", resourceId: resource }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("checks resource-link privileges before creating a managed client", function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstResource, deniedResource, resourcePrivileges, instance, headers, clientName, storedClient, links;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    firstResource = "https://api.example.com/managed-allowed";
                    deniedResource = "https://api.example.com/managed-denied";
                    resourcePrivileges = vitest_1.vi.fn(function (_a) {
                        var action = _a.action, resourceId = _a.resourceId;
                        return action !== "link" || resourceId !== deniedResource;
                    });
                    return [4 /*yield*/, boot({ resources: [firstResource, deniedResource], resourcePrivileges: resourcePrivileges }, true)];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, instance.signInWithTestUser()];
                case 2:
                    headers = (_a.sent()).headers;
                    clientName = "denied-resource-link";
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                client_name: clientName,
                                resources: [firstResource, deniedResource],
                            },
                        })).rejects.toMatchObject({ statusCode: 401 })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(resourcePrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: "link", resourceId: firstResource }));
                    (0, vitest_1.expect)(resourcePrivileges).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ action: "link", resourceId: deniedResource }));
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "name", value: clientName }],
                        })];
                case 4:
                    storedClient = _a.sent();
                    (0, vitest_1.expect)(storedClient).toBeNull();
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "resourceId", value: firstResource }],
                        })];
                case 5:
                    links = _a.sent();
                    (0, vitest_1.expect)(links).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ["missing", "https://api.example.com/managed-missing", "does not exist"],
        ["disabled", "https://api.example.com/managed-unavailable", "disabled"],
    ])("rejects a %s resource before creating a managed client", function (kind, requested, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var configured, instance, headers, clientName, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    configured = "https://api.example.com/managed-unavailable";
                    return [4 /*yield*/, boot({ resources: [configured] }, true)];
                case 1:
                    instance = _b.sent();
                    if (!(kind === "disabled")) return [3 /*break*/, 3];
                    return [4 /*yield*/, instance.ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: configured }],
                            update: { disabled: true },
                        })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3: return [4 /*yield*/, instance.signInWithTestUser()];
                case 4:
                    headers = (_b.sent()).headers;
                    clientName = "managed-".concat(kind, "-resource");
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                client_name: clientName,
                                grant_types: ["client_credentials"],
                                resources: [requested],
                            },
                        })).rejects.toMatchObject({
                            statusCode: 400,
                            body: {
                                error: "invalid_target",
                                error_description: vitest_1.expect.stringContaining(reason),
                            },
                        })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "name", value: clientName }],
                        })];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ["relative", "managed-relative", "must be an absolute URI"],
        [
            "fragment",
            "https://api.example.com/managed-unavailable#part",
            "must not contain a fragment",
        ],
    ])("rejects a %s resource URI in the request body", function (kind, requested, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, clientName, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, boot({ resources: ["https://api.example.com/managed-unavailable"] }, true)];
                case 1:
                    instance = _b.sent();
                    return [4 /*yield*/, instance.signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    clientName = "managed-".concat(kind, "-resource");
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                client_name: clientName,
                                grant_types: ["client_credentials"],
                                resources: [requested],
                            },
                        })).rejects.toMatchObject({
                            statusCode: 400,
                            body: {
                                code: "VALIDATION_ERROR",
                                message: vitest_1.expect.stringContaining(reason),
                            },
                        })];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "name", value: clientName }],
                        })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("ignores resources sent to the session-facing create endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resource, resourcePrivileges, instance, headers, body, result, links;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resource = "https://api.example.com/session-facing";
                    resourcePrivileges = vitest_1.vi.fn(function () { return true; });
                    return [4 /*yield*/, boot({ resources: [resource], resourcePrivileges: resourcePrivileges }, true)];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, instance.signInWithTestUser()];
                case 2:
                    headers = (_a.sent()).headers;
                    body = {
                        redirect_uris: ["https://app.example.com/callback"],
                        resources: [resource],
                    };
                    return [4 /*yield*/, instance.auth.api.createOAuthClient({
                            headers: headers,
                            body: body,
                        })];
                case 3:
                    result = (_a.sent());
                    (0, vitest_1.expect)(result.resources).toBeUndefined();
                    (0, vitest_1.expect)(resourcePrivileges).not.toHaveBeenCalled();
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: result.client_id }],
                        })];
                case 4:
                    links = _a.sent();
                    (0, vitest_1.expect)(links).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("links server-owned defaults during managed client creation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var defaultResource, instance, headers, result, links;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    defaultResource = "https://api.example.com/managed-default";
                    return [4 /*yield*/, boot({
                            resources: [defaultResource],
                            clientRegistrationDefaultResources: [defaultResource],
                        }, true)];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, instance.signInWithTestUser()];
                case 2:
                    headers = (_a.sent()).headers;
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                redirect_uris: ["https://app.example.com/callback"],
                            },
                        })];
                case 3:
                    result = (_a.sent());
                    (0, vitest_1.expect)(result.resources).toEqual([defaultResource]);
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: result.client_id }],
                        })];
                case 4:
                    links = _a.sent();
                    (0, vitest_1.expect)(links).toEqual([
                        vitest_1.expect.objectContaining({
                            clientId: result.client_id,
                            resourceId: defaultResource,
                        }),
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rolls back the client when a resource link cannot be inserted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var clientName, resource, instance, headers, originalTransaction, storedClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clientName = "transaction-rollback-client";
                    resource = "https://api.example.com/rollback-requested";
                    return [4 /*yield*/, boot({ resources: [resource] }, true)];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, instance.signInWithTestUser()];
                case 2:
                    headers = (_a.sent()).headers;
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                    var originalCreate;
                                    return __generator(this, function (_a) {
                                        originalCreate = transactionAdapter.create.bind(transactionAdapter);
                                        vitest_1.vi.spyOn(transactionAdapter, "create").mockImplementation(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                if (data.model === "oauthClientResource") {
                                                    throw new Error("forced resource-link insertion failure");
                                                }
                                                return [2 /*return*/, originalCreate(data)];
                                            });
                                        }); });
                                        return [2 /*return*/, callback(transactionAdapter)];
                                    });
                                }); })];
                        });
                    }); });
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: {
                                client_name: clientName,
                                redirect_uris: ["https://app.example.com/callback"],
                                resources: [resource],
                            },
                        })).rejects.toThrow("forced resource-link insertion failure")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "name", value: clientName }],
                        })];
                case 4:
                    storedClient = _a.sent();
                    (0, vitest_1.expect)(storedClient).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("trusted client cache provenance", function () {
    (0, vitest_1.it)("does not cache a discovery-owned client when its ID is trusted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var clientId, discovery, instance, endpointContext;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clientId = "https://client.example.com/trusted-discovery.json";
                    discovery = {
                        id: "trusted-test-discovery",
                        matches: function (candidateClientId) { return candidateClientId === clientId; },
                        resolve: function (_ctx, _candidateClientId, existingClient) { return existingClient; },
                    };
                    return [4 /*yield*/, boot({
                            cachedTrustedClients: new Set([clientId]),
                            extensions: [{ clientDiscovery: discovery }],
                        })];
                case 1:
                    instance = _a.sent();
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: discovery.id,
                            metadata: {
                                client_id: clientId,
                                client_name: "Trusted Discovery Client",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, utils_1.getClient)(endpointContext, instance.opts, clientId)).resolves.toMatchObject({ clientDiscoveryId: discovery.id })];
                case 3:
                    _a.sent();
                    instance.opts.extensions = [];
                    return [4 /*yield*/, (0, vitest_1.expect)((0, utils_1.getClient)(endpointContext, instance.opts, clientId)).resolves.toBeNull()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("isolates trusted client cache entries between provider options", function () { return __awaiter(void 0, void 0, void 0, function () {
        var clientId, discovery, providerOne, providerOneContext, providerTwo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clientId = "https://client.example.com/provider-isolation.json";
                    discovery = {
                        id: "provider-one-discovery",
                        matches: function (candidateClientId) { return candidateClientId === clientId; },
                        resolve: function (_ctx, _candidateClientId, existingClient) { return existingClient; },
                    };
                    return [4 /*yield*/, boot({
                            cachedTrustedClients: new Set([clientId]),
                            extensions: [{ clientDiscovery: discovery }],
                        })];
                case 1:
                    providerOne = _a.sent();
                    providerOneContext = {
                        context: providerOne.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(providerOneContext, providerOne.opts, {
                            clientId: clientId,
                            clientDiscoveryId: discovery.id,
                            metadata: {
                                client_id: clientId,
                                client_name: "Provider One Client",
                                redirect_uris: ["https://one.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, utils_1.getClient)(providerOneContext, providerOne.opts, clientId)).resolves.toMatchObject({ name: "Provider One Client" })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, boot({
                            cachedTrustedClients: new Set([clientId]),
                        })];
                case 4:
                    providerTwo = _a.sent();
                    return [4 /*yield*/, providerTwo.ctx.adapter.create({
                            model: "oauthClient",
                            data: {
                                clientId: clientId,
                                clientDiscoveryId: null,
                                name: "Provider Two Client",
                                redirectUris: ["https://two.example.com/callback"],
                                tokenEndpointAuthMethod: "none",
                                applicationType: "web",
                                grantTypes: ["authorization_code"],
                                responseTypes: ["code"],
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, utils_1.getClient)({
                            context: providerTwo.ctx,
                        }, providerTwo.opts, clientId)).resolves.toMatchObject({ name: "Provider Two Client" })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("canonical client metadata document registration", function () {
    (0, vitest_1.it)("fails closed when the persisted client discovery is not installed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, endpointContext;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/orphaned-discovery.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "removed-client-discovery",
                            metadata: {
                                client_id: clientId,
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, utils_1.getClient)(endpointContext, instance.opts, clientId)).resolves.toBeNull()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves omitted application type as null while validating a loopback redirect", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, result, storedClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/metadata.json";
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)({ context: instance.ctx }, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                redirect_uris: ["http://127.0.0.1:5198/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.client.applicationType).toBeNull();
                    (0, vitest_1.expect)(result.client.clientDiscoveryId).toBe("test-client-discovery");
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 3:
                    storedClient = _a.sent();
                    (0, vitest_1.expect)(storedClient).toMatchObject({
                        applicationType: null,
                        clientDiscoveryId: "test-client-discovery",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("persists through the configured oauthClient model", function () { return __awaiter(void 0, void 0, void 0, function () {
        var model, instance, createdModels, originalTransaction, clientId, storedClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = "customCimdOAuthClient";
                    return [4 /*yield*/, boot({
                            schema: { oauthClient: { modelName: model } },
                        })];
                case 1:
                    instance = _a.sent();
                    createdModels = [];
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                    var originalCreate;
                                    return __generator(this, function (_a) {
                                        originalCreate = transactionAdapter.create.bind(transactionAdapter);
                                        vitest_1.vi.spyOn(transactionAdapter, "create").mockImplementation(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                createdModels.push(data.model);
                                                return [2 /*return*/, originalCreate(data)];
                                            });
                                        }); });
                                        return [2 /*return*/, callback(transactionAdapter)];
                                    });
                                }); })];
                        });
                    }); });
                    clientId = "https://client.example.com/custom-metadata.json";
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)({ context: instance.ctx }, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                redirect_uris: ["https://app.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: model,
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 3:
                    storedClient = _a.sent();
                    (0, vitest_1.expect)(storedClient).toMatchObject({ clientId: clientId });
                    (0, vitest_1.expect)(createdModels).toContain(model);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("atomically refreshes custom client and resource models without duplicating links", function () { return __awaiter(void 0, void 0, void 0, function () {
        var clientModel, clientResourceModel, resource, instance, clientId, endpointContext, created, operatorClient, refreshed, links;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    clientModel = "customCimdOAuthClient";
                    clientResourceModel = "customCimdOAuthClientResource";
                    resource = "https://api.example.com/cimd";
                    return [4 /*yield*/, boot({
                            resources: [resource],
                            clientRegistrationDefaultResources: [resource],
                            schema: {
                                oauthClient: { modelName: clientModel },
                                oauthClientResource: { modelName: clientResourceModel },
                            },
                        })];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/refresh.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "Before Refresh",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    created = _a.sent();
                    return [4 /*yield*/, instance.ctx.adapter.update({
                            model: clientModel,
                            where: [{ field: "clientId", value: clientId }],
                            update: {
                                disabled: true,
                                skipConsent: true,
                                enableEndSession: true,
                            },
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: clientModel,
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 4:
                    operatorClient = _a.sent();
                    if (!operatorClient)
                        throw new Error("created client was not persisted");
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            existingClient: __assign(__assign({}, created.client), operatorClient),
                            metadata: {
                                client_id: clientId,
                                client_name: "After Refresh",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 5:
                    refreshed = _a.sent();
                    (0, vitest_1.expect)(refreshed.created).toBe(false);
                    (0, vitest_1.expect)(refreshed.client).toMatchObject({
                        name: "After Refresh",
                        disabled: true,
                        skipConsent: true,
                        enableEndSession: true,
                    });
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: clientResourceModel,
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 6:
                    links = _a.sent();
                    (0, vitest_1.expect)(links.map(function (link) { return link.resourceId; })).toEqual([resource]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("converges a stale fixed-ID creator after a unique-constraint race", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, endpointContext, converged;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/concurrent.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "First Writer",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "Concurrent Writer",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 3:
                    converged = _a.sent();
                    (0, vitest_1.expect)(converged.created).toBe(false);
                    (0, vitest_1.expect)(converged.client.name).toBe("Concurrent Writer");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not take over a managed client after a fixed-ID registration race", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, collisionCause, originalTransaction, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _b.sent();
                    clientId = "https://client.example.com/managed-race.json";
                    return [4 /*yield*/, instance.ctx.adapter.create({
                            model: "oauthClient",
                            data: {
                                clientId: clientId,
                                clientDiscoveryId: null,
                                name: "Managed Client",
                                redirectUris: ["https://managed.example.com/callback"],
                                tokenEndpointAuthMethod: "none",
                                applicationType: "web",
                                grantTypes: ["authorization_code"],
                                responseTypes: ["code"],
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 2:
                    _b.sent();
                    collisionCause = Object.assign(new Error("unique constraint on managed client"), { code: "23505" });
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                    var originalCreate;
                                    return __generator(this, function (_a) {
                                        originalCreate = transactionAdapter.create.bind(transactionAdapter);
                                        vitest_1.vi.spyOn(transactionAdapter, "create").mockImplementation(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                if (input.model === "oauthClient")
                                                    throw collisionCause;
                                                return [2 /*return*/, originalCreate(input)];
                                            });
                                        }); });
                                        return [2 /*return*/, callback(transactionAdapter)];
                                    });
                                }); })];
                        });
                    }); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.registerClientMetadataDocument)({
                            context: instance.ctx,
                        }, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "Discovered Client",
                                redirect_uris: ["https://discovered.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })).rejects.toBe(collisionCause)];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({
                        clientDiscoveryId: null,
                        name: "Managed Client",
                        redirectUris: ["https://managed.example.com/callback"],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects a managed client supplied to the discovery refresh seam", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, managedClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/managed-refresh.json";
                    return [4 /*yield*/, instance.ctx.adapter.create({
                            model: "oauthClient",
                            data: {
                                clientId: clientId,
                                clientDiscoveryId: null,
                                name: "Managed Client",
                                redirectUris: ["https://managed.example.com/callback"],
                                tokenEndpointAuthMethod: "none",
                                applicationType: "web",
                                grantTypes: ["authorization_code"],
                                responseTypes: ["code"],
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 2:
                    managedClient = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.registerClientMetadataDocument)({
                            context: instance.ctx,
                        }, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            existingClient: managedClient,
                            metadata: {
                                client_id: clientId,
                                client_name: "Discovered Client",
                                redirect_uris: ["https://discovered.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })).rejects.toThrow()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not overwrite a managed replacement from a stale discovery refresh", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, endpointContext, discoveredClient, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _b.sent();
                    clientId = "https://client.example.com/stale-refresh.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "Discovered Client",
                                redirect_uris: ["https://discovered.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    discoveredClient = _b.sent();
                    return [4 /*yield*/, instance.ctx.adapter.delete({
                            model: "oauthClient",
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, instance.ctx.adapter.create({
                            model: "oauthClient",
                            data: {
                                clientId: clientId,
                                clientDiscoveryId: null,
                                name: "Managed Replacement",
                                redirectUris: ["https://managed.example.com/callback"],
                                tokenEndpointAuthMethod: "none",
                                applicationType: "web",
                                grantTypes: ["authorization_code"],
                                responseTypes: ["code"],
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            existingClient: discoveredClient.client,
                            metadata: {
                                client_id: clientId,
                                client_name: "Stale Refresh",
                                redirect_uris: ["https://stale.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })).rejects.toMatchObject({
                            body: {
                                error_description: "client no longer exists",
                            },
                        })];
                case 5:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 6:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({
                        clientDiscoveryId: null,
                        name: "Managed Replacement",
                        redirectUris: ["https://managed.example.com/callback"],
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("converges a metadata refresh only after the exact raced link is committed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resource, instance, clientId, endpointContext, created, originalTransaction, transactionAttempts, refreshed, links;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resource = "https://api.example.com/concurrent-link";
                    return [4 /*yield*/, boot({ resources: [resource] }, true)];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/concurrent-link.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "Before Link Race",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    created = _a.sent();
                    instance.opts.clientRegistrationDefaultResources = [resource];
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    transactionAttempts = 0;
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        var error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    transactionAttempts += 1;
                                    if (transactionAttempts > 1)
                                        return [2 /*return*/, originalTransaction(callback)];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 5]);
                                    return [4 /*yield*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                            var originalCreate;
                                            return __generator(this, function (_a) {
                                                originalCreate = transactionAdapter.create.bind(transactionAdapter);
                                                vitest_1.vi.spyOn(transactionAdapter, "create").mockImplementation(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        if (input.model === "oauthClientResource") {
                                                            throw Object.assign(new Error("unique constraint on client resource"), { code: "23505" });
                                                        }
                                                        return [2 /*return*/, originalCreate(input)];
                                                    });
                                                }); });
                                                return [2 /*return*/, callback(transactionAdapter)];
                                            });
                                        }); })];
                                case 2: return [2 /*return*/, _a.sent()];
                                case 3:
                                    error_1 = _a.sent();
                                    return [4 /*yield*/, instance.ctx.adapter.create({
                                            model: "oauthClientResource",
                                            data: {
                                                clientId: clientId,
                                                resourceId: resource,
                                                createdAt: new Date(),
                                            },
                                        })];
                                case 4:
                                    _a.sent();
                                    throw error_1;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            existingClient: created.client,
                            metadata: {
                                client_id: clientId,
                                client_name: "After Link Race",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 3:
                    refreshed = _a.sent();
                    (0, vitest_1.expect)(transactionAttempts).toBe(2);
                    (0, vitest_1.expect)(refreshed.created).toBe(false);
                    (0, vitest_1.expect)(refreshed.client.name).toBe("After Link Race");
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 4:
                    links = _a.sent();
                    (0, vitest_1.expect)(links.map(function (link) { return link.resourceId; })).toEqual([resource]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rethrows an unproven link-row unique cause without retrying", function () { return __awaiter(void 0, void 0, void 0, function () {
        var resource, instance, clientId, endpointContext, created, uniqueCause, originalTransaction, transactionAttempts, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resource = "https://api.example.com/unproven-link";
                    return [4 /*yield*/, boot({ resources: [resource] }, true)];
                case 1:
                    instance = _b.sent();
                    clientId = "https://client.example.com/unproven-link.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "Before Unproven Link",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    created = _b.sent();
                    instance.opts.clientRegistrationDefaultResources = [resource];
                    uniqueCause = Object.assign(new Error("unique constraint without committed link"), { code: "23505" });
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    transactionAttempts = 0;
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            transactionAttempts += 1;
                            return [2 /*return*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                    var originalCreate;
                                    return __generator(this, function (_a) {
                                        originalCreate = transactionAdapter.create.bind(transactionAdapter);
                                        vitest_1.vi.spyOn(transactionAdapter, "create").mockImplementation(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                if (input.model === "oauthClientResource") {
                                                    throw uniqueCause;
                                                }
                                                return [2 /*return*/, originalCreate(input)];
                                            });
                                        }); });
                                        return [2 /*return*/, callback(transactionAdapter)];
                                    });
                                }); })];
                        });
                    }); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            existingClient: created.client,
                            metadata: {
                                client_id: clientId,
                                client_name: "After Unproven Link",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })).rejects.toBe(uniqueCause)];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(transactionAttempts).toBe(1);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClientResource",
                            where: [
                                { field: "clientId", value: clientId },
                                { field: "resourceId", value: resource },
                            ],
                        })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves an unrelated unique error thrown by client update", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, endpointContext, created, uniqueCause, originalTransaction, transactionAttempts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/update-unique.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "Before Update Failure",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    created = _a.sent();
                    uniqueCause = Object.assign(new Error("unique constraint from unrelated update field"), { code: "23505" });
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    transactionAttempts = 0;
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            transactionAttempts += 1;
                            return [2 /*return*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        vitest_1.vi.spyOn(transactionAdapter, "update").mockRejectedValueOnce(uniqueCause);
                                        return [2 /*return*/, callback(transactionAdapter)];
                                    });
                                }); })];
                        });
                    }); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            existingClient: created.client,
                            metadata: {
                                client_id: clientId,
                                client_name: "After Update Failure",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })).rejects.toBe(uniqueCause)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(transactionAttempts).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("preserves an unrelated unique error thrown by the transaction", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, endpointContext, metadata, uniqueCause, originalTransaction, transactionAttempts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/transaction-unique.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    metadata = {
                        client_id: clientId,
                        client_name: "Transaction Failure",
                        redirect_uris: ["https://client.example.com/callback"],
                        token_endpoint_auth_method: "none",
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: metadata,
                        })];
                case 2:
                    _a.sent();
                    uniqueCause = {
                        kind: "oauth-client-row-unique",
                        cause: new Error("coincidental nested cause"),
                        code: "23505",
                        message: "unique constraint from transaction",
                    };
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    transactionAttempts = 0;
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            transactionAttempts += 1;
                            if (transactionAttempts === 1)
                                throw uniqueCause;
                            return [2 /*return*/, originalTransaction(callback)];
                        });
                    }); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: metadata,
                        })).rejects.toBe(uniqueCause)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(transactionAttempts).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does not mask a non-unique persistence failure when the fixed ID already exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, clientId, endpointContext, metadata, originalTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    clientId = "https://client.example.com/non-unique-failure.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    metadata = {
                        client_id: clientId,
                        client_name: "Existing Client",
                        redirect_uris: ["https://client.example.com/callback"],
                        token_endpoint_auth_method: "none",
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: metadata,
                        })];
                case 2:
                    _a.sent();
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        vitest_1.vi.spyOn(transactionAdapter, "create").mockRejectedValueOnce(new Error("storage unavailable"));
                                        return [2 /*return*/, callback(transactionAdapter)];
                                    });
                                }); })];
                        });
                    }); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: metadata,
                        })).rejects.toThrow("storage unavailable")];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rolls back a metadata replacement when a new default resource link fails", function () { return __awaiter(void 0, void 0, void 0, function () {
        var originalResource, addedResource, instance, clientId, endpointContext, created, originalTransaction, _a, links;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    originalResource = "https://api.example.com/original";
                    addedResource = "https://api.example.com/added";
                    return [4 /*yield*/, boot({
                            resources: [originalResource, addedResource],
                            clientRegistrationDefaultResources: [originalResource],
                        }, true)];
                case 1:
                    instance = _b.sent();
                    clientId = "https://client.example.com/atomic-refresh.json";
                    endpointContext = {
                        context: instance.ctx,
                    };
                    return [4 /*yield*/, (0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            metadata: {
                                client_id: clientId,
                                client_name: "Before Atomic Refresh",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })];
                case 2:
                    created = _b.sent();
                    instance.opts.clientRegistrationDefaultResources = [
                        originalResource,
                        addedResource,
                    ];
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                    var originalCreate;
                                    return __generator(this, function (_a) {
                                        originalCreate = transactionAdapter.create.bind(transactionAdapter);
                                        vitest_1.vi.spyOn(transactionAdapter, "create").mockImplementation(function (input) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                if (input.model === "oauthClientResource" &&
                                                    input.data.resourceId === addedResource) {
                                                    throw new Error("forced refresh-link failure");
                                                }
                                                return [2 /*return*/, originalCreate(input)];
                                            });
                                        }); });
                                        return [2 /*return*/, callback(transactionAdapter)];
                                    });
                                }); })];
                        });
                    }); });
                    return [4 /*yield*/, (0, vitest_1.expect)((0, register_1.registerClientMetadataDocument)(endpointContext, instance.opts, {
                            clientId: clientId,
                            clientDiscoveryId: "test-client-discovery",
                            existingClient: created.client,
                            metadata: {
                                client_id: clientId,
                                client_name: "After Atomic Refresh",
                                redirect_uris: ["https://client.example.com/callback"],
                                token_endpoint_auth_method: "none",
                            },
                        })).rejects.toThrow("forced refresh-link failure")];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: "oauthClient",
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ name: "Before Atomic Refresh" });
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 5:
                    links = _b.sent();
                    (0, vitest_1.expect)(links.map(function (link) { return link.resourceId; })).toEqual([originalResource]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("canonical dynamic client registration", function () {
    (0, vitest_1.it)("persists through the configured oauthClient model", function () { return __awaiter(void 0, void 0, void 0, function () {
        var model, instance, createdModels, originalTransaction, result, storedClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = "customDcrOAuthClient";
                    return [4 /*yield*/, boot({
                            allowDynamicClientRegistration: true,
                            allowUnauthenticatedClientRegistration: true,
                            schema: { oauthClient: { modelName: model } },
                        })];
                case 1:
                    instance = _a.sent();
                    createdModels = [];
                    originalTransaction = instance.ctx.adapter.transaction.bind(instance.ctx.adapter);
                    vitest_1.vi.spyOn(instance.ctx.adapter, "transaction").mockImplementation(function (callback) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, originalTransaction(function (transactionAdapter) { return __awaiter(void 0, void 0, void 0, function () {
                                    var originalCreate;
                                    return __generator(this, function (_a) {
                                        originalCreate = transactionAdapter.create.bind(transactionAdapter);
                                        vitest_1.vi.spyOn(transactionAdapter, "create").mockImplementation(function (data) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                createdModels.push(data.model);
                                                return [2 /*return*/, originalCreate(data)];
                                            });
                                        }); });
                                        return [2 /*return*/, callback(transactionAdapter)];
                                    });
                                }); })];
                        });
                    }); });
                    return [4 /*yield*/, instance.auth.api.registerOAuthClient({
                            body: {
                                redirect_uris: ["https://app.example.com/callback"],
                            },
                        })];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, instance.ctx.adapter.findOne({
                            model: model,
                            where: [{ field: "clientId", value: result.client_id }],
                        })];
                case 3:
                    storedClient = _a.sent();
                    (0, vitest_1.expect)(storedClient).toMatchObject({ clientId: result.client_id });
                    (0, vitest_1.expect)(createdModels).toContain(model);
                    return [2 /*return*/];
            }
        });
    }); });
});
