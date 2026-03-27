import { SearchGymService } from '../search-gyms.js'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'

export function makeSearchGymsService() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymService(gymsRepository)

  return useCase
}
