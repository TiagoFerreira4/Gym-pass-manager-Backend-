import { expect, test, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { inMemoryCheckInRepository } from '../repositories/in-memory/in-memory-checkins-repository.js'
import { CheckInService } from './checkin.js'
import { GetUserMetricsService } from './get-user-metrics.js'

let checkInRepository: inMemoryCheckInRepository
let sut: GetUserMetricsService

describe('Get User Metrics Service', () => {
  beforeEach(async () => {
    checkInRepository = new inMemoryCheckInRepository()
    sut = new GetUserMetricsService(checkInRepository)
  })

  it('should be able to get user check-ins count from metrics', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
