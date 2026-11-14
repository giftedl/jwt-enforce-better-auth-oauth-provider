import type { GenericEndpointContext } from "@better-auth/core";
import type { OAuthOptions, Scope } from "./types";
/**
 * Returns the defined-valued entries of `claims`, dropping any key already
 * present in `base` when given.
 *
 * This is the two-tier claim authority shared by the /userinfo response and the
 * ID token:
 * - Called WITH `base` (the provider's own claims): the additive rule for
 *   third-party extension claims. A contributor may add new keys but never
 *   replace a claim the provider already owns.
 * - Called WITHOUT `base`: the deliberate first-party override path for the
 *   operator's own `customUserInfoClaims` / `customIdTokenClaims`, which is
 *   trusted to override identity claims (for example a formatted `name`). The
 *   caller re-pins `sub` afterwards, so subject integrity holds either way
 *   (OIDC Core §5.3.2: UserInfo `sub` MUST match the ID Token `sub`).
 */
export declare function pickClaims(claims?: Record<string, unknown>, base?: Record<string, unknown>): Record<string, unknown>;
/**
 * Handles the /oauth2/userinfo endpoint.
 *
 * Every 401 carries a challenge (RFC 7235 §3.1): `DPoP` with the accepted
 * proof algorithms (RFC 9449 §7.1) when the token is DPoP-bound or the request
 * used the DPoP scheme, otherwise `Bearer` (RFC 6750 §3). A request without a
 * token is offered both schemes.
 */
export declare function userInfoEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<{
    sub: unknown;
}>;
