"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
(0, vitest_1.describe)("public oauth-provider types", function () {
    (0, vitest_1.it)("exports the signed-query verifier with a server-side secret", function () {
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
    });
    /**
     * @see https://github.com/better-auth/better-auth/issues/9378
     */
    (0, vitest_1.it)("exports option helper types from the package entrypoint", function () {
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("clientCredentialGrantDefaultScopes");
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("public");
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("type");
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("public");
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("type");
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("client_credentials_scopes");
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("public");
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("type");
        (0, vitest_1.expectTypeOf)().toHaveProperty("applicationType");
        (0, vitest_1.expectTypeOf)().toHaveProperty("clientCredentialsScopes");
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("public");
        (0, vitest_1.expectTypeOf)().not.toHaveProperty("type");
        (0, vitest_1.expectTypeOf)().toMatchTypeOf();
        (0, vitest_1.expectTypeOf)().not.toMatchTypeOf();
        (0, vitest_1.expectTypeOf)().toEqualTypeOf();
    });
});
