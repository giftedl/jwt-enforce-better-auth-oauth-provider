import type { GenericEndpointContext } from "@better-auth/core";
import type { OAuthConsent, OAuthOptions, Scope } from "../types";
export declare function getConsentEndpoint(ctx: GenericEndpointContext & {
    query: {
        id: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<OAuthConsent<Scope[]>>;
export declare function getConsentsEndpoint(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>): Promise<OAuthConsent<Scope[]>[]>;
export declare function deleteConsentEndpoint(ctx: GenericEndpointContext & {
    body: {
        id: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<void>;
export declare function updateConsentEndpoint(ctx: GenericEndpointContext & {
    body: {
        id: string;
    };
}, opts: OAuthOptions<Scope[]>): Promise<OAuthConsent<Scope[]>>;
