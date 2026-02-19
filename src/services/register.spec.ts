import { expect, test, it, describe } from 'vitest'
import { RegisterService } from './register.js'
import { compare } from 'bcryptjs'
import { inMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { UserAlredyExistsError } from './errors/user-already-exists.js'

describe('Register Service', () => {
  it('should be able to register', async () => {
    const usersRepository = new inMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
      name: 'john doe',
      email: 'john@gmail',
      password: '123123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash the user password', async () => {
    const usersRepository = new inMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
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
    const usersRepository = new inMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const email = 'ticarica@gmail'

    const { user } = await registerService.execute({
      name: 'john doe',
      email,
      password: '123123',
    })

    expect(() =>
      registerService.execute({
        name: 'john doe',
        email,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(UserAlredyExistsError)
  })
})
