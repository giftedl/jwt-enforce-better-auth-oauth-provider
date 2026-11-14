import * as z from "zod";
import type { OAuthOptions, Scope } from "../types";
export declare const getOAuthConsent: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/get-consent", {
    method: "GET";
    query: z.ZodObject<{
        id: z.ZodString;
    }, z.z.core.$strip>;
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    metadata: {
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthConsent<Scope[]>>;
export declare const getOAuthConsents: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/get-consents", {
    method: "GET";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    metadata: {
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthConsent<Scope[]>[]>;
export declare const updateOAuthConsent: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/update-consent", {
    method: "POST";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    body: z.ZodObject<{
        id: z.ZodString;
        update: z.ZodObject<{
            scopes: z.ZodArray<z.ZodString>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    metadata: {
        openapi: {
            description: string;
        };
    };
}, import("../types").OAuthConsent<Scope[]>>;
export declare const deleteOAuthConsent: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/oauth2/delete-consent", {
    method: "POST";
    use: import("better-call").Middleware<import("better-call").MiddlewareOptions, (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
            session: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        };
    }>>[];
    body: z.ZodObject<{
        id: z.ZodString;
    }, z.z.core.$strip>;
    metadata: {
        openapi: {
            description: string;
        };
    };
}, void>;
