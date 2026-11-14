"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var z = require("zod");
var oauth_endpoint_1 = require("./oauth-endpoint");
/**
 * @see https://github.com/better-auth/better-auth/issues/9250
 */
(0, vitest_1.describe)("mapIssuesToOAuthError", function () {
    (0, vitest_1.it)("returns defaultError when issue list is empty", function () {
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)([])).toEqual({
            error: "invalid_request",
            error_description: "Invalid request.",
        });
    });
    (0, vitest_1.it)("honors custom defaultError when no mapping matches", function () {
        var _a, _b;
        var issues = (_b = (_a = z.object({ foo: z.string() }).safeParse({}).error) === null || _a === void 0 ? void 0 : _a.issues) !== null && _b !== void 0 ? _b : [];
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)(issues, undefined, "invalid_client_metadata")).toEqual({
            error: "invalid_client_metadata",
            error_description: "foo is required",
        });
    });
    (0, vitest_1.it)("applies string field mapping to both missing and invalid cases", function () {
        var _a, _b, _c, _d;
        var schema = z.object({ redirect_uris: z.array(z.string()).min(1) });
        var missing = (_b = (_a = schema.safeParse({}).error) === null || _a === void 0 ? void 0 : _a.issues) !== null && _b !== void 0 ? _b : [];
        var invalid = (_d = (_c = schema.safeParse({ redirect_uris: "nope" }).error) === null || _c === void 0 ? void 0 : _c.issues) !== null && _d !== void 0 ? _d : [];
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)(missing, { redirect_uris: "invalid_redirect_uri" })).toMatchObject({ error: "invalid_redirect_uri" });
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)(invalid, { redirect_uris: "invalid_redirect_uri" })).toMatchObject({ error: "invalid_redirect_uri" });
    });
    (0, vitest_1.it)("distinguishes missing from invalid when mapping uses object form", function () {
        var _a, _b, _c, _d;
        // Required enum fields must be wrapped in `z.string().pipe(z.enum([...]))`
        // so that missing surfaces as invalid_type and invalid surfaces as invalid_value.
        var schema = z.object({
            grant_type: z
                .string()
                .pipe(z.enum(["authorization_code", "client_credentials", "refresh_token"])),
        });
        var mapping = {
            grant_type: {
                missing: "invalid_request",
                invalid: "unsupported_grant_type",
            },
        };
        var missing = (_b = (_a = schema.safeParse({}).error) === null || _a === void 0 ? void 0 : _a.issues) !== null && _b !== void 0 ? _b : [];
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)(missing, mapping)).toMatchObject({
            error: "invalid_request",
            error_description: "grant_type is required",
        });
        var invalid = (_d = (_c = schema.safeParse({ grant_type: "password" }).error) === null || _c === void 0 ? void 0 : _c.issues) !== null && _d !== void 0 ? _d : [];
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)(invalid, mapping)).toMatchObject({
            error: "unsupported_grant_type",
        });
    });
    (0, vitest_1.it)("falls back to the other object mapping half when only one is defined", function () {
        var _a, _b;
        var schema = z.object({
            token_type_hint: z.enum(["access_token", "refresh_token"]).optional(),
        });
        var invalid = (_b = (_a = schema.safeParse({ token_type_hint: "id_token" }).error) === null || _a === void 0 ? void 0 : _a.issues) !== null && _b !== void 0 ? _b : [];
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)(invalid, {
            token_type_hint: { invalid: "unsupported_token_type" },
        })).toMatchObject({ error: "unsupported_token_type" });
    });
    (0, vitest_1.it)("describes duplicated scalar fields as appearing more than once", function () {
        var _a, _b;
        var schema = z.object({ resource: z.string() });
        var issues = (_b = (_a = schema.safeParse({ resource: ["one", "two"] }).error) === null || _a === void 0 ? void 0 : _a.issues) !== null && _b !== void 0 ? _b : [];
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)(issues)).toMatchObject({
            error: "invalid_request",
            error_description: "resource must not appear more than once",
        });
    });
    (0, vitest_1.it)("routes duplicated fields to defaultError even when mapping.invalid is set", function () {
        var _a, _b;
        var schema = z.object({
            response_type: z
                .string()
                .pipe(z.enum(["code"]))
                .optional(),
        });
        var issues = (_b = (_a = schema.safeParse({ response_type: ["code", "token"] }).error) === null || _a === void 0 ? void 0 : _a.issues) !== null && _b !== void 0 ? _b : [];
        (0, vitest_1.expect)((0, oauth_endpoint_1.mapIssuesToOAuthError)(issues, {
            response_type: { invalid: "unsupported_response_type" },
        })).toMatchObject({
            error: "invalid_request",
            error_description: "response_type must not appear more than once",
        });
    });
    (0, vitest_1.it)("routes unsupported enum values through mapping.invalid", function () {
        var _a, _b;
        var schema = z.object({
            response_type: z
                .string()
                .pipe(z.enum(["code"]))
                .optional(),
        });
        var issues = (_b = (_a = schema.safeParse({ response_type: "token" }).error) === null || _a === void 0 ? void 0 : _a.issues) !== null && _b !== void 0 ? _b : [];
        var result = (0, oauth_endpoint_1.mapIssuesToOAuthError)(issues, {
            response_type: { invalid: "unsupported_response_type" },
        });
        (0, vitest_1.expect)(result.error).toBe("unsupported_response_type");
        (0, vitest_1.expect)(result.error_description).toMatch(/response_type/);
    });
});
/**
 * Pins the zod v4 message suffixes that `isMissingValueIssue` and
 * `describeIssue` rely on. A rephrase in a zod release would fail these
 * assertions before it could silently reclassify missing or duplicated
 * fields in production.
 * @see https://github.com/better-auth/better-auth/issues/9250
 */
