import { JRPCObjectBase } from "./jrpc-object.base";
import { TypeId } from "../types";

/**
 * Error Inline Object Interface
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @interface
 */
export interface JRPCErrorInline {
  /**
   * RPC Error Code
   *
   * @type {number}
   */
  code: number;
  /**
   * RPC Error Message
   *
   * @type {string}
   */
  message: string;
  /**
   * Extra Data
   *
   * @type {?any}
   */
  data?: any;
}

/**
 * Error Object Interface
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @interface
 */
export interface JRPCErrorResponseBodyInterface<TId extends TypeId = number>
  extends JRPCObjectBase<TId> {
  /**
   * ID
   *
   * @type {number|string}
   */
  id: TId;

  /**
   * Error Object
   *
   * @type {JRPCErrorInline}
   */
  error: JRPCErrorInline;
}
