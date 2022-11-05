import {
  JRPCErrorResponseBodyInterface,
  JRPCRequestBodyInterface,
  JRPCResponseBodyInterface,
} from "../interfaces";
import { JRPCExceptionAbstract } from "../exceptions";

export type TypeMethodParam = Array<any> | object;
export type TypeId = string | number | null;

export type TypeJRPCResponseInterface<
  TData = any,
  TId extends TypeId = number
> = JRPCResponseBodyInterface<TData, TId> | JRPCErrorResponseBodyInterface<TId>;

export type TypeJRPCResponseBody<TData = any, TId extends TypeId = number> =
  | TypeJRPCResponseInterface<TData, TId>
  | TypeJRPCResponseInterface<TData, TId>[];

export type TypeJRPCResponse<TData = any, TId extends TypeId = number> =
  | JRPCResponseBodyInterface<TData, TId>
  | JRPCExceptionAbstract<TId>;

export type TypeJRPCNotificationInterface<
  TParam extends TypeMethodParam = Array<any>
> = Omit<JRPCRequestBodyInterface<TParam, undefined>, "id">;
export type TypeJRPCNotificationBody<
  TParam extends TypeMethodParam = Array<any>
> =
  | TypeJRPCNotificationInterface<TParam>
  | TypeJRPCNotificationInterface<TParam>[];

export type TypeJRPCRequestInterface<
  TParam extends TypeMethodParam = Array<any>,
  TId extends TypeId = number
> =
  | JRPCRequestBodyInterface<TParam, TId>
  | TypeJRPCNotificationInterface<TParam>;

export type TypeJRPCRequestBody<
  TParam extends TypeMethodParam = Array<any>,
  TId extends TypeId = number
> =
  | TypeJRPCRequestInterface<TParam, TId>
  | TypeJRPCRequestInterface<TParam, TId>[];
