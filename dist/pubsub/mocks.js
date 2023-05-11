"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockNatsConnection = exports.mockSubscription = exports.mockMsg = exports.mockNatsConfig = exports.mockMessage = exports.createMock = void 0;
function createMock(defaultProps) {
    return (props) => (Object.assign(Object.assign({}, defaultProps), props));
}
exports.createMock = createMock;
exports.mockMessage = createMock({
    data: 'data1',
    subject: 'subject1',
});
exports.mockNatsConfig = createMock({
    url: 'someUrl',
});
exports.mockMsg = createMock({
    subject: 'subject1',
    data: 'encodedData',
    respond: jest.fn(),
});
exports.mockSubscription = createMock({
    unsubscribe: jest.fn(),
});
exports.mockNatsConnection = createMock({
    subscribe: jest.fn(),
});
//# sourceMappingURL=mocks.js.map