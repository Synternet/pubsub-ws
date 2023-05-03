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
        subject: exampleSubscribeSubject
    });
    console.log('Connected to NATS server.');
}

main();