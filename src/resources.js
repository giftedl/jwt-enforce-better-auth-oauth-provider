"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWS_ALGORITHMS = void 0;
exports.assertIdentifierValid = assertIdentifierValid;
exports.extractRepeatedResourceFromForm = extractRepeatedResourceFromForm;
exports.isAudienceClaimAllowed = isAudienceClaimAllowed;
exports.resolveResourcePolicy = resolveResourcePolicy;
exports.isClientLinkedToAnyResource = isClientLinkedToAnyResource;
exports.getResourceCustomClaims = getResourceCustomClaims;
exports.invalidateResourceCache = invalidateResourceCache;
exports.getResource = getResource;
exports.collectResourceInputs = collectResourceInputs;
exports.logStartupSeedFailure = logStartupSeedFailure;
exports.resetSeedStateForTests = resetSeedStateForTests;
exports.seedResources = seedResources;
exports.seedResourcesOnce = seedResourcesOnce;
exports.logEnforcePerClientResourcesResolution = logEnforcePerClientResourcesResolution;
var env_1 = require("@better-auth/core/env");
var api_1 = require("better-auth/api");
var zod_1 = require("./types/zod");
/**
 * Source-of-truth list of asymmetric JWS algorithms supported by the JWT
 * plugin. Mirrors the {@link JWSAlgorithms} literal-union type from
 * `packages/better-auth/src/plugins/jwt/types.ts`. Kept as a runtime const
 * so the admin-CRUD zod schema AND the seed-config validator can reject
 * bad values up-front rather than surfacing opaque jose errors at issuance.
 *
 * MUST stay in sync with `JWSAlgorithms`. The type-level guard immediately
 * below fails the typecheck if the two drift.
 */
exports.JWS_ALGORITHMS = [
    "EdDSA",
    "ES256",
    "ES512",
    "PS256",
    "RS256",
];
var _jwsAlgorithmsCoverageOk = true;
void _jwsAlgorithmsCoverageOk;
var JWS_ALGORITHM_SET = new Set(exports.JWS_ALGORITHMS);
/**
 * Upper bound on how many entries are accepted in a JWT's `aud` claim during
 * introspection / revocation validation. Without a cap, a hostile or replayed
 * token can supply hundreds of fake resource identifiers and amplify load on
 * the resource table (one DB lookup per unique unrecognized entry). Real-world
 * deployments use single-digit resource lists; 64 is a generous ceiling that
 * stays well clear of any legitimate use and bounds the per-request DB fan-out.
 *
 * RFC 7519 §4.1.3 does not specify a maximum, so this is a defensive limit,
 * not a spec one. Tokens that exceed it are treated as invalid (introspect →
 * `active: false`, revoke → no-op) rather than triggering the lookup path.
 *
 * @internal
 */
var MAX_AUD_VALUES = 64;
/**
 * Validates a resource `identifier` per RFC 8707 §2 (absolute URI, no
 * fragment), honoring {@link OAuthOptions.identifierValidator} when provided.
 *
 * Returns a structured result so callers can decide whether to throw
 * (admin CRUD / DCR) or warn-and-skip (config seed path).
 *
 * @internal
 */
function checkIdentifier(opts, identifier) {
    return __awaiter(this, void 0, void 0, function () {
        var customValidator, ok, parsed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    customValidator = opts.identifierValidator;
                    if (!customValidator) return [3 /*break*/, 2];
                    return [4 /*yield*/, customValidator(identifier)];
                case 1:
                    ok = _c.sent();
                    if (!ok) {
                        return [2 /*return*/, {
                                ok: false,
                                reason: "resource identifier ".concat(identifier, " failed validation"),
                            }];
                    }
                    return [2 /*return*/, { ok: true }];
                case 2:
                    parsed = zod_1.ResourceUriSchema.safeParse(identifier);
                    if (!parsed.success) {
                        return [2 /*return*/, {
                                ok: false,
                                reason: "resource identifier ".concat(identifier, " is invalid: ").concat((_b = (_a = parsed.error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "not an absolute URI"),
                            }];
                    }
                    return [2 /*return*/, { ok: true }];
            }
        });
    });
}
/**
 * Variant of {@link checkIdentifier} that throws `invalid_target` on failure.
 * Used by admin CRUD endpoints where validation failure is a client error.
 *
 * @internal
 */
function assertIdentifierValid(opts, identifier) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkIdentifier(opts, identifier)];
                case 1:
                    result = _a.sent();
                    if (!result.ok) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_target",
                            error_description: result.reason,
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * The OIDC userinfo endpoint's resource identifier. Always accepted as an
 * implicit `aud` value when `openid` is in scope — not looked up against
 * `oauthResource` rows.
 */
