import { expect, test, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { inMemoryCheckInRepository } from '../repositories/in-memory/in-memory-checkins-repository.js'
import { CheckInService } from './checkin.js'
import { ValidateCheckInService } from './validate-check-in.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error.js'

let checkInRepository: inMemoryCheckInRepository
let sut: ValidateCheckInService

// -8.0462089,-34.8955189,
// -7.9465187,-34.9122118,

describe('Validate Check in Service', () => {
  beforeEach(async () => {
    checkInRepository = new inMemoryCheckInRepository()

    sut = new ValidateCheckInService(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: '01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkinId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0]?.validated_at).toEqual(expect.any(Date))
  })

  it('should NOT be able to validate a non existing check in', async () => {
    await expect(() =>
      sut.execute({
        checkinId: 'Non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should NOT be able to validate the check-in afeter 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInRepository.create({
      gym_id: '01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkinId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
