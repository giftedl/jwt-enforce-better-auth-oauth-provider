/**
 * Deliberate first-party integration surface.
 *
 * This subpath is for Better Auth packages that extend the OAuth provider's
 * verified registration lifecycle. Application integrations should use the
 * public endpoints and plugin APIs instead.
 */
import { n as PublicClientJwksValidationResult, r as validatePublicClientJwks } from "./client-jwks-C-rOCI8N.mjs";
import { H as Scope, V as SchemaClient, j as OAuthOptions, o as OAuthClient } from "./oauth-DPgImiDT.mjs";
import { GenericEndpointContext } from "@better-auth/core";
export declare function isForbiddenCimdClientMetadataField(field: string): boolean;
interface OAuthClientRegistrationResult {
  client: SchemaClient<Scope[]>;
  clientSecret?: string;
  resources: string[];
  created: boolean;
}
interface RegisterClientMetadataDocumentInput {
  metadata: OAuthClient;
  clientId: string;
  clientDiscoveryId: string;
  existingClient?: SchemaClient<Scope[]>;
}
/**
 * First-party persistence seam for a validated Client ID Metadata Document.
 *
 * This operation owns both initial creation and atomic replacement. It never
 * generates a client secret, preserves operator-controlled flags on
 * replacement, and ensures server-default resource links in the same
 * transaction.
 *
 * @internal
 */
export declare function registerClientMetadataDocument(ctx: GenericEndpointContext, opts: OAuthOptions<Scope[]>, input: RegisterClientMetadataDocumentInput): Promise<OAuthClientRegistrationResult>;
export { type OAuthClientRegistrationResult, type PublicClientJwksValidationResult, type RegisterClientMetadataDocumentInput, validatePublicClientJwks };