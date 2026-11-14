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
var vitest_1 = require("vitest");
var signed_query_1 = require("./signed-query");
var signedQueryParameterNameParam = "ba_param";
(0, vitest_1.describe)("signed OAuth query", function () {
    (0, vitest_1.it)("builds oauth_query from declared signed params", function () {
        var signedParams = new URLSearchParams();
        signedParams.set("client_id", "client-a");
        signedParams.set("custom_authorization_context", "tenant-a");
        signedParams.append("resource", "https://api.example.com");
        signedParams.set("exp", "123");
        (0, signed_query_1.setSignedOAuthQueryParameterNames)(signedParams);
        signedParams.set("sig", "test-sig");
        var reorderedParams = new URLSearchParams();
        for (var _i = 0, _a = __spreadArray([], signedParams.entries(), true).reverse(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            reorderedParams.append(key, value);
        }
        reorderedParams.append("utm_email", "user@example.com");
        var oauthQuery = (0, signed_query_1.buildSignedOAuthQuery)("?".concat(reorderedParams.toString()));
        if (!oauthQuery) {
            throw new Error("Expected signed OAuth query");
        }
        var oauthParams = new URLSearchParams(oauthQuery);
        (0, vitest_1.expect)(oauthParams.get("custom_authorization_context")).toBe("tenant-a");
        (0, vitest_1.expect)(oauthParams.get("resource")).toBe("https://api.example.com");
        (0, vitest_1.expect)(oauthParams.get("utm_email")).toBeNull();
        (0, vitest_1.expect)(oauthParams.getAll(signedQueryParameterNameParam)).toContain("custom_authorization_context");
    });
    (0, vitest_1.it)("ignores legacy signed queries without declared signed params", function () {
        (0, vitest_1.expect)((0, signed_query_1.buildSignedOAuthQuery)("?client_id=client-a&sig=test-sig")).toBe(undefined);
    });
    (0, vitest_1.it)("canonicalizes repeated params by key and value", function () {
        var params = new URLSearchParams();
        params.append("resource", "https://b.example.com");
        params.append("client_id", "client-a");
        params.append("resource", "https://a.example.com");
        (0, vitest_1.expect)((0, signed_query_1.canonicalizeOAuthQueryParams)(params).toString()).toBe("client_id=client-a&resource=https%3A%2F%2Fa.example.com&resource=https%3A%2F%2Fb.example.com");
    });
});
