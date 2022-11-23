import { JRPCExceptionAbstract } from "./abstracts";
import { TypeId } from "../types";
import { JRPCErrorInline } from "../interfaces";
import {
  CONST_RPC_ERROR_CODE_INVALID_REQUEST,
  CONST_RPC_ERROR_MESSAGE_INVALID_REQUEST,
} from "../constants";

/**
 * Invalid Request Exception
 *
 * @extends JRPCExceptionAbstract
 * @licence MIT
 * @author Mahsum UREBE <info@mahsumurebe.com>
 */
export class InvalidRequestException<
  TId extends TypeId = number
> extends JRPCExceptionAbstract<TId> {
  constructor(
    id: TId = undefined,
    error: JRPCErrorInline = {
      code: CONST_RPC_ERROR_CODE_INVALID_REQUEST,
      message: CONST_RPC_ERROR_MESSAGE_INVALID_REQUEST,
    },
    jsonrpc: "2.0" = "2.0"
  ) {
    super(error, id, jsonrpc);
  }
}