var userInfoResource = function (baseURL) { return "".concat(baseURL, "/oauth2/userinfo"); };
/**
 * Re-parses a request's raw `application/x-www-form-urlencoded` body to
 * recover every value of the repeated `resource` parameter (RFC 8707 §2).
 *
 * Workaround for better-call's form-body parser (better-call ≤1.3.5), which
 * collapses repeated form keys with last-write-wins. A client sending
 * `resource=https://a&resource=https://b` would otherwise arrive in the
 * handler as `{ resource: "https://b" }`, silently narrowing the issued
 * token's `aud` to a single resource.
 *
 * Returns the full ordered list when the body is form-encoded and contains
 * any `resource` entries; `undefined` otherwise. Caller MUST enable
 * `cloneRequest: true` on the endpoint — the body stream is read here a
 * second time, and that only works when better-call cloned the request
 * before its own parse.
 *
 * Note: the URL-encoded body path is the only one affected. The query-string
 * path (e.g. `/oauth2/authorize?resource=…&resource=…`) is parsed by the
 * router itself, which DOES array-promote duplicate keys correctly.
 *
 * @internal
 */
function extractRepeatedResourceFromForm(request) {
    return __awaiter(this, void 0, void 0, function () {
        var contentType, text, _a, params, values;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    contentType = (_c = (_b = request.headers.get("content-type")) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : "";
                    if (!contentType.includes("application/x-www-form-urlencoded")) {
                        return [2 /*return*/, undefined];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, request.clone().text()];
                case 2:
                    text = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _d.sent();
                    return [2 /*return*/, undefined];
                case 4:
                    if (!text)
                        return [2 /*return*/, undefined];
                    params = new URLSearchParams(text);
                    values = params.getAll("resource").filter(function (value) { return value.length > 0; });
                    return [2 /*return*/, values.length > 0 ? values : undefined];
            }
        });
    });
}
/**
 * Normalizes a `resource` parameter into an array. Accepts the RFC 8707
 * forms: a single string, a string[], or undefined.
 *
 * @internal
 */
function normalizeResourceParam(resource) {
    if (resource === undefined || resource === null)
        return undefined;
    if (typeof resource === "string")
        return [resource];
    if (Array.isArray(resource)) {
        var result = resource.filter(function (r) { return typeof r === "string" && r.length > 0; });
        return result.length > 0 ? result : undefined;
    }
    return undefined;
}
/**
 * Validates a JWT `aud` claim against the OAuth resource model.
 *
 * Every non-implicit audience value must resolve to an `oauthResource` row.
 * Disabled rows still pass because disabling blocks new issuance; deleting the
 * row is the operation that invalidates already-issued tokens.
 *
 * @internal
 */
function isAudienceClaimAllowed(ctx_1, opts_1, audienceClaim_1) {
    return __awaiter(this, arguments, void 0, function (ctx, opts, audienceClaim, implicitAudiences) {
        var audienceValues, implicitAudienceSet, resourcesToLookup, _i, audienceValues_1, audienceValue, rows;
        if (implicitAudiences === void 0) { implicitAudiences = []; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (audienceClaim === undefined)
                        return [2 /*return*/, true];
                    audienceValues = Array.isArray(audienceClaim)
                        ? audienceClaim
                        : [audienceClaim];
                    if (audienceValues.length > MAX_AUD_VALUES)
                        return [2 /*return*/, false];
                    implicitAudienceSet = new Set(implicitAudiences);
                    resourcesToLookup = new Set();
                    for (_i = 0, audienceValues_1 = audienceValues; _i < audienceValues_1.length; _i++) {
                        audienceValue = audienceValues_1[_i];
                        if (implicitAudienceSet.has(audienceValue))
                            continue;
                        resourcesToLookup.add(audienceValue);
                    }
                    if (resourcesToLookup.size === 0)
                        return [2 /*return*/, true];
                    return [4 /*yield*/, Promise.all(Array.from(resourcesToLookup, function (resource) {
                            return getResource(ctx, opts, resource);
                        }))];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.every(Boolean)];
            }
        });
    });
}
/**
 * Resolves the resource policy for a request.
 *
 * Validation steps (RFC 8707 §3 + per-resource policy):
 *
 * 1. Resolve `resource` parameter to a list of identifiers.
 * 2. For each identifier, look up the {@link OAuthResource} row.
 *    - Missing → `invalid_target`.
 *    - `disabled` → `invalid_target` (no new issuance).
 * 3. If {@link OAuthOptions.enforcePerClientResources} resolves to true,
 *    confirm the client is linked to every requested resource via
 *    `oauthClientResource`. Unlinked → `invalid_target`.
 * 4. Intersect `requestedScopes` with each resource's `allowedScopes`.
 *    Empty intersection → `invalid_scope`.
 * 5. Pick the minimum `accessTokenTtl` across requested resources.
 * 6. Pick signing config — only honored for single-resource requests
 *    (a JWT can only have one signature).
 * 7. Merge per-resource `customClaims` (returned raw; reserved-claim
 *    stripping is owned by `resolveAccessTokenClaims`).
 *
 * When no `resource` param is present, returns an empty policy: no `aud`
 * claim and no resource-specific overrides.
 *
 * @internal
 */
