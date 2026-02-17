import { prisma } from '@/lib/prisma.js';
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

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });
}
