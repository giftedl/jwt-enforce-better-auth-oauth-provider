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
var error_1 = require("@better-auth/core/error");
var client_1 = require("better-auth/client");
var oauth2_1 = require("better-auth/oauth2");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var client_resource_1 = require("./client-resource");
var metadata_1 = require("./metadata");
var oauth_1 = require("./oauth");
(0, vitest_1.describe)("oauth metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
    function createTestInstance(opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, auth, customFetchImpl, unauthenticatedClient;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, test_1.getTestInstance)(__assign(__assign({ baseURL: authServerBaseUrl }, ((opts === null || opts === void 0 ? void 0 : opts.advanced) ? { advanced: opts.advanced } : {})), { plugins: __spreadArray([
                                (0, oauth_1.oauthProvider)(__assign({ loginPage: "/login", consentPage: "/consent", allowDynamicClientRegistration: true }, opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig))
                            ], (((_b = opts === null || opts === void 0 ? void 0 : opts.oauthProviderConfig) === null || _b === void 0 ? void 0 : _b.disableJwtPlugin)
                                ? []
                                : [(0, jwt_1.jwt)(opts === null || opts === void 0 ? void 0 : opts.jwtConfig)]), true) }))];
                    case 1:
                        _a = _c.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl;
                        unauthenticatedClient = (0, client_1.createAuthClient)({
                            plugins: [(0, client_2.oauthProviderClient)()],
                            baseURL: authServerBaseUrl,
                            fetchOptions: {
                                customFetchImpl: customFetchImpl,
                            },
                        });
                        return [2 /*return*/, {
                                auth: auth,
                                client: unauthenticatedClient,
                                customFetchImpl: customFetchImpl,
                            }];
                }
            });
        });
    }
    var authServerBaseUrl, baseURL, baseClaims;
    return __generator(this, function (_a) {
        authServerBaseUrl = "http://localhost:3000";
        baseURL = "".concat(authServerBaseUrl, "/api/auth");
        baseClaims = [
            "sub",
            "iss",
            "aud",
            "exp",
            "iat",
            "sid",
            "scope",
            "azp",
            "name",
            "picture",
            "given_name",
            "family_name",
            "email",
            "email_verified",
        ];
        (0, vitest_1.it)("should get openid, equivalent auth server", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata, oauthMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance()];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata).toMatchObject({
                            scopes_supported: ["openid", "profile", "email", "offline_access"],
                            issuer: baseURL,
                            authorization_endpoint: "".concat(baseURL, "/oauth2/authorize"),
                            token_endpoint: "".concat(baseURL, "/oauth2/token"),
                            jwks_uri: "".concat(baseURL, "/jwks"),
                            registration_endpoint: "".concat(baseURL, "/oauth2/register"),
                            introspection_endpoint: "".concat(baseURL, "/oauth2/introspect"),
                            revocation_endpoint: "".concat(baseURL, "/oauth2/revoke"),
                            response_types_supported: ["code"],
                            response_modes_supported: ["query"],
                            grant_types_supported: [
                                "authorization_code",
                                "client_credentials",
                                "refresh_token",
                            ],
                            token_endpoint_auth_methods_supported: [
                                "client_secret_basic",
                                "client_secret_post",
                                "private_key_jwt",
                            ],
                            introspection_endpoint_auth_methods_supported: [
                                "client_secret_basic",
                                "client_secret_post",
                                "private_key_jwt",
                            ],
                            revocation_endpoint_auth_methods_supported: [
                                "client_secret_basic",
                                "client_secret_post",
                                "private_key_jwt",
                            ],
                            code_challenge_methods_supported: ["S256"],
                            authorization_response_iss_parameter_supported: true,
                            dpop_signing_alg_values_supported: __spreadArray([], oauth2_1.DPOP_SIGNING_ALGORITHMS, true),
                            backchannel_logout_supported: true,
                            backchannel_logout_session_supported: true,
                            claims_supported: baseClaims,
                            claims_parameter_supported: true,
                            userinfo_endpoint: "".concat(baseURL, "/oauth2/userinfo"),
                            subject_types_supported: ["public"],
                            acr_values_supported: ["0"],
                            id_token_signing_alg_values_supported: ["EdDSA"],
                            end_session_endpoint: "".concat(baseURL, "/oauth2/end-session"),
                            prompt_values_supported: [
                                "login",
                                "consent",
                                "create",
                                "select_account",
                                "none",
                            ],
                        });
                        return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                    case 3:
                        oauthMetadata = _a.sent();
                        (0, vitest_1.expect)(oauthMetadata).toMatchObject(metadata !== null && metadata !== void 0 ? metadata : {});
                        return [2 /*return*/];
                }
            });
        }); });
        /**
         * @see https://github.com/better-auth/better-auth/issues/8343
         */
        (0, vitest_1.it)("should serve authorization server metadata at the issuer-appended well-known URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var customFetchImpl, response, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance()];
                    case 1:
                        customFetchImpl = (_a.sent()).customFetchImpl;
                        return [4 /*yield*/, customFetchImpl("".concat(baseURL, "/.well-known/oauth-authorization-server"), { method: "GET" })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(200);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        metadata = (_a.sent());
                        (0, vitest_1.expect)(metadata.issuer).toBe(baseURL);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should serve authorization server metadata at the RFC 8414 path-insertion URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var customFetchImpl, response, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance()];
                    case 1:
                        customFetchImpl = (_a.sent()).customFetchImpl;
                        return [4 /*yield*/, customFetchImpl("".concat(authServerBaseUrl, "/.well-known/oauth-authorization-server/api/auth"), { method: "GET" })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(200);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        metadata = (_a.sent());
                        (0, vitest_1.expect)(metadata.issuer).toBe(baseURL);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should advertise dynamic client registration from direct OAuth metadata when enabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var customFetchImpl, response, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance({
                            oauthProviderConfig: {
                                scopes: ["create:test"],
                                allowDynamicClientRegistration: true,
                            },
                        })];
                    case 1:
                        customFetchImpl = (_a.sent()).customFetchImpl;
                        return [4 /*yield*/, customFetchImpl("".concat(baseURL, "/.well-known/oauth-authorization-server"), { method: "GET" })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(200);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        metadata = (_a.sent());
                        (0, vitest_1.expect)(metadata.registration_endpoint).toBe("".concat(baseURL, "/oauth2/register"));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should serve OIDC metadata at the direct issuer well-known URL", function () { return __awaiter(void 0, void 0, void 0, function () {
            var customFetchImpl, response, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance()];
                    case 1:
                        customFetchImpl = (_a.sent()).customFetchImpl;
                        return [4 /*yield*/, customFetchImpl("".concat(baseURL, "/.well-known/openid-configuration"), { method: "GET" })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(200);
                        return [4 /*yield*/, response.json()];
                    case 3:
                        metadata = (_a.sent());
                        (0, vitest_1.expect)(metadata.issuer).toBe(baseURL);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should restrict direct metadata requests to GET and HEAD", function () { return __awaiter(void 0, void 0, void 0, function () {
            var customFetchImpl, issuerAppendedAuthServerMetadataURL, pathInsertionAuthServerMetadataURL, openIdConfigURL, _i, _a, url, headResponse, _b, _c, _d, url, response;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, createTestInstance()];
                    case 1:
                        customFetchImpl = (_e.sent()).customFetchImpl;
                        issuerAppendedAuthServerMetadataURL = "".concat(baseURL, "/.well-known/oauth-authorization-server");
                        pathInsertionAuthServerMetadataURL = "".concat(authServerBaseUrl, "/.well-known/oauth-authorization-server/api/auth");
                        openIdConfigURL = "".concat(baseURL, "/.well-known/openid-configuration");
                        _i = 0, _a = [
                            issuerAppendedAuthServerMetadataURL,
                            pathInsertionAuthServerMetadataURL,
                        ];
                        _e.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        url = _a[_i];
                        return [4 /*yield*/, customFetchImpl(url, {
                                method: "HEAD",
                            })];
                    case 3:
                        headResponse = _e.sent();
                        (0, vitest_1.expect)(headResponse.status).toBe(200);
                        _b = vitest_1.expect;
                        return [4 /*yield*/, headResponse.text()];
                    case 4:
                        _b.apply(void 0, [_e.sent()]).toBe("");
                        _e.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6:
                        _c = 0, _d = [
                            issuerAppendedAuthServerMetadataURL,
                            pathInsertionAuthServerMetadataURL,
                            openIdConfigURL,
                        ];
                        _e.label = 7;
                    case 7:
                        if (!(_c < _d.length)) return [3 /*break*/, 10];
                        url = _d[_c];
                        return [4 /*yield*/, customFetchImpl(url, { method: "POST" })];
                    case 8:
                        response = _e.sent();
                        (0, vitest_1.expect)(response.status).toBe(405);
                        (0, vitest_1.expect)(response.headers.get("Allow")).toBe("GET, HEAD");
                        _e.label = 9;
                    case 9:
                        _c++;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should only skip trailing slashes when configured", function () { return __awaiter(void 0, void 0, void 0, function () {
            var authServerMetadataURL, customFetchImpl, response, customFetchImplWithSkipTrailingSlashes, skipTrailingSlashesResponse, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        authServerMetadataURL = "".concat(authServerBaseUrl, "/.well-known/oauth-authorization-server/api/auth/");
                        return [4 /*yield*/, createTestInstance()];
                    case 1:
                        customFetchImpl = (_a.sent()).customFetchImpl;
                        return [4 /*yield*/, customFetchImpl(authServerMetadataURL, {
                                method: "GET",
                            })];
                    case 2:
                        response = _a.sent();
                        (0, vitest_1.expect)(response.status).toBe(404);
                        return [4 /*yield*/, createTestInstance({
                                advanced: {
                                    skipTrailingSlashes: true,
                                },
                            })];
                    case 3:
                        customFetchImplWithSkipTrailingSlashes = (_a.sent()).customFetchImpl;
                        return [4 /*yield*/, customFetchImplWithSkipTrailingSlashes(authServerMetadataURL, {
                                method: "GET",
                            })];
                    case 4:
                        skipTrailingSlashesResponse = _a.sent();
                        (0, vitest_1.expect)(skipTrailingSlashesResponse.status).toBe(200);
                        return [4 /*yield*/, skipTrailingSlashesResponse.json()];
                    case 5:
                        metadata = (_a.sent());
                        (0, vitest_1.expect)(metadata.issuer).toBe(baseURL);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should not have an openid-configuration, has auth server configuration", function () { return __awaiter(void 0, void 0, void 0, function () {
            var scopes, auth, oauthMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scopes = ["create:test"];
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    scopes: scopes,
                                },
                            })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, (0, vitest_1.expect)(auth.api.getOpenIdConfig()).rejects.toThrowError(error_1.APIError)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                    case 3:
                        oauthMetadata = _a.sent();
                        (0, vitest_1.expect)(oauthMetadata).toMatchObject({
                            scopes_supported: scopes,
                            issuer: baseURL,
                            authorization_endpoint: "".concat(baseURL, "/oauth2/authorize"),
                            token_endpoint: "".concat(baseURL, "/oauth2/token"),
                            jwks_uri: "".concat(baseURL, "/jwks"),
                            registration_endpoint: "".concat(baseURL, "/oauth2/register"),
                            introspection_endpoint: "".concat(baseURL, "/oauth2/introspect"),
                            revocation_endpoint: "".concat(baseURL, "/oauth2/revoke"),
                            response_types_supported: ["code"],
                            response_modes_supported: ["query"],
                            grant_types_supported: [
                                "authorization_code",
                                "client_credentials",
                                "refresh_token",
                            ],
                            token_endpoint_auth_methods_supported: [
                                "client_secret_basic",
                                "client_secret_post",
                                "private_key_jwt",
                            ],
                            introspection_endpoint_auth_methods_supported: [
                                "client_secret_basic",
                                "client_secret_post",
                                "private_key_jwt",
                            ],
                            revocation_endpoint_auth_methods_supported: [
                                "client_secret_basic",
                                "client_secret_post",
                                "private_key_jwt",
                            ],
                            code_challenge_methods_supported: ["S256"],
                            authorization_response_iss_parameter_supported: true,
                            backchannel_logout_supported: true,
                            backchannel_logout_session_supported: true,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("advertises back-channel logout as unsupported when the jwt plugin is disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance({
                            oauthProviderConfig: {
                                disableJwtPlugin: true,
                            },
                        })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata.backchannel_logout_supported).toBe(false);
                        (0, vitest_1.expect)(metadata.backchannel_logout_session_supported).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should not provide dynamic client registration endpoint when disabled", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata, oauthMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance({
                            oauthProviderConfig: {
                                allowDynamicClientRegistration: false,
                            },
                        })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata.registration_endpoint).toBeUndefined();
                        return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                    case 3:
                        oauthMetadata = _a.sent();
                        (0, vitest_1.expect)(oauthMetadata.registration_endpoint).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should not provide dynamic client registration endpoint when undefined", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata, oauthMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance({
                            oauthProviderConfig: {
                                allowDynamicClientRegistration: undefined,
                            },
                        })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata.registration_endpoint).toBeUndefined();
                        return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                    case 3:
                        oauthMetadata = _a.sent();
                        (0, vitest_1.expect)(oauthMetadata.registration_endpoint).toBeUndefined();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should utilize advertised metadata fields", function () { return __awaiter(void 0, void 0, void 0, function () {
            var advertisedScopes, advertisedClaims, auth, metadata, oauthMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        advertisedScopes = ["email"];
                        advertisedClaims = ["sub", "iss", "aud", "exp", "iat", "scope"];
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    advertisedMetadata: {
                                        scopes_supported: advertisedScopes,
                                        claims_supported: advertisedClaims,
                                    },
                                },
                            })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata).toMatchObject({
                            scopes_supported: advertisedScopes,
                            claims_supported: advertisedClaims,
                        });
                        return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                    case 3:
                        oauthMetadata = _a.sent();
                        (0, vitest_1.expect)(oauthMetadata).toMatchObject(metadata !== null && metadata !== void 0 ? metadata : {});
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should explicitly advertise unsupported request object parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance()];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata.request_parameter_supported).toBe(false);
                        (0, vitest_1.expect)(metadata.request_uri_parameter_supported).toBe(false);
                        (0, vitest_1.expect)(metadata.claims_parameter_supported).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should advertise the unspecified ACR value by default", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance()];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata.acr_values_supported).toEqual(["0"]);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should fail if advertised scope invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
            var advertisedScopes;
            return __generator(this, function (_a) {
                advertisedScopes = ["create:test"];
                (0, vitest_1.expect)(function () {
                    return (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                advertisedMetadata: {
                                    scopes_supported: advertisedScopes,
                                },
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    });
                }).toThrowError("advertisedMetadata.scopes_supported create:test not found in scopes");
                return [2 /*return*/];
            });
        }); });
        (0, vitest_1.it)("should advertise custom claims", function () { return __awaiter(void 0, void 0, void 0, function () {
            var customClaims, auth, metadata, oauthMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customClaims = ["http://example.com/roles"];
                        return [4 /*yield*/, createTestInstance({
                                oauthProviderConfig: {
                                    advertisedMetadata: {
                                        claims_supported: __spreadArray(__spreadArray([], baseClaims, true), customClaims, true),
                                    },
                                },
                            })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata).toMatchObject({
                            claims_supported: __spreadArray(__spreadArray([], baseClaims, true), customClaims, true),
                        });
                        return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                    case 3:
                        oauthMetadata = _a.sent();
                        (0, vitest_1.expect)(oauthMetadata).toMatchObject(metadata !== null && metadata !== void 0 ? metadata : {});
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use the remoteJwks url", function () { return __awaiter(void 0, void 0, void 0, function () {
            var remoteUrl, alg, auth, metadata, oauthMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        remoteUrl = "http://example.com/.well-known/openid-configuration";
                        alg = "ES256";
                        return [4 /*yield*/, createTestInstance({
                                jwtConfig: {
                                    jwks: {
                                        remoteUrl: remoteUrl,
                                        keyPairConfig: {
                                            alg: alg,
                                        },
                                    },
                                },
                            })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata).toMatchObject({
                            jwks_uri: remoteUrl,
                            id_token_signing_alg_values_supported: [alg],
                        });
                        return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                    case 3:
                        oauthMetadata = _a.sent();
                        (0, vitest_1.expect)(oauthMetadata).toMatchObject(metadata !== null && metadata !== void 0 ? metadata : {});
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should support disableJwtPlugin", function () { return __awaiter(void 0, void 0, void 0, function () {
            var auth, metadata, oauthMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, createTestInstance({
                            oauthProviderConfig: {
                                disableJwtPlugin: true,
                            },
                        })];
                    case 1:
                        auth = (_a.sent()).auth;
                        return [4 /*yield*/, auth.api.getOpenIdConfig()];
                    case 2:
                        metadata = _a.sent();
                        (0, vitest_1.expect)(metadata).toMatchObject({
                            id_token_signing_alg_values_supported: ["HS256"],
                        });
                        return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                    case 3:
                        oauthMetadata = _a.sent();
                        (0, vitest_1.expect)(oauthMetadata).toMatchObject(metadata !== null && metadata !== void 0 ? metadata : {});
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
/**
 * @see https://github.com/better-auth/better-auth/issues/9105
 */
(0, vitest_1.describe)("dynamic baseURL metadata wrappers", function () { return __awaiter(void 0, void 0, void 0, function () {
    var host, expectedBaseURL, auth;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                host = "tenant.example.com";
                expectedBaseURL = "https://".concat(host, "/api/auth");
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: {
                            allowedHosts: [host],
                            protocol: "https",
                            fallback: "https://fallback.example.com",
                        },
                        plugins: [
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, jwt_1.jwt)(),
                        ],
                    })];
            case 1:
                auth = (_a.sent()).auth;
                (0, vitest_1.it)("oauthProviderAuthServerMetadata resolves baseURL from the incoming request", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var request, response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                request = new Request("https://".concat(host, "/.well-known/oauth-authorization-server"));
                                return [4 /*yield*/, (0, metadata_1.oauthProviderAuthServerMetadata)(auth)(request)];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(200);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.issuer).toBe(expectedBaseURL);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("oauthProviderOpenIdConfigMetadata resolves baseURL from the incoming request", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var request, response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                request = new Request("https://".concat(host, "/.well-known/openid-configuration"));
                                return [4 /*yield*/, (0, metadata_1.oauthProviderOpenIdConfigMetadata)(auth)(request)];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(200);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.issuer).toBe(expectedBaseURL);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth resource metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
    var authServerBaseUrl, validResource, supportedScopes, _a, auth, customFetchImpl, authClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                authServerBaseUrl = "http://localhost:3000";
                validResource = "https://myapi.example.com";
                supportedScopes = [
                    "openid",
                    "profile",
                    "email",
                    "offline_access",
                    "read:posts",
                ];
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: authServerBaseUrl,
                        plugins: [
                            (0, jwt_1.jwt)({
                                jwt: {
                                    issuer: authServerBaseUrl,
                                },
                            }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                resources: [validResource],
                                enforcePerClientResources: false,
                                scopes: supportedScopes,
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, customFetchImpl = _a.customFetchImpl;
                authClient = (0, client_1.createAuthClient)({
                    plugins: [(0, client_resource_1.oauthProviderResourceClient)(auth)],
                    baseURL: authServerBaseUrl,
                    fetchOptions: {
                        customFetchImpl: customFetchImpl,
                    },
                });
                (0, vitest_1.it)("should provide resource discovery configuration", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, authClient.getProtectedResourceMetadata({
                                    resource: validResource,
                                })];
                            case 1:
                                metadata = _a.sent();
                                (0, vitest_1.expect)(metadata).toMatchObject({
                                    resource: validResource,
                                    authorization_servers: [authServerBaseUrl],
                                    dpop_signing_alg_values_supported: __spreadArray([], oauth2_1.DPOP_SIGNING_ALGORITHMS, true),
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should allow overwriting any field", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var anotherIssuer, anotherResource, metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                anotherIssuer = "https://admin.example.com";
                                anotherResource = "https://another-api.example.com";
                                return [4 /*yield*/, authClient.getProtectedResourceMetadata({
                                        resource: anotherResource,
                                        authorization_servers: [anotherIssuer],
                                    })];
                            case 1:
                                metadata = _a.sent();
                                (0, vitest_1.expect)(metadata).toMatchObject({
                                    resource: anotherResource,
                                    authorization_servers: [anotherIssuer],
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should not support 'openid' scope", function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, vitest_1.expect)(authClient.getProtectedResourceMetadata({
                                    resource: validResource,
                                    scopes_supported: ["openid"],
                                })).rejects.toThrowError(error_1.BetterAuthError)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass with supported scopes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, authClient.getProtectedResourceMetadata({
                                    resource: validResource,
                                    scopes_supported: ["read:posts"],
                                })];
                            case 1:
                                metadata = _a.sent();
                                (0, vitest_1.expect)(metadata).toMatchObject({
                                    resource: validResource,
                                    authorization_servers: [authServerBaseUrl],
                                    scopes_supported: ["read:posts"],
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should fail unsupported scope", function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, vitest_1.expect)(authClient.getProtectedResourceMetadata({
                                    resource: validResource,
                                    scopes_supported: ["write:posts"],
                                })).rejects.toThrowError(error_1.BetterAuthError)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("should pass with externally available scopes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var anotherAuthorizationServer, metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                anotherAuthorizationServer = "https://auth.example.com";
                                return [4 /*yield*/, authClient.getProtectedResourceMetadata({
                                        resource: validResource,
                                        authorization_servers: [authServerBaseUrl, anotherAuthorizationServer],
                                        scopes_supported: ["read:posts", "write:posts"],
                                    }, {
                                        externalScopes: ["write:posts"],
                                    })];
                            case 1:
                                metadata = _a.sent();
                                (0, vitest_1.expect)(metadata).toMatchObject({
                                    resource: validResource,
                                    authorization_servers: [authServerBaseUrl, anotherAuthorizationServer],
                                    scopes_supported: ["read:posts", "write:posts"],
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
