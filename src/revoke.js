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
exports.revokeEndpoint = revokeEndpoint;
var env_1 = require("@better-auth/core/env");
var oauth2_1 = require("better-auth/oauth2");
var better_call_1 = require("better-call");
var jose_1 = require("jose");
var resources_1 = require("./resources");
var token_1 = require("./token");
var utils_1 = require("./utils");
/**
 * IMPORTANT NOTES:
 * Revocation follows RFC7009
 * https://datatracker.ietf.org/doc/html/rfc7009
 * - APIError: Continue catches (returnable to client)
 * - Error: Should immediately stop catches (internal error)
 */
/**
 * Revokes a JWT access token against the configured JWKs.
 *
 * A JWT access token is self-contained and never stored, so there is nothing to
 * delete. Once the token is confirmed to be a valid JWT for this server, the
 * endpoint reports `unsupported_token_type` (RFC 7009 §2.2.1) instead of a
 * silent success, so callers can tell that no server-side revocation happened.
 * An expired JWT or a JWT with an audience rejected by the OAuth resource model
 * is already inactive and still resolves as a successful no-op. Session-bound
 * tokens (carrying `sid`) are cut off early by the session-liveness check in
 * introspection and userinfo.
 */
function revokeJwtAccessToken(ctx, opts, token) {
    return __awaiter(this, void 0, void 0, function () {
        var jwtPlugin, jwtPluginOptions, jwtPayload, jwksFetch, jwks, verified, error_1, userInfoAudience, _a;
        var _this = this;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    // Without the JWT plugin, this server issues only opaque access tokens.
                    if (opts.disableJwtPlugin) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "JWT access tokens are disabled",
                            error: "invalid_request",
                        });
                    }
                    jwtPlugin = (0, utils_1.getJwtPlugin)(ctx.context);
                    jwtPluginOptions = jwtPlugin.options;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    jwksFetch = ((_b = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _b === void 0 ? void 0 : _b.remoteUrl)
                        ? jwtPluginOptions.jwks.remoteUrl
                        : function () { return __awaiter(_this, void 0, void 0, function () {
                            var jwksRes;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, jwtPlugin.endpoints.getJwks(ctx)];
                                    case 1:
                                        jwksRes = _a.sent();
                                        // @ts-expect-error response is a JSONWebKeySet but within the response field
                                        return [2 /*return*/, jwksRes === null || jwksRes === void 0 ? void 0 : jwksRes.response];
                                }
                            });
                        }); };
                    return [4 /*yield*/, (0, oauth2_1.getJwks)(token, {
                            jwksFetch: jwksFetch,
                            // The plugin instance is stable across requests, so the key set
                            // fetched by the per-request closure above is cached under it.
                            jwksCacheKey: jwtPlugin,
                        })];
                case 2:
                    jwks = _e.sent();
                    return [4 /*yield*/, (0, jose_1.jwtVerify)(token, (0, jose_1.createLocalJWKSet)(jwks), {
                            issuer: (_d = (_c = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _c === void 0 ? void 0 : _c.issuer) !== null && _d !== void 0 ? _d : ctx.context.baseURL,
                        })];
                case 3:
                    verified = _e.sent();
                    jwtPayload = verified.payload;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _e.sent();
                    // jose raises these only after the signature verifies: an expired token,
                    // or a malformed claims set. Check them before `isInvalidJwtError`, which
                    // also matches them.
                    if (error_1 instanceof jose_1.errors.JWTExpired ||
                        error_1 instanceof jose_1.errors.JWTInvalid) {
                        return [2 /*return*/, null];
                    }
                    // likely an opaque token, or a JWT this server cannot verify (bad
                    // signature, unknown key, failed claim checks such as `iss`), which
                    // may still be a stored opaque token (`generateOpaqueAccessToken`)
                    if (error_1 instanceof TypeError || (0, utils_1.isInvalidJwtError)(error_1)) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "invalid JWT signature",
                            error: "invalid_request",
                        });
                    }
                    throw error_1;
                case 5:
                    userInfoAudience = "".concat(ctx.context.baseURL, "/oauth2/userinfo");
                    _a = !jwtPayload.azp;
                    if (_a) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, resources_1.isAudienceClaimAllowed)(ctx, opts, jwtPayload.aud, [
                            userInfoAudience,
                        ])];
                case 6:
                    _a = !(_e.sent());
                    _e.label = 7;
                case 7:
                    if (_a) {
                        return [2 /*return*/, null];
                    }
                    // Verified: a valid JWT access token for this server. It is self-contained
                    // and not stored, so it cannot be revoked. Report that rather than implying
                    // success (RFC 7009 §2.2.1).
                    throw new better_call_1.APIError("BAD_REQUEST", {
                        error_description: "JWT access tokens are self-contained and cannot be revoked server-side",
                        error: "unsupported_token_type",
                    });
            }
        });
    });
}
/**
 * Searches for an opaque access token in the database and validates it
 */
