import Koa, { Context } from "koa";
import bodyParser from "koa-bodyparser";
import { z } from 'zod'
import { buildServerRouter } from "./rpc/server-side";
import { stringRouteDefinition } from './routeDefinition'
import { candidateSchema, echoInputSchema, splitInputSchema } from "./types";

const port = 3000;

const echoHandler = (ctx: Context): void => {
  const parsedResult = echoInputSchema.safeParse(ctx.request.body);

  if (parsedResult.success) {
    ctx.response.body = { value: parsedResult.data.value }
    ctx.response.status = 201;
    return;;
  }

  ctx.response.status = 422
}

const joinHandler = (ctx: Context): void => {
  ctx.response.status = 201;
}

const splitHandler = (ctx: Context): void => {
  const parsedResult = splitInputSchema.safeParse(ctx.request.body);
  
  if (parsedResult.success) {
    ctx.response.body = { value: parsedResult.data.value.split(parsedResult.data.delimiter ?? '') };
    ctx.response.status = 201;
    return;
  }

  ctx.response.status = 422;
}

const leftPadHandler = (ctx: Context): void => {
  ctx.response.status = 201;
}

const sortHandler = (ctx: Context): void => {
  ctx.response.status = 201;
}

const getCandidateHandler = (ctx: Context): void => {
  ctx.response.body = {
    candidateId: ctx.params.candidateId,
    firstName: 'Sponge Bob',
    lastName: 'Squarepantz',
    emailAddress: 'squarepantz@gmail.com'
  }

  ctx.response.status = 200;
}

const updateCandidateHandler = (ctx: Context): void => {
  const candidateId = ctx.params.candidateId;
  const parseResult = candidateSchema.safeParse(ctx.request.body);

  ctx.response.status = parseResult.success ? 200 : 422;
}

const router = buildServerRouter({
  routes: stringRouteDefinition,
  routeHandlers: {
    echo: echoHandler,
    join: joinHandler,
    split: splitHandler,
    leftPad: leftPadHandler,
    sort: sortHandler,
  }
});

const app = new Koa();

app.use(bodyParser({ enableTypes: ['json'] }))
app.use(router.routes());

app.listen(port, () => {
  console.log('Listening on port:', port)
})