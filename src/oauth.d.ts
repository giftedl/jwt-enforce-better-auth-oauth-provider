import type { GenericEndpointContext } from "@better-auth/core";
import * as z from "zod";
import type { OAuthOptions, Scope } from "./types";
/**
 * Default scopes advertised and accepted when a configuration sets none. Shared
 * with the MCP preset so the resource metadata it serves matches what the
 * authorization-server metadata advertises.
 */
export declare const DEFAULT_OAUTH_SCOPES: readonly ["openid", "profile", "email", "offline_access"];
type RPInitiatedLogoutFields = {
    id_token_hint?: string;
    client_id?: string;
    post_logout_redirect_uri?: string;
    state?: string;
};
type RPInitiatedLogoutClientInput = RPInitiatedLogoutFields | {
    query: RPInitiatedLogoutFields;
};
declare module "@better-auth/core" {
    interface BetterAuthPluginRegistry<AuthOptions, Options> {
        "oauth-provider": {
            creator: typeof oauthProvider;
        };
    }
}
export declare const oAuthState: import("@better-auth/core/context").RequestState<{
    query?: string;
    signedQueryIssuedAt?: Date;
    postLoginClearedForSession?: string;
}>;
export declare const getOAuthProviderState: () => Promise<{
    query?: string;
    signedQueryIssuedAt?: Date;
    postLoginClearedForSession?: string;
}>;
/**
 * oAuth 2.1 provider plugin for Better Auth.
 *
 * @see https://better-auth.com/docs/plugins/oauth-provider
 * @param options - The options for the oAuth Provider plugin.
 * @returns A Better Auth plugin.
 */
