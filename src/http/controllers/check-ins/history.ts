import { makeFetchCheckInsHistoryService } from '@/services/factories/make-fetch-check-in-history-service.js'
import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInHistoryService = makeFetchCheckInsHistoryService()

  const { checkIns } = await fetchUserCheckInHistoryService.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
