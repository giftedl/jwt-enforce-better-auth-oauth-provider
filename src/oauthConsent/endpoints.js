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
exports.getConsentEndpoint = getConsentEndpoint;
exports.getConsentsEndpoint = getConsentsEndpoint;
exports.deleteConsentEndpoint = deleteConsentEndpoint;
exports.updateConsentEndpoint = updateConsentEndpoint;
var api_1 = require("better-auth/api");
var utils_1 = require("../utils");
function getConsent(ctx, opts, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.context.adapter.findOne({
                        model: "oauthConsent",
                        where: [
                            {
                                field: "id",
                                value: id,
                            },
                        ],
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getConsentEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, id, consent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    id = ctx.query.id;
                    if (!id) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "missing id parameter",
                            error: "not_found",
                        });
                    }
                    return [4 /*yield*/, getConsent(ctx, opts, id)];
                case 2:
                    consent = _a.sent();
                    if (!consent) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "no consent",
                            error: "not_found",
                        });
                    }
                    if (consent.userId !== session.user.id) {
                        throw new api_1.APIError("UNAUTHORIZED");
                    }
                    return [2 /*return*/, consent];
            }
        });
    });
}
function getConsentsEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [4 /*yield*/, ctx.context.adapter.findMany({
                            model: "oauthConsent",
                            where: [
                                {
                                    field: "userId",
                                    value: session.user.id,
                                },
                            ],
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function deleteConsentEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, id, consent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    id = ctx.body.id;
                    if (!id) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "missing id parameter",
                            error: "not_found",
                        });
                    }
                    return [4 /*yield*/, getConsent(ctx, opts, id)];
                case 2:
                    consent = _a.sent();
                    if (!consent) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "no consent",
                            error: "not_found",
                        });
                    }
                    if (consent.userId !== session.user.id)
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [4 /*yield*/, ctx.context.adapter.delete({
                            model: "oauthConsent",
                            where: [
                                {
                                    field: "id",
                                    value: id,
                                },
                            ],
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateConsentEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, id, consent, client, allowedScopes, updates, scopes, iat;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _d.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    id = ctx.body.id;
                    if (!id) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "missing id parameter",
                            error: "not_found",
                        });
                    }
                    return [4 /*yield*/, getConsent(ctx, opts, id)];
                case 2:
                    consent = _d.sent();
                    if (!consent) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "no consent",
                            error: "not_found",
                        });
                    }
                    if (consent.userId !== session.user.id) {
                        throw new api_1.APIError("UNAUTHORIZED");
                    }
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, consent.clientId)];
                case 3:
                    client = _d.sent();
                    if (!client) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "client not found",
                            error: "not_found",
                        });
                    }
                    allowedScopes = (_b = (_a = client === null || client === void 0 ? void 0 : client.scopes) !== null && _a !== void 0 ? _a : opts.scopes) !== null && _b !== void 0 ? _b : [];
                    updates = ctx.body.update;
                    scopes = updates.scopes;
                    if (scopes && !scopes.every(function (val) { return allowedScopes === null || allowedScopes === void 0 ? void 0 : allowedScopes.includes(val); })) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "unable to provide scopes to ".concat((_c = client === null || client === void 0 ? void 0 : client.referenceId) !== null && _c !== void 0 ? _c : client === null || client === void 0 ? void 0 : client.userId),
                            error: "invalid_request",
                        });
                    }
                    iat = Math.floor(Date.now() / 1000);
                    return [4 /*yield*/, ctx.context.adapter.update({
                            model: "oauthConsent",
                            where: [
                                {
                                    field: "id",
                                    value: id,
                                },
                            ],
                            update: __assign(__assign({}, updates), { updatedAt: new Date(iat * 1000) }),
                        })];
                case 4: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
