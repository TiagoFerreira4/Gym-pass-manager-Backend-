import request from 'supertest'
import { app } from '*/../src/app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthUser } from '*/../src/services/utils/test/create-and-auth-user.js'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby gyms', async () => {
    const { token } = await createAndAuthUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'test uhuuu',
        phone: '81123456789',
        latitude: -8.0462089, // NEAR GYM -> Should appear to user
        longitude: -34.8955189,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'test uhuuu',
        phone: '81123456789',
        latitude: -6.7712907, // FAR GYM -> Should not appear to user
        longitude: -37.7977348,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -8.0462089,
        longitude: -34.8955189,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
