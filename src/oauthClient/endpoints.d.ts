import type { GenericEndpointContext } from "@better-auth/core";
import type { ClientJwks } from "../client-jwks";
import type { OAuthClientRegistrationMetadata } from "../register";
import type { OAuthClientAdministrativeResponse, OAuthClientRegistrationResponse, OAuthOptions, Scope } from "../types";
type OAuthClientUpdate = Omit<OAuthClientRegistrationMetadata, "application_type" | "client_id" | "resources"> & {
    application_type?: "web" | "native";
    client_credentials_scopes?: string[];
};
export declare function getClientEndpoint(ctx: GenericEndpointContext & {
    query: {
        client_id: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<import("../types").OAuthClient>;
/**
 * Provides public client fields for any logged-in user.
 * This is commonly used to display information on login flow pages.
 */
export declare function getClientPublicEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, clientId: string): Promise<import("../types").OAuthClient>;
export declare function getClientsEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<import("../types").OAuthClient[]>;
export declare function deleteClientEndpoint(ctx: GenericEndpointContext & {
    body: {
        client_id: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<void>;
export declare function updateClientEndpoint(ctx: GenericEndpointContext & {
    body: {
        client_id: string;
        update: OAuthClientUpdate;
    };
}, opts: OAuthOptions<Scope[]>, settings: {
    admin: true;
}): Promise<OAuthClientAdministrativeResponse>;
export declare function updateClientEndpoint(ctx: GenericEndpointContext & {
    body: {
        client_id: string;
        update: OAuthClientUpdate;
    };
}, opts: OAuthOptions<Scope[]>, settings?: {
    admin?: false;
}): Promise<OAuthClientRegistrationResponse>;
export declare function rotateClientSecretEndpoint(ctx: GenericEndpointContext & {
    body: {
        client_id: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<import("../types").OAuthClient>;
/**
 * The write is guarded on the exact key set the assertion was verified against.
 * A concurrent rotation changes that value, so the stale request loses instead
 * of overwriting a newer key set.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7523#section-3
 */
export declare function rotateClientKeysEndpoint(ctx: GenericEndpointContext & {
    body: {
        client_assertion: string;
        client_assertion_type: string;
        jwks: ClientJwks;
    };
}, opts: OAuthOptions<Scope[]>): Promise<{
    client_id: string;
    jwks: ClientJwks;
}>;
export {};
