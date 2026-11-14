import type { GenericEndpointContext } from "@better-auth/core";
import type { getSessionFromCtx } from "better-auth/api";
import type { OAuthOptions, Scope } from "../types";
/**
 * Authorizes a client action against the configured `clientPrivileges` hook.
 *
 * This is the single authorization helper for every OAuth client mutation. The
 * create path enforces it at the shared creation chokepoint so that no
 * registration route can reach client persistence without it.
 *
 * @throws APIError UNAUTHORIZED when there is no session or the hook denies the action.
 * @throws APIError BAD_REQUEST when the request carries no headers.
 */
export declare function assertClientPrivileges(ctx: GenericEndpointContext, session: Awaited<ReturnType<typeof getSessionFromCtx>>, opts: OAuthOptions<Scope[]>, action: "create" | "read" | "update" | "delete" | "list" | "rotate" | "configure-client-credentials-scopes", clientId?: string): Promise<void>;