function revokeOpaqueAccessToken(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenValue, accessToken, _a, _b, _c;
        var _d, _e;
        var _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    tokenValue = token;
                    if ((_f = opts.prefix) === null || _f === void 0 ? void 0 : _f.opaqueAccessToken) {
                        if (tokenValue.startsWith(opts.prefix.opaqueAccessToken)) {
                            tokenValue = tokenValue.replace(opts.prefix.opaqueAccessToken, "");
                        }
                        else {
                            throw new better_call_1.APIError("BAD_REQUEST", {
                                error_description: "opaque access token not found",
                                error: "invalid_request",
                            });
                        }
                    }
                    _b = (_a = ctx.context.adapter).findOne;
                    _d = {
                        model: "oauthAccessToken"
                    };
                    _e = {
                        field: "token"
                    };
                    return [4 /*yield*/, (0, utils_1.getStoredToken)(opts.storeTokens, tokenValue, "access_token")];
                case 1: return [4 /*yield*/, _b.apply(_a, [(_d.where = [
                            (_e.value = _g.sent(),
                                _e)
                        ],
                            _d)])];
                case 2:
                    accessToken = _g.sent();
                    if (!accessToken) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "opaque access token not found",
                            error: "invalid_request",
                        });
                    }
                    if (!accessToken.clientId || accessToken.clientId !== clientId) {
                        return [2 /*return*/, null];
                    }
                    if (!accessToken.id) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.context.adapter.delete({
                            model: "oauthAccessToken",
                            where: [{ field: "id", value: accessToken.id }],
                        })];
                case 3:
                    _c = _g.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, ctx.context.adapter.delete({
                        model: "oauthAccessToken",
                        where: [{ field: "token", value: accessToken.token }],
                    })];
                case 5:
                    _c = _g.sent();
                    _g.label = 6;
                case 6:
                    _c;
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Validates a refresh token in the session store.
 */
function revokeRefreshToken(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var refreshToken, _a, _b, iat, won;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _b = (_a = ctx.context.adapter).findOne;
                    _c = {
                        model: "oauthRefreshToken"
                    };
                    _d = {
                        field: "token"
                    };
                    return [4 /*yield*/, (0, utils_1.getStoredToken)(opts.storeTokens, token, "refresh_token")];
                case 1: return [4 /*yield*/, _b.apply(_a, [(_c.where = [
                            (_d.value = _e.sent(),
                                _d)
                        ],
                            _c)])];
                case 2:
                    refreshToken = _e.sent();
                    if (!refreshToken) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "token not found",
                            error: "invalid_request",
                        });
                    }
                    if (!refreshToken.revoked) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, token_1.invalidateRefreshFamily)(ctx, clientId, refreshToken.userId)];
                case 3:
                    _e.sent();
                    throw new better_call_1.APIError("BAD_REQUEST", {
                        error_description: "refresh token revoked",
                        error: "invalid_request",
                    });
                case 4:
                    if (!refreshToken.clientId || refreshToken.clientId !== clientId) {
                        return [2 /*return*/, null];
                    }
                    iat = Math.floor(Date.now() / 1000);
                    return [4 /*yield*/, ctx.context.adapter.incrementOne({
                            model: "oauthRefreshToken",
                            where: [
                                {
                                    field: "id",
                                    value: refreshToken.id,
                                },
                                {
                                    field: "revoked",
                                    operator: "eq",
                                    value: null,
                                },
                            ],
                            increment: {},
                            set: {
                                revoked: new Date(iat * 1000),
                            },
                        })];
                case 5:
                    won = _e.sent();
                    if (!!won) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, token_1.invalidateRefreshFamily)(ctx, clientId, refreshToken.userId)];
                case 6:
                    _e.sent();
                    throw new better_call_1.APIError("BAD_REQUEST", {
                        error_description: "refresh token revoked",
                        error: "invalid_request",
                    });
                case 7: return [4 /*yield*/, ctx.context.adapter.deleteMany({
                        model: "oauthAccessToken",
                        where: [{ field: "refreshId", value: refreshToken.id }],
                    })];
                case 8:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * We don't know the access token format so we try to validate it
 * as a JWT first, then as an opaque token.
 */
