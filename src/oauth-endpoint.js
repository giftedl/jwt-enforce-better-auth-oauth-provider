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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuthEndpoint = createOAuthEndpoint;
exports.mapIssuesToOAuthError = mapIssuesToOAuthError;
exports.isMissingValueIssue = isMissingValueIssue;
var api_1 = require("better-auth/api");
var better_call_1 = require("better-call");
var z = require("zod");
/**
 * Wraps `createAuthEndpoint` so zod schemas stay the single source of truth
 * for body/query shape while validation failures serialize as the RFC 6749
 * §5.2 error envelope `{ error, error_description }`.
 *
 * A failing issue is routed by its first path segment via `errorCodesByField`:
 * - missing required (`invalid_type` + "received undefined") → `.missing`
 * - unsupported value (`invalid_value`) → `.invalid`
 * - anything else (wrong type, duplicated params, bad format) → `defaultError`
 *
 * For enum fields that need to distinguish missing from unsupported, compose
 * as `z.string().pipe(z.enum([...]))` so duplicated params fail the outer
 * `z.string()` as `invalid_type` instead of masquerading as an unsupported
 * enum value.
 */
function createOAuthEndpoint(path, options, handler) {
    var _this = this;
    var redirectOnError = options.redirectOnError, userHook = options.onValidationError, errorCodesByField = options.errorCodesByField, _a = options.defaultError, defaultError = _a === void 0 ? "invalid_request" : _a, rest = __rest(options, ["redirectOnError", "onValidationError", "errorCodesByField", "defaultError"]);
    if (!redirectOnError) {
        var forwarded_1 = __assign(__assign({}, rest), { onValidationError: function (args) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!userHook) return [3 /*break*/, 2];
                            return [4 /*yield*/, userHook(args)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: throw new better_call_1.APIError("BAD_REQUEST", __assign({}, mapIssuesToOAuthError(args.issues, errorCodesByField, defaultError)));
                    }
                });
            }); } });
        return (0, api_1.createAuthEndpoint)(path, forwarded_1, handler);
    }
    // Bind so the non-null narrowing from the guard above survives into `validateSlot`;
    // TS drops narrowing when crossing into a nested function declaration.
    var redirect = redirectOnError;
    var _b = rest, bodySchema = _b.body, querySchema = _b.query, forwarded = __rest(_b, ["body", "query"]);
    function validateSlot(ctx, slot, schema) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!schema)
                            return [2 /*return*/, { ok: true }];
                        return [4 /*yield*/, schema.safeParseAsync((_a = ctx[slot]) !== null && _a !== void 0 ? _a : {})];
                    case 1:
                        result = _b.sent();
                        if (result.success) {
                            ctx[slot] = result.data;
                            return [2 /*return*/, { ok: true }];
                        }
                        if (!userHook) return [3 /*break*/, 3];
                        return [4 /*yield*/, userHook({
                                message: result.error.message,
                                issues: result.error.issues,
                            })];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, {
                            ok: false,
                            response: redirect(__assign(__assign({}, mapIssuesToOAuthError(result.error.issues, errorCodesByField, defaultError)), { ctx: ctx })),
                        }];
                }
            });
        });
    }
    return (0, api_1.createAuthEndpoint)(path, forwarded, function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var body, query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, validateSlot(ctx, "body", bodySchema)];
                case 1:
                    body = _a.sent();
                    if (!body.ok)
                        return [2 /*return*/, body.response];
                    return [4 /*yield*/, validateSlot(ctx, "query", querySchema)];
                case 2:
                    query = _a.sent();
                    if (!query.ok)
                        return [2 /*return*/, query.response];
                    return [2 /*return*/, handler(ctx)];
            }
        });
    }); });
}
function mapIssuesToOAuthError(issues, errorCodesByField, defaultError) {
    var _a, _b;
    if (defaultError === void 0) { defaultError = "invalid_request"; }
    var issue = issues[0];
    if (!issue) {
        return {
            error: defaultError,
            error_description: "Invalid request.",
        };
    }
    var first = (_a = issue.path) === null || _a === void 0 ? void 0 : _a[0];
    var fieldKey = typeof first === "string" ? first : undefined;
    var mapping = fieldKey ? errorCodesByField === null || errorCodesByField === void 0 ? void 0 : errorCodesByField[fieldKey] : undefined;
    var field = ((_b = issue.path) === null || _b === void 0 ? void 0 : _b.length) ? z.core.toDotPath(issue.path) : "";
    return {
        error: resolveErrorCode(issue, mapping, defaultError),
        error_description: describeIssue(issue, field),
    };
}
function resolveErrorCode(issue, mapping, defaultError) {
    var _a, _b;
    if (typeof mapping === "string")
        return mapping;
    if (isMissingValueIssue(issue)) {
        return (_a = mapping === null || mapping === void 0 ? void 0 : mapping.missing) !== null && _a !== void 0 ? _a : defaultError;
    }
    if (issue.code === "invalid_value") {
        return (_b = mapping === null || mapping === void 0 ? void 0 : mapping.invalid) !== null && _b !== void 0 ? _b : defaultError;
    }
    return defaultError;
}
/**
 * Returns `true` for issues that represent an absent required value. Zod v4
 * strips `input` from published issues, so the signal is the `invalid_type`
 * code combined with a message suffix of "received undefined". The suffix is
 * pinned by a regression test so a zod rephrase fails the test instead of
 * silently reclassifying missing fields.
 *
 * Assumes the default zod error map. Consumers that install a localized map
 * via `z.setErrorMap()` will break this check, collapsing missing-field
 * failures to `defaultError`.
 */
function isMissingValueIssue(issue) {
    return (issue.code === "invalid_type" &&
        issue.message.endsWith("received undefined"));
}
function describeIssue(issue, field) {
    var _a;
    if (!field)
        return issue.message;
    if (issue.code === "invalid_type") {
        if (issue.message.endsWith("received undefined")) {
            return "".concat(field, " is required");
        }
        if (issue.message.endsWith("received array")) {
            return "".concat(field, " must not appear more than once");
        }
        var expected = (_a = issue.expected) !== null && _a !== void 0 ? _a : "valid value";
        return "".concat(field, " must be a ").concat(expected);
    }
    if (issue.code === "invalid_value") {
        var values = issue.values;
        if (Array.isArray(values) && values.length > 0) {
            return "".concat(field, " must be one of: ").concat(values.join(", "));
        }
    }
    return "".concat(field, ": ").concat(issue.message);
}
