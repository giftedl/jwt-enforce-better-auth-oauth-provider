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
exports.confirmationTokenType = confirmationTokenType;
exports.tokenEndpoint = tokenEndpoint;
exports.getOAuthProviderApi = getOAuthProviderApi;
exports.decodeRefreshToken = decodeRefreshToken;
exports.invalidateRefreshFamily = invalidateRefreshFamily;
exports.checkDpopProofBeforeConsume = checkDpopProofBeforeConsume;
var api_1 = require("better-auth/api");
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var plugins_1 = require("better-auth/plugins");
var jose_1 = require("jose");
var authentication_context_1 = require("./authentication-context");
var claims_1 = require("./claims");
var claims_request_1 = require("./claims-request");
var dpop_1 = require("./dpop");
var extensions_1 = require("./extensions");
var client_credentials_1 = require("./oauthClient/client-credentials");
var resources_1 = require("./resources");
var standard_claims_1 = require("./standard-claims");
var zod_1 = require("./types/zod");
var userinfo_1 = require("./userinfo");
var utils_1 = require("./utils");
// Seed the ID token with the standard UserInfo claim names set to `undefined`,
// so a `customIdTokenClaims` or extension contributor cannot inject a
// scope-gated identity claim into the ID token. Derived from the one claim
// registry so the guard tracks the standard claims with no separate list.
var ID_TOKEN_SCOPE_CLAIM_GUARDS = Object.fromEntries(standard_claims_1.STANDARD_CLAIM_NAMES.map(function (name) { return [name, undefined]; }));
/**
 * Token presentation scheme implied by a confirmation: a DPoP key thumbprint
 * (`jkt`) yields `"DPoP"`; any other confirmation (including mTLS `x5t#S256`)
 * keeps `"Bearer"`, since that constraint lives at the TLS layer.
 */
function confirmationTokenType(confirmation) {
    return (0, oauth2_1.getConfirmationJkt)(confirmation) ? "DPoP" : "Bearer";
}
var JWT_ACCESS_TOKEN_TYPE = "at+jwt";
/**
 * Handles the /oauth2/token endpoint by delegating
 * the grant types
 */
function tokenEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var grantType, handler;
        return __generator(this, function (_a) {
            grantType = ctx.body.grant_type;
            if (!(0, extensions_1.getSupportedGrantTypes)(opts).includes(grantType)) {
                throw new api_1.APIError("BAD_REQUEST", {
                    error_description: "unsupported grant_type ".concat(grantType),
                    error: "unsupported_grant_type",
                });
            }
            switch (grantType) {
                case "authorization_code":
                    return [2 /*return*/, handleAuthorizationCodeGrant(ctx, opts)];
                case "client_credentials":
                    return [2 /*return*/, handleClientCredentialsGrant(ctx, opts)];
                case "refresh_token":
                    return [2 /*return*/, handleRefreshTokenGrant(ctx, opts)];
                default: {
                    handler = (0, extensions_1.getExtensionGrantHandler)(opts, grantType);
                    if (handler) {
                        return [2 /*return*/, handler({
                                ctx: ctx,
                                opts: opts,
                                grantType: grantType,
                                provider: getOAuthProviderApi(ctx, opts, grantType),
                            })];
                    }
                    throw new api_1.APIError("BAD_REQUEST", {
                        error_description: "unsupported grant_type ".concat(grantType),
                        error: "unsupported_grant_type",
                    });
                }
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Returns the OAuth Provider's server-side capability surface bound to `ctx`.
 * The token endpoint passes one (pre-bound to the dispatched grant) to each
 * extension grant handler; a companion plugin's own endpoint calls this directly
 * with its grant type. `grantType` is bound here, not per issuance, so a handler
 * cannot mislabel the grant; omit it for capabilities that do not issue tokens
 * (`getClient`, `validateAccessToken`, `requireActiveAccessToken`), and
 * `issueTokens` then throws.
 */
function getOAuthProviderApi(ctx, opts, grantType) {
    var _this = this;
    return {
        getClient: function (clientId) { return (0, utils_1.getClient)(ctx, opts, clientId); },
        authenticateClient: function (request) { return __awaiter(_this, void 0, void 0, function () {
            var credentials, _a, clientId, clientSecret, preVerified, authMethod, confirmation, client;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.extractClientCredentials)(ctx, opts, 
                        // Bind the RFC 7523 assertion audience to the endpoint actually
                        // serving this request: the token endpoint for an in-grant handler,
                        // or a plugin's own endpoint out-of-grant. A fixed token-endpoint
                        // audience would let an assertion be replayed across endpoints, or
                        // reject a valid assertion minted for the real endpoint.
                        "".concat(ctx.context.baseURL).concat((_b = ctx.path) !== null && _b !== void 0 ? _b : "/oauth2/token"))];
                    case 1:
                        credentials = _c.sent();
                        _a = (0, utils_1.destructureCredentials)(credentials), clientId = _a.clientId, clientSecret = _a.clientSecret, preVerified = _a.preVerified, authMethod = _a.authMethod, confirmation = _a.confirmation;
                        if (!clientId) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error_description: "Missing required client_id",
                                error: "invalid_request",
                            });
                        }
                        if ((request === null || request === void 0 ? void 0 : request.requireCredentials) !== false &&
                            !clientSecret &&
                            !preVerified) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error_description: "Missing required client credentials",
                                error: "invalid_client",
                            });
                        }
                        return [4 /*yield*/, (0, utils_1.validateClientCredentials)(ctx, opts, clientId, clientSecret, request === null || request === void 0 ? void 0 : request.scopes, preVerified, grantType, authMethod)];
                    case 2:
                        client = _c.sent();
                        return [2 /*return*/, {
                                clientId: clientId,
                                client: client,
                                method: authMethod,
                                confirmation: confirmation,
                            }];
                }
            });
        }); },
        issueTokens: function (params) {
            if (!grantType) {
                throw new api_1.APIError("INTERNAL_SERVER_ERROR", {
                    error_description: "issueTokens requires a grant type; pass it to getOAuthProviderApi(ctx, opts, grantType).",
                    error: "server_error",
                });
            }
            return createUserTokens(ctx, opts, __assign(__assign({}, params), { grantType: grantType }));
        },
        hashToken: function (token, type) {
            return (0, utils_1.storeToken)(opts.storeTokens, token, type);
        },
        validateAccessToken: function (token, clientId) { return __awaiter(_this, void 0, void 0, function () {
            var validateAccessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./introspect"); })];
                    case 1:
                        validateAccessToken = (_a.sent()).validateAccessToken;
                        return [2 /*return*/, validateAccessToken(ctx, opts, token, clientId)];
                }
            });
        }); },
        requireActiveAccessToken: function (token, clientId) { return __awaiter(_this, void 0, void 0, function () {
            var requireActiveAccessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./introspect"); })];
                    case 1:
                        requireActiveAccessToken = (_a.sent()).requireActiveAccessToken;
                        return [2 /*return*/, requireActiveAccessToken(ctx, opts, token, clientId)];
                }
            });
        }); },
    };
}
// User Jwt SHALL follow oAuth 2
// NOTE: Requires jwt plugin (assert !opts.disableJwtPlugin)
function createJwtAccessToken(ctx, opts, user, client, audienceClaim, scopes, overrides) {
    return __awaiter(this, void 0, void 0, function () {
        var iat, exp, jwtPluginOptions, subject;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            iat = (_a = overrides === null || overrides === void 0 ? void 0 : overrides.iat) !== null && _a !== void 0 ? _a : Math.floor(Date.now() / 1000);
            exp = (_b = overrides === null || overrides === void 0 ? void 0 : overrides.exp) !== null && _b !== void 0 ? _b : iat + ((_c = opts.accessTokenExpiresIn) !== null && _c !== void 0 ? _c : 3600);
            jwtPluginOptions = (0, utils_1.getJwtPlugin)(ctx.context).options;
            subject = (_d = user === null || user === void 0 ? void 0 : user.id) !== null && _d !== void 0 ? _d : client.clientId;
            // Sign token — pass per-resource signing config if set; otherwise fall
            // back to the JWT plugin's default.
            return [2 /*return*/, (0, plugins_1.signJWT)(ctx, {
                    options: jwtPluginOptions,
                    header: { typ: JWT_ACCESS_TOKEN_TYPE },
                    signingKeyId: (_e = overrides === null || overrides === void 0 ? void 0 : overrides.signingKeyId) !== null && _e !== void 0 ? _e : undefined,
                    signingAlgorithm: (_f = overrides === null || overrides === void 0 ? void 0 : overrides.signingAlgorithm) !== null && _f !== void 0 ? _f : undefined,
                    payload: __assign(__assign(__assign({}, ((_g = overrides === null || overrides === void 0 ? void 0 : overrides.accessTokenClaims) !== null && _g !== void 0 ? _g : {})), { 
                        // RFC 9068 §2.2 requires `sub` on every JWT access token. For
                        // client_credentials, no resource owner participates, so the client is
                        // the subject represented to the resource server.
                        sub: subject, aud: (0, utils_1.toAudienceClaim)(audienceClaim), 
                        // RFC 9068 §2.2.3: `client_id` MUST be present in JWT access tokens.
                        // Distinct from `azp` (authorized party — OIDC), kept for back-compat
                        // with introspection flows that key on it. The AS owns this value;
                        // `resolveAccessTokenClaims` strips reserved names so resource or
                        // plugin claims can't override it.
                        client_id: client.clientId, azp: client.clientId, scope: scopes.join(" "), sid: overrides === null || overrides === void 0 ? void 0 : overrides.sid, iss: (_j = (_h = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _h === void 0 ? void 0 : _h.issuer) !== null && _j !== void 0 ? _j : ctx.context.baseURL, iat: iat, exp: exp, 
                        // RFC 9068 §2.2.4: `jti` SHOULD be present. Emit a 128-bit random ID
                        // so audit trails and (future) revocation lookups can reference
                        // individual tokens.
                        jti: (0, crypto_1.generateRandomString)(32) }), ((overrides === null || overrides === void 0 ? void 0 : overrides.confirmation) ? { cnf: overrides.confirmation } : {})),
                })];
        });
    });
}
/**
 * Computes an OIDC hash (at_hash, c_hash) per OIDC Core §3.1.3.6.
 * Hashes the token, takes the left half, and base64url-encodes it.
 */
