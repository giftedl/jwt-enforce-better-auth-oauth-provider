import type { GenericEndpointContext } from "@better-auth/core";
import type { OAuthErrorCode, OAuthRedirectOnError } from "./oauth-endpoint";
import type { OAuthOptions, Scope } from "./types";
export type OAuthRedirectResult = {
    redirect: true;
    url: string;
};
/**
 * Formats an error url. Per OIDC Core 1.0 §5 / RFC 6749 §4.2.2.1, errors on
 * implicit and hybrid flows are delivered in the URL fragment, not the query.
 * Callers on the code flow (default) omit `mode` and get query delivery.
 */
export declare function formatErrorURL(url: string, error: OAuthErrorCode, description: string, state?: string, iss?: string, mode?: "query" | "fragment"): string;
export declare const handleRedirect: (ctx: GenericEndpointContext, uri: string) => OAuthRedirectResult;
/**
 * Normalizes the issuer URL by removing query and fragment components, which
 * RFC 8414 §2 forbids. The scheme is kept as configured: the issuer must match
 * the `iss` claim of issued tokens exactly (RFC 9207 §2.4).
 *
 * @returns The issuer URL without query, fragment, or trailing slash
 */
export declare function validateIssuerUrl(issuer: string): string;
/**
 * Gets the issuer identifier
 */
export declare function getIssuer(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): string;
/**
 * Error page url if redirect_uri has not been verified yet
 * Generates Url for custom error page
 */
export declare function getErrorURL(ctx: GenericEndpointContext, error: OAuthErrorCode, description: string): string;
/**
 * Loads the client, verifies it's enabled, and returns the requested
 * redirect_uri when it matches a registered entry (or is accepted by the
 * custom `validateRedirectUri` option, mirroring the authorize endpoint's
 * validation). Returns null whenever the RP cannot be safely reached, so
 * callers can fall back to the server error page (avoiding open-redirect
 * risk on validation failures).
 */
export declare function resolveTrustedRedirectUri(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, clientId: string | undefined, redirectUri: string | undefined): Promise<string | null>;
/**
 * `redirectOnError` callback for `/oauth2/authorize`. Per RFC 6749 §4.1.2.1,
 * authorize errors MUST be delivered to the client's `redirect_uri` with
 * `error`, `error_description`, `state`, and (RFC 9207) `iss`. The clause
 * carves out one case: a missing/invalid `redirect_uri` or `client_id` MUST
 * NOT redirect to the requested URI. We implement the carve-out via
 * `resolveTrustedRedirectUri`, falling back to the server error page.
 *
 * Channel (query vs fragment) follows OIDC Core §5 via `deriveResponseMode`.
 */
export declare function authorizeRedirectOnError(opts: OAuthOptions<Scope[]>): OAuthRedirectOnError<GenericEndpointContext, OAuthRedirectResult>;
export type AuthorizeEndpointSettings = {
    isAuthorize?: boolean;
    postLogin?: boolean;
    isPostLoginContinuation?: boolean;
};
export declare function authorizeEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, settings?: AuthorizeEndpointSettings): Promise<OAuthRedirectResult>;
