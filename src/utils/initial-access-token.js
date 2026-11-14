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
exports.authorizeInitialAccessToken = authorizeInitialAccessToken;
var api_1 = require("better-auth/api");
var better_call_1 = require("better-call");
var index_1 = require("./index");
/**
 * Builds an RFC 6750 §3 Bearer challenge for the registration endpoint. The
 * `error` code maps to the status per RFC 6750 §3.1 (`invalid_request` → 400,
 * `invalid_token` → 401) and is echoed in both the `WWW-Authenticate` challenge
 * and the JSON body.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6750#section-3
 */
function registrationBearerError(status, error, errorDescription) {
    return new better_call_1.APIError(status, { error: error, error_description: errorDescription }, __assign({ "WWW-Authenticate": "Bearer error=\"".concat(error, "\"") }, api_1.NO_STORE_HEADERS));
}
/**
 * Resolves an RFC 7591 initial access token from the request and authorizes it
 * against the deployment-supplied validator.
 *
 * Returns the authorization (optionally carrying a `referenceId`) when a valid
 * token is present, or `undefined` when no Bearer credentials were sent so the
 * caller can fall back to session or open registration. Throws an RFC 6750
 * Bearer challenge when the header is malformed, no validator is configured, or
 * the token is rejected.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7591#section-3
 */
function authorizeInitialAccessToken(ctx, opts, clientMetadata) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, initialAccessToken, authorization, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = ctx.headers;
                    try {
                        initialAccessToken = (0, index_1.parseBearerToken)(headers === null || headers === void 0 ? void 0 : headers.get("authorization"));
                    }
                    catch (_b) {
                        throw registrationBearerError("BAD_REQUEST", "invalid_request", "Malformed initial access token Authorization header");
                    }
                    if (!initialAccessToken || !headers) {
                        return [2 /*return*/, undefined];
                    }
                    // Reject a presented token when no validator is wired up rather than letting
                    // it fall through to the weaker open-registration path (fail-closed). The
                    // description stays generic so an unauthenticated caller cannot distinguish
                    // "no validator configured" from "token rejected".
                    if (!opts.validateInitialAccessToken) {
                        throw registrationBearerError("UNAUTHORIZED", "invalid_token", "Invalid initial access token");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, opts.validateInitialAccessToken({
                            initialAccessToken: initialAccessToken,
                            headers: headers,
                            clientMetadata: clientMetadata,
                        })];
                case 2:
                    authorization = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    // A deployment validator may deliberately throw an APIError to shape its
                    // own response. Anything else is unexpected, so fail closed with a generic
                    // server_error rather than letting the thrown message or stack surface.
                    if (error_1 instanceof better_call_1.APIError)
                        throw error_1;
                    throw new better_call_1.APIError("INTERNAL_SERVER_ERROR", {
                        error: "server_error",
                        error_description: "Initial access token validation failed",
                    });
                case 4:
                    if (!authorization) {
                        throw registrationBearerError("UNAUTHORIZED", "invalid_token", "Invalid initial access token");
                    }
                    return [2 /*return*/, authorization];
            }
        });
    });
}
