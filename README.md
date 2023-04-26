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
npm install --save syntropy-pubsub-ws
```

## Usage
Here is a simple example demonstrating how to subscribe to a data stream and republish the received data to another stream:

```typescript
import { subscribe, publish } from '../nats';
import { Message } from '../nats/types';

const natsWsUrl = 'wss://amberdm-sandbox-b1.syntropystack.com:443';
const userCredsJWT = 'USER_JWT';
const userCredsSeed = 'CREDS_SEED';
const exampleSubscribeSubject = 'example.sub.subject';
const examplePublishSubject = 'example.pub.subject';

async function republishData(message: Message) {
    console.log('Received message on', exampleSubscribeSubject, 'subject');
    await publish(examplePublishSubject, message.data);
    console.log('Published message on', examplePublishSubject, 'subject');
}

const onMessages = async (messages: Message[]) => {
    messages
        .filter((message) => message.subject === exampleSubscribeSubject)
        .forEach((message) => republishData(message));
};

const onError = (text: string, error: Error) => {
    console.error(text, error);
};

async function main() {
    await subscribe({
        onMessages,
        onError,
        jwt: userCredsJWT,
        nkey: userCredsSeed,
        config: { url: natsWsUrl },
    });
    console.log('Connected to NATS server.');
}

main();
```

This example demonstrates how to connect to a NATS server with WebSocket support, subscribe to a subject, and republish received messages to another subject using the Syntropy PubSub-WS library.

## License
This project is licensed under the MIT License.