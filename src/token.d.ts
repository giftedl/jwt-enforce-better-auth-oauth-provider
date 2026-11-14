import type { GenericEndpointContext } from "@better-auth/core";
import type { Confirmation, OAuthOptions, OAuthProviderApi, SchemaClient, Scope, TokenType, VerificationValue } from "./types";
import type { GrantType } from "./types/oauth";
/**
 * Token presentation scheme implied by a confirmation: a DPoP key thumbprint
 * (`jkt`) yields `"DPoP"`; any other confirmation (including mTLS `x5t#S256`)
 * keeps `"Bearer"`, since that constraint lives at the TLS layer.
 */
export declare function confirmationTokenType(confirmation?: Confirmation): TokenType;
/**
 * Handles the /oauth2/token endpoint by delegating
 * the grant types
 */
export declare function tokenEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<{
    expires_in: number;
    access_token: string;
    expires_at: number;
    token_type: TokenType;
    refresh_token: string | undefined;
    scope: string;
    id_token: string | undefined;
}>;
/**
 * Returns the OAuth Provider's server-side capability surface bound to `ctx`.
 * The token endpoint passes one (pre-bound to the dispatched grant) to each
 * extension grant handler; a companion plugin's own endpoint calls this directly
 * with its grant type. `grantType` is bound here, not per issuance, so a handler
 * cannot mislabel the grant; omit it for capabilities that do not issue tokens
 * (`getClient`, `validateAccessToken`, `requireActiveAccessToken`), and
 * `issueTokens` then throws.
 */
export declare function getOAuthProviderApi(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, grantType?: GrantType): OAuthProviderApi;
/**
 * Decodes a refresh token for a client
 *
 * @internal
 */
export declare function decodeRefreshToken(opts: OAuthOptions<Scope[]>, token: string): Promise<{
    sessionId?: string;
    token: string;
}>;
/**
 * Tear down the entire refresh-token family for a (client, user) pair, plus
 * any access tokens that reference those refresh rows, per RFC 9700 §4.14.
 * Access tokens are deleted first so the parent rows' foreign-key children
 * do not block the refresh-row delete.
 *
 * TODO(invalidate-family-race): the two `deleteMany` calls are not atomic
 * with respect to each other. Between them, a concurrent rotation in a
 * different worker can `create` a fresh refresh row (and, immediately after,
 * an access-token row referencing it) for the same (client, user) pair,
 * leaving the family partially rebuilt and the new refresh row orphaned of
 * any deletion. Closing this window requires the same transactional adapter
 * contract tracked under FIXME(strict-family-invalidation) in
 * `createRefreshToken`.
 *
 * @internal
 */
export declare function invalidateRefreshFamily(ctx: GenericEndpointContext, clientId: string, userId: string): Promise<void>;
/**
 * Checks the token request's DPoP proof before a one-time code is consumed,
 * under the resource policy issuance applies, so a rejected proof leaves the
 * code for a retry.
 *
 * The proof's `jti` is not recorded yet: call `recordReplay` once the code is
 * consumed, then pass `confirmation` to issuance. Recording it earlier would
 * report the loser of a concurrent redemption as a replayed proof instead of a
 * spent code.
 */
export declare function checkDpopProofBeforeConsume(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, params: {
    client: SchemaClient<Scope[]>;
    scopes: string[];
    resources?: string[];
    verificationValue?: VerificationValue;
}): Promise<{
    confirmation?: Confirmation;
    recordReplay: () => Promise<void>;
}>;
