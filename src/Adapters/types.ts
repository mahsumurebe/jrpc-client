import {ICaller, TParams} from '../types';

export interface IAdapter {
    convert(paramsType: 'array' | 'object', method: TConvertTypes, params?: TParams<any>)
}


export type TConvertTypes = Array<ICaller> | ICaller | string;