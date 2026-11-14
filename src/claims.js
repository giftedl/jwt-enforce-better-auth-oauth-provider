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
exports.resolveAccessTokenClaims = resolveAccessTokenClaims;
var env_1 = require("@better-auth/core/env");
var extensions_1 = require("./extensions");
/**
 * Claim names the authorization server owns on a JWT access token, which no
 * claim source (the `customAccessTokenClaims` plugin option, an extension
 * contributor, or a resource row's `customClaims`) may override. The AS is the
 * only source of truth for issuer identity, subject, audience, lifetime, scope,
 * authentication context, the token's stable ID, and its sender-constraint
 * (`cnf`).
 *
 * @see RFC 9068 §2.2 (registered access-token claims)
 * @see RFC 7800 / RFC 9449 §6 (`cnf` confirmation — the token's bound key)
 */
var RESERVED_ACCESS_TOKEN_CLAIMS = new Set([
    "iss",
    "sub",
    "aud",
    "exp",
    "iat",
    "jti",
    "client_id",
    "scope",
    "auth_time",
    "acr",
    "amr",
    "cnf",
]);
/**
 * Returns a copy of `claims` with reserved AS-owned names removed. Emits a
 * `warn` naming the stripped keys when any were present (never silently
 * dropped: surfacing the override attempt matters more than minimizing log
 * noise). Stable iteration order (`Object.entries`) is preserved so token-debug
 * logs stay reproducible across runs.
 */
function stripReservedClaims(claims) {
    if (!claims)
        return {};
    var stripped = [];
    var safe = {};
    for (var _i = 0, _a = Object.entries(claims); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (RESERVED_ACCESS_TOKEN_CLAIMS.has(key)) {
            stripped.push(key);
            continue;
        }
        safe[key] = value;
    }
    if (stripped.length > 0) {
        env_1.logger.warn("oauth-provider: stripped reserved access-token claim name(s): ".concat(stripped.join(", "), ". The AS owns these claim values."));
    }
    return safe;
}
/**
 * The single authority for the enriched (non-AS-owned) claim set an access
 * token carries. Both the JWT mint and the opaque-token introspection
 * re-derive path call this function, so the two formats cannot drift, and
 * reserved RFC 9068 names are stripped unconditionally here so no caller can
 * forget to.
 *
 * Precedence, lowest to highest: extension contributors < per-issuance
 * `accessTokenClaims` < plugin `customAccessTokenClaims` < per-resource
 * `customClaims`. Reserved names are removed from the merged result.
 *
 * Returns only the enriched claims; the caller stamps the AS-owned claims
 * (`iss`/`sub`/`aud`/`exp`/`iat`/`jti`/`client_id`/`scope`/...) itself, so they
 * always win.
 */
function resolveAccessTokenClaims(input) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, opts, user, client, scopes, resources, referenceId, metadata, grantType, sessionId, perRequestClaims, resourcePolicyClaims, extensionClaims, pluginClaims, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ctx = input.ctx, opts = input.opts, user = input.user, client = input.client, scopes = input.scopes, resources = input.resources, referenceId = input.referenceId, metadata = input.metadata, grantType = input.grantType, sessionId = input.sessionId, perRequestClaims = input.perRequestClaims, resourcePolicyClaims = input.resourcePolicyClaims;
                    return [4 /*yield*/, (0, extensions_1.collectExtensionAccessTokenClaims)(opts, {
                            ctx: ctx,
                            opts: opts,
                            user: user,
                            client: client,
                            scopes: scopes,
                            grantType: grantType,
                            referenceId: referenceId,
                            sessionId: sessionId,
                            resources: resources,
                            metadata: metadata,
                        })];
                case 1:
                    extensionClaims = _b.sent();
                    if (!opts.customAccessTokenClaims) return [3 /*break*/, 3];
                    return [4 /*yield*/, opts.customAccessTokenClaims({
                            user: user,
                            scopes: scopes,
                            resources: resources,
                            referenceId: referenceId,
                            metadata: metadata,
                        })];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = {};
                    _b.label = 4;
                case 4:
                    pluginClaims = _a;
                    return [2 /*return*/, stripReservedClaims(__assign(__assign(__assign(__assign({}, extensionClaims), (perRequestClaims !== null && perRequestClaims !== void 0 ? perRequestClaims : {})), pluginClaims), resourcePolicyClaims))];
            }
        });
    });
}
