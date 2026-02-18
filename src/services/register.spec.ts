import { expect, test, it, describe } from 'vitest';
import { RegisterService } from './register.js';
import { compare } from 'bcryptjs';

describe('Register Service', () => {
  it('should hash the user password', async () => {
    const registerService = new RegisterService({
      async findByEmail(email) {
        return null;
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        };
      },
    });

    const { user } = await registerService.execute({
      name: 'john doe',
      email: 'john@gmail',
      password: '123123',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123123',
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
