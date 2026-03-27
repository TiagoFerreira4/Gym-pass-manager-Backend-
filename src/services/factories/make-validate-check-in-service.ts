import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'
import { ValidateCheckInService } from '../validate-check-in.js'

export function makeValidateCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInService(checkInsRepository)

  return useCase
}
