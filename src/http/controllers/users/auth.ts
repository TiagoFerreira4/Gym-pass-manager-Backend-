import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository.js'
import { AuthService } from '@/services/auth.js'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service.js'

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authBodySchema.parse(request.body)

  try {
    const authService = makeAuthenticateService()

    const { user } = await authService.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error //TODO: fix me
  }
}
