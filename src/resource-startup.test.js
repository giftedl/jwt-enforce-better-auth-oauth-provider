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
var memory_adapter_1 = require("@better-auth/memory-adapter");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var oauth_1 = require("./oauth");
var resource = "https://api.example.com/mcp";
var createDatabase = function () { return ({
    account: [],
    jwks: [],
    oauthAccessToken: [],
    oauthClient: [],
    oauthClientAssertion: [],
    oauthClientResource: [],
    oauthConsent: [],
    oauthRefreshToken: [],
    oauthResource: [],
    session: [],
    user: [],
    verification: [],
}); };
/**
 * Boots an instance whose `oauthResource` operations pass through `fault`
 * first, so a test can simulate the storage states a real deployment hits.
 * Pass `shared` to give several instances the same adapter object.
 */
function bootWithResourceFault(fault_1) {
    return __awaiter(this, arguments, void 0, function (fault, _a) {
        var database, log, createMemoryAdapter, createAdapter, firstResource, instance, register, errorLogs;
        var _this = this;
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.resources, resources = _d === void 0 ? [resource] : _d, resourceSeedMode = _c.resourceSeedMode, shared = _c.shared;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    database = (_b = shared === null || shared === void 0 ? void 0 : shared.database) !== null && _b !== void 0 ? _b : createDatabase();
                    log = vitest_1.vi.fn();
                    createMemoryAdapter = (0, memory_adapter_1.memoryAdapter)(database);
                    createAdapter = function (options) {
                        var adapter = createMemoryAdapter(options);
                        var intercept = function (operation) {
                            return function (args) { return __awaiter(_this, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (!(args.model === "oauthResource")) return [3 /*break*/, 2];
                                            return [4 /*yield*/, ((_a = fault.current) === null || _a === void 0 ? void 0 : _a.call(fault, operation, adapter))];
                                        case 1:
                                            _b.sent();
                                            _b.label = 2;
                                        case 2: return [2 /*return*/, adapter[operation](args)];
                                    }
                                });
                            }); };
                        };
                        return __assign(__assign({}, adapter), { findOne: intercept("findOne"), create: intercept("create") });
                    };
                    firstResource = resources[0];
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            logger: { level: "debug", log: log },
                            database: function (options) {
                                var _a;
                                if (!shared)
                                    return createAdapter(options);
                                (_a = shared.adapter) !== null && _a !== void 0 ? _a : (shared.adapter = createAdapter(options));
                                return shared.adapter;
                            },
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    allowDynamicClientRegistration: true,
                                    allowUnauthenticatedClientRegistration: true,
                                    resources: resources,
                                    resourceSeedMode: resourceSeedMode,
                                    clientRegistrationDefaultResources: [
                                        typeof firstResource === "string"
                                            ? firstResource
                                            : firstResource.identifier,
                                    ],
                                }),
                            ],
                        })];
                case 1:
                    instance = _e.sent();
                    register = function () {
                        return instance.auth.api.registerOAuthClient({
                            body: { redirect_uris: ["https://app.example.com/callback"] },
                        });
                    };
                    errorLogs = function () { return log.mock.calls.filter(function (_a) {
                        var level = _a[0];
                        return level === "error";
                    }); };
                    return [2 /*return*/, __assign(__assign({}, instance), { database: database, register: register, errorLogs: errorLogs })];
            }
        });
    });
}
/**
 * @see https://github.com/better-auth/better-auth/issues/11538
 */
