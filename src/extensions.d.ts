import type { AuthContext, GenericEndpointContext } from "@better-auth/core";
import type { ClientDiscovery, OAuthClaimExtensionInput, OAuthClientAuthenticationStrategy, OAuthMetadataExtensionInput, OAuthOptions, OAuthProviderExtension, OAuthUserInfoExtensionInput, Scope } from "./types";
import type { AuthServerMetadata, GrantType, OIDCMetadata, TokenEndpointAuthMethod } from "./types/oauth";
/**
 * Validates every extension and rejects two extensions registering the same
 * grant type, auth method, assertion type, or client discovery identifier:
 * otherwise the first would win and the second be silently unreachable. Runs at
 * setup over the whole list; extensions number in the single digits, so a full
 * re-scan per registration is cheaper than the bookkeeping to cache it.
 */
export declare function validateOAuthProviderExtensions(extensions: OAuthProviderExtension[] | undefined): void;
/**
 * Flattens the client-id discovery sources contributed by every registered
 * extension into a single ordered list. `getClient()` consults them in order;
 * the metadata endpoints merge their `discoveryMetadata`.
 */
export declare function getClientDiscoveries(opts: OAuthOptions<Scope[]>): ClientDiscovery[];
/**
 * Registers an {@link OAuthProviderExtension} with the OAuth Provider plugin
 * from a companion plugin's `init()` hook. An extension can add token grants,
 * assertion-based client authentication methods, additive discovery metadata,
 * access-token / ID-token / UserInfo claims, and client-id discovery, without
 * forking provider core.
 *
 * Call this once, at `init()` time. It is idempotent in the same `extension`
 * object, so re-running a plugin's `init()` (for example when one plugin factory
 * result is shared across two `betterAuth()` instances) does not register it
 * twice. It throws if the oauth-provider plugin is not installed, if a grant
 * type or assertion type is not an absolute URI, if a client authentication
 * method reuses a built-in name, or if the extension registers a grant type,
 * auth method, assertion type, or client discovery identifier that another
 * extension already registered (contributions must be disjoint).
 *
 * @example
 * ```ts
 * init(ctx) {
 *   extendOAuthProvider(ctx, {
 *     grants: { "urn:example:grant": async ({ provider }) => provider.issueTokens(...) },
 *   });
 * }
 * ```
 */
export declare function extendOAuthProvider(ctx: AuthContext, extension: OAuthProviderExtension): void;
export declare function getSupportedGrantTypes(opts: OAuthOptions<Scope[]>): GrantType[];
export declare function getExtensionGrantHandler(opts: OAuthOptions<Scope[]>, grantType: GrantType): import("./types").OAuthExtensionGrantHandler;
/**
 * Confidential and extension client-authentication methods the provider
 * supports. Pass `includeNone` to prepend `"none"` for the token endpoint and
 * DCR, where public clients are allowed; the introspection and revocation
 * endpoints, which never accept public clients, omit it (the default).
 */
export declare function getSupportedAuthMethods(opts: OAuthOptions<Scope[]>, settings?: {
    includeNone?: boolean;
}): TokenEndpointAuthMethod[];
export declare function isExtensionTokenEndpointAuthMethod(opts: OAuthOptions<Scope[]>, method: TokenEndpointAuthMethod | undefined): boolean;
export declare function getExtensionClientAuthenticationStrategy(opts: OAuthOptions<Scope[]>, assertionType: string): {
    method: TokenEndpointAuthMethod;
    strategy: OAuthClientAuthenticationStrategy;
} | undefined;
/**
 * Merges each registered extension's `metadata()` contribution into `document`,
 * first-wins: the provider owns every key it already wrote, so an extension can
 * add fields but never override core. A key two extensions contribute keeps the
 * first-registered value and logs a warning. Each contributor sees the base `document`,
 * not the running accumulation, so contributions stay order-independent.
 */
export declare function applyOAuthProviderMetadataExtensions<T extends AuthServerMetadata | OIDCMetadata>(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, type: OAuthMetadataExtensionInput["type"], document: T): T;
export declare function collectExtensionAccessTokenClaims(opts: OAuthOptions<Scope[]>, input: OAuthClaimExtensionInput): Promise<Record<string, unknown>>;
export declare function collectExtensionIdTokenClaims(opts: OAuthOptions<Scope[]>, input: OAuthClaimExtensionInput): Promise<Record<string, unknown>>;
export declare function collectExtensionUserInfoClaims(opts: OAuthOptions<Scope[]>, input: OAuthUserInfoExtensionInput): Promise<Record<string, unknown>>;
/**
 * Whether any registered extension contributes UserInfo claims. Lets the
 * UserInfo endpoint skip loading the client when nothing needs it.
 */
export declare function hasUserInfoClaimExtension(opts: OAuthOptions<Scope[]>): boolean;
