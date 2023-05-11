import { createUser, fromSeed } from "nkeys.js";

export type { KeyPair } from "nkeys.js";

export function generateUserNKeys(): { publicKey: string; seed: string } {
  const user = createUser();
  const publicKey = user.getPublicKey();
  const seed = new TextDecoder().decode(user.getSeed());
  return { publicKey, seed };
}

export function getNKeysFromSeed(seed: string) {
  return fromSeed(Buffer.from(seed));
}
