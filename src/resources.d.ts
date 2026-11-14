import type { AuthContext, GenericEndpointContext } from "@better-auth/core";
import type { JWSAlgorithms } from "better-auth/plugins";
import type { OAuthOptions, OAuthResource, OAuthResourceInput, Scope } from "./types";
/**
 * Source-of-truth list of asymmetric JWS algorithms supported by the JWT
 * plugin. Mirrors the {@link JWSAlgorithms} literal-union type from
 * `packages/better-auth/src/plugins/jwt/types.ts`. Kept as a runtime const
 * so the admin-CRUD zod schema AND the seed-config validator can reject
 * bad values up-front rather than surfacing opaque jose errors at issuance.
 *
 * MUST stay in sync with `JWSAlgorithms`. The type-level guard immediately
 * below fails the typecheck if the two drift.
 */
export declare const JWS_ALGORITHMS: readonly ["EdDSA", "ES256", "ES512", "PS256", "RS256"];
/**
 * Result of {@link assertIdentifierValid}/{@link checkIdentifier}. When
 * `ok: false`, `reason` is a human-readable validation failure suitable for
 * `error_description` (admin endpoints throw `invalid_target`) or a `logger.warn`
 * (seed path skips the entry).
 *
 * @internal
 */
export type IdentifierCheckResult = {
    ok: true;
} | {
    ok: false;
    reason: string;
};
/**
 * Variant of {@link checkIdentifier} that throws `invalid_target` on failure.
 * Used by admin CRUD endpoints where validation failure is a client error.
 *
 * @internal
 */
export declare function assertIdentifierValid(opts: Pick<OAuthOptions<Scope[]>, "identifierValidator">, identifier: string): Promise<void>;
/**
 * Resolved resource policy for a single `/oauth2/token` (or `/oauth2/authorize`)
 * request. Computed by {@link resolveResourcePolicy} and consumed by the
 * token-issuance pipeline.
 */
export interface ResolvedResourcePolicy {
    /**
     * The `aud` claim value:
     * - `undefined` when the request omitted `resource` (legacy behavior)
     * - a single string when exactly one resource was requested
     * - an array when multiple were requested
     *
     * Includes the implicit `/oauth2/userinfo` audience when `openid` is in
     * scope — the OIDC userinfo endpoint expects to find itself in `aud`.
     */
    audienceClaim: string | string[] | undefined;
    /**
     * Effective access-token TTL in seconds. `null` means "no resource-specific
     * override — caller should use the plugin default."
     *
     * When multiple resources are requested, this is the **minimum** TTL
     * across all of them (OAuth 2.1 §1.5 bounded-blast-radius rule).
     */
    accessTokenTtl: number | null;
    /**
     * Effective refresh-token TTL in seconds. `null` means "no resource-specific
     * override — caller should use {@link OAuthOptions.refreshTokenExpiresIn}
     * (or its built-in default)."
     *
     * When multiple resources are requested, this is the **minimum** TTL
     * across all of them (same bounded-blast-radius rule as access tokens).
     */
    refreshTokenTtl: number | null;
    /**
     * Effective signing algorithm and key id for the issued token.
     *
     * The JWS Protected Header (RFC 7515 §4.1) carries exactly one `alg` and
     * at most one `kid`, so a single signed token can satisfy a multi-resource
     * request only when every resource's pins are mutually compatible:
     * the set of unique non-null `signingAlgorithm` values across requested
     * resources must be ≤ 1, and the same for `signingKeyId`. When the
     * compatibility check passes, the single unique pin (if any) is honored;
     * `null` means "no resource pinned this, fall back to the JWT plugin
     * default." Conflicts raise `invalid_request`.
     */
    signingAlgorithm: JWSAlgorithms | null;
    signingKeyId: string | null;
    /**
     * Merged custom claims across requested resources, returned RAW: reserved
     * RFC 9068 names are NOT stripped here. Feed this into
     * `resolveAccessTokenClaims`, which owns the single strip; do not place it on
     * a token directly or a resource could override an AS-owned claim.
     */
    rawCustomClaims: Record<string, unknown>;
    /**
     * True when at least one requested resource requires DPoP-bound access
     * tokens.
     */
    dpopBoundAccessTokensRequired: boolean;
    /**
     * The intersection of the caller's `requestedScopes` with each requested
     * resource's `allowedScopes`. When no requested resource defines an
     * allowlist, equals `requestedScopes` unchanged.
     *
     * - A resource with `allowedScopes: null` is treated as "no restriction"
     *   for that resource (other resources' allowlists still apply).
     * - A resource whose allowlist excludes every requested scope causes
     *   {@link resolveResourcePolicy} to throw `invalid_scope`.
     * - Otherwise this is the filtered scope set the token endpoint should
     *   mint with (RFC 6749 §3.3 narrow-but-don't-widen).
     */
    effectiveScopes: string[];
}
/**
 * Re-parses a request's raw `application/x-www-form-urlencoded` body to
 * recover every value of the repeated `resource` parameter (RFC 8707 §2).
 *
 * Workaround for better-call's form-body parser (better-call ≤1.3.5), which
 * collapses repeated form keys with last-write-wins. A client sending
 * `resource=https://a&resource=https://b` would otherwise arrive in the
 * handler as `{ resource: "https://b" }`, silently narrowing the issued
 * token's `aud` to a single resource.
 *
 * Returns the full ordered list when the body is form-encoded and contains
 * any `resource` entries; `undefined` otherwise. Caller MUST enable
 * `cloneRequest: true` on the endpoint — the body stream is read here a
 * second time, and that only works when better-call cloned the request
 * before its own parse.
 *
 * Note: the URL-encoded body path is the only one affected. The query-string
 * path (e.g. `/oauth2/authorize?resource=…&resource=…`) is parsed by the
 * router itself, which DOES array-promote duplicate keys correctly.
 *
 * @internal
 */
