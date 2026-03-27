import type { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'
import { compare } from 'bcryptjs'
import type { CheckIn, User } from '@prisma/client'
import type { CheckInRepository } from '@/repositories/check-in-repository.js'
import type { GymsRepository } from '@/repositories/gym-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { getDistanceBetweenCordinates } from './utils/get-distance-between-two-coordinates.js'
import { MaxDistanceError } from './errors/max-distance-error.js'
import { MaxCheckInsError } from './errors/max-number-of-check-ins-error.js'

interface CheckInServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInServiceReply {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceReply> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checInOnSameDay = await this.checkInsRepository.findByIdOnSameDate(
      userId,
      new Date(),
    )

    if (checInOnSameDay) {
      throw new MaxCheckInsError()
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
