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
var client_1 = require("better-auth/client");
var crypto_1 = require("better-auth/crypto");
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var oauth_1 = require("./oauth");
(0, vitest_1.describe)("OpenID Connect RS256 provider profile", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerOrigin, issuer, rpBaseUrl, providerId, redirectUri, state, nonce, scopes, _a, auth, signInWithTestUser, customFetchImpl, testUser, headers, client, oauthClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerOrigin = "http://localhost:3000";
                issuer = "".concat(authServerOrigin, "/api/auth");
                rpBaseUrl = "http://localhost:5000";
                providerId = "oidc-conformance";
                redirectUri = "".concat(rpBaseUrl, "/api/auth/callback/").concat(providerId);
                state = "oidc-conformance-state";
                nonce = "oidc-conformance-nonce";
                scopes = ["openid", "profile", "email"];
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerOrigin,
                        plugins: [
                            (0, jwt_1.jwt)({
                                jwks: {
                                    keyPairConfig: {
                                        alg: "RS256",
                                        modulusLength: 2048,
                                    },
                                },
                            }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, signInWithTestUser = _a.signInWithTestUser, customFetchImpl = _a.customFetchImpl, testUser = _a.testUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                headers = (_b.sent()).headers;
                client = (0, client_1.createAuthClient)({
                    plugins: [(0, client_2.oauthProviderClient)()],
                    baseURL: authServerOrigin,
                    fetchOptions: { customFetchImpl: customFetchImpl, headers: headers },
                });
                oauthClient = null;
                (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                    headers: headers,
                                    body: {
                                        redirect_uris: [redirectUri],
                                        application_type: "native",
                                        token_endpoint_auth_method: "client_secret_post",
                                        skip_consent: true,
                                    },
                                })];
                            case 1:
                                oauthClient = _a.sent();
                                (0, vitest_1.expect)(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id).toBeDefined();
                                (0, vitest_1.expect)(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_secret).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("advertises the RS256 OpenID provider signing contract", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var metadata, jwks;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, auth.api.getOpenIdConfig()];
                            case 1:
                                metadata = _b.sent();
                                (0, vitest_1.expect)(metadata).toMatchObject({
                                    issuer: issuer,
                                    authorization_endpoint: "".concat(issuer, "/oauth2/authorize"),
                                    token_endpoint: "".concat(issuer, "/oauth2/token"),
                                    userinfo_endpoint: "".concat(issuer, "/oauth2/userinfo"),
                                    jwks_uri: "".concat(issuer, "/jwks"),
                                    response_types_supported: ["code"],
                                    response_modes_supported: ["query"],
                                    grant_types_supported: [
                                        "authorization_code",
                                        "client_credentials",
                                        "refresh_token",
                                    ],
                                    code_challenge_methods_supported: ["S256"],
                                    subject_types_supported: ["public"],
                                    acr_values_supported: ["0"],
                                    id_token_signing_alg_values_supported: ["RS256"],
                                });
                                return [4 /*yield*/, client.$fetch("/jwks", {
                                        method: "GET",
                                    })];
                            case 2:
                                jwks = _b.sent();
                                (0, vitest_1.expect)((_a = jwks.data) === null || _a === void 0 ? void 0 : _a.keys).toEqual(vitest_1.expect.arrayContaining([
                                    vitest_1.expect.objectContaining({
                                        alg: "RS256",
                                        kty: "RSA",
                                    }),
                                ]));
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    ["acr_values", { acr_values: "1" }],
                    [
                        "voluntary ACR claim",
                        {
                            claims: JSON.stringify({
                                id_token: { acr: { values: ["1"] } },
                            }),
                        },
                    ],
                ])("issues an RS256 ID token with the current ACR for unsupported %s", function (_, additionalParams) { return __awaiter(void 0, void 0, void 0, function () {
                    var codeVerifier, authUrl, callbackRedirectUrl, callbackUrl, code, _a, body, tokenHeaders, tokenResponse, tokens, jwks, localJwks, idToken, userinfo;
                    var _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!(oauthClient === null || oauthClient === void 0 ? void 0 : oauthClient.client_id) || !oauthClient.client_secret) {
                                    throw new Error("beforeAll not run properly");
                                }
                                codeVerifier = (0, crypto_1.generateRandomString)(32);
                                return [4 /*yield*/, (0, oauth2_1.createAuthorizationURL)({
                                        id: providerId,
                                        options: {
                                            clientId: oauthClient.client_id,
                                            clientSecret: oauthClient.client_secret,
                                            redirectURI: redirectUri,
                                        },
                                        redirectURI: "",
                                        authorizationEndpoint: "".concat(issuer, "/oauth2/authorize"),
                                        state: state,
                                        scopes: scopes,
                                        codeVerifier: codeVerifier,
                                        nonce: nonce,
                                        additionalParams: additionalParams,
                                    })];
                            case 1:
                                authUrl = _f.sent();
                                callbackRedirectUrl = "";
                                return [4 /*yield*/, client.$fetch(authUrl.toString(), {
                                        onError: function (context) {
                                            var _a;
                                            callbackRedirectUrl = (_a = context.response.headers.get("Location")) !== null && _a !== void 0 ? _a : "";
                                        },
                                    })];
                            case 2:
                                _f.sent();
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain(redirectUri);
                                (0, vitest_1.expect)(callbackRedirectUrl).toContain("code=");
                                callbackUrl = new URL(callbackRedirectUrl);
                                code = callbackUrl.searchParams.get("code");
                                (0, vitest_1.expect)(callbackUrl.origin + callbackUrl.pathname).toBe(redirectUri);
                                (0, vitest_1.expect)(callbackUrl.searchParams.get("state")).toBe(state);
                                (0, vitest_1.expect)(code).toBeTruthy();
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
                                _a = _f.sent(), body = _a.body, tokenHeaders = _a.headers;
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: body,
                                        headers: tokenHeaders,
                                        onResponse: function (context) {
                                            tokenResponse = context.response;
                                        },
                                    })];
                            case 4:
                                tokens = _f.sent();
                                (0, vitest_1.expect)((_b = tokens.data) === null || _b === void 0 ? void 0 : _b.access_token).toBeDefined();
                                (0, vitest_1.expect)((_c = tokens.data) === null || _c === void 0 ? void 0 : _c.id_token).toBeDefined();
                                (0, vitest_1.expect)((_d = tokens.data) === null || _d === void 0 ? void 0 : _d.scope).toBe(scopes.join(" "));
                                (0, vitest_1.expect)((_e = tokens.data) === null || _e === void 0 ? void 0 : _e.token_type).toBe("Bearer");
                                (0, vitest_1.expect)(tokenResponse === null || tokenResponse === void 0 ? void 0 : tokenResponse.headers.get("Cache-Control")).toBe("no-store");
                                (0, vitest_1.expect)(tokenResponse === null || tokenResponse === void 0 ? void 0 : tokenResponse.headers.get("Pragma")).toBe("no-cache");
                                return [4 /*yield*/, client.$fetch("/jwks", {
                                        method: "GET",
                                    })];
                            case 5:
                                jwks = _f.sent();
                                if (!jwks.data)
                                    throw new Error("Unable to fetch JWKS");
                                localJwks = (0, jose_1.createLocalJWKSet)(jwks.data);
                                return [4 /*yield*/, (0, jose_1.jwtVerify)(tokens.data.id_token, localJwks, {
                                        issuer: issuer,
                                        audience: oauthClient.client_id,
                                    })];
                            case 6:
                                idToken = _f.sent();
                                (0, vitest_1.expect)(idToken.protectedHeader.alg).toBe("RS256");
                                (0, vitest_1.expect)(idToken.payload).toMatchObject({
                                    iss: issuer,
                                    aud: oauthClient.client_id,
                                    nonce: nonce,
                                    sub: vitest_1.expect.any(String),
                                    auth_time: vitest_1.expect.any(Number),
                                    acr: "0",
                                });
                                (0, vitest_1.expect)(idToken.payload.at_hash).toEqual(vitest_1.expect.any(String));
                                (0, vitest_1.expect)(idToken.payload.name).toBeUndefined();
                                (0, vitest_1.expect)(idToken.payload.email).toBeUndefined();
                                (0, vitest_1.expect)(idToken.payload.email_verified).toBeUndefined();
                                return [4 /*yield*/, client.$fetch("/oauth2/userinfo", {
                                        headers: {
                                            authorization: "Bearer ".concat(tokens.data.access_token),
                                        },
                                    })];
                            case 7:
                                userinfo = _f.sent();
                                (0, vitest_1.expect)(userinfo.data).toMatchObject({
                                    sub: idToken.payload.sub,
                                    name: testUser.name,
                                    email: testUser.email,
                                    email_verified: vitest_1.expect.any(Boolean),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
