"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEVEL_0_ACR = void 0;
exports.stripReservedIdTokenClaims = stripReservedIdTokenClaims;
var env_1 = require("@better-auth/core/env");
/**
 * OIDC Core Authentication Context Class Reference for authentication that
 * does not meet ISO/IEC 29115 level 1.
 *
 * Better Auth does not currently evaluate a stronger ACR policy, so discovery
 * and ID tokens must not claim an assurance profile such as InCommon bronze.
 */
exports.LEVEL_0_ACR = "0";
var RESERVED_ID_TOKEN_CLAIMS = new Set([
    "iss",
    "sub",
    "aud",
    "exp",
    "nbf",
    "iat",
    "jti",
    "auth_time",
    "nonce",
    "acr",
    "amr",
    "azp",
    "sid",
    "at_hash",
    "c_hash",
    "s_hash",
]);
/**
 * Removes provider-owned ID token claim names from custom claims.
 *
 * `customIdTokenClaims` is an extension point for additional claims. It must not
 * replace the issuer, subject, audience, lifetime, nonce, authorized party,
 * token-binding hashes, session binding, or authentication context that the
 * provider owns.
 */
function stripReservedIdTokenClaims(claims) {
    if (!claims)
        return {};
    var stripped = [];
    var safeClaims = Object.create(null);
    for (var _i = 0, _a = Object.entries(claims); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (RESERVED_ID_TOKEN_CLAIMS.has(key)) {
            stripped.push(key);
            continue;
        }
        safeClaims[key] = value;
    }
    if (stripped.length > 0) {
        env_1.logger.warn("oauth-provider: stripped reserved id-token claim name(s): ".concat(stripped.join(", "), ". The AS owns these claim values."));
    }
    return safeClaims;
}