function resolveResourcePolicy(ctx, opts, params) {
    return __awaiter(this, void 0, void 0, function () {
        var requestedResources, includesOpenid, baseURL, userInfoResourceIdentifier, uniqueRequestedResources, resolved, _i, uniqueRequestedResources_1, identifier, row, enforcePerClient, effectiveScopes, _loop_1, _a, resolved_1, row, accessTokenTtl, refreshTokenTtl, _b, resolved_2, row, uniqueSigningAlgs, uniqueSigningKids, _c, resolved_3, row, signingAlgorithm, signingKeyId, mergedClaims, _d, resolved_4, row, dpopBoundAccessTokensRequired, audienceIdentifiers, audClaim;
        var _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    requestedResources = normalizeResourceParam(params.resource);
                    includesOpenid = params.requestedScopes.includes("openid");
                    baseURL = (_e = ctx.context.baseURL) !== null && _e !== void 0 ? _e : "";
                    userInfoResourceIdentifier = userInfoResource(baseURL);
                    if (!requestedResources) {
                        // No resource param — no resource-specific decisions to make. Matches
                        // pre-entity behavior: an access token requested without `resource`
                        // has no `aud` claim, regardless of `openid` scope membership. The
                        // implicit userinfo audience is only added when at least one real
                        // RFC 8707 resource is requested (see audClaim construction below).
                        return [2 /*return*/, {
                                audienceClaim: undefined,
                                accessTokenTtl: null,
                                refreshTokenTtl: null,
                                signingAlgorithm: null,
                                signingKeyId: null,
                                rawCustomClaims: {},
                                dpopBoundAccessTokensRequired: false,
                                effectiveScopes: __spreadArray([], params.requestedScopes, true),
                            }];
                    }
                    uniqueRequestedResources = __spreadArray([], new Set(requestedResources), true);
                    resolved = [];
                    _i = 0, uniqueRequestedResources_1 = uniqueRequestedResources;
                    _h.label = 1;
                case 1:
                    if (!(_i < uniqueRequestedResources_1.length)) return [3 /*break*/, 4];
                    identifier = uniqueRequestedResources_1[_i];
                    // `/oauth2/userinfo` is an implicit audience for OIDC userinfo lookups
                    // (not a configured resource server). Skip the entity check for it.
                    if (identifier === userInfoResourceIdentifier)
                        return [3 /*break*/, 3];
                    return [4 /*yield*/, getResource(ctx, opts, identifier)];
                case 2:
                    row = _h.sent();
                    if (row) {
                        if (row.disabled) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error: "invalid_target",
                                error_description: "requested resource ".concat(identifier, " is disabled"),
                            });
                        }
                        resolved.push(row);
                        return [3 /*break*/, 3];
                    }
                    throw new api_1.APIError("BAD_REQUEST", {
                        error: "invalid_target",
                        error_description: "requested resource ".concat(identifier, " is not configured"),
                    });
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    enforcePerClient = resolveEnforcePerClientResources(opts).value;
                    if (!(enforcePerClient && resolved.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, assertClientLinkedToResources(ctx, opts, params.clientId, resolved)];
                case 5:
                    _h.sent();
                    _h.label = 6;
                case 6:
                    effectiveScopes = __spreadArray([], params.requestedScopes, true);
                    _loop_1 = function (row) {
                        // FIXME(#11725): treat a stored [] as unset once [] is rejected on input.
                        if (row.allowedScopes === null || row.allowedScopes === undefined) {
                            return "continue";
                        }
                        var allowed = new Set(row.allowedScopes);
                        var intersection = effectiveScopes.filter(function (s) { return allowed.has(s); });
                        if (intersection.length === 0) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error: "invalid_scope",
                                error_description: "none of the requested scopes are allowed for resource ".concat(row.identifier),
                            });
                        }
                        effectiveScopes = intersection;
                    };
                    for (_a = 0, resolved_1 = resolved; _a < resolved_1.length; _a++) {
                        row = resolved_1[_a];
                        _loop_1(row);
                    }
                    accessTokenTtl = null;
                    refreshTokenTtl = null;
                    for (_b = 0, resolved_2 = resolved; _b < resolved_2.length; _b++) {
                        row = resolved_2[_b];
                        if (row.accessTokenTtl != null) {
                            accessTokenTtl =
                                accessTokenTtl === null
                                    ? row.accessTokenTtl
                                    : Math.min(accessTokenTtl, row.accessTokenTtl);
                        }
                        if (row.refreshTokenTtl != null) {
                            refreshTokenTtl =
                                refreshTokenTtl === null
                                    ? row.refreshTokenTtl
                                    : Math.min(refreshTokenTtl, row.refreshTokenTtl);
                        }
                    }
                    uniqueSigningAlgs = new Set();
                    uniqueSigningKids = new Set();
                    for (_c = 0, resolved_3 = resolved; _c < resolved_3.length; _c++) {
                        row = resolved_3[_c];
                        if (row.signingAlgorithm)
                            uniqueSigningAlgs.add(row.signingAlgorithm);
                        if (row.signingKeyId)
                            uniqueSigningKids.add(row.signingKeyId);
                    }
                    if (uniqueSigningAlgs.size > 1) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_request",
                            error_description: "multi-resource request has conflicting signingAlgorithm pins; a single JWS signature cannot satisfy multiple algorithms",
                        });
                    }
                    if (uniqueSigningKids.size > 1) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_request",
                            error_description: "multi-resource request has conflicting signingKeyId pins; a single JWS signature cannot satisfy multiple key ids",
                        });
                    }
                    signingAlgorithm = (_f = uniqueSigningAlgs.values().next().value) !== null && _f !== void 0 ? _f : null;
                    signingKeyId = (_g = uniqueSigningKids.values().next().value) !== null && _g !== void 0 ? _g : null;
                    mergedClaims = {};
                    for (_d = 0, resolved_4 = resolved; _d < resolved_4.length; _d++) {
                        row = resolved_4[_d];
                        if (row.customClaims && typeof row.customClaims === "object") {
                            Object.assign(mergedClaims, row.customClaims);
                        }
                    }
                    dpopBoundAccessTokensRequired = resolved.some(function (row) { return row.dpopBoundAccessTokensRequired === true; });
                    audienceIdentifiers = includesOpenid
                        ? __spreadArray(__spreadArray([], uniqueRequestedResources, true), [userInfoResourceIdentifier], false) : uniqueRequestedResources;
                    audClaim = __spreadArray([], new Set(audienceIdentifiers), true);
                    return [2 /*return*/, {
                            audienceClaim: audClaim.length === 1 ? audClaim[0] : audClaim,
                            accessTokenTtl: accessTokenTtl,
                            refreshTokenTtl: refreshTokenTtl,
                            signingAlgorithm: signingAlgorithm,
                            signingKeyId: signingKeyId,
                            rawCustomClaims: mergedClaims,
                            dpopBoundAccessTokensRequired: dpopBoundAccessTokensRequired,
                            effectiveScopes: effectiveScopes,
                        }];
            }
        });
    });
}
/**
 * Throws `invalid_target` if the client isn't linked to every resource via
 * the `oauthClientResource` join table. Issues one `findMany` per call.
 *
 * @internal
 */
