import type { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma.js'
import z from 'zod'
import { RegisterService } from '@/services/register.js'
import { PrismaUserRepository } from '@/repositories/prisma-user-repository.js'
import { UserAlredyExistsError } from '@/services/errors/user-already-exists.js'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUserRepository()

    const registerService = new RegisterService(prismaUsersRepository)

    await registerService.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlredyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    throw error //TODO: fix me
  }

  return reply.status(201).send()
}
