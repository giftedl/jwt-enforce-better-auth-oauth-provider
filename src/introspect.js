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
exports.validateAccessToken = validateAccessToken;
exports.requireActiveAccessToken = requireActiveAccessToken;
exports.requireActiveAccessTokenWithClaims = requireActiveAccessTokenWithClaims;
exports.introspectEndpoint = introspectEndpoint;
var env_1 = require("@better-auth/core/env");
var oauth2_1 = require("better-auth/oauth2");
var better_call_1 = require("better-call");
var jose_1 = require("jose");
var claims_1 = require("./claims");
var resources_1 = require("./resources");
var token_1 = require("./token");
var utils_1 = require("./utils");
var INVALID_ACCESS_TOKEN_ERROR_DESCRIPTION = "Invalid access token";
var INVALID_ACCESS_TOKEN_WWW_AUTHENTICATE = "Bearer error=\"invalid_token\", error_description=\"".concat(INVALID_ACCESS_TOKEN_ERROR_DESCRIPTION, "\"");
function inactiveAccessToken() {
    return { payload: { active: false }, requestedUserInfoClaims: [] };
}
/**
 * IMPORTANT NOTES:
 * Introspection follows RFC7662
 * https://datatracker.ietf.org/doc/html/rfc7662
 * - APIError: Continue catches (returnable to client)
 * - Error: Should immediately stop catches (internal error)
 */
/**
 * Resource identifiers in a token's audience, excluding the implicit
 * `/oauth2/userinfo` audience (which is not a configured resource server).
 */
function audienceResourceIdentifiers(aud, userInfoAud) {
    if (aud == null)
        return [];
    var values = Array.isArray(aud) ? aud : [aud];
    return values.filter(function (value) {
        return typeof value === "string" && value !== userInfoAud;
    });
}
/**
 * Authorizes an introspection request (RFC 7662 §2.1/§4). The caller is already
 * authenticated as a registered client; it may introspect the token when it
 * issued the token, or when it is a resource server linked to one of the token's
 * audience resources. Tokens with no resource audience stay issuer-only. An
 * unauthorized caller receives `{active:false}` (indistinguishable from an
 * expired or unknown token), preserving the §4 anti-scanning property.
 */
function isIntrospectionAuthorized(ctx, opts, params) {
    return __awaiter(this, void 0, void 0, function () {
        var introspectingClientId, issuerClientId, audienceResources;
        return __generator(this, function (_a) {
            introspectingClientId = params.introspectingClientId, issuerClientId = params.issuerClientId, audienceResources = params.audienceResources;
            if (!introspectingClientId)
                return [2 /*return*/, true];
            if (introspectingClientId === issuerClientId)
                return [2 /*return*/, true];
            if (audienceResources.length === 0)
                return [2 /*return*/, false];
            return [2 /*return*/, (0, resources_1.isClientLinkedToAnyResource)(ctx, opts, introspectingClientId, audienceResources)];
        });
    });
}
/**
 * Validates a JWT access token against the configured JWKs.
 *
 * @returns RFC7662 introspection format
 */
