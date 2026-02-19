import type { FastifyInstance } from 'fastify'
import { register } from './controllers/register.js'
import { auth } from './controllers/auth.js'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.post('/sessions', auth)
}
