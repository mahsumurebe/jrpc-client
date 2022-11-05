import { JRPCObjectBase } from "./jrpc-object.base";
import { TypeId } from "../types";

/**
 * JSONRPC Response Body Interface
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @interface
 */
export interface JRPCResponseBodyInterface<
  TData = any,
  TId extends TypeId = number
> extends JRPCObjectBase<TId> {
  /**
   * Result
   *
   * @type {any}
   */
  result: TData;
}
