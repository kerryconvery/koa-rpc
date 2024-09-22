import { HeaderGetter } from "../client-sdk-builder";
import { HttpClient } from "./types";

export const createHttpClient = (getCustomHeaders?: HeaderGetter): HttpClient => async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const customHeaders = getCustomHeaders ? await getCustomHeaders() : {}

  return fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      ...customHeaders,
    }
  })
}