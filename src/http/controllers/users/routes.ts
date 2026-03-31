import type { FastifyInstance } from 'fastify'
import { register } from './register.js'
import { auth } from './auth.js'
import { profile } from './profile.js'
import { verifyJWT } from '../../middlewares/verify-jwt.js'
import { refresh } from './refresh.js'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', auth)

  app.patch('/token/refresh', refresh)

  /** Authenticated only */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