(0, vitest_1.describe)("zod v4 issue shape contract", function () {
    (0, vitest_1.it)("reports missing required string as invalid_type + 'received undefined'", function () {
        var _a;
        var schema = z.object({ grant_type: z.string() });
        var issue = (_a = schema.safeParse({}).error) === null || _a === void 0 ? void 0 : _a.issues[0];
        (0, vitest_1.expect)(issue).toBeDefined();
        (0, vitest_1.expect)(issue.code).toBe("invalid_type");
        (0, vitest_1.expect)(issue.message.endsWith("received undefined")).toBe(true);
        (0, vitest_1.expect)((0, oauth_endpoint_1.isMissingValueIssue)(issue)).toBe(true);
    });
    (0, vitest_1.it)("reports duplicated string field as invalid_type + 'received array'", function () {
        var _a;
        var schema = z.object({ resource: z.string() });
        var issue = (_a = schema.safeParse({ resource: ["a", "b"] }).error) === null || _a === void 0 ? void 0 : _a.issues[0];
        (0, vitest_1.expect)(issue).toBeDefined();
        (0, vitest_1.expect)(issue.code).toBe("invalid_type");
        (0, vitest_1.expect)(issue.message.endsWith("received array")).toBe(true);
        (0, vitest_1.expect)((0, oauth_endpoint_1.isMissingValueIssue)(issue)).toBe(false);
    });
    (0, vitest_1.it)("reports unsupported enum value as invalid_value", function () {
        var _a;
        var schema = z.object({
            grant_type: z.string().pipe(z.enum(["authorization_code"])),
        });
        var issue = (_a = schema.safeParse({ grant_type: "password" }).error) === null || _a === void 0 ? void 0 : _a.issues[0];
        (0, vitest_1.expect)(issue).toBeDefined();
        (0, vitest_1.expect)(issue.code).toBe("invalid_value");
        (0, vitest_1.expect)((0, oauth_endpoint_1.isMissingValueIssue)(issue)).toBe(false);
    });
});
