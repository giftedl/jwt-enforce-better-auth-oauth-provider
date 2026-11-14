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
var oauth2_1 = require("@better-auth/core/oauth2");
var memory_adapter_1 = require("@better-auth/memory-adapter");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var oauth_1 = require("../oauth");
var baseURL = "http://localhost:3000";
var apiURL = "".concat(baseURL, "/api/auth");
var rotateURL = "".concat(apiURL, "/oauth2/client/rotate-keys");
var introspectURL = "".concat(apiURL, "/oauth2/introspect");
function createKey(kid) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, privateKey, publicKey, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, jose_1.generateKeyPair)("ES256", {
                        extractable: true,
                    })];
                case 1:
                    _a = _d.sent(), privateKey = _a.privateKey, publicKey = _a.publicKey;
                    _c = {
                        kid: kid
                    };
                    return [4 /*yield*/, (0, jose_1.exportJWK)(privateKey)];
                case 2:
                    _c.privateJwk = _d.sent();
                    _b = [{}];
                    return [4 /*yield*/, (0, jose_1.exportJWK)(publicKey)];
                case 3: return [2 /*return*/, (_c.publicJwk = __assign.apply(void 0, [__assign.apply(void 0, _b.concat([(_d.sent())])), { kid: kid, alg: "ES256" }]),
                        _c)];
            }
        });
    });
}
function sign(clientId, key, audience) {
    if (audience === void 0) { audience = rotateURL; }
    return (0, oauth2_1.signPrivateKeyJwtClientAssertion)({
        clientId: clientId,
        tokenEndpoint: audience,
        privateKeyJwk: key.privateJwk,
        kid: key.kid,
        algorithm: "ES256",
    });
}
function setup() {
    return __awaiter(this, arguments, void 0, function (testWith, authBaseURL) {
        function createClient(keys) {
            return __awaiter(this, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    redirect_uris: ["http://localhost:5000/callback"],
                                    application_type: "native",
                                    skip_consent: true,
                                    token_endpoint_auth_method: "private_key_jwt",
                                    jwks: { keys: keys.map(function (key) { return key.publicJwk; }) },
                                },
                            })];
                        case 1:
                            client = _a.sent();
                            return [2 /*return*/, client.client_id];
                    }
                });
            });
        }
        /** POSTs the rotation request the way a client would. */
        function rotate(input) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b, _c, _d, _e;
                var _f, _g, _h;
                var _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            _a = customFetchImpl;
                            _b = [rotateURL];
                            _f = {
                                method: "POST",
                                headers: { "content-type": "application/json" }
                            };
                            _d = (_c = JSON).stringify;
                            _g = {
                                client_assertion_type: oauth2_1.CLIENT_ASSERTION_TYPE
                            };
                            if (!((_j = input.assertion) !== null && _j !== void 0)) return [3 /*break*/, 1];
                            _e = _j;
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, sign(input.clientId, input.signer, input.audience)];
                        case 2:
                            _e = (_k.sent());
                            _k.label = 3;
                        case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_f.body = _d.apply(_c, [(_g.client_assertion = _e,
                                        _g.jwks = input.jwks !== undefined
                                            ? input.jwks
                                            : { keys: input.next.map(function (key) { return key.publicJwk; }) },
                                        _g)]),
                                    _f)]))];
                        case 4:
                            response = _k.sent();
                            _h = {
                                status: response.status,
                                headers: response.headers
                            };
                            return [4 /*yield*/, response.json()];
                        case 5: return [2 /*return*/, (_h.body = (_k.sent()),
                                _h)];
                    }
                });
            });
        }
        /** Authenticates at the introspection endpoint, which verifies the client first. */
        function authenticate(clientId, key) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b, _c;
                var _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _a = customFetchImpl;
                            _b = [introspectURL];
                            _d = {
                                method: "POST",
                                headers: { "content-type": "application/x-www-form-urlencoded" }
                            };
                            _c = URLSearchParams.bind;
                            _e = {
                                token: "not-a-real-token",
                                client_assertion_type: oauth2_1.CLIENT_ASSERTION_TYPE
                            };
                            return [4 /*yield*/, sign(clientId, key, introspectURL)];
                        case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([(_d.body = new (_c.apply(URLSearchParams, [void 0, (_e.client_assertion = _f.sent(),
                                        _e)]))(),
                                    _d)]))];
                        case 2:
                            response = _f.sent();
                            return [2 /*return*/, response.status];
                    }
                });
            });
        }
        var trustedClients, _a, auth, signInWithTestUser, customFetchImpl, headers;
        if (testWith === void 0) { testWith = "sqlite"; }
        if (authBaseURL === void 0) { authBaseURL = baseURL; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trustedClients = new Set();
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: authBaseURL,
                            trustedOrigins: ["https://trusted.example.com"],
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                    cachedTrustedClients: trustedClients,
                                    allowClientKeyRotation: true,
                                }),
                            ],
                        }, { testWith: testWith })];
                case 1:
                    _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl;
                    return [4 /*yield*/, signInWithTestUser()];
                case 2:
                    headers = (_b.sent()).headers;
                    return [2 /*return*/, {
                            auth: auth,
                            headers: headers,
                            trustedClients: trustedClients,
                            createClient: createClient,
                            rotate: rotate,
                            authenticate: authenticate,
                        }];
            }
        });
    });
}
(0, vitest_1.describe)("client key rotation", function () { return __awaiter(void 0, void 0, void 0, function () {
    var env, auth, headers, trustedClients, createClient, rotate, authenticate;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setup()];
            case 1:
                env = _a.sent();
                auth = env.auth, headers = env.headers, trustedClients = env.trustedClients, createClient = env.createClient, rotate = env.rotate, authenticate = env.authenticate;
                storageCases(env);
                (0, vitest_1.it)("is off unless the provider opts in", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var closed, response, _a, _b, _c, _d, _e, _f;
                    var _g, _h, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                                    baseURL: baseURL,
                                    plugins: [
                                        (0, jwt_1.jwt)(),
                                        (0, oauth_1.oauthProvider)({ loginPage: "/login", consentPage: "/consent" }),
                                    ],
                                })];
                            case 1:
                                closed = _k.sent();
                                _b = (_a = closed).customFetchImpl;
                                _c = [rotateURL];
                                _g = {
                                    method: "POST",
                                    headers: { "content-type": "application/json" }
                                };
                                _e = (_d = JSON).stringify;
                                _h = {
                                    client_assertion_type: oauth2_1.CLIENT_ASSERTION_TYPE,
                                    client_assertion: "a.b.c"
                                };
                                _j = {};
                                return [4 /*yield*/, createKey("k")];
                            case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([(_g.body = _e.apply(_d, [(_h.jwks = (_j.keys = [(_k.sent()).publicJwk], _j),
                                            _h)]),
                                        _g)]))];
                            case 3:
                                response = _k.sent();
                                (0, vitest_1.expect)(response.status).toBe(403);
                                _f = vitest_1.expect;
                                return [4 /*yield*/, response.json()];
                            case 4:
                                _f.apply(void 0, [_k.sent()]).toMatchObject({ error: "access_denied" });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("replaces the keys on the client's own authority", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oldKey, newKey, clientId, rotated, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createKey("old")];
                            case 1:
                                oldKey = _c.sent();
                                return [4 /*yield*/, createKey("new")];
                            case 2:
                                newKey = _c.sent();
                                return [4 /*yield*/, createClient([oldKey])];
                            case 3:
                                clientId = _c.sent();
                                return [4 /*yield*/, rotate({ clientId: clientId, signer: oldKey, next: [newKey] })];
                            case 4:
                                rotated = _c.sent();
                                (0, vitest_1.expect)(rotated.status).toBe(200);
                                (0, vitest_1.expect)(rotated.headers.get("cache-control")).toContain("no-store");
                                (0, vitest_1.expect)(rotated.body.client_id).toBe(clientId);
                                (0, vitest_1.expect)(rotated.body.jwks.keys.map(function (key) { return key.kid; })).toEqual(["new"]);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, newKey)];
                            case 5:
                                _a.apply(void 0, [_c.sent()]).toBe(200);
                                _b = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, oldKey)];
                            case 6:
                                _b.apply(void 0, [_c.sent()]).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rolls a key in two steps without breaking the old key in between", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oldKey, newKey, clientId, added, _a, _b, dropped, _c, _d, _e, _f, attackerKey, takeover, _g;
                    var _h, _j;
                    return __generator(this, function (_k) {
                        switch (_k.label) {
                            case 0: return [4 /*yield*/, createKey("old")];
                            case 1:
                                oldKey = _k.sent();
                                return [4 /*yield*/, createKey("new")];
                            case 2:
                                newKey = _k.sent();
                                return [4 /*yield*/, createClient([oldKey])];
                            case 3:
                                clientId = _k.sent();
                                return [4 /*yield*/, rotate({
                                        clientId: clientId,
                                        signer: oldKey,
                                        next: [oldKey, newKey],
                                    })];
                            case 4:
                                added = _k.sent();
                                (0, vitest_1.expect)(added.status).toBe(200);
                                _a = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, oldKey)];
                            case 5:
                                _a.apply(void 0, [_k.sent()]).toBe(200);
                                _b = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, newKey)];
                            case 6:
                                _b.apply(void 0, [_k.sent()]).toBe(200);
                                _d = (_c = auth.api).rotateClientKeys;
                                _h = {};
                                _j = {
                                    client_assertion_type: oauth2_1.CLIENT_ASSERTION_TYPE
                                };
                                return [4 /*yield*/, sign(clientId, newKey)];
                            case 7: return [4 /*yield*/, _d.apply(_c, [(_h.body = (_j.client_assertion = _k.sent(),
                                        _j.jwks = { keys: [newKey.publicJwk] },
                                        _j),
                                        _h)])];
                            case 8:
                                dropped = _k.sent();
                                (0, vitest_1.expect)(dropped.jwks.keys).toHaveLength(1);
                                _e = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, oldKey)];
                            case 9:
                                _e.apply(void 0, [_k.sent()]).toBe(401);
                                _f = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, newKey)];
                            case 10:
                                _f.apply(void 0, [_k.sent()]).toBe(200);
                                return [4 /*yield*/, createKey("attacker")];
                            case 11:
                                attackerKey = _k.sent();
                                return [4 /*yield*/, rotate({
                                        clientId: clientId,
                                        signer: oldKey,
                                        next: [attackerKey],
                                    })];
                            case 12:
                                takeover = _k.sent();
                                (0, vitest_1.expect)(takeover.status).toBe(401);
                                (0, vitest_1.expect)(takeover.body.error).toBe("invalid_client");
                                _g = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, attackerKey)];
                            case 13:
                                _g.apply(void 0, [_k.sent()]).toBe(401);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("only accepts an assertion addressed to the rotation endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oldKey, clientId, next, _i, _a, audience, response, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createKey("old")];
                            case 1:
                                oldKey = _c.sent();
                                return [4 /*yield*/, createClient([oldKey])];
                            case 2:
                                clientId = _c.sent();
                                return [4 /*yield*/, createKey("new")];
                            case 3:
                                next = [_c.sent()];
                                _i = 0, _a = [
                                    "".concat(apiURL, "/oauth2/token"),
                                    introspectURL,
                                    apiURL,
                                    baseURL,
                                ];
                                _c.label = 4;
                            case 4:
                                if (!(_i < _a.length)) return [3 /*break*/, 7];
                                audience = _a[_i];
                                return [4 /*yield*/, rotate({
                                        clientId: clientId,
                                        signer: oldKey,
                                        next: next,
                                        audience: audience,
                                    })];
                            case 5:
                                response = _c.sent();
                                (0, vitest_1.expect)(response.status, audience).toBe(401);
                                (0, vitest_1.expect)(response.body.error).toBe("invalid_client");
                                _c.label = 6;
                            case 6:
                                _i++;
                                return [3 /*break*/, 4];
                            case 7:
                                _b = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, oldKey)];
                            case 8:
                                _b.apply(void 0, [_c.sent()]).toBe(200);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("accepts an audience list only when it names the rotation endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oldKey, clientId, signFor, elsewhere, _a, addressed, _b;
                    var _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, createKey("old")];
                            case 1:
                                oldKey = _e.sent();
                                return [4 /*yield*/, createClient([oldKey])];
                            case 2:
                                clientId = _e.sent();
                                signFor = function (audience) { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _b = (_a = new jose_1.SignJWT({})
                                                    .setProtectedHeader({ alg: "ES256", kid: oldKey.kid })
                                                    .setIssuer(clientId)
                                                    .setSubject(clientId)
                                                    .setAudience(audience)
                                                    .setIssuedAt()
                                                    .setExpirationTime("1m")
                                                    .setJti(crypto.randomUUID()))
                                                    .sign;
                                                return [4 /*yield*/, (0, jose_1.importJWK)(oldKey.privateJwk, "ES256")];
                                            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                                        }
                                    });
                                }); };
                                _a = rotate;
                                _c = {
                                    clientId: clientId,
                                    signer: oldKey
                                };
                                return [4 /*yield*/, createKey("new")];
                            case 3:
                                _c.next = [_e.sent()];
                                return [4 /*yield*/, signFor([apiURL, baseURL, "".concat(apiURL, "/oauth2/token")])];
                            case 4: return [4 /*yield*/, _a.apply(void 0, [(_c.assertion = _e.sent(),
                                        _c)])];
                            case 5:
                                elsewhere = _e.sent();
                                _b = rotate;
                                _d = {
                                    clientId: clientId,
                                    signer: oldKey
                                };
                                return [4 /*yield*/, createKey("new")];
                            case 6:
                                _d.next = [_e.sent()];
                                return [4 /*yield*/, signFor([apiURL, rotateURL])];
                            case 7: return [4 /*yield*/, _b.apply(void 0, [(_d.assertion = _e.sent(),
                                        _d)])];
                            case 8:
                                addressed = _e.sent();
                                (0, vitest_1.expect)(elsewhere.status).toBe(401);
                                (0, vitest_1.expect)(addressed.status).toBe(200);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a malformed or unsafe replacement key set before touching the client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oldKey, clientId, _i, _a, jwks, response, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createKey("old")];
                            case 1:
                                oldKey = _c.sent();
                                return [4 /*yield*/, createClient([oldKey])];
                            case 2:
                                clientId = _c.sent();
                                _i = 0, _a = [
                                    { keys: [] },
                                    { keys: [{ kty: "oct", k: "c2VjcmV0" }] },
                                    { keys: [__assign(__assign({}, oldKey.privateJwk), { kid: "leaky", alg: "ES256" })] },
                                ];
                                _c.label = 3;
                            case 3:
                                if (!(_i < _a.length)) return [3 /*break*/, 6];
                                jwks = _a[_i];
                                return [4 /*yield*/, rotate({
                                        clientId: clientId,
                                        signer: oldKey,
                                        next: [],
                                        jwks: jwks,
                                    })];
                            case 4:
                                response = _c.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                (0, vitest_1.expect)(response.body.error).toBe("invalid_client_metadata");
                                _c.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 3];
                            case 6:
                                _b = vitest_1.expect;
                                return [4 /*yield*/, authenticate(clientId, oldKey)];
                            case 7:
                                _b.apply(void 0, [_c.sent()]).toBe(200);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("leaves clients that do not hold inline keys to their own rotation path", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var signer, next, secretClient, jwksUriClient, _i, _a, client, response;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, createKey("signer")];
                            case 1:
                                signer = _b.sent();
                                return [4 /*yield*/, createKey("next")];
                            case 2:
                                next = [_b.sent()];
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: ["http://localhost:5000/callback"],
                                            application_type: "native",
                                            skip_consent: true,
                                        },
                                    })];
                            case 3:
                                secretClient = _b.sent();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: ["http://localhost:5000/callback"],
                                            application_type: "native",
                                            skip_consent: true,
                                            token_endpoint_auth_method: "private_key_jwt",
                                            jwks_uri: "https://trusted.example.com/jwks.json",
                                        },
                                    })];
                            case 4:
                                jwksUriClient = _b.sent();
                                _i = 0, _a = [secretClient, jwksUriClient];
                                _b.label = 5;
                            case 5:
                                if (!(_i < _a.length)) return [3 /*break*/, 8];
                                client = _a[_i];
                                return [4 /*yield*/, rotate({
                                        clientId: client.client_id,
                                        signer: signer,
                                        next: next,
                                    })];
                            case 6:
                                response = _b.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                (0, vitest_1.expect)(response.body.error).toBe("invalid_client");
                                _b.label = 7;
                            case 7:
                                _i++;
                                return [3 /*break*/, 5];
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("refuses a trusted client before spending its assertion", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oldKey, newKey, clientId, assertion, refused, accepted;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, createKey("old")];
                            case 1:
                                oldKey = _a.sent();
                                return [4 /*yield*/, createKey("new")];
                            case 2:
                                newKey = _a.sent();
                                return [4 /*yield*/, createClient([oldKey])];
                            case 3:
                                clientId = _a.sent();
                                return [4 /*yield*/, sign(clientId, oldKey)];
                            case 4:
                                assertion = _a.sent();
                                trustedClients.add(clientId);
                                return [4 /*yield*/, rotate({
                                        clientId: clientId,
                                        signer: oldKey,
                                        next: [newKey],
                                        assertion: assertion,
                                    })];
                            case 5:
                                refused = _a.sent();
                                trustedClients.delete(clientId);
                                (0, vitest_1.expect)(refused.status).toBe(400);
                                (0, vitest_1.expect)(refused.body.error_description).toContain("updated manually");
                                return [4 /*yield*/, rotate({
                                        clientId: clientId,
                                        signer: oldKey,
                                        next: [newKey],
                                        assertion: assertion,
                                    })];
                            case 6:
                                accepted = _a.sent();
                                (0, vitest_1.expect)(accepted.status).toBe(200);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/issues/10800
 */
