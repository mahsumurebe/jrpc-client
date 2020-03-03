import {AxiosRequestConfig} from 'axios';

interface IRPCProxy {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: string;
}

export interface IRPCClientConfig {
    url: string;
    pathname?: string;
    proxy?: IRPCProxy;
    auth?: IRPCCredentials;
    headers?: { [header: string]: string }
    axios?: AxiosRequestConfig,
    paramsType?: 'object' | 'array'
}

export interface IRPCCredentials {
    username: string;
    password: string;
}

export type TParams<T> = { [key: string]: T } | Array<T>

export interface ICaller<P = any> {
    id?: number;
    jsonrpc?: '2.0';
    method: string;
    params?: TParams<P>
}

export interface IErrorInline {
    code?: number;
    message: string;
    data?: IErrorInline
    stack?: string
}

interface IResponseBase {
    id: number;
    jsonrpc: string;
}

export interface IErrorResponse extends IResponseBase {
    error: IErrorInline
}

export class ErrorResponse implements IResponseBase {
    constructor(public readonly id: number, public readonly error: IErrorInline, public readonly jsonrpc = '2.0') {
    }

    toJSON() {
        return {
            id: this.id,
            jsonrpc: this.jsonrpc,
            error: this.error,
        };
    }

    toString() {
        return JSON.stringify(this.error);
    }
}

export interface IResponse<R = any> extends IResponseBase {
    result: R
}

export type TResponseOutput<T> = IResponse<T> | ErrorResponse;
export type TResponseInput<T> = IResponse<T> | IErrorResponse;