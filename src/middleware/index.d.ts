import type { OAuthOptions, Scope } from "../types";
export declare const publicSessionMiddleware: (opts: OAuthOptions<Scope[]>) => import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>>;
