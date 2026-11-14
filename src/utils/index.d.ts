import type { AuthContext, GenericEndpointContext } from "@better-auth/core";
import type { ClientDiscovery, Confirmation, GrantType, OAuthConsent, OAuthOptions, Prompt, SchemaClient, Scope, StoreTokenType, TokenEndpointAuthMethod } from "../types";
export { getSignedQueryIssuedAt, postLoginClearedParam, signedQueryIssuedAtParam, } from "../signed-query";
/**
 * Extracts the credentials from an `Authorization: Bearer <token>` header.
 *
 * Returns `undefined` when the header is absent or carries a non-Bearer scheme,
 * leaving the caller to decide whether that is an error. Throws an
 * `invalid_request` `APIError` when the Bearer scheme is present but the
 * credentials are missing or the header carries extra parts. The scheme match
 * is case-insensitive and the credentials are the single token after it.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
 * @see https://datatracker.ietf.org/doc/html/rfc7235#section-2.1
 */
export declare function parseBearerToken(authorization: string | null | undefined): string | undefined;
/**
 * Gets the oAuth Provider Plugin
 * @internal
 */
export declare const getOAuthProviderPlugin: (ctx: AuthContext) => {
    id: "oauth-provider";
    version: any;
    options: NoInfer<OAuthOptions<Scope[]>>;
    onRequest: (request: Request, ctx: AuthContext) => Promise<{
        response: Response;
    } | {
        request: Request;
    } | void>;
    init: (ctx: AuthContext) => Promise<{
        options: {
            databaseHooks: {
                session: {
                    delete: {
                        before(session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string;
                            userAgent?: string;
                        } & Record<string, unknown>, hookCtx: GenericEndpointContext): Promise<void>;
                        after(session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string;
                            userAgent?: string;
                        } & Record<string, unknown>, hookCtx: GenericEndpointContext): Promise<void>;
                    };
                };
            };
        };
    }>;
    hooks: {
        before: {
            matcher(ctx: import("@better-auth/core").HookEndpointContext): any;
            handler: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>>;
        }[];
        after: {
            matcher(ctx: import("@better-auth/core").HookEndpointContext): boolean;
            handler: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<import("../authorize").OAuthRedirectResult>>;
        }[];
    };
    endpoints: {
        getOAuthServerConfig: import("better-call").StrictEndpoint<"/.well-known/oauth-authorization-server", {
            method: "GET";
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("../types").AuthServerMetadata>;
        getOpenIdConfig: import("better-call").StrictEndpoint<"/.well-known/openid-configuration", {
            method: "GET";
            metadata: {
                SERVER_ONLY: true;
            };
        }, {
            jwks_uri?: string;
            userinfo_endpoint: string;
            acr_values_supported?: string[];
            subject_types_supported: ("public" | "pairwise")[];
            claims_supported: string[];
            claims_parameter_supported?: boolean;
            end_session_endpoint: string;
            request_parameter_supported?: boolean;
            request_uri_parameter_supported?: boolean;
            prompt_values_supported: Prompt[];
            issuer: string;
            authorization_endpoint: string;
            token_endpoint: string;
            registration_endpoint?: string;
            scopes_supported?: string[];
            response_types_supported: "code"[];
            response_modes_supported: "query"[];
            grant_types_supported: GrantType[];
            token_endpoint_auth_methods_supported?: TokenEndpointAuthMethod[];
            token_endpoint_auth_signing_alg_values_supported?: import("@better-auth/core/oauth2").PrivateKeyJwtSigningAlgorithm[];
            service_documentation?: string;
            ui_locales_supported?: string[];
            op_policy_uri?: string;
            op_tos_uri?: string;
            revocation_endpoint?: string;
            revocation_endpoint_auth_methods_supported?: TokenEndpointAuthMethod[];
            revocation_endpoint_auth_signing_alg_values_supported?: import("@better-auth/core/oauth2").PrivateKeyJwtSigningAlgorithm[];
            introspection_endpoint?: string;
            introspection_endpoint_auth_methods_supported?: TokenEndpointAuthMethod[];
            introspection_endpoint_auth_signing_alg_values_supported?: import("@better-auth/core/oauth2").PrivateKeyJwtSigningAlgorithm[];
            code_challenge_methods_supported: "S256"[];
            authorization_response_iss_parameter_supported?: boolean;
            client_id_metadata_document_supported?: boolean;
            backchannel_logout_supported?: boolean;
            backchannel_logout_session_supported?: boolean;
            dpop_signing_alg_values_supported?: import("better-auth/plugins").JWSAlgorithms[];
            id_token_signing_alg_values_supported: import("better-auth/plugins").JWSAlgorithms[] | ["HS256"];
        }>;
        oauth2Authorize: import("better-call").StrictEndpoint<string, {
            method: ("GET" | "POST")[];
            body: import("zod").ZodObject<{}, import("zod/v4/core").$loose>;
            redirectOnError: import("..").OAuthRedirectOnError<GenericEndpointContext, import("../authorize").OAuthRedirectResult>;
            metadata: {
                allowedMediaTypes: string[];
                openapi: {
                    description: string;
                    parameters: ({
                        name: string;
                        in: "query";
                        required: false;
                        schema: {
                            type: "string";
                            format?: undefined;
                            minimum?: undefined;
                            items?: undefined;
                        };
                        description: string;
                    } | {
                        name: string;
                        in: "query";
                        required: true;
                        schema: {
                            type: "string";
                            format?: undefined;
                            minimum?: undefined;
                            items?: undefined;
                        };
                        description: string;
                    } | {
                        name: string;
                        in: "query";
                        required: false;
                        schema: {
                            type: "string";
                            format: string;
                            minimum?: undefined;
                            items?: undefined;
                        };
                        description: string;
                    } | {
                        name: string;
                        in: "query";
                        required: false;
                        schema: {
                            type: "integer";
                            minimum: number;
                            format?: undefined;
                            items?: undefined;
                        };
                        description: string;
                    } | {
                        name: string;
                        in: "query";
                        required: false;
                        schema: {
                            type: "array";
                            items: {
                                type: "string";
                            };
                            format?: undefined;
                            minimum?: undefined;
                        };
                        description: string;
                    })[];
                    responses: {
                        "302": {
                            description: string;
                            headers: {
                                Location: {
                                    description: string;
                                    schema: {
                                        type: string;
                                        format: string;
                                    };
                                };
                            };
                        };
                        "400": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                            };
                                            error_description: {
                                                type: string;
                                            };
                                            state: {
                                                type: string;
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
        }, import("../authorize").OAuthRedirectResult>;
        oauth2Consent: import("better-call").StrictEndpoint<"/oauth2/consent", {
            method: "POST";
            body: import("zod").ZodObject<{
                accept: import("zod").ZodBoolean;
                scope: import("zod").ZodOptional<import("zod").ZodString>;
                claims: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>]>>;
                oauth_query: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
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
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            redirect: {
                                                type: string;
                                                description: string;
                                                enum: boolean[];
                                            };
                                            url: {
                                                type: string;
                                                format: string;
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
        }, import("../authorize").OAuthRedirectResult | {
            redirect: boolean;
            url: string;
        }>;
        oauth2Continue: import("better-call").StrictEndpoint<"/oauth2/continue", {
            method: "POST";
            body: import("zod").ZodObject<{
                selected: import("zod").ZodOptional<import("zod").ZodBoolean>;
                created: import("zod").ZodOptional<import("zod").ZodBoolean>;
                postLogin: import("zod").ZodOptional<import("zod").ZodBoolean>;
                oauth_query: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
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
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            redirect: {
                                                type: string;
                                                description: string;
                                                enum: boolean[];
                                            };
                                            url: {
                                                type: string;
                                                format: string;
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
        }, import("../authorize").OAuthRedirectResult>;
        oauth2Token: import("better-call").StrictEndpoint<"/oauth2/token", {
            method: "POST";
            cloneRequest: true;
            body: import("zod").ZodObject<{
                grant_type: import("zod").ZodString;
                client_id: import("zod").ZodOptional<import("zod").ZodString>;
                client_secret: import("zod").ZodOptional<import("zod").ZodString>;
                client_assertion: import("zod").ZodOptional<import("zod").ZodString>;
                client_assertion_type: import("zod").ZodOptional<import("zod").ZodString>;
                code: import("zod").ZodOptional<import("zod").ZodString>;
                code_verifier: import("zod").ZodOptional<import("zod").ZodString>;
                redirect_uri: import("zod").ZodOptional<import("zod").ZodURL>;
                refresh_token: import("zod").ZodOptional<import("zod").ZodString>;
                resource: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>>;
                scope: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$loose>;
            errorCodesByField: {
                grant_type: {
                    missing: "invalid_request";
                    invalid: "unsupported_grant_type";
                };
                resource: {
                    invalid: "invalid_target";
                };
            };
            metadata: {
                noStore: boolean;
                allowedMediaTypes: string[];
                openapi: {
                    description: string;
                    parameters: {
                        name: string;
                        in: "header";
                        required: false;
                        schema: {
                            type: "string";
                        };
                        description: string;
                    }[];
                    requestBody: {
                        required: boolean;
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        grant_type: {
                                            type: string;
                                            description: string;
                                        };
                                        client_id: {
                                            type: string;
                                            description: string;
                                        };
                                        client_secret: {
                                            type: string;
                                            description: string;
                                        };
                                        code: {
                                            type: string;
                                            description: string;
                                        };
                                        code_verifier: {
                                            type: string;
                                            description: string;
                                        };
                                        redirect_uri: {
                                            type: string;
                                            format: string;
                                            description: string;
                                        };
                                        refresh_token: {
                                            type: string;
                                            description: string;
                                        };
                                        resource: {
                                            oneOf: ({
                                                type: string;
                                                description: string;
                                                items?: undefined;
                                            } | {
                                                type: string;
                                                items: {
                                                    type: string;
                                                };
                                                description: string;
                                            })[];
                                            description: string;
                                        };
                                        scope: {
                                            type: string;
                                            description: string;
                                        };
                                    };
                                    required: string[];
                                };
                            };
                        };
                    };
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            access_token: {
                                                type: string;
                                                description: string;
                                            };
                                            token_type: {
                                                type: string;
                                                description: string;
                                                enum: string[];
                                            };
                                            expires_in: {
                                                type: string;
                                                description: string;
                                            };
                                            refresh_token: {
                                                type: string;
                                                description: string;
                                            };
                                            scope: {
                                                type: string;
                                                description: string;
                                            };
                                            id_token: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        "400": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                            };
                                            error_description: {
                                                type: string;
                                            };
                                            error_uri: {
                                                type: string;
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
        }, {
            expires_in: number;
            access_token: string;
            expires_at: number;
            token_type: import("../types").TokenType;
            refresh_token: string | undefined;
            scope: string;
            id_token: string | undefined;
        }>;
        oauth2Introspect: import("better-call").StrictEndpoint<"/oauth2/introspect", {
            method: "POST";
            cloneRequest: true;
            body: import("zod").ZodObject<{
                client_id: import("zod").ZodOptional<import("zod").ZodString>;
                client_secret: import("zod").ZodOptional<import("zod").ZodString>;
                client_assertion: import("zod").ZodOptional<import("zod").ZodString>;
                client_assertion_type: import("zod").ZodOptional<import("zod").ZodString>;
                token: import("zod").ZodString;
                token_type_hint: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                noStore: boolean;
                allowedMediaTypes: string[];
                openapi: {
                    description: string;
                    requestBody: {
                        required: boolean;
                        content: {
                            "application/json": {
                                schema: {
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
                                        token: {
                                            type: string;
                                            description: string;
                                        };
                                        token_type_hint: {
                                            type: string;
                                            description: string;
                                        };
                                    };
                                    required: string[];
                                };
                            };
                        };
                    };
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            active: {
                                                type: string;
                                                description: string;
                                            };
                                            scope: {
                                                type: string;
                                                description: string;
                                            };
                                            client_id: {
                                                type: string;
                                                description: string;
                                            };
                                            username: {
                                                type: string;
                                                description: string;
                                            };
                                            token_type: {
                                                type: string;
                                                description: string;
                                            };
                                            exp: {
                                                type: string;
                                                description: string;
                                            };
                                            iat: {
                                                type: string;
                                                description: string;
                                            };
                                            nbf: {
                                                type: string;
                                                description: string;
                                            };
                                            sub: {
                                                type: string;
                                                description: string;
                                            };
                                            aud: {
                                                type: string;
                                                description: string;
                                            };
                                            iss: {
                                                type: string;
                                                description: string;
                                            };
                                            jti: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        "400": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                            };
                                            error_description: {
                                                type: string;
                                            };
                                            error_uri: {
                                                type: string;
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
        }, import("jose").JWTPayload>;
        oauth2Revoke: import("better-call").StrictEndpoint<"/oauth2/revoke", {
            method: "POST";
            cloneRequest: true;
            body: import("zod").ZodObject<{
                client_id: import("zod").ZodOptional<import("zod").ZodString>;
                client_secret: import("zod").ZodOptional<import("zod").ZodString>;
                client_assertion: import("zod").ZodOptional<import("zod").ZodString>;
                client_assertion_type: import("zod").ZodOptional<import("zod").ZodString>;
                token: import("zod").ZodString;
                token_type_hint: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                allowedMediaTypes: string[];
                openapi: {
                    description: string;
                    requestBody: {
                        required: boolean;
                        content: {
                            "application/json": {
                                schema: {
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
                                        token: {
                                            type: string;
                                            description: string;
                                        };
                                        token_type_hint: {
                                            type: string;
                                            description: string;
                                        };
                                    };
                                    required: string[];
                                };
                            };
                        };
                    };
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        description: string;
                                    };
                                };
                            };
                        };
                        "400": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                            };
                                            error_description: {
                                                type: string;
                                            };
                                            error_uri: {
                                                type: string;
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
        }, any>;
        oauth2UserInfo: import("better-call").StrictEndpoint<"/oauth2/userinfo", {
            method: ("GET" | "POST")[];
            body: import("zod").ZodOptional<import("zod").ZodObject<{
                access_token: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$loose>>;
            metadata: {
                noStore: boolean;
                allowedMediaTypes: string[];
                openapi: {
                    description: string;
                    security: ({
                        bearerAuth: any[];
                        OAuth2?: undefined;
                    } | {
                        OAuth2: string[];
                        bearerAuth?: undefined;
                    })[];
                    parameters: {
                        name: string;
                        in: "header";
                        required: false;
                        schema: {
                            type: "string";
                        };
                        description: string;
                    }[];
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            sub: {
                                                type: string;
                                                description: string;
                                            };
                                            email: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            name: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            picture: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            given_name: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            family_name: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            email_verified: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        "401": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                            };
                                            error_description: {
                                                type: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        "403": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                            };
                                            error_description: {
                                                type: string;
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
        }, {
            sub: unknown;
        }>;
        oauth2EndSession: import("better-call").StrictEndpoint<"/oauth2/end-session", {
            method: ("GET" | "POST")[];
            body: import("zod").ZodOptional<import("zod").ZodObject<{
                id_token_hint: import("zod").ZodOptional<import("zod").ZodString>;
                client_id: import("zod").ZodOptional<import("zod").ZodString>;
                post_logout_redirect_uri: import("zod").ZodOptional<import("zod").ZodURL>;
                state: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                id_token_hint: import("zod").ZodOptional<import("zod").ZodString>;
                client_id: import("zod").ZodOptional<import("zod").ZodString>;
                post_logout_redirect_uri: import("zod").ZodOptional<import("zod").ZodURL>;
                state: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            metadata: {
                noStore: boolean;
                allowedMediaTypes: string[];
                $Infer: {
                    body: {
                        id_token_hint?: string;
                        client_id?: string;
                        post_logout_redirect_uri?: string;
                        state?: string;
                    } | {
                        query: {
                            id_token_hint?: string;
                            client_id?: string;
                            post_logout_redirect_uri?: string;
                            state?: string;
                        };
                    };
                    query: {
                        id_token_hint?: string;
                        client_id?: string;
                        post_logout_redirect_uri?: string;
                        state?: string;
                    };
                };
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            redirect_uri: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            message: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                                "text/html": {
                                    schema: {
                                        type: "string";
                                    };
                                };
                            };
                        };
                    };
                };
            };
        }, Response | import("../authorize").OAuthRedirectResult>;
        oauth2EndSessionConfirmation: import("better-call").StrictEndpoint<"/oauth2/end-session/confirm", {
            method: "POST";
            body: import("zod").ZodObject<{
                action: import("zod").ZodLiteral<"confirm">;
            }, import("zod/v4/core").$strip>;
            metadata: {
                noStore: boolean;
                allowedMediaTypes: string[];
                scope: "http";
            };
        }, Response | import("../authorize").OAuthRedirectResult>;
        registerOAuthClient: import("better-call").StrictEndpoint<"/oauth2/register", {
            method: "POST";
            body: import("zod").ZodObject<{
                redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                scope: import("zod").ZodOptional<import("zod").ZodString>;
                client_name: import("zod").ZodOptional<import("zod").ZodString>;
                client_uri: import("zod").ZodOptional<import("zod").ZodString>;
                logo_uri: import("zod").ZodOptional<import("zod").ZodString>;
                contacts: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                tos_uri: import("zod").ZodOptional<import("zod").ZodString>;
                policy_uri: import("zod").ZodOptional<import("zod").ZodString>;
                software_id: import("zod").ZodOptional<import("zod").ZodString>;
                software_version: import("zod").ZodOptional<import("zod").ZodString>;
                software_statement: import("zod").ZodOptional<import("zod").ZodString>;
                post_logout_redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                backchannel_logout_uri: import("zod").ZodOptional<import("zod").ZodURL>;
                backchannel_logout_session_required: import("zod").ZodOptional<import("zod").ZodBoolean>;
                token_endpoint_auth_method: import("zod").ZodOptional<import("zod").ZodString>;
                jwks: import("zod").ZodOptional<import("zod").ZodObject<{
                    keys: import("zod").ZodArray<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>;
                jwks_uri: import("zod").ZodOptional<import("zod").ZodString>;
                grant_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                response_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<{
                    code: "code";
                }>>>;
                application_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                    web: "web";
                    native: "native";
                }>>;
                subject_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                    public: "public";
                    pairwise: "pairwise";
                }>>;
                dpop_bound_access_tokens: import("zod").ZodOptional<import("zod").ZodBoolean>;
                resources: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                skip_consent: import("zod").ZodOptional<import("zod").ZodNever>;
            }, import("zod/v4/core").$strip>;
            errorCodesByField: {
                redirect_uris: "invalid_redirect_uri";
                post_logout_redirect_uris: "invalid_redirect_uri";
                software_statement: "invalid_software_statement";
                resources: "invalid_target";
            };
            defaultError: "invalid_client_metadata";
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
                                            post_logout_redirect_uris: {
                                                type: string;
                                                items: {
                                                    type: string;
                                                    format: string;
                                                };
                                                description: string;
                                            };
                                            backchannel_logout_uri: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            backchannel_logout_session_required: {
                                                type: string;
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
        adminCreateOAuthClient: import("better-call").StrictEndpoint<"/admin/oauth2/create-client", {
            method: "POST";
            body: import("zod").ZodObject<{
                redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                scope: import("zod").ZodOptional<import("zod").ZodString>;
                client_name: import("zod").ZodOptional<import("zod").ZodString>;
                client_uri: import("zod").ZodOptional<import("zod").ZodString>;
                logo_uri: import("zod").ZodOptional<import("zod").ZodString>;
                contacts: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                tos_uri: import("zod").ZodOptional<import("zod").ZodString>;
                policy_uri: import("zod").ZodOptional<import("zod").ZodString>;
                software_id: import("zod").ZodOptional<import("zod").ZodString>;
                software_version: import("zod").ZodOptional<import("zod").ZodString>;
                software_statement: import("zod").ZodOptional<import("zod").ZodString>;
                post_logout_redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                backchannel_logout_uri: import("zod").ZodOptional<import("zod").ZodURL>;
                backchannel_logout_session_required: import("zod").ZodOptional<import("zod").ZodBoolean>;
                token_endpoint_auth_method: import("zod").ZodOptional<import("zod").ZodString>;
                application_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                    web: "web";
                    native: "native";
                }>>;
                jwks: import("zod").ZodOptional<import("zod").ZodObject<{
                    keys: import("zod").ZodArray<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>;
                jwks_uri: import("zod").ZodOptional<import("zod").ZodString>;
                grant_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                client_credentials_scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                resources: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                response_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<{
                    code: "code";
                }>>>;
                client_secret_expires_at: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNumber]>>>;
                skip_consent: import("zod").ZodOptional<import("zod").ZodBoolean>;
                enable_end_session: import("zod").ZodOptional<import("zod").ZodBoolean>;
                require_pkce: import("zod").ZodOptional<import("zod").ZodBoolean>;
                dpop_bound_access_tokens: import("zod").ZodOptional<import("zod").ZodBoolean>;
                subject_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                    public: "public";
                    pairwise: "pairwise";
                }>>;
                metadata: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
            }, import("zod/v4/core").$strip>;
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
        createOAuthClient: import("better-call").StrictEndpoint<"/oauth2/create-client", {
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
            body: import("zod").ZodObject<{
                redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                scope: import("zod").ZodOptional<import("zod").ZodString>;
                client_name: import("zod").ZodOptional<import("zod").ZodString>;
                client_uri: import("zod").ZodOptional<import("zod").ZodString>;
                logo_uri: import("zod").ZodOptional<import("zod").ZodString>;
                contacts: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                tos_uri: import("zod").ZodOptional<import("zod").ZodString>;
                policy_uri: import("zod").ZodOptional<import("zod").ZodString>;
                software_id: import("zod").ZodOptional<import("zod").ZodString>;
                software_version: import("zod").ZodOptional<import("zod").ZodString>;
                software_statement: import("zod").ZodOptional<import("zod").ZodString>;
                post_logout_redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                backchannel_logout_uri: import("zod").ZodOptional<import("zod").ZodURL>;
                backchannel_logout_session_required: import("zod").ZodOptional<import("zod").ZodBoolean>;
                token_endpoint_auth_method: import("zod").ZodOptional<import("zod").ZodString>;
                application_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                    web: "web";
                    native: "native";
                }>>;
                jwks: import("zod").ZodOptional<import("zod").ZodObject<{
                    keys: import("zod").ZodArray<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>>;
                jwks_uri: import("zod").ZodOptional<import("zod").ZodString>;
                grant_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                response_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<{
                    code: "code";
                }>>>;
                dpop_bound_access_tokens: import("zod").ZodOptional<import("zod").ZodBoolean>;
            }, import("zod/v4/core").$strip>;
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
        getOAuthClient: import("better-call").StrictEndpoint<"/oauth2/get-client", {
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
            query: import("zod").ZodObject<{
                client_id: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, import("../types").OAuthClient>;
        getOAuthClientPublic: import("better-call").StrictEndpoint<"/oauth2/public-client", {
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
            query: import("zod").ZodObject<{
                client_id: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, import("../types").OAuthClient>;
        getOAuthClientPublicPrelogin: import("better-call").StrictEndpoint<"/oauth2/public-client-prelogin", {
            method: "POST";
            use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>>[];
            body: import("zod").ZodObject<{
                client_id: import("zod").ZodString;
                oauth_query: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, import("../types").OAuthClient>;
        getOAuthClients: import("better-call").StrictEndpoint<"/oauth2/get-clients", {
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
        adminUpdateOAuthClient: import("better-call").StrictEndpoint<"/admin/oauth2/update-client", {
            method: "PATCH";
            body: import("zod").ZodObject<{
                client_id: import("zod").ZodString;
                update: import("zod").ZodObject<{
                    redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                    scope: import("zod").ZodOptional<import("zod").ZodString>;
                    client_name: import("zod").ZodOptional<import("zod").ZodString>;
                    client_uri: import("zod").ZodOptional<import("zod").ZodString>;
                    logo_uri: import("zod").ZodOptional<import("zod").ZodString>;
                    contacts: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                    tos_uri: import("zod").ZodOptional<import("zod").ZodString>;
                    policy_uri: import("zod").ZodOptional<import("zod").ZodString>;
                    software_id: import("zod").ZodOptional<import("zod").ZodString>;
                    software_version: import("zod").ZodOptional<import("zod").ZodString>;
                    software_statement: import("zod").ZodOptional<import("zod").ZodString>;
                    post_logout_redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                    backchannel_logout_uri: import("zod").ZodOptional<import("zod").ZodURL>;
                    backchannel_logout_session_required: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    application_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                        web: "web";
                        native: "native";
                    }>>;
                    grant_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                    client_credentials_scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                    response_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<{
                        code: "code";
                    }>>>;
                    client_secret_expires_at: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodNumber]>>;
                    skip_consent: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    enable_end_session: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    disabled: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    dpop_bound_access_tokens: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    metadata: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                SERVER_ONLY: true;
                openapi: {
                    description: string;
                };
            };
        }, import("../types").OAuthClientAdministrativeResponse>;
        updateOAuthClient: import("better-call").StrictEndpoint<"/oauth2/update-client", {
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
            body: import("zod").ZodObject<{
                client_id: import("zod").ZodString;
                update: import("zod").ZodObject<{
                    redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                    scope: import("zod").ZodOptional<import("zod").ZodString>;
                    client_name: import("zod").ZodOptional<import("zod").ZodString>;
                    client_uri: import("zod").ZodOptional<import("zod").ZodString>;
                    logo_uri: import("zod").ZodOptional<import("zod").ZodString>;
                    contacts: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                    tos_uri: import("zod").ZodOptional<import("zod").ZodString>;
                    policy_uri: import("zod").ZodOptional<import("zod").ZodString>;
                    software_id: import("zod").ZodOptional<import("zod").ZodString>;
                    software_version: import("zod").ZodOptional<import("zod").ZodString>;
                    software_statement: import("zod").ZodOptional<import("zod").ZodString>;
                    post_logout_redirect_uris: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodURL>>;
                    backchannel_logout_uri: import("zod").ZodOptional<import("zod").ZodURL>;
                    backchannel_logout_session_required: import("zod").ZodOptional<import("zod").ZodBoolean>;
                    application_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                        web: "web";
                        native: "native";
                    }>>;
                    grant_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                    response_types: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<{
                        code: "code";
                    }>>>;
                }, import("zod/v4/core").$strip>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, import("../types").OAuthClientRegistrationResponse>;
        rotateClientSecret: import("better-call").StrictEndpoint<"/oauth2/client/rotate-secret", {
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
            body: import("zod").ZodObject<{
                client_id: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            metadata: {
                noStore: boolean;
                openapi: {
                    description: string;
                };
            };
        }, import("../types").OAuthClient>;
        rotateClientKeys: import("better-call").StrictEndpoint<"/oauth2/client/rotate-keys", {
            method: "POST";
            body: import("zod").ZodObject<{
                client_assertion: import("zod").ZodString;
                client_assertion_type: import("zod").ZodString;
                jwks: import("zod").ZodObject<{
                    keys: import("zod").ZodArray<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
                }, import("zod/v4/core").$strip>;
            }, import("zod/v4/core").$strip>;
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
        deleteOAuthClient: import("better-call").StrictEndpoint<"/oauth2/delete-client", {
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
            body: import("zod").ZodObject<{
                client_id: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, void>;
        getOAuthConsent: import("better-call").StrictEndpoint<"/oauth2/get-consent", {
            method: "GET";
            query: import("zod").ZodObject<{
                id: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
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
        }, OAuthConsent<Scope[]>>;
        getOAuthConsents: import("better-call").StrictEndpoint<"/oauth2/get-consents", {
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
        }, OAuthConsent<Scope[]>[]>;
        updateOAuthConsent: import("better-call").StrictEndpoint<"/oauth2/update-consent", {
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
            body: import("zod").ZodObject<{
                id: import("zod").ZodString;
                update: import("zod").ZodObject<{
                    scopes: import("zod").ZodArray<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, OAuthConsent<Scope[]>>;
        deleteOAuthConsent: import("better-call").StrictEndpoint<"/oauth2/delete-consent", {
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
            body: import("zod").ZodObject<{
                id: import("zod").ZodString;
            }, import("zod/v4/core").$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, void>;
        adminCreateOAuthResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources", {
            method: "POST";
            body: import("zod").ZodObject<{
                identifier: import("zod").ZodNonOptional<import("zod").ZodOptional<import("zod").ZodString>>;
                name: import("zod").ZodOptional<import("zod").ZodString>;
                accessTokenTtl: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
                refreshTokenTtl: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
                signingAlgorithm: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
                    RS256: "RS256";
                    PS256: "PS256";
                    ES256: "ES256";
                    ES512: "ES512";
                    EdDSA: "EdDSA";
                }>>>;
                signingKeyId: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
                allowedScopes: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodString>>>;
                customClaims: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
                dpopBoundAccessTokensRequired: import("zod").ZodOptional<import("zod").ZodBoolean>;
                disabled: import("zod").ZodOptional<import("zod").ZodBoolean>;
                metadata: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("../types").OAuthResource>;
        adminListOAuthResources: import("better-call").StrictEndpoint<"/admin/oauth2/resources", {
            method: "GET";
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("../types").OAuthResource[]>;
        adminGetOAuthResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier", {
            method: "GET";
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("../types").OAuthResource>;
        adminUpdateOAuthResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier", {
            method: "PATCH";
            body: import("zod").ZodObject<{
                identifier: import("zod").ZodOptional<import("zod").ZodString>;
                name: import("zod").ZodOptional<import("zod").ZodString>;
                accessTokenTtl: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
                refreshTokenTtl: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodNumber>>;
                signingAlgorithm: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodEnum<{
                    RS256: "RS256";
                    PS256: "PS256";
                    ES256: "ES256";
                    ES512: "ES512";
                    EdDSA: "EdDSA";
                }>>>;
                signingKeyId: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodString>>;
                allowedScopes: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodArray<import("zod").ZodString>>>;
                customClaims: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
                dpopBoundAccessTokensRequired: import("zod").ZodOptional<import("zod").ZodBoolean>;
                disabled: import("zod").ZodOptional<import("zod").ZodBoolean>;
                metadata: import("zod").ZodOptional<import("zod").ZodNullable<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>>;
            }, import("zod/v4/core").$strip>;
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("../types").OAuthResource>;
        adminDeleteOAuthResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier", {
            method: "DELETE";
            metadata: {
                SERVER_ONLY: true;
            };
        }, {
            deleted: boolean;
        }>;
        adminLinkClientResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier/clients/:client_id", {
            method: "POST";
            metadata: {
                SERVER_ONLY: true;
            };
        }, {
            linked: boolean;
        }>;
        adminUnlinkClientResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier/clients/:client_id", {
            method: "DELETE";
            metadata: {
                SERVER_ONLY: true;
            };
        }, {
            unlinked: boolean;
        }>;
    };
    schema: {
        oauthClient: {
            modelName: string;
            fields: {
                clientId: {
                    type: "string";
                    unique: true;
                    required: true;
                };
                clientSecret: {
                    type: "string";
                    required: false;
                };
                clientDiscoveryId: {
                    type: "string";
                    required: false;
                };
                disabled: {
                    type: "boolean";
                    defaultValue: false;
                    required: false;
                };
                skipConsent: {
                    type: "boolean";
                    required: false;
                };
                enableEndSession: {
                    type: "boolean";
                    required: false;
                };
                subjectType: {
                    type: "string";
                    required: false;
                };
                scopes: {
                    type: "string[]";
                    required: false;
                };
                clientCredentialsScopes: {
                    type: "string[]";
                    required: false;
                    defaultValue: any[];
                };
                userId: {
                    type: "string";
                    required: false;
                    references: {
                        model: string;
                        field: string;
                    };
                    index: true;
                };
                createdAt: {
                    type: "date";
                    required: false;
                };
                updatedAt: {
                    type: "date";
                    required: false;
                };
                name: {
                    type: "string";
                    required: false;
                };
                uri: {
                    type: "string";
                    required: false;
                };
                icon: {
                    type: "string";
                    required: false;
                };
                contacts: {
                    type: "string[]";
                    required: false;
                };
                tos: {
                    type: "string";
                    required: false;
                };
                policy: {
                    type: "string";
                    required: false;
                };
                softwareId: {
                    type: "string";
                    required: false;
                };
                softwareVersion: {
                    type: "string";
                    required: false;
                };
                softwareStatement: {
                    type: "string";
                    required: false;
                };
                redirectUris: {
                    type: "string[]";
                    required: true;
                };
                postLogoutRedirectUris: {
                    type: "string[]";
                    required: false;
                };
                backchannelLogoutUri: {
                    type: "string";
                    required: false;
                };
                backchannelLogoutSessionRequired: {
                    type: "boolean";
                    required: false;
                };
                tokenEndpointAuthMethod: {
                    type: "string";
                    required: false;
                };
                applicationType: {
                    type: "string";
                    required: false;
                };
                jwks: {
                    type: "string";
                    required: false;
                };
                jwksUri: {
                    type: "string";
                    required: false;
                };
                grantTypes: {
                    type: "string[]";
                    required: false;
                };
                responseTypes: {
                    type: "string[]";
                    required: false;
                };
                requirePKCE: {
                    type: "boolean";
                    required: false;
                };
                dpopBoundAccessTokens: {
                    type: "boolean";
                    required: false;
                    defaultValue: false;
                };
                referenceId: {
                    type: "string";
                    required: false;
                };
                metadata: {
                    type: "json";
                    required: false;
                };
            };
        };
        oauthResource: {
            modelName: string;
            fields: {
                identifier: {
                    type: "string";
                    required: true;
                    unique: true;
                };
                name: {
                    type: "string";
                    required: true;
                };
                accessTokenTtl: {
                    type: "number";
                    required: false;
                };
                refreshTokenTtl: {
                    type: "number";
                    required: false;
                };
                signingAlgorithm: {
                    type: "string";
                    required: false;
                };
                signingKeyId: {
                    type: "string";
                    required: false;
                };
                allowedScopes: {
                    type: "string[]";
                    required: false;
                };
                customClaims: {
                    type: "json";
                    required: false;
                };
                dpopBoundAccessTokensRequired: {
                    type: "boolean";
                    required: false;
                    defaultValue: false;
                };
                disabled: {
                    type: "boolean";
                    required: false;
                    defaultValue: false;
                };
                createdAt: {
                    type: "date";
                    required: false;
                };
                updatedAt: {
                    type: "date";
                    required: false;
                };
                policyVersion: {
                    type: "number";
                    required: false;
                    defaultValue: number;
                };
                metadata: {
                    type: "json";
                    required: false;
                };
            };
        };
        oauthClientResource: {
            modelName: string;
            fields: {
                clientId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                        onDelete: "cascade";
                    };
                    index: true;
                };
                resourceId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                        onDelete: "cascade";
                    };
                    index: true;
                };
                metadata: {
                    type: "json";
                    required: false;
                };
                createdAt: {
                    type: "date";
                    required: false;
                };
            };
            indexes: {
                fields: [string, string];
                unique: true;
            }[];
        };
        oauthRefreshToken: {
            fields: {
                token: {
                    type: "string";
                    required: true;
                    unique: true;
                };
                clientId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                    };
                    index: true;
                };
                sessionId: {
                    type: "string";
                    required: false;
                    references: {
                        model: string;
                        field: string;
                        onDelete: "set null";
                    };
                    index: true;
                };
                userId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                    };
                    index: true;
                };
                referenceId: {
                    type: "string";
                    required: false;
                };
                authorizationCodeId: {
                    type: "string";
                    required: false;
                    index: true;
                };
                resources: {
                    type: "string[]";
                    required: false;
                };
                requestedUserInfoClaims: {
                    type: "string[]";
                    required: false;
                };
                expiresAt: {
                    type: "date";
                };
                createdAt: {
                    type: "date";
                };
                revoked: {
                    type: "date";
                    required: false;
                };
                rotatedAt: {
                    type: "date";
                    required: false;
                };
                rotationReplayResponse: {
                    type: "string";
                    required: false;
                };
                rotationReplayExpiresAt: {
                    type: "date";
                    required: false;
                };
                authTime: {
                    type: "date";
                    required: false;
                };
                confirmation: {
                    type: "json";
                    required: false;
                };
                scopes: {
                    type: "string[]";
                    required: true;
                };
            };
        };
        oauthAccessToken: {
            modelName: string;
            fields: {
                token: {
                    type: "string";
                    unique: true;
                };
                clientId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                    };
                    index: true;
                };
                sessionId: {
                    type: "string";
                    required: false;
                    references: {
                        model: string;
                        field: string;
                        onDelete: "set null";
                    };
                    index: true;
                };
                userId: {
                    type: "string";
                    required: false;
                    references: {
                        model: string;
                        field: string;
                    };
                    index: true;
                };
                referenceId: {
                    type: "string";
                    required: false;
                };
                authorizationCodeId: {
                    type: "string";
                    required: false;
                    index: true;
                };
                resources: {
                    type: "string[]";
                    required: false;
                };
                requestedUserInfoClaims: {
                    type: "string[]";
                    required: false;
                };
                refreshId: {
                    type: "string";
                    required: false;
                    references: {
                        model: string;
                        field: string;
                    };
                    index: true;
                };
                expiresAt: {
                    type: "date";
                };
                createdAt: {
                    type: "date";
                };
                revoked: {
                    type: "date";
                    required: false;
                };
                confirmation: {
                    type: "json";
                    required: false;
                };
                scopes: {
                    type: "string[]";
                    required: true;
                };
            };
        };
        oauthConsent: {
            modelName: string;
            fields: {
                clientId: {
                    type: "string";
                    required: true;
                    references: {
                        model: string;
                        field: string;
                    };
                    index: true;
                };
                userId: {
                    type: "string";
                    required: false;
                    references: {
                        model: string;
                        field: string;
                    };
                    index: true;
                };
                referenceId: {
                    type: "string";
                    required: false;
                };
                resources: {
                    type: "string[]";
                    required: false;
                };
                requestedUserInfoClaims: {
                    type: "string[]";
                    required: false;
                };
                scopes: {
                    type: "string[]";
                    required: true;
                };
                createdAt: {
                    type: "date";
                };
                updatedAt: {
                    type: "date";
                };
            };
        };
        oauthClientAssertion: {
            modelName: string;
            fields: {
                expiresAt: {
                    type: "date";
                    required: true;
                };
            };
        };
    };
    rateLimit: ({
        pathMatcher: (path: string) => path is "/oauth2/token";
        window: number;
        max: number;
    } | {
        pathMatcher: (path: string) => path is "/oauth2/authorize";
        window: number;
        max: number;
    } | {
        pathMatcher: (path: string) => path is "/oauth2/introspect";
        window: number;
        max: number;
    } | {
        pathMatcher: (path: string) => path is "/oauth2/revoke";
        window: number;
        max: number;
    } | {
        pathMatcher: (path: string) => path is "/oauth2/register";
        window: number;
        max: number;
    } | {
        pathMatcher: (path: string) => path is "/oauth2/client/rotate-keys";
        window: number;
        max: number;
    } | {
        pathMatcher: (path: string) => path is "/oauth2/userinfo";
        window: number;
        max: number;
    })[];
};
/**
 * Gets the JWT Plugin
 * @internal
 */
export declare const getJwtPlugin: (ctx: AuthContext) => {
    id: "jwt";
    version: string;
    options: NoInfer<import("better-auth/plugins").JwtOptions>;
    init(ctx: import("@better-auth/core").AuthContext): {
        context: {
            sessionConfig: {
                cookieCacheSigner: import("@better-auth/core").CookieCacheSigner;
                updateAge: number;
                expiresIn: number;
                freshAge: number;
                cookieRefreshCache: false | {
                    enabled: true;
                    updateAge: number;
                };
            };
        };
    } | undefined;
    endpoints: {
        getJwks: import("better-call").StrictEndpoint<string, {
            method: "GET";
            metadata: {
                openapi: {
                    operationId: string;
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            keys: {
                                                type: string;
                                                description: string;
                                                items: {
                                                    type: string;
                                                    properties: {
                                                        kid: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        kty: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        alg: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        use: {
                                                            type: string;
                                                            description: string;
                                                            enum: string[];
                                                            nullable: boolean;
                                                        };
                                                        n: {
                                                            type: string;
                                                            description: string;
                                                            nullable: boolean;
                                                        };
                                                        e: {
                                                            type: string;
                                                            description: string;
                                                            nullable: boolean;
                                                        };
                                                        crv: {
                                                            type: string;
                                                            description: string;
                                                            nullable: boolean;
                                                        };
                                                        x: {
                                                            type: string;
                                                            description: string;
                                                            nullable: boolean;
                                                        };
                                                        y: {
                                                            type: string;
                                                            description: string;
                                                            nullable: boolean;
                                                        };
                                                    };
                                                    required: string[];
                                                };
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
        }, import("jose").JSONWebKeySet>;
        getToken: import("better-call").StrictEndpoint<"/token", {
            method: "GET";
            requireHeaders: true;
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
                    operationId: string;
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        }, {
            token: string;
        }>;
        signJWT: import("better-call").StrictEndpoint<string, {
            method: "POST";
            metadata: {
                $Infer: {
                    body: {
                        payload: import("jose").JWTPayload;
                        overrideOptions?: import("better-auth/plugins").JwtOptions | undefined;
                    };
                };
            };
            body: import("zod").ZodObject<{
                payload: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
                overrideOptions: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
            }, import("zod/v4/core").$strip>;
        }, {
            token: string;
        }>;
        verifyJWT: import("better-call").StrictEndpoint<string, {
            method: "POST";
            metadata: {
                $Infer: {
                    body: {
                        token: string;
                        issuer?: string;
                    };
                    response: {
                        payload: {
                            sub: string;
                            aud: string;
                            [key: string]: any;
                        } | null;
                    };
                };
            };
            body: import("zod").ZodObject<{
                token: import("zod").ZodString;
                issuer: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>;
        }, {
            payload: (import("jose").JWTPayload & Required<Pick<import("jose").JWTPayload, "sub" | "aud">>) | null;
        }>;
    };
    hooks: {
        after: {
            matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
            handler: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>>;
        }[];
    };
    schema: {
        jwks: {
            fields: {
                publicKey: {
                    type: "string";
                    required: true;
                };
                privateKey: {
                    type: "string";
                    required: true;
                };
                createdAt: {
                    type: "date";
                    required: true;
                };
                expiresAt: {
                    type: "date";
                    required: false;
                };
                alg: {
                    type: "string";
                    required: false;
                };
                crv: {
                    type: "string";
                    required: false;
                };
            };
        };
    };
};
/**
 * Whether a JWT verification error comes from the token itself (malformed,
 * bad signature, unsupported alg, unknown kid, failed claim checks), as
 * opposed to a key set failure that should still surface as a server error.
 *
 * @internal
 */
export declare function isInvalidJwtError(error: unknown): boolean;
/**
 * Normalizes timestamp-like values returned by adapters.
 *
 * Accepts Date instances, epoch milliseconds as numbers, and strings that are
 * either ISO dates or numeric millisecond values such as "1774295570569.0".
 */
export declare function normalizeTimestampValue(value: unknown): Date | undefined;
/**
 * Resolves a session auth time from common adapter return shapes.
 */
export declare function resolveSessionAuthTime(value: unknown): Date | undefined;
/**
 * Normalizes OAuth resource values into a non-empty string array.
 */
export declare function toResourceList(value: string | string[] | undefined): string[] | undefined;
/**
 * Normalizes audience values for JWT claims.
 */
export declare function toAudienceClaim(audience: string | string[] | undefined): string | string[] | undefined;
/**
 * Verify the signature and expiration of an OAuth query issued by this provider.
 * Use the provider's current auth secret on the server before displaying a
 * consent page. A valid signature does not replace client or session checks.
 */
export declare function verifyOAuthQueryParams(oauth_query: string, secret: string): Promise<boolean>;
/**
 * Rejects changes to a client listed in `cachedTrustedClients`. Cached trusted
 * clients are immutable through the client management endpoints.
 */
export declare function assertNotTrustedClient(opts: OAuthOptions<Scope[]>, clientId: string): void;
/**
 * Get a client by ID, checking trusted clients first, then database
 */
export declare function getClient(ctx: GenericEndpointContext, options: OAuthOptions<Scope[]>, clientId: string): Promise<SchemaClient<Scope[]>>;
/**
 * Merge `discoveryMetadata` from every contributed {@link ClientDiscovery}
 * into a single object. Entries are spread in order; later entries override
 * earlier ones on key collisions.
 *
 * @internal
 */
export declare function mergeDiscoveryMetadata(discoveries: ClientDiscovery[]): Record<string, unknown>;
/**
 * Decrypts a storedClientSecret for signing
 *
 * @internal
 */
export declare function decryptStoredClientSecret(ctx: GenericEndpointContext, storageMethod: OAuthOptions<Scope[]>["storeClientSecret"], storedClientSecret: string): Promise<string>;
/**
 * Store client secret according to the configured storage method
 *
 * @internal
 */
export declare function storeClientSecret(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, clientSecret: string): Promise<any>;
/**
 * Stores a token value (ie opaque tokens, refresh tokens, transaction tokens, verification codes)
 * on the database in a secure hashed format.
 *
 * @internal
 */
export declare function storeToken(storageMethod: OAuthOptions<Scope[]>["storeTokens"], token: string, type: StoreTokenType): Promise<any>;
/**
 * Gets a hashed token value to find on the database.
 *
 * @internal
 */
export declare function getStoredToken(storageMethod: OAuthOptions<Scope[]>["storeTokens"], token: string, type: StoreTokenType): Promise<any>;
declare const CLIENT_AUTHENTICATION_FIELDS: readonly ["client_secret", "client_assertion", "client_assertion_type"];
export type ClientAuthenticationField = (typeof CLIENT_AUTHENTICATION_FIELDS)[number];
/**
 * Normalizes client identification and authentication parameters while
 * enforcing RFC 6749 §2.3 and RFC 8628 §3.1 cardinality. Empty values are
 * omitted. Client identification remains separate from authentication-method
 * detection so a public `client_id` does not count as an authentication attempt.
 * Repeated `resource` parameters are intentionally outside this parser because
 * RFC 8707 §2 explicitly permits them.
 *
 * Credential and assertion verification remain the responsibility of
 * `extractClientCredentials`.
 *
 * @internal
 */
export declare function normalizeClientAuthenticationParameters(request: Request | undefined, body?: Record<string, unknown>): Promise<{
    detected: boolean;
}>;
/**
 * Whether a client is allowed to use a given grant type.
 *
 * A client's registered `grantTypes` defaults to the documented default
 * `["authorization_code"]` when unset (see client registration). Refresh tokens
 * are only ever issued through the authorization_code flow, so a client allowed
 * to use `authorization_code` is implicitly allowed to use `refresh_token`.
 *
 * @internal
 */
export declare function clientAllowsGrant(client: Pick<SchemaClient<Scope[]>, "grantTypes">, grantType: GrantType): boolean;
/**
 * Validates requested scopes against a registered client's allowed scopes.
 *
 * @internal
 */
export declare function validateClientScopes(client: Pick<SchemaClient<Scope[]>, "scopes">, scopes?: string[]): void;
/**
 * Resolves the registered client by id and authorizes it: existence, disabled
 * state, registered auth method, requested scopes, and grant type. The record is
 * always resolved here via `getClient`, so a client-auth strategy proves the
 * caller controls `clientId` but never supplies the record. `preVerified` marks
 * that an assertion already proved control, so the client-secret check is skipped.
 *
 * @internal
 */
export declare function validateClientCredentials(ctx: GenericEndpointContext, options: OAuthOptions<Scope[]>, clientId: string, clientSecret?: string, // optional because required if client is confidential or this value is defined
scopes?: string[], // checks requested scopes against allowed scopes
preVerified?: boolean, // an assertion already proved control of clientId; skip the secret check
grantType?: GrantType, // if set, enforces the client is registered for this grant type
authMethod?: TokenEndpointAuthMethod): Promise<SchemaClient<Scope[]>>;
/**
 * Parse client metadata that may be stored as JSON string or already parsed object.
 * Handles database adapters that auto-parse JSON columns.
 *
 * @internal
 */
export declare function parseClientMetadata(metadata: string | object | undefined): Record<string, unknown> | undefined;
export type ExtractedCredentials = {
    kind: "client_secret";
    method: "client_secret_basic" | "client_secret_post";
    clientId: string;
    clientSecret: string;
} | {
    kind: "pre_verified";
    method: TokenEndpointAuthMethod;
    clientId: string;
    /** Sender-constraint the auth strategy proved, forwarded to issuance. */
    confirmation?: Confirmation;
} | {
    kind: "public";
    method: "none";
    clientId: string;
};
/** Unwraps ExtractedCredentials into the fields each grant handler needs. */
export declare function destructureCredentials(credentials: ExtractedCredentials | null): {
    clientId: string;
    clientSecret: string;
    preVerified: boolean;
    authMethod: TokenEndpointAuthMethod;
    confirmation: Confirmation;
};
/**
 * Extracts and resolves client credentials from the request.
 * Supports: client_secret_basic, client_secret_post, private_key_jwt, and none (public).
 */
export declare function extractClientCredentials(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, expectedAudience?: string): Promise<ExtractedCredentials | null>;
/**
 * Parse space-separated prompt string into a set of prompts
 *
 * @param prompt
 */
export declare function parsePrompt(prompt: string): Set<Prompt>;
/**
 * Returns the appropriate subject identifier for a user+client pair.
 * Uses pairwise when the client opts in and the server has a secret configured.
 *
 * @internal
 */
export declare function resolveSubjectIdentifier(userId: string, client: SchemaClient<Scope[]>, opts: OAuthOptions<Scope[]>): Promise<string>;
/**
 * Resolves `postLogin.consentReferenceId`, treating an empty value as no reference.
 *
 * @internal
 */
export declare function getConsentReferenceId(opts: OAuthOptions<Scope[]>, context: Parameters<NonNullable<OAuthOptions<Scope[]>["postLogin"]>["consentReferenceId"]>[0]): Promise<string | undefined>;
/**
 * Finds the consent stored for exactly this reference. Without a reference,
 * only consent stored without one (missing, null, or empty) matches.
 *
 * @internal
 */
export declare function findConsent(ctx: GenericEndpointContext, clientId: string, userId: string, referenceId: string | undefined): Promise<OAuthConsent<Scope[]> | null>;
/**
 * Converts URLSearchParams to a plain object, preserving
 * multi-valued keys as arrays instead of discarding duplicates.
 */
export declare function searchParamsToQuery(params: URLSearchParams): Record<string, string | string[]>;
export declare function isSessionFreshForSignedQuery(sessionCreatedAt: Date | string | undefined, signedQueryIssuedAt: Date | undefined): boolean;
export declare function removePromptFromQuery(query: URLSearchParams, prompt: Prompt): URLSearchParams;
export declare function removeMaxAgeFromQuery(query: URLSearchParams): URLSearchParams;
declare enum PKCERequirementErrors {
    PUBLIC_CLIENT = "pkce is required for public clients",
    OFFLINE_ACCESS_SCOPE = "pkce or OIDC nonce is required when requesting offline_access scope",
    CLIENT_REQUIRE_PKCE = "pkce is required for this client"
}
interface AuthorizationPKCEContext {
    scopes?: string[];
    nonce?: string;
}
/**
 * Determines if PKCE is required for a given client and authorization request.
 *
 * PKCE is always required for:
 * 1. Public clients (cannot securely store client_secret)
 * 2. Requests with offline_access scope unless a confidential OIDC request
 *    already uses nonce as its authorization-code injection countermeasure.
 *
 * For confidential clients:
 * - Uses client.requirePKCE if set (defaults to true)
 *
 * Returns false if PKCE is not required, or the reason it is required.
 *
 * @internal
 */
export declare function isPKCERequired(client: SchemaClient<Scope[]>, request?: AuthorizationPKCEContext): false | PKCERequirementErrors;
/**
 * Applies the redirect URI HTTPS policy: `http:` is allowed on loopback hosts
 * for clients that are not `web`, or when `allowInsecureRedirectUri` accepts
 * the URL. A throwing callback rejects the URI.
 */
export declare function isRedirectUriTransportAllowed(opts: OAuthOptions<Scope[]>, uri: string, isWebClient?: boolean): boolean;
/**
 * Runs `allowInsecureRedirectUri` for an `http:` URL, failing closed. URLs
 * with credentials are never accepted.
 */
export declare function isInsecureRedirectUriAllowed(opts: OAuthOptions<Scope[]>, url: URL): boolean;
