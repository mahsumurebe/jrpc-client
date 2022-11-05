import { JRPCExceptionAbstract } from "./abstracts";
import { TypeId } from "../types";
import { JRPCErrorInline } from "../interfaces";
import {
  CONST_RPC_ERROR_CODE_INTERNAL_ERROR,
  CONST_RPC_ERROR_MESSAGE_INTERNAL_ERROR,
} from "../constants";

/**
 * Internal Error Exception
 *
 * @extends JRPCExceptionAbstract
 * @licence MIT
 * @author Mahsum UREBE <info@mahsumurebe.com>
 */
export class InternalErrorException<
  TId extends TypeId = number
> extends JRPCExceptionAbstract<TId> {
  constructor(
    id: TId = undefined,
    error: JRPCErrorInline = {
      code: CONST_RPC_ERROR_CODE_INTERNAL_ERROR,
      message: CONST_RPC_ERROR_MESSAGE_INTERNAL_ERROR,
    },
    jsonrpc: "2.0" = "2.0"
  ) {
    super(error, id, jsonrpc);
  }
}
