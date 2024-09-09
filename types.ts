import { z } from 'zod'
import { HttpMethod } from './src/types'

export const leftPadParams = z.object({
  value: z.string(),
  length: z.number()
})

export const splitParams = z.object({
  value: z.string(),
  delimiter: z.string().optional().nullable()
})

export const SortDirection = z.enum(['ASC', 'DESC']);

export const routerDef = {
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
  },
  sort: {
    method: HttpMethod.POST,
    path: '/sort',
    inputType: z.object({
      value: z.array(z.number()),
      direction: SortDirection
    }),
    outputType: z.string()
  }
}
