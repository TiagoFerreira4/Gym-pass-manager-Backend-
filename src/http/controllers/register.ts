import type { FastifyRequest, FastifyReply } from 'fastify';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma.js';
import z from 'zod';
import { registerSerivce } from '@/services/register.js';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    await registerSerivce({
      name,
      email,
      password,
    });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
