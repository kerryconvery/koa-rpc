import { z } from 'zod';
import { HttpMethod, Result, Route, RouterConfig } from './types';

export const buildClientSdk = <T extends RouterConfig>(
  url: string,
  route: T
): { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<Result<z.infer<T[K]['outputType']>>>} => {
  const sdkMethods: Record<string, unknown> = {}

  Object.entries(route).forEach(([routeName, routeConfig]) => {
    const routeBuilder = getRouteBuilder(routeConfig.method)

    if (routeBuilder) {
      sdkMethods[routeName] = routeBuilder(url, routeConfig)
    }
  })

  return sdkMethods as { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<Result<z.infer<T[K]['outputType']>>> }
}

type RouteMethod = (input: z.infer<Route['inputType']>) => Promise<Result<z.infer<Route['outputType']>>>;
type RouteBuilder = (url: string, routeConfig: Route) => RouteMethod 

const getRouteBuilder = (httpMethod: HttpMethod): RouteBuilder | undefined => {
  switch(httpMethod) {
    case HttpMethod.POST: {
      return buildPostMethod
    }
    case HttpMethod.GET: {
      return buildGetMethod
    }
    case HttpMethod.PUT: {
      return buildPutMethod
    }
    case HttpMethod.DELETE: {
      return buildDeleteMethod
    }
  }
}

const buildPostMethod: RouteBuilder = (url: string, routeConfig: Route): RouteMethod => 
  async (input: z.infer<typeof routeConfig.inputType>): Promise<Result<z.infer<typeof routeConfig.outputType>>> => {
      const parsedInput = routeConfig.inputType.safeParse(input);

      if (parsedInput.success) {
        const response = await fetch(`${url}${routeConfig.path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedInput.data),
        })

        if (response.status === 201) {
          return response.json().then((data) => ({ success: true, data }))
        }

        return { success: false }
      }

      return { success: false }
  }

const buildGetMethod: RouteBuilder = (url: string, routeConfig: Route): RouteMethod => 
  async (input: z.infer<typeof routeConfig.inputType>): Promise<Result<z.infer<typeof routeConfig.outputType>>> => {
      const parsedInput = routeConfig.inputType.safeParse(input);

      if (parsedInput.success) {
        const [apiUrl] = buildUrl(url, routeConfig.path, parsedInput.data);
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: { 'Accept-Type': 'application/json' },
        })

        if (response.status === 200) {
          return response.json().then((data) => ({ success: true, data }))
        }

        return { success: false }
      }

      return { success: false }
  }

const buildPutMethod: RouteBuilder = (url: string, routeConfig: Route): RouteMethod => 
  async (input: z.infer<typeof routeConfig.inputType>): Promise<Result<z.infer<typeof routeConfig.outputType>>> => {
      const parsedInput = routeConfig.inputType.safeParse(input);

      if (parsedInput.success) {
        const [apiUrl, usedFields] = buildUrl(url, routeConfig.path, parsedInput.data);
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(omit(parsedInput.data, usedFields)),
        })

        if (response.status === 200) {
          return { success: true }
        }

        return { success: false }
      }

      return { success: false }
  }

const buildDeleteMethod: RouteBuilder = (url: string, routeConfig: Route): RouteMethod => 
  async (input: z.infer<typeof routeConfig.inputType>): Promise<Result<z.infer<typeof routeConfig.outputType>>> => {
      const parsedInput = routeConfig.inputType.safeParse(input);

      if (parsedInput.success) {
        const [apiUrl] = buildUrl(url, routeConfig.path, parsedInput.data);
        const response = await fetch(apiUrl, { method: 'DELETE' })

        if (response.status === 204) {
          return { success: true }
        }

        return { success: false }
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