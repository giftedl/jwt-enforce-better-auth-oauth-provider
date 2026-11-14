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
var oauth_1 = require("../oauth");
var resources_1 = require("../resources");
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
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (options) {
        var opts, instance, ctx;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = __assign({ loginPage: "/login", consentPage: "/consent" }, options);
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            plugins: [(0, jwt_1.jwt)(), (0, oauth_1.oauthProvider)(opts)],
                        })];
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
var signedInHeaders = function (instance) { return __awaiter(void 0, void 0, void 0, function () {
    var headers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, instance.signInWithTestUser()];
            case 1:
                headers = (_a.sent()).headers;
                return [2 /*return*/, headers];
        }
    });
}); };
(0, vitest_1.describe)("resource admin CRUD", function () {
    (0, vitest_1.it)("create + read round-trips", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, created, fetched;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: {
                                identifier: "https://api.example.com/created",
                                name: "Created Resource",
                                accessTokenTtl: 300,
                            },
                            headers: headers,
                        })];
                case 3:
                    created = _a.sent();
                    (0, vitest_1.expect)(created.identifier).toBe("https://api.example.com/created");
                    return [4 /*yield*/, instance.auth.api.adminGetOAuthResource({
                            params: { identifier: "https://api.example.com/created" },
                            headers: headers,
                        })];
                case 4:
                    fetched = _a.sent();
                    (0, vitest_1.expect)(fetched.name).toBe("Created Resource");
                    (0, vitest_1.expect)(fetched.accessTokenTtl).toBe(300);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects identifiers that aren't absolute URIs", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "not-a-uri" },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects identifiers with a fragment", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/x#fragment" },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        "https://api.example.com/x#",
        "javascript:alert(1)",
        "data:text/plain,hello",
        "vbscript:msgbox(1)",
    ])("rejects a resource identifier disallowed by the shared URI schema: %s", function (identifier) { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: identifier },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects duplicate identifiers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/dup" },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/dup" },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_request" }),
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("update only touches specified fields", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, updated, fetched;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: {
                                identifier: "https://api.example.com/update-me",
                                name: "Original",
                                accessTokenTtl: 600,
                                allowedScopes: ["read"],
                            },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminUpdateOAuthResource({
                            params: { identifier: "https://api.example.com/update-me" },
                            body: { accessTokenTtl: 60 },
                            headers: headers,
                        })];
                case 4:
                    updated = (_a.sent());
                    (0, vitest_1.expect)(updated).not.toBeNull();
                    (0, vitest_1.expect)(updated.accessTokenTtl).toBe(60);
                    return [4 /*yield*/, instance.auth.api.adminGetOAuthResource({
                            params: { identifier: "https://api.example.com/update-me" },
                            headers: headers,
                        })];
                case 5:
                    fetched = (_a.sent());
                    (0, vitest_1.expect)(fetched.accessTokenTtl).toBe(60);
                    (0, vitest_1.expect)(fetched.name).toBe("Original"); // untouched
                    (0, vitest_1.expect)(fetched.allowedScopes).toEqual(["read"]); // untouched
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("update on a missing identifier returns 404", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminUpdateOAuthResource({
                            params: { identifier: "https://api.example.com/missing" },
                            body: { accessTokenTtl: 120 },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "not_found" }),
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("delete removes the row and 404s on subsequent reads", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/delete-me" },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminDeleteOAuthResource({
                            params: { identifier: "https://api.example.com/delete-me" },
                            headers: headers,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminGetOAuthResource({
                            params: { identifier: "https://api.example.com/delete-me" },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "not_found" }),
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("list returns all resources", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, list, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/a" },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/b" },
                            headers: headers,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminListOAuthResources({
                            headers: headers,
                        })];
                case 5:
                    list = (_a.sent());
                    ids = list.map(function (a) { return a.identifier; }).sort();
                    (0, vitest_1.expect)(ids).toContain("https://api.example.com/a");
                    (0, vitest_1.expect)(ids).toContain("https://api.example.com/b");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resourcePrivileges gate", function () {
    (0, vitest_1.it)("blocks create when resourcePrivileges returns false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot({
                        resourcePrivileges: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var action = _b.action;
                            return __generator(this, function (_c) {
                                return [2 /*return*/, action !== "create"];
                            });
                        }); },
                    })];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/gated" },
                            headers: headers,
                        })).rejects.toMatchObject({ status: "UNAUTHORIZED" })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("allows actions the callback approves", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot({
                        resourcePrivileges: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var action = _b.action;
                            return __generator(this, function (_c) {
                                return [2 /*return*/, action === "create" || action === "read"];
                            });
                        }); },
                    })];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/approved" },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminGetOAuthResource({
                            params: { identifier: "https://api.example.com/approved" },
                            headers: headers,
                        })).resolves.toBeDefined()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("blocks list independently of read", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot({
                        resourcePrivileges: function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                            var action = _b.action;
                            return __generator(this, function (_c) {
                                return [2 /*return*/, action !== "list"];
                            });
                        }); },
                    })];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminListOAuthResources({ headers: headers })).rejects.toMatchObject({ status: "UNAUTHORIZED" })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("client/resource linking", function () {
    var seedClient = function (instance, clientId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, instance.ctx.adapter.create({
                        model: (_c = (_b = (_a = instance.opts.schema) === null || _a === void 0 ? void 0 : _a.oauthClient) === null || _b === void 0 ? void 0 : _b.modelName) !== null && _c !== void 0 ? _c : "oauthClient",
                        data: {
                            clientId: clientId,
                            redirectUris: ["https://example.com/callback"],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    })];
                case 1:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    (0, vitest_1.it)("link creates the join row and unlink removes it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, links, afterUnlink;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _c.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _c.sent();
                    return [4 /*yield*/, seedClient(instance, "test-client")];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/linked" },
                            headers: headers,
                        })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, instance.auth.api.adminLinkClientResource({
                            params: {
                                identifier: "https://api.example.com/linked",
                                client_id: "test-client",
                            },
                            headers: headers,
                        })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: "test-client" }],
                        })];
                case 6:
                    links = _c.sent();
                    (0, vitest_1.expect)(links === null || links === void 0 ? void 0 : links.length).toBe(1);
                    (0, vitest_1.expect)((_a = links === null || links === void 0 ? void 0 : links[0]) === null || _a === void 0 ? void 0 : _a.resourceId).toBe("https://api.example.com/linked");
                    return [4 /*yield*/, instance.auth.api.adminUnlinkClientResource({
                            params: {
                                identifier: "https://api.example.com/linked",
                                client_id: "test-client",
                            },
                            headers: headers,
                        })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: "test-client" }],
                        })];
                case 8:
                    afterUnlink = _c.sent();
                    (0, vitest_1.expect)((_b = afterUnlink === null || afterUnlink === void 0 ? void 0 : afterUnlink.length) !== null && _b !== void 0 ? _b : 0).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("link is idempotent on repeat calls", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, second;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, seedClient(instance, "idempotent-client")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/idempotent" },
                            headers: headers,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminLinkClientResource({
                            params: {
                                identifier: "https://api.example.com/idempotent",
                                client_id: "idempotent-client",
                            },
                            headers: headers,
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminLinkClientResource({
                            params: {
                                identifier: "https://api.example.com/idempotent",
                                client_id: "idempotent-client",
                            },
                            headers: headers,
                        })];
                case 6:
                    second = _a.sent();
                    (0, vitest_1.expect)(second.alreadyLinked).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("link rejects an unknown resource", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, seedClient(instance, "client-x")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminLinkClientResource({
                            params: {
                                identifier: "https://api.example.com/nope",
                                client_id: "client-x",
                            },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "not_found" }),
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("link rejects an unknown client", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/orphan" },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminLinkClientResource({
                            params: {
                                identifier: "https://api.example.com/orphan",
                                client_id: "no-such-client",
                            },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "not_found" }),
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Compound uniqueness on (clientId, resourceId) makes concurrent link
    // attempts for the same pair produce exactly one row.
    (0, vitest_1.it)("concurrent link attempts for the same pair produce exactly one row", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, results, links;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _b.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _b.sent();
                    return [4 /*yield*/, seedClient(instance, "race-client")];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/race" },
                            headers: headers,
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, Promise.all(Array.from({ length: 5 }).map(function () {
                            return instance.auth.api.adminLinkClientResource({
                                params: {
                                    identifier: "https://api.example.com/race",
                                    client_id: "race-client",
                                },
                                headers: headers,
                            });
                        }))];
                case 5:
                    results = _b.sent();
                    // At least one should have succeeded as "first" link, and all calls
                    // must have returned a non-error response.
                    (0, vitest_1.expect)(results.length).toBe(5);
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: "race-client" }],
                        })];
                case 6:
                    links = _b.sent();
                    (0, vitest_1.expect)(links === null || links === void 0 ? void 0 : links.length).toBe(1);
                    (0, vitest_1.expect)((_a = links === null || links === void 0 ? void 0 : links[0]) === null || _a === void 0 ? void 0 : _a.resourceId).toBe("https://api.example.com/race");
                    return [2 /*return*/];
            }
        });
    }); });
    // The link endpoint's client lookup must resolve through the configured
    // `schema.oauthClient.modelName` (like the shared `getClient` helper and the
    // resource/link model helpers) rather than assuming a fixed model name, so a
    // deployment that remaps the client model can still link resources.
    (0, vitest_1.it)("link resolves the client through a custom oauthClient model name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, links;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, boot({
                        schema: { oauthClient: { modelName: "customOauthClient" } },
                    })];
                case 1:
                    instance = _b.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _b.sent();
                    return [4 /*yield*/, seedClient(instance, "remapped-client")];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/remapped" },
                            headers: headers,
                        })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, instance.auth.api.adminLinkClientResource({
                            params: {
                                identifier: "https://api.example.com/remapped",
                                client_id: "remapped-client",
                            },
                            headers: headers,
                        })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, instance.ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "clientId", value: "remapped-client" }],
                        })];
                case 6:
                    links = _b.sent();
                    (0, vitest_1.expect)(links === null || links === void 0 ? void 0 : links.length).toBe(1);
                    (0, vitest_1.expect)((_a = links === null || links === void 0 ? void 0 : links[0]) === null || _a === void 0 ? void 0 : _a.resourceId).toBe("https://api.example.com/remapped");
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resource admin CRUD — signingAlgorithm validation (bug #10)", function () {
    (0, vitest_1.it)("rejects bad signingAlgorithm at create time, not at sign time", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthResource({
                            body: {
                                identifier: "https://api.example.com/bad-alg",
                                // HS256 is symmetric and not a supported JWS asymmetric alg
                                // for the JWT plugin — must be rejected at admin-CRUD time
                                // before the row is persisted.
                                signingAlgorithm: "HS256",
                            },
                            headers: headers,
                        })).rejects.toBeDefined()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects unknown signingAlgorithm at create time", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthResource({
                            body: {
                                identifier: "https://api.example.com/bogus-alg",
                                signingAlgorithm: "not-an-alg",
                            },
                            headers: headers,
                        })).rejects.toBeDefined()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts every supported JWS asymmetric algorithm", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, algs, _i, algs_1, alg, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    algs = ["EdDSA", "ES256", "ES512", "PS256", "RS256"];
                    _i = 0, algs_1 = algs;
                    _a.label = 3;
                case 3:
                    if (!(_i < algs_1.length)) return [3 /*break*/, 6];
                    alg = algs_1[_i];
                    id = "https://api.example.com/alg-".concat(alg.toLowerCase());
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: id, signingAlgorithm: alg },
                            headers: headers,
                        })).resolves.toBeDefined()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects bad signingAlgorithm at update time too", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: "https://api.example.com/upd-alg" },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminUpdateOAuthResource({
                            params: { identifier: "https://api.example.com/upd-alg" },
                            body: { signingAlgorithm: "HS256" },
                            headers: headers,
                        })).rejects.toBeDefined()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("path-param decoding for URI-valued identifiers", function () {
    // better-call 1.3.5 does NOT decode URL path params (tryDecode is only
    // wired into cookie parsing). Even though the admin endpoints are
    // SERVER_ONLY today, callers that wrap them (for example a hand-rolled
    // HTTP exposure that forwards raw URL segments, or a UI router that
    // pre-encodes) should not lose rows just because the identifier traveled
    // through a percent-encoded path. We drive auth.api.* with explicitly
    // encoded params to exercise the handler-side decode without depending
    // on the HTTP router.
    var raw = "https://api.example.com/path-decode";
    (0, vitest_1.it)("read endpoint decodes a percent-encoded URI identifier", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, fetched;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: raw, name: "Path Decode" },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminGetOAuthResource({
                            params: { identifier: encodeURIComponent(raw) },
                            headers: headers,
                        })];
                case 4:
                    fetched = (_a.sent());
                    (0, vitest_1.expect)(fetched.identifier).toBe(raw);
                    (0, vitest_1.expect)(fetched.name).toBe("Path Decode");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("update endpoint decodes a percent-encoded URI identifier", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, fetched;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: raw, accessTokenTtl: 600 },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminUpdateOAuthResource({
                            params: { identifier: encodeURIComponent(raw) },
                            body: { accessTokenTtl: 90 },
                            headers: headers,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminGetOAuthResource({
                            params: { identifier: raw },
                            headers: headers,
                        })];
                case 5:
                    fetched = (_a.sent());
                    (0, vitest_1.expect)(fetched.accessTokenTtl).toBe(90);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("delete endpoint decodes a percent-encoded URI identifier", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: raw },
                            headers: headers,
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, instance.auth.api.adminDeleteOAuthResource({
                            params: { identifier: encodeURIComponent(raw) },
                            headers: headers,
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminGetOAuthResource({
                            params: { identifier: raw },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "not_found" }),
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("link / unlink endpoints decode both percent-encoded path segments", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers, client, ctx, after, afterUnlink;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _b.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _b.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthResource({
                            body: { identifier: raw },
                            headers: headers,
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, instance.auth.api.adminCreateOAuthClient({
                            body: { redirect_uris: ["https://app.example.com/cb"] },
                            headers: headers,
                        })];
                case 4:
                    client = (_b.sent());
                    return [4 /*yield*/, instance.auth.api.adminLinkClientResource({
                            params: {
                                identifier: encodeURIComponent(raw),
                                client_id: encodeURIComponent(client.client_id),
                            },
                            headers: headers,
                        })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, instance.auth.$context];
                case 6:
                    ctx = _b.sent();
                    return [4 /*yield*/, ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "resourceId", value: raw }],
                        })];
                case 7:
                    after = _b.sent();
                    (0, vitest_1.expect)(after.length).toBe(1);
                    (0, vitest_1.expect)((_a = after[0]) === null || _a === void 0 ? void 0 : _a.clientId).toBe(client.client_id);
                    return [4 /*yield*/, instance.auth.api.adminUnlinkClientResource({
                            params: {
                                identifier: encodeURIComponent(raw),
                                client_id: encodeURIComponent(client.client_id),
                            },
                            headers: headers,
                        })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, ctx.adapter.findMany({
                            model: "oauthClientResource",
                            where: [{ field: "resourceId", value: raw }],
                        })];
                case 9:
                    afterUnlink = _b.sent();
                    (0, vitest_1.expect)(afterUnlink.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("falls back to raw identifier when decodeURIComponent throws (malformed escape)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var instance, headers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, boot()];
                case 1:
                    instance = _a.sent();
                    return [4 /*yield*/, signedInHeaders(instance)];
                case 2:
                    headers = _a.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)(instance.auth.api.adminGetOAuthResource({
                            params: { identifier: "%ZZ-not-valid" },
                            headers: headers,
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "not_found" }),
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
