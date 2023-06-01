import { subscribe } from '../pubsub';
import { Message } from '../pubsub';
import {NatsConfig} from "../pubsub/types";
import {createAppJwt} from "../pubsub/userJwt";

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