import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { makeCheckInService } from '@/services/factories/make-check-in-service.js'
import { makeValidateCheckInService } from '@/services/factories/make-validate-check-in-service.js'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInService = makeValidateCheckInService()

  await validateCheckInService.execute({
    checkinId: checkInId,
  })

  return reply.status(204).send()
}
