import base64url from "base64url";
import { addHours } from "date-fns";
import { v5 as uuid } from "uuid";
import { generateUserNKeys, getNKeysFromSeed, KeyPair } from "./nKeys";

export const jwtExpirationHours = 2;

export function createAppJwt(
  developerSeed: string,
  expirationDate: Date = addHours(new Date(), jwtExpirationHours),
) {
  const { seed: userSeed } = generateUserNKeys();
  const jwt = generateUserJwt({ userSeed, developerSeed, expirationDate });
  return {
    jwt,
    userSeed,
  };
}

export function generateUserJwt({
  userSeed,
  developerSeed,
  expirationDate,
}: {
  userSeed: string;
  developerSeed: string;
  expirationDate: Date;
}) {
  const user = getNKeysFromSeed(userSeed);
  const developer = getNKeysFromSeed(developerSeed);

  const payload = {
    jti: getJti(),
    iat: getIat(),
    // exp: getExp(expirationDate), // optionally, expire
    iss: developer.getPublicKey(),
    name: "developer",
    sub: user.getPublicKey(),
    nats: getNatsConfig(),
  };

  const jwt = signJwt(payload, developer);

  return jwt;
}

function getExp(expirationDate: Date) {
  return Math.round(expirationDate.getTime() / 1000);
}

function getJti() {
  return uuid("localhost", uuid.URL).toString();
}

function getIat() {
  return Math.round(Date.now() / 1000);
}

function signJwt(payload: any, keyPair: KeyPair): string {
  const header = {
    typ: "JWT",
    alg: "ed25519-nkey",
  };

  const jwtBase =
    base64url.encode(JSON.stringify(header)) +
    "." +
    base64url.encode(JSON.stringify(payload));
  const sigBase64Url = base64url.encode(
    Buffer.from(keyPair.sign(Buffer.from(jwtBase))),
  );
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
