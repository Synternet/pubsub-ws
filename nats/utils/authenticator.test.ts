import * as natsWs from 'nats.ws';
import { createAuthenticator } from './authenticator';

describe('authenticator', () => {
  describe('createAuthenticator', () => {
    it('calls credsAuthenticator from nats with encoded jwt', () => {
      const encode = jest.fn().mockReturnValue('encodedVal');
      jest.spyOn(global, 'TextEncoder').mockImplementation(() => ({ encode } as any));
      const credsAuthenticator = jest.spyOn(natsWs, 'credsAuthenticator');

      createAuthenticator('jwt1');

      expect(encode).toBeCalledWith('jwt1');
      expect(credsAuthenticator).toBeCalledWith('encodedVal');
    });
  });
});