function validateJwtAccessToken(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var jwtPlugin, jwtPluginOptions, baseURL, userInfoAud, expectedIssuer, jwtPayload, jwksFetch, jwks, verified, error_1, rawAud, client, sessionId, session;
        var _this = this;
        var _a, _b, _c, _d;
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
                    baseURL = (_a = ctx.context.baseURL) !== null && _a !== void 0 ? _a : "";
                    userInfoAud = "".concat(baseURL, "/oauth2/userinfo");
                    expectedIssuer = (_c = (_b = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _b === void 0 ? void 0 : _b.issuer) !== null && _c !== void 0 ? _c : ctx.context.baseURL;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    jwksFetch = ((_d = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _d === void 0 ? void 0 : _d.remoteUrl)
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
                    return [4 /*yield*/, (0, oauth2_1.getJwks)(token, { jwksFetch: jwksFetch, jwksCacheKey: jwtPlugin })];
                case 2:
                    jwks = _e.sent();
                    return [4 /*yield*/, (0, jose_1.jwtVerify)(token, (0, jose_1.createLocalJWKSet)(jwks), {
                            issuer: expectedIssuer,
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
                        return [2 /*return*/, {
                                active: false,
                            }];
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
                    rawAud = jwtPayload.aud;
                    return [4 /*yield*/, (0, resources_1.isAudienceClaimAllowed)(ctx, opts, rawAud, [userInfoAud])];
                case 6:
                    if (!(_e.sent())) {
                        return [2 /*return*/, { active: false }];
                    }
                    // An OAuth access token issued by this provider always carries an `azp`
                    // (authorized party = client) claim, stamped by `createJwtAccessToken`. The
                    // JWT plugin shares the same issuer, audience convention, and signing keys, so
                    // a plain session JWT (e.g. from its `/token` endpoint) can otherwise satisfy
                    // the signature/issuer/audience checks above. Such a token was never issued
                    // through the OAuth token endpoint and has no client or consent binding, so
                    // it must not be reported as an active access token. Require `azp` and a
                    // matching, enabled client before considering the token active.
                    if (!jwtPayload.azp) {
                        return [2 /*return*/, {
                                active: false,
                            }];
                    }
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, jwtPayload.azp)];
                case 7:
                    client = _e.sent();
                    if (!client || (client === null || client === void 0 ? void 0 : client.disabled)) {
                        return [2 /*return*/, {
                                active: false,
                            }];
                    }
                    return [4 /*yield*/, isIntrospectionAuthorized(ctx, opts, {
                            introspectingClientId: clientId,
                            issuerClientId: jwtPayload.azp,
                            audienceResources: audienceResourceIdentifiers(rawAud, userInfoAud),
                        })];
                case 8:
                    // RFC 7662 §2.1/§4: the introspecting client need not be the issuer. Allow
                    // the issuer, or a resource server linked to one of the token's audience
                    // resources; otherwise report the token inactive (no scanning signal).
                    if (!(_e.sent())) {
                        return [2 /*return*/, { active: false }];
                    }
                    sessionId = jwtPayload.sid;
                    if (!sessionId) return [3 /*break*/, 10];
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: "session",
                            where: [{ field: "id", value: sessionId }],
                        })];
                case 9:
                    session = _e.sent();
                    if (!session || session.expiresAt < new Date()) {
                        return [2 /*return*/, { active: false }];
                    }
                    _e.label = 10;
                case 10:
                    // Return the JWT payload in introspection format
                    // https://datatracker.ietf.org/doc/html/rfc7662#section-2.2
                    jwtPayload.client_id = jwtPayload.azp;
                    jwtPayload.active = true;
                    jwtPayload.token_type = (0, token_1.confirmationTokenType)(jwtPayload.cnf);
                    return [2 /*return*/, jwtPayload];
            }
        });
    });
}
/**
 * Searches for an opaque access token in the database and validates it
 *
 * @returns RFC7662 introspection format
 */
