import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository.js'
import { AuthService } from '../auth.js'
import { GetUserProfileService } from '../get-user-profile.js'

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUserRepository()
  const useCase = new GetUserProfileService(usersRepository)

  return useCase
}
