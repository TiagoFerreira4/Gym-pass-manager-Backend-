import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { makeCheckInService } from '@/services/factories/make-check-in-service.js'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  try {
    const checkInService = makeCheckInService()

    await checkInService.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    })
  } catch (error) {
    throw error //TODO: fix me
  }

  return reply.status(201).send()
}
