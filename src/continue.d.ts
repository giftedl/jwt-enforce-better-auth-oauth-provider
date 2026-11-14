import type { GenericEndpointContext } from "@better-auth/core";
import type { AuthorizeEndpointSettings } from "./authorize";
/**
 * Re-enters `/oauth2/authorize` through the hook pipeline. Injected so the
 * resume paths dispatch the endpoint (running configured hooks) instead of
 * calling the raw `authorizeEndpoint` function, which would skip them.
 */
export type AuthorizeEndpointCaller<Result = unknown> = (ctx: GenericEndpointContext, settings?: AuthorizeEndpointSettings) => Promise<Result>;
export declare function continueEndpoint<Result>(ctx: GenericEndpointContext, authorize: AuthorizeEndpointCaller<Result>): Promise<Result>;