function validateOpaqueAccessToken(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenValue, accessToken, _a, _b, resources, client, sessionId, session, user, userInfoEndpoint, _c, audienceClaim, resourcePolicyClaims, _d, accessTokenClaims, _e, jwtPlugin, jwtPluginOptions;
        var _f, _g;
        var _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    tokenValue = token;
                    if ((_h = opts.prefix) === null || _h === void 0 ? void 0 : _h.opaqueAccessToken) {
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
                    _f = {
                        model: "oauthAccessToken"
                    };
                    _g = {
                        field: "token"
                    };
                    return [4 /*yield*/, (0, utils_1.getStoredToken)(opts.storeTokens, tokenValue, "access_token")];
                case 1: return [4 /*yield*/, _b.apply(_a, [(_f.where = [
                            (_g.value = _r.sent(),
                                _g)
                        ],
                            _f)])];
                case 2:
                    accessToken = _r.sent();
                    if (!accessToken) {
                        // Pass through, may be other token type
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "opaque access token not found",
                            error: "invalid_token",
                        });
                    }
                    if (!accessToken.expiresAt || accessToken.expiresAt < new Date()) {
                        return [2 /*return*/, inactiveAccessToken()];
                    }
                    if (accessToken.revoked) {
                        return [2 /*return*/, inactiveAccessToken()];
                    }
                    resources = Array.isArray(accessToken.resources)
                        ? accessToken.resources
                        : undefined;
                    if (!accessToken.clientId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, accessToken.clientId)];
                case 3:
                    client = _r.sent();
                    if (!client || (client === null || client === void 0 ? void 0 : client.disabled)) {
                        return [2 /*return*/, inactiveAccessToken()];
                    }
                    return [4 /*yield*/, isIntrospectionAuthorized(ctx, opts, {
                            introspectingClientId: clientId,
                            issuerClientId: accessToken.clientId,
                            audienceResources: resources !== null && resources !== void 0 ? resources : [],
                        })];
                case 4:
                    // RFC 7662 §2.1/§4: allow the issuer, or a resource server linked to one
                    // of the token's audience resources; otherwise report inactive.
                    if (!(_r.sent())) {
                        return [2 /*return*/, inactiveAccessToken()];
                    }
                    _r.label = 5;
                case 5:
                    sessionId = (_j = accessToken.sessionId) !== null && _j !== void 0 ? _j : undefined;
                    if (!sessionId) return [3 /*break*/, 7];
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: "session",
                            where: [
                                {
                                    field: "id",
                                    value: sessionId,
                                },
                            ],
                        })];
                case 6:
                    session = _r.sent();
                    if (!session || session.expiresAt < new Date()) {
                        return [2 /*return*/, inactiveAccessToken()];
                    }
                    _r.label = 7;
                case 7:
                    if (!accessToken.userId) return [3 /*break*/, 9];
                    return [4 /*yield*/, ctx.context.internalAdapter.findUserById(accessToken === null || accessToken === void 0 ? void 0 : accessToken.userId)];
                case 8:
                    user = _r.sent();
                    _r.label = 9;
                case 9:
                    userInfoEndpoint = "".concat(ctx.context.baseURL, "/oauth2/userinfo");
                    _c = (resources === null || resources === void 0 ? void 0 : resources.length);
                    if (!_c) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, resources_1.isAudienceClaimAllowed)(ctx, opts, resources, [userInfoEndpoint])];
                case 10:
                    _c = !(_r.sent());
                    _r.label = 11;
                case 11:
                    // Deleting a resource row revokes the tokens bound to it: introspection
                    // reports inactive (RFC 7662 §2.2 stable failure), mirroring the JWT path so
                    // a resource server enforces deletion without per-token revocation. A
                    // disabled row still resolves, so an already-issued token keeps verifying
                    // until it expires.
                    if (_c) {
                        return [2 /*return*/, inactiveAccessToken()];
                    }
                    audienceClaim = resources ? __spreadArray([], resources, true) : undefined;
                    if ((audienceClaim === null || audienceClaim === void 0 ? void 0 : audienceClaim.length) && ((_k = accessToken.scopes) === null || _k === void 0 ? void 0 : _k.includes("openid"))) {
                        if (!audienceClaim.includes(userInfoEndpoint)) {
                            audienceClaim.push(userInfoEndpoint);
                        }
                    }
                    if (!(resources === null || resources === void 0 ? void 0 : resources.length)) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, resources_1.getResourceCustomClaims)(ctx, opts, resources)];
                case 12:
                    _d = _r.sent();
                    return [3 /*break*/, 14];
                case 13:
                    _d = {};
                    _r.label = 14;
                case 14:
                    resourcePolicyClaims = _d;
                    if (!client) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, claims_1.resolveAccessTokenClaims)({
                            ctx: ctx,
                            opts: opts,
                            user: user,
                            client: client,
                            scopes: (_l = accessToken.scopes) !== null && _l !== void 0 ? _l : [],
                            grantType: undefined,
                            sessionId: undefined,
                            resources: resources,
                            referenceId: accessToken.referenceId,
                            metadata: (0, utils_1.parseClientMetadata)(client.metadata),
                            perRequestClaims: undefined,
                            resourcePolicyClaims: resourcePolicyClaims,
                        })];
                case 15:
                    _e = _r.sent();
                    return [3 /*break*/, 17];
                case 16:
                    _e = {};
                    _r.label = 17;
                case 17:
                    accessTokenClaims = _e;
                    jwtPlugin = opts.disableJwtPlugin
                        ? undefined
                        : (0, utils_1.getJwtPlugin)(ctx.context);
                    jwtPluginOptions = jwtPlugin === null || jwtPlugin === void 0 ? void 0 : jwtPlugin.options;
                    return [2 /*return*/, {
                            payload: __assign(__assign(__assign({}, accessTokenClaims), { active: true, iss: (_o = (_m = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _m === void 0 ? void 0 : _m.issuer) !== null && _o !== void 0 ? _o : ctx.context.baseURL, aud: (0, utils_1.toAudienceClaim)(audienceClaim), client_id: accessToken.clientId, azp: accessToken.clientId, sub: user === null || user === void 0 ? void 0 : user.id, sid: sessionId, exp: Math.floor(new Date(accessToken.expiresAt).getTime() / 1000), iat: Math.floor(new Date(accessToken.createdAt).getTime() / 1000), scope: (_p = accessToken.scopes) === null || _p === void 0 ? void 0 : _p.join(" "), token_type: (0, token_1.confirmationTokenType)(accessToken.confirmation) }), (accessToken.confirmation ? { cnf: accessToken.confirmation } : {})),
                            requestedUserInfoClaims: (_q = accessToken.requestedUserInfoClaims) !== null && _q !== void 0 ? _q : [],
                        }];
            }
        });
    });
}
/**
 * Validates a refresh token in the session store.
 *
 * @returns payload in RFC7662 introspection format
 */
