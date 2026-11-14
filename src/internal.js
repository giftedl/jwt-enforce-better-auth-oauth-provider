"use strict";
/**
 * Deliberate first-party integration surface.
 *
 * This subpath is for Better Auth packages that extend the OAuth provider's
 * verified registration lifecycle. Application integrations should use the
 * public endpoints and plugin APIs instead.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClientMetadataDocument = exports.isForbiddenCimdClientMetadataField = exports.validatePublicClientJwks = void 0;
var client_jwks_1 = require("./client-jwks");
Object.defineProperty(exports, "validatePublicClientJwks", { enumerable: true, get: function () { return client_jwks_1.validatePublicClientJwks; } });
var client_metadata_1 = require("./client-metadata");
Object.defineProperty(exports, "isForbiddenCimdClientMetadataField", { enumerable: true, get: function () { return client_metadata_1.isForbiddenCimdClientMetadataField; } });
var register_1 = require("./register");
Object.defineProperty(exports, "registerClientMetadataDocument", { enumerable: true, get: function () { return register_1.registerClientMetadataDocument; } });
