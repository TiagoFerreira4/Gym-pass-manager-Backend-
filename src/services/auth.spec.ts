import { expect, test, it, describe, beforeEach } from 'vitest'
import { RegisterService } from './register.js'
import { compare, hash } from 'bcryptjs'
import { inMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { UserAlredyExistsError } from './errors/user-already-exists.js'
import { AuthService } from './auth.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

let usersRepository: inMemoryUsersRepository
let sut: AuthService

describe('Auth Service', () => {
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    sut = new AuthService(usersRepository)
  })

  it('should be able to auth', async () => {
    await usersRepository.create({
      name: 'john doe',
      email: 'john@gmail',
      password_hash: await hash('123123', 6),
    })

    const { user } = await sut.execute({
      email: 'john@gmail',
      password: '123123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should NOT be able to auth with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'john@gmail',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should NOT be able to auth with wrong password', async () => {
    await usersRepository.create({
      name: 'john doe',
      email: 'john@gmail',
      password_hash: await hash('123123', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'john@gmail',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
