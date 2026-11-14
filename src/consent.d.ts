import type { GenericEndpointContext } from "@better-auth/core";
import type { AuthorizeEndpointCaller } from "./continue";
import type { OAuthOptions, Scope } from "./types";
export declare function consentEndpoint<Result>(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, authorize: AuthorizeEndpointCaller<Result>): Promise<Result | {
    redirect: boolean;
    url: string;
}>;
