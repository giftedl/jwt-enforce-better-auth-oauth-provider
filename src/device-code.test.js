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
var client_1 = require("better-auth/client");
var plugins_1 = require("better-auth/client/plugins");
var plugins_2 = require("better-auth/plugins");
var device_authorization_1 = require("better-auth/plugins/device-authorization");
var jwt_1 = require("better-auth/plugins/jwt");
var test_1 = require("better-auth/test");
var jose_1 = require("jose");
var vitest_1 = require("vitest");
var client_2 = require("./client");
var device_code_1 = require("./device-code");
var oauth_1 = require("./oauth");
var FORM_HEADERS = { "content-type": "application/x-www-form-urlencoded" };
(0, vitest_1.describe)("oauth-provider device-code composition", function () {
    (0, vitest_1.it)("registers Device Authorization and its OAuth grant from one plugin", function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseURL, auth, metadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseURL = "http://localhost:3000";
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: baseURL,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                }),
                                (0, device_code_1.oauthDeviceAuthorization)(),
                            ],
                        })];
                case 1:
                    auth = (_a.sent()).auth;
                    return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                case 2:
                    metadata = (_a.sent());
                    (0, vitest_1.expect)(metadata.device_authorization_endpoint).toBe("".concat(baseURL, "/api/auth/device/code"));
                    (0, vitest_1.expect)(metadata.grant_types_supported).toContain(device_code_1.DEVICE_CODE_GRANT_TYPE);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("explains when OAuth Provider is missing", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({ plugins: [(0, device_code_1.oauthDeviceAuthorization)()] })).rejects.toMatchObject({
                        message: "oauthDeviceAuthorization() requires oauthProvider() or mcp().",
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("rejects a second Device Authorization plugin", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, vitest_1.expect)((0, test_1.getTestInstance)({
                        plugins: [
                            (0, jwt_1.jwt)(),
                            (0, device_authorization_1.deviceAuthorization)(),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                            }),
                            (0, device_code_1.oauthDeviceAuthorization)(),
                        ],
                    })).rejects.toMatchObject({
                        message: "oauthDeviceAuthorization() cannot be combined with another Device Authorization plugin.",
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("composes before OAuth Provider in the plugin list", function () { return __awaiter(void 0, void 0, void 0, function () {
        var baseURL, auth, metadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseURL = "http://localhost:3001";
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            baseURL: baseURL,
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, device_code_1.oauthDeviceAuthorization)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                }),
                            ],
                        })];
                case 1:
                    auth = (_a.sent()).auth;
                    return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                case 2:
                    metadata = (_a.sent());
                    (0, vitest_1.expect)(metadata.grant_types_supported).toContain(device_code_1.DEVICE_CODE_GRANT_TYPE);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("exposes OAuth contracts only in composed installations", function () { return __awaiter(void 0, void 0, void 0, function () {
        var standaloneClient, composedClient, standaloneAuth, composedAuth, getDeviceCodeOperation, getRequestProperties, getUnauthorizedResponse, standaloneDocument, composedDocument;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    standaloneClient = (0, client_1.createAuthClient)({
                        plugins: [(0, plugins_1.deviceAuthorizationClient)()],
                    });
                    composedClient = (0, client_1.createAuthClient)({
                        plugins: [(0, client_2.oauthDeviceAuthorizationClient)()],
                    });
                    (0, vitest_1.expectTypeOf)().not.toHaveProperty("resource");
                    (0, vitest_1.expectTypeOf)().not.toHaveProperty("client_secret");
                    (0, vitest_1.expectTypeOf)().not.toHaveProperty("client_assertion");
                    (0, vitest_1.expectTypeOf)().not.toHaveProperty("client_assertion_type");
                    (0, vitest_1.expectTypeOf)()
                        .toHaveProperty("resource")
                        .toEqualTypeOf();
                    (0, vitest_1.expectTypeOf)()
                        .toHaveProperty("client_secret")
                        .toEqualTypeOf();
                    (0, vitest_1.expectTypeOf)()
                        .toHaveProperty("client_assertion")
                        .toEqualTypeOf();
                    (0, vitest_1.expectTypeOf)()
                        .toHaveProperty("client_assertion_type")
                        .toEqualTypeOf();
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            plugins: [(0, device_authorization_1.deviceAuthorization)(), (0, plugins_2.openAPI)()],
                        })];
                case 1:
                    standaloneAuth = (_c.sent()).auth;
                    return [4 /*yield*/, (0, test_1.getTestInstance)({
                            plugins: [
                                (0, jwt_1.jwt)(),
                                (0, oauth_1.oauthProvider)({
                                    loginPage: "/login",
                                    consentPage: "/consent",
                                }),
                                (0, device_code_1.oauthDeviceAuthorization)(),
                                (0, plugins_2.openAPI)(),
                            ],
                        })];
                case 2:
                    composedAuth = (_c.sent()).auth;
                    getDeviceCodeOperation = function (document) { var _a; return (_a = document.paths["/device/code"]) === null || _a === void 0 ? void 0 : _a.post; };
                    getRequestProperties = function (document) {
                        var _a, _b, _c, _d, _e, _f;
                        return (_f = (_e = (_d = (_c = (_b = (_a = getDeviceCodeOperation(document)) === null || _a === void 0 ? void 0 : _a.requestBody) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c["application/json"]) === null || _d === void 0 ? void 0 : _d.schema) === null || _e === void 0 ? void 0 : _e.properties) !== null && _f !== void 0 ? _f : {};
                    };
                    getUnauthorizedResponse = function (document) { var _a, _b; return (_b = (_a = getDeviceCodeOperation(document)) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b["401"]; };
                    return [4 /*yield*/, standaloneAuth.api.generateOpenAPISchema()];
                case 3:
                    standaloneDocument = _c.sent();
                    return [4 /*yield*/, composedAuth.api.generateOpenAPISchema()];
                case 4:
                    composedDocument = _c.sent();
                    (0, vitest_1.expect)(getRequestProperties(standaloneDocument)).not.toHaveProperty("resource");
                    (0, vitest_1.expect)(getRequestProperties(standaloneDocument)).not.toHaveProperty("client_secret");
                    (0, vitest_1.expect)(getRequestProperties(standaloneDocument)).not.toHaveProperty("client_assertion");
                    (0, vitest_1.expect)(getRequestProperties(standaloneDocument)).not.toHaveProperty("client_assertion_type");
                    (0, vitest_1.expect)(getRequestProperties(composedDocument)).toHaveProperty("resource");
                    (0, vitest_1.expect)(getRequestProperties(composedDocument)).toHaveProperty("client_secret");
                    (0, vitest_1.expect)(getRequestProperties(composedDocument)).toHaveProperty("client_assertion");
                    (0, vitest_1.expect)(getRequestProperties(composedDocument)).toHaveProperty("client_assertion_type");
                    (0, vitest_1.expect)((_b = (_a = getUnauthorizedResponse(standaloneDocument)) === null || _a === void 0 ? void 0 : _a.headers) !== null && _b !== void 0 ? _b : {}).not.toHaveProperty("WWW-Authenticate");
                    (0, vitest_1.expect)(getUnauthorizedResponse(composedDocument)).toMatchObject({
                        headers: {
                            "WWW-Authenticate": {
                                schema: { type: "string", example: "Basic" },
                            },
                        },
                        content: {
                            "application/json": {
                                schema: {
                                    properties: {
                                        error: { enum: ["invalid_client"] },
                                    },
                                },
                            },
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("oauth-provider device-code grant", function () { return __awaiter(void 0, void 0, void 0, function () {
    /** Registers a public OAuth client able to use the device-code grant. */
    function createDeviceClient() {
        return __awaiter(this, arguments, void 0, function (grantTypes, scope) {
            var headers, created;
            if (grantTypes === void 0) { grantTypes = [device_code_1.DEVICE_CODE_GRANT_TYPE]; }
            if (scope === void 0) { scope = "openid profile email"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, signInWithTestUser()];
                    case 1:
                        headers = (_a.sent()).headers;
                        return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                headers: headers,
                                body: {
                                    token_endpoint_auth_method: "none",
                                    grant_types: grantTypes,
                                    scope: scope,
                                    application_type: "native",
                                },
                            })];
                    case 2:
                        created = _a.sent();
                        return [2 /*return*/, created.client_id];
                }
            });
        });
    }
    /** Drives the device authorization request and user approval, returning the device code. */
    function approvedDeviceCode(clientId_1) {
        return __awaiter(this, arguments, void 0, function (clientId, scope, requestedResource) {
            var headers, _a, device_code, user_code, verification;
            if (scope === void 0) { scope = "openid profile email"; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, signInWithTestUser()];
                    case 1:
                        headers = (_b.sent()).headers;
                        return [4 /*yield*/, auth.api.deviceCode({
                                body: { client_id: clientId, scope: scope, resource: requestedResource },
                            })];
                    case 2:
                        _a = _b.sent(), device_code = _a.device_code, user_code = _a.user_code;
                        return [4 /*yield*/, auth.api.deviceVerify({
                                query: { user_code: user_code },
                                headers: headers,
                            })];
                    case 3:
                        verification = _b.sent();
                        if (requestedResource !== undefined) {
                            (0, vitest_1.expect)(verification.resource).toEqual(requestedResource);
                        }
                        return [4 /*yield*/, auth.api.deviceApprove({ body: { userCode: user_code }, headers: headers })];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, device_code];
                }
            });
        });
    }
    function pollToken(body) {
        return client.$fetch("/oauth2/token", {
            method: "POST",
            body: new URLSearchParams(body),
            headers: FORM_HEADERS,
        });
    }
    /** Polls an approved device code with a DPoP proof. */
    function createDpopPoller(clientId, deviceCode) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, privateKey, publicKey, publicJwk, proofFor, poll;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, jose_1.generateKeyPair)("ES256", {
                            extractable: true,
                        })];
                    case 1:
                        _a = _b.sent(), privateKey = _a.privateKey, publicKey = _a.publicKey;
                        return [4 /*yield*/, (0, jose_1.exportJWK)(publicKey)];
                    case 2:
                        publicJwk = _b.sent();
                        proofFor = function (htu) {
                            if (htu === void 0) { htu = "".concat(baseURL, "/api/auth/oauth2/token"); }
                            return new jose_1.SignJWT({
                                jti: crypto.randomUUID(),
                                htm: "POST",
                                htu: htu,
                                iat: Math.floor(Date.now() / 1000),
                            })
                                .setProtectedHeader({ typ: "dpop+jwt", alg: "ES256", jwk: publicJwk })
                                .sign(privateKey);
                        };
                        poll = function (proof) {
                            return client.$fetch("/oauth2/token", {
                                method: "POST",
                                body: new URLSearchParams({
                                    grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                    device_code: deviceCode,
                                    client_id: clientId,
                                }),
                                headers: __assign(__assign({}, FORM_HEADERS), { dpop: proof }),
                            });
                        };
                        return [2 /*return*/, { proofFor: proofFor, poll: poll }];
                }
            });
        });
    }
    var baseURL, resource, secondResource, onDeviceAuthRequest, _a, auth, client, db, signInWithTestUser, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseURL = "http://localhost:3000";
                resource = "https://api.example.com";
                secondResource = "https://files.example.com";
                onDeviceAuthRequest = vitest_1.vi.fn();
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseURL,
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: baseURL } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                resources: [resource, secondResource],
                                enforcePerClientResources: false,
                                allowDynamicClientRegistration: true,
                                scopes: ["openid", "profile", "email", "offline_access"],
                            }),
                            (0, device_code_1.oauthDeviceAuthorization)({
                                expiresIn: "5min",
                                interval: "2s",
                                onDeviceAuthRequest: onDeviceAuthRequest,
                            }),
                        ],
                    }, {
                        clientOptions: {
                            plugins: [(0, client_2.oauthProviderClient)()],
                        },
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, db = _a.db, signInWithTestUser = _a.signInWithTestUser;
                return [4 /*yield*/, signInWithTestUser()];
            case 2:
                user = (_b.sent()).user;
                (0, vitest_1.it)("adds OAuth fields only when the device grant is composed", function () {
                    var _a, _b;
                    var standaloneFields = (_a = (0, device_authorization_1.deviceAuthorization)().schema.deviceCode) === null || _a === void 0 ? void 0 : _a.fields;
                    var oauthDevicePlugin = (0, device_code_1.oauthDeviceAuthorization)();
                    var oauthFields = (_b = oauthDevicePlugin.schema.deviceCode) === null || _b === void 0 ? void 0 : _b.fields;
                    (0, vitest_1.expect)(standaloneFields).not.toHaveProperty("resource");
                    (0, vitest_1.expect)(standaloneFields).not.toHaveProperty("resources");
                    (0, vitest_1.expect)(standaloneFields).not.toHaveProperty("oauthClientId");
                    (0, vitest_1.expect)(oauthFields).toHaveProperty("resources");
                    (0, vitest_1.expect)(oauthFields).toHaveProperty("oauthClientId");
                    (0, vitest_1.expect)(oauthDevicePlugin.endpoints.deviceCode.options.error.safeParse({
                        error: "invalid_target",
                        error_description: "Unsupported resource",
                    }).success).toBe(true);
                });
                /**
                 * @see https://datatracker.ietf.org/doc/html/rfc9449#section-8
                 */
                (0, vitest_1.it)("keeps an approved device code when the poll's DPoP proof is rejected", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, _a, proofFor, poll, _b, _c, rejected, _d, issued, _e;
                    var _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _g.sent();
                                _b = createDpopPoller;
                                _c = [clientId];
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 2: return [4 /*yield*/, _b.apply(void 0, _c.concat([_g.sent()]))];
                            case 3:
                                _a = _g.sent(), proofFor = _a.proofFor, poll = _a.poll;
                                _d = poll;
                                return [4 /*yield*/, proofFor("".concat(baseURL, "/api/auth/oauth2/introspect"))];
                            case 4: return [4 /*yield*/, _d.apply(void 0, [_g.sent()])];
                            case 5:
                                rejected = _g.sent();
                                (0, vitest_1.expect)(rejected.error).toMatchObject({ error: "invalid_dpop_proof" });
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2100); })];
                            case 6:
                                _g.sent();
                                _e = poll;
                                return [4 /*yield*/, proofFor()];
                            case 7: return [4 /*yield*/, _e.apply(void 0, [_g.sent()])];
                            case 8:
                                issued = _g.sent();
                                (0, vitest_1.expect)(issued.error).toBeNull();
                                (0, vitest_1.expect)((_f = issued.data) === null || _f === void 0 ? void 0 : _f.token_type).toBe("DPoP");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("issues once when two polls with one DPoP proof arrive together", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, _a, proofFor, poll, _b, _c, proof, results, successes, loser;
                    var _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _g.sent();
                                _b = createDpopPoller;
                                _c = [clientId];
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 2: return [4 /*yield*/, _b.apply(void 0, _c.concat([_g.sent()]))];
                            case 3:
                                _a = _g.sent(), proofFor = _a.proofFor, poll = _a.poll;
                                return [4 /*yield*/, proofFor()];
                            case 4:
                                proof = _g.sent();
                                return [4 /*yield*/, Promise.all([poll(proof), poll(proof)])];
                            case 5:
                                results = _g.sent();
                                successes = results.filter(function (result) { return result.error === null; });
                                (0, vitest_1.expect)(successes).toHaveLength(1);
                                (0, vitest_1.expect)((_e = (_d = successes[0]) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.token_type).toBe("DPoP");
                                loser = (_f = results.find(function (result) { return result.error !== null; })) === null || _f === void 0 ? void 0 : _f.error;
                                (0, vitest_1.expect)(["invalid_grant", "slow_down"]).toContain(loser === null || loser === void 0 ? void 0 : loser.error);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("accepts a confidential client authenticated with Basic without body client_id", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, created, response, verification;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_d.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_basic",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                            redirect_uris: ["https://client.example.com/callback"],
                                        },
                                    })];
                            case 2:
                                created = _d.sent();
                                if (!(created === null || created === void 0 ? void 0 : created.client_id) || !created.client_secret) {
                                    throw new Error("confidential OAuth client was not created");
                                }
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams({ scope: "openid" }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(created.client_id, ":").concat(created.client_secret)).toString("base64")) }),
                                    })];
                            case 3:
                                response = _d.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.device_code).toEqual(vitest_1.expect.any(String));
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.user_code).toEqual(vitest_1.expect.any(String));
                                return [4 /*yield*/, auth.api.deviceVerify({
                                        query: { user_code: (_c = response.data) === null || _c === void 0 ? void 0 : _c.user_code },
                                        headers: headers,
                                    })];
                            case 4:
                                verification = _d.sent();
                                (0, vitest_1.expect)(verification.client_id).toBe(created.client_id);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("accepts a confidential client authenticated with client_secret_post", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, created, response, verification;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_d.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                            redirect_uris: ["https://post.example.com/callback"],
                                        },
                                    })];
                            case 2:
                                created = _d.sent();
                                if (!(created === null || created === void 0 ? void 0 : created.client_id) || !created.client_secret) {
                                    throw new Error("confidential OAuth client was not created");
                                }
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            client_id: created.client_id,
                                            client_secret: created.client_secret,
                                            scope: "openid",
                                        }),
                                        headers: FORM_HEADERS,
                                    })];
                            case 3:
                                response = _d.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)((_a = response.data) === null || _a === void 0 ? void 0 : _a.device_code).toEqual(vitest_1.expect.any(String));
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.user_code).toEqual(vitest_1.expect.any(String));
                                return [4 /*yield*/, auth.api.deviceVerify({
                                        query: { user_code: (_c = response.data) === null || _c === void 0 ? void 0 : _c.user_code },
                                        headers: headers,
                                    })];
                            case 4:
                                verification = _d.sent();
                                (0, vitest_1.expect)(verification.client_id).toBe(created.client_id);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("accepts client_secret_post through the in-process API contract", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, created, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_a.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                            redirect_uris: ["https://post-api.example.com/callback"],
                                        },
                                    })];
                            case 2:
                                created = _a.sent();
                                if (!(created === null || created === void 0 ? void 0 : created.client_id) || !created.client_secret) {
                                    throw new Error("confidential OAuth client was not created");
                                }
                                return [4 /*yield*/, auth.api.deviceCode({
                                        body: {
                                            client_id: created.client_id,
                                            client_secret: created.client_secret,
                                            scope: "openid",
                                        },
                                    })];
                            case 3:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.device_code).toEqual(vitest_1.expect.any(String));
                                (0, vitest_1.expect)(response.user_code).toEqual(vitest_1.expect.any(String));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("authenticates an assertion whose client ID is supplied intrinsically", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var assertionMethod, assertionValue, assertionClientId, _a, assertionAuth, assertionClient, signInWithAssertionUser, headers, created, response, verification;
                    var _b;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                assertionMethod = "https://example.com/device-assertion";
                                assertionValue = "valid-device-assertion";
                                assertionClientId = "intrinsic-assertion-client";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: baseURL,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: baseURL } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                extensions: [
                                                    {
                                                        clientAuthentication: (_b = {},
                                                            _b[assertionMethod] = {
                                                                assertionTypes: [assertionMethod],
                                                                authenticate: function (_a) {
                                                                    var assertion = _a.assertion;
                                                                    if (assertion !== assertionValue) {
                                                                        throw new Error("invalid assertion");
                                                                    }
                                                                    return { clientId: assertionClientId };
                                                                },
                                                            },
                                                            _b),
                                                    },
                                                ],
                                                generateClientId: function () { return assertionClientId; },
                                                scopes: ["openid"],
                                            }),
                                            (0, device_code_1.oauthDeviceAuthorization)(),
                                        ],
                                    }, {
                                        clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] },
                                    })];
                            case 1:
                                _a = _d.sent(), assertionAuth = _a.auth, assertionClient = _a.client, signInWithAssertionUser = _a.signInWithTestUser;
                                return [4 /*yield*/, signInWithAssertionUser()];
                            case 2:
                                headers = (_d.sent()).headers;
                                return [4 /*yield*/, assertionAuth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: assertionMethod,
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "native",
                                        },
                                    })];
                            case 3:
                                created = _d.sent();
                                (0, vitest_1.expect)(created === null || created === void 0 ? void 0 : created.client_id).toBe(assertionClientId);
                                return [4 /*yield*/, assertionClient.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            client_assertion_type: assertionMethod,
                                            client_assertion: assertionValue,
                                            scope: "openid",
                                        }),
                                        headers: FORM_HEADERS,
                                    })];
                            case 4:
                                response = _d.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                return [4 /*yield*/, assertionAuth.api.deviceVerify({
                                        query: { user_code: (_c = response.data) === null || _c === void 0 ? void 0 : _c.user_code },
                                        headers: headers,
                                    })];
                            case 5:
                                verification = _d.sent();
                                (0, vitest_1.expect)(verification.client_id).toBe(assertionClientId);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects multiple client authentication methods and repeated authentication parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, confidentialClient, tokenResponse, deviceResponse, unsupportedHeaderResponse, emptyBasicResponse, postClient, oneEffectiveSecretForm, oneEffectiveSecretResponse, publicClientId, unsupportedHeaderChallenge, unsupportedHeaderPublicResponse, _i, _a, field, response, _b, _c, field, form, response, repeatedResourceForm, repeatedResourceResponse;
                    var _d;
                    var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                    return __generator(this, function (_v) {
                        switch (_v.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_v.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_basic",
                                            grant_types: ["client_credentials", device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                            redirect_uris: ["https://cardinality.example.com/callback"],
                                        },
                                    })];
                            case 2:
                                confidentialClient = _v.sent();
                                if (!(confidentialClient === null || confidentialClient === void 0 ? void 0 : confidentialClient.client_id) || !confidentialClient.client_secret) {
                                    throw new Error("confidential OAuth client was not created");
                                }
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "client_credentials",
                                            client_id: confidentialClient.client_id,
                                            client_secret: confidentialClient.client_secret,
                                            scope: "openid",
                                        }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(confidentialClient.client_id, ":").concat(confidentialClient.client_secret)).toString("base64")) }),
                                    })];
                            case 3:
                                tokenResponse = _v.sent();
                                (0, vitest_1.expect)((_e = tokenResponse.error) === null || _e === void 0 ? void 0 : _e.status).toBe(400);
                                (0, vitest_1.expect)((_f = tokenResponse.error) === null || _f === void 0 ? void 0 : _f.error).toBe("invalid_request");
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            client_id: confidentialClient.client_id,
                                            client_secret: confidentialClient.client_secret,
                                            scope: "openid",
                                        }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(confidentialClient.client_id, ":").concat(confidentialClient.client_secret)).toString("base64")) }),
                                    })];
                            case 4:
                                deviceResponse = _v.sent();
                                (0, vitest_1.expect)((_g = deviceResponse.error) === null || _g === void 0 ? void 0 : _g.status).toBe(400);
                                (0, vitest_1.expect)((_h = deviceResponse.error) === null || _h === void 0 ? void 0 : _h.error).toBe("invalid_request");
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: "client_credentials",
                                            client_id: confidentialClient.client_id,
                                            client_secret: confidentialClient.client_secret,
                                            scope: "openid",
                                        }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Bearer unsupported" }),
                                    })];
                            case 5:
                                unsupportedHeaderResponse = _v.sent();
                                (0, vitest_1.expect)((_j = unsupportedHeaderResponse.error) === null || _j === void 0 ? void 0 : _j.status).toBe(400);
                                (0, vitest_1.expect)((_k = unsupportedHeaderResponse.error) === null || _k === void 0 ? void 0 : _k.error).toBe("invalid_request");
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams([
                                            ["client_id", confidentialClient.client_id],
                                            ["client_secret", ""],
                                            ["scope", "openid"],
                                        ]),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(confidentialClient.client_id, ":").concat(confidentialClient.client_secret)).toString("base64")) }),
                                    })];
                            case 6:
                                emptyBasicResponse = _v.sent();
                                (0, vitest_1.expect)(emptyBasicResponse.error).toBeNull();
                                (0, vitest_1.expect)((_l = emptyBasicResponse.data) === null || _l === void 0 ? void 0 : _l.device_code).toEqual(vitest_1.expect.any(String));
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_post",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                            redirect_uris: ["https://cardinality-post.example.com/callback"],
                                        },
                                    })];
                            case 7:
                                postClient = _v.sent();
                                if (!(postClient === null || postClient === void 0 ? void 0 : postClient.client_id) || !postClient.client_secret) {
                                    throw new Error("post OAuth client was not created");
                                }
                                oneEffectiveSecretForm = new URLSearchParams([
                                    ["client_id", postClient.client_id],
                                    ["client_secret", ""],
                                    ["client_secret", postClient.client_secret],
                                    ["scope", "openid"],
                                ]);
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: oneEffectiveSecretForm,
                                        headers: FORM_HEADERS,
                                    })];
                            case 8:
                                oneEffectiveSecretResponse = _v.sent();
                                (0, vitest_1.expect)(oneEffectiveSecretResponse.error).toBeNull();
                                (0, vitest_1.expect)((_m = oneEffectiveSecretResponse.data) === null || _m === void 0 ? void 0 : _m.device_code).toEqual(vitest_1.expect.any(String));
                                return [4 /*yield*/, createDeviceClient()];
                            case 9:
                                publicClientId = _v.sent();
                                unsupportedHeaderChallenge = null;
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            client_id: publicClientId,
                                            scope: "openid",
                                        }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Bearer unsupported" }),
                                        onError: function (_a) {
                                            var response = _a.response;
                                            unsupportedHeaderChallenge = response.headers.get("www-authenticate");
                                        },
                                    })];
                            case 10:
                                unsupportedHeaderPublicResponse = _v.sent();
                                (0, vitest_1.expect)((_o = unsupportedHeaderPublicResponse.error) === null || _o === void 0 ? void 0 : _o.status).toBe(401);
                                (0, vitest_1.expect)((_p = unsupportedHeaderPublicResponse.error) === null || _p === void 0 ? void 0 : _p.error).toBe("invalid_client");
                                (0, vitest_1.expect)(unsupportedHeaderChallenge).toBe("Bearer");
                                _i = 0, _a = [
                                    "client_secret",
                                    "client_assertion",
                                    "client_assertion_type",
                                ];
                                _v.label = 11;
                            case 11:
                                if (!(_i < _a.length)) return [3 /*break*/, 14];
                                field = _a[_i];
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: (_d = {
                                                client_id: publicClientId,
                                                scope: "openid"
                                            },
                                            _d[field] = 42,
                                            _d),
                                        headers: { "content-type": "application/json" },
                                    })];
                            case 12:
                                response = _v.sent();
                                (0, vitest_1.expect)((_q = response.error) === null || _q === void 0 ? void 0 : _q.status).toBe(400);
                                (0, vitest_1.expect)((_r = response.error) === null || _r === void 0 ? void 0 : _r.error).toBe("invalid_request");
                                _v.label = 13;
                            case 13:
                                _i++;
                                return [3 /*break*/, 11];
                            case 14:
                                _b = 0, _c = [
                                    "client_secret",
                                    "client_assertion",
                                    "client_assertion_type",
                                ];
                                _v.label = 15;
                            case 15:
                                if (!(_b < _c.length)) return [3 /*break*/, 18];
                                field = _c[_b];
                                form = new URLSearchParams([
                                    ["client_id", publicClientId],
                                    ["scope", "openid"],
                                    [field, "first"],
                                    [field, "second"],
                                ]);
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: form,
                                        headers: FORM_HEADERS,
                                    })];
                            case 16:
                                response = _v.sent();
                                (0, vitest_1.expect)((_s = response.error) === null || _s === void 0 ? void 0 : _s.status).toBe(400);
                                (0, vitest_1.expect)((_t = response.error) === null || _t === void 0 ? void 0 : _t.error).toBe("invalid_request");
                                _v.label = 17;
                            case 17:
                                _b++;
                                return [3 /*break*/, 15];
                            case 18:
                                repeatedResourceForm = new URLSearchParams([
                                    ["client_id", publicClientId],
                                    ["scope", "openid"],
                                    ["resource", resource],
                                    ["resource", secondResource],
                                ]);
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: repeatedResourceForm,
                                        headers: FORM_HEADERS,
                                    })];
                            case 19:
                                repeatedResourceResponse = _v.sent();
                                (0, vitest_1.expect)(repeatedResourceResponse.error).toBeNull();
                                (0, vitest_1.expect)((_u = repeatedResourceResponse.data) === null || _u === void 0 ? void 0 : _u.device_code).toEqual(vitest_1.expect.any(String));
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects an unknown client in composed mode without explicit standalone validation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/device/code", {
                                    method: "POST",
                                    body: new URLSearchParams({
                                        client_id: "unknown-composed-client",
                                        scope: "openid",
                                    }),
                                    headers: FORM_HEADERS,
                                })];
                            case 1:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns an RFC invalid_request envelope for duplicate base parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var form, response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                form = new URLSearchParams([
                                    ["client_id", "duplicate-parameter-client"],
                                    ["scope", "openid"],
                                    ["scope", "email"],
                                ]);
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: form,
                                        headers: FORM_HEADERS,
                                    })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                (0, vitest_1.expect)((_c = response.error) === null || _c === void 0 ? void 0 : _c.error_description).toMatch(/scope/);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns an RFC invalid_request envelope for malformed base parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/device/code", {
                                    method: "POST",
                                    body: { client_id: ["malformed-client"], scope: "openid" },
                                    headers: { "content-type": "application/json" },
                                })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                (0, vitest_1.expect)((_c = response.error) === null || _c === void 0 ? void 0 : _c.error_description).toMatch(/client_id/);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns invalid_request when an unauthenticated request omits client_id", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, client.$fetch("/device/code", {
                                    method: "POST",
                                    body: new URLSearchParams({ scope: "openid" }),
                                    headers: FORM_HEADERS,
                                })];
                            case 1:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                (0, vitest_1.expect)((_c = response.error) === null || _c === void 0 ? void 0 : _c.error_description).toMatch(/client_id/);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns invalid_client when Basic auth and body client_id identify different clients", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, authenticatedClient, bodyClient, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_c.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_basic",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                            redirect_uris: ["https://authenticated.example.com/callback"],
                                        },
                                    })];
                            case 2:
                                authenticatedClient = _c.sent();
                                if (!(authenticatedClient === null || authenticatedClient === void 0 ? void 0 : authenticatedClient.client_id) || !authenticatedClient.client_secret) {
                                    throw new Error("authenticated OAuth client was not created");
                                }
                                return [4 /*yield*/, createDeviceClient()];
                            case 3:
                                bodyClient = _c.sent();
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams({ client_id: bodyClient, scope: "openid" }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(authenticatedClient.client_id, ":").concat(authenticatedClient.client_secret)).toString("base64")) }),
                                    })];
                            case 4:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("treats an empty body client_id as omitted for authenticated requests", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var validateClient, _a, validatedAuth, validatedClient, signInWithValidatedUser, headers, created, response;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                validateClient = vitest_1.vi.fn(function () { return false; });
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: baseURL,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: baseURL } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                scopes: ["openid"],
                                            }),
                                            (0, device_code_1.oauthDeviceAuthorization)({ validateClient: validateClient }),
                                        ],
                                    }, {
                                        clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] },
                                    })];
                            case 1:
                                _a = _c.sent(), validatedAuth = _a.auth, validatedClient = _a.client, signInWithValidatedUser = _a.signInWithTestUser;
                                return [4 /*yield*/, signInWithValidatedUser()];
                            case 2:
                                headers = (_c.sent()).headers;
                                return [4 /*yield*/, validatedAuth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_basic",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                            redirect_uris: ["https://empty-id.example.com/callback"],
                                        },
                                    })];
                            case 3:
                                created = _c.sent();
                                if (!(created === null || created === void 0 ? void 0 : created.client_id) || !created.client_secret) {
                                    throw new Error("confidential OAuth client was not created");
                                }
                                return [4 /*yield*/, validatedClient.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams([
                                            ["client_id", ""],
                                            ["client_id", created.client_id],
                                            ["scope", "openid"],
                                        ]),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(created.client_id, ":").concat(created.client_secret)).toString("base64")) }),
                                    })];
                            case 4:
                                response = _c.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.device_code).toEqual(vitest_1.expect.any(String));
                                (0, vitest_1.expect)(validateClient).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("does not route an authenticated unknown body client through standalone validation", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var validateClient, _a, validatedAuth, validatedClient, signInWithValidatedUser, headers, created, response;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                validateClient = vitest_1.vi.fn(function () { return true; });
                                return [4 /*yield*/, (0, test_1.getTestInstance)({
                                        baseURL: baseURL,
                                        plugins: [
                                            (0, jwt_1.jwt)({ jwt: { issuer: baseURL } }),
                                            (0, oauth_1.oauthProvider)({
                                                loginPage: "/login",
                                                consentPage: "/consent",
                                                scopes: ["openid"],
                                            }),
                                            (0, device_code_1.oauthDeviceAuthorization)({ validateClient: validateClient }),
                                        ],
                                    }, {
                                        clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] },
                                    })];
                            case 1:
                                _a = _d.sent(), validatedAuth = _a.auth, validatedClient = _a.client, signInWithValidatedUser = _a.signInWithTestUser;
                                return [4 /*yield*/, signInWithValidatedUser()];
                            case 2:
                                headers = (_d.sent()).headers;
                                return [4 /*yield*/, validatedAuth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_basic",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                            redirect_uris: ["https://unknown-id.example.com/callback"],
                                        },
                                    })];
                            case 3:
                                created = _d.sent();
                                if (!(created === null || created === void 0 ? void 0 : created.client_id) || !created.client_secret) {
                                    throw new Error("confidential OAuth client was not created");
                                }
                                return [4 /*yield*/, validatedClient.$fetch("/device/code", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            client_id: "unknown-standalone-id",
                                            scope: "openid",
                                        }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(created.client_id, ":").concat(created.client_secret)).toString("base64")) }),
                                    })];
                            case 4:
                                response = _d.sent();
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)((_c = response.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_client");
                                (0, vitest_1.expect)(validateClient).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("advertises device_authorization_endpoint in discovery metadata", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authServer, expectedEndpoint, openid;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                            case 1:
                                authServer = (_a.sent());
                                expectedEndpoint = String(authServer.token_endpoint).replace("/oauth2/token", "/device/code");
                                (0, vitest_1.expect)(authServer.device_authorization_endpoint).toBe(expectedEndpoint);
                                return [4 /*yield*/, auth.api.getOpenIdConfig()];
                            case 2:
                                openid = (_a.sent());
                                (0, vitest_1.expect)(openid.device_authorization_endpoint).toBe(expectedEndpoint);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("advertises the device_code grant in supported grant types", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var authServer;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.api.getOAuthServerConfig()];
                            case 1:
                                authServer = (_a.sent());
                                (0, vitest_1.expect)(authServer.grant_types_supported).toContain(device_code_1.DEVICE_CODE_GRANT_TYPE);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("issues a real OAuth token for an approved device code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, res, accessToken, idToken;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId, undefined, resource)];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: clientId,
                                        resource: resource,
                                    })];
                            case 3:
                                res = _c.sent();
                                (0, vitest_1.expect)(res.error).toBeNull();
                                (0, vitest_1.expect)((_a = res.data) === null || _a === void 0 ? void 0 : _a.token_type).toBe("Bearer");
                                (0, vitest_1.expect)((_b = res.data) === null || _b === void 0 ? void 0 : _b.scope).toBe("openid profile email");
                                accessToken = (0, jose_1.decodeJwt)(res.data.access_token);
                                (0, vitest_1.expect)(accessToken.sub).toBe(user.id);
                                (0, vitest_1.expect)(accessToken.client_id).toBe(clientId);
                                (0, vitest_1.expect)(accessToken.aud).toContain(resource);
                                (0, vitest_1.expect)(accessToken.scope.split(" ")).toContain("openid");
                                idToken = (0, jose_1.decodeJwt)(res.data.id_token);
                                (0, vitest_1.expect)(idToken.sub).toBe(user.id);
                                (0, vitest_1.expect)(idToken.aud).toBe(clientId);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("does not redeem a device grant after approval from a revoked cached session", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, guardedAuth, guardedClient, signIn, cookieSetter, headers, registered, current, _b, device_code, user_code, ctx, polled;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, (0, test_1.getTestInstance)({
                                    baseURL: baseURL,
                                    session: { cookieCache: { enabled: true, maxAge: 60 } },
                                    plugins: [
                                        (0, jwt_1.jwt)({ jwt: { issuer: baseURL } }),
                                        (0, oauth_1.oauthProvider)({
                                            loginPage: "/login",
                                            consentPage: "/consent",
                                            allowDynamicClientRegistration: true,
                                            scopes: ["openid", "profile", "email"],
                                        }),
                                        (0, device_code_1.oauthDeviceAuthorization)(),
                                    ],
                                }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
                            case 1:
                                _a = _d.sent(), guardedAuth = _a.auth, guardedClient = _a.client, signIn = _a.signInWithTestUser, cookieSetter = _a.cookieSetter;
                                return [4 /*yield*/, signIn()];
                            case 2:
                                headers = (_d.sent()).headers;
                                return [4 /*yield*/, guardedAuth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "none",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid profile email",
                                            application_type: "native",
                                        },
                                    })];
                            case 3:
                                registered = _d.sent();
                                return [4 /*yield*/, guardedClient.getSession({
                                        fetchOptions: { headers: headers, onSuccess: cookieSetter(headers) },
                                    })];
                            case 4:
                                current = _d.sent();
                                return [4 /*yield*/, guardedAuth.api.deviceCode({
                                        body: { client_id: registered.client_id },
                                    })];
                            case 5:
                                _b = _d.sent(), device_code = _b.device_code, user_code = _b.user_code;
                                return [4 /*yield*/, guardedAuth.api.deviceVerify({ query: { user_code: user_code }, headers: headers })];
                            case 6:
                                _d.sent();
                                return [4 /*yield*/, guardedAuth.$context];
                            case 7:
                                ctx = _d.sent();
                                return [4 /*yield*/, ctx.internalAdapter.deleteSession(current.data.session.token)];
                            case 8:
                                _d.sent();
                                return [4 /*yield*/, (0, vitest_1.expect)(guardedAuth.api.deviceApprove({
                                        body: { userCode: user_code },
                                        headers: headers,
                                    })).rejects.toMatchObject({ status: "UNAUTHORIZED" })];
                            case 9:
                                _d.sent();
                                return [4 /*yield*/, guardedClient.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: device_code,
                                            client_id: registered.client_id,
                                        }),
                                        headers: FORM_HEADERS,
                                    })];
                            case 10:
                                polled = _d.sent();
                                (0, vitest_1.expect)((_c = polled.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeUndefined();
                                (0, vitest_1.expect)(polled.error).not.toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns invalid_request when device-code polling omits client_id", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                    })];
                            case 3:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10752#pullrequestreview-4910497732
                 */
                (0, vitest_1.it)("treats empty token client ID occurrences as omitted regardless of order", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, _i, _a, clientIdValues, deviceCode, response;
                    var _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                _i = 0, _a = [
                                    ["", clientId],
                                    [clientId, ""],
                                ];
                                _c.label = 2;
                            case 2:
                                if (!(_i < _a.length)) return [3 /*break*/, 6];
                                clientIdValues = _a[_i];
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 3:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams(__spreadArray([
                                            ["grant_type", device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            ["device_code", deviceCode]
                                        ], clientIdValues.map(function (clientIdValue) { return [
                                            "client_id",
                                            clientIdValue,
                                        ]; }), true)),
                                        headers: FORM_HEADERS,
                                    })];
                            case 4:
                                response = _c.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                (0, vitest_1.expect)((_b = response.data) === null || _b === void 0 ? void 0 : _b.access_token).toEqual(vitest_1.expect.any(String));
                                _c.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 2];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns an HTTP Basic challenge when client authentication fails", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, responseHeaders, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: deviceCode,
                                        }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(clientId, ":wrong-secret")).toString("base64")) }),
                                        onError: function (context) {
                                            responseHeaders = context.response.headers;
                                        },
                                    })];
                            case 3:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(401);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_client");
                                (0, vitest_1.expect)(responseHeaders === null || responseHeaders === void 0 ? void 0 : responseHeaders.get("WWW-Authenticate")).toBe("Basic");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10135
                 */
                (0, vitest_1.it)("normalizes whitespace in approved scopes", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, res, accessToken;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _b.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId, "  openid\tprofile  email  ", resource)];
                            case 2:
                                deviceCode = _b.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: clientId,
                                        resource: resource,
                                    })];
                            case 3:
                                res = _b.sent();
                                (0, vitest_1.expect)(res.error).toBeNull();
                                (0, vitest_1.expect)((_a = res.data) === null || _a === void 0 ? void 0 : _a.scope).toBe("openid profile email");
                                accessToken = (0, jose_1.decodeJwt)(res.data.access_token);
                                (0, vitest_1.expect)(accessToken.scope).toBe("openid profile email");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects resources outside the provider policy", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _a.sent();
                                onDeviceAuthRequest.mockClear();
                                return [4 /*yield*/, (0, vitest_1.expect)(auth.api.deviceCode({
                                        body: {
                                            client_id: clientId,
                                            scope: "openid",
                                            resource: "https://unregistered.example.com",
                                        },
                                    })).rejects.toMatchObject({
                                        body: { error: "invalid_target" },
                                    })];
                            case 2:
                                _a.sent();
                                (0, vitest_1.expect)(onDeviceAuthRequest).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("treats an empty form resource as omitted within the OAuth flow", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, form, response, headers, verification, token;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _a.sent();
                                form = new URLSearchParams({
                                    client_id: clientId,
                                    scope: "openid",
                                    resource: "",
                                });
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: form,
                                        headers: FORM_HEADERS,
                                    })];
                            case 2:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                return [4 /*yield*/, signInWithTestUser()];
                            case 3:
                                headers = (_a.sent()).headers;
                                return [4 /*yield*/, auth.api.deviceVerify({
                                        query: { user_code: response.data.user_code },
                                        headers: headers,
                                    })];
                            case 4:
                                verification = _a.sent();
                                (0, vitest_1.expect)(verification.resource).toBeUndefined();
                                return [4 /*yield*/, auth.api.deviceApprove({
                                        body: { userCode: response.data.user_code },
                                        headers: headers,
                                    })];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: response.data.device_code,
                                        client_id: clientId,
                                    })];
                            case 6:
                                token = _a.sent();
                                (0, vitest_1.expect)(token.error).toBeNull();
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("keeps base validation when resource and client_id are both invalid", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var response, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.handler(new Request("".concat(baseURL, "/api/auth/device/code"), {
                                    method: "POST",
                                    headers: { "content-type": "application/json" },
                                    body: JSON.stringify({ client_id: 42, resource: "/api" }),
                                }))];
                            case 1:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.status).toBe(400);
                                return [4 /*yield*/, response.json()];
                            case 2:
                                body = (_a.sent());
                                (0, vitest_1.expect)(body.error).toBe("invalid_request");
                                return [2 /*return*/];
                        }
                    });
                }); });
                vitest_1.it.each([
                    ["malformed", "https://[invalid"],
                    ["relative", "/api"],
                    ["fragmented", "".concat(resource, "#fragment")],
                    ["dangerous-scheme", "javascript:alert(1)"],
                    ["wrong-type", 42],
                    ["array-item", [resource, "/api"]],
                ])("returns invalid_target for %s RFC 8707 resource indicators at the HTTP boundary", function (_label, invalidResource) { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, response;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: { client_id: clientId, resource: invalidResource },
                                    })];
                            case 2:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_target");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("binds repeated form-encoded resources at the device endpoint", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, form, response, headers, verification;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _a.sent();
                                form = new URLSearchParams({
                                    client_id: clientId,
                                    scope: "openid",
                                });
                                form.append("resource", resource);
                                form.append("resource", secondResource);
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: form,
                                        headers: FORM_HEADERS,
                                    })];
                            case 2:
                                response = _a.sent();
                                (0, vitest_1.expect)(response.error).toBeNull();
                                return [4 /*yield*/, signInWithTestUser()];
                            case 3:
                                headers = (_a.sent()).headers;
                                return [4 /*yield*/, auth.api.deviceVerify({
                                        query: { user_code: response.data.user_code },
                                        headers: headers,
                                    })];
                            case 4:
                                verification = _a.sent();
                                (0, vitest_1.expect)(verification.resource).toEqual([resource, secondResource]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("validates every repeated form-encoded resource", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, form, response;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _d.sent();
                                form = new URLSearchParams({
                                    client_id: clientId,
                                    scope: "openid",
                                });
                                form.append("resource", "/relative");
                                form.append("resource", resource);
                                return [4 /*yield*/, client.$fetch("/device/code", {
                                        method: "POST",
                                        body: form,
                                        headers: FORM_HEADERS,
                                    })];
                            case 2:
                                response = _d.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_target");
                                (0, vitest_1.expect)((_c = response.error) === null || _c === void 0 ? void 0 : _c.error_description).toBe("Invalid resource indicator");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a resource added after approval without consuming the code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, widened, stored;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId, "openid")];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: clientId,
                                        resource: resource,
                                    })];
                            case 3:
                                widened = _c.sent();
                                (0, vitest_1.expect)((_a = widened.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = widened.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_target");
                                return [4 /*yield*/, db.findOne({
                                        model: "deviceCode",
                                        where: [{ field: "deviceCode", value: deviceCode }],
                                    })];
                            case 4:
                                stored = _c.sent();
                                (0, vitest_1.expect)(stored === null || stored === void 0 ? void 0 : stored.deviceCode).toBe(deviceCode);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("keeps every approved resource refreshable after a narrowed exchange", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var scope, clientId, deviceCode, narrowed, refreshed;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                scope = "openid offline_access";
                                return [4 /*yield*/, createDeviceClient([device_code_1.DEVICE_CODE_GRANT_TYPE, "refresh_token"], scope)];
                            case 1:
                                clientId = _a.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId, scope, [
                                        resource,
                                        secondResource,
                                    ])];
                            case 2:
                                deviceCode = _a.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: clientId,
                                        resource: resource,
                                    })];
                            case 3:
                                narrowed = _a.sent();
                                (0, vitest_1.expect)(narrowed.error).toBeNull();
                                (0, vitest_1.expect)((0, jose_1.decodeJwt)(narrowed.data.access_token).aud).not.toContain(secondResource);
                                return [4 /*yield*/, pollToken({
                                        grant_type: "refresh_token",
                                        refresh_token: narrowed.data.refresh_token,
                                        client_id: clientId,
                                        resource: secondResource,
                                    })];
                            case 4:
                                refreshed = _a.sent();
                                (0, vitest_1.expect)(refreshed.error).toBeNull();
                                (0, vitest_1.expect)((0, jose_1.decodeJwt)(refreshed.data.access_token).aud).toContain(secondResource);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("single-uses the device code (second exchange fails)", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, first, second;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: clientId,
                                    })];
                            case 3:
                                first = _c.sent();
                                (0, vitest_1.expect)(first.error).toBeNull();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: clientId,
                                    })];
                            case 4:
                                second = _c.sent();
                                (0, vitest_1.expect)((_a = second.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = second.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10746#discussion_r3751447613
                 */
                (0, vitest_1.it)("preserves an approved code when user lookup fails before OAuth issuance", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, response, stored;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, db.update({
                                        model: "deviceCode",
                                        where: [{ field: "deviceCode", value: deviceCode }],
                                        update: { userId: "missing-user" },
                                    })];
                            case 3:
                                _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: clientId,
                                    })];
                            case 4:
                                response = _c.sent();
                                (0, vitest_1.expect)((_a = response.error) === null || _a === void 0 ? void 0 : _a.status).toBe(500);
                                (0, vitest_1.expect)((_b = response.error) === null || _b === void 0 ? void 0 : _b.error).toBe("server_error");
                                return [4 /*yield*/, db.findOne({
                                        model: "deviceCode",
                                        where: [{ field: "deviceCode", value: deviceCode }],
                                    })];
                            case 5:
                                stored = _c.sent();
                                (0, vitest_1.expect)(stored === null || stored === void 0 ? void 0 : stored.deviceCode).toBe(deviceCode);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns authorization_pending before approval", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, device_code, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, auth.api.deviceCode({
                                        body: { client_id: clientId, scope: "openid" },
                                    })];
                            case 2:
                                device_code = (_c.sent()).device_code;
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: device_code,
                                        client_id: clientId,
                                    })];
                            case 3:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("authorization_pending");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns slow_down when polling faster than the interval", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, device_code, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, auth.api.deviceCode({
                                        body: { client_id: clientId, scope: "openid" },
                                    })];
                            case 2:
                                device_code = (_c.sent()).device_code;
                                // First poll records lastPolledAt (still pending); the immediate second poll
                                // is inside the 2s interval and must be told to slow down.
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: device_code,
                                        client_id: clientId,
                                    })];
                            case 3:
                                // First poll records lastPolledAt (still pending); the immediate second poll
                                // is inside the 2s interval and must be told to slow down.
                                _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: device_code,
                                        client_id: clientId,
                                    })];
                            case 4:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("slow_down");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns access_denied when the user denies the request", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, headers, _a, device_code, user_code, res;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _d.sent();
                                return [4 /*yield*/, signInWithTestUser()];
                            case 2:
                                headers = (_d.sent()).headers;
                                return [4 /*yield*/, auth.api.deviceCode({
                                        body: { client_id: clientId, scope: "openid" },
                                    })];
                            case 3:
                                _a = _d.sent(), device_code = _a.device_code, user_code = _a.user_code;
                                return [4 /*yield*/, auth.api.deviceVerify({ query: { user_code: user_code }, headers: headers })];
                            case 4:
                                _d.sent();
                                return [4 /*yield*/, auth.api.deviceDeny({ body: { userCode: user_code }, headers: headers })];
                            case 5:
                                _d.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: device_code,
                                        client_id: clientId,
                                    })];
                            case 6:
                                res = _d.sent();
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)((_c = res.error) === null || _c === void 0 ? void 0 : _c.error).toBe("access_denied");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects an unknown device code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: "does-not-exist",
                                        client_id: clientId,
                                    })];
                            case 2:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/issues/11035
                 */
                (0, vitest_1.it)("returns invalid_client for an unknown client_id before looking up the device code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var res;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, pollToken({
                                    grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                    device_code: "does-not-exist",
                                    client_id: "unknown-client",
                                })];
                            case 1:
                                res = _b.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)(res.error).toMatchObject({
                                    error: "invalid_client",
                                    error_description: "client not found",
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("rejects a device code presented by a different client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, otherClientId, deviceCode, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, createDeviceClient()];
                            case 2:
                                otherClientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 3:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: otherClientId,
                                    })];
                            case 4:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("returns invalid_grant (not invalid_scope) when a narrower-scoped client replays a code", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var victimClientId, deviceCode, headers, attacker, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                victimClientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(victimClientId, "openid profile email")];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, signInWithTestUser()];
                            case 3:
                                headers = (_c.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "none",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "native",
                                        },
                                    })];
                            case 4:
                                attacker = _c.sent();
                                return [4 /*yield*/, pollToken({
                                        grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                        device_code: deviceCode,
                                        client_id: attacker.client_id,
                                    })];
                            case 5:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("does not reveal device-code scopes to a confidential client", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var victimClientId, deviceCode, headers, attacker, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                victimClientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(victimClientId, "openid profile email")];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, signInWithTestUser()];
                            case 3:
                                headers = (_c.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "client_secret_basic",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "web",
                                        },
                                    })];
                            case 4:
                                attacker = _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: deviceCode,
                                        }),
                                        headers: __assign(__assign({}, FORM_HEADERS), { authorization: "Basic ".concat(Buffer.from("".concat(attacker.client_id, ":").concat(attacker.client_secret)).toString("base64")) }),
                                    })];
                            case 5:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("blocks redeeming an OAuth-client device code at the first-party /device/token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, res;
                    var _a, _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _d.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 2:
                                deviceCode = _d.sent();
                                return [4 /*yield*/, client.$fetch("/device/token", {
                                        method: "POST",
                                        body: {
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: deviceCode,
                                            client_id: clientId,
                                        },
                                    })];
                            case 3:
                                res = _d.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                (0, vitest_1.expect)((_c = res.error) === null || _c === void 0 ? void 0 : _c.error_description).toContain("/oauth2/token");
                                return [2 /*return*/];
                        }
                    });
                }); });
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10135
                 */
                (0, vitest_1.it)("keeps minted OAuth codes out of the session flow after client deletion", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var clientId, deviceCode, context, res, stored;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, createDeviceClient()];
                            case 1:
                                clientId = _c.sent();
                                return [4 /*yield*/, approvedDeviceCode(clientId)];
                            case 2:
                                deviceCode = _c.sent();
                                return [4 /*yield*/, auth.$context];
                            case 3:
                                context = _c.sent();
                                return [4 /*yield*/, context.adapter.delete({
                                        model: "oauthClient",
                                        where: [{ field: "clientId", value: clientId }],
                                    })];
                            case 4:
                                _c.sent();
                                return [4 /*yield*/, client.$fetch("/device/token", {
                                        method: "POST",
                                        body: {
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: deviceCode,
                                            client_id: clientId,
                                        },
                                    })];
                            case 5:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("invalid_grant");
                                return [4 /*yield*/, db.findOne({
                                        model: "deviceCode",
                                        where: [{ field: "deviceCode", value: deviceCode }],
                                    })];
                            case 6:
                                stored = _c.sent();
                                (0, vitest_1.expect)(stored === null || stored === void 0 ? void 0 : stored.deviceCode).toBe(deviceCode);
                                return [2 /*return*/];
                        }
                    });
                }); });
                (0, vitest_1.it)("still issues a first-party session token for a non-OAuth client at /device/token", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var firstPartyClientId, _a, standaloneAuth, standaloneClient, signInWithStandaloneUser, headers, _b, device_code, user_code, res;
                    var _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                firstPartyClientId = "first-party-cli";
                                return [4 /*yield*/, (0, test_1.getTestInstance)({ plugins: [(0, device_authorization_1.deviceAuthorization)()] }, { clientOptions: { plugins: [(0, plugins_1.deviceAuthorizationClient)()] } })];
                            case 1:
                                _a = _e.sent(), standaloneAuth = _a.auth, standaloneClient = _a.client, signInWithStandaloneUser = _a.signInWithTestUser;
                                return [4 /*yield*/, signInWithStandaloneUser()];
                            case 2:
                                headers = (_e.sent()).headers;
                                return [4 /*yield*/, standaloneAuth.api.deviceCode({
                                        body: { client_id: firstPartyClientId },
                                    })];
                            case 3:
                                _b = _e.sent(), device_code = _b.device_code, user_code = _b.user_code;
                                return [4 /*yield*/, standaloneAuth.api.deviceVerify({ query: { user_code: user_code }, headers: headers })];
                            case 4:
                                _e.sent();
                                return [4 /*yield*/, standaloneAuth.api.deviceApprove({
                                        body: { userCode: user_code },
                                        headers: headers,
                                    })];
                            case 5:
                                _e.sent();
                                return [4 /*yield*/, standaloneClient.$fetch("/device/token", {
                                        method: "POST",
                                        body: {
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: device_code,
                                            client_id: firstPartyClientId,
                                        },
                                    })];
                            case 6:
                                res = _e.sent();
                                (0, vitest_1.expect)(res.error).toBeNull();
                                (0, vitest_1.expect)((_c = res.data) === null || _c === void 0 ? void 0 : _c.access_token).toBeDefined();
                                (0, vitest_1.expect)((_d = res.data) === null || _d === void 0 ? void 0 : _d.token_type).toBe("Bearer");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth-provider device-code immutable routing", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseURL, firstPartyClientId, _a, auth, client, signInWithTestUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseURL = "http://localhost:3007";
                firstPartyClientId = "late-registered-oauth-client";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseURL,
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: baseURL } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                generateClientId: function () { return firstPartyClientId; },
                                scopes: ["openid"],
                            }),
                            (0, device_code_1.oauthDeviceAuthorization)({
                                validateClient: function (clientId) { return clientId === firstPartyClientId; },
                            }),
                        ],
                    })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                /**
                 * @see https://github.com/better-auth/better-auth/pull/10135
                 */
                (0, vitest_1.it)("keeps a standalone code in the session flow after its client id is registered", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, _a, device_code, user_code, registered, oauthExchange, sessionExchange;
                    var _b, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_e.sent()).headers;
                                return [4 /*yield*/, auth.api.deviceCode({
                                        body: { client_id: firstPartyClientId },
                                    })];
                            case 2:
                                _a = _e.sent(), device_code = _a.device_code, user_code = _a.user_code;
                                return [4 /*yield*/, auth.api.deviceVerify({ query: { user_code: user_code }, headers: headers })];
                            case 3:
                                _e.sent();
                                return [4 /*yield*/, auth.api.deviceApprove({ body: { userCode: user_code }, headers: headers })];
                            case 4:
                                _e.sent();
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "none",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "native",
                                        },
                                    })];
                            case 5:
                                registered = _e.sent();
                                (0, vitest_1.expect)(registered === null || registered === void 0 ? void 0 : registered.client_id).toBe(firstPartyClientId);
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: device_code,
                                            client_id: firstPartyClientId,
                                        }),
                                        headers: FORM_HEADERS,
                                    })];
                            case 6:
                                oauthExchange = _e.sent();
                                (0, vitest_1.expect)((_b = oauthExchange.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)((_c = oauthExchange.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_grant");
                                return [4 /*yield*/, client.$fetch("/device/token", {
                                        method: "POST",
                                        body: {
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: device_code,
                                            client_id: firstPartyClientId,
                                        },
                                    })];
                            case 7:
                                sessionExchange = _e.sent();
                                (0, vitest_1.expect)(sessionExchange.error).toBeNull();
                                (0, vitest_1.expect)((_d = sessionExchange.data) === null || _d === void 0 ? void 0 : _d.access_token).toBeDefined();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth-provider device-code grant expiry", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseURL, _a, auth, client, signInWithTestUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                baseURL = "http://localhost:3000";
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseURL,
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: baseURL } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                allowDynamicClientRegistration: true,
                                scopes: ["openid", "profile", "email"],
                            }),
                            (0, device_code_1.oauthDeviceAuthorization)({
                                expiresIn: "1s",
                                interval: "1s",
                            }),
                        ],
                    }, { clientOptions: { plugins: [(0, client_2.oauthProviderClient)()] } })];
            case 1:
                _a = _b.sent(), auth = _a.auth, client = _a.client, signInWithTestUser = _a.signInWithTestUser;
                (0, vitest_1.it)("returns expired_token once the device code has expired", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, created, clientId, device_code, res;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, signInWithTestUser()];
                            case 1:
                                headers = (_c.sent()).headers;
                                return [4 /*yield*/, auth.api.adminCreateOAuthClient({
                                        headers: headers,
                                        body: {
                                            token_endpoint_auth_method: "none",
                                            grant_types: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                            scope: "openid",
                                            application_type: "native",
                                        },
                                    })];
                            case 2:
                                created = _c.sent();
                                clientId = created.client_id;
                                return [4 /*yield*/, auth.api.deviceCode({
                                        body: { client_id: clientId, scope: "openid" },
                                    })];
                            case 3:
                                device_code = (_c.sent()).device_code;
                                // Let the 1s device code lapse, then poll.
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1200); })];
                            case 4:
                                // Let the 1s device code lapse, then poll.
                                _c.sent();
                                return [4 /*yield*/, client.$fetch("/oauth2/token", {
                                        method: "POST",
                                        body: new URLSearchParams({
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: device_code,
                                            client_id: clientId,
                                        }),
                                        headers: FORM_HEADERS,
                                    })];
                            case 5:
                                res = _c.sent();
                                (0, vitest_1.expect)((_a = res.error) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.error).toBe("expired_token");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)("oauth-provider device-code grant reuse", function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseURL, discoveredClientId, sharedOAuthDeviceAuthorization, first;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                baseURL = "http://localhost:3000";
                discoveredClientId = "discovered-device-client";
                sharedOAuthDeviceAuthorization = (0, device_code_1.oauthDeviceAuthorization)();
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: baseURL,
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: baseURL } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["openid"],
                                extensions: [
                                    {
                                        clientDiscovery: {
                                            id: "device-code-reuse-test",
                                            matches: function (clientId) { return clientId === discoveredClientId; },
                                            resolve: function (_ctx, clientId) { return ({
                                                clientId: clientId,
                                                tokenEndpointAuthMethod: "none",
                                                grantTypes: [device_code_1.DEVICE_CODE_GRANT_TYPE],
                                                scopes: ["openid"],
                                            }); },
                                        },
                                    },
                                ],
                            }),
                            sharedOAuthDeviceAuthorization,
                        ],
                    })];
            case 1:
                first = _a.sent();
                return [4 /*yield*/, (0, test_1.getTestInstance)({
                        baseURL: "http://localhost:3001",
                        plugins: [
                            (0, jwt_1.jwt)({ jwt: { issuer: "http://localhost:3001" } }),
                            (0, oauth_1.oauthProvider)({
                                loginPage: "/login",
                                consentPage: "/consent",
                                scopes: ["openid"],
                            }),
                            sharedOAuthDeviceAuthorization,
                        ],
                    })];
            case 2:
                _a.sent();
                (0, vitest_1.it)("keeps each auth instance bound to its own provider options", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var headers, _a, device_code, user_code, res;
                    var _b, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, first.signInWithTestUser()];
                            case 1:
                                headers = (_d.sent()).headers;
                                return [4 /*yield*/, first.auth.api.deviceCode({
                                        body: { client_id: discoveredClientId, scope: "openid" },
                                    })];
                            case 2:
                                _a = _d.sent(), device_code = _a.device_code, user_code = _a.user_code;
                                return [4 /*yield*/, first.auth.api.deviceVerify({ query: { user_code: user_code }, headers: headers })];
                            case 3:
                                _d.sent();
                                return [4 /*yield*/, first.auth.api.deviceApprove({
                                        body: { userCode: user_code },
                                        headers: headers,
                                    })];
                            case 4:
                                _d.sent();
                                return [4 /*yield*/, first.client.$fetch("/device/token", {
                                        method: "POST",
                                        body: {
                                            grant_type: device_code_1.DEVICE_CODE_GRANT_TYPE,
                                            device_code: device_code,
                                            client_id: discoveredClientId,
                                        },
                                    })];
                            case 5:
                                res = _d.sent();
                                (0, vitest_1.expect)((_b = res.error) === null || _b === void 0 ? void 0 : _b.status).toBe(400);
                                (0, vitest_1.expect)((_c = res.error) === null || _c === void 0 ? void 0 : _c.error).toBe("invalid_grant");
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
