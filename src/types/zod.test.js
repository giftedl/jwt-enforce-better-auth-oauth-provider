"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var zod_1 = require("./zod");
(0, vitest_1.describe)("SafeUrlSchema", function () {
    (0, vitest_1.describe)("HTTPS enforcement", function () {
        (0, vitest_1.it)("should accept HTTPS URLs", function () {
            var result = zod_1.SafeUrlSchema.safeParse("https://example.com/callback");
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)("should accept HTTP localhost", function () {
            var result = zod_1.SafeUrlSchema.safeParse("http://localhost:3000/api/auth/callback");
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)("should accept HTTP 127.0.0.1", function () {
            var result = zod_1.SafeUrlSchema.safeParse("http://127.0.0.1:8080/callback");
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)("should accept HTTP [::1] (IPv6 localhost)", function () {
            var result = zod_1.SafeUrlSchema.safeParse("http://[::1]:3000/callback");
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)("should reject HTTP for non-localhost domains", function () {
            var _a, _b;
            var result = zod_1.SafeUrlSchema.safeParse("http://example.com/callback");
            (0, vitest_1.expect)(result.success).toBe(false);
            (0, vitest_1.expect)((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.issues[0]) === null || _b === void 0 ? void 0 : _b.message).toContain("HTTPS");
        });
        (0, vitest_1.it)("should reject HTTP for IP addresses other than 127.0.0.1", function () {
            var result = zod_1.SafeUrlSchema.safeParse("http://192.168.1.1/callback");
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)("should reject HTTP localhost.evil.com (subdomain attack)", function () {
            var result = zod_1.SafeUrlSchema.safeParse("http://localhost.evil.com/callback");
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)("should reject HTTP 127.0.0.1.evil.com (subdomain attack)", function () {
            var result = zod_1.SafeUrlSchema.safeParse("http://127.0.0.1.evil.com/callback");
            (0, vitest_1.expect)(result.success).toBe(false);
        });
    });
    (0, vitest_1.describe)("dangerous schemes", function () {
        (0, vitest_1.it)("should reject javascript: scheme", function () {
            var _a, _b;
            var result = zod_1.SafeUrlSchema.safeParse("javascript:alert(1)");
            (0, vitest_1.expect)(result.success).toBe(false);
            (0, vitest_1.expect)((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.issues[0]) === null || _b === void 0 ? void 0 : _b.message).toContain("javascript:");
        });
        (0, vitest_1.it)("should reject data: scheme", function () {
            var _a, _b;
            var result = zod_1.SafeUrlSchema.safeParse("data:text/html,<script>");
            (0, vitest_1.expect)(result.success).toBe(false);
            (0, vitest_1.expect)((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.issues[0]) === null || _b === void 0 ? void 0 : _b.message).toContain("data:");
        });
        (0, vitest_1.it)("should reject vbscript: scheme", function () {
            var _a, _b;
            var result = zod_1.SafeUrlSchema.safeParse("vbscript:msgbox");
            (0, vitest_1.expect)(result.success).toBe(false);
            (0, vitest_1.expect)((_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.issues[0]) === null || _b === void 0 ? void 0 : _b.message).toContain("vbscript:");
        });
    });
    (0, vitest_1.describe)("custom schemes (mobile apps)", function () {
        (0, vitest_1.it)("should accept custom schemes for mobile apps", function () {
            var result = zod_1.SafeUrlSchema.safeParse("myapp://oauth/callback");
            (0, vitest_1.expect)(result.success).toBe(true);
        });
    });
    (0, vitest_1.describe)("URL parsing", function () {
        (0, vitest_1.it)("should reject URLs with fragments", function () {
            var result = zod_1.SafeUrlSchema.safeParse("https://api.example.com#frag");
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)("should reject URLs with a bare trailing fragment marker", function () {
            var result = zod_1.SafeUrlSchema.safeParse("https://api.example.com/cb#");
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)("should reject invalid URLs", function () {
            var result = zod_1.SafeUrlSchema.safeParse("not-a-valid-url");
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)("should reject empty strings", function () {
            var result = zod_1.SafeUrlSchema.safeParse("");
            (0, vitest_1.expect)(result.success).toBe(false);
        });
    });
});
(0, vitest_1.describe)("ResourceUriSchema (RFC 8707 resource indicator)", function () {
    (0, vitest_1.it)("accepts an HTTPS absolute URI", function () {
        (0, vitest_1.expect)(zod_1.ResourceUriSchema.safeParse("https://api.example.com").success).toBe(true);
    });
    (0, vitest_1.it)("accepts a non-loopback HTTP absolute URI (not HTTPS-restricted)", function () {
        (0, vitest_1.expect)(zod_1.ResourceUriSchema.safeParse("http://internal.svc/api").success).toBe(true);
    });
    (0, vitest_1.it)("accepts a urn resource identifier", function () {
        (0, vitest_1.expect)(zod_1.ResourceUriSchema.safeParse("urn:example:api").success).toBe(true);
    });
    (0, vitest_1.it)("rejects a fragment, including a bare trailing marker", function () {
        (0, vitest_1.expect)(zod_1.ResourceUriSchema.safeParse("https://api.example.com#x").success).toBe(false);
        (0, vitest_1.expect)(zod_1.ResourceUriSchema.safeParse("https://api.example.com#").success).toBe(false);
    });
    (0, vitest_1.it)("rejects a relative (non-absolute) URI", function () {
        (0, vitest_1.expect)(zod_1.ResourceUriSchema.safeParse("/api").success).toBe(false);
    });
    (0, vitest_1.it)("rejects dangerous schemes", function () {
        (0, vitest_1.expect)(zod_1.ResourceUriSchema.safeParse("javascript:alert(1)").success).toBe(false);
    });
});
