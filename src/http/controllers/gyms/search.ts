import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = searchGymsQuerySchema.parse(request.body)

  const searchGymsService = makeSearchGymsService()

  const { gyms } = await searchGymsService.execute({
    query,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
