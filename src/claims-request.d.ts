import * as z from "zod";
export declare const claimsRequestInputSchema: z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
export declare const claimsRequestParameterSchema: z.ZodUnion<readonly [z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>]>;
export declare function isValidOidcClaimsRequest(value: unknown): boolean;
export declare function getRequestedUserInfoClaims(value: unknown, supportedClaims?: Iterable<string>): string[];
export declare function canSatisfyEssentialAcrRequest(value: unknown, currentAcr: string): boolean;
export declare function filterClaimsRequestUserInfoClaims(value: unknown, allowedUserInfoClaims: string[]): {
    [k: string]: unknown;
};
