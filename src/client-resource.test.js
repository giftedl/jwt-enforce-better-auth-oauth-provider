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
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_resource_1 = require("./client-resource");
var oauth_1 = require("./oauth");
(0, vitest_1.it)("accepts auth options that omit base URL configuration", function () {
    var options = { plugins: [] };
    var createResourceClient = (client_resource_1.oauthProviderResourceClient);
    (0, vitest_1.expectTypeOf)(createResourceClient)
        .parameter(0)
        .toEqualTypeOf();
});
(0, vitest_1.describe)("resource client defaults with an origin-only baseURL", function () { return __awaiter(void 0, void 0, void 0, function () {
    var origin, issuer, resource, _a, auth, signInWithTestUser, actions;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                origin = "http://localhost:4123";
                issuer = "".concat(origin, "/api/auth");
                resource = "https://api.example.com";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: origin,
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                resources: [resource],
                                enforcePerClientResources: false,
                                scopes: ["read:posts"],
                                clientPrivileges: function () { return true; },
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser;
                actions = (0, client_resource_1.oauthProviderResourceClient)(auth).getActions();
                (0, vitest_1.afterEach)(function () {
                    vitest_1.vi.unstubAllGlobals();
                });
                (0, vitest_1.it)("verifies a token with the default issuer and JWKS URL", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, client, tokens, payload;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_a.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: ["client_credentials"],
                                            client_credentials_scopes: ["read:posts"],
                                        },
                                    })];
                            case 2:
                                client = _a.sent();
                                return [4 /*yield*/, auth.api.oauth2Token({
                                        body: {
                                            grant_type: "client_credentials",
                                            client_id: client.client_id,
                                            client_secret: client.client_secret,
                                            scope: "read:posts",
                                            resource: resource,
                                        },
                                    })];
                            case 3:
                                tokens = _a.sent();
                                // Serve the JWKS request from the test instance instead of the network.
                                vitest_1.vi.stubGlobal("fetch", function (input, init) {
                                    return auth.handler(new Request(input, init));
                                });
                                return [4 /*yield*/, actions.verifyBearerToken(tokens.access_token, {
                                        verifyOptions: { audience: resource },
                                    })];
                            case 4:
                                payload = _a.sent();
                                (0, vitest_1.expect)(payload).toMatchObject({ iss: issuer, aud: resource });
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/rfc9449#section-7.2
                 */
                (0, vitest_1.it)("answers a failed DPoP request with a DPoP challenge", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var error;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                vitest_1.vi.stubGlobal("fetch", function (input, init) {
                                    return auth.handler(new Request(input, init));
                                });
                                return [4 /*yield*/, actions
                                        .verifyAccessTokenRequest(new Request(resource, {
                                        headers: { Authorization: "DPoP not-a-valid-token" },
                                    }), { verifyOptions: { audience: resource } })
                                        .catch(function (e) { return e; })];
                            case 1:
                                error = _a.sent();
                                (0, vitest_1.expect)(error).toMatchObject({ statusCode: 401 });
                                (0, vitest_1.expect)(new Headers(error.headers).get("WWW-Authenticate")).toMatch(new RegExp("^DPoP error=\"invalid_token\", error_description=\"[^\"]+\", algs=\"".concat(oauth2_1.DPOP_SIGNING_ALGORITHMS.join(" "), "\"$")));
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://datatracker.ietf.org/doc/html/rfc9449#section-7.1
                 */
                (0, vitest_1.it)("answers a DPoP-bound token missing a scope with a DPoP challenge", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, client, _a, privateKey, publicKey, publicJwk, createProof, tokenEndpoint, tokenResponse, _b, _c, _d, _e, tokens, error, _f, _g, _h, _j;
                    var _k, _l, _m, _o;
                    return __generator(this, function (_p) {
                        switch (_p.label) {
                            case 0:
                                vitest_1.vi.stubGlobal("fetch", function (input, init) {
                                    return auth.handler(new Request(input, init));
                                });
                                return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_p.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: ["client_credentials"],
                                            client_credentials_scopes: ["read:posts"],
                                        },
                                    })];
                            case 2:
                                client = _p.sent();
                                return [4 /*yield*/, (0, jose_1.generateKeyPair)("ES256", {
                                        extractable: true,
                                    })];
                            case 3:
                                _a = _p.sent(), privateKey = _a.privateKey, publicKey = _a.publicKey;
                                return [4 /*yield*/, (0, jose_1.exportJWK)(publicKey)];
                            case 4:
                                publicJwk = _p.sent();
                                createProof = function (method, url, accessToken) { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a, _b, _c;
                                    var _d;
                                    return __generator(this, function (_e) {
                                        switch (_e.label) {
                                            case 0:
                                                _a = jose_1.SignJWT.bind;
                                                _b = [{ jti: crypto.randomUUID(), htm: method, htu: url, iat: Math.floor(Date.now() / 1000) }];
                                                _c = accessToken;
                                                if (!_c) return [3 /*break*/, 2];
                                                _d = {};
                                                return [4 /*yield*/, (0, oauth2_1.deriveDpopAth)(accessToken)];
                                            case 1:
                                                _c = (_d.ath = _e.sent(), _d);
                                                _e.label = 2;
                                            case 2: return [2 /*return*/, new (_a.apply(jose_1.SignJWT, [void 0, __assign.apply(void 0, _b.concat([(_c)]))]))()
                                                    .setProtectedHeader({ typ: "dpop+jwt", alg: "ES256", jwk: publicJwk })
                                                    .sign(privateKey)];
                                        }
                                    });
                                }); };
                                tokenEndpoint = "".concat(issuer, "/oauth2/token");
                                _c = (_b = auth).handler;
                                _d = Request.bind;
                                _e = [void 0, tokenEndpoint];
                                _k = {
                                    method: "POST"
                                };
                                _l = {
                                    "content-type": "application/x-www-form-urlencoded"
                                };
                                return [4 /*yield*/, createProof("POST", tokenEndpoint)];
                            case 5: return [4 /*yield*/, _c.apply(_b, [new (_d.apply(Request, _e.concat([(_k.headers = (_l.DPoP = _p.sent(),
                                            _l),
                                            _k.body = new URLSearchParams({
                                                grant_type: "client_credentials",
                                                client_id: client.client_id,
                                                client_secret: client.client_secret,
                                                scope: "read:posts",
                                                resource: resource,
                                            }),
                                            _k)])))()])];
                            case 6:
                                tokenResponse = _p.sent();
                                return [4 /*yield*/, tokenResponse.json()];
                            case 7:
                                tokens = (_p.sent());
                                (0, vitest_1.expect)(tokens.token_type).toBe("DPoP");
                                _g = (_f = actions)
                                    .verifyAccessTokenRequest;
                                _h = Request.bind;
                                _j = [void 0, resource];
                                _m = {};
                                _o = {
                                    Authorization: "DPoP ".concat(tokens.access_token)
                                };
                                return [4 /*yield*/, createProof("GET", resource, tokens.access_token)];
                            case 8: return [4 /*yield*/, _g.apply(_f, [new (_h.apply(Request, _j.concat([(_m.headers = (_o.DPoP = _p.sent(),
                                            _o),
                                            _m)])))(),
                                    {
                                        verifyOptions: { audience: resource },
                                        requiredScopes: ["write:posts"],
                                    }])
                                    .catch(function (e) { return e; })];
                            case 9:
                                error = _p.sent();
                                (0, vitest_1.expect)(error).toMatchObject({ statusCode: 403 });
                                (0, vitest_1.expect)(new Headers(error.headers).get("WWW-Authenticate")).toMatch(/^DPoP error="insufficient_scope", scope="write:posts", .*algs="/);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("advertises the resolved issuer as the authorization server", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, actions.getProtectedResourceMetadata({ resource: resource })];
                            case 1:
                                metadata = _a.sent();
                                (0, vitest_1.expect)(metadata.authorization_servers).toEqual([issuer]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
