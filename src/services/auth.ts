import type { PrismaUserRepository } from '@/repositories/prisma-user-repository.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'
import { compare } from 'bcryptjs'
import type { User } from '@prisma/client'

interface AuthServiceRequest {
  email: string
  password: string
}

interface AuthServiceReply {
  user: User
}

export class AuthService {
  constructor(private usersRespository: PrismaUserRepository) {}

  async execute({
    email,
    password,
  }: AuthServiceRequest): Promise<AuthServiceReply> {
    const user = await this.usersRespository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}
