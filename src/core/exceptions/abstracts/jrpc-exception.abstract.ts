import { TypeId } from "../../types";
import {
  JRPCErrorInline,
  JRPCErrorResponseBodyInterface,
} from "../../interfaces";
import { JrpcClientBaseException } from "./jrpc-client-base.exception";

/**
 * JRPC Response Exception Abstract
 *
 * @abstract
 * @licence MIT
 * @author Mahsum UREBE <info@mahsumurebe.com>
 * @protected
 */
export abstract class JRPCExceptionAbstract<
  TId extends TypeId = number
> extends JrpcClientBaseException {
  protected constructor(
    protected readonly error: JRPCErrorInline,
    protected readonly id: TId = undefined,
    protected readonly jsonrpc: "2.0" = "2.0"
  ) {
    super(error?.message);
  }

  /**
   * Error to Object
   *
   * @return {object}
   */

  toObject(): JRPCErrorResponseBodyInterface<TId> {
    return {
      id: this.id,
      jsonrpc: this.jsonrpc,
      error: this.error,
    };
  }

  /**
   * Error to JSON String
   */
  toJSON() {
    return JSON.stringify(this.toObject());
  }

  /**
   * Stringify error
   *
   * @return {string}
   */
  toString() {
    let data: string = "";
    if (this.error.data) {
      if (
        Array.isArray(this.error.data) ||
        typeof this.error.data === "object"
      ) {
        data = `data ${JSON.stringify(this.error.data)}`;
      } else {
        data = `data ${this.error.data.toString()}`;
      }
    }
    return `RPC Error: Code ${this.error.code} ${this.message}${data}`;
  }
}
