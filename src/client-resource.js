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
exports.oauthProviderResourceClient = void 0;
var error_1 = require("@better-auth/core/error");
var oauth2_1 = require("better-auth/oauth2");
var better_call_1 = require("better-call");
var resource_challenge_1 = require("./resource-challenge");
var utils_1 = require("./utils");
var version_1 = require("./version");
var oauthProviderResourceClient = function (auth) {
    var oauthProviderPlugin;
    var getOauthProviderPlugin = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!!oauthProviderPlugin) return [3 /*break*/, 4];
                    if (!auth) return [3 /*break*/, 2];
                    _b = utils_1.getOAuthProviderPlugin;
                    return [4 /*yield*/, auth.$context];
                case 1:
                    _a = _b.apply(void 0, [(_c.sent())]);
                    return [3 /*break*/, 3];
                case 2:
                    _a = undefined;
                    _c.label = 3;
                case 3:
                    oauthProviderPlugin = _a;
                    _c.label = 4;
                case 4: return [2 /*return*/, oauthProviderPlugin];
            }
        });
    }); };
    var jwtPlugin;
    var getJwtPluginOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!!jwtPlugin) return [3 /*break*/, 6];
                    _b = auth;
                    if (!_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, getOauthProviderPlugin()];
                case 1:
                    _b = !((_e = (_d = (_f.sent())) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.disableJwtPlugin);
                    _f.label = 2;
                case 2:
                    if (!_b) return [3 /*break*/, 4];
                    _c = utils_1.getJwtPlugin;
                    return [4 /*yield*/, auth.$context];
                case 3:
                    _a = _c.apply(void 0, [(_f.sent())]);
                    return [3 /*break*/, 5];
                case 4:
                    _a = undefined;
                    _f.label = 5;
                case 5:
                    jwtPlugin = _a;
                    _f.label = 6;
                case 6: return [2 /*return*/, jwtPlugin === null || jwtPlugin === void 0 ? void 0 : jwtPlugin.options];
            }
        });
    }); };
    // The resolved base URL includes `basePath`, matching the `iss` the provider signs.
    // Empty for a dynamic `baseURL`, which only resolves per request.
    var getAuthServerBaseUrl = function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = auth;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, auth.$context];
            case 1:
                _a = (_b.sent()).baseURL;
                _b.label = 2;
            case 2: return [2 /*return*/, (_a) || undefined];
        }
    }); }); };
    var getAuthorizationServer = function () { return __awaiter(void 0, void 0, void 0, function () {
        var jwtPluginOptions, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, getJwtPluginOptions()];
                case 1:
                    jwtPluginOptions = _d.sent();
                    if (!((_c = (_b = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _b === void 0 ? void 0 : _b.issuer) !== null && _c !== void 0)) return [3 /*break*/, 2];
                    _a = _c;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getAuthServerBaseUrl()];
                case 3:
                    _a = (_d.sent());
                    _d.label = 4;
                case 4: return [2 /*return*/, _a];
            }
        });
    }); };
    var resolveVerifyAccessTokenOptions = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
        var jwtPluginOptions, authServerBaseUrl, audience, issuer, jwksUrl, introspectUrl;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, getJwtPluginOptions()];
                case 1:
                    jwtPluginOptions = _p.sent();
                    return [4 /*yield*/, getAuthServerBaseUrl()];
                case 2:
                    authServerBaseUrl = _p.sent();
                    audience = (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.verifyOptions) === null || _a === void 0 ? void 0 : _a.audience) !== null && _b !== void 0 ? _b : authServerBaseUrl;
                    issuer = (_f = (_d = (_c = opts === null || opts === void 0 ? void 0 : opts.verifyOptions) === null || _c === void 0 ? void 0 : _c.issuer) !== null && _d !== void 0 ? _d : (_e = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwt) === null || _e === void 0 ? void 0 : _e.issuer) !== null && _f !== void 0 ? _f : authServerBaseUrl;
                    if (!audience) {
                        throw Error("please define opts.verifyOptions.audience");
                    }
                    if (!issuer) {
                        throw Error("please define opts.verifyOptions.issuer");
                    }
                    jwksUrl = (_j = (_g = opts === null || opts === void 0 ? void 0 : opts.jwksUrl) !== null && _g !== void 0 ? _g : (_h = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _h === void 0 ? void 0 : _h.remoteUrl) !== null && _j !== void 0 ? _j : (authServerBaseUrl
                        ? "".concat(authServerBaseUrl).concat((_l = (_k = jwtPluginOptions === null || jwtPluginOptions === void 0 ? void 0 : jwtPluginOptions.jwks) === null || _k === void 0 ? void 0 : _k.jwksPath) !== null && _l !== void 0 ? _l : "/jwks")
                        : undefined);
                    introspectUrl = (_o = (_m = opts === null || opts === void 0 ? void 0 : opts.remoteVerify) === null || _m === void 0 ? void 0 : _m.introspectUrl) !== null && _o !== void 0 ? _o : (authServerBaseUrl
                        ? "".concat(authServerBaseUrl, "/oauth2/introspect")
                        : undefined);
                    return [2 /*return*/, __assign(__assign({}, opts), { jwksUrl: jwksUrl, verifyOptions: __assign(__assign({}, opts === null || opts === void 0 ? void 0 : opts.verifyOptions), { audience: audience, issuer: issuer }), remoteVerify: (opts === null || opts === void 0 ? void 0 : opts.remoteVerify) && introspectUrl
                                ? __assign(__assign({}, opts.remoteVerify), { introspectUrl: introspectUrl }) : undefined })];
            }
        });
    }); };
    var toResourceRequestInput = function (request) {
        var _a;
        // Duck-type the `Request` by its header accessor instead of `instanceof`,
        // so a cross-realm `Request` (mismatched global vs `undici`, Workers) is
        // still recognized rather than mistaken for a plain input.
        return typeof ((_a = request.headers) === null || _a === void 0 ? void 0 : _a.get) === "function"
            ? (0, oauth2_1.requestToResourceInput)(request)
            : request;
    };
    return {
        id: "oauth-provider-resource-client",
        version: version_1.PACKAGE_VERSION,
        getActions: function () {
            var _this = this;
            return {
                /**
                 * Performs verification of an access token for your APIs. Can perform
                 * local verification using `jwksUrl` by default. Can also be configured
                 * for remote introspection using `remoteVerify` if a confidential client
                 * is set up for this API.
                 *
                 * The optional auth parameter can fill known values automatically.
                 */
                verifyBearerToken: (function (token, opts) { return __awaiter(_this, void 0, void 0, function () {
                    var verifyOptions, error_2, challenge;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, resolveVerifyAccessTokenOptions(opts)];
                            case 1:
                                verifyOptions = _a.sent();
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                if (!(token === null || token === void 0 ? void 0 : token.length)) {
                                    throw new better_call_1.APIError("UNAUTHORIZED", {
                                        message: "missing authorization header",
                                    });
                                }
                                return [4 /*yield*/, (0, oauth2_1.verifyBearerToken)(token, verifyOptions)];
                            case 3: return [2 /*return*/, _a.sent()];
                            case 4:
                                error_2 = _a.sent();
                                challenge = (0, resource_challenge_1.createResourceServerChallenge)(error_2, verifyOptions.verifyOptions.audience, {
                                    resourceMetadataMappings: opts === null || opts === void 0 ? void 0 : opts.resourceMetadataMappings,
                                    dpopSigningAlgorithms: oauth2_1.DPOP_SIGNING_ALGORITHMS,
                                });
                                if (challenge)
                                    throw challenge;
                                throw error_2;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }),
                /**
                 * Performs verification of a protected-resource request. Use this for
                 * new resource-server integrations so sender-constrained DPoP access
                 * tokens are enforced with the request method, URL, Authorization
                 * scheme, DPoP proof, `ath`, and `cnf.jkt` binding.
                 */
                verifyAccessTokenRequest: (function (request, opts) { return __awaiter(_this, void 0, void 0, function () {
                    var verifyOptions, error_3, challenge;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, resolveVerifyAccessTokenOptions(opts)];
                            case 1:
                                verifyOptions = _c.sent();
                                _c.label = 2;
                            case 2:
                                _c.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, (0, oauth2_1.verifyAccessTokenRequest)(toResourceRequestInput(request), verifyOptions)];
                            case 3: return [2 /*return*/, _c.sent()];
                            case 4:
                                error_3 = _c.sent();
                                challenge = (0, resource_challenge_1.createResourceServerChallenge)(error_3, verifyOptions.verifyOptions.audience, {
                                    resourceMetadataMappings: opts === null || opts === void 0 ? void 0 : opts.resourceMetadataMappings,
                                    request: request,
                                    dpopSigningAlgorithms: (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.dpop) === null || _a === void 0 ? void 0 : _a.signingAlgorithms) !== null && _b !== void 0 ? _b : oauth2_1.DPOP_SIGNING_ALGORITHMS,
                                });
                                if (challenge)
                                    throw challenge;
                                throw error_3;
                            case 5: return [2 /*return*/];
                        }
                    });
                }); }),
                /**
                 * An authorization server does not typically publish
                 * the `/.well-known/oauth-protected-resource` themselves.
                 * Thus, we provide a client-only endpoint to help set up
                 * your protected resource metadata.
                 *
                 * The optional auth parameter can fill known values automatically.
                 *
                 * @see https://datatracker.ietf.org/doc/html/rfc8414#section-2
                 */
                getProtectedResourceMetadata: (function (overrides, opts) { return __awaiter(_this, void 0, void 0, function () {
                    var resource, _a, oauthProviderOptions, allValidScopes, _i, _b, sc, authorizationServer;
                    var _c, _d, _e, _f, _g, _h, _j, _k;
                    return __generator(this, function (_l) {
                        switch (_l.label) {
                            case 0:
                                if (!((_c = overrides === null || overrides === void 0 ? void 0 : overrides.resource) !== null && _c !== void 0)) return [3 /*break*/, 1];
                                _a = _c;
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, getAuthServerBaseUrl()];
                            case 2:
                                _a = (_l.sent());
                                _l.label = 3;
                            case 3:
                                resource = _a;
                                return [4 /*yield*/, getOauthProviderPlugin()];
                            case 4:
                                oauthProviderOptions = (_d = (_l.sent())) === null || _d === void 0 ? void 0 : _d.options;
                                if (!resource) {
                                    throw Error("missing required resource");
                                }
                                if ((oauthProviderOptions === null || oauthProviderOptions === void 0 ? void 0 : oauthProviderOptions.scopes) &&
                                    (opts === null || opts === void 0 ? void 0 : opts.externalScopes) &&
                                    ((_f = (_e = overrides === null || overrides === void 0 ? void 0 : overrides.authorization_servers) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) <= 1) {
                                    throw new error_1.BetterAuthError("external scopes should not be provided with one authorization server");
                                }
                                // Resource server should not mention specific scopes
                                if (overrides === null || overrides === void 0 ? void 0 : overrides.scopes_supported) {
                                    allValidScopes = new Set(__spreadArray(__spreadArray([], ((_g = oauthProviderOptions === null || oauthProviderOptions === void 0 ? void 0 : oauthProviderOptions.scopes) !== null && _g !== void 0 ? _g : []), true), ((_h = opts === null || opts === void 0 ? void 0 : opts.externalScopes) !== null && _h !== void 0 ? _h : []), true));
                                    for (_i = 0, _b = overrides.scopes_supported; _i < _b.length; _i++) {
                                        sc = _b[_i];
                                        if (sc === "openid") {
                                            throw new error_1.BetterAuthError("Only the Auth Server should utilize the openid scope");
                                        }
                                        if (!allValidScopes.has(sc)) {
                                            throw new error_1.BetterAuthError("Unsupported scope ".concat(sc, ". If external, please add to \"externalScopes\""));
                                        }
                                    }
                                }
                                return [4 /*yield*/, getAuthorizationServer()];
                            case 5:
                                authorizationServer = _l.sent();
                                return [2 /*return*/, __assign({ resource: resource, authorization_servers: authorizationServer
                                            ? [authorizationServer]
                                            : undefined, dpop_signing_alg_values_supported: __spreadArray([], ((_k = (_j = oauthProviderOptions === null || oauthProviderOptions === void 0 ? void 0 : oauthProviderOptions.dpop) === null || _j === void 0 ? void 0 : _j.signingAlgorithms) !== null && _k !== void 0 ? _k : oauth2_1.DPOP_SIGNING_ALGORITHMS), true) }, overrides)];
                        }
                    });
                }); }),
            };
        },
    };
};
exports.oauthProviderResourceClient = oauthProviderResourceClient;
