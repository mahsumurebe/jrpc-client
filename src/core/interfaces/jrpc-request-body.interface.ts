import { TypeId, TypeMethodParam } from "../types";
import { JRPCObjectBase } from "./jrpc-object.base";

/**
 * JSONRPC Request Body Interface
 *
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @licence MIT
 * @interface
 */
export interface JRPCRequestBodyInterface<
  TParam extends TypeMethodParam = Array<any>,
  TId extends TypeId = number
> extends JRPCObjectBase<TId> {
  /**
   * ID
   *
   *
   * @type {number|string}
   */
  id: TId;

  /**
   * Method Name
   *
   * @type {string}
   */
  method: string;

  /**
   * Method Param values
   *
   * @type {object|array}
   */
  params: TParam;
}
