import { expect, test, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { inMemoryCheckInRepository } from '../repositories/in-memory/in-memory-checkins-repository.js'
import { CheckInService } from './checkin.js'
import { inMemoryGymsRepository } from '../repositories/in-memory/in-memory-gym-repository.js'
import { Decimal } from '@prisma/client/runtime/library'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'
import { MaxCheckInsError } from './errors/max-number-of-check-ins-error.js'
import { MaxDistanceError } from './errors/max-distance-error.js'

let checkInRepository: inMemoryCheckInRepository
let gymsRepository: inMemoryGymsRepository
let sut: CheckInService

// -8.0462089,-34.8955189,
// -7.9465187,-34.9122118,

describe('Check in Service', () => {
  beforeEach(async () => {
    checkInRepository = new inMemoryCheckInRepository()
    gymsRepository = new inMemoryGymsRepository()
    sut = new CheckInService(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gymID-01',
      title: 'Academia-Testes',
      description: '',
      phone: '',
      latitude: new Decimal(-8.0462089),
      longitude: new Decimal(-34.8955189),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
      userLatitude: -8.0462089,
      userLongitude: -34.8955189,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should NOT be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
      userLatitude: -8.0462089,
      userLongitude: -34.8955189,
    })

    await expect(() =>
      sut.execute({
        userId: 'userId-01',
        gymId: 'gymID-01',
        userLatitude: -8.0462089,
        userLongitude: -34.8955189,
      }),
    ).rejects.toBeInstanceOf(MaxCheckInsError)
  })

  it('should be able to check in twice BUT in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
      userLatitude: -8.0462089,
      userLongitude: -34.8955189,
    })

    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
      userLatitude: -8.0462089,
      userLongitude: -34.8955189,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should NOT be able to check-in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gymID-02',
      title: 'Academia-Testes2',
      description: '',
      phone: '',
      latitude: new Decimal(-7.9465187),
      longitude: new Decimal(-34.9122118),
    })

    await expect(() =>
      sut.execute({
        userId: 'userId-01',
        gymId: 'gymID-02',
        userLatitude: -8.0462089,
        userLongitude: -34.8955189,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
