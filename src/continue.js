"use strict";
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
exports.continueEndpoint = continueEndpoint;
var api_1 = require("better-auth/api");
var oauth_1 = require("./oauth");
var utils_1 = require("./utils");
function continueEndpoint(ctx, authorize) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(ctx.body.selected === true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, selected(ctx, authorize)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(ctx.body.created === true)) return [3 /*break*/, 4];
                    return [4 /*yield*/, created(ctx, authorize)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!(ctx.body.postLogin === true)) return [3 /*break*/, 6];
                    return [4 /*yield*/, postLogin(ctx, authorize)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: throw new api_1.APIError("BAD_REQUEST", {
                    error_description: "Missing parameters",
                    error: "invalid_request",
                });
            }
        });
    });
}
function selected(ctx, authorize) {
    return __awaiter(this, void 0, void 0, function () {
        var _query, query;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, oauth_1.oAuthState.get()];
                case 1:
                    _query = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.query;
                    if (!_query) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "missing oauth query",
                            error: "invalid_request",
                        });
                    }
                    (_b = ctx.headers) === null || _b === void 0 ? void 0 : _b.set("accept", "application/json");
                    query = new URLSearchParams(_query);
                    ctx.query = (0, utils_1.searchParamsToQuery)((0, utils_1.removePromptFromQuery)(query, "select_account"));
                    return [4 /*yield*/, authorize(ctx)];
                case 2: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function created(ctx, authorize) {
    return __awaiter(this, void 0, void 0, function () {
        var _query, query;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, oauth_1.oAuthState.get()];
                case 1:
                    _query = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.query;
                    if (!_query) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "missing oauth query",
                            error: "invalid_request",
                        });
                    }
                    query = new URLSearchParams(_query);
                    (_b = ctx.headers) === null || _b === void 0 ? void 0 : _b.set("accept", "application/json");
                    ctx.query = (0, utils_1.searchParamsToQuery)((0, utils_1.removePromptFromQuery)(query, "create"));
                    return [4 /*yield*/, authorize(ctx)];
                case 2: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function postLogin(ctx, authorize) {
    return __awaiter(this, void 0, void 0, function () {
        var state, _query, query, session, postLoginCleared;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, oauth_1.oAuthState.get()];
                case 1:
                    state = _b.sent();
                    _query = state === null || state === void 0 ? void 0 : state.query;
                    if (!_query) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "missing oauth query",
                            error: "invalid_request",
                        });
                    }
                    query = new URLSearchParams(_query);
                    (_a = ctx.headers) === null || _a === void 0 ? void 0 : _a.set("accept", "application/json");
                    ctx.query = (0, utils_1.searchParamsToQuery)(query);
                    return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 2:
                    session = _b.sent();
                    postLoginCleared = (state === null || state === void 0 ? void 0 : state.postLoginClearedForSession) !== undefined &&
                        state.postLoginClearedForSession === (session === null || session === void 0 ? void 0 : session.session.id);
                    return [4 /*yield*/, authorize(ctx, {
                            postLogin: postLoginCleared,
                            isPostLoginContinuation: true,
                        })];
                case 3: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
