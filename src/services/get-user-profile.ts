import type { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository.js'
import type { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

interface GetUserProfileServiceRequest {
  userId: string
}

interface GetUserProfileServiceReply {
  user: User
}

export class GetUserProfileService {
  constructor(private usersRespository: PrismaUserRepository) {}

  async execute({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceReply> {
    const user = await this.usersRespository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
