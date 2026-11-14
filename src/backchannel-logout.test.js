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
var node_http_1 = require("node:http");
var api_1 = require("@better-auth/core/api");
var context_1 = require("@better-auth/core/context");
var oauth2_1 = require("@better-auth/core/oauth2");
var memory_adapter_1 = require("@better-auth/memory-adapter");
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var node_1 = require("better-auth/node");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var listhen_1 = require("listhen");
var vitest_1 = require("vitest");
var z = require("zod");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
/**
 * Minimal mock Relying Party that records back-channel logout requests and
 * returns a configurable status, with optional artificial latency.
 */
function startMockRp() {
    return __awaiter(this, arguments, void 0, function (options) {
        var received, server, address, url;
        var _this = this;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    received = [];
                    server = (0, node_http_1.createServer)(function (req, res) {
                        var body = "";
                        req.on("data", function (chunk) {
                            body += chunk;
                        });
                        req.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                            var params;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        params = new URLSearchParams(body);
                                        received.push({
                                            contentType: req.headers["content-type"],
                                            logoutToken: (_a = params.get("logout_token")) !== null && _a !== void 0 ? _a : undefined,
                                            raw: body,
                                        });
                                        if (!options.delayMs) return [3 /*break*/, 2];
                                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, options.delayMs); })];
                                    case 1:
                                        _c.sent();
                                        _c.label = 2;
                                    case 2:
                                        res.statusCode = (_b = options.status) !== null && _b !== void 0 ? _b : 200;
                                        res.end();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return server.listen(0, "127.0.0.1", resolve); })];
                case 1:
                    _a.sent();
                    address = server.address();
                    url = "http://127.0.0.1:".concat(address.port);
                    return [2 /*return*/, {
                            received: received,
                            url: url,
                            publicUrl: "https://rp-".concat(address.port, ".example.com"),
                            close: function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                    return server.close(function (err) { return (err ? reject(err) : resolve()); });
                                                })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            },
                        }];
            }
        });
    });
}
(0, vitest_1.describe)("oauth back-channel logout", function () { return __awaiter(void 0, void 0, void 0, function () {
    function registerClient() {
        return __awaiter(this, arguments, void 0, function (overrides) {
            var response;
            if (overrides === void 0) { overrides = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                            headers: headers,
                            body: __assign({ redirect_uris: ["".concat(rp.url, "/callback")], application_type: "native", token_endpoint_auth_method: "client_secret_post", skip_consent: true, enable_end_session: true, backchannel_logout_uri: "".concat(rp.publicUrl, "/logout/backchannel") }, overrides),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!(response === null || response === void 0 ? void 0 : response.client_id) || !(response === null || response === void 0 ? void 0 : response.client_secret)) {
                            throw new Error("client registration failed");
                        }
                        return [2 /*return*/, response];
                }
            });
        });
    }
    function issueTokens(params) {
        return __awaiter(this, void 0, void 0, function () {
            var oauthClient, _a, requestScopes, redirectUri, codeVerifier, authUrl, callbackRedirectUrl, code, _b, body, tokenHeaders, tokens;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        oauthClient = params.client, _a = params.requestScopes, requestScopes = _a === void 0 ? scopes : _a;
                        redirectUri = "".concat(rp.url, "/callback");
                        codeVerifier = (0, crypto_1.generateRandomString)(32);
                        return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                id: "test",
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                                redirectURI: "",
                                authorizationEndpoint: "".concat(baseUrl, "/api/auth/oauth2/authorize"),
                                state: state,
                                scopes: requestScopes,
                                codeVerifier: codeVerifier,
                            })];
                    case 1:
                        authUrl = _c.sent();
                        callbackRedirectUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                headers: headers,
                                onError: function (context) {
                                    callbackRedirectUrl = context.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _c.sent();
                        code = new URL(callbackRedirectUrl).searchParams.get("code");
                        if (!code) {
                            throw new Error("no authorization code in ".concat(callbackRedirectUrl));
                        }
                        return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                code: code,
                                codeVerifier: codeVerifier,
                                redirectURI: redirectUri,
                                options: {
                                    clientId: oauthClient.client_id,
                                    clientSecret: oauthClient.client_secret,
                                    redirectURI: redirectUri,
                                },
                            })];
                    case 3:
                        _b = _c.sent(), body = _b.body, tokenHeaders = _b.headers;
                        return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: tokenHeaders })];
                    case 4:
                        tokens = _c.sent();
                        return [2 /*return*/, tokens.data];
                }
            });
        });
    }
    function waitForDispatches() {
        return __awaiter(this, arguments, void 0, function (min, timeoutMs) {
            var start;
            if (min === void 0) { min = 1; }
            if (timeoutMs === void 0) { timeoutMs = 2000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        start = Date.now();
                        _a.label = 1;
                    case 1:
                        if (!(rp.received.length < min)) return [3 /*break*/, 3];
                        if (Date.now() - start > timeoutMs) {
                            throw new Error("Timed out waiting for ".concat(min, " logout dispatches; received ").concat(rp.received.length));
                        }
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 25); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function revokeSessionOverHTTP(input) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(baseUrl, "/api/auth/test/transactional-session-revocation"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(input),
                        })];
                    case 1:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _a = Error.bind;
                        _b = "Transactional session revocation failed: ".concat;
                        return [4 /*yield*/, response.text()];
                    case 2: throw new (_a.apply(Error, [void 0, _b.apply("Transactional session revocation failed: ", [_c.sent()])]))();
                    case 3: return [4 /*yield*/, response.json()];
                    case 4: return [2 /*return*/, (_c.sent())];
                }
            });
        });
    }
    function readClientTokenRevocation(clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var ctx, _a, accessTokens, refreshTokens;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, auth.$context];
                    case 1:
                        ctx = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                ctx.adapter.findMany({
                                    model: "oauthAccessToken",
                                    where: [{ field: "clientId", value: clientId }],
                                }),
                                ctx.adapter.findMany({
                                    model: "oauthRefreshToken",
                                    where: [{ field: "clientId", value: clientId }],
                                }),
                            ])];
                    case 2:
                        _a = _b.sent(), accessTokens = _a[0], refreshTokens = _a[1];
                        return [2 /*return*/, { accessTokens: accessTokens, refreshTokens: refreshTokens }];
                }
            });
        });
    }
    function getSessionToken(requestHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, auth.api.getSession({ headers: requestHeaders })];
                    case 1:
                        session = _a.sent();
                        if (!session)
                            throw new Error("Expected an active test session");
                        return [2 /*return*/, session.session.token];
                }
            });
        });
    }
    var database, port, baseUrl, state, scopes, shouldVetoSessionDeletion, _a, auth, signInWithTestUser, customFetchImpl, headers, client, server, rp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                database = {
                    account: [],
                    jwks: [],
                    oauthAccessToken: [],
                    oauthClient: [],
                    oauthClientAssertion: [],
                    oauthClientResource: [],
                    oauthConsent: [],
                    oauthRefreshToken: [],
                    oauthResource: [],
                    session: [],
                    user: [],
                    verification: [],
                };
                port = 3010;
                baseUrl = "http://localhost:".concat(port);
                state = "123";
                scopes = ["openid", "email", "profile", "offline_access"];
                shouldVetoSessionDeletion = false;
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        database: (0, memory_adapter_1.memoryAdapter)(database),
                        databaseHooks: {
                            session: {
                                delete: {
                                    before: function () {
                                        return __awaiter(this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                if (!shouldVetoSessionDeletion)
                                                    return [2 /*return*/];
                                                shouldVetoSessionDeletion = false;
                                                return [2 /*return*/, false];
                                            });
                                        });
                                    },
                                },
                            },
                        },
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                pairwiseSecret: "test-backchannel-pairwise-secret-32-chars",
                                scopes: scopes,
                            }),
                            (0, jwt_1.jwt)(),
                            {
                                id: "transactional-session-revocation-test",
                                endpoints: {
                                    testTransactionalSessionRevocation: (0, api_1.createAuthEndpoint)("/test/transactional-session-revocation", {
                                        method: "POST",
                                        body: z.object({
                                            clientId: z.string().optional(),
                                            rollback: z.boolean(),
                                            sessionToken: z.string(),
                                            trackActiveAdapterWrites: z.boolean().optional(),
                                            transactionAccessTokenId: z.string().optional(),
                                        }),
                                    }, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
                                        var rollbackMarker, updatedModelsThroughActiveAdapter, revokeSession, committed, _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    rollbackMarker = Symbol("rollback session revocation");
                                                    updatedModelsThroughActiveAdapter = [];
                                                    revokeSession = function () { return __awaiter(void 0, void 0, void 0, function () {
                                                        var error_1;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    _a.trys.push([0, 2, , 3]);
                                                                    return [4 /*yield*/, (0, context_1.runWithTransaction)(ctx.context.adapter, function () { return __awaiter(void 0, void 0, void 0, function () {
                                                                            var activeSession, adapter;
                                                                            return __generator(this, function (_a) {
                                                                                switch (_a.label) {
                                                                                    case 0:
                                                                                        if (!(ctx.body.clientId &&
                                                                                            ctx.body.transactionAccessTokenId)) return [3 /*break*/, 4];
                                                                                        return [4 /*yield*/, ctx.context.internalAdapter.findSession(ctx.body.sessionToken)];
                                                                                    case 1:
                                                                                        activeSession = _a.sent();
                                                                                        if (!activeSession)
                                                                                            throw new Error("Session not found");
                                                                                        return [4 /*yield*/, (0, context_1.getCurrentAdapter)(ctx.context.adapter)];
                                                                                    case 2:
                                                                                        adapter = _a.sent();
                                                                                        return [4 /*yield*/, adapter.create({
                                                                                                model: "oauthAccessToken",
                                                                                                forceAllowId: true,
                                                                                                data: {
                                                                                                    id: ctx.body.transactionAccessTokenId,
                                                                                                    token: ctx.body.transactionAccessTokenId,
                                                                                                    clientId: ctx.body.clientId,
                                                                                                    sessionId: activeSession.session.id,
                                                                                                    userId: activeSession.user.id,
                                                                                                    scopes: ["openid"],
                                                                                                    expiresAt: new Date(Date.now() + 60000),
                                                                                                    createdAt: new Date(),
                                                                                                    revoked: null,
                                                                                                },
                                                                                            })];
                                                                                    case 3:
                                                                                        _a.sent();
                                                                                        _a.label = 4;
                                                                                    case 4: return [4 /*yield*/, ctx.context.internalAdapter.deleteSession(ctx.body.sessionToken)];
                                                                                    case 5:
                                                                                        _a.sent();
                                                                                        if (ctx.body.rollback)
                                                                                            throw rollbackMarker;
                                                                                        return [2 /*return*/];
                                                                                }
                                                                            });
                                                                        }); })];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [3 /*break*/, 3];
                                                                case 2:
                                                                    error_1 = _a.sent();
                                                                    if (error_1 !== rollbackMarker)
                                                                        throw error_1;
                                                                    return [2 /*return*/, false];
                                                                case 3: return [2 /*return*/, true];
                                                            }
                                                        });
                                                    }); };
                                                    if (!ctx.body.trackActiveAdapterWrites) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, (function () { return __awaiter(void 0, void 0, void 0, function () {
                                                            var baseAdapter, activeAdapter;
                                                            return __generator(this, function (_a) {
                                                                baseAdapter = ctx.context.adapter;
                                                                activeAdapter = __assign(__assign({}, baseAdapter), { updateMany: function (input) {
                                                                        return __awaiter(this, void 0, void 0, function () {
                                                                            return __generator(this, function (_a) {
                                                                                updatedModelsThroughActiveAdapter.push(input.model);
                                                                                return [2 /*return*/, baseAdapter.updateMany(input)];
                                                                            });
                                                                        });
                                                                    } });
                                                                return [2 /*return*/, (0, context_1.runWithAdapter)(activeAdapter, revokeSession)];
                                                            });
                                                        }); })()];
                                                case 1:
                                                    _a = _b.sent();
                                                    return [3 /*break*/, 4];
                                                case 2: return [4 /*yield*/, revokeSession()];
                                                case 3:
                                                    _a = _b.sent();
                                                    _b.label = 4;
                                                case 4:
                                                    committed = _a;
                                                    return [2 /*return*/, ctx.json(__assign({ committed: committed }, (ctx.body.trackActiveAdapterWrites
                                                            ? { updatedModelsThroughActiveAdapter: updatedModelsThroughActiveAdapter }
                                                            : {})))];
                                            }
                                        });
                                    }); }),
                                },
                            },
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                client = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl },
                });
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, listhen_1.listen)((0, node_1.toNodeHandler)(auth.handler), { port: port })];
                            case 1:
                                server = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!server) return [3 /*break*/, 2];
                                return [4 /*yield*/, server.close()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var networkFetch, signed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                shouldVetoSessionDeletion = false;
                                return [4 /*yield*/, startMockRp()];
                            case 1:
                                rp = _a.sent();
                                networkFetch = globalThis.fetch.bind(globalThis);
                                vitest_1.vi.stubGlobal("fetch", function (input, init) {
                                    var requestedUrl = typeof input === "string"
                                        ? input
                                        : input instanceof URL
                                            ? input.href
                                            : input.url;
                                    if (requestedUrl.startsWith(rp.publicUrl)) {
                                        return networkFetch("".concat(rp.url).concat(requestedUrl.slice(rp.publicUrl.length)), init);
                                    }
                                    return networkFetch(input, init);
                                });
                                return [4 /*yield*/, signInWithTestUser()];
                            case 2:
                                signed = _a.sent();
                                headers = signed.headers;
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                vitest_1.vi.unstubAllGlobals();
                                return [4 /*yield*/, rp.close()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("dispatches a conformant logout token when the session is signed out", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, tokens, received, keys, _a, payload, protectedHeader, _b, idTokenPayloadB64, idTokenPayload;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, registerClient()];
                            case 1:
                                oauthClient = _c.sent();
                                return [4 /*yield*/, issueTokens({ client: oauthClient })];
                            case 2:
                                tokens = _c.sent();
                                // signOut on the OP triggers session.delete.before → dispatch
                                return [4 /*yield*/, client.signOut({ fetchOptions: { headers: headers } })];
                            case 3:
                                // signOut on the OP triggers session.delete.before → dispatch
                                _c.sent();
                                return [4 /*yield*/, waitForDispatches()];
                            case 4:
                                _c.sent();
                                (0, vitest_1.expect)(rp.received).toHaveLength(1);
                                received = rp.received[0];
                                (0, vitest_1.expect)(received.contentType).toContain("application/x-www-form-urlencoded");
                                (0, vitest_1.expect)(received.logoutToken).toBeDefined();
                                return [4 /*yield*/, auth.api.getJwks()];
                            case 5:
                                keys = (_c.sent()).keys;
                                return [4 /*yield*/, (0, jose_1.jwtVerify)(received.logoutToken, (0, jose_1.createLocalJWKSet)({ keys: keys }))];
                            case 6:
                                _a = _c.sent(), payload = _a.payload, protectedHeader = _a.protectedHeader;
                                (0, vitest_1.expect)(protectedHeader.typ).toBe("logout+jwt");
                                (0, vitest_1.expect)(protectedHeader.alg).not.toBe("none");
                                (0, vitest_1.expect)(payload.iss).toBe("".concat(baseUrl, "/api/auth"));
                                (0, vitest_1.expect)(payload.aud).toBe(oauthClient.client_id);
                                (0, vitest_1.expect)(payload.iat).toEqual(vitest_1.expect.any(Number));
                                (0, vitest_1.expect)(payload.exp).toEqual(vitest_1.expect.any(Number));
                                (0, vitest_1.expect)(payload.exp - payload.iat).toBeLessThanOrEqual(120);
                                (0, vitest_1.expect)(payload.jti).toEqual(vitest_1.expect.any(String));
                                (0, vitest_1.expect)(payload.sub).toEqual(vitest_1.expect.any(String));
                                (0, vitest_1.expect)(payload.sid).toEqual(vitest_1.expect.any(String));
                                (0, vitest_1.expect)(payload.nonce).toBeUndefined();
                                (0, vitest_1.expect)(payload.events).toEqual({
                                    "http://schemas.openid.net/event/backchannel-logout": {},
                                });
                                _b = tokens.id_token.split("."), idTokenPayloadB64 = _b[1];
                                idTokenPayload = JSON.parse(Buffer.from(idTokenPayloadB64, "base64url").toString("utf8"));
                                (0, vitest_1.expect)(payload.sid).toBe(idTokenPayload.sid);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("dispatches logout only after a transactional session revocation commits", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var signedIn, oauthClient, rolledBack, _a, _b, tokensAfterRollback, _i, _c, token, _d, _e, token, committed, _f, _g, tokensAfterCommit, _h, _j, token, _k, _l, token, transactionOnlyToken;
                    var _m, _o;
                    var _p, _q, _r;
                    return __generator(this, function (_s) {
                        switch (_s.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                signedIn = _s.sent();
                                headers = signedIn.headers;
                                return [4 /*yield*/, registerClient()];
                            case 2:
                                oauthClient = _s.sent();
                                return [4 /*yield*/, issueTokens({ client: oauthClient })];
                            case 3:
                                _s.sent();
                                _a = revokeSessionOverHTTP;
                                _m = {
                                    rollback: true
                                };
                                return [4 /*yield*/, getSessionToken(headers)];
                            case 4: return [4 /*yield*/, _a.apply(void 0, [(_m.sessionToken = _s.sent(),
                                        _m)])];
                            case 5:
                                rolledBack = _s.sent();
                                (0, vitest_1.expect)(rolledBack).toEqual({ committed: false });
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                            case 6:
                                _s.sent();
                                (0, vitest_1.expect)(rp.received).toHaveLength(0);
                                _b = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 7:
                                _b.apply(void 0, [_s.sent()]).not.toBeNull();
                                return [4 /*yield*/, readClientTokenRevocation(oauthClient.client_id)];
                            case 8:
                                tokensAfterRollback = _s.sent();
                                (0, vitest_1.expect)(tokensAfterRollback.accessTokens.length).toBeGreaterThan(0);
                                (0, vitest_1.expect)(tokensAfterRollback.refreshTokens.length).toBeGreaterThan(0);
                                for (_i = 0, _c = tokensAfterRollback.accessTokens; _i < _c.length; _i++) {
                                    token = _c[_i];
                                    (0, vitest_1.expect)((_p = token.revoked) !== null && _p !== void 0 ? _p : null).toBeNull();
                                }
                                for (_d = 0, _e = tokensAfterRollback.refreshTokens; _d < _e.length; _d++) {
                                    token = _e[_d];
                                    (0, vitest_1.expect)((_q = token.revoked) !== null && _q !== void 0 ? _q : null).toBeNull();
                                }
                                _f = revokeSessionOverHTTP;
                                _o = {
                                    clientId: oauthClient.client_id,
                                    rollback: false
                                };
                                return [4 /*yield*/, getSessionToken(headers)];
                            case 9: return [4 /*yield*/, _f.apply(void 0, [(_o.sessionToken = _s.sent(),
                                        _o.transactionAccessTokenId = "transaction-only-access-token",
                                        _o)])];
                            case 10:
                                committed = _s.sent();
                                (0, vitest_1.expect)(committed).toEqual({ committed: true });
                                return [4 /*yield*/, waitForDispatches()];
                            case 11:
                                _s.sent();
                                (0, vitest_1.expect)(rp.received).toHaveLength(1);
                                _g = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 12:
                                _g.apply(void 0, [_s.sent()]).toBeNull();
                                return [4 /*yield*/, readClientTokenRevocation(oauthClient.client_id)];
                            case 13:
                                tokensAfterCommit = _s.sent();
                                for (_h = 0, _j = tokensAfterCommit.accessTokens; _h < _j.length; _h++) {
                                    token = _j[_h];
                                    (0, vitest_1.expect)(token.revoked).toBeInstanceOf(Date);
                                }
                                for (_k = 0, _l = tokensAfterCommit.refreshTokens; _k < _l.length; _k++) {
                                    token = _l[_k];
                                    (0, vitest_1.expect)((_r = token.revoked) !== null && _r !== void 0 ? _r : null).toBeNull();
                                }
                                return [4 /*yield*/, auth.$context];
                            case 14: return [4 /*yield*/, (_s.sent()).adapter.findOne({
                                    model: "oauthAccessToken",
                                    where: [{ field: "id", value: "transaction-only-access-token" }],
                                })];
                            case 15:
                                transactionOnlyToken = _s.sent();
                                (0, vitest_1.expect)(transactionOnlyToken === null || transactionOnlyToken === void 0 ? void 0 : transactionOnlyToken.revoked).toBeInstanceOf(Date);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("applies committed token revocation through the active adapter", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var signedIn, oauthClient, committed, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                signedIn = _c.sent();
                                headers = signedIn.headers;
                                return [4 /*yield*/, registerClient()];
                            case 2:
                                oauthClient = _c.sent();
                                return [4 /*yield*/, issueTokens({
                                        client: oauthClient,
                                        requestScopes: ["openid", "email", "profile"],
                                    })];
                            case 3:
                                _c.sent();
                                _a = revokeSessionOverHTTP;
                                _b = {
                                    rollback: false
                                };
                                return [4 /*yield*/, getSessionToken(headers)];
                            case 4: return [4 /*yield*/, _a.apply(void 0, [(_b.sessionToken = _c.sent(),
                                        _b.trackActiveAdapterWrites = true,
                                        _b)])];
                            case 5:
                                committed = _c.sent();
                                (0, vitest_1.expect)(committed).toEqual({
                                    committed: true,
                                    updatedModelsThroughActiveAdapter: ["oauthAccessToken"],
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("keeps the session and tokens active when a later hook vetoes deletion", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var signedIn, oauthClient, result, _a, _b, tokens, _i, _c, token;
                    var _d;
                    var _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                signedIn = _f.sent();
                                headers = signedIn.headers;
                                return [4 /*yield*/, registerClient()];
                            case 2:
                                oauthClient = _f.sent();
                                return [4 /*yield*/, issueTokens({ client: oauthClient })];
                            case 3:
                                _f.sent();
                                shouldVetoSessionDeletion = true;
                                _a = revokeSessionOverHTTP;
                                _d = {
                                    rollback: false
                                };
                                return [4 /*yield*/, getSessionToken(headers)];
                            case 4: return [4 /*yield*/, _a.apply(void 0, [(_d.sessionToken = _f.sent(),
                                        _d)])];
                            case 5:
                                result = _f.sent();
                                (0, vitest_1.expect)(result).toEqual({ committed: true });
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                            case 6:
                                _f.sent();
                                _b = vitest_1.expect;
                                return [4 /*yield*/, auth.api.getSession({ headers: headers })];
                            case 7:
                                _b.apply(void 0, [_f.sent()]).not.toBeNull();
                                (0, vitest_1.expect)(rp.received).toHaveLength(0);
                                return [4 /*yield*/, readClientTokenRevocation(oauthClient.client_id)];
                            case 8:
                                tokens = _f.sent();
                                for (_i = 0, _c = __spreadArray(__spreadArray([], tokens.accessTokens, true), tokens.refreshTokens, true); _i < _c.length; _i++) {
                                    token = _c[_i];
                                    (0, vitest_1.expect)((_e = token.revoked) !== null && _e !== void 0 ? _e : null).toBeNull();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("dispatches when RP-Initiated Logout tears down the session", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, tokens;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, registerClient()];
                            case 1:
                                oauthClient = _a.sent();
                                return [4 /*yield*/, issueTokens({ client: oauthClient })];
                            case 2:
                                tokens = _a.sent();
                                return [4 /*yield*/, client.oauth2.endSession({
                                        query: { id_token_hint: tokens.id_token },
                                    })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, waitForDispatches()];
                            case 4:
                                _a.sent();
                                (0, vitest_1.expect)(rp.received).toHaveLength(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("marks non-offline_access access + refresh tokens revoked, preserves offline_access refresh tokens", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, ctx, accessBefore, refreshBefore, _i, accessBefore_1, t, _a, refreshBefore_1, t, accessAfter, refreshAfter, _b, accessAfter_1, t, _c, refreshAfter_1, t;
                    var _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, registerClient()];
                            case 1:
                                oauthClient = _g.sent();
                                return [4 /*yield*/, issueTokens({ client: oauthClient })];
                            case 2:
                                _g.sent();
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                ctx = _g.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 4:
                                accessBefore = _g.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthRefreshToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 5:
                                refreshBefore = _g.sent();
                                (0, vitest_1.expect)(accessBefore.length).toBeGreaterThan(0);
                                (0, vitest_1.expect)(refreshBefore.length).toBeGreaterThan(0);
                                for (_i = 0, accessBefore_1 = accessBefore; _i < accessBefore_1.length; _i++) {
                                    t = accessBefore_1[_i];
                                    (0, vitest_1.expect)((_d = t.revoked) !== null && _d !== void 0 ? _d : null).toBeNull();
                                }
                                for (_a = 0, refreshBefore_1 = refreshBefore; _a < refreshBefore_1.length; _a++) {
                                    t = refreshBefore_1[_a];
                                    (0, vitest_1.expect)((_e = t.revoked) !== null && _e !== void 0 ? _e : null).toBeNull();
                                }
                                return [4 /*yield*/, client.signOut({ fetchOptions: { headers: headers } })];
                            case 6:
                                _g.sent();
                                return [4 /*yield*/, waitForDispatches()];
                            case 7:
                                _g.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 8:
                                accessAfter = _g.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthRefreshToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 9:
                                refreshAfter = _g.sent();
                                for (_b = 0, accessAfter_1 = accessAfter; _b < accessAfter_1.length; _b++) {
                                    t = accessAfter_1[_b];
                                    (0, vitest_1.expect)(t.revoked).toBeInstanceOf(Date);
                                }
                                // Offline access refresh tokens must survive (spec §2.7)
                                for (_c = 0, refreshAfter_1 = refreshAfter; _c < refreshAfter_1.length; _c++) {
                                    t = refreshAfter_1[_c];
                                    if (t.scopes.includes("offline_access")) {
                                        (0, vitest_1.expect)((_f = t.revoked) !== null && _f !== void 0 ? _f : null).toBeNull();
                                    }
                                    else {
                                        (0, vitest_1.expect)(t.revoked).toBeInstanceOf(Date);
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("revokes access tokens on session end even when no refresh token was issued", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, ctx, refreshBefore, accessBefore, _i, accessBefore_2, t, accessAfter, _a, accessAfter_2, t;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, registerClient()];
                            case 1:
                                oauthClient = _c.sent();
                                return [4 /*yield*/, issueTokens({
                                        client: oauthClient,
                                        requestScopes: ["openid", "email", "profile"],
                                    })];
                            case 2:
                                _c.sent();
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                ctx = _c.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthRefreshToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 4:
                                refreshBefore = _c.sent();
                                (0, vitest_1.expect)(refreshBefore).toHaveLength(0);
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 5:
                                accessBefore = _c.sent();
                                (0, vitest_1.expect)(accessBefore.length).toBeGreaterThan(0);
                                for (_i = 0, accessBefore_2 = accessBefore; _i < accessBefore_2.length; _i++) {
                                    t = accessBefore_2[_i];
                                    (0, vitest_1.expect)((_b = t.revoked) !== null && _b !== void 0 ? _b : null).toBeNull();
                                }
                                return [4 /*yield*/, client.signOut({ fetchOptions: { headers: headers } })];
                            case 6:
                                _c.sent();
                                return [4 /*yield*/, waitForDispatches()];
                            case 7:
                                _c.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 8:
                                accessAfter = _c.sent();
                                for (_a = 0, accessAfter_2 = accessAfter; _a < accessAfter_2.length; _a++) {
                                    t = accessAfter_2[_a];
                                    (0, vitest_1.expect)(t.revoked).toBeInstanceOf(Date);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("does not dispatch to clients without a backchannel_logout_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, registerClient({
                                    backchannel_logout_uri: undefined,
                                })];
                            case 1:
                                oauthClient = _a.sent();
                                return [4 /*yield*/, issueTokens({ client: oauthClient })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, client.signOut({ fetchOptions: { headers: headers } })];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 200); })];
                            case 4:
                                _a.sent();
                                (0, vitest_1.expect)(rp.received).toHaveLength(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("treats RP failures as non-fatal for the user-facing sign-out", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, rp.close()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, startMockRp({ status: 500 })];
                            case 2:
                                rp = _a.sent();
                                return [4 /*yield*/, registerClient({
                                        backchannel_logout_uri: "".concat(rp.publicUrl, "/logout/backchannel"),
                                    })];
                            case 3:
                                oauthClient = _a.sent();
                                return [4 /*yield*/, issueTokens({ client: oauthClient })];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, client.signOut({ fetchOptions: { headers: headers } })];
                            case 5:
                                result = _a.sent();
                                (0, vitest_1.expect)(result.error).toBeNull();
                                return [4 /*yield*/, waitForDispatches()];
                            case 6:
                                _a.sent();
                                (0, vitest_1.expect)(rp.received).toHaveLength(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("isolates a malformed pairwise client from revocation and healthy RP delivery", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var healthyClient, malformedClient, ctx, _i, _a, clientId, tokens, _b, _c, token;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, registerClient()];
                            case 1:
                                healthyClient = _d.sent();
                                return [4 /*yield*/, registerClient({ subject_type: "pairwise" })];
                            case 2:
                                malformedClient = _d.sent();
                                return [4 /*yield*/, issueTokens({ client: healthyClient })];
                            case 3:
                                _d.sent();
                                return [4 /*yield*/, issueTokens({ client: malformedClient })];
                            case 4:
                                _d.sent();
                                return [4 /*yield*/, auth.$context];
                            case 5:
                                ctx = _d.sent();
                                return [4 /*yield*/, ctx.adapter.update({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: malformedClient.client_id }],
                                        update: { redirectUris: [] },
                                    })];
                            case 6:
                                _d.sent();
                                return [4 /*yield*/, client.signOut({ fetchOptions: { headers: headers } })];
                            case 7:
                                _d.sent();
                                return [4 /*yield*/, waitForDispatches()];
                            case 8:
                                _d.sent();
                                (0, vitest_1.expect)(rp.received).toHaveLength(1);
                                _i = 0, _a = [
                                    healthyClient.client_id,
                                    malformedClient.client_id,
                                ];
                                _d.label = 9;
                            case 9:
                                if (!(_i < _a.length)) return [3 /*break*/, 12];
                                clientId = _a[_i];
                                return [4 /*yield*/, readClientTokenRevocation(clientId)];
                            case 10:
                                tokens = _d.sent();
                                (0, vitest_1.expect)(tokens.accessTokens.length).toBeGreaterThan(0);
                                for (_b = 0, _c = tokens.accessTokens; _b < _c.length; _b++) {
                                    token = _c[_b];
                                    (0, vitest_1.expect)(token.revoked).toBeInstanceOf(Date);
                                }
                                _d.label = 11;
                            case 11:
                                _i++;
                                return [3 /*break*/, 9];
                            case 12: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth back-channel logout (jwt plugin disabled)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, redirectUri, state, _a, auth, signInWithTestUser, customFetchImpl, headers, client;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = "http://localhost:3021";
                redirectUri = "http://localhost:5556/callback";
                state = "123";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                disableJwtPlugin: true,
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                client = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl },
                });
                (0, vitest_1.it)("revokes session-bound access tokens on sign-out even when the jwt plugin is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, codeVerifier, authUrl, callbackRedirectUrl, code, _a, body, tokenHeaders, tokens, ctx, before, _i, before_1, t, after, _b, after_1, t;
                    var _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        skip_consent: true,
                                        enable_end_session: true,
                                    },
                                })];
                            case 1:
                                oauthClient = _e.sent();
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw new Error("client registration failed");
                                }
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: "test",
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(baseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid", "profile"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                authUrl = _e.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _e.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                if (!code) {
                                    throw new Error("no authorization code in ".concat(callbackRedirectUrl));
                                }
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 4:
                                _a = _e.sent(), body = _a.body, tokenHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: tokenHeaders })];
                            case 5:
                                tokens = _e.sent();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeDefined();
                                return [4 /*yield*/, auth.$context];
                            case 6:
                                ctx = _e.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 7:
                                before = _e.sent();
                                (0, vitest_1.expect)(before.length).toBeGreaterThan(0);
                                for (_i = 0, before_1 = before; _i < before_1.length; _i++) {
                                    t = before_1[_i];
                                    (0, vitest_1.expect)((_d = t.revoked) !== null && _d !== void 0 ? _d : null).toBeNull();
                                }
                                // With no JWT plugin, the post-delete phase revokes tokens without
                                // attempting Logout Token delivery.
                                return [4 /*yield*/, client.signOut({ fetchOptions: { headers: headers } })];
                            case 8:
                                // With no JWT plugin, the post-delete phase revokes tokens without
                                // attempting Logout Token delivery.
                                _e.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 9:
                                after = _e.sent();
                                for (_b = 0, after_1 = after; _b < after_1.length; _b++) {
                                    t = after_1[_b];
                                    (0, vitest_1.expect)(t.revoked).toBeInstanceOf(Date);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth back-channel logout - secondaryStorage + preserveSessionInDatabase", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseUrl, redirectUri, state, store, _a, auth, signInWithTestUser, customFetchImpl, headers, client;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseUrl = "http://localhost:3030";
                redirectUri = "".concat(baseUrl, "/callback");
                state = "preserve-state";
                store = new Map();
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseUrl,
                        secondaryStorage: {
                            set: function (key, value) {
                                store.set(key, value);
                            },
                            get: function (key) {
                                return store.get(key) || null;
                            },
                            getAndDelete: function (key) {
                                var value = store.get(key) || null;
                                store.delete(key);
                                return value;
                            },
                            increment: function (key) {
                                var _a;
                                var count = Number((_a = store.get(key)) !== null && _a !== void 0 ? _a : 0) + 1;
                                store.set(key, String(count));
                                return count;
                            },
                            delete: function (key) {
                                store.delete(key);
                            },
                        },
                        session: {
                            storeSessionInDatabase: true,
                            preserveSessionInDatabase: true,
                        },
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                disableJwtPlugin: true,
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                client = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: baseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl },
                });
                (0, vitest_1.it)("revokes session-bound access tokens on sign-out when the row is preserved", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oauthClient, codeVerifier, authUrl, callbackRedirectUrl, code, _a, body, tokenHeaders, tokens, ctx, before, _i, before_2, t, after, _b, after_2, t;
                    var _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        skip_consent: true,
                                        enable_end_session: true,
                                    },
                                })];
                            case 1:
                                oauthClient = _e.sent();
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret)) {
                                    throw new Error("client registration failed");
                                }
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: "test",
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(baseUrl, "/api/auth/oauth2/authorize"),
                                        state: state,
                                        scopes: ["openid", "profile"],
                                        codeVerifier: codeVerifier,
                                    })];
                            case 2:
                                authUrl = _e.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        headers: headers,
                                        onError: function (context) {
                                            callbackRedirectUrl = context.response.headers.get("Location") || "";
                                        },
                                    })];
                            case 3:
                                _e.sent();
                                code = new URL(callbackRedirectUrl).searchParams.get("code");
                                if (!code) {
                                    throw new Error("no authorization code in ".concat(callbackRedirectUrl));
                                }
                                return [4 /*yield*/, (0, oauth2_1.authorizationCodeRequest)({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        redirectURI: redirectUri,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                    })];
                            case 4:
                                _a = _e.sent(), body = _a.body, tokenHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", { method: "POST", body: body, headers: tokenHeaders })];
                            case 5:
                                tokens = _e.sent();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeDefined();
                                return [4 /*yield*/, auth.$context];
                            case 6:
                                ctx = _e.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 7:
                                before = _e.sent();
                                (0, vitest_1.expect)(before.length).toBeGreaterThan(0);
                                for (_i = 0, before_2 = before; _i < before_2.length; _i++) {
                                    t = before_2[_i];
                                    (0, vitest_1.expect)((_d = t.revoked) !== null && _d !== void 0 ? _d : null).toBeNull();
                                }
                                return [4 /*yield*/, client.signOut({ fetchOptions: { headers: headers } })];
                            case 8:
                                _e.sent();
                                return [4 /*yield*/, ctx.adapter.findMany({
                                        model: "oauthAccessToken",
                                        where: [{ field: "clientId", value: oauthClient.client_id }],
                                    })];
                            case 9:
                                after = _e.sent();
                                for (_b = 0, after_2 = after; _b < after_2.length; _b++) {
                                    t = after_2[_b];
                                    (0, vitest_1.expect)(t.revoked).toBeInstanceOf(Date);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
