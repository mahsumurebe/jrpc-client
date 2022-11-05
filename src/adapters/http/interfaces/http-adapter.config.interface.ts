/**
 * HTTP Adapter Configuration
 *
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @interface
 */
export interface HttpAdapterConfigInterface {
  /**
   * Schema
   *
   * @default http
   * @type {string}
   */
  schema?: "http" | "https";
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
   * @default 10_000
   * @type {?number}
   */
  timeout?: number;
}