function validateRefreshToken(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var refreshToken, _a, _b, sessionId, session, user, jwtPlugin, jwtPluginOptions;
        var _c, _d;
        var _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
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
                            (_d.value = _k.sent(),
                                _d)
                        ],
                            _c)])];
                case 2:
                    refreshToken = _k.sent();
                    if (!refreshToken) {
                        // Pass through may be other token type
                        throw new better_call_1.APIError("BAD_REQUEST", {
                            error_description: "token not found",
                            error: "invalid_token",
                        });
                    }
                    if (!refreshToken.clientId || refreshToken.clientId !== clientId) {
                        return [2 /*return*/, {
                                active: false,
                            }];
                    }
                    if (!refreshToken.expiresAt || refreshToken.expiresAt < new Date()) {
                        return [2 /*return*/, {
                                active: false,
                            }];
                    }
                    if (refreshToken.revoked) {
                        return [2 /*return*/, {
                                active: false,
                            }];
                    }
                    sessionId = (_e = refreshToken.sessionId) !== null && _e !== void 0 ? _e : undefined;
                    if (!sessionId) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: "session",
                            where: [
                                {
                                    field: "id",
                                    value: sessionId,
                                },
                            ],
                        })];
                case 3:
                    session = _k.sent();
                    if (!session || session.expiresAt < new Date()) {
                        sessionId = undefined;
                    }
                    _k.label = 4;
                case 4:
                    user = undefined;
                    if (!refreshToken.userId) return [3 /*break*/, 6];
                    return [4 /*yield*/, ctx.context.internalAdapter.findUserById(refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.userId)];
                case 5:
                    user =
                        (_f = (_k.sent())) !== null && _f !== void 0 ? _f : undefined;
                    _k.label = 6;
                case 6:
                    jwtPlugin = opts.disableJwtPlugin
                        ? undefined
                        : (0, utils_1.getJwtPlugin)(ctx.context);
                    jwtPluginOptions = jwtPlugin === null || jwtPlugin === void 0 ? void 0 : jwtPlugin.options;
                    return [2 /*return*/, __assign({ active: true, client_id: clientId, iss: (_h = (_g = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _g === void 0 ? void 0 : _g.issuer) !== null && _h !== void 0 ? _h : ctx.context.baseURL, sub: user === null || user === void 0 ? void 0 : user.id, sid: sessionId, exp: Math.floor(new Date(refreshToken.expiresAt).getTime() / 1000), iat: Math.floor(new Date(refreshToken.createdAt).getTime() / 1000), scope: (_j = refreshToken.scopes) === null || _j === void 0 ? void 0 : _j.join(" "), token_type: (0, token_1.confirmationTokenType)(refreshToken.confirmation) }, (refreshToken.confirmation ? { cnf: refreshToken.confirmation } : {}))];
            }
        });
    });
}
function createInvalidAccessTokenError() {
    return new better_call_1.APIError("UNAUTHORIZED", {
        error_description: INVALID_ACCESS_TOKEN_ERROR_DESCRIPTION,
        error: "invalid_token",
    }, {
        "WWW-Authenticate": INVALID_ACCESS_TOKEN_WWW_AUTHENTICATE,
    });
}
function isInactiveTokenError(error) {
    var _a;
    return (error.status === "BAD_REQUEST" || ((_a = error.body) === null || _a === void 0 ? void 0 : _a.error) === "invalid_token");
}
/**
 * We don't know the access token format so we try to validate it as a JWT
 * first, then as an opaque token. Returns the RFC 7662 introspection payload
 * alongside the per-issuance UserInfo claims the opaque row persisted (empty for
 * a JWT access token, which resolves UserInfo claims by scope).
 */
