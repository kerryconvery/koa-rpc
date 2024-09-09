import { z } from 'zod';

export enum HttpMethod {
  'GET',
  'POST',
  'PUT',
  'DELETE'
}

export type Route = {
  method: HttpMethod
  path: string,
  inputType: z.ZodType,
  outputType: z.ZodType
}
export type RouterConfig = {
  [key: string]: Route
}

export type Result<T> = {
  success: boolean,
  data?: T
}
