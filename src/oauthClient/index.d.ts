import * as z from "zod";
import type { OAuthOptions, Scope } from "../types";
export declare const adminCreateOAuthClient: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/create-client", {
    method: "POST";
    body: z.ZodObject<{
        redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
        scope: z.ZodOptional<z.ZodString>;
        client_name: z.ZodOptional<z.ZodString>;
        client_uri: z.ZodOptional<z.ZodString>;
        logo_uri: z.ZodOptional<z.ZodString>;
        contacts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        tos_uri: z.ZodOptional<z.ZodString>;
        policy_uri: z.ZodOptional<z.ZodString>;
        software_id: z.ZodOptional<z.ZodString>;
        software_version: z.ZodOptional<z.ZodString>;
        software_statement: z.ZodOptional<z.ZodString>;
        post_logout_redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
        backchannel_logout_uri: z.ZodOptional<z.ZodURL>;
        backchannel_logout_session_required: z.ZodOptional<z.ZodBoolean>;
        token_endpoint_auth_method: z.ZodOptional<z.ZodString>;
        application_type: z.ZodOptional<z.ZodEnum<{
            web: "web";
            native: "native";
        }>>;
        jwks: z.ZodOptional<z.ZodObject<{
            keys: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.z.core.$strip>>;
        jwks_uri: z.ZodOptional<z.ZodString>;
        grant_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
        client_credentials_scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        resources: z.ZodOptional<z.ZodArray<z.ZodString>>;
        response_types: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            code: "code";
        }>>>;
        client_secret_expires_at: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>>;
        skip_consent: z.ZodOptional<z.ZodBoolean>;
        enable_end_session: z.ZodOptional<z.ZodBoolean>;
        require_pkce: z.ZodOptional<z.ZodBoolean>;
        dpop_bound_access_tokens: z.ZodOptional<z.ZodBoolean>;
        subject_type: z.ZodOptional<z.ZodEnum<{
            public: "public";
            pairwise: "pairwise";
        }>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.z.core.$strip>;
    metadata: {
        noStore: boolean;
        SERVER_ONLY: true;
        openapi: {
            description: string;
            responses: {
                "201": {
                    description: string;
                    content: {
                        "application/json": {
                            schema: {
                                /** @returns {OauthClient} */
                                type: "object";
                                properties: {
                                    client_id: {
                                        type: string;
                                        description: string;
                                    };
                                    client_secret: {
                                        type: string;
                                        description: string;
                                    };
                                    client_secret_expires_at: {
                                        type: string;
                                        description: string;
                                    };
                                    scope: {
                                        type: string;
                                        description: string;
                                    };
                                    client_credentials_scopes: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                        description: string;
                                    };
                                    user_id: {
                                        type: string;
                                        description: string;
                                    };
                                    client_id_issued_at: {
                                        type: string;
                                        description: string;
                                    };
                                    client_name: {
                                        type: string;
                                        description: string;
                                    };
                                    client_uri: {
                                        type: string;
                                        description: string;
                                    };
                                    logo_uri: {
                                        type: string;
                                        description: string;
                                    };
                                    contacts: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                        description: string;
                                    };
                                    tos_uri: {
                                        type: string;
                                        description: string;
                                    };
                                    policy_uri: {
                                        type: string;
                                        description: string;
                                    };
                                    software_id: {
                                        type: string;
                                        description: string;
                                    };
                                    software_version: {
                                        type: string;
                                        description: string;
                                    };
                                    software_statement: {
                                        type: string;
                                        description: string;
                                    };
                                    redirect_uris: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                        description: string;
                                    };
                                    token_endpoint_auth_method: {
                                        type: string;
                                        description: string;
                                    };
                                    grant_types: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                        description: string;
                                    };
                                    response_types: {
                                        type: string;
                                        items: {
                                            type: string;
                                            enum: string[];
                                        };
                                        description: string;
                                    };
                                    application_type: {
                                        type: string;
                                        description: string;
                                        enum: string[];
                                    };
                                    resources: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                        description: string;
                                    };
                                    disabled: {
                                        type: string;
                                        description: string;
                                    };
                                    require_pkce: {
                                        type: string;
                                        description: string;
                                        default: boolean;
                                    };
                                    metadata: {
                                        type: string;
                                        additionalProperties: boolean;
                                        nullable: boolean;
                                        description: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
            };
        };
    };
}, import("../types").OAuthClientAdministrativeResponse>;
export declare const createOAuthClient: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/create-client", {
    method: "POST";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    body: z.ZodObject<{
        redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
        scope: z.ZodOptional<z.ZodString>;
        client_name: z.ZodOptional<z.ZodString>;
        client_uri: z.ZodOptional<z.ZodString>;
        logo_uri: z.ZodOptional<z.ZodString>;
        contacts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        tos_uri: z.ZodOptional<z.ZodString>;
        policy_uri: z.ZodOptional<z.ZodString>;
        software_id: z.ZodOptional<z.ZodString>;
        software_version: z.ZodOptional<z.ZodString>;
        software_statement: z.ZodOptional<z.ZodString>;
        post_logout_redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
        backchannel_logout_uri: z.ZodOptional<z.ZodURL>;
        backchannel_logout_session_required: z.ZodOptional<z.ZodBoolean>;
        token_endpoint_auth_method: z.ZodOptional<z.ZodString>;
        application_type: z.ZodOptional<z.ZodEnum<{
            web: "web";
            native: "native";
        }>>;
        jwks: z.ZodOptional<z.ZodObject<{
            keys: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.z.core.$strip>>;
        jwks_uri: z.ZodOptional<z.ZodString>;
        grant_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
        response_types: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            code: "code";
        }>>>;
        dpop_bound_access_tokens: z.ZodOptional<z.ZodBoolean>;
    }, z.z.core.$strip>;
    metadata: {
        noStore: boolean;
        openapi: {
            description: string;
            responses: {
                "201": {
                    description: string;
                    content: {
                        "application/json": {
                            schema: {
                                /** @returns {OauthClient} */
                                type: "object";
                                properties: {
                                    client_id: {
                                        type: string;
                                        description: string;
                                    };
                                    client_secret: {
                                        type: string;
                                        description: string;
                                    };
                                    client_secret_expires_at: {
                                        type: string;
                                        description: string;
                                    };
                                    scope: {
                                        type: string;
                                        description: string;
                                    };
                                    user_id: {
                                        type: string;
                                        description: string;
                                    };
                                    client_id_issued_at: {
                                        type: string;
                                        description: string;
                                    };
                                    client_name: {
                                        type: string;
                                        description: string;
                                    };
                                    client_uri: {
                                        type: string;
                                        description: string;
                                    };
                                    logo_uri: {
                                        type: string;
                                        description: string;
                                    };
                                    contacts: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                        description: string;
                                    };
                                    tos_uri: {
                                        type: string;
                                        description: string;
                                    };
                                    policy_uri: {
                                        type: string;
                                        description: string;
                                    };
                                    software_id: {
                                        type: string;
                                        description: string;
                                    };
                                    software_version: {
                                        type: string;
                                        description: string;
                                    };
                                    software_statement: {
                                        type: string;
                                        description: string;
                                    };
                                    redirect_uris: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                        description: string;
                                    };
                                    token_endpoint_auth_method: {
                                        type: string;
                                        description: string;
                                    };
                                    grant_types: {
                                        type: string;
                                        items: {
                                            type: string;
                                        };
                                        description: string;
                                    };
                                    response_types: {
                                        type: string;
                                        items: {
                                            type: string;
                                            enum: string[];
                                        };
                                        description: string;
                                    };
                                    application_type: {
                                        type: string;
                                        description: string;
                                        enum: string[];
                                    };
                                    resources: {
                                        type: string;
                                        items: {
                                            type: string;
                                            format: string;
                                        };
                                        description: string;
                                    };
                                    disabled: {
                                        type: string;
                                        description: string;
                                    };
                                    metadata: {
                                        type: string;
                                        additionalProperties: boolean;
                                        nullable: boolean;
                                        description: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
            };
        };
    };
}, import("../types").OAuthClientRegistrationResponse>;
export declare const getOAuthClient: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/get-client", {
    method: "GET";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    query: z.ZodObject<{
        client_id: z.ZodString;
    }, z.z.core.$strip>;
    metadata: {
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthClient>;
export declare const getOAuthClientPublic: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/public-client", {
    method: "GET";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    query: z.ZodObject<{
        client_id: z.ZodString;
    }, z.z.core.$strip>;
    metadata: {
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthClient>;
export declare const getOAuthClientPublicPrelogin: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/public-client-prelogin", {
    method: "POST";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>>[];
    body: z.ZodObject<{
        client_id: z.ZodString;
        oauth_query: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>;
    metadata: {
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthClient>;
export declare const getOAuthClients: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/get-clients", {
    method: "GET";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    metadata: {
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthClient[]>;
export declare const adminUpdateOAuthClient: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/update-client", {
    method: "PATCH";
    body: z.ZodObject<{
        client_id: z.ZodString;
        update: z.ZodObject<{
            redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
            scope: z.ZodOptional<z.ZodString>;
            client_name: z.ZodOptional<z.ZodString>;
            client_uri: z.ZodOptional<z.ZodString>;
            logo_uri: z.ZodOptional<z.ZodString>;
            contacts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            tos_uri: z.ZodOptional<z.ZodString>;
            policy_uri: z.ZodOptional<z.ZodString>;
            software_id: z.ZodOptional<z.ZodString>;
            software_version: z.ZodOptional<z.ZodString>;
            software_statement: z.ZodOptional<z.ZodString>;
            post_logout_redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
            backchannel_logout_uri: z.ZodOptional<z.ZodURL>;
            backchannel_logout_session_required: z.ZodOptional<z.ZodBoolean>;
            application_type: z.ZodOptional<z.ZodEnum<{
                web: "web";
                native: "native";
            }>>;
            grant_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
            client_credentials_scopes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            response_types: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                code: "code";
            }>>>;
            client_secret_expires_at: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            skip_consent: z.ZodOptional<z.ZodBoolean>;
            enable_end_session: z.ZodOptional<z.ZodBoolean>;
            disabled: z.ZodOptional<z.ZodBoolean>;
            dpop_bound_access_tokens: z.ZodOptional<z.ZodBoolean>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    metadata: {
        SERVER_ONLY: true;
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthClientAdministrativeResponse>;
export declare const updateOAuthClient: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/update-client", {
    method: "POST";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    body: z.ZodObject<{
        client_id: z.ZodString;
        update: z.ZodObject<{
            redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
            scope: z.ZodOptional<z.ZodString>;
            client_name: z.ZodOptional<z.ZodString>;
            client_uri: z.ZodOptional<z.ZodString>;
            logo_uri: z.ZodOptional<z.ZodString>;
            contacts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            tos_uri: z.ZodOptional<z.ZodString>;
            policy_uri: z.ZodOptional<z.ZodString>;
            software_id: z.ZodOptional<z.ZodString>;
            software_version: z.ZodOptional<z.ZodString>;
            software_statement: z.ZodOptional<z.ZodString>;
            post_logout_redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
            backchannel_logout_uri: z.ZodOptional<z.ZodURL>;
            backchannel_logout_session_required: z.ZodOptional<z.ZodBoolean>;
            application_type: z.ZodOptional<z.ZodEnum<{
                web: "web";
                native: "native";
            }>>;
            grant_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
            response_types: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                code: "code";
            }>>>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    metadata: {
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthClientRegistrationResponse>;
export declare const rotateClientSecret: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/client/rotate-secret", {
    method: "POST";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    body: z.ZodObject<{
        client_id: z.ZodString;
    }, z.z.core.$strip>;
    metadata: {
        noStore: boolean;
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthClient>;
/**
 * Replaces a `private_key_jwt` client's own signing keys. The client proves it
 * holds a current key with a client assertion, so no session is needed.
 */
export declare const rotateClientKeys: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/client/rotate-keys", {
    method: "POST";
    body: z.ZodObject<{
        client_assertion: z.ZodString;
        client_assertion_type: z.ZodString;
        jwks: z.ZodObject<{
            keys: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    errorCodesByField: {
        client_assertion: "invalid_client";
        client_assertion_type: "invalid_client";
        jwks: "invalid_client_metadata";
    };
    metadata: {
        noStore: boolean;
        openapi: {
            description: string;
        };
    };
}, {
    client_id: string;
    jwks: import("../client-jwks").ClientJwks;
}>;
export declare const deleteOAuthClient: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/delete-client", {
    method: "POST";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    body: z.ZodObject<{
        client_id: z.ZodString;
    }, z.z.core.$strip>;
    metadata: {
        openapi: {
            description: string;
        };
    };
}, void>;
