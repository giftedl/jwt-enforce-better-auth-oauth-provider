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
var oauth2_1 = require("@better-auth/core/oauth2");
var memory_adapter_1 = require("@better-auth/memory-adapter");
var hex_1 = require("@better-auth/utils/hex");
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var oauth2_2 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
var schema_1 = require("./schema");
var client_assertion_1 = require("./utils/client-assertion");
(0, vitest_1.describe)("private_key_jwt authentication", function () { return __awaiter(void 0, void 0, void 0, function () {
    function signAssertion(overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var cid, now, builder;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                cid = (_a = overrides === null || overrides === void 0 ? void 0 : overrides.clientId) !== null && _a !== void 0 ? _a : assertionClient.client_id;
                now = Math.floor(Date.now() / 1000);
                builder = new jose_1.SignJWT({})
                    .setProtectedHeader({
                    alg: "RS256",
                    kid: (_b = overrides === null || overrides === void 0 ? void 0 : overrides.kid) !== null && _b !== void 0 ? _b : "test-key-1",
                })
                    .setIssuer(cid)
                    .setSubject(cid)
                    .setAudience((_c = overrides === null || overrides === void 0 ? void 0 : overrides.aud) !== null && _c !== void 0 ? _c : tokenEndpoint)
                    .setIssuedAt(now)
                    .setExpirationTime((_d = overrides === null || overrides === void 0 ? void 0 : overrides.exp) !== null && _d !== void 0 ? _d : now + 120);
                if (!(overrides === null || overrides === void 0 ? void 0 : overrides.omitJti)) {
                    builder.setJti((_e = overrides === null || overrides === void 0 ? void 0 : overrides.jti) !== null && _e !== void 0 ? _e : crypto.randomUUID());
                }
                return [2 /*return*/, builder.sign((_f = overrides === null || overrides === void 0 ? void 0 : overrides.key) !== null && _f !== void 0 ? _f : rsaPrivateKey)];
            });
        });
    }
    function getAuthCode(clientId_1, codeVerifier_1) {
        return __awaiter(this, arguments, void 0, function (clientId, codeVerifier, scopes) {
            var authUrl, callbackUrl;
            if (scopes === void 0) { scopes = ["openid", "profile"]; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, oauth2_2.createAuthorizationURL)({
                            id: "test",
                            options: { clientId: clientId, redirectURI: redirectUri },
                            redirectURI: "",
                            authorizationEndpoint: "".concat(authServerBaseUrl, "/api/auth/oauth2/authorize"),
                            state: "test-state",
                            scopes: scopes,
                            codeVerifier: codeVerifier,
                        })];
                    case 1:
                        authUrl = _a.sent();
                        callbackUrl = "";
                        return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                onError: function (ctx) {
                                    callbackUrl = ctx.response.headers.get("Location") || "";
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, new URL(callbackUrl).searchParams.get("code")];
                }
            });
        });
    }
    function exchangeCodeForTokens(_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var _c = _b.clientId, clientId = _c === void 0 ? assertionClient.client_id : _c, code = _b.code, codeVerifier = _b.codeVerifier, assertion = _b.assertion;
            return __generator(this, function (_d) {
                return [2 /*return*/, client.$fetch("/oauth2/token", {
                        method: "POST",
                        body: new URLSearchParams({
                            grant_type: "authorization_code",
                            code: code,
                            redirect_uri: redirectUri,
                            client_id: clientId,
                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                            client_assertion: assertion,
                            code_verifier: codeVerifier,
                        }),
                        headers: {
                            "content-type": "application/x-www-form-urlencoded",
                        },
                    })];
            });
        });
    }
    function createDiscoveredClientVerifier(input) {
        return __awaiter(this, void 0, void 0, function () {
            var opts, instance, context;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = {
                            loginPage: "/login",
                            consentPage: "/consent",
                            extensions: [
                                {
                                    clientDiscovery: {
                                        id: input.clientDiscoveryId,
                                        matches: function (candidateClientId) {
                                            return candidateClientId === input.clientId;
                                        },
                                        resolve: function (_ctx, _clientId, existingClient) { return existingClient; },
                                        fetchClientMetadataResource: input.fetchClientMetadataResource,
                                    },
                                },
                            ],
                        };
                        return [4 /*yield*/, (0, test_1.getTestInstance)({
                                baseURL: input.baseURL,
                                plugins: [(0, jwt_1.jwt)(), (0, oauth_1.oauthProvider)(opts)],
                            })];
                    case 1:
                        instance = _a.sent();
                        return [4 /*yield*/, instance.auth.$context];
                    case 2:
                        context = _a.sent();
                        return [4 /*yield*/, context.adapter.create({
                                model: "oauthClient",
                                data: {
                                    clientId: input.clientId,
                                    clientDiscoveryId: input.clientDiscoveryId,
                                    name: "Discovered private_key_jwt client",
                                    redirectUris: ["https://client.example.com/callback"],
                                    tokenEndpointAuthMethod: "private_key_jwt",
                                    applicationType: "web",
                                    grantTypes: ["authorization_code"],
                                    responseTypes: ["code"],
                                    jwksUri: input.jwksUri,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                },
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                ctx: { context: context },
                                opts: opts,
                            }];
                }
            });
        });
    }
    function signDiscoveredClientAssertion(input) {
        return __awaiter(this, void 0, void 0, function () {
            var now;
            return __generator(this, function (_a) {
                now = Math.floor(Date.now() / 1000);
                return [2 /*return*/, new jose_1.SignJWT({})
                        .setProtectedHeader({ alg: "RS256", kid: input.keyId })
                        .setIssuer(input.clientId)
                        .setSubject(input.clientId)
                        .setAudience(input.audience)
                        .setIssuedAt(now)
                        .setExpirationTime(now + 120)
                        .setJti(crypto.randomUUID())
                        .sign(input.key)];
            });
        });
    }
    var authServerBaseUrl, customIssuer, rpBaseUrl, tokenEndpoint, introspectEndpoint, revokeEndpoint, redirectUri, discoveryMetadataFetch, _a, auth, signInWithTestUser, customFetchImpl, headers, client, assertionClient, jwksUriClient, secretClient, rsaPrivateKey, rsaPrivateJwk, rsaPublicJwk;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                customIssuer = "https://issuer.example.com";
                rpBaseUrl = "http://localhost:5000";
                tokenEndpoint = "".concat(authServerBaseUrl, "/api/auth/oauth2/token");
                introspectEndpoint = "".concat(authServerBaseUrl, "/api/auth/oauth2/introspect");
                revokeEndpoint = "".concat(authServerBaseUrl, "/api/auth/oauth2/revoke");
                redirectUri = "".concat(rpBaseUrl, "/callback");
                discoveryMetadataFetch = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw new Error("managed client must not use a discovery transport");
                    });
                }); });
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        trustedOrigins: ["https://trusted.example.com"],
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: customIssuer } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                assertionMaxLifetime: 300,
                                extensions: [
                                    {
                                        clientDiscovery: {
                                            id: "test-discovery",
                                            matches: function () { return false; },
                                            resolve: function () { return null; },
                                            fetchClientMetadataResource: discoveryMetadataFetch,
                                        },
                                    },
                                ],
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
                    baseURL: authServerBaseUrl,
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                (0, vitest_1.afterEach)(function () {
                    vitest_1.vi.unstubAllGlobals();
                    vitest_1.vi.restoreAllMocks();
                });
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var keyPair;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, jose_1.generateKeyPair)("RS256", { extractable: true })];
                            case 1:
                                keyPair = _a.sent();
                                rsaPrivateKey = keyPair.privateKey;
                                return [4 /*yield*/, (0, jose_1.exportJWK)(keyPair.privateKey)];
                            case 2:
                                rsaPrivateJwk = _a.sent();
                                return [4 /*yield*/, (0, jose_1.exportJWK)(keyPair.publicKey)];
                            case 3:
                                rsaPublicJwk = _a.sent();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                            token_endpoint_auth_method: "private_key_jwt",
                                            jwks: {
                                                keys: [
                                                    __assign(__assign({}, rsaPublicJwk), { kid: "test-key-1", alg: "RS256", use: "sig" }),
                                                ],
                                            },
                                        },
                                    })];
                            case 4:
                                // Register a private_key_jwt client
                                assertionClient = (_a.sent());
                                (0, vitest_1.expect)(assertionClient.client_id).toBeDefined();
                                // private_key_jwt clients should NOT get a client_secret
                                (0, vitest_1.expect)(assertionClient.client_secret).toBeUndefined();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                            token_endpoint_auth_method: "private_key_jwt",
                                            jwks_uri: "https://trusted.example.com/.well-known/jwks.json",
                                        },
                                    })];
                            case 5:
                                jwksUriClient = (_a.sent());
                                (0, vitest_1.expect)(jwksUriClient.client_id).toBeDefined();
                                (0, vitest_1.expect)(jwksUriClient.client_secret).toBeUndefined();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            redirect_uris: [redirectUri],
                                            application_type: "native",
                                            skip_consent: true,
                                        },
                                    })];
                            case 6:
                                // Register a normal client_secret_post client for auth method enforcement test
                                secretClient = (_a.sent());
                                (0, vitest_1.expect)(secretClient.client_secret).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("isolates discovery-owned JWKS caches between provider instances", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, jwksUri, clientDiscoveryId, keyId, _a, keyPairA, keyPairB, _b, publicJwkA, publicJwkB, transportA, transportB, providerA, providerB, audienceA, audienceB, _c, _d, _e, _f, _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                clientId = "https://cache-isolation.example.com/client.json";
                                jwksUri = "https://cache-isolation.example.com/jwks.json";
                                clientDiscoveryId = "shared-cache-isolation-discovery";
                                keyId = "shared-key-id";
                                return [4 /*yield*/, Promise.all([
                                        (0, jose_1.generateKeyPair)("RS256", { extractable: true }),
                                        (0, jose_1.generateKeyPair)("RS256", { extractable: true }),
                                    ])];
                            case 1:
                                _a = _j.sent(), keyPairA = _a[0], keyPairB = _a[1];
                                return [4 /*yield*/, Promise.all([
                                        (0, jose_1.exportJWK)(keyPairA.publicKey),
                                        (0, jose_1.exportJWK)(keyPairB.publicKey),
                                    ])];
                            case 2:
                                _b = _j.sent(), publicJwkA = _b[0], publicJwkB = _b[1];
                                transportA = vitest_1.vi.fn().mockResolvedValue(Response.json({
                                    keys: [__assign(__assign({}, publicJwkA), { kid: keyId, alg: "RS256", use: "sig" })],
                                }));
                                transportB = vitest_1.vi.fn().mockResolvedValue(Response.json({
                                    keys: [__assign(__assign({}, publicJwkB), { kid: keyId, alg: "RS256", use: "sig" })],
                                }));
                                return [4 /*yield*/, createDiscoveredClientVerifier({
                                        baseURL: "https://provider-a.example.com",
                                        clientId: clientId,
                                        clientDiscoveryId: clientDiscoveryId,
                                        fetchClientMetadataResource: transportA,
                                        jwksUri: jwksUri,
                                    })];
                            case 3:
                                providerA = _j.sent();
                                return [4 /*yield*/, createDiscoveredClientVerifier({
                                        baseURL: "https://provider-b.example.com",
                                        clientId: clientId,
                                        clientDiscoveryId: clientDiscoveryId,
                                        fetchClientMetadataResource: transportB,
                                        jwksUri: jwksUri,
                                    })];
                            case 4:
                                providerB = _j.sent();
                                audienceA = "https://provider-a.example.com/oauth2/token";
                                audienceB = "https://provider-b.example.com/oauth2/token";
                                _c = vitest_1.expect;
                                _d = client_assertion_1.verifyClientAssertion;
                                _e = [providerA.ctx,
                                    providerA.opts];
                                return [4 /*yield*/, signDiscoveredClientAssertion({
                                        audience: audienceA,
                                        clientId: clientId,
                                        key: keyPairA.privateKey,
                                        keyId: keyId,
                                    })];
                            case 5: return [4 /*yield*/, _c.apply(void 0, [_d.apply(void 0, _e.concat([_j.sent(), oauth2_1.CLIENT_ASSERTION_TYPE,
                                        clientId,
                                        audienceA]))]).resolves.toMatchObject({ clientId: clientId })];
                            case 6:
                                _j.sent();
                                _f = vitest_1.expect;
                                _g = client_assertion_1.verifyClientAssertion;
                                _h = [providerB.ctx,
                                    providerB.opts];
                                return [4 /*yield*/, signDiscoveredClientAssertion({
                                        audience: audienceB,
                                        clientId: clientId,
                                        key: keyPairB.privateKey,
                                        keyId: keyId,
                                    })];
                            case 7: return [4 /*yield*/, _f.apply(void 0, [_g.apply(void 0, _h.concat([_j.sent(), oauth2_1.CLIENT_ASSERTION_TYPE,
                                        clientId,
                                        audienceB]))]).resolves.toMatchObject({ clientId: clientId })];
                            case 8:
                                _j.sent();
                                (0, vitest_1.expect)(transportA).toHaveBeenCalledTimes(1);
                                (0, vitest_1.expect)(transportB).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    {
                        name: "bare-array",
                        jwks: function () { return [
                            __assign(__assign({}, rsaPublicJwk), { kid: "remote-validation-key", alg: "RS256" }),
                        ]; },
                    },
                    {
                        name: "symmetric",
                        jwks: function () { return ({
                            keys: [
                                {
                                    kty: "oct",
                                    k: "c3ltbWV0cmljLXNlY3JldA",
                                    kid: "remote-validation-key",
                                    alg: "RS256",
                                },
                            ],
                        }); },
                    },
                    {
                        name: "private",
                        jwks: function () { return ({
                            keys: [
                                __assign(__assign({}, rsaPrivateJwk), { kid: "remote-validation-key", alg: "RS256" }),
                            ],
                        }); },
                    },
                    {
                        name: "malformed",
                        jwks: function () { return ({
                            keys: [
                                {
                                    kty: "RSA",
                                    n: rsaPublicJwk.n,
                                    kid: "remote-validation-key",
                                    alg: "RS256",
                                },
                            ],
                        }); },
                    },
                    {
                        name: "unsupported-algorithm",
                        jwks: function () { return ({
                            keys: [
                                __assign(__assign({}, rsaPublicJwk), { kid: "remote-validation-key", alg: "HS256" }),
                            ],
                        }); },
                    },
                    {
                        name: "incompatible-algorithm",
                        jwks: function () { return ({
                            keys: [
                                __assign(__assign({}, rsaPublicJwk), { kid: "remote-validation-key", alg: "ES256" }),
                            ],
                        }); },
                    },
                    {
                        name: "ec-curve-algorithm-mismatch",
                        jwks: function () { return ({
                            keys: [
                                {
                                    kty: "EC",
                                    crv: "P-256",
                                    x: "public-x",
                                    y: "public-y",
                                    kid: "remote-validation-key",
                                    alg: "ES384",
                                },
                            ],
                        }); },
                    },
                    {
                        name: "unsupported-ed448-curve",
                        jwks: function () { return ({
                            keys: [
                                {
                                    kty: "OKP",
                                    crv: "Ed448",
                                    x: "public-x",
                                    kid: "remote-validation-key",
                                    alg: "EdDSA",
                                },
                            ],
                        }); },
                    },
                ])("does not cache a $name discovery-owned JWKS response", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var clientId, jwksUri, audience, serveValidJwks, transport, provider, _c, _d, _e, _f, _g, _h;
                    var name = _b.name, jwks = _b.jwks;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                clientId = "https://".concat(name, "-remote-jwks.example.com/client.json");
                                jwksUri = "https://".concat(name, "-remote-jwks.example.com/jwks.json");
                                audience = "https://".concat(name, "-provider.example.com/oauth2/token");
                                serveValidJwks = false;
                                transport = vitest_1.vi.fn().mockImplementation(function () {
                                    return Promise.resolve(Response.json(serveValidJwks
                                        ? {
                                            keys: [
                                                __assign(__assign({}, rsaPublicJwk), { kid: "remote-validation-key", alg: "RS256" }),
                                            ],
                                        }
                                        : jwks()));
                                });
                                return [4 /*yield*/, createDiscoveredClientVerifier({
                                        baseURL: new URL(audience).origin,
                                        clientId: clientId,
                                        clientDiscoveryId: "".concat(name, "-remote-jwks-discovery"),
                                        fetchClientMetadataResource: transport,
                                        jwksUri: jwksUri,
                                    })];
                            case 1:
                                provider = _j.sent();
                                _c = vitest_1.expect;
                                _d = client_assertion_1.verifyClientAssertion;
                                _e = [provider.ctx,
                                    provider.opts];
                                return [4 /*yield*/, signDiscoveredClientAssertion({
                                        audience: audience,
                                        clientId: clientId,
                                        key: rsaPrivateKey,
                                        keyId: "remote-validation-key",
                                    })];
                            case 2: return [4 /*yield*/, _c.apply(void 0, [_d.apply(void 0, _e.concat([_j.sent(), oauth2_1.CLIENT_ASSERTION_TYPE,
                                        clientId,
                                        audience]))]).rejects.toBeDefined()];
                            case 3:
                                _j.sent();
                                (0, vitest_1.expect)(transport).toHaveBeenCalledTimes(1);
                                serveValidJwks = true;
                                _f = vitest_1.expect;
                                _g = client_assertion_1.verifyClientAssertion;
                                _h = [provider.ctx,
                                    provider.opts];
                                return [4 /*yield*/, signDiscoveredClientAssertion({
                                        audience: audience,
                                        clientId: clientId,
                                        key: rsaPrivateKey,
                                        keyId: "remote-validation-key",
                                    })];
                            case 4: return [4 /*yield*/, _f.apply(void 0, [_g.apply(void 0, _h.concat([_j.sent(), oauth2_1.CLIENT_ASSERTION_TYPE,
                                        clientId,
                                        audience]))]).resolves.toMatchObject({ clientId: clientId })];
                            case 5:
                                _j.sent();
                                (0, vitest_1.expect)(transport).toHaveBeenCalledTimes(2);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should exchange code with valid private_key_jwt assertion", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, code, assertion, tokens;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                return [4 /*yield*/, signAssertion()];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, exchangeCodeForTokens({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        assertion: assertion,
                                    })];
                            case 3:
                                tokens = _c.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.token_type).toBe("Bearer");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should accept the configured issuer as a token audience", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, code, assertion, tokens;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                return [4 /*yield*/, signAssertion({
                                        aud: customIssuer,
                                    })];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, exchangeCodeForTokens({
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        assertion: assertion,
                                    })];
                            case 3:
                                tokens = _c.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.token_type).toBe("Bearer");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should exchange code using a trusted jwks_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, code, assertion, tokens;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                vitest_1.vi.stubGlobal("fetch", vitest_1.vi.fn().mockResolvedValue(new Response(JSON.stringify({
                                    keys: [
                                        __assign(__assign({}, rsaPublicJwk), { kid: "trusted-jwks-key", alg: "RS256", use: "sig" }),
                                    ],
                                }), {
                                    status: 200,
                                    headers: { "content-type": "application/json" },
                                })));
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(jwksUriClient.client_id, codeVerifier)];
                            case 1:
                                code = _b.sent();
                                return [4 /*yield*/, signAssertion({
                                        clientId: jwksUriClient.client_id,
                                        kid: "trusted-jwks-key",
                                    })];
                            case 2:
                                assertion = _b.sent();
                                return [4 /*yield*/, exchangeCodeForTokens({
                                        clientId: jwksUriClient.client_id,
                                        code: code,
                                        codeVerifier: codeVerifier,
                                        assertion: assertion,
                                    })];
                            case 3:
                                tokens = _b.sent();
                                (0, vitest_1.expect)((_a = tokens.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                (0, vitest_1.expect)(globalThis.fetch).toHaveBeenCalledWith("https://trusted.example.com/.well-known/jwks.json", vitest_1.expect.objectContaining({
                                    headers: { accept: "application/json" },
                                    redirect: "error",
                                }));
                                (0, vitest_1.expect)(discoveryMetadataFetch).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject assertion signed with wrong key", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var wrongKeyPair, codeVerifier, code, assertion, result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, (0, jose_1.generateKeyPair)("RS256", {
                                    extractable: true,
                                })];
                            case 1:
                                wrongKeyPair = _c.sent();
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 2:
                                code = _c.sent();
                                return [4 /*yield*/, signAssertion({
                                        key: wrongKeyPair.privateKey,
                                    })];
                            case 3:
                                assertion = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion,
                                            code_verifier: codeVerifier,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 4:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/croffasia/itsaplan/issues/564
                 */
                (0, vitest_1.it)("reports an assertion for an unknown client as a client that was not found", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result, _a, _b, _c, _d;
                    var _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                _b = (_a = client).$fetch;
                                _c = ["/oauth2/token"];
                                _e = {
                                    method: "POST"
                                };
                                _d = URLSearchParams.bind;
                                _f = {
                                    grant_type: "client_credentials",
                                    client_id: "no-such-client",
                                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
                                };
                                return [4 /*yield*/, signAssertion({ clientId: "no-such-client" })];
                            case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([(_e.body = new (_d.apply(URLSearchParams, [void 0, (_f.client_assertion = _g.sent(),
                                            _f)]))(),
                                        _e.headers = { "content-type": "application/x-www-form-urlencoded" },
                                        _e)]))];
                            case 2:
                                result = _g.sent();
                                (0, vitest_1.expect)(result.error).toMatchObject({
                                    error: "invalid_client",
                                    error_description: "client not found",
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject expired assertion", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var now, codeVerifier, code, assertion, result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                now = Math.floor(Date.now() / 1000);
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                return [4 /*yield*/, signAssertion({ exp: now - 60 })];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion,
                                            code_verifier: codeVerifier,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject assertion with exp too far in the future", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var now, codeVerifier, code, assertion, result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                now = Math.floor(Date.now() / 1000);
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                return [4 /*yield*/, signAssertion({ exp: now + 3600 })];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion,
                                            code_verifier: codeVerifier,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject assertion without jti", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, code, assertion, result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                return [4 /*yield*/, signAssertion({ omitJti: true })];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion,
                                            code_verifier: codeVerifier,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject reused jti (replay prevention)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var jti, cv1, code1, assertion1, result1, cv2, code2, assertion2, result2;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                jti = crypto.randomUUID();
                                cv1 = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, cv1)];
                            case 1:
                                code1 = _d.sent();
                                return [4 /*yield*/, signAssertion({ jti: jti })];
                            case 2:
                                assertion1 = _d.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code1,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion1,
                                            code_verifier: cv1,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                result1 = _d.sent();
                                (0, vitest_1.expect)((_a = result1.data) === null || _a === void 0 ? void 0 : _a.access_token).toBeDefined();
                                cv2 = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, cv2)];
                            case 4:
                                code2 = _d.sent();
                                return [4 /*yield*/, signAssertion({ jti: jti })];
                            case 5:
                                assertion2 = _d.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code2,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion2,
                                            code_verifier: cv2,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 6:
                                result2 = _d.sent();
                                (0, vitest_1.expect)((_b = result2.error) === null || _b === void 0 ? void 0 : _b.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_c = result2.error) === null || _c === void 0 ? void 0 : _c.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject concurrent reuse of the same jti", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var jti, cv1, cv2, _a, code1, code2, assertion, _b, result1, result2, successCount, failureCount;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                jti = crypto.randomUUID();
                                cv1 = (0, crypto_1.generateRandomString)(32);
                                cv2 = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, Promise.all([
                                        getAuthCode(assertionClient.client_id, cv1),
                                        getAuthCode(assertionClient.client_id, cv2),
                                    ])];
                            case 1:
                                _a = _c.sent(), code1 = _a[0], code2 = _a[1];
                                return [4 /*yield*/, signAssertion({ jti: jti })];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, Promise.all([
                                        exchangeCodeForTokens({
                                            code: code1,
                                            codeVerifier: cv1,
                                            assertion: assertion,
                                        }),
                                        exchangeCodeForTokens({
                                            code: code2,
                                            codeVerifier: cv2,
                                            assertion: assertion,
                                        }),
                                    ])];
                            case 3:
                                _b = _c.sent(), result1 = _b[0], result2 = _b[1];
                                successCount = [result1, result2].filter(function (result) { var _a; return Boolean((_a = result.data) === null || _a === void 0 ? void 0 : _a.access_token); }).length;
                                failureCount = [result1, result2].filter(function (result) { var _a; return Boolean((_a = result.error) === null || _a === void 0 ? void 0 : _a.status); }).length;
                                (0, vitest_1.expect)(successCount).toBe(1);
                                (0, vitest_1.expect)(failureCount).toBe(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/10862
                 */
                (0, vitest_1.describe)("with configured id strategies", function () {
                    var idStrategyOptions = {
                        loginPage: "/login",
                        consentPage: "/consent",
                    };
                    var consumeWith = function (generateId, jti, attempts, database) { return __awaiter(void 0, void 0, void 0, function () {
                        var instance, ctx, assertion;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, test_1.getTestInstance)(__assign(__assign({ baseURL: authServerBaseUrl }, (database && { database: database })), { advanced: { database: { generateId: generateId } }, plugins: [(0, jwt_1.jwt)(), (0, oauth_1.oauthProvider)(idStrategyOptions)] }))];
                                case 1:
                                    instance = _b.sent();
                                    _a = {};
                                    return [4 /*yield*/, instance.auth.$context];
                                case 2:
                                    ctx = (_a.context = _b.sent(),
                                        _a);
                                    assertion = {
                                        namespace: "private_key_jwt:id-strategy-client",
                                        payload: {
                                            aud: tokenEndpoint,
                                            exp: Math.floor(Date.now() / 1000) + 120,
                                            jti: jti,
                                        },
                                        expectedAudience: tokenEndpoint,
                                    };
                                    return [2 /*return*/, Promise.allSettled(Array.from({ length: attempts }, function () {
                                            return (0, client_assertion_1.consumeClientAssertion)(ctx, idStrategyOptions, assertion);
                                        }))];
                            }
                        });
                    }); };
                    (0, vitest_1.it)("accepts a jti exactly once when ids are uuids", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var results, _i, _a, result;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, consumeWith("uuid", crypto.randomUUID(), 3)];
                                case 1:
                                    results = _b.sent();
                                    (0, vitest_1.expect)(results.filter(function (r) { return r.status === "fulfilled"; })).toHaveLength(1);
                                    for (_i = 0, _a = results.filter(function (r) { return r.status === "rejected"; }); _i < _a.length; _i++) {
                                        result = _a[_i];
                                        (0, vitest_1.expect)(result.reason).toMatchObject({
                                            body: {
                                                error: "invalid_client",
                                                error_description: "client assertion jti has already been used",
                                            },
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    (0, vitest_1.it)("keeps accepting assertions when ids are database-generated numbers", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, consumeWith("serial", crypto.randomUUID(), 1)];
                                case 1:
                                    result = (_a.sent())[0];
                                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.status).toBe("fulfilled");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    /**
                     * @see https://github.com/better-auth/better-auth/issues/12071
                     */
                    (0, vitest_1.it)("accepts assertions on Prisma with MongoDB ObjectId ids", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var rejectNonObjectIds, tables, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    rejectNonObjectIds = function (adapter) { return (__assign(__assign({}, adapter), { create: function (args) {
                                            var _a;
                                            var id = (_a = args.data.id) !== null && _a !== void 0 ? _a : hex_1.hex.encode(crypto.getRandomValues(new Uint8Array(12)));
                                            if (!/^[0-9a-f]{24}$/.test(String(id))) {
                                                throw new Error("Malformed ObjectID: ".concat(id));
                                            }
                                            return adapter.create(__assign(__assign({}, args), { data: __assign(__assign({}, args.data), { id: id }), forceAllowId: true }));
                                        } })); };
                                    tables = Object.fromEntries(__spreadArray([
                                        "user",
                                        "session",
                                        "account",
                                        "verification",
                                        "jwks"
                                    ], Object.keys(schema_1.schema), true).map(function (model) { return [model, []]; }));
                                    return [4 /*yield*/, consumeWith(false, crypto.randomUUID(), 1, function (options) {
                                            var adapter = (0, memory_adapter_1.memoryAdapter)(tables)(options);
                                            return __assign(__assign({}, rejectNonObjectIds(adapter)), { options: __assign(__assign({}, adapter.options), { usesObjectIdKey: function () { return true; } }), transaction: function (callback) {
                                                    return adapter.transaction(function (trx) { return callback(rejectNonObjectIds(trx)); });
                                                } });
                                        })];
                                case 1:
                                    result = (_a.sent())[0];
                                    (0, vitest_1.expect)(result === null || result === void 0 ? void 0 : result.status).toBe("fulfilled");
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                });
                (0, vitest_1.it)("should reject wrong audience", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, code, assertion, result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                return [4 /*yield*/, signAssertion({
                                        aud: "https://wrong-server.example.com/token",
                                    })];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion,
                                            code_verifier: codeVerifier,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject assertion signed with HS256 (symmetric algorithm)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, code, now, symmetricKey, assertion, result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                now = Math.floor(Date.now() / 1000);
                                symmetricKey = new TextEncoder().encode("a]?Y^w0S@}I-lI%i|{5BW?Wl:jLz[I_M");
                                return [4 /*yield*/, new jose_1.SignJWT({})
                                        .setProtectedHeader({ alg: "HS256" })
                                        .setIssuer(assertionClient.client_id)
                                        .setSubject(assertionClient.client_id)
                                        .setAudience(tokenEndpoint)
                                        .setIssuedAt(now)
                                        .setExpirationTime(now + 120)
                                        .setJti(crypto.randomUUID())
                                        .sign(symmetricKey)];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion,
                                            code_verifier: codeVerifier,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject assertion with iat too far in the past", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var now, codeVerifier, code, manualAssertion, result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                now = Math.floor(Date.now() / 1000);
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                return [4 /*yield*/, new jose_1.SignJWT({})
                                        .setProtectedHeader({ alg: "RS256", kid: "test-key-1" })
                                        .setIssuer(assertionClient.client_id)
                                        .setSubject(assertionClient.client_id)
                                        .setAudience(tokenEndpoint)
                                        .setIssuedAt(now - 600)
                                        .setExpirationTime(now + 60)
                                        .setJti(crypto.randomUUID())
                                        .sign(rsaPrivateKey)];
                            case 2:
                                manualAssertion = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            redirect_uri: redirectUri,
                                            client_id: assertionClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: manualAssertion,
                                            code_verifier: codeVerifier,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should enforce auth method — secret client cannot use assertion", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, code, assertion, result;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(secretClient.client_id, codeVerifier)];
                            case 1:
                                code = _c.sent();
                                return [4 /*yield*/, signAssertion({ clientId: secretClient.client_id })];
                            case 2:
                                assertion = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "authorization_code",
                                            code: code,
                                            redirect_uri: redirectUri,
                                            client_id: secretClient.client_id,
                                            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                                            client_assertion: assertion,
                                            code_verifier: codeVerifier,
                                        }),
                                        headers: { "content-type": "application/x-www-form-urlencoded" },
                                    })];
                            case 3:
                                result = _c.sent();
                                (0, vitest_1.expect)((_a = result.error) === null || _a === void 0 ? void 0 : _a.status).toBeGreaterThanOrEqual(400);
                                (0, vitest_1.expect)((_b = result.error) === null || _b === void 0 ? void 0 : _b.status).toBeLessThan(500);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    {
                        name: "issuer audience array",
                        audience: [customIssuer, "https://unrelated.example.com/introspect"],
                    },
                    { name: "endpoint audience", audience: introspectEndpoint },
                ])("should introspect an access token using private_key_jwt with $name", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var codeVerifier, code, tokens, _c, result, _d, _e, _f, _g;
                    var _h, _j, _k;
                    var _l, _m, _o, _p, _q;
                    var audience = _b.audience;
                    return __generator(this, function (_r) {
                        switch (_r.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier)];
                            case 1:
                                code = _r.sent();
                                _c = exchangeCodeForTokens;
                                _h = {
                                    code: code,
                                    codeVerifier: codeVerifier
                                };
                                return [4 /*yield*/, signAssertion()];
                            case 2: return [4 /*yield*/, _c.apply(void 0, [(_h.assertion = _r.sent(),
                                        _h)])];
                            case 3:
                                tokens = _r.sent();
                                (0, vitest_1.expect)((_l = tokens.data) === null || _l === void 0 ? void 0 : _l.access_token).toBeDefined();
                                _e = (_d = client).$fetch;
                                _f = ["/oauth2/introspect"];
                                _j = {
                                    method: "POST"
                                };
                                _g = URLSearchParams.bind;
                                _k = {
                                    client_id: assertionClient.client_id,
                                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
                                };
                                return [4 /*yield*/, signAssertion({ aud: audience })];
                            case 4: return [4 /*yield*/, _e.apply(_d, _f.concat([(_j.body = new (_g.apply(URLSearchParams, [void 0, (_k.client_assertion = _r.sent(),
                                            _k.token = (_o = (_m = tokens.data) === null || _m === void 0 ? void 0 : _m.access_token) !== null && _o !== void 0 ? _o : "",
                                            _k.token_type_hint = "access_token",
                                            _k)]))(),
                                        _j.headers = { "content-type": "application/x-www-form-urlencoded" },
                                        _j)]))];
                            case 5:
                                result = _r.sent();
                                (0, vitest_1.expect)((_p = result.data) === null || _p === void 0 ? void 0 : _p.active).toBe(true);
                                (0, vitest_1.expect)((_q = result.data) === null || _q === void 0 ? void 0 : _q.client_id).toBe(assertionClient.client_id);
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    { name: "issuer audience", audience: customIssuer },
                    { name: "endpoint audience", audience: revokeEndpoint },
                ])("should revoke a refresh token using private_key_jwt with $name", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
                    var codeVerifier, code, tokens, _c, result, _d, _e, _f, _g;
                    var _h, _j, _k;
                    var _l, _m, _o;
                    var audience = _b.audience;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, getAuthCode(assertionClient.client_id, codeVerifier, [
                                        "openid",
                                        "profile",
                                        "offline_access",
                                    ])];
                            case 1:
                                code = _p.sent();
                                _c = exchangeCodeForTokens;
                                _h = {
                                    code: code,
                                    codeVerifier: codeVerifier
                                };
                                return [4 /*yield*/, signAssertion()];
                            case 2: return [4 /*yield*/, _c.apply(void 0, [(_h.assertion = _p.sent(),
                                        _h)])];
                            case 3:
                                tokens = _p.sent();
                                (0, vitest_1.expect)((_l = tokens.data) === null || _l === void 0 ? void 0 : _l.refresh_token).toBeDefined();
                                _e = (_d = client).$fetch;
                                _f = ["/oauth2/revoke"];
                                _j = {
                                    method: "POST"
                                };
                                _g = URLSearchParams.bind;
                                _k = {
                                    client_id: assertionClient.client_id,
                                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
                                };
                                return [4 /*yield*/, signAssertion({ aud: audience })];
                            case 4: return [4 /*yield*/, _e.apply(_d, _f.concat([(_j.body = new (_g.apply(URLSearchParams, [void 0, (_k.client_assertion = _p.sent(),
                                            _k.token = (_o = (_m = tokens.data) === null || _m === void 0 ? void 0 : _m.refresh_token) !== null && _o !== void 0 ? _o : "",
                                            _k.token_type_hint = "refresh_token",
                                            _k)]))(),
                                        _j.headers = { "content-type": "application/x-www-form-urlencoded" },
                                        _j)]))];
                            case 5:
                                result = _p.sent();
                                (0, vitest_1.expect)(result.data).toBe(null);
                                (0, vitest_1.expect)(result.error).toBe(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("isPrivateHostname", function () {
    (0, vitest_1.it)("should block standard private IPv4 ranges", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("127.0.0.1")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("10.0.0.1")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("192.168.1.1")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("172.16.0.1")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("169.254.169.254")).toBe(true);
    });
    (0, vitest_1.it)("should block localhost and IPv6 loopback", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("localhost")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("::1")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[::1]")).toBe(true);
    });
    (0, vitest_1.it)("should block link-local and unique-local IPv6", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[fe80::1]")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("fe80::1")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[fd00::1]")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[fc00::1]")).toBe(true);
    });
    (0, vitest_1.it)("should block IPv4-mapped IPv6 addresses with private IPv4", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[::ffff:127.0.0.1]")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("::ffff:127.0.0.1")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[::ffff:169.254.169.254]")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[::ffff:10.0.0.1]")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[::ffff:192.168.1.1]")).toBe(true);
    });
    (0, vitest_1.it)("should NOT block legitimate DNS hostnames starting with fc/fd/fe", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("fd-services.com")).toBe(false);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("fc-platform.example.com")).toBe(false);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("february.example.com")).toBe(false);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("fe80.example.com")).toBe(false);
    });
    (0, vitest_1.it)("should NOT block public IPv4 addresses", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("8.8.8.8")).toBe(false);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("1.1.1.1")).toBe(false);
    });
    (0, vitest_1.it)("should NOT block IPv4-mapped IPv6 with public IPv4", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[::ffff:8.8.8.8]")).toBe(false);
    });
    (0, vitest_1.it)("should block IPv4-mapped IPv6 written in hex", function () {
        // ::ffff:7f00:1 == 127.0.0.1, ::ffff:a9fe:a9fe == 169.254.169.254 (IMDS)
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[::ffff:7f00:1]")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[::ffff:a9fe:a9fe]")).toBe(true);
    });
    (0, vitest_1.it)("should block NAT64 and 6to4 tunnels to private targets", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[64:ff9b::7f00:1]")).toBe(true); // NAT64 -> 127.0.0.1
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("[2002:a9fe:a9fe::]")).toBe(true); // 6to4 -> IMDS
    });
    (0, vitest_1.it)("should block shared address space (carrier-grade NAT)", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("100.64.0.1")).toBe(true);
    });
    (0, vitest_1.it)("should block cloud metadata endpoints", function () {
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("metadata.google.internal")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("metadata.goog")).toBe(true);
        (0, vitest_1.expect)((0, client_assertion_1.isPrivateHostname)("instance-data")).toBe(true);
    });
});
(0, vitest_1.describe)("private_key_jwt registration validation", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, _a, auth, signInWithTestUser, headers;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3001";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        trustedOrigins: ["https://trusted.example.com"],
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: authServerBaseUrl } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                (0, vitest_1.it)("should reject registration with both jwks and jwks_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: ["https://example.com/callback"],
                                        token_endpoint_auth_method: "private_key_jwt",
                                        jwks: {
                                            keys: [{ kty: "RSA", n: "test", e: "test-exponent" }],
                                        },
                                        jwks_uri: "https://example.com/.well-known/jwks.json",
                                    },
                                    asResponse: true,
                                })];
                            case 1:
                                result = _a.sent();
                                (0, vitest_1.expect)(result.status).toBeGreaterThanOrEqual(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject registration without jwks or jwks_uri", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: ["https://example.com/callback"],
                                        token_endpoint_auth_method: "private_key_jwt",
                                    },
                                    asResponse: true,
                                })];
                            case 1:
                                result = _a.sent();
                                (0, vitest_1.expect)(result.status).toBeGreaterThanOrEqual(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject jwks_uri with non-HTTPS scheme", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: ["https://example.com/callback"],
                                        token_endpoint_auth_method: "private_key_jwt",
                                        jwks_uri: "http://example.com/.well-known/jwks.json",
                                    },
                                    asResponse: true,
                                })];
                            case 1:
                                result = _a.sent();
                                (0, vitest_1.expect)(result.status).toBeGreaterThanOrEqual(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should reject jwks_uri from an untrusted origin", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: ["https://example.com/callback"],
                                        token_endpoint_auth_method: "private_key_jwt",
                                        jwks_uri: "https://untrusted.example.com/.well-known/jwks.json",
                                    },
                                    asResponse: true,
                                })];
                            case 1:
                                result = _a.sent();
                                (0, vitest_1.expect)(result.status).toBeGreaterThanOrEqual(400);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should accept jwks on client_secret clients", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: ["https://example.com/callback"],
                                        token_endpoint_auth_method: "client_secret_post",
                                        jwks: {
                                            keys: [{ kty: "RSA", n: "test", e: "test-exponent" }],
                                        },
                                    },
                                    asResponse: true,
                                })];
                            case 1:
                                result = _a.sent();
                                (0, vitest_1.expect)(result.status).toBe(201);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
