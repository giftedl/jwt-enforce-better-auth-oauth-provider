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
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimsRequestParameterSchema = exports.claimsRequestInputSchema = void 0;
exports.isValidOidcClaimsRequest = isValidOidcClaimsRequest;
exports.getRequestedUserInfoClaims = getRequestedUserInfoClaims;
exports.canSatisfyEssentialAcrRequest = canSatisfyEssentialAcrRequest;
exports.filterClaimsRequestUserInfoClaims = filterClaimsRequestUserInfoClaims;
var z = require("zod");
var claimRequestMemberSchema = z.record(z.string(), z.unknown()).nullable();
var acrClaimRequestMemberSchema = z
    .looseObject({
    essential: z.boolean().optional(),
    value: z.string().optional(),
    values: z.array(z.string()).optional(),
})
    .nullable();
var idTokenClaimsRequestSchema = z
    .object({
    acr: acrClaimRequestMemberSchema.optional(),
})
    .catchall(claimRequestMemberSchema);
var oidcClaimsRequestObjectSchema = z.looseObject({
    userinfo: z.record(z.string(), claimRequestMemberSchema).optional(),
    id_token: idTokenClaimsRequestSchema.optional(),
});
function parseClaimsRequestValue(value) {
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return undefined;
        }
    }
    return value;
}
function parseOidcClaimsRequestObject(value) {
    var parsed = parseClaimsRequestValue(value);
    var result = oidcClaimsRequestObjectSchema.safeParse(parsed);
    return result.success ? result.data : undefined;
}
var claimsRequestParameterValueSchema = z.union([
    z.string(),
    z.record(z.string(), z.unknown()),
]);
exports.claimsRequestInputSchema = claimsRequestParameterValueSchema;
exports.claimsRequestParameterSchema = claimsRequestParameterValueSchema.refine(function (value) { return parseOidcClaimsRequestObject(value) !== undefined; }, {
    error: "claims must be a valid Claims request object",
});
function isValidOidcClaimsRequest(value) {
    return (value === undefined || parseOidcClaimsRequestObject(value) !== undefined);
}
function getRequestedUserInfoClaims(value, supportedClaims) {
    var claimsRequest = parseOidcClaimsRequestObject(value);
    var userInfoClaims = claimsRequest === null || claimsRequest === void 0 ? void 0 : claimsRequest.userinfo;
    if (!userInfoClaims)
        return [];
    // `Object.keys` over a parsed object is already unique; no duplicate filtering needed.
    var names = Object.keys(userInfoClaims);
    if (!supportedClaims)
        return names;
    var allowed = new Set(supportedClaims);
    return names.filter(function (name) { return allowed.has(name); });
}
function canSatisfyEssentialAcrRequest(value, currentAcr) {
    var _a;
    var claimsRequest = parseOidcClaimsRequestObject(value);
    if (!claimsRequest)
        return value === undefined;
    var acrRequest = (_a = claimsRequest.id_token) === null || _a === void 0 ? void 0 : _a.acr;
    if (!acrRequest || acrRequest.essential !== true)
        return true;
    var valueMatches = acrRequest.value === undefined || acrRequest.value === currentAcr;
    var valuesMatch = acrRequest.values === undefined || acrRequest.values.includes(currentAcr);
    return valueMatches && valuesMatch;
}
function filterClaimsRequestUserInfoClaims(value, allowedUserInfoClaims) {
    var _a;
    var claimsRequest = parseOidcClaimsRequestObject(value);
    if (!claimsRequest)
        return undefined;
    var allowedClaimSet = new Set(allowedUserInfoClaims);
    var userInfoClaims = Object.fromEntries(Object.entries((_a = claimsRequest.userinfo) !== null && _a !== void 0 ? _a : {}).filter(function (_a) {
        var claim = _a[0];
        return allowedClaimSet.has(claim);
    }));
    var filteredClaimsRequest = Object.keys(userInfoClaims).length
        ? __assign(__assign({}, claimsRequest), { userinfo: userInfoClaims }) : Object.fromEntries(Object.entries(claimsRequest).filter(function (_a) {
        var key = _a[0];
        return key !== "userinfo";
    }));
    return Object.keys(filteredClaimsRequest).length
        ? filteredClaimsRequest
        : undefined;
}
