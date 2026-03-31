import fastify from 'fastify'
import { register } from './http/controllers/users/register.js'
import { usersRoutes } from './http/controllers/users/routes.js'
import { error } from 'node:console'
import { ZodError } from 'zod'
import { env } from './env/index.js'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes.js'
import { checkInsRoutes } from './http/controllers/check-ins/routes.js'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, {
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({
    message: 'internal error',
  })
})
