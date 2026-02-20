import { expect, test, it, describe, beforeEach } from 'vitest'
import { compare, hash } from 'bcryptjs'
import { inMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository.js'
import { GetUserProfileService } from './get-user-profile.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

let usersRepository: inMemoryUsersRepository
let sut: GetUserProfileService

describe('Get User Profile Service', () => {
  beforeEach(() => {
    usersRepository = new inMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'john doe',
      email: 'john@gmail',
      password_hash: await hash('123123', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('john doe')
  })

  it('should NOT be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'Non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
