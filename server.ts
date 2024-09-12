import { initTRPC } from '@trpc/server';
import { createTRPCClient, httpBatchLink  } from '@trpc/client'
import z from 'zod'
import rpcClient from 'koa-rpc'

// const t = initTRPC.create()

// const appRouter = t.router({
//   hello: t.procedure
//     .input(z.string())
//     .query(() => {

//     })
// })

// console.log('appRouter', appRouter)

// const trpc = createTRPCClient<typeof appRouter>({
//   links: [
//     httpBatchLink({
//       url: 'http://localhost:3000',
//     }),
//   ],
// })

rpcClient.echo('').then(result => console.log(result))