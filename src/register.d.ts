import type { GenericEndpointContext } from "@better-auth/core";
import type { OAuthClientAdministrativeResponse, OAuthClientRegistrationResponse, OAuthOptions, SchemaClient, Scope } from "./types";
import type { OAuthClient } from "./types/oauth";
export type OAuthClientRegistrationMetadata = Omit<OAuthClient, "client_id" | "redirect_uris" | "client_secret_expires_at"> & {
    client_id?: string;
    redirect_uris?: string[];
    client_secret_expires_at?: number | string;
    metadata?: Record<string, unknown>;
    resources?: string[];
};
export declare function registerEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<OAuthClientRegistrationResponse>;
export declare function checkOAuthClient(client: OAuthClientRegistrationMetadata, opts: OAuthOptions<Scope[]>, settings?: {
    registrationSource?: "dynamic" | "managed" | "clientMetadataDocument";
    ctx?: GenericEndpointContext;
}): Promise<void>;
interface CreateOAuthClientRegistrationBaseInput {
    /** Validated endpoint metadata or trusted internal metadata. */
    metadata: OAuthClientRegistrationMetadata;
    /** Already-authorized owner inputs resolved by the endpoint adapter. */
    userId?: string;
    referenceId?: string;
    /** Internal fixed identifier seam for verified client discovery. */
    clientId?: string;
}
export type CreateOAuthClientRegistrationInput = (CreateOAuthClientRegistrationBaseInput & {
    registrationSource: "dynamic";
    /** Client-requested DCR resources resolved and linked by the operation. */
    requestedResources?: string[];
}) | (CreateOAuthClientRegistrationBaseInput & {
    registrationSource: "managed";
    /**
     * Resources to link to the new client. The caller must authorize the
     * `link` resource privilege for each one before persisting.
     */
    requestedResources?: string[];
    /** Server-owned scope ceiling configured by an administrator. */
    clientCredentialsScopes?: Scope[];
});
export interface OAuthClientRegistrationResult {
    client: SchemaClient<Scope[]>;
    clientSecret?: string;
    resources: string[];
    created: boolean;
}
export interface RegisterClientMetadataDocumentInput {
    metadata: OAuthClient;
    clientId: string;
    clientDiscoveryId: string;
    existingClient?: SchemaClient<Scope[]>;
}
/**
 * First-party persistence seam for a validated Client ID Metadata Document.
 *
 * This operation owns both initial creation and atomic replacement. It never
 * generates a client secret, preserves operator-controlled flags on
 * replacement, and ensures server-default resource links in the same
 * transaction.
 *
 * @internal
 */
export declare function registerClientMetadataDocument(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, input: RegisterClientMetadataDocumentInput): Promise<OAuthClientRegistrationResult>;
export declare function createOAuthClientEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, settings: {
    admin: true;
}): Promise<OAuthClientAdministrativeResponse>;
export declare function createOAuthClientEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, settings?: {
    admin?: false;
}): Promise<OAuthClientRegistrationResponse>;
/**
 * Converts an OAuth 2.0 Dynamic Client Schema to a Database Schema
 *
 * @param input
 * @returns
 */
export declare function oauthToSchema(input: OAuthClientRegistrationMetadata & {
    client_id: string;
    client_secret_expires_at?: number;
}): SchemaClient<Scope[]>;
export declare function oauthToSchema(input: OAuthClientRegistrationMetadata): Partial<SchemaClient<Scope[]>>;
/**
 * Converts a Database Schema to an OAuth 2.0 Dynamic Client Schema
 * @param input
 * @param cleaned - default true, determines if the output has only Oauth 2.0 compatible data
 * @returns
 */
export declare function schemaToOAuth(input: SchemaClient<Scope[]>): OAuthClient;
export {};