(0, vitest_1.describe)("client key rotation with a trailing-slash baseURL", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, createClient, rotate;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, setup("sqlite", "".concat(apiURL, "/"))];
            case 1:
                _a = _b.sent(), createClient = _a.createClient, rotate = _a.rotate;
                (0, vitest_1.it)("accepts an assertion addressed to the URL the client calls", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var oldKey, clientId, response, _a;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createKey("old")];
                            case 1:
                                oldKey = _c.sent();
                                return [4 /*yield*/, createClient([oldKey])];
                            case 2:
                                clientId = _c.sent();
                                _a = rotate;
                                _b = {
                                    clientId: clientId,
                                    signer: oldKey
                                };
                                return [4 /*yield*/, createKey("new")];
                            case 3: return [4 /*yield*/, _a.apply(void 0, [(_b.next = [_c.sent()],
                                        _b)])];
                            case 4:
                                response = _c.sent();
                                (0, vitest_1.expect)(response.status).toBe(200);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * A rotation assertion must be single-use: replaying a captured one while its
 * signing key is still current would hand the client's keys to whoever holds
 * it. The memory adapter does not enforce the primary key the jti tombstone
 * relies on, and `generateId: "serial"` replaces the tombstone's derived id.
 */
(0, vitest_1.describe)("client key rotation without single-use assertions", function () {
    var rotationEnabled = (0, oauth_1.oauthProvider)({
        loginPage: "/login",
        consentPage: "/consent",
        allowClientKeyRotation: true,
    });
    (0, vitest_1.it)("refuses to start on the memory adapter", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        baseURL: baseURL,
                        database: (0, memory_adapter_1.memoryAdapter)({
                            account: [],
                            jwks: [],
                            oauthClient: [],
                            session: [],
                            user: [],
                            verification: [],
                        }),
                        plugins: [(0, jwt_1.jwt)(), rotationEnabled],
                    })).rejects.toThrow("single-use")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses to start with generateId: "serial"', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        baseURL: baseURL,
                        advanced: { database: { generateId: "serial" } },
                        plugins: [(0, jwt_1.jwt)(), rotationEnabled],
                    })).rejects.toThrow("single-use")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
