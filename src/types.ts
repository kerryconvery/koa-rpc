import { z } from 'zod'

export const echoInputSchema = z.object({
  value: z.string()
})

export const joinInputSchema = z.object({
  value: z.array(z.string())
})

export const leftPadInputSchema = z.object({
  value: z.string(),
  length: z.number()
})

export const splitInputSchema = z.object({
  value: z.string(),
  delimiter: z.string().optional().nullable()
})

export const sortInputSchema = z.object({
  value: z.array(z.number()),
  direction: z.enum(['ASC', 'DESC'])
})

export const candidateOutputSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string(),
})

export type CandidateOutput = z.infer<typeof candidateOutputSchema>