import type { ResourceRequestInput } from "better-auth/oauth2";
import { APIError } from "better-call";
/** Builds an RFC 9449 §7.1 `WWW-Authenticate: DPoP` challenge value. */
export declare function buildDpopChallengeValue(errorCode: string, description: unknown, algorithms?: readonly string[], scope?: string): string;
/**
 * Create an OAuth resource-server challenge for a failed access-token request.
 *
 * Missing/invalid bearer credentials are reported with RFC 6750 plus the RFC
 * 9728 `resource_metadata` pointer. A 401 whose body has
 * `error: "invalid_token"` means a presented token failed, so its challenge
 * also carries that code and an `error_description` (RFC 6750 §3.1); any
 * other 401 is treated as a request without credentials and carries neither.
 * Insufficient-scope failures (built with
 * `createInsufficientScopeError`) are reported with RFC 6750 §3.1's
 * `insufficient_scope` challenge on a 403 naming the scopes the token lacks, so
 * clients can step up their authorization. DPoP-bound-token failures are
 * reported with RFC 9449's `DPoP` challenge so clients know which proof
 * algorithms to use. Pass the failed `request` so that any 401 or
 * insufficient-scope 403 on a request that presented its token with the
 * `DPoP` scheme, such as an expired or revoked token, is also answered with a
 * `DPoP` challenge (RFC 9449 §7.2), and a 401 on one with an unsupported
 * scheme, or none, with a `Bearer` challenge (RFC 6750 §3.1). Without it,
 * only DPoP-specific errors get one. Non-URL resources (for example a `urn:`
 * or a client id) resolve their metadata URL through
 * `resourceMetadataMappings`.
 *
 * An `error_description` is fitted into RFC 6750 §3's character set rather
 * than rejected: `"` becomes `'`, other excluded characters become spaces, and
 * an empty result is omitted. The returned error's body keeps the original
 * `error` and `error_description`. Invalid scope tokens in `challengeScopes`
 * still throw, since they are server configuration.
 *
 * Every other error returns `undefined`, including a plain `FORBIDDEN`: a
 * permission denial that re-authorizing cannot fix must not be answered with a
 * challenge that sends the user through consent for scopes they already hold.
 *
 * @external
 */
export declare function createResourceServerChallenge(error: unknown, resource: string | string[], opts?: {
    /** Maps non-URL (urn, client) resources to their resource_metadata URL. */
    resourceMetadataMappings?: Record<string, string>;
    /** DPoP JWS algorithms to advertise in RFC 9449 challenges. */
    dpopSigningAlgorithms?: readonly string[];
    /**
     * Scopes to advertise in RFC 6750 bearer challenges,
     * hinting what an unauthenticated client should request. An
     * insufficient-scope failure advertises the scopes it names instead.
     */
    challengeScopes?: readonly string[];
    /**
     * The request that failed, or its `Authorization` header as
     * `{ authorizationHeader }`. A 401 or insufficient-scope 403 on a
     * request that used the `DPoP` scheme is answered with a `DPoP`
     * challenge rather than `Bearer`, and a 401 with an unsupported scheme,
     * or none, always with `Bearer`.
     */
    request?: Request | Pick<ResourceRequestInput, "authorizationHeader">;
}): APIError | undefined;