function computeOidcHash(token, signingAlg) {
    return __awaiter(this, void 0, void 0, function () {
        var hashAlg, digest, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (signingAlg === "EdDSA") {
                        hashAlg = "SHA-512";
                    }
                    else if (signingAlg.endsWith("384")) {
                        hashAlg = "SHA-384";
                    }
                    else if (signingAlg.endsWith("512")) {
                        hashAlg = "SHA-512";
                    }
                    else {
                        hashAlg = "SHA-256";
                    }
                    _a = Uint8Array.bind;
                    return [4 /*yield*/, crypto.subtle.digest(hashAlg, new TextEncoder().encode(token))];
                case 1:
                    digest = new (_a.apply(Uint8Array, [void 0, _b.sent()]))();
                    return [2 /*return*/, jose_1.base64url.encode(digest.slice(0, digest.length / 2))];
            }
        });
    });
}
/**
 * Creates a user id token in code_authorization with scope of 'openid'
 * and hybrid/implicit (not yet implemented) flows
 */
function createIdToken(ctx, opts, user, client, scopes, nonce, sessionId, authTime, accessToken, extraClaims) {
    return __awaiter(this, void 0, void 0, function () {
        var iat, exp, resolvedSub, authTimeSec, customClaims, _a, _b, jwtPluginOptions, resolvedKey, _c, signingAlg, atHash, _d, emitSid, payload, additiveClaims, idToken, _e, _f, _g, _h, _j, header;
        var _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    iat = Math.floor(Date.now() / 1000);
                    exp = iat + ((_k = opts.idTokenExpiresIn) !== null && _k !== void 0 ? _k : 36000);
                    return [4 /*yield*/, (0, utils_1.resolveSubjectIdentifier)(user.id, client, opts)];
                case 1:
                    resolvedSub = _t.sent();
                    authTimeSec = authTime != null ? Math.floor(authTime.getTime() / 1000) : undefined;
                    _a = authentication_context_1.stripReservedIdTokenClaims;
                    if (!opts.customIdTokenClaims) return [3 /*break*/, 3];
                    return [4 /*yield*/, opts.customIdTokenClaims({
                            user: user,
                            scopes: scopes,
                            metadata: (0, utils_1.parseClientMetadata)(client.metadata),
                        })];
                case 2:
                    _b = _t.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _b = undefined;
                    _t.label = 4;
                case 4:
                    customClaims = _a.apply(void 0, [_b]);
                    jwtPluginOptions = opts.disableJwtPlugin
                        ? undefined
                        : (0, utils_1.getJwtPlugin)(ctx.context).options;
                    if (!(!opts.disableJwtPlugin && !((_l = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _l === void 0 ? void 0 : _l.sign))) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, plugins_1.resolveSigningKey)(ctx, jwtPluginOptions)];
                case 5:
                    _c = _t.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _c = undefined;
                    _t.label = 7;
                case 7:
                    resolvedKey = _c;
                    signingAlg = opts.disableJwtPlugin
                        ? "HS256"
                        : ((_m = resolvedKey === null || resolvedKey === void 0 ? void 0 : resolvedKey.alg) !== null && _m !== void 0 ? _m : (_p = (_o = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _o === void 0 ? void 0 : _o.keyPairConfig) === null || _p === void 0 ? void 0 : _p.alg);
                    if (!accessToken) return [3 /*break*/, 9];
                    return [4 /*yield*/, computeOidcHash(accessToken, signingAlg)];
                case 8:
                    _d = _t.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _d = undefined;
                    _t.label = 10;
                case 10:
                    atHash = _d;
                    emitSid = Boolean(client.enableEndSession || client.backchannelLogoutUri);
                    payload = __assign(__assign(__assign(__assign({}, ID_TOKEN_SCOPE_CLAIM_GUARDS), { auth_time: authTimeSec, acr: authentication_context_1.LEVEL_0_ACR }), customClaims), { at_hash: atHash, iss: (_r = (_q = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _q === void 0 ? void 0 : _q.issuer) !== null && _r !== void 0 ? _r : ctx.context.baseURL, sub: resolvedSub, aud: client.clientId, nonce: nonce, iat: iat, exp: exp, sid: emitSid ? sessionId : undefined });
                    additiveClaims = (0, authentication_context_1.stripReservedIdTokenClaims)(extraClaims);
                    Object.assign(payload, (0, userinfo_1.pickClaims)(additiveClaims, payload));
                    // Public clients without a client secret cannot receive an idToken as it can't be verified
                    // Confidential clients would still receive an idToken signed by the clientSecret
                    if (opts.disableJwtPlugin && !client.clientSecret) {
                        return [2 /*return*/, undefined];
                    }
                    if (!opts.disableJwtPlugin) return [3 /*break*/, 13];
                    _g = (_f = new jose_1.SignJWT(payload)
                        .setProtectedHeader({ alg: "HS256" }))
                        .sign;
                    _j = (_h = new TextEncoder()).encode;
                    return [4 /*yield*/, (0, utils_1.decryptStoredClientSecret)(ctx, opts.storeClientSecret, client.clientSecret)];
                case 11: return [4 /*yield*/, _g.apply(_f, [_j.apply(_h, [_t.sent()])])];
                case 12:
                    _e = _t.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, (0, plugins_1.signJWT)(ctx, {
                        options: jwtPluginOptions,
                        payload: payload,
                        resolvedKey: resolvedKey !== null && resolvedKey !== void 0 ? resolvedKey : undefined,
                    })];
                case 14:
                    _e = _t.sent();
                    _t.label = 15;
                case 15:
                    idToken = _e;
                    // When using a custom jwt.sign callback, validate that the actual
                    // signing algorithm matches what was used for at_hash (OIDC Core §3.1.3.6)
                    if (idToken && atHash && ((_s = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _s === void 0 ? void 0 : _s.sign)) {
                        header = (0, jose_1.decodeProtectedHeader)(idToken);
                        if (header.alg !== signingAlg) {
                            throw new api_1.APIError("INTERNAL_SERVER_ERROR", {
                                error_description: "ID token signed with \"".concat(header.alg, "\" but at_hash was computed ") +
                                    "for \"".concat(signingAlg, "\". Ensure jwt.sign uses the algorithm ") +
                                    "declared in keyPairConfig.alg.",
                                error: "server_error",
                            });
                        }
                    }
                    return [2 /*return*/, idToken];
            }
        });
    });
}
/**
 * Encodes a refresh token for a client
 */
function encodeRefreshToken(opts, token, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = ((_d = (_c = opts.prefix) === null || _c === void 0 ? void 0 : _c.refreshToken) !== null && _d !== void 0 ? _d : "");
                    if (!((_e = opts.formatRefreshToken) === null || _e === void 0 ? void 0 : _e.encrypt)) return [3 /*break*/, 2];
                    return [4 /*yield*/, opts.formatRefreshToken.encrypt(token, sessionId)];
                case 1:
                    _b = _f.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _b = token;
                    _f.label = 3;
                case 3: return [2 /*return*/, (_a +
                        (_b))];
            }
        });
    });
}
/**
 * Decodes a refresh token for a client
 *
 * @internal
 */
