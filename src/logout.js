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
exports.applyBackchannelLogoutPlan = applyBackchannelLogoutPlan;
exports.prepareBackchannelLogoutPlan = prepareBackchannelLogoutPlan;
exports.rpInitiatedLogoutEndpoint = rpInitiatedLogoutEndpoint;
exports.rpInitiatedLogoutConfirmationEndpoint = rpInitiatedLogoutConfirmationEndpoint;
var context_1 = require("@better-auth/core/context");
var fetch_metadata_1 = require("@better-auth/core/utils/fetch-metadata");
var redirect_uri_1 = require("@better-auth/core/utils/redirect-uri");
var cookies_1 = require("better-auth/cookies");
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var plugins_1 = require("better-auth/plugins");
var better_call_1 = require("better-call");
var jose_1 = require("jose");
var authorize_1 = require("./authorize");
var utils_1 = require("./utils");
var BACKCHANNEL_LOGOUT_EVENT_URI = "http://schemas.openid.net/event/backchannel-logout";
var LOGOUT_TOKEN_JWT_TYP = "logout+jwt";
// Spec §4 recommends at most two minutes into the future to limit replay.
var LOGOUT_TOKEN_LIFETIME_SECONDS = 120;
// Short per-RP ceiling so a slow RP cannot extend a user-facing logout.
// Spec §2.5: "the OP SHOULD NOT retransmit", so a single attempt within the
// window is enough.
var BACKCHANNEL_DISPATCH_TIMEOUT_MS = 5000;
/**
 * Signs a Back-Channel Logout Token per OIDC Back-Channel Logout 1.0 §2.4.
 *
 * The token reuses the ID Token signing key so any RP that validates ID Tokens
 * from this OP can validate Logout Tokens without extra configuration. The
 * caller resolves that key once and passes it in so a fan-out to many RPs does
 * not re-read it per target.
 *
 * §2.4 mandates `iss`, `aud`, `iat`, `exp`, `jti`, `events`, and at least one
 * of `sub` / `sid` (we send both). A `nonce` claim MUST NOT be present, and
 * `alg: none` is forbidden (§2.6).
 */
function signLogoutToken(ctx, options, resolvedKey, claims) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, (0, plugins_1.signJWT)(ctx, {
                    options: options,
                    payload: __assign(__assign({}, claims), { events: (_a = {},
                            _a[BACKCHANNEL_LOGOUT_EVENT_URI] = {},
                            _a) }),
                    header: { typ: LOGOUT_TOKEN_JWT_TYP },
                    resolvedKey: resolvedKey !== null && resolvedKey !== void 0 ? resolvedKey : undefined,
                })];
        });
    });
}
/**
 * Build the immutable work plan before a session is deleted. This phase only
 * reads database state because a later delete hook may still veto the mutation.
 * Token identifiers must be captured here because their `sessionId` foreign key
 * is cleared when the session row disappears.
 *
 * Revocation is the stored backstop, not the primary enforcement: introspection
 * and `/userinfo` already treat a token whose session has ended as inactive
 * (see `validateOpaqueAccessToken` / `validateJwtAccessToken`), so a missed
 * `revoked` write cannot keep a session-bound token alive on its own. Access
 * tokens bound to the session are revoked as OP hardening. Refresh tokens
 * follow OIDC Back-Channel Logout 1.0 §2.7: those without `offline_access` are
 * revoked; `offline_access` refresh tokens survive so long-lived API access can
 * outlive the browser session.
 *
 * Token revocation runs regardless of the JWT plugin (refresh-token revocation
 * has no dependency on signing). Only Logout Token delivery needs the JWT
 * plugin, so a plan may contain token identifiers with no delivery targets.
 *
 * Returns `null` when there is nothing to do, so the caller can skip the
 * background handoff entirely.
 */
