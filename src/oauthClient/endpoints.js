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
exports.getClientEndpoint = getClientEndpoint;
exports.getClientPublicEndpoint = getClientPublicEndpoint;
exports.getClientsEndpoint = getClientsEndpoint;
exports.deleteClientEndpoint = deleteClientEndpoint;
exports.updateClientEndpoint = updateClientEndpoint;
exports.rotateClientSecretEndpoint = rotateClientSecretEndpoint;
exports.rotateClientKeysEndpoint = rotateClientKeysEndpoint;
var api_1 = require("better-auth/api");
var crypto_1 = require("better-auth/crypto");
var client_jwks_1 = require("../client-jwks");
var dpop_1 = require("../dpop");
var register_1 = require("../register");
var utils_1 = require("../utils");
var client_assertion_1 = require("../utils/client-assertion");
var client_credentials_1 = require("./client-credentials");
var privileges_1 = require("./privileges");
function getClientEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, client, _a, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _b.sent();
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "read", ctx.query.client_id)];
                case 2:
                    _b.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, ctx.query.client_id)];
                case 3:
                    client = _b.sent();
                    if (!client) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "client not found",
                            error: "not_found",
                        });
                    }
                    if (!client.userId) return [3 /*break*/, 4];
                    if (client.userId !== session.user.id)
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [3 /*break*/, 7];
                case 4:
                    if (!(client.referenceId && opts.clientReference)) return [3 /*break*/, 6];
                    _a = client.referenceId;
                    return [4 /*yield*/, opts.clientReference(session)];
                case 5:
                    if (_a !== (_b.sent()))
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [3 /*break*/, 7];
                case 6: throw new api_1.APIError("UNAUTHORIZED");
                case 7:
                    res = (0, register_1.schemaToOAuth)(client);
                    res.client_secret = undefined;
                    return [2 /*return*/, res];
            }
        });
    });
}
/**
 * Provides public client fields for any logged-in user.
 * This is commonly used to display information on login flow pages.
 */
