import type { FastifyInstance } from 'fastify'
import { register } from './controllers/register.js'
import { auth } from './controllers/auth.js'
import { profile } from './controllers/profile.js'
import { verifyJWT } from './middlewares/verify-jwt.js'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', auth)
  /** Authenticated only */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
