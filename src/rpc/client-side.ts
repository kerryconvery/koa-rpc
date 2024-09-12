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
  }
}

const buildGetMethod: RouteBuilder = (url: string, routeConfig: Route): RouteMethod => 
  async (input: z.infer<typeof routeConfig.inputType>): Promise<Result<z.infer<typeof routeConfig.outputType>>> => {
      const parsedInput = routeConfig.inputType.safeParse(input);

      if (parsedInput.success) {
        const response = await fetch(`${url}${routeConfig.path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedInput.data),
        })

        if (response.status !== 201) {
          return { success: false }
        }

        return response.json().then((data) => ({ success: true, data }))
      }

      return { success: false }
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

        if (response.status !== 201) {
          return { success: false }
        }

        return response.json().then((data) => ({ success: true, data }))
      }

      return { success: false }
  }
