import { Inject, Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../../../domain/errors/user.errors';
import type { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../../users.di-tokens';
import type { User } from '../../../domain/entities/user.entity';
import { GetUserByIdQuery } from './get-user-by-id.query';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User> {
    const user = await this.users.findById(query.id);
    if (!user) {
      throw new UserNotFoundError(query.id);
    }
    return user;
  }
}