function decodeRefreshToken(opts, token) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            if ((_a = opts.prefix) === null || _a === void 0 ? void 0 : _a.refreshToken) {
                if (token.startsWith(opts.prefix.refreshToken)) {
                    token = token.replace(opts.prefix.refreshToken, "");
                }
                else {
                    throw new api_1.APIError("BAD_REQUEST", {
                        error_description: "refresh token not found",
                        error: "invalid_token",
                    });
                }
            }
            return [2 /*return*/, ((_b = opts.formatRefreshToken) === null || _b === void 0 ? void 0 : _b.decrypt)
                    ? (_c = opts.formatRefreshToken) === null || _c === void 0 ? void 0 : _c.decrypt(token)
                    : { token: token }];
        });
    });
}
function createOpaqueAccessToken(ctx, opts, user, client, scopes, payload, resources, referenceId, authorizationCodeId, refreshId, confirmation, requestedUserInfoClaims) {
    return __awaiter(this, void 0, void 0, function () {
        var iat, exp, token, _a, storedToken, accessTokenId, created, error_1, _b, _c;
        var _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    iat = (_d = payload.iat) !== null && _d !== void 0 ? _d : Math.floor(Date.now() / 1000);
                    exp = (_e = payload === null || payload === void 0 ? void 0 : payload.exp) !== null && _e !== void 0 ? _e : iat + ((_f = opts.accessTokenExpiresIn) !== null && _f !== void 0 ? _f : 3600);
                    if (!opts.generateOpaqueAccessToken) return [3 /*break*/, 2];
                    return [4 /*yield*/, opts.generateOpaqueAccessToken()];
                case 1:
                    _a = _j.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = (0, crypto_1.generateRandomString)(32, "A-Z", "a-z");
                    _j.label = 3;
                case 3:
                    token = _a;
                    return [4 /*yield*/, (0, utils_1.storeToken)(opts.storeTokens, token, "access_token")];
                case 4:
                    storedToken = _j.sent();
                    _j.label = 5;
                case 5:
                    _j.trys.push([5, 7, , 10]);
                    return [4 /*yield*/, ctx.context.adapter.create({
                            model: "oauthAccessToken",
                            data: {
                                token: storedToken,
                                clientId: client.clientId,
                                sessionId: payload === null || payload === void 0 ? void 0 : payload.sid,
                                userId: user === null || user === void 0 ? void 0 : user.id,
                                referenceId: referenceId,
                                authorizationCodeId: authorizationCodeId,
                                resources: resources,
                                refreshId: refreshId,
                                confirmation: confirmation,
                                requestedUserInfoClaims: (requestedUserInfoClaims === null || requestedUserInfoClaims === void 0 ? void 0 : requestedUserInfoClaims.length)
                                    ? requestedUserInfoClaims
                                    : undefined,
                                scopes: scopes,
                                createdAt: new Date(iat * 1000),
                                expiresAt: new Date(exp * 1000),
                            },
                        })];
                case 6:
                    created = _j.sent();
                    accessTokenId = created.id;
                    return [3 /*break*/, 10];
                case 7:
                    error_1 = _j.sent();
                    _b = refreshId;
                    if (!_b) return [3 /*break*/, 9];
                    return [4 /*yield*/, refreshTokenExists(ctx, refreshId)];
                case 8:
                    _b = !(_j.sent());
                    _j.label = 9;
                case 9:
                    // A concurrent reuse detection or code replay can delete the refresh
                    // token issued with this one before this insert runs.
                    if (_b) {
                        ctx.context.logger.warn("access token not stored: its refresh token was revoked during issuance", error_1);
                        throw grantRevokedDuringIssuance();
                    }
                    throw error_1;
                case 10:
                    _c = refreshId;
                    if (!_c) return [3 /*break*/, 12];
                    return [4 /*yield*/, refreshTokenExists(ctx, refreshId)];
                case 11:
                    _c = !(_j.sent());
                    _j.label = 12;
                case 12:
                    if (!_c) return [3 /*break*/, 14];
                    return [4 /*yield*/, ctx.context.adapter.delete({
                            model: "oauthAccessToken",
                            where: [{ field: "id", value: accessTokenId }],
                        })];
                case 13:
                    _j.sent();
                    throw grantRevokedDuringIssuance();
                case 14: return [2 /*return*/, ((_h = (_g = opts.prefix) === null || _g === void 0 ? void 0 : _g.opaqueAccessToken) !== null && _h !== void 0 ? _h : "") + token];
            }
        });
    });
}
function refreshTokenExists(ctx, refreshId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.context.adapter.findOne({
                        model: "oauthRefreshToken",
                        where: [{ field: "id", value: refreshId }],
                    })];
                case 1: return [2 /*return*/, !!(_a.sent())];
            }
        });
    });
}
function grantRevokedDuringIssuance() {
    return new api_1.APIError("BAD_REQUEST", {
        error_description: "grant revoked during token issuance",
        error: "invalid_grant",
    });
}
/**
 * Tear down the entire refresh-token family for a (client, user) pair, plus
 * any access tokens that reference those refresh rows, per RFC 9700 §4.14.
 * Access tokens are deleted first so the parent rows' foreign-key children
 * do not block the refresh-row delete.
 *
 * TODO(invalidate-family-race): the two `deleteMany` calls are not atomic
 * with respect to each other. Between them, a concurrent rotation in a
 * different worker can `create` a fresh refresh row (and, immediately after,
 * an access-token row referencing it) for the same (client, user) pair,
 * leaving the family partially rebuilt and the new refresh row orphaned of
 * any deletion. Closing this window requires the same transactional adapter
 * contract tracked under FIXME(strict-family-invalidation) in
 * `createRefreshToken`.
 *
 * @internal
 */
