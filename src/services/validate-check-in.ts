import type { CheckIn, User } from '@prisma/client'
import type { CheckInRepository } from '@/repositories/check-in-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface ValidateCheckInServiceRequest {
  checkinId: string
}

interface ValidateCheckInServiceReply {
  checkIn: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    checkinId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceReply> {
    const checkIn = await this.checkInsRepository.findById(checkinId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
