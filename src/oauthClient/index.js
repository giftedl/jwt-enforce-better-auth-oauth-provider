"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOAuthClient = exports.rotateClientKeys = exports.rotateClientSecret = exports.updateOAuthClient = exports.adminUpdateOAuthClient = exports.getOAuthClients = exports.getOAuthClientPublicPrelogin = exports.getOAuthClientPublic = exports.getOAuthClient = exports.createOAuthClient = exports.adminCreateOAuthClient = void 0;
var api_1 = require("better-auth/api");
var z = require("zod");
var middleware_1 = require("../middleware");
var oauth_endpoint_1 = require("../oauth-endpoint");
var register_1 = require("../register");
var zod_1 = require("../types/zod");
var endpoints_1 = require("./endpoints");
var tokenEndpointAuthMethodSchema = z.string().trim().min(1);
var grantTypesSchema = z.array(z.string().trim().min(1)).min(1);
var adminCreateOAuthClient = function (opts) {
    return (0, api_1.createAuthEndpoint)("/admin/oauth2/create-client", {
        method: "POST",
        body: z.object({
            redirect_uris: z.array(zod_1.RedirectUriSyntaxSchema).min(1).optional(),
            scope: z.string().optional(),
            client_name: z.string().optional(),
            client_uri: z.string().optional(),
            logo_uri: z.string().optional(),
            contacts: z.array(z.string().min(1)).min(1).optional(),
            tos_uri: z.string().optional(),
            policy_uri: z.string().optional(),
            software_id: z.string().optional(),
            software_version: z.string().optional(),
            software_statement: z.string().optional(),
            post_logout_redirect_uris: z
                .array(zod_1.RedirectUriSyntaxSchema)
                .min(1)
                .optional(),
            backchannel_logout_uri: zod_1.SafeUrlSchema.optional(),
            backchannel_logout_session_required: z.boolean().optional(),
            token_endpoint_auth_method: tokenEndpointAuthMethodSchema.optional(),
            application_type: z.enum(["web", "native"]).optional(),
            jwks: zod_1.clientJwksSchema.optional(),
            jwks_uri: z.string().optional(),
            grant_types: grantTypesSchema.optional(),
            client_credentials_scopes: z.array(z.string().trim().min(1)).optional(),
            resources: z.array(zod_1.ResourceUriSchema).optional(),
            response_types: z.array(z.enum(["code"])).optional(),
            // SERVER_ONLY applicable fields
            client_secret_expires_at: z
                .union([z.string(), z.number()])
                .optional()
                .default(0),
            skip_consent: z.boolean().optional(),
            enable_end_session: z.boolean().optional(),
            require_pkce: z.boolean().optional(),
            // RFC 9449 §5.2: client asks for DPoP-bound access tokens.
            dpop_bound_access_tokens: z.boolean().optional(),
            subject_type: z.enum(["public", "pairwise"]).optional(),
            metadata: z.record(z.string(), z.unknown()).optional(),
        }),
        metadata: {
            noStore: true,
            SERVER_ONLY: true,
            openapi: {
                description: "Register an OAuth2 application",
                responses: {
                    "201": {
                        description: "OAuth2 application registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    /** @returns {OauthClient} */
                                    type: "object",
                                    properties: {
                                        client_id: {
                                            type: "string",
                                            description: "Unique identifier for the client",
                                        },
                                        client_secret: {
                                            type: "string",
                                            description: "Secret key for the client",
                                        },
                                        client_secret_expires_at: {
                                            type: "number",
                                            description: "Time the client secret will expire. If 0, the client secret will never expire.",
                                        },
                                        scope: {
                                            type: "string",
                                            description: "Space-separated scopes allowed by the client",
                                        },
                                        client_credentials_scopes: {
                                            type: "array",
                                            items: { type: "string" },
                                            description: "Server-authorized scope ceiling for client_credentials tokens",
                                        },
                                        user_id: {
                                            type: "string",
                                            description: "ID of the user who registered the client, null if registered anonymously",
                                        },
                                        client_id_issued_at: {
                                            type: "number",
                                            description: "Creation timestamp of this client",
                                        },
                                        client_name: {
                                            type: "string",
                                            description: "Name of the OAuth2 application",
                                        },
                                        client_uri: {
                                            type: "string",
                                            description: "URI of the OAuth2 application",
                                        },
                                        logo_uri: {
                                            type: "string",
                                            description: "Icon URI for the application",
                                        },
                                        contacts: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                            description: "List representing ways to contact people responsible for this client, typically email addresses",
                                        },
                                        tos_uri: {
                                            type: "string",
                                            description: "Client's terms of service uri",
                                        },
                                        policy_uri: {
                                            type: "string",
                                            description: "Client's policy uri",
                                        },
                                        software_id: {
                                            type: "string",
                                            description: "Unique identifier assigned by the developer to help in the dynamic registration process",
                                        },
                                        software_version: {
                                            type: "string",
                                            description: "Version identifier for the software_id",
                                        },
                                        software_statement: {
                                            type: "string",
                                            description: "JWT containing metadata values about the client software as claims",
                                        },
                                        redirect_uris: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                format: "uri",
                                            },
                                            description: "List of allowed redirect uris",
                                        },
                                        token_endpoint_auth_method: {
                                            type: "string",
                                            description: "Requested authentication method for the token endpoint",
                                        },
                                        grant_types: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                            description: "Grant types the client may use at the token endpoint",
                                        },
                                        response_types: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                enum: ["code"],
                                            },
                                            description: "Response types the client may use at the authorization endpoint",
                                        },
                                        application_type: {
                                            type: "string",
                                            description: "OIDC application type used to classify redirect URI policy",
                                            enum: ["web", "native"],
                                        },
                                        resources: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                format: "uri",
                                            },
                                            description: "Final server-owned resources linked to the client",
                                        },
                                        disabled: {
                                            type: "boolean",
                                            description: "Whether the client is disabled",
                                        },
                                        require_pkce: {
                                            type: "boolean",
                                            description: "Whether the client requires PKCE",
                                            default: true,
                                        },
                                        metadata: {
                                            type: "object",
                                            additionalProperties: true,
                                            nullable: true,
                                            description: "Additional metadata for the application",
                                        },
                                    },
                                    required: ["client_id"],
                                },
                            },
                        },
                    },
                },
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, register_1.createOAuthClientEndpoint)(ctx, opts, { admin: true })];
        });
    }); });
};
exports.adminCreateOAuthClient = adminCreateOAuthClient;
var createOAuthClient = function (opts) {
    return (0, api_1.createAuthEndpoint)("/oauth2/create-client", {
        method: "POST",
        use: [api_1.sessionMiddleware],
        body: z.object({
            redirect_uris: z.array(zod_1.RedirectUriSyntaxSchema).min(1).optional(),
            scope: z.string().optional(),
            client_name: z.string().optional(),
            client_uri: z.string().optional(),
            logo_uri: z.string().optional(),
            contacts: z.array(z.string().min(1)).min(1).optional(),
            tos_uri: z.string().optional(),
            policy_uri: z.string().optional(),
            software_id: z.string().optional(),
            software_version: z.string().optional(),
            software_statement: z.string().optional(),
            post_logout_redirect_uris: z
                .array(zod_1.RedirectUriSyntaxSchema)
                .min(1)
                .optional(),
            backchannel_logout_uri: zod_1.SafeUrlSchema.optional(),
            backchannel_logout_session_required: z.boolean().optional(),
            token_endpoint_auth_method: tokenEndpointAuthMethodSchema.optional(),
            application_type: z.enum(["web", "native"]).optional(),
            jwks: zod_1.clientJwksSchema.optional(),
            jwks_uri: z.string().optional(),
            grant_types: grantTypesSchema.optional(),
            response_types: z.array(z.enum(["code"])).optional(),
            // RFC 9449 §5.2: client asks for DPoP-bound access tokens.
            dpop_bound_access_tokens: z.boolean().optional(),
        }),
        metadata: {
            noStore: true,
            openapi: {
                description: "Register an OAuth2 application",
                responses: {
                    "201": {
                        description: "OAuth2 application registered successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    /** @returns {OauthClient} */
                                    type: "object",
                                    properties: {
                                        client_id: {
                                            type: "string",
                                            description: "Unique identifier for the client",
                                        },
                                        client_secret: {
                                            type: "string",
                                            description: "Secret key for the client",
                                        },
                                        client_secret_expires_at: {
                                            type: "number",
                                            description: "Time the client secret will expire. If 0, the client secret will never expire.",
                                        },
                                        scope: {
                                            type: "string",
                                            description: "Space-separated scopes allowed by the client",
                                        },
                                        user_id: {
                                            type: "string",
                                            description: "ID of the user who registered the client, null if registered anonymously",
                                        },
                                        client_id_issued_at: {
                                            type: "number",
                                            description: "Creation timestamp of this client",
                                        },
                                        client_name: {
                                            type: "string",
                                            description: "Name of the OAuth2 application",
                                        },
                                        client_uri: {
                                            type: "string",
                                            description: "URI of the OAuth2 application",
                                        },
                                        logo_uri: {
                                            type: "string",
                                            description: "Icon URI for the application",
                                        },
                                        contacts: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                            description: "List representing ways to contact people responsible for this client, typically email addresses",
                                        },
                                        tos_uri: {
                                            type: "string",
                                            description: "Client's terms of service uri",
                                        },
                                        policy_uri: {
                                            type: "string",
                                            description: "Client's policy uri",
                                        },
                                        software_id: {
                                            type: "string",
                                            description: "Unique identifier assigned by the developer to help in the dynamic registration process",
                                        },
                                        software_version: {
                                            type: "string",
                                            description: "Version identifier for the software_id",
                                        },
                                        software_statement: {
                                            type: "string",
                                            description: "JWT containing metadata values about the client software as claims",
                                        },
                                        redirect_uris: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                format: "uri",
                                            },
                                            description: "List of allowed redirect uris",
                                        },
                                        token_endpoint_auth_method: {
                                            type: "string",
                                            description: "Requested authentication method for the token endpoint",
                                        },
                                        grant_types: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                            },
                                            description: "Grant types the client may use at the token endpoint",
                                        },
                                        response_types: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                enum: ["code"],
                                            },
                                            description: "Response types the client may use at the authorization endpoint",
                                        },
                                        application_type: {
                                            type: "string",
                                            description: "OIDC application type used to classify redirect URI policy",
                                            enum: ["web", "native"],
                                        },
                                        resources: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                format: "uri",
                                            },
                                            description: "Final server-owned resources linked to the client",
                                        },
                                        disabled: {
                                            type: "boolean",
                                            description: "Whether the client is disabled",
                                        },
                                        metadata: {
                                            type: "object",
                                            additionalProperties: true,
                                            nullable: true,
                                            description: "Additional metadata for the application",
                                        },
                                    },
                                    required: ["client_id"],
                                },
                            },
                        },
                    },
                },
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, register_1.createOAuthClientEndpoint)(ctx, opts)];
        });
    }); });
};
exports.createOAuthClient = createOAuthClient;
var getOAuthClient = function (opts) {
    return (0, api_1.createAuthEndpoint)("/oauth2/get-client", {
        method: "GET",
        use: [api_1.sessionMiddleware],
        query: z.object({
            client_id: z.string(),
        }),
        metadata: {
            openapi: {
                description: "Get OAuth2 formatted client details",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, endpoints_1.getClientEndpoint)(ctx, opts)];
        });
    }); });
};
exports.getOAuthClient = getOAuthClient;
var getOAuthClientPublic = function (opts) {
    return (0, api_1.createAuthEndpoint)("/oauth2/public-client", {
        method: "GET",
        use: [api_1.sessionMiddleware],
        query: z.object({
            client_id: z.string(),
        }),
        metadata: {
            openapi: {
                description: "Gets publicly available client fields",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var clientId;
        return __generator(this, function (_a) {
            clientId = ctx.query.client_id;
            return [2 /*return*/, (0, endpoints_1.getClientPublicEndpoint)(ctx, opts, clientId)];
        });
    }); });
};
exports.getOAuthClientPublic = getOAuthClientPublic;
var getOAuthClientPublicPrelogin = function (opts) {
    return (0, api_1.createAuthEndpoint)("/oauth2/public-client-prelogin", {
        method: "POST",
        use: [(0, middleware_1.publicSessionMiddleware)(opts)],
        body: z.object({
            client_id: z.string(),
            oauth_query: z.string().optional(),
        }),
        metadata: {
            openapi: {
                description: "Gets publicly available client fields (prior to login)",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var clientId;
        return __generator(this, function (_a) {
            clientId = ctx.body.client_id;
            return [2 /*return*/, (0, endpoints_1.getClientPublicEndpoint)(ctx, opts, clientId)];
        });
    }); });
};
exports.getOAuthClientPublicPrelogin = getOAuthClientPublicPrelogin;
var getOAuthClients = function (opts) {
    return (0, api_1.createAuthEndpoint)("/oauth2/get-clients", {
        method: "GET",
        use: [api_1.sessionMiddleware],
        metadata: {
            openapi: {
                description: "Get OAuth2 formatted client details for a user or organization",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, endpoints_1.getClientsEndpoint)(ctx, opts)];
        });
    }); });
};
exports.getOAuthClients = getOAuthClients;
var adminUpdateOAuthClient = function (opts) {
    return (0, api_1.createAuthEndpoint)("/admin/oauth2/update-client", {
        method: "PATCH",
        body: z.object({
            client_id: z.string(),
            update: z.object({
                redirect_uris: z.array(zod_1.RedirectUriSyntaxSchema).min(1).optional(),
                scope: z.string().optional(),
                client_name: z.string().optional(),
                client_uri: z.string().optional(),
                logo_uri: z.string().optional(),
                contacts: z.array(z.string().min(1)).min(1).optional(),
                tos_uri: z.string().optional(),
                policy_uri: z.string().optional(),
                software_id: z.string().optional(),
                software_version: z.string().optional(),
                software_statement: z.string().optional(),
                post_logout_redirect_uris: z
                    .array(zod_1.RedirectUriSyntaxSchema)
                    .min(1)
                    .optional(),
                backchannel_logout_uri: zod_1.SafeUrlSchema.optional(),
                backchannel_logout_session_required: z.boolean().optional(),
                // token_endpoint_auth_method is immutable because changing the
                // registered authentication method also changes credential handling.
                application_type: z.enum(["web", "native"]).optional(),
                grant_types: grantTypesSchema.optional(),
                client_credentials_scopes: z
                    .array(z.string().trim().min(1))
                    .optional(),
                response_types: z.array(z.enum(["code"])).optional(),
                // SERVER_ONLY applicable fields
                client_secret_expires_at: z
                    .union([z.string(), z.number()])
                    .optional(),
                skip_consent: z.boolean().optional(),
                enable_end_session: z.boolean().optional(),
                disabled: z.boolean().optional(),
                // RFC 9449 §5.2: client asks for DPoP-bound access tokens.
                dpop_bound_access_tokens: z.boolean().optional(),
                metadata: z.record(z.string(), z.unknown()).optional(),
            }),
        }),
        metadata: {
            SERVER_ONLY: true,
            openapi: {
                description: "Updates OAuth2 formatted client details.",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, endpoints_1.updateClientEndpoint)(ctx, opts, { admin: true })];
        });
    }); });
};
exports.adminUpdateOAuthClient = adminUpdateOAuthClient;
var updateOAuthClient = function (opts) {
    return (0, api_1.createAuthEndpoint)("/oauth2/update-client", {
        method: "POST",
        use: [api_1.sessionMiddleware],
        body: z.object({
            client_id: z.string(),
            update: z.object({
                redirect_uris: z.array(zod_1.RedirectUriSyntaxSchema).min(1).optional(),
                scope: z.string().optional(),
                client_name: z.string().optional(),
                client_uri: z.string().optional(),
                logo_uri: z.string().optional(),
                contacts: z.array(z.string().min(1)).min(1).optional(),
                tos_uri: z.string().optional(),
                policy_uri: z.string().optional(),
                software_id: z.string().optional(),
                software_version: z.string().optional(),
                software_statement: z.string().optional(),
                post_logout_redirect_uris: z
                    .array(zod_1.RedirectUriSyntaxSchema)
                    .min(1)
                    .optional(),
                backchannel_logout_uri: zod_1.SafeUrlSchema.optional(),
                backchannel_logout_session_required: z.boolean().optional(),
                // token_endpoint_auth_method is immutable because changing the
                // registered authentication method also changes credential handling.
                application_type: z.enum(["web", "native"]).optional(),
                grant_types: grantTypesSchema.optional(),
                response_types: z.array(z.enum(["code"])).optional(),
            }),
        }),
        metadata: {
            openapi: {
                description: "Updates OAuth2 formatted client details.",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, endpoints_1.updateClientEndpoint)(ctx, opts)];
        });
    }); });
};
exports.updateOAuthClient = updateOAuthClient;
var rotateClientSecret = function (opts) {
    return (0, api_1.createAuthEndpoint)("/oauth2/client/rotate-secret", {
        method: "POST",
        use: [api_1.sessionMiddleware],
        body: z.object({
            client_id: z.string(),
        }),
        metadata: {
            noStore: true,
            openapi: {
                description: "Rotates a confidential client's secret",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, endpoints_1.rotateClientSecretEndpoint)(ctx, opts)];
        });
    }); });
};
exports.rotateClientSecret = rotateClientSecret;
/**
 * Replaces a `private_key_jwt` client's own signing keys. The client proves it
 * holds a current key with a client assertion, so no session is needed.
 */