function assertClientLinkedToResources(ctx, opts, clientId, resources) {
    return __awaiter(this, void 0, void 0, function () {
        var modelName, links, linkedSet, unlinked;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (resources.length === 0)
                        return [2 /*return*/];
                    modelName = (_c = (_b = (_a = opts.schema) === null || _a === void 0 ? void 0 : _a.oauthClientResource) === null || _b === void 0 ? void 0 : _b.modelName) !== null && _c !== void 0 ? _c : "oauthClientResource";
                    return [4 /*yield*/, ctx.context.adapter.findMany({
                            model: modelName,
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 1:
                    links = _e.sent();
                    linkedSet = new Set((_d = links === null || links === void 0 ? void 0 : links.map(function (l) { return l.resourceId; })) !== null && _d !== void 0 ? _d : []);
                    unlinked = resources.filter(function (resource) { return !linkedSet.has(resource.identifier); });
                    if (unlinked.length > 0) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_target",
                            error_description: "client ".concat(clientId, " is not linked to resource(s) ").concat(unlinked
                                .map(function (resource) { return resource.identifier; })
                                .join(", ")),
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Returns `true` when `clientId` is linked, via the `oauthClientResource` join
 * table, to at least one of `resourceIdentifiers`. Authorizes cross-client token
 * introspection (RFC 7662 §2.1/§4): a resource server may introspect a token
 * whose audience it serves, even when a different client issued the token.
 *
 * @internal
 */
function isClientLinkedToAnyResource(ctx, opts, clientId, resourceIdentifiers) {
    return __awaiter(this, void 0, void 0, function () {
        var modelName, links;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (resourceIdentifiers.length === 0)
                        return [2 /*return*/, false];
                    modelName = (_c = (_b = (_a = opts.schema) === null || _a === void 0 ? void 0 : _a.oauthClientResource) === null || _b === void 0 ? void 0 : _b.modelName) !== null && _c !== void 0 ? _c : "oauthClientResource";
                    return [4 /*yield*/, ctx.context.adapter.findMany({
                            model: modelName,
                            where: [
                                { field: "clientId", value: clientId },
                                { field: "resourceId", operator: "in", value: resourceIdentifiers },
                            ],
                            limit: 1,
                        })];
                case 1:
                    links = _e.sent();
                    return [2 /*return*/, ((_d = links === null || links === void 0 ? void 0 : links.length) !== null && _d !== void 0 ? _d : 0) > 0];
            }
        });
    });
}
/**
 * Merges `customClaims` from the existing rows of `resourceIdentifiers` in
 * order (later resources win on collision). Missing rows are skipped; disabled
 * rows are included, since an already-issued token keeps its claims until it
 * expires. Returned raw; `resolveAccessTokenClaims` strips reserved names.
 *
 * Unlike {@link resolveResourcePolicy}, this applies none of the new-issuance
 * gates (disabled, scope allowlist, client linkage), so it is the right way to
 * re-derive claims for an already-issued token at introspection.
 *
 * @internal
 */
function getResourceCustomClaims(ctx, opts, resourceIdentifiers) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, rowByIdentifier, merged, _i, resourceIdentifiers_1, identifier, row;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (resourceIdentifiers.length === 0)
                        return [2 /*return*/, {}];
                    return [4 /*yield*/, ctx.context.adapter.findMany({
                            model: (_c = (_b = (_a = opts.schema) === null || _a === void 0 ? void 0 : _a.oauthResource) === null || _b === void 0 ? void 0 : _b.modelName) !== null && _c !== void 0 ? _c : "oauthResource",
                            where: [
                                { field: "identifier", operator: "in", value: resourceIdentifiers },
                            ],
                        })];
                case 1:
                    rows = _d.sent();
                    rowByIdentifier = new Map(rows.map(function (row) { return [row.identifier, row]; }));
                    merged = {};
                    // Merge in the token's resource order so "later resource wins" still holds.
                    for (_i = 0, resourceIdentifiers_1 = resourceIdentifiers; _i < resourceIdentifiers_1.length; _i++) {
                        identifier = resourceIdentifiers_1[_i];
                        row = rowByIdentifier.get(identifier);
                        if ((row === null || row === void 0 ? void 0 : row.customClaims) && typeof row.customClaims === "object") {
                            Object.assign(merged, row.customClaims);
                        }
                    }
                    return [2 /*return*/, merged];
            }
        });
    });
}
/**
 * Resolves the effective {@link OAuthOptions.enforcePerClientResources} value.
 *
 * - Explicit `true | false` always wins (`source: "explicit"`).
 * - Otherwise resolve to `true` (`source: "default"`). RFC 8707 §3 per-client
 *   validation is the secure default.
 *
 * Deterministic and pure — safe to call on every validation pass.
 */
