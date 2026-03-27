import { CreateGymService } from '../create-gym.js'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository.js'

export function makeCreateGymService() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymService(gymsRepository)

  return useCase
}