function invalidateRefreshFamily(ctx, clientId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var deleteLinkedAccessTokens;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deleteLinkedAccessTokens = function () {
                        return ctx.context.adapter.deleteMany({
                            model: "oauthAccessToken",
                            where: [
                                { field: "clientId", value: clientId },
                                { field: "userId", value: userId },
                                { field: "refreshId", operator: "ne", value: null },
                            ],
                        });
                    };
                    return [4 /*yield*/, deleteLinkedAccessTokens()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ctx.context.adapter.deleteMany({
                            model: "oauthRefreshToken",
                            where: [
                                { field: "clientId", value: clientId },
                                { field: "userId", value: userId },
                            ],
                        })];
                case 2:
                    _a.sent();
                    // Without a foreign key, an in-flight issuance can store an access token
                    // between the two deletes above. See `createOpaqueAccessToken`.
                    return [4 /*yield*/, deleteLinkedAccessTokens()];
                case 3:
                    // Without a foreign key, an in-flight issuance can store an access token
                    // between the two deletes above. See `createOpaqueAccessToken`.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function revokeTokensIssuedForAuthorizationCode(ctx, authorizationCodeId) {
    return __awaiter(this, void 0, void 0, function () {
        var deleteIssuedTokens;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deleteIssuedTokens = function (model) { return __awaiter(_this, void 0, void 0, function () {
                        var error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, ctx.context.adapter.deleteMany({
                                            model: model,
                                            where: [{ field: "authorizationCodeId", value: authorizationCodeId }],
                                        })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _a.sent();
                                    ctx.context.logger.error("authorization code replay cleanup failed", error_2);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, deleteIssuedTokens("oauthAccessToken")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, deleteIssuedTokens("oauthRefreshToken")];
                case 2:
                    _a.sent();
                    // Without a foreign key, an in-flight redemption can store an access token
                    // between the two deletes above. See `createOpaqueAccessToken`.
                    return [4 /*yield*/, deleteIssuedTokens("oauthAccessToken")];
                case 3:
                    // Without a foreign key, an in-flight redemption can store an access token
                    // between the two deletes above. See `createOpaqueAccessToken`.
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createRefreshToken(ctx, opts, user, referenceId, authorizationCodeId, client, scopes, payload, originalRefresh, authTime, resources, confirmation, requestedUserInfoClaims) {
    return __awaiter(this, void 0, void 0, function () {
        var iat, exp, token, _a, sessionId, storedToken, newRow, refreshToken_1, rotatedAt, rotationUpdate, reuseInterval, won, refreshToken;
        var _b, _c;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    iat = (_d = payload.iat) !== null && _d !== void 0 ? _d : Math.floor(Date.now() / 1000);
                    exp = (_e = payload === null || payload === void 0 ? void 0 : payload.exp) !== null && _e !== void 0 ? _e : iat + ((_f = opts.refreshTokenExpiresIn) !== null && _f !== void 0 ? _f : 2592000);
                    if (!opts.generateRefreshToken) return [3 /*break*/, 2];
                    return [4 /*yield*/, opts.generateRefreshToken()];
                case 1:
                    _a = _h.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = (0, crypto_1.generateRandomString)(32, "A-Z", "a-z");
                    _h.label = 3;
                case 3:
                    token = _a;
                    sessionId = payload === null || payload === void 0 ? void 0 : payload.sid;
                    return [4 /*yield*/, (0, utils_1.storeToken)(opts.storeTokens, token, "refresh_token")];
                case 4:
                    storedToken = _h.sent();
                    newRow = {
                        token: storedToken,
                        clientId: client.clientId,
                        sessionId: sessionId,
                        userId: user.id,
                        referenceId: referenceId,
                        authorizationCodeId: authorizationCodeId,
                        authTime: authTime,
                        confirmation: confirmation,
                        requestedUserInfoClaims: (requestedUserInfoClaims === null || requestedUserInfoClaims === void 0 ? void 0 : requestedUserInfoClaims.length)
                            ? requestedUserInfoClaims
                            : undefined,
                        scopes: scopes,
                        resources: resources,
                        createdAt: new Date(iat * 1000),
                        expiresAt: new Date(exp * 1000),
                    };
                    if (!!(originalRefresh === null || originalRefresh === void 0 ? void 0 : originalRefresh.id)) return [3 /*break*/, 7];
                    return [4 /*yield*/, ctx.context.adapter.create({
                            model: "oauthRefreshToken",
                            data: newRow,
                        })];
                case 5:
                    refreshToken_1 = _h.sent();
                    _b = {
                        id: refreshToken_1.id
                    };
                    return [4 /*yield*/, encodeRefreshToken(opts, token, sessionId)];
                case 6: return [2 /*return*/, (_b.token = _h.sent(),
                        _b)];
                case 7:
                    rotatedAt = new Date(iat * 1000);
                    rotationUpdate = {
                        revoked: rotatedAt,
                        rotatedAt: rotatedAt,
                    };
                    reuseInterval = (_g = opts.refreshTokenReuseInterval) !== null && _g !== void 0 ? _g : 0;
                    if (reuseInterval > 0) {
                        rotationUpdate.rotationReplayExpiresAt = new Date((iat + reuseInterval) * 1000);
                    }
                    return [4 /*yield*/, ctx.context.adapter.incrementOne({
                            model: "oauthRefreshToken",
                            where: [
                                { field: "id", value: originalRefresh.id },
                                { field: "revoked", operator: "eq", value: null },
                            ],
                            increment: {},
                            set: rotationUpdate,
                        })];
                case 8:
                    won = _h.sent();
                    if (!won) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "invalid refresh token",
                            error: "invalid_grant",
                        });
                    }
                    return [4 /*yield*/, ctx.context.adapter.create({
                            model: "oauthRefreshToken",
                            data: newRow,
                        })];
                case 9:
                    refreshToken = _h.sent();
                    _c = {
                        id: refreshToken.id
                    };
                    return [4 /*yield*/, encodeRefreshToken(opts, token, sessionId)];
                case 10: return [2 /*return*/, (_c.token = _h.sent(),
                        _c)];
            }
        });
    });
}
function resolveResourceGrantIssuance(ctx, opts, params) {
    return __awaiter(this, void 0, void 0, function () {
        var resourcePolicy, resourceExpiresAtSeconds, refreshTokenDefaultTtl, refreshTokenTtl;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(ctx, opts, {
                        resource: params.resources,
                        clientId: params.clientId,
                        requestedScopes: params.requestedScopes,
                    })];
                case 1:
                    resourcePolicy = _e.sent();
                    resourceExpiresAtSeconds = resourcePolicy.accessTokenTtl !== null
                        ? params.iat + resourcePolicy.accessTokenTtl
                        : params.scopeExpiresAtSeconds;
                    refreshTokenDefaultTtl = (_a = opts.refreshTokenExpiresIn) !== null && _a !== void 0 ? _a : 2592000;
                    refreshTokenTtl = resourcePolicy.refreshTokenTtl !== null
                        ? Math.min(resourcePolicy.refreshTokenTtl, refreshTokenDefaultTtl)
                        : refreshTokenDefaultTtl;
                    return [2 /*return*/, {
                            audienceClaim: resourcePolicy.audienceClaim,
                            effectiveScopes: resourcePolicy.effectiveScopes,
                            accessTokenExpiresAtSeconds: Math.min(params.scopeExpiresAtSeconds, resourceExpiresAtSeconds),
                            refreshTokenExpiresAtSeconds: params.iat + refreshTokenTtl,
                            refreshResources: (_d = (_c = (_b = params.refreshToken) === null || _b === void 0 ? void 0 : _b.resources) !== null && _c !== void 0 ? _c : params.originalResources) !== null && _d !== void 0 ? _d : params.resources,
                            signingAlgorithm: resourcePolicy.signingAlgorithm,
                            signingKeyId: resourcePolicy.signingKeyId,
                            resourceCustomClaims: resourcePolicy.rawCustomClaims,
                            dpopBoundAccessTokensRequired: resourcePolicy.dpopBoundAccessTokensRequired,
                        }];
            }
        });
    });
}
function throwInvalidDpopProof(errorDescription) {
    throw new api_1.APIError("BAD_REQUEST", {
        error: "invalid_dpop_proof",
        error_description: errorDescription,
    });
}
function clientRequiresDpopBoundAccessTokens(client) {
    var _a;
    var metadata = ((_a = (0, utils_1.parseClientMetadata)(client.metadata)) !== null && _a !== void 0 ? _a : {});
    return (client.dpopBoundAccessTokens === true ||
        metadata.dpop_bound_access_tokens === true);
}
function resolveDpopTokenBinding(ctx, opts, params) {
    return __awaiter(this, void 0, void 0, function () {
        var authCodeDpopJkt, refreshJkt, expectedJkt, dpopProofJwt, dpopRequired, proof, error_3;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    authCodeDpopJkt = (_a = params.verificationValue) === null || _a === void 0 ? void 0 : _a.query.dpop_jkt;
                    refreshJkt = (0, oauth2_1.getConfirmationJkt)((_b = params.refreshToken) === null || _b === void 0 ? void 0 : _b.confirmation);
                    expectedJkt = refreshJkt !== null && refreshJkt !== void 0 ? refreshJkt : authCodeDpopJkt;
                    dpopProofJwt = (0, dpop_1.getDpopProofJwt)(ctx);
                    dpopRequired = clientRequiresDpopBoundAccessTokens(params.client) ||
                        params.grantIssuance.dpopBoundAccessTokensRequired ||
                        !!authCodeDpopJkt ||
                        !!refreshJkt;
                    if (!dpopProofJwt) {
                        if (dpopRequired) {
                            throwInvalidDpopProof("DPoP proof header is required");
                        }
                        return [2 /*return*/, undefined];
                    }
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, oauth2_1.verifyDpopProof)({
                            proofJwt: dpopProofJwt,
                            method: "POST",
                            // The endpoint serving this request: the token endpoint, or a plugin's
                            // own endpoint that issues tokens out-of-grant.
                            url: (0, dpop_1.getEndpointUrl)(ctx, (_c = ctx.path) !== null && _c !== void 0 ? _c : "/oauth2/token"),
                            expectedJkt: expectedJkt,
                            proofMaxAgeSeconds: (_d = opts.dpop) === null || _d === void 0 ? void 0 : _d.proofMaxAgeSeconds,
                            signingAlgorithms: (_e = opts.dpop) === null || _e === void 0 ? void 0 : _e.signingAlgorithms,
                            replayStore: (_f = params.replayStore) !== null && _f !== void 0 ? _f : (0, oauth2_1.createDpopReplayStore)(ctx.context.internalAdapter),
                        })];
                case 2:
                    proof = _g.sent();
                    return [2 /*return*/, { jkt: proof.jkt }];
                case 3:
                    error_3 = _g.sent();
                    if ((0, oauth2_1.isDpopProofError)(error_3)) {
                        throwInvalidDpopProof(error_3.message);
                    }
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Checks the token request's DPoP proof before a one-time code is consumed,
 * under the resource policy issuance applies, so a rejected proof leaves the
 * code for a retry.
 *
 * The proof's `jti` is not recorded yet: call `recordReplay` once the code is
 * consumed, then pass `confirmation` to issuance. Recording it earlier would
 * report the loser of a concurrent redemption as a replayed proof instead of a
 * spent code.
 */
function checkDpopProofBeforeConsume(ctx, opts, params) {
    return __awaiter(this, void 0, void 0, function () {
        var policy, reservation, confirmation;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(ctx, opts, {
                        resource: params.resources,
                        clientId: params.client.clientId,
                        requestedScopes: params.scopes,
                    })];
                case 1:
                    policy = _a.sent();
                    return [4 /*yield*/, resolveDpopTokenBinding(ctx, opts, {
                            client: params.client,
                            grantIssuance: policy,
                            verificationValue: params.verificationValue,
                            replayStore: {
                                reserve: function (pending) {
                                    reservation = pending;
                                    return true;
                                },
                            },
                        })];
                case 2:
                    confirmation = _a.sent();
                    return [2 /*return*/, {
                            confirmation: confirmation,
                            recordReplay: function () { return __awaiter(_this, void 0, void 0, function () {
                                var reserved;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!reservation)
                                                return [2 /*return*/];
                                            return [4 /*yield*/, (0, oauth2_1.createDpopReplayStore)(ctx.context.internalAdapter).reserve(__assign(__assign({}, reservation), { now: new Date() }))];
                                        case 1:
                                            reserved = _a.sent();
                                            if (!reserved) {
                                                throwInvalidDpopProof("DPoP proof jti has already been used");
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        }];
            }
        });
    });
}
function normalizeReplayValues(values) {
    return values ? __spreadArray([], new Set(values), true).sort() : undefined;
}
function sameReplayValues(left, right) {
    var normalizedLeft = normalizeReplayValues(left);
    var normalizedRight = normalizeReplayValues(right);
    if (normalizedLeft === undefined || normalizedRight === undefined) {
        return normalizedLeft === normalizedRight;
    }
    if (normalizedLeft.length !== normalizedRight.length) {
        return false;
    }
    return normalizedLeft.every(function (value, index) { return value === normalizedRight[index]; });
}
function confirmationReplayKey(confirmation) {
    if (!confirmation) {
        return undefined;
    }
    if ("jkt" in confirmation) {
        return "jkt:".concat(confirmation.jkt);
    }
    return "x5t#S256:".concat(confirmation["x5t#S256"]);
}
function sameConfirmation(left, right) {
    return confirmationReplayKey(left) === confirmationReplayKey(right);
}
function isConfirmation(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    var confirmation = value;
    return ((typeof confirmation.jkt === "string" &&
        confirmation["x5t#S256"] === undefined) ||
        (typeof confirmation["x5t#S256"] === "string" &&
            confirmation.jkt === undefined));
}
function isTokenType(value) {
    return value === "Bearer" || value === "DPoP";
}
function isOAuthTokenResponse(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    var response = value;
    return (typeof response.access_token === "string" &&
        typeof response.expires_in === "number" &&
        typeof response.expires_at === "number" &&
        isTokenType(response.token_type) &&
        typeof response.scope === "string" &&
        (response.refresh_token === undefined ||
            typeof response.refresh_token === "string") &&
        (response.id_token === undefined || typeof response.id_token === "string"));
}
function isRefreshTokenRotationReplay(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    var replay = value;
    var request = replay.request;
    return (!!request &&
        Array.isArray(request.effectiveScopes) &&
        request.effectiveScopes.every(function (scope) { return typeof scope === "string"; }) &&
        (request.requestedResources === undefined ||
            (Array.isArray(request.requestedResources) &&
                request.requestedResources.every(function (resource) { return typeof resource === "string"; }))) &&
        (request.confirmation === undefined ||
            isConfirmation(request.confirmation)) &&
        isOAuthTokenResponse(replay.response));
}
function buildRefreshTokenRotationReplayRequest(params) {
    var _a;
    var requestedResources = normalizeReplayValues(params.requestedResources);
    return __assign(__assign({ effectiveScopes: (_a = normalizeReplayValues(params.effectiveScopes)) !== null && _a !== void 0 ? _a : [] }, (requestedResources ? { requestedResources: requestedResources } : {})), (params.confirmation ? { confirmation: params.confirmation } : {}));
}
function sameRefreshTokenRotationReplayRequest(left, right) {
    return (sameReplayValues(left.effectiveScopes, right.effectiveScopes) &&
        sameReplayValues(left.requestedResources, right.requestedResources) &&
        sameConfirmation(left.confirmation, right.confirmation));
}
function encryptRefreshTokenRotationReplay(ctx, replay) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, crypto_1.symmetricEncrypt)({
                    key: ctx.context.secretConfig,
                    data: JSON.stringify(replay),
                })];
        });
    });
}
function decryptRefreshTokenRotationReplay(ctx, value) {
    return __awaiter(this, void 0, void 0, function () {
        var decrypted, parsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, crypto_1.symmetricDecrypt)({
                        key: ctx.context.secretConfig,
                        data: value,
                    })];
                case 1:
                    decrypted = _a.sent();
                    parsed = JSON.parse(decrypted);
                    if (!isRefreshTokenRotationReplay(parsed)) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, parsed];
            }
        });
    });
}
function isWithinRefreshTokenReuseInterval(refreshToken) {
    return (!!refreshToken.rotatedAt &&
        !!refreshToken.rotationReplayExpiresAt &&
        refreshToken.rotationReplayExpiresAt >= new Date());
}
function storeRefreshTokenRotationReplay(ctx, opts, refreshToken, request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        var _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (((_e = opts.refreshTokenReuseInterval) !== null && _e !== void 0 ? _e : 0) <= 0) {
                        return [2 /*return*/];
                    }
                    _b = (_a = ctx.context.adapter).update;
                    _c = {
                        model: "oauthRefreshToken",
                        where: [{ field: "id", value: refreshToken.id }]
                    };
                    _d = {};
                    return [4 /*yield*/, encryptRefreshTokenRotationReplay(ctx, {
                            request: request,
                            response: response,
                        })];
                case 1: return [4 /*yield*/, _b.apply(_a, [(_c.update = (_d.rotationReplayResponse = _f.sent(),
                            _d),
                            _c)])];
                case 2:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getRefreshTokenRotationReplay(ctx, refreshToken, request) {
    return __awaiter(this, void 0, void 0, function () {
        var replay, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isWithinRefreshTokenReuseInterval(refreshToken)) {
                        return [2 /*return*/, undefined];
                    }
                    if (!refreshToken.rotationReplayResponse) {
                        return [2 /*return*/, undefined];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, decryptRefreshTokenRotationReplay(ctx, refreshToken.rotationReplayResponse)];
                case 2:
                    replay = _a.sent();
                    if (!replay ||
                        !sameRefreshTokenRotationReplayRequest(replay.request, request)) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, replay.response];
                case 3:
                    error_4 = _a.sent();
                    ctx.context.logger.error("refresh token rotation replay failed", error_4);
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function resolveRefreshTokenRotationReplayRequest(ctx, opts, params) {
    return __awaiter(this, void 0, void 0, function () {
        var iat, grantIssuance, confirmation;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    iat = Math.floor(Date.now() / 1000);
                    return [4 /*yield*/, resolveResourceGrantIssuance(ctx, opts, {
                            clientId: params.client.clientId,
                            requestedScopes: params.scopes,
                            resources: params.resources,
                            refreshToken: params.refreshToken,
                            iat: iat,
                            scopeExpiresAtSeconds: iat + ((_a = opts.accessTokenExpiresIn) !== null && _a !== void 0 ? _a : 3600),
                        })];
                case 1:
                    grantIssuance = _b.sent();
                    return [4 /*yield*/, resolveDpopTokenBinding(ctx, opts, {
                            client: params.client,
                            grantIssuance: grantIssuance,
                            refreshToken: params.refreshToken,
                        })];
                case 2:
                    confirmation = _b.sent();
                    return [2 /*return*/, buildRefreshTokenRotationReplayRequest({
                            effectiveScopes: grantIssuance.effectiveScopes,
                            requestedResources: params.resources,
                            confirmation: confirmation,
                        })];
            }
        });
    });
}
function replayRefreshTokenRotationResponse(ctx, response) {
    var now = Math.floor(Date.now() / 1000);
    return ctx.json(__assign(__assign({}, response), { expires_in: Math.max(0, response.expires_at - now) }));
}
function createUserTokens(ctx, opts, params) {
    return __awaiter(this, void 0, void 0, function () {
        var client, scopes, user, grantType, referenceId, sessionId, nonce, existingRefreshToken, authTime, verificationValue, iat, baseExpiry, defaultExp, scopeExp, grantIssuance, audienceClaim, effectiveScopes, exp, refreshTokenExp, isRefreshToken, isJwtAccessToken, isIdToken, metadata, additionalIdTokenClaims, _a, _b, customFields, _c, refreshResources, confirmation, _d, requestedUserInfoClaims, earlyRefreshToken, _e, accessTokenClaims, _f, _g, accessToken, refreshToken, idToken, _h, responseBody, error_5;
        var _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    client = params.client, scopes = params.scopes, user = params.user, grantType = params.grantType, referenceId = params.referenceId, sessionId = params.sessionId, nonce = params.nonce, existingRefreshToken = params.refreshToken, authTime = params.authTime, verificationValue = params.verificationValue;
                    iat = Math.floor(Date.now() / 1000);
                    baseExpiry = user
                        ? ((_j = opts.accessTokenExpiresIn) !== null && _j !== void 0 ? _j : 3600)
                        : ((_k = opts.m2mAccessTokenExpiresIn) !== null && _k !== void 0 ? _k : 3600);
                    defaultExp = iat + baseExpiry;
                    scopeExp = opts.scopeExpirations
                        ? scopes
                            .map(function (sc) {
                            var _a;
                            return ((_a = opts.scopeExpirations) === null || _a === void 0 ? void 0 : _a[sc])
                                ? (0, plugins_1.toExpJWT)(opts.scopeExpirations[sc], iat)
                                : defaultExp;
                        })
                            .reduce(function (prev, curr) {
                            return prev < curr ? prev : curr;
                        }, defaultExp)
                        : defaultExp;
                    return [4 /*yield*/, resolveResourceGrantIssuance(ctx, opts, {
                            clientId: client.clientId,
                            requestedScopes: scopes,
                            resources: params.resources,
                            originalResources: params.originalResources,
                            refreshToken: params.refreshToken,
                            iat: iat,
                            scopeExpiresAtSeconds: scopeExp,
                        })];
                case 1:
                    grantIssuance = _s.sent();
                    audienceClaim = grantIssuance.audienceClaim;
                    effectiveScopes = grantIssuance.effectiveScopes;
                    exp = grantIssuance.accessTokenExpiresAtSeconds;
                    refreshTokenExp = grantIssuance.refreshTokenExpiresAtSeconds;
                    isRefreshToken = user &&
                        (0, utils_1.clientAllowsGrant)(client, "refresh_token") &&
                        (((_l = existingRefreshToken === null || existingRefreshToken === void 0 ? void 0 : existingRefreshToken.scopes) === null || _l === void 0 ? void 0 : _l.includes("offline_access")) ||
                            scopes.includes("offline_access"));
                    isJwtAccessToken = true;
                    isIdToken = user && effectiveScopes.includes("openid");
                    metadata = (0, utils_1.parseClientMetadata)(client.metadata);
                    if (!(isIdToken && user)) return [3 /*break*/, 3];
                    _b = [{}];
                    return [4 /*yield*/, (0, extensions_1.collectExtensionIdTokenClaims)(opts, {
                            ctx: ctx,
                            opts: opts,
                            user: user,
                            client: client,
                            scopes: effectiveScopes,
                            grantType: grantType,
                            referenceId: referenceId,
                            sessionId: sessionId,
                            resources: params.resources,
                            metadata: metadata,
                        })];
                case 2:
                    _a = __assign.apply(void 0, [__assign.apply(void 0, _b.concat([(_s.sent())])), ((_m = params.idTokenClaims) !== null && _m !== void 0 ? _m : {})]);
                    return [3 /*break*/, 4];
                case 3:
                    _a = undefined;
                    _s.label = 4;
                case 4:
                    additionalIdTokenClaims = _a;
                    if (!opts.customTokenResponseFields) return [3 /*break*/, 6];
                    return [4 /*yield*/, opts.customTokenResponseFields({
                            grantType: grantType,
                            user: user,
                            scopes: effectiveScopes,
                            metadata: metadata,
                            verificationValue: verificationValue,
                        })];
                case 5:
                    _c = _s.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _c = undefined;
                    _s.label = 7;
                case 7:
                    customFields = _c;
                    refreshResources = grantIssuance.refreshResources;
                    if (!((_o = params.confirmation) !== null && _o !== void 0)) return [3 /*break*/, 8];
                    _d = _o;
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, resolveDpopTokenBinding(ctx, opts, {
                        client: client,
                        grantIssuance: grantIssuance,
                        verificationValue: verificationValue,
                        refreshToken: existingRefreshToken,
                    })];
                case 9:
                    _d = (_s.sent());
                    _s.label = 10;
                case 10:
                    confirmation = _d;
                    requestedUserInfoClaims = (_q = (_p = params.requestedUserInfoClaims) !== null && _p !== void 0 ? _p : existingRefreshToken === null || existingRefreshToken === void 0 ? void 0 : existingRefreshToken.requestedUserInfoClaims) !== null && _q !== void 0 ? _q : [];
                    if (!(isRefreshToken && user && !isJwtAccessToken)) return [3 /*break*/, 12];
                    return [4 /*yield*/, createRefreshToken(ctx, opts, user, referenceId, params.authorizationCodeId, client, effectiveScopes, {
                            iat: iat,
                            exp: refreshTokenExp,
                            sid: sessionId,
                        }, existingRefreshToken, authTime, refreshResources, confirmation, requestedUserInfoClaims)];
                case 11:
                    _e = _s.sent();
                    return [3 /*break*/, 13];
                case 12:
                    _e = undefined;
                    _s.label = 13;
                case 13:
                    earlyRefreshToken = _e;
                    if (!isJwtAccessToken) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, claims_1.resolveAccessTokenClaims)({
                            ctx: ctx,
                            opts: opts,
                            user: user,
                            client: client,
                            scopes: effectiveScopes,
                            grantType: grantType,
                            sessionId: sessionId,
                            resources: params.resources,
                            referenceId: referenceId,
                            metadata: metadata,
                            perRequestClaims: params.accessTokenClaims,
                            resourcePolicyClaims: grantIssuance.resourceCustomClaims,
                        })];
                case 14:
                    _f = _s.sent();
                    return [3 /*break*/, 16];
                case 15:
                    _f = undefined;
                    _s.label = 16;
                case 16:
                    accessTokenClaims = _f;
                    return [4 /*yield*/, Promise.all([
                            isJwtAccessToken
                                ? createJwtAccessToken(ctx, opts, user, client, audienceClaim, effectiveScopes, {
                                    iat: iat,
                                    exp: exp,
                                    sid: sessionId,
                                    signingAlgorithm: grantIssuance.signingAlgorithm,
                                    signingKeyId: grantIssuance.signingKeyId,
                                    accessTokenClaims: accessTokenClaims,
                                    confirmation: confirmation,
                                })
                                : createOpaqueAccessToken(ctx, opts, user, client, effectiveScopes, {
                                    iat: iat,
                                    exp: exp,
                                    sid: sessionId,
                                }, params === null || params === void 0 ? void 0 : params.resources, referenceId, params.authorizationCodeId, earlyRefreshToken === null || earlyRefreshToken === void 0 ? void 0 : earlyRefreshToken.id, confirmation, requestedUserInfoClaims),
                            earlyRefreshToken
                                ? earlyRefreshToken
                                : isRefreshToken && user
                                    ? createRefreshToken(ctx, opts, user, referenceId, params.authorizationCodeId, client, effectiveScopes, {
                                        iat: iat,
                                        exp: refreshTokenExp,
                                        sid: sessionId,
                                    }, existingRefreshToken, authTime, refreshResources, confirmation, requestedUserInfoClaims)
                                    : undefined,
                        ])];
                case 17:
                    _g = _s.sent(), accessToken = _g[0], refreshToken = _g[1];
                    if (!isIdToken) return [3 /*break*/, 19];
                    return [4 /*yield*/, createIdToken(ctx, opts, user, client, effectiveScopes, nonce, sessionId, authTime, accessToken, additionalIdTokenClaims)];
                case 18:
                    _h = _s.sent();
                    return [3 /*break*/, 20];
                case 19:
                    _h = undefined;
                    _s.label = 20;
                case 20:
                    idToken = _h;
                    responseBody = __assign(__assign(__assign({}, customFields), ((_r = params.tokenResponse) !== null && _r !== void 0 ? _r : {})), { access_token: accessToken, expires_in: exp - iat, expires_at: exp, token_type: confirmationTokenType(confirmation), refresh_token: refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.token, scope: effectiveScopes.join(" "), id_token: idToken });
                    if (!((existingRefreshToken === null || existingRefreshToken === void 0 ? void 0 : existingRefreshToken.id) && (refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.id))) return [3 /*break*/, 24];
                    _s.label = 21;
                case 21:
                    _s.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, storeRefreshTokenRotationReplay(ctx, opts, existingRefreshToken, buildRefreshTokenRotationReplayRequest({
                            effectiveScopes: effectiveScopes,
                            requestedResources: params.resources,
                            confirmation: confirmation,
                        }), responseBody)];
                case 22:
                    _s.sent();
                    return [3 /*break*/, 24];
                case 23:
                    error_5 = _s.sent();
                    ctx.context.logger.error("failed to store refresh token rotation replay", error_5);
                    return [3 /*break*/, 24];
                case 24: return [2 /*return*/, ctx.json(responseBody)];
            }
        });
    });
}
/**
 * Rejects an unknown, expired, or already-redeemed authorization code. A code
 * presented after redemption revokes the tokens it issued (RFC 6749 §4.1.2).
 */
