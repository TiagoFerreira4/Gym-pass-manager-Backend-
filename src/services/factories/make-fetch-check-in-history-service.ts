import { FetchUserCheckInsHistoryService } from '../fetch-user-check-ins-history.js'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository.js'

export function makeFetchCheckInsHistoryService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryService(checkInsRepository)

  return useCase
}
