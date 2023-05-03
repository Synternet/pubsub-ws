import * as nats from 'nats.ws';
import { mockMessage, mockMsg, mockNatsConfig, mockNatsConnection, mockSubscription } from '../mocks';
import * as authenticator from './authenticator';
import * as codec from './codec';
import { subscribe, unsubscribe } from './subscription';

describe('subscription', () => {
  describe('subscribe', () => {
    beforeEach(() => {
      jest.spyOn(nats, 'connect').mockResolvedValue(mockNatsConnection());
      jest.spyOn(authenticator, 'createAuthenticator').mockReturnValue('authenticator' as any);
    });

    it('creates nats connection using provided server url when it is not created', async () => {
      const connect = jest.spyOn(nats, 'connect').mockResolvedValue(mockNatsConnection());
      await subscribe({
        onMessages: jest.fn(),
        onError: jest.fn(),
        jwt: 'fakeJwt',
        nkey: 'fakeNKey',
        subject: 'subject',
        config: mockNatsConfig({ url: 'someUrl1', connection: undefined }),
      });
      expect(connect).toBeCalledWith({ authenticator: 'authenticator', servers: 'someUrl1' });
    });

    it('uses provided jwt for authenticator', async () => {
      const createAuthenticator = jest.spyOn(authenticator, 'createAuthenticator');
      await subscribe({ onMessages: jest.fn(), onError: jest.fn(), jwt: 'superJwt', nkey: 'fakeNKey', subject: 'subject', config: mockNatsConfig() });
      expect(createAuthenticator).toBeCalledWith('superJwt', 'fakeNKey');
    });

    it('subscribes to all nats topics (">")', async () => {
      const natsSubscribe = jest.fn().mockImplementation();
      const connection = mockNatsConnection({ subscribe: natsSubscribe });
      jest.spyOn(nats, 'connect').mockResolvedValue(connection);

      await subscribe({ onMessages: jest.fn(), onError: jest.fn(), jwt: 'fakeJwt', nkey: 'fakeNKey', subject: 'subject', config: mockNatsConfig() });

      expect(natsSubscribe.mock.lastCall[0]).toStrictEqual('>');
    });

    it('subscribe callback is called with decoded message when message is received in nats', async () => {

      let subscriptionOptions: any;
      const natsSubscribe = jest.fn().mockImplementation((_subject, options) => {
        subscriptionOptions = options;
      });

      const connection = mockNatsConnection({ subscribe: natsSubscribe });
      jest.spyOn(nats, 'connect').mockResolvedValue(connection);
      const decodedMessage = mockMessage();
      const decodeMessage = jest.spyOn(codec, 'decodeMessage').mockReturnValue(decodedMessage);
      const onMessages = jest.fn();

      await subscribe({ onMessages, onError: jest.fn(), jwt: 'fakeJwt', nkey: 'fakeNKey', subject: 'subject', config: mockNatsConfig() });
      const natsMessage = mockMsg();
      subscriptionOptions.callback(null, natsMessage);

      expect(onMessages).toBeCalledWith([decodedMessage]);
      expect(decodeMessage).toBeCalledWith(natsMessage);
    });

  });

  describe('unsubscribe', () => {
    it('unsubscribes and sets subscription to undefined when it exists', () => {
      const natsUnsubscribe = jest.fn();
      const config = mockNatsConfig({ subscription: mockSubscription({ unsubscribe: natsUnsubscribe }) });
      unsubscribe(config);
      expect(natsUnsubscribe).toBeCalled();
      expect(config.subscription).toBeUndefined();
    });

    it('does nothing when subscription does not exist', () => {
      const config = mockNatsConfig({ subscription: undefined });
      unsubscribe(config);
      expect(config.subscription).toBeUndefined();
    });

  });
});
