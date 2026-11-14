"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEVICE_CODE_GRANT_TYPE = void 0;
exports.oauthDeviceAuthorization = oauthDeviceAuthorization;
var error_1 = require("@better-auth/core/error");
var api_1 = require("better-auth/api");
var device_authorization_1 = require("better-auth/plugins/device-authorization");
var z = require("zod");
var extensions_1 = require("./extensions");
var resources_1 = require("./resources");
var token_1 = require("./token");
var zod_1 = require("./types/zod");
var utils_1 = require("./utils");
/**
 * RFC 8628 device authorization grant type. A registered OAuth client polls the
 * token endpoint with this `grant_type` to exchange an approved device code for
 * a first-class OAuth token set.
 */
exports.DEVICE_CODE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";
/**
 * Path of the device authorization request endpoint contributed by the
 * `device-authorization` plugin and advertised in provider discovery metadata.
 */
var DEVICE_AUTHORIZATION_PATH = "/device/code";
var deviceCodeResourceSchema = z.union([
    zod_1.ResourceUriSchema,
    z.array(zod_1.ResourceUriSchema).min(1),
    z.literal(""),
]);
var oauthDeviceRequestFields = {
    client_secret: z
        .string()
        .meta({ description: "OAuth client secret" })
        .optional(),
    client_assertion: z
        .string()
        .meta({ description: "OAuth client assertion" })
        .optional(),
    client_assertion_type: z
        .string()
        .meta({ description: "OAuth client assertion type" })
        .optional(),
    resource: deviceCodeResourceSchema
        .meta({
        description: "RFC 8707 resource indicator(s) to bind to this authorization request",
    })
        .optional(),
};
function tokenError(status, error, errorDescription) {
    throw new api_1.APIError(status, {
        error: error,
        error_description: errorDescription,
    });
}
function parseScopes(scope) {
    var normalized = scope === null || scope === void 0 ? void 0 : scope.trim();
    return normalized ? normalized.split(/\s+/) : [];
}
/**
 * Exchanges an approved RFC 8628 device code for an OAuth token set. Unlike the
 * device-authorization plugin's `/device/token` (which mints a first-party
 * session token), this issues a real OAuth token through the provider's shared
 * issuance: scoped, audience-bound, introspectable, with optional refresh and ID
 * tokens. The device-authorization plugin owns the record and runs the shared
 * polling and atomic-consumption state machine for this handler.
 */
