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
exports.pickClaims = pickClaims;
exports.userInfoEndpoint = userInfoEndpoint;
var api_1 = require("better-auth/api");
var oauth2_1 = require("better-auth/oauth2");
var dpop_1 = require("./dpop");
var extensions_1 = require("./extensions");
var introspect_1 = require("./introspect");
var resource_challenge_1 = require("./resource-challenge");
var standard_claims_1 = require("./standard-claims");
var utils_1 = require("./utils");
/**
 * Builds the standard OIDC claims (OIDC Core §5.1) for the UserInfo response.
 *
 * A claim is included when its backing scope was granted, or when it was named
 * individually through the `claims.userinfo` request parameter (§5.4, §5.5).
 * `sub` is always present. Values come from the one claim registry, so the
 * advertisement, the scope mapping, and the resolution cannot drift apart.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#NormalClaims
 */
function userNormalClaims(user, scopes, requestedClaims) {
    var _a;
    if (requestedClaims === void 0) { requestedClaims = []; }
    var requested = new Set(requestedClaims);
    var claims = { sub: (_a = user.id) !== null && _a !== void 0 ? _a : undefined };
    for (var _i = 0, _b = Object.entries(standard_claims_1.STANDARD_CLAIMS); _i < _b.length; _i++) {
        var _c = _b[_i], name_1 = _c[0], definition = _c[1];
        if (scopes.includes(definition.scope) || requested.has(name_1)) {
            claims[name_1] = definition.resolve(user);
        }
    }
    return claims;
}
/**
 * Returns the defined-valued entries of `claims`, dropping any key already
 * present in `base` when given.
 *
 * This is the two-tier claim authority shared by the /userinfo response and the
 * ID token:
 * - Called WITH `base` (the provider's own claims): the additive rule for
 *   third-party extension claims. A contributor may add new keys but never
 *   replace a claim the provider already owns.
 * - Called WITHOUT `base`: the deliberate first-party override path for the
 *   operator's own `customUserInfoClaims` / `customIdTokenClaims`, which is
 *   trusted to override identity claims (for example a formatted `name`). The
 *   caller re-pins `sub` afterwards, so subject integrity holds either way
 *   (OIDC Core §5.3.2: UserInfo `sub` MUST match the ID Token `sub`).
 */
function pickClaims(claims, base) {
    var next = {};
    for (var _i = 0, _a = Object.entries(claims !== null && claims !== void 0 ? claims : {}); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value === undefined)
            continue;
        if (base && key in base)
            continue;
        next[key] = value;
    }
    return next;
}
function getUserInfoAccessToken(ctx) {
    var _a, _b, _c, _d;
    var authorization = (_a = ctx.headers) === null || _a === void 0 ? void 0 : _a.get("authorization");
    var headerAccessTokenAuthorization = (0, oauth2_1.parseAccessTokenAuthorization)(authorization);
    var bodyToken = ((_b = ctx.request) === null || _b === void 0 ? void 0 : _b.method) === "POST"
        ? ((_d = (_c = ctx.body) === null || _c === void 0 ? void 0 : _c.access_token) !== null && _d !== void 0 ? _d : undefined)
        : undefined;
    if (headerAccessTokenAuthorization && bodyToken) {
        throw new api_1.APIError("BAD_REQUEST", {
            error_description: "Multiple access token transport methods are not allowed",
            error: "invalid_request",
        });
    }
    var bodyAccessTokenAuthorization = bodyToken
        ? { scheme: "Bearer", token: bodyToken }
        : undefined;
    var accessTokenAuthorization = headerAccessTokenAuthorization !== null && headerAccessTokenAuthorization !== void 0 ? headerAccessTokenAuthorization : bodyAccessTokenAuthorization;
    return {
        authorization: accessTokenAuthorization,
        token: accessTokenAuthorization === null || accessTokenAuthorization === void 0 ? void 0 : accessTokenAuthorization.token,
    };
}
/**
 * The exposed-header list with `WWW-Authenticate` added. Before hooks write to
 * the dispatch's `ctx.context.responseHeaders`, which the endpoint's own
 * `ctx.responseHeaders` does not include, and an error's header replaces the
 * value they accumulated, so both lists are kept here.
 */