(0, vitest_1.describe)("resource seeding at startup", function () {
    /**
     * @see https://github.com/better-auth/better-auth/issues/10887
     */
    (0, vitest_1.it)("keeps the instance usable when storage fails during startup and seeds once it recovers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fault, _a, auth, signInWithTestUser, register, database, errorLogs, headers;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fault = {
                        current: (function () {
                            throw new TypeError("fetch failed");
                        }),
                    };
                    return [4 /*yield*/, bootWithResourceFault(fault)];
                case 1:
                    _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, register = _a.register, database = _a.database, errorLogs = _a.errorLogs;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    return [4 /*yield*/, (0, vitest_1.expect)(auth.api.getSession({ headers: headers })).resolves.toMatchObject({
                            user: { email: "test@test.com" },
                        })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(errorLogs()).toEqual([
                        [
                            "error",
                            vitest_1.expect.stringContaining("could not seed `resources` at startup"),
                            vitest_1.expect.objectContaining({ message: "fetch failed" }),
                        ],
                    ]);
                    return [4 /*yield*/, (0, vitest_1.expect)(register()).rejects.toThrow("fetch failed")];
                case 4:
                    _b.sent();
                    fault.current = null;
                    return [4 /*yield*/, (0, vitest_1.expect)(register()).resolves.toMatchObject({
                            resources: [resource],
                        })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(database.oauthResource).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * @see https://github.com/better-auth/better-auth/issues/11034
     */
    (0, vitest_1.it)("treats a row inserted by a concurrent instance as already seeded", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fault, _a, register, database, errorLogs;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fault = {
                        current: (function (operation, adapter) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (operation !== "create")
                                            return [2 /*return*/];
                                        fault.current = null;
                                        // Another instance wins the insert; the driver error is wrapped the
                                        // way Drizzle wraps it, with the SQLSTATE only on `cause`.
                                        return [4 /*yield*/, adapter.create({
                                                model: "oauthResource",
                                                data: { identifier: resource, name: resource, disabled: false },
                                            })];
                                    case 1:
                                        // Another instance wins the insert; the driver error is wrapped the
                                        // way Drizzle wraps it, with the SQLSTATE only on `cause`.
                                        _a.sent();
                                        throw new Error('Failed query: insert into "oauth_resource" ...', {
                                            cause: Object.assign(new Error("duplicate key value"), {
                                                code: "23505",
                                            }),
                                        });
                                }
                            });
                        }); }),
                    };
                    return [4 /*yield*/, bootWithResourceFault(fault)];
                case 1:
                    _a = _b.sent(), register = _a.register, database = _a.database, errorLogs = _a.errorLogs;
                    (0, vitest_1.expect)(errorLogs()).toEqual([]);
                    (0, vitest_1.expect)(database.oauthResource).toHaveLength(1);
                    return [4 /*yield*/, (0, vitest_1.expect)(register()).resolves.toMatchObject({
                            resources: [resource],
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * @see https://github.com/better-auth/better-auth/issues/10315
     */
    (0, vitest_1.it)("a resource lookup does not wait on another request's pending seed", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fault, _a, register, database, _b, gate, release, first;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fault = {
                        current: (function () {
                            throw new TypeError("fetch failed");
                        }),
                    };
                    return [4 /*yield*/, bootWithResourceFault(fault)];
                case 1:
                    _a = _c.sent(), register = _a.register, database = _a.database;
                    _b = Promise.withResolvers(), gate = _b.promise, release = _b.resolve;
                    fault.current = function (operation) {
                        if (operation !== "findOne")
                            return;
                        fault.current = null;
                        return gate;
                    };
                    first = register();
                    // Start the second request only once the first one holds the gate.
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(fault.current).toBeNull(); })];
                case 2:
                    // Start the second request only once the first one holds the gate.
                    _c.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(register()).resolves.toMatchObject({
                            resources: [resource],
                        })];
                case 3:
                    _c.sent();
                    release();
                    return [4 /*yield*/, (0, vitest_1.expect)(first).resolves.toMatchObject({ resources: [resource] })];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(database.oauthResource).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("a seed that finishes after another does not undo a later edit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fault, _a, register, database, _b, gate, release, first;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fault = {
                        current: (function () {
                            throw new TypeError("fetch failed");
                        }),
                    };
                    return [4 /*yield*/, bootWithResourceFault(fault, {
                            resources: [{ identifier: resource, name: "From config" }],
                            resourceSeedMode: "merge",
                        })];
                case 1:
                    _a = _c.sent(), register = _a.register, database = _a.database;
                    _b = Promise.withResolvers(), gate = _b.promise, release = _b.resolve;
                    fault.current = function (operation) {
                        if (operation !== "findOne")
                            return;
                        fault.current = null;
                        return gate;
                    };
                    first = register();
                    // Start the second request only once the first one holds the gate.
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(fault.current).toBeNull(); })];
                case 2:
                    // Start the second request only once the first one holds the gate.
                    _c.sent();
                    return [4 /*yield*/, register()];
                case 3:
                    _c.sent();
                    database.oauthResource[0].name = "Edited by admin";
                    release();
                    return [4 /*yield*/, first];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(database.oauthResource).toMatchObject([{ name: "Edited by admin" }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("applies merge mode to a row a concurrent instance inserted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fault, database;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fault = {
                        current: (function (operation, adapter) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (operation !== "create")
                                            return [2 /*return*/];
                                        fault.current = null;
                                        return [4 /*yield*/, adapter.create({
                                                model: "oauthResource",
                                                data: { identifier: resource, name: resource, disabled: false },
                                            })];
                                    case 1:
                                        _a.sent();
                                        throw new Error("duplicate key value");
                                }
                            });
                        }); }),
                    };
                    return [4 /*yield*/, bootWithResourceFault(fault, {
                            resources: [{ identifier: resource, accessTokenTtl: 300 }],
                            resourceSeedMode: "merge",
                        })];
                case 1:
                    database = (_a.sent()).database;
                    (0, vitest_1.expect)(database.oauthResource).toEqual([
                        vitest_1.expect.objectContaining({ identifier: resource, accessTokenTtl: 300 }),
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("reports the insert error when the row cannot be re-read", function () { return __awaiter(void 0, void 0, void 0, function () {
        var creates, fault, errorLogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    creates = 0;
                    fault = {
                        current: (function (operation) {
                            if (operation === "create") {
                                creates++;
                                throw new Error("value too long for column");
                            }
                            if (creates > 0)
                                throw new Error("connection lost");
                        }),
                    };
                    return [4 /*yield*/, bootWithResourceFault(fault)];
                case 1:
                    errorLogs = (_a.sent()).errorLogs;
                    (0, vitest_1.expect)(errorLogs()).toEqual([
                        [
                            "error",
                            vitest_1.expect.any(String),
                            vitest_1.expect.objectContaining({ message: "value too long for column" }),
                        ],
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("seeds each instance's resources when instances share an adapter", function () { return __awaiter(void 0, void 0, void 0, function () {
        var shared, fault, _i, _a, model;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    shared = { database: createDatabase() };
                    fault = { current: null };
                    return [4 /*yield*/, bootWithResourceFault(fault, {
                            resources: ["https://api.example.com/first"],
                            shared: shared,
                        })];
                case 1:
                    _b.sent();
                    // The test harness signs up the same user on every boot.
                    for (_i = 0, _a = ["user", "account", "session"]; _i < _a.length; _i++) {
                        model = _a[_i];
                        shared.database[model].length = 0;
                    }
                    return [4 /*yield*/, bootWithResourceFault(fault, {
                            resources: ["https://api.example.com/second"],
                            shared: shared,
                        })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(shared.database.oauthResource.map(function (row) { return row.identifier; }).sort()).toEqual([
                        "https://api.example.com/first",
                        "https://api.example.com/second",
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * @see https://github.com/better-auth/better-auth/issues/11294
     */
    vitest_1.it.each([
        [
            "Drizzle missing model",
            new Error('[# Drizzle Adapter]: The model "oauthResource" was not found in the schema object. Please pass the schema directly to the adapter options.'),
        ],
        [
            "Drizzle-wrapped missing relation",
            new Error('Failed query: select "id" from "oauth_resource" ...', {
                cause: new Error('relation "oauth_resource" does not exist'),
            }),
        ],
        [
            "Prisma missing model",
            new Error("Model oauthResource does not exist in the database. If you haven't generated the Prisma client, you need to run 'npx prisma generate'"),
        ],
    ])("defers quietly on a %s error and seeds once the table exists", function (_, error) { return __awaiter(void 0, void 0, void 0, function () {
        var fault, _a, register, database, errorLogs;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fault = {
                        current: (function () {
                            throw error;
                        }),
                    };
                    return [4 /*yield*/, bootWithResourceFault(fault)];
                case 1:
                    _a = _b.sent(), register = _a.register, database = _a.database, errorLogs = _a.errorLogs;
                    (0, vitest_1.expect)(errorLogs()).toEqual([]);
                    return [4 /*yield*/, (0, vitest_1.expect)(register()).rejects.toThrow(error.message)];
                case 2:
                    _b.sent();
                    fault.current = null;
                    return [4 /*yield*/, (0, vitest_1.expect)(register()).resolves.toMatchObject({
                            resources: [resource],
                        })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(database.oauthResource).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
