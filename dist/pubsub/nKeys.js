"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNKeysFromSeed = exports.generateUserNKeys = void 0;
const nkeys_js_1 = require("nkeys.js");
function generateUserNKeys() {
    const user = (0, nkeys_js_1.createUser)();
    const publicKey = user.getPublicKey();
    const seed = new TextDecoder().decode(user.getSeed());
    return { publicKey, seed };
}
exports.generateUserNKeys = generateUserNKeys;
function getNKeysFromSeed(seed) {
    return (0, nkeys_js_1.fromSeed)(Buffer.from(seed));
}
exports.getNKeysFromSeed = getNKeysFromSeed;
//# sourceMappingURL=nKeys.js.map