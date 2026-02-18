import type { FastifyRequest, FastifyReply } from 'fastify';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma.js';
import z from 'zod';
import { RegisterService } from '@/services/register.js';
import { PrismaUserRepository } from '@/repositories/prisma-user-repository.js';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUserRepository();

    const registerService = new RegisterService(prismaUsersRepository);

    await registerService.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
