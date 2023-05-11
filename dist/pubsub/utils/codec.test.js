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
const mocks_1 = require("../mocks");
const codec = __importStar(require("./codec"));
const codec_1 = require("./codec");
jest.mock('pubsub.ws', () => (Object.assign(Object.assign({}, jest.requireActual('pubsub.ws')), { StringCodec: jest.fn().mockReturnValue({ decode: () => 'decodedData' }) })));
describe('codec', () => {
    describe('decodeMessage', () => {
        it('returns message having subject', () => {
            const message = (0, codec_1.decodeMessage)((0, mocks_1.mockMsg)({ subject: 'abc' }));
            expect(message.subject).toStrictEqual('abc');
        });
        it('returns message having decoded data', () => {
            const decode = jest.spyOn(codec, 'decode');
            const message = (0, codec_1.decodeMessage)((0, mocks_1.mockMsg)({ data: 'encodedData' }));
            expect(message.data).toStrictEqual('decodedData');
            expect(decode).toBeCalledWith('encodedData');
        });
    });
});
//# sourceMappingURL=codec.test.js.map