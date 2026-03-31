import { makeFetchNearbyGymService } from '@/services/factories/make-fetch-nearby-service.js'
import { makeSearchGymsService } from '@/services/factories/make-search-gyms-service.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

export async function nearbyGyms(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body)

  const fetchNearbyGymsService = makeFetchNearbyGymService()

  const { gyms } = await fetchNearbyGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
