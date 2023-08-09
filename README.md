Welcome to the documentation for the WebSocket SDK for the Data Layer! This SDK allows seamless integration with our Data Layer solution, enabling you to leverage real-time data streams in your applications using WebSocket communication. With the WebSocket SDK, you can unlock the power of the Data Layer and harness real-time insights for your data-driven projects.

[syntropy-pubsub-ws](https://github.com/SyntropyNet/pubsub-ws) is a TypeScript library for the Syntropy Data Layer project that allows you to subscribe to **existing data streams or publish new ones from frontend applications**. This library is built on top of the NATS messaging system with WebSocket support, providing a convenient way to integrate your frontend **TypeScript** applications with the Syntropy Data Layer platform.

# Features

The WebSocket SDK for Data Layer offers the following features:

- **Subscribe to Existing Data Streams**: Easily subscribe to pre-existing data streams within the Syntropy Data Layer. Stay updated with real-time data insights and leverage them in your applications.

- **Publish New Data Streams**: Create and publish your own data streams directly from your applications. Share data with other participants in the Data Layer, enabling collaboration and innovation.

- **Support for JSON Messages**: Communicate with the Data Layer using JSON messages. JSON provides a flexible and widely supported format for data exchange, allowing you to structure your data effectively.

- **Customizable Connection Options**: Tailor the connection settings based on your specific requirements. Customize connection timeouts, retry mechanisms, authentication methods, and more to ensure optimal performance and security.

With these powerful features, the WebSocket SDK empowers you to seamlessly interact with the Data Layer, unlocking the potential of real-time data streams for your applications.

# Installation

To use the WebSocket SDK for Data  Layer in your project you can install it using npm:

```shell
npm install git@github.com:SyntropyNet/pubsub-ws
```

# Getting Started

Before you begin using the WebSocket SDK, make sure you have the necessary credentials and access tokens from the Syntropy Developer Portalplatform. These credentials will allow you to connect to the Data Availability Layer and subscribe to or publish data streams.

## Usage

For detailed usage examples, please refer to the [examples directory](https://github.com/SyntropyNet/pubsub-ws/examples) in the repository. These examples cover various scenarios and demonstrate how to utilize the SDK's features effectively.

The preferred method of authentication is using an access token from the [developer portal](https://developer-portal.syntropynet.com/).

```TypeScript
import { subscribe, Message, NatsConfig, createAppJwt } from 'pubsub-ws';

const natsWsUrl = 'wss://url.com:443';
const accessToken = 'EXAMPLE_ACCESS_TOKEN';
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

## Contributing

We welcome contributions from the community! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/SyntropyNet/pubsub-python). We appreciate your feedback and collaboration in making this SDK even better. 

## Contribution Guidelines

To contribute to this project, please follow the guidelines outlined in the [Contribution.md](CONTRIBUTING.md) file. It covers important information about how to submit bug reports, suggest new features, and submit pull requests.

## Code of Conduct
This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive environment for all contributors. Please review the guidelines and make sure to follow them in all interactions within the project.

## Commit Message Format
When making changes to the codebase, it's important to follow a consistent commit message format. Please refer to the [Commit Message Format](commit-template.md) for details on how to structure your commit messages.

## Pull Request Template
To streamline the pull request process, we have provided a [Pull Request Template](pull-request-template.md) that includes the necessary sections for describing your changes, related issues, proposed changes, and any additional information. Make sure to fill out the template when submitting a pull request.

We appreciate your contributions and thank you for your support in making this project better!

## Support

Support
If you encounter any difficulties or have questions regarding the WebSocket SDK for Data Layer, please reach out to our support team at [Discord #developer-discussion](https://discord.com/channels/503896258881126401/1125658694399561738).We are here to assist you and ensure a smooth experience with our SDK.


We hope this documentation provides you with a comprehensive understanding of the WebSocket SDK for the Data Layer. Enjoy leveraging real-time data streams and unlocking the power of the Data Layer in your applications!
