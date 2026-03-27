import type { CheckIn } from '@prisma/client'
import type { CheckInRepository } from '@/repositories/check-in-repository.js'

interface GetUserMetricsServiceRequest {
  userId: string
}

interface GetUserMetricsServiceReply {
  checkInsCount: number
}

export class GetUserMetricsService {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    userId,
  }: GetUserMetricsServiceRequest): Promise<GetUserMetricsServiceReply> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