export declare function extractRepeatedResourceFromForm(request: Request): Promise<string[] | undefined>;
/**
 * Validates a JWT `aud` claim against the OAuth resource model.
 *
 * Every non-implicit audience value must resolve to an `oauthResource` row.
 * Disabled rows still pass because disabling blocks new issuance; deleting the
 * row is the operation that invalidates already-issued tokens.
 *
 * @internal
 */
export declare function isAudienceClaimAllowed(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, audienceClaim: string | string[] | undefined, implicitAudiences?: Iterable<string>): Promise<boolean>;
/**
 * Resolves the resource policy for a request.
 *
 * Validation steps (RFC 8707 §3 + per-resource policy):
 *
 * 1. Resolve `resource` parameter to a list of identifiers.
 * 2. For each identifier, look up the {@link OAuthResource} row.
 *    - Missing → `invalid_target`.
 *    - `disabled` → `invalid_target` (no new issuance).
 * 3. If {@link OAuthOptions.enforcePerClientResources} resolves to true,
 *    confirm the client is linked to every requested resource via
 *    `oauthClientResource`. Unlinked → `invalid_target`.
 * 4. Intersect `requestedScopes` with each resource's `allowedScopes`.
 *    Empty intersection → `invalid_scope`.
 * 5. Pick the minimum `accessTokenTtl` across requested resources.
 * 6. Pick signing config — only honored for single-resource requests
 *    (a JWT can only have one signature).
 * 7. Merge per-resource `customClaims` (returned raw; reserved-claim
 *    stripping is owned by `resolveAccessTokenClaims`).
 *
 * When no `resource` param is present, returns an empty policy: no `aud`
 * claim and no resource-specific overrides.
 *
 * @internal
 */
export declare function resolveResourcePolicy(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, params: {
    resource: unknown;
    clientId: string;
    requestedScopes: string[];
}): Promise<ResolvedResourcePolicy>;
/**
 * Returns `true` when `clientId` is linked, via the `oauthClientResource` join
 * table, to at least one of `resourceIdentifiers`. Authorizes cross-client token
 * introspection (RFC 7662 §2.1/§4): a resource server may introspect a token
 * whose audience it serves, even when a different client issued the token.
 *
 * @internal
 */
