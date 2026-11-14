import { RedirectUriSyntaxSchema, SafeUrlSchema } from "@better-auth/core/utils/redirect-uri";
import * as z from "zod";
/**
 * Re-exported from `@better-auth/core` so every OAuth provider plugin shares one
 * redirect-URI scheme policy. See `@better-auth/core/utils/redirect-uri`.
 */
export { RedirectUriSyntaxSchema, SafeUrlSchema };
/**
 * Validates an RFC 8707 resource indicator. The value must be an absolute URI
 * with no fragment (RFC 8707 §2). Unlike a redirect URI it is not restricted to
 * HTTPS, because a resource server identifier may use any absolute URI scheme;
 * configured OAuth resources are the authoritative control over
 * which resources a token may target.
 */
export declare const ResourceUriSchema: z.ZodString;
/** Canonical RFC 7517 JWK Set metadata for an OAuth client. */
export declare const clientJwksSchema: z.ZodObject<{
    keys: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.z.core.$strip>;
/**
 * Runtime schema for OAuthAuthorizationQuery.
 * Uses passthrough to tolerate fields added by future extensions (PAR, FPA, etc.)
 */
export declare const authorizationQuerySchema: z.ZodObject<{
    response_type: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodEnum<{
        code: "code";
    }>>>;
    request: z.ZodOptional<z.ZodString>;
    request_uri: z.ZodOptional<z.ZodString>;
    redirect_uri: z.ZodOptional<z.ZodURL>;
    scope: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    client_id: z.ZodString;
    prompt: z.ZodOptional<z.ZodString>;
    display: z.ZodOptional<z.ZodString>;
    ui_locales: z.ZodOptional<z.ZodString>;
    max_age: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
    acr_values: z.ZodOptional<z.ZodString>;
    login_hint: z.ZodOptional<z.ZodString>;
    id_token_hint: z.ZodOptional<z.ZodString>;
    code_challenge: z.ZodOptional<z.ZodString>;
    code_challenge_method: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodEnum<{
        S256: "S256";
    }>>>;
    nonce: z.ZodOptional<z.ZodString>;
    claims: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
    dpop_jkt: z.ZodOptional<z.ZodString>;
    resource: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
}, z.z.core.$loose>;
/**
 * Runtime schema for the authorization code verification value.
 * Validates structure on deserialization from the JSON blob stored in the DB.
 * Uses passthrough so future fields (e.g. from authorization challenge) don't break parsing.
 */
export declare const verificationValueSchema: z.ZodObject<{
    type: z.ZodLiteral<"authorization_code">;
    query: z.ZodObject<{
        response_type: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodEnum<{
            code: "code";
        }>>>;
        request: z.ZodOptional<z.ZodString>;
        request_uri: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        client_id: z.ZodString;
        prompt: z.ZodOptional<z.ZodString>;
        display: z.ZodOptional<z.ZodString>;
        ui_locales: z.ZodOptional<z.ZodString>;
        max_age: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodTransform<number, string | number>>>;
        acr_values: z.ZodOptional<z.ZodString>;
        login_hint: z.ZodOptional<z.ZodString>;
        id_token_hint: z.ZodOptional<z.ZodString>;
        code_challenge: z.ZodOptional<z.ZodString>;
        code_challenge_method: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodEnum<{
            S256: "S256";
        }>>>;
        nonce: z.ZodOptional<z.ZodString>;
        dpop_jkt: z.ZodOptional<z.ZodString>;
        resource: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
        redirect_uri: z.ZodOptional<z.ZodURL>;
        claims: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>>;
    }, z.z.core.$loose>;
    sessionId: z.ZodString;
    userId: z.ZodString;
    referenceId: z.ZodOptional<z.ZodString>;
    authTime: z.ZodOptional<z.ZodNumber>;
    resource: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.z.core.$loose>;
/**
 * Request body accepted at `POST /oauth2/register` (RFC 7591 §2 client
 * metadata). This is the single source of truth for the registration contract:
 * the endpoint validates against it and {@link ClientRegistrationRequest} is
 * inferred from it, so the type a `validateInitialAccessToken` callback receives
 * always matches what is actually validated. `grant_types` and
 * `token_endpoint_auth_method` are open strings because extensions can register
 * custom values. Server-assigned fields (`client_id`, `client_secret`, the
 * issued/expiry timestamps) and internal state (`disabled`, `reference_id`) are
 * never part of a registration request.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7591#section-2
 */
export declare const clientRegistrationRequestSchema: z.ZodObject<{
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
/**
 * Complete OAuth client metadata document schema shared by registration and
 * verified client-discovery integrations.
 *
 * Unlike {@link clientRegistrationRequestSchema}, a metadata document carries
 * its own identifier and may contain the server-assigned secret fields that a
 * discovery profile must explicitly prohibit. Keeping those fields in the
 * parsed shape lets profile validation distinguish a forbidden value from an
 * unknown extension without unsafe casts or ad-hoc allowlists.
 */
export declare const oauthClientMetadataSchema: z.ZodObject<{
    contacts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    jwks: z.ZodOptional<z.ZodObject<{
        keys: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.z.core.$strip>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodString>>;
    scope: z.ZodOptional<z.ZodString>;
    redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
    client_name: z.ZodOptional<z.ZodString>;
    client_uri: z.ZodOptional<z.ZodString>;
    logo_uri: z.ZodOptional<z.ZodString>;
    tos_uri: z.ZodOptional<z.ZodString>;
    policy_uri: z.ZodOptional<z.ZodString>;
    software_id: z.ZodOptional<z.ZodString>;
    software_version: z.ZodOptional<z.ZodString>;
    software_statement: z.ZodOptional<z.ZodString>;
    post_logout_redirect_uris: z.ZodOptional<z.ZodArray<z.ZodURL>>;
    backchannel_logout_uri: z.ZodOptional<z.ZodURL>;
    backchannel_logout_session_required: z.ZodOptional<z.ZodBoolean>;
    token_endpoint_auth_method: z.ZodOptional<z.ZodString>;
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
    client_id: z.ZodString;
    client_secret: z.ZodOptional<z.ZodString>;
    client_secret_expires_at: z.ZodOptional<z.ZodNumber>;
    client_id_issued_at: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$loose>;
export type OAuthClientMetadata = z.infer<typeof oauthClientMetadataSchema>;
/**
 * Client metadata as submitted in an RFC 7591 §2 registration request, inferred
 * from {@link clientRegistrationRequestSchema}. Every value is self-asserted by
 * the caller (RFC 7591 §5) and is the raw request before registration defaults
 * are applied, so a `validateInitialAccessToken` callback should treat it as
 * untrusted and not assume defaulted fields are present.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7591#section-2
 */
export type ClientRegistrationRequest = z.infer<typeof clientRegistrationRequestSchema>;