function resolveEnforcePerClientResources(opts) {
    if (opts.enforcePerClientResources !== undefined) {
        return { value: opts.enforcePerClientResources, source: "explicit" };
    }
    return { value: true, source: "default" };
}
/**
 * In-process cache of {@link OAuthResource} rows, keyed by `identifier`.
 *
 * Opt-in via {@link OAuthOptions.cachedResources} (same membership-Set pattern
 * as `cachedTrustedClients`). Resources outside the set are looked up from the
 * DB on every request — the safe default for deployments that edit rows
 * through external tooling.
 *
 * Module-scoped so admin CRUD handlers can invalidate from anywhere via
 * {@link invalidateResourceCache}.
 */
var resourceCache = new Map();
/**
 * Removes an entry from the resource cache. Called by admin CRUD handlers
 * after every write. Pass no argument to clear the entire cache.
 *
 * @internal
 */
function invalidateResourceCache(identifier) {
    if (identifier === undefined) {
        resourceCache.clear();
        return;
    }
    resourceCache.delete(identifier);
}
/**
 * Looks up an {@link OAuthResource} by `identifier`, consulting the in-process
 * cache when the identifier is in {@link OAuthOptions.cachedResources}.
 *
 * Triggers the lazy seed via {@link seedResourcesOnce} on first call — the
 * retry path when the startup seed failed (database unreachable, or
 * migrations run after plugin init). The seed is idempotent, so once one
 * call completes, later calls skip it.
 *
 * Returns a defensive copy so callers can't mutate cached state.
 *
 * @internal
 */
