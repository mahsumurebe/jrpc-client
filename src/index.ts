import {ErrorResponse, ICaller, IRPCClientConfig, TParams, TResponseOutput} from './types';
import Axios, {AxiosError, AxiosInstance} from 'axios';
import {TConvertTypes} from './Adapters/types';
import {JSONRPC} from './Adapters/jsonrpc';
import {RpcError, RpcErrorCode, RpcErrorMessage} from './Core/Errors';

const configDefault = {
    pathname: '/',
};

export default class RPCClient {
    request: AxiosInstance;

    constructor(public config: IRPCClientConfig, public readonly adapter = new JSONRPC) {
        this.config = {
            ...configDefault,
            ...config,
        };
        const axiosConfig = {
            ...this.config.axios,
            baseURL: this.config.url,
            auth: this.config.auth,
            proxy: this.config.proxy,
            headers: this.config.headers,
        };
        this.request = Axios.create(axiosConfig);
    }

    call<T, P = any>(methods: Array<ICaller<P>>): Promise<Array<TResponseOutput<T>>>;
    call<T, P = any>(method: ICaller<P>): Promise<TResponseOutput<T>>;
    call<T, P = any>(methodName: string, params?: TParams<P>): Promise<TResponseOutput<T>>;
    call<T, P = any>(method: TConvertTypes, params?: TParams<P>): Promise<Array<TResponseOutput<T>> | TResponseOutput<T>> {
        const data = this.adapter.convert(this.config.paramsType, method, params);
        return this.request
            .post<TResponseOutput<T>>(this.config.pathname, data)
            .then(response => this.adapter.checkError<T>(response.data))
            .catch((e: AxiosError) => {
                if (e.isAxiosError) {
                    const data: ErrorResponse = e.response.data;
                    if (typeof data === 'object') {
                        if (data instanceof Array) {
                            return this.adapter.checkError<T>(data);
                        } else if (!!data.error) {
                            throw RpcError.fromJSON({
                                code: data.error.code,
                                message: data.error.message,
                                data,
                            });
                        }
                    }
                }
                throw RpcError.fromJSON({
                    code: RpcErrorCode.SERVER_ERROR,
                    message: RpcErrorMessage.SERVER_ERROR,
                    parent: e,
                });
            });
    }
}