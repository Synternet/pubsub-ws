import { subscribe, publish } from '../nats';
import { Message } from '../nats';
import {NatsConfig} from "../nats/types";

const natsWsUrl = 'wss://url.com:443';
const userCredsJWT = 'USER_JWT';
const userCredsSeed = 'CREDS_SEED';
const exampleSubscribeSubject = 'example.sub.subject';
const examplePublishSubject = 'example.pub.subject';

var config: NatsConfig;

async function republishData(message: Message) {
    console.log('Received message on', exampleSubscribeSubject, 'subject');
    publish(examplePublishSubject, message.data, config);
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
    config = { url: natsWsUrl }
    await subscribe({
        onMessages,
        onError,
        jwt: userCredsJWT,
        nkey: userCredsSeed,
        config: config,
        subject: exampleSubscribeSubject
    });
    console.log('Connected to NATS server.');
}

main();