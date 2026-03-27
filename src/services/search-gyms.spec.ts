import { expect, test, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { inMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository.js'
import { CheckInService } from './checkin.js'
import { SearchGymService } from './search-gyms.js'

let gymsRepository: inMemoryGymsRepository
let sut: SearchGymService

describe('Search Gym Service', () => {
  beforeEach(async () => {
    gymsRepository = new inMemoryGymsRepository()
    sut = new SearchGymService(gymsRepository)
  })

  it('should be able to search gym based on query', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -8.0462089,
      longitude: -34.8955189,
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: '',
      phone: '',
      latitude: -8.0462089,
      longitude: -34.8955189,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to fetch gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: '',
        phone: '',
        latitude: -8.0462089,
        longitude: -34.8955189,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
