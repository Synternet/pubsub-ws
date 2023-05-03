import { subscribe } from '../../nats/utils/subscription';
import { NatsMessagesCallback, NatsErrorCallback, Message } from '../../nats/types';

function processMessages(messages: Message[]): string[] {
    return messages.map((message: Message) => message.data);
}

async function init() {
    const onMessages: NatsMessagesCallback = (messages: Message[]) => {
        const processedMessages = processMessages(messages);
        const messagesList = document.getElementById('messages-list');

        if (messagesList) {
            processedMessages.forEach((message: string) => {
                const listItem = document.createElement('li');
                listItem.textContent = message;
                messagesList.appendChild(listItem);
            });
        }

        console.log('Received messages:', messages);
    };

    const onError: NatsErrorCallback = (text: string, error: Error) => {
        console.error(text, error);
    };

    const jwt = 'USER_JWT';
    const nkey = 'CREDS_SEED';

    // Subscribe to messages
    await subscribe({ onMessages, onError, jwt, nkey, subject: '>'  });

}

window.addEventListener('DOMContentLoaded', init);
