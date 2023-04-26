import * as natsWs from 'nats.ws';
import { createAuthenticator } from './authenticator';

describe('authenticator', () => {
  describe('createAuthenticator', () => {
    it('calls jwtAuthenticator from nats with encoded jwt and nkey', () => {
      const encode = jest.fn().mockReturnValue(new Uint8Array());
      jest.spyOn(global, 'TextEncoder').mockImplementation(() => ({ encode } as any));
      const jwtAuthenticator = jest.spyOn(natsWs, 'jwtAuthenticator');

      const jwt = 'jwt1';
      const nkey = 'nkey1';
      createAuthenticator(jwt, nkey);

      expect(encode).toBeCalledWith(nkey);
      expect(jwtAuthenticator).toBeCalledWith(jwt, expect.any(Uint8Array));
    });
  });
});