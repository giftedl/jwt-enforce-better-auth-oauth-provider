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
var bootProvider = function () {
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
                    opts = __assign({ loginPage: "/login", consentPage: "/consent", enforcePerClientResources: false }, options);
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
var fakeEndpointCtx = function (authCtx) {
    return ({
        context: authCtx,
        body: {},
    });
};
(0, vitest_1.describe)("resolveResourcePolicy — resource omission", function () {
    (0, vitest_1.it)("returns no aud claim when neither resource nor openid scope is present", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider()];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: undefined,
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toBeUndefined();
                    (0, vitest_1.expect)(policy.accessTokenTtl).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("does NOT add the implicit /oauth2/userinfo aud when no resource is requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider()];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: undefined,
                            clientId: "client-x",
                            requestedScopes: ["openid", "profile"],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("adds the implicit /oauth2/userinfo aud alongside a requested resource when openid is in scope", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy, expected;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/openid-with-resource";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-x",
                            requestedScopes: ["openid", "profile"],
                        })];
                case 2:
                    policy = _b.sent();
                    expected = [id, "".concat(ctx.baseURL, "/oauth2/userinfo")];
                    (0, vitest_1.expect)(policy.audienceClaim).toStrictEqual(expected);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("dedupes the implicit /oauth2/userinfo aud when it was explicitly requested", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, userInfoResource, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/openid-with-explicit-userinfo";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    userInfoResource = "".concat(ctx.baseURL, "/oauth2/userinfo");
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [id, userInfoResource],
                            clientId: "client-x",
                            requestedScopes: ["openid", "profile"],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toStrictEqual([id, userInfoResource]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects baseURL when it is not configured as a resource", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider()];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: ctx.baseURL,
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects unknown resources when no resource config is set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider()];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: "https://api.example.com/unknown",
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveResourcePolicy — entity path", function () {
    (0, vitest_1.it)("rejects unknown resource identifiers", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider({
                        resources: ["https://api.example.com"],
                    })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: "https://api.example.com/not-configured",
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects disabled resources", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, auth, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider({
                        resources: ["https://api.example.com/disabled"],
                    })];
                case 1:
                    _a = _b.sent(), auth = _a.auth, ctx = _a.ctx, opts = _a.opts;
                    // Mark the row as disabled directly via the adapter.
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [
                                { field: "identifier", value: "https://api.example.com/disabled" },
                            ],
                            update: { disabled: true },
                        })];
                case 2:
                    // Mark the row as disabled directly via the adapter.
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: "https://api.example.com/disabled",
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 3:
                    _b.sent();
                    void auth; // silence unused
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns per-resource TTL when set", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider({
                        resources: ["https://api.example.com/ttl-test"],
                    })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    // Update the row with an explicit TTL after seeding.
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [
                                { field: "identifier", value: "https://api.example.com/ttl-test" },
                            ],
                            update: { accessTokenTtl: 120 },
                        })];
                case 2:
                    // Update the row with an explicit TTL after seeding.
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: "https://api.example.com/ttl-test",
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 3:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.accessTokenTtl).toBe(120);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("uses the minimum TTL across multiple requested resources", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ids, _a, ctx, opts, _i, _b, _c, id, ttl, policy;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    ids = [
                        "https://api.example.com/a",
                        "https://api.example.com/b",
                        "https://api.example.com/c",
                    ];
                    return [4 /*yield*/, bootProvider({
                            resources: ids,
                        })];
                case 1:
                    _a = _d.sent(), ctx = _a.ctx, opts = _a.opts;
                    _i = 0, _b = [
                        [ids[0], 300],
                        [ids[1], 60],
                        [ids[2], 900],
                    ];
                    _d.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 5];
                    _c = _b[_i], id = _c[0], ttl = _c[1];
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: id }],
                            update: { accessTokenTtl: ttl },
                        })];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                        resource: ids,
                        clientId: "client-x",
                        requestedScopes: [],
                    })];
                case 6:
                    policy = _d.sent();
                    (0, vitest_1.expect)(policy.accessTokenTtl).toBe(60);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns null TTL when no requested resource pins one", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, bootProvider({
                        resources: ["https://api.example.com/no-ttl"],
                    })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: "https://api.example.com/no-ttl",
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.accessTokenTtl).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("narrows requested scopes to the resource's allowedScopes intersection", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/scope-restricted";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: id }],
                            update: { allowedScopes: ["read:public"] },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-x",
                            requestedScopes: ["read:public", "admin:write"],
                        })];
                case 3:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.effectiveScopes).toStrictEqual(["read:public"]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects when no requested scope intersects allowedScopes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/scope-no-intersect";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: id }],
                            update: { allowedScopes: ["read:public"] },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-x",
                            requestedScopes: ["admin:write"],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_scope" }),
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes when requested scopes are within allowedScopes", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/scope-ok";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: id }],
                            update: { allowedScopes: ["read", "write"] },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-x",
                            requestedScopes: ["read"],
                        })];
                case 3:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toBe(id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("treats null allowedScopes as 'no restriction'", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/unrestricted";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-x",
                            requestedScopes: ["read", "write", "anything"],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toBe(id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns single-resource signing config", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/signed";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: id }],
                            update: {
                                signingAlgorithm: "EdDSA",
                                signingKeyId: "kid-xyz",
                            },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 3:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.signingAlgorithm).toBe("EdDSA");
                    (0, vitest_1.expect)(policy.signingKeyId).toBe("kid-xyz");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("throws on multi-resource requests where resources pin conflicting signing keys", function () { return __awaiter(void 0, void 0, void 0, function () {
        var idA, idB, _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    idA = "https://api.example.com/sig-a";
                    idB = "https://api.example.com/sig-b";
                    return [4 /*yield*/, bootProvider({
                            resources: [idA, idB],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idA }],
                            update: { signingAlgorithm: "EdDSA", signingKeyId: "kid-a" },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idB }],
                            update: { signingAlgorithm: "ES256", signingKeyId: "kid-b" },
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [idA, idB],
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_request" }),
                        })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts multi-resource requests when every pin agrees on alg and kid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var idA, idB, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    idA = "https://api.example.com/sig-agree-a";
                    idB = "https://api.example.com/sig-agree-b";
                    return [4 /*yield*/, bootProvider({
                            resources: [idA, idB],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idA }],
                            update: { signingAlgorithm: "EdDSA", signingKeyId: "kid-shared" },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idB }],
                            update: { signingAlgorithm: "EdDSA", signingKeyId: "kid-shared" },
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [idA, idB],
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 4:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.signingAlgorithm).toBe("EdDSA");
                    (0, vitest_1.expect)(policy.signingKeyId).toBe("kid-shared");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts multi-resource requests where compatible pins are spread across resources", function () { return __awaiter(void 0, void 0, void 0, function () {
        var idA, idB, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    idA = "https://api.example.com/sig-mixed-a";
                    idB = "https://api.example.com/sig-mixed-b";
                    return [4 /*yield*/, bootProvider({
                            resources: [idA, idB],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idA }],
                            update: { signingAlgorithm: "EdDSA", signingKeyId: null },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idB }],
                            update: { signingAlgorithm: null, signingKeyId: "kid-shared" },
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [idA, idB],
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 4:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.signingAlgorithm).toBe("EdDSA");
                    (0, vitest_1.expect)(policy.signingKeyId).toBe("kid-shared");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts multi-resource requests where only one resource pins and others inherit defaults", function () { return __awaiter(void 0, void 0, void 0, function () {
        var idA, idB, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    idA = "https://api.example.com/sig-partial-a";
                    idB = "https://api.example.com/sig-partial-b";
                    return [4 /*yield*/, bootProvider({
                            resources: [idA, idB],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idA }],
                            update: { signingAlgorithm: "EdDSA", signingKeyId: "kid-only-a" },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [idA, idB],
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 3:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.signingAlgorithm).toBe("EdDSA");
                    (0, vitest_1.expect)(policy.signingKeyId).toBe("kid-only-a");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects when algs agree but kids conflict (partial conflict — kid)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var idA, idB, _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    idA = "https://api.example.com/sig-kid-conflict-a";
                    idB = "https://api.example.com/sig-kid-conflict-b";
                    return [4 /*yield*/, bootProvider({
                            resources: [idA, idB],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idA }],
                            update: { signingAlgorithm: "EdDSA", signingKeyId: "kid-a" },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idB }],
                            update: { signingAlgorithm: "EdDSA", signingKeyId: "kid-b" },
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [idA, idB],
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({
                                error: "invalid_request",
                                error_description: vitest_1.expect.stringContaining("signingKeyId"),
                            }),
                        })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects when kids agree but algs conflict (partial conflict — alg)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var idA, idB, _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    idA = "https://api.example.com/sig-alg-conflict-a";
                    idB = "https://api.example.com/sig-alg-conflict-b";
                    return [4 /*yield*/, bootProvider({
                            resources: [idA, idB],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idA }],
                            update: { signingAlgorithm: "EdDSA", signingKeyId: "kid-shared" },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idB }],
                            update: { signingAlgorithm: "ES256", signingKeyId: "kid-shared" },
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [idA, idB],
                            clientId: "client-x",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({
                                error: "invalid_request",
                                error_description: vitest_1.expect.stringContaining("signingAlgorithm"),
                            }),
                        })];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("merges per-resource customClaims (later wins), returning reserved names raw for the claim resolver to strip", function () { return __awaiter(void 0, void 0, void 0, function () {
        var idA, idB, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    idA = "https://api.example.com/claims-a";
                    idB = "https://api.example.com/claims-b";
                    return [4 /*yield*/, bootProvider({
                            resources: [idA, idB],
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idA }],
                            update: { customClaims: { dept: "finance", iss: "evil-A" } },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, ctx.adapter.update({
                            model: "oauthResource",
                            where: [{ field: "identifier", value: idB }],
                            update: { customClaims: { dept: "ops", region: "us" } },
                        })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: [idA, idB],
                            clientId: "client-x",
                            requestedScopes: [],
                        })];
                case 4:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.rawCustomClaims).toEqual({
                        dept: "ops", // later wins
                        iss: "evil-A", // returned raw; resolveAccessTokenClaims strips reserved names
                        region: "us",
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("resolveResourcePolicy — enforcePerClientResources", function () {
    /**
     * Inserts an oauthClient row directly. The FK on
     * `oauthClientResource.clientId` references `oauthClient.clientId`, so
     * the client row must exist before we can link it.
     */
    var seedClient = function (ctx, clientId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.adapter.create({
                        model: "oauthClient",
                        data: {
                            clientId: clientId,
                            redirectUris: ["https://example.com/callback"],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var seedClientLink = function (ctx, clientId, resourceId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, seedClient(ctx, clientId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ctx.adapter.create({
                            model: "oauthClientResource",
                            data: {
                                clientId: clientId,
                                resourceId: resourceId,
                                createdAt: new Date(),
                            },
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    (0, vitest_1.it)("rejects unlinked clients when enforcement is on", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/locked";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                            enforcePerClientResources: true,
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, vitest_1.expect)((0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-not-linked",
                            requestedScopes: [],
                        })).rejects.toMatchObject({
                            body: vitest_1.expect.objectContaining({ error: "invalid_target" }),
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("accepts linked clients when enforcement is on", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/linked";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                            enforcePerClientResources: true,
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, seedClientLink(ctx, "client-linked", id)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-linked",
                            requestedScopes: [],
                        })];
                case 3:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toBe(id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("skips linkage check when enforcement is explicitly off", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/explicit-off-unlinked";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                            enforcePerClientResources: false,
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-unlinked",
                            requestedScopes: [],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toBe(id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("explicit enforcePerClientResources:false beats the smart default", function () { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, ctx, opts, policy;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "https://api.example.com/explicit-off";
                    return [4 /*yield*/, bootProvider({
                            resources: [id],
                            enforcePerClientResources: false,
                        })];
                case 1:
                    _a = _b.sent(), ctx = _a.ctx, opts = _a.opts;
                    return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(fakeEndpointCtx(ctx), opts, {
                            resource: id,
                            clientId: "client-unlinked",
                            requestedScopes: [],
                        })];
                case 2:
                    policy = _b.sent();
                    (0, vitest_1.expect)(policy.audienceClaim).toBe(id);
                    return [2 /*return*/];
            }
        });
    }); });
});
// File-level guard for startup logs emitted by plugin init.
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.spyOn(env_1.logger, "warn").mockImplementation(function () { return undefined; });
    vitest_1.vi.spyOn(env_1.logger, "info").mockImplementation(function () { return undefined; });
});
(0, vitest_1.afterEach)(function () {
    vitest_1.vi.restoreAllMocks();
});
