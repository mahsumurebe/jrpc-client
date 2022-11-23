import { JRPCExceptionAbstract } from "./abstracts";
import { TypeId } from "../types";
import { JRPCErrorInline } from "../interfaces";
import {
  CONST_RPC_ERROR_CODE_METHOD_NOT_FOUND,
  CONST_RPC_ERROR_MESSAGE_METHOD_NOT_FOUND,
} from "../constants";

/**
 * Method Not Found Exception
 *
 * @extends JRPCExceptionAbstract
 * @licence MIT
 * @author Mahsum UREBE <info@mahsumurebe.com>
 */
export class MethodNotFoundException<
  TId extends TypeId = number
> extends JRPCExceptionAbstract<TId> {
  constructor(
    id: TId = undefined,
    error: JRPCErrorInline = {
      code: CONST_RPC_ERROR_CODE_METHOD_NOT_FOUND,
      message: CONST_RPC_ERROR_MESSAGE_METHOD_NOT_FOUND,
    },
    jsonrpc: "2.0" = "2.0"
  ) {
    super(error, id, jsonrpc);
  }
}