function exchangeOAuthDeviceCode(input) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx, provider, body, deviceCode, authentication, _a, _b, client, scopes, claimedDeviceCode, _c, resources, confirmation, recordReplay, user;
        var _this = this;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    ctx = input.ctx, provider = input.provider;
                    body = ctx.body;
                    deviceCode = body === null || body === void 0 ? void 0 : body.device_code;
                    if (!deviceCode) {
                        tokenError("BAD_REQUEST", "invalid_request", "device_code is required");
                    }
                    return [4 /*yield*/, provider.authenticateClient({
                            requireCredentials: false,
                        })];
                case 1:
                    authentication = _e.sent();
                    return [4 /*yield*/, (0, device_authorization_1.redeemDeviceCode)({
                            ctx: ctx,
                            deviceCode: deviceCode,
                            authorizeRedemption: function (record) { return __awaiter(_this, void 0, void 0, function () {
                                var scopes;
                                return __generator(this, function (_a) {
                                    if (!record.oauthClientId) {
                                        tokenError("BAD_REQUEST", "invalid_grant", "invalid device code");
                                    }
                                    // Reject mismatched body credentials before scope validation so a stolen
                                    // code cannot disclose the scopes recorded for another client.
                                    if ((body === null || body === void 0 ? void 0 : body.client_id) && record.oauthClientId !== body.client_id) {
                                        tokenError("BAD_REQUEST", "invalid_grant", "Client ID mismatch");
                                    }
                                    scopes = parseScopes(record.scope);
                                    if (record.oauthClientId !== authentication.client.clientId) {
                                        tokenError("BAD_REQUEST", "invalid_grant", "Client ID mismatch");
                                    }
                                    (0, utils_1.validateClientScopes)(authentication.client, scopes);
                                    return [2 /*return*/, {
                                            ownershipWhere: {
                                                field: "oauthClientId",
                                                value: authentication.client.clientId,
                                            },
                                            context: __assign(__assign({}, authentication), { scopes: scopes }),
                                        }];
                                });
                            }); },
                            prepareRedemption: function (record, authorization) { return __awaiter(_this, void 0, void 0, function () {
                                var requestedResources, boundResources, boundResourceSet_1, resources, dpop;
                                var _this = this;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            requestedResources = (0, utils_1.toResourceList)(body === null || body === void 0 ? void 0 : body.resource);
                                            boundResources = (_a = record.resources) !== null && _a !== void 0 ? _a : undefined;
                                            if (requestedResources) {
                                                boundResourceSet_1 = new Set(boundResources);
                                                if (!boundResources ||
                                                    requestedResources.some(function (resource) { return !boundResourceSet_1.has(resource); })) {
                                                    tokenError("BAD_REQUEST", "invalid_target", "Requested resource was not authorized by the user");
                                                }
                                            }
                                            resources = requestedResources !== null && requestedResources !== void 0 ? requestedResources : boundResources;
                                            // Validate before the atomic claim: an invalid target must not consume a
                                            // one-time code that can still be exchanged with its authorized resources.
                                            return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(ctx, input.opts, {
                                                    resource: resources,
                                                    clientId: authorization.client.clientId,
                                                    requestedScopes: authorization.scopes,
                                                })];
                                        case 1:
                                            // Validate before the atomic claim: an invalid target must not consume a
                                            // one-time code that can still be exchanged with its authorized resources.
                                            _b.sent();
                                            // A sender constraint the client-authentication strategy proved takes
                                            // precedence over a DPoP proof, as in issuance. Otherwise check the
                                            // proof here too, so a rejected proof leaves the code for a retry.
                                            if (authorization.confirmation) {
                                                return [2 /*return*/, {
                                                        resources: resources,
                                                        confirmation: authorization.confirmation,
                                                        recordReplay: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                            return [2 /*return*/];
                                                        }); }); },
                                                    }];
                                            }
                                            return [4 /*yield*/, (0, token_1.checkDpopProofBeforeConsume)(ctx, input.opts, {
                                                    client: authorization.client,
                                                    scopes: authorization.scopes,
                                                    resources: resources,
                                                })];
                                        case 2:
                                            dpop = _b.sent();
                                            return [2 /*return*/, __assign({ resources: resources }, dpop)];
                                    }
                                });
                            }); },
                        })];
                case 2:
                    _a = _e.sent(), _b = _a.authorizationContext, client = _b.client, scopes = _b.scopes, claimedDeviceCode = _a.claimedDeviceCode, _c = _a.redemptionContext, resources = _c.resources, confirmation = _c.confirmation, recordReplay = _c.recordReplay, user = _a.user;
                    return [4 /*yield*/, recordReplay()];
                case 3:
                    _e.sent();
                    return [2 /*return*/, provider.issueTokens({
                            client: client,
                            scopes: scopes,
                            user: user,
                            resources: resources,
                            // Seed refresh tokens with every approved resource, not the narrowed poll.
                            originalResources: (_d = claimedDeviceCode.resources) !== null && _d !== void 0 ? _d : undefined,
                            confirmation: confirmation,
                        })];
            }
        });
    });
}
function buildOAuthDeviceGrant() {
    var _a;
    var _this = this;
    return {
        requestSchemaFields: oauthDeviceRequestFields,
        requestErrorCodes: ["invalid_target"],
        requestOpenAPIResponses: {
            401: {
                description: "Invalid Basic client authentication",
                headers: {
                    "WWW-Authenticate": {
                        description: "Basic client authentication challenge",
                        schema: { type: "string", example: "Basic" },
                    },
                },
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                error: {
                                    type: "string",
                                    enum: ["invalid_client"],
                                },
                                error_description: { type: "string" },
                            },
                            required: ["error"],
                        },
                    },
                },
            },
        },
        onRequestValidationError: function (issues) {
            if (issues.length > 0 &&
                issues.every(function (issue) { var _a; return ((_a = issue.path) === null || _a === void 0 ? void 0 : _a[0]) === "resource"; })) {
                tokenError("BAD_REQUEST", "invalid_target", "Invalid resource indicator");
            }
        },
        deviceCodeSchemaFields: {
            resources: {
                type: "string[]",
                required: false,
            },
            oauthClientId: {
                type: "string",
                required: false,
            },
        },
        grants: (_a = {},
            _a[exports.DEVICE_CODE_GRANT_TYPE] = exchangeOAuthDeviceCode,
            _a),
        metadata: function (metadataInput) { return ({
            device_authorization_endpoint: "".concat(metadataInput.ctx.context.baseURL).concat(DEVICE_AUTHORIZATION_PATH),
        }); },
        authorizeRequest: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var hasClientAuthentication, formResources, _c, parsedResource, provider, scopes, resource, api, oauthClient, _d, authenticated;
            var _e, _f;
            var ctx = _b.ctx, request = _b.request;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, (0, utils_1.normalizeClientAuthenticationParameters)(ctx.request, ((_e = ctx.body) !== null && _e !== void 0 ? _e : {}))];
                    case 1:
                        hasClientAuthentication = (_g.sent()).detected;
                        if (!ctx.request) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, resources_1.extractRepeatedResourceFromForm)(ctx.request)];
                    case 2:
                        _c = _g.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = undefined;
                        _g.label = 4;
                    case 4:
                        formResources = _c;
                        if (formResources) {
                            parsedResource = deviceCodeResourceSchema.safeParse(formResources.length === 1 ? formResources[0] : formResources);
                            if (!parsedResource.success) {
                                tokenError("BAD_REQUEST", "invalid_target", "Invalid resource indicator");
                            }
                            request.resource = parsedResource.data;
                        }
                        provider = (0, utils_1.getOAuthProviderPlugin)(ctx.context);
                        if (!provider)
                            return [2 /*return*/];
                        scopes = parseScopes(request.scope);
                        if (request.scope !== undefined) {
                            request.scope = scopes.join(" ");
                        }
                        resource = request.resource === "" ? undefined : request.resource;
                        api = (0, token_1.getOAuthProviderApi)(ctx, provider.options, exports.DEVICE_CODE_GRANT_TYPE);
                        if (!request.client_id && !hasClientAuthentication) {
                            tokenError("BAD_REQUEST", "invalid_request", "client_id is required");
                        }
                        if (!request.client_id) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, utils_1.getClient)(ctx, provider.options, request.client_id)];
                    case 5:
                        _d = _g.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _d = undefined;
                        _g.label = 7;
                    case 7:
                        oauthClient = _d;
                        // Requests from unknown ids remain in the standalone session flow only
                        // when the caller did not also present OAuth client credentials.
                        if (request.client_id && !oauthClient && !hasClientAuthentication)
                            return [2 /*return*/];
                        return [4 /*yield*/, api.authenticateClient({
                                scopes: scopes,
                                requireCredentials: false,
                            })];
                    case 8:
                        authenticated = _g.sent();
                        if (request.client_id && authenticated.clientId !== request.client_id) {
                            tokenError("BAD_REQUEST", "invalid_client", "Client ID mismatch");
                        }
                        return [4 /*yield*/, (0, resources_1.resolveResourcePolicy)(ctx, provider.options, {
                                resource: resource,
                                clientId: authenticated.clientId,
                                requestedScopes: scopes,
                            })];
                    case 9:
                        _g.sent();
                        return [2 /*return*/, {
                                clientId: authenticated.clientId,
                                deviceCodeFields: {
                                    oauthClientId: authenticated.clientId,
                                    resources: (_f = (0, utils_1.toResourceList)(resource)) !== null && _f !== void 0 ? _f : null,
                                },
                            }];
                }
            });
        }); },
        assertSessionRedemption: function (_a) {
            var deviceCode = _a.deviceCode;
            if (typeof deviceCode.oauthClientId !== "string")
                return;
            throw new api_1.APIError("BAD_REQUEST", {
                error: "invalid_grant",
                error_description: "This device code must be exchanged at the OAuth token endpoint (/oauth2/token).",
            });
        },
        getVerificationContext: function (deviceCode) {
            if (typeof deviceCode.oauthClientId !== "string")
                return;
            var resources = deviceCode.resources;
            if (!Array.isArray(resources) ||
                !resources.every(function (resource) { return typeof resource === "string"; })) {
                return;
            }
            return { resource: (0, utils_1.toAudienceClaim)(resources) };
        },
        verificationOpenAPIProperties: {
            resource: {
                oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                ],
                description: "The requested resource indicators, returned only to the authenticated user who owns this request",
            },
        },
    };
}
/**
 * Enables the {@link https://datatracker.ietf.org/doc/html/rfc8628 RFC 8628}
 * device authorization grant for OAuth Provider. Device Authorization owns
 * code creation and user approval; OAuth Provider owns client validation and
 * token issuance.
 *
 * Pair this plugin with `oauthProvider()` or `mcp()`. First-party device login
 * continues to use `deviceAuthorization()` and `/device/token` instead.
 *
 * @example
 * ```ts
 * const auth = betterAuth({
 *   plugins: [
 *     oauthProvider({ ... }),
 *     oauthDeviceAuthorization(),
 *   ],
 * });
 * ```
 */
function oauthDeviceAuthorization(options) {
    if (options === void 0) { options = {}; }
    var grant = buildOAuthDeviceGrant();
    var plugin = (0, device_authorization_1.deviceAuthorization)(__assign(__assign({}, options), { grant: grant }));
    return __assign(__assign({}, plugin), { init: function (ctx) {
            var _a, _b;
            var deviceAuthorizationPluginCount = (_b = (_a = ctx.options.plugins) === null || _a === void 0 ? void 0 : _a.filter(function (configuredPlugin) { return configuredPlugin.id === "device-authorization"; }).length) !== null && _b !== void 0 ? _b : 0;
            if (deviceAuthorizationPluginCount > 1) {
                throw new error_1.BetterAuthError("oauthDeviceAuthorization() cannot be combined with another Device Authorization plugin.");
            }
            if (!ctx.getPlugin("oauth-provider")) {
                throw new error_1.BetterAuthError("oauthDeviceAuthorization() requires oauthProvider() or mcp().");
            }
            (0, extensions_1.extendOAuthProvider)(ctx, grant);
        } });
}
