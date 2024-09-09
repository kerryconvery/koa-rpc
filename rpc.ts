import z from 'zod';

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

export const createRpcBuilder = <T extends RouterConfig>(
  url: string,
  route: T
) => {
  const routes: T = route

  return {
    createRpcClient: (): { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<z.infer<T[K]['outputType']>>} => {
      const callable: Record<string, unknown> = {}
    
      Object.entries(routes).forEach(([routeName, routeConfig]) => {
        callable[routeName] = async (input: unknown): Promise<Result<unknown>> => {
          const parsedInput = routeConfig.inputType.safeParse(input);

          if (parsedInput.success) {
            await fetch(`${url}${routeConfig.path}`, {
              method: HttpMethod[routeConfig.method],
              body: parsedInput.data
            })
      
            return { success: true, data: 'done'}
          }

          return { success: false }
        }
      })
    
      return callable as { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<z.infer<T[K]['outputType']>> }
    }
  }
}
