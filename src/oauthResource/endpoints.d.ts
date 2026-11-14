import type { GenericEndpointContext } from "@better-auth/core";
import type { OAuthOptions, OAuthResource, OAuthResourceInput, Scope } from "../types";
export declare function createResourceEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<OAuthResource>;
export declare function listResourcesEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<OAuthResource[]>;
export declare function getResourceByIdentifierEndpoint(ctx: GenericEndpointContext & {
    params: {
        identifier: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<OAuthResource>;
export declare function updateResourceEndpoint(ctx: GenericEndpointContext & {
    params: {
        identifier: string;
    };
    body: Partial<OAuthResourceInput>;
}, opts: OAuthOptions<Scope[]>): Promise<OAuthResource>;
export declare function deleteResourceEndpoint(ctx: GenericEndpointContext & {
    params: {
        identifier: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<{
    deleted: boolean;
}>;
/**
 * Link a client to a resource.
 *
 * Route: `POST /admin/oauth2/resources/:identifier/clients/:client_id`.
 * Path params carry the identifiers (RESTful linkage) — no body required.
 * Used by admins when {@link OAuthOptions.enforcePerClientResources} is on.
 */
export declare function linkClientResourceEndpoint(ctx: GenericEndpointContext & {
    params: {
        identifier: string;
        client_id: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<{
    linked: boolean;
}>;
/**
 * Unlink a client from a resource.
 *
 * Route: `DELETE /admin/oauth2/resources/:identifier/clients/:client_id`.
 * Path params carry the identifiers (RESTful linkage) — no body required.
 */
export declare function unlinkClientResourceEndpoint(ctx: GenericEndpointContext & {
    params: {
        identifier: string;
        client_id: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<{
    unlinked: boolean;
}>;
