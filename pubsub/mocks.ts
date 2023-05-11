import { Msg, NatsConnection, Subscription } from 'nats.ws';
import { Message, NatsConfig } from './types';

type CreateMockFn<T> = (props?: Partial<T>) => T;

export function createMock<T>(defaultProps: Partial<T>): CreateMockFn<T> {
  return (props?: Partial<T>): T => ({ ...defaultProps, ...props } as T);
}

export const mockMessage = createMock<Message>({
  data: 'data1',
  subject: 'subject1',
});

export const mockNatsConfig = createMock<NatsConfig>({
  url: 'someUrl',
});

export const mockMsg = createMock<Msg>({
  subject: 'subject1',
  data: 'encodedData' as any,
  respond: jest.fn(),
});

export const mockSubscription = createMock<Subscription>({
  unsubscribe: jest.fn(),
});

export const mockNatsConnection = createMock<NatsConnection>({
  subscribe: jest.fn(),
});
