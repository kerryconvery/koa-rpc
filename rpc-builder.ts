import { z } from 'zod'
import { createRpcBuilder, HttpMethod } from "./rpc";
import { leftPadParams, splitParams } from './types';

const routerDef = {
  echo: {
    method: HttpMethod.POST,
    path: '/echo',
    inputType: z.string(),
    outputType: z.string()
  },
  join: {
    method: HttpMethod.POST,
    path: '/reverse',
    inputType: z.array(z.string()),
    outputType: z.string()
  },
  split: {
    method: HttpMethod.POST,
    path: '/reverse',
    inputType: splitParams,
    outputType: z.array(z.string())
  },
  leftPad: {
    method: HttpMethod.POST,
    path: '/pad',
    inputType: leftPadParams,
    outputType: z.string()
  }
}

export const rpcBuilder = createRpcBuilder('', routerDef)
