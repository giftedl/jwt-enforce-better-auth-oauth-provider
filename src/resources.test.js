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
var resources_1 = require("./resources");
(0, vitest_1.describe)("collectResourceInputs", function () {
    var warnSpy;
    (0, vitest_1.beforeEach)(function () {
        warnSpy = vitest_1.vi.spyOn(env_1.logger, "warn").mockImplementation(function () { return undefined; });
    });
    (0, vitest_1.afterEach)(function () {
        warnSpy.mockRestore();
    });
    (0, vitest_1.it)("does not warn when resources is used", function () {
        (0, resources_1.collectResourceInputs)({ resources: ["https://api.example.com"] });
        (0, vitest_1.expect)(warnSpy).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("converts string entries in resources to identifier-only inputs", function () {
        var inputs = (0, resources_1.collectResourceInputs)({
            resources: ["https://a", { identifier: "https://b", accessTokenTtl: 60 }],
        });
        (0, vitest_1.expect)(inputs).toEqual([
            { identifier: "https://a" },
            { identifier: "https://b", accessTokenTtl: 60 },
        ]);
    });
    (0, vitest_1.it)("preserves configured resource order", function () {
        var inputs = (0, resources_1.collectResourceInputs)({
            resources: [
                "https://first",
                { identifier: "https://second", accessTokenTtl: 300 },
            ],
        });
        (0, vitest_1.expect)(inputs).toEqual([
            { identifier: "https://first" },
            { identifier: "https://second", accessTokenTtl: 300 },
        ]);
    });
    (0, vitest_1.it)("returns empty array when no resource config is provided", function () {
        (0, vitest_1.expect)((0, resources_1.collectResourceInputs)({})).toEqual([]);
    });
});
var bootWithResourcesOption = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (options) {
        var resolvedOpts, instance, ctx;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resolvedOpts = __assign({ loginPage: "/login", consentPage: "/consent" }, options);
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            plugins: [(0, jwt_1.jwt)(), (0, oauth_1.oauthProvider)(resolvedOpts)],
                        })];
                case 1:
                    instance = _a.sent();
                    (0, resources_1.resetSeedStateForTests)();
                    return [4 /*yield*/, instance.auth.$context];
                case 2:
                    ctx = _a.sent();
                    return [4 /*yield*/, (0, resources_1.seedResourcesOnce)(ctx, resolvedOpts)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign({}, instance), { opts: resolvedOpts })];
            }
        });
    });
};
var readResource = function (auth, identifier) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, auth.$context.then(function (ctx) {
                return ctx.adapter.findOne({
                    model: "oauthResource",
                    where: [{ field: "identifier", value: identifier }],
                });
            })];
    });
}); };
(0, vitest_1.describe)("seedResources (integration via plugin init)", function () {
    var warnSpy;
    var infoSpy;
    (0, vitest_1.beforeEach)(function () {
        warnSpy = vitest_1.vi.spyOn(env_1.logger, "warn").mockImplementation(function () { return undefined; });
        infoSpy = vitest_1.vi.spyOn(env_1.logger, "info").mockImplementation(function () { return undefined; });
    });
    (0, vitest_1.afterEach)(function () {
        warnSpy.mockRestore();
        infoSpy.mockRestore();
    });
    (0, vitest_1.it)("seeds nothing when no resource config is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bootWithResourcesOption({})];
                case 1:
                    auth = (_a.sent()).auth;
                    return [4 /*yield*/, readResource(auth, "https://nope.example.com")];
                case 2:
                    row = _a.sent();
                    (0, vitest_1.expect)(row).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("seeds string-form `resources` entries with plugin defaults", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bootWithResourcesOption({
                        resources: ["https://api.example.com"],
                    })];
                case 1:
                    auth = (_a.sent()).auth;
                    return [4 /*yield*/, readResource(auth, "https://api.example.com")];
                case 2:
                    row = _a.sent();
                    (0, vitest_1.expect)(row).toMatchObject({
                        identifier: "https://api.example.com",
                        name: "https://api.example.com",
                        disabled: false,
                        policyVersion: 1,
                        accessTokenTtl: null,
                        signingAlgorithm: null,
                        allowedScopes: null,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("seeds object-form `resources` entries with explicit policy", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bootWithResourcesOption({
                        resources: [
                            {
                                identifier: "https://api.example.com/admin",
                                name: "Admin API",
                                accessTokenTtl: 300,
                                allowedScopes: ["admin:read", "admin:write"],
                                signingAlgorithm: "EdDSA",
                            },
                        ],
                    })];
                case 1:
                    auth = (_a.sent()).auth;
                    return [4 /*yield*/, readResource(auth, "https://api.example.com/admin")];
                case 2:
                    row = _a.sent();
                    (0, vitest_1.expect)(row).toMatchObject({
                        identifier: "https://api.example.com/admin",
                        name: "Admin API",
                        accessTokenTtl: 300,
                        allowedScopes: ["admin:read", "admin:write"],
                        signingAlgorithm: "EdDSA",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("logs the enforcePerClientResources resolution at init", function () { return __awaiter(void 0, void 0, void 0, function () {
        var allCalls;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bootWithResourcesOption({
                        resources: ["https://api.example.com"],
                    })];
                case 1:
                    _a.sent();
                    allCalls = infoSpy.mock.calls
                        .map(function (call) { var _a; return String((_a = call[0]) !== null && _a !== void 0 ? _a : ""); })
                        .join("\n");
                    (0, vitest_1.expect)(allCalls).toMatch(/enforcePerClientResources resolved to true/);
                    (0, vitest_1.expect)(allCalls).toMatch(/default/);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("insertOnly (default) preserves existing rows when re-seeded", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, first, firstCtx, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = "https://api.example.com/insert-only";
                    return [4 /*yield*/, bootWithResourcesOption({
                            resources: [{ identifier: identifier, name: "Original" }],
                        })];
                case 1:
                    first = _a.sent();
                    return [4 /*yield*/, first.auth.$context];
                case 2:
                    firstCtx = _a.sent();
                    return [4 /*yield*/, firstCtx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: identifier }],
                            update: { name: "Admin edited" },
                        })];
                case 3:
                    _a.sent();
                    // Simulate a reboot by re-running seedResources against the same context
                    // with a renamed value — insertOnly should leave the admin edit intact.
                    return [4 /*yield*/, (0, resources_1.seedResources)(firstCtx, {
                            loginPage: "/login",
                            consentPage: "/consent",
                            resources: [{ identifier: identifier, name: "Config rename attempt" }],
                        })];
                case 4:
                    // Simulate a reboot by re-running seedResources against the same context
                    // with a renamed value — insertOnly should leave the admin edit intact.
                    _a.sent();
                    return [4 /*yield*/, readResource(first.auth, identifier)];
                case 5:
                    row = _a.sent();
                    (0, vitest_1.expect)(row === null || row === void 0 ? void 0 : row.name).toBe("Admin edited");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("merge mode updates only specified fields on existing rows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, first, firstCtx, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = "https://api.example.com/merge";
                    return [4 /*yield*/, bootWithResourcesOption({
                            resources: [
                                {
                                    identifier: identifier,
                                    name: "Original",
                                    accessTokenTtl: 600,
                                    allowedScopes: ["a", "b"],
                                },
                            ],
                        })];
                case 1:
                    first = _a.sent();
                    return [4 /*yield*/, first.auth.$context];
                case 2:
                    firstCtx = _a.sent();
                    return [4 /*yield*/, (0, resources_1.seedResources)(firstCtx, {
                            loginPage: "/login",
                            consentPage: "/consent",
                            resources: [{ identifier: identifier, accessTokenTtl: 120 }],
                            resourceSeedMode: "merge",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, readResource(first.auth, identifier)];
                case 4:
                    row = _a.sent();
                    (0, vitest_1.expect)(row).toMatchObject({
                        name: "Original", // untouched
                        accessTokenTtl: 120, // updated
                        allowedScopes: ["a", "b"], // untouched
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("overwrite mode replaces every field on existing rows", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, first, firstCtx, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = "https://api.example.com/overwrite";
                    return [4 /*yield*/, bootWithResourcesOption({
                            resources: [
                                {
                                    identifier: identifier,
                                    name: "Original",
                                    accessTokenTtl: 600,
                                    allowedScopes: ["a", "b"],
                                },
                            ],
                        })];
                case 1:
                    first = _a.sent();
                    return [4 /*yield*/, first.auth.$context];
                case 2:
                    firstCtx = _a.sent();
                    return [4 /*yield*/, (0, resources_1.seedResources)(firstCtx, {
                            loginPage: "/login",
                            consentPage: "/consent",
                            resources: [{ identifier: identifier, accessTokenTtl: 120 }],
                            resourceSeedMode: "overwrite",
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, readResource(first.auth, identifier)];
                case 4:
                    row = _a.sent();
                    (0, vitest_1.expect)(row).toMatchObject({
                        name: identifier, // overwrite uses identifier as default name
                        accessTokenTtl: 120,
                        allowedScopes: null, // cleared
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("getResource + cache", function () {
    (0, vitest_1.afterEach)(function () {
        (0, resources_1.invalidateResourceCache)();
    });
    (0, vitest_1.it)("returns the row from the DB when cache is not opt-in", function () { return __awaiter(void 0, void 0, void 0, function () {
        var auth, ctx, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bootWithResourcesOption({
                        resources: ["https://api.example.com/uncached"],
                    })];
                case 1:
                    auth = (_a.sent()).auth;
                    return [4 /*yield*/, auth.$context];
                case 2:
                    ctx = _a.sent();
                    return [4 /*yield*/, (0, resources_1.getResource)({ context: ctx }, { resources: ["https://api.example.com/uncached"] }, "https://api.example.com/uncached")];
                case 3:
                    row = _a.sent();
                    (0, vitest_1.expect)(row === null || row === void 0 ? void 0 : row.identifier).toBe("https://api.example.com/uncached");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("caches when identifier is in cachedResources", function () { return __awaiter(void 0, void 0, void 0, function () {
        var identifier, cachedResources, auth, ctx, opts, first, second, third;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = "https://api.example.com/cached";
                    cachedResources = new Set([identifier]);
                    return [4 /*yield*/, bootWithResourcesOption({
                            resources: [identifier],
                            cachedResources: cachedResources,
                        })];
                case 1:
                    auth = (_a.sent()).auth;
                    return [4 /*yield*/, auth.$context];
                case 2:
                    ctx = _a.sent();
                    opts = { resources: [identifier], cachedResources: cachedResources };
                    return [4 /*yield*/, (0, resources_1.getResource)({ context: ctx }, opts, identifier)];
                case 3:
                    first = _a.sent();
                    (0, vitest_1.expect)(first === null || first === void 0 ? void 0 : first.identifier).toBe(identifier);
                    // Mutate the row directly in the DB.
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: identifier }],
                            update: { name: "Mutated externally" },
                        })];
                case 4:
                    // Mutate the row directly in the DB.
                    _a.sent();
                    return [4 /*yield*/, (0, resources_1.getResource)({ context: ctx }, opts, identifier)];
                case 5:
                    second = _a.sent();
                    (0, vitest_1.expect)(second === null || second === void 0 ? void 0 : second.name).toBe(identifier); // pre-mutation value
                    // After invalidation the next lookup hits the DB.
                    (0, resources_1.invalidateResourceCache)(identifier);
                    return [4 /*yield*/, (0, resources_1.getResource)({ context: ctx }, opts, identifier)];
                case 6:
                    third = _a.sent();
                    (0, vitest_1.expect)(third === null || third === void 0 ? void 0 : third.name).toBe("Mutated externally");
                    return [2 /*return*/];
            }
        });
    }); });
});
