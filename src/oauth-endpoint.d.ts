import type { AuthContext } from "@better-auth/core";
import type { EndpointContext, EndpointOptions, StrictEndpoint } from "better-call";
import * as z from "zod";
/**
 * Canonical OAuth 2.0 / OpenID Connect error codes. The union is the single
 * vocabulary for every error-emitting surface in this plugin: token, authorize,
 * revoke, introspect, register, userinfo, logout, consent, and the redirect
 * error channel. Entries are grouped by source RFC so the declaration doubles
 * as a specification map.
 *
 * The trailing `(string & {})` keeps the type open for product-specific codes
 * (e.g. `"invalid_verification"`, `"invalid_user"`) while preserving editor
 * autocomplete for the listed standard codes. Prefer a standard code whenever
 * one applies; fall back to a custom string only for states no RFC covers.
 */
export type OAuthErrorCode = "invalid_request" | "invalid_client" | "invalid_grant" | "unauthorized_client" | "unsupported_grant_type" | "unsupported_response_type" | "invalid_scope" | "access_denied" | "server_error" | "temporarily_unavailable" | "invalid_token" | "unsupported_token_type" | "invalid_redirect_uri" | "invalid_client_metadata" | "invalid_software_statement" | "unapproved_software_statement" | "invalid_target" | "invalid_request_object" | "login_required" | "consent_required" | "interaction_required" | "account_selection_required" | "invalid_request_uri" | "request_not_supported" | "request_uri_not_supported" | "registration_not_supported" | (string & {});
export type OAuthFieldErrorCodeMap = {
    missing?: OAuthErrorCode;
    invalid?: OAuthErrorCode;
};
export type OAuthFieldErrorCode = OAuthErrorCode | OAuthFieldErrorCodeMap;
export interface OAuthEndpointErrorResult {
    error: OAuthErrorCode;
    error_description: string;
}
export interface OAuthEndpointRedirectContext<Ctx = unknown> {
    error: OAuthErrorCode;
    error_description: string;
    ctx: Ctx;
}
export type OAuthRedirectOnError<Ctx = unknown, Result = unknown> = (result: OAuthEndpointRedirectContext<Ctx>) => Result | Promise<Result>;
type ValidationErrorHookArgs = {
    message: string;
    issues: readonly z.core.$ZodIssue[];
};
type ValidationErrorHook = (args: ValidationErrorHookArgs) => unknown;
export interface OAuthEndpointExtras<Ctx = EndpointContext<string, EndpointOptions, AuthContext>> {
    /**
     * Invoked when validation fails. Presence switches delivery from a JSON
     * `APIError` envelope to this callback, which receives the request
     * context so it can compute an RP redirect URL from already-parsed query
     * params.
     */
    redirectOnError?: OAuthRedirectOnError<Ctx>;
    /**
     * Forwarded to `better-call` and awaited before the RFC envelope is
     * synthesized, so callers can observe or transform issues.
     */
    onValidationError?: ValidationErrorHook;
    /**
     * First-path-segment → RFC code mapping. Nested failures like
     * `jwks.keys[0].n` collapse to `jwks`; lift a nested schema to a
     * top-level field when per-sub-field codes are required.
     */
    errorCodesByField?: Record<string, OAuthFieldErrorCode>;
    /**
     * RFC code returned when no `errorCodesByField` entry matches or the failure is
     * structurally malformed (wrong type, duplicated params, bad format,
     * failed refinement).
     * @default "invalid_request"
     */
    defaultError?: OAuthErrorCode;
}
/**
 * Wraps `createAuthEndpoint` so zod schemas stay the single source of truth
 * for body/query shape while validation failures serialize as the RFC 6749
 * §5.2 error envelope `{ error, error_description }`.
 *
 * A failing issue is routed by its first path segment via `errorCodesByField`:
 * - missing required (`invalid_type` + "received undefined") → `.missing`
 * - unsupported value (`invalid_value`) → `.invalid`
 * - anything else (wrong type, duplicated params, bad format) → `defaultError`
 *
 * For enum fields that need to distinguish missing from unsupported, compose
 * as `z.string().pipe(z.enum([...]))` so duplicated params fail the outer
 * `z.string()` as `invalid_type` instead of masquerading as an unsupported
 * enum value.
 */
export declare function createOAuthEndpoint<Path extends string, Options extends EndpointOptions, R>(path: Path, options: Options & OAuthEndpointExtras<EndpointContext<Path, Options, AuthContext>>, handler: (ctx: EndpointContext<Path, Options, AuthContext>) => Promise<R>): StrictEndpoint<Path, Options, R>;
export declare function mapIssuesToOAuthError(issues: readonly z.core.$ZodIssue[], errorCodesByField?: Record<string, OAuthFieldErrorCode>, defaultError?: OAuthErrorCode): OAuthEndpointErrorResult;
/**
 * Returns `true` for issues that represent an absent required value. Zod v4
 * strips `input` from published issues, so the signal is the `invalid_type`
 * code combined with a message suffix of "received undefined". The suffix is
 * pinned by a regression test so a zod rephrase fails the test instead of
 * silently reclassifying missing fields.
 *
 * Assumes the default zod error map. Consumers that install a localized map
 * via `z.setErrorMap()` will break this check, collapsing missing-field
 * failures to `defaultError`.
 */
export declare function isMissingValueIssue(issue: z.core.$ZodIssue): boolean;
export {};
