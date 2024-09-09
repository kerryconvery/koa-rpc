import { join } from 'path';
import z, { boolean, string } from 'zod';

type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE'

type RouteConfig = {
  method: HttpMethod,
  path: string,
  inputType: z.ZodType,
  outputType: z.ZodType
}

type NamedRoutes = {
  [key: string]: RouteConfig
}

// const createRpcRouter = <T extends RouteConfig>(route: T, handler: (input: z.infer<T[keyof T]['inputType']>) => z.infer<T[keyof T]['outputType']>): { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => z.infer<T[K]['outputType']>} => {
//   const callable: Record<string, any> = {}

//   Object.entries(route).forEach(([routeName, routeConfig]) => {
//     callable[routeName] = handler
//   })


//   return callable as { [K in keyof T]: () => void }
// }

type Result<T> = {
  success: boolean,
  data?: T
}

const addRoute = <T extends RouteConfig>(route: T, handler: (input: z.infer<T['inputType']>) => Promise<Result<z.infer<T['outputType']>>>) => {

}

const createRpcClient = <T extends NamedRoutes, O extends { [K in keyof T]: (input: z.infer<T[K]['inputType']>) => Promise<z.infer<T[K]['outputType']>> }>(
  url: string,
  route: T
): O => {
  const callable: Record<string, unknown> = {}

  Object.entries(route).forEach(([routeName, routeConfig]) => {
    callable[routeName] = async (input: unknown): Promise<Result<unknown>> => {
      await fetch(`${url}${routeConfig.path}`, {
        method: routeConfig.method,
      })

      return Promise.resolve({ success: true, data: 'done'})
    }
  })

  return callable as O
}

type StringRoutes = {
  echo: (input: string) => Promise<Result<string>>,
  join: (input: string[]) => Promise<Result<string>>,
  split: (input: string) => Promise<Result<string[]>>,
  leftPad: (input: { length: number, value: string }) => Promise<Result<string>>,
}

const stringRoutes: NamedRoutes = {
  echo: {
    method: 'POST',
    path: '/echo',
    inputType: z.string(),
    outputType: z.string()
  },
  join: {
    method: 'POST',
    path: '/reverse',
    inputType: z.array(z.string()),
    outputType: z.string()
  },
  split: {
    method: 'POST',
    path: '/reverse',
    inputType: z.string(),
    outputType: z.array(z.string())
  },
  leftPad: {
    method: 'POST',
    path: '/pad',
    inputType: z.object({
      value: z.string(),
      length: z.number()
    }),
    outputType: z.string()
  }
}


const echoHandler = (input: string): Promise<Result<string>> => {
  return Promise.resolve({ success: true, data: input })
}

const joinHandler = (input: string[]): Promise<Result<string>> => {
  return Promise.resolve({ success: true, data: input.join() })
}

addRoute({
  method: 'POST',
  path: '/echo',
  inputType: z.string(),
  outputType: z.string()
}, echoHandler)
addRoute(stringRoutes.join, joinHandler)

const rpcClient = createRpcClient<typeof stringRoutes, StringRoutes>('http://localhost:8080', stringRoutes)

rpcClient.echo('')
rpcClient.join(['q','e','a'])
rpcClient.split('w,f,g,t,w')
rpcClient.leftPad({ length: 5, value: 'pad'})

type RpcClient = typeof rpcClient