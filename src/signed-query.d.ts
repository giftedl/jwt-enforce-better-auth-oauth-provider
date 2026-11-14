export declare const signedQueryIssuedAtParam = "ba_iat";
export declare const postLoginClearedParam = "ba_pl";
export declare function canonicalizeOAuthQueryParams(params: URLSearchParams): URLSearchParams;
export declare function setSignedOAuthQueryParameterNames(params: URLSearchParams): void;
export declare function buildSignedOAuthQuery(search: string): string;
export declare function getSignedQueryIssuedAt(oauthQuery: string): Date | null;
