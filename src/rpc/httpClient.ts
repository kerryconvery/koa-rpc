import { HeaderGetter } from "../client-sdk-builder";
import { HttpClient } from "./types";

export const createHttpClient = (baseUrl: string, getCustomHeaders?: HeaderGetter): HttpClient => async (route: string, init?: RequestInit): Promise<Response> => {
  const customHeaders = getCustomHeaders ? await getCustomHeaders() : {}

  return fetch(`${baseUrl}${route}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...customHeaders,
    }
  })
}