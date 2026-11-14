"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var index_1 = require("./index");
(0, vitest_1.describe)("normalizeTimestampValue", function () {
    (0, vitest_1.it)("parses epoch-millis text values", function () {
        var result = (0, index_1.normalizeTimestampValue)("1774295570569.0");
        (0, vitest_1.expect)(result).toBeInstanceOf(Date);
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.getTime()).toBe(1774295570569);
    });
    (0, vitest_1.it)("returns undefined for invalid values", function () {
        (0, vitest_1.expect)((0, index_1.normalizeTimestampValue)("not-a-date")).toBeUndefined();
        (0, vitest_1.expect)((0, index_1.normalizeTimestampValue)(Number.NaN)).toBeUndefined();
        (0, vitest_1.expect)((0, index_1.normalizeTimestampValue)(9e15)).toBeUndefined();
        (0, vitest_1.expect)((0, index_1.normalizeTimestampValue)("9e15")).toBeUndefined();
    });
});
(0, vitest_1.describe)("resolveSessionAuthTime", function () {
    (0, vitest_1.it)("reads createdAt from direct session objects", function () {
        var result = (0, index_1.resolveSessionAuthTime)({
            createdAt: "1774295570569.0",
        });
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.getTime()).toBe(1774295570569);
    });
    (0, vitest_1.it)("reads created_at from nested session payloads", function () {
        var result = (0, index_1.resolveSessionAuthTime)({
            session: {
                created_at: 1774295570569,
            },
        });
        (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.getTime()).toBe(1774295570569);
    });
    (0, vitest_1.it)("normalizes direct Date values", function () {
        var _a;
        var date = new Date(1774295570569);
        (0, vitest_1.expect)((_a = (0, index_1.resolveSessionAuthTime)(date)) === null || _a === void 0 ? void 0 : _a.getTime()).toBe(1774295570569);
    });
    (0, vitest_1.it)("does not fall back to updatedAt timestamps", function () {
        var directResult = (0, index_1.resolveSessionAuthTime)({
            updatedAt: 1774295570569,
        });
        var nestedResult = (0, index_1.resolveSessionAuthTime)({
            session: {
                updated_at: "1774295570569.0",
            },
        });
        (0, vitest_1.expect)(directResult).toBeUndefined();
        (0, vitest_1.expect)(nestedResult).toBeUndefined();
    });
});
