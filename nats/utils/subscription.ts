import { ConnectionOptions, NatsConnection, connect } from 'nats.ws';
import { NatsConfig, NatsErrorCallback, NatsMessagesCallback } from '../types';
import { createAuthenticator } from './authenticator';
import {decodeMessage, encodeMessage} from './codec';
import { natsStaticConfig } from './config';

async function natsConnect(config: NatsConfig, jwt: string) {
  const options: ConnectionOptions = {
    servers: config.url,
    authenticator: createAuthenticator(jwt),
  };

  return await connect(options);
}

function natsSubscribe({
  connection,
  onMessages,
  onError,
}: {
  connection: NatsConnection;
  onMessages: NatsMessagesCallback;
  onError: NatsErrorCallback;
}) {
  const subscription = connection.subscribe('>', {
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
  config?: NatsConfig;
}

export async function subscribe({ onMessages, onError, jwt, config = natsStaticConfig }: SubscribeProps) {

  if (!config.connection) {
    try {
      config.connection = await natsConnect(config, jwt);
    } catch (err: any) {
      onError('Unable to connect to NATS.', err);
      return;
    }
  }

  config.subscription = natsSubscribe({ connection: config.connection, onMessages, onError });
}

export async function publish(config = natsStaticConfig, subject, data) {

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