function rejectAuthorizationCode(ctx, authorizationCodeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, revokeTokensIssuedForAuthorizationCode(ctx, authorizationCodeId)];
                case 1:
                    _a.sent();
                    throw new api_1.APIError("BAD_REQUEST", {
                        error_description: "invalid code",
                        error: "invalid_grant",
                    });
            }
        });
    });
}
/**
 * Reads and checks the verification value without consuming it. The caller
 * consumes the code only after every request-level check passes, so a rejected
 * verifier, binding, or DPoP proof leaves the code for a retry.
 */
function checkVerificationValue(ctx, opts, code, client_id, redirect_uri, resource) {
    return __awaiter(this, void 0, void 0, function () {
        var authorizationCodeId, verification, rawValue, parsed, verificationValue, boundRedirectUri, storedResources, effectiveResources, requestedSet, authorizedSet, _i, requestedSet_1, r;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, utils_1.storeToken)(opts.storeTokens, code, "authorization_code")];
                case 1:
                    authorizationCodeId = _b.sent();
                    return [4 /*yield*/, ctx.context.internalAdapter.findVerificationValue(authorizationCodeId)];
                case 2:
                    verification = _b.sent();
                    // Secondary storage returns `expiresAt` as a JSON string, so coerce it.
                    if (!verification ||
                        new Date(verification.expiresAt).getTime() < Date.now()) {
                        return [2 /*return*/, rejectAuthorizationCode(ctx, authorizationCodeId)];
                    }
                    try {
                        rawValue = JSON.parse(verification.value);
                    }
                    catch (_c) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "malformed verification value",
                            error: "invalid_grant",
                        });
                    }
                    parsed = zod_1.verificationValueSchema.safeParse(rawValue);
                    if (!parsed.success) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "malformed verification value",
                            error: "invalid_grant",
                        });
                    }
                    verificationValue = parsed.data;
                    if (verificationValue.query.client_id !== client_id) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "invalid client_id",
                            error: "invalid_grant",
                        });
                    }
                    boundRedirectUri = verificationValue.query.redirect_uri;
                    if (boundRedirectUri) {
                        if (!redirect_uri) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error_description: "redirect_uri is required",
                                error: "invalid_request",
                            });
                        }
                        if (boundRedirectUri !== redirect_uri) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                // RFC 6749 §5.2: a redirect_uri that does not match the one bound to
                                // the code is an invalid grant, not a malformed request.
                                error_description: "redirect_uri mismatch",
                                error: "invalid_grant",
                            });
                        }
                    }
                    else if (redirect_uri) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "redirect_uri mismatch",
                            error: "invalid_grant",
                        });
                    }
                    storedResources = (_a = (0, utils_1.toResourceList)(verificationValue.resource)) !== null && _a !== void 0 ? _a : (0, utils_1.toResourceList)(verificationValue.query.resource);
                    effectiveResources = resource !== null && resource !== void 0 ? resource : storedResources;
                    if (resource && storedResources) {
                        requestedSet = new Set(resource);
                        authorizedSet = new Set(storedResources);
                        for (_i = 0, requestedSet_1 = requestedSet; _i < requestedSet_1.length; _i++) {
                            r = requestedSet_1[_i];
                            if (!authorizedSet.has(r)) {
                                throw new api_1.APIError("BAD_REQUEST", {
                                    error_description: "requested resource not authorized",
                                    error: "invalid_target",
                                });
                            }
                        }
                    }
                    return [2 /*return*/, {
                            verificationValue: verificationValue,
                            verificationId: verification.id,
                            effectiveResources: effectiveResources,
                            authorizedResources: storedResources,
                            authorizationCodeId: authorizationCodeId,
                        }];
            }
        });
    });
}
/**
 * Obtains new Session Jwt and Refresh Tokens using a code
 */
