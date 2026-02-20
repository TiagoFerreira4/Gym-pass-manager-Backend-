import { expect, test, it, describe, beforeEach } from 'vitest'
import { inMemoryCheckInRepository } from '../repositories/in-memory/in-memory-checkins-repository.js'
import { CheckInService } from './checkin.js'

let checkInRepository: inMemoryCheckInRepository
let sut: CheckInService

describe('Check in Service', () => {
  beforeEach(() => {
    checkInRepository = new inMemoryCheckInRepository()
    sut = new CheckInService(checkInRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'userId-01',
      gymId: 'gymID-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
