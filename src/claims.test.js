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
var env_1 = require("@better-auth/core/env");
var vitest_1 = require("vitest");
var claims_1 = require("./claims");
function optsWith(customAccessTokenClaims) {
    return { customAccessTokenClaims: customAccessTokenClaims };
}
// These cases exercise the merge/strip/precedence logic with no extensions
// configured, so `ctx` and `client` are never dereferenced; typed stubs satisfy
// the resolver's input contract without a live request.
var baseInput = {
    ctx: {},
    client: {},
    user: undefined,
    scopes: ["openid"],
    resources: undefined,
    referenceId: undefined,
    metadata: undefined,
    grantType: undefined,
    sessionId: undefined,
    perRequestClaims: undefined,
};
(0, vitest_1.describe)("resolveAccessTokenClaims", function () {
    (0, vitest_1.it)("returns an empty bag when no source contributes claims", function () { return __awaiter(void 0, void 0, void 0, function () {
        var claims;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, claims_1.resolveAccessTokenClaims)(__assign(__assign({ opts: optsWith() }, baseInput), { resourcePolicyClaims: {} }))];
                case 1:
                    claims = _a.sent();
                    (0, vitest_1.expect)(claims).toEqual({});
                    return [2 /*return*/];
            }
        });
    }); });
    // Precedence is the load-bearing invariant: the JWT mint and the opaque
    // introspection re-derive both call this, so the order must be fixed.
    // Lowest to highest: plugin customAccessTokenClaims < per-resource customClaims.
    (0, vitest_1.it)("merges plugin and resource claims, resource winning a collision", function () { return __awaiter(void 0, void 0, void 0, function () {
        var claims;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, claims_1.resolveAccessTokenClaims)(__assign(__assign({ opts: optsWith(function () { return ({ tier: "free", region: "eu" }); }) }, baseInput), { resourcePolicyClaims: { tier: "enterprise", dept: "ops" } }))];
                case 1:
                    claims = _a.sent();
                    (0, vitest_1.expect)(claims).toEqual({ tier: "enterprise", region: "eu", dept: "ops" });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("strips reserved RFC 9068 names from every source", function () { return __awaiter(void 0, void 0, void 0, function () {
        var claims, _i, _a, reserved;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, claims_1.resolveAccessTokenClaims)(__assign(__assign({ opts: optsWith(function () { return ({ sub: "evil", role: "admin" }); }) }, baseInput), { resourcePolicyClaims: { iss: "evil", scope: "evil", dept: "ops" } }))];
                case 1:
                    claims = _b.sent();
                    (0, vitest_1.expect)(claims).toEqual({ role: "admin", dept: "ops" });
                    for (_i = 0, _a = ["sub", "iss", "scope"]; _i < _a.length; _i++) {
                        reserved = _a[_i];
                        (0, vitest_1.expect)(claims).not.toHaveProperty(reserved);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("warns, naming the reserved claim names it stripped", function () { return __awaiter(void 0, void 0, void 0, function () {
        var warnSpy, message;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    warnSpy = vitest_1.vi
                        .spyOn(env_1.logger, "warn")
                        .mockImplementation(function () { return undefined; });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, claims_1.resolveAccessTokenClaims)(__assign(__assign({ opts: optsWith(function () { return ({ jti: "evil", role: "admin" }); }) }, baseInput), { resourcePolicyClaims: { iss: "evil" } }))];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(warnSpy).toHaveBeenCalledOnce();
                    message = ((_a = warnSpy.mock.calls[0]) !== null && _a !== void 0 ? _a : [])[0];
                    (0, vitest_1.expect)(String(message)).toMatch(/stripped reserved access-token claim/i);
                    (0, vitest_1.expect)(String(message)).toMatch(/jti/);
                    (0, vitest_1.expect)(String(message)).toMatch(/iss/);
                    return [3 /*break*/, 4];
                case 3:
                    warnSpy.mockRestore();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("hands derivable token context to customAccessTokenClaims", function () { return __awaiter(void 0, void 0, void 0, function () {
        var received;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, claims_1.resolveAccessTokenClaims)(__assign(__assign({}, baseInput), { opts: optsWith(function (info) {
                            received = info;
                            return {};
                        }), scopes: ["openid", "email"], resources: ["https://api.example.com"], referenceId: "ref-1", metadata: { plan: "pro" }, resourcePolicyClaims: {} }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(received).toMatchObject({
                        scopes: ["openid", "email"],
                        resources: ["https://api.example.com"],
                        referenceId: "ref-1",
                        metadata: { plan: "pro" },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("passes sessionId to an access-token extension contributor", function () { return __awaiter(void 0, void 0, void 0, function () {
        var received;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, claims_1.resolveAccessTokenClaims)(__assign(__assign({}, baseInput), { opts: {
                            extensions: [
                                {
                                    claims: {
                                        accessToken: function (input) {
                                            received = input;
                                            return {};
                                        },
                                    },
                                },
                            ],
                        }, sessionId: "sess-123", resourcePolicyClaims: {} }))];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(received === null || received === void 0 ? void 0 : received.sessionId).toBe("sess-123");
                    return [2 /*return*/];
            }
        });
    }); });
});
