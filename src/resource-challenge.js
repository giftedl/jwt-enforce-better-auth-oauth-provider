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
exports.buildDpopChallengeValue = buildDpopChallengeValue;
exports.createResourceServerChallenge = createResourceServerChallenge;
var api_1 = require("better-auth/api");
var oauth2_1 = require("better-auth/oauth2");
var better_call_1 = require("better-call");
var DPOP_CHALLENGE_ERRORS = new Set(["invalid_dpop_proof"]);
var OAUTH_SCOPE_TOKEN_PATTERN = /^[\x21\x23-\x5b\x5d-\x7e]+$/;
var ERROR_DESCRIPTION_EXCLUDED = /[^\x20-\x21\x23-\x5b\x5d-\x7e]+/g;
function quoteAuthParam(value) {
    if (/[\x00-\x1f\x7f]/.test(value)) {
        throw new TypeError("invalid WWW-Authenticate parameter");
    }
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function serializeChallengeScopes(scopes) {
    if (!scopes)
        return undefined;
    for (var _i = 0, scopes_1 = scopes; _i < scopes_1.length; _i++) {
        var scope = scopes_1[_i];
        if (!OAUTH_SCOPE_TOKEN_PATTERN.test(scope)) {
            throw new TypeError("invalid challenge scope: ".concat(JSON.stringify(scope)));
        }
    }
    return __spreadArray([], new Set(scopes), true).join(" ");
}
/**
 * Fits a runtime error message into RFC 6750 §3's `error_description`
 * character set instead of failing the response it describes: `"` becomes
 * `'`, any other excluded character (`\`, controls, non-ASCII) becomes a space,
 * and a description with nothing left is omitted.
 */
function formatErrorDescription(description) {
    if (typeof description !== "string")
        return undefined;
    var formatted = description
        .replace(/"/g, "'")
        .replace(ERROR_DESCRIPTION_EXCLUDED, " ")
        .replace(/ {2,}/g, " ")
        .trim();
    return formatted || undefined;
}
function extractTokenError(error) {
    var body = error.body;
    var errorCode = typeof (body === null || body === void 0 ? void 0 : body.error) === "string" ? body.error : undefined;
    var description = typeof (body === null || body === void 0 ? void 0 : body.error_description) === "string"
        ? body.error_description
        : typeof (body === null || body === void 0 ? void 0 : body.message) === "string"
            ? body.message
            : error.message;
    return { errorCode: errorCode, description: description };
}
function isDpopChallengeError(error) {
    var _a = extractTokenError(error), errorCode = _a.errorCode, description = _a.description;
    return (!!errorCode &&
        (DPOP_CHALLENGE_ERRORS.has(errorCode) ||
            (errorCode === "invalid_token" && description.includes("DPoP"))));
}
function presentedScheme(request) {
    var _a, _b;
    if (!request)
        return undefined;
    // Duck-type the `Request` so a cross-realm instance is still recognized.
    var authorizationHeader = typeof ((_a = request.headers) === null || _a === void 0 ? void 0 : _a.get) === "function"
        ? request.headers.get("authorization")
        : request
            .authorizationHeader;
    return (_b = (0, oauth2_1.parseAccessTokenAuthorization)(authorizationHeader)) === null || _b === void 0 ? void 0 : _b.scheme;
}
/** Builds an RFC 9449 §7.1 `WWW-Authenticate: DPoP` challenge value. */
function buildDpopChallengeValue(errorCode, description, algorithms, scope) {
    if (algorithms === void 0) { algorithms = oauth2_1.DPOP_SIGNING_ALGORITHMS; }
    var errorDescription = formatErrorDescription(description);
    return [
        "DPoP error=\"".concat(quoteAuthParam(errorCode), "\""),
        scope && "scope=\"".concat(quoteAuthParam(scope), "\""),
        errorDescription && "error_description=\"".concat(errorDescription, "\""),
        "algs=\"".concat(quoteAuthParam(algorithms.join(" ")), "\""),
    ]
        .filter(function (param) { return !!param; })
        .join(", ");
}
/**
 * `WWW-Authenticate` is not a CORS-safelisted response header, so browsers
 * hide it from cross-origin clients unless the response exposes it.
 */
function challengeHeaders(challenge) {
    return {
        "WWW-Authenticate": challenge,
        "Access-Control-Expose-Headers": "WWW-Authenticate",
    };
}
function challengeBody(message, errorCode, description) {
    if (!errorCode)
        return { message: message };
    return __assign({ message: message, error: errorCode }, (typeof description === "string" && { error_description: description }));
}
function extractInsufficientScope(error) {
    var body = error.body;
    return {
        scope: body === null || body === void 0 ? void 0 : body.scope,
        description: (body === null || body === void 0 ? void 0 : body.error_description) !== undefined
            ? body.error_description
            : error.message,
    };
}
function resolveResourceMetadataUrl(value, opts) {
    var _a, _b;
    // Opaque absolute URIs (for example `urn:`) parse with an `origin` of
    // "null", so only origin-based URLs derive the well-known metadata URL;
    // everything else needs an explicit mapping.
    var url = ((_a = URL.canParse) === null || _a === void 0 ? void 0 : _a.call(URL, value)) ? new URL(value) : null;
    if (url && url.origin !== "null") {
        var resourcePath = url.pathname.endsWith("/")
            ? url.pathname.slice(0, -1)
            : url.pathname;
        return "".concat(url.origin, "/.well-known/oauth-protected-resource").concat(resourcePath).concat(url.search);
    }
    var resourceMetadata = (_b = opts === null || opts === void 0 ? void 0 : opts.resourceMetadataMappings) === null || _b === void 0 ? void 0 : _b[value];
    if (!resourceMetadata) {
        throw new better_call_1.APIError("INTERNAL_SERVER_ERROR", {
            message: "missing resource_metadata mapping for ".concat(value),
        });
    }
    return resourceMetadata;
}
function buildBearerChallenge(resource, opts, authParams) {
    var resources = Array.isArray(resource) ? resource : [resource];
    return resources
        .map(function (value) {
        var params = authParams(resolveResourceMetadataUrl(value, opts)).filter(function (param) { return !!param; });
        return "Bearer ".concat(params.join(", "));
    })
        .join(", ");
}
/**
 * Create an OAuth resource-server challenge for a failed access-token request.
 *
 * Missing/invalid bearer credentials are reported with RFC 6750 plus the RFC
 * 9728 `resource_metadata` pointer. A 401 whose body has
 * `error: "invalid_token"` means a presented token failed, so its challenge
 * also carries that code and an `error_description` (RFC 6750 §3.1); any
 * other 401 is treated as a request without credentials and carries neither.
 * Insufficient-scope failures (built with
 * `createInsufficientScopeError`) are reported with RFC 6750 §3.1's
 * `insufficient_scope` challenge on a 403 naming the scopes the token lacks, so
 * clients can step up their authorization. DPoP-bound-token failures are
 * reported with RFC 9449's `DPoP` challenge so clients know which proof
 * algorithms to use. Pass the failed `request` so that any 401 or
 * insufficient-scope 403 on a request that presented its token with the
 * `DPoP` scheme, such as an expired or revoked token, is also answered with a
 * `DPoP` challenge (RFC 9449 §7.2), and a 401 on one with an unsupported
 * scheme, or none, with a `Bearer` challenge (RFC 6750 §3.1). Without it,
 * only DPoP-specific errors get one. Non-URL resources (for example a `urn:`
 * or a client id) resolve their metadata URL through
 * `resourceMetadataMappings`.
 *
 * An `error_description` is fitted into RFC 6750 §3's character set rather
 * than rejected: `"` becomes `'`, other excluded characters become spaces, and
 * an empty result is omitted. The returned error's body keeps the original
 * `error` and `error_description`. Invalid scope tokens in `challengeScopes`
 * still throw, since they are server configuration.
 *
 * Every other error returns `undefined`, including a plain `FORBIDDEN`: a
 * permission denial that re-authorizing cannot fix must not be answered with a
 * challenge that sends the user through consent for scopes they already hold.
 *
 * @external
 */
function createResourceServerChallenge(error, resource, opts) {
    var challengeScope = serializeChallengeScopes(opts === null || opts === void 0 ? void 0 : opts.challengeScopes);
    if ((0, api_1.isAPIError)(error) && error.status === "UNAUTHORIZED") {
        var _a = extractTokenError(error), errorCode = _a.errorCode, description = _a.description;
        // With a request, only a `Bearer` presentation may still need a DPoP
        // challenge, for a DPoP-bound token; any other scheme, or none, never
        // attempted DPoP.
        var scheme = presentedScheme(opts === null || opts === void 0 ? void 0 : opts.request);
        if (scheme === "DPoP" ||
            ((!(opts === null || opts === void 0 ? void 0 : opts.request) || scheme === "Bearer") && isDpopChallengeError(error))) {
            // Only the request's DPoP scheme can select this branch without an
            // error code, and that request presented a token.
            var dpopErrorCode = errorCode !== null && errorCode !== void 0 ? errorCode : "invalid_token";
            return new better_call_1.APIError("UNAUTHORIZED", challengeBody(error.message, dpopErrorCode, description), challengeHeaders(buildDpopChallengeValue(dpopErrorCode, description, opts === null || opts === void 0 ? void 0 : opts.dpopSigningAlgorithms)));
        }
        // RFC 6750 §3.1: only a request that presented a token which failed
        // carries an error code; one that sent no credentials gets none.
        var invalidToken_1 = errorCode === "invalid_token";
        var errorDescription_1 = invalidToken_1
            ? formatErrorDescription(description)
            : undefined;
        return new better_call_1.APIError("UNAUTHORIZED", challengeBody(error.message, invalidToken_1 ? errorCode : undefined, description), challengeHeaders(buildBearerChallenge(resource, opts, function (metadataUrl) { return [
            invalidToken_1 && "error=\"invalid_token\"",
            errorDescription_1 && "error_description=\"".concat(errorDescription_1, "\""),
            "resource_metadata=\"".concat(quoteAuthParam(metadataUrl), "\""),
            challengeScope && "scope=\"".concat(quoteAuthParam(challengeScope), "\""),
        ]; })));
    }
    if ((0, oauth2_1.isInsufficientScopeError)(error)) {
        var insufficientScope = extractInsufficientScope(error);
        var errorDescription_2 = formatErrorDescription(insufficientScope.description);
        // RFC 6750 §3.1: a token that is valid but lacks the scopes the
        // operation needs answers with 403 and an `insufficient_scope`
        // challenge naming them, so the client can step up via re-authorization.
        // `challengeScopes` is only a fallback: the scopes the token actually lacks
        // are the ones re-authorizing has to add.
        var scope_1 = insufficientScope.scope || challengeScope;
        var message = typeof insufficientScope.description === "string"
            ? insufficientScope.description
            : error.message;
        // RFC 9449 §7.2: a request that presented its token with the `DPoP`
        // scheme gets its error in a `DPoP` challenge, which allows `scope` (§7.1).
        var dpopChallenge = presentedScheme(opts === null || opts === void 0 ? void 0 : opts.request) === "DPoP"
            ? buildDpopChallengeValue("insufficient_scope", insufficientScope.description, opts === null || opts === void 0 ? void 0 : opts.dpopSigningAlgorithms, scope_1)
            : undefined;
        return new better_call_1.APIError("FORBIDDEN", challengeBody(message, "insufficient_scope", insufficientScope.description), challengeHeaders(dpopChallenge !== null && dpopChallenge !== void 0 ? dpopChallenge : buildBearerChallenge(resource, opts, function (metadataUrl) { return [
            "error=\"insufficient_scope\"",
            scope_1 && "scope=\"".concat(quoteAuthParam(scope_1), "\""),
            "resource_metadata=\"".concat(quoteAuthParam(metadataUrl), "\""),
            errorDescription_2 && "error_description=\"".concat(errorDescription_2, "\""),
        ]; })));
    }
    return undefined;
}
