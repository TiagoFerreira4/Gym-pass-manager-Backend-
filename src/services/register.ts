import type { UsersRepository } from '@/repositories/users-repository.js';
import { hash } from 'bcryptjs';

interface registerServiceRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: registerServiceRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('email alredy exists');
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
