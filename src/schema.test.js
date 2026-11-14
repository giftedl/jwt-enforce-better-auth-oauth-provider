"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var schema_1 = require("./schema");
(0, vitest_1.describe)("oauth provider schema", function () {
    (0, vitest_1.it)("indexes OAuth foreign-key fields", function () {
        var _a;
        var indexedForeignKeys = [
            ["oauthClient", "userId"],
            ["oauthRefreshToken", "clientId"],
            ["oauthRefreshToken", "sessionId"],
            ["oauthRefreshToken", "userId"],
            ["oauthAccessToken", "clientId"],
            ["oauthAccessToken", "sessionId"],
            ["oauthAccessToken", "userId"],
            ["oauthAccessToken", "refreshId"],
            ["oauthConsent", "clientId"],
            ["oauthConsent", "userId"],
            ["oauthClientResource", "clientId"],
            ["oauthClientResource", "resourceId"],
        ];
        var oauthProviderSchema = schema_1.schema;
        for (var _i = 0, indexedForeignKeys_1 = indexedForeignKeys; _i < indexedForeignKeys_1.length; _i++) {
            var _b = indexedForeignKeys_1[_i], modelName = _b[0], fieldName = _b[1];
            var field = (_a = oauthProviderSchema[modelName]) === null || _a === void 0 ? void 0 : _a.fields[fieldName];
            (0, vitest_1.expect)(field === null || field === void 0 ? void 0 : field.references).toBeDefined();
            (0, vitest_1.expect)(field === null || field === void 0 ? void 0 : field.index).toBe(true);
        }
    });
    (0, vitest_1.it)("enforces one client-resource link per pair with a compound unique index", function () {
        (0, vitest_1.expect)(schema_1.schema.oauthClientResource.indexes).toContainEqual({
            fields: ["clientId", "resourceId"],
            unique: true,
        });
    });
    (0, vitest_1.it)("defaults new client_credentials scope authority to an empty array", function () {
        (0, vitest_1.expect)(schema_1.schema.oauthClient.fields.clientCredentialsScopes).toMatchObject({
            type: "string[]",
            required: false,
            defaultValue: [],
        });
    });
    (0, vitest_1.it)("declares the oauthResource entity with the expected policy seams", function () {
        var oauthSchema = schema_1.schema;
        var resource = oauthSchema.oauthResource;
        if (!resource) {
            throw new Error("oauthResource table missing from schema");
        }
        var requireField = function (name) {
            var field = resource.fields[name];
            if (!field) {
                throw new Error("oauthResource.".concat(name, " missing from schema"));
            }
            return field;
        };
        // Business key — the RFC 8707 `resource` value
        (0, vitest_1.expect)(requireField("identifier").unique).toBe(true);
        (0, vitest_1.expect)(requireField("identifier").required).toBe(true);
        (0, vitest_1.expect)(requireField("name").required).toBe(true);
        // Nullable policy columns — null means "inherit plugin default at issuance"
        var nullablePolicy = [
            "accessTokenTtl",
            "refreshTokenTtl",
            "signingAlgorithm",
            "signingKeyId",
            "allowedScopes",
            "customClaims",
        ];
        for (var _i = 0, nullablePolicy_1 = nullablePolicy; _i < nullablePolicy_1.length; _i++) {
            var fieldName = nullablePolicy_1[_i];
            (0, vitest_1.expect)(requireField(fieldName).required).not.toBe(true);
        }
        // Lifecycle + extensibility seams
        (0, vitest_1.expect)(requireField("disabled").defaultValue).toBe(false);
        (0, vitest_1.expect)(requireField("policyVersion").defaultValue).toBe(1);
        (0, vitest_1.expect)(resource.fields.metadata).toBeDefined();
    });
    (0, vitest_1.it)("declares DPoP sender-constraint storage with enforcement state", function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var oauthSchema = schema_1.schema;
        var clientFields = (_b = (_a = oauthSchema.oauthClient) === null || _a === void 0 ? void 0 : _a.fields) !== null && _b !== void 0 ? _b : {};
        var resourceFields = (_d = (_c = oauthSchema.oauthResource) === null || _c === void 0 ? void 0 : _c.fields) !== null && _d !== void 0 ? _d : {};
        var refreshFields = (_f = (_e = oauthSchema.oauthRefreshToken) === null || _e === void 0 ? void 0 : _e.fields) !== null && _f !== void 0 ? _f : {};
        var accessFields = (_h = (_g = oauthSchema.oauthAccessToken) === null || _g === void 0 ? void 0 : _g.fields) !== null && _h !== void 0 ? _h : {};
        (0, vitest_1.expect)((_j = clientFields.dpopBoundAccessTokens) === null || _j === void 0 ? void 0 : _j.defaultValue).toBe(false);
        (0, vitest_1.expect)((_k = resourceFields.dpopBoundAccessTokensRequired) === null || _k === void 0 ? void 0 : _k.defaultValue).toBe(false);
        (0, vitest_1.expect)(refreshFields.confirmation).toBeDefined();
        (0, vitest_1.expect)(accessFields.confirmation).toBeDefined();
        (0, vitest_1.expect)(refreshFields.authorizationCodeId).toBeDefined();
        (0, vitest_1.expect)(accessFields.authorizationCodeId).toBeDefined();
        // Other sender-constraint/token-format columns are intentionally absent
        // from the schema.
        var deferredOnResource = [
            "tokenFormat",
            "encryptionAlgorithm",
            "encryptionKeyId",
            "requireMtls",
        ];
        for (var _i = 0, deferredOnResource_1 = deferredOnResource; _i < deferredOnResource_1.length; _i++) {
            var fieldName = deferredOnResource_1[_i];
            (0, vitest_1.expect)(resourceFields[fieldName]).toBeUndefined();
        }
        (0, vitest_1.expect)(refreshFields.senderConstraintType).toBeUndefined();
        (0, vitest_1.expect)(refreshFields.senderConstraintKey).toBeUndefined();
    });
});