function exposeChallengeHeader(ctx) {
    var scoped = ctx;
    var names = [scoped.context.responseHeaders, ctx.responseHeaders].flatMap(function (headers) { var _a, _b; return (_b = (_a = headers === null || headers === void 0 ? void 0 : headers.get("access-control-expose-headers")) === null || _a === void 0 ? void 0 : _a.split(",")) !== null && _b !== void 0 ? _b : []; });
    return dpop_1.withExposedHeaders.apply(void 0, __spreadArray(__spreadArray([undefined], names.map(function (name) { return name.trim(); }).filter(Boolean), false), ["WWW-Authenticate"], false));
}
/**
 * A 401 carrying `challenge`, which browsers hide from cross-origin clients
 * unless it is exposed.
 */
function unauthorized(ctx, body, challenge) {
    return new api_1.APIError("UNAUTHORIZED", body, {
        "WWW-Authenticate": challenge,
        "Access-Control-Expose-Headers": exposeChallengeHeader(ctx),
    });
}
function dpopUnauthorized(ctx, opts, error, description) {
    var _a;
    return unauthorized(ctx, { error: error, error_description: description }, (0, resource_challenge_1.buildDpopChallengeValue)(error, description, (_a = opts.dpop) === null || _a === void 0 ? void 0 : _a.signingAlgorithms));
}
/**
 * Handles the /oauth2/userinfo endpoint.
 *
 * Every 401 carries a challenge (RFC 7235 §3.1): `DPoP` with the accepted
 * proof algorithms (RFC 9449 §7.1) when the token is DPoP-bound or the request
 * used the DPoP scheme, otherwise `Bearer` (RFC 6750 §3). A request without a
 * token is offered both schemes.
 */
function userInfoEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var accessTokenAuthorization, algorithms, usesDpopScheme, validated, error_1, body, code, description, jwt, requestedClaims, error_2, scopes, user, baseUserClaims, clientId, client, _a, _b, extensionUserClaims, _c, additionalInfoUserClaims, _d;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    accessTokenAuthorization = getUserInfoAccessToken(ctx).authorization;
                    if (!(accessTokenAuthorization === null || accessTokenAuthorization === void 0 ? void 0 : accessTokenAuthorization.token)) {
                        algorithms = (_f = (_e = opts.dpop) === null || _e === void 0 ? void 0 : _e.signingAlgorithms) !== null && _f !== void 0 ? _f : oauth2_1.DPOP_SIGNING_ALGORITHMS;
                        throw unauthorized(ctx, { error_description: "access token not found", error: "invalid_request" }, "Bearer, DPoP algs=\"".concat(algorithms.join(" "), "\""));
                    }
                    usesDpopScheme = accessTokenAuthorization.scheme === "DPoP";
                    _r.label = 1;
                case 1:
                    _r.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, introspect_1.requireActiveAccessTokenWithClaims)(ctx, opts, accessTokenAuthorization.token)];
                case 2:
                    validated = _r.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _r.sent();
                    if ((0, api_1.isAPIError)(error_1) && error_1.status === "UNAUTHORIZED") {
                        body = error_1.body;
                        code = (_g = body === null || body === void 0 ? void 0 : body.error) !== null && _g !== void 0 ? _g : "invalid_token";
                        description = (_h = body === null || body === void 0 ? void 0 : body.error_description) !== null && _h !== void 0 ? _h : error_1.message;
                        if (usesDpopScheme) {
                            throw dpopUnauthorized(ctx, opts, code, description);
                        }
                        throw unauthorized(ctx, { error: code, error_description: description }, (_j = new Headers(error_1.headers).get("WWW-Authenticate")) !== null && _j !== void 0 ? _j : "Bearer error=\"invalid_token\"");
                    }
                    throw error_1;
                case 4:
                    jwt = validated.payload, requestedClaims = validated.requestedUserInfoClaims;
                    // The DPoP `htm` check needs the real request method. Without a `ctx.request`
                    // (a programmatic `auth.api` call) the sender-constraint cannot be verified,
                    // so fail closed for a DPoP-bound token rather than assume "GET".
                    if ((0, oauth2_1.getDpopJktFromPayload)(jwt) && !ctx.request) {
                        throw dpopUnauthorized(ctx, opts, "invalid_token", "DPoP-bound access token requires an HTTP request context");
                    }
                    _r.label = 5;
                case 5:
                    _r.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, oauth2_1.enforceDpopBinding)({
                            payload: jwt,
                            authorization: accessTokenAuthorization,
                            proofJwt: (0, dpop_1.getDpopProofJwt)(ctx),
                            method: (_l = (_k = ctx.request) === null || _k === void 0 ? void 0 : _k.method) !== null && _l !== void 0 ? _l : "GET",
                            url: (0, dpop_1.getEndpointUrl)(ctx, "/oauth2/userinfo"),
                            proofMaxAgeSeconds: (_m = opts.dpop) === null || _m === void 0 ? void 0 : _m.proofMaxAgeSeconds,
                            signingAlgorithms: (_o = opts.dpop) === null || _o === void 0 ? void 0 : _o.signingAlgorithms,
                            replayStore: (0, oauth2_1.createDpopReplayStore)(ctx.context.internalAdapter),
                        })];
                case 6:
                    _r.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _r.sent();
                    // Every binding failure means the token is DPoP-bound or the request
                    // used the DPoP scheme, so it is challenged with DPoP.
                    if ((0, oauth2_1.isDpopBindingError)(error_2)) {
                        throw dpopUnauthorized(ctx, opts, error_2.code, error_2.message);
                    }
                    throw error_2;
                case 8:
                    scopes = (_p = jwt.scope) === null || _p === void 0 ? void 0 : _p.split(" ");
                    if (!(scopes === null || scopes === void 0 ? void 0 : scopes.includes("openid"))) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "Missing required scope",
                            error: "invalid_scope",
                        });
                    }
                    if (!jwt.sub) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "user not found",
                            error: "invalid_request",
                        });
                    }
                    return [4 /*yield*/, ctx.context.internalAdapter.findUserById(jwt.sub)];
                case 9:
                    user = _r.sent();
                    if (!user) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "user not found",
                            error: "invalid_request",
                        });
                    }
                    baseUserClaims = userNormalClaims(user, scopes !== null && scopes !== void 0 ? scopes : [], requestedClaims);
                    clientId = ((_q = jwt.client_id) !== null && _q !== void 0 ? _q : jwt.azp);
                    if (!(clientId && (opts.pairwiseSecret || (0, extensions_1.hasUserInfoClaimExtension)(opts)))) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, clientId)];
                case 10:
                    _a = _r.sent();
                    return [3 /*break*/, 12];
                case 11:
                    _a = undefined;
                    _r.label = 12;
                case 12:
                    client = _a;
                    if (!(opts.pairwiseSecret && client)) return [3 /*break*/, 14];
                    _b = baseUserClaims;
                    return [4 /*yield*/, (0, utils_1.resolveSubjectIdentifier)(user.id, client, opts)];
                case 13:
                    _b.sub = _r.sent();
                    _r.label = 14;
                case 14:
                    if (!(scopes === null || scopes === void 0 ? void 0 : scopes.length)) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, extensions_1.collectExtensionUserInfoClaims)(opts, {
                            ctx: ctx,
                            opts: opts,
                            user: user,
                            scopes: scopes,
                            jwt: jwt,
                            client: client !== null && client !== void 0 ? client : undefined,
                            requestedClaims: requestedClaims,
                        })];
                case 15:
                    _c = _r.sent();
                    return [3 /*break*/, 17];
                case 16:
                    _c = {};
                    _r.label = 17;
                case 17:
                    extensionUserClaims = _c;
                    if (!(opts.customUserInfoClaims && (scopes === null || scopes === void 0 ? void 0 : scopes.length))) return [3 /*break*/, 19];
                    return [4 /*yield*/, opts.customUserInfoClaims({
                            user: user,
                            scopes: scopes,
                            jwt: jwt,
                            requestedClaims: requestedClaims,
                        })];
                case 18:
                    _d = _r.sent();
                    return [3 /*break*/, 20];
                case 19:
                    _d = {};
                    _r.label = 20;
                case 20:
                    additionalInfoUserClaims = _d;
                    return [2 /*return*/, __assign(__assign(__assign(__assign({}, baseUserClaims), pickClaims(extensionUserClaims, baseUserClaims)), pickClaims(additionalInfoUserClaims)), { sub: baseUserClaims.sub })];
            }
        });
    });
}
