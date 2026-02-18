import { prisma } from '@/lib/prisma.js';
import { PrismaUserRepository } from '@/repositories/prisma-user-repository.js';
import { hash } from 'bcryptjs';

interface registerServiceRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerSerivce({
  name,
  email,
  password,
}: registerServiceRequest) {
  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error('email alredy exists');
  }

  const prismaUserRepository = new PrismaUserRepository();

  await prismaUserRepository.create({
    name,
    email,
    password_hash,
  });
}