function handleAuthorizationCodeGrant(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, _a, client_id, client_secret, preVerified, authMethod, _b, code, code_verifier, redirect_uri, resource, resources, isAuthCodeWithSecret, isAuthCodeWithPkce, client, _c, verificationValue, verificationId, effectiveResources, authorizedResources, authorizationCodeId, scopes, requestedScopes, pkceRequired, pkceUsedInAuth, pkceUsedInToken, challenge, _d, user, session, authTime, requestedUserInfoClaims, dpop, consumed;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, (0, utils_1.extractClientCredentials)(ctx, opts, "".concat(ctx.context.baseURL, "/oauth2/token"))];
                case 1:
                    credentials = _q.sent();
                    _a = (0, utils_1.destructureCredentials)(credentials), client_id = _a.clientId, client_secret = _a.clientSecret, preVerified = _a.preVerified, authMethod = _a.authMethod;
                    _b = ctx.body, code = _b.code, code_verifier = _b.code_verifier, redirect_uri = _b.redirect_uri, resource = _b.resource;
                    resources = (0, utils_1.toResourceList)(resource);
                    if (!client_id) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "client_id is required",
                            error: "invalid_request",
                        });
                    }
                    if (!code) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "code is required",
                            error: "invalid_request",
                        });
                    }
                    isAuthCodeWithSecret = client_id && client_secret;
                    isAuthCodeWithPkce = client_id && code && code_verifier;
                    if (!isAuthCodeWithSecret && !isAuthCodeWithPkce && !preVerified) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "Either code_verifier or client_secret is required",
                            error: "invalid_request",
                        });
                    }
                    return [4 /*yield*/, (0, utils_1.validateClientCredentials)(ctx, opts, client_id, client_secret, undefined, preVerified, "authorization_code", authMethod)];
                case 2:
                    client = _q.sent();
                    return [4 /*yield*/, checkVerificationValue(ctx, opts, code, client_id, redirect_uri, resources)];
                case 3:
                    _c = _q.sent(), verificationValue = _c.verificationValue, verificationId = _c.verificationId, effectiveResources = _c.effectiveResources, authorizedResources = _c.authorizedResources, authorizationCodeId = _c.authorizationCodeId;
                    scopes = (_e = verificationValue.query.scope) === null || _e === void 0 ? void 0 : _e.split(" ");
                    if (!scopes) {
                        throw new api_1.APIError("INTERNAL_SERVER_ERROR", {
                            error_description: "verification scope unset",
                            error: "invalid_scope",
                        });
                    }
                    (0, utils_1.validateClientScopes)(client, scopes);
                    requestedScopes = ((_g = (_f = verificationValue.query) === null || _f === void 0 ? void 0 : _f.scope) === null || _g === void 0 ? void 0 : _g.split(" ")) || [];
                    pkceRequired = (0, utils_1.isPKCERequired)(client, {
                        scopes: requestedScopes,
                        nonce: (_h = verificationValue.query) === null || _h === void 0 ? void 0 : _h.nonce,
                    });
                    // Validate credentials based on requirements
                    if (pkceRequired) {
                        // PKCE is required - must have code_verifier
                        if (!isAuthCodeWithPkce) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error_description: "PKCE is required for this client",
                                error: "invalid_request",
                            });
                        }
                    }
                    else {
                        // PKCE is optional - must have either PKCE, client_secret, or client_assertion
                        if (!(isAuthCodeWithPkce || isAuthCodeWithSecret || preVerified)) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error_description: "Either PKCE (code_verifier) or client authentication (client_secret or client_assertion) is required",
                                error: "invalid_request",
                            });
                        }
                    }
                    pkceUsedInAuth = !!((_j = verificationValue.query) === null || _j === void 0 ? void 0 : _j.code_challenge);
                    pkceUsedInToken = !!code_verifier;
                    if (!(pkceUsedInAuth || pkceUsedInToken)) return [3 /*break*/, 7];
                    // PKCE was used - must verify consistency
                    if (pkceUsedInAuth && !pkceUsedInToken) {
                        // PKCE was used in authorization but not in token exchange
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "code_verifier required because PKCE was used in authorization",
                            error: "invalid_request",
                        });
                    }
                    if (!pkceUsedInAuth && pkceUsedInToken) {
                        // PKCE was not used in authorization but verifier provided
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "code_verifier provided but PKCE was not used in authorization",
                            error: "invalid_request",
                        });
                    }
                    if (!(((_k = verificationValue.query) === null || _k === void 0 ? void 0 : _k.code_challenge_method) === "S256")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, oauth2_1.generateCodeChallenge)(code_verifier)];
                case 4:
                    _d = _q.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _d = undefined;
                    _q.label = 6;
                case 6:
                    challenge = _d;
                    if (challenge !== ((_l = verificationValue.query) === null || _l === void 0 ? void 0 : _l.code_challenge)) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "code verification failed",
                            error: "invalid_grant",
                        });
                    }
                    _q.label = 7;
                case 7:
                    /** Get user */
                    if (!verificationValue.userId) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "missing user, user may have been deleted",
                            error: "invalid_user",
                        });
                    }
                    return [4 /*yield*/, ctx.context.internalAdapter.findUserById(verificationValue.userId)];
                case 8:
                    user = _q.sent();
                    if (!user) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "missing user, user may have been deleted",
                            error: "invalid_user",
                        });
                    }
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: "session",
                            where: [
                                {
                                    field: "id",
                                    value: verificationValue.sessionId,
                                },
                            ],
                        })];
                case 9:
                    session = _q.sent();
                    if (!session || session.expiresAt < new Date()) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "session no longer exists",
                            error: "invalid_request",
                        });
                    }
                    authTime = verificationValue.authTime != null
                        ? (0, utils_1.normalizeTimestampValue)(verificationValue.authTime)
                        : (0, utils_1.resolveSessionAuthTime)(session);
                    requestedUserInfoClaims = (0, claims_request_1.getRequestedUserInfoClaims)(verificationValue.query.claims, (0, standard_claims_1.getSupportedClaims)(opts));
                    return [4 /*yield*/, checkDpopProofBeforeConsume(ctx, opts, {
                            client: client,
                            scopes: scopes,
                            resources: effectiveResources,
                            verificationValue: verificationValue,
                        })];
                case 10:
                    dpop = _q.sent();
                    return [4 /*yield*/, ctx.context.internalAdapter.consumeVerificationValue(authorizationCodeId)];
                case 11:
                    consumed = _q.sent();
                    if (!consumed || consumed.id !== verificationId) {
                        return [2 /*return*/, rejectAuthorizationCode(ctx, authorizationCodeId)];
                    }
                    return [4 /*yield*/, dpop.recordReplay()];
                case 12:
                    _q.sent();
                    return [2 /*return*/, createUserTokens(ctx, opts, {
                            client: client,
                            scopes: (_o = (_m = verificationValue.query.scope) === null || _m === void 0 ? void 0 : _m.split(" ")) !== null && _o !== void 0 ? _o : [],
                            user: user,
                            grantType: "authorization_code",
                            referenceId: verificationValue.referenceId,
                            sessionId: session.id,
                            nonce: (_p = verificationValue.query) === null || _p === void 0 ? void 0 : _p.nonce,
                            authTime: authTime,
                            verificationValue: verificationValue,
                            authorizationCodeId: authorizationCodeId,
                            requestedUserInfoClaims: requestedUserInfoClaims,
                            resources: effectiveResources,
                            originalResources: authorizedResources,
                            confirmation: dpop.confirmation,
                        })];
            }
        });
    });
}
/**
 * Grant that allows direct access to an API using the application's credentials
 * This grant is for M2M so the concept of a user id does not exist on the token.
 *
 * MUST follow https://datatracker.ietf.org/doc/html/rfc6749#section-4.4
 */
