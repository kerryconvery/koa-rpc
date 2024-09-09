import { z } from 'zod';
import { HttpMethod, Result, Route, RouterConfig } from './types';

export const createRpcClient = <T extends RouterConfig>(
  url: string,
  route: T
): { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<z.infer<T[K]['outputType']>>} => {
  const callable: Record<string, unknown> = {}

  Object.entries(route).forEach(([routeName, routeConfig]) => {
    if (routeConfig.method === HttpMethod.POST) {
      callable[routeName] = buildPostMethod(url, routeConfig)
    }
  })

  return callable as { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<z.infer<T[K]['outputType']>> }
}

type RouteMethod<I extends z.ZodType, O extends z.ZodType> = (input: z.infer<I>) => Promise<Result<z.infer<O>>>;

const buildPostMethod = (url: string, routeConfig: Route): RouteMethod<typeof routeConfig.inputType, typeof routeConfig.outputType> => {
  return async (input: z.infer<typeof routeConfig.inputType>): Promise<Result<z.infer<typeof routeConfig.outputType>>> => {
      const parsedInput = routeConfig.inputType.safeParse(input);

      if (parsedInput.success) {
        await fetch(`${url}${routeConfig.path}`, {
          method: 'POST',
          body: parsedInput.data
        })

        return { success: true, data: 'done'}
      }

      return { success: false }
  }
}