export declare const oauthProvider: <O extends OAuthOptions<Scope[]>>(options: O) => {
    id: "oauth-provider";
    version: any;
    options: NoInfer<O>;
    onRequest: (request: Request, ctx: import("@better-auth/core").AuthContext) => Promise<{
        response: Response;
    } | {
        request: Request;
    } | void>;
    init: (ctx: import("@better-auth/core").AuthContext) => Promise<{
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
            handler: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<import("./authorize").OAuthRedirectResult>>;
        }[];
    };
    endpoints: {
        /**
         * A server-only endpoint that helps provide the
         * oAuth Server configuration at the well-known endpoint.
         *
         * Provided at /.well-known/oauth-authorization-server/[issuer-path]
         * (root if no issuer-path).
         */
        getOAuthServerConfig: import("better-call").StrictEndpoint<"/.well-known/oauth-authorization-server", {
            method: "GET";
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("./types").AuthServerMetadata>;
        /**
         * A server-only endpoint that helps provide the
         * OpenId configuration at the well-known endpoint.
         *
         * Provided at [issuer-path]/.well-known/openid-configuration
         * (root if no issuer-path).
         */
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
            prompt_values_supported: import("./types").Prompt[];
            issuer: string;
            authorization_endpoint: string;
            token_endpoint: string;
            registration_endpoint?: string;
            scopes_supported?: string[];
            response_types_supported: "code"[];
            response_modes_supported: "query"[];
            grant_types_supported: import("./types").GrantType[];
            token_endpoint_auth_methods_supported?: import("./types").TokenEndpointAuthMethod[];
            token_endpoint_auth_signing_alg_values_supported?: import("better-auth/*").PrivateKeyJwtSigningAlgorithm[];
            service_documentation?: string;
            ui_locales_supported?: string[];
            op_policy_uri?: string;
            op_tos_uri?: string;
            revocation_endpoint?: string;
            revocation_endpoint_auth_methods_supported?: import("./types").TokenEndpointAuthMethod[];
            revocation_endpoint_auth_signing_alg_values_supported?: import("better-auth/*").PrivateKeyJwtSigningAlgorithm[];
            introspection_endpoint?: string;
            introspection_endpoint_auth_methods_supported?: import("./types").TokenEndpointAuthMethod[];
            introspection_endpoint_auth_signing_alg_values_supported?: import("better-auth/*").PrivateKeyJwtSigningAlgorithm[];
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
            body: z.ZodObject<{}, z.z.core.$loose>;
            redirectOnError: import("./oauth-endpoint").OAuthRedirectOnError<GenericEndpointContext, import("./authorize").OAuthRedirectResult>;
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
        }, import("./authorize").OAuthRedirectResult>;
        oauth2Consent: import("better-call").StrictEndpoint<"/oauth2/consent", {
            method: "POST";
            body: z.ZodObject<{
                accept: z.ZodBoolean;
                scope: z.ZodOptional<z.ZodString>;
                claims: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
                oauth_query: z.ZodOptional<z.ZodString>;
            }, z.z.core.$strip>;
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
        }, import("./authorize").OAuthRedirectResult | {
            redirect: boolean;
            url: string;
        }>;
        oauth2Continue: import("better-call").StrictEndpoint<"/oauth2/continue", {
            method: "POST";
            body: z.ZodObject<{
                selected: z.ZodOptional<z.ZodBoolean>;
                created: z.ZodOptional<z.ZodBoolean>;
                postLogin: z.ZodOptional<z.ZodBoolean>;
                oauth_query: z.ZodOptional<z.ZodString>;
            }, z.z.core.$strip>;
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
        }, import("./authorize").OAuthRedirectResult>;
        oauth2Token: import("better-call").StrictEndpoint<"/oauth2/token", {
            method: "POST";
            cloneRequest: true;
            body: z.ZodObject<{
                grant_type: z.ZodString;
                client_id: z.ZodOptional<z.ZodString>;
                client_secret: z.ZodOptional<z.ZodString>;
                client_assertion: z.ZodOptional<z.ZodString>;
                client_assertion_type: z.ZodOptional<z.ZodString>;
                code: z.ZodOptional<z.ZodString>;
                code_verifier: z.ZodOptional<z.ZodString>;
                redirect_uri: z.ZodOptional<z.ZodURL>;
                refresh_token: z.ZodOptional<z.ZodString>;
                resource: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
                scope: z.ZodOptional<z.ZodString>;
            }, z.z.core.$loose>;
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
            token_type: import("./types").TokenType;
            refresh_token: string | undefined;
            scope: string;
            id_token: string | undefined;
        }>;
        oauth2Introspect: import("better-call").StrictEndpoint<"/oauth2/introspect", {
            method: "POST";
            cloneRequest: true;
            body: z.ZodObject<{
                client_id: z.ZodOptional<z.ZodString>;
                client_secret: z.ZodOptional<z.ZodString>;
                client_assertion: z.ZodOptional<z.ZodString>;
                client_assertion_type: z.ZodOptional<z.ZodString>;
                token: z.ZodString;
                token_type_hint: z.ZodOptional<z.ZodString>;
            }, z.z.core.$strip>;
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
            body: z.ZodObject<{
                client_id: z.ZodOptional<z.ZodString>;
                client_secret: z.ZodOptional<z.ZodString>;
                client_assertion: z.ZodOptional<z.ZodString>;
                client_assertion_type: z.ZodOptional<z.ZodString>;
                token: z.ZodString;
                token_type_hint: z.ZodOptional<z.ZodString>;
            }, z.z.core.$strip>;
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
            body: z.ZodOptional<z.ZodObject<{
                access_token: z.ZodOptional<z.ZodString>;
            }, z.z.core.$loose>>;
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
            body: z.ZodOptional<z.ZodObject<{
                id_token_hint: z.ZodOptional<z.ZodString>;
                client_id: z.ZodOptional<z.ZodString>;
                post_logout_redirect_uri: z.ZodOptional<z.ZodURL>;
                state: z.ZodOptional<z.ZodString>;
            }, z.z.core.$strip>>;
            query: z.ZodOptional<z.ZodObject<{
                id_token_hint: z.ZodOptional<z.ZodString>;
                client_id: z.ZodOptional<z.ZodString>;
                post_logout_redirect_uri: z.ZodOptional<z.ZodURL>;
                state: z.ZodOptional<z.ZodString>;
            }, z.z.core.$strip>>;
            metadata: {
                noStore: boolean;
                allowedMediaTypes: string[];
                $Infer: {
                    body: RPInitiatedLogoutClientInput;
                    query: RPInitiatedLogoutFields;
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
        }, Response | import("./authorize").OAuthRedirectResult>;
        oauth2EndSessionConfirmation: import("better-call").StrictEndpoint<"/oauth2/end-session/confirm", {
            method: "POST";
            body: z.ZodObject<{
                action: z.ZodLiteral<"confirm">;
            }, z.z.core.$strip>;
            metadata: {
                noStore: boolean;
                allowedMediaTypes: string[];
                scope: "http";
            };
        }, Response | import("./authorize").OAuthRedirectResult>;
        registerOAuthClient: import("better-call").StrictEndpoint<"/oauth2/register", {
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
                jwks: z.ZodOptional<z.ZodObject<{
                    keys: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                }, z.z.core.$strip>>;
                jwks_uri: z.ZodOptional<z.ZodString>;
                grant_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
                response_types: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    code: "code";
                }>>>;
                application_type: z.ZodOptional<z.ZodEnum<{
                    web: "web";
                    native: "native";
                }>>;
                subject_type: z.ZodOptional<z.ZodEnum<{
                    public: "public";
                    pairwise: "pairwise";
                }>>;
                dpop_bound_access_tokens: z.ZodOptional<z.ZodBoolean>;
                resources: z.ZodOptional<z.ZodArray<z.ZodString>>;
                skip_consent: z.ZodOptional<z.ZodNever>;
            }, z.z.core.$strip>;
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
        }, import("./types").OAuthClientRegistrationResponse>;
        adminCreateOAuthClient: import("better-call").StrictEndpoint<"/admin/oauth2/create-client", {
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
        }, import("./types").OAuthClientAdministrativeResponse>;
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
        }, import("./types").OAuthClientRegistrationResponse>;
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
            query: z.ZodObject<{
                client_id: z.ZodString;
            }, z.z.core.$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, import("./types").OAuthClient>;
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
            query: z.ZodObject<{
                client_id: z.ZodString;
            }, z.z.core.$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, import("./types").OAuthClient>;
        getOAuthClientPublicPrelogin: import("better-call").StrictEndpoint<"/oauth2/public-client-prelogin", {
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
        }, import("./types").OAuthClient>;
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
        }, import("./types").OAuthClient[]>;
        adminUpdateOAuthClient: import("better-call").StrictEndpoint<"/admin/oauth2/update-client", {
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
        }, import("./types").OAuthClientAdministrativeResponse>;
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
        }, import("./types").OAuthClientRegistrationResponse>;
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
            body: z.ZodObject<{
                client_id: z.ZodString;
            }, z.z.core.$strip>;
            metadata: {
                noStore: boolean;
                openapi: {
                    description: string;
                };
            };
        }, import("./types").OAuthClient>;
        rotateClientKeys: import("better-call").StrictEndpoint<"/oauth2/client/rotate-keys", {
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
            jwks: import("./client-jwks").ClientJwks;
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
            body: z.ZodObject<{
                client_id: z.ZodString;
            }, z.z.core.$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, void>;
        getOAuthConsent: import("better-call").StrictEndpoint<"/oauth2/get-consent", {
            method: "GET";
            query: z.ZodObject<{
                id: z.ZodString;
            }, z.z.core.$strip>;
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
        }, import("./types").OAuthConsent<Scope[]>>;
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
        }, import("./types").OAuthConsent<Scope[]>[]>;
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
            body: z.ZodObject<{
                id: z.ZodString;
                update: z.ZodObject<{
                    scopes: z.ZodArray<z.ZodString>;
                }, z.z.core.$strip>;
            }, z.z.core.$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, import("./types").OAuthConsent<Scope[]>>;
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
            body: z.ZodObject<{
                id: z.ZodString;
            }, z.z.core.$strip>;
            metadata: {
                openapi: {
                    description: string;
                };
            };
        }, void>;
        adminCreateOAuthResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources", {
            method: "POST";
            body: z.ZodObject<{
                identifier: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
                name: z.ZodOptional<z.ZodString>;
                accessTokenTtl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                refreshTokenTtl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                signingAlgorithm: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                    RS256: "RS256";
                    PS256: "PS256";
                    ES256: "ES256";
                    ES512: "ES512";
                    EdDSA: "EdDSA";
                }>>>;
                signingKeyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                allowedScopes: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                customClaims: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                dpopBoundAccessTokensRequired: z.ZodOptional<z.ZodBoolean>;
                disabled: z.ZodOptional<z.ZodBoolean>;
                metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.z.core.$strip>;
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("./types").OAuthResource>;
        adminListOAuthResources: import("better-call").StrictEndpoint<"/admin/oauth2/resources", {
            method: "GET";
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("./types").OAuthResource[]>;
        adminGetOAuthResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier", {
            method: "GET";
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("./types").OAuthResource>;
        adminUpdateOAuthResource: import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier", {
            method: "PATCH";
            body: z.ZodObject<{
                identifier: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
                accessTokenTtl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                refreshTokenTtl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                signingAlgorithm: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                    RS256: "RS256";
                    PS256: "PS256";
                    ES256: "ES256";
                    ES512: "ES512";
                    EdDSA: "EdDSA";
                }>>>;
                signingKeyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                allowedScopes: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                customClaims: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                dpopBoundAccessTokensRequired: z.ZodOptional<z.ZodBoolean>;
                disabled: z.ZodOptional<z.ZodBoolean>;
                metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.z.core.$strip>;
            metadata: {
                SERVER_ONLY: true;
            };
        }, import("./types").OAuthResource>;
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
export {};