function handleClientCredentialsGrant(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, _a, client_id, client_secret, preVerified, authMethod, _b, scope, resource, resources, client, clientCredentialsScopes, requestedScopes, validScopes_1, invalidScopes;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, utils_1.extractClientCredentials)(ctx, opts, "".concat(ctx.context.baseURL, "/oauth2/token"))];
                case 1:
                    credentials = _c.sent();
                    _a = (0, utils_1.destructureCredentials)(credentials), client_id = _a.clientId, client_secret = _a.clientSecret, preVerified = _a.preVerified, authMethod = _a.authMethod;
                    _b = ctx.body, scope = _b.scope, resource = _b.resource;
                    resources = (0, utils_1.toResourceList)(resource);
                    if (!client_id) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "Missing required client_id",
                            error: "invalid_request",
                        });
                    }
                    return [4 /*yield*/, (0, utils_1.validateClientCredentials)(ctx, opts, client_id, client_secret, undefined, preVerified, "client_credentials", authMethod)];
                case 2:
                    client = _c.sent();
                    if (client.tokenEndpointAuthMethod === "none") {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "public clients cannot use the client_credentials grant",
                            error: "unauthorized_client",
                        });
                    }
                    clientCredentialsScopes = client.clientCredentialsScopes;
                    if (!(clientCredentialsScopes === null || clientCredentialsScopes === void 0 ? void 0 : clientCredentialsScopes.length)) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "client has no authorized client_credentials scopes",
                            error: "unauthorized_client",
                        });
                    }
                    requestedScopes = scope === null || scope === void 0 ? void 0 : scope.split(" ");
                    if (requestedScopes) {
                        validScopes_1 = new Set(clientCredentialsScopes);
                        invalidScopes = requestedScopes.filter(function (scope) {
                            return !validScopes_1.has(scope) || (0, client_credentials_1.isUserDelegatedScope)(scope);
                        });
                        if (invalidScopes.length) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error_description: "The following scopes are invalid: ".concat(invalidScopes.join(", ")),
                                error: "invalid_scope",
                            });
                        }
                    }
                    // The server-owned client_credentials ceiling is also the omitted-scope
                    // default. User-delegated client scopes never authorize machine access.
                    if (!requestedScopes) {
                        requestedScopes = __spreadArray([], clientCredentialsScopes, true);
                    }
                    return [2 /*return*/, createUserTokens(ctx, opts, {
                            client: client,
                            scopes: requestedScopes,
                            grantType: "client_credentials",
                            resources: resources,
                        })];
            }
        });
    });
}
/**
 * Obtains new Session Jwt and Refresh Tokens using a refresh token
 *
 * Refresh tokens will only allow the same or lesser scopes as the initial authorize request.
 * To add scopes, you must restart the authorize process again.
 */
