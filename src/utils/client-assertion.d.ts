import type { GenericEndpointContext } from "@better-auth/core";
import type { OAuthOptions, SchemaClient, Scope } from "../types";
/**
 * SSRF gate for user-supplied server-side fetch targets (`jwks_uri`,
 * `backchannel_logout_uri`): returns true when the host is NOT publicly
 * routable. That covers loopback, RFC 1918 private, link-local (including AWS
 * IMDS `169.254.169.254`), shared-address-space (carrier-grade NAT),
 * IPv4-mapped IPv6, 6to4/NAT64/Teredo tunnels, every other RFC 6890
 * special-purpose range, and cloud-metadata FQDNs.
 *
 * Delegates to the audited single source of truth so this check cannot drift
 * into the kind of encoding bypass that bespoke regexes invite. This is a
 * syntactic check only: it does not resolve DNS, so a public name that
 * resolves to a private address at fetch time is not caught here.
 */
export declare function isPrivateHostname(hostname: string): boolean;
/**
 * Enforces the assertion-hygiene claims every client-assertion authentication
 * method must check, independent of how the signature is verified or where the
 * verification keys come from:
 * - `aud` MUST include `expectedAudience` (RFC 7523 §3 rule 3),
 * - `exp` MUST be present, unexpired, and at most `assertionMaxLifetime`
 *   seconds away (RFC 7523 §3 rule 4),
 * - `iat`, when present, MUST be within `assertionMaxLifetime`,
 * - `jti` MUST be present and single-use; this consumes a replay tombstone keyed
 *   by `` `${namespace}:${jti}` ``, inserted under the adapter's primary key so a
 *   replay across workers fails atomically.
 *
 * A custom {@link OAuthClientAuthenticationStrategy} should call this after
 * verifying the assertion signature, so an extension method inherits the same
 * replay, lifetime, and audience guarantees as the built-in `private_key_jwt`
 * path, which calls it too.
 *
 * @param params.namespace Scopes the replay tombstone to the method and client,
 *   e.g. `` `${method}:${clientId}` ``, so the same `jti` can recur across
 *   distinct methods or clients but never within one.
 */
export declare function consumeClientAssertion(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, params: {
    namespace: string;
    payload: {
        aud?: unknown;
        exp?: unknown;
        iat?: unknown;
        jti?: unknown;
    };
    expectedAudience: string;
}): Promise<void>;
/**
 * Verifies a client assertion JWT for `private_key_jwt` authentication.
 *
 * Validates: signature, iss=client_id, sub=client_id, aud=the endpoint serving
 * the assertion or the normalized OP issuer, exp, assertion max lifetime,
 * jti uniqueness (replay prevention).
 *
 * Returns the client record the signature was checked against, so a caller that
 * mutates the client can guard its write on exactly that snapshot.
 *
 * With `endpointAudienceOnly`, the issuer is not an accepted audience, so only
 * an assertion whose `aud` includes `expectedAudience` verifies. Endpoints that
 * change client credentials use it, so an assertion minted for the token
 * endpoint or the issuer cannot be redirected to them.
 *
 * `assertClient` runs on the looked-up client before any key is fetched or the
 * jti is consumed, so a caller can refuse a client it does not serve without
 * spending the assertion or reaching out to a `jwks_uri`.
 */
export declare function verifyClientAssertion(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, clientAssertion: string, clientAssertionType: string, clientIdHint?: string, expectedAudience?: string, options?: {
    endpointAudienceOnly?: boolean;
    assertClient?: (client: SchemaClient<Scope[]>) => void;
}): Promise<{
    clientId: string;
    client: SchemaClient<Scope[]>;
}>;
