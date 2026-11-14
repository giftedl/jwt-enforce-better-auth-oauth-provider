import type { AuthContext } from "@better-auth/core";
import type { DeviceAuthorizationGrant, DeviceAuthorizationPluginOptions } from "better-auth/plugins/device-authorization";
import * as z from "zod";
import type { OAuthExtensionGrantHandlerInput, OAuthTokenResponse } from "./types";
/**
 * RFC 8628 device authorization grant type. A registered OAuth client polls the
 * token endpoint with this `grant_type` to exchange an approved device code for
 * a first-class OAuth token set.
 */
export declare const DEVICE_CODE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";
/**
 * Exchanges an approved RFC 8628 device code for an OAuth token set. Unlike the
 * device-authorization plugin's `/device/token` (which mints a first-party
 * session token), this issues a real OAuth token through the provider's shared
 * issuance: scoped, audience-bound, introspectable, with optional refresh and ID
 * tokens. The device-authorization plugin owns the record and runs the shared
 * polling and atomic-consumption state machine for this handler.
 */
declare function exchangeOAuthDeviceCode(input: OAuthExtensionGrantHandlerInput): Promise<OAuthTokenResponse>;
declare function buildOAuthDeviceGrant(): {
    requestSchemaFields: {
        client_secret: z.ZodOptional<z.ZodString>;
        client_assertion: z.ZodOptional<z.ZodString>;
        client_assertion_type: z.ZodOptional<z.ZodString>;
        resource: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodLiteral<"">]>>;
    };
    requestErrorCodes: readonly ["invalid_target"];
    requestOpenAPIResponses: {
        401: {
            description: string;
            headers: {
                "WWW-Authenticate": {
                    description: string;
                    schema: {
                        type: string;
                        example: string;
                    };
                };
            };
            content: {
                "application/json": {
                    schema: {
                        type: string;
                        properties: {
                            error: {
                                type: string;
                                enum: string[];
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
    onRequestValidationError: (issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[]) => void;
    deviceCodeSchemaFields: {
        resources: {
            type: "string[]";
            required: false;
        };
        oauthClientId: {
            type: "string";
            required: false;
        };
    };
    grants: {
        "urn:ietf:params:oauth:grant-type:device_code": typeof exchangeOAuthDeviceCode;
    };
    metadata: (metadataInput: import("./types").OAuthMetadataExtensionInput) => {
        device_authorization_endpoint: string;
    };
    authorizeRequest: ({ ctx, request }: {
        ctx: import("@better-auth/core").GenericEndpointContext;
        request: import("better-auth/plugins/device-authorization").DeviceAuthorizationRequest & {
            client_secret?: string;
            client_assertion?: string;
            client_assertion_type?: string;
            resource?: string | string[];
        };
    }) => Promise<{
        clientId: string;
        deviceCodeFields: {
            oauthClientId: string;
            resources: string[];
        };
    }>;
    assertSessionRedemption: ({ deviceCode }: {
        ctx: import("@better-auth/core").GenericEndpointContext;
        deviceCode: Record<string, unknown>;
    }) => void;
    getVerificationContext: (deviceCode: Record<string, unknown>) => {
        resource: string | string[];
    };
    verificationOpenAPIProperties: {
        resource: {
            oneOf: ({
                type: string;
                items?: undefined;
            } | {
                type: string;
                items: {
                    type: string;
                };
            })[];
            description: string;
        };
    };
};
type OAuthDeviceGrant = ReturnType<typeof buildOAuthDeviceGrant>;
/** Options for the OAuth Device Authorization integration. */
export type OAuthDeviceAuthorizationOptions = Omit<DeviceAuthorizationPluginOptions<OAuthDeviceGrant>, "grant">;
/**
 * Enables the {@link https://datatracker.ietf.org/doc/html/rfc8628 RFC 8628}
 * device authorization grant for OAuth Provider. Device Authorization owns
 * code creation and user approval; OAuth Provider owns client validation and
 * token issuance.
 *
 * Pair this plugin with `oauthProvider()` or `mcp()`. First-party device login
 * continues to use `deviceAuthorization()` and `/device/token` instead.
 *
 * @example
 * ```ts
 * const auth = betterAuth({
 *   plugins: [
 *     oauthProvider({ ... }),
 *     oauthDeviceAuthorization(),
 *   ],
 * });
 * ```
 */
export declare function oauthDeviceAuthorization(options?: OAuthDeviceAuthorizationOptions): {
    init(ctx: AuthContext): void;
    id: "device-authorization";
    version: string;
    schema: {
        deviceCode: {
            fields: {
                deviceCode: {
                    type: "string";
                    required: true;
                };
                userCode: {
                    type: "string";
                    required: true;
                };
                userId: {
                    type: "string";
                    required: false;
                };
                expiresAt: {
                    type: "date";
                    required: true;
                };
                status: {
                    type: "string";
                    required: true;
                };
                lastPolledAt: {
                    type: "date";
                    required: false;
                };
                pollingInterval: {
                    type: "number";
                    required: false;
                };
                clientId: {
                    type: "string";
                    required: false;
                };
                scope: {
                    type: "string";
                    required: false;
                };
            };
            indexes: {
                fields: [string];
                unique: true;
            }[];
        };
    };
    endpoints: {
        deviceCode: import("better-call").StrictEndpoint<"/device/code", {
            method: "POST";
            cloneRequest: true;
            body: z.ZodObject<{
                client_id: z.ZodString;
                user_id: z.ZodOptional<z.ZodString>;
                scope: z.ZodOptional<z.ZodString>;
                client_secret: z.ZodOptional<z.ZodString>;
                client_assertion: z.ZodOptional<z.ZodString>;
                client_assertion_type: z.ZodOptional<z.ZodString>;
                resource: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodLiteral<"">]>>;
            }, z.z.core.$strip> | z.ZodObject<{
                user_id: z.ZodOptional<z.ZodString>;
                scope: z.ZodOptional<z.ZodString>;
                client_id: z.ZodOptional<z.ZodString>;
                client_secret: z.ZodOptional<z.ZodString>;
                client_assertion: z.ZodOptional<z.ZodString>;
                client_assertion_type: z.ZodOptional<z.ZodString>;
                resource: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>, z.ZodLiteral<"">]>>;
            }, z.z.core.$strip>;
            error: z.ZodObject<{
                error: z.ZodEnum<{
                    invalid_request: "invalid_request";
                    invalid_client: "invalid_client";
                    unauthorized_client: "unauthorized_client";
                    invalid_scope: "invalid_scope";
                    server_error: "server_error";
                    invalid_target: "invalid_target";
                }>;
                error_description: z.ZodString;
            }, z.z.core.$strip>;
            onValidationError: ({ issues, message }: {
                message: string;
                issues: readonly import("better-call").StandardSchemaV1.Issue[];
            }) => never;
            metadata: {
                noStore: boolean;
                allowedMediaTypes: string[];
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            device_code: {
                                                type: string;
                                                description: string;
                                            };
                                            user_code: {
                                                type: string;
                                                description: string;
                                            };
                                            verification_uri: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            verification_uri_complete: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            expires_in: {
                                                type: string;
                                                description: string;
                                            };
                                            interval: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        400: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                                enum: ["invalid_request", "invalid_client", "unauthorized_client", "invalid_scope", "invalid_target"];
                                            };
                                            error_description: {
                                                type: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        500: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                                enum: string[];
                                            };
                                            error_description: {
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
            device_code: string;
            user_code: string;
            verification_uri: string;
            verification_uri_complete: string;
            expires_in: number;
            interval: number;
        }>;
        deviceToken: import("better-call").StrictEndpoint<"/device/token", {
            method: "POST";
            body: z.ZodObject<{
                grant_type: z.ZodLiteral<"urn:ietf:params:oauth:grant-type:device_code">;
                device_code: z.ZodString;
                client_id: z.ZodString;
            }, z.z.core.$strip>;
            error: z.ZodObject<{
                error: z.ZodEnum<{
                    invalid_request: "invalid_request";
                    invalid_client: "invalid_client";
                    authorization_pending: "authorization_pending";
                    slow_down: "slow_down";
                    expired_token: "expired_token";
                    access_denied: "access_denied";
                    invalid_grant: "invalid_grant";
                }>;
                error_description: z.ZodString;
            }, z.z.core.$strip>;
            metadata: {
                noStore: boolean;
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            session: {
                                                $ref: string;
                                            };
                                            user: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        400: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            error: {
                                                type: string;
                                                enum: string[];
                                            };
                                            error_description: {
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
            access_token: string;
            token_type: string;
            expires_in: number;
            scope: string;
        }>;
        deviceVerify: import("better-call").StrictEndpoint<"/device", {
            method: "GET";
            query: z.ZodObject<{
                user_code: z.ZodString;
            }, z.z.core.$strip>;
            error: z.ZodObject<{
                error: z.ZodEnum<{
                    invalid_request: "invalid_request";
                }>;
                error_description: z.ZodString;
            }, z.z.core.$strip>;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            user_code: {
                                                type: string;
                                                description: string;
                                            };
                                            status: {
                                                type: string;
                                                enum: string[];
                                                description: string;
                                            };
                                            client_id: {
                                                type: string;
                                                description: string;
                                            };
                                            scope: {
                                                type: string;
                                                description: string;
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
            user_code: string;
            status: string;
            client_id?: string | undefined;
            scope?: string | undefined;
        } & Partial<{
            resource: string | string[];
        }>>;
        deviceApprove: import("better-call").StrictEndpoint<"/device/approve", {
            method: "POST";
            body: z.ZodObject<{
                userCode: z.ZodString;
            }, z.z.core.$strip>;
            error: z.ZodObject<{
                error: z.ZodEnum<{
                    invalid_request: "invalid_request";
                    expired_token: "expired_token";
                    access_denied: "access_denied";
                    device_code_already_processed: "device_code_already_processed";
                    unauthorized: "unauthorized";
                }>;
                error_description: z.ZodString;
            }, z.z.core.$strip>;
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            success: {
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
            success: boolean;
        }>;
        deviceDeny: import("better-call").StrictEndpoint<"/device/deny", {
            method: "POST";
            body: z.ZodObject<{
                userCode: z.ZodString;
            }, z.z.core.$strip>;
            error: z.ZodObject<{
                error: z.ZodEnum<{
                    invalid_request: "invalid_request";
                    expired_token: "expired_token";
                    access_denied: "access_denied";
                    unauthorized: "unauthorized";
                }>;
                error_description: z.ZodString;
            }, z.z.core.$strip>;
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        200: {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            success: {
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
            success: boolean;
        }>;
    };
    rateLimit: {
        pathMatcher(path: string): path is "/device";
        window: number;
        max: number;
    }[];
    $ERROR_CODES: {
        USER_NOT_FOUND: import("better-auth/*").RawError<"USER_NOT_FOUND">;
        FAILED_TO_CREATE_SESSION: import("better-auth/*").RawError<"FAILED_TO_CREATE_SESSION">;
        INVALID_DEVICE_CODE: import("better-auth/*").RawError<"INVALID_DEVICE_CODE">;
        EXPIRED_DEVICE_CODE: import("better-auth/*").RawError<"EXPIRED_DEVICE_CODE">;
        EXPIRED_USER_CODE: import("better-auth/*").RawError<"EXPIRED_USER_CODE">;
        AUTHORIZATION_PENDING: import("better-auth/*").RawError<"AUTHORIZATION_PENDING">;
        ACCESS_DENIED: import("better-auth/*").RawError<"ACCESS_DENIED">;
        INVALID_USER_CODE: import("better-auth/*").RawError<"INVALID_USER_CODE">;
        DEVICE_CODE_ALREADY_PROCESSED: import("better-auth/*").RawError<"DEVICE_CODE_ALREADY_PROCESSED">;
        DEVICE_CODE_NOT_CLAIMED: import("better-auth/*").RawError<"DEVICE_CODE_NOT_CLAIMED">;
        POLLING_TOO_FREQUENTLY: import("better-auth/*").RawError<"POLLING_TOO_FREQUENTLY">;
        INVALID_DEVICE_CODE_STATUS: import("better-auth/*").RawError<"INVALID_DEVICE_CODE_STATUS">;
        AUTHENTICATION_REQUIRED: import("better-auth/*").RawError<"AUTHENTICATION_REQUIRED">;
    };
    options: {
        grant: DeviceAuthorizationGrant<Readonly<{
            [k: string]: z.z.core.$ZodType<unknown, unknown, z.z.core.$ZodTypeInternals<unknown, unknown>>;
        }>, Record<string, unknown>> | undefined;
        expiresIn: import("better-auth/plugins/device-authorization").TimeString;
        interval: import("better-auth/plugins/device-authorization").TimeString;
        deviceCodeLength: number;
        userCodeLength: number;
        generateDeviceCode?: (() => string | Promise<string>) | undefined;
        generateUserCode?: (() => string | Promise<string>) | undefined;
        validateClient?: ((clientId: string) => boolean | Promise<boolean>) | undefined;
        onDeviceAuthRequest?: ((clientId: string, scope: string | undefined) => void | Promise<void>) | undefined;
        verificationUri?: string | undefined;
        schema?: {
            deviceCode?: {
                modelName?: string | undefined;
                fields?: {
                    deviceCode?: string | undefined;
                    userCode?: string | undefined;
                    userId?: string | undefined;
                    expiresAt?: string | undefined;
                    status?: string | undefined;
                    lastPolledAt?: string | undefined;
                    pollingInterval?: string | undefined;
                    clientId?: string | undefined;
                    scope?: string | undefined;
                } | undefined;
            } | undefined;
        } | undefined;
    };
};
export {};