function getResource(ctx, opts, identifier) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, dbResource;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: 
                // TODO(#11725): merge the configured entry here instead of seeding rows.
                return [4 /*yield*/, seedResourcesOnce(ctx.context, opts)];
                case 1:
                    // TODO(#11725): merge the configured entry here instead of seeding rows.
                    _f.sent();
                    if ((_a = opts.cachedResources) === null || _a === void 0 ? void 0 : _a.has(identifier)) {
                        cached = resourceCache.get(identifier);
                        if (cached)
                            return [2 /*return*/, Object.assign({}, cached)];
                    }
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: (_d = (_c = (_b = opts.schema) === null || _b === void 0 ? void 0 : _b.oauthResource) === null || _c === void 0 ? void 0 : _c.modelName) !== null && _d !== void 0 ? _d : "oauthResource",
                            where: [{ field: "identifier", value: identifier }],
                        })];
                case 2:
                    dbResource = _f.sent();
                    if (dbResource && ((_e = opts.cachedResources) === null || _e === void 0 ? void 0 : _e.has(identifier))) {
                        resourceCache.set(identifier, Object.assign({}, dbResource));
                    }
                    return [2 /*return*/, dbResource];
            }
        });
    });
}
/**
 * Default `name` value when an input doesn't provide one. Mirrors what most
 * admin UIs would show.
 */
function defaultName(input) {
    var _a;
    return (_a = input.name) !== null && _a !== void 0 ? _a : input.identifier;
}
/**
 * Coerces seed-config `resources` entries — string or object form — into a
 * normalized list of {@link OAuthResourceInput}.
 *
 * @internal
 */
function collectResourceInputs(opts) {
    var _a;
    var inputs = [];
    if ((_a = opts.resources) === null || _a === void 0 ? void 0 : _a.length) {
        for (var _i = 0, _b = opts.resources; _i < _b.length; _i++) {
            var entry = _b[_i];
            inputs.push(typeof entry === "string" ? { identifier: entry } : entry);
        }
    }
    return inputs;
}
/**
 * Builds the row payload sent to the adapter for a seed insert. All policy
 * columns default to `null` (= inherit plugin default at issuance time)
 * when the input doesn't specify a value.
 */
function buildSeedRow(input, now) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return {
        identifier: input.identifier,
        name: defaultName(input),
        accessTokenTtl: (_a = input.accessTokenTtl) !== null && _a !== void 0 ? _a : null,
        refreshTokenTtl: (_b = input.refreshTokenTtl) !== null && _b !== void 0 ? _b : null,
        signingAlgorithm: (_c = input.signingAlgorithm) !== null && _c !== void 0 ? _c : null,
        signingKeyId: (_d = input.signingKeyId) !== null && _d !== void 0 ? _d : null,
        // FIXME(#11725): same null limit as buildResourceRow in
        // oauthResource/endpoints.ts.
        allowedScopes: (_e = input.allowedScopes) !== null && _e !== void 0 ? _e : null,
        customClaims: (_f = input.customClaims) !== null && _f !== void 0 ? _f : null,
        dpopBoundAccessTokensRequired: (_g = input.dpopBoundAccessTokensRequired) !== null && _g !== void 0 ? _g : false,
        disabled: (_h = input.disabled) !== null && _h !== void 0 ? _h : false,
        policyVersion: 1,
        metadata: (_j = input.metadata) !== null && _j !== void 0 ? _j : null,
        createdAt: now,
        updatedAt: now,
    };
}
/**
 * Builds the partial update payload when re-seeding an existing row.
 *
 * - `overwrite` mode replaces every policy column with the input value
 *   (omitted fields fall back to `null` to clear stale state).
 * - `merge` mode updates only fields present in the input — admin edits to
 *   other fields are preserved.
 */
