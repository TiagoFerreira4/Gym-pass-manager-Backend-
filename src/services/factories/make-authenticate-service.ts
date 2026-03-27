import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository.js'
import { AuthService } from '../auth.js'

export function makeAuthenticateService() {
  const usersRepository = new PrismaUserRepository()
  const authenticateService = new AuthService(usersRepository)

  return authenticateService
}
