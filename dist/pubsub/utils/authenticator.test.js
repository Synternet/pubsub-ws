"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const natsWs = __importStar(require("nats.ws"));
const authenticator_1 = require("./authenticator");
describe('authenticator', () => {
    describe('createAuthenticator', () => {
        it('calls jwtAuthenticator from pubsub with encoded jwt and nkey', () => {
            const encode = jest.fn().mockReturnValue(new Uint8Array());
            jest.spyOn(global, 'TextEncoder').mockImplementation(() => ({ encode }));
            const jwtAuthenticator = jest.spyOn(natsWs, 'jwtAuthenticator');
            const jwt = 'jwt1';
            const nkey = 'nkey1';
            (0, authenticator_1.createAuthenticator)(jwt, nkey);
            expect(encode).toBeCalledWith(nkey);
            expect(jwtAuthenticator).toBeCalledWith(jwt, expect.any(Uint8Array));
        });
    });
});
//# sourceMappingURL=authenticator.test.js.map