import { expect, test, it, describe, beforeEach } from 'vitest'
import { RegisterService } from './register.js'
import { compare } from 'bcryptjs'
import { inMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { UserAlredyExistsError } from './errors/user-already-exists.js'
import type { UsersRepository } from '@/repositories/users-repository.js'

let usersRepository: inMemoryUsersRepository
let sut: RegisterService

describe('Register Service', () => {
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'john doe',
      email: 'john@gmail',
      password: '123123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash the user password', async () => {
    const { user } = await sut.execute({
      name: 'john doe',
      email: 'john@gmail',
      password: '123123',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to use duplicate email', async () => {
    const email = 'ticarica@gmail'

    const { user } = await sut.execute({
      name: 'john doe',
      email,
      password: '123123',
    })

    await expect(() =>
      sut.execute({
        name: 'john doe',
        email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(UserAlredyExistsError)
  })
})
