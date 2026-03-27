import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository.js'
import { RegisterService } from '../register.js'

export function makeRegisterService() {
  const usersRespository = new PrismaUserRepository()
  const registerService = new RegisterService(usersRespository)

  return registerService
}
