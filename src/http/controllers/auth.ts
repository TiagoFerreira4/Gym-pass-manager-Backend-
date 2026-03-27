import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository.js'
import { AuthService } from '@/services/auth.js'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js'

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUserRepository()

    const authService = new AuthService(prismaUsersRepository)

    await authService.execute({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    throw error //TODO: fix me
  }

  return reply.status(200).send()
}
