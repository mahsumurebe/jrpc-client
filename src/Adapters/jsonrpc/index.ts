import {IAdapter, TConvertTypes, TNotificationTypes} from '../types';
import {ErrorResponse, ICaller, TParams, TResponseInput, TResponseOutput} from '../../types';

export class JSONRPC implements IAdapter {
    checkError<T = any>(data: Array<TResponseInput<T>> | TResponseInput<T>): Array<TResponseOutput<T>> | TResponseOutput<T> {
        if (!(data instanceof Array)) {
            data = [data];
        }
        const out: Array<TResponseOutput<T>> = [];
        for (let item of data) {
            // @ts-ignore
            if (!!item.error) {
                // @ts-ignore
                item = new ErrorResponse(item.id, item.error, item.jsonrpc || '2.0');
            }
            out.push(item as TResponseOutput<T>);
        }
        if (out.length === 1) {
            return out[0];
        }
        return out;
    }

    convert(notification = false, paramsType: 'array' | 'object', method: TConvertTypes | TNotificationTypes<any>, params?: TParams<any>): Array<ICaller> | ICaller {
        let methods: Array<ICaller> = [];
        if (method instanceof Array) {
            methods = method;
        } else if ('string' === typeof method) {
            methods.push({
                id: (methods.length + 1),
                jsonrpc: '2.0',
                method: method,
                params: params || (paramsType === 'array' ? [] : {}),
            });
        } else if (typeof method === 'object') {
            methods.push(method);
        } else {
            // TODO: throw
            throw new Error('Method problem');
        }

        let ids = methods.map(item => item.id || null)
            .filter(Boolean)
            .sort((a, b) => a - b);

        const getNextId = () => {
            let max = 1;
            for (let i = 0; i < ids.length; i++) {
                if (max < ids[i]) {
                    ids.splice(i, 0, max);
                    return max;
                }
                max = ids[i] + 1;
            }
            ids.push(max);
            return max;
        };

        methods = methods.map(item => {
            if (!item.id && !notification) {
                item.id = getNextId();
            }
            if (notification) {
                if (!!item.id) {
                    delete item['id'];
                }
            }
            if (!item.jsonrpc) {
                item.jsonrpc = '2.0';
            }
            if (!item.params) {
                item.params = (paramsType === 'array' ? [] : {});
            }
            return item;
        });

        if (methods.length === 1) {
            return methods[0];
        }
        return methods;
    }
}