import type { GenericEndpointContext } from "@better-auth/core";
export declare function getDpopProofJwt(ctx: Pick<GenericEndpointContext, "headers">): string | undefined;
/**
 * The endpoint's public URL, which clients use as the DPoP `htu`: the origin
 * and base path of `baseURL` (not `request.url`, whose host proxies and dev
 * servers can rewrite) plus the request's own path below the base path, so
 * route params and a trailing slash match what the client called. `path` is
 * used when there is no HTTP request, such as an `auth.api` call.
 */
export declare function getEndpointUrl(ctx: Pick<GenericEndpointContext, "context" | "request">, path: string): string;
/**
 * Adds `headers` to a comma-separated `Access-Control-Expose-Headers` value,
 * keeping the names already listed.
 */
export declare function withExposedHeaders(exposed: string | null | undefined, ...headers: string[]): string;
