import type { GenericEndpointContext } from "@better-auth/core";
import type { JWTPayload } from "jose";
import type { ActiveAccessTokenPayload, OAuthOptions, Scope } from "./types";
/**
 * Validates an access token (JWT or opaque) and returns its RFC 7662
 * introspection-format payload.
 *
 * @internal
 */
export declare function validateAccessToken(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, token: string, clientId?: string): Promise<JWTPayload>;
export declare function requireActiveAccessToken(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, token: string, clientId?: string): Promise<ActiveAccessTokenPayload>;
/**
 * UserInfo entry point: validates the access token, requires it active, and
 * returns the introspection payload together with the OIDC `claims.userinfo`
 * names persisted for the token. Opaque tokens carry the names on their row;
 * JWT access tokens return an empty list and resolve UserInfo claims by scope.
 */
export declare function requireActiveAccessTokenWithClaims(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, token: string, clientId?: string): Promise<{
    payload: ActiveAccessTokenPayload;
    requestedUserInfoClaims: string[];
}>;
export declare function introspectEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<JWTPayload>;
