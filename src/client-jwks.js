"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePublicClientJwks = validatePublicClientJwks;
exports.assertValidClientJwks = assertValidClientJwks;
var oauth2_1 = require("@better-auth/core/oauth2");
var api_1 = require("better-auth/api");
var EC_PRIVATE_KEY_JWT_ALGORITHM_BY_CURVE = {
    "P-256": "ES256",
    "P-384": "ES384",
    "P-521": "ES512",
};
var OKP_PRIVATE_KEY_JWT_SIGNING_CURVES = ["Ed25519"];
var PRIVATE_JWK_MEMBER_NAMES = [
    "d",
    "p",
    "q",
    "dp",
    "dq",
    "qi",
    "oth",
];
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function hasStringMember(key, memberName) {
    return typeof key[memberName] === "string" && key[memberName].length > 0;
}
function isSupportedEcSigningCurve(curve) {
    return (typeof curve === "string" &&
        Object.prototype.hasOwnProperty.call(EC_PRIVATE_KEY_JWT_ALGORITHM_BY_CURVE, curve));
}
function isSupportedOkpSigningCurve(curve) {
    return OKP_PRIVATE_KEY_JWT_SIGNING_CURVES.some(function (signingCurve) { return signingCurve === curve; });
}
function isSupportedPublicJwk(key) {
    switch (key.kty) {
        case "RSA":
            return hasStringMember(key, "n") && hasStringMember(key, "e");
        case "EC":
            return (isSupportedEcSigningCurve(key.crv) &&
                hasStringMember(key, "x") &&
                hasStringMember(key, "y"));
        case "OKP":
            return isSupportedOkpSigningCurve(key.crv) && hasStringMember(key, "x");
        default:
            return false;
    }
}
function hasSupportedPrivateKeyJwtAlgorithm(key) {
    if (key.alg === undefined)
        return true;
    if (typeof key.alg !== "string" ||
        !oauth2_1.PRIVATE_KEY_JWT_SIGNING_ALGORITHMS.some(function (algorithm) { return algorithm === key.alg; })) {
        return false;
    }
    switch (key.kty) {
        case "RSA":
            return key.alg.startsWith("RS") || key.alg.startsWith("PS");
        case "EC":
            return (isSupportedEcSigningCurve(key.crv) &&
                EC_PRIVATE_KEY_JWT_ALGORITHM_BY_CURVE[key.crv] === key.alg);
        case "OKP":
            return isSupportedOkpSigningCurve(key.crv) && key.alg === "EdDSA";
        default:
            return false;
    }
}
/**
 * Validates an OAuth client's public asymmetric JWK set.
 *
 * This boundary accepts only the RFC 7517 `{ keys: [...] }` representation.
 * It performs no I/O and returns the validated set for downstream JOSE
 * verification.
 *
 * @internal
 */
function validatePublicClientJwks(input) {
    var keys = isRecord(input) && Array.isArray(input.keys) ? input.keys : undefined;
    if (!(keys === null || keys === void 0 ? void 0 : keys.length)) {
        return {
            valid: false,
            error: "jwks must be an RFC 7517 JWK Set object with a non-empty keys array",
        };
    }
    var _loop_1 = function (key) {
        if (!isRecord(key)) {
            return { value: {
                    valid: false,
                    error: "jwks keys must be supported public JWKs with required key parameters",
                } };
        }
        if (key.kty === "oct" ||
            "k" in key ||
            PRIVATE_JWK_MEMBER_NAMES.some(function (name) { return name in key; })) {
            return { value: {
                    valid: false,
                    error: "jwks must contain only public asymmetric keys",
                } };
        }
        if (!isSupportedPublicJwk(key)) {
            return { value: {
                    valid: false,
                    error: "jwks keys must be supported public JWKs with required key parameters",
                } };
        }
        if (!hasSupportedPrivateKeyJwtAlgorithm(key)) {
            return { value: {
                    valid: false,
                    error: "jwks key alg must be supported for private_key_jwt and compatible with its key type and signing curve",
                } };
        }
    };
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return {
        valid: true,
        jwks: { keys: keys },
    };
}
/**
 * Throws `invalid_client_metadata` unless `jwks` is a public JWK Set that
 * {@link validatePublicClientJwks} accepts.
 */
function assertValidClientJwks(jwks) {
    var result = validatePublicClientJwks(jwks);
    if (!result.valid) {
        throw new api_1.APIError("BAD_REQUEST", {
            error: "invalid_client_metadata",
            error_description: result.error,
        });
    }
}