function buildSeedUpdate(input, mode, now) {
    if (mode === "overwrite") {
        var row = buildSeedRow(input, now);
        // Don't overwrite identifier (it's the key we matched on) or createdAt
        // (preserves original insertion timestamp).
        var _identifier = row.identifier, _createdAt = row.createdAt, rest = __rest(row, ["identifier", "createdAt"]);
        return rest;
    }
    var update = { updatedAt: now };
    if (input.name !== undefined)
        update.name = input.name;
    if (input.accessTokenTtl !== undefined)
        update.accessTokenTtl = input.accessTokenTtl;
    if (input.refreshTokenTtl !== undefined)
        update.refreshTokenTtl = input.refreshTokenTtl;
    if (input.signingAlgorithm !== undefined)
        update.signingAlgorithm = input.signingAlgorithm;
    if (input.signingKeyId !== undefined)
        update.signingKeyId = input.signingKeyId;
    if (input.allowedScopes !== undefined)
        update.allowedScopes = input.allowedScopes;
    if (input.customClaims !== undefined)
        update.customClaims = input.customClaims;
    if (input.dpopBoundAccessTokensRequired !== undefined) {
        update.dpopBoundAccessTokensRequired = input.dpopBoundAccessTokensRequired;
    }
    if (input.disabled !== undefined)
        update.disabled = input.disabled;
    if (input.metadata !== undefined)
        update.metadata = input.metadata;
    return update;
}
// TODO(#11725): remove with startup seeding, together with
// logStartupSeedFailure and the seed state below.
/**
 * Pattern matched against adapter errors to detect the "table not yet
 * created" case — i.e. migrations or `auth generate` haven't run. Only
 * used to keep the expected startup seed failure quiet.
 *
 * Covers SQLite ("no such table"), Postgres ("relation X does not exist"),
 * MySQL ("Table X does not exist" / contracted form), and the Drizzle and
 * Prisma adapters' missing-model errors.
 */
