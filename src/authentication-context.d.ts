/**
 * OIDC Core Authentication Context Class Reference for authentication that
 * does not meet ISO/IEC 29115 level 1.
 *
 * Better Auth does not currently evaluate a stronger ACR policy, so discovery
 * and ID tokens must not claim an assurance profile such as InCommon bronze.
 */
export declare const LEVEL_0_ACR = "0";
/**
 * Removes provider-owned ID token claim names from custom claims.
 *
 * `customIdTokenClaims` is an extension point for additional claims. It must not
 * replace the issuer, subject, audience, lifetime, nonce, authorized party,
 * token-binding hashes, session binding, or authentication context that the
 * provider owns.
 */
export declare function stripReservedIdTokenClaims(claims: Record<string, unknown> | null | undefined): Record<string, unknown>;
