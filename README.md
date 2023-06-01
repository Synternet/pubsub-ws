# Syntropy PubSub-WS

`syntropy-pubsub-ws` is a TypeScript library for the Syntropy DataMesh project that allows you to subscribe to existing data streams or publish new ones from frontend applications. This library is built on top of the NATS messaging system with WebSocket support, providing a convenient way to integrate your frontend TypeScript applications with the Syntropy DataMesh platform.
## Features

- Subscribe to existing data streams
- Publish new data streams
- Support for JSON messages
- Customizable connection options

## Installation

To install the library, use the following command:

```bash
npm install git@gitlab.com:syntropynet/amberdm/sdk/pubsub-ws.git
```

## Usage
Here is a simple example demonstrating how to subscribe to a data stream using seed from developer-portal:

### The preferred method of authentication is using an access token from the developer portal.
```typescript
import { subscribe, Message, NatsConfig, createAppJwt } from 'pubsub-ws';

const natsWsUrl = 'wss://url.com:443';
const accessToken = 'SAAGNJOZTRPYYXG2NJX3ZNGXYUSDYX2BWO447W3SHG6XQ7U66RWHQ3JUXM';
const exampleSubscribeSubject = 'example.sub.subject';

var config: NatsConfig;

async function printData(message: Message) {
    console.log('Received message on', exampleSubscribeSubject, 'subject');
}

const onMessages = async (messages: Message[]) => {
    messages
        .filter((message) => message.subject === exampleSubscribeSubject)
        .forEach((message) => printData(message));
};

const onError = (text: string, error: Error) => {
    console.error(text, error);
};

async function main() {
    config = { url: natsWsUrl }
    const { userSeed: seed, jwt } = createAppJwt(accessToken);

    await subscribe({
        onMessages,
        onError,
        jwt: jwt,
        nkey: seed,
        config: config,
        subject: exampleSubscribeSubject
    });
    console.log('Connected to NATS server.');
}

main();
```

This example demonstrates how to connect to a NATS server with WebSocket support, subscribe to a subject, and republish received messages to another subject using the Syntropy PubSub-WS library.

## License
This project is licensed under the MIT License.