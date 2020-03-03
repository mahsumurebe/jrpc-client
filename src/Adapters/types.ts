import {ICaller, TParams, TResponseInput, TResponseOutput} from '../types';

export interface IAdapter {
    checkError<T = any>(data: Array<TResponseInput<T>> | TResponseInput<T>): Array<TResponseOutput<T>> | TResponseOutput<T>;

    convert(paramsType: 'array' | 'object', method: TConvertTypes, params?: TParams<any>)
}


export type TConvertTypes = Array<ICaller> | ICaller | string;