function resolveAccessTokenValidation(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, validateJwtAccessToken(ctx, opts, token, clientId)];
                case 1:
                    payload = _a.sent();
                    return [2 /*return*/, { payload: payload, requestedUserInfoClaims: [] }];
                case 2:
                    err_1 = _a.sent();
                    if (err_1 instanceof better_call_1.APIError) {
                        // continue
                    }
                    else if (err_1 instanceof Error) {
                        throw err_1;
                    }
                    else {
                        throw new Error(err_1);
                    }
                    return [3 /*break*/, 3];
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, validateOpaqueAccessToken(ctx, opts, token, clientId)];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    err_2 = _a.sent();
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
                case 6: throw createInvalidAccessTokenError();
            }
        });
    });
}
/**
 * Validates an access token (JWT or opaque) and returns its RFC 7662
 * introspection-format payload.
 *
 * @internal
 */
function validateAccessToken(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, resolveAccessTokenValidation(ctx, opts, token, clientId)];
                case 1: return [2 /*return*/, (_a.sent())
                        .payload];
            }
        });
    });
}
function requireActiveAccessToken(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, validateAccessToken(ctx, opts, token, clientId)];
                case 1:
                    payload = _a.sent();
                    if (payload.active)
                        return [2 /*return*/, payload];
                    throw createInvalidAccessTokenError();
            }
        });
    });
}
/**
 * UserInfo entry point: validates the access token, requires it active, and
 * returns the introspection payload together with the OIDC `claims.userinfo`
 * names persisted for the token. Opaque tokens carry the names on their row;
 * JWT access tokens return an empty list and resolve UserInfo claims by scope.
 */
function requireActiveAccessTokenWithClaims(ctx, opts, token, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, payload, requestedUserInfoClaims;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, resolveAccessTokenValidation(ctx, opts, token, clientId)];
                case 1:
                    _a = _b.sent(), payload = _a.payload, requestedUserInfoClaims = _a.requestedUserInfoClaims;
                    if (payload.active) {
                        return [2 /*return*/, {
                                payload: payload,
                                requestedUserInfoClaims: requestedUserInfoClaims,
                            }];
                    }
                    throw createInvalidAccessTokenError();
            }
        });
    });
}
/**
 * Resolves pairwise sub on an introspection payload.
 * Applied at the presentation layer so internal validation functions
 * keep real user.id (needed for user lookup in /userinfo).
 */
