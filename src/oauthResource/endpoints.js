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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResourceEndpoint = createResourceEndpoint;
exports.listResourcesEndpoint = listResourcesEndpoint;
exports.getResourceByIdentifierEndpoint = getResourceByIdentifierEndpoint;
exports.updateResourceEndpoint = updateResourceEndpoint;
exports.deleteResourceEndpoint = deleteResourceEndpoint;
exports.linkClientResourceEndpoint = linkClientResourceEndpoint;
exports.unlinkClientResourceEndpoint = unlinkClientResourceEndpoint;
var api_1 = require("better-auth/api");
var resources_1 = require("../resources");
var privileges_1 = require("./privileges");
var resourceModel = function (opts) { var _a, _b, _c; return (_c = (_b = (_a = opts.schema) === null || _a === void 0 ? void 0 : _a.oauthResource) === null || _b === void 0 ? void 0 : _b.modelName) !== null && _c !== void 0 ? _c : "oauthResource"; };
var linkModel = function (opts) { var _a, _b, _c; return (_c = (_b = (_a = opts.schema) === null || _a === void 0 ? void 0 : _a.oauthClientResource) === null || _b === void 0 ? void 0 : _b.modelName) !== null && _c !== void 0 ? _c : "oauthClientResource"; };
var clientModel = function (opts) { var _a, _b, _c; return (_c = (_b = (_a = opts.schema) === null || _a === void 0 ? void 0 : _a.oauthClient) === null || _b === void 0 ? void 0 : _b.modelName) !== null && _c !== void 0 ? _c : "oauthClient"; };
/**
 * Decode a URL path-segment parameter.
 *
 * better-call's router (better-call@1.3.5) does NOT decode path params —
 * `tryDecode` is wired into cookie parsing only. So a raw HTTP caller hitting
 * `/admin/oauth2/resources/https%3A%2F%2Fapi.example.com` lands here with
 * `ctx.params.identifier === "https%3A%2F%2Fapi.example.com"`, which never
 * matches the stored `https://api.example.com` row. Decode every path
 * segment that holds a URI-valued identifier so the admin handlers behave
 * identically to in-process `auth.api.*` calls (which pass already-decoded
 * JS strings).
 *
 * Falls back to the raw string when decode fails so a malformed identifier
 * surfaces as a clean NOT_FOUND from the row lookup rather than a 500.
 *
 * @internal
 */
function decodePathParam(value) {
    try {
        return decodeURIComponent(value);
    }
    catch (_a) {
        return value;
    }
}
// `validateIdentifier` is shared with the seed path — see
// {@link assertIdentifierValid} in `../resources.ts`.
/**
 * Builds the create-payload from a normalized input. Fills in defaults
 * for the fields seedResources uses so the admin-CRUD and seed paths
 * write identical rows.
 *
 * @internal
 */
