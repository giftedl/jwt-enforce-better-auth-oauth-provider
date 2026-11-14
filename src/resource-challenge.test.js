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
var oauth2_1 = require("better-auth/oauth2");
var better_call_1 = require("better-call");
var vitest_1 = require("vitest");
var resource_challenge_1 = require("./resource-challenge");
function catchChallenge(resource) {
    return (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", { message: "missing bearer token" }), resource);
}
(0, vitest_1.describe)("resource server challenge", function () {
    /**
     * `WWW-Authenticate` is not a CORS-safelisted response header, so a
     * cross-origin client can read the challenge only when it is exposed.
     * @see https://fetch.spec.whatwg.org/#cors-safelisted-response-header-name
     */
    vitest_1.it.each([
        [
            "Bearer",
            new better_call_1.APIError("UNAUTHORIZED", { message: "missing bearer token" }),
        ],
        ["insufficient_scope", (0, oauth2_1.createInsufficientScopeError)(["files:write"])],
        [
            "DPoP",
            new better_call_1.APIError("UNAUTHORIZED", {
                message: "invalid DPoP proof",
                error: "invalid_dpop_proof",
            }),
        ],
    ])("exposes WWW-Authenticate on a %s challenge", function (_, error) {
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)(error, "https://api.example.com");
        var headers = new Headers(challenge.headers);
        (0, vitest_1.expect)(headers.get("WWW-Authenticate")).toBeTruthy();
        (0, vitest_1.expect)(headers.get("Access-Control-Expose-Headers")).toBe("WWW-Authenticate");
    });
    (0, vitest_1.it)("derives the RFC 9728 metadata URL from the protected resource", function () {
        var error = catchChallenge("https://api.example.com/mcp/tools?tenant=a");
        var headers = new Headers(error.headers);
        (0, vitest_1.expect)(error.status).toBe("UNAUTHORIZED");
        (0, vitest_1.expect)(headers === null || headers === void 0 ? void 0 : headers.get("WWW-Authenticate")).toBe('Bearer resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/mcp/tools?tenant=a"');
    });
    (0, vitest_1.it)("emits one resource_metadata challenge per protected resource", function () {
        var error = catchChallenge([
            "https://api.example.com/calendar/",
            "https://files.example.com",
        ]);
        var headers = new Headers(error.headers);
        (0, vitest_1.expect)(headers === null || headers === void 0 ? void 0 : headers.get("WWW-Authenticate")).toBe('Bearer resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/calendar", Bearer resource_metadata="https://files.example.com/.well-known/oauth-protected-resource"');
    });
    (0, vitest_1.it)("answers insufficient scope with an RFC 6750 403 challenge", function () {
        var apiError = (0, resource_challenge_1.createResourceServerChallenge)((0, oauth2_1.createInsufficientScopeError)(["files:write", "files:delete"]), "https://api.example.com/mcp/tools");
        var headers = new Headers(apiError.headers);
        (0, vitest_1.expect)(apiError.status).toBe("FORBIDDEN");
        (0, vitest_1.expect)(apiError.statusCode).toBe(403);
        (0, vitest_1.expect)(headers.get("WWW-Authenticate")).toBe('Bearer error="insufficient_scope", scope="files:write files:delete", resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/mcp/tools", error_description="access token is missing required scope: files:write files:delete"');
    });
    (0, vitest_1.it)("challenges for the scopes the token lacks, not the configured hint", function () {
        // The hint tells an unauthenticated client where to start; re-authorizing
        // only helps if the challenge names what is actually missing.
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)((0, oauth2_1.createInsufficientScopeError)(["files:write"]), "https://api.example.com", { challengeScopes: ["files:read"] });
        var headers = new Headers(challenge.headers);
        (0, vitest_1.expect)(headers.get("WWW-Authenticate")).toContain('scope="files:write"');
    });
    (0, vitest_1.it)("propagates a forbidden error that is not a scope failure", function () {
        // A permission denial re-authorizing cannot fix must stay a plain 403;
        // challenging would send the user through consent to no effect.
        var denial = new better_call_1.APIError("FORBIDDEN", {
            message: "user is not a member of this organization",
        });
        (0, vitest_1.expect)((0, resource_challenge_1.createResourceServerChallenge)(denial, "https://api.example.com")).toBeUndefined();
        (0, vitest_1.expect)(new Headers(denial.headers).get("WWW-Authenticate")).toBeNull();
    });
    (0, vitest_1.it)("resolves a mapped resource_metadata URL in a 403 challenge", function () {
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)((0, oauth2_1.createInsufficientScopeError)(["mcp:tools"]), "urn:example:mcp", {
            resourceMetadataMappings: {
                "urn:example:mcp": "https://api.example.com/.well-known/oauth-protected-resource",
            },
        });
        var headers = new Headers(challenge.headers);
        (0, vitest_1.expect)(challenge.statusCode).toBe(403);
        (0, vitest_1.expect)(headers.get("WWW-Authenticate")).toBe('Bearer error="insufficient_scope", scope="mcp:tools", resource_metadata="https://api.example.com/.well-known/oauth-protected-resource", error_description="access token is missing required scope: mcp:tools"');
    });
    (0, vitest_1.it)("cleans header-injection characters out of an insufficient-scope description", function () {
        var insufficientScopeError = (0, oauth2_1.createInsufficientScopeError)([
            "files:write",
        ]);
        insufficientScopeError.body.error_description = 'bad "scope"\r\nSet-Cookie: x=y';
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)(insufficientScopeError, "https://api.example.com");
        var header = new Headers(challenge.headers).get("WWW-Authenticate");
        (0, vitest_1.expect)(challenge.statusCode).toBe(403);
        (0, vitest_1.expect)(header).toBe("Bearer error=\"insufficient_scope\", scope=\"files:write\", resource_metadata=\"https://api.example.com/.well-known/oauth-protected-resource\", error_description=\"bad 'scope' Set-Cookie: x=y\"");
        (0, vitest_1.expect)(challenge.body).toMatchObject({
            error: "insufficient_scope",
            error_description: 'bad "scope"\r\nSet-Cookie: x=y',
        });
    });
    vitest_1.it.each([42, null, "\u00e9\u00e8"])("omits an insufficient-scope error_description with nothing left to send: %j", function (description) {
        var insufficientScopeError = (0, oauth2_1.createInsufficientScopeError)([
            "files:write",
        ]);
        if (!insufficientScopeError.body) {
            throw new Error("insufficient-scope error body was not created");
        }
        Reflect.set(insufficientScopeError.body, "error_description", description);
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)(insufficientScopeError, "https://api.example.com");
        (0, vitest_1.expect)(challenge.statusCode).toBe(403);
        (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('Bearer error="insufficient_scope", scope="files:write", resource_metadata="https://api.example.com/.well-known/oauth-protected-resource"');
    });
    (0, vitest_1.it)("rejects invalid configured challenge scope tokens", function () {
        (0, vitest_1.expect)(function () {
            return (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", { message: "missing bearer token" }), "https://api.example.com", { challengeScopes: ["files:read injected"] });
        }).toThrow("invalid challenge scope");
    });
    (0, vitest_1.it)("emits RFC 9449 DPoP challenges for invalid DPoP proofs", function () {
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", {
            message: "DPoP proof header is required",
            error: "invalid_dpop_proof",
            error_description: "DPoP proof header is required",
        }), "https://api.example.com/mcp/tools", { dpopSigningAlgorithms: ["ES256"] });
        var headers = new Headers(challenge.headers);
        (0, vitest_1.expect)(headers.get("WWW-Authenticate")).toBe('DPoP error="invalid_dpop_proof", error_description="DPoP proof header is required", algs="ES256"');
    });
    (0, vitest_1.it)("keeps a DPoP challenge when the description contains quotes", function () {
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", {
            message: 'DPoP proof typ must be "dpop+jwt"',
            error: "invalid_dpop_proof",
            error_description: 'DPoP proof typ must be "dpop+jwt"',
        }), "https://api.example.com", { dpopSigningAlgorithms: ["ES256"] });
        (0, vitest_1.expect)(challenge.statusCode).toBe(401);
        (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe("DPoP error=\"invalid_dpop_proof\", error_description=\"DPoP proof typ must be 'dpop+jwt'\", algs=\"ES256\"");
        (0, vitest_1.expect)(challenge.body).toMatchObject({
            error: "invalid_dpop_proof",
            error_description: 'DPoP proof typ must be "dpop+jwt"',
        });
    });
    vitest_1.it.each([
        ["bad\\slash", "bad slash"],
        ["caf\u00e9 au lait", "caf au lait"],
        ["bad\r\ninjected", "bad injected"],
        ["  tab\tand\u007fdel  ", "tab and del"],
    ])("cleans the DPoP error_description %j to %j", function (description, cleaned) {
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", {
            message: description,
            error: "invalid_dpop_proof",
            error_description: description,
        }), "https://api.example.com", { dpopSigningAlgorithms: ["ES256"] });
        (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe("DPoP error=\"invalid_dpop_proof\", error_description=\"".concat(cleaned, "\", algs=\"ES256\""));
    });
    (0, vitest_1.it)("omits a DPoP error_description that is empty after cleaning", function () {
        var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", {
            message: "\r\n",
            error: "invalid_dpop_proof",
            error_description: "\r\n",
        }), "https://api.example.com", { dpopSigningAlgorithms: ["ES256"] });
        (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('DPoP error="invalid_dpop_proof", algs="ES256"');
    });
    /**
     * @see https://datatracker.ietf.org/doc/html/rfc9449#section-7.2
     */
    (0, vitest_1.describe)("challenge scheme follows the presented authorization scheme", function () {
        var expiredToken = function () {
            return new better_call_1.APIError("UNAUTHORIZED", {
                message: "token expired",
                error: "invalid_token",
                error_description: "token expired",
            });
        };
        vitest_1.it.each([
            [
                "a Request",
                new Request("https://api.example.com", {
                    headers: { Authorization: "DPoP access-token" },
                }),
            ],
            [
                "a resource request input",
                { authorizationHeader: "dpop access-token" },
            ],
        ])("answers a failed DPoP request with a DPoP challenge from %s", function (_, request) {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)(expiredToken(), "https://api.example.com", { request: request, dpopSigningAlgorithms: ["ES256"] });
            (0, vitest_1.expect)(challenge.statusCode).toBe(401);
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('DPoP error="invalid_token", error_description="token expired", algs="ES256"');
        });
        (0, vitest_1.it)("defaults the DPoP error code to invalid_token", function () {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", { message: "invalid access token" }), "https://api.example.com", {
                request: { authorizationHeader: "DPoP access-token" },
                dpopSigningAlgorithms: ["ES256"],
            });
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('DPoP error="invalid_token", error_description="invalid access token", algs="ES256"');
        });
        (0, vitest_1.it)("omits the error_description of an empty message", function () {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED"), "https://api.example.com", {
                request: { authorizationHeader: "DPoP access-token" },
                dpopSigningAlgorithms: ["ES256"],
            });
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('DPoP error="invalid_token", algs="ES256"');
            (0, vitest_1.expect)(challenge.body).toMatchObject({ error: "invalid_token" });
        });
        (0, vitest_1.it)("answers a DPoP request's insufficient scope with a DPoP challenge", function () {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)((0, oauth2_1.createInsufficientScopeError)(["files:write"]), "https://api.example.com", {
                request: { authorizationHeader: "DPoP access-token" },
                dpopSigningAlgorithms: ["ES256"],
                challengeScopes: ["files:read"],
            });
            (0, vitest_1.expect)(challenge.statusCode).toBe(403);
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('DPoP error="insufficient_scope", scope="files:write", error_description="access token is missing required scope: files:write", algs="ES256"');
            (0, vitest_1.expect)(challenge.body).toMatchObject({ error: "insufficient_scope" });
        });
        (0, vitest_1.it)("keeps the Bearer insufficient-scope challenge for a Bearer request", function () {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)((0, oauth2_1.createInsufficientScopeError)(["files:write"]), "https://api.example.com", { request: { authorizationHeader: "Bearer access-token" } });
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toMatch(/^Bearer error="insufficient_scope", scope="files:write", resource_metadata=/);
        });
        vitest_1.it.each([
            ["a Bearer request", "Bearer access-token"],
            ["a request without credentials", null],
            ["an unknown scheme", "Basic dXNlcjpwYXNz"],
        ])("keeps the Bearer challenge for %s", function (_, authorizationHeader) {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)(expiredToken(), "https://api.example.com", { request: { authorizationHeader: authorizationHeader } });
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('Bearer error="invalid_token", error_description="token expired", resource_metadata="https://api.example.com/.well-known/oauth-protected-resource"');
        });
    });
    /**
     * @see https://datatracker.ietf.org/doc/html/rfc6750#section-3.1
     */
    (0, vitest_1.describe)("presented-token failures", function () {
        (0, vitest_1.it)("reports invalid_token with its description and keeps the error in the body", function () {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", {
                message: "token expired",
                error: "invalid_token",
                error_description: "token expired",
            }), "https://api.example.com/mcp", { challengeScopes: ["mcp:read"] });
            (0, vitest_1.expect)(challenge.statusCode).toBe(401);
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('Bearer error="invalid_token", error_description="token expired", resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/mcp", scope="mcp:read"');
            (0, vitest_1.expect)(challenge.body).toMatchObject({
                message: "token expired",
                error: "invalid_token",
                error_description: "token expired",
            });
        });
        (0, vitest_1.it)("falls back to the message when the error has no description", function () {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", {
                message: "invalid access token",
                error: "invalid_token",
            }), "https://api.example.com");
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('Bearer error="invalid_token", error_description="invalid access token", resource_metadata="https://api.example.com/.well-known/oauth-protected-resource"');
        });
        (0, vitest_1.it)("leaves the error code out when no token was presented", function () {
            var challenge = catchChallenge("https://api.example.com");
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('Bearer resource_metadata="https://api.example.com/.well-known/oauth-protected-resource"');
            (0, vitest_1.expect)(challenge.body).not.toHaveProperty("error");
            (0, vitest_1.expect)(challenge.body).not.toHaveProperty("error_description");
        });
    });
    /**
     * @see https://github.com/better-auth/better-auth/issues/10857
     * @see https://datatracker.ietf.org/doc/html/rfc6750#section-3.1
     */
    (0, vitest_1.describe)("unsupported authorization schemes", function () {
        var resource = "https://api.example.com/mcp";
        function rejectAuthorization(authorizationHeader) {
            var request = new Request(resource, {
                method: "POST",
                headers: { Authorization: authorizationHeader },
            });
            return (0, oauth2_1.verifyAccessTokenRequest)((0, oauth2_1.requestToResourceInput)(request), {
                jwksUrl: "https://auth.example.com/jwks",
                verifyOptions: {
                    issuer: "https://auth.example.com",
                    audience: resource,
                },
            }).then(function () { return vitest_1.expect.fail("expected the request to be rejected"); }, function (error) { return ({ error: error, request: request }); });
        }
        vitest_1.it.each([
            ["no Authorization header", null],
            ["an unsupported scheme", "Basic dXNlcjpwYXNz"],
        ])("never answers a request with %s with a DPoP challenge", function (_, authorizationHeader) {
            var challenge = (0, resource_challenge_1.createResourceServerChallenge)(new better_call_1.APIError("UNAUTHORIZED", {
                message: "DPoP proof header is required",
                error: "invalid_dpop_proof",
            }), resource, { request: { authorizationHeader: authorizationHeader } });
            (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toMatch(/^Bearer /);
        });
        vitest_1.it.each([
            ["an unsupported scheme", "Basic dXNlcjpwYXNz"],
            ["a header with no scheme", "access-token"],
        ])("answers %s with a Bearer challenge", function (_, authorizationHeader) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, error, request, challenge;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, rejectAuthorization(authorizationHeader)];
                    case 1:
                        _a = _b.sent(), error = _a.error, request = _a.request;
                        challenge = (0, resource_challenge_1.createResourceServerChallenge)(error, resource, {
                            request: request,
                        });
                        (0, vitest_1.expect)(challenge.statusCode).toBe(401);
                        (0, vitest_1.expect)(new Headers(challenge.headers).get("WWW-Authenticate")).toBe('Bearer error="invalid_token", error_description="authorization scheme must be Bearer or DPoP", resource_metadata="https://api.example.com/.well-known/oauth-protected-resource/mcp"');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
