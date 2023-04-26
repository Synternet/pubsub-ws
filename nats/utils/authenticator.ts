import { credsAuthenticator } from 'nats.ws';

export function createAuthenticator(jwt: string) {
  return credsAuthenticator(new TextEncoder().encode(jwt));
}
