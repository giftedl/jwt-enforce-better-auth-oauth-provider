import type { GenericEndpointContext } from "@better-auth/core";
import type { User } from "better-auth/types";
import type { OAuthOptions, SchemaClient, Scope } from "./types";
import type { GrantType } from "./types/oauth";
/**
 * Inputs for {@link resolveAccessTokenClaims}. Every field is derivable from
 * persisted token state, so the resolver produces the same enriched claim set
 * whether it runs at issuance (from the grant) or at introspection (from the
 * stored opaque-token row).
 */
export interface AccessTokenClaimsInput {
    ctx: GenericEndpointContext;
    opts: OAuthOptions<Scope[]>;
    /** Token subject; `null`/`undefined` for `client_credentials`. */
    user: User | null | undefined;
    client: SchemaClient<Scope[]>;
    /** Effective (post resource-allowlist narrowing) scopes. */
    scopes: string[];
    resources: string[] | undefined;
    referenceId: string | undefined;
    /** Parsed client metadata, as returned by `parseClientMetadata`. */
    metadata: Record<string, unknown> | undefined;
    /**
     * Grant type passed to extension claim contributors. Pass `undefined` at
     * introspection: the opaque-token row does not persist the grant, so
     * contributed access-token claims must be grant-type-stable.
     */
    grantType: GrantType | undefined;
    /** Session the tokens are issued for; `undefined` at introspection. See {@link OAuthClaimExtensionInput.sessionId}. */
    sessionId: string | undefined;
    /**
     * Per-issuance claims a grant handler supplied via `accessTokenClaims`.
     * Available only at issuance; `undefined` at introspection.
     */
    perRequestClaims: Record<string, unknown> | undefined;
    /** Per-resource `customClaims` from `resolveResourcePolicy` (raw, not yet stripped). */
    resourcePolicyClaims: Record<string, unknown>;
}
/**
 * The single authority for the enriched (non-AS-owned) claim set an access
 * token carries. Both the JWT mint and the opaque-token introspection
 * re-derive path call this function, so the two formats cannot drift, and
 * reserved RFC 9068 names are stripped unconditionally here so no caller can
 * forget to.
 *
 * Precedence, lowest to highest: extension contributors < per-issuance
 * `accessTokenClaims` < plugin `customAccessTokenClaims` < per-resource
 * `customClaims`. Reserved names are removed from the merged result.
 *
 * Returns only the enriched claims; the caller stamps the AS-owned claims
 * (`iss`/`sub`/`aud`/`exp`/`iat`/`jti`/`client_id`/`scope`/...) itself, so they
 * always win.
 */
export declare function resolveAccessTokenClaims(input: AccessTokenClaimsInput): Promise<Record<string, unknown>>;