function resolveIntrospectionSub(ctx, opts, payload, introspectingClient) {
    return __awaiter(this, void 0, void 0, function () {
        var issuerClientId, issuingClient, _a, resolvedSub;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!payload.active || !payload.sub)
                        return [2 /*return*/, payload];
                    issuerClientId = ((_b = payload.client_id) !== null && _b !== void 0 ? _b : payload.azp);
                    if (!issuerClientId)
                        return [2 /*return*/, payload];
                    if (!(issuerClientId === introspectingClient.clientId)) return [3 /*break*/, 1];
                    _a = introspectingClient;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, issuerClientId)];
                case 2:
                    _a = _c.sent();
                    _c.label = 3;
                case 3:
                    issuingClient = _a;
                    if (!issuingClient)
                        return [2 /*return*/, payload];
                    return [4 /*yield*/, (0, utils_1.resolveSubjectIdentifier)(payload.sub, issuingClient, opts)];
                case 4:
                    resolvedSub = _c.sent();
                    return [2 /*return*/, __assign(__assign({}, payload), { sub: resolvedSub })];
            }
        });
    });
}
function introspectEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, token, token_type_hint, credentials, _b, client_id, client_secret, preVerified, authMethod, client, payload, error_2, refreshToken, payload, error_3, error_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = ctx.body, token = _a.token, token_type_hint = _a.token_type_hint;
                    // RFC 7662 §2.1: unknown hints are ignored and detection falls back to
                    // trying both supported token types.
                    if (token_type_hint !== "access_token" &&
                        token_type_hint !== "refresh_token") {
                        token_type_hint = undefined;
                    }
                    return [4 /*yield*/, (0, utils_1.extractClientCredentials)(ctx, opts, "".concat(ctx.context.baseURL, "/oauth2/introspect"))];
                case 1:
                    credentials = _c.sent();
                    _b = (0, utils_1.destructureCredentials)(credentials), client_id = _b.clientId, client_secret = _b.clientSecret, preVerified = _b.preVerified, authMethod = _b.authMethod;
                    if (!client_id || (!client_secret && !preVerified)) {
                        throw new better_call_1.APIError("UNAUTHORIZED", {
                            error_description: "missing required credentials",
                            error: "invalid_client",
                        });
                    }
                    // Check token
                    if (token && typeof token === "string") {
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
                    client = _c.sent();
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 13, , 14]);
                    if (!(token_type_hint === undefined || token_type_hint === "access_token")) return [3 /*break*/, 7];
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, validateAccessToken(ctx, opts, token, client.clientId)];
                case 5:
                    payload = _c.sent();
                    return [2 /*return*/, resolveIntrospectionSub(ctx, opts, payload, client)];
                case 6:
                    error_2 = _c.sent();
                    if (error_2 instanceof better_call_1.APIError) {
                        if (token_type_hint === "access_token") {
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
                    _c.label = 8;
                case 8:
                    _c.trys.push([8, 11, , 12]);
                    return [4 /*yield*/, (0, token_1.decodeRefreshToken)(opts, token)];
                case 9:
                    refreshToken = _c.sent();
                    return [4 /*yield*/, validateRefreshToken(ctx, opts, refreshToken.token, client.clientId)];
                case 10:
                    payload = _c.sent();
                    return [2 /*return*/, resolveIntrospectionSub(ctx, opts, payload, client)];
                case 11:
                    error_3 = _c.sent();
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
                    error_4 = _c.sent();
                    if (error_4 instanceof better_call_1.APIError) {
                        if (isInactiveTokenError(error_4)) {
                            return [2 /*return*/, {
                                    active: false,
                                }];
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
