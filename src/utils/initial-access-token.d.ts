import type { GenericEndpointContext } from "@better-auth/core";
import type { ClientRegistrationRequest, InitialAccessTokenAuthorization, OAuthOptions, Scope } from "../types";
/**
 * Resolves an RFC 7591 initial access token from the request and authorizes it
 * against the deployment-supplied validator.
 *
 * Returns the authorization (optionally carrying a `referenceId`) when a valid
 * token is present, or `undefined` when no Bearer credentials were sent so the
 * caller can fall back to session or open registration. Throws an RFC 6750
 * Bearer challenge when the header is malformed, no validator is configured, or
 * the token is rejected.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7591#section-3
 */
export declare function authorizeInitialAccessToken(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, clientMetadata: ClientRegistrationRequest): Promise<InitialAccessTokenAuthorization | undefined>;
