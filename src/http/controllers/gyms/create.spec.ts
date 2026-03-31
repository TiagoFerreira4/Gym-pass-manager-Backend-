import request from 'supertest'
import { app } from '*/../src/app.js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthUser } from '*/../src/services/utils/test/create-and-auth-user.js'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'test uhuuu',
        phone: '81123456789',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toEqual(201)
  })
})
