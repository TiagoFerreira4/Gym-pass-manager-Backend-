import type { Gym } from '@prisma/client'
import type { GymsRepository } from '@/repositories/gym-repository.js'

interface FetchNearbyGymServiceRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymServiceResponse {
  gyms: Gym[]
}

export class FetchNearbyGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymServiceRequest): Promise<FetchNearbyGymServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
