import { jwtAuthenticator } from 'nats.ws';

export function createAuthenticator(jwt: string, nkey: string) {
  const nkeyUint8Array = new TextEncoder().encode(nkey);
  return jwtAuthenticator(jwt, nkeyUint8Array);
}