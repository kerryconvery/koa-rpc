import { z } from 'zod';

export enum HttpMethod {
  'GET',
  'POST',
  'PUT',
  'DELETE'
}

export type Headers = {
  authorization?: string,
  requestId?: string,
  sessionId?: string,
}

export type Route = {
  method: HttpMethod
  path: string,
  headers?: Headers,
  inputType: z.AnyZodObject,
  outputType: z.AnyZodObject | z.ZodVoid
}
export type RouterConfig = {
  [key: string]: Route
}

export type Result<T> = {
  success: boolean,
  data?: T
}

export type HttpClient = typeof fetch