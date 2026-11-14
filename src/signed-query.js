"use strict";
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
exports.postLoginClearedParam = exports.signedQueryIssuedAtParam = void 0;
exports.canonicalizeOAuthQueryParams = canonicalizeOAuthQueryParams;
exports.setSignedOAuthQueryParameterNames = setSignedOAuthQueryParameterNames;
exports.buildSignedOAuthQuery = buildSignedOAuthQuery;
exports.getSignedQueryIssuedAt = getSignedQueryIssuedAt;
exports.signedQueryIssuedAtParam = "ba_iat";
exports.postLoginClearedParam = "ba_pl";
var signedQueryParameterNameParam = "ba_param";
function canonicalizeOAuthQueryParams(params) {
    var canonicalParams = new URLSearchParams();
    var entries = __spreadArray([], params.entries(), true).sort(function (_a, _b) {
        var keyA = _a[0], valueA = _a[1];
        var keyB = _b[0], valueB = _b[1];
        if (keyA < keyB)
            return -1;
        if (keyA > keyB)
            return 1;
        if (valueA < valueB)
            return -1;
        if (valueA > valueB)
            return 1;
        return 0;
    });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], key = _a[0], value = _a[1];
        canonicalParams.append(key, value);
    }
    return canonicalParams;
}
function setSignedOAuthQueryParameterNames(params) {
    params.delete(signedQueryParameterNameParam);
    var signedParameterNames = __spreadArray([], new Set(__spreadArray(__spreadArray([], params.keys(), true), [signedQueryParameterNameParam], false)), true).sort();
    for (var _i = 0, signedParameterNames_1 = signedParameterNames; _i < signedParameterNames_1.length; _i++) {
        var parameterName = signedParameterNames_1[_i];
        params.append(signedQueryParameterNameParam, parameterName);
    }
}
function getSignedOAuthQueryParameterNames(params) {
    var signedParameterNames = params.getAll(signedQueryParameterNameParam);
    if (!signedParameterNames.length) {
        return undefined;
    }
    return new Set(signedParameterNames);
}
function buildSignedOAuthQuery(search) {
    var params = new URLSearchParams(search);
    if (!params.has("sig")) {
        return undefined;
    }
    var signedParameterNames = getSignedOAuthQueryParameterNames(params);
    if (!signedParameterNames) {
        return undefined;
    }
    var signedParams = new URLSearchParams();
    for (var _i = 0, _a = params.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (key === "sig" ||
            key === signedQueryParameterNameParam ||
            signedParameterNames.has(key)) {
            signedParams.append(key, value);
        }
    }
    return signedParams.toString();
}
function getSignedQueryIssuedAt(oauthQuery) {
    var raw = new URLSearchParams(oauthQuery).get(exports.signedQueryIssuedAtParam);
    if (!raw)
        return null;
    var issuedAt = Number(raw);
    if (!Number.isFinite(issuedAt) || issuedAt <= 0)
        return null;
    return new Date(issuedAt);
}
