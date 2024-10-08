import { z } from 'zod';
import { HttpMethod, Result, Route, RouterConfig } from './types';

export const buildClientSdk = <T extends RouterConfig>(
  url: string,
  route: T
): { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<Result<z.infer<T[K]['outputType']>>>} => {
  const sdkMethods: Record<string, unknown> = {}

  Object.entries(route).forEach(([routeName, routeConfig]) => {
    const routeMethod = getRouteBuilder(routeConfig.method)

    if (routeMethod) {
      sdkMethods[routeName] = buildRoute(routeMethod, url, routeConfig)
    }
  })

  return sdkMethods as { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<Result<z.infer<T[K]['outputType']>>> }
}

type RouteMethod<I, O> = (apiUrl: string, payload: I) => Promise<Result<O>>

const getRouteBuilder = <I, O>(httpMethod: HttpMethod): RouteMethod<I, O> | undefined => {
  switch(httpMethod) {
    case HttpMethod.POST: {
      return postMethod
    }
    case HttpMethod.GET: {
      return getMethod
    }
    case HttpMethod.PUT: {
      return putMethod
    }
    case HttpMethod.DELETE: {
      return deleteMethod
    }
  }
}

const buildRoute = <I, O>(routeMethod: RouteMethod<I, O>, url: string, routeConfig: Route): (input: I) => Promise<Result<O>> => {
  return async (input: I): Promise<Result<O>> => {
    const parsedInput = routeConfig.inputType.safeParse(input);

    if (parsedInput.success) {
      const [apiUrl, usedFields] = buildUrl(url, routeConfig.path, parsedInput.data);
      const requestData = omit(parsedInput.data, usedFields)

      return routeMethod(apiUrl, requestData as I)
    }

    return { success: false }
  }
}

const postMethod = async <I, O>(apiUrl: string, payload: I): Promise<Result<O>> => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.status === 201) {
    return response.json().then((data) => ({ success: true, data }))
  }

  return { success: false }
}

const getMethod = async <I, O>(apiUrl: string): Promise<Result<O>> => {
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 'Accept-Type': 'application/json' },
  })

  if (response.status === 200) {
    return response.json().then((data) => ({ success: true, data }))
  }

  return { success: false }
}

const putMethod = async <I, O>(apiUrl: string, payload: I): Promise<Result<O>> => {
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.status === 200) {
    return { success: true }
  }

  return { success: false }
}

const deleteMethod = async <I, O>(apiUrl: string): Promise<Result<O>> => {
  const response = await fetch(apiUrl, { method: 'DELETE' })

  if (response.status === 204) {
    return { success: true }
  }

  return { success: false }
}

const buildUrl = (hostUrl: string, route: string, inputData: Record<string, unknown>): [string, string[]] => {
    return Object.entries(inputData).reduce(([replacedUrl, usedFields]: [string, string[]], [parameterName, parameterValue]: [string, any]): [string, string[]] => {
      const newUrl = replacedUrl.replace(`:${parameterName}`, parameterValue);

      if (newUrl !== replacedUrl) {
        return [newUrl, usedFields.concat(parameterName)]
      }

      return [replacedUrl, usedFields]
    }, [`${hostUrl}${route}`, []]);
  }

const omit = (value: Record<string, unknown>, fieldsToOmit: string[]): Record<string, unknown> => {
  return Object.entries(value).reduce((acc: Record<string, unknown>, [key, value]: [string, unknown]): Record<string, unknown> => {
    if (fieldsToOmit.includes(key)) {
      return acc;
    }

    return {
      ...acc,
      [key]: value
    }
  }, {})
}