/** Cases that depend on how the database enforces keys and guarded writes. */
function storageCases(env) {
    var _this = this;
    var auth = env.auth, createClient = env.createClient, rotate = env.rotate, authenticate = env.authenticate;
    (0, vitest_1.it)("accepts each assertion once", function () { return __awaiter(_this, void 0, void 0, function () {
        var signer, clientId, assertion, added, first, replay, _a, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, createKey("signer")];
                case 1:
                    signer = _e.sent();
                    return [4 /*yield*/, createClient([signer])];
                case 2:
                    clientId = _e.sent();
                    return [4 /*yield*/, sign(clientId, signer)];
                case 3:
                    assertion = _e.sent();
                    return [4 /*yield*/, createKey("added")];
                case 4:
                    added = _e.sent();
                    return [4 /*yield*/, rotate({
                            clientId: clientId,
                            signer: signer,
                            next: [signer, added],
                            assertion: assertion,
                        })];
                case 5:
                    first = _e.sent();
                    _a = rotate;
                    _d = {
                        clientId: clientId,
                        signer: signer
                    };
                    _b = [signer];
                    return [4 /*yield*/, createKey("attacker")];
                case 6: return [4 /*yield*/, _a.apply(void 0, [(_d.next = _b.concat([_e.sent()]),
                            _d.assertion = assertion,
                            _d)])];
                case 7:
                    replay = _e.sent();
                    (0, vitest_1.expect)(first.status).toBe(200);
                    (0, vitest_1.expect)(replay.status).toBe(400);
                    (0, vitest_1.expect)(replay.body.error_description).toContain("already been used");
                    _c = vitest_1.expect;
                    return [4 /*yield*/, authenticate(clientId, added)];
                case 8:
                    _c.apply(void 0, [_e.sent()]).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("loses to a change that lands between verification and write", function () { return __awaiter(_this, void 0, void 0, function () {
        var oldKey, newKey, ownerKey, clientId, context, incrementOne, response, _a, _b, _c;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, createKey("old")];
                case 1:
                    oldKey = _d.sent();
                    return [4 /*yield*/, createKey("new")];
                case 2:
                    newKey = _d.sent();
                    return [4 /*yield*/, createKey("owner")];
                case 3:
                    ownerKey = _d.sent();
                    return [4 /*yield*/, createClient([oldKey])];
                case 4:
                    clientId = _d.sent();
                    return [4 /*yield*/, auth.$context];
                case 5:
                    context = _d.sent();
                    incrementOne = context.adapter.incrementOne;
                    vitest_1.vi.spyOn(context.adapter, "incrementOne").mockImplementationOnce(function (input) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                // The owner replaces the keys after the assertion was verified.
                                return [4 /*yield*/, context.adapter.update({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: clientId }],
                                        update: { jwks: JSON.stringify({ keys: [ownerKey.publicJwk] }) },
                                    })];
                                case 1:
                                    // The owner replaces the keys after the assertion was verified.
                                    _a.sent();
                                    return [2 /*return*/, incrementOne(input)];
                            }
                        });
                    }); });
                    return [4 /*yield*/, rotate({
                            clientId: clientId,
                            signer: oldKey,
                            next: [newKey],
                        })];
                case 6:
                    response = _d.sent();
                    (0, vitest_1.expect)(response.status).toBe(409);
                    (0, vitest_1.expect)(response.body.error).toBe("invalid_request");
                    (0, vitest_1.expect)(response.headers.get("cache-control")).toContain("no-store");
                    _a = vitest_1.expect;
                    return [4 /*yield*/, authenticate(clientId, ownerKey)];
                case 7:
                    _a.apply(void 0, [_d.sent()]).toBe(200);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, authenticate(clientId, newKey)];
                case 8:
                    _b.apply(void 0, [_d.sent()]).toBe(401);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, authenticate(clientId, oldKey)];
                case 9:
                    _c.apply(void 0, [_d.sent()]).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
}
(0, vitest_1.describe)("client key rotation storage (postgres)", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = storageCases;
                return [4 /*yield*/, setup("postgres")];
            case 1:
                _a.apply(void 0, [_b.sent()]);
                return [2 /*return*/];
        }
    });
}); });
