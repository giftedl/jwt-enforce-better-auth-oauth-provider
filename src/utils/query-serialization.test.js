"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_1 = require("./index");
(0, vitest_1.describe)("searchParamsToQuery", function () {
    (0, vitest_1.it)("preserves single-valued params as strings", function () {
        var params = new URLSearchParams("client_id=abc&scope=openid");
        var result = (0, index_1.searchParamsToQuery)(params);
        (0, vitest_1.expect)(result).toEqual({
            client_id: "abc",
            scope: "openid",
        });
    });
    (0, vitest_1.it)("preserves multi-valued params as arrays", function () {
        var params = new URLSearchParams("resource=https://api.example.com&resource=https://other.example.com");
        var result = (0, index_1.searchParamsToQuery)(params);
        (0, vitest_1.expect)(result).toEqual({
            resource: ["https://api.example.com", "https://other.example.com"],
        });
    });
    (0, vitest_1.it)("handles a mix of single and multi-valued params", function () {
        var params = new URLSearchParams();
        params.append("client_id", "abc");
        params.append("resource", "https://api.example.com");
        params.append("resource", "https://other.example.com");
        params.append("scope", "openid profile");
        var result = (0, index_1.searchParamsToQuery)(params);
        (0, vitest_1.expect)(result).toEqual({
            client_id: "abc",
            resource: ["https://api.example.com", "https://other.example.com"],
            scope: "openid profile",
        });
    });
    (0, vitest_1.it)("handles empty params", function () {
        var params = new URLSearchParams();
        var result = (0, index_1.searchParamsToQuery)(params);
        (0, vitest_1.expect)(result).toEqual({});
    });
});
(0, vitest_1.describe)("removePromptFromQuery", function () {
    (0, vitest_1.it)("removes a prompt value and preserves other params", function () {
        var params = new URLSearchParams("client_id=abc&prompt=login consent&scope=openid");
        var result = (0, index_1.searchParamsToQuery)((0, index_1.removePromptFromQuery)(params, "login"));
        (0, vitest_1.expect)(result.prompt).toBe("consent");
        (0, vitest_1.expect)(result.client_id).toBe("abc");
        (0, vitest_1.expect)(result.scope).toBe("openid");
    });
    (0, vitest_1.it)("deletes the prompt key when the last value is removed", function () {
        var params = new URLSearchParams("client_id=abc&prompt=consent&scope=openid");
        var result = (0, index_1.searchParamsToQuery)((0, index_1.removePromptFromQuery)(params, "consent"));
        (0, vitest_1.expect)(result.prompt).toBeUndefined();
        (0, vitest_1.expect)(result.client_id).toBe("abc");
    });
    (0, vitest_1.it)("preserves multi-valued params through prompt deletion", function () {
        var params = new URLSearchParams();
        params.append("client_id", "abc");
        params.append("prompt", "login consent");
        params.append("resource", "https://api.example.com");
        params.append("resource", "https://other.example.com");
        var result = (0, index_1.searchParamsToQuery)((0, index_1.removePromptFromQuery)(params, "login"));
        (0, vitest_1.expect)(result.prompt).toBe("consent");
        (0, vitest_1.expect)(result.resource).toEqual([
            "https://api.example.com",
            "https://other.example.com",
        ]);
    });
    (0, vitest_1.it)("does nothing when the prompt value is not present", function () {
        var params = new URLSearchParams("client_id=abc&prompt=consent");
        var result = (0, index_1.searchParamsToQuery)((0, index_1.removePromptFromQuery)(params, "login"));
        (0, vitest_1.expect)(result.prompt).toBe("consent");
    });
    (0, vitest_1.it)("does not mutate the original query", function () {
        var params = new URLSearchParams("client_id=abc&prompt=login consent&scope=openid");
        (0, index_1.removePromptFromQuery)(params, "login");
        (0, vitest_1.expect)(params.get("prompt")).toBe("login consent");
    });
});
(0, vitest_1.describe)("removeMaxAgeFromQuery", function () {
    (0, vitest_1.it)("removes max_age and preserves other params", function () {
        var params = new URLSearchParams("client_id=abc&max_age=0&prompt=login&scope=openid");
        var result = (0, index_1.searchParamsToQuery)((0, index_1.removeMaxAgeFromQuery)(params));
        (0, vitest_1.expect)(result.max_age).toBeUndefined();
        (0, vitest_1.expect)(result.client_id).toBe("abc");
        (0, vitest_1.expect)(result.prompt).toBe("login");
        (0, vitest_1.expect)(result.scope).toBe("openid");
    });
    (0, vitest_1.it)("does not mutate the original query", function () {
        var params = new URLSearchParams("client_id=abc&max_age=0");
        (0, index_1.removeMaxAgeFromQuery)(params);
        (0, vitest_1.expect)(params.get("max_age")).toBe("0");
    });
});
(0, vitest_1.describe)("getSignedQueryIssuedAt", function () {
    (0, vitest_1.it)("reads the signed query issue time when present", function () {
        var _a;
        var issuedAt = 1777026004123;
        var params = new URLSearchParams((_a = {
                client_id: "abc"
            },
            _a[index_1.signedQueryIssuedAtParam] = String(issuedAt),
            _a));
        (0, vitest_1.expect)((0, index_1.getSignedQueryIssuedAt)(params.toString())).toEqual(new Date(issuedAt));
    });
    (0, vitest_1.it)("returns null when ba_iat is absent", function () {
        var params = new URLSearchParams({
            client_id: "abc",
            exp: "1777026604",
        });
        (0, vitest_1.expect)((0, index_1.getSignedQueryIssuedAt)(params.toString())).toBeNull();
    });
    (0, vitest_1.it)("returns null when ba_iat is not a positive finite number", function () {
        var _a;
        var params = new URLSearchParams((_a = {
                client_id: "abc"
            },
            _a[index_1.signedQueryIssuedAtParam] = "not-a-number",
            _a));
        (0, vitest_1.expect)((0, index_1.getSignedQueryIssuedAt)(params.toString())).toBeNull();
    });
});
(0, vitest_1.describe)("isSessionFreshForSignedQuery", function () {
    (0, vitest_1.it)("accepts a session created at or after the signed query issue time", function () {
        var issuedAt = new Date("2026-06-08T12:00:00.000Z");
        (0, vitest_1.expect)((0, index_1.isSessionFreshForSignedQuery)(issuedAt, issuedAt)).toBe(true);
        (0, vitest_1.expect)((0, index_1.isSessionFreshForSignedQuery)(new Date("2026-06-08T12:00:00.001Z"), issuedAt)).toBe(true);
    });
    (0, vitest_1.it)("rejects a session that predates the signed query issue time", function () {
        (0, vitest_1.expect)((0, index_1.isSessionFreshForSignedQuery)(new Date("2026-06-08T11:59:59.999Z"), new Date("2026-06-08T12:00:00.000Z"))).toBe(false);
    });
    (0, vitest_1.it)("rejects missing or invalid timestamps", function () {
        var issuedAt = new Date("2026-06-08T12:00:00.000Z");
        (0, vitest_1.expect)((0, index_1.isSessionFreshForSignedQuery)(undefined, issuedAt)).toBe(false);
        (0, vitest_1.expect)((0, index_1.isSessionFreshForSignedQuery)("not-a-date", issuedAt)).toBe(false);
        (0, vitest_1.expect)((0, index_1.isSessionFreshForSignedQuery)(issuedAt, undefined)).toBe(false);
    });
});
