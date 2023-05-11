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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nats = __importStar(require("nats.ws"));
const mocks_1 = require("../mocks");
const authenticator = __importStar(require("./authenticator"));
const codec = __importStar(require("./codec"));
const subscription_1 = require("./subscription");
describe('subscription', () => {
    describe('subscribe', () => {
        beforeEach(() => {
            jest.spyOn(nats, 'connect').mockResolvedValue((0, mocks_1.mockNatsConnection)());
            jest.spyOn(authenticator, 'createAuthenticator').mockReturnValue('authenticator');
        });
        it('creates pubsub connection using provided server url when it is not created', () => __awaiter(void 0, void 0, void 0, function* () {
            const connect = jest.spyOn(nats, 'connect').mockResolvedValue((0, mocks_1.mockNatsConnection)());
            yield (0, subscription_1.subscribe)({
                onMessages: jest.fn(),
                onError: jest.fn(),
                jwt: 'fakeJwt',
                nkey: 'fakeNKey',
                subject: 'subject',
                config: (0, mocks_1.mockNatsConfig)({ url: 'someUrl1', connection: undefined }),
            });
            expect(connect).toBeCalledWith({ authenticator: 'authenticator', servers: 'someUrl1' });
        }));
        it('uses provided jwt for authenticator', () => __awaiter(void 0, void 0, void 0, function* () {
            const createAuthenticator = jest.spyOn(authenticator, 'createAuthenticator');
            yield (0, subscription_1.subscribe)({ onMessages: jest.fn(), onError: jest.fn(), jwt: 'superJwt', nkey: 'fakeNKey', subject: 'subject', config: (0, mocks_1.mockNatsConfig)() });
            expect(createAuthenticator).toBeCalledWith('superJwt', 'fakeNKey');
        }));
        it('subscribes to all pubsub topics (">")', () => __awaiter(void 0, void 0, void 0, function* () {
            const natsSubscribe = jest.fn().mockImplementation();
            const connection = (0, mocks_1.mockNatsConnection)({ subscribe: natsSubscribe });
            jest.spyOn(nats, 'connect').mockResolvedValue(connection);
            yield (0, subscription_1.subscribe)({ onMessages: jest.fn(), onError: jest.fn(), jwt: 'fakeJwt', nkey: 'fakeNKey', subject: 'subject', config: (0, mocks_1.mockNatsConfig)() });
            expect(natsSubscribe.mock.lastCall[0]).toStrictEqual('subject');
        }));
        it('subscribe callback is called with decoded message when message is received in pubsub', () => __awaiter(void 0, void 0, void 0, function* () {
            let subscriptionOptions;
            const natsSubscribe = jest.fn().mockImplementation((_subject, options) => {
                subscriptionOptions = options;
            });
            const connection = (0, mocks_1.mockNatsConnection)({ subscribe: natsSubscribe });
            jest.spyOn(nats, 'connect').mockResolvedValue(connection);
            const decodedMessage = (0, mocks_1.mockMessage)();
            const decodeMessage = jest.spyOn(codec, 'decodeMessage').mockReturnValue(decodedMessage);
            const onMessages = jest.fn();
            yield (0, subscription_1.subscribe)({ onMessages, onError: jest.fn(), jwt: 'fakeJwt', nkey: 'fakeNKey', subject: 'subject', config: (0, mocks_1.mockNatsConfig)() });
            const natsMessage = (0, mocks_1.mockMsg)();
            subscriptionOptions.callback(null, natsMessage);
            expect(onMessages).toBeCalledWith([decodedMessage]);
            expect(decodeMessage).toBeCalledWith(natsMessage);
        }));
    });
    describe('unsubscribe', () => {
        it('unsubscribes and sets subscription to undefined when it exists', () => {
            const natsUnsubscribe = jest.fn();
            const config = (0, mocks_1.mockNatsConfig)({ subscription: (0, mocks_1.mockSubscription)({ unsubscribe: natsUnsubscribe }) });
            (0, subscription_1.unsubscribe)(config);
            expect(natsUnsubscribe).toBeCalled();
            expect(config.subscription).toBeUndefined();
        });
        it('does nothing when subscription does not exist', () => {
            const config = (0, mocks_1.mockNatsConfig)({ subscription: undefined });
            (0, subscription_1.unsubscribe)(config);
            expect(config.subscription).toBeUndefined();
        });
    });
});
//# sourceMappingURL=subscription.test.js.map