function handleRefreshTokenGrant(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, _a, client_id, client_secret, preVerified, authMethod, _b, refresh_token, scope, resource, resources, client, decodedRefresh, refreshToken, _c, _d, scopes, requestedScopes, validScopes, _i, requestedScopes_1, requestedScope, replayRequest, replay, user, authTime;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, utils_1.extractClientCredentials)(ctx, opts, "".concat(ctx.context.baseURL, "/oauth2/token"))];
                case 1:
                    credentials = _g.sent();
                    _a = (0, utils_1.destructureCredentials)(credentials), client_id = _a.clientId, client_secret = _a.clientSecret, preVerified = _a.preVerified, authMethod = _a.authMethod;
                    _b = ctx.body, refresh_token = _b.refresh_token, scope = _b.scope, resource = _b.resource;
                    resources = (0, utils_1.toResourceList)(resource);
                    if (!client_id) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "Missing required client_id",
                            error: "invalid_request",
                        });
                    }
                    if (!refresh_token) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "Missing a required refresh_token for refresh_token grant",
                            error: "invalid_request",
                        });
                    }
                    return [4 /*yield*/, (0, utils_1.validateClientCredentials)(ctx, opts, client_id, client_secret, // Optional for refresh_grant but required on confidential clients
                        undefined, preVerified, "refresh_token", authMethod)];
                case 2:
                    client = _g.sent();
                    return [4 /*yield*/, decodeRefreshToken(opts, refresh_token)];
                case 3:
                    decodedRefresh = _g.sent();
                    _d = (_c = ctx.context.adapter).findOne;
                    _e = {
                        model: "oauthRefreshToken"
                    };
                    _f = {
                        field: "token"
                    };
                    return [4 /*yield*/, (0, utils_1.getStoredToken)(opts.storeTokens, decodedRefresh.token, "refresh_token")];
                case 4: return [4 /*yield*/, _d.apply(_c, [(_e.where = [
                            (_f.value = _g.sent(),
                                _f)
                        ],
                            _e)])];
                case 5:
                    refreshToken = _g.sent();
                    // Check refresh
                    if (!refreshToken) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "session not found",
                            error: "invalid_grant",
                        });
                    }
                    if (refreshToken.clientId !== client_id) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "invalid refresh token",
                            error: "invalid_grant",
                        });
                    }
                    if (refreshToken.expiresAt < new Date()) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "invalid refresh token",
                            error: "invalid_grant",
                        });
                    }
                    // Check body resources against refresh token resources
                    if (resources &&
                        refreshToken.resources &&
                        !resources.every(function (v) { var _a; return (_a = refreshToken.resources) === null || _a === void 0 ? void 0 : _a.includes(v); })) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "requested resource invalid",
                            error: "invalid_target",
                        });
                    }
                    scopes = refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.scopes;
                    requestedScopes = scope === null || scope === void 0 ? void 0 : scope.split(" ");
                    if (requestedScopes) {
                        validScopes = new Set(scopes);
                        for (_i = 0, requestedScopes_1 = requestedScopes; _i < requestedScopes_1.length; _i++) {
                            requestedScope = requestedScopes_1[_i];
                            if (!validScopes.has(requestedScope)) {
                                throw new api_1.APIError("BAD_REQUEST", {
                                    error_description: "unable to issue scope ".concat(requestedScope),
                                    error: "invalid_scope",
                                });
                            }
                        }
                    }
                    (0, utils_1.validateClientScopes)(client, requestedScopes !== null && requestedScopes !== void 0 ? requestedScopes : scopes);
                    if (!refreshToken.revoked) return [3 /*break*/, 10];
                    if (!isWithinRefreshTokenReuseInterval(refreshToken)) return [3 /*break*/, 8];
                    return [4 /*yield*/, resolveRefreshTokenRotationReplayRequest(ctx, opts, {
                            client: client,
                            refreshToken: refreshToken,
                            scopes: requestedScopes !== null && requestedScopes !== void 0 ? requestedScopes : scopes,
                            resources: resources !== null && resources !== void 0 ? resources : refreshToken.resources,
                        })];
                case 6:
                    replayRequest = _g.sent();
                    return [4 /*yield*/, getRefreshTokenRotationReplay(ctx, refreshToken, replayRequest)];
                case 7:
                    replay = _g.sent();
                    if (replay) {
                        return [2 /*return*/, replayRefreshTokenRotationResponse(ctx, replay)];
                    }
                    throw new api_1.APIError("BAD_REQUEST", {
                        error_description: "invalid refresh token",
                        error: "invalid_grant",
                    });
                case 8: return [4 /*yield*/, invalidateRefreshFamily(ctx, client_id, refreshToken.userId)];
                case 9:
                    _g.sent();
                    throw new api_1.APIError("BAD_REQUEST", {
                        error_description: "invalid refresh token",
                        error: "invalid_grant",
                    });
                case 10: return [4 /*yield*/, ctx.context.internalAdapter.findUserById(refreshToken.userId)];
                case 11:
                    user = _g.sent();
                    if (!user) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "user not found",
                            error: "invalid_request",
                        });
                    }
                    authTime = refreshToken.authTime != null
                        ? (0, utils_1.normalizeTimestampValue)(refreshToken.authTime)
                        : undefined;
                    // Generate new tokens
                    return [2 /*return*/, createUserTokens(ctx, opts, {
                            client: client,
                            scopes: requestedScopes !== null && requestedScopes !== void 0 ? requestedScopes : scopes,
                            user: user,
                            grantType: "refresh_token",
                            referenceId: refreshToken.referenceId,
                            authorizationCodeId: refreshToken.authorizationCodeId,
                            sessionId: refreshToken.sessionId,
                            refreshToken: refreshToken,
                            resources: resources !== null && resources !== void 0 ? resources : refreshToken.resources,
                            authTime: authTime,
                            requestedUserInfoClaims: refreshToken.requestedUserInfoClaims,
                        })];
            }
        });
    });
}
