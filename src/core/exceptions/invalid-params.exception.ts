import { JRPCExceptionAbstract } from "./abstracts";
import { TypeId } from "../types";
import { JRPCErrorInline } from "../interfaces";
import {
  CONST_RPC_ERROR_CODE_INVALID_PARAMS,
  CONST_RPC_ERROR_MESSAGE_INVALID_PARAMS,
} from "../constants";

/**
 * Invalid Params Exception
 *
 * @extends JRPCExceptionAbstract
 * @licence MIT
 * @author Mahsum UREBE <info@mahsumurebe.com>
 */
export class InvalidParamsException<
  TId extends TypeId = number
> extends JRPCExceptionAbstract<TId> {
  constructor(
    id: TId = undefined,
    error: JRPCErrorInline = {
      code: CONST_RPC_ERROR_CODE_INVALID_PARAMS,
      message: CONST_RPC_ERROR_MESSAGE_INVALID_PARAMS,
    },
    jsonrpc: "2.0" = "2.0"
  ) {
    super(error, id, jsonrpc);
  }
}
