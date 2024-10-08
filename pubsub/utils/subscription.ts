import { ConnectionOptions, NatsConnection, connect } from 'nats.ws';
import { NatsConfig, NatsErrorCallback, NatsMessagesCallback } from '../types';
import { createAuthenticator } from './authenticator';
import {decodeMessage, encodeMessage} from './codec';
import { natsStaticConfig } from './config';

export async function natsConnect(config: NatsConfig, jwt: string, nkey: string) {
  const options: ConnectionOptions = {
    servers: config.url,
    authenticator: createAuthenticator(jwt, nkey),
  };
  if (typeof window === 'undefined') {
    // We are in a Node.js environment
    Object.assign(global, { WebSocket: require("ws") });
    (process.env as any)["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  }

  return await connect(options);
}

function natsSubscribe({
                         connection,
                         onMessages,
                         onError,
                         subject,
                       }: {
  connection: NatsConnection;
  onMessages: NatsMessagesCallback;
  onError: NatsErrorCallback;
  subject: string;
}) {
  const subscription = connection.subscribe(subject, {
    callback: (err, msg) => {
      if (err) {
        onError('NATS subscription error.', err);
        return;
      }

      const message = decodeMessage(msg);
      onMessages([message]);
    },
  });

  return subscription;
}

interface SubscribeProps {
  onMessages: NatsMessagesCallback;
  onError: (text: string, error: Error) => void;
  jwt: string;
  nkey: string;
  subject: string;
  config?: NatsConfig;
}

export async function subscribe({ onMessages, onError, jwt, nkey, subject, config = natsStaticConfig }: SubscribeProps) {

  if (!config.connection) {
    try {
      config.connection = await natsConnect(config, jwt, nkey);
    } catch (err: any) {
      onError('Unable to connect to NATS.', err);
      return;
    }
  }

  config.subscription = natsSubscribe({ connection: config.connection, onMessages, onError, subject });
}

export async function publish(subject: string, data: string, config = natsStaticConfig) {

  if (config.connection) {
    config.connection.publish(subject, encodeMessage(data));
  }

}

export async function unsubscribe(config = natsStaticConfig) {

  if (config.subscription) {
    config.subscription.unsubscribe();
    config.subscription = undefined;
  }

  if (config.connection) {
    config.connection.close();
    config.connection = undefined;
  }
}
