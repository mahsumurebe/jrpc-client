// noinspection JSUnusedGlobalSymbols

import * as URL from "url";
import fetch, { RequestInit } from "node-fetch";
import { HttpAdapterConfigInterface } from "./interfaces";
import {
  AdapterAbstract,
  RequestTimeoutException,
  TypeId,
  TypeJRPCRequestBody,
  TypeJRPCResponse,
  TypeJRPCResponseBody,
  TypeMethodParam,
  timeout,
  parse,
} from "../../core";
import { WebsocketAdapterConfigInterface } from "../websocket";

const debug = require("debug")("jrpc:client:adapters:http");

export * from "./interfaces";

/**
 * HTTP Client Adapter for JSONRPC Client
 *
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 *
 * @example
 *   // Create adapter for HTTP Connection
 *   const adapter = new HttpAdapter({
 *     protocol: "http",
 *     hostname: "localhost",
 *     port: 3000,
 *   });
 *
 * @example
 *   // Create adapter for HTTPs Connection
 *   const adapter = new HttpAdapter({
 *     protocol: "https",
 *     hostname: "foo.bar",
 *     port: 443,
 *   });
 */
export class HttpAdapter<
  TParam extends TypeMethodParam = Array<any>
> extends AdapterAbstract<TParam> {
  /**
   * Fetch config
   *
   * @private
   */
  private readonly fetchConfig: RequestInit;

  constructor(
    protected readonly url: string,
    protected readonly config?: HttpAdapterConfigInterface
  ) {
    super();
    debug("initialize");
    this.config = {
      timeout: 10 * 1000,
      parser: parse,
      ...(this.config ?? {}),
    } as WebsocketAdapterConfigInterface;

    const parsedUrl = URL.parse(this.url);

    if (["wss", "wss"].indexOf(parsedUrl.protocol) > -1) {
      throw new Error(`${parsedUrl.protocol} does not supported.`);
    }

    const headers = { ...this.config.headers };
    const headerKeys = Object.keys(headers);
    if (
      headerKeys.length === 0 ||
      headerKeys.some((key) => key.toLowerCase() !== "content-type")
    ) {
      headers["Content-Type"] = "application/json";
    }
    this.fetchConfig = {
      headers,
      method: "POST",
    };
  }

  /**
   * Request to server
   *
   * @param {object|object[]} body
   *
   * @abstract
   * @return Promise Returns the smoothed response output.
   */
  request<TData = any, TId extends TypeId = number>(
    body: TypeJRPCRequestBody<TParam, TId>
  ): Promise<
    TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[] | void
  > {
    const init = {
      body: JSON.stringify(body),
      ...this.fetchConfig,
    };
    debug("new request", init, "body", body);
    //       timeout: this.config.timeout ?? 10 * 1000,
    return timeout(
      this.config.timeout,
      fetch(this.url, init).then(async (response) => {
        if (response.status === 204) {
          // notification request
          return Promise.resolve();
        }
        const jsonObject: TypeJRPCResponseBody<TData, TId> =
          await response.json();
        debug("parse data", jsonObject);
        const res = this.config.parser<TData, TId>(jsonObject);

        debug("response", res);
        return res;
      }),
      new RequestTimeoutException()
    );
  }

  /**
   * Connect to server
   *
   * @return {Promise} Returns a void Promise
   */
  connect(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Destroy server connection
   *
   * @return {Promise} Returns a void Promise
   */
  destroy(): Promise<void> | void {}
}
