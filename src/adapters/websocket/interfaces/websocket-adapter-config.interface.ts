/**
 * WebSocket Adapter Configuration
 *
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @interface
 */
export interface WebsocketAdapterConfigInterface {
  /**
   * Schema
   *
   * @default ws
   * @type {string}
   */
  schema?: "ws" | "wss";
  /**
   * Hostname
   *
   * @type {string}
   */
  hostname: string;
  /**
   * Port
   *
   * @default 80
   * @type {?string}
   */
  port?: number;
  /**
   * Pathname
   *
   * @default /
   * @type {?string}
   */
  pathname?: string;
  /**
   * Headers
   *
   * @type {?object}
   */
  headers?: Record<string, string>;

  /**
   * Timeout
   *
   * @default 10000
   * @type {?number}
   */
  timeout?: number;
}