function buildResourceRow(input, now) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return {
        identifier: input.identifier,
        name: (_a = input.name) !== null && _a !== void 0 ? _a : input.identifier,
        accessTokenTtl: (_b = input.accessTokenTtl) !== null && _b !== void 0 ? _b : null,
        refreshTokenTtl: (_c = input.refreshTokenTtl) !== null && _c !== void 0 ? _c : null,
        signingAlgorithm: (_d = input.signingAlgorithm) !== null && _d !== void 0 ? _d : null,
        signingKeyId: (_e = input.signingKeyId) !== null && _e !== void 0 ? _e : null,
        // FIXME(#11725): Prisma list columns reject null and read a stored
        // NULL back as [], so "no restriction" cannot round-trip there.
        allowedScopes: (_f = input.allowedScopes) !== null && _f !== void 0 ? _f : null,
        customClaims: (_g = input.customClaims) !== null && _g !== void 0 ? _g : null,
        dpopBoundAccessTokensRequired: (_h = input.dpopBoundAccessTokensRequired) !== null && _h !== void 0 ? _h : false,
        disabled: (_j = input.disabled) !== null && _j !== void 0 ? _j : false,
        policyVersion: 1,
        metadata: (_k = input.metadata) !== null && _k !== void 0 ? _k : null,
        createdAt: now,
        updatedAt: now,
    };
}
function createResourceEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, input, now, created, err_1, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    return [4 /*yield*/, (0, privileges_1.assertResourcePrivileges)(ctx, session, opts, "create")];
                case 2:
                    _a.sent();
                    input = ctx.body;
                    if (!(input === null || input === void 0 ? void 0 : input.identifier)) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_request",
                            error_description: "identifier is required",
                        });
                    }
                    return [4 /*yield*/, (0, resources_1.assertIdentifierValid)(opts, input.identifier)];
                case 3:
                    _a.sent();
                    now = new Date();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, ctx.context.adapter.create({
                            model: resourceModel(opts),
                            data: buildResourceRow(input, now),
                        })];
                case 5:
                    created = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    message = err_1 instanceof Error ? err_1.message : String(err_1);
                    if (/unique|duplicate|UNIQUE/i.test(message)) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_request",
                            error_description: "resource ".concat(input.identifier, " already exists"),
                        });
                    }
                    throw err_1;
                case 7:
                    if (!created) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error: "invalid_request",
                            error_description: "resource ".concat(input.identifier, " could not be created"),
                        });
                    }
                    (0, resources_1.invalidateResourceCache)(created.identifier);
                    return [2 /*return*/, ctx.json(created, { status: 201 })];
            }
        });
    });
}
function listResourcesEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    return [4 /*yield*/, (0, privileges_1.assertResourcePrivileges)(ctx, session, opts, "list")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ctx.context.adapter.findMany({
                            model: resourceModel(opts),
                        })];
                case 3:
                    rows = _a.sent();
                    return [2 /*return*/, ctx.json(rows !== null && rows !== void 0 ? rows : [])];
            }
        });
    });
}
function getResourceByIdentifierEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var identifier, session, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = decodePathParam(ctx.params.identifier);
                    return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    return [4 /*yield*/, (0, privileges_1.assertResourcePrivileges)(ctx, session, opts, "read", identifier)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: resourceModel(opts),
                            where: [{ field: "identifier", value: identifier }],
                        })];
                case 3:
                    row = _a.sent();
                    if (!row) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error: "not_found",
                            error_description: "resource ".concat(identifier, " not found"),
                        });
                    }
                    return [2 /*return*/, ctx.json(row)];
            }
        });
    });
}
function updateResourceEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var identifier, session, existing, update, allowed, _i, allowed_1, key, refreshed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = decodePathParam(ctx.params.identifier);
                    return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    return [4 /*yield*/, (0, privileges_1.assertResourcePrivileges)(ctx, session, opts, "update", identifier)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: resourceModel(opts),
                            where: [{ field: "identifier", value: identifier }],
                        })];
                case 3:
                    existing = _a.sent();
                    if (!existing) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error: "not_found",
                            error_description: "resource ".concat(identifier, " not found"),
                        });
                    }
                    update = { updatedAt: new Date() };
                    allowed = [
                        "name",
                        "accessTokenTtl",
                        "refreshTokenTtl",
                        "signingAlgorithm",
                        "signingKeyId",
                        "allowedScopes",
                        "customClaims",
                        "dpopBoundAccessTokensRequired",
                        "disabled",
                        "metadata",
                    ];
                    for (_i = 0, allowed_1 = allowed; _i < allowed_1.length; _i++) {
                        key = allowed_1[_i];
                        if (Object.prototype.hasOwnProperty.call(ctx.body, key)) {
                            update[key] = ctx.body[key];
                        }
                    }
                    return [4 /*yield*/, ctx.context.adapter.update({
                            model: resourceModel(opts),
                            where: [{ field: "identifier", value: identifier }],
                            update: update,
                        })];
                case 4:
                    _a.sent();
                    (0, resources_1.invalidateResourceCache)(identifier);
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: resourceModel(opts),
                            where: [{ field: "identifier", value: identifier }],
                        })];
                case 5:
                    refreshed = _a.sent();
                    if (!refreshed) {
                        // Row vanished between the update and the re-read (concurrent delete).
                        // Surface a clean 404 instead of a null body.
                        throw new api_1.APIError("NOT_FOUND", {
                            error: "not_found",
                            error_description: "resource ".concat(identifier, " not found"),
                        });
                    }
                    return [2 /*return*/, ctx.json(refreshed)];
            }
        });
    });
}
function deleteResourceEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var identifier, session, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    identifier = decodePathParam(ctx.params.identifier);
                    return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    return [4 /*yield*/, (0, privileges_1.assertResourcePrivileges)(ctx, session, opts, "delete", identifier)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: resourceModel(opts),
                            where: [{ field: "identifier", value: identifier }],
                        })];
                case 3:
                    existing = _a.sent();
                    if (!existing) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error: "not_found",
                            error_description: "resource ".concat(identifier, " not found"),
                        });
                    }
                    return [4 /*yield*/, ctx.context.adapter.delete({
                            model: resourceModel(opts),
                            where: [{ field: "identifier", value: identifier }],
                        })];
                case 4:
                    _a.sent();
                    // Hard-invalidate the cache on delete — RFC open question §1 says
                    // existing tokens for a deleted resource should be cascade-rejected on
                    // next verify, which depends on `getResource` returning null promptly.
                    (0, resources_1.invalidateResourceCache)(identifier);
                    return [2 /*return*/, ctx.json({ deleted: true })];
            }
        });
    });
}
/**
 * Link a client to a resource.
 *
 * Route: `POST /admin/oauth2/resources/:identifier/clients/:client_id`.
 * Path params carry the identifiers (RESTful linkage) — no body required.
 * Used by admins when {@link OAuthOptions.enforcePerClientResources} is on.
 */
function linkClientResourceEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, resourceId, clientId, resource, client, err_2, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    resourceId = decodePathParam(ctx.params.identifier);
                    clientId = decodePathParam(ctx.params.client_id);
                    return [4 /*yield*/, (0, privileges_1.assertResourcePrivileges)(ctx, session, opts, "link", resourceId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: resourceModel(opts),
                            where: [{ field: "identifier", value: resourceId }],
                        })];
                case 3:
                    resource = _a.sent();
                    if (!resource) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error: "not_found",
                            error_description: "resource ".concat(resourceId, " not found"),
                        });
                    }
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: clientModel(opts),
                            where: [{ field: "clientId", value: clientId }],
                        })];
                case 4:
                    client = _a.sent();
                    if (!client) {
                        throw new api_1.APIError("NOT_FOUND", {
                            error: "not_found",
                            error_description: "client ".concat(clientId, " not found"),
                        });
                    }
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, ctx.context.adapter.create({
                            model: linkModel(opts),
                            data: {
                                clientId: clientId,
                                resourceId: resourceId,
                                createdAt: new Date(),
                            },
                        })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    message = err_2 instanceof Error ? err_2.message : String(err_2);
                    if (/unique|duplicate|UNIQUE/i.test(message)) {
                        return [2 /*return*/, ctx.json({ linked: true, alreadyLinked: true })];
                    }
                    throw err_2;
                case 8: return [2 /*return*/, ctx.json({ linked: true })];
            }
        });
    });
}
/**
 * Unlink a client from a resource.
 *
 * Route: `DELETE /admin/oauth2/resources/:identifier/clients/:client_id`.
 * Path params carry the identifiers (RESTful linkage) — no body required.
 */
function unlinkClientResourceEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var session, resourceId, clientId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 1:
                    session = _a.sent();
                    resourceId = decodePathParam(ctx.params.identifier);
                    clientId = decodePathParam(ctx.params.client_id);
                    return [4 /*yield*/, (0, privileges_1.assertResourcePrivileges)(ctx, session, opts, "unlink", resourceId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, ctx.context.adapter.deleteMany({
                            model: linkModel(opts),
                            where: [
                                { field: "clientId", value: clientId },
                                { field: "resourceId", value: resourceId },
                            ],
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, ctx.json({ unlinked: true })];
            }
        });
    });
}
