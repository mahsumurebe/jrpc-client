// noinspection JSUnusedGlobalSymbols

import {
  AdapterAbstract,
  TypeId,
  TypeJRPCNotificationBody,
  TypeJRPCRequestBody,
  TypeJRPCRequestInterface,
  TypeJRPCResponse,
  TypeMethodParam,
} from "./core";

export * from "./adapters";
export * from "./core";

const debug = require("debug")("jrpc:client");

/**
 * JSONRPC 2.0 NodeJS Client written in TypeScript
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 *
 * @example
 * const clientInstance = new JRPCClient(new HttpAdapter({ port: 3000 }));
 * await clientInstance.start();
 */
export class JRPCClient {
  constructor(protected readonly adapter: AdapterAbstract<TypeMethodParam>) {}

  /**
   * Call Batch Request
   *
   * With this function, you can batch call methods in the JSONRPC client.
   *
   * @example
   *   const batchResponse = await clientInstance.call([
   *     { id: 1, jsonrpc: "2.0", method: "foo", params: ["bar", "baz"] },
   *     { id: 2, jsonrpc: "2.0", method: "bar", params: ["bar", "baz"] },
   *     { jsonrpc: "2.0", method: "notification", params: ["bar", "baz"] }, // Notification request does not return value
   *   ]);
   *   console.log(batchResponse);
   *   // [
   *   //   { id: 1, jsonrpc: "2.0", response: "foo response" },
   *   //   { id: 2, jsonrpc: "2.0", response: "bar response" },
   *   // ]
   * @param {object[]} body bulk request body object
   *
   * @return {Promise} Returns responses in jsonrpc response object array.
   */
  call<
    TData = any,
    TParam extends TypeMethodParam = Array<any>,
    TId extends TypeId = number
  >(
    body: TypeJRPCRequestInterface<TParam, TId>[]
  ): Promise<TypeJRPCResponse<TData, TId>[]>;
  /**
   * Call Request
   *
   * With this function you can call the method on the JSONRPC client.
   *
   * @example
   *   const response = await clientInstance.call({
   *     id: 1,
   *     jsonrpc: "2.0",
   *     method: "foo",
   *     params: ["bar", "baz"],
   *   });
   *   console.log(response);
   *   // { id: 1, jsonrpc: "2.0", response: "foo response" }
   * @param {object} body request body object
   *
   * @return {Promise} Returns responses in jsonrpc response object.
   */
  call<
    TData = any,
    TParam extends TypeMethodParam = Array<any>,
    TId extends TypeId = number
  >(
    body: TypeJRPCRequestInterface<TParam, TId>
  ): Promise<TypeJRPCResponse<TData, TId>>;
  /**
   * Call Request
   *
   * With this function you can call the method(s) on the JSONRPC client.
   *
   * @example
   *  // single call
   *   const response = await clientInstance.call({
   *     id: 1,
   *     jsonrpc: "2.0",
   *     method: "foo",
   *     params: ["bar", "baz"],
   *   });
   *   console.log(response);
   *   // { id: 1, jsonrpc: "2.0", response: "foo response" }
   *
   * @example
   *  // batch call
   *   const batchResponse = await clientInstance.call([
   *     { id: 1, jsonrpc: "2.0", method: "foo", params: ["bar", "baz"] },
   *     { id: 2, jsonrpc: "2.0", method: "bar", params: ["bar", "baz"] },
   *     { jsonrpc: "2.0", method: "notification", params: ["bar", "baz"] }, // Notification request does not return value
   *   ]);
   *   console.log(batchResponse);
   *   // [
   *   //   { id: 1, jsonrpc: "2.0", response: "foo response" },
   *   //   { id: 2, jsonrpc: "2.0", response: "bar response" },
   *   // ]
   * @param {object|object[]} body request body object or request body object array
   *
   * @return {Promise} Returns responses in jsonrpc response object.
   */
  call<
    TData = any,
    TParam extends TypeMethodParam = Array<any>,
    TId extends TypeId = number
  >(
    body: TypeJRPCRequestBody<TParam, TId>
  ): Promise<TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[]> {
    debug("send", body);
    return this.adapter.request<TData, TId>(body) as Promise<
      TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[]
    >;
  }

  /**
   * Notification Request
   *
   * With this function you can declare method(s) in the JSONRPC client.
   *
   * Notification requests do not wait a response from the server.
   *
   * @example
   *  // single call
   *   await clientInstance.call({
   *     jsonrpc: "2.0",
   *     method: "foo",
   *     params: ["bar", "baz"],
   *   });
   *
   * @example
   *  // batch call
   *   await clientInstance.call([
   *     { jsonrpc: "2.0", method: "foo", params: ["bar", "baz"] },
   *     { jsonrpc: "2.0", method: "bar", params: ["bar", "baz"] },
   *     { jsonrpc: "2.0", method: "notification", params: ["bar", "baz"] }, // Notification request does not return value
   *   ]);
   *
   * @param {object} body request body object or request body object array
   *
   * @return {Promise} Returns a void Promise
   */
  notification<TParam extends TypeMethodParam = Array<any>>(
    body: TypeJRPCNotificationBody<TParam>
  ): Promise<void> {
    debug("notification", body);
    return this.adapter.request<any, undefined>(body) as Promise<void>;
  }

  /**
   * Start JRPCClient
   *
   * Connection with the server is established.
   *
   * @example
   * await clientInstance.start();
   * console.log("client connected");
   *
   * @return {Promise} Returns a void Promise
   */
  start() {
    debug("start");
    return this.adapter.connect();
  }

  /**
   * Disconnects from the server.
   *
   * Terminate all connections, remove listeners etc.
   *
   * @example
   * await clientInstance.destroy();
   * console.log("connection close");
   *
   * @return {Promise} Returns a void Promise
   */
  destroy() {
    debug("destroy");
    return this.adapter.destroy();
  }
}
