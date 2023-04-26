import { mockMsg } from '../mocks';
import * as codec from './codec';
import { decodeMessage } from './codec';

jest.mock('nats.ws', () => ({
  ...jest.requireActual('nats.ws'),
  StringCodec: jest.fn().mockReturnValue({ decode: () => 'decodedData' }),
}));

describe('codec', () => {
  describe('decodeMessage', () => {

    it('returns message having subject', () => {
      const message = decodeMessage(mockMsg({ subject: 'abc' }));
      expect(message.subject).toStrictEqual('abc');
    });

    it('returns message having decoded data', () => {
      const decode = jest.spyOn(codec, 'decode');
      const message = decodeMessage(mockMsg({ data: 'encodedData' as any }));

      expect(message.data).toStrictEqual('decodedData');
      expect(decode).toBeCalledWith('encodedData');
    });
  });
});
