import type { PrismaUserRepository } from '@/repositories/prisma-user-repository.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'
import { compare } from 'bcryptjs'
import type { CheckIn, User } from '@prisma/client'
import type { CheckInRepository } from '@/repositories/check-in-repository.js'

interface CheckInServiceRequest {
  userId: string
  gymId: string
}

interface CheckInServiceReply {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInServiceRequest): Promise<CheckInServiceReply> {
    const checInOnSameDay = await this.checkInsRepository.findByIdOnSameDate(
      userId,
      new Date(),
    )

    if (checInOnSameDay) {
      throw new Error()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
