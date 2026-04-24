import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../../domain/entities/user.entity';
import { UserAlreadyExistsError } from '../../../domain/errors/user.errors';
import type { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../../users.di-tokens';
import { CreateUserCommand } from './create-user.command';
import { CreateUserResult } from './create-user.result';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const normalizedEmail = command.email.trim().toLowerCase();
    const existing = await this.users.findByEmail(normalizedEmail);
    if (existing) {
      throw new UserAlreadyExistsError(normalizedEmail);
    }
    const hashedPassword = await bcrypt.hash(command.password, 12);
    const now = new Date();
    const user = new User(
      randomUUID(),
      command.tenantId,
      normalizedEmail,
      command.name.trim(),
      hashedPassword,
      false,
      true,
      command.permissions,
      now,
      now,
      command.role ?? null,
    );
    await this.users.save(user);
    return new CreateUserResult(user.id);
  }
}
