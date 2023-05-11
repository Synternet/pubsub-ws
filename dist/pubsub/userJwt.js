"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserJwt = exports.createAppJwt = exports.jwtExpirationHours = void 0;
const base64url_1 = __importDefault(require("base64url"));
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const nKeys_1 = require("./nKeys");
exports.jwtExpirationHours = 2;
function createAppJwt(developerSeed, expirationDate = (0, date_fns_1.addHours)(new Date(), exports.jwtExpirationHours)) {
    const { seed: userSeed } = (0, nKeys_1.generateUserNKeys)();
    const jwt = generateUserJwt({ userSeed, developerSeed, expirationDate });
    return {
        jwt,
        userSeed
    };
}
exports.createAppJwt = createAppJwt;
function generateUserJwt({ userSeed, developerSeed, expirationDate, }) {
    const user = (0, nKeys_1.getNKeysFromSeed)(userSeed);
    const developer = (0, nKeys_1.getNKeysFromSeed)(developerSeed);
    const payload = {
        jti: getJti(),
        iat: getIat(),
        exp: getExp(expirationDate),
        iss: developer.getPublicKey(),
        name: "developer",
        sub: user.getPublicKey(),
        nats: getNatsConfig(),
    };
    const jwt = signJwt(payload, developer);
    return jwt;
}
exports.generateUserJwt = generateUserJwt;
function getExp(expirationDate) {
    return Math.round(expirationDate.getTime() / 1000);
}
function getJti() {
    return (0, uuid_1.v5)("localhost", uuid_1.v5.URL).toString();
}
function getIat() {
    return Math.round(Date.now() / 1000);
}
function signJwt(payload, keyPair) {
    const header = {
        typ: "JWT",
        alg: "ed25519-nkey",
    };
    const jwtBase = base64url_1.default.encode(JSON.stringify(header)) +
        "." +
        base64url_1.default.encode(JSON.stringify(payload));
    const sigBase64Url = base64url_1.default.encode(Buffer.from(keyPair.sign(Buffer.from(jwtBase))));
    const jwt = jwtBase + "." + sigBase64Url;
    return jwt;
}
function getNatsConfig() {
    return {
        pub: {},
        sub: {},
        subs: -1,
        data: -1,
        payload: -1,
        type: "user",
        version: 2,
    };
}
//# sourceMappingURL=userJwt.js.map