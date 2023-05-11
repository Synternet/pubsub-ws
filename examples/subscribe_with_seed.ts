import { subscribe } from '../nats';
import { Message } from '../nats';
import {NatsConfig} from "../nats/types";
import {createAppJwt} from "../nats/userJwt";

const natsWsUrl = 'wss://url.com:443';
const userCredsSeed = 'SAAGNJOZTRPYYXG2NJX3ZNGXYUSDYX2BWO447W3SHG6XQ7U66RWHQ3JUXM';
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
    const { userSeed: seed, jwt } = createAppJwt(userCredsSeed);

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