"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = exports.publish = exports.subscribe = void 0;
const nats_ws_1 = require("nats.ws");
const authenticator_1 = require("./authenticator");
const codec_1 = require("./codec");
const config_1 = require("./config");
function natsConnect(config, jwt, nkey) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            servers: config.url,
            authenticator: (0, authenticator_1.createAuthenticator)(jwt, nkey),
        };
        if (typeof window === 'undefined') {
            // We are in a Node.js environment
            Object.assign(global, { WebSocket: require("ws") });
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        }
        return yield (0, nats_ws_1.connect)(options);
    });
}
function natsSubscribe({ connection, onMessages, onError, subject, }) {
    const subscription = connection.subscribe(subject, {
        callback: (err, msg) => {
            if (err) {
                onError('NATS subscription error.', err);
                return;
            }
            const message = (0, codec_1.decodeMessage)(msg);
            onMessages([message]);
        },
    });
    return subscription;
}
function subscribe({ onMessages, onError, jwt, nkey, subject, config = config_1.natsStaticConfig }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config.connection) {
            try {
                config.connection = yield natsConnect(config, jwt, nkey);
            }
            catch (err) {
                onError('Unable to connect to NATS.', err);
                return;
            }
        }
        config.subscription = natsSubscribe({ connection: config.connection, onMessages, onError, subject });
    });
}
exports.subscribe = subscribe;
function publish(subject, data, config = config_1.natsStaticConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.connection) {
            config.connection.publish(subject, (0, codec_1.encodeMessage)(data));
        }
    });
}
exports.publish = publish;
function unsubscribe(config = config_1.natsStaticConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.subscription) {
            config.subscription.unsubscribe();
            config.subscription = undefined;
        }
        if (config.connection) {
            config.connection.close();
            config.connection = undefined;
        }
    });
}
exports.unsubscribe = unsubscribe;
//# sourceMappingURL=subscription.js.map