// cspell:ignore-next-line doesn
var MISSING_TABLE_PATTERN = /no such table|relation.*does not exist|table.*does(?: not|n'?t) exist|model.*(?:does not exist|was not found in the schema)/i;
/**
 * Logs a failed startup seed. Missing tables are expected before migrations
 * and stay quiet; anything else is an error worth seeing.
 *
 * @internal
 */
function logStartupSeedFailure(ctx, error) {
    // Drizzle keeps the driver message on `cause`; its own message is the SQL.
    // The depth bound guards against a `cause` cycle.
    var missingTable = false;
    var current = error;
    for (var depth = 0; current && !missingTable && depth < 5; depth++) {
        missingTable = MISSING_TABLE_PATTERN.test(current instanceof Error ? current.message : String(current));
        current = current instanceof Error ? current.cause : undefined;
    }
    if (missingTable) {
        ctx.logger.debug("oauth-provider: oauthResource table not yet created; deferring resource seed to first access.");
        return;
    }
    ctx.logger.error("oauth-provider: could not seed `resources` at startup; retrying on first resource access.", error);
}
/**
 * Plugin options whose seed completed, per adapter. A module-level boolean would
 * let one Better Auth instance suppress seeding for every later instance in the
 * same process. Endpoint `AuthContext` objects are not guaranteed to be stable
 * across requests, so the adapter identifies the backing store, and the options
 * object separates instances that share an adapter but configure different
 * `resources`.
 */
var seededOptions = new WeakMap();
function getSeededOptions(ctx) {
    var adapterKey = ctx.adapter;
    var seeded = seededOptions.get(adapterKey);
    if (!seeded) {
        seeded = new WeakSet();
        seededOptions.set(adapterKey, seeded);
    }
    return seeded;
}
/**
 * Resets the lazy-seed state. Used by tests to force re-seeding between
 * cases — should not be called from production code.
 *
 * @internal
 */
function resetSeedStateForTests() {
    seededOptions = new WeakMap();
}
/**
 * Seeds `oauthResource` rows from plugin config.
 *
 * Behavior is controlled by {@link OAuthOptions.resourceSeedMode}:
 *
 * - `"insertOnly"` (default, safe): inserts rows whose `identifier` is not
 *   already present. Existing rows are untouched — admin edits via CRUD
 *   are never reverted on restart.
 * - `"merge"`: inserts missing rows; updates only specified fields for
 *   existing rows. Useful when config holds the "preferred defaults" but
 *   admins customize per-row.
 * - `"overwrite"`: inserts missing rows; replaces every policy column on
 *   existing rows with the config value (omitted fields → null). Use only
 *   when config is the single source of truth.
 *
 * Race-safety: the `identifier` column carries a UNIQUE constraint, so two
 * processes booting simultaneously can each attempt the insert — one wins,
 * the other re-reads the row and treats the failed insert as a no-op.
 *
 * Throws on storage errors, including a missing table. Callers go through
 * {@link seedResourcesOnce}, which stays incomplete after a failure so the
 * next resource access retries (e.g. after migrations run).
 *
 * Idempotent: safe to call multiple times.
 *
 * @internal
 */
function seedResources(ctx, opts, isComplete) {
    return __awaiter(this, void 0, void 0, function () {
        var inputs, mode, modelName, _i, inputs_1, rawInput, check, input, _, rest, where, existing, now, err_1, raced;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    inputs = collectResourceInputs(opts);
                    if (inputs.length === 0)
                        return [2 /*return*/];
                    mode = (_a = opts.resourceSeedMode) !== null && _a !== void 0 ? _a : "insertOnly";
                    modelName = (_d = (_c = (_b = opts.schema) === null || _b === void 0 ? void 0 : _b.oauthResource) === null || _c === void 0 ? void 0 : _c.modelName) !== null && _d !== void 0 ? _d : "oauthResource";
                    _i = 0, inputs_1 = inputs;
                    _e.label = 1;
                case 1:
                    if (!(_i < inputs_1.length)) return [3 /*break*/, 11];
                    rawInput = inputs_1[_i];
                    return [4 /*yield*/, checkIdentifier(opts, rawInput.identifier)];
                case 2:
                    check = _e.sent();
                    if (!check.ok) {
                        env_1.logger.warn("oauth-provider: skipping resource seed for ".concat(rawInput.identifier, " \u2014 ").concat(check.reason));
                        return [3 /*break*/, 10];
                    }
                    input = rawInput;
                    if (input.signingAlgorithm != null &&
                        !JWS_ALGORITHM_SET.has(input.signingAlgorithm)) {
                        env_1.logger.warn("oauth-provider: dropping unsupported signingAlgorithm \"".concat(input.signingAlgorithm, "\" for resource ").concat(input.identifier, " \u2014 must be one of ").concat(exports.JWS_ALGORITHMS.join(", "), ". Continuing without an algorithm override."));
                        _ = input.signingAlgorithm, rest = __rest(input, ["signingAlgorithm"]);
                        input = rest;
                    }
                    where = [{ field: "identifier", value: input.identifier }];
                    return [4 /*yield*/, ctx.adapter.findOne({
                            model: modelName,
                            where: where,
                        })];
                case 3:
                    existing = _e.sent();
                    now = new Date();
                    if (!!existing) return [3 /*break*/, 8];
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 6, , 8]);
                    return [4 /*yield*/, ctx.adapter.create({
                            model: modelName,
                            data: buildSeedRow(input, now),
                        })];
                case 5:
                    _e.sent();
                    return [3 /*break*/, 10];
                case 6:
                    err_1 = _e.sent();
                    return [4 /*yield*/, ctx.adapter
                            .findOne({ model: modelName, where: where })
                            .catch(function () { return null; })];
                case 7:
                    raced = _e.sent();
                    if (!raced)
                        throw err_1;
                    return [3 /*break*/, 8];
                case 8:
                    // Reached for existing rows, and for a row a concurrent boot inserted,
                    // so `merge` and `overwrite` still apply this config.
                    if (mode === "insertOnly")
                        return [3 /*break*/, 10];
                    // Skip once another seed in this process has finished, so a late write
                    // does not undo an edit made since then.
                    if (isComplete === null || isComplete === void 0 ? void 0 : isComplete())
                        return [2 /*return*/];
                    return [4 /*yield*/, ctx.adapter.update({
                            model: modelName,
                            where: where,
                            update: buildSeedUpdate(input, mode, now),
                        })];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11: return [2 /*return*/];
            }
        });
    });
}
/**
 * Idempotent wrapper around {@link seedResources}, called from plugin `init`
 * and from every resource lookup. Each call runs its own seed until one
 * completes, because on Workers a pending seed started by a request that has
 * ended never settles. The seed tolerates a row a concurrent call inserted.
 * A failure leaves the state incomplete, so the next call retries.
 *
 * @internal
 */
function seedResourcesOnce(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var seeded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seeded = getSeededOptions(ctx);
                    if (seeded.has(opts))
                        return [2 /*return*/];
                    return [4 /*yield*/, seedResources(ctx, opts, function () { return seeded.has(opts); })];
                case 1:
                    _a.sent();
                    seeded.add(opts);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Logs the resolved value of {@link OAuthOptions.enforcePerClientResources}
 * so deployment admins see which default applied at init. Separated from
 * {@link resolveEnforcePerClientResources} so the latter stays pure and
 * cheap to call from validation flow.
 *
 * @internal
 */
function logEnforcePerClientResourcesResolution(opts) {
    var resolved = resolveEnforcePerClientResources(opts);
    env_1.logger.info("oauth-provider: enforcePerClientResources resolved to ".concat(resolved.value, " (").concat(resolved.source, ")"));
}
