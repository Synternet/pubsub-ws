"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthenticator = void 0;
const nats_ws_1 = require("nats.ws");
function createAuthenticator(jwt, nkey) {
    const nkeyUint8Array = new TextEncoder().encode(nkey);
    return (0, nats_ws_1.jwtAuthenticator)(jwt, nkeyUint8Array);
}
exports.createAuthenticator = createAuthenticator;
//# sourceMappingURL=authenticator.js.map