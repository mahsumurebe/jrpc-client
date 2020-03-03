import {JSONRPC} from './Adapters/jsonrpc';
import {ErrorResponse} from './types';

let jsonrpc = new JSONRPC();
describe('Testing client', () => {
    it('should be correct jsonrpc output', () => {
        const data = jsonrpc.convert(false, 'object', {method: 'help'});
        expect(data).toMatchObject({id: 1, jsonrpc: '2.0', method: 'help', params: {}});
    });
    it('should ErrorResponse instance', () => {
        const data = jsonrpc.checkError({id: 1, error: {code: -1, message: 'test'}, jsonrpc: '2.0'});
        expect(data).toBeInstanceOf(ErrorResponse);
    });
    it('should be correct batch jsonrpc output', () => {
        const data = jsonrpc.convert(false, 'object', [{method: 'help'}, {method: 'help2'}]);
        expect(data).toMatchObject([{
            id: 1,
            jsonrpc: '2.0',
            method: 'help',
            params: {},
        }, {
            id: 2,
            jsonrpc: '2.0',
            method: 'help2',
            params: {},
        }]);
    });
});