import { r as canonicalizeOAuthQueryParams } from "./version-Cc5AzH4t.mjs";
import { isLoopbackHost } from "@better-auth/core/utils/host";
import { isAPIError } from "better-auth/api";
import { constantTimeEqual, makeSignature, symmetricDecrypt, symmetricEncrypt } from "better-auth/crypto";
import { APIError as APIError$1 } from "better-call";
import { logger } from "@better-auth/core/env";
import { BetterAuthError } from "@better-auth/core/error";
import { CLIENT_ASSERTION_TYPE, decodeBasicCredentials } from "@better-auth/core/oauth2";
import { base64Url } from "@better-auth/utils/base64";
import { createHash } from "@better-auth/utils/hash";
import { errors } from "jose";
import { DPOP_SIGNING_ALGORITHMS as DPOP_SIGNING_ALGORITHMS$1, isInsufficientScopeError, parseAccessTokenAuthorization } from "better-auth/oauth2";
// src/extensions.ts
const DEFAULT_GRANT_TYPES = [
	"authorization_code",
	"client_credentials",
	"refresh_token"
];
const BUILT_IN_CONFIDENTIAL_AUTH_METHODS = [
	"client_secret_basic",
	"client_secret_post",
	"private_key_jwt"
];
const RESERVED_TOKEN_ENDPOINT_AUTH_METHODS = ["none", ...BUILT_IN_CONFIDENTIAL_AUTH_METHODS];
const RESERVED_TOKEN_ENDPOINT_AUTH_METHOD_SET = new Set(RESERVED_TOKEN_ENDPOINT_AUTH_METHODS);
function assertNonEmptyExtensionValue(name, value) {
	if (value.trim().length > 0) return;
	throw new BetterAuthError(`OAuth Provider extension ${name} cannot be empty`);
}
function assertAbsoluteUri(name, value) {
	assertNonEmptyExtensionValue(name, value);
	let url;
	try {
		url = new URL(value);
	} catch {
		url = void 0;
	}
	if (url?.protocol) return;
	throw new BetterAuthError(`OAuth Provider extension ${name} must be an absolute URI: ${value}`);
}
function assertExtensionGrantType(grantType) {
	assertAbsoluteUri("grant type", grantType);
}
function assertExtensionTokenEndpointAuthMethod(method) {
	assertNonEmptyExtensionValue("token_endpoint_auth_method", method);
	if (!RESERVED_TOKEN_ENDPOINT_AUTH_METHOD_SET.has(method)) return;
	throw new BetterAuthError(`OAuth Provider extension token_endpoint_auth_method is reserved: ${method}`);
}
function assertExtensionClientAssertionType(assertionType) {
	assertAbsoluteUri("client_assertion_type", assertionType);
	if (assertionType !== CLIENT_ASSERTION_TYPE) return;
	throw new BetterAuthError(`OAuth Provider extension client_assertion_type is reserved: ${assertionType}`);
}
/**
* Validates one extension's dispatched keys (grant types, auth methods,
* assertion types) and returns them for the cross-extension disjointness check.
* Throws on a non-absolute grant/assertion URI, a reserved auth-method name, or
* an empty assertion-type list.
*/
function collectExtensionKeys(extension) {
	const grantTypes = Object.keys(extension.grants ?? {});
	for (const grantType of grantTypes) assertExtensionGrantType(grantType);
	const authMethods = [];
	const assertionTypes = [];
	for (const [method, strategy] of Object.entries(extension.clientAuthentication ?? {})) {
		assertExtensionTokenEndpointAuthMethod(method);
		authMethods.push(method);
		const methodAssertionTypes = strategy.assertionTypes ?? [method];
		if (methodAssertionTypes.length === 0) throw new BetterAuthError(`OAuth Provider extension client_assertion_type list cannot be empty for ${method}`);
		for (const assertionType of methodAssertionTypes) {
			assertExtensionClientAssertionType(assertionType);
			assertionTypes.push(assertionType);
		}
	}
	const clientDiscoveryIds = (extension.clientDiscovery ? Array.isArray(extension.clientDiscovery) ? extension.clientDiscovery : [extension.clientDiscovery] : []).map((discovery) => discovery.id);
	for (const clientDiscoveryId of clientDiscoveryIds) assertNonEmptyExtensionValue("client discovery id", clientDiscoveryId);
	return {
		grantTypes,
		authMethods,
		assertionTypes,
		clientDiscoveryIds
	};
}
function assertNoDuplicateAcrossExtensions(label, values) {
	const seen = /* @__PURE__ */ new Set();
	for (const value of values) {
		if (seen.has(value)) throw new BetterAuthError(`OAuth Provider extensions register ${label} "${value}" more than once. Extension contributions must be disjoint.`);
		seen.add(value);
	}
}
/**
* Validates every extension and rejects two extensions registering the same
* grant type, auth method, assertion type, or client discovery identifier:
* otherwise the first would win and the second be silently unreachable. Runs at
* setup over the whole list; extensions number in the single digits, so a full
* re-scan per registration is cheaper than the bookkeeping to cache it.
*/
function validateOAuthProviderExtensions(extensions) {
	const keys = (extensions ?? []).map(collectExtensionKeys);
	assertNoDuplicateAcrossExtensions("grant type", keys.flatMap((k) => k.grantTypes));
	assertNoDuplicateAcrossExtensions("token_endpoint_auth_method", keys.flatMap((k) => k.authMethods));
	assertNoDuplicateAcrossExtensions("client_assertion_type", keys.flatMap((k) => k.assertionTypes));
	assertNoDuplicateAcrossExtensions("client discovery id", keys.flatMap((k) => k.clientDiscoveryIds));
}
function getOAuthProviderExtensions(opts) {
	return opts.extensions ?? [];
}
/**
* Flattens the client-id discovery sources contributed by every registered
* extension into a single ordered list. `getClient()` consults them in order;
* the metadata endpoints merge their `discoveryMetadata`.
*/
function getClientDiscoveries(opts) {
	return getOAuthProviderExtensions(opts).flatMap((extension) => {
		const discovery = extension.clientDiscovery;
		if (!discovery) return [];
		return Array.isArray(discovery) ? discovery : [discovery];
	});
}
/**
* Registers an {@link OAuthProviderExtension} with the OAuth Provider plugin
* from a companion plugin's `init()` hook. An extension can add token grants,
* assertion-based client authentication methods, additive discovery metadata,
* access-token / ID-token / UserInfo claims, and client-id discovery, without
* forking provider core.
*
* Call this once, at `init()` time. It is idempotent in the same `extension`
* object, so re-running a plugin's `init()` (for example when one plugin factory
* result is shared across two `betterAuth()` instances) does not register it
* twice. It throws if the oauth-provider plugin is not installed, if a grant
* type or assertion type is not an absolute URI, if a client authentication
* method reuses a built-in name, or if the extension registers a grant type,
* auth method, assertion type, or client discovery identifier that another
* extension already registered (contributions must be disjoint).
*
* @example
* ```ts
* init(ctx) {
*   extendOAuthProvider(ctx, {
*     grants: { "urn:example:grant": async ({ provider }) => provider.issueTokens(...) },
*   });
* }
* ```
*/
function extendOAuthProvider(ctx, extension) {
	const provider = ctx.getPlugin("oauth-provider");
	if (!provider) throw new BetterAuthError("extendOAuthProvider requires the oauth-provider plugin.");
	const existing = provider.options.extensions ?? [];
	if (existing.includes(extension)) return;
	const extensions = [...existing, extension];
	validateOAuthProviderExtensions(extensions);
	provider.options.extensions = extensions;
}
function getExtensionGrantTypes(opts) {
	return getOAuthProviderExtensions(opts).flatMap((extension) => Object.keys(extension.grants ?? {}));
}
function getSupportedGrantTypes(opts) {
	return Array.from(/* @__PURE__ */ new Set([...opts.grantTypes ?? DEFAULT_GRANT_TYPES, ...getExtensionGrantTypes(opts)]));
}
function getExtensionGrantHandler(opts, grantType) {
	for (const extension of getOAuthProviderExtensions(opts)) {
		const handler = extension.grants?.[grantType];
		if (handler) return handler;
	}
}
function getExtensionTokenEndpointAuthMethods(opts) {
	return getOAuthProviderExtensions(opts).flatMap((extension) => Object.keys(extension.clientAuthentication ?? {}));
}
/**
* Confidential and extension client-authentication methods the provider
* supports. Pass `includeNone` to prepend `"none"` for the token endpoint and
* DCR, where public clients are allowed; the introspection and revocation
* endpoints, which never accept public clients, omit it (the default).
*/
function getSupportedAuthMethods(opts, settings) {
	return Array.from(/* @__PURE__ */ new Set([
		...settings?.includeNone ? ["none"] : [],
		...BUILT_IN_CONFIDENTIAL_AUTH_METHODS,
		...getExtensionTokenEndpointAuthMethods(opts)
	]));
}
function isExtensionTokenEndpointAuthMethod(opts, method) {
	return method ? getExtensionTokenEndpointAuthMethods(opts).includes(method) : false;
}
function getExtensionClientAuthenticationStrategy(opts, assertionType) {
	if (assertionType === CLIENT_ASSERTION_TYPE) return void 0;
	for (const extension of getOAuthProviderExtensions(opts)) {
		const strategies = extension.clientAuthentication ?? {};
		for (const [method, strategy] of Object.entries(strategies)) if ((strategy.assertionTypes ?? [method]).includes(assertionType)) return {
			method,
			strategy
		};
	}
}
/**
* Merges each registered extension's `metadata()` contribution into `document`,
* first-wins: the provider owns every key it already wrote, so an extension can
* add fields but never override core. A key two extensions contribute keeps the
* first-registered value and logs a warning. Each contributor sees the base `document`,
* not the running accumulation, so contributions stay order-independent.
*/
function applyOAuthProviderMetadataExtensions(ctx, opts, type, document) {
	const next = { ...document };
	for (const extension of getOAuthProviderExtensions(opts)) {
		const contribution = extension.metadata?.({
			ctx,
			opts,
			type,
			document
		});
		for (const [key, value] of Object.entries(contribution ?? {})) if (!(key in next)) next[key] = value;
		else if (!(key in document)) ctx.context.logger.warn(`oauth-provider: two extensions contributed the discovery metadata key "${key}" to ${type}; keeping the first-registered value.`);
	}
	return next;
}
async function collectClaims(opts, run) {
	const claims = {};
	for (const extension of getOAuthProviderExtensions(opts)) {
		const contribution = await run(extension) ?? {};
		for (const [key, value] of Object.entries(contribution)) {
			if (key in claims) {
				logger.warn(`oauth-provider: two extensions contributed the claim "${key}"; keeping the first-registered value.`);
				continue;
			}
			claims[key] = value;
		}
	}
	return claims;
}
function collectExtensionAccessTokenClaims(opts, input) {
	return collectClaims(opts, (extension) => extension.claims?.accessToken?.(input));
}
function collectExtensionIdTokenClaims(opts, input) {
	return collectClaims(opts, (extension) => extension.claims?.idToken?.(input));
}
function collectExtensionUserInfoClaims(opts, input) {
	return collectClaims(opts, (extension) => extension.claims?.userInfo?.(input));
}
/**
* Whether any registered extension contributes UserInfo claims. Lets the
* UserInfo endpoint skip loading the client when nothing needs it.
*/
function hasUserInfoClaimExtension(opts) {
	return getOAuthProviderExtensions(opts).some((extension) => extension.claims?.userInfo);
}
// src/utils/index.ts
/**
* Extracts the credentials from an `Authorization: Bearer <token>` header.
*
* Returns `undefined` when the header is absent or carries a non-Bearer scheme,
* leaving the caller to decide whether that is an error. Throws an
* `invalid_request` `APIError` when the Bearer scheme is present but the
* credentials are missing or the header carries extra parts. The scheme match
* is case-insensitive and the credentials are the single token after it.
*
* @see https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
* @see https://datatracker.ietf.org/doc/html/rfc7235#section-2.1
*/
function parseBearerToken(authorization) {
	if (!authorization) return void 0;
	const [scheme, credentials, ...extraParts] = authorization.trim().split(/\s+/);
	if (scheme?.toLowerCase() !== "bearer") return void 0;
	if (!credentials || extraParts.length > 0) throw new APIError$1("BAD_REQUEST", {
		error: "invalid_request",
		error_description: "Malformed Bearer Authorization header"
	});
	return credentials;
}
function createTTLCache() {
	const cache = /* @__PURE__ */ new Map();
	return {
		get(key) {
			const entry = cache.get(key);
			if (!entry) return void 0;
			if (entry.expiresAt && entry.expiresAt < /* @__PURE__ */ new Date()) {
				cache.delete(key);
				return;
			}
			return entry;
		},
		set(key, value) {
			cache.set(key, value);
		}
	};
}
/**
* Gets the oAuth Provider Plugin
* @internal
*/
const getOAuthProviderPlugin = (ctx) => {
	return ctx.getPlugin("oauth-provider");
};
/**
* Gets the JWT Plugin
* @internal
*/
const getJwtPlugin = (ctx) => {
	const plugin = ctx.getPlugin("jwt");
	if (!plugin) throw new BetterAuthError("jwt_config");
	return plugin;
};
const joseInfrastructureErrorCodes = /* @__PURE__ */ new Set([
	errors.JWKSTimeout.code,
	errors.JWKSInvalid.code,
	errors.JWKSMultipleMatchingKeys.code
]);
/**
* Whether a JWT verification error comes from the token itself (malformed,
* bad signature, unsupported alg, unknown kid, failed claim checks), as
* opposed to a key set failure that should still surface as a server error.
*
* @internal
*/
function isInvalidJwtError(error) {
	return error instanceof errors.JOSEError && !joseInfrastructureErrorCodes.has(error.code);
}
/**
* Normalizes timestamp-like values returned by adapters.
*
* Accepts Date instances, epoch milliseconds as numbers, and strings that are
* either ISO dates or numeric millisecond values such as "1774295570569.0".
*/
function normalizeTimestampValue(value) {
	if (value == null) return;
	if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : void 0;
	if (typeof value === "number") {
		if (!Number.isFinite(value)) return;
		const parsed = new Date(value);
		return Number.isFinite(parsed.getTime()) ? parsed : void 0;
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed.length) return;
		const numeric = Number(trimmed);
		if (Number.isFinite(numeric)) {
			const parsed = new Date(numeric);
			return Number.isFinite(parsed.getTime()) ? parsed : void 0;
		}
		const parsed = new Date(trimmed);
		return Number.isFinite(parsed.getTime()) ? parsed : void 0;
	}
}
/**
* Resolves a session auth time from common adapter return shapes.
*/
function resolveSessionAuthTime(value) {
	if (value instanceof Date) return normalizeTimestampValue(value);
	if (!value || typeof value !== "object") return normalizeTimestampValue(value);
	const direct = normalizeTimestampValue(value.createdAt) ?? normalizeTimestampValue(value.created_at);
	if (direct) return direct;
	const nested = value.session;
	if (!nested || typeof nested !== "object") return;
	return normalizeTimestampValue(nested.createdAt) ?? normalizeTimestampValue(nested.created_at);
}
/**
* Normalizes OAuth resource values into a non-empty string array.
*/
function toResourceList(value) {
	if (typeof value === "string") return [value];
	if (!value?.length) return void 0;
	return value;
}
/**
* Normalizes audience values for JWT claims.
*/
function toAudienceClaim(audience) {
	if (typeof audience === "string") return audience;
	if (!audience?.length) return void 0;
	return audience.length === 1 ? audience.at(0) : audience;
}
const trustedClientCaches = /* @__PURE__ */ new WeakMap();
function getTrustedClientCache(options) {
	const existingCache = trustedClientCaches.get(options);
	if (existingCache) return existingCache;
	const cache = createTTLCache();
	trustedClientCaches.set(options, cache);
	return cache;
}
/**
* Verify the signature and expiration of an OAuth query issued by this provider.
* Use the provider's current auth secret on the server before displaying a
* consent page. A valid signature does not replace client or session checks.
*/
async function verifyOAuthQueryParams(oauth_query, secret) {
	const queryParams = new URLSearchParams(oauth_query);
	const sig = queryParams.get("sig");
	const sigs = queryParams.getAll("sig");
	const exp = Number(queryParams.get("exp"));
	queryParams.delete("sig");
	const verifySig = await makeSignature(canonicalizeOAuthQueryParams(queryParams).toString(), secret);
	return sigs.length === 1 && !!sig && constantTimeEqual(sig, verifySig) && /* @__PURE__ */ new Date(exp * 1e3) >= /* @__PURE__ */ new Date();
}
/**
* Rejects changes to a client listed in `cachedTrustedClients`. Cached trusted
* clients are immutable through the client management endpoints.
*/
function assertNotTrustedClient(opts, clientId) {
	if (opts.cachedTrustedClients?.has(clientId)) throw new APIError$1("BAD_REQUEST", {
		error: "invalid_client",
		error_description: "trusted clients must be updated manually"
	});
}
/**
* Get a client by ID, checking trusted clients first, then database
*/
async function getClient(ctx, options, clientId) {
	const trustedClientCache = getTrustedClientCache(options);
	const trustedClient = trustedClientCache.get(clientId);
	if (trustedClient && !trustedClient.clientDiscoveryId) return Object.assign({}, trustedClient);
	let dbClient = await ctx.context.adapter.findOne({
		model: options.schema?.oauthClient?.modelName ?? "oauthClient",
		where: [{
			field: "clientId",
			value: clientId
		}]
	});
	const discoveries = getClientDiscoveries(options);
	if (dbClient?.clientDiscoveryId) {
		const clientDiscoveryId = dbClient.clientDiscoveryId;
		const discovery = discoveries.find((candidate) => candidate.id === clientDiscoveryId);
		if (!discovery?.matches(clientId)) return null;
		dbClient = await discovery.resolve(ctx, clientId, dbClient);
		if (!dbClient) return null;
	} else if (dbClient) {
		if (options.cachedTrustedClients?.has(clientId)) trustedClientCache.set(clientId, Object.assign({}, dbClient));
		return dbClient;
	} else for (const discovery of discoveries) {
		if (!discovery.matches(clientId)) continue;
		const resolved = await discovery.resolve(ctx, clientId, null);
		if (resolved) {
			dbClient = resolved;
			break;
		}
	}
	return dbClient;
}
/**
* Merge `discoveryMetadata` from every contributed {@link ClientDiscovery}
* into a single object. Entries are spread in order; later entries override
* earlier ones on key collisions.
*
* @internal
*/
function mergeDiscoveryMetadata(discoveries) {
	return discoveries.reduce((acc, d) => ({
		...acc,
		...d.discoveryMetadata ?? {}
	}), {});
}
/**
* Default client secret hasher using SHA-256
*
* @internal
*/
const defaultHasher = async (value) => {
	const hash = await createHash("SHA-256").digest(new TextEncoder().encode(value));
	return base64Url.encode(new Uint8Array(hash), { padding: false });
};
/**
* Decrypts a storedClientSecret for signing
*
* @internal
*/
async function decryptStoredClientSecret(ctx, storageMethod, storedClientSecret) {
	if (storageMethod === "encrypted") return await symmetricDecrypt({
		key: ctx.context.secretConfig,
		data: storedClientSecret
	});
	else if (typeof storageMethod === "object" && "decrypt" in storageMethod) return await storageMethod.decrypt(storedClientSecret);
	throw new BetterAuthError(`Unsupported decryption storageMethod type '${storageMethod}'`);
}
/**
* Verify stored client secret against provided client secret
*
* @internal
*/
async function verifyStoredClientSecret(ctx, opts, storedClientSecret, clientSecret) {
	const storageMethod = opts.storeClientSecret ?? (opts.disableJwtPlugin ? "encrypted" : "hashed");
	if (clientSecret && opts.prefix?.clientSecret) {
		if (!clientSecret.startsWith(opts.prefix.clientSecret)) return false;
		clientSecret = clientSecret.replace(opts.prefix.clientSecret, "");
	}
	if (storageMethod === "hashed") {
		const hashedClientSecret = clientSecret ? await defaultHasher(clientSecret) : void 0;
		return !!hashedClientSecret && constantTimeEqual(hashedClientSecret, storedClientSecret);
	} else if (typeof storageMethod === "object" && "hash" in storageMethod) {
		if (storageMethod.verify) return !!clientSecret && await storageMethod.verify(clientSecret, storedClientSecret);
		else {
			const hashedClientSecret = clientSecret ? await storageMethod.hash(clientSecret) : void 0;
			return !!hashedClientSecret && constantTimeEqual(hashedClientSecret, storedClientSecret);
		}
	} else if (storageMethod === "encrypted") try {
		const decryptedClientSecret = await decryptStoredClientSecret(ctx, storageMethod, storedClientSecret);
		return !!clientSecret && constantTimeEqual(decryptedClientSecret, clientSecret);
	} catch {
		return false;
	}
	else if (typeof storageMethod === "object" && "decrypt" in storageMethod) {
		const decryptedClientSecret = await decryptStoredClientSecret(ctx, storageMethod, storedClientSecret);
		return !!clientSecret && constantTimeEqual(decryptedClientSecret, clientSecret);
	}
	throw new BetterAuthError(`Unsupported verify storageMethod type '${storageMethod}'`);
}
/**
* Store client secret according to the configured storage method
*
* @internal
*/
async function storeClientSecret(ctx, opts, clientSecret) {
	const storageMethod = opts.storeClientSecret ?? (opts.disableJwtPlugin ? "encrypted" : "hashed");
	if (storageMethod === "encrypted") return await symmetricEncrypt({
		key: ctx.context.secretConfig,
		data: clientSecret
	});
	else if (storageMethod === "hashed") return await defaultHasher(clientSecret);
	else if (typeof storageMethod === "object" && "hash" in storageMethod) return await storageMethod.hash(clientSecret);
	else if (typeof storageMethod === "object" && "encrypt" in storageMethod) return await storageMethod.encrypt(clientSecret);
	throw new BetterAuthError(`Unsupported storeClientSecret type '${storageMethod}'`);
}
/**
* Stores a token value (ie opaque tokens, refresh tokens, transaction tokens, verification codes)
* on the database in a secure hashed format.
*
* @internal
*/
async function storeToken(storageMethod = "hashed", token, type) {
	if (storageMethod === "hashed") return await defaultHasher(token);
	else if (typeof storageMethod === "object" && "hash" in storageMethod) return await storageMethod.hash(token, type);
	throw new BetterAuthError(`storeToken: unsupported storageMethod type '${storageMethod}'`);
}
/**
* Gets a hashed token value to find on the database.
*
* @internal
*/
async function getStoredToken(storageMethod = "hashed", token, type) {
	if (storageMethod === "hashed") return await defaultHasher(token);
	else if (typeof storageMethod === "object" && "hash" in storageMethod) return await storageMethod.hash(token, type);
	throw new BetterAuthError(`getStoredToken: unsupported storageMethod type '${storageMethod}'`);
}
/**
* Converts a BASIC authorization header
* into its client_id and client_secret representation
*
* @internal
*/
const BASIC_SCHEME_PREFIX = /^Basic +/i;
const AUTH_SCHEME_TOKEN = /^([!#$%&'*+\-.^_`|~0-9A-Za-z]+)(?=\s|$)/;
function parseAuthorizationScheme(authorization) {
	return authorization.match(AUTH_SCHEME_TOKEN)?.[1];
}
const CLIENT_AUTHENTICATION_FIELDS = [
	"client_secret",
	"client_assertion",
	"client_assertion_type"
];
function throwInvalidAuthenticationRequest(errorDescription) {
	throw new APIError$1("BAD_REQUEST", {
		error: "invalid_request",
		error_description: errorDescription
	});
}
/**
* Normalizes client identification and authentication parameters while
* enforcing RFC 6749 §2.3 and RFC 8628 §3.1 cardinality. Empty values are
* omitted. Client identification remains separate from authentication-method
* detection so a public `client_id` does not count as an authentication attempt.
* Repeated `resource` parameters are intentionally outside this parser because
* RFC 8707 §2 explicitly permits them.
*
* Credential and assertion verification remain the responsibility of
* `extractClientCredentials`.
*
* @internal
*/
async function normalizeClientAuthenticationParameters(request, body = {}) {
	let clientId;
	if (body.client_id !== void 0 && body.client_id !== "") {
		if (typeof body.client_id !== "string") throwInvalidAuthenticationRequest("client_id must be a string");
		clientId = body.client_id;
	}
	const fields = {};
	const setEffectiveField = (field, value) => {
		if (value === void 0 || value === "") return;
		if (typeof value !== "string") throwInvalidAuthenticationRequest(`${field} must be a string`);
		fields[field] = value;
	};
	for (const field of CLIENT_AUTHENTICATION_FIELDS) if (Object.hasOwn(body, field)) setEffectiveField(field, body[field]);
	const authorization = request?.headers.get("authorization");
	const hasAuthorizationHeader = Boolean(authorization);
	if (request) {
		if ((request.headers.get("content-type")?.toLowerCase() ?? "").includes("application/x-www-form-urlencoded")) {
			const params = new URLSearchParams(await request.clone().text());
			const clientIds = params.getAll("client_id").filter((value) => value.length > 0);
			if (clientIds.length > 1) throwInvalidAuthenticationRequest("client_id must not be repeated");
			clientId = clientIds[0];
			for (const field of CLIENT_AUTHENTICATION_FIELDS) {
				const values = params.getAll(field).filter((value) => value.length > 0);
				if (values.length > 1) throwInvalidAuthenticationRequest(`${field} must not be repeated`);
				if (values.length === 1) setEffectiveField(field, values[0]);
			}
		}
	}
	const hasClientSecret = fields.client_secret !== void 0;
	const hasClientAssertion = fields.client_assertion !== void 0 || fields.client_assertion_type !== void 0;
	if (hasAuthorizationHeader && (hasClientSecret || hasClientAssertion) || hasClientSecret && hasClientAssertion) throwInvalidAuthenticationRequest("A request must use only one client authentication method");
	body.client_id = clientId;
	for (const field of CLIENT_AUTHENTICATION_FIELDS) body[field] = fields[field];
	return { detected: hasAuthorizationHeader || Object.keys(fields).length > 0 };
}
function basicToClientCredentials(authorization) {
	if (!BASIC_SCHEME_PREFIX.test(authorization)) return;
	try {
		const { clientId, clientSecret } = decodeBasicCredentials(authorization);
		return {
			client_id: clientId,
			client_secret: clientSecret
		};
	} catch {
		throw new APIError$1("UNAUTHORIZED", {
			error_description: "invalid authorization header format",
			error: "invalid_client"
		}, { "WWW-Authenticate": "Basic" });
	}
}
/**
* Whether a client is allowed to use a given grant type.
*
* A client's registered `grantTypes` defaults to the documented default
* `["authorization_code"]` when unset (see client registration). Refresh tokens
* are only ever issued through the authorization_code flow, so a client allowed
* to use `authorization_code` is implicitly allowed to use `refresh_token`.
*
* @internal
*/
function clientAllowsGrant(client, grantType) {
	const allowedGrants = client.grantTypes && client.grantTypes.length > 0 ? client.grantTypes : ["authorization_code"];
	if (grantType === "refresh_token" && allowedGrants.includes("authorization_code")) return true;
	return allowedGrants.includes(grantType);
}
/**
* Validates requested scopes against a registered client's allowed scopes.
*
* @internal
*/
function validateClientScopes(client, scopes) {
	if (!scopes || !client.scopes) return;
	const validScopes = new Set(client.scopes);
	for (const scope of scopes) if (!validScopes.has(scope)) throw new APIError$1("BAD_REQUEST", {
		error_description: `client does not allow scope ${scope}`,
		error: "invalid_scope"
	});
}
function throwInvalidClient(errorDescription, authentication) {
	const attemptedBasicAuthentication = authentication?.method === "client_secret_basic";
	const challengeScheme = authentication?.scheme ?? (attemptedBasicAuthentication ? "Basic" : void 0);
	throw new APIError$1(challengeScheme ? "UNAUTHORIZED" : "BAD_REQUEST", {
		error_description: errorDescription,
		error: "invalid_client"
	}, challengeScheme ? { "WWW-Authenticate": challengeScheme } : void 0);
}
/**
* Resolves the registered client by id and authorizes it: existence, disabled
* state, registered auth method, requested scopes, and grant type. The record is
* always resolved here via `getClient`, so a client-auth strategy proves the
* caller controls `clientId` but never supplies the record. `preVerified` marks
* that an assertion already proved control, so the client-secret check is skipped.
*
* @internal
*/
async function validateClientCredentials(ctx, options, clientId, clientSecret, scopes, preVerified, grantType, authMethod) {
	const client = await getClient(ctx, options, clientId);
	if (!client) throwInvalidClient("client not found", { method: authMethod });
	if (client.disabled) throwInvalidClient("client is disabled", { method: authMethod });
	const registeredAuthMethod = client.tokenEndpointAuthMethod ?? "client_secret_basic";
	if (authMethod && registeredAuthMethod !== authMethod) throwInvalidClient(`client registered for ${registeredAuthMethod} cannot use ${authMethod}`, { method: authMethod });
	if ((client.tokenEndpointAuthMethod === "private_key_jwt" || isExtensionTokenEndpointAuthMethod(options, client.tokenEndpointAuthMethod)) && !preVerified) throw new APIError$1("BAD_REQUEST", {
		error_description: `client registered for ${client.tokenEndpointAuthMethod} must use client_assertion`,
		error: "invalid_client"
	});
	if (!preVerified) {
		if (client.tokenEndpointAuthMethod !== "none" && !clientSecret) throwInvalidClient("client secret must be provided", { method: authMethod });
		if (clientSecret && !client.clientSecret) throwInvalidClient("public client, client secret should not be received", { method: authMethod });
		if (clientSecret && !await verifyStoredClientSecret(ctx, options, client.clientSecret, clientSecret)) throwInvalidClient("invalid client_secret", { method: authMethod });
	}
	validateClientScopes(client, scopes);
	if (grantType && !clientAllowsGrant(client, grantType)) throw new APIError$1("BAD_REQUEST", {
		error_description: `client is not authorized to use grant type ${grantType}`,
		error: "unauthorized_client"
	});
	return client;
}
/**
* Parse client metadata that may be stored as JSON string or already parsed object.
* Handles database adapters that auto-parse JSON columns.
*
* @internal
*/
function parseClientMetadata(metadata) {
	if (!metadata) return void 0;
	return typeof metadata === "string" ? JSON.parse(metadata) : metadata;
}
/** Unwraps ExtractedCredentials into the fields each grant handler needs. */
function destructureCredentials(credentials) {
	return {
		clientId: credentials?.clientId,
		clientSecret: credentials?.kind === "client_secret" ? credentials.clientSecret : void 0,
		preVerified: credentials?.kind === "pre_verified",
		authMethod: credentials?.method,
		confirmation: credentials?.kind === "pre_verified" ? credentials.confirmation : void 0
	};
}
/**
* Extracts and resolves client credentials from the request.
* Supports: client_secret_basic, client_secret_post, private_key_jwt, and none (public).
*/
async function extractClientCredentials(ctx, opts, expectedAudience) {
	const body = { ...ctx.body ?? {} };
	await normalizeClientAuthenticationParameters(ctx.request, body);
	const authorization = ctx.request?.headers.get("authorization") ?? void 0;
	if (body.client_assertion_type || body.client_assertion) {
		if (!body.client_assertion || !body.client_assertion_type) throw new APIError$1("BAD_REQUEST", {
			error_description: "client_assertion and client_assertion_type must both be provided",
			error: "invalid_client"
		});
		const assertion = body.client_assertion;
		const assertionType = body.client_assertion_type;
		const extensionStrategy = getExtensionClientAuthenticationStrategy(opts, assertionType);
		if (extensionStrategy) {
			const result = await extensionStrategy.strategy.authenticate({
				ctx,
				opts,
				assertion,
				assertionType,
				clientId: body.client_id,
				expectedAudience
			});
			return {
				kind: "pre_verified",
				method: extensionStrategy.method,
				clientId: result.clientId,
				confirmation: result.confirmation
			};
		}
		const { verifyClientAssertion: verify } = await import("./authorize-Des4AWdj.mjs").then((n) => n.o);
		return {
			kind: "pre_verified",
			method: "private_key_jwt",
			clientId: (await verify(ctx, opts, assertion, assertionType, body.client_id, expectedAudience)).clientId
		};
	}
	if (authorization && !BASIC_SCHEME_PREFIX.test(authorization)) {
		const authorizationScheme = parseAuthorizationScheme(authorization);
		if (!authorizationScheme) throw new APIError$1("BAD_REQUEST", {
			error: "invalid_request",
			error_description: "Invalid authorization header format"
		});
		throwInvalidClient("unsupported authorization scheme", { scheme: authorizationScheme });
	}
	if (authorization && BASIC_SCHEME_PREFIX.test(authorization)) {
		const res = basicToClientCredentials(authorization);
		if (res) return {
			kind: "client_secret",
			method: "client_secret_basic",
			clientId: res.client_id,
			clientSecret: res.client_secret
		};
	}
	if (body.client_id && body.client_secret) return {
		kind: "client_secret",
		method: "client_secret_post",
		clientId: body.client_id,
		clientSecret: body.client_secret
	};
	if (body.client_id) return {
		kind: "public",
		method: "none",
		clientId: body.client_id
	};
	return null;
}
/**
* Parse space-separated prompt string into a set of prompts
*
* @param prompt
*/
function parsePrompt(prompt) {
	const prompts = prompt.split(" ").map((p) => p.trim());
	const set = /* @__PURE__ */ new Set();
	for (const p of prompts) if (p === "login" || p === "consent" || p === "create" || p === "select_account" || p === "none") set.add(p);
	return new Set(set);
}
/**
* Extracts the sector identifier (hostname) from a client's first redirect URI.
*
* @see https://openid.net/specs/openid-connect-core-1_0.html#PairwiseAlg
* @internal
*/
function getSectorIdentifier(client) {
	const uri = client.redirectUris?.[0];
	if (!uri) throw new BetterAuthError("Client has no redirect URIs for sector identifier");
	return new URL(uri).host;
}
/**
* Computes a pairwise subject identifier using HMAC-SHA256.
*
* @see https://openid.net/specs/openid-connect-core-1_0.html#PairwiseAlg
* @internal
*/
async function computePairwiseSub(userId, client, secret) {
	const sectorId = getSectorIdentifier(client);
	return makeSignature(`${sectorId}.${userId}`, secret);
}
/**
* Returns the appropriate subject identifier for a user+client pair.
* Uses pairwise when the client opts in and the server has a secret configured.
*
* @internal
*/
async function resolveSubjectIdentifier(userId, client, opts) {
	if (client.subjectType === "pairwise" && opts.pairwiseSecret) return computePairwiseSub(userId, client, opts.pairwiseSecret);
	return userId;
}
/**
* Resolves `postLogin.consentReferenceId`, treating an empty value as no reference.
*
* @internal
*/
async function getConsentReferenceId(opts, context) {
	return await opts.postLogin?.consentReferenceId?.(context) || void 0;
}
/**
* Finds the consent stored for exactly this reference. Without a reference,
* only consent stored without one (missing, null, or empty) matches.
*
* @internal
*/
async function findConsent(ctx, clientId, userId, referenceId) {
	const findByReference = (value) => ctx.context.adapter.findOne({
		model: "oauthConsent",
		where: [
			{
				field: "clientId",
				value: clientId
			},
			{
				field: "userId",
				value: userId
			},
			{
				field: "referenceId",
				value
			}
		]
	});
	if (referenceId) return findByReference(referenceId);
	return await findByReference(null) ?? findByReference("");
}
/**
* Converts URLSearchParams to a plain object, preserving
* multi-valued keys as arrays instead of discarding duplicates.
*/
function searchParamsToQuery(params) {
	const result = Object.create(null);
	for (const key of new Set(params.keys())) {
		const values = params.getAll(key);
		result[key] = values.length === 1 ? values[0] : values;
	}
	return result;
}
function isSessionFreshForSignedQuery(sessionCreatedAt, signedQueryIssuedAt) {
	if (!signedQueryIssuedAt) return false;
	const normalized = normalizeTimestampValue(sessionCreatedAt);
	if (!normalized) return false;
	return normalized.getTime() >= signedQueryIssuedAt.getTime();
}
function removePromptFromQuery(query, prompt) {
	const nextQuery = new URLSearchParams(query);
	const prompts = nextQuery.get("prompt")?.split(" ");
	const foundPrompt = prompts?.findIndex((v) => v === prompt) ?? -1;
	if (foundPrompt >= 0) {
		prompts?.splice(foundPrompt, 1);
		prompts?.length ? nextQuery.set("prompt", prompts.join(" ")) : nextQuery.delete("prompt");
	}
	return nextQuery;
}
function removeMaxAgeFromQuery(query) {
	const nextQuery = new URLSearchParams(query);
	nextQuery.delete("max_age");
	return nextQuery;
}
/**
* Determines if PKCE is required for a given client and authorization request.
*
* PKCE is always required for:
* 1. Public clients (cannot securely store client_secret)
* 2. Requests with offline_access scope unless a confidential OIDC request
*    already uses nonce as its authorization-code injection countermeasure.
*
* For confidential clients:
* - Uses client.requirePKCE if set (defaults to true)
*
* Returns false if PKCE is not required, or the reason it is required.
*
* @internal
*/
function isPKCERequired(client, request) {
	if (client.tokenEndpointAuthMethod === "none") return "pkce is required for public clients";
	const requestScopes = request?.scopes ?? [];
	const isOpenIdRequest = requestScopes.includes("openid");
	const hasNonce = typeof request?.nonce === "string" && request.nonce.length > 0;
	const hasOidcNonce = isOpenIdRequest && hasNonce;
	if (requestScopes.includes("offline_access") && !hasOidcNonce) return "pkce or OIDC nonce is required when requesting offline_access scope";
	if (client.requirePKCE ?? true) return "pkce is required for this client";
	return false;
}
/**
* Applies the redirect URI HTTPS policy: `http:` is allowed on loopback hosts
* for clients that are not `web`, or when `allowInsecureRedirectUri` accepts
* the URL. A throwing callback rejects the URI.
*/
function isRedirectUriTransportAllowed(opts, uri, isWebClient = false) {
	let url;
	try {
		url = new URL(uri);
	} catch {
		return false;
	}
	if (url.protocol !== "http:") return true;
	if (!isWebClient && isLoopbackHost(url.host)) return true;
	return isInsecureRedirectUriAllowed(opts, url);
}
/**
* Runs `allowInsecureRedirectUri` for an `http:` URL, failing closed. URLs
* with credentials are never accepted.
*/
function isInsecureRedirectUriAllowed(opts, url) {
	if (url.username || url.password) return false;
	try {
		return opts.allowInsecureRedirectUri?.(url) === true;
	} catch {
		return false;
	}
}
// src/resource-challenge.ts
const DPOP_CHALLENGE_ERRORS = /* @__PURE__ */ new Set(["invalid_dpop_proof"]);
const OAUTH_SCOPE_TOKEN_PATTERN = /^[\x21\x23-\x5b\x5d-\x7e]+$/;
const ERROR_DESCRIPTION_EXCLUDED = /[^\x20-\x21\x23-\x5b\x5d-\x7e]+/g;
function quoteAuthParam(value) {
	if (/[\x00-\x1f\x7f]/.test(value)) throw new TypeError("invalid WWW-Authenticate parameter");
	return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}
function serializeChallengeScopes(scopes) {
	if (!scopes) return void 0;
	for (const scope of scopes) if (!OAUTH_SCOPE_TOKEN_PATTERN.test(scope)) throw new TypeError(`invalid challenge scope: ${JSON.stringify(scope)}`);
	return [...new Set(scopes)].join(" ");
}
/**
* Fits a runtime error message into RFC 6750 §3's `error_description`
* character set instead of failing the response it describes: `"` becomes
* `'`, any other excluded character (`\`, controls, non-ASCII) becomes a space,
* and a description with nothing left is omitted.
*/
function formatErrorDescription(description) {
	if (typeof description !== "string") return void 0;
	return description.replace(/"/g, "'").replace(ERROR_DESCRIPTION_EXCLUDED, " ").replace(/ {2,}/g, " ").trim() || void 0;
}
function extractTokenError(error) {
	const body = error.body;
	return {
		errorCode: typeof body?.error === "string" ? body.error : void 0,
		description: typeof body?.error_description === "string" ? body.error_description : typeof body?.message === "string" ? body.message : error.message
	};
}
function isDpopChallengeError(error) {
	const { errorCode, description } = extractTokenError(error);
	return !!errorCode && (DPOP_CHALLENGE_ERRORS.has(errorCode) || errorCode === "invalid_token" && description.includes("DPoP"));
}
function presentedScheme(request) {
	if (!request) return void 0;
	const authorizationHeader = typeof request.headers?.get === "function" ? request.headers.get("authorization") : request.authorizationHeader;
	return parseAccessTokenAuthorization(authorizationHeader)?.scheme;
}
/** Builds an RFC 9449 §7.1 `WWW-Authenticate: DPoP` challenge value. */
function buildDpopChallengeValue(errorCode, description, algorithms = DPOP_SIGNING_ALGORITHMS$1, scope) {
	const errorDescription = formatErrorDescription(description);
	return [
		`DPoP error="${quoteAuthParam(errorCode)}"`,
		scope && `scope="${quoteAuthParam(scope)}"`,
		errorDescription && `error_description="${errorDescription}"`,
		`algs="${quoteAuthParam(algorithms.join(" "))}"`
	].filter((param) => !!param).join(", ");
}
/**
* `WWW-Authenticate` is not a CORS-safelisted response header, so browsers
* hide it from cross-origin clients unless the response exposes it.
*/
function challengeHeaders(challenge) {
	return {
		"WWW-Authenticate": challenge,
		"Access-Control-Expose-Headers": "WWW-Authenticate"
	};
}
function challengeBody(message, errorCode, description) {
	if (!errorCode) return { message };
	return {
		message,
		error: errorCode,
		...typeof description === "string" && { error_description: description }
	};
}
function extractInsufficientScope(error) {
	const body = error.body;
	return {
		scope: body?.scope,
		description: body?.error_description !== void 0 ? body.error_description : error.message
	};
}
function resolveResourceMetadataUrl(value, opts) {
	const url = URL.canParse?.(value) ? new URL(value) : null;
	if (url && url.origin !== "null") {
		const resourcePath = url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname;
		return `${url.origin}/.well-known/oauth-protected-resource${resourcePath}${url.search}`;
	}
	const resourceMetadata = opts?.resourceMetadataMappings?.[value];
	if (!resourceMetadata) throw new APIError$1("INTERNAL_SERVER_ERROR", { message: `missing resource_metadata mapping for ${value}` });
	return resourceMetadata;
}
function buildBearerChallenge(resource, opts, authParams) {
	return (Array.isArray(resource) ? resource : [resource]).map((value) => {
		return `Bearer ${authParams(resolveResourceMetadataUrl(value, opts)).filter((param) => !!param).join(", ")}`;
	}).join(", ");
}
/**
* Create an OAuth resource-server challenge for a failed access-token request.
*
* Missing/invalid bearer credentials are reported with RFC 6750 plus the RFC
* 9728 `resource_metadata` pointer. A 401 whose body has
* `error: "invalid_token"` means a presented token failed, so its challenge
* also carries that code and an `error_description` (RFC 6750 §3.1); any
* other 401 is treated as a request without credentials and carries neither.
* Insufficient-scope failures (built with
* `createInsufficientScopeError`) are reported with RFC 6750 §3.1's
* `insufficient_scope` challenge on a 403 naming the scopes the token lacks, so
* clients can step up their authorization. DPoP-bound-token failures are
* reported with RFC 9449's `DPoP` challenge so clients know which proof
* algorithms to use. Pass the failed `request` so that any 401 or
* insufficient-scope 403 on a request that presented its token with the
* `DPoP` scheme, such as an expired or revoked token, is also answered with a
* `DPoP` challenge (RFC 9449 §7.2), and a 401 on one with an unsupported
* scheme, or none, with a `Bearer` challenge (RFC 6750 §3.1). Without it,
* only DPoP-specific errors get one. Non-URL resources (for example a `urn:`
* or a client id) resolve their metadata URL through
* `resourceMetadataMappings`.
*
* An `error_description` is fitted into RFC 6750 §3's character set rather
* than rejected: `"` becomes `'`, other excluded characters become spaces, and
* an empty result is omitted. The returned error's body keeps the original
* `error` and `error_description`. Invalid scope tokens in `challengeScopes`
* still throw, since they are server configuration.
*
* Every other error returns `undefined`, including a plain `FORBIDDEN`: a
* permission denial that re-authorizing cannot fix must not be answered with a
* challenge that sends the user through consent for scopes they already hold.
*
* @external
*/
function createResourceServerChallenge(error, resource, opts) {
	const challengeScope = serializeChallengeScopes(opts?.challengeScopes);
	if (isAPIError(error) && error.status === "UNAUTHORIZED") {
		const { errorCode, description } = extractTokenError(error);
		const scheme = presentedScheme(opts?.request);
		if (scheme === "DPoP" || (!opts?.request || scheme === "Bearer") && isDpopChallengeError(error)) {
			const dpopErrorCode = errorCode ?? "invalid_token";
			return new APIError$1("UNAUTHORIZED", challengeBody(error.message, dpopErrorCode, description), challengeHeaders(buildDpopChallengeValue(dpopErrorCode, description, opts?.dpopSigningAlgorithms)));
		}
		const invalidToken = errorCode === "invalid_token";
		const errorDescription = invalidToken ? formatErrorDescription(description) : void 0;
		return new APIError$1("UNAUTHORIZED", challengeBody(error.message, invalidToken ? errorCode : void 0, description), challengeHeaders(buildBearerChallenge(resource, opts, (metadataUrl) => [
			invalidToken && `error="invalid_token"`,
			errorDescription && `error_description="${errorDescription}"`,
			`resource_metadata="${quoteAuthParam(metadataUrl)}"`,
			challengeScope && `scope="${quoteAuthParam(challengeScope)}"`
		])));
	}
	if (isInsufficientScopeError(error)) {
		const insufficientScope = extractInsufficientScope(error);
		const errorDescription = formatErrorDescription(insufficientScope.description);
		const scope = insufficientScope.scope || challengeScope;
		const message = typeof insufficientScope.description === "string" ? insufficientScope.description : error.message;
		const dpopChallenge = presentedScheme(opts?.request) === "DPoP" ? buildDpopChallengeValue("insufficient_scope", insufficientScope.description, opts?.dpopSigningAlgorithms, scope) : void 0;
		return new APIError$1("FORBIDDEN", challengeBody(message, "insufficient_scope", insufficientScope.description), challengeHeaders(dpopChallenge ?? buildBearerChallenge(resource, opts, (metadataUrl) => [
			`error="insufficient_scope"`,
			scope && `scope="${quoteAuthParam(scope)}"`,
			`resource_metadata="${quoteAuthParam(metadataUrl)}"`,
			errorDescription && `error_description="${errorDescription}"`
		])));
	}
}
export { storeClientSecret as A, collectExtensionUserInfoClaims as B, parseClientMetadata as C, resolveSessionAuthTime as D, removePromptFromQuery as E, validateClientScopes as F, getSupportedGrantTypes as G, getClientDiscoveries as H, verifyOAuthQueryParams as I, validateOAuthProviderExtensions as J, hasUserInfoClaimExtension as K, applyOAuthProviderMetadataExtensions as L, toAudienceClaim as M, toResourceList as N, resolveSubjectIdentifier as O, validateClientCredentials as P, collectExtensionAccessTokenClaims as R, parseBearerToken as S, removeMaxAgeFromQuery as T, getExtensionGrantHandler as U, extendOAuthProvider as V, getSupportedAuthMethods as W, isRedirectUriTransportAllowed as _, decryptStoredClientSecret as a, normalizeClientAuthenticationParameters as b, findConsent as c, getJwtPlugin as d, getOAuthProviderPlugin as f, isPKCERequired as g, isInvalidJwtError as h, clientAllowsGrant as i, storeToken as j, searchParamsToQuery as k, getClient as l, isInsecureRedirectUriAllowed as m, createResourceServerChallenge as n, destructureCredentials as o, getStoredToken as p, isExtensionTokenEndpointAuthMethod as q, assertNotTrustedClient as r, extractClientCredentials as s, buildDpopChallengeValue as t, getConsentReferenceId as u, isSessionFreshForSignedQuery as v, parsePrompt as w, normalizeTimestampValue as x, mergeDiscoveryMetadata as y, collectExtensionIdTokenClaims as z };
