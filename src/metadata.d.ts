import type { GenericEndpointContext } from "@better-auth/core";
import type { JWSAlgorithms, JwtOptions } from "better-auth/plugins";
import type { OAuthOptions, Scope } from "./types";
import type { AuthServerMetadata, GrantType, TokenEndpointAuthMethod } from "./types/oauth";
export declare function authServerMetadata(ctx: GenericEndpointContext, opts?: JwtOptions, overrides?: {
    scopes_supported?: AuthServerMetadata["scopes_supported"];
    dynamic_client_registration_supported?: boolean;
    public_client_supported?: boolean;
    grant_types_supported?: GrantType[];
    token_endpoint_auth_methods_supported?: TokenEndpointAuthMethod[];
    endpoint_auth_methods_supported?: TokenEndpointAuthMethod[];
    jwt_disabled?: boolean;
    dpop_signing_alg_values_supported?: JWSAlgorithms[];
}): AuthServerMetadata;
export declare function oauthAuthorizationServerMetadata(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): AuthServerMetadata;
export declare function oidcServerMetadata(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]> & {
    claims?: string[];
}): {
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
    dpop_signing_alg_values_supported?: JWSAlgorithms[];
    id_token_signing_alg_values_supported: JWSAlgorithms[] | ["HS256"];
};
export declare function metadataResponse(body: unknown, extraHeaders?: HeadersInit): Response;
/**
 * Provides an exportable `/.well-known/oauth-authorization-server`.
 *
 * Useful when basePath prevents the endpoint from being located at the root
 * and must be provided manually.
 *
 * @external
 */
export declare const oauthProviderAuthServerMetadata: <Auth extends {
    api: {
        getOAuthServerConfig: (...args: any) => any;
    };
}>(auth: Auth, opts?: {
    headers?: HeadersInit;
}) => (request: Request) => Promise<Response>;
/**
 * Provides an exportable `/.well-known/openid-configuration`.
 *
 * Useful when basePath prevents the endpoint from being located at the root
 * and must be provided manually.
 *
 * @external
 */
export declare const oauthProviderOpenIdConfigMetadata: <Auth extends {
    api: {
        getOpenIdConfig: (...args: any) => any;
    };
}>(auth: Auth, opts?: {
    headers?: HeadersInit;
}) => (request: Request) => Promise<Response>;
