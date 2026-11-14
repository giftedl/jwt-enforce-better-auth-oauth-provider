"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_CLAIM_NAMES = exports.STANDARD_CLAIMS = void 0;
exports.getSupportedClaims = getSupportedClaims;
function splitDisplayName(name) {
    var parts = name.split(" ").filter(function (part) { return part !== ""; });
    if (parts.length <= 1)
        return {};
    return { given: parts.slice(0, -1).join(" "), family: parts.at(-1) };
}
/**
 * The OIDC Standard Claims (OIDC Core §5.1) that Better Auth resolves from its
 * own user model, each paired with the scope that requests it (§5.4).
 *
 * This is the single source for UserInfo scope-claim resolution, individual
 * `claims.userinfo` resolution, the discovery `claims_supported` advertisement,
 * and the bound on requested claim names. Adding a standard claim Better Auth
 * can resolve means adding one entry here, not editing UserInfo, the metadata,
 * and the plugin init separately.
 *
 * These claims are delivered only at the UserInfo endpoint, never the ID token:
 * the authorization code flow always issues an access token, so §5.4 routes
 * scope-requested claims to UserInfo. Deployments that support further standard
 * profile claims (such as `birthdate` or `zoneinfo`) supply them through
 * `customUserInfoClaims` and advertise them in `claims_supported`.
 */
exports.STANDARD_CLAIMS = {
    name: { scope: "profile", resolve: function (user) { var _a; return (_a = user.name) !== null && _a !== void 0 ? _a : undefined; } },
    picture: { scope: "profile", resolve: function (user) { var _a; return (_a = user.image) !== null && _a !== void 0 ? _a : undefined; } },
    given_name: {
        scope: "profile",
        resolve: function (user) { return splitDisplayName(user.name).given; },
    },
    family_name: {
        scope: "profile",
        resolve: function (user) { return splitDisplayName(user.name).family; },
    },
    email: { scope: "email", resolve: function (user) { var _a; return (_a = user.email) !== null && _a !== void 0 ? _a : undefined; } },
    email_verified: {
        scope: "email",
        resolve: function (user) { var _a; return (_a = user.emailVerified) !== null && _a !== void 0 ? _a : false; },
    },
};
exports.STANDARD_CLAIM_NAMES = Object.keys(exports.STANDARD_CLAIMS);
/**
 * The claim names this provider advertises it can supply (discovery
 * `claims_supported`): the operator's `advertisedMetadata.claims_supported`
 * override when set, otherwise the scope-derived standard set computed at plugin
 * init. Used both to advertise and to bound requested `claims.userinfo` names so
 * a client cannot pin arbitrary attacker-controlled strings onto stored tokens.
 */
function getSupportedClaims(opts) {
    var _a, _b, _c;
    return (_c = (_b = (_a = opts.advertisedMetadata) === null || _a === void 0 ? void 0 : _a.claims_supported) !== null && _b !== void 0 ? _b : opts.claims) !== null && _c !== void 0 ? _c : [];
}
