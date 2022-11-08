// noinspection JSUnusedGlobalSymbols

import {
  TypeId,
  TypeJRPCRequestBody,
  TypeJRPCResponse,
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
}
