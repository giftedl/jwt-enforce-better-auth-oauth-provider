import type { JSONWebKeySet } from "jose";
import type { OAuthClient } from "./types/oauth";
/** A client's inline public JWK Set, as registration and key rotation accept it. */
export type ClientJwks = NonNullable<OAuthClient["jwks"]>;
export type PublicClientJwksValidationResult = {
    valid: true;
    jwks: JSONWebKeySet;
} | {
    valid: false;
    error: "jwks must be an RFC 7517 JWK Set object with a non-empty keys array" | "jwks must contain only public asymmetric keys" | "jwks keys must be supported public JWKs with required key parameters" | "jwks key alg must be supported for private_key_jwt and compatible with its key type and signing curve";
};
/**
 * Validates an OAuth client's public asymmetric JWK set.
 *
 * This boundary accepts only the RFC 7517 `{ keys: [...] }` representation.
 * It performs no I/O and returns the validated set for downstream JOSE
 * verification.
 *
 * @internal
 */
export declare function validatePublicClientJwks(input: unknown): PublicClientJwksValidationResult;
/**
 * Throws `invalid_client_metadata` unless `jwks` is a public JWK Set that
 * {@link validatePublicClientJwks} accepts.
 */
export declare function assertValidClientJwks(jwks: ClientJwks): void;
