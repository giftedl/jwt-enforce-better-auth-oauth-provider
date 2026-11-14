import * as z from "zod";
import type { OAuthOptions, Scope } from "../types";
export declare const adminCreateOAuthResource: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/resources", {
    method: "POST";
    body: z.ZodObject<{
        identifier: z.ZodNonOptional<z.ZodOptional<z.ZodString>>;
        name: z.ZodOptional<z.ZodString>;
        accessTokenTtl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        refreshTokenTtl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        signingAlgorithm: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            RS256: "RS256";
            PS256: "PS256";
            ES256: "ES256";
            ES512: "ES512";
            EdDSA: "EdDSA";
        }>>>;
        signingKeyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        allowedScopes: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        customClaims: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        dpopBoundAccessTokensRequired: z.ZodOptional<z.ZodBoolean>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.z.core.$strip>;
    metadata: {
        SERVER_ONLY: true;
    };
}, import("../types").OAuthResource>;
export declare const adminListOAuthResources: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/resources", {
    method: "GET";
    metadata: {
        SERVER_ONLY: true;
    };
}, import("../types").OAuthResource[]>;
export declare const adminGetOAuthResource: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier", {
    method: "GET";
    metadata: {
        SERVER_ONLY: true;
    };
}, import("../types").OAuthResource>;
export declare const adminUpdateOAuthResource: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier", {
    method: "PATCH";
    body: z.ZodObject<{
        identifier: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        accessTokenTtl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        refreshTokenTtl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        signingAlgorithm: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            RS256: "RS256";
            PS256: "PS256";
            ES256: "ES256";
            ES512: "ES512";
            EdDSA: "EdDSA";
        }>>>;
        signingKeyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        allowedScopes: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        customClaims: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        dpopBoundAccessTokensRequired: z.ZodOptional<z.ZodBoolean>;
        disabled: z.ZodOptional<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.z.core.$strip>;
    metadata: {
        SERVER_ONLY: true;
    };
}, import("../types").OAuthResource>;
export declare const adminDeleteOAuthResource: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier", {
    method: "DELETE";
    metadata: {
        SERVER_ONLY: true;
    };
}, {
    deleted: boolean;
}>;
export declare const adminLinkClientResource: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier/clients/:client_id", {
    method: "POST";
    metadata: {
        SERVER_ONLY: true;
    };
}, {
    linked: boolean;
}>;
export declare const adminUnlinkClientResource: (opts: OAuthOptions<Scope[]>) => import("better-call").StrictEndpoint<"/admin/oauth2/resources/:identifier/clients/:client_id", {
    method: "DELETE";
    metadata: {
        SERVER_ONLY: true;
    };
}, {
    unlinked: boolean;
}>;
