import type { CheckIn } from '@prisma/client'
import type { CheckInRepository } from '@/repositories/check-in-repository.js'

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryServiceReply {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryServiceRequest): Promise<FetchUserCheckInsHistoryServiceReply> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
