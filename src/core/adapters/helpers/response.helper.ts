import { TypeId, TypeJRPCResponse, TypeJRPCResponseBody } from "../../types";
import { getErrorInstanceFrom } from "../../exceptions/helpers/response.helper";

/**
 * Parse response data
 *
 * @param {object|object[]} data Response Data
 * @protected
 * @return Promise Returns the smoothed output. If the return
 * value(s) is an error object, it converts to an error class.
 */
export function parse<TData = any, TId extends TypeId = number>(
  data: TypeJRPCResponseBody<TData, TId>
): TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[] {
  if (Array.isArray(data)) {
    return data.map((item) => parse<TData, TId>(item)).flat();
  }
  if ("error" in data) {
    return getErrorInstanceFrom(data);
  }
  return data;
}
