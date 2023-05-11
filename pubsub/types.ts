import { NatsConnection, Subscription } from 'nats.ws';

export type NatsMessagesCallback = (messages: Message[]) => void;
export type NatsErrorCallback = (text: string, error: Error) => void;

export interface Message {
  subject: string;
  data: string;
}

export interface NatsConfig {
  url: string;
  connection?: NatsConnection;
  subscription?: Subscription;
}