function prepareBackchannelLogoutPlan(ctx, opts, input) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId, userId, logger, adapter, where, _a, accessTokens, refreshTokens, affectedClientIds, _i, accessTokens_1, t, _b, refreshTokens_1, t, clients, accessToRevokeIds, refreshToRevokeIds, eligibleClients, targets, error_1;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    sessionId = input.sessionId, userId = input.userId;
                    if (!userId)
                        return [2 /*return*/, null];
                    logger = ctx.context.logger;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, context_1.getCurrentAdapter)(ctx.context.adapter)];
                case 2:
                    adapter = _c.sent();
                    where = [{ field: "sessionId", value: sessionId }];
                    return [4 /*yield*/, Promise.all([
                            adapter.findMany({
                                model: "oauthAccessToken",
                                where: where,
                            }),
                            adapter.findMany({
                                model: "oauthRefreshToken",
                                where: where,
                            }),
                        ])];
                case 3:
                    _a = _c.sent(), accessTokens = _a[0], refreshTokens = _a[1];
                    affectedClientIds = new Set();
                    for (_i = 0, accessTokens_1 = accessTokens; _i < accessTokens_1.length; _i++) {
                        t = accessTokens_1[_i];
                        affectedClientIds.add(t.clientId);
                    }
                    for (_b = 0, refreshTokens_1 = refreshTokens; _b < refreshTokens_1.length; _b++) {
                        t = refreshTokens_1[_b];
                        affectedClientIds.add(t.clientId);
                    }
                    if (affectedClientIds.size === 0)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, adapter.findMany({
                            model: "oauthClient",
                            where: [
                                {
                                    field: "clientId",
                                    operator: "in",
                                    value: Array.from(affectedClientIds),
                                },
                            ],
                        })];
                case 4:
                    clients = _c.sent();
                    accessToRevokeIds = accessTokens
                        .filter(function (t) { return !t.revoked; })
                        .map(function (t) { return t.id; });
                    refreshToRevokeIds = refreshTokens
                        .filter(function (t) { var _a; return !t.revoked && !((_a = t.scopes) === null || _a === void 0 ? void 0 : _a.includes("offline_access")); })
                        .map(function (t) { return t.id; });
                    eligibleClients = opts.disableJwtPlugin
                        ? []
                        : clients.filter(function (c) { return Boolean(c.backchannelLogoutUri) && !c.disabled; });
                    return [4 /*yield*/, Promise.all(eligibleClients.map(function (client) { return __awaiter(_this, void 0, void 0, function () {
                            var error_2;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        _a = {
                                            client: client
                                        };
                                        return [4 /*yield*/, (0, utils_1.resolveSubjectIdentifier)(userId, client, opts)];
                                    case 1: return [2 /*return*/, (_a.sub = _b.sent(),
                                            _a)];
                                    case 2:
                                        error_2 = _b.sent();
                                        logger.warn("back-channel logout: unable to resolve subject for client ".concat(client.clientId), error_2);
                                        return [2 /*return*/, null];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 5:
                    targets = (_c.sent()).filter(function (target) { return target !== null; });
                    return [2 /*return*/, {
                            accessTokenIds: accessToRevokeIds,
                            refreshTokenIds: refreshToRevokeIds,
                            sessionId: sessionId,
                            targets: targets,
                        }];
                case 6:
                    error_1 = _c.sent();
                    logger.error("back-channel logout planning failed", error_1);
                    return [2 /*return*/, null];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Apply a prepared logout plan after the session deletion succeeds. Core runs
 * `session.delete.after` after the row is consumed and, for transactional
 * callers, only after the transaction commits.
 */
function applyBackchannelLogoutPlan(ctx, plan) {
    return __awaiter(this, void 0, void 0, function () {
        var revokedAt, adapter, revocations, _i, revocations_1, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    revokedAt = new Date();
                    return [4 /*yield*/, (0, context_1.getCurrentAdapter)(ctx.context.adapter)];
                case 1:
                    adapter = _a.sent();
                    return [4 /*yield*/, Promise.allSettled([
                            plan.accessTokenIds.length > 0
                                ? adapter.updateMany({
                                    model: "oauthAccessToken",
                                    where: [{ field: "id", operator: "in", value: plan.accessTokenIds }],
                                    update: { revoked: revokedAt },
                                })
                                : Promise.resolve(),
                            plan.refreshTokenIds.length > 0
                                ? adapter.updateMany({
                                    model: "oauthRefreshToken",
                                    where: [{ field: "id", operator: "in", value: plan.refreshTokenIds }],
                                    update: { revoked: revokedAt },
                                })
                                : Promise.resolve(),
                        ])];
                case 2:
                    revocations = _a.sent();
                    // Session liveness remains authoritative, but operators still need a signal
                    // if the stored revocation backstop drifts from the committed session state.
                    for (_i = 0, revocations_1 = revocations; _i < revocations_1.length; _i++) {
                        result = revocations_1[_i];
                        if (result.status === "rejected") {
                            ctx.context.logger.error("back-channel logout: token revocation update failed", result.reason);
                        }
                    }
                    if (!(plan.targets.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, deliverBackchannelLogoutTokens(ctx, plan)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Asynchronous phase: sign one Logout Token per target client and POST it to
 * the registered `backchannel_logout_uri`. The caller hands this to
 * `runInBackgroundOrAwait`, so when a background handler is configured (Vercel
 * `waitUntil`, Cloudflare `ctx.waitUntil`) it runs after the response; without
 * one it completes inline so delivery is not lost on request teardown.
 *
 * Spec §2.5: "the OP SHOULD NOT retransmit", so each RP gets a single attempt
 * within `BACKCHANNEL_DISPATCH_TIMEOUT_MS`. Every per-client failure (fetch
 * error, non-2xx response, signing error, subject resolution error) is
 * logged; none of them can reject the outer promise.
 */
function deliverBackchannelLogoutTokens(ctx, plan) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, jwtPluginOptions, iss, iat, exp, resolvedKey, _a;
        var _this = this;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    logger = ctx.context.logger;
                    jwtPluginOptions = (_b = (0, utils_1.getJwtPlugin)(ctx.context)) === null || _b === void 0 ? void 0 : _b.options;
                    iss = (_d = (_c = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _c === void 0 ? void 0 : _c.issuer) !== null && _d !== void 0 ? _d : ctx.context.baseURL;
                    iat = Math.floor(Date.now() / 1000);
                    exp = iat + LOGOUT_TOKEN_LIFETIME_SECONDS;
                    if (!((_e = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _e === void 0 ? void 0 : _e.sign)) return [3 /*break*/, 1];
                    _a = null;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, (0, plugins_1.resolveSigningKey)(ctx, jwtPluginOptions)];
                case 2:
                    _a = _f.sent();
                    _f.label = 3;
                case 3:
                    resolvedKey = _a;
                    return [4 /*yield*/, Promise.allSettled(plan.targets.map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                            var jti, token, response, error_3;
                            var client = _b.client, sub = _b.sub;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 3, , 4]);
                                        jti = (0, crypto_1.generateRandomString)(32, "a-z", "A-Z", "0-9");
                                        return [4 /*yield*/, signLogoutToken(ctx, jwtPluginOptions, resolvedKey, {
                                                iss: iss,
                                                aud: client.clientId,
                                                sub: sub,
                                                sid: plan.sessionId,
                                                iat: iat,
                                                exp: exp,
                                                jti: jti,
                                            })];
                                    case 1:
                                        token = _c.sent();
                                        return [4 /*yield*/, fetch(client.backchannelLogoutUri, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/x-www-form-urlencoded",
                                                    Accept: "application/json",
                                                },
                                                body: new URLSearchParams({ logout_token: token }),
                                                signal: AbortSignal.timeout(BACKCHANNEL_DISPATCH_TIMEOUT_MS),
                                                redirect: "error",
                                            })];
                                    case 2:
                                        response = _c.sent();
                                        // Spec §2.8: RP MUST return 200; many frameworks normalize empty 200
                                        // bodies to 204, which is commonly accepted.
                                        if (response.status !== 200 && response.status !== 204) {
                                            logger.warn("back-channel logout to client ".concat(client.clientId, " returned ").concat(response.status));
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_3 = _c.sent();
                                        logger.warn("back-channel logout to client ".concat(client.clientId, " failed"), error_3);
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var LOGOUT_CONFIRMATION_TTL_SECONDS = 5 * 60;
var LOGOUT_CONFIRMATION_COOKIE_SUFFIX = ".oauth_logout_confirmation";
function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (character) {
        switch (character) {
            case "&":
                return "&amp;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case '"':
                return "&quot;";
            case "'":
                return "&#39;";
            default:
                return character;
        }
    });
}
function isBrowserNavigation(ctx) {
    var _a, _b, _c;
    var headers = (_b = (_a = ctx.request) === null || _a === void 0 ? void 0 : _a.headers) !== null && _b !== void 0 ? _b : ctx.headers;
    if (!headers || (0, fetch_metadata_1.isBrowserFetchRequest)(headers))
        return false;
    var accept = (_c = headers.get("accept")) !== null && _c !== void 0 ? _c : "";
    return (headers.get("sec-fetch-mode") === "navigate" ||
        accept.includes("text/html") ||
        accept.includes("application/xhtml+xml"));
}
function logoutPage(title, body, status) {
    if (status === void 0) { status = 200; }
    return new Response("<!doctype html><html><head><meta charset=\"utf-8\"><title>".concat(escapeHtml(title), "</title></head><body>").concat(body, "</body></html>"), {
        status: status,
        headers: {
            "cache-control": "no-store",
            "content-security-policy": "default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
            "content-type": "text/html; charset=utf-8",
            pragma: "no-cache",
            "x-content-type-options": "nosniff",
        },
    });
}
function logoutConfirmationPath(ctx) {
    return "".concat(ctx.context.baseURL.replace(/\/$/, ""), "/oauth2/end-session/confirm");
}
function logoutConfirmationCookiePath(ctx) {
    try {
        var url = new URL(logoutConfirmationPath(ctx));
        return url.pathname;
    }
    catch (_a) {
        return "/oauth2/end-session/confirm";
    }
}
function logoutConfirmationPage(ctx) {
    var action = logoutConfirmationPath(ctx);
    return logoutPage("Confirm logout", "<main><h1>Confirm logout</h1><p>Do you want to log out of this account?</p><form method=\"post\" data-oidc-logout-confirmation action=\"".concat(escapeHtml(action), "\"><button type=\"submit\" name=\"action\" value=\"confirm\">Confirm logout</button></form></main>"));
}
function logoutSuccessPage(note) {
    var message = note ? "Logged out. ".concat(escapeHtml(note)) : "Logged out.";
    return logoutPage("Logged out", "<main><p data-oidc-logout-state=\"logged-out\">".concat(message, "</p></main>"));
}
function logoutErrorPage(description, status) {
    return logoutPage("Logout error", "<main><h1>Logout error</h1><p data-oidc-logout-state=\"error\">".concat(escapeHtml(description), "</p></main>"), status);
}
function logoutProtocolError(ctx, status, error, description) {
    if (isBrowserNavigation(ctx)) {
        var statusCode = status === "BAD_REQUEST" ? 400 : status === "UNAUTHORIZED" ? 401 : 500;
        return logoutErrorPage(description, statusCode);
    }
    throw new better_call_1.APIError(status, {
        error: error,
        error_description: description,
    });
}
function logoutConfirmationCookieName(ctx) {
    return "".concat(ctx.context.authCookies.sessionToken.name).concat(LOGOUT_CONFIRMATION_COOKIE_SUFFIX);
}
function logoutConfirmationCookieOptions(ctx, maxAge) {
    return __assign(__assign({}, ctx.context.authCookies.sessionToken.attributes), { httpOnly: true, maxAge: maxAge, path: logoutConfirmationCookiePath(ctx), sameSite: "lax" });
}
function setLogoutConfirmationState(ctx_1, sessionId_1) {
    return __awaiter(this, arguments, void 0, function (ctx, sessionId, confirmation) {
        var state;
        if (confirmation === void 0) { confirmation = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = __assign(__assign(__assign({}, (sessionId ? { sessionId: sessionId } : {})), confirmation), { expiresAt: Date.now() + LOGOUT_CONFIRMATION_TTL_SECONDS * 1000 });
                    return [4 /*yield*/, ctx.setSignedCookie(logoutConfirmationCookieName(ctx), JSON.stringify(state), ctx.context.secret, logoutConfirmationCookieOptions(ctx, LOGOUT_CONFIRMATION_TTL_SECONDS))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getLogoutConfirmationState(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var value, parsed, record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.getSignedCookie(logoutConfirmationCookieName(ctx), ctx.context.secret)];
                case 1:
                    value = _a.sent();
                    if (typeof value !== "string")
                        return [2 /*return*/, null];
                    try {
                        parsed = JSON.parse(value);
                        if (typeof parsed !== "object" || parsed === null)
                            return [2 /*return*/, null];
                        record = parsed;
                        if ((record.sessionId !== undefined &&
                            (typeof record.sessionId !== "string" ||
                                record.sessionId.length === 0)) ||
                            (record.clientId !== undefined &&
                                (typeof record.clientId !== "string" ||
                                    record.clientId.length === 0)) ||
                            (record.postLogoutRedirectUri !== undefined &&
                                (typeof record.postLogoutRedirectUri !== "string" ||
                                    record.postLogoutRedirectUri.length === 0)) ||
                            (record.state !== undefined && typeof record.state !== "string") ||
                            (record.redirectInvalid !== undefined &&
                                typeof record.redirectInvalid !== "boolean") ||
                            (record.postLogoutRedirectUri !== undefined &&
                                record.clientId === undefined) ||
                            typeof record.expiresAt !== "number" ||
                            !Number.isFinite(record.expiresAt)) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, __assign(__assign(__assign(__assign(__assign(__assign({}, (typeof record.sessionId === "string"
                                ? { sessionId: record.sessionId }
                                : {})), (typeof record.clientId === "string"
                                ? { clientId: record.clientId }
                                : {})), (typeof record.postLogoutRedirectUri === "string"
                                ? { postLogoutRedirectUri: record.postLogoutRedirectUri }
                                : {})), (typeof record.state === "string" ? { state: record.state } : {})), (typeof record.redirectInvalid === "boolean"
                                ? { redirectInvalid: record.redirectInvalid }
                                : {})), { expiresAt: record.expiresAt })];
                    }
                    catch (_b) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function clearLogoutConfirmationState(ctx) {
    ctx.setCookie(logoutConfirmationCookieName(ctx), "", logoutConfirmationCookieOptions(ctx, 0));
}
function getCurrentBrowserSession(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var token, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret)];
                case 1:
                    token = _a.sent();
                    if (typeof token !== "string" || token.length === 0)
                        return [2 /*return*/, null];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, ctx.context.internalAdapter.findSession(token)];
                case 3:
                    result = _a.sent();
                    return [2 /*return*/, result ? { session: result.session } : null];
                case 4:
                    error_4 = _a.sent();
                    ctx.context.logger.error("Failed to read the current logout session", error_4);
                    throw new better_call_1.APIError("INTERNAL_SERVER_ERROR", {
                        error: "server_error",
                        error_description: "Unable to read the current session",
                    });
                case 5: return [2 /*return*/];
            }
        });
    });
}
function findHintedSession(ctx, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ctx.context.adapter.findOne({
                            model: "session",
                            where: [{ field: "id", value: sessionId }],
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_5 = _a.sent();
                    ctx.context.logger.error("Failed to read the hinted logout session", error_5);
                    throw new better_call_1.APIError("INTERNAL_SERVER_ERROR", {
                        error: "server_error",
                        error_description: "Unable to read the hinted session",
                    });
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteLogoutSession(ctx, session) {
    return __awaiter(this, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof session.token !== "string" || session.token.length === 0) {
                        throw new better_call_1.APIError("INTERNAL_SERVER_ERROR", {
                            error: "server_error",
                            error_description: "Unable to complete logout",
                        });
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ctx.context.internalAdapter.deleteSession(session.token)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    ctx.context.logger.error("Failed to delete the logout session", error_6);
                    throw new better_call_1.APIError("INTERNAL_SERVER_ERROR", {
                        error: "server_error",
                        error_description: "Unable to complete logout",
                    });
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getLogoutClient(ctx, opts, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, utils_1.getClient)(ctx, opts, clientId)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_7 = _a.sent();
                    ctx.context.logger.error("Failed to resolve the logout client", error_7);
                    throw new better_call_1.APIError("INTERNAL_SERVER_ERROR", {
                        error: "server_error",
                        error_description: "Unable to resolve the logout client",
                    });
                case 3: return [2 /*return*/];
            }
        });
    });
}
function normalizeLogoutAudiences(value) {
    var values = Array.isArray(value) ? value : [value];
    return values.filter(function (candidate) { return typeof candidate === "string"; });
}
function getHintClientId(payload) {
    if (typeof payload.aud === "string" && payload.aud.length > 0) {
        return payload.aud;
    }
    if (typeof payload.azp === "string" && payload.azp.length > 0) {
        return payload.azp;
    }
    var audiences = normalizeLogoutAudiences(payload.aud);
    return audiences.length === 1 ? audiences[0] : null;
}
function resolveHintClient(ctx, opts, hint, clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var decoded, candidate;
        return __generator(this, function (_a) {
            if (clientId)
                return [2 /*return*/, getLogoutClient(ctx, opts, clientId)];
            try {
                decoded = (0, jose_1.decodeJwt)(hint);
            }
            catch (_b) {
                return [2 /*return*/, null];
            }
            candidate = getHintClientId(decoded);
            return [2 /*return*/, candidate ? getLogoutClient(ctx, opts, candidate) : null];
        });
    });
}
function verifyLogoutHint(ctx, opts, hint, client) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, secret, verifiedPayload, jwtPluginOptions, jwksUrl, jwks, verifiedPayload, _a;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 7, , 8]);
                    payload = void 0;
                    if (!opts.disableJwtPlugin) return [3 /*break*/, 3];
                    if (!client.clientSecret)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, utils_1.decryptStoredClientSecret)(ctx, opts.storeClientSecret, client.clientSecret)];
                case 1:
                    secret = _f.sent();
                    return [4 /*yield*/, (0, jose_1.compactVerify)(hint, new TextEncoder().encode(secret))];
                case 2:
                    verifiedPayload = (_f.sent()).payload;
                    payload = JSON.parse(new TextDecoder().decode(verifiedPayload));
                    return [3 /*break*/, 6];
                case 3:
                    jwtPluginOptions = (0, utils_1.getJwtPlugin)(ctx.context).options;
                    jwksUrl = (_c = (_b = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _b === void 0 ? void 0 : _b.remoteUrl) !== null && _c !== void 0 ? _c : "".concat(ctx.context.baseURL).concat((_e = (_d = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _d === void 0 ? void 0 : _d.jwksPath) !== null && _e !== void 0 ? _e : "/jwks");
                    return [4 /*yield*/, (0, oauth2_1.getJwks)(hint, { jwksFetch: jwksUrl })];
                case 4:
                    jwks = _f.sent();
                    return [4 /*yield*/, (0, jose_1.compactVerify)(hint, (0, jose_1.createLocalJWKSet)(jwks))];
                case 5:
                    verifiedPayload = (_f.sent()).payload;
                    payload = JSON.parse(new TextDecoder().decode(verifiedPayload));
                    _f.label = 6;
                case 6:
                    if (payload.iss !== (0, authorize_1.getIssuer)(ctx, opts))
                        return [2 /*return*/, null];
                    if (!normalizeLogoutAudiences(payload.aud).includes(client.clientId)) {
                        return [2 /*return*/, null];
                    }
                    if (typeof payload.sid !== "string" ||
                        payload.sid.length === 0 ||
                        typeof payload.sub !== "string" ||
                        payload.sub.length === 0) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, payload];
                case 7:
                    _a = _f.sent();
                    return [2 /*return*/, null];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function getRegisteredLogoutRedirect(client, requestedURI, state) {
    var _a;
    if (!requestedURI)
        return { invalid: false };
    if (!((_a = client.postLogoutRedirectUris) === null || _a === void 0 ? void 0 : _a.includes(requestedURI))) {
        return { invalid: true };
    }
    if (!state)
        return { uri: requestedURI, invalid: false };
    try {
        var redirectURI = new URL(requestedURI);
        redirectURI.searchParams.set("state", state);
        return { uri: redirectURI.toString(), invalid: false };
    }
    catch (_b) {
        return { invalid: true };
    }
}
function getLogoutConfirmationContext(client, request) {
    if (!request.post_logout_redirect_uri)
        return {};
    var redirect = getRegisteredLogoutRedirect(client, request.post_logout_redirect_uri, request.state);
    if (redirect.invalid)
        return { redirectInvalid: true };
    return __assign({ clientId: client.clientId, postLogoutRedirectUri: request.post_logout_redirect_uri }, (request.state !== undefined ? { state: request.state } : {}));
}
function getConfirmedLogoutRedirect(ctx, opts, state) {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (state.redirectInvalid)
                        return [2 /*return*/, { invalid: true }];
                    if (!state.clientId || !state.postLogoutRedirectUri) {
                        return [2 /*return*/, { invalid: false }];
                    }
                    // The policy may have changed since the confirmation state was issued.
                    if (!(0, utils_1.isRedirectUriTransportAllowed)(opts, state.postLogoutRedirectUri)) {
                        return [2 /*return*/, { invalid: true }];
                    }
                    return [4 /*yield*/, getLogoutClient(ctx, opts, state.clientId)];
                case 1:
                    client = _a.sent();
                    if (!client || client.disabled || !client.enableEndSession) {
                        return [2 /*return*/, { invalid: true }];
                    }
                    return [2 /*return*/, getRegisteredLogoutRedirect(client, state.postLogoutRedirectUri, state.state)];
            }
        });
    });
}
function confirmationRequired(ctx_1, currentSession_1) {
    return __awaiter(this, arguments, void 0, function (ctx, currentSession, confirmation) {
        if (confirmation === void 0) { confirmation = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!currentSession) return [3 /*break*/, 3];
                    if (!isBrowserNavigation(ctx)) return [3 /*break*/, 2];
                    return [4 /*yield*/, setLogoutConfirmationState(ctx, undefined, confirmation)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, logoutConfirmationPage(ctx)];
                case 2: return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_request", "No active session is available for logout")];
                case 3:
                    if (!isBrowserNavigation(ctx)) {
                        return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_request", "User confirmation is required to complete logout")];
                    }
                    return [4 /*yield*/, setLogoutConfirmationState(ctx, currentSession.session.id, confirmation)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, logoutConfirmationPage(ctx)];
            }
        });
    });
}
function completeConfirmedLogout(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var state, currentSession, redirect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getLogoutConfirmationState(ctx)];
                case 1:
                    state = _a.sent();
                    return [4 /*yield*/, getCurrentBrowserSession(ctx)];
                case 2:
                    currentSession = _a.sent();
                    if (!state || state.expiresAt <= Date.now()) {
                        return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_request", "The logout confirmation is invalid or expired")];
                    }
                    return [4 /*yield*/, getConfirmedLogoutRedirect(ctx, opts, state)];
                case 3:
                    redirect = _a.sent();
                    if (!currentSession) {
                        clearLogoutConfirmationState(ctx);
                        if (redirect.uri)
                            return [2 /*return*/, (0, authorize_1.handleRedirect)(ctx, redirect.uri)];
                        return [2 /*return*/, isBrowserNavigation(ctx)
                                ? logoutSuccessPage(redirect.invalid
                                    ? "The requested post-logout redirect was not registered."
                                    : undefined)
                                : logoutProtocolError(ctx, "BAD_REQUEST", "invalid_request", "No active session is available for logout")];
                    }
                    if (state.sessionId && state.sessionId !== currentSession.session.id) {
                        return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_request", "The logout confirmation is invalid or expired")];
                    }
                    return [4 /*yield*/, deleteLogoutSession(ctx, currentSession.session)];
                case 4:
                    _a.sent();
                    (0, cookies_1.deleteSessionCookie)(ctx);
                    clearLogoutConfirmationState(ctx);
                    if (redirect.uri)
                        return [2 /*return*/, (0, authorize_1.handleRedirect)(ctx, redirect.uri)];
                    return [2 /*return*/, isBrowserNavigation(ctx)
                            ? logoutSuccessPage(redirect.invalid
                                ? "The requested post-logout redirect was not registered."
                                : undefined)
                            : null];
            }
        });
    });
}
/**
 * RP-Initiated Logout (OIDC RP-Initiated Logout 1.0). The RP presents a signed
 * `id_token_hint`; after verification, the OP terminates the matching session
 * and optionally redirects to `post_logout_redirect_uri`. Requests without a
 * usable hint, and hints that do not identify the current browser session, use
 * a signed, short-lived OP confirmation state before terminating that session.
 *
 * Session termination goes through `internalAdapter.deleteSession`, which fires
 * `session.delete.after` so the hook drives revocation and back-channel
 * notifications to every RP with tokens on the session.
 *
 * @see https://openid.net/specs/openid-connect-rpinitiated-1_0.html
 */
function rpInitiatedLogoutEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var query, body, request, currentSession, hasHint, confirmation, client_1, client, idTokenPayload, sessionId, hintedSession, matchesCurrentSession, redirect, sessionToDelete;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    query = ((_a = ctx.query) !== null && _a !== void 0 ? _a : {});
                    body = ((_b = ctx.body) !== null && _b !== void 0 ? _b : {});
                    request = __assign(__assign({}, query), body);
                    if (request.post_logout_redirect_uri &&
                        !(0, utils_1.isRedirectUriTransportAllowed)(opts, request.post_logout_redirect_uri)) {
                        return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_request", redirect_uri_1.INSECURE_REDIRECT_URI_MESSAGE)];
                    }
                    return [4 /*yield*/, getCurrentBrowserSession(ctx)];
                case 1:
                    currentSession = _c.sent();
                    hasHint = request.id_token_hint !== undefined;
                    if (!!hasHint) return [3 /*break*/, 4];
                    confirmation = {};
                    if (!request.client_id) return [3 /*break*/, 3];
                    return [4 /*yield*/, getLogoutClient(ctx, opts, request.client_id)];
                case 2:
                    client_1 = _c.sent();
                    if (!client_1) {
                        return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_client", "The logout client does not exist")];
                    }
                    if (client_1.disabled) {
                        return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_client", "The logout client is disabled")];
                    }
                    if (!client_1.enableEndSession) {
                        return [2 /*return*/, logoutProtocolError(ctx, "UNAUTHORIZED", "invalid_client", "The client is not allowed to initiate logout")];
                    }
                    confirmation = getLogoutConfirmationContext(client_1, request);
                    _c.label = 3;
                case 3: return [2 /*return*/, confirmationRequired(ctx, currentSession, confirmation)];
                case 4: return [4 /*yield*/, resolveHintClient(ctx, opts, request.id_token_hint, request.client_id)];
                case 5:
                    client = _c.sent();
                    if (!client) {
                        if (currentSession && isBrowserNavigation(ctx)) {
                            return [2 /*return*/, confirmationRequired(ctx, currentSession)];
                        }
                        return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_client", "The logout client does not exist")];
                    }
                    if (client.disabled) {
                        return [2 /*return*/, logoutProtocolError(ctx, "BAD_REQUEST", "invalid_client", "The logout client is disabled")];
                    }
                    if (!client.enableEndSession) {
                        return [2 /*return*/, logoutProtocolError(ctx, "UNAUTHORIZED", "invalid_client", "The client is not allowed to initiate logout")];
                    }
                    return [4 /*yield*/, verifyLogoutHint(ctx, opts, request.id_token_hint, client)];
                case 6:
                    idTokenPayload = _c.sent();
                    if (!idTokenPayload) {
                        if (currentSession && isBrowserNavigation(ctx)) {
                            return [2 /*return*/, confirmationRequired(ctx, currentSession, request.client_id ? getLogoutConfirmationContext(client, request) : {})];
                        }
                        return [2 /*return*/, logoutProtocolError(ctx, "UNAUTHORIZED", "invalid_token", "The id_token_hint is invalid")];
                    }
                    sessionId = idTokenPayload.sid;
                    return [4 /*yield*/, findHintedSession(ctx, sessionId)];
                case 7:
                    hintedSession = _c.sent();
                    matchesCurrentSession = (currentSession === null || currentSession === void 0 ? void 0 : currentSession.session.id) === sessionId;
                    if (currentSession && !matchesCurrentSession) {
                        return [2 /*return*/, confirmationRequired(ctx, currentSession, getLogoutConfirmationContext(client, request))];
                    }
                    redirect = getRegisteredLogoutRedirect(client, request.post_logout_redirect_uri, request.state);
                    sessionToDelete = hintedSession !== null && hintedSession !== void 0 ? hintedSession : (matchesCurrentSession ? currentSession === null || currentSession === void 0 ? void 0 : currentSession.session : null);
                    if (!sessionToDelete) return [3 /*break*/, 9];
                    // internalAdapter.deleteSession triggers the normal before/after session
                    // hooks, including revocation and back-channel dispatch for every RP.
                    return [4 /*yield*/, deleteLogoutSession(ctx, sessionToDelete)];
                case 8:
                    // internalAdapter.deleteSession triggers the normal before/after session
                    // hooks, including revocation and back-channel dispatch for every RP.
                    _c.sent();
                    _c.label = 9;
                case 9:
                    if (matchesCurrentSession)
                        (0, cookies_1.deleteSessionCookie)(ctx);
                    clearLogoutConfirmationState(ctx);
                    if (redirect.uri)
                        return [2 /*return*/, (0, authorize_1.handleRedirect)(ctx, redirect.uri)];
                    return [2 /*return*/, isBrowserNavigation(ctx)
                            ? logoutSuccessPage(redirect.invalid
                                ? "The requested post-logout redirect was not registered."
                                : undefined)
                            : null];
            }
        });
    });
}
/**
 * Completes the browser confirmation flow for RP-Initiated Logout. This route
 * is intentionally scoped to HTTP delivery so it does not become a generated
 * client action; the signed cookie is the only confirmation context it accepts.
 */
function rpInitiatedLogoutConfirmationEndpoint(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, completeConfirmedLogout(ctx, opts)];
        });
    });
}
