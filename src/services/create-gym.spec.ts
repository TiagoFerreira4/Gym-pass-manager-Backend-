import { expect, test, it, describe, beforeEach } from 'vitest'
import { inMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository.js'
import { CreateGymService } from './create-gym.js'

let gymsRepository: inMemoryGymsRepository
let sut: CreateGymService

describe('Create Gym Service', () => {
  beforeEach(() => {
    gymsRepository = new inMemoryGymsRepository()
    sut = new CreateGymService(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'test-gym',
      description: '',
      phone: '',
      latitude: -8.0462089,
      longitude: -34.8955189,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