function getClientPublicEndpoint(ctx, opts, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var client, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, clientId)];
                case 1:
                    client = _a.sent();
                    if (!client) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "client not found",
                            error: "not_found",
                        });
                    }
                    if (client.disabled) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "client not found",
                            error: "not_found",
                        });
                    }
                    res = (0, register_1.schemaToOAuth)({
                        clientId: client.clientId,
                        name: client.name,
                        uri: client.uri,
                        contacts: client.contacts,
                        icon: client.icon,
                        tos: client.tos,
                        policy: client.policy,
                    });
                    return [2 /*return*/, res];
            }
        });
    });
}
function getClientsEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, referenceId, dbClients, dbClients;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _b.sent();
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "list")];
                case 2:
                    _b.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [4 /*yield*/, ((_a = opts.clientReference) === null || _a === void 0 ? void 0 : _a.call(opts, session))];
                case 3:
                    referenceId = _b.sent();
                    if (!referenceId) return [3 /*break*/, 5];
                    return [4 /*yield*/, ctx.context.adapter
                            .findMany({
                            model: "oauthClient",
                            where: [{ field: "referenceId", value: referenceId }],
                        })
                            .then(function (res) {
                            if (!res)
                                return null;
                            return res.map(function (v) {
                                var res = (0, register_1.schemaToOAuth)(v);
                                res.client_secret = undefined;
                                return res;
                            });
                        })];
                case 4:
                    dbClients = _b.sent();
                    return [2 /*return*/, dbClients];
                case 5:
                    if (!session.user.id) return [3 /*break*/, 7];
                    return [4 /*yield*/, ctx.context.adapter
                            .findMany({
                            model: "oauthClient",
                            where: [{ field: "userId", value: session.user.id }],
                        })
                            .then(function (res) {
                            if (!res)
                                return null;
                            return res.map(function (v) {
                                var res = (0, register_1.schemaToOAuth)(v);
                                res.client_secret = undefined;
                                return res;
                            });
                        })];
                case 6:
                    dbClients = _b.sent();
                    return [2 /*return*/, dbClients];
                case 7: throw new api_1.APIError("BAD_REQUEST", {
                    message: "either user_id or reference_id must be provided",
                });
            }
        });
    });
}
function deleteClientEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, clientId, client, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _b.sent();
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "delete", ctx.body.client_id)];
                case 2:
                    _b.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    clientId = ctx.body.client_id;
                    (0, utils_1.assertNotTrustedClient)(opts, clientId);
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, clientId)];
                case 3:
                    client = _b.sent();
                    if (!client) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "client not found",
                            error: "not_found",
                        });
                    }
                    if (!client.userId) return [3 /*break*/, 4];
                    if (client.userId !== session.user.id)
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [3 /*break*/, 7];
                case 4:
                    if (!(client.referenceId && opts.clientReference)) return [3 /*break*/, 6];
                    _a = client.referenceId;
                    return [4 /*yield*/, opts.clientReference(session)];
                case 5:
                    if (_a !== (_b.sent()))
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [3 /*break*/, 7];
                case 6: throw new api_1.APIError("UNAUTHORIZED");
                case 7: return [4 /*yield*/, ctx.context.adapter.delete({
                        model: "oauthClient",
                        where: [
                            {
                                field: "clientId",
                                value: clientId,
                            },
                        ],
                    })];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateClientEndpoint(ctx, opts, settings) {
    return __awaiter(this, void 0, void 0, function () {
        var session, clientId, client, _a, rawClientCredentialsScopes, updates, ownsClient, _b, _c, _d, isCrossOwnerScopeConfiguration, res_1, finalGrantTypes, finalTokenEndpointAuthMethod, clientCredentialsScopes, schemaUpdates, rawSecret, _e, updatedClient, res;
        var _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _m.sent();
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "update", ctx.body.client_id)];
                case 2:
                    _m.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    clientId = ctx.body.client_id;
                    (0, utils_1.assertNotTrustedClient)(opts, clientId);
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, clientId)];
                case 3:
                    client = _m.sent();
                    if (!client) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "client not found",
                            error: "not_found",
                        });
                    }
                    _a = ctx.body.update, rawClientCredentialsScopes = _a.client_credentials_scopes, updates = __rest(_a, ["client_credentials_scopes"]);
                    if (!client.userId) return [3 /*break*/, 4];
                    _b = client.userId === session.user.id;
                    return [3 /*break*/, 8];
                case 4:
                    if (!(client.referenceId && opts.clientReference)) return [3 /*break*/, 6];
                    _d = client.referenceId;
                    return [4 /*yield*/, opts.clientReference(session)];
                case 5:
                    _c = _d === (_m.sent());
                    return [3 /*break*/, 7];
                case 6:
                    _c = false;
                    _m.label = 7;
                case 7:
                    _b = _c;
                    _m.label = 8;
                case 8:
                    ownsClient = _b;
                    isCrossOwnerScopeConfiguration = !ownsClient &&
                        (settings === null || settings === void 0 ? void 0 : settings.admin) &&
                        rawClientCredentialsScopes !== undefined &&
                        Object.keys(updates).length === 0;
                    if (!ownsClient && !isCrossOwnerScopeConfiguration) {
                        throw new api_1.APIError("UNAUTHORIZED");
                    }
                    if (!isCrossOwnerScopeConfiguration) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "configure-client-credentials-scopes", clientId)];
                case 9:
                    _m.sent();
                    _m.label = 10;
                case 10:
                    if (Object.keys(updates).length === 0 &&
                        rawClientCredentialsScopes === undefined) {
                        res_1 = (0, register_1.schemaToOAuth)(client);
                        res_1.client_secret = undefined;
                        if (settings === null || settings === void 0 ? void 0 : settings.admin) {
                            return [2 /*return*/, __assign(__assign({}, res_1), { client_credentials_scopes: __spreadArray([], ((_f = client.clientCredentialsScopes) !== null && _f !== void 0 ? _f : []), true) })];
                        }
                        return [2 /*return*/, res_1];
                    }
                    finalGrantTypes = ((_h = (_g = updates.grant_types) !== null && _g !== void 0 ? _g : client.grantTypes) !== null && _h !== void 0 ? _h : []);
                    finalTokenEndpointAuthMethod = (_j = updates.token_endpoint_auth_method) !== null && _j !== void 0 ? _j : client.tokenEndpointAuthMethod;
                    clientCredentialsScopes = rawClientCredentialsScopes === undefined
                        ? undefined
                        : (0, client_credentials_1.normalizeClientCredentialsScopes)(rawClientCredentialsScopes);
                    if (!(clientCredentialsScopes !== undefined)) return [3 /*break*/, 12];
                    (0, client_credentials_1.validateClientCredentialsScopes)(clientCredentialsScopes, finalGrantTypes, finalTokenEndpointAuthMethod, opts);
                    if (!(clientCredentialsScopes.length > 0 && !isCrossOwnerScopeConfiguration)) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "configure-client-credentials-scopes", clientId)];
                case 11:
                    _m.sent();
                    _m.label = 12;
                case 12: return [4 /*yield*/, (0, register_1.checkOAuthClient)(__assign(__assign({}, (0, register_1.schemaToOAuth)(client)), updates), opts, {
                        ctx: ctx,
                    })];
                case 13:
                    _m.sent();
                    schemaUpdates = __assign({}, (0, register_1.oauthToSchema)(updates));
                    if (!finalGrantTypes.includes("client_credentials") ||
                        finalTokenEndpointAuthMethod === "none") {
                        schemaUpdates.clientCredentialsScopes = [];
                    }
                    else if (clientCredentialsScopes !== undefined) {
                        schemaUpdates.clientCredentialsScopes = clientCredentialsScopes;
                    }
                    if (!updates.token_endpoint_auth_method) return [3 /*break*/, 16];
                    if (!(updates.token_endpoint_auth_method === "private_key_jwt")) return [3 /*break*/, 14];
                    schemaUpdates.clientSecret = null;
                    return [3 /*break*/, 16];
                case 14:
                    schemaUpdates.jwks = null;
                    schemaUpdates.jwksUri = null;
                    if (!!schemaUpdates.clientSecret) return [3 /*break*/, 16];
                    rawSecret = ((_k = opts.generateClientSecret) === null || _k === void 0 ? void 0 : _k.call(opts)) ||
                        (0, crypto_1.generateRandomString)(32, "a-z", "A-Z");
                    _e = schemaUpdates;
                    return [4 /*yield*/, (0, utils_1.storeClientSecret)(ctx, opts, rawSecret)];
                case 15:
                    _e.clientSecret = _m.sent();
                    _m.label = 16;
                case 16: return [4 /*yield*/, ctx.context.adapter.update({
                        model: "oauthClient",
                        where: [
                            {
                                field: "clientId",
                                value: clientId,
                            },
                        ],
                        update: __assign(__assign({}, schemaUpdates), { updatedAt: new Date(Math.floor(Date.now() / 1000) * 1000) }),
                    })];
                case 17:
                    updatedClient = _m.sent();
                    if (!updatedClient) {
                        throw new api_1.APIError("INTERNAL_SERVER_ERROR", {
                            error_description: "unable to update client",
                            error: "invalid_client",
                        });
                    }
                    res = (0, register_1.schemaToOAuth)(updatedClient);
                    res.client_secret = undefined;
                    if (settings === null || settings === void 0 ? void 0 : settings.admin) {
                        return [2 /*return*/, __assign(__assign({}, res), { client_credentials_scopes: __spreadArray([], ((_l = updatedClient.clientCredentialsScopes) !== null && _l !== void 0 ? _l : []), true) })];
                    }
                    return [2 /*return*/, res];
            }
        });
    });
}
function rotateClientSecretEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, clientId, client, _a, clientSecret, storedClientSecret, _b, updatedClient;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _f.sent();
                    return [4 /*yield*/, (0, privileges_1.assertClientPrivileges)(ctx, session, opts, "rotate", ctx.body.client_id)];
                case 2:
                    _f.sent();
                    if (!session)
                        throw new api_1.APIError("UNAUTHORIZED");
                    clientId = ctx.body.client_id;
                    (0, utils_1.assertNotTrustedClient)(opts, clientId);
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, clientId)];
                case 3:
                    client = _f.sent();
                    if (!client) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error_description: "client not found",
                            error: "not_found",
                        });
                    }
                    if (!client.userId) return [3 /*break*/, 4];
                    if (client.userId !== session.user.id)
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [3 /*break*/, 7];
                case 4:
                    if (!(client.referenceId && opts.clientReference)) return [3 /*break*/, 6];
                    _a = client.referenceId;
                    return [4 /*yield*/, opts.clientReference(session)];
                case 5:
                    if (_a !== (_f.sent()))
                        throw new api_1.APIError("UNAUTHORIZED");
                    return [3 /*break*/, 7];
                case 6: throw new api_1.APIError("UNAUTHORIZED");
                case 7:
                    if (client.tokenEndpointAuthMethod === "none" || !client.clientSecret) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "secret rotation is only available for clients using client_secret authentication",
                            error: "invalid_client",
                        });
                    }
                    clientSecret = ((_c = opts.generateClientSecret) === null || _c === void 0 ? void 0 : _c.call(opts)) || (0, crypto_1.generateRandomString)(32, "a-z", "A-Z");
                    if (!clientSecret) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, utils_1.storeClientSecret)(ctx, opts, clientSecret)];
                case 8:
                    _b = _f.sent();
                    return [3 /*break*/, 10];
                case 9:
                    _b = undefined;
                    _f.label = 10;
                case 10:
                    storedClientSecret = _b;
                    return [4 /*yield*/, ctx.context.adapter.update({
                            model: "oauthClient",
                            where: [
                                {
                                    field: "clientId",
                                    value: clientId,
                                },
                            ],
                            update: {
                                clientSecret: storedClientSecret,
                                updatedAt: new Date(Math.floor(Date.now() / 1000) * 1000),
                            },
                        })];
                case 11:
                    updatedClient = _f.sent();
                    if (!updatedClient) {
                        throw new api_1.APIError("INTERNAL_SERVER_ERROR", {
                            error_description: "unable to update client",
                            error: "invalid_client",
                        });
                    }
                    return [2 /*return*/, (0, register_1.schemaToOAuth)(__assign(__assign({}, updatedClient), { clientSecret: ((_e = (_d = opts.prefix) === null || _d === void 0 ? void 0 : _d.clientSecret) !== null && _e !== void 0 ? _e : "") + clientSecret }))];
            }
        });
    });
}
/**
 * The write is guarded on the exact key set the assertion was verified against.
 * A concurrent rotation changes that value, so the stale request loses instead
 * of overwriting a newer key set.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7523#section-3
 */
function rotateClientKeysEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var body, client, updated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!opts.allowClientKeyRotation) {
                        throw new api_1.APIError("FORBIDDEN", {
                            error: "access_denied",
                            error_description: "Client key rotation is disabled",
                        });
                    }
                    body = ctx.body;
                    (0, client_jwks_1.assertValidClientJwks)(body.jwks);
                    return [4 /*yield*/, (0, client_assertion_1.verifyClientAssertion)(ctx, opts, body.client_assertion, body.client_assertion_type, undefined, 
                        // Without the request, so the audience stays the fixed endpoint path; this
                        // still drops a trailing slash from `baseURL`.
                        (0, dpop_1.getEndpointUrl)({ context: ctx.context, request: undefined }, "/oauth2/client/rotate-keys"), {
                            endpointAudienceOnly: true,
                            assertClient: function (candidate) { return assertRotatable(opts, candidate); },
                        })];
                case 1:
                    client = (_a.sent()).client;
                    return [4 /*yield*/, ctx.context.adapter.incrementOne({
                            model: "oauthClient",
                            where: [
                                { field: "clientId", value: client.clientId },
                                { field: "jwks", value: client.jwks },
                            ],
                            increment: {},
                            set: {
                                jwks: JSON.stringify(body.jwks),
                                updatedAt: new Date(),
                            },
                        })];
                case 2:
                    updated = _a.sent();
                    if (!updated) {
                        throw new api_1.APIError("CONFLICT", {
                            error: "invalid_request",
                            error_description: "client keys changed while rotating; retry with a fresh client assertion",
                        });
                    }
                    return [2 /*return*/, { client_id: client.clientId, jwks: body.jwks }];
            }
        });
    });
}
function assertRotatable(opts, client) {
    (0, utils_1.assertNotTrustedClient)(opts, client.clientId);
    if (client.clientDiscoveryId || client.jwksUri || !client.jwks) {
        throw new api_1.APIError("BAD_REQUEST", {
            error: "invalid_client",
            error_description: "client keys are not stored inline; rotate them where the client publishes them",
        });
    }
}
