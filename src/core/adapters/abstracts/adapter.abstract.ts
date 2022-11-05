// noinspection JSUnusedGlobalSymbols

import { getErrorInstanceFrom } from "../../exceptions/helpers/response.helper";
import {
  TypeId,
  TypeJRPCRequestBody,
  TypeJRPCResponse,
  TypeJRPCResponseBody,
  TypeMethodParam,
} from "../../types";

/**
 * Client Adapter Abstract for JSONRPC Http Server
 *
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @abstract
 */
export abstract class AdapterAbstract<
  TParam extends TypeMethodParam = Array<any>
> {
  /**
   * Request to server
   *
   * @param {object|object[]} body
   *
   * @abstract
   * @return Promise Returns the smoothed response output.
   */
  abstract request<TData = any, TId extends TypeId = number>(
    body: TypeJRPCRequestBody<TParam, TId>
  ): Promise<
    TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[] | void
  >;

  /**
   * Connect to server
   *
   * @return {Promise} Returns a void Promise
   */
  abstract connect(): Promise<void>;

  /**
   * Destroy server connection
   *
   * @return {Promise} Returns a void Promise
   */
  abstract destroy(): Promise<void> | void;

  /**
   * Parse response data
   *
   * @param {object|object[]} data Response Data
   * @protected
   * @return Promise Returns the smoothed output. If the return
   * value(s) is an error object, it converts to an error class.
   */
  protected parseData<TData = any, TId extends TypeId = number>(
    data: TypeJRPCResponseBody<TData, TId>
  ): TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[] {
    if (Array.isArray(data)) {
      return data.map((item) => this.parseData<TData, TId>(item)).flat();
    }
    if ("error" in data) {
      return getErrorInstanceFrom(data);
    }
    return data;
  }
}
