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
exports.consentEndpoint = consentEndpoint;
var api_1 = require("better-auth/api");
var authorize_1 = require("./authorize");
var claims_request_1 = require("./claims-request");
var oauth_1 = require("./oauth");
var standard_claims_1 = require("./standard-claims");
var utils_1 = require("./utils");
function consentEndpoint(ctx, opts, authorize) {
    return __awaiter(this, void 0, void 0, function () {
        var oauthRequest, _query, query, originalRequestedScopes, supportedClaims, originalRequestedUserInfoClaims, clientId, requestedScopes, acceptedClaims, acceptedUserInfoClaims, accepted, redirectUri, session, promptSet, hasLoginPrompt, hasSatisfiedLoginPrompt, referenceId, foundConsent, iat, resource, consent, _a, claimsRequest, authorizationQuery, postLoginClearedForThisSession;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, oauth_1.oAuthState.get()];
                case 1:
                    oauthRequest = _k.sent();
                    _query = oauthRequest === null || oauthRequest === void 0 ? void 0 : oauthRequest.query;
                    if (!_query) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "missing oauth query",
                            error: "invalid_request",
                        });
                    }
                    query = new URLSearchParams(_query);
                    originalRequestedScopes = (_c = (_b = query.get("scope")) === null || _b === void 0 ? void 0 : _b.split(" ")) !== null && _c !== void 0 ? _c : [];
                    supportedClaims = (0, standard_claims_1.getSupportedClaims)(opts);
                    originalRequestedUserInfoClaims = (0, claims_request_1.getRequestedUserInfoClaims)(query.get("claims"), supportedClaims);
                    clientId = query.get("client_id");
                    if (!clientId) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "client_id is required",
                            error: "invalid_client",
                        });
                    }
                    requestedScopes = (_d = ctx.body.scope) === null || _d === void 0 ? void 0 : _d.split(" ");
                    if (requestedScopes) {
                        if (!requestedScopes.every(function (sc) { return originalRequestedScopes === null || originalRequestedScopes === void 0 ? void 0 : originalRequestedScopes.includes(sc); })) {
                            throw new api_1.APIError("BAD_REQUEST", {
                                error_description: "Scope not originally requested",
                                error: "invalid_request",
                            });
                        }
                    }
                    acceptedClaims = ctx.body.claims;
                    acceptedUserInfoClaims = acceptedClaims !== undefined
                        ? (0, claims_request_1.getRequestedUserInfoClaims)(acceptedClaims, supportedClaims)
                        : originalRequestedUserInfoClaims;
                    if (acceptedClaims !== undefined &&
                        !acceptedUserInfoClaims.every(function (claim) {
                            return originalRequestedUserInfoClaims.includes(claim);
                        })) {
                        throw new api_1.APIError("BAD_REQUEST", {
                            error_description: "Claim not originally requested",
                            error: "invalid_request",
                        });
                    }
                    accepted = ctx.body.accept === true;
                    if (!!accepted) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, authorize_1.resolveTrustedRedirectUri)(ctx, opts, clientId, (_e = query.get("redirect_uri")) !== null && _e !== void 0 ? _e : undefined)];
                case 2:
                    redirectUri = _k.sent();
                    return [2 /*return*/, {
                            redirect: true,
                            url: redirectUri
                                ? (0, authorize_1.formatErrorURL)(redirectUri, "access_denied", "User denied access", (_f = query.get("state")) !== null && _f !== void 0 ? _f : undefined, (0, authorize_1.getIssuer)(ctx, opts))
                                : (0, authorize_1.getErrorURL)(ctx, "access_denied", "User denied access"),
                        }];
                case 3: return [4 /*yield*/, (0, api_1.getSessionFromCtx)(ctx)];
                case 4:
                    session = _k.sent();
                    promptSet = (0, utils_1.parsePrompt)((_g = query.get("prompt")) !== null && _g !== void 0 ? _g : "");
                    hasLoginPrompt = promptSet.has("login");
                    hasSatisfiedLoginPrompt = hasLoginPrompt &&
                        (0, utils_1.isSessionFreshForSignedQuery)(session === null || session === void 0 ? void 0 : session.session.createdAt, oauthRequest === null || oauthRequest === void 0 ? void 0 : oauthRequest.signedQueryIssuedAt);
                    if (!(hasLoginPrompt && !hasSatisfiedLoginPrompt)) return [3 /*break*/, 6];
                    (_h = ctx === null || ctx === void 0 ? void 0 : ctx.headers) === null || _h === void 0 ? void 0 : _h.set("accept", "application/json");
                    ctx.query = (0, utils_1.searchParamsToQuery)(query);
                    return [4 /*yield*/, authorize(ctx)];
                case 5: return [2 /*return*/, _k.sent()];
                case 6: return [4 /*yield*/, (0, utils_1.getConsentReferenceId)(opts, {
                        user: session === null || session === void 0 ? void 0 : session.user,
                        session: session === null || session === void 0 ? void 0 : session.session,
                        scopes: requestedScopes !== null && requestedScopes !== void 0 ? requestedScopes : originalRequestedScopes,
                    })];
                case 7:
                    referenceId = _k.sent();
                    return [4 /*yield*/, (0, utils_1.findConsent)(ctx, clientId, session === null || session === void 0 ? void 0 : session.user.id, referenceId)];
                case 8:
                    foundConsent = _k.sent();
                    iat = Math.floor(Date.now() / 1000);
                    resource = query.getAll("resource");
                    consent = {
                        clientId: clientId,
                        userId: session === null || session === void 0 ? void 0 : session.user.id,
                        scopes: requestedScopes !== null && requestedScopes !== void 0 ? requestedScopes : originalRequestedScopes,
                        requestedUserInfoClaims: acceptedUserInfoClaims,
                        createdAt: new Date(iat * 1000),
                        updatedAt: new Date(iat * 1000),
                        resources: resource.length ? resource : undefined,
                        referenceId: referenceId,
                    };
                    if (!(foundConsent === null || foundConsent === void 0 ? void 0 : foundConsent.id)) return [3 /*break*/, 10];
                    return [4 /*yield*/, ctx.context.adapter.update({
                            model: "oauthConsent",
                            where: [
                                {
                                    field: "id",
                                    value: foundConsent.id,
                                },
                            ],
                            update: {
                                resources: consent.resources,
                                scopes: consent.scopes,
                                requestedUserInfoClaims: consent.requestedUserInfoClaims,
                                updatedAt: new Date(iat * 1000),
                            },
                        })];
                case 9:
                    _a = _k.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, ctx.context.adapter.create({
                        model: "oauthConsent",
                        data: __assign(__assign({}, consent), { scopes: consent.scopes }),
                    })];
                case 11:
                    _a = _k.sent();
                    _k.label = 12;
                case 12:
                    _a;
                    // Return authorization code
                    if (requestedScopes) {
                        query.set("scope", consent.scopes.join(" "));
                    }
                    if (acceptedClaims !== undefined) {
                        claimsRequest = (0, claims_request_1.filterClaimsRequestUserInfoClaims)(query.get("claims"), acceptedUserInfoClaims);
                        if (claimsRequest) {
                            query.set("claims", JSON.stringify(claimsRequest));
                        }
                        else {
                            query.delete("claims");
                        }
                    }
                    (_j = ctx === null || ctx === void 0 ? void 0 : ctx.headers) === null || _j === void 0 ? void 0 : _j.set("accept", "application/json");
                    authorizationQuery = (0, utils_1.removePromptFromQuery)(query, "consent");
                    if (hasSatisfiedLoginPrompt) {
                        authorizationQuery = (0, utils_1.removePromptFromQuery)(authorizationQuery, "login");
                        authorizationQuery = (0, utils_1.removeMaxAgeFromQuery)(authorizationQuery);
                    }
                    ctx.query = (0, utils_1.searchParamsToQuery)(authorizationQuery);
                    postLoginClearedForThisSession = (oauthRequest === null || oauthRequest === void 0 ? void 0 : oauthRequest.postLoginClearedForSession) !== undefined &&
                        oauthRequest.postLoginClearedForSession === (session === null || session === void 0 ? void 0 : session.session.id);
                    return [4 /*yield*/, authorize(ctx, {
                            postLogin: postLoginClearedForThisSession,
                        })];
                case 13: return [2 /*return*/, _k.sent()];
            }
        });
    });
}