export declare function isClientLinkedToAnyResource(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, clientId: string, resourceIdentifiers: string[]): Promise<boolean>;
/**
 * Merges `customClaims` from the existing rows of `resourceIdentifiers` in
 * order (later resources win on collision). Missing rows are skipped; disabled
 * rows are included, since an already-issued token keeps its claims until it
 * expires. Returned raw; `resolveAccessTokenClaims` strips reserved names.
 *
 * Unlike {@link resolveResourcePolicy}, this applies none of the new-issuance
 * gates (disabled, scope allowlist, client linkage), so it is the right way to
 * re-derive claims for an already-issued token at introspection.
 *
 * @internal
 */
export declare function getResourceCustomClaims(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, resourceIdentifiers: string[]): Promise<Record<string, unknown>>;
/**
 * Removes an entry from the resource cache. Called by admin CRUD handlers
 * after every write. Pass no argument to clear the entire cache.
 *
 * @internal
 */
export declare function invalidateResourceCache(identifier?: string): void;
/**
 * Looks up an {@link OAuthResource} by `identifier`, consulting the in-process
 * cache when the identifier is in {@link OAuthOptions.cachedResources}.
 *
 * Triggers the lazy seed via {@link seedResourcesOnce} on first call — the
 * retry path when the startup seed failed (database unreachable, or
 * migrations run after plugin init). The seed is idempotent, so once one
 * call completes, later calls skip it.
 *
 * Returns a defensive copy so callers can't mutate cached state.
 *
 * @internal
 */
export declare function getResource(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, identifier: string): Promise<OAuthResource | null>;
/**
 * Coerces seed-config `resources` entries — string or object form — into a
 * normalized list of {@link OAuthResourceInput}.
 *
 * @internal
 */
export declare function collectResourceInputs(opts: Pick<OAuthOptions<Scope[]>, "resources">): OAuthResourceInput[];
/**
 * Logs a failed startup seed. Missing tables are expected before migrations
 * and stay quiet; anything else is an error worth seeing.
 *
 * @internal
 */
export declare function logStartupSeedFailure(ctx: AuthContext, error: unknown): void;
/**
 * Resets the lazy-seed state. Used by tests to force re-seeding between
 * cases — should not be called from production code.
 *
 * @internal
 */
export declare function resetSeedStateForTests(): void;
/**
 * Seeds `oauthResource` rows from plugin config.
 *
 * Behavior is controlled by {@link OAuthOptions.resourceSeedMode}:
 *
 * - `"insertOnly"` (default, safe): inserts rows whose `identifier` is not
 *   already present. Existing rows are untouched — admin edits via CRUD
 *   are never reverted on restart.
 * - `"merge"`: inserts missing rows; updates only specified fields for
 *   existing rows. Useful when config holds the "preferred defaults" but
 *   admins customize per-row.
 * - `"overwrite"`: inserts missing rows; replaces every policy column on
 *   existing rows with the config value (omitted fields → null). Use only
 *   when config is the single source of truth.
 *
 * Race-safety: the `identifier` column carries a UNIQUE constraint, so two
 * processes booting simultaneously can each attempt the insert — one wins,
 * the other re-reads the row and treats the failed insert as a no-op.
 *
 * Throws on storage errors, including a missing table. Callers go through
 * {@link seedResourcesOnce}, which stays incomplete after a failure so the
 * next resource access retries (e.g. after migrations run).
 *
 * Idempotent: safe to call multiple times.
 *
 * @internal
 */
export declare function seedResources(ctx: AuthContext, opts: OAuthOptions<Scope[]>, isComplete?: () => boolean): Promise<void>;
/**
 * Idempotent wrapper around {@link seedResources}, called from plugin `init`
 * and from every resource lookup. Each call runs its own seed until one
 * completes, because on Workers a pending seed started by a request that has
 * ended never settles. The seed tolerates a row a concurrent call inserted.
 * A failure leaves the state incomplete, so the next call retries.
 *
 * @internal
 */
export declare function seedResourcesOnce(ctx: AuthContext, opts: OAuthOptions<Scope[]>): Promise<void>;
/**
 * Logs the resolved value of {@link OAuthOptions.enforcePerClientResources}
 * so deployment admins see which default applied at init. Separated from
 * {@link resolveEnforcePerClientResources} so the latter stays pure and
 * cheap to call from validation flow.
 *
 * @internal
 */
export declare function logEnforcePerClientResourcesResolution(opts: Pick<OAuthOptions<Scope[]>, "enforcePerClientResources">): void;
