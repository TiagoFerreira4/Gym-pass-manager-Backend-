import type { UsersRepository } from '@/repositories/users-repository.js'
import { hash } from 'bcryptjs'
import { UserAlredyExistsError } from './errors/user-already-exists.js'
import type { User } from '@prisma/client'
import type { R } from 'node_modules/vitest/dist/chunks/rpc.d.RH3apGEf.js'

interface registerServiceRequest {
  name: string
  email: string
  password: string
}

interface registerServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: registerServiceRequest): Promise<registerServiceResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlredyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