function revokeAccessToken(ctx, opts, clientId, token) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, revokeJwtAccessToken(ctx, opts, token)];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    err_1 = _b.sent();
                    if (err_1 instanceof better_call_1.APIError) {
                        // A confirmed JWT access token cannot be revoked: surface that rather
                        // than falling through to the opaque-token lookup.
                        if (((_a = err_1.body) === null || _a === void 0 ? void 0 : _a.error) === "unsupported_token_type") {
                            throw err_1;
                        }
                        // otherwise not a JWT, continue to opaque
                    }
                    else if (err_1 instanceof Error) {
                        throw err_1;
                    }
                    else {
                        throw new Error(err_1);
                    }
                    return [3 /*break*/, 3];
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, revokeOpaqueAccessToken(ctx, opts, token, clientId)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5:
                    err_2 = _b.sent();
                    if (err_2 instanceof better_call_1.APIError) {
                        // nothing
                    }
                    else if (err_2 instanceof Error) {
                        throw err_2;
                    }
                    else {
                        throw new Error("Unknown error validating access token");
                    }
                    return [3 /*break*/, 6];
                case 6: throw new better_call_1.APIError("BAD_REQUEST", {
                    error_description: "Invalid access token",
                    error: "invalid_request",
                });
            }
        });
    });
}
function revokeEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, token, token_type_hint, credentials, _b, client_id, client_secret, preVerified, authMethod, client, error_2, refreshToken, error_3, error_4;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = ctx.body, token = _a.token, token_type_hint = _a.token_type_hint;
                    // RFC 7009 §2.2.1: unknown hints are ignored and the server extends its
                    // search across all supported token types.
                    if (token_type_hint !== "access_token" &&
                        token_type_hint !== "refresh_token") {
                        token_type_hint = undefined;
                    }
                    return [4 /*yield*/, (0, utils_1.extractClientCredentials)(ctx, opts, "".concat(ctx.context.baseURL, "/oauth2/revoke"))];
                case 1:
                    credentials = _e.sent();
                    _b = (0, utils_1.destructureCredentials)(credentials), client_id = _b.clientId, client_secret = _b.clientSecret, preVerified = _b.preVerified, authMethod = _b.authMethod;
                    if (!client_id) {
                        throw new better_call_1.APIError("UNAUTHORIZED", {
                            error_description: "missing required credentials",
                            error: "invalid_client",
                        });
                    }
                    // Check token
                    if (typeof token === "string") {
                        token = (0, oauth2_1.stripAccessTokenAuthorizationScheme)(token);
                    }
                    if (!(token === null || token === void 0 ? void 0 : token.length)) {
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "missing a required token for introspection",
                            error: "invalid_request",
                        });
                    }
                    return [4 /*yield*/, (0, utils_1.validateClientCredentials)(ctx, opts, client_id, client_secret, undefined, preVerified, undefined, authMethod)];
                case 2:
                    client = _e.sent();
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 13, , 14]);
                    if (!(token_type_hint === undefined || token_type_hint === "access_token")) return [3 /*break*/, 7];
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, revokeAccessToken(ctx, opts, client.clientId, token)];
                case 5: return [2 /*return*/, _e.sent()];
                case 6:
                    error_2 = _e.sent();
                    if (error_2 instanceof better_call_1.APIError) {
                        if (token_type_hint === "access_token" ||
                            ((_c = error_2.body) === null || _c === void 0 ? void 0 : _c.error) === "unsupported_token_type") {
                            throw error_2;
                        } // else continue
                    }
                    else if (error_2 instanceof Error) {
                        throw error_2;
                    }
                    else {
                        throw new Error(error_2);
                    }
                    return [3 /*break*/, 7];
                case 7:
                    if (!(token_type_hint === undefined || token_type_hint === "refresh_token")) return [3 /*break*/, 12];
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 11, , 12]);
                    return [4 /*yield*/, (0, token_1.decodeRefreshToken)(opts, token)];
                case 9:
                    refreshToken = _e.sent();
                    return [4 /*yield*/, revokeRefreshToken(ctx, opts, refreshToken.token, client.clientId)];
                case 10: return [2 /*return*/, _e.sent()];
                case 11:
                    error_3 = _e.sent();
                    if (error_3 instanceof better_call_1.APIError) {
                        if (token_type_hint === "refresh_token") {
                            throw error_3;
                        } // else continue
                    }
                    else if (error_3 instanceof Error) {
                        throw error_3;
                    }
                    else {
                        throw new Error(error_3);
                    }
                    return [3 /*break*/, 12];
                case 12: throw new better_call_1.APIError("BAD_REQUEST", {
                    error_description: "token not found",
                    error: "invalid_request",
                });
                case 13:
                    error_4 = _e.sent();
                    if (error_4 instanceof better_call_1.APIError) {
                        // RFC 7009 §2.2.1: an explicit protocol error (unsupported_token_type)
                        // must surface; an unknown or already-invalid token still succeeds.
                        if (((_d = error_4.body) === null || _d === void 0 ? void 0 : _d.error) === "unsupported_token_type") {
                            throw error_4;
                        }
                        if (error_4.name === "BAD_REQUEST") {
                            return [2 /*return*/, null];
                        }
                        throw error_4;
                    }
                    else if (error_4 instanceof Error) {
                        env_1.logger.error("Introspection error:", error_4.message, error_4.stack);
                        throw new better_call_1.APIError("INTERNAL_SERVER_ERROR");
                    }
                    else {
                        env_1.logger.error("Introspection error:", error_4);
                        throw new better_call_1.APIError("INTERNAL_SERVER_ERROR");
                    }
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
