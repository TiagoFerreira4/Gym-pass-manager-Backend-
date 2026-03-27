import { expect, test, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { inMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository.js'
import { CheckInService } from './checkin.js'
import { FetchNearbyGymService } from './fetch-nearby-gyms.js'

let gymsRepository: inMemoryGymsRepository
let sut: FetchNearbyGymService

describe('fetch nearby gym Service', () => {
  beforeEach(async () => {
    gymsRepository = new inMemoryGymsRepository()
    sut = new FetchNearbyGymService(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -8.0462089,
      longitude: -34.8955189,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: -6.7712907,
      longitude: -37.7977348,
    })

    const { gyms } = await sut.execute({
      userLatitude: -8.0462089,
      userLongitude: -34.8955189,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
