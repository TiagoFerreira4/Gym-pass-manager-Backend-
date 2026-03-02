import { expect, test, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { inMemoryCheckInRepository } from '../repositories/in-memory/in-memory-checkins-repository.js'
import { CheckInService } from './checkin.js'

let checkInRepository: inMemoryCheckInRepository
let sut: CheckInService

describe('Check in Service', () => {
  beforeEach(() => {
    checkInRepository = new inMemoryCheckInRepository()
    sut = new CheckInService(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should NOT be able to check in twice on the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
    })

    await expect(() =>
      sut.execute({
        userId: 'userId-01',
        gymId: 'gymID-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice BUT in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
    })

    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
