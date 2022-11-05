import { WebSocket } from "ws";
import {
  AdapterAbstract,
  JRPCExceptionAbstract,
  JRPCRequestBodyInterface,
  RequestTimeoutException,
  timeout,
  TypeId,
  TypeJRPCRequestBody,
  TypeJRPCResponse,
  TypeJRPCResponseBody,
  TypeMethodParam,
} from "../../core";
import { WebsocketAdapterConfigInterface } from "./interfaces";

export * from "./interfaces";

const debug = require("debug")("jrpc:client:adapters:websocket");
const debugHandler = require("debug")("jrpc:client:adapters:websocket:handler");

type TypeQueue = {
  [id: string | number]: (value: any) => void;
};

/**
 * WebSocket Client Adapter for JSONRPC Client
 *
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 *
 * @example
 *   // Create adapter for WS Connection
 *   const adapter = new WebSocket({
 *     schema: "ws",
 *     hostname: "localhost",
 *     port: 3000,
 *   });
 *
 * @example
 *   // Create adapter for WSs Connection
 *   const adapter = new WebSocket({
 *     schema: "wss",
 *     hostname: "foo.bar",
 *     port: 443,
 *   });
 */
export class WebsocketAdapter<
  TParam extends TypeMethodParam = Array<any>
> extends AdapterAbstract<TParam> {
  /**
   * WebSocket handler
   *
   * @type {WebSocket}
   * @protected
   */
  protected handler: WebSocket;

  protected requestQueue: TypeQueue = {};

  constructor(protected readonly config: WebsocketAdapterConfigInterface) {
    super();
    debug("initialize");
    this.config = {
      schema: "ws",
      pathname: "/",
      port: 80,
      timeout: 10 * 1000,
      ...(this.config ?? {}),
    } as WebsocketAdapterConfigInterface;
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
    this.handler.send(JSON.stringify(body));
    return this.processRequest<TData, TId>(body);
  }

  /**
   * Connect to server
   *
   * @return {Promise} Returns a void Promise
   */
  connect(): Promise<void> {
    debug("create websocket handler");
    const url = new URL(`${this.config.schema}://${this.config.hostname}`);
    url.pathname = this.config.pathname ?? "/";
    url.port = this.config.port.toString();
    let openFn: () => void;
    let errFn: (err: Error) => void;
    return new Promise<void>((resolve, reject) => {
      debug("connecting to", url.toString());
      this.handler = new WebSocket(url.toString());
      openFn = () => {
        debugHandler("websocket open");
        resolve();
      };
      errFn = (err) => {
        debugHandler("websocket err");
        reject(err);
      };
      this.handler.on("open", openFn);
      this.handler.on("error", errFn);
      this.handler.on("close", (code, reason) => {
        debugHandler(
          `websocket close with ${code} error code "${reason.toString()}"`
        );
      });
      this.handler.on("error", (err) => {
        debugHandler("websocket error", err);
      });
      this.handler.on("message", (data) => {
        const body = data.toString();
        debugHandler("websocket new response", body);
        this.processMessage(body);
      });
    }).finally(() => {
      debug("remove listener");
      this.handler.removeListener("open", openFn);
      this.handler.removeListener("error", errFn);
    });
  }

  private processRequest<TData = any, TId extends TypeId = number>(
    body: TypeJRPCRequestBody<TParam, TId>
  ): Promise<
    TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[] | void
  > {
    let waitForResponse: boolean;
    if (Array.isArray(body)) {
      waitForResponse = body.some((item) => "id" in item && item.id !== null);
    } else {
      waitForResponse = "id" in body && body.id !== null;
    }
    if (waitForResponse) {
      let id: number | string;
      if (Array.isArray(body)) {
        const first = body.find(
          (item) => "id" in item
        ) as JRPCRequestBodyInterface<TParam, TId>;
        id = first.id;
      } else {
        id = (body as JRPCRequestBodyInterface<TParam, TId>).id;
      }
      // Request
      return timeout(
        this.config.timeout,
        new Promise<
          TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[]
        >((resolve) => {
          this.requestQueue[id] = resolve;
        }).finally(() => {
          delete this.requestQueue[id];
        }),
        new RequestTimeoutException()
      );
    }
    return Promise.resolve();
  }

  private processMessage<TData = any, TId extends TypeId = number>(
    data: string
  ) {
    debug("processing message", data);
    let responseData: TypeJRPCResponseBody<TData, TId>;
    try {
      responseData = JSON.parse(data.toString()) as any;
    } catch (e) {
      debug("an error occurred while response body", responseData);
      return;
    }

    let queueResolver: TypeQueue[any];
    if (Array.isArray(responseData)) {
      const first = responseData.find((responseItem) => {
        if ("id" in responseData) {
          return this.requestQueue[responseItem.id];
        }
        return false;
      });
      queueResolver = this.requestQueue[first.id];
    } else {
      queueResolver = this.requestQueue[responseData.id];
    }
    if (queueResolver) {
      debug(`parse data ${JSON.stringify(responseData)}`);
      const res = this.parseData<TData, TId>(responseData);
      debug(
        `response ${
          res instanceof JRPCExceptionAbstract
            ? res.toString()
            : JSON.stringify(res)
        }`
      );
      queueResolver(res);
    }
  }

  /**
   * Destroy server connection
   *
   * @return {Promise} Returns a void Promise
   */
  destroy(): Promise<void> | void {
    debug("terminating websocket connection");
    let closeFn: () => void;
    let errorFn: (error: Error) => void;
    return new Promise<void>((resolve, reject) => {
      closeFn = () => {
        debug("websocket terminated");
        resolve();
      };
      errorFn = (error: Error) => {
        debugHandler("websocket error", error);
        reject(error);
      };
      this.handler.on("close", closeFn);
      this.handler.on("error", errorFn);
      this.handler.terminate();
    }).finally(() => {
      this.handler?.removeListener("close", closeFn);
      this.handler?.removeListener("error", errorFn);
    });
  }
}
