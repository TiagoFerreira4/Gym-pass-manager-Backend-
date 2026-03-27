import { FetchNearbyGymService } from '../fetch-nearby-gyms.js'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'

export function makeFetchNearbyGymService() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymService(gymsRepository)

  return useCase
}
