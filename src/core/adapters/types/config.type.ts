import { TypeId, TypeJRPCResponse, TypeJRPCResponseBody } from "../../types";

export type TypeResponseParserFn = <TData = any, TId extends TypeId = number>(
  data: TypeJRPCResponseBody<TData, TId>
) => TypeJRPCResponse<TData, TId> | TypeJRPCResponse<TData, TId>[];