var rotateClientKeys = function (opts) {
    return (0, oauth_endpoint_1.createOAuthEndpoint)("/oauth2/client/rotate-keys", {
        method: "POST",
        body: z.object({
            client_assertion: z.string(),
            client_assertion_type: z.string(),
            jwks: zod_1.clientJwksSchema,
        }),
        errorCodesByField: {
            client_assertion: "invalid_client",
            client_assertion_type: "invalid_client",
            jwks: "invalid_client_metadata",
        },
        metadata: {
            noStore: true,
            openapi: {
                description: "Replaces the signing keys of a private_key_jwt client. The request is authenticated by a client assertion signed with one of the client's current keys and addressed to this endpoint. Keys left out of the new set stop verifying at once.",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, endpoints_1.rotateClientKeysEndpoint)(ctx, opts)];
        });
    }); });
};
exports.rotateClientKeys = rotateClientKeys;
var deleteOAuthClient = function (opts) {
    return (0, api_1.createAuthEndpoint)("/oauth2/delete-client", {
        method: "POST",
        use: [api_1.sessionMiddleware],
        body: z.object({
            client_id: z.string(),
        }),
        metadata: {
            openapi: {
                description: "Deletes an oauth client",
            },
        },
    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, endpoints_1.deleteClientEndpoint)(ctx, opts)];
        });
    }); });
};
exports.deleteOAuthClient = deleteOAuthClient;
