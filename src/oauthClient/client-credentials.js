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
exports.isUserDelegatedScope = isUserDelegatedScope;
exports.normalizeClientCredentialsScopes = normalizeClientCredentialsScopes;
exports.validateClientCredentialsScopes = validateClientCredentialsScopes;
var api_1 = require("better-auth/api");
var USER_DELEGATED_SCOPES = new Set([
    "openid",
    "profile",
    "email",
    "offline_access",
]);
function isUserDelegatedScope(scope) {
    return USER_DELEGATED_SCOPES.has(scope);
}
function normalizeClientCredentialsScopes(scopes) {
    return __spreadArray([], new Set(scopes.map(function (scope) { return scope.trim(); }).filter(Boolean)), true);
}
function validateClientCredentialsScopes(scopes, grantTypes, tokenEndpointAuthMethod, opts) {
    var _a;
    if (scopes.length === 0)
        return;
    if (!grantTypes.includes("client_credentials")) {
        throw new api_1.APIError("BAD_REQUEST", {
            error: "invalid_client_metadata",
            error_description: "client_credentials_scopes requires the client_credentials grant",
        });
    }
    if (tokenEndpointAuthMethod === "none") {
        throw new api_1.APIError("BAD_REQUEST", {
            error: "invalid_client_metadata",
            error_description: "public clients cannot be assigned client_credentials scopes",
        });
    }
    var providerScopes = new Set((_a = opts.scopes) !== null && _a !== void 0 ? _a : []);
    var invalidScopes = scopes.filter(function (scope) { return !providerScopes.has(scope) || isUserDelegatedScope(scope); });
    if (invalidScopes.length > 0) {
        throw new api_1.APIError("BAD_REQUEST", {
            error: "invalid_scope",
            error_description: "The following client_credentials scopes are invalid: ".concat(invalidScopes.join(", ")),
        });
    }
}
