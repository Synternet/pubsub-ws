import { Msg, StringCodec } from 'nats.ws';
import { Message } from '../types';
import * as codec from './codec';

const sc = StringCodec();

export function decode(data: Uint8Array) {
  return sc.decode(data);
}

export function decodeMessage(message: Msg): Message {
  const data = codec.decode(message.data);
  return { subject: message.subject, data };
}

export function encodeMessage(data: string) {
  return sc.encode(data);
}
