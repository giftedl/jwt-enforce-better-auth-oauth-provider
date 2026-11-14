"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDpopProofJwt = getDpopProofJwt;
exports.getEndpointUrl = getEndpointUrl;
exports.withExposedHeaders = withExposedHeaders;
function getDpopProofJwt(ctx) {
    var _a, _b;
    return (_b = (_a = ctx.headers) === null || _a === void 0 ? void 0 : _a.get("dpop")) !== null && _b !== void 0 ? _b : undefined;
}
/**
 * The endpoint's public URL, which clients use as the DPoP `htu`: the origin
 * and base path of `baseURL` (not `request.url`, whose host proxies and dev
 * servers can rewrite) plus the request's own path below the base path, so
 * route params and a trailing slash match what the client called. `path` is
 * used when there is no HTTP request, such as an `auth.api` call.
 */
function getEndpointUrl(ctx, path) {
    var baseURL = ctx.context.baseURL;
    var end = baseURL.length;
    // A loop, not `/\/+$/`, which backtracks quadratically on runs of slashes.
    while (end > 0 && baseURL[end - 1] === "/")
        end--;
    var base = baseURL.slice(0, end);
    // `baseURL` stays empty when nothing configures it and no request set it.
    if (!ctx.request || !base)
        return "".concat(base).concat(path);
    var basePath = new URL(base).pathname.replace(/\/$/, "");
    var requestPath = new URL(ctx.request.url).pathname;
    var endpointPath = requestPath.startsWith("".concat(basePath, "/"))
        ? requestPath.slice(basePath.length)
        : path;
    return "".concat(base).concat(endpointPath);
}
/**
 * Adds `headers` to a comma-separated `Access-Control-Expose-Headers` value,
 * keeping the names already listed.
 */
function withExposedHeaders(exposed) {
    var headers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        headers[_i - 1] = arguments[_i];
    }
    var names = (exposed !== null && exposed !== void 0 ? exposed : "")
        .split(",")
        .map(function (name) { return name.trim(); })
        .filter(Boolean);
    var _loop_1 = function (header) {
        if (!names.some(function (name) { return name.toLowerCase() === header.toLowerCase(); })) {
            names.push(header);
        }
    };
    for (var _a = 0, headers_1 = headers; _a < headers_1.length; _a++) {
        var header = headers_1[_a];
        _loop_1(header);
    }
    return names.join(", ");
}
