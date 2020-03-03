import RPCClient from './index';
import {ErrorResponse, IRPCCredentials} from './types';

let client: RPCClient;
const host = '127.0.0.1';
const port = 3000;
const auth: IRPCCredentials = {
    username: 'admin',
    password: 'password',
};
describe('Testing client', () => {
    beforeAll(() => {
        client = new RPCClient({
            auth: auth,
            url: `http://${host}:${port}`,
            pathname: '/',
            proxy: {
                host: '127.0.0.1',
                port: 8888,
            },
        });
    });

    it('should help method return "DONE" string', async () => {
        expect.assertions(1);
        await client.call('help')
            .then((data) => {
                expect(data).not.toBeInstanceOf(ErrorResponse);
                if (!(data instanceof ErrorResponse)) {
                    expect(data).toMatch('result');
                    expect(data.result).toEqual('DONE');
                }
            }).catch(e => {
                expect(e).toMatch('error')
            });
    });
});