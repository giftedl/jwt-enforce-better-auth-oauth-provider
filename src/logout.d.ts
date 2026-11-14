import type { GenericEndpointContext } from "@better-auth/core";
import type { OAuthRedirectResult } from "./authorize";
import type { OAuthOptions, SchemaClient, Scope } from "./types";
/**
 * A client with a registered `backchannel_logout_uri` whose session is being
 * terminated. Carries everything the async delivery phase needs so the caller
 * can fire it into the background without a second DB read.
 */
interface BackchannelLogoutTarget {
    client: SchemaClient<Scope[]>;
    sub: string;
}
/**
 * Plan produced by the synchronous revocation phase. The delivery phase
 * consumes this plan and POSTs one Logout Token per target. `sessionId` is
 * always present because every session-end path that reaches here carries the
 * id of the session being terminated.
 */
export interface BackchannelLogoutPlan {
    accessTokenIds: string[];
    refreshTokenIds: string[];
    sessionId: string;
    targets: BackchannelLogoutTarget[];
}
/**
 * Build the immutable work plan before a session is deleted. This phase only
 * reads database state because a later delete hook may still veto the mutation.
 * Token identifiers must be captured here because their `sessionId` foreign key
 * is cleared when the session row disappears.
 *
 * Revocation is the stored backstop, not the primary enforcement: introspection
 * and `/userinfo` already treat a token whose session has ended as inactive
 * (see `validateOpaqueAccessToken` / `validateJwtAccessToken`), so a missed
 * `revoked` write cannot keep a session-bound token alive on its own. Access
 * tokens bound to the session are revoked as OP hardening. Refresh tokens
 * follow OIDC Back-Channel Logout 1.0 §2.7: those without `offline_access` are
 * revoked; `offline_access` refresh tokens survive so long-lived API access can
 * outlive the browser session.
 *
 * Token revocation runs regardless of the JWT plugin (refresh-token revocation
 * has no dependency on signing). Only Logout Token delivery needs the JWT
 * plugin, so a plan may contain token identifiers with no delivery targets.
 *
 * Returns `null` when there is nothing to do, so the caller can skip the
 * background handoff entirely.
 */
declare function prepareBackchannelLogoutPlan(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, input: {
    sessionId: string;
    userId: string;
}): Promise<BackchannelLogoutPlan | null>;
/**
 * Apply a prepared logout plan after the session deletion succeeds. Core runs
 * `session.delete.after` after the row is consumed and, for transactional
 * callers, only after the transaction commits.
 */
declare function applyBackchannelLogoutPlan(ctx: GenericEndpointContext, plan: BackchannelLogoutPlan): Promise<void>;
export { applyBackchannelLogoutPlan, prepareBackchannelLogoutPlan };
/**
 * RP-Initiated Logout (OIDC RP-Initiated Logout 1.0). The RP presents a signed
 * `id_token_hint`; after verification, the OP terminates the matching session
 * and optionally redirects to `post_logout_redirect_uri`. Requests without a
 * usable hint, and hints that do not identify the current browser session, use
 * a signed, short-lived OP confirmation state before terminating that session.
 *
 * Session termination goes through `internalAdapter.deleteSession`, which fires
 * `session.delete.after` so the hook drives revocation and back-channel
 * notifications to every RP with tokens on the session.
 *
 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html
 */
export declare function rpInitiatedLogoutEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<Response | OAuthRedirectResult>;
/**
 * Completes the browser confirmation flow for RP-Initiated Logout. This route
 * is intentionally scoped to HTTP delivery so it does not become a generated
 * client action; the signed cookie is the only confirmation context it accepts.
 */
export declare function rpInitiatedLogoutConfirmationEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<Response | OAuthRedirectResult>;
