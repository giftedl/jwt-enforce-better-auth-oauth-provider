import type { GenericEndpointContext } from "@better-auth/core";
import type { OAuthOptions, Scope } from "./types";
export declare function revokeEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<any>;
