import { z } from 'zod'
import { HttpMethod, RouterConfig } from './rpc/types'
import { splitInputSchema, leftPadInputSchema, sortInputSchema, echoInputSchema, joinInputSchema, candidateOutputSchema } from './types'

export const routeDefinition = {
  echo: {
    method: HttpMethod.POST,
    path: '/echo',
    inputType: echoInputSchema,
    outputType: z.object({ 
      value: z.string()
    })
  },
  join: {
    method: HttpMethod.POST,
    path: '/join',
    inputType: joinInputSchema,
    outputType: z.object({ 
      value: z.string()
    })
  },
  split: {
    method: HttpMethod.POST,
    path: '/split',
    inputType: splitInputSchema,
    outputType: z.object({ 
      value: z.array(z.string())
    })
  },
  leftPad: {
    method: HttpMethod.POST,
    path: '/pad',
    inputType: leftPadInputSchema,
    outputType: z.object({ 
      value: z.string()
    })
  },
  sort: {
    method: HttpMethod.POST,
    path: '/sort',
    inputType: sortInputSchema,
    outputType: z.object({ 
      value: z.string()
    })
  },
  getCandidate: {
    method: HttpMethod.GET,
    path: '/:candidate',
    inputType: z.object({
      candidateId: z.number()
    }),
    outputType: candidateOutputSchema
  }
}
