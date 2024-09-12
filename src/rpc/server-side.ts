import Router from 'koa-router'

import { Route, RouterConfig } from "./types";
import { Context, Next } from 'koa';

export type RouteHandler = (ctx: Context, next: Next) => Promise<void> | void;
export type RouterHandlers<T> = {
  [K in keyof T]: RouteHandler
}

// export const buildServerRouter = <T extends RouterConfig>(routes: T, handlers: { [K in keyof T]: RouteHandler<z.infer<T[K]['outputType']>> } ): Router => {

export const buildServerRouter = <T extends RouterConfig>({routes, routeHandlers }: { routes: T, routeHandlers: RouterHandlers<T> }): Router => {
  const router = new Router();

  Object.entries(routes).forEach(([routeName, route]: [string, Route]) => {
    const handler = routeHandlers[routeName];
    
    router.post(route.path, handler);
  })

  return router;
}
