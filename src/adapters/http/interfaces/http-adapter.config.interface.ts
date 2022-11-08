import { ConfigBaseInterface } from "../../../core";

/**
 * HTTP Adapter Configuration
 *
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @interface
 */
export interface HttpAdapterConfigInterface extends ConfigBaseInterface {
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
