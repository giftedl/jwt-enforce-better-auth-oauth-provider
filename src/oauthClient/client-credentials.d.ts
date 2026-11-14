import type { OAuthOptions, Scope } from "../types";
import type { GrantType, TokenEndpointAuthMethod } from "../types/oauth";
export declare function isUserDelegatedScope(scope: string): boolean;
export declare function normalizeClientCredentialsScopes(scopes: readonly string[]): Scope[];
export declare function validateClientCredentialsScopes(scopes: readonly Scope[], grantTypes: readonly GrantType[], tokenEndpointAuthMethod: TokenEndpointAuthMethod | undefined, opts: OAuthOptions<Scope[]>): void;
