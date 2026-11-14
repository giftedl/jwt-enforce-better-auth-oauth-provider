import type { OAuthOptions, Scope } from "./types";
/**
 * The OIDC Standard Claims (OIDC Core §5.1) that Better Auth resolves from its
 * own user model, each paired with the scope that requests it (§5.4).
 *
 * This is the single source for UserInfo scope-claim resolution, individual
 * `claims.userinfo` resolution, the discovery `claims_supported` advertisement,
 * and the bound on requested claim names. Adding a standard claim Better Auth
 * can resolve means adding one entry here, not editing UserInfo, the metadata,
 * and the plugin init separately.
 *
 * These claims are delivered only at the UserInfo endpoint, never the ID token:
 * the authorization code flow always issues an access token, so §5.4 routes
 * scope-requested claims to UserInfo. Deployments that support further standard
 * profile claims (such as `birthdate` or `zoneinfo`) supply them through
 * `customUserInfoClaims` and advertise them in `claims_supported`.
 */
export declare const STANDARD_CLAIMS: {
    name: {
        scope: "profile";
        resolve: (user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            emailVerified: boolean;
            name: string;
            email?: string;
            image?: string;
        }) => string;
    };
    picture: {
        scope: "profile";
        resolve: (user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            emailVerified: boolean;
            name: string;
            email?: string;
            image?: string;
        }) => string;
    };
    given_name: {
        scope: "profile";
        resolve: (user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            emailVerified: boolean;
            name: string;
            email?: string;
            image?: string;
        }) => string;
    };
    family_name: {
        scope: "profile";
        resolve: (user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            emailVerified: boolean;
            name: string;
            email?: string;
            image?: string;
        }) => string;
    };
    email: {
        scope: "email";
        resolve: (user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            emailVerified: boolean;
            name: string;
            email?: string;
            image?: string;
        }) => string;
    };
    email_verified: {
        scope: "email";
        resolve: (user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            emailVerified: boolean;
            name: string;
            email?: string;
            image?: string;
        }) => boolean;
    };
};
export type StandardClaimName = keyof typeof STANDARD_CLAIMS;
export declare const STANDARD_CLAIM_NAMES: StandardClaimName[];
/**
 * The claim names this provider advertises it can supply (discovery
 * `claims_supported`): the operator's `advertisedMetadata.claims_supported`
 * override when set, otherwise the scope-derived standard set computed at plugin
 * init. Used both to advertise and to bound requested `claims.userinfo` names so
 * a client cannot pin arbitrary attacker-controlled strings onto stored tokens.
 */
export declare function getSupportedClaims(opts: OAuthOptions<Scope[]> & {
    claims?: string[];
}): string[];
