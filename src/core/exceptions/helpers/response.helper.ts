import {
  CONST_RPC_ERROR_CODE_INTERNAL_ERROR,
  CONST_RPC_ERROR_CODE_INVALID_PARAMS,
  CONST_RPC_ERROR_CODE_INVALID_REQUEST,
  CONST_RPC_ERROR_CODE_METHOD_NOT_FOUND,
  CONST_RPC_ERROR_CODE_PARSE_ERROR,
} from "../../constants";
import { InvalidRequestException } from "../invalid-request.exception";
import { ParseErrorException } from "../parse-error.exception";
import { JRPCExceptionAbstract } from "../abstracts";
import { TypeId } from "../../types";
import { MethodNotFoundException } from "../method-not-found.exception";
import { InvalidParamsException } from "../invalid-params.exception";
import { InternalErrorException } from "../internal-error.exception";
import { ServerErrorException } from "../server-error.exception";
import { JRPCErrorResponseBodyInterface } from "../../interfaces";

/**
 * Get Error Instance From Body
 *
 * @param {object} body Body
 *
 * @return {JRPCExceptionAbstract}
 */
export function getErrorInstanceFrom<TId extends TypeId = number>(
  body: JRPCErrorResponseBodyInterface<TId>
): JRPCExceptionAbstract<TId> {
  switch (body.error.code) {
    case CONST_RPC_ERROR_CODE_PARSE_ERROR:
      return new ParseErrorException(body.id, body.error, body.jsonrpc);
    case CONST_RPC_ERROR_CODE_INVALID_REQUEST:
      return new InvalidRequestException(body.id, body.error, body.jsonrpc);
    case CONST_RPC_ERROR_CODE_METHOD_NOT_FOUND:
      return new MethodNotFoundException(body.id, body.error, body.jsonrpc);
    case CONST_RPC_ERROR_CODE_INVALID_PARAMS:
      return new InvalidParamsException(body.id, body.error, body.jsonrpc);
    case CONST_RPC_ERROR_CODE_INTERNAL_ERROR:
      return new InternalErrorException(body.id, body.error, body.jsonrpc);

    default:
      return new ServerErrorException(body.id, body.error, body.jsonrpc);
  }
}
