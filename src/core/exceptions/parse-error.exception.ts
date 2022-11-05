import { JRPCExceptionAbstract } from "./abstracts";
import { TypeId } from "../types";
import { JRPCErrorInline } from "../interfaces";
import {
  CONST_RPC_ERROR_CODE_PARSE_ERROR,
  CONST_RPC_ERROR_MESSAGE_PARSE_ERROR,
} from "../constants";

/**
 * Parse Error Exception
 *
 * @extends JRPCExceptionAbstract
 * @licence MIT
 * @author Mahsum UREBE <info@mahsumurebe.com>
 */
export class ParseErrorException<
  TId extends TypeId = number
> extends JRPCExceptionAbstract<TId> {
  constructor(
    id: TId = undefined,
    error: JRPCErrorInline = {
      code: CONST_RPC_ERROR_CODE_PARSE_ERROR,
      message: CONST_RPC_ERROR_MESSAGE_PARSE_ERROR,
    },
    jsonrpc: "2.0" = "2.0"
  ) {
    super(error, id, jsonrpc);
